<!--
vng-201: PQH 
2020-07-16: Dialog for get data warehouse
-->
<template>
<v-dialog id="warehouse-dialog" max-width="900" v-model="dialogIsShow">
  <v-card v-resize="onResize">
    <v-card-title class="headline primary-gradient white--text py-2">
      <span>{{ $t("warehouse") }}</span>
      <v-spacer></v-spacer>
      <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
    </v-card-title>
    <v-card-text class="pa-0">
      <v-container fluid class="py-0">
        <v-row align="center" justify="space-between">
          <v-col md="2" sm="2">
            <v-select v-model="gw_InOut_type.value" :label="$t('inout_type', 'common')" :items="dataList.lstInOutType" item-value="CODEKEY" item-text="CODEDESC" v-show="gw_InOut_type.visibled" :disabled="gw_InOut_type.disabled" dense cache-items hide-details outlined />
          </v-col>
          <v-col md="4" sm="4">
            <v-select v-model="gw_WHType.value" :label="$t('wh_type', 'common')" :items="dataList.lstWHType" item-value="CODE" item-text="NAME" v-show="gw_WHType.visibled" :disabled="gw_WHType.disabled" dense cache-items hide-details outlined />
          </v-col>
          <v-col md="3" sm="3">
            <v-text-field :label="$t('location', 'common')" v-model="gw_WH.value" v-show="gw_WH.visibled" :disabled="gw_WH.disabled" clearable dense hide-details outlined @keypress.enter="onClickButton('btnSearch')" />
          </v-col>
          <v-col md="3" sm="3" align="right">
            <v-btn class="btn ma-1" tile dark :color="currentTheme" @click="onClickButton('btnSearch')">
              <v-icon>mdi-magnify</v-icon>{{ $t("btn_search", "common") }}
            </v-btn>
            <v-btn class="btn ma-1" v-show="gw_btnSelect.visibled" tile color="#29B6F6" :disabled="gw_btnSelect.disabled" @click="onClickButton('btnSelect')" dark>
              <v-icon>mdi-hand-pointing-right</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-row align="center" justify="center">
          <v-col cols="12" class="pa-2">
            <DxDataGrid column-resizing-mode="widget" ref="grdDetail" :allow-column-resizing="true" :cache-enabled="false" :column-auto-width="$vuetify.breakpoint.smAndDown" :data-source="dataGrid1" :height="limitHeightGrd1" :no-data-text="$t('no_data', 'common')" :show-borders="true" :show-column-lines="true" :show-row-lines="true" :onRowDblClick="onRowDblClickGrd1">
              <DxColumn data-field="PK" dataType="number" :allow-editing="false" :visible="false" />
              <DxColumn data-field="WH_ID" :caption="$t('wh_id', 'common')" dataType="string" :allow-editing="false" width="80" css-class="cell-align-left" />
              <DxColumn data-field="WH_NAME" :caption="$t('warehouse', 'common')" dataType="string" :allow-editing="false" width="200" css-class="cell-align-left" />
              <DxColumn data-field="TLG_IN_STORAGE_PK" dataType="number" :allow-editing="false" :visible="false" />
              <DxColumn data-field="STRG_NAME" :caption="$t('storage_wh', 'common')" dataType="string" :allow-editing="false" width="150" css-class="cell-align-left" />
              <DxColumn data-field="WH_TYPE" :caption="$t('wh_type', 'common')" dataType="string" :allow-editing="false" width="120" css-class="cell-align-left">
                <DxLookup display-expr="NAME" value-expr="CODE" :data-source="dataList.lstWHType" />
              </DxColumn>
              <DxColumn data-field="ST_DATE" :caption="$t('st_date', 'common')" dataType="date" format="yyyy-MM-dd" :allow-editing="false" width="100" css-class="cell-align-center" />
              <DxColumn data-field="END_DATE" :caption="$t('end_date', 'common')" dataType="date" format="yyyy-MM-dd" :allow-editing="false" width="100" css-class="cell-align-center" />
              <DxColumn data-field="BC_CHECK_YN" :caption="$t('barcode_yn', 'common')" dataType="boolean" :allow-editing="false" width="80" css-class="cell-align-center" />
              <DxColumn data-field="DESCRIPTION" :caption="$t('description', 'common')" dataType="string" :allow-editing="false" width="200" css-class="cell-align-left" />
              <DxColumn data-field="LOCATION_NAME" :caption="$t('location', 'common')" dataType="string" :allow-editing="false" width="200" css-class="cell-align-left" />
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
import CellGridTextField from "@/components/table/CellGridTextField";
export default {
  name: "warehouse-dialog",
  components: {
    CellGridTextField
  },
  data: () => ({
    dialogIsShow: false,
    dataList: {
      lstWHType: [],
      lstInOutType: []
    },
    gw_WHType: {
      value: "",
      visibled: true,
      disabled: false
    },
    gw_WH: {
      value: "",
      visibled: true,
      disabled: false
    },
    gw_InOut_type: {
      value: "",
      visibled: true,
      disabled: true
    },
    gw_btnSelect: {
      visibled: true,
      disabled: false
    },
    dataGrid1: [],
  }),
  watch: {
    dialogIsShow(val) {
      if (val === false) {
        this.$emit("onCloseDialog");
      } else {
        this.dataGrid1 = [];
        if (this.dataList.lstWHType.length == 0) {
          this.getListCodes();
        }
      }
    },
  },
  mounted() {
    this.dataList.lstInOutType.push({
      CODEKEY: "IN",
      CODEDESC: "In"
    });
    this.dataList.lstInOutType.push({
      CODEKEY: "OUT",
      CODEDESC: "Out"
    });
    this.dataList.lstInOutType.push({
      CODEKEY: "",
      CODEDESC: "All"
    });
  },
  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
    limitHeightGrd1() {
      return this.windowHeight - 300;
    },
  },
  methods: {
    async getListCodes() {
      this.dataList.lstWHType = await this._getCommonCode(
        "LGIN0210",
        this.user.TCO_COMPANY_PK
      );
    },
    onClickButton(obj) {
      switch (obj) {
        case "btnSearch":
          this.SYS_SEL_WAREHOUSE_DIALOG_1([
            this.gw_WHType.value,
            this.gw_WH.value,
            this.gw_InOut_type.value,
            this.user.PK,
          ]);
          break;
        case "btnSelect":
          if (this.$refs.grdDetail.instance.getSelectedRowsData().length > 0) {
            var arrRowSelected =
              this.$refs.grdDetail.instance.getSelectedRowsData()[0];
            this.callBackData(arrRowSelected);
          } else {
            this.showNotification(
              "warning",
              "Information",
              "Select a location!"
            );
          }
          break;
      }
    },
    onRowDblClickGrd1(_event) {
      this.callBackData(_event.data);
    },
    async SYS_SEL_WAREHOUSE_DIALOG_1(_param) {
      const dso = {
        type: "grid",
        selpro: "SYS_SEL_WAREHOUSE_DIALOG_1",
        para: _param,
      };
      this.dataGrid1 = await this._dsoCall(dso, "select", false);
    },
    async SYS_LST_WAREHOUSE_DIALOG_1(_param) {
      const dso = {
        type: "list",
        selpro: "SYS_LST_WAREHOUSE_DIALOG_1",
        para: _param,
      };
      this.dataList.lstWHType = await this._dsoCall(dso, "select", false);
      this.dataList.lstWHType.unshift({
        CODEKEY: "",
        CODEDESC: "All"
      });
    },
    callBackData(_data) {
      this.$emit("callBackData", _data);
      this.dialogIsShow = false;
    },
  },
};
</script>
