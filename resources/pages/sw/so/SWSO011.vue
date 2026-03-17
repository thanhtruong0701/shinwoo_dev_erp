<template>
  <v-container fluid class="px-0 pt-0" v-resize="onResize">
    <v-row no-gutters>
      <v-col md="12" fluid class="pa-1">
        <v-card class="pa-1" outlined tile>
          <v-row dense align="center">
            <v-col cols="3">
              <v-row no-gutters>
                <v-col cols="4" class="pr-1">
                  <BaseDatePicker start v-model="dt_from" :label="$t('from_date')" default></BaseDatePicker>
                </v-col>
                <v-col cols="4" class="pr-1">
                  <BaseDatePicker start v-model="dt_to" :label="$t('date_to')" default></BaseDatePicker>
                </v-col>
                <v-col cols="4">
                  <BaseSelect :label="$t('Item Type')" v-model="selecteditemType" :lstData="lstItemType"
                    item-text="text" item-value="value" />
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="1">
              <BaseInput v-model="txt_from_seq" :label="$t('from_seq')" @keyPressEnter="searchOrder" />
            </v-col>
            <v-col cols="1">
              <BaseInput v-model="txt_to_seq" :label="$t('to_seq')" @keyPressEnter="searchOrder" />
            </v-col>
            <v-col cols="1">
              <BaseSelect :label="$t('startus')" v-model="itemreporttype" :lstData="lstreporttype" item-text="NAME"
                item-value="CODE" @change="onStatusChange" />
            </v-col>
            <v-col md="1" class="pt-0">
              <v-row justify="end" class="mr-1">
                <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing"
                  @onclick="searchOrder" />
              </v-row>
            </v-col>
            <v-col cols="1">
              <BaseSelect :label="$t('Set Status')" v-model="selectedStatus" :lstData="statusOptions" item-text="NAME"
                item-value="CODE" />
            </v-col>
            <v-col cols="1">
              <BaseButton btn_type="icon" icon_type="set" :btn_text="$t('set-status')" :disabled="isProcessing"
                @onclick="$refs.grdDetail01.setCellSelected('STATUS', selectedStatus)" />
            </v-col>
            <v-col cols="2">
              <v-row no-gutters align="center">
                <v-col cols="9" class="pr-1">
                  <BaseDatePicker v-model="selectedConfirmDate" :label="$t('Set Confirm Date')" default />
                </v-col>
                <v-col cols="3">
                  <BaseButton btn_type="icon" icon_type="set" :btn_text="$t('set-date')" :disabled="isProcessing"
                    @onclick="$refs.grdDetail01.setCellSelected('CONFIRM_DELI_DT', selectedConfirmDate)" />
                </v-col>
              </v-row>
            </v-col>
            <v-col md="1" class="pt-0">
              <v-row justify="end" class="mr-1">
                <BaseButton icon_type="save" :btn_text="$t('save')" :disabled="isProcessing" @onclick="OnSave()" />
              </v-row>
            </v-col>
            <v-col cols="4" class="pt-0 d-flex justify-space-between">
              <BaseButton icon_type="excel" :btn_text="$t('excel_ICV')" :disabled="isProcessing" @onclick="onReport" />

              <BaseButton icon_type="excel" :btn_text="$t('excel_CSV')" :disabled="isProcessing"
                @onclick="onReport_csv" />

              <BaseButton icon_type="excel" :btn_text="$t('excel_P_list')" :disabled="isProcessing"
                @onclick="onReport2" />
            </v-col>

          </v-row>
        </v-card>

        <v-card>
          <v-row>
            <v-col md="12" class="py-0">
              <DataGridView ref="grdDetail01" column-resizing-mode="widget" sel_procedure="SW_SEL_HAEIN_PRT"
                upd_procedure="SW_UPD_SWSO011_v01" :auto_load="false" @setDataSource="onDataSourceSet"
                @cellClick="onCellClick" :max_height="gridHeight" :update_paras="['PK', 'CONFIRM_DELI_DT', 'STATUS']"
                select_mode="Multiple"
                :filter_paras="[dt_from, dt_to, txt_from_seq, txt_to_seq, selecteditemType, itemreporttype]"
                :header="gridHeader" />
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import "sweetalert2/src/sweetalert2.scss";

