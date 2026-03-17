<template>
<v-dialog id="bank-dialog" max-width="1800" v-model="dialogIsShow">
  <v-card>
    <v-card-title class="headline primary-gradient white--text py-2">
      <span>{{ $t("stock_location") }}</span>
      <v-spacer></v-spacer>
      <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
    </v-card-title>
    <v-container fluid class="pa-2" v-resize="onResize">
      <v-row dense>
        <div class="div01">
          <p class="p09">FINISHED GOODS</p>
          <p class="p10">stock location</p>
        </div>
      </v-row>
      <v-row dense>
        <v-col md="4">
          <BaseInput :label="$t('item_name')" v-model="itemItemName" @keyPressEnter="onClick('search')" />
        </v-col>
        <v-col md="1">
          <div class="d-flex justify-center">
            <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="onClick('search')" />
          </div>
        </v-col>
      </v-row>
      <v-row dense v-show="showItem">
        <v-col md="6">
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
                  <p class="p15">&nbsp;ea</p>
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
        </v-col>
        <v-col md="6">
          <v-row dense>
            <div class="div34">
              <p class="p19">COMMON</p>
            </div>
            <div class="div33">
              <div :class="this.qtyOther > 0 ? 'div24' : 'div23'">
                <p class="p20">
                  others
                </p>
                <p class="p21"> {{this.qtyOther.toLocaleString("en", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}} </p>
              </div>
            </div>
          </v-row>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col md="3">
          <DataGridView column-resizing-mode="widget" ref="grdD" :header="headerGrdD" select_mode="Single" :auto_load="false" :max_height="heightGrdD" :sel_procedure="selGrdD" :filter_paras="paraGrdD" />
        </v-col>
        <v-col md="6" v-show="showLoc">
          <!-- sơ đồ kho L tại đây -->
          <v-row dense>
            <div class="div32">
              <p class="p19">LG</p>
            </div>
            <div class="div33">
              <div :class="item.LOC_QTY > 0 ? 'div24' : 'div23'" v-for="(item,index) in lstLG" :key="index">
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
          </v-row>
          <v-row dense>
            <div class="div32">
              <p class="p19">LH</p>
            </div>
            <div class="div33">
              <div :class="item.LOC_QTY > 0 ? 'div24' : 'div23'" v-for="(item,index) in lstLH" :key="index">
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
          </v-row>
          <v-row dense>
            <div class="div32">
              <p class="p19">LI</p>
            </div>
            <div class="div33">
              <div :class="item.LOC_QTY > 0 ? 'div24' : 'div23'" v-for="(item,index) in lstLI" :key="index">
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
          </v-row>
          <v-row dense>
            <div class="div32">
              <p class="p19">LJ</p>
            </div>
            <div class="div33">
              <div :class="item.LOC_QTY > 0 ? 'div24' : 'div23'" v-for="(item,index) in lstLJ" :key="index">
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
          </v-row>
          <v-row dense>
            <div class="div32">
              <p class="p19">LK</p>
            </div>
            <div class="div33">
              <div :class="item.LOC_QTY > 0 ? 'div24' : 'div23'" v-for="(item,index) in lstLK" :key="index">
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
          </v-row>
          <v-row dense>
            <div class="div32">
              <p class="p19">LL</p>
            </div>
            <div class="div33">
              <div :class="item.LOC_QTY > 0 ? 'div24' : 'div23'" v-for="(item,index) in lstLL" :key="index">
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
          </v-row>
          <v-row dense>
            <div class="div32">
              <p class="p19">LM</p>
            </div>
            <div class="div33">
              <div :class="item.LOC_QTY > 0 ? 'div24' : 'div23'" v-for="(item,index) in lstLM" :key="index">
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
          </v-row>
        </v-col>
        <v-col md="3" v-show="showLoc">
          <!-- sơ đồ kho K tại đây -->
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
    qtyOther: 0,
    lstLG: [],
    lstLH: [],
    lstLI: [],
    lstLJ: [],
    lstLK: [],
    lstLL: [],
    lstLM: [],
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
          this.loadLocItemWH()
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
        selpro: "LG_SEL_MECA090_7_NOCACHE",
        para: ['142', this.objSend.PK, this.user.TCO_COMPANY_PK, this.currentDate],
      };
      const resS2 = await this._dsoCall(dsoS2, "select", false);
      let arr01 = resS2;
      arr01.forEach((ee2) => {
        this.txtPalletShow += parseInt(ee2.PALLET_QTY);
        this.txtQtyShow += parseInt(ee2.REQUEST_QTY);
        if (ee2.LOC_NAME.indexOf("KA") < 0 && ee2.LOC_NAME.indexOf("KB") < 0 && ee2.LOC_NAME.indexOf("KC") < 0 && ee2.LOC_NAME.indexOf("KD") < 0 && ee2.LOC_NAME.indexOf("KE") < 0 && ee2.LOC_NAME.indexOf("KF") < 0 && ee2.LOC_NAME.indexOf("LG") < 0 && ee2.LOC_NAME.indexOf("LH") < 0 && ee2.LOC_NAME.indexOf("LI") < 0 && ee2.LOC_NAME.indexOf("LJ") < 0 && ee2.LOC_NAME.indexOf("LK") < 0 && ee2.LOC_NAME.indexOf("LL") < 0 && ee2.LOC_NAME.indexOf("LM") < 0 && ee2.LOC_NAME.indexOf("LH") < 0) {
          this.qtyOther += parseInt(ee2.REQUEST_QTY)
        }
      });
      this.$refs.grdD.setDataSource(arr01);
      this.loadQtyOfLocation(arr01)
    },
    loadQtyOfLocation(arr01) {
      this.qtyOther = 0
      arr01.forEach((ee2) => {
        if (ee2.LOC_NAME.indexOf("KA") < 0 && ee2.LOC_NAME.indexOf("KB") < 0 && ee2.LOC_NAME.indexOf("KC") < 0 && ee2.LOC_NAME.indexOf("KD") < 0 && ee2.LOC_NAME.indexOf("KE") < 0 && ee2.LOC_NAME.indexOf("KF") < 0 && ee2.LOC_NAME.indexOf("LG") < 0 && ee2.LOC_NAME.indexOf("LH") < 0 && ee2.LOC_NAME.indexOf("LI") < 0 && ee2.LOC_NAME.indexOf("LJ") < 0 && ee2.LOC_NAME.indexOf("LK") < 0 && ee2.LOC_NAME.indexOf("LL") < 0 && ee2.LOC_NAME.indexOf("LM") < 0 && ee2.LOC_NAME.indexOf("LH") < 0) {
          this.qtyOther += parseInt(ee2.REQUEST_QTY)
        }
      });
      this.lstKA.forEach((ee1) => {
        ee1.LOC_QTY = 0
        arr01.forEach((ee2) => {
          if (ee1.LOC_ID == ee2.LOC_NAME.slice(0, 4)) {
            ee1.LOC_QTY += parseInt(ee2.REQUEST_QTY);
          }
        });
      });
      this.lstKB.forEach((ee1) => {
        ee1.LOC_QTY = 0
        arr01.forEach((ee2) => {
          if (ee1.LOC_ID == ee2.LOC_NAME.slice(0, 4)) {
            ee1.LOC_QTY += parseInt(ee2.REQUEST_QTY);
          }
        });
      });
      this.lstKC.forEach((ee1) => {
        ee1.LOC_QTY = 0
        arr01.forEach((ee2) => {
          if (ee1.LOC_ID == ee2.LOC_NAME.slice(0, 4)) {
            ee1.LOC_QTY += parseInt(ee2.REQUEST_QTY);
          }
        });
      });
      this.lstKD.forEach((ee1) => {
        ee1.LOC_QTY = 0
        arr01.forEach((ee2) => {
          if (ee1.LOC_ID == ee2.LOC_NAME.slice(0, 4)) {
            ee1.LOC_QTY += parseInt(ee2.REQUEST_QTY);
          }
        });
      });
      this.lstKE.forEach((ee1) => {
        ee1.LOC_QTY = 0
        arr01.forEach((ee2) => {
          if (ee1.LOC_ID == ee2.LOC_NAME.slice(0, 4)) {
            ee1.LOC_QTY += parseInt(ee2.REQUEST_QTY);
          }
        });
      });
      this.lstKF.forEach((ee1) => {
        ee1.LOC_QTY = 0
        arr01.forEach((ee2) => {
          if (ee1.LOC_ID == ee2.LOC_NAME.slice(0, 4)) {
            ee1.LOC_QTY += parseInt(ee2.REQUEST_QTY);
          }
        });
      });
      this.lstLG.forEach((ee1) => {
        ee1.LOC_QTY = 0
        arr01.forEach((ee2) => {
          if (ee1.LOC_ID == ee2.LOC_NAME.slice(0, 4)) {
            ee1.LOC_QTY += parseInt(ee2.REQUEST_QTY);
          }
        });
      });
      this.lstLH.forEach((ee1) => {
        ee1.LOC_QTY = 0
        arr01.forEach((ee2) => {
          if (ee1.LOC_ID == ee2.LOC_NAME.slice(0, 4)) {
            ee1.LOC_QTY += parseInt(ee2.REQUEST_QTY);
          }
        });
      });
      this.lstLI.forEach((ee1) => {
        ee1.LOC_QTY = 0
        arr01.forEach((ee2) => {
          if (ee1.LOC_ID == ee2.LOC_NAME.slice(0, 4)) {
            ee1.LOC_QTY += parseInt(ee2.REQUEST_QTY);
          }
        });
      });
      this.lstLJ.forEach((ee1) => {
        ee1.LOC_QTY = 0
        arr01.forEach((ee2) => {
          if (ee1.LOC_ID == ee2.LOC_NAME.slice(0, 4)) {
            ee1.LOC_QTY += parseInt(ee2.REQUEST_QTY);
          }
        });
      });
      this.lstLK.forEach((ee1) => {
        ee1.LOC_QTY = 0
        arr01.forEach((ee2) => {
          if (ee1.LOC_ID == ee2.LOC_NAME.slice(0, 4)) {
            ee1.LOC_QTY += parseInt(ee2.REQUEST_QTY);
          }
        });
      });
      this.lstLL.forEach((ee1) => {
        ee1.LOC_QTY = 0
        arr01.forEach((ee2) => {
          if (ee1.LOC_ID == ee2.LOC_NAME.slice(0, 4)) {
            ee1.LOC_QTY += parseInt(ee2.REQUEST_QTY);
          }
        });
      });
      this.lstLM.forEach((ee1) => {
        ee1.LOC_QTY = 0
        arr01.forEach((ee2) => {
          if (ee1.LOC_ID == ee2.LOC_NAME.slice(0, 4)) {
            ee1.LOC_QTY += parseInt(ee2.REQUEST_QTY);
          }
        });
      });
    },
    async onSearch() {
      this.loadLocItemWH()
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
      this.lstLG.forEach((ee1) => {
        ee1.LOC_QTY = 0
      });
      this.lstLH.forEach((ee1) => {
        ee1.LOC_QTY = 0
      });
      this.lstLI.forEach((ee1) => {
        ee1.LOC_QTY = 0
      });
      this.lstLJ.forEach((ee1) => {
        ee1.LOC_QTY = 0
      });
      this.lstLK.forEach((ee1) => {
        ee1.LOC_QTY = 0
      });
      this.lstLL.forEach((ee1) => {
        ee1.LOC_QTY = 0
      });
      this.lstLM.forEach((ee1) => {
        ee1.LOC_QTY = 0
      });
    },
    async getDataList() {
      const dso1 = {
        type: "list",
        selpro: "LG_SEL_MECA090_2_NOCACHE",
        para: ['K'],
      };
      const result1 = await this._dsoCall(dso1, "select", false);
      this.lstKA = result1.filter((item) => item.LOC_ID.indexOf("KA") > -1);
      this.lstKB = result1.filter((item) => item.LOC_ID.indexOf("KB") > -1);
      this.lstKC = result1.filter((item) => item.LOC_ID.indexOf("KC") > -1);
      this.lstKD = result1.filter((item) => item.LOC_ID.indexOf("KD") > -1);
      this.lstKE = result1.filter((item) => item.LOC_ID.indexOf("KE") > -1);
      this.lstKF = result1.filter((item) => item.LOC_ID.indexOf("KF") > -1);
      const dso2 = {
        type: "list",
        selpro: "LG_SEL_MECA090_2_NOCACHE",
        para: ['L'],
      };
      const result2 = await this._dsoCall(dso2, "select", false);
      this.lstLG = result2.filter((item) => item.LOC_ID.indexOf("LG") > -1);
      this.lstLH = result2.filter((item) => item.LOC_ID.indexOf("LH") > -1);
      this.lstLI = result2.filter((item) => item.LOC_ID.indexOf("LI") > -1);
      this.lstLJ = result2.filter((item) => item.LOC_ID.indexOf("LJ") > -1);
      this.lstLK = result2.filter((item) => item.LOC_ID.indexOf("LK") > -1);
      this.lstLL = result2.filter((item) => item.LOC_ID.indexOf("LL") > -1);
      this.lstLM = result2.filter((item) => item.LOC_ID.indexOf("LM") > -1);
    },
    initHeader() {
      this.headerGrdD = [
        { dataField: "SEQ", caption: this.$t("No"), width: 50, allowEditing: false, hidden: false, }, 
        { dataField: "LOC_NAME", caption: this.$t("location"), width: 80, allowEditing: false, hidden: false, alignment: "left", }, 
        { dataField: "REQUEST_QTY", caption: this.$t("qty"), width: 80, allowEditing: false, hidden: false, formatFloat: 0, dataType: "number", }, 
        { dataField: "LOT_NO", caption: this.$t("lot_no"), width: 100, allowEditing: false, hidden: false, }, 
        { dataField: "PALLET_QTY", caption: this.$t("pallet_qty"), width: 80, allowEditing: false, hidden: false, alignment: "left", },
      ];
    },
  },
};
</script>

<style>

.div32 { width: 60px; height: 40px; border-radius: 5px; background-color: #4DD0FF; box-shadow: 1px 0px 5px #4DD0FF; margin-left: 5px; margin-top: 5px; }
.div33 { display: flex; margin-left: 5px; margin-top: 5px; }
.div34 { width: 80px; height: 40px; border-radius: 5px; background-color: #4DD0FF; box-shadow: 1px 0px 5px #4DD0FF; margin-left: 5px; margin-top: 5px; }
</style>
