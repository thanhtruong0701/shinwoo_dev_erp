<template>
<v-container fluid v-resize="onResize">
  <!-- từ Stock Status đến TỒN KHO STOCK -->
  <v-row dense v-if="warehouseTitle == 'RAW MATERIAL'">
    <rawmaterialwh @loadDataGrdD="loadDataGrdD" @chkLocation="chkLocation" @chkLotNo="chkLotNo" :totalPLT01="totalPLT01"></rawmaterialwh>
  </v-row>

  <!-- sơ đồ kho -->
  <v-row dense v-if="warehouseTitle == 'RAW MATERIAL'">
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
  </v-row>

  <!-- row title trên grid -->
  <v-row dense v-show="warehouseTitle == 'RAW MATERIAL'">
    <p class="p08"> {{txtTextStock01}} </p>
  </v-row>

  <!-- 2 grid detail item -->
  <v-row dense v-if="warehouseTitle == 'RAW MATERIAL'">
    <v-col md="6">
      <DataGridView column-resizing-mode="widget" ref="grdD" :header="headerGrdDRM" select_mode="Single" :auto_load="false" :max_height="heightGrdDRM01" sel_procedure="LG_SEL_MECA040_RMWH_10_NOCACHE" :filter_paras="filterParaGrdD01" @cellDblClick="onClickGrdDRM" @cellClick="onCellClickGDLRM" />
    </v-col>
    <v-col md="6">
      <DataGridView column-resizing-mode="widget" ref="grdDLocRM" :header="headerGrdDLocRM" select_mode="Single" :auto_load="false" :max_height="heightGrdDLocRM" sel_procedure="LG_SEL_MECA040_RMWH_11_NOCACHE" :filter_paras="filterParaGrdD02" />
    </v-col>
  </v-row>

  <!-- Raw Material WH -->
  <transferWaiting ref="dialogTransferWaiting" :objSend02="objSend02" />

</v-container>
</template>

<!-- ================================================================= END DESIGN LAYOUT & BEGIN SCRIPT ========================================================================= --> 

<script>
import moment from "moment";
import Warehouse_group from "@/components/part/80/50/8050080_warehouse_group";
import Rack_group from "@/components/part/80/50/8050080_rack_group";
import rawmaterialwh from '@/components/part/me/ca/meca040_rmwh'
import deliveryRequest from "@/components/part/me/ca/meca040_pop_2";
import stockLocation from "@/components/part/me/ca/meca040_pop_stock.vue";
import transferWaiting from "@/components/part/me/ca/meca040_pop_1";

