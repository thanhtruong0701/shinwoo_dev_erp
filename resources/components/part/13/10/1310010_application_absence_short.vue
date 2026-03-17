<template>
    <v-container fluid class="pt-0 px-0 py-0">
        <GwGridLayout dense colsPerRow="4" percentHeight="50" @callBackHeight="gridHeight = _calculateHeight($event,81)" >
            <v-card-title colspan="4"  class="subtitle-1 primary-gradient white--text py-1">
                <span >{{ $t('detail')}}</span>
            </v-card-title>

                <v-row colspan="8"  no-gutters justify="end"  v-show="!doc_processing" >
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
        <ErrorDialog ref="errorDialog" :data="validateData" :doc_type="'03'"></ErrorDialog>

        <!-- <input type="file"  v-show="false" ref="file" @change="selectedFile"  accept=".xlsx"/>  -->
    </v-container>
</template>

<script>
import HRImport from '@/components/part/10/controls/hr_import.vue';
import EmployeeDialog from '@/components/part/10/controls/hr_employee_dialog.vue';
import ErrorDialog from '@/components/part/13/10/1310010_error_dialog.vue';
import moment from 'moment';

export default {
    name: 'ea-1031010-1-abs-short',
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
        gridHeight: null,        

        header:[],
        absList:[],
        validateData:[],

        dsoGetDateInfo:{
            type: 'process',
            updpro: 'ea_pro_1310010_abs_change_wd',
        },

        dsoDeleteTemp:{
            type: 'process',
            updpro: 'ea_pro_1310010_abs_delete_tmp',
        },
        dsoInsertTemp: {
            type: 'grid',
            selpro: 'ea_sel_1310010_abs_tmp',
            updpro: 'ea_upd_1310010_abs_tmp',
            elname: [
                "INDEX", "PK", "THR_EMP_PK", 'EMP_ID', 'FULL_NAME', 'ABSENCE_DT', 'ABSENCE_TYPE', 'ABSENCE_TIME', 'REG_FROM_DT', 'REG_FROM_TIME', 'REG_TO_DT', 'REG_TO_TIME', 'REASON', 'REMARK', 'SEQ'
            ]
        }, 
        //FOR USER CREATED
        dsoDetail: {
            type: 'grid',
            selpro: 'ea_sel_1310010_abs_reg',
            updpro: 'ea_upd_1310010_abs_reg',
            elname: [
                "_rowstatus", 'PK', 'TED_EDOC_MASTER_V2_PK', "INDEX", "THR_EMP_PK", 'ABSENCE_DT', 'ABSENCE_TYPE', 'ABSENCE_TIME', 'REG_FROM_DT', 'REG_FROM_TIME', 'REG_TO_DT', 'REG_TO_TIME', 'REASON', 'REMARK'
            ]
        },
      
        //import
        fileTemplate: 'report/13/10/tmp_1310010_import_absence_short.xlsx',
        selectedFileImport:null,
        file: null,
        fileName:'',
        rowNameMapping: 4,
        startImportRow: 5,
        startImportCol: 1,
        endImportCol: 12 //col L
    }),
    watch: {
        
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

    created() {
        //this.prepareCommonData();
    },

    methods: {
        async reset(){
            try{ 
                this.$refs.idGrid.Clear(); 
                this.prepareCommonData();
            } catch (e){
                console.log(e.message)
            }
        },

        async prepareCommonData(){
            this.absList = await this._getCommonCode('HR0003', this.user.TCO_COMPANY_PK);

            this.header=[
                { title: ("no" ) , field:"INDEX" , editable: false  , type: "", fixed: true},
                { title: ("emp_id" ) , field:"EMP_ID" , editable: false  , type: "", fixed: true},
                { title: ("full_name" ) , field:"FULL_NAME" , editable: false  , type: "", fixed: true, width: 200},

                { title: ("absence_dt" ) , field:"ABSENCE_DT" , editable: true  , type: "date"},
                { title: ("absence_type" ) , field:"ABSENCE_TYPE" , editable: true  , type: "list", datasource: { KEY: 'CODE', VALUE: 'NAME', data: this.absList }, width: 200},
                { title: ("absence_time" ) , field:"ABSENCE_TIME" , editable: true  , type: "number"},

                { title: ("reg_from_dt" ) , field:"REG_FROM_DT" , editable: true  , type: "date", group1:this.$t('register_time')},
                { title: ("reg_from_time" ) , field:"REG_FROM_TIME" , editable: true  , type: "time", group1:this.$t('register_time')},
                { title: ("reg_to_dt" ) , field:"REG_TO_DT" , editable: true  , type: "date", group1:this.$t('register_time')},
                { title: ("reg_to_time" ) , field:"REG_TO_TIME" , editable: true  , type: "time", group1:this.$t('register_time')},

                { title: ("time_in" ) , field:"TIME_IN" , editable: false  , type: "", width: 150, group1:this.$t('real_working_time')},
                { title: ("time_out" ) , field:"TIME_OUT" , editable: false  , type: "", width: 150, group1:this.$t('real_working_time')},
                { title: ("work_time" ) , field:"WORK_TIME" , editable: false  , type: "number", group1:this.$t('real_working_time')},

                { title: ("reason" ) , field:"REASON" , editable: true  , type: "", width: 200},
                { title: ("remark" ) , field:"REMARK" , editable: true  , type: "", width: 200},

                { title: ("seq" ) , field:"SEQ" , editable: false  , type: "", hidden: true},
            ];
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

            if(col == 'ABSENCE_DT') {
                try{
                    this.dsoGetDateInfo.para = [data.THR_EMP_PK, data.ABSENCE_DT.replace(/[^0-9]+/g, "")];
                    const result = await this._dsoCall(this.dsoGetDateInfo, 'process', false)
                    if(result && result.length > 0) {
                        const rtn = result[0];
                        this.$refs.idGrid.onSet("REG_FROM_TIME", rtn.REG_FROM_TIME, false, row);
                        this.$refs.idGrid.onSet("REG_TO_TIME", rtn.REG_TO_TIME, false, row);
                        this.$refs.idGrid.onSet("REG_FROM_DT", rtn.REG_FROM_DT, false, row);
                        this.$refs.idGrid.onSet("REG_TO_DT", rtn.REG_TO_DT, false, row);
                        this.$refs.idGrid.onSet("ABSENCE_TIME", rtn.ABSENCE_TIME, false, row);
                        this.$refs.idGrid.onSet("TIME_IN", rtn.TIME_IN, false, row);
                        this.$refs.idGrid.onSet("TIME_OUT", rtn.TIME_OUT, false, row);
                        this.$refs.idGrid.onSet("WORK_TIME", rtn.WORK_TIME, false, row);
                    }
                } catch{}
                
            }
        },

        addBySelf(){
            let newData = {
                THR_EMP_PK: this.user.THR_ABEMP_PK,
                FULL_NAME: this.user.USER_NAME,
                EMP_ID: this.user.EMP_ID
            };
            this.$refs.idGrid.onAdd(newData, true);
            this.$refs.idGrid.onSet("ABSENCE_DT", moment().format('YYYYMMDD'), false, this.$refs.idGrid.getData().length-1 );
            this.$refs.idGrid.onSet("ABSENCE_TYPE", '01', false, this.$refs.idGrid.getData().length-1 );

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

            this.$refs.idGrid.onSetAll("ABSENCE_DT", moment().format('YYYYMMDD'));
            this.$refs.idGrid.onSetAll("ABSENCE_TYPE", '01' );

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

            let duplicate = this._findDuplicates(gridData, ["THR_EMP_PK", "EMP_ID", "FULL_NAME", "ABSENCE_DT"], true);
            if(duplicate && duplicate.length > 0) {
                let msg = [];
                duplicate.forEach(q => {
                    msg.push( `${q["EMP_ID"]} - ${q["FULL_NAME"]} - ${q["ABSENCE_DT"]}` );
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

        
        //==================================================================================
        //IMPORT EXCEL TO GRID
        /*async downloadTemplate(){
            const res = await this.$axios.$get( "/dso/getfiletemplate2",  { responseType: "blob", params: {path: this.fileTemplate } } );
            if(res) {
                this._ExcelSaveAs(res, 'template.xlsx');
            }
        },
        selectedFile(event){
            const files = event.target.files;
            if(files[0] !== undefined) {
                const fr = new FileReader ();
                fr.readAsDataURL(files[0]);
                fr.addEventListener('load', () => {
                    this.file = fr.result;
                    this.fileName = files[0].name;
                });
            } 
        },

        async importData(){
            let exceljs =  require("@/plugins/exceljs.js");
            let datas = [];
            if(!!exceljs) {
                exceljs = exceljs.default;
            }
            try {
                await exceljs.readFile(this, this.file, "BASE64");
                let worksheet = exceljs.worksheet();
                let colMapping = [];
                
                if(!!!worksheet) {
                    this.showNotification("warning", this.$t("cannot_read_file"), '');
                    return;
                }

                const sheetModel = worksheet.model;
                for(let i = this.rowNameMapping; i <= sheetModel.rows.length; i++) {
                    let row = worksheet.getRow(i);
                    if(i == this.rowNameMapping) {
                        colMapping = [...row.values]; 
                        continue;
                    }

                    if(i >= this.startImportRow) {
                        let rowData = {};
                        for(let colIdx = this.startImportCol; colIdx <= this.endImportCol; colIdx++) {
                            let cell = row.getCell(colIdx);
                            let cellValue = (cell.value ? cell.value : "");

                            rowData[colMapping[colIdx]] = cellValue;
                        }
                        datas.push(rowData);
                    }
                }

                this.$refs.idGrid.onAdds(datas, true);

            }catch{
                this.showNotification("warning", this.$t("cannot_read_file"), '');
            }
        },*/
        //==================================================================================
        
    },
}
</script>