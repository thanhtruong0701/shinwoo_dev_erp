<template>
  <GwGridLayout dense align="start" colsPerRow="1" containerHeight="auto" @callBackHeight="parentHeight = $event">
    <BaseDatePicker colspan="2" outlined default :clearable="false" :label="$t('order_from_date')" v-model="orderFromDate" />
    <BaseDatePicker colspan="2" outlined default :clearable="false" :label="$t('order_to_date')" v-model="orderToDate" />
    <BaseInput colspan="2" outlined :label="$t('order_no')" v-model="order_no" />
    <GwFlexBox colspan="2" align-self="center">
      <BaseButton :btn_text="$t('search')" @onclick="search" />
	  
		<BaseButton icon_type="excel" :btn_text="$t('Report')" @onclick="onReport" :disabled="isProcessing" /> 
    </GwFlexBox>    
    <BaseGridView 
      colspan="12" 
      column-resizing-mode="widget" 
      ref="dataGrid" 
      :header="headers" 
      sel_procedure="SW_SEL_SW20080_1_NOCACHE" 
      :filter_paras="[orderFromDate, orderToDate, order_no]" 
      :filterRow="true" 
      select_mode="Multiple" 
      :auto_load="false" 
      :max_height="gridHeight"       
      @cellClickData="onCellClickDataGrid" 
      @onSelectionDataChanged="onSelectionDataChanged" 
    />
  </GwGridLayout>
</template>

