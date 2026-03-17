<template>
  <v-dialog id="performance-dialog" max-width="1000" v-model="dialogIsShow">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ $t("performance-dialog", "acnt") }}</span>
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
                    <v-row no-gutters>
                      <v-col cols="3" class="pl-5 pt-3">
                          <BaseSelect :label="$t('company')" v-model="selectedCompany" :lstData="companyList" item-text="TEXT" item-value="PK" />
                      </v-col>
                      <v-col cols="2" class="pl-5 pt-3">
                          <BaseSelect :label="$t('slip_status')" v-model="lstSlipStatus" :lstData="typeSlipStatus" :text_all="$t('all')" item-text="NAME" item-value="PK" />
                      </v-col>
                      <v-col cols="2" class="pl-5 pt-3">
                          <BaseInput :label="$t('create_by')" v-model="txt_crt_by" />
                      </v-col>
                      <v-col cols="2" class="pl-5 pt-3">
                          <BaseInput :label="$t('seq')" v-model="txt_seq" />
                      </v-col>
                      <v-col cols="2" class="pt-3 text-right">
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
                    <v-row no-gutters>
                      <v-col cols="3" class="pl-5 pt-3">
                          <v-row align="center" justify="space-between" no-gutters>
                              <v-col md="6">
                                  <BaseDatePicker :label="$t('from_date')" start v-model="from_date" readonly></BaseDatePicker>
                              </v-col>
                              <v-col md="6"  class="pl-5">
                                  <BaseDatePicker :label="$t('to_date')" end v-model="to_date" readonly></BaseDatePicker>
                              </v-col>
                          </v-row>
                      </v-col>
                      <v-col cols="2" class="pl-5 pt-3">
                          <BaseSelect :label="$t('voucher_type')" v-model="lstVoucherType" :lstData="typeVoucherList" :text_all="$t('all')" item-text="NAME" item-value="CODE" />
                      </v-col>
                      <v-col cols="2" class="pl-5 pt-3">
                        <BaseInput :label="$t('voucher_no')" v-model="txtvoucher" />
                      </v-col> 
                      <v-col cols="2" class="pl-5 pt-3">
                        <BaseInput :label="$t('desc')" v-model="txt_desc" />
                      </v-col> 
                      <v-col cols="3" class="pl-5 pt-5"> 
                        <div class="error--text font-weight-bold">{{ $t('total_rows') }}: {{ total_rows }}</div>
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
                    ref="grdData" 
                    :select_mode="selectMode" 
                    :header="defaultHeaders" 
                    sel_procedure="AC_SEL_6021030_POPUP_3" 
                    upd_procedure="" 
                    :update_paras="[ ]" 
                    :filter_paras="[
                      this.selectedCompany,
                      this.tac_abtrtype_pk_per,
                      this.from_date,
                      this.to_date,
                      this.lstSlipStatus,
                      this.txt_seq,
                      this.txtvoucher,
                      this.lstVoucherType, 
                      this.txt_crt_by,
                      this.txt_desc,
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
  name: "performance-dialog",

  props: {
    multiSelectMode: {
      type: Boolean,
      default: false,
    },
    sel_from_date: { type: String ,default: ""},
    sel_to_date: { type: String ,default: ""},
    p_tac_abtrtype_pk_per:{ type: Number, default: 0 },
  },

  data: () => ({
    dialogIsShow: false,
    dataList: [],
    selectedDatas: [],
    month: new Date().toISOString().substr(0, 7),
    menu: false,
    modal: false,

    selectedCompany: "",
    companyList : [],
    year: "",
    from_week : "",
    to_week : "",
    selectMode :"",
    txt_crt_by :"",
    txt_seq :"",
    from_date :"",
    to_date :"",
    lstVoucherType :"",
    typeVoucherList : [],
    txtvoucher :"",
    lstSlipStatus :"",
    typeSlipStatus : [],
    total_rows :"",
    txt_desc :"",
    tac_abtrtype_pk_per: "",
    
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
          this.tac_abtrtype_pk_per = this.p_tac_abtrtype_pk_per;
      }
    }
  },
  computed: {
    defaultHeaders() {
      if (this.headers) return this.headers;
      return [
        {
          dataField: "PK",
          caption: this.$t("seq"),
          width: "100",
        },
        {
          dataField: "VOUCHERNO",
          caption: this.$t("voucher_no"),
          width: "120",
        },
        {
          dataField: "TR_DATE",
          caption: this.$t("tr_date"),
          width: "80",
        },
        {
          dataField: "TR_TYPE",
          caption: this.$t("tr_type"),
          width: "100",
        },
        {
          dataField: "TR_TPNM",
          caption: this.$t("tr_name"),
          width: "80",
        },
        {
          dataField: "ACC_CODE_DR",
          caption: this.$t("account_debit"),
          width: "100",
        },
        {
          dataField: "ACC_CODE_CR",
          caption: this.$t("account_credit"),
          width: "100",
        },
        {
          dataField: "TR_BOOKAMT",
          caption: this.$t("amount"),
          width: "100",
          dataType: 'number',
          formatFloat: 0,
        },
        {
          dataField: "REMARK",
          caption: this.$t("desc"),
          width: "120",
        },
        {
          dataField: "TR_STATUS",
          caption: this.$t("status"),
          width: "80",
          lookup: { 
                  dataSource: this.typeSlipStatus, 
                  displayExpr:'NAME', 
                  valueExpr: 'PK' 
              },
        },
        {
          dataField: "CRT_BY",
          caption: this.$t("prps_by"),
          width: "130",
        },
        {
          dataField: "CANCEL_CAUSE",
          caption: this.$t("cancel_cause"),
          width: "130",
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
        const dso_company_list = { type: 'list', selpro: 'SYS_SEL_LIST_COMPANY', para: [ this.user.PK ] }
          this.companyList = await this._dsoCall(dso_company_list, 'select', false)
          this.selectedCompany = this.companyList[0].PK;

        const dso_InOut_type_list = { 
                            type: 'list', selpro: 'SYS_SEL_BUDGET_LIST_CODE', 
                            para: ["IO",this.user.TCO_COMPANY_PK, "ACBD0010"] }
        this.typeInOutList = await this._dsoCall(dso_InOut_type_list, 'select', false)
        this.lstBudgetType = '';

        const dso_Voucher_type_list = { 
                  type: 'list', selpro: 'SYS_SEL_BUDGET_LIST_CODE', 
                  para: ["VC_TYPE",this.user.TCO_COMPANY_PK, "ACBG0130"] }
          this.typeVoucherList = await this._dsoCall(dso_Voucher_type_list, 'select', false)
          this.lstVoucherType = this.typeVoucherList[0].CODE;

        const dso_slip_status_list = { 
                  type: 'list', selpro: 'SYS_SEL_BUDGET_LIST_CODE', 
                  para: ["SLIP_STT",this.user.TCO_COMPANY_PK, ""] }
          this.typeSlipStatus = await this._dsoCall(dso_slip_status_list, 'select', false)
    },
    async onSearch() {
      this.$refs.grdData.loadData();
      this.OnSum();
    },
    OnSum(){
      this.total_rows = "0 "+ this.$t("row(s)");
      setTimeout(() => {
            this.total_rows = this.$refs.grdData.getDataSource().length + " "+ this.$t("row(s)");
      }, 1000);
      console.log(this.total_rows);
    },
    onSelectionChanged({ selectedRowsData }) {
      this.selectedDatas = selectedRowsData;
    },
    onSelectSingle({ data }) {   
      this.onSelectMultiple();
    },
    callBackData(rtn_data) {
      this.$emit("callBackData", rtn_data);
      this.$refs.grdData.Clear();
      this.dialogIsShow = false;
    },
    onSelectMultiple() {
      let rtn_data = this.multiSelectMode
        ? this.selectedDatas
        : this.selectedDatas[0];
      this.returnPerformanceDialog(rtn_data);
      this.callBackData(rtn_data);  
    },

    returnPerformanceDialog(datas) {
      this.$emit("returnPerformanceDialog", datas);
      this.dialogIsShow = false;
    },
  },
};
</script>
