<template>
  <v-dialog id="trial-balances-dialog" max-width="1000" v-model="dialogIsShow">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ $t("trial_balances_popup", "common") }}</span>
        <v-spacer></v-spacer>
        <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
      </v-card-title>
      <v-container fluid class="pa-0" v-resize="onResize">
          <!-- Table -->
          <v-row dense class="pa-1">
              <v-col cols="12">
                  <DataGridView ref="grdData" :header="grdHeader" sel_procedure="AC_SEL_6045085_POPUP_TBL" select_mode="Single" @setDataSource="afterLoad()" :filter_paras="[
                      this.selectedCompany,
                      this.lstBizPlace,
                      this.from_date,
                      this.to_date,
                      this.selectedStatus,
                      this.selectCcy,
                      this.txtConvertExRate,
                      this.txtBookRate,
                      this.txtUnitRate,
                      this.l_tac_kafinanceform_pk,
                    ]" :max_height="limitHeight"/>
              </v-col>
          </v-row>
          <GwLoading :visible="showLoading" />
          <!-- <daily-sl-dialog ref="dailySlDialog" :companyPK="selectedCompany" :accountItem="accountItem" :fromDate="from_date" :toDate="to_date" :status="selectedStatus" ccy="" :bizPlace="lstBizPlace"></daily-sl-dialog> -->
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "trial-balances-dialog",
  components: {
    GwLoading: () => import("@/components/control/GwLoading")
  },

  props: {
    headers: {
      type: Array
    },
    hideSelect:{
      type: Boolean,
      default: true
    },
    companyPK: {
       type: [String, Number],
        default: 0
    },
    bizPlacePK: {
        type: [String, Number],
        default: 0
    },
    p_tac_kafinanceform_pk: {
        type: Number,
        default: 0
    },
    p_from_date: {
      type: String , default: ""
    },
    p_to_date: {
      type: String , default: ""
    },
    p_status: {
      type: String , default: ""
    },
    p_lang: {
      type: String , default: ""
    },
    p_convert_exrate: {
        type: [String, Number], default: "0"
    },
    p_ccy: {
        type: [String, Number], default: ""
    },
    p_unit: {
        type: [String, Number], default: "0"
    },
    p_book_exrate: {
        type: [String, Number], default: "0"
    },

  },
    layout: "default",
    middleware: "user",

    components: {
        accountDialog: () => import("@/components/dialog/AccountDialog"),
        datePicker: () => import("@/components/control/DatePicker"),
        DailySlDialog: () => import("@/components/dialog/DailySlDialog")
    },
    data: () => ({
        dialogIsShow: false,
        l_tac_kafinanceform_pk : null,
        selectedCompany:  "",
        lstBizPlace:  "",
        from_date:  "",
        to_date:  "",
        selectedStatus:  "",
        selectCcy:  "",
        txtConvertExRate:  "",
        txtUnitRate:  "",
        txtBookRate:  "",
        selectedLanguage : "",
        showLoading: false,
    }),

    watch: {
      dialogIsShow(val) {
          if (val === true) {
              this.l_tac_kafinanceform_pk = this.p_tac_kafinanceform_pk;
              this.selectedCompany = this.companyPK;  
              this.lstBizPlace = this.bizPlacePK;
              this.from_date = this.p_from_date;  
              this.to_date = this.p_to_date;
              this.selectedStatus = this.p_status;  
              this.selectCcy = this.p_ccy;
              this.txtConvertExRate = this.p_convert_exrate; 
              this.txtBookRate = this.p_book_exrate; 
              this.txtUnitRate = this.p_unit; 
              this.selectedLanguage = this.p_lang; 
              this.search();
          }
          else {
            this.$refs.grdData.Clear();
          }
        },
    },
    async created() {
    },
    computed: {
        limitHeight() {
            return Math.floor(this.formContainerHeight * 0.8);
        },
        user() {
            return this.$store.getters["auth/user"];
        },
        grdHeader() {
            let head1 = [];
            self = this;
            if (this.selectedLanguage == "ENG") {
                head1 = [{
                        dataField: "AC_CD",
                        caption: this.$t("account_code"),
                        width: "100",
                        cellclassname: this.cellClassName
                    },
                    {
                        dataField: "AC_NM",
                        caption: this.$t("account_name"),
                        width: "200",
                        cellclassname: this.cellClassName
                    },
                ];
            } else if (this.selectedLanguage == "VIE") {
                head1 = [{
                        dataField: "AC_CD",
                        caption: this.$t("account_code"),
                        width: "100",
                        cellclassname: this.cellClassName
                    },
                    {
                        dataField: "AC_LNM",
                        caption: this.$t("account_name_local"),
                        width: "200",
                        cellclassname: this.cellClassName
                    },
                ];
            } else if (this.selectedLanguage == "KOR") {
                head1 = [{
                        dataField: "AC_CD",
                        caption: this.$t("account_code"),
                        width: "100",
                        cellclassname: this.cellClassName
                    },
                    {
                        dataField: "AC_FNM",
                        caption: this.$t("account_name_foreign"),
                        width: "200",
                        cellclassname: this.cellClassName
                    },
                ];
            } else if (this.selectedLanguage == "ENG-VIE") {
                head1 = [{
                        dataField: "AC_CD",
                        caption: this.$t("account_code"),
                        width: "100",
                        cellclassname: this.cellClassName
                    },
                    {
                        dataField: "AC_NM",
                        caption: this.$t("account_name_foreign"),
                        width: "200",
                        cellclassname: this.cellClassName
                    },
                    {
                        dataField: "AC_LNM",
                        caption: this.$t("account_name_local"),
                        width: "200",
                        cellclassname: this.cellClassName
                    },
                ];
            } else if (this.selectedLanguage == "ENG-KOR") {
                head1 = [{
                        dataField: "AC_CD",
                        caption: this.$t("account_code"),
                        width: "100",
                        cellclassname: this.cellClassName
                    },
                    {
                        dataField: "AC_NM",
                        caption: this.$t("account_name_foreign"),
                        width: "200",
                        cellclassname: this.cellClassName
                    },
                    {
                        dataField: "AC_FNM",
                        caption: this.$t("account_name_foreign"),
                        width: "200",
                        cellclassname: this.cellClassName
                    },
                ];
            } else if (this.selectedLanguage == "KOR-VIE") {
                head1 = [{
                        dataField: "AC_CD",
                        caption: this.$t("account_code"),
                        width: "100",
                        cellclassname: this.cellClassName
                    },
                    {
                        dataField: "AC_FNM",
                        caption: this.$t("account_name_foreign"),
                        width: "200",
                        cellclassname: this.cellClassName
                    },
                    {
                        dataField: "AC_LNM",
                        caption: this.$t("account_name_local"),
                        width: "200",
                        cellclassname: this.cellClassName
                    },
                ];
            } else if (this.selectedLanguage == "ENG-VIE-KOR") {
                head1 = [{
                        dataField: "AC_CD",
                        caption: this.$t("account_code"),
                        width: "100",
                        cellclassname: this.cellClassName
                    },
                    {
                        dataField: "AC_NM",
                        caption: this.$t("account_name_foreign"),
                        width: "200",
                        cellclassname: this.cellClassName
                    },
                    {
                        dataField: "AC_LNM",
                        caption: this.$t("account_name_local"),
                        width: "200",
                        cellclassname: this.cellClassName
                    },
                    {
                        dataField: "AC_FNM",
                        caption: this.$t("account_name_foreign"),
                        width: "200",
                        cellclassname: this.cellClassName
                    },
                ];
            }
            const head2 = [{
                    dataField: "OPEN_DR",
                    caption: this.$t("open_dr"), 
                    dataType: "number", 
                    formatFloat: 2,
                    width: "160",
                    summaryType:'sum',
                },
                {
                    dataField: "OPEN_CR",
                    caption: this.$t("open_cr"), 
                     dataType: "number", 
                    formatFloat: 2,
                    width: "160",
                    summaryType:'sum',
                },
                {
                    dataField: "END_DR",
                    caption: this.$t("end_dr"), 
                    dataType: "number", 
                    formatFloat: 2,
                    width: "160",
                    summaryType:'sum',
                },
                {
                    dataField: "END_CR",
                    caption: this.$t("end_cr"),
                     dataType: "number", 
                    formatFloat: 2,
                    width: "160",
                    summaryType:'sum',
                },
            ];

            return head1.concat(head2);
        },
    },

    methods: {
        async search() {
            setTimeout(() => {
             this.showLoading = true;
              this.$refs.grdData.loadData();
            }, 500); 
        },
        afterLoad(){
             this.showLoading = false;
        }
        // onRowDblClick({data}) {
        //     this.accountItem = {
        //         PK: data.TAC_ABACCTCODE_PK,
        //         CODE: data.AC_CD,
        //         NAME: data.AC_NM
        //     }
        //     this.$refs.dailySlDialog.dialogIsShow = true 
        // },
    },
};
</script>

<style> 
.sum1 {
    background-color: #f8ed52 !important;
}

.sum2 {
    background-color: #52f8ea70 !important;
}

.sum3 {
    background-color: #7AA0FF !important;
}
.sum4 {
    background-color: #ff7a908e !important;
}
</style>
