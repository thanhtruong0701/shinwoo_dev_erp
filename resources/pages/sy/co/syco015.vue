<template>
    <v-container fluid class="px-0 pt-0">
        <v-card>
            <v-row align="center">
                <v-col cols='2' class="pl-4">
                    <v-select dense cache-items hide-details outlined item-value="PK" item-text="TEXT"
                        :label="$t('company', 'common')" :items="companyList" v-model="selectedCompany" class="white">
                    </v-select>
                </v-col>
                <v-col cols="6">
                    <v-row align="center" justify="space-start" no-gutters>
                        <v-col md="5">
                            <BaseSelect dense cache-items hide-details outlined :text_all="$t('select_all')"
                                item-value="CODE" item-text="NAME" :label="$t('CCY')" :lstData="CCYList_SEARCH"
                                v-model="lstCCY" class="white" @change="onChangePeriod">
                            </BaseSelect>
                        </v-col>
                        <v-col md="3" class="pl-5">
                            <date-picker type="month" :label="$t('from Month')" @returnValue="base_date_from = $event"
                                dense outlined></date-picker>
                            <!--date-picker :type="pickerType" :label="$t('base_date')" @returnValue="base_date = $event" dense outlined></date-picker-->
                        </v-col>
                        <v-col md="3" class="pl-5">
                            <date-picker type="month" :label="$t('to Month')" @returnValue="base_date_to = $event" dense
                                outlined></date-picker>
                            <!--date-picker :type="pickerType" :label="$t('base_date')" @returnValue="base_date = $event" dense outlined></date-picker-->
                        </v-col>

                    </v-row>
                </v-col>
                <v-col col="3" class="text-right pr-4">
                    <div class="d-flex justify-end">
                        <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing"
                            @onclick="onSearch" />
                        <BaseButton icon_type="new" :btn_text="$t('addnew')" :disabled="isProcessing"
                            @onclick="addNew" />
                        <BaseButton icon_type="save" :btn_text="$t('save')" :disabled="isProcessing"
                            @onclick="onSave" />
                        <BaseButton icon_type="delete" :btn_text="$t('delete')" :disabled="isProcessing"
                            @onclick="onDeleteCf" />
                        <!--BaseButton icon_type="copy" :btn_text="$t('popup')" :disabled="isProcessing" @onclick="onPopUp" /-->
                    </div>
                    <!-- <v-btn icon tile color="currentTheme" @click="onSearch">
                    <v-icon>mdi-magnify</v-icon>
                </v-btn>
                <v-btn icon tile color="success" @click="addNew">
                    <v-icon>mdi-plus-thick</v-icon>
                </v-btn>
                <v-btn icon tile :color="currentTheme" @click="onSave">
                    <v-icon>mdi-content-save</v-icon>
                </v-btn>
                <v-btn icon tile color="red" ref="btnDelete" @click="onDeleteCf">
                    <v-icon>mdi-close-thick</v-icon>
                </v-btn>
                <v-btn icon tile :color="currentTheme" @click="onPopUp">
                    <v-icon>mdi-content-copy</v-icon>
                </v-btn> -->
                </v-col>
            </v-row>
            <v-row align="center">
                <v-col cols="12">
                    <v-card v-resize="onResize">


                        <BaseGridView ref="grid_RATE" :auto_load="true" :filterRow="true" :headertype="1"
                            selectionmode="multiplerows" :column_resizing_mode="'widget'" :max_height="limitHeight"
                            sel_procedure="SW_SEL_SYCO015" upd_procedure="SW_UPD_SYCO015"
                            @onSelectionDataChanged="onSelectionDataChanged" :filter_paras="[
                                this.base_date_from,
                                this.base_date_to,
                                this.selectedCompany,
                                this.lstCCY
                            ]" :update_paras="[
                                'PK',
                                'STDATE',
                                'TCO_COMPANY_PK',
                                'CCY',
                                'CCY2',
                                'RT1',
                                'RT2',
                                'RT3',
                                'RT4',
                                'RT5',
                                'RT6',
                                'USE_YN'
                            ]" :header="[
                        {
                            dataField: 'TCO_COMPANY_PK', caption: this.$t('company'), allowEditing: true, width: '200',
                            lookup: { dataSource: this.companyList, displayExpr: 'TEXT', valueExpr: 'PK' }
                        },
                        { dataField: 'STDATE', caption: this.$t('STDATE'), allowEditing: false, width: 100, alignment: 'center' },

                        {
                            dataField: 'CCY', caption: this.$t('CCY'), allowEditing: true, width: '185',
                            lookup: { dataSource: this.ccylist, displayExpr: 'NAME', valueExpr: 'CODE' }
                        },
                        {
                            dataField: 'CCY2', caption: this.$t('CCY'), allowEditing: true, width: '185',
                            lookup: { dataSource: this.ccylist2, displayExpr: 'NAME', valueExpr: 'CODE' }
                        },
                        { dataField: 'RT1', caption: this.$t('Exchange Rate'), formatFloat: '5', allowEditing: true, visible: true },
                        { dataField: 'RT2', caption: this.$t('Exchange Rate2'), formatFloat: '5', allowEditing: true, visible: true },
                        { dataField: 'RT3', caption: this.$t('Exchange Rate3'), formatFloat: '5', allowEditing: true, visible: true },
                        { dataField: 'RT4', caption: this.$t('Exchange Rate4'), formatFloat: '5', allowEditing: true, visible: true },
                        { dataField: 'RT5', caption: this.$t('Exchange Rate5'), formatFloat: '5', allowEditing: true, visible: true },
                        { dataField: 'RT6', caption: this.$t('Exchange Rate6'), formatFloat: '5', allowEditing: true, visible: true },
                        { dataField: 'USE_YN', caption: this.$t('USE YN'), type: 'boolean', allowEditing: true, visible: true },
                    ]" />


                    </v-card>
                </v-col>
                <delete-confirm v-if="deleteDialog" @onCloseDialog="deleteDialog = false"
                    @onConfirm="onDelete"></delete-confirm>
                <base-rate-entry-dialog ref="baseRateEntryDialog"></base-rate-entry-dialog>
            </v-row>
        </v-card>
    </v-container>