export default {
  name: "warehouse_monitoring",
  layout: "default",
  middleware: "user",
  props: {
    headerstock: {
      type: Array,
    },
    headerlist: {
      type: Array,
    },
    headerDetail: {
      type: Array,
    },
    masterpara1: {
      type: Array,
    },
    masterpara2: {
      type: Array,
    },
    detailpara1: {
      type: Array,
    },
    detailpara2: {
      type: Array,
    },
    masterproc03: {
      type: String,
    },
    masterproc02: {
      type: String,
    },
    detailproc1: {
      type: String,
    },
    detailproc2: {
      type: String,
    },
    warehouseTitle: {
      type: String,
    },
    storagePk: {
      type: Number,
    },
    heightWareHouse: {
      type: Number,
    },
  },
  components: {
    warehousegroup: Warehouse_group,
    rackgroup: Rack_group,
    rawmaterialwh,
    deliveryRequest,
    stockLocation,
    transferWaiting
  },
  data: () => ({
    totalPLT01:0,
    txtDateCurrent:"",
    headerGrdDLocRM: [],
    showText01: false,
    txtQtyShow: '',
    txtItemNameShow: '',
    txtItemName01: '',
    txtPKItemLoc01: '',
    boolStock01: false,
    txtStock01: 0,
    txtPlt01: 0,
    plt01: 99,
    totalAll: 99,
    totalWaitOutgo: 99,
    totalStockOut: 99,
    totalOutgo: 99,
    totalIncome: 99,
    totalStockIn: 99,
    totalWaitIncome: 99,
    totalEAall: 0,
    totalPLTall: 0,
    txtSelItemPK01: '0',
    lstAA: [],
    lstAB: [],
    arr006: [],
    objSend01: {},
    objSend02: {},
    showLocation: false,
    showLotNo: false,
    type02: 1, //loại status các phiếu stock khi ấn nút search material wh
    txtTextStock01: 'TỒN KHO (Stock List)',
    headerGrdDRM: [],
    type01: "ALL",
    isMaximized: false,
    itemCode: "",
    itemName: "",
    revision: "",
    partner: "",
    itemPk: "",
    lotNo: "",
    item_name: null,
    headerMaster: [],
    currentDate: moment(new Date()).format("YYYYMMDD"),
    maxRow: 0,
    maxCol: 0,
    labelsBorder: null,
    lstLabels: null,
    whPK: null,
  }),
  created() {
    this.loadGroupStatus();
    this.initHeader()
    this.loadStatusInOut()
  },
  watch: {
  },
  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
    filterParaGrdD01() {
      return ['2', '', '', '', '', this.user.TCO_COMPANY_PK, this.currentDate]
    },
    filterParaGrdD02() {
      return ['2', this.txtPKItemLoc01, this.user.TCO_COMPANY_PK, this.currentDate]
    },
    filterParaGrdDLoc() {
      return ['142', this.txtPKItemLoc01, this.user.TCO_COMPANY_PK, this.txtDateCurrent]
    },
    heightGrdDRM01() {
      if (this.windowHeight <= 768) {
        return this.windowHeight * 0.2
      } else {
        return this.windowHeight * 0.3
      }
    },
    heightGrdDLocRM() {
      if (this.windowHeight <= 768) {
        return this.windowHeight * 0.2
      } else {
        return this.windowHeight * 0.3
      }
    },
    width() {
      let width = 0;
      if (this.isMaximized) {
        width = this._calculateHeight(this._calculateHeight(this.windowWidth, 87), (100 / this.maxCol))
      } else {
        width = this._calculateHeight(this._calculateHeight(this.windowWidth, 72), (100 / this.maxCol))
      }
      return width;
    },
    height() {
      let height = 0;
      if (this.isMaximized) {
        height = this._calculateHeight(this.heightWareHouse, (100 / this.maxRow))
      } else {
        height = this._calculateHeight(this.heightWareHouse, (100 / this.maxRow))
      }
      return height;
    },
    masterContainerHeight() {
      return this.formContainerHeight;
    },
    detailContainerHeight1() {
      return this.formContainerHeight / 2;
    },
    detailContainerHeight2() {
      return this.formContainerHeight / 2.2;
    },
  },
  async mounted() {
    if (this.warehouseTitle == 'RAW MATERIAL') this.refreshStock01()
  },

  beforeDestroy() {},
  methods: {
    async onCellClickGDLRM(cell) {
      this.txtPKItemLoc01 = cell.data.TLG_IT_ITEM_PK
      setTimeout(() => {
        this.$refs.grdDLocRM.loadData()
      }, 10);
    },
    async onClickGrdDRM(cell) {
      this.objSend02 = cell.data
      this.$refs.dialogTransferWaiting.dialogIsShow = true
    },
    async onCellClickGrdD(cell) {
      this.showText01 = true
      this.txtPKItemLoc01 = cell.data.PK
      this.txtItemNameShow = cell.data.ITEM_NAME
      this.txtItemName01 = cell.data.ITEM_NAME
      this.txtQtyShow = cell.data.STOCK_QTY
      setTimeout(() => {
        this.$refs.grdDLocFG.loadData()
      }, 10);
    },
    async loadStatusInOut() {
      const dso = {
        type: "grid",
        selpro: "LG_SEL_MECA040_2_NOCACHE",
        para: [this.currentDate, 'FG', '', '', this.user.TCO_COMPANY_PK, this.storagePk, this.type01],
      };
      let res = await this._dsoCall(dso, "select", false);
      res = res[0]
      this.totalStockIn = res.TOTAL_INCOM
      this.totalIncome = res.FINISHED_INCOM
      this.totalWaitIncome = res.WAITING_INCOM
      this.totalStockOut = res.TOTAL_OUTGO
      this.totalOutgo = res.FINISHED_OUTGO
      this.totalWaitOutgo = res.WAITING_OUTGO
    },
    async refreshStock01() {
      if (this.warehouseTitle == 'RAW MATERIAL') {
        const dso = {
          type: "list",
          selpro: "LG_SEL_MECA040_RMWH_10_NOCACHE",
          para: ['2', '', '', '', '', this.user.TCO_COMPANY_PK, this.currentDate]
        };
        let arr04 = await this._dsoCall(dso, "select", false);
        const dsoGetPLT = {
          type: "list",
          selpro: "LG_SEL_MECA090_6_NOCACHE",
          para: [this.currentDate, this.currentDate, 10, 2, 'Y', 108, '', 'N', 'ENG', 'N', 'N', 'Y', 'N', 'N', '', '', '', 10, '', '', this.user.TCO_COMPANY_PK, this.user.PK, 'ALL']
        };
        const resGetPLT = await this._dsoCall(dsoGetPLT, "select", false);
        if (resGetPLT.length > 0) {
          arr04.forEach(ee2 => {
            ee2.PALLET = 0
            resGetPLT.forEach(ee1 => {
              if (ee1.PK == ee2.TLG_IT_ITEM_PK) {
                ee2.PALLET = ee1.PALLET_QTY
              }
            });
          });
        }
        this.arr006 = arr04
      }
      setTimeout(() => { // thằng này dùng để load dữ liệu mới sau 10 phút
        this.refreshStock01()
      }, 600000);
    },
    chkLocation(val) {
      if (val == 'Y') this.showLocation = true
      else this.showLocation = false
      this.initHeader()
    },
    chkLotNo(val) {
      if (val == 'Y') this.showLotNo = true
      else this.showLotNo = false
      this.initHeader()
    },
    onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    },
    arrayStrToString(arr) {
      let str = ""
      arr.forEach(ee1 => {
        str += ee1 + ", "
      });
      return str.slice(0, str.length - 2)
    },
    async getPalletItem(arr03, txtItemPK) {
      this.$refs.grdD.setDataSource([])
      const dso = {
        type: "list",
        selpro: "LG_SEL_MECA040_RMWH_10_NOCACHE",
        para: ['2', '', '', '', '', this.user.TCO_COMPANY_PK, this.currentDate]
      };
      if (this.arr006.length == 0) this.arr006 = await this._dsoCall(dso, "select", false);
      let arr04 = []
      let i = 1
      arr03.forEach(ee1 => {
        ee1.PALLET = 0
        ee1.INCOMING_DATE = ""
        let arrLotNoDupli = []
        let arrLocDupli = []
        this.arr006.forEach(ee2 => {
          if (ee2.TLG_IT_ITEM_PK == ee1.TLG_IT_ITEM_PK) {
            // if (ee2.PALLET == null) ee2.PALLET = 0
            // ee1.PALLET = parseInt(ee2.PALLET)
            if (ee2.LOT_NO != null) arrLotNoDupli.push(ee2.LOT_NO)
            if (ee2.LOC_NAME != null) arrLocDupli.push(ee2.LOC_NAME)
            if (ee1.INCOMING_DATE < ee2.TR_DATE) ee1.INCOMING_DATE = ee2.TR_DATE
          }
        });
        const arrLotNoUnique = arrLotNoDupli.filter(this.onlyUnique)
        const arrLocUnique = arrLocDupli.filter(this.onlyUnique)
        const strLotNoUnique = this.arrayStrToString(arrLotNoUnique)
        const strLocUnique = this.arrayStrToString(arrLocUnique)
        let obj = {
          NO: i,
          TLG_IT_ITEM_PK: ee1.TLG_IT_ITEM_PK,
          ITEM_CODE: ee1.ITEM_CODE,
          ITEM_NAME: ee1.ITEM_NAME,
          LOT_NO: strLotNoUnique,
          INCOMING_DATE: ee1.INCOMING_DATE,
          QTY: ee1.END_QTY,
          UOM: ee1.UOM,
          PALLET: ee1.PALLET,
          LOCATION: strLocUnique,
          PARTNER: ee1.PARTNER
        }
        arr04.push(obj)
        i++
      });
      const dsoGetPLT = {
        type: "list",
        selpro: "LG_SEL_MECA090_6_NOCACHE",
        para: [this.currentDate,this.currentDate,10,2, 'Y', 108, '', 'N','ENG','N','N','Y','N','N','','','',10,'','', this.user.TCO_COMPANY_PK, this.user.PK,'ALL']
      };
      const resGetPLT = await this._dsoCall(dsoGetPLT, "select", false);
      if (resGetPLT.length > 0) {
        arr04.forEach(ee2 => {
          ee2.PALLET = 0
          resGetPLT.forEach(ee1 => {
            if (ee1.PK == ee2.TLG_IT_ITEM_PK) {
              ee2.PALLET = ee1.PALLET_QTY
            }
          });
        });
      }
      this.txtTextStock01 = 'TỒN KHO (Stock List)'
      if (txtItemPK == '' || txtItemPK == null) {
        this.$refs.grdD.setDataSource(arr04)
        let totalPLT = 0
        arr04.forEach(ee1 => {
          totalPLT += parseInt(ee1.PALLET)
        });
        this.totalPLT01 = totalPLT
      }
      else {
        let arr05 = []
        arr04.forEach(ee1 => {
          if (ee1.TLG_IT_ITEM_PK == txtItemPK) {
            ee1.NO = 1
            arr05.push(ee1)
          }
        });
        this.$refs.grdD.setDataSource(arr05)
        let totalPLT = 0
        arr05.forEach(ee1 => {
          totalPLT += parseInt(ee1.PALLET)
        });
        this.totalPLT01 = totalPLT
      }
      this.loadLocationMaterial(txtItemPK)
    },
    loadLocationMaterial(txtItemPK) {
      let arr01 = []
      if (this.type02 == 4) {
        let arr05 = []
        this.arr006.forEach(ee1 => {
          if (ee1.TLG_IT_ITEM_PK != "39955" && ee1.TLG_IT_ITEM_PK != "214" && ee1.TLG_IT_ITEM_PK != "215" && ee1.TLG_IT_ITEM_PK != "216") {
            ee1.NO = 1
            arr05.push(ee1)
          }
        });
        arr01 = arr05
      } else {
        if (txtItemPK == '' || txtItemPK == null) {
          arr01 = this.arr006
        } else {
          let arr05 = []
          this.arr006.forEach(ee1 => {
            if (ee1.TLG_IT_ITEM_PK == txtItemPK) {
              ee1.NO = 1
              arr05.push(ee1)
            }
          });
          arr01 = arr05
        }
      }
      this.lstAA.forEach((ee1) => {
        ee1.LOC_QTY = 0
        arr01.forEach((ee2) => {
          if (ee1.LOC_ID == ee2.LOC_NAME.slice(0, 4)) {
            ee1.LOC_QTY += parseInt(ee2.QTY);
          }
        });
      });
      this.lstAB.forEach((ee1) => {
        ee1.LOC_QTY = 0
        arr01.forEach((ee2) => {
          if (ee1.LOC_ID == ee2.LOC_NAME.slice(0, 4)) {
            ee1.LOC_QTY += parseInt(ee2.QTY);
          }
        });
      });
    },
    async getItemWaitStockIn(txtItemName, arr02) {
      if (this.txtSelItemPK01 != '0' && this.txtSelItemPK01 != '1') {
        txtItemName = this.txtSelItemPK01
      } else if (this.txtSelItemPK01 == 1 && txtItemName == '') {
        let arr = []
        arr02.forEach(ee1 => {
          if (ee1.TLG_IT_ITEM_PK != "39955" && ee1.TLG_IT_ITEM_PK != "214" && ee1.TLG_IT_ITEM_PK != "215" && ee1.TLG_IT_ITEM_PK != "216") {
            arr.push(ee1.TLG_IT_ITEM_PK)
          }
        });
        txtItemName = arr
      }
      const dso = {
        type: "list",
        selpro: "LG_SEL_MECA040_RMWH_7_NOCACHE",
        para: this.txtSelItemPK01 == 1 && txtItemName == '' ? [3, this.currentDate, '', txtItemName] : [1, this.currentDate, txtItemName, '']
      };
      const result = await this._dsoCall(dso, "select", false);
      this.txtTextStock01 = 'CHỜ NHẬP KHO (Waiting Incoming)'
      if (result.length > 0) {
        this.$refs.grdD.setDataSource(result)
      } else {
        this.showNotification("warning", this.$t("no_data_found"), "", 3000)
        this.$refs.grdD.setDataSource([])
      }
    },
    async getItemStockIn(txtItemName, arr02) {
      if (this.txtSelItemPK01 != '0' && this.txtSelItemPK01 != '1') {
        txtItemName = this.txtSelItemPK01
      } else if (this.txtSelItemPK01 == 1 && txtItemName == '') {
        let arr = []
        arr02.forEach(ee1 => {
          if (ee1.TLG_IT_ITEM_PK != "39955" && ee1.TLG_IT_ITEM_PK != "214" && ee1.TLG_IT_ITEM_PK != "215" && ee1.TLG_IT_ITEM_PK != "216") {
            arr.push(ee1.TLG_IT_ITEM_PK)
          }
        });
        txtItemName = arr
      }
      const dso = {
        type: "list",
        selpro: "LG_SEL_MECA040_RMWH_7_NOCACHE",
        para: this.txtSelItemPK01 == 1 && txtItemName == '' ? [4, this.currentDate, '', txtItemName] : [2, this.currentDate, txtItemName, '']
      };
      const result = await this._dsoCall(dso, "select", false);
      this.txtTextStock01 = 'NHẬP KHO (Incoming)'
      if (result.length > 0) {
        this.$refs.grdD.setDataSource(result)
      } else {
        this.showNotification("warning", this.$t("no_data_found"), "", 3000)
        this.$refs.grdD.setDataSource([])
      }
    },
    async getItemStockOut(txtItemName, arr02) {
      if (this.txtSelItemPK01 != '0' && this.txtSelItemPK01 != '1') {
        txtItemName = this.txtSelItemPK01
      } else if (this.txtSelItemPK01 == 1 && txtItemName == '') {
        let arr = []
        arr02.forEach(ee1 => {
          if (ee1.TLG_IT_ITEM_PK != "39955" && ee1.TLG_IT_ITEM_PK != "214" && ee1.TLG_IT_ITEM_PK != "215" && ee1.TLG_IT_ITEM_PK != "216") {
            arr.push(ee1.TLG_IT_ITEM_PK)
          }
        });
        txtItemName = arr
      }
      const dso = {
        type: "list",
        selpro: "LG_SEL_MECA040_RMWH_8_NOCACHE",
        para: this.txtSelItemPK01 == 1 && txtItemName == '' ? [4, this.currentDate, '', txtItemName] : [2, this.currentDate, txtItemName, '']
      };
      const result = await this._dsoCall(dso, "select", false);
      this.txtTextStock01 = 'XUẤT KHO (Outgo)'
      if (result.length > 0) {
        this.$refs.grdD.setDataSource(result)
      } else {
        this.showNotification("warning", this.$t("no_data_found"), "", 3000)
        this.$refs.grdD.setDataSource([])
      }
    },
    valToItemPK(val) {
      switch (val) {
        case 0: this.txtSelItemPK01 = '39955'; break;
        case 1: this.txtSelItemPK01 = '214'; break;
        case 2: this.txtSelItemPK01 = '215'; break;
        case 3: this.txtSelItemPK01 = '216'; break;
        case 4: this.txtSelItemPK01 = '1'; break;
        case 5: this.txtSelItemPK01 = '0'; break;
      }
    },
    loadDataGrdD(val, arr02, txtItemPK, txtStockDate = moment(new Date()).format("YYYYMMDD")) {
      this.$refs.grdDLocRM.getDataSource([])
      this.valToItemPK(val)
      this.lstAA.forEach((ee1) => {
        ee1.LOC_QTY = 0
      });
      this.lstAB.forEach((ee1) => {
        ee1.LOC_QTY = 0
      });
      this.type02 = val
      if (val == 0 || val == 1 || val == 2 || val == 3 || val == 4 || val == 5) {
        let i = 1
        let arr01 = []
        arr02.forEach(ee1 => {
          let obj = {
            NO: i,
            TLG_IT_ITEM_PK: ee1.TLG_IT_ITEM_PK,
            ITEM_CODE: ee1.ITEM_CODE,
            ITEM_NAME: ee1.ITEM_NAME,
            LOT_NO: '',
            INCOMING_DATE: '',
            QTY: ee1.END_QTY,
            UOM: ee1.UOM,
            PALLET: ee1.PALLET,
            LOCATION: ee1.LOCATION,
            PARTNER: ee1.PARTNER
          }
          if (val == 5) {
            arr01.push(obj)
            i++
          } else if (ee1.TLG_IT_ITEM_PK != "39955" && ee1.TLG_IT_ITEM_PK != "214" && ee1.TLG_IT_ITEM_PK != "215" && ee1.TLG_IT_ITEM_PK != "216") {
            arr01.push(obj)
            i++
          } else if (ee1.TLG_IT_ITEM_PK == txtItemPK) {
            arr01.push(obj)
            i++
          }
        });
        this.txtTextStock01 = 'TỒN KHO (Stock List)'
        let j = 1
        let arr03 = []
        arr01.forEach(ee1 => {
          ee1.PALLET = 0
          ee1.INCOMING_DATE = ""
          let arrLotNoDupli = []
          let arrLocDupli = []
          this.arr006.forEach(ee2 => {
            if (ee2.TLG_IT_ITEM_PK == ee1.TLG_IT_ITEM_PK) {
              if (ee2.PALLET == null) ee2.PALLET = 0
              ee1.PALLET = parseInt(ee2.PALLET)
              if (ee2.LOT_NO != null) arrLotNoDupli.push(ee2.LOT_NO)
              if (ee2.LOC_NAME != null) arrLocDupli.push(ee2.LOC_NAME)
              if (ee1.INCOMING_DATE < ee2.TR_DATE) ee1.INCOMING_DATE = ee2.TR_DATE
            }
          });
          const arrLotNoUnique = arrLotNoDupli.filter(this.onlyUnique)
          const arrLocUnique = arrLocDupli.filter(this.onlyUnique)
          const strLotNoUnique = this.arrayStrToString(arrLotNoUnique)
          const strLocUnique = this.arrayStrToString(arrLocUnique)
          let obj = {
            NO: j,
            TLG_IT_ITEM_PK: ee1.TLG_IT_ITEM_PK,
            ITEM_CODE: ee1.ITEM_CODE,
            ITEM_NAME: ee1.ITEM_NAME,
            LOT_NO: strLotNoUnique,
            INCOMING_DATE: ee1.INCOMING_DATE,
            QTY: ee1.QTY,
            UOM: ee1.UOM,
            PALLET: ee1.PALLET,
            LOCATION: strLocUnique,
            PARTNER: ee1.PARTNER
          }
          arr03.push(obj)
          j++
        });
        if (txtItemPK == '' || txtItemPK == null) {
          this.$refs.grdD.setDataSource(arr03)
          let totalPLT = 0
          arr03.forEach(ee1 => {
            totalPLT += parseInt(ee1.PALLET)
          });
          this.totalPLT01 = totalPLT
        } else {
          let arr05 = []
          arr03.forEach(ee1 => {
            if (ee1.TLG_IT_ITEM_PK == txtItemPK) {
              ee1.NO = 1
              arr05.push(ee1)
            }
          });
          this.$refs.grdD.setDataSource(arr05)
          let totalPLT = 0
          arr05.forEach(ee1 => {
            totalPLT += parseInt(ee1.PALLET)
          });
          this.totalPLT01 = totalPLT
        }
        this.loadLocationMaterial(txtItemPK)
      } else {
        switch (val) {
          case 6:
            this.getItemStockIn(txtItemPK, arr02)
            break;
          case 7:
            this.getItemWaitStockIn(txtItemPK, arr02)
            break;
          case 10:
            this.getItemStockOut(txtItemPK, arr02)
            break;
          case 12:
            this.getPalletItem(arr02, txtItemPK)
            break;
          default:
            break;
        }
      }
    },
    async loadGroupStatus() {
      if (this.warehouseTitle == "RAW MATERIAL") {
        const dso = {
          type: "list",
          selpro: "LG_SEL_MECA040_RMWH_6_NOCACHE",
          para: [this.user.TCO_COMPANY_PK],
        };
        const result = await this._dsoCall(dso, "select", false);
        this.lstAA = result.filter((item) => item.TYPE == "AA");
        this.lstAB = result.filter((item) => item.TYPE == "AB");
      }
    },

    maximizeScreen() {
      this.isMaximized = !this.isMaximized;
      if (this.isMaximized) {
        this.$nuxt.$emit("changeLayout", "monitoring");
      } else {
        this.$nuxt.$emit("changeLayout", "default");
      }
    },

    initHeader() {
      this.headerGrdDRM = [
        { dataField: "NO", caption: this.$t("no"), width: 120, allowEditing: false, hidden: false, }, 
        { dataField: "ITEM_CODE", caption: this.$t("item_name"), width: 120, allowEditing: false, hidden: false, }, 
        { dataField: "ITEM_NAME", caption: this.$t("item_name"), width: 120, allowEditing: false, hidden: false, }, 
        { dataField: "LOT_NO", caption: this.$t("lot_no"), width: 120, allowEditing: false, visible: this.showLotNo, }, 
        { dataField: "INCOMING_DATE", caption: this.$t("incoming_date"), width: 120, allowEditing: false, hidden: false, dataType: "date", }, 
        { dataField: "QTY", caption: this.$t("qty"), width: 120, allowEditing: false, hidden: false, formatFloat: 2, dataType: "number", summaryType: 'sum' }, 
        { dataField: "UOM", caption: this.$t("uom"), width: 120, allowEditing: false, hidden: false, }, 
        { dataField: "PALLET", caption: this.$t("pallet"), width: 120, allowEditing: false, hidden: false, formatFloat: 0, dataType: "number", summaryType: 'sum' }, 
        { dataField: "LOCATION", caption: this.$t("location"), width: 120, allowEditing: false, visible: this.showLocation, }, 
        { dataField: "PARTNER", caption: this.$t("partner"), width: 120, allowEditing: false, hidden: false, },
      ]
      this.headerGrdDLocRM = [
        { dataField: "SEQ", caption: this.$t("seq"), width: 100, allowEditing: false, hidden: false, }, 
        { dataField: "LOC_NAME", caption: this.$t("location"), width: 200, allowEditing: false, hidden: false, }, 
        { dataField: "LOT_NO", caption: this.$t("fifo_lot_no"), width: 200, allowEditing: false, hidden: false, }, 
        { dataField: "REQUEST_QTY", caption: this.$t("request_qty"), width: 160, allowEditing: false, hidden: false, formatFloat: 0, dataType: "number", },
      ];
    },
  },
};
</script>

