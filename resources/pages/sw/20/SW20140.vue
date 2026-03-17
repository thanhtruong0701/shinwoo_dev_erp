<!-- ================================================================= BEGIN DESIGN LAYOUT======================================================================================= -->
<template>
  <v-container fluid class="py-0 px-1" v-resize="onResize">
    <v-row no-gutters>
      <v-col cols="12">
        <v-card id="panelSearch" outlined class="mb-2">
          <v-row align="center" class="px-2">
            <v-container fluid class="">
              <v-row dense align="center" justify="space-between">
                <v-col cols="2">
					<BaseDatePicker start v-model="dt_from" :label="$t('from_date')" default ></BaseDatePicker>
                </v-col>
				 <v-col cols="2">
					<BaseDatePicker start v-model="dt_to" :label="$t('date_to')" default ></BaseDatePicker>
                </v-col>
				<v-col cols="2">
				<BaseSelect
					:label="$t('Order Type')"
					v-model="selectedOrderType"
					:lstData="lstOrderType"
					item-text="text"
					item-value="value"  
				/>
                </v-col>
                <v-col cols="2">
				<BaseInput
                    v-model="txt_search_rfid_cd"
                    :label="$t('search_order_no')"
                    @keyPressEnter="onSearch()"
                />
                </v-col>
                <v-col cols="4">
                  <div class="d-flex align-center justify-end">
                    <BaseButton
                      btn_type="icon"
                      icon_type="search"
                      :btn_text="$t('search')"
                      :disabled="false"
                      @onclick="onSearch()"
                    />
                    <!--BaseButton
                      btn_type="icon"
                      icon_type="new"
                      :btn_text="$t('new')"
                      :disabled="false"
                      @onclick="onAdd()"
                    /-->
                    <BaseButton
                      btn_type="icon"
                      icon_type="save"
                      :btn_text="$t('save')"
                      :disabled="false"
                      @onclick="onSave()"
                    />
                    <!--BaseButton
                      btn_type="icon"
                      icon_type="delete"
                      :btn_text="$t('delete')"
                      :disabled="false"
                      @onclick="onDelete()"
                    /-->
                  </div>
                </v-col>
              </v-row>
            </v-container>
          </v-row>
        </v-card>
        <v-card>
          <v-row align="center" no-gutters>
            <BaseGridView
              ref="grdTags"
              :header="grdHeader"
              sel_procedure="SW_SEL_SW20140_NOCACHE"
              :multiselect="true"
              :headertype="1"
              :filter_paras="[this.dt_from,this.dt_to,this.selectedOrderType, this.txt_search_rfid_cd]"
              :height="gridHeight"
              upd_procedure="SW_UPD_SW20140_NOCACHE"
              :editable="true"
              @cellClick="onCellClick"
              :update_paras="[
                'PK',
                'ORDER_TYPE',
              ]"
            />
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <color-picker
      ref="refColorDialog"
      @callBackData="onCallBackColor"
      :inputColor="selectedColor"
    />
  </v-container>
</template>

<!-- ================================================================= END DESIGN LAYOUT & BEGIN SCRIPT ========================================================================= --> 

