<template>
  <div>
    <v-dialog id="sl-plunit-dialog" max-width="1400" v-model="dialogIsShow">
      <v-card>
        <v-card-title class="headline primary-gradient white--text py-2">
          <span>{{ $t("sl_for_pl_unit", "common") }}</span>
          <v-spacer></v-spacer>
          <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
        </v-card-title>
        <v-container fluid class="pt-0">
         <v-row  >
              <v-col cols="2">
                <v-select
                  dense
                  hide-details
                  item-value="PK"
                  item-text="TEXT"
                  :label="$t('company', 'common')"
                  :items="companyList"
                  v-model="selectedCompany"
                ></v-select>
              </v-col>
              <v-col cols="2">
                  <v-select dense hide-details :rules="validationRule.require" item-value="PK" item-text="TEXT" :label="$t('biz_place')" :items="bizPlaceList" v-model="lstBizPlace"></v-select>
              </v-col>
              <v-col cols="1">
                <v-select
                  dense
                  hide-details
                  item-value="CODE"
                  item-text="NAME"
                  :label="$t('status')"
                  :items="statusList"
                  v-model="selectedStatus"
                ></v-select>
              </v-col>
              <v-col cols="1">
                <v-select
                  clearable
                  dense
                  hide-details
                  item-value="CODE"
                  item-text="NAME"
                  :label="$t('currency')"
                  :items="currencyList"
                  v-model="selectedCurrency"
                ></v-select>
              </v-col>

              <v-col cols="2">
                <v-text-field
                  ref="txtAccountCode"
                  clearable
                  dense
                  hide-details
                  :label="$t('account_code')"
                  @keypress.enter="onSearch"
                  @dblclick="openAccountDialog"
                  v-model="txtAccountCode"
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  readonly
                  dense
                  hide-details
                  :label="$t('account_name')"
                  @keypress.enter="onSearch"
                  @dblclick="openAccountDialog"
                  v-model="txtAccountName"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row dense>
              <v-col cols="1">
                <datePicker :inputValue="from_date"
                  :label="$t('from')"
                  :defaultType="'startOfMonth'"
                  @returnValue="from_date = $event"
                >
                </datePicker>
              </v-col>
              <v-col cols="1">
                <datePicker :inputValue="to_date"
                  :label="$t('to')"
                  @returnValue="to_date = $event"
                >
                </datePicker>
              </v-col>
              <v-col cols="1">
                <v-select
                  dense
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
                  :label="$t('pl_code')"
                  @keypress.enter="onSearch"
                  @dblclick="openPlUnitDialog"
                  v-model="txtPLCode"
                ></v-text-field>
              </v-col>
              <v-col cols="2">
                <v-text-field
                  readonly
                  dense
                  hide-details
                  :label="$t('pl_name')"
                  @keypress.enter="onSearch"
                  @dblclick="openPlUnitDialog"
                  v-model="txtPlName"
                ></v-text-field>
              </v-col>
              <v-col cols="2">
                <v-select
                  dense
                  hide-details
                  item-value="CODE"
                  item-text="NAME"
                  :label="$t('report_type')"
                  :items="reportTypeList"
                  v-model="selectedReportType"
                ></v-select>
              </v-col>
              <v-col cols="1" align="right">
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
                      icon  v-show="false"
                      tile
                      color="success"
                      :disabled="isProcessing"
                      @click="onPrint"
                      v-on="on"
                    >
                      <v-icon>mdi-file-excel</v-icon>
                    </v-btn>
                  </template>
                  <span>{{ $t("export_excel") }}</span>
                </v-tooltip>
              </v-col>
            </v-row>
            <!-- Table -->
            <v-row align="center" justify="center">
              <v-col cols="12" class="py-0">
                <v-card tile v-resize="onResize">
                  <DataGridView ref="gridDataDtl" :header="defaultHeader" :sel_procedure="this.sel_pro" select_mode="Single" :filter_paras="[
                      this.selectedCompany,
                      this.from_date,
                      this.to_date,
                      this.txtAccountPK,
                      this.TAC_ABPL_PK,
                      this.selectedStatus,
                      this.selectedCurrency,
                      this.lstBizPlace
                      ]" :is_allow_paste="false" :max_height="limitHeight" :filterRow="true" />
                  <!-- <DxDataGrid
                    column-resizing-mode="widget"
                    key-expr="PK"
                    :allow-column-resizing="true"
                    :column-auto-width="true"
                    :data-source="dataList"
                    :height="limitHeight"
                    :show-borders="true"
                    :show-column-lines="true"
                    :show-row-lines="true"
                    :columns="defaultHeader"
                  >
                    <DxPaging
                      v-if="dataList.length < 500"
                      :page-size="dataList.length"
                    />
                    <DxScrolling v-else mode="infinite" />
                    <DxSelection mode="multiple" v-if="multiSelectMode" />
                    <DxSelection mode="single" v-if="!multiSelectMode" />
                  </DxDataGrid>-->
                  
                  <DataGridView ref="gridDataSum" :header="defaultSumHeader" sel_procedure="ac_sel_6045070_sum" select_mode="Single" :filter_paras="[
                      this.selectedCompany,
                      this.from_date,
                      this.to_date,
                      this.txtAccountPK,
                      this.TAC_ABPL_PK,
                      this.selectedStatus,
                      this.selectedCurrency,
                      this.lstBizPlace
                      ]" :is_allow_paste="false" :max_height="150" :filterRow="true" />
                  <!-- <DxDataGrid
                    column-resizing-mode="widget"
                    key-expr="PK"
                    :allow-column-resizing="true"
                    :column-auto-width="true"
                    :data-source="dataSumList"
                    :height="150"
                    :show-borders="true"
                    :show-column-lines="true"
                    :show-row-lines="true"
                    :columns="defaultSumHeader"
                  >
                    <DxPaging :page-size="dataSumList.length" />
                    <DxSelection mode="multiple" v-if="multiSelectMode" />
                    <DxSelection mode="single" v-if="!multiSelectMode" />
                  </DxDataGrid>  -->
                </v-card>
              </v-col>
            </v-row>
        </v-container>
      </v-card>
    </v-dialog>

     <account-dialog
      ref="accountDialog"
      @returnAccountInfo="mappingAccount"
    ></account-dialog>
    <pl-unit-dialog
      ref="plUnitDialog"
      @returnPlUnitInfo="mappingPlUnit"
    ></pl-unit-dialog>
  </div>
