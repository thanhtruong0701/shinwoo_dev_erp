<template>
  <GwGridLayout dense align="start" colspan="10" colsPerRow="10" containerHeight="auto" containerClass="py-0 px-0" @callBackHeight="parentHeight = $event" style="width: 100%" >
    <GwGridLayout child dense flat colspan="8" colsPerRow="10" align="start" containerHeight="auto" containerClass="py-0 px-0" @callBackHeight="childrenHeight = $event" style="width: 100%" >
      <BaseSelect colspan="2" outlined :label="$t('Date Type')" item-value="CODE" item-text="NAME" :lstData="dateList" v-model="selectedDateType" />
      <BaseDatePicker colspan="2" outlined default :clearable="false" :label="$t('from_date')" v-model="fromDate" />
      <BaseDatePicker colspan="2" outlined default :clearable="false" :label="$t('to_date')" v-model="toDate" />
      <BaseDatePicker colspan="2" outlined default :clearable="false" hidden/>
      <GwFlexBox colspan="2" align-self="center" justify="end">
        <BaseButton :btn_text="$t('search')" :disabled="isProcessing" :loading="isProcessing" @onclick="search" />
      </GwFlexBox>
      <BaseSelect colspan="4" outlined :label="$t('Factory')" item-value="PK" item-text="TEXT" :lstData="factoryList" v-model="selectedFactory" :text_all="$t('select_all')" />
  
      <DataGridView 
        colspan="16"  style="width: 100%; overflow-y: auto;"
        :fixed-header="true"
        column-resizing-mode="widget" ref="dataGrid" :header="headers" 
        sel_procedure="SW_SEL_SWSO010" 
        :filter_paras="[selectedDateType,fromDate, toDate, selectedFactory]" 
        :filterRow="true" 
        :auto_load="false" 
        :max_height="gridHeight" 
        @onRowPrepared="onRowPrepared_0" 
        @cellClickData="onCellClickDataGrid" 
        @onSelectionDataChanged="onSelectionDataChanged" 
        />
    </GwGridLayout>
    <GwGridLayout child dense flat colspan="4" colsPerRow="6" align="start" containerHeight="auto" containerClass="py-0 px-0" @callBackHeight="childrenHeight = $event" style="width: 100%" >


      <BaseInput  colspan="4"    outlined    :label="$t('Search')"        v-model="inputCondition"        @keyPressEnter="search2"   style="flex: 1;"   />
      <BaseDatePicker colspan="2" outlined default :clearable="false" hidden/>
      <GwFlexBox colspan="2" align-self="center" justify="end">
        <BaseButton :btn_text="$t('search')" :disabled="isProcessing" :loading="isProcessing" @onclick="search2" />
      </GwFlexBox>
            
      <DataGridView colspan="12" ref="dataGrid2" :header="headers2" 
       style="width: 100%" column-resizing-mode="widget" 
        sel_procedure="SW_SEL_SWSO010_2" 
        :filter_paras="[selectedDateType,fromDate, toDate, P_FACTORY_PK,P_PARTNER_PK,inputCondition]"  :filterRow="true"
        :auto_load="false" 
        :max_height="gridHeight2 + 300"
        @onRowPrepared="onRowPrepared_2" 
        />

     </GwGridLayout> 
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
      hideSearchButton: true,
      toDate: "",
      selectedDateType: "SELECT ALL",
      selectedFactory: "",
      factoryList: [],
      inputCondition: "",
      confirmDate: "",
      CustomerList: [],
      selectedCustomer: "",
      P_FACTORY_PK: "",
      P_PARTNER_PK:"",
      selectedRows: [],
      dateList:[]
    }),
    /*############### created #######################*/
    async created() {
      const commoncode = await this._getCommonCode2(['SWSO010']);
      this.dateList = commoncode[0];
      await this.getFactoryList();
      
    },
    computed: {
      // dateList() {
      //   return [
      //     { value: 'E', text: this.$t("ETD") },
      //     { value: 'O', text: this.$t("Order Date") }
      //   ];
      // },

      headers() {
        return [
        { dataField: "FACTORY_NAME", caption: this.$t("FACTORY_NAME"), allowEditing: false, width:100  },  
        { dataField: "BILL_TO", caption: this.$t("Bill TO"), allowEditing: false, width:130 },
        { dataField: "DELI_TO", caption: this.$t("Deli TO"), allowEditing: false, width:130 },
          { dataField: "ORDER_QTY", caption: this.$t("Order Qty"), allowEditing: false , alignment: 'right'},
          { dataField: "ST_ORD_QTY", caption: this.$t("ST Ord Qty"), allowEditing: false , alignment: 'right'},
          { dataField: "OUT_QTY", caption: this.$t("Out Qty"), allowEditing: false, alignment: 'right'  },
          { dataField: "FACTORY_RATIO", caption: this.$t("FAC Ratio"), allowEditing: false, alignment: 'right'  },
          { dataField: "BAL_QTY", caption: this.$t("Bal Qty"), allowEditing: false, alignment: 'right'  },
          { dataField: "RETURN_QTY", caption: this.$t("Return"), allowEditing: false, alignment: 'right' , width:50 },
          { dataField: "CANCEL_QTY", caption: this.$t("Cancel"), allowEditing: false , alignment: 'right' , width:50 },
          { dataField: "DELI_RATE", caption: this.$t("Deli Ratio"), allowEditing: false,alignment: 'right' }
       ];
      }, 

      headers2() {
        return [
        { dataField: "ORD_QTY", caption: this.$t("ORD QTY"), allowEditing: false ,  summaryType: "sum", formatFloat: "0" ,alignment: 'right'},
          { dataField: "OUT_QTY", caption: "OUT QTY", allowEditing: false ,  summaryType: "sum", formatFloat: "0" ,alignment: 'right'},
        { dataField: "DELI_RATE", caption: "Deli Rate", allowEditing: false,alignment: 'right' },
        { dataField: "DELI_DATE", caption: this.$t("DELI DATE"), allowEditing: false },
        { dataField: "ETD", caption: this.$t("ETD"),  allowEditing: false },
         { dataField: "ETD_CFG", caption: this.$t("ETD CONFIRM"),  allowEditing: false },
        { dataField: "ORDER_DATE", caption: this.$t("Order DATE"),  allowEditing: false },
        { dataField: "SO_ITEM_NO", caption: this.$t("SO_ITEM_NO"), allowEditing: false },
        { dataField: "PO_NO", caption: this.$t("PO NO"), allowEditing: false },
        { dataField: "FACTORY_NAME", caption: this.$t("FACTORY NAME"), allowEditing: false },
        { dataField: "BILL_TO", caption: this.$t("BILL_TO"), allowEditing: false },
        { dataField: "DELI_TO", caption: this.$t("DELI_TO"),allowEditing: false },
        { dataField: "ITEM_CODE", caption: this.$t("ITEM CODE"), allowEditing: false },
        { dataField: "ITEM_NAME", caption: this.$t("ITEM NAME"), allowEditing: false }
        ];
      },


      gridHeight() {
        return this._calculateHeight(this.parentHeight, 80);
      },
      gridHeight2() {
        return this._calculateHeight(this.parentHeight, 50);
      },      
    },
  
    methods: {
      search() {
        this.$refs.dataGrid.loadData();
      }, 
      search2() {
        this.$refs.dataGrid2.loadData();
      }, 

    async getFactoryList() {
      const dso1 = {
        type: "list",
        selpro: "gsf20_lg_sys_get_factory",
        para: [6278,''],
      };

      const result1 = await this._dsoCall(dso1, 'select', false);

      if (result1) {
        //result1.unshift({ PK: 'ALL', NAME: this.$t("select_all") });
        this.factoryList = result1
        return result1;
      }
    },    



    onRowPrepared_0(e) {
      if (e.rowType === "data") {
        e.rowElement.style.fontWeight = "bold";
        if (e.data.ISTOTAL == "2" ) {
          e.rowElement.style.background = "#FFECD9";
        }
        if (e.data.ISTOTAL == "1" ) {
          e.rowElement.style.background = "#FFF1E3";
        }
        if (e.data.DELI_RATE2 >= 50 && e.data.DELI_RATE2 < 80) {
          const cells = e.rowElement.children;
          cells[10].style.background = "ORANGE"; 
        }
        if (e.data.DELI_RATE2 < 50 ) {
          const cells = e.rowElement.children;
          cells[10].style.background = "RED"; 
        }           
      } 
    },
    onRowPrepared_2(e) {
      if (e.rowType === "data") {
        if (e.data.DELI_RATE !== "100 %") {
          e.rowElement.style.background = "YELLOW";
      }
    }}, 
    onCellClickDataGrid({ FACTORY_PK,PARTNER_PK }) {      
        this.P_FACTORY_PK = FACTORY_PK;
        this.P_PARTNER_PK = PARTNER_PK;
        
        this.$refs.dataGrid2.loadData();
      },

     
    onSelectionDataChanged(data) {
      this.selectedRows = [...data];
    },
    onSelectionDataChanged2(data2) {
      this.selectedRows = [...data2];
    },  

}};
  </script>
  