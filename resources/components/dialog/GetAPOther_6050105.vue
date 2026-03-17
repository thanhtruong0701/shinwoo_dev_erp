<template>
  <div>
    <v-dialog id="get-apother-accrued-dialog" max-width="1200" v-model="dialogIsShow">
        <v-card>
           <v-card-title class="headline primary-gradient white--text py-2">
            <span>{{ $t('get a/p other accrued','common') }}</span>
            <v-spacer></v-spacer>
            <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
          </v-card-title>
          <v-card-text class="pa-0">
            <v-container>
              <v-row dense align="start" justify="center">
                <v-col md="2">
                  <v-text-field
                    dense
                    hide-details
                    :label="$t('voucher_no')"
                    v-model="txtVoucherNo"
                  ></v-text-field>
                </v-col>
                <v-col md="1" cols="12" class="py-1">
                    <datePicker :label="$t('fromdate')" :defaultType="'startOfMonth'" @returnValue="fromDate = $event">
                    </datePicker>
                </v-col>
                <v-col md="1" cols="12" class="py-1">
                    <datePicker :label="$t('to_date')" @returnValue="toDate = $event">
                    </datePicker>
                </v-col>
                <v-col md="2" cols="12" class="py-1">
                  <v-text-field
                    clearable
                    dense
                    hide-details
                    :label="$t('vendor')"
                    @dblclick="openPartnerDialog()"
                    v-model="txtVendor_NM"
                  ></v-text-field>
                  <v-text-field
                    clearable
                    dense
                    hide-details
                    v-show="false"
                    v-model="txtVendor_PK"
                  ></v-text-field>
                </v-col>
                <v-col md="1" cols="12" class="py-1">
                    <v-checkbox dense hide-details class="my-1" :label="$t('checkall')" true-value="Y" false-value="N" v-model="chkAuto" @change="onCheckALL"></v-checkbox>
                </v-col>
                <v-col md="2" class="pt-0" align="right">
                  <v-select v-model="lstVatList" :label="$t('vatlist')" :items="vatList" item-value="CODE" item-text="NAME" 
                          dense cache-items hide-details outlined />
                </v-col>
                <v-col md="1" cols="12" class="py-1" >
                    <v-checkbox dense hide-details class="my-1" :label="$t('checkuser')" true-value="Y" false-value="N" v-model="chkUser" @change="onCheckALL"></v-checkbox>
                </v-col>
                <v-col md="2" cols="12" class="py-1" align="center">
                  <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                          <v-btn icon tile color="error" @click="onClickButton('btnSearch')" >
                              <v-icon v-on="on">mdi-magnify</v-icon>
                          </v-btn>
                      </template>
                      <span>{{ $t('search', 'common') }}</span>
                  </v-tooltip> 
                </v-col>
              </v-row>
              <v-row dense align="start" justify="center">
                <v-col cols="12"  class="pt-0">
                  <DxDataGrid column-resizing-mode="widget" ref="grdMasterItem" 
                    :allow-column-resizing="true" 
                    :column-auto-width="$vuetify.breakpoint.smAndDown" 
                    :data-source="MasterItem" 
                    :height="limitHeightGrd1"  
                    :no-data-text="$t('no_data', 'common')"
                    :show-borders="true" 
                    :show-column-lines="true" 
                    :show-row-lines="true" 
                    :onSelectionChanged ="onSelectionMaster"
                    :onRowDblClick="onRowDblClickGrd1">
                    <DxColumn data-field="PK"                 :allow-editing="false"  dataType="PK" width="0"/>
                    <DxColumn data-field="VOUCHERNO"          :caption="$t('voucher_no')"        dataType="string" :allow-editing="false"  />
                    <DxColumn data-field="TR_DATE"            :caption="$t('tr_date')"           dataType="date"   format="dd-MM-yyyy" :allow-editing="false"  />
                    <DxColumn data-field="SERIAL_NO"          :caption="$t('serial_no')"         dataType="string" :allow-editing="false" />
                    <DxColumn data-field="INVOICE_DATE"       :caption="$t('invoice_date')"      dataType="date"   format="dd-MM-yyyy" :allow-editing="false"  />
                    <DxColumn data-field="INVOICE_NO"         :caption="$t('invoice_no')"        dataType="string" :allow-editing="false"  />
                    <DxColumn data-field="TR_CCY"             :caption="$t('tr_ccy')"            dataType="string" :allow-editing="false"  css-class="cell-align-center" />
                    <DxColumn data-field="MAT_DUE_DATE"       :caption="$t('mat_due_date')"      dataType="date"   format="dd-MM-yyyy" :allow-editing="false" />
                    <DxColumn data-field="VAT_DUE_DATE"       :caption="$t('vat_due_date')"      dataType="date"   format="dd-MM-yyyy" :allow-editing="false" />
                    <DxColumn data-field="AC_CD"              :caption="$t('ac_cd')"             dataType="string" :allow-editing="false" />
                    <DxColumn data-field="AC_NM"              :caption="$t('ac_nm')"             dataType="string" :allow-editing="false" />
                    <DxColumn data-field="TAC_ABACCTCODE_PK"  :caption="$t('tac_abacctcode_pk')" dataType="number" :allow-editing="false" width="0"/>
                    <DxColumn data-field="PARTNER_LNAME"      :caption="$t('vendor_name')"       dataType="string" :allow-editing="false" />
                    <DxEditing mode="cell" :allow-updating="true" startEditAction="dblClick" />
                    <DxSelection mode="multiple" v-if="multiSelectMode" />
                    <DxSelection mode="single" v-if="!multiSelectMode" />
                  </DxDataGrid>
                </v-col>
              </v-row>
              <v-row dense align="start" justify="center">
                <v-col md="2" class="pt-0">
                </v-col>
                <v-col md="2" class="pt-0">
                  <v-text-field
                    v-show="false"
                    v-model="txtTac_Crda_Other_PK"
                  ></v-text-field>
                </v-col>
                <v-col md="2" class="pt-0">
                   <v-text-field
                    dense
                    hide-details
                    :label="$t('total_trans')"
                    v-model="txtTotal_Trans"
                  ></v-text-field>
                </v-col>
                <v-col md="2" class="pt-0">
                     <v-text-field
                    dense
                    hide-details
                    :label="$t('total_book')"
                    v-model="txtTotal_Book"
                  ></v-text-field>
                </v-col>
                <v-col md="4" class="pt-0" align="right">
                    <v-btn class="btn ma-1" tile dark color="warning"  @click="onClickButton('btnGetItemStock')">
                      <v-icon>mdi-hand</v-icon>{{ $t('btn_select','common')}}
                    </v-btn>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                          <v-btn icon tile color="error" @click="onClickButton('btnSearch_Details')" >
                              <v-icon v-on="on">mdi-magnify</v-icon>
                          </v-btn>
                      </template>
                      <span>{{ $t('show_details', 'common') }}</span>
                  </v-tooltip>
                </v-col>
              </v-row>
              <v-row dense align="start" justify="center">
                <v-col cols="12"  class="pt-0">
                  <DxDataGrid 
                    column-resizing-mode="widget" 
                    ref="grdDetailsItem" 
                    :allow-column-resizing="true" 
                    :column-auto-width="$vuetify.breakpoint.smAndDown" 
                    :data-source="DetailsItem" 
                    :height="limitHeightGrd2" 
                    :no-data-text="$t('no_data', 'common')"
                    :show-borders="true" 
                    :show-column-lines="true" 
                    :show-row-lines="true" 
                    :onSelectionChanged ="onSelectionDetails"
                    :onRowDblClick="onRowDblClickGrd2" >
                    <DxColumn data-field="PK"                  dataType="PK" :allow-editing="false" width="0" />
                    <DxColumn data-field="VOUCHERNO"           :caption="$t('voucher_no')"           dataType="string" :allow-editing="false" width="80" />  
                    <DxColumn data-field="TCO_ITEM_PK"          :caption="$t('tco_item_pk')"         dataType="string" :allow-editing="false"  width="0"/>           
                    <DxColumn data-field="ITEM_CODE"            :caption="$t('item_code')"           dataType="string" :allow-editing="false" css-class="cell-align-left" width="80"/>
                    <DxColumn data-field="ITEM_NAME"            :caption="$t('item_name')"           dataType="string" :allow-editing="false"  width="120"/>
                    <DxColumn data-field="AP_UNIT"              :caption="$t('ap_unit')"             dataType="string" :allow-editing="false" css-class="cell-align-center" width="80"/>
                    <DxColumn data-field="AP_QTY"               :caption="$t('ap_qty')"              dataType="number" format="###,###,###.##" :allow-editing="false" css-class="cell-align-right" width="120" />
                    <DxColumn data-field="AP_UPRICE"            :caption="$t('ap_uprice')"           dataType="number" format="###,###,###.##"  :allow-editing="false" css-class="cell-align-right" width="120"/>
                    <DxColumn data-field="AP_TRFAMT"            :caption="$t('ap_trfamt')"           dataType="number" format="###,###,###.##" :allow-editing="false" css-class="cell-align-right" width="120"/>
                    <DxColumn data-field="AP_TRAMT"             :caption="$t('ap_tramt')"            dataType="number" format="###,###,###.##" :allow-editing="false" css-class="cell-align-right" width="120"/>
                    <DxColumn data-field="TAC_ABACCTCODE_PK"    :caption="$t('tac_abacctcode_pk')" dataType="string" :allow-editing="false" css-class="cell-align-left" width="0"/>
                    <DxColumn data-field="AC_CD"                :caption="$t('ac_cd')"             dataType="string"  :allow-editing="false" css-class="cell-align-left" width="80"/>
                    <DxColumn data-field="AC_NM"                :caption="$t('ac_nm')"             dataType="string" :allow-editing="false"  css-class="cell-align-left" width="200"/>
                    <DxColumn data-field="REMARK"               :caption="$t('remark')"              dataType="string" :allow-editing="false"  css-class="cell-align-left" width="100"/>
                    <DxColumn data-field="REMARK2"              :caption="$t('remark2')"             dataType="string" :allow-editing="false"  css-class="cell-align-left" width="200"/>
                    <DxColumn data-field="TIN_WAREHOUSE_PK"     :caption="$t('tin_warehouse_pk')"    dataType="string" :allow-editing="false"  css-class="cell-align-left" width="100" />
                    <DxColumn data-field="WH_NAME"              :caption="$t('wh_name')"             dataType="string" :allow-editing="false"  css-class="cell-align-left" width="0"/>
                    <DxColumn data-field="TAC_ABACCTCODE_M_PK"  :caption="$t('tac_abacctcode_m_pk')"   dataType="string" :allow-editing="false"  css-class="cell-align-left" width="100" />
                    <DxColumn data-field="AC_CD_M"              :caption="$t('ac_cd_m')"               dataType="string" :allow-editing="false"  css-class="cell-align-left" width="100"/>
                    <DxColumn data-field="AC_NM_M"              :caption="$t('ac_nm_m')"               dataType="string" :allow-editing="false"  css-class="cell-align-left" width="100"/>
                    <DxColumn data-field="TAC_ABPL_PK"          :caption="$t('tac_abpl_pk')"         dataType="string" :allow-editing="false"  css-class="cell-align-left" />
                    <DxColumn data-field="PL_CODE"              :caption="$t('pl_cd')"         dataType="string" :allow-editing="false"  css-class="cell-align-left" />
                    <DxColumn data-field="PL_NAME"              :caption="$t('plnm')"         dataType="string" :allow-editing="false"  css-class="cell-align-left" />
                    <DxColumn data-field="VAT_RATE"             :caption="$t('vat_rate')"            dataType="string" :allow-editing="false"  css-class="cell-align-left" />
                    <DxColumn data-field="TABLE_PK"             :caption="$t('table_pk')"    dataType="string" :allow-editing="false"  css-class="cell-align-left" width="0" />
                    <DxColumn data-field="TABLE_NM"             :caption="$t('table_name')"    dataType="string" :allow-editing="false"  css-class="cell-align-left" width="0" />
                    
                    <DxEditing mode="cell"              :allow-updating="true" startEditAction="dblClick" />
                    <DxSelection mode="multiple"  v-if="multiSelectMode" />
                    <DxSelection mode="single"    v-if="!multiSelectMode" />
                  </DxDataGrid>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
        </v-card>
      </v-dialog>
      <alert-dialog ref="alertDialog"></alert-dialog>
      <partner-dialog ref="partnerDialog" @callBackData="mappingPartner"></partner-dialog>
  </div>
