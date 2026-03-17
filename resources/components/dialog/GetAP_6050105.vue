<template>
  <div>
    <v-dialog id="get-ap-accrued-dialog" max-width="1200" v-model="dialogIsShow">
        <v-card>
           <v-card-title class="headline primary-gradient white--text py-2">
            <span>{{ $t('get a/p accrued','common') }}</span>
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
                  <v-text-field
                    dense
                    hide-details
                    :label="$t('seq')"
                    v-model="txtSeq"
                  ></v-text-field>
                </v-col>
                <v-col md="2" cols="12" class="py-1">
                  <v-text-field
                    dense
                    hide-details
                    :label="$t('invoice_no')"
                    v-model="txtInvoiceNo"
                  ></v-text-field>
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
                    <DxColumn data-field="PK"                 :caption="$t('seq')"                     :allow-editing="false"  dataType="PK" width="0"/>
                    <DxColumn data-field="VOUCHERNO"          :caption="$t('voucher_no')"              dataType="string" :allow-editing="false"  width="80"/>
                    <DxColumn data-field="TCO_ITEM_PK"        :caption="$t('tco_item_pk')"             dataType="string" :allow-editing="false"  css-class="cell-align-left" width="0"/>
                    <DxColumn data-field="ITEM_CODE"          :caption="$t('item_code')"               dataType="string" :allow-editing="false"  width="80"/>
                    <DxColumn data-field="ITEM_NAME"          :caption="$t('item_name')"               dataType="string" :allow-editing="false"  width="80"/>
                    <DxColumn data-field="TAC_ABACCTCODE_PK"  :caption="$t('tac_abacctcode_pk')"       dataType="string" :allow-editing="false"  css-class="cell-align-left" width="0"/>
                    <DxColumn data-field="AC_CD"              :caption="$t('acc_code')"                dataType="string" :allow-editing="false"  width="80"/>
                    <DxColumn data-field="AC_NM"              :caption="$t('acc_name')"                dataType="string" :allow-editing="false"  width="80"/>
                    <DxColumn data-field="AP_UNIT"            :caption="$t('uom')"                     dataType="string" :allow-editing="false"  width="80"/>
                    <DxColumn data-field="AP_QTY"             :caption="$t('qty')"                     dataType="string" :allow-editing="false"  width="80"/>
                    <DxColumn data-field="AP_TRFAMT"          :caption="$t('net_trans_amt')"           dataType="number" format="###,###,###.##" :allow-editing="false" css-class="cell-align-right" width="120" />
                    <DxColumn data-field="AP_TRAMT"           :caption="$t('net_book_amt')"            dataType="number" format="###,###,###.##"  :allow-editing="false" css-class="cell-align-right" width="120"/>
                    <DxColumn data-field="REMARK"             :caption="$t('desc')"                    dataType="string" :allow-editing="false"  css-class="cell-align-left" width="100"/>
                    <DxColumn data-field="REMARK2"            :caption="$t('desc(local)')"             dataType="string" :allow-editing="false"  css-class="cell-align-left" width="200"/>
                    <DxColumn data-field="INVOICE_NO"         :caption="$t('invoice_no')"              dataType="string" :allow-editing="false"  width="80"/>
                    <DxColumn data-field="SERIAL_NO"          :caption="$t('serial_no')"               dataType="string" :allow-editing="false" width="80"/>
                    <DxColumn data-field="INVOICE_DATE"       :caption="$t('invoice_date')"            dataType="date"   format="dd-MM-yyyy" :allow-editing="false"  />
                    <DxColumn data-field="WH_ID"              :caption="$t('wh_id')"                   dataType="string" :allow-editing="false"  css-class="cell-align-left" width="50"/>
                    <DxColumn data-field="TAC_ABPL_PK"        :caption="$t('tac_abpl_pk')"             dataType="string" :allow-editing="false"  css-class="cell-align-left" width="0"/>
                    <DxColumn data-field="PL_CODE"            :caption="$t('pl_cd')"                   dataType="string" :allow-editing="false"  css-class="cell-align-left" width="80"/>
                    <DxColumn data-field="PL_NAME"            :caption="$t('plnm')"                    dataType="string" :allow-editing="false"  css-class="cell-align-left" width="80"/>
                    <DxColumn data-field="TABLE_PK"           :caption="$t('table_pk')"                dataType="string" :allow-editing="false"  css-class="cell-align-left" width="80"/>
                    <DxColumn data-field="TABLE_NM"           :caption="$t('table_nm')"                dataType="string" :allow-editing="false"  css-class="cell-align-left" width="80" />
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
                    <DxColumn data-field="PK"                 :caption="$t('seq')"                     :allow-editing="false"  dataType="PK" width="0"/>
                    <DxColumn data-field="VOUCHERNO"          :caption="$t('voucher_no')"              dataType="string" :allow-editing="false"  width="80"/>
                    <DxColumn data-field="TCO_ITEM_PK"        :caption="$t('tco_item_pk')"             dataType="string" :allow-editing="false"  css-class="cell-align-left" width="0"/>
                    <DxColumn data-field="ITEM_CODE"          :caption="$t('item_code')"               dataType="string" :allow-editing="false"  width="80"/>
                    <DxColumn data-field="ITEM_NAME"          :caption="$t('item_name')"               dataType="string" :allow-editing="false"  width="80"/>
                    <DxColumn data-field="TAC_ABACCTCODE_PK"  :caption="$t('tac_abacctcode_pk')"       dataType="string" :allow-editing="false"  css-class="cell-align-left" width="0"/>
                    <DxColumn data-field="AC_CD"              :caption="$t('acc_code')"                dataType="string" :allow-editing="false"  width="80"/>
                    <DxColumn data-field="AC_NM"              :caption="$t('acc_name')"                dataType="string" :allow-editing="false"  width="80"/>
                    <DxColumn data-field="AP_UNIT"            :caption="$t('uom')"                     dataType="string" :allow-editing="false"  width="80"/>
                    <DxColumn data-field="AP_QTY"             :caption="$t('qty')"                     dataType="string" :allow-editing="false"  width="80"/>
                    <DxColumn data-field="AP_TRFAMT"          :caption="$t('net_trans_amt')"           dataType="number" format="###,###,###.##" :allow-editing="false" css-class="cell-align-right" width="120" />
                    <DxColumn data-field="AP_TRAMT"           :caption="$t('net_book_amt')"            dataType="number" format="###,###,###.##"  :allow-editing="false" css-class="cell-align-right" width="120"/>
                    <DxColumn data-field="REMARK"             :caption="$t('desc')"                    dataType="string" :allow-editing="false"  css-class="cell-align-left" width="100"/>
                    <DxColumn data-field="REMARK2"            :caption="$t('desc(local)')"             dataType="string" :allow-editing="false"  css-class="cell-align-left" width="200"/>
                    <DxColumn data-field="INVOICE_NO"         :caption="$t('invoice_no')"              dataType="string" :allow-editing="false"  width="80"/>
                    <DxColumn data-field="SERIAL_NO"          :caption="$t('serial_no')"               dataType="string" :allow-editing="false" width="80"/>
                    <DxColumn data-field="INVOICE_DATE"       :caption="$t('invoice_date')"            dataType="date"   format="dd-MM-yyyy" :allow-editing="false"  />
                    <DxColumn data-field="WH_ID"              :caption="$t('wh_id')"                   dataType="string" :allow-editing="false"  css-class="cell-align-left" width="50"/>
                    <DxColumn data-field="TAC_ABPL_PK"        :caption="$t('tac_abpl_pk')"             dataType="string" :allow-editing="false"  css-class="cell-align-left" width="0"/>
                    <DxColumn data-field="PL_CODE"            :caption="$t('pl_cd')"                   dataType="string" :allow-editing="false"  css-class="cell-align-left" width="80"/>
                    <DxColumn data-field="PL_NAME"            :caption="$t('plnm')"                    dataType="string" :allow-editing="false"  css-class="cell-align-left" width="80"/>
                    <DxColumn data-field="TABLE_PK"           :caption="$t('table_pk')"                dataType="string" :allow-editing="false"  css-class="cell-align-left" width="80"/>
                    <DxColumn data-field="TABLE_NM"           :caption="$t('table_nm')"                dataType="string" :allow-editing="false"  css-class="cell-align-left" width="80" />
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
    vatList:[],
    lstVatList:'',
    txtTotal_Trans:'',
    txtTotal_Book:'',
    btnSelect:'',
    fromDate:'',
    toDate:'',
    txtInvoiceNo : '',
    txtSeq  : '',
    multiSelectMode: true,
    txtTac_Crda_Other_PK:'',
    selectedRowKeys_M: [],
    selectedRowKeys_D: [],
    selectChangedBySelectBox: false,
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
                              this.txtVoucherNo,
                              this.fromDate,
                              this.toDate,
                              this.txtVendor_PK,
                              this.txtSeq,
                              this.txtInvoiceNo,
                              this.user.PK]);
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
    onRowDblClickGrd1({data, rowIndex}) {
      /* this.DetailsItem.unshift({
        PK: data.PK
      })*/
      this.MasterItem.splice(rowIndex, 1)
      this.DetailsItem.unshift(data)
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
        selpro: 'AC_SEL_6050105_ALLO_GET_AP',
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
    onCheckUser()
    {

    },
    callBackData(_data) {
      this.$emit("callBackData", _data);
      this.dialogIsShow = false;
    },
    onSelectionMaster({selectedRowsData})  
    {
      this.DetailsItem = [...selectedRowsData]
      this.calculateCellExtPrice();
    },
    onSelectionDetails({selectedRowKeys})  
    {
        this.selectedRowKeys_D = selectedRowKeys;
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
