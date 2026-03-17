 <!-- ================================================================= BEGIN DESIGN LAYOUT======================================================================================= -->
<template>
  <v-dialog id="dlg-dailyst" max-width="1000" v-model="dialogIsShow">
    <v-container fluid class="pa-0" v-resize="onResize">  
        <v-row no-gutters class=" pl-2 pt-2"> 
             
        </v-row> 
        <v-row  no-gutters >
            <v-col cols="12" class="pt-2">
                <DxDataGrid 
                                        ref="grid_data"  :data-source="dxg_data"  :height="limitHeight"   
                                        :allow-column-resizing="true" :cache-enabled="false" :column-auto-width="$vuetify.breakpoint.smAndDown" 
                                        column-resizing-mode="widget" :hoverStateEnabled="true"  :no-data-text="$t('no_data')"  
                                        :selection="{ mode: 'single' }" :show-borders="true" :show-column-lines="true" :show-row-lines="true"
                                        
                            >   
                    <DxColumn data-field="FA_CD"             :caption="$t('fa_cd')"          ></DxColumn> 
                    <DxColumn data-field="FA_NM"             :caption="$t('fa_nm')"          ></DxColumn> 
                    <DxColumn data-field="FA_KIND_CD"        :caption="$t('fa_kind_cd')"     ></DxColumn> 
                    <DxColumn data-field="DEPR_AC_CD"        :caption="$t('depr_ac_cd')"     ></DxColumn> 
                    <DxColumn data-field="EXPE_AC_CD"        :caption="$t('expe_ac_cd')"     ></DxColumn> 
                    <DxColumn data-field="FA_FCOST"          :caption="$t('fa_fcost')"       :customizeText="_format2_amt" ></DxColumn> 
                    <DxColumn data-field="FA_COST"           :caption="$t('fa_cost')"        :customizeText="_format_amt" ></DxColumn>  
                    <DxColumn data-field="FD_DFAMT"          :caption="$t('fd_dfamt')"       :customizeText="_format2_amt" ></DxColumn> 
                    <DxColumn data-field="FD_DAMT"           :caption="$t('fd_damt')"        :customizeText="_format_amt" ></DxColumn> 
                    <DxColumn data-field="ACC_FAMT"          :caption="$t('acc_famt')"       :customizeText="_format2_amt" ></DxColumn> 
                    <DxColumn data-field="ACC_AMT"           :caption="$t('acc_amt')"        :customizeText="_format_amt" ></DxColumn> 
                    <DxColumn data-field="REMAIN_FAMT"       :caption="$t('remain_famt')"    :customizeText="_format2_amt" ></DxColumn> 
                    <DxColumn data-field="REMAIN_AMT"        :caption="$t('remain_amt')"     :customizeText="_format_amt" ></DxColumn>  

                    <DxEditing mode="cell"  start-edit-action="Click" :allow-updating="false" /> 
                    <DxPaging  v-if="dxg_data.length < 500" :page-size="dxg_data.length" />
                    <DxScrolling v-else mode="infinite" />  
                </DxDataGrid>  
            </v-col> 
        </v-row>   
        <confirm-dialog ref="dlg_Process"       @onConfirm="On_CallBack_Data('PROCESS')" ></confirm-dialog>
        <confirm-dialog ref="dlg_Generate"      @onConfirm="On_CallBack_Data('GENERATE')" ></confirm-dialog>
        <confirm-dialog ref="dlg_Delete_pro"    @onConfirm="On_CallBack_Data('DELETE_PROCESS')" ></confirm-dialog> 
        <confirm-dialog ref="dlg_Delete_gener"  @onConfirm="On_CallBack_Data('DELETE_GENERATE')" ></confirm-dialog>
        <dynamic-dialog ref="dlg_ACC" :companyPK="sel_Company" :header="dynamicHeader" :codeLabel="codeLabel" 
                        :nameLabel="nameLabel" :dialogTitle="dialogTitle" :procedure="procedure" 
                        :moreParas="moreParas" :autoSearch="autoSearch" @returnData="CallBack_DLG_ACC"
        ></dynamic-dialog>
        <alert-dialog ref="alertDialog" ></alert-dialog>     
    </v-container>  
   </v-dialog> 
</template>
<!-- ================================================================= END DESIGN LAYOUT & BEGIN SCRIPT ========================================================================= --> 

<script>  
/*==================================================================== BEGIN IMPORT COMPONENT ======================================================================================*/
    import ConfirmDialog        from "@/components/dialog/ConfirmDialog";  
    import AlertDialog          from "@/components/dialog/AlertDialog";  
    import DatePicker           from '@/components/control/DatePicker';
    import DateControl          from '@/components/control/DateControl';
    import NumberControl        from '@/components/control/NumberControl.vue';
    import DynamicDialog        from "@/components/dialog/DynamicDialog";
    import AccountDialog        from "@/components/dialog/AccountDialog";
    import listToTree           from "list-to-tree-lite"
/*==================================================================== END IMPORT COMPONENT & BEGIN export default==================================================================*/  
    export default 
    {
        /*############### DEFAULT #######################*/
            layout: "default",
            middleware: "user",
        /*############### components ####################*/
            components: 
            {  
                ConfirmDialog, 
                AlertDialog, 
                DatePicker,
                DateControl,
                NumberControl,
                DynamicDialog,
                AccountDialog 
            },
        /*############### data ##########################*/
            data: () => 
            ({ 
                dxg_data:[],
                dynamicHeader       : [],
                codeLabel           : "",
                nameLabel           : "",
                dialogTitle         : "",
                procedure           : "", 
                moreParas           : null,
                autoSearch          : false,
                action_dlg_acc      : "AC1",

            }),
        /*############### created #######################*/
            created() 
            {   
            },
        /*############### watch ######################*/
             watch:
            {
                 
            },
        /*############### computed ######################*/
            computed:
            {  
                 user() { return this.$store.getters["auth/user"] },
                 limitHeight() { return this.windowHeight-260 },  
            },
        /*############### mounted #######################*/
            mounted() 
            {    
                 
            }, 
        /*############### methods #######################*/
            methods: 
            {   
                     
                    
            } 
    };
/*==================================================================== END export default  ========================================================================================*/ 
</script>
<!-- ================================================================= END SCRIPT  ============================================================================================== -->
 
