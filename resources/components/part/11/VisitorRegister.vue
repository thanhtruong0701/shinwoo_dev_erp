<template>
<v-dialog id="vs-register" max-width="1200" height="800" v-model="dialogIsShow">
  <v-card>
    <v-card-title class="headline primary-gradient white--text py-2 px-1" >
      <v-row no-gutters>
          {{ data.PK && data.PK > 0 ? data.VISIT_NO : $t("visitor_register") }}
        <v-spacer></v-spacer>
        <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
      </v-row>
			
    </v-card-title>
    <v-card-text>

         <v-row no-gutters>
            <v-spacer></v-spacer>
            <BaseButton btn_type="icon" icon_type="save" :btn_text="$t('save')"      @onclick="onProcessConfirm('SAVE')" v-bind:disabled.sync="isProcessing" />
            <BaseButton btn_type="icon" icon_type="delete" :btn_text="$t('delete')"      @onclick="onProcessConfirm('DELETE')" v-bind:disabled.sync="isProcessing" />
        </v-row>
<v-form lazy-validation ref="entryForm" v-model="formIsValid">
        <v-row no-gutters>
            <v-col cols="12" lg="4">
                <DataGridView 
                    select_mode="Single" 
                    ref="grdEmpPhoto" 
                    :max_height="220" 
                    sel_procedure="VS_SEL_1110020_PHOTO_NOCACHE"
                    :filter_paras="[
                            this.data.TVS_VISITOR_PK,
                    ]"
                    :update_paras="[
                        'SEQ',
                        'PHOTO_PK',
                        'TVS_VISITOR_PK'
                    ]"
                    :imageBlobSize="100"
                    :header="[
                        {   dataField: 'SEQ',  caption: $t('seq'),  allowEditing: false  },
                        { dataField: 'TYPE',  caption: this.$t('type'), allowEditing: false, },
                        { dataField: 'PHOTO', caption: this.$t('photo'),  allowEditing: false, dataType: 'imageBlob', cssClass: 'text-center' },
                    ]"
                />
            </v-col>
            <v-col cols="12" lg="8">
                
                <v-row no-gutters class="pb-1"> 
                    <v-col cols="12" lg="6" class="px-1">
                        <v-row no-gutters  >
                            <BaseButton btn_type="icon" icon_type="menu" :btn_text="$t('visitor_list')"  @onclick="openVisitorList" />
                            <v-spacer></v-spacer>
                            <BaseInput :outlined="true" :label="$t('visitor_id')" v-model="data.VISITOR_ID" class="white" style="width: 80%!important" readonly :rules="validationRule.nameRules" />
                        </v-row>
                        
                    </v-col>
                    <v-col cols="12" lg="6" class="px-1">
                        <BaseSelect :label="$t('COMPANY')" :outlined="true" v-model="data.TVS_COMPANY_PK" :lstData="companySelectList"  item-text="NAME" item-value="PK" readonly />
                    </v-col>
                </v-row>

                <v-row no-gutters class="pb-1"> 
                    <v-col cols="12" lg="6" class="px-1">
                        <BaseInput :outlined="true" :label="$t('visitor_name')" v-model="data.VISITOR_NAME" class="white mx-0" readonly/>
                        
                    </v-col>
                    <v-col cols="12" lg="6" class="px-1">
                        <BaseInput :outlined="true" :label="$t('position')" v-model="data.POSITION" class="white" readonly />
                    </v-col>
                </v-row>
                <v-row no-gutters class="pb-1"> 
                    <v-col cols="12" lg="6" class="px-1">
                        <BaseInput :outlined="true" :label="$t('person_id')" v-model="data.PERSONAL_ID" class="white" readonly />
                    </v-col>
                    <v-col cols="12" lg="6" class="px-1">
                        <BaseSelect :label="$t('gender')" :outlined="true" v-model="data.SEX" :lstData="genderList"  item-text="NAME" item-value="CODE" readonly />
                    </v-col>
                </v-row>

                <v-row no-gutters class="pb-1"> 
                    <v-col cols="12" lg="6" class="px-1">
                        <BaseInput :outlined="true" :label="$t('tel')" v-model="data.TEL" class="white"  readonly/>
                    </v-col>
                    <v-col cols="12" lg="6" class="px-1">
                        <BaseInput :outlined="true" :label="$t('email')" v-model="data.EMAIL" class="white"  readonly/>
                    </v-col>
                </v-row>
                
                <v-row no-gutters class="pb-1" align="center" justify="center"> 
                    <v-col cols="12" lg="6" class="px-0">
                        <v-row no-gutters>
                            <v-col cols="12" lg="6" class="px-1">
                                <BaseSelect :label="$t('vaccine_status')" :outlined="true" v-model="data.VACCINE_STATUS" :lstData="vaccineStatusList"  item-text="NAME" item-value="CODE" readonly /> 
                            </v-col>
                            <v-col cols="12" lg="6" class="px-1">
                                <BaseSelect :label="$t('vaccine_type')" :outlined="true" v-model="data.VACCINE_TYPE" :lstData="vaccineTypeList"  item-text="NAME" item-value="CODE" readonly />
                            </v-col>
                        </v-row>
                    </v-col>
                    <v-col cols="12" lg="6" class="px-0">
                        <v-row no-gutters align="center" justify="center" >
                            <v-col cols="12" lg="6" class="px-1">
                                <BaseSelect :label="$t('pcr_last')" :outlined="true" v-model="data.PCR_STATUS" :lstData="pcrStatusList"  item-text="NAME" item-value="CODE" readonly /> 
                            </v-col>
                            <v-col cols="12" lg="6" class="px-1">
                                <BaseDatePicker v-model="data.PCR_EXPIRE_DT" outlined  :label="$t('PCR_EXPIRE_DT')" null class="px-0" readonly></BaseDatePicker>
                            </v-col>
                            <!-- <v-col cols="12" lg="4" class="px-1">
                                <v-row no-gutters>
                                    <BaseButton btn_type="text" icon_type="pcr" :btn_text="$t('pcr_history')"  @onclick="onPCRHistory" v-bind:disabled.sync="isProcessing"  />
                                </v-row>
                            </v-col> -->
                            
                        </v-row>
                    </v-col>
                </v-row>

            </v-col>
        </v-row>

        <v-row no-gutters class="py-1">
            <v-col cols="12">
                <v-card-title class="subtitle-1 primary-gradient white--text py-0" >
                    {{$t("contact_infomation")}}
                </v-card-title>
            </v-col>
            
        </v-row>

        <v-row no-gutters class="pt-1">
            
            <v-col cols="12" lg="4"> 
                <v-row no-gutters  >
                    <BaseButton btn_type="icon" icon_type="menu" :btn_text="$t('contact_list')"  @onclick="openContactList" />
                    <v-spacer></v-spacer>
                    <BaseInput :outlined="true" :label="$t('contact_to')" v-model="data.CONTACT_TO" class="white"  style="width: 80%!important" readonly :rules="validationRule.nameRules" />
                </v-row>
            </v-col>
            <v-col cols="12" lg="4" class="px-0">
                <v-row no-gutters > 
                    <v-col cols="12" lg="6" class="px-1">
                        <BaseInput :outlined="true" :label="$t('contact_dept')" v-model="data.CONTACT_DEPT" class="white" readonly />
                    </v-col>
                    <v-col cols="12" lg="6" class="px-1">
                        <BaseInput :outlined="true" :label="$t('contact_position')" v-model="data.CONTACT_POSITION" class="white" readonly />
                    </v-col>
                </v-row>
                
            </v-col>
            <v-col cols="12" lg="4"  class="px-0">
                <v-row no-gutters > 
                    <v-col cols="12" lg="6" class="px-1">
                        <BaseInput :outlined="true" :label="$t('total_visitor')" v-model="data.TOTAL_VISITOR" number  />
                    </v-col>
                    <v-col cols="12" lg="6" class="px-1">
                        <DxDateBox  type="datetime" label="request_time" labelMode="floating" :placeholder="$t('request_date')" ref="regTime" v-model="data.REQ_TIME_SHOW" >
                            <DxValidator>
                                <DxRequiredRule :message="$t('request_time_required')"/>
                            </DxValidator>
                        </DxDateBox>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>

        <v-row no-gutters class="pt-1">
            <v-col cols="12" lg="6" class="px-1">
                <BaseTextarea :outlined="true" :label="$t('reason')" rows="3" v-model="data.CONTACT_REASON" no-resize style="width: 100%!important" />
            </v-col>
            <v-col cols="12" lg="6" class="px-1">
                <BaseTextarea :outlined="true" :label="$t('remark')" rows="3" v-model="data.REMARK" no-resize style="width: 100%!important" />
            </v-col>
            
        </v-row>

        <v-row no-gutters class="pt-1" align="center" justify="center">
            <v-col cols="12" lg="4" class="px-1">
                <DxDateBox  type="datetime" label="checkin_time" labelMode="floating" :placeholder="$t('checkin_time')" v-model="data.CHECKIN_TIME_SHOW" />
            </v-col>
            <v-col cols="12" lg="1" class="px-1">
                <v-row no-gutters>
                    <BaseButton btn_type="text" icon_type="checkin" :btn_text="$t('checkin')"   v-bind:disabled.sync="isProcessing"  @onclick="onCheckin"/>
                </v-row>
            </v-col>
            <v-col cols="12" lg="1" class="px-1">
                <v-row no-gutters>
                    <BaseButton btn_type="text" icon_type="checkin" :btn_text="$t('from_log')"   v-bind:disabled.sync="isProcessing" @onclick="getFromLog('IN')" />
                </v-row>
            </v-col>
            <v-col cols="12" lg="4" class="px-1">
                <DxDateBox  type="datetime" label="checkout_time" labelMode="floating" :placeholder="$t('checkout_time')" v-model="data.CHECKOUT_TIME_SHOW"/>
            </v-col>
            <v-col cols="12" lg="1" class="px-1">
                <v-row no-gutters>
                    <BaseButton btn_type="text" icon_type="checkout" :btn_text="$t('checkout')"   v-bind:disabled.sync="isProcessing" @onclick="onCheckout" />
                </v-row>
            </v-col>
            <v-col cols="12" lg="1" class="px-1">
                <v-row no-gutters>
                    <BaseButton btn_type="text" icon_type="checkout" :btn_text="$t('from_log')"   v-bind:disabled.sync="isProcessing"  @onclick="getFromLog('OUT')" />
                </v-row>
            </v-col>
            
        </v-row>
