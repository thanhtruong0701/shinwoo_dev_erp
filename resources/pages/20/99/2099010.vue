<template>
  	<div>
  <GwGridLayout dense align="start" colsPerRow="1" containerHeight="auto" @callBackHeight="parentHeight = $event">
    <BaseDatePicker colspan="1" outlined default :clearable="false" :label="$t('from_date')" v-model="fromDate" />
    <BaseDatePicker colspan="1" outlined default :clearable="false" :label="$t('to_date')" v-model="toDate" />
    <BaseInput colspan="1" outlined :label="$t('order_no')" v-model="order_no" />
    <BaseInput colspan="1" outlined :label="$t('Text')" v-model="inputText" />
    <GwFlexBox colspan="6" align-self="right">
    <BaseButton :btn_text="$t('search')" @onclick="search" />
    <BaseButton :btn_text="$t('confirm')" @onclick="confirm" />
    <BaseButton :btn_text="$t('cancel')" @onclick="cancel" />
    <BaseButton :btn_text="$t('delete inf')"  @onclick="onDel" />
    <BaseButton :btn_text="$t('get interface')"  @onclick="onSync" />
    </GwFlexBox>
 
    <DataGridView colspan="12" column-resizing-mode="widget" 
      ref="dataGrid" 
      :header="headers" 
      sel_procedure="SW_LG_SEL_2099010_1_NOCACHE"
      :filter_paras="[fromDate, toDate, order_no, inputText]" 
      :filterRow="true" 
      select_mode="Multiple"
      :auto_load="false" 
      :max_height="gridHeight/2" 
      @onRowPrepared="onRowPrepared_0" 
      @cellClick="onCellClickDataGrid" 
      @onSelectionDataChanged="onSelectionDataChanged" 
    />
    <DataGridView colspan="12" column-resizing-mode="widget" 
      ref="dataGrid_d" 
      :header="[  
        { dataField: 'STYLE', caption: this.$t('STYLE'), allowEditing: false },
          { dataField: 'COLOR', caption: this.$t('COLOR'), allowEditing: false },
          { dataField:'SIZES', caption: this.$t('SIZE'), allowEditing: false },
          { dataField: 'ORD_QTY', caption: this.$t('QTY'), allowEditing: false, summaryType: 'sum', formatFloat: '0' },
          { dataField: 'ITEM_CODE', caption: this.$t('ITEM_CODE'), allowEditing: false },
          { dataField: 'ITEM_NAME', caption: this.$t('ITEM_NAME'), allowEditing: false },
          { dataField: 'ITEM_ETD', caption: this.$t('ITEM_ETD'), allowEditing: false }

        ]" 
      sel_procedure="SW_LG_SEL_2099010_2_NOCACHE"
      :filter_paras="[this.TLG_CO_SALEORDER_M_INF_PK]" 
      :filterRow="true" 
      select_mode="Multiple"
      :auto_load="false" :max_height="gridHeight/2" 
      @onRowPrepared="onRowPrepared_0" 
     
      @onSelectionDataChanged="onSelectionDataChanged" 
    />
  </GwGridLayout>
</div>
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
    TLG_CO_SALEORDER_M_INF_PK :"",
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

    headers() {
      return [
        { dataField: "ERP_STATUS", caption: "ERP_STATUS", allowEditing: false }, 
        { dataField: "CONFIRM_YN", caption: "CONFIRM_YN", allowEditing: false },  
        { dataField: "PO_NO", caption: "PO_NO", allowEditing: false },      
        { dataField: "STYLE", caption: "CD_STYLE", allowEditing: false },
        { dataField: "ORDER_DT", caption: "ORDER DT", allowEditing: false },
        { dataField: "ETD", caption: "DT_DEADLINE", allowEditing: false },
        { dataField: "CD_LABELTYPE2", caption: "LABELTYPE2", allowEditing: false },
        { dataField: "ORD_QTY", caption: this.$t("order_qty"), allowEditing: false, summaryType: "sum", formatFloat: "0" },
        { dataField: "DS_STYLE", caption: "DS_STYLE", allowEditing: false, },
        { dataField: "SUPPLIER", caption: "SUPPLIER", allowEditing: false }
    		
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
        if (e.data.CONFIRM_YN == "N") {
          e.rowElement.style.fontWeight = "bold";
          e.rowElement.style.color = "RED";
        } else {
            e.rowElement.style.color = "BLUE";
            e.rowElement.style.fontWeight = "bold";
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
          updpro: "SW_LG_PRO_2099009_CONFIRM",
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
     //----------------------------------------------
     async onDel() {
      try {
        if (!this.selectedRows.length) {
          this.showNotification("danger", this.$t("please_select_an_order"), "");
          return;
        }
        const ifNoPKArray = this.selectedRows.filter(item => item.PK).map((item) => item.PK);
        const ifNoPKArrayStr = ifNoPKArray.length ? ifNoPKArray.join(",") : "";

             
        const dso = {
          type: "process",
          updpro: "SW_LG_PRO_2099010_DEL",
          para: [ifNoPKArrayStr,]
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
     //----------------------------------------------
     async onSync() {
      try {
        const dso = {
          type: "process",
          updpro: "SW_LG_INF_2099010_K2",
          para:[this.order_no,this.fromDate,this.toDate]
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
   

    onCellClickDataGrid(_event) {
      
      this.TLG_CO_SALEORDER_M_INF_PK = _event.data.PK;
      this.$refs.dataGrid_d.loadData();
    },
  },
};
</script>