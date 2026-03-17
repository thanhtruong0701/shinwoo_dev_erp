<template>
 <div>
    <v-dialog id="monthlypartner-dialog" max-width="1600" v-model="dialogIsShow">
        <v-card-title class="headline primary-gradient white--text py-2">
            <span>{{ $t("monthlypartner", "common") }}</span>
            <v-spacer></v-spacer>
            <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
        </v-card-title>
  <v-container fluid class="px-0 pt-0">
    <v-row dense>
      <v-col cols="12">
        <v-card>
          <v-container fluid class="pt-0">
            <v-row  no-gutters>
              <v-col cols="12" dense align="right" class="pt-3">
                <div class="d-flex justify-end">
                    <BaseButton icon_type="search" :btn_text="$t('search')" :disabled=" isProcessing" @onclick="onSearch"/>   
                    <BaseButton icon_type="excel" :btn_text="$t('excel')" :disabled="isProcessing || this.flag_rpt==true"  @onclick="onPrint"/>    
                </div>
              </v-col>
            </v-row>
            <v-row dense>
              <v-col cols="3">
                <BaseSelect outlined :label="$t('company')" v-model="selectedCompany" :lstData="companyList" item-text="TEXT" item-value="PK" @change="onChangeCompany()"/>
                <!-- <v-select
                  dense
                  outlined
                  hide-details
                  item-value="PK"
                  item-text="TEXT"
                  :label="$t('company')"
                  :items="companyList"
                  v-model="selectedCompany"
                  @change="onChangeCompany()"
                ></v-select> -->
              </v-col>
              <v-col cols="3">
                <BaseInput outlined  ref="txtAccountName" :label="$t('account_name')" :placeholder="$t('doubleclick_to_get_data')" v-model="txtAccountName" @dblClick="openAccountDialog">
                  <!-- <v-text-field  ref="txtAccountName" outlined dense @keypress.enter="onSearch" hide-details @dblclick="openAccountDialog" :label="$t('account_code')" v-model="txtAccountName"> -->
                    <template v-slot:append>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <v-icon v-on="on" :color="currentTheme" @click="openAccountDialog">mdi-window-restore</v-icon>
                        </template>
                        <span>{{ $t('show_account') }}</span>
                      </v-tooltip>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <v-icon v-on="on" :color="currentTheme" @click="TAC_ABACCTCODE_PK = '', txtAccountCode = '', txtAccountName = '' ">mdi-eraser</v-icon>
                        </template>
                        <span>{{ $t('reset') }}</span>
                      </v-tooltip>
                    </template>
                  <!-- </v-text-field> -->
                </BaseInput>
              </v-col>
              <v-col cols="3">
                <v-row align="center" justify="space-between" no-gutters>
                    <v-col md="6">
                      <BaseSelect outlined :label="$t('biz_place')" v-model="lstBizPlace" :lstData="bizPlaceList" item-text="TEXT" item-value="PK"/>
                      <!-- <v-select
                        dense
                        outlined
                        hide-details
                        :rules="validationRule.require"
                        item-value="PK"
                        item-text="TEXT"
                        :label="$t('biz_place')"
                        :items="bizPlaceList"
                        v-model="lstBizPlace"
                      ></v-select> -->
                    </v-col>
                    <v-col md="6" class="pl-2">
                      <BaseSelect outlined :label="$t('language')" v-model="selectedLanguage" :lstData="languageList" item-text="NAME" item-value="CODE"/>
                      <!-- <v-select
                        dense
                        outlined
                        hide-details
                        item-value="CODE"
                        item-text="NAME"
                        :label="$t('language')"
                        :items="languageList"
                        v-model="selectedLanguage"
                      ></v-select> -->
                    </v-col>
                  </v-row>
              </v-col>
              <v-col cols="3">
                <BaseSelect outlined :label="$t('report_type')" v-model="selectedReportType" :lstData="reportTypeList" item-text="NAME" item-value="CODE"/>
                <!-- <v-select
                  dense
                  outlined
                  hide-details
                  item-value="CODE"
                  item-text="NAME"
                  :label="$t('report_type')"
                  :items="reportTypeList"
                  v-model="selectedReportType"
                ></v-select> -->
              </v-col>
            </v-row>
            <v-row dense>
              <v-col cols="3">
                <v-row align="center" justify="space-between" no-gutters>
                    <v-col md="3">
                        <BaseDatePicker outlined default month :label="$t('month')" v-model="month" />
                    </v-col>
                    <v-col md="4" class="pl-2">
                        <BaseDatePicker  outlined start :label="$t('from')" v-model="from_date" />
                    </v-col>
                    <v-col md="5" class="pl-2">
                        <BaseDatePicker outlined default :label="$t('to')" v-model="to_date"/>
                    </v-col>
                  </v-row>
              </v-col>
              <v-col cols="3">
                <BaseInput outlined :label="$t('partner_id')" :placeholder="$t('doubleclick_to_get_data')" v-model="txtPartnerName" @dblClick="openPartnerDialog" @keyPressEnter="onSearch">
                <!-- <v-text-field outlined dense hide-details @keypress.enter="onSearch" @dblclick="openPartnerDialog" :label="$t('partner_id')" v-model="txtPartnerName"> -->
                  <template v-slot:append>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-icon v-on="on" :color="currentTheme" @click="openPartnerDialog">mdi-window-restore</v-icon>
                      </template>
                      <span>{{ $t('show_account') }}</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-icon v-on="on" :color="currentTheme" @click="TCO_BUSPARTNER_PK = '', txtPartnerID = '', txtPartnerName = '' ">mdi-eraser</v-icon>
                      </template>
                      <span>{{ $t('reset') }}</span>
                    </v-tooltip>
                  </template>
                <!-- </v-text-field> -->
                </BaseInput>
              </v-col>
              <v-col cols="3">
                <v-row align="center" justify="space-between" no-gutters>
                     <v-col md="6">
                        <BaseSelect outlined :label="$t('status')" v-model="selectedStatus" :lstData="statusList" item-text="NAME" item-value="CODE"/> 
                      <!-- <v-select
                        dense
                        outlined
                        hide-details
                        item-value="CODE"
                        item-text="NAME"
                        :label="$t('status')"
                        :items="statusList"
                        v-model="selectedStatus"
                      ></v-select> -->
                      </v-col>
                    <v-col md="6" class="pl-2">
                        <BaseSelect outlined :label="$t('ccy')" v-model="selectedCcy" :lstData="ccyList" item-text="CODE" item-value="CODE"/> 
                      <!-- <v-select
                        clearable
                        dense
                        outlined
                        hide-details
                        item-value="CODE"
                        item-text="CODE"
                        :label="$t('ccy')"
                        :items="ccyList"
                        v-model="selectedCcy"
                      ></v-select> -->
                    </v-col>
                  </v-row>
              </v-col>
              <v-col cols="3">
                <v-row align="center" justify="space-between" no-gutters>
                     <v-col md="6">
                        <BaseSelect outlined :label="$t('partner_type')" v-model="selectedPartnerType" :lstData="partnerTypeList" item-text="NAME" item-value="CODE" :text_all="$t('all')"/> 
                        <!-- <v-select
                            dense
                            outlined
                            clearable
                            hide-details
                            item-value="CODE"
                            item-text="NAME"
                            :label="$t('partner_type')"
                            :items="partnerTypeList"
                            v-model="selectedPartnerType"
                          ></v-select> -->
                      </v-col>
                    <v-col md="6" class="pl-2">
                        <BaseSelect outlined :label="$t('amt_type')" v-model="selectedAmtType" :lstData="amtTypeList" item-text="NAME" item-value="CODE"/> 
                      <!-- <v-select
                        dense
                        outlined
                        cache-items
                        hide-details
                        item-value="CODE"
                        item-text="NAME"
                        :label="$t('amt_type')"
                        :items="amtTypeList"
                        v-model="selectedAmtType"
                      ></v-select> -->
                    </v-col>
                  </v-row>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>

    <v-row dense>
      <v-col md="4" cols="4" class="align-self-center">
        <v-btn-toggle
          dense
          mandatory
          :color="currentTheme"
          v-model="selectedTab"
        >
          <v-btn value="tabAccountCodeCustomer">{{
            $t("account_code_customer")
          }}</v-btn>
          <v-btn value="tabTransAmt">{{
            $t("transaction_amount")
          }}</v-btn>
          <v-btn value="tabBookingAmt">{{ $t("booking_amount") }}</v-btn>
          <v-btn value="tabAccountCode">{{ $t("account_code") }}</v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>
    <!-- Data Table -->
    <v-row dense align="center" justify="center">
      <v-col cols="12" class="py-0">
        <v-card class="py-0" tile v-resize="onResize">
          <DataGridView
            v-show="selectedTab == 'tabAccountCodeCustomer'"
            ref="grdAccCodeCust"
            :header="grdAccCodeCustHeader"
            sel_procedure="ac_sel_6045045_account_cust"
            select_mode="Single"
            :filter_paras="[
              this.selectedCompany,
              this.from_date, 
              this.to_date,
              this.txtAccountCode,
              this.TCO_BUSPARTNER_PK,
              this.selectedStatus,
              this.selectedPartnerType,
              this.lstBizPlace
            ]"
            :is_allow_paste="false"
            :max_height="limitHeight-60"
            @cellDblClick="onRowDblClick"
            :filterRow="true"
          />
           <DataGridView
            v-show="selectedTab == 'tabTransAmt'"
            ref="grdTransAmt"
            :header="grdTransAmtHeader"
            sel_procedure="ac_sel_6045045_trans_amt"
            select_mode="Single"
            :filter_paras="[
              this.selectedCompany,
              this.from_date,
              this.to_date,
              this.txtAccountCode,
              this.TCO_BUSPARTNER_PK,
              this.selectedStatus,
              this.selectedCcy,
              this.selectedPartnerType,
              this.lstBizPlace
            ]"
            :is_allow_paste="false"
            :max_height="limitHeight - 200"
            @cellDblClick="onRowDblClick" 
            :filterRow="true"
          />
            <DataGridView
              v-show="selectedTab == 'tabTransAmt'"
              ref="grdTransAmtSum"
              :header="grdTransAmtSumHeader"
              sel_procedure="ac_sel_6045045_trans_amt_sum"
              select_mode="Single"
              :filter_paras="[
                this.selectedCompany,
                this.from_date,
                this.to_date,
                this.txtAccountCode,
                this.TCO_BUSPARTNER_PK,
                this.selectedStatus,
                this.selectedCcy,
                this.selectedPartnerType,
                this.lstBizPlace
              ]"
              :is_allow_paste="false"
              :max_height="limitHeight - 550"
              @cellDblClick="onRowDblClick"
            />
          
          <DataGridView
              v-show="selectedTab == 'tabBookingAmt'"
              ref="grdBookingAmt"
              :header="grdBookingAmtHeader"
              sel_procedure="ac_sel_6045045_booking_amt"
              select_mode="Single"
              :filter_paras="[
                this.selectedCompany,
                this.from_date,
                this.to_date,
                this.txtAccountCode,
                this.TCO_BUSPARTNER_PK,
                this.selectedStatus,
                this.selectedCcy,
                this.selectedPartnerType,
                this.lstBizPlace
              ]"
              :is_allow_paste="false"
              :max_height="limitHeight - 120"
              @cellDblClick="onRowDblClick"
            />
          
           <DataGridView
              v-show="selectedTab == 'tabBookingAmt'"
              ref="grdBookingAmtSum"
              :header="grdBookingAmtSumHeader"
              sel_procedure="ac_sel_6045045_booking_amt_sum"
              select_mode="Single"
              :filter_paras="[
                this.selectedCompany,
                this.from_date,
                this.to_date,
                this.txtAccountCode,
                this.TCO_BUSPARTNER_PK,
                this.selectedStatus,
                this.selectedCcy,
                this.selectedPartnerType,
                this.lstBizPlace
              ]"
              :is_allow_paste="false"
              :max_height="limitHeight - 550"
              @cellDblClick="onRowDblClick"
            />
          
           <DataGridView
              v-show="selectedTab == 'tabAccountCode'"
              ref="grdAccountCode"
              :header="grdAccountCodeHeader"
              sel_procedure="ac_sel_6045045_account"
              select_mode="Single"
              :filter_paras="[
                this.selectedCompany,
                this.from_date,
                this.to_date,
                this.txtAccountCode,
                this.selectedStatus,
                this.selectedPartnerType,
                this.lstBizPlace
              ]"
              :is_allow_paste="false"
              :max_height="limitHeight - 120"
            />
          
           <DataGridView
              v-show="selectedTab == 'tabAccountCode'"
              ref="grdAccountCodeSum"
              :header="grdAccountCodeSumHeader"
              sel_procedure="ac_sel_6045045_account_sum"
              select_mode="Single"
              :filter_paras="[
                this.selectedCompany,
                this.from_date,
                this.to_date,
                this.txtAccountCode,
                this.selectedStatus,
                this.selectedPartnerType,
                this.lstBizPlace
              ]"
              :is_allow_paste="false"
              :max_height="limitHeight - 550"
            />
        </v-card>
      </v-col>
    </v-row>
    <account-dialog
      ref="accountDialog"
      @returnAccountInfo="mappingAccount" :acc_type="sel_SumPos"
    ></account-dialog>
    <partner-dialog
      ref="partnerDialog"
      @callBackData="mappingPartner"
      :companyPK="this.selectedCompany"
      :AcntType="true"
    ></partner-dialog>
    <alert-dialog ref="alertDialog"></alert-dialog>
    <sl-for-partner-dialog ref="SlforPartnerDialog" :companyPK="selectedCompany" :accountItem="accountItem" :fromDate="from_date" :toDate="to_date" :status="selectedStatus" ccy="" :PartnerItem="PartnerItem" :bizPlace="lstBizPlace" ></sl-for-partner-dialog>
  </v-container>
  
   </v-dialog>
 </div>  
