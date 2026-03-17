<template>
  <v-container>
    <v-dialog id="get-data-so-dialog" max-width="1200" v-model="dialogIsShow">
        <v-card>
          <v-card-title class="headline primary-gradient white--text py-2">{{ $t('get_System') }}</v-card-title>
          <v-card-text class="pa-0">
            <v-container>
              <v-row dense align="start" justify="center">
                <v-col md="3" class="pt-0">
                     <v-text-field clearable dense hide-details outlined :label="$t('slip_no')" v-model="txtSlip_No"  height="10"></v-text-field>
                </v-col>

                <v-col cols="1">
                  <datePicker
                    outlined
                    :label="$t('month')"
                    :type="'month'"
                    @returnValue="month = $event"
                  ></datePicker>
                </v-col>
                <v-col cols="3">
                  <v-row align="center" justify="space-between" no-gutters>
                      <v-col md="6">
                          <datePicker
                            outlined
                            :inputValue="txtFromDate"
                            :label="$t('from')"
                            :defaultType="'startOfMonth'"
                            @returnValue="txtFromDate = $event"
                          ></datePicker>
                        </v-col>
                      <v-col md="6" class="pl-2">
                        <datePicker
                          outlined
                          :inputValue="txtToDate"
                          :label="$t('to')"
                          :defaultType="'endOfMonth'"
                          @returnValue="txtToDate = $event"
                        ></datePicker>
                      </v-col>
                    </v-row>
                </v-col>
                <v-col lg="3" cols="12">
                  <v-text-field dense hide-details outlined readonly :label="$t('customer_name')" v-model="txtCustomer_NM" height="10">
                  <v-text-field v-show="false" outlined :label="$t('customer_code', 'common')" v-model="txtCustomer_Pk"   height="10"></v-text-field>  
                      <template v-slot:append>
                      <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                          <v-icon v-on="on"  :color="currentTheme" @click="openPartnerDialog">mdi-window-restore </v-icon>
                          </template>
                          <span>{{ $t('list_partner') }}</span>
                      </v-tooltip>
                      <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                          <v-icon v-on="on"  :color="currentTheme" @click="upperBizCenterCode = '', bizCenterP_PK = ''">mdi-eraser</v-icon>
                          </template>
                          <span>{{ $t('reset_partner') }}</span>
                      </v-tooltip>
                      </template>
                  </v-text-field>
                </v-col>
                <v-col lg="2" cols="12">
                </v-col>
                <v-col lg="3" class="pt-0">
                     <v-text-field clearable dense hide-details outlined :label="$t('po_no')" v-model="txtPO_No"  height="10"></v-text-field>
                </v-col>
                 <v-col lg="4" class="pt-0">
                     <v-text-field clearable dense hide-details outlined :label="$t('item')" v-model="txtItem"  height="10"></v-text-field>
                </v-col>
                <v-col lg="5" class="pt-0">
                  <v-btn class="btn ma-1" tile dark :color="currentTheme"  @click="onClickButton('btnSearch')">
                      <v-icon>mdi-magnify</v-icon>
                    </v-btn>
                </v-col>
              </v-row>
              <v-row dense align="start" justify="center">
                <v-col cols="12"  class="pt-0">
                  <DxDataGrid column-resizing-mode="widget" ref="grdFreeItemSearch" 
                    :allow-column-resizing="true" 
                    :column-auto-width="$vuetify.breakpoint.smAndDown" 
                    :data-source="dataGrid1" 
                    :height="limitHeightGrd1"  
                    :no-data-text="$t('no_data', 'common')"
                    :show-borders="true" 
                    :show-column-lines="true" 
                    :show-row-lines="true" 
                    :onRowDblClick="onRowDblClickGrd1">
                    <DxColumn data-field="CHK"  width="50"
                                dataType="boolean" :allow-editing="true"  />
                    <DxColumn data-field="PK" :caption="$t('pk')"    :visible="false" 
                                dataType="string" :allow-editing="false" css-class="cell-align-left" />
                    <DxColumn data-field="SLIP_NO" :caption="$t('slip_no')" 
                                dataType="number" :allow-editing="false"  width="100" />
                    <DxColumn data-field="ITEM_CODE" :caption="$t('item_code')" 
                                dataType="string" :allow-editing="false" width="100" css-class="cell-align-left" />
                    <DxColumn data-field="ITEM_NAME" :caption="$t('item_name')" 
                                dataType="string" :allow-editing="false" width="200" css-class="cell-align-left" />
                    <DxColumn data-field="UOM" :caption="$t('uom')" 
                                dataType="string" :allow-editing="false" width="60" css-class="cell-align-left" />
                    <DxColumn data-field="PARTNER_LNM" :caption="$t('partner_lnm')" 
                                dataType="number" :allow-editing="false" width="80" css-class="cell-align-right" />
                    <DxColumn data-field="UNIT_PRICE" :caption="$t('unit_price')" 
                                dataType="number" :allow-editing="false" width="80" css-class="cell-align-right" />
                    <DxColumn data-field="OUTPUT_QTY" :caption="$t('output_qty')" 
                                dataType="number" :allow-editing="false" width="80" css-class="cell-align-right" />
                    <DxColumn data-field="LOAD_QTY" :caption="$t('load_qty')" 
                                dataType="string" :allow-editing="false" width="120" css-class="cell-align-left" />
                    <DxColumn data-field="DIFF" :caption="$t('diff')" 
                                dataType="number" :allow-editing="false" width="80" css-class="cell-align-left" />
                    <DxColumn data-field="INV_QTY" :caption="$t('inv_qty')" 
                                dataType="string" :allow-editing="false" width="60" css-class="cell-align-left" />
                    <DxColumn data-field="PO_NO" :caption="$t('po_no')" 
                                dataType="number" :allow-editing="false" width="80" css-class="cell-align-right" />
                    <DxColumn data-field="TCO_ITEM_PK" :caption="$t('tco_item_pk')" 
                                dataType="string" :allow-editing="false"  css-class="cell-align-left"/>
                    <DxColumn data-field="CCY" :caption="$t('ccy')" 
                                dataType="number" :allow-editing="false"  width="100"  css-class="cell-align-right" />
                    <DxColumn data-field="INV_AMOUNT" :caption="$t('inv_amount')" 
                                dataType="string" :allow-editing="false" width="80" css-class="cell-align-center"/>
                    <DxColumn data-field="TAC_ABACCTCODE_PK"  
                                dataType="number" :allow-editing="false"  :visible="false"/>
                    <DxColumn data-field="AC_CD"   width="100" 
                                dataType="number" :allow-editing="false" />
                    <DxColumn data-field="AC_NM"   width="100" 
                                dataType="number" :allow-editing="false" />
                    <DxColumn data-field="TIN_WAREHOUSE_PK" 
                                dataType="number" :allow-editing="false"  :visible="false"/>
                    <DxColumn data-field="WH_NAME"  width="100" 
                                dataType="number" :allow-editing="false" />
                    <DxColumn data-field="TAC_ABPLCENTER_PK" 
                                dataType="number" :allow-editing="false"  :visible="false"/>
                    <DxColumn data-field="PL_CD"   width="100" 
                                dataType="number" :allow-editing="false" />
                    <DxColumn data-field="PL_NM"   width="100" 
                                dataType="number" :allow-editing="false" />
                    <DxColumn data-field="TAC_MATTAKEIN_AP_PK" 
                                dataType="number" :allow-editing="false"  :visible="false"/>
                    <DxColumn data-field="STOCK_DATE"  width="100"
                                dataType="number" :allow-editing="false" />
                    <DxColumn data-field="TLG_CS_DEBITNOTE_M_PK" width="100" 
                                dataType="number" :allow-editing="false" />
                    <DxColumn data-field="YYYYMM"  width="100"
                                dataType="string" :allow-editing="false" />
                    <DxColumn data-field="DATE_FROM"  width="100"
                                dataType="date" :allow-editing="false" />
                    <DxColumn data-field="DATE_TO" width="100"
                                dataType="date" :allow-editing="false" />
                    <DxColumn data-field="AMT" width="100"
                                dataType="number" :allow-editing="false" />
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
                    <v-icon>mdi-hand</v-icon>
                  </v-btn>
                  <v-btn class="btn ma-1" tile dark color="error"  @click="onClickButton('btnRemoveItemStock')">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                  <v-btn class="btn ma-1" tile dark color="success"  @click="onClickButton('btnGetItemStock')">
                    <v-icon>mdi-check</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
              <v-row dense align="start" justify="center">
                <v-col cols="12"  class="pt-0">
                  <DxDataGrid column-resizing-mode="widget" ref="grdFreeItemSelect" 
                    :allow-column-resizing="true" :column-auto-width="$vuetify.breakpoint.smAndDown" :data-source="dataGrid2" 
                    :height="limitHeightGrd2" :no-data-text="$t('no_data', 'common')"
                    :show-borders="true" :show-column-lines="true" :show-row-lines="true" :onRowDblClick="onRowDblClickGrd2" >
                    <DxColumn data-field="CHK"  width="50"
                                dataType="boolean" :allow-editing="true"  />
                    <DxColumn data-field="PK" :caption="$t('pk')" 
                                dataType="string" :allow-editing="false" css-class="cell-align-left" />
                    <DxColumn data-field="SLIP_NO" :caption="$t('slip_no')" 
                                dataType="number" :allow-editing="false"  width="100" />
                    <DxColumn data-field="ITEM_CODE" :caption="$t('item_code')" 
                                dataType="string" :allow-editing="false" width="100" css-class="cell-align-left" />
                    <DxColumn data-field="ITEM_NAME" :caption="$t('item_name')" 
                                dataType="string" :allow-editing="false" width="200" css-class="cell-align-left" />
                    <DxColumn data-field="UOM" :caption="$t('uom')" 
                                dataType="string" :allow-editing="false" width="60" css-class="cell-align-left" />
                    <DxColumn data-field="PARTNER_LNM" :caption="$t('partner_lnm')" 
                                dataType="number" :allow-editing="false" width="80" css-class="cell-align-right" />
                    <DxColumn data-field="UNIT_PRICE" :caption="$t('unit_price')" 
                                dataType="number" :allow-editing="false" width="80" css-class="cell-align-right" />
                    <DxColumn data-field="OUTPUT_QTY" :caption="$t('output_qty')" 
                                dataType="number" :allow-editing="false" width="80" css-class="cell-align-right" />
                    <DxColumn data-field="LOAD_QTY" :caption="$t('load_qty')" 
                                dataType="string" :allow-editing="false" width="120" css-class="cell-align-left" />
                    <DxColumn data-field="DIFF" :caption="$t('diff')" 
                                dataType="number" :allow-editing="false" width="80" css-class="cell-align-left" />
                    <DxColumn data-field="INV_QTY" :caption="$t('inv_qty')" 
                                dataType="string" :allow-editing="false" width="60" css-class="cell-align-left" />
                    <DxColumn data-field="PO_NO" :caption="$t('po_no')" 
                                dataType="number" :allow-editing="false" width="80" css-class="cell-align-right" />
                    <DxColumn data-field="TCO_ITEM_PK" :caption="$t('tco_item_pk')" 
                                dataType="string" :allow-editing="false"  css-class="cell-align-left"/>
                    <DxColumn data-field="CCY" :caption="$t('ccy')" 
                                dataType="number" :allow-editing="false"  width="100"  css-class="cell-align-right" />
                    <DxColumn data-field="INV_AMOUNT" :caption="$t('inv_amount')" 
                                dataType="string" :allow-editing="false" width="80" css-class="cell-align-center"/>
                    <DxColumn data-field="TAC_ABACCTCODE_PK"  
                                dataType="number" :allow-editing="false" />
                    <DxColumn data-field="AC_CD"   width="100" 
                                dataType="number" :allow-editing="false" />
                    <DxColumn data-field="AC_NM"   width="100" 
                                dataType="number" :allow-editing="false" />
                    <DxColumn data-field="TIN_WAREHOUSE_PK" 
                                dataType="number" :allow-editing="false" />
                    <DxColumn data-field="WH_NAME"  width="100" 
                                dataType="number" :allow-editing="false" />
                    <DxColumn data-field="TAC_ABPLCENTER_PK" 
                                dataType="number" :allow-editing="false" />
                    <DxColumn data-field="PL_CD"   width="100" 
                                dataType="number" :allow-editing="false" />
                    <DxColumn data-field="PL_NM"   width="100" 
                                dataType="number" :allow-editing="false" />
                    <DxColumn data-field="TAC_MATTAKEIN_AP_PK"  
                                dataType="number" :allow-editing="false" />
                    <DxColumn data-field="STOCK_DATE" width="100"
                                dataType="number" :allow-editing="false" />
                    <DxColumn data-field="TLG_CS_DEBITNOTE_M_PK" width="100"
                                dataType="number" :allow-editing="false" />
                    <DxColumn data-field="YYYYMM" width="100"
                                dataType="string" :allow-editing="false" />
                    <DxColumn data-field="DATE_FROM" width="100"
                                dataType="date" :allow-editing="false" />
                    <DxColumn data-field="DATE_TO" width="100"
                                dataType="date" :allow-editing="false" />
                    <DxColumn data-field="AMT" width="100"
                                dataType="number" :allow-editing="false" />
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
  </v-container>
