<template>
<v-dialog id="bank-dialog" max-width="1400" v-model="dialogIsShow">
  <v-card>
    <v-card-title class="headline primary-gradient white--text py-2">
      <span>{{ $t("transfer_waiting") }}</span>
      <v-spacer></v-spacer>
      <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
    </v-card-title>
    <v-container fluid class="pa-2" v-resize="onResize">
      <v-row dense>
        <div class="div01">
          <p class="p09">MATERIAL WH</p>
          <p class="p10">transfer waiting</p>
          <p class="p11">(From INGOT WH to CASTING WORKSHOP WH)</p>
          <p class="p12">
            {{ this.strCurrentDate }} day shift <br />
            {{ this.user.USER_NAME }}
          </p>
        </div>
      </v-row>
      <v-row dense>
        <v-col md="2">
          <BaseInput :label="$t('req_no')" v-model="txtReqNo" @keyPressEnter="onClick('search')" />
        </v-col>
        <v-col md="2">
          <BaseSelect item-value="CODE" item-text="NAME" :label="$t('item_name')" :lstData="lstItemName" v-model="itemItemName" disableSearch />
        </v-col>
        <v-col md="1">
          <div class="d-flex justify-center">
            <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="onClick('search')" />
          </div>
        </v-col>
        <v-col md="1">
          <BaseCheckbox :label="$t('only_item')" true-value="Y" false-value="N" v-model="chkOnlyItem" />
        </v-col>
      </v-row>
      <v-row dense v-show="showItem">
        <div class="div01">
          <table>
            <tr>
              <td class="td02">
                <p class="p13">{{ this.txtItemNameShow }}</p>
              </td>
              <td class="td02">
                <div class="div16">
                  <p class="p14">
                    {{
                        this.txtQtyShow.toLocaleString("en", {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })
                      }}
                  </p>
                  <p class="p15">&nbsp;kg</p>
                </div>
              </td>
              <td class="td02">
                <div class="div16">
                  <p class="p14">{{ this.txtPalletShow }}</p>
                  <p class="p15">&nbsp;pallet</p>
                </div>
              </td>
            </tr>
          </table>
        </div>
      </v-row>
      <v-row dense>
        <v-col md="4">
          <DataGridView column-resizing-mode="widget" ref="grdD" :header="headerGrdD" select_mode="Single" :auto_load="false" :max_height="heightGrdD" sel_procedure="LG_SEL_LOC_PLT_QTY_2_NOCACHE" :filter_paras="filterParaGrdD" />
        </v-col>
        <v-col md="8">
          <!-- sơ đồ kho tại đây -->
          <!-- AA -->
          <div class="div19">
            <div class="div17">
              <p class="p16">AA</p>
            </div>
            <div :class="item.LOC_QTY > 0 ? 'div18' : 'div20'" v-for="(item, index) in lstAA" :key="index">
              <p class="p17">{{ item.LOC_ID }}</p>
              <p class="p18">
                {{
                    item.LOC_QTY.toLocaleString("en", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })
                  }}
              </p>
            </div>
          </div>
          <!-- AB -->
          <div class="div19">
            <div class="div17">
              <p class="p16">AB</p>
            </div>
            <div :class="item.LOC_QTY > 0 ? 'div18' : 'div20'" v-for="(item, index) in lstAB" :key="index">
              <p class="p17">{{ item.LOC_ID }}</p>
              <p class="p18">
                {{
                    item.LOC_QTY.toLocaleString("en", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })
                  }}
              </p>
            </div>
          </div>
        </v-col>
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
    objSend02: {
      type: Object,
      default: () => {
        return {
          TLG_IT_ITEM_PK:'',
          ITEM_NAME:''
        }
      },
    },
  },

  components: {},

  data: () => ({
    chkOnlyItem: 'N',
    lstAA: [],
    lstAB: [],
    showItem: false,
    txtItemNameShow: "",
    txtQtyShow: "",
    txtPalletShow: 0,
    txtReqNo: "",
    itemItemName: "214",
    lstItemName: [{
        CODE: "214",
        NAME: "A380(W)",
      },
      {
        CODE: "216",
        NAME: "ADC12",
      },
      {
        CODE: "215",
        NAME: "AC47100",
      },
      {
        CODE: "36045",
        NAME: "SILAFONT36",
      },
      {
        CODE: "39597",
        NAME: "AC44300",
      },
      {
        CODE: "39955",
        NAME: "A380(T)",
      },
      {
        CODE: "44496",
        NAME: "DCAL-001",
      },
      {
        CODE: "39696",
        NAME: "ZINC",
      },
    ],
    currentDate: moment(new Date()).format("YYYYMMDD"),
    headerGrdD: [],
    dialogIsShow: false,
    strCurrentDate: moment(new Date()).format("YYYY.MM.DD HH:mm"),
  }),

  async created() {
    await this.getDataList();
    this.initHeader();
    // this.txtMoney.toLocaleString("en", {   minimumFractionDigits: 0, maximumFractionDigits: 0, })
  },

  watch: {
    dialogIsShow(val) {
      if (val) {
        if(this.objSend02.TLG_IT_ITEM_PK!='') {
          this.itemItemName = this.objSend02.TLG_IT_ITEM_PK.toString()
          this.txtItemNameShow = this.objSend02.ITEM_NAME.toString()
          this.chkOnlyItem = 'Y'
          this.onSearch()
        }
      }
    },
  },

  mounted() {},

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
    filterParaGrdD() {
      return [2, this.itemItemName, this.user.TCO_COMPANY_PK, this.currentDate];
    },
  },

  methods: {
    async loadLocItemWH() {
      this.showItem = false;
      this.lstAA.forEach((ee1) => {
        ee1.LOC_QTY = 0
      });
      this.lstAB.forEach((ee1) => {
        ee1.LOC_QTY = 0
      });
      let item = this.lstItemName.filter(item => item.CODE == this.itemItemName)
      this.txtItemNameShow = item[0].NAME;
      this.txtQtyShow = 0;
      this.txtPalletShow = 0;
      this.showItem = true;
      const dsoS2 = {
        type: "list",
        selpro: "LG_SEL_LOC_PLT_QTY_2_NOCACHE",
        para: [ 2, this.itemItemName, this.user.TCO_COMPANY_PK, this.currentDate ],
      };
      const resS2 = await this._dsoCall(dsoS2, "select", false);
      let arr01 = resS2;
      const dsoS3 = {
        type: "list",
        selpro: "LG_SEL_LOC_PLT_QTY_1_NOCACHE",
        para: [this.itemItemName, this.currentDate],
      };
      const resS3 = await this._dsoCall(dsoS3, "select", false);
      resS3.forEach((ee1) => {
        arr01.forEach((ee2) => {
          if (ee1.TLG_IN_WHLOC_PK == ee2.TLG_IN_WHLOC_PK) {
            ee2.PALLET_QTY = ee1.PLT;
            this.txtPalletShow += parseInt(ee1.PLT);
            this.txtQtyShow += parseInt(ee2.REQUEST_QTY);
          }
        });
      });
      this.$refs.grdD.setDataSource(arr01);
      this.lstAA.forEach((ee1) => {
        ee1.LOC_QTY = 0
        arr01.forEach((ee2) => {
          if (ee1.LOC_ID == ee2.LOC_NAME.slice(0, 4)) {
            ee1.LOC_QTY += parseInt(ee2.REQUEST_QTY);
          }
        });
      });
      this.lstAB.forEach((ee1) => {
        ee1.LOC_QTY = 0
        arr01.forEach((ee2) => {
          if (ee1.LOC_ID == ee2.LOC_NAME.slice(0, 4)) {
            ee1.LOC_QTY += parseInt(ee2.REQUEST_QTY);
          }
        });
      });
    },
    async onSearch() {
      if (this.chkOnlyItem == 'N') {
        this.showItem = false;
        let check = true;
        if (this.txtReqNo == "" || this.txtReqNo == null) {
          this.showNotification(
            "warning",
            this.$t("please_input_req_no"),
            "",
            3000
          );
          check = false;
        }
        if (this.itemItemName == "" || this.itemItemName == null) {
          this.showNotification(
            "warning",
            this.$t("please_input_item_name"),
            "",
            3000
          );
          check = false;
        }
        if (check) {
          const dsoS1 = {
            type: "list",
            selpro: "LG_SEL_MECA040_RMWH_5_NOCACHE",
            para: [this.txtReqNo, this.itemItemName],
          };
          const resS1 = await this._dsoCall(dsoS1, "select", false);
          if (resS1.length > 0) {
            this.txtItemNameShow = resS1[0].ITEM_NAME;
            this.txtQtyShow = resS1[0].REQ_QTY;
            this.txtPalletShow = 0;
            this.showItem = true;
            const dsoS2 = {
              type: "list",
              selpro: "LG_SEL_LOC_PLT_QTY_2_NOCACHE",
              para: [
                2,
                this.itemItemName,
                this.user.TCO_COMPANY_PK,
                this.currentDate,
              ],
            };
            const resS2 = await this._dsoCall(dsoS2, "select", false);
            let numQty = 0;
            let arr01 = [];
            resS2.forEach((ee1) => {
              if (numQty <= this.txtQtyShow) {
                arr01.push(ee1);
                numQty += parseInt(ee1.REQUEST_QTY);
              }
              if (numQty > this.txtQtyShow) return;
            });
            const dsoS3 = {
              type: "list",
              selpro: "LG_SEL_LOC_PLT_QTY_1_NOCACHE",
              para: [this.itemItemName, this.currentDate],
            };
            const resS3 = await this._dsoCall(dsoS3, "select", false);
            resS3.forEach((ee1) => {
              arr01.forEach((ee2) => {
                if (ee1.TLG_IN_WHLOC_PK == ee2.TLG_IN_WHLOC_PK) {
                  ee2.PALLET_QTY = ee1.PLT;
                  this.txtPalletShow += parseInt(ee1.PLT);
                }
              });
            });
            this.$refs.grdD.setDataSource(arr01);
            this.lstAA.forEach((ee1) => {
              ee1.LOC_QTY = 0
              arr01.forEach((ee2) => {
                if (ee1.LOC_ID == ee2.LOC_NAME.slice(0, 4)) {
                  ee1.LOC_QTY += parseInt(ee2.REQUEST_QTY);
                }
              });
            });
            this.lstAB.forEach((ee1) => {
              ee1.LOC_QTY = 0
              arr01.forEach((ee2) => {
                if (ee1.LOC_ID == ee2.LOC_NAME.slice(0, 4)) {
                  ee1.LOC_QTY += parseInt(ee2.REQUEST_QTY);
                }
              });
            });
          } else {
            this.showNotification("warning", this.$t("no_data_found"), "", 3000);
            this.$refs.grdD.Clear();
            let arr01 = this.lstAA
            arr01.forEach((ee1) => {
              ee1.LOC_QTY = 0;
            });
            this.lstAA = arr01
            let arr02 = this.lstAB
            arr02.forEach((ee1) => {
              ee1.LOC_QTY = 0;
            });
            this.lstAB = arr02
          }
        }
      } else {
        this.loadLocItemWH()
      }
    },
    onClick(action) {
      switch (action) {
        case "search":
          this.onSearch();
          break;
      }
    },
    async getDataList() {
      const dso = {
        type: "list",
        selpro: "LG_SEL_MECA040_RMWH_6_NOCACHE",
        para: [this.user.TCO_COMPANY_PK],
      };
      const result = await this._dsoCall(dso, "select", false);
      this.lstAA = result.filter((item) => item.TYPE == "AA");
      this.lstAB = result.filter((item) => item.TYPE == "AB");
    },
    initHeader() {
      this.headerGrdD = [
        { dataField: "SEQ", caption: this.$t("seq"), width: 50, allowEditing: false, hidden: false, }, 
        { dataField: "LOC_NAME", caption: this.$t("location"), width: 90, allowEditing: false, hidden: false, }, 
        { dataField: "LOT_NO", caption: this.$t("fifo_lot_no"), width: 90, allowEditing: false, hidden: false, }, 
        { dataField: "PALLET_QTY", caption: this.$t("pallet_qty"), width: 80, allowEditing: false, hidden: false, formatFloat: 0, dataType: "number", }, 
        { dataField: "REQUEST_QTY", caption: this.$t("request_qty"), width: 80, allowEditing: false, hidden: false, formatFloat: 0, dataType: "number", },
      ];
    },
  },
};
</script>