</template>   

<script>
export default { 
  name:"monthly-partner-dialog",
  props: ["companyPK", "accountItem","p_month", "fromDate", "toDate", "PartnerItem", "status", "ccy" ,"bizPlace"],

  components: {
    accountDialog: () => import("@/components/dialog/AccountDialog"),
    partnerDialog: () => import("@/components/dialog/PartnerDialog"),
    datePicker: () => import("@/components/control/DatePicker"),
    AlertDialog: () => import("@/components/dialog/AlertDialog"),
    SlForPartnerDialog: () => import("@/components/dialog/SlForPartnerDialog")
  },

  data: () => ({
    dialogIsShow: false,
    grdAccCodeCustList: [],
    grdTransAmtList: [],
    grdTransAmtSumList: [],
    grdBookingAmtList: [],
    grdBookingAmtSumList: [],
    grdAccountList: [],
    grdAccountSumList: [],
    grdTransInDeList: [],
    month: "",
    from_date: "",
    to_date: "",
    selectedTab: undefined,
    selectedCompany: "",
    txtAccountCode: "",
    txtAccountName: "",
    txtPartnerID: "",
    txtPartnerName: "",
    TCO_BUSPARTNER_PK: "",
    TAC_ABACCTCODE_PK: "",
    companyList: [],
    selectedStatus: "2",
    partnerTypeList: [],
    selectedPartnerType: "",
    languageList: [],
    selectedLanguage: "",
    reportTypeList: [],
    selectedReportType: "",
    ccyList: [],
    selectedCcy: "",
    precision: 0,
    statusList:[],
    selectedAmtType: "book",
    txtBookCcy: "",
    
    bizPlaceList:[],
    lstBizPlace:"",
    
    sel_SumPos : "%",
    flag_rpt : false,

  }),
  async created() {
    this.selectedCompany = this.user.TCO_COMPANY_PK;
    this.buildHeader("tabAccountCodeCustomer");
    this.buildHeader("tabTransAmt");
    this.buildHeader("tabBookingAmt");
    this.buildHeader("tabAccountCode");
    this.getCompanyList();
    const commoncode = await this._getCommonCode2(
      ["CODC0010", "COAB0070", "EACBK003", "ACAB0110", "ACBG0040","EACBK004"],
      this.selectedCompany
    );
    this.partnerTypeList = commoncode[0];
    this.selectedPartnerType = '';//this.partnerTypeList[0].CODE;
    this.languageList = commoncode[1];
    this.selectedLanguage = this.curLang.CODE;
    this.reportTypeList = commoncode[2];
    this.selectedReportType = this.reportTypeList[0].CODE;
    this.ccyList = commoncode[3];
    this.selectedCcy = this.ccyList[0].CODE;
    const result = commoncode[4];
    result.forEach(e => {
      if (e.DEF_YN == "Y") {
        this.precision = e.VAL3;
        this.txtBookCcy = e.CODE;
      }
    });
    const result_status = await this._getCommonCode('ACBG0010', this.selectedCompany);  
    this.statusList =  [...result_status.filter(x => x.VAL1 == 'Y')]; 

    const dso_bizplace_list = {
                        type: 'list',
                        selpro: 'SYS_SEL_BIZ_PLACE_V2',
                        para: [this.selectedCompany, this.user.PK]
                          }
    this.bizPlaceList = await this._dsoCall(dso_bizplace_list, 'select', false)
    if(this.bizPlaceList.length > 0)
    {
      this.lstBizPlace = this.bizPlaceList[0].PK;
    }
    this.getAccountCode(commoncode[5][0].VAL5);
  },
  computed: {
   /* statusList() {
      return [
        { CODE: "2", NAME: this.$t("confirmed") },
        { CODE: "0", NAME: this.$t("approved") }
      ];
    },*/
    user() {
      return this.$store.getters["auth/user"];
    },
    limitHeight() {
      return this.windowHeight - 250;
    },
    amtTypeList() {
      return [
        { CODE: "book", NAME: this.$t("book") },
        { CODE: "trans-book", NAME: this.$t("trans_book") }
      ];
    },
  },
  /*begin :watch*/
  watch: {
     _language(val) {
      this.selectedLanguage = val
    },
    dialogIsShow(val) {
    
            if (val === true) {
                //console.log("ahihi"+`${this.accountItem.CODE} - ${this.accountItem.NAME}`);
                // this.$refs.slSumGrid.clear();
                // this.$refs.slDateVoucherGrid.clear();
                this.selectedCompany = this.companyPK
                this.TAC_ABACCTCODE_PK = this.accountItem.PK
                this.TCO_BUSPARTNER_PK =this.PartnerItem.PK;
                this.txtPartnerName = this.PartnerItem.NAME ;
                // console.log("ahihi"+this.PartnerItem.NAME); 
               // this.txtAccountName = `${this.accountItem.CODE} - ${this.accountItem.NAME}`
                this.txtAccountName =this.accountItem.CODE ;
                this.month = this.p_month ;
                this.from_date = this.fromDate ;
                this.to_date = this.toDate;

                this.selectedStatus = this.status;
                this.onSearch();
                //this.getListCodes()
                

            } else {
               // this.slDateVoucherDataList = []
                //this.slSumDataList = []
               
            }
        },
    selectedCcy(val) {
      if (!val) {
        this.selectedCcy = "%";
      }
      this.onSearch();
    },
    selectedPartnerType(val) {
      if (!val) {
        this.selectedPartnerType = "%";
      }
      this.onSearch();
    },
    selectedStatus(val) {
      this.onSearch();
    },
    month(val) {
      if (val) {
        this.from_date = val + "01";
        this.to_date = val + this._maxDateOfMonth(val);
      }
    },
    txtAccountName(val) {
      if (!val) {
        this.txtAccountCode = "";
        this.TAC_ABACCTCODE_PK = "";
        this.txtAccountCode = "%";
      }else{
         this.txtAccountCode = val;
         console.log(this.txtAccountCode);
      }
    },
    
    txtPartnerName(val) {
      if (!val) {
        this.txtPartnerID = "";
        this.TCO_BUSPARTNER_PK = "";
      }else{
         this.txtPartnerID = val;
      }
    }
  },
  /*end :watch*/
  methods: {
    customizeText2({ value }) {
      return `${this._formatNumber(value, 0)}`;
    },
    async onSearch() {
      if (this.selectedTab == "tabAccountCodeCustomer") {
        
        this.$refs.grdAccCodeCust.loadData();
      } else if (this.selectedTab == "tabTransAmt") {
        if (!this.txtAccountName) {
          this.$refs.txtAccountName.focus();
          return this.showNotification(
            "warning",
            this.$t("please_open_popup_select_account_code_to_search"),
            "",
            5000
          );
        }
        this.$refs.grdTransAmt.loadData();
        
        this.$refs.grdTransAmtSum.loadData();
        
      } else if (this.selectedTab == "tabBookingAmt") {
        if (!this.txtAccountName) {
          this.$refs.txtAccountName.focus();
          return this.showNotification(
            "warning",
            this.$t("please_open_popup_select_account_code_to_search"),
            "",
            5000
          );
        }
        this.$refs.grdBookingAmt.loadData();
        
        this.$refs.grdBookingAmtSum.loadData();
        
      } else if (this.selectedTab == "tabAccountCode") {
        this.$refs.grdAccountCode.loadData();
        
        //select for grid summary
        this.$refs.grdAccountCodeSum.loadData();
        
      }
    },
    async onChangeCompany()
    {
      this.bizPlaceList = [];
      const dso_bizplace_list = {
                        type: 'list',
                        selpro: 'SYS_SEL_BIZ_PLACE_v2',
                        para: [this.selectedCompany, this.user.PK]
                          }
      this.bizPlaceList = await this._dsoCall(dso_bizplace_list, 'select', false)
      if(this.bizPlaceList.length > 0)
      {
        this.lstBizPlace = this.bizPlaceList[0].PK;
      }
    },
    async getAccountCode(p_Account_CD)
    {
      const dso = {  type: "list",  selpro: "SYS_SEL_ACCOUNT_CODE",para: [p_Account_CD,this.from_date.substring(0,6),'','','Y'] };
      const result = await this._dsoCall(dso, "select", false);
      if (result.length > 0)
      {
        this.txtAccountCode = result[0].AC_CD;
        this.txtAccountName = result[0].AC_CD + " - " + result[0].AC_NM;
        this.TAC_ABACCTCODE_PK   = result[0].PK;
      }
      this.onSearch();
    },
    async onPrint() {
      this.flag_rpt = true;  
      var report_info = this.reportTypeList.find(x => x.CODE == this.selectedReportType);
      var company_info = this.companyList.find(x => x.PK == this.selectedCompany);
      var BizPlace_info  = this.bizPlaceList.find(x => x.PK == this.lstBizPlace); 
      switch(report_info.CODE)
        {
          case'AL' : 
            if(this.selectedTab == "tabTransAmt")
            {
              this.flag_rpt = false; 
              return this.showNotification(
                "warning",
                this.$t("please_choose_report_print_trans_books_ccy"),
                "",
                5000
              );
              return; 
            }
            if(this.selectedTab == "tabBookingAmt")
            {
              this.flag_rpt = false; 
              return this.showNotification(
                "warning",
                this.$t("please_choose_report_print_books_ccy"),
                "",
                5000
              );
              return; 
            }
            else{
              let l_P_RPT_FILE = "";
              if(this.selectedAmtType == "trans-book"){
                l_P_RPT_FILE = report_info.VAL4;
              }
              else{
                 l_P_RPT_FILE = report_info.VAL3;
              }
              if(report_info.VAL1 == "" || report_info.VAL1 == "null" || report_info.VAL1 == null || report_info.VAL1 == undefined)
              { 
                    var MSG_ERR = "PLS_REGISTER_REPORT_ID_WITH_COMONCODE_" + "EACBK003";
                    this.$refs.alertDialog.showAlert("error", "Error", MSG_ERR );
                    return;
              }
              var param =  
                [
                    {   P_RPT_ID: report_info.VAL1, P_RPT_URL: report_info.VAL2, P_RPT_FILE: l_P_RPT_FILE,//report_info.VAL4,
                      P_COMP_ID: company_info.PARTNER_ID, P_COMP_NM: company_info.TEXT, P_COMP_TAX: company_info.TAX_CODE, P_COMP_ADD: company_info.ADDR1,
                      P_COMPANY: this.selectedCompany, P_FR_DATE: this.from_date, P_FR_TO: this.to_date, P_ACC_PK: this.TAC_ABACCTCODE_PK, P_ACC_CD: this.txtAccountCode, 
                      P_CUST_PK: this.TCO_BUSPARTNER_PK, P_STATUS: this.selectedStatus, P_CCY: this.selectedCcy, P_PARTNER_TYPE: this.selectedPartnerType, P_LANG : this.selectedLanguage ,P_TCO_BUSPLACE_PK : this.lstBizPlace,
                      P_BIZ_ID: BizPlace_info.NAME, P_BIZ_NM: BizPlace_info.LOC_NM, P_BIZ_TAX: BizPlace_info.TAX_CD, P_BIZ_ADD: BizPlace_info.ADDR_NM1
                    }
                ];
              var file_nm = report_info.VAL1+"_"+report_info.NAME+"_"+this.user.USER_ID+".xlsx";
              var url_path = "/report/"+  report_info.VAL1 + "/" + l_P_RPT_FILE;//report_info.VAL4; 
            
                try 
                {  
                  const result = await this.$axios.$get(url_path, { responseType : "blob", params: {para: param}});  
                  if (result) 
                  {  
                    this.flag_rpt = false;  
                    this._ExcelSaveAs(result, file_nm); 
                  }
                  else 
                  { 
                      this.flag_rpt = false;  
                      this.showNotification( "danger", this.$t("fail_to_export_report"), "", 4000 );
                  }
              }  
              catch (e) 
              { 
                  this.flag_rpt = false;  
                  this.showNotification("danger", e.message, "", 4000);
              }
              return false;
            }
          break;
          case'OB' : 
            if(this.selectedTab == "tabTransAmt")
            {
              this.flag_rpt = false; 
              return this.showNotification(
                "warning",
                this.$t("please_choose_report_print_trans_books_ccy"),
                "",
                5000
              );
              return; 
            }
            if(this.selectedTab == "tabAccountCodeCustomer" || this.selectedTab == "tabAccountCode")
            {
              this.flag_rpt = false; 
              return this.showNotification(
                "warning",
                this.$t("please_choose_report_print_all_account_code"),
                "",
                5000
              );
              return; 
            }
            else{
              this.onPrintLoad();
            }
          break;
          case'TB' : 
            if(this.selectedTab == "tabBookingAmt")
            {
              this.flag_rpt = false; 
              return this.showNotification(
                "warning",
                this.$t("please_choose_report_print_books_ccy"),
                "",
                5000
              );
              return; 
            }
            if(this.selectedTab == "tabAccountCodeCustomer" || this.selectedTab == "tabAccountCode")
            {
              this.flag_rpt = false; 
              return this.showNotification(
                "warning",
                this.$t("please_choose_report_print_all_account_code"),
                "",
                5000
              );
              return; 
            }
            else{
              this.onPrintLoad();
            }
          break;
        }
    },
   async onPrintLoad(){
       this.flag_rpt = true;  
        var report_info = this.reportTypeList.find(x => x.CODE == this.selectedReportType);
        var company_info = this.companyList.find(x => x.PK == this.selectedCompany);
        var BizPlace_info  = this.bizPlaceList.find(x => x.PK == this.lstBizPlace); 
        if(report_info.VAL1 == "" || report_info.VAL1 == "null" || report_info.VAL1 == null || report_info.VAL1 == undefined)
          { 
          // console.log('ENG');
                var MSG_ERR = "PLS_REGISTER_REPORT_ID_WITH_COMONCODE_" + "EACBK003";
                this.$refs.alertDialog.showAlert("error", "Error", MSG_ERR );
                return;
          }
        var param =  
            [
                {   P_RPT_ID: report_info.VAL1, P_RPT_URL: report_info.VAL2, P_RPT_FILE: report_info.VAL3,
                  P_COMP_ID: company_info.PARTNER_ID, P_COMP_NM: company_info.TEXT, P_COMP_TAX: company_info.TAX_CODE, P_COMP_ADD: company_info.ADDR1,
                  P_COMPANY: this.selectedCompany, P_FR_DATE: this.from_date, P_FR_TO: this.to_date, P_ACC_PK: this.TAC_ABACCTCODE_PK, P_ACC_CD: this.txtAccountCode,
                  P_CUST_PK: this.TCO_BUSPARTNER_PK, P_STATUS: this.selectedStatus, P_CCY: this.selectedCcy, P_PARTNER_TYPE: this.selectedPartnerType, P_LANG : this.selectedLanguage ,P_TCO_BUSPLACE_PK : this.lstBizPlace,
                  P_BIZ_ID: BizPlace_info.NAME, P_BIZ_NM: BizPlace_info.LOC_NM, P_BIZ_TAX: BizPlace_info.TAX_CD, P_BIZ_ADD: BizPlace_info.ADDR_NM1
                }
            ];
            console.log(param);
            var file_nm = report_info.VAL1+"_"+report_info.NAME+"_"+this.user.USER_ID+".xlsx";
            var url_path = "/report/"+  report_info.VAL1 + "/" + report_info.VAL3;
          
              try 
              {  
                const result = await this.$axios.$get(url_path, { responseType : "blob", params: {para: param}});  
                if (result) 
                {  
                    this.flag_rpt = false; 
                    this._ExcelSaveAs(result, file_nm); 
                }
                else 
                { 
                    this.flag_rpt = false; 
                    this.showNotification( "danger", this.$t("fail_to_export_report"), "", 4000 );
                }
            }  
            catch (e) 
            { 
                 this.flag_rpt = false; 
                this.showNotification("danger", e.message, "", 4000);
            }
    },
    buildHeader(p_type) {
      const self = this;
      let header1 = [];
      if (p_type == "tabAccountCodeCustomer") {
        header1 = [
          {
            caption: this.$t("partner"),
            columns: [
              {
                dataField: "PARTNER_ID",
                caption: this.$t("partner_id"),
              },
              {
                dataField: "PARTNER_NAME",
                caption: this.$t("partner_name")
              }
            ]
          },
          {
            caption: this.$t("account"),
            columns: [
              {
                dataField: "AC_CD",
                caption: this.$t("code")
              },
              {
                dataField: "AC_NM",
                caption: this.$t("name")
              }
            ]
          },
          {
            caption: this.$t("open"),
            columns: [
              {
                dataField: "DR_OPEN",
                caption: this.$t("debit"),
                dataType: 'number',
                formatFloat: 0,
                summaryType:'sum',
              },
              {
                dataField: "CR_OPEN",
                caption: this.$t("credit"),
                // customizeText: function({ value }) {
                //   return `${self._formatNumber(value, self.precision)}`;
                // },
                dataType: 'number',
                formatFloat: 0,
                summaryType:'sum',
              }
            ]
          },
          {
            caption: this.$t("period"),
            columns: [
              {
                dataField: "DR_SUM",
                caption: this.$t("debit"),
                dataType: 'number',
                formatFloat: 0,
                summaryType:'sum',
              },
              {
                dataField: "CR_SUM",
                caption: this.$t("credit"),
                dataType: 'number',
                formatFloat: 0,
                summaryType:'sum',
              }
            ]
          },
          {
            caption: this.$t("accumulate"),
            columns: [
              {
                dataField: "ACC_DR",
                caption: this.$t("debit"),
                dataType: 'number',
                formatFloat: 0,
                summaryType:'sum',
              },
              {
                dataField: "ACC_CR",
                caption: this.$t("credit"),
                dataType: 'number',
                formatFloat: 0,
                summaryType:'sum',
              }
            ]
          },
          {
            caption: this.$t("end"),
            columns: [
              {
                dataField: "DR_END",
                caption: this.$t("debit"),
                dataType: 'number',
                formatFloat: 0,
                summaryType:'sum',
              },
              {
                dataField: "CR_END",
                caption: this.$t("credit"),
                dataType: 'number',
                formatFloat: 0,
                summaryType:'sum',
              }
            ]
          }
        ];
        this.grdAccCodeCustHeader = header1;
      } else if (p_type == "tabTransAmt") {
        header1 = [
          {
            caption: this.$t("partner"),
            columns: [
              {
                dataField: "PARTNER_ID",
                caption: this.$t("partner_id")
              },
              {
                dataField: "PARTNER_NAME",
                caption: this.$t("partner_name")
              }
            ]
          },
          {
            caption: this.$t("account"),
            columns: [
              {
                dataField: "AC_CD",
                caption: this.$t("code"),
                width : 80,
              },
              {
                dataField: "AC_NM",
                caption: this.$t("name"),
                width : 80,
              }
            ]
          }
        ];
        const header2 = [
          { dataField: "CCY", caption: this.$t("ccy") },
          {
            caption: this.$t("open"),
            columns: [
              {
                dataField: "TR_OPEN",
                caption: this.$t("transaction"),
                // customizeText: function({ value }) {
                //   return `${self._formatNumber(value, 2)}`;
                // },
                dataType: 'number',
                formatFloat: 2
              },
              {
                dataField: "BK_OPEN",
                caption: this.$t("book"),
                // customizeText: function({ value }) {
                //   return `${self._formatNumber(value, self.precision)}`;
                // }
                dataType: 'number',
                formatFloat: 0,
              }
            ]
          },
          {
            caption: this.$t("transaction"),
            columns: [
              {
                dataField: "TR_DR",
                caption: this.$t("debit"),
                // customizeText: function({ value }) {
                //   return `${self._formatNumber(value, 2)}`;
                // }
                dataType: 'number',
                formatFloat: 2,
              },
              {
                dataField: "TR_CR",
                caption: this.$t("credit"),
                // customizeText: function({ value }) {
                //   return `${self._formatNumber(value, 2)}`;
                // }
                dataType: 'number',
                formatFloat: 2,
              }
            ]
          },
          {
            caption: this.$t("book"),
            columns: [
              {
                dataField: "BK_DR",
                caption: this.$t("debit"),
                // customizeText: function({ value }) {
                //   return `${self._formatNumber(value, self.precision)}`;
                // }
                dataType: 'number',
                formatFloat: 0
              },
              {
                dataField: "BK_CR",
                caption: this.$t("credit"),
                // customizeText: function({ value }) {
                //   return `${self._formatNumber(value, self.precision)}`;
                // },
                dataType: 'number',
                formatFloat: 0
              }
            ]
          },
          {
            caption: this.$t("accumulate_transaction"),
            columns: [
              {
                dataField: "TR_ACC_DR",
                caption: this.$t("debit"),
                // customizeText: function({ value }) {
                //   return `${self._formatNumber(value, 2)}`;
                // },
                dataType: 'number',
                formatFloat: 2
              },
              {
                dataField: "TR_ACC_CR",
                caption: this.$t("credit"),
                // customizeText: function({ value }) {
                //   return `${self._formatNumber(value, 2)}`;
                // },
                dataType: 'number',
                formatFloat: 2
              }
            ]
          },
          {
            caption: this.$t("accumulate_book"),
            columns: [
              {
                dataField: "BK_ACC_DR",
                caption: this.$t("debit"),
                customizeText: function({ value }) {
                  return `${self._formatNumber(value, self.precision)}`;
                },
                dataType: 'number',
                formatFloat: 0
              },
              {
                dataField: "BK_ACC_CR",
                caption: this.$t("credit"),
                // customizeText: function({ value }) {
                //   return `${self._formatNumber(value, self.precision)}`;
                // },
                dataType: 'number',
                formatFloat: 0
              }
            ]
          },
          {
            caption: this.$t("end"),
            columns: [
              {
                dataField: "TR_END",
                caption: this.$t("transaction"),
                // customizeText: function({ value }) {
                //   return `${self._formatNumber(value, 2)}`;
                // },
                dataType: 'number',
                formatFloat: 2
              },
              {
                dataField: "BK_END",
                caption: this.$t("book"),
                // customizeText: function({ value }) {
                //   return `${self._formatNumber(value, self.precision)}`;
                // }
                dataType: 'number',
                formatFloat: 0
              }
            ]
          }
        ];
        this.grdTransAmtHeader = header1.concat(header2);
        this.grdTransAmtSumHeader = header2;
      } else if (p_type == "tabBookingAmt") {
        header1 = [
          {
            caption: this.$t("partner"),
            columns: [
              {
                dataField: "PARTNER_ID",
                caption: this.$t("partner_id")
              },
              {
                dataField: "PARTNER_NAME",
                caption: this.$t("partner_name")
              }
            ]
          },
          {
            caption: this.$t("account"),
            columns: [
              {
                dataField: "AC_CD",
                caption: this.$t("code")
              },
              {
                dataField: "AC_NM",
                caption: this.$t("name")
              }
            ]
          }
        ];
        const header2 = [
          {
            dataField: "BK_OPEN",
            caption: this.$t("open"),
            // customizeText: function({ value }) {
            //   return `${self._formatNumber(value, self.precision)}`;
            // },
            dataType: 'number',
            formatFloat: 0
          },
          {
            caption: this.$t("period"),
            columns: [
              {
                dataField: "BK_DR",
                caption: this.$t("debit"),
                // customizeText: function({ value }) {
                //   return `${self._formatNumber(value, self.precision)}`;
                // },
                dataType: 'number',
                formatFloat: 0
              },
              {
                dataField: "BK_CR",
                caption: this.$t("credit"),
                // customizeText: function({ value }) {
                //   return `${self._formatNumber(value, self.precision)}`;
                // },
                dataType: 'number',
                formatFloat: 0
              }
            ]
          },
          {
            caption: this.$t("accumulate"),
            columns: [
              {
                dataField: "BK_ACC_DR",
                caption: this.$t("debit"),
                // customizeText: function({ value }) {
                //   return `${self._formatNumber(value, self.precision)}`;
                // },
                dataType: 'number',
                formatFloat: 0
              },
              {
                dataField: "BK_ACC_CR",
                caption: this.$t("credit"),
                // customizeText: function({ value }) {
                //   return `${self._formatNumber(value, self.precision)}`;
                // },
                dataType: 'number',
                formatFloat: 0
              }
            ]
          },
          {
            dataField: "BK_END",
            caption: this.$t("end"),
            // customizeText: function({ value }) {
            //   return `${self._formatNumber(value, self.precision)}`;
            // },
            dataType: 'number',
            formatFloat: 0
          }
        ];
        this.grdBookingAmtHeader = header1.concat(header2);
        this.grdBookingAmtSumHeader = header2;
      } else if (p_type == "tabAccountCode") {
        header1 = [
          {
            caption: this.$t("account"),
            columns: [
              {
                dataField: "AC_CD",
                caption: this.$t("code")
              },
              {
                dataField: "AC_NM",
                caption: this.$t("name")
              }
            ]
          }
        ];
        const header2 = [
          {
            caption: this.$t("open"),
            columns: [
              {
                dataField: "DR_OPEN",
                caption: this.$t("debit"),
                // customizeText: function({ value }) {
                //   return `${self._formatNumber(value, self.precision)}`;
                // },
                dataType: 'number',
                formatFloat: 0
              },
              {
                dataField: "CR_OPEN",
                caption: this.$t("credit"),
                // customizeText: function({ value }) {
                //   return `${self._formatNumber(value, self.precision)}`;
                // },
                dataType: 'number',
                formatFloat: 0
              }
            ]
          },
          {
            caption: this.$t("period"),
            columns: [
              {
                dataField: "BK_DR",
                caption: this.$t("debit"),
                // customizeText: function({ value }) {
                //   return `${self._formatNumber(value, self.precision)}`;
                // },
                dataType: 'number',
                formatFloat: 0
              },
              {
                dataField: "BK_CR",
                caption: this.$t("credit"),
                // customizeText: function({ value }) {
                //   return `${self._formatNumber(value, self.precision)}`;
                // },
                dataType: 'number',
                formatFloat: 0
              }
            ]
          },
          {
            caption: this.$t("accumulate"),
            columns: [
              {
                dataField: "ACC_DR",
                caption: this.$t("debit"),
                // customizeText: function({ value }) {
                //   return `${self._formatNumber(value, self.precision)}`;
                // },
                dataType: 'number',
                formatFloat: 0
              },
              {
                dataField: "ACC_CR",
                caption: this.$t("credit"),
                // customizeText: function({ value }) {
                //   return `${self._formatNumber(value, self.precision)}`;
                // },
                dataType: 'number',
                formatFloat: 0
              }
            ]
          },
          {
            caption: this.$t("end"),
            columns: [
              {
                dataField: "DR_END",
                caption: this.$t("debit"),
                // customizeText: function({ value }) {
                //   return `${self._formatNumber(value, self.precision)}`;
                // },
                dataType: 'number',
                formatFloat: 0
              },
              {
                dataField: "CR_END",
                caption: this.$t("credit"),
                // customizeText: function({ value }) {
                //   return `${self._formatNumber(value, self.precision)}`;
                // },
                dataType: 'number',
                formatFloat: 0
              }
            ]
          }
        ];
        this.grdAccountCodeHeader = header1.concat(header2);
        this.grdAccountCodeSumHeader = header2;
      }
    },

    openAccountDialog() {
      this.$refs.accountDialog.dialogIsShow = true;
    },
    openPartnerDialog() {
      this.$refs.partnerDialog.dialogIsShow = true;
    },
    mappingAccount(item) {
      this.txtAccountCode = item.AC_CD;
      this.txtAccountName = item.AC_CD + ' - ' + item.AC_NM;
      this.TAC_ABACCTCODE_PK = item.PK;
    },
    mappingPartner(item) {
      this.txtPartnerID = item.PARTNER_ID;
      this.txtPartnerName = item.PARTNER_ID + ' - '  + item.PARTNER_NAME;
      this.TCO_BUSPARTNER_PK = item.PK;
    },
    async getCompanyList() {
      const dso = {
        type: "list",
        selpro: "SYS_SEL_LIST_COMPANY",
        para: [this.user.PK]
      };
      const result = await this._dsoCall(dso, "select", false);
      if (result) {
        this.companyList = result;
        this.selectedCompany = this.companyList[0].PK;
      } else {
        this.companyList = [];
      }
    },
    onRowDblClick({ rowType, data }) { 
      if(rowType === "data") {
        this.currentSeq = data.PK;
        this.accountItem = { PK: data.TAC_ABACCTCODE_PK, CODE: data.AC_CD, NAME: data.AC_NM }
        this.PartnerItem  = { PK: data.TCO_BUSPARTNER_PK, CODE: data.PARTNER_ID, NAME: data.PARTNER_NAME }
        this.$refs.SlforPartnerDialog.dialogIsShow = true;
      }
    }, 
  }
};
</script>
