<template>
<v-dialog id="bank-dialog" max-width="1000" v-model="dialogIsShow">
  <v-card>
    <v-card-title class="headline primary-gradient white--text py-2">
      <span>{{ $t("delivery_request") }}</span>
      <v-spacer></v-spacer>
      <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
    </v-card-title>
    <v-container fluid class="pa-2" v-resize="onResize">
      <v-row dense>
        <div class="div01">
          <p class="p09">FINISHED GOODS</p>
          <p class="p10">delivery request</p>
        </div>
      </v-row>
      <v-row dense>
        <v-col md="3">
          <BaseInput :label="$t('req_no')" v-model="txtReqNo" @keyPressEnter="onClick('search')" />
        </v-col>
        <v-col md="3">
          <BaseInput :label="$t('item_name')" v-model="itemItemName" @keyPressEnter="onClick('search')" />
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
          <DataGridView column-resizing-mode="widget" ref="grdD" :header="headerGrdD" select_mode="Single" :auto_load="false" :max_height="heightGrdD" :sel_procedure="selGrdD" :filter_paras="paraGrdD" />
        </v-col>
        <v-col md="8" v-show="showLoc">
          <!-- sơ đồ kho tại đây -->
          <v-row dense>
            <div class="div21">
              <p class="p19"> KA </p>
            </div>
            <div class="div21">
              <p class="p19"> KB </p>
            </div>
            <div class="div21">
              <p class="p19"> KC </p>
            </div>
            <div class="div21">
              <p class="p19"> KD </p>
            </div>
            <div class="div21">
              <p class="p19"> KE </p>
            </div>
            <div class="div21">
              <p class="p19"> KF </p>
            </div>
            <div class="div28">
            </div>
            <div class="div29">
              <p class="p19">COMMON</p>
            </div>
          </v-row>
          <v-row dense>
            <div class="div22">
              <div :class="item.LOC_QTY > 0 ? 'div24' : 'div23'" v-for="(item,index) in lstKA" :key="index">
                <p class="p20">
                  {{item.LOC_ID}}
                </p>
                <p class="p21">
                  {{item.LOC_QTY.toLocaleString("en", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}}
                </p>
              </div>
            </div>
            <div class="div22">
              <div :class="item.LOC_QTY > 0 ? 'div24' : 'div23'" v-for="(item,index) in lstKB" :key="index">
                <p class="p20">
                  {{item.LOC_ID}}
                </p>
                <p class="p21">
                  {{item.LOC_QTY.toLocaleString("en", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}}
                </p>
              </div>
            </div>
            <div class="div22">
              <div :class="item.LOC_QTY > 0 ? 'div24' : 'div23'" v-for="(item,index) in lstKC" :key="index">
                <p class="p20">
                  {{item.LOC_ID}}
                </p>
                <p class="p21">
                  {{item.LOC_QTY.toLocaleString("en", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}}
                </p>
              </div>
            </div>
            <div class="div22">
              <div :class="item.LOC_QTY > 0 ? 'div24' : 'div23'" v-for="(item,index) in lstKD" :key="index">
                <p class="p20">
                  {{item.LOC_ID}}
                </p>
                <p class="p21">
                  {{item.LOC_QTY.toLocaleString("en", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}}
                </p>
              </div>
            </div>
            <div class="div22">
              <div :class="item.LOC_QTY > 0 ? 'div24' : 'div23'" v-for="(item,index) in lstKE" :key="index">
                <p class="p20">
                  {{item.LOC_ID}}
                </p>
                <p class="p21">
                  {{item.LOC_QTY.toLocaleString("en", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}}
                </p>
              </div>
            </div>
            <div class="div22">
              <div :class="item.LOC_QTY > 0 ? 'div24' : 'div23'" v-for="(item,index) in lstKF" :key="index">
                <p class="p20">
                  {{item.LOC_ID}}
                </p>
                <p class="p21">
                  {{item.LOC_QTY.toLocaleString("en", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}}
                </p>
              </div>
            </div>
            <div class="div28">
            </div>
            <div class="div22">
              <div :class="qtyOther > 0 ? 'div31' : 'div30'">
                <p class="p20">
                  other
                </p>
                <p class="p21">
                  {{this.qtyOther.toLocaleString("en", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}}
                </p>
              </div>
            </div>
          </v-row>
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
    selGrdD: {
      type: String,
      default: "",
    },
    paraGrdD: {
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
    },
  },

  components: {},

  data: () => ({
    qtyOther:0,
    lstKA: [],
    lstKB: [],
    lstKC: [],
    lstKD: [],
    lstKE: [],
    lstKF: [],
    showLoc: true,
    chkOnlyItem: 'N',
    lstLocAA: [],
    lstLocAB: [],
    showItem: false,
    txtItemNameShow: "",
    txtQtyShow: "",
    txtPalletShow: 0,
    txtReqNo: "",
    itemItemName: "",
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
        this.txtReqNo = this.objSend.REQ_NO
        this.itemItemName = this.objSend.ITEM_NAME
        this.chkOnlyItem = 'N'
        setTimeout(() => {
          this.$refs.grdD.setDataSource([])
          // this.$refs.grdD.loadData()
          this.onSearch()
        }, 10);
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
      this.resetQtyLoc()
      this.txtItemNameShow = this.itemItemName;
      this.txtQtyShow = 0;
      this.txtPalletShow = 0;
      this.showItem = true;
      const dsoS2 = {
        type: "list",
        selpro: "LG_SEL_MECA090_3_NOCACHE",
        para: [this.paraGrdD[0], this.paraGrdD[1], this.itemItemName, this.paraGrdD[3]],
      };
      const resS2 = await this._dsoCall(dsoS2, "select", false);
      let arr01 = resS2;
      arr01.forEach((ee2) => {
        this.txtPalletShow += parseInt(ee2.PALLET_QTY);
        this.txtQtyShow += parseInt(ee2.QTY);
        if(ee2.LOCATION_ID.indexOf("KA")<0&&ee2.LOCATION_ID.indexOf("KB")<0&&ee2.LOCATION_ID.indexOf("KC")<0&&ee2.LOCATION_ID.indexOf("KD")<0&&ee2.LOCATION_ID.indexOf("KE")<0&&ee2.LOCATION_ID.indexOf("KF")<0){
          this.qtyOther += parseInt(ee2.QTY)
        }
      });
      this.$refs.grdD.setDataSource(arr01);
      this.loadQtyOfLocation(arr01)
    },
    loadQtyOfLocation(arr01) {
      this.qtyOther = 0
      arr01.forEach((ee2) => {
        if(ee2.LOCATION_ID.indexOf("KA")<0&&ee2.LOCATION_ID.indexOf("KB")<0&&ee2.LOCATION_ID.indexOf("KC")<0&&ee2.LOCATION_ID.indexOf("KD")<0&&ee2.LOCATION_ID.indexOf("KE")<0&&ee2.LOCATION_ID.indexOf("KF")<0){
          this.qtyOther += parseInt(ee2.QTY)
        }
      });
      this.lstKA.forEach((ee1) => {
        ee1.LOC_QTY = 0
        arr01.forEach((ee2) => {
          if (ee1.LOC_ID == ee2.LOCATION_ID.slice(0, 4)) {
            ee1.LOC_QTY += parseInt(ee2.QTY);
          }
        });
      });
      this.lstKB.forEach((ee1) => {
        ee1.LOC_QTY = 0
        arr01.forEach((ee2) => {
          if (ee1.LOC_ID == ee2.LOCATION_ID.slice(0, 4)) {
            ee1.LOC_QTY += parseInt(ee2.QTY);
          }
        });
      });
      this.lstKC.forEach((ee1) => {
        ee1.LOC_QTY = 0
        arr01.forEach((ee2) => {
          if (ee1.LOC_ID == ee2.LOCATION_ID.slice(0, 4)) {
            ee1.LOC_QTY += parseInt(ee2.QTY);
          }
        });
      });
      this.lstKD.forEach((ee1) => {
        ee1.LOC_QTY = 0
        arr01.forEach((ee2) => {
          if (ee1.LOC_ID == ee2.LOCATION_ID.slice(0, 4)) {
            ee1.LOC_QTY += parseInt(ee2.QTY);
          }
        });
      });
      this.lstKE.forEach((ee1) => {
        ee1.LOC_QTY = 0
        arr01.forEach((ee2) => {
          if (ee1.LOC_ID == ee2.LOCATION_ID.slice(0, 4)) {
            ee1.LOC_QTY += parseInt(ee2.QTY);
          }
        });
      });
      this.lstKF.forEach((ee1) => {
        ee1.LOC_QTY = 0
        arr01.forEach((ee2) => {
          if (ee1.LOC_ID == ee2.LOCATION_ID.slice(0, 4)) {
            ee1.LOC_QTY += parseInt(ee2.QTY);
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
          this.txtItemNameShow = this.objSend.ITEM_NAME;
          this.txtQtyShow = this.objSend.QTY;
          this.txtPalletShow = 0;
          this.showItem = true;
          const dsoS2 = {
            type: "list",
            selpro: this.selGrdD,
            para: this.paraGrdD,
          };
          const resS2 = await this._dsoCall(dsoS2, "select", false);
          let numQty = 0;
          let arr01 = [];
          resS2.forEach((ee1) => {
            if (numQty <= this.txtQtyShow) {
              arr01.push(ee1);
              numQty += ee1.QTY;
              this.txtPalletShow += parseInt(ee1.PALLET_QTY);
            }
            if (numQty > this.txtQtyShow) return;
          });
          this.$refs.grdD.setDataSource(arr01);
          this.loadQtyOfLocation(arr01)
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
    resetQtyLoc() {
      this.lstKA.forEach((ee1) => {
        ee1.LOC_QTY = 0
      });
      this.lstKB.forEach((ee1) => {
        ee1.LOC_QTY = 0
      });
      this.lstKC.forEach((ee1) => {
        ee1.LOC_QTY = 0
      });
      this.lstKD.forEach((ee1) => {
        ee1.LOC_QTY = 0
      });
      this.lstKE.forEach((ee1) => {
        ee1.LOC_QTY = 0
      });
      this.lstKF.forEach((ee1) => {
        ee1.LOC_QTY = 0
      });
    },
    async getDataList() {
      const dso = {
        type: "list",
        selpro: "LG_SEL_MECA090_2_NOCACHE",
        para:['K'],
      };
      const result = await this._dsoCall(dso, "select", false);
      this.lstKA = result.filter((item) => item.LOC_ID.indexOf("KA") > -1);
      this.lstKB = result.filter((item) => item.LOC_ID.indexOf("KB") > -1);
      this.lstKC = result.filter((item) => item.LOC_ID.indexOf("KC") > -1);
      this.lstKD = result.filter((item) => item.LOC_ID.indexOf("KD") > -1);
      this.lstKE = result.filter((item) => item.LOC_ID.indexOf("KE") > -1);
      this.lstKF = result.filter((item) => item.LOC_ID.indexOf("KF") > -1);
    },
    initHeader() {
      this.headerGrdD = [
        { dataField: "SEQ", caption: this.$t("No"), width: 50, allowEditing: false, hidden: false, }, 
        { dataField: "LOCATION_ID", caption: this.$t("location"), width: 80, allowEditing: false, hidden: false, alignment: "left", }, 
        { dataField: "QTY", caption: this.$t("qty"), width: 80, allowEditing: false, hidden: false, formatFloat: 0, dataType: "number", }, 
        { dataField: "PALLET_QTY", caption: this.$t("pallet_qty"), width: 80, allowEditing: false, hidden: false, alignment: "left", },
      ];
    },
  },
};
</script>

<style>

.div21 { width: 60px; height: 40px; border-radius: 5px; background-color: #FA8A1C; box-shadow: 1px 0px 5px #FA8A1C; margin-left: 5px; }
.div29 { width: 80px; height: 40px; border-radius: 5px; background-color: #FFCE2F; box-shadow: 1px 0px 5px #FFCE2F; margin-left: 5px; }
.div22 { display: block; margin-left: 5px; }
.div23 { width: 60px; height: 40px; border-radius: 5px; background-color: #dfebdf; box-shadow: 1px 0px 5px #dfebdf; border: 2px solid #dfe2e8; }
.div24 { width: 60px; height: 40px; border-radius: 5px; background-color: #04d945; box-shadow: 1px 0px 5px #04d945; border: 2px solid #dfe2e8; }
.div30 { width: 80px; height: 40px; border-radius: 5px; background-color: #dfebdf; box-shadow: 1px 0px 5px #dfebdf; border: 2px solid #dfe2e8; }
.div31 { width: 80px; height: 40px; border-radius: 5px; background-color: #04d945; box-shadow: 1px 0px 5px #04d945; border: 2px solid #dfe2e8; }
.p19 { font-size: 14px; font-weight: bold; text-align: center; line-height: 40px; }
.p20 { font-size: 14px; font-weight: bold; text-align: center; line-height: 20px; border-bottom: 2px solid #dfe2e8; }
.p21 { font-size: 14px; font-weight: bold; text-align: center; line-height: 20px; } 
.div28{ width: 60px; height: 40px; }
</style>
