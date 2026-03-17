<template>
	<v-dialog id="hr-103130-1" max-width="80%" v-model="dialogIsShow">
		<v-card height="80%">
			<v-card-title class="headline primary-gradient white--text py-2 px-2">
				{{ $t(title) }}
				<v-spacer></v-spacer>
				<v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
			</v-card-title>
			<v-card-text>
				<v-row no-gutters justify="center" align="center" v-if="searchBy == 'date'" v-show="proSearchImport || delSearchImport">
					<v-col cols="12" lg="3" class="px-1 py-1">
						<BaseDatePicker default v-model="importFromDate" outlined :label="$t('from_date')" class="px-0" :clearable="false" >   </BaseDatePicker>
					</v-col>
					<v-col cols="12" lg="3" class="px-1 py-1">
						<BaseDatePicker default v-model="importToDate" outlined :label="$t('to_date')" class="px-0" :clearable="false" >   </BaseDatePicker>
					</v-col>
					<v-col cols="12" lg="3" class="px-1 py-1">
						<BaseInput outlined :label="$t('name_id')" v-model="importNameID" ></BaseInput>
					</v-col>
					<v-col cols="12" lg="3">
						<v-row no-gutters>
							<v-spacer></v-spacer>
							<BaseButton btn_type="default" icon_type="search" :btn_text="$t('search')"   @onclick="onSearchImport" v-bind:disabled.sync="isProcessing" v-if="proSearchImport"/>
							<BaseButton btn_type="default" icon_type="delete" :btn_text="$t('delete')"   @onclick="onProcessConfirm('DELETE', onDeleteImport) " v-bind:disabled.sync="isProcessing" v-if="delSearchImport"/>
						</v-row>
					</v-col>
				</v-row>

				<v-row no-gutters  align="center" v-if="searchBy == 'month'" v-show="proSearchImport || delSearchImport">
					<v-col cols="12" lg="3" class="px-1 py-1" v-if="salPeriod && salPeriod.length > 0" >
						<BaseSelect :outlined="true" item-value="CODE" item-text="NAME" :label="$t('period')" :lstData="salPeriod" v-model="importSalPeriod" :disabled="isProcessing"> </BaseSelect>
					</v-col>
					<v-col cols="12" lg="3" class="px-1 py-1">
						<BaseDatePicker default month v-model="importMonth" outlined :label="$t('month')" class="px-0" :clearable="false" >   </BaseDatePicker>
					</v-col>
					<v-col cols="12" :lg="salPeriod && salPeriod.length > 0 ? 3 : 6" class="px-1 py-1">
						<BaseInput outlined :label="$t('name_id')" v-model="importNameID" ></BaseInput>
					</v-col>
					<v-col cols="12" lg="3">
						<v-row no-gutters>
							<v-spacer></v-spacer>
							<BaseButton btn_type="default" icon_type="search" :btn_text="$t('search')"   @onclick="onSearchImport" v-bind:disabled.sync="isProcessing" v-if="proSearchImport"/>
							<BaseButton btn_type="default" icon_type="delete" :btn_text="$t('delete')"   @onclick="onProcessConfirm('DELETE', onDeleteImport) " v-bind:disabled.sync="isProcessing" v-if="delSearchImport"/>
						</v-row>
					</v-col>
				</v-row>
				
				<v-row no-gutters align="center" justify="end">
					<v-col cols="12" lg="6" class="px-1 py-1">
						<GwFlexBox :noWrap="true" justify="start">
							<span class="text-h6 red--text font-weight-bold mx-4" > {{  `${ $t("invalid") }: ${invalidData}` }} </span>
							<span class="text-h6 green--text font-weight-bold mx-4" > {{  `${ $t("valid") }: ${validData}` }} </span>
							<v-spacer></v-spacer>
							<v-progress-circular  color="red" indeterminate rounded height="5" v-if="isProcessing"></v-progress-circular>
							<v-spacer></v-spacer>
							<!-- <span class="text-h6 red--text font-weight-bold mx-4" > {{  timeProcess }} </span> -->
						</GwFlexBox>
					</v-col>
					<v-col cols="12" lg="6" class="px-1 py-1">
						<v-row no-gutters>
							<BaseInput :outlined="true"    dense hide-details  :label="$t('sheet_name')" v-model="sheetName" v-show="false"></BaseInput>
							<BaseButton btn_type="default" color="#97f79f" icon_type="attachment"  :btn_text="$t('choose_file')" @onclick="onSelectFile" v-bind:disabled.sync="isProcessing"/>
							<v-spacer></v-spacer>
							<BaseButton btn_type="default" icon_type="excel"  :btn_text="$t('download_template')" @onclick="onGetTemplate" v-bind:disabled.sync="isProcessing"/>
							<BaseButton btn_type="default"  icon_type="save" :btn_text="$t('save')"          @onclick="onProcessConfirm('SAVE_SELECTED_ROW', onSave)" v-bind:disabled.sync="isProcessing" color="#b3c2ff"/>
							<BaseButton btn_type="default"  icon_type="clear" :btn_text="$t('clear')"          @onclick="onProcessConfirm('CLEAR', onLoad)" v-bind:disabled.sync="isProcessing" color="#ffb3b3"/>
							<BaseButton btn_type="default"  icon_type="cancel" :btn_text="$t('cancel')"   :icon_color="'black'"       @onclick="onProcessConfirm('CANCEL', onCancel)" v-bind:disabled.sync="isProcessing" color="#fa4646"/>
						</v-row>
						
					</v-col>
				</v-row>
				<BaseGridView ref="idGrid" :label-right="$t('the_maximum_number_of_rows_that_can_be_imported_is_20000_rows')"
							:editable="true" :headertype="1"
							:height="600"
							:header="gridHeader"
				></BaseGridView>
			</v-card-text>
		</v-card>
		<input type="file" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" v-show="false" ref="file" @change="onProcessFile" /> 
	</v-dialog>
