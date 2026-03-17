<template>
<v-dialog id="bank-dialog" max-width="1400" v-model="dialogIsShow" transition="dialog-top-transition" persistent>
  <v-card>
    <v-card-title class="headline primary-gradient white--text py-2">
      <span>{{ $t("ex_invoice_goods_delivery_entry") }}</span>
      <v-spacer></v-spacer>
      <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
    </v-card-title>
    <v-container fluid class="pa-2" v-resize="onResize">
      <v-row dense>
        <v-col md="1">
          <BaseDatePicker :label="$t('from_date')" v-model="modelSearch.DATE_FROM" start />
        </v-col>
        <v-col md="1">
          <BaseDatePicker :label="$t('to_date')" v-model="modelSearch.DATE_TO" today />
        </v-col>
        <v-col md="4">
          <BaseInput :label="$t('ref_no_slip_no')" v-model="modelSearch.REF_NO" @keyPressEnter="onClick01('search1')" />
        </v-col>
        <v-col md="4">
          <BaseInput :label="$t('partner_name')" v-model="modelSearch.PARTNER_NAME" @keyPressEnter="onClick01('search1')" readonly />
        </v-col>
        <v-col offset-md="1" md="1">
          <div class="d-flex justify-center">
            <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="onClick01('search1')" />
          </div>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col md="12">
          <DataGridView column-resizing-mode="widget" ref="grdMaster" select_mode="Multiple" :max_height="heightGrdMaster" :header="headerGrdMaster" sel_procedure="LG_SEL_5010050_GDENTRY_1" :filter_paras="[modelSearch.DATE_FROM,modelSearch.DATE_TO,modelSearch.REF_NO,modelSearch.PARTNER_NAME,modelSearch.PARTNER_PK]" upd_procedure="LG_SEL_5010050_GDENTRY_1" :update_paras="['PK','ITEM_NAME']" />
        </v-col>
      </v-row>
      <v-row dense>
        <v-col offset-md="9" md="1">
          <div class="d-flex justify-center">
            <BaseButton icon_type="search" :btn_text="$t('query')" :disabled="isProcessing" @onclick="onClick01('search2')" />
          </div>
        </v-col>
        <v-col md="2">
          <div class="d-flex justify-center">
            <BaseButton icon_type="select" :btn_text="$t('select')" :disabled="isProcessing" @onclick="onClick01('select')" />
            <BaseButton icon_type="select" :btn_text="$t('select_all')" :disabled="isProcessing" @onclick="onClick01('select_all')" />
          </div>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col md="12">
          <DataGridView column-resizing-mode="widget" ref="grdDetail" select_mode="Multiple" :max_height="heightGrdMaster" :header="headerGrdDetail" sel_procedure="LG_SEL_5010050_GDENTRY_2" :filter_paras="[]" upd_procedure="LG_SEL_5010050_GDENTRY_2" :update_paras="['PK','ITEM_NAME']" @cellClick="onClickCell" @cellDblClick="onDblClickCell" />
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
    objSend: {
      type: Object,
      default: () => {
        return {}
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
    modelSearch: {
      DATE_FROM: "",
      DATE_TO: "",
      REF_NO: "",
      PARTNER_NAME: "",
      PARTNER_PK: "",
    },
    headerGrdMaster: [],
    headerGrdDetail: [],
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
          this.modelSearch.PARTNER_PK = this.objSend.PARTNER_PK
          this.modelSearch.PARTNER_NAME = this.objSend.PARTNER_NAME
          this.loadDataGridMaster()
        }, 10);
      }
    },
  },

  mounted() {},

  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
    heightGrdMaster() {
      if (this.windowHeight <= 768) {
        return this.windowHeight * 0.27;
      } else {
        return this.windowHeight * 0.36;
      }
    },
  },

  methods: {
    // this.showNotification("warning", this.$t("no_data_to_export"), '',3000);
    onDblClickCell(cell) {
      let _data = cell.data;
      this.$emit("callBackData", _data);
      this.dialogIsShow = false;
    },
    onClickCell(cell) {
      // this.itemCell = cell.data;
    },
    async searchGridDetail() {
      let arrSOSel = this.$refs.grdMaster.getSelectRowsData();
      let strArrMasterPK = ""
      arrSOSel.forEach((ee1, idx) => {
        if (idx == arrSOSel.length - 1) {
          strArrMasterPK += ee1.TLG_GD_OUTGO_M_PK + ""
        } else {
          strArrMasterPK += ee1.TLG_GD_OUTGO_M_PK + ","
        }
      });
      const dsoGrdS = {
        type: "list",
        selpro: "LG_SEL_5010050_GDENTRY_2",
        para: [strArrMasterPK]
      };
      let resGrdDetail = await this._dsoCall(dsoGrdS, "select", false);
      if (resGrdDetail != null && resGrdDetail != undefined && resGrdDetail.length > 0) {
        resGrdDetail.forEach(ee1 => {
          ee1.ITEM_AMOUNT = ee1.ITEM_AMOUNT == null ? "" : Math.round(ee1.ITEM_AMOUNT * 100000) / 100000
          ee1.TOTAL_AMOUNT = ee1.TOTAL_AMOUNT == null ? "" : Math.round(ee1.TOTAL_AMOUNT * 100000) / 100000
          ee1.UNIT_PRICE = ee1.UNIT_PRICE == null ? "" : Math.round(ee1.UNIT_PRICE * 100000) / 100000
        });
        this.$refs.grdDetail.setDataSource(resGrdDetail);
      } else {
        this.$refs.grdDetail.setDataSource(resGrdDetail);
      }
    },
    async loadDataGridMaster(){
      const dsoGrdS = {
        type: "list",
        selpro: "LG_SEL_5010050_GDENTRY_1",
        para: [this.modelSearch.DATE_FROM,this.modelSearch.DATE_TO,this.modelSearch.REF_NO,this.modelSearch.PARTNER_NAME,this.modelSearch.PARTNER_PK]
      };
      let resGrdMaster = await this._dsoCall(dsoGrdS, "select", false);
      if (resGrdMaster != null && resGrdMaster != undefined && resGrdMaster.length > 0) {
        resGrdMaster.forEach(ee1 => {
          ee1.ITEM_AMOUNT = ee1.ITEM_AMOUNT == null ? "" : Math.round(ee1.ITEM_AMOUNT * 100000) / 100000
          ee1.TOTAL_AMOUNT = ee1.TOTAL_AMOUNT == null ? "" : Math.round(ee1.TOTAL_AMOUNT * 100000) / 100000
        });
        this.$refs.grdMaster.setDataSource(resGrdMaster);
      } else {
        this.$refs.grdMaster.setDataSource(resGrdMaster);
      }
    },
    async onSelectAllDetail(){
    },
    async onSelectDetail(){
      let arrSel = this.$refs.grdDetail.getSelectRowsData();
      this.$emit("callBackData", arrSel);
      this.dialogIsShow = false;
    },
    onClick01(action) {
      switch (action) {
        case "search1":
          this.loadDataGridMaster()
          break;
        case "search2":
          this.searchGridDetail()
          break;
          case "select":
            this.onSelectDetail()
            break;
          case "select_all":
            this.onSelectAllDetail()
            break;
      }
    },
    async getDataList() {},
    initHeader() {
      this.headerGrdDetail = [
        // TLG_GD_OUTGO_M_PK, TLG_GD_OUTGO_D_PK, SEQ, REF_NO, REQ_ITEM_PK, ITEM_CODE, ITEM_NAME, PARTNER_ITEM_NAME, VIRTUAL_CODE, REQ_UOM, LOT_NO, REQ_QTY, UNIT_PRICE, ITEM_AMOUNT, VAT_AMOUNT, TOTAL_AMOUNT, DESCRIPTION, TLG_SA_SALEORDER_D_PK, ETD, ETA, EX_PORT, DES_PORT, PRICE_TYPE, PAYMENT_CCY, PAYMENT_FORM, PAYMENT_TERM
        { dataField: "TLG_GD_OUTGO_M_PK", caption: this.$t("tlg_gd_outgo_m_pk"), width: 120, allowEditing: false, visible: false,},
        { dataField: "TLG_GD_OUTGO_D_PK", caption: this.$t("tlg_gd_outgo_d_pk"), width: 120, allowEditing: false, visible: false,},
        { dataField: "SEQ", caption: this.$t("seq"), width: 120, allowEditing: false, visible: true,},
        { dataField: "REF_NO", caption: this.$t("ref_no"), width: 120, allowEditing: false, visible: true,},
        { dataField: "REQ_ITEM_PK", caption: this.$t("req_item_pk"), width: 120, allowEditing: false, visible: false,},
        { dataField: "ITEM_CODE", caption: this.$t("item_code"), width: 120, allowEditing: false, visible: true,},
        { dataField: "ITEM_NAME", caption: this.$t("item_name"), width: 120, allowEditing: false, visible: true,},
        { dataField: "PARTNER_ITEM_NAME", caption: this.$t("partner_item_name"), width: 120, allowEditing: false, visible: true,},
        { dataField: "VIRTUAL_CODE", caption: this.$t("virtual_code"), width: 120, allowEditing: false, visible: true,},
        { dataField: "REQ_UOM", caption: this.$t("req_uom"), width: 120, allowEditing: false, visible: true,},
        { dataField: "LOT_NO", caption: this.$t("lot_no"), width: 120, allowEditing: false, visible: true,},
        { dataField: "REQ_QTY", caption: this.$t("req_qty"), width: 120, allowEditing: false, visible: true,},
        { dataField: "UNIT_PRICE", caption: this.$t("unit_price"), width: 120, allowEditing: false, visible: true,},
        { dataField: "ITEM_AMOUNT", caption: this.$t("item_amount"), width: 120, allowEditing: false, visible: true,},
        { dataField: "VAT_AMOUNT", caption: this.$t("vat_amount"), width: 120, allowEditing: false, visible: true,},
        { dataField: "TOTAL_AMOUNT", caption: this.$t("total_amount"), width: 120, allowEditing: false, visible: true,},
        { dataField: "DESCRIPTION", caption: this.$t("description"), width: 120, allowEditing: false, visible: true, },
        { dataField: "TLG_SA_SALEORDER_D_PK", caption: this.$t("tlg_sa_saleorder_d_pk"), width: 120, allowEditing: false, visible: false, },
        { dataField: "ETD", caption: this.$t("etd"), width: 120, allowEditing: false, visible: true, },
        { dataField: "ETA", caption: this.$t("eta"), width: 120, allowEditing: false, visible: true, },
        { dataField: "EX_PORT", caption: this.$t("ex_port"), width: 120, allowEditing: false, visible: true, },
        { dataField: "DES_PORT", caption: this.$t("des_port"), width: 120, allowEditing: false, visible: true, },
        { dataField: "PRICE_TYPE", caption: this.$t("price_type"), width: 120, allowEditing: false, visible: true, },
        { dataField: "PAYMENT_CCY", caption: this.$t("payment_ccy"), width: 120, allowEditing: false, visible: true, },
        { dataField: "PAYMENT_FORM", caption: this.$t("payment_form"), width: 120, allowEditing: false, visible: true, },
        { dataField: "PAYMENT_TERM", caption: this.$t("payment_term"), width: 120, allowEditing: false, visible: true, },
      ]
      this.headerGrdMaster = [
        // TLG_GD_OUTGO_M_PK, OUT_DATE, SLIP_NO, REQ_QTY, ITEM_AMOUNT, TAX_AMOUNT, TOTAL_AMOUNT, CO_INVOICE_NO, DELI_TO_PK, DELI_PARTNER_ID, DELI_PARTNER_NAME, BILL_TO_PK, BILL_PARTNER_ID, BILL_PARTNER_NAME, DESCRIPTION, GRP_ITEM_YN
        { dataField: "TLG_GD_OUTGO_M_PK", caption: this.$t("tlg_gd_outgo_m_pk"), width: 120, allowEditing: false, visible: false,},
        { dataField: "OUT_DATE", caption: this.$t("out_date"), width: 120, allowEditing: false, visible: true,},
        { dataField: "SLIP_NO", caption: this.$t("slip_no"), width: 120, allowEditing: false, visible: true,},
        { dataField: "REQ_QTY", caption: this.$t("req_qty"), width: 120, allowEditing: false, visible: true,},
        { dataField: "ITEM_AMOUNT", caption: this.$t("item_amount"), width: 120, allowEditing: false, visible: true,},
        { dataField: "TAX_AMOUNT", caption: this.$t("tax_amount"), width: 120, allowEditing: false, visible: true,},
        { dataField: "TOTAL_AMOUNT", caption: this.$t("total_amount"), width: 120, allowEditing: false, visible: true,},
        { dataField: "CO_INVOICE_NO", caption: this.$t("co_invoice_no"), width: 120, allowEditing: false, visible: true,},
        { dataField: "DELI_TO_PK", caption: this.$t("deli_to_pk"), width: 120, allowEditing: false, visible: false,},
        { dataField: "DELI_PARTNER_ID", caption: this.$t("deli_partner_id"), width: 120, allowEditing: false, visible: true,},
        { dataField: "DELI_PARTNER_NAME", caption: this.$t("deli_partner_name"), width: 120, allowEditing: false, visible: true,},
        { dataField: "BILL_TO_PK", caption: this.$t("bill_to_pk"), width: 120, allowEditing: false, visible: false,},
        { dataField: "BILL_PARTNER_ID", caption: this.$t("bill_partner_id"), width: 120, allowEditing: false, visible: true,},
        { dataField: "BILL_PARTNER_NAME", caption: this.$t("bill_partner_name"), width: 120, allowEditing: false, visible: true,},
        { dataField: "DESCRIPTION", caption: this.$t("description"), width: 120, allowEditing: false, visible: true,},
        { dataField: "GRP_ITEM_YN", caption: this.$t("grp_item_yn"), width: 120, allowEditing: false, visible: true, dataType: "checkbox",},
      ];
    },
  },
};
</script>

  
<style>
  </style>
