<template>
<v-dialog id="bank-dialog" max-width="1400" v-model="dialogIsShow">
  <v-card>
    <v-card-title class="headline primary-gradient white--text py-2">
      <span>{{ $t("get_item_barcode") }}</span>
      <v-spacer></v-spacer>
      <v-icon dark @click="onClosePopup">mdi-close-thick</v-icon>
    </v-card-title>
    <v-container fluid class="pa-2" v-resize="onResize">
      <v-row dense>
        <v-col :cols="cols_right2">
          <v-row dense>
            <v-col md="4" v-show="objMaster.isYNLoc">
              <v-text-field ref="refLoc" :label="$t('scan_loc')" autofocus v-model="txtLoc" @keypress.enter="onClick('loc')" @click="clearTxtLoc" />
            </v-col>
            <v-col md="4">
              <v-text-field ref="refBarcode" :label="$t('scan_br')" v-model="txtScanBc" @keypress.enter="onClick('generate')" />
            </v-col>
            <v-col md="2" v-show="objMaster.isYNLoc">
            </v-col>
            <v-col md="2"></v-col>
          </v-row>
          <v-row dense>
            <v-col md="4">
              <b class="textColor1">{{ this.$t("valid_barcodes") }}</b>
            </v-col>
            <v-col md="2">
              <b>{{ $t("sum_bc_qty") }}:</b>&nbsp;<b class="textColor2">{{ this.txtSumBcQty }}
              </b>
            </v-col>
            <v-col md="4">
              <b>{{ $t("sum_qty") }}:&nbsp; </b><b class="textColor2">{{ this.txtSumQty }}</b>
            </v-col>
            <v-col md="2">
              <div class="d-flex justify-center">
                <BaseButton icon_type="delete" :btn_text="$t('delete')" :disabled="isProcessing" @onclick="onClick('detele')" />
                <BaseButton icon_type="save" :btn_text="$t('save')" :disabled="isProcessing" @onclick="onClick('save')" />
              </div>
            </v-col>
          </v-row>
          <v-row dense>
            <!-- <BaseGridView column-resizing-mode="widget" ref="grdDetail01" :setting="true" :multiselect="true" :height="heightGrdDetail02" :header="headerDetail01" sel_procedure="notavailable" :filter_paras="[
              this.objMaster.MasterPK,
            ]">
            </BaseGridView> -->
            <DataGridView column-resizing-mode="widget" ref="grdDetail01" sel_procedure="notavailable" :auto_load="false" :max_height="heightGrdDetail02" :filter_paras="[this.txtScanBc]" :header="headerDetail01" upd_procedure="LG_UPD_5030011_3" :update_paras="paraGrdDetail2" :select_mode="'Multiple'" />
          </v-row>
          <v-row dense>
            <v-col md="4">
              <b class="textColor2">{{ this.$t("invalid_barcodes") }}</b>
            </v-col>
            <v-col md="2">
              <b>{{ $t("sum_bc_qty") }}:</b>&nbsp;<b class="textColor2">{{ this.txtSumBcQtyErr }}
              </b>
            </v-col>
            <v-col md="4">
              <b>{{ $t("sum_qty") }}:&nbsp; </b><b class="textColor2">{{ this.txtSumQtyErr }}</b>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col md="12" class="py-1">
              <!-- <BaseGridView column-resizing-mode="widget" ref="grdDetail02" :setting="true" :multiselect="true" :height="heightGrdDetail02" :header="headerDetail01" sel_procedure="notavailable" :filter_paras="[
              this.objMaster.MasterPK,
            ]">
              </BaseGridView> -->
              <DataGridView column-resizing-mode="widget" ref="grdDetail02" sel_procedure="notavailable" :auto_load="false" :max_height="heightGrdDetail02" :filter_paras="[this.txtScanBc]" :header="headerDetail01" :select_mode="'Single'" />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</v-dialog>
</template>

