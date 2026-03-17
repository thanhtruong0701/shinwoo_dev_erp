<template>
  <v-container fluid class="pa-0">
    <v-row no-gutters align="center">
      <v-col cols="12">
        <!-- Search Panel -->
        <v-row no-gutters  align="center">
          <v-col cols="12" lg="1" class="px-1 py-1">
            <v-text-field clearable dense hide-details :label="$t('user_emp_id')" v-model="userEmpID" @keypress.enter="searchUser"></v-text-field>
          </v-col>
          <v-col cols="12" lg="2" class="px-1 py-1">
            <v-text-field clearable dense hide-details :label="$t('emp_name')" v-model="empName" @keypress.enter="searchUser"></v-text-field>
          </v-col>
          <v-col cols="12" lg="2" class="px-1 py-1">
            <v-row no-gutters>
              <v-checkbox dense hide-details class="mt-0" :color="currentTheme" :label="$t('active')" v-model="activeStatus" @change="searchUser"></v-checkbox>
              <v-spacer></v-spacer>
              <BaseButton btn_type="default" icon_type="search" :btn_text="$t('search')" @onclick="searchUser" v-bind:disabled.sync="isProcessing" />
            </v-row>
          </v-col>

          <v-col cols="12" lg="4" class="px-1 py-1">
            <v-row no-gutters>
              <v-spacer></v-spacer>
              <BaseInput :outlined="true"  :label="$t('copy_from_user')" v-model="copyFromUser" style="width: 150px !important" class="px-1 py-1"></BaseInput>
              <BaseInput :outlined="true"  :label="$t('copy_to_user')" v-model="copyToUser" style="width: 150px !important" class="px-1 py-1"></BaseInput>
            </v-row>
          </v-col>

          <v-col cols="12" lg="3" class="px-1 py-1">
            <v-row no-gutters >
              <BaseButton btn_type="default" icon_type="copy" :btn_text="$t('copy_role')" @onclick="onCopy" v-bind:disabled.sync="isProcessing" />
              <v-spacer></v-spacer>
              <BaseButton btn_type="default" icon_type="add" :btn_text="$t('add')" @onclick="addNew" v-bind:disabled.sync="isProcessing" />
              <BaseButton btn_type="default" icon_type="delete" :btn_text="$t('delete')" @onclick="markDeleteItems" v-bind:disabled.sync="isProcessing" />
              <BaseButton btn_type="default" icon_type="save" :btn_text="$t('save')" @onclick="save" v-bind:disabled.sync="isProcessing" />
            </v-row>
          </v-col>
        </v-row>
        <!-- Data Table -->
        <v-row align="center" justify="center">
          <v-col cols="12" class="py-0">
            <v-card outlined tile v-resize="onResize">
              <BaseGridView
                ref="userDataGrid" 
                :max_height="limitHeight" 
                selectionmode="singlecell"
                :autoresize="true"
                :editable="true"
                :headertype="1"
                :header="headers"                  
                sel_procedure="SYS_SEL_SYSE004_USER"
                upd_procedure="SYS_UPD_SYSE004_USER"
                :filter_paras="[this.userEmpID ? this.userEmpID : '', this.empName ? this.empName : '', this.activeStatus ? -1 : 0, '']"
                :update_paras="['PK', 'THR_ABEMP_PK', 'EMP_NAME', 'USER_ID', 'USER_PW', 'MOBILE', 'LIVING_ADDR', 'USER_LANGUAGE', 'USE_YN', 'ANNOUNCE_YN', 'SYSADMIN_YN', 'ST_DATE', 'END_DATE', 'AC_LEVEL', 'FU_LEVEL', 'SA_LEVEL', 'PR_LEVEL', 'IN_LEVEL', 'PU_LEVEL', 'HR_LEVEL', 'EI_LEVEL', 'TCO_BUSPARTNER_PK']"
                @cellDblClick="onCellDblClick"
              />
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!-- Set Password Dialog -->
    <!-- <v-dialog id="set-password-dialog" max-width="500" v-model="setPasswordDialog">
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
    </v-dialog> -->

    <!-- Employee Dialog -->
    <employee-dialog ref="employeeDialog" :headers="columnHeaders" @callBackData="mappingEmp"></employee-dialog>
    <!-- Partner Dialog -->
    <partner-dialog ref="partnerDialog" @callBackData="handleReturnedPartner" />
  </v-container>
