<template>
<v-dialog id="bank-dialog" max-width="1400" v-model="dialogIsShow" transition="dialog-top-transition" persistent>
  <v-card>
    <v-card-title class="headline primary-gradient white--text py-2">
      <span>{{ $t("so_wo_buyer_label") }}</span>
      <v-spacer></v-spacer>
      <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
    </v-card-title>
    <v-container fluid class="pa-2" v-resize="onResize">
      <v-row dense>
        <v-col offset-md="9" md="3">
          <div class="d-flex justify-center">
            <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="onClick01('search')" />
            <BaseButton icon_type="add" :btn_text="$t('add')" :disabled="isProcessing" @onclick="onClick01('add')" />
            <BaseButton icon_type="delete" :btn_text="$t('delete')" :disabled="isProcessing" @onclick="onClick01('delete')" />
            <BaseButton icon_type="save" :btn_text="$t('save')" :disabled="isProcessing" @onclick="onClick01('save')" />
          </div>
        </v-col>
      </v-row>
      <v-row dense>
        <DataGridView column-resizing-mode="widget" ref="grdD" :header="headerGrdD" :filterRow="true" select_mode="Multiple" :auto_load="false" :max_height="heightGrdD" sel_procedure="LG_SEL_2010021_4_NOCACHE" upd_procedure="LG_UPD_2010021_4" :filter_paras="filterParas" :update_paras="updateParas" />
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
    callBackData: {
      type: Array,
      default: () => {
        return []
      },
    },
    objSend: {
      type: Object,
      default: () => {
        return {}
      },
    }
  },

  components: {},

  data: () => ({
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
          this.$refs.grdD.loadData();
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
        return this.windowHeight * 0.6;
      }
    },
    filterParas(){
      return [ this.objSend.TLG_CO_SALEORDER_D_PK ]
    },
    updateParas(){
      return ['PK','TLG_CO_SALEORDER_D_PK','NO','ITEM_CODE','ITEM_NAME','CUST_ITEM_NM','ST_UOM','BUYER_LOT_NO','BOX_COUNT','BOX_QTY','SEQ_BOX_FROM','SEQ_BOX_TO','DESCRIPTION' ]
    },
  },

  methods: {
    onClick01(action) {
      switch (action) {
        case "search":
          this.$refs.grdD.loadData();
          break;
        case "add":
          this.$refs.grdD.addRowStruct({
            PK: null,
            TLG_CO_SALEORDER_D_PK: this.objSend.TLG_CO_SALEORDER_D_PK,
            NO: null,
            ITEM_CODE: this.objSend.ITEM_CODE,
            ITEM_NAME: this.objSend.ITEM_NAME,
            CUST_ITEM_NM: this.objSend.CUST_ITEM,
            ST_UOM: this.objSend.ST_UOM,
            BUYER_LOT_NO: null,
            BOX_COUNT: null,
            BOX_QTY: null,
            SEQ_BOX_FROM: null,
            SEQ_BOX_TO: null,
            DESCRIPTION: null
          });
          break;
        case "delete":
          this.$refs.grdD.deleteRows();
          break;
        case "save":
          this.$refs.grdD.saveData();
          break;
      }
    },
    async getDataList() {},
    initHeader() {
      this.headerGrdD = [
        { dataField: "PK", caption: this.$t("pk"), width: 120, allowEditing: false, visible: false}, 
        { dataField: "TLG_CO_SALEORDER_D_PK", caption: this.$t("tlg_co_saleorder_d_pk"), width: 120, allowEditing: false, visible: false }, 
        { dataField: "NO", caption: this.$t("no"), width: 120, allowEditing: false, }, 
        { dataField: "ITEM_CODE", caption: this.$t("item_code"), width: 120, allowEditing: false, }, 
        { dataField: "ITEM_NAME", caption: this.$t("item_name"), width: 120, allowEditing: false, }, 
        { dataField: "CUST_ITEM_NM", caption: this.$t("cust_item"), width: 120, allowEditing: false, }, 
        { dataField: "ST_UOM", caption: this.$t("item_uom"), width: 120, allowEditing: false, }, 
        { dataField: "BUYER_LOT_NO", caption: this.$t("buyer_lot_no"), width: 120, allowEditing: true, formatFloat: 0, dataType: "number", }, 
        { dataField: "BOX_COUNT", caption: this.$t("pallet_seq"), width: 120, allowEditing: true, formatFloat: 2, dataType: "number", }, 
        { dataField: "BOX_QTY", caption: this.$t("box_qty"), width: 120, allowEditing: true, formatFloat: 2, dataType: "number", }, 
        { dataField: "SEQ_BOX_FROM", caption: this.$t("box_seq_from"), width: 120, allowEditing: true, }, 
        { dataField: "SEQ_BOX_TO", caption: this.$t("box_seq_to"), width: 120, allowEditing: true, }, 
        { dataField: "DESCRIPTION", caption: this.$t("description"), width: 120, allowEditing: true, },
      ];
    },
  },
};
</script>

<style>
</style>