</template>
<script>
import DatePicker from '@/components/control/DatePicker';
import CellGridTextField from '@/components/table/CellGridTextField'
import AlertDialog from '@/components/dialog/AlertDialog'
import moment from "moment"
export default {
  name: 'get-data-so-dialog',
  props: ["customer"],
  components: { 
    'date-picker': DatePicker,
    CellGridTextField, 
    AlertDialog},
  data: () => ({
    txtFromDate:'',
    txtToDate:'',
    txtItem:'',
    txtPO_No:'',
    txtSlip_No:'',
    txtCustomer_Pk:'',
    txtCustomer_NM:'',
    txtCustomer_CD:'',
    dialogIsShow: false,
    dataList: {lstItemGrp: [], lstBOMLeaf: []},
    fromDateMenu: false,
    fromDate: '',
    toDateMenu: false,
    toDate: '',
    gw_BOM_Leaf: { value: "", disabled: false},
    gw_ItemGrp_PK: {value: "", disabled: false},
    gw_STItem_PK: {value: "", disabled: false},
    gw_Item: {value: "", disabled: false},
    gw_Company: {value: "", disabled: false},
    dataGrid1: [],
    dataGrid2: [],
    month:''
  }),
  watch: {
    dialogIsShow(val) {
      if(val === false) {
        this.$emit('onCloseDialog')
      }else{
        this.gw_Company.value = this.user.TCO_COMPANY_PK;
        if(this.dataList.lstItemGrp.length==0){
          this.AC_SEL_GETSO_1( [          this.gw_Company.value,
                                          this.txtSlip_No,
                                          this.txtFromDate,
                                          this.txtToDate,
                                          this.txtCustomer_Pk,
                                          this.txtPO_No,
                                          this.txtItem]);
        }
        if(this.dataList.lstBOMLeaf.length == 0){
          this.dataList.lstBOMLeaf.push({CODEKEY: "ALL", CODEDESC:"ALL"});
          this.dataList.lstBOMLeaf.push({CODEKEY: "Y", CODEDESC:"YES"});
          this.dataList.lstBOMLeaf.push({CODEKEY: "N", CODEDESC:"NO"});
          this.gw_BOM_Leaf.value = "ALL";
        }
      }
    },
    month(val) {
      console.log(val);
      if (val) {
        this.txtFromDate = val + "01";
        this.txtToDate = val + this._maxDateOfMonth(val);
      }
    },
    customer: {
      immediate: true,
    handler(val) {
      this.txtCustomer_Pk = val.PK
      this.txtCustomer_NM = val.NAME
      }
    }
  },
  mounted(){
    
  },
  
  computed: {
    user() { return this.$store.getters["auth/user"] },
    limitHeightGrd1() { return 200 },
    limitHeightGrd2() { return 200 },
  },
  methods: {
    onClickButton(obj){
      switch(obj){
        case 'btnSearch':
          this.$refs.grdFreeItemSearch.instance.deselectAll();
          this.gw_Company.value = this.user.TCO_COMPANY_PK;
          this.AC_SEL_GETSO([             this.gw_Company.value,
                                          this.txtSlip_No,
                                          this.txtFromDate,
                                          this.txtToDate,
                                          this.txtCustomer_Pk,
                                          this.txtPO_No,
                                          this.txtItem
                                          ]
                                        );
          break;
        case 'btnSelectItemStock':
            var arrRowSelected =  this.$refs.grdFreeItemSearch.instance.getSelectedRowsData();
            for (let i = 0; i < arrRowSelected.length; i++ ){
              let rowIdxGrd1 = this.getPositionRow('GRID_SEARCH', arrRowSelected[i]);
              this.dataGrid2.unshift(this.objRowSelected(arrRowSelected[i]));
              this.setColorRow(true, rowIdxGrd1);
            }
          break;
        case 'btnGetItemStock':
          this.callBackData(this.dataGrid2);
          break;
        case 'btnRemoveItemStock':
          var arrRowSelected =  this.$refs.grdFreeItemSelect.instance.getSelectedRowsData();
          for(let i = 0; i < arrRowSelected.length; i++){
              //let rowIdxGrd1 = this.getPositionRow('GRID_SEARCH', arrRowSelected[i]);
              let rowIdxGrd2 = this.getPositionRow('GRID_SELECTED', arrRowSelected[i]);
              this.dataGrid2.unshift(this.objRowSelected(arrRowSelected[i]));
              this.setColorRow(true, rowIdxGrd2);
            }
          break;
      }
    },
     formatDate(date) {
      if(!date) 
      {
          const time = new Date()
          return moment(time).format(this.curLang.DATE_FORMAT.toUpperCase())
      }
      return moment(date).format(this.curLang.DATE_FORMAT.toUpperCase())
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
        //this.$refs.grdFreeItemSearch.instance.getRowElement(idx)[0].style.backgroundColor = "#ff5252";
      }else{
       // this.$refs.grdFreeItemSearch.instance.getRowElement(idx)[0].style.backgroundColor = "";
      }
    },
    async AC_SEL_GETSO(_param) {
      const dso = {
        type: 'grid',
        selpro: 'AC_SEL_GET_O2',
        para: _param
      }
      this.dataGrid1 = await this._dsoCall(dso, 'select', false);
    },
    hasValueContain(value){
      if(!this._hasValue(value)){
        return "";
      }
      return value;
    },
    
    callBackData(_data) {
      this.$emit("callBackData", _data);
      this.dialogIsShow = false;
    },
    async AC_SEL_GETSO_1(_param) {
			const dso = {
        type: 'list',
        selpro: 'AC_SEL_GETSO_1',
        updpro: "AC_UPD_TAKEOUTD",         
        para: _param
			}
			switch(_param[0]){
        case 'ITEMGRP':
          this.dataList.lstItemGrp = await this._dsoCall(dso, 'select', false);
          this.dataList.lstItemGrp.unshift({CODEKEY: "", CODEDESC: "All"});
          if(this.dataList.lstItemGrp.length>0){
            this.gw_ItemGrp_PK.value = this.dataList.lstItemGrp[0].CODEKEY;
          }
          break;
      }
    },
   
    openPartnerDialog() {
      this.$refs.partnersDialog.dialogIsShow = true;
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
