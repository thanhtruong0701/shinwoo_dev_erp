<template>
  <div>
    <v-dialog id="free-item-ei-dialog" max-width="1200" v-model="dialogIsShow">
        <v-card>
          <v-card-title class="headline primary-gradient white--text py-2">{{ $t('free_item','common') }}</v-card-title>
          <v-card-text class="pa-0">
            <v-container>
              <v-row dense align="start" justify="center">
                <v-col md="3" class="pt-0" align="right">
                  <v-select v-model="gw_ItemGrp_PK.value" :label="$t('item_group','common')" :items="dataList.lstItemGrp" item-value="CODEKEY" item-text="CODEDESC" 
                          dense cache-items hide-details outlined />
                </v-col>
                <v-col md="3" class="pt-0">
                  <v-text-field :label="$t('item_accnm','common')" v-model="gw_Item.value" :disabled="gw_Item.disabled" clearable dense hide-details outlined  />
                </v-col>
                <v-col md="2" class="pt-0">
                  <v-select v-model="gw_BOM_Leaf.value" :label="$t('bom_leaf_yn','common')" :items="dataList.lstBOMLeaf" item-value="CODEKEY" item-text="CODEDESC" 
                          dense cache-items hide-details outlined />
                </v-col>
                <v-col md="2" class="pt-0">
                  
                </v-col>
                <v-col md="2" class="pt-0" align="right">
                  <v-btn class="btn ma-1" tile dark :color="currentTheme"  @click="onClickButton('btnSearch')">
                    <v-icon>mdi-magnify</v-icon>{{ $t('btn_search','common')}}
                  </v-btn>
                </v-col>
              </v-row>
              <v-row dense align="start" justify="center">
                <v-col cols="12"  class="pt-0">
                  <DxDataGrid column-resizing-mode="widget" ref="grdFreeItemSearch" 
                    :allow-column-resizing="true" :column-auto-width="$vuetify.breakpoint.smAndDown" :data-source="dataGrid1" 
                    :height="limitHeightGrd1"  :no-data-text="$t('no_data', 'common')"
                    :show-borders="true" :show-column-lines="true" :show-row-lines="true" :onRowDblClick="onRowDblClickGrd1">

                    <DxColumn data-field="TLG_IT_ITEMGRP_PK" 
                                dataType="number" :allow-editing="false" :visible="false"/>
                    <DxColumn data-field="ITEMGRP_NAME" :caption="$t('item_group','common')" 
                                dataType="string" :allow-editing="false" width="100" css-class="cell-align-left" />
                    <DxColumn data-field="TLG_IT_ITEM_PK" 
                                dataType="number" :allow-editing="false" :visible="false"/>
                    <DxColumn data-field="ITEM_CODE" :caption="$t('item_code','common')" 
                                dataType="string" :allow-editing="false" width="100" css-class="cell-align-left" />
                    <DxColumn data-field="ITEM_NAME" :caption="$t('item_accnm','common')" 
                                dataType="string" :allow-editing="false" width="200" css-class="cell-align-left" />
                    <DxColumn data-field="UOM" :caption="$t('uom','common')" 
                                dataType="string" :allow-editing="false" width="60" css-class="cell-align-left" />
                    <DxColumn data-field="PUR_PRICE" :caption="$t('pur_price','common')" 
                                dataType="number" format="###,###,###.##" :allow-editing="false" width="80" css-class="cell-align-right" />
                    <DxColumn data-field="SALE_PRICE" :caption="$t('sale_price','common')" 
                                dataType="number" format="###,###,###.##" :allow-editing="false" width="80" css-class="cell-align-right" />
                    <DxColumn data-field="PROD_PRICE" :caption="$t('prod_price','common')" 
                                dataType="number" format="###,###,###.##" :allow-editing="false" width="80" css-class="cell-align-right" />
                    <DxColumn data-field="DESCRIPTION" :caption="$t('description','common')" 
                                dataType="string" :allow-editing="false" width="120" css-class="cell-align-left" />
                    <DxColumn data-field="F_SEQ" :caption="$t('f_seq','common')" 
                                dataType="number" format="###,###,###.##" :allow-editing="false" width="80" css-class="cell-align-left" />
                    <DxColumn data-field="REF_UOM" :caption="$t('ref_uom','common')" 
                                dataType="string" :allow-editing="false" width="60" css-class="cell-align-left" />
                    <DxColumn data-field="QTY_U1" :caption="$t('ref_qty','common')" 
                                dataType="number" format="###,###,###.##" :allow-editing="false" width="80" css-class="cell-align-right" />
                    <DxColumn data-field="REF_UOM_2" :caption="$t('ref_uom_2','common')" 
                                dataType="string" :allow-editing="false" width="60" css-class="cell-align-left"/>
                    <DxColumn data-field="QTY_U2" :caption="$t('ref_qty_2','common')" 
                                dataType="number" :allow-editing="false" :visible="false" css-class="cell-align-right" />
                    <DxColumn data-field="BOM_LEAF_YN" :caption="$t('bom_leaf_yn','common')" 
                                dataType="boolean" :allow-editing="false" width="80" css-class="cell-align-center"/>
                    <DxColumn data-field="TCO_COMPANY_PK" 
                                dataType="number" :allow-editing="false" :visible="false"/>

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

                    <DxColumn data-field="TLG_IT_ITEMGRP_PK" 
                                dataType="number" :allow-editing="false" :visible="false"/>
                    <DxColumn data-field="ITEMGRP_NAME" :caption="$t('item_group','common')" 
                                dataType="string" :allow-editing="false" width="100" css-class="cell-align-left" />
                    <DxColumn data-field="TLG_IT_ITEM_PK" 
                                dataType="number" :allow-editing="false" :visible="false"/>
                    <DxColumn data-field="ITEM_CODE" :caption="$t('item_code','common')" 
                                dataType="string" :allow-editing="false" width="100" css-class="cell-align-left" />
                    <DxColumn data-field="ITEM_NAME" :caption="$t('item_accnm','common')" 
                                dataType="string" :allow-editing="false" width="200" css-class="cell-align-left" />
                    <DxColumn data-field="UOM" :caption="$t('uom','common')" 
                                dataType="string" :allow-editing="false" width="60" css-class="cell-align-left" />
                    <DxColumn data-field="PUR_PRICE" :caption="$t('pur_price','common')" 
                                dataType="number" format="###,###,###.##" :allow-editing="false" width="80" css-class="cell-align-right" />
                    <DxColumn data-field="SALE_PRICE" :caption="$t('sale_price','common')" 
                                dataType="number" format="###,###,###.##" :allow-editing="false" width="80" css-class="cell-align-right" />
                    <DxColumn data-field="PROD_PRICE" :caption="$t('prod_price','common')" 
                                dataType="number" format="###,###,###.##" :allow-editing="false" width="80" css-class="cell-align-right" />
                    <DxColumn data-field="DESCRIPTION" :caption="$t('description','common')" 
                                dataType="string" :allow-editing="false" width="120" css-class="cell-align-left" />
                    <DxColumn data-field="F_SEQ" :caption="$t('f_seq','common')" 
                                dataType="number" format="###,###,###.##" :allow-editing="false" width="80" css-class="cell-align-left" />
                    <DxColumn data-field="REF_UOM" :caption="$t('ref_uom','common')" 
                                dataType="string" :allow-editing="false" width="60" css-class="cell-align-left" />
                    <DxColumn data-field="QTY_U1" :caption="$t('ref_qty','common')" 
                                dataType="number" format="###,###,###.##" :allow-editing="false" width="80" css-class="cell-align-right" />
                    <DxColumn data-field="REF_UOM_2" :caption="$t('ref_uom_2','common')" 
                                dataType="string" :allow-editing="false" width="60" css-class="cell-align-left"/>
                    <DxColumn data-field="QTY_U2" :caption="$t('ref_qty_2','common')" 
                                dataType="number" :allow-editing="false" :visible="false" css-class="cell-align-right" />
                    <DxColumn data-field="BOM_LEAF_YN" :caption="$t('bom_leaf_yn','common')" 
                                dataType="boolean" :allow-editing="false" width="80" css-class="cell-align-center"/>
                    <DxColumn data-field="TCO_COMPANY_PK" 
                                dataType="number" :allow-editing="false" :visible="false"/>

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
  components: { CellGridTextField, AlertDialog},
  data: () => ({
    dialogIsShow: false,
    dataList: {lstItemGrp: [], lstBOMLeaf: []},

    gw_BOM_Leaf: { value: "", disabled: false},
    gw_ItemGrp_PK: {value: "", disabled: false},
    gw_STItem_PK: {value: "", disabled: false},
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
        this.gw_Company.value = this.user.TCO_COMPANY_PK;
        if(this.dataList.lstItemGrp.length==0){
          this.AC_LST_FREEITEM_DIALOG( ["ITEMGRP",this.gw_Company.value, this.user.PK,'']);
        }
        if(this.dataList.lstBOMLeaf.length == 0){
          this.dataList.lstBOMLeaf.push({CODEKEY: "ALL", CODEDESC:"ALL"});
          this.dataList.lstBOMLeaf.push({CODEKEY: "Y", CODEDESC:"YES"});
          this.dataList.lstBOMLeaf.push({CODEKEY: "N", CODEDESC:"NO"});
          this.gw_BOM_Leaf.value = "ALL";
        }
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
  methods: {
    onClickButton(obj){
      switch(obj){
        case 'btnSearch':
          this.$refs.grdFreeItemSearch.instance.deselectAll();
          this.AC_SEL_FREEITEM_DIALOG_1([this.gw_ItemGrp_PK.value, this.gw_Item.value, this.gw_STItem_PK.value, 
                                          this.gw_BOM_Leaf.value, this.gw_Company.value]);
          break;
        case 'btnSelectItemStock':
            var arrRowSelected =  this.$refs.grdFreeItemSearch.instance.getSelectedRowsData();
            for(let i = 0; i < arrRowSelected.length; i++){
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
              let rowIdxGrd1 = this.getPositionRow('GRID_SEARCH', arrRowSelected[i]);
              //let rowIdxGrd2 = this.getPositionRow('GRID_SELECTED', arrRowSelected[i]);
              this.dataGrid2.unshift(this.objRowSelected(arrRowSelected[i]));
              this.setColorRow(true, rowIdxGrd1);
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
    async AC_SEL_FREEITEM_DIALOG_1(_param) {
      const dso = {
        type: 'grid',
        selpro: 'AC_SEL_FREEITEM_DIALOG_1',
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
    async AC_LST_FREEITEM_DIALOG(_param) {
			const dso = {
        type: 'list',
        selpro: 'AC_LST_FREEITEM_DIALOG',
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
