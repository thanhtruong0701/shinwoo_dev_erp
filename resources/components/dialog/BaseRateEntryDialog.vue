<template>
<v-dialog id="base-rate-entry-dialog" max-width="1000" v-model="dialogIsShow">
    <v-card>
        <v-card-title class="headline primary-gradient white--text py-2">
            <span>{{ $t("base_rate_entry", "common") }}</span>
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
                                        <v-col lg="3" sm="4" cols="12" class="pb-2">
                                            <v-select dense cache-items hide-details item-value="PK" item-text="TEXT" :label="$t('company')" :items="companyList" v-model="selectedCompany" @change="onSearch"></v-select>
                                        </v-col>
                                        <v-col lg="2" sm="4" cols="12" class="pb-2">
                                            <v-select clearable dense cache-items hide-details item-value="PK" item-text="TEXT" :label="$t('period_type')" :items="lstPeriodType" v-model="selectedPeriodType" @change="onChangePeriod"></v-select>
                                        </v-col>
                                        <v-col lg="2" sm="4" cols="12" class="pb-2" v-show=!btnPeriod>
                                            <date-control type="months" @returnValue="selectedMonthFrom = $event"></date-control>
                                        </v-col>
                                        <v-col lg="2" sm="4" cols="12" class="pb-2" v-show=!btnPeriod>
                                            <date-control type="months" @returnValue="selectedMonthTo = $event"></date-control>
                                        </v-col>
                                        <v-col lg="2" sm="4" cols="12" class="pb-2" v-show=btnPeriod>
                                            <date-picker :label="$t('date_from')" @returnValue="date_from = $event" dense outlined></date-picker>
                                        </v-col>
                                        <v-col lg="2" sm="4" cols="12" class="pb-2" v-show=btnPeriod>
                                            <date-picker :label="$t('date_to')" @returnValue="date_to = $event" dense outlined></date-picker>
                                        </v-col>
                                        <v-col lg="2" sm="4" cols="2" class="text-right">
                                            <v-btn icon tile :color="currentTheme" :disabled="isProcessing" @click="onSearch">
                                                <v-icon>mdi-magnify</v-icon>
                                            </v-btn>
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on }">
                                                    <v-btn icon v-show="true" tile @click="exportReport" :color="currentTheme">
                                                        <v-icon v-on="on">mdi-file-excel</v-icon>
                                                    </v-btn>
                                                </template>
                                                <span>{{ $t('report') }}</span>
                                            </v-tooltip>
                                        </v-col>
                                        <v-col lg="3" sm="4" cols="12" class="pb-2">
                                            <v-select dense cache-items hide-details item-value="PK" item-text="TEXT" :label="$t('tr_ccy')" :items="lstCurrency" v-model="selectedCurrency"></v-select>
                                        </v-col>
                                        <v-col lg="9" sm="4" cols="12" class="pb-2">

                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-card>
                        </v-col>
                    </v-row>

                    <!-- Table -->
                    <v-row align="center" justify="center">
                        <v-col cols="12" class="py-0">
                            <v-card outlined tile v-resize="onResize">
                                <DxDataGrid column-resizing-mode="widget" :allow-column-resizing="true" 
                                :columnAutoWidth="$vuetify.breakpoint.smAndDown" :data-source="dataList" 
                                :height="limitHeight" :show-borders="true" :show-column-lines="true" :show-row-lines="true" @selection-changed="onSelectionChanged" :onRowDblClick="onSelectSingle">
                                    <DxColumn data-field="PARTNER_NAME" :caption="$t('partner_name')"></DxColumn>
                                    <DxColumn data-field="STD_YM" :caption="$t('std_ym')" css-class="cell-align-center"></DxColumn>
                                    <DxColumn data-field="CODE_NM" :caption="$t('tr_ccy')"></DxColumn>
                                    <DxColumn data-field="TTB_RATE" dataType="number" format="###,###.##" :caption="$t('ttb_rate')"></DxColumn>
                                    <DxColumn data-field="TTS_RATE" dataType="number" format="###,###.##" :caption="$t('tts_rate')"></DxColumn>
                                    <DxColumn data-field="TTM_RATE" dataType="number" format="###,###.##" :caption="$t('ttm_rate')"></DxColumn>
                                    <DxColumn data-field="TTMP_RATE" dataType="number" format="###,###.##" :caption="$t('ttmp_rate')"></DxColumn>
                                    <DxPaging v-if="dataList.length < 500" :page-size="dataList.length" />
                                    <DxScrolling v-else mode="infinite" />
                                    <DxSelection mode="multiple" v-if="multiSelectMode" />
                                    <DxSelection mode="single" v-if="!multiSelectMode" />
                                </DxDataGrid>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-container>
    </v-card>
</v-dialog>
</template>

