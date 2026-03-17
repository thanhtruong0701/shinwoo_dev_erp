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
                    <p class="p15">&nbsp; {{ this.uom }} </p>
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
        <v-col md="9">
          <v-row>
            <!-- sơ đồ kho C tại đây -->
            <v-col md="6" v-show="showLocC">
              <v-row dense>
                <div class="div32">
                  <p class="p19">CA</p>
                </div>
              </v-row>
              <v-row dense>
                <div class="div33">
                  <div :class="item.LOC_QTY > 0 ? 'div24' : 'div23'" v-for="(item,index) in lstCA" :key="index">
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
            <!-- sơ đồ kho D tại đây -->
            <v-col md="2" v-show="showLocD">
              <div class="div32">
                <p class="p19">DA</p>
              </div>
              <div class="div22">
                  <div :class="item.LOC_QTY > 0 ? 'div24' : 'div23'" v-for="(item,index) in lstDA" :key="index">
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
            </v-col>
          </v-row>
          <v-row>
            <!-- sơ đồ kho N tại đây -->
            <v-col md="4" v-show="showLocN">
              <v-row dense>
                <div class="div32">
                  <p class="p19">NA</p>
                </div>
                <div class="div33">
                  <div :class="item.LOC_QTY > 0 ? 'div24' : 'div23'" v-for="(item,index) in lstNA" :key="index" v-show="(index<2)">
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
                <v-col md="5">
                </v-col>
                <v-col md="3">
                  <div style="display: inline">
                    <div class="div22">
                    <div :class="item.LOC_QTY > 0 ? 'div24' : 'div23'"
                         v-for="(item,index) in lstNA"
                         :key="index"
                         v-show="(index<7&&index>1)">
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
                </div>
                </v-col>
              </v-row>
              <v-row dense>
                <v-col md="2" style="padding:0px"></v-col>
                <v-col md="4" style="padding:0px">
                  <div class="div33">
                  <div :class="item.LOC_QTY > 0 ? 'div24' : 'div23'" v-for="(item,index) in lstReverseNA" :key="index" v-show="(index<2)">
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
                </v-col>
              </v-row>
            </v-col>
            <!-- sơ đồ kho E tại đây -->
            <v-col md="4" v-show="showLocE">
              <div class="div32">
                <p class="p19">EA</p>
              </div>
              <v-row>
                <div style="margin-left:12px; display: inline">
                  <div class="div22">
                    <div :class="item.LOC_QTY > 0 ? 'div24' : 'div23'"
                         v-for="(item,index) in lstEA"
                         :key="index"
                         v-show="(index<5)">
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
                </div>
                <div style="display: inline">
                  <div class="div22">
                    <div :class="item.LOC_QTY > 0 ? 'div24' : 'div23'"
                         v-for="(item,index) in lstEA"
                         :key="index"
                         v-show="(index<10&&index>4)">
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
                </div>
                <div style="display: inline">
                  <div class="div22">
                    <div :class="item.LOC_QTY > 0 ? 'div24' : 'div23'"
                         v-for="(item,index) in lstEA"
                         :key="index"
                         v-show="(index<15&&index>9)">
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
                </div>
              </v-row>
            </v-col>
          </v-row>
          <v-row>
             <!-- sơ đồ kho L tại đây -->
             <v-col md="8" v-show="showLocL">
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
            </v-col>
            <!-- sơ đồ kho K tại đây -->
            <v-col md="4" v-show="showLocK">
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
    uom:"ea",
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
    lstCA: [],
    lstDA: [],
    lstEA: [],
    lstNA: [],
    lstReverseNA: [],
    showLocN: false,
    showLocE: false,
    showLocD: false,
    showLocC: false,
    showLocL: false,
    showLocK: false,
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
        this.uom = this.objSend.UOM
        setTimeout(() => {
          this.$refs.grdD.setDataSource([])
          this.showLocK = false
          this.showLocL = false
          this.showLocC = false
          this.showLocD = false
          this.showLocN = false
          this.showLocE = false
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
        selpro: "LG_SEL_LOC_STOCK_NOCACHE",
        para: [this.objSend.TLG_IN_WAREHOUSE_PK, this.objSend.TLG_IT_ITEM_PK, this.user.TCO_COMPANY_PK, this.currentDate],
      };
      const resS2 = await this._dsoCall(dsoS2, "select", false);
      let arr01 = resS2;
      arr01.forEach((ee2) => {
        this.txtPalletShow += parseInt(ee2.PALLET_QTY);
        this.txtQtyShow += parseInt(ee2.REQUEST_QTY);
      });
      this.$refs.grdD.setDataSource(arr01);
      this.loadQtyOfLocation(arr01)
    },
    loadQtyOfLocation(arr01) {
      this.qtyOther = 0
      arr01.forEach((ee2) => {
        if (ee2.LOC_NAME.indexOf("KA") < 0 && ee2.LOC_NAME.indexOf("KB") < 0 && ee2.LOC_NAME.indexOf("KC") < 0 && ee2.LOC_NAME.indexOf("KD") < 0 && ee2.LOC_NAME.indexOf("KE") < 0 && ee2.LOC_NAME.indexOf("KF") < 0 && ee2.LOC_NAME.indexOf("LG") < 0 && ee2.LOC_NAME.indexOf("LH") < 0 && ee2.LOC_NAME.indexOf("LI") < 0 && ee2.LOC_NAME.indexOf("LJ") < 0 && ee2.LOC_NAME.indexOf("LK") < 0 && ee2.LOC_NAME.indexOf("LL") < 0 && ee2.LOC_NAME.indexOf("LM") < 0 && ee2.LOC_NAME.indexOf("LH") < 0 &&  (ee2.LOC_NAME.indexOf("CA") < 0 || ee2.LOC_NAME.length > 5) && ee2.LOC_NAME.indexOf("DA") < 0 && ee2.LOC_NAME.indexOf("NA") < 0 && ee2.LOC_NAME.indexOf("EA") < 0) {
          this.qtyOther += parseInt(ee2.REQUEST_QTY)
        }
        if(ee2.LOC_NAME.indexOf("K") == 0){
          this.showLocK = true
        }
        if(ee2.LOC_NAME.indexOf("L") == 0){
          this.showLocL = true
        }
        if(ee2.LOC_NAME.indexOf("CA") == 0){
          this.showLocC = true
        }
        if(ee2.LOC_NAME.indexOf("DA") == 0){
          this.showLocD = true
        }
        if(ee2.LOC_NAME.indexOf("NA") == 0){
          this.showLocN = true
        }
        if(ee2.LOC_NAME.indexOf("EA") == 0){
          this.showLocE = true
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
      this.lstCA.forEach((ee1) => {
        ee1.LOC_QTY = 0
        arr01.forEach((ee2) => {
          if (ee1.LOC_ID == ee2.LOC_NAME.slice(0, 4)) {
            ee1.LOC_QTY += parseInt(ee2.REQUEST_QTY);
          }
        });
      });
      this.lstDA.forEach((ee1) => {
        ee1.LOC_QTY = 0
        arr01.forEach((ee2) => {
          if (ee1.LOC_ID == ee2.LOC_NAME.slice(0, 4)) {
            ee1.LOC_QTY += parseInt(ee2.REQUEST_QTY);
          }
        });
      });
      this.lstNA.forEach((ee1) => {
        ee1.LOC_QTY = 0
        arr01.forEach((ee2) => {
          if (ee1.LOC_ID == ee2.LOC_NAME.slice(0, 4)) {
            ee1.LOC_QTY += parseInt(ee2.REQUEST_QTY);
          }
        });
      });
      this.lstEA.forEach((ee1) => {
        ee1.LOC_QTY = 0
        arr01.forEach((ee2) => {
          if (ee1.LOC_ID == ee2.LOC_NAME.slice(0, 4)) {
            ee1.LOC_QTY += parseInt(ee2.REQUEST_QTY);
          }
        });
      });
      this.lstReverseNA.forEach((ee1) => {
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
      this.lstCA.forEach((ee1) => {
        ee1.LOC_QTY = 0
      });
      this.lstDA.forEach((ee1) => {
        ee1.LOC_QTY = 0
      });
      this.lstNA.forEach((ee1) => {
        ee1.LOC_QTY = 0
      });
      this.lstEA.forEach((ee1) => {
        ee1.LOC_QTY = 0
      });
      this.lstReverseNA.forEach((ee1) => {
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
      const dso3 = {
        type: "list",
        selpro: "LG_SEL_MECA090_2_NOCACHE",
        para: ['C'],
      };
      const result3 = await this._dsoCall(dso3, "select", false);
      this.lstCA = result3.filter((item) => item.LOC_ID.indexOf("CA") > -1);
      const dso4 = {
        type: "list",
        selpro: "LG_SEL_MECA090_2_NOCACHE",
        para: ['D'],
      };
      const result4 = await this._dsoCall(dso4, "select", false);
      this.lstDA = result4.filter((item) => item.LOC_ID.indexOf("DA") > -1);
      const dso5 = {
        type: "list",
        selpro: "LG_SEL_MECA090_2_NOCACHE",
        para: ['E'],
      };
      const result5 = await this._dsoCall(dso5, "select", false);
      this.lstEA = result5.filter((item) => item.LOC_ID.indexOf("EA") > -1);
      const dso6 = {
        type: "list",
        selpro: "LG_SEL_MECA090_2_NOCACHE",
        para: ['N'],
      };
      const result6 = await this._dsoCall(dso6, "select", false);
      this.lstNA = result6.filter((item) => item.LOC_ID.indexOf("NA") > -1);
      const dso7 = {
        type: "list",
        selpro: "LG_SEL_MECA090_2_NOCACHE",
        para: ['N'],
      };
      const result7 = await this._dsoCall(dso7, "select", false);
      this.lstReverseNA = result7.filter((item) => item.LOC_ID.indexOf("NA") > -1).reverse();
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
.div35{
  width: 100px;
  height:100px;
  display: inline-block;
}
</style>
