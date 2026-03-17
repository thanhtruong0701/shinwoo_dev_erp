<template>
<div>
    <v-dialog id="daily-sl-dialog" max-width="1400" v-model="dialogIsShow">
        <v-card>
            <v-card-title class="headline primary-gradient white--text py-2">
                <span>{{ $t("daily_sl") }}</span>
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
                                            <v-col lg="2" sm="3" cols="12" class="pb-2">
                                                <BaseSelect :label="$t('company')" v-model="selectedCompany" :lstData="companyList" item-text="TEXT" item-value="PK" acntoutline />
                                            </v-col>
                                            <v-col lg="2" sm="3" cols="12" class="pb-2">
                                                <BaseSelect :label="$t('biz_place')" v-model="lstBizPlace" :lstData="bizPlaceList" item-text="TEXT" item-value="PK" acntoutline />
                                            </v-col>
                                            <v-col cols="2" v-show="chkBizCenter">
                                                <BaseSelect :label="$t('biz_center')" v-model="selBizCenter" :lstData="cboBizCenter" item-text="NAME" item-value="PK" />
                                            </v-col>
                                            <!-- Account Code -->
                                            <v-col lg="2" sm="3" cols="12" class="pb-2">
                                                <BaseInput :label="$t('acc_code')" v-model="accCode" acntoutline @keyPressEnter="search">
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
                                                </BaseInput>
                                            </v-col>
                                            <!-- Language -->
                                            <v-col lg="1" sm="3" cols="12" class="pb-2">
                                                <BaseSelect :label="$t('language')" v-model="selectedLang" :lstData="selectedLanguage" item-text="NAME" item-value="CODE" acntoutline />
                                            </v-col>
                                            <!-- Currency -->
                                            <v-col lg="1" sm="3" cols="12" class="pb-2">
                                                <BaseSelect :label="$t('currency')" v-model="selectedCurrency" :lstData="currencyList" item-text="NAME" item-value="CODE" acntoutline />
                                            </v-col>
                                            <!-- Report Option -->
                                            <v-col lg="2" sm="3" cols="12" class="pb-2">
                                                <BaseSelect :label="$t('report_option')" v-model="selectedReportOpt" :lstData="reportOptionList" item-text="NAME" item-value="CODE" acntoutline />
                                            </v-col>
                                        </v-row>

                                        <v-row dense align="center" justify="space-between">
                                            <!-- Proposed From -->
                                            <v-col lg="1" sm="3" cols="12" class="pb-sm-0 pb-2">
                                                <BaseDatePicker start :label="$t('approve_from')" v-model="proposeFrom" acntoutline />
                                            </v-col>
                                            <!-- Proposed To -->
                                            <v-col lg="1" sm="3" cols="12" class="pb-sm-0 pb-2">
                                                <BaseDatePicker :label="$t('approve_to')" v-model="proposeTo" acntoutline end />
                                            </v-col>
                                            <!-- Slip Status -->
                                            <v-col lg="1" sm="3" cols="12">
                                                <BaseSelect :label="$t('status')" v-model="selectedStatus" :lstData="statusList" item-text="NAME" item-value="CODE" acntoutline />
                                            </v-col>
                                            <!-- Inquiry Type -->
                                            <v-col lg="2" sm="3" cols="12">
                                                <BaseSelect :label="$t('inquiry_type')" v-model="inquiryType" :lstData="inquiryTypeList" item-text="NAME" item-value="CODE" acntoutline />
                                            </v-col>
                                            <!-- Amount Type -->
                                            <v-col lg="2" sm="3" cols="12">
                                                <BaseSelect :label="$t('amt_type')" v-model="amtType" :lstData="amtTypeList" item-text="NAME" item-value="CODE" acntoutline />
                                            </v-col>
                                            <!-- Report Type -->
                                            <v-col lg="2" sm="3" cols="12">
                                                <BaseSelect :label="$t('report_type')" v-model="selectedReportType" :lstData="reportTypeList" item-text="NAME" item-value="CODE" acntoutline />
                                            </v-col>
                                            <!-- Buttons -->
                                            <v-col lg="2" sm="3" cols="12" class="text-sm-right text-center">
                                                <!-- Search -->
                                                <div class="d-flex justify-end">
                                                    <BaseButton icon_type="search" :btn_text="$t('search')" @onclick="search" :disabled="isProcessing" />
                                                </div>
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
                                    <!-- <DxDataGrid column-resizing-mode="widget" ref="slDateVoucherGrid" :allow-column-resizing="true" :column-auto-width="$vuetify.breakpoint.smAndDown" 
                                    :columns="slDateVoucherHeaders" :data-source="slDateVoucherDataList" 
                                    :height="limitHeight/2" :loadPanel="{ enabled: true, text: $t('is_loading', 'common') }" 
                                    :onRowDblClick="onRowDblClick" :selection="{ mode: 'single' }" :show-borders="true" :show-column-lines="true" :show-row-lines="true">
                                        <DxPaging :page-size="slDateVoucherDataList.length" v-if="slDateVoucherDataList.length < 500" />
                                        <DxScrolling mode="infinite" v-else />
                                    </DxDataGrid> -->
                                    <DataGridView ref="slDateVoucherGrid" :header="slDateVoucherHeaders" :sel_procedure="store_pro" select_mode="Single" :auto_load="false" :filter_paras="grdDPara" :is_allow_paste="false" :max_height="limitHeight/2 + 100" @onRowPrepared="onRowPrepared" @cellDblClick="onRowDblClick" @setDataSource="afterLoad" />
                                </v-card>
                            </v-col>
                            <!-- Sum -->
                            <v-col cols="12" class="pb-0">
                                <v-card outlined tile v-resize="onResize">
                                    <DataGridView ref="slSumGrid" :header="slSumHeaders" :sel_procedure="grdSumSelPro" select_mode="Single" :filter_paras="grdSPara" :is_allow_paste="false" :max_height="limitHeight/2 " @setDataSource="onAfterLoad" />
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
</div>
</template>

