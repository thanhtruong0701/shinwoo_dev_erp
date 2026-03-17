<template>
<v-dialog id="bank-dialog" max-width="1400" v-model="dialogIsShow" transition="dialog-top-transition" persistent>
  <v-card>
    <v-card-title class="headline primary-gradient white--text py-2">
      <span>{{ $t("get_item_from_sale_order") }}</span>
      <v-spacer></v-spacer>
      <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
    </v-card-title>
    <v-container fluid class="pa-2" v-resize="onResize">
      <v-row dense>
        <v-col md="2">
          <BaseInput :label="$t('customer')" v-model="objSend.PARTNER_NAME" readonly />
        </v-col>
        <v-col md="1">
          <BaseSelect item-value="CODE" item-text="NAME" :label="$t('type')" :lstData="lstType" v-model="itemType" disableSearch />
        </v-col>
        <v-col md="1">
          <BaseDatePicker :label="$t('prod_from_date')" v-model="txtFromDate" start  />
        </v-col>
        <v-col md="1">
          <BaseDatePicker :label="$t('prod_to_date')" v-model="txtToDate" today  />
        </v-col>
        <v-col md="2">
          <BaseInput :label="$t('so_po_no')" v-model="txtPOSONo" />
        </v-col>
        <v-col md="2">
          <BaseInput :label="$t('item')" v-model="txtItem" />
        </v-col>
        <v-col md="1">
          <BaseCheckbox :label="$t('balance')" true-value="Y" false-value="N" v-model="chkBalance" />
        </v-col>
        <v-col md="2">
          <v-row justify="end" class="mr-1">
            <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="onClick01('search')" />
          </v-row>
        </v-col>
      </v-row>
      <v-row dense>
        <DataGridView column-resizing-mode="widget" ref="grdSearch" :header="headerGrdSearch" :filterRow="true" select_mode="Multiple" :auto_load="false" :max_height="heightGrdSearch" sel_procedure="LG_SEL_5010011_4_NC" :filter_paras="[ objSend.TCO_BUSPARTNER_PK, itemType, txtFromDate, txtToDate, txtPOSONo, txtItem, chkBalance ]" />
      </v-row>
      <v-row dense>
         <v-col offset-md="8" md="1" class="mr-4">
          <BaseCheckbox :label="$t('duplicate')" true-value="Y" false-value="N" v-model="chkDupli" />
        </v-col>
        <v-col md="2">
          <div class="d-flex justify-center">
            <BaseButton icon_type="add" :btn_text="$t('add')" :disabled="isProcessing" @onclick="onClick01('add')" />
            <BaseButton icon_type="remove" :btn_text="$t('remove')" :disabled="isProcessing" @onclick="onClick01('remove')" />
            <BaseButton icon_type="select" :btn_text="$t('select')" :disabled="isProcessing" @onclick="onClick01('select')" />
          </div>
        </v-col>
      </v-row>
      <v-row dense>
        <DataGridView column-resizing-mode="widget" ref="grdSelect" :header="headerGrdSearch" :auto_load="false" :max_height="heightGrdSearch" />
      </v-row>
    </v-container>
  </v-card>
</v-dialog>
</template>

