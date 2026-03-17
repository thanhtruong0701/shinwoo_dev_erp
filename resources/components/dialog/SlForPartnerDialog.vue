<template>
  <div>
    <v-dialog id="sl-for-partner-dialog" max-width="1400" v-model="dialogIsShow">
      <v-card>
        <v-card-title class="headline primary-gradient white--text py-2">
          <span>{{ $t("sl_for_partner", "common") }}</span>
          <v-spacer></v-spacer>
          <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
        </v-card-title>
        <v-container fluid class="px-0 pt-0">
    <v-row align="center" justify="center">
      <v-col cols="12">
        <v-card>
          <v-container fluid class="pt-0">
            <v-row dense>
              <v-col cols="2">
                <v-select
                  dense
                  cache-items
                  hide-details
                  item-value="PK"
                  item-text="TEXT"
                  :label="$t('company', 'common')"
                  :items="companyList"
                  v-model="selectedCompany"
                ></v-select>
              </v-col>
              <v-col cols="2">
                  <v-select dense hide-details background-color="yellow lighten-4" validate-on-blur :rules="validationRule.require" item-value="PK" item-text="TEXT" :label="$t('biz_place')" :items="bizPlaceList" v-model="lstBizPlace"></v-select>
              </v-col>
              <v-col cols="1">
                <v-select
                  dense
                  cache-items
                  hide-details
                  item-value="CODE"
                  item-text="NAME"
                  :label="$t('status')"
                  :items="statusList"
                  v-model="selectedStatus"
                ></v-select>
              </v-col>
              <v-col cols="1">
                <v-text-field
                  ref="txtAccountCode"
                  clearable
                  dense
                  hide-details
                  :label="$t('account_code')"
                  @keypress.enter="search"
                  @dblclick="openAccountDialog"
                  v-model="txtAccountCode"
                ></v-text-field>
              </v-col>
              <v-col cols="2">
                <v-text-field
                  readonly
                  dense
                  hide-details
                  :label="$t('account_name')"
                  @keypress.enter="search"
                  @dblclick="openAccountDialog"
                  v-model="txtAccountName"
                ></v-text-field>
              </v-col>
              <v-col cols="1">
                <v-text-field
                  clearable
                  dense
                  hide-details
                  :label="$t('partner_id')"
                  @keypress.enter="search"
                  @dblclick="openPartnerDialog"
                  v-model="txtPartnerID"
                ></v-text-field>
              </v-col>
              <v-col cols="2">
                <v-text-field
                  readonly
                  dense
                  hide-details
                  :label="$t('partner_name')"
                  @keypress.enter="search"
                  @dblclick="openPartnerDialog"
                  v-model="txtPartnerName"
                ></v-text-field>
              </v-col>
              <v-col cols="1">
                <div class='d-flex'>
                    <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="search" />
                </div>
                <!-- <v-btn
                  icon
                  tile
                  :color="currentTheme"
                  :disabled="isProcessing"
                  @click="search"
                >
                  <v-icon>mdi-magnify</v-icon>
                </v-btn>  -->
              </v-col>
            </v-row>
            <v-row dense>
              <v-col cols="1">
                <datePicker
                :inputValue="from_date"
                  :label="$t('from')"
                  :defaultType="'startOfMonth'"

                  @returnValue="from_date = $event"
                >
                </datePicker>
              </v-col>
              <v-col cols="1">
                <datePicker
                :inputValue="to_date"
                  :label="$t('to')"
                  @returnValue="to_date = $event"
                >
                </datePicker>
              </v-col>
              <v-col cols="1">
                <v-select
                  dense
                  cache-items
                  hide-details
                  item-value="CODE"
                  item-text="NAME"
                  :label="$t('inquiry_type')"
                  :items="inquiryTypeList"
                  v-model="selectedInquiryType"
                ></v-select>
              </v-col>
              <v-col cols="1">
                <v-select
                  dense
                  cache-items
                  hide-details
                  item-value="CODE"
                  item-text="NAME"
                  :label="$t('currency')"
                  :items="currencyList"
                  v-model="selectedCurrency"
                ></v-select>
              </v-col>
              <v-col cols="2">
                <v-select
                  dense
                  cache-items
                  hide-details
                  item-value="CODE"
                  item-text="NAME"
                  :label="$t('report_option')"
                  :items="reportOptionList"
                  v-model="selectedReportOption"
                ></v-select>
              </v-col>
              <v-col cols="1">
                <v-select
                  dense
                  hide-details
                  item-value="CODE"
                  item-text="NAME"
                  :label="$t('circulars')"
                  :items="circularsList"
                  v-model="selectedCirculars"
                ></v-select>
              </v-col>
              <v-col cols="1">
                <v-select
                  dense
                  cache-items
                  hide-details
                  item-value="CODE"
                  item-text="NAME"
                  :label="$t('amt_type')"
                  :items="amtTypeList"
                  v-model="selectedAmtType"
                ></v-select>
              </v-col>
              <v-col cols="1">
                <v-select
                  dense
                  cache-items
                  hide-details
                  item-value="CODE"
                  item-text="NAME"
                  :label="$t('language')"
                  :items="languageList"
                  v-model="selectedLanguage"
                ></v-select>
              </v-col>
              <v-col cols="1">
                <v-text-field
                  clearable
                  dense
                  hide-details
                  :label="$t('voucher_no')"
                  @keypress.enter="search"
                  v-model="txtVoucherNo"
                ></v-text-field>
              </v-col>
              <v-col cols="1">
                <v-text-field
                  clearable
                  dense
                  hide-details
                  :label="$t('seq')"
                  @keypress.enter="search"
                  v-model="txtSeq"
                ></v-text-field>
              </v-col>
              <v-col cols="1">
                <v-select
                  dense
                  cache-items
                  hide-details
                  item-value="CODE"
                  item-text="NAME"
                  :label="$t('report_type')"
                  :items="reportTypeList"
                  v-model="selectedReportType"
                ></v-select>
              </v-col>
            </v-row>
            <!-- Table -->
            <v-row align="center" justify="center">
              <v-col cols="12" class="py-0">
                <v-card tile v-resize="onResize">
                     <DataGridView ref="grdDetail" :header="defaultHeader" :sel_procedure="this.selectedInquiryType == 'date' ? 'ac_sel_6045040_date' : 'ac_sel_6045040_voucher'" select_mode="Single" :filter_paras="[
                      this.selectedCompany,
                      this.from_date,
                      this.to_date,
                      this.txtAccountPK,
                      this.txtPartnerPK,
                      this.selectedStatus,
                      this.selectedCurrency,
                      this.lstBizPlace
                    ]" :is_allow_paste="false" :max_height="limitHeight-20" @cellDblClick="selectInquiryRow" :filterRow="true" />
                  <!-- <DxDataGrid
                    style="width: 100%;"
                    ref="grdDetail"
                    column-resizing-mode="widget"
                    key-expr="PK"
                    :allow-column-resizing="true"
                    :column-auto-width="$vuetify.breakpoint.smAndDown"
                    :data-source="dataList"
                    :height="limitHeight"
                    :show-borders="true"
                    :show-column-lines="true"
                    :show-row-lines="true"
                    :columns="defaultHeader"
                    :onRowDblClick="selectInquiryRow"
                  >
                    <DxPaging
                      v-if="dataList.length < 500"
                      :page-size="dataList.length"
                    />
                    <DxScrolling v-else mode="infinite" />
                    <DxSelection mode="single" />
                  </DxDataGrid> -->

                  <DxDataGrid
                    style="width: 100%;"
                    ref="grdSumary"
                    column-resizing-mode="widget"
                    key-expr="PK"
                    :allow-column-resizing="true"
                    :column-auto-width="$vuetify.breakpoint.smAndDown"
                    :data-source="dataSumList"
                    :height="100"
                    :show-borders="true"
                    :show-column-lines="true"
                    :show-row-lines="true"
                    :columns="defaultSumHeader"
                  >
                    <DxPaging :page-size="dataSumList.length" />
                    <DxSelection mode="single" />
                  </DxDataGrid>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>

    <account-dialog
      ref="accountDialog"
      @returnAccountInfo="mappingAccount"
    ></account-dialog>
     <account-slip-dialog ref="accountSlipDialog" :seqArray="seqArray" :currentSeq="currentSeq" />
    <partner-dialog
      ref="partnerDialog"
      @callBackData="mappingPartner"
    ></partner-dialog>
  </v-container>
      </v-card>
    </v-dialog> 
  </div>