</template>

<script>
import EmployeeDialog from '@/components/dialog/EmployeeDialog';
import PartnerDialog from "@/components/dialog/PartnerDialog";

import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";


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
    // setPasswordDialog: false,
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

    counter: 0,

    lstSecurityLevel:[],

    copyFromUser: null,
    copyToUser: null,

    dsoUpdateUserData:{
      type: 'process',
      updpro: 'sys_syse004_copy_user_role',
    },
  }),

  mounted() {
    this.prepareCommonData();
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
    },
    headers() {
      return [
        { field: 'EMP_ID', title: this.$t('emp_id'), width: '100', dataType: "dialog", editable: false },
        { field: 'EMP_NAME', title: this.$t('emp_name'), width: '100', dataType: "string", editable: true },
        { field: 'USER_ID', title: this.$t('user_id'), width: '100', dataType: "string", editable: true },
        { field: 'USER_PW', title: this.$t('user_pw'), width: '100', dataType: "password", editable: true },
        { field: 'PARTNER_NAME', title: this.$t('partner_name'), width: '100', dataType: "string", editable: false },
        { field: 'MOBILE', title: this.$t('mobile'), width: '100', dataType: "string", editable: true },
        { field: 'LIVING_ADDR', title: this.$t('living_addr'), width: '100', dataType: "string", editable: true },
        { 
          field: 'USER_LANGUAGE', title: this.$t('user_language'), width: '100', dataType: "string", editable: true,
          lookup: { 
            dataSource: this._languages, 
            displayExpr: 'NAME', 
            valueExpr: 'CODE' 
          }
        },
        { field: 'USE_YN', title: this.$t('active'), width: '100', dataType: "checkbox", editable: true },
        { field: 'SYSADMIN_YN', title: this.$t('sysadmin'), width: '100', dataType: "checkbox", editable: true },
        { 
          field: 'AC_LEVEL', title: this.$t('ac_level'), width: '120', dataType: "list", editable: true,
          lookup: { 
            dataSource: this.lstSecurityLevel, 
            displayExpr: 'NAME', 
            valueExpr: 'CODE' 
          }
        },
        { 
          field: 'FU_LEVEL', title: this.$t('fu_level'), width: '120', dataType: "list", editable: true,
          lookup: { 
            dataSource: this.lstSecurityLevel, 
            displayExpr: 'NAME', 
            valueExpr: 'CODE' 
          }
        },
        { 
          field: 'SA_LEVEL', title: this.$t('sa_level'), width: '120', dataType: "list", editable: true,
          lookup: { 
            dataSource: this.lstSecurityLevel, 
            displayExpr: 'NAME', 
            valueExpr: 'CODE' 
          }
        },
        { 
          field: 'PR_LEVEL', title: this.$t('pr_level'), width: '120', dataType: "list", editable: true,
          lookup: { 
            dataSource: this.lstSecurityLevel, 
            displayExpr: 'NAME', 
            valueExpr: 'CODE' 
          }
        },
        { 
          field: 'IN_LEVEL', title: this.$t('in_level'), width: '120', dataType: "list", editable: true,
          lookup: { 
            dataSource: this.lstSecurityLevel, 
            displayExpr: 'NAME', 
            valueExpr: 'CODE' 
          }
        },
        { 
          field: 'PU_LEVEL', title: this.$t('pu_level'), width: '120', dataType: "list", editable: true,
          lookup: { 
            dataSource: this.lstSecurityLevel, 
            displayExpr: 'NAME', 
            valueExpr: 'CODE' 
          }
        },
        { 
          field: 'HR_LEVEL', title: this.$t('hr_level'), width: '120', dataType: "list", editable: true,
          lookup: { 
            dataSource: this.lstSecurityLevel, 
            displayExpr: 'NAME', 
            valueExpr: 'CODE' 
          }
        },
        { 
          field: 'EI_LEVEL', title: this.$t('ei_level'), width: '120', dataType: "list", editable: true,
          lookup: { 
            dataSource: this.lstSecurityLevel, 
            displayExpr: 'NAME', 
            valueExpr: 'CODE' 
          }
        },
        { field: 'ST_DATE', title: this.$t('st_date'), width: '100', dataType: "date", editable: true },
        { field: 'END_DATE', title: this.$t('end_date'), width: '100', dataType: "date", editable: true }
      ]
    }
  },

  methods: {
    async prepareCommonData(){
      this.lstSecurityLevel = await this._getCommonCode("COBS0010", this.user.TCO_COMPANY_PK);
    },

    searchUser() {
      this.$refs.userDataGrid.loadData();
    },
    
    addNew() {
      this.$refs.userDataGrid.addRowStruct({ 
        PK: null, THR_ABEMP_PK: '', EMP_NAME: '', USER_ID: '', USER_PW: '', TCO_BUSPARTNER_PK: '', PARTNER_NAME: '' , MOBILE: '', LIVING_ADDR: '', USER_LANGUAGE: 'ENG', USE_YN: 'Y', ANNOUNCE_YN: 'N', SYSADMIN_YN: 'N', ST_DATE: '', END_DATE: ''
      });
    },

    changeValue(value, key, pk) {
      this.userList = this.$refs.userDataGrid.getDataSource();
      this.userList.map((item, index) => {
        if(item.PK === pk) {
          this.$set(item, key, value)
          if(item.PK && item._rowstatus !== "i") {
            item._rowstatus = "u"
          }
        }
      });      
      this.$refs.userDataGrid.setDataSource(this.userList);
    },    

    save() {
      this.$refs.userDataGrid.saveData();      
    },

    /* openPasswordDialog(userPK, rowStatus) {
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
              //console.log(this.userList)
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
    }, */

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
      this.userList = this.$refs.userDataGrid.getDataSource();
      const userIdx = this.userList.findIndex(x => x.PK === this.selectedUser.PK)
      if(userIdx > -1) {
        if(!this.userList[userIdx]._rowstatus) {
          this.userList[userIdx]._rowstatus = "u"
        }
        this.userList[userIdx].THR_ABEMP_PK = item.PK
        this.userList[userIdx].EMP_ID = item.EMP_ID
        this.userList[userIdx].EMP_NAME = item.FULL_NAME
      }
      this.$refs.userDataGrid.setDataSource(this.userList);      
    },

    markDeleteItems() {
      this.$refs.userDataGrid.deleteRows();
    },

    openPartnerDialog(item) {
      this.$refs.partnerDialog.dialogIsShow = true;
      this.selectedUser = {...item}
    },

    handleReturnedPartner(item) {
      this.userList = this.$refs.userDataGrid.getDataSource();
      const userIdx = this.userList.findIndex(x => x.PK === this.selectedUser.PK)
      if(userIdx > -1) {
        if(!this.userList[userIdx]._rowstatus) {
          this.userList[userIdx]._rowstatus = "u"
        }
        this.userList[userIdx].TCO_BUSPARTNER_PK = item.PK
        this.userList[userIdx].PARTNER_NAME = item.PARTNER_NAME
      }
      this.$refs.userDataGrid.setDataSource(this.userList); 
    },

    onCellDblClick({ data, column, rowType }) {
      if(rowType === "data") {
        switch (column.datafield) {
          case "EMP_ID":
            this.openEmployeeDialog(data);
            break;
          /* case "USER_PW":
            this.openPasswordDialog(data.PK, data._rowstatus)
            break; */
          case "PARTNER_NAME":
            this.openPartnerDialog(data);
            break;
          default:
            break;
        }
      }
    },

    async onCopy(){
      if(this.copyFromUser == null || this.copyFromUser == "") {
        this.showNotification("warning", this.$t("please_input_from_user"), "");
        return;
      }

      if(this.copyToUser == null || this.copyToUser == "") {
        this.showNotification("warning", this.$t("please_input_to_user"), "");
        return;
      }

      if(this.copyFromUser == this.copyToUser ) {
        this.showNotification("warning", this.$t("from_user_and_to_user_are_same_cannot_copy_role"), "");
        return;
      }

      await Swal.fire({
        title: this.$t('do_you_want_to_copy_role'),
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: this.$t('keep_role'),
        denyButtonText: this.$t('delete_old_role')
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          this.onCopyProcess(true);
        } else if (result.isDenied) {
          this.onCopyProcess(false);
        }
      });
    },

    async onCopyProcess(keepRole = false){
      this.dsoUpdateUserData.para = [this.copyFromUser, this.copyToUser, keepRole ? 0 : 1];

      const result = await this._dsoCall(this.dsoUpdateUserData, 'process', true);
      if(result) { };
    },
  }
}
</script>