<script>
export default {
    name: "base-rate-entry-dialog",
    // props: ["empSelectProbs", "multiSelectMode"],
    components: {
        DateControl: () => import("@/components/control/DateControl"),
        DatePicker: () => import("@/components/control/DatePicker"),
    },
    props: {
        multiSelectMode: {
            type: Boolean,
            default: false,
        },
    },

    data: () => ({
        dialogIsShow: false,
        btnPeriod: false,
        dataList: [],
        selectedDatas: [],

        companyList: [],
        selectedCompany: "",

        lstPeriodType: [],
        selectedPeriodType: "",

        selectedMonthFrom: "",
        selectedMonthTo: "",

        lstCurrency: [],
        selectedCurrency: ""
    }),

    created() {
        this.selectedCompany = this.user.TCO_COMPANY_PK;
    },

    mounted() {},

    computed: {
        user() {
            return this.$store.getters["auth/user"];
        },
        limitHeight() {
            return this.windowHeight - 320;
        },
    },

    watch: {
        dialogIsShow(val) {
            if (val === true) {
                this.getCompanyList();
            }
        },
    },

    methods: {
        async getCompanyList() {
            const dso = {
                type: "list",
                selpro: "SYS_SEL_LIST_COMPANY",
                para: [this.user.PK],
            };
            const result = await this._dsoCall(dso, "select", false);
            if (result) {
                this.companyList = result;
            } else {
                this.companyList = [];

            }
            const dso_currency_list = {
                type: 'list',
                selpro: 'AC_GET_COMMONCODE_EI',
                para: [this.selectedCompany, 'ACJS0140']
            }
            this.lstPeriodType = await this._dsoCall(dso_currency_list, 'select', false)
            this.selectedPeriodType = this.lstPeriodType[0].PK
            this.onChangePeriod();
            const dso_period_list = {
                type: 'list',
                selpro: 'AC_GET_COMMONCODE_EI_ALL',
                para: [this.selectedCompany, 'ACAB0110']
            }
            this.lstCurrency = await this._dsoCall(dso_period_list, 'select', false)
            this.selectedCurrency = 'ALL'
        },

        async onSearch() {
            const dso = {
                type: "grid",
                selpro: "AC_SEL_6020010_POPUP",
                para: [this.selectedMonthFrom,
                    this.selectedMonthTo,
                    this.date_from,
                    this.date_to,
                    this.selectedCurrency,
                    this.selectedCompany,
                    this.selectedPeriodType
                ],
            };
            this.dataList = await this._dsoCall(dso, "select", false);
        },

        onSelectionChanged({
            selectedRowsData
        }) {
            this.selectedDatas = selectedRowsData;
        },

        onSelectSingle({
            data
        }) {
            this.callBackData(data);
        },

        onSelectMultiple() {
            let rtn_data = this.multiSelectMode ?
                this.selectedDatas :
                this.selectedDatas[0];
            this.callBackData(rtn_data);
        },

        callBackData(datas) {
            this.$emit("callBackData", datas);
            this.dialogIsShow = false;
        },
        onChangePeriod() {
            // console.log(this.selectedPeriodType);
            if (this.selectedPeriodType === '0') {
                this.btnPeriod = false;
            } else if (this.selectedPeriodType === '1') {
                this.btnPeriod = true;
            } else {
                this.btnPeriod = true;
            }
        },

        async exportReport() {
            try {
                var data_seach = [{
                    p_MonthFrom: this.selectedMonthFrom,
                    p_MonthTo: this.selectedMonthTo,
                    P_date_from: this.date_from,
                    P_date_to: this.date_to,
                    P_Currency: this.selectedCurrency,
                    P_Company_Pk: this.selectedCompany,
                    P_Company_Nm: this.companyList,
                    P_TYPE: this.selectedPeriodType
                }];
                this.processingDialog = true;
                const res = await this.$axios.$get("/report/rpt6020010/export_excel", {
                    responseType: "blob",
                    params: {
                        proc: "AC_RPT_6020010_POPUP",
                        para: data_seach
                    }
                });
                if (res) {
                    this.processingDialog = false;
                    this._ExcelSaveAs(res, "ListOfBaseRate"+"_"+this.user.USER_ID+".xlsx");
                    // this.showNotification(
                    //     "success",
                    //     this.$t("export_report_successful"),
                    //     "",
                    //     4000
                    // );
                    // let blob = new Blob([res], {
                    //     type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    // });
                    // let url = window.URL.createObjectURL(blob);
                    // console.log(url)
                    // window.open(url);
                } else {
                    this.processingDialog = false;
                    this.showNotification(
                        "danger",
                        this.$t("fail_to_export_report"),
                        "",
                        4000
                    );
                }
            } catch (e) {
                this.processingDialog = false;
                this.showNotification("danger", e.message, "", 4000);
            }
        },
    },
};
</script>
