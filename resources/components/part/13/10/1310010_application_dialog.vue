<template>
    <v-dialog id="ea-1031010-1" max-width="1400" v-model="dialogIsShow" persistent>
        <v-card light :width="1400" >
            <v-card-title class="headline primary-gradient white--text py-2 px-2">
                <span>{{ !!!master.PK ? $t("register_application") : `${master.DOC_NO} (${$t('due_date')}: ${master.DUE_DATE_STRING})` }}</span>
                <v-spacer></v-spacer>
                <BaseButton :icon_color="'white'" btn_type="icon" icon_type="close_dialog" mdi-icon="mdi-close-thick" :btn_text="$t('close')" @onclick="dialogIsShow = false"  />
            </v-card-title>
            <GwGridLayout :forDialog="true" dense colsPerRow="4" percentHeight="80" @callBackHeight="gridHeight = _calculateHeight($event,80)" align="start">
                <GwFlexBox colspan="4"  class="flex-column" justify="end" >
                    <BaseSelect colspan="2" class="py-1" :outlined="true" :label="$t('application_type')" v-model="master.DOC_TYPE" :lstData="lstDocType" item-text="NAME" item-value="CODE"  v-bind:disabled.sync="isDisabledAppType" />
                    <BaseInput  colspan="2" class="pb-1" :outlined="true" :clearable="false"  :label="$t('title')" v-model="master.TITLE" :readonly="doc_processing"></BaseInput>
                    <BaseTextarea colspan="4" class="pb-1" :outlined="true" :label="$t('remark')" rows="6" v-model="master.REMARK" no-resize :readonly="doc_processing">  </BaseTextarea>
                </GwFlexBox>

                <GwFlexBox colspan="8"  class="flex-column" justify="end" >
                    <v-row no-gutters  justify="end" class="py-1" >

                        <!-- <BaseButton icon_type="cancel" :btn_text="$t('reject')" :disabled="isProcessing" v-if="master.REJECT_YN == 'Y'" @onclick=" strConfirm='REJECT'; onProcessConfirm('REJECT',docConfirm) "/>
                        <BaseButton icon_type="confirm" :btn_text="$t('confirm')" :disabled="isProcessing" v-if="master.CONFIRM_YN == 'Y'" @onclick=" strConfirm='CONFIRM'; onProcessConfirm('CONFIRM',docConfirm) "/> -->

                        <BaseButton icon_type="cancel" :btn_text="$t('cancel')" :disabled="isProcessing" v-if="master.CANCEL_YN == 'Y'" @onclick=" strConfirm='CANCEL'; onProcessConfirm('CANCEL',docConfirm) "/>
                        <BaseButton icon_type="confirm" :btn_text="$t('submit')" :disabled="isProcessing" v-if="master.SUBMIT_YN == 'Y'" @onclick=" strConfirm='SUBMIT'; onProcessConfirm('SUBMIT',docConfirm) "/>
                        <BaseButton icon_type="save" :btn_text="$t('save')" :disabled="isProcessing" @onclick="onProcessConfirm('SAVE',saveMaster)"  v-if="master.SAVE_YN == 'Y'"/>
                        <BaseButton icon_type="delete" :btn_text="$t('delete')" :disabled="isProcessing" @onclick="onProcessConfirm('DELETE',deleteDoc)"  v-if="master.DELETE_YN == 'Y'"/>
                    </v-row>
                    <v-divider colspan="12" class="mt-2"></v-divider>
                    <v-row no-gutters justify="end" class="pb-1" v-show="!doc_processing">
                        <BaseButton btn_type="icon" icon_type="add" :btn_text="$t('add')" :disabled="isProcessing" @onclick="openEmployeeDialog"/>
                        <BaseButton btn_type="icon" icon_type="delete" :btn_text="$t('delete')" :disabled="isProcessing" @onclick="deleteApproveLine"/>
                        <BaseButton btn_type="icon" icon_type="undelete" :btn_text="$t('un_delete')" :disabled="isProcessing" @onclick="undeleteApproveLine"/>
                    </v-row>

                    <BaseGridView :headertype="1" ref='idGridApprove'  colspan="12" class="my-1"
                        :height="190" :header="headerApproveLine"
                    ></BaseGridView>
                </GwFlexBox>

                <Overtime ref="app_ot" :master="master" colspan="12" v-if="master.DOC_TYPE=='01'" :id="'detail_'+detailKey"></Overtime>
                <Incorrect ref="app_inc" :master="master" colspan="12" v-if="master.DOC_TYPE=='02'" :id="'detail_'+detailKey"></Incorrect>
                <AbsenceShort ref="app_abs" :master="master" colspan="12" v-if="master.DOC_TYPE=='03'" :id="'detail_'+detailKey"></AbsenceShort>
                <AbsenceLong ref="app_abs_long" :master="master" colspan="12" v-if="master.DOC_TYPE=='04'" :id="'detail_'+detailKey"></AbsenceLong>
            </GwGridLayout>
        </v-card>

        <employee-dialog ref="employeeDialog" @closeEmployeeDialog="employeeDialog = false" @callBack="addApproveLine" :multiSelectMode="true"></employee-dialog>
    </v-dialog>
