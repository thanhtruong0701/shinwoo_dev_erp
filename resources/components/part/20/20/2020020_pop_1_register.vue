<template>
  <v-container>
  <v-dialog id="register-yearly-plan-dialog" max-width="1200" v-model="dialogIsShow">
      <v-card v-resize="onResize">
        <v-card-title class="headline primary-gradient white--text py-2">{{ $t('register_yearly_plan') }}
          <v-spacer></v-spacer>
          <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
        </v-card-title>
        
        <v-card-text class="pa-0">
          <v-container>
            <v-row align="center" justify="space-between" no-gutters>
              <v-col md="2" class="px-1 py-2">
                <date-control type='years' :value="modelMaster.YEAR" @returnValue="modelMaster.YEAR = $event" :label="$t('year')"  />
              </v-col>
              <v-col md="2" class="px-1 py-2">
                <v-select :label="$t('company')" v-model="modelMaster.COMPANY_PK" :items="dataList.lstCompany" item-text="CODEDESC" item-value="CODEKEY"
                      placeholder=" " persistent-hint dense hide-details/>
              </v-col>
              <v-col md="2" class="px-1 py-2">
                <v-select :label="$t('factory')" v-model="modelMaster.FACTORY_PK" :items="dataList.lstFactory" item-text="CODEDESC" item-value="CODEKEY"
                      placeholder=" " persistent-hint dense hide-details/>
              </v-col>
              <v-col md="2" class="px-1 py-2">
                <v-select :label="$t('internal_trans')" v-model="modelMaster.INTERNAL_TRANS" :items="dataList.lstInternalTrans" item-text="NAME" item-value="CODE"
                      placeholder=" " persistent-hint dense hide-details/>
              </v-col>
              <v-col md="1" class="px-1 py-2" align="center">
                <v-btn icon tile color="#F44336" @click="modelMaster.USE_YN = (modelMaster.USE_YN=='Y' ? 'N':'Y')" :title="$t('use_yn')">
                  <v-icon>{{ modelMaster.USE_YN == 'Y' ? 'mdi-checkbox-marked-outline' : 'mdi-checkbox-blank-outline' }} </v-icon>{{$t("use_yn")}}
                </v-btn>
              </v-col>
              <v-col md="2" class="px-1 py-2" align="right">
                <v-btn icon tile color="success" :disabled="isProcessing" @click="onClickButton('btnAddNew')">
                  <v-icon>mdi-plus-thick</v-icon>
                </v-btn>
                <v-btn icon tile :color="currentTheme" :disabled="isProcessing" @click="onClickButton('btnSave')">
                  <v-icon>mdi-content-save</v-icon>
                </v-btn>
                <v-btn icon tile color="error" :disabled="isProcessing" @click="onClickButton('btnDelete')">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-row align="center" justify="space-between" no-gutters>
              <v-col md="3" class="px-1 py-2">
                <v-row align="center" justify="space-between" no-gutters>
                  <v-col md="2" class="px-1 py-2" align="right">
                    <v-btn icon tile color="success" @click="onClickLabel('ITEM')" :disabled="isProcessing">
                      <v-icon>mdi-information-outline</v-icon>
                    </v-btn>
                  </v-col>
                  <v-col md="10" class="px-1 py-2" align="left">
                    <v-text-field v-model="modelMaster.ITEM_NM" :label="$t('item')" @dblclick="onClickLabel('ITEM')" 
                    :placeholder="$t('dblclick_to_select_item')" @click:clear="onClearItem" :disabled="isProcessing" readonly clearable dense hide-details  />
                  </v-col>
                </v-row>
              </v-col>
              <v-col md="1" class="px-1 py-2">
                <v-text-field  v-model="modelMaster.U_PRICE" :label="$t('unit_price')" type="number" placeholder=" " dense hide-details  />
              </v-col>
              <v-col md="1" class="px-1 py-2">
                <v-text-field v-model="modelMaster.UOM" :label="$t('uom')" placeholder=" " readonly dense hide-details  />
              </v-col>
              <v-col md="3" class="px-1 py-2">
                <v-row align="center" justify="space-between" no-gutters>
                  <v-col md="6" class="px-1 py-2">
                    <date-picker :inputValue="modelMaster.START_DT" :label="$t('start_dt')" @returnValue="modelMaster.START_DT = $event" />
                  </v-col>
                  <v-col md="6" class="px-1 py-2">
                    <date-picker :inputValue="modelMaster.END_DT" :label="$t('end_dt')" @returnValue="modelMaster.END_DT = $event" :defaultType="'null'" :placeholder="' '"/>
                  </v-col>
                </v-row>
              </v-col>
              <v-col md="1" class="px-1 py-2">
                <v-select :label="$t('ccy')" v-model="modelMaster.CCY" :items="dataList.lstCCY" item-text="NAME" item-value="CODE"
                        placeholder=" " persistent-hint dense hide-details/>
              </v-col>
              <v-col md="3" class="px-1 py-2">
                <v-textarea v-model="modelMaster.DESCRIPTION" :label="$t('description')" rows="1" clearable dense hide-details placeholder=" "  />
              </v-col>
            </v-row>
            <v-row align="center" justify="space-between" no-gutters>
              <v-col md="3" class="px-1 py-0">
                <v-row align="center" justify="space-between" no-gutters>
                  <v-col md="4" class="px-1 py-0">
                    {{this.$t("month")}}
                  </v-col>
                  <v-col md="4" class="px-1 py-0">
                    <v-text-field  v-model="setMonthQty" :label="$t('plan_qty')" type="number" placeholder=" " dense hide-details  />
                  </v-col>
                  <v-col md="4" class="px-1 py-0" aign="right">
                    <v-btn icon tile color="#42A5F5" dark  :title="$t('btn_set_data')" @click="onClickButton('btnSetQtyPlan')" :disabled="isProcessing">
                      <v-icon>mdi-table-edit</v-icon>
                    </v-btn>
                    <v-btn icon tile :color="currentTheme" :disabled="isProcessing" @click="onClickButton('btnSaveMonth')">
                      <v-icon>mdi-content-save</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row align="center" justify="space-between" no-gutters>
                  <v-col md="12" class="px-1 py-2">
                    <DxDataGrid column-resizing-mode="widget" ref="refGrdMonth" 
                      :allow-column-resizing="true" :column-auto-width="$vuetify.breakpoint.smAndDown" :data-source="dsGrdMonth" 
                      :height="heightGrdMonth"  :no-data-text="$t('no_data', 'common')"
                      :show-borders="true" :show-column-lines="true" :show-row-lines="true"
                      :onCellPrepared="onCellPrepared" @init-new-row="initNewRow" @row-inserted="rowInserted" @row-updated="checkUpdated" >

                    <DxColumn data-field="BPG_PLAN_M_PK" :visible="false"
                                dataType="number" :allow-editing="false" />
                    <DxColumn data-field="BPG_PLAN_D_PK" :visible="false"
                                dataType="number" :allow-editing="false" />
                    <DxColumn data-field="YYYYMM" :visible="false"
                                dataType="string" :allow-editing="false" />
                    <DxColumn data-field="MONTH_NM" :caption="$t('month_plan')" 
                                dataType="string" :allow-editing="false" width="40%" css-class="cell-align-center" />
                    <DxColumn data-field="PLAN_QTY" :caption="$t('plan_qty')" 
                                dataType="number" format="###,###,###" :allow-editing="true" width="60%" css-class="cell-align-right" />
                    <DxSelection mode="multiple" show-check-boxes-mode="none" />
                    <DxEditing mode="cell" :allow-updating="true" startEditAction="dblClick" />
                    <DxKeyboardNavigation :edit-on-key-press="true" />
                    <DxPaging :enabled="false"/>
                  </DxDataGrid>
                  </v-col>
                </v-row>
              </v-col>
              <v-col md="9" class="px-1 py-0">
                <v-row align="center" justify="space-between" no-gutters>
                  <v-col md="4" class="px-1 py-0">
                    {{this.$t("material")}}
                  </v-col>
                  <v-col md="4" class="px-1 py-0">
                    
                  </v-col>
                  <v-col md="4" class="px-1 py-0" align="right">
                    <v-btn icon tile :color="currentTheme" :disabled="isProcessing" @click="onClickButton('btnSaveDetail')">
                      <v-icon>mdi-content-save</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row align="center" justify="space-between" no-gutters>
                  <v-col md="12" class="px-1 py-2">
                    <DxDataGrid column-resizing-mode="widget" ref="refGrdDetail" 
                        :allow-column-resizing="true" :column-auto-width="$vuetify.breakpoint.smAndDown" :data-source="dsGrdDetail" 
                        :height="heightGrdDetail"  :no-data-text="$t('no_data', 'common')"
                        :show-borders="true" :show-column-lines="true" :show-row-lines="true" 
                        :onCellPrepared="onCellPreparedDetail" @init-new-row="initNewRowDetail" @row-inserted="rowInsertedDetail" @row-updated="checkUpdatedDetail">

                      <DxColumn data-field="PK" :visible="false"
                                  dataType="number" :allow-editing="false" />
                      <DxColumn data-field="TLG_BPG_PLAN_M_PK" :visible="false"
                                  dataType="number" :allow-editing="false" />
                      <DxColumn data-field="MAT_PK" :visible="false"
                                  dataType="number" :allow-editing="false" />
                      <DxColumn data-field="MAT_CODE" :caption="$t('mat_code')" 
                                  dataType="string" :allow-editing="false" width="20%" css-class="cell-align-left" />
                      <DxColumn data-field="MAT_NM" :caption="$t('mat_name')" 
                                  dataType="string" :allow-editing="false" width="30%" css-class="cell-align-left" />
                      <DxColumn data-field="MAT_WEIGHT" :caption="$t('mat_weight')" 
                                  dataType="number" format="###,###,###.##" :allow-editing="true" width="20%" css-class="cell-align-right" />
                      <DxColumn data-field="DESCRIPTION" :caption="$t('description')" 
                                  dataType="string" :allow-editing="true" width="30%" css-class="cell-align-left" />

                      <DxEditing mode="cell" :allow-updating="true" startEditAction="dblClick" />
                      <DxSelection mode="multiple" show-check-boxes-mode="none" />
                      <DxKeyboardNavigation :edit-on-key-press="true" />
                      <DxPaging :enabled="false"/>
                    </DxDataGrid>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
    <item-dialog ref="refItemDialog"  @callBackData="callBackItem" />
    <delete-confirm-dialog ref="refDeleteMasterConfirm" :dialogInfo="[$t('do_you_want_delete'),'warning']" @onConfirm="onDelete()" />
  </v-container>