</template>

<script>
export default {
  name:"sl-for-partner-dialog",
  props: ["companyPK", "accountItem", "fromDate", "toDate", "status", "ccy", "PartnerItem", "bizPlace"],
  components: {
    accountDialog: () => import("@/components/dialog/AccountDialog"),
    partnerDialog: () => import("@/components/dialog/PartnerDialog"),
    datePicker: () => import("@/components/control/DatePicker"),
    AccountSlipDialog: () => import("@/components/dialog/AccountSlipDialog")
  },
  data: () => ({
    selectedCompany: "",dialogIsShow:false,
    txtAccountCode: "",
    txtAccountName: "",
    txtAccountPK: "",
    txtPartnerID: "",
    txtPartnerName: "",
    txtPartnerPK: "",
    companyList: [],
    selectedCurrency: "%",
    selectedReportType: "AS", //the same as on form
    selectedStatus: "2", //confirm
    selectedAmtType: "book",
    selectedLanguage: "ENG",
    selectedCirculars: "200",
    currencyList: [],
    reportTypeList: [],
    languageList: [],
    txtSeq: "",
    multiSelectMode: false,
    //dataList: [],
    dataSumList: [],
    txtVoucherNo: "",
    circularsList: [],
    reportOptionList: [],
    selectedReportOption: "DRCR",
    selectedInquiryType: "voucher",
    from_date: "",
    to_date: "",
    precision: 0,
    statusList:[],
    seqArray: [],
    currentSeq: null,
    bizPlaceList: [],
    lstBizPlace: "",
  }),

  watch: {
    dialogIsShow(val) {
      console.log(val);
      if(val === true) {
        //console.log("ahihi"+this.fromDate);
        this.selectedCompany = this.companyPK
        this.txtAccountPK = this.accountItem.PK
        
        if(this.ccy == "" || this.ccy == null ||this.ccy == undefined || this.ccy == "null") {
          this.selectedCurrency = "%";
        } else {
          this.selectedCurrency = this.ccy;
        }
        this.txtAccountName = `${this.accountItem.CODE} - ${this.accountItem.NAME}`
        this.txtAccountCode=  `${this.accountItem.CODE}`
        this.txtPartnerID= `${this.PartnerItem.CODE}`
        this.txtPartnerName= `${this.PartnerItem.CODE} - ${this.PartnerItem.NAME}`
        this.txtPartnerPK = `${this.PartnerItem.PK}` 
        this.from_date = this.fromDate
        this.to_date = this.toDate
        this.selectedStatus = this.status 
        if(this.fromDate !="" && this.toDate !='')
        {
            this.search() 
        } 
        this.lstBizPlace = this.bizPlace;
      }  
    },
    txtPartnerID(val) {
      if (!val) {
        this.txtPartnerPK = "";
        this.txtPartnerName = "";
      }
    },
    txtAccountCode(val) {
      if (!val) {
        this.txtAccountPK = "";
        this.txtAccountName = "";
      }
    },
    selectedCurrency() {
      this.search();
    },
    selectedReportType() {
      this.search();
    },
    selectedStatus() {
      this.search();
    },
    selectedInquiryType(val) {
      this.$refs.grdDetail.loadData(); 
     // this.$refs.grdDetail.instance.refresh();

    }
  },
  async created() {
    self = this;
    this.selectedCompany = this.user.TCO_COMPANY_PK;
    this.getCompanyList();
    const commoncode = await this._getCommonCode2(
      ["EACAB021", "ACAB0110", "EACBK004", "HRAB0180", "AC150001", "ACBG0040"],
      this.selectedCompany
    );
    this.reportOptionList = commoncode[0];
    this.currencyList = commoncode[1];
    this.reportTypeList = commoncode[2];
    this.languageList = commoncode[3];
    this.circularsList = commoncode[4];
    this.currencyList.push({ CODE: "%", NAME: this.$t("all") });
    const result = commoncode[5];
    result.forEach(e => {
      if (e.DEF_YN == "Y") {
        self.precision = e.VAL3;
      }
    });
    const result_status = await this._getCommonCode('ACBG0010', this.selectedCompany);  
    this.statusList =  [...result_status.filter(x => x.VAL1 == 'Y')]; 
  },
  computed: {
    inquiryTypeList() {
      return [
        { CODE: "date", NAME: this.$t("date") },
        { CODE: "voucher", NAME: this.$t("voucher") }
      ];
    },
    limitHeight() {
      return this.windowHeight - 350;
    },
    amtTypeList() {
      return [
        { CODE: "trans", NAME: this.$t("transaction") },
        { CODE: "book", NAME: this.$t("book") },
        { CODE: "trans-book", NAME: this.$t("trans_book") }
      ];
    },
    /*statusList() {
      return [
        { CODE: "0", NAME: this.$t("approved") },
        { CODE: "2", NAME: this.$t("confirmed") }
      ];
    },*/
    user() {
      return this.$store.getters["auth/user"];
    },
    defaultHeader() {
      let head1 = [];
      self = this;
      if (this.selectedInquiryType == "voucher") {
        head1 = [
            {
              dataField: "PK",
              caption: this.$t("seq")
            },
            {
              dataField: "VOUCHER_NO",
              caption: this.$t("voucher_no")
            },
            {
              dataField: "STD_YMD",
              caption: this.$t("trans_date"),
              dataType: "date",
              format: this.curLang.DATE_FORMAT
            },
            {
              dataField: "CRT_BY",
              caption: this.$t("crt_by")
            },
            {
              dataField: "",
              caption: this.$t("account"),

              columns: [
                {
                  dataField: "AC_CD",
                  caption: this.$t("code")
                },
                {
                  dataField: "AC_NM",
                  caption: this.$t("name")
                }
              ]
            },
            {
              dataField: "CCY",
              caption: this.$t("ccy")
            },
            {
              dataField: "OPEN_BAL",
              caption: this.$t("open_bal"),
              dataType: "number", 
              formatFloat: 0 ,
            },
            {
              dataField: "",
              caption: this.$t("trans"),

              columns: [
                {
                  dataField: "TR_AMT_DR",
                  caption: this.$t("debit"),
                  dataType: "number", 
                  formatFloat: 0 ,
                  width: this.selectedAmtType == 'book' ? "0" : "120", 
                },
                {
                  dataField: "TR_AMT_CR",
                  caption: this.$t("credit"),
                  dataType: "number", 
                  formatFloat: 0 ,
                  width: this.selectedAmtType == 'book' ? "0" : "120", 
                }
              ]
            },
            {
              dataField: "",
              caption: this.$t("books"),
              columns: [
                {
                  dataField: "BK_AMT_DR",
                  caption: this.$t("debit"),
                  dataType: "number", 
                  formatFloat: 0 ,
                  width: this.selectedAmtType == 'trans' ? "0" : "120", 
                },
                {
                  dataField: "BK_AMT_CR",
                  caption: this.$t("credit"),
                  dataType: "number", 
                  formatFloat: 0 ,
                  width: this.selectedAmtType == 'trans' ? "0" : "120", 
                }
              ]
            },
            {
              dataField: "END_BAL",
              caption: this.$t("end_bal"),
              dataType: "number", 
              formatFloat: 0 ,
            },
            {
              dataField: "",
              caption: this.$t("partner"),

              columns: [
                {
                  dataField: "PARTNER_ID",
                  caption: this.$t("partner_id")
                },
                {
                  dataField: "PARTNER_NAME",
                  caption: this.$t("partner_name")
                }
              ]
            },
            {
              dataField: "",
              caption: this.$t("description"),

              columns: [
                {
                  dataField: "DESCRIPTION_ENG",
                  caption: this.$t("foreign")
                },
                {
                  dataField: "DESCRIPTION_LOCAL",
                  caption: this.$t("local")
                }
              ]
            },
            {
              dataField: "CTRL_ITEM",
              caption: this.$t("control_item")
            }
          ];
      } else if (this.selectedInquiryType == "date") {
          head1 = [
            {
              dataField: "STD_YMD",
              caption: this.$t("date"),
              dataType: "date",
              format: this.curLang.DATE_FORMAT
            },
            {
              dataField: "",
              caption: this.$t("partner"),

              columns: [
                {
                  dataField: "PARTNER_ID",
                  caption: this.$t("partner_id")
                },
                {
                  dataField: "PARTNER_NAME",
                  caption: this.$t("partner_name")
                }
              ]
            },
            {
              dataField: "",
              caption: this.$t("account"),

              columns: [
                {
                  dataField: "AC_CD",
                  caption: this.$t("code")
                },
                {
                  dataField: "AC_NM",
                  caption: this.$t("name")
                }
              ]
            },
            {
              dataField: "CCY",
              caption: this.$t("ccy")
            },
            {
              dataField: "OPEN_BAL",
              caption: this.$t("open_bal"),
              dataType: "number", 
              formatFloat: 0 ,
            },
            {
              dataField: "",
              caption: this.$t("trans"),

              columns: [
                {
                  dataField: "TR_AMT_DR",
                  caption: this.$t("debit"),
                  dataType: "number", 
                  formatFloat: 0 ,
                  width: this.selectedAmtType == 'book' ? "0" : "120", 
                },
                {
                  dataField: "TR_AMT_CR",
                  caption: this.$t("credit"),
                  dataType: "number", 
                  formatFloat: 0 ,
                  width: this.selectedAmtType == 'book' ? "0" : "120", 
                }
              ]
            },
            {
              dataField: "",
              caption: this.$t("books"),

              columns: [
                {
                  dataField: "BK_AMT_DR",
                  caption: this.$t("debit"),
                  dataType: "number", 
                  formatFloat: 0 ,
                  width: this.selectedAmtType == 'trans' ? "0" : "120", 
                },
                {
                  dataField: "BK_AMT_CR",
                  caption: this.$t("credit"),
                  dataType: "number", 
                  formatFloat: 0 ,
                  width: this.selectedAmtType == 'trans' ? "0" : "120", 
                }
              ]
            },
            {
              dataField: "END_BAL",
              caption: this.$t("end_bal"),
              dataType: "number", 
              formatFloat: 0 ,
            }
          ];
        
      }

      return head1;
    },
    defaultSumHeader() {
      let head1 = [];
      if (this.selectedAmtType == "book") {
        head1 = [
          {
            dataField: "CCY",
            caption: this.$t("ccy"),
            width: "100"
          },
          {
            dataField: "OPEN_BAL",
            caption: this.$t("open_bal"),
            dataType: "number", 
            formatFloat: 0 ,
          },
          {
            dataField: "",
            caption: this.$t("books"),

            columns: [
              {
                dataField: "BK_AMT_DR",
                caption: this.$t("debit"),
                dataType: "number", 
                formatFloat: 0 ,
              },
              {
                dataField: "BK_AMT_CR",
                caption: this.$t("credit"),
                dataType: "number", 
                formatFloat: 0 ,
              }
            ]
          },
          {
            dataField: "END_BAL",
            caption: this.$t("end_bal"),
            dataType: "number", 
            formatFloat: 0 ,
          }
        ];
      } else if (this.selectedAmtType == "trans") {
        head1 = [
          {
            dataField: "CCY",
            caption: this.$t("ccy"),
            width: "100"
          },
          {
            dataField: "TR_OPEN_BAL",
            caption: this.$t("tr_open_bal"),
            dataType: "number", 
            formatFloat: 2 ,
          },

          {
            dataField: "",
            caption: this.$t("trans"),

            columns: [
              {
                dataField: "TR_AMT_DR",
                caption: this.$t("debit"),
                dataType: "number", 
                formatFloat: 2 ,
              },
              {
                dataField: "TR_AMT_CR",
                caption: this.$t("credit"),
                dataType: "number", 
                formatFloat: 2 ,
              }
            ]
          },
          {
            dataField: "TR_END_BAL",
            caption: this.$t("tr_end_bal"),
            dataType: "number", 
            formatFloat: 2 ,
          }
        ];
      } else if (this.selectedAmtType == "trans-book") {
        head1 = [
          {
            dataField: "CCY",
            caption: this.$t("ccy"),
            width: "100"
          },
          {
            dataField: "",
            caption: this.$t("open_bal"),

            columns: [
              {
                dataField: "TR_OPEN_BAL",
                caption: this.$t("trans"),
                dataType: "number", 
                formatFloat: 2 ,
              },
              {
                dataField: "OPEN_BAL",
                caption: this.$t("book"),
                dataType: "number", 
                formatFloat: 0 ,
              }
            ]
          },

          {
            dataField: "",
            caption: this.$t("trans"),

            columns: [
              {
                dataField: "TR_AMT_DR",
                caption: this.$t("debit"),
                dataType: "number", 
                formatFloat: 2 ,
              },
              {
                dataField: "TR_AMT_CR",
                caption: this.$t("credit"),
                dataType: "number", 
                formatFloat: 2 ,
              }
            ]
          },
          {
            dataField: "",
            caption: this.$t("books"),

            columns: [
              {
                dataField: "BK_AMT_DR",
                caption: this.$t("debit"),
                dataType: "number", 
                formatFloat: 0,
              },
              {
                dataField: "BK_AMT_CR",
                caption: this.$t("credit"),
                dataType: "number", 
                formatFloat: 0 ,
              }
            ]
          },
          {
            dataField: "END_BAL",
            caption: this.$t("end_bal"),

            columns: [
              {
                dataField: "TR_END_BAL",
                caption: this.$t("trans"),
                dataType: "number", 
                formatFloat: 2 ,
              },
              {
                dataField: "END_BAL",
                caption: this.$t("book"),
                dataType: "number", 
                formatFloat: 0 ,
              }
            ]
          }
        ];
      }
      return head1;
    }
  },

  methods: {
    async getExchangeRate(p_date, p_tco_company_pk, p_ccy) {
      this.txtVoucherNo = await this._getExchangeRate(
        p_date,
        p_tco_company_pk,
        p_ccy
      );
    },
    onRowPrepared(e) {
      if (e.rowType == "data") {
        e.rowElement.style.backgroundColor = e.data.COLOR_CD;
      }
    },
    openAccountDialog() {
      this.$refs.accountDialog.dialogIsShow = true;
    },
    mappingAccount(item) {
      this.txtAccountCode = item.AC_CD;
      this.txtAccountName = item.AC_NM;
      this.txtAccountPK = item.PK;
    },
    openPartnerDialog() {
      this.$refs.partnerDialog.dialogIsShow = true;
    },
    mappingPartner(item) {
      this.txtPartnerID = item.PARTNER_ID;
      this.txtPartnerName = item.PARTNER_NAME;
      this.txtPartnerPK = item.PK;
    },
    selectInquiryRow({ rowType, data }) {
      if(rowType === "data" && this.selectedInquiryType == "voucher") {
        this.currentSeq = data.PK
        this.seqArray = this.$refs.grdDetail.getDataSource().map(x => x.PK)
        this.$refs.accountSlipDialog.dialogIsShow = true
        // this.currentSeq = data.PK
        // this.seqArray = this.dataList.map(x => x.PK)
        // this.$refs.accountSlipDialog.dialogIsShow = true
      }
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
      } else {
        this.companyList = [];
      }
      const dso_bizplace_list = {
          type: 'list',
          selpro: 'SYS_SEL_BIZ_PLACE_V2',
          para: [this.selectedCompany, this.user.PK]
      }
      this.bizPlaceList = await this._dsoCall(dso_bizplace_list, 'select', false)
      if (this.bizPlaceList.length > 0) {
          this.lstBizPlace = this.bizPlaceList[0].PK;
      };
    },
    async search() {
      if (!this.txtAccountCode && !this.txtPartnerID) {
        this.showNotification(
          "warning",
          this.$t("please_select_account_or_partner"),
          "",
          10000
        );
        return;
      }
      let dso = {
        type: "grid",
        selpro: "ac_sel_6045040_sum",
        para: [
          this.selectedCompany,
          this.from_date,
          this.to_date, 
          this.txtAccountPK, 
          this.txtPartnerPK,
          this.selectedStatus,
          this.selectedCurrency,
          this.lstBizPlace
        ]
      };
      let result = await this._dsoCall(dso, "select", false);
      if (result) {
        this.dataSumList = result;
      } else {
        this.dataSumList = [];
      }
       this.$refs.grdDetail.loadData(); 
      // if (this.selectedInquiryType == "date") {
      //   dso = {
      //     type: "grid",
      //     selpro: "ac_sel_6045040_date",
      //     para: [
      //       this.selectedCompany,
      //       this.from_date,
      //       this.to_date,
      //       this.txtAccountPK,
      //       this.txtPartnerPK,
      //       this.selectedStatus,
      //       this.selectedCurrency,
      //       this.lstBizPlace
      //     ]
      //   };
      //   result = await this._dsoCall(dso, "select", false);
      //   if (result) {
      //     this.dataList = result;
      //   }
      // } 
      // else if (this.selectedInquiryType == "voucher") {
      //   dso = {
      //     type: "grid",
      //     selpro: "ac_sel_6045040_voucher",
      //     para: [
      //       this.selectedCompany,
      //       this.from_date,
      //       this.to_date,
      //       this.txtAccountPK,
      //       this.txtPartnerPK,
      //       this.selectedStatus,
      //       this.selectedCurrency,
      //       this.lstBizPlace
      //     ]
      //   };
      //   result = await this._dsoCall(dso, "select", false);
      //   if (result) {
      //     this.dataList = result;
      //   }
      // }
    } ,   
  }
};
</script>

