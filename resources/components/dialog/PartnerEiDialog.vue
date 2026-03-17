<template>
<v-dialog id="employee-dialog" max-width="1000" v-model="dialogIsShow">
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
                                        <v-col cols="4">
                                            <v-select dense clearable hide-details outlined item-value="PK" item-text="TEXT" :label="$t('company')" :items="companyList" v-model="selectedCompany" @change="OnChangeCompany" :disabled="true"></v-select>
                                        </v-col>
                                        <v-col lg="2" class="py-1">
                                            <v-select dense clearable outlined hide-details item-value="PK" item-text="TEXT" :label="$t('biz_place')" :items="bizPlaceList" v-model="lstBizPlace" :disabled="true"></v-select>
                                        </v-col>
                                        <v-col cols="2">
                                            <v-select clearable dense hide-details outlined item-value="CODE" item-text="NAME" :label="$t('partner_type')" :items="lstPartnerType" v-model="selectedPartnerType"></v-select>
                                        </v-col>
                                        <v-col cols="2">
                                            <v-text-field clearable dense hide-details outlined :label="$t('partner_id')" @keypress.enter="onSearch" v-model="txtPartnerId"></v-text-field>
                                        </v-col>
                                        <v-col cols="2">
                                            <v-text-field clearable dense hide-details outlined :label="$t('partner_name')" @keypress.enter="onSearch" v-model="txtPartnerName"></v-text-field>
                                        </v-col>
                                        <v-col cols="2">
                                            <v-text-field clearable dense hide-details outlined :label="$t('tax_code')" @keypress.enter="onSearch" v-model="txtTaxcode"></v-text-field>
                                        </v-col>
                                        <v-col cols="2" class="text-right">
                                            <div class="d-flex justify-end">
                                                <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="false" @onclick="onSearch()" />
                                            </div>
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
                                <DxDataGrid column-resizing-mode="widget" key-expr="PK" :allow-column-resizing="true" :columnAutoWidth="$vuetify.breakpoint.smAndDown" :data-source="dataList" :height="limitHeight" :row-alternation-enabled="true" :show-borders="true" :show-column-lines="true" :show-row-lines="true" @selection-changed="onSelectionChanged" :onRowDblClick="onSelectSingle">
                                    <DxColumn data-field="PK" :width="0" :caption="$t('pk')"></DxColumn>
                                    <DxColumn data-field="PARTNER_ID" :caption="$t('partner_id')"></DxColumn>
                                    <DxColumn data-field="PARTNER_NAME" :caption="$t('partner_name')" width="250"></DxColumn>
                                    <DxColumn data-field="PARTNER_LNAME" :caption="$t('partner_lname')"></DxColumn>
                                    <DxColumn data-field="PARTNER_FNAME" :caption="$t('partner_fname')"></DxColumn>
                                    <DxColumn data-field="TAX_CODE" :caption="$t('tax_code')"></DxColumn>
                                    <DxColumn data-field="PHONE_NO" :caption="$t('phone_no')"></DxColumn>
                                    <DxColumn data-field="ADDR1" :caption="$t('address')"></DxColumn>
                                    <!-- <DxPaging :page-size="dataList.length" /> -->
                                    <DxSelection mode="multiple" v-if="multiSelectMode" />
                                    <DxSelection mode="single" v-if="!multiSelectMode" />
                                    <DxFilterRow :visible="true" />
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
    name: "partner-dialog",
    // props: ["empSelectProbs", "multiSelectMode"],
    props: {
        multiSelectMode: {
            type: Boolean,
            default: false
        },
        EiType: {
            type: Boolean,
            default: false,
        },
        companyPK: {
            type: Number,
            default: 0
        },
        bizPlace: {
            type: Number,
            default: 0
        },
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
        txtTaxcode: "",
        bizPlaceList: [],
        lstBizPlace: "",
        storeProc: ""

    }),

    created() {
        this.selectedCompany = (this.companyPK == 0) ? this.user.TCO_COMPANY_PK : this.companyPK;
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
                // console.log(this.companyPK);
                // console.log(this.bizPlace)
                this.getCompanyList();
                this.selectedCompany = (this.companyPK == 0) ? this.user.TCO_COMPANY_PK : this.companyPK;
                
                this.selectedPartnerType = this.selPartnerType;
                //console.log(this.selectedCompany)
                this.getPartnerTypeList();
            }
        },
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

            const dso_bizplace_list = {
                type: "list",
                selpro: "SYS_SEL_BIZ_PLACE_V2",
                para: [this.selectedCompany, this.user.PK],
            };
            this.bizPlaceList = await this._dsoCall(
                dso_bizplace_list,
                "select",
                false
            );
            if (this.bizPlaceList.length > 0) {
                // console.log(this.bizPlace);
                if(this.bizPlace == "")
                {
                    this.lstBizPlace = this.bizPlaceList[0].PK;
                }else
                {
                    this.lstBizPlace = this.bizPlace;
                }
            }
        },

        async getPartnerTypeList() {
            this.lstPartnerType = await this._getCommonCode("CODC0010");
        },

        async onSearch() {
            this.storeProc = (this.EiType === true ? "SYS_SEL_BUSPARTNER_EI_DIALOG" : "SYS_SEL_BUSPART_USER_DIALOG_V2") //SYS_SEL_BUSPARTNER_EI_DIALOG  SYS_SEL_BUSPARTNER_BY_USER_DIALOG
            const dso = {
                type: "grid",
                selpro: this.storeProc,
                para: [
                    this.selectedCompany,
                    this.lstBizPlace,
                    !this.selectedPartnerType ? "ALL" : this.selectedPartnerType,
                    this.txtPartnerId ? this.txtPartnerId : "",
                    this.txtPartnerName ? this.txtPartnerName : "",
                    this.txtTaxcode ? this.txtTaxcode : ""
                ]
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
        OnChangeCompany() {
            this.onchangecompany();
        },
        async onchangecompany() {
            this.bizPlaceList = [];
            const dso_bizplace_list = {
                type: "list",
                selpro: "SYS_SEL_BIZ_PLACE_V2",
                para: [this.selectedCompany, this.user.PK],
            };
            this.bizPlaceList = await this._dsoCall(
                dso_bizplace_list,
                "select",
                false
            );
            if (this.bizPlaceList.length > 0) {
                //this.lstBizPlace =  (this.bizPlace == "") ? this.bizPlaceList[0].PK : this.bizPlace;
                // console.log(this.bizPlace);
                if(this.bizPlace == "")
                {
                    this.lstBizPlace = this.bizPlaceList[0].PK;
                }else
                {
                    this.lstBizPlace = this.bizPlace;
                }
            }
        },
    }
};
</script>
