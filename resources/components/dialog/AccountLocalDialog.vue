<template>
<v-dialog id="employee-dialog" max-width="500" v-model="dialogIsShow">
    <v-card>
        <v-card-title class="headline primary-gradient white--text py-2">
            <span>{{ $t("account_list", "acnt") }}</span>
            <v-spacer></v-spacer>
            <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
        </v-card-title>
        <v-container fluid class="pt-0">
            <v-row no-gutters align="center" justify="space-between">
                <v-col cols="12">
                    <!-- Search Panel -->
                    <v-row align="center" justify="space-between">
                        <v-col cols="12">
                            <v-card outlined tile>
                                <v-container fluid>
                                    <v-row dense align="center" justify="space-between">
                                        <v-col cols="8">
                                            <v-select dense hide-details item-value="PK" item-text="TEXT" :label="$t('company')" :items="companyList" v-model="selectedCompany"></v-select>
                                        </v-col>
                                    </v-row>
                                    <v-row dense align="center" justify="space-between">
                                        <v-col cols="4">
                                            <v-text-field clearable dense readonly hide-details :label="$t('account_pk')" v-model="txtAccountPK" v-show="false"></v-text-field>
                                            <v-text-field autofocus clearable dense hide-details outlined :label="$t('vas_account_code')" @keypress.enter="onSearchAccount" v-model="txtAccountCode" @dblclick="onRowDblClick('A')"></v-text-field>
                                        </v-col>
                                        <v-col cols="8">
                                            <v-text-field autofocus clearable dense hide-details outlined :label="$t('vas_account_name')" @keypress.enter="onSearchAccount" v-model="txtAccountName" @dblclick="onRowDblClick('A')"></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-row dense align="center" justify="space-between">
                                        <v-col cols="4">
                                            <v-combobox v-model="sel_Subcode" :items="cbo_Subcode" :label="$t('sub_code')" item-text="SUB_CD" item-value="PK" @dblclick="onRowDblClick('S')">
                                            </v-combobox>
                                            <v-text-field clearable dense readonly hide-details :label="$t('sub_pk')" v-model="txtSubPK" v-show="false"></v-text-field>
                                            <v-text-field clearable dense hide-details outlined :label="$t('sub_code')" @keypress.enter="onSearchSubCode" v-show="false" v-model="txtSubCode" @dblclick="onRowDblClick('S')"></v-text-field>
                                        </v-col>
                                        <v-col cols="8">
                                            <v-text-field clearable dense hide-details outlined :label="$t('sub_name')" @keypress.enter="onSearchSubCode" v-model="txtSubName" @dblclick="onRowDblClick('S')"></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-row dense align="center" justify="space-between">
                                        <v-col cols="4">
                                            <v-combobox v-model="sel_Mcode" :items="cbo_Mcode" :label="$t('m_code')" item-text="M_CODE" item-value="PK" @dblclick="onRowDblClick('M')">
                                            </v-combobox>
                                            <v-text-field clearable dense hide-details outlined :label="$t('m_code')" v-show="false" @keypress.enter="onSearchMCode" v-model="txtMCode" @dblclick="onRowDblClick('M')"></v-text-field>
                                        </v-col>
                                        <v-col cols="8">
                                            <v-text-field clearable dense readonly hide-details v-model="txtMPK" v-show="false"></v-text-field>
                                            <v-text-field clearable dense hide-details outlined :label="$t('m_name')" @keypress.enter="onSearchMCode" v-model="txtMName" @dblclick="onRowDblClick('M')"></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-row dense align="center" justify="space-between">
                                        <v-col cols="2">
                                            <v-text-field clearable v-show="false" dense hide-details outlined v-model="txtTypeCall"></v-text-field>
                                            <v-text-field clearable dense readonly hide-details v-model="txtAbacctCodePK" type="string" v-show="false"></v-text-field>
                                            <v-btn hide-details small color="#74afcf" class='white--text mx-1' @click="onOkay()">
                                                {{$t('ok')}}
                                            </v-btn>
                                        </v-col>
                                        <v-col cols="2">
                                            <v-btn hide-details small color="#74afcf" class='white--text mx-1' @click="onCancle()">
                                                {{$t('cancle')}}
                                            </v-btn>
                                        </v-col>
                                        <v-col cols="2">
                                            <v-btn hide-details small color="#74afcf" class='white--text mx-1' @click="onCombinatons()">
                                                {{$t('combinatons')}}
                                            </v-btn>
                                        </v-col>
                                        <v-col cols="2">
                                            <v-btn hide-details small color="#74afcf" class='white--text mx-1' @click="onClear()">
                                                {{$t('clear')}}
                                            </v-btn>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-card>
                        </v-col>
                    </v-row>
                    <v-row align="center" justify="center">
                        <v-col cols="12" class="py-0">
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
            <dynamic-dialog ref="refDynamicDialog" :companyPK="user.TCO_COMPANY_PK" :header="dynamicHeader" :codeLabel="codeLabel" :nameLabel="nameLabel" :dialogTitle="dialogTitle" :procedure="procedure" :moreParas="moreParas" :autoSearch="autoSearch" :multiSelectMode="multiSelectMode" @returnData="callBackDynamicDialog" :filterRow="true"></dynamic-dialog>
            <account-dialog ref="accountDialog" @returnAccountInfo="getAccCodeItem" :TCO_COMPANY_PK=this.selectedCompany :sel_pro="storeProcedure"></account-dialog>
        </v-container>
    </v-card>
