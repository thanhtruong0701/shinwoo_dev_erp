<!-- ================================================================= BEGIN DESIGN LAYOUT======================================================================================= -->
<template>
  <div>
    <GwGridLayout dense colsPerRow="1" @callBackHeight="parentHeight = $event">
      <!-- left -->
      <GwGridLayout child dense colsPerRow="1" colspan="3" v-show="show_left" @callBackHeight="childrenHeight = $event">
        <BaseSelect colspan="9" :label="$t('company')" v-model="selectedCompany" :lstData="companyList" item-text="TEXT" item-value="PK" @change="onChangeCompany1" acntoutline />
        <GwFlexBox colspan="3" class="overflow-hidden">
          <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="leftSearch" />
        </GwFlexBox>

        <BaseSelect colspan="9" :label="$t('biz_place')" v-model="lstBizPlace" :lstData="bizPlaceListS" item-text="TEXT" item-value="PK" acntoutline />
        <BaseInput colspan="3" :label="$t('seq')" v-model="txtSearchSeq" @keyPressEnter="leftSearch" acntoutline />

        <BaseDatePicker colspan="4" start :label="$t('from')" v-model="from_date" acntoutline />
        <BaseDatePicker colspan="4" default :label="$t('to')" v-model="to_date" acntoutline />
        <BaseInput colspan="4" :label="$t('crt_by')" v-model="txtSearchCreateBy" @keyPressEnter="leftSearch" acntoutline />

        <BaseSelect colspan="6" :label="$t('voucher_type')" v-model="selectedSearchVoucher" :lstData="searchVoucherList" item-text="NAME" item-value="CODE" acntoutline />
        <BaseInput colspan="6" :label="$t('voucher_no')" v-model="txtSearchVoucherNo" @keyPressEnter="leftSearch" acntoutline />

        <BaseSelect colspan="4" :label="$t('status')" v-model="selectedStatus" :lstData="statusList" item-text="NAME" item-value="CODE" acntoutline :text-all="$t('all')" />
        <BaseInput colspan="8" :label="$t('description')" v-model="txtSearchDescription" @keyPressEnter="leftSearch" acntoutline />

        <DataGridView
          ref="grdDataLeft" 
          :max_height="gridLeftHeight" 
          select_mode="Single" 
          :header="leftHeader" 
          @cellClick="onRowClickLeft" 
          sel_procedure="ac_sel_6030014_search" 
          :filter_paras="[selectedCompany, from_date, to_date, selectedStatus, txtSearchSeq, txtSearchVoucherNo, selectedSearchVoucher, txtSearchCreateBy, txtSearchDescription, lstBizPlace]" 
        />
      </GwGridLayout>
      <!-- right -->
      <GwGridLayout child dense colsPerRow="1" :colspan="show_left ? 9 : 12" @callBackHeight="childrenHeight = $event">
        <!-- btn master -->
        <GwFlexBox class="py-1">
          <BaseButton :icon_type="btnIconType" :disabled="isProcessing" btn_type="icon" @onclick="toggleLeft" />
          <v-spacer></v-spacer>
          <GwFlexBox justify="end" width="90%">
            <BaseButton icon_type="new" :btn_text="$t('addnew')" :disabled="isProcessing" @onclick="onAddNew" />
            <BaseButton icon_type="save" :btn_text="$t('save')" :disabled="btnStatus || isProcessing" @onclick="onSave" />
            <BaseButton icon_type="delete" :btn_text="$t('delete')" :disabled="(mstData.TR_STATUS != '1' && mstData.TR_STATUS != '3') || isProcessing" @onclick="onDelete" />
            <BaseButton icon_type="copy" :btn_text="$t('copy')" :disabled="isProcessing" @onclick="onCopy" />
            <BaseButton icon_type="confirm" :btn_text="$t('confirm')" :disabled="mstData.TR_STATUS != '1' || isProcessing" @onclick="onConfirm" />
            <BaseButton icon_type="cancel" :btn_text="$t('cancel')" :disabled="mstData.TR_STATUS != '2' || isProcessing" @onclick="onCancel" />
            <BaseButton icon_type="replicate" :btn_text="$t('replicate')" :disabled="mstData.TR_STATUS != '3' || isProcessing" @onclick="onReplicate" />
            <BaseButton :icon_type="btnReportIco" :btn_text="btnReportNM" :disabled="isProcessing" @onclick="print" />
          </GwFlexBox>
        </GwFlexBox>
        
        <!-- fild master  -->
        <BaseSelect colspan="3" :label="$t('company')" v-model="mstData.TCO_COMPANY_PK" :lstData="companyList" item-text="TEXT" item-value="PK" acntoutline mandatory :rules="validationRule.require" />
        <BaseSelect colspan="2" :label="$t('biz_place')" v-model="mstData.TCO_BUSPLACE_PK" :lstData="bizPlaceList" item-text="TEXT" item-value="PK" acntoutline mandatory validate-on-blur :rules="validationRule.require" @change="onChangeBizPlace" />
        <BaseCheckbox colspan="1" v-model="mstData.AUTO_YN" :label="$t('auto')" true-value="Y" false-value="N" />
        <BaseSelect colspan="2" :label="$t('voucher_type')" v-model="mstData.VOUCHER_TYPE" :lstData="voucherList" item-text="NAME" item-value="CODE" acntoutline title="ACBG0130 commoncode" />
        <BaseInput colspan="2" :label="$t('voucher_no')" :readonly="mstData.AUTO_YN == 'Y'" v-model="mstData.VOUCHER_NO" acntoutline />
        <BaseInput colspan="2" :label="$t('seq')" v-model="mstData.PK" @keyPressEnter="searchMaster(mstData.PK, lstBizPlace)" acntoutline />
        <!--  -->
        <BaseInput colspan="3" :label="$t('trans_type')" readonly v-model="mstData.TRANS_NAME" acntoutline mandatory validate-on-blur :rules="validationRule.require" @dblClick="openTransactionTypeDialog" />
        <BaseDatePicker colspan="2" start :label="$t('transaction_date')" v-model="mstData.TR_DATE" acntoutline :rules="validationRule.require" mandatory :clearable="false" />
        <BaseInput colspan="1" ref="status" :label="$t('status')" readonly :value="_formatSlipStatus(mstData.TR_STATUS)" acntoutline />
        <BaseSelect colspan="2" :label="$t('organization')" v-model="mstData.TCO_ORG_PK" :lstData="orgList" item-text="TEXT" item-value="PK" acntoutline mandatory validate-on-blur :rules="validationRule.require" />
        <BaseInput colspan="2" :label="$t('enclose')" v-model="mstData.TR_ENCLOSE" acntoutline />
        <BaseSelect colspan="2" :label="$t('report_type')" v-model="selectedReportType" :lstData="reportTypeList" item-text="NAME" item-value="CODE" acntoutline />
        <!--  -->
        <BaseInput colspan="4" :label="$t('partner_name')" v-model="mstData.PARTNER_NAME" readonly acntoutline @dblClick="openPartnerDialog('master')" />
        <BaseInput ref="inputDescription" colspan="4" :label="$t('description')" v-model="mstData.DESCRIPTION" acntoutline mandatory />
        <BaseInput ref="inputDescriptionLocal" colspan="4" :label="$t('description_local')" v-model="mstData.DESCRIPTION_LOCAL" acntoutline mandatory />

        <!-- other_infor  -->
        <v-row dense class="pl-1 pr-1 pb-1">
          <BaseButton colspan="1" :icon_type="btnOtherInfor" :btn_text="$t('other_infor')" :disabled="isProcessing" @onclick="onDisplayTab('PERSONAL')" />
          <v-spacer />
          <v-col cols="11">
            <span dense v-show="showPersonal">
              <v-row>
                <v-col cols="2" class="py-2">
                  <BaseInput :label="$t('emp_name')" @dblClick="openEmployeeDialog" v-model="mstData.TR_PERSON" acntoutline />
                </v-col>
                <v-col cols="2" class="py-2">
                  <BaseInput :label="$t('description_foreign')" v-model="mstData.DESCRIPTION_FOREIGN" acntoutline />
                </v-col>
                <v-col cols="1" class="py-2">
                  <BaseInput :label="$t('crt_by')" readonly v-model="mstData.CRT_BY" acntoutline />
                </v-col>
                <v-col cols="2" class="py-2">
                  <BaseInput :label="$t('crt_dt')" readonly v-model="mstData.CRT_DT" acntoutline />
                </v-col>
                <v-col cols="1" class="py-2">
                  <BaseInput :label="$t('mod_by')" readonly v-model="mstData.MOD_BY" acntoutline />
                </v-col>
                <v-col cols="2" class="py-2">
                  <BaseInput :label="$t('mod_dt')" readonly v-model="mstData.MOD_DT" acntoutline />
                </v-col>
                <v-col cols="1" class="py-2">
                  <BaseInput :label="$t('book_ccy')" readonly v-model="txtBookCCY" acntoutline />
                </v-col>
                <v-col cols="1" class="py-2">
                  <BaseInput :label="$t('book_ex_rate')" readonly v-model="txtBookExRate" acntoutline />
                </v-col>
              </v-row>
            </span>
          </v-col>
        </v-row>

        <!-- detail right  -->
        <GwGridLayout :colspan="colspanDetail" child dense colsPerRow="1" percentHeight="70" @callBackHeight="childrenHeight2 = $event">
          <v-sheet class="d-flex justify-space-between" width="100%">
            <v-sheet width="12%" class="pl-1 pr-1">
              <BaseInput :label="$t('transaction_debit')" readonly v-model="txtSumTransDebit" acntoutline />
            </v-sheet>
            <v-sheet width="12%" class="pr-1">
              <BaseInput :label="$t('book_debit')" readonly v-model="txtSumBookDebit" acntoutline />
            </v-sheet>
            <v-sheet width="12%" class="pr-1">
              <BaseInput :label="$t('total_transaction_debit')" readonly v-model="txtTotalTransDebit" acntoutline />
            </v-sheet>
            <v-sheet width="12%" class="pr-1">
              <BaseInput :label="$t('total_book_debit')" readonly v-model="txtTotalBookDebit" acntoutline />
            </v-sheet>
            <v-spacer />
            <div class="d-flex justify-end">
              <BaseButton :icon_type="btnDebit" :btn_text="$t('debit')" btn_type="icon" :disabled="isProcessing" @onclick="onDisplayTab('DEBIT')" />
              <!-- <BaseButton icon_type="new" :btn_text="$t('add_by_apply_invoice')" :disabled="btnStatus || isProcessing" @onclick="onAddNewDebit('APPLY_INVOICE')" /> -->
              <BaseButton icon_type="new" :btn_text="$t('addnew')" :disabled="btnStatus || isProcessing" @onclick="onAddNewDebit('ACCOUNT_CD')" />
              <BaseButton icon_type="save" :btn_text="$t('save')" :disabled="btnStatus || isProcessing" @onclick="onSaveDebit(mstData.PK, mstData.TCO_BUSPLACE_PK)" />
              <BaseButton icon_type="delete" :btn_text="$t('delete')" :disabled="btnStatus || isProcessing" @onclick="onDeleteDebit" />
              <BaseButton icon_type="copy" :btn_text="$t('copy')" :disabled="btnStatus || isProcessing" @onclick="onCopyDebit" />
              <BaseButton colspan="1" :icon_type="btnIconTypeDebit" :disabled="isProcessing" btn_type="icon" :btn_text="$t('Control')" @onclick="toggleCtl" />
              <!-- <BaseButton
                colspan="1"
                :icon_type="btnIconTypeDebit"
                :disabled="isProcessing"
                btn_type="icon"
                @onclick="toggleCtl"
                v-show="!showCtl"
              /> -->
              <BaseButton icon_type="up" :btn_text="$t('up')" v-show="false" :disabled="btnStatus || isProcessing" @onclick="onUpDebit" />
              <BaseButton icon_type="down" :btn_text="$t('down')" v-show="false" :disabled="btnStatus || isProcessing" @onclick="onDownDebit" />
            </div>
          </v-sheet>
          <!-- grdDebit -->
          <DataGridView v-show="showDebit" ref="grdDebit" :max_height="gridRightHeight" :header="rightHeader" @focusCellChanging="focusCellChangingDebit" @cellClick="onRowClickDebit" @cellDblClick="cellDebitDblClick" @onSelectionChanged="onSelectionDebitChanged" @row-updated="sumDebitCredit" @setDataSource="sumDebitCredit" select_mode="Multiple" sel_procedure="ac_sel_6030014_detail" :filter_paras="[mstData.PK, 'D', mstData.TCO_BUSPLACE_PK]" />

          <!-- grdCredit -->
          <v-sheet class="d-flex justify-space-between" width="100%">
            <v-sheet width="12%" class="pl-1 pr-1">
              <BaseInput colspan="1" :label="$t('transaction_credit')" readonly v-model="txtSumTransCredit" acntoutline />
            </v-sheet>
            <v-sheet width="12%" class="pr-1">
              <BaseInput colspan="1" :label="$t('book_credit')" readonly v-model="txtSumBookCredit" acntoutline />
            </v-sheet>
            <v-sheet width="12%" class="pr-1">
              <BaseInput colspan="1" :label="$t('total_transaction_credit')" readonly v-model="txtTotalTransCredit" acntoutline />
            </v-sheet>
            <v-sheet width="12%" class="pr-1">
              <BaseInput colspan="1" :label="$t('total_book_credit')" readonly v-model="txtTotalBookCredit" acntoutline />
            </v-sheet>
            <v-spacer />
            <div class="d-flex justify-end">
              <BaseButton colspan="1" :icon_type="btnCredit" :btn_text="$t('credit')" btn_type="icon" :disabled="isProcessing" @onclick="onDisplayTab('CREDIT')" />
              <!-- <BaseButton icon_type="new" :btn_text="$t('add_by_apply_invoice')" :disabled="btnStatus || isProcessing" @onclick="onAddNewCredit('APPLY_INVOICE')" /> -->
              <BaseButton colspan="2" icon_type="new" :btn_text="$t('addnew')" :disabled="btnStatus || isProcessing" @onclick="onAddNewCredit('ACCOUNT_CD')" />
              <BaseButton colspan="1" icon_type="save" :btn_text="$t('save')" :disabled="btnStatus || isProcessing" @onclick="onSaveCredit(mstData.PK, mstData.TCO_BUSPLACE_PK)" />
              <BaseButton colspan="1" icon_type="delete" :btn_text="$t('delete')" :disabled="btnStatus || isProcessing" @onclick="onDeleteCredit" />
              <BaseButton colspan="1" icon_type="copy" :btn_text="$t('copy')" :disabled="btnStatus || isProcessing" @onclick="onCopyCredit" />
              <BaseButton colspan="1" icon_type="up" :btn_text="$t('up')" v-show="false" :disabled="btnStatus || isProcessing" @onclick="onUpCredit" />
              <BaseButton colspan="1" icon_type="down" :btn_text="$t('down')" v-show="false" :disabled="btnStatus || isProcessing" @onclick="onDownCredit" />
            </div>
          </v-sheet>

          <!--  -->
          <DataGridView v-show="showCredit" ref="grdCredit" :max_height="gridRightHeight" :header="rightHeader" @focusCellChanging="focusCellChangingCredit" @cellClick="onRowClickCredit" @cellDblClick="cellCreditDblClick" @onSelectionChanged="onSelectionCreditChanged" @row-updated="sumDebitCredit" @setDataSource="sumDebitCredit" select_mode="Multiple" sel_procedure="ac_sel_6030014_detail" :filter_paras="[mstData.PK, 'C', mstData.TCO_BUSPLACE_PK]" />
        </GwGridLayout>
        <!-- grdControl -->
        <GwGridLayout :colspan="colspanGrdControl" child dense colsPerRow="1" percentHeight="70" v-show="showCtl">
          <GwFlexBox justify="end">
            <BaseButton v-show="showCtl" icon_type="save" :btn_text="$t('save')" :disabled="isProcessing" @onclick="onSaveCtl" />
          </GwFlexBox>
          
          <DataGridView ref="grdControl" :max_height="gridRightHiddenHeight" :header="ctlHeader" @focusCellChanging="focusCellChangingCtlItem" @cellDblClick="cellControlDblClick" @setDataSource="sumDebitCredit" @onRowPrepared="onRowPreparedCtl" select_mode="Single" sel_procedure="ac_sel_6030014_control" :filter_paras="[l_tac_hgtrd_pk, l_tac_abacctcode_pk, l_drcr_type]" />
        </GwGridLayout>
      </GwGridLayout> 
    </GwGridLayout>

    <account-dialog 
      ref="accountDialog" :multiSelectMode="multiSelectMode" @returnAccountInfo="mappingAccount" :sel_pro="sel_pro" 
      :group_code="mstData.TAC_ABTRTYPE_PK == '' || mstData.TAC_ABTRTYPE_PK == null ? 0 : mstData.TAC_ABTRTYPE_PK" 
      :drcr_type="addType != 'APPLY_INVOICE' ? '' : selectedGrid">
    </account-dialog>

    <partner-dialog ref="partnerDialog" @callBackData="mappingPartner" :AcntType="true" :companyPK="mstData.TCO_COMPANY_PK"></partner-dialog>
    <transaction-type-dialog ref="transTypeDialog" @returnTransactionTypeInfo="mappingTransType" :companyPK="mstData.TCO_COMPANY_PK"></transaction-type-dialog>
    <cost-center-n-dialog ref="refPLCenter" :companyPK="mstData.TCO_COMPANY_PK" :bizPlace="mstData.TCO_BUSPLACE_PK" @returnData="callBackPLCenter" leafY></cost-center-n-dialog>
    <dynamic-dialog ref="refDynamicDialog" :companyPK="mstData.TCO_COMPANY_PK" :header="dynamicHeader" :codeLabel="codeLabel" :nameLabel="nameLabel" :dialogTitle="dialogTitle" :procedure="procedure" :from_date="dynamicFromDate" :moreParas="moreParas" :autoSearch="autoSearch" @returnData="callBackDynamicDialog"></dynamic-dialog>
    <dynamic-dialog ref="refEmployeeAdvDialog" :companyPK="mstData.TCO_COMPANY_PK" :header="dynamicHeader" :codeLabel="codeLabel" :nameLabel="nameLabel" :dialogTitle="dialogTitle" :procedure="procedure" :moreParas="moreParas" :autoSearch="autoSearch" @returnData="callBackEmployeeAdvDialog"></dynamic-dialog>
    <confirm-dialog ref="refConfirmDialog" @onConfirm="confirmMaster"></confirm-dialog>
    <confirm-dialog ref="refRemindDataChangedDialog" @onConfirm="confirmDataChanged"></confirm-dialog>
    <alert-dialog ref="alertDialog"></alert-dialog>
    <ctrl-apply-invoice-dialog ref="ctrlapplyinvoice" @returnApplyInvoiceInfo="returnApplyInvoiceInfo" :company="mstData.TCO_COMPANY_PK" :accountItem="accountItem" :partnerItem="PartnerItem" :date="mstData.TR_DATE" :ccy="getCcy" :multiSelectMode="multiSelectMode" :descriptionItem="descriptionItem"></ctrl-apply-invoice-dialog>
    <GwLoading :visible="showLoading" />
  </div>
