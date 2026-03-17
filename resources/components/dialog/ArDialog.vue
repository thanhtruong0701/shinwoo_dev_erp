<template>
<div>
    <v-dialog id="ar-dialog" max-width="1200" v-model="dialogIsShow">
        <v-card>
            <v-card-title class="headline primary-gradient white--text py-2">
                <span>{{ $t("ar_dialog") }}</span>
                <v-spacer></v-spacer>
                <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
            </v-card-title>
            <v-container fluid class="pt-0">
                <v-row no-gutters>
                    <v-col cols="12">
                        <!-- Actions Bar -->
                        <v-row align="center" justify="center">
                            <v-col cols="12">
                                <v-card outlined tile>
                                    <v-container fluid class="pb-0">
                                        <v-row dense>
                                            <!-- Company -->
                                            <v-col cols="3">
                                                <BaseSelect :label="$t('company')" v-model="companyPK" :lstData="companyList" item-text="TEXT" item-value="PK" />
                                            </v-col>
                                            <!-- Biz Place -->
                                            <v-col cols="3">
                                                <BaseSelect :label="$t('biz_place')" v-model="bizPlacePK" :lstData="bizPlaceList" item-text="TEXT" item-value="PK" />
                                            </v-col>
                                            <!-- Recv Due Date -->
                                            <v-col cols="3">
                                                <v-row align="center" justify="space-between" no-gutters>
                                                    <v-col md="6">
                                                        <BaseDatePicker :label="$t('recv_due_from')" v-model="recvDueFrom"  />
                                                    </v-col>
                                                    <v-col md="6" class="pl-2">
                                                        <BaseDatePicker default :label="$t('recv_due_to')" v-model="recvDueTo" />
                                                    </v-col>
                                                </v-row>
                                            </v-col>
                                            <!-- Customer -->
                                            <v-col cols="3">
                                                <!-- <v-text-field dense hide-details readonly :label="$t('partner')" v-model="partner"> -->
                                                <BaseInput :label="$t('partner')" mandatory v-model="partner" @dblClick="$refs.partnerDialog.dialogIsShow = true" readonly>
                                                    <template v-slot:append>
                                                        <v-tooltip bottom>
                                                            <template v-slot:activator="{ on }">
                                                                <v-icon v-on="on" :color="currentTheme" @click="$refs.partnerDialog.dialogIsShow = true">mdi-window-restore</v-icon>
                                                            </template>
                                                            <span>{{ $t('partner') }}</span>
                                                        </v-tooltip>
                                                        <!-- <v-tooltip bottom>
                                                            <template v-slot:activator="{ on }">
                                                                <v-icon v-on="on" :color="currentTheme" @click="partnerPK = '', partner = ''">mdi-eraser</v-icon>
                                                            </template>
                                                            <span>{{ $t('reset', 'common') }}</span>
                                                        </v-tooltip> -->
                                                    </template>
                                                 </BaseInput>
                                            </v-col>
                                        </v-row>
                                        <!-- From to date -->
                                        <v-row dense>
                                            <v-col cols="3">
                                                <v-row align="center" justify="space-between" no-gutters>
                                                    <v-col md="6">
                                                        <BaseDatePicker :label="$t('from_date')" v-model="fromDate" />
                                                    </v-col>
                                                    <v-col md="6" class="pl-2">
                                                        <BaseDatePicker default :label="$t('to_date')" v-model="toDate" />
                                                    </v-col>
                                                </v-row>
                                            </v-col>
                                             <!-- Voucher No / Acccount-->
                                            <v-col cols="3">
                                                <v-row align="center" justify="space-between" no-gutters>
                                                    <v-col md="6">
                                                        <BaseInput :label="$t('voucher_no')" v-model="voucherNo"  @keyPressEnter="search"/>
                                                    </v-col>
                                                    <v-col md="6" class="pl-2">
                                                        <BaseInput :label="$t('account')" v-model="accCode"  @keyPressEnter="search"/>
                                                    </v-col>
                                                </v-row>
                                            </v-col>
                                            <!-- Profit & Loss (PL) -->
                                            <v-col cols="3">
                                                <BaseInput :label="$t('profit_and_loss')" mandatory v-model="plCodeName" @dblClick="$refs.plUnitDialog.dialogIsShow = true">   
                                                    <template v-slot:append>
                                                        <v-tooltip bottom>
                                                            <template v-slot:activator="{ on }">
                                                                <v-icon v-on="on" :color="currentTheme" @click="$refs.plUnitDialog.dialogIsShow = true">mdi-window-restore</v-icon>
                                                            </template>
                                                            <span>{{ $t('open_pl') }}</span>
                                                        </v-tooltip>
                                                        <v-tooltip bottom>
                                                            <template v-slot:activator="{ on }">
                                                                <v-icon v-on="on" :color="currentTheme" @click="plPK = '', plCodeName = ''">mdi-eraser</v-icon>
                                                            </template>
                                                            <span>{{ $t('reset', 'common') }}</span>
                                                        </v-tooltip>
                                                    </template>
                                                </BaseInput>
                                            </v-col>
                                             <v-col cols="3">
                                                <BaseInput :label="$t('style_no')" mandatory v-model="styleNo" @dblClick="$refs.getOneItemDialog.dialogIsShow = true">   
                                                    <template v-slot:append>
                                                        <v-tooltip bottom>
                                                            <template v-slot:activator="{ on }">
                                                                <v-icon v-on="on" :color="currentTheme" @click="$refs.getOneItemDialog.dialogIsShow = true">mdi-window-restore</v-icon>
                                                            </template>
                                                            <span>{{ $t('style_no') }}</span>
                                                        </v-tooltip>
                                                        <v-tooltip bottom>
                                                            <template v-slot:activator="{ on }">
                                                                <v-icon v-on="on" :color="currentTheme" @click="styleNo = ''">mdi-eraser</v-icon>
                                                            </template>
                                                            <span>{{ $t('reset', 'common') }}</span>
                                                        </v-tooltip>
                                                    </template>
                                                </BaseInput>
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <!-- Type / Status-->
                                            <v-col cols="3">
                                                <BaseSelect :label="$t('type')" v-model="selectedType" :lstData="typeList" item-text="NAME" item-value="CODE" @change="search"/> 
                                            </v-col>
                                            <!-- CI Invoice / Quantity-->
                                            <v-col cols="3">
                                                <v-row align="center" justify="space-between" no-gutters>
                                                    <v-col md="6">
                                                        <BaseInput :label="$t('ci_invoice')" mandatory v-model="ciInvoice"  @keyPressEnter="search"/>
                                                    </v-col>
                                                    <v-col md="6" class="pl-2">
                                                        <BaseInput :label="$t('quantity')" v-model="quantity"  @keyPressEnter="search"/>
                                                    </v-col>
                                                </v-row>
                                            </v-col>
                                             <!-- PO No-->
                                            <v-col cols="3">
                                                <BaseInput :label="$t('po_no')" v-model="poNo"  @keyPressEnter="search"/>
                                            </v-col>
                                             <!-- Seq-->
                                            <v-col cols="3">
                                                <BaseInput :label="$t('seq')" v-model="seq"  @keyPressEnter="search"/>
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <!-- All date/Status Date -->
                                            <v-col cols="4">
                                                <v-row align="center" justify="space-between" no-gutters>
                                                    <v-col md="2">
                                                        <BaseCheckbox :label="$t('all_date')" true-value="Y" false-value="N" v-model="checkAllYn" />     
                                                    </v-col>
                                                    <v-col md="4" class="pl-2">
                                                        <BaseDatePicker default :label="$t('status_date')" v-model="statusDate" />
                                                    </v-col>
                                                    <v-col md="5" class="pl-2"> 
                                                        <BaseSelect :label="$t('status')" v-model="status" :lstData="statusList" item-text="TEXT" item-value="VALUE" @change="search"/>
                                                    </v-col>
                                                </v-row>
                                            </v-col>
                                            <v-col cols="4">
                                                <div class="d-flex">
                                                    <BaseButton icon_type="confirm" :btn_text="$t('confirm')" @onclick="onConfirm" :disabled="btn_confirm || isProcessing" />
                                                    <BaseButton icon_type="confirm" :btn_text="$t('unconfirm')" @onclick="onConfirm" :disabled="btn_unconfirm || isProcessing" />
                                                    <BaseButton icon_type="confirm" :btn_text="$t('btn_select')" @onclick="onSelectAR" :disabled="btn_unconfirm || isProcessing" />
                                                </div>
                                            </v-col>
                                             <!-- Total Voucher -->
                                            <v-col cols="2">
                                                <span class="font-weight-bold">Total Voucher:</span>
                                                <span class="error--text font-weight-bold">{{ totalVoucher }}</span>
                                            </v-col>
                                            <v-col cols="2">
                                                <div class="d-flex justify-end">
                                                    
                                                    <BaseButton icon_type="search" :btn_text="$t('search')" @onclick="search" :disabled="isProcessing" />
                                                    <BaseButton icon_type="excel" :btn_text="$t('excel')" @onclick="print" :disabled="isProcessing" />
                                                </div>
                                            </v-col>
                                        </v-row>
                                    </v-container>
                                </v-card>
                            </v-col>
                        </v-row>
                        <!-- Tabs & Tab Contents -->
                        <v-row no-gutters class="pt-3">
                            <v-col cols="4" dense>
                                <v-btn-toggle v-model="tab" mandatory active-class="blue white--text" dense>
                                    <v-btn dense>
                                        {{$t("receivable")}}
                                    </v-btn>
                                    <v-btn dense>
                                        {{$t("receive_balance")}}
                                    </v-btn>
                                </v-btn-toggle>
                            </v-col>
                            <v-spacer />
                            <div v-if="tab==0" class="d-flex pr-1">
                                    <BaseInput :label="$t('total_amt_trans')" mandatory v-model="txt_total_amt_trans" number="2" class="pr-10"/>
                                    <BaseInput :label="$t('total_amt_books')" mandatory v-model="txt_total_amt_books" number="0"/>
                            </div>
                        </v-row>
                        <v-row align="center" justify="center">
                            <v-col cols="12" class="py-0">
                                <!-- Tab Contents -->
                                            
                                <v-tabs-items v-model="tab" v-resize="onResize">
                                    <v-tab-item>
                                        <DataGridView ref="receivableGrid" :filter_paras="[]" :sel_procedure="''" select_mode="Multiple"  :header="receivableHeaders" :cellDblClick="onRowDblClick" @onSelectionDataChanged="onSelectionChanged" :max_height="limitHeight" />
                                        <!-- <DxDataGrid column-resizing-mode="widget" ref="receivableGrid" :allow-column-resizing="true" :cache-enabled="false" :column-auto-width="true" :columns="receivableHeaders" :data-source="receivableList" :height="limitHeight" :no-data-text="$t('no_data', 'common')" :onRowDblClick="onRowDblClick" :paging="{ pageSize: receivableList.length }" :selection="{ mode: 'multiple' }" :show-borders="true" :show-column-lines="true" :show-row-lines="true" @selection-changed="onSelectionChanged">
                                        </DxDataGrid> -->
                                    </v-tab-item>
                                    <v-tab-item>
                                         <DataGridView ref="receiveBalanceGrid" :filter_paras="[]" :sel_procedure="''"  select_mode="Multiple" :header="receiveBalanceHeaders"  :max_height="limitHeight" />
                                       
                                        <!-- <DxDataGrid column-resizing-mode="widget" ref="receiveBalanceGrid" :allow-column-resizing="true" :cache-enabled="false" :column-auto-width="true" :columns="receiveBalanceHeaders" :data-source="receiveBalanceList" :height="limitHeight" :no-data-text="$t('no_data', 'common')" :paging="{ pageSize: receiveBalanceList.length }" :selection="{ mode: 'multiple' }" :show-borders="true" :show-column-lines="true" :show-row-lines="true">
                                        </DxDataGrid> -->
                                    </v-tab-item>
                                </v-tabs-items>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
            </v-container>
        </v-card>
    </v-dialog>

    <partner-dialog ref="partnerDialog" @callBackData="handleReturnedPartner" />
    <pl-unit-dialog ref="plUnitDialog" @returnPlUnitInfo="handleReturnedPlUnit" />
    <get-one-item-dialog :customer="{ PK: partnerPK, NAME: partner }" ref="getOneItemDialog" @returnData="handleReturnedOneItem" />
