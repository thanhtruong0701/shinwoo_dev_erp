<template>
  <v-dialog id="import-invoice-dialog" width="60%" v-model="dialogIsShow">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ $t("import_invoice") }}</span>
        <v-spacer></v-spacer>
        <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
      </v-card-title>
      <v-container fluid>
        <v-row dense align="center">
         <v-col lg="4" cols="12">
           <BaseSelect :label="$t('company')" :lstData="dataList.company" v-model="selectedCompany" item-value="PK" item-text="TEXT" />
         </v-col>
         <v-col lg="4" cols="12">
           <BaseInput :label="$t('supplier')" v-model="searchSupplier" />
         </v-col>
         <v-col lg="3" cols="12">
           <BaseInput :label="$t('no')" v-model="searchNo" />
         </v-col>
         <v-col lg="1" cols="12">
           <BaseButton btn_type="icon" icon_type="search" :btn_text="$t('search')" @onclick="search" />
         </v-col>
         <v-col lg="4" cols="12">
           <div class="d-flex align-center justify-space-between">
            <BaseDatePicker start :label="$t('opening_date_from')" v-model="dateFrom" />
            <div class="mx-2"></div>
            <BaseDatePicker default :label="$t('opening_date_to')" v-model="dateTo" />
           </div>
         </v-col>
         <v-col lg="4" cols="12">
           <BaseSelect :label="$t('plant')" :lstData="dataList.plant" v-model="selectedPlant" item-value="PK" item-text="LOC_NM" />
         </v-col>
         <v-col cols="12">
           <DataGridView 
              select_mode="Single" 
              ref="dataGrid" 
              sel_procedure="SP_SEL_SH20170_IM_INV_LST_NOCACHE"
              :filter_paras="[ searchSupplier, dateFrom, dateTo, searchNo, selectedPlant ]"
              :max_height="gridHeight"
              :header="headers"
              @onRowDblClick="handleReturnedData"
            />
         </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "import-invoice-dialog",

  props: {
    dataList: Object,
    formHeight: Number
  },

  data:()=>({
    dialogIsShow: false,
    selectedCompany: "",
    searchSupplier: "",
    searchNo: "",
    dateFrom: "",
    dateTo: "",
    selectedPlant: "",

  }),

  async created() {},

  computed: {
    gridHeight() {
      if(!this.formHeight) {
        return 500;
      }
      return Math.floor((this.formHeight*70)/100)
    },
    headers() {
      return [
        {
          dataField: "PARTNER_ID",
          caption: this.$t("supplier_id"),
          allowEditing: false
        },
        {
          dataField: "PARTNER_NAME",
          caption: this.$t("supplier_name"),
          allowEditing: false
        },
        {
          dataField: "LC_DATE",
          caption: this.$t("opening_date"),
          allowEditing: false,
          dataType: "date"
        },
        {
          dataField: "CO_INVOICE_NO",
          caption: this.$t("file_no"),
          allowEditing: false
        },
        {
          dataField: "LC_NO",
          caption: this.$t("lc_no"),
          allowEditing: false
        },
        {
          dataField: "PAYMENT_CCY",
          caption: this.$t("currency"),
          allowEditing: false
        },
        {
          dataField: "TOTAL_DECLARE_AMOUNT",
          caption: this.$t("total_amount"),
          allowEditing: false,
          dataType: "number",
          formatFloat: 2,
          summaryType: "sum"
        }
      ]
    }
  },

  methods: {
    search() {
      this.$refs.dataGrid.loadData();
    },

    handleReturnedData({ data, rowType }) {
      if(rowType === "data") {
        this.$emit("onDataReturn", data)
      }
      this.dialogIsShow = false;
    }
  }
}
</script>