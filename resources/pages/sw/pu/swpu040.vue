<template>
    <v-container fluid class="px-0 pt-0" v-resize="onResize">
        <v-card class="pa-1 pt-0">
            <v-row align="center" justify="space-between" class="pt-2">
                <!-- <v-col md="2" class="pt-0">
          <BaseSelect :label="$t('Customer')" v-model="tab01.lstCompany" :lstData="dataList.lstCompany" item-text="NAME" item-value="CODE" />
        </v-col> -->

                <v-col md="2" class="pt-0">
                    <BaseDatePicker v-model="tab01.dtOrderFrom" default :label="$t('date_from')"></BaseDatePicker>
                </v-col>

                <v-col md="2" class="pt-0">
                    <BaseDatePicker v-model="tab01.dtOrderTo" default :label="$t('to_date')"></BaseDatePicker>
                </v-col>
                <v-col md="2" class="pt-0">
                    <BaseInput v-model="tab01.txtOrderNo" :label="$t('Supplier')"> </BaseInput>
                </v-col>
                <!-- <v-col md="1" class="pl-5">
          <div class="d-flex justify-center">
            <BaseButton icon_type="add" :btn_text="$t('add')" :disabled="isProcessing" @onclick="onClick('addRowTab3')" />
          </div>
        </v-col>
        <v-col md="1" class="pl-5">
          <div class="d-flex justify-center">
            <BaseButton icon_type="save" :btn_text="$t('save')" :disabled="isProcessing" @onclick="onClick('saveTab3')" />
          </div>
        </v-col>
        <v-col md="1">
          <template>
            <div class="d-flex justify-center">
              <BaseButton icon_type="delete" :btn_text="$t('delete')" :disabled="isProcessing" @onclick="onClick('delRowTab3')" />
            </div>
          </template>
</v-col> -->

                <v-col md="2" class="pt-0">
                    <v-row justify="end" class="mr-1">
                        <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing"
                            @onclick="OnSearch(1)" />
                        <BaseButton icon_type="excel" :btn_text="$t('excel')" :disabled="isProcessing"
                            @onclick="onReport" />
                    </v-row>
                </v-col>
            </v-row>
        </v-card>
        <v-card class="pt-0">
            <v-row align="center" justify="space-between" class="pt-0">
                <v-col cols="12" class="pt-0">
                    <DataGridView ref="grdDetail11" column-resizing-mode="widget" :auto_load="false"
                        select_mode="MultipleHideBox" :max_height="this.windowHeight * 0.75"
                        sel_procedure="LG_SEL_SWPU040_1" upd_procedure="SW_UPD_SWSO01_VINH"
                        @onRowPrepared="onRowPreparedGrid11"
                        :filter_paras="[tab01.dtOrderFrom, tab01.dtOrderTo, tab01.txtOrderNo]"
                        :header="dataList.headerGrid11"
                        :update_paras="['PK', 'ITEM_CODE', 'ITEM_NAME', 'ORDER_DATE', 'QTY', 'ITEM_TYPE', 'DESCRIPTION', 'FACTORY_CODE']" />

                </v-col>
            </v-row>
        </v-card>
    </v-container>
</template>

<script>
import { type } from 'jquery';

