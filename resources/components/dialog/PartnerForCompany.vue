<template>
<v-dialog id="partner-for-company-dialog" max-width="1000" v-model="dialogIsShow">
    <v-card>
        <v-card-title class="headline primary-gradient white--text py-2">
            <span>{{ $t("partner_for_company") }}</span>
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
                                        <v-col cols="3">
                                            <BaseInput :label="$t('company_nm')" v-model="txtCompanyName" @keypress.enter="onSearch"></BaseInput>                                        
                                        </v-col>
                                        <v-col cols="3">
                                            <BaseInput :label="$t('taxcode')" v-model="txtTaxCode" @keypress.enter="onSearch"></BaseInput>    
                                        </v-col>
                                        <v-col cols="3">
                                            <BaseInput :label="$t('partner_nm')" v-model="txtPartnerName" @keypress.enter="onSearch"></BaseInput>   
                                        </v-col>
                                        <v-col cols="2" class="text-right">
                                            <div class="d-flex justify-end">
                                                <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="false" @onclick="onSearch()" />
                                                <BaseButton icon_type="select" :btn_text="$t('select')" :disabled="false" @onclick="onSelectMultiple"  />
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
                                <BaseGridView ref="gridCompany" 
                                :header="[
                                    { dataField: 'COMPANY_CD', caption: this.$t('COMPANY_CD'), width: '100', allowEditing: true },
                                    { dataField: 'COMPANY_NM', caption: this.$t('COMPANY_NM'), width: '400', allowEditing: true },
                                    { dataField: 'CUSTOMER_CD', caption: this.$t('CUSTOMER_CD'), width: '200',allowEditing: true },
                                    { dataField: 'CUSTOMER_NM', caption: this.$t('CUSTOMER_NM'), width: '400', allowEditing: true },
                                    // { dataField: 'KIND_CD', caption: this.$t('KIND_CD'), allowEditing: true },
                                    // { dataField: 'KIND_NM', caption: this.$t('KIND_NM'), allowEditing: true }, 
                                    ]" 
                                    sel_procedure="ac_sel_partner_company" 
                                    :auto_load="false"
                                    :filter_paras="[this.txtCompanyName,
                                                    this.txtTaxCode,
                                                    this.txtPartnerName,
                                                    this.txtTacBizKindPK
                                    ]"
                                    :max_height="limitHeight" 
                                    :selectionmode="'checkbox'"
                                    />
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
    name: "partner-for-company-dialog",
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
        tac_biz_kind_pk: {
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

        lstPartnerType: [],
        bizPlaceList: [],
        lstBizPlace: "",
        storeProc: "",
        txtCompanyName:"",
        txtTaxCode:"",
        txtPartnerName:"",
        txtTacBizKindPK : 0

    }),

    created() {
        
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
        dialogIsShow(val) {
            if (val === true) {
                this.txtTacBizKindPK = this.companyPK
                //console.log(this.companyPK);
                //console.log(this.bizPlace)
                //this.getCompanyList();
                //this.selectedCompany = (this.companyPK == 0) ? this.user.TCO_COMPANY_PK : this.companyPK;
                
                //this.selectedPartnerType = this.selPartnerType;
                //console.log(this.selectedCompany)
                //this.getPartnerTypeList();
            }
        },
    },

    methods: {
      
        async onSearch() {
            this.$refs.gridCompany.loadData();
        },

      

        onSelectSingle({data}) {
            this.callBackData(data);
        },

        onSelectMultiple() {
            let rtn_data = this.multiSelectMode ?  this.$refs.gridCompany.getSelectedRows() :  this.selectedDatas[0];
            this.callBackData(rtn_data);
        },

        callBackData(datas) {
            this.$emit("callBackData", datas);
            this.dialogIsShow = false;
        },
       
        
    }
};
</script>
