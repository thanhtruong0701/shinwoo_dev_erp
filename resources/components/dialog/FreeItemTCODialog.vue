<!--
vng-201: PQH 
2020-07-06: Dialog for get data current stock
-->
<template>
<div>
  <v-dialog id="free-item-tco-dialog" max-width="1200" v-model="dialogIsShow">
      <v-card>
        <v-card-title class="headline primary-gradient white--text py-2">
          <span>{{ $t("free_item_tco") }}</span>
          <v-spacer></v-spacer>
          <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
        </v-card-title>
        <v-card-text class="pa-0">
          <v-container>
            <v-row class="pt-1" dense>
              <v-col md="3">
                <BaseSelect :label="$t('item_group')" v-model="ItemGrp.value" :lstData="dataList.lstItemGrp" item-text="NM" item-value="PK" :text_all="$t('all')" />
              </v-col>
              <v-col md="4">
                <BaseInput :label="$t('item')" v-model="Item.value" @keypress.enter="onClickButton('btnSearch')" />
              </v-col>
              <v-col md="4">
                <BaseInput :label="$t('partner')" v-model="Partner.value" @keypress.enter="onClickButton('btnSearch')" />
              </v-col>
              <v-col md="1">
                <div class="d-flex justify-center">
                  <BaseButton btn_type="icon" icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="onClickButton('btnSearch')" />
                </div>
              </v-col>
            </v-row>
            <v-row class="pt-1" dense>
              <v-col cols="12" >
                <DxDataGrid column-resizing-mode="widget" ref="grdFreeItemSearch" 
                  :allow-column-resizing="true" :column-auto-width="$vuetify.breakpoint.smAndDown" :data-source="dataGrid1" 
                  :height="limitHeightGrd1" :cache-enabled="false" :no-data-text="$t('no_data', 'common')"
                  :show-borders="true" :show-column-lines="true" :show-row-lines="true" :onRowDblClick="onRowDblClickGrd1">

                  <DxColumn data-field="TCO_ITEM_PK" :caption="$t('tco_item_pk')" dataType="number" :allow-editing="false" width="150" :visible="false" />
                  <DxColumn data-field="TCO_BUSPARTNER_PK" :caption="$t('tco_buspartner_pk')" dataType="number" :allow-editing="false" width="150" :visible="false" />
                  <DxColumn data-field="CAP_COLOR_PK" :caption="$t('cap_color_pk')" dataType="number" :allow-editing="false" width="150" :visible="false" />
                  <DxColumn data-field="BODY_COLOR_PK" :caption="$t('body_color_pk')" dataType="number" :allow-editing="false" width="150" :visible="false" />
                  <DxColumn data-field="ITEM_CODE" :caption="$t('item_code')" dataType="string" :allow-editing="false" width="150" />
                  <DxColumn data-field="ITEM_NAME" :caption="$t('item_name')" dataType="string" :allow-editing="false" width="150" />
                  <DxColumn data-field="SPEC" :caption="$t('spec')" dataType="string" :allow-editing="false" width="150" />
                  <DxColumn data-field="CUSTOMER" :caption="$t('customer')" dataType="string" :allow-editing="false" width="150" />
                  <DxColumn data-field="UOM" :caption="$t('uom')" dataType="string" :allow-editing="false" width="150" />
                  <DxColumn data-field="CAP_COLOR_CODE" :caption="$t('cap_color_code')" dataType="string" :allow-editing="false" width="150" />
                  <DxColumn data-field="CAP_COLOR_NAME" :caption="$t('cap_color_name')" dataType="string" :allow-editing="false" width="150" />
                  <DxColumn data-field="CAP_PRINT_TYPE" :caption="$t('cap_print_type')" dataType="string" :allow-editing="false" width="150" />
                  <DxColumn data-field="CAP_PRINT_COL" :caption="$t('cap_print_col')" dataType="string" :allow-editing="false" width="150" />
                  <DxColumn data-field="CAP_PRINT_COL_DESC" :caption="$t('cap_print_col_desc')" dataType="string" :allow-editing="false" width="150" />
                  <DxColumn data-field="CAP_CHAR" :caption="$t('cap_char')" dataType="string" :allow-editing="false" width="150" />
                  <DxColumn data-field="BODY_COLOR_CODE" :caption="$t('body_color_code')" dataType="string" :allow-editing="false" width="150" />
                  <DxColumn data-field="BODY_COLOR_NAME" :caption="$t('body_color_name')" dataType="string" :allow-editing="false" width="150" />
                  <DxColumn data-field="BODY_PRINT_TYPE" :caption="$t('body_print_type')" dataType="string" :allow-editing="false" width="150" />
                  <DxColumn data-field="BODY_PRINT_COL" :caption="$t('body_print_col')" dataType="string" :allow-editing="false" width="150" />
                  <DxColumn data-field="BODY_PRINT_COL_DESC" :caption="$t('body_print_col_desc')" dataType="string" :allow-editing="false" width="150" />
                  <DxColumn data-field="BODY_CHAR" :caption="$t('body_char')" dataType="string" :allow-editing="false" width="150" />
                  <DxColumn data-field="SIZE_NAME" :caption="$t('size_name')" dataType="string" :allow-editing="false" width="150" />
                  <DxColumn data-field="PARTNER_ID" :caption="$t('partner_id')" dataType="string" :allow-editing="false" width="150" />
                  <DxColumn data-field="PARTNER_NAME" :caption="$t('partner_name')" dataType="string" :allow-editing="false" width="150" />
                  <DxColumn data-field="CAP_PRINT_NAME" :caption="$t('cap_print_name')" dataType="string" :allow-editing="false" width="150" />
                  <DxColumn data-field="OLD_MAT_CODE" :caption="$t('old_mat_code')" dataType="string" :allow-editing="false" width="150" />
                  <DxColumn data-field="BLENDING_TYPE" :caption="$t('blending_type')" dataType="string" :allow-editing="false" width="150" />
                  <DxColumn data-field="PRODUCT_NAME" :caption="$t('product_name')" dataType="string" :allow-editing="false" width="150" />

                  <DxEditing mode="cell" :allow-updating="true" startEditAction="dblClick" />
                  <DxSelection mode="multiple" show-check-boxes-mode="none" />
                  <DxPaging :enabled="false"/>
                </DxDataGrid>
              </v-col>
            </v-row>
            <v-row class="pt-1" dense>
              <v-col md="12">
                <div class="d-flex justify-end">
                  <BaseButton btn_type="icon" icon_type="select" :btn_text="$t('select')" @onclick="onClickButton('btnSelectItemStock')" :disabled="isProcessing" />
                  <BaseButton btn_type="icon" icon_type="remove" :btn_text="$t('remove')" @onclick="onClickButton('btnRemoveItemStock')" :disabled="isProcessing" />
                  <BaseButton btn_type="icon" icon_type="get" :btn_text="$t('get')" @onclick="onClickButton('btnGetItemStock')" :disabled="isProcessing" />
                </div>
              </v-col>
            </v-row>
            <v-row dense align="start" justify="center">
              <v-col cols="12" >
                <DxDataGrid column-resizing-mode="widget" ref="grdFreeItemSelect" 
                  :allow-column-resizing="true" :cache-enabled="false" :column-auto-width="$vuetify.breakpoint.smAndDown" :data-source="dataGrid2" 
                  :height="limitHeightGrd2" :no-data-text="$t('no_data', 'common')"
                  :show-borders="true" :show-column-lines="true" :show-row-lines="true" :onRowDblClick="onRowDblClickGrd2" >

                  <DxColumn data-field="TCO_ITEM_PK" :caption="$t('tco_item_pk')" dataType="number" :allow-editing="false" width="150" :visible="false" />
                  <DxColumn data-field="TCO_BUSPARTNER_PK" :caption="$t('tco_buspartner_pk')" dataType="number" :allow-editing="false" width="150" :visible="false" />
                  <DxColumn data-field="CAP_COLOR_PK" :caption="$t('cap_color_pk')" dataType="number" :allow-editing="false" width="150" :visible="false" />
                  <DxColumn data-field="BODY_COLOR_PK" :caption="$t('body_color_pk')" dataType="number" :allow-editing="false" width="150" :visible="false" />
                  <DxColumn data-field="ITEM_CODE" :caption="$t('item_code')" dataType="string" :allow-editing="false" width="150" />
                  <DxColumn data-field="ITEM_NAME" :caption="$t('item_name')" dataType="string" :allow-editing="false" width="150" />
                  <DxColumn data-field="SPEC" :caption="$t('spec')" dataType="string" :allow-editing="false" width="150" />
                  <DxColumn data-field="CUSTOMER" :caption="$t('customer')" dataType="string" :allow-editing="false" width="150" />
                  <DxColumn data-field="UOM" :caption="$t('uom')" dataType="string" :allow-editing="false" width="150" />
                  <DxColumn data-field="CAP_COLOR_CODE" :caption="$t('cap_color_code')" dataType="string" :allow-editing="false" width="150" />
                  <DxColumn data-field="CAP_COLOR_NAME" :caption="$t('cap_color_name')" dataType="string" :allow-editing="false" width="150" />
                  <DxColumn data-field="CAP_PRINT_TYPE" :caption="$t('cap_print_type')" dataType="string" :allow-editing="false" width="150" />
                  <DxColumn data-field="CAP_PRINT_COL" :caption="$t('cap_print_col')" dataType="string" :allow-editing="false" width="150" />
                  <DxColumn data-field="CAP_PRINT_COL_DESC" :caption="$t('cap_print_col_desc')" dataType="string" :allow-editing="false" width="150" />
                  <DxColumn data-field="CAP_CHAR" :caption="$t('cap_char')" dataType="string" :allow-editing="false" width="150" />
                  <DxColumn data-field="BODY_COLOR_CODE" :caption="$t('body_color_code')" dataType="string" :allow-editing="false" width="150" />
                  <DxColumn data-field="BODY_COLOR_NAME" :caption="$t('body_color_name')" dataType="string" :allow-editing="false" width="150" />
                  <DxColumn data-field="BODY_PRINT_TYPE" :caption="$t('body_print_type')" dataType="string" :allow-editing="false" width="150" />
                  <DxColumn data-field="BODY_PRINT_COL" :caption="$t('body_print_col')" dataType="string" :allow-editing="false" width="150" />
                  <DxColumn data-field="BODY_PRINT_COL_DESC" :caption="$t('body_print_col_desc')" dataType="string" :allow-editing="false" width="150" />
                  <DxColumn data-field="BODY_CHAR" :caption="$t('body_char')" dataType="string" :allow-editing="false" width="150" />
                  <DxColumn data-field="SIZE_NAME" :caption="$t('size_name')" dataType="string" :allow-editing="false" width="150" />
                  <DxColumn data-field="PARTNER_ID" :caption="$t('partner_id')" dataType="string" :allow-editing="false" width="150" />
                  <DxColumn data-field="PARTNER_NAME" :caption="$t('partner_name')" dataType="string" :allow-editing="false" width="150" />
                  <DxColumn data-field="CAP_PRINT_NAME" :caption="$t('cap_print_name')" dataType="string" :allow-editing="false" width="150" />
                  <DxColumn data-field="OLD_MAT_CODE" :caption="$t('old_mat_code')" dataType="string" :allow-editing="false" width="150" />
                  <DxColumn data-field="BLENDING_TYPE" :caption="$t('blending_type')" dataType="string" :allow-editing="false" width="150" />
                  <DxColumn data-field="PRODUCT_NAME" :caption="$t('product_name')" dataType="string" :allow-editing="false" width="150" />

                  <DxEditing mode="cell" :allow-updating="true" startEditAction="dblClick" :confirmDelete="false"/>
                  <DxSelection mode="multiple" show-check-boxes-mode="none" />
                  <DxPaging :enabled="false"/>
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
  name: 'free-item-dialog',
  components: { CellGridTextField, AlertDialog},
  data: () => ({
    dialogIsShow: false,
    dataList: {lstItemGrp: []},
    ItemGrp: {value: "", disabled: false},
    Item: {value: "", disabled: false},
    Partner: {value: "", disabled: false},
    dataGrid1: [],
    dataGrid2: []
  }),
  watch: {
    dialogIsShow(val) {
      if(val === false) {
        this.$emit('onCloseDialog')
      }else{
        if(this.dataList.lstItemGrp.length==0){
          this.LG_LST_FREEITEMTCO_DIALOG();
        }
        this.dataGrid1 = [];
        this.dataGrid2 = [];
      }
    },
  },
  mounted(){
    
  },
  computed: {
    user() { return this.$store.getters["auth/user"] },
    limitHeightGrd1() { return 300 },
    limitHeightGrd2() { return 300 },
  },
  created() {
    console.log('created - paras Item Info Create 11')  
  },
  methods: {
    onClickButton(obj){
      switch(obj){
        case 'btnSearch':
          this.$refs.grdFreeItemSearch.instance.deselectAll();
          this.LG_SEL_FREEITEMTCO_DIALOG();
          break;
        case 'btnSelectItemStock':
            var arrRowSelected =  this.$refs.grdFreeItemSearch.instance.getSelectedRowsData();
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
          var arrRowSelected =  this.$refs.grdFreeItemSelect.instance.getSelectedRowsData();
          for(var i = arrRowSelected.length -1; i >= 0; i--){
              var rowIdxGrd1 = this.getPositionRow('GRID_SEARCH', arrRowSelected[i]);
              var rowIdxGrd2 = this.getPositionRow('GRID_SELECTED', arrRowSelected[i]);
              //this.dataGrid2.splice(rowIdxGrd2,1);
              this.$refs.grdFreeItemSelect.instance.deleteRow(rowIdxGrd2);
              this.$refs.grdFreeItemSelect.instance.refresh();
              this.setColorRow(false, rowIdxGrd1);
            }
          this.$refs.grdFreeItemSelect.instance.clearSelection();
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
      var rowSelected = _event.data;
      var rowIdxGrd1 = this.getPositionRow('GRID_SEARCH', rowSelected);
      if(rowIdxGrd1!=-1){
        this.setColorRow(false, rowIdxGrd1);
      }
      this.$refs.grdFreeItemSelect.instance.deleteRow(_event.dataIndex);
      this.$refs.grdFreeItemSelect.instance.refresh();
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
    async LG_SEL_FREEITEMTCO_DIALOG() {
      const dso = {
        type: 'grid',
        selpro: 'LG_SEL_FREEITEMTCO_DIALOG',
        para: [this.ItemGrp.value, this.Item.value, this.Partner.value],
      }
      this.dataGrid1 = await this._dsoCall(dso, 'select', false);
    },
    hasValueContain(value){
      if(!this._hasValue(value)){
        return "";
      }
      return value;
    },
    async LG_LST_FREEITEMTCO_DIALOG() {
      let _param = ["ITEMGRP"];
			const dso = {
        type: 'list',
        selpro: 'LG_LST_FREEITEMTCO_DIALOG',
        para: _param,
			}
			switch(_param[0]){
        case 'ITEMGRP':
          this.dataList.lstItemGrp = await this._dsoCall(dso, 'select', false);
          break;
      }
		},
    callBackData(_data) {
      this.$emit("callBackData", _data);
      this.dialogIsShow = false;
    },
  }
}
</script>
