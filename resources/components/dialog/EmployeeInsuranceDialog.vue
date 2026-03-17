<template>
  <v-dialog id="employee-dialog" max-width="1400" v-model="dialogIsShow">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ $t("employee_list_for_insurance", "common") }}</span>
        <v-spacer></v-spacer>
        <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
      </v-card-title>
      <v-container fluid class="pt-0">
        <v-row no-gutters>
          <v-col cols="12">
            <!-- Search Panel -->
            <v-row align="center" justify="space-between">
              <v-col cols="12">
                <v-card outlined tile>
                  <v-container fluid>
                    <v-row dense align="center" >
                      <v-col cols="4">
                        <v-select
                          dense
                          cache-items
                          hide-details
                          outlined
                          item-value="PK"
                          item-text="TEXT"
                          :label="$t('company', 'common')"
                          :items="companyList"
                          v-model="selectedCompany"
                        ></v-select>
                      </v-col>
                      <v-col cols="4">
                        <v-select
                          clearable
                          dense
                          cache-items
                          hide-details
                          outlined
                          item-value="PK"
                          item-text="TEXT"
                          :label="$t('organization', 'common')"
                          :items="orgList"
                          v-model="selectedOrg"
                        ></v-select>
                      </v-col>
                      <v-col cols="3">
                        <v-select
                          clearable
                          dense
                          cache-items
                          hide-details
                          outlined
                          item-value="PK"
                          item-text="TEXT"
                          :label="$t('work_group', 'common')"
                          :items="wgList"
                          v-model="selectedWg"
                        ></v-select>
                      </v-col>
                         <v-col cols="1" class="text-right">
                        <v-btn
                          icon
                          tile
                          :color="currentTheme"
                          :disabled="isProcessing"
                          @click="onSearch"
                        >
                          <v-icon>mdi-magnify</v-icon>
                        </v-btn>
                        <v-btn
                          icon
                          tile
                          color="success"
                          @click="onSelectMultiple"
                          v-if="multiSelectMode"
                        >
                          <v-icon>mdi-check-bold</v-icon>
                        </v-btn>
                      </v-col>
                    </v-row>
                    <v-row dense align="center" >
                      <v-col cols="12" lg="2">
                        <v-select dense cache-items hide-details outlined 
                            item-value="CODE" item-text="NAME" :label="$t('status')" 
                            :items="statusList" v-model="selectedStatus" 
                          >
                        </v-select>
                      </v-col>
                      <v-col cols="12" lg="2">
                        <v-text-field
                          clearable
                          dense
                          hide-details
                          outlined
                          :label="$t('input_search', 'common')"
                          @keypress.enter="onSearch"
                          v-model="searchText"
                        ></v-text-field>
                      </v-col>
                         <v-col cols="12" lg="2">
                        <v-select dense cache-items hide-details outlined 
                            item-value="CODE" item-text="NAME" :label="$t('absence_type')" 
                            :items="absList" v-model="selectedAbs" 
                          >
                        </v-select>
                      </v-col>
                         <v-col cols="12" lg="2">
                        <v-text-field
                          clearable
                          dense
                          hide-details
                          outlined
                          :label="$t('abs_times(>=)', 'common')"
                          @keypress.enter="onSearch"
                          v-model="searchAbstimes"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" lg="3">
                        <v-row dense align="center" >
                            <v-col cols="12" lg="6">
                        <BaseDatePicker v-model="selectedFrom"
                                            :label="$t('abs_from')"
                                            date outlined >
                            </BaseDatePicker>
                     </v-col>
                        <v-col cols="12" lg="6">
                        <BaseDatePicker v-model="selectedTo"
                                            :label="$t('abs_from')"
                                            date outlined >
                            </BaseDatePicker>
                            </v-col>
                        </v-row>

                      </v-col>
                    </v-row>
                  </v-container>
                </v-card>
              </v-col>
            </v-row>

            <!-- Table -->
            <v-row align="center" justify="center">
              <v-col cols="12" class="py-0">
                <v-card outlined tile v-resize="onResize">
                  <DxDataGrid
                    ref="employeeGrid"
                    column-resizing-mode="widget"
                    key-expr="PK"
                    :allow-column-resizing="true"
                    :column-auto-width="$vuetify.breakpoint.smAndDown"
                    :data-source="dataList"
                    :height="limitHeight"
                    :show-borders="true"
                    :show-column-lines="true"
                    :show-row-lines="true"
                    @selection-changed="onSelectionChanged"
                    :onRowDblClick="onSelectSingle"
                  >
                    <DxColumn
                      v-for="(item, index) in defaultHeaders"
                      :data-field="item.field"
                      :caption="item.caption"
                      :key="index"
                    ></DxColumn>

                    <DxPaging :page-size="dataList.length" />
                    <DxSelection mode="multiple" v-if="multiSelectMode" />
                    <DxSelection mode="single" v-if="!multiSelectMode" />
                  </DxDataGrid>
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
     p_store: {
      type: String , default: 'SYS_SEL_EMPLOYEE_DIALOG_INS'
    },
     params: {
                type: Array
            },
  },

  data: () => ({
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

    absList:[],
    selectedAbs:"",

    searchAbstimes:"",

    searchText: "",
    selectedFrom:"",
    selectedTo:"",
    p_trtype_pk:0,
  }),

  computed: {
    defaultHeaders() {
      if (this.headers) return this.headers;

      return [ 
        {
          field: "ORG_NM",
          caption: this.$t("org_nm", "common"),
          width: "100"
        },
        {
          field: "WORKGROUP_NM",
          caption: this.$t("workgroup_nm", "common"),
          width: "100"
        },
        {
          field: "EMP_ID",
          caption: this.$t("emp_id", "common"),
          width: "50"
        },
        {
          field: "FULL_NAME",
          caption: this.$t("full_name", "common"),
          width: "500"
        },
     {
          field: "SEX",
          caption: this.$t("sex", "common"),
          width: "150"
        },
        {
          field: "JOIN_DT",
          caption: this.$t("join_dt", "common"),
          width: "50"
        },
        {
          field: "BIRTH_DT",
          caption: this.$t("birth_dt", "common"),
          width: "50"
        },
        {
          field: "TEL",
          caption: this.$t("tel", "common"),
          width: "80"
        },
        {
          field: "NEW_SAL",
          caption: this.$t("new_sal", "common"),
          width: "80",
            type: "number"
        },
      ];
    },
    user() {
      return this.$store.getters["auth/user"];
    },
    limitHeight() {
      return this.windowHeight - 320;
    }
  },

  watch: {
    dialogIsShow(val) {
      if (val === true) {
        if(this.user.TCO_COMPANY_PK != null)
        {
         this.selectedCompany = this.user.TCO_COMPANY_PK;
         this.searchText="";
         this.selectedOrg="ALL";
         this.selectedWg="ALL";
        }
        this.getCompanyList();
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
    async prepareCommonData(){

      let parentCodes = [
          "HR0009", "HR0022", "HR0017","HR0003"
      ] ;

      let listCommonCode = await this._getCommonCode2( parentCodes,  this.user.TCO_COMPANY_PK  );

      this.statusList = listCommonCode[1];
      this.statusList.unshift({ CODE:'ALL', NAME:this.$t("select_all") });
      this.absList= listCommonCode[3];
      this.absList.unshift({ CODE:'ALL', NAME:this.$t("select_all") });
      this.selectedAbs = this.absList[0].CODE;

      this.orgList.unshift({ PK:'ALL', TEXT:this.$t("select_all") });
      this.selectedOrg = this.orgList[0].PK;
      this.wgList.unshift({ PK:'ALL', TEXT:this.$t("select_all") });
      this.selectedWg = this.wgList[0].PK;
    },
    async getCompanyList() {
      const dso = {
        type: "list",
        selpro: "SYS_SEL_LIST_COMPANY",
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
      const dso = {
        type: "list",
        selpro: "SYS_SEL_LIST_ORG",
        // para: [this.user.TCO_COMPANY_PK] thuan.dang 2020812 modify lay tu list user chon
        para: [this.selectedCompany]
      };
      const result = await this._dsoCall(dso, "select", false);
      if (result) {
        this.orgList = result;
        this.selectedOrg=this.orgList[0].PK;
      } else {
        this.orgList = [];
      }
    },

    async getWgList() {
      const dso = {
        type: "list",
        selpro: "SYS_SEL_LIST_WG",
        // para: [this.user.TCO_COMPANY_PK] thuan.dang 2020812 modify lay tu list user chon
        para: [this.selectedCompany]
      };
      this.wgList = await this._dsoCall(dso, "select", false);
    },

    async onSearch() {
      const dso = {
        type: "grid",
        selpro: this.p_store,
        para: [
          this.selectedCompany,
          !this.selectedOrg ? "ALL" : this.selectedOrg,
          !this.selectedWg ? "ALL" : this.selectedWg,
          !this.selectedStatus ? "ALL" : this.selectedStatus,
          this.searchText ? this.searchText : "", 
          this.p_trtype_pk
          ,this.selectedAbs
          ,this.selectedFrom
          ,this.selectedTo
          ,this.searchAbstimes
          ,this.params[0].MONTH

        ]
      };
      this.dataList = await this._dsoCall(dso, "select", false);
    },

    onSelectionChanged({ selectedRowsData }) {
      this.selectedDatas = selectedRowsData;
    },

    onSelectSingle({ data }) {
      this.callBackData(this.p_trtype_pk==0?data:[data]);
    },

    onSelectMultiple() {
      let rtn_data = this.multiSelectMode
        ? this.selectedDatas
        : this.selectedDatas[0];
      this.callBackData(rtn_data);
    },
 
    callBackData(datas) {
      this.$emit("callBackData", datas);
      this.$refs.employeeGrid.instance.clearSelection()
      this.dialogIsShow = false;
    }
  }
};
</script>
