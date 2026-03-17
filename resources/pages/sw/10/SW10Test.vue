<template>
  <v-container fluid class="pa-0">
    <v-row no-gutters>
      <v-col cols="12">
        <!-- Search Panel -->
        <v-row align="center" justify="center">
		
          <v-col cols="12"  align='center'>
            <v-card outlined tile>
              <v-container fluid class="pa-1">
                <v-row dense align="center" justify="space-between">
                  <v-col lg="1" md="3" sm="3" cols="12" class="pb-sm-0 pb-2">
						<BaseSelect :label="$t('company')" v-model="selectedCompany" :lstData="companyList" item-text="TEXT" item-value="PK" @change="onChangeCompany" />
                  </v-col>
				  <v-col lg="1" md="3" sm="3" cols="12" class="pb-sm-0 pb-2">
                    <BaseSelect :label="$t('FACTORY')" v-model="lstFactory" :lstData="bizPlaceList" item-text="TEXT" item-value="PK"   />
                  </v-col>
				  <v-col lg="2" md="3" sm="3" cols="12" class="pb-sm-0 pb-2">
					<BaseDatePicker v-model="dt_from" outlined :label="$t('dt_from')" default></BaseDatePicker> 
                  </v-col>
                  <v-col lg="2" md="3" sm="3" cols="12" class="pb-sm-0 pb-0">
                    <BaseDatePicker v-model="dt_to" outlined :label="$t('dt_to')" default></BaseDatePicker> 
                  </v-col>
				  <v-col lg="2" md="3" sm="3" cols="12" class="pb-sm-0 pb-0">
                    <v-text-field clearable dense hide-details :label="$t('po_style_code')" v-model="po_style_code" @keypress.enter="searchUser"></v-text-field>
                  </v-col>
                  <v-col lg="1" md="2" sm="3" cols="12" class="pb-sm-0 pb-0">
					 <BaseSelect :label="$t('ORDER STATUS')" v-model="lstORDERSTATUS" :lstData="lstSecurityLevel" item-text="NAME" item-value="CODE"   />
                    
                  </v-col>
                  <v-col lg="2" md="4" sm="3" cols="12" class="text-sm-right text-center pb-sm-0 pb-0">
                    <v-btn icon tile :color="currentTheme" :disabled="isProcessing" @click="searchUser">
                      <v-icon>mdi-magnify</v-icon>
                    </v-btn>
                    <!--v-btn icon tile color="success" :disabled="isProcessing" @click="addNew">
                      <v-icon>mdi-plus-box</v-icon>
                    </v-btn-->
                     <v-btn icon tile color="success" :disabled="false" @click="onReport">
						<v-icon dark>mdi-file-excel</v-icon>
					</v-btn>
                    <v-btn icon tile :color="currentTheme" :disabled="isProcessing" @click="commitSave">
                      <v-icon>mdi-content-save</v-icon>
                    </v-btn>
					
					<v-col  align='center'>
					  <BasePhoto v-model="PHOTO_PK" ref="photo"></BasePhoto>
					</v-col>
			
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
          </v-col>
        </v-row>
        <!-- Data Table -->
        <v-row align="center" justify="center">
          <v-col cols="12" class="py-0"> 
            <v-card outlined tile v-resize="onResize">
              <DxDataGrid column-resizing-mode="widget" dateSerializationFormat="yyyyMMdd" key-expr="PK" ref="userDataGrid" 
                :allow-column-resizing="true" :cache-enabled="true"  :data-source="userList" :onRowPrepared="onRowPrepared"
                :height="limitHeight" :no-data-text="$t('no_data', 'common')" 
                :onEditorPreparing="onEditorPreparing" :onEditorPrepared="onEditorPrepared" :onRowClick="onRowClick"
                :show-borders="true" :show-column-lines="true" :show-row-lines="true" :selection="{ mode: 'single' }"
                @row-updated="checkUpdatedItem" @selection-changed="selectionChanged">

				  <DxColumn width="100" data-field="PO" :allow-editing="false" :caption="$t('PO_NO')"></DxColumn>
                  <DxColumn width="100" data-field="PRODUCT_CODE" :allow-editing="false" :caption="$t('PRODUCT_CODE')"></DxColumn>
                  <DxColumn width="100" data-field="OGAC_DATE" dataType="date" format="dd-MM-yyyy" :allow-editing="false" :caption="$t('OGAC_DATE')"></DxColumn>
				  
				  <DxColumn width="200" data-field="STICKER_NUM01" :allow-editing="false" :caption="$t('Item_Description')"></DxColumn>
                  <DxColumn width="100" data-field="GAC_DATE" dataType="date" format="dd-MM-yyyy" :allow-editing="false" :caption="$t('GAC_DATE')"></DxColumn>
                  <DxColumn width="100" data-field="QTY" dataType="number" format="###,###,###.##" :allow-editing="false" :caption="$t('QTY')"></DxColumn>
				  
				  <DxColumn width="100" data-field="COMPANY_CODE" :allow-editing="false" :caption="$t('COMPANY')"></DxColumn>
                  <DxColumn width="100" data-field="FACTORY_CODE" :allow-editing="false" :caption="$t('FACTORY')"></DxColumn>
                  <DxColumn width="100" data-field="IMPORT_DATE" dataType="date" format="dd-MM-yyyy"  :allow-editing="false" :caption="$t('IMPORT DATE')"></DxColumn>
				  <!--DxColumn width="100" data-field="ORDER_STATUS" :allow-editing="false" :caption="$t('status')"></DxColumn-->
				  <DxColumn data-field="ORDER_STATUS" :caption="$t('ORDER_STATUS')" :allow-editing="true" dataType="string">
						<DxLookup display-expr="NAME" value-expr="CODE" :data-source="lstSecurityLevel" />
					</DxColumn>
				
				  <DxEditing mode="cell" :allow-updating="true" startEditAction="dblClick" :confirmDelete="false" />
				  <DxKeyboardNavigation :edit-on-key-press="true" />
              </DxDataGrid>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!-- Set Password Dialog -->
    <v-dialog id="set-password-dialog" max-width="500" v-model="setPasswordDialog">
      <v-card>
        <v-card-title class="headline primary-gradient white--text py-2">{{ setPasswordType === "i" ? $t('create_password') : $t('update_password', 'common') }}</v-card-title>
        <v-card-text class="pa-0">
          <v-form lazy-validation ref="setPasswordForm" v-model="setPasswordFormIsValid">
            <v-container>
              <v-row dense align="start" justify="center">
                <v-col cols="12">
                  <v-text-field clearable dense validate-on-blur 
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" :label="$t('password', 'common')" :rules="[validationRule.passwordRules.required]" :type="showPassword ? 'text' : 'password'" 
                    @click:append="showPassword = !showPassword" v-model="password">
                  </v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field clearable dense validate-on-blur 
                    :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'" :label="$t('confirm_password', 'common')" :rules="[validationRule.passwordRules.required, passwordConfirmationRule]" :type="showConfirmPassword ? 'text' : 'password'" 
                    @click:append="showConfirmPassword = !showConfirmPassword" v-model="confirmPassword">
                  </v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text :color="currentTheme" :disabled="isProcessing" @click="setPasswordDialog = false">{{ $t('cancel', 'common') }}</v-btn>
          <v-btn depressed class="white--text" :color="currentTheme" :disabled="isProcessing" :loading="isProcessing" @click="updatePassword">{{ setPasswordType === "i" ? $t('create', 'common') : $t('update', 'common') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Employee Dialog -->
    <employee-dialog ref="employeeDialog" :headers="columnHeaders" @callBackData="mappingEmp"></employee-dialog>
    <!-- Partner Dialog -->
    <partner-dialog ref="partnerDialog" @callBackData="handleReturnedPartner" />
  </v-container>
</template>

<script>
import EmployeeDialog from '@/components/dialog/EmployeeDialog';
import PartnerDialog from "@/components/dialog/PartnerDialog";
export default {
  layout: 'default',
  middleware: 'user',

  components: { EmployeeDialog, PartnerDialog },

  data: () => ({
    // Search Options
    userEmpID: '',
    empName: '',
    activeStatus: true,

    // Table Data
    userList: [],
    selectedRowKeys: [],

    // Set Password
    setPasswordDialog: false,
    setPasswordFormIsValid: undefined,
    selectedUserPK: '',
    setPasswordType: '',
    password: '',
    confirmPassword: '',
    showPassword: false,
    showConfirmPassword: false,
    returnedPassword: "",

    // Delete
    deleteDialog: false,
    deleteProps: {},

    // Employee Dialog
    selectedUser: '',
    columnHeaders: [],
	companyList: [],
	bizPlaceList: [],
	selectedCompany: "",
    lstORDERSTATUS: "",	
	lstFactory: "",
	dt_from: "",
	dt_to: "",
	po_style_code: "",
    counter: 0,
    PHOTO_PK: 0,
    lstSecurityLevel:[],
  }),

  mounted() {
    this.prepareCommonData();
	this.getCompanyList();
	//this.getCommonCode("status");
    //console.log('SECOND_DB_YN:'+this.SECOND_DB_YN)
  },

  computed: {
    user() { return this.$store.getters["auth/user"] },
    limitHeight() { return this.windowHeight - 220 },
    passwordConfirmationRule() {
      if(this.password === this.confirmPassword) {
        return true
      }
      return this.$t('confirm_pass_not_match', 'common')
    }
  },

  methods: {

    async prepareCommonData(){
      this.lstSecurityLevel = await this._getCommonCode("ORD_STATUS", this.user.TCO_COMPANY_PK);
    },

    async getUserList(paramsData) {
      const dso = {
        type: 'grid',
        selpro: 'SW_SEL_SW10120_ORDER',
        para: paramsData
      }
      const result = await this._dsoCall(dso, 'select', false)
      this.userList = result ? result : []
      this.$refs.userDataGrid.instance.clearSelection()
    },

    searchUser() { 
      this.getUserList([ this.selectedCompany ? this.selectedCompany : '', this.lstFactory ? this.lstFactory : '', this.dt_from ? this.dt_from : '', this.dt_to ? this.dt_to : '', this.po_style_code ? this.po_style_code :'', this.lstORDERSTATUS ? this.lstORDERSTATUS :'' ])
    },
    async getCompanyList() {
            const dso = {
                type: "list",
                selpro: "sw_sel_list_company",
                para: ['TW']
            };
            const result = await this._dsoCall(dso, "select", false);
            if (result) {
                this.companyList = result; 
            } else {
                this.companyList = [];
            }
            /*const dso_bizplace_list = {
                type: 'list',
                selpro: 'sw_sel_factory',
                para: [this.selectedCompany, this.user.PK]
            }
            this.bizPlaceList = await this._dsoCall(dso_bizplace_list, 'select', false)
            if (this.bizPlaceList.length > 0) {
                //this.lstFactory = this.bizPlaceList[0].PK;
            }*/
        },
	async onChangeCompany() {
            this.bizPlaceList = [];
            const dso_bizplace_list = {
                type: 'list',
                selpro: 'sw_sel_factory',
                para: [this.selectedCompany, this.user.PK]
            }
            this.bizPlaceList = await this._dsoCall(dso_bizplace_list, 'select', false)
            if (this.bizPlaceList.length > 0) {
                //this.lstFactory = this.bizPlaceList[0].PK; 
            }
        },	
    addNew() {
      this.userList.unshift({
        _rowstatus: 'i', PK: this._uniqueID(),PO: '', PRODUCT_CODE: '', OGAC_DATE: '', STICKER_NUM01: '', GAC_DATE: '' , QTY: '', COMPANY_CODE: '', FACTORY_CODE: '', IMPORT_DATE: '', ORDER_STATUS: ''
      })
      console.log(this.userList)
    },	   
    valueChanged(e, colName, rowPK) {
      const newValue = e ? 'Y' : 'N'
      this.changeValue(newValue, colName, rowPK)
    },

    changeValue(value, key, pk) {
      this.userList.map((item, index) => {
        if(item.PK === pk) {
          this.$set(item, key, value)
          if(item.PK && item._rowstatus !== "i") {
            item._rowstatus = "u"
          }
        }
      })
    },

    commitSave() {
      this.$refs.userDataGrid.instance.saveEditData().then(() => {
        this.save()
      })
    },

    async save() {
      const dataIsModified = this.userList.some(x => x._rowstatus !== "")
	  let savedPhoto = await this.$refs.photo.Save();
          //this.formIsValid = true;
      if(dataIsModified) {
        const dso = {
          type: 'grid',
          selpro: 'SW_SEL_SW10120_ORDER',
          updpro: 'SW_UPD_SW10120_ORDER',
          para: [this.selectedCompany ? this.selectedCompany : '', this.lstFactory ? this.lstFactory : '', this.dt_from ? this.dt_from : '', this.dt_to ? this.dt_to : '', this.po_style_code ? this.po_style_code :'',this.lstORDERSTATUS ? this.lstORDERSTATUS :''],
          elname: [ '_rowstatus', 'PK', 'PO', 'PRODUCT_CODE', 'OGAC_DATE', 'STICKER_NUM01', 'GAC_DATE', 'QTY', 'COMPANY_CODE', 'FACTORY_CODE', 'IMPORT_DATE', 'ORDER_STATUS'
          ],
          requirecol: ['COMPANY_CODE', 'FACTORY_CODE', 'IMPORT_DATE','IMPORT_DATE','PO','ORDER_STATUS'],
          data: this.userList
        }
		
		   
        const result = await this._dsoCall(dso, 'update', true)
		//console.log(result);
        if(result) {
          this.userList = result
          const found = this.userList.find(x => x.PK === this.user.PK)
          if(found) {
            await this.$store.dispatch("auth/saveUserInfo")
          }
        }
        this.$refs.userDataGrid.instance.clearSelection()
      }
    },

    openPasswordDialog(userPK, rowStatus) {
      this.selectedUserPK = userPK
      this.setPasswordType = rowStatus
      this.setPasswordDialog = true
      this.$nextTick(() => {
        this.$refs.setPasswordForm.resetValidation()
      })
      this.password = ''
      this.confirmPassword = ''
      this.showPassword = false
      this.showConfirmPassword = false
    },

    updatePassword() {
      if(this.$refs.setPasswordForm.validate()) {
        this.setPasswordFormIsValid = true
        this.isProcessing = true
        if(this.setPasswordType === "i") {
          this.$axios.$post("/user/createpassword", { password: this.password, confirmPassword: this.confirmPassword })
            .then((res) => {
              if(res.data) {
                this.isProcessing = false
                this.setPasswordDialog = false
                this.returnedPassword = res.data
                this.showNotification('success', this.$t('create_password_success'), '')
              } else {
                this.isProcessing = false
                this.returnedPassword = ""
                this.showNotification('danger', this.$t('create_password_failed'), res.message)
              }
              this.changeValue(this.returnedPassword, "USER_PW", this.selectedUserPK)
              console.log(this.userList)
            })
            .catch((e) => {
              this.isProcessing = false
              this.showNotification('danger', this.$t('error_occurs', 'common'), e.message)
            })
        } else {
          this.$axios.$post("/user/updatepassword", { proc: "SYS_UPD_SYSE004_USER_PW", userPK: this.selectedUserPK, password: this.password, confirmPassword: this.confirmPassword })
            .then((res) => {
              if(res.data) {
                this.isProcessing = false
                this.setPasswordDialog = false
                this.showNotification('success', this.$t('update_password_success', 'common'), '')
              } else {
                this.isProcessing = false
                this.showNotification('danger', this.$t('update_password_failed', 'common'), res.message)
              }
            })
            .catch((e) => {
              this.isProcessing = false
              this.showNotification('danger', this.$t('error_occurs', 'common'), e.message)
            })
        }
      } else {
        this.setPasswordFormIsValid = false
      }
    },

    openEmployeeDialog(item) {
      this.$refs.employeeDialog.dialogIsShow = true
      this.columnHeaders = [
        { field: 'ORG_NM', caption: this.$t('organization', 'common') },
        { field: 'EMP_ID', caption: this.$t('emp_id', 'common') },
        { field: 'FULL_NAME', caption: this.$t('emp_name', 'common') }
      ]
      this.selectedUser = {...item}
    },

    mappingEmp(item) {
      const userIdx = this.userList.findIndex(x => x.PK === this.selectedUser.PK)
      if(userIdx > -1) {
        if(!this.userList[userIdx]._rowstatus) {
          this.userList[userIdx]._rowstatus = "u"
        }
        this.userList[userIdx].THR_ABEMP_PK = item.PK
        this.userList[userIdx].EMP_ID = item.EMP_ID
        this.userList[userIdx].EMP_NAME = item.FULL_NAME
      }
    },

    checkUpdatedItem(e) {
      if(!e.cancel) {
        if(e.data._rowstatus !== "i") {
          e.data._rowstatus = 'u'
        }
      }
    },

    onRowClick(e) {
      if(e.rowType === "data" && e.isSelected && e.data._rowstatus === "d") {
        e.rowElement.classList.remove("dx-selection")
      }
    },

    selectionChanged({ selectedRowKeys }) {
      this.selectedRowKeys = selectedRowKeys
    },
	//-------------------------------------------
	onRowPrepared({ data, rowElement, rowType }) {
      if(rowType === "data") {
	  //console.log(data.GAC_DATE);
        if(data.GAC_DATE === "Sub Total:" || data.GAC_DATE === "Grand Total:") {
		  rowElement.style.color =  "#ff8080"; 
		  rowElement.style.fontWeight = "bold";
        }
      }
    },
	//-------------------------------------------
    markDeleteItems() {
      if(this.selectedRowKeys.length) {
        for (let i = 0; i < this.userList.length; i++) {
          const user = this.userList[i]
          for (let j = 0; j < this.selectedRowKeys.length; j++) {
            const item = this.selectedRowKeys[j]
            if(item === user.PK) {
              if(user._rowstatus !== "d") {
                user._rowstatus = "d"
                this.setMarkedDeleteRowColor('userDataGrid', true, i)
              } else {
                user._rowstatus = ""
                this.setMarkedDeleteRowColor('userDataGrid', false, i)
              }
            }
          }
        }
      } else {
        this.userList.forEach((item, index) => {
          if(item._rowstatus === "d") {
            item._rowstatus = ""
            this.setMarkedDeleteRowColor('userDataGrid', false, index)
          }
        })
      }
    },

    onEditorPreparing(e) {
      if(e.parentType == "dataRow" && e.dataField == "USER_PW") {
        e.editorOptions.mode = 'password';
      }
    },

    onEditorPrepared(e) {},

    openPartnerDialog(item) {
      this.$refs.partnerDialog.dialogIsShow = true;
      this.selectedUser = {...item}
    },
//--------------------------------------------------------------------------

async onReport() {
       /*if (!this._hasValue(this.lstFactory))
       {
         this.showNotification( "danger",this.$t("please_select_one_consignor"), "", 4000);
         return;
       }*/			
        let p_param = [
			this.selectedCompany,
			this.lstFactory,
			this.dt_from.replace("-", ""),
			this.dt_to.replace("-", ""),
			this.po_style_code,
			this.lstORDERSTATUS,
        ];
        let report_no = this.lstFactory;
        let report_path = "";
        let report_name = "";   
        let report_name_ext = "pdf";        
        let excel = [];

       
	let report = "rpt_sw10120_Order_Inquiry";
      try{
        this._ExcelSaveAs(await this.$axios.$get('/dso/makereport', {responseType: "blob", params: {
          template: "report/SW/10/" + report + ".xlsx",
          excel: JSON.stringify([{
            sheet: 1,               
            insertRange: [{
              range: "A1:G6", proc: "SW_SEL_SW10120_ORDER", params: [...p_param], dateColumns: [ "CP_DATE" ]
            }],
            insertRows: [{
				startRow: 8, proc: "SW_SEL_SW10120_ORDER", params: [...p_param], stringColumns: [ "GAC_DATE_RPT","QTY","FACTORY_CODE_RPT"], subStyle: { font : {   bold: true   } , fill: {
                                        type: 'pattern',
                                        pattern:'solid',
                                        fgColor : { argb: 'FFE599'},
                                        bgColor : { argb: 'FFE599'}
                                      } }  
              //startRow: 8, proc: "SW_SEL_SW10120_ORDER", params: [...p_param]
            }]
          }]),
          convert: "xlsx"}
        }), report + "." + "xlsx");
      } catch (e) {
        this.showNotification("danger", this.$t("fail_to_export_report"), "", 4000);
      }
},
//--------------------------------------------------------------------------
    handleReturnedPartner(item) {
      const userIdx = this.userList.findIndex(x => x.PK === this.selectedUser.PK)
      if(userIdx > -1) {
        if(!this.userList[userIdx]._rowstatus) {
          this.userList[userIdx]._rowstatus = "u"
        }
        this.userList[userIdx].TCO_BUSPARTNER_PK = item.PK
        this.userList[userIdx].PARTNER_NAME = item.PARTNER_NAME
      }
    },
  }
}
</script>
