<template>
  <GwGridLayout dense align="start" colsPerRow="1" containerHeight="auto" @callBackHeight="parentHeight = $event">
    <BaseDatePicker colspan="2" outlined default :clearable="false" :label="$t('order_from_date')" v-model="orderFromDate" />
    <BaseDatePicker colspan="2" outlined default :clearable="false" :label="$t('order_to_date')" v-model="orderToDate" />
    <BaseSelect colspan="2" outlined :label="$t('status')" item-text="text" item-value="value" :lstData="statusList" v-model="selectedStatus" :text_all="$t('select_all')" />    
    <BaseInput colspan="2" outlined :label="$t('order_no')" v-model="order_no" />
    <GwFlexBox colspan="2" align-self="center">
      <BaseButton :btn_text="$t('search')" @onclick="search" />
     
    </GwFlexBox>    
    <BaseGridView 
      colspan="12" 
      column-resizing-mode="widget" 
      ref="dataGrid" 
      :header="headers" 
      sel_procedure="SW_SEL_SW20070_1_NOCACHE" 
      :filter_paras="[orderFromDate, orderToDate, selectedStatus,order_no]" 
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
    order_no: "",
    confirmDate: "",
    selectedIFNo: "",
    ifNoPKArray: null,
    selectedStatus: 2,
  }),

  created() {},

  computed: {
    statusList() {
      return [
        { value: 2, text: this.$t("confirm") },
        { value: 3, text: this.$t("finish_delivery") },
      ];
    },
    headers() {
      return [
        { dataField: "BRANDGROUP", caption: this.$t("brandgroup"), allowEditing: false , width: 80},
        { dataField: "CREATE_DATE", caption: this.$t("create_date"), allowEditing: false , width: 180},
        { dataField: "IF_CHECKDATE", caption: this.$t("if_checkdate"), allowEditing: false , width: 180},
        { dataField: "IF_CLOSEDATE", caption: this.$t("if_closedate"), allowEditing: false , width: 180},
        { dataField: "IF_DATE", caption: this.$t("if_date"), allowEditing: false, width: 180 },
        { dataField: "IF_EXPECTED_DATE", caption: this.$t("if_expected_date"), allowEditing: false , width: 180},
        { dataField: "IF_FLAG", caption: this.$t("if_flag"), allowEditing: false, width: 80 },
        { dataField: "IF_GUBUN", caption: this.$t("if_gubun"), allowEditing: false , width: 80},
        { dataField: "IF_NO", caption: this.$t("if_no"), allowEditing: false , width: 180},
        { dataField: "IF_TAG_RECEVIEDATE", caption: this.$t("if_tag_receviedate"),  allowEditing: false , width: 180},
        { dataField: "ORDERDATE", caption: this.$t("orderdate"), allowEditing: false , width: 100},
        { dataField: "ORDERNO", caption: this.$t("orderno"), allowEditing: false , width: 80},
        { dataField: "STATE", caption: this.$t("state"), allowEditing: false , width: 80},
        { dataField: "TAG_RECEVIE_STATE", caption: this.$t("tag_recevie_state"), allowEditing: false, width: 80 },
       
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
