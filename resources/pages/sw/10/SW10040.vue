<!-- ================================================================= BEGIN DESIGN LAYOUT======================================================================================= -->
<template>
    <v-container fluid class="pa-0" v-resize="onResize">  
        <v-row no-gutters class=" pl-2 pt-2"> 
            <v-col cols="12">
                <v-card > 
                    <v-row   no-gutters> 
                       
                        <v-col cols="2" class="pl-5 pt-3 pb-3">
							<BaseSelect outlined :label="$t('client')" v-model="sel_Company" :lstData="cbo_Company" item-text="TEXT" item-value="PK"/>
                        </v-col>
						<v-col cols="2" class="pl-5 pt-3 pb-3">
							<BaseInput outlined :label="$t('po_no')" v-model="txt_PO_NO"/>
                        </v-col>
                        <v-col cols="3" class="pl-5 pt-3 pb-3">
                            <div class="d-flex justify-end">
                                <BaseDatePicker outlined start :label="$t('frm_date')" v-model="txtFrm_dt"/>
                                <BaseDatePicker outlined :label="$t('to_date')" v-model="txtTo_dt" default/>
                            </div>    
                        </v-col>
                       
                        <v-col cols="5" class="pl-7 pt-3 pb-3">
                           
                        </v-col>
                    </v-row>
                    <v-row  no-gutters>
                      
                       
                    </v-row> 
                   
                </v-card>  
            </v-col>
        </v-row> 
         <v-row  no-gutters >
            <v-col cols="4" class="pt-2">
                <div class="d-flex justify-end">
                    <BaseButton icon_type="search" :btn_text="$t('search')" @onclick="onClickButton('btnOnSearch')" :disabled="isProcessing" />  
                    <BaseButton icon_type="add_new" :btn_text="$t('addnew')" :disabled="false" @onclick="onClickButton('btnAddNew')"/> 
                    <BaseButton icon_type="save" :btn_text="$t('save')" :disabled="false"  @onclick="onClickButton('btnSave')"/>                                                                           
                    <BaseButton icon_type="delete" :btn_text="$t('delete')" :disabled="false"  @onclick="onClickButton('btnDelete')"/> 
                </div>
            </v-col>
            <v-col cols="4" class="pt-2">
                <div class="d-flex justify-end">
                    <v-col cols="4">
                        <BaseSelect :label="$t('select_type')" v-model="m_type" :lstData="cbo_type" item-text="NAME" item-value="CODE"  @change="onChangeType" />
                    </v-col>
                    <v-col cols="4"  v-show="v_show=='SEASON'">
                        <BaseSelect :label="$t('season')" v-model="selected_season" :lstData="cbo_season" item-text="NAME" item-value="CODE" />
                    </v-col>
                    <v-col cols="4"  v-show="v_show=='ORIGIN'">
                        <BaseSelect :label="$t('origin')" v-model="selected_origin" :lstData="cbo_origin" item-text="NAME" item-value="CODE" />
                    </v-col>
                   
                    <v-col cols="4"  v-show="v_show=='FACTORY_ID'">
                        <BaseSelect :label="$t('factory_id')" v-model="selected_factory" :lstData="cbo_factory" item-text="NAME" item-value="CODE" />
                    </v-col>
                    <v-col cols="5"  v-show="v_show=='UPC_A_CODE'">
                         <BaseInput outlined :label="$t('upc_a_code')" v-model="txt_UPC_A_CODE"/>
                    </v-col>
                     <v-col cols="5"  v-show="v_show=='SIMPLIFIED_COLOR'">
                         <BaseInput outlined :label="$t('simplified_color')" v-model="txt_simplified_color"/>
                    </v-col>
                    <v-col cols="5"  v-show="v_show=='STYLE_NUMBER'">
                         <BaseInput outlined :label="$t('style_number')" v-model="txt_style_number"/>
                    </v-col>
                     <v-col cols="5"  v-show="v_show=='UPC_EAN_13_CODE'">
                         <BaseInput outlined :label="$t('upc_ean_13_code')" v-model="txt_upc_ean_13_code"/>
                    </v-col>
                    <v-col cols="1">
                        <BaseButton icon_type="set" onlyIcon :disabled="btn_set" @onclick="onSet" />
                    </v-col>
                </div>
            </v-col>    
            <v-col cols="4" class="pt-2">
                <div class="d-flex justify-end">
                    <BaseButton icon_type="add_new" :btn_text="$t('addnew')" :disabled="false" @onclick="onClickButton('btnAddNewd')"/> 
                    <BaseButton icon_type="save" :btn_text="$t('save')" :disabled="false"  @onclick="onClickButton('btnSave_d')"/>                                                                           
                    <BaseButton icon_type="delete" :btn_text="$t('delete')" :disabled="false"  @onclick="onClickButton('btnDelete_d')"/> 
                </div>
            </v-col>
        </v-row>    
        <v-row  no-gutters >
            <v-col cols="4" class="pt-2">
                <DataGridView
                    ref="gridData"
                     :header="[ {  dataField: 'SEQ',       caption: this.$t('seq') , allowEditing: true  },
                               {  dataField: 'PO_NO',       caption: this.$t('po_no') , allowEditing: true  },
                               {  dataField: 'PO_DATE',       caption: this.$t('po_date') , allowEditing: true ,dataType:'date' },
                               {  dataField: 'CLIENT_NAME',       caption: this.$t('client_name') , allowEditing: true  },
                           ]" 
                    select_mode="Single"
                    :auto_load="true"
                    :max_height="this.windowHeight - 250"
                    sel_procedure="SZ_SEL_SW10040_2"
                    upd_procedure="SZ_UPD_SW10040_M"
                    :filter_paras="[
                       this.sel_Company, 
                       this.txt_PO_NO,
                       this.txtFrm_dt,
                       this.txtTo_dt,
                    ]"  
                    :filterRow="true"
                    @cellClick="onCellClickGrdSearch"
                    :update_paras="[
                        'PK'                    ,
                        'PO_NO'                   ,
                        'PO_DATE'                 ,
                        'CLIENT_NAME'              ,
                        'COMPANY_PK'                  ,
                    ]
                    "
                  />
            </v-col>
             <v-col cols="8" class="pt-2">
                <DataGridView
                    ref="gridData_d"
                     :header="[ {  dataField: 'SEQ',       caption: this.$t('seq') , allowEditing: true  },
                               {  dataField: 'PO_NO',       caption: this.$t('po_no') , allowEditing: true  },
							   {  dataField: 'QTY_NORMAL',       caption: this.$t('qty') , allowEditing: true ,formatFloat:'0'},
                               {  dataField: 'QTY',       caption: this.$t('qty_production') , allowEditing: true ,formatFloat:'0'},
                               {  dataField: 'SEASON'  ,  caption: this.$t('season')    , allowEditing: true,width:200,
                                                       lookup: { dataSource: this.cbo_season, displayExpr:'NAME', valueExpr: 'CODE' },    
                                                    },
                               {  dataField: 'UPC_A_CODE',   caption: this.$t('upc_a_code') , allowEditing: true ,width:120,fixed:true},
                               {  dataField: 'ITEM_DESCRIPTION',   caption: this.$t('item_description') , allowEditing: true,width:120 }, 
                               {  dataField: 'SIMPLIFIED_COLOR',   caption: this.$t('simplified_color') , allowEditing: true,width:120 },
                               {  dataField: 'STYLE_NUMBER', caption: this.$t('style_number') , allowEditing: true ,width:120},
                               
                               {  dataField: 'UPC_EAN_13_CODE',  caption: this.$t('upc_ean_13_code') , allowEditing: true,width:120},
							   {  dataField: 'FACTORY_ID',     caption: this.$t('factory_id') , allowEditing: true },
                               {  dataField: 'COUNTRY_OF_ORIGIN',     caption: this.$t('country_of_origin') , allowEditing: true },
                               {  dataField: 'RETAIL_PRICE', caption: this.$t('retail_price') , allowEditing: true,  formatFloat:'0' },
                               
                           ]" 
                    select_mode="Multiple"
                    :auto_load="true"
                    :max_height="this.windowHeight - 250"
                    sel_procedure="SZO_SEL_SW10010_1"
                    upd_procedure="SZ_UPD_SW10010_D"
                    :filter_paras="[ this.TSZ_ORDER_PK]"  
                    :filterRow="true"
                    @cellDblClick="openDialog"
                    :update_paras="[
                        'TSZ_ORDER_PK',
                        'PK',
                        'SEQ'                    ,
                        'PO_NO'                   ,
                        'QTY'                     ,
                        'SEASON'                  ,
                        'ITEM_DESCRIPTION'        ,
                        'SIMPLIFIED_COLOR'        ,
                        'STYLE_NUMBER'            ,
                        'UPC_A_CODE'              ,
                        'UPC_EAN_13_CODE'         ,
                        'FACTORY_ID'              ,
                        'COUNTRY_OF_ORIGIN'       ,
                        'RETAIL_PRICE'            ,
                       
                    ]
                    "
                  />
            </v-col>
        </v-row>    
        
        <alert-dialog ref="alertDialog" ></alert-dialog>   
        <confirm-dialog ref="refConfirmDialog"     @onConfirm="confirmMaster" ></confirm-dialog>
         <upd-infor ref="refUpdInfor" @callBackData="CallBackP" ></upd-infor>
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
    import UpdInfor             from '@/pages/sw/10/SW10040_POP01';
    
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
                GwImportExcelFile,
                UpdInfor
            },
        /*############### data ##########################*/
            data: () => 
            ({ 
                btn: null,
                cbo_Company    : [],
                sel_Company    : "", 
                txt_PO_NO   : "", 
                txt_UPC_A_CODE: "",
                txt_simplified_color: "",
                txt_style_number: "",
                txt_upc_ean_13_code: "",
                PK             : "",
                txtFrm_dt   : "",
                txtTo_dt    : "",
                dxg_data       : [], 
                
                listStatus     : [],
                selectList     : [],
                groupidlist    : [],
                txtFrmCrt_dt   : "",
                txtToCrt_dt    : "",
                txtCrt_by      : "",
                active         : [], 
                actionProcess  : '',
                l_tac_gffa_mst : null,
                /*****Pop Up *****/
                autoSearch          : false,
                multiselect: false,
                sel_row         :-1,
                TSZ_ORDER_PK : null,
                cbo_type_date: [],
                m_type:"",
                selected_season:"",
                selected_origin:"",
                selected_factory:"",
                cbo_type: [],
                cbo_season: [],
                cbo_origin: [],
                cbo_factory: [],
                v_show:"SEASON",
                btn_set: false,
            	 
            }),
        /*############### created #######################*/
            async created() 
            {  
                this.getCompanyList();
                 this.getListCodes();
                //this.sel_Company = this.user.TCO_COMPANY_PK;
                this.cbo_type    = [{CODE: "SEASON", NAME: this.$t('season')}
                                    , {CODE: "ORIGIN", NAME: this.$t('origin')}
                                    , {CODE: "FACTORY_ID", NAME: this.$t('factory_id')}
                                    , {CODE: "UPC_A_CODE", NAME: this.$t('upc_a_code')}
                                    , {CODE: "SIMPLIFIED_COLOR", NAME: this.$t('simplified_color')}
                                    , {CODE: "STYLE_NUMBER", NAME: this.$t('style_number')}
                                    , {CODE: "UPC_EAN_13_CODE", NAME: this.$t('upc_ean_13_code')}
                                    ];   
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
                    CallBackP()
                    {
                        console.log('CallBackP');
                        this.$refs.gridData_d.loadData();
                    },
                    /*begin: getListCodes */
                    async openDialog(row) 
                    {
                        this.$refs.refUpdInfor.pop_tsz_order_d_pk = row.data.PK;
                        
                        this.$refs.refUpdInfor.pop_upc_a_code = row.data.UPC_A_CODE;
                        this.$refs.refUpdInfor.pop_item_description = row.data.ITEM_DESCRIPTION;
                        this.$refs.refUpdInfor.pop_simplified_color = row.data.SIMPLIFIED_COLOR;
                        this.$refs.refUpdInfor.pop_style_number = row.data.STYLE_NUMBER;
                        this.$refs.refUpdInfor.pop_po_date = row.data.PO_DATE;
                        this.$refs.refUpdInfor.pop_po_number = row.data.PO_NO;
                        this.$refs.refUpdInfor.pop_po_qty = row.data.QTY;
                        this.$refs.refUpdInfor.pop_selected_season = row.data.SEASON;
                        this.$refs.refUpdInfor.pop_selected_factory = row.data.FACTORY_ID;
                        this.$refs.refUpdInfor.pop_selected_origin = row.data.COUNTRY_OF_ORIGIN;
                        
                        this.$refs.refUpdInfor.pop_retail_price = row.data.RETAIL_PRICE;
                        this.$refs.refUpdInfor.pop_ean_13_code = row.data.UPC_EAN_13_CODE;
                        this.$refs.refUpdInfor.pop_seq = row.data.SEQ;
                         this.$refs.refUpdInfor.pop_tsz_order_pk = row.data.TSZ_ORDER_PK;
                        this.$refs.refUpdInfor.dialogIsShow = true; 

                    },
                    async getListCodes() 
                    {
                        let lstCommoncode = await this._getCommonCode2(
                            ["SZ002", "SZ003","SZ004"],1);
                        this.cbo_season = lstCommoncode[0];
                        this.cbo_origin = lstCommoncode[1];
                        this.cbo_factory = lstCommoncode[2];
                    },
                    /*end: getListCodes */
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
                  
                    /*--------------------------------------- */
                    onChangeType()
                    {
                        switch(this.m_type)
                        {
                            case "SEASON":
                                this.v_show="SEASON";
                            break;
                            case "ORIGIN":
                                this.v_show="ORIGIN";
                            break;
                            case "FACTORY_ID":
                                this.v_show="FACTORY_ID";
                            break;
                            case "UPC_A_CODE":
                                this.v_show="UPC_A_CODE";
                            break;
                            case "SIMPLIFIED_COLOR":
                                this.v_show="SIMPLIFIED_COLOR";
                            break;
                            case "STYLE_NUMBER":
                                this.v_show="STYLE_NUMBER";
                            break;
                            case "UPC_EAN_13_CODE":
                                this.v_show="UPC_EAN_13_CODE";
                            break;
                            
                        }   
                    },   
                    /*-------------------------------------*/
                    onSet() 
                    {   
                        switch(this.m_type)
                        {
                            case "SEASON":
                               this.$refs.gridData_d.setCellSelected("SEASON",this.selected_season);
                            break;
                            case "ORIGIN":
                                console.log(this.selected_origin)
                                this.$refs.gridData_d.setCellSelected("COUNTRY_OF_ORIGIN",this.selected_origin);
                            break;
                            case "FACTORY_ID":
                                this.$refs.gridData_d.setCellSelected("FACTORY_ID",this.selected_factory);
                            break;
                            case "UPC_A_CODE":
                                this.$refs.gridData_d.setCellSelected("UPC_A_CODE",this.txt_UPC_A_CODE);
                            break;
                            case "SIMPLIFIED_COLOR":
                                this.$refs.gridData_d.setCellSelected("SIMPLIFIED_COLOR",this.txt_simplified_color);
                            break;
                            case "STYLE_NUMBER":
                                this.$refs.gridData_d.setCellSelected("STYLE_NUMBER",this.txt_style_number);
                            break;
                            case "UPC_EAN_13_CODE":
                                this.$refs.gridData_d.setCellSelected("UPC_EAN_13_CODE",this.txt_upc_ean_13_code);
                            break;
                            
                        }   
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
                            case 'btnAddNew':
                                this.$refs.gridData.reRender();
                                this.$refs.gridData.addRowStruct({
                                    ROWNUM                    : this.$refs.gridData.getDataSource().length + 1,
                                    PK                     : "", 
                                    PO_NO                  : "",				
                                    PO_DATE                : "",
                                    CLIENT_NAME            : "",
                                    COMPANY_PK             :  this.user.TCO_COMPANY_PK,//this.sel_Company,
                                 
                                });
                               // this.confirmMaster(); 
                            break;
                            case 'btnAddNewd':
                                this.$refs.gridData_d.reRender();
                                this.$refs.gridData_d.addRowStruct({
                                    TSZ_ORDER_PK           :this.TSZ_ORDER_PK ,
                                    PK                     : "", 
                                    SEQ                    :  this.$refs.gridData_d.getDataSource().length + 1,				
                                    PO_NO                :this.txt_PO_NO ,
                                    QTY                  :"",
                                    SEASON               :"",
                                    ITEM_DESCRIPTION     :"",
                                    SIMPLIFIED_COLOR     :"",
                                    STYLE_NUMBER         :"",
                                    UPC_A_CODE           :"",
                                    UPC_EAN_13_CODE      :"",
                                    FACTORY_ID           :"",
                                    COUNTRY_OF_ORIGIN    :"",
                                    RETAIL_PRICE         :"",
                                 
                                });
                               // this.confirmMaster(); 
                            break;
                            case 'btnSave':
                                this.btn = "btn1";
                                this.$refs.refConfirmDialog.showConfirm(this.$t("do_you_want_to_save"));
                            break;
                            case 'btnDelete':
                                this.$refs.refConfirmDialog.showConfirm(this.$t("do_you_want_to_delete"));
                            break;
                            case 'btnSave_d':
                              
                                this.$refs.refConfirmDialog.showConfirm(this.$t("do_you_want_to_save"));
                            break;
                            case 'btnDelete_d':
                                this.$refs.refConfirmDialog.showConfirm(this.$t("do_you_want_to_delete"));
                            break;
                            case 'btnUpdAll':
                                this.btn = "btn2";
                                this.$refs.refConfirmDialog.showConfirm(this.$t("do_you_want_update_all")); 
                            break;
                            case 'btnDeleteAll':
                                this.$refs.refConfirmDialog.showConfirm(this.$t("do_you_want_to_delete_all_you_choose_from " + this.txtFrmCrt_dt + "to" + this.txtToCrt_dt + "?"));
                            break;
                            case 'btnPrint':
                                this.OnPrint();
                            break;
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
                    async confirmMaster() {
                        if (this.actionProcess == 'btnSave')
                        {
                            //this.ON_SAVE()
                            this.$refs.gridData.saveData();
                        }
                         if (this.actionProcess == 'btnSave_d')
                        {
                            //this.ON_SAVE()
                            this.$refs.gridData_d.saveData();
                        }
                        if (this.actionProcess == 'btnUpdAll')
                        {
                            this.$refs.gridData.saveData();
                        } 
                        if (this.actionProcess === 'btnDelete') 
                        {
                            
                            this.$refs.gridData.deleteRows();
                        }
                         if (this.actionProcess === 'btnDelete_d') 
                        {
                            
                            this.$refs.gridData_d.deleteRows();
                        }
                        if (this.actionProcess == 'btnDeleteAll')
                        {
                            const dso = {
                                type: "process",
                                updpro: "AC_PRO_6070070_1",
                                para: [this.l_tac_gffa_mst, this.sel_Assettype, this.sel_Company, this.lstBizPlace],
                            };
                            const result = await this._dsoCall(dso, "process", false);
                            if (result != undefined && result && result[0].STATUS) {
                                this.showNotification(
                                        "success",
                                        this.$t(result[0].STATUS),
                                        "",
                                        5000
                                    );
                                this.onClickButton('btnOnSearch');
                            }
                        } 
                    },
                    onAfterImport(obj) {
                        this.onClickButton('btnOnSearch'); 
                    },
                   //-------------------------------------------------------------------
                    async OnPrint(){
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
                    }
            } 
    };
/*==================================================================== END export default  ========================================================================================*/ 
</script>
<!-- ================================================================= END SCRIPT  ============================================================================================== -->
 
