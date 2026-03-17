<template>
  <div>
    <GwGridLayout dense align="start" colsPerRow="1" containerHeight="auto" containerClass="py-0 px-1" @callBackHeight="parentHeight = $event">
      <GwGridLayout child dense flat colspan="4" align="start" colsPerRow="1" containerHeight="auto" containerClass="py-0 px-1" @callBackHeight="childrenHeight = $event">
        <BaseDatePicker colspan="4" outlined default :clearable="false" :label="$t('from_date')" v-model="fromDate" />
        <BaseDatePicker colspan="4" outlined default :clearable="false" :label="$t('to_date')" v-model="toDate" />
        <GwFlexBox colspan="4" align-self="center" justify="end">
          <BaseButton :btn_text="$t('search')" :disabled="isProcessing" :loading="isProcessing" @onclick="search" />
        </GwFlexBox>
        <DataGridView 
          colspan="12" 
          column-resizing-mode="widget" 
          ref="gridOrder" 
          :header="headersOrder" 
          sel_procedure="SW_SEL_SW30060_3_TEST" 
          :filter_paras="[fromDate, toDate]" 
          :filterRow="true" 
          select_mode="Single" 
          :auto_load="false" 
          :max_height="gridHeight"
          @onRowPrepared="onRowPrepared_0" 
          @cellClickData="onCellClickDataGrid1" 
        />
      </GwGridLayout>

      <GwGridLayout child dense flat colspan="8" align="start" colsPerRow="1" containerHeight="auto" containerClass="py-0 px-1" @callBackHeight="childrenHeight2 = $event">
         <GwFlexBox colspan="2" align-self="center" justify="end">
          <BaseButton :btn_text="$t('interface')" :disabled="isProcessing" :loading="isProcessing" @onclick="setPrinter" />
        </GwFlexBox>
       
        <GwGridLayout colspan="12" child dense flat align="start" colsPerRow="1" containerHeight="auto" containerClass="py-0 px-1">
          <BaseTabs @changed="tabChanged">
            <BaseTab :name="$t('color')" tabname="color" :eager="true">
              <DataGridView 
                column-resizing-mode="widget" 
                ref="gridColor" 
                :header="headersColor" 
                sel_procedure="SW_SEL_SW30030_4_TEST" 
                :filter_paras="[P_BRANDGROUP, P_ORDERDATE, P_ORDERNO]" 
                :filterRow="true" 
                select_mode="Multiple" 
                :auto_load="false" 
                :max_height="gridHeight2 - 35 - 16" 
                @cellClickData="onCellClickDataGrid2"
              />
            </BaseTab>
            <BaseTab :name="$t('material')" tabname="material" :eager="true">
              <DataGridView 
                column-resizing-mode="widget" 
                ref="gridMaterial" 
                :header="headersMaterial" 
                sel_procedure="SW_SEL_SW30030_5_TEST" 
                :filter_paras="[P_BRANDGROUP, P_ORDERDATE, P_ORDERNO]" 
                :filterRow="true" 
                select_mode="Single" 
                :auto_load="false" 
                :max_height="gridHeight2 - 35 - 16" 
              />
            </BaseTab>
          </BaseTabs>
          <GwFlexBox justify="space-between">
            <span class="red--text font-weight-bold">{{ $t('total_rows') }}: {{gridTIDTotalRow}}</span>
            <v-spacer></v-spacer>
            <BaseButton :btn_text="$t('interface')" :disabled="isProcessing" :loading="isProcessing" @onclick="Interface_Detail" />
           
          </GwFlexBox>
          <BaseGridView 
            :pager="true" 
            column-resizing-mode="widget" 
            ref="gridTID" 
            :header="headersTID" 
            sel_procedure="SW_SEL_SW30060_6_TEST" 
            :filter_paras="[P_BRANDGROUP, P_ORDERDATE, P_ORDERNO, P_COLOR, P_SIZES]" 
            :filterRow="true" 
            select_mode="Multiple" 
            :auto_load="false" 
            :max_height="gridHeight2 - 36 - 35 - 30"
            @rowCount="gridTIDTotalRow = $event" 
          />
        </GwGridLayout>      
      </GwGridLayout>
    </GwGridLayout>
    <alert-dialog ref="alertDialog"></alert-dialog>
  </div>
