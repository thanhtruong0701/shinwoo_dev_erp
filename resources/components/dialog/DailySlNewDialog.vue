<template>
  <div>
    <v-dialog id="daily-sl-new-dialog" max-width="1400" v-model="dialogIsShow">
      <v-card>
        <v-card-title class="headline primary-gradient white--text py-2">
          <span>{{ $t("daily_sl_new", "common") }}</span>
          <v-spacer></v-spacer>
          <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
        </v-card-title>
        <v-container fluid class="pt-0">
          <v-row no-gutters>
            <v-col cols="12">
              <!-- Search Panel -->
              <v-row align="center" justify="space-between">
                <v-col cols="12">
                  <v-card outlined tile>
                    <v-container fluid class="pb-0">
                      <v-row dense align="center" justify="space-between">
                        <!-- Company -->
                        <v-col lg="3" sm="3" cols="12" class="pb-2">
                          <v-select cache-items clearable dense hide-details item-value="PK" item-text="TEXT" :label="$t('company', 'common')" :items="companyList" v-model="companyPK"></v-select>
                        </v-col>
                        <!-- Account Code -->
                        <v-col lg="3" sm="3" cols="12" class="pb-2">
                          <v-text-field dense hide-details :label="$t('acc_code', 'common')" v-model="accCode" @keypress.enter="search">
                            <template v-slot:append>
                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-icon v-on="on" :color="currentTheme" @click="$refs.accountDialog.dialogIsShow = true">mdi-window-restore</v-icon>
                                </template>
                                <span>{{ $t('get_acc_code', 'common') }}</span>
                              </v-tooltip>
                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-icon v-on="on" :color="currentTheme" @click="accCodePK = '', accCode = ''">mdi-eraser</v-icon>
                                </template>
                                <span>{{ $t('reset', 'common') }}</span>
                              </v-tooltip>
                            </template>
                          </v-text-field>
                        </v-col>
                        <!-- Language -->
                        <v-col lg="3" sm="3" cols="12" class="pb-2">
                          <v-text-field  dense hide-details :label="$t('sub_code')" @dblclick="openAccountDialog('S')" :placeholder="$t('doubleclick_to_get_data')" v-model="txtSubName" @keypress.enter="search">
                            <template v-slot:append>
                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-icon v-on="on" :color="currentTheme" @click="openAccountDialog('S')">mdi-window-restore</v-icon>
                                </template>
                                <span>{{ $t('show_sub_code') }}</span>
                              </v-tooltip>
                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-icon v-on="on" :color="currentTheme" @click="onClearSubCode">mdi-eraser</v-icon>
                                </template>
                                <span>{{ $t('reset') }}</span>
                              </v-tooltip>
                            </template>
                          </v-text-field>
                        </v-col>
                        <!-- Currency -->
                        <v-col lg="3" sm="3" cols="12" class="pb-2">
                          <v-text-field  dense hide-details :label="$t('m_code')" @dblclick="openAccountDialog('M')" :placeholder="$t('doubleclick_to_get_data')" v-model="txtMName" @keypress.enter="search">
                            <template v-slot:append>
                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-icon v-on="on" :color="currentTheme" @click="openAccountDialog('M')">mdi-window-restore</v-icon>
                                </template>
                                <span>{{ $t('show_m_code') }}</span>
                              </v-tooltip>
                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-icon v-on="on" :color="currentTheme" @click="onClearMCode">mdi-eraser</v-icon>
                                </template>
                                <span>{{ $t('reset') }}</span>
                              </v-tooltip>
                            </template>
                          </v-text-field>
                        </v-col>
                      </v-row>
                      <v-row dense align="center" justify="space-between">
                        <!-- Proposed From -->
                        <v-col lg="3" sm="3" cols="12" class="pb-sm-0 pb-2">
                          <date-picker :label="$t('approve_from', 'common')" :defaultType="'startOfMonth'" :inputValue="proposeFrom"  @returnValue="proposeFrom = $event"></date-picker>
                        </v-col>
                        <!-- Proposed To -->
                        <v-col lg="3" sm="3" cols="12" class="pb-sm-0 pb-2">
                          <date-picker :label="$t('approve_to', 'common')" :defaultType="'endOfMonth'" :inputValue="proposeTo" @returnValue="proposeTo = $event"></date-picker>
                        </v-col>
                        <!-- Report Option -->
                        <v-col lg="3" sm="3" cols="12" class="pb-sm-0 pb-2">
                          <v-select cache-items clearable dense hide-details item-value="CODE" item-text="NAME" :label="$t('report_option', 'common')" :items="reportOptionList" v-model="selectedReportOpt"></v-select>
                        </v-col>
                        <!-- Report Type -->
                        <v-col lg="3" sm="3" cols="12">
                          <v-select cache-items clearable dense hide-details item-value="CODE" item-text="NAME" :label="$t('report_type', 'common')" :items="reportTypeList" v-model="selectedReportType"></v-select>
                        </v-col>
                      </v-row>
                      <v-row dense align="center" justify="space-between">
                        <!-- Slip Status -->
                        <v-col lg="2" sm="2" cols="12">
                          <v-radio-group dense hide-details class="ma-0 pt-0" :row="$vuetify.breakpoint.xsOnly" :label="`${$t('slip_status', 'common')}:`" v-model="slipStatus" @change="search">
                            <v-radio :label="$t('confirmed', 'common')" value="2"></v-radio>
                            <v-radio :label="$t('approved', 'common')" value="0"></v-radio>
                          </v-radio-group>
                        </v-col>
                        <!-- Inquiry Type -->
                        <v-col lg="2" sm="2" cols="12">
                          <v-radio-group dense hide-details class="ma-0 pt-0" :row="$vuetify.breakpoint.xsOnly" :label="`${$t('inquiry_type', 'common')}:`" v-model="inquiryType" @change="search">
                            <v-radio :label="$t('dates', 'common')" value="dates"></v-radio>
                            <v-radio :label="$t('vouchers', 'common')" value="vouchers"></v-radio>
                          </v-radio-group>
                        </v-col>
                        <!-- Amount Type -->
                        <v-col lg="2" sm="2" cols="12">
                          <v-radio-group dense hide-details class="ma-0 pt-0" :row="$vuetify.breakpoint.xsOnly" :label="`${$t('amt_type', 'common')}:`" v-model="amtType">
                            <v-radio :label="$t('trans_books', 'common')" value="trans_books"></v-radio>
                            <v-radio :label="$t('books', 'common')" value="books"></v-radio>
                          </v-radio-group>
                        </v-col>
                        <v-col lg="3" sm="3" cols="12" class="text-sm-right text-center">
                          <v-select cache-items clearable dense hide-details item-value="CODE" item-text="NAME" :label="$t('language', 'common')" :items="selectedLanguage" v-model="selectedLang"></v-select>
                          <!-- Search -->
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                              <v-btn icon tile v-on="on" :color="currentTheme" :disabled="isProcessing" @click="search">
                                <v-icon>mdi-magnify</v-icon>
                              </v-btn>
                            </template>
                            <span>{{ $t("search") }}</span>
                          </v-tooltip>
                        </v-col>
                        
                        <v-col lg="3" sm="3" cols="12" class="text-sm-right text-center">
                          <v-select cache-items clearable dense hide-details item-value="CODE" item-text="NAME" :label="$t('currency', 'common')" :items="currencyList" v-model="selectedCurrency"></v-select>
                          <!-- Print Report -->
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                              <v-btn icon tile v-on="on" :color="currentTheme" :disabled="isProcessing">
                                <v-icon>mdi-printer</v-icon>
                              </v-btn>
                            </template>
                            <span>{{ $t("print_report") }}</span>
                          </v-tooltip>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card>
                </v-col>
              </v-row>
              <!-- Table -->
              <v-row dense align="center" justify="center">
                <!-- Dates & Vouchers -->
                <v-col cols="12" class="py-0">
                  <v-card outlined tile v-resize="onResize">
                    <DxDataGrid column-resizing-mode="widget" ref="slDateVoucherGrid"
                      :allow-column-resizing="true" :column-auto-width="$vuetify.breakpoint.smAndDown" 
                      :columns="slDateVoucherHeaders" :data-source="slDateVoucherDataList" :height="limitHeight/2" 
                      :loadPanel="{ enabled: true, text: $t('is_loading', 'common') }" 
                      :onRowDblClick="onRowDblClick" :selection="{ mode: 'single' }" 
                      :show-borders="true" :show-column-lines="true" :show-row-lines="true">
                        <DxPaging :page-size="slDateVoucherDataList.length" v-if="slDateVoucherDataList.length < 500" />
                        <DxScrolling mode="infinite" v-else />
                    </DxDataGrid>
                  </v-card>
                </v-col>
                <!-- Sum -->
                <v-col cols="12" class="pb-0">
                  <v-card outlined tile v-resize="onResize">
                    <DxDataGrid column-resizing-mode="widget" ref="slSumGrid"
                      :allow-column-resizing="true" :column-auto-width="$vuetify.breakpoint.smAndDown" 
                      :columns="slSumHeaders" :data-source="slSumDataList" :height="limitHeight/2"
                      :loadPanel="{ enabled: true, text: $t('is_loading', 'common') }"
                      :selection="{ mode: 'single' }" :show-borders="true" :show-column-lines="true" :show-row-lines="true">
                        <DxPaging :page-size="slSumDataList.length" v-if="slSumDataList.length < 500" />
                        <DxScrolling mode="infinite" v-else />
                    </DxDataGrid>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>

    <account-dialog ref="accountDialog" @returnAccountInfo="handleReturnedAccCode" />
    <account-slip-dialog ref="accountSlipDialog" :seqArray="seqArray" :currentSeq="currentSeq" />
    <account-get-s-p-dialog  
      ref="accountDialog1"
      @returnAccountInfo="getAccCodeItem1" :TCO_COMPANY_PK= this.selectedCompany :sel_pro="storeProcedure"
    ></account-get-s-p-dialog>
    <account-get-s-p-dialog  
      ref="accountDialog2"
      @returnAccountInfo="getAccCodeItem2" :TCO_COMPANY_PK= this.selectedCompany :sel_pro="storeProcedure"
    ></account-get-s-p-dialog>
  </div>
