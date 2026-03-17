<template>
    <BaseDialog v-model="dialogIsShow">
        <v-card light :width="600">
            <v-card-title class="headline primary-gradient white--text py-2 px-2">
                <span>{{ $t("ANNUAL_LEAVE_ABS_POPUP") }}</span>
                <v-spacer></v-spacer>
                <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
            </v-card-title> 
            <v-card-title class="headline primary-gradient white--text py-2 px-2">
                <span>{{ $t("ale_used_popup") }}</span>                              
            </v-card-title>                            
            <v-card-text>
                <BaseGridView ref="idGrid" :editable="false" :headertype="1" :height="limitHeight" :header="header" ></BaseGridView>
            </v-card-text>
        </v-card>
    </BaseDialog>
    </template>
    
    <script>
    export default {
        name: 'hr_1021040_ale_used_popup',
    
        components: {},
    
        props: {            
            params: {
                type: Array
           },        
        },    
        data: () => ({                 
            dialogIsShow: false,  
            header :[],        
        }),            
        

        watch: {
            dialogIsShow(val) {                   
                if (val === false) {
                    console.log("Close");
                } else {
                    this.onLoad();
                }
            }         
        },
    
        computed: {
            user: function () {
                return this.$store.getters["auth/user"];
            },
            limitHeight() {
                return 400;
            },
    
        },
    
        methods: {  

            async onLoad() {
                try
                {
                    await this.$nextTick(async () => {
                        this.header = [
                            {
                                field: "EMP_ID",
                                caption: this.$t("emp_id"),
                                width: "100"
                            },
                            {
                                field: "FULL_NAME",
                                caption: this.$t("full_name"),
                                width: "200"
                            },                                       
                            {
                                field: "ABSENCE_DT",
                                caption: this.$t("absence_dt"),
                                width: "120"
                            },
                            {
                                field: "ABSENCE_TIME",
                                caption: this.$t("absence_time"),
                                width: "110"
                            }
                        ]
                    });

                    this.onSearch();
                
                }catch(e) {
                
                }
            },                                                        
            async onSearch() {                
                const dso = {
                type: "grid",
                    selpro: "HR_SEL_1021040_ALE_USED_POPUP",
                    para: [this.params[0].EMP_ID, this.params[0].MON, this.params[0].FLAG]
                };
                this.$refs.idGrid.onSearch(dso, true);
            },            
        },        
    }
    </script>
    