<template>
    <v-dialog id="purpose-dialog" max-width="1000" :height="limitHeight" v-model="dialogIsShow" v-resize="onResize">
        <v-card>
            <v-card-title class="headline primary-gradient white--text py-2">
                <span>{{ $t("purpose") }}</span>
                <v-spacer></v-spacer>
                <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
            </v-card-title>
            <v-container fluid class="pt-0">
                <v-row  >
                    <div class="d-flex">
                        <BaseButton icon_type="add" :btn_text="$t('addnew')" @onclick="onNewRow" :disabled="isProcessing" />
                        <BaseButton icon_type="select" :btn_text="$t('select')" :disabled="false" @onclick="onSelectMultiple" />
                    </div>
                </v-row>
                <v-row no-gutters>
                    <v-col cols="12">
                        <!-- Table -->
                        <v-row align="center" justify="center">
                            <v-col cols="12" class="py-0">
                                <v-card outlined tile v-resize="onResize">
                                    <DataGridView ref="idGridPurpose"  :height="limitHeight-20"
                                        :header="headerQQ" :selectionmode="'checkbox'" :auto_load="true" sel_procedure='SSSS'
                                        :filter_paras="[]"
                                        >
                                    </DataGridView>

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
    name: "purpose-dialog",

    props: {
        multiSelectMode: {
            type: Boolean,
            default: false
        },
        paramsData: {
                type: Array,
                default: []
            },
        selCompany:{
            type:Number,
            default:0
            }
    },

    data: () => ({
        dialogIsShow: false,
        dataList: [],
        selectedDatas: [],
        companyList: [],
        selectedCompany: "",
        txtLocName: "",
        partnerPK: "",
        lstKindCode: [],
        lstType: [],
        lstCategory: []
    }),

    created() {
        setTimeout(() => {
            this.getCompanyList();
        }, 2000);
        // this.getListCodes();//.then(() => {  this.itemInfoHeader_N();  });

    },

    mounted() {

    },

    computed: {
        user() {
            return this.$store.getters["auth/user"]
        },
        limitHeight() {
            return this.windowHeight - 750
        },
        headerQQ() {
            const header = [
                {
                    caption: this.$t("kind_code"), dataField: "KIND_CODE",   width: 150,
                    lookup: {
                        displayExpr: "NAME",
                        valueExpr: "NAME",
                        dataSource: this.lstKindCode
                    },
                    cssClass: "cell-align-center"
                },
                { caption: this.$t("purpose"), dataField: "PURPOSE",   width: 250, },
                {
                    caption: this.$t("type"), dataField: "TYPE",   width: 150, align: 'center',
                    lookup: {
                        displayExpr: "NAME",
                        valueExpr: "NAME",
                        dataSource: this.lstType
                    },
                    cssClass: "cell-align-center"
                },
                {
                    caption: this.$t("category"), dataField: "CATEGORY",   width: 200,
                    lookup: {
                        displayExpr: "NAME",
                        valueExpr: "NAME",
                        dataSource: this.lstCategory
                    },
                    cssClass: "cell-align-center"
                },
                { caption: this.$t("description"), dataField: "DESCRIPTION",   width: 300 },
            ];
                return header;
        },
    },

    watch: {
        dialogIsShow(val) {
            if (val) {
                this.getCompanyList();
                this.clearData();
            }
        },
        selectedCompany(val) {
            if (val) {
                this.onSearch()
            }
        },
    },
    methods: {
        async getCompanyList() {
            const commoncode = await this._getCommonCode2(
                [
                    "ACJS0360",
                    "ACJS0370",
                    "ACJS0380"
                ],
                this.selCompany
            );
            this.lstKindCode = commoncode[0];
            this.lstType = commoncode[1];
            this.lstCategory = commoncode[2];
        },

        async clearData(){
            
            await this._clearCache("N");
            this.$refs.idGridPurpose.Clear();

        },
      
        onNewRow() {
            // console.log(this.paramsData);
            const _newRow = {
                KIND_CODE: this.paramsData[0].ACC_KIND,
                PURPOSE: '',
                DESCRIPTION: '',
                TYPE: this.paramsData[0].ACC_TYPE,
                CATEGORY: this.paramsData[0].ACC_CATEGORY
            
            };
            this.$refs.idGridPurpose.addRowStruct(_newRow);
        },
    
       
        onSelectionChanged({
            selectedRowsData
        }) {
            this.selectedDatas = selectedRowsData
        },

        onSelectSingle({
            data
        }) {
            this.returnPartnerLocInfo(data)
        },

        onSelectMultiple() {
            // let rtn_data = this.multiSelectMode ?
            //     this.selectedDatas :
            //     this.selectedDatas[0]
            let rtn_data = this.$refs.idGridPurpose.getDataSource()
            this.returnDataPurpose(rtn_data)
        },

        returnDataPurpose(datas) {
            this.$emit("returnDataPurpose", datas)
            this.dialogIsShow = false
        }
    }
};
</script>