<script>
import moment from "moment";
export default {
  layout: "default",
  middleware: "user",

  data: () => ({
    parentHeight: 0,
    orderFromDate: moment().subtract(1, "week").format("YYYYMMDD"),
    orderToDate: "",
    deliDate: new Date(),
    order_no: "",
    confirmDate: "",
    selectedIFNo: "",
    ifNoPKArray: null,
    selectedStatus: 2,
  }),

  created() {},

  computed: {
    statusList() {
      return [
        { value: 2, text: this.$t("confirm") },
        { value: 3, text: this.$t("finish_delivery") },
      ];
    },
    headers() {
      return [
        { dataField: "IF_NO", caption: this.$t("if_no"), allowEditing: false , width: 180},
        { dataField: "IF_GUBUN", caption: this.$t("if_gubun"), allowEditing: false , width: 50},
        { dataField: "IF_FLAG", caption: this.$t("if_flag"), allowEditing: false , width: 0},
        { dataField: "IF_DATE", caption: this.$t("if_date"), allowEditing: false , width: 180},
        { dataField: "BRANDGROUP", caption: this.$t("brandgroup"), allowEditing: false , width: 50},
        { dataField: "ORDERDATE", caption: this.$t("orderdate"), allowEditing: false , width: 180},
        { dataField: "ORDERNO", caption: this.$t("orderno"), allowEditing: false , width: 80},
        { dataField: "PRODUCT_YM", caption: this.$t("product_ym"), allowEditing: false , width: 80},
        { dataField: "ORDER_CODE", caption: this.$t("order_code"), allowEditing: false , width: 80},
        { dataField: "ORDER_NAME", caption: this.$t("order_name"), allowEditing: false , width: 120},
        { dataField: "STYLE_PO_NO", caption: this.$t("style_po_no"), allowEditing: false , width: 120},
        { dataField: "STYLE_NO", caption: this.$t("style_no"), allowEditing: false , width: 100},
        { dataField: "DEGREE", caption: this.$t("degree"), allowEditing: false , width: 50},
        { dataField: "SEX", caption: this.$t("sex"), allowEditing: false , width: 50},
        { dataField: "SELLPRICE", caption: this.$t("sellprice"), allowEditing: false , width: 80},
        { dataField: "SELLPRICE_ENG", caption: this.$t("sellprice_eng"), allowEditing: false , width: 80},
        { dataField: "SELLPRICE_CHN", caption: this.$t("sellprice_chn"), allowEditing: false , width: 80},
        { dataField: "SELLPRICE_TWN", caption: this.$t("sellprice_twn"), allowEditing: false , width: 80},
        { dataField: "LAUNDRYCODE", caption: this.$t("laundrycode"), allowEditing: false , width: 80},
        { dataField: "LAUNDRY", caption: this.$t("laundry"), allowEditing: false , width: 80},
        { dataField: "IMPORT_NAME", caption: this.$t("import_name"), allowEditing: false , width: 120},
        { dataField: "IMPORT_NAME_ENG", caption: this.$t("import_name_eng"), allowEditing: false , width: 180},
        { dataField: "IMPORT_NAME_CHN", caption: this.$t("import_name_chn"), allowEditing: false , width: 180},
        { dataField: "IMPORT_NAME_TWN", caption: this.$t("import_name_twn"), allowEditing: false , width: 180},
        { dataField: "COUNTRY", caption: this.$t("country"), allowEditing: false , width: 100},
        { dataField: "CUST_CODE", caption: this.$t("cust_code"), allowEditing: false , width: 100},
        { dataField: "CUST_NAME", caption: this.$t("cust_name"), allowEditing: false , width: 100},
        { dataField: "CUST_NAME_ENG", caption: this.$t("cust_name_eng"), allowEditing: false , width: 180},
        { dataField: "CUST_NAME_CHN", caption: this.$t("cust_name_chn"), allowEditing: false , width: 180},
        { dataField: "CUST_NAME_TWN", caption: this.$t("cust_name_twn"), allowEditing: false , width: 180},
        { dataField: "KIND", caption: this.$t("kind"), allowEditing: false , width: 100},
        { dataField: "CAREQTY", caption: this.$t("careqty"), allowEditing: false , width: 100},
        { dataField: "MEMO", caption: this.$t("memo"), allowEditing: false , width: 180},
        { dataField: "INPUTMAN", caption: this.$t("inputman"), allowEditing: false , width: 100},
        { dataField: "INPUTDATE", caption: this.$t("inputdate"), allowEditing: false , width: 100},
        { dataField: "MODIFIER", caption: this.$t("modifier"), allowEditing: false , width: 100},
        { dataField: "MODIFYDATE", caption: this.$t("modifydate"), allowEditing: false , width: 100},
        { dataField: "STATE", caption: this.$t("state"), allowEditing: false , width: 50},
        { dataField: "ORDER_YN", caption: this.$t("order_yn"), allowEditing: false , width: 50},
        { dataField: "UPDATE_YN", caption: this.$t("update_yn"), allowEditing: false , width: 50},
        { dataField: "BRANDNAME", caption: this.$t("brandname"), allowEditing: false , width: 50},
        { dataField: "TOTWORKITEM", caption: this.$t("totworkitem"), allowEditing: false , width: 50},
        { dataField: "BRAND", caption: this.$t("brand"), allowEditing: false , width: 50},
        { dataField: "TYPE", caption: this.$t("type"), allowEditing: false , width: 50},
        { dataField: "CLOTHES", caption: this.$t("clothes"), allowEditing: false , width: 50},
        { dataField: "SIZECOMMENT", caption: this.$t("sizecomment"), allowEditing: false , width: 180},		
        { dataField: "ORDERTYPE", caption: this.$t("ordertype"), allowEditing: false , width: 50},
        { dataField: "GOODSNAME", caption: this.$t("goodsname"), allowEditing: false , width: 180},
        { dataField: "SAFETYNO", caption: this.$t("safetyno"), allowEditing: false , width: 80},
        { dataField: "ONLINES", caption: this.$t("onlines"), allowEditing: false , width: 80},
        { dataField: "SHNAME", caption: this.$t("shname"), allowEditing: false , width: 100},
        { dataField: "DEFINITE_TYPE", caption: this.$t("definite_type"), allowEditing: false , width: 80},	
        { dataField: "DEFINITE_CODE", caption: this.$t("definite_code"), allowEditing: false , width: 80},
        { dataField: "DEFINITE_CODE2", caption: this.$t("definite_code2"), allowEditing: false , width: 80},
        { dataField: "ORDERCOMPANY", caption: this.$t("ordercompany"), allowEditing: false , width: 80},
        { dataField: "YY", caption: this.$t("yy"), allowEditing: false , width: 50},
        { dataField: "SEASON", caption: this.$t("season"), allowEditing: false , width: 50},	
        { dataField: "CNT", caption: this.$t("cnt"), allowEditing: false , width: 180},
        { dataField: "REQUESTDATE", caption: this.$t("requestdate"), allowEditing: false , width: 100},
        { dataField: "CHECKDATE", caption: this.$t("checkdate"), allowEditing: false , width: 100},
        { dataField: "CLOSEDATE", caption: this.$t("closedate"), allowEditing: false , width: 80},
        { dataField: "FIT_COATPANTS", caption: this.$t("fit_coatpants"), allowEditing: false , width: 80},	
        { dataField: "FIT_TYPE", caption: this.$t("fit_type"), allowEditing: false , width: 100},	
        { dataField: "FIT_TYPE_MIN", caption: this.$t("fit_type_min"), allowEditing: false , width: 80},
        { dataField: "FIT_TYPE_MAX", caption: this.$t("fit_type_max"), allowEditing: false , width: 100},
        { dataField: "FIT_TYPE2", caption: this.$t("fit_type2"), allowEditing: false , width: 100},
        { dataField: "FIT_TYPE2_MIN", caption: this.$t("fit_type2_min"), allowEditing: false , width: 100},
        { dataField: "FIT_TYPE2_MAX", caption: this.$t("fit_type2_max"), allowEditing: false , width: 100},	 
        { dataField: "LABEL_DESCRIPT", caption: this.$t("label_descript"), allowEditing: false , width: 100},
        { dataField: "LABEL_DESCRIPT_ENG", caption: this.$t("label_descript_eng"), allowEditing: false , width: 100},
        { dataField: "LABEL_DESCRIPT_CHN", caption: this.$t("label_descript_chn"), allowEditing: false , width: 100},
        { dataField: "LABEL_TYPE", caption: this.$t("label_type"), allowEditing: false , width: 80},
        { dataField: "LABEL_FRONT_LANG", caption: this.$t("label_front_lang"), allowEditing: false , width: 80},	  
        { dataField: "LABEL_BACK_LANG", caption: this.$t("label_back_lang"), allowEditing: false , width: 80},
        { dataField: "KIND_PR_MODE", caption: this.$t("kind_pr_mode"), allowEditing: false , width: 80},	 
        { dataField: "ITEM_NAME", caption: this.$t("item_name"), allowEditing: false , width: 100},
        { dataField: "ITEM_NAME_ENG", caption: this.$t("item_name_eng"), allowEditing: false , width: 120},
        { dataField: "ITEM_NAME_CHN", caption: this.$t("item_name_chn"), allowEditing: false , width: 120},
        { dataField: "ITEM_NAME_TWN", caption: this.$t("item_name_twn"), allowEditing: false , width: 120},
        { dataField: "CERTI_BRAND", caption: this.$t("certi_brand"), allowEditing: false , width: 120},	  
        { dataField: "CERTI_CLOTHES", caption: this.$t("certi_clothes"), allowEditing: false , width: 120},
        { dataField: "CERTI_SEQ_NUM", caption: this.$t("certi_seq_num"), allowEditing: false , width: 80},	  
        { dataField: "CERTI_NAME1", caption: this.$t("certi_name1"), allowEditing: false , width: 180},
        { dataField: "CERTI_NAME2", caption: this.$t("certi_name2"), allowEditing: false , width: 180},	  
        { dataField: "CERTI_NAME3", caption: this.$t("certi_name3"), allowEditing: false , width: 180},
        { dataField: "CERTI_SAFETY_TYPE1", caption: this.$t("certi_safety_type1"), allowEditing: false , width: 180},	  
        { dataField: "CERTI_SAFETY_TYPE2", caption: this.$t("certi_safety_type2"), allowEditing: false , width: 180},
        { dataField: "CERTI_EXEC_STD", caption: this.$t("certi_exec_std"), allowEditing: false , width: 180},	  
        { dataField: "CERTI_GOODS_CLASS", caption: this.$t("certi_goods_class"), allowEditing: false , width: 180},
        { dataField: "CERTI_GOODS_QC", caption: this.$t("certi_goods_qc"), allowEditing: false , width: 180},	  	
        { dataField: "FACTORY_NAME", caption: this.$t("factory_name"), allowEditing: false , width: 180},	  
        { dataField: "FACTORY_ADDRESS", caption: this.$t("factory_address"), allowEditing: false , width: 180},
        { dataField: "FACTORY_INFO", caption: this.$t("factory_info"), allowEditing: false , width: 180},	  
        { dataField: "RFID_YN", caption: this.$t("rfid_yn"), allowEditing: false , width: 80},
        { dataField: "RFID_CODE_CREATE", caption: this.$t("rfid_code_create"), allowEditing: false , width: 180},	  
        { dataField: "RFID_LABEL_TYPE", caption: this.$t("rfid_label_type"), allowEditing: false , width: 80},	  
        { dataField: "RFID_LABEL_TYPE_NAME", caption: this.$t("rfid_label_type_name"), allowEditing: false , width: 80},
        { dataField: "ANTENA_YN", caption: this.$t("antena_yn"), allowEditing: false , width: 80},	  	
        { dataField: "LABEL_COMMENTS", caption: this.$t("label_comments"), allowEditing: false , width: 180},	  
        { dataField: "MANUFACTURER_NAME", caption: this.$t("manufacturer_name"), allowEditing: false , width: 180},
        { dataField: "Z_REQ_DELIVERY_DATE", caption: this.$t("z_req_delivery_date"), allowEditing: false , width: 180},	  
        { dataField: "Z_MEMO", caption: this.$t("z_memo"), allowEditing: false , width: 180},
        { dataField: "Z_STYLE_NO", caption: this.$t("z_style_no"), allowEditing: false , width: 80},	 
        { dataField: "Z_DEGREE", caption: this.$t("z_degree"), allowEditing: false , width: 80},	  
        { dataField: "FILL_W", caption: this.$t("fill_w"), allowEditing: false , width: 80},
        { dataField: "MIXRATE_TITLE", caption: this.$t("mixrate_title"), allowEditing: false , width: 180},	  
        { dataField: "CREATE_DATE", caption: this.$t("create_date"), allowEditing: false , width: 180},
              
      ];
    },
    gridHeight() {
      return this._calculateHeight(this.parentHeight, 85);
    },
    formatedDeliDate() {
      return this.deliDate ? moment(this.deliDate).format("YYYY-MM-DD HHmmss") : "";
    }
  },

  methods: {
    changeDeliDate({ value }) {
      // console.log("changeDeliDate", value);
      this.deliDate = value ? value : "";      
    },
    search() {
      this.$refs.dataGrid.loadData();
    },
    //--------------------------------------------
    onRowPrepared_0(e) {
      if (e.rowType === "data") {
        if (e.data.RFID_YN == "Y") {
          e.rowElement.style.fontWeight = "bold";
          e.rowElement.style.background = "#FFECD9";
          e.rowElement.style.color = "RED";
        } else {
          if (e.data.CAREQTY != "0") {
            e.rowElement.style.color = "BLUE";
            e.rowElement.style.fontWeight = "bold";
          } else {
            // e.rowElement.style.color = "YELLOW";
            e.rowElement.style.fontWeight = "bold";
          }
        }
      }
    },
    //--------------------------------------------
    async confirm() {
      try {
        // console.log(`ifNoPKArray: ${this.ifNoPKArray} - formatedDeliDate: ${this.formatedDeliDate}`);
        if (!this.ifNoPKArray) {
          this.showNotification("danger", this.$t("please_select_an_order"), "");
          return;
        }
       
        const dso = {
          type: "process",
          updpro: "SW_PRO_SW20050_CONFIRM",
          para: [ this.ifNoPKArray, this.formatedDeliDate ],
        };

        const result = await this._dsoCall(dso, "process", false);
        if (result) {
          this.showNotification("success", this.$t("process_success"), "", 500);
          setTimeout(() => {
            this.$refs.dataGrid.loadData();
          }, 500);
        }
      } catch (error) {
        console.log("confirm-catch exception:", error.message);
      }
    },
	//------------------print--po----------------------------
	async onReport() { 
		let p_param = [
				this.orderFromDate, 
				this.orderToDate, 
				this.order_no
				];
		let report_no = "01";
		let report_path = "";
		//let report_name = "";   
		let report_name_ext = "xlsx";        
		let excel = [];

	   
	let report_name = "rpt_sw20080_order_s_interface_inquiry";
	
	let report = "rpt_sw20080_order_s_interface_inquiry";
			
			//rpt_swso410_EC_Carelabel_02
	  try{
	 // alert(p_param);
		this._ExcelSaveAs(await this.$axios.$get('/dso/makereport', {responseType: "blob", params: {
		  template: "report/sw/20/" + report + ".xlsx",
		  excel: JSON.stringify([{
			insertRange: [{
			  range: "A1:F3", proc: "SW_SEL_SW20080_1_NOCACHE", params: [...p_param]//SW_SEL_SW10110_export_custom
			}],
			insertRows: [{
				startRow: 5, proc: "SW_SEL_SW20080_1_NOCACHE", params: [...p_param], subStyle: { font : {   bold: true   } , fill: {
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
    //--------------------------------------------
    onSelectionDataChanged(data) {
      this.ifNoPKArray = data.map((item) => item.PK).join(",");
    },
    onCellClickDataGrid({ IF_NO }) {
      this.selectedIFNo = IF_NO;
    },
  },
};
</script>
