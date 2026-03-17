<template>
  <GwGridLayout dense align="start" colsPerRow="1" containerHeight="auto" @callBackHeight="parentHeight = $event">
	<BaseInput colspan="2" outlined :label="$t('gubun')" v-model="inputBrand" />
	
    <BaseDatePicker colspan="1" outlined default :clearable="false" :label="$t('from_date')" v-model="fromDate" />
    <BaseDatePicker colspan="1" outlined default :clearable="false" :label="$t('to_date')" v-model="toDate" />
    <BaseSelect colspan="2" outlined :label="$t('status')" item-text="text" item-value="value" :lstData="statusList" v-model="selectedStatus" :text_all="$t('select_all')" />
	<BaseSelect colspan="2" outlined :label="$t('Customer_Name')" item-text="NAME" item-value="CODE" :lstData="CustomerList" v-model="selectedCustomer" :text_all="$t('select_all')"/>
    
	<BaseSelect colspan="2" outlined :label="$t('label_type')" item-value="CODE" item-text="CODE_NM" :lstData="LabelList" v-model="selectedlabel_type" :text_all="$t('select_all')" />
    <GwFlexBox colspan="2" align-self="center">
      <BaseButton :btn_text="$t('search')" @onclick="search" />
	  <BaseButton icon_type="excel" :btn_text="$t('excel')" :disabled="isProcessing" @onclick="onReport2"/>
    </GwFlexBox>
    <!--BaseDatePicker colspan="2" outlined default :clearable="false" :label="$t('confirm_date')" v-model="confirmDate" /-->
    <!--GwFlexBox colspan="3" align-self="center">
      <BaseButton :btn_text="$t('save')" @onclick="save" />
      <BaseButton :btn_text="$t('confirm')" @onclick="confirm" />
      <BaseButton :btn_text="$t('cancel')" @onclick="cancel" />
    </GwFlexBox-->
    <DataGridView colspan="12" column-resizing-mode="widget" 
      ref="dataGrid" 
      :header="headers" 
      sel_procedure="SW_SEL_SW20160_1_NOCACHE"
      upd_procedure="SW_UPDATE_SW20040"
      :update_paras="['PK', 'IF_EXPECTED_DATE']" 
      :filter_paras="[fromDate, toDate, selectedStatus, inputBrand,selectedCustomer,selectedlabel_type]" 
      :filterRow="true" 
      select_mode="Multiple" 
      :auto_load="false" :max_height="gridHeight" 
      @onRowPrepared="onRowPrepared_0" 
      @cellClickData="onCellClickDataGrid" 
      @onSelectionDataChanged="onSelectionDataChanged" 
    />
  </GwGridLayout>
</template>

