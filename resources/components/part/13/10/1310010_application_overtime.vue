<template>
    <v-container fluid class="pt-0 px-0 py-0">
        <GwGridLayout dense colsPerRow="4" percentHeight="50" @callBackHeight="gridHeight = _calculateHeight($event,81)" >
            <v-card-title colspan="4"  class="subtitle-1 primary-gradient white--text py-1">
                <span >{{ $t('detail')}}</span>
            </v-card-title>

            <v-row colspan="4"  class="flex-row" justify="start"  no-gutters>
                <BaseCheckbox class="px-1"  v-model="isShowDate"  :label="$t('date_in_out')" color="red darken-3" true-value="Y" false-value="N"></BaseCheckbox>
                <BaseCheckbox class="px-1"  v-model="isShowOT1"  :label="$t('ot_01')" color="red darken-3" true-value="Y" false-value="N"></BaseCheckbox>
                <BaseCheckbox class="px-1"  v-model="isShowOT2"  :label="$t('ot_02')" color="red darken-3" true-value="Y" false-value="N"></BaseCheckbox>
                <BaseCheckbox class="px-1"  v-model="isShowOT3"  :label="$t('ot_03')" color="red darken-3" true-value="Y" false-value="N"></BaseCheckbox>
                <BaseCheckbox class="px-1"  v-model="isShowRealTime"  :label="$t('real_time')" color="red darken-3" true-value="Y" false-value="N"></BaseCheckbox>
            </v-row>

            <v-row colspan="4"  no-gutters justify="end"  v-show="!doc_processing" >
                    <!-- <BaseInput  :outlined="true" readonly  :label="$t('import_data')" v-model="fileName" @click="$refs.file.click()" style="width: 40%!important"></BaseInput>
                    <BaseButton btn_type="icon" icon_type="import" :btn_text="$t('import')" :disabled="isProcessing"  @onclick="importData"/>
                    <BaseButton btn_type="icon" icon_type="excel" :btn_text="$t('template')" :disabled="isProcessing"  @onclick="downloadTemplate"/> -->
                    <v-divider  vertical class="px-2"></v-divider>

                    <BaseButton btn_type="icon" icon_type="self" :btn_text="$t('self')" mdi-icon="mdi-account-circle" :disabled="isProcessing"  @onclick="addBySelf"/>
                    <BaseButton btn_type="icon" icon_type="add" :btn_text="$t('add')" :disabled="isProcessing"  @onclick="openEmployeeDialog"/>
                    <BaseButton btn_type="icon" icon_type="delete" :btn_text="$t('delete')" :disabled="isProcessing" @onclick="deleteDetail"/>
                    <BaseButton btn_type="icon" icon_type="undelete" :btn_text="$t('un_delete')" :disabled="isProcessing" @onclick="undeleteDetail"/>
                </v-row>
            
            <BaseGridView :headertype="1" ref='idGrid'  colspan="12" class="my-1"
                :height="gridHeight" :header="header" :id="'idGrid'"  
                @row-updated="cellChanged" @cell-changed="cellChanged" 
            ></BaseGridView>
        </GwGridLayout>

        <div  v-show="false">
            <BaseGridView 
                :headertype="1" ref='idGridTmp' 
                :header="header" :id="'idGridTmp'"
            ></BaseGridView>
        </div>
        <employee-dialog ref="employeeDialog" @closeEmployeeDialog="employeeDialog = false" @callBack="addOthers" :multiSelectMode="true"></employee-dialog>
        <ErrorDialog ref="errorDialog" :data="validateData" :doc_type="'01'"></ErrorDialog>
    </v-container>
</template>

<script>
import HRImport from '@/components/part/10/controls/hr_import.vue';
import EmployeeDialog from '@/components/part/10/controls/hr_employee_dialog.vue';
import ErrorDialog from '@/components/part/13/10/1310010_error_dialog.vue';
import moment from 'moment';