</div>
</template>

<script>
export default {
    name: "ar-dialog",
    props: ["companyPK", "customer"],

    components: {
        DatePicker: () => import("@/components/control/DatePicker"),
        PartnerDialog: () => import("@/components/dialog/PartnerDialog"),
        PlUnitDialog: () => import("@/components/dialog/PlUnitDialog"),
        GetOneItemDialog: () => import("@/components/dialog/GetOneItemDialog")
    },

    data: () => ({
        dialogIsShow: false,
        companyList: [],
        statusDate: '',
        status: '1',
        seq: '',
        recvDueFrom: '',
        recvDueTo: '',
        partnerPK: '',
        partner: '',
        voucherNo: '',
        fromDate: '',
        toDate: '',
        plPK: '',
        plCodeName: '',
        typeList: [],
        selectedType: 'ALL',
        styleNoPK: '',
        styleNo: '',
        ciInvoice: '',
        quantity: '',
        poNo: '',
        checkAllYn: 'T',
        totalVoucher: 0,
        bizPlaceList: [],
        bizPlacePK: '',
        accCode: '131',

        tab: null,
        receivableList: [],
        receiveBalanceList: [],
        row_sel_data: [],
        btn_sel: true,
        btn_confirm: false,
        btn_unconfirm: true,
        txt_total_amt_trans : 0,
        txt_total_amt_books : 0,
    }),
    computed: {
        user() {
            return this.$store.getters["auth/user"]
        },
        limitHeight() {
            if (this.$vuetify.breakpoint.lgAndUp) {
                return (this.windowHeight * 0.5) - 200
            } else if (this.$vuetify.breakpoint.mdAndDown && !this.$vuetify.breakpoint.xsOnly) {
                return (this.windowHeight * 0.5) - 100
            } else {
                return
            }
        },
        statusList() {
            return [{
                    VALUE: "1",
                    TEXT: this.$t("unconfirmed")
                },
                {
                    VALUE: "2",
                    TEXT: this.$t("confirmed")
                }
            ]
        },
        receivableHeaders() {
            return [{
                    dataField: "SEQ",
                    caption: this.$t("seq")
                },
                {
                    dataField: "INVOICE_DATE",
                    caption: this.$t("invoice_date")
                },
                {
                    dataField: "INVOICE_NO",
                    caption: this.$t("invoice_no")
                },
                {
                    dataField: "SERIAL_NO",
                    caption: this.$t("serial_no")
                },
                {
                    dataField: "CO_INVOICE_NO",
                    caption: this.$t("c_invoice_no")
                },
                {
                    dataField: "CONTRACT_NO_AR",
                    caption: this.$t("contract_no")
                },
                {
                    dataField: "TR_DATE",
                    caption: this.$t("ar_date")
                },
                {
                    dataField: "TR_CCY",
                    caption: this.$t("ar_ccy")
                },
                {
                    dataField: "TR_RATE",
                    caption: this.$t("ar_rate"),
                    dataType: 'number',
                    formatFloat: 2
                },
                {
                    dataField: "TR_FAMT",
                    caption: this.$t("ar_trans"),
                    dataType: 'number',
                    summaryType: "sum",
                    formatFloat: 2,
                },
                {
                    dataField: "TR_AMT",
                    caption: this.$t("ar_books"),
                    dataType: 'number',
                    summaryType: "sum",
                    formatFloat: 0
                },
                {
                    dataField: "AR_BOOK_RATE",
                    caption: this.$t("ar_book_rate"),
                    dataType: 'number',
                    formatFloat: 2
                },
                {
                    dataField: "RECV_BK_RATE",
                    caption: this.$t("recv_bk_rate"),
                    dataType: 'number',
                    formatFloat: 2
                }
            ]
        },
        receiveBalanceHeaders() {
            return [{
                    dataField: "PK",
                    caption: this.$t("pk")
                },
                {
                    dataField: "VOUCHER_TYPE",
                    caption: this.$t("voucher_type")
                },
                {
                    dataField: "VOUCHERNO",
                    caption: this.$t("voucher_no")
                },
                {
                    dataField: "PRPS_DATE",
                    caption: this.$t("proposed_date")
                },
                {
                    dataField: "CUSTOMER_ID",
                    caption: this.$t("partner_code")
                },
                {
                    dataField: "CUSTOMER_NM",
                    caption: this.$t("partner_name")
                },
                {
                    dataField: "PL_CD",
                    caption: this.$t("pl_code")
                },
                {
                    dataField: "PL_NM",
                    caption: this.$t("pl_name")
                },
                {
                    dataField: "TR_FAMT",
                    caption: this.$t("amount_trans"),
                    dataType: 'number',
                    summaryType: "sum",
                    formatFloat: 2
                },
                {
                    dataField: "TR_AMT",
                    caption: this.$t("amount_books"),
                    dataType: 'number',
                    summaryType: "sum",
                    formatFloat: 2
                },
                {
                    dataField: "TR_FAMT_PAID",
                    caption: this.$t("recv_trans"),
                    dataType: 'number',
                    formatFloat: 2
                },
                {
                    dataField: "TR_AMT_PAID",
                    caption: this.$t("recv_books"),
                    dataType: 'number',
                    formatFloat: 2
                },
                {
                    dataField: "BAL_FAMT",
                    caption: this.$t("balance_trans"),
                    dataType: 'number',
                    formatFloat: 2
                },
                {
                    dataField: "BAL_AMT",
                    caption: this.$t("balance_books"),
                    dataType: 'number',
                    formatFloat: 2
                },
                {
                    dataField: "QTY",
                    caption: this.$t("quantity"),
                    dataType: 'number',
                    formatFloat: 2
                }
            ]
        }
    },

    watch: {
        dialogIsShow(val) {
            if (val) {
                this.getListCodes()
                this.receivableList = []; 
                this.receiveBalanceList = []; 
                this.recvDueFrom = this._CurrentYMD('YYYYMMDD','','start_year');
                this.fromDate = this._CurrentYMD('YYYYMMDD','','start_year');
            }
            if (val == false) {
                this.$emit('returnAR', true)
            }
        },
        customer: {
            immediate: true,
            handler(val) {
                this.partnerPK = val.PK
                this.partner = val.NAME
            }
        },
        tab(val) {
            this.search()
        },
        status(val) {
            if (val == 1) {
                this.btn_confirm = false;
                this.btn_unconfirm = true;
            } else {
                this.btn_confirm = true;
                this.btn_unconfirm = false;
            }
        }
    },

    methods: {
        async getListCodes() {
            const dso_company_list = {
                type: 'list',
                selpro: 'SYS_SEL_LIST_COMPANY',
                para: [this.user.PK]
            }
            this.companyList = await this._dsoCall(dso_company_list, 'select', false)
            this.typeList = await this._getCommonCode('EACAB002')

            const dso_bizplace_list = {
                type: 'list',
                selpro: 'SYS_SEL_BIZ_PLACE_V2',
                para: [this.companyPK, this.user.PK]
            }
            this.bizPlaceList = await this._dsoCall(dso_bizplace_list, 'select', false)
            if (this.bizPlaceList.length > 0) {
                this.bizPlacePK = this.bizPlaceList[0].PK;
            }

            
                this.$refs.receivableGrid.setDataSource(this.receivableList);
                this.$refs.receiveBalanceGrid.setDataSource(this.receiveBalanceList);
        },

        handleReturnedPartner(data) {
            this.partnerPK = data.PK
            this.partner = `${data.PARTNER_ID} - ${data.PARTNER_NAME}`
        },

        handleReturnedPlUnit(data) {
            this.plPK = data.PK
            this.plCodeName = `${data.PL_CD} - ${data.PL_NM}`
        },

        handleReturnedOneItem(data) {
            this.styleNoPK = data.PK
            this.styleNo = `${data.ITEM_CODE} - ${data.ITEM_NAME}`
        },

        async search() {
            var params = this._formatNullValuesToEmpty([this.companyPK, this.status, this.seq, this.recvDueFrom, this.recvDueTo, this.fromDate, this.toDate, this.partnerPK, this.voucherNo, this.plPK, this.selectedType, this.tab, this.styleNo, this.ciInvoice, this.poNo, this.quantity, this.checkAllYn, this.bizPlacePK, this.accCode])
            if (this.tab === 0) {
                const dso = {
                    type: "grid",
                    selpro: "AC_SEL_AR_DIALOG_COLLECT",
                    para: params
                }
                const result = await this._dsoCall(dso, 'select', false)
                this.receivableList = result ? result : []
                this.$refs.receivableGrid.setDataSource(this.receivableList);
                // this.$refs.receivableGrid.instance.clearSelection()
            } else {
                const dso = {
                    type: "grid",
                    selpro: "AC_SEL_AR_DIALOG_COLLECT",
                    para: params
                }
                const result = await this._dsoCall(dso, 'select', false)
                this.receiveBalanceList = result ? result : [] 
                this.$refs.receiveBalanceGrid.setDataSource(this.receiveBalanceList);
                // this.$refs.receiveBalanceGrid.instance.clearSelection()
            }
        },
        /*--------------- onSave------------------------------*/
        async onConfirm() {

            var params = this._formatNullValuesToEmpty([this.companyPK, this.status, this.seq, this.recvDueFrom, this.recvDueTo, this.fromDate, this.toDate, this.partnerPK, this.voucherNo, this.plPK, this.selectedType, this.tab, this.styleNo, this.ciInvoice, this.poNo, this.quantity, this.checkAllYn, this.bizPlacePK, this.accCode])

            for (let i = 0; i < this.row_sel_data.length; i++) {
                const P_TAC_CARECV_PK = this.row_sel_data[i].TAC_CARECV_PK;

                for (let j = 0; j < this.receivableList.length; j++) {
                    const L_TAC_CARECV_PK = this.receivableList[j].TAC_CARECV_PK;

                    if (P_TAC_CARECV_PK == L_TAC_CARECV_PK) {
                        this.receivableList[j]._rowstatus = "u";
                        if (this.status == "1") {
                            this.receivableList[j].CHK = "Y";
                        } else {
                            this.receivableList[j].CHK = "N";
                        }

                    }
                }

            }
            if (this.row_sel_data.length === 0) {
                this.showNotification('warning', this.$t('alert'), this.$t('please_select_check_row!'));
                return;
            }
            const dso = {
                type: 'grid',
                selpro: 'AC_SEL_AR_DIALOG_COLLECT',
                updpro: 'AC_UPD_AR_DIALOG_COLLECT',
                para: params,
                elname: [
                    '_rowstatus',
                    'CHK',
                    'TAC_CARECV_PK'
                ], //type array[]
                data: this.receivableList, //array json          
            }

            const result = await this._dsoCall(dso, "update", true);
            if (result) {
                this.receivableList = result;
            }
            this.$refs.receivableGrid.instance.clearSelection();
            this.row_sel_data = [];
        },
        /**---------------------------------------------------------------------------------- */
        print(){},
        /**---------------------------------------------------------------------------------- */
        onSelectionChanged(e) {
            // console.log(selectedRowsData);
            //console.log(selectedRowKeys);
            var item=[];  
            if (e.length > 0) {
                item = e
            }
            this.row_sel_data = item;
            
            let total_amt_trans = 0;
            let total_amt_books = 0;
            for (var i = 0 ; i<e.length; i++)
                {
                    total_amt_trans = total_amt_trans + Number(e[i].TR_FAMT);	
                    total_amt_books = total_amt_books + Number(e[i].TR_AMT);
                }
            this.txt_total_amt_trans = total_amt_trans;//this._formatNumber(total_amt_trans, 2); 
            this.txt_total_amt_books = total_amt_books;//this._formatNumber(total_amt_books, 0); 

        },
        onSelectAR() {
            this.$emit("callBackARData", this.row_sel_data);
            this.dialogIsShow = false;
        },

        onRowDblClick({
            data
        }) {}
    }
}
</script>
