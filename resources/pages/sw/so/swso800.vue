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
				<BaseDatePicker start v-model="dt_scan" :label="$t('import_date')" default ></BaseDatePicker>
                </v-col>
				<v-col cols="1">
                  <BaseInput
                    v-model="txt_search_rfid_cd"
                    :label="$t('search_rfid_cd')"
                    @keyPressEnter="onSearch()"
                  />
                </v-col>
                <v-col cols="3">
				 <GwImportExcelFile 
                                :label="$t('import_po')" 
                                :impTempFile="'report/sw/10/rpt_sw430_imp_rfid.xlsx'" 
                                :impProc="'SW_PRO_SWSO800_ORDER_NOCACHE'" 
                                :impStartRow="4" 
                                :impEndCol="8"
                                :impAddParam="[this.dt_scan.replace('-', ''),'', '']"
								@onAfterImport="onAfterImport"
                                >
                                
                            </GwImportExcelFile>
				
                  <!--BaseInput
                    v-model="txt_input_rfid_scan"
                    :label="$t('scan_rfid_cd')"
                    @keyPressEnter="onSaveScanRFID1()"
                  /-->
                </v-col>
				<v-col cols="2">
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
                    <!--BaseButton
                      btn_type="icon"
                      icon_type="save"
                      :btn_text="$t('save')"
                      :disabled="false"
                      @onclick="onSave()"
                    /-->
                    <!--BaseButton
                      btn_type="icon"
                      icon_type="delete"
                      :btn_text="$t('delete')"
                      :disabled="false"
                      @onclick="onDelete()"
                    /-->
					
					<GwFlexBox colspan="4" align-self="center" justify="end">
					  <BaseButton :btn_text="$t('download_excel')" :disabled="isProcessing" :loading="isProcessing" @onclick="downloadExcel" />
					  
					  <!--BaseButton :btn_text="$t('packing_list')" :disabled="isProcessing" :loading="isProcessing" @onclick="onPacking_list" / @cellClickData="onCellClickDataGrid1"-->
					</GwFlexBox>
                  </div>
                </v-col>
				<v-col cols="5">
					<div class="d-flex align-center justify-end">
						<BaseSelect  outlined :label="$t('printer')" item-value="CODE" item-text="CODE_NM" :lstData="printerList" v-model="selectedPrinter" />
						<GwFlexBox colspan="4" align-self="center" justify="end">
							<BaseButton :btn_text="$t('set_printer')" :disabled="isProcessing" :loading="isProcessing" @onclick="OnSetPrinter" />
						</GwFlexBox>
						<GwFlexBox colspan="4" align-self="center" justify="end">
							<BaseButton :btn_text="$t('Process-STT')" :disabled="isProcessing" :loading="isProcessing" @onclick="setProcessSTT" />
						</GwFlexBox>			
						 <v-tooltip bottom>
							<template v-slot:activator="{ on }">
							  <v-btn icon tile color="error" v-on="on" :disabled="isProcessing" @click="OnDeleteMaster">
								<v-icon>mdi-trash-can</v-icon>
							  </v-btn>
							</template>
							<span>{{ $t('Delete') }}</span>
						 </v-tooltip>
						 <GwFlexBox colspan="4" align-self="center" justify="end">
							<BaseButton icon_type="excel" :btn_text="$t('working_sheet')" :disabled="isProcessing" @onclick="OnReport"/>
						</GwFlexBox>	
					</div>	
                 </v-col>
				
				
				
              </v-row>
            </v-container>
          </v-row>
        </v-card>
        <v-card>
		
	<!--:header="headersColor" sel_procedure="SW_SEL_SW20030_4_NOCACHE" :filter_paras="[P_BRANDGROUP, P_ORDERDATE, P_ORDERNO]" :filterRow="true" select_mode="Multiple" 
	:auto_load="false" :max_height="gridHeight2 - 35 - 16" @cellClickData="onCellClickDataGrid2" /-->
	
          <v-row align="center" no-gutters>
            <DataGridView
              ref="grdTags"
              :header="grdHeader"
              sel_procedure="SW_SEL_SWSO800_NOCACHE"
              :multiselect="true"
              :headertype="1"
              :filter_paras="[this.dt_scan, this.txt_search_rfid_cd]"
			  :filterRow="true" select_mode="Multiple"
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
				'PRINTER_NAME',
                'REMARKS',
				'TSW_S_FLTCOLOR_PK',
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
	selectedPrinter:"",
	txt_search_rfid_cd: "",
    selectedColor: "",
	reportParams: [],
	printerList: [],
	ifNoPKArray: [],
	ifNoPKArray_2: [],
	P_BRANDGROUP: "",
    P_ORDERDATE: "",
	report_name:"",
    P_ORDERNO: "",
	P_GUBUN: "",
    selectedCellIndex: "",
  }),
  /*############### created #######################*/
  async created() {
	[this.printerList] = await this._getCommonCode2(["SZ001"]);
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
	  
		{ dataField: "PK", caption: this.$t("pk"), allowEditing: false, width: 80 },
        { dataField: "BRANDGROUP", caption: this.$t("BRANDGROUP"), allowEditing: false, width: 100 }, 
        { dataField: "ORDERDATE", caption: this.$t("ORDERDATE"), allowEditing: false, width: 100 },
        { dataField: "ORDERNO", caption: this.$t("ORDERNO"), allowEditing: false, width: 100 },
        { dataField: "STYLE_NO", caption: this.$t("STYLE_NO"), allowEditing: false, width: 100 },
        { dataField: "COLOR", caption: this.$t("COLOR"), allowEditing: false, width: 100 },
        { dataField: "SIZES", caption: this.$t("SIZES"), allowEditing: false, bgColor: this.bgColor1, width: 100 },
        { dataField: "SERIAL_NO", caption: this.$t("SERIAL_NO"), allowEditing: false, width: 100 },
        { dataField: "EPC", caption: this.$t("EPC"), allowEditing: false, width: 100 },
        { dataField: "TID", caption: this.$t("TID"), allowEditing: false, width: 100 },
		{ dataField: "PRINTER_NAME", caption: this.$t("printer_name"), lookup: { dataSource: this.printerList, displayExpr: "CODE_NM", valueExpr: "CODE" }, allowEditing: false },
        { dataField: "REMARKS", caption: this.$t("remarks"), allowEditing: false, width: 100 },
		{ dataField: "TSW_S_FLTCOLOR_PK", caption: this.$t("tsw_s_fltcolor_pk"), allowEditing: false, width: 100 },
		{ dataField: "GUBUN", caption: this.$t("GUBUN"), allowEditing: false, width: 100 },
		{ dataField: "CUSTOMER_NAME", caption: this.$t("customer_name"), allowEditing: false, width: 100 },
		
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
	//=============================
	async setPrinter() {
      try {
        let ds = this.$refs.grdTags.getSelectRowsData();
        await this.$nextTick();
        if (!ds.length) {
          this.showNotification("danger", this.$t("please_select_data"), "");
          return;
        }
        this.ifNoPKArray = ds.map((item) => item.PK).join(",");
		this.ifNoPKArray_2 = ds.map((item) => item.TSW_S_FLTCOLOR_PK).join(",");
        // console.log("ifNoPKArray:", this.ifNoPKArray)
        const dso = {
          type: "process",
          updpro: "SW_PRO_SWSO800_SET_PRINTER",
          para: ["u", this.P_BRANDGROUP, this.P_ORDERDATE, this.P_ORDERNO, this.selectedPrinter, this.ifNoPKArray, this.ifNoPKArray_2],
        };
        const result = await this._dsoCall(dso, "process", false);
        // console.log("confirm:", result);
        this.$refs.grdTags.loadData();
        //this.$refs.gridTID.loadData();
        if (result) {
          this.showNotification("success", this.$t("process_success"), "", 500);
        }
      } catch (error) {
        console.log("confirm-setPrinter exception:", error.message);
      }
    },
	//=============================
	async setProcessSTT() {
      try {
        /*let ds = this.$refs.grdTags.getSelectRowsData();
        await this.$nextTick();
        if (!ds.length) {
          this.showNotification("danger", this.$t("please_select_data"), "");
          return;
        }*/
        //this.ifNoPKArray = ds.map((item) => item.PK).join(",");
		//this.ifNoPKArray_2 = ds.map((item) => item.TSW_S_FLTCOLOR_PK).join(",");
        // console.log("ifNoPKArray:", this.ifNoPKArray)
        const dso = {
          type: "process",
          updpro: "SW_PRO_SWSO800_STT_NOCACHE",
          para: ["u", this.dt_scan.replace('-', '')],
        };
        const result = await this._dsoCall(dso, "process", false);
        // console.log("confirm:", result);
        this.$refs.grdTags.loadData();
        //this.$refs.gridTID.loadData();
        if (result) {
          this.showNotification("success", this.$t("process_success"), "", 500);
        }
      } catch (error) {
        console.log("confirm-setPrinter exception:", error.message);
      }
    },
	//==============================
		async OnSetPrinter() {
			  let tab = 4;
				   alert("Are you sure set printer ?"+this.selectedPrinter);
				   const dso = {
					type: "process",
					updpro: "SW_PRO_SWSO800_SETPRINTER",
					para: [this.dt_scan.replace('-', ''),this.selectedPrinter]
			  
					}; // 
					const result = await this._dsoCall(dso, "process", false);
					 setTimeout(() => { 
						 this.$refs.grdTags.loadData(); 
					 }, 1000);
		
		},
	//==============================
		async OnDeleteMaster() {
			  let tab = 4;
				   alert("Are you sure delete all data for date?"+this.dt_scan.replace);
				   const dso = {
					type: "process",
					updpro: "SW_UPD_SWSO800_DELETE",
					para: [this.dt_scan.replace('-', ''),this.selectedPrinter]
			  
					}; // 
					const result = await this._dsoCall(dso, "process", false);
					 setTimeout(() => { 
						 this.$refs.grdTags.loadData(); 
					 }, 1000);
		
		},	
	//=============================
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
	onCellClickDataGrid1({BRANDGROUP, ORDERDATE, ORDERNO,GUBUN}) {
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
	  this.P_GUBUN= GUBUN;
	
      this.reportParams = [this.P_BRANDGROUP, this.P_ORDERDATE, this.P_ORDERNO,this.dt_scan.replace('-', '')];
	  //alert(this.P_BRANDGROUP);

      this.report_name = BRANDGROUP + "_" + ORDERDATE + "_" + ORDERNO + "_imp_Y_GUBUN_"+ GUBUN + ".xlsx";
      
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
            proc = "SW_RPT_SWSO800_RFID_Y";
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
	//=======BEGIN===PRINT------REPORT======WORKING=========SHEET==========
	async OnReport() { 
        let p_param = [
							'',
							'',		
							this.dt_scan.replace('-', ''),
							'',
							'',
							'',
							'',
							''
        ];
        let report_no = "01";
        let report_path = "";
        let report_name = "";   
        let report_name_ext = "xlsx";        
        let excel = [];

       
	let report_main = "rpt_swso410_korean_carelabel_rfid_03";
	let report = "rpt_swso800_korean_carelabel_rfid_y_ws_qc";
			/*if(this.tab01.lstLabelType==="01")
			{
				report = "rpt_swso410_caution_label_01";
			}
			if(this.tab01.lstLabelType==="02")
			{
				report = "rpt_swso410_ec_carelabel_02";
			}
			if(this.tab01.lstLabelType==="03")
			{
				report = "rpt_swso410_korean_carelabel_rfid_03";
			}
			if(this.tab01.lstLabelType==="04")
			{
				report = "rpt_swso410_korean_carelabel_normal_04";
			}
			if(this.tab01.lstLabelType==="05")
			{
				report = "rpt_swso410_price_tag_china_rfid_05";
			}
			if(this.tab01.lstLabelType==="06")
			{
				report = "rpt_swso410_price_tag_china_normal_06";
			}
			if(this.tab01.lstLabelType==="07")
			{
				report = "rpt_swso410_price_tag_global_rfid_07";
			}
			if(this.tab01.lstLabelType==="08")
			{
				report = "rpt_swso410_price_tag_global_normal_08";
			}
			if(this.tab01.lstLabelType==="09")//same 02
			{
				report = "rpt_swso410_ec_carelabel_09";
			}
			if(this.tab01.lstLabelType==="10")//same 03
			{
				report = "rpt_swso410_korean_carelabel_rfid_10";
			}
			if(this.tab01.lstLabelType==="11")//same 04
			{
				report = "rpt_swso410_korean_carelabel_normal_11";
			}
			if(this.tab01.lstLabelType==="12")//same 04
			{
				report = "rpt_swso410_korean_carelabel_ticker_12";
			}*/
			//rpt_swso410_EC_Carelabel_02
      try{
	  //alert(p_param);
        this._ExcelSaveAs(await this.$axios.$get('/dso/makereport', {responseType: "blob", params: {
          template: "report/sw/10/" + report_main + ".xlsx",
          excel: JSON.stringify([{
            insertRange: [{
              range: "A1:AJ1", proc: "SW_RPT_SWSO800_WORKING_SHEET_QC", params: [...p_param]//SW_SEL_SW10110_export_custom
            }],
            insertRows: [{
				startRow: 3, proc: "SW_RPT_SWSO800_WORKING_SHEET_QC", params: [...p_param], stringColumns: [ "CUSTOMER","LOCATION"], subStyle: { font : {   bold: true   } , fill: {
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
	 //======END====PRINT------REPORT======WORKING=========SHEET==========
    ///Begin Hàm validate input///
    checkData() {
      return true;
    },
	onAfterImport(obj) {
			this.onSearch()
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
