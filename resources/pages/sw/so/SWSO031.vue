<template>
    <v-container fluid class="pa-0">
        <v-row no-gutters>
            <v-col cols="12">
                <!-- Search Panel -->
                <v-row align="center" justify="center">
                    <v-col cols="12">
                        <v-card outlined tile>
                            <v-container fluid class="pb-0">
                                <v-row dense align="center" justify="space-between">
                                    <!-- row 1 -->
                                    <!-- Company -->
                                    <v-col lg="2" class="pb-0">
                                        <BaseSelect :label="$t('Factory')" v-model="selectedCompany"
                                            :lstData="lstCompany" item-text="NAME" item-value="CODE" />
                                    </v-col>
                                    <v-col lg="2" class="pb-0">
                                        <BaseDatePicker v-model="dtFrom" outlined :label="$t('from_date')" default
                                            @change="Onsearch"> </BaseDatePicker>
                                    </v-col>
                                    <v-col lg="2" class="pb-0">
                                        <BaseDatePicker v-model="dtTo" outlined :label="$t('to_date')" default
                                            @change="Onsearch"> </BaseDatePicker>
                                    </v-col>

                                    <v-col lg="2" cols="12">
                                        <BaseSelect :label="$t('Report Type')" v-model="selectedOrderType"
                                            :lstData="lstOrderType" item-text="text" item-value="value" />
                                    </v-col>
                                    <v-col lg="2" cols="12"> </v-col>
                                    <v-col lg="2" cols="12">
                                        <div class="d-flex justify-end">
                                            <BaseButton icon_type="search" :btn_text="$t('search')" @onclick="search"
                                                :disabled="isProcessing" />
                                            <BaseButton icon_type="excel" :btn_text="$t('excel')"
                                                :disabled="isProcessing" @onclick="onReport" />
                                            <!--BaseButton icon_type="excel" :btn_text="$t('excel')" @onclick="OnPrint" :disabled="isProcessing" /-->
                                        </div>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-card>
                    </v-col>
                </v-row>
                <!-- Data Table -->
                <v-row align="center" justify="center">
                    <v-col cols="12" class="py-0">
                        
                        <v-tabs dark background-color="#4DB6AC" class="mb-2 force-arrows"  height="35" show-arrows
                            next-icon="mdi-arrow-right-bold-box-outline" prev-icon="mdi-arrow-left-bold-box-outline"
                            color="deep-orange darken-4" v-model="tab_control">
                            
                            <v-tab v-for="(store, index) in stores" :key="store.href">
                                {{ $t(store.label) }}
                            </v-tab>
                         
                        </v-tabs>


                        <v-tabs-items v-model="tab_control" v-resize="onResize">
                            <v-tab-item v-for="store in stores" :key="store.header" eager>
                                <v-row align="center" justify="center">
                                    <v-col cols="12" class="py-0">
                                        <v-card outlined tile v-resize="onResize">
                                            <DataGridView :ref="store.href" :header="getCommonHeader()"
                                                :sel_procedure="store.sel_procedure" select_mode="Single"
                                                :filter_paras="[dtFrom, selectedCompany]" :is_allow_paste="false"
                                                :max_height="limitHeight - 50"
                                                @onRowPrepared="(e) => onRowPrepared(store.href, e)"
                                                @cellDblClick="onRowDblClick" @cellClick="selectionChanged"
                                                :filterRow="true" />
                                        </v-card>
                                    </v-col>
                                </v-row>
                            </v-tab-item>
                        </v-tabs-items>

                        <!-- <v-tabs-items v-model="tab_control" v-resize="onResize">
                            <v-tab-item v-for="(store, index) in stores" :key="index" eager>
                                <v-row align="center" justify="center">
                                    <v-col cols="12" class="py-0">
                                        <v-card outlined tile v-resize="onResize">
                                            <DataGridView :ref="'dataGrid' + index" :header="store.header"
                                                :sel_procedure="store.sel_procedure" select_mode="Single"
                                                :filter_paras="[dtFrom, selectedCompany]" :is_allow_paste="false"
                                                :max_height="limitHeight - 50" @onRowPrepared="onRowPreparedGrid11"
                                                @cellDblClick="onRowDblClick" @cellClick="selectionChanged"
                                                :filterRow="true" />
                                        </v-card>
                                    </v-col>
                                </v-row>
                            </v-tab-item>
                        </v-tabs-items> -->
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
        <partner-dialog ref="partnerDialog" @callBackData="handleReturnedPartner" />
        <account-slip-dialog ref="accountSlipDialog" :seqArray="seqArray" :currentSeq="currentSeq" />
        <alert-dialog ref="alertDialog"></alert-dialog>
        <cost-center-dialog ref="refPLCenter" :companyPK="user.TCO_COMPANY_PK"
            @returnData="mappingPLCenter"></cost-center-dialog>
        <cost-center-dialog ref="refPLCenterDebit" :companyPK="user.TCO_COMPANY_PK"
            @returnData="mappingPLDebitCenter"></cost-center-dialog>
        <cost-center-dialog ref="refPLCenterCrebit" :companyPK="user.TCO_COMPANY_PK"
            @returnData="mappingPLCrebitCenter"></cost-center-dialog>
        <account-dialog ref="accountDebitDialog" @returnAccountInfo="getUppAccDebitDialog"></account-dialog>
        <account-dialog ref="accountCrebitDialog" @returnAccountInfo="getUppAccCrebitDialog"></account-dialog>
        <account-dialog ref="accountDialog" @returnAccountInfo="getUppAccDialog"></account-dialog>
        <dynamic-dialog ref="refDynamicDialog" :companyPK="user.TCO_COMPANY_PK" :header="dynamicHeader"
            :listLabel="listLabel" :listData="listData" :codeLabel="codeLabel" :nameLabel="nameLabel"
            :dialogTitle="dialogTitle" :procedure="procedure" :moreParas="moreParas" :autoSearch="autoSearch"
            :multiSelectMode="multiSelectMode" @returnData="onSelectItemInfo"></dynamic-dialog>
    </v-container>