</v-dialog>
</template>

<script>
import AccountDialog from "@/components/dialog/AccountGetSPDialog.vue";
export default {
    name: "account-local-dialog",
    props: {
        headers: {
            type: Array,
        },
        accountCodePK: {
            type: String,
            default: "",
        },
        multiSelectMode: {
            type: Boolean,
            default: false,
        },
        sel_pro: {
            type: String,
            default: "sys_sel_account_code",
        },
        group_code: {
            type: Number,
            default: 0,
        },
    },
    data: () => ({
        dialogIsShow: false,
        dataList: [],
        selectedDatas: [],
        month: new Date().toISOString().substr(0, 7),
        menu: false,
        modal: false,
        txtAccountPK: "",
        txtAccountCode: "",
        txtAccountName: "",
        txtSubPK: "",
        txtSubCode: "",
        txtSubName: "",
        txtMPK: "",
        txtMCode: "",
        txtMName: "",
        selectedAccountType: "Y",
        selectedCompany: "",
        companyList: [],
        storeProcedure: "",
        dynamicHeader: [],
        codeLabel: "",
        nameLabel: "",
        dialogTitle: "",
        procedure: "",
        moreParas: [],
        autoSearch: false,
        txtTypeCall: "",
        txtAbacctCodePK: "",
        txtResultProcess: "",
        selectedDataBase: [],
        sel_Subcode: null,
        cbo_Subcode: [],
        sel_Mcode: null,
        cbo_Mcode: [],
    }),

    components: {
        "account-dialog": AccountDialog,
        DynamicDialog: () => import("@/components/dialog/DynamicDialog")
    },
    watch: {
        dialogIsShow(val) {
            if (val === true) {

                this.selectedCompany = this.user.TCO_COMPANY_PK;
                this.onClear();
                this.txtAbacctCodePK = this.accountCodePK.toString(16);
                this.getCompanyList();
                this.dataList = [];
                this.selectedDatas = [];
                this.month = new Date().toISOString().substr(0, 7);
                this.menu = false;
                this.modal = false;
                //this.txtAccountCode = "";
                //this.txtSubCode = "";
                //this.txtMCode = "";
                this.selectedAccountType = "Y";
                this.txtAbacctCodePK = this.accountCodePK.toString(16);
                this.onSetAccountCode();
            }
        },
        sel_Subcode(val) {
            console.log(val);        
            if (typeof val == "string") {
                this.txtSubPK = "";
                this.txtSubCode = val;
                this.txtSubName = "";
                this.onSearchSubCode();
            } else {
                this.txtSubPK = val.PK;
                this.txtSubCode = val.SUB_CD;
                this.txtSubName = val.SUB_NM;
            }

        },
        sel_Mcode(val) {
            if (typeof val == "string") {
                this.txtMPK = "";
                this.txtMCode = val;
                this.txtMName = "";
                this.onSearchMCode();
            } else {
                this.txtMPK = val.PK;
                this.txtMCode = val.M_CODE;
                this.txtMName = val.M_NM;
            }

        }
    },
    computed: {
        user() {
            return this.$store.getters["auth/user"];
        },
        limitHeight() {
            return this.windowHeight - 320;
        },
    },
    created() {

    },
    methods: {
        async getCompanyList() {
            const dso = {
                type: "list",
                selpro: "SYS_SEL_LIST_COMPANY",
                para: [this.user.PK]
            };
            const rows = await this._dsoCall(dso, "select", false);
            if (rows.length > 0) {
                this.companyList = rows;
            } else {
                this.companyList = [];
            }
        },

        async onSearchAccount() {
            const dso = {
                type: "process",
                updpro: "AC_PRO_6030012_GETKEY_ACC",
                para: [
                    this.txtAccountCode
                ]
            };
            const result = await this._dsoCall(dso, "process", false);
            if (result.length > 0) {
                this.txtAccountPK = result[0].PK;
                this.txtAccountCode = result[0].AC_CD;
                this.txtAccountName = result[0].AC_NM;

                this.onGetSubCode();
                this.onGetMCode();
            }
            if (this.txtAccountPK != "" && this.txtSubPK != "" && this.txtMPK != "") {
                const dsoacc = {
                    type: "process",
                    updpro: "AC_PRO_6030012_GETKEY",
                    para: [
                        this.txtAccountPK,
                        this.txtSubPK,
                        this.txtMPK
                    ]
                };
                const resultacc = await this._dsoCall(dsoacc, "process", false);
                if (resultacc[0].PK === null || resultacc[0].PK === "") {
                    this.showNotification('warning', this.$t('notification'), this.$t('you_can_combinatons_to_generate_accountcode'), 500);
                } else {
                    this.selectedDataBase = resultacc;
                    this.showNotification('success', this.$t('notification'), this.$t('process_sussce'), 500);
                }
            }
        },

        async onSearchSubCode() {
            const dso = {
                type: "process",
                updpro: "AC_PRO_6030012_GETKEY_SCC",
                para: [
                    this.txtSubCode
                ]
            };
            const result = await this._dsoCall(dso, "process", false);
            if (result.length > 0) {
                this.txtSubPK = result[0].PK;
                this.txtSubCode = result[0].AC_CD;
                this.txtSubName = result[0].AC_NM;
            }
            if (this.txtAccountPK != "" && this.txtSubPK != "" && this.txtMPK != "") {
                const dsosubacc = {
                    type: "process",
                    updpro: "AC_PRO_6030012_GETKEY",
                    para: [
                        this.txtAccountPK,
                        this.txtSubPK,
                        this.txtMPK
                    ]
                };
                const resultsubacc = await this._dsoCall(dsosubacc, "process", false);
                if (resultsubacc[0].PK === null || resultsubacc[0].PK === "") {
                    this.showNotification('warning', this.$t('notification'), this.$t('you_can_combinatons_to_generate_accountcode'), 500);
                } else {
                    this.selectedDataBase = resultsubacc;
                    this.showNotification('success', this.$t('notification'), this.$t('process_sussce'), 500);
                }
            }
        },

        async onSearchMCode() {
            const dso = {
                type: "process",
                updpro: "AC_PRO_6030012_GETKEY_MCC",
                para: [
                    this.txtMCode
                ]
            };
            const result = await this._dsoCall(dso, "process", false);
            if (result.length > 0) {
                this.txtMPK = result[0].PK;
                this.txtMCode = result[0].AC_CD;
                this.txtMName = result[0].AC_NM;
            }
            if (this.txtAccountPK != "" && this.txtSubPK != "" && this.txtMPK != "") {
                const dsomacc = {
                    type: "process",
                    updpro: "AC_PRO_6030012_GETKEY",
                    para: [
                        this.txtAccountPK,
                        this.txtSubPK,
                        this.txtMPK
                    ]
                };
                const resultmacc = await this._dsoCall(dsomacc, "process", false);
                if (resultmacc[0].PK === null || resultmacc[0].PK === "") {
                    this.showNotification('warning', this.$t('notification'), this.$t('you_can_combinatons_to_generate_accountcode'), 500);
                } else {
                    this.selectedDataBase = resultmacc;
                    this.showNotification('success', this.$t('notification'), this.$t('process_sussce'), 500);
                }
            }
        },
        onSelectionChanged({
            selectedRowsData
        }) {
            this.selectedDatas = selectedRowsData;
        },

        returnAccountInfo(datas) {
            this.$emit("returnAccountInfo", datas);
            this.dialogIsShow = false;
        },

        async onRowDblClick(_event) {
            this.txtTypeCall = _event;
            switch (_event) {
                case "A":
                    this.storeProcedure = "AC_SEL_ACCT_POPUP_6015018_1";
                    this.$refs.accountDialog.dialogIsShow = true;
                    break;
                case "S":
                    this.listData = await this._callProcedure("lg_sel_itemgroup_list", [this.selectedCompany, ]);
                    this.dialogTitle = this.$t("subgroup");
                    this.listLabel = this.$t("item_group");
                    this.codeLabel = this.$t("item_code");
                    this.nameLabel = this.$t("item_name");
                    this.dynamicHeader = this.BuildDynamicHeader("SUBGROUP");
                    this.procedure = "AC_SEL_6015015_SUBGROUP_V2";
                    this.moreParas = [this.txtAccountCode];
                    this.autoSearch = true;
                    this.multiSelectMode = true;
                    this.$refs.refDynamicDialog.dialogIsShow = true;
                    break;
                case "M":
                    this.listData = await this._callProcedure("lg_sel_itemgroup_list", [this.selectedCompany, ]);
                    this.dialogTitle = this.$t("mcode");
                    this.listLabel = this.$t("item_group");
                    this.codeLabel = this.$t("item_code");
                    this.nameLabel = this.$t("item_name");
                    this.dynamicHeader = this.BuildDynamicHeader("MCODE");
                    this.procedure = "AC_SEL_6015019_MCODE_V2";
                    this.moreParas = [this.txtAccountCode];
                    this.autoSearch = true;
                    this.multiSelectMode = true;
                    this.$refs.refDynamicDialog.dialogIsShow = true;
                    break;
            }
        },
        async callBackDynamicDialog(item) {
            if (item.length > 0) {
                switch (this.txtTypeCall) {
                    case "A":
                        this.txtAccountPK = item.PK;
                        this.txtAccountCode = item.AC_CD;
                        this.txtAccountName = item.AC_NM;

                        break;
                    case "S":
                        this.txtSubPK = item[0].PK;
                        this.txtSubCode = item[0].SUB_CD;
                        this.txtSubName = item[0].SUB_NM;

                        this.sel_Subcode = this.cbo_Subcode.find(x => x.PK == this.txtSubPK);

                        break;
                    case "M":
                        this.txtMPK = item[0].PK;
                        this.txtMCode = item[0].M_CODE;
                        this.txtMName = item[0].M_NM;

                        this.sel_Mcode = this.cbo_Mcode.find(x => x.PK == this.txtMPK);
                        break;
                }
            }
            if (this.txtAccountPK != "" && this.txtSubPK != "" && this.txtMPK != "") {
                const dso = {
                    type: "process",
                    updpro: "AC_PRO_6030012_GETKEY",
                    para: [
                        this.txtAccountPK,
                        this.txtSubPK,
                        this.txtMPK
                    ]
                };
                const result = await this._dsoCall(dso, "process", false);
                if (result[0].PK === "" || result[0].PK === null) {
                    this.showNotification('warning', this.$t('notification'), this.$t('you_can_combinatons_to_generate_accountcode'), 500);
                } else {
                    this.selectedDataBase = result;
                    this.showNotification('success', this.$t('notification'), this.$t('process_sussce'), 500);
                }
            }
        },
        getAccCodeItem(item) {
            this.txtAccountPK = item.PK;
            this.txtAccountCode = item.AC_CD;
            this.txtAccountName = item.AC_NM;
        },
        BuildDynamicHeader(p_table_nm) {
            let header = [];
            if (p_table_nm == "ST_CODE") {
                header = [{
                        dataField: "AC_GRP",
                        caption: this.$t("ac_grp"),
                    },
                    {
                        dataField: "AC_CD",
                        caption: this.$t("ac_cd"),
                    },
                    {
                        dataField: "AC_NM",
                        caption: this.$t("ac_nm"),
                    },
                    {
                        dataField: "AC_SNM",
                        caption: this.$t("ac_snm"),
                    },
                    {
                        dataField: "AC_LNM",
                        caption: this.$t("ac_lnm"),
                    },
                    {
                        dataField: "REMARK",
                        caption: this.$t("remark"),
                    },
                    {
                        dataField: "DRCR_TYPE",
                        caption: this.$t("drcr_type"),
                    },
                    {
                        dataField: "LEAF_YN",
                        caption: this.$t("leaf_yn")
                    }

                ];
                return header;
            } else if (p_table_nm == "MCODE") {
                header = [{
                        dataField: "M_CODE",
                        caption: this.$t("m_code"),
                    },
                    {
                        dataField: "M_NM",
                        caption: this.$t("m_nm"),
                    },
                    {
                        dataField: "M_LNM",
                        caption: this.$t("m_lnm"),
                    },
                    {
                        dataField: "M_KNN",
                        caption: this.$t("m_knn"),
                    },
                    {
                        dataField: "PARENT_FLEX_VALUE",
                        caption: this.$t("parent_flex_value"),
                    },
                    {
                        dataField: "FLEX_VALUE",
                        caption: this.$t("flex_value"),
                    },
                    {
                        dataField: "USE_IF",
                        caption: this.$t("use_if"),
                    }

                ];
                return header;
            } else if (p_table_nm == "SUBGROUP") {
                header = [{
                        dataField: "SUB_CD",
                        caption: this.$t("sub_cd"),
                    },
                    {
                        dataField: "SUB_NM",
                        caption: this.$t("sub_nm"),
                    },
                    {
                        dataField: "SUB_LNM",
                        caption: this.$t("sub_lnm"),
                    },
                    {
                        dataField: "SUB_FNM",
                        caption: this.$t("sub_fnm"),
                    },
                    {
                        dataField: "AUTO_YN",
                        caption: this.$t("auto_yn"),
                    }

                ];
                return header;
            }
        },
        async onOkay() {
            if (this.txtAccountPK === null || this.txtAccountCode === null || this.txtMPK === null || this.txtMCode === null || this.txtSubPK === null || this.txtSubCode === null) {
                return this.showNotification('danger', this.$t('alert'), this.$t('please_choose_a_code_tac_localcode_pk'), 500);
            } else if (this.selectedDataBase === null) {
                return this.showNotification('danger', this.$t('alert'), this.$t('please_combinatons_a_code_tac_localcode_pk_null'), 500);
            } else {
                const dso = {
                    type: "process",
                    updpro: "AC_PRO_6030012_GETKEY",
                    para: [
                        this.txtAccountPK,
                        this.txtSubPK,
                        this.txtMPK
                    ]
                };
                const result = await this._dsoCall(dso, "process", false);
                if (result[0].PK === null) {
                    return this.showNotification('danger', this.$t('alert'), this.$t('please_combinatons_a_code_tac_localcode_pk'), 500);
                } else {
                    this.selectedDataBase = result;
                    this.$emit("returnAccountInfo", this.selectedDataBase);
                    this.dialogIsShow = false;
                }
            }
        },
        onCancle() {
            this.dialogIsShow = false;
        },
        async onCombinatons() {

            if (this.txtAccountPK == "" && this.txtSubPK == "" && this.txtMPK == "") {

                this.showNotification('warning', this.$t('Warning'), this.$t('Please_Choose_Account_Code_Sub_Code_M_Code'), 500);
                return;

            }

            const dso = {
                type: "process",
                updpro: "AC_PRO_6030012_ADDKEY",
                para: [
                    this.txtAccountPK,
                    this.txtAccountCode,
                    this.txtSubPK,
                    this.txtSubCode,
                    this.txtMPK,
                    this.txtMCode,
                    this.selectedCompany
                ]
            };
            const result = await this._dsoCall(dso, "process", true);
            if (result[0].PK === "" || result[0].PK === null) {
                return this.showNotification('danger', this.$t('alert', 'common'), this.$t('a_code_is_exit_!!', 'common'), 500);
            } else {
                this.selectedDataBase = result;
            }
        },
        onClear() {
            this.txtAccountPK = "";
            this.txtAccountCode = "";
            this.txtAccountName = "";
            this.txtSubPK = "";
            this.txtSubCode = "";
            this.txtSubName = "";
            this.txtMPK = "";
            this.txtMCode = "";
            this.txtMName = "";
        },
        async onSetAccountCode() {
            if (this.txtAbacctCodePK !== '') {
                const dso = {
                    type: "process",
                    updpro: "AC_PRO_6030012_GETACCOUNT",
                    para: [
                        this.txtAbacctCodePK
                    ]
                };
                const result = await this._dsoCall(dso, "process", true);
                console.log(result);
                if (result.length > 0) {
                    this.txtAccountPK = result[0].TAC_LOCALCODE_PK;
                    this.txtAccountCode = result[0].AC_CD;
                    this.txtAccountName = result[0].AC_NM;

                    this.onGetSubCode();
                    this.onGetMCode();
                    setTimeout(() => {
                        this.sel_Subcode = this.cbo_Subcode.find(x => x.PK == result[0].TAC_SUBCODE_PK);
                        this.txtSubPK = this.sel_Subcode.PK;
                        this.txtSubCode = this.sel_Subcode.SUB_CD;
                        this.txtSubName = this.sel_Subcode.SUB_NM;

                        this.sel_Mcode = this.cbo_Mcode.find(x => x.PK == result[0].TAC_MCODE_PK);
                        this.txtMPK = this.sel_Mcode.PK;
                        this.txtMCode = this.sel_Mcode.M_CODE;
                        this.txtMName = this.sel_Mcode.M_NM;
                    }, 1000);

                }

            }

        },
        async onGetSubCode() {
            const dso = {
                type: 'list',
                selpro: 'AC_SEL_6015015_SUBGROUP_V2',
                para: [this.selectedCompany, '', '', this.txtAccountCode]
            }
            const result = await this._dsoCall(dso, 'select', false)
            if (result.length > 0) {
                this.cbo_Subcode = result;
                this.sel_Subcode = result[0];

                this.txtSubPK = result[0].PK;
                this.txtSubCode = result[0].SUB_CD;
                this.txtSubName = result[0].SUB_NM;
            }
        },
        async onGetMCode() {
            const dso = {
                type: 'list',
                selpro: 'AC_SEL_6015019_MCODE_V2',
                para: [this.selectedCompany, '', '', this.txtAccountCode]
            }
            const result = await this._dsoCall(dso, 'select', false)
            if (result.length > 0) {
                this.cbo_Mcode = result;
                this.sel_Mcode = result[0];

                this.txtMPK = result[0].PK;
                this.txtMCode = result[0].M_CODE;
                this.txtMName = result[0].M_NM;
            }
        }

    },
};
</script>
