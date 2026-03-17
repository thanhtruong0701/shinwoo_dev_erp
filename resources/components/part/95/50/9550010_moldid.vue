<template>
<v-dialog id="partnerloc-dialog" max-width="1000" v-model="dialogIsShow">
    <v-card>
        <v-card-title class="headline primary-gradient white--text py-2">
            <span>{{ $t("mold_id_list") }}</span>
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
                                            <v-select dense cache-items hide-details outlined item-value="PK" item-text="GRP_NM" :label="$t('mold_group', 'common')" :items="itemMoldGroup" v-model="lstMoldGroup"></v-select>
                                        </v-col>

                                        <v-col>
                                            <v-text-field clearable dense hide-details outlined :label="$t('mold')" @keypress.enter="onSearch" v-model="txtMold"></v-text-field>
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
                                <DxDataGrid column-resizing-mode="widget" key-expr="PK" :allow-column-resizing="true" :columnAutoWidth="$vuetify.breakpoint.smAndDown" :data-source="dataList" :height="limitHeight" :row-alternation-enabled="true" :show-borders="true" :show-column-lines="true" :show-row-lines="true" @selection-changed="onSelectionChanged" :onRowDblClick="onSelectSingle">
                                    <DxColumn data-field="SEQ" :caption="$t('seq')"></DxColumn>
                                    <DxColumn data-field="MOLD_CODE" :caption="$t('mold_code')"></DxColumn>
                                    <DxColumn data-field="MOLD_NAME" :caption="$t('mold_name')"></DxColumn>
                                    <DxColumn data-field="REMARK" :caption="$t('remark')"></DxColumn>

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
import {
    VAlert
} from 'vuetify/lib';
export default {
    name: "moldid-dialog",
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
        txtMold: "",
        itemMoldGroup: [],
        lstMoldGroup: ""
    }),

    created() {
        // this.selectedCompany = this.user.TCO_COMPANY_PK
        // this.getCompanyList()    
        this.lstMoldGroup = "370"
    },

    mounted() {
        // this.getMoldGroup()
    },

    computed: {
        user() {
            return this.$store.getters["auth/user"]
        },
        limitHeight() {
            return this.windowHeight - 320
        }
    },

    watch: {
        dialogIsShow(val) {
            if (val === true) {
                this.getMoldGroup()
            }
        },
        // selectedCompany(val) {
        //   if (val) {
        //     this.onSearch()
        //   }
        // },  
    },

    methods: {
        async getMoldGroup() {
            const dso = {
                type: 'list',
                selpro: 'LG_SEL_9550010_MOLD_GROUP'
            }
            const result = await this._dsoCall(dso, 'select', false)
            if (result) {
                this.itemMoldGroup = result
            } else {
                this.itemMoldGroup = []
            }
        },

        // async getCompanyList() {
        //   const dso = {
        //     type: "list",
        //     selpro: "SYS_SEL_LIST_COMPANY",
        //     para: [this.user.PK]
        //   };
        //   const result = await this._dsoCall(dso, "select", false);
        //   if (result) {
        //     this.companyList = result
        //   } else {
        //     this.companyList = []
        //   }
        // },

        async onSearch() {
            const dso = {
                type: "grid",
                selpro: "LG_SEL_9550010_MOLDID",
                para: [
                    this.lstMoldGroup ? this.lstMoldGroup : '',
                    this.txtMold ? this.txtMold : ''
                ]
            }
            this.dataList = await this._dsoCall(dso, "select", false)
        },

        onSelectionChanged({
            selectedRowsData
        }) {
            this.selectedDatas = selectedRowsData
        },

        onSelectSingle({
            data
        }) {
            this.returnMoldIDInfo(data)
        },

        onSelectMultiple() {
            let rtn_data = this.multiSelectMode ?
                this.selectedDatas :
                this.selectedDatas[0]
            this.returnMoldIDInfo(rtn_data)
        },

        returnMoldIDInfo(datas) {
            this.$emit("returnMoldIDInfo", datas)
            this.dialogIsShow = false
        }
    }
};
</script>
