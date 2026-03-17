<template>
  <GwGridLayout dense align="start" colsPerRow="1" containerHeight="auto" @callBackHeight="parentHeight = $event">
    <BaseDatePicker colspan="1" outlined default :clearable="false" :label="$t('order_from_date')" v-model="orderFromDate" />
    <BaseDatePicker colspan="1" outlined default :clearable="false" :label="$t('order_to_date')" v-model="orderToDate" />
    <BaseSelect colspan="2" outlined :label="$t('status')" item-text="text" item-value="value" :lstData="statusList" v-model="selectedStatus" :text_all="$t('select_all')" /> 
	<BaseSelect colspan="2" outlined :label="$t('Customer_Name')" item-text="NAME" item-value="CODE" :lstData="CustomerList" v-model="selectedCustomer" :text_all="$t('select_all')"/>
    <DxDateBox
      colspan="2"
      dense
      height="40"
      type="datetime"
      display-format="yyyy/MM/dd HH:mm:ss"
      v-model="deliDate"
      :label="$t('deli_date')"
      :placeholder="$t('deli_date')"
      :hint="$t('deli_date')"
      @valueChanged="changeDeliDate"
    />
    <BaseInput colspan="2" outlined :label="$t('brand')" v-model="inputBrand" @keypress.enter="search"/>
    <GwFlexBox colspan="2" align-self="center">
      <BaseButton :btn_text="$t('search')" @onclick="search" />
      <BaseButton :btn_text="$t('confirm')" @onclick="confirm" />
    </GwFlexBox>    
    <DataGridView 
      colspan="12" 
      column-resizing-mode="widget" 
      ref="dataGrid" 
      :header="headers" 
      sel_procedure="SW_SEL_SW20050_1_NOCACHE" 
      :filter_paras="[orderFromDate, orderToDate, inputBrand,selectedStatus,selectedCustomer]" 
      :filterRow="true" 
      select_mode="Multiple" 
      :auto_load="false" 
      :max_height="gridHeight"       
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
    orderFromDate: moment().subtract(1, "week").format("YYYYMMDD"),
    orderToDate: "",
    deliDate: new Date(),
    inputBrand: "",
    confirmDate: "",
	selectedCustomer: "",
    selectedIFNo: "",
	CustomerList: [],
    ifNoPKArray: null,
    selectedStatus: 2,
  }),

  async created() {
	[this.CustomerList] = await this._getCommonCode2(["SZ008"])
  },

  computed: {
    statusList() {
      return [
        { value: 2, text: this.$t("confirm") },
        { value: 3, text: this.$t("finish_delivery") },
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
        { dataField: "IF_CLOSEDATE", caption: this.$t("if_closedate"), allowEditing: false },
        { dataField: "IF_TAG_RECEVIEDATE", caption: this.$t("if_tag_receive_date"), allowEditing: false },
        { dataField: "TAG_RECEVIE_STATE", caption: this.$t("tag_receive_state"), allowEditing: false },
        { dataField: "IF_NO", caption: this.$t("if_no"), allowEditing: false },
        { dataField: "IF_NO_CONFIRM", caption: this.$t("if_no_confirm"), allowEditing: false },
		{ dataField: "CUST_NAME_ENG", caption: this.$t("customer_name"), allowEditing: false },
      ];
    },
    gridHeight() {
      return this._calculateHeight(this.parentHeight, 85);
    },
    formatedDeliDate() {
      return this.deliDate ? moment(this.deliDate).format("YYYY-MM-DD HHmmss") : "";
    }
  },

  methods: {
    changeDeliDate({ value }) {
      // console.log("changeDeliDate", value);
      this.deliDate = value ? value : "";      
    },
    search() {
      this.$refs.dataGrid.loadData();
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
        // console.log(`ifNoPKArray: ${this.ifNoPKArray} - formatedDeliDate: ${this.formatedDeliDate}`);
        if (!this.ifNoPKArray) {
          this.showNotification("danger", this.$t("please_select_an_order"), "");
          return;
        }
       
        const dso = {
          type: "process",
          updpro: "SW_PRO_SW20050_CONFIRM",
          para: [ this.ifNoPKArray, this.formatedDeliDate ],
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
      this.ifNoPKArray = data.map((item) => item.PK).join(",");
    },
    onCellClickDataGrid({ IF_NO }) {
      this.selectedIFNo = IF_NO;
    },
  },
};
</script>