<style>
/* css tay 01 */
.text04 { font-weight: bold; color: #c00000; font-size: 20px; line-height: 44px; }
.text03 { font-weight: bold; font-size: 16px; line-height: 44px; }
.text02 { font-weight: bold; }
.text01 { text-align: center; color: white; justify-items: center; line-height: 100px; font-weight: bold; }
.item01click { width: 80px; height: 100px; background-color: #215968; margin: 0px 15px 10px 40px; cursor: pointer; box-shadow: 1px 1px 2px #00aa00, 0 0 5px #00cc00, 0 0 5px #00ff00; }
.item01 { width: 80px; height: 100px; background-color: #215968; margin: 0px 15px 10px 40px; cursor: pointer; }
.item02click { width: 250px; height: 100px; background-color: #376092; margin: 0px 15px 10px 0px; display: flex; cursor: pointer; box-shadow: 1px 1px 2px #00aa00, 0 0 5px #00cc00, 0 0 5px #00ff00; }
.item02 { width: 250px; height: 100px; background-color: #376092; margin: 0px 15px 10px 0px; display: flex; cursor: pointer; }
.item03 { width: 80px; height: 100px; line-height: 100px; padding: 0px 0px 0px 10px; color: white; font-weight: bold; }
.item04 { width: 155px; height: 80px; background-color: #ffffff; border-radius: 10px; margin: 10px 0px 0px 0px; padding: 5px 0px 0px 10px; }
.item05click { width: 300px; height: 100px; background-color: #558ed5; margin: 0px 10px 10px 0px; display: flex; cursor: pointer; box-shadow: 1px 1px 2px #00aa00, 0 0 5px #00cc00, 0 0 5px #00ff00; }
.item05 { width: 300px; height: 100px; background-color: #558ed5; margin: 0px 10px 10px 0px; display: flex; cursor: pointer; }
.item06 { width: 120px; height: 100px; line-height: 100px; padding: 0px 0px 0px 10px; color: white; font-weight: bold; }
.item07click { width: 250px; height: 100px; background-color: #558ed5; margin: 0px 10px 10px 0px; display: flex; cursor: pointer; box-shadow: 1px 1px 2px #00aa00, 0 0 5px #00cc00, 0 0 5px #00ff00; }
.item07 { width: 250px; height: 100px; background-color: #558ed5; margin: 0px 10px 10px 0px; display: flex; cursor: pointer; }
.item08click { width: 250px; height: 100px; background-color: #95b3d7; margin: 0px 10px 10px 0px; display: flex; cursor: pointer; box-shadow: 1px 1px 2px #00aa00, 0 0 5px #00cc00, 0 0 5px #00ff00; }
.item08 { width: 250px; height: 100px; background-color: #95b3d7; margin: 0px 10px 10px 0px; display: flex; cursor: pointer; }
.item09click { width: 250px; height: 100px; background-color: #31859c; margin: 0px 10px 10px 0px; display: flex; cursor: pointer; box-shadow: 1px 1px 2px #00aa00, 0 0 5px #00cc00, 0 0 5px #00ff00; }
.item09 { width: 250px; height: 100px; background-color: #31859c; margin: 0px 10px 10px 0px; display: flex; cursor: pointer; }  /* end css tay 01 */  .p08 { font-weight: bold; font-size: 18px; margin-left: 10px; }
.div26 { width: 15px; height: 120px; }
.div27 { display: flex; margin-top: 6px; }
.p22 { font-size: 18px; text-align: right; }
</style>
