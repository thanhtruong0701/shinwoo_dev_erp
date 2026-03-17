<template>
  <div>
    <v-dialog id="sale-order-dialog" max-width="1200" v-model="dialogIsShow">
        <v-card>
          <v-card-title class="headline primary-gradient white--text py-2">
              <span>{{ $t('po_checking') }}</span> 
              <v-spacer></v-spacer>
                <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
          </v-card-title>
          <v-card-text class="pa-0">
            <v-container>
              <v-row dense align="start" justify="center">
                <v-col lg="1" class="pt-0" align="left">
                  <v-select v-model="model_search.v_typeDate" :label="$t('date_type')" :items="dataList.lstTypeDate" item-value="CODEKEY" item-text="CODEDESC" 
                          dense cache-items hide-details  />
                </v-col>
                <v-col lg="1" md="2" class="pt-0">
                    <date-picker :label="$t('date_from')" @returnValue="model_search.v_date_from = $event"></date-picker> 
                  </v-col>
                <v-col lg="1" md="2" class="pt-0">
                    <date-picker :label="$t('date_to')" @returnValue="model_search.v_date_to = $event"></date-picker> 
                  </v-col>
                <v-col lg="2" md="3" class="pt-0">
                  <v-text-field :label="$t('no_partner')" v-model="model_search.v_partner"  clearable dense hide-details   /> 
                </v-col>
                <v-col lg="2" md="3" class="pt-0">
                  <v-text-field :label="$t('so_po_item')" v-model="model_search.v_item"  clearable dense hide-details   /> 
                </v-col>
                 <v-col lg="2" md="3" class="pt-0" align="right">
                  <v-select v-model="model_search.v_dept" :label="$t('factory_name')" :items="dataList.lstDept" item-value="CODEKEY" item-text="CODEDESC" 
                          dense cache-items hide-details  />
                </v-col>
                <v-col lg="2" md="2" class="pt-0">
                    <v-checkbox
                      dense  hide-details  class="mt-0"  :color="currentTheme"  :label="$t('gw_balance_yn')"  v-model="model_search.v_bal_yn" 
                    ></v-checkbox> 
                </v-col>
                <v-col lg="1" md="2" class="pt-0" align="right">
                  <v-btn class="btn ma-1" tile dark :color="currentTheme"  @click="onClickButton('btnSearch')">
                    <v-icon>mdi-magnify</v-icon>{{ $t('btn_search')}}
                  </v-btn>
                </v-col>
              </v-row>
              <v-row dense align="start" justify="center">
                <v-col cols="12"  class="pt-0">
                  <DxDataGrid column-resizing-mode="widget" ref="grdFreeItemSearch" 
                    :allow-column-resizing="true" :column-auto-width="$vuetify.breakpoint.smAndDown" :data-source="dataGrid1" 
                    :height="limitHeightGrd1"  :no-data-text="$t('no_data')"
                    :show-borders="true" :show-column-lines="true" :show-row-lines="true" :onRowDblClick="onRowDblClickGrd1">
            
                    <DxColumn data-field="SUPPLIER_PK" dataType="number" :allow-editing="false" :visible="false"/> 
                    <DxColumn data-field="PARTNER_ID" :caption="$t('partner_id')"  dataType="string" :allow-editing="false" width="100" css-class="cell-align-left" />
                    <DxColumn data-field="PARTNER_NAME" :caption="$t('partner_name')"  dataType="string" :allow-editing="false" width="100" css-class="cell-align-left" />
                    <DxColumn data-field="TLG_PO_PO_M_PK" dataType="number" :allow-editing="false" :visible="false"/>
                    <DxColumn data-field="PO_NO" :caption="$t('po_no')"  dataType="string" :allow-editing="false" width="100" css-class="cell-align-left" />                                    
                    <DxColumn data-field="PO_DATE" :caption="$t('po_date')"  dataType="string" :allow-editing="false" width="100" css-class="cell-align-left" />
                    <DxColumn data-field="REF_NO" :caption="$t('ref_no')"  dataType="number" :allow-editing="false" />
                    <DxColumn data-field="TLG_PO_PO_D_PK" :caption="$t('tlg_po_po_d_pk')" :visible="false"  dataType="string" :allow-editing="false" width="100" css-class="cell-align-left" />
                    <DxColumn data-field="SEQ" :caption="$t('seq')"  dataType="string" :allow-editing="false" width="200" css-class="cell-align-left" />
                    <DxColumn data-field="PO_ITEM_PK" :caption="$t('po_item_pk')" :visible="false" dataType="string" :allow-editing="false" width="60" css-class="cell-align-left" />
                    <DxColumn data-field="ITEM_CODE" :caption="$t('item_code')"   :allow-editing="false" width="80" css-class="cell-align-right" />
                    <DxColumn data-field="ITEM_NAME" :caption="$t('item_name')"  dataType="string" :allow-editing="false" width="60" css-class="cell-align-left" />
                    <DxColumn data-field="PO_UOM" :caption="$t('po_uom')"    :allow-editing="false" width="80" css-class="cell-align-right" />                        
                    <DxColumn data-field="PO_QTY" :caption="$t('po_qty')"  dataType="number" format="###,###,###.##" :allow-editing="false" width="80" css-class="cell-align-right" />
                    <DxColumn data-field="IN_QTY" :caption="$t('in_qty')"  dataType="number" format="###,###,###.##" :allow-editing="false" width="80" css-class="cell-align-right" />
                    <DxColumn data-field="RETURN_QTY" :caption="$t('return_qty')"  dataType="number" format="###,###,###.##" :allow-editing="false" width="80" css-class="cell-align-right" />
                    <DxColumn data-field="BAL_QTY" :caption="$t('bal_qty')"  dataType="number" format="###,###,###.##" :allow-editing="false" width="80" css-class="cell-align-right" /> 
                    <DxColumn data-field="UNIT_PRICE" :caption="$t('unit_price')" dataType="number" format="###,###,###.##"  :allow-editing="false" width="120" css-class="cell-align-right" />  
                    <DxColumn data-field="PO_AMT" :caption="$t('po_amt')"   dataType="number" format="###,###,###.##" :allow-editing="false" width="80" css-class="cell-align-right" />                                              
                    <DxColumn data-field="VAT_RATE" :caption="$t('vat_rate')"  dataType="number" format="###,###,###.##" :allow-editing="false" width="120" css-class="cell-align-right" />
                    <DxColumn data-field="VAT_AMOUNT" :caption="$t('vat_amount')"  dataType="number" format="###,###,###.##" :allow-editing="false" width="80" css-class="cell-align-right" />
                    <DxColumn data-field="TOTAL_AMT" :caption="$t('total_amt')" dataType="number" format="###,###,###.##" :allow-editing="false" width="60" css-class="cell-align-right"/>
                    <DxColumn data-field="PO_CCY" :caption="$t('po_ccy')"  dataType="string" :allow-editing="false" :visible="false" css-class="cell-align-left" />
                    <DxColumn data-field="ETD_FROM" :caption="$t('etd_from')" dataType="number" :allow-editing="false" />
                    <DxColumn data-field="DELI_TIME" :caption="$t('deli_time')"  :allow-editing="false" :visible="false" css-class="cell-align-left" />
                    <DxColumn data-field="PL_NM" :caption="$t('pl_name')"  :allow-editing="false" :visible="false" css-class="cell-align-left" />
                    <DxColumn data-field="TAC_ABPL_PK" :caption="$t('tac_abpl_pk')" :visible="false"  dataType="number" :allow-editing="false" css-class="cell-align-right" />
                    <DxColumn data-field="AC_NM" :caption="$t('ac_name')"   :allow-editing="false" :visible="false" css-class="cell-align-left" />
                    <DxColumn data-field="TAC_ABACCTCODE_PK" :caption="$t('tac_abacctcode_pk')"  :visible="false" dataType="number" :allow-editing="false"  css-class="cell-align-right" />
                    <DxColumn data-field="BUDGET_NM" :caption="$t('budget_name')"  :allow-editing="false" :visible="false" css-class="cell-align-left" />
                    <DxColumn data-field="TAC_ABBUDGET_PK" :caption="$t('budget_pk')" :visible="false"  :allow-editing="false"  css-class="cell-align-right" />
                    <DxColumn data-field="DESCRIPTION" :caption="$t('description')"   :allow-editing="false" :visible="false" css-class="cell-align-left" />

                    <DxEditing mode="cell" :allow-updating="true" startEditAction="dblClick" />
                    <DxSelection mode="multiple" show-check-boxes-mode="none" />
                  </DxDataGrid>
                </v-col>
              </v-row>
              <v-row dense align="start" justify="center">
                <v-col md="2" class="pt-0">
                  
                </v-col>
                <v-col md="2" class="pt-0">
                  
                </v-col>
                <v-col md="2" class="pt-0">
                  
                </v-col>
                <v-col md="2" class="pt-0">
                  
                </v-col>
                <v-col md="4" class="pt-0" align="right">
                  <v-btn class="btn ma-1" tile dark color="warning"  @click="onClickButton('btnSelectItemStock')">
                    <v-icon>mdi-hand</v-icon>{{ $t('btn_select','common')}}
                  </v-btn>
                  <v-btn class="btn ma-1" tile dark color="error"  @click="onClickButton('btnRemoveItemStock')">
                    <v-icon>mdi-delete</v-icon>{{ $t('btn_remove','common')}}
                  </v-btn>
                  <v-btn class="btn ma-1" tile dark color="success"  @click="onClickButton('btnGetItemStock')">
                    <v-icon>mdi-check</v-icon>{{ $t('btn_get','common')}}
                  </v-btn>
                </v-col>
              </v-row>
              <v-row dense align="start" justify="center">
                <v-col cols="12"  class="pt-0">
                  <DxDataGrid column-resizing-mode="widget" ref="grdFreeItemSelect" 
                    :allow-column-resizing="true" :column-auto-width="$vuetify.breakpoint.smAndDown" :data-source="dataGrid2" 
                    :height="limitHeightGrd2" :no-data-text="$t('no_data', 'common')"
                    :show-borders="true" :show-column-lines="true" :show-row-lines="true" :onRowDblClick="onRowDblClickGrd2" >

                    <DxColumn data-field="SUPPLIER_PK" dataType="number" :allow-editing="false" :visible="false"/> 
                    <DxColumn data-field="PARTNER_ID" :caption="$t('partner_id')"  dataType="string" :allow-editing="false" width="100" css-class="cell-align-left" />
                    <DxColumn data-field="PARTNER_NAME" :caption="$t('partner_name')"  dataType="string" :allow-editing="false" width="100" css-class="cell-align-left" />
                    <DxColumn data-field="TLG_PO_PO_M_PK" dataType="number" :allow-editing="false" :visible="false"/>
                    <DxColumn data-field="PO_NO" :caption="$t('po_no')"  dataType="string" :allow-editing="false" width="100" css-class="cell-align-left" />                                    
                    <DxColumn data-field="PO_DATE" :caption="$t('po_date')"  dataType="string" :allow-editing="false" width="100" css-class="cell-align-left" />
                    <DxColumn data-field="REF_NO" :caption="$t('ref_no')"  dataType="number" :allow-editing="false" />
                    <DxColumn data-field="TLG_PO_PO_D_PK" :caption="$t('tlg_po_po_d_pk')" :visible="false"  dataType="string" :allow-editing="false" width="100" css-class="cell-align-left" />
                    <DxColumn data-field="SEQ" :caption="$t('seq')"  dataType="string" :allow-editing="false" width="200" css-class="cell-align-left" />
                    <DxColumn data-field="PO_ITEM_PK" :caption="$t('po_item_pk')" :visible="false" dataType="string" :allow-editing="false" width="60" css-class="cell-align-left" />
                    <DxColumn data-field="ITEM_CODE" :caption="$t('item_code')"   :allow-editing="false" width="80" css-class="cell-align-right" />
                    <DxColumn data-field="ITEM_NAME" :caption="$t('item_name')"  dataType="string" :allow-editing="false" width="60" css-class="cell-align-left" />
                    <DxColumn data-field="PO_UOM" :caption="$t('po_uom')"    :allow-editing="false" width="80" css-class="cell-align-right" />                        
                    <DxColumn data-field="PO_QTY" :caption="$t('po_qty')"  dataType="number" format="###,###,###.##" :allow-editing="false" width="80" css-class="cell-align-right" />
                    <DxColumn data-field="IN_QTY" :caption="$t('in_qty')"  dataType="number" format="###,###,###.##" :allow-editing="false" width="80" css-class="cell-align-right" />
                    <DxColumn data-field="RETURN_QTY" :caption="$t('return_qty')"  dataType="number" format="###,###,###.##" :allow-editing="false" width="80" css-class="cell-align-right" />
                    <DxColumn data-field="BAL_QTY" :caption="$t('bal_qty')"  dataType="number" format="###,###,###.##" :allow-editing="false" width="80" css-class="cell-align-right" /> 
                    <DxColumn data-field="UNIT_PRICE" :caption="$t('unit_price')" dataType="number" format="###,###,###.##"  :allow-editing="false" width="120" css-class="cell-align-right" />  
                    <DxColumn data-field="PO_AMT" :caption="$t('po_amt')"   dataType="number" format="###,###,###.##" :allow-editing="false" width="80" css-class="cell-align-right" />                                              
                    <DxColumn data-field="VAT_RATE" :caption="$t('vat_rate')"  dataType="number" format="###,###,###.##" :allow-editing="false" width="120" css-class="cell-align-right" />
                    <DxColumn data-field="VAT_AMOUNT" :caption="$t('vat_amount')"  dataType="number" format="###,###,###.##" :allow-editing="false" width="80" css-class="cell-align-right" />
                    <DxColumn data-field="TOTAL_AMT" :caption="$t('total_amt')" dataType="number" format="###,###,###.##" :allow-editing="false" width="60" css-class="cell-align-right"/>
                    <DxColumn data-field="PO_CCY" :caption="$t('po_ccy')"  dataType="string" :allow-editing="false" :visible="false" css-class="cell-align-left" />
                    <DxColumn data-field="ETD_FROM" :caption="$t('etd_from')" dataType="number" :allow-editing="false" />
                    <DxColumn data-field="DELI_TIME" :caption="$t('deli_time')"  :allow-editing="false" :visible="false" css-class="cell-align-left" />
                    <DxColumn data-field="PL_NM" :caption="$t('pl_name')"  :allow-editing="false" :visible="false" css-class="cell-align-left" />
                    <DxColumn data-field="TAC_ABPL_PK" :caption="$t('tac_abpl_pk')" :visible="false"  dataType="number" :allow-editing="false" css-class="cell-align-right" />
                    <DxColumn data-field="AC_NM" :caption="$t('ac_name')"   :allow-editing="false" :visible="false" css-class="cell-align-left" />
                    <DxColumn data-field="TAC_ABACCTCODE_PK" :caption="$t('tac_abacctcode_pk')"  :visible="false" dataType="number" :allow-editing="false"  css-class="cell-align-right" />
                    <DxColumn data-field="BUDGET_NM" :caption="$t('budget_name')"  :allow-editing="false" :visible="false" css-class="cell-align-left" />
                    <DxColumn data-field="TAC_ABBUDGET_PK" :caption="$t('budget_pk')" :visible="false"  :allow-editing="false"  css-class="cell-align-right" />
                    <DxColumn data-field="DESCRIPTION" :caption="$t('description')"   :allow-editing="false" :visible="false" css-class="cell-align-left" />

                    <DxEditing mode="cell" :allow-updating="true" startEditAction="dblClick" />
                    <DxSelection mode="multiple" show-check-boxes-mode="none" />
                  </DxDataGrid>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
        </v-card>
      </v-dialog>
        <alert-dialog ref="alertDialog"></alert-dialog>
  </div>
