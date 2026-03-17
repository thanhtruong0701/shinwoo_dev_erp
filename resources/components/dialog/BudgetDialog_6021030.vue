<template>
  <v-dialog id="employee-dialog" max-width="1000" v-model="dialogIsShow">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ $t("budget_type_6021030", "acnt") }}</span>
        <v-spacer></v-spacer>
        <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
      </v-card-title>
      <v-container fluid class="pt-0">
        <v-row no-gutters align="center" justify="space-between">
          <v-col cols="12">
            <!-- Search Panel -->
            <v-row align="center" justify="space-between">
              <v-col cols="12">
                <v-card outlined tile>
                  <v-container fluid>
                    <v-row dense align="center" justify="space-between">
                      <v-col cols="2" class="pl-5 pt-3">
                        <BaseSelect :label="$t('budget_type')" v-model="lstBudgetType" :lstData="typeInOutList" :text_all="$t('all')" item-text="NAME" item-value="CODE" />
                      </v-col>
                      <v-col cols="3" class="pl-5 pt-3">
                        <BaseInput :label="$t('budget_name')" v-model="txt_budget_name" />
                      </v-col> 
                      <v-col cols="3" class="pl-5 pt-3">
                          <v-row align="center" justify="space-between" no-gutters>
                              <v-col md="6">
                                  <BaseDatePicker :label="$t('from_date')" v-model="from_date" ></BaseDatePicker>
                              </v-col>
                              <v-col md="6"  class="pl-5">
                                  <BaseDatePicker :label="$t('to_date')" v-model="to_date" ></BaseDatePicker>
                              </v-col>
                          </v-row>
                      </v-col>
                      <v-col cols="4" class="text-right">
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <v-btn
                              icon
                              tile
                              :color="currentTheme"
                              :disabled="isProcessing"
                              @click="onSearch"
                              v-on="on"
                            >
                              <v-icon>mdi-magnify</v-icon>
                            </v-btn>
                          </template>
                          <span>{{ $t("search") }}</span>
                        </v-tooltip>
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <v-btn
                              v-if="multiSelectMode"
                              icon
                              tile
                              color="success"
                              :disabled="isProcessing"
                              @click="onSelectMultiple"
                              v-on="on"
                            >
                              <v-icon>mdi-check-bold</v-icon>
                            </v-btn>
                          </template>
                          <span>{{ $t("select") }}</span>
                        </v-tooltip>
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
                  <DataGridView 
                    ref="grdBudgetType" 
                    :select_mode="selectMode" 
                    :header="defaultHeaders" 
                    sel_procedure="AC_SEL_6021030_POPUP_1" 
                    upd_procedure="" 
                    :update_paras="[ ]" 
                    :filter_paras="[
                      this.TCO_COMPANY_PK,
                      this.year,
                      this.from_week,
                      this.to_week,
                      this.lstBudgetType, 
                      this.txt_budget_name,
                      this.from_date,
                      this.to_date,
                    ]" 
                    :is_allow_paste="false" 
                    @onSelectionChanged="onSelectionChanged"
                    @cellDblClick="onSelectSingle"
                    :max_height="limitHeight" />
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
  name: "budget-dialog-6021030",
  
  props: {
    multiSelectMode: {
      type: Boolean,
      default: true,
    },
    companyPK: { type: Number, default: 0 },
    dt_year: { type: String ,default: ""},
    sel_from_week: { type: String ,default: ""},
    sel_to_week: { type: String ,default: ""},
    sel_from_date: { type: String ,default: ""},
    sel_to_date: { type: String ,default: ""},
    
  },
  // props:["multiSelectMode","companyPK","dt_year","sel_from_week","sel_to_week","sel_from_date","sel_to_date"],
  data: () => ({
    dialogIsShow: false,
    dataList: [],
    selectedDatas: [],
    month: new Date().toISOString().substr(0, 7),
    menu: false,
    modal: false,

    lstBudgetType :"", 
    typeInOutList :[],
    TCO_COMPANY_PK: "",
    year: "",
    txt_budget_name : "",
    from_date: "",
    to_date: "",
    from_week : "",
    to_week : "",
    selectMode :"",
  }),
  async created() {
    this.getListCodes();
  },
  watch: {
    multiSelectMode: {
      immediate: true,
      handler(val) {
        if (val) {
          this.selectMode = "Multiple";
        } else {
          this.selectMode = "Single";
        }
      },
    },
    dialogIsShow(val) {
      if(val === true) {
          
          this.dataList= [];
          this.selectedDatas=[]; 
          this.month=new Date().toISOString().substr(0, 7);
          this.menu= false,
          this.modal= false,

          this.lstBudgetType   = "";
          this.txt_budget_name = "";
          this.TCO_COMPANY_PK = this.companyPK;
          this.year           = this.dt_year
          this.from_week      = this.sel_from_week;
          this.to_week        = this.sel_to_week;
          this.from_date      = this.sel_from_date;
          this.to_date        = this.sel_to_date;
      }
    }
  },
  computed: {
    defaultHeaders() {
      if (this.headers) return this.headers;
      return [
        {
          dataField: "CAR_DATE",
          caption: this.$t("date"),
          width: "100", 
          dataType: "date",
          format: this.curLang.DATE_FORMAT,
        },
        {
          dataField: "WEEK_NO",
          caption: this.$t("week"),
          width: "100",
        },
        {
          dataField: "BUDGET_CODE",
          caption: this.$t("budget_code"),
          width: "100",
        },
        {
          dataField: "BUDGET_NM",
          caption: this.$t("budget_name"),
          width: "130",
        },
        {
          dataField: "INOUT_TYPE",
          caption: this.$t("budget_type"),
          width: "100",
          lookup: { 
              dataSource: this.typeInOutList, 
              displayExpr:'NAME', 
              valueExpr: 'CODE' 
           },
        },
        {
          dataField: "ACC_CODE_DR",
          caption: this.$t("accout_debit"),
          width: "80",
        },
        {
          dataField: "ACC_CODE_CR",
          caption: this.$t("accout_credit"),
          width: "80",
        },
        {
          dataField: "DESCRIPTION_NM",
          caption: this.$t("desc_name"),
          width: "130",
        },
        {
          dataField: "DESCRIPTION_KNM",
          caption: this.$t("desc_fname"),
          width: "130",
        },
        {
          dataField: "DESCRIPTION_LNM",
          caption: this.$t("desc_lname"),
          width: "130",
        },
        {
          dataField: "BUDGET_DT",
          caption: this.$t("budget_date"),
          width: "130",
          dataType: "date",
          format: this.curLang.DATE_FORMAT,
        }
      ];
    },
    user() {
      return this.$store.getters["auth/user"];
    },
    limitHeight() {
      return this.windowHeight - 320;
    },
  },

  methods: {
    async getListCodes() {
        const dso_InOut_type_list = { 
                            type: 'list', selpro: 'SYS_SEL_BUDGET_LIST_CODE', 
                            para: ["IO",this.user.TCO_COMPANY_PK, "ACBD0010"] }
        this.typeInOutList = await this._dsoCall(dso_InOut_type_list, 'select', false)
        //this.lstBudgetType = "";
    },
    async onSearch() {
      this.$refs.grdBudgetType.loadData();
    },

    onSelectionChanged({ selectedRowsData }) {
      this.selectedDatas = selectedRowsData;
    },
    onSelectSingle({ data }) {   
      this.onSelectMultiple();
    },
    callBackData(rtn_data) {
      this.$emit("callBackData", rtn_data);
      this.$refs.grdBudgetType.Clear();
      this.dialogIsShow = false;
    },
    onSelectMultiple() {
      let rtn_data = this.multiSelectMode
        ? this.selectedDatas
        : this.selectedDatas[0];
      this.returnBudgetType_6021030(rtn_data);
      this.callBackData(rtn_data);  
    },

    returnBudgetType_6021030(datas) {
      this.$emit("returnBudgetType_6021030", datas);
      this.dialogIsShow = false;
    },
  },
};
</script>
