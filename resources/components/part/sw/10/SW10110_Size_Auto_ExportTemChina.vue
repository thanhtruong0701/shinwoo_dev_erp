<template>
  <v-container fluid class="px-0 pt-0" v-resize="onResize">

        <v-card class="pa-2 pt-0">
          <v-row align="center" justify="space-between" class="pt-2">
                <v-col md="2" class="pt-0">                   
                   <BaseSelect
                    :label="$t('company')"
                    v-model="tab01.lstCompany"
                    :lstData="dataList.lstCompany"
                    item-text="TEXT"
                    item-value="PK"                   
                  />          
                </v-col>                        
                 <v-col md="1" class="pt-0">                   
                   <BaseSelect
                    :label="$t('factory')"
                    v-model="tab01.lstDateType"
                    :lstData="dataList.lstDateType"
                    item-text="TEXT"
                    item-value="PK"                   
                  />          
                </v-col> 
                  
                <v-col md="2" class="pt-0">
				 <BaseDatePicker v-model="tab01.dtMTo" outlined :label="$t('date')" default></BaseDatePicker>          
                </v-col>

                <v-col md="2" class="pt-0">  
					<BaseInput
                      v-model="tab01.lstCCYConvert" 
                      :label="$t('time_from')"
                      number
                    >           
                  </BaseInput> 
                </v-col>                  
                <v-col md="2" class="pt-0">                   
                   <BaseInput
                      v-model="tab01.txtCCYUnit"
                      :label="$t('time_to')"
                      number
                    >           
                  </BaseInput>  
                </v-col>                     
                <v-col md="2" class="pt-0">                   
                  <v-row justify="end" class="mr-1">
                    <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="OnSearch(1)"/>   
                    <BaseButton icon_type="excel" :btn_text="$t('excel')" :disabled="isProcessing" @onclick="onReport"/> 
					<BaseButton icon_type="confirm" :btn_text="$t('approve')" :disabled="isProcessing" @onclick="onClickButton()"/>	
                  </v-row>   
                </v-col>                      
          </v-row>
        </v-card>       
            <v-card class="pt-0">
              <v-row align="center" justify="space-between" class="pt-0">
                <v-col cols="12" class="pt-0">
                  <DataGridView ref="grdDetail11" 
                    column-resizing-mode="widget" 
                    :auto_load="false" select_mode="MultipleHideBox" 
                    :max_height="this.windowHeight * 0.75"                    
                    sel_procedure="SW_SEL_SW10110_RPT_AU_SIZE_V2" 
                    upd_procedure="LG_UPD_9020OTM180_01_1"
                    @onRowPrepared = "onRowPreparedGrid11"
                    :filter_paras="[
								  tab01.lstCompany,
									tab01.lstCCYConvert,
									'',
									tab01.txtCCYUnit,								  
                                  tab01.dtMTo,
                                  tab01.lstDateType,
								  ''
                                  ]"                                                             
                    :header="dataList.headerGrid11"              
                    />                     
                </v-col>             
              </v-row>
            </v-card>
               
  </v-container>
</template>

<script>