</template>

<script>
import AccountDialog from '@/components/dialog/AccountDialog.vue';
import PlUnitDialog from '@/components/dialog/PlUnitDialog';
export default {
    layout: 'default',
    middleware: 'user',

    components: {
        DatePicker: () => import('@/components/control/DatePicker'),
        PartnerDialog: () => import('@/components/dialog/PartnerDialog'),
        AccountSlipDialog: () => import('@/components/dialog/AccountSlipDialog'),
        AlertDialog: () => import('@/components/dialog/AlertDialog'),
        DateControl: () => import('@/components/control/DateControl'),
        PlUnitDialog,
        'account-dialog': AccountDialog,
        CostCenterDialog: () => import('@/components/dialog/CostCenterDialog'),
        DynamicDialog: () => import('@/components/dialog/DynamicDialog')
    },

    data: () => ({
        stores: [
            { label: 'TAB-01', href: 'dataGrid01', header: 'TAB01', sel_procedure: 'SW_LG_USSOFT_DEBITNOTE_NOCACHE' },
            { label: 'TAB-02', href: 'dataGrid02', header: 'TAB02', sel_procedure: 'SW_LG_USSOFT_DEBITNOTE_1_NOCACHE' },
            { label: 'TAB-03', href: 'dataGrid03', header: 'TAB03', sel_procedure: 'SW_LG_USSOFT_DEBITNOTE_2_NOCACHE' },
            { label: 'TAB-04', href: 'dataGrid04', header: 'TAB04', sel_procedure: 'SW_LG_USSOFT_DEBITNOTE_3_NOCACHE' },
            { label: 'TAB-05', href: 'dataGrid05', header: 'TAB05', sel_procedure: 'SW_LG_USSOFT_DEBITNOTE_4_NOCACHE' },
            { label: 'TAB-06', href: 'dataGrid06', header: 'TAB06', sel_procedure: 'SW_LG_USSOFT_DEBITNOTE_5_NOCACHE' },
            { label: 'TAB-07', href: 'dataGrid07', header: 'TAB07', sel_procedure: 'SW_LG_USSOFT_DEBITNOTE_6_NOCACHE' },
            { label: 'TAB-08', href: 'dataGrid08', header: 'TAB08', sel_procedure: 'SW_LG_USSOFT_DEBITNOTE_7_NOCACHE' },
            { label: 'TAB-09', href: 'dataGrid09', header: 'TAB09', sel_procedure: 'SW_LG_USSOFT_DEBITNOTE_8_NOCACHE' },
            { label: 'TAB-10', href: 'dataGrid10', header: 'TAB10', sel_procedure: 'SW_LG_USSOFT_DEBITNOTE_9_NOCACHE' },
            { label: 'TAB-11', href: 'dataGrid11', header: 'TAB11', sel_procedure: 'SW_LG_USSOFT_DEBITNOTE_10_NOCACHE' },
            { label: 'TAB-12', href: 'dataGrid12', header: 'TAB12', sel_procedure: 'SW_LG_USSOFT_DEBITNOTE_11_NOCACHE' },
            { label: 'TAB-13', href: 'dataGrid13', header: 'TAB13', sel_procedure: 'SW_LG_USSOFT_DEBITNOTE_12_NOCACHE' },
            { label: 'TAB-14', href: 'dataGrid14', header: 'TAB14', sel_procedure: 'SW_LG_USSOFT_DEBITNOTE_13_NOCACHE' },
            { label: 'TAB-15', href: 'dataGrid15', header: 'TAB15', sel_procedure: 'SW_LG_USSOFT_DEBITNOTE_14_NOCACHE' },
            { label: 'TAB-16', href: 'dataGrid16', header: 'TAB16', sel_procedure: 'SW_LG_USSOFT_DEBITNOTE_15_NOCACHE' },
            { label: 'TAB-17', href: 'dataGrid17', header: 'TAB17', sel_procedure: 'SW_LG_USSOFT_DEBITNOTE_16_NOCACHE' },
            { label: 'TAB-18', href: 'dataGrid18', header: 'TAB18', sel_procedure: 'SW_LG_USSOFT_DEBITNOTE_17_NOCACHE' },
            { label: 'TAB-19', href: 'dataGrid19', header: 'TAB19', sel_procedure: 'SW_LG_USSOFT_DEBITNOTE_18_NOCACHE' },
            { label: 'TAB-20', href: 'dataGrid20', header: 'TAB20', sel_procedure: 'SW_LG_USSOFT_DEBITNOTE_19_NOCACHE' },
            { label: 'TAB-21', href: 'dataGrid21', header: 'TAB21', sel_procedure: 'SW_LG_USSOFT_DEBITNOTE_20_NOCACHE' },
        ],
        companyList: [],
        lstCompany: [],
        selectedCompany: '',
        selectedOrderType: '',
        voucherTypeList: [],
        selectedVoucherType: '',
        seq: '',
        partnerPK: '',
        partner: '',
        dateFrom: '',
        dateTo: '',
        voucherNo: '',
        rbStatusList: [],
        selectedStatus: '2',
        reportLocationList: [],
        selectedReportLocation: '',
        rpPerson: '',
        description: '',
        descriptionLocal: '',
        languageList: [],
        selectedLang: '',
        depositNoList: [],
        selectedDepositNo: '',
        reportList: [],
        selectedReport: '',
        Month_fr: '',
        Month_to: '',
        dtMonth: '',
        dataListIOB: [],
        seqArray: [],
        currentSeq: null,
        lstWareHouseType: '',
        wareHouseList: [],
        lstWareHouse: '',
        inOutTypeList: [],
        trTypeList: [],
        lstTrType: '',
        txtItem_CD: '',
        txtItem_NM: '',
        txtAccount_C_PK: '',
        txtAccount_CD_C: '',
        txtAccount_NM_C: '',
        txtPL_C_PK: '',
        txtPL_CD_C: '',
        txtPL_NM_C: '',
        txtPL_D_PK: '',
        txtPL_CD_D: '',
        txtPL_NM_D: '',
        txtAccount_D_PK: '',
        txtAccount_CD_D: '',
        txtAccount_NM_D: '',
        dtFrom: '',
        dtTo: '',
        showGridMaster: false,
        myIcon: 'mdi-arrow-down-bold-box-outline',
        selectedItemKeys: [],
        selectList: [],
        lstACC_DC: '',
        txtAccount_PK: '',
        txtAccount_CD: '',
        txtAccount_NM: '',
        txtPL_PK: '',
        txtPL_CD: '',
        txtPL_NM: '',
        tab_control: 0,
        txtItem_PK: '',
        plCenterList: [],
        dialogTitle: '',
        listData: [],
        listLabel: '',
        codeLabel: '',
        nameLabel: '',
        procedure: '',
        moreParas: null,
        autoSearch: false,
        dynamicHeader: [],
        multiSelectMode: false,
        bizPlaceList: [],
        lstBizPlace: '',

        l_txtAccount_NM_D: '',
        l_txtAccount_NM_C: '',
        l_txtAccount: '',
        l_txtItem: '',

        l_txtPL_D: '',
        l_txtPL_C: '',
        l_txtPL: '',
        chkUnitYN: '',

        currentPK: null,
        grdType: '',
        bizCenterList: [],
        lstBizCenter: ''
    }),

    async created() {
        //this.selectedCompany = this.user.TCO_COMPANY_PK;
        const commoncode = await this._getCommonCode2(["LGSO031", "ACJS0060"], this.selectedCompany);
        this.lstCompany = commoncode[0];
        // this.lstCompany = [{ PK: '144', TEXT: 'K2' }];
        //this.selectedCompany='01';
        //this.getListCodes();
    },
    watch: {
        tab_control(val) {
            if (val == '2' || val == '3') {
                this.grdType = 'show';
            } else {
                this.grdType = '';
            }
            //gọi search mỗi khi đổi tab
            this.$nextTick(() => {
                this.search();
            });
        },
        l_txtItem(val) {
            if (!val) {
                this.txtItem_CD = '';
                this.txtItem_NM = '';
                this.txtItem_PK = '';
            } else {
                this.txtItem_CD = val;
            }
        }
    },
    computed: {
        user() {
            return this.$store.getters['auth/user'];
        },
        limitHeight() {
            if (this.$vuetify.breakpoint.lgAndUp) {
                return this.formContainerHeight - 77;
            } else if (this.$vuetify.breakpoint.mdAndDown && !this.$vuetify.breakpoint.xsOnly) {
                return this.formContainerHeight - 400;
            } else {
                return;
            }
        },
        //====================
        lstOrderType() {
            return [
                //{ value: "", text: "SELECT ALL" },
                { value: '01', text: 'USSOFT Debit Note' },
                { value: 'N', text: 'Not YET' } //,
                /*{ value: "CS", text: "Compensation" },
                        { value: "TE",text: "Test" },
                        { value: "OT", text: "Other" }*/
            ];
        },
        //===================
        //     TAB01() {
        //         const self = this;

        //         return [
        //             {
        //                 dataField: 'SEQ',
        //                 caption: this.$t('SEQ'),
        //                 visible: true,
        //                 width: '70'
        //             },
        //             {
        //                 dataField: 'FACTORY_NAME',
        //                 caption: this.$t('FACTORY_NAME'),
        //                 allowMerge: true,
        //                 width: '150'
        //             },
        //             {
        //                 dataField: 'DELI_TO',
        //                 caption: this.$t('DELI_TO'),
        //                 width: '150'
        //             },

        //             {
        //                 dataField: 'DELIVERY_DATE',
        //                 caption: this.$t('DELIVERY_DATE'),
        //                 width: '130'
        //             },
        //             {
        //                 caption: this.$t('LABEL_TYPE'),
        //                 width: 120,
        //                 calculateCellValue: rowData => {
        //                     // Nếu LABEL_TYPE có thì lấy nó, nếu không thì lấy LABELTYPE
        //                     return rowData.LABEL_TYPE || rowData.LABELTYPE || '';
        //                 }
        //             },

        //             {
        //                 dataField: 'STYLE',
        //                 caption: this.$t('STYLE'),
        //                 width: '100'
        //             },
        //             {
        //                 dataField: 'OUT_QTY',
        //                 caption: this.$t('OUT_QTY'),
        //                 width: '100'
        //             },
        //             {
        //                 dataField: 'AMOUNT',
        //                 caption: this.$t('AMOUNT'),
        //                 width: '120',
        //                 format: {
        //                     type: "fixedPoint", // hoặc "decimal"
        //                     precision: 2        // 2 chữ số thập phân
        //                 }
        //             },
        //             {
        //                 dataField: 'BILL_TO',
        //                 caption: this.$t('BILL_TO'),
        //                 width: '100'
        //             }
        //         ];
        //     },
        //    
    },
    mounted() {
        //this.selectedCompany = '01';//this.user.TCO_COMPANY_PK;
    },
    methods: {
        getCommonHeader() {
            return [
                { dataField: 'SEQ', caption: this.$t('SEQ'), visible: true, width: 70 },
                { dataField: 'FACTORY_NAME', caption: this.$t('FACTORY_NAME'), width: 150 },
                { dataField: 'DELI_TO', caption: this.$t('DELI_TO'), width: 150 },
                { dataField: 'DELIVERY_DATE', caption: this.$t('DELIVERY_DATE'), width: 130 },
                {
                    caption: this.$t('LABEL_TYPE'),
                    width: 120,
                    calculateCellValue: r => r.LABEL_TYPE || r.LABELTYPE || ''
                },
                { dataField: 'STYLE', caption: this.$t('STYLE'), width: 100 },
                { dataField: 'OUT_QTY', caption: this.$t('OUT_QTY'), width: 100 },
                {
                    dataField: 'AMOUNT',
                    caption: this.$t('AMOUNT'),
                    width: 120,
                    format: { type: 'fixedPoint', precision: 2 }
                },
                { dataField: 'BILL_TO', caption: this.$t('BILL_TO'), width: 100 }
            ];
        },
        // onRowPreparedGrid11(e) {
        //     this.onRowPreparedGrid_ALL(e);
        // },

        // onRowPreparedGrid_ALL(e) {
        //     if (e.rowType === 'data') {
        //         if (e.data.IsTotal === 1) {
        //             e.rowElement.style.fontWeight = 'bold';
        //             //   e.rowElement.style.background = '#FFE599';
        //         }
        //     }
        // },
        onRowPrepared(refName, e) {
            this.onRowPreparedGrid_ALL(refName, e);
        },

        // 🔹 Logic xử lý chung (tương tự code của bạn)
        onRowPreparedGrid_ALL(refName, e) {
            if (e.rowType === 'data') {
                if (e.data.IsTotal === 1) {
                    e.rowElement.style.fontWeight = 'bold';
                    // e.rowElement.style.background = '#FFE599'; // bật nếu muốn
                }
            }
        },
        handleReturnedPartner(data) {
            this.partnerPK = data.PK;
            this.partner = `${data.PARTNER_ID} - ${data.PARTNER_NAME}`;
        },

        // 
        async search() {
            console.log(this.tab_control);

            // 🟡 Kiểm tra điều kiện bắt buộc
            if (!this.selectedCompany) {
                this.$refs.selectedCompany.focus();
                return this.showNotification(
                    'warning',
                    this.$t('please_select_date_type_to search'),
                    '',
                    5000
                );
            }

            // 🟢 Lấy store hiện tại theo tab_control
            const currentStore = this.stores[this.tab_control];
            if (!currentStore) {
                console.warn('Không tìm thấy store tương ứng với tab hiện tại');
                return;
            }

            const refName = currentStore.href;
            const gridRef = this.$refs[refName];
            const grid = Array.isArray(gridRef) ? gridRef[0] : gridRef;

            // 🔵 Gọi loadData() nếu có
            if (grid && typeof grid.loadData === 'function') {
                await grid.loadData();
                console.log(`Đã load dữ liệu cho ${refName}`);
            } else {
                console.warn(`Không tìm thấy DataGridView cho ${refName}`);
            }
        },

        // async search() {
        //     let code = this.tab_control;
        //     const refName = `dataGrid${(code + 1).toString().padStart(2, "0")}`;
        //     // Ví dụ tab 0 -> dataGrid01

        //     this.$nextTick(() => {
        //         if (this.$refs[refName]) {
        //             this.$refs[refName].loadData();
        //         } else {
        //             console.warn("Chưa mount xong ref:", refName);
        //         }
        //     });
        // },

        onRowDblClick({ rowType, data }) {
            /* if(rowType === "data") {
                     this.currentSeq = data.SEQ
                     this.seqArray = this. dataListIOB.map(x => x.SEQ)
                     this.$refs.accountSlipDialog.dialogIsShow = true
                   }*/
        },
        openPLDialog(obj) {
            switch (obj) {
                case 'S':
                    this.$refs.refPLCenter.dialogIsShow = true;
                    break;
                case 'D':
                    this.$refs.refPLCenterDebit.dialogIsShow = true;
                    break;
                case 'C':
                    this.$refs.refPLCenterCrebit.dialogIsShow = true;
                    break;
            }
        },
        onDelete() {
            for (let i = 0; i < this.dataListIOB.length; i++) {
                if (this.selectList.includes(this.dataListIOB[i].PK)) {
                    this.dataListIOB[i]._rowstatus = 'd';
                }
            }
            this.onSave();
        },
        // async onSave() {
        //     let code = this.tab_control;
        //     switch (code) {
        //         case 0:
        //             this.$refs.dataGrid01.saveData();
        //             break;
        //         case 1:
        //             this.$refs.dataGrid02.saveData();
        //             break;
        //         case 2:
        //             this.$refs.dataGrid03.saveData();
        //             break;
        //         case 3:
        //             this.$refs.dataGrid04.saveData();
        //             break;
        //         case 4:
        //             this.$refs.dataGrid05.saveData();
        //             break;
        //         case 5:
        //             this.$refs.dataGrid06.saveData();
        //             break;
        //         case 6:
        //             this.$refs.dataGrid07.saveData();
        //             break;
        //         case 7:
        //             this.$refs.dataGrid08.saveData();
        //             break;
        //         case 8:
        //             this.$refs.dataGrid09.saveData();
        //             break;
        //         case 9:
        //             this.$refs.dataGrid10.saveData();
        //             break;
        //         case 10:
        //             this.$refs.dataGrid11.saveData();
        //             break;
        //     }
        // },
        async onSave() {
            // 🟢 Lấy store hiện tại theo tab đang mở
            const currentStore = this.stores[this.tab_control];
            if (!currentStore) {
                console.warn('Không tìm thấy store tương ứng với tab hiện tại');
                return;
            }

            const refName = currentStore.href;
            const gridRef = this.$refs[refName];
            const grid = Array.isArray(gridRef) ? gridRef[0] : gridRef;

            // 🔵 Gọi saveData() nếu có
            if (grid && typeof grid.saveData === 'function') {
                await grid.saveData();
                console.log(`Đã lưu dữ liệu cho ${refName}`);
            } else {
                console.warn(`Không tìm thấy hàm saveData() cho ${refName}`);
            }
        },

        getUppAccDebitDialog(item) {
            if (item) {
                this.txtAccount_D_PK = item.PK;
                this.txtAccount_CD_D = item.AC_CD;
                this.txtAccount_NM_D = item.AC_NM;
                this.l_txtAccount_NM_D = item.AC_CD + ' - ' + item.AC_NM;
            }
        },
        getUppAccCrebitDialog(item) {
            if (item) {
                this.txtAccount_CD_C = item.AC_CD;
                this.txtAccount_C_PK = item.PK;
                this.txtAccount_NM_C = item.AC_NM;
                this.l_txtAccount_NM_C = item.AC_CD + ' - ' + item.AC_NM;
            }
        },
        getUppAccDialog(item) {
            if (item) {
                this.txtAccount_CD = item.AC_CD;
                this.txtAccount_PK = item.PK;
                this.txtAccount_NM = item.AC_NM;
                this.l_txtAccount = item.AC_CD + ' - ' + item.AC_NM;
            }
        },


        mappingPLDebitCenter(item) {
            if (item) {
                this.txtPL_D_PK = item.PK;
                this.txtPL_CD_D = item.CODE;
                this.txtPL_NM_D = item.NAME;
                this.l_txtPL_D = item.CODE + ' - ' + item.NAME;
            }
        },
        mappingPLCrebitCenter(item) {
            if (item) {
                this.txtPL_C_PK = item.PK;
                this.txtPL_CD_C = item.CODE;
                this.txtPL_NM_C = item.NAME;
                this.l_txtPL_C = item.CODE + ' - ' + item.NAME;
            }
        },
        mappingPLCenter(item) {
            if (item) {
                this.txtPL_PK = item.PK;
                this.txtPL_CD = item.CODE;
                this.txtPL_NM = item.NAME;
                this.l_txtPL = item.CODE + ' - ' + item.NAME;
            }
        },
        selectionChanged({ data }) {
            this.selectList = data;
        },

        onSelectItemInfo(item) {
            if (item.PK !== undefined || item.PK !== '') {
                //if (this.$refs.grdItemInfo_N.getSelectRowsData()[0].PK.length == 0)  _rowstatus: 'i'
                /* this.$refs.grdItemInfo_N.setCellSelected("TCO_ITEM_PK",  item[0].PK)  		                 this.$refs.grdItemInfo_N.setCellSelected("ITEM_CODE",    item[0].ITEM_CODE)           
                         this.$refs.grdItemInfo_N.setCellSelected("ITEM_NAME",    item[0].ITEM_NAME)           
                         this.$refs.grdItemInfo_N.setCellSelected("ATTRIBUTE2",   item[0].ITEM_NAME)           
                         this.$refs.grdItemInfo_N.setCellSelected("WH_NAME",      item[0].WH_NAME)             
                         this.$refs.grdItemInfo_N.setCellSelected("TIN_WAREHOUSE_PK",item[0].TLG_IN_STORAGE_PK)
                         this.$refs.grdItemInfo_N.setCellSelected("ITEM_UOM",     item[0].UOM)  */

                this.txtItem_CD = item.ITEM_CODE;
                this.txtItem_NM = item.ITEM_NAME;
                this.txtItem_PK = item.PK;
                this.l_txtItem = item.ITEM_CODE + ' - ' + item.ITEM_NAME;
            }
        },

        async onReport() {
            const data_seach = [
                {
                    p_date_from: this.dtFrom,
                    p_company_pk: this.selectedCompany
                    //   P_FILE_NAME_NEW: 'rpt_DEBIT_NOTE_HEHEEH' // Thêm dòng này
                }
            ];
            console.log(data_seach);

            var file_nm = 'rpt_DEBIT_NOTE' + '.xlsx'; // Sửa tên file
            var url_path = '/report/rptswsoDebit_note/rptswso01_Test';

            try {
                const result = await this.$axios.$get(url_path, {
                    responseType: 'blob',
                    params: {
                        para: data_seach
                    }
                });
                if (result) {
                    this._ExcelSaveAs(result, file_nm);
                } else {
                    this.showNotification('danger', this.$t('fail_to_export_report'), '', 4000);
                }
            } catch (e) {
                this.showNotification('danger', e.message, '', 4000);
            }
        },
        // async Onsearch() {
        //     this.$refs.dataGrid01.loadData();
        // },
        async Onsearch() {
            const code = this.tab_control;
            const storeRef = this.stores[code]?.href;

            if (!storeRef) {
                console.warn(`Không tìm thấy storeRef cho tab ${code}`);
                return;
            }

            const ref = this.$refs[storeRef];

            // Nếu ref chưa render hoặc tab chưa eager
            if (!ref) {
                console.warn(`Ref ${storeRef} chưa được mount (tab chưa hiển thị?)`);
                console.log('Refs hiện có:', Object.keys(this.$refs));
                return;
            }

            // Nếu ref là mảng (do v-for)
            const grid = Array.isArray(ref) ? ref[0] : ref;

            if (grid && typeof grid.loadData === 'function') {
                await grid.loadData();
            } else {
                console.warn(`Không tìm thấy hàm loadData() trong ${storeRef}`);
            }
        }



    }
};
</script>
<style>
/* Ép Vuetify luôn hiển thị nút trái/phải */
.force-arrows .v-slide-group__prev,
.force-arrows .v-slide-group__next {
  opacity: 1 !important;
  visibility: visible !important;
  pointer-events: auto !important;
  display: flex !important;
}

</style>
