<template>
<v-container fluid v-resize="onResize">
  <!-- Raw Material WH -->
  <v-row dense v-if="warehouseTitle == 'RAW MATERIAL'">
    <rawmaterialwh @loadDataGrdD="loadDataGrdD" @chkLocation="chkLocation" @chkLotNo="chkLotNo" :totalPLT01="totalPLT01"></rawmaterialwh>
  </v-row>
  <!-- Raw Material WH sơ đồ kho -->
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

  <!-- Raw Material WH -->
  <v-row dense v-show="warehouseTitle == 'RAW MATERIAL'">
    <p class="p08"> {{txtTextStock01}} </p>
  </v-row>
  <v-row dense v-if="warehouseTitle == 'RAW MATERIAL'">
    <v-col md="6">
      <DataGridView column-resizing-mode="widget" ref="grdD" :header="headerGrdDRM" select_mode="Single" :auto_load="false" :max_height="heightGrdDRM01" sel_procedure="LG_SEL_MECA040_RMWH_10_NOCACHE" :filter_paras="filterParaGrdD01" @cellDblClick="onClickGrdDRM" @cellClick="onCellClickGDLRM" />
    </v-col>
    <v-col md="6">
      <DataGridView column-resizing-mode="widget" ref="grdDLocRM" :header="headerGrdDLocRM" select_mode="Single" :auto_load="false" :max_height="heightGrdDLocRM" sel_procedure="LG_SEL_MECA040_RMWH_11_NOCACHE" :filter_paras="filterParaGrdD02" />
    </v-col>
  </v-row>

  <!-- Finished Goods -->
  <v-row dense align="center" justify="space-between" v-else>
    <v-col cols="12">
      <div class="d-flex flex-column justify-center">
        <v-container class="pa-0">
          <v-row dense justify="space-start">
            <v-col lg="1" cols="12"><label class="text03">STORAGE TYPE: </label></v-col>
            <v-col lg="2" cols="12"><label class="text04">{{ warehouseTitle }}</label></v-col>
            <v-col lg="4" cols="12"> </v-col>
            <v-col lg="2" cols="12">
              <v-btn :disabled="isProcessing" :color="'' + (!layoutType ? 'green' : 'blue-grey')" class="white--text" @click="layoutType = false">
                List
              </v-btn>
              <v-btn :disabled="isProcessing" :color="'' + (layoutType ? 'green' : 'blue-grey')" class="white--text" @click="layoutType = true">
                Layout
              </v-btn>
            </v-col>
            <v-col cols="1">
              <div class="d-flex align-center justify-space-between">
                <v-spacer></v-spacer>
                <v-btn color="primary6" icon @click="maximizeScreen">
                  <v-icon>{{
                            !isMaximized
                              ? "mdi-window-maximize"
                              : "mdi-window-restore"
                          }}</v-icon>
                </v-btn>
              </div>
            </v-col>
          </v-row>
          <v-row dense v-if="warehouseTitle == 'FINISHED GOODS'">
            <!-- CSS tay 01 -->
            <div class="div26"></div>
            <div :class="boolActive01 ? 'div25' : 'div03'">
              <table class="table01" @click="onClick('FG01')">
                <tr>
                  <th class="th01">
                    ALL
                  </th>
                </tr>
                <tr>
                  <td class="td01">
                    <p class="p04"> {{ this.totalEAall!=null ? this.totalEAall.toLocaleString("en", {   minimumFractionDigits: 0, maximumFractionDigits: 0, }) : 0      }} </p>
                    <p class="p05">&nbsp;EA</p>
                  </td>
                </tr>
              </table>
            </div>
            <div :class="boolActive02 ? 'div25' : 'div03'">
              <table class="table01" @click="onClick('FG02')">
                <tr>
                  <th class="th01">
                    AUTO
                  </th>
                </tr>
                <tr>
                  <td class="td01">
                    <p class="p04"> {{this.objAuto.EA!=null ? this.objAuto.EA.toLocaleString("en", {   minimumFractionDigits: 0, maximumFractionDigits: 0, }) : 0}} </p>
                    <p class="p05">&nbsp;EA</p>
                  </td>
                </tr>
              </table>
            </div>
            <div :class="boolActive07 ? 'div25' : 'div03'">
              <table class="table01" @click="onClick('FG03')">
                <tr>
                  <th class="th01">
                    GENT
                  </th>
                </tr>
                <tr>
                  <td class="td01">
                    <p class="p04"> {{this.objGent.EA!=null ? this.objGent.EA.toLocaleString("en", {   minimumFractionDigits: 0, maximumFractionDigits: 0, }) : 0}} </p>
                    <p class="p05">&nbsp;EA</p>
                  </td>
                </tr>
              </table>
            </div>
            <div :class="boolActive08 ? 'div25' : 'div03'">
              <table class="table01" @click="onClick('FG04')">
                <tr>
                  <th class="th01">
                    JSS
                  </th>
                </tr>
                <tr>
                  <td class="td01">
                    <p class="p04"> {{this.objJss.EA!=null ? this.objJss.EA.toLocaleString("en", {   minimumFractionDigits: 0, maximumFractionDigits: 0, }) : 0}} </p>
                    <p class="p05">&nbsp;EA</p>
                  </td>
                </tr>
              </table>
            </div>
            <div :class="boolActive09 ? 'div25' : 'div03'">
              <table class="table01" @click="onClick('FG05')">
                <tr>
                  <th class="th01">
                    ZF
                  </th>
                </tr>
                <tr>
                  <td class="td01">
                    <p class="p04"> {{this.objZf.EA!=null ? this.objZf.EA.toLocaleString("en", {   minimumFractionDigits: 0, maximumFractionDigits: 0, }) : 0}} </p>
                    <p class="p05">&nbsp;EA</p>
                  </td>
                </tr>
              </table>
            </div>
            <div :class="boolActive05 ? 'div25' : 'div03'">
              <table class="table01" @click="onClick('FG06')">
                <tr>
                  <th class="th01">
                    THE OTHER
                  </th>
                </tr>
                <tr>
                  <td class="td01">
                    <p class="p04"> {{this.objOther.EA!=null ? this.objOther.EA.toLocaleString("en", {   minimumFractionDigits: 0, maximumFractionDigits: 0, }) : 0}} </p>
                    <p class="p05">&nbsp;EA</p>
                  </td>
                </tr>
              </table>
            </div>
          </v-row>
          <div class="div27">
            <v-col lg="2" cols="12">
              <BaseInput :label="$t('location')" v-model="location" />
            </v-col>
            <v-col lg="2" cols="12">
              <BaseInput :label="$t('item_name')" v-model="item_name" />
            </v-col>
            <v-col lg="2" cols="12">
              <BaseInput :label="$t('slip_no')" v-model="slip_no" />
            </v-col>
            <v-col lg="2" cols="12">
              <BaseDatePicker :label="$t('date')" v-model="txtDateCurrent" today />
            </v-col>
            <v-col lg="2" cols="12">
              <v-btn :disabled="isProcessing" color="blue-grey" class="white--text" @click="onSearch()">
                search
                <v-icon right dark> mdi-magnify </v-icon>
              </v-btn>
              <v-btn :disabled="isProcessing" color="blue-grey" class="white--text">
                print
              </v-btn>
            </v-col>
          </div>
        </v-container>
      </div>
    </v-col>
  </v-row>

  <!-- Finished Goods -->
  <v-row dense v-if="warehouseTitle == 'FINISHED GOODS'">
    <div class="div05" @click="onTransactionsClick('IN','PRODUCT IN',totalIncome)">
      <div class="div06">
        <p class="p06">nhập kho</p>
        <p class="p07">product in</p>
      </div>
      <div class="div07">
        <p> {{this.totalIncome}}/{{this.totalStockIn}} </p>
      </div>
    </div>
    <div class="div08" @click="onTransactionsClick('WAIT_IN','WAITING INCOMING',totalWaitIncome)">
      <div class="div06">
        <p class="p06">chờ nhập kho</p>
        <p class="p07">waiting incoming</p>
      </div>
      <div class="div07">
        <p> {{this.totalWaitIncome}}/{{this.totalStockIn}} </p>
      </div>
    </div>
    <div class="div09" @click="onTransactionsClick('TRANS_IN','RE-LOCATION',0)">
      <div class="div10">
        <p class="p06">đổi vị trí</p>
        <p class="p07">re-location</p>
      </div>
      <div class="div11">
        <p>0</p>
      </div>
    </div>
    <div class="div09" @click="onTransactionsClick('TRANS_OUT','GOOD RETURN',0)">
      <div class="div10">
        <p class="p06">hàng trả lại</p>
        <p class="p07">good return</p>
      </div>
      <div class="div11">
        <p>0</p>
      </div>
    </div>
  </v-row>
  <v-row dense v-if="warehouseTitle == 'FINISHED GOODS'">
    <div class="div05" @click="onTransactionsClick('DELI','DELIVERY',totalOutgo)">
      <div class="div06">
        <p class="p06">xuất kho</p>
        <p class="p07">delivery</p>
      </div>
      <div class="div07">
        <p>{{this.totalOutgo}}/{{this.totalStockOut}}</p>
      </div>
    </div>
    <div class="div08" @click="onTransactionsClick('DELI_REQ','WAITING DELIVERY',totalWaitOutgo)">
      <div class="div06">
        <p class="p06">chờ xuất kho</p>
        <p class="p07">delivery request</p>
      </div>
      <div class="div07">
        <p>{{this.totalWaitOutgo}}/{{this.totalStockOut}}</p>
      </div>
    </div>
    <div class="div12" @click="onTransactionsClick('STOCK_PALLET','STOCK', totalEAall)">
      <div class="div13">
        <p class="p06">tồn kho</p>
        <p class="p07">stock</p>
      </div>
      <div class="div14">
        <p> {{this.txtStock01.toLocaleString("en", {   minimumFractionDigits: 0, maximumFractionDigits: 0, })}} &nbsp;EA</p>
      </div>
      <div class="div15">
        <p> {{this.txtPlt01}} PLT</p>
      </div>
    </div>
  </v-row>

  <!-- Finished Goods -->
  <v-row dense v-if="layoutType == false && warehouseTitle == 'FINISHED GOODS' && boolStock01 == false">
    <v-col cols="12">
      <v-card outlined :height="masterContainerHeight">
        <v-row fluid :height="detailContainerHeight1">
          <v-col cols="12">
            <BaseTabs ref="baseTabsRefs">
              <BaseTab :name="$t(tabsName)" :tabname="tabsName" :eager="true">
                <BaseGridView ref="grdData" :header="headerMaster" :sel_procedure="masterproc01" :multiselect="true" :headertype="1" :filter_paras="masterpara1" :height="detailContainerHeight1" :showaggregatestop="true" @cellDblClick="onDblClickCell" />
              </BaseTab>
            </BaseTabs>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>

  <!-- Finished Goods grid Stock -->
  <v-row dense v-if="layoutType == false && warehouseTitle == 'FINISHED GOODS' && boolStock01 == true">
    <v-col md="6">
      <v-row dense>
        <v-col md="12">
          <p class="p22">{{this.$t("double_click_to_open_popup_location")}} </p>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col md="12">
          <BaseTabs ref="baseTabsRefs">
            <BaseTab :name="$t(tabsName)" :tabname="tabsName" :eager="true">
              <BaseGridView ref="grdData" :header="headerMaster" :sel_procedure="masterproc01" :multiselect="true" :headertype="1" :filter_paras="masterpara1" :height="detailContainerHeight2" :showaggregatestop="true" @cellDblClick="onDblClickGrdD" @cellClick="onCellClickGrdD" />
            </BaseTab>
          </BaseTabs>
        </v-col>
      </v-row>
    </v-col>
    <v-col md="6">
      <v-row dense v-if="showText01">
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
            </tr>
          </table>
        </div>
      </v-row>
      <v-row dense>
        <BaseGridView ref="grdDLocFG" :header="headerGrdDLocFG" sel_procedure="LG_SEL_LOC_PLT_QTY_3_NOCACHE" :multiselect="true" :headertype="1" :filter_paras="filterParaGrdDLoc" :height="detailContainerHeight1" />
      </v-row>
    </v-col>
  </v-row>

  <!-- Finished Goods -->
  <v-row dense v-if="layoutType == true && warehouseTitle == 'FINISHED GOODS'">
    <warehousegroup v-if="mapType == 'warehouse'" :key="test" :tmp="tmp" :width="width" :height="height" @onclick="onCellClick "></warehousegroup>
    <rackgroup v-else-if="mapType == 'rack'" :tmp="tmp" :idborder="labelsBorder" :lstLabels="lstLabels" :labelsTitle="lstRack[0].LOC_NAME" :style=" 'transform: scale(' +`${mapType == 'warehouse' ? scale : scale2}` + ');transform-origin: top left'">
    </rackgroup>
  </v-row>

  <!-- Raw Material WH -->
  <transferWaiting ref="dialogTransferWaiting" :objSend02="objSend02" />

  <!-- Finished Goods -->
  <deliveryRequest v-if="warehouseTitle != 'RAW MATERIAL'" ref="deliveryRequest" :selGrdD="detailprocall" :paraGrdD="detailpara1" :objSend="objSend01"></deliveryRequest>
  <stockLocation v-if="warehouseTitle != 'RAW MATERIAL'" ref="stockLocation" :selGrdD="detailprocall" :paraGrdD="detailpara1" :objSend="objSend01"></stockLocation>
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
    arrGetStock: {
      type: Array,
    },
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
    transactionMonitoring: {
      type: Array,
    },
    test: {
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
    headerGrdDLocFG: [],
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
    boolActive01: true,
    boolActive02: false,
    boolActive07: false,
    boolActive08: false,
    boolActive09: false,
    boolActive05: false,
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
    arrAuto: [],
    arrGent: [],
    arrZf: [],
    arrJss: [],
    arrOther: [],
    objAuto: {
      EA: 0,
      PLT: 0,
    },
    objGent: {
      EA: 0,
      PLT: 0,
    },
    objJss: {
      EA: 0,
      PLT: 0,
    },
    objZf: {
      EA: 0,
      PLT: 0,
    },
    objOther: {
      EA: 0,
      PLT: 0,
    },
    data: null,
    lstStorage: [],
    transType: "STOCK_PALLET",
    layoutType: false,
    mapType: "warehouse",
    tmp: [],
    lstBorder: [],
    isMaximized: false,
    itemCode: "",
    itemName: "",
    revision: "",
    partner: "",
    itemPk: "",
    lotNo: "",
    item_name: null,
    headerMaster: [],
    masterproc01: "",
    detailprocall: "",
    tabsName: "STOCK",
    scale: 0.6,
    scale2: 0.45,
    wareHouseData: [],
    currentDate: moment(new Date()).format("YYYYMMDD"),
    currentDateView: moment(new Date()).format("YYYY-MM-DD HH:mm"),
    transactionsObj: {},
    formatDate: "yyyy-MM-dd HH:mm",
    showaggregatestop: false,
    maxRow: 0,
    maxCol: 0,
    labelsBorder: null,
    lstLabels: null,
    whPK: null,
  }),
  created() {
    // this.parentMonitoring();
    // this.searchStorage1("LG_SEL_8050080_4", "");
    this.loadGroupStatus();
    this.initHeader()
    this.loadStatusInOut()
  },
  watch: {
    layoutType(val) {
      if (val) {
        this.item_name = this.txtItemName01
        this.searchStorage1("LG_SEL_8050080_4", "");
      }
    },
    arrGetStock(val) {
      const resGetStock = val // await this._dsoCall(dsoGetStock, "select", false);
      let totalEaAuto = 0
      let totalEaGent = 0
      let totalEaJss = 0
      let totalEaZf = 0
      let totalEaOther = 0
      let totalPltAuto = 0
      let totalPltGent = 0
      let totalPltJss = 0
      let totalPltZf = 0
      let totalPltOther = 0
      resGetStock.forEach(ee1 => {
        if (ee1.ITEM_NAME.indexOf("AUTO") > -1) {
          if (ee1.END_QTY == null) ee1.END_QTY = 0
          if (ee1.PALLET == null) ee1.PALLET = 0
          totalEaAuto += parseInt(ee1.END_QTY)
          totalPltAuto += parseInt(ee1.PALLET)
        }
        if (ee1.ITEM_NAME.indexOf("GENT") > -1) {
          if (ee1.END_QTY == null) ee1.END_QTY = 0
          if (ee1.PALLET == null) ee1.PALLET = 0
          totalEaGent += parseInt(ee1.END_QTY)
          totalPltGent += parseInt(ee1.PALLET)
        }
        if (ee1.ITEM_NAME.indexOf("JSS") > -1) {
          if (ee1.END_QTY == null) ee1.END_QTY = 0
          if (ee1.PALLET == null) ee1.PALLET = 0
          totalEaJss += parseInt(ee1.END_QTY)
          totalPltJss += parseInt(ee1.PALLET)
        }
        if (ee1.ITEM_NAME.indexOf("ZF") > -1) {
          if (ee1.END_QTY == null) ee1.END_QTY = 0
          if (ee1.PALLET == null) ee1.PALLET = 0
          totalEaZf += parseInt(ee1.END_QTY)
          totalPltZf += parseInt(ee1.PALLET)
        }
        if (ee1.ITEM_NAME.indexOf("AUTO") == -1 && ee1.ITEM_NAME.indexOf("GENT") == -1 && ee1.ITEM_NAME.indexOf("JSS") == -1 && ee1.ITEM_NAME.indexOf("ZF") == -1) {
          if (ee1.END_QTY == null) ee1.END_QTY = 0
          if (ee1.PALLET == null) ee1.PALLET = 0
          totalEaOther += parseInt(ee1.END_QTY)
          totalPltOther += parseInt(ee1.PALLET)
        }
      });
      this.objAuto.EA = totalEaAuto;
      this.objGent.EA = totalEaGent;
      this.objJss.EA = totalEaJss;
      this.objZf.EA = totalEaZf;
      this.objOther.EA = totalEaOther;
      this.objAuto.PLT = totalPltAuto;
      this.objGent.PLT = totalPltGent;
      this.objJss.PLT = totalPltJss;
      this.objZf.PLT = totalPltZf;
      this.objOther.PLT = totalPltOther;
      this.totalEAall = totalEaAuto + totalEaGent + totalEaJss + totalEaZf + totalEaOther
      this.totalPLTall = totalPltAuto + totalPltGent + totalPltJss + totalPltZf + totalPltOther
      this.txtStock01 = this.totalEAall
      this.txtPlt01 = this.totalPLTall
    },
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
    async onCellClick(celData) {
      let param = [];
      if (this.whPK == null) {
        if (celData.Role == "child") {
          param = [celData.PARENT_PK, this.item_name, this.item_name];
          this.whPK = celData.PARENT_PK;
        } else {
          if (celData.Role == "sub_parent2") {
            param = [celData.PK, '', this.item_name];
            this.whPK = celData.PK;
          } else param == [];
        }
      } else {
        param = [this.whPK, '', this.item_name];
      }
      if (param.length != 0) {
        const dso = {
          type: "grid",
          selpro: "LG_SEL_8050080_3",
          para: param,
        };
        this.lstRack = await this._dsoCall(dso, "select", false);
        let tlgInPKArray = []
        this.lstRack.forEach(e => {
          tlgInPKArray.push(e['TLG_IN_STORAGE_PK'])
        });
        tlgInPKArray = [...new Set(tlgInPKArray)]
        let rowArr = [];
        let colArr = [];
        this.lstRack.forEach((_e) => {
          rowArr.push(_e.R);
          colArr.push(_e.C);
        });
        let min = this._Min(rowArr);
        let max = this._Max(rowArr);
        let minCol = this._Min(colArr);
        let maxCol = this._Max(colArr);
        let tmpArr = [];
        for (let i = 0; i <= max; i++) {
          let _row = this.lstRack.filter((q) => q["R"] == i);
          let _arr = [];
          for (let j = 0; j <= maxCol; j++) {
            _arr.push({
              R: i,
              C: j
            });
            if (_row.findIndex((q) => q["C"] == j) < 0) {
              _row.push({
                R: i,
                C: j
              });
            }
          }
          _row = _row.length > 0 ? _.sortBy(_row, "C") : _arr;
          _row.forEach((e) => {
            e["Border"] = e.TLG_IN_STORAGE_PK == celData.PK ? "Y" : "N";
            if (e.TLG_IN_STORAGE_PK == celData.PK) {
              this.labelsBorder = e.C
            }
          });
          tmpArr.push(_row);
        }
        this.dataSetter(tmpArr, "rack");
        this.lstLabels = [...new Set(colArr)];
      } else {
        alert("nothing");
      }
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
        //
        // let totalPLT = 0
        // console.log('1 ', arr04.length);
        // arr04.forEach(ee1 => {
        //   totalPLT += parseInt(ee1.PALLET)
        // });
        // this.totalPLT01 = totalPLT
        // console.log('3 ', this.totalPLT01);
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
      // let totalPLT = 0
      // arr04.forEach(ee1 => {
      //   totalPLT += ee1.PALLET
      // });
      // this.totalPLT01 = totalPLT
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
        case 0:
          this.txtSelItemPK01 = '39955'
          break;
        case 1:
          this.txtSelItemPK01 = '214'
          break;
        case 2:
          this.txtSelItemPK01 = '215'
          break;
        case 3:
          this.txtSelItemPK01 = '216'
          break;
        case 4:
          this.txtSelItemPK01 = '1'
          break;
        case 5:
          this.txtSelItemPK01 = '0'
          break;
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
    async getLocation(para01) {
      const dsoSelAuto = {
        type: "list",
        selpro: "LG_SEL_MECA040_SGSTT_2_NOCACHE",
        para: [this.user.TCO_COMPANY_PK, this.item_name, this.item_name, this.storagePk, para01],
      };
      const resSelAuto = await this._dsoCall(dsoSelAuto, "select", false);
      return resSelAuto;
    },
    async loadGroupStatus() {
      if (this.warehouseTitle == "FINISHED GOODS") {
        this.arrAuto = await this.getLocation("AUTO")
        this.arrGent = await this.getLocation("GENT")
        this.arrJss = await this.getLocation("JSS")
        this.arrZf = await this.getLocation("ZF")
        this.arrOther = await this.getLocation("OTHER")
      }
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
    onClick(action) {
      switch (action) {
        case "FG01":
          this.boolActive01 = true;
          this.boolActive02 = false;
          this.boolActive07 = false;
          this.boolActive08 = false;
          this.boolActive09 = false;
          this.boolActive05 = false;
          this.type01 = "ALL";
          this.searchStorage1("LG_SEL_8050080_4", "");
          this.loadStatusInOut()
          this.txtStock01 = this.totalEAall
          this.txtPlt01 = this.totalPLTall
          this.onTransactionsClick('STOCK_PALLET', 'STOCK', this.totalEAall)
          break;
        case "FG02":
          this.boolActive01 = false;
          this.boolActive02 = true;
          this.boolActive07 = false;
          this.boolActive08 = false;
          this.boolActive09 = false;
          this.boolActive05 = false;
          this.type01 = "AUTO";
          this.searchStorage1("", "");
          this.loadStatusInOut()
          this.txtStock01 = this.objAuto.EA
          this.txtPlt01 = this.objAuto.PLT
          this.onTransactionsClick('STOCK_PALLET', 'STOCK', this.totalEAall)
          break;
        case "FG03":
          this.boolActive01 = false;
          this.boolActive02 = false;
          this.boolActive07 = true;
          this.boolActive08 = false;
          this.boolActive09 = false;
          this.boolActive05 = false;
          this.type01 = "GENT";
          this.searchStorage1("", "");
          this.loadStatusInOut()
          this.txtStock01 = this.objGent.EA
          this.txtPlt01 = this.objGent.PLT
          this.onTransactionsClick('STOCK_PALLET', 'STOCK', this.totalEAall)
          break;
        case "FG04":
          this.boolActive01 = false;
          this.boolActive02 = false;
          this.boolActive07 = false;
          this.boolActive08 = true;
          this.boolActive09 = false;
          this.boolActive05 = false;
          this.type01 = "JSS";
          this.searchStorage1("", "");
          this.loadStatusInOut()
          this.txtStock01 = this.objJss.EA
          this.txtPlt01 = this.objJss.PLT
          this.onTransactionsClick('STOCK_PALLET', 'STOCK', this.totalEAall)
          break;
        case "FG05":
          this.boolActive01 = false;
          this.boolActive02 = false;
          this.boolActive07 = false;
          this.boolActive08 = false;
          this.boolActive09 = true;
          this.boolActive05 = false;
          this.type01 = "ZF";
          this.searchStorage1("", "");
          this.loadStatusInOut()
          this.txtStock01 = this.objZf.EA
          this.txtPlt01 = this.objZf.PLT
          this.onTransactionsClick('STOCK_PALLET', 'STOCK', this.totalEAall)
          break;
        case "FG06":
          this.boolActive01 = false;
          this.boolActive02 = false;
          this.boolActive07 = false;
          this.boolActive08 = false;
          this.boolActive09 = false;
          this.boolActive05 = true;
          this.type01 = "OTHER";
          this.searchStorage1("", "");
          this.loadStatusInOut()
          this.txtStock01 = this.objOther.EA
          this.txtPlt01 = this.objOther.PLT
          this.onTransactionsClick('STOCK_PALLET', 'STOCK', this.totalEAall)
          break;
        default:
          break;
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

    // async refresh() {
    // this.$forceUpdate();
    // let tmp= this.item_name+"";
    // await this.wait(100);
    // this.item_name = 111;
    // },

    async onTransactionsClick(transType, transName, qty) {
      if (transType == 'STOCK_PALLET') this.boolStock01 = true
      else this.boolStock01 = false
      this.transType = transType;
      this.tabsName = transName;
      if (this.layoutType) {
        // LAYOUT
        if (transType == "STOCK" || transType == "STOCK_PALLET") {
          this.searchStorage1("LG_SEL_8050080_4", "");
        } else {
          this.searchStorage1("LG_SEL_MECA040_1_NOCACHE", transType);
        }
      } else {
        // LIST
        try {
          if (transType == "STOCK" || transType == "STOCK_PALLET") {
            this.headerMaster = this.headerstock;
            this.masterproc01 = this.masterproc03;
            // this.masterpara1 = [this.user.TCO_COMPANY_PK, "", this.item_name, this.user.TCO_COMPANY_PK, this.storagePk, this.type01, ];
            this.masterpara1 = [this.txtDateCurrent, this.txtDateCurrent, '20', '142', 'Y', '108', this.item_name, 'N', 'ENG', 'N', 'N', 'Y', 'N', 'N', '', '', '', '10', '', '', this.user.TCO_COMPANY_PK, this.user.PK, this.type01];
            // this.masterpara1 = [this.currentDate, this.currentDate, '20', '142', 'Y', '108', this.item_name, 'N', 'ENG', 'N', 'N', 'Y', 'N', 'N', '', '', '', '10', '', '', this.user.TCO_COMPANY_PK, this.user.PK, this.type01];
          } else {
            this.headerMaster = this.headerlist;
            this.masterproc01 = this.masterproc02;
            this.masterpara1 = [this.currentDate, this.transType, this.type01, this.item_name, this.slip_no];
          }
          setTimeout(() => {
            if (parseInt(qty) > 0) {
              this.$refs.grdData.loadData();
            } else {
              this.$refs.grdData.Clear();
            }
          }, 100);
        } catch (error) {
          console.log("onTransactionsClick: " + error);
        }
      }
    },

    onDblClickGrdD(data) {
      this.objSend01 = data.data
      this.$refs.stockLocation.dialogIsShow = true
      //
      this.lotNo = data.data["LOT_NO"];
      this.itemCode = data.data["ITEM_CODE"];
      this.itemName = data.data["ITEM_NAME"];
      this.itemPk = data.data["PK"];
      this.revision = data.data["ITEM_CODE"]
      this.partner = data.data["ITEM_CODE"]
      if (this.transType == "STOCK" || this.transType == "STOCK_PALLET") {
        this.detailprocall = this.detailproc2;
        this.detailpara1 = [this.lotNo, this.itemPk, this.storagePk];
      } else {
        this.detailprocall = this.detailproc1;
        this.detailpara1 = [this.currentDate, data.data.REQ_NO, data.data.TLG_IT_ITEM_PK, this.transType];
      }
    },
    onDblClickCell(data) {
      this.objSend01 = data.data
      this.$refs.deliveryRequest.dialogIsShow = true
      //
      this.lotNo = data.data["LOT_NO"];
      this.itemCode = data.data["ITEM_CODE"];
      this.itemName = data.data["ITEM_NAME"];
      this.itemPk = data.data["PK"];
      this.revision = data.data["ITEM_CODE"]
      this.partner = data.data["ITEM_CODE"]
      if (this.transType == "STOCK" || this.transType == "STOCK_PALLET") {
        this.detailprocall = this.detailproc2;
        this.detailpara1 = [this.lotNo, this.itemPk, this.storagePk];
      } else {
        this.detailprocall = this.detailproc1;
        this.detailpara1 = [this.currentDate, data.data.REQ_NO, data.data.TLG_IT_ITEM_PK, this.transType];
      }
    },
    async onSearch() {
      if (this.layoutType) {
        const dso01 = {
          type: "list",
          selpro: "LG_SEL_MECA040_SGSTT_3_NOCACHE",
          para: ['22134', this.item_name, this.item_name, '1242'],
        };
        let res01 = await this._dsoCall(dso01, "select", false);
        this.searchStorage2(res01)
      } else {
        switch (this.transType) {
          case 'IN':
            break;
          case 'WAIT_IN':
            break;
          case 'DELI':
            break;
          case 'DELI_REQ':
            break;
          case 'STOCK_PALLET':
            break;
          default:
            break;
        }
        this.onTransactionsClick(this.transType, this.tabsName, 1)
        this.$emit("onclick", {
          item: {
            item_name: this.item_name,
            slip_no: this.slip_no,
            date_time: this.txtDateCurrent,
            type01: this.type01, // type AUTO, GENT, JSS, ZF, OTHER
          },
        });
        if (this.warehouseTitle != "FINISHED GOODS") {
          this.$refs.grdData.Clear();
        }
      }

    },

    async searchStorage1(procedure, transtype) {
      this.isProcessing = true;
      this.tmp = [];
      let param = [];
      if (transtype != "") {
        param = [this.user.TCO_COMPANY_PK, this.item_name, this.item_name, this.storagePk, this.currentDate, transtype, ];
      } else {
        param = [this.user.TCO_COMPANY_PK, this.item_name, this.item_name, this.storagePk];
      }
      const dso = {
        type: "grid",
        selpro: procedure,
        para: param,
      };
      this.lstStorage = [];
      switch (this.type01) {
        case "ALL":
          this.lstStorage = await this._dsoCall(dso, "select", false);
          break;
        case "AUTO":
          this.lstStorage = this.arrAuto;
          this.isProcessing = false;
          break;
        case "GENT":
          this.lstStorage = this.arrGent;
          this.isProcessing = false;
          break;
        case "JSS":
          this.lstStorage = this.arrJss;
          this.isProcessing = false;
          break;
        case "ZF":
          this.lstStorage = this.arrZf;
          this.isProcessing = false;
          break;
        case "OTHER":
          this.lstStorage = this.arrOther;
          this.isProcessing = false;
          break;
        default:
          break;
      }
      this.searchStorage2(this.lstStorage);
    },

    async searchStorage2(data) {
      let rowArr = [];
      let colArr = [];
      let test = [];
      data.forEach((_e) => {
        rowArr.push(_e.R);
        colArr.push(_e.C);
        _e["Border"] = "N";
        if (_e.LEAF_YN == "Y") {
          test.push(_e.PARENT_PK);
          _e["Role"] = "child";
        } else {
          if (_e.PARENT_PK == 0) {
            _e["Role"] = "parent";
          } else {
            if (_e.LVL == 2) {
              _e["Role"] = "sub_parent";
            } else {
              _e["Role"] = "sub_parent2";
            }
          }
        }
      });
      try {
        let min = this._Min(rowArr);
        let max = this._Max(rowArr);
        let minCol = this._Min(colArr);
        let maxCol = this._Max(colArr);
        this.maxRow = max
        this.maxCol = maxCol
        let tmpArr = [];
        for (let i = min; i <= max + 1; i++) {
          let _row = data.filter((q) => q["R"] == i);
          let _arr = [];
          for (let j = minCol; j <= maxCol + 1; j++) {
            _arr.push({
              R: i,
              C: j
            });
            if (_row.findIndex((q) => q["C"] == j) < 0) {
              _row.push({
                R: i,
                C: j
              });
            }
          }
          _row = _row.length > 0 ? _.sortBy(_row, "C") : _arr;
          tmpArr.push(_row);
        }
        this.dataSetter(tmpArr, "warehouse");
      } catch (error) {
        console.log(error);
      }
    },

    familiesGen(allData) {
      let data = JSON.parse(JSON.stringify(allData));
      let allArr = [];
      let subParentArr = [];
      let parentPK = null;
      try {
        data = _.groupBy(data, "PARENT_PK");
        parentPK = data["0"][0].PK;
        subParentArr = data[parentPK]; //lvl1
        subParentArr.forEach((e) => {
          //lvl2
          let childrensArr = {};
          // childrensArr.push(e)
          data[e.PK].forEach((_e) => {
            //lvl3
            if (_e.LEAF_YN == "Y") {
              childrensArr[e.NAME] = [];
              childrensArr[e.NAME].push(_e);
            } else {
              childrensArr[_e.NAME] = [];
              data[_e.PK].forEach((_e_) => {
                //lvl4
                if (_e_.LEAF_YN == "Y") {
                  childrensArr[_e.NAME].push(_e_);
                } else {}
              });
            }
          });
          allArr.push(childrensArr);
        });
      } catch (error) {
        console.log(error);
      }
      return allArr;
    },

    dataSetter(tmpArr, mapType) {
      this.mapType = mapType;
      this.tmp = tmpArr;
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
      this.headerGrdDLocFG = [
        { dataField: "SEQ", caption: this.$t("seq"), width: 100, allowEditing: false, hidden: false, }, 
        { dataField: "LOC_NAME", caption: this.$t("location"), width: 100, allowEditing: false, hidden: false, }, 
        { dataField: "LOT_NO", caption: this.$t("fifo_lot_no"), width: 100, allowEditing: false, hidden: false, }, 
        { dataField: "PALLET_SEQ", caption: this.$t("pallet_seq"), width: 100, allowEditing: false, hidden: false, }, 
        { dataField: "PALLET_BARCODE", caption: this.$t("pallet_barcode"), width: 160, allowEditing: false, hidden: false, }, 
        { dataField: "REQUEST_QTY", caption: this.$t("request_qty"), width: 100, allowEditing: false, hidden: false, formatFloat: 0, dataType: "number", },
      ];
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
