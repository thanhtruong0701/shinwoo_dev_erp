<template>
    <BaseDialog v-model="dialogIsShow" >
        <v-card light :width="1200" >
            <v-card-title class="headline primary-gradient white--text py-2 px-2">
                <span>{{ $t("find_applicant_dialog", "common") }}</span>
                <v-spacer></v-spacer>
                <BaseButton :icon_color="'white'" btn_type="icon" icon_type="close_dialog" mdi-icon="mdi-close-thick" :btn_text="$t('close')" @onclick="dialogIsShow = false"  />
            </v-card-title>
            <v-card-text>
                
                    <v-row align="center" class="px-2 py-1" no-gutters>
                        <v-col cols="12" lg="3" class="px-1">
                                <BaseSelect :outlined="true"   item-value="PK" item-text="TEXT" :label="$t('org')" :lstData="orgList" v-model="selectedOrg" 
                                                prepend-inner-icon="mdi-microsoft-xbox-controller-menu" @click:prepend-inner="openOrgList"
                                > </BaseSelect>
                        </v-col>

                        <v-col cols="12" lg="6" class="px-1">
                            <BaseSelect  :outlined="true" item-value="PK" item-text="TEXT" :label="$t('work_group')" :lstData="work_groupList" v-model="selectedWork_group" > </BaseSelect>                             
                        </v-col>

                        
                        <v-col cols="12" lg="3" class="text-right">
                            <v-row no-gutters>
                                <v-spacer></v-spacer>
                                    <BaseButton btn_type="default" icon_type="search" :btn_text="$t('search')"  @onclick="onSearch" v-bind:disabled.sync="isProcessing" />
                                    <BaseButton btn_type="default" icon_type="select" :btn_text="$t('select')"  @onclick="onSelect" v-bind:disabled.sync="isProcessing" />
                                    
                            </v-row>
                        </v-col>
                    </v-row>


                     <v-row align="center" class="px-2 py-0" no-gutters>
                            <v-col cols="12" lg="3" class="px-1 py-0">
                                 <BaseInput :outlined="true"  :clearable="false"  :label="$t('period(times)')" v-model="selectedPeriod"  ></BaseInput>
                            </v-col>

                             <v-col cols="12" lg="6" class="px-1 py-0">
                                    <v-row class="px-2 py-0">
                                            <v-col cols="12" lg="6" class="px-1">
                                                <BaseDatePicker default v-model="selectedFrom" outlined  :label="$t('from')"  ></BaseDatePicker>
                                            </v-col>
                                            <v-col cols="12" lg="6" class="px-1">
                                                <BaseDatePicker default v-model="selectedTo" outlined  :label="$t('to')"  ></BaseDatePicker>
                                            </v-col>
                                    </v-row>                                
                            </v-col>

                     </v-row>
                                                        

    
                    <BaseGridView ref='idGrid'
                        :editable="false"  :headertype="1" 
                        :height="limitHeight"
                        :header="header1" 
                        @cellDblClick="cellDblClick"
                        :selectionmode="selectionmode"
                    ></BaseGridView>

                    <OrganizationDialog ref="orgDialog" :height="400" @callback="callbackOrg"></OrganizationDialog>
             
            </v-card-text>
        </v-card>
    </BaseDialog>
    </template>
    
    <script>

    import moment from "moment";
    import OrganizationDialog from '@/components/dialog/OrganizationDialog.vue';
    
    
    export default {
        name: "hr-find-applicant-dialog",
        props: {
            selectionmode: { type: String, default: 'singlecell' },
            foreigner:{ type: Boolean, default: false },
           
        },

        components: { 
             OrganizationDialog
        },

        data: () => ({
            
   

            dialogIsShow: false,
            selectedCompany:null,

            orgList: [],
            selectedOrg: null,
            
            header1: [],
            gridSelectionMode: null,

            work_groupList:[],
            selectedWork_group:'ALL',
            
            selectedSearch_text:null,

            nationList:[],
            selectedNation: '01',

            selectedPeriod:null,
            selectedFrom:'',
            selectedTo:'',
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
                        { title: ("application_no") , field:"APP_NO"    , editable: true , type:"" , width: 200},
                         { title: ("organization") , field:"ORG_NM"    , editable: true  , type: "", width: 200},
                        { title: ("period" ) , field:"PERIOD"     , editable: false  , type: "", width: 100},
                        { title: ("from_dt" ) , field:"FROM_DT"   , editable: true  , type: "", width: 200},
                        { title: ("from_to" ) , field:"TO_DT"    , editable: false  , type: "",format: this.curLang.DATE_FORMAT , width: 100},
                        { title: ("total_person" ) , field:"REQ_NUM"   , editable: true  , type: "",  width: 200},
                        { title: ("application_status" ) , field:"APP_STATUS_NM"   , editable: true  , type: "",  width: 200},
                        { title: ("application_id" ) , field:"APP_ID" , editable: true  , type: "",  width: 200},
                        { title: ("application_name" ) , field:"APP_FULL_NAME"         , editable: true  , type: "",  width: 200},
                        { title: ("maker_id" ) , field:"MK_ID"         , editable: true  , type: "",  width: 200},
                        { title: ("maker_name" ) , field:"MK_FULL_NAME"         , editable: true  , type: "",  width: 200},


                    ];

            },


         async prepareCommonData(){
           
            this.selectedCompany = this.user.TCO_COMPANY_PK;
            let parentCodes = ["HR0009" ] ;

            let listCommonCode = await this._getCommonCode2( parentCodes,  this.selectedCompany );
            this.nationList = listCommonCode[0];
            this.nationList.push({ CODE:'ALL', NAME:this.$t("Select_all") });            

            this.orgList = await this._getOrgByUser(this.user.PK);
            this.selectedOrg = this.orgList.length > 0 ?  this.orgList[0].PK : this.selectedOrg;

            this.work_groupList = await this._getWorkGroup(this.selectedCompany);
            this.work_groupList.unshift({ PK:'ALL', TEXT:this.$t("Select_all") });
            this.selectedWork_group = this.work_groupList.length > 0 ?  this.work_groupList[0].PK : this.selectedWork_group;

            this.selectedFrom= moment(new Date()).format('YYYYMMDD');
            this.selectedTo= moment(new Date()).format('YYYYMMDD');

            await this.createHeader();

        },    

        
    
        async onSearch() {
                
                let pa = [ this.selectedOrg, this.selectedWork_group, this.selectedPeriod, 
                            this.selectedFrom, this.selectedTo];

                let dso = {
                    type: 'grid',
                    selpro: "HR_1510020_SEL_POPUP_2", 
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


        openOrgList(){
                this.$refs.orgDialog.dialogIsShow = true;
            },

        callbackOrg(data) {
                if(data) {
                    this.selectedOrg = data.PK;
                }
            },


        }
    };
    </script>
    
    