export default {
    name: 'ea-1031010-1-overtime',
    layout: 'default',
    middleware: 'user',
    components: { 
        'hr-import' :HRImport ,
        'employee-dialog':EmployeeDialog,
        ErrorDialog,
    },

    props: {
        master: {
            type: Object
        },
    },


    data: () => ({
        gridHeight: 0,
        header:[],

        wsList: [],
        holTypeList:[],

        isShowDate:'Y',
        isShowOT1: 'Y',
        isShowOT2: 'N',
        isShowOT3: 'N',
        isShowRealTime: 'Y',

        validateData:[],

        dsoGetDateInfo:{
            type: 'process',
            updpro: 'ea_pro_1310010_ot_change_wd',
        },
        dsoDeleteTemp:{
            type: 'process',
            updpro: 'ea_pro_1310010_ot_delete_tmp',
        },
        dsoInsertTemp: {
            type: 'grid',
            selpro: 'ea_sel_1310010_ot_tmp',
            updpro: 'ea_upd_1310010_ot_tmp',
            elname: [
                "INDEX", "PK", "THR_EMP_PK", "EMP_ID", "FULL_NAME", "WORK_DT", "THR_WS_PK"
                , "FROM_DT_01", "FROM_TIME_01", "TO_DT_01", "TO_TIME_01"
                , "FROM_DT_02", "FROM_TIME_02", "TO_DT_02", "TO_TIME_02"
                , "FROM_DT_03", "FROM_TIME_03", "TO_DT_03", "TO_TIME_03"
                , "REASON", "REMARK", "SEQ"
            ]
        }, 
        dsoDetail: {
            type: 'grid',
            selpro: 'ea_sel_1310010_ot_reg',
            updpro: 'ea_upd_1310010_ot_reg',
            elname: [
                "_rowstatus", 'PK', 'TED_EDOC_MASTER_V2_PK', "INDEX", "THR_EMP_PK",  "WORK_DT", "THR_WS_PK"
                , "FROM_DT_01", "FROM_TIME_01", "TO_DT_01", "TO_TIME_01"
                , "FROM_DT_02", "FROM_TIME_02", "TO_DT_02", "TO_TIME_02"
                , "FROM_DT_03", "FROM_TIME_03", "TO_DT_03", "TO_TIME_03"
                , 'REASON', 'REMARK'
            ]
        },
    }),
    watch: {
        isShowDate: function(val) {
            try {
                let hidden = (val == 'Y' || val == true) ? false : true;

                this.$refs.idGrid.setColumnsHidden(["FROM_DT_01", "TO_DT_01"], this.isShowOT1 == 'Y'? hidden : true);
                this.$refs.idGrid.setColumnsHidden(["FROM_DT_02", "TO_DT_02"], this.isShowOT2 == 'Y'? hidden : true);
                this.$refs.idGrid.setColumnsHidden(["FROM_DT_03", "TO_DT_03"], this.isShowOT3 == 'Y'? hidden : true);
            } catch(e){
                console.log(e.message)
            }
        },
        isShowOT1: function(val) {
            this.showColumnOT('01', val);
        },
        isShowOT2: function(val) {
            this.showColumnOT('02', val);
        },
        isShowOT3: function(val) {
            this.showColumnOT('03', val);
        },
        isShowRealTime: function(val) {
            try {
                let hidden = (val == 'Y' || val == true) ? false : true;
                this.$refs.idGrid.setColumnsHidden(["REAL_DATE_IN", "REAL_TIME_IN", "REAL_DATE_OUT", "REAL_TIME_OUT", "REAL_WORK_TIME", "REAL_OT"], val == 'Y'? hidden : true);

                if(!hidden) {
                    hidden = (this.isShowDate == 'Y' || this.isShowDate == true) ? false : true;
                    this.$refs.idGrid.setColumnsHidden(["REAL_DATE_IN", "REAL_DATE_OUT"], hidden);
                }
            } catch(e){
                console.log(e.message)
            }
        },
    },

    computed: {
        user: function () {
            return this.$store.getters["auth/user"];
        },
        doc_processing(){
            if(this.master) return this.master.PROCESSING_YN == 'Y';
            else return false;
        },
    },

    async created() {
        this.prepareCommonData();
    },

    methods: {
        showColumnOT(type, val){
            let cols = [`FROM_DT_${type}`, `FROM_TIME_${type}`, `TO_DT_${type}`, `TO_TIME_${type}`, `OT_${type}`];
            let colDates = [`FROM_DT_${type}`, `TO_DT_${type}`];

            try {
                let hidden = (val == 'Y' || val == true) ? false : true;
                this.$refs.idGrid.setColumnsHidden(cols, val == 'Y'? hidden : true);

                if(!hidden) {
                    hidden = (this.isShowDate == 'Y' || this.isShowDate == true) ? false : true;
                    this.$refs.idGrid.setColumnsHidden(colDates, hidden);
                }
            } catch(e){
                console.log(e.message)
            }
        },

        async reset(){
            try{ 
                this.$refs.idGrid.Clear(); 
                this.prepareCommonData();
            } catch (e){
                console.log(e.message)
            }
        },

        async prepareCommonData(){
            this.wsList = await this._getWorkShift(this.user.TCO_COMPANY_PK);
            this.holTypeList = await this._getCommonCode('COAB0140', this.user.TCO_COMPANY_PK);

            this.header=[
                { title: ("no" ) , field:"INDEX" , editable: false  , type: "", fixed: true},
                { title: ("emp_id" ) , field:"EMP_ID" , editable: false  , type: "", fixed: true},
                { title: ("full_name" ) , field:"FULL_NAME" , editable: false  , type: "", fixed: true, width: 200},

                { title: ("work_dt" ) , field:"WORK_DT" , editable: true  , type: "date"},
                { title: ("hol_type" ) , field:"HOL_TYPE" , editable: false , type: "list", datasource: { KEY: 'PK', VALUE: 'TEXT', data: this.holTypeList }, cellclassname: this.cellClassName},
                { title: ("work_shift"), field: "THR_WS_PK", editable: false, type: "list", datasource: { KEY: 'PK', VALUE: 'SHIFT', data: this.wsList }, width: 50 },

                { title: ("date_in" ) , field:"FROM_DT_01" , editable: true  , type: "date", group1:this.$t('ot_time_01')},
                { title: ("time_in" ) , field:"FROM_TIME_01" , editable: true  , type: "time", width: 80, group1:this.$t('ot_time_01')},
                { title: ("date_out" ) , field:"TO_DT_01" , editable: true  , type: "date", group1:this.$t('ot_time_01')},
                { title: ("time_out" ) , field:"TO_TIME_01" , editable: true  , type: "time", width: 80, group1:this.$t('ot_time_01')},
                { title: ("ot" ) , field:"OT_01" , editable: false  , type: "number", format:"###,###,###.##", width: 80, group1:this.$t('ot_time_01')},

                { title: ("date_in" ) , field:"FROM_DT_02" , editable: true  , type: "date", group1:this.$t('ot_time_02'), hidden: true},
                { title: ("time_in" ) , field:"FROM_TIME_02" , editable: true  , type: "time", width: 80, group1:this.$t('ot_time_02'), hidden: true},
                { title: ("date_out" ) , field:"TO_DT_02" , editable: true  , type: "date", group1:this.$t('ot_time_02'), hidden: true},
                { title: ("time_out" ) , field:"TO_TIME_02" , editable: true  , type: "time", width: 80, group1:this.$t('ot_time_02'), hidden: true},
                { title: ("ot" ) , field:"OT_02" , editable: false  , type: "number", format:"###,###,###.##", width: 80, group1:this.$t('ot_time_02'), hidden: true},

                { title: ("date_in" ) , field:"FROM_DT_03" , editable: true  , type: "date", group1:this.$t('ot_time_03'), hidden: true},
                { title: ("time_in" ) , field:"FROM_TIME_03" , editable: true  , type: "time", width: 80, group1:this.$t('ot_time_03'), hidden: true},
                { title: ("date_out" ) , field:"TO_DT_03" , editable: true  , type: "date", group1:this.$t('ot_time_03'), hidden: true},
                { title: ("time_out" ) , field:"TO_TIME_03" , editable: true  , type: "time", width: 80, group1:this.$t('ot_time_03'), hidden: true},
                { title: ("ot" ) , field:"OT_03" , editable: false  , type: "number", format:"###,###,###.##", width: 80, group1:this.$t('ot_time_03'), hidden: true},

                { title: ("date_in" ) , field:"REAL_DATE_IN" , editable: false  , type: "date", group1:this.$t('real_working_time'), hidden: true},
                { title: ("time_in" ) , field:"REAL_TIME_IN" , editable: false  , type: "", width: 80, group1:this.$t('real_working_time')},
                { title: ("date_out" ) , field:"REAL_DATE_OUT" , editable: false  , type: "date", group1:this.$t('real_working_time'), hidden: true},
                { title: ("time_out" ) , field:"REAL_TIME_OUT" , editable: false  , type: "", width: 80, group1:this.$t('real_working_time')},
                { title: ("work_time" ) , field:"REAL_WORK_TIME" , editable: false  , type: "number", group1:this.$t('real_working_time')},
                { title: ("ot" ) , field:"REAL_OT" , editable: false  , type: "number", format:"###,###,###.##", group1:this.$t('real_working_time')},

                { title: ("reason" ) , field:"REASON" , editable: true  , type: "", width: 200},
                { title: ("remark" ) , field:"REMARK" , editable: true  , type: "", width: 200},

                { title: ("seq" ) , field:"SEQ" , editable: false  , type: "", hidden: true},
            ];
        },

        cellClassName  (row, columnfield, value,rowdata) {
            if(rowdata.HOL_TYPE == "HOL") {
                return "cellHolCar";
            }
            if(rowdata.HOL_TYPE == "SUN") {
                return "cellSunCar";
            }
            return this.cellClassStatus(rowdata);
        },

        async load(){
            this.dsoDetail.para = [this.master.PK];
            await this.$refs.idGrid.onSearch(this.dsoDetail);
        },

        openEmployeeDialog(){
            this.$refs.employeeDialog.dialogIsShow = true;
        },

        async cellChanged(args, rowData) {
            let data = { ...rowData };
            let col = args.datafield;
            let row = args.rowindex;

            if(col == 'WORK_DT') {
                try{
                    this.dsoGetDateInfo.para = [data.THR_EMP_PK, data.WORK_DT];
                    const result = await this._dsoCall(this.dsoGetDateInfo, 'process', false)
                    if(result && result.length > 0) {
                        const rtn = result[0];
                        this.$refs.idGrid.onSet("HOL_TYPE", rtn.HOL_TYPE, false, row);
                        this.$refs.idGrid.onSet("THR_WS_PK", rtn.THR_WS_PK, false, row);
                        this.$refs.idGrid.onSet("REAL_DATE_IN", rtn.REAL_DATE_IN, false, row);
                        this.$refs.idGrid.onSet("REAL_TIME_IN", rtn.REAL_TIME_IN, false, row);
                        this.$refs.idGrid.onSet("REAL_DATE_OUT", rtn.REAL_DATE_OUT, false, row);
                        this.$refs.idGrid.onSet("REAL_TIME_OUT", rtn.REAL_TIME_OUT, false, row);
                        this.$refs.idGrid.onSet("REAL_WORK_TIME", rtn.REAL_WORK_TIME, false, row);
                        this.$refs.idGrid.onSet("REAL_OT", rtn.REAL_OT, false, row);
                        this.$refs.idGrid.onSet("FROM_DT_01", rtn.FROM_DT_01, false, row);
                        this.$refs.idGrid.onSet("TO_DT_01", rtn.TO_DT_01, false, row);
                    }
                } catch{}
                
            }
        },

        addBySelf(){
            let newData = {
                THR_EMP_PK: this.user.THR_ABEMP_PK,
                FULL_NAME: this.user.USER_NAME,
                EMP_ID: this.user.EMP_ID,
                //WORK_DT: moment().format('YYYYMMDD')
            };
            this.$refs.idGrid.onAdd(newData, true);
            this.$refs.idGrid.onSet("WORK_DT", moment().format('YYYYMMDD'), true, this.$refs.idGrid.getData().length-1 );

            this.updateGridIndexNo(this.$refs.idGrid);
        },

        addOthers(data){
            if(!!!data) return;

            let datas = [];

            if(Array.isArray(data)) {
                datas = [...data];
            } else {
                datas = [data];
            }

            this.$refs.idGrid.onAdds(datas, true);
            this.$refs.idGrid.onSetAll("WORK_DT", moment().format('YYYYMMDD') );
            this.updateGridIndexNo(this.$refs.idGrid);
        },

        deleteDetail() {
            this.$refs.idGrid.onSetMarkedDelete(true);
            this.updateGridIndexNo(this.$refs.idGrid);
        },

        undeleteDetail(){
            this.$refs.idGrid.onSetMarkedDelete(false);
            this.updateGridIndexNo(this.$refs.idGrid);
        },

        async validate(){
            let gridData = this.$refs.idGrid.getData();
            if(gridData && gridData.length <= 0) {
                this.showNotification("warning", this.$t("please_input_detail_data"), '');
                return false;
            }

            let duplicate = this._findDuplicates(gridData, ["THR_EMP_PK", "EMP_ID", "FULL_NAME", "WORK_DT"], true);
            if(duplicate && duplicate.length > 0) {
                let msg = [];
                duplicate.forEach(q => {
                    msg.push( `${q["EMP_ID"]} - ${q["FULL_NAME"]} - ${q["WORK_DT"]}` );
                });
                msg = msg.join("; ");
                this.showNotification("warning",`${msg}. ${this.$t("please_check_duplicate_data")}` , '',3000);
                return false;
            }
            

            //delete tmp;
            let _seq = new Date().getTime();
            this.dsoDeleteTemp.para = [_seq];
            const result = await this._dsoCall(this.dsoDeleteTemp, 'process', false);
            if(result && result.length > 0) { 
                // insert tmp
                this.$refs.idGridTmp.setDataSource(gridData);

                await this.wait(500);
                this.$refs.idGridTmp.onSetAll("TED_EDOC_MASTER_V2_PK", this.master.PK, false);
                this.$refs.idGridTmp.onSetAll("SEQ", _seq, false);
                this.$refs.idGridTmp.onSetAll("_rowstatus", 'i', false);
                this.dsoInsertTemp.para = [_seq];
                await this.$refs.idGridTmp.onSave(this.dsoInsertTemp, false);

                this.validateData = this.$refs.idGridTmp.getData();
                if(!(this.validateData && this.validateData.length > 0) ) return true;

                this.$refs.errorDialog.dialogIsShow = true;
            }

            return false;
        },

        async save(){
            await this.wait(500);
            this.$refs.idGrid.onSetAll("TED_EDOC_MASTER_V2_PK", this.master.PK, false);
            this.dsoDetail.para = [this.master.PK];

            return this.$refs.idGrid.onSave(this.dsoDetail, false);
        },

        
    },
}
</script>
<style >
    .cellHolCar{
        background-color: #eb8c34 !important;
    }
    .cellSunCar{
        background-color: #3bb7ff !important;
    }
</style>