<script>
// form tham khảo 4025000, 5070010, 8040070, 8050050
export default {
  layout: "default",
  middleware: "user",
  props: {
    callBackData: {
      type: Array,
      default: () => {
        return [];
      },
    },
    refresh: {
      type: Number,
      default: 0,
    },
    objMaster: {
      type: Object,
      default: () => {
        return null;
      },
    },
  },

  components: {},

  data: () => ({
    headerDetail01: [],
    dialogIsShow: false,
    cols_right2: 12,
    txtScanBc: "",
    txtLoc: "",
    txtLocShowIn: "warehouse",
    paraGrdDetail2: ["PK", "ITEM_BC", "BC_QTY", "BC_SEQ", "LOT_NO", "YYYYMMDD"],
    txtSumBcQty: 0,
    txtSumQty: 0,
    txtSumBcQtyErr: 0,
    txtSumQtyErr: 0,
    txtRandPointID: 0,
    txtRandExecKey: 0,
    txtLocPK: 0,
    txtChkRefresh: 0,
  }),

  async created() {
    this.initHeader();
  },

  watch: {
    async dialogIsShow(val) {
      if (val) {
        if (this.objMaster.isYNLoc) {
          if (this.objMaster.WHPK != 0) { // nếu WH là casting workshop thì loc chỉ có 1 là CASTING WORKSHOP
            const res1 = await this._callProcedure(
              "LG_5040046_CHECK_LOC_FR_WH",
              [this.objMaster.WHName]
            );
            if (res1.length > 0) {
              this.txtLocPK = res1[0].PK;
              this.txtLoc = res1[0].LOC_ID + " - " + res1[0].LOC_NAME;
              setTimeout(() => {
                this.$refs.refBarcode.focus();
              }, 20);
            } else {
              setTimeout(() => {
                this.$refs.refLoc.focus();
              }, 20);
            }
          } else {
            setTimeout(() => {
              this.$refs.refLoc.focus();
            }, 20);
          }
        } else {
          setTimeout(() => {
            // this.$refs.refBarcode.focus(); //tạm off
              this.$refs.refLoc.focus();
          }, 20);
        }
        this.onCreateRand();
        this.initHeader();
        this.txtChkRefresh = 0;
      } else {
        this.onDelete("");
      }
    },
  },

  mounted() {},

  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
    heightGrdDetail02() {
      return this.windowHeight * 0.3;
    },
  },

  methods: {
    clearTxtLoc() {
      this.txtLoc = "";
    },
    onCreateRand() {
      this.txtRandPointID =
        new Date().getTime().toString() +
        (parseInt(Math.random() * 1000) + 1).toString();
      this.txtRandExecKey =
        new Date().getTime().toString() +
        (parseInt(Math.random() * 1000) + 1).toString();
    },
    onClosePopup() {
      this.dialogIsShow = false;
      this.$refs.grdDetail01.Clear();
      this.$refs.grdDetail02.Clear();
      this.txtLocPK = 0;
      this.txtScanBc = "";
      this.txtLoc = "";
      this.txtSumBcQty = 0;
      this.txtSumQty = 0;
      this.txtRandExecKey = 0;
      // this.txtRandPointID = 0;
      this.$refs.refLoc.focus();
      this.$emit("refresh", this.txtChkRefresh);
    },
    onClickCell(cell) {
      // this.itemCell = cell.data;
    },
    onDblClickCell(row) {
      // let _data = [row.data];
      // this.$emit("callBackData", _data);
      // this.dialogIsShow = false;
    },
    async onDelete(item) {
      const res3 = await this._callProcedure(
        "GSF20_LG_MPOS_LGBARCODESCAN_CLEAR",
        [item, this.txtRandPointID]
      );
      if (res3.length > 0) {
        this.showNotification(
          res3[0].STATUS == "1" ? "success" : "warning",
          res3[0].STATUS == "1" ?
          this.$t("delete_success") :
          this.$t("delete_err"),
          "",
          4000
        );
      }
    },
    async onClick(action) {
      switch (action) {
        case "generate":
          if (this.txtScanBc == "") {
            this.showNotification(
              "warning",
              this.$t("please_input_item_barcode"),
              "",
              4000
            );
          } else {
            const arr = this.$refs.grdDetail01.getDataSource();
            let obj = {};
            let checkDuplicate = false;
            arr.forEach((ee1) => {
              if (this.txtScanBc == ee1.ITEM_BC) {
                checkDuplicate = true;
                obj = ee1;
              }
            });
            if (checkDuplicate) {
              this.showNotification(
                "danger",
                this.$t("BARCODE DUPPLICATE", "", 4000)
              );
              let arr2 = this.$refs.grdDetail02.getDataSource();
              let chk2 = false;
              arr2.forEach((ee2) => {
                if (this.txtScanBc == ee2.ITEM_BC) {
                  chk2 = true;
                }
              });
              if (chk2) {
                this.txtScanBc = "";
                this.$refs.refBarcode.focus();
              } else {
                const randPK = parseInt(Math.random() * 1000);
                this.$refs.grdDetail02.addRowStruct({
                  PK: randPK,
                  ITEM_BC: obj.ITEM_BC,
                  ITEM_CODE: obj.ITEM_CODE,
                  ITEM_NAME: obj.ITEM_NAME,
                  QTY: obj.QTY,
                  RO_NO: obj.RO_NO,
                  LOT_NO: obj.LOT_NO,
                  INCOME_DT: obj.INCOME_DT,
                  STATUS_NM: "BARCODE DUPPLICATE",
                  WHLOC_OUT_NAME: obj.WHLOC_OUT_NAME,
                  WHLOC_IN_NAME: obj.WHLOC_IN_NAME,
                });
                // calculator sum item NOTOK
                const arr = this.$refs.grdDetail02.getDataSource();
                this.txtSumQtyErr = arr.length;
                let total = 0;
                arr.forEach((ee1) => {
                  if (ee1.QTY == null) {
                    ee1.QTY = 0;
                  }
                  total += parseInt(ee1.QTY);
                });
                this.txtSumBcQtyErr = total;
                this.txtScanBc = "";
                this.$refs.refBarcode.focus();
              }
            } else {
              if (this.objMaster.isYNLoc) {
                if (this.txtLocPK != 0) {
                  const res = await this._callProcedure(
                    "GSF20_LG_MPOS_LGBARCODESCAN_UPLOAD",
                    [
                      this.objMaster.MasterPK,
                      this.txtScanBc,
                      this.txtRandPointID,
                      this.txtLocPK,
                      this.objMaster.Type,
                    ]
                  );
                  if (res.length > 0) {
                    if (res[0].STATUS == `000`) {
                      const randPK = parseInt(Math.random() * 1000);
                      this.$refs.grdDetail01.addRowStruct({
                        PK: randPK,
                        ITEM_BC: res[0].ITEM_BC,
                        ITEM_CODE: res[0].ITEM_CODE,
                        ITEM_NAME: res[0].ITEM_NAME,
                        QTY: res[0].QTY,
                        RO_NO: res[0].RO_NO,
                        LOT_NO: res[0].LOT_NO,
                        INCOME_DT: res[0].INCOME_DT,
                        STATUS_NM: res[0].STATUS_NM,
                        WHLOC_OUT_NAME: res[0].WHLOC_OUT_NAME,
                        WHLOC_IN_NAME: res[0].WHLOC_IN_NAME,
                      });
                      // calculator sum item OK
                      const arr = this.$refs.grdDetail01.getDataSource();
                      this.txtSumQty = arr.length;
                      let total = 0;
                      arr.forEach((ee1) => {
                        if (ee1.QTY == null) {
                          ee1.QTY = 0;
                        }
                        total += parseInt(ee1.QTY);
                      });
                      this.txtSumBcQty = total;
                    } else {
                      if (res[0].STATUS_NM != null && res[0].STATUS_NM != "") {
                        this.showNotification(
                          "danger",
                          res[0].STATUS_NM,
                          "",
                          4000
                        );
                      }
                      let arr2 = this.$refs.grdDetail02.getDataSource();
                      let chk2 = false;
                      arr2.forEach((ee2) => {
                        if (this.txtScanBc == ee2.ITEM_BC) {
                          chk2 = true;
                        }
                      });
                      if (chk2) {
                        this.txtScanBc = "";
                        this.$refs.refBarcode.focus();
                      } else {
                        const randPK = parseInt(Math.random() * 1000);
                        if (res[0].ITEM_BC != null && res[0].ITEM_BC != "") {
                          this.$refs.grdDetail02.addRowStruct({
                            PK: randPK,
                            ITEM_BC: res[0].ITEM_BC,
                            ITEM_CD: res[0].ITEM_CODE,
                            ITEM_NM: res[0].ITEM_NAME,
                            QTY: res[0].QTY,
                            RO_NO: res[0].RO_NO,
                            LOT_NO: res[0].LOT_NO,
                            INCOME_DT: res[0].INCOME_DT,
                            STATUS_NM: res[0].STATUS_NM,
                            WHLOC_OUT_NAME: res[0].WHLOC_OUT_NAME,
                            WHLOC_IN_NAME: res[0].WHLOC_IN_NAME,
                          });
                          // calculator sum item NOTOK
                          const arr = this.$refs.grdDetail02.getDataSource();
                          this.txtSumQtyErr = arr.length;
                          let total = 0;
                          arr.forEach((ee1) => {
                            if (ee1.QTY == null) {
                              ee1.QTY = 0;
                            }
                            total += parseInt(ee1.QTY);
                          });
                          this.txtSumBcQtyErr = total;
                        }
                        this.txtScanBc = "";
                        this.$refs.refBarcode.focus();
                      }
                    }
                    this.txtScanBc = "";
                    this.$refs.refBarcode.focus();
                  }
                } else {
                  this.showNotification(
                    "danger",
                    this.$t("please_scan_loc_first"),
                    "",
                    4000
                  );
                  this.txtScanBc = "";
                  this.$refs.refLoc.focus();
                }
              } else {
                const res = await this._callProcedure(
                  "GSF20_LG_MPOS_LGBARCODESCAN_UPLOAD",
                  [
                    this.objMaster.MasterPK,
                    this.txtScanBc,
                    this.txtRandPointID,
                    '',
                    this.objMaster.Type,
                  ]
                );
                if (res.length > 0) {
                  if (res[0].STATUS == `000`) {
                    const randPK = parseInt(Math.random() * 1000);
                    this.$refs.grdDetail01.addRowStruct({
                      PK: randPK,
                      ITEM_BC: res[0].ITEM_BC,
                      ITEM_CD: res[0].ITEM_CODE,
                      ITEM_NM: res[0].ITEM_NAME,
                      QTY: res[0].QTY,
                      RO_NO: res[0].RO_NO,
                      LOT_NO: res[0].LOT_NO,
                      INCOME_DT: res[0].INCOME_DT,
                      STATUS_NM: res[0].STATUS_NM,
                      WHLOC_OUT_NAME: res[0].WHLOC_OUT_NAME,
                      WHLOC_IN_NAME: res[0].WHLOC_IN_NAME,
                    });
                    // calculator sum item OK
                    const arr = this.$refs.grdDetail01.getDataSource();
                    this.txtSumQty = arr.length;
                    let total = 0;
                    arr.forEach((ee1) => {
                      if (ee1.QTY == null) {
                        ee1.QTY = 0;
                      }
                      total += parseInt(ee1.QTY);
                    });
                    this.txtSumBcQty = total;
                  } else {
                    if (res[0].STATUS_NM != null && res[0].STATUS_NM != "") {
                      this.showNotification(
                        "danger",
                        res[0].STATUS_NM,
                        "",
                        4000
                      );
                    }
                    let arr2 = this.$refs.grdDetail02.getDataSource();
                    let chk2 = false;
                    arr2.forEach((ee2) => {
                      if (this.txtScanBc == ee2.ITEM_BC) {
                        chk2 = true;
                      }
                    });
                    if (chk2) {
                      this.txtScanBc = "";
                      this.$refs.refBarcode.focus();
                    } else {
                      const randPK = parseInt(Math.random() * 1000);
                      if (res[0].ITEM_BC != null && res[0].ITEM_BC != "") {
                        this.$refs.grdDetail02.addRowStruct({
                          PK: randPK,
                          ITEM_BC: res[0].ITEM_BC,
                          ITEM_CD: res[0].ITEM_CODE,
                          ITEM_NM: res[0].ITEM_NAME,
                          QTY: res[0].QTY,
                          RO_NO: res[0].RO_NO,
                          LOT_NO: res[0].LOT_NO,
                          INCOME_DT: res[0].INCOME_DT,
                          STATUS_NM: res[0].STATUS_NM,
                          WHLOC_OUT_NAME: res[0].WHLOC_OUT_NAME,
                          WHLOC_IN_NAME: res[0].WHLOC_IN_NAME,
                        });
                        // calculator sum item NOTOK
                        const arr = this.$refs.grdDetail02.getDataSource();
                        this.txtSumQtyErr = arr.length;
                        let total = 0;
                        arr.forEach((ee1) => {
                          if (ee1.QTY == null) {
                            ee1.QTY = 0;
                          }
                          total += parseInt(ee1.QTY);
                        });
                        this.txtSumBcQtyErr = total;
                      }

                      this.txtScanBc = "";
                      this.$refs.refBarcode.focus();
                    }
                  }
                }
              }
            }
            this.txtScanBc = "";
            this.$refs.refBarcode.focus();
          }

          break;
        case "loc":
          const res4 = await this._callProcedure(
            "GSF20_LG_MPOS_PRO_LOC_CHECK2",
            [this.txtLoc]
          );
          if (res4.length > 0) {
            this.showNotification(
              res4[0].STATUS == "0" ? "success" : "warning",
              res4[0].STATUS_NM,
              "",
              4000
            );
            if (res4[0].STATUS == "0") {
              this.txtLocPK = res4[0].LOC_PK;
              this.txtLoc = res4[0].LOC_ID + " - " + res4[0].LOC_NAME;
              this.$refs.refBarcode.focus();
            } else {
              this.txtLoc = "";
              this.$refs.refLoc.focus();
            }
          }
          break;
        case "detele":
          const rowSel = this.$refs.grdDetail01.getSelectedRowsData();
          this.$refs.grdDetail01.deleteRows();
          this.onDelete(rowSel[0].ITEM_BC);
          break;
        case "save":
          if (!this.objMaster.isYNLoc) {
            this.txtLocPK = this.objMaster.WHPK;
            const res2 = await this._callProcedure(
              "GSF20_LG_MPOS_LGBARCODESCAN_MSLIP",
              [
                this.objMaster.MasterPK,
                this.txtRandExecKey,
                this.txtRandPointID,
                this.txtLocPK,
                this.objMaster.Type,
              ]
            );
            if (res2.length > 0) {
              this.showNotification(
                res2[0].STATUS == "1" ? "success" : "warning",
                res2[0].STATUS_NM,
                "",
                4000
              );
              this.txtChkRefresh = 1;
            }
          } else {
            if (this.txtLocPK != 0) {
              const res2 = await this._callProcedure(
                "GSF20_LG_MPOS_LGBARCODESCAN_MSLIP",
                [
                  this.objMaster.MasterPK,
                  this.txtRandExecKey,
                  this.txtRandPointID,
                  this.txtLocPK,
                  this.objMaster.Type,
                ]
              );
              if (res2.length > 0) {
                this.showNotification(
                  res2[0].STATUS == "1" ? "success" : "warning",
                  res2[0].STATUS_NM,
                  "",
                  4000
                );
                this.txtChkRefresh = 1;
              }
            } else {
              this.showNotification(
                "danger",
                "please_scan_location_first",
                "",
                4000
              );
            }
          }
          this.onCreateRand();
          this.$refs.grdDetail01.Clear();
          this.$refs.grdDetail02.Clear();
          break;
      }
    },
    async getDataList() {},
    initHeader() {
      this.headerDetail01 = [{
          dataField: "PK",
          caption: this.$t("pk"),
          width: 120,
          allowEditing: false,
          visible: false,
        },
        {
          dataField: "ITEM_BC",
          caption: this.$t("item_bc"),
          width: 120,
          allowEditing: false,
          visible: true,
        },
        
        {
          dataField: "QTY",
          caption: this.$t("bc_qty"),
          width: 120,
          allowEditing: false,
          visible: true,
        },
        {
          dataField: "ITEM_CODE",
          caption: this.$t("item_code"),
          width: 120,
          allowEditing: false,
          visible: true,
        },
        {
          dataField: "ITEM_NAME",
          caption: this.$t("item_name"),
          width: 200,
          allowEditing: false,
          visible: true,
        },
        {
          dataField: "RO_NO",
          caption: this.$t("ro_no"),
          width: 120,
          allowEditing: false,
          visible: true,
        },
        {
          dataField: "LOT_NO",
          caption: this.$t("lot_no"),
          width: 120,
          allowEditing: false,
          visible: true,
        },
        {
          dataField: "INCOME_DT",
          caption: this.$t("date"),
          width: 120,
          allowEditing: false,
          visible: false,
        },
        {
          dataField: "STATUS_NM",
          caption: this.$t("status"),          
          allowEditing: false,
          visible: true,
        },
        {
          dataField: "WHLOC_OUT_NAME",
          caption: this.objMaster.isYNLoc ? this.$t("loc_out_nm") : this.$t("loc_nm"),
          width: 120,
          allowEditing: false,
          visible: true,
        },
        {
          dataField: "WHLOC_IN_NAME",
          caption: this.$t("loc_in_nm"),
          width: 120,
          allowEditing: false,
          visible: this.objMaster.isYNLoc,
        },
      ];
    },
  },
};
</script>

<style>
.textColor1 {
  color: #0091ea;
}

.textColor3 {
  color: #0091ea;
}

.textColor2 {
  color: #ff0000;
}
</style>
