<template>
	<v-dialog id="hr-103130-1" max-width="80%" v-model="dialogIsShow">
		<v-card height="80%">
			<v-card-title class="headline primary-gradient white--text py-2 px-2">
				{{ $t('import_certificate') }}
				<v-spacer></v-spacer>
				<v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
			</v-card-title>
			<v-card-text>
				<v-row no-gutters align="center" justify="end">
					<v-col cols="12" lg="4" class="px-1 py-1">
						<v-row no-gutters justify="end">
							<v-spacer></v-spacer>
							<span class="text-h6 red--text font-weight-bold mx-4" > {{  `${ $t("invalid") }: ${invalidData}` }} </span>
							<span class="text-h6 green--text font-weight-bold mx-4" > {{  `${ $t("valid") }: ${validData}` }} </span>
						</v-row>
					</v-col>
					<v-col cols="12" lg="8" class="px-1 py-1">
						<v-row no-gutters>
							<BaseButton btn_type="default" icon_type="attachment"  :btn_text="$t('choose_file')" @onclick="onSelectFile" v-bind:disabled.sync="isProcessing"/>
							<BaseButton btn_type="default" icon_type="excel"  :btn_text="$t('download_template')" @onclick="onGetTemplate" v-bind:disabled.sync="isProcessing"/>
							<v-spacer></v-spacer>

							<BaseButton btn_type="default"  icon_type="save" :btn_text="$t('save')"          @onclick="onProcessConfirm('SAVE_SELECTED_ROW', onSave)" v-bind:disabled.sync="isProcessing"/>
							<BaseButton btn_type="default"  icon_type="clear" :btn_text="$t('clear')"          @onclick="onProcessConfirm('CLEAR', onLoad)" v-bind:disabled.sync="isProcessing"/>
							<BaseButton btn_type="default"  icon_type="cancel" :btn_text="$t('cancel')"          @onclick="onProcessConfirm('CANCEL', onCancel)" v-bind:disabled.sync="isProcessing"/>
						</v-row>
						
					</v-col>
				</v-row>
				<BaseGridView ref="idGrid"
							:editable="true" :headertype="1"
							:height="600"
							:header="header"
				></BaseGridView>
			</v-card-text>
		</v-card>
		<input type="file" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" v-show="false" ref="file" @change="onProcessFile" /> 
	</v-dialog>
</template>
<script>

