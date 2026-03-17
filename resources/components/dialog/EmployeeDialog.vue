<template>
  <v-dialog id="employee-dialog" max-width="1000" v-model="dialogIsShow">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ $t("employee_list", "common") }}</span>
        <v-spacer></v-spacer>
        <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
      </v-card-title>
      <v-container fluid class="pt-0">
        <v-row no-gutters>
          <v-col md="12">
            <!-- Search Panel -->
            <v-row align="center" justify="space-between">
              <v-col md="12">
                <v-card outlined tile>
                  <v-container fluid>
                    <v-row dense align="center" >
                      <v-col md="4">
                        <BaseSelect :label="$t('company')" v-model="selectedCompany" :lstData="companyList" item-text="TEXT" item-value="PK"/>
                      </v-col>
                      <v-col md="4">
                        <BaseSelect :label="$t('organization')" v-model="selectedOrg" :lstData="orgList" item-text="TEXT" item-value="PK" :text_all="$t('all')"/>
                      </v-col>
                      <v-col md="4">
                        <BaseSelect :label="$t('work_group')" v-model="selectedWg" :lstData="wgList" item-text="TEXT" item-value="PK" :text_all="$t('all')"/>
                      </v-col>
                    </v-row>
                    <v-row dense align="center" class="pt-1" >
                      <v-col md="8">
                        <BaseInput :label="$t('input_search')" v-model="searchText" @keyPressEnter="onSearch"/>
                      </v-col>
                      <v-col md="2">
                        <BaseSelect :label="$t('status')" v-model="selectedStatus" :lstData="statusList" item-text="NAME" item-value="CODE" :text_all="$t('all')"/>
                      </v-col>
                      <v-col md="2" class="text-right">
                        <div class="d-flex justify-center">
                          <BaseButton btn_type="icon" icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="onSearch" />
                          <BaseButton btn_type="icon" icon_type="select" :btn_text="$t('select')" :disabled="isProcessing" @onclick="callBackData" />
                        </div>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card>
              </v-col>
            </v-row>

            <!-- Table -->
            <v-row align="center" justify="center">
              <v-col md="12" class="py-0">
                <v-card outlined tile v-resize="onResize">
                  <DataGridView ref="employeeGrid" :select_mode="multiSelectMode ? (hideSelect ?'MultipleHideBox' : 'Multiple' )  : 'Single'" :max_height="limitHeight" :header="headerDetail" sel_procedure="SYS_SEL_EMPLOYEE_DIALOG" :filter_paras="[ selectedCompany, !selectedOrg ? 'ALL' : selectedOrg, !selectedWg ? 'ALL' : selectedWg, !selectedStatus ? 'ALL' : selectedStatus, searchText ? searchText : '', p_trtype_pk ]" @cellDblClick="callBackData" />
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "employee-dialog",

  props: {
    headers: {
      type: Array
    },
    multiSelectMode: {
      type: Boolean,
      default: false
    },
    companyPK: {
        type: Number,
        default: 0
    },
    hideSelect:{
      type: Boolean,
      default: true
    },
     p_store: {
      type: String , default: 'SYS_SEL_EMPLOYEE_DIALOG'
    },
  },

  data: () => ({
		headerDetail:[],
    dialogIsShow: false,
    dataList: [],
    selectedDatas: [],

    companyList: [],
    selectedCompany: "",

    orgList: [],
    selectedOrg: "",

    wgList: [],
    selectedWg: "",

    statusList:[],
    selectedStatus:"A",

    searchText: "",

    p_trtype_pk:0,
  }),

  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
    limitHeight() {
      return this.windowHeight - 320;
    }
		},
	created(){
		this.initHeader()
	},
  watch: {
    dialogIsShow(val) {
      if (val === true) {
        // if(this.user.TCO_COMPANY_PK != null)
        // {
        //  this.selectedCompany = this.user.TCO_COMPANY_PK;
        // }  console.log('vng-237||-_-: > file: EmployeeDialog.vue> companyPK', this.companyPK);
        if (this.company != 0) {
            // this.selectedCompany = this.companyPK;
            this.selectedCompany = this.user.TCO_COMPANY_PK;
        }
        this.getCompanyList();
      }
      else {
         this.$refs.employeeGrid.Clear();
      }
    },
    
    selectedCompany(val) {
      if (val) {
        this.getOrgList();
        this.getWgList();
        this.prepareCommonData();
      }
    },
    selectedOrg(val) {
      if (val) this.onSearch();
    },
    selectedWg(val) {
      if (val) this.onSearch();
    },
    p_trtype_pk(val)
    {
        if(val == null || val =="" || val == undefined)
        {
          val = 0;
        }
    }
  },

  methods: {
		initHeader(){
			this.headerDetail = [ { dataField: 'EMP_ID', caption: this.$t('emp_id'), }, { dataField: 'FULL_NAME', caption: this.$t('full_name'), }, { dataField: 'ORG_NM', caption: this.$t('org_nm'), }, { dataField: 'TEL', caption: this.$t('tel'), } ]
		},
    async prepareCommonData(){

      let parentCodes = [
          "HR0009", "HR0022", "HR0017"
      ] ;

      let listCommonCode = await this._getCommonCode2( parentCodes,  this.user.TCO_COMPANY_PK  );

      this.statusList = listCommonCode[1];

    },
    // async getCompanyList() {
    //   this.companyList = await this._getCompany();
    // },
    async getCompanyList() {
      const dso = {
        type: "list",
        selpro: "sys_sel_list_company",
        para: [this.user.PK]
      };
      const result = await this._dsoCall(dso, "select", false);
      if (result) {
        this.companyList = result;
        this.selectedCompany=this.companyList[0].PK;
      } else {
        this.companyList = [];
      }
    },

    async getOrgList() {
      this.orgList = await this._getOrgByUser(this.user.PK);
    },

    async getWgList() {
      this.wgList = await this._getWorkGroup(this.selectedCompany);
    },

    async onSearch() {
      this.$refs.employeeGrid.loadData();
    },

    callBackData() {
      this.$emit("callBackData", this.multiSelectMode ? this.$refs.employeeGrid.selectedDatas : this.$refs.employeeGrid.selectedDatas[0]);
      this.dialogIsShow = false;
    }
  }
};
</script>
