<!-- ================================================================= BEGIN DESIGN LAYOUT======================================================================================= -->
<template>
    <v-container fluid class="pa-0" v-resize="onResize">  
       
         <v-row  no-gutters >
            <v-col cols="4" class="pt-2">
                <div class="d-flex justify-end">
                    <BaseDatePicker outlined start :label="$t('frm_date')" v-model="txtFrm_dt"/>
                    <BaseDatePicker outlined today :label="$t('to_date')" v-model="txtTo_dt"/>
                    <BaseButton icon_type="search" :btn_text="$t('search')" @onclick="onClickButton('btnOnSearch')" :disabled="isProcessing" />  
                </div>
            </v-col>
             <v-col cols="4" class="pt-2">
                <div class="d-flex justify-end">
                    <BaseSelect outlined :label="$t('cls_printer')" v-model="sel_printer" :lstData="cbo_printer" item-text="NAME" item-value="CODE"/>                                                                     
                    <BaseButton icon_type="generate" :btn_text="$t('set_printer')" @onclick= "onClickButton('onSet_printer')" :disabled="isProcessing" />  
                </div>
            </v-col>
            <v-col cols="4" class="pt-2">
                <div class="d-flex justify-end">
                                                                                       
                    <BaseButton icon_type="excel" :btn_text="$t('excel')" @onclick="onExcel2" :disabled="isProcessing" /> 
                </div>
            </v-col>
        </v-row> 
		<v-row  no-gutters >
            <v-col cols="2" class="pt-2">
                <div class="d-flex justify-end">
					<BaseSelect outlined :label="$t('client')" v-model="sel_Company" :lstData="cbo_Company" item-text="TEXT" item-value="PK"/>
                    
                </div>
            </v-col>
             <v-col cols="2" class="pt-2">
                <div class="d-flex justify-end">
                    <BaseInput outlined :label="$t('po_no')" v-model="txt_PO_NO"/>
                </div>
            </v-col>
            
        </v-row>    	
        <v-row  no-gutters >
            <v-col cols="4" class="pt-2">
                <DataGridView
                    ref="gridData"
                    :header="[ {  dataField: 'SEQ',       caption: this.$t('seq') , allowEditing: true  },
								{  dataField: 'CLIENT_NAME', caption: this.$t('client_name') , allowEditing: false  },
                               {  dataField: 'PO_NO',       caption: this.$t('po_no') , allowEditing: true  },
                               {  dataField: 'PO_DATE',       caption: this.$t('po_date') , allowEditing: true  },
                              
                           ]" 
                    select_mode="Single"
                    :auto_load="true"
                    :max_height="this.windowHeight - 195"
                    sel_procedure="SZ_SEL_SW10030_2"
                    :filter_paras="[
                       this.txt_PO_NO,
                       this.txtFrm_dt,
                       this.txtTo_dt,
					   this.sel_Company,
                    ]"  
                    :filterRow="true"
                    @cellClick="onCellClickGrdSearch"
                    
                  />
            </v-col>
             <v-col cols="8" class="pt-2">
                <div class="d-flex flex-column justify-space-between">
                     <v-row dense align="center" justify="space-between">
                        <DataGridView
                            ref="gridData_d"
                            :header="[  {  dataField: 'SEQ',       caption: this.$t('seq') , allowEditing: true ,width:50 },
                                        {  dataField: 'PO_NO',       caption: this.$t('po_no') , allowEditing: true,width:100  },
                                        {  dataField: 'UPC_A_CODE',   caption: this.$t('upc_a_code') , allowEditing: true,width:100 },    
                                        {  dataField: 'UPC_EAN_13_CODE',  caption: this.$t('upc_ean_13_code') , allowEditing: true,width:120,visible: false},                                 
										{  dataField: 'QTY_NORMAL',       caption: this.$t('qty') , allowEditing: true ,formatFloat:'0',width:80},
										{  dataField: 'QTY',       caption: this.$t('qty_production') , allowEditing: true ,formatFloat:'0',width:80},
                                        {  dataField: 'SEASON',   caption: this.$t('season') , allowEditing: true ,width:70},
										{  dataField: 'ITEM_DESCRIPTION',   caption: this.$t('item_description') , allowEditing: true ,width:120},
                                        {  dataField: 'PRINTER_NAME'                 ,  caption: this.$t('printer_name')               , allowEditing: true,width:150,
                                                       lookup: { dataSource: this.cbo_printer, displayExpr:'NAME', valueExpr: 'CODE' },    
                                                    },
                                       
                                ]" 
                            select_mode="Multiple"
                            @cellClick="onCellClick_D"
                            :auto_load="true"
                            :max_height="this.windowHeight/2 -180"
                            sel_procedure="SZ_SEL_SW10030_4_NOCACHE"
                            :filter_paras="[ this.TSZ_ORDER_PK]"  
                            :filterRow="true"
                            
                        />
                     </v-row>  
                      <v-row dense align="center" justify="space-between">
                         <DataGridView
                                ref="gridData_D_EPC"
                                :header="[ {  dataField: 'SEQ',   caption: this.$t('seq') , allowEditing: false,width:70 },
                                        {  dataField: 'UPC_A_CODE',   caption: this.$t('upc_a_code') , allowEditing: false,width:100 },
                                        {  dataField: 'UPC_EAN_13_CODE',  caption: this.$t('upc_ean_13_code') , allowEditing: false,width:120,visible: false},
                                        {  dataField: 'SERIAL_NO',     caption: this.$t('serial_no') , allowEditing: false,width:120 },
                                        {  dataField: 'EPC_NO',     caption: this.$t('epc_no') , allowEditing: false ,width:200},
										{  dataField: 'GS1',     caption: this.$t('gs1') , allowEditing: false },
                                        {  dataField: 'PRINTER_NAME'                 ,  caption: this.$t('printer_name')               , allowEditing: true,width:200,
                                                       lookup: { dataSource: this.cbo_printer, displayExpr:'NAME', valueExpr: 'CODE' },    
                                                    },
                                       {  dataField: 'PRINT_YN',     caption: this.$t('print_yn') , allowEditing: false ,width:100},  
                                    ]" 
                                select_mode="Multiple"
                                :auto_load="true"
                                :max_height="this.windowHeight/2 - 15"
                                sel_procedure="SZ_SEL_SW10030_3_NOCACHE"
                                :filter_paras="[this.TSZ_ORDER_D_PK  ]"  
                                :filterRow="true"
                                
                             />
                     </v-row>   
                </div>  
            </v-col>
        </v-row>    
        
        <alert-dialog ref="alertDialog" ></alert-dialog>   
        <confirm-dialog ref="refConfirmDialog"     @onConfirm="confirmMaster" ></confirm-dialog>
    </v-container>   
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
    import GwImportExcelFile    from '@/components/control/GwImportExcelFile.vue';
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
                AccountDialog,
                GwImportExcelFile
            },
        /*############### data ##########################*/
            data: () => 
            ({ 
                btn: null,
                cbo_printer    : [],
                sel_printer    : "",
				cbo_Company    : [],
				sel_Company	 : "",
                txt_PO_NO   : "", 
                PK             : "",
                txtFrm_dt   : "",
                txtTo_dt    : "",
                dxg_data       : [], 
                ARR_ITEM       : [],
                dlg_GetDPM     : false,
                selectList     : [],
                active         : [], 
                actionProcess  : '',
                LST_PK: "",
                autoSearch          : false,
                multiselect: false,
                sel_row         :-1,
                TSZ_ORDER_PK : null,
                TSZ_ORDER_D_PK: null,
                /*****Data *****/
               
            }),
        /*############### created #######################*/
            async created() 
            {  
               // this.getCompanyList();
			   this.getCompanyList();
                //this.sel_Company = this.user.TCO_COMPANY_PK;
                const commoncode = await this._getCommonCode2(["SZ011", ],this.user.TCO_COMPANY_PK);
                this.cbo_printer = commoncode[0];
               
            },
        /*############### watch ######################*/
             watch:
            {
                 sel_Company(val)
                 {
                     if(val)
                     {
                       // this.getGroupIDList();
                      
                     }
                 }
            },
        /*############### computed ######################*/
            computed:
            {  
                 user() { return this.$store.getters["auth/user"] },
                 limitHeight() { return this.windowHeight-200 }, 
                 
            },
        /*############### mounted #######################*/
            mounted() 
            {    
               // this.sel_Company = this.user.TCO_COMPANY_PK;
                 const seft = this;   
            }, 
        /*############### methods #######################*/
            methods: 
            {   
                    OnClick(e) 
                    {   
                        this.sel_row = e.rowIndex;    
                    }, 
                   /*************on Process Confirm*******************/
                     onClickButton(action) {

                        this.actionProcess = action;
                        this.actionDialog = true;
                        //console.log(this.active);
                        switch(action)
                        { 
                            case 'btnOnSearch':
                                this.$refs.gridData.loadData();
                            break;
                                                       
                            case 'onSet_printer':
                                 setTimeout(() => {
                                this.onSet_printer();
                                }, 500);
                                
                            break;
                            
                        }
                    },
					//---------------------------------------------
					async getCompanyList()
                    { 
                        const dso = { type: "list", selpro: "sp_sel_list_commoncode", para: ["SWWMT02"] };
                        const result = await this._dsoCall(dso, "select", false); 
                        if (result) 
                        {
                            this.cbo_Company = result;
                        } 
                        else 
                        {
                            this.cbo_Company = [];
                        }
                    },
                    //----------------------------------------------
                    async onCellClickGrdSearch(_event)
                    {
                        this.TSZ_ORDER_PK = _event.data.PK;
                        this.txt_PO_NO = _event.data.PO_NO;
                        this.$refs.gridData_d.loadData();
                    }, 
                     //-----------------------------------------------------------
                    async onCellClick_D(_event)
                    {
                        this.TSZ_ORDER_D_PK = _event.data.PK;
                        this.$refs.gridData_D_EPC.loadData();
                    }, 
                    //-----------------------------------------------------------
                    async confirmMaster() {
                        if (this.actionProcess == 'btnSave')
                        {
                            //this.ON_SAVE()
                            this.$refs.gridData.saveData();
                        }
                        
                         if (this.actionProcess === 'btnDelete_d') 
                        {
                            
                            this.$refs.gridData_d.deleteRows();
                        }
                       
                    },
                   
                    //------------------------------------------------
                    async onSet_printer() 
                    {
                        this.LST_PK = "";
                        var arrRowSelected =  this.$refs.gridData_d.getSelectRowsData();
                        for(var i = 0; i < arrRowSelected.length; i++){
                            this.LST_PK += arrRowSelected[i].PK + (i<(arrRowSelected.length-1) ? "," : "");
                             this.$refs.gridData_d.setCellSelected("PRINTER_NAME",this.cbo_printer);
                        }
                       
                        const dso = 
                        { 
                            type: "process",  
                            updpro: "SZ_PRO_SW10030_SET_PRINTER", 
                            para: ["INSERT" ,this.TSZ_ORDER_PK, this.sel_printer, this.LST_PK] 
                        };  
                        const result = await this._dsoCall(dso, "process", false);   
                       
                        var color_msg = result[0].STATUS == 'E'? "warning":"success";
                        this.showNotification(  color_msg,  this.$t(result[0].ERRCODE) +": "+ result[0].ERRMSG, "", 5000 ); 
                        this.$refs.gridData_D_EPC.loadData();
                        this.$refs.gridData_d.loadData();
                    },
                    //------------------------------------------------
                    async onExcel2() 
                    {
                        let report_path = "report/sw/10/RPT_SW10030_2.xlsx";
                        let report_name = "RPT_SW10030_2.xlsx";
                        let headerRows = [];
                        let headerMaster = {};
                        let excel = [];

                        let headerRow1 = [
                            "No"
                            , "Service Charges", "", ""
                        ];

                        excel = [
                            {
                                sheet: 1,
                                
                                insertRows: [
                                    {   
                                        startRow: 3, by: "index", column: "E"
                                        , proc: "SZ_RPT_SW10030_1", params: [ this.TSZ_ORDER_PK  ]
                                        
                                    }
                                ],
                            }
                        ]
                        const res = await this.$axios.$get('/dso/makereport', { responseType: "blob", params:{ template:  report_path ,excel: JSON.stringify(excel), debug: true  } }  );

                        if(res && res.size > 0){
                            this._ExcelSaveAs(res, report_name); 
                        } else {
                            this.showNotification( "danger", this.$t("fail_to_export_report"), "", 4000 );
                        }

                    },
                   //-------------------------------------------------------------------
                    
            } 
    };
/*==================================================================== END export default  ========================================================================================*/ 
</script>
<!-- ================================================================= END SCRIPT  ============================================================================================== -->
 
