<template>
    <BaseDialog v-model="dialogIsShow" >
        <v-card light :width="1200" >
            <v-card-title class="headline primary-gradient white--text py-2 px-2">
                <span>{{ $t("recruitment_request_dialog", "common") }}</span>
                <v-spacer></v-spacer>
                <BaseButton :icon_color="'white'" btn_type="icon" icon_type="close_dialog" mdi-icon="mdi-close-thick" :btn_text="$t('close')" @onclick="dialogIsShow = false"  />
            </v-card-title>
            <v-card-text>
                
                    <v-row align="center" class="px-2 py-2" no-gutters>

                        <v-col cols="12" lg="3" class="px-1">  
                            <BaseInput :outlined="true"  :clearable="false"  :label="$t('request_no')" v-model="selectedReq_no"></BaseInput>                          
                        </v-col>

                        <v-col cols="12" lg="2" class="px-1">
                        </v-col>

                        <v-col cols="12" lg="2" class="px-1">
                            <BaseDatePicker default v-model="selectedFrom" outlined  :label="$t('from')"  ></BaseDatePicker>
                        </v-col>

                        <v-col cols="12" lg="2" class="px-1">
                            <BaseDatePicker default v-model="selectedTo" outlined  :label="$t('to')"  ></BaseDatePicker>
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
        name: "hr-recruitment-request-dialog",
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

            selectedPeriod:null,
            selectedFrom:null,
            selectedTo:null,
            selectedReq_no:null,

            
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
                         { title: ("request_no") , field:"APP_NO"    , editable: false  , type: "", width: 200},
                         { title: ("position") , field:"POSITION"   , editable: true  , type: "", width: 200},
                         { title: ("education") , field:"EDUCATION"  , editable: true  , type: "", width: 200},
                        { title: ("experience_years") , field:"EXPERIENCE_YEAR"  , editable: true , type:"" , width: 200},
                        { title: ("language") , field:"LANG_TYPE"  , editable: true , type:"" , width: 200},
                        { title: ("language_certificate") , field:"LANG_RESULT"  , editable: true , type:"" , width: 200},
                        { title: ("computer_skill") , field:"COMPUTER_SKILL"  , editable: true , type:"" , width: 200},
                        { title: ("other") , field:"OTHER"  , editable: true , type:"" , width: 200},
                        { title: ("remark") , field:"REMARK"  , editable: true , type:"" , width: 200},
                        { title: ("employee(s)_request") , field:"REQ_NUM"  , editable: true , type:"" , width: 200},
                        { title: ("employee(s)_apply") , field:"EMP_APPLY"  , editable: true , type:"" , width: 200},
                        { title: ("employee(s)_passed") , field:"EMP_PASS"  , editable: true , type:"" , width: 200},
                      
                    ];

            },


         async prepareCommonData(){
           
            this.selectedCompany = this.user.TCO_COMPANY_PK;
            let parentCodes = ["HR0009" ] ;
            let listCommonCode = await this._getCommonCode2( parentCodes,  this.selectedCompany );

            await this.createHeader();

        },    

        
    
        async onSearch() {
                
                let pa = [ this.selectedReq_no, this.selectedFrom,  this.selectedTo ];
 
                let dso = {
                    type: 'grid',
                    selpro: "HR_1510010_REQUEST", 
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
    
    