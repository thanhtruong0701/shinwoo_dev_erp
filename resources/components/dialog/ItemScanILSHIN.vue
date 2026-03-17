<template>
<v-dialog id="bank-dialog" max-width="1400" v-model="dialogIsShow" transition="dialog-top-transition" persistent>
  <v-card>
    <v-card-title class="headline primary-gradient white--text py-2">
      <span>{{ $t("get_scan_data") }}</span>
      <v-spacer></v-spacer>
      <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
    </v-card-title>
    <v-container fluid class="pa-2" v-resize="onResize">
      <v-row dense>
        <v-col md="2">
          <BaseSelect item-value="CODE" item-text="NAME" :label="$t('item_group')" :lstData="lstGrpItem" v-model="itemGrpItem" :text_all="$t('all')" disableSearch />
        </v-col>
        <v-col md="2">
          <BaseInput :label="$t('item')" v-model="txtItem" @keyPressEnter="onClick01('search')" />
        </v-col>
        <v-col md="1">
          <BaseDatePicker :label="$t('from_dt')" v-model="txtFromDate" start/>
        </v-col>
        <v-col md="1">
          <BaseDatePicker :label="$t('to_dt')" v-model="txtToDate" today />
        </v-col>
        <v-col md="2">
          <BaseSelect item-value="CODE" item-text="NAME" :label="$t('type')" :lstData="lstType" v-model="itemType" disableSearch />
        </v-col>
        <v-col md="2">
          <BaseInput :label="$t('bc_or_lot_no')" v-model="txtBCLotNo" @keyPressEnter="onClick01('search')" />
        </v-col>
        <v-col md="1">
          <BaseCheckbox :label="$t('not_process')" true-value="Y" false-value="N" v-model="chkNoProcess" />
        </v-col>
        <v-col  md="1">
          <div class="d-flex justify-center">
            <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="onClick01('search')" />
          </div>
        </v-col>
      </v-row>
      <v-row dense>
        <DataGridView column-resizing-mode="widget" ref="grdD" :header="headerGrdD" :filterRow="true" select_mode="Multiple" :auto_load="false" :max_height="heightGrdD" sel_procedure="LG_SEL_5010011_8_NOCACHE" :filter_paras="[itemGrpItem, txtItem, txtFromDate, txtToDate, itemType, txtBCLotNo, chkNoProcess ]" />
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
        <DataGridView column-resizing-mode="widget" ref="grdSelect" :header="headerGrdD" :filterRow="true" select_mode="Single" :auto_load="false" :max_height="heightGrdD" />
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
  },

  components: {},

  data: () => ({
    chkNoProcess:"",
    txtBCLotNo:"",
    txtToDate:"",
    txtFromDate:"",
    lstType:[ { CODE: "I", NAME: "INCOME" }, { CODE: "O", NAME: "OUTGO" }, ],
    itemType: "",
    chkDupli:'N',
    lstGrpItem:[],
    itemGrpItem:"",
    txtItem:"",
    currentDate: moment(new Date()).format("YYYYMMDD"),
    headerGrdD: [],
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
          this.$refs.grdView.loadData();
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
          this.$refs.grdD.loadData();
          break;
        case "add":
          switch (this.chkDupli) {
            case 'N':
              let checkDupliArr = this.$refs.grdSelect.getDataSource()
              let itemArrAdd = this.$refs.grdD.getSelectRowsData()
              itemArrAdd.forEach(ee1 => {
                let test = true
                checkDupliArr.forEach(ee2 => {
                  if (ee1.TLG_IT_ITEM_PK == ee2.TLG_IT_ITEM_PK && ee1.LOT_NO == ee2.LOT_NO && ee1.ITEM_BC == ee2.ITEM_BC) {
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
              let arr = this.$refs.grdD.getSelectRowsData()
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
          this.$refs.grdD.setDataSource([])
          this.dialogIsShow = false;
          break;
      }
    },
    async getDataList() {
      const dso1 = {
        type: "list",
        selpro: "LG_SEL_5010011_6_NC",
        para: [this.user.PK]
      };
      const result1 = await this._dsoCall(dso1, "select", false);
      if (result1 != undefined && result1 != null) {
        if (result1.length > 0) {
          this.lstGrpItem = result1
        }
      }
    },
    initHeader() {
      this.headerGrdD = [
        // PA_PACKAGES_PK, PACKAGE_SEQ, ITEM_BC, TLG_IT_ITEM_PK, ITEM_CODE, ITEM_NAME, UOM, QTY, LOT_NO, ROLL_NO, PRINT_TIMES, TABLE_NAME, TRANS_TYPE
        // pa_packages_pk, package_seq, item_bc, tlg_it_item_pk, item_code, item_name, uom, qty, lot_no, roll_no, print_times, table_name, trans_type
        { dataField: "PA_PACKAGES_PK", caption: this.$t("pa_packages_pk"), width: 120, allowEditing: false, visible:false }, 
        { dataField: "PACKAGE_SEQ", caption: this.$t("package_seq"), width: 120, allowEditing: false, }, 
        { dataField: "ITEM_BC", caption: this.$t("item_bc"), width: 120, allowEditing: false, }, 
        { dataField: "TLG_IT_ITEM_PK", caption: this.$t("tlg_it_item_pk"), width: 120, allowEditing: false, visible:false }, 
        { dataField: "ITEM_CODE", caption: this.$t("item_code"), width: 120, allowEditing: false, }, 
        { dataField: "ITEM_NAME", caption: this.$t("item_name"), width: 240, allowEditing: false, }, 
        { dataField: "UOM", caption: this.$t("uom"), width: 120, allowEditing: false, }, 
        { dataField: "QTY", caption: this.$t("qty"), width: 120, allowEditing: false, formatFloat: 4, dataType: "number" }, 
        { dataField: "LOT_NO", caption: this.$t("lot_no"), width: 120, allowEditing: false, }, 
        { dataField: "ROLL_NO", caption: this.$t("roll_no"), width: 120, allowEditing: false, },
        { dataField: "PRINT_TIMES", caption: this.$t("print_times"), width: 120, allowEditing: false, },
        { dataField: "TRANS_TYPE", caption: this.$t("trans_type"), width: 120, allowEditing: false, },
      ];
    },
  },
};
</script>

<style>
</style>
