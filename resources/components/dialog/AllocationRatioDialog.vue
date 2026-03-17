<template>
<v-dialog id="allocation-ratio-dialog" max-width="1000" v-model="dialogIsShow">
    <v-card>
        <v-card-title class="headline primary-gradient white--text py-2">
            <span>{{ $t("allocation_list") }}</span>
            <v-spacer></v-spacer>
            <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
        </v-card-title>
        <v-container fluid class="pt-0">
            <v-row no-gutters>
                <v-col md="12">
                    <!-- Search Panel -->
                    <v-row align="center" justify="space-between">
                        <v-col md="12">
                            <v-card outlined tile>
                                <v-container fluid>
                                    <v-row dense align="center">
                                        <v-col cols="12">
                                            <div class="d-flex justify-end">
                                                <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="onSearch" />
                                                <BaseButton icon_type="process" :btn_text="$t('process')" :disabled="isProcessing" @onclick="onProcess" />
                                            </div>
                                        </v-col>
                                    </v-row>
                                    <v-row dense align="center">
                                        <v-col cols="2">
                                            <BaseDatePicker outlined default month :label="$t('month')" v-model="dtMonth" />
                                        </v-col>
                                        <v-col cols="2">
                                            <BaseSelect outlined :label="$t('allocation_crt')" v-model="selectedCriteria" :lstData="criteriaList" item-text="NAME" item-value="CODE" :text_all="$t('select_all')" />
                                        </v-col>
                                        <v-col cols="4" class="pb-2">
                                            <BaseInput outlined :label="$t('account_code')" :placeholder="$t('doubleclick_to_get_data')" v-model="txtAccountCode" @dblClick="openAccountDialog">
                                                <template v-slot:append>
                                                    <v-tooltip bottom>
                                                        <template v-slot:activator="{ on }">
                                                            <v-icon v-on="on" :color="currentTheme" @click="openAccountDialog">mdi-window-restore</v-icon>
                                                        </template>
                                                        <span>{{ $t('show_account') }}</span>
                                                    </v-tooltip>
                                                    <v-tooltip bottom>
                                                        <template v-slot:activator="{ on }">
                                                            <v-icon v-on="on" :color="currentTheme" @click="onClearACC">mdi-eraser</v-icon>
                                                        </template>
                                                        <span>{{ $t('reset') }}</span>
                                                    </v-tooltip>
                                                </template>
                                            </BaseInput>
                                        </v-col>
                                        <v-col cols="4">
                                            <BaseInput outlined :label="$t('pl_unit')" :placeholder="$t('doubleclick_to_get_data')" v-model="txtPLCode" @dblClick="openPLUnitDialog">
                                                <template v-slot:append>
                                                    <v-tooltip bottom>
                                                        <template v-slot:activator="{ on }">
                                                            <v-icon v-on="on" :color="currentTheme" @click="openPLUnitDialog">mdi-window-restore</v-icon>
                                                        </template>
                                                        <span>{{ $t('show_plunit') }}</span>
                                                    </v-tooltip>
                                                    <v-tooltip bottom>
                                                        <template v-slot:activator="{ on }">
                                                            <v-icon v-on="on" :color="currentTheme" @click="onClearPL">mdi-eraser</v-icon>
                                                        </template>
                                                    </v-tooltip>
                                                </template>
                                            </BaseInput>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-card>
                        </v-col>
                    </v-row>

                    <!-- Table -->
                    <v-row align="center" justify="center">
                        <v-col md="12" class="py-0">
                            <v-card outlined tile v-resize="onResize">
                                <DataGridView ref="dataGrid" :select_mode="multiSelectMode ? (hideSelect ?'MultipleHideBox' : 'Multiple' )  : 'Single'" :max_height="limitHeight" :header="[ 
                       {
                        dataField: 'ALLEXP_ID',
                        caption: this.$t('allexp_id') 
                      }, {
                        dataField: 'ALLEXP_NM',
                        caption: this.$t('allexp_nm') 
                      },{
                        dataField: 'CRITARIE',
                        caption: this.$t('allocation_crt'), 
                            lookup: { 
                                dataSource: this.criteriaList, 
                                displayExpr:'NAME', 
                                valueExpr: 'CODE' 
                            },

                      },
                      {
                        dataField: 'PL_CD',
                        caption: this.$t('pl_cd'), 
                      },
                      {
                        dataField: 'PL_NM',
                        caption: this.$t('pl_nm') 
                      },
                      {
                        dataField: 'RATIO',
                        caption: this.$t('ratio'),
                                    dataType: 'number',
                                    formatFloat: 2,
                      },
                      {
                        dataField: 'AMOUNT',
                        caption: this.$t('amount'),
                                    dataType: 'number',
                                    formatFloat: 2,
                      }
                    ]" sel_procedure="AC_SEL_6085090_POPUP" :filter_paras="[
                      this.dtMonth,
                      this.selectedCriteria,
                      this.TAC_ABACCTCODE_PK,
                      this.TAC_ABPL_PK
                    ]" @cellDblClick="callBackData" />
                            </v-card>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
            <account-dialog ref="accountDialog" @returnAccountInfo="mappingAccount"></account-dialog>
            <pl-unit-dialog ref="plUnitDialog" @returnPlUnitInfo="mappingPlUnit"></pl-unit-dialog>
        </v-container>
    </v-card>
