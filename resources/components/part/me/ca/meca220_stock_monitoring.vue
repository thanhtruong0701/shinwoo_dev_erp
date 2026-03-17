<template>
<v-container fluid class="pa-2" v-resize="onResize">
  <v-row dense>
    <v-col md="1">
      <div class="d-flex justify-end pt-2">
        <label class="text03">Storage type: </label>
      </div>
    </v-col>
    <v-col md="4">
      <div class="d-flex justify-start pt-2">
        <label class="text04">{{ warehouseTitle }}</label>
      </div>
    </v-col>
    <v-col md="2">
      <v-btn :disabled="isProcessing" :color="'' + (!layoutType ? 'green' : 'blue-grey')" class="white--text" @click="layoutType = false">
        List
      </v-btn>
      <v-btn :disabled="isProcessing" :color="'' + (layoutType ? 'green' : 'blue-grey')" class="white--text" @click="layoutType = true">
        Layout
      </v-btn>
    </v-col>
    <v-col md="2">
      <div class="d-flex justify-end pt-2">
        <b class="error--text">{{ this.strCurrentDate }}</b>
      </div>
    </v-col>
    <v-col md="1">
      <v-btn color="primary6" icon @click="maximizeScreen">
        <v-icon>
          {{
              !isMaximized
                ? "mdi-window-maximize"
                : "mdi-window-restore"
              }}
        </v-icon>
      </v-btn>
    </v-col>
  </v-row>
  <v-row dense class="mb-3 ml-10">
    <v-col md="3">
      <BaseSelect :label="$t('warehouse')" v-model="itemWarehouse" :lstData="lstWareHouse" item-text="WH_NAME" item-value="PK" disableSearch v-if="type01 == 1" />
    </v-col>
    <v-col md="2">
      <BaseInput :label="$t('item_name')" v-model="txtItemName" @keyPressEnter="onClick('search')" />
    </v-col>
    <v-col md="1">
      <div class="d-flex justify-center mt-2">
        <BaseCheckbox :label="$t('location')" true-value="Y" false-value="N" v-model="chkLocation" />
      </div>
    </v-col>
    <v-col md="1">
      <div class="d-flex justify-center mt-2">
        <BaseCheckbox :label="$t('lot_no')" true-value="Y" false-value="N" v-model="chkLotNo" />
      </div>
    </v-col>
    <v-col md="1">
      <BaseDatePicker :label="$t('stock_date')" v-model="currentDate" />
    </v-col>
    <v-col md="2">
      <div class="d-flex justify-end">
        <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="onClick('search')" />
        <BaseButton icon_type="settings" :btn_text="$t('settings')" :disabled="isProcessing" @onclick="onClick('settings')" />
      </div>
    </v-col>
  </v-row>
  <v-row dense class="mb-2 ml-10">
    <div class="div05" @click="onClick(6)">
      <div class="div06">
        <p class="p06">nhập kho</p>
        <p class="p07">incoming</p>
      </div>
      <div class="div07">
        <p> {{ this.objIncome.IN }}/{{ this.objIncome.TOTAL }} </p>
        <!-- <p> 0/0 </p> -->
      </div>
    </div>
    <div class="div08" @click="onClick(7)">
      <div class="div06">
        <p class="p06">chờ nhập kho</p>
        <p class="p07">waiting incoming</p>
      </div>
      <div class="div07">
        <p> {{ this.objIncome.WAIT_IN }}/{{ this.objIncome.TOTAL }} </p>
      </div>
    </div>
    <div class="div09">
      <div class="div10">
        <p class="p06">đổi vị trí</p>
        <p class="p07">re-location</p>
      </div>
      <div class="div11">
        <p>0</p>
      </div>
    </div>
    <div class="div09">
      <div class="div10">
        <p class="p06">hàng sx lỗi</p>
        <p class="p07">defect</p>
      </div>
      <div class="div11">
        <p>0</p>
      </div>
    </div>
  </v-row>
  <v-row dense class="mb-2 ml-10">
    <div class="div05" @click="onClick(10)">
      <div class="div06">
        <p class="p06">xuất kho</p>
        <p class="p07">outgo</p>
      </div>
      <div class="div07">
        <p>  {{ this.objOutgo.OUT }}/{{ this.objOutgo.TOTAL }} </p>
      </div>
    </div>
    <div class="div08" @click="onClick(11)">
      <div class="div06">
        <p class="p06">chờ xuất kho</p>
        <p class="p07">waiting outgo</p>
      </div>
      <div class="div07">
        <p> {{ this.objOutgo.WAIT_OUT }}/{{ this.objOutgo.TOTAL }} </p>
      </div>
    </div>
    <div class="div12" @click="onClick(0)">
      <div class="div13">
        <p class="p06">tồn kho</p>
        <p class="p07">stock</p>
      </div>
      <div class="div36">
        <p> {{ totalQty.toLocaleString("en", { minimumFractionDigits: 0, maximumFractionDigits: 0, }) }} </p>
      </div>
      <div class="div15">
        <p> 0 &nbsp;PLT</p>
      </div>
    </div>
  </v-row>
  <v-row dense v-if="layoutType == false && warehouseTitle == 'CONSUMABLE'">
    <v-col md="6">
      <DataGridView column-resizing-mode="widget" ref="grdDI" :header="headerGrdDItem" select_mode="Single" :auto_load="false" :max_height="heightGrdD01" :sel_procedure="procedureStock" :filter_paras="filterParaGrdD01" @cellDblClick="onDblClickGrdD" @cellClick="onCellClickGDL" />
    </v-col>
    <v-col md="6">
      <DataGridView column-resizing-mode="widget" ref="grdDLoc" :header="headerGrdDLoc" select_mode="Single" :auto_load="false" :max_height="heightGrdDLoc" :sel_procedure="procedureLocationLotno" :filter_paras="filterParaGrdD02" />
    </v-col>
  </v-row>

  <!-- Consumable -->
  <v-row dense v-if="layoutType == true && warehouseTitle == 'CONSUMABLE'">
    <warehousegroup :key="test" :tmp="tmp" :width="width" :height="height"></warehousegroup>
  </v-row>

  <!-- Raw Material WH -->
  <transferWaiting ref="dialogTransferWaiting" :objSend02="objSend02" />

  <!-- Finished Goods -->
  <deliveryRequest v-if="warehouseTitle != 'RAW MATERIAL'" ref="deliveryRequest" :selGrdD="detailprocall" :paraGrdD="detailpara1" :objSend="objSend01"></deliveryRequest>
  <stockLocation v-if="warehouseTitle != 'RAW MATERIAL'" ref="stockLocation" :selGrdD="detailprocall" :paraGrdD="detailpara1" :objSend="objSend01"></stockLocation>

  <locationStock ref="locationStock" :objSend="objSend02"></locationStock>
