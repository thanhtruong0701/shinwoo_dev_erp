<template>
  <v-dialog id="bank-dialog" max-width="1400" v-model="dialogIsShow" transition="dialog-top-transition" persistent>
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ $t("popup_export_invoice_list") }}</span>
        <v-spacer></v-spacer>
        <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
      </v-card-title>
      <v-container fluid class="pa-2" v-resize="onResize">
        <v-row dense>
          <v-col md="2">
            <BaseSelect item-value="PK" item-text="NAME" :label="$t('company')" :lstData="lstCompany" v-model="modelSearch.TCO_COMPANY_PK" disableSearch />
          </v-col>
          <v-col md="2">
            <BaseInput :label="$t('cust')" v-model="modelSearch.PARTNER_NAME" @keyPressEnter="onClick01('search')" />
          </v-col>
          <v-col md="2">
            <BaseInput :label="$t('no')" v-model="modelSearch.INVOICE_NO" @keyPressEnter="onClick01('search')" />
          </v-col>
          <v-col md="1">
            <BaseSelect item-value="CODE" item-text="NAME" :label="$t('type')" :lstData="lstType1" v-model="modelSearch.DATE_TYPE" disableSearch />
          </v-col>
          <v-col md="1">
            <BaseDatePicker :label="$t('from')" v-model="modelSearch.DATE_FROM" start />
          </v-col>
          <v-col md="1">
            <BaseDatePicker :label="$t('to')" v-model="modelSearch.DATE_TO" today />
          </v-col>
          <v-col md="1">
            <BaseSelect item-value="CODE" item-text="NAME" :label="$t('type')" :lstData="lstType2" v-model="modelSearch.STATUS" disableSearch />
          </v-col>
          <v-col md="1">
            <BaseCheckbox :label="$t('close_yn')" true-value="Y" false-value="N" v-model="modelSearch.CLOSE_YN" />
          </v-col>
          <v-col md="1">
            <div class="d-flex justify-center">
              <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="onClick01('search')" />
            </div>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col offset-md="11" md="1">
            <div class="d-flex justify-center">
              <BaseButton icon_type="close" :btn_text="$t('close')" :disabled="isProcessing" @onclick="onClick01('close')" />
            </div>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col md="12">
            <DataGridView column-resizing-mode="widget" ref="grdSeach" :max_height="heightGrdD" :header="headerGrdD" sel_procedure="LG_SEL_EXPORT_INV_1" :filter_paras="[modelSearch.TCO_COMPANY_PK,modelSearch.PARTNER_NAME,modelSearch.DATE_FROM,modelSearch.DATE_TO,modelSearch.INVOICE_NO,modelSearch.STATUS,modelSearch.CLOSE_YN,modelSearch.DATE_TYPE ]" upd_procedure="LG_UPD_EXPORT_INV_1" :update_paras="['PK','ITEM_NAME']" @cellClick="onClickCell" @cellDblClick="onDblClickCell" />
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
  </template>
  
  <script>
  
  export default {
    layout: "default",
    middleware: "user",
    props: {
      lstCompany: {
        type: Array,
        default: () => {
          return []
        },
      },
      callBackData: {
        type: Array,
        default: () => {
          return []
        },
      },
    },
  
    components: {},
  
    data: () => ({
      lstType2:[
        {CODE:1, NAME: "Saved"},
        {CODE:2, NAME: "Confirmed"},
        {CODE:4, NAME: "Cancel"},
      ],
      lstType1:[
        {CODE:"I", NAME: "Inv Date"},
        {CODE:"E", NAME: "ETD"},
      ],
      modelSearch:{
        TCO_COMPANY_PK:22134,
        PARTNER_NAME:"",
        INVOICE_NO:"",
        DATE_TYPE:"",
        DATE_FROM:"",
        DATE_TO:"",
        STATUS:"",
        CLOSE_YN:"N",
      },
      headerGrdD: [],
      dialogIsShow: false,
    }),
  
    async created() {
      await this.getDataList();
      this.initHeader();
    },
  
    watch: {
      dialogIsShow(val) {
        if (val) {
          // bi loi delay nen phai setimeout, code chay nhanh nen chua kip load ref cua popup.
          setTimeout(() => {
            this.loadDataSearch()
          }, 10);
        }
      },
    },
  
    mounted() {
    },
  
    computed: {
      user() {
        return this.$store.getters["auth/user"];
      },
      heightGrdD() {
        if (this.windowHeight <= 768) {
          return this.windowHeight * 0.38;
        } else {
          return this.windowHeight * 0.72;
        }
      },
    },
  
    methods: {
      // this.showNotification("warning", this.$t("no_data_to_export"), '',3000);
      async loadDataSearch(){
        const dso = {
          type: "list",
          selpro: "LG_SEL_EXPORT_INV_1",
          para: [this.modelSearch.TCO_COMPANY_PK,this.modelSearch.PARTNER_NAME,this.modelSearch.DATE_FROM,this.modelSearch.DATE_TO,this.modelSearch.INVOICE_NO,this.modelSearch.STATUS,this.modelSearch.CLOSE_YN,this.modelSearch.DATE_TYPE ]
        };
        let result = await this._dsoCall(dso, "select", false);
        if(result.length>0){
          result.forEach(ee1 => {
            ee1.TR_AMOUNT = ee1.TR_AMOUNT == null ? "" : Math.round(ee1.TR_AMOUNT * 100000) / 100000
          });
          this.$refs.grdSeach.setDataSource(result)
        } else {
          this.$refs.grdSeach.setDataSource(result)
          // this.showNotification("success", this.$t("no_data"), '',3000);
        }
      },
      onDblClickCell(cell) {
        let _data = cell.data;
        this.$emit("callBackData", _data);
        this.dialogIsShow = false;
      },
      onClickCell(cell) {
        // this.itemCell = cell.data;
      },
      onClick01(action) {
        switch (action) {
          case "search":
            this.loadDataSearch()
            break;
          // case "select":
          //   let _data = [this.itemCell];
          //   this.$emit("callBackData", _data);
          //   this.dialogIsShow = false;
          //   break;
        }
      },
      async getDataList() {},
      initHeader() {
        this.headerGrdD = [
          // PK, PARTNER_ID, PARTNER_NAME, CO_INVOICE_DATE, CO_INVOICE_NO, CONTRACT_NO, REF_PO_NO, LC_NO, TR_CCY, TR_AMOUNT, DISCOUNT_RATE, DISCOUNT_AMT, EX_DECLARATION, BILL_OF_LADING, BL_DATE, ED_DATE
          { dataField: "PK", caption: this.$t("pk"), width: 120, allowEditing: false, visible: false,},
          { dataField: "PARTNER_ID", caption: this.$t("partner_id"), width: 120, allowEditing: false, visible: true,},
          { dataField: "PARTNER_NAME", caption: this.$t("partner_name"), width: 120, allowEditing: false, visible: true,},
          { dataField: "CO_INVOICE_DATE", caption: this.$t("co_invoice_date"), width: 120, allowEditing: false, visible: true,},
          { dataField: "CO_INVOICE_NO", caption: this.$t("co_invoice_no"), width: 120, allowEditing: false, visible: true,},
          { dataField: "CONTRACT_NO", caption: this.$t("contract_no"), width: 120, allowEditing: false, visible: true,},
          { dataField: "REF_PO_NO", caption: this.$t("ref_po_no"), width: 120, allowEditing: false, visible: true,},
          { dataField: "LC_NO", caption: this.$t("lc_no"), width: 120, allowEditing: false, visible: true,},
          { dataField: "TR_CCY", caption: this.$t("tr_ccy"), width: 120, allowEditing: false, visible: true,},
          { dataField: "TR_AMOUNT", caption: this.$t("tr_amount"), width: 120, allowEditing: false, visible: true,},
          { dataField: "DISCOUNT_RATE", caption: this.$t("discount_rate"), width: 120, allowEditing: false, visible: true,},
          { dataField: "DISCOUNT_AMT", caption: this.$t("discount_amt"), width: 120, allowEditing: false, visible: true,},
          { dataField: "EX_DECLARATION", caption: this.$t("ex_declaration"), width: 120, allowEditing: false, visible: true,},
          { dataField: "BILL_OF_LADING", caption: this.$t("bill_of_lading"), width: 120, allowEditing: false, visible: true,},
          { dataField: "BL_DATE", caption: this.$t("bl_date"), width: 120, allowEditing: false, visible: true,},
          { dataField: "ED_DATE", caption: this.$t("ed_date"), width: 120, allowEditing: false, visible: true,},
        ];
      },
    },
  };
  </script>
  
  <style>
  </style>
  