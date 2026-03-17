<template>
  <v-dialog id="cash-flow-dialog" max-width="1000" v-model="dialogIsShow">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ $t("cash_flow_popup") }}</span>
        <v-spacer></v-spacer>
        <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
      </v-card-title>
      <v-container fluid class="pa-0" v-resize="onResize">
          <v-row dense class="pa-1" v-show="false">
                <v-col cols="12">
                    <v-card outlined tile>
                        <v-container fluid class="pt-0">
                            <v-row dense>
                                <!-- Company -->
                                <v-col cols="3" class="pb-2">
                                    <v-row dense>
                                        <v-col cols="6" class="py-1">
                                            <v-select outlined cache-items clearable dense hide-details item-value="PK" item-text="TEXT" :label="$t('company')" :items="companyList" v-model="selectedCompany" @change="onChangeCompany"></v-select>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-select cache-items clearable outlined dense hide-details :label="$t('biz_place')" item-value="PK" item-text="TEXT" :items="bizPlaceList" v-model="lstBizPlace" @keypress.enter="search"></v-select>
                                        </v-col>
                                    </v-row>
                                </v-col>
                                <!-- Language -->
                                <v-col cols="2" class="pb-2">
                                    <v-select outlined cache-items clearable dense hide-details item-value="CODE" item-text="NAME" :label="$t('language')" :items="languageList" v-model="selectedLang"></v-select>
                                </v-col>
                                <!-- Check All - Business -->
                                <v-col cols="1" class="pb-2">
                                    <v-checkbox dense hide-details class="mt-0 mr-2" :label="$t('check_all')"></v-checkbox>
                                </v-col>
                                <v-col cols="2">
                                    <v-select outlined cache-items clearable dense hide-details item-value="CODE" item-text="NAME" :items="dndtList" v-model="selectedDNDT"></v-select>
                                </v-col>
                                <!-- Status -->
                                <v-col cols="2" class="pb-2">
                                    <v-select outlined cache-items clearable dense hide-details item-value="VALUE" item-text="TEXT" :label="$t('status')" :items="statusList" v-model="status" @change="search"></v-select>
                                </v-col>
                                <!-- Report Type -->
                                <v-col cols="2" class="pb-2">
                                    <v-select outlined cache-items clearable dense hide-details item-value="CODE" item-text="NAME" :label="$t('report_type')" :items="reportTypeList" v-model="selectedReportType"></v-select>
                                </v-col>
                            </v-row>
                            <v-row dense>
                                <!-- Proposed From -->
                                <v-col cols="1" class="pb-2" v-show="dateType=='month'">
                                    <BaseDatePicker outlined default month :label="$t('month')" v-model="month"/>
                                </v-col>
                                <v-col cols="2" class="pb-2">
                                    <date-picker outlined :inputValue="proposedFrom" :label="$t('proposed_from')" @returnValue="proposedFrom = $event"></date-picker>
                                </v-col>
                                <!-- Proposed To -->
                                <v-col cols="2" class="pb-2">
                                    <date-picker outlined :inputValue="proposedTo" :label="$t('proposed_to')" @returnValue="proposedTo = $event"></date-picker>
                                </v-col>
                                <!-- Account Code Debit -->
                                <v-col cols="3" class="pb-2">
                                    <v-text-field outlined dense hide-details readonly :label="$t('acc_code_debit')" @dblclick="$refs.accountDialog.dialogIsShow = true, accCodeType = 'D'" v-model="accCodeDebit">
                                        <template v-slot:append>
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on }">
                                                    <v-icon v-on="on" :color="currentTheme" @click="$refs.accountDialog.dialogIsShow = true, accCodeType = 'D'">mdi-window-restore</v-icon>
                                                </template>
                                                <span>{{ $t('show_account') }}</span>
                                            </v-tooltip>
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on }">
                                                    <v-icon v-on="on" :color="currentTheme" @click="accCodeDebitPK = '', accCodeDebit = '', accCodeType = null">mdi-eraser</v-icon>
                                                </template>
                                                <span>{{ $t('reset') }}</span>
                                            </v-tooltip>
                                        </template>
                                    </v-text-field>
                                </v-col>
                                <!-- Account Code Credit -->
                                <v-col cols="4" class="pb-2">
                                    <v-text-field outlined dense hide-details readonly :label="$t('acc_code_credit')" @dblclick="$refs.accountDialog.dialogIsShow = true, accCodeType = 'C'" v-model="accCodeCredit">
                                        <template v-slot:append>
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on }">
                                                    <v-icon v-on="on" :color="currentTheme" @click="$refs.accountDialog.dialogIsShow = true, accCodeType = 'C'">mdi-window-restore</v-icon>
                                                </template>
                                                <span>{{ $t('show_account') }}</span>
                                            </v-tooltip>
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on }">
                                                    <v-icon v-on="on" :color="currentTheme" @click="accCodeCreditPK = '', accCodeCredit = '', accCodeType = null">mdi-eraser</v-icon>
                                                </template>
                                                <span>{{ $t('reset') }}</span>
                                            </v-tooltip>
                                        </template>
                                    </v-text-field>
                                </v-col>
                            </v-row>
                            <v-row dense align="center" justify="space-between">
                                <!-- Direct Code -->
                                <v-col cols="3" class="pb-2">
                                    <v-text-field outlined dense hide-details readonly :label="$t('direct_code')" @dblclick="openCodeDialog('direct')" v-model="directCode" disabled>
                                        <template v-slot:append>
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on }">
                                                    <v-icon v-on="on" :color="currentTheme" @click="openCodeDialog('direct')">mdi-window-restore</v-icon>
                                                </template>
                                                <span>{{ $t('get_code') }}</span>
                                            </v-tooltip>
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on }">
                                                    <v-icon v-on="on" :color="currentTheme" @click="directCodePK = '', directCode = '', codeType = null">mdi-eraser</v-icon>
                                                </template>
                                                <span>{{ $t('reset') }}</span>
                                            </v-tooltip>
                                        </template>
                                    </v-text-field>
                                </v-col>
                                <!-- Indirect Code -->
                                <v-col cols="3" class="pb-2">
                                    <v-text-field outlined dense hide-details readonly :label="$t('indirect_code')" @dblclick="openCodeDialog('indirect')" v-model="inDirectCode">
                                        <template v-slot:append>
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on }">
                                                    <v-icon v-on="on" :color="currentTheme" @click="openCodeDialog('indirect')">mdi-window-restore</v-icon>
                                                </template>
                                                <span>{{ $t('get_code') }}</span>
                                            </v-tooltip>
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on }">
                                                    <v-icon v-on="on" :color="currentTheme" @click="inDirectCodePK = '', inDirectCode = '', codeType = null">mdi-eraser</v-icon>
                                                </template>
                                                <span>{{ $t('reset') }}</span>
                                            </v-tooltip>
                                        </template>
                                    </v-text-field>
                                </v-col>
                                <!-- Voucher No/Seq -->
                                <v-col cols="4">
                                    <v-row align="center" justify="space-between" no-gutters>
                                        <v-col md="6">
                                            <v-text-field outlined clearable dense hide-details :label="$t('voucher_no')" v-model="voucherNo"></v-text-field>
                                        </v-col>
                                        <v-col md="6" class="pl-2">
                                            <v-text-field outlined clearable dense hide-details :label="$t('seq')" v-model="seq"></v-text-field>
                                        </v-col>
                                    </v-row>
                                </v-col>
                                <!-- Buttons -->
                                <v-col cols="2" class="text-sm-right text-center">
                                    <!-- Search -->
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on }">
                                            <v-btn icon tile v-on="on" :color="currentTheme" :disabled="isProcessing" @click="search">
                                                <v-icon>mdi-magnify</v-icon>
                                            </v-btn>
                                        </template>
                                        <span>{{ $t("search") }}</span>
                                    </v-tooltip>
                                    <!-- Print Report -->
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on }">
                                            <v-btn icon tile v-on="on" :color="currentTheme" :disabled="isProcessing" @click="OnPrint">
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
          <v-row dense class="pa-1">
              <v-col cols="12">
                  <DataGridView ref="deInquiryGrid" :header="deInquiryHeaders" sel_procedure="AC_SEL_6030080_DAILY_CF" select_mode="Single" @setDataSource="afterLoad()" :filter_paras="[
                      this.selectedCompany, 
                      this.seq, 
                      this.voucherNo, 
                      this.proposedFrom, 
                      this.proposedTo, 
                      this.accCodeDebitPK, 
                      this.accCodeCreditPK, 
                      this.status, 
                      this.directCodePK, 
                      this.inDirectCodePK, 
                      this.selectedDNDT,
                      this.lstBizPlace 
                    ]" 
                    :is_allow_paste="false" :max_height="limitHeight" @cellDblClick="onCellDblClick" :filterRow="true" />
              </v-col>
          </v-row>
         <account-dialog ref="accountDialog" @returnAccountInfo="handleReturnedAccount" :acc_type="sel_SumPos"></account-dialog>
         <dynamic-dialog ref="directIndirectCodeDialog" :autoSearch="true" :dialogTitle="dialogTitle" :codeLabel="$t('code')" :nameLabel="$t('name')" :procedure="'AC_SEL_DIRECT_INDIRECT_CODE'" :moreParas="moreParas" @returnData="handleReturnedCode"></dynamic-dialog>
         <GwLoading :visible="showLoading" />
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "cash-flow-dialog",

  props: {
    headers: {
      type: Array
    },
    companyPK: {
        type: Number,
        default: 0
    },
    hideSelect:{
      type: Boolean,
      default: true
    },
    p_cf_cd: {
      type: String , default: ""
    },
    p_month: {
      type: String , default: ""
    },
  },
    layout: "default",
    middleware: "user",

    components: {
        accountDialog: () => import("@/components/dialog/AccountDialog"),
        datePicker: () => import("@/components/control/DatePicker"),
        DailySlDialog: () => import("@/components/dialog/DailySlDialog"),
        DynamicDialog: () => import("@/components/dialog/DynamicDialog"),
        GwLoading: () => import("@/components/control/GwLoading")
    },
    data: () => ({
        dialogIsShow: false,
        companyList: [],
        selectedCompany: null,
        voucherNo: '',
        seq: '',
        languageList: [],
        selectedLang: 'VIE',
        status: '2',
        proposedFrom: '',
        proposedTo: '',
        dndtList: [],
        selectedDNDT: '',
        accCodeDebitPK: '',
        accCodeDebit: '',
        accCodeCreditPK: '',
        accCodeCredit: '',
        accCodeType: null,

        directCodePK: '',
        directCode: '',
        inDirectCodePK: '',
        inDirectCode: '',
        dialogTitle: '',

        codeType: null,
        moreParas: [],

        reportTypeList: [],
        selectedReportType: '',
        forEditing: false,
        selectedItemPK: null,
        itemClickRow: "",
        month: "",
        dateType: "month",
        bizPlaceList: [],
        lstBizPlace: "",
        sel_SumPos: "%",
        
        showLoading: false,
    }),

    watch: {
      dialogIsShow(val) {
          if (val === true) {
              this.directCodePK = this.p_cf_cd;
              this.directCode = this.p_cf_cd;
              this.month = this.p_month;
              this.search();
          }
          else {
            this.$refs.deInquiryGrid.Clear();
          }
        },
        _language(val) {
            this.selectedLanguage = val
        },
        month(val) {
            if (val) {
                this.proposedFrom = val + "01";
                this.proposedTo = val + this._maxDateOfMonth(val);
            }
        },
        selectedConvertCCY(val) {
            this.getExchangeRate(this.to_date, this.selectedCompany, val);
        },
    },
    async created() {
       this.getListCodes();
    },
    computed: {
         user() {
            return this.$store.getters["auth/user"]
        },
        limitHeight() {
            if (this.$vuetify.breakpoint.lgAndUp) {
                return this.windowHeight - 330
            }
            return this.windowHeight - 500
        },
        statusList() {
            return [{
                    VALUE: '2',
                    TEXT: this.$t('confirmed')
                },
                {
                    VALUE: '6',
                    TEXT: this.$t('confirmed_budget')
                },
            ]
        },
        deInquiryHeaders() {
            const self = this
            return [{
                    dataField: "STT",
                    caption: this.$t('stt'),
                    allowEditing: false
                },
                {
                    dataField: "H_PK",
                    caption: this.$t('seq'),
                    allowEditing: false
                },
                {
                    dataField: "TR_DATE",
                    caption: this.$t('tr_date'),
                    dataType: "date",
                    format: this.curLang.DATE_FORMAT,
                    allowEditing: false,
                    width:80
                },
                {
                    dataField: "VOUCHERNO",
                    caption: this.$t('voucher_no'),
                    allowEditing: false
                },
                {
                    caption: this.$t('acc_code'),
                    alignment: 'center',
                    columns: [{
                            dataField: "ACDR",
                            caption: this.$t('debit'),
                            allowEditing: false
                        },
                        {
                            dataField: "ACCR",
                            caption: this.$t('credit'),
                            allowEditing: false
                        }
                    ]
                },
                {
                    caption: this.$t('amount'),
                    alignment: 'center',
                    columns: [{
                            dataField: "TR_AMT",
                            caption: this.$t('trans'),
                            allowEditing: false,
                            dataType: "number",
                            formatFloat: 2,
                            summaryType: "sum",
                        },
                        {
                            dataField: "TR_BOOKAMT",
                            caption: this.$t('books'),
                            allowEditing: false,
                            dataType: "number",
                            formatFloat: 2,
                            summaryType: "sum",
                        }
                    ]
                },
                {
                    caption: this.$t('description'),
                    alignment: 'center',
                    columns: [{
                            dataField: "REMARK",
                            caption: this.$t('local'),
                            allowEditing: false,
                            width:200
                        },
                        {
                            dataField: "REMARK2",
                            caption: this.$t('foreign'),
                            allowEditing: false,
                            width:200
                        }
                    ]
                }
            ]
        },
    },

    methods: {
        async getListCodes() {
            const dso_company_list = {
                type: 'list',
                selpro: 'SYS_SEL_LIST_COMPANY',
                para: [this.user.PK]
            }
            this.companyList = await this._dsoCall(dso_company_list, 'select', false)
            this.selectedCompany = this.companyList[0].PK
            this.languageList = await this._getCommonCode('COAB0070')
            this.selectedLang = this._language;
            this.dndtList = await this._getCommonCode('EACAB058')
            if (this.dndtList.length) {
                this.selectedDNDT = this.dndtList[0].CODE
            }
            this.reportTypeList = await this._getCommonCode('EACBK043')
            if (this.reportTypeList.length) {
                this.selectedReportType = this.reportTypeList[0].CODE
            }
            const dso_bizplace_list = {
                type: 'list',
                selpro: 'SYS_SEL_BIZ_PLACE_V2',
                para: [this.selectedCompany, this.user.PK]
            }
            this.bizPlaceList = await this._dsoCall(dso_bizplace_list, 'select', false)
            if (this.bizPlaceList.length > 0) {
                this.lstBizPlace = this.bizPlaceList[0].PK;
            }
        },
        async onChangeCompany() {
            this.bizPlaceList = [];
            const dso_bizplace_list = {
                type: 'list',
                selpro: 'SYS_SEL_BIZ_PLACE_v2',
                para: [this.selectedCompany, this.user.PK]
            }
            this.bizPlaceList = await this._dsoCall(dso_bizplace_list, 'select', false)
            if (this.bizPlaceList.length > 0) {
                this.lstBizPlace = this.bizPlaceList[0].PK;
            }
            this.search();
        },
        async search() {
            setTimeout(() => {
                this.showLoading = true;
                this.$refs.deInquiryGrid.loadData();
            }, 500); 
        },
        afterLoad(){
             this.showLoading = false;
        },
        onCellDblClick(row) {
            this.forEditing = true
            console.log(row);
            this.itemClickRow = row;
            // this.selectedItemPK = key
            this.selectedItemPK = row.data.R_PK;
            if (row.rowType === "data") {
                if (row.column.dataField === "CF_CODE") {
                    this.openCodeDialog('direct')
                }
                if (row.column.dataField === "CF_ICODE") {
                    this.openCodeDialog('indirect')
                }
            }
        },

        handleReturnedAccount(data) {
            if (this.accCodeType === "D") {
                this.accCodeDebitPK = data.PK
                this.accCodeDebit = `${data.AC_CD} - ${data.AC_NM}`
            } else {
                this.accCodeCreditPK = data.PK
                this.accCodeCredit = `${data.AC_CD} - ${data.AC_NM}`
            }
        },

        openCodeDialog(type) {
            this.$refs.directIndirectCodeDialog.dialogIsShow = true
            this.codeType = type
            if (type === 'direct') {
                this.dialogTitle = this.$t('direct_code')
                this.moreParas = ['EACAB022']
            } else {
                this.dialogTitle = this.$t('indirect_code')
                this.moreParas = ['EACAB026']
            }
        },

        handleReturnedCode(data) {
            if (!this.forEditing) {
                if (this.codeType === 'direct') {
                    this.directCodePK = data.CODE
                    this.directCode = `${data.CODE} - ${data.NAME}`
                } else {
                    this.inDirectCodePK = data.CODE
                    this.inDirectCode = `${data.CODE} - ${data.NAME}`
                }
            } 
        },
        async OnPrint() {
            var report_info = this.reportTypeList.find(x => x.CODE == this.selectedReportType);
            var company_info = this.companyList.find(x => x.PK == this.selectedCompany);
            if (report_info.VAL1 == "" || report_info.VAL1 == "null" || report_info.VAL1 == null || report_info.VAL1 == undefined) {
                var MSG_ERR = "PLS_REGISTER_REPORT_ID_WITH_COMONCODE_" + "EACBK043";
                this.$refs.alertDialog.showAlert("error", "Error", MSG_ERR);
                return;
            }
            var param = [{
                P_RPT_ID: report_info.VAL1,
                P_RPT_URL: report_info.VAL2,
                P_RPT_FILE: report_info.VAL3,
                P_COMP_ID: company_info.PARTNER_ID,
                P_COMP_NM: company_info.TEXT,
                P_COMP_TAX: company_info.TAX_CODE,
                P_COMP_ADD: company_info.ADDR1,
                P_COMPANY: this.selectedCompany,
                P_FR_DATE: this.proposedFrom,
                P_FR_TO: this.proposedTo,
                P_VOUCHER_NO: this.voucherNo,
                P_SEQ: this.seq,
                P_STATUS: this.status,
                P_ACC_DR_PK: this.accCodeDebitPK,
                P_ACC_CR_PK: this.accCodeCreditPK,
                P_DIRECTCODE_PK: this.directCodePK,
                P_InDIRECTCODE_PK: this.inDirectCodePK,
                P_LANG: this.selectedLang
            }];
            var file_nm = report_info.VAL1 + "_" + report_info.NAME + "_" + this.user.USER_ID + ".xlsx";
            var url_path = "/report/" + report_info.VAL1 + "/" + report_info.VAL3;

            try {
                const result = await this.$axios.$get(url_path, {
                    responseType: "blob",
                    params: {
                        para: param
                    }
                });
                if (result) {

                    this._ExcelSaveAs(result, file_nm);
                } else {
                    this.showNotification("danger", this.$t("fail_to_export_report"), "", 4000);
                }
            } catch (e) {
                this.showNotification("danger", e.message, "", 4000);
            }
        },
    }
};
</script>
