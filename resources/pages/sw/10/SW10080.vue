<template>
  <v-container fluid class="px-0 pt-0" v-resize="onResize">

    <v-card class="pa-1 pt-0 pr-2">
      <v-row align="center" justify="space-between" class="pt-2">
        <v-col md="2" class="pt-0">
          <BaseSelect outlined :label="$t('Customer')" v-model="tab01.lstCompany" :lstData="dataList.lstCompany"
            item-text="NAME" item-value="CODE" @change="" />
        </v-col>
        <v-col md="2" class="pt-0" v-if="true">
          <BaseDatePicker outlined v-model="tab01.dtOrderFrom" default :label="$t('date_from')"></BaseDatePicker>
        </v-col>

        <v-col md="2" class="pt-0" v-if="true">
          <BaseDatePicker outlined v-model="tab01.dtOrderTo" default :label="$t('to_date')"></BaseDatePicker>

        </v-col>
        <v-col md="2" class="pt-0">
          <v-text-field clearable dense hide-details :label="$t('PO_Search')" @keypress.enter="OnSearch(1)"
            v-model="tab01.txtPOsearch"></v-text-field>
        </v-col>

        <v-col md="2" class="pt-0">
          <v-text-field clearable dense hide-details :label="$t('UPC_Barcode')" @keypress.enter="OnSearch(1)"
            v-model="tab01.txtUPC_Barcode"></v-text-field>
        </v-col>

        <v-col md="2" class="pt-0">
          <v-row justify="end" class="mr-1">
            <BaseButton icon_type="check" :btn_text="$t('Check_Duplicate')" :disabled="isProcessing"
              @onclick="fetchCountDuplicate()" />
            <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="OnSearch(1)" />
            <BaseButton icon_type="excel" :btn_text="$t('excel')" :disabled="isProcessing" @onclick="onReport" />
          </v-row>
        </v-col>
      </v-row>
    </v-card>
    <v-card class="pt-0">
      <v-row align="center" justify="space-between" class="pt-0">
        <v-col cols="12" class="pt-0">
          <BaseGridView ref="grdDetail11" column-resizing-mode="widget" :auto_load="false" select_mode="MultipleHideBox"
            @keypress.enter="onSearch" :max_height="this.windowHeight * 0.73" sel_procedure="SW_SEL_SW10080_NOCACHE"
            upd_procedure="LG_UPD_9020OTM180_01_1" @onRowPrepared="onRowPreparedGrid11" :filter_paras="[
              tab01.lstCompany,
              tab01.dtOrderFrom,
              tab01.dtOrderTo,
              tab01.txtPOsearch,
              tab01.txtUPC_Barcode
            ]" :header="dataList.headerGrid11" />
        </v-col>
      </v-row>
    </v-card>

  </v-container>

</template>


<script>

