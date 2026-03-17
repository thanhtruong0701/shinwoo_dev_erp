<template>
  <v-container>
  <v-dialog id="update-qty-month-dialog" :max-width="this.windowWidth" v-model="dialogIsShow">
      <v-card v-resize="onResize">
        <v-card-title class="headline primary-gradient white--text py-2">{{ $t('update_qty_by_month') }}
          <v-spacer></v-spacer>
          <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
        </v-card-title>
        <v-card-text class="pa-0">
          <v-container>
            <v-row align="center" justify="space-between" no-gutters>
              <v-col md="2" class="px-1 py-2">
                <date-control type='months' :value="modelSearch.MONTH" @returnValue="modelSearch.MONTH = $event" :label="$t('month')"  />
              </v-col>
              <v-col md="1" class="px-1 py-2" align="center">
                
              </v-col>
              <v-col md="3" class="px-1 py-2">
                <v-text-field v-model="modelSearch.ITEM_NM" :label="$t('item')" placeholder=" " clearable dense hide-details  />
              </v-col>
              <v-col md="2" class="px-1 py-2">
                <v-select :label="$t('item_type')" v-model="modelSearch.ITEM_TYPE" :items="dataList.lstItemType" item-text="CODEDESC" item-value="CODEKEY"
                      placeholder=" " persistent-hint dense hide-details/>
              </v-col>
              <v-col md="2" class="px-1 py-2">
                <v-select :label="$t('plan_qty')" v-model="modelSearch.PLAN_QTY" :items="dataList.lstPlanQty" item-text="CODEDESC" item-value="CODEKEY"
                      placeholder=" " persistent-hint dense hide-details/>
              </v-col>
              
              <v-col md="2" class="px-1 py-2" align="right">
                <v-btn icon tile :color="currentTheme" :disabled="isProcessing" @click="onClickButton('btnSearch')" :title="$t('btn_search')">
                  <v-icon>mdi-magnify</v-icon>
                </v-btn>
                <v-btn icon tile :color="currentTheme" :disabled="isProcessing" @click="onClickButton('btnSave')" :title="$t('btnsave')">
                  <v-icon>mdi-content-save</v-icon>
                </v-btn>
                <v-btn icon tile v-show="false" color="success" :disabled="isProcessing" @click="onClickButton('btnMakeRevision')" :title="$t('btnmakerevision')">
                  <v-icon>mdi-clipboard-text</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-row align="center" justify="space-between" no-gutters>
              <v-col md="3" class="px-1 py-2">
                <v-row align="center" justify="space-between" no-gutters>
                  <v-col md="6" class="px-1 py-2">
                    <date-picker :inputValue="modelSearch.PRICE_FROM_DT" :label="$t('eve_price_from')" @returnValue="modelSearch.PRICE_FROM_DT = $event" :placeholder="' '"/>
                  </v-col>
                  <v-col md="6" class="px-1 py-2">
                    <date-picker :inputValue="modelSearch.PRICE_TO_DT" :label="$t('eve_price_to')" @returnValue="modelSearch.PRICE_TO_DT = $event" :placeholder="' '"/>
                  </v-col>
                </v-row>
              </v-col>
              <v-col md="3" class="px-1 py-2">
                
              </v-col>
              <v-col md="2" class="px-1 py-2">
                
              </v-col>
              <v-col md="2" class="px-1 py-2" align="left">
                <v-text-field  v-model="modelSearch.SET_PLAN_QTY" :label="$t('set_plan_qty')" type="number" placeholder=" " dense hide-details  />
              </v-col>
              <v-col md="1" class="px-1 py-2" align="left">
                <v-btn icon tile color="#42A5F5" dark  :title="$t('btn_set_data')" @click="onClickButton('btnSetQtyPlan')" :disabled="isProcessing">
                  <v-icon>mdi-table-edit</v-icon>
                </v-btn>
              </v-col>
              <v-col md="1" class="px-1 py-2" align="right">
                
              </v-col>
            </v-row>
            <v-row align="center" justify="space-between" no-gutters>
              <v-col md="12" class="px-1 py-0">
                <DxDataGrid column-resizing-mode="widget" ref="refGrdDetail" 
                    :allow-column-resizing="true" :column-auto-width="$vuetify.breakpoint.smAndDown" :data-source="dsGrdDetail" 
                    :height="heightGrdDetail"  :no-data-text="$t('no_data', 'common')"
                    :paging="{ pageSize: 300 }"
                    :show-borders="true" :show-column-lines="true" :show-row-lines="true" 
                    :onCellPrepared="onCellPreparedDetail" @init-new-row="initNewRowDetail" @row-inserted="rowInsertedDetail" @row-updated="checkUpdatedDetail">
                  <DxColumn data-field="ITEM_CODE" :caption="$t('item_code')" 
                              dataType="string" :allow-editing="false" width="120" css-class="cell-align-left" />
                  <DxColumn data-field="ITEM_NAME" :caption="$t('item_name')" 
                              dataType="string" :allow-editing="false" width="150" css-class="cell-align-left" />
                  <DxColumn data-field="ITEM_TYPE" :caption="$t('item_type')" 
                              dataType="string" :allow-editing="false" width="100" css-class="cell-align-left" />
                  <DxColumn data-field="UNIT_COST" :caption="$t('u_price')" 
                              dataType="number" format="###,###,###.##" :allow-editing="false" width="90" css-class="cell-align-right" />
                  <DxColumn data-field="AVE_PRICE" :caption="$t('ave_price')" 
                              dataType="number" format="###,###,###.##" :allow-editing="false" width="90" css-class="cell-align-right" />
                  <DxColumn data-field="CCY" :caption="$t('trans_ccy')" 
                              dataType="string" :allow-editing="false" width="80" css-class="cell-align-left" />
                  <DxColumn data-field="UOM" :caption="$t('uom')" :visible="false"
                              dataType="string" :allow-editing="false" width="60" css-class="cell-align-left" />
                  <DxColumn data-field="LATEST_REV_QTY" :caption="$t('latest_rev_qty')" :visible="false"
                              dataType="number" format="###,###,###" :allow-editing="false" width="80" css-class="cell-align-right" />
                  <DxColumn data-field="PLAN_QTY" :caption="$t('sale_plan_qty')" 
                              dataType="number" format="###,###,###" :allow-editing="true" width="80" css-class="cell-align-right" />
                  <DxColumn data-field="AMT_1" :caption="$t('amt_1')" 
                              dataType="number" format="###,###,###" :allow-editing="false" width="90" css-class="cell-align-right" />
                  <DxColumn data-field="AVE_PRICE_AMT" :caption="$t('ave_price_amt')" 
                              dataType="number" format="###,###,###" :allow-editing="false" width="80" css-class="cell-align-right" />
                  <DxColumn data-field="ACT_BF_4" :caption="dataHeader.ACT_BF_4" 
                              dataType="number" format="###,###,###" :allow-editing="false" width="80" css-class="cell-align-right" />
                  <DxColumn data-field="ACT_BF_3" :caption="dataHeader.ACT_BF_3" 
                              dataType="number" format="###,###,###" :allow-editing="false" width="90" css-class="cell-align-right" />
                  <DxColumn data-field="PER_1" :caption="$t('per_1')" 
                              dataType="number" format="###,###,###.##" :allow-editing="false" width="80" css-class="cell-align-right" />
                  <DxColumn data-field="EVE_1" :caption="$t('eve_1')" 
                              dataType="string" :allow-editing="false" width="60" css-class="cell-align-center" />
                  <DxColumn data-field="ACT_BF_2" :caption="dataHeader.ACT_BF_2" 
                              dataType="number" format="###,###,###" :allow-editing="false" width="80" css-class="cell-align-right" />
                  <DxColumn data-field="PER_2" :caption="$t('per_2')" 
                              dataType="number" format="###,###,###.##" :allow-editing="false" width="80" css-class="cell-align-right" />
                  <DxColumn data-field="EVE_2" :caption="$t('eve_2')" 
                              dataType="string" :allow-editing="false" width="60" css-class="cell-align-center" />
                  <DxColumn data-field="PLAN_BF_1" :caption="dataHeader.PLAN_BF_1"  
                              dataType="number" format="###,###,###" :allow-editing="false" width="80" css-class="cell-align-right" />
                  <DxColumn data-field="PER_3" :caption="$t('per_3')" 
                              dataType="number" format="###,###,###.##" :allow-editing="false" width="80" css-class="cell-align-right" />
                  <DxColumn data-field="EVE_3" :caption="$t('eve_3')" 
                              dataType="string" :allow-editing="false" width="60" css-class="cell-align-center" />
                  <DxColumn data-field="PLAN_CUR_QTY" :caption="dataHeader.PLAN_CUR_QTY" 
                              dataType="number" format="###,###,###" :allow-editing="false" width="80" css-class="cell-align-right" />
                  <DxColumn data-field="PER_4" :caption="$t('per_4')" 
                              dataType="number" format="###,###,###.##" :allow-editing="false" width="90" css-class="cell-align-right" />
                  <DxColumn data-field="EVE_4" :caption="$t('eve_4')" 
                              dataType="string" :allow-editing="false" width="60" css-class="cell-align-center" />
                  <DxColumn data-field="ACT_BF_12" :caption="dataHeader.ACT_BF_12" 
                              dataType="number" format="###,###,###" :allow-editing="false" width="80" css-class="cell-align-right" />
                  <DxColumn data-field="ACT_BF_11" :caption="dataHeader.ACT_BF_11" 
                              dataType="number" format="###,###,###" :allow-editing="false" width="80" css-class="cell-align-right" />
                  <DxColumn data-field="PER_5" :caption="$t('per_5')" 
                              dataType="number" format="###,###,###.##" :allow-editing="false" width="80" css-class="cell-align-right" />
                  <DxColumn data-field="EVE_5" :caption="$t('eve_5')" 
                              dataType="string" :allow-editing="false" width="60" css-class="cell-align-center" />
                  <DxColumn data-field="YYYYMM" :visible="false"
                              dataType="string" :allow-editing="false" width="90" css-class="cell-align-right" />
                  <DxColumn data-field="TLG_BPG_PLAN_M_PK" :visible="false"
                              dataType="number" :allow-editing="false" />
                  <DxColumn data-field="TLG_BPG_PLAN_D_PK" :visible="false"
                              dataType="number" :allow-editing="false" />
                  <DxColumn data-field="STT" :caption="$t('stt')" 
                              dataType="number" format="###,###,###" :allow-editing="false" width="90" css-class="cell-align-right" />

                  <DxEditing mode="cell" :allow-updating="true" startEditAction="dblClick" />
                  <DxSelection mode="multiple" show-check-boxes-mode="none" />
                  <DxKeyboardNavigation :edit-on-key-press="true" />
                </DxDataGrid>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
    <revision-confirm-dialog ref="refMakeReviseCf" :dialogInfo="[$t('do_you_want_make_revision'),'warning']" @onConfirm="onMakeRevision()" />
  </v-container>