</v-form>   
    </v-card-text>
  </v-card>
  <VisitorDialog ref="visitorDialog" @callback="callbackVisitor"></VisitorDialog>
  <EmployeeDialog ref="employeeDialog" @closeEmployeeDialog="employeeDialog = false" @callBackData="callbackEmp" :multiSelectMode="false"></EmployeeDialog>
  <TerminalGuestLog ref="guestLog" @callBack="onSelectedTerPic" :guest_id="data.VISITOR_ID"></TerminalGuestLog>
</v-dialog>
</template>

<script>
    import HRBasicGrid from '@/components/part/10/controls/hr_grid.vue';
    import VisitorDialog from '@/components/part/11/VisitorDialog.vue';
    import TerminalGuestLog from '@/components/part/11/TerminalGuestLog.vue';
    import EmployeeDialog from '@/components/dialog/EmployeeDialog';
    import moment from "moment";
    import Swal from 'sweetalert2/dist/sweetalert2.js'
    import 'sweetalert2/src/sweetalert2.scss'

  export default {
    name: 'vs-register',

    components: { 
      'hr-grid' :HRBasicGrid 
      , VisitorDialog
      ,EmployeeDialog
      ,TerminalGuestLog
    },

    props: {
      pk: {
        type: Number,
        default: 0
      }
    },

    data: () => ({
      dialogIsShow: false,
      formIsValid: false,
      data:{},
      params:[],
      paramSave:[],

      companySelectList:[],
      genderList:[],
      vaccineStatusList:[],
      vaccineTypeList:[],
      pcrStatusList:[],

      checkTarget:null,
    }),

    watch: {
      dialogIsShow(val) {
        if (val === false) {
          this.$emit('onCloseDialog')
        } else {
          this.onLoad();
        }
      },
      'data.CHECKIN_TIME_SHOW': function(val) {
          if(val) {
            this.data.CHECKIN_TIME = moment(val).format("YYYYMMDDHH:mm");
          }
      },
      'data.CHECKOUT_TIME_SHOW': function(val) {
          if(val) {
            this.data.CHECKOUT_TIME = moment(val).format("YYYYMMDDHH:mm");
          }
      },
      'data.REQ_TIME_SHOW': function(val) {
          if(val) {
            this.data.REQ_TIME = moment(val).format("YYYYMMDDHH:mm");
          }
      }
    },

    computed:
    {
      user: function()
      {
          return this.$store.getters["auth/user"];
      },
      limitHeight() { return 600; },
      headerQQ() {
        return [
           
        ];
      }
    },


    methods: {
        initOject(){
            this.params = [ 
                "_rowstatus", "PK", "VISIT_NO", "TVS_VISITOR_PK", "THR_EMP_PK", "CONTACT_TO", "CONTACT_DEPT", "CONTACT_POSITION", "CONTACT_REASON"
                , "CHECKIN_DT", "CHECKIN_TIME", "CHECKOUT_DT", "CHECKOUT_TIME", "CHECKIN_BY", "CHECKOUT_BY"
                , "REQ_TIME", "TOTAL_VISITOR", "REMARK"
                , "VISITOR_ID", "VISITOR_NAME", "TVS_COMPANY_PK", "POSITION", "PERSONAL_ID", "SEX", "TEL", "EMAIL", "VACCINE_STATUS", "VACCINE_TYPE"
                , "PCR_STATUS", "PCR_EXPIRE_DT"
                , "CHECKIN_TIME_SHOW", "CHECKOUT_TIME_SHOW", "REQ_TIME_SHOW"
            ] ;

            this.paramSave = [
                "_rowstatus", "PK", "TVS_VISITOR_PK", "THR_EMP_PK", "CONTACT_TO", "CONTACT_DEPT", "CONTACT_POSITION", "CONTACT_REASON"
                , "CHECKIN_TIME", "CHECKOUT_TIME", "REQ_TIME", "TOTAL_VISITOR", "REMARK"
            ]

            this.data = this._initObject(this.params);

            this.data.TOTAL_VISITOR = 1;
        },

        async onLoad() {
          try
          {
            setTimeout(() => {
              this.$nextTick(async () => {
                this.initOject();
                this.getListCompany();
                let parentCodes = [
                    "HR0009", "HR0007", "HR0255", "HR0256", "HR0257"
                ] ;
                let listCommonCode = await this._getCommonCode2( parentCodes,  this.user.TCO_COMPANY_PK  );

                this.genderList = listCommonCode[1];
                this.vaccineStatusList = listCommonCode[2];
                this.vaccineStatusList.unshift( { CODE: ' ' , NAME: " " } );

                this.vaccineTypeList = listCommonCode[3];
                this.vaccineTypeList.unshift( { CODE: ' ' , NAME: " " } )

                this.pcrStatusList = listCommonCode[4];
                this.pcrStatusList.unshift( { CODE: ' ' , NAME: " " } )

                await this.$refs.grdEmpPhoto.Clear();

                if(this.pk && this.pk > 0) {
                    this.data.PK = this.pk;
                    this.onSearch();
                }
              });
            }, 100);
          }catch(e) {
          }
        },

        async getListCompany() {
            const dso2 = {
                type: 'grid',
                selpro: 'VS_sel_1110020_sel_comp',
                para: null,
            }

            const result2 = await this._dsoCall(dso2, 'select', false)

            if(result2) {
                this.companySelectList = result2;
                this.companySelectList.unshift({ PK:0, NAME:this.$t(" ") })
            } 
        },

        async onPCRHistory(){

        },

        openVisitorList(){
            this.$refs.visitorDialog.dialogIsShow = true;
        },

        async callbackVisitor(data) {
            this.data.TVS_VISITOR_PK= data.PK;
            this.data.VISITOR_ID= data.VISITOR_ID;
            this.data.VISITOR_NAME= data.VISITOR_NAME;
            this.data.TVS_COMPANY_PK= data.TVS_COMPANY_PK;
            this.data.POSITION= data.POSITION;
            this.data.PERSONAL_ID= data.PERSONAL_ID;
            this.data.SEX= data.SEX;
            this.data.TEL= data.TEL;
            this.data.EMAIL= data.EMAIL;
            this.data.VACCINE_STATUS= data.VACCINE_STATUS;
            this.data.VACCINE_TYPE= data.VACCINE_TYPE;
            this.data.PCR_STATUS= data.PCR_STATUS;
            this.data.PCR_EXPIRE_DT= data.PCR_EXPIRE_DT;


            await this.$refs.grdEmpPhoto.loadData();
        },

        openContactList(){
            this.$refs.employeeDialog.dialogIsShow = true;
        },
        
        async callbackEmp(data){
            

            this.data.THR_EMP_PK = data.PK;
            this.data.CONTACT_TO = `${data.EMP_ID} - ${data.FULL_NAME}`;
            this.data.CONTACT_DEPT = data.ORG_NM;
            this.data.CONTACT_POSITION = data.POS_TYPE;
        },

        onCheckin(){
            this.data.CHECKIN_TIME_SHOW =  Date.now();
        },

        onCheckout(){
            this.data.CHECKOUT_TIME_SHOW =  Date.now();
        },


        async onProcessConfirm(action){

            this.actionProcess = action;
            let promise = Swal.fire({
                icon: 'question',
                title: this.$t(`do_you_want_to_${action.toLowerCase()}`) ,
                showCancelButton: true,
                confirmButtonText: this.$t("yes"),
                cancelButtonText: this.$t("no")
            }).then((result) => {
                if (result.isConfirmed) {
                    this.onProcess();
                } 
            });

            await promise;
        },


        onProcess(){
            if(this.actionProcess == "SAVE") {
                this.onSave();
            }
            if(this.actionProcess == "DELETE") {
                this.data._rowstatus ='d';
                this.onSave();
                
            }
        },

        async onSearch(){
            const dso = {
                type: 'control',
                selpro: 'vs_sel_1110035_visitor_reg',
                para: [this.data.PK],
                elname: this.paramSave,
                data: this.data,
            }
            const result = await this._dsoCall(dso, 'select', true)
            if(result) {
                this.data = result;
                

                try{this.data.REQ_TIME_SHOW = !!result.REQ_TIME ? moment(result.REQ_TIME, 'YYYYMMDDHH:mm').toDate():null;}catch{}
                try{this.data.CHECKIN_TIME_SHOW = !!result.CHECKIN_TIME ? moment(result.CHECKIN_TIME, 'YYYYMMDDHH:mm').toDate() : null;}catch{}
                try{this.data.CHECKOUT_TIME_SHOW = !!result.CHECKOUT_TIME ? moment(result.CHECKOUT_TIME, 'YYYYMMDDHH:mm').toDate(): null;}catch{}

                await this.$refs.grdEmpPhoto.loadData();

            } else {
                this.showNotification("danger", this.$t("error_occurs"), '');
            }
        },

        async onSave(){
            if(this.$refs.entryForm.validate() && !!this.data.REQ_TIME ) {
                this.formIsValid = true;

                if(this.data._rowstatus !=='i' && this.data._rowstatus !=='d'){
                    this.data._rowstatus = 'u';
                }

                const dso = {
                    type: 'control',
                    selpro: 'vs_sel_1110035_visitor_reg',
                    updpro: 'vs_upd_1110035_visitor_reg',
                    para: [this.data.PK],
                    elname: this.paramSave,
                    data: this.data,
                }
 
                const result = await this._dsoCall(dso, 'update', true)
                if(result) {
                    
                    this.data = result;

                    try{this.data.REQ_TIME_SHOW = !!result.REQ_TIME ? moment(result.REQ_TIME, 'YYYYMMDDHH:mm').toDate():null;}catch{}
                    try{this.data.CHECKIN_TIME_SHOW = !!result.CHECKIN_TIME ? moment(result.CHECKIN_TIME, 'YYYYMMDDHH:mm').toDate() : null;}catch{}
                    try{this.data.CHECKOUT_TIME_SHOW = !!result.CHECKOUT_TIME ? moment(result.CHECKOUT_TIME, 'YYYYMMDDHH:mm').toDate(): null;}catch{}

                } else {
                    this.showNotification("danger", this.$t("error_occurs"), '');
                    return;
                }

                if(this.actionProcess == "DELETE") {
                    this.dialogIsShow = false;
                    return;
                }

            } else {
                this.formIsValid = false;
                if(!!!this.data.REQ_TIME_SHOW) {
                    this.data.REQ_TIME_SHOW="";
                }
                
                this.showNotification("danger", this.$t("please_input_data"), '');
            }
        },

        getFromLog(target){
            this.checkTarget = target;
            this.$refs.guestLog.dialogIsShow = true;
        },

        onSelectedTerPic(data){
            if(data) {
                let checkTime = moment(data.WORK_TIME, 'YYYYMMDDHHmmss').toDate();
                if(this.checkTarget == "IN") this.data.CHECKIN_TIME_SHOW = checkTime;
                else this.data.CHECKOUT_TIME_SHOW = checkTime;
            }
        },


    }
  }
</script>
<style scoped>
    .dx-datebox :deep() div.dx-dropdowneditor-input-wrapper > div.dx-texteditor-container > div.dx-texteditor-input-container > input.dx-texteditor-input{
        height: auto !important;
    }
    .dx-datebox 
    {
        border: 1px solid #9e9e9e !important
    }
</style>
