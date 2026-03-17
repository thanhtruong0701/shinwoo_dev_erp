<template>
<v-container fluid v-resize="onResize" class="pa-2">
  <v-row dense>
    <div class="div01">
      <p class="p01">Stock Status:</p>
      <p class="p02">MATERIAL WH</p>
      <p class="p03"> {{this.strCurrentDate}} </p>
      <div class="div04">
        <v-spacer></v-spacer>
        <v-btn color="primary6" icon @click="maximizeScreen">
          <v-icon>
            {{ !isMaximized ? "mdi-window-maximize" : "mdi-window-restore" }}
          </v-icon>
        </v-btn>
      </div>
    </div>
  </v-row>

  <v-row dense>
    <div class="div02">
      <!-- loop tại div này -->
      <div :class="boolActive01 ? 'div25' : 'div03'">
        <table class="table01" @click="onClick(0)">
          <tr> <th class="th01"> {{this.item01.ITEM_NAME}} </th> </tr>
          <tr> <td class="td01"> <p class="p04"> {{this.item01.END_QTY.toLocaleString("en", {   minimumFractionDigits: 0, maximumFractionDigits: 0, })}} </p> <p class="p05">&nbsp;KG</p> </td> </tr>
        </table>
      </div>
      <div :class="boolActive02 ? 'div25' : 'div03'">
        <table class="table01" @click="onClick(1)">
          <tr> <th class="th01"> {{this.item02.ITEM_NAME}} </th> </tr>
          <tr> <td class="td01"> <p class="p04"> {{this.item02.END_QTY.toLocaleString("en", {   minimumFractionDigits: 0, maximumFractionDigits: 0, })}} </p> <p class="p05">&nbsp;KG</p> </td> </tr>
        </table>
      </div>
      <div :class="boolActive03 ? 'div25' : 'div03'">
        <table class="table01" @click="onClick(2)">
          <tr> <th class="th01"> {{this.item03.ITEM_NAME}} </th> </tr>
          <tr> <td class="td01"> <p class="p04"> {{this.item03.END_QTY.toLocaleString("en", {   minimumFractionDigits: 0, maximumFractionDigits: 0, })}} </p> <p class="p05">&nbsp;KG</p> </td> </tr>
        </table>
      </div>
      <div :class="boolActive04 ? 'div25' : 'div03'">
        <table class="table01" @click="onClick(3)">
          <tr> <th class="th01"> {{this.item04.ITEM_NAME}} </th> </tr>
          <tr> <td class="td01"> <p class="p04"> {{this.item04.END_QTY.toLocaleString("en", {   minimumFractionDigits: 0, maximumFractionDigits: 0, })}} </p> <p class="p05">&nbsp;KG</p> </td> </tr>
        </table>
      </div>
      <div :class="boolActive05 ? 'div25': 'div03'">
        <table class="table01" @click="onClick(4)">
          <tr> <th class="th01"> THE OTHERs </th> </tr>
          <tr> <td class="td01"> <p class="p04">{{this.other01.toLocaleString("en", {   minimumFractionDigits: 0, maximumFractionDigits: 0, })}}</p> <p class="p05">&nbsp;KG</p> </td> </tr>
        </table>
      </div>
      <div :class="boolActive06 ? 'div25': 'div03'">
        <table class="table01" @click="onClick(5)">
          <tr> <th class="th01"> ALL </th> </tr>
          <tr> <td class="td01"> <p class="p04"> {{this.totalAll.toLocaleString("en", {   minimumFractionDigits: 0, maximumFractionDigits: 0, })}} </p> <p class="p05">&nbsp;KG</p> </td> </tr>
        </table>
      </div>
    </div>
  </v-row>

  <v-row dense class="mt-5">
    <v-col md="2">
      <BaseSelect item-value="CODE" item-text="NAME" :label="$t('item_name')" :lstData="lstItemName" v-model="itemItemName" disableSearch :text_all="$t('all')" />
    </v-col>
    <v-col md="1">
      <BaseCheckbox :label="$t('location')" true-value="Y" false-value="N" v-model="chkLocation" />
    </v-col>
    <v-col md="1">
      <BaseCheckbox :label="$t('lot_no')" true-value="Y" false-value="N" v-model="chkLotNo" />
    </v-col>
    <v-col md="1">
      <BaseDatePicker :label="$t('stock_date')" v-model="txtTransDate" />
    </v-col>
    <v-col md="2" offset-md="3">
      <div class="d-flex justify-center">
        <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="onClick('search')" />
        <BaseButton icon_type="settings" :btn_text="$t('settings')" :disabled="isProcessing" @onclick="onClick('settings')" />
      </div>
    </v-col>
  </v-row>

  <v-row dense class="mt-2">
    <div class="div05" @click="onClick(6)">
      <div class="div06">
        <p class="p06">nhập kho</p>
        <p class="p07">incoming</p>
      </div>
      <div class="div07">
        <p> {{this.totalIncome}}/{{this.totalStockIn}} </p>
      </div>
    </div>
    <div class="div08" @click="onClick(7)">
      <div class="div06">
        <p class="p06">chờ nhập kho</p>
        <p class="p07">waiting incoming</p>
      </div>
      <div class="div07">
        <p> {{this.totalWaitIncome}}/{{this.totalStockIn}} </p>
      </div>
    </div>
    <div class="div09" @click="onClick(8)">
      <div class="div10">
        <p class="p06">đổi vị trí</p>
        <p class="p07">re-location</p>
      </div>
      <div class="div11">
        <p>0</p>
      </div>
    </div>
    <div class="div09" @click="onClick(9)">
      <div class="div10">
        <p class="p06">hàng sx lỗi</p>
        <p class="p07">defect</p>
      </div>
      <div class="div11">
        <p>0</p>
      </div>
    </div>
  </v-row>

  <v-row dense class="mt-2">
    <div class="div05" @click="onClick(10)">
      <div class="div06">
        <p class="p06">xuất kho</p>
        <p class="p07">outgo</p>
      </div>
      <div class="div07">
        <p>{{this.totalOutgo}}/{{this.totalStockOut}}</p>
      </div>
    </div>
    <div class="div08" @click="onClick(11)">
      <div class="div06">
        <p class="p06">chờ xuất kho</p>
        <p class="p07">waiting outgo</p>
      </div>
      <div class="div07">
        <p>{{this.totalWaitOutgo}}/{{this.totalStockOut}}</p>
      </div>
    </div>
    <div class="div12" @click="onClick(12)">
      <div class="div13">
        <p class="p06">tồn kho</p>
        <p class="p07">stock</p>
      </div>
      <div class="div14">
        <p> {{this.totalAll.toLocaleString("en", {   minimumFractionDigits: 0, maximumFractionDigits: 0, })}} &nbsp;KG</p>
      </div>
      <div class="div15">
        <p> {{this.plt01}} PLT</p>
      </div>
    </div>
  </v-row>

  <transferWaiting ref="dialogTransferWaiting" />