<style>
.p09 { text-transform: uppercase; color: #c00000; font-size: 22px; margin-left: 10px; width: 180px; }
.p10 { font-weight: bold; margin-top: 5px; text-transform: uppercase; width: 160px; }
.p11 { width: 550px; font-weight: bold; font-size: 20px; text-align: left; color: #939393; }
.p12 { width: 250px; color: #c00000; margin-top: 5px; margin-left: 100px; text-transform: uppercase; text-align: right; }
.td02 { border: solid 1px gainsboro; padding-left: 5px; padding-right: 5px; }
.p13 { font-size: 24px; color: #0178E6; }
.p14 { font-size: 24px; color: #0178E6; margin-top: 3px; }
.p15 { font-size: 28px; color: black; text-transform: uppercase; }
.div16 { display: flex; }
.div19 { margin-left: 5px; margin-bottom: 15px; display: flex; }
.div17 { width: 80px; height: 80px; background-color: #4dd0ff; color: white; border-radius: 5px; margin-right: 10px; box-shadow: 1px 0px 5px #4dd0ff; }
.div18 { width: 80px; height: 80px; background-color: #04d945; color: white; border-radius: 5px; box-shadow: 1px 0px 5px #04d945; border: 2px solid #dfe2e8; }
.div20 { width: 80px; height: 80px; background-color: #dfebdf; color: white; border-radius: 5px; box-shadow: 1px 0px 5px #dfebdf; border: 2px solid #dfe2e8; }
.p16 { width: 80px; height: 80px; font-weight: bold; line-height: 80px; text-align: center; font-size: 16px; }
.p17 { width: 78px; height: 40px; font-weight: bold; line-height: 40px; text-align: center; font-size: 16px; border-bottom: 2px solid #dfe2e8; color: black; }
.p18 { width: 80px; height: 40px; font-weight: bold; line-height: 40px; text-align: center; font-size: 16px; color: #ff5252; }
</style>