</template>

<script>
import CellGridTextField from '@/components/table/CellGridTextField'
import AlertDialog from '@/components/dialog/AlertDialog'

export default {
  name: 'get-apother-dialog',
  props: ["dialogInfo","vendorPK","vendorNM"],
  components: { CellGridTextField, AlertDialog,
  partnerDialog:() => import("@/components/dialog/PartnerDialog"),
  datePicker:   () => import("@/components/control/DatePicker"),
  },
  data: () => ({
    dialogIsShow: false,
    dataList: {lstItemGrp: [], lstBOMLeaf: []},
    MasterItem: [],
    DetailsItem: [],
    txtVoucherNo:'',
    txtVendor_NM:'',
    txtVendor_PK:'',
    chkAuto:'N',
    vatList:[],
    lstVatList:'',
    chkUser:'Y',
    txtTotal_Trans:'',
    txtTotal_Book:'',
    btnSelect:'',
    fromDate:'',
    toDate:'',
    multiSelectMode: true,
    txtTac_Crda_Other_PK:'',
    selectedRowKeys_M: [],
    selectedRowKeys_D: []
  }),
  watch: {
    dialogIsShow(val) {
      if(val === false) {
        this.$emit('onCloseDialog')
      }else{
        this.txtVendor_NM = this.vendorNM;
        this.txtVendor_PK = this.vendorPK; 
      }
    },
    txtVendor_NM(val) {
      if (!val) {
        this.txtVendor_PK = '';
      }
    },
  },
  async created() {
    this.companyList = await this._getCompanyByUser(this.user.PK);
    this.selectedCompany =
      this.user.TCO_COMPANY_PK > 0
        ? this.user.TCO_COMPANY_PK
        : this.companyList[0].PK;
    const self = this;

    const commoncode = await this._getCommonCode2(
      [
        "APVATRATE",
      ],
      this.selectedCompany
    );
    this.vatList = commoncode[0]; 
  },
  mounted(){
    
  },
  
  computed: {
    user() { return this.$store.getters["auth/user"] },
    limitHeightGrd1() { return 200 },
    limitHeightGrd2() { return 200 },
  },
  methods: {
    onClickButton(obj){
      switch(obj){
        case 'btnSearch':
          this.$refs.grdMasterItem.instance.deselectAll();
          this.searchMaster([ this.user.TCO_COMPANY_PK, 
                              this.fromDate,
                              this.toDate,
                              this.txtVoucherNo,
                              this.txtVendor_PK,
                              this.lstVatList,
                              this.user.PK]);
        break;
        case 'btnSearch_Details':
        this.$refs.grdDetailsItem.instance.deselectAll();
        
        this.txtTac_Crda_Other_PK = "";
        for (let i = 0; i < this.selectedRowKeys_M.length; i++) 
        {
          
          this.txtTac_Crda_Other_PK = this.selectedRowKeys_M[i].PK + '-'+ this.txtTac_Crda_Other_PK; 
        }	 
        
        this.searchDetails([    this.lstVatList,
                                this.txtTac_Crda_Other_PK
                            ]);
        break;  
        case 'btnSelectItemStock':
            console.log();
            var arrRowSelected =  this.$refs.grdMasterItem.instance.getSelectedRowsData();
            for(let i = 0; i < arrRowSelected.length; i++){
              let rowIdxGrd1 = this.getPositionRow('GRID_SEARCH', arrRowSelected[i]);
              this.DetailsItem.unshift(this.objRowSelected(arrRowSelected[i]));
              this.setColorRow(true, rowIdxGrd1);
            }
          break;
        case 'btnGetItemStock':
          this.callBackData(this.selectedRowKeys_D);
          break;
        case 'btnRemoveItemStock':
          var arrRowSelected =  this.$refs.grdDetailsItem.instance.getSelectedRowsData();
          for(let i = 0; i < arrRowSelected.length; i++){
              let rowIdxGrd1 = this.getPositionRow('GRID_SEARCH', arrRowSelected[i]);
              //let rowIdxGrd2 = this.getPositionRow('GRID_SELECTED', arrRowSelected[i]);
              this.DetailsItem.unshift(this.objRowSelected(arrRowSelected[i]));
              this.setColorRow(true, rowIdxGrd1);
            }
          break;
      }
    },
    onRowDblClickGrd1(_event){
     /* if(!this.isExists(_event.data)){
        this.DetailsItem.unshift(this.objRowSelected(_event.data));
        this.setColorRow(true, _event.dataIndex);
      }*/
    },
    onRowDblClickGrd2(_event){
      let rowSelected = _event.data;
      let rowIdxGrd1 = this.getPositionRow('GRID_SEARCH', rowSelected);
      if(rowIdxGrd1!=-1){
        this.setColorRow(false, rowIdxGrd1);
      }
      this.DetailsItem.splice(_event.dataIndex,1);
    },
    getPositionRow(_Grid, _data){
      var rowIdx = -1;
      if(_Grid == "GRID_SEARCH"){
        rowIdx = this.$refs.grdMasterItem.instance.getRowIndexByKey(_data);
      }else if(_Grid == "GRID_SELECTED"){
        rowIdx = this.$refs.grdDetailsItem.instance.getRowIndexByKey(_data);
      }
      return rowIdx;
    },
    objRowSelected(rowData){
      let rowSelected = {};
      let lstColumn = Object.keys(rowData);
      for(let i = 0; i< lstColumn.length; i++){
        rowSelected[lstColumn[i]] = rowData[lstColumn[i]];
      }
      return rowSelected;
    },
    isExists(rowSelected){
      let rowIdx = this.getPositionRow('GRID_SELECTED', rowSelected);
      if(rowIdx != -1){
        this.$refs.alertDialog.showAlert("error", "Error", "DUPLICATE_DATA");
        return true;
      }
      return false;
    },
    setColorRow(isMarked, idx) {
      if(isMarked){
        this.$refs.grdMasterItem.instance.getRowElement(idx)[0].style.backgroundColor = "#ff5252";
      }else{
        this.$refs.grdMasterItem.instance.getRowElement(idx)[0].style.backgroundColor = "";
      }
    },
    async searchMaster(_param) {
      const dso = {
        type: 'grid',
        selpro: 'AC_SEL_6050105_CRDA_OTHER_M',
        para: _param
      }
      this.MasterItem = await this._dsoCall(dso, 'select', false);
    },
   
    hasValueContain(value){
      if(!this._hasValue(value)){
        return "";
      }
      return value;
    },
    openPartnerDialog() {
      this.$refs.partnerDialog.dialogIsShow = true;
    },
    mappingPartner(item) {
        this.txtVendor_NM = item.PARTNER_ID + " - " + item.PARTNER_NAME;
        this.txtVendor_PK = item.PK;
    },
    onCheckALL(){

    },
    onCheckUser()
    {

    },
    callBackData(_data) {
      this.$emit("callBackData", _data);
      this.dialogIsShow = false;
    },
    onSelectionMaster({selectedRowKeys})  
    {
        this.selectedRowKeys_M = selectedRowKeys;
        this.onClickButton('btnSearch_Details');
    },
    onSelectionDetails({selectedRowKeys})  
    {
        this.selectedRowKeys_D = selectedRowKeys;
    },
    async searchDetails(_param) {  
			const dso = {
        type: 'list',
        selpro: 'AC_SEL_6050105_CRDA_OTHER_D',
        para: _param
      }
      this.DetailsItem = await this._dsoCall(dso, 'select', false);
      this.calculateCellExtPrice();
    },
    calculateCellExtPrice() {
          
           this.txtTotal_Trans = 0
           this.txtTotal_Book  = 0
          for(let i = 0; i < this.DetailsItem.length; i++){
                this.txtTotal_Trans = this.DetailsItem[i].AP_TRFAMT + this.txtTotal_Trans
                this.txtTotal_Book  = this.DetailsItem[i].AP_TRAMT + this.txtTotal_Book   
              }
        this.txtTotal_Trans = this._formatNumber(this.txtTotal_Trans,2);
        this.txtTotal_Book  = this._formatNumber(this.txtTotal_Book,0);
    },
  }
}
</script>

<style>
  .btn{
    min-width: 100px;
    min-height: 30px;
    max-width: 100px;
    max-height: 30px;
  }
</style>
