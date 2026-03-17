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
                    <BaseSelect outlined :label="$t('status')" v-model="sel_status" :lstData="cbo_status" item-text="NAME" item-value="CODE"/>                                                                     
                    <BaseButton icon_type="generate" :btn_text="$t('set_status')" @onclick= "onClickButton('onSet_status')" :disabled="isProcessing" />  
                    <BaseButton icon_type="generate" :btn_text="$t('interface')" @onclick= "onClickButton('onInterface')" :disabled="isProcessing" />  
                </div>
            </v-col>
            <v-col cols="4" class="pt-2">
                <div class="d-flex justify-end">
					 <BaseButton icon_type="excel" :btn_text="$t('Print_CSV')" @onclick="onReport_csv" :disabled="isProcessing" />  
                     <BaseButton icon_type="excel" :btn_text="$t('Print_PO')" @onclick="onReport" :disabled="isProcessing" />                                                                  
                    <!--BaseButton icon_type="excel" :btn_text="$t('excel')" @onclick="onExcel2" :disabled="isProcessing" /--> 
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
                <BaseGridView
                    ref="gridData"
                    :header="[ {  dataField: 'SEQ',       caption: this.$t('seq') , allowEditing: true ,width:70 },
                               {  dataField: 'PO_NO',       caption: this.$t('po_no') , allowEditing: true,width:210  },
                               {  dataField: 'PO_DATE',       caption: this.$t('po_date') , allowEditing: true ,width:120 },
                              
                           ]" 
                    select_mode="Single"
                    :auto_load="true"
                    :max_height="this.windowHeight - 190"
                    sel_procedure="SZ_SEL_SW10050_2_NOCACHE"
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
                        <BaseGridView
                            ref="gridData_d"
                            :header="[  {  dataField: 'SEQ',       caption: this.$t('seq') , allowEditing: true ,width:50 },
                                        {  dataField: 'PO_NO',       caption: this.$t('po_no') , allowEditing: true,width:200  },
                                        {  dataField: 'UPC_A_CODE',   caption: this.$t('upc_a_code') , allowEditing: true,width:130 },    
                                        {  dataField: 'UPC_EAN_13_CODE',  caption: this.$t('upc_ean_13_code') , allowEditing: true,width:130,visible: false},                                 
										{  dataField: 'QTY',       caption: this.$t('qty') , allowEditing: true ,formatFloat:'0',width:80},
                                        {  dataField: 'SEASON',   caption: this.$t('season') , allowEditing: true ,width:70},
										{  dataField: 'ITEM_DESCRIPTION',   caption: this.$t('item_description') , allowEditing: true }, 
										{  dataField: 'SIMPLIFIED_COLOR',   caption: this.$t('simplified_color') , allowEditing: true },
										{  dataField: 'STYLE_NUMBER', caption: this.$t('style_number') , allowEditing: true },
                                        {  dataField: 'INTERFACE_YN',   caption: this.$t('interface_yn') , allowEditing: true ,width:70,visible: false},
                                       
                                ]" 
                          
                            @cellClick="onCellClick_D"
                            :auto_load="true"
                            :max_height="this.windowHeight -570"
                            sel_procedure="SZ_SEL_SW10050_4_NOCACHE"
                            :filter_paras="[ this.TSZ_ORDER_PK]"  
                            :filterRow="true"
							:autocheckbox="false"
                            :multiselect="true"
                            :selectionmode="'checkbox'"
                            :headertype="1"
                            
                        />
                     </v-row>  
                      <v-row dense align="center" justify="space-between">
                         <BaseGridView
                                ref="gridData_D_EPC"
                                :header="[ {  dataField: 'SEQ',   caption: this.$t('seq') , allowEditing: true,width:60 },
                                           {  dataField: 'UPC_A_CODE',   caption: this.$t('upc_a_code') , allowEditing: false,width:120 },
                                           {  dataField: 'SERIAL_NO',     caption: this.$t('serial_no') , allowEditing: false,width:110 },
                                           {  dataField: 'EPC_NO',     caption: this.$t('epc_no') , allowEditing: false ,width:215},
										   {  dataField: 'TID',     caption: this.$t('TID') , allowEditing: false ,width:225},
										   {  dataField: 'GS1',  caption: this.$t('GS1') , allowEditing: false,width:260},
                                           {  dataField: 'PRINT_STATUS',     caption: this.$t('print_status') , allowEditing: false ,width:80},  
                                           {  dataField: 'INTERFACE_YN',     caption: this.$t('interface_yn') , allowEditing: false ,width:80,visible: false},  
                                        ]" 
                                
                                :auto_load="true"
                                :max_height="this.windowHeight/2 + 10"
                                sel_procedure="SZ_SEL_SW10050_3_NOCACHE"
                                :filter_paras="[ this.TSZ_ORDER_D_PK]"  
                                :filterRow="true"
								:autocheckbox="false"
                                :multiselect="true"
                                :selectionmode="'checkbox'"
                                :headertype="1"
                                
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
                cbo_status    : [],
                sel_status    : "", 
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
                this.getCompanyList();
                //this.sel_Company = this.user.TCO_COMPANY_PK;
                const commoncode = await this._getCommonCode2(["SZ006", ],1);
                this.cbo_status = commoncode[0];
               
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
                     
                        switch(action)
                        { 
                            case 'btnOnSearch':
                                this.$refs.gridData.loadData();
                            break;
                                                       
                            case 'onSet_status':
                                 this.LST_PK = "";
                                var arrRowSelected =  this.$refs.gridData_D_EPC.getSelectedRows();
                                
                                for(var i = 0; i < arrRowSelected.length; i++){
                                    this.LST_PK += arrRowSelected[i].PK + (i<(arrRowSelected.length-1) ? "," : "");
                                }
                                setTimeout(() => {
                                this.onSet_status();
                                }, 500);
                               //  this.$refs.gridData_D_EPC.loadData();
                            break;
                            case 'onInterface':
                                 this.LST_PK = "";
                                var arrRowSelected =  this.$refs.gridData_D_EPC.getSelectedRows();
                                
                                for(var i = 0; i < arrRowSelected.length; i++){
                                    this.LST_PK += arrRowSelected[i].PK + (i<(arrRowSelected.length-1) ? "," : "");
                                }
                                setTimeout(() => {
                                this.onSet_Interface();
                                }, 500);
                               // this.$refs.gridData_D_EPC.loadData();
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
                    async onSet_status() 
                    {
                     
                       const dso = 
                        { 
                            type: "process",  
                            updpro: "SZ_PRO_SW10050_printed", 
                            para: ["INSERT" ,this.TSZ_ORDER_PK, this.sel_status, this.LST_PK] 
                        };  
                        const result = await this._dsoCall(dso, "process", false);   
                        if (result[0].STATUS === "" || result[0].STATUS === null) {
                            this.showNotification('warning', this.$t('notification'), this.$t('not_process_susscess'), 500);
                        } else {
                           
                            this.showNotification('success', this.$t('notification'), this.$t('process_susscess'), 500);
                        }
                         this.$refs.gridData_D_EPC.loadData();
                    },
                    //------------------------------------------------
                    async onSet_Interface() 
                    {
                     
                       const dso = 
                        { 
                            type: "process",  
                            updpro: "SZ_PRO_SW10050_INTERFACE", 
                            para: ["INSERT" ,this.TSZ_ORDER_PK, this.sel_status, this.LST_PK] 
                        };  
                        const result = await this._dsoCall(dso, "process", false);   
                        if (result[0].STATUS === "" || result[0].STATUS === null) {
                            this.showNotification('warning', this.$t('notification'), this.$t('not_process_susscess'), 500);
                        } else {
                           
                            this.showNotification('success', this.$t('notification'), this.$t('process_susscess'), 500);
                        }
                         this.$refs.gridData_D_EPC.loadData();
                    },
					//-----------------print--csv----------------------------
					async onReport_csv() 
					{
							let p_param = [
									this.TSZ_ORDER_PK
									];
							let report_no = "01";
							let report_path = "";
							//let report_name = "";   
							let report_name_ext = "xlsx";        
							let excel = [];

					   
							let report_name = "rpt_SW10050_csv_"+this.txt_PO_NO;
							
							let report = "rpt_SW10050_csv";
									
									//rpt_swso410_EC_Carelabel_02
							  try{
							 // alert(p_param);
								this._ExcelSaveAs(await this.$axios.$get('/dso/makereport', {responseType: "blob", params: {
								  template: "report/sw/10/" + report + ".xlsx",
								  excel: JSON.stringify([{
									insertRange: [{
									  range: "A1:F6", proc: "SZ_RPT_SW10050_F_CONTENT", params: [...p_param]//SW_SEL_SW10110_export_custom
									}],
									insertRows: [{
										startRow: 2, proc: "SZ_RPT_SW10050_F_CONTENT", params: [...p_param], subStyle: { font : {   bold: true   } , fill: {
																type: 'pattern',
																pattern:'solid',
																fgColor : { argb: 'FFE599'},
																bgColor : { argb: 'FFE599'}
															  } }  
									  //startRow: 8, proc: "SW_SEL_SW10090_REPORT_FACT_DT", params: [...p_param]
									}]
								  }]),
								  convert: "xlsx"}
								}), report_name + "." + "xlsx");
							  } catch (e) {
								this.showNotification("danger", this.$t("fail_to_export_report"), "", 4000);
							  }
					},
					//------------------print--po----------------------------
                    async onReport() { 
						let p_param = [
								this.TSZ_ORDER_PK
								];
						let report_no = "01";
						let report_path = "";
						//let report_name = "";   
						let report_name_ext = "xlsx";        
						let excel = [];

					   
					let report_name = "RPT_SW10030_PO_"+this.txt_PO_NO;
					
					let report = "rpt_sw10030_v3";
							
							//rpt_swso410_EC_Carelabel_02
					  try{
					 // alert(p_param);
						this._ExcelSaveAs(await this.$axios.$get('/dso/makereport', {responseType: "blob", params: {
						  template: "report/sw/10/" + report + ".xlsx",
						  excel: JSON.stringify([{
							insertRange: [{
							  range: "A1:F6", proc: "SZ_RPT_SW10050_4_NOCACHE", params: [...p_param]//SW_SEL_SW10110_export_custom
							}],
							insertRows: [{
								startRow: 8, proc: "SZ_RPT_SW10050_3_NOCACHE", params: [...p_param], subStyle: { font : {   bold: true   } , fill: {
														type: 'pattern',
														pattern:'solid',
														fgColor : { argb: 'FFE599'},
														bgColor : { argb: 'FFE599'}
													  } }  
							  //startRow: 8, proc: "SW_SEL_SW10090_REPORT_FACT_DT", params: [...p_param]
							}]
						  }]),
						  convert: "xlsx"}
						}), report_name + "." + "xlsx");
					  } catch (e) {
						this.showNotification("danger", this.$t("fail_to_export_report"), "", 4000);
					  }
					  
					   
					  },
					 print() {},
                   //-------------------------------------------------------------------
                    //------------------------------------------------
                    async onExcel2() 
                    {
                        let report_path = "report/SW/10/RPT_SW10030_2.xlsx";
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
 
