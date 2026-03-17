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
        <ErrorDialog ref="errorDialog" :data="validateData" :doc_type="'04'"></ErrorDialog>

        <!-- <input type="file"  v-show="false" ref="file" @change="selectedFile"  accept=".xlsx"/>  -->
    </v-container>
</template>

<script>
import HRImport from '@/components/part/10/controls/hr_import.vue';
import EmployeeDialog from '@/components/part/10/controls/hr_employee_dialog.vue';
import ErrorDialog from '@/components/part/13/10/1310010_error_dialog.vue';

export default {
    name: 'ea-1031010-1-abs-long',
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

        dsoDeleteTemp:{
            type: 'process',
            updpro: 'ea_pro_1310010_abs_long_delete_tmp',
        },
        dsoInsertTemp: {
            type: 'grid',
            selpro: 'ea_sel_1310010_abs_long_tmp',
            updpro: 'ea_upd_1310010_abs_long_tmp',
            elname: [
                "INDEX", "PK", "THR_EMP_PK", 'EMP_ID', 'FULL_NAME',  'ABSENCE_TYPE', 'FROM_DT',  'TO_DT', 'REASON', 'REMARK', 'SEQ'
            ]
        }, 
        //FOR USER CREATED
        dsoDetail: {
            type: 'grid',
            selpro: 'ea_sel_1310010_abs_long_reg',
            updpro: 'ea_upd_1310010_abs_long_reg',
            elname: [
                "_rowstatus", 'PK', 'TED_EDOC_MASTER_V2_PK', "INDEX", "THR_EMP_PK", 'ABSENCE_TYPE', 'FROM_DT',  'TO_DT', 'REASON', 'REMARK'
            ]
        },

        //import
        imp_validate: "",
        imp_add_param: []
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

    async created() {
        this.prepareCommonData();
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
                
                { title: ("absence_type" ) , field:"ABSENCE_TYPE" , editable: true  , type: "list", datasource: { KEY: 'CODE', VALUE: 'NAME', data: this.absList }, width: 200},
                { title: ("absence_from_dt" ) , field:"FROM_DT" , editable: true  , type: "date", width: 120},
                { title: ("absence_to_dt" ) , field:"TO_DT" , editable: true  , type: "date", width: 120},
                { title: ("days" ) , field:"DAYS" , editable: false  , type: "", width: 50},
                { title: ("pay_type" ) , field:"PAY_TYPE" , editable: false  , type: "", width: 200},

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

        cellChanged(args, rowData) {
            let data = { ...rowData };
            let col = args.datafield;
            let row = args.rowindex;

            if(col == 'ABSENCE_TYPE') {
                let abs_type = this.absList.find(q => q.CODE == data["ABSENCE_TYPE"])  ;
                if(Number(abs_type.NUM1) > 0 ) {
                    this.$refs.idGrid.onSet("PAY_TYPE", this.$t('company_pay') , false, row);
                } else if(Number(abs_type.NUM2) > 0) {
                    this.$refs.idGrid.onSet("PAY_TYPE", this.$t('insurance_pay') , false, row);
                }
            }

            if(col == "FROM_DT" || col == "TO_DT") {
                let from_dt = data["FROM_DT"];
                let to_dt = data["TO_DT"];

            }
        },

        addBySelf(){
            let newData = {
                THR_EMP_PK: this.user.THR_ABEMP_PK,
                FULL_NAME: this.user.USER_NAME,
                EMP_ID: this.user.EMP_ID
            };
            this.$refs.idGrid.onAdd(newData, true);
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

            let duplicate = this._findDuplicates(gridData, ["THR_EMP_PK", "EMP_ID", "FULL_NAME", "FROM_DT", "TO_DT"], true);
            if(duplicate && duplicate.length > 0) {
                let msg = [];
                duplicate.forEach(q => {
                    msg.push( `${q["EMP_ID"]} - ${q["FULL_NAME"]}, ${q["FROM_DT"]} ~ ${q["TO_DT"]}`  );
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