<!--
vng-201: PQH 
2020-07-06: Dialog for get data current stock
-->
<template>
<v-container>
  <v-dialog id="current-stock-dialog" max-width="1300" v-model="dialogIsShow">
      <v-card>
        <v-card-title class="headline primary-gradient white--text py-2">
          <span>{{ $t("current_stock") }}</span>
          <v-spacer></v-spacer>
          <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
        </v-card-title>
        <v-card-text class="pa-0">
          <v-container>
            <v-row dense align="start" justify="center">
              <v-col md="2" class="pt-0" align="right">
                <v-menu ref="menuDate" :close-on-content-click="true" :return-value.sync="gw_StockDate.value" :disabled="gw_StockDate.disabled"
                      transition="scale-transition" offset-y max-width="290px" min-width="290px">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field v-model="gw_StockDate.value" :label="$t('stock_date')" 
                                readonly hide-details outlined dense v-bind="attrs" v-on="on" ></v-text-field>
                </template>
                <v-date-picker v-model="gw_StockDate.value" type="date" no-title scrollable  @input="$refs.menuDate.save(gw_StockDate.value)" ></v-date-picker>
              </v-menu>
              </v-col>
              <v-col md="2" class="pt-0">
                <v-select v-model="gw_Wh.value" :label="$t('warehouse','common')" :items="dataList.lstWH" item-value="CODEKEY" item-text="CODEDESC" 
                        :disabled="gw_Wh.disabled" dense cache-items hide-details outlined />
              </v-col>
              <v-col md="2" class="pt-0">
                <v-select v-model="gw_ItemGrp_PK.value" :label="$t('item_group','common')" :items="dataList.lstItemGrp" item-value="CODEKEY" item-text="CODEDESC" 
                        dense cache-items hide-details outlined />
              </v-col>
              <v-col md="2" class="pt-0" v-if="showPONo">
                <v-text-field :label="$t('po_no','common')" v-model="gw_PONo.value" :disabled="gw_PONo.disabled" clearable dense hide-details outlined  />
              </v-col>
              <v-col md="2" class="pt-0">
                <v-text-field :label="$t('lot_no','common')" v-model="gw_LotNo.value" :disabled="gw_LotNo.disabled" clearable dense hide-details outlined  />
              </v-col>
              <v-col md="2" class="pt-0">
                <v-text-field :label="$t('item','common')" v-model="gw_Item.value" :disabled="gw_Item.disabled" clearable dense hide-details outlined @keypress="onKey01"  />
              </v-col>
							<v-col md="2" class="pt-0" align="right" v-if="!showPONo">
                <v-row justify="end" class="mr-1">                   
                   <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="onClickButton('btnSearch')"/>                             
                 </v-row> 
              </v-col>
            </v-row>
            <v-row dense align="start" justify="center" v-if="showPONo">
              <v-col md="10" class="pt-0">
              </v-col>
              <v-col md="2" class="pt-0" align="right">
                <v-row justify="end" class="mr-1">                   
                   <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="onClickButton('btnSearch')"/>                             
                 </v-row> 
              </v-col>
            </v-row>
            <v-row dense align="start" justify="center">
              <v-col cols="12"  class="pt-0">
                <DxDataGrid column-resizing-mode="widget" ref="grdStockSearch" 
                  :allow-column-resizing="true" :column-auto-width="$vuetify.breakpoint.smAndDown" :data-source="dataGrid1" 
                  :height="limitHeightGrd1"  :no-data-text="$t('no_data', 'common')"
                  :show-borders="true" :show-column-lines="true" :show-row-lines="true" :onRowDblClick="onRowDblClickGrd1">

                  <DxColumn data-field="WH_NAME"  :caption="$t('wh_name','common')" 
                              dataType="string" :allow-editing="false" width="120" css-class="cell-align-left" />
                  <DxColumn data-field="TLG_IT_ITEM_PK" 
                              dataType="number" :allow-editing="false" :visible="false"/>
                  <DxColumn data-field="ITEM_CODE" :caption="$t('item_code','common')" 
                              dataType="string" :allow-editing="false" width="100" css-class="cell-align-left" />
                  <DxColumn data-field="ITEM_NAME" :caption="$t('item_accnm','common')" 
                              dataType="string" :allow-editing="false" width="150" css-class="cell-align-left" />
                  <DxColumn data-field="PO_NO" :caption="$t('po_no','common')" 
                              dataType="string" :allow-editing="false" width="120" css-class="cell-align-left" />
                  <DxColumn data-field="LOT_NO" :caption="$t('lot_no','common')" 
                              dataType="string" :allow-editing="false" width="80" css-class="cell-align-left" />
                  <DxColumn data-field="GRADE" :caption="$t('grade','common')" 
                              dataType="string" :allow-editing="false" width="60" css-class="cell-align-left" />
                  <DxColumn data-field="STOCK_QTY" :caption="$t('qty','common')" 
                              dataType="number" format="###,###,###.##" :allow-editing="false" width="80" css-class="cell-align-right" />
                  <DxColumn data-field="UOM" :caption="$t('uom','common')" 
                              dataType="string" :allow-editing="false" width="60" css-class="cell-align-left" />
                  <DxColumn data-field="REF_QTY" :caption="$t('ref_qty','common')" 
                              dataType="number" format="###,###,###.##" :allow-editing="false" width="80" css-class="cell-align-right" />
                  <DxColumn data-field="REF_UOM" :caption="$t('ref_uom','common')" 
                              dataType="string" :allow-editing="false" width="60" css-class="cell-align-left" />
                  <DxColumn data-field="REF_QTY_2" :caption="$t('ref_qty_2','common')" 
                              dataType="number" format="###,###,###.##" :allow-editing="false" width="80" css-class="cell-align-right" />
                  <DxColumn data-field="REF_UOM_2" :caption="$t('ref_uom_2','common')" 
                              dataType="string" :allow-editing="false" width="60" css-class="cell-align-left"/>
                  <DxColumn data-field="TLG_IN_WHLOC_PK" 
                              dataType="number" :allow-editing="false" :visible="false"/>
                  <DxColumn data-field="LOC_NAME" :caption="$t('location','common')" 
                              dataType="string" :allow-editing="false" width="150" css-class="cell-align-left"/>

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
                <v-row justify="end" class="mr-1">                   
                   <BaseButton icon_type="down" :btn_text="$t('select')" :disabled="isProcessing" @onclick="onClickButton('btnSelectItemStock')"/>
                   <BaseButton icon_type="delete" :btn_text="$t('remove')" :disabled="isProcessing" @onclick="onClickButton('btnRemoveItemStock')"/>
                   <BaseButton icon_type="select" :btn_text="$t('get')" :disabled="isProcessing" @onclick="onClickButton('btnGetItemStock')"/>
                </v-row> 
              </v-col>
            </v-row>
            <v-row dense align="start" justify="center">
              <v-col cols="12"  class="pt-0">
                <DxDataGrid column-resizing-mode="widget" ref="grdStockSelect" 
                  :allow-column-resizing="true" :column-auto-width="$vuetify.breakpoint.smAndDown" :data-source="dataGrid2" 
                  :height="limitHeightGrd2" :no-data-text="$t('no_data', 'common')"
                  :show-borders="true" :show-column-lines="true" :show-row-lines="true" :onRowDblClick="onRowDblClickGrd2" >

                  <DxColumn data-field="WH_NAME"  :caption="$t('wh_name','common')" 
                              dataType="string" :allow-editing="false" width="120" css-class="cell-align-left" />
                  <DxColumn data-field="TLG_IT_ITEM_PK" 
                              dataType="number" :allow-editing="false" :visible="false"/>
                  <DxColumn data-field="ITEM_CODE" :caption="$t('item_code','common')" 
                              dataType="string" :allow-editing="false" width="100" css-class="cell-align-left" />
                  <DxColumn data-field="ITEM_NAME" :caption="$t('item_accnm','common')" 
                              dataType="string" :allow-editing="false" width="150" css-class="cell-align-left" />
                  <DxColumn data-field="PO_NO" :caption="$t('po_no','common')" 
                              dataType="string" :allow-editing="false" width="120" css-class="cell-align-left" />
                  <DxColumn data-field="LOT_NO" :caption="$t('lot_no','common')"
                              dataType="string" :allow-editing="false" width="80" css-class="cell-align-left" />
                  <DxColumn data-field="GRADE" :caption="$t('grade','common')" 
                              dataType="string" :allow-editing="false" width="60" css-class="cell-align-left" />
                  <DxColumn data-field="STOCK_QTY" :caption="$t('qty','common')" 
                              dataType="number" format="###,###,###.##" :allow-editing="false" width="80" css-class="cell-align-right" />
                  <DxColumn data-field="UOM" :caption="$t('uom','common')" 
                              dataType="string" :allow-editing="false" width="60" css-class="cell-align-center" />
                  <DxColumn data-field="REF_QTY" :caption="$t('ref_qty','common')" 
                              dataType="number" format="###,###,###.##" :allow-editing="false" width="80" css-class="cell-align-right" />
                  <DxColumn data-field="REF_UOM" :caption="$t('ref_uom','common')" 
                              dataType="string" :allow-editing="false" width="60" css-class="cell-align-left" />
                  <DxColumn data-field="REF_QTY_2" :caption="$t('ref_qty_2','common')" 
                              dataType="number" format="###,###,###.##" :allow-editing="false" width="80" css-class="cell-align-right" />
                  <DxColumn data-field="REF_UOM_2" :caption="$t('ref_uom_2','common')" 
                              dataType="string" :allow-editing="false" width="60" css-class="cell-align-left" />
                  <DxColumn data-field="TLG_IN_WHLOC_PK" 
                              dataType="number" :allow-editing="false" :visible="false"/>
                  <DxColumn data-field="LOC_NAME" :caption="$t('location','common')" 
                              dataType="string" :allow-editing="false" width="150" css-class="cell-align-left" />

                  <DxEditing mode="cell" :allow-updating="true" startEditAction="dblClick" :confirmDelete="false"/>
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
import CellGridTextField from '@/components/table/CellGridTextField'
import AlertDialog from '@/components/dialog/AlertDialog'
export default {
  name: 'current-stock-dialog',
  components: { CellGridTextField, AlertDialog},
  data: () => ({
		showPONo: true,
    dialogIsShow: false,
    dataList: {lstWH: [], lstItemGrp: []},

    gw_StockDate: { value: "", disabled: false},
    gw_Wh: { value: "", disabled: false},
    gw_ItemGrp_PK: {value: "", disabled: false},
    gw_PONo: {value: "", disabled: false},
    gw_LotNo: {value: "", disabled: false},
    gw_Item: {value: "", disabled: false},
    gw_Company: {value: "", disabled: false},
    dataGrid1: [],
    dataGrid2: []
  }),
  watch: {
    dialogIsShow(val) {
      if(val === false) {
        this.$emit('onCloseDialog')
      }else{
        this.gw_StockDate.value = this._CurrentDate('-');
        this.gw_Company.value = this.user.TCO_COMPANY_PK;
        if(this.dataList.lstItemGrp.length==0){
          this.LG_LST_CURRENT_STOCK_DIALOG( ["ITEMGRP",this.gw_Company.value, this.user.PK,'']);
        }
      }
    },
  },

  created() {
		this.LG_LST_CURRENT_STOCK_DIALOG( ["WH",this.gw_Company.value, this.user.PK,'']);
		this.checkSite()
  },

  mounted(){
   // this.LG_LST_CURRENT_STOCK_DIALOG( ["WH",this.gw_Company.value, this.user.PK,'']);
    
    
  },
  computed: {
    user() { return this.$store.getters["auth/user"] },
    limitHeightGrd1() { return 300 },
    limitHeightGrd2() { return 300 },
  },
  methods: {
		async checkSite(){
			const dso = {
				type: "list",
				selpro: "LG_RPT_BASIC_INFO_3",
				para: [this.user.USER_ID, this.user.TCO_COMPANY_PK],
			};
			const result = await this._dsoCall(dso, "select", false);
			if (result.length > 0) {
				if (result[0].PARTNER_NAME.indexOf('LOTTE GLOBAL LOGISTICS') == 13) {
					this.typeSite = "LGL"
				};
				if (result[0].PARTNER_NAME.indexOf('KPX') == 0) {
					this.typeSite = "KPX"
				};
				if (result[0].PARTNER_NAME.indexOf('OT MOTOR') == 0) {
					this.typeSite = "OT MOTOR"
				};
				if (result[0].PARTNER_NAME.indexOf('ILSHIN') > -1) {
					this.typeSite = "ILSHIN"
				};
				if (result[0].PARTNER_NAME.indexOf('WEBCASH GENUWIN') > -1) {
					this.typeSite = "WEBCASH"
				};
				if (result[0].PARTNER_NAME.indexOf('SAMBU') == 13) {
					this.typeSite = "SAMBU"
				};
			}
		},
    onKey01(e){
      if(e.keyCode == 13){
        this.onClickButton('btnSearch')
      }
    },
    onClickButton(obj){
      switch(obj){
        case 'btnSearch':
          
          this.$refs.grdStockSearch.instance.deselectAll();
          this.LG_SEL_CURRENT_STOCK_DIALOG([this.gw_Wh.value, this.gw_ItemGrp_PK.value, this.gw_Item.value, this.gw_LotNo.value,
                                        this.gw_PONo.value, this.gw_Company.value, this.gw_StockDate.value.replace(/-/g,"")]);
          break;
        case 'btnSelectItemStock':
            var arrRowSelected =  this.$refs.grdStockSearch.instance.getSelectedRowsData();
            for(var i = 0; i < arrRowSelected.length; i++){
              if(!this.isExists(arrRowSelected[i])){
                var rowIdxGrd1 = this.getPositionRow('GRID_SEARCH', arrRowSelected[i]);
                this.dataGrid2.unshift(arrRowSelected[i]);
                this.setColorRow(true, rowIdxGrd1);
              }else{
                break;
              }
              
            }
          break;
        case 'btnGetItemStock':
          this.callBackData(this.dataGrid2);
          break;
        case 'btnRemoveItemStock':
          var arrRowSelected =  this.$refs.grdStockSelect.instance.getSelectedRowsData();
          for(var i = arrRowSelected.length -1; i >= 0; i--){
              var rowIdxGrd1 = this.getPositionRow('GRID_SEARCH', arrRowSelected[i]);
              var rowIdxGrd2 = this.getPositionRow('GRID_SELECTED', arrRowSelected[i]);
              //this.dataGrid2.splice(rowIdxGrd2,1);
              this.$refs.grdStockSelect.instance.deleteRow(rowIdxGrd2);
              this.$refs.grdStockSelect.instance.refresh();
              this.setColorRow(false, rowIdxGrd1);
            }
          this.$refs.grdStockSelect.instance.clearSelection();
          break;
      }
    },
    onRowDblClickGrd1(_event){
      if(!this.isExists(_event.data)){
        this.dataGrid2.unshift(_event.data);
        this.setColorRow(true, _event.dataIndex);
      }
    },
    onRowDblClickGrd2(_event){
      var rowSelected = _event.data;
      var rowIdxGrd1 = this.getPositionRow('GRID_SEARCH', rowSelected);
      if(rowIdxGrd1!=-1){
        this.setColorRow(false, rowIdxGrd1);
      }
      this.$refs.grdStockSelect.instance.deleteRow(_event.dataIndex);
      this.$refs.grdStockSelect.instance.refresh();
      //this.dataGrid2.splice(_event.dataIndex,1);
    },
    getPositionRow(_Grid, _data){
      var rowIdx = -1;
      if(_Grid == "GRID_SEARCH"){
        rowIdx = this.$refs.grdStockSearch.instance.getRowIndexByKey(_data);
        /*rowIdx = this.$refs.grdStockSearch.instance.getDataSource()._items.findIndex(e => e.TLG_IN_WAREHOUSE_PK == _data.TLG_IN_WAREHOUSE_PK 
                                        && e.TLG_IT_ITEM_PK == _data.TLG_IT_ITEM_PK
                                        && e.TLG_IN_WHLOC_PK == _data.TLG_IN_WHLOC_PK
                                        && this.hasValueContain(e.PO_NO) == this.hasValueContain(_data.PO_NO) 
                                        && this.hasValueContain(e.LOT_NO) == this.hasValueContain(_data.LOT_NO) 
                                        && this.hasValueContain(e.GRADE) == this.hasValueContain(_data.GRADE));*/
      }else if(_Grid == "GRID_SELECTED"){
        rowIdx = this.$refs.grdStockSelect.instance.getRowIndexByKey(_data);
        /*rowIdx = this.$refs.grdStockSearch.instance.getDataSource()._items.findIndex(e => e.TLG_IN_WAREHOUSE_PK == _data.TLG_IN_WAREHOUSE_PK && e.TLG_IT_ITEM_PK == _data.TLG_IT_ITEM_PK
                                        && e.TLG_IN_WHLOC_PK == _data.TLG_IN_WHLOC_PK
                                        && this.hasValueContain(e.PO_NO) == this.hasValueContain(_data.PO_NO) 
                                        && this.hasValueContain(e.LOT_NO) == this.hasValueContain(_data.LOT_NO)
                                        && this.hasValueContain(e.GRADE) == this.hasValueContain(_data.GRADE));*/
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
        this.$refs.grdStockSearch.instance.getRowElement(idx)[0].style.backgroundColor = "#ff5252";
      }else{
        this.$refs.grdStockSearch.instance.getRowElement(idx)[0].style.backgroundColor = "";
      }
    },
    async LG_SEL_CURRENT_STOCK_DIALOG(_param) {
      const dso = {
        type: 'grid',
        selpro: 'LG_SEL_CURRENT_STOCK_DIALOG',
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
      //this.dataGrid1 = [];
      //this.dataGrid2 = [];
    },
    async LG_LST_CURRENT_STOCK_DIALOG(_param) {
			const dso = {
        type: 'list',
        selpro: 'LG_LST_CURRENT_STOCK_DIALOG',
        para: _param
			}
			switch(_param[0]){
        case "WH":
          this.dataList.lstWH = await this._dsoCall(dso, 'select', false);
          this.dataList.lstWH.unshift({CODEKEY: "", CODEDESC: "All"});
          if(this.dataList.lstWH.length>0){
            this.gw_Wh.value = this.dataList.lstWH[0].CODEKEY;
          }
        break;
        case 'ITEMGRP':
          this.dataList.lstItemGrp = await this._dsoCall(dso, 'select', false);
          this.dataList.lstItemGrp.unshift({CODEKEY: "", CODEDESC: "All"});
          if(this.dataList.lstItemGrp.length>0){
            this.gw_ItemGrp_PK.value = this.dataList.lstItemGrp[0].CODEKEY;
          }
          break;
      }
		},
  }
}
</script>