</v-container>
</template>

<script>
import moment from 'moment';
import transferWaiting from "@/components/part/me/ca/meca040_pop_1";

export default {
  layout: "default",
  middleware: "user",
  props: {
    totalPLT01: {
      type: Number,
      default: 0
    }
  },

  components: {
    transferWaiting
  },

  data: () => ({
    txtTransDate: moment(new Date()).format("YYYYMMDD"),
    item01: { ITEM_NAME: '', END_QTY: 0 },
    item02: { ITEM_NAME: '', END_QTY: 0 },
    item03: { ITEM_NAME: '', END_QTY: 0 },
    item04: { ITEM_NAME: '', END_QTY: 0 },
    boolActive01: false,
    boolActive02: false,
    boolActive03: false,
    boolActive04: false,
    boolActive05: false,
    boolActive06: true,
    isMaximized: false,
    itemItemName: "",
    lstItemName: [{ CODE: "214", NAME: "A380(W)", }, 
      { CODE: "216", NAME: "ADC12", }, 
      { CODE: "215", NAME: "AC47100", }, 
      { CODE: "36045", NAME: "SILAFONT36", }, 
      { CODE: "39597", NAME: "AC44300", }, 
      { CODE: "39955", NAME: "A380(T)", }, 
      { CODE: "44496", NAME: "DCAL-001", }, 
      { CODE: "39696", NAME: "ZINC", }, ],
    chkLocation: 'N',
    chkLotNo: 'N',
    headerGrdD: [],
    type01: 1,
    arr01: [],
    arr02: [],
    other01: 0,
    totalAll: 0,
    plt01: 0,
    strCurrentDate: '',
    type02: 5,
    totalStockIn: 0,
    totalWaitIncome: 0,
    totalIncome: 0,
    totalStockOut: 0,
    totalWaitOutgo: 0,
    totalOutgo: 0,
  }),

  async created() {
    this.getDataList()
    this.initHeader()
    
  },

  watch: {
    totalPLT01(val){
      this.plt01 = val
    },
    txtTransDate(val) {
      this.getDataList()
    },
    chkLocation(val) {
      this.$emit("chkLocation", val)
    },
    chkLotNo(val) {
      this.$emit("chkLotNo", val)
    },
  },

  mounted() {
    this.plt01 = this.totalPLT01
    this.onClick(12)
  },

  computed: {
    user() {
      return this.$store.getters["auth/user"]
    },
    heightGrdD() {
      if (this.windowHeight <= 768) {
        return this.windowHeight * 0.2
      } else {
        return this.windowHeight * 0.3
      }
    },
    filterParaGrdD() {
      return [this.type01]
    }
  },

  methods: {
    maximizeScreen() {
      this.isMaximized = !this.isMaximized;
      if (this.isMaximized) {
        this.$nuxt.$emit("changeLayout", "monitoring");
      } else {
        this.$nuxt.$emit("changeLayout", "default");
      }
    },
    activeSelItem(val) {
      switch (val) {
        case 0:
          this.boolActive01 = true
          this.boolActive02 = false
          this.boolActive03 = false
          this.boolActive04 = false
          this.boolActive05 = false
          this.boolActive06 = false
          break;
        case 1:
          this.boolActive01 = false
          this.boolActive02 = true
          this.boolActive03 = false
          this.boolActive04 = false
          this.boolActive05 = false
          this.boolActive06 = false
          break;
        case 2:
          this.boolActive01 = false
          this.boolActive02 = false
          this.boolActive03 = true
          this.boolActive04 = false
          this.boolActive05 = false
          this.boolActive06 = false
          break;
        case 3:
          this.boolActive01 = false
          this.boolActive02 = false
          this.boolActive03 = false
          this.boolActive04 = true
          this.boolActive05 = false
          this.boolActive06 = false
          break;
        case 4:
          this.boolActive01 = false
          this.boolActive02 = false
          this.boolActive03 = false
          this.boolActive04 = false
          this.boolActive05 = true
          this.boolActive06 = false
          break;
        case 5:
          this.boolActive01 = false
          this.boolActive02 = false
          this.boolActive03 = false
          this.boolActive04 = false
          this.boolActive05 = false
          this.boolActive06 = true
          break;
        default:
          break;
      }
    },
    onClick(action) {
      this.activeSelItem(action)
      if (typeof action == "number") {
        this.type02 = action
        switch (action) {
          case 0:
            this.$emit("loadDataGrdD", action, this.arr02, '39955');
            break
          case 1:
            this.$emit("loadDataGrdD", action, this.arr02, '214');
            break
          case 2:
            this.$emit("loadDataGrdD", action, this.arr02, '215');
            break
          case 3:
            this.$emit("loadDataGrdD", action, this.arr02, '216');
            break
          case 4:
            this.$emit("loadDataGrdD", action, this.arr02, '');
            break
          case 5:
            this.$emit("loadDataGrdD", action, this.arr02, '');
            break
          case 6:
            this.$emit("loadDataGrdD", action, this.arr02, this.itemItemName);
            break
          case 7:
            this.$emit("loadDataGrdD", action, this.arr02, this.itemItemName);
            break
          case 10:
            this.$emit("loadDataGrdD", action, this.arr02, '');
            break
          case 12:
            this.$emit("loadDataGrdD", action, this.arr02, '');
            break
          case 11:
            this.$refs.dialogTransferWaiting.dialogIsShow = true
            break;
          default:
            break;
        }
      } else {
        switch (action) {
          case "search":
            this.$emit("loadDataGrdD", 5, this.arr02, this.itemItemName, this.txtTransDate);
            break;
          case "settings":
            break;
        }
      }
    },
    async getDataList() {
      this.strCurrentDate = moment(new Date()).format("YYYY.MM.DD HH:mm")
      let currentDate = moment(new Date()).format("YYYYMMDD")
      const dso = {
        type: "list",
        selpro: "LG_SEL_MECA040_RMWH_1_NOCACHE",
        // para currentDate tạm thời không dùng, thay thế bằng this.txtTransDate (trans_date) từ thanh tìm kiếm rồi
        // para: [this.txtTransDate, this.txtTransDate, '', '', 'Y', '110', '', 'N', 'ENG', 'N', 'N', 'Y', 'N', 'N', '', '', '', 10, '', 141, this.user.TCO_COMPANY_PK, this.user.PK]
        para: [this.txtTransDate, this.txtTransDate, '', '2', 'Y', '', '', 'N', 'ENG', 'Y', 'Y', 'Y', 'Y', '', '', '', '10', '', '', '']
        // '20230105','20230105','','2','Y','','','N','ENG','Y','Y','Y','Y','','','','10','','','','','',:P_RTN_VALUE
      };
      const result = await this._dsoCall(dso, "select", false);
      if (result.length > 0) {
        let arrFilter01 = result.filter(item => item.GRP_NM == "MATERIAL")
        this.arr02 = arrFilter01
        let total01 = 0
        let total02 = 0
        arrFilter01.forEach(ee1 => {
          total01 += parseInt(ee1.END_QTY)
          if (ee1.ITEM_NAME == "A380(T)" || ee1.ITEM_NAME == "A380(W)" || ee1.ITEM_NAME == "AC47100" || ee1.ITEM_NAME == "ADC12") {
            total02 += parseInt(ee1.END_QTY)
          }
        });
        let obj05 = arrFilter01.filter(item => item.ITEM_NAME == "A380(T)")
        let obj06 = arrFilter01.filter(item => item.ITEM_NAME == "A380(W)")
        let obj07 = arrFilter01.filter(item => item.ITEM_NAME == "AC47100")
        let obj08 = arrFilter01.filter(item => item.ITEM_NAME == "ADC12")
        if (obj05.length > 0) {
          obj05 = obj05[0]
          obj05.END_QTY = parseInt(obj05.END_QTY) == null ? 0 : parseInt(obj05.END_QTY)
        } else {
          obj05 = {
            ITEM_NAME: 'A380(T)',
            END_QTY: 0
          }
        }
        if (obj06.length > 0) {
          obj06 = obj06[0]
          obj06.END_QTY = parseInt(obj06.END_QTY) == null ? 0 : parseInt(obj06.END_QTY)
        } else {
          obj06 = {
            ITEM_NAME: 'A380(W)',
            END_QTY: 0
          }
        }
        if (obj07.length > 0) {
          obj07 = obj07[0]
          obj07.END_QTY = parseInt(obj07.END_QTY) == null ? 0 : parseInt(obj07.END_QTY)
        } else {
          obj07 = {
            ITEM_NAME: 'AC47100',
            END_QTY: 0
          }
        }
        if (obj08.length > 0) {
          obj08 = obj08[0]
          obj08.END_QTY = parseInt(obj08.END_QTY) == null ? 0 : parseInt(obj08.END_QTY)
        } else {
          obj08 = {
            ITEM_NAME: 'ADC12',
            END_QTY: 0
          }
        }
        this.item01 = obj05
        this.item02 = obj06
        this.item03 = obj07
        this.item04 = obj08
        this.other01 = total01 - total02
        this.totalAll = total01
        const dsoPlt = {
          type: "list",
          selpro: "LG_SEL_MECA040_RMWH_2_NOCACHE",
          para: [currentDate]
        };
        const resPlt = await this._dsoCall(dsoPlt, "select", false);
        if (resPlt.length > 0) {
          this.plt01 = resPlt[0].BC_QTY
        }
        const dsoIncome = {
          type: "list",
          selpro: "LG_SEL_MECA040_RMWH_3_NOCACHE",
          para: [2, currentDate, currentDate, this.user.PK]
        };
        const resIncome = await this._dsoCall(dsoIncome, "select", false);
        let total03 = resIncome.length
        let total04 = 0
        let total05 = 0
        resIncome.forEach(ee1 => {
          if (ee1.STATUS == "APPROVED")
            total04++
          else total05++
        });
        this.totalStockIn = total03
        this.totalWaitIncome = total05
        this.totalIncome = total04
        //--
        const dsoOutgo = {
          type: "list",
          selpro: "LG_SEL_MECA040_RMWH_9_NOCACHE",
          para: [currentDate, currentDate, this.user.THR_ABEMP_PK, 'N', this.user.TCO_COMPANY_PK, this.user.PK]
        };
        const resOutgo = await this._dsoCall(dsoOutgo, "select", false);
        let total06 = resOutgo.length
        let total07 = 0
        let total08 = 0
        resOutgo.forEach(ee1 => {
          if (ee1.STATUS == "APPROVED")
            total07++
          else total08++
        });
        this.totalStockOut = total06
        this.totalWaitOutgo = total08
        this.totalOutgo = total07
        this.$emit("loadDataGrdD", 5, this.arr02, '');
      } else {
        this.showNotification("warning", this.$t("no_data"), '', 3000);
      }

    },

    initHeader() {
      this.headerGrdD = [
        { dataField: "NO", caption: this.$t("no"), width: 120, allowEditing: false, hidden: false, }, 
        { dataField: "ITEM_CODE", caption: this.$t("item_code"), width: 120, allowEditing: false, hidden: false, }, 
        { dataField: "ITEM_NAME", caption: this.$t("item_name"), width: 120, allowEditing: false, hidden: false, }, 
        { dataField: "LOT_NO", caption: this.$t("lot_no"), width: 120, allowEditing: false, hidden: false, }, 
        { dataField: "INCOMING_DATE", caption: this.$t("incoming_date"), width: 120, allowEditing: false, hidden: false, }, 
        { dataField: "QTY", caption: this.$t("qty"), width: 120, allowEditing: false, hidden: false, formatFloat: 2, dataType: "number", summaryType: 'sum' }, 
        { dataField: "UOM", caption: this.$t("uom"), width: 120, allowEditing: false, hidden: false, }, 
        { dataField: "PALLET", caption: this.$t("pallet"), width: 120, allowEditing: false, hidden: false, formatFloat: 0, dataType: "number", summaryType: 'sum' }, 
        { dataField: "LOCATION", caption: this.$t("location"), width: 120, allowEditing: false, hidden: false, }, 
        { dataField: "PARTNER", caption: this.$t("partner"), width: 120, allowEditing: false, hidden: false, },
      ]
    },
  },
};
</script>

