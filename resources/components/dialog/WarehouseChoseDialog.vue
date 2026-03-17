<template>
<div>
  <v-dialog id="warehouse-chose-dialog" max-width="1200" v-model="dialogIsShow">
      <v-card>
        <v-card-title class="headline primary-gradient white--text py-2">
          <span>{{ $t("warehouse-chose") }}</span>
          <v-spacer></v-spacer>
          <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
        </v-card-title>
        <v-card-text class="pa-0">
          <v-container>
            <v-row dense align="start" justify="center">
              <v-col md="3" class="pt-0" align="right">
                <v-select v-model="gw_ItemGrp_PK.value" :label="$t('item_group')" :items="dataList.lstItemGrp" item-value="CODE" item-text="NAME" 
                      placeholder=" "  dense cache-items hide-details />
              </v-col>
              <v-col md="3" class="pt-0">
                <v-text-field :label="$t('item_accnm')" v-model="gw_Item.value" :disabled="gw_Item.disabled" 
                @keypress.enter="onClickButton('btnSearch')"
                placeholder=" " clearable dense hide-details  />
              </v-col>
              <v-col md="2" class="pt-0">
               
              </v-col>
              <v-col md="2" class="pt-0">
                
              </v-col>
              <v-col md="2" class="pt-0" align="right">
                <v-btn icon tile dark :color="currentTheme"  @click="onClickButton('btnSearch')" :title="$t('btn_search')"
                :loading="isProcessing"  >
                  <v-icon>mdi-magnify</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-row dense align="start" justify="center">
              <v-col cols="12"  class="pt-0">
                <DxDataGrid column-resizing-mode="widget" ref="grdFreeItemSearch" 
                  :allow-column-resizing="true" :column-auto-width="$vuetify.breakpoint.smAndDown" :data-source="dataGrid1" 
                  :height="limitHeightGrd1" :cache-enabled="false" :no-data-text="$t('no_data', 'common')"
                  :show-borders="true" :show-column-lines="true" :show-row-lines="true" :onRowDblClick="onRowDblClickGrd1">

                  <DxColumn data-field="PK"                 :allow-editing="false" width="0"/>
                  <DxColumn data-field="WH_ID"              :caption="$t('wh_id')"             :allow-editing="false" width="80" css-class="cell-align-left" />
                  <DxColumn data-field="WH_NAME"            :caption="$t('wh_name')"           :allow-editing="false" width="120"/>
                  <DxColumn data-field="TLG_IN_STORAGE_PK"  :caption="$t('tlg_in_storage_pk')" :allow-editing="false" width="0" css-class="cell-align-left" />
                  <DxColumn data-field="STRG_NAME"          :caption="$t('strg_name')"         :allow-editing="false" width="100" css-class="cell-align-left" />
                  <DxColumn data-field="WH_TYPE"            :caption="$t('wh_type')"           :allow-editing="false" width="60" css-class="cell-align-center" />
                  <DxColumn data-field="ITEM_GRADE"         :caption="$t('item_grade')"        :allow-editing="false" width="80" css-class="cell-align-left" />
                  <DxColumn data-field="ITEMUSE_YN"         :caption="$t('itemuse_yn')"        :allow-editing="false" width="80" css-class="cell-align-center" />
                  <DxColumn data-field="OUTSIDE_YN"         :caption="$t('outside_yn')"        :allow-editing="false" width="80" css-class="cell-align-center" />
                  <DxColumn data-field="STOCK_YN"           :caption="$t('stock_yn')"          :allow-editing="false" width="120" css-class="cell-align-left" />
                  <DxColumn data-field="USE_YN"             :caption="$t('use_yn')"            :allow-editing="false" width="80" css-class="cell-align-center" />
                  <DxColumn data-field="ST_DATE"            :caption="$t('st_date')"           :allow-editing="false" width="60" css-class="cell-align-left" />
                  <DxColumn data-field="END_DATE"           :caption="$t('end_date')"          :allow-editing="false" width="80" css-class="cell-align-center" />
                  <DxColumn data-field="DESCRIPTION"        :caption="$t('description')"       :allow-editing="false" width="60" css-class="cell-align-left"/>
                
                  <DxEditing mode="cell" :allow-updating="true" startEditAction="dblClick" />
                  <DxSelection mode="multiple" show-check-boxes-mode="none" />
                  <DxPaging :enabled="false"/>
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
                <v-btn icon tile dark color="warning"  @click="onClickButton('btnSelectItemStock')" :title="$t('btn_select')">
                  <v-icon>mdi-hand</v-icon>
                </v-btn>
                <v-btn icon tile dark color="error"  @click="onClickButton('btnRemoveItemStock')" :title="$t('btn_remove')">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
                <v-btn icon tile dark color="success"  @click="onClickButton('btnGetItemStock')" :title="$t('btn_get')">
                  <v-icon>mdi-check</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-row dense align="start" justify="center">
              <v-col cols="12"  class="pt-0">
                <DxDataGrid column-resizing-mode="widget" ref="grdFreeItemSelect" 
                  :allow-column-resizing="true" :cache-enabled="false" :column-auto-width="$vuetify.breakpoint.smAndDown" :data-source="dataGrid2" 
                  :height="limitHeightGrd2" :no-data-text="$t('no_data', 'common')"
                  :show-borders="true" :show-column-lines="true" :show-row-lines="true" :onRowDblClick="onRowDblClickGrd2" >

                  <DxColumn data-field="PK"                 :allow-editing="false" width="0"/>
                  <DxColumn data-field="WH_ID"              :caption="$t('wh_id')"             :allow-editing="false" width="80" css-class="cell-align-left" />
                  <DxColumn data-field="WH_NAME"            :caption="$t('wh_name')"           :allow-editing="false" width="120"/>
                  <DxColumn data-field="TLG_IN_STORAGE_PK"  :caption="$t('tlg_in_storage_pk')" :allow-editing="false" width="0" css-class="cell-align-left" />
                  <DxColumn data-field="STRG_NAME"          :caption="$t('strg_name')"         :allow-editing="false" width="100" css-class="cell-align-left" />
                  <DxColumn data-field="WH_TYPE"            :caption="$t('wh_type')"           :allow-editing="false" width="60" css-class="cell-align-center" />
                  <DxColumn data-field="ITEM_GRADE"         :caption="$t('item_grade')"        :allow-editing="false" width="80" css-class="cell-align-left" />
                  <DxColumn data-field="ITEMUSE_YN"         :caption="$t('itemuse_yn')"        :allow-editing="false" width="80" css-class="cell-align-center" />
                  <DxColumn data-field="OUTSIDE_YN"         :caption="$t('outside_yn')"        :allow-editing="false" width="80" css-class="cell-align-center" />
                  <DxColumn data-field="STOCK_YN"           :caption="$t('stock_yn')"          :allow-editing="false" width="120" css-class="cell-align-left" />
                  <DxColumn data-field="USE_YN"             :caption="$t('use_yn')"            :allow-editing="false" width="80" css-class="cell-align-center" />
                  <DxColumn data-field="ST_DATE"            :caption="$t('st_date')"           :allow-editing="false" width="60" css-class="cell-align-left" />
                  <DxColumn data-field="END_DATE"           :caption="$t('end_date')"          :allow-editing="false" width="80" css-class="cell-align-center" />
                  <DxColumn data-field="DESCRIPTION"        :caption="$t('description')"       :allow-editing="false" width="60" css-class="cell-align-left"/>

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
  name: 'warehouse-chose-dialog',
  components: { CellGridTextField, AlertDialog},
  data: () => ({
    dialogIsShow: false,
    dataList: {lstItemGrp: []},

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
          this.LG_LST_FREEITEM_DIALOG( ["ITEMGRP",this.gw_Company.value, this.user.PK,'']);
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
  },
  methods: {
    onClickButton(obj){
      switch(obj){
        case 'btnSearch':
          this.$refs.grdFreeItemSearch.instance.deselectAll();
          this.LG_SEL_WAREHOUSE_DIALOG_1([this.gw_ItemGrp_PK.value, this.gw_Item.value]);
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
    async LG_SEL_WAREHOUSE_DIALOG_1(_param) {
      const dso = {
        type: 'grid',
        selpro: 'AC_SEL_6080010_WH_POPUP',
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
      this.dataGrid1 = [];
      this.dataGrid2 = [];
    },
    async LG_LST_FREEITEM_DIALOG(_param) {
			/*const dso = {
        type: 'list',
        selpro: 'LG_LST_FREEITEM_DIALOG',
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
      */
       this.dataList.lstItemGrp = await this._getCommonCode("ACT00001",this.selectedCompany);
       this.dataList.lstItemGrp.unshift({CODE: "ALL", NAME: "Select All"});
       if(this.dataList.lstItemGrp.length>0){
            this.gw_ItemGrp_PK.value = this.dataList.lstItemGrp[0].CODE;
          }
		},
  }
}
</script>