export default {
  layout: "default",
  middleware: "user",
  
  components: {
   
  },
  data: () => ({
   
    isBegin: 1,
   
    dataList: {
      headerGrid01: [],
      headerGrid11: [],
     
      lstDateType: [], 
      lstCompany: [],
      lstCCYConvert:[]        
    },
    isShowMess: "N",
    selectedTab: "1",
    tab01: {
      lstCompany: "",
      lstDateType: "DEL",
      dtMTo: "",
      txtBasicCCY: ""  ,
      txtCCYUnit: "",
      lstCCY: "",
      txtExRateFrom: "",   
      txtCustomerName: "",
      lstCCYConvert: "",
      txtExRateTo: ""      
    },

    lstHeader01:[],
    limitHeight01: 0,
    limitHeight02: 0,
    objClick: "",
    cellDblClickgrdDetail01: {}
  }),
  created() {
    
    this.dataList.lstDateType = [{PK: 'DEL', TEXT: this.$t('tr_date')}, {PK: 'CDD', TEXT: this.$t('cd_date')}, {PK: 'BLD', TEXT: this.$t('bl_date')}];  
	
    this.SYS_SEL_LIST_COMPANY([ 'CN']);
	this.getListCodes(['CN',this.user.PK]);
    this.initView();
	//this.getHeader01('1');
  },

 watch: {      
    
   },
 
  mounted() {
    /*TODO: */
    
  },
  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
    
  },
  methods: {
    
    limitHeight() {
      this.limitHeight01 =  this.windowHeight - 250;
      this.limitHeight02 =  this.windowHeight - 250;
    },
    processHeader1(id) {      
                this.dataList.headerGrid01 = 
                [{
                     dataField: "PO_NO",
                    caption: this.$t("po_no"),
                    allowEditing: false,  
                    allowMerge: true,   
                    bgColor: "#FFFFFF",
                    width: 120
                 },                              
                 {
                    dataField: "SKU",
                    caption: this.$t("style_code"),
                    allowEditing: false,
                    allowMerge: true,
                    bgColor: "#FFFFFF",
                    width: 120          
                 },
                
                 {
                    dataField: "CHN_NAME",
                    caption: this.$t("season"),
                    allowEditing: false,
                    width: 120          
                 },
				 {
                    dataField: "GB_CODE",
                    caption: this.$t("gender"),
                    allowEditing: false,
                    width: 120          
                 },
				 {
                    dataField: "OGAC",
                    caption: this.$t("ogace_date"),
                    allowEditing: false,
                    width: 120          
                 },
				 {
                    dataField: "CP_DATE",
                    caption: this.$t("ogace_date_60"),
                    allowEditing: false,
                    width: 120          
                 },
				 {
                    dataField: "RTA",
                    caption: this.$t("rta"),
                    allowEditing: false,
                    width: 120          
                 },
                 {
                    dataField: "TOTAL_QTY",
                    caption: this.$t("total_qty"),
                    allowEditing: false,
                    width: 100,
                    formatFloat: 0,              
                 }                
               ];
                let fieldCaption = "";
                let fieldName = "";
                let fieldWidth = 85;                
                let next = 0;
                //let i = 1;
//console.log(this.lstHeader01);
				for (let i = 0; i < this.lstHeader01.length; i ++)
				{
					  fieldName =  this.lstHeader01[i]["FIELDNAME"];                 
					  fieldCaption = this.lstHeader01[i]["CAPTION"]; 
								
						//alert(this.fieldName);
						console.log(this.fieldName);
						
					if (this._hasValue(fieldCaption))
					{
					  this.dataList.headerGrid01.push(this.pushColumn(fieldName, fieldCaption, fieldWidth, 0));                                                                  
					}
				   
				}
              this.dataList.headerGrid01.push({dataField: "ZZZZ", caption: "-", allowEditing: false});                                          
              switch(id)      
              {
                case 1:
                  this.dataList.headerGrid11 = [...this.dataList.headerGrid01];                 
                  this.$refs.grdDetail11.reRender();  
                  this.$refs.grdDetail11.loadData();  
                break;               
              }              
      },
    
    pushColumn(fieldName, fieldCaption,fieldWidth, isNumber) {
                let col;
                if (isNumber === 0)
                {
                  col = {
                        dataField: fieldName,
                        caption: fieldCaption,
                        allowEditing: false,
                        width: fieldWidth,               
                    };
                }
                else
                {
                  col = {
                        dataField: fieldName,
                        caption: fieldCaption,
                        allowEditing: false,
                        width: fieldWidth, 
                        dataType: 'number',
                        formatFloat: isNumber,                     
                    }; 
                }
                return col;
            },

    initView() {
                this.dataList.headerGrid01 = 
                [{
                     dataField: "PO_NO",
                    caption: this.$t("po_no"),
                    allowEditing: false,  
                    allowMerge: true,   
                    bgColor: "#FFFFFF",
                    width: 120
                 },                              
                 {
                    dataField: "SKU",
                    caption: this.$t("style_code"),
                    allowEditing: false,
                    allowMerge: true,
                    bgColor: "#FFFFFF",
                    width: 120          
                 },
                
                 {
                    dataField: "CHN_NAME",
                    caption: this.$t("season"),
                    allowEditing: false,
                    width: 120          
                 },
				 {
                    dataField: "GB_CODE",
                    caption: this.$t("gender"),
                    allowEditing: false,
                    width: 120          
                 },
				 {
                    dataField: "OGAC",
                    caption: this.$t("ogace_date"),
                    allowEditing: false,
                    width: 120          
                 },
				 {
                    dataField: "CP_DATE",
                    caption: this.$t("ogace_date_60"),
                    allowEditing: false,
                    width: 120          
                 },
				 
				 {
                    dataField: "RTA",
                    caption: this.$t("rta"),
                    allowEditing: false,
                    width: 120          
                 },
                 {
                    dataField: "TOTAL_QTY",
                    caption: this.$t("total_qty"),
                    allowEditing: false,
                    width: 100,
                    formatFloat: 0,              
                 } 
               ];
               this.dataList.headerGrid11 = [...this.dataList.headerGrid01];                              
            },



    OnSearch(obj) {
        if(obj=='1')
        { 
		 this.onApprove();
		  //this.getHeader01(1);
         // this.$refs.grdDetail11.loadData(); 
		  
        }                   
    },
	onClickButton()
	{
		  this.onApprove();
	},
	async onApprove() {
		//alert("test auto size000")
		//this.$refs.confirmDialog.showConfirm(this.$t("do_you_want_to_approve_this_po"));  
		const dso = {
			  type: "process",
			  updpro: "SW_SEL_SW10110_RPT_AU_SIZE_V2",
			  para: [tab01.lstCompany,tab01.lstCCYConvert,'',tab01.txtCCYUnit,tab01.dtMTo,tab01.lstDateType,''],
			};
			let row = await this._dsoCall(dso, 'update', false);
			console.log('aa9');
			if (row) {  
					alert("test auto size333")
			  this.showNotification("success","Information",this.$t("success"));
			  //this.searchApprove();
			}
	},
    
    onRowClickDetail(row) {
      this.tab02.txtPartnerPK = row.data.CUST_PK;
      this.$refs.grdDetail22.loadData();  
    },

    onRowPreparedGrid11(e) {      
      this.onRowPreparedGrid_ALL(e);
    },
     onRowPreparedGrid22(e) {      
      this.onRowPreparedGrid_ALL(e);
    },
    
    onRowPreparedGrid_ALL(e) {      
      if(e.rowType === "data") {       
        if(e.data.ISTOTAL === 1) {
          e.rowElement.style.fontWeight = "bold"
          e.rowElement.style.background = "#FFE599";
       
        }        
      }  
    },


    async onGetCCYUnit() {  
        const  dso = {
          type: "process",
          updpro: "LG_PRO_9020OTM180_03",
          para: [
                 this.tab01.lstCCYConvert                 
                ]
        };
        let result01 = await this._dsoCall(dso, "process", false);     
        if (result01.length > 0)
        {
          this.tab01.txtCCYUnit = result01[0].CCY_UNIT;
        }
    },

     async getHeader01(obj) {
      if (obj === 1) 
      {
        const  dso = {
          type: "process",
          updpro: "SW_SEL_SW10110_RPT_HD_SIZE",
          para: [this.tab01.lstCompany,'','','',this.tab01.dtMTo,this.tab01.lstDateType,''] 
        };
        this.lstHeader01 = await this._dsoCall(dso, "process", false);     
        if (this.lstHeader01.length > 0)
        {
          //alert('header');
		  this.processHeader1(obj);
        }
      }    
    },
    
    /*NOTE: */
    async SYS_SEL_LIST_COMPANY(_param) {
      const dso = {
        type: "list",
        selpro: "sw_sel_list_company",
        para: _param,
      };
      this.dataList.lstCompany = await this._dsoCall(dso, "select", false);
      //this.dataList.lstCompany.unshift({PK: "", TEXT: ""});
      if (this.dataList.lstCompany.length > 0) {
        this.tab01.lstCompany = this.dataList.lstCompany[0]["PK"];        
      }  
     
    },

    async SYS_SEL_LIST_COMPANY_ALL() {
      const dso = {
        type: "list",
        selpro: "sys_get_company",
        para: null,
      };
      this.dataList.lstCompany = await this._dsoCall(dso, "select", false);
      this.dataList.lstCompany.unshift({PK: '', TEXT: this.$t('all')});
      if (this.dataList.lstCompany.length > 0) {
        this.tab01.lstCompany = this.dataList.lstCompany[0]["PK"];        
      }     
    },
	 async getListCodes(_param) {
      const dso = {
        type: "list",
        selpro: "sw_sel_factory",
        para: _param,
      };
      this.dataList.lstDateType = await this._dsoCall(dso, "select", false);
      this.dataList.lstDateType.unshift({PK: '', TEXT: this.$t('all')});
      if (this.dataList.lstDateType.length > 0) {
        this.tab01.lstDateType = this.dataList.lstDateType[0]["PK"];        
      }     
    },
	
	async search(paramsData) {

            
			this.getHeader01(1);
			alert("AAA");
			const dso = {
			  type: "process",
			  updpro: "LG_PRO_2010031_1",
			  para: [tab01.lstCompany,
					tab01.lstCCYConvert,
					'',
					tab01.txtCCYUnit,								  
					tab01.dtMTo,
					tab01.lstDateType,
					''],
			};
			let row = await this._dsoCall(dso, 'update', false);
			if (row) {        
			  this.showNotification("success","Information",this.$t("success"));
			  //this.searchApprove();
			}
			//this.$refs.grdDetail11.loadData(paramsData);
            /*  const dso = {
                type: "grid",
                selpro: "ac_sel_6045020_account",
                para: paramsData
              };
              this.acountList = await this._dsoCall(dso, "select", false);*/
        },
    async onReport() {       
        let p_param = [                                  
                                  this.tab01.dtMTo,
                                  this.tab01.lstCompany,
                                  this.tab01.lstDateType,
                                  this.tab01.txtCCYUnit,
                                  this.tab01.lstCCYConvert 
        ];
        let report_no = "01";
        let report_path = "";
        let report_name = "";   
        let report_name_ext = "xlsx";        
        let excel = [];

        switch(report_no) { 
          case "01": 
            report_path = "report/90/20/rpt_9020OTM180_01.xlsx"; 
            report_name = "rpt_9020OTM180_01." + report_name_ext; 
            excel = [
              {
                sheet: 1,               
                insertRange: [              
                  { range: "A1:T4", proc: "LG_RPT_COMPANY_INFO_02", params: [this.tab01.lstCompany], imageColumns: ["COM_PIC"]  },
                  { range: "A6:T6", proc: "LG_RPT_9020OTM180_01_1", params: [...p_param]  },//master
                ],
                insertRows: [
                  {                               
                    startRow: 9, proc: "LG_RPT_9020OTM180_01_2", params: [...p_param], subStyle: { font : {   bold: true   } }, 
                    sumColumns: [ "COL01","COL02","COL03","COL04","COL05","COL06","COL07","COL08","COL09","COL10","COL11","COL12" ],
                   total: [
                      {   column: "COMPANY_NAME", isDisplay: false, type: null, text:  null  , isMerge: true    },            
                      {   column: "TYPE01_NAME", isDisplay: false, type: null, text: null , isMerge: true   },               
                      {   column: null, isDisplay: false, type: "SUM", text: this.$t("total"), isGrandTotal: true  }        
                    ]

                  }
                ],
              },
            ];
            break;

          default: report_path=""; break;
        }

        if(!report_path) {
          this.showNotification(
              "danger",
              this.$t("please_select_report"),
              "",
              4000
            );
          return;
        }

        const res = await this.$axios.$get('/dso/makereport', { responseType: "blob", params:{ template:  report_path ,excel: JSON.stringify(excel), convert: report_name_ext  } }  );
        if(res){
          this._ExcelSaveAs(res, report_name);         
        } else {          
          this.showNotification( "danger", this.$t("fail_to_export_report"), "", 4000 );
        }

      },

  }
};
</script>

<style>
.btn {
  min-width: 100px;
  min-height: 30px;
  max-width: 100px;
  max-height: 30px;
}
</style>