<script>
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import ColorDialog from "@/components/part/10/controls/hr_color_picker.vue";
export default {
  /*############### DEFAULT #######################*/
  layout: "default",
  middleware: "user",
  /*############### components ####################*/
  components: {
    "color-picker": ColorDialog,
  },
  /*############### data ##########################*/
  data: () => ({
    dt_from: "",
	dt_to: "",
	gridOrderType: [],
	selectedOrderType: "",
    txt_input_rfid_scan: "", 
	txt_search_rfid_cd: "",
    selectedColor: "",
    selectedCellIndex: "",
  }),
  /*############### created #######################*/
  created() {
  //this.gridOrderType = await this._getCommonCode('SW20140', this.mCompany);
    //this.initMstData();
    // this.initMstPara();
	this.getCommonCode();
  },
  /*############### watch ######################*/
  watch: {},
  /*############### computed ######################*/
  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
    gridHeight() {
      return this.formContainerHeight - 140;
    },
    masterContainerHeight() {
      return (this.formContainerHeight - 48) / 2;
    },
	/*1. Normal ,2. Sample,3. Compensation,4. Test,5. Other*/
	lstOrderType() {
      return [
		{ value: "", text: "SELECT ALL" },
        { value: "NM", text: "Normal" },
        { value: "SP",text: "Sample" },
        { value: "CS", text: "Compensation" },
		{ value: "TE",text: "Test" },
        { value: "OT", text: "Other" }
      ]
    },
    grdHeader() {
	
      return [
        { dataField: 'BRANDGROUP', caption: this.$t('brandgroup'), allowEditing: false, bgColor: this.bgColor1, width: 100 },
				{ dataField: 'ORDERDATE', caption: this.$t('orderdate'), allowEditing: false, dataType: 'date', bgColor: this.bgColor1, width: 100 },
				{ dataField: 'ORDERNO', caption: this.$t('orderno'), allowEditing: false, bgColor: this.bgColor1, fixed: true , width: 100},
				
				{ dataField: 'ORDER_TYPE', caption: this.$t('order_type'), allowEditing: true, bgColor: this.bgColor1, fixed: true , width: 100,
					lookup: { dataSource: this.gridOrderType, displayExpr:'NAME', valueExpr: 'CODE' }
				},
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
  },
  /*############### mounted #######################*/
  mounted() {},

  /*############### methods #######################*/
  methods: {
    async onCellClick(row) {
      if (!row.column.editable) {
        return;
      }
      if (row.column.datafield == "colour") {
        this.openColorPicker(row);
      }
    },
    openColorPicker(data) {
      this.selectedCellIndex = data.rowindex;
      this.$refs.refColorDialog.dialogIsShow = true;
    },
    onCallBackColor(value) {
      this.$refs.grdTags.onSet("colour", value, true, this.selectedCellIndex);
    },
    async onProcessConfirm(action) {
      // this.actionProcess = action;
      //this.actionDialog = true;

      let promise = Swal.fire({
        icon: "question",
        title: this.$t("do_you_want_to" + "_" + action.toLowerCase()),
        showCancelButton: true,
        confirmButtonText: this.$t("yes"),
        cancelButtonText: this.$t("no"),
      }).then((result) => {
        if (result.isConfirmed) {
          if (action === "SAVE_DATA") {
            this.onSave();
          } else if (action === "DELETE_DATA") {
            this.onDelete();
          }
        }
      });

      await promise;
    },
	//===========================================
	async getCommonCode() {
        this.gridOrderType = await this._getCommonCode('SW20140','22134');//this.mCompany
      },
	//===========================================
    onSearch() {
      this.$refs.grdTags.loadData();
    },
	async onSaveScanRFID1()
	{
		//alert("aa");
		//this.onSaveScanRFID();
	},
	
	async onSaveScanRFID()
	{
		const dso = {
        type: "process",
        updpro: "SW_PRO_SWSO400_NOCACHE",
        para: [this.txt_input_rfid_scan],
      };
      let row = await this._dsoCall(dso, "SUBMIT", false);
      if (row) {
        //this.showNotification("success", "Information", this.$t("success"));
        this.onSearch();
      }
	  this.txt_input_rfid_scan=null;
        this.$refs.barcode.focus();
	},
    onAdd() {
      this.$refs.grdTags.addRow();
    },

    async onSave() {
      /*let requireCol = ["tag_id", "tag_nm", "mt_comcode"];
      let validate = this.$refs.grdTags.onCheckValid(requireCol);
      if (validate) {*/
        this.$refs.grdTags.saveData();
      //}
    },
    ///Begin Hàm validate input///
    checkData() {
      return true;
    },
    ///End Hàm validate input///
    onDelete() {
      this.$refs.grdTags.onSetMarkedDelete(true);
    },
     myCellHTML(row, column, value, cellhtml) {
      //this fuction is to create a html string for the chart to render in the grid
      let html_children = "";
      
      // for (let i = 0; i < value.length; i++) {
      //   const e = value[i];
      //   let color = "";
      //   switch (e.type) {
      //     case "operating":
      //       color = "#3171D3";
      //       break;
      //     case "none_operating":
      //       color = "#CA0A28";
      //       break;
      //     case "blank":
      //       color = "#808080";
      //       break;
      //   }
      //   if (value.length <= 1) {
      //     html_children =
      //       html_children +
      //       "<div style='background-color:" +
      //       color +
      //       ";height:50%; width:" +
      //       100 +
      //       "%!important'></div>";
      //   } else {
      //     html_children =
      //       html_children +
      //       "<div style='background-color:" +
      //       color +
      //       ";height:50%; width:" +
      //       (e.time / 60) * 100 +
      //       "%!important'></div>";
      //   }
      // }
      if(value==''||value==null){
        value="#CA0A28"
      }
      let html =
        `<did style='height:100%;width:100%;display: flex;align-items: center;justify-content: center'>
           <span style="background-color:${value};height:80%;width:80%;border-radius: 5px;display: flex;align-items: center;justify-content: center;color:white"><p>${value}</p></span>
        </div>`;
      return html;
    },
  },
};
/*==================================================================== END export default  ========================================================================================*/
</script>
<!-- ================================================================= END SCRIPT  ============================================================================================== -->