export default {
  layout: "default",
  middleware: "user",

  data: () => ({
    dt_from: "",
    dt_to: "",
    txt_from_seq: "",
    txt_to_seq: "",
    selectedConfirmDate: "",
    selecteditemType: "",
    itemreporttype: null,  // Set default là null cho ALL
    lstreporttype: [
      { CODE: null, NAME: 'ALL' },
      { CODE: '01', NAME: 'Pending' },
      { CODE: '02', NAME: 'Done' }
    ],
    selectedStatus: "01",
    statusOptions: [
      { CODE: '01', NAME: 'Pending' },
      { CODE: '02', NAME: 'Done' }
    ],
    isProcessing: false
  }),

  async created() {
    try {
      // Log initial status data
      console.log('Initial status data:', {
        itemreporttype: this.itemreporttype,
        lstreporttype: this.lstreporttype
      });
    } catch (error) {
      console.error('Error in created:', error);
    }
  },

  watch: {
    itemreporttype: {
      handler(newVal) {
        console.log('Status changed to:', newVal);
      },
      immediate: true
    }
  },

  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
    gridHeight() {
      return this.formContainerHeight - 140;
    },
    masterContainerHeight() {
      return (this.formContainerHeight - 48) / 2;
    },
    lstItemType() {
      return [
        { value: "", text: "SELECT ALL" },
        { value: "BARCODE", text: "BARCODE" },
        { value: "CARE LABEL", text: "CARE LABEL" }
      ]
    },
    gridHeader() {
      return [
        { dataField: 'ORDER_DT', caption: this.$t('orderdate'), allowEditing: false, dataType: 'date', bgColor: this.bgColor1, fixed: true, width: 100 },
        { dataField: 'SEQ', caption: this.$t('seq'), allowEditing: false, bgColor: this.bgColor1, fixed: true, width: 40 },
        { dataField: 'ORDER_NM', caption: this.$t('order name'), allowEditing: false, width: 200 },
        { dataField: 'DELI_DT', caption: this.$t('deli date'), allowEditing: false, dataType: 'date', bgColor: this.bgColor1, width: 100 },
        { dataField: 'CONFIRM_DELI_DT', caption: this.$t('confirm deli date'), allowEditing: true, dataType: 'date', bgColor: this.bgColor1, width: 100 },
        { dataField: 'FACTORY', caption: this.$t('factory'), allowEditing: false, width: 100 },
        { dataField: 'ITEM', caption: this.$t('item'), allowEditing: true, bgColor: this.bgColor1, width: 100 },
        { dataField: 'BRAND', caption: this.$t('brand'), allowEditing: false, width: 100 },
        { dataField: 'STYLE', caption: this.$t('style'), allowEditing: false, width: 150 },
        { dataField: 'MODEL1', caption: this.$t('model'), allowEditing: false, width: 100 },
        { dataField: 'SIZE1', caption: this.$t('size'), allowEditing: false, width: 40 },
        { dataField: 'RATIO', caption: this.$t('ratio'), allowEditing: false, width: 50 },
        { dataField: 'QTY', caption: this.$t('qty'), summaryType: 'sum', formatFloat: '0', allowEditing: false, bgColor: this.bgColor1, width: 50 },
        { dataField: 'QTY2', caption: this.$t('qty2'), summaryType: 'sum', formatFloat: '0', allowEditing: false, bgColor: this.bgColor1, width: 50 },
        { dataField: 'BASE1', caption: this.$t('base1'), allowEditing: false, width: 100 },
        { dataField: 'BASE2', caption: this.$t('base2'), allowEditing: false, width: 100 },
        { dataField: 'BASE3', caption: this.$t('base3'), allowEditing: false, width: 100 },
        { dataField: 'BASE4', caption: this.$t('base4'), allowEditing: false, width: 100 },
        { dataField: 'BASE5', caption: this.$t('base5'), allowEditing: false, width: 100 },
        { dataField: 'CCY', caption: this.$t('ccy'), allowEditing: false, width: 40 },
        { dataField: 'UNITPRICE', caption: this.$t('unitprice'), allowEditing: false, formatFloat: '0', width: 100 },
        { dataField: 'SKU', caption: this.$t('SKU'), allowEditing: false, width: 100 },
        { dataField: 'BARCODE', caption: this.$t('BARCODE'), allowEditing: false, width: 100 },
        { dataField: 'STATUS', caption: this.$t('Status'), allowEditing: true, width: 100, defaultValue: '01', editType: 'dxSelectBox', lookup: { dataSource: [{ CODE: '01', NAME: 'Pending' }, { CODE: '02', NAME: 'Done' }], displayExpr: 'NAME', valueExpr: 'CODE' } },
        { dataField: 'MATERIAL1', caption: this.$t('MATERIAL1'), allowEditing: false, width: 100 },
        { dataField: 'RATIO1', caption: this.$t('RATIO1'), allowEditing: false, width: 50 },
        { dataField: 'MATERIAL2', caption: this.$t('MATERIAL2'), allowEditing: false, width: 100 },
        { dataField: 'RATIO2', caption: this.$t('RATIO2'), allowEditing: false, width: 50 },

      ]
    }
  },

  methods: {
    onStatusChange(value) {
      console.log('Status select changed:', value);
    },

    searchOrder() {
      console.log('Search with parameters:', {
        dt_from: this.dt_from,
        dt_to: this.dt_to,
        from_seq: this.txt_from_seq,
        to_seq: this.txt_to_seq,
        itemType: this.selecteditemType,
        status: this.itemreporttype
      });

      this.$refs.grdDetail01.loadData();
    },

    async OnSave() {
      try {
        this.isProcessing = true;
        await this.$refs.grdDetail01.saveData();
      } catch (error) {
        console.error('Error saving data:', error);
      } finally {
        this.isProcessing = false;
      }
    },

    onDataSourceSet(data) {
      console.log('DataSource set with filter params:', this.$refs.grdDetail01.filterParams);
    },

    onCellClick(e) {
      console.log('Cell clicked:', e);
    },

    onResize() {
      // Implement resize logic if needed
    },
    async onReport() {

      let p_param = [
        this.dt_from,
        this.dt_to,
        this.txt_from_seq,
        this.txt_to_seq,
        this.selecteditemType,
        this.itemreporttype,
      ];
      // dt_from, dt_to, txt_from_seq, txt_to_seq, selecteditemType, itemreporttype

      let report_no = "01";
      let report_path = "";
      let report_name = "";
      let report_name_ext = "xlsx";
      let excel = [];
      let report = "SW_RPT_HAEIN_SWSO011";

      try {
        this._ExcelSaveAs(
          await this.$axios.$get("/dso/makereport", {
            responseType: "blob",
            params: {
              template: "report/sw/so/" + report + ".xlsx",
              excel: JSON.stringify([
                {
                  insertRange: [
                    {
                      range: "A1:H10",
                      proc: "SW_SEL_HAEIN_PRT_02",
                      params: [...p_param], //SW_SEL_SW10110_export_custom
                    },
                  ],
                  insertRows: [
                    {
                      startRow: 17,
                      proc: "SW_SEL_HAEIN_PRT_02",
                      params: [...p_param],
                      stringColumns: ["FAC", "ITEM_CODE"],
                      subStyle: {
                        font: { bold: true },
                        fill: {
                          type: "pattern",
                          pattern: "solid",
                          fgColor: { argb: "FFE599" },
                          bgColor: { argb: "FFE599" },
                        },
                      },
                    },
                  ],
                },
              ]),
              convert: "xlsx",
            },
          }),
          report + "." + "xlsx"
        );
      } catch (e) {
        this.showNotification(
          "danger",
          this.$t("fail_to_export_report"),
          "",
          4000
        );
      }
    },
    async onReport_csv() {

      let p_param = [
        this.dt_from,
        this.dt_to,
        this.txt_from_seq,
        this.txt_to_seq,
        this.selecteditemType,
        this.itemreporttype,
      ];
      // dt_from, dt_to, txt_from_seq, txt_to_seq, selecteditemType, itemreporttype

      let report_no = "01";
      let report_path = "";
      let report_name = "";
      let report_name_ext = "xlsx";
      let excel = [];
      let report = "SW_RPT_HAEIN_SWSO011_csv";

      try {
        this._ExcelSaveAs(
          await this.$axios.$get("/dso/makereport", {
            responseType: "blob",
            params: {
              template: "report/sw/so/" + report + ".xlsx",
              excel: JSON.stringify([
                {
                  insertRange: [
                    {
                      range: "A1:H10",
                      proc: "SW_SEL_HAEIN_PRT",
                      params: [...p_param], //SW_SEL_SW10110_export_custom
                    },
                  ],
                  insertRows: [
                    {
                      startRow: 2,
                      proc: "SW_SEL_HAEIN_PRT",
                      params: [...p_param],
                      stringColumns: ["FAC", "ITEM_CODE"],
                      subStyle: {
                        font: { bold: true },
                        fill: {
                          type: "pattern",
                          pattern: "solid",
                          fgColor: { argb: "FFE599" },
                          bgColor: { argb: "FFE599" },
                        },
                      },
                    },
                  ],
                },
              ]),
              convert: "xlsx",
            },
          }),
          report + "." + "xlsx"
        );
      } catch (e) {
        this.showNotification(
          "danger",
          this.$t("fail_to_export_report"),
          "",
          4000
        );
      }
    },
    async onReport2() {

      let p_param = [
        this.dt_from,
        this.dt_to,
        this.txt_from_seq,
        this.txt_to_seq,
        this.selecteditemType,
        this.itemreporttype,
      ];
      // dt_from, dt_to, txt_from_seq, txt_to_seq, selecteditemType, itemreporttype

      let report_no = "01";
      let report_path = "";
      let report_name = "";
      let report_name_ext = "xlsx";
      let excel = [];
      let report = "SW_RPT_PAKING_LIST_HAEIN_SWSO012";

      try {
        this._ExcelSaveAs(
          await this.$axios.$get("/dso/makereport", {
            responseType: "blob",
            params: {
              template: "report/sw/so/" + report + ".xlsx",
              excel: JSON.stringify([
                {
                  insertRange: [
                    {
                      range: "A1:H10",
                      proc: "SW_SEL_SWSO012",
                      params: [...p_param], //SW_SEL_SW10110_export_custom
                    },
                  ],
                  insertRows: [
                    {
                      startRow: 17,
                      proc: "SW_SEL_SWSO012",
                      params: [...p_param],
                      stringColumns: ["FAC", "ITEM_CODE"],
                      subStyle: {
                        font: { bold: true },
                        fill: {
                          type: "pattern",
                          pattern: "solid",
                          fgColor: { argb: "FFE599" },
                          bgColor: { argb: "FFE599" },
                        },
                      },
                    },
                  ],
                },
              ]),
              convert: "xlsx",
            },
          }),
          report + "." + "xlsx"
        );
      } catch (e) {
        this.showNotification(
          "danger",
          this.$t("fail_to_export_report"),
          "",
          4000
        );
      }
    },
    async onReport2_BK() {
      const data_seach = [{
        P_FILE_NAME_NEW: "SW_RPT_PAKING_LIST_HAEIN_SWSO012",
        dt_from: this.dt_from ? this.dt_from.replace("-", "") : "", // Thêm xử lý date format
        dt_to: this.dt_to ? this.dt_to.replace("-", "") : "",
        txt_from_seq: this.txt_from_seq || "",
        txt_to_seq: this.txt_to_seq || "",
        selecteditemType: this.selecteditemType || "",
        itemreporttype: this.itemreporttype || null
      }];

      var file_nm = "SW_RPT_PAKING_LIST_HAEIN_SWSO012" + "_" + this.user.USER_ID + ".xlsx";
      var url_path = "/report/rptswso420/rptswso012_heain";

      try {
        // Log để debug
        console.log('Sending params:', data_seach);

        const result = await this.$axios.$get(url_path, {
          responseType: "blob",
          params: {
            para: data_seach
          },
        });

        if (result) {
          this._ExcelSaveAs(result, file_nm);
        } else {
          this.showNotification(
            "danger",
            this.$t("fail_to_export_report"),
            "",
            4000
          );
        }
      } catch (e) {
        console.error('Full error:', e); // Log đầy đủ lỗi
        this.showNotification("danger", e.message, "", 4000);
      }
    },

    print() { },
  }
};
</script>