</v-dialog>
</template>

<script>
export default {
    name: "allocation-ratio-dialog",
    components: {
        DataGridView: () => import("@/components/control/DataGridView"),
        accountDialog: () => import("@/components/dialog/AccountDialog"),
        AlertDialog: () => import("@/components/dialog/AlertDialog"),
        ConfirmDialog: () => import("@/components/dialog/ConfirmDialog"),
        PlUnitDialog: () => import("@/components/dialog/PlUnitDialog"),
    },
    props: {
        headers: {
            type: Array
        },
        multiSelectMode: {
            type: Boolean,
            default: false
        },
        companyPK: {
            type: [String, Number],
        },
        hideSelect: {
            type: Boolean,
            default: true
        },
    },

    data: () => ({
        dialogIsShow: false,
        dataList: [],
        selectedDatas: [],
        sel_company: "",
        dtMonth: "",
        criteriaList: [],
        selectedCriteria: "",

        txtAccountCode: "",
        TAC_ABACCTCODE_PK: "",
        txtPLCode: "",
        txtPlName: "",
        TAC_ABPL_PK: "",
    }),

    computed: {
        user() {
            return this.$store.getters["auth/user"];
        },
        limitHeight() {
            return this.windowHeight - 320;
        }
    },

    watch: {
        dialogIsShow(val) {
            if (val === true) {
                this.sel_company = this.companyPK;
                this.getListCodes();
            } else {
                this.$refs.dataGrid.Clear();
            }
        },
    },

    methods: {
        async getListCodes() {
            const result_crt = await this._getCommonCode('A1400002', ''); //ACAB00340 A1400002
            this.criteriaList = result_crt;
            this.criteriaList.forEach(e => {
                this.selectedCriteria = e.CODE;
            });
        },
        openAccountDialog() {
            this.$refs.accountDialog.dialogIsShow = true;
        },
        mappingAccount(item) {
            this.txtAccountCode = item.AC_CD + " " + item.AC_NM;
            this.TAC_ABACCTCODE_PK = item.PK;
        },
        onClearACC() {
            this.txtAccountCode = '';
            this.TAC_ABACCTCODE_PK = '';
        },
        openPLUnitDialog() {
            this.$refs.plUnitDialog.dialogIsShow = true;
        },
        mappingPlUnit(item) {
            this.txtPLCode = item.PL_CD + " " + item.PL_NM;
            this.TAC_ABPL_PK = item.PK;
        },
        onClearPL() {
            this.txtPLCode = '';
            this.TAC_ABPL_PK = '';
        },
        async onSearch() {
            this.$refs.dataGrid.loadData();
        },
        async onProcess() {
            const dso = {
                type: "process",
                updpro: "AC_PRO_6085090_POPUP_RATIO",
                para: [this.dtMonth, this.sel_company]
            };
            const result = await this._dsoCall(dso, "process", false);
            if (result && result[0].STATUS) {
                this.showNotification(
                    "success",
                    this.$t(result[0].STATUS),
                    "",
                    5000
                );
            }
        },

        callBackData() {
            this.$emit("callBackData", this.multiSelectMode ? this.$refs.dataGrid.selectedDatas : this.$refs.dataGrid.selectedDatas[0]);
            this.dialogIsShow = false;
        }
    }
};
</script>
