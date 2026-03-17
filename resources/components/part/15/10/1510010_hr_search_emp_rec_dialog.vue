<template>
    <BaseDialog v-model="dialogIsShow" >
        <v-card light :width="1200" >
            <v-card-title class="headline primary-gradient white--text py-2 px-2">
                <span>{{ $t("search_emp_rec_dialog", "common") }}</span>
                <v-spacer></v-spacer>
                <BaseButton :icon_color="'white'" btn_type="icon" icon_type="close_dialog" mdi-icon="mdi-close-thick" :btn_text="$t('close')" @onclick="dialogIsShow = false"  />
            </v-card-title>
            <v-card-text>
                
                    <v-row align="center" class="px-2 py-1" no-gutters>
                        <v-col cols="12" lg="3" class="px-2 py-0">
                            <BaseSelect  :outlined="true" item-value="PK" item-text="TEXT" :label="$t('department')" :lstData="departmentList" v-model="selectedDepartment" > </BaseSelect>                             
                        </v-col>

                        <v-col cols="12" lg="3" class="px-2 py-0">
                            <BaseSelect  :outlined="true" item-value="CODE" item-text="NAME" :label="$t('position')" :lstData="posList" v-model="selectedPos" > </BaseSelect>                             
                        </v-col>

                        <v-col cols="12" lg="3" class="px-2 py-0">
                            <BaseSelect  :outlined="true" item-value="CODE" item-text="NAME" :label="$t('job')" :lstData="jobList" v-model="selectedJob" > </BaseSelect>                             
                        </v-col>

                        <v-col cols="12" lg="3" class="text-right">
                            <v-row no-gutters>
                                <v-spacer></v-spacer>
                                    <BaseButton btn_type="default" icon_type="search" :btn_text="$t('search')"  @onclick="onSearch" v-bind:disabled.sync="isProcessing" />
                                    <BaseButton btn_type="default" icon_type="select" :btn_text="$t('select')"  @onclick="onSelect" v-bind:disabled.sync="isProcessing" />
                            </v-row>
                        </v-col>
                    </v-row>

                    <v-row align="center" class="px-2 py-1" no-gutters>
                        <v-col cols="12" lg="3" class="px-2 py-1">
                            <BaseSelect  :outlined="true" item-value="CODE" item-text="NAME" :label="$t('recruitment_request')" :lstData="recreqList" v-model="selectedRecReq" > </BaseSelect>                             
                        </v-col>

                        <v-col cols="12" lg="3" class="px-2 py-1">
                            <v-row class="px-2 py-0">
                                            <v-col cols="12" lg="6" class="px-1 py-0">
                                                <BaseDatePicker  v-model="selectedReceiveFrom" outlined  :label="$t('receive_dt_from')"  ></BaseDatePicker>
                                            </v-col>
                                            <v-col cols="12" lg="6" class="px-1 py-0">
                                                <BaseDatePicker  v-model="selectedReceiveTo" outlined  :label="$t('receive_dt_to')"  ></BaseDatePicker>
                                            </v-col>
                            </v-row>                                
                        </v-col>

                        <v-col cols="12" lg="3" class="px-2 py-1">
                            <v-row class="px-2 py-0">
                                            <v-col cols="12" lg="6" class="px-1 py-0">
                                                <BaseDatePicker  v-model="selectedExpireFrom" outlined  :label="$t('expire_dt_from')"  ></BaseDatePicker>
                                            </v-col>
                                            <v-col cols="12" lg="6" class="px-1 py-0">
                                                <BaseDatePicker  v-model="selectedExpireTo" outlined  :label="$t('expire_dt_to')"  ></BaseDatePicker>
                                            </v-col>
                            </v-row>  
                        </v-col>

                        <v-col cols="12" lg="3" class="px-2 py-1">
                            <BaseInput :outlined="true"  :clearable="false"  :label="$t('name_id')" v-model="selectedSearchText"  ></BaseInput>
                        </v-col>
                    </v-row>

                    <v-row align="center" class="px-2 py-0" no-gutters>
                        <v-col cols="12" lg="3" class="px-2 py-1">
                            <v-row class="px-2 py-0">
                                            <v-col cols="12" lg="6" class="px-1 py-0">
                                                <BaseDatePicker  v-model="selectedInterv1From" outlined  :label="$t('interview_dt1_from')"  ></BaseDatePicker>
                                            </v-col>
                                            <v-col cols="12" lg="6" class="px-1 py-0">
                                                <BaseDatePicker  v-model="selectedInterv1To" outlined  :label="$t('interview_dt1_to')"  ></BaseDatePicker>
                                            </v-col>
                            </v-row>                                
                        </v-col>

                        <v-col cols="12" lg="3" class="px-2 py-0">
                            <v-row class="px-2 py-0">
                                            <v-col cols="12" lg="6" class="px-1 py-0">
                                                <BaseDatePicker  v-model="selectedInterv2From" outlined  :label="$t('interview_dt2_from')"  ></BaseDatePicker>
                                            </v-col>
                                            <v-col cols="12" lg="6" class="px-1 py-0">
                                                <BaseDatePicker  v-model="selectedInterv2To" outlined  :label="$t('interview_dt2_to')"  ></BaseDatePicker>
                                            </v-col>
                            </v-row>  
                        </v-col>

                         <v-col cols="12" lg="3" class="px-2 py-0">
                            <v-row class="px-2 py-0">
                                            <v-col cols="12" lg="6" class="px-1 py-0">
                                                <BaseDatePicker  v-model="selectedInterv3From" outlined  :label="$t('interview_dt3_from')"  ></BaseDatePicker>
                                            </v-col>
                                            <v-col cols="12" lg="6" class="px-1 py-0">
                                                <BaseDatePicker  v-model="selectedInterv3To" outlined  :label="$t('interview_dt3_to')"  ></BaseDatePicker>
                                            </v-col>
                            </v-row>  
                        </v-col>

                        <v-col cols="12" lg="3" class="px-2 py-0">
                            <BaseSelect  :outlined="true" item-value="CODE" item-text="NAME" :label="$t('pass')" :lstData="passList" v-model="selectedPass" > </BaseSelect>                             
                        </v-col>
                    </v-row>

    
                    <BaseGridView ref='idGrid'
                        :editable="false"  :headertype="1" 
                        :height="limitHeight"
                        :header="header1" 
                        @cellDblClick="cellDblClick"
                        :selectionmode="selectionmode"
                    ></BaseGridView>

             
            </v-card-text>
        </v-card>
    </BaseDialog>
    </template>
    
    <script>

    import moment from "moment";
    
    
    
    export default {
        name: "hr-approver-rec-dialog",
        props: {
            selectionmode: { type: String, default: 'singlecell' },
            foreigner:{ type: Boolean, default: false },
           
        },

        components: { 
             
        },

        data: () => ({
            
   

            dialogIsShow: false,
            selectedCompany:null,

            header1: [],
            gridSelectionMode: null,

            departmentList:[],
            selectedDepartment:'ALL',
            posList:[],
            selectedPos:'ALL',
            jobList:[],
            selectedJob:'ALL',
            recreqList:[],
            selectedRecReq:'ALL',
            selectedReceiveFrom:'',
            selectedReceiveTo:'',
            selectedExpireFrom:'',
            selectedExpireTo:'',
            selectedSearchText:'',
            selectedInterv1From:'',
            selectedInterv1To:'',
            selectedInterv2From:'',
            selectedInterv2To:'',
            selectedInterv3From:'',
            selectedInterv3To:'',
            passList:[],
            selectedPass:'ALL',
            
        }),
    
        computed:
        {
          user: function(){
              return this.$store.getters["auth/user"];
          },
          
          limitHeight() { return 400 },

         defaultButtons: function(){
                if(this.buttons) return this.buttons;

                return ["search", "add", "delete", "save"];
            },

          buttonCustom2(){
            return [
                { name: "select", action: 'SELECT', icon_type:"SELECT_DATA", mdi: "mdi-check-circle-outline" }
            ]
            },
        },

        async created() {
            this.prepareCommonData();
         },
    
        watch: {
            dialogIsShow(val) {
                if (val === false) {
                    this.$emit("onCloseDialog");
                } else {
                    this.onLoad();
                }
            },
        },
    
        methods: {
            async onLoad() {
                try {
                    this.$nextTick(() => {
                        this.$refs.idGrid.Clear();
                        //console.log("selectionmode-" + this.selectionmode);
                    });
                } catch (e) {
                    
                }
            },
  
        async createHeader(){
    
                    this.header1 = [
                         { title: ("id") , field:"REC_ID"    , editable: false  , type: "", width: 200},
                         { title: ("full_name") , field:"REC_NM"   , editable: true  , type: "", width: 200},
                         { title: ("sex") , field:"SEX"  , editable: true  , type: "", width: 200},
                        { title: ("birth_dt") , field:"BIRTH_DT"  , editable: true , type:"date" , format: this.curLang.DATE_FORMAT  , width: 200},
                         { title: ("birth_place") , field:"BIRTH_PLACE"  , editable: true , type:"" , width: 200},
                         { title: ("personal_id") , field:"PER_ID"  , editable: true , type:"" , width: 200},
                         { title: ("issue_dt") , field:"PER_DT"  , editable: true , type:"date" , format: this.curLang.DATE_FORMAT  , width: 200},
                         { title: ("place_id") , field:"PER_PLACE"  , editable: true , type:"" , width: 200},
                         { title: ("ethnic") , field:"ETHNIC_TYPE"  , editable: true , type:"" , width: 200},
                         { title: ("current_address") , field:"PRESENT_ADDR"  , editable: true , type:"" , width: 200},
                        { title: ("permanent_address") , field:"PERMANENT_ADDR"  , editable: true , type:"" , width: 200},
                        { title: ("hand_phone") , field:"HAND_PHONE"  , editable: true , type:"" , width: 200},
                        { title: ("home_phone") , field:"HOME_PHONE"  , editable: true , type:"" , width: 200},
                        { title: ("other_contact") , field:"OTHER_CONTACT"  , editable: true , type:"" , width: 200},
                        { title: ("email") , field:"EMAIL"  , editable: true , type:"" , width: 200},
                         { title: ("education") , field:"EDU_TYPE"  , editable: true , type:"" , width: 200},
                         { title: ("graduation_school") , field:"GRA_SCHOOL"  , editable: true , type:"" , width: 200},
                         { title: ("major") , field:"MAJOR"  , editable: true , type:"" , width: 200},
                         { title: ("graduation_kind") , field:"GRA_RESULT"  , editable: true , type:"" , width: 200},
                         { title: ("other_certificate") , field:"OTHER_DEGREE"  , editable: true , type:"" , width: 200},
                         { title: ("foreign_language") , field:"LANG_TYPE"  , editable: true , type:"" , width: 200},
                         { title: ("language_certificate") , field:"LANG_RESULT"  , editable: true , type:"" , width: 200},
                         { title: ("other_language") , field:"OTHER_LANGUAGE"  , editable: true , type:"" , width: 200},
                         { title: ("computer_skill") , field:"COMPUTER_SKILL"  , editable: true , type:"" , width: 200},
                         { title: ("experience") , field:"EXPERIENCE_YEAR"  , editable: true , type:"" , width: 200},
                         { title: ("other_description") , field:"REMARK"  , editable: true , type:"" , width: 200},
                         { title: ("organization") , field:"ORG_NM"  , editable: true , type:"" , width: 200},
                         { title: ("position") , field:"REC_POS_TYPE"  , editable: true , type:"" , width: 200},
                          { title: ("job") , field:"REC_JOB_TYPE"  , editable: true , type:"" , width: 200},
                          { title: ("salary") , field:"REC_SALARY"  , editable: true , type:"" , width: 200},
                          { title: ("other_request") , field:"OTHER_REQUEST"  , editable: true , type:"" , width: 200},
                        { title: ("receive_dt") , field:"CV_RECIEVE_DT"  , editable: true , type:"date", format: this.curLang.DATE_FORMAT  , width: 200},
                        { title: ("introduction") , field:"INT_ID_NM"  , editable: true , type:"" , width: 200},
                         { title: ("expiry_dt") , field:"EXPIRY_DT"  , editable: true , type:"date" , format: this.curLang.DATE_FORMAT  , width: 200},
                         { title: ("full_profile") , field:"INF_FULL_YN"  , editable: true , type:"boolean" , width: 200},
                         { title: ("profile_note") , field:"INF_NOTE"  , editable: true , type:"" , width: 200},
                         { title: ("interview_dt1") , field:"INTERVIEW_DT1"  , editable: true , type:"date" , format: this.curLang.DATE_FORMAT  , width: 200},
                         { title: ("result_1") , field:"RESULT_T1"  , editable: true , type:"" , width: 200},
                         { title: ("remark_1") , field:"REMARK_1"  , editable: true , type:"" , width: 200},
                          { title: ("interview_dt2") , field:"INTERVIEW_DT2"  , editable: true , type:"date" , format: this.curLang.DATE_FORMAT  , width: 200},
                         { title: ("result_2") , field:"RESULT_T2"  , editable: true , type:"" , width: 200},
                         { title: ("remark_2") , field:"REMARK_2"  , editable: true , type:"" , width: 200},
                          { title: ("interview_dt3") , field:"INTERVIEW_DT3"  , editable: true , type:"date" , format: this.curLang.DATE_FORMAT  , width: 200},
                         { title: ("result_3") , field:"RESULT_T3"  , editable: true , type:"" , width: 200},
                         { title: ("remark_3") , field:"REMARK_3"  , editable: true , type:"" , width: 200},
                          { title: ("pass") , field:"PASS_YN"  , editable: true , type:"boolean" , width: 200},
                         { title: ("working_dt") , field:"WORKING_DT"  , editable: true , type:"date" , format: this.curLang.DATE_FORMAT , width: 200},

                    ];

            },


         async prepareCommonData(){
           
            this.selectedCompany = this.user.TCO_COMPANY_PK;
            let parentCodes = ["HR0008", "HR0010" ] ;

            let listCommonCode = await this._getCommonCode2( parentCodes,  this.selectedCompany );

            let dso =  {type: 'grid', selpro: 'HR_1510020_GET_DEPARTMENT'};
            const result = await this._dsoCall(dso, 'select', true);
                if(result) {
                     this.departmentList = result;
                     }
            this.departmentList.unshift({ PK:'ALL', TEXT:this.$t("Select_All") });

            this.posList = listCommonCode[0];
            this.posList.push({ CODE:'ALL', NAME:this.$t("Select_all") });

            this.jobList = listCommonCode[1];
            this.jobList.push({ CODE:'ALL', NAME:this.$t("Select_all") });

            this.passList.push({ CODE:'Y', NAME:this.$t("Pass") });
            this.passList.push({ CODE:'N', NAME:this.$t("No") });
            this.passList.push({ CODE:'W', NAME:this.$t("Waiting") });
            this.passList.push({ CODE:'ALL', NAME:this.$t("Select_all") });

            let dso2 =  {type: 'grid', selpro: 'HR_1510030_REQUEST_DETAIL'};
            const result2 = await this._dsoCall(dso2, 'select', true);
            if(result2) {
                     this.recreqList = result2;
                     }
            this.recreqList.unshift({ CODE:'ALL', NAME:this.$t("Select_All") });

            await this.createHeader();

        },    
    
        async onSearch() {
                
                let pa = [ this.selectedDepartment, this.selectedPos, this.selectedSearchText, this.selectedJob, this.selectedPass, this.selectedRecReq,
                            this.selectedReceiveFrom, this.selectedReceiveTo, this.selectedExpireFrom, this.selectedExpireTo,
                            this.selectedInterv1From, this.selectedInterv1To, this.selectedInterv2From, this.selectedInterv2To,
                            this.selectedInterv3From, this.selectedInterv3To ];
 
                let dso = {
                    type: 'grid',
                    selpro: "HR_1510010_REC_POPUP", 
                    para: [...pa],
                    
                }
    
                this.$refs.idGrid.onSearch( dso);
            },
    
        cellDblClick(data) {
                let selectedData = data.data;
                if(selectedData) {
                    this.$emit("callBack", selectedData);
                    this.dialogIsShow = false;
                }
            },
    
        onSelect(){
                let selectedData = this.$refs.idGrid.onSelectedData();
                if(selectedData) {
                    this.$emit("callBack", selectedData);
                    this.dialogIsShow = false;
                }
            },


        }
    };
    </script>
    
    
    
    
    