</template>

<script>
export default {
  name:"sl-pl-unit-dialog",
  props: ["companyPK", "accountItem", "fromDate", "toDate", "status", "ccy", "plItem","bizPlace"],
  components: {
    accountDialog: () => import("@/components/dialog/AccountDialog"),
    PlUnitDialog: () => import("@/components/dialog/PlUnitDialog"),
    datePicker: () => import("@/components/control/DatePicker")
  },
  data: () => ({
    precision: 2,dialogIsShow:false,
    selectedCompany: "",
    txtAccountCode: "",
    txtAccountName: "",
    txtAccountPK: "%",
    txtPLCode: "",
    txtPlName: "",
    TAC_ABPL_PK: "%",
    companyList: [],
    selectedCurrency: "%",
    selectedReportType: "AS", //the same as on form
    selectedStatus: "2", //confirm
    selectedAmtType: "book",
    selectedLanguage: "ENG",
    currencyList: [],
    reportTypeList: [],
    languageList: [],
    multiSelectMode: false,
    dataList: [],
    dataSumList: [],
    selectedInquiryType: "voucher",
    from_date: "",
    to_date: "",
    statusList:[],
    accCodePK: '',accCode: '', proposeFrom: '',
    proposeTo: '',
    bizPlaceList: [],
    lstBizPlace:"",
    sel_pro : "",
  }),

  watch: {
     
    dialogIsShow(val) {
      if(val === true) {
        console.log("ahihi "+this.bizPlace);
        this.selectedCompany = this.companyPK
        this.txtAccountPK = this.accountItem.PK
        this.txtAccountPK = this.accountItem.PK
        if(this.ccy == "" || this.ccy == null ||this.ccy == undefined || this.ccy == "null") {
          this.selectedCurrency = "%";
        } else {
          this.selectedCurrency = this.ccy;
        }
        this.txtAccountName = `${this.accountItem.CODE} - ${this.accountItem.NAME}`
        this.txtAccountCode=  `${this.accountItem.CODE}`
        this.txtPLCode = `${this.plItem.CODE}`
        this.txtPlName = `${this.plItem.CODE} - ${this.plItem.NAME}`
        this.TAC_ABPL_PK = `${this.plItem.PK}`
        this.from_date = this.fromDate
        this.to_date = this.toDate
        this.selectedStatus = this.status 
        this.lstBizPlace = this.bizPlace 
        if(this.fromDate !="" && this.toDate !='')
        {
          this.$nextTick(() => {          
              this.onSearch(); 
          });
        } 
      }  

    },
    txtPLCode(val) {
      if (!val) {
        this.TAC_ABPL_PK = "";
        this.txtPlName = "";
        this.TAC_ABPL_PK = "%";
      }
    },
    txtAccountCode(val) {
      if (!val) {
        this.txtAccountPK = "";
        this.txtAccountName = "";
        this.txtAccountPK = "%";
      }
    },
    selectedCurrency(val) {
      if (!val) {
        this.selectedCurrency = "%";
      }
     // this.onSearch();
    },
    selectedReportType() {
      //this.onSearch();
    },
    selectedStatus() {
      //this.onSearch();
    },
    selectedInquiryType() {
     // this.onSearch();
    }
  },
  async created() {
    self = this;
    console.log('bizPlace : '+ this.bizPlace);
    this.selectedCompany = this.user.TCO_COMPANY_PK;
    this.companyList = await this._getCompany();
    const dso_bizplace_list = {
          type: 'list',
          selpro: 'SYS_SEL_BIZ_PLACE_V2',
          para: [this.selectedCompany, this.user.PK]
      }
      this.bizPlaceList = await this._dsoCall(dso_bizplace_list, 'select', false)
      if (this.bizPlaceList.length > 0) {
          this.lstBizPlace = this.bizPlaceList[0].PK;
          this.lstBizPlace = this.bizPlace;
    }
    const commoncode = await this._getCommonCode2(
      ["EACAB021", "ACAB0110", "EACBK036", "HRAB0180", "AC150001", "ACBG0040"],
      this.selectedCompany
    );
    this.reportOptionList = commoncode[0];
    this.currencyList = commoncode[1];
    if(this.currencyList.length > 0)
    {
      this.selectedCurrency = this.currencyList[0].CODE;
    }
    this.reportTypeList = commoncode[2];
    this.languageList = commoncode[3];
    this.circularsList = commoncode[4];
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
    defaultHeader() {
      const self = this;
      let head1 = [];
      if (this.selectedInquiryType == "voucher") {
        if (this.selectedAmtType == "trans-book") {
          head1 = [
            {
              field: "PK",
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
              customizeText: function({ value }) {
                return `${self._formatNumber(value, 2)}`;
              }
            },
            {
              dataField: "",
              caption: this.$t("trans"),

              columns: [
                {
                  dataField: "TR_DR",
                  caption: this.$t("debit"),
                  customizeText: function({ value }) {
                    return `${self._formatNumber(value, 2)}`;
                  }
                },
                {
                  dataField: "TR_CR",
                  caption: this.$t("credit"),
                  customizeText: function({ value }) {
                    return `${self._formatNumber(value, 2)}`;
                  }
                }
              ]
            },
            {
              dataField: "",
              caption: this.$t("books"),

              columns: [
                {
                  dataField: "BK_DR",
                  caption: this.$t("debit"),
                  customizeText: function({ value }) {
                    return `${self._formatNumber(value, self.precision)}`;
                  }
                },
                {
                  dataField: "BK_CR",
                  caption: this.$t("credit"),
                  customizeText: function({ value }) {
                    return `${self._formatNumber(value, self.precision)}`;
                  }
                }
              ]
            },
            {
              dataField: "END_BAL",
              caption: this.$t("end_bal"),
              customizeText: function({ value }) {
                return `${self._formatNumber(value, 2)}`;
              }
            },
            {
              dataField: "",
              caption: this.$t("profit_and_lost"),

              columns: [
                {
                  dataField: "PL_CD",
                  caption: this.$t("code")
                },
                {
                  dataField: "PL_NM",
                  caption: this.$t("name")
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
            }
          ];
        } else if (this.selectedAmtType == "book") {
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
              customizeText: function({ value }) {
                return `${self._formatNumber(value, self.precision)}`;
              }
            },
            {
              dataField: "",
              caption: this.$t("books"),

              columns: [
                {
                  dataField: "BK_DR",
                  caption: this.$t("debit"),
                  customizeText: function({ value }) {
                    return `${self._formatNumber(value, self.precision)}`;
                  }
                },
                {
                  dataField: "BK_CR",
                  caption: this.$t("credit"),
                  customizeText: function({ value }) {
                    return `${self._formatNumber(value, self.precision)}`;
                  }
                }
              ]
            },
            {
              dataField: "END_BAL",
              caption: this.$t("end_bal"),
              customizeText: function({ value }) {
                return `${self._formatNumber(value, self.precision)}`;
              }
            },
            {
              dataField: "",
              caption: this.$t("profit_and_lost"),

              columns: [
                {
                  dataField: "PL_CD",
                  caption: this.$t("code")
                },
                {
                  dataField: "PL_NM",
                  caption: this.$t("name")
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
            }
          ];
        } else if (this.selectedAmtType == "trans") {
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
              customizeText: function({ value }) {
                return `${self._formatNumber(value, 2)}`;
              }
            },
            {
              dataField: "",
              caption: this.$t("trans"),

              columns: [
                {
                  dataField: "TR_DR",
                  caption: this.$t("debit"),
                  customizeText: function({ value }) {
                    return `${self._formatNumber(value, 2)}`;
                  }
                },
                {
                  dataField: "TR_CR",
                  caption: this.$t("credit"),
                  customizeText: function({ value }) {
                    return `${self._formatNumber(value, 2)}`;
                  }
                }
              ]
            },
            {
              dataField: "END_BAL",
              caption: this.$t("end_bal"),
              customizeText: function({ value }) {
                return `${self._formatNumber(value, 2)}`;
              }
            },
            {
              dataField: "",
              caption: this.$t("profit_and_lost"),

              columns: [
                {
                  dataField: "PL_CD",
                  caption: this.$t("code")
                },
                {
                  dataField: "PL_NM",
                  caption: this.$t("name")
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
            }
          ];
        }
      } else if (this.selectedInquiryType == "date") {
        if (this.selectedAmtType == "trans-book") {
          head1 = [
            {
              dataField: "STD_YMD",
              caption: this.$t("date"),
              dataType: "date",
              format: this.curLang.DATE_FORMAT
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
              customizeText: function({ value }) {
                return `${self._formatNumber(value, 2)}`;
              }
            },
            {
              dataField: "",
              caption: this.$t("transaction"),
              columns: [
                {
                  dataField: "TR_DR",
                  caption: this.$t("debit"),
                  customizeText: function({ value }) {
                    return `${self._formatNumber(value, 2)}`;
                  }
                },
                {
                  dataField: "TR_CR",
                  caption: this.$t("credit"),
                  customizeText: function({ value }) {
                    return `${self._formatNumber(value, 2)}`;
                  }
                }
              ]
            },
            {
              dataField: "",
              caption: this.$t("book"),

              columns: [
                {
                  dataField: "BK_DR",
                  caption: this.$t("debit"),
                  customizeText: function({ value }) {
                    return `${self._formatNumber(value, self.precision)}`;
                  }
                },
                {
                  dataField: "BK_CR",
                  caption: this.$t("credit"),
                  customizeText: function({ value }) {
                    return `${self._formatNumber(value, self.precision)}`;
                  }
                }
              ]
            },
            {
              dataField: "END_BAL",
              caption: this.$t("end_bal"),
              customizeText: function({ value }) {
                return `${self._formatNumber(value, 2)}`;
              }
            },
            {
              dataField: "",
              caption: this.$t("profit_and_lost"),

              columns: [
                {
                  dataField: "PL_CD",
                  caption: this.$t("code")
                },
                {
                  dataField: "PL_NM",
                  caption: this.$t("name")
                }
              ]
            }
          ];
        } else if (this.selectedAmtType == "book") {
          head1 = [
            {
              dataField: "STD_YMD",
              caption: this.$t("date")
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
              customizeText: function({ value }) {
                return `${self._formatNumber(value, self.precision)}`;
              }
            },
            {
              dataField: "",
              caption: this.$t("books"),

              columns: [
                {
                  dataField: "BK_DR",
                  caption: this.$t("debit"),
                  customizeText: function({ value }) {
                    return `${self._formatNumber(value, self.precision)}`;
                  }
                },
                {
                  dataField: "BK_CR",
                  caption: this.$t("credit"),
                  customizeText: function({ value }) {
                    return `${self._formatNumber(value, self.precision)}`;
                  }
                }
              ]
            },
            {
              dataField: "END_BAL",
              caption: this.$t("end_bal"),
              customizeText: function({ value }) {
                return `${self._formatNumber(value, self.precision)}`;
              }
            },
            {
              dataField: "",
              caption: this.$t("profit_and_lost"),

              columns: [
                {
                  dataField: "PL_CD",
                  caption: this.$t("code")
                },
                {
                  dataField: "PL_NM",
                  caption: this.$t("name")
                }
              ]
            }
          ];
        } else if (this.selectedAmtType == "trans") {
          head1 = [
            {
              dataField: "STD_YMD",
              caption: this.$t("date"),
              dataType: "date",
              format: this.curLang.DATE_FORMAT
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
              customizeText: function({ value }) {
                return `${self._formatNumber(value, 2)}`;
              }
            },
            {
              dataField: "",
              caption: this.$t("trans"),

              columns: [
                {
                  dataField: "TR_DR",
                  caption: this.$t("debit"),
                  customizeText: function({ value }) {
                    return `${self._formatNumber(value, 2)}`;
                  }
                },
                {
                  dataField: "TR_CR",
                  caption: this.$t("credit"),
                  customizeText: function({ value }) {
                    return `${self._formatNumber(value, 2)}`;
                  }
                }
              ]
            },
            {
              dataField: "END_BAL",
              caption: this.$t("end_bal"),
              customizeText: function({ value }) {
                return `${self._formatNumber(value, 2)}`;
              }
            },
            {
              dataField: "",
              caption: this.$t("profit_and_lost"),

              columns: [
                {
                  dataField: "PL_CD",
                  caption: this.$t("code")
                },
                {
                  dataField: "PL_NM",
                  caption: this.$t("name")
                }
              ]
            }
          ];
        }
      }
      return head1;
    },
    defaultSumHeader() {
      const self = this;
      let head1 = [];
      if (this.selectedAmtType == "trans-book") {
        head1 = [
          {
            dataField: "CCY",
            caption: this.$t("ccy")
          },
          {
            dataField: "",
            caption: this.$t("open_bal"),
            columns: [
              {
                dataField: "TR_OPEN",
                caption: this.$t("transaction"),
                customizeText: function({ value }) {
                  return `${self._formatNumber(value, 2)}`;
                }
              },
              {
                dataField: "BK_OPEN",
                caption: this.$t("book"),
                customizeText: function({ value }) {
                  return `${self._formatNumber(value, self.precision)}`;
                }
              }
            ]
          },
          {
            dataField: "",
            caption: this.$t("transaction"),
            columns: [
              {
                dataField: "TR_DR",
                caption: this.$t("debit"),
                customizeText: function({ value }) {
                  return `${self._formatNumber(value, 2)}`;
                }
              },
              {
                dataField: "TR_CR",
                caption: this.$t("credit"),
                customizeText: function({ value }) {
                  return `${self._formatNumber(value, 2)}`;
                }
              }
            ]
          },
          {
            dataField: "",
            caption: this.$t("book"),
            columns: [
              {
                dataField: "BK_DR",
                caption: this.$t("debit"),
                customizeText: function({ value }) {
                  return `${self._formatNumber(value, self.precision)}`;
                }
              },
              {
                dataField: "BK_CR",
                caption: this.$t("credit"),
                customizeText: function({ value }) {
                  return `${self._formatNumber(value, self.precision)}`;
                }
              }
            ]
          },
          {
            dataField: "",
            caption: this.$t("end_bal"),
            columns: [
              {
                dataField: "TR_END",
                caption: this.$t("transaction"),
                customizeText: function({ value }) {
                  return `${self._formatNumber(value, 2)}`;
                }
              },
              {
                dataField: "BK_END",
                caption: this.$t("book"),
                customizeText: function({ value }) {
                  return `${self._formatNumber(value, self.precision)}`;
                }
              }
            ]
          }
        ];
      } else if (this.selectedAmtType == "book") {
        head1 = [
          {
            dataField: "CCY",
            caption: this.$t("ccy")
          },
          {
            dataField: "BK_OPEN",
            caption: this.$t("open_book"),
            customizeText: function({ value }) {
              return `${self._formatNumber(value, self.precision)}`;
            }
          },
          {
            dataField: "",
            caption: this.$t("book"),
            columns: [
              {
                dataField: "BK_DR",
                caption: this.$t("debit"),
                customizeText: function({ value }) {
                  return `${self._formatNumber(value, self.precision)}`;
                }
              },
              {
                dataField: "BK_CR",
                caption: this.$t("credit"),
                customizeText: function({ value }) {
                  return `${self._formatNumber(value, self.precision)}`;
                }
              }
            ]
          },
          {
            dataField: "BK_END",
            caption: this.$t("end_book"),
            customizeText: function({ value }) {
              return `${self._formatNumber(value, self.precision)}`;
            }
          }
        ];
      } else if (this.selectedAmtType == "trans") {
        head1 = [
          {
            dataField: "CCY",
            caption: this.$t("ccy")
          },
          {
            dataField: "TR_OPEN",
            caption: this.$t("open_trans"),
            customizeText: function({ value }) {
              return `${self._formatNumber(value, 2)}`;
            }
          },
          {
            dataField: "",
            caption: this.$t("transaction"),

            columns: [
              {
                dataField: "TR_DR",
                caption: this.$t("debit"),
                customizeText: function({ value }) {
                  return `${self._formatNumber(value, 2)}`;
                }
              },
              {
                dataField: "TR_CR",
                caption: this.$t("credit"),
                customizeText: function({ value }) {
                  return `${self._formatNumber(value, 2)}`;
                }
              }
            ]
          },
          {
            dataField: "TR_END",
            caption: this.$t("end_trans"),
            customizeText: function({ value }) {
              return `${self._formatNumber(value, 2)}`;
            }
          }
        ];
      }
      return head1;
    },
    inquiryTypeList() {
      return [
        { CODE: "date", NAME: this.$t("date") },
        { CODE: "voucher", NAME: this.$t("voucher") }
      ];
    },
    limitHeight() {
      return this.windowHeight - 450;
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
    openAccountDialog() {
      this.$refs.accountDialog.dialogIsShow = true;
    },
    mappingAccount(item) {
      this.txtAccountCode = item.AC_CD;
      this.txtAccountName = item.AC_NM;
      this.txtAccountPK = item.PK;
    },
    openPlUnitDialog() {
      this.$refs.plUnitDialog.dialogIsShow = true;
    },
    mappingPlUnit(item) {
      this.txtPLCode = item.PL_CD;
      this.txtPlName = item.PL_NM;
      this.TAC_ABPL_PK = item.PK;
    },
    async onSearch() {
      await this.$refs.gridDataSum.loadData();
      await this.onSearchDtl();
      // let dso = {
      //   type: "grid",
      //   selpro: "ac_sel_6045070_sum",
      //   para: [
      //     this.selectedCompany,
      //     this.from_date,
      //     this.to_date,
      //     this.txtAccountPK,
      //     this.TAC_ABPL_PK,
      //     this.selectedStatus,
      //     this.selectedCurrency,
      //     this.lstBizPlace
      //   ]
      // };
      // let result = await this._dsoCall(dso, "select", false);
      // if (result) {
      //   this.dataSumList = result;
      // }
    },
    async onSearchDtl(){
      if (this.selectedInquiryType == "voucher") {
        this.sel_pro = "ac_sel_6045070_voucher";
        await this.$refs.gridDataDtl.loadData();
        // let dso = {
        //   type: "grid",
        //   selpro: "ac_sel_6045070_voucher",
        //   para: [
        //     this.selectedCompany,
        //     this.from_date,
        //     this.to_date,
        //     this.txtAccountPK,
        //     this.TAC_ABPL_PK,
        //     this.selectedStatus,
        //     this.selectedCurrency,
        //     this.lstBizPlace
        //   ]
        // };
        // let result = await this._dsoCall(dso, "select", false);
        // if (result) {
        //   this.dataList = result;
        // }
      } else {
        
        this.sel_pro = "ac_sel_6045070_date";
        await this.$refs.gridDataDtl.loadData();
        // let dso = {
        //   type: "grid",
        //   selpro: "ac_sel_6045070_date",
        //   para: [
        //     this.selectedCompany,
        //     this.from_date,
        //     this.to_date,
        //     this.txtAccountPK,
        //     this.TAC_ABPL_PK,
        //     this.selectedStatus,
        //     this.selectedCurrency,
        //     this.lstBizPlace
        //   ]
        // };
        // let result = await this._dsoCall(dso, "select", false);
        // if (result) {
        //   this.dataList = result;
        // }
      }
    },
    onPrint() {}
  }
};
</script>