</template>

<script>
import CellGridTextField from '@/components/table/CellGridTextField'
import AlertDialog from '@/components/dialog/AlertDialog'
import DatePicker from '@/components/control/DatePicker';
import DateControl from '@/components/control/DateControl';
import ItemDialog from '@/components/part/20/20/2020020_pop_2_item';
import ConfirmDialog from '@/components/dialog/ConfirmDialog'
export default {
  name: 'register-yearly-plan-dialog',
  components: { CellGridTextField, AlertDialog,
              'date-picker': DatePicker,
              'date-control': DateControl,
              'item-dialog': ItemDialog,
              'delete-confirm-dialog': ConfirmDialog,},
  data: () => ({
    dialogIsShow: false,
    dataList: {lstCompany:[], lstFactory: [], lstInternalTrans: [], lstCCY: []},

    modelMaster: {YEAR: "",  COMPANY: "", FACTORY: "", INTERNAL_TRANS: "", ITEM_NM: "", ITEM_PK: "", U_PRICE: 0, UOM: "",
                  START_DT: "", END_DT: "", CCY: "", DESCRIPTION: "", USE_YN: 'Y'},
    setMonthQty: 0,
    isModified: false,
    dsGrdDetail: [],
    dsGrdMonth: [],
  }),
  watch: {
    dialogIsShow(val) {
      if(val === false) {
        if(this.isModified){
          this.callBackData("UPDATE");
        }
        this.$emit('onCloseDialog')
      }else{
        this.isModified = false;
        if(!this._hasValue(this.modelMaster.PK)){
          this.resetInputData();
        }
      }
    },
    "modelMaster.COMPANY"(val){
      this.onChangeField('COMPANY');
    }
  },
  mounted(){
    this.getListCodes();
  },
  computed: {
    user() { return this.$store.getters["auth/user"] },
    heightGrdDetail() { return this.windowHeight-350 },
    heightGrdMonth() { return this.windowHeight-350 },
  },
  created() {
    
  },
  methods: {
    async getListCodes() {
      this.LG_LST_2020020(["COMPANY",this.user.TCO_COMPANY_PK, this.user.PK]);

      this.dataList.lstInternalTrans = await this._getCommonCode( 'BPG001',  this.user.TCO_COMPANY_PK  ); 
      this.dataList.lstInternalTrans.push({CODE: "", NAME: ""});
      this.modelMaster.INTERNAL_TRANS = "F";

      this.dataList.lstCCY = await this._getCommonCode( 'LGCM0100',  this.user.TCO_COMPANY_PK  ); 
      this.modelMaster.CCY = this.dataList.lstCCY.length > 0 ? this.dataList.lstCCY[0].CODE : "";
    },
    resetInputData(){
      var date = new Date();
      this.modelMaster = { PK: "", YEAR: ""+date.getFullYear(),  COMPANY: "", FACTORY: "", INTERNAL_TRANS: "", ITEM_NM: "", ITEM_PK: "", U_PRICE: 0, UOM: "",
                  START_DT: this._CurrentDate(''), END_DT: "", CCY: "", DESCRIPTION: "", USE_YN: 'Y', RAW_MAT_STR: ""};

      this.dsGrdMonth = [];
      this.dsGrdDetail = [];
      this.modelMaster.COMPANY_PK = this.dataList.lstCompany.length>0 ? this.dataList.lstCompany[0].CODEKEY : "";
      this.modelMaster.CCY = this.dataList.lstCCY.length > 0 ? this.dataList.lstCCY[0].CODE : "";
      this.onChangeField('COMPANY');


      this.DSO_LG_2020020_POP01_2('select');
    },
    onClickButton(obj){
      switch(obj){
        case 'btnSearch':
          this.DSO_LG_2020020_POP01_1('select');
          break;
        case 'btnAddNew':
          this.resetInputData();
          break;
        case 'btnSave':
          if(this.onSaveValidate()){
            if(this.modelMaster.PK == ""){
              this.modelMaster._rowstatus = "INSERT";
						}else{
              this.modelMaster._rowstatus = "UPDATE";
            }
            
            this.DSO_LG_2020020_POP01_1('update');
          }
          break;
        case 'btnDelete':
          this.$refs.refDeleteMasterConfirm.dialogIsShow = true;
          
          break;
        case 'btnSaveMonth':
          if(this.onSaveValidate()){
            if(this.modelMaster.PK == ""){
              this.modelMaster._rowstatus = "INSERT" ;
              this.DSO_LG_2020020_POP01_1('update');
						}else{
              this.DSO_LG_2020020_POP01_2('update');
            }
          }
          break;
        case 'btnSaveDetail':
          if(this.onSaveValidate()){
            if(this.modelMaster.PK == ""){
              this.modelMaster._rowstatus = "INSERT" ;
              this.DSO_LG_2020020_POP01_1('update');
						}else{
              this.DSO_LG_2020020_POP01_3('update');
            }
          }
          break;
        case 'btnSetQtyPlan':
          var arrRowSelected =  this.$refs.refGrdMonth.instance.getSelectedRowsData();
          if(arrRowSelected.length>0){
            for(var i = 0; i < arrRowSelected.length; i++){
              if(this._hasValue(arrRowSelected[i].BPG_PLAN_D_PK)){
                var arrIdx = this.dsGrdMonth.findIndex(e => e.BPG_PLAN_D_PK == arrRowSelected[i].BPG_PLAN_D_PK);
                this.dsGrdMonth[arrIdx].PLAN_QTY = this.setMonthQty;
                this.dsGrdMonth[arrIdx]._rowstatus = (this.dsGrdMonth[arrIdx]._rowstatus != "INSERT" ? "UPDATE" : this.dsGrdMonth[arrIdx]._rowstatus);
              }else{
                var arrIdx = this.dsGrdMonth.findIndex(e => e.RowID == arrRowSelected[i].RowID);
                this.dsGrdMonth[arrIdx].PLAN_QTY = this.setMonthQty;
              }
            }
          }else{
            for(var i = 0; i < this.dsGrdMonth.length; i++){
              this.dsGrdMonth[i].PLAN_QTY = this.setMonthQty;
              this.dsGrdMonth[i]._rowstatus = (this.dsGrdMonth[i]._rowstatus != "INSERT" ? "UPDATE" : this.dsGrdMonth[i]._rowstatus);
            }
          }
          this.$refs.refGrdMonth.instance.refresh();
          break;
      }
    },
    onDelete(){
      if(this._hasValue(this.modelMaster.PK)){
        this.modelMaster._rowstatus = "DELETE";
        this.DSO_LG_2020020_POP01_1('update');
      }
    },
    onSearch(_masterPK, _year){
      this.modelMaster.PK = _masterPK;
      this.modelMaster.YEAR = _year;
      this.DSO_LG_2020020_POP01_1('select');
      this.DSO_LG_2020020_POP01_2('select');
      this.DSO_LG_2020020_POP01_3('select');
    },
    onClearItem(){
      this.modelMaster.ITEM_PK = "";
      this.modelMaster.ITEM_NM = "";
    },
    onClickLabel(obj){
      switch(obj){
        case 'ITEM':
          this.$refs.refItemDialog.dataList.lstCCY = [...this.dataList.lstCCY];
          this.$refs.refItemDialog.gw_CCY.value = this.modelMaster.CCY;
          this.$refs.refItemDialog.gw_CCY.disabled = true;
          this.$refs.refItemDialog.dialogIsShow = true;
          break;
      }
    },
    onChangeField(obj){
      switch(obj){
        case 'COMPANY':
          this.LG_LST_2020020(["FACTORY",this.modelMaster.COMPANY_PK, this.user.PK]);
          break;
      }
    },
    callBackItem(item){
      if(item){
        this.modelMaster.ITEM_NM = item.ITEM_CODE+" - "+item.ITEM_NAME;
        this.modelMaster.ITEM_PK = item.PK;
        this.modelMaster.U_PRICE = item.UNIT_PRICE;
        this.modelMaster.UOM = item.UOM;
        this.DSO_LG_2020020_POP01_3('select','LOAD_MAT');
      }
    },
    callBackData(_msg) {
      this.$emit("callBackData", _msg);
      this.dialogIsShow = false;
    },
    onSaveValidate(){
      if(!this._hasValue(this.modelMaster.COMPANY_PK)){
        this.showNotification("warning", "Information", this.$t('msg_pls_check_again_company'));
        return false;
      }else if(!this._hasValue(this.modelMaster.FACTORY_PK)){
        this.showNotification("warning", "Information", this.$t('msg_pls_check_again_factory'));
        return false;
      }else if(!this._hasValue(this.modelMaster.INTERNAL_TRANS)){
        this.showNotification("warning", "Information", this.$t('msg_pls_check_again_interna_transaction'));
        return false;
      }else if(!this._hasValue(this.modelMaster.ITEM_PK)){
        this.showNotification("warning", "Information", this.$t('msg_pls_check_again_item'));
        return false;
      }
      return true;
    },
    initNewRow(e) {
      e.data._rowstatus = "INSERT";
    },

    rowInserted(e) {
      this.dsGrdMonth.unshift(e.data);
      this.dsGrdMonth.pop();
    },

    checkUpdated(e) {
      if (!e.cancel) {
        if (e.data._rowstatus !== "INSERT") {
          e.data._rowstatus = "UPDATE";
        }
      }
    },
    onCellPrepared(e) {
      if (e.rowType == "data" && e.column.dataField == "PLAN_QTY") {
        e.cellElement.style.backgroundColor = "#F9FBE7";
      }
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
      }
    },
    onCellPreparedDetail(e) {
      if (e.rowType == "data" && e.column.dataField == "MAT_WEIGHT") {
        e.cellElement.style.backgroundColor = "#F9FBE7";
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
        case 'COMPANY':
          this.dataList.lstCompany = await this._dsoCall(dso, 'select', false);
          this.modelMaster.COMPANY_PK = this.dataList.lstCompany.length>0 ? this.dataList.lstCompany[0].CODEKEY : "";
          this.onChangeField('COMPANY');
          break;
        case 'FACTORY':
          this.dataList.lstFactory = await this._dsoCall(dso, 'select', false);
          this.modelMaster.FACTORY_PK = this.dataList.lstFactory.length>0 ? this.dataList.lstFactory[0].CODEKEY : "";
          break;
      }
    },
    /*NOTE: */
		async DSO_LG_2020020_POP01_3(action = 'update', option = 'LOAD_PLAN') {
      const dso = {
        type: 'grid',
        selpro: 'LG_SEL_2020020_POP01_3',
        updpro: "LG_UPD_2020020_POP01_3",
        para: [option, this.modelMaster.PK, this.modelMaster.ITEM_PK],
        elname: ["_rowstatus", "PK", "TLG_BPG_PLAN_M_PK", "MAT_PK", "MAT_CODE", "MAT_NM",  "MAT_WEIGHT", "DESCRIPTION"],
        data: this.dsGrdDetail
      }
      var result = await this._dsoCall(dso, action, false);
      if(result){
        if(action != 'update'){
          for(var i =0; i<result.length; i++){
            if(!this._hasValue(result[i].PK)){
              result[i]._rowstatus = "INSERT";
              result[i].RowID = this._uniqueID();
            }
          }
        }else{
          this.isModified = true;
        }
        
        this.dsGrdDetail =  [...result];
      }
    },
    /*NOTE: */
		async DSO_LG_2020020_POP01_2(action = 'update') {
      const dso = {
        type: 'grid',
        selpro: 'LG_SEL_2020020_POP01_2',
        updpro: "LG_UPD_2020020_POP01_2",
        para: [this.modelMaster.PK, this.modelMaster.YEAR],
        elname: ["_rowstatus", "BPG_PLAN_M_PK", "BPG_PLAN_D_PK", "YYYYMM",  "MONTH_NM", "PLAN_QTY"],
        data: this.dsGrdMonth
      }
      var result = await this._dsoCall(dso, action, false);
      if(result){
        if(action != 'update'){
          for(var i =0; i<result.length; i++){
            if(!this._hasValue(result[i].BPG_PLAN_D_PK)){
              result[i]._rowstatus = "INSERT";
              result[i].RowID = this._uniqueID();
            }
          }
        }else{
          this.isModified = true;
        }
        this.dsGrdMonth = [...result];
      }
    },
    async DSO_LG_2020020_POP01_1(action= 'update'){
      const dso = {
        type: "control",
        selpro: "LG_SEL_2020020_POP01_1",
        updpro: "LG_UPD_2020020_POP01_1",
        para: [this.modelMaster.PK],
        elname: ["_rowstatus", "PK", "YEAR", "COMPANY_PK",  "FACTORY_PK", "INTERNAL_TRANS", "ITEM_PK", 
                  "U_PRICE", "UOM", "RAW_MAT_STR", "DESCRIPTION", "USE_YN", "START_DT", "END_DT", "CCY"],
        data: this.modelMaster
      };
      const row = await this._dsoCall(dso, action, false);
      
      if (row) {
        if(this.modelMaster._rowstatus == "DELETE"){
          this.resetInputData();
        }else{
          this.modelMaster = { ...row };
          if(action == 'update'){
            for(var i = 0; i < this.dsGrdMonth.length; i++){
              this.dsGrdMonth[i].BPG_PLAN_M_PK = this.modelMaster.PK;
            }

            for(var i = 0; i < this.dsGrdDetail.length; i++){
              this.dsGrdDetail[i].TLG_BPG_PLAN_M_PK = this.modelMaster.PK;
            }
            this.isModified = true;
            this.DSO_LG_2020020_POP01_2();
            this.DSO_LG_2020020_POP01_3();
          }
        }
      }
    },
  }
}
</script>
