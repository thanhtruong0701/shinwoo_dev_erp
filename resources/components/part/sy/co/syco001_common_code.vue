<template>
<v-container fluid class="pt-0">
    <v-row align="center" justify="space-between" no-gutters>
        <v-col cols="12">
            <v-card outlined tile v-resize="onResize">

                <DxDataGrid column-resizing-mode="widget" ref='grid' :height="limitHeight" :allow-column-resizing="true" :data-source="dataDetail" :show-borders="true" :show-row-lines="true" :column-auto-width="$vuetify.breakpoint.smAndDown" :onRowDblClick="onSelectSingleDblClick" :onCellClick="!dialogmode ? onSelectSingle : ''" :allow-editing="false" :loadPanel="{ enabled: true, text: $t('is_loading', 'common') }" @row-updating="onCellChanging" @row-updated="onCellChanged" @selection-changed="onSelectionChanged" key-expr="PK">
                    <!-- loop column for set header -->
                    <DxColumn v-for="(item, index) in defaultHeaders" :data-field="item.field" :caption="$t(item.title)" :data-type="item.type" :width="item.width ? item.width : 100" :cell-template="item.type=='boolean' ? 'yn-template' : ''" :allow-editing="item.type=='boolean' ? false : true" :key="index">
                        <DxLookup v-if="item.type=='list'" display-expr="TEXT" value-expr="PK" :data-source="item.field=='TCO_COMPANY_PK' ? companyList : []" />

                    </DxColumn>

                    <template #yn-template="{ data }">
                        <DxCheckBox :value="data.value === 'Y' ? true : false" @valueChanged="valueChanged($event, data.column.dataField, data.data)" />
                    </template>

                    <DxFilterRow v-if="gridfilter" :visible="true" />
                    <DxEditing v-if="editable" :allow-updating="true" start-edit-action="dblClick" mode="cell" />
                    <DxScrolling mode="infinite" />
                    <DxKeyboardNavigation :edit-on-key-press="true" />
                    <DxSelection v-if="multiselect" mode="multiple" />
                    <DxSelection v-if="!multiselect" mode="single" />
                </DxDataGrid>
            </v-card>
        </v-col>
    </v-row>

    <delete-confirm v-if="deleteDialog" @onCloseDialog="deleteDialog = false" @onConfirm="onDelete"></delete-confirm>

</v-container>
</template>

<script>
import DeleteConfirm from '@/components/dialog/DeleteConfirmDialog';
import CellGridCheckbox from '@/components/table/CellGridCheckbox'

