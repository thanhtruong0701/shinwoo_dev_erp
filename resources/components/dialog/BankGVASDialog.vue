<template>
<v-dialog id="bank-dialog" max-width="600" v-model="dialogIsShow">
    <v-card>
        <v-card-title class="headline primary-gradient white--text py-2">
            <span>{{ $t("bank_list", "common") }}</span>
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
                                        </v-col>
                                        <v-col cols="4">
                                            <v-text-field clearable dense hide-details outlined :label="$t('bank_code')" @keypress.enter="onSearch" v-model="txtBankId"></v-text-field>
                                        </v-col>
                                        <v-col>

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
                                <BaseGridView ref="grid_bank" 
                                :header="[
                                    { dataField: 'BANK_ID', caption: this.$t('BANK_ID'), width: '100', allowEditing: true },
                                    { dataField: 'BANK_NAME', caption: this.$t('BANK_NAME'), width: '400', allowEditing: true },
                                    { dataField: 'BANK_FNAME', caption: this.$t('BANK_FNAME'), width: '200',allowEditing: true },
                                    ]" 
                                    sel_procedure="sys_sel_bank_gvas_dialog" 
                                    :auto_load="false"
                                    :filter_paras="[
                                        txtBankId
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
    name: "bank-dialog",
    props: {
        headers: {
            type: Array
        },
        multiSelectMode: {
            type: Boolean,
            default: false
        },
        company: {
            type: [String, Number],
        },
    },

    data: () => ({
        dialogIsShow: false,
        dataList: [],
        selectedDatas: [],


        txtBankId: "",
        txtBankName: ""
    }),

    created() {

    },
    mounted() {},

    computed: {
        defaultHeaders() { 
            if (this.headers) return this.headers;
            return [{
                    field: "BANK_ID",
                    caption: this.$t("bank_code", "common"),
                    width: "150"
                },
                {
                    field: "BANK_NAME",
                    caption: this.$t("bank_name", "common"),
                    width: "300"
                },
                {
                    field: "BANK_FNAME",
                    caption: this.$t("bank_fname", "acnt"),
                    width: "100"
                } 
            ];
        },
        user() {
            return this.$store.getters["auth/user"];
        },
        limitHeight() {
            return this.windowHeight - 400;
        }
    },

    watch: {
        selectedCompany(val) {
            if (val) {
                this.onSearch();
            }
        },
        dialogIsShow(val) {
            if (val === true) {
                this.dataList = [];
                this.selectedDatas = [];
                this.txtBankId = "";
            }
        }
    },

    methods: {
       
        async onSearch() {
            this.$refs.grid_bank.loadData();
        },

       

        onSelectSingle({ data }) {
            this.returnBankInfo(data);
        },

        onSelectMultiple() {


            let rtn_data =  this.$refs.grid_bank.getSelectedRows();
            this.returnBankInfo(rtn_data);
        },

        
        returnBankInfo(datas) {
            this.$emit("returnBankInfo", datas);
            this.dialogIsShow = false;
        }
    }
};
</script>