<script>
import moment from "moment";
export default {
  layout: "default",
  middleware: "user",

  data: () => ({
    parentHeight: 0,
    fromDate: moment().subtract(1, "week").format("YYYYMMDD"),
    toDate: "",
    selectedStatus: 1,
    inputBrand: "",
	LabelList: [],
	CustomerList: [],
	selectedlabel_type: "",
    confirmDate: "",
	selectedCustomer: "",
    // selectedTab: "order",
    selectedIFNo: "",
    // bgColor1: "#FCE5CD",
    selectedRows: []
  }),

  async created() 
  {
	[this.LabelList,this.CustomerList] = await this._getCommonCode2(["SZ007","SZ008"]);
  },

  computed: {
    statusList() {
      return [
        { value: 1, text: this.$t("new") },
        { value: 2, text: this.$t("confirm") },
        { value: 3, text: this.$t("finish_delivery") },
        { value: 4, text: this.$t("cancel") }
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
    headers() {
	
      return [
	  
        { dataField: "BRANDGROUP", caption: this.$t("BRANDGROUP"), allowEditing: false },
		{ dataField: "STYLE_NO", caption: this.$t("STYLE_NO"), allowEditing: false },
		{ dataField: "ORDERNO", caption: this.$t("ORDERNO"), allowEditing: false },
		{ dataField: "COLOR", caption: this.$t("COLOR"), allowEditing: false },
		{ dataField: "NUM", caption: this.$t("NUM"), allowEditing: false },
		{ dataField: "GUBUN", caption: this.$t("GUBUN"), allowEditing: false },
		{ dataField: "MATERIAL", caption: this.$t("MATERIAL"), allowEditing: false },
		{ dataField: "MIXRATE", caption: this.$t("MIXRATE"), allowEditing: false },
		{ dataField: "GUBUN_ENG", caption: this.$t("GUBUN_ENG"), allowEditing: false },
		{ dataField: "GUBUN_CHN", caption: this.$t("GUBUN_CHN"), allowEditing: false },
		{ dataField: "MATERIAL_ENG", caption: this.$t("MATERIAL_ENG"), allowEditing: false },
		{ dataField: "MATERIAL_CHN", caption: this.$t("MATERIAL_CHN"), allowEditing: false },
		{ dataField: "COUNT_GUBUN", caption: this.$t("COUNT_GUBUN"), allowEditing: false },
		{ dataField: "ORDERDATE", caption: this.$t("ORDERDATE"), dataType: "date", allowEditing: true },
		
      ];
    },
    gridHeight() {
      return this._calculateHeight(this.parentHeight, 85);
    },
  },

  methods: {
    search() {
      this.$refs.dataGrid.loadData();
    },
    //--------------------------------------------
    onRowPrepared_0(e) {
      if (e.rowType === "data") {
		if(e.data.ISTOTAL === 1) {
		  e.rowElement.style.fontWeight = "bold"
		  e.rowElement.style.background = "#FFE599";
	   
		}   	
        /*if (e.data.RFID_YN == "Y") {
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
        }*/
      }
    },
    //--------------------------------------------
    async confirm() {
      try {
        if (!this.selectedRows.length) {
          this.showNotification("danger", this.$t("please_select_an_order"), "");
          return;
        }
        const ifNoPKArray = this.selectedRows.filter(item => item.PK).map((item) => item.PK);
        const ifNoPKArrayStr = ifNoPKArray.length ? ifNoPKArray.join(",") : "";

        const expectedDateArray = this.selectedRows.filter(item => item.IF_EXPECTED_DATE).map((item) => item.IF_EXPECTED_DATE);
        const expectedDateArrayStr = expectedDateArray.length ? expectedDateArray.join(",") : "";

        /* console.log("ifNoPKArrayStr: ", ifNoPKArrayStr);
        console.log("expectedDateArrayStr: ", expectedDateArrayStr); */

        const dso = {
          type: "process",
          updpro: "SW_PRO_SW20040_CONFIRM",
          para: [ifNoPKArrayStr, ]
        };
        const result = await this._dsoCall(dso, "process", false);

        if (result) {
          this.showNotification("success", this.$t("process_success"), "", 500);
          setTimeout(() => {
            this.$refs.dataGrid.loadData();
          }, 500);
        }
      } catch (error) {
        console.log("confirm-catch exception:", error.message);
      }
    },
	//---onprint----------------------------------
		async onReport2() { 
        let p_param = [
							this.fromDate,
							this.toDate,		
							this.selectedStatus,
							this.inputBrand,
							this.selectedCustomer,
							this.selectedlabel_type
        ];
        let report_no = "01";
        let report_path = "";
        let report_name = "";   
        let report_name_ext = "xlsx";        
        let excel = [];

       
	let report = "rpt_sw20160_material_inquiry";
			//rpt_swso410_EC_Carelabel_02
      try{
	  //alert(p_param);
        this._ExcelSaveAs(await this.$axios.$get('/dso/makereport', {responseType: "blob", params: {
          template: "report/sw/10/" + report + ".xlsx",
          excel: JSON.stringify([{
            insertRange: [{
              range: "A1:AJ1", proc: "SW_SEL_SW20160_1_NOCACHE", params: [...p_param]//SW_SEL_SW10110_export_custom
            }],
            insertRows: [{
				startRow: 3, proc: "SW_SEL_SW20160_1_NOCACHE", params: [...p_param], stringColumns: [ "STYLE_NO","ORDERNO"], subStyle: { font : {   bold: true   } , fill: {
                                        type: 'pattern',
                                        pattern:'solid',
                                        fgColor : { argb: 'FFE599'},
                                        bgColor : { argb: 'FFE599'}
                                      } }  
              //startRow: 8, proc: "SW_SEL_SW10090_REPORT_FACT_DT", params: [...p_param]
            }]
          }]),
          convert: "xlsx"}
        }), report + "." + "xlsx");
      } catch (e) {
        this.showNotification("danger", this.$t("fail_to_export_report"), "", 4000);
      }
	  
       
      },
	 print() {},
    //--------------------------------------------
    save() {
      this.$refs.dataGrid.saveData();
    },
    //----------------------------------------------
    async cancel() {
      try {
        if (!this.selectedRows.length) {
          this.showNotification("danger", this.$t("please_select_an_order"), "");
          return;
        }
        const ifNoPKArray = this.selectedRows.filter(item => item.PK).map((item) => item.PK);
        const ifNoPKArrayStr = ifNoPKArray.length ? ifNoPKArray.join(",") : "";

        const expectedDateArray = this.selectedRows.filter(item => item.IF_EXPECTED_DATE).map((item) => item.IF_EXPECTED_DATE);
        const expectedDateArrayStr = expectedDateArray.length ? expectedDateArray.join(",") : "";

        /* console.log("ifNoPKArrayStr: ", ifNoPKArrayStr);
        console.log("expectedDateArrayStr: ", expectedDateArrayStr); */

        const dso = {
          type: "process",
          updpro: "SW_PRO_SW20040_CANCEL",
          para: [ifNoPKArrayStr, expectedDateArrayStr]
        };
        const result = await this._dsoCall(dso, "process", false);

        if (result) {
          this.showNotification("success", this.$t("process_success"), "", 500);
          setTimeout(() => {
            this.$refs.dataGrid.loadData();
          }, 500);
        }
      } catch (error) {
        console.log("confirm-catch exception:", error.message);
      }
    },
    //--------------------------------------------
    onSelectionDataChanged(data) {
      this.selectedRows = [...data];      
    },
    onCellClickDataGrid({ IF_NO }) {
      this.selectedIFNo = IF_NO;
    },
  },
};
</script>
