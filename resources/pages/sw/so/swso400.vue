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
				<BaseDatePicker start v-model="dt_scan" :label="$t('date_scan')" default ></BaseDatePicker>
                </v-col>
				<v-col cols="3">
                  <BaseInput
                    v-model="txt_search_rfid_cd"
                    :label="$t('search_rfid_cd')"
                    @keyPressEnter="onSearch()"
                  />
                </v-col>
                <v-col cols="3">
				 <v-text-field
                  style="padding-top:0"
                     autofocus
                  ref="barcode"
                  :outlined="false"
                  :label="$t('scan_rfid_cd')"
                  v-model="txt_input_rfid_scan"
                  @keypress.enter="onSaveScanRFID1"
                /> 
				
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
                    <BaseButton
                      btn_type="icon"
                      icon_type="delete"
                      :btn_text="$t('delete')"
                      :disabled="false"
                      @onclick="onDelete()"
                    />
					
					<GwFlexBox colspan="4" align-self="center" justify="end">
					  <BaseButton :btn_text="$t('download_excel')" :disabled="isProcessing" :loading="isProcessing" @onclick="downloadExcel" />
					  <!--BaseButton :btn_text="$t('packing_list')" :disabled="isProcessing" :loading="isProcessing" @onclick="onPacking_list" / @cellClickData="onCellClickDataGrid1"-->
					</GwFlexBox>
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
              sel_procedure="SW_SEL_SWSO400_NOCACHE"
              :multiselect="true"
              :headertype="1"
              :filter_paras="[this.dt_scan, this.txt_search_rfid_cd]"
              :height="gridHeight"
              upd_procedure="SW_UPD_SWSO400_NOCACHE"
              :editable="true"
              @cellClickData="onCellClickDataGrid1"
              :update_paras="[
                'PK',
				'BRANDGROUP',
				'ORDERDATE',
                'ORDERNO',
                'STYLE_NO',
                'COLOR',
				'SIZES',
                'SERIAL_NO',
                'EPC',
                'TID',
                'REMARKS',
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
    dt_scan: "",
    txt_input_rfid_scan: "", 
	txt_search_rfid_cd: "",
    selectedColor: "",
	reportParams: [],
	P_BRANDGROUP: "",
    P_ORDERDATE: "",
	report_name:"",
    P_ORDERNO: "",
    selectedCellIndex: "",
  }),
  /*############### created #######################*/
  created() {
    //this.initMstData();
    // this.initMstPara();
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
          field: "BRANDGROUP",
          width: 90,
          title: "BRANDGROUP",
          alignment: "center",
          allowEditing: true,
        },
		{
          field: "ORDERDATE",
          width: 90,
          title: "ORDERDATE",
          alignment: "center",
          allowEditing: true,
        },	
        {
          field: "ORDERNO",
          width: 90,
          title: "Order_No",
          alignment: "center",
          allowEditing: true,
        },
        {
          field: "STYLE_NO",
          width: 110,
          title: "Style_No",
          alignment: "left",
          allowEditing: true,
        },
        {
          field: "COLOR",
          width: 60,
          title: "color",
          alignment: "left",
        },
		{
          field: "SIZES",
          width: 50,
          title: "SIZES",
          alignment: "left",
        },
        {
          field: "SERIAL_NO",
          width: 90,
          title: "Serial_No",
          alignment: "left",
          allowEditing: true,
        },
        {
          field: "EPC",
          width: 275,
          title: "EPC",
          alignment: "left",
          allowEditing: true,
        },
        {
          field: "TID",
          width:210,
          title: "TID",
          alignment: "left",
          allowEditing: true,
        },
        {
          field: "REMARKS",
          width: 305,
          title: "Remarks",
          alignment: "left",
          allowEditing: true,
        },
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

    onSearch() {
      this.$refs.grdTags.loadData();
    },
	async onSaveScanRFID1()
	{
		//alert("aa");
		this.onSaveScanRFID();
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
	onCellClickDataGrid1({BRANDGROUP, ORDERDATE, ORDERNO}) {
      /*this.orderPK = PK;
      this.selectedIFNo = IF_NO;
      this.P_BRANDGROUP = BRANDGROUP;
      this.P_ORDERDATE = ORDERDATE;
      this.P_ORDERNO = ORDERNO;
      this.P_COLOR = COLOR;
      this.P_SIZES = SIZES;
      this.P_KIND = KIND;
      this.P_CAREQTY = CAREQTY;
      this.P_TSW_S_FLTORDER_PK = PK;*/
	  this.P_BRANDGROUP= BRANDGROUP;
	  this.P_ORDERDATE= ORDERDATE;
	  this.P_ORDERNO= ORDERNO;
	
      this.reportParams = [this.P_BRANDGROUP, this.P_ORDERDATE, this.P_ORDERNO];
	  //alert(this.P_BRANDGROUP);

      this.report_name = BRANDGROUP + "_" + ORDERDATE + "_" + ORDERNO + "_Y" + ".xlsx";
      
      //this.searchFromTab(this.selectedTab);
    },
	
	async downloadExcel() {
      try {
        this.isProcessing = true;
        var reportPath;
        var reportName = this.report_name;
        var proc;
        var proc2;
        var params;
        
            reportPath = "report/sw/20/rpt_sw20030_rfid_y_1.xlsx"; 
            proc = "SW_RPT_SWSO400_RFID_Y";
            //reportName = "RPT_SW20030_RFID_Y_1.xlsx";
            params = this.reportParams;
           
        

       

        let excel = [];
        var insertHeader = [];

      

        /* console.log(`reportPath: ${reportPath} - proc: ${proc} - params: ${params} - reportName: ${reportName}`); */
        // console.log(excel)
        let res;
        if (proc2 === "CARELABEL") {
          res = await this.$axios.$get("/dso/makereport", {
            responseType: "blob",
            params: {
              template: reportPath,
              excel: JSON.stringify(excel),
              debug: true,
            },
          });
        } else {
          res = await this.$axios.$get("dso/expbigexcel", {
            responseType: "blob",
            params: {
              proc: proc,
              para: params,
            },
          });
        }
        console.log("res:", res);
        if (res) {
          if (proc2 === "CARELABEL") {
            /* const message = `
            [KO] 이것은 취급주의 라벨 오더입니다. 'KIND' 을(를) 'CAREQTY' 개 생산하십시오.
            [EN] It's PO of Handle with care label, please produce 'CAREQTY' of 'KIND' label.
            [VN] Đây là đơn đặt hàng nhãn mác chú ý sử dụng. Hãy sản xuất cái mác 'CAREQTY' của 'Kind'.
            ` */
            //const message = this.$t("export_success_message", { careQty: this.P_CAREQTY, kind: this.P_KIND });
            // console.log("message:", message);
            this.$refs.alertDialog.showAlert("success", "success", "", message);
            // this.showNotification("success", this.$t("export_success_message"), "", 6000);
          }
          this._ExcelSaveAs(res, reportName);
          this.isProcessing = false;
        } else {
          this.isProcessing = false;
          this.showNotification("danger", this.$t("fail_to_export_report"), "", 4000);
        }
      } catch (error) {
        this.isProcessing = false;
        console.log("downloadExcel-catch exception:", error.message);
      } finally {
        this.isProcessing = false;
      }
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
