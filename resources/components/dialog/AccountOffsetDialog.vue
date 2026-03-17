<template>
<v-dialog id="accountoffset-dialog" max-width="1300" v-model="dialogIsShow" persistent>
    <v-card>
        <v-card-title class="headline primary-gradient white--text py-2">
            <span>{{ $t("account_offset_list") }}</span>
            <v-spacer></v-spacer>
            <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
        </v-card-title>
        <v-container fluid class="pt-0">
            <v-row no-gutters align="center" justify="space-between">
                <v-col cols="12">
                    <!-- Search Panel -->
                    <v-row dense align="center" justify="space-between">
                        <v-col cols="2">
                            <BaseDatePicker default :label="$t('month')" v-model="month" month acntoutline />
                        </v-col>
                        <v-col cols="2">
                            <BaseSelect :label="$t('account_type')" v-model="selectedAccountType" :lstData="accountTypeList" item-text="TEXT" item-value="PK" acntoutline />
                        </v-col>
                        <v-spacer />
                        <div class="d-flex">
                            <BaseButton icon_type="select" :btn_text="$t('select')" :disabled="isProcessing" @onclick="onSelectMultiple" />
                        </div>
                    </v-row>
                    <v-row align="center" justify="space-between">
                        <v-col cols="6">
                            <v-card outlined tile>
                                <v-row dense>
                                    <v-col cols="3">
                                        <BaseInput :label="$t('account_code')" v-model="txtAccountCode" @keyPressEnter="onSearch" />
                                    </v-col>
                                    <v-col cols="3">
                                        <BaseInput :label="$t('vas_account_name')" v-model="txtAccountName" @keyPressEnter="onSearch" acntoutline />
                                    </v-col>
                                    <v-col cols="3">
                                        <BaseInput :label="$t('vas_account_upper_name')" v-model="txtAccountUpperName" @keyPressEnter="onSearch" acntoutline />
                                    </v-col>
                                    <v-spacer />
                                    <div class="d-flex">
                                        <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="onSearch" />
                                    </div>
                                </v-row>
                            </v-card>
                        </v-col>
                        <v-col cols="6">
                            <v-card outlined tile>
                                <v-row dense>
                                    <v-col cols="3">
                                        <BaseInput :label="$t('account_code')" v-model="txtAccountCode1" @keyPressEnter="onSearch1" />
                                    </v-col>
                                    <v-col cols="3">
                                        <BaseInput :label="$t('vas_account_name')" v-model="txtAccountName1" @keyPressEnter="onSearch1" acntoutline />
                                    </v-col>
                                    <v-col cols="3">
                                        <BaseInput :label="$t('vas_account_upper_name')" v-model="txtAccountUpperName1" @keyPressEnter="onSearch1" acntoutline />
                                    </v-col>
                                    <v-spacer />
                                    <div class="d-flex">
                                        <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="onSearch1" />
                                    </div>
                                </v-row>
                            </v-card>
                        </v-col>
                    </v-row>

                    <!-- Table -->
                    <v-row align="center" justify="center">
                        <v-col cols="6" class="py-0">
                            <v-card outlined tile v-resize="onResize">
                                <DxDataGrid ref="grid_acc" column-resizing-mode="widget" key-expr="PK" :allow-column-resizing="true" :column-auto-width="$vuetify.breakpoint.smAndDown" :data-source="dataList" :height="limitHeight" :show-borders="true" :show-column-lines="true" :show-row-lines="true" @selection-changed="onSelectionChanged" :onRowDblClick="onSelectSingle">
                                    <DxColumn v-for="(item, index) in defaultHeaders" :data-field="item.field" :caption="item.caption" :width="item.width" :key="index"></DxColumn>
                                    <DxPaging v-if="dataList.length < 500" :page-size="dataList.length" />
                                    <DxScrolling v-else mode="infinite" />
                                    <DxSelection mode="multiple" v-if="multiSelectMode" />
                                    <DxSelection mode="single" v-if="!multiSelectMode" />
                                </DxDataGrid>
                            </v-card>
                        </v-col>
                        <v-col cols="6" class="py-0">
                            <v-card outlined tile v-resize="onResize">
                                <DxDataGrid ref="grid_acc1" column-resizing-mode="widget" key-expr="PK" :allow-column-resizing="true" :column-auto-width="$vuetify.breakpoint.smAndDown" :data-source="dataList1" :height="limitHeight" :show-borders="true" :show-column-lines="true" :show-row-lines="true" @selection-changed="onSelection1Changed" :onRowDblClick="onSelect1Single">
                                    <DxColumn v-for="(item, index) in defaultHeaders" :data-field="item.field" :caption="item.caption" :width="item.width" :key="index"></DxColumn>
                                    <DxPaging v-if="dataList1.length < 500" :page-size="dataList1.length" />
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
    name: "accountoffset-dialog",
    props: {
        headers: {
            type: Array,
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
        acc_type: {
            type: String,
            default: "",
        },
        drcr_type: {
            type: String,
            default: "",
        },
    },
    data: () => ({
        dialogIsShow: false,
        dataList: [],
        dataList1: [],
        selectedDatas: [],
        selectedDatas1: [],
        month: "",
        menu: false,
        modal: false,
        txtAccountCode: "",
        txtAccountName: "",
        txtAccountUpperName: "",
        selectedAccountType: "Y",
        txtAccountCode1: "",
        txtAccountName1: "",
        txtAccountUpperName1: "",
    }),
    watch: {
        dialogIsShow(val) {
            if (val === true) {
                this.dataList = [];
                this.dataList1 = [];
                this.selectedDatas = [];
                this.menu = false;
                this.modal = false;
                this.txtAccountCode = "";
                this.txtAccountName = "";
                this.txtAccountUpperName = "";

                this.txtAccountCode1 = "";
                this.txtAccountName1 = "";
                this.txtAccountUpperName1 = "";

                this.selectedAccountType = "Y";
                if (this.acc_type != "") {
                    this.selectedAccountType = this.acc_type;
                }
            }
        }
    },
    computed: {
        defaultHeaders() {
            if (this.headers) return this.headers;

            return [{
                    field: "AC_CD",
                    caption: this.$t("account_cd", "acnt"),
                    width: "100",
                },
                {
                    field: "AC_NM",
                    caption: this.$t("account_name", "acnt"),
                    width: "400",
                },
                {
                    field: "UAC_NM",
                    caption: this.$t("account_upper_name", "acnt"),
                    width: "400",
                },
            ];
        },
        accountTypeList() {
            return [{
                    PK: "Y",
                    TEXT: this.$t("posting"),
                },
                {
                    PK: "N",
                    TEXT: this.$t("summary"),
                },
                {
                    PK: "%",
                    TEXT: this.$t("select_all", "common"),
                },
            ];
        },
        user() {
            return this.$store.getters["auth/user"];
        },
        limitHeight() {
            return this.windowHeight - 320;
        },
    },
    methods: {
        async onSearch() {
             var _para = [this.txtAccountCode, this.month.replace("-", ""), this.txtAccountName, this.txtAccountUpperName, this.selectedAccountType];
            if (this.group_code != 0) {
                _para = [this.txtAccountCode, this.month.replace("-", ""), this.txtAccountName, this.txtAccountUpperName, this.selectedAccountType, this.group_code];
            }
            if (this.group_code != 0 && this.drcr_type != "") {
                _para = [this.txtAccountCode, this.month.replace("-", ""), this.txtAccountName, this.txtAccountUpperName, this.selectedAccountType, this.group_code, this.drcr_type];
            } 
            const dso = {
                type: "grid",
                selpro: this.sel_pro,
                para: _para,
            };
            this.dataList = await this._dsoCall(dso, "select", false);
            this.$refs.grid_acc.instance.clearSelection();
        },
        async onSearch1() {
            var _para = [this.txtAccountCode1, this.month.replace("-", ""), this.txtAccountName1, this.txtAccountUpperName1, this.selectedAccountType];
            if (this.group_code != 0) {
                _para = [this.txtAccountCode1, this.month.replace("-", ""), this.txtAccountName1, this.txtAccountUpperName1, this.selectedAccountType, this.group_code];
            }
            if (this.group_code != 0 && this.drcr_type != "") {
                _para = [this.txtAccountCode1, this.month.replace("-", ""), this.txtAccountName1, this.txtAccountUpperName1, this.selectedAccountType, this.group_code, this.drcr_type];
            }

            const dso = {
                type: "grid",
                selpro: this.sel_pro,
                para: _para,
            };
            this.dataList1 = await this._dsoCall(dso, "select", false);
            this.$refs.grid_acc1.instance.clearSelection();
        },

        onSelectionChanged({
            selectedRowsData
        }) {
            this.selectedDatas = selectedRowsData;
        },
        onSelection1Changed({
            selectedRowsData
        }) {
            this.selectedDatas1 = selectedRowsData;
        },

        onSelectSingle({
            data
        }) {
            //this.returnAccountInfo(data);
            // this.onSelectMultiple();
        },
        onSelect1Single({
            data
        }) {
            //this.returnAccountInfo(data);
            // this.onSelectMultiple();
        },

        onSelectMultiple() {
            let arr = [];
            arr.push(this.selectedDatas);
            arr.push(this.selectedDatas1);
            let rtn_data = arr;
            this.returnAccountInfo(rtn_data);
        },

        returnAccountInfo(datas) {
            this.$emit("returnAccountInfo", datas);
            this.dialogIsShow = false;
        },
    },
};
</script>
