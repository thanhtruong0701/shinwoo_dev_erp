<template>
  <v-container fluid class="pa-0" v-resize="onResize">
    <v-row no-gutters>
      <v-col cols="12">
        <!-- Search Panel -->
        <v-row align="center" justify="center">
          <v-col cols="12">
            <v-card tile>
              <v-container fluid class="py-1">
                <v-row dense align="center" justify="space-between">
                  <!-- row 1 -->
                  <!-- Company -->
                  <v-col lg="3" sm="6" cols="12">
                    <v-select
                      outlined
                      clearable
                      dense
                      hide-details
                      item-value="PK"
                      item-text="TEXT"
                      :label="$t('company')"
                      :items="companyList"
                      v-model="lstCompany"
                      @change="onChangeCompany"
                    ></v-select>
                  </v-col>
                  <!-- Voucher Type -->
                  <v-col
                    lg="2"
                    sm="6"
                    cols="12"
                    class="
                      d-flex
                      align-center
                      justify-space-between
                      pb-lg-1 pb-2
                    "
                  >
                    <v-select
                      clearable
                      dense
                      outlined
                      hide-details
                      item-value="CODE"
                      item-text="NAME"
                      :label="$t('voucher_type')"
                      :items="voucherTypeList"
                      v-model="lstVoucher_Type"
                      @change="search"
                    ></v-select>
                  </v-col>
                  <!--Seq -->
                  <v-col lg="2" sm="12" cols="12" class="d-flex align-center">
                    <v-text-field
                      clearable
                      dense
                      outlined
                      hide-details
                      :label="$t('seq')"
                      v-model="txtSeq"
                    ></v-text-field>
                  </v-col>
                  <v-col lg="5" sm="12" cols="12" class="d-flex align-center">
                    <div class="d-flex justify-end">
                      <BaseButton icon_type="search" :btn_text="$t('search')" @onclick="onClickButton('SEARCH')" />
                      

                      <!-- Delete -->
                      <BaseButton
                        icon_type="delete"
                        :btn_text="$t('delete')"
                        @onclick="onClickButton('DELETE')"
                      />

                      <!-- Delete ALL -->
                      <BaseButton
                        icon_type="delete"
                        :btn_text="$t('delete_all')"
                        @onclick="onClickButton('DELETE_ALL')"
                      />
                      <!-- Report -->
                      <BaseButton
                        icon_type="print"
                        :btn_text="$t('report_excel')"
                        @onclick="onClickButton('EXCEL')"
                      />
                    </div>`  
                  </v-col>
                </v-row>
                <v-row dense align="center" justify="space-between">
                  <!-- row 2 -->
                  <!-- Biz Place -->
                  <v-col lg="3" cols="12">
                    <v-select
                      dense
                      outlined
                      hide-details
                      item-value="PK"
                      item-text="TEXT"
                      :label="$t('biz_place')"
                      :items="bizPlaceList"
                      v-model="lstBiz_Place"
                    ></v-select>
                  </v-col>
                  <!-- Voucher No -->
                  <v-col
                    lg="2"
                    sm="6"
                    cols="12"
                    class="d-flex align-center justify-space-between"
                  >
                    <v-text-field
                      outlined
                      clearable
                      dense
                      hide-details
                      :label="$t('voucher_no')"
                      v-model="txtVoucherNo"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    lg="2"
                    sm="6"
                    cols="12"
                    class="d-flex align-center justify-space-between"
                  >
                  </v-col>
                  <v-col
                    lg="5"
                    sm="6"
                    cols="12"
                    class="d-flex align-center justify-space-between"
                  >
                    <GwImportExcelFile :label="$t('import_file')" :impTempFile="imp_template_file" :impProc="imp_store_prod" :impStartRow="6" :impEndCol="impEndCol" :impAddParam="[this.month.replace('-', ''), this.lstCompany, this.lstBiz_Place]" @onAfterImport="onAfterImport"></GwImportExcelFile>
                  </v-col>
                </v-row>
                <v-row dense align="center" justify="space-between">
                  <!-- row 3 -->
                  <!-- Proposed From/To -->
                  <v-col lg="1" sm="12" cols="12" class="d-flex align-center">
                    <datePicker
                      outlined
                      :label="$t('month')"
                      :type="'month'"
                      @returnValue="month = $event"
                    ></datePicker>
                  </v-col>
                  <v-col lg="2" sm="12" cols="12" class="d-flex align-center">
                    <date-picker
                      outlined
                      :inputValue="transDateFrom"
                      :label="$t('proposed_from')"
                      :defaultType="'startOfMonth'"
                      @returnValue="transDateFrom = $event"
                    ></date-picker>
                    <div class="mx-1"></div>
                    <date-picker
                      outlined
                      :inputValue="transDateTo"
                      :label="$t('proposed_to')"
                      :defaultType="'endOfMonth'"
                      @returnValue="transDateTo = $event"
                    ></date-picker>
                  </v-col>
                  <v-col lg="2" sm="12" cols="12" class="d-flex align-center">
                    <v-text-field
                      clearable
                      dense
                      outlined
                      hide-details
                      :label="$t('net_amount')"
                      v-model="txtNet_Trans"
                      format="###,###,###.##"
                    ></v-text-field>
                  </v-col>
                  <v-col lg="2" sm="12" cols="12" class="d-flex align-center">
                    <v-text-field
                      clearable
                      dense
                      outlined
                      hide-details
                      :label="$t('book_amount')"
                      v-model="txtNet_Book"
                      format="###,###,###.##"
                    ></v-text-field>
                  </v-col>
                  <v-col lg="2" sm="12" cols="12" class="d-flex align-center">
                    <v-select
                      clearable
                      dense
                      outlined
                      hide-details
                      item-value="PK"
                      item-text="TEXT"
                      :label="$t('process')"
                      :items="processList"
                      v-model="lstProcess"
                    ></v-select>
                  </v-col>
                  <v-col lg="3" sm="12" cols="12" class="d-flex align-center">
                     <div class="d-flex justify-end">
                        <!-- Confirm -->
                        <BaseButton
                          icon_type="confirm"
                          :btn_text="$t('confirm')"
                          @onclick="onClickButton('COMFIRM')"
                        />

                        <!-- Cancel -->
                        <BaseButton
                          icon_type="cancel"
                          :btn_text="$t('cancel')"
                          @onclick="onClickButton('CANCEL')"
                        />
                     </div>
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
          </v-col>
        </v-row>
        <!-- Grid Master -->
        <v-row no-gutters align="center" justify="start" class="mb-2">
          <v-col cols="12">
            <DataGridView column-resizing-mode="widget" 
              ref="grdItemInfo" 
              :auto_load="false"
              select_mode="Single"
              :max_height="limitHeight" 
              :header="headerGrid" 
              sel_procedure="AC_SEL_6030130_UPLOAD_NO_CACHE"
              upd_procedure="AC_UPD_6060010_TAC_CRCAD" 
              :filter_paras="[this.lstCompany,
                              this.lstBiz_Place,
                              this.transDateFrom,
                              this.transDateTo,
                              this.lstVoucher_Type,
                              this.txtVoucherNo,
                              this.txtSeq,
                              this.lstProcess
                             ]" 
              :update_paras="['PK',
                              ]" 
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <confirm-dialog ref="confirmDialog" @onConfirm="confirmResult()"></confirm-dialog>
    <confirm-dialog ref="cancelDialog" @onConfirm="cancelResult()"></confirm-dialog>
    <confirm-dialog ref="deleteDialog" @onConfirm="deleteResult()"></confirm-dialog>
    <AttachmentsDialog ref="refAttachments" table_name="TAC_GL_SLIP_UPLOAD" :master_table_pk="0" />
  </v-container>
</template>

<script>
import GwImportExcelFile from '@/components/control/GwImportExcelFile.vue';
import ConfirmDialog from "@/components/dialog/ConfirmDialog";

export default {
  layout: "default",
  middleware: "user",

  components: {
    AttachmentsDialog: () => import("@/components/dialog/AttachmentsDialog"),
    GwImportExcelFile,
    ConfirmDialog
  },

  data: () => ({
    btnSendEinvoice: true,
    btnCancelEinvoice: true,
    txtSeq: "",
    txtVoucherNo: "",
    bizPlaceList: [],
    voucherTypeList: [],
    lstBiz_Place: "",
    companyList: [],
    lstCompany: null,
    seq: "",
    languageList: [],
    selectedLang: "",
    status: "2",
    transDateFrom: "",
    transDateTo: "",
    lstAutoCheck: "",
    accCodeType: null,
    PK: "",
    lstVoucher_Type: "",
    inPK: "",
    in: "",
    dialogTitle: "",
    btnPrint: true,
    codeType: null,
    moreParas: [],
    txtTei_Einvoice_M_PK: "",
    selectedReportType: "",
    tab: null,
    txtNet_Trans: "",
    txtNet_Book: "",
    multiSelectMode: true,
    txtEInvoice_NoS: "",
    txtCheckCodeList: "",
    selectionMode: "all",
    selectAllMode: "page",
    idKey: "id" + Math.floor(Math.random() * 1000000),
    itemsCount:"",
    isProcessing:false,
    processList:[
      {"PK": "ALL", "TEXT": "select_all"},
      {"PK": "Y", "TEXT": "yes"},
      {"PK": "N", "TEXT": "no"}, 
    ],
    lstProcess:"ALL",
    imp_validate: "",
    impEndCol: 33,
    imp_template_file: 'report/60/30/im_6030130_GL_UPLOAD.xlsx',
    imp_store_prod: 'AC_IMP_6030130_UPLOAD_NOCACHE',
    month:""
    
  }),

  created() {
    this.getListCodes();
  },
  watch: {
    month(val) {
      if (val) {
        this.transDateFrom = val + "01";
        this.transDateTo = val + this._maxDateOfMonth(val);
      }
    },
  },
  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
    limitHeight() {
      return this.windowHeight - 350;
    }, // this.windowHeight },
    
    headerGrid() {
      const self = this;
      let head1 = [];
      head1 = [
        {
          dataField: "ROWNUM",
          width: 100,
          allowEditing: true,
          caption: this.$t("rownum"),
        },
        {
          dataField: "SEQUENCE_NO",
          width: 100,
          allowEditing: false,
          caption: this.$t("sequence_no"),
        },
        {
          dataField: "TYPE_REF",
          width: 80,
          allowEditing: true,
          caption: this.$t("type_ref"),
        },
        {
          dataField: "LINE_NUMBER",
          width: 100,
          allowEditing: false,
          caption: this.$t("line_number"),
        },
        {
          dataField: "VOUCHER_TYPE",
          allowEditing: false,
          width: 120,
          caption: this.$t("voucher_type"),
        },
        {
          dataField: "VOUCHER_NO",
          allowEditing: false,
          width: 120,
          caption: this.$t("voucher_no"),
        },
        {
          dataField: "DEBIT_ACCOUNT_CODE",
          width: 100,
          caption: this.$t("debit_account_code"),
          allowEditing: true,
        },
        {
          dataField: "CREDIT_ACCOUNT_CODE",
          width: 100,
          caption: this.$t("credit_account_code"),
        },
        {
          dataField: "DEBIT_ACCOUNT_NAME",
          width: 120,
          caption: this.$t("debit_account_name"),
          allowEditing: true,
        },
        {
          dataField: "CREDIT_ACCOUNT_NAME",
          allowEditing: true,
          width: 80,
          caption: this.$t("credit_account_name"),
        },
        {
          dataField: "CURRENCY_CODE",
          cssClass: "cell-align-center",
          allowEditing: true,
          width: 120,
          caption: this.$t("currency_code"),
        },
        {
          dataField: "EXCHANGE_RATE",
          allowEditing: true,
          width: 120,
          caption: this.$t("exchange_rate"),
        },
        {
          dataField: "ENTERED_AMOUNT",
          width: 120,
          caption: this.$t("entered_amount"),
          allowEditing: true,
        },
        {
          dataField: "ACCOUNTED_AMOUNT",
          allowEditing: true,
          width: 80,
          caption: this.$t("accounted_amount"),
        },
        {
          dataField: "PARTNER_CODE_DR",
          allowEditing: true,
          width: 120,
          caption: this.$t("partner_code_dr"),
        },
        {
          dataField: "PARTNER_NAME_DR",
          width: 0,
          caption: this.$t("partner_name_dr"),
        },
        {
          dataField: "PARTNER_CODE_CR",
          allowEditing: true,
          caption: this.$t("partner_code_cr"),
          width: 80,
        },
        {
          dataField: "PARTNER_NAME_CR",
          allowEditing: true,
          caption: this.$t("partner_name_cr"),
          width: 80,
        },
        {
          dataField: "DESCRIPTION_ENG",
          allowEditing: true,
          caption: this.$t("description_eng"),
          width: 80,
        },

        {
          dataField: "DESCRIPTION_VIE",
          allowEditing: true,
          caption: this.$t("description_vie"),
          width: 80,
        },
        {
          dataField: "FORM_NO",
          width: 100,
          allowEditing: true,
          caption: this.$t("form_no"),
        },
        {
          dataField: "SERIAL_NUMBER",
          width: 100,
          caption: this.$t("serial_number"),
        },
        {
          dataField: "INVOICE_DATE",
          caption: this.$t("invoice_date"),
          allowEditing: true,
          width: 80,
        },
        {
          dataField: "INVOICE_NO",
          caption: this.$t("invoice_no"),
          allowEditing: true,
          width: 80,
        },
        {
          dataField: "DESCRIPTION_TAX",
          caption: this.$t("description_tax"),
          width: 80,
        },
        {
          dataField: "TAX_RATE",
          allowEditing: true,
          width: 120,
          caption: this.$t("tax_rate"),
          customizeText: function ({ value }) {
            return `${self._formatNumber(value, 0)}`;
          },
        },
        {
          dataField: "NET_AMT",
          allowEditing: true,
          width: 120,
          caption: this.$t("net_amt"),
          customizeText: function ({ value }) {
            return `${self._formatNumber(value, 2)}`;
          },
        },
        {
          dataField: "TAC_HGTRH_PK",
          width: 120,
          caption: this.$t("tac_hgtrh_pk"),
          allowEditing: true,

          customizeText: function ({ value }) {
            return `${self._formatNumber(value, 0)}`;
          },
        },
        {
          dataField: "PK",
          allowEditing: true,
          width: 120,
          caption: this.$t("pk"),
        }
      ];
      return head1;
    },
  },

  methods: {
    async getListCodes() {

      const result = await this._getCompanyByUser(this.user.PK);
            if (result) {
                this.companyList = result;
            }
      this.lstCompany = this.companyList[0].PK;
      this.languageList = await this._getCommonCode("COAB0070");

      const dso_bizplace_list = {
        type: "list",
        selpro: "SYS_SEL_BIZ_PLACE",
        para: [this.lstCompany],
      };
      this.bizPlaceList = await this._dsoCall(
        dso_bizplace_list,
        "select",
        false
      );
      this.lstBiz_Place = this.bizPlaceList[0].PK;


      this.voucherTypeList = await this._callProcedure("ac_sel_voucher_type", [
      this.lstCompany,
        "ACBG0130",
        ""
      ]);

      this.lstVoucher_Type = this.voucherTypeList[0].CODE;
    },
    async onChangeCompany(){
      const dso_bizplace_list = {
        type: "list",
        selpro: "SYS_SEL_BIZ_PLACE",
        para: [this.lstCompany],
      };
      this.bizPlaceList = await this._dsoCall(
        dso_bizplace_list,
        "select",
        false
      );
      this.lstBiz_Place = this.bizPlaceList[0].PK;
    },
    search(){
        this.$refs.grdItemInfo.loadData();
    },
    onAfterImport(obj) {
            this.search()
        },
    onClickButton(obj) {
      switch (obj) {  
        case "SEARCH":
            this.search();
          break;
        case "COMFIRM":
          this.$refs.confirmDialog.showConfirm(this.$t("do_you_want_confirm"));
           
          break;
        case "DELETE":
            this.$refs.deleteDialog.showConfirm(this.$t("do_you_want_delete"));
          break;
        case "DELETE_ALL":
            this.$refs.deleteDialog.showConfirm(this.$t("do_you_want_delete"));
          break;
        case "EXCEL":
            this.exportReport('EXCEL');
          break;
        case "CANCEL":
            this.$refs.cancelDialog.showConfirm(this.$t("do_you_want_cancel"));
        break;   
      }
    },
    confirmResult()
    {
      this.onConfirmM();
    },
    cancelResult()
    {
      this.onCancel(); 
    },
    deleteResult()
    {
      this.onDelete();
    },
    async onConfirmM() {
      const dso = {
        type: "process",
        updpro: "AC_PRO_6030130_PROCESS",
        para: [this.lstCompany,this.lstBiz_Place,this.transDateFrom,this.transDateTo,this.user.PK, this.lstProcess],
      };
      const result = await this._dsoCall(dso, "process", true);
      if (result.length > 0) {
        this.search();
      }  
    },
    async onDelete() {
      const dso = {
        type: "process",
        updpro: "AC_UPD_6030130_DELETE",
        para: [this.lstCompany,this.lstBiz_Place,this.transDateFrom,this.transDateTo],
      };
      const result = await this._dsoCall(dso, "process", true);
      if (result.length > 0) {
        this.search();
      }  
    },
    async onCancel() {
      const dso = {
        type: "process",
        updpro: "AC_PRO_6030130_CANCEL",
        para: [this.lstCompany,this.lstBiz_Place,this.transDateFrom,this.transDateTo],
      };
      const result = await this._dsoCall(dso, "process", true);
      if (result.length > 0) {
        this.search();
      }  
    },

  },
};
</script>
