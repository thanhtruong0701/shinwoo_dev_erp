<template>
<v-dialog id="employee-dialog" max-width="1000" v-model="dialogIsShow">
    <v-card>
        <v-card-title class="headline primary-gradient white--text py-2">
            <span>{{ $t("item_list", "acnt") }}</span>
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
                                        <v-col cols="4">
                                            <v-select dense cache-items hide-details outlined item-value="PK" item-text="GRP_NM" :label="$t('group_type')" :items="groupTypeList" v-model="selectedGroupType"></v-select>
                                        </v-col>
                                        <v-col cols="3">
                                            <v-text-field autofocus clearable dense hide-details outlined :label="$t('item_code')" @keypress.enter="onSearch" v-model="txtItemCode"></v-text-field>
                                        </v-col>
                                        <v-col cols="3">
                                            <v-text-field clearable dense hide-details outlined :label="$t('item_name')" @keypress.enter="onSearch" v-model="txtItemName"></v-text-field>
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
                                <DataGridView column-resizing-mode="widget" ref="grdItemGroup" sel_procedure="AC_SEL_GET_GRP_ITEM_POPUP" upd_procedure="" :select_mode="multiSelectMode ? (hideSelect ?'MultipleHideBox' : 'Multiple' )  : 'Single'" :auto_load="false" :max_height="limitHeight" @onSelectionChanged="onSelectionChanged" @cellDblClick="onSelectDbClick" :filter_paras="[this.selectedGroupType,this.txtItemCode, this.txtItemName]" :update_paras="[]" :header="[
                                  {
                                      dataField: 'ITEM_CODE',
                                      caption: this.$t('item_code'),
                                       allowEditing: false,
                                  },
                                  {
                                      dataField: 'ITEM_NAME',
                                      caption: this.$t('item_name'),
                                       allowEditing: false,
                                  },
                                  {
                                      dataField: 'GRP_NM',
                                      caption: this.$t('group_name'),
                                       allowEditing: false,
                                  },
                                  {
                                      dataField: 'UOM',
                                      caption: this.$t('uom'),
                                       allowEditing: false,
                                  },
                                  {
                                      dataField: 'UNIT_PRICE',
                                      caption: this.$t('unit_price'),
                                       allowEditing: false,
                                  },
                                  {
                                      dataField: 'DESCRIPTION',
                                      caption: this.$t('description'),
                                       allowEditing: false,
                                  } 
                                ]" />
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
    name: "item-acc-group-dialog",

    props: {
        headers: {
            type: Array,
        },
        multiSelectMode: {
            type: Boolean,
            default: false,
        },
        hideSelect: {
            type: Boolean,
            default: true
        },
    },

    data: () => ({
        dialogIsShow: false,
        selectedDatas: [],
        txtItemCode: "",
        txtItemName: "",
        selectedGroupType: "",
        groupTypeList: [],

    }),
    watch: {
        dialogIsShow(val) {
            if (val === true) {

                this.dataList = [];
                this.selectedDatas = [];

                this.txtItemCode = "";
                this.txtItemName = "";
                this.selectedGroupType = "";
            } else {
                this.$refs.grdItemGroup.Clear();
            }
            this.getGroupList();
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

    methods: {
        async onSearch() {
            await this.$refs.grdItemGroup.loadData();
        },
        async getGroupList() {
            const dso = {
                type: "list",
                selpro: "AC_SEL_ITEM_GROUP",
                para: [this.user.TCO_COMPANY_PK]
            };
            const result = await this._dsoCall(dso, "select", false);
            if (result) {
                this.groupTypeList = result;
                this.groupTypeList.push({
                    PK: "%",
                    GRP_NM: this.$t("select all")
                });
                this.selectedGroupType = "%";
            } else {
                this.groupTypeList = [];
            }
        },
        onSelectionChanged({
            selectedRowsData
        }) {
            this.selectedDatas = selectedRowsData;
        },
        onSelectMultiple() {
            this.returnGrpItemInfo(this.selectedDatas);
        },
        onSelectDbClick(_event) {
            let rtn_data = this.multiSelectMode ?
                this.selectedDatas :
                this.selectedDatas[0];
            this.returnGrpItemInfo(rtn_data);
        },
        returnGrpItemInfo(datas) {
            //this.$emit("returnGrpItemInfo", this.multiSelectMode ? this.$refs.grdItemGroup.selectedDatas : this.$refs.grdItemGroup.selectedDatas[0]);
            this.$emit("returnGrpItemInfo", datas);
            this.dialogIsShow = false;
        },
    },
};
</script>
