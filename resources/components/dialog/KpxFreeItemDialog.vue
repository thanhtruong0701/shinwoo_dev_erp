<!--
vng-201: PQH 
2020-07-06: Dialog for get data current stock
-->
<template>
<div>
  <v-dialog id="free-item-dialog" max-width="1200" v-model="dialogIsShow">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ $t("free_item") }}</span>
        <v-spacer></v-spacer>
        <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
      </v-card-title>
      <v-card-text class="pa-0">
        <v-container>
          <v-row dense align="start" justify="center">
            <v-col md="3" class="pt-0" align="right">
              <v-select v-model="gw_ItemGrp_PK.value" :label="$t('item_group')" :items="dataList.lstItemGrp" item-value="CODEKEY" item-text="CODEDESC" placeholder=" " dense cache-items hide-details />
            </v-col>
            <v-col md="3" class="pt-0">
              <v-text-field :label="$t('item_accnm')" v-model="gw_Item.value" :disabled="gw_Item.disabled" @keypress.enter="onClickButton('btnSearch')" placeholder=" " clearable dense hide-details />
            </v-col>
            <v-col md="2" class="pt-0">
              <v-select v-model="gw_BOM_Leaf.value" :label="$t('bom_leaf_yn')" :items="dataList.lstBOMLeaf" item-value="CODEKEY" item-text="CODEDESC" placeholder=" " dense cache-items hide-details />
            </v-col>
            <v-col md="2" class="pt-0">

            </v-col>
            <v-col md="2" class="pt-0" align="right">
              <v-btn icon tile dark :color="currentTheme" @click="onClickButton('btnSearch')" :title="$t('btn_search')" :loading="isProcessing">
                <v-icon>mdi-magnify</v-icon>
              </v-btn>
              <v-btn icon tile dark color="warning" @click="onClickButton('btnSelectItemStock')" :title="$t('btn_select')">
                <v-icon>mdi-check</v-icon>
              </v-btn>
              <v-btn icon tile dark color="error" @click="onClearSel()" :title="$t('btn_remove')">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-row dense align="start" justify="center">
            <v-col cols="12" class="pt-0">
              <DxDataGrid column-resizing-mode="widget" ref="grdFreeItemSearch" :allow-column-resizing="true" :column-auto-width="$vuetify.breakpoint.smAndDown" :data-source="dataGrid1" :height="limitHeightGrd1" :cache-enabled="false" :no-data-text="$t('no_data', 'common')" :show-borders="true" :show-column-lines="true" :show-row-lines="true" :onRowDblClick="onRowDblClickGrd1">
                <DxColumn data-field="TLG_IT_ITEMGRP_PK" dataType="number" :allow-editing="false" :visible="false" />
                <DxColumn data-field="ITEMGRP_NAME" :caption="$t('item_group')" dataType="string" :allow-editing="false" width="100" css-class="cell-align-left" />
                <DxColumn data-field="TLG_IT_ITEM_PK" dataType="number" :allow-editing="false" :visible="false" />
                <DxColumn data-field="ITEM_CODE" :caption="$t('item_code')" dataType="string" :allow-editing="false" width="100" css-class="cell-align-left" />
                <DxColumn data-field="ITEM_NAME" :caption="$t('item_accnm')" dataType="string" :allow-editing="false" width="200" css-class="cell-align-left" />
                <DxColumn data-field="UOM" :caption="$t('uom')" dataType="string" :allow-editing="false" width="60" css-class="cell-align-left" />
                <DxColumn data-field="PUR_PRICE" :caption="$t('pur_price')" dataType="number" format="###,###,###.##" :allow-editing="false" width="80" css-class="cell-align-right" />
                <DxColumn data-field="SALE_PRICE" :caption="$t('sale_price')" dataType="number" format="###,###,###.##" :allow-editing="false" width="80" css-class="cell-align-right" />
                <DxColumn data-field="PROD_PRICE" :caption="$t('prod_price')" dataType="number" format="###,###,###.##" :allow-editing="false" width="80" css-class="cell-align-right" />
                <DxColumn data-field="DESCRIPTION" :caption="$t('description')" dataType="string" :allow-editing="false" width="120" css-class="cell-align-left" />
                <DxColumn data-field="F_SEQ" :caption="$t('f_seq')" dataType="number" format="###,###,###.##" :allow-editing="false" width="80" css-class="cell-align-left" />
                <DxColumn data-field="REF_UOM" :caption="$t('ref_uom')" dataType="string" :allow-editing="false" width="60" css-class="cell-align-left" />
                <DxColumn data-field="QTY_U1" :caption="$t('ref_qty')" dataType="number" format="###,###,###.##" :allow-editing="false" width="80" css-class="cell-align-right" />
                <DxColumn data-field="REF_UOM_2" :caption="$t('ref_uom_2')" dataType="string" :allow-editing="false" width="60" css-class="cell-align-left" />
                <DxColumn data-field="QTY_U2" :caption="$t('ref_qty_2')" dataType="number" :allow-editing="false" :visible="false" css-class="cell-align-right" />
                <DxColumn data-field="BOM_LEAF_YN" :caption="$t('bom_leaf_yn')" dataType="boolean" :allow-editing="false" width="80" css-class="cell-align-center" />
                <DxColumn data-field="TCO_COMPANY_PK" dataType="number" :allow-editing="false" :visible="false" />
                <DxColumn data-field="CCY" :caption="$t('ccy')" dataType="string" :allow-editing="false" width="80" css-class="cell-align-left" />
                <DxColumn data-field="CUST_ITEM_CODE" :caption="$t('cust_item_code')" dataType="string" :allow-editing="false" width="120" css-class="cell-align-left" />
                <DxEditing mode="cell" :allow-updating="true" startEditAction="dblClick" />
                <DxSelection mode="multiple" show-check-boxes-mode="none" />
                <DxPaging :enabled="true"/>
              </DxDataGrid>
            </v-col>
          </v-row>
          <!-- <v-row dense align="start" justify="center">
              <v-col md="2" class="pt-0">
              </v-col>
              <v-col md="2" class="pt-0">
              </v-col>
              <v-col md="2" class="pt-0">
              </v-col>
              <v-col md="2" class="pt-0">
              </v-col>
              <v-col md="4" offset-md="8" class="pt-0" align="right">
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
            </v-row> -->
          <!-- <v-row dense align="start" justify="center">
              <v-col cols="12"  class="pt-0">
                <DxDataGrid column-resizing-mode="widget" ref="grdFreeItemSelect" 
                  :allow-column-resizing="true" :cache-enabled="false" :column-auto-width="$vuetify.breakpoint.smAndDown" :data-source="dataGrid2" 
                  :height="limitHeightGrd2" :no-data-text="$t('no_data', 'common')"
                  :show-borders="true" :show-column-lines="true" :show-row-lines="true" :onRowDblClick="onRowDblClickGrd2" >
                  <DxColumn data-field="TLG_IT_ITEMGRP_PK" 
                              dataType="number" :allow-editing="false" :visible="false"/>
                  <DxColumn data-field="ITEMGRP_NAME" :caption="$t('item_group')" 
                              dataType="string" :allow-editing="false" width="100" css-class="cell-align-left" />
                  <DxColumn data-field="TLG_IT_ITEM_PK" 
                              dataType="number" :allow-editing="false" :visible="false"/>
                  <DxColumn data-field="ITEM_CODE" :caption="$t('item_code')" 
                              dataType="string" :allow-editing="false" width="100" css-class="cell-align-left" />
                  <DxColumn data-field="ITEM_NAME" :caption="$t('item_accnm')" 
                              dataType="string" :allow-editing="false" width="200" css-class="cell-align-left" />
                  <DxColumn data-field="UOM" :caption="$t('uom')" 
                              dataType="string" :allow-editing="false" width="60" css-class="cell-align-left" />
                  <DxColumn data-field="PUR_PRICE" :caption="$t('pur_price')" 
                              dataType="number" format="###,###,###.##" :allow-editing="false" width="80" css-class="cell-align-right" />
                  <DxColumn data-field="SALE_PRICE" :caption="$t('sale_price')" 
                              dataType="number" format="###,###,###.##" :allow-editing="false" width="80" css-class="cell-align-right" />
                  <DxColumn data-field="PROD_PRICE" :caption="$t('prod_price')" 
                              dataType="number" format="###,###,###.##" :allow-editing="false" width="80" css-class="cell-align-right" />
                  <DxColumn data-field="DESCRIPTION" :caption="$t('description')" 
                              dataType="string" :allow-editing="false" width="120" css-class="cell-align-left" />
                  <DxColumn data-field="F_SEQ" :caption="$t('f_seq')" 
                              dataType="number" format="###,###,###.##" :allow-editing="false" width="80" css-class="cell-align-left" />
                  <DxColumn data-field="REF_UOM" :caption="$t('ref_uom')" 
                              dataType="string" :allow-editing="false" width="60" css-class="cell-align-left" />
                  <DxColumn data-field="QTY_U1" :caption="$t('ref_qty')" 
                              dataType="number" format="###,###,###.##" :allow-editing="false" width="80" css-class="cell-align-right" />
                  <DxColumn data-field="REF_UOM_2" :caption="$t('ref_uom_2')" 
                              dataType="string" :allow-editing="false" width="60" css-class="cell-align-left"/>
                  <DxColumn data-field="QTY_U2" :caption="$t('ref_qty_2')" 
                              dataType="number" :allow-editing="false" :visible="false" css-class="cell-align-right" />
                  <DxColumn data-field="BOM_LEAF_YN" :caption="$t('bom_leaf_yn')" 
                              dataType="boolean" :allow-editing="false" width="80" css-class="cell-align-center"/>
                  <DxColumn data-field="TCO_COMPANY_PK" 
                              dataType="number" :allow-editing="false" :visible="false"/>
                  <DxColumn data-field="CCY" :caption="$t('ccy')" 
                              dataType="string" :allow-editing="false" width="80" css-class="cell-align-left" />
                  <DxColumn data-field="CUST_ITEM_CODE" :caption="$t('cust_item_code')" 
                              dataType="string" :allow-editing="false" width="120" css-class="cell-align-left" />
                  <DxEditing mode="cell" :allow-updating="true" startEditAction="dblClick" :confirmDelete="false"/>
                  <DxSelection mode="multiple" show-check-boxes-mode="none" />
                  <DxPaging :enabled="false"/>
                </DxDataGrid>
              </v-col>
            </v-row> -->
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
  components: {
    CellGridTextField,
    AlertDialog
  },
  data: () => ({
    dialogIsShow: false,
    dataList: {
      lstItemGrp: [],
      lstBOMLeaf: []
    },

    gw_BOM_Leaf: {
      value: "",
      disabled: false
    },
    gw_ItemGrp_PK: {
      value: "",
      disabled: false
    },
    gw_STItem_PK: {
      value: "",
      disabled: false
    },
    gw_Item: {
      value: "",
      disabled: false
    },
    gw_Company: {
      value: "",
      disabled: false
    },
    dataGrid1: [],
    dataGrid2: []
  }),
  watch: {
    dialogIsShow(val) {
      if (val === false) {
        this.$emit('onCloseDialog')
      } else {
        this.gw_Company.value = this.user.TCO_COMPANY_PK;
        if (this.dataList.lstItemGrp.length == 0) {
          this.LG_LST_FREEITEM_DIALOG(["ITEMGRP", this.gw_Company.value, this.user.PK, '']);
        }
        if (this.dataList.lstBOMLeaf.length == 0) {
          this.dataList.lstBOMLeaf.push({
            CODEKEY: "ALL",
            CODEDESC: "ALL"
          });
          this.dataList.lstBOMLeaf.push({
            CODEKEY: "Y",
            CODEDESC: "YES"
          });
          this.dataList.lstBOMLeaf.push({
            CODEKEY: "N",
            CODEDESC: "NO"
          });
          this.gw_BOM_Leaf.value = "ALL";
        }
        this.dataGrid1 = [];
        this.dataGrid2 = [];
      }
    },
  },
  mounted() {

  },
  computed: {
    user() {
      return this.$store.getters["auth/user"]
    },
    limitHeightGrd1() {
      return 600
    },
    limitHeightGrd2() {
      return 300
    },
  },
  created() {
    console.log('created - paras Item Info Create 11')
  },
  methods: {
    onClearSel(){
      this.$refs.grdFreeItemSearch.instance.clearSelection();
    },
    onClickButton(obj) {
      switch (obj) {
        case 'btnSearch':
          this.$refs.grdFreeItemSearch.instance.deselectAll();
          this.LG_SEL_FREEITEM_DIALOG_1([this.gw_ItemGrp_PK.value, this.gw_Item.value, this.gw_STItem_PK.value, this.gw_BOM_Leaf.value, this.gw_Company.value]);
          break;
        case 'btnSelectItemStock':
          let arrRowSelected1 = this.$refs.grdFreeItemSearch.instance.getSelectedRowsData();
          this.callBackData(arrRowSelected1);
          // for (var i = 0; i < arrRowSelected.length; i++) {
          //   if (!this.isExists(arrRowSelected[i])) {
          //     var rowIdxGrd1 = this.getPositionRow('GRID_SEARCH', arrRowSelected[i]);
          //     this.dataGrid2.unshift(arrRowSelected[i]);
          //     this.setColorRow(true, rowIdxGrd1);
          //   } else {
          //     break;
          //   }
          // }
          break;
        case 'btnGetItemStock':
          this.callBackData(this.dataGrid2);
          break;
        case 'btnRemoveItemStock':
          var arrRowSelected2 = this.$refs.grdFreeItemSelect.instance.getSelectedRowsData();
          for (var i = arrRowSelected2.length - 1; i >= 0; i--) {
            var rowIdxGrd1 = this.getPositionRow('GRID_SEARCH', arrRowSelected2[i]);
            var rowIdxGrd2 = this.getPositionRow('GRID_SELECTED', arrRowSelected2[i]);
            //this.dataGrid2.splice(rowIdxGrd2,1);
            this.$refs.grdFreeItemSelect.instance.deleteRow(rowIdxGrd2);
            this.$refs.grdFreeItemSelect.instance.refresh();
            this.setColorRow(false, rowIdxGrd1);
          }
          this.$refs.grdFreeItemSelect.instance.clearSelection();
          break;
      }
    },
    onRowDblClickGrd1(_event) {
      this.callBackData([_event.data]);
      this.dialogIsShow = false;
    },
    onRowDblClickGrd2(_event) {
      var rowSelected = _event.data;
      var rowIdxGrd1 = this.getPositionRow('GRID_SEARCH', rowSelected);
      if (rowIdxGrd1 != -1) {
        this.setColorRow(false, rowIdxGrd1);
      }
      this.$refs.grdFreeItemSelect.instance.deleteRow(_event.dataIndex);
      this.$refs.grdFreeItemSelect.instance.refresh();
    },
    getPositionRow(_Grid, _data) {
      var rowIdx = -1;
      if (_Grid == "GRID_SEARCH") {
        rowIdx = this.$refs.grdFreeItemSearch.instance.getRowIndexByKey(_data);
      } else if (_Grid == "GRID_SELECTED") {
        rowIdx = this.$refs.grdFreeItemSelect.instance.getRowIndexByKey(_data);
      }
      return rowIdx;
    },
    objRowSelected(rowData) {
      let rowSelected = {};
      let lstColumn = Object.keys(rowData);
      for (let i = 0; i < lstColumn.length; i++) {
        rowSelected[lstColumn[i]] = rowData[lstColumn[i]];
      }
      return rowSelected;
    },
    isExists(rowSelected) {
      let rowIdx = this.getPositionRow('GRID_SELECTED', rowSelected);
      if (rowIdx != -1) {
        this.$refs.alertDialog.showAlert("error", "Error", "DUPLICATE_DATA");
        return true;
      }
      return false;
    },
    setColorRow(isMarked, idx) {
      if (isMarked) {
        this.$refs.grdFreeItemSearch.instance.getRowElement(idx)[0].style.backgroundColor = "#ff5252";
      } else {
        this.$refs.grdFreeItemSearch.instance.getRowElement(idx)[0].style.backgroundColor = "";
      }
    },
    async LG_SEL_FREEITEM_DIALOG_1(_param) {
      const dso = {
        type: 'grid',
        selpro: 'LG_SEL_FREEITEM_DIALOG_1',
        para: _param
      }
      this.dataGrid1 = await this._dsoCall(dso, 'select', false);
    },
    hasValueContain(value) {
      if (!this._hasValue(value)) {
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
    async LG_LST_FREEITEM_DIALOG(_param) {
      const dso = {
        type: 'list',
        selpro: 'LG_LST_FREEITEM_DIALOG',
        para: _param
      }
      switch (_param[0]) {
        case 'ITEMGRP':
          this.dataList.lstItemGrp = await this._dsoCall(dso, 'select', false);
          this.dataList.lstItemGrp.unshift({
            CODEKEY: "",
            CODEDESC: "All"
          });
          if (this.dataList.lstItemGrp.length > 0) {
            this.gw_ItemGrp_PK.value = this.dataList.lstItemGrp[0].CODEKEY;
          }
          break;
      }
    },
  }
}
</script>
