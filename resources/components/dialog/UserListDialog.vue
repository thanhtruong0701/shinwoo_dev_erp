<template>
<div>
  <v-dialog id="user-list-dialog" max-width="1000" v-model="dialogIsShow" v-resize="onResize">
      <v-card>
        <v-card-title class="headline primary-gradient white--text py-2">
          <span>{{ $t("user-list") }}</span>
          <v-spacer></v-spacer>
          <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
        </v-card-title>
        <v-card-text class="pa-0">
          <v-container>
            <v-row dense align="start" justify="center">
              <v-col md="3" class="pt-0">
                <v-text-field :label="$t('item_accnm')" v-model="txtUserID" 
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

                  <DxColumn data-field="PK" 
                              dataType="number" :allow-editing="false" :visible="false"/>
                  <DxColumn data-field="EMP_ID" :caption="$t('EMP_ID')" 
                              dataType="string" :allow-editing="false" width="100" css-class="cell-align-left" />
                  <DxColumn data-field="EMP_NAME" :caption="$t('EMP_NAME')" 
                              dataType="string" :allow-editing="false" width="150" css-class="cell-align-left" />
                  <DxColumn data-field="TES_USER_PK" :caption="$t('TES_USER_PK')" 
                              dataType="number" :allow-editing="false" width="80" css-class="cell-align-left" />    
                  <DxColumn data-field="USER_ID" :caption="$t('USER_ID')" 
                              dataType="string" :allow-editing="false" width="150" css-class="cell-align-left" />            
                  <DxColumn data-field="TEL" :caption="$t('TEL')" 
                              dataType="string" :allow-editing="false" width="100" css-class="cell-align-left" />
                  <DxColumn data-field="MOBILE" :caption="$t('MOBILE')" 
                              dataType="string" :allow-editing="false" width="100" css-class="cell-align-left" />
                  <DxColumn data-field="LIVING_ADDR" :caption="$t('LIVING_ADDR')" 
                              dataType="string" :allow-editing="false" width="100" css-class="cell-align-left" />

                  <DxEditing mode="cell" :allow-updating="true" startEditAction="dblClick" />
                  <DxSelection mode="multiple"  selectAllMode="true"  :allow-select-all="true"  :show-selection-controls="true"/>
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

                  <DxColumn data-field="PK" 
                              dataType="number" :allow-editing="false" :visible="false"/>
                  <DxColumn data-field="EMP_ID" :caption="$t('EMP_ID')" 
                              dataType="string" :allow-editing="false" width="100" css-class="cell-align-left" />
                  <DxColumn data-field="EMP_NAME" :caption="$t('EMP_NAME')" 
                              dataType="string" :allow-editing="false" width="150" css-class="cell-align-left" />
                  <DxColumn data-field="TES_USER_PK" :caption="$t('TES_USER_PK')" 
                              dataType="number" :allow-editing="false" width="80" css-class="cell-align-left" />  
                  <DxColumn data-field="USER_ID" :caption="$t('USER_ID')" 
                              dataType="string" :allow-editing="false" width="150" css-class="cell-align-left" />          
                  <DxColumn data-field="TEL" :caption="$t('TEL')" 
                              dataType="string" :allow-editing="false" width="100" css-class="cell-align-left" />
                  <DxColumn data-field="MOBILE" :caption="$t('MOBILE')" 
                              dataType="string" :allow-editing="false" width="100" css-class="cell-align-left" />
                  <DxColumn data-field="LIVING_ADDR" :caption="$t('LIVING_ADDR')" 
                              dataType="string" :allow-editing="false" width="100" css-class="cell-align-left" />

                  <DxEditing mode="cell" :allow-updating="true" startEditAction="dblClick" :confirmDelete="false"/>
                  <DxSelection mode="multiple"  selectAllMode="true"  :allow-select-all="true"  :show-selection-controls="true"/>
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
    dataList: {lstItemGrp: [], lstBOMLeaf: []},
    gw_BOM_Leaf: { value: "", disabled: false},
    gw_ItemGrp_PK: {value: "", disabled: false},
    gw_STItem_PK: {value: "", disabled: false},
    gw_Company: {value: "", disabled: false},
    txtUserID: "",
    dataGrid1: [],
    dataGrid2: []
  }),
  watch: {
    dialogIsShow(val) {
      if(val === false) {
        this.$emit('onCloseDialog')
      }else{
        this.gw_Company.value = this.user.TCO_COMPANY_PK;
        this.dataGrid1 = [];
        this.dataGrid2 = [];
      }
    },
  },
  mounted(){
    
  },
  computed: {
    user() { return this.$store.getters["auth/user"] },
    limitHeightGrd1() { return 240 },
    limitHeightGrd2() { return 240 },
  },
  created() {
    console.log(this.user)  
  },
  methods: {
    onClickButton(obj){
      switch(obj){
        case 'btnSearch':
          this.$refs.grdFreeItemSearch.instance.deselectAll();
          this.onSearchM([this.txtUserID,0]);
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
          var arrRowSelectedD =  this.$refs.grdFreeItemSelect.instance.getSelectedRowsData();
          for(var j = arrRowSelected.length -1; j >= 0; j--){
              var rowIdxGrdD1 = this.getPositionRow('GRID_SEARCH', arrRowSelectedD[j]);
              var rowIdxGrdU2 = this.getPositionRow('GRID_SELECTED', arrRowSelectedD[j]);
              this.$refs.grdFreeItemSelect.instance.deleteRow(rowIdxGrdU2);
              this.$refs.grdFreeItemSelect.instance.refresh();
              this.setColorRow(false, rowIdxGrdD1);
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
    async onSearchM(_param) {
      const dso = {
        type: 'grid',
        selpro: 'AC_SEL_USERLIST',
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
  }
}
</script>
