<template>
<v-dialog id="partner-list-dialog" max-width="1000" v-model="dialogIsShow">
    <v-card>
        <v-card-title class="headline primary-gradient white--text py-2">
            <span>{{ $t("biz_kind_list") }}</span>
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
                                   
                                        <v-col lg="2" sm="2" cols="2" class="pb-2">
                                            <v-text-field clearable dense hide-details :label="$t('kind_code', 'common')" @keypress.enter="onSearch" v-model="txtPartnerId"></v-text-field>
                                        </v-col>
                                        <v-col lg="2" sm="2" cols="2">
                                            <v-text-field clearable dense hide-details :label="$t('kind_name', 'common')" @keypress.enter="onSearch" v-model="txtPartnerName"></v-text-field>
                                        </v-col>
                                        <v-col lg="2" sm="2" cols="2">
                                        </v-col>
                                        <v-col lg="2" sm="2" cols="2" class="text-right">
                                            <div class="d-flex justify-end">
                                                <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="false" @onclick="onSearch()" />
                                                <BaseButton icon_type="select" :btn_text="$t('select')" :disabled="false" @onclick="onSelectMultiple()" />
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

                                <DataGridView ref="grid_partner"
                                            :header="[
                                            { dataField: 'KIND_CD', caption: this.$t('acc_code'), allowEditing: true },
                                            { dataField: 'KIND_NM', caption: this.$t('acc_name'), allowEditing: true, width: 150 },
                                            { dataField: 'KIND_LNM', caption: this.$t('local_acnm'), allowEditing: true,width: 150 },
                                            { dataField: 'KIND_KNM', caption: this.$t('kor_acnm'), allowEditing: true, width: 150 },
                                            { dataField: 'TRANS_TYPE_AP_CODE', caption: this.$t('trans_type_ap_code'), allowEditing: true },
                                            { dataField: 'TRANS_TYPE_AR_CODE', caption: this.$t('trans_type_ar_code'), allowEditing: true },
                                            { dataField: 'M_CODE', caption: this.$t('m_code'), allowEditing: true },
                                            { dataField: 'M_NAME', caption: this.$t('m_name'), allowEditing: true },
                                            { dataField: 'LEAF_YN', caption: this.$t('postsum_actype'), allowEditing: true },
                                            { dataField: 'KIND_LEVEL', caption: this.$t('level'), allowEditing: true },
                                            ]"
                                            sel_procedure="SYS_SEL_KINDCODE_LIST_DIALOG"
                                            :select_mode="multiple_yn"
                                            :auto_load="true" 
                                            :filter_paras="[    tac_biz_kind_pk,
                                                                txtPartnerId,
                                                                txtPartnerName,
                                                            ]"
                                            @cellDblClick="onCellDblClick"                
                                            @onSelectionChanged="onSelectionChanged"
                                            @onRowPrepared="onFillBackgroundAccCodeInq" />
                                
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
    name: "partner-list-dialog",
    // props: ["empSelectProbs", "multiSelectMode"],
    props: {
        multiSelectMode: {
            type: Boolean,
            default: true,
        },
        tac_biz_kind_pk: {
            type: Number,
            default: 0
        },
        multiple_yn:{
            type: String,
            default: "Single"
        }

    },

    data: () => ({
        dialogIsShow: false,
        dataList: [],
        selectedDatas: [],

        lstPartnerType: [],
        selectedPartnerType: "",

        txtPartnerId: "",
        txtPartnerName: "",
        txtTaxcode: ""
      
    }),

    created() {
        this.onSearch();
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
                this.onSearch();
            }
        },
    },

    methods: {
        async onSearch() {
            //console.log(this.tac_biz_kind_pk + "   multiple_yn  "   + this.multiple_yn);
            if(this.tac_biz_kind_pk != 0)
            {
                setTimeout(() => {
                    this.$refs.grid_partner.loadData();
                }, 100);
            }
           
        },

        onSelectionChanged({selectedRowsData}) 
        {
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
        onFillBackgroundAccCodeInq(e) {
            if (e.rowType == "data") {
                if (e.data.AC_LEVEL === "1") {
                    e.rowElement.style.backgroundColor = "#E9967A";
                } else if (e.data.LEAF_YN === "N") {
                    e.rowElement.style.backgroundColor = "#00FF87";
                }
            }
        },
        onCellDblClick(data) {
            //console.log(data);
            let rtn_data = this.multiSelectMode ?
                    this.selectedDatas :
                    this.selectedDatas[0];
                this.callBackData(rtn_data);
    },
    },
};
</script>