</template>

<script>
export default {
  layout: "default",
  middleware: "user",
  components: {
    ConfirmDialog: () => import("@/components/dialog/ConfirmDialog"),
    DynamicDialog: () => import("@/components/dialog/DynamicDialog"),
    CostCenterNDialog: () => import("@/components/dialog/CostCenterNDialog"),
    accountDialog: () => import("@/components/dialog/AccountDialog"),
    partnerDialog: () => import("@/components/dialog/PartnerDialog"),
    transactionTypeDialog: () =>
      import("@/components/dialog/TransactionTypeDialog"),
    datePicker: () => import("@/components/control/DatePicker"),
    AlertDialog: () => import("@/components/dialog/AlertDialog"),
    CtrlApplyInvoiceDialog: () =>
      import("@/components/dialog/CtrlApplyInvoiceDialog"),
  },
  data: () => ({
    autosave: false,
    showLoading: false,
    ctlChanging: "",
    dynamicFromDate: "",
    selectedDebitDatas: [],
    selectedCreditDatas: [],
    txtSumTransDebit: 0,
    txtSumTransCredit: 0,
    txtSumBookDebit: 0,
    txtSumBookCredit: 0,
    precision: 2,
    formIsValid: undefined,
    statusList: [],
    btnStatus: false,
    selectedRowDetail: {},
    moreParas: null,
    autoSearch: false,
    dynamicHeader: [],
    codeLabel: "",
    nameLabel: "",
    dialogTitle: "",
    procedure: "",
    multiSelectMode: false,
    txtTotalTransDebit: "0",
    txtTotalTransCredit: "0",
    txtTotalBookDebit: "0",
    txtTotalBookCredit: "0",
    debitList: [],
    creditList: [],
    ctlList: [],
    mstData: {},
    searchVoucherList: [],
    selectedSearchVoucher: "%",
    txtSearchDescription: "",
    txtSearchCreateBy: "",
    txtSearchVoucherNo: "",
    txtSearchSeq: "",
    selectedStatus: "1",
    leftCols: 0,
    ctlCols: 0,
    showLeft: false,
    showCtl: false,
    companyList: [],
    voucherList: [],
    bizPlaceList: [],
    bizPlaceListS: [],
    orgList: [],
    languageList: [],
    dataList: [],
    leftDataList: [],
    txtBookExRate: "",
    selectedReportType: "",
    txtBookCCY: "",
    reportTypeList: [],
    from_date: "",
    to_date: "",
    ccyList: [],
    exchangeRateList: [],
    mstPara: [],
    selectedGrid: "",
    selectedRow: null,
    partnerDialogType: "",
    transTypeList: [],
    accountItem: {},
    PartnerItem: {},
    descriptionItem: {},
    getCcy: "",
    lstBizPlace: "",
    //expand 1
    showPersonal: false,
    showContract: false,
    showFlag: false,
    showSalary: false,
    _getAutoYn: "N",
    show_left: true,
    btnOtherInfor: "skip_next",
    btnDebit: "skip_prev",
    btnCredit: "skip_prev",
    showDebit: true,
    showCredit: true,
    cols_left: "3",
    btnIconType: "skip_prev",
    btnIconTypeDebit: "skip_next",
    l_tac_hgtrd_pk: "",
    l_tac_abacctcode_pk: "",
    l_drcr_type: "",
    grdControlTemp: [],
    btnReportIco: "excel",
    btnReportNM: "excel",
    selectedRowData: null,
    addType: "ACCOUNT_CD",
    sel_pro: "SYS_SEL_ACCOUNT_CODE_BY_INPUT",

    parentHeight: 0,
    childrenHeight: 0,
    childrenHeight2: 0,
    colspanDetail: 12,
    colspanGrdControl: 4,
  }),

  watch: {
    selectedReportType(val) {
      if (val) {
        const reportInfo = this.reportTypeList.find(
          (x) => x.CODE == this.selectedReportType
        );
        let reportType =
          reportInfo.VAL8 == "" ||
          reportInfo.VAL8 == "null" ||
          reportInfo.VAL8 == null ?
          ".xlsx" :
          reportInfo.VAL8; // report type
        this.btnReportIco = reportType == ".pdf" ? "pdf" : "excel";
        this.btnReportNM =
          reportType == ".pdf" ? this.$t("pdf") : this.$t("excel");
      }
    },
    async "mstData.TR_DATE"(val) {
      if (val) {
        this.exchangeRateList = await this._getExChangRateList(
          this.selectedCompany,
          this.mstData.TR_DATE
        );
      }
    },
    "mstData.AUTO_YN"(val) {
      if (val == "Y") {
        if (this.mstData.TR_STATUS == "N") {
          this.mstData.VOUCHER_NO = "";
        }
      }
    },
    from_date(val) {
      if (val) {
        this.leftSearch();
      }
    },
    selectedStatus(val) {
      if (!val) {
        this.selectedStatus = "%";
      }
      this.leftSearch();
    },
    async "mstData.TCO_COMPANY_PK"(val) {
      if (!val) {
        this.orgList = await this._getOrg(val);
      }
      this.onChangeCompany();
    },
    "mstData.PARTNER_NAME"(val) {
      if (!val) {
        this.mstData.TCO_BUSPARTNER_PK = "";
      }
    },
    "mstData.TR_PERSON"(val) {
      if (!val) {
        this.mstData.TAC_EMPLOYEE_ADV_PK = "";
      }
    },
    "mstData.TR_STATUS"(val) {
      if (val == "0" || val == "2" || val == "3") {
        this.btnStatus = true;
      } else {
        this.btnStatus = false;
      }
    },
    "mstData.VOUCHER_NO"(val) {
      if (val) {
        this.mstData.VOUCHER_NO = val.trim().toUpperCase();
      }
    },
  },
  mounted() {
    //this.leftSearch();
  },
  async created() {
    this.selectedCompany = this.user.TCO_COMPANY_PK;
    this.initMasterData();
    const seft = this;
    this.getCompanyList();
    const commoncode = await this._getCommonCode2(
      [
        "ACAB0110",
        "ACBG0130",
        "COAB0070",
        "GFQC0016",
        "ACBG0010",
        "ACBG0040",
        "EACAB004",
        "AUTOSAVE",
      ],
      this.selectedCompany
    );

    if (commoncode.length == 0 || commoncode == null) {
      console.log("Please check common code data. Cannot get common code.");
    }
    this.ccyList = commoncode[0];
    this.searchVoucherList = commoncode[1];
    this.voucherList = [...this.searchVoucherList];
    if (this.voucherList.length > 0) {
      this.mstData.VOUCHER_TYPE = this.voucherList[0].CODE;
    }
    this.searchVoucherList.push({
      CODE: "%",
      NAME: this.$t("all"),
    });
    this.orgList = await this._getOrg(this.selectedCompany);
    this.languageList = commoncode[2];
    //this.reportTypeList = commoncode[3];
    var copy_report = await this._getCommonCode("GFQC0016", ""); //[...commoncode[3]];
    copy_report = copy_report.filter(
      (x) =>
      x.DESCRIPTION == "RB" ||
      x.DESCRIPTION == "ALL" ||
      x.DESCRIPTION == "R" ||
      x.DESCRIPTION == "P" ||
      x.DESCRIPTION == "PB"
    );
    this.reportTypeList = copy_report.sort(function (a, b) {
      return b.ORD - a.ORD;
    });
    if (this.reportTypeList.length > 0) {
      console.log(this.reportTypeList);
      if (this.reportTypeList[0].DEF_YN == "Y") {
        this.selectedReportType = this.reportTypeList[0].CODE;
      }
    }
    this.statusList = commoncode[4];
    this.statusList.push({
      CODE: "%",
      NAME: this.$t("all"),
    });
    const result = commoncode[5];
    result.forEach((e) => {
      if (e.DEF_YN == "Y") {
        seft.txtBookCCY = e.CODE;
        seft.precision = e.VAL3;
      }
    });
    this.txtBookExRate = await this._getExchangeRate(
      this.to_date,
      this.selectedCompany,
      this.txtBookCCY
    );
    this.transTypeList = await this._callProcedure(
      "ac_sel_6025030_trans_type",
      [this.selectedCompany, "EACAB011", "6030010"]
    );
    if (this.transTypeList.length > 0) {
      this.mstData.TRANS_NAME =
        this.transTypeList[0].TR_TYPE + " - " + this.transTypeList[0].TR_TPNM;
      this.mstData.TAC_ABTRTYPE_PK = this.transTypeList[0].PK;
      this.mstData.DESCRIPTION = this.transTypeList[0].DESCRIPT;
      this.mstData.DESCRIPTION_LOCAL = this.transTypeList[0].DESCRIPTLOCAL;
      this.mstData.DESCRIPTION_FOREIGN = this.transTypeList[0].DESCRIPTKOR;
    }
    this.initPara();

    const dso_bizplace_list2 = {
      type: "list",
      selpro: "SYS_SEL_BIZ_PLACE_V2",
      para: [this.mstData.TCO_COMPANY_PK, this.user.PK],
    };
    this.bizPlaceListS = await this._dsoCall(
      dso_bizplace_list2,
      "select",
      false,
      "acntStyle"
    );
    if (this.bizPlaceListS.length > 0) {
      this.lstBizPlace = this.bizPlaceListS[0].PK;
    }

    const dso_bizplace_list = {
      type: "list",
      selpro: "SYS_SEL_BIZ_PLACE_V3",
      para: [this.mstData.TCO_COMPANY_PK, this.user.PK],
    };
    this.bizPlaceList = await this._dsoCall(
      dso_bizplace_list,
      "select",
      false,
      "acntStyle"
    );
    if (this.bizPlaceList.length > 0) {
      this.mstData.TCO_BUSPLACE_PK = this.bizPlaceList[0].PK;
    }
    // voucher YN EACAB004
    var get_auto = "",
      arr_auto = commoncode[6];
    for (var i = 0; i < arr_auto.length; i++) {
      if (arr_auto[i].DEF_YN == "Y") {
        get_auto = arr_auto[i].CODE;
        this.mstData.AUTO_YN = arr_auto[i].CODE;
        this._getAutoYn = arr_auto[i].CODE;
      }
    }
    if (get_auto == "") {
      this.mstData.AUTO_YN = "N";
      this._getAutoYn = "N";
    }
    const autosaveCode = commoncode[7];
    for (var i = 0; i < autosaveCode.length; i++) {
      if (autosaveCode[i].CODE == "6030014" && autosaveCode[i].VAL1 == "YES") {
        this.autosave = true;
      }
    }
  },
  computed: {
    /* heightLeft() {
      return this._calculateHeight(this.parentHeight, 80);
    },
    heightRight() {
      return this._calculateHeight(this.childrenHeight, 45);
    }, */
    dtlGridCols() {
      return 12 - this.ctlCols;
    },
    rightCols() {
      return 12 - this.leftCols;
    },
    ctlHeader() {
      const seft = this;
      const head1 = [{
          dataField: "ITEM_ALIAS",
          caption: this.$t("item_alias"),
          allowEditing: false,
          width: "100",
        },
        {
          dataField: "ITEM_CODE",
          caption: this.$t("item_code"),
          setCellValue: function (newData, value, currentRowData) {
            if (currentRowData.DATA_TYPE == "N") {
              //console.log( this._formatNumber(e.ITEM_CODE.replaceAll(",","")))
              newData.ITEM_CODE = seft._formatNumber(value.replaceAll(",", ""));
              //console.log('vng-154-dvg^_^: > file: 6030014.vue > line 618 > ctlHeader > this._formatNumber(value.replaceAll(",", ""))', seft._formatNumber(value.replaceAll(",", "")));
            } else if (currentRowData.ITEM_ALIAS == "SERIAL NO") {
              newData.ITEM_CODE = value.toString().toUpperCase();
            } else newData.ITEM_CODE = value;
          },
          width: "150",
        },
        {
          dataField: "ITEM_NAME",
          caption: this.$t("item_name"),
          width: "80",
        },
      ];
      return head1;
    },
    leftHeader() {
      const head1 = [{
          dataField: "PK",
          caption: this.$t("seq"),
          width: "auto",
        },
        {
          dataField: "VOUCHER_NO",
          caption: this.$t("voucher_no"),
          width: "auto",
        },
        {
          dataField: "TR_DATE",
          caption: this.$t("tr_date"),
          width: "auto",
          dataType: "date",
          format: this.curLang.DATE_FORMAT,
        },
        {
          dataField: "TR_TYPE",
          caption: this.$t("tr_type"),
          width: "auto",
        },
        {
          dataField: "TR_TPNM",
          caption: this.$t("tr_tpnm"),
          width: "auto",
        },
        {
          dataField: "BK_TOTAL_AMT",
          caption: this.$t("bk_total_amt"),
          width: "auto",
          alignment: "right",
        },
        {
          dataField: "DESCRIPTION",
          caption: this.$t("description"),
          width: "auto",
        },
        {
          dataField: "TR_STATUS",
          caption: this.$t("status"),
          width: "auto",
        },
        {
          dataField: "CRT_BY",
          caption: this.$t("crt_by"),
          width: "auto",
        },
        {
          dataField: "CANCEL_CAUSE",
          caption: this.$t("cancel_cause"),
          width: "auto",
        },
      ];
      return head1;
    },
    rightHeader() {
      const self = this;
      const head1 = [{
          dataField: "TYPE_REF",
          caption: this.$t("no"),
          allowEditing: true,
          width: 30,
        },
        {
          dataField: "AC_CD",
          caption: this.$t("account_code"),
          allowEditing: false,
          width: 80,
        },
        {
          dataField: "AC_NM",
          caption: this.$t("account_name"),
          allowEditing: false,
          width: 200,
        },
        {
          dataField: "CCY",
          caption: this.$t("ccy"),
          setCellValue: function (newData, value, currentRowData) {
            self.onChangeCCY(newData, value, currentRowData);
          },
          lookup: {
            displayExpr: "CODE",
            valueExpr: "CODE",
            dataSource: this.ccyList,
          },
          width: 100,
        },
        {
          dataField: "TR_RATE",
          caption: this.$t("ex_rate"),
          width: 80,
          setCellValue: function (newData, value, currentRowData) {
            if (value > 0) {
              newData.TR_RATE = value;
              newData.BK_AMT = (
                (currentRowData.TR_AMT * newData.TR_RATE) /
                currentRowData.BK_EX_RATE
              ).toFixed(self.precision);
              if (newData.TR_AMT == 0 || newData.TR_AMT == null) {
                newData.ACTUAL_EX_RATE = 0;
              } else {
                newData.ACTUAL_EX_RATE = (
                  newData.BK_AMT / currentRowData.TR_AMT
                ).toFixed(2);
              }
              self.sumDebitCredit();
            }
          },
        },
        {
          dataField: "TR_AMT",
          caption: this.$t("trans_amt"),
          width: 100,
          customizeText: function ({
            value
          }) {
            return `${self._formatNumber(value, 2)}`;
          },
          setCellValue: function (newData, value, currentRowData) {
            //if (value >= 0)
            {
              newData.TR_AMT = value;
              newData.BK_AMT = (
                (newData.TR_AMT * currentRowData.TR_RATE) /
                currentRowData.BK_EX_RATE
              ).toFixed(self.precision);

              if (newData.TR_AMT == 0 || newData.TR_AMT == null) {
                newData.ACTUAL_EX_RATE = 0;
              } else {
                newData.ACTUAL_EX_RATE = (
                  newData.BK_AMT / newData.TR_AMT
                ).toFixed(2);
              }
              self.sumDebitCredit();
            }
          },
        },
        {
          dataField: "BK_AMT",
          caption: this.$t("book_amt"),
          width: 80,
          customizeText: function ({
            value
          }) {
            return `${self._formatNumber(value, self.precision)}`;
          },
          setCellValue: function (newData, value, currentRowData) {
            //if (value >= 0)
            {
              newData.BK_AMT = value;
              if (newData.TR_AMT == 0 || newData.TR_AMT == null) {
                newData.ACTUAL_EX_RATE = 0;
              } else {
                newData.ACTUAL_EX_RATE = (
                  newData.BK_AMT / currentRowData.TR_AMT
                ).toFixed(2);
              }
              self.sumDebitCredit();
            }
          },
        },
        {
          dataField: "DESCRIPTION",
          caption: this.$t("description"),
          width: 200,
        },
        {
          dataField: "DESCRIPTION_LOCAL",
          caption: this.$t("description_local"),
          width: 200,
        },
        {
          dataField: "BK_EX_RATE",
          caption: this.$t("book_ex_rate"),
          width: 80,
        },
        {
          dataField: "ACTUAL_EX_RATE",
          caption: this.$t("actual_ex_rate"),
          width: 80,
          allowEditing: true,
        },
        {
          dataField: "DESCRIPTION_FOREIGN",
          caption: this.$t("description_foreign"),
        },
      ];
      return head1;
    },
    /* limitHeight() {
      return this.windowHeight - 160;
    },
    limitHeightLeft() {
      return Math.floor(this.formContainerHeight * 0.65);
    },
    limitHeightRight() {
      return this.limitHeight * 0.6 + 20;
    },
    limitHeightRightHiden() {
      return this.showCredit == false || this.showDebit == false ? this.limitHeight * 0.6 + 20 : (this.limitHeight * 0.6 + 20) / 2;
    }, */
    user() {
      return this.$store.getters["auth/user"];
    },
    gridLeftHeight() {
      return this._calculateHeight(this.childrenHeight, 70)
    },
    gridRightHeight() {
      return this.showCredit == false || this.showDebit == false ? Math.floor(this.childrenHeight2 - (38*2) -32) : this._calculateHeight(Math.floor(this.childrenHeight2 - (38*2) -32), 50);
    },
    gridRightHiddenHeight() {
      return this._calculateHeight(this.childrenHeight2, 90);
    }
  },
  methods: {
    async focusCellChangingDebit(e) {
      console.log("focusCellChangingDebit", e);
      if (e.newRowIndex !== e.prevRowIndex && this.autosave == true) {
        // console.log("focusCellChangingDebit",e.newRowIndex)
        this.ctlChanging = "debit";
        // this.$refs.refRemindDataChangedDialog.showConfirm(
        //     this.$t("grid_debit_changed_do_you_want_to_save")
        // );
        await this.onSaveDebit(this.mstData.PK, this.mstData.TCO_BUSPLACE_PK);
      }
    },
    async focusCellChangingCredit(e) {
      console.log("focusCellChangingCredit", e);
      if (e.newRowIndex !== e.prevRowIndex && this.autosave == true) {
        //console.log("focusCellChangingCredit",e.newRowIndex)
        this.ctlChanging = "credit";
        // this.$refs.refRemindDataChangedDialog.showConfirm(
        //     this.$t("grid_creit_changed_do_you_want_to_save")
        // );
        await this.onSaveCredit(this.mstData.PK, this.mstData.TCO_BUSPLACE_PK);
      }
    },
    async focusCellChangingCtlItem(e) {
      if (e.newRowIndex !== e.prevRowIndex && this.autosave == true) {
        //console.log("focusCellChangingCtlItem",e.newRowIndex)
        this.ctlChanging = "ctlitem";
        // this.$refs.refRemindDataChangedDialog.showConfirm(
        //     this.$t("grid_control_item_changed_do_you_want_to_save")
        // );
        await this.saveDsoCtl();
      }
    },
    async confirmDataChanged() {
      if (this.ctlChanging == "debit") {
        await this.onSaveDebit(this.mstData.PK, this.mstData.TCO_BUSPLACE_PK);
      } else if (this.ctlChanging == "credit") {
        await this.onSaveCredit(this.mstData.PK, this.mstData.TCO_BUSPLACE_PK);
      } else if (this.ctlChanging == "ctlitem") {
        await this.saveDsoCtl();
      }
    },
    onSelectionDebitChanged({
      selectedRowsData
    }) {
      let totalSumTransDebit = 0,
        totalSumBookDebit = 0;

      this.selectedDebitDatas = selectedRowsData;
      this.selectedDebitDatas.forEach((e) => {
        totalSumTransDebit += parseFloat(e.TR_AMT);
        totalSumBookDebit += parseFloat(e.BK_AMT);
      });

      this.txtSumBookDebit = this._formatNumber(
        totalSumBookDebit,
        this.precision
      );
      this.txtSumTransDebit = this._formatNumber(totalSumTransDebit, 2);
    },
    onSelectionCreditChanged({
      selectedRowsData
    }) {
      let totalSumTransCredit = 0,
        totalSumBookCredit = 0;

      this.selectedCreditDatas = selectedRowsData;
      this.selectedCreditDatas.forEach((e) => {
        totalSumTransCredit += parseFloat(e.TR_AMT);
        totalSumBookCredit += parseFloat(e.BK_AMT);
      });

      this.txtSumBookCredit = this._formatNumber(
        totalSumBookCredit,
        this.precision
      );
      this.txtSumTransCredit = this._formatNumber(totalSumTransCredit, 2);
    },
    sumDebitCredit() {
      self = this;
      let totalTransDebit = 0,
        totalBookDebit = 0,
        totalTransCredit = 0,
        totalBookCredit = 0;

      this.debitList = this.$refs.grdDebit.getDataSource();
      self.debitList.forEach((e) => {
        totalTransDebit += parseFloat(e.TR_AMT);
        totalBookDebit += parseFloat(e.BK_AMT);
      });
      self.txtTotalBookDebit = self._formatNumber(
        totalBookDebit,
        self.precision
      );
      self.txtTotalTransDebit = self._formatNumber(totalTransDebit, 2);
      this.creditList = this.$refs.grdCredit.getDataSource();
      self.creditList.forEach((e) => {
        totalTransCredit += parseFloat(e.TR_AMT);
        totalBookCredit += parseFloat(e.BK_AMT);
      });
      self.txtTotalBookCredit = self._formatNumber(
        totalBookCredit,
        self.precision
      );
      self.txtTotalTransCredit = self._formatNumber(totalTransCredit, 2);
    },
    BuildDynamicHeader(p_table_nm) {
      self = this;
      let header = [];
      if (p_table_nm == "TAC_BFBENEFICIARY") {
        header = [{
            dataField: "CODE",
            caption: this.$t("account_no"),
          },
          {
            dataField: "NAME",
            caption: this.$t("bank_name"),
          },
          {
            dataField: "PARTNER_NAME",
            caption: this.$t("partner_name"),
          },
          {
            dataField: "CCY",
            caption: this.$t("ccy"),
          },
          {
            dataField: "BRANCH",
            caption: this.$t("branch"),
          },
        ];
        return header;
      } else if (p_table_nm == "TCO_BUSPLACE") {
        header = [{
            dataField: "CODE",
            caption: this.$t("location_id"),
          },
          {
            dataField: "NAME",
            caption: this.$t("location_name"),
          },
        ];
        return header;
      } else if (p_table_nm == "TAC_ABITEMCODE") {
        header = [{
            dataField: "CODE",
            caption: this.codeLabel,
          },
          {
            dataField: "NAME",
            caption: this.nameLabel,
          },
        ];
        return header;
      } else if (p_table_nm == "TAC_EMPLOYEE_ADV") {
        header = [{
            dataField: "ORG_NM",
            caption: this.$t("organization_name"),
          },
          {
            dataField: "CODE",
            caption: this.$t("employee_id"),
          },
          {
            dataField: "NAME",
            caption: this.$t("full_name"),
          },
          {
            dataField: "FULL_FNAME",
            caption: this.$t("full_fname"),
          },
          {
            dataField: "JOIN_DT",
            caption: this.$t("join_date"),
          },
          {
            dataField: "PL_NM",
            caption: this.$t("pl_name"),
          },
        ];
        return header;
      } else if (p_table_nm == "TAC_ABDEPOMT") {
        header = [{
            dataField: "CODE",
            caption: this.codeLabel,
          },
          {
            dataField: "NAME",
            caption: this.nameLabel,
          },
          {
            dataField: "ACCOUNT_NO",
            caption: this.$t("account_no"),
          },
          {
            dataField: "CCY",
            caption: this.$t("ccy"),
          },
          {
            dataField: "BRANCH",
            caption: this.$t("branch"),
          },
        ];
        return header;
      } else if (p_table_nm == "TAC_NOTE_MST") {
        header = [{
            dataField: "CODE",
            caption: this.$t("note_no"),
          },
          {
            dataField: "TR_DATE",
            caption: this.$t("trans_date"),
            dataType: "date",
            format: this.curLang.DATE_FORMAT,
          },
          {
            dataField: "TR_BOOKAMT",
            caption: this.$t("amount"),
            customizeText: function ({
              value
            }) {
              return `${self._formatNumber(value, 0)}`;
            },
          },
          {
            dataField: "PARTNER_ID",
            caption: this.$t("partner_id"),
          },
          {
            dataField: "PARTNER_NAME",
            caption: this.$t("partner_name"),
          },
          {
            dataField: "PUBLISHER",
            caption: this.$t("publisher"),
          },
          {
            dataField: "NAME",
            caption: this.$t("issue_date"),
            dataType: "date",
            format: this.curLang.DATE_FORMAT,
          },
          {
            dataField: "EXPIRATION_DATE",
            caption: this.$t("expired_date"),
            dataType: "date",
            format: this.curLang.DATE_FORMAT,
          },
        ];
        return header;
      } else if (p_table_nm == "BUDGET_TYPE") {
        header = [{
            dataField: "INOUT_NAME",
            caption: this.$t("inout_nm"),
          },
          {
            dataField: "BUDGET_CODE",
            caption: this.$t("budget_cd"),
          },
          {
            dataField: "BUDGET_NM",
            caption: this.$t("budget_nm"),
          },
          {
            dataField: "DESCRIPTION_NM",
            caption: this.$t("description"),
          },
        ];
        return header;
      }
    },
    onChangeCCY(newData, value, currentRowData) {
      const ex_rate = this.getExchangeRate(value);
      if (ex_rate > 0 && ex_rate != undefined) {
        newData.CCY = value;
        newData.TR_RATE = ex_rate;
        newData.BK_AMT = Math.round(
          (currentRowData.TR_AMT * newData.TR_RATE) / currentRowData.BK_EX_RATE,
          2
        );
      } else {
        this.showNotification(
          "danger",
          this.$t("not_found_ex_rate") + "[" + value + "]",
          "",
          3000
        );
      }
    },
    initPara() {
      this.mstPara = [
        "_rowstatus",
        "PK",
        "TCO_COMPANY_PK",
        "AUTO_YN",
        "VOUCHER_TYPE",
        "VOUCHER_NO",
        "TR_DATE",
        "TCO_ORG_PK",
        "TAC_ABTRTYPE_PK",
        "DESCRIPTION",
        "DESCRIPTION_LOCAL",
        "DESCRIPTION_FOREIGN",
        "TR_ENCLOSE",
        "TCO_BUSPARTNER_PK",
        "TAC_EMPLOYEE_ADV_PK",
        "TCO_BUSPLACE_PK",
      ];
    },
    onAddNew() {
      this.showNotification("success", this.$t("Now you can register new"), "");
      this.initMasterData();
    },
    async onSave() {
      if (!this.mstData.DESCRIPTION) {
        this.$refs.inputDescription.focus();
        return this.showNotification(
          "danger",
          this.$t("please_input_description"),
          "",
          4000
        );
      }
      if (!this.mstData.DESCRIPTION_LOCAL) {
        this.$refs.inputDescriptionLocal.focus();
        return this.showNotification(
          "danger",
          this.$t("please_input_description_local"),
          "",
          4000
        );
      }

      if (this.mstData.AUTO_YN == "N" && this.mstData.VOUCHER_NO == "") {
        return this.showNotification(
          "danger",
          this.$t("please_input_voucher_no"),
          "",
          4000
        );
      }
      if (this.mstData.TR_STATUS != "1" && this.mstData.TR_STATUS != "N") {
        return this.showNotification(
          "warning",
          this.$t("slip_was_confirmed_or_approved_cannot_change"),
          "",
          4000
        );
      }
      if (this.mstData._rowstatus !== "i" && this.mstData._rowstatus !== "d") {
        this.mstData._rowstatus = "u";
      }
      const dso = {
        type: "control",
        selpro: "ac_sel_6030014_master",
        updpro: "ac_upd_6030014_master",
        para: [this.mstData.PK],
        elname: this.mstPara,
        data: this.mstData,
      };
      this.showLoading = true;
      let row = await this._dsoCall(dso, "update", false, "acntStyle");
      this.showLoading = false;

      if (row) {
        this.showNotification("success", this.$t("Save_success"), "");
        if (row) {
          this.mstData = {
            ...row,
          };
          await this.onSaveCredit(row.PK, row.TCO_BUSPLACE_PK);
          await this.onSaveDebit(row.PK, row.TCO_BUSPLACE_PK);
        }
      } else {
        this.showNotification(
          "danger",
          this.$t("Something went wrong, please try again later."),
          ""
        );
      }
    },
    async onDelete() {
      this.onCancel();
    },
    async onConfirm() {
      if (!this.mstData.PK) {
        return this.showNotification(
          "warning",
          this.$t("please_save_data_firstly"),
          "",
          5000
        );
      }
      this.action = "confirm";
      this.$refs.refConfirmDialog.showConfirm(
        this.$t("do_you_want_confirm_this_slip")
      );
    },
    async confirmMaster(p_item) {
      if (this.action == "confirm") {
        if (!this.mstData.PK) {
          return this.showNotification(
            "warning",
            this.$t("please_save_data_firstly"),
            "",
            5000
          );
        }
        const dso = {
          type: "process",
          updpro: "ac_pro_6030010_mst_confirm",
          para: [this.mstData.PK],
        };
        const result = await this._dsoCall(dso, "process", false, "acntStyle");
        if (result) {
          this.showNotification(
            "success",
            this.$t("confirm_sucessfull"),
            "",
            5000
          );
          this.searchMaster(this.mstData.PK, this.lstBizPlace);
        }
      } else if (this.action == "cancel") {
        var dso = {
          type: "process",
          updpro: "ac_pro_6030014_cancel_confirm",
          para: [this.mstData.PK, p_item.MSGTEXT, "TAC_HGTRH"],
        };
        if (p_item.TYPE == "R") {
          dso = {
            type: "process",
            updpro: "AC_PRO_6030014_REVERSE_CONFIRM",
            para: [
              this.mstData.PK,
              p_item.MSGTEXT,
              p_item.MSGDATE,
              "TAC_HGTRH",
            ],
          };
        }

        const result = await this._dsoCall(dso, "process", false, "acntStyle");
        if (result != undefined && result && result[0].STATUS) {
          this.showNotification("success", this.$t(result[0].STATUS), "", 5000);
          this.searchMaster(this.mstData.PK, this.lstBizPlace);
        }
      } else if (this.action == "replicate") {
        const dso = {
          type: "process",
          updpro: "ac_pro_6030014_REPLICATE_SLIP",
          para: [this.mstData.PK, this.mstData.TCO_COMPANY_PK],
        };
        const result = await this._dsoCall(dso, "process", false, "acntStyle");
        if (result && result[0].PK > 0) {
          this.showNotification(
            "success",
            this.$t("copy_sucessfull"),
            "",
            5000
          );
          this.searchMaster(result[0].PK, result[0].TCO_BUSPLACE_PK);
        }
      } else if (this.action == "copy") {
        const dso = {
          type: "process",
          updpro: "ac_pro_6030014_copy_slip",
          para: [this.mstData.PK],
        };
        const result = await this._dsoCall(dso, "process", false, "acntStyle");
        if (result != undefined && result && result[0].PK > 0) {
          this.showNotification(
            "success",
            this.$t("copy_sucessfull"),
            "",
            5000
          );
          this.searchMaster(result[0].PK, result[0].TCO_BUSPLACE_PK);
        }
      } else if (this.action == "copy-detail") {
        const dso = {
          type: "process",
          updpro: "ac_pro_6030014_dtl_copy",
          para: [this.selectedRowDetail.data.PK],
        };
        const result = await this._dsoCall(dso, "process", false, "acntStyle");
        if (result != undefined && result && result[0].STATUS) {
          this.showNotification("success", this.$t(result[0].STATUS), "", 5000);
          this.searchDetail(this.mstData.PK, this.mstData.TCO_BUSPLACE_PK);
        }
      }
    },
    async onCancel() {
      if (this.mstData.TR_STATUS == "0") {
        return this.showNotification(
          "warning",
          this.$t("cannot_cancel_slip_approved"),
          "",
          5000
        );
      }
      this.action = "cancel";
      this.$refs.refConfirmDialog.showCancel(
        this.$t("do_you_want_cancel_this_slip"),
        null,
        true
      );
    },
    async onReplicate() {
      if (!this.mstData.PK) {
        return this.showNotification(
          "warning",
          this.$t("please_save_data_firstly"),
          "",
          5000
        );
      }
      this.action = "replicate";
      this.$refs.refConfirmDialog.showConfirm(
        this.$t("do_you_want_replicate_this_slip")
      );
    },
    async onCopy() {
      if (!this.mstData.PK) {
        return this.showNotification(
          "warning",
          this.$t("please_save_data_firstly"),
          "",
          5000
        );
      }
      this.action = "copy";
      this.$refs.refConfirmDialog.showConfirm(
        this.$t("do_you_want_copy_this_slip")
      );
    },
    validateControl() {
      this.ctlList = this.$refs.grdControl.getDataSource();
      for (let i = 0; i < this.ctlList.length; i++)
        if (
          this.ctlList[i].MANDATORY_YN == "Y" &&
          !this.ctlList[i].ITEM_CODE &&
          this.selectedRowDetail.data._rowstatus != "d"
        ) {
          this.showNotification(
            "danger",
            `Field ${this.$t("item_code")} at row ${
              this.ctlList[i].ITEM_ALIAS
            } must not empty!`,
            "",
            10000
          );
          return false;
        }
      return true;
    },
    async onSaveCtl() {
      if (this.mstData.TR_STATUS != "1" && this.mstData.TR_STATUS != "N") {
        return this.showNotification(
          "warning",
          this.$t("cannot_modify_this_slip"),
          "",
          5000
        );
      }
      if (!this.validateControl()) {
        return;
      }

      const pk = "" + this.selectedRowDetail.data.PK;
      this.onSave();
    },
    async saveDsoCtl() {
      if (this.$refs.grdControl.isDataGridChanged() == false) {
        return;
      }
      this.ctlList = this.$refs.grdControl.getDataSource();
      //console.log('vng-154-dvg^_^: > file: 6030014.vue > line 1368 > saveDsoCtl > this.ctlList', this.ctlList);
      if (this.ctlList.length == 0) {
        return;
      }
      if (!this.validateControl()) {
        return;
      }
      let tac_hgtrd_pk = "";
      if (this.selectedRowDetail.data.DRCR_TYPE == "D") {
        //console.log('vng-154-dvg^_^: > file: 6030014.vue > line 1377 > saveDsoCtl > this.selectedRowDetail.data', this.selectedRowDetail.data);
        this.debitList = this.$refs.grdDebit.getDataSource();
        this.debitList.forEach((e) => {
          if (e.DRCR_ORD == this.selectedRowDetail.data.DRCR_ORD) {
            tac_hgtrd_pk = e.PK;
          }
        });
      } else if (this.selectedRowDetail.data.DRCR_TYPE == "C") {
        this.creditList = this.$refs.grdCredit.getDataSource();
        this.creditList.forEach((e) => {
          if (e.DRCR_ORD == this.selectedRowDetail.data.DRCR_ORD) {
            tac_hgtrd_pk = e.PK;
          }
        });
      }
      console.log("tac_hgtrd_pk", tac_hgtrd_pk);
      if (!tac_hgtrd_pk) {
        this.searchCtl(0, 0, "");
        return;
        // return this.showNotification(
        //     "warning",
        //     "some_thing_wrong_with_control_item",
        //     "",
        //     3000
        // );
      }
      this.ctlList.forEach((e) => {
        if (e._rowstatus == "u") {
          e.TAC_HGTRD_PK = tac_hgtrd_pk;
        }
        this.ctlList_formatNumber("C");
      });
      const dso = {
        type: "grid",
        selpro: "ac_sel_6030014_control",
        updpro: "ac_upd_6030014_control",
        para: [
          tac_hgtrd_pk,
          this.selectedRowDetail.data.TAC_ABACCTCODE_PK,
          this.selectedRowDetail.data.DRCR_TYPE,
        ],
        elname: [
          "_rowstatus",
          "PK",
          "TAC_HGTRD_PK",
          "TAC_ABACCTITEM_PK",
          "ITEM_CODE",
          "ITEM_NAME",
          "TABLE_NM",
          "TABLE_PK",
        ],
        data: this.ctlList,
      };

      this.SetItemToGridTmp();
      this.showLoading = true;
      const result = await this._dsoCall(dso, "update", false, "acntStyle");
      this.showLoading = false;
      //console.log("result",result)
      if (result) {
        //this.$refs.grdControl.setDataSource(result);
        this.ctlList = result;
        this.ctlList_formatNumber("F");
        this.$refs.grdControl.setDataSource(this.ctlList);
      }
    },
    onAddNewDebit(obj) {
      if (this.mstData.TR_STATUS != "1" && this.mstData.TR_STATUS != "N") {
        return this.showNotification(
          "warning",
          this.$t("cannot_modify_this_slip"),
          "",
          5000
        );
      }
      this.addType = obj;
      this.multiSelectMode = true;
      this.selectedGrid = "D";
      this.openAccountDialog();
    },
    openApplyInvoice(_TAC_ABACCTCODE_PK, _AC_CD, _AC_NM, _CCY) {
      this.accountItem = {
        PK: _TAC_ABACCTCODE_PK,
        CODE: _AC_CD,
        NAME: _AC_NM,
      };
      this.PartnerItem = {
        PK: this.mstData.TCO_BUSPARTNER_PK,
        CODE: this.mstData.PARTNER_ID,
        NAME: this.mstData.PARTNER_NAME,
      };
      this.descriptionItem = {
        DESCRIPTION: this.mstData.DESCRIPTION,
        DESCRIPTION_LOCAL: this.mstData.DESCRIPTION_LOCAL,
        DESCRIPTION_FOREIGN: this.mstData.DESCRIPTION_FOREIGN,
      };
      this.getCcy = _CCY;
      this.multiSelectMode = true;
      this.$refs.ctrlapplyinvoice.dialogIsShow = true;
    },
    async onSaveDebit(p_tac_hgtrh_pk, p_bizplace) {
      if (this.mstData.TR_STATUS != "1" && this.mstData.TR_STATUS != "N") {
        return this.showNotification(
          "warning",
          this.$t("cannot_modify_this_slip"),
          "",
          5000
        );
      }
      if (!this.validateControl()) {
        return;
      }
      if (!p_tac_hgtrh_pk) {
        return this.onSave();
      }
      if (
        this.$refs.grdDebit.isDataGridChanged() == false &&
        this.$refs.grdControl.isDataGridChanged() == false
      ) {
        return;
      }
      this.debitList = this.$refs.grdDebit.getDataSource();
      this.debitList.forEach((e) => {
        e.TAC_HGTRH_PK = this.mstData.PK;
      });
      const dso = {
        type: "grid",
        selpro: "ac_sel_6030014_detail",
        updpro: "ac_upd_6030014_detail",
        para: [p_tac_hgtrh_pk, "D", p_bizplace],
        elname: [
          "_rowstatus",
          "PK",
          "TAC_HGTRH_PK",
          "TAC_ABACCTCODE_PK",
          "TYPE_REF",
          "CCY",
          "TR_RATE",
          "TR_AMT",
          "BK_AMT",
          "BK_EX_RATE",
          "ACTUAL_EX_RATE",
          "DESCRIPTION",
          "DESCRIPTION_LOCAL",
          "DESCRIPTION_FOREIGN",
          "DRCR_TYPE",
          "DRCR_ORD",
        ],
        requirecol: [
          "TYPE_REF",
          "CCY",
          "TR_AMT",
          "BK_AMT",
          "TR_RATE",
          "DESCRIPTION",
          "DESCRIPTION_LOCAL",
        ],
        data: this.debitList,
      };
      this.showLoading = true;
      const result = await this._dsoCall(dso, "update", false, "acntStyle");
      if (result) {
        this.debitList = result;
        this.$refs.grdDebit.setDataSource(result);
        console.log("D", this.selectedRowDetail.data);
        if (
          this.selectedRowDetail.data != undefined &&
          this.selectedRowDetail.data.DRCR_TYPE == "D"
        ) {
          this.saveDsoCtl();
        }
      }
      this.showLoading = false;
      this.sumDebitCredit();
    },
    onDeleteDebit() {
      if (this.mstData.TR_STATUS != "1" && this.mstData.TR_STATUS != "N") {
        return this.showNotification(
          "warning",
          this.$t("cannot_modify_this_slip"),
          "",
          5000
        );
      }
      this.showCtl = false;
      this.$refs.grdDebit.deleteRows();
      this.grdControlTemp = [];
    },
    onCopyDebit() {
      if (this.mstData.TR_STATUS != "1") {
        return this.showNotification(
          "warning",
          this.$t("cannot_modify_this_slip"),
          "",
          5000
        );
      }
      if (this.selectedRowDetail.rowIndex == undefined) {
        return this.showNotification(
          "warning",
          this.$t("please_select_row_to_copy"),
          "",
          5000
        );
      }
      if (this.selectedRowDetail.data.DRCR_TYPE != "D") {
        return this.showNotification(
          "warning",
          this.$t("please_select_row_to_copy"),
          "",
          5000
        );
      }
      this.action = "copy-detail";
      this.$refs.refConfirmDialog.showConfirm(this.$t("do_you_want_copy"));
    },
    onUpDebit() {
      if (this.mstData.TR_STATUS != "1" && this.mstData.TR_STATUS != "N") {
        return this.showNotification(
          "warning",
          this.$t("cannot_modify_this_slip"),
          "",
          5000
        );
      }
      if (this.selectedRowDetail.data.DRCR_TYPE !== "D") {
        return this.showNotification(
          "warning",
          this.$t("please_select_row_to_move"),
          "",
          5000
        );
      }
      this.debitList = this.$refs.grdDebit.getDataSource();
      if (this.debitList.length <= 1) {
        return;
      }
      this.debitList.forEach((e, idx) => {
        if (e.PK == this.selectedRowDetail.data.PK) {
          if (idx > 0) {
            this.debitList[idx].DRCR_ORD = idx - 1;
            this.debitList[idx - 1].DRCR_ORD = idx;
            if (this.debitList[idx]._rowstatus !== "i") {
              this.debitList[idx]._rowstatus = "u";
            }
            if (this.debitList[idx - 1]._rowstatus !== "i") {
              this.debitList[idx - 1]._rowstatus = "u";
            }
            this.debitList = this._arrayMove(this.debitList, idx, idx - 1);
            return;
          }
        }
      });
    },
    onDownDebit() {
      if (this.mstData.TR_STATUS != "1" && this.mstData.TR_STATUS != "N") {
        return this.showNotification(
          "warning",
          this.$t("cannot_modify_this_slip"),
          "",
          5000
        );
      }
      if (this.selectedRowDetail.data.DRCR_TYPE !== "D") {
        return this.showNotification(
          "warning",
          this.$t("please_select_row_to_move"),
          "",
          5000
        );
      }
      this.debitList = this.$refs.grdDebit.getDataSource();
      if (this.debitList.length <= 1) {
        return;
      }
      this.debitList.forEach((e, idx) => {
        if (e.PK == this.selectedRowDetail.data.PK) {
          if (idx < this.debitList.length - 1) {
            this.debitList[idx].DRCR_ORD = idx + 1;
            this.debitList[idx + 1].DRCR_ORD = idx;
            if (this.debitList[idx]._rowstatus !== "i") {
              this.debitList[idx]._rowstatus = "u";
            }
            if (this.debitList[idx + 1]._rowstatus !== "i") {
              this.debitList[idx + 1]._rowstatus = "u";
            }
            this.debitList = this._arrayMove(this.debitList, idx, idx + 1);
            return;
          }
        }
      });
    },
    onAdjustExRate() {},
    onAddNewCredit(obj) {
      if (this.mstData.TR_STATUS != "1" && this.mstData.TR_STATUS != "N") {
        return this.showNotification(
          "warning",
          this.$t("cannot_modify_this_slip"),
          "",
          5000
        );
      }
      this.addType = obj;
      this.multiSelectMode = true;
      this.selectedGrid = "C";
      this.openAccountDialog();
    },
    async onSaveCredit(p_tac_hgtrh_pk, p_bizplace) {
      if (this.mstData.TR_STATUS != "1" && this.mstData.TR_STATUS != "N") {
        return this.showNotification(
          "warning",
          this.$t("cannot_modify_this_slip"),
          "",
          5000
        );
      }
      if (!this.validateControl()) {
        return;
      }
      if (!p_tac_hgtrh_pk) {
        return this.onSave();
      }
      if (
        this.$refs.grdCredit.isDataGridChanged() == false &&
        this.$refs.grdControl.isDataGridChanged() == false
      ) {
        return;
      }
      this.creditList = this.$refs.grdCredit.getDataSource();
      this.creditList.forEach((e) => {
        e.TAC_HGTRH_PK = this.mstData.PK;
      });
      const dso = {
        type: "grid",
        selpro: "ac_sel_6030014_detail",
        updpro: "ac_upd_6030014_detail",
        para: [p_tac_hgtrh_pk, "C", p_bizplace],
        elname: [
          "_rowstatus",
          "PK",
          "TAC_HGTRH_PK",
          "TAC_ABACCTCODE_PK",
          "TYPE_REF",
          "CCY",
          "TR_RATE",
          "TR_AMT",
          "BK_AMT",
          "BK_EX_RATE",
          "ACTUAL_EX_RATE",
          "DESCRIPTION",
          "DESCRIPTION_LOCAL",
          "DESCRIPTION_FOREIGN",
          "DRCR_TYPE",
          "DRCR_ORD",
        ],
        requirecol: [
          "TYPE_REF",
          "CCY",
          "TR_AMT",
          "BK_AMT",
          "TR_RATE",
          "DESCRIPTION",
          "DESCRIPTION_LOCAL",
        ],
        data: this.creditList,
      };
      this.showLoading = true;
      const result = await this._dsoCall(dso, "update", false, "acntStyle");
      if (result) {
        this.creditList = result;
        this.$refs.grdCredit.setDataSource(result);
        console.log("C", this.selectedRowDetail.data);
        if (
          this.selectedRowDetail.data != undefined &&
          this.selectedRowDetail.data.DRCR_TYPE == "C"
        ) {
          this.saveDsoCtl();
        }
      }
      this.showLoading = false;
      this.sumDebitCredit();
    },
    onDeleteCredit() {
      if (this.mstData.TR_STATUS != "1" && this.mstData.TR_STATUS != "N") {
        return this.showNotification(
          "warning",
          this.$t("cannot_modify_this_slip"),
          "",
          5000
        );
      }
      this.showCtl = false;
      this.$refs.grdCredit.deleteRows();
      this.grdControlTemp = [];
    },
    onCopyCredit() {
      if (this.mstData.TR_STATUS != "1") {
        return this.showNotification(
          "warning",
          this.$t("cannot_modify_this_slip"),
          "",
          5000
        );
      }
      if (this.selectedRowDetail.rowIndex == undefined) {
        return this.showNotification(
          "warning",
          this.$t("please_select_row_to_copy"),
          "",
          5000
        );
      }
      if (this.selectedRowDetail.data.DRCR_TYPE != "C") {
        return this.showNotification(
          "warning",
          this.$t("please_select_row_to_copy"),
          "",
          5000
        );
      }
      this.action = "copy-detail";
      this.$refs.refConfirmDialog.showConfirm(this.$t("do_you_want_copy"));
    },
    onUpCredit() {
      if (this.mstData.TR_STATUS != "1" && this.mstData.TR_STATUS != "N") {
        return this.showNotification(
          "warning",
          this.$t("cannot_modify_this_slip"),
          "",
          5000
        );
      }
      if (this.selectedRowDetail.data.DRCR_TYPE !== "C") {
        return this.showNotification(
          "warning",
          this.$t("please_select_row_to_move"),
          "",
          5000
        );
      }
      this.creditList = this.$refs.grdCredit.getDataSource();
      if (this.creditList.length <= 1) {
        return;
      }
      this.creditList.forEach((e, idx) => {
        if (e.PK == this.selectedRowDetail.data.PK) {
          if (idx > 0) {
            this.creditList[idx].DRCR_ORD = idx - 1;
            this.creditList[idx - 1].DRCR_ORD = idx;
            if (this.creditList[idx]._rowstatus !== "i") {
              this.creditList[idx]._rowstatus = "u";
            }
            if (this.creditList[idx - 1]._rowstatus !== "i") {
              this.creditList[idx - 1]._rowstatus = "u";
            }
            this.creditList = this._arrayMove(this.creditList, idx, idx - 1);
            return;
          }
        }
      });
    },
    onDownCredit() {
      if (this.mstData.TR_STATUS != "1" && this.mstData.TR_STATUS != "N") {
        return this.showNotification(
          "warning",
          this.$t("cannot_modify_this_slip"),
          "",
          5000
        );
      }
      if (this.selectedRowDetail.data.DRCR_TYPE !== "C") {
        return this.showNotification(
          "warning",
          this.$t("please_select_row_to_move"),
          "",
          5000
        );
      }
      this.creditList = this.$refs.grdCredit.getDataSource();
      if (this.creditList.length <= 1) {
        return;
      }
      this.creditList.forEach((e, idx) => {
        if (e.PK == this.selectedRowDetail.data.PK) {
          if (idx < this.creditList.length - 1) {
            this.creditList[idx].DRCR_ORD = idx + 1;
            this.creditList[idx + 1].DRCR_ORD = idx;
            if (this.creditList[idx]._rowstatus !== "i") {
              this.creditList[idx]._rowstatus = "u";
            }
            if (this.creditList[idx + 1]._rowstatus !== "i") {
              this.creditList[idx + 1]._rowstatus = "u";
            }
            this.creditList = this._arrayMove(this.creditList, idx, idx + 1);
            return;
          }
        }
      });
    },
    updateRowStatusDebit(row) {
      if (!row.cancel) {
        if (row.data._rowstatus !== "i") {
          row.data._rowstatus = "u";
        }
      }
    },
    updateRowStatusCredit(row) {
      if (!row.cancel) {
        if (row.data._rowstatus !== "i") {
          row.data._rowstatus = "u";
        }
      }
    },
    updateRowStatusControl(row) {
      // console.log('vng-154-dvg^_^: > file: 6030014.vue > line 1897 > updateRowStatusControl > row', row);
      this.ctlList_formatNumber("F");
      if (!row.cancel) {
        if (row.data._rowstatus !== "i") {
          row.data._rowstatus = "u";
        }
      }
    },
    onRowClickDebit(row) {
      //console.log('vng-154-dvg^_^: > file: 6030014.vue > line 1846 > onRowClickDebit > row', row);
      this.selectedRowDetail = {
        ...row,
      };
      this.selectedGrid = "D";
      this.selectedRowData = row;
      // console.log('vng-154-dvg^_^: > file: 6030014.vue > line 1964 > cellCreditDblClick >  this.selectedRowData',  this.selectedRowData);
      this.searchCtl(
        row.data.PK,
        row.data.TAC_ABACCTCODE_PK,
        row.data.DRCR_TYPE
      );
    },
    onRowClickCredit(row) {
      this.selectedRowDetail = {
        ...row,
      };
      this.selectedGrid = "C";
      this.selectedRowData = row;
      // console.log('vng-154-dvg^_^: > file: 6030014.vue > line 1964 > cellCreditDblClick >  this.selectedRowData',  this.selectedRowData);
      this.searchCtl(
        row.data.PK,
        row.data.TAC_ABACCTCODE_PK,
        row.data.DRCR_TYPE
      );
    },
    cellDebitDblClick(row) {
      this.selectedRowData = row;
      // console.log('vng-154-dvg^_^: > file: 6030014.vue > line 1964 > cellCreditDblClick >  this.selectedRowData',  this.selectedRowData);
      if (
        row.column.dataField === "AC_CD" ||
        row.column.dataField === "AC_NM"
      ) {
        this.multiSelectMode = false;
        this.selectedGrid = "D";
        this.selectedRow = row;
        this.selectedRowData = row;
        this.openAccountDialog();
      }
    },
    cellCreditDblClick(row) {
      this.selectedRowData = row;
      // console.log('vng-154-dvg^_^: > file: 6030014.vue > line 1964 > cellCreditDblClick >  this.selectedRowData',  this.selectedRowData);
      if (
        row.column.dataField === "AC_CD" ||
        row.column.dataField === "AC_NM"
      ) {
        this.multiSelectMode = false;
        this.selectedGrid = "C";
        this.selectedRow = row;
        this.openAccountDialog();
      }
    },
    onRowClickLeft(row) {
      this.searchMaster(row.data.PK, this.lstBizPlace);
    },
    cellControlDblClick(row) {
      if (this.mstData.TR_STATUS != "1" && this.mstData.TR_STATUS != "N") {
        return this.showNotification(
          "warning",
          this.$t("cannot_modify_this_slip"),
          "",
          5000
        );
      }
      this.selectedRow = {
        ...row,
      };
      // debugger
      // console.log('vng-154-dvg^_^: > file: 6030014.vue > line 2046 > cellControlDblClick > this.selectedRow.data.ITEM_ALIAS', this.selectedRow.data.ITEM_ALIAS);
      // console.log('vng-154-dvg^_^: > file: 6030014.vue > line 1979 > cellControlDblClick > this.selectedRow.data.TAC_ABACCTITEM_PK', this.selectedRow.data.TAC_ABACCTITEM_PK);
      if (this.selectedRow.data.TAC_ABACCTITEM_PK == "-1") {
        this.openPartnerDialog("control");
      } else if (this.selectedRow.data.TAC_ABACCTITEM_PK == "-2") {
        this.$refs.refPLCenter.dialogIsShow = true;
      } else if (this.selectedRow.data.TAC_ABACCTITEM_PK == "-3") {} else if (this.selectedRow.data.ITEM_ALIAS == "DEPOSIT ACCOUNT NO") {
        this.dynamicHeader = this.BuildDynamicHeader("TAC_ABDEPOMT");
        this.dialogTitle = this.$t("bank_deposit_list");
        this.codeLabel = this.$t("bank_id");
        this.nameLabel = this.$t("bank_name");
        this.procedure = "ac_sel_tac_abdepomt_dialog";
        this.moreParas = [
          this.selectedRowDetail.data.TAC_ABACCTCODE_PK,
          this.selectedRowDetail.data.CCY,
        ];
        this.autoSearch = true;
        this.$refs.refDynamicDialog.dialogIsShow = true;
      } else if (this.selectedRow.data.ITEM_ALIAS == "BENEFICIARY BANK") {
        this.dynamicHeader = this.BuildDynamicHeader("TAC_BFBENEFICIARY");
        this.dialogTitle = this.$t("bank_beneficiary_list");
        this.codeLabel = this.$t("account_no");
        this.nameLabel = this.$t("bank_name");
        this.procedure = "ac_sel_bfbeneficiary_dialog";
        this.moreParas = [this.mstData.TCO_BUSPARTNER_PK];
        this.autoSearch = true;
        this.$refs.refDynamicDialog.dialogIsShow = true;
      } else if (this.selectedRow.data.ITEM_ALIAS == "BIZ PLACE") {
        this.dynamicHeader = this.BuildDynamicHeader("TCO_BUSPLACE");
        this.dialogTitle = this.$t("biz_place_list");
        this.codeLabel = this.$t("location_id");
        this.nameLabel = this.$t("location_name");
        this.procedure = "ac_sel_bizplace_dialog";
        this.moreParas = null;
        this.autoSearch = true;
        this.$refs.refDynamicDialog.dialogIsShow = true;
      } else if (this.selectedRow.data.IN_TYPE == "C") {
        this.dialogTitle = this.selectedRow.data.ITEM_ALIAS + " List";
        const temp = this.selectedRow.data.ITEM_ALIAS.split(" ");
        this.codeLabel = temp[0] + " CODE";
        this.nameLabel = temp[0] + " NAME";
        this.dynamicHeader = this.BuildDynamicHeader("TAC_ABITEMCODE");
        this.procedure = "ac_sel_tac_abitemcode_dialog";
        this.moreParas = [this.selectedRow.data.ITEM_ALIAS];
        this.autoSearch = true;
        this.$refs.refDynamicDialog.dialogIsShow = true;
      } else if (this.selectedRow.data.ITEM_ALIAS == "EMPLOYEE NAME") {
        this.dialogTitle = this.$t("employee_list");
        const temp = this.selectedRow.data.ITEM_ALIAS.split(" ");
        this.codeLabel = temp[0] + " ID";
        this.nameLabel = temp[0] + " NAME";
        this.dynamicHeader = this.BuildDynamicHeader("TAC_EMPLOYEE_ADV");
        this.procedure = "ac_sel_employee_adv";
        this.autoSearch = false;
        this.$refs.refDynamicDialog.dialogIsShow = true;
      } else if (this.selectedRow.data.ITEM_ALIAS == "NOTE MASTER") {
        this.dialogTitle = this.$t("note_master_list");
        this.codeLabel = this.$t("note_no");
        this.nameLabel = this.$t("publisher");
        this.dynamicHeader = this.BuildDynamicHeader("TAC_NOTE_MST");
        this.procedure = "ac_sel_note_master";
        this.dynamicFromDate = "20200101";
        this.moreParas = [this.mstData.TCO_BUSPARTNER_PK];
        this.autoSearch = false;
        this.$refs.refDynamicDialog.dialogIsShow = true;
      } else if (this.selectedRow.data.ITEM_ALIAS == "APPLY INVOICE") {
        // console.log('vng-154-dvg^_^: > file: 6030014.vue > line 2051 > cellControlDblClick > this.selectedRowDetail', this.selectedRowDetail);
        this.accountItem = {
          PK: this.selectedRowDetail.data.TAC_ABACCTCODE_PK,
          CODE: this.selectedRowDetail.data.AC_CD,
          NAME: this.selectedRowDetail.data.AC_NM,
        };
        this.PartnerItem = {
          PK: this.mstData.TCO_BUSPARTNER_PK,
          CODE: this.mstData.PARTNER_ID,
          NAME: this.mstData.PARTNER_NAME,
        };
        this.getCcy = this.selectedRowDetail.data.CCY;
        // console.log('vng-154-dvg^_^: > file: 6030014.vue > line 2059 > cellControlDblClick > this.getCcy', this.getCcy);
        this.multiSelectMode = false;
        this.$refs.ctrlapplyinvoice.dialogIsShow = true;
      } else if (this.selectedRow.data.ITEM_ALIAS == "BUDGET TYPE") {
        this.dynamicHeader = this.BuildDynamicHeader("BUDGET_TYPE");
        this.dialogTitle = this.$t("budget_type");
        this.codeLabel = this.$t("budget_nm");
        this.nameLabel = this.$t("budget_cd");
        this.procedure = "AC_SEL_BUDGETTYPE_POP";
        this.moreParas = [
          this.mstData.TAC_ABTRTYPE_PK,
          this.selectedRowDetail.data.TAC_ABACCTCODE_PK,
        ];
        this.autoSearch = true;
        this.$refs.refDynamicDialog.dialogIsShow = true;
      }
    },
    returnApplyInvoiceInfo(item) {
      if (this.addType != "APPLY_INVOICE") {
        // console.log('vng-154-dvg^_^: > file: 6030014.vue > line 2078 > returnApplyInvoiceInfo > item', item);
        this.ctlList = this.$refs.grdControl.getDataSource();
        for (let i = 0; i < this.ctlList.length; i++) {
          var ctlList_ITEM_ALIAS = this.ctlList[i].ITEM_ALIAS;
          if (ctlList_ITEM_ALIAS == "INVOICE DATE") {
            this.ctlList[i].ITEM_CODE = item.INVOICE_DATE2;
          } else if (ctlList_ITEM_ALIAS == "INVOICE NO") {
            this.ctlList[i].ITEM_CODE = item.INVOICE_NO;
          } else if (ctlList_ITEM_ALIAS == "SERIAL NO") {
            this.ctlList[i].ITEM_CODE = item.SERIAL_NO;
          } else if (ctlList_ITEM_ALIAS == "APPLY INVOICE") {
            this.ctlList[i].ITEM_CODE =
              item.INVOICE_NO +
              " [ " +
              item.CCY +
              " ][ " +
              item.END_TRANS_AMT2 +
              " ]";
          } else if (ctlList_ITEM_ALIAS == "VOUCHER NO") {
            this.ctlList[i].ITEM_CODE = item.VOUCHER_NO;
          } else if (this.ctlList[i].TAC_ABACCTITEM_PK == "-1") {
            this.ctlList[i].ITEM_CODE = item.PARTNER_ID;
            this.ctlList[i].ITEM_NAME = item.PARTNER_NAME;
            this.ctlList[i].TABLE_NM = "TCO_BUSPARTNER";
            this.ctlList[i].TABLE_PK = item.PK;
          }
          if (this.ctlList[i]._rowstatus !== "i") {
            this.ctlList[i]._rowstatus = "u";
          }
        }
        if (this.selectedGrid == "D") {
          this.debitList = this.$refs.grdDebit.getDataSource();
          const userIdx = this.debitList.findIndex(
            (x) => x.PK === this.selectedRowData.data.PK
          );

          if (userIdx > -1) {
            this.debitList[userIdx].CCY = item.CCY;
            this.debitList[userIdx].TR_RATE = item.TR_RATE;
            this.debitList[userIdx].TR_AMT = item.END_TRANS_AMT;
            this.debitList[userIdx].BK_AMT = item.END_BOOKS_AMT;
            this.debitList[userIdx].BK_RATE = item.BK_RATE;

            if (this.debitList[userIdx]._rowstatus !== "i") {
              this.debitList[userIdx]._rowstatus = "u";
            }
          }
        } else {
          this.creditList = this.$refs.grdCredit.getDataSource();
          // console.log('vng-154-dvg^_^: > file: 6030014.vue > line 2124 > returnApplyInvoiceInfo > this.creditList', this.creditList);
          // console.log('vng-154-dvg^_^: > file: 6030014.vue > line 2125 > returnApplyInvoiceInfo > this.selectedRow', this.selectedRowData);
          const userIdx = this.creditList.findIndex(
            (x) => x.PK === this.selectedRowData.data.PK
          );
          // console.log('vng-154-dvg^_^: > file: 6030014.vue > line 2125 > returnApplyInvoiceInfo > this.selectedRow', this.selectedRowData);
          // console.log('vng-154-dvg^_^: > file: 6030014.vue > line 2126 > returnApplyInvoiceInfo > userIdx', userIdx);

          if (userIdx > -1) {
            this.creditList[userIdx].CCY = item.CCY;
            this.creditList[userIdx].TR_RATE = item.TR_RATE;
            this.creditList[userIdx].TR_AMT = item.END_TRANS_AMT;
            this.creditList[userIdx].BK_AMT = item.END_BOOKS_AMT;
            this.creditList[userIdx].BK_RATE = item.BK_RATE;

            if (this.creditList[userIdx]._rowstatus !== "i") {
              this.creditList[userIdx]._rowstatus = "u";
            }
          }
        }
      } else {
        if (this.selectedGrid == "D") this.$refs.grdDebit.loadData();
        if (this.selectedGrid == "C") this.$refs.grdCredit.loadData();
      }
    },
    initMasterData() {
      this.mstData = {
        _rowstatus: "i",
        PK: "",
        CRT_BY: "",
        CRT_DT: "",
        MOD_BY: "",
        MOD_DT: "",
        DESCRIPTION: this.transTypeList.length ?
          this.transTypeList[0].DESCRIPT :
          "",
        DESCRIPTION_LOCAL: this.transTypeList.length ?
          this.transTypeList[0].DESCRIPTLOCAL :
          "",
        DESCRIPTION_FOREIGN: this.transTypeList.length ?
          this.transTypeList[0].DESCRIPTKOR :
          "",
        TR_ENCLOSE: "",
        TCO_ORG_PK: this.mstData.TCO_ORG_PK ?
          this.mstData.TCO_ORG_PK :
          this.user.TCO_ORG_PK,
        PARTNER_ID: "",
        PARTNER_NAME: "",
        TCO_BUSPARTNER_PK: "",
        TAC_EMPLOYEE_ADV_PK: "",
        TR_PERSON: "",
        TCO_COMPANY_PK: this.selectedCompany,
        AUTO_YN: this._getAutoYn,
        TRANS_NAME: this.mstData.TRANS_NAME ? this.mstData.TRANS_NAME : "",
        TAC_ABTRTYPE_PK: this.mstData.TAC_ABTRTYPE_PK ?
          this.mstData.TAC_ABTRTYPE_PK :
          "",
        TR_STATUS: "N",
        VOUCHER_NO: "",
        VOUCHER_TYPE: this.mstData.VOUCHER_TYPE ?
          this.mstData.VOUCHER_TYPE :
          "",
        TR_DATE: this._formatDateToSave(new Date()),
        TCO_BUSPLACE_PK: this.lstBizPlace,
      };

      // console.log('vng-154-dvg^_^: > file: 6030014.vue > line 2041 > initMasterData > this.$refs.grdDebit', this.$refs.grdDebit);
      if (this.$refs.grdDebit != undefined) this.$refs.grdDebit.Clear();
      if (this.$refs.grdCredit != undefined) this.$refs.grdCredit.Clear();
      if (this.$refs.grdControl != undefined) this.$refs.grdControl.Clear();

      this.debitList = [];
      this.creditList = [];
      this.ctlList = [];
      this.txtTotalTransDebit = 0;
      this.txtTotalBookDebit = 0;
      this.txtTotalBookCredit = 0;
      this.txtTotalTransCredit = 0;
      this.txtSumTransCredit = 0;
      this.txtSumTransDebit = 0;
      this.txtSumBookDebit = 0;
      this.txtSumBookCredit = 0;
    },
    async leftSearch() {
      this.$refs.grdDataLeft.loadData();
    },
    toggleLeft() {
      if (this.show_left == true) {
        this.show_left = false;
        this.cols_left = 0;
        this.btnIconType = "skip_next";
      } else {
        this.show_left = true;
        this.cols_left = 3;
        this.btnIconType = "skip_prev";
      }
    },
    toggleCtl() {
      if (this.showCtl == true) {
        this.showCtl = false;
        this.ctlCols = 0;
        this.btnIconTypeDebit = "skip_next";
      } else {
        this.showCtl = true;
        this.ctlCols = 3;
        this.btnIconTypeDebit = "skip_prev";
      }

      this.colspanDetail = this.showCtl ? 8 : 12;
      this.colspanGrdControl = 4;
    },
    onRowPrepared(e) {
      if (e.rowType == "data") {
        //e.rowElement.style.backgroundColor = e.data.COLOR_CD;
      }
    },
    onRowPreparedCtl(e) {
      if (e.rowType == "data") {
        if (e.data.MANDATORY_YN == "Y") {
          e.rowElement.style.fontWeight = "bold";
        }
      }
    },
    openAccountDialog() {
      if (this.mstData.TR_STATUS != "1" && this.mstData.TR_STATUS != "N") {
        return this.showNotification(
          "warning",
          this.$t("cannot_modify_this_slip"),
          "",
          5000
        );
      }
      this.sel_pro = "SYS_SEL_ACCOUNT_CODE_BY_INPUT";
      console.log(
        "vng-154-dvg^_^: > file: 6030014.vue > line 2289 > openAccountDialog > this.addType",
        this.selectedGrid
      );
      if (this.addType == "APPLY_INVOICE") {
        this.sel_pro = "AC_SEL_ACCOUNT_APPLY_INVOICE_NOCACHE";
        this.multiSelectMode = false;
      }
      this.$refs.accountDialog.dialogIsShow = true;
    },
    openTransactionTypeDialog() {
      if (this.mstData.TR_STATUS != "1" && this.mstData.TR_STATUS != "N") {
        return this.showNotification(
          "warning",
          this.$t("cannot_modify_this_slip"),
          "",
          5000
        );
      }
      this.$refs.transTypeDialog.dialogIsShow = true;
    },
    openPartnerDialog(type) {
      if (this.mstData.TR_STATUS != "1" && this.mstData.TR_STATUS != "N") {
        return this.showNotification(
          "warning",
          this.$t("cannot_modify_this_slip"),
          "",
          5000
        );
      }
      this.partnerDialogType = type;
      this.$refs.partnerDialog.dialogIsShow = true;
    },
    openEmployeeDialog() {
      if (this.mstData.TR_STATUS != "1" && this.mstData.TR_STATUS != "N") {
        return this.showNotification(
          "warning",
          this.$t("cannot_modify_this_slip"),
          "",
          5000
        );
      }

      this.dialogTitle = this.$t("employee_list");
      this.codeLabel = this.$t("employee_id");
      this.nameLabel = this.$t("employee_name");
      this.dynamicHeader = this.BuildDynamicHeader("TAC_EMPLOYEE_ADV");
      this.procedure = "ac_sel_employee_adv";
      this.autoSearch = false;
      this.$refs.refEmployeeAdvDialog.dialogIsShow = true;
    },
    mappingTransType(item) {
      if (item) {
        if (this.mstData.TR_STATUS != "1" && this.mstData.TR_STATUS != "N") {
          return this.showNotification(
            "warning",
            this.$t("slip_was_confirmed_or_approved_cannot_change"),
            "",
            4000
          );
        }

        this.mstData.TRANS_NAME =
          item.trans.TR_TYPE + " - " + item.trans.TR_TPNM;
        this.mstData.TAC_ABTRTYPE_PK = item.trans.PK;
        this.mstData.DESCRIPTION = item.trans.DESCRIPT;
        this.mstData.DESCRIPTION_LOCAL = item.trans.DESCRIPTLOCAL;
        this.mstData.DESCRIPTION_FOREIGN = item.trans.DESCRIPTKOR;
        let ord = 0;
        this.debitList = this.$refs.grdDebit.getDataSource();
        if (this.debitList.length > 0) {
          ord = this.debitList[this.debitList.length - 1].DRCR_ORD;
        }
        item.debit.forEach((e) => {
          ord++;
          this.$refs.grdDebit.addRowStruct({
            PK: "",
            TAC_HGTRH_PK: this.mstData.PK,
            AC_CD: e.AC_CD,
            AC_NM: e.AC_NM,
            TAC_ABACCTCODE_PK: e.PK,
            TYPE_REF: 1,
            DRCR_TYPE: "D",
            DRCR_ORD: ord,
            CCY: e.CCY,
            TR_AMT: 0,
            BK_AMT: 0,
            TR_RATE: this.getExchangeRate(e.CCY),
            BK_EX_RATE: this.txtBookExRate,
            DESCRIPTION: this.mstData.DESCRIPTION,
            DESCRIPTION_LOCAL: this.mstData.DESCRIPTION_LOCAL,
            DESCRIPTION_FOREIGN: this.mstData.DESCRIPTION_FOREIGN,
          });
        });
        ord = 0;
        this.creditList = this.$refs.grdCredit.getDataSource();
        if (this.creditList.length > 0) {
          ord = this.creditList[this.creditList.length - 1].DRCR_ORD;
        }
        item.credit.forEach((e) => {
          ord++;
          this.$refs.grdCredit.addRowStruct({
            PK: "",
            TAC_HGTRH_PK: this.mstData.PK,
            AC_CD: e.AC_CD,
            AC_NM: e.AC_NM,
            TAC_ABACCTCODE_PK: e.PK,
            TYPE_REF: 1,
            DRCR_TYPE: "C",
            DRCR_ORD: ord,
            CCY: e.CCY,
            TR_AMT: 0,
            BK_AMT: 0,
            TR_RATE: this.getExchangeRate(e.CCY),
            BK_EX_RATE: this.txtBookExRate,
            DESCRIPTION: this.mstData.DESCRIPTION,
            DESCRIPTION_LOCAL: this.mstData.DESCRIPTION_LOCAL,
            DESCRIPTION_FOREIGN: this.mstData.DESCRIPTION_FOREIGN,
          });
        });
      }
    },
    getExchangeRate(p_ccy) {
      for (let i = 0; i < this.exchangeRateList.length; i++) {
        if (this.exchangeRateList[i].CCY == p_ccy) {
          return this.exchangeRateList[i].TTM_RATE;
        }
      }
    },
    mappingAccount(item) {
      if (!this.multiSelectMode) {
        if (this.selectedGrid == "D" && this.addType != "APPLY_INVOICE") {
          this.debitList = this.$refs.grdDebit.getDataSource();
          const userIdx = this.debitList.findIndex(
            (x) => x.PK === this.selectedRow.data.PK
          );

          if (userIdx > -1) {
            this.debitList[userIdx].AC_CD = item.AC_CD;
            this.debitList[userIdx].AC_NM = item.AC_NM;
            this.debitList[userIdx].TAC_ABACCTCODE_PK = item.PK;
            if (
              this.mstData.DESCRIPTION != "" &&
              this.debitList[userIdx].DESCRIPTION == ""
            ) {
              this.debitList[userIdx].DESCRIPTION = this.mstData.DESCRIPTION;
              this.debitList[userIdx].DESCRIPTION_LOCAL =
                this.mstData.DESCRIPTION_LOCAL;
              this.debitList[userIdx].DESCRIPTION_FOREIGN =
                this.mstData.DESCRIPTION_FOREIGN;
            }
            if (this.debitList[userIdx]._rowstatus !== "i") {
              this.debitList[userIdx]._rowstatus = "u";
            }
          }
        } else if (
          this.selectedGrid == "C" &&
          this.addType != "APPLY_INVOICE"
        ) {
          this.creditList = this.$refs.grdCredit.getDataSource();
          const userIdx = this.creditList.findIndex(
            (x) => x.PK === this.selectedRow.data.PK
          );

          if (userIdx > -1) {
            this.creditList[userIdx].AC_CD = item.AC_CD;
            this.creditList[userIdx].AC_NM = item.AC_NM;
            this.creditList[userIdx].TAC_ABACCTCODE_PK = item.PK;
            if (
              this.mstData.DESCRIPTION != "" &&
              this.creditList[userIdx].DESCRIPTION == ""
            ) {
              this.creditList[userIdx].DESCRIPTION = this.mstData.DESCRIPTION;
              this.creditList[userIdx].DESCRIPTION_LOCAL =
                this.mstData.DESCRIPTION_LOCAL;
              this.creditList[userIdx].DESCRIPTION_FOREIGN =
                this.mstData.DESCRIPTION_FOREIGN;
            }
            if (this.creditList[userIdx]._rowstatus !== "i") {
              this.creditList[userIdx]._rowstatus = "u";
            }
          }
        }
        if (this.addType == "APPLY_INVOICE") {
          this.openApplyInvoice(item.PK, item.AC_CD, item.AC_NM, item.CCY);
        }
      } else {
        let ord = 0;
        let ref = 0;
        if (this.selectedGrid == "D" && this.addType != "APPLY_INVOICE") {
          this.debitList = this.$refs.grdDebit.getDataSource();
          if (this.debitList.length > 0) {
            ord = this.debitList[this.debitList.length - 1].DRCR_ORD;
            ref = this.debitList[this.debitList.length - 1].TYPE_REF;
          }
          ref = ref == 0 ? 1 : ref;
          item.forEach((e) => {
            ord++;
            this.$refs.grdDebit.addRowStruct({
              PK: "",
              TAC_HGTRH_PK: this.mstData.PK,
              AC_CD: e.AC_CD,
              AC_NM: e.AC_NM,
              TAC_ABACCTCODE_PK: e.PK,
              TYPE_REF: ref,
              DRCR_TYPE: "D",
              DRCR_ORD: ord,
              CCY: e.CCY,
              TR_AMT: 0,
              BK_AMT: 0,
              TR_RATE: this.getExchangeRate(e.CCY),
              BK_EX_RATE: this.txtBookExRate,
              DESCRIPTION: this.mstData.DESCRIPTION,
              DESCRIPTION_LOCAL: this.mstData.DESCRIPTION_LOCAL,
              DESCRIPTION_FOREIGN: this.mstData.DESCRIPTION_FOREIGN,
            });
          });
          //this.$refs.grdDebit.selectRowsByIndexes([this.debitList.length-1])
          this.selectedGrid = "D";
          this.selectedRowDetail = {
            data: {
              TAC_ABACCTCODE_PK: item[item.length - 1].PK,
              AC_CD: item[item.length - 1].AC_CD,
              AC_NM: item[item.length - 1].AC_NM,
              CCY: item[item.length - 1].CCY,
              DRCR_TYPE: "D",
              DRCR_ORD: ord,
            },
          };
          this.selectedRowData = {
            data: {
              PK: "",
              TAC_HGTRH_PK: this.mstData.PK,
              AC_CD: item[item.length - 1].AC_CD,
              AC_NM: item[item.length - 1].AC_NM,
              TAC_ABACCTCODE_PK: item[item.length - 1].PK,
              TYPE_REF: ref,
              DRCR_TYPE: "D",
              DRCR_ORD: ord,
              CCY: item[item.length - 1].CCY,
              TR_AMT: 0,
              BK_AMT: 0,
              TR_RATE: this.getExchangeRate(item[item.length - 1].CCY),
              BK_EX_RATE: this.txtBookExRate,
              DESCRIPTION: this.mstData.DESCRIPTION,
              DESCRIPTION_LOCAL: this.mstData.DESCRIPTION_LOCAL,
              DESCRIPTION_FOREIGN: this.mstData.DESCRIPTION_FOREIGN,
            },
          };
          this.searchCtl(0, item[item.length - 1].PK, "D");
        } else if (
          this.selectedGrid == "C" &&
          this.addType != "APPLY_INVOICE"
        ) {
          this.debitList = this.$refs.grdDebit.getDataSource();
          var DTR_AMT = this.debitList.reduce((n, {
            TR_AMT
          }) => n + TR_AMT, 0);
          var DBK_AMT = this.debitList.reduce((n, {
            BK_AMT
          }) => n + BK_AMT, 0);

          this.creditList = this.$refs.grdCredit.getDataSource();
          var CTR_AMT = this.creditList.reduce(
            (n, {
              TR_AMT
            }) => n + TR_AMT,
            0
          );
          var CBK_AMT = this.creditList.reduce(
            (n, {
              BK_AMT
            }) => n + BK_AMT,
            0
          );

          var ATR_AMT = DTR_AMT - CTR_AMT;
          var ABK_AMT = DBK_AMT - CBK_AMT;

          if (this.creditList.length > 0) {
            ord = this.creditList[this.creditList.length - 1].DRCR_ORD;
            ref = this.creditList[this.creditList.length - 1].TYPE_REF;
          }
          ref = ref == 0 ? 1 : ref;
          item.forEach((e) => {
            ord++;
            this.$refs.grdCredit.addRowStruct({
              PK: "",
              TAC_HGTRH_PK: this.mstData.PK,
              AC_CD: e.AC_CD,
              AC_NM: e.AC_NM,
              TAC_ABACCTCODE_PK: e.PK,
              TYPE_REF: ref,
              DRCR_TYPE: "C",
              DRCR_ORD: ord,
              CCY: e.CCY,
              TR_AMT: ATR_AMT,
              BK_AMT: ABK_AMT,
              TR_RATE: this.getExchangeRate(e.CCY),
              BK_EX_RATE: this.txtBookExRate,
              DESCRIPTION: this.mstData.DESCRIPTION,
              DESCRIPTION_LOCAL: this.mstData.DESCRIPTION_LOCAL,
              DESCRIPTION_FOREIGN: this.mstData.DESCRIPTION_FOREIGN,
            });
          });
          this.selectedGrid = "C";
          this.selectedRowDetail = {
            data: {
              TAC_ABACCTCODE_PK: item[item.length - 1].PK,
              AC_CD: item[item.length - 1].AC_CD,
              AC_NM: item[item.length - 1].AC_NM,
              CCY: item[item.length - 1].CCY,
              DRCR_TYPE: "C",
              DRCR_ORD: ord,
            },
          };
          this.selectedRowData = {
            data: {
              PK: "",
              TAC_HGTRH_PK: this.mstData.PK,
              AC_CD: item[item.length - 1].AC_CD,
              AC_NM: item[item.length - 1].AC_NM,
              TAC_ABACCTCODE_PK: item[item.length - 1].PK,
              TYPE_REF: ref,
              DRCR_TYPE: "C",
              DRCR_ORD: ord,
              CCY: item[item.length - 1].CCY,
              TR_AMT: 0,
              BK_AMT: 0,
              TR_RATE: this.getExchangeRate(item[item.length - 1].CCY),
              BK_EX_RATE: this.txtBookExRate,
              DESCRIPTION: this.mstData.DESCRIPTION,
              DESCRIPTION_LOCAL: this.mstData.DESCRIPTION_LOCAL,
              DESCRIPTION_FOREIGN: this.mstData.DESCRIPTION_FOREIGN,
            },
          };
          //this.$refs.grdCredit.selectRowsByIndexes([this.creditList.length-1])
          this.searchCtl(0, item[item.length - 1].PK, "C");
        }
        if (this.addType == "APPLY_INVOICE") {
          this.openApplyInvoice(
            item[item.length - 1].PK,
            item[item.length - 1].AC_CD,
            item[item.length - 1].AC_NM,
            item[item.length - 1].CCY
          );
        }
      }
    },
    mappingPartner(item) {
      if (this.partnerDialogType == "master") {
        this.mstData.PARTNER_NAME = item.PARTNER_ID + " - " + item.PARTNER_NAME;
        this.mstData.PARTNER_ID = item.PARTNER_ID;
        this.mstData.TCO_BUSPARTNER_PK = item.PK;
      } else if (this.partnerDialogType == "control") {
        this.ctlList = this.$refs.grdControl.getDataSource();
        if (this.selectedRow.data.TAC_ABACCTITEM_PK == "-1") {
          const idx = this.ctlList.findIndex(
            (x) => x.PK === this.selectedRow.data.PK
          );

          if (idx > -1) {
            this.ctlList[idx].ITEM_CODE = item.PARTNER_ID;
            this.ctlList[idx].ITEM_NAME = item.PARTNER_NAME;
            this.ctlList[idx].TABLE_NM = "TCO_BUSPARTNER";
            this.ctlList[idx].TABLE_PK = item.PK;
            if (this.ctlList[idx]._rowstatus !== "i") {
              this.ctlList[idx]._rowstatus = "u";
            }
          }
        }
      }
    },
    callBackPLCenter(item) {
      this.ctlList = this.$refs.grdControl.getDataSource();
      if (this.selectedRow.data.TAC_ABACCTITEM_PK == "-2") {
        const idx = this.ctlList.findIndex(
          (x) => x.PK === this.selectedRow.data.PK
        );

        if (idx > -1) {
          this.ctlList[idx].ITEM_CODE = item.CODE;
          this.ctlList[idx].ITEM_NAME = item.NAME;
          this.ctlList[idx].TABLE_NM = "TAC_ABPL";
          this.ctlList[idx].TABLE_PK = item.PK;
          if (this.ctlList[idx]._rowstatus !== "i") {
            this.ctlList[idx]._rowstatus = "u";
          }
        }
      }
    },
    callBackDynamicDialog(item) {
      this.ctlList = this.$refs.grdControl.getDataSource();
      const idx = this.ctlList.findIndex(
        (x) => x.PK === this.selectedRow.data.PK
      );
      if (idx > -1) {
        this.ctlList[idx].ITEM_CODE = item.CODE;
        this.ctlList[idx].ITEM_NAME = item.NAME;
        this.ctlList[idx].TABLE_NM = item.TABLE_NM;
        this.ctlList[idx].TABLE_PK = item.PK;
        if (this.ctlList[idx]._rowstatus !== "i") {
          this.ctlList[idx]._rowstatus = "u";
        }
      }
    },
    callBackEmployeeAdvDialog(item) {
      this.mstData.TR_PERSON = item.CODE + " - " + item.NAME;
      this.mstData.TAC_EMPLOYEE_ADV_PK = item.PK;
    },
    onChangeBizPlace() {
      this.ctlList = this.$refs.grdControl.getDataSource();
      if (
        this.ctlList.length > 0 &&
        (this.mstData.TR_STATUS == "1" || this.mstData.TR_STATUS == "N")
      ) {
        this.ctlList.forEach((e) => {
          if (e.ITEM_ALIAS == "BIZ PLACE") {
            let loc_id = "",
              loc_nm = "";
            this.bizPlaceList.forEach((k) => {
              if (k.PK == this.mstData.TCO_BUSPLACE_PK) {
                loc_id = k.NAME;
                loc_nm = k.TEXT;
              }
            });
            e.ITEM_CODE = loc_id;
            e.ITEM_NAME = loc_nm;
            e.TABLE_PK = this.mstData.TCO_BUSPLACE_PK;
            e.TABLE_NM = "TCO_BUSPLACE";
            e._rowstatus = "u";
          }
        });
      }
    },
    async onChangeCompany() {
      this.bizPlaceList = [];
      const dso_bizplace_list = {
        type: "list",
        selpro: "SYS_SEL_BIZ_PLACE_v3",
        para: [this.mstData.TCO_COMPANY_PK, this.user.PK],
      };
      this.bizPlaceList = await this._dsoCall(
        dso_bizplace_list,
        "select",
        false,
        "acntStyle"
      );
      if (this.bizPlaceList.length > 0) {
        this.mstData.TCO_BUSPLACE_PK = this.bizPlaceList[0].PK;
      }

      // voucher type
      const commoncode = await this._getCommonCode2(
        ["ACBG0130"],
        this.mstData.TCO_COMPANY_PK
      );
      this.voucherList = commoncode[0];
      if (this.voucherList.length > 0) {
        this.mstData.VOUCHER_TYPE = this.voucherList[0].CODE;
      }

      // trans type
      this.transTypeList = await this._callProcedure(
        "ac_sel_6025030_trans_type",
        [this.mstData.TCO_COMPANY_PK, "EACAB011", "6030010"]
      );
      if (this.transTypeList.length > 0) {
        this.mstData.TRANS_NAME =
          this.transTypeList[0].TR_TYPE + " - " + this.transTypeList[0].TR_TPNM;
        this.mstData.TAC_ABTRTYPE_PK = this.transTypeList[0].PK;
        this.mstData.DESCRIPTION = this.transTypeList[0].DESCRIPT;
        this.mstData.DESCRIPTION_LOCAL = this.transTypeList[0].DESCRIPTLOCAL;
        this.mstData.DESCRIPTION_FOREIGN = this.transTypeList[0].DESCRIPTKOR;
      }
    },
    async onChangeCompany1() {
      this.bizPlaceListS = [];
      const dso_bizplace_list = {
        type: "list",
        selpro: "SYS_SEL_BIZ_PLACE_v2",
        para: [this.selectedCompany, this.user.PK],
      };
      this.bizPlaceListS = await this._dsoCall(
        dso_bizplace_list,
        "select",
        false,
        "acntStyle"
      );
      if (this.bizPlaceListS.length > 0) {
        this.lstBizPlace = this.bizPlaceListS[0].PK;
      }
      // console.log('vng-154-dvg^_^: > file: 6030014.vue > line 2528 > onChangeCompany1 > this.mstData.TCO_COMPANY_PK', this.mstData.TCO_COMPANY_PK);

      // voucher type
      const commoncode = await this._getCommonCode2(
        ["ACBG0130"],
        this.selectedCompany
      );
      this.searchVoucherList = commoncode[0];
      this.searchVoucherList.push({
        CODE: "%",
        NAME: this.$t("all"),
      });
    },
    async getCompanyList() {
      // SYS_SEL_LIST_COMPANY
      const dso = {
        type: "list",
        selpro: "SYS_SEL_LIST_COMPANY_BY_USER",
        para: [this.user.PK],
      };
      const rows = await this._dsoCall(dso, "select", false, "acntStyle");
      if (rows.length > 0) {
        this.companyList = rows;
      } else {
        this.companyList = [];
      }
    },
    async searchMaster(p_tac_hgtrh_pk, p_bizplace) {
      const dso = {
        type: "control",
        selpro: "ac_sel_6030014_master",
        para: [p_tac_hgtrh_pk],
      };
      let row = await this._dsoCall(dso, "select", false, "acntStyle");
      if (row) {
        this.mstData = {
          ...row,
        };
        this.searchDetail(p_tac_hgtrh_pk, p_bizplace);
      }
    },
    async searchDetail(p_tac_hgtrh_pk, p_bizplace) {
      this.$refs.grdDebit.loadData();
      this.$refs.grdCredit.loadData();
      this.searchCtl(0, 0, "");
      this.grdControlTemp = [];
    },
    async searchCtl(p_tac_hgtrd_pk, p_tac_abacctcode_pk, p_drcr_type) {
      p_tac_hgtrd_pk =
        p_tac_hgtrd_pk.toString().indexOf("-") > 0 ? "" : p_tac_hgtrd_pk;
      let dso = {
        type: "grid",
        selpro: "ac_sel_6030014_control",
        para: [p_tac_hgtrd_pk, p_tac_abacctcode_pk, p_drcr_type],
      };
      this.l_tac_hgtrd_pk = p_tac_hgtrd_pk;
      this.l_tac_abacctcode_pk = p_tac_abacctcode_pk;
      this.l_drcr_type = p_drcr_type;

      let rows = await this._dsoCall(dso, "select", false, "acntStyle");
      if (rows.length > 0) {
        this.ctlList = rows;
        this.showCtl = true;
        this.ctlCols = 3;
        this.colspanDetail = this.showCtl ? 8 : 12;
        this.colspanGrdControl = 4;
        if (
          this.ctlList.length > 0 &&
          (this.mstData.TR_STATUS == "1" || this.mstData.TR_STATUS == "N")
        ) {
          this.ctlList.forEach((e) => {
            if (!e.ITEM_CODE) {
              if (this.mstData.TCO_BUSPARTNER_PK > 0) {
                if (e.ITEM_ALIAS == "CUSTOMER") {
                  e.ITEM_CODE = this.mstData.PARTNER_ID;
                  e.ITEM_NAME = this.mstData.PARTNER_NAME;
                  e.TABLE_NM = "TCO_BUSPARTNER";
                  e.TABLE_PK = this.mstData.TCO_BUSPARTNER_PK;
                  e._rowstatus = "u";
                } else if (e.ITEM_ALIAS == "CUSTOMER NAME") {
                  e.ITEM_CODE = this.mstData.PARTNER_NAME;
                  e._rowstatus = "u";
                }
              }
              if (e.ITEM_ALIAS == "BIZ PLACE") {
                let loc_id = "",
                  loc_nm = "";
                this.bizPlaceList.forEach((k) => {
                  if (k.PK === this.mstData.TCO_BUSPLACE_PK) {
                    loc_id = k.NAME;
                    loc_nm = k.TEXT;
                  }
                });
                e.ITEM_CODE = loc_id;
                e.ITEM_NAME = loc_nm;
                e.TABLE_NM = "TCO_BUSPLACE";
                e.TABLE_PK = this.mstData.TCO_BUSPLACE_PK;
                e._rowstatus = "u";
              } else if (e.ITEM_ALIAS == "PRODUCT ITEM") {
                var remark2 =
                  this.selectedRowDetail.rowIndex == undefined ?
                  this.mstData.DESCRIPTION_LOCAL :
                  this.selectedRowDetail.data.DESCRIPTION_LOCAL;
                e.ITEM_CODE = remark2;
                e._rowstatus = "u";
              }
            }
          });
        }
        this.ctlList_formatNumber("F");
        this.SetDetailCtlItem();
        this.$refs.grdControl.setDataSource(this.ctlList);
      } else {
        this.ctlList = [];
        this.showCtl = false;
        this.ctlCols = 0;
        this.$refs.grdControl.setDataSource(this.ctlList);
        this.colspanDetail = this.showCtl ? 8 : 12;
      }

      // this.$refs.grdControl.setDataSource(this.ctlList);
    },
    onDisplayTab(obj) {
      switch (obj) {
        case "PERSONAL": {
          this.btnOtherInfor = this.showPersonal ? "skip_prev" : "skip_next";
          this.showPersonal = !this.showPersonal;
          break;
        }
        case "DEBIT": {
          this.btnDebit = this.showDebit ? "skip_prev" : "skip_next";
          this.showDebit = !this.showDebit;

          this.colspanDetail = this.showCtl ? 8 : 12;
          this.colspanGrdControl = 4;
          break;
        }
        case "CREDIT": {
          this.btnCredit = this.showCredit ? "skip_prev" : "skip_next";
          this.showCredit = !this.showCredit;
          break;
        }
        case "CONTRACT": {
          this.showContract = !this.showContract;
          break;
        }
        case "FLAG": {
          this.showFlag = !this.showFlag;
          break;
        }
        case "SALARY": {
          this.showSalary = !this.showSalary;
          break;
        }
        case "EXP": {
          this.showExp = !this.showExp;
          break;
        }
        case "EDU": {
          this.showEdu = !this.showEdu;
          break;
        }
        case "OTHER": {
          this.showOther = !this.showOther;
          break;
        }
      }
    },
    async print() {
      const lst_print_amt_info = await this._getCommonCode("TPS0055", "0");
      const print_amt_info = lst_print_amt_info.find((x) => x.DEF_YN == "Y");
      const lst_CIRCULARS = await this._getCommonCode("AC150001", "0");
      const CIRCULARS_info = lst_CIRCULARS[0].CODE;
      var company_info = this.companyList.find(
        (x) => x.PK == this.selectedCompany
      );
      var report_info = this.reportTypeList.find(
        (x) => x.CODE == this.selectedReportType
      );
      if (
        report_info.VAL1 == "" ||
        report_info.VAL1 == "null" ||
        report_info.VAL1 == null ||
        report_info.VAL1 == undefined
      ) {
        var MSG_ERR = "PLS_REGISTER_REPORT_ID_WITH_COMONCODE_" + "GFQC0016";
        this.$refs.alertDialog.showAlert("error", "Error", MSG_ERR);
        return;
      }
      var R_FILE_TYPE =
        report_info.VAL8 == "" ||
        report_info.VAL8 == "null" ||
        report_info.VAL8 == null ?
        ".xlsx" :
        report_info.VAL8; // report type
      var param = [{
        P_RPT_ID: report_info.VAL1,
        P_RPT_URL: report_info.VAL2,
        P_RPT_FILE: report_info.VAL3,
        P_FILE_TYPE: R_FILE_TYPE,
        P_COMP_ID: company_info.PARTNER_ID,
        P_COMP_NM: company_info.TEXT,
        P_COMP_TAX: company_info.TAX_CODE,
        P_COMP_ADD: company_info.ADDR2,
        P_COMPANY: this.mstData.TCO_COMPANY_PK,
        P_SEQ: this.mstData.PK,
        P_BOOK_CCY: this.txtBookCCY,
        P_CIRCULARS: CIRCULARS_info,
        P_PRINT_AMOUNT: print_amt_info.CODE,
      }, ];

      var file_nm =
        report_info.VAL1 +
        "_" +
        report_info.NAME +
        "_" +
        this.user.USER_ID +
        R_FILE_TYPE;
      var url_path = "/report/" + report_info.VAL1 + "/" + report_info.VAL3;
      try {
        const result = await this.$axios.$get(url_path, {
          responseType: "blob",
          params: {
            para: param,
          },
        });
        if (result) {
          this._ExcelSaveAs(result, file_nm);
        } else {
          this.showNotification(
            "danger",
            this.$t("fail_to_export_report"),
            "",
            4000
          );
        }
      } catch (e) {
        this.showNotification("danger", e.message, "", 4000);
      }
    },
    ctlList_formatNumber(obj) {
      this.ctlList.forEach((e) => {
        if (e.DATA_TYPE == "N" && e.ITEM_CODE != null) {
          //console.log( this._formatNumber(e.ITEM_CODE.replaceAll(",","")))
          if (obj == "F") {
            e.ITEM_CODE = this._formatNumber(e.ITEM_CODE.replaceAll(",", ""));
          } else if (obj == "C") {
            e.ITEM_CODE = e.ITEM_CODE.replaceAll(",", "");
          }
        }
      });
      // this.$refs.grdControl.setDataSource(this.ctlList);
    },
    SetDetailCtlItem() {
      var ctrl = this.ctlList; //this.$refs.grdControl.getDataSource();
      var ctrlTemp = this.grdControlTemp;
      //console.log("this.grdControlTemp",this.grdControlTemp)
      for (let i = 0; i < ctrl.length; i++) {
        var itemal = ctrl[i].ITEM_ALIAS;
        // console.log('vng-154-dvg^_^: > file: 6030014.vue > line 2836 > SetDetailCtlItem > itemal', itemal);
        var item = ctrl[i].ITEM_CODE;
        // console.log('vng-154-dvg^_^: > file: 6030014.vue > line 2844 > SetDetailCtlItem > item', item);
        for (let j = 0; j < ctrlTemp.length; j++) {
          var itemal2 = ctrlTemp[j].ITEM_ALIAS;
          // console.log('vng-154-dvg^_^: > file: 6030014.vue > line 2840 > SetDetailCtlItem > itemal2', itemal2);
          var item2 = ctrlTemp[j].ITEM_CODE;
          var itemnm2 = ctrlTemp[j].ITEM_NAME;
          var table_name2 = ctrlTemp[j].TABLE_NM;
          var itempk2 = ctrlTemp[j].TABLE_PK;

          if (itemal == itemal2 && (item == "null" || item == null)) {
            ctrl[i].ITEM_CODE = item2;
            ctrl[i].ITEM_NAME = itemnm2;
            ctrl[i].TABLE_NM = table_name2;
            ctrl[i].TABLE_PK = itempk2;
            ctrl[i]._rowstatus = "u"; //(ctrl[i]._rowstatus == '' || ctrl[i]._rowstatus == null)?'i':'u';
          }
        }
      }
      this.$refs.grdControl.setDataSource(this.ctlList);
      // console.log('vng-154-dvg^_^: > file: 6030014.vue > line 2865 > SetDetailCtlItem > this.ctlList', this.ctlList);
    },
    SetItemToGridTmp() {
      var ctrl = this.$refs.grdControl.getDataSource();
      var ctrlTemp = this.grdControlTemp;
      var obj = {
        ITEM_ALIAS: "",
        ITEM_CODE: "",
        ITEM_NAME: "",
        TABLE_NM: "",
        TABLE_PK: "",
      }; //, TAC_ABACCTITEM_PK:""};

      for (var i = 0; i < ctrl.length; i++) {
        if (ctrl[i].ITEM_ALIAS != "APPLY INVOICE") {
          // var acctpk      = ctrl[i].TAC_ABACCTITEM_PK;
          var itemal = ctrl[i].ITEM_ALIAS;
          var item = ctrl[i].ITEM_CODE;
          var itemnm = ctrl[i].ITEM_NAME;
          var table_name = ctrl[i].TABLE_NM;
          var itempk = ctrl[i].TABLE_PK;

          if (ctrlTemp.length > 0) {
            // Kiem tra xem co du lieu duoi grid tam hay khong?
            var flag;
            var j;
            flag = false;
            j = 1;
            while (j < ctrlTemp.length && !flag) {
              var itemal1 = ctrlTemp[j].ITEM_ALIAS;
              if (itemal == itemal1) {
                flag = true;
                ctrlTemp[j].ITEM_CODE = item;
                ctrlTemp[j].ITEM_NAME = itemnm;
                ctrlTemp[j].TABLE_NM = table_name;
                ctrlTemp[j].TABLE_PK = itempk;
              }
              j = j + 1;
            }
            if (!flag) {
              obj = {
                ITEM_ALIAS: itemal,
                ITEM_CODE: item,
                ITEM_NAME: itemnm,
                TABLE_NM: table_name,
                TABLE_PK: itempk,
              };
              this.grdControlTemp.push(obj);
            }
          } else {
            obj = {
              ITEM_ALIAS: itemal,
              ITEM_CODE: item,
              ITEM_NAME: itemnm,
              TABLE_NM: table_name,
              TABLE_PK: itempk,
            };
            this.grdControlTemp.push(obj);
          }
        }
    }
      
    }
  }
};
</script>
