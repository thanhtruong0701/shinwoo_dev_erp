<!-- ================================================================= BEGIN DESIGN LAYOUT======================================================================================= -->
<template>
  <v-container fluid class="py-0 px-1" v-resize="onResize">
    <v-row no-gutters>
      <v-col cols="12">
        <v-card id="panelSearch" outlined class="mb-2">
          <v-row align="center" class="px-2">
            <v-container fluid class="">
              <v-row dense align="center" justify="space-between">
                <v-col cols="1">
					<BaseDatePicker start v-model="dt_from" :label="$t('date_from')" default ></BaseDatePicker>
                </v-col>
				<v-col cols="1">
					<BaseDatePicker start v-model="dt_to" :label="$t('date_to')" default ></BaseDatePicker>
                </v-col>
				<v-col cols="3">
                  <BaseInput
                    v-model="txt_search_rfid_cd"
                    :label="$t('search_customer_wear_acc')"
                    @keyPressEnter="onSearch()"
                  />
                </v-col>
                <v-col cols="3">
				 <!--<v-text-field
                  style="padding-top:0"
                     autofocus
                  ref="barcode"
                  :outlined="false"
                  :label="$t('scan_rfid_cd')"
                  v-model="txt_input_rfid_scan"
                  @keypress.enter="onSaveScanRFID1"
                /> -->
				
                  <!--BaseInput
                    v-model="txt_input_rfid_scan"
                    :label="$t('scan_rfid_cd')"
                    @keyPressEnter="onSaveScanRFID1()"
                  /-->
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
					<!--
                    <BaseButton
                      btn_type="icon"
                      icon_type="new"
                      :btn_text="$t('new')"
                      :disabled="false"
                      @onclick="onAdd()"
                    />
                    <BaseButton
                      btn_type="icon"
                      icon_type="save"
                      :btn_text="$t('save')"
                      :disabled="false"
                      @onclick="onSave()"
                    />
                    <BaseButton
                      btn_type="icon"
                      icon_type="delete"
                      :btn_text="$t('delete')"
                      :disabled="false"
                      @onclick="onDelete()"
                    />
					-->
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
              sel_procedure="SW_SEL_SWSO490_NOCACHE"
              :multiselect="true"
              :headertype="1"
              :filter_paras="[this.dt_from,this.dt_to, this.txt_search_rfid_cd]"
              :height="gridHeight"
              upd_procedure="SW_UPD_SWSO480_NOCACHE"
              :editable="true"
              @cellClick="onCellClick"
              :update_paras="[
                'PK',
				'PRODUCT_DATE',
				'CUSTOMER_NAME',
				'WEAR_ACC',
				'KIND_LABEL',
				'STYLE_NO',
				'GUBUN',
				'DESTINATION',
				'NOTE',
				'ORDER_QTY',
				'LOSS',
				'PRINT_QTY',
				'ORDER_DATE',
				'DELIVERY_DATE',
				'PLAN_DATE',
				'DESIGN_DATE',
				'CUSTOMER_CFM',
				'KIEM_HANG_DAU',
				'START_DATE_PRINT',
				'SHIPPING_SAMPLE',
				'PACKING_DATE',
				'DESIGN_UNCONFIMRED_QTY',
				'DESIGN_CONFIRM_QTY',
				'PRINTED_QTY',
				'PRINT_REMAIN_QTY',
				'LABEL_FINISHED_QTY',
				'LABEL_REMAIN_QTY',
				'ENCODING_FINISHED_QTY',
				'ENCODING_REMAIN_QTY',
				'CUTTING_FINISHED_QTY',
				'CUTTING_REMAIN_QTY',
				'QC_FINISHED_QTY',
				'QC_REMAIN_QTY',
				'REMARKS'
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
    txt_input_rfid_scan: "", 
	txt_search_rfid_cd: "",
    selectedColor: "",
    selectedCellIndex: "",
  }),
  /*############### created #######################*/
  created() {
    //this.initMstData();
    // this.initMstPara();
	//let selectedCellIndex =  auth.getUser();
	//alert(this.selectedCellIndex);
	
  },
  /*############### watch ######################*/
  watch: {
	//OnHideCols();
	//this.$refs.grdTags.setColumnsHidden(["CUSTOMER_NAME", "WEAR_ACC"],true);
	//this.onSearch();
	
  },
  /*############### computed ######################*/
  computed: {
    user() {
      return this.$store.getters["auth/user"];
	  
    },
	
    gridHeight() {
      return this.formContainerHeight - 70;
    },
    masterContainerHeight() {
      return (this.formContainerHeight - 48) / 2;
    },
    grdHeader() {
	
      return [
        {
          field: "PK",
          width: 50,
          title: "PK",
		  visible: false,
          alignment: "center",
        },
        {
          field: "PRODUCT_DATE",  
          width: 90,
          title: "Product date",
          alignment: "center",
		  dataType: 'date',
		  fixed: true,
		  visible: false,
          allowEditing: true,
        },
        {
          field: "CUSTOMER_NAME",
          width: 130,
          title: "CUSTOMER_NAME",
          alignment: "left",
          allowEditing: false,
		  fixed: true,
        },
        {
          field: "WEAR_ACC",
          width: 80,
          title: "WEAR_ACC",
          alignment: "left",
		  allowEditing: true,
		  fixed: true,
		  visible: false,
        },
		{
          field: "KIND_LABEL",
          width: 235,
          title: "KIND_LABEL",
          alignment: "left",
		  allowEditing: false,
		  fixed: true,
        },
		{
          field: "STYLE_NO",
          width: 100,
          title: "STYLE_NO",
          alignment: "left",
		  allowEditing: false,
		  fixed: true,
        },
		{
          field: "GUBUN",
          width: 60,
          title: "GUBUN",
          alignment: "left",
		  allowEditing: false,
		  fixed: true,
        },
		{
          field: "DESTINATION",
          width: 100,
          title: "DESTINATION",
          alignment: "left",
		  allowEditing: false,
		  fixed: true,
        },
		{
          field: "NOTE",
          width: 110,
          title: "NOTE",
          alignment: "left",
		  allowEditing: true,
		  fixed: true,
        },
		{
          field: "ORDER_DATE",
          width: 100,
          title: "ORDER_DATE",
		  dataType: 'date',
          alignment: "left",
		  allowEditing: false,
		  fixed: true,
        },
		{
          field: "ORDER_QTY",
          width: 85,
          title: "ORDER_QTY",
		  type: "number",
          alignment: "right",
		  allowEditing: false,
        },
		{
          field: "LOSS",
          width: 60,
          title: "LOSS",
          type: "number",
          alignment: "right",
		  allowEditing: false,
        },
		{
          field: "PRINT_QTY",
          width: 100,
          title: "PRINT_QTY",
          type: "number",
          alignment: "right",
		  allowEditing: false,
        },
		{
          field: "DELIVERY_DATE",  
          width: 100,
          title: "DELIVERY_DATE",
		  dataType: 'date',
          alignment: "left",
		  allowEditing: true,
        },
		{
          field: "PLAN_DATE",
          width: 80,
          title: "PLAN_DATE",
		  dataType: 'date',
          alignment: "left",
		  allowEditing: true,
        },
		{
          field: "DESIGN_DATE",
          width: 100,
          title: "DESIGN_DATE(Hiền)",
		  dataType: 'date',
          alignment: "left",
		  allowEditing: true,
        },
		{
          field: "CUSTOMER_CFM",
          width: 180,
          title: "CUSTOMER_CFM",
          alignment: "left",
		  allowEditing: true,
        },
		{
          field: "KIEM_HANG_DAU",
          width: 150,
          title: "KIEM_HANG_DAU(Lai)",
          alignment: "left",
		  allowEditing: true,
        },
		{
          field: "START_DATE_PRINT",
          width: 100,
          title: "START_DATE_PRINT(Sơn)",
		  dataType: 'date',
          alignment: "left",
		  allowEditing: true,
        },
		{
          field: "SHIPPING_SAMPLE", 
          width: 150,
          title: "SHIPPING_SAMPLE(Hiền)",
          alignment: "left",
		  allowEditing: true,
        },
		{
          field: "PACKING_DATE",
          width: 100,
          title: "PACKING_DATE(Nhi)",
		  dataType: 'date',
          alignment: "left",
		  allowEditing: true,
        },
		{
          field: "DESIGN_UNCONFIMRED_QTY", 
          width: 100,
          title: "DESIGN_UNCONFIMRED_QTY",
          type: "number",
          alignment: "right",
		  allowEditing: true,
        },
		{
          field: "DESIGN_CONFIRM_QTY",
          width: 120,
          title: "DESIGN_CONFIRM_QTY",
          type: "number",
          alignment: "right",
		  allowEditing: true,
        },
		{
          field: "PRINTED_QTY", 
          width: 100,
          title: "PRINTED_QTY",
          type: "number",
          alignment: "right",
		  allowEditing: true,
        },
		{
          field: "PRINT_REMAIN_QTY",
          width: 100,
          title: "PRINT_REMAIN_QTY",
          type: "number",
          alignment: "right",
		  allowEditing: true,
        },
		{
          field: "LABEL_FINISHED_QTY",
          width: 100,
          title: "LABEL_FINISHED_QTY",
          type: "number",
          alignment: "right",
		  allowEditing: true,
        },
		{
          field: "LABEL_REMAIN_QTY",
          width: 100,
          title: "LABEL_REMAIN_QTY",
          type: "number",
          alignment: "right",
		  allowEditing: true,
        },
		{
          field: "ENCODING_FINISHED_QTY",
          width: 100,
          title: "ENCODING_FINISHED_QTY",
          type: "number",
          alignment: "right",
		  allowEditing: true,
        },
		{
          field: "ENCODING_REMAIN_QTY",
          width: 100,
          title: "ENCODING_REMAIN_QTY",
          type: "number",
          alignment: "right",
		  allowEditing: true,
        },
		{
          field: "CUTTING_FINISHED_QTY", 
          width: 100,
          title: "CUTTING_FINISHED_QTY",
          type: "number",
          alignment: "right",
		  allowEditing: true,
        },
		{
          field: "CUTTING_REMAIN_QTY",
          width: 100,
          title: "CUTTING_REMAIN_QTY",
          type: "number",
          alignment: "right",
		  allowEditing: true,
        },
		{
          field: "QC_FINISHED_QTY",
          width: 100,
          title: "QC_FINISHED_QTY",
          type: "number",
          alignment: "right",
		  allowEditing: true,
        },
		{
          field: "QC_REMAIN_QTY",
          width: 100,
          title: "QC_REMAIN_QTY",
          type: "number",
          alignment: "right",
		  allowEditing: true,
        },
		
        {
          field: "REMARKS",
          width: 200,
          title: "REMARKS",
          alignment: "left",
          allowEditing: true,
        },
        
      ];
    },
	
  },
  /*############### mounted #######################*/
  mounted() {
 
  },

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
	async OnHideCols()
	{
		let user_id=this.user.USER_ID;
		
		if(user_id !="dao-fnf") //Truc(dao-fnf)
		{
			//Truc hidden
				this.$refs.grdTags.setColumnsHidden(["NOTE","DELIVERY_DATE","DESIGN_UNCONFIMRED_QTY","DESIGN_CONFIRM_QTY","PRINTED_QTY","PRINT_REMAIN_QTY","LABEL_FINISHED_QTY","LABEL_REMAIN_QTY","ENCODING_FINISHED_QTY","ENCODING_REMAIN_QTY","CUTTING_FINISHED_QTY","CUTTING_REMAIN_QTY"],true);
			//Nhi hidden
				//this.$refs.grdTags.setColumnsHidden(["DESTINATION", "PACKING_DATE"],true);
			//Hien hidden
				//this.$refs.grdTags.setColumnsHidden(["DESIGN_DATE", "SHIPPING_SAMPLE"],true);  
			//Son hidden
				//this.$refs.grdTags.setColumnsHidden(["START_DATE_PRINT"],true);
			//Lai hidden
				//this.$refs.grdTags.setColumnsHidden(["KIEM_HANG_DAU"],true);
		}
		if(user_id !="nhi-fnf") //Truc(dao-fnf),Nhi,hien,sơn,lai
		{
			//Truc hidden
				//this.$refs.grdTags.setColumnsHidden(["NOTE","DELIVERY_DATE","DESIGN_UNCONFIMRED_QTY","DESIGN_CONFIRM_QTY","PRINTED_QTY","PRINT_REMAIN_QTY","LABEL_FINISHED_QTY","LABEL_REMAIN_QTY","ENCODING_FINISHED_QTY","ENCODING_REMAIN_QTY","CUTTING_FINISHED_QTY","CUTTING_REMAIN_QTY"],true);
			//Nhi hidden
				this.$refs.grdTags.setColumnsHidden(["DESTINATION", "PACKING_DATE"],true);
			//Hien hidden
				//this.$refs.grdTags.setColumnsHidden(["DESIGN_DATE", "SHIPPING_SAMPLE"],true);  
			//Son hidden
				//this.$refs.grdTags.setColumnsHidden(["START_DATE_PRINT"],true);
			//Lai hidden
				//this.$refs.grdTags.setColumnsHidden(["KIEM_HANG_DAU"],true);
		}
		if(user_id !="hien-fnf") //Truc(dao-fnf),Nhi,hien,sơn,lai
		{
			//Truc hidden
				//this.$refs.grdTags.setColumnsHidden(["NOTE","DELIVERY_DATE","DESIGN_UNCONFIMRED_QTY","DESIGN_CONFIRM_QTY","PRINTED_QTY","PRINT_REMAIN_QTY","LABEL_FINISHED_QTY","LABEL_REMAIN_QTY","ENCODING_FINISHED_QTY","ENCODING_REMAIN_QTY","CUTTING_FINISHED_QTY","CUTTING_REMAIN_QTY"],true);
			//Nhi hidden
				//this.$refs.grdTags.setColumnsHidden(["DESTINATION", "PACKING_DATE"],true);
			//Hien hidden
				this.$refs.grdTags.setColumnsHidden(["DESIGN_DATE", "SHIPPING_SAMPLE"],true);  
			//Son hidden
				//this.$refs.grdTags.setColumnsHidden(["START_DATE_PRINT"],true);
			//Lai hidden
				//this.$refs.grdTags.setColumnsHidden(["KIEM_HANG_DAU"],true);
		}
		if(user_id !="son-fnf") //Truc(dao-fnf),Nhi,hien,sơn,lai
		{
			//Truc hidden
				//this.$refs.grdTags.setColumnsHidden(["NOTE","DELIVERY_DATE","DESIGN_UNCONFIMRED_QTY","DESIGN_CONFIRM_QTY","PRINTED_QTY","PRINT_REMAIN_QTY","LABEL_FINISHED_QTY","LABEL_REMAIN_QTY","ENCODING_FINISHED_QTY","ENCODING_REMAIN_QTY","CUTTING_FINISHED_QTY","CUTTING_REMAIN_QTY"],true);
			//Nhi hidden
				//this.$refs.grdTags.setColumnsHidden(["DESTINATION", "PACKING_DATE"],true);
			//Hien hidden
				//this.$refs.grdTags.setColumnsHidden(["DESIGN_DATE", "SHIPPING_SAMPLE"],true);  
			//Son hidden
				this.$refs.grdTags.setColumnsHidden(["START_DATE_PRINT"],true);
			//Lai hidden
				//this.$refs.grdTags.setColumnsHidden(["KIEM_HANG_DAU"],true);
		}
		if(user_id !="lai-fnf") //Truc(dao-fnf),Nhi,hien,sơn,lai
		{
			//Truc hidden
				//this.$refs.grdTags.setColumnsHidden(["NOTE","DELIVERY_DATE","DESIGN_UNCONFIMRED_QTY","DESIGN_CONFIRM_QTY","PRINTED_QTY","PRINT_REMAIN_QTY","LABEL_FINISHED_QTY","LABEL_REMAIN_QTY","ENCODING_FINISHED_QTY","ENCODING_REMAIN_QTY","CUTTING_FINISHED_QTY","CUTTING_REMAIN_QTY"],true);
			//Nhi hidden
				//this.$refs.grdTags.setColumnsHidden(["DESTINATION", "PACKING_DATE"],true);
			//Hien hidden
				//this.$refs.grdTags.setColumnsHidden(["DESIGN_DATE", "SHIPPING_SAMPLE"],true);  
			//Son hidden
				//this.$refs.grdTags.setColumnsHidden(["START_DATE_PRINT"],true);
			//Lai hidden
				this.$refs.grdTags.setColumnsHidden(["KIEM_HANG_DAU"],true);
		}
		
		
		/*if()
		{
			this.$refs.grdTags.setColumnsHidden(["CUSTOMER_NAME", "WEAR_ACC"],true);
		}*/
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

    async onSearch() {
		//this.OnHideCols();
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
	  let arrDataSource = this.$refs.grdTags.getDataSource();
	  /*for (let i = 0; i < arrDataSource.length; i++) {
		if (!this._hasValue(arrDataSource[i].PRODUCT_DATE)) {  
		alert("pls_input_PRODUCT_DATE_for_all_detail");
		  return;
		}
		if (!this._hasValue(arrDataSource[i].CUSTOMER_NAME)) {
			alert("pls_input_CUSTOMER_NAME_for_all_detail");
		  return;
		}
	  }*/
      this.$refs.grdTags.saveData();
      //}
    },
    ///Begin Hàm validate input///
    checkData() {
      return true;
    },
    ///End Hàm validate input///
    onDelete() {
		 //this.$refs.confirmDialog.showConfirm(this.$t("do_you_want_to_get_data_for_spec"));
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
