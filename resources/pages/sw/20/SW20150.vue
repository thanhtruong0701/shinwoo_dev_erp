<template>
<v-container fluid class="px-0 pt-0">
    <v-card>
        <v-row align="center">
            <v-col cols='3' class="pl-4">
                <v-select dense cache-items hide-details outlined item-value="PK" item-text="TEXT" :label="$t('company', 'common')" :items="companyList" v-model="selectedCompany" class="white">
                </v-select>
            </v-col>
            <v-col cols="3">
                <v-row align="center" justify="space-between" no-gutters>
                    <v-col md="5">
                        <v-select dense cache-items hide-details outlined item-value="PK" item-text="TEXT" :label="$t('period')" :items="periodList" v-model="lstPeriod" class="white" @change="onChangePeriod">
                        </v-select>
                    </v-col>
                     <v-col md="7" class="pl-5">
                        <date-picker  :label="$t('base_date')" @returnValue="base_date = $event"  dense outlined></date-picker>
						<!--date-picker :type="pickerType" :label="$t('base_date')" @returnValue="base_date = $event" dense outlined></date-picker-->
                    </v-col>
                </v-row>
            </v-col>
            <v-col col="6" class="text-right pr-4">
                <div class="d-flex justify-end">
                    <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="onSearch" />
                    <BaseButton icon_type="new" :btn_text="$t('addnew')" :disabled="isProcessing" @onclick="addNew" />
                    <BaseButton icon_type="save" :btn_text="$t('save')" :disabled="isProcessing" @onclick="onSave" />
                    <BaseButton icon_type="delete" :btn_text="$t('delete')" :disabled="isProcessing " @onclick="onDeleteCf" />
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
				<BaseGridView
                    column-resizing-mode="widget"
                    ref="grid_RATE"                   
                    sel_procedure="SW_SEL_SW20150_2"
                    upd_procedure="SW_UPD_SW20150_1"
                    select_mode="MultipleHideBox"
                    :auto_load="false"
                    :max_height="limitHeight"
                    @cellClick="onCellCickGrdDetail01" 
                    :filter_paras="[
                          this.base_date, 
						  this.selectedCompany                          
                      ]"  					  
                    :update_paras="[
                        'PK',
                        'STD_YMD',
                        'STD_YM',
                        'TCO_COMPANY_PK',
						'TYPE_NAME',
                        'CCY',
                        'INTERNAL_SELL_RATE',
                        'INTERNAL_BUY_RATE',
                        'TTB_RATE',
                        'TTS_RATE',
                        'TTM_RATE',
                        'TTMP_RATE'                      
                      ]"
                  :header="[  
                    {dataField: 'TCO_COMPANY_PK',caption: this.$t('company'), allowEditing: true, width: '140',
                      lookup: { dataSource: this.companyList, displayExpr:'TEXT', valueExpr: 'PK' } 
                    },
					{dataField: 'TYPE_NAME',caption: this.$t('type'), allowEditing: true }, 					
                    {dataField: 'CCY',caption: this.$t('label_type'), allowEditing: true, width: '280', 
                      lookup: { dataSource: this.ccylist, displayExpr:'NAME', valueExpr: 'CODE' } 
                    },
					
                    {dataField: 'INTERNAL_SELL_RATE',caption: this.$t('internal_sell_rate'),formatFloat: '5', allowEditing: true },   
                    {dataField: 'INTERNAL_BUY_RATE',caption: this.$t('internal_buy_rate'),formatFloat: '5', allowEditing: true,visible: false },
					{dataField: 'TTB_RATE',caption: this.$t('ttb_rate'),formatFloat: '5', allowEditing: true ,visible: false},
					{dataField: 'TTS_RATE',caption: this.$t('tts_rate'),formatFloat: '5', allowEditing: true ,visible: false},
					{dataField: 'TTM_RATE',caption: this.$t('ttm_rate'),formatFloat: '5', allowEditing: true ,visible: false},
					{dataField: 'TTMP_RATE',caption: this.$t('ttmp_rate'),formatFloat: '5', allowEditing: true ,visible: false},                               
                  ]"           
                  />
				  
                   
                </v-card>
            </v-col>
            <delete-confirm v-if="deleteDialog" @onCloseDialog="deleteDialog = false" @onConfirm="onDelete"></delete-confirm>
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
        base_date: '',
        selectedCompany: '',

        ccylist: [],
        dataList: [],
        selectList: [],
        beforeDataUpdate: [],
        multiselect: false,
        periodList: [],
        lstPeriod: "",
        pickerType: 'date'
    }),

  async created() {
        //this.selectedCompany = this.user.TCO_COMPANY_PK;
        this.getCompanyList();
        this.getccy();
        this.onChangePeriod();
         const dso = {
                type: 'list',
                selpro: 'SW_GET_COMMONCODE_EI',
                para: [this.selectedCompany, 'ACJS0140']
            }
            this.periodList = await this._dsoCall(dso, 'select', false)
            this.lstPeriod = this.periodList[0].PK;
            this.pickerType = "date";
            this.base_date = this._CurrentDate();

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
                this.selectedCompany = 1;//this.companyList[0]
            } else {
                this.companyList = []
            }
			//this.selectedCompany = '1';
        },

        async getccy() {
            const dso_ccy_list = {
                type: 'list',
                selpro: 'sys_sel_common_code_name',
                para: ['SZ009']
            }
            this.ccylist = await this._dsoCall(dso_ccy_list, 'select', false)
        },

        async onSearch() {
		this.$refs.grid_RATE.loadData() ;
            /*const dso = {
                type: 'grid',
                selpro: 'SW_SEL_SW20150_2',
                para: [this.base_date, this.selectedCompany]
            };
            this.dataList = await this._dsoCall(dso, "select", false);*/

        },

        addNew() {
		
		const randPK2 = Math.random(2) * 10000;
          this.$refs.grid_RATE.addRowStruct({
            PK: randPK2,
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

        onDelete() {
            for (let i = 0; i < this.dataList.length; i++) {
                if (this.selectList.includes(this.dataList[i].PK)) {
                    // this.dataList[i].USER_PK=this.getUser.PK;
                    this.dataList[i]._rowstatus = "d";
                }
            }
            this.onSave();
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

        onSelectionChanged({
            selectedRowKeys
        }) {
            this.selectList = selectedRowKeys;
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
                this.base_date = this._CurrentDate()
            } else {
                this.pickerType = "month"
                this.base_date = this._CurrentYMD("YM")
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