</template>
<script>
export default {
  name: 'daily-sl-new-dialog',
  props: ["companyPK", "accountItem", "fromDate", "toDate", "status", "ccy","accountMCode","accountSubCode","typeAccount"],

  components: {
    accountGetSPDialog: () => import("@/components/dialog/AccountGetSPDialog"),
    DatePicker: () => import("@/components/control/DatePicker"),
    AccountDialog: () => import("@/components/dialog/AccountDialog"),
    AccountSlipDialog: () => import("@/components/dialog/AccountSlipDialog")
  },
  
  data:() => ({
    dialogIsShow: false,
    companyList: [],
    selectedCompany: null,
    accCodePK: '',
    accCode: '',
    selectedLang: 'ENG',
    proposeFrom: '',
    proposeTo: '',
    inquiryType: 'vouchers',
    reportOptionList: [],
    selectedReportOpt: '',
    currencyList: [],
    selectedCurrency: '',
    amtType: 'books',
    reportTypeList: [],
    selectedReportType: '',
    slipStatus: '',
    bookCcyList: [],
    selectedLanguage:[],
    slDateVoucherDataList: [],
    slSumDataList: [],
    seqArray: [],
    currentSeq: null,
    txtSubName:"",
    txtSubCode:"",
    txtMName:"",
    txtMCode:"",
    storeProcedure:"",
    accountCode: [],
  }),

  computed: {
    user() { return this.$store.getters["auth/user"] },
    limitHeight() { return this.windowHeight*0.5 },
    slDateVoucherHeaders() {
      if(this.dialogIsShow === true) {
        if(this.inquiryType === 'dates') {
          if(this.amtType === 'trans_books') {
            return [
              { dataField: "FDATE", caption: this.$t('f_date', 'common'), dataType: "date", format: this.curLang.DATE_FORMAT },
              { dataField: "CCY", caption: this.$t('ccy', 'common') },
              { dataField: "OPENINGBALANCE", caption: this.$t('op_balance', 'common'), cssClass: "cell-align-right" },
              { 
                caption: this.$t('trans', 'common'), alignment: 'center',
                columns: [
                  { dataField: "DEBITTRANSAMOUNT", caption: this.$t('debit', 'common'), cssClass: "cell-align-right" },
                  { dataField: "CREDITTRANSAMOUNT", caption: this.$t('credit', 'common'), cssClass: "cell-align-right" }
                ]
              },
              {
                caption: this.$t('books', 'common'), alignment: 'center',
                columns: [
                  { dataField: "DEBITBOOKAMOUNT", caption: this.$t('debit', 'common'), cssClass: "cell-align-right" },
                  { dataField: "CREDITBOOKAMOUNT", caption: this.$t('credit', 'common'), cssClass: "cell-align-right" }
                ]
              },
              { dataField: "CLOSINGBALANCE", caption: this.$t('cfm_balance', 'common'), cssClass: "cell-align-right" }
            ]
          } else {
            return [
              { dataField: "FDATE", caption: this.$t('f_date', 'common'), dataType: "date", format: this.curLang.DATE_FORMAT },
              { dataField: "CCY", caption: this.$t('ccy', 'common') },
              { dataField: "OPENINGBALANCE", caption: this.$t('op_balance', 'common'), cssClass: "cell-align-right" },
              {
                caption: this.$t('books', 'common'), alignment: 'center',
                columns: [
                  { dataField: "DEBITBOOKAMOUNT", caption: this.$t('debit', 'common'), cssClass: "cell-align-right" },
                  { dataField: "CREDITBOOKAMOUNT", caption: this.$t('credit', 'common'), cssClass: "cell-align-right" }
                ]
              },
              { dataField: "CLOSINGBALANCE", caption: this.$t('cfm_balance', 'common'), cssClass: "cell-align-right" }
            ]
          }
        } else {
          if(this.amtType === 'trans_books') {
            return [
              { dataField: "PK", caption: this.$t('seq', 'common') },
              { dataField: "VOUCHERNO", caption: this.$t('voucher_no', 'common') },
              { dataField: "TR_DATE", caption: this.$t('proposed_date', 'common'), dataType: "date", format: this.curLang.DATE_FORMAT },
              { dataField: "USER_ID", caption: this.$t('proposed_by', 'common') },
              { dataField: "CCY", caption: this.$t('ccy', 'common') },
              { dataField: "OPENINGBALANCE", caption: this.$t('op_balance', 'common'), cssClass: "cell-align-right" },
              { 
                caption: this.$t('trans', 'common'), alignment: 'center',
                columns: [
                  { dataField: "DEBITTRANSAMOUNT", caption: this.$t('debit', 'common'), cssClass: "cell-align-right" },
                  { dataField: "CREDITTRANSAMOUNT", caption: this.$t('credit', 'common'), cssClass: "cell-align-right" }
                ]
              },
              {
                caption: this.$t('books', 'common'), alignment: 'center',
                columns: [
                  { dataField: "DEBITBOOKAMOUNT", caption: this.$t('debit', 'common'), cssClass: "cell-align-right" },
                  { dataField: "CREDITBOOKAMOUNT", caption: this.$t('credit', 'common'), cssClass: "cell-align-right" }
                ]
              },
              { dataField: "CLOSINGBALANCE", caption: this.$t('cfm_balance', 'common'), cssClass: "cell-align-right" },
              { dataField: "CUSTOMER", caption: this.$t('customer_name', 'common') },
              {
                caption: this.$t('description', 'common'), alignment: 'center',
                columns: [
                  { dataField: "REMARK", caption: this.$t('foreign', 'common') },
                  { dataField: "REMARK2", caption: this.$t('local', 'common') }
                ]
              }
            ]
          } else {
            return [
              { dataField: "PK", caption: this.$t('seq', 'common') },
              { dataField: "VOUCHERNO", caption: this.$t('voucher_no', 'common') },
              { dataField: "TR_DATE", caption: this.$t('proposed_date', 'common'), dataType: "date", format: this.curLang.DATE_FORMAT },
              { dataField: "USER_ID", caption: this.$t('proposed_by', 'common') },
              { dataField: "CCY", caption: this.$t('ccy', 'common') },
              { dataField: "OPENINGBALANCE", caption: this.$t('op_balance', 'common'), cssClass: "cell-align-right" },
              {
                caption: this.$t('books', 'common'), alignment: 'center',
                columns: [
                  { dataField: "DEBITBOOKAMOUNT", caption: this.$t('debit', 'common'), cssClass: "cell-align-right" },
                  { dataField: "CREDITBOOKAMOUNT", caption: this.$t('credit', 'common'), cssClass: "cell-align-right" }
                ]
              },
              { dataField: "CLOSINGBALANCE", caption: this.$t('cfm_balance', 'common'), cssClass: "cell-align-right" },
              { dataField: "CUSTOMER", caption: this.$t('customer_name', 'common') },
              {
                caption: this.$t('description', 'common'), alignment: 'center',
                columns: [
                  { dataField: "REMARK", caption: this.$t('foreign', 'common') },
                  { dataField: "REMARK2", caption: this.$t('local', 'common') }
                ]
              }
            ]
          }
        }
      }
    },
    slSumHeaders() {
      if(this.dialogIsShow === true) {
        if(this.amtType === 'trans_books') {
          return [
            { dataField: "OPENINGBALANCE", caption: this.$t('op_balance', 'common'), cssClass: "cell-align-right" },
            { dataField: "CCY", caption: this.$t('ccy', 'common') },
            {
              caption: this.$t('trans', 'common'), alignment: 'center',
              columns: [
                { dataField: "DEBITTRANSAMOUNT", caption: this.$t('debit', 'common'), cssClass: "cell-align-right" },
                { dataField: "CREDITTRANSAMOUNT", caption: this.$t('credit', 'common'), cssClass: "cell-align-right" }
              ]
            },
            {
              caption: this.$t('books', 'common'), alignment: 'center',
              columns: [
                { dataField: "DEBITBOOKAMOUNT", caption: this.$t('debit', 'common'), cssClass: "cell-align-right" },
                { dataField: "CREDITBOOKAMOUNT", caption: this.$t('credit', 'common'), cssClass: "cell-align-right" }
              ]
            },
            { dataField: "CLOSINGBALANCE", caption: this.$t('cfm_balance', 'common'), cssClass: "cell-align-right" }
          ]
        } else {
          return [
            { dataField: "OPENINGBALANCE", caption: this.$t('op_balance', 'common'), cssClass: "cell-align-right" },
            { dataField: "CCY", caption: this.$t('ccy', 'common') },
            {
              caption: this.$t('books', 'common'), alignment: 'center',
              columns: [
                { dataField: "DEBITBOOKAMOUNT", caption: this.$t('debit', 'common'), cssClass: "cell-align-right" },
                { dataField: "CREDITBOOKAMOUNT", caption: this.$t('credit', 'common'), cssClass: "cell-align-right" }
              ]
            },
            { dataField: "CLOSINGBALANCE", caption: this.$t('cfm_balance', 'common'), cssClass: "cell-align-right" }
          ]
        }
      }
    }
  },

  watch: {
   _language(val) {
      this.selectedLang = val
    },
    async dialogIsShow(val) {
      if(val === true) {
        if(this.typeAccount !== '0' )
        {
          await this.getCodeAccount(this.accountItem.CODE, this.accountMCode.CODE, this.accountSubCode.CODE);
          this.selectedCompany = this.companyPK;
          this.accCodePK = this.accountCode.PK;
          this.accCode = `${this.accountItem.CODE} - ${this.accountItem.NAME}`;
          this.txtSubName = `${this.accountSubCode.CODE} - ${this.accountSubCode.NAME}`;
          this.txtMName = `${this.accountMCode.CODE} - ${this.accountMCode.NAME}`;
         
        }
        else
        {
          this.accCode = `${this.accountItem.CODE} - ${this.accountItem.NAME}`;
          this.selectedCompany = this.companyPK;
          this.accCodePK = this.accountItem.PK;
          this.txtSubName = "";
          this.txtMName = "";
        }

        if(this.ccy == "" || this.ccy == null ||this.ccy == undefined || this.ccy == "null") {
            this.selectedCurrency = "ALL";
          } else {
            this.selectedCurrency = this.ccy;
          }
        
        this.proposeFrom = this.fromDate;
        this.proposeTo = this.toDate;
        this.slipStatus = this.status;
        this.getListCodes();
        this.search();
      } else {
        this.slDateVoucherDataList = []
        this.slSumDataList = []
      }
    }
  },
  create()
  {
    this.getListCodes();
  },
  methods: {
    async getListCodes() {
      const dso_company_list = { type: 'list', selpro: 'SYS_SEL_LIST_COMPANY', para: [ this.user.PK ] }
      this.companyList = await this._dsoCall(dso_company_list, 'select', false)
      const parentCodes = ["ACAB0110", "EACAB021", "EACBK002", "ACBG0040","COAB0070"]
      const results = await this._getCommonCode2(parentCodes, this.user.TCO_COMPANY_PK)
      if(results.length) {
        this.currencyList = results[0]
        this.currencyList.unshift({ CODE: 'ALL', NAME: this.$t('all', 'common') }) 
        if(this.ccy == "" || this.ccy == null ||this.ccy == undefined || this.ccy == "null") {
          this.selectedCurrency = this.currencyList[0].CODE
        } else {
          this.selectedCurrency = this.ccy;
        }
        this.reportOptionList = results[1]
        this.selectedReportOpt = this.reportOptionList[0].CODE
        this.reportTypeList = results[2]
        this.selectedReportType = this.reportTypeList[0].CODE
        this.bookCcyList = results[3]

         this.selectedLanguage = results[4];//this.curLang.CODE;//this._languages[0].CODE  this.selectedLanguage = 
         this.selectedLang = this.curLang.CODE;
      }
    },

    async search() {
      if(this.typeAccount !== '0' )
        {
          this.getCodeAccount(this.accCode, this.txtSubCode, this.txtMCode);
          this.accCodePK = this.accountCode.PK;
        }
        else
          {
            this.accCodePK = this.accountItem.PK;
          }

      const params_sl_sum = this._formatNullValuesToEmpty([ this.selectedCompany, this.accCodePK, this.proposeFrom, this.proposeTo, this.slipStatus, this.selectedCurrency, this.txtSubCode, this.txtMCode ]);
      const dso_sl_sum = { type: 'grid', selpro: 'AC_SEL_DAILY_SL_N_DIALOG_SUM', para: params_sl_sum };
      const result_sl_sum = await this._dsoCall(dso_sl_sum, 'select', false);
      this.slSumDataList = result_sl_sum ? result_sl_sum : [];
      this.$refs.slSumGrid.instance.clearSelection();
      const openingBalance = this.slSumDataList.length ? parseFloat(this.slSumDataList[0].OPENINGBALANCE.replace(/,/g, "")) : 0;

      const params_sl_date_voucher = this._formatNullValuesToEmpty([ this.selectedCompany, this.accCodePK, this.proposeFrom, this.proposeTo, this.slipStatus, this.selectedCurrency, openingBalance, this.txtSubCode, this.txtMCode ]);
      const dso_sl_date_voucher = { 
        type: 'grid', 
        selpro: this.inquiryType === 'dates' ? 'AC_SEL_DAILY_SL_N_DIALOG_DATE' : 'AC_SEL_DAILY_SL_N_DIALOG_VC', 
        para: params_sl_date_voucher 
      };
      const result_sl_date_voucher = await this._dsoCall(dso_sl_date_voucher, 'select', false);
      this.slDateVoucherDataList = result_sl_date_voucher ? result_sl_date_voucher : [];
      this.$refs.slDateVoucherGrid.instance.clearSelection();
    },
    async getCodeAccount(p_StvasCode,p_SubCode,p_MCode) 
    {
      this.isProcessing = true
      await this.$axios.$post("dso/callproc", {
                  proc: "AC_GET_ACCOUNTCODE",
                  para: [p_StvasCode, p_SubCode,  p_MCode]
      })
      .then((res) => {
          if (res.data) {
            this.accountCode = res.data[0];
          } 
      })
    },
    onClearSubCode()
    {
      this.txtSubName =  "";
      this.txtSubCode = "";
    },
    onClearMCode()
    {
      this.txtMCode =  "";
      this.txtMName = "";
    },
    getAccCodeItem1(item) {
      this.txtSubCode = item.AC_CD;
      this.txtSubName = item.AC_CD +' - '+ item.AC_NM;
    },

    getAccCodeItem2(item) {
      this.txtMCode   = item.AC_CD;
      this.txtMName   = item.AC_CD +' - '+ item.AC_NM;
    },
    handleReturnedAccCode(data) {
      this.accCodePK = data.PK
      this.accCode = `${data.AC_CD} - ${data.AC_NM}`
    },
    openAccountDialog(code) {
      switch (code) {
        case "A":
              this.$refs.accountDialog.dialogIsShow = true;
        break;

        case "S":
              this.storeProcedure="AC_SEL_ACCT_POPUP_6015018_2";
              this.$refs.accountDialog1.dialogIsShow = true;   
        break;

        case "M":
              this.storeProcedure="AC_SEL_ACCT_POPUP_6015018_4";
              this.$refs.accountDialog2.dialogIsShow = true;   
        break;
      }
    },
    onRowDblClick({ rowType, data }) {
      if(rowType === "data" && this.inquiryType === 'vouchers') {
        this.currentSeq = data.PK
        this.seqArray = this.slDateVoucherDataList.map(x => x.PK)
        this.$refs.accountSlipDialog.dialogIsShow = true
      }
    }
  }
}
</script>