</template>
<script>

import moment from 'moment';
import lodash from "lodash";
export default {
	name: 'hr-1031300-1',

	props: {
		selectedCompany: { type: Number, default: null },
		template: { type: String, default: null },
		prepareCommonData: { type: Function, default: null },
		reloadHeader: { type: Function, default: null },
		modifyTemplate: { type: Function, default: null },
		title: { type: String, default: 'import_dialog' }
	},

	components: {},

	data: () => ({
		dialogIsShow: false,
		invalidData:0,
		validData:0,
		sheetName:'Sheet1',

		gridHeader: [],
		dataFromExcel: [],
		sequence:null,

		importFromDate:null,
		importToDate: null,
		importMonth: null,
		importNameID:null,
		importSalPeriod: null,

		maxRow: 20_000,
		maxRowPerRequest:500,
		interval: null,
		timeProcess: null,
	}),

	watch: {
		dialogIsShow(val) {
			if (val === false) {
				this.$emit('callback', this.sequence);
			} else {
				this.onLoad();
			}
		},

		importSalPeriod(val) {
			this.changePeriod();
		},

		importMonth(val) {
			this.changeMonth();
		},

	},

	computed: {
		user: function () {
			return this.$store.getters["auth/user"];
		},
		limitHeight() {
			return 450;
		},

		salPeriod(){
			return this.$attrs["salary-period"];
		},

		//pro dùng để validate từng dòng xem có lỗi gì ko
		// trong pro nhớ return cursor có chứa index để validate hoặc chèn thêm pk nếu cần cho data trên excel
		proValidate(){
			return this.$attrs["validate-pro"]; //open cursor for select P_INDEX as "INDEX",... from dual
		},

		//para field truyền vào validate
		// trong para nhớ chứa index để validate hoặc chèn thêm pk nếu cần cho data trên excel
		paraValidate(){
			return this.$attrs["validate-para"]; //['INDEX', 'EMP_ID',....]
		},

		//para field để check duplicate data
		paraDuplicate(){
			return this.$attrs["duplicate-para"]; //['INDEX', 'EMP_ID',....]
		},

		searchBy(){
			return this.$attrs["search-by"] ? this.$attrs["search-by"] : 'date' ;
		},

		//search pro para theo popup import [from,to,emp id]
		proSearchImport(){
			return this.$attrs["search-pro"];
		},

		//delete pro delete theo pk
		delSearchImport(){
			return this.$attrs["delete-pro"];
		},

		//pro dùng để import valid data sau khi validate vào db
		proInsertValidData(){
			return this.$attrs["import-pro"];
		},
		
		//para field truyền vào import
		paraInsertData(){
			return this.$attrs["import-para"];
		},

		//vị trí dòng khai báo các field trên grid (dùng để đổ data đúng vị trí, có thể excel cột vị trí khác so với header grid)
		fieldRow(){
			return this.$attrs["field-row"];
		},

		//vị trí bắt đầu đọc data trên excel
		startRow(){
			return this.$attrs["start-row"];
		},

		//add thêm sequence tại thời điểm import khi close popup sẽ trả về sequence đó cho form xử lý @callback
		sequenceYN(){
			return this.$attrs["sequence-yn"];
		},
	},

	beforeDestroy() {
		this.onClearInterval();
	},


	methods: {

		onSetInterval() {
			/*this.timeProcess = 0;;
			this.interval = setInterval(() => {
				++this.timeProcess;
			}, 1000);*/
		},

		onClearInterval() {
			//clearInterval(this.interval);
		},


		async onLoad() {
			try {
				await this.$nextTick();

				this.$refs.idGrid.Clear();
				this.invalidData = 0;
				this.validData = 0;

				let { header } = await this.prepareCommonData(); //trên form nhớ gọi return trả về header


				let _header = [
					/*{ title: ("check"), field: "CHECK_YN", editable: true, type: "checkbox",  width:50, fixed: true, cellClassName: this.cellClassName }
					,*/ { title: ("no") , field: "INDEX", type: "" , editable: false, cellClassName: this.cellClassName , fixed: true, cellClassName: this.cellClassName}
					, ...header
					, { title: ("crt_by"),  field: "CRT_BY",  type: ""}
					, { title: ("crt_dt"),  field: "CRT_DT",  type: ""}
					, { title: ("valid"), field: "VALID", type: "" , editable: false, cellClassName: this.cellClassName}
					, { title: ("errcode") , field: "ERRCODE", type: "" , editable: false, cellClassName: this.cellClassName }
					, { title: ("result") , field: "RESULT", type: "" , editable: false, cellClassName: this.cellClassName }

					, { title: ("_"), field: "PK", visible: false, type: "" , editable: false },
				]


				this.gridHeader = [..._header];

				this.loadHeader();

			} catch (e) {

			}
		},

		cellClassName(row, columnfield, value, rowdata) {
			if (!(rowdata.ERRCODE == null || rowdata.ERRCODE == "")) {
				return "cellImportError";
			}
			return this.cellClassStatus(rowdata);
		},

		onSearch() {

		},

		async onSelectFile() {
			this.dataFromExcel = [];
			this.$refs.file.value = null;
			this.invalidData = 0;
			this.validData = 0;
			this.$refs.file.click();
		},

		async onProcessFile(event) {
			const files = event.target.files;
			if (files[0] !== undefined) {
				const fr = new FileReader();
				fr.readAsDataURL(files[0]);
				fr.addEventListener('load', () => {
					this.onReadExcel(fr.result);
				});
			}
		},

		async onReadExcel(base64) {
			let control = this.$refs.idGrid.getControl();
			this.$emit("importing");

			try {
				this.onSetInterval();
				this.isProcessing = true;
				control.showloadelement();


				let exceljs =  require("@/plugins/exceljs.js");
				if(!!exceljs) {
						exceljs = exceljs.default;
				}

				await exceljs.readFile(this, base64, "BASE64");
				exceljs.setWorksheet('Sheet1');
				let worksheet = exceljs.worksheet();

				if(worksheet == undefined) {
					exceljs.setWorksheet('Import');
					worksheet = exceljs.worksheet();
				}
				let sheetModel = worksheet.model;

				if(sheetModel.rows.length > this.maxRow) {
					this.showNotification("warning", this.$t("data_larger_than_20000_rows_cannot_import"));
					return;
				}

				let dataIdx = 1;

				let headerFields = worksheet.getRow(this.fieldRow).values;

				//start read data
				for(let idx = this.startRow; idx <= sheetModel.rows.length; idx++ ) {
					let data = { INDEX: dataIdx++, ERRCODE:"", VALID: 'Y', CHECK_YN: 'Y' };
					for(let colIdx = 1; colIdx < headerFields.length; colIdx++) {
						let value = null;
						try {
							let cell = exceljs.getCellByIndex(this, idx, colIdx);
							value = cell.value;
						} catch {}

						let col = this.gridHeader.find(q => q.field == headerFields[colIdx]);
						if(col) {
							if(col.type == "date") {
								if(value != null) {
									if( (value +"").length == 10) { //dd/mm/yyyy
										let y = (value +"").substring(6, 10);
										let m = (value +"").substring(3, 5);
										let d = (value +"").substring(0, 2);
										value = ""+y+m+d;
									} if( (value +"").length == 8) { // yyyymmdd
										value = (value +"");
									}
								}
							}

							if(col.type == "month") {
								if(value != null) {
									if( (value +"").length == 7) { //mm/yyyy
										let y = (value +"").substring(3, 7);
										let m = (value +"").substring(0, 2);
										value = ""+y+m;
									} if( (value +"").length == 6) { // yyyymm
										value = (value +"");
									}
								}
							}
						}
						
						data[headerFields[colIdx] ] = value;
					}
					this.dataFromExcel.push(data);
				}

				this.excelToGrid();

			} catch (e){
				console.log(e.message);
				this.showNotification("danger", this.$t("sheet_not_found"));
			} finally {
				this.onClearInterval();
				this.isProcessing = false;
				control.hideloadelement();
				this.$emit("imported");
			}
		},

		async excelToGrid() {
			let datas = await this.validateData();
			this.validData = datas.filter(q => q.VALID == 'Y').length;
			this.invalidData = datas.filter(q => q.VALID == 'N').length;

			if(datas.length > 0) {
				this.$refs.idGrid.setDataSource(datas);
			}
		},

		modifyBulkData (res) {
			if(res.success) {
				let _res = res.data.map(q => { return q[0]; });
				return _res;
			} else {
				this.showNotification("danger", res.message);
					return null;
			}
		},

		//chạy pro validate để check và trả về thông tin cần thiết cho import
		async validateData(){
			this.showNotification("success", this.$t("validating_data"));

			let datas = [...this.dataFromExcel];
			let insertedDatas = new Set();
			
			//check value duplicate
			if(this.paraDuplicate && this.paraDuplicate.length > 0) {
				for(let idx = 0; idx < datas.length; idx++) {
					let data = {};
					this.paraDuplicate.forEach(col => { data[col] = datas[idx][col]; });

					if( insertedDatas.has( JSON.stringify(data)  ) ) {
						datas[idx].ERRCODE = (datas[idx].ERRCODE ? (datas[idx].ERRCODE + "; ") : datas[idx].ERRCODE) +  "Duplicate";
						datas[idx].VALID = 'N';
						datas[idx].CHECK_YN = "N";
					} else {
						insertedDatas.add( JSON.stringify(data) );
					}
				}
			}
			

			//check xem co validate gi ko
			if(this.proValidate && this.paraValidate) {
				let paras = [];
				for(let idx = 0; idx < datas.length; idx++) {
					let data = datas[idx];
					let para =  [];

					this.paraValidate.forEach(col => { para.push(data[col]); });

					paras.push(para);
				}

				paras = lodash.chunk(paras, this.maxRowPerRequest);

				let _idx = 0;
				while(_idx < paras.length) {
					let para = paras[_idx];
					let resValidate = await this.$axios.$post("dso/bulkinsertpro", { proc: this.proValidate, para: para });
					resValidate = this.modifyBulkData(resValidate);

					if(resValidate && resValidate.length > 0) {
						for(let idx = 0; idx < datas.length; idx++) {
							let data = datas[idx];
							let validatedData = resValidate.find(q=> q.INDEX == data.INDEX);

							if(validatedData) {
								if(validatedData.hasOwnProperty("ERRCODE")) {
									data.ERRCODE = (data.ERRCODE ? (data.ERRCODE + "; ") : data.ERRCODE) +  validatedData.ERRCODE;
									data.VALID = 'N';
									data.CHECK_YN = "N";
								} else {
									Object.assign(data, validatedData);
									if( data.VALID != "N") { //check duplicate trc
										data.VALID = 'Y';
										data.CHECK_YN = "Y";
										data._rowstatus = 'i';
									}
								}
							}
						}
					}
					
					_idx++;
				}
			}

			return datas;
		},


		async onGetTemplate() {
			if(this.modifyTemplate) {
				await this.modifyTemplate({ FROM_DT: this.importFromDate, TO_DT: this.importToDate, MONTH: this.importMonth, PERIOD: this.importSalPeriod } );
				return;
			}

			const res = await this.$axios.$get('/dso/downloadtemp', {
				responseType: "blob",
				params: {
					template: this.template
				}
			});
			if (!!res && res.size > 0) {
				try {
					let blob = new Blob([res], {
						type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
					});
					let url = window.URL.createObjectURL(blob);

					var tag_a = document.createElement("a");
					document.body.appendChild(tag_a);
					tag_a.style = "display: none";
					tag_a.target = "_blank";
					tag_a.href = url;
					tag_a.download = this.template.split("/").pop();
					tag_a.click();
					window.URL.revokeObjectURL(url);
					tag_a.remove();
				} catch (e) {
					this.showNotification("danger", this.$t("cannot_find_template"), "", 3001);
				}
			} else {
				this.showNotification("danger", this.$t("cannot_find_template"), "", 3001);
			}
		},

		async onSave() {
			this.$emit("importing");
			let control = this.$refs.idGrid.getControl();
			try {
				this.onSetInterval();
				this.isProcessing = true;
				control.showloadelement();
					
				this.sequence = new Date().getTime();
				let datas = this.$refs.idGrid.getDataDb();
				let selectedDatas = datas?.filter(q => (q.CHECK_YN == true || q.CHECK_YN == 'Y') && q.VALID == 'Y' );
				if(selectedDatas?.length > 0) {
					let paras = [];
					selectedDatas.forEach( q => {
						let para = [];
						this.paraInsertData.forEach(p => {
							let val = q[p] ? q[p] : '' ;
							para.push(val);
						});

						if(this.sequenceYN == 'Y') {
							para.push(this.sequence);
						}

						paras.push(para);
					});

					paras = lodash.chunk(paras, this.maxRowPerRequest);
					let _idx = 0;
					while(_idx < paras.length) {
						let para = paras[_idx];

						let results = await this.$axios.$post("dso/bulkinsertpro", { proc: this.proInsertValidData, para: para });
						results = this.modifyBulkData(results);
						if(results) {

							for(let i = 0; i< datas.length; i++) {
								let data = datas[i];
								let res = results.find(q => q.INDEX == data.INDEX);
								if(res) {
									Object.assign(data, res);
								}
							}
						}

						_idx++;
					}

					this.$refs.idGrid.setDataSource(datas);
					

					let exportResult = () => {
						this.$refs.idGrid.myGridOnExport();
					};
					await this.onProcessConfirm('EXPORT_RESULT', exportResult);
					
				} else {
					this.showNotification("warning", this.$t("no_row_valid"));
				}
			} catch{

			} finally{
				this.onClearInterval();
				this.isProcessing = false;
				control.hideloadelement();
				this.$emit("imported");
			}
		},

		async onCancel() {
			this.dialogIsShow = false;
		},

		callBackData() {

		},

		async onSearchImport(){
			this.invalidData = 0;
			this.validData = 0;

			let dso = {
				type: 'grid',
				selpro: this.proSearchImport,
				para: [this.importFromDate, this.importToDate, this.importMonth, this.importSalPeriod, this.importNameID]
			};

			this.$refs.idGrid.onSearch(dso);
		},

		async onDeleteImport(){
			let dso = {
				type: 'grid',
				selpro: this.proSearchImport,
				updpro: this.delSearchImport,
				para: [this.importFromDate, this.importToDate, this.importMonth, this.importSalPeriod, this.importNameID],
				elname:[ 'PK' ],
			};


			let control = this.$refs.idGrid.getControl();
			this.$emit("importing");
			try {
				await this.$refs.idGrid.onDelete(dso);
			} catch (e){
			} finally {
				this.isProcessing = false;
				control.hideloadelement();
				this.$emit("imported");
			}
		},

		changePeriod(){
			this.loadHeader();
		},

		changeMonth(){
			this.loadHeader();
		},

		async loadHeader(){
			if(this.reloadHeader) {
				let { header } = await this.reloadHeader( { FROM_DT: this.importFromDate, TO_DT: this.importToDate, MONTH: this.importMonth, PERIOD: this.importSalPeriod } );

				let _header = [
					/*{ title: ("check"), field: "CHECK_YN", editable: true, type: "checkbox",  width:50, fixed: true, cellClassName: this.cellClassName }
					,*/ { title: ("no") , field: "INDEX", type: "" , editable: false, cellClassName: this.cellClassName , fixed: true, cellClassName: this.cellClassName}
					, ...header
					, { title: ("crt_by"),  field: "CRT_BY",  type: ""}
					, { title: ("crt_dt"),  field: "CRT_DT",  type: ""}
					, { title: ("valid"), field: "VALID", type: "" , editable: false, cellClassName: this.cellClassName}
					, { title: ("errcode") , field: "ERRCODE", type: "" , editable: false, cellClassName: this.cellClassName }
					, { title: ("result") , field: "RESULT", type: "" , editable: false, cellClassName: this.cellClassName }

					, { title: ("_"), field: "PK", visible: false, type: "" , editable: false }
				]


				this.gridHeader = [..._header];
			}
		},
	}
} 
</script>
<style>
.cellImportError {
	background-color: #ff0f0f;
}
</style>