import moment from 'moment';
	export default {
		name: 'hr-1031300-1',

		props: {
			selectedCompany: { type: Number, default: null },
    },

		components: {},

		data: () => ({
			dialogIsShow: false,
			templatePath: "report/10/31/standard/1031300_template_import_certificate.xlsx",
			proGetTemplate: "hr_pro_1031300_get_template",
			proValidateEmp: "hr_pro_1031300_validate_imp_v2",
			proInsertValidData: "hr_upd_1031300_imp_certificate",
			paraInsertData: [
				'_rowstatus', 'INDEX', 'PK', 'THR_EMP_PK', 'EMP_ID', 'JOIN_DT', 'LEFT_DT', 'FULL_NAME', 'NATION', 'POS_TYPE', 'JOB_TYPE', 'TEL', 'PIT_TAX_NO', 'CITIZEN_ID', 'CITIZEN_DT', 'CITIZEN_PLACE'
				, 'PERMANENT_ADDR', 'PRESENT_ADDR', 'RESIDENT_YN', 'TCO_COMPANY_PK', 'TEI_COMPANY_PK', 'YEAR', 'FROM_MONTH', 'TO_MONTH', 'MONTH_STRING', 'TYPE_OF_INCOME', 'FINAL_DEDUCT_PIT'
				, 'FINAL_INCOME_AMT', 'FINAL_INCOME_BEFORE_TAX', 'FINAL_INCOME_TAX', 'FINAL_INSURANCE_AMT', 'COMPANY_ID', 'COMPANY_NAME', 'COMPANY_TAX_NO', 'COMPANY_ADDRESS', 'COMPANY_TEL', 'COMPANY_FAX', 'COMPANY_EMAIL'
				, 'INVOICE_DT', 'INVOICE_NO', 'FORM_NO', 'SERIAL_NO', 'REF_INVOICE_DT', 'REF_INVOICE_NO', 'REF_FORM_NO', 'REF_SERIAL_NO', 'STATUS', 'SIGN_YN', 'SIGN_DT', 'SIGN_BY'
				, 'SEND_MAIL_YN', 'SEND_MAIL_DT', 'SEND_MAIL_BY', 'EMAIL', 'EMAIL_CC', 'ISSUE_DT', 'INVOICE_TYPE', 'INVOICE_KIND', 'DOCUMENT_TYPE', 'DOCUMENT_PRINT_TYPE', 'NATION_NM'
				, 'POS_TYPE_NM', 'JOB_TYPE_NM', 'CITIZEN_PLACE_NM', 'PIT_FINALIZE_YN', 'THR_PIT_TEMPLATE_PK', 'THR_PIT_TEMPLATE_DETAIL_PK', 'LETTER_TEMPLATE_PK', 'LETTER_TEMPLATE_DETAIL_PK'
				, 'TAX_DEPEND_AMT', 'TAX_PAYER_AMT'

			],
			invalidData:0,
			validData:0,


			header: [],
			dataFromExcel: [],
		}),

		watch: {
			dialogIsShow(val) {
				if (val === false) {
					this.$emit('onCloseDialog')
				} else {
					
					this.onLoad();
				}
			},

		},

		computed: {
			user: function () {
				return this.$store.getters["auth/user"];
			},
			limitHeight() {
				return 450;
			},
		},


		methods: {
			async onLoad() {
				try {
					await this.$nextTick(async () => {
						this.$refs.idGrid.Clear();
						this.invalidData = 0;
						this.validData = 0;
						this.prepareCommonData();
					});

				} catch (e) {

				}


			},

			async prepareCommonData() {

				let parentCodes = ["HR0309", "HR0310", "HR0311", "HR0312", "HR0313", "HR0314", "HR0315"];
				let listCommonCode = await this._getCommonCode2( parentCodes,  this.selectedCompany  );

				let lstDocumentPrintType = listCommonCode[1];
				let lstInvoiceKind = listCommonCode[2];
				let lstInvoiceType = listCommonCode[3];
				let lstStatus = listCommonCode[4];
				let lstIncomeType = listCommonCode[6];


				this.header = [
					{ title: ("check"), field: "CHECK_YN", editable: true, type: "checkbox",  width:50, fixed: true, cellClassName: this.cellClassName },
					{ title: ("no") , field: "INDEX", type: "" , editable: false, cellClassName: this.cellClassName , fixed: true, cellClassName: this.cellClassName},
					{ title: ("emp_id") , field: "EMP_ID", type: "" , editable: false, cellClassName: this.cellClassName , fixed: true, cellClassName: this.cellClassName},
					{ title: ("full_name") , field: "FULL_NAME", type: "" , editable: false, cellClassName: this.cellClassName , fixed: true, cellClassName: this.cellClassName},

					{ title: ("issue_dt") , field: "ISSUE_DT", type: "" , editable: false, cellClassName: this.cellClassName },
					{ title: ("invoice_type") , field: "INVOICE_TYPE", type: "list", datasource: { KEY: 'CODE', VALUE:'NAME', data: lstInvoiceType} , editable: false, cellClassName: this.cellClassName },
					{ title: ("document_print_type") , field: "DOCUMENT_PRINT_TYPE", type: "list", datasource: { KEY: 'CODE', VALUE:'NAME', data: lstDocumentPrintType} , editable: false, cellClassName: this.cellClassName },
					{ title: ("invoice_kind") , field: "INVOICE_KIND", type: "list", datasource: { KEY: 'CODE', VALUE:'NAME', data: lstInvoiceKind}  , editable: false, cellClassName: this.cellClassName },
					{ title: ("type_of_income") , field: "TYPE_OF_INCOME", type: "list", datasource: { KEY: 'CODE', VALUE:'NAME', data: lstIncomeType}  , editable: false, cellClassName: this.cellClassName },
					{ title: ("pit_tax_no") , field: "PIT_TAX_NO", type: "" , editable: false, cellClassName: this.cellClassName },
					{ title: ("nation_nm") , field: "NATION_NM", type: "" , editable: false, cellClassName: this.cellClassName },
					{ title: ("tel") , field: "TEL", type: "" , editable: false, cellClassName: this.cellClassName },
					{ title: ("citizen_id") , field: "CITIZEN_ID", type: "" , editable: false, cellClassName: this.cellClassName },
					{ title: ("citizen_dt") , field: "CITIZEN_DT", type: "" , editable: false, cellClassName: this.cellClassName },
					{ title: ("citizen_place_nm") , field: "CITIZEN_PLACE_NM", type: "" , editable: false, cellClassName: this.cellClassName },
					{ title: ("email") , field: "EMAIL", type: "" , editable: false, cellClassName: this.cellClassName },
					{ title: ("email_cc") , field: "EMAIL_CC", type: "" , editable: false, cellClassName: this.cellClassName },
					{ title: ("present_addr") , field: "PRESENT_ADDR", type: "" , editable: false, cellClassName: this.cellClassName },
					{ title: ("resident_yn") , field: "RESIDENT_YN", type: "" , editable: false, cellClassName: this.cellClassName },
					{ title: ("final_insurance_amt") , field: "FINAL_INSURANCE_AMT", type: "number" , editable: false, cellClassName: this.cellClassName },
					{ title: ("final_income_amt") , field: "FINAL_INCOME_AMT", type: "number" , editable: false, cellClassName: this.cellClassName },
					{ title: ("final_income_before_tax") , field: "FINAL_INCOME_BEFORE_TAX", type: "number" , editable: false, cellClassName: this.cellClassName },

					{ title: ("tax_depend_amt") , field: "TAX_DEPEND_AMT", type: "number" , editable: false, cellClassName: this.cellClassName },
					{ title: ("tax_payer_amt") , field: "TAX_PAYER_AMT", type: "number" , editable: false, cellClassName: this.cellClassName },
					{ title: ("final_deduct_pit") , field: "FINAL_DEDUCT_PIT", type: "number" , editable: false, cellClassName: this.cellClassName },

					{ title: ("month_string") , field: "MONTH_STRING", type: "" , editable: false, cellClassName: this.cellClassName },
					{ title: ("year") , field: "YEAR", type: "" , editable: false, cellClassName: this.cellClassName },
					{ title: ("final_income_tax") , field: "FINAL_INCOME_TAX", type: "number" , editable: false, cellClassName: this.cellClassName },
					{ title: ("from_month") , field: "FROM_MONTH", type: "" , editable: false, cellClassName: this.cellClassName },
					{ title: ("to_month") , field: "TO_MONTH", type: "" , editable: false, cellClassName: this.cellClassName },
					{ title: ("company_id") , field: "COMPANY_ID", type: "" , editable: false, cellClassName: this.cellClassName },
					{ title: ("company_name") , field: "COMPANY_NAME", type: "" , editable: false, cellClassName: this.cellClassName },
					{ title: ("company_tax_no") , field: "COMPANY_TAX_NO", type: "" , editable: false, cellClassName: this.cellClassName },
					{ title: ("company_address") , field: "COMPANY_ADDRESS", type: "" , editable: false, cellClassName: this.cellClassName },
					{ title: ("company_tel") , field: "COMPANY_TEL", type: "" , editable: false, cellClassName: this.cellClassName },
					{ title: ("company_fax") , field: "COMPANY_FAX", type: "" , editable: false, cellClassName: this.cellClassName },
					{ title: ("company_email") , field: "COMPANY_EMAIL", type: "" , editable: false, cellClassName: this.cellClassName },
					{ title: ("invoice_dt") , field: "INVOICE_DT", type: "" , editable: false, cellClassName: this.cellClassName },
					{ title: ("invoice_no") , field: "INVOICE_NO", type: "" , editable: false, cellClassName: this.cellClassName },
					{ title: ("form_no") , field: "FORM_NO", type: "" , editable: false, cellClassName: this.cellClassName },
					{ title: ("serial_no") , field: "SERIAL_NO", type: "" , editable: false, cellClassName: this.cellClassName },
					{ title: ("valid"), field: "VALID", type: "" , editable: false, cellClassName: this.cellClassName},
					{ title: ("errcode") , field: "ERRCODE", type: "" , editable: false, cellClassName: this.cellClassName },
					{ title: ("result") , field: "RESULT", type: "" , editable: false, cellClassName: this.cellClassName },


					{ title: ("_"), field: "PK", visible: false, type: "" , editable: false },
					
					{ title: ("_"), field: "TCO_COMPANY_PK", visible: false, type: "" , editable: false },
					{ title: ("_"), field: "THR_EMP_PK", visible: false, type: "" , editable: false },
					{ title: ("_"), field: "THR_PIT_TEMPLATE_PK", visible: false, type: "" , editable: false},
					{ title: ("_"), field: "THR_PIT_TEMPLATE_DETAIL_PK", visible: false, type: "" , editable: false },
					{ title: ("_"), field: "LETTER_TEMPLATE_PK", visible: false, type: "" , editable: false },
					{ title: ("_"), field: "LETTER_TEMPLATE_DETAIL_PK", visible: false, type: "" , editable: false },
				];
			},

			cellClassName  (row, columnfield, value,rowdata) {
				if( !(rowdata.ERRCODE ==null || rowdata.ERRCODE == "") ) {
					return "cell1031300err";
				}
				return this.cellClassStatus(rowdata);
			},

			onSearch() {

			},

			async onSelectFile(){
				this.dataFromExcel = [];
				this.$refs.file.value = null;
				this.invalidData = 0;
				this.validData = 0;
				this.$refs.file.click();
			},

			async onProcessFile(event){
				const files = event.target.files;
      	if(files[0] !== undefined) {
      		const fr = new FileReader ();
    			fr.readAsDataURL(files[0]);
    			fr.addEventListener('load', () => {
						this.onReadExcel(fr.result);
    			});
    		} 
			},

			async onReadExcel(base64){
				this.showNotification("success", this.$t("reading_excel"));
				try {
					let exceljs =  require("@/plugins/exceljs.js");
					if(!!exceljs) {
							exceljs = exceljs.default;
					}

					await exceljs.readFile(this, base64, "BASE64");
					exceljs.setWorksheet("Sheet1");
					let worksheet = exceljs.worksheet();
					let sheetModel = worksheet.model;

					let headerFieldRow = 5;
					let startDataRow = 6;
					let dataIdx = 1;

					let headerFields = worksheet.getRow(headerFieldRow).values;

					//start read data
					for(let idx = startDataRow; idx <= sheetModel.rows.length; idx++ ) {
						let data = {INDEX: dataIdx++, ERRCODE:""};
						for(let colIdx = 1; colIdx < headerFields.length; colIdx++) {
							let value = null;
							try {
								let cell = exceljs.getCellByIndex(this, idx, colIdx);
								value = cell.value;
							} catch {}
							data[headerFields[colIdx] ] = value;
						}
						this.dataFromExcel.push(data);
					}

					this.excelToGrid();

				} catch (e){
					console.log(e.message);
					this.showNotification("error", this.$t("error_occurs"));
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

			async excelToGrid(){
				this.showNotification("success", this.$t("validating_data"));
				

				//get template + company information
				let paras = [];
				for(let idx = 0; idx < this.dataFromExcel.length; idx++) {
					let data = this.dataFromExcel[idx];
					let para =  [data.INDEX, this.selectedCompany, data.DOCUMENT_PRINT_TYPE, data.INVOICE_KIND];
					paras.push(para);
				}

				let resTemplate = await this.$axios.$post("dso/bulkinsertpro", { proc: this.proGetTemplate, para: paras });
				resTemplate = this.modifyBulkData(resTemplate);
				
				//excel to grid
				let gridColumns = this.$refs.idGrid.columns.map(q => {return q.datafield});
				let dataSource = [];
				for(let idx = 0; idx < this.dataFromExcel.length; idx++) {
					let data = this._initObject(gridColumns);
					data._rowstatus = "";
					
					Object.assign(data, this.dataFromExcel[idx]);
					let template = resTemplate.find(q => q.INDEX == data.INDEX);
					if(template) {
						Object.assign(data, template);
					}

					data.INVOICE_DT = data.ISSUE_DT;

					//modify from - to month
					if( data.MONTH_STRING ) {
						try {
							let monthList = data.MONTH_STRING.split(',');
							if(monthList?.length > 0) {
								monthList = monthList.map(q => { return Number(q.trim()) });
								let min = Math.min(...monthList);
								let max = Math.max(...monthList);
								data.FROM_MONTH =data.YEAR + (min+"").padStart(2, '0');
								data.TO_MONTH = data.YEAR + (max+"").padStart(2, '0');
							}
						} catch(e){ }
					}
				
					dataSource.push(data);
				}

				//validate data source
				paras = [];
				let insertedDatas = [];
				for(let idx = 0; idx < dataSource.length; idx++) {
					let data = dataSource[idx];
					let para =  [ data.INDEX, this.selectedCompany, data.YEAR, data.EMP_ID, data.PIT_TAX_NO, data.FROM_MONTH, data.TO_MONTH ];
					paras.push(para);
				}

				let resValidate = await this.$axios.$post("dso/bulkinsertpro", { proc: this.proValidateEmp, para: paras });
				resValidate = this.modifyBulkData(resValidate);

				for(let idx = 0; idx < dataSource.length; idx++) {
					let data = dataSource[idx];
					let validate = resValidate.find(q => q.INDEX == data.INDEX);
					if(validate) {
						if(validate.hasOwnProperty("THR_EMP_PK")) {
							data.THR_EMP_PK = validate.THR_EMP_PK;
							data.TCO_COMPANY_PK = this.selectedCompany;
							
							let keys = Object.keys(validate);
							keys.forEach(key => {
								if(!data.hasOwnProperty(key)) {
									data[key] = validate[key];
								} else {
									data[key] = this.isNullOrEmpty(data[key]) ? validate[key] : data[key];
								}
							});


							data.VALID = 'Y';
							data.CHECK_YN = "Y";
							data._rowstatus = 'i';
							
						}

						if(validate.hasOwnProperty("ERRCODE")) {
							data.ERRCODE = (data.ERRCODE ? (data.ERRCODE + "; ") : data.ERRCODE) +  validate.ERRCODE;
							data.VALID = 'N';
							data.CHECK_YN = "N";
						}
					}

					//validate duplicate 
					let idxDuplidate = insertedDatas.findIndex(q => q.THR_EMP_PK ===  data.THR_EMP_PK && q.YEAR === data.YEAR);
					if(idxDuplidate >=0)  {
						data.ERRCODE = (data.ERRCODE ? (data.ERRCODE + "; ") : data.ERRCODE) +  "Duplicate";
						data.VALID = 'N';
						data.CHECK_YN = "N";
					} else {
						insertedDatas.push( { THR_EMP_PK: data.THR_EMP_PK, YEAR: data.YEAR } );
					}

					if(data.VALID == 'Y') {
						this.validData++;
					} else {
						this.invalidData++;
					}
				}

				if(dataSource.length > 0) {
					this.$refs.idGrid.setDataSource(dataSource);
				}
			},
				

			async onGetTemplate() {
				const res = await this.$axios.$get('/dso/downloadtemp', {
					responseType: "blob",
					params: {
						template: this.templatePath
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
						tag_a.download = this.templatePath.split("/").pop();
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

			async onSave(){
				let formatDateFromString = (d) =>{
					let _d = moment(d, "DD/MM/YYYY");
					if(_d.isValid()) {
						return _d.format("YYYYMMDD");
					}
					return null;
				};

				let dateCols = ["ISSUE_DT","CITIZEN_DT","INVOICE_DT"];
				let datas = this.$refs.idGrid.getDataDb();
				let selectedDatas = datas?.filter(q => (q.CHECK_YN == true || q.CHECK_YN == 'Y') && q.VALID == 'Y' );
				if(selectedDatas?.length > 0) {

					let paras = [];
					selectedDatas.forEach( q => {
						let para = [];
						this.paraInsertData.forEach(p => {
							if(dateCols.includes(p)) {
								//parse date from dd/mm/yyyy to yyyymmdd
								if(q[p] && q[p].length == 10) {
									q[p] = formatDateFromString(q[p])
								}
							}
							
							let val = q[p] ? q[p] : '' ;
							para.push(val)
						});
						paras.push(para);
					});

					let results = await this.$axios.$post("dso/bulkinsertpro", { proc: this.proInsertValidData, para: paras });
					results = this.modifyBulkData(results);
					if(results) {

						for(let i = 0; i< datas.length; i++) {
							let data = datas[i];
							let res = results.find(q => q.INDEX == data.INDEX);
							if(res) {
								Object.assign(data, res);
							}
						}
						
						this.$refs.idGrid.setDataSource(datas);
						this.showNotification("success", this.$t("process_success"));
					}
					//this.dialogIsShow = false;

				} else {
					this.showNotification("warning", this.$t("no_row_selected"));
				}
			},

			async onCancel(){
				this.dialogIsShow = false;
			},

			callBackData() {

			},

			isNullOrEmpty(str) {
                return str == null || str == "";
            },

		}
	} 
	</script>
<style>
.cell1031300err {
	background-color: #ff0f0f;
}
</style>