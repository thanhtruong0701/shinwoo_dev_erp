<!--
vng-201: PQH 
2020-07-11: Dialog for get data warehouse location
-->
<template>
<v-dialog id="warehouse-location-dialog" max-width="900" v-model="dialogIsShow">
  <v-card v-resize="onResize">
    <v-card-title class="headline primary-gradient white--text py-2">
      <span>{{ $t("warehouse_location") }}</span>
      <v-spacer></v-spacer>
      <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
    </v-card-title>
    <v-card-text class="pa-0">
      <v-container fluid class="py-0">
        <v-row align="center" justify="space-between">
          <v-col md="4" sm="4">
            <v-select v-model="gw_WarehousePK.value" :label="$t('warehouse','common')" :items="dataList.lstWarehouse" item-value="CODEKEY" item-text="CODEDESC" v-show="gw_WarehousePK.visibled" :disabled="gw_WarehousePK.disabled" dense cache-items hide-details outlined />
          </v-col>
          <v-col md="4" sm="4">
            <v-text-field :label="$t('location','common')" v-model="gw_LocationID.value" v-show="gw_LocationID.visibled" :disabled="gw_LocationID.disabled" clearable dense hide-details outlined @keypress.enter="onClickButton('btnSearch')" />
          </v-col>
          <v-col md="4" sm="4">
            <div class="d-flex justify-center">
              <BaseButton icon_type="search" :btn_text="$t('search')" @onclick="onClickButton('btnSearch')" />
              <BaseButton icon_type="select" :btn_text="$t('select')" @onclick="onClickButton('btnSelect')" />
            </div>
          </v-col>
        </v-row>
        <v-row align="center" justify="center">
          <v-col cols="12" class="pa-2">
            <DxDataGrid column-resizing-mode="widget" ref="grdDetail" :allow-column-resizing="true" :cache-enabled="false" :column-auto-width="$vuetify.breakpoint.smAndDown" :data-source="dataGrid1" :height="limitHeightGrd1" :loadPanel="{ enabled: true, text: $t('is_loading', 'common') }" :no-data-text="$t('no_data', 'common')" :show-borders="true" :show-column-lines="true" :show-row-lines="true" :onRowDblClick="onRowDblClickGrd1">
              <DxColumn data-field="TLG_IN_WAREHOUSE_PK" dataType="number" :allow-editing="false" :visible="false" />
              <DxColumn data-field="WH_NAME" :caption="$t('warehouse','common')" dataType="string" :allow-editing="false" width="200" css-class="cell-align-left" />
              <DxColumn data-field="TLG_IN_WHLOC_PK" :caption="$t('specgrp_lnm')" dataType="number" :allow-editing="false" :visible="false" />
              <DxColumn data-field="LOC_ID" :caption="$t('location_id','common')" dataType="string" :allow-editing="false" width="150" css-class="cell-align-left" />
              <DxColumn data-field="LOC_NAME" :caption="$t('location_name','common')" dataType="string" :allow-editing="false" width="200" css-class="cell-align-left" />

              <DxEditing mode="cell" :allow-updating="true" startEditAction="dblClick" />
              <DxSelection mode="single" show-check-boxes-mode="none" />
            </DxDataGrid>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</v-dialog>
</template>

<script>
import CellGridTextField from '@/components/table/CellGridTextField'
export default {
  name: 'warehouse-location-dialog',
  components: {
    CellGridTextField
  },
  data: () => ({
    dialogIsShow: false,
    dataList: {
      lstWarehouse: []
    },
    gw_WarehousePK: {
      value: "",
      visibled: true,
      disabled: true
    },
    gw_WarehouseRefPK: {
      value: "",
      visibled: false,
      disabled: true
    },
    gw_LocationID: {
      value: "",
      visibled: true,
      disabled: false
    },
    gw_LocationRefPK: {
      value: "",
      visibled: false,
      disabled: true
    },
    gw_btnSelect: {
      visibled: true,
      disabled: false
    },
    dataGrid1: []
  }),
  watch: {
    dialogIsShow(val) {
      if (val === false) {
        this.$emit('onCloseDialog')
      } else {
        this.dataGrid1 = [];
        if (this.dataList.lstWarehouse.length == 0) {
          this.SYS_LST_WHLOCATION_1([this.user.PK]);
        }
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
      return this.windowHeight - 300
    },
  },
  methods: {
    onClickButton(obj) {
      switch (obj) {
        case 'btnSearch':
          this.SYS_SEL_WHLOCATION_1([this.gw_WarehousePK.value, this.gw_WarehouseRefPK.value, this.gw_LocationRefPK.value, this.gw_LocationID.value]);
          break;
        case 'btnSelect':
          if (this.$refs.grdDetail.instance.getSelectedRowsData().length > 0) {
            var arrRowSelected = this.$refs.grdDetail.instance.getSelectedRowsData()[0];
            this.callBackData(arrRowSelected);
          } else {
            this.showNotification("warning", "Information", "Select a location!");
          }
          break;
      }
    },
    onRowDblClickGrd1(_event) {
      this.callBackData(_event.data);
    },
    async SYS_SEL_WHLOCATION_1(_param) {
      const dso = {
        type: 'grid',
        selpro: 'SYS_SEL_WHLOCATION_1',
        para: _param
      }
      this.dataGrid1 = await this._dsoCall(dso, 'select', false);
    },
    async SYS_LST_WHLOCATION_1(_param) {
      const dso = {
        type: 'list',
        selpro: 'SYS_LST_WHLOCATION_1',
        para: _param
      }
      this.dataList.lstWarehouse = await this._dsoCall(dso, 'select', false);
      this.dataList.lstWarehouse.unshift({
        CODEKEY: "",
        CODEDESC: "All"
      });
    },
    callBackData(_data) {
      this.$emit("callBackData", _data);
      this.dialogIsShow = false;
    }
  }
}
</script>
