<template>
  <GwGridLayout dense align="start" colsPerRow="1" containerHeight="auto" @callBackHeight="parentHeight = $event">
    <BaseDatePicker colspan="2" outlined default :clearable="false" :label="$t('from_date')" v-model="fromDate" />
    <BaseDatePicker colspan="2" outlined default :clearable="false" :label="$t('to_date')" v-model="toDate" />
    <BaseSelect colspan="2" outlined :label="$t('status')" item-text="text" item-value="value" :lstData="statusList" v-model="selectedStatus" :text_all="$t('select_all')" />
    <BaseInput colspan="2" outlined :label="$t('brand')" v-model="inputBrand" />
    <GwFlexBox colspan="1" align-self="center">
      <BaseButton :btn_text="$t('search')" @onclick="search" />
    </GwFlexBox>
    <BaseDatePicker colspan="2" outlined default :clearable="false" :label="$t('confirm_date')" v-model="confirmDate" />
    <GwFlexBox colspan="1" align-self="center">
      <BaseButton :btn_text="$t('confirm')" @onclick="confirm" />
    </GwFlexBox>
    <v-spacer></v-spacer>
    <DataGridView
      colspan="12" 
      column-resizing-mode="widget"
      ref="dataGrid"      
      :header="headers"
      sel_procedure="SW_SEL_SW20020_1_NOCACHE"
      :filter_paras="[fromDate, toDate, selectedStatus]" 
      :filterRow="true"
      select_mode="Multiple"
      :auto_load="false"
      :max_height="gridHeight"
      @cellClickData="onCellClickDataGrid"
      @onSelectionDataChanged="onSelectionDataChanged"
    />
    <!-- <BaseTabs colspan="9" @changed="tabChanged">
      <BaseTab :name="$t('order')" tabname="order" :eager="true">
        <DataGridView
          column-resizing-mode="widget"
          ref="gridOrder"      
          :header="headersOrder"
          sel_procedure="SW_SEL_SW20020_2_NOCACHE"
          :filter_paras="[selectedIFNo]" 
          :filterRow="true"
          select_mode="Single"
          :auto_load="false"
          :max_height="gridHeight-35-16"
        />
      </BaseTab>
      <BaseTab :name="$t('color')" tabname="color" :eager="true">
        <DataGridView
          column-resizing-mode="widget"
          ref="gridColor"      
          :header="headersColor"
          sel_procedure="SW_SEL_SW20020_3_NOCACHE"
          :filter_paras="[selectedIFNo]" 
          :filterRow="true"
          select_mode="Single"
          :auto_load="false"
          :max_height="gridHeight-35-16"
        />
      </BaseTab>
      <BaseTab :name="$t('material')" tabname="material" :eager="true">
        <DataGridView
          column-resizing-mode="widget"
          ref="gridMaterial"      
          :header="headersMaterial"
          sel_procedure="SW_SEL_SW20020_4_NOCACHE"
          :filter_paras="[selectedIFNo]" 
          :filterRow="true"
          select_mode="Single"
          :auto_load="false"
          :max_height="gridHeight-35-16"
        />
      </BaseTab>
      <BaseTab :name="$t('tid')" tabname="tid" :eager="true">
        <DataGridView
          column-resizing-mode="widget"
          ref="gridTID"      
          :header="headersTID"
          sel_procedure="SW_SEL_SW20020_5_NOCACHE"
          :filter_paras="[selectedIFNo]" 
          :filterRow="true"
          select_mode="Single"
          :auto_load="false"
          :max_height="gridHeight-35-16"
        />
      </BaseTab>
    </BaseTabs> -->
  </GwGridLayout>
</template>

