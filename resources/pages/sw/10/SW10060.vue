<template>
  <v-container fluid class="px-0 pt-0" v-resize="onResize">

        <v-card class="pa-1 pt-0">
          <v-row align="center" justify="space-between" class="pt-2"> 
                <v-col md="2" class="pt-0">                   
                   <BaseSelect
                    :label="$t('Customer')"
                    v-model="tab01.lstCompany"
                    :lstData="dataList.lstCompany"
                    item-text="NAME"
                    item-value="CODE"                   
                  />          
                </v-col>                        
                 <!--v-col md="2" class="pt-2">                   
                   <BaseSelect
                    :label="$t('Location')"
                    v-model="tab01.lstLocation"
                    :lstData="dataList.lstLocation"
                    item-text="TEXT"
                    item-value="PK"                   
                  />          
                </v-col--> 
				
				<!--v-col md="1" class="pt-2">                   
                   <BaseSelect
                    :label="$t('Date Type')"
                    v-model="tab01.lstDateType"
                    :lstData="dataList.lstDateType"
                    item-text="TEXT"
                    item-value="PK"                   
                  />          
                </v-col-->
                  
                <v-col md="2" class="pt-0">
                  <BaseDatePicker v-model="tab01.dtOrderFrom"  default :label="$t('date_from')"></BaseDatePicker>             
                </v-col>

                <v-col md="2" class="pt-0"> 
					<BaseDatePicker v-model="tab01.dtOrderTo"  default :label="$t('to_date')"></BaseDatePicker>     
                  
                </v-col>                  
                <v-col md="2" class="pt-0">                   
                   <BaseInput
                      v-model="tab01.txtOrderNo"
                      :label="$t('Order_No')"
                      
                    >           
                  </BaseInput>  
                </v-col>  
				<!--v-col md="2" class="pt-2">                   
                   <BaseSelect
                    :label="$t('Label_Type')"
                    v-model="tab01.lstLabelType"
                    :lstData="dataList.lstLabelType"
                    item-text="NAME"
                    item-value="CODE"                   
                  />          
                </v-col--> 				
                <v-col md="2" class="pt-0">                   
                  <v-row justify="end" class="mr-1">
                    <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="OnSearch(1)"/>   
                    <BaseButton icon_type="excel" :btn_text="$t('excel')" :disabled="isProcessing" @onclick="onReport"/>                  
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
                    sel_procedure="SW_SEL_SW10060_NOCACHE" 
                    upd_procedure="LG_UPD_9020OTM180_01_1"
                    @onRowPrepared = "onRowPreparedGrid11"
                    :filter_paras="[
                                  tab01.lstCompany,
								  tab01.dtOrderFrom,
								  tab01.dtOrderTo,
                                  tab01.txtOrderNo
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
     
      lstLocation: [],
	  lstDateType: [],
      lstLabelType: [],	  
      lstCompany: [],
      dtOrderTo:[]        
    },
    isShowMess: "N",
    selectedTab: "1",
    tab01: {
      lstCompany: "",
      lstLocation: "",
	  lstDateType : "",
	  lstLabelType: "",
      dtOrderFrom: "",
      txtBasicCCY: ""  ,
      txtOrderNo: "",
      lstCCY: "",
      txtExRateFrom: "",   
      txtCustomerName: "",
      dtOrderTo: "",
      txtExRateTo: ""      
    },

    lstHeader01:[],
    limitHeight01: 0,
    limitHeight02: 0,
    objClick: "",
    cellDblClickgrdDetail01: {}
  }),
  async created() { 
    [this.dataList.lstCompany] = await this._getCommonCode2(["SWWMT02"]);
	
    this.dataList.lstDateType = [{PK: '1', TEXT: 'Delivery Date'},{PK: '2', TEXT: 'Order Date'}];
	//this.dataList.lstCompany = [{PK: '', TEXT: 'ALL'},{PK: 'PANKO', TEXT: 'PANKO'}, {PK: 'NOBLAND', TEXT: 'NOBLAND'}, {PK: 'YUPOONG', TEXT: 'YUPOONG'}, {PK: 'YAKJIN', TEXT: 'YAKJIN TRADING'}];
	this.dataList.lstLocation = [{PK: '', TEXT: 'ALL'},{PK: 'HÀ NỘI', TEXT: 'HÀ NỘI'}, {PK: 'HỒ CHÍ MINH', TEXT: 'HỒ CHÍ MINH'}, {PK: 'QUẢNG NAM', TEXT: 'QUẢNG NAM'}, {PK: 'ĐỒNG NAI', TEXT: 'ĐỒNG NAI'}, {PK: 'LONG AN', TEXT: 'LONG AN'}]; 
	/*this.dataList.lstLabelType = [{PK: '', TEXT: 'ALL'},{PK: '01', TEXT: '1/단독세탁라벨KK-Caution Label'}, {PK: '02', TEXT: '2/의류라벨EC-EC Carelabel'}, {PK: '03', TEXT: '3/의류라벨KK_Y-Korean Carelabel RFID'}, {PK: '04', TEXT: '4/의류라벨KK_N-Korean Carelabel Normal'}, 
	{PK: '05', TEXT: '5/합격증EC_Y-Price Tag - China RFID'}, {PK: '06', TEXT: '6/합격증EC_N-Price Tag - China Normal'}, 
	{PK: '07', TEXT: '7/의류가격택1KK_Y-Price Tag - Global RFID'}, {PK: '08', TEXT: '8/의류가격택1KK_N-Price Tag - Global Normal'},
	{PK: '09', TEXT: '9/ACC라벨EC-EC Carelabel'}, {PK: '10', TEXT: '10/ACC라벨OO_Y-Korean Carelabel RFID'},{PK: '11', TEXT: '11/ACC라벨OO_N-Korean Carelabel Normal'},
	{PK: '12', TEXT: '12/ACC가격택KK_Y-Price Tag - Global RFID'}, {PK: '13', TEXT: '13/ACC가격택KK_N-Price Tag - Global Normal'}
	];*/
	
	/*01 - 단독세탁라벨KK-Caution Label
	02 - 의류라벨EC-EC Carelabel
	03 - 의류라벨KK_Y-Korean Carelabel RFID
	04 - 의류라벨KK_N-Korean Carelabel Normal
	05 - 합격증EC_Y-Price Tag - China RFID
	06 - 합격증EC_N-Price Tag - China Normal
	07 - 의류가격택1KK_Y-Price Tag - Global RFID
	08 - 의류가격택1KK_N-Price Tag - Global Normal 
	09 -ACC라벨EC - EC Carelabel
	10- ACC라벨OO_Y - Korean Carelabel RFID
	11 - ACC라벨OO_N-Korean Carelabel Normal
	12 - ACC가격택KK_Y-Price Tag - Global RFID
	13 - ACC가격택KK_N-Price Tag - Global Normal
	*/

	//this.dataList.lstLabelType = [{PK: '', TEXT: 'ALL'},{PK: 'HANOI', TEXT: 'HÀ NỘI'}, {PK: 'HCM', TEXT: 'HỒ CHÍ MINH'}];
	
   
	[this.dataList.lstLabelType] = await this._getCommonCode2(["SZ010"]);
    //this.getListCodes();
    //this.SYS_SEL_LIST_COMPANY([this.user.PK, '', '', '', '', 5]);
    this.initView();

  },

 watch: {      
    "tab01.dtOrderTo"(val)
    {     
      //this.onGetCCYUnit();
    },
    "tab01.dtOrderFrom"(val)
    {
      //this.onGetInfo1();
    }
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
                [
				{
                    dataField: "CONTAINER_NO",
                    caption: this.$t("CT#"),
                    allowEditing: false,  
                    allowMerge: true,   
                    bgColor: "#FFFFFF",
                    width: 70
                 },                              
                 {
                    dataField: "PO_NO",
                    caption: this.$t("PO_NO"),
                    allowEditing: false,
                    allowMerge: true,
                    bgColor: "#FFFFFF",
                    width: 120          
                 },
                 {
                    dataField: "ITEM",
                    caption: this.$t("item"),
                    allowEditing: false,
                    allowMerge: true,
                    bgColor: "#FFFFFF",
                    width: 120          
                 },
                 {
                    dataField: "STYLE_NO",
                    caption: this.$t("style_no"),
                    allowEditing: false,
                    width: 120          
                 },
				 {
                    dataField: "SKU_NO",
                    caption: this.$t("sku#"),
                    allowEditing: false,
                    width: 120          
                 },
				 {
                    dataField: "QTY",
                    caption: this.$t("QTY"),
                    allowEditing: false,
                    width: 100,
                    formatFloat: 0,          
                 },
				 {
                    dataField: "ACTUAL_QTY",
                    caption: this.$t("ACTUAL_QTY"),
                    allowEditing: false,
                    width: 100,
                    formatFloat: 0,           
                 },
                 {
                    dataField: "NOTE",
                    caption: this.$t("NOTE"),
                    allowEditing: false,
                    width: 120          
                 }          
               ];
               this.dataList.headerGrid11 = [...this.dataList.headerGrid01];                              
            },



    OnSearch(obj) { 
        if(obj=='1')
        {
          //this.getHeader01(1);
          this.$refs.grdDetail11.loadData();    
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
                 this.tab01.dtOrderTo                 
                ]
        };
        let result01 = await this._dsoCall(dso, "process", false);     
        if (result01.length > 0)
        {
          this.tab01.txtOrderNo = result01[0].CCY_UNIT;
        }
    },

     async getHeader01(obj) {
      if (obj === 1) 
      {
        const  dso = {
          type: "process",
          updpro: "LG_PRO_9020OTM180_01",
          para: [this.tab01.dtOrderFrom]
        };
        this.lstHeader01 = await this._dsoCall(dso, "process", false);     
        if (this.lstHeader01.length > 0)
        {
          this.processHeader1(obj);
        }
      }    
    },
    
    /*NOTE: */
    async SYS_SEL_LIST_COMPANY(_param) {
      const dso = {
        type: "list",
        selpro: "GSF20_LG_GET_COMMON_LIST",
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
    async getListCodes() {
      let lstCommoncode = await this._getCommonCode2( ['SZ010'],  this.user.TCO_COMPANY_PK  );
      this.lstLabelType = lstCommoncode[0];    
    },

///

async onReport() { 
        let p_param = [
							this.tab01.lstCompany,
							this.tab01.dtOrderFrom,
							this.tab01.dtOrderTo,
							this.tab01.txtOrderNo
        ];
        let report_no = "01";
        let report_path = "";
        let report_name = "";   
        let report_name_ext = "xlsx";        
        let excel = [];

       
	let report = "rpt_sw10060_delivery_note";
			
			//rpt_swso410_EC_Carelabel_02
      try{
	  //alert(p_param);
        this._ExcelSaveAs(await this.$axios.$get('/dso/makereport', {responseType: "blob", params: {
          template: "report/10/10/" + report + ".xlsx",
          excel: JSON.stringify([{
            insertRange: [{
              range: "A4:H4", proc: "SW_SEL_SW10060_NOCACHE", params: [...p_param]//SW_SEL_SW10110_export_custom
            }],
            insertRows: [{
				startRow: 6, proc: "SW_SEL_SW10060_NOCACHE", params: [...p_param], stringColumns: [ "PO_NO","ITEM"], subStyle: { font : {   bold: true   } , fill: {
                                        type: 'pattern',
                                        pattern:'solid',
                                        fgColor : { argb: 'FFE599'},
                                        bgColor : { argb: 'FFE599'}
                                      } }  
              //startRow: 8, proc: "SW_SEL_SW10090_REPORT_FACT_DT", params: [...p_param]
            }]
          }]),
          convert: "xlsx"}
        }), report + "." + "xlsx");
      } catch (e) {
        this.showNotification("danger", this.$t("fail_to_export_report"), "", 4000);
      }
	  
       
      },
	 print() {},

//



    async onReport2() {       
	let p_param = [         this.tab01.lstCompany,
							this.tab01.dtOrderFrom,
							this.tab01.dtOrderTo,
							this.tab01.txtOrderNo
                                   
        ];
        let report_no = "01";
        let report_path = "";
        let report_name = "";   
        let report_name_ext = "xlsx";        
        let excel = [];

        switch(report_no) { 
          case "01": 
		  //alert(p_param);
            report_path = "report/10/10/rpt_sw10060_delivery_note.xlsx"; 
            report_name = "rpt_sw10060_delivery_note." + report_name_ext; 
            excel = [
              {
                sheet: 1,               
                insertRange: [              
                  //{ range: "A1:T4", proc: "LG_RPT_COMPANY_INFO_02", params: [this.tab01.lstCompany], imageColumns: ["COM_PIC"]  },
                  { range: "A6:I6", proc: "SW_SEL_SW10060_NOCACHE", params: [...p_param]  },//master
                ],
                insertRows: [
                  {                               
                                                   
                    startRow: 5, proc: "SW_SEL_SW10060_NOCACHE", params: [...p_param], subStyle: { font : {   bold: true   } , fill: {
                                        type: 'pattern',
                                        pattern:'solid',
                                        fgColor : { argb: 'FFE599'},
                                        bgColor : { argb: 'FFE599'}
                                      } } 
                  

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
