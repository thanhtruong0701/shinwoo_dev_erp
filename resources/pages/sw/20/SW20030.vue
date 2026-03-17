<template>
  <div>
    <GwGridLayout dense align="start" colsPerRow="1" containerHeight="auto" containerClass="py-0 px-1" @callBackHeight="parentHeight = $event">
      <GwGridLayout child dense flat colspan="4" align="start" colsPerRow="1" containerHeight="auto" containerClass="py-0 px-1" @callBackHeight="childrenHeight = $event">
        <BaseDatePicker colspan="3" outlined default :clearable="false" :label="$t('from_date')" v-model="fromDate" />
        <BaseDatePicker colspan="3" outlined default :clearable="false" :label="$t('to_date')" v-model="toDate" />
        <BaseSelect colspan="3" outlined :label="$t('handle_with_care')" item-value="value" item-text="text" :lstData="HandleList" v-model="selectedhandle_with_care" :text_all="$t('select_all')" />
        <GwFlexBox colspan="3" align-self="center" justify="end">
          <BaseButton :btn_text="$t('search')" :disabled="isProcessing" :loading="isProcessing" @onclick="search" />
        </GwFlexBox>
        <BaseSelect colspan="4" outlined :label="$t('label_type')" item-value="CODE" item-text="CODE_NM" :lstData="LabelList" v-model="selectedlabel_type" :text_all="$t('select_all')" />
        <BaseSelect colspan="4" outlined :label="$t('rfid_yn')" item-value="value" item-text="text" :lstData="rfidList" v-model="selectedrfid_yn" :text_all="$t('select_all')" />

        <BaseSelect colspan="4" outlined :label="$t('uv')" item-value="value" item-text="text" :lstData="uvList" v-model="selecteduv" :text_all="$t('select_all')" />
		
		<BaseSelect colspan="12" outlined :label="$t('Customer_Name')" item-text="NAME" item-value="CODE" :lstData="CustomerList" v-model="selectedCustomer" :text_all="$t('select_all')"/>
		
        <DataGridView colspan="12" column-resizing-mode="widget" ref="gridOrder" 
		:header="headersOrder" 
		sel_procedure="SW_SEL_SW20030_3_NOCACHE" 
		:filter_paras="[fromDate, toDate, selecteduv, selectedlabel_type, selectedrfid_yn, selectedhandle_with_care,selectedCustomer]" 
		:filterRow="true" select_mode="Single" 
		:auto_load="false" 
		:max_height="gridHeight" 
		@onRowPrepared="onRowPrepared_0" 
		@cellClickData="onCellClickDataGrid1"
		upd_procedure="SW_UPD_SW20030_3_NOCACHE"
        :update_paras="[
                'PK',
                'TIME_DOWNLOAD_CSV',
              ]"		
			  />
      </GwGridLayout>

      <GwGridLayout child dense flat colspan="8" align="start" colsPerRow="1" containerHeight="auto" containerClass="py-0 px-1" @callBackHeight="childrenHeight2 = $event">
        <BaseSelect colspan="3" outlined :label="$t('printer')" item-value="CODE" item-text="CODE_NM" :lstData="printerList" v-model="selectedPrinter" />
        <GwFlexBox colspan="2" align-self="center" justify="end">
          <BaseButton :btn_text="$t('set_printer')" :disabled="isProcessing" :loading="isProcessing" @onclick="setPrinter" />
        </GwFlexBox>
        <BaseSelect colspan="3" outlined :label="$t('report_type')" item-value="value" item-text="text" :lstData="reportTypeList" v-model="selectedReportType" />
        <GwFlexBox colspan="4" align-self="center" justify="end">
          <BaseButton :btn_text="$t('download_excel')" :disabled="isProcessing" :loading="isProcessing" @onclick="downloadExcel" />
          <BaseButton :btn_text="$t('packing_list')" :disabled="isProcessing" :loading="isProcessing" @onclick="onPacking_list" />
		  <BaseButton icon_type="excel" :btn_text="$t('Sample-RFID-Y')" :disabled="isProcessing" @onclick="onCSVSampleReport"/>
        </GwFlexBox>
        <GwGridLayout colspan="12" child dense flat align="start" colsPerRow="1" containerHeight="auto" containerClass="py-0 px-1">
          <BaseTabs @changed="tabChanged">
            <BaseTab :name="$t('color')" tabname="color" :eager="true">
              <DataGridView column-resizing-mode="widget" ref="gridColor" :header="headersColor" sel_procedure="SW_SEL_SW20030_4_NOCACHE" :filter_paras="[P_BRANDGROUP, P_ORDERDATE, P_ORDERNO]" :filterRow="true" select_mode="Multiple" :auto_load="false" :max_height="gridHeight2 - 35 - 16" @cellClickData="onCellClickDataGrid2" />
            </BaseTab>
            <BaseTab :name="$t('material')" tabname="material" :eager="true">
              <DataGridView column-resizing-mode="widget" ref="gridMaterial" :header="headersMaterial" sel_procedure="SW_SEL_SW20030_5_NOCACHE" :filter_paras="[P_BRANDGROUP, P_ORDERDATE, P_ORDERNO]" :filterRow="true" select_mode="Single" :auto_load="false" :max_height="gridHeight2 - 35 - 16" />
            </BaseTab>
          </BaseTabs>
          <GwFlexBox justify="space-between">
            <span class="red--text font-weight-bold">{{ $t("total_rows") }}: {{ gridTIDTotalRow }}</span>
            <v-spacer></v-spacer>
			
                  <BaseInput
                    v-model="txt_search_rfid_cd"
                    :label="$t('search_serial_no')"
                    @keyPressEnter="search3"
                  />
                
			<v-spacer></v-spacer>	
            <BaseButton :btn_text="$t('excel_download_by_barcode')" :disabled="isProcessing" :loading="isProcessing" @onclick="excelDownloadByBarcode" />
          </GwFlexBox>
          <BaseGridView :pager="true" column-resizing-mode="widget" ref="gridTID" :header="headersTID" sel_procedure="SW_SEL_SW20030_6_NOCACHE" :filter_paras="[P_BRANDGROUP, P_ORDERDATE, P_ORDERNO, P_COLOR, P_SIZES,this.txt_search_rfid_cd]" :filterRow="true" select_mode="Single" :auto_load="false" :max_height="gridHeight2 - 36 - 35 - 30" @rowCount="gridTIDTotalRow = $event" />
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
    AlertDialog: () => import("@/components/dialog/AlertDialog"),
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
	txt_search_rfid_cd: "",

    selectedhandle_with_care: "",
    selectedlabel_type: "",
    LabelList: [],
    selectedrfid_yn: "",
    selecteduv: "",

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
    P_TSW_S_FLTORDER_PK: "",
	P_TIME_DOWNLOAD_CSV: "",
	P_GUBUN: "",
	p_rfid_yn:"",
    bgColor1: "#FCE5CD",
    selectedReportType: "",
	CustomerList: [],
	selectedCustomer: "",
    reportType: {
      template: "",
      proc: "",
      proc2: "",
      fileName: "",
    },
    reportParams: [],
    gridTIDTotalRow: 0,
    ifNoPKArray: [],
    orderPK: "",
  }),

  async created() {
    [this.printerList, this.printerStatusList, this.LabelList,this.CustomerList] = await this._getCommonCode2(["SZ001", "SZ006", "SZ007", "SZ008"]);
    let reportjs = require("./js/SW20030.js");
    if (!!reportjs) {
      Object.assign(this, reportjs.default);
    }
  },

  computed: {
    statusList() {
      return [
        { value: 1, text: this.$t("new") },
        { value: 2, text: this.$t("confirm") },
        { value: 3, text: this.$t("finish_delivery") },
      ];
    },
    uvList() {
      return [
        { value: "Normal", text: this.$t("Normal") },
        { value: "UV", text: this.$t("UV") },
      ];
    },
    labeltypeList() {
      return [
        { value: "의류라벨KK", text: this.$t("Korean Carelabel") },
        { value: "의류라벨EC", text: this.$t("EC Carelabel") },
        { value: "의류가격택1KK", text: this.$t("Price Tag - Global") },
        { value: "합격증EC", text: this.$t("Price Tag - China") },
        { value: "HCARE", text: this.$t("Handle with care label") },
      ];
    },
    rfidList() {
      return [
        { value: "Y", text: this.$t("Y") },
        { value: "N", text: this.$t("N") },
      ];
    },
    HandleList() {
      return [
        { value: "Y", text: this.$t("Y") },
        { value: "N", text: this.$t("N") },
      ];
    },
	/*CustomerList() {
      return [
        { value: "", text: "SELECT ALL" },
        { value: "NOBLAND",text: "NOBLAND" },
        { value: "PANKO", text: "PANKO" },
		{ value: "YUPOONG", text: "YUPOONG" },
		{ value: "YAKJIN", text: "YAKJIN TRADING" }
      ]
    },*/
    reportTypeList() {
      return [
        { value: "1.1", text: "TagLabel RFID Y" },
        { value: "1.2", text: "TagLabel RFID N" },
        { value: "2.3", text: "Handle with care" },
      ];
      /*
        { value: "1.1", text: "TagLabel RFID Y 1" },
        { value: "1.2", text: "TagLabel RFID N 1" },
        { value: "2.1", text: "TagLabel RFID Y" },
        { value: "2.2", text: "TabLabel RFID N" },
        { value: "2.3", text: "Care Label" },
        { value: "3", text: this.$t("csv_english_none_rfid") },
        { value: "4", text: this.$t("csv_china_none_rfid") },
        { value: "5", text: this.$t("csv_korea_rfid") },
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
		{ dataField: "DELIVERY_DATE", caption: this.$t("if_expected_date"), dataType: "date", allowEditing: false },
		{ dataField: "DELIVERY_DATE_SW", caption: this.$t("delivery_date_sw"), dataType: "date", allowEditing: false },
        { dataField: "RFID_YN", caption: this.$t("rfid_yn"), allowEditing: false },
        { dataField: "TOTWORKITEM", caption: this.$t("totworkitem"), allowEditing: false, summaryType: "sum", formatFloat: "0" },
        { dataField: "CAREQTY", caption: this.$t("careqty"), allowEditing: false, summaryType: "sum", formatFloat: "0" },
        { dataField: "KIND", caption: this.$t("kind"), allowEditing: false },
        { dataField: "KIND_PR_MODE", caption: this.$t("kind_pr_mode"), allowEditing: false },
        { dataField: "Z_STYLE_NO", caption: this.$t("z_style_no"), allowEditing: false },
        { dataField: "Z_DEGREE", caption: this.$t("z_degree"), allowEditing: false },
        { dataField: "CUST_NAME_ENG", caption: this.$t("cust_name_eng"), allowEditing: false },
        { dataField: "GUBUN", caption: this.$t("gubun"), allowEditing: false },
        { dataField: "SIZE_", caption: this.$t("size_"), allowEditing: false },
        { dataField: "COLOR", caption: this.$t("color"), allowEditing: false },
        { dataField: "MIXRATE", caption: this.$t("mixrate"), allowEditing: false },
        { dataField: "MATERIAL", caption: this.$t("material"), allowEditing: false },
		{ dataField: "TIME_DOWNLOAD_CSV", caption: this.$t("time_download_csv"), allowEditing: false },
		{ dataField: "PK", caption: this.$t("pk"), allowEditing: false },
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
        { dataField: "SERIAL_CD", caption: this.$t("serial_cd"), allowEditing: false, width: 80 },
        { dataField: "RFID_CD", caption: this.$t("rfid_cd"), allowEditing: false, width: 280 },
        { dataField: "COLOR", caption: this.$t("color"), allowEditing: false, width: 80 },
        { dataField: "SIZES", caption: this.$t("sizes"), allowEditing: false, width: 80 },
        { dataField: "RFID_BRAND", caption: this.$t("rfid_brand"), allowEditing: false, width: 80 },
        { dataField: "ORDERCOMPANY", caption: this.$t("ordercompany"), allowEditing: false, width: 80 },
        { dataField: "IF_NO", caption: this.$t("if_no"), allowEditing: false, bgColor: this.bgColor1, width: 80 },
        { dataField: "IF_SEQ", caption: this.$t("if_seq"), allowEditing: false, width: 80 },
        { dataField: "IF_GUBUN", caption: this.$t("if_gubun"), allowEditing: false, width: 80 },
        { dataField: "IF_FLAG", caption: this.$t("if_flag"), allowEditing: false, width: 80 },
        { dataField: "IF_DATE", caption: this.$t("if_date"), allowEditing: false, width: 80 },
        { dataField: "BRANDGROUP", caption: this.$t("brandgroup"), allowEditing: false, width: 80 },
        { dataField: "ORDERDATE", caption: this.$t("orderdate"), dataType: "date", allowEditing: false, width: 80 },
        { dataField: "ORDERNO", caption: this.$t("orderno"), allowEditing: false, width: 80 },
        { dataField: "CREATE_DATE", caption: this.$t("create_date"), allowEditing: false, width: 80 },
        { dataField: "PRINTER_NAME", caption: this.$t("printer_name"), lookup: { dataSource: this.printerList, displayExpr: "CODE_NM", valueExpr: "CODE" }, allowEditing: false },
      ];
    },
  },

  methods: {
    search() {
      this.$refs.gridOrder.loadData();
    },
	search3() {
      this.$refs.gridTID.loadData();
    },
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

    async setPrinter() {
      try {
        let ds = this.$refs.gridColor.getSelectRowsData();
        await this.$nextTick();
        if (!ds.length) {
          this.showNotification("danger", this.$t("please_select_data"), "");
          return;
        }
        this.ifNoPKArray = ds.map((item) => item.PK).join(",");
        // console.log("ifNoPKArray:", this.ifNoPKArray)
        const dso = {
          type: "process",
          updpro: "SW_PRO_SW20030_SET_PRINTER",
          para: ["u", this.P_BRANDGROUP, this.P_ORDERDATE, this.P_ORDERNO, this.selectedPrinter, this.ifNoPKArray],
        };
        const result = await this._dsoCall(dso, "process", false);
        // console.log("confirm:", result);
        this.$refs.gridColor.loadData();
        this.$refs.gridTID.loadData();
        if (result) {
          this.showNotification("success", this.$t("process_success"), "", 500);
        }
      } catch (error) {
        console.log("confirm-setPrinter exception:", error.message);
      }
    },

    async onPacking_list() {
      if (!this.orderPK) return;
      const report_path = "report/sw/30/rpt_sw20030_packing_list_v2.xlsx"; // rpt_sw20030_packing_list
      const report_name = "RPT_SW20030_PACKING_LIST";
      this.print(this, report_path, report_name, this.orderPK);
    },
	//==================update==count===download==csv================================
	async onUpdateCountDownloadCSV()
	{
		const dso = {
        type: "process",
        updpro: "SW_PRO_SW20030_3_NOCACHE",
        para: [this.P_TSW_S_FLTORDER_PK],
      };
      let row = await this._dsoCall(dso, "SUBMIT", false);
      if (row) {
        //this.showNotification("success", "Information", this.$t("success"));
        this.search(); 
      }
	  //this.txt_input_rfid_scan=null;
        //this.$refs.barcode.focus();
	},
	//===============================================================================
	
	
	async downloadExcel() {
	
		if(this.P_TIME_DOWNLOAD_CSV ===0)
		{			
			//alert("download time one");
			this.downloadExcel_2();
		}
		else
		{
			if(confirm("ALREADY DOWNLOADED. DO NOT DUPLICATE.\n TẬP TIN NÀY ĐÃ TẢI.CẨN THẬN THÔNG TIN BỊ TRÙNG LẶP."))
			{
				//alert("download one more time");
				this.downloadExcel_2();
			}
		}
		
	},
    async downloadExcel_2() {
      try {
        this.isProcessing = true;
        var reportPath;
        var reportName = this.report_name;
        var proc;
        var proc2;
        var params;
		//alert(this.P_TIME_DOWNLOAD_CSV);
		//==========update time download===when after dowbload csv=============
			this.P_TIME_DOWNLOAD_CSV ="";
			this.onUpdateCountDownloadCSV();
        switch (this.selectedReportType) {
          case "1":
            /* reportPath = "report/SW/20/RPT_SW20030_1.xlsx";
            proc = "SW_RPT_SW20030_1_NOCACHE";
            reportName = "RPT_SW20030_1.xlsx";
            params = [this.selectedIFNo]; */
            break;
          case "1.1":
            reportPath = "report/sw/20/rpt_sw20030_rfid_y_1.xlsx";
            proc = "SW_RPT_SW20030_RFID_Y";
            //reportName = "RPT_SW20030_RFID_Y_1.xlsx";
            params = this.reportParams;
            break;
          case "1.2":
            reportPath = "report/sw/20/rpt_sw20030_rfid_n_1.xlsx";
            proc = "SW_RPT_SW20030_RFID_N";
            //reportName = "RPT_SW20030_RFID_N_1.xlsx";
            params = this.reportParams;
            break;
          case "2.1":
            reportPath = "report/sw/20/rpt_sw20030_rfid_y.xlsx"; // this.reportType.template;
            proc = "SW_RPT_SW20030_22_NOCACHE"; // this.reportType.proc;
            proc2 = "SW_SEL_SW20030_22H_NOCACHE"; // this.reportType.proc2;
            //reportName = "RPT_SW20030_RFID_Y.xlsx"; // this.reportType.fileName;
            params = this.reportParams;
            break;
          case "2.2":
            reportPath = "report/sw/20/rpt_sw20030_rfid_n.xlsx"; // this.reportType.template;
            proc = "SW_RPT_SW20030_3_NOCACHE"; //this.reportType.proc;
            proc2 = "SW_SEL_SW20030_3H_NOCACHE"; //this.reportType.proc2;
            //reportName = "RPT_SW20030_RFID_N.xlsx"; // this.reportType.fileName;
            params = this.reportParams;
            break;
          case "2.3":
            reportPath = "report/sw/20/rpt_sw20030_carelabel.xlsx"; // this.reportType.template;
            proc = "SW_RPT_SW20030_C_NOCACHE"; // this.reportType.proc;
            proc2 = "CARELABEL"; // this.reportType.proc2;
            //reportName = "RPT_SW20030_CARELABEL.xlsx"; //this.reportType.fileName;
            params = this.reportParams;
            break;
          case "3":
            reportPath = "report/sw/20/rpt_sw20030_no_rfid_eng.xlsx";
            proc = "SW_RPT_SW20030_NO_RFID_ENG";
            //reportName = "RPT_SW20030_NO_RFID_ENG.xlsx";
            params = this.reportParams;
            break;
          case "4":
            reportPath = "report/sw/20/rpt_sw20030_no_rfid_chn.xlsx";
            proc = "SW_RPT_SW20030_NO_RFID_CHN";
            //reportName = "RPT_SW20030_NO_RFID_CHN.xlsx";
            params = this.reportParams;
            break;
          case "5":
            reportPath = "report/sw/20/rpt_sw20030_rfid_kor.xlsx";
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

        if (this.selectedReportType === "2.1" || this.selectedReportType === "2.2" || this.selectedReportType === "2.3") {
          if (proc2 === "CARELABEL") {
            excel = [
              {
                sheet: 1,
                insertRange: [
                  {
                    range: "C1:D1",
                    proc: proc,
                    params: ["u"],
                  },
                ],
              },
            ];
          } else {
            excel = [
              {
                sheet: 1,
                insertRows: [{ startRow: 2, by: "index", proc: proc, params: [...params] }],
              },
            ];
          }
        } else {
          excel = [
            {
              sheet: 1,
              insertRows: [{ startRow: 2, by: "index", proc: proc, params: [...params] }],
            },
          ];
        }

        /* console.log(`reportPath: ${reportPath} - proc: ${proc} - params: ${params} - reportName: ${reportName}`); */
        // console.log(excel)
        let res;
        if (proc2 === "CARELABEL") {
          res = await this.$axios.$get("/dso/makereport", {
            responseType: "blob",
            params: {
              template: reportPath,
              excel: JSON.stringify(excel),
              debug: true,
            },
          });
        } else {
          res = await this.$axios.$get("dso/expbigexcel", {
            responseType: "blob",
            params: {
              proc: proc,
              para: params,
            },
          });
        }
        console.log("res:", res);
        if (res) {
          if (proc2 === "CARELABEL") {
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
          this.showNotification("danger", this.$t("fail_to_export_report"), "", 4000);
        }
      } catch (error) {
        this.isProcessing = false;
        console.log("downloadExcel-catch exception:", error.message);
      } finally {
        this.isProcessing = false;
      }
	  
    },
	//=======use==templet=============
	async onCSVSampleReport()
	{
			
		let p_param = [this.P_BRANDGROUP, this.P_ORDERDATE, this.P_ORDERNO];  
			let report_no = "01";
			let report_path = "";   
			let report_name_ext = "xlsx";        
			let excel = [];
			
			let report= "";
			let report_name= "";
			let proc_sp= "";
		//========================================
		if(this.p_rfid_yn=="Y")  
		{
			 report = "rpt_sw20030_rfid_y_sample";
		     report_name = "rpt_sw20030_rfid_y_sample_order_no_"+this.P_ORDERNO;
			 proc_sp = "SW_RPT_SW20030_RFID_Y_SAMPLE";
		}
		else{
			 report = "rpt_sw20030_rfid_y_sample";
		     report_name = "rpt_sw20030_rfid_n_sample_order_no_"+this.P_ORDERNO;
			 proc_sp = "SW_RPT_SW20030_RFID_N";
			
		}
		//========================================,this.p_rfid_yn
		   
		
				//rpt_swso410_EC_Carelabel_02
		  try{
		  //alert(p_param);
			this._ExcelSaveAs(await this.$axios.$get('/dso/makereport', {responseType: "blob", params: {
			  template: "report/sw/20/" + report + ".xlsx",
			  excel: JSON.stringify([{
				insertRange: [{
				  range: "A1:AJ1", proc: proc_sp, params: [...p_param]//SW_SEL_SW10110_export_custom
				}],
				insertRows: [{
					startRow: 2, proc: proc_sp, params: [...p_param], stringColumns: [ "FAC","ITEM_CODE"], subStyle: { font : {   bold: true   } , fill: {
											type: 'pattern',
											pattern:'solid',
											fgColor : { argb: 'FFE599'},
											bgColor : { argb: 'FFE599'}
										  } }  
				  //startRow: 8, proc: "SW_SEL_SW10090_REPORT_FACT_DT", params: [...p_param]
				}]
			  }]),
			  convert: "xlsx"}
			}), report_name + "." + "xlsx");
		  } catch (e) {
			this.showNotification("danger", this.$t("fail_to_export_report"), "", 4000);
		  }
	  
       
      },
	 print() {},
	//======big==data=use===it==========
	async onCSVSampleReport2()
	{
		try {
        this.isProcessing = true;
        var reportPath;
        var reportName = this.report_name;
        var proc;
        var proc2;
        var params;
		
        reportPath = "report/sw/20/rpt_sw20030_rfid_y_1.xlsx";
            proc = "SW_RPT_SW20030_RFID_Y_SAMPLE";
            //reportName = "RPT_SW20030_RFID_Y_1.xlsx";
            params = this.reportParams;

        if (!this.selectedIFNo) {
          this.showNotification("danger", this.$t("please_select_an_order"), "");
          return;
        }

        let excel = [];
        var insertHeader = [];

        if (this.selectedReportType === "2.1" || this.selectedReportType === "2.2" || this.selectedReportType === "2.3") {
          if (proc2 === "CARELABEL") {
            excel = [
              {
                sheet: 1,
                insertRange: [
                  {
                    range: "C1:D1",
                    proc: proc,
                    params: ["u"],
                  },
                ],
              },
            ];
          } else {
            excel = [
              {
                sheet: 1,
                insertRows: [{ startRow: 2, by: "index", proc: proc, params: [...params] }],
              },
            ];
          }
        } else {
          excel = [
            {
              sheet: 1,
              insertRows: [{ startRow: 2, by: "index", proc: proc, params: [...params] }],
            },
          ];
        }

        /* console.log(`reportPath: ${reportPath} - proc: ${proc} - params: ${params} - reportName: ${reportName}`); */
        // console.log(excel)
        let res;
        if (proc2 === "CARELABEL") {
          res = await this.$axios.$get("/dso/makereport", {
            responseType: "blob",
            params: {
              template: reportPath,
              excel: JSON.stringify(excel),
              debug: true,
            },
          });
        } else {
          res = await this.$axios.$get("dso/expbigexcel", {
            responseType: "blob",
            params: {
              proc: proc,
              para: params,
            },
          });
        }
        console.log("res:", res);
        if (res) {
          if (proc2 === "CARELABEL") {
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
          this.showNotification("danger", this.$t("fail_to_export_report"), "", 4000);
        }
      } catch (error) {
        this.isProcessing = false;
        console.log("downloadExcel-catch exception:", error.message);
      } finally {
        this.isProcessing = false;
      }
	  
	},
	//========================
    async excelDownloadByBarcode() {
      try {
        if (!this.selectedIFNo2) {
          return;
        }
        this.isProcessing = true;
        let report_path = "report/sw/20/rpt_sw20030_2.xlsx";
        let report_name = this.report_name;
        let excel = [];
        const headerRows = ["Goods", "Barcode", "QR Code", "Sizes", "Color", "Gubun", "Material", "Mixrate", "Country", "Order name", "Product YM", "Degree", "Serial Number", "Quantity Color", "STYLE_DEGREE_COLOR", "BARCODE2"];
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

    onCellClickDataGrid1({ IF_NO, RFID_YN, CAREQTY, BRANDGROUP, ORDERDATE, ORDERNO, COLOR, SIZES, Z_STYLE_NO, KIND, PK,TIME_DOWNLOAD_CSV,GUBUN }) {
      this.orderPK = PK;
      this.selectedIFNo = IF_NO;
      this.P_BRANDGROUP = BRANDGROUP;
      this.P_ORDERDATE = ORDERDATE;
      this.P_ORDERNO = ORDERNO;
      this.P_COLOR = COLOR;
      this.P_SIZES = SIZES;
      this.P_KIND = KIND;
      this.P_CAREQTY = CAREQTY;
      this.P_TSW_S_FLTORDER_PK = PK;
	  this.P_GUBUN =GUBUN;
	  this.p_rfid_yn=RFID_YN;
      this.reportParams = [BRANDGROUP, ORDERDATE, ORDERNO];
	  
	  this.P_TIME_DOWNLOAD_CSV = TIME_DOWNLOAD_CSV;

      this.report_name = BRANDGROUP + "_" + ORDERDATE + "_" + ORDERNO + "_" + "_" + Z_STYLE_NO + "_" + KIND + "_" + RFID_YN + "_" + GUBUN +".xlsx";
      if (RFID_YN === "Y") {
        this.selectedReportType = "1.1";
        /* this.reportType.template = "report/SW/20/RPT_SW20030_RFID_Y.xlsx";
        this.reportType.proc = "SW_RPT_SW20030_22_NOCACHE";
        this.reportType.proc2 = "SW_SEL_SW20030_22H_NOCACHE";
        this.reportType.fileName = "RPT_SW20030_RFID_Y.xlsx"; */
      } else {
        if (CAREQTY === 0) {
          this.selectedReportType = "1.2";
          /* this.reportType.template = "report/SW/20/RPT_SW20030_RFID_N.xlsx";
          this.reportType.proc = "SW_RPT_SW20030_3_NOCACHE";
          this.reportType.proc2 = "SW_SEL_SW20030_3H_NOCACHE";
          this.reportType.fileName = "RPT_SW20030_RFID_N.xlsx"; */
        } else {
          this.selectedReportType = "2.3";
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
    }
  },
};
</script>
