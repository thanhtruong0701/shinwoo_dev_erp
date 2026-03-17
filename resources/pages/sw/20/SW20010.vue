<!-- ================================================================= BEGIN DESIGN LAYOUT======================================================================================= -->
<template>
	<div>
		<GwGridLayout dense align="start" colsPerRow="1" containerHeight="auto" @callBackHeight="parentHeight = $event">
			<!--BaseInput colspan="2" outlined :label="$t('if_no')" v-model="txt_PO_NO" @keyPressEnter="onSearch" /-->
			<BaseDatePicker colspan="2" outlined default :clearable="false" :label="$t('frm_date')" v-model="txtFrm_dt" />
			<BaseDatePicker colspan="2" outlined default :label="$t('to_date')" v-model="txtTo_dt"  />
			<BaseSelect colspan="2" outlined :label="$t('status')" item-text="text" item-value="value" :lstData="statusList" v-model="selectedStatus" :text_all="$t('select_all')"/>
			<BaseSelect colspan="2" outlined :label="$t('Customer_Name')" item-text="NAME" item-value="CODE" :lstData="CustomerList" v-model="selectedCustomer" :text_all="$t('select_all')"/>
			<GwFlexBox colspan="4" justify="end">
				<BaseButton icon_type="search" :btn_text="$t('search')" @onclick="onSearch" :disabled="isProcessing" />      
			</GwFlexBox>
			<DataGridView
				colspan="12"
				ref="gridData"
				column-resizing-mode="widget"
				:header="headers"
				select_mode="Multiple"
				:auto_load="false"
				:max_height="gridHeight"
				sel_procedure="SW_SEL_SW20010_1_NOCACHE"
				:filter_paras="[this.txtFrm_dt, this.txtTo_dt,this.selectedStatus,this.selectedCustomer]"
				:filterRow="true"
				@onRowPrepared="onRowPrepared_0"
				@cellClick="onCellClickGrdSearch"
			/>
			<BaseTabs colspan="12" @tabchanged="onClickButton">
				<BaseTab :name="$t('color')">
					<DataGridView
						column-resizing-mode="widget"
						ref="grd_Color"
						:header="headersColor"
						sel_procedure="SW_SEL_SW20010_2_NOCACHE"
						:filter_paras="[this.p_BRANDGROUP,this.p_ORDERDATE,this.p_ORDERNO]" 
						select_mode="MultipleHideBox"
						:auto_load="false"
						:filterRow="true"
						:max_height="gridHeight2"
					/>
				</BaseTab>
				<BaseTab :name="$t('material')">
					<DataGridView
						column-resizing-mode="widget"
						ref="grd_Material"
						:header="headersMaterial"
						sel_procedure="SW_SEL_SW20010_3_NOCACHE"
						:filter_paras="[this.p_BRANDGROUP,this.p_ORDERDATE,this.p_ORDERNO]"
						upd_procedure=""
						select_mode="MultipleHideBox"
						:auto_load="false"
						:max_height="gridHeight2"
						:filterRow="true"
					/>
				</BaseTab>
				<BaseTab :name="$t('RFID')">
					<DataGridView
						column-resizing-mode="widget"
						ref="grd_RFID"
						:header="headersRFID"
						sel_procedure="SW_SEL_SW20010_4_NOCACHE"
						:filter_paras="[this.p_BRANDGROUP,this.p_ORDERDATE,this.p_ORDERNO]"
						:filterRow="true"
						select_mode="MultipleHideBox"
						:auto_load="false"
						:max_height="gridHeight2"
					/>
				</BaseTab>
			</BaseTabs>
		</GwGridLayout>
		<alert-dialog ref="alertDialog"></alert-dialog>
		
  </div>
</template>
<!-- ================================================================= END DESIGN LAYOUT & BEGIN SCRIPT ========================================================================= -->