</template>

<script>
import CellGridTextField from '@/components/table/CellGridTextField'
import AlertDialog from '@/components/dialog/AlertDialog'
import DatePicker from '@/components/control/DatePicker';
import DateControl from '@/components/control/DateControl';
import ConfirmDialog from '@/components/dialog/ConfirmDialog'
export default {
  name: 'update-qty-month-dialog',
  components: { CellGridTextField, AlertDialog,
              'date-picker': DatePicker,
              'date-control': DateControl,
              'revision-confirm-dialog': ConfirmDialog,},
  data: () => ({
    dialogIsShow: false,
    dataList: {lstItemType:[], lstPlanQty: []},

    modelSearch: {MONTH: "",  ITEM_NM: "", ITEM_TYPE: "", PLAN_QTY: "", PRICE_FROM_DT: "", PRICE_TO_DT: "", SET_PLAN_QTY: 0},
    dataHeader: {ACT_BF_4: "", ACT_BF_3: "", ACT_BF_2: "", PLAN_BF_1: "", PLAN_CUR_QTY: "", ACT_BF_12: "", ACT_BF_11: ""},
    dsGrdDetail: [],
    dsGrdMonth: [],
  }),
  watch: {
    dialogIsShow(val) {
      if(val === false) {
        this.$emit('onCloseDialog')
      }else{
        
      }
    },
    "modelSearch.MONTH"(val){
      this.onChangeField('MONTH');
    }
  },
  mounted(){
    this.getListCodes();
  },
  computed: {
    user() { return this.$store.getters["auth/user"] },
    heightGrdDetail() { return this.windowHeight-280 },
  },
  created() {
    
  },
  methods: {
    async getListCodes() {
      this.dataList.lstPlanQty.push({CODEKEY: "ALL", CODEDESC: this.$t('option_all')});
      this.dataList.lstPlanQty.push({CODEKEY: ">0", CODEDESC: this.$t('option_greater_zero')});
      this.dataList.lstPlanQty.push({CODEKEY: "=0", CODEDESC: this.$t('option_equal_zero')});

      this.modelSearch.PLAN_QTY = "ALL";
      this.LG_LST_2020020(['ITEM_TYPE',this.user.TCO_COMPANY_PK, this.user.PK]);
    },
    onClickButton(obj){
      switch(obj){
        case 'btnSearch':
          this.DSO_GRD_2020020_POP03_1('select');
          break;
        case 'btnSave':
          if(this.onSaveValidate()){
            this.DSO_GRD_2020020_POP03_1('update');
          }
          break;
        case 'btnMakeRevision':
          this.$refs.refMakeReviseCf.dialogIsShow = true;
          break;
        case 'btnSetQtyPlan':
          var arrRowSelected =  this.$refs.refGrdDetail.instance.getSelectedRowsData();
          if(arrRowSelected.length>0){
            for(var i = 0; i < arrRowSelected.length; i++){
              var arrIdx = this.dsGrdDetail.findIndex(e => e.TLG_BPG_PLAN_M_PK == arrRowSelected[i].TLG_BPG_PLAN_M_PK
                                                          && e.YYYYMM == arrRowSelected[i].YYYYMM);
              this.dsGrdDetail[arrIdx].PLAN_QTY = this.modelSearch.SET_PLAN_QTY;
              this.dsGrdDetail[arrIdx]._rowstatus = (this.dsGrdDetail[arrIdx]._rowstatus != "INSERT" ? "UPDATE" : this.dsGrdDetail[arrIdx]._rowstatus);
              this.onCalculate(this.dsGrdDetail[arrIdx]);
            }
          }
          this.$refs.refGrdDetail.instance.refresh();
          break;
      }
    },
    onChangeField(obj){
      switch(obj){
        case 'MONTH':
          this.dsGrdDetail = [];
          this.dataHeader.ACT_BF_4 = this.convertToHeader(this.addsMonth(this.modelSearch.MONTH,-4));
          this.dataHeader.ACT_BF_3 = this.convertToHeader(this.addsMonth(this.modelSearch.MONTH,-3));
          this.dataHeader.ACT_BF_2 = this.convertToHeader(this.addsMonth(this.modelSearch.MONTH,-2));
          this.dataHeader.PLAN_BF_1 = this.convertToHeader(this.addsMonth(this.modelSearch.MONTH,-1));
          this.dataHeader.PLAN_CUR_QTY = this.convertToHeader(this.addsMonth(this.modelSearch.MONTH,0));
          this.dataHeader.ACT_BF_12 = this.convertToHeader(this.addsMonth(this.modelSearch.MONTH,-12));
          this.dataHeader.ACT_BF_11 = this.convertToHeader(this.addsMonth(this.modelSearch.MONTH,-11));
          break;
      }
    },
    onMakeRevision(){
      this.LG_PRO_2020020_POP3_1('update');
    },
    convertToHeader(_yyyymm){//"202006", "202011"
      _yyyymm = ""+_yyyymm;
      var year = _yyyymm.substr(0,4);
      var month = _yyyymm.substr(4,2);
      switch(month){
        case '01':
          return year+this.$t("jan");
        break;
        case '02':
          return year+this.$t("feb");
        break;
        case '03':
          return year+this.$t("mar");
        break;
        case '04':
          return year+this.$t("apr");
        break;
        case '05':
          return year+this.$t("may");
        break;
        case '06':
          return year+this.$t("jun");
        break;
        case '07':
          return year+this.$t("jul");
        break;
        case '08':
          return year+this.$t("aug");
        break;
        case '09':
          return year+this.$t("sep");
        break;
        case '10':
          return year+this.$t("oct");
        break;
        case '11':
          return year+this.$t("nov");
        break;
        case '12':
          return year+this.$t("dec");
        break;
      }
    },
    addsMonth(_date, _val_add){
      var _mm = Number(_date.substr(4,2))-1;
      var _yyyy = Number(_date.substr(0,4));
      var isYYYYMMDD = _date.length == 8 ? true : false;
      var _day = isYYYYMMDD ? Number(_date.substr(6,2)) : 1;
      _date = new Date(_yyyy,_mm,_day);
      var d = new Date(_date.setMonth(_date.getMonth() + _val_add));
      
      _yyyy = ""+d.getFullYear();
      _mm = ""+(d.getMonth()+1);
      _mm = _mm.length == 1 ? "0"+_mm : _mm;
      _day = ""+d.getDate();
      if(isYYYYMMDD){
        _day = _day.length == 1 ? "0"+_day : _day;
      }else{
        _day = "";
      }
      return ""+_yyyy+_mm+_day;
    },
    onSaveValidate(){
      
      return true;
    },
    onCalculate(item){
      var PlanQty = Number(item.PLAN_QTY);
      var UPrice = Number(item.UNIT_COST);
      var AvePrice = Number(item.AVE_PRICE);
      var PlanBF_1 = Number(item.PLAN_BF_1);

      var Amt_1 = PlanQty * UPrice;
      var Amt_2 = PlanQty * AvePrice;
      var thisPercent = PlanBF_1>0 ? Math.round((PlanQty-PlanBF_1)/PlanBF_1,2) : 0;
      var thisEve = "-";
      if(thisPercent>0){
        thisEve = "↑";
      }else if(thisPercent<0){
        thisEve = "↓";
      }
      item.AMT_1 = Amt_1;
      item.AVE_PRICE_AMT = Amt_2;
      item.PLAN_CUR_QTY = PlanQty;
      item.PER_4 = thisPercent;
      item.EVE_4 = thisEve;

    },
    initNewRowDetail(e) {
      e.data._rowstatus = "INSERT";
    },

    rowInsertedDetail(e) {
      this.dsGrdMonth.unshift(e.data);
      this.dsGrdMonth.pop();
    },

    checkUpdatedDetail(e) {
      if (!e.cancel) {
        if (e.data._rowstatus !== "INSERT") {
          e.data._rowstatus = "UPDATE";
        }
        this.onCalculate(e.data);
        this.$refs.refGrdDetail.instance.refresh();
      }
    },
    onCellPreparedDetail(e) {
      if (e.rowType == "data") {
        var dataField = e.column.dataField;
        if(dataField == "ACT_BF_4" || dataField == "ACT_BF_3" || dataField == "PER_1" || dataField == "EVE_1" || 
            dataField=="ACT_BF_2" || dataField == "PER_2" || dataField == "EVE_2"){
          e.cellElement.style.backgroundColor = "#FFFDE7";

          var per_1 = e.row.data.PER_1;
          if(dataField == "PER_1" || dataField == "EVE_1"){
            e.cellElement.style.color = (e.row.data.PER_1<0 ? "#F44336" : "#2196F3");
          }

          if(dataField == "PER_2" || dataField == "EVE_2"){
            e.cellElement.style.color = (e.row.data.PER_2<0 ? "#F44336" : "#2196F3");
          }
          
        }else if(dataField == "PLAN_BF_1" || dataField == "PER_3" || dataField == "EVE_3" || dataField == "PLAN_CUR_QTY" || 
            dataField == "PER_4" || dataField == "EVE_4"){
          e.cellElement.style.backgroundColor = "#E1F5FE";

          if(dataField == "PER_3" || dataField == "EVE_3"){
            e.cellElement.style.color = (e.row.data.PER_3<0 ? "#F44336" : "#2196F3");
          }

          if(dataField == "PER_4" || dataField == "EVE_4"){
            e.cellElement.style.color = (e.row.data.PER_4<0 ? "#F44336" : "#2196F3");
          }
        }else if(dataField == "ACT_BF_12" || dataField == "ACT_BF_11" || dataField == "PER_5" || dataField == "EVE_5"){
          e.cellElement.style.backgroundColor = "#FFEBEE";

          if(dataField == "PER_5" || dataField == "EVE_5"){
            e.cellElement.style.color = (e.row.data.PER_5<0 ? "#F44336" : "#2196F3");
          }
        }
        
      }
    },
    async DSO_GRD_2020020_POP03_1(action = 'update') {
      const dso = {
        type: 'grid',
        selpro: 'LG_SEL_2020020_POP3_1',
        updpro: "LG_UPD_2020020_POP3_1",
        para: [this.modelSearch.MONTH, this.modelSearch.PRICE_FROM_DT, this.modelSearch.PRICE_TO_DT, this.modelSearch.PLAN_QTY, 
                this.modelSearch.ITEM_NM, this.modelSearch.ITEM_TYPE],
        elname: ["_rowstatus", "PLAN_QTY", "YYYYMM", "TLG_BPG_PLAN_M_PK",  "TLG_BPG_PLAN_D_PK"],
        data: this.dsGrdDetail
      }
      let row = await this._dsoCall(dso, action, false);
      if (row) {
        this.dsGrdDetail = row;
      }
    },
    async LG_PRO_2020020_POP3_1(action = 'update') {
      const dso = {
        type: 'process',
        updpro: 'LG_PRO_2020020_POP3_1',
        para: [this.modelSearch.MONTH],
      }
      let row = await this._dsoCall(dso, action, false);
      if (row) {
        this.showNotification("success", "Information", this.$t('success'));
      }
    },
    /*NOTE: */
		async LG_LST_2020020(_param) {
			const dso = {
        type: 'list',
        selpro: 'LG_LST_2020020',
        para: _param
			}
			switch(_param[0]){
        case 'ITEM_TYPE':
          this.dataList.lstItemType = await this._dsoCall(dso, 'select', false);
          this.dataList.lstItemType.unshift({CODEKEY: "", CODEDESC: this.$t("option_all")});
          this.modelSearch.ITEM_TYPE = "";
          break;
      }
    },
  }
}
</script>