<script>
import moment from "moment";

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
    objSend:{
      type: Object,
      default: () => {
        return {}
      },
    }
  },

  components: {},

  data: () => ({
    lstType: [ { CODE: "O", NAME:"Order" }, { CODE: "E", NAME:"ETD" }, ],
    itemType: "",
    chkDupli: "N",
    txtFromDate:"",
    txtToDate:"",
    txtPOSONo:"",
    txtItem:"",
    chkBalance:"N",
    currentDate: moment(new Date()).format("YYYYMMDD"),
    headerGrdSearch: [],
    // headerGrdSelect: [],
    dialogIsShow: false,
    itemCell: {},
  }),

  async created() {
    await this.getDataList();
    this.initHeader();
    // this.txtMoney.toLocaleString("en", {   minimumFractionDigits: 0, maximumFractionDigits: 0, })
    // this.showNotification("warning", this.$t("no_data_to_export"), '');
  },

  watch: {
    dialogIsShow(val) {
      if (val) {
        // bi loi delay nen phai setimeout, code chay nhanh nen chua kip load ref cua popup.
        setTimeout(() => {
          // this.$refs.grdView.loadData();
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
    heightGrdSearch() {
      if (this.windowHeight <= 768) {
        return this.windowHeight * 0.38;
      } else {
        return this.windowHeight * 0.4;
      }
    },
  },

  methods: {
    onClickCell(cell) {
      this.itemCell = cell.data;
    },
    onDblClickCell(row) {
      let _data = [row.data];
      this.$emit("callBackData", _data);
      this.dialogIsShow = false;
    },
    onClick01(action) {
      switch (action) {
        case "search":
          this.$refs.grdSearch.loadData();
          break;
        case "add":
          switch (this.chkDupli) {
            case 'N':
              let checkDupliArr = this.$refs.grdSelect.getDataSource()
              let itemArrAdd = this.$refs.grdSearch.getSelectRowsData()
              itemArrAdd.forEach(ee1 => {
                let test = true
                checkDupliArr.forEach(ee2 => {
                  if(ee1.PO_NO == null) ee1.PO_NO = ""
                  if(ee2.PO_NO == null) ee2.PO_NO = ""
                  if (ee1.PO_NO == ee2.PO_NO && ee1.SO_ITEM_NO == ee2.SO_ITEM_NO && ee1.TLG_IT_ITEM_PK == ee2.TLG_IT_ITEM_PK) {
                    test = false
                  }
                });
                if(test){
                  ee1._rowstatus = "i"
                  this.$refs.grdSelect.addRowStruct(ee1);
                }
              });
              break;
            case 'Y':
              let arr = this.$refs.grdSearch.getSelectRowsData()
              if(arr.length>0){
                arr.forEach(ee1 => {
                  ee1._rowstatus = "i"
                  this.$refs.grdSelect.addRowStruct(ee1);
                });
              }
              break;
          
            default:
              break;
          }
          break;
        case "remove":
          this.$refs.grdSelect.deleteRows();
          break;
        case "select":
          let _data = this.$refs.grdSelect.getDataSource();
          this.$emit("callBackData", _data);
          this.$refs.grdSelect.setDataSource([])
          this.$refs.grdSearch.setDataSource([])
          this.dialogIsShow = false;
          break;
      }
    },
    async getDataList() {},
    initHeader() {
      this.headerGrdSearch = [
        // PO_NO, SO_ITEM_NO, TLG_IT_ITEM_PK, ITEM_CODE, ITEM_NAME, UOM, ORD_QTY, PROD_QTY, REQ_QTY, REQ_BAL, STOCK_BAL, TLG_SA_SALEORDER_D_PK, DESCRIPTION
        // po_no, so_item_no, tlg_it_item_pk, item_code, item_name, uom, ord_qty, prod_qty, req_qty, req_bal, stock_bal, tlg_sa_saleorder_d_pk, description
        { dataField: "PO_NO", caption: this.$t("po_no"), width: 120, allowEditing: false, }, 
        { dataField: "SO_ITEM_NO", caption: this.$t("so_item_no"), width: 120, allowEditing: false, }, 
        { dataField: "TLG_IT_ITEM_PK", caption: this.$t("tlg_it_item_pk"), width: 120, allowEditing: false, visible:false }, 
        { dataField: "ITEM_CODE", caption: this.$t("item_code"), width: 120, allowEditing: false, }, 
        { dataField: "ITEM_NAME", caption: this.$t("item_name"), width: 120, allowEditing: false, }, 
        { dataField: "UOM", caption: this.$t("uom"), width: 120, allowEditing: false, }, 
        { dataField: "ORD_QTY", caption: this.$t("ord_qty"), width: 120, allowEditing: false, formatFloat: 2, dataType: "number", }, 
        { dataField: "PROD_QTY", caption: this.$t("prod_qty"), width: 120, allowEditing: false, formatFloat: 2, dataType: "number", }, 
        { dataField: "REQ_QTY", caption: this.$t("req_qty"), width: 120, allowEditing: false, formatFloat: 2, dataType: "number", }, 
        { dataField: "REQ_BAL", caption: this.$t("req_bal"), width: 120, allowEditing: false, formatFloat: 2, dataType: "number", }, 
        { dataField: "STOCK_BAL", caption: this.$t("stock_bal"), width: 120, allowEditing: false, formatFloat: 2, dataType: "number", }, 
        { dataField: "TLG_SA_SALEORDER_D_PK", caption: this.$t("tlg_sa_saleorder_d_pk"), width: 120, allowEditing: false, visible:false }, 
        { dataField: "DESCRIPTION", caption: this.$t("description"), width: 120, allowEditing: false, },
      ];
    },
  },
};
</script>

<style>
</style>