</template>

<script>
import moment from "moment";
import CellGridTextField from '@/components/table/CellGridTextField'
import CellGridSelect from '@/components/table/CellGridSelect'
import CellGridCheckbox from '@/components/table/CellGridCheckbox'
import CellGridDatePicker from '@/components/table/CellGridDatePicker'

import ActionConfirm from '@/components/dialog/ActionConfirmDialog';
import DeleteConfirm from '@/components/dialog/DeleteConfirmDialog';
import { type } from "jquery";
export default {
    layout: 'default',
    middleware: 'user',

    components: {
        DatePicker: () => import("@/components/control/DatePicker"),
        DeleteDialog: () => import("@/components/dialog/DeleteDialog"),
        BaseRateEntryDialog: () => import("@/components/dialog/BaseRateEntryDialog"),
        DeleteConfirm
    },

    data: () => ({
        actionDialog: false,
        deleteDialog: false,
        companyList: [],
        base_date_from: '',
        base_date_to: '',
        selectedCompany: '',
        selectedRowsData: [],
        ccylist: [],
        ccylist2: [],
        dataList: [],
        selectList: [],
        beforeDataUpdate: [],
        multiselect: false,
        periodList: [],
        CCYList_SEARCH: [],
        lstPeriod: "",
        lstCCY: '',
        pickerType: 'date'
    }),

    async created() {
        //this.selectedCompany = this.user.TCO_COMPANY_PK;
        this.getCompanyList();
        this.selectedCompany = this.user.TCO_COMPANY_PK;
        this.getccy();
        this.onChangePeriod();
        /*const dso = {
                type: 'list',
                selpro: 'SW_GET_COMMONCODE_EI',
                para: [this.selectedCompany, 'ACJS0140']
            }
            this.periodList = await this._dsoCall(dso, 'select', false)
            this.lstPeriod = this.periodList[0].PK;*/

        const commoncode = await this._getCommonCode2(["LGCM0100", "ACJS0060"], this.selectedCompany);

        this.CCYList_SEARCH = commoncode[0];

        this.pickerType = "date";
        //this.base_date = this._CurrentDate();
        this.base_date_to = moment(this._CurrentDate(), "YYYYMMDD").format("YYYYMM");
        this.base_date_from = moment(this._CurrentDate(), "YYYYMMDD").format("YYYYMM");
        this.onSearch();
    },

    computed: {
        user: function () {
            return this.$store.getters["auth/user"];
        },
        limitHeight() {
            return this.windowHeight - 220
        }
    },

    watch: {
        selectedCompany(value) {
            if (value && this.isProcess == false) {
                this.isProcess = true;
                this.onSearch();
            }
        },
    },
    mounted() {

    },

    filters: {
        formatOrg(value, orgList) {
            let text = ''
            const found = orgList.find(item => item.PK === value)
            if (found) {
                text = found.TEXT.replace(/\./g, '')
            }
            return text
        },
        formatMonthYear(value, fromFormat, toFormat) {
            let rtn = '';
            if (value) {
                let date = moment(String(value), fromFormat);
                rtn = moment(date).format(toFormat);
            }
            return rtn;
        }
    },

    methods: {
        async getCompanyList() {
            const dso = {
                type: 'list',
                selpro: 'SYS_SEL_LIST_COMPANY',
                para: [this.user.PK]
            }
            const result = await this._dsoCall(dso, 'select', false)
            if (result) {
                this.companyList = result;
                //this.selectedCompany = 1;//this.companyList[0]
            } else {
                this.companyList = []
            }
            //this.selectedCompany = '1';
        },

        async getccy() {
            const dso_ccy_list = {
                type: 'list',
                selpro: 'sys_sel_common_code_name',
                para: ['LGCM0100']
            }
            this.ccylist = await this._dsoCall(dso_ccy_list, 'select', false)
            this.ccylist2 = await this._dsoCall(dso_ccy_list, 'select', false)
        },

        async onSearch() {
            this.$refs.grid_RATE.loadData();
            /*const dso = {
                type: 'grid',
                selpro: 'SW_SEL_SW20150_2',
                para: [this.base_date, this.selectedCompany]
            };
            this.dataList = await this._dsoCall(dso, "select", false);*/

        },

        addNew() {
            const randPK2 = Math.floor(Math.random() * 10000) + 1;
            console.log(randPK2)
            this.$refs.grid_RATE.addRowStruct({
                PK: randPK2,
                STDATE: this.base_date_from,
                TCO_COMPANY_PK: this.selectedCompany,
                CCY: '',
                CCY2: '',
                RT1: '',
                RT2: '',
                RT3: '',
                RT4: '',
                RT5: '',
                RT6: '',
                USE_YN: 'Y'
            });

            //this.$refs.grid_RATE.addRow();
            //this.$refs.grid_RATE.instance.addRow();
            /*let newRow = {
                _rowstatus: 'i',
                PK: this._uniqueID(),
                STD_YMD: this.base_date,
                STD_YM: this.base_date,
                TCO_COMPANY_PK: this.selectedCompany,
                CCY: '',
                INTERNAL_SELL_RATE: '',
                INTERNAL_BUY_RATE: '',
                TTB_RATE: '',
                TTS_RATE: '',
                TTM_RATE: '',
                TTMP_RATE: ''
            };
            // this.$refs.grid_RATE.instance.addRow(newRow);

            this.dataList.unshift(newRow);
            console.log(this.dataList)*/
        },

        onDeleteCf() {
            this.deleteDialog = true;
        },

        // onDelete() {
        //     for (let i = 0; i < this.dataList.length; i++) {
        //         if (this.selectList.includes(this.dataList[i].PK)) {
        //             console.log(this.dataList)
        //             // this.dataList[i].USER_PK=this.getUser.PK;
        //             this.dataList[i]._rowstatus = "d";
        //         }
        //     }
        //     this.onSave();
        // },
        async onDelete() {
            try {
                this.isProcessing = true;

                // Grid sẽ tự xử lý việc xóa các rows đã chọn
                this.$refs.grid_RATE.deleteRows();
                await this.$refs.grid_RATE.saveData();
            } catch (error) {
                this.showNotification('danger', 'Lỗi: ' + error.message, '', 4000);
            } finally {
                this.isProcessing = false;
            }
        },
        onPopUp() {
            this.$refs.baseRateEntryDialog.dialogIsShow = true;
        },
        onSave() {
            this.$refs.grid_RATE.saveData();
            /*this.$refs.grid_RATE.instance.saveEditData().then(async () => {
                const dso = {
                    type: 'grid',
                    selpro: 'SW_SEL_SW20150_2',
                    updpro: 'SW_UPD_SW20150_1',
                    para: [this.base_date, this.selectedCompany], //type array[]
                    elname: [
                        '_rowstatus',
                        'PK',
                        'STD_YMD',
                        'STD_YM',
                        'TCO_COMPANY_PK',
                        'CCY',
                        'INTERNAL_SELL_RATE',
                        'INTERNAL_BUY_RATE',
                        'TTB_RATE',
                        "TTS_RATE",
                        'TTM_RATE',
                        'TTMP_RATE'
                    ], //type array[]
                    data: this.dataList, //array json          
                }

                const result = await this._dsoCall(dso, "update", false);
                if (result) {
                    this.showNotification("success", this.$t("update_success"), "");
                    this.dataList = result;
                }
            });*/
        },
        onSelectionDataChanged(data) {
            this.selectedRowsData = [...data];
            console.log("Selected rows:", this.selectedRowsData);
        },
        onSelectionChanged(e) {
            console.log("onSelectionChanged triggered:", e);
            this.selectList = e.selectedRowKeys;
        },
        valueChanged(e, colName, rowIndex) {
            const newValue = e.value ? 'Y' : 'N'
            this.changeValue(newValue, colName, rowIndex, true)
        },

        changeValue(value, key, idx, isModified) {
            this.dataList.map((item, index) => {
                if (index === idx) {
                    this.$set(item, key, value)
                    if (isModified && item.PK && item._rowstatus != 'i') {
                        item._rowstatus = "u"
                    }
                }
            })
        },

        //===========================================================================================================
        //===========================================================================================================
        //check change data
        /* onCellChanging(data)
        {
          this.beforeDataUpdate =  JSON.parse(JSON.stringify(data.oldData));
        }, */
        onChangePeriod() {
            if (this.lstPeriod === "1") {
                this.pickerType = "date"
                //this.base_date = this._CurrentDate()
                this.base_date_to = moment(this._CurrentDate(), "YYYYMMDD").format("YYYYMM");
                this.base_date_from = moment(this._CurrentDate(), "YYYYMMDD").format("YYYYMM");
            } else {
                this.pickerType = "month"
                //this.base_date = this._CurrentYMD("YM")
                this.base_date_to = moment(this._CurrentDate(), "YYYYMMDD").format("YYYYMM");
                this.base_date_from = moment(this._CurrentDate(), "YYYYMMDD").format("YYYYMM");
            }
        },
        onCellChanged(data) {
            let afterUpdateData = data.data;
            let bCheck = JSON.stringify(this.beforeDataUpdate) === JSON.stringify(afterUpdateData); // check change data

            if (!bCheck) {
                for (let i = 0; i < this.dataList.length; i++) {
                    if (data.data.PK === this.dataList[i].PK && data.data.PK > 0) {
                        this.dataList[i]._rowstatus = "u";
                        break;
                    }
                }
            }

            this.beforeDataUpdate = [];
        },

        //===========================================================================================================
        //===========================================================================================================

    }
}
</script>