<script>
import moment from "moment";
export default {
  layout: "default",
  middleware: "user",

  data:()=>({
    parentHeight: 0,
    fromDate: moment().subtract(1, 'week').format("YYYYMMDD"),
    toDate: "",
    selectedStatus: "",
    inputBrand: "",
    confirmDate: "",
    // selectedTab: "order",
    selectedIFNo: "",
    bgColor1: "#FCE5CD",
    ifNoPKArray: null
  }),

  created() {},

  computed: {
    statusList() {
      return [
        { value: 1, text: this.$t("new") },
        { value: 2, text: this.$t("confirm") },
        { value: 3, text: this.$t("finish_delivery") }
      ]
    },
    headers() {
      return [
        { dataField: 'BRANDGROUP', caption: this.$t('brandgroup'), allowEditing: false },
        { dataField: 'BRANDNAME', caption: this.$t('brandname'), allowEditing: false },
        { dataField: 'YY', caption: this.$t('year'), allowEditing: false },
        { dataField: 'SEASON', caption: this.$t('season'), allowEditing: false },
        { dataField: 'Z_STYLE_NO', caption: this.$t('z_style_no'), allowEditing: false },
        { dataField: 'STYLE_NO', caption: this.$t('style_no'), allowEditing: false },
        { dataField: 'ORDERDATE', caption: this.$t('orderdate'), dataType: "date", allowEditing: false },
        { dataField: 'ORDERNO', caption: this.$t('orderno'), allowEditing: false },
        { dataField: 'COUNTRY', caption: this.$t('country'), allowEditing: false },
        { dataField: 'CAREQTY', caption: this.$t('careqty'), allowEditing: false },
        { dataField: 'TOTWORKITEM', caption: this.$t('totworkitem'), allowEditing: false },
        { dataField: 'ORDERTYPE', caption: this.$t('ordertype'), allowEditing: false },
        { dataField: 'KIND', caption: this.$t('kind'), allowEditing: false },
        { dataField: 'TYPE', caption: this.$t('type'), allowEditing: false },
        { dataField: 'LAUNDRY', caption: this.$t('laundry'), allowEditing: false },
        { dataField: 'RFID_YN', caption: this.$t('rfid_yn'), allowEditing: false },
        { dataField: 'Z_REQ_DELIVERY_DATE', caption: this.$t('z_req_delivery_date'), dataType: "date", allowEditing: false },
        { dataField: 'STATE', caption: this.$t('state'), allowEditing: false },
        { dataField: 'IF_CHECKDATE', caption: this.$t('if_checkdate'), allowEditing: false },
        { dataField: 'IF_EXPECTED_DATE', caption: this.$t('if_expected_date'), allowEditing: false },
        { dataField: 'IF_NO', caption: this.$t('if_no'), allowEditing: false }
      ]
    },
    gridHeight() {
      return this._calculateHeight(this.parentHeight, 85);
    },
    /* headersOrder() {
      return [
        { dataField: "IF_NO", caption: this.$t("if_no"), allowEditing: false, bgColor: this.bgColor1 },
        { dataField: "IF_SEQ", caption: this.$t("if_seq"), allowEditing: false },
        { dataField: "IF_GUBUN", caption: this.$t("if_gubun"), allowEditing: false },
        { dataField: "IF_FLAG", caption: this.$t("if_flag"), allowEditing: false },
        { dataField: "IF_DATE", caption: this.$t("if_date"), dataType: "date", allowEditing: false },
        { dataField: "BRANDGROUP", caption: this.$t("brand_group"), allowEditing: false },
        { dataField: "ORDERDATE", caption: this.$t("order_date"), dataType: "date", allowEditing: false },
        { dataField: "ORDERNO", caption: this.$t("order_no"), allowEditing: false },
        { dataField: "COLOR", caption: this.$t("color"), allowEditing: false },
        { dataField: "SIZES", caption: this.$t("sizes"), allowEditing: false },
        { dataField: "QTY", caption: this.$t("qty"), allowEditing: false },
        { dataField: "BARCODE", caption: this.$t("barcode"), allowEditing: false },
        { dataField: "SIZES_CHN", caption: this.$t("sizes_chn"), allowEditing: false },
        { dataField: "SIZES_ENG", caption: this.$t("sizes_eng"), allowEditing: false },
        { dataField: "COLOR_ENG", caption: this.$t("color_eng"), allowEditing: false },
        { dataField: "COLOR_CHN", caption: this.$t("color_chn"), allowEditing: false },
        { dataField: "SIZES_TWN", caption: this.$t("sizes_twn"), allowEditing: false },
        { dataField: "COLOR_TWN", caption: this.$t("color_twn"), allowEditing: false },
        { dataField: "FIT_TYPE", caption: this.$t("fit_type"), allowEditing: false },
        { dataField: "FILL", caption: this.$t("fill"), allowEditing: false },
        { dataField: "TAG_FILL", caption: this.$t("tag_fill"), allowEditing: false },
        { dataField: "RFID_LABEL_TYPE", caption: this.$t("rfid_label_type"), allowEditing: false },
        { dataField: "RFID_LABEL_TYPE_NAME", caption: this.$t("rfid_label_type_name"), allowEditing: false },
        { dataField: "SIZES_RING", caption: this.$t("sizes_ring"), allowEditing: false },
        { dataField: "SIZES_RING_INNER", caption: this.$t("size_ring_inner"), allowEditing: false },
        { dataField: "PRINT_SIZES", caption: this.$t("print_sizes"), allowEditing: false },
        { dataField: "CREATE_DATE", caption: this.$t("create_date"), allowEditing: false }        
      ];
    },
    headersColor() {
      return [
        { dataField: "IF_GUBUN", caption: this.$t("if_gubun"), allowEditing: false },
        { dataField: "IF_FLAG", caption: this.$t("if_flag"), allowEditing: false },
        { dataField: "IF_DATE", caption: this.$t("if_date"), dataType: "date", allowEditing: false },
        { dataField: "BRANDGROUP", caption: this.$t("brandgroup"), allowEditing: false },
        { dataField: "ORDERNO", caption: this.$t("orderno"), allowEditing: false },
        { dataField: "PRODUCT_YM", caption: this.$t("product_ym"), allowEditing: false },
        { dataField: "ORDER_CODE", caption: this.$t("order_code"), allowEditing: false },
        { dataField: "ORDER_NAME", caption: this.$t("order_name"), allowEditing: false },
        { dataField: "STYLE_PO_NO", caption: this.$t("style_po_no"), allowEditing: false },
        { dataField: "STYLE_NO", caption: this.$t("style_no"), allowEditing: false },
        { dataField: "DEGREE", caption: this.$t("degree"), allowEditing: false },
        { dataField: "SEX", caption: this.$t("sex"), allowEditing: false },
        { dataField: "SELLPRICE", caption: this.$t("sellprice"), allowEditing: false },
        { dataField: "SELLPRICE_ENG", caption: this.$t("sellprice_eng"), allowEditing: false },
        { dataField: "SELLPRICE_CHN", caption: this.$t("sellprice_chn"), allowEditing: false },
        { dataField: "SELLPRICE_TWN", caption: this.$t("sellprice_twn"), allowEditing: false },
        { dataField: "LAUNDRYCODE", caption: this.$t("laundrycode"), allowEditing: false },
        { dataField: "LAUNDRY", caption: this.$t("laundry"), allowEditing: false },
        { dataField: "IMPORT_NAME", caption: this.$t("import_name"), allowEditing: false },
        { dataField: "IMPORT_NAME_ENG", caption: this.$t("import_name_eng"), allowEditing: false },
        { dataField: "IMPORT_NAME_CHN", caption: this.$t("import_name_chn"), allowEditing: false },
        { dataField: "IMPORT_NAME_TWN", caption: this.$t("import_name_twn"), allowEditing: false },
        { dataField: "COUNTRY", caption: this.$t("country"), allowEditing: false },
        { dataField: "CUST_CODE", caption: this.$t("cust_code"), allowEditing: false },
        { dataField: "CUST_NAME", caption: this.$t("cust_name"), allowEditing: false },
        { dataField: "CUST_NAME_ENG", caption: this.$t("cust_name_eng"), allowEditing: false },
        { dataField: "CUST_NAME_CHN", caption: this.$t("cust_name_chn"), allowEditing: false },
        { dataField: "CUST_NAME_TWN", caption: this.$t("cust_name_twn"), allowEditing: false },
        { dataField: "KIND", caption: this.$t("kind"), allowEditing: false },
        { dataField: "CAREQTY", caption: this.$t("careqty"), allowEditing: false },
        { dataField: "MEMO", caption: this.$t("memo"), allowEditing: false },
        { dataField: "INPUTMAN", caption: this.$t("inputman"), allowEditing: false },
        { dataField: "INPUTDATE", caption: this.$t("inputdate"), allowEditing: false },
        { dataField: "MODIFIER", caption: this.$t("modifier"), allowEditing: false },
        { dataField: "MODIFYDATE", caption: this.$t("modifydate"), allowEditing: false },
        { dataField: "STATE", caption: this.$t("state"), allowEditing: false },
        { dataField: "ORDER_YN", caption: this.$t("order_yn"), allowEditing: false },
        { dataField: "UPDATE_YN", caption: this.$t("update_yn"), allowEditing: false },
        { dataField: "BRANDNAME", caption: this.$t("brandname"), allowEditing: false },
        { dataField: "TOTWORKITEM", caption: this.$t("totworkitem"), allowEditing: false },
        { dataField: "BRAND", caption: this.$t("brand"), allowEditing: false },
        { dataField: "TYPE", caption: this.$t("type"), allowEditing: false },
        { dataField: "CLOTHES", caption: this.$t("clothes"), allowEditing: false },
        { dataField: "SIZECOMMENT", caption: this.$t("sizecomment"), allowEditing: false },
        { dataField: "ORDERTYPE", caption: this.$t("ordertype"), allowEditing: false },
        { dataField: "GOODSNAME", caption: this.$t("goodsname"), allowEditing: false },
        { dataField: "SAFETYNO", caption: this.$t("safetyno"), allowEditing: false },
        { dataField: "ONLINES", caption: this.$t("onlines"), allowEditing: false },
        { dataField: "SHNAME", caption: this.$t("shname"), allowEditing: false },
        { dataField: "DEFINITE_TYPE", caption: this.$t("definite_type"), allowEditing: false },
        { dataField: "DEFINITE_CODE", caption: this.$t("definite_code"), allowEditing: false },
        { dataField: "DEFINITE_CODE2", caption: this.$t("definite_code2"), allowEditing: false },
        { dataField: "ORDERCOMPANY", caption: this.$t("ordercompany"), allowEditing: false },
        { dataField: "YY", caption: this.$t("yy"), allowEditing: false },
        { dataField: "SEASON", caption: this.$t("season"), allowEditing: false },
        { dataField: "CNT", caption: this.$t("cnt"), allowEditing: false },
        { dataField: "REQUESTDATE", caption: this.$t("requestdate"), allowEditing: false },
        { dataField: "CHECKDATE", caption: this.$t("checkdate"), allowEditing: false },
        { dataField: "CLOSEDATE", caption: this.$t("closedate"), allowEditing: false },
        { dataField: "FIT_COATPANTS", caption: this.$t("fit_coatpants"), allowEditing: false },
        { dataField: "FIT_TYPE", caption: this.$t("fit_type"), allowEditing: false },
        { dataField: "FIT_TYPE_MIN", caption: this.$t("fit_type_min"), allowEditing: false },
        { dataField: "FIT_TYPE_MAX", caption: this.$t("fit_type_max"), allowEditing: false },
        { dataField: "FIT_TYPE2", caption: this.$t("fit_type2"), allowEditing: false },
        { dataField: "FIT_TYPE2_MIN", caption: this.$t("fit_type2_min"), allowEditing: false },
        { dataField: "FIT_TYPE2_MAX", caption: this.$t("fit_type2_max"), allowEditing: false },
        { dataField: "LABEL_DESCRIPT", caption: this.$t("label_descript"), allowEditing: false },
        { dataField: "LABEL_DESCRIPT_ENG", caption: this.$t("label_descript_eng"), allowEditing: false },
        { dataField: "LABEL_DESCRIPT_CHN", caption: this.$t("label_descript_chn"), allowEditing: false },
        { dataField: "LABEL_TYPE", caption: this.$t("label_type"), allowEditing: false },
        { dataField: "LABEL_FRONT_LANG", caption: this.$t("label_front_lang"), allowEditing: false },
        { dataField: "LABEL_BACK_LANG", caption: this.$t("label_back_lang"), allowEditing: false },
        { dataField: "KIND_PR_MODE", caption: this.$t("kind_pr_mode"), allowEditing: false },
        { dataField: "ITEM_NAME", caption: this.$t("item_name"), allowEditing: false },
        { dataField: "ITEM_NAME_ENG", caption: this.$t("item_name_eng"), allowEditing: false },
        { dataField: "ITEM_NAME_CHN", caption: this.$t("item_name_chn"), allowEditing: false },
        { dataField: "ITEM_NAME_TWN", caption: this.$t("item_name_twn"), allowEditing: false },
        { dataField: "CERTI_BRAND", caption: this.$t("certi_brand"), allowEditing: false },
        { dataField: "CERTI_CLOTHES", caption: this.$t("certi_clothes"), allowEditing: false },
        { dataField: "CERTI_SEQ_NUM", caption: this.$t("certi_seq_num"), allowEditing: false },
        { dataField: "CERTI_NAME1", caption: this.$t("certi_name1"), allowEditing: false },
        { dataField: "CERTI_NAME2", caption: this.$t("certi_name2"), allowEditing: false },
        { dataField: "CERTI_NAME3", caption: this.$t("certi_name3"), allowEditing: false },
        { dataField: "CERTI_SAFETY_TYPE1", caption: this.$t("certi_safety_type1"), allowEditing: false },
        { dataField: "CERTI_SAFETY_TYPE2", caption: this.$t("certi_safety_type2"), allowEditing: false },
        { dataField: "CERTI_EXEC_STD", caption: this.$t("certi_exec_std"), allowEditing: false },
        { dataField: "CERTI_GOODS_CLASS", caption: this.$t("certi_goods_class"), allowEditing: false },
        { dataField: "CERTI_GOODS_QC", caption: this.$t("certi_goods_qc"), allowEditing: false },
        { dataField: "FACTORY_NAME", caption: this.$t("factory_name"), allowEditing: false },
        { dataField: "FACTORY_ADDRESS", caption: this.$t("factory_address"), allowEditing: false },
        { dataField: "FACTORY_INFO", caption: this.$t("factory_info"), allowEditing: false },
        { dataField: "RFID_YN", caption: this.$t("rfid_yn"), allowEditing: false },
        { dataField: "RFID_CODE_CREATE", caption: this.$t("rfid_code_create"), allowEditing: false },
        { dataField: "RFID_LABEL_TYPE", caption: this.$t("rfid_label_type"), allowEditing: false },
        { dataField: "RFID_LABEL_TYPE_NAME", caption: this.$t("rfid_label_type_name"), allowEditing: false },
        { dataField: "ANTENA_YN", caption: this.$t("antena_yn"), allowEditing: false },
        { dataField: "LABEL_COMMENTS", caption: this.$t("label_comments"), allowEditing: false },
        { dataField: "MANUFACTURER_NAME", caption: this.$t("manufacturer_name"), allowEditing: false },
        { dataField: "Z_REQ_DELIVERY_DATE", caption: this.$t("z_req_delivery_date"), dataType: "date", allowEditing: false },
        { dataField: "Z_MEMO", caption: this.$t("z_memo"), allowEditing: false },
        { dataField: "Z_STYLE_NO", caption: this.$t("z_style_no"), allowEditing: false },
        { dataField: "Z_DEGREE", caption: this.$t("z_degree"), allowEditing: false },
        { dataField: "FILL_W", caption: this.$t("fill_w"), allowEditing: false },        
        { dataField: "MIXRATE_TITLE", caption: this.$t("mixrate_title"), allowEditing: false },
        { dataField: "CREATE_DATE", caption: this.$t("create_date"), allowEditing: false },
        { dataField: "DEL_IF", caption: this.$t("del_if"), allowEditing: false },
        { dataField: "MOD_DT", caption: this.$t("mod_dt"), allowEditing: false },
        { dataField: "MOD_BY", caption: this.$t("mod_by"), allowEditing: false },
        { dataField: "IF_NO", caption: this.$t("if_no"), allowEditing: false },
        { dataField: "ORDERDATE", caption: this.$t("orderdate"), dataType: "date", allowEditing: false }
      ];
    },
    headersMaterial() {
      return [
        { dataField: "IF_NO", caption: this.$t("if_no"), allowEditing: false, bgColor: this.bgColor1 },
        { dataField: "IF_SEQ", caption: this.$t("if_seq"), allowEditing: false },
        { dataField: "IF_GUBUN", caption: this.$t("if_gubun"), allowEditing: false },
        { dataField: "IF_FLAG", caption: this.$t("if_flag"), allowEditing: false },
        { dataField: "IF_DATE", caption: this.$t("if_date"), dataType: "date", allowEditing: false },
        { dataField: "BRANDGROUP", caption: this.$t("brandgroup"), allowEditing: false },
        { dataField: "ORDERDATE", caption: this.$t("orderdate"), dataType: "date", allowEditing: false },
        { dataField: "ORDERNO", caption: this.$t("orderno"), allowEditing: false },
        { dataField: "NUM", caption: this.$t("num"), allowEditing: false },
        { dataField: "GUBUN", caption: this.$t("gubun"), allowEditing: false },
        { dataField: "MATERIAL", caption: this.$t("material"), allowEditing: false },
        { dataField: "MIXRATE", caption: this.$t("mixrate"), allowEditing: false },
        { dataField: "GUBUN_ENG", caption: this.$t("gubun_eng"), allowEditing: false },
        { dataField: "GUBUN_CHN", caption: this.$t("gubun_chn"), allowEditing: false },
        { dataField: "MATERIAL_ENG", caption: this.$t("material_eng"), allowEditing: false },
        { dataField: "MATERIAL_CHN", caption: this.$t("material_chn"), allowEditing: false },
        { dataField: "GUBUN_TWN", caption: this.$t("gubun_twn"), allowEditing: false },
        { dataField: "MATERIAL_TWN", caption: this.$t("material_twn"), allowEditing: false },
        { dataField: "COLOR", caption: this.$t("color"), allowEditing: false },
        { dataField: "TEAMCODE", caption: this.$t("teamcode"), allowEditing: false },
        { dataField: "COLOR_INFO", caption: this.$t("color_info"), allowEditing: false },
        { dataField: "CREATE_DATE", caption: this.$t("create_date"), allowEditing: false } 
      ];
    },
    headersTID() {
      return [
        { dataField: "IF_NO", caption: this.$t("if_no"), allowEditing: false, bgColor: this.bgColor1 },
        { dataField: "IF_SEQ", caption: this.$t("if_seq"), allowEditing: false },
        { dataField: "IF_GUBUN", caption: this.$t("if_gubun"), allowEditing: false },
        { dataField: "IF_FLAG", caption: this.$t("if_flag"), allowEditing: false },
        { dataField: "IF_DATE", caption: this.$t("if_date"), allowEditing: false },
        { dataField: "BRANDGROUP", caption: this.$t("brandgroup"), allowEditing: false },
        { dataField: "ORDERDATE", caption: this.$t("orderdate"), dataType: "date", allowEditing: false },
        { dataField: "ORDERNO", caption: this.$t("orderno"), allowEditing: false },
        { dataField: "COLOR", caption: this.$t("color"), allowEditing: false },
        { dataField: "SIZES", caption: this.$t("sizes"), allowEditing: false },
        { dataField: "RFID_CD", caption: this.$t("rfid_cd"), allowEditing: false },
        { dataField: "SERIAL_CD", caption: this.$t("serial_cd"), allowEditing: false },
        { dataField: "RFID_BRAND", caption: this.$t("rfid_brand"), allowEditing: false },
        { dataField: "ORDERCOMPANY", caption: this.$t("ordercompany"), allowEditing: false },
        { dataField: "CREATE_DATE", caption: this.$t("create_date"), allowEditing: false }
      ];
    } */
  },

  methods: {
    search() {
      this.$refs.dataGrid.loadData();     
    },

    async confirm() {
      try {
        // console.log("ifNoPKArray:", this.ifNoPKArray, typeof this.ifNoPKArray)
        if(!this.ifNoPKArray) {
          this.showNotification("danger", this.$t('please_select_an_order'), "")
          return;
        }
        const dso = { 
          type: "process", 
          updpro: "SW_PRO_SW20020_CONFIRM", 
          para: [ this.ifNoPKArray ]
        };
        const result = await this._dsoCall(dso, "process", false);
        console.log("confirm:", result);
        if(result) {
          this.showNotification('success', this.$t('process_success'), "", 500);
        }
      } catch (error) {
        console.log("confirm-catch exception:", error.message)
      }
    },

    onSelectionDataChanged(data) {
      // console.log("onSelectionDataChanged:", data);
      this.ifNoPKArray = data.map(item => item.PK).join(",");      
      // console.log("ifNoPKArray", this.ifNoPKArray)
    },

    /* tabChanged(val) {
      this.selectedTab = val.tab.$attrs.tabname;      
      this.searchFromTab(this.selectedTab)
    }, */

    onCellClickDataGrid({ IF_NO }) {
      this.selectedIFNo = IF_NO;
      this.searchFromTab(this.selectedTab)
    },

    /* searchFromTab(val) {
      switch (val) {
        case "order":
            this.$refs.gridOrder.loadData();
            break;
          case "color":
            this.$refs.gridColor.loadData();
            break;
          case "material":
            this.$refs.gridMaterial.loadData();
            break;
          case "tid":
            this.$refs.gridTID.loadData();
            break;        
          default:            
            break;
      }
    } */
  }
}
</script>