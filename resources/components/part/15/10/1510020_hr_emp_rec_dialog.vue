<template>
    <BaseDialog v-model="dialogIsShow" >
        <v-card light :width="1200" >
            <v-card-title class="headline primary-gradient white--text py-2 px-2">
                <span>{{ $t("applicant_dialog", "common") }}</span>
                <v-spacer></v-spacer>
                <BaseButton :icon_color="'white'" btn_type="icon" icon_type="close_dialog" mdi-icon="mdi-close-thick" :btn_text="$t('close')" @onclick="dialogIsShow = false"  />
            </v-card-title>
            <v-card-text>
                
                    <v-row align="center" class="px-2 py-2" no-gutters>
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


                     <v-row align="center" class="px-2 py-2" no-gutters>
                            <v-col cols="12" lg="3" class="px-1">
                                <BaseSelect  :outlined="true" item-value="CODE" item-text="NAME" :label="$t('nation')" :lstData="nationList" v-model="selectedNation" > </BaseSelect>
                            </v-col>

                             <v-col cols="12" lg="6" class="px-1">
                                <BaseInput :outlined="true" :clearable="false"  :label="$t('name_id')" v-model="selectedSearch_text" @keyPressEnter="onSearch"  ></BaseInput>
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
        name: "hr-emp-rec-dialog",
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
                        { title: ("tco_org_pk"     ) , field:"ORG_NM"       , editable: true , type:"" , width: 200},
                         { title: ("thr_wg_pk"     ) , field:"WORKGROUP_NM"       , editable: true  , type: "", width: 200},
                        { title: ("emp_id"         ) , field:"EMP_ID"           , editable: false  , type: "", width: 100},
                        { title: ("full_name"      ) , field:"FULL_NAME"        , editable: true  , type: "", width: 200},
                        { title: ("approver_id"        ) , field:"APPROVER_ID"          , editable: false  , type: "", width: 100},
                        { title: ("approver_name"       ) , field:"APPROVER_NAME"         , editable: true  , type: "",  width: 200},
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

            await this.createHeader();

        },    

        
    
        async onSearch() {
                
                let pa = [ this.selectedOrg, this.selectedWork_group,  this.selectedSearch_text, this.selectedNation ];

                let dso = {
                    type: 'grid',
                    selpro: "HR_1510020_SEL_EMP_REC", 
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
    
    