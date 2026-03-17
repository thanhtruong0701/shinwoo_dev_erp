<!-- ================================================================= BEGIN DESIGN LAYOUT======================================================================================= -->
<template>
    <v-container fluid class="pa-0" v-resize="onResize">  
        <v-row no-gutters class=" pl-2 pt-2"> 
            <v-col cols="12">
                <v-card > 
                    <v-row   no-gutters> 
                         <v-col cols="3" class="pl-5 pt-3 pb-3">
                            <BaseSelect outlined :label="$t('client')" v-model="sel_Company" :lstData="cbo_Company" item-text="TEXT" item-value="PK"/>
                        </v-col>
                        <v-col cols="2" class="pl-5 pt-3 pb-3">
                            <BaseInput outlined :label="$t('po_no')" v-model="txt_PO_NO"/>
                        </v-col>
                        <v-col cols="2" class="pl-5 pt-3 pb-3">
                            <BaseDatePicker outlined start :label="$t('po_from_date')" v-model="txtpo_from_date"/>
                        </v-col>
                        <v-col cols="2" class="pl-5 pt-3 pb-3">
                           <BaseDatePicker outlined default :label="$t('po_to_date')" v-model="txtpo_to_date"/>
                        </v-col>
                        <v-col cols="3" class="pl-7 pt-3 pb-3">
                           
                            <div class="d-flex justify-end">
                                <BaseButton icon_type="search" :btn_text="$t('search')" @onclick="onClickButton('btnOnSearch')" :disabled="isProcessing" />
								<BaseButton icon_type="excel" :btn_text="$t('excel')" @onclick="OnPrint" :disabled="isProcessing" />	
                                <!--BaseButton icon_type="confirm" :btn_text="$t('confirm')" :disabled="false"  @onclick="onClickButton('btnConfirm')"/-->                                                                           
                            </div>
                        </v-col>
                    </v-row>
                     
                </v-card>  
            </v-col>
        </v-row> 
        <v-row  no-gutters >
            <v-col cols="4" class="pt-2">
                <DataGridView
                    ref="gridData_M"
                    :header="[ {  dataField: 'SEQ',       caption: this.$t('seq') , allowEditing: false  },
							   {  dataField: 'CLIENT_NAME', caption: this.$t('client_name') , allowEditing: false  },
                               {  dataField: 'PO_NO',       caption: this.$t('po_no') , allowEditing: false  },
                               {  dataField: 'PO_DATE',   caption: this.$t('po_date') , dataType: 'date', format: this.curLang.DATE_FORMAT,allowEditing: false }, 
                               
                            ]" 
                    select_mode="Multiple"
                    :auto_load="true"
                    :max_height="this.windowHeight - 185"
                    sel_procedure="SZ_SEL_SWNK020_2"
                    :filter_paras="[
                                    this.sel_Company, 
                                    this.txt_PO_NO,
                                    this.txtpo_from_date,
                                    this.txtpo_to_date,
                                   ]"  
                    :filterRow="true"
                    @cellClick="onCellClickGrdSearch"
                    
                  />
            </v-col>
            <v-col cols="8" class="pt-2">
                 <div class="d-flex flex-column justify-space-between">
                     <v-row dense align="center" justify="space-between">
                        <BaseGridView
                            ref="gridData_D"
                            :header="[ {  dataField: 'STT',       caption: this.$t('seq') , allowEditing: true  },
                               {  dataField: 'PRODUCT_NAME',       caption: this.$t('product_name') , allowEditing: true  },
							   {  dataField: 'COLOR_NAME',       caption: this.$t('color') , allowEditing: true ,},
                               {  dataField: 'UPPER_NAME',       caption: this.$t('upper') , allowEditing: true , },
                               {  dataField: 'OUTSOLE',   caption: this.$t('outsole') , allowEditing: true },
                               {  dataField: 'IMPLEMENTATION_STANDARDS',   caption: this.$t('implementation_standards') , allowEditing: true }, 
                               {  dataField: 'GENDER',   caption: this.$t('gender') , allowEditing: true },
                               {  dataField: 'SERIES', caption: this.$t('serial') , allowEditing: true },
                               {  dataField: 'SHOE_LOGO',   caption: this.$t('shoe_logo') , allowEditing: true },
                               {  dataField: 'RETAIL_PRICE', caption: this.$t('retail_price') , allowEditing: true,  formatFloat:'0' },
                               {  dataField: 'ANTI_TAMPERING',     caption: this.$t('anti_tampering') , allowEditing: true },
                               {  dataField: 'BARCODE_EAN',     caption: this.$t('barcode_ean') , allowEditing: true },
							   {  dataField: 'SIZE_CODE',     caption: this.$t('size_code') , allowediting: true },
							   {  dataField: 'SIZE_US',     caption: this.$t('size_us') , allowediting: true },
							   {  dataField: 'SIZE_UK',     caption: this.$t('size_uk') , allowediting: true },
							   {  dataField: 'SIZE_CHN',     caption: this.$t('size_chn') , allowediting: true },
							   {  dataField: 'SIZE_EUR',     caption: this.$t('size_eur') , allowediting: true },
							   {  dataField: 'NATION',     caption: this.$t('nation') , allowediting: true },
							   {  dataField: 'QR_NAME',     caption: this.$t('qr_name') , allowediting: true },
							   {  dataField: 'PICTURE_NAME',     caption: this.$t('picture_name') , allowEditing: true },
							   {  dataField: 'INNER_BOX_CODE',     caption: this.$t('inner_box_code') , allowEditing: true },
							   {  dataField: 'ID_QR_CODE',     caption: this.$t('id_qr_code') , allowEditing: true },
							   {  dataField: 'LEVEL_NAME',     caption: this.$t('level_name') , allowEditing: true },
							   {  dataField: 'PROCESSING_TECHNOLOGY',     caption: this.$t('processing_technology') , allowEditing: true },
							   {  dataField: 'INSPECTORS',     caption: this.$t('inspectors') , allowEditing: true },
							   
                           ]" 
                            select_mode="Single"   
                            :auto_load="true"
                            :max_height="this.windowHeight-165"
                            sel_procedure="SZ_SEL_SWNK020_1"
                            :filter_paras="[this.TSZ_ORDER_PK_list]"  
                            :filterRow="true"
                            @cellClick=""
                        />
                     </v-row>    
                      <!--v-row dense align="center" justify="space-between">
                            <BaseGridView
                                ref="gridData_D_EPC"
                                :header="[ {  dataField: 'SEQ',   caption: this.$t('seq') , allowEditing: false ,width:50},
                                        {  dataField: 'UPC_A_CODE',   caption: this.$t('upc_a_code') , allowEditing: false ,width:135},
                                        {  dataField: 'UPC_EAN_13_CODE',  caption: this.$t('upc_ean_13_code') , allowEditing: false,visible: false,width:120},
                                        {  dataField: 'SERIAL_NO',     caption: this.$t('serial_no') , allowEditing: false ,width:115},
                                        {  dataField: 'EPC_NO',     caption: this.$t('epc_no') , allowEditing: false ,width:210},
                                        {  dataField: 'GS1',     caption: this.$t('gs1') , allowEditing: false ,width:270},
                                        
                                    ]" 
                                select_mode="Single"
                                :auto_load="true"
                                :max_height="this.windowHeight/2 - 20"
                                sel_procedure="SZ_SEL_SW10030_3"
                                :filter_paras="[this.TSZ_ORDER_D_PK  ]"  
                                :filterRow="true"
                                
                             />
                     </v-row-->   
                 </div>     
            </v-col>
        </v-row>    
        
        <alert-dialog ref="alertDialog" ></alert-dialog>   
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
    const  tds = require("./../../../assets/epc-tds/index.js");
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
                cbo_Company    : [],
                sel_Company    : "", 
                PK             : "",
                dxg_data       : [], 
                listStatus     : [],
                selectList     : [],
                groupidlist    : [],
                TSZ_ORDER_D_PK   : "",
                TSZ_ORDER_PK   : "",
                TSZ_ORDER_PK_list   : "",
                txtpo_from_date  : "",
                txtpo_to_date  : "",
                txt_PO_NO      : "",
                txtCrt_by      : "",
                active         : [], 
                actionProcess  : '',
                autoSearch          : false,
                multiselect: false,
                sel_row         :-1,
                upc_qty         :0,
                epc_bulk_data:[],
                	 
            }),
        /*############### created #######################*/
            async created() 
            {  
                this.getCompanyList();
                //this.sel_Company = this.user.TCO_COMPANY_PK;
                
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
                //this.sel_Company = this.user.TCO_COMPANY_PK;
                 const seft = this;   
            }, 
        /*############### methods #######################*/
            methods: 
            {   
                    OnClick(e) 
                    {   
                        this.sel_row = e.rowIndex;    
                    }, 
                    async getCompanyList()
                    { 
                        const dso = { type: "list", selpro: "sp_sel_list_commoncode", para: ["SWWMT03"] };
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
                  
                    
                    /*************on Process Confirm*******************/
                     onClickButton(action) {

                        this.actionProcess = action;
                        this.actionDialog = true;
                        
                        switch(action)
                        { 
                            case 'btnOnSearch':
                                this.$refs.gridData_M.loadData();
                            break;
                            case 'btnConfirm':
                                this.TSZ_ORDER_PK_list = "";
                               
                                var arrRowSelected =  this.$refs.gridData_M.getSelectRowsData();
                                for(var i = 0; i < arrRowSelected.length; i++)
                                {
                                    this.TSZ_ORDER_PK_list += arrRowSelected[i].PK + (i<(arrRowSelected.length-1) ? "," : "");
                                }
                                this.onCreateEPC('epc');
                                this.OnConfirm('CONFIRM');
                                this.$refs.gridData_M.loadData();
                                this.$refs.gridData_D.loadData();
                            break;
                           
                            /*case 'btnPrint':
                                //this.OnPrint();
                            break;*/
                        }
                    },
                    //-----------------------------------------------------------
                    
                    onCellClickGrdSearch(_event)
                    {
                        this.TSZ_ORDER_PK = _event.data.PK;
                        this.TSZ_ORDER_PK_list ="" ;
                       var arrRowSelected =  this.$refs.gridData_M.getSelectRowsData();
                        for(var i = 0; i < arrRowSelected.length; i++)
                        {
                            this.TSZ_ORDER_PK_list += arrRowSelected[i].PK + (i<(arrRowSelected.length-1) ? "," : "");
                        }
                        this.$refs.gridData_D.loadData();
                    }, 
                    //-----------------------------------------------------------
                    async onCreateEPC(obj)
                    {
                        this.epc_bulk_data=[];
                        for(let row of this.$refs.gridData_D.dataList)
                        {
                            if (row.EPC_YN=='N')
                            {
                                //for (let i = 1; i <= row.QTY; i++)
								let i;
								let v_count=0;
								//const res;
								for ( i = row.CURRENT_QTY; i <= row.MAX_QTY; i++)  // 
                                {
                                    let insertRow = {};
                                    let tmp_serial="";
                                    let len_i=i + "";
									let len_upc=0;
									len_upc=row.UPC_A_CODE;
                                    insertRow.PK = "";
                                    insertRow.TSZ_ORDER_PK =row.TSZ_ORDER_PK;
                                    insertRow.TSZ_ORDER_D_PK =row.PK;
                                    insertRow.SEQ =i;
                                    insertRow.UPC_A_CODE =row.UPC_A_CODE;
                                    insertRow.UPC_EAN_13_CODE =row.UPC_EAN_13_CODE;
                                    if (len_i.length < 11)
                                    {
                                        for(let j=0;j<8-len_i.length;j++)
                                        {
                                            tmp_serial += '0';
                                        }
                                    }
                                    //tmp_serial = '1160' +tmp_serial+ i;//BEFORE tmp_serial = '1' +tmp_serial+ i; 
									tmp_serial = row.FACTORY_ID+''+tmp_serial+ i;//BEFORE tmp_serial = '1' +tmp_serial+ i; 
                                    insertRow.SERIAL_NO =tmp_serial
                                    let sgtin =  new tds.Sgtin96();  
                                    sgtin.setFilter(1)
                                    sgtin.setPartition(5)
									if (len_upc.length < 13)
                                    {
										sgtin.setGtin('00'+row.UPC_A_CODE);
									}
									else
									{
										sgtin.setGtin('0'+row.UPC_A_CODE);
									}
                                    sgtin.setSerial(tmp_serial);    
                                    insertRow.EPC_NO =sgtin.toHexString();
                                    this.epc_bulk_data.push([ insertRow.PK,insertRow.TSZ_ORDER_PK,insertRow.TSZ_ORDER_D_PK,insertRow.SEQ,insertRow.UPC_A_CODE,insertRow.UPC_EAN_13_CODE,insertRow.SERIAL_NO,insertRow.EPC_NO])
									
									v_count=v_count+1;
									if(v_count===999)
									{
										v_count=0;
										 const res1 = await this.$axios.$post("dso/bulkinsertpro", { proc: 'SZ_UPD_SW10020', para: this.epc_bulk_data });
										 this.epc_bulk_data=[];
									}
									else if((i) === row.MAX_QTY)
									{
										 const res2 = await this.$axios.$post("dso/bulkinsertpro", { proc: 'SZ_UPD_SW10020', para: this.epc_bulk_data });
									}
                                }
								this.epc_bulk_data=[];
                            }
							
							//this.$refs.gridData_D.loadData();							
                        }
                        //  console.log(this.epc_bulk_data)
                        //const res = await this.$axios.$post("dso/bulkinsertpro", { proc: 'SZ_UPD_SW10020', para: this.epc_bulk_data });
                        //  console.log(res)
                        this.$refs.gridData_D_EPC.loadData();
                    },    
                    //-----------------------------------------------------------
                    async onCellClick_D(_event)
                    {
                        this.TSZ_ORDER_D_PK = _event.data.PK;
                        this.$refs.gridData_D_EPC.loadData();
                    }, 
                    //----------------------------------------------
                    async OnConfirm(obj)
                    {
                        const dso = 
                        { 
                            type: "process",  
                            updpro: "SZ_PRO_SW10020_CONFIRM", 
                            para: ["INSERT" , this.TSZ_ORDER_PK_list] 
                        };  
                        const result = await this._dsoCall(dso, "process", false);   
                        var color_msg = result[0].ERRCODE == 'E'? "warning":"success";
                        this.showNotification(  color_msg,  this.$t(result[0].ERROR_ID) +": "+ result[0].ERROR_NAME, "", 5000 ); 
                    
                    },
                   //-------------------------------------------------------------------
                    async OnPrint22(){
                    const cbo_ReportExcel =  await this._getCommonCode('ACRPT01', this.sel_Company);  
                    var company_info = this.cbo_Company.find(x => x.PK == this.sel_Company);
                    var report_info = cbo_ReportExcel.find(x => x.CODE == "6070070");
                        if(report_info.VAL1 == "" || report_info.VAL1 == "null" || report_info.VAL1 == null || report_info.VAL1 == undefined)
                        { 
                            var MSG_ERR = "PLS_REGISTER_REPORT_ID_WITH_COMONCODE_" + "ACRPT01";
                            this.$refs.alertDialog.showAlert("error", "Error", MSG_ERR );
                            return;
                        }
                        var param =  
                        [
                            {   P_RPT_ID: report_info.VAL1, P_RPT_URL: report_info.VAL2, P_RPT_FILE: report_info.VAL3,
                                P_COMP_ID: company_info.PARTNER_ID, P_COMP_NM: company_info.TEXT, P_COMP_TAX: company_info.TAX_CODE, P_COMP_ADD: company_info.ADDR1,
                                P_COMPANY: this.sel_Company, P_ASSET_NM: this.txt_Asset_NM, P_ASSET_TYPE: this.sel_Assettype
                            }
                        ];
                        var file_nm = report_info.VAL1+"_"+report_info.VAL3+"_"+this.user.USER_ID+".xlsx";
                        var url_path = "/report/"+  report_info.VAL1 + "/" + report_info.VAL3;
                            try 
                            {  
                            const result = await this.$axios.$get(url_path, { responseType : "blob", params: {para: param}});  
                            if (result) 
                            {  
                                this._ExcelSaveAs(result, file_nm); 
                            }
                            else 
                            { 
                                this.showNotification( "danger", this.$t("fail_to_export_report"), "", 4000 );
                            }
                        }  
                        catch (e) 
                        { 
                            this.showNotification("danger", e.message, "", 4000);
                        }
                    },
					//=============report======================
					async OnPrint() {
									let p_param = [this.TSZ_ORDER_PK];
										let report_no = "01";
										let report_path = "";
										let report_name = "";   
										let report_name_ext = "xlsx";        
										let excel = [];

									let report = "rpt_swnk020_csv";
										report_name = "rpt_swnk020_csv"; 
										
									  try{
									  //alert(p_param);
										this._ExcelSaveAs(await this.$axios.$get('/dso/makereport', {responseType: "blob", params: {
										  template: "report/sw/nk/" + report + ".xlsx",
										  excel: JSON.stringify([{
											insertRange: [{
											  range: "A2:F2", proc: "SZ_SEL_SWNK010_1", params: [...p_param]//SW_SEL_SW10110_export_custom
											}],
											insertRows: [{
												startRow: 2, proc: "SZ_SEL_SWNK010_1", params: [...p_param], stringColumns: [ "PRODUCT_NAME","COLOR_NAME"], subStyle: { font : {   bold: true   } , fill: {
																		type: 'pattern',
																		pattern:'solid',
																		fgColor : { argb: 'FFE599'},
																		bgColor : { argb: 'FFE599'}
																	  } }
											},
											]
										  }]),
										  convert: "xlsx"}
										}), report_name + "." + "xlsx");
									  } catch (e) {
										this.showNotification("danger", this.$t("fail_to_export_report"), "", 4000);
									  }
			  },
			 print() {},
					
            } 
    };
/*==================================================================== END export default  ========================================================================================*/ 
</script>
<!-- ================================================================= END SCRIPT  ============================================================================================== -->
 
