<template>
    <BaseDialog v-model="dialogIsShow" >
        <v-card light :width="1200" >
            <v-card-title class="headline primary-gradient white--text py-2 px-2">
                <span>{{ $t("approver_dialog", "common") }}</span>
                <v-spacer></v-spacer>
                <BaseButton :icon_color="'white'" btn_type="icon" icon_type="close_dialog" mdi-icon="mdi-close-thick" :btn_text="$t('close')" @onclick="dialogIsShow = false"  />
            </v-card-title>
            <v-card-text>
                
                    <v-row align="center" class="px-2 py-2" no-gutters>

                        <v-col cols="12" lg="3" class="px-1">
                            <BaseSelect  :outlined="true" item-value="PK" item-text="TEXT" :label="$t('department')" :lstData="departmentList" v-model="selectedDepartment" > </BaseSelect>                             
                        </v-col>


                        <v-col cols="12" lg="3" class="px-1">
                            <BaseSelect  :outlined="true" item-value="PK" item-text="TEXT" :label="$t('work_group')" :lstData="work_groupList" v-model="selectedWork_group" > </BaseSelect>                             
                        </v-col>

                        <v-col cols="12" lg="3" class="px-1">
                                <BaseInput :outlined="true" :clearable="false"  :label="$t('name_id')" v-model="selectedSearch_text" @keyPressEnter="onSearch"  ></BaseInput>
                        </v-col>

                        <v-col cols="12" lg="3" class="text-right">
                            <v-row no-gutters>
                                <v-spacer></v-spacer>
                                    <BaseButton btn_type="default" icon_type="search" :btn_text="$t('search')"  @onclick="onSearch" v-bind:disabled.sync="isProcessing" />
                                    <BaseButton btn_type="default" icon_type="select" :btn_text="$t('select')"  @onclick="onSelect" v-bind:disabled.sync="isProcessing" />
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

            work_groupList:[],
            selectedWork_group:'ALL',
            
            selectedSearch_text:null,

            departmentList:[],
            selectedDepartment:'ALL'

            
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
                         { title: ("emp_id") , field:"EMP_ID"    , editable: false  , type: "", width: 200},
                         { title: ("full_name") , field:"FULL_NAME"   , editable: true  , type: "", width: 200},
                         { title: ("manager_level") , field:"MANAGER_KIND"  , editable: true  , type: "", width: 200},
                        { title: ("organization") , field:"ORG_NM"  , editable: true , type:"" , width: 200},
                      
                    ];

            },


         async prepareCommonData(){
           
            this.selectedCompany = this.user.TCO_COMPANY_PK;
            let parentCodes = ["HR0009" ] ;

            let listCommonCode = await this._getCommonCode2( parentCodes,  this.selectedCompany );
            this.nationList = listCommonCode[0];
            this.nationList.push({ CODE:'ALL', NAME:this.$t("Select_all") });

            let dso =  {type: 'grid', selpro: 'HR_1510020_GET_DEPARTMENT'};
            const result = await this._dsoCall(dso, 'select', true);
                if(result) {
                     this.departmentList = result;
                     }
            this.departmentList.unshift({ PK:'ALL', TEXT:this.$t("Select_All") });

            this.work_groupList = await this._getWorkGroup(this.selectedCompany);
            this.work_groupList.unshift({ PK:'ALL', TEXT:this.$t("Select_all") });
            

            await this.createHeader();

        },    

        
    
        async onSearch() {
                
                let pa = [ this.selectedDepartment, this.selectedWork_group,  this.selectedSearch_text ];
 
                let dso = {
                    type: 'grid',
                    selpro: "HR_1510020_SEL_REC_MANA", 
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
    
    