export default {
  layout: "default",
  middleware: "user",

  components: {

  },
  data: () => ({

    isBegin: 1,

    dataList: {
      headerGrid01: [],
      headerGrid11: [],
      lstLocation: [],
      lstDateType: [],
      lstLabelType: [],
      lstCompany: [],
      dtOrderTo: []
    },
    isShowMess: "N",
    selectedTab: "1",
    tab01: {
      lstCompany: "",
      lstLocation: "",
      lstDateType: "",
      lstLabelType: "",
      dtOrderFrom: "",
      txtBasicCCY: "",
      txtUPC_Barcode: "",
      lstCCY: "",
      txtExRateFrom: "",
      txtCustomerName: "",
      dtOrderTo: "",
      txtExRateTo: "",
      txtPOsearch: "",
      txtCountDupllicate1: "",
    },

    lstHeader01: [],
    limitHeight01: 0,
    limitHeight02: 0,
    objClick: "",
    cellDblClickgrdDetail01: {}
  }),
  async created() {
    [this.dataList.lstCompany] = await this._getCommonCode2(["SWWMT02"]);

    this.dataList.lstDateType = [{ PK: '1', TEXT: 'Delivery Date' }, { PK: '2', TEXT: 'Order Date' }];
    //this.dataList.lstCompany = [{PK: '', TEXT: 'ALL'},{PK: 'PANKO', TEXT: 'PANKO'}, {PK: 'NOBLAND', TEXT: 'NOBLAND'}, {PK: 'YUPOONG', TEXT: 'YUPOONG'}, {PK: 'YAKJIN', TEXT: 'YAKJIN TRADING'}];
    this.dataList.lstLocation = [{ PK: '', TEXT: 'ALL' }, { PK: 'HÀ NỘI', TEXT: 'HÀ NỘI' }, { PK: 'HỒ CHÍ MINH', TEXT: 'HỒ CHÍ MINH' }, { PK: 'QUẢNG NAM', TEXT: 'QUẢNG NAM' }, { PK: 'ĐỒNG NAI', TEXT: 'ĐỒNG NAI' }, { PK: 'LONG AN', TEXT: 'LONG AN' }];



    [this.dataList.lstLabelType] = await this._getCommonCode2(["SZ010"]);
    //this.getListCodes();
    //this.SYS_SEL_LIST_COMPANY([this.user.PK, '', '', '', '', 5]);
    this.initView();

  },

  watch: {
    "tab01.dtOrderTo"(val) {
      //this.onGetCCYUnit();
    },
    "tab01.dtOrderFrom"(val) {
      //this.onGetInfo1();
    }
  },

  mounted() {
    /*TODO: */

  },
  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },

  },
  methods: {

    limitHeight() {
      this.limitHeight01 = this.windowHeight - 250;
      this.limitHeight02 = this.windowHeight - 250;
    },
    async fetchCountDuplicate() {
      const dso = {
        type: "process",
        updpro: "SW_SEL_SW10080_CNT_DUPL_NOCACHE",
        para: [
          this.tab01.lstCompany,
          this.tab01.dtOrderFrom,
          this.tab01.dtOrderTo,
          this.tab01.txtPOsearch,
          this.tab01.txtUPC_Barcode
        ]
      };
      let result01 = await this._dsoCall(dso, "process", false);
      if (result01.length > 0) {
        this.txtCountDupllicate1 = result01[0].TOTAL_COUNT_DUPPLICATE;
        this.showNotification('info', this.$t('Duplicate count: ' + this.txtCountDupllicate1, 'common'), this.txtCountDupllicate1.message);
      }
    },

    showNotification(type, title, message) {
      const notification = document.createElement('div');
      notification.innerHTML = `
    <div style="
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: white;
      border: 2px solid #007bff;
      border-radius: 10px;
      padding: 30px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.2);
      z-index: 9999;
      min-width: 300px;
      max-width: 80%;
      font-family: Arial, sans-serif;
    ">
      <h2 style="
        color: #007bff;
        margin-top: 0;
        margin-bottom: 20px;
        font-size: 24px;
      ">${title}</h2>
      <p style="
        font-size: 18px;
        line-height: 1.5;
        margin-bottom: 20px;
      ">${message || ''}</p>
      <button onclick="this.closest('div').remove()" style="
        background-color: #007bff;
        color: white;
        border: none;
        padding: 10px 20px;
        font-size: 16px;
        cursor: pointer;
        border-radius: 5px;
      ">OK</button>
    </div>
  `;
      document.body.appendChild(notification);
    },
    pushColumn(fieldName, fieldCaption, fieldWidth, isNumber) {
      let col;
      let dataType;

      switch (isNumber) {
        case 0:
          dataType = 'date';
          break;
        case 1:
          dataType = 'number';
          break;
        default:
          dataType = 'string';
          break;
      }

      col = {
        dataField: fieldName,
        caption: fieldCaption,
        allowEditing: false,
        width: fieldWidth,
        dataType: dataType
      };
      return col;
    },
    initView() {
      this.dataList.headerGrid01 = [
        this.pushColumn("PO_DATE", this.$t("PO_date"), 160, 0,),
        this.pushColumn("PO_NO", this.$t("PO_NO"), 140,),
        this.pushColumn("UPC_A_CODE", this.$t("UPC"), 140,),
        this.pushColumn("SERIAL_NO", this.$t("Serial_no"), 140,),
        this.pushColumn("EPC_NO", this.$t("EPC_No"), 230,),
        this.pushColumn("TID", this.$t("TID"), 330,),
      ];
      this.dataList.headerGrid11 = [...this.dataList.headerGrid01];
    },



    // pushColumn(fieldName, fieldCaption, fieldWidth, isNumber) {
    //   let col;

    //   if (isNumber === 0) {
    //     col = {
    //       dataField: fieldName,
    //       caption: fieldCaption,
    //       allowEditing: false,
    //       width: fieldWidth,
    //       dataType: isNumber === 0 ? 'date' : 'string',

    //     };
    //   }
    //   else {
    //     col = {
    //       dataField: fieldName,
    //       caption: fieldCaption,
    //       allowEditing: false,
    //       width: fieldWidth,
    //       dataType: 'number',
    //       format: '#,##0',
    //       alignment: 'right',
    //     };
    //     if (isNumber === 1) {
    //       col = {
    //         dataField: fieldName,
    //         caption: fieldCaption,
    //         allowEditing: false,
    //         width: fieldWidth,
    //         dataType: 'date',
    //       };
    //     }

    //   }
    //   return col;
    // },


    // initView() {
    //   this.dataList.headerGrid01 = [
    //     this.pushColumn("PO_DATE", this.$t("PO_date"), 180, 1, "date"),
    //     this.pushColumn("PO_NO", this.$t("PO_NO"), 140, 0),
    //     this.pushColumn("UPC_A_CODE", this.$t("UPC"), 140, 0),
    //     this.pushColumn("SERIAL_NO", this.$t("Serial_no"), 140, 0),
    //     this.pushColumn("EPC_NO", this.$t("EPC_No"), 230, 0),
    //     this.pushColumn("TID", this.$t("TID"), 230, 0),
    //     this.pushColumn("COUNT_DUPLICATE", this.$t("COUNT_DUPLICATE"), 140, 0),
    //   ];
    //   this.dataList.headerGrid11 = [...this.dataList.headerGrid01];
    // },

    // initView() {

    //   this.dataList.headerGrid01 =
    //     [
    //       {
    //         dataField: "PO_DATE",
    //         caption: this.$t("PO_date"),
    //         allowEditing: false,
    //         allowMerge: true,
    //         dataType: "date",
    //         bgColor: "#FFFFFF",
    //         width: 160
    //       },
    //       {
    //         dataField: "PO_NO",
    //         caption: this.$t("PO_NO"),
    //         allowEditing: false,
    //         allowMerge: true,
    //         bgColor: "#FFFFFF",
    //         width: 160
    //       },
    //       {
    //         dataField: "UPC_A_CODE",
    //         caption: this.$t("UPC"),
    //         allowEditing: false,
    //         allowMerge: true,
    //         bgColor: "#FFFFFF",
    //         width: 160
    //       },
    //       {
    //         dataField: "SERIAL_NO",
    //         caption: this.$t("Serial_no"),
    //         allowEditing: false,
    //         width: 160
    //       },
    //       {
    //         dataField: "EPC_NO",
    //         caption: this.$t("EPC_No"),
    //         allowEditing: false,
    //         width: 240
    //       },
    //       {
    //         dataField: "TID",
    //         caption: this.$t("TID"),
    //         allowEditing: false,
    //         width: 280
    //       },
    //       {
    //         dataField: "COUNT_DUPLICATE",
    //         caption: this.$t("COUNT_DUPLICATE"),
    //         allowEditing: false,
    //         width: 140
    //       }
    //     ];
    //   this.dataList.headerGrid11 = [...this.dataList.headerGrid01];
    // },
    OnSearch(obj) {
      if (obj == '1') {
        const orderNo = this.tab01.txtUPC_Barcode || '';
        const poSearch = this.tab01.txtPOsearch || '';

        if (orderNo.trim().length !== 0 || poSearch.trim().length !== 0) {
          this.$refs.grdDetail11.loadData();
          return;
        } else {
          alert("Pls, input UPC(Barcode) or input PO_Search to search!");
        }
      }
    },

    onRowClickDetail(row) {
      this.tab02.txtPartnerPK = row.data.CUST_PK;
      this.$refs.grdDetail22.loadData();
    },

    onRowPreparedGrid11(e) {
      this.onRowPreparedGrid_ALL(e);
    },
    onRowPreparedGrid22(e) {
      this.onRowPreparedGrid_ALL(e);
    },

    onRowPreparedGrid_ALL(e) {
      if (e.rowType === "data") {
        if (e.data.ISTOTAL === 1) {
          e.rowElement.style.fontWeight = "bold"
          e.rowElement.style.background = "#FFE599";

        }
      }
    },


    async onGetCCYUnit() {
      const dso = {
        type: "process",
        updpro: "LG_PRO_9020OTM180_03",
        para: [
          this.tab01.dtOrderTo
        ]
      };
      let result01 = await this._dsoCall(dso, "process", false);
      if (result01.length > 0) {
        this.tab01.txtUPC_Barcode = result01[0].CCY_UNIT;
      }
    },

    async getHeader01(obj) {
      if (obj === 1) {
        const dso = {
          type: "process",
          updpro: "LG_PRO_9020OTM180_01",
          para: [this.tab01.dtOrderFrom]
        };
        this.lstHeader01 = await this._dsoCall(dso, "process", false);
        if (this.lstHeader01.length > 0) {
          this.processHeader1(obj);
        }
      }
    },

    /*NOTE: */
    async SYS_SEL_LIST_COMPANY(_param) {
      const dso = {
        type: "list",
        selpro: "GSF20_LG_GET_COMMON_LIST",
        para: _param,
      };
      this.dataList.lstCompany = await this._dsoCall(dso, "select", false);
      //this.dataList.lstCompany.unshift({PK: "", TEXT: ""});
      if (this.dataList.lstCompany.length > 0) {
        this.tab01.lstCompany = this.dataList.lstCompany[0]["PK"];
      }

    },

    async SYS_SEL_LIST_COMPANY_ALL() {
      const dso = {
        type: "list",
        selpro: "sys_get_company",
        para: null,
      };
      this.dataList.lstCompany = await this._dsoCall(dso, "select", false);
      this.dataList.lstCompany.unshift({ PK: '', TEXT: this.$t('all') });
      if (this.dataList.lstCompany.length > 0) {
        this.tab01.lstCompany = this.dataList.lstCompany[0]["PK"];
      }
    },
    async getListCodes() {
      let lstCommoncode = await this._getCommonCode2(['SZ010'], this.user.TCO_COMPANY_PK);
      this.lstLabelType = lstCommoncode[0];
    },


    async onReport() {
      let p_param = [
        this.tab01.lstCompany,
        this.tab01.dtOrderFrom,
        this.tab01.dtOrderTo,
        this.tab01.txtPOsearch,
        this.tab01.txtUPC_Barcode
      ];
      let report_no = "01";
      let report_path = "";
      let report_name = "";
      let report_name_ext = "xlsx";
      let excel = [];


      let report = "rpt_sw10080_serial_no_inquiry";

      //rpt_swso410_EC_Carelabel_02
      try {
        //alert(p_param);
        this._ExcelSaveAs(await this.$axios.$get('/dso/makereport', {
          responseType: "blob", params: {
            template: "report/10/10/" + report + ".xlsx",
            excel: JSON.stringify([{
              insertRange: [{
                range: "A4:H4", proc: "SW_SEL_SW10080_NOCACHE", params: [...p_param]//SW_SEL_SW10110_export_custom
              }],
              insertRows: [{
                startRow: 6, proc: "SW_SEL_SW10080_NOCACHE", params: [...p_param], stringColumns: ["PO_NO", "ITEM"], subStyle: {
                  font: { bold: true }, fill: {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFE599' },
                    bgColor: { argb: 'FFE599' }
                  }
                }
                //startRow: 8, proc: "SW_SEL_SW10090_REPORT_FACT_DT", params: [...p_param]
              }]
            }]),
            convert: "xlsx"
          }
        }), report + "." + "xlsx");
      } catch (e) {
        this.showNotification("danger", this.$t("fail_to_export_report"), "", 4000);
      }


    },
    print() { },

    async onReport2() {
      let p_param = [
        tab01.dtOrderFrom,
        tab01.dtOrderTo,
        this.tab01.lstCompany,

        this.tab01.txtUPC_Barcode

      ];
      let report_no = "01";
      let report_path = "";
      let report_name = "";
      let report_name_ext = "xlsx";
      let excel = [];

      switch (report_no) {
        case "01":
          //alert(p_param);
          report_path = "report/10/10/rpt_sw10080_serial_no_inquiry.xlsx";
          report_name = "rpt_sw10080_serial_no_inquiry." + report_name_ext;
          excel = [
            {
              sheet: 1,
              insertRange: [
                //{ range: "A1:T4", proc: "LG_RPT_COMPANY_INFO_02", params: [this.tab01.lstCompany], imageColumns: ["COM_PIC"]  },
                { range: "A6:I6", proc: "SW_SEL_SW10080_NOCACHE", params: [...p_param] },//master
              ],
              insertRows: [
                {

                  startRow: 6, proc: "SW_SEL_SW10080_NOCACHE", params: [...p_param], subStyle: {
                    font: { bold: true }, fill: {
                      type: 'pattern',
                      pattern: 'solid',
                      fgColor: { argb: 'FFE599' },
                      bgColor: { argb: 'FFE599' }
                    }
                  }


                }
              ],
            },
          ];
          break;
        default: report_path = ""; break;
      }

      if (!report_path) {
        this.showNotification(
          "danger",
          this.$t("please_select_report"),
          "",
          4000
        );
        return;
      }

      const res = await this.$axios.$get('/dso/makereport', { responseType: "blob", params: { template: report_path, excel: JSON.stringify(excel), convert: report_name_ext } });
      if (res) {
        this._ExcelSaveAs(res, report_name);
      } else {
        this.showNotification("danger", this.$t("fail_to_export_report"), "", 4000);
      }

    },

  }
};
</script>

<style>
.btn {
  min-width: 100px;
  min-height: 30px;
  max-width: 100px;
  max-height: 30px;
}
</style>
