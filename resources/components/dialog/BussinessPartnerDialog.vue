<template>
<v-dialog id="bussiness-partner" max-width="1000" v-model="dialogIsShow">
    <v-card>
        <v-card-title class="headline primary-gradient white--text py-2">
            <span>{{ $t("partner_list", "common") }}</span>
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
                                <v-container fluid>
                                    <v-row dense align="center" justify="space-between">
                                        <v-col cols="2">
                                            <v-select dense cache-items hide-details outlined item-value="PK" item-text="TEXT" :label="$t('company', 'common')" :items="companyList" v-model="selectedCompany"></v-select>
                                        </v-col>
                                        <v-col cols="2">
                                            <v-select clearable dense cache-items hide-details outlined item-value="CODE" item-text="NAME" :label="$t('partner_type', 'common')" :items="lstPartnerType" v-model="selectedPartnerType"></v-select>
                                        </v-col>
                                        <v-col cols="2">
                                            <v-text-field clearable dense hide-details outlined :label="$t('partner_id', 'common')" @keypress.enter="onSearch" v-model="txtPartnerId"></v-text-field>
                                        </v-col>
                                        <v-col cols="2">
                                            <v-text-field clearable dense hide-details outlined :label="$t('partner_name', 'common')" @keypress.enter="onSearch" v-model="txtPartnerName"></v-text-field>
                                        </v-col>
                                        <v-col cols="2">
                                            <v-text-field clearable dense hide-details outlined :label="$t('tax_code', 'common')" @keypress.enter="onSearch" v-model="txtTaxcode"></v-text-field>
                                        </v-col>
                                        <v-col cols="2" class="text-right">
                                            <v-btn icon tile :color="currentTheme" :disabled="isProcessing" @click="onSearch">
                                                <v-icon>mdi-magnify</v-icon>
                                            </v-btn>
                                            <v-btn icon tile color="success" @click="onSelectMultiple" v-if="multiSelectMode">
                                                <v-icon>mdi-check-bold</v-icon>
                                            </v-btn>
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
                                <DxDataGrid column-resizing-mode="widget" key-expr="PK" ref="grid_buspartner" :allow-column-resizing="true" :columnAutoWidth="$vuetify.breakpoint.smAndDown" :data-source="dataList" :height="limitHeight" :row-alternation-enabled="true" :show-borders="true" :show-column-lines="true" :show-row-lines="true" @selection-changed="onSelectionChanged" :onRowDblClick="onSelectSingle">
                                    <DxColumn data-field="PK" :width="0" :caption="$t('pk', 'common')"></DxColumn>
                                    <DxColumn data-field="PARTNER_ID" :width="150" :caption="$t('partner_id', 'common')"></DxColumn>
                                    <DxColumn data-field="PARTNER_NAME" :caption="$t('partner_name', 'common')"></DxColumn>
                                    <DxColumn data-field="PARTNER_LNAME" :width="0" :caption="$t('partner_lname', 'common')"></DxColumn>
                                    <DxColumn data-field="PARTNER_FNAME" :width="0" :caption="$t('partner_fname', 'common')"></DxColumn>
                                    <DxColumn data-field="TAX_CODE" :width="150" :caption="$t('tax_code', 'common')"></DxColumn>
                                    <DxColumn data-field="PHONE_NO" :width="0" :caption="$t('phone_no', 'common')"></DxColumn>
                                    <DxColumn data-field="ADDR1" :caption="$t('address1', 'common')"></DxColumn>
                                    <DxColumn data-field="ADDR2" :width="0" :caption="$t('address2', 'common')"></DxColumn>
                                    <DxColumn data-field="ADDR3" :width="0" :caption="$t('address3', 'common')"></DxColumn>
                                    <DxColumn data-field="TEI_CUSTOMER_PK" :width="0" :caption="$t('tei_customer_pk', 'common')"></DxColumn>
                                    <DxPaging :page-size="dataList.length" />
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
    name: "bussiness-partner",
    // props: ["empSelectProbs", "multiSelectMode"],
    props: {
        multiSelectMode: {
            type: Boolean,
            default: false
        }
    },

    data: () => ({
        dialogIsShow: false,
        dataList: [],
        selectedDatas: [],

        companyList: [],
        selectedCompany: "",

        lstPartnerType: [],
        selectedPartnerType: "",

        txtPartnerId: "",
        txtPartnerName: "",
        txtTaxcode: ""
    }),

    created() {
        this.selectedCompany = this.user.TCO_COMPANY_PK;
        this.getCompanyList();
        this.getPartnerTypeList();
    },

    mounted() {},

    computed: {
        user() {
            return this.$store.getters["auth/user"];
        },
        limitHeight() {
            return this.windowHeight - 320;
        }
    },

    watch: {
        selectedCompany(val) {
            if (val) {
                this.onSearch();
            }
        },
        selectedPartnerType(val) {
            if (val) this.onSearch();
        },
        dialogIsShow(val) {
            if (val === true) {

                this.dataList = [];
                this.selectedDatas = [];

                this.txtPartnerId = "";
                this.txtPartnerName = "";
                this.txtTaxcode = "";
            }
        }
    },

    methods: {
        async getCompanyList() {
            const dso = {
                type: "list",
                selpro: "SYS_SEL_LIST_COMPANY",
                para: [this.user.PK]
            };
            const result = await this._dsoCall(dso, "select", false);
            if (result) {
                this.companyList = result;
            } else {
                this.companyList = [];
            }
        },

        async getPartnerTypeList() {
            this.lstPartnerType = await this._getCommonCode("CODC0010");
        },

        async onSearch() {
            const dso = {
                type: "grid",
                selpro: "SEL_BUSSINESSPARTNER_DIALOG",
                para: [
                    this.selectedCompany,
                    !this.selectedPartnerType ? "ALL" : this.selectedPartnerType,
                    this.txtPartnerId ? this.txtPartnerId : "",
                    this.txtPartnerName ? this.txtPartnerName : "",
                    this.txtTaxcode ? this.txtTaxcode : ""
                ]
            };
            this.dataList = await this._dsoCall(dso, "select", false);
            //this.$refs.grid_buspartner.instance.clearSelection() ;
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
        }
    }
};
</script>
