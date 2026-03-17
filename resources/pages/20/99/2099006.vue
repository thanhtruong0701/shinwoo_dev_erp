<template>
  <GwGridLayout dense align="start" colsPerRow="1" containerHeight="auto" @callBackHeight="parentHeight = $event">
    <BaseDatePicker colspan="1" outlined default :clearable="false" :label="$t('from_date')" v-model="fromDate" />
    <BaseDatePicker colspan="1" outlined default :clearable="false" :label="$t('to_date')" v-model="toDate" />
    <BaseInput colspan="2" outlined :label="$t('order_no')" v-model="order_no" />
    <BaseInput colspan="2" outlined :label="$t('customer')" v-model="customer" />  	
    <BaseInput colspan="2" outlined :label="$t('brand')" v-model="inputBrand" />
    <GwFlexBox colspan="4" align-self="center">
    <BaseButton :btn_text="$t('search')" @onclick="search" />
    <BaseButton :btn_text="$t('confirm')" @onclick="confirm" />
    <BaseButton :btn_text="$t('cancel')" @onclick="cancel" />
    </GwFlexBox>
 
    <DataGridView colspan="12" column-resizing-mode="widget" 
      ref="dataGrid" 
      :header="headers" 
      sel_procedure="LG_SEL_2099006_1_NOCACHE"
      :filter_paras="[fromDate, toDate, order_no, inputBrand,customer]" 
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
    order_no: "",
    customer: "",
	  CustomerList: [],
	  selectedCustomer: "",
    selectedIFNo: "",
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
        { dataField: "ERP_STATUS", caption: this.$t("erp_status"), allowEditing: false },       
        { dataField: "SLIP_NO", caption: this.$t("slipno"), allowEditing: false },  
        { dataField: "CONFIRM_YN", caption: this.$t("confirm_yn"), allowEditing: false },
        { dataField: "ORDER_DT", caption: this.$t("orderdate"), dataType: "date", allowEditing: false },
        { dataField: "Z_REQ_DELIVERY_DATE", caption: this.$t("delivery_date"), dataType: "date", allowEditing: false },
        { dataField: "PO_NO", caption: this.$t("orderno"), allowEditing: false },
        { dataField: "CAREQTY", caption: this.$t("careqty"), allowEditing: false, summaryType: "sum", formatFloat: "0" },
        { dataField: "TOTWORKITEM", caption: this.$t("totworkitem"), allowEditing: false, summaryType: "sum", formatFloat: "0" }, 
        { dataField: "FNF_TYPE", caption: this.$t("type"), allowEditing: false },
        { dataField: "FNF_KIND", caption: this.$t("kind"), allowEditing: false },
        { dataField: "KIND_PR_MODE", caption: this.$t("kind_pr_mode"), allowEditing: false },
        { dataField: "RFID_YN", caption: this.$t("rfid_yn"), allowEditing: false },   
        { dataField: "PARTNER_NAME", caption: this.$t("customer_name"), allowEditing: false },  
        { dataField: "BRANDGROUP", caption: this.$t("brandgroup"), allowEditing: false },  
        { dataField: "STYLE_NO", caption: this.$t("style"), allowEditing: false },             
        { dataField: "LAUNDRYCODE", caption: this.$t("laundrycode"), allowEditing: false },
        { dataField: "Z_DEGREE", caption: this.$t("z_degree"), allowEditing: false },        
        { dataField: "CLOTHES", caption: this.$t("clothes"), allowEditing: false },
        { dataField: "PRODUCT_YM", caption: this.$t("Product Ym"), allowEditing: false },
        { dataField: "FNF_YY", caption: this.$t("year"), allowEditing: false },
        { dataField: "SEASON", caption: this.$t("season"), allowEditing: false },        
       
        { dataField: "ORDER_TYPE", caption: this.$t("ordertype"), allowEditing: false },
    		
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
        if (e.data.RFID_YN == "Y") {
          e.rowElement.style.fontWeight = "bold";
       //   e.rowElement.style.background = "#FFECD9";
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
          updpro: "LG_PRO_2099006_CONFIRM",
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
      
        const dso = {
          type: "process",
          updpro: "LG_PRO_2099006_CANCEL",
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
    onSelectionDataChanged(data) {
      this.selectedRows = [...data];      
    },
    onCellClickDataGrid({ IF_NO }) {
      this.selectedIFNo = IF_NO;
    },
  },
};
</script>
