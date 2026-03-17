<template>
  <v-container fluid class="px-0 pt-0" v-resize="onResize">

        <v-card class="pa-1 pt-0">
          <v-row align="center" justify="space-between" class="pt-2">
                <v-col md="2" class="pt-0">                   
                   <BaseSelect
                    :label="$t('Customer')"
                    v-model="tab01.lstCompany"
                    :lstData="dataList.lstCompany"
                    :text_all="$t('select_all')"
                    item-text="NAME"
                    item-value="CODE"                    
                  />          
                </v-col>                        
                 <v-col md="2" class="pt-2">                   
                   <BaseSelect
                    :label="$t('Location')"
                    v-model="tab01.lstLocation"
                    :lstData="dataList.lstLocation"
                    item-text="TEXT"
                    item-value="PK"                   
                  />          
                </v-col>
				<v-col md="1" class="pt-2"> 		
                   <BaseSelect
					:label="$t('Date Type')"
					v-model="tab01.selectedDateType"
					:lstData="dataList.selectedDateType"
					item-text="TEXT"
					item-value="PK"                   
				  /> 
				</v-col>				  
                <v-col md="1" class="pt-0">
                  <BaseDatePicker v-model="tab01.dtOrderFrom"  default :label="$t('order_date')"></BaseDatePicker>             
                </v-col>

                <v-col md="1" class="pt-0"> 
					<BaseDatePicker v-model="tab01.dtOrderTo"  default :label="$t('order_date')"></BaseDatePicker>     
                  
                </v-col>                  
                <v-col md="1" class="pt-0"> 
					<v-text-field clearable dense hide-details :label="$t('Container')" @keypress.enter="OnSearch(1)" v-model="tab01.txtOrderNo"></v-text-field>
					
                   <!--<BaseInput v-model="tab01.txtOrderNo"  :label="$t('Container')">           
                  </BaseInput>  -->
                </v-col>  
				<v-col md="2" class="pt-2">                   
                   <BaseSelect
                    :label="$t('Label_Type')"
                    v-model="tab01.lstLabelType"
                    :lstData="dataList.lstLabelType"
                    item-text="TEXT"
                    item-value="PK"                   
                  />          
                </v-col> 				
                <v-col md="2" class="pt-0">                   
                  <v-row justify="end" class="mr-1">
                    <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="OnSearch(1)"/>   
                    <BaseButton icon_type="excel" :btn_text="$t('excel')" :disabled="isProcessing" @onclick="onReport2"/>                  
                  </v-row>   
                </v-col>                      
          </v-row>
		  
		  <v-row align="center" justify="space-between" class="pt-2">
                <v-col md="2" class="pt-0">                   
                   <v-row justify="end" class="mr-1">				
						 <BaseInput v-model="tab01.txtContainer"  :label="$t('Container')" >           
					  </BaseInput> 
					  
						<BaseButton btn_type="icon" icon_type="set" :btn_text="$t('set-container')" :disabled="isProcessing" @onclick="
								  $refs.grdDetail11.setCellSelected('CONTAINER_NAME',tab01.txtContainer)
						" /> 
					</v-row> 
                </v-col>                        
                 <v-col md="2" class="pt-2">                   
                    <v-row justify="end" class="mr-1">				
						 <BaseInput v-model="tab01.txtCMB"  :label="$t('CBM')" >           
					  </BaseInput> 
					  
						<BaseButton btn_type="icon" icon_type="set" :btn_text="$t('set-CBM')" :disabled="isProcessing" @onclick="
								  $refs.grdDetail11.setCellSelected('CBM',tab01.txtCMB)
						" /> 
					</v-row> 
                </v-col> 
                  
                            
                <v-col md="2" class="pt-0">                   
                      
                  	<v-row justify="end" class="mr-1">				
						 <BaseInput v-model="tab01.txtUnit"  :label="$t('UNIT')" >           
					  </BaseInput> 
					  
						<BaseButton btn_type="icon" icon_type="set" :btn_text="$t('set-UNIT')" :disabled="isProcessing" @onclick="
								  $refs.grdDetail11.setCellSelected('UNIT',tab01.txtUnit)
						" /> 
					</v-row> 			

                </v-col>  
				<v-col md="2" class="pt-3">
					<v-row justify="end" class="mr-1">
						<BaseSelect
							:label="$t('LOCATION')"
							v-model="tab01.txtDESCRIPTION"
							:lstData="dataList.txtDESCRIPTION"
							item-text="TEXT"
							item-value="PK"                   
						  />  
				  
						
					  
						<BaseButton btn_type="icon" icon_type="set" :btn_text="$t('set-LOCATION')" :disabled="isProcessing" @onclick="
								  $refs.grdDetail11.setCellSelected('DESCRIPTION',tab01.txtDESCRIPTION)
						" />

					
					</v-row> 			
                </v-col> 
				<v-col md="1" class="pt-3">
					<v-row justify="end" class="mr-1">
						<BaseDatePicker v-model="tab01.dtDelivery_SW"  default :label="$t('delivery_date_sw')"></BaseDatePicker>
						<BaseButton btn_type="icon" icon_type="set" :btn_text="$t('set-DELIVERY-DATE')" :disabled="isProcessing" @onclick="
								  $refs.grdDetail11.setCellSelected('DELIVERY_DATE_SW',tab01.dtDelivery_SW)
						" />			
					</v-row> 			
                </v-col> 	
				
                <v-col md="1" class="pt-0">                   
                  <v-row justify="end" class="mr-1">
					
					<BaseButton icon_type="save" :btn_text="$t('save')" :disabled="isProcessing" @onclick="OnSave()"/>					
                  </v-row>   
                </v-col>  
				<v-col md="1" class="pt-0">                   
                  <v-row justify="end" class="mr-1">
					<BaseButton icon_type="excel" :btn_text="$t('Container')" :disabled="isProcessing" @onclick="onReport1"/> 					
                  </v-row>   
                </v-col> 
				<v-col md="1" class="pt-0">                   
                  <v-row justify="end" class="mr-1">
					<BaseButton icon_type="excel" :btn_text="$t('excel-2')" :disabled="isProcessing" @onclick="onReportDeliMerge"/>	 					
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
                    sel_procedure="SW_SEL_SWSO420_01" 
                    upd_procedure="SW_UPD_SWSO420_01"
                    @onRowPrepared = "onRowPreparedGrid11"
                    :filter_paras="[
                                  tab01.lstCompany,
                                  tab01.lstLocation,
								  tab01.selectedDateType,
								  tab01.dtOrderFrom,
								  tab01.dtOrderTo,
                                  tab01.txtOrderNo,                                                                      
                                  tab01.lstLabelType
                                  ]" 
					:update_paras="[
									'PK',
									'CONTAINER_NAME',
									'CONTAINER_NAME_02',
									'CUST_NAME_ENG',
									'ORDERDATE',
									'Z_REQ_DELIVERY_DATE',
									'DELIVERY_DATE_SW',
									'ORDERNO',
									'STYLE_NO',
									'COLOR',
									'SIZES',
									'KIND',
									'QTY',
									'TOTAL_QTY',
									'CBM',
									'UNIT',
									'DESCRIPTION',
									'LABEL_TYPE_02'
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
      lstLabelType: [],	  
      lstCompany: [],
	  selectedDateType: [],
	  txtDESCRIPTION: [],
      dtOrderTo:[]        
    },
    isShowMess: "N",
    selectedTab: "1",
    tab01: {
      lstCompany: "",
	  selectedDateType: "",
      lstLocation: "",
	  lstLabelType: "",
      dtOrderFrom: "",
      txtBasicCCY: ""  ,
      txtOrderNo: "",
	  txtContainer: "",
	  txtCMB: "",
	  txtUnit: "",
	  txtDESCRIPTION: "",
	  dtDelivery_SW: "",
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
    
    [this.dataList.lstCompany] = await this._getCommonCode2(["SZ008"]);
	//this.dataList.lstCompany = [{PK: '', TEXT: 'ALL'},{PK: 'PANKO', TEXT: 'PANKO'}, {PK: 'NOBLAND', TEXT: 'NOBLAND'}, {PK: 'YUPOONG', TEXT: 'YUPOONG'}, {PK: 'YAKJIN', TEXT: 'YAKJIN TRADING'}];
	this.dataList.lstLocation = [{PK: '', TEXT: 'ALL'},{PK: 'HÀ NỘI', TEXT: 'HÀ NỘI'}, {PK: 'HỒ CHÍ MINH', TEXT: 'HỒ CHÍ MINH'}, {PK: 'QUẢNG NAM', TEXT: 'QUẢNG NAM'}, {PK: 'ĐỒNG NAI', TEXT: 'ĐỒNG NAI'}, {PK: 'LONG AN', TEXT: 'LONG AN'}]; 
	
	this.dataList.txtDESCRIPTION = [{PK: '', TEXT: 'ALL'},{PK: 'HÀ NỘI', TEXT: 'HÀ NỘI'}, {PK: 'HỒ CHÍ MINH', TEXT: 'HỒ CHÍ MINH'}, {PK: 'QUẢNG NAM', TEXT: 'QUẢNG NAM'}, {PK: 'ĐỒNG NAI', TEXT: 'ĐỒNG NAI'}, {PK: 'LONG AN', TEXT: 'LONG AN'}]; 
	
	 
	this.dataList.selectedDateType = [{PK: '1', TEXT: 'DELIVERY DATE-CUSTOMER'}, {PK: '2', TEXT: 'ORDER DATE'}, {PK: '3', TEXT: 'DELIVERY DATE-SHINWOO'}];
	this.dataList.lstLabelType = [{PK: '', TEXT: 'ALL'},{PK: '01', TEXT: '단독세탁라벨KK-Caution Label'}, {PK: '02', TEXT: '의류라벨EC-EC Carelabel'}, {PK: '03', TEXT: '의류라벨KK-Korean Carelabel'},  {PK: '04', TEXT: '합격증EC-Price Tag - China'}, {PK: '05', TEXT: '의류가격택1KK-Price Tag - Global'}];
	
	/*01 - 단독세탁라벨KK-Caution Label
	02 - 의류라벨EC-EC Carelabel
	03 - 의류라벨KK_Y-Korean Carelabel RFID
	04 - 의류라벨KK_N-Korean Carelabel Normal
	05 - 합격증EC_Y-Price Tag - China RFID
	06 - 합격증EC_N-Price Tag - China Normal
	07 - 의류가격택1KK_Y-Price Tag - Global RFID
	08 - 의류가격택1KK_N-Price Tag - Global Normal */

	//this.dataList.lstLabelType = [{PK: '', TEXT: 'ALL'},{PK: 'HANOI', TEXT: 'HÀ NỘI'}, {PK: 'HCM', TEXT: 'HỒ CHÍ MINH'}];
	
   
	
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

    processHeader1(id) {      
                this.dataList.headerGrid01 = 
                [{
                    dataField: "CUST_NAME_ENG",
                    caption: this.$t("cust_name_eng"),
                    allowEditing: false,  
                    allowMerge: true,   
                    bgColor: "#FFFFFF",
                    width: 120
                 },                              
                 {
                    dataField: "LOCATION",
                    caption: this.$t("location"),
                    allowEditing: false,
                    allowMerge: true,
                    bgColor: "#FFFFFF",
                    width: 120          
                 },
                 {
                    dataField: "ORDERNO",
                    caption: this.$t("Order_No"),
                    allowEditing: false,
                    allowMerge: true,
                    bgColor: "#FFFFFF",
                    width: 120          
                 },
                 {
                    dataField: "KIND",
                    caption: this.$t("kind"),
                    allowEditing: false,
                    width: 120          
                 },
				 {
                    dataField: "KIND_PR_MODE",
                    caption: this.$t("kind_pr_mode"),
                    allowEditing: false,
                    width: 120          
                 },
				 {
                    dataField: "TYPE",
                    caption: this.$t("type"),
                    allowEditing: false,
                    width: 120          
                 },
				 {
                    dataField: "STYLE_NO",
                    caption: this.$t("style_no"),
                    allowEditing: false,
                    width: 120          
                 },
                 {
                    dataField: "QTY",
                    caption: this.$t("Qty"),
                    allowEditing: false,
                    width: 100,
                    formatFloat: 2,              
                 }                
               ];
                let fieldCaption = "";
                let fieldName = "";
                let fieldWidth = 90;                
                let next = 0;
                let i = 1;
                while (next == 0)
                {
                  try
                  {
                    fieldName = "COL" + i.toString().padStart(2, '0');                    
                    fieldCaption = this.lstHeader01[0][fieldName];    

                    if (this._hasValue(fieldCaption))
                    {
                      this.dataList.headerGrid01.push(this.pushColumn(fieldName, fieldCaption, fieldWidth, 2));
                    }
                    else
                    {
                      next = 1;
                    }
                    i = i + 1;
                  }
                  catch
                  {
                    next = 1;
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
                [
				{
                    dataField: "CONTAINER_NAME",
                    caption: this.$t("Container No"), 
                    allowEditing: false,  
                    allowMerge: false,   
                    bgColor: "#FFFFFF",
                    width: 90
                 }, 
				 {
                    dataField: "CONTAINER_NAME_02",
                    caption: this.$t("Container Name"),
                    allowEditing: false,  
					visible: false,
                    allowMerge: false,   
                    bgColor: "#FFFFFF",
                    width: 120
                 }, 
                 {
                    dataField: "CUST_NAME_ENG",
                    caption: this.$t("Client"),
                    allowEditing: false,
                    allowMerge: false,
                    bgColor: "#FFFFFF",
                    width: 120          
                 },
				 //Order Date	Order .NO	 STYLE_NO	Color	 SIZE 	ITEM (LABEL TYPE)	 Q'TY 	 ACTUAL Q'TY 	 CBM 	KG	note
				 {
                    dataField: "ORDERDATE",
                    caption: this.$t("Order_Date"),
					dataType: 'date', 
					format: this.curLang.DATE_FORMAT,
                    allowEditing: false,
                    allowMerge: false,
                    bgColor: "#FFFFFF",
                    width: 120          
                 },	
				 {
                    dataField: "Z_REQ_DELIVERY_DATE",
                    caption: this.$t("IF_EXPECTED_DATE"),
					dataType: 'date', 
					format: this.curLang.DATE_FORMAT,
                    allowEditing: false,
                    allowMerge: false,
                    bgColor: "#FFFFFF",
                    width: 125          
                 },	
				 {
                    dataField: "DELIVERY_DATE_SW",
                    caption: this.$t("DELIVERY_DATE_SW"),
					dataType: 'date', 
					format: this.curLang.DATE_FORMAT,
                    allowEditing: false,
                    allowMerge: false,
                    bgColor: "#FFFFFF",
                    width: 120          
                 },	
                 {
                    dataField: "ORDERNO",
                    caption: this.$t("Order_No"),
                    allowEditing: false,
                    allowMerge: false,
                    bgColor: "#FFFFFF",
                    width: 120          
                 },
				 {
                    dataField: "STYLE_NO",
                    caption: this.$t("Style_No"),
                    allowEditing: false,
                    allowMerge: false,
                    bgColor: "#FFFFFF",
                    width: 120          
                 },
				 {
                    dataField: "COLOR",
                    caption: this.$t("Color"),
                    allowEditing: false,
                    width: 120          
                 },
				 {
                    dataField: "SIZES",
                    caption: this.$t("Size"),
                    allowEditing: false,
                    allowMerge: false,
                    bgColor: "#FFFFFF",
                    width: 120          
                 },
                 {
                    dataField: "KIND",
                    caption: this.$t("Item (Label Type)"),
                    allowEditing: false,
                    width: 120          
                 },
				 
                 {
                    dataField: "QTY",
                    caption: this.$t("Q'ty"),
                    allowEditing: false,
                    width: 100,
                    formatFloat: 0,              
                 },
				 {
                    dataField: "TOTAL_QTY",
                    caption: this.$t("Actual Q'ty"),
                    allowEditing: false,
                    width: 100,
                    formatFloat: 0,              
                 },
				 {
                    dataField: "CBM",
                    caption: this.$t("CBM"),
                    allowEditing: false,
                    width: 120          
                 },
				 {
                    dataField: "UNIT",
                    caption: this.$t("Unit(KG)"),
                    allowEditing: false,
                    width: 120          
                 },	
				 {
                    dataField: "DESCRIPTION", 
                    caption: this.$t("Location"),
                    allowEditing: false,
                    width: 120          
                 }, 
				 {
                    dataField: "LABEL_TYPE_02",
                    caption: this.$t("Label Type02"),
                    allowEditing: false,
					visible: false,
                    width: 120          
                 },
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
      let lstCommoncode = await this._getCommonCode2( ['LGCM0100'],  this.user.TCO_COMPANY_PK  );
      this.dataList.dtOrderTo = lstCommoncode[0];    
    },
	async OnSave() {
      /*let requireCol = ["tag_id", "tag_nm", "mt_comcode"];
      let validate = this.$refs.grdTags.onCheckValid(requireCol);
      if (validate) {*/
        this.$refs.grdDetail11.saveData();
      //}
    },

///
async onReportDeliMerge() 
{
  //if (!this.TSZ_ORDER_PK) return;
  let report = "rpt_swso420__delivery_v2";
  let file_nm = "";
		if(this.tab01.lstLabelType==="")
		{
			file_nm = "rpt_swso420_delivery_ALL_Label";
		}
		if(this.tab01.lstLabelType==="01")
		{
			file_nm = "rpt_swso420_delivery_Caution_Label";
		}
		if(this.tab01.lstLabelType==="02")
		{
			file_nm = "rpt_swso420_delivery_EC_Carelabel";
		}
		if(this.tab01.lstLabelType==="03")
		{
			file_nm = "rpt_swso420_delivery_Korean_Carelabel";
		}
		if(this.tab01.lstLabelType==="04")
		{
			file_nm = "rpt_swso420_delivery_Price_Tag_China";
		}
		if(this.tab01.lstLabelType==="05")
		{
			file_nm = "rpt_swso420_delivery_Price_Tag_Global";
		}
	//=========================================
		let today = new Date();
            var param = [{
				P_COMPANY:    this.tab01.lstCompany,
				P_LOCATION:   this.tab01.lstLocation,	
				P_DATE_TYPE:  this.tab01.selectedDateType,	
				P_ORDER_FROM: this.tab01.dtOrderFrom,
				P_ORDER_TO:   this.tab01.dtOrderTo,
				P_ORDER_NO:   this.tab01.txtOrderNo,
				P_LABEL_TYPE: this.tab01.lstLabelType,
				P_FILE_NAME_NEW: this.file_nm,
            }, ];
            // File name use for save as file
            var file_nm_end = file_nm + "_" + this.user.USER_ID + ".xlsx";
            //file js use for make excel: gsf20\app\Controllers\Http\report\70\50\rpt7050001.js
            var url_path = "/report/rptswso420/rptswso420_01";
            try {
                const result = await this.$axios.$get(url_path, {responseType: "blob",params: {para: param},});
                this._ExcelSaveAs(result, file_nm_end);
            } catch (e) {
                this.showNotification("danger", e.message, "", 4000);
            }
	
	
		/*let today = new Date();
            var param = [{
                P_MONTH: this.selectedMonth,
                P_MONTH_D: this._formatDate(this.selectedMonth, "-"),
                P_DATE_TODAY: this._formatDate(today, "-"),
            }, ];
            // File name use for save as file
            var file_nm = "rpt_3050010" + "_" + this.user.USER_ID + ".xlsx";
            //file js use for make excel: gsf20\app\Controllers\Http\report\70\50\rpt7050001.js
            var url_path = "/report/rpt3050010/rpt3050010_01";
            try {
                const result = await this.$axios.$get(url_path, {responseType: "blob",params: {para: param},});
                this._ExcelSaveAs(result, file_nm);
            } catch (e) {
                this.showNotification("danger", e.message, "", 4000);
            } */
			
			
  
  //const report_path = "report/sw/10/" + report + ".xlsx"; // rpt_sw20030_packing_list
  //const report_name = "RPT_1010070_PACKING_LIST";
 // alert("pkl");
 // this.print(this, report_path, report_name, p_param);//resource\page\sw\10\js\print
},
//SW_SEL_SWSO420_RPT_CONTAINER
async onReport2() { 
        let p_param = [
							this.tab01.lstCompany,
							this.tab01.lstLocation,	
							this.tab01.selectedDateType,	
							this.tab01.dtOrderFrom,
							this.tab01.dtOrderTo,
							this.tab01.txtOrderNo,
							this.tab01.lstLabelType
        ];
        let report_no = "01";
        let report_path = "";
        let report_name = "";   
        let report_name_ext = "xlsx";        
        let excel = [];

       /*{PK: '01', TEXT: '단독세탁라벨KK-Caution Label'}, {PK: '02', TEXT: '의류라벨EC-EC Carelabel'}, 
	   {PK: '03', TEXT: '의류라벨KK-Korean Carelabel'},  {PK: '04', TEXT: '합격증EC-Price Tag - China'}, {PK: '05', TEXT: '의류가격택1KK-Price Tag - Global'}];*/
	   
	let report = "rpt_swso420__delivery";
			if(this.tab01.lstLabelType==="")
			{
				report_name = "rpt_swso420_delivery_ALL_Label";
			}
			if(this.tab01.lstLabelType==="01")
			{
				report_name = "rpt_swso420_delivery_Caution_Label";
			}
			if(this.tab01.lstLabelType==="02")
			{
				report_name = "rpt_swso420_delivery_EC_Carelabel";
			}
			if(this.tab01.lstLabelType==="03")
			{
				report_name = "rpt_swso420_delivery_Korean_Carelabel";
			}
			if(this.tab01.lstLabelType==="04")
			{
				report_name = "rpt_swso420_delivery_Price_Tag_China";
			}
			if(this.tab01.lstLabelType==="05")
			{
				report_name = "rpt_swso420_delivery_Price_Tag_Global";
			}
			/*if(this.tab01.lstLabelType==="06")
			{
				report = "rpt_swso410_Price_Tag_China_Normal_06";
			}
			if(this.tab01.lstLabelType==="07")
			{
				report = "rpt_swso410_Price_Tag_Global_RFID_07";
			}
			if(this.tab01.lstLabelType==="08")
			{
				report = "rpt_swso410_Price_Tag_Global_Normal_08";
			}*/
			//rpt_swso410_EC_Carelabel_02
			
      try{
	  //alert(p_param);
        this._ExcelSaveAs(await this.$axios.$get('/dso/makereport', {responseType: "blob", params: {
          template: "report/sw/10/" + report + ".xlsx",
          excel: JSON.stringify([{
            insertRange: [{
              range: "A1:AJ1", proc: "SW_SEL_SWSO420_01", params: [...p_param]//SW_SEL_SW10110_export_custom
            }],
            insertRows: [{
				startRow: 7, proc: "SW_SEL_SWSO420_01", params: [...p_param], stringColumns: [ "CONTAINER_NAME","ORDERNO"], subStyle: { font : {   bold: true   } , fill: {
                                        type: 'pattern',
                                        pattern:'solid',
                                        fgColor : { argb: 'FFE599'},
                                        bgColor : { argb: 'FFE599'}
                                      } }/*,
									  
									sumColumns: [ "QTY","TOTAL_QTY"],
									   total: [
										  {   column: "CONTAINER_NAME", isDisplay: false, type: null, text:  null  , isMerge: true    },            
										  {   column: "CONTAINER_NAME_02", isDisplay: false, type: null, text: null , isMerge: true   },               
										  {   column: null, isDisplay: false, type: "SUM", text: this.$t("total"), isGrandTotal: true  }        
										] */   
									
              //startRow: 8, proc: "SW_SEL_SW10090_REPORT_FACT_DT", params: [...p_param]
            },
			]
          }]),
          convert: "xlsx"}
        }), report_name + "." + "xlsx");
      } catch (e) {
        this.showNotification("danger", this.$t("fail_to_export_report"), "", 4000);
      }
	  
       
      },
	  //=========container=========================
	  async onReport1() { 
        let p_param = [
							this.tab01.lstCompany,
							this.tab01.lstLocation,		
							this.tab01.dtOrderFrom,
							this.tab01.dtOrderTo,
							this.tab01.txtOrderNo,
							this.tab01.lstLabelType
        ];
		let p_param2 = [
							this.tab01.lstCompany,
							this.tab01.lstLocation,		
							this.tab01.dtOrderFrom,
							this.tab01.dtOrderTo,
							"100000",//contaner--not use
							this.tab01.lstLabelType
        ];
        let report_no = "01";
        let report_path = "";
        let report_name = "";   
        let report_name_ext = "xlsx";        
        let excel = [];

       /*{PK: '01', TEXT: '단독세탁라벨KK-Caution Label'}, {PK: '02', TEXT: '의류라벨EC-EC Carelabel'}, 
	   {PK: '03', TEXT: '의류라벨KK-Korean Carelabel'},  {PK: '04', TEXT: '합격증EC-Price Tag - China'}, {PK: '05', TEXT: '의류가격택1KK-Price Tag - Global'}];*/
	   
	let report = "rpt_swso450_sumary_container";
			if(this.tab01.lstLabelType==="01")
			{
				report_name = "rpt_swso450_sumary_container_Caution_Label";
			}
			if(this.tab01.lstLabelType==="02")
			{
				report_name = "rpt_swso450_sumary_container_EC_Carelabel";
			}
			if(this.tab01.lstLabelType==="03")
			{
				report_name = "rpt_swso450_sumary_container_Korean_Carelabel";
			}
			if(this.tab01.lstLabelType==="04")
			{
				report_name = "rpt_swso450_sumary_container_Price_Tag_China";
			}
			if(this.tab01.lstLabelType==="05")
			{
				report_name = "rpt_swso450_sumary_container_Price_Tag_Global";
			}
			if(this.tab01.lstLabelType==="")
			{
				alert("Pls,select type label to print report for container!");
				return;
			}
			if(this.tab01.txtOrderNo==="")
			{
				alert("Pls,input container to export container fo report!");
				return;
			}
			/*if(this.tab01.lstLabelType==="06")
			{
				report = "rpt_swso410_Price_Tag_China_Normal_06";
			}
			if(this.tab01.lstLabelType==="07")
			{
				report = "rpt_swso410_Price_Tag_Global_RFID_07";
			}
			if(this.tab01.lstLabelType==="08")
			{
				report = "rpt_swso410_Price_Tag_Global_Normal_08";
			}*/
			//rpt_swso410_EC_Carelabel_02
			
      try{
	  //alert(p_param);
        this._ExcelSaveAs(await this.$axios.$get('/dso/makereport', {responseType: "blob", params: {
          template: "report/sw/10/" + report + ".xlsx",
          excel: JSON.stringify([{
            insertRange: [{
              range: "A1:F13", proc: "SW_SEL_SWSO420_RPT_CONTAINER", params: [...p_param]//SW_SEL_SW10110_export_custom
            }],
            insertRows: [{
				startRow: 7, proc: "SW_SEL_SWSO420_RPT_CONTAINER", params: [...p_param2], stringColumns: [ "CONTAINER_NAME","ORDERNO"], subStyle: { font : {   bold: true   } , fill: {
                                        type: 'pattern',
                                        pattern:'solid',
                                        fgColor : { argb: 'FFE599'},
                                        bgColor : { argb: 'FFE599'}
                                      } }/*,
									  
									sumColumns: [ "QTY","TOTAL_QTY"],
									   total: [
										  {   column: "CONTAINER_NAME", isDisplay: false, type: null, text:  null  , isMerge: true    },            
										  {   column: "CONTAINER_NAME_02", isDisplay: false, type: null, text: null , isMerge: true   },               
										  {   column: null, isDisplay: false, type: "SUM", text: this.$t("total"), isGrandTotal: true  }        
										] */   
									
              //startRow: 8, proc: "SW_SEL_SW10090_REPORT_FACT_DT", params: [...p_param]
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
</script>

<style>
.btn {
  min-width: 100px;
  min-height: 30px;
  max-width: 100px;
  max-height: 30px;
}
</style>
