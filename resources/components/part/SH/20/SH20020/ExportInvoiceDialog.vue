<template>
  <v-dialog id="export-invoice-dialog" v-model="dialogIsShow">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ $t("export_invoice") }}</span>
        <v-spacer></v-spacer>
        <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
      </v-card-title>
      <v-container fluid>
        <v-row dense align="center" justify="space-between">
          <v-col lg="4" cols="12">
            <BaseSelect :label="$t('company')" :lstData="companyList" v-model="selectedCompany" item-value="PK" item-text="TEXT" />
          </v-col>
          <v-col lg="4" cols="12">
            <BaseInput :label="$t('cust')" v-model="cust" />
          </v-col>
          <v-col lg="3" cols="12">
            <BaseInput :label="$t('invoice_no')" v-model="no" />
          </v-col>
          <v-col cols="1">
            <div class="d-flex justify-end">
              <BaseButton btn_type="icon" icon_type="search" :btn_text="$t('search')" @onclick="search" />
            </div>
          </v-col>
          <v-col lg="4" cols="12">
            <div class="d-flex align-center">
              <BaseDatePicker start :label="$t('invoice_date_from')" v-model="invoiceDate.from" />
              <div class="mx-2"></div>
              <BaseDatePicker default :label="$t('invoice_date_to')" v-model="invoiceDate.to" />
            </div>
          </v-col>
          <v-col lg="4" cols="12">
            <GwRadioGroup row :items="radioGroups" v-model="selectedRadio" />
          </v-col>
          <v-col lg="3" cols="12">
            <BaseCheckbox :label="$t('close')" true-value="Y" false-value="N" v-model="closeYN" />
          </v-col>
          <v-col cols="1">
            <div class="d-flex justify-end">
              <BaseButton icon_type="file_lock" :btn_text="closeYN === 'Y' ? $t('unclose') : $t('close')" @onclick="close" />
            </div>
          </v-col>
          <v-col cols="12">
            <DataGridView 
              select_mode="Single" 
              ref="dataGrid" 
              sel_procedure="SP_SEL_SH20020_EX_INV_LST_NOCACHE"
              :filter_paras="[ selectedCompany, cust, no, invoiceDate.from, invoiceDate.to, selectedRadio, closeYN ]"
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
  name: "export-invoice-dialog",

  props: {
    companyList: Array,
    formHeight: Number
  },

  data:()=>({
    dialogIsShow: false,
    selectedCompany: "",
    cust: "",
    no: "",
    invoiceDate: {
      from: "",
      to: ""
    },
    selectedRadio: 1,
    closeYN: "N"
  }),

  computed: {
    dataGridRefs() {
      return this.$refs.dataGrid;
    },
    radioGroups() {
      return [
        { value: 1, text: this.$t("saved") },
        { value: 2, text: this.$t("confirmed") },
        { value: 3, text: this.$t("approved") },
        { value: 4, text: this.$t("cancel") }
      ]
    },
    gridHeight() {
      return Math.floor((this.formHeight*80)/100)
    },
    headers() {
      return [
        {
          dataField: "PARTNER_ID",
          caption: this.$t('cust_id'),
          allowEditing: false
        },
        {
          dataField: "PARTNER_NAME",
          caption: this.$t('cust_name'),
          allowEditing: false
        },
        {
          dataField: "CO_INVOICE_DATE",
          caption: this.$t('inv_date'),
          allowEditing: false,
          dataType: "date"
        },
        {
          dataField: "CO_INVOICE_NO",
          caption: this.$t('inv_no'),
          allowEditing: false
        },
        {
          dataField: "CONTRACT_NO",
          caption: this.$t('contract_no'),
          allowEditing: false
        },
        {
          dataField: "REF_PO_NO",
          caption: this.$t('po_no'),
          allowEditing: false
        },
        {
          dataField: "LC_NO",
          caption: this.$t('lc_no'),
          allowEditing: false
        },
        {
          dataField: "TR_CCY",
          caption: this.$t('tr_ccy'),
          allowEditing: false
        },
        {
          dataField: "TR_AMOUNT",
          caption: this.$t('tr_amt'),
          allowEditing: false
        },
        {
          dataField: "DISCOUNT_RATE",
          caption: this.$t('disc'),
          allowEditing: false,
          dataType: "number",
          formatFloat: 2
        },
        {
          dataField: "DISCOUNT_AMT",
          caption: this.$t('disc_amt'),
          allowEditing: false,
          dataType: "number",
          formatFloat: 2
        }
      ]
    }
  },

  methods: {
    search() {
      this.dataGridRefs.loadData();
    },

    close() {

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