<script>
/*==================================================================== BEGIN IMPORT COMPONENT ======================================================================================*/
import moment from "moment";
import AlertDialog from "@/components/dialog/AlertDialog";
import GwImportExcelFile from "@/components/control/GwImportExcelFile.vue";
/*==================================================================== END IMPORT COMPONENT & BEGIN export default==================================================================*/
export default {
  /*############### DEFAULT #######################*/
  layout: "default",
  middleware: "user",
  /*############### components ####################*/
  components: {
    AlertDialog,
    GwImportExcelFile,
  },
  /*############### data ##########################*/
  data: () => ({
    btn: null,
    lst_download_yn: "",
    txt_PO_NO: "",
    PK: "",    
		txtFrm_dt:moment().subtract(1, "week").format("YYYYMMDD"),
    txtTo_dt: "",
    selectList: [],
    txtCrt_by: "",
    active: [],
    p_BRANDGROUP: "",
    p_ORDERDATE: "",
    p_ORDERNO: "",
    P_IF_NO: "",
    multiselect: false,
    sel_row: -1,
    TSZ_ORDER_PK: null,
    bgColor1: "#FCE5CD",
    active_tab: 0,
	parentHeight: 0,
	selectedStatus: "",
	CustomerList: [],
	selectedCustomer: ""
  }),
  /*############### created #######################*/
  async created() {
	[this.CustomerList] = await this._getCommonCode2(["SZ008"])
  },
  /*############### watch ######################*/
  watch: {},
  /*############### computed ######################*/
  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },    
    TypeList() {
      return [
        {
          PK: "Y",
          TEXT: this.$t("yes"),
        },
        {
          PK: "N",
          TEXT: this.$t("No"),
        },
      ];
    },
		gridHeight() {
			return this._calculateHeight(this.parentHeight, 45)
		},
		gridHeight2() {
			return Math.floor(this.gridHeight - 35 - 16)
		},
		statusList() {
      return [
        { value: 1, text: this.$t("new") },
        { value: 2, text: this.$t("confirm") },
        { value: 3, text: this.$t("finish_delivery") },
				{ value: 4, text: this.$t("cancel") }
      ]
    },
	/*CustomerList() {
      return [
        { value: "", text: "SELECT ALL" },
        { value: "NOBLAND",text: "NOBLAND" },
        { value: "PANKO", text: "PANKO" },
		{ value: "YUPOONG", text: "YUPOONG" },
		{ value: "YAKJIN", text: "YAKJIN TRADING" }
      ]
    },*/
		headers() {
			return [
				{ dataField: 'BRANDGROUP', caption: this.$t('brandgroup'), allowEditing: false, bgColor: this.bgColor1, width: 100 },
				{ dataField: 'ORDERDATE', caption: this.$t('orderdate'), allowEditing: false, dataType: 'date', bgColor: this.bgColor1, width: 100 },
				{ dataField: 'ORDERNO', caption: this.$t('orderno'), allowEditing: false, bgColor: this.bgColor1, fixed: true , width: 100},
				{ dataField: 'Z_REQ_DELIVERY_DATE', caption: this.$t('z_req_delivery_date'), allowEditing: false, width: 100 },
				{ dataField: 'Z_STYLE_NO', caption: this.$t('z_style_no'), allowEditing: false, width: 100 },
				{ dataField: 'Z_DEGREE', caption: this.$t('z_degree'), allowEditing: false, width: 100 },
				{ dataField: 'TYPE', caption: this.$t('type'), allowEditing: false, width: 100 },
				{ dataField: 'CLOTHES', caption: this.$t('clothes'), allowEditing: false, width: 100 },
				{ dataField: 'PRODUCT_YM', caption: this.$t('product_ym'), allowEditing: false, width: 100 },
				{ dataField: 'BRAND', caption: this.$t('brand'), allowEditing: false, width: 100 },
				{ dataField: 'YY', caption: this.$t('yy'), allowEditing: false, width: 100 },
				{ dataField: 'SEASON', caption: this.$t('season'), allowEditing: false, width: 100 },
				{ dataField: 'STYLE_NO', caption: this.$t('style_no'), allowEditing: false, width: 100 },
				{ dataField: 'SEX', caption: this.$t('sex'), allowEditing: false, width: 100 },
				{ dataField: 'SELLPRICE', caption: this.$t('sellprice'), allowEditing: false, formatFloat: '0', width: 100 },
				{ dataField: 'LAUNDRYCODE', caption: this.$t('laundrycode'), allowEditing: false, width: 100 },
				{ dataField: 'IMPORT_NAME', caption: this.$t('import_name'), allowEditing: false, width: 100 },
				{ dataField: 'COUNTRY', caption: this.$t('country'), allowEditing: false, width: 100 },
				{ dataField: 'CUST_NAME', caption: this.$t('cust_name'), allowEditing: false, width: 100 },
				{ dataField: 'KIND', caption: this.$t('kind'), allowEditing: false, width: 100 },
				{ dataField: 'LABEL_TYPE', caption: this.$t('label_type'), allowEditing: false, width: 100 },
				{ dataField: 'KIND_PR_MODE', caption: this.$t('kind_pr_mode'), allowEditing: false, width: 100 },
				{ dataField: 'RFID_YN', caption: this.$t('rfid_yn'), allowEditing: false, width: 100 },
				{ dataField: 'CAREQTY', caption: this.$t('careqty'), allowEditing: false , summaryType: 'sum', formatFloat: '0', width: 100},
				{ dataField: 'TOTWORKITEM', caption: this.$t('totworkitem'), summaryType: 'sum', formatFloat: '0', allowEditing: false, bgColor: this.bgColor1, width: 100 },
				{ dataField: 'STATE', caption: this.$t('state'), allowEditing: false, bgColor: this.bgColor1, width: 100 },
				{ dataField: 'ORDER_YN', caption: this.$t('order_yn'), allowEditing: false, width: 100 },
				{ dataField: 'BRANDNAME', caption: this.$t('brandname'), allowEditing: false, width: 100 },
				{ dataField: 'GOODSNAME', caption: this.$t('goodsname'), allowEditing: false, width: 120 },
				{ dataField: 'SHNAME', caption: this.$t('shname'), allowEditing: false, width: 100 },
				{ dataField: 'FIT_COATPANTS', caption: this.$t('fit_coatpants'), allowEditing: false, width: 100 },
				{ dataField: 'FIT_TYPE', caption: this.$t('fit_type'), allowEditing: false, width: 100 },
				{ dataField: 'FIT_TYPE_MIN', caption: this.$t('fit_type_min'), allowEditing: false, width: 100 },
				{ dataField: 'FIT_TYPE_MAX', caption: this.$t('fit_type_max'), allowEditing: false, width: 100 },
				{ dataField: 'FIT_TYPE2', caption: this.$t('fit_type2'), allowEditing: false, width: 100 },
				{ dataField: 'FIT_TYPE2_MIN', caption: this.$t('fit_type2_min'), allowEditing: false, width: 100 },
				{ dataField: 'FIT_TYPE2_MAX', caption: this.$t('fit_type2_max'), allowEditing: false, width: 100 },
				{ dataField: 'LABEL_DESCRIPT', caption: this.$t('label_descript'), allowEditing: false, width: 100 },
				{ dataField: 'SELLPRICE_ENG', caption: this.$t('sellprice_eng'), allowEditing: false, width: 100 },
				{ dataField: 'SELLPRICE_CHN', caption: this.$t('sellprice_chn'), allowEditing: false, width: 100 },
				{ dataField: 'IMPORT_NAME_ENG', caption: this.$t('import_name_eng'), allowEditing: false, width: 100 },
				{ dataField: 'IMPORT_NAME_CHN', caption: this.$t('import_name_chn'), allowEditing: false, width: 100 },
				{ dataField: 'ITEM_NAME', caption: this.$t('item_name'), allowEditing: false, width: 100 },
				{ dataField: 'ITEM_NAME_ENG', caption: this.$t('item_name_eng'), allowEditing: false, width: 100 },
				{ dataField: 'ITEM_NAME_CHN', caption: this.$t('item_name_chn'), allowEditing: false, width: 100 },
				{ dataField: 'CUST_NAME_ENG', caption: this.$t('cust_name_eng'), allowEditing: false, width: 100 },
				{ dataField: 'CUST_NAME_CHN', caption: this.$t('cust_name_chn'), allowEditing: false, width: 100 },
				{ dataField: 'CERTI_BRAND', caption: this.$t('certi_brand'), allowEditing: false, width: 100 },
				{ dataField: 'CERTI_CLOTHES', caption: this.$t('certi_clothes'), allowEditing: false, width: 100 },
				{ dataField: 'CERTI_SEQ_NUM', caption: this.$t('certi_seq_num'), allowEditing: false, width: 100 },
				{ dataField: 'CERTI_NAME1', caption: this.$t('certi_name1'), allowEditing: false, width: 100 },
				{ dataField: 'CERTI_NAME2', caption: this.$t('certi_name2'), allowEditing: false, width: 100 },
				{ dataField: 'CERTI_NAME3', caption: this.$t('certi_name3'), allowEditing: false, width: 100 },
				{ dataField: 'CERTI_SAFETY_TYPE1', caption: this.$t('certi_safety_type1'), allowEditing: false, width: 100 },
				{ dataField: 'CERTI_SAFETY_TYPE2', caption: this.$t('certi_safety_type2'), allowEditing: false, width: 100 },
				{ dataField: 'CERTI_EXEC_STD', caption: this.$t('certi_exec_std'), allowEditing: false, width: 100 },
				{ dataField: 'CERTI_GOODS_CLASS', caption: this.$t('certi_goods_class'), allowEditing: false, width: 100 },
				{ dataField: 'CERTI_GOODS_QC', caption: this.$t('certi_goods_qc'), allowEditing: false, width: 100 },
				{ dataField: 'FACTORY_INFO', caption: this.$t('factory_info'), allowEditing: false, width: 100 },
				{ dataField: 'FACTORY_NAME', caption: this.$t('factory_name'), allowEditing: false, width: 100 },
				{ dataField: 'FACTORY_ADDRESS', caption: this.$t('factory_address'), allowEditing: false, width: 100 },
				{ dataField: 'RFID_LABEL_TYPE', caption: this.$t('rfid_label_type'), allowEditing: false, width: 100 },
				{ dataField: 'MANUFACTURER_NAME', caption: this.$t('manufacturer_name'), allowEditing: false, width: 100 },
				{ dataField: 'Z_MEMO', caption: this.$t('z_memo'), allowEditing: false, width: 100 },
				{ dataField: 'LABEL_COMMENTS', caption: this.$t('label_comments'), allowEditing: false, width: 100 },
				{ dataField: 'FILL_W', caption: this.$t('fill_w'), allowEditing: false, width: 100 },
				{ dataField: 'LABEL_DESCRIPT_ENG', caption: this.$t('label_descript_eng'), allowEditing: false, width: 100 },
				{ dataField: 'LABEL_DESCRIPT_CHN', caption: this.$t('label_descript_chn'), allowEditing: false, width: 100 },
				{ dataField: 'MIXRATE_TITLE', caption: this.$t('mixrate_title'), allowEditing: false, width: 100 },
			];
		},
		headersColor() {
			return [
				{ dataField: 'BRANDGROUP', caption: this.$t('brandgroup'), allowEditing: false },
				{ dataField: 'ORDERDATE', caption: this.$t('orderdate'), dataType: 'date', allowEditing: false },
				{ dataField: 'ORDERNO', caption: this.$t('orderno'), allowEditing: false, fixed: true },
				{ dataField: 'COLOR', caption: this.$t('color'), allowEditing: false },
				{ dataField: 'SIZES', caption: this.$t('sizes'), allowEditing: false },
				{ dataField: 'QTY', caption: this.$t('qty'), allowEditing: false, summaryType: 'sum', formatFloat: '0', bgColor: this.bgColor1 },
				{ dataField: 'BARCODE', caption: this.$t('barcode'), allowEditing: false, bgColor: this.bgColor1 },
				{ dataField: 'PRINT_SIZES', caption: this.$t('print_sizes'), allowEditing: false },
				{ dataField: 'SIZES_CHN', caption: this.$t('sizes_chn'), allowEditing: false },
				{ dataField: 'SIZES_ENG', caption: this.$t('sizes_eng'), allowEditing: false },
				{ dataField: 'COLOR_ENG', caption: this.$t('color_eng'), allowEditing: false },
				{ dataField: 'COLOR_CHN', caption: this.$t('color_chn'), allowEditing: false },                
				{ dataField: 'FIT_TYPE', caption: this.$t('fit_type'), allowEditing: false },
				{ dataField: 'FILL', caption: this.$t('fill'), allowEditing: false },
				{ dataField: 'TAG_FILL', caption: this.$t('tag_fill'), allowEditing: false },                
				{ dataField: 'SIZES_RING', caption: this.$t('sizes_ring'), allowEditing: false },
				{ dataField: 'SIZES_RING_INNER', caption: this.$t('sizes_ring_inner'), allowEditing: false }
			]
		},
		headersMaterial() {
			return [
				{ dataField: 'BRANDGROUP', caption: this.$t('brandgroup'), allowEditing: false },
				{ dataField: 'ORDERDATE', caption: this.$t('orderdate'), dataType: 'date', allowEditing: false },
				{ dataField: 'ORDERNO', caption: this.$t('orderno'), allowEditing: false },
				{ dataField: 'COLOR', caption: this.$t('color'), allowEditing: false },
				{ dataField: 'NUM', caption: this.$t('num'), allowEditing: false },
				{ dataField: 'GUBUN', caption: this.$t('gubun'), allowEditing: false },
				{ dataField: 'MATERIAL', caption: this.$t('material'), allowEditing: false },
				{ dataField: 'MIXRATE', caption: this.$t('mixrate'), allowEditing: false },
				{ dataField: 'GUBUN_ENG', caption: this.$t('gubun_eng'), allowEditing: false },
				{ dataField: 'GUBUN_CHN', caption: this.$t('gubun_chn'), allowEditing: false },
				{ dataField: 'MATERIAL_ENG', caption: this.$t('material_eng'), allowEditing: false },
				{ dataField: 'MATERIAL_CHN', caption: this.$t('material_chn'), allowEditing: false }
			];
		},
		headersRFID() {
			return [
				{ dataField: 'RFID_BRAND', caption: this.$t('rfid_brand'), allowEditing: false },
				{ dataField: 'ORDERDATE', caption: this.$t('orderdate'), dataType: 'date', allowEditing: false },
				{ dataField: 'ORDERNO', caption: this.$t('orderno'), allowEditing: false },
				{ dataField: 'COLOR', caption: this.$t('color'), allowEditing: false },
				{ dataField: 'SIZES', caption: this.$t('sizes'), allowEditing: false },
				{ dataField: 'IF_NO', caption: this.$t('if_no'), allowEditing: false },
				{ dataField: 'IF_SEQ', caption: this.$t('if_seq'), allowEditing: false },
				{ dataField: 'RFID_CD', caption: this.$t('rfid_cd'), allowEditing: false },
				{ dataField: 'SERIAL_CD', caption: this.$t('serial_cd'), allowEditing: false },
			]
		}
  },
  /*############### mounted #######################*/
  mounted() {
    this.lst_download_yn = "";
    const seft = this;
  },
  /*############### methods #######################*/
  methods: {
    OnClick(e) {
      this.sel_row = e.rowIndex;
    },
    /*************on Process Confirm*******************/
    onClickButton(action) {
      this.actionProcess = action;
      this.actionDialog = true;
      this.active_tab = action;
      //console.log(this.active);
      switch (action) {
        case 0:
          setTimeout(() => {
            this.$refs.grd_Color.loadData();
          }, 1000);
          break;

        case 1:
          setTimeout(() => {
            this.$refs.grd_Material.loadData();
          }, 1000);
          break;

        case 2:
          setTimeout(() => {
            this.$refs.grd_RFID.loadData();
          }, 1000);
          break;
      }
    },
	//----------------------------------------------
	onRowPrepared_0(e) 
	{      
		if(e.rowType === "data") 
		{
			if(e.rowType === "data") 
            {
				if(e.data.RFID_YN =='Y' ) 
				{
					e.rowElement.style.fontWeight = "bold"
					e.rowElement.style.background = "#FFECD9";
					e.rowElement.style.color = "RED";
				}else{
					if (e.data.CAREQTY != '0')
					{
					e.rowElement.style.color = "BLUE";
					e.rowElement.style.fontWeight = "bold"
					}else{

					// e.rowElement.style.color = "YELLOW";
					e.rowElement.style.fontWeight = "bold"
					}
				}
            }
		}
	},
    //----------------------------------------------
    onSearch() {
      this.$refs.gridData.loadData();
    },
    //----------------------------------------------
    async onCellClickGrdSearch(_event) {
      this.p_BRANDGROUP = _event.data.BRANDGROUP;
      this.p_ORDERDATE = _event.data.ORDERDATE;
      this.p_ORDERNO = _event.data.ORDERNO;
      this.P_IF_NO = _event.data.IF_NO;
      switch (this.active_tab) {
        case 0:
          setTimeout(() => {
            this.$refs.grd_Color.loadData();
          }, 1000);
          break;

        case 1:
          setTimeout(() => {
            this.$refs.grd_Material.loadData();
          }, 1000);
          break;

        case 2:
          setTimeout(() => {
            this.$refs.grd_RFID.loadData();
          }, 1000);
          break;
      }
    },
    //-----------------------------------------------------------
    
    
    
  },
};
/*==================================================================== END export default  ========================================================================================*/
</script>
<!-- ================================================================= END SCRIPT  ============================================================================================== -->