<script>
export default {
    name: 'daily-sl-dialog',
    props: ["companyPK", "accountItem", "fromDate", "toDate", "status", "ccy", "bizPlace", "bizCenter"],

    components: {
        DatePicker: () => import("@/components/control/DatePicker"),
        AccountDialog: () => import("@/components/dialog/AccountDialog"),
        AccountSlipDialog: () => import("@/components/dialog/AccountSlipDialog")
    },

    data: () => ({
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
        selectedLanguage: [],
        slDateVoucherDataList: [],
        slSumDataList: [],
        seqArray: [],
        currentSeq: null,
        bizPlaceList: [],
        lstBizPlace: "",
        selectedStatus: "2",
        statusList: [],
        openingBalance: 0,
        tr_openingBalance: 0,
        store_pro: "",
        txt_Bookccy: "",
        txt_Transccy: "",
        l_decimal_after_point: 0,
        cboBizCenter: [],
        selBizCenter: ""
    }),

    computed: {
        user() {
            return this.$store.getters["auth/user"]
        },
        limitHeight() {
            return this.windowHeight * 0.5
        },
        slDateVoucherHeaders() {
            const self = this;
            if (this.dialogIsShow === true) {
                if (this.inquiryType === 'dates') {
                    return [{
                            dataField: "FDATE",
                            caption: this.$t('f_date'),
                            dataType: "date",
                            format: this.curLang.DATE_FORMAT
                        },
                        {
                            dataField: "CCY",
                            caption: this.$t('ccy')
                        },
                        {
                            dataField: "OPEN_BAL",
                            caption: this.$t('op_balance'),
                            dataType: "number",
                            width: 300,
                            formatFloat: this.txt_Bookccy == 'VND' ? 0 : 2,
                        },
                        {
                            caption: this.$t('trans'),
                            alignment: 'center',
                            columns: [{
                                    dataField: "TR_AMT_DR",
                                    caption: this.$t('debit'),
                                    width: this.amtType == 'books' ? "0" : "100",
                                    dataType: "number",
                                    formatFloat: 2
                                },
                                {
                                    dataField: "TR_AMT_CR",
                                    caption: this.$t('credit', 'common'),
                                    width: this.amtType == 'books' ? "0" : "100",
                                    dataType: "number",
                                    formatFloat: 2
                                }
                            ]
                        },
                        {
                            caption: this.$t('books'),
                            alignment: 'center',
                            columns: [{
                                    dataField: "BK_AMT_DR",
                                    caption: this.$t('debit', 'common'),
                                    dataType: "number",
                                    formatFloat: this.txt_Bookccy == 'VND' ? 0 : 2,
                                    width: this.amtType == 'trans' ? "0" : "100",
                                },
                                {
                                    dataField: "BK_AMT_CR",
                                    caption: this.$t('credit'),
                                    dataType: "number",
                                    formatFloat: this.txt_Bookccy == 'VND' ? 0 : 2,
                                    width: this.amtType == 'trans' ? "0" : "100",
                                }
                            ]
                        },
                        {
                            dataField: "CLOSINGBALANCE",
                            caption: this.$t('cfm_balance'),
                            dataType: "number",
                            formatFloat: this.txt_Bookccy == 'VND' ? 0 : 2,
                        }
                    ]
                } else {
                    return [{
                            dataField: "PK",
                            caption: this.$t("seq")
                        },
                        {
                            dataField: "VOUCHER_NO",
                            caption: this.$t("voucher_no")
                        },
                        {
                            dataField: "STD_YMD",
                            caption: this.$t("trans_date"),
                            dataType: "date",
                            format: this.curLang.DATE_FORMAT
                        },
                        {
                            dataField: "CRT_BY",
                            caption: this.$t("crt_by")
                        },
                        {
                            dataField: "CCY",
                            caption: this.$t("ccy")
                        },
                        {
                            dataField: "",
                            caption: this.$t("account"),
                            columns: [{
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
                            dataField: "",
                            caption: this.$t("account_offset"),
                            columns: [{
                                    dataField: "AC_CD_OFFSET",
                                    caption: this.$t("code")
                                },
                                {
                                    dataField: "AC_NM_OFFSET",
                                    caption: this.$t("name")
                                }
                            ]
                        },{
                            dataField: "",
                            caption: this.$t("pl"),
                            columns: [{
                                    dataField: "PL_CD",
                                    caption: this.$t("code")
                                },
                                {
                                    dataField: "PL_NM",
                                    caption: this.$t("name")
                                }
                            ], 
                            visible: this.chkBizCenter

                        },
                        {
                            dataField: "OPEN_BAL",
                            caption: this.$t("open_bal"),
                            visible: (this.amtType == "trans" ? false : true),
                            alignment: "right",
                            dataType: "number",
                            formatFloat: 2,
                        },
                        {
                            dataField: "",
                            caption: this.$t("books"),
                            visible: (this.amtType == "trans" ? false : true),
                            columns: [{
                                    dataField: "BK_AMT_DR",
                                    caption: this.$t("debit"),
                                    alignment: "right",
                                    dataType: "number",
                                    formatFloat: this.l_decimal_after_point,
                                },
                                {
                                    dataField: "BK_AMT_CR",
                                    caption: this.$t("credit"),
                                    alignment: "right",
                                    dataType: "number",
                                    formatFloat: this.l_decimal_after_point,
                                }
                            ]
                        },
                        {
                            dataField: "END_BAL",
                            caption: this.$t("end_bal"),
                            visible: (this.amtType == "trans" ? false : true),
                            alignment: "right",
                            dataType: "number",
                            formatFloat: this.l_decimal_after_point,
                        },
                        {
                            dataField: "TR_OPEN_BAL",
                            caption: this.$t("tr_open_bal"),
                            visible: (this.amtType == "books" ? false : true),
                            alignment: "right",
                            dataType: "number",
                            formatFloat: 2,
                        },
                        {
                            dataField: "",
                            caption: this.$t("trans"),
                            visible: (this.amtType == "books" ? false : true),
                            columns: [{
                                    dataField: "TR_AMT_DR",
                                    caption: this.$t("debit"),
                                    alignment: "right",
                                    dataType: "number",
                                    formatFloat: 2,
                                },
                                {
                                    dataField: "TR_AMT_CR",
                                    caption: this.$t("credit"),
                                    alignment: "right",
                                    dataType: "number",
                                    formatFloat: 2,
                                }
                            ]
                        },
                        {
                            dataField: "TR_END_BAL",
                            caption: this.$t("tr_end_bal"),
                            visible: (this.amtType == "books" ? false : true),
                            alignment: "right",
                            dataType: "number",
                            formatFloat: 2,
                        },
                        {
                            dataField: "PARTNER_NAME",
                            caption: this.$t("partner_name")
                        },
                        {
                            dataField: "PARTNER_NAME_OFFSET",
                            caption: this.$t("partner_name_offset")
                        },
                        {
                            dataField: "",
                            caption: this.$t("description"),
                            columns: [{
                                    dataField: "DESCRIPTION_ENG",
                                    caption: this.$t("foreign")
                                },
                                {
                                    dataField: "DESCRIPTION_LOCAL",
                                    caption: this.$t("local")
                                }
                            ]
                        }
                    ]
                }
            }
        },
        slSumHeaders() {
            if (this.dialogIsShow === true) {
                return [{
                        dataField: "CCY",
                        caption: this.$t("ccy")
                    },
                    {
                        dataField: "OPEN_BAL",
                        caption: this.$t("open_bal"),
                        visible: (this.amtType == "trans" ? false : true),
                        alignment: "right",
                        dataType: "number",
                        formatFloat: this.l_decimal_after_point,
                    }, {
                        dataField: "",
                        caption: this.$t("books"),
                        visible: (this.amtType == "trans" ? false : true),
                        columns: [{
                                dataField: "BK_AMT_DR",
                                caption: this.$t("debit"),
                                visible: (this.amtType == "trans" ? false : true),
                                alignment: "right",
                                dataType: "number",
                                formatFloat: this.l_decimal_after_point,
                            },
                            {
                                dataField: "BK_AMT_CR",
                                caption: this.$t("credit"),
                                visible: (this.amtType == "trans" ? false : true),
                                alignment: "right",
                                dataType: "number",
                                formatFloat: this.l_decimal_after_point,
                            }
                        ]
                    },
                    {
                        dataField: "END_BAL",
                        caption: this.$t("end_bal"),
                        alignment: "right",
                        visible: (this.amtType == "trans" ? false : true),
                        alignment: "right",
                        dataType: "number",
                        formatFloat: this.l_decimal_after_point,
                    },
                    {
                        dataField: "OPEN_BAL_TR",
                        caption: this.$t("open_bal_tr"),
                        alignment: "right",
                        visible: (this.amtType == "books" ? false : true),
                        alignment: "right",
                        dataType: "number",
                        formatFloat: 2,
                    },
                    {
                        dataField: "",
                        caption: this.$t("trans"),
                        visible: (this.amtType == "books" ? false : true),
                        columns: [{
                                dataField: "TR_AMT_DR",
                                caption: this.$t("debit"),
                                visible: (this.amtType == "books" ? false : true),
                                alignment: "right",
                                dataType: "number",
                                formatFloat: 2,
                            },
                            {
                                dataField: "TR_AMT_CR",
                                caption: this.$t("credit"),
                                visible: (this.amtType == "books" ? false : true),
                                alignment: "right",
                                dataType: "number",
                                formatFloat: 2,
                            }
                        ]
                    },
                    {
                        dataField: "END_BAL_TR",
                        caption: this.$t("end_bal_tr"),
                        visible: (this.amtType == "books" ? false : true),
                        alignment: "right",
                        dataType: "number",
                        formatFloat: 2,
                    }
                ]
            }
        },
        slDateVoucherHeaders_BK() {
            const self = this;
            if (this.dialogIsShow === true) {
                if (this.inquiryType === 'dates') {
                    return [{
                            dataField: "FDATE",
                            caption: this.$t('f_date', 'common'),
                            dataType: "date",
                            format: this.curLang.DATE_FORMAT
                        },
                        {
                            dataField: "CCY",
                            caption: this.$t('ccy', 'common')
                        },
                        {
                            dataField: "OPENINGBALANCE",
                            caption: this.$t('op_balance', 'common'),
                            dataType: "number",
                            width: 300,
                            formatFloat: this.txt_Bookccy == 'VND' ? 0 : 2,
                        },
                        {
                            caption: this.$t('trans', 'common'),
                            alignment: 'center',
                            columns: [{
                                    dataField: "DEBITTRANSAMOUNT",
                                    caption: this.$t('debit', 'common'),
                                    width: this.amtType == 'books' ? "0" : "100",
                                    alignment: "right",
                                },
                                {
                                    dataField: "CREDITTRANSAMOUNT",
                                    caption: this.$t('credit', 'common'),
                                    width: this.amtType == 'books' ? "0" : "100",
                                    alignment: "right",
                                }
                            ]
                        },
                        {
                            caption: this.$t('books', 'common'),
                            alignment: 'center',
                            columns: [{
                                    dataField: "DEBITBOOKAMOUNT",
                                    caption: this.$t('debit', 'common'),
                                    dataType: "number",
                                    formatFloat: this.txt_Bookccy == 'VND' ? 0 : 2,
                                    width: this.amtType == 'trans' ? "0" : "100",
                                },
                                {
                                    dataField: "CREDITBOOKAMOUNT",
                                    caption: this.$t('credit', 'common'),
                                    dataType: "number",
                                    formatFloat: this.txt_Bookccy == 'VND' ? 0 : 2,
                                    width: this.amtType == 'trans' ? "0" : "100",
                                }
                            ]
                        },
                        {
                            dataField: "CLOSINGBALANCE",
                            caption: this.$t('cfm_balance', 'common'),
                            dataType: "number",
                            formatFloat: this.txt_Bookccy == 'VND' ? 0 : 2,
                        }
                    ]
                } else {
                    return [{
                            dataField: "PK",
                            caption: this.$t('seq', 'common')
                        },
                        {
                            dataField: "VOUCHERNO",
                            caption: this.$t('voucher_no', 'common')
                        },
                        {
                            dataField: "TR_DATE",
                            caption: this.$t('proposed_date', 'common'),
                            dataType: "date",
                            format: this.curLang.DATE_FORMAT
                        },
                        {
                            dataField: "USER_ID",
                            caption: this.$t('proposed_by', 'common')
                        },
                        {
                            dataField: "CCY",
                            caption: this.$t('ccy', 'common')
                        },
                        {
                            dataField: "OPENINGBALANCE",
                            caption: this.$t('op_balance', 'common'),
                            dataType: "number",
                            formatFloat: this.txt_Bookccy == 'VND' ? 0 : 2,
                        },
                        {
                            caption: this.$t('trans', 'common'),
                            alignment: 'center',
                            columns: [{
                                    dataField: "DEBITTRANSAMOUNT",
                                    caption: this.$t('debit', 'common'),
                                    width: this.amtType == 'books' ? "0" : "100",
                                    alignment: "right",
                                },
                                {
                                    dataField: "CREDITTRANSAMOUNT",
                                    caption: this.$t('credit', 'common'),
                                    width: this.amtType == 'books' ? "0" : "100",
                                    alignment: "right",
                                }
                            ]
                        },
                        {
                            caption: this.$t('books', 'common'),
                            alignment: 'center',
                            columns: [{
                                    dataField: "DEBITBOOKAMOUNT",
                                    caption: this.$t('debit', 'common'),
                                    dataType: "number",
                                    formatFloat: this.txt_Bookccy == 'VND' ? 0 : 2,
                                    width: this.amtType == 'trans' ? "0" : "100",
                                },
                                {
                                    dataField: "CREDITBOOKAMOUNT",
                                    caption: this.$t('credit', 'common'),
                                    dataType: "number",
                                    formatFloat: this.txt_Bookccy == 'VND' ? 0 : 2,
                                    width: this.amtType == 'trans' ? "0" : "100",
                                }
                            ]
                        },
                        {
                            dataField: "CLOSINGBALANCE",
                            caption: this.$t('cfm_balance', 'common'),
                            dataType: "number",
                            formatFloat: this.txt_Bookccy == 'VND' ? 0 : 2,
                        },
                        {
                            dataField: "CUSTOMER",
                            caption: this.$t('customer_name', 'common')
                        },
                        {
                            caption: this.$t('description', 'common'),
                            alignment: 'center',
                            columns: [{
                                    dataField: "REMARK",
                                    caption: this.$t('foreign', 'common')
                                },
                                {
                                    dataField: "REMARK2",
                                    caption: this.$t('local', 'common')
                                }
                            ]
                        }
                    ]
                }
            }
        },
        slSumHeaders_BK() {
            if (this.dialogIsShow === true) {
                return [{
                        dataField: "OPENINGBALANCE",
                        caption: this.$t('op_balance', 'common'),
                        dataType: "number",
                        formatFloat: this.txt_Bookccy == 'VND' ? 0 : 2,
                    },
                    {
                        dataField: "CCY",
                        caption: this.$t('ccy', 'common')
                    },
                    {
                        caption: this.$t('trans', 'common'),
                        alignment: 'center',
                        columns: [{
                                dataField: "DEBITTRANSAMOUNT",
                                caption: this.$t('debit', 'common'),
                                width: this.amtType == 'books' ? "0" : "120",
                                alignment: "right",
                            },
                            {
                                dataField: "CREDITTRANSAMOUNT",
                                caption: this.$t('credit', 'common'),
                                width: this.amtType == 'books' ? "0" : "120",
                                alignment: "right",
                            }
                        ]
                    },
                    {
                        caption: this.$t('books', 'common'),
                        alignment: 'center',
                        columns: [{
                                dataField: "DEBITBOOKAMOUNT",
                                caption: this.$t('debit', 'common'),
                                dataType: "number",
                                formatFloat: this.txt_Bookccy == 'VND' ? 0 : 2,
                                width: this.amtType == 'trans' ? "0" : "120",
                            },
                            {
                                dataField: "CREDITBOOKAMOUNT",
                                caption: this.$t('credit', 'common'),
                                dataType: "number",
                                formatFloat: this.txt_Bookccy == 'VND' ? 0 : 2,
                                width: this.amtType == 'trans' ? "0" : "120",
                            }
                        ]
                    },
                    {
                        dataField: "CLOSINGBALANCE",
                        caption: this.$t('cfm_balance', 'common'),
                        dataType: "number",
                        formatFloat: this.txt_Bookccy == 'VND' ? 0 : 2,
                    }
                ]
            }
        },
        inquiryTypeList() {
            return [{
                    CODE: "dates",
                    NAME: this.$t("Date")
                },
                {
                    CODE: "vouchers",
                    NAME: this.$t("Voucher")
                }
            ];
        },
        amtTypeList() {
            return [{
                    CODE: "trans",
                    NAME: this.$t("Transaction")
                },
                {
                    CODE: "books",
                    NAME: this.$t("book")
                },
                {
                    CODE: "trans-book",
                    NAME: this.$t("trans_book")
                }
            ];
        },
        grdSumSelPro() {
            let _grdSumSelPro = "AC_SEL_DAILY_SL_DIALOG_SUM";
            if (this.bizCenter == "" || this.bizCenter == null || this.bizCenter == undefined || this.bizCenter == "null") {
                _grdSumSelPro = "AC_SEL_DAILY_SL_DIALOG_SUM";
            } else {
                _grdSumSelPro = "AC_SEL_DLSL_PL_SUM_NC";
            }
            return _grdSumSelPro;
        },
        grdDPara() {
            let _grdDPara = [this.selectedCompany, this.accCodePK, this.proposeFrom, this.proposeTo, this.slipStatus, this.selectedCurrency, this.openingBalance, this.tr_openingBalance, this.lstBizPlace];
            if (this.bizCenter == "" || this.bizCenter == null || this.bizCenter == undefined || this.bizCenter == "null") {
                _grdDPara = [this.selectedCompany, this.accCodePK, this.proposeFrom, this.proposeTo, this.slipStatus, this.selectedCurrency, this.openingBalance, this.tr_openingBalance, this.lstBizPlace]
            } else {
                _grdDPara = [this.selectedCompany, this.accCodePK, this.proposeFrom, this.proposeTo, this.slipStatus, this.selectedCurrency, this.openingBalance, this.tr_openingBalance, this.lstBizPlace, this.selBizCenter];
            }
            return _grdDPara;
        },
        grdSPara() {
            let _grdSPara = [this.selectedCompany, this.accCodePK, this.proposeFrom, this.proposeTo, this.slipStatus, this.selectedCurrency, this.lstBizPlace];
            if (this.bizCenter == "" || this.bizCenter == null || this.bizCenter == undefined || this.bizCenter == "null") {
                _grdSPara = [this.selectedCompany, this.accCodePK, this.proposeFrom, this.proposeTo, this.slipStatus, this.selectedCurrency, this.lstBizPlace]
            } else {
                _grdSPara = [this.selectedCompany, this.accCodePK, this.proposeFrom, this.proposeTo, this.slipStatus, this.selectedCurrency, this.lstBizPlace, this.selBizCenter];
            }
            return _grdSPara;
        },
        chkBizCenter() {
            if (this.bizCenter == "" || this.bizCenter == null || this.bizCenter == undefined || this.bizCenter == "null") {
                return false;
            } else {
                return true;
            }
        }
    },

    watch: {
        _language(val) {
            this.selectedLang = val
        },
        dialogIsShow(val) {
            if (val === true) {
                //console.log("ahihi"+this.fromDate);
                // this.$refs.slSumGrid.clear();
                // this.$refs.slDateVoucherGrid.clear();
                this.selectedCompany = this.companyPK
                this.accCodePK = this.accountItem.PK

                this.accCode = `${this.accountItem.CODE} - ${this.accountItem.NAME}`

                this.proposeFrom = this.fromDate
                this.proposeTo = this.toDate
                this.slipStatus = this.status
                this.getListCodes()
            } else {
                this.slDateVoucherDataList = []
                this.slSumDataList = []
            }
        },
        selectedCompany(val) {
            if (val) {
                this.onChangeComp();
            }
        }
    },
    create() {

    },
    methods: {
        async onChangeComp() {
            const dso_bizplace_list = {
                type: 'list',
                selpro: 'SYS_SEL_BIZ_PLACE_V2',
                para: [this.selectedCompany, this.user.PK]
            }
            this.bizPlaceList = await this._dsoCall(dso_bizplace_list, 'select', false)
            if (this.bizPlaceList.length > 0) {
                this.lstBizPlace = this.bizPlaceList[0].PK;
            };

            const dsoBizCenter = {
                type: 'list',
                selpro: 'AC_SEL_BIZ_BY_COMPANY',
                para: [this.selectedCompany]
            };
            this.cboBizCenter = await this._dsoCall(dsoBizCenter, 'select', false);
            if (this.cboBizCenter.length > 0) {
                this.selBizCenter = this.cboBizCenter[0].PK;
            }
        },
        async getListCodes() {
            const dso_company_list = {
                type: 'list',
                selpro: 'SYS_SEL_LIST_COMPANY_ALL',
                para: [this.user.PK]
            }
            this.companyList = await this._dsoCall(dso_company_list, 'select', false)
            const parentCodes = ["ACAB0110", "EACAB021", "EACBK002", "ACBG0040", "COAB0070", "ACBG0040"]
            const results = await this._getCommonCode2(parentCodes, this.user.TCO_COMPANY_PK)
            if (results.length) {
                this.currencyList = results[0]
                this.currencyList.unshift({
                    CODE: 'ALL',
                    NAME: this.$t('all', 'common')
                })
                if (this.ccy == "" || this.ccy == null || this.ccy == undefined || this.ccy == "null") {
                    this.selectedCurrency = this.currencyList[0].CODE
                } else {
                    this.selectedCurrency = this.ccy;
                }
                //this.reportOptionList = results[1]
                //this.selectedReportOpt = this.reportOptionList[0].CODE
                const result_reportOptionList = await this._getCommonCode('EACAB021', '');
                this.reportOptionList = result_reportOptionList;
                this.reportOptionList.forEach((e) => {
                    if (e.DEF_YN == "Y") {
                        this.selectedReportOpt = e.CODE;
                    }
                });
                //this.reportTypeList = results[2]
                //this.selectedReportType = this.reportTypeList[0].CODE;
                const result_reportTypeList = await this._getCommonCode('EACBK002', '');
                this.reportTypeList = result_reportTypeList;
                this.reportTypeList.forEach((e) => {
                    if (e.DEF_YN == "Y") {
                        this.selectedReportType = e.CODE;
                    }
                });
                this.bookCcyList = results[3]

                const result_ccy = results[5];
                result_ccy.forEach(e => {
                    if (e.DEF_YN == "Y") {
                        this.txt_Bookccy = e.CODE;
                        this.l_decimal_after_point = e.VAL3;
                    }
                });

                //this.selectedLanguage = results[4]; //this.curLang.CODE;//this._languages[0].CODE  this.selectedLanguage =
                //this.selectedLang = this.curLang.CODE;
                const result_selectedLanguage = await this._getCommonCode('COAB0070', '');
                this.selectedLanguage = result_selectedLanguage;
                this.selectedLang = this.curLang.CODE;

                const result_status = await this._getCommonCode('ACBG0010', '');
                this.statusList = [...result_status.filter(x => x.VAL1 == 'Y')];

                const dso_bizplace_list = {
                    type: 'list',
                    selpro: 'SYS_SEL_BIZ_PLACE_V2',
                    para: [this.selectedCompany, this.user.PK]
                }
                this.bizPlaceList = await this._dsoCall(dso_bizplace_list, 'select', false)
                if (this.bizPlaceList.length > 0) {
                    this.lstBizPlace = this.bizPlaceList[0].PK;
                };
                //this.amtType = "books"
                if (this.ccy == "" || this.ccy == null || this.ccy == undefined || this.ccy == "null") {
                    this.selectedCurrency = "ALL";
                } else {
                    this.selectedCurrency = this.ccy;
                }
                if (this.bizPlace == "" || this.bizPlace == null || this.bizPlace == undefined || this.bizPlace == "null") {
                    this.lstBizPlace = this.bizPlaceList[0].PK;
                } else {
                    this.lstBizPlace = this.bizPlace;
                }
                const dsoBizCenter = {
                    type: 'list',
                    selpro: 'AC_SEL_BIZ_BY_COMPANY',
                    para: [this.selectedCompany]
                };
                this.cboBizCenter = await this._dsoCall(dsoBizCenter, 'select', false);
                if (this.cboBizCenter.length > 0) {
                    this.selBizCenter = this.cboBizCenter[0].PK;
                }
                if (this.bizCenter == "" || this.bizCenter == null || this.bizCenter == undefined || this.bizCenter == "null") {
                    this.selBizCenter = this.cboBizCenter[0].PK;
                } else {
                    this.selBizCenter = this.bizCenter;
                }

                this.search();
            }

        },

        async search() {
            this.$refs.slSumGrid.loadData();
        },
        handleReturnedAccCode(data) {
            this.accCodePK = data.PK
            this.accCode = `${data.AC_CD} - ${data.AC_NM}`
        },
        onRowPrepared(e) {
            if (e.rowType == "data") {
                e.rowElement.style.backgroundColor = "#FFFFFF";
            }
        },
        onAfterLoad() {

            this.store_pro = (this.inquiryType === 'dates') ? 'AC_SEL_DAILY_SL_DIALOG_DATE' : 'AC_SEL_DAILY_SL_DIALOG_VOUCHER';
            if (this.bizCenter == "" || this.bizCenter == null || this.bizCenter == undefined || this.bizCenter == "null") {
                this.store_pro = (this.inquiryType === 'dates') ? 'AC_SEL_DAILY_SL_DIALOG_DATE' : 'AC_SEL_DAILY_SL_DIALOG_VOUCHER';
            } else {
                this.store_pro = (this.inquiryType === 'dates') ? 'AC_SEL_DLSL_PL_DATE_NC' : 'AC_SEL_DLSL_PL_VOUCHER_NC';
            }
            this.openingBalance = this.$refs.slSumGrid.getDataSource().length ? parseFloat(this.$refs.slSumGrid.getDataSource()[0].OPEN_BAL) : 0;
            this.tr_openingBalance = this.$refs.slSumGrid.getDataSource().length ? parseFloat(this.$refs.slSumGrid.getDataSource()[0].OPEN_BAL_TR) : 0;

            // var rowData = this.$refs.slSumGrid.getDataSource(); 
            // for (var i = 0; i < rowData.length; i++) {
            //     var l_trans_ccy = rowData[i].CCY;
            //     var _DEBITTRANSAMOUNT = '';
            //     var _CREDITTRANSAMOUNT = '';
            //       if(l_trans_ccy == 'VND'){
            //        _DEBITTRANSAMOUNT = this._formatNumber(rowData[i].DEBITTRANSAMOUNT,0);  
            //        _CREDITTRANSAMOUNT = this._formatNumber(rowData[i].CREDITTRANSAMOUNT,0); 
            //     }
            //     else{
            //        _DEBITTRANSAMOUNT = this._formatNumber(rowData[i].DEBITTRANSAMOUNT,2); 
            //        _CREDITTRANSAMOUNT = this._formatNumber(rowData[i].CREDITTRANSAMOUNT,2); 
            //     }
            //     this.$refs.slSumGrid.setCellValue("DEBITTRANSAMOUNT", _DEBITTRANSAMOUNT, rowData[i].PK);
            //     this.$refs.slSumGrid.setCellValue("CREDITTRANSAMOUNT", _CREDITTRANSAMOUNT, rowData[i].PK);
            // }
            this.$refs.slDateVoucherGrid.loadData();
        },
        afterLoad() {
            //    var rowData = this.$refs.slDateVoucherGrid.getDataSource(); 
            //     for (var i = 0; i < rowData.length; i++) {
            //         var l_trans_ccy = rowData[i].CCY;
            //         var _DEBITTRANSAMOUNT = '';
            //         var _CREDITTRANSAMOUNT = '';
            //           if(l_trans_ccy == 'VND'){
            //            _DEBITTRANSAMOUNT = this._formatNumber(rowData[i].DEBITTRANSAMOUNT,0);  
            //            _CREDITTRANSAMOUNT = this._formatNumber(rowData[i].CREDITTRANSAMOUNT,0); 
            //         }
            //         else{
            //            _DEBITTRANSAMOUNT = this._formatNumber(rowData[i].DEBITTRANSAMOUNT,2); 
            //            _CREDITTRANSAMOUNT = this._formatNumber(rowData[i].CREDITTRANSAMOUNT,2); 
            //         }
            //         this.$refs.slDateVoucherGrid.setCellValue("DEBITTRANSAMOUNT", _DEBITTRANSAMOUNT, rowData[i].PK);
            //         this.$refs.slDateVoucherGrid.setCellValue("CREDITTRANSAMOUNT", _CREDITTRANSAMOUNT, rowData[i].PK);
            //     }
        },
        onRowDblClick({
            rowType,
            data
        }) {
            if (rowType === "data" && this.inquiryType === 'vouchers') {
                this.currentSeq = data.PK
                this.seqArray = this.$refs.slDateVoucherGrid.getDataSource().map(x => x.PK)
                this.$refs.accountSlipDialog.dialogIsShow = true
            }
        },
    }
}
</script>