<style>
.div01 { display: flex; font-weight: bold; margin-left: 10px; }
.div02 { display: flex; margin-left: 100px; margin-top: 20px; }
.p01 { font-weight: bold; margin-top: 5px; }
.p02 { text-transform: uppercase; color: #c00000; font-size: 22px; margin-left: 10px; }
.p03 { color: #c00000; margin-top: 5px; margin-left: 1000px; }
.th01 { font-size: 18px; border-bottom: solid 1px white; }
.td01 { display: flex; background-color: #E9EDF4; margin-top: 5px; }
.p04 { width: 115px; font-weight: bold; font-size: 22px; text-align: right; }
.p05 { font-size: 14px; text-transform: uppercase; margin-top: 10px; }
.table01 { width: 160px; height: 100px; background-color: #E9EDF4; border: solid 1px white; margin-top: 10px; margin-left: 10px; }
.div03 { width: 180px; height: 120px; background-color: #95B3D7; border-radius: 20px; margin-right: 50px; cursor: pointer; }
.div25 { width: 180px; height: 120px; background-color: #95B3D7; border-radius: 20px; margin-right: 50px; cursor: pointer; box-shadow: 5px 5px 10px #00aa00, 0 0 5px #00cc00, 0 0 5px #00ff00; }
.div04 { margin-left: 10px; }
.div05 { width: 300px; height: 60px; background-color: #00B050; margin: 0px 120px 5px 0px; display: flex; cursor: pointer; }
.div08 { width: 300px; height: 60px; background-color: #E46C0A; margin: 0px 120px 5px 0px; display: flex; cursor: pointer; }
.div12 { width: 430px; height: 60px; background-color: #984807; margin: 0px 120px 5px 0px; display: flex; cursor: pointer; }
.div09 { width: 200px; height: 60px; background-color: #7F7F7F; margin: 0px 30px 5px 0px; display: flex; cursor: pointer; }
.p06 { text-transform: uppercase; font-size: 18px; font-weight: bold; margin-top: 5px; margin-left: 5px; color: white; }
.p07 { text-transform: uppercase; font-size: 16px; margin-left: 5px; margin-bottom: 5px; color: white; }
.div06 { width: 200px; height: 50px; }
.div13 { width: 160px; height: 50px; }
.div10 { width: 127px; height: 50px; }
.div07 { width: 65px; height: 30px; background-color: #ffffff; border-radius: 10px; margin: 15px 0px 0px 20px; padding: 5px 0px 0px 15px; font-weight: bold; }
.div14 { width: 120px; height: 30px; background-color: #ffffff; border-radius: 10px; margin: 15px 0px 0px 20px; padding: 5px 0px 0px 10px; font-weight: bold; }
.div15 { width: 80px; height: 30px; background-color: #ffffff; border-radius: 10px; margin: 15px 0px 0px 20px; padding: 5px 0px 0px 10px; font-weight: bold; }
.div11 { width: 35px; height: 30px; background-color: #ffffff; border-radius: 10px; margin: 15px 0px 0px 30px; padding: 5px 0px 0px 7px; font-weight: bold; }
</style>