</template>

<script>
import moment from "moment";
export default {
  layout: "default",
  middleware: "user",

  components: {
    AlertDialog: () => import("@/components/dialog/AlertDialog")
  },

  data: () => ({
    parentHeight: 0,
    childrenHeight: 0,
    childrenHeight2: 0,
    childrenHeight3: 0,
    fromDate: moment().subtract(1, "week").format("YYYYMMDD"),
    toDate: "",
    selectedStatus: "",
    printerList: [],
    printerStatusList: [],
    selectedPrinter: "",
    selectedTab: "order",
    selectedIFNo: "",
    selectedIFNo2: "",
    selectedBarCode: "",
    P_BRANDGROUP: "",
    P_ORDERDATE: "",
    P_ORDERNO: "",
    P_COLOR: "",
    P_SIZES: "",
    P_KIND: "",
    P_CAREQTY: "",
    bgColor1: "#FCE5CD",
    selectedReportType: "",
    reportType: {
      template: "",
      proc: "",
      proc2: "",
      fileName: "",
    },
    reportParams: [],
    gridTIDTotalRow: 0,
    ifNoPKArray: [],
    PK_TID_Array_d: [],
    selectedSetColumn:'CONTRACT_TYPE',
    setColumnValue:'',
  }),

  async created() {
    [this.printerList, this.printerStatusList] = await this._getCommonCode2(["SZ001", "SZ006"]);
  },

  computed: {
    statusList() {
      return [
        { value: 1, text: this.$t("new") },
        { value: 2, text: this.$t("confirm") },
        { value: 3, text: this.$t("finish_delivery") },
      ];
    },
    reportTypeList() {
      return [
        { value: "1.1", text: "TagLabel RFID Y 1" },
        { value: "1.2", text: "TagLabel RFID N 1" },
        { value: "2.3", text: "Care Label" },
       
      ];
      /*
       { value: "1.1", text: "TagLabel RFID Y 1" },
        { value: "1.2", text: "TagLabel RFID N 1" },
        { value: "2.1", text: "TagLabel RFID Y" },
        { value: "2.2", text: "TabLabel RFID N" },
        { value: "2.3", text: "Care Label" },
        { value: "3", text: this.$t("csv_english_none_rfid") },
        { value: "4", text: this.$t("csv_china_none_rfid") },
        { value: "5", text: this.$t("csv_korea_none_rfid") },
      */
    },
    gridHeight() {
      return this._calculateHeight(this.childrenHeight, 85);
    },
    gridHeight2() {
      return this._calculateHeight(this.childrenHeight2, 45);
    },
    headersOrder() {
      return [
        { dataField: "ORDERDATE", caption: this.$t("order_date"), dataType: "date", allowEditing: false },
        { dataField: "ORDERNO", caption: this.$t("order_no"), allowEditing: false },
        { dataField: "BRANDNAME", caption: this.$t("brand_name"), allowEditing: false },
        { dataField: "RFID_YN", caption: this.$t("rfid_yn"), allowEditing: false },
        { dataField: "TOTWORKITEM", caption: this.$t("totworkitem"), allowEditing: false, summaryType: "sum", formatFloat: "0" },
        { dataField: "CAREQTY", caption: this.$t("careqty"), allowEditing: false, summaryType: "sum", formatFloat: "0" },
        { dataField: "ORDER_NAME", caption: this.$t("order_name"), allowEditing: false },
      ];
    },
    headersColor() {
      return [
        { dataField: "IF_SEQ", caption: this.$t("if_seq"), allowEditing: false },
        { dataField: "COLOR", caption: this.$t("color"), allowEditing: false },
        { dataField: "SIZES", caption: this.$t("sizes"), allowEditing: false },
        { dataField: "QTY", caption: this.$t("qty"), allowEditing: false, summaryType: "sum", formatFloat: "0" },
        { dataField: "BARCODE", caption: this.$t("barcode"), allowEditing: false },
        { dataField: "SIZES_CHN", caption: this.$t("sizes_chn"), allowEditing: false },

        { dataField: "PRINTER_NAME", caption: this.$t("printer_name"), lookup: { dataSource: this.printerList, displayExpr: "CODE_NM", valueExpr: "CODE" }, allowEditing: false },
        { dataField: "PRINT_STATUS", caption: this.$t("print_status"), lookup: { dataSource: this.printerStatusList, displayExpr: "CODE_NM", valueExpr: "CODE" }, allowEditing: false },

        { dataField: "BRANDGROUP", caption: this.$t("brandgroup"), allowEditing: false },
        { dataField: "ORDERDATE", caption: this.$t("orderdate"), allowEditing: false },
        { dataField: "ORDERNO", caption: this.$t("orderno"), allowEditing: false },

        { dataField: "SIZES_ENG", caption: this.$t("sizes_eng"), allowEditing: false },
        { dataField: "COLOR_ENG", caption: this.$t("color_eng"), allowEditing: false },
        { dataField: "COLOR_CHN", caption: this.$t("color_chn"), allowEditing: false },
        { dataField: "SIZES_TWN", caption: this.$t("sizes_twn"), allowEditing: false },
        { dataField: "COLOR_TWN", caption: this.$t("color_twn"), allowEditing: false },
        { dataField: "FIT_TYPE", caption: this.$t("fit_type"), allowEditing: false },
        { dataField: "FILL", caption: this.$t("fill"), allowEditing: false },
        { dataField: "TAG_FILL", caption: this.$t("tag_fill"), allowEditing: false },
        { dataField: "RFID_LABEL_TYPE", caption: this.$t("rfid_label_type"), allowEditing: false },
        { dataField: "RFID_LABEL_TYPE_NAME", caption: this.$t("rfid_label_type_name"), allowEditing: false },
        { dataField: "SIZES_RING", caption: this.$t("sizes_ring"), allowEditing: false },
        { dataField: "SIZES_RING_INNER", caption: this.$t("sizes_ring_inner"), allowEditing: false },
        { dataField: "PRINT_SIZES", caption: this.$t("print_sizes"), allowEditing: false },
        { dataField: "IF_NO", caption: this.$t("if_no"), allowEditing: false },
        { dataField: "IF_GUBUN", caption: this.$t("if_gubun"), allowEditing: false },
        { dataField: "IF_FLAG", caption: this.$t("if_flag"), allowEditing: false },
        { dataField: "IF_DATE", caption: this.$t("if_date"), allowEditing: false },
        { dataField: "CREATE_DATE", caption: this.$t("create_date"), allowEditing: false },
      ];
    },
    headersMaterial() {
      return [
        
        { dataField: "IF_NO", caption: this.$t("if_no"), allowEditing: false, bgColor: this.bgColor1 },
        { dataField: "IF_SEQ", caption: this.$t("if_seq"), allowEditing: false },
        { dataField: "IF_GUBUN", caption: this.$t("if_gubun"), allowEditing: false },
        { dataField: "IF_FLAG", caption: this.$t("if_flag"), allowEditing: false },
        { dataField: "IF_DATE", caption: this.$t("if_date"), dataType: "date", allowEditing: false },
        { dataField: "BRANDGROUP", caption: this.$t("brandgroup"), allowEditing: false },
        { dataField: "ORDERDATE", caption: this.$t("orderdate"), dataType: "date", allowEditing: false },
        { dataField: "ORDERNO", caption: this.$t("orderno"), allowEditing: false },
        { dataField: "NUM", caption: this.$t("num"), allowEditing: false },
        { dataField: "GUBUN", caption: this.$t("gubun"), allowEditing: false },
        { dataField: "MATERIAL", caption: this.$t("material"), allowEditing: false },
        { dataField: "MIXRATE", caption: this.$t("mixrate"), allowEditing: false },
        { dataField: "GUBUN_ENG", caption: this.$t("gubun_eng"), allowEditing: false },
        { dataField: "GUBUN_CHN", caption: this.$t("gubun_chn"), allowEditing: false },
        { dataField: "MATERIAL_ENG", caption: this.$t("material_eng"), allowEditing: false },
        { dataField: "MATERIAL_CHN", caption: this.$t("material_chn"), allowEditing: false },
        { dataField: "GUBUN_TWN", caption: this.$t("gubun_twn"), allowEditing: false },
        { dataField: "MATERIAL_TWN", caption: this.$t("material_twn"), allowEditing: false },
        { dataField: "COLOR", caption: this.$t("color"), allowEditing: false },
        { dataField: "TEAMCODE", caption: this.$t("teamcode"), allowEditing: false },
        { dataField: "COLOR_INFO", caption: this.$t("color_info"), allowEditing: false },
        { dataField: "CREATE_DATE", caption: this.$t("create_date"), allowEditing: false },
      ];
    },
    headersTID() {
      return [
        {dataField: 'CHK',caption: this.$t('CHK'), allowEditing: true,dataType:'checkbox' },
        { dataField: "IF_SEQ", caption: this.$t("if_seq"), allowEditing: false },
        { dataField: "SERIAL_CD", caption: this.$t("serial_cd"), allowEditing: false },
        { dataField: "COLOR", caption: this.$t("color"), allowEditing: false },
        { dataField: "SIZES", caption: this.$t("sizes"), allowEditing: false },
        { dataField: "RFID_CD", caption: this.$t("rfid_cd"), allowEditing: false },
        { dataField: "CD_RFIDTID", caption: this.$t("tid"), allowEditing: false },
        { dataField: "RFID_BRAND", caption: this.$t("rfid_brand"), allowEditing: false },
        { dataField: "ORDERCOMPANY", caption: this.$t("ordercompany"), allowEditing: false },
        { dataField: "IF_NO", caption: this.$t("if_no"), allowEditing: false, bgColor: this.bgColor1 },
        { dataField: "IF_GUBUN", caption: this.$t("if_gubun"), allowEditing: false },
        { dataField: "IF_FLAG", caption: this.$t("if_flag"), allowEditing: false },
        { dataField: "IF_DATE", caption: this.$t("if_date"), allowEditing: false },
        { dataField: "BRANDGROUP", caption: this.$t("brandgroup"), allowEditing: false },
        { dataField: "ORDERDATE", caption: this.$t("orderdate"), dataType: "date", allowEditing: false },
        { dataField: "ORDERNO", caption: this.$t("orderno"), allowEditing: false },
        { dataField: "CREATE_DATE", caption: this.$t("create_date"), allowEditing: false },
       
      ];
    },
  },

  methods: {
    search() {
      this.$refs.gridOrder.loadData();
    },
    //---------------------------------------------
    /*onSet(){
        let setValue = this.setColumnValue ;
        this.$refs.gridTID.onSet(this.selectedSetColumn, setValue);
      },*/
    //----------------------------------------------
    onRowPrepared_0(e) {
      if (e.rowType === "data") {
        if (e.rowType === "data") {
          if (e.data.RFID_YN == "Y") {
            e.rowElement.style.fontWeight = "bold";
            e.rowElement.style.background = "#FFECD9";
            e.rowElement.style.color = "RED";
          } else {
            if (e.data.CAREQTY != "0") {
              e.rowElement.style.color = "BLUE";
              e.rowElement.style.fontWeight = "bold";
            } else {
              // e.rowElement.style.color = "YELLOW";
              e.rowElement.style.fontWeight = "bold";
            }
          }
        }
      }
    },
    /****************** */

    async setPrinter() {
      try {
        let ds = this.$refs.gridColor.getSelectRowsData();
        await this.$nextTick();
        if(!ds.length) {
          this.showNotification("danger", this.$t('please_select_data'), "")
          return;
        }
        this.ifNoPKArray = ds.map(item => item.PK).join(",");
        // console.log("ifNoPKArray:", this.ifNoPKArray)
        const dso = { 
          type: "process", 
          updpro: "SW_PRO_SW30060_INF_M_TEST1", 
          para: [ "u", this.P_BRANDGROUP, this.P_ORDERDATE, this.P_ORDERNO,  this.ifNoPKArray ]
        };
        const result = await this._dsoCall(dso, "process", false);
        // console.log("confirm:", result);
        this.$refs.gridColor.loadData();
        this.$refs.gridTID.loadData();
        if(result) {
          this.showNotification('success', this.$t('process_success'), "", 500);
        }
      } catch (error) {
        console.log("confirm-setPrinter exception:", error.message)
      }
    },
    /*Interface_Detail*/
    async Interface_Detail() {
      try {
        let ds = this.$refs.gridTID.getDataSource();
       // this.$refs.userDataGrid.getDataSource();
        await this.$nextTick();
        if(!ds.length) {
          this.showNotification("danger", this.$t('please_select_data'), "")
          return;
        }
        for(var i = 0; i < ds.length; i++){
          if(ds[i].CHK==true)
          {
            this.PK_TID_Array_d += ds[i].PK + "," ;
          }  
        }
        this.PK_TID_Array_d += 0;
       //  console.log("check:",  ds.map(item => item.CHK));
        //  ds.map(item => item.PK)
        //this.PK_TID_Array_d = ds.map(item => item.PK).join(",");
         console.log("ifNoPKArray:", this.PK_TID_Array_d)
        const dso = { 
          type: "process", 
          updpro: "SW_PRO_SW30060_INF_D_TEST", 
          para: [ "u", this.P_BRANDGROUP, this.P_ORDERDATE, this.P_ORDERNO,  this.PK_TID_Array_d ]
        };
        const result = await this._dsoCall(dso, "process", false);
        this.$refs.gridTID.loadData();
        if(result) {
          this.showNotification('success', this.$t('process_success'), "", 500);
        }
      } catch (error) {
        console.log("Interface detail exception:", error.message)
      }
    },

    /*-------------------------------------*/
    async downloadExcel() {
      try { 
        this.isProcessing = true;
        var reportPath;
        var reportName = this.report_name;
        var proc;
        var proc2;
        var params;
        switch (this.selectedReportType) {
          case "1":
            /* reportPath = "report/SW/20/RPT_SW20030_1.xlsx";
            proc = "SW_RPT_SW20030_1_NOCACHE";
            reportName = "RPT_SW20030_1.xlsx";
            params = [this.selectedIFNo]; */
            break;
          case "1.1":
            reportPath = "report/SW/20/RPT_SW20030_RFID_Y_1.xlsx";
            proc = "SW_RPT_SW20030_RFID_Y";
            //reportName = "RPT_SW20030_RFID_Y_1.xlsx";
            params = this.reportParams;
            break;
          case "1.2":
            reportPath = "report/SW/20/RPT_SW20030_RFID_N_1.xlsx";
            proc = "SW_RPT_SW20030_RFID_N";
            //reportName = "RPT_SW20030_RFID_N_1.xlsx";
            params = this.reportParams;
            break;
          case "2.1":
            reportPath = "report/SW/20/RPT_SW20030_RFID_Y.xlsx"; // this.reportType.template;
            proc = "SW_RPT_SW20030_22_NOCACHE"; // this.reportType.proc;
            proc2 = "SW_SEL_SW20030_22H_NOCACHE"; // this.reportType.proc2;
            //reportName = "RPT_SW20030_RFID_Y.xlsx"; // this.reportType.fileName;
            params = this.reportParams;            
            break;
          case "2.2":
            reportPath = "report/SW/20/RPT_SW20030_RFID_N.xlsx" // this.reportType.template;
            proc = "SW_RPT_SW20030_3_NOCACHE"; //this.reportType.proc;
            proc2 = "SW_SEL_SW20030_3H_NOCACHE"; //this.reportType.proc2;
            //reportName = "RPT_SW20030_RFID_N.xlsx"; // this.reportType.fileName;
            params = this.reportParams;
            break;
          case "2.3":
            reportPath = "report/SW/20/RPT_SW20030_CARELABEL.xlsx"; // this.reportType.template;
            proc = "SW_RPT_SW20030_C_NOCACHE"; // this.reportType.proc;
            proc2 = "CARELABEL"; // this.reportType.proc2;
            //reportName = "RPT_SW20030_CARELABEL.xlsx"; //this.reportType.fileName;
            params = this.reportParams;
            break;
          case "3":
            reportPath = "report/SW/20/RPT_SW20030_NO_RFID_ENG.xlsx";
            proc = "SW_RPT_SW20030_NO_RFID_ENG";
            //reportName = "RPT_SW20030_NO_RFID_ENG.xlsx";
            params = this.reportParams;
            break;
          case "4":
            reportPath = "report/SW/20/RPT_SW20030_NO_RFID_CHN.xlsx";
            proc = "SW_RPT_SW20030_NO_RFID_CHN";
            //reportName = "RPT_SW20030_NO_RFID_CHN.xlsx";
            params = this.reportParams;
            break;
          case "5":
            reportPath = "report/SW/20/RPT_SW20030_RFID_KOR.xlsx";
            proc = "SW_RPT_SW20030_RFID_KOR";
            //reportName = "RPT_SW20030_RFID_KOR.xlsx";
            params = this.reportParams;
            break;
          default:
            break;
        }

        if (!this.selectedIFNo) {
          this.showNotification("danger", this.$t("please_select_an_order"), "");
          return;
        }

        let excel = [];
        var insertHeader = [];

        if(this.selectedReportType === "2.1" || this.selectedReportType === "2.2" || this.selectedReportType === "2.3") {
          if(proc2 === "CARELABEL") {
            excel = [
              { 
                sheet: 1, 
                insertRange: [
                  {
                    range: "C1:D1",
                    proc: proc,
                    params: ['u']
                  }
                ]                  
              }
            ];
          } else {
            /* const res = await this._callProcedure(proc2, params);
            if(res && res.length) {
              const keys = Object.keys(res[0]);
              excel = [
                { 
                  sheet: 1, 
                  insertHeader: [{ 
                    startRow: 1, 
                    column: "CH", 
                    merge: "row",
                    data: [keys]
                  }],
                  insertRows: [{ startRow: 2, by: "index", proc: proc, params: [...params] }]
                }
              ];
            } */
            excel = [
              { 
                sheet: 1,                  
                insertRows: [{ startRow: 2, by: "index", proc: proc, params: [...params] }]
              }
            ];
          }
        } else {
          excel = [
            { 
              sheet: 1, 
              insertRows: [{ startRow: 2, by: "index", proc: proc, params: [...params] }]
            }
          ];
        }

        /* console.log(`reportPath: ${reportPath} - proc: ${proc} - params: ${params} - reportName: ${reportName}`); */
        // console.log(excel) 
        const res = await this.$axios.$get('/dso/makereport', { 
          responseType: "blob", 
          params: { 
            template: reportPath,
            excel: JSON.stringify(excel), 
            debug: true  
          } 
        });
        // console.log("res:", res)
        if(res) {
          if(proc2 === "CARELABEL") {
            /* const message = `
            [KO] 이것은 취급주의 라벨 오더입니다. 'KIND' 을(를) 'CAREQTY' 개 생산하십시오.
            [EN] It's PO of Handle with care label, please produce 'CAREQTY' of 'KIND' label.
            [VN] Đây là đơn đặt hàng nhãn mác chú ý sử dụng. Hãy sản xuất cái mác 'CAREQTY' của 'Kind'.
            ` */
            const message = this.$t("export_success_message", { careQty: this.P_CAREQTY, kind: this.P_KIND });
            // console.log("message:", message);
            this.$refs.alertDialog.showAlert("success", "success", "", message);
            // this.showNotification("success", this.$t("export_success_message"), "", 6000);
          }
          this._ExcelSaveAs(res, reportName);          
          this.isProcessing = false;
        } else {
          this.isProcessing = false;
          this.showNotification( "danger", this.$t("fail_to_export_report"), "", 4000 )          
        }
      } catch (error) {
        this.isProcessing = false;
        console.log("downloadExcel-catch exception:", error.message);
      } finally {
        this.isProcessing = false;
      }
    },

    async excelDownloadByBarcode() {
      try {
        if (!this.selectedIFNo2) {
          return;
        }
        this.isProcessing = true;
        let report_path = "report/SW/20/RPT_SW20030_2.xlsx";
        let report_name =this.report_name;
        let excel = [];
        const headerRows = ["Goods", "Barcode", "QR Code", "Sizes", "Color", "Gubun", "Material", "Mixrate", "Country", "Order name", "Product YM", "Degree", "Serial Number", "Quantity Color"];
        excel = [
          {
            sheet: 1,
            insertHeader: [
              {
                startRow: 1,
                column: "A",
                merge: "row",
                data: headerRows,
              },
            ],
            insertRows: [
              {
                startRow: 2,
                by: "index",
                // column: "E",
                proc: "SW_RPT_SW20030_2_NOCACHE",
                params: [this.P_BRANDGROUP, this.P_ORDERDATE, this.P_ORDERNO, this.selectedBarCode],
              },
            ],
          },
        ];

        const res = await this.$axios.$get("/dso/makereport", {
          responseType: "blob",
          params: {
            template: report_path,
            excel: JSON.stringify(excel),
            debug: true,
          },
        });
        if (res && res.size > 0) {
          this._ExcelSaveAs(res, report_name);
          this.isProcessing = false;
        } else {
          this.isProcessing = false;
          this.showNotification("danger", this.$t("fail_to_export_report"), "", 4000);
        }
      } catch (error) {
        this.isProcessing = false;
        console.log("excelDownloadByBarcode-catch exception:", error.message);
      }
    },

    tabChanged(val) {
      this.selectedTab = val.tab.$attrs.tabname;
      this.searchFromTab(this.selectedTab);
    },

    onCellClickDataGrid1({ IF_NO, RFID_YN, CAREQTY, BRANDGROUP, ORDERDATE, ORDERNO, COLOR, SIZES,Z_STYLE_NO, KIND }) {      
      this.selectedIFNo = IF_NO;
      this.P_BRANDGROUP = BRANDGROUP;
      this.P_ORDERDATE = ORDERDATE;
      this.P_ORDERNO = ORDERNO;
      this.P_COLOR = COLOR;
      this.P_SIZES = SIZES;
      this.P_KIND = KIND;
      this.P_CAREQTY = CAREQTY;
      this.reportParams = [BRANDGROUP, ORDERDATE, ORDERNO];
      
      this.report_name =BRANDGROUP+"_"+ORDERDATE+"_"+ORDERNO+"_"+"_"+Z_STYLE_NO+"_"+KIND+"_"+RFID_YN+".xlsx";
      if (RFID_YN === "Y") {
        this.selectedReportType = "1.1";
        /* this.reportType.template = "report/SW/20/RPT_SW20030_RFID_Y.xlsx";
        this.reportType.proc = "SW_RPT_SW20030_22_NOCACHE";
        this.reportType.proc2 = "SW_SEL_SW20030_22H_NOCACHE";
        this.reportType.fileName = "RPT_SW20030_RFID_Y.xlsx"; */
      } else {
        if (CAREQTY === 0) {
          this.selectedReportType = "1.2"
          /* this.reportType.template = "report/SW/20/RPT_SW20030_RFID_N.xlsx";
          this.reportType.proc = "SW_RPT_SW20030_3_NOCACHE";
          this.reportType.proc2 = "SW_SEL_SW20030_3H_NOCACHE";
          this.reportType.fileName = "RPT_SW20030_RFID_N.xlsx"; */
        } else {
          this.selectedReportType = "2.3"
          /* this.reportType.template = "report/SW/20/RPT_SW20030_CARELABEL.xlsx";
          this.reportType.proc = "SW_RPT_SW20030_C_NOCACHE";
          this.reportType.proc2 = "CARELABEL";
          this.reportType.fileName = "RPT_SW20030_CARELABEL.xlsx"; */
        }
      }
      this.searchFromTab(this.selectedTab);
    },

    onCellClickDataGrid2({ IF_NO, BARCODE, BRANDGROUP, ORDERDATE, ORDERNO, COLOR, SIZES }) {
      this.selectedIFNo2 = IF_NO;
      this.selectedBarCode = BARCODE;
      this.P_BRANDGROUP = BRANDGROUP;
      this.P_ORDERDATE = ORDERDATE;
      this.P_ORDERNO = ORDERNO;
      this.P_COLOR = COLOR;
      this.P_SIZES = SIZES;
      this.$refs.gridTID.loadData();
    },

    searchFromTab(val) {
      switch (val) {
        case "color":
          this.$refs.gridColor.loadData();
          break;
        case "material":
          this.$refs.gridMaterial.loadData();
          break;
        default:
          break;
      }
    },
  },
};
</script>