</template>

<script>
import CellGridTextField from '@/components/table/CellGridTextField' 
import AlertDialog from '@/components/dialog/AlertDialog'
export default {
  name: 'free-item-ei-dialog',
  components: { CellGridTextField, AlertDialog,
  DatePicker: () => import("@/components/control/DatePicker")
  },
  data: () => ({
    dialogIsShow: false,
    dataList: {lstTypeDate: [],lstDept: []},
    model_search : {v_typeDate: "",v_dept: "",v_partner:"",v_date_from:"",v_date_to:"", v_item: "", v_bal_yn: "Y"},
    dataGrid1: [],
    dataGrid2: []
  }),
  watch: {
    dialogIsShow(val) {
        if(val === true) {
           // console.log("popup");
              //this.LG_LST_4080010_LISTBOX(["FACTORY","",this.user.PK]);  
        }
    },
  },
 
  mounted() {
    this.LG_LST_4080010_LISTBOX(["TYPE_DATE_SEARCH","",""]);  
    this.LG_LST_4080010_LISTBOX(["DEPARTMENT","",""]);
  },

  computed: {
    user() { return this.$store.getters["auth/user"] },
    limitHeightGrd1() { return 300 },
    limitHeightGrd2() { return 300 },
  },
  methods: {
    onClickButton(obj){
      switch(obj){
        case 'btnSearch':
          this.$refs.grdFreeItemSearch.instance.deselectAll();
          this.AC_SEL_SALE_ORDER_DIALOG_1([this.model_search.v_typeDate,this.model_search.v_date_from , this.model_search.v_date_to, this.model_search.v_partner, 
                                          this.model_search.v_item,this.model_search.v_bal_yn? 'Y' : 'N',this.model_search.v_dept]);
          break;
        case 'btnSelectItemStock':
            var arrRowSelected =  this.$refs.grdFreeItemSearch.instance.getSelectedRowsData();
            for(let i = 0; i < arrRowSelected.length; i++){
                if(!this.isExists(arrRowSelected[i])){
                  let rowIdxGrd1 = this.getPositionRow('GRID_SEARCH', arrRowSelected[i]);
                  this.dataGrid2.unshift(this.objRowSelected(arrRowSelected[i]));
                  this.setColorRow(true, rowIdxGrd1);
                }
              // let rowIdxGrd1 = this.getPositionRow('GRID_SEARCH', arrRowSelected[i]);
              // this.dataGrid2.unshift(this.objRowSelected(arrRowSelected[i]));
              // this.setColorRow(true, rowIdxGrd1);
            }
          break;
        case 'btnGetItemStock':
          this.callBackData(this.dataGrid2);
          break;
        case 'btnRemoveItemStock':
          var arrRowSelected =  this.$refs.grdFreeItemSelect.instance.getSelectedRowsData();
          for(let i = 0; i < arrRowSelected.length; i++){

              let rowIdxGrd1 = this.getPositionRow('GRID_SEARCH', arrRowSelected[i]);
              let rowIdxGrd2 = this.getPositionRow('GRID_SELECTED', arrRowSelected[i]);
              this.$refs.grdFreeItemSelect.instance.deleteRow(rowIdxGrd2);
              this.$refs.grdFreeItemSelect.instance.refresh();
              this.setColorRow(false, rowIdxGrd1);
            }
          break;
      }
    },
    onRowDblClickGrd1(_event){
      if(!this.isExists(_event.data)){
        this.dataGrid2.unshift(this.objRowSelected(_event.data));
        this.setColorRow(true, _event.dataIndex);
      }
    },
    onRowDblClickGrd2(_event){
      let rowSelected = _event.data;
      let rowIdxGrd1 = this.getPositionRow('GRID_SEARCH', rowSelected);
      if(rowIdxGrd1!=-1){
        this.setColorRow(false, rowIdxGrd1);
      }
      this.dataGrid2.splice(_event.dataIndex,1);
    },
    getPositionRow(_Grid, _data){
      var rowIdx = -1;
      if(_Grid == "GRID_SEARCH"){
        rowIdx = this.$refs.grdFreeItemSearch.instance.getRowIndexByKey(_data);
      }else if(_Grid == "GRID_SELECTED"){
        rowIdx = this.$refs.grdFreeItemSelect.instance.getRowIndexByKey(_data);
      }
      return rowIdx;
    },
    objRowSelected(rowData){
      let rowSelected = {};
      let lstColumn = Object.keys(rowData);
      for(let i = 0; i< lstColumn.length; i++){
        rowSelected[lstColumn[i]] = rowData[lstColumn[i]];
      }
      return rowSelected;
    },
    isExists(rowSelected){
      let rowIdx = this.getPositionRow('GRID_SELECTED', rowSelected);
      if(rowIdx != -1){
        this.$refs.alertDialog.showAlert("error", "Error", "DUPLICATE_DATA");
        return true;
      }
      return false;
    },
    setColorRow(isMarked, idx) {
      if(isMarked){
        this.$refs.grdFreeItemSearch.instance.getRowElement(idx)[0].style.backgroundColor = "#ff5252";
      }else{
        this.$refs.grdFreeItemSearch.instance.getRowElement(idx)[0].style.backgroundColor = "";
      }
    },
    async AC_SEL_SALE_ORDER_DIALOG_1(_param) {
      const dso = {
        type: 'grid',
        selpro: 'LG_SEL_5030021_PO1_1',
        para: _param
      }
      this.dataGrid1 = await this._dsoCall(dso, 'select', false);
    },
    /*hasValueContain(value){
      if(!this._hasValue(value)){
        return "";
      }
      return value;
    },*/
  
    callBackData(_data) {
      this.$emit("callBackData", _data);
      this.dialogIsShow = false;
    },
   /*list load data listbox: */
		async LG_LST_4080010_LISTBOX(_param) {
			const dso = {
        type: 'list',
        selpro: 'LG_LST_4080010',
        para: _param
			}
			switch(_param[0]){
        case "TYPE_DATE_SEARCH":  
          this.dataList.lstTypeDate = await this._dsoCall(dso, 'select', false);
          //this.dataList.lstTypeDate.unshift({CODEKEY: "", CODEDESC: "All"});
          this.dataList.lstTypeDate.length > 0
          {
            this.model_search.v_typeDate = this.dataList.lstTypeDate[0]["CODEKEY"] ;
          }
          
          //this.model_Right.IN_WH_PK = "";
          break;
        case "DEPARTMENT":
          this.dataList.lstDept = await this._dsoCall(dso, 'select', false);
          //this.dataList.lstTypeDate.unshift({CODEKEY: "", CODEDESC: "All"});
          this.model_search.v_dept = "";
          //this.model_Right.IN_WH_PK = "";
          break;
      }
    },
  }
}
</script>

<style>
  .btn{
    min-width: 100px;
    min-height: 30px;
    max-width: 100px;
    max-height: 30px;
  }
</style>