</template>

<script>
import moment from 'moment';
import EmployeeDialog from '@/components/part/10/controls/hr_employee_dialog.vue';

import Overtime from '@/components/part/13/10/1310010_application_overtime.vue';
import Incorrect from '@/components/part/13/10/1310010_application_incorrect_time.vue';
import AbsenceShort from '@/components/part/13/10/1310010_application_absence_short.vue';
import AbsenceLong from '@/components/part/13/10/1310010_application_absence_long.vue';

export default {
    name: 'ea-1031010-1',

    props: {
        pk: {
            type: Number,
            default: null
        },
    },

    components: { 
        AbsenceShort,
        Overtime,
        Incorrect,
        AbsenceLong,
        'employee-dialog':EmployeeDialog,
    },
    

    data: () => ({
        dialogIsShow: false,
        selectedCompany:null,
        gridHeight: 0,
        detailKey:null,
        strConfirm:'',

        lstDocType:[],
        headerApproveLine:[],

        master:{ },
        master_param: ["_rowstatus", "PK", "DOC_TYPE", "DOC_NO", "TITLE", "DUE_DATE","CRT_DT", "REMARK"],

        dsoDocSetting:{
            type: 'process',
            updpro: 'ea_pro_1310010_doc_setup',
        },

        dsoDocAction:{
            type: 'process',
            updpro: 'ea_pro_1310010_doc_action',
        },

        dsoDeleteDoc:{
            type: 'process',
            updpro: 'ea_pro_1310010_doc_delete',
        },

        dsoDocConfirm:{
            type: 'process',
            updpro: 'ea_pro_1310010_doc_confirm',
        },

        dsoMaster:{
            type: 'control',
            selpro: 'ea_sel_1310010_doc_master',
            updpro: 'ea_upd_1310010_doc_master',
        },

        dsoApproveLine:{
            type: 'grid',
            selpro: 'ea_sel_1310010_approve_line',
            updpro: 'ea_upd_1310010_approve_line',
            elname: [
                "_rowstatus", "PK", "TED_EDOC_MASTER_V2_PK", "INDEX", "THR_EMP_PK"
            ]
        },
        
        dsoClearApproveLine:{
            type: 'process',
            updpro: 'ea_pro_1310010_clear_app_line',
        },
    }),

    watch: {
        dialogIsShow(val) {
            if (val === false) {
                this.$emit('onCloseDialog')
            } else {
                this.onLoad();
            }
        }
    },

    computed:
    {
        user: function()
        {
            return this.$store.getters["auth/user"];
        },
        isDisabledAppType(){
            return !!this.master.PK;
        },
        detailGrid(){
            let _detailGrid = null;

            switch(this.master.DOC_TYPE) {
                case '01' : try{ _detailGrid = this.$refs.app_ot; }catch{} break;
                case '02' : try{ _detailGrid = this.$refs.app_inc; }catch{} break;
                case '03' : try{ _detailGrid = this.$refs.app_abs; }catch{} break;
                case '04' : try{ _detailGrid = this.$refs.app_abs_long; }catch{} break;
                case '05' : break;
                case '06' : break;
                case '07' : break;
                case '08' : break;
                case '09' : break;
                case '10' : break;
                default: _detailGrid = null; break;
            }
            return _detailGrid;
        },
        doc_processing(){
            if(this.master) return this.master.PROCESSING_YN == 'Y';
            else return false;
        }
    },

    async created() {
        this.prepareCommonData();
    },

    methods: {
        async onLoad() {
            try  {
                await this.$nextTick(async () => {
                    this.initObject();
                    this.$refs.idGridApprove.Clear();
                    if(this.pk != null) {
                        await this.loadApplication();
                    } else {
                        await this.createApplication();
                    }
                });
            }catch(e) {  }
        },

        initObject(){
            let that = this;
            this.master = this._initObject(this.master_param);
            this.master.REMARK = "";
            this.master.TITLE = "";
            this.master.PK = null;
            this.master.DOC_TYPE = '03';
            this.master.CRT_DT = null;
            this.master.DUE_DATE = moment().format("YYYYMMDD");

            this.master.SAVE_YN = 'Y';
            this.master.SUBMIT_YN = 'N';
            this.master.CANCEL_YN = 'N';
            this.master.DELETE_YN = 'N';

            this.master.CONFIRM_YN = 'N';
            this.master.REJECT_YN = 'N';

            this.master.FINAL_CONFIRM_YN = 'N';
            this.master.FINAL_REJECT_YN = 'N';

            this.master.USER_TYPE = 'APPLICANT';
        },

        async prepareCommonData(){
            this.lstDocType = await this._getDocType();
            this.headerApproveLine = [
                { title: ("app_line" ) , field:"INDEX" , editable: false  , type: "", fixed: true},
                { title: ("emp_id" ) , field:"EMP_ID" , editable: false  , type: "", fixed: true},
                { title: ("full_name" ) , field:"FULL_NAME" , editable: false  , type: "", fixed: true, width: 200},
                { title: ("pos_type" ) , field:"POS_TYPE" , editable: false  , type: ""},
                { title: ("email" ) , field:"EMAIL" , editable: false  , type: "", width: 300},
            ];
        },

        openEmployeeDialog(){
            this.$refs.employeeDialog.dialogIsShow = true;
        },

        resetDetail(){
            setTimeout(() => {
                this.detailGrid.reset();
            }, 500);
        },
        

        async createApplication(){
            this.resetDetail();
            await this.loadDocSetting();
            await this.loadApproveLine();
            
           
        },

        async loadApplication(){
            this.resetDetail();

            this.dsoMaster.para = [this.pk];

            this.master = await this._dsoCall(this.dsoMaster, 'select', false);

            await this.loadApproveLine();
            
            await this.detailGrid.load();
            
            await this.loadDocAction();
        },

        async loadDocSetting(){
            this.dsoDocSetting.para = [this.master.DOC_TYPE];
            const result = await this._dsoCall(this.dsoDocSetting, 'process', false)
            if(result) {
                const rtn = result[0];
                this.master.DUE_DATE = rtn.DUE_DATE;
            }
        },

        async loadDocAction(){
            this.dsoDocAction.para = [this.master.PK];
            const result = await this._dsoCall(this.dsoDocAction, 'process', false)
            if(result) {
                const rtn = result[0];

            }
        },
        

        //============================================================================
        //APPROVE LINE
        async loadApproveLine(){
            this.dsoApproveLine.para = [this.master.PK, this.user.THR_ABEMP_PK];
            await this.$refs.idGridApprove.onSearch(this.dsoApproveLine);

            if(!this.master.PK || this.master.PK <=0 ) {
                //set status insert cho lan dau load manager
                this.$refs.idGridApprove.onSetAll("_rowstatus", 'i', false);
            }
        },

        addApproveLine(data){
            if(!!!data) return;

            let datas = [];

            if(Array.isArray(data)) {
                datas = [...data];
            } else {
                datas = [data];
            }

            let griddatas = this.$refs.idGridApprove.getData();
            let pks = griddatas.map(q => { return q.THR_EMP_PK});
            pks = pks ? pks : [];

            for(let i = 0; i< datas.length; i++) {
                let data = datas[i];
                if(pks.findIndex(w => w == data.THR_EMP_PK) ) {
                    this.showNotification("warning", `${data.EMP_ID} - ${data.FULL_NAME}: ` + this.$t("already_exist"), '');
                    return;
                }
            }

            this.$refs.idGridApprove.onAdds(datas, true);
            this.updateApproveLineNo();
        },

        deleteApproveLine(){
            this.$refs.idGridApprove.onSetMarkedDelete(true);
            this.updateApproveLineNo();
        },

        undeleteApproveLine(){
            this.$refs.idGridApprove.onSetMarkedDelete(false);
            this.updateApproveLineNo();
        },

        updateApproveLineNo(){
            this.updateGridIndexNo(this.$refs.idGridApprove);
        },

        async saveApproveLine(){
            let gridData = this.$refs.idGridApprove.getData();
            let updateData = gridData.filter(q => q["_rowstatus"] == 'i' || q["_rowstatus"] == 'u' || q["_rowstatus"] == 'd' ) ;
            if(updateData && updateData.length <= 0) return ;//ko can update approve line


            this.dsoClearApproveLine.para = [this.master.PK];
            const result = await this._dsoCall(this.dsoClearApproveLine, 'process', false);

            if(result) {
                this.$refs.idGridApprove.onSetAll("TED_EDOC_MASTER_V2_PK", this.master.PK, false);
                let datas = this.$refs.idGridApprove.getData();
                for(let i = 0; i< datas.length; i++) {
                    let data = datas[i];
                    if(data._rowstatus != 'd') {
                        this.$refs.idGridApprove.onSet("_rowstatus", 'i', true, i);
                    } 
                }

                this.dsoApproveLine.para = [this.master.PK, this.user.THR_ABEMP_PK];
                await this.$refs.idGridApprove.onSave(this.dsoApproveLine, false);
                this.updateApproveLineNo();
            }

        },

        //============================================================================


        //============================================================================
        //MASTER
        validateMaster(){
            let b = true;
            let approveLines = this.$refs.idGridApprove.getData();
            approveLines = approveLines ? approveLines : [];
            if( this.master.TITLE == "" ||this.master.TITLE == null ) {
                this.showNotification("warning", this.$t("please_input_title"), '');
                b= false;
            }

            if(approveLines.length <= 0 || approveLines.filter(q => q._rowstatus != 'd').length <=0) {
                this.showNotification("warning", this.$t("please_select_approve_line"), '');
                b= false;
            }

            return b;
        },

        async saveMaster(){
            this.isProcessing = true;

            try{
                

                //validate detail
                let isValidDetail = await this.detailGrid.validate();
                if(!isValidDetail) return;

                if(this.master._rowstatus !=='i' && this.master._rowstatus !=='d'){
                    this.master._rowstatus = 'u';
                }
                
                if(this.validateMaster()){
                    this.dsoMaster.para = [this.master.PK];
                    this.dsoMaster.elname = this.master_param;
                    this.dsoMaster.data = this.master;

                    const result = await this._dsoCall(this.dsoMaster, 'update', false);
                    if(result) {
                        this.master = result;

                        await this.saveApproveLine();
                        await this.detailGrid.save();

                        this.showNotification("success", this.$t("update_success"), '');
                    }
                }
            }catch{

            }finally{
                await this.docAction();
                this.isProcessing = false;
            }
        },

        async deleteDoc(){
            this.dsoDeleteDoc.para = [this.master.PK, this.master.DOC_TYPE];
            const result = await this._dsoCall(this.dsoDeleteDoc, 'process', true);

            this.dialogIsShow = false;
        },

        async docAction(){
            this.dsoDocAction.para = [this.master.PK];
            const result = await this._dsoCall(this.dsoDocAction, 'process', false);

            if(result && result.length > 0) {
                let rtn = result[0];
                this.master.SAVE_YN  = rtn["SAVE_YN"];
                this.master.DELETE_YN  = rtn["DELETE_YN"]; ;
                this.master.SUBMIT_YN  = rtn["SUBMIT_YN"]; ;
                this.master.CANCEL_YN  = rtn["CANCEL_YN"]; ;
            }
        },

        async docConfirm(){

            switch(this.strConfirm){
                // case 'CONFIRM':
                // case 'REJECT': {//manager action
                //     await this.detailGrid.confirm(this.strConfirm);
                //     break;
                // }
                case 'SUBMIT':
                case 'CANCEL' : { //user action
                    this.dsoDocConfirm.para = [this.master.PK, this.master.DOC_TYPE, this.strConfirm];
                    const result = await this._dsoCall(this.dsoDocConfirm, 'process', true);
                    break;
                }
                default:{

                    break;
                }
            }

            await this.docAction();
            this.strConfirm = '';
        },

        //============================================================================
        
    },
}
</script>