</v-container>
</template>

<script>
import moment from 'moment';
import locationStock from "@/components/dialog/LocationStockDialog";
import Warehouse_group from "@/components/part/80/50/8050080_warehouse_group";
import Rack_group from "@/components/part/80/50/8050080_rack_group";
import rawmaterialwh from '@/components/part/me/ca/meca040_rmwh'
import deliveryRequest from "@/components/part/me/ca/meca040_pop_2";
import stockLocation from "@/components/part/me/ca/meca040_pop_stock.vue";
import transferWaiting from "@/components/part/me/ca/meca040_pop_1";

export default {
  layout: "default",
  middleware: "user",
  components: {
    locationStock,
    warehousegroup: Warehouse_group,
    rackgroup: Rack_group,
    rawmaterialwh,
    deliveryRequest,
    stockLocation,
    transferWaiting
  },
  props: {
    warehouseTitle: {
      type: String,
    },
    type01: {
      type: Number,
      default: 2
    },
    procedureStock: {
      type: String,
      default: ""
    },
    procedureInOutStock: {
      type: String,
      default: ""
    },
    procedureLocationLotno: {
      type: String,
      default: ""
    },
    test: {
      type: Number,
    },
    storagePk: {
      type: Number,
    },
    detailpara1: {
      type: Array,
    },
    heightWareHouse: {
      type: Number,
    },
  },
  data: () => ({
    objIncome:{
      IN:0,
      WAIT_IN: 0,
      TOTAL:0
    },
    objOutgo:{
      OUT:0,
      WAIT_OUT: 0,
      TOTAL:0
    },
    totalQty: 0,
    arrTop5: [],
    currentDate: moment(new Date()).format("YYYYMMDD"),
    txtPKItemLoc01: null,
    objSend02: {},
    headerGrdDLoc: [],
    headerGrdDItem: [],
    chkLotNo: "N",
    chkLocation: "N",
    txtItemName: "",
    boolActive01: false,
    boolActive02: false,
    boolActive03: false,
    boolActive04: false,
    boolActive05: false,
    boolActive06: true,
    strCurrentDate: moment(new Date()).format("YYYY.MM.DD HH:mm"),
    itemWarehouse: "",
    lstWareHouse: [],
    isMaximized: false,

    layoutType: false,
    item_name: null,
    txtItemName01: null,
    txtItemName01: '',
    detailprocall: "",
    objSend01: {},
    lstBorder: [],
    mapType: "warehouse",
    compKey: 0,
    tmp: [],
    maxRow: 0,
    maxCol: 0,
  }),
  async created() {
    this.initHeader()
    await this.loadSelBox()
    this.loadStock()
    this.loadInOut()
  },

  watch: {
    chkLocation(val) {
      this.initHeader()
    },
    chkLotNo(val) {
      this.initHeader()
    },
    itemWarehouse(val){
      this.loadStock()
      this.loadInOut()
    },
    layoutType(val) {
      if (val) {
        this.item_name = this.txtItemName01
        this.searchStorage1("LG_SEL_8050080_4", "");
      }
    },
  },
  computed: {
    filterParaGrdD01() {
      let TLG_IN_WAREHOUSE_PK = 18
      if (this.type01 == 1) {
        TLG_IN_WAREHOUSE_PK = this.itemWarehouse
      }
      return [this.currentDate, this.currentDate, TLG_IN_WAREHOUSE_PK, this.txtItemName, this.user.TCO_COMPANY_PK, this.user.PK, 0]
    },
    filterParaGrdD02() {
      let TLG_IN_WAREHOUSE_PK = 18
      if (this.type01 == 1) {
        TLG_IN_WAREHOUSE_PK = this.itemWarehouse
      }
      return [this.currentDate, this.currentDate, TLG_IN_WAREHOUSE_PK, this.txtPKItemLoc01, null, this.user.TCO_COMPANY_PK, this.user.PK]
      // return [TLG_IN_WAREHOUSE_PK, this.txtPKItemLoc01, this.user.TCO_COMPANY_PK, this.currentDate]
    },
    heightGrdD01() {
      if (this.windowHeight <= 768) {
        return this.windowHeight * 0.2
      } else {
        return this.windowHeight * 0.45
      }
    },
    heightGrdDLoc() {
      if (this.windowHeight <= 768) {
        return this.windowHeight * 0.2
      } else {
        return this.windowHeight * 0.45
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
    user() {
      return this.$store.getters["auth/user"]
    },
  },
  mounted() {},

  beforeDestroy() {},
  methods: {
    async loadInOut() {
      let TLG_IN_WAREHOUSE_PK = 18
      if (this.type01 == 1) {
        TLG_IN_WAREHOUSE_PK = this.itemWarehouse
      }
      const dsoInOut = {
        type: "list",
        selpro: this.procedureInOutStock,
        para: [TLG_IN_WAREHOUSE_PK, this.currentDate, this.currentDate, this.user.PK]
        // para: [TLG_IN_WAREHOUSE_PK, this.currentDate, this.currentDate, this.user.PK]
      };
      let resInOut = await this._dsoCall(dsoInOut, "select", false);
      if (resInOut.length > 0) {
        this.objIncome.TOTAL = resInOut[0].TOTAL_IN
        this.objIncome.IN = resInOut[0].INCOME
        this.objIncome.WAIT_IN = resInOut[0].WAIT_IN
        this.objOutgo.TOTAL = resInOut[0].TOTAL_OUT
        this.objOutgo.OUT = resInOut[0].OUTGO
        this.objOutgo.WAIT_OUT = resInOut[0].WAIT_OUT
      }
    },
    getTop5Qty(arrObjItem) {
      let qtyCheck = 999999
      let arr5item = []
      let total = 0
      for (let index = 0; index < 5; index++) {
        let itemMax = {
          QTY: 0
        }
        arrObjItem.forEach(ee1 => {
          if (index == 0) {
            if(ee1.QTY == null) ee1.QTY = 0
            total += parseInt(ee1.QTY)
          }
          if (ee1.QTY > itemMax.QTY && ee1.QTY < qtyCheck) {
            itemMax = ee1
          }
        });
        if (itemMax.ITEM_NAME.length > 10) itemMax.ITEM_NAME = itemMax.ITEM_NAME.slice(0, 10) + "..."
        arr5item.push(itemMax)
        qtyCheck = itemMax.QTY
      }
      this.arrTop5 = arr5item
      this.totalQty = total
    },
    async getPLT(resStock) {
      this.$refs.grdDI.setDataSource(resStock)
    },
    async loadStock() {
      let TLG_IN_WAREHOUSE_PK = 18
      let TLG_WH_GROUP_PK = 102
      if (this.type01 == 1) {
        TLG_IN_WAREHOUSE_PK = this.itemWarehouse
        TLG_WH_GROUP_PK = null
      }
      const dsoStock = {
        type: "list",
        selpro: this.procedureStock,
        para: [this.currentDate, this.currentDate, TLG_IN_WAREHOUSE_PK, this.txtItemName, TLG_WH_GROUP_PK, this.user.TCO_COMPANY_PK, this.user.PK, 0]
      };
      let resStock = await this._dsoCall(dsoStock, "select", false);
      if (resStock.length > 0) {
        resStock.forEach(ee1 => {
          ee1.QTY = ee1.END_QTY
          ee1.LOCATION = ee1.LOC_ID
        });
        this.getPLT(resStock)
        this.getTop5Qty(resStock)
        this.loadInOut()
      }
    },
    async loadSelBox() {
      if (this.type01 == 1) {
        const dsoWH = {
          type: "list",
          selpro: "LG_SEL_MECA220_WH_NOCACHE",
          para: ['', this.user.TCO_COMPANY_PK]
        };
        const resWH = await this._dsoCall(dsoWH, "select", false);
        if (resWH.length > 0) {
          this.lstWareHouse = resWH
          this.itemWarehouse = resWH[0].PK
        }
      }
    },
    async onCellClickGDL(cell) {
      this.txtPKItemLoc01 = cell.data.TLG_IT_ITEM_PK
      setTimeout(() => {
        this.$refs.grdDLoc.loadData()
      }, 10);
    },
    async onDblClickGrdD(cell) {
      this.objSend02 = cell.data
      this.$refs.locationStock.dialogIsShow = true
    },
    async onClick(action) {
      // 6 7 10 11
      // this.activeSelItem(action)
      if(typeof action == "number"){
        let TLG_IN_WAREHOUSE_PK = 18
        let TLG_WH_GROUP_PK = 102
        if (this.type01 == 1) {
          TLG_IN_WAREHOUSE_PK = this.itemWarehouse
          TLG_WH_GROUP_PK = 21
        }
        const dsoItem = {
          type: "list",
          selpro: this.procedureStock,
          para: [this.currentDate, this.currentDate, TLG_IN_WAREHOUSE_PK, this.txtItemName, TLG_WH_GROUP_PK, this.user.TCO_COMPANY_PK, this.user.PK, action]
          // para: [this.currentDate, this.currentDate, TLG_IN_WAREHOUSE_PK, this.txtItemName, this.user.TCO_COMPANY_PK, this.user.PK, action]
        };
        let resItem = await this._dsoCall(dsoItem, "select", false);
        if (action == 0) {
          resItem.forEach(ee1 => {
            ee1.QTY = ee1.END_QTY
            ee1.LOCATION = ee1.LOC_ID
          });
        }
        this.$refs.grdDI.setDataSource(resItem)
      } else {
        switch (action) {
          case 'search':
            this.loadStock()
            break;
          case 'settings':
            break;
          default:
            break;
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
      this.lstStorage = await this._dsoCall(dso, "select", false);
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
      console.log("key:", test)
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
        this.compKey++;
      } catch (error) {
        console.log(error);
      }
    },
    // async onCellClick01(celData) {
    //   let param = [];
    //   if (this.whPK == null) {
    //     if (celData.Role == "child") {
    //       param = [celData.PARENT_PK, this.item_name, this.item_name];
    //       this.whPK = celData.PARENT_PK;
    //     } else {
    //       if (celData.Role == "sub_parent2") {
    //         param = [celData.PK, '', this.item_name];
    //         this.whPK = celData.PK;
    //       } else param == [];
    //     }
    //   } else {
    //     param = [this.whPK, '', this.item_name];
    //   }
    //   if (param.length != 0) {
    //     const dso = {
    //       type: "grid",
    //       selpro: "LG_SEL_8050080_3",
    //       para: param,
    //     };
    //     this.lstRack = await this._dsoCall(dso, "select", false);
    //     let tlgInPKArray = []
    //     this.lstRack.forEach(e => {
    //       tlgInPKArray.push(e['TLG_IN_STORAGE_PK'])
    //     });
    //     tlgInPKArray = [...new Set(tlgInPKArray)]
    //     let rowArr = [];
    //     let colArr = [];
    //     this.lstRack.forEach((_e) => {
    //       rowArr.push(_e.R);
    //       colArr.push(_e.C);
    //     });
    //     let min = this._Min(rowArr);
    //     let max = this._Max(rowArr);
    //     let minCol = this._Min(colArr);
    //     let maxCol = this._Max(colArr);
    //     let tmpArr = [];
    //     for (let i = 0; i <= max; i++) {
    //       let _row = this.lstRack.filter((q) => q["R"] == i);
    //       let _arr = [];
    //       for (let j = 0; j <= maxCol; j++) {
    //         _arr.push({
    //           R: i,
    //           C: j
    //         });
    //         if (_row.findIndex((q) => q["C"] == j) < 0) {
    //           _row.push({
    //             R: i,
    //             C: j
    //           });
    //         }
    //       }
    //       _row = _row.length > 0 ? _.sortBy(_row, "C") : _arr;
    //       _row.forEach((e) => {
    //         e["Border"] = e.TLG_IN_STORAGE_PK == celData.PK ? "Y" : "N";
    //         if (e.TLG_IN_STORAGE_PK == celData.PK) {
    //           this.labelsBorder = e.C
    //         }
    //       });
    //       tmpArr.push(_row);
    //     }
    //     this.dataSetter(tmpArr, "rack");
    //     this.lstLabels = [...new Set(colArr)];
    //   } else {
    //     alert("nothing");
    //   }
    // },
    dataSetter(tmpArr, mapType) {
      this.mapType = mapType;
      this.tmp = tmpArr;
      console.log("tmp:", tmp);
    },
    initHeader() {
     this.headerGrdDItem = [
        { dataField: "TLG_IT_ITEM_PK", caption: this.$t("TLG_IT_ITEM_PK"), width: 60, allowEditing: false, visible: false, }, 
        { dataField: "NO", caption: this.$t("no"), width: 60, allowEditing: false,  }, 
        { dataField: "ITEM_CODE", caption: this.$t("item_code"), width: 120, allowEditing: false,  }, 
        { dataField: "ITEM_NAME", caption: this.$t("item_name"), width: 340, allowEditing: false,  }, 
        { dataField: "LOT_NO", caption: this.$t("lot_no"), width: 120, allowEditing: false, visible: this.chkLotNo=="Y", }, 
        { dataField: "QTY", caption: this.$t("qty"), width: 100, allowEditing: false,  formatFloat: 2, dataType: "number", summaryType: 'sum' }, 
        { dataField: "UOM", caption: this.$t("uom"), width: 80, allowEditing: false,  }, 
        { dataField: "PALLET", caption: this.$t("pallet"), width: 80, allowEditing: false,  formatFloat: 0, dataType: "number", summaryType: 'sum' }, 
        { dataField: "LOCATION", caption: this.$t("location"), width: 120, allowEditing: false, visible: this.chkLocation=="Y", },
      ]
    this.headerGrdDLoc = [
        { dataField: "NO", caption: this.$t("seq"), width: 100, allowEditing: false,  }, 
        { dataField: "LOC_ID", caption: this.$t("location"), width: 200, allowEditing: false,  }, 
        { dataField: "LOT_NO", caption: this.$t("fifo_lot_no"), width: 200, allowEditing: false,  }, 
        { dataField: "END_QTY", caption: this.$t("qty"), width: 160, allowEditing: false,  formatFloat: 0, dataType: "number", },
      ];
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
    maximizeScreen() {
      this.isMaximized = !this.isMaximized;
      if (this.isMaximized) {
        this.$nuxt.$emit("changeLayout", "monitoring");
      } else {
        this.$nuxt.$emit("changeLayout", "default");
      }
    },
  },
};
</script>

<style scope>

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


.p23 { width: 130px; font-weight: bold; font-size: 22px; text-align: right; }
.div36 { width: 120px; height: 30px; background-color: #ffffff; border-radius: 10px; margin: 15px 0px 0px 20px; padding: 5px 0px 0px 10px; font-weight: bold; text-align: center; }
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