export default {
    layout: 'default',
    middleware: 'user',

    components: {},
    
    data: () => ({
        isBegin: 1,
        formatNumber: {
        F_TOTAL_AMT: 0,
        },
        dataList: {
            headerGrid01: [],
            headerGrid11: [],

            lstLocation: [],
            lstDateType: [],
            lstLabelType: [],
            lstCompany: [],
            dtOrderTo: []
        },
        isShowMess: 'N',
        selectedTab: '1',
        tab01: {
            lstCompany: '',
            lstLocation: '',
            lstDateType: '',
            lstLabelType: '',
            dtOrderFrom: '',
            txtBasicCCY: '',
            txtOrderNo: '',
            lstCCY: '',
            txtExRateFrom: '',
            txtCustomerName: '',
            dtOrderTo: '',
            txtExRateTo: ''
        },

        lstHeader01: [],
        limitHeight01: 0,
        limitHeight02: 0,
        objClick: '',
        cellDblClickgrdDetail01: {}
    }),
    async created() {
        [this.dataList.lstCompany] = await this._getCommonCode2(['SWWMT02']);

        this.dataList.lstDateType = [
            { PK: '1', TEXT: 'Delivery Date' },
            { PK: '2', TEXT: 'Order Date' }
        ];
        //this.dataList.lstCompany = [{PK: '', TEXT: 'ALL'},{PK: 'PANKO', TEXT: 'PANKO'}, {PK: 'NOBLAND', TEXT: 'NOBLAND'}, {PK: 'YUPOONG', TEXT: 'YUPOONG'}, {PK: 'YAKJIN', TEXT: 'YAKJIN TRADING'}];
        this.dataList.lstLocation = [
            { PK: '', TEXT: 'ALL' },
            { PK: 'HÀ NỘI', TEXT: 'HÀ NỘI' },
            { PK: 'HỒ CHÍ MINH', TEXT: 'HỒ CHÍ MINH' },
            { PK: 'QUẢNG NAM', TEXT: 'QUẢNG NAM' },
            { PK: 'ĐỒNG NAI', TEXT: 'ĐỒNG NAI' },
            { PK: 'LONG AN', TEXT: 'LONG AN' }
        ];
        [this.dataList.lstLabelType] = await this._getCommonCode2(['SZ010']);

        this.initView();
    },

    watch: {
        'tab01.dtOrderTo'(val) {
            //this.onGetCCYUnit();
        },
        'tab01.dtOrderFrom'(val) {
            //this.onGetInfo1();
        }
    },

    mounted() {
        /*TODO: */
    },
    computed: {
        user() {
            return this.$store.getters['auth/user'];
        },
        cwCommonParam() {
            return {
                ...this.$store.getters["auth/cwCommonParam"],
            };
        },
    },
    methods: {


        async DSO_SEL_3010050_FORMAT_02(action = "select") {
            const dso = {
                type: "control",
                selpro: "LG_SEL_3010050_FORMAT_02",
                para: [this.modelMaster.PO_CCY],
            };
            let row = await this._dsoCall(dso, "select", false);
            if (row) {
                this.formatNumber.F_PO_QTY = row.F_PO_QTY;
                this.formatNumber.F_UNIT_PRICE = row.F_UNIT_PRICE;
                this.formatNumber.F_PO_AMT = row.F_PO_AMT;
                this.formatNumber.F_TAX_RATE = row.F_TAX_RATE;
                this.formatNumber.F_TAX_AMT = row.F_TAX_AMT;
                this.formatNumber.F_OTHER_EXP = row.F_OTHER_EXP;
                this.formatNumber.F_TOTAL_AMT = row.F_TOTAL_AMT;
                this.formatNumber.F_REQ_QTY = row.F_REQ_QTY;

                this.formatNumber.M_PO_QTY = row.M_PO_QTY;
                this.formatNumber.M_UNIT_PRICE = row.M_UNIT_PRICE;
                this.formatNumber.M_PO_AMT = row.M_PO_AMT;
                this.formatNumber.M_TAX_RATE = row.M_TAX_RATE;
                this.formatNumber.M_TAX_AMT = row.M_TAX_AMT;
                this.formatNumber.M_OTHER_EXP = row.M_OTHER_EXP;
                this.formatNumber.M_TOTAL_AMT = row.M_TOTAL_AMT;
                this.formatNumber.M_REQ_QTY = row.M_REQ_QTY;
                this.modelOthers.AUTO_CAL = row.AUTO_CAL == "Y" ? true : false;
                this.initView()
            }
        },
        async onClick(action) {
            switch (action) {
                case 'searchTab3':
                    this.$refs.grdDetail11.loadData();
                    break;
                case 'addRowTab3':
                    const today = new Date();
                    this.$refs.grdDetail11.addRowStruct({
                        PK: '',
                        ITEM_CODE: '',
                        ITEM_NAME: '',
                        ORDER_DATE: '',
                        QTY: '',
                        ITEM_TYPE: '',
                        DESCRIPTION: '',
                        DEL_IF: '',
                        CRT_BY: '',
                        CRT_DT: '',
                        MOD_BY: '',
                        MOD_DT: '',
                        FACTORY_CODE: ''
                    });
                    break;
                case 'delRowTab3':
                    this.$refs.grdDetail11.deleteRows();
                    break;
                case 'saveTab3':
                    await this.$refs.grdDetail11.saveData();

                    break;
                case 'check_duplicate':
                    this.check_duplicate();
                    break;
            }
        },
        limitHeight() {
            this.limitHeight01 = this.windowHeight - 250;
            this.limitHeight02 = this.windowHeight - 250;
        },
        
        initView() {
            this.dataList.headerGrid01 = [
                //
                { dataField: 'STT', caption: this.$t('STT'), allowEditing: false, allowMerge: true, bgColor: '#FFFFFF', width: 40 },
                { dataField: 'PO_DATE', caption: this.$t('po_date'), allowEditing: true, dataType: 'date', },
                { dataField: 'ETD_FROM', caption: this.$t('RECEIPT DATE'), allowEditing: true, dataType: 'date', },
                { dataField: 'APPROVAL_DATE', caption: this.$t('PAYMENT DATE'), allowEditing: true, dataType: 'date', },
                { dataField: 'BEDEFI_NM1', caption: this.$t('SUPPLIER'), allowEditing: false, width: 400,fixed: true, },
                { dataField: 'DESCRIPTION', caption: this.$t('CONTENT'), allowEditing: true,width: 170 },
                // { dataField: 'TOTAL_AMT', caption: this.$t('TOTAL (VND)'),allowEditing: false,formatFloat: this.formatNumber.F_TOTAL_AMT, },
                { dataField: 'TOTAL_AMT', caption: this.$t('TOTAL (VND)'),allowEditing: false,formatFloat: 0,dataType: "number", summaryType: 'sum' },
                { dataField: 'TOTAL_USD', caption: this.$t('TOTAL (USD)'), allowEditing: true, formatFloat: 2,dataType: "number", summaryType: 'sum' },
                { dataField: 'BILL_TO_PK', caption: this.$t('NOTE'), allowEditing: false, },
                { dataField: 'PAYMENT_METHOD', caption: this.$t('PAYMENT METHOD'), allowEditing: false, },
                { dataField: 'STATUS', caption: this.$t('STATUS'), allowEditing: false, },
                { dataField: 'PAYMENT_TERM', caption: this.$t('PAYMENT TERM'), allowEditing: false, },
                { dataField: 'PAYMENT_DATE', caption: this.$t('PLAN DATE'), allowEditing: true, dataType: 'date', },
                { dataField: 'ACCOUNT_NO', caption: this.$t('Tài khoản nhận'), allowEditing: false, },
                { dataField: 'BEDEFI_NM', caption: this.$t('Tên người hưởng'), allowEditing: false,width: 300 },
                { dataField: 'PO_CCY', caption: this.$t('Loại tiền'), allowEditing: false, },
                { dataField: 'BEDEFI_BANK_NM', caption: this.$t('Tên ngân hàng nhận'), allowEditing: false, },
                { dataField: 'PROVINCE', caption: this.$t('Tên tỉnh/TP'), allowEditing: false, },
                { dataField: 'BRANCH', caption: this.$t('Chi nhánh/Địa chỉ ngân hàng hưởng'), allowEditing: false, },
                { dataField: 'SHIPPING_FEE', caption: this.$t('Phí chuyển tiền'), allowEditing: false, },
                { dataField: 'SWIFT_CODE', caption: this.$t('SWIFT CODE'), allowEditing: false, },
                { dataField: 'SUPPLIER_ADDR', caption: this.$t('Địa chỉ người hưởng'), allowEditing: false, },
            ];
            this.dataList.headerGrid11 = [...this.dataList.headerGrid01];
        },

        OnSearch(obj) {
            if (obj == '1') {
                //this.getHeader01(1);
                this.$refs.grdDetail11.loadData();
            }
        },

        onRowClickDetail(row) {
            this.tab02.txtPartnerPK = row.data.CUST_PK;
            this.$refs.grdDetail22.loadData();
        },

        onRowPreparedGrid11(e) {
            this.onRowPreparedGrid_ALL(e);
        },
        onRowPreparedGrid22(e) {
            this.onRowPreparedGrid_ALL(e);
        },

        onRowPreparedGrid_ALL(e) {
            if (e.rowType === 'data') {
                if (e.data.ISTOTAL === 1) {
                    e.rowElement.style.fontWeight = 'bold';
                    e.rowElement.style.background = '#FFE599';
                }
            }
        },

        async onGetCCYUnit() {
            const dso = {
                type: 'process',
                updpro: 'LG_PRO_9020OTM180_03',
                para: [this.tab01.dtOrderTo]
            };
            let result01 = await this._dsoCall(dso, 'process', false);
            if (result01.length > 0) {
                this.tab01.txtOrderNo = result01[0].CCY_UNIT;
            }
        },

        async getHeader01(obj) {
            if (obj === 1) {
                const dso = {
                    type: 'process',
                    updpro: 'LG_PRO_9020OTM180_01',
                    para: [this.tab01.dtOrderFrom]
                };
                this.lstHeader01 = await this._dsoCall(dso, 'process', false);
                if (this.lstHeader01.length > 0) {
                    this.processHeader1(obj);
                }
            }
        },

        /*NOTE: */
        async SYS_SEL_LIST_COMPANY(_param) {
            const dso = {
                type: 'list',
                selpro: 'GSF20_LG_GET_COMMON_LIST',
                para: _param
            };
            this.dataList.lstCompany = await this._dsoCall(dso, 'select', false);
            //this.dataList.lstCompany.unshift({PK: "", TEXT: ""});
            if (this.dataList.lstCompany.length > 0) {
                this.tab01.lstCompany = this.dataList.lstCompany[0]['PK'];
            }
        },

        async SYS_SEL_LIST_COMPANY_ALL() {
            const dso = {
                type: 'list',
                selpro: 'sys_get_company',
                para: null
            };
            this.dataList.lstCompany = await this._dsoCall(dso, 'select', false);
            this.dataList.lstCompany.unshift({ PK: '', TEXT: this.$t('all') });
            if (this.dataList.lstCompany.length > 0) {
                this.tab01.lstCompany = this.dataList.lstCompany[0]['PK'];
            }
        },
        async getListCodes() {
            let lstCommoncode = await this._getCommonCode2(['SZ010'], this.user.TCO_COMPANY_PK);
            this.lstLabelType = lstCommoncode[0];
        },

        ///

        async onReport() {
            let p_param = [this.tab01.dtOrderFrom, this.tab01.dtOrderTo, this.tab01.txtOrderNo];
            let report_no = '01';
            let report_path = '';
            let report_name = '';
            let report_name_ext = 'xlsx';
            let excel = [];

            let report = 'rpt_swpu040_payment_list';

            //rpt_swso410_EC_Carelabel_02
            try {
                //alert(p_param);
                this._ExcelSaveAs(
                    await this.$axios.$get('/dso/makereport', {
                        responseType: 'blob',
                        params: {
                            template: 'report/sw/pu/' + report + '.xlsx',
                            excel: JSON.stringify([
                                {
                                    insertRange: [
                                        {
                                            range: 'A1:H1',
                                            proc: 'LG_SEL_SWPU040_1',
                                            params: [...p_param] //SW_SEL_SW10110_export_custom
                                        }
                                    ],
                                    insertRows: [
                                        {
                                            startRow: 3,
                                            proc: 'LG_SEL_SWPU040_1',
                                            params: [...p_param],
                                            subStyle: {
                                                font: { bold: true },
                                                fill: {
                                                    type: 'pattern',
                                                    pattern: 'solid',
                                                    fgColor: { argb: 'FFE599' },
                                                    bgColor: { argb: 'FFE599' }
                                                }
                                            }
                                            //startRow: 8, proc: "SW_SEL_SW10090_REPORT_FACT_DT", params: [...p_param]
                                        }
                                    ]
                                }
                            ]),
                            convert: 'xlsx'
                        }
                    }),
                    report + '.' + 'xlsx'
                );
            } catch (e) {
                this.showNotification('danger', this.$t('fail_to_export_report'), '', 4000);
            }
        },
        print() { },

        //

        async onReport2() {
            let p_param = [this.tab01.lstCompany, this.tab01.dtOrderFrom, this.tab01.dtOrderTo, this.tab01.txtOrderNo];
            let report_no = '01';
            let report_path = '';
            let report_name = '';
            let report_name_ext = 'xlsx';
            let excel = [];

            switch (report_no) {
                case '01':
                    //alert(p_param);
                    report_path = 'report/10/10/rpt_sw10060_delivery_note.xlsx';
                    report_name = 'rpt_sw10060_delivery_note.' + report_name_ext;
                    excel = [
                        {
                            sheet: 1,
                            insertRange: [
                                //{ range: "A1:T4", proc: "LG_RPT_COMPANY_INFO_02", params: [this.tab01.lstCompany], imageColumns: ["COM_PIC"]  },
                                { range: 'A6:I6', proc: 'SW_SEL_SWSO01_NOCACHE', params: [...p_param] } //master
                            ],
                            insertRows: [
                                {
                                    startRow: 5,
                                    proc: 'SW_SEL_SWSO01_NOCACHE',
                                    params: [...p_param],
                                    subStyle: {
                                        font: { bold: true },
                                        fill: {
                                            type: 'pattern',
                                            pattern: 'solid',
                                            fgColor: { argb: 'FFE599' },
                                            bgColor: { argb: 'FFE599' }
                                        }
                                    }
                                }
                            ]
                        }
                    ];
                    break;
                default:
                    report_path = '';
                    break;
            }

            if (!report_path) {
                this.showNotification('danger', this.$t('please_select_report'), '', 4000);
                return;
            }

            const res = await this.$axios.$get('/dso/makereport', { responseType: 'blob', params: { template: report_path, excel: JSON.stringify(excel), convert: report_name_ext } });
            if (res) {
                this._ExcelSaveAs(res, report_name);
            } else {
                this.showNotification('danger', this.$t('fail_to_export_report'), '', 4000);
            }
        }
    }
};
</script>

<style>
.btn {
    min-width: 100px;
    min-height: 30px;
    max-width: 100px;
    max-height: 30px;
}
</style>
