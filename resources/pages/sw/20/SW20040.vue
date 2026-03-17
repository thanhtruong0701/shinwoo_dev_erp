<template>
  <GwGridLayout dense align="start" colsPerRow="1" containerHeight="auto" @callBackHeight="parentHeight = $event">
    <BaseDatePicker colspan="1" outlined default :clearable="false" :label="$t('from_date')" v-model="fromDate" />
    <BaseDatePicker colspan="1" outlined default :clearable="false" :label="$t('to_date')" v-model="toDate" />
    <BaseSelect colspan="2" outlined :label="$t('status')" item-text="text" item-value="value" :lstData="statusList" v-model="selectedStatus" :text_all="$t('select_all')" />
	<BaseSelect colspan="2" outlined :label="$t('Customer_Name')" item-text="NAME" item-value="CODE" :lstData="CustomerList" v-model="selectedCustomer" :text_all="$t('select_all')"/>
    <BaseInput colspan="2" outlined :label="$t('brand')" v-model="inputBrand" />
    <GwFlexBox colspan="1" align-self="center">
      <BaseButton :btn_text="$t('search')" @onclick="search" />
    </GwFlexBox>
    <!--BaseDatePicker colspan="2" outlined default :clearable="false" :label="$t('confirm_date')" v-model="confirmDate" /-->
    <GwFlexBox colspan="3" align-self="center">
      <BaseButton :btn_text="$t('save')" @onclick="save" />
      <BaseButton :btn_text="$t('confirm')" @onclick="confirm" />
      <BaseButton :btn_text="$t('cancel')" @onclick="cancel" />
	  <BaseButton btn_type="icon" icon_type="set" :btn_text="$t('set-expected date')" :disabled="isProcessing" @onclick="onSet1()" />
    </GwFlexBox>
    <DataGridView colspan="12" column-resizing-mode="widget" 
      ref="dataGrid" 
      :header="headers" 
      sel_procedure="SW_SEL_SW20040_1_NOCACHE"
      upd_procedure="SW_UPDATE_SW20040"
      :update_paras="['PK', 'IF_EXPECTED_DATE']" 
      :filter_paras="[fromDate, toDate, selectedStatus, inputBrand,selectedCustomer]" 
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
    confirmDate: "",
	CustomerList: [],
	selectedCustomer: "",
    // selectedTab: "order",
    selectedIFNo: "",
    // bgColor1: "#FCE5CD",
    selectedRows: []
  }),

  async created() {
  [this.CustomerList] = await this._getCommonCode2(["SZ008"])
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
        { dataField: "BRANDGROUP", caption: this.$t("brandgroup"), allowEditing: false },
        { dataField: "BRANDNAME", caption: this.$t("brandname"), allowEditing: false },
        { dataField: "YY", caption: this.$t("year"), allowEditing: false },
        { dataField: "SEASON", caption: this.$t("season"), allowEditing: false },
        { dataField: "Z_STYLE_NO", caption: this.$t("z_style_no"), allowEditing: false },
        { dataField: "STYLE_NO", caption: this.$t("style_no"), allowEditing: false },
        { dataField: "ORDERDATE", caption: this.$t("orderdate"), dataType: "date", allowEditing: false },
        { dataField: "ORDERNO", caption: this.$t("orderno"), allowEditing: false },
        { dataField: "COUNTRY", caption: this.$t("country"), allowEditing: false },
        { dataField: "CAREQTY", caption: this.$t("careqty"), allowEditing: false, summaryType: "sum", formatFloat: "0" },
        { dataField: "TOTWORKITEM", caption: this.$t("totworkitem"), allowEditing: false, summaryType: "sum", formatFloat: "0" },
        { dataField: "ORDERTYPE", caption: this.$t("ordertype"), allowEditing: false },
        { dataField: "KIND", caption: this.$t("kind"), allowEditing: false },
        { dataField: "TYPE", caption: this.$t("type"), allowEditing: false },
        { dataField: "LAUNDRY", caption: this.$t("laundry"), allowEditing: false },
        { dataField: "RFID_YN", caption: this.$t("rfid_yn"), allowEditing: false },
        { dataField: "Z_REQ_DELIVERY_DATE", caption: this.$t("z_req_delivery_date"), dataType: "date", allowEditing: false },
        { dataField: "STATE", caption: this.$t("state"), allowEditing: false },
        { dataField: "IF_CHECKDATE", caption: this.$t("if_checkdate"), allowEditing: false },
        { dataField: "IF_EXPECTED_DATE", caption: this.$t("if_expected_date"), dataType: "date", allowEditing: true },
        { dataField: "IF_NO_CONFIRM", caption: this.$t("if_no_inf"), allowEditing: false },
        { dataField: "IF_NO", caption: this.$t("if_no"), allowEditing: false },
		{ dataField: "CUST_NAME_ENG", caption: this.$t("customer_name"), allowEditing: false },
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
	//=============================================
		onSet1(){
			this.$refs.dataGrid.setCellSelected( 'IF_EXPECTED_DATE', this.toDate.replace("-", "") )//IF_EXPECTED_DATE
			//this.$refs.dataGrid.setCellSelected( 'PL_NM', modelOthers.setCostCenterNM )
		},
    //--------------------------------------------
    onRowPrepared_0(e) {
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