export default {
    name: 'common-code',
    props: {

        multiselect: {
            type: Boolean,
            default: false
        },
        gridfilter: {
            type: Boolean,
            default: false
        },
        editable: {
            type: Boolean,
            default: false
        },
        autoload: {
            type: Boolean,
            default: false
        },
        autocorrect: {
            type: Boolean,
            default: false
        },
        dialogmode: {
            type: Boolean,
            default: false
        },
        gridtype: {
            type: String,
            default: "master"
        },
        detailcode: {
            type: String,
            default: ''
        },
        parentcode: {
            type: String,
            default: ''
        },
        companypk: {
            type: String,
            default: null
        },
        header: {
            type: Array
        },
        filterDatas: { //[{ col, val }] for dialog mode search by column VAL or NUM. ex: find district(HR0204, column VAL5  map with city HaNoi( HR0203 with code:101)  [ { col: 'VAL5', val:'101' } ]
            type: Array
        }
    },

    components: {
        DeleteConfirm,
        CellGridCheckbox
    },

    watch: {
        parentcode(value) {
            if (value && this.gridtype != "master") {
                this.onSearch()
            }
        },
        detailcode(value) {
            if (this.autocorrect == true)
                if (value && this.gridtype == "master") {
                    this.onSearch()
                }
        },
        companypk(value) {
            if (value) {
                this.onSearch()
            }
        },
    },

    data: () => ({
        deleteDialog: false,
        selectList: [],
        dataDetail: [],
        baseData: [],

        dataDetailFilter: [],
        companyList: [],
        beforeDataUpdate: [],

        selectedDatas: []
    }),

    computed: {
        getUser: function () {
            return this.$store.getters["auth/user"];
        },
        limitHeight() {
            return this.windowHeight * 0.5 - 130
        },
        defaultHeaders() {
            if (this.header) return this.header;

            return [{
                    title: this.$t("code"),
                    field: "CODE",
                    type: ""
                },
                {
                    title: this.$t("name"),
                    field: "NAME",
                    type: "",
                    width: 180
                },
                {
                    title: this.$t("lname"),
                    field: "LNAME",
                    type: "",
                    width: 180
                },
                {
                    title: this.$t("fname"),
                    field: "FNAME",
                    type: "",
                    width: 180
                },
                {
                    title: this.$t("ord"),
                    field: "ORD",
                    type: ""
                },
                {
                    title: this.$t("default yn"),
                    field: "DEF_YN",
                    type: "boolean"
                },
                {
                    title: this.$t("use yn"),
                    field: "USE_YN",
                    type: "boolean"
                },
                {
                    title: this.$t("sys yn"),
                    field: "SYS_YN",
                    type: "boolean"
                },
                {
                    title: this.$t("description"),
                    field: "DESCRIPTION",
                    type: "",
                    width: 180
                },
                {
                    title: this.$t('val 1'),
                    field: "VAL1",
                    type: ""
                },
                {
                    title: this.$t('val 2'),
                    field: "VAL2",
                    type: ""
                },
                {
                    title: this.$t('val 3'),
                    field: "VAL3",
                    type: ""
                },
                {
                    title: this.$t('val 4'),
                    field: "VAL4",
                    type: ""
                },
                {
                    title: this.$t('val 5'),
                    field: "VAL5",
                    type: ""
                },
                {
                    title: this.$t('val 6'),
                    field: "VAL6",
                    type: ""
                },
                {
                    title: this.$t('val 7'),
                    field: "VAL7",
                    type: ""
                },
                {
                    title: this.$t('val 8'),
                    field: "VAL8",
                    type: ""
                },
                {
                    title: this.$t('val 9'),
                    field: "VAL9",
                    type: ""
                },
                {
                    title: this.$t('val 10'),
                    field: "VAL10",
                    type: ""
                },
                {
                    title: this.$t('num 1'),
                    field: "NUM1",
                    type: ""
                },
                {
                    title: this.$t('num 2'),
                    field: "NUM2",
                    type: ""
                },
                {
                    title: this.$t('num 3'),
                    field: "NUM3",
                    type: ""
                },
                {
                    title: this.$t('num 4'),
                    field: "NUM4",
                    type: ""
                },
                {
                    title: this.$t('num 5'),
                    field: "NUM5",
                    type: ""
                },
                {
                    title: this.$t('num 6'),
                    field: "NUM6",
                    type: ""
                },
                {
                    title: this.$t('num 7'),
                    field: "NUM7",
                    type: ""
                },
                {
                    title: this.$t('num 8'),
                    field: "NUM8",
                    type: ""
                },
                {
                    title: this.$t('num 9'),
                    field: "NUM9",
                    type: ""
                },
                {
                    title: this.$t('num 10'),
                    field: "NUM10",
                    type: ""
                },

                {
                    title: this.$t("company"),
                    field: "TCO_COMPANY_PK",
                    type: "list"
                }
            ];
        },
    },

    methods: {
        // PasteRow(defaultParas, evt) {
        //   const rows = this._PasteRow(
        //     defaultParas,
        //     [
        //       "PARTNER_ID",
        //       "AC_CD",
        //       "CCY",
        //       "TR_AMT_DR",
        //       "TR_AMT_CR",
        //       "BK_AMT_DR",
        //       "BK_AMT_CR"
        //     ],
        //     evt
        //   );
        //   //console.log(rows);
        //   rows.forEach(e => {
        //     this.dataDetail.push(e);
        //   });
        // },
        autoLoadData() {
            if (this.autoload) {
                this.onSearch();
            }
        },
        async getCompanyList() {
            // const dso = {
            //   type: 'list',
            //   selpro: 'SYS_SEL_LIST_COMPANY',
            //   para: [ this.getUser.PK ]
            // }
            const result = await this._getCompany();
            if (result) {
                this.companyList = result;
                this.companyList.unshift({
                    PK: '',
                    TEXT: ' '
                });
            } else {
                this.companyList = [];
            }
        },

        async onSearch() {

            const pa = [
                this.gridtype == "master" ? '0' : '1', //type
                this.companypk, //companypk
                !this.detailcode ? '' : this.detailcode, //detailcode
                !this.parentcode ? '' : this.parentcode, //parentcode
            ];

            const dso = {
                type: 'list',
                selpro: 'sys_sel_syco001_common_code',
                para: pa
            }
            const result = await this._dsoCall(dso, 'select', false)
            if (result) {

                if (this.gridtype === 'detail' && this.editable === false && this.dialogmode === true) {
                    this.dataDetail = result.filter(x => x.USE_YN === 'Y');
                    this.baseData = [...this.dataDetail];
                } else {
                    this.baseData = [...result];
                    this.dataDetail = result;
                }

                if (this.filterDatas) {
                    // filters:
                    let filteredDatas = [];

                    for (let i in this.filterDatas) {
                        const filter = this.filterDatas[i];
                        if (filter.val !== '' && filter.val !== undefined && filter.val !== null) {
                            this.baseData.map(x => {
                                if (String(x[filter.col]) == filter.val || filter.val == 'ALL') {

                                    filteredDatas.push(x);
                                }
                            });
                        }
                    }
                    this.dataDetail = filteredDatas;
                }

            } else {
                this.dataDetail = [];
            }
        },

        async filterResult() {
            if (this.filterDatas) {
                // filters:
                let filteredDatas = [];

                for (let i in this.filterDatas) {
                    const filter = this.filterDatas[i];
                    if (filter.val !== '' && filter.val !== undefined && filter.val !== null) {
                        this.baseData.map(x => {
                            if (String(x[filter.col]) == filter.val || filter.val == 'ALL') {

                                filteredDatas.push(x);
                            }
                        });
                    }
                }
                this.dataDetail = filteredDatas;
            }
            // await this.onSearch()

        },

        //===========================================================================================================
        //===========================================================================================================
        //check change data
        onCellChanging(data) {
            this.beforeDataUpdate = JSON.parse(JSON.stringify(data.oldData));

        },

        onCellChanged(data) {
            let afterUpdateData = data.data;
            let bCheck = JSON.stringify(this.beforeDataUpdate) === JSON.stringify(afterUpdateData); // check change data

            if (!bCheck) {
                for (let i = 0; i < this.dataDetail.length; i++) {
                    if (data.data.PK === this.dataDetail[i].PK && data.data.PK != '' && data.data.PK > 0) {
                        this.dataDetail[i]._rowstatus = "u";
                        this.dataDetail[i].USER_PK = this.getUser.PK;
                        break;
                    }
                }
            }

            this.beforeDataUpdate = [];
        },

        valueChanged(e, colName, data) {
            const newValue = e.value ? 'Y' : 'N'
            this.changeValue(newValue, colName, data.PK, true)
        },

        changeValue(value, key, pk, isModified) {
            this.dataDetail.map((item, index) => {
                if (item.PK === pk) {
                    this.$set(item, key, value)
                    if (isModified && item.PK && item._rowstatus != 'i') {
                        item.USER_PK = this.getUser.PK;
                        item._rowstatus = "u";
                    }
                }
            })
        },

        onAddNew() {
            if (this.companypk.indexOf(",") > 0) {
                return this.showNotification("warning", this.$t('add_new_failed'), this.$t('please_select_one_company_only'))
            }
            let newRow = {
                PK: this._uniqueID(),
                _rowstatus: 'i',
                USER_PK: this.getUser.PK,
                TCO_COMPANY_PK: this.companypk,
                USE_YN: 'Y'
            };
            if (this.gridtype != "master") {
                newRow.PARENT_CODE = this.parentcode;
            }

            this.dataDetail.unshift(newRow);
        },

        onDeleteConfirm() {
            this.deleteDialog = true;
        },

        onDelete() {
            for (let i = 0; i < this.dataDetail.length; i++) {
                if (this.selectList.includes(this.dataDetail[i].PK)) {
                    this.dataDetail[i].USER_PK = this.getUser.PK;
                    this.dataDetail[i]._rowstatus = "d";
                }
            }
            this.onSave();
        },

        async onSave() {
            await this.$refs.grid.instance.saveEditData()

            //param for search after update
            const pa = [
                this.gridtype == "master" ? '0' : '1', //type
                this.companypk, //companypk
                !this.detailcode ? '' : this.detailcode, //detailcode
                !this.parentcode ? '' : this.parentcode, //parentcode
            ];

            const dso = {
                type: 'grid',
                //selpro:'sys_sel_syco001_common_code',
                updpro: 'sys_upd_syco001_common_code',
                para: pa, //type array[]
                elname: [
                    "_rowstatus", "USER_PK",
                    'PK', "CODE", "PARENT_CODE", "NAME", "LNAME", "FNAME", "ORD",
                    "NUM1", "NUM2", "NUM3", "NUM4", "NUM5", "NUM6", "NUM7", "NUM8", "NUM9", "NUM10",
                    "VAL1", "VAL2", "VAL3", "VAL4", "VAL5", "VAL6", "VAL7", "VAL8",
                    "VAL9", "VAL10",
                    "SYS_YN", "USE_YN", "DESCRIPTION", "TCO_COMPANY_PK", "DEF_YN"
                ], //type array[]
                data: this.dataDetail, //array json          
            }

            const result = await this._dsoCall(dso, 'update', true)
            if (result) {
                this.dataDetail = result;
                this.onSearch();
            } else {
                // this.dataDetail = [];
            }

        },

        //event select 
        onSelectionChanged({
            selectedRowKeys,
            selectedRowsData
        }) {
            this.selectList = selectedRowKeys;
            this.selectedDatas = selectedRowsData;
        },

        onSelectSingle({
            data
        }) {
            if (!this.multiselect) {
                //cho chuc nang delete voi single mode
                this.selectList = [];
                this.selectList.push(data.PK);

                this.selectedDatas = [];
                this.selectedDatas.push(data);
            }
            this.returnData(data)
        },

        onSelectSingleDblClick({
            data
        }) {
            this.returnDataDblClick(data)
        },

        onSelectMultiple() {
            let rtn_data = this.multiselect ? this.selectedDatas : this.selectedDatas[0]
            this.returnData(rtn_data)
        },

        returnData(datas) {
            this.$emit('returnData', datas)
        },

        returnDataDblClick(datas) {
            this.$emit('returnDataDblClick', datas)
        }

    },

    mounted() {
        this.getCompanyList();
        this.autoLoadData();
    }

}
</script>
