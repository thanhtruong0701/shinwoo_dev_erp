<!-- SHINWOO -->
<template>
  <v-container fluid class="pa-0" v-resize="onResize">
    <v-row no-gutters>
      <v-col :md="cols_left" class="clsLeft pa-0" v-show="this.isShowLeft">
        <v-card class="pa-2 pt-0">
          <v-row align="center" class="pt-1">
            <v-col md="4" class="pt-0">
              <BaseDatePicker :label="$t('date_from')" v-model="modelSearch.P_FROM_DT" start />
            </v-col>
            <v-col md="4" class="pt-0">
              <BaseDatePicker :label="$t('date_to')" v-model="modelSearch.P_TO_DT" default />
            </v-col>

            <v-col md="4" class="pt-0">
              <div class="d-flex justify-center">
                <BaseButton icon_type="search" :btn_text="$t('search')" @onclick="onClickButton('btnSearch')" />
              </div>
            </v-col>
          </v-row>
          <v-row align="center" class="pt-0">
            <v-col md="4" class="pt-0">
              <BaseSelect :label="$t('company')" v-model="modelSearch.P_COMPANY_PK" :lstData="dataList.lstCompany" item-text="TEXT" item-value="PK" @change="onChangeField('lstCompanySearch')" />
            </v-col>
            <v-col md="8" class="pt-0">
              <BaseSelect :label="$t('factory')" v-model="modelSearch.P_FACTORY_PK" :lstData="dataList.lstFactory" item-text="TEXT" item-value="PK" />
            </v-col>
          </v-row>
          <v-row align="center" class="pt-0">
            <v-col md="8" class="pt-0">
              <BaseSelect :label="$t('warehouse')" v-model="modelSearch.P_WH_PK" :lstData="dataList.lstWH_Search" item-text="TEXT" item-value="PK" :text_all="$t('all')" />
            </v-col>
            <v-col md="4" class="pt-0">
              <BaseSelect :label="$t('status')" v-model="modelSearch.P_STATUS" :lstData="dataList.lstStatus" item-text="NAME" item-value="CODE" />
            </v-col>
          </v-row>
          <v-row align="center" class="pt-0">
            <v-col md="8" class="pt-0">
              <BaseInput :label="$t('item')" v-model="modelSearch.P_ITEM" @keyPressEnter="onClickButton('btnSearch')" clearable />
            </v-col>
            <v-col md="4" class="pt-0">
              <BaseInput :label="$t('barcode')" v-model="modelSearch.P_BARCODE" @keyPressEnter="onClickButton('btnSearch')" clearable />
            </v-col>
          </v-row>
          <v-row align="center" class="pt-0">
            <v-col md="8" class="pt-0">
              <BaseInput :label="$t('slip_no_or_partner_id')" v-model="modelSearch.P_SEARCH_NO" @keyPressEnter="onClickButton('btnSearch')" clearable />
            </v-col>
            <v-col md="4" class="pt-0">
              <BaseCheckbox :label="$t('user_yn')" true-value="Y" false-value="N" v-model="modelSearch.P_EMP_YN" />
            </v-col>
          </v-row>
          <v-row align="center" class="pt-0">
            <v-col md="8" class="pt-0">
              <BaseInput :label="$t('po_no_or_lot_no')" v-model="modelSearch.P_PO_NO_LOT_NO" @keyPressEnter="onClickButton('btnSearch')" clearable />
            </v-col>
            <v-col md="4" class="pt-0"> </v-col>
          </v-row>

          <v-row>
            <v-col md="12" class="pt-0">
              <DataGridView column-resizing-mode="widget" ref="grdSearch" sel_procedure="LG_SEL_SWGD010_V2_NOCACHE" upd_procedure="" select_mode="Single" :auto_load="false" :max_height="limitHeightGrd1" @cellClick="onCellClickGrdSearch" :filter_paras="filterParaGrdSearch" :update_paras="[]" :header="headerGrdSearch" />
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col :md="cols_right" class="pa-0">
        <v-card class="pa-2 pt-0">
          <v-row dense align="center" class="pt-3">
            <!-- <v-col md="2">
                            <BaseInput :label="$t('slip_no')" v-model="modelMaster.SLIP_NO" readonly />
                        </v-col>
                        <v-col md="2">
                            <BaseDatePicker :label="$t('slip_date')" v-model="modelMaster.OUT_DATE" default
                                :readonly="_hasValue(DAYS) ? true : false" />
                        </v-col>
                        <v-col md="1" align="center">
                            <b style="color:red; ">{{ this.modelMaster.STATUS }}</b>
                        </v-col> -->
            <!-- <v-col md="5">
                <v-row class="mr-1">
                <BaseButton icon_type="submit" :btn_text="$t('submit')" :disabled="chkDis1" @onclick="onClickButton('btnSubmit')" v-show="!isPopYN" />
                <BaseButton icon_type="new" :btn_text="$t('new')" :disabled="isProcessing" @onclick="onClickButton('btnAddNewMaster')" v-show="!isPopYN" />
                <BaseButton icon_type="delete" :btn_text="$t('delete')" :disabled="isProcessing" @onclick="onClickButton('btnDelMaster')" v-show="!isPopYN" />
                <BaseButton icon_type="save" :btn_text="$t('save')" :disabled="isProcessing" @onclick="onClickButton('btnSaveMaster')" v-show="!isPopYN" />
                <BaseButton icon_type="attach" :btn_text="$t('attach_files')" :disabled="!_hasValue(modelMaster.PK)" @onclick="onClickButton('btnAttach')" />
                </v-row>
                            </v-col> -->
            <v-col md="4">
              <BaseSelect item-value="CODE" item-text="NAME" :label="$t('type_report')" :lstData="lstTypeReport" v-model="itemTypeReport" disableSearch />
            </v-col>
            <v-col md="1">
              <v-row class="mr-1">
                <BaseButton icon_type="excel" :btn_text="$t('excel')" :disabled="isProcessing" @onclick="onPrint" />
              </v-row>
            </v-col>
          </v-row>
          <!-- <v-row dense align="center" v-show="this._hasValue(this.DAYS) ? true : false">
                        <v-col md="2">
                            <BaseDatePicker :label="$t('input_date')" v-model="modelMaster.INPUT_DATE" default />
                        </v-col>
                        <v-col md="1">
                            <BaseTimePicker v-model="modelMaster.INPUT_HOUR" :label="$t('input_hour')" />
                        </v-col>
                        <v-col md="1">
                            <BaseInput :label="$t('from_hour')" v-model="FROM_HOUR" readonly />
                        </v-col>
                        <v-col md="1">
                            <BaseInput :label="$t('to_hour')" v-model="TO_HOUR" readonly />
                        </v-col>
                        <v-col md="1">
                            <BaseInput :label="$t('days')" v-model="DAYS" readonly />
                        </v-col>
                        <v-col md="2">
                            <BaseSelect :label="$t('pay_term')" v-model="modelMaster.PAY_TERM"
                                :lstData="dataList.lstPayTerm" item-text="NAME" item-value="CODE" :icon="true"
                                @iconclick="onClickLabel('PAY_TERM')" />
                        </v-col>
                        <v-col md="2">
                            <BaseDatePicker :label="$t('due_date')" v-model="modelMaster.DUE_DATE" />
                        </v-col>
                    </v-row> -->
          <!-- <v-row dense align="center">
                        <v-col md="4">
                            <BaseInput :label="$t('ref_no')" v-model="modelMaster.REF_NO" />
                        </v-col>
                        <v-col md="2">
                            <BaseSelect :label="$t('SLIP_TYPE')" v-model="modelMaster.SLIP_TYPE"
                                :lstData="dataList.lstOutType" item-text="NAME" item-value="CODE"
                                v-if="typeSite != 'ILSHIN'" />
                            <BaseSelect :label="$t('SLIP_TYPE')" v-model="modelMaster.SLIP_TYPE"
                                :lstData="dataList.lstOutType" item-text="NAME" item-value="CODE" disableSearch
                                v-else />
                        </v-col>
                        <v-col md="2">
                            <BaseInput :label="$t('charger_name')" v-model="modelMaster.CHARGER_NM" readonly />
                        </v-col>
                        <v-col md="4">
                            <BaseInput :label="$t('end_user_name')" v-model="modelMaster.END_USER_NAME" readonly>
                                <template v-slot:append>
                                    <BaseButton icon_type="find" onlyIcon @onclick="onClickLabel('END_USER')" />
                                </template>
</BaseInput>
</v-col>
</v-row> -->
          <!-- <v-row dense align="center">
                        <v-col md="4">
                            <BaseInput :label="$t('deli_to_name')" v-model="modelMaster.PARTNER_NAME" readonly>
                                <template v-slot:append>
                                    <BaseButton icon_type="find" onlyIcon @onclick="onClickLabel('DELI_TO')" />
                                </template>
                            </BaseInput>
                        </v-col>
                        <v-col md="2">
                            <BaseInput :label="$t('deli_loc')" v-model="modelMaster.ADDRESS" readonly>
                                <template v-slot:append>
                                    <BaseButton icon_type="find" onlyIcon @onclick="onClickLabel('DELI_LOC')" />
                                </template>
                            </BaseInput>
                                <BaseInput :label="$t('deli_loc')" v-model="modelMaster.LOC_NM" readonly>
                <template v-slot:append>
                    <BaseButton icon_type="find" onlyIcon @onclick="onClickLabel('DELI_LOC')" />
                </template>
                </BaseInput>
                        </v-col>
                        <v-col md="2">
                            <BaseSelect :label="$t('dest_port')" v-model="modelMaster.DEST_PORT"
                                :lstData="dataList.lstDestPort" item-text="NAME" item-value="CODE" :icon="true"
                                @iconclick="onClickLabel('DEST_PORT')" />
                        </v-col>
                        <v-col md="2" class="pt-0">
                            <BaseInput :label="$t('driver_name')" v-model="modelMaster.DRIVER_NAME" />
                        </v-col>
                        <v-col md="2" class="pt-0">
                            <BaseInput :label="$t('contact_no')" v-model="modelMaster.CONTACT_NO" />
                        </v-col>
                    </v-row> -->
          <!-- <v-row dense align="center">
                        <v-col md="2">
                            <BaseSelect :label="$t('ccy')" v-model="modelMaster.TR_CCY" :lstData="dataList.lstCurrency"
                                item-text="NAME" item-value="CODE" />
                        </v-col>
                        <v-col md="2">
                            <BaseInput :label="$t('ex_rate')" v-model="modelMaster.EX_RATE" number="0" />
                        </v-col>
                        <v-col md="2">
                            <BaseInput :label="$t('total_item_amt')" v-model="modelMaster.ITEM_AMOUNT" number="2"
                                readonly />
                        </v-col>
                        <v-col md="2">
                            <BaseInput :label="$t('total_vat_amt')" v-model="modelMaster.TAX_AMOUNT" number="2"
                                readonly />
                        </v-col>
                        <v-col md="2">
                            <BaseInput :label="$t('total_amt')" v-model="modelMaster.TOTAL_AMOUNT" number="2"
                                readonly />
                        </v-col>
                        <v-col md="2">
                            <BaseDatePicker :label="$t('etd')" v-model="modelMaster.ETD" default />
                        </v-col>
                    </v-row> -->
          <!-- <v-row dense align="center">

                        <v-col md="2">
                            <BaseInput :label="$t('booking_no')" v-model="modelMaster.BOOKING_NO" />
                        </v-col>
                        <v-col md="2">
                            <BaseInput :label="$t('cont_no')" v-model="modelMaster.CONT_NO" />
                        </v-col>
                        <v-col md="2">
                            <BaseInput :label="$t('seal_no')" v-model="modelMaster.SEAL_NO" />
                        </v-col>
                        <v-col md="2">
                            <BaseInput :label="$t('closing_time')" v-model="modelMaster.CLOSING_TIME" />
                        </v-col>
                        <v-col md="2">
                            <BaseInput :label="$t('vessel_name')" v-model="modelMaster.VESSEL_NAME" />
                        </v-col>
                        <v-col md="2">
                            <BaseDatePicker :label="$t('eta')" v-model="modelMaster.ETA" default />
                        </v-col>
                    </v-row> -->
          <!-- <v-row dense align="center">
                        <v-col md="8">
                            <BaseInput :label="$t('remark')" v-model="modelMaster.DESCRIPTION" />
                        </v-col>
                        <v-col md="3">
                            <BaseSelect :label="$t('warehouse')" v-model="modelMaster.OUT_WH_PK"
                                :lstData="dataList.lstWH_Entry" item-text="TEXT" item-value="PK" />
                        </v-col>
                        <v-col md="1">
                            <v-row class="mr-1">
                                <BaseButton btn_type="icon" icon_type="set" :btn_text="$t('set')" :disabled="isProcessing" @onclick="onSetWH" /> 
                            </v-row>
                        </v-col>
                    </v-row> -->
          <!-- <v-row dense align="center">
                        <v-col md="2">
                            <BaseInput :label="$t('bill_to_id')" v-model="modelMaster.BILL_TO" readonly />
                        </v-col>
                        <v-col md="2">
                            <BaseSelect :label="$t('factory')" v-model="modelMaster.TLG_PR_FACTORY_PK"
                                :lstData="dataList.lstFactory" item-text="TEXT" item-value="PK" readonly />
                        </v-col>
                        <v-col md="2">
                            <BaseInput :label="$t('desc_ar')" v-model="modelMaster.DESC_AR" />
                        </v-col>
                        <v-col md="2">
                            <BaseInput :label="$t('local_desc_ar')" v-model="modelMaster.DESC_AR2" />
                        </v-col>
                        <v-col md="3">
                            <BaseInput :label="$t('ar_voucher_no')" v-model="modelMaster.VOUCHERNO" />
                        </v-col>
                    </v-row> -->
          <!-- <v-row align="center">
                        <v-col md="1" align="left">
                            <v-row class="mr-1">
                                <BaseButton btn_type="icon" :icon_type="isShowLeft ? 'left' : 'right'"
                                    :btn_text="isShowLeft ? $t('collapse') : $t('expand')" :disabled="isProcessing"
                                    @onclick="onShowLeft" />
                            </v-row>
                        </v-col>
                        <v-col md="1">
                            <v-row class="mr-1">
                                <BaseButton btn_type="icon" :icon_type="isShowHideCols ? 'eye_on' : 'eye_off'"
                                    :btn_text="isShowHideCols ? $t('show_cols') : $t('hide_cols')"
                                    :disabled="isProcessing" @onclick="onShowHideCols" />
                            </v-row>
                        </v-col>
                        <v-col md="1">
                            <BaseInput :label="$t('item')" v-model="modelOthers.ITEMS" number="0" readonly />
                        </v-col>
                        <v-col md="1">
                            <BaseInput :label="$t('total_qty')" v-model="modelMaster.TOTAL_OUT_QTY" number="2"
                                readonly />
                        </v-col>
                        <v-col md="1">
                            <BaseCheckbox :label="$t('auto_cal')" true-value="Y" false-value="N"
                                v-model="modelOthers.CHK_AUTO" />
                        </v-col>
                        <v-col md="2">
                            <BaseCheckbox :label="$t('group_by_item')" true-value="Y" false-value="N"
                                v-model="modelOthers.CHK_GRP_ITEM" />
                        </v-col>
                        <v-col md="1">
                            <v-row class="mr-1">
                                <BaseButton icon_type="popup" :btn_text="$t('gd_type')" :disabled="isProcessing"
                                    @onclick="onClickLabel('GD_TYPE')" />
                            </v-row>
                        </v-col>
                        <v-col md="4">
                            <v-row class="ml-1">
                                <BaseButton icon_type="new" :btn_text="$t('gd_request')" :disabled="isProcessing"
                                    @onclick="onClickButton('btnAddGDRequest')" v-if="!isPopYN" />
                                    <BaseButton icon_type="new" :btn_text="$t('scan')" :disabled="isProcessing" @onclick="onClickButton('btnScan')" v-if="typeSite == 'ILSHIN'" />
                                    <BaseButton icon_type="new" :btn_text="$t('result')" :disabled="isProcessing" @onclick="onClickButton('btnAddResult')" v-if="typeSite == 'ILSHIN'" />
                                    <BaseButton icon_type="new" :btn_text="$t('s_order')" :disabled="isProcessing" @onclick="onClickButton('btnSOrder')" v-if="typeSite == 'ILSHIN'" />
                                    <BaseButton icon_type="new" :btn_text="$t('stock')" :disabled="isProcessing" @onclick="onClickButton('btnStock')" v-if="typeSite == 'ILSHIN'" /> 
                                    <BaseButton icon_type="undelete" :btn_text="$t('undelete')" :disabled="isProcessing"
                                    @onclick="onClickButton('btnUnDeleteDetail')" v-if="!isPopYN" />
                                    <BaseButton icon_type="delete" :btn_text="$t('delete')" :disabled="isProcessing"
                                    @onclick="onClickButton('btnDeleteDetail')" v-if="!isPopYN" />
                            </v-row>
                        </v-col>
                    </v-row> -->
          <v-row align="center">
            <v-col md="12">
              <BaseGridView  column-resizing-mode="widget" ref="grdDetail" sel_procedure="LG_SEL_SWGD010_2_NOCACHE" upd_procedure="LG_UPD_5010022_2" select_mode="MultipleHideBox" :auto_load="false" :virtualmode="true" :max_height="limitHeightGrd2" @row-updated="onCheckUpdated" @onAfterLoadData="onAfterLoad" @cellDblClick="onCellDbClick" :filter_paras="filter2" :update_paras="updParaGrdD" :header="headerGrdD" />

              <!-- <BaseTab :name="$t('sum')">
                                    <DataGridView column-resizing-mode="widget" ref="grdSum"
                                        sel_procedure="LG_SEL_SWGD010_3_NOCACHE" upd_procedure=""
                                        select_mode="MultipleHideBox" :auto_load="false" :max_height="limitHeightGrd2"
                                        :filter_paras="filter1" :header="headerGrdD" />
                                </BaseTab> -->
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog eager v-model="dialogIsShow" max-width="1500">
      <v-card outlined tile v-resize="onResize">
        <v-card-title class="headline grey lighten-2">{{ $t('gd_req') }} </v-card-title>
        <gdrequest ref="refGDRequest" :paras="[true, true]" v-if="dialogIsShow" @callBackData="callBackGDReq"> </gdrequest>
      </v-card>
    </v-dialog>

    <confirm-dialog ref="confirmDialog" @onConfirm="onClickButton('btnAgreeCF')"></confirm-dialog>
    <alert-dialog ref="alertDialog"></alert-dialog>
    <partnerdialog ref="delitoDialog" @callBackData="mappingPartner" />
    <partnerlocdialog ref="delitoLocDialog" @callBackData="mappingDeliToLoc" />
    <logistic-code-dialog ref="refLogisticCode" @callBackData="callBackLogisticCode" />
    <lgmapbarcodedialog01 ref="refLGMapBarcodeDialog01" @callBackData="callBackMapBarcode" />

    <get-deli-plan ref="refGetDeliPlan" @callBackData="callBackDeliPlan" :objSend="objSend1" />
    <warehouse-location-dialog ref="refWHLoc" @callBackData="callBackLocation"></warehouse-location-dialog>

    <upload-files-dialog ref="refFilesUploadDialog" :obj="objSend2" />

    <GetItemFromResult ref="refGetItemFromResult" @callBackData="receiveData01" :objSend="objSend1" />
    <GetItemFromSaleOrder ref="refGetItemFromSaleOrder" @callBackData="receiveData02" :objSend="objSend1" />
    <Stock ref="refStock" @callBackData="receiveData03" />
    <Scan ref="refScan" @callBackData="receiveData04" :objSend="objSend1" />
  </v-container>
</template>

<script>
import moment from 'moment';
import ConfirmDialog from '@/components/dialog/ConfirmDialog';
import AlertDialog from '@/components/dialog/AlertDialog';
import LogisticCodeDialog from '@/components/dialog/CommonCodeDialog';
// import gdrequest from "@/pages/50/10/5010011_V2";
import lgmapbarcodedialog01 from '@/components/dialog/LGMapBarcodeDialog01';
// import GetDeliPlan from '@/pages/50/10/5010022_POP01';
import WarehouseLocationDialog from '@/components/dialog/WarehouseLocationDialog';
import GetItemFromResult from '@/components/dialog/GetItemFromResult';
import GetItemFromSaleOrder from '@/components/dialog/GetItemFromSaleOrder';
import Stock from '@/components/dialog/ItemStockILSHIN';
import Scan from '@/components/dialog/ItemScanILSHIN';

import UploadFilesDialog from '@/components/dialog/upload-files-dialog';

export default {
  layout: 'default',
  middleware: 'user',

  components: {
    Scan,
    GetItemFromResult,
    GetItemFromSaleOrder,
    Stock,
    ConfirmDialog,
    AlertDialog,
    LogisticCodeDialog,
    // gdrequest,
    employeedialog: () => import('@/components/dialog/EmployeeDialog'),
    partnerdialog: () => import('@/components/dialog/PartnerDialogAll'),
    // partnerlocdialog: () => import("@/components/dialog/PartnerLocDialog"),
    partnerlocdialog: () => import('@/components/dialog/BusiPartnerLocOTM'),
    lgmapbarcodedialog01,
    // GetDeliPlan,
    WarehouseLocationDialog,
    UploadFilesDialog
  },

  data: () => ({
    chk2: false,
    chk1: false,
    objSend2: {
      tableName: 'TLG_RO_M',
      selPro: 'LG_SEL_5010022_POP02_1',
      updPro1: 'LG_UPD_5010022_POP02_1',
      updPro2: 'LG_UPD_5010022_POP02_2'
    },
    tabsNum: 0,
    headerGrdSearch: [],
    itemTypeReport: '',
    lstTypeReport: [],
    // lstTypeReport: [
    // { CODE: 1, NAME: 'DELIVERY SLIP' }, { CODE: 2, NAME: 'DEBIT NOTE' }, { CODE: 3, NAME: 'Delivery Notes Nike' }, { CODE: 4, NAME: 'Delivery Notes FNF' }, { CODE: 5, NAME: 'Delivery Notes Others' }],
    headerGrdD: [],
    itemSelect: {},
    rowSelect: {},
    objSend1: {},
    isPopYN: false,
    cols_right: 9,
    cols_left: 3,
    isShowLeft: true,
    isShowHideCols: false,
    dialogIsShow: false,
    FROM_HOUR: '',
    TO_HOUR: '',
    DAYS: '',
    dataList: { lstCompany: [], lstDestPort: [], lstCurrency: [], lstOutType: [], lstWH_Search: [], lstWH_Entry: [], lstGDType: [], lstPayTerm: [], lstFactory: [], lstStatus: [] },

    modelSearch: { P_FROM_DT: '', P_TO_DT: '', P_SEARCH_NO: '', P_ITEM: '', P_EMP_PK: '', P_EMP_YN: 'Y', P_WH_PK: '', P_COMPANY_PK: '', P_USER_PK: '', P_FACTORY_PK: '', P_BARCODE: '', P_STATUS: '', P_PO_NO_LOT_NO: '' },

    modelMaster: { _rowstatus: '', PK: '', SLIP_NO: '', OUT_DATE: '', INPUT_DATE: '', INPUT_HOUR: '', STATUS: '', REF_NO: '', CHARGER_PK: '', CHARGER_NM: '', END_USER_PK: '', END_USER_NAME: '', CUST_PK: '', PARTNER_NAME: '', DELI_LOC_PK: '', LOC_NM: '', ITEM_AMOUNT: '', TAX_AMOUNT: '', TOTAL_AMOUNT: '', TR_CCY: '', EX_RATE: '', DESCRIPTION: '', DESC_AR: '', DESC_AR2: '', SLIP_TYPE: '', OUT_WH_PK: '', BOOKING_NO: '', CONT_NO: '', SEAL_NO: '', CLOSING_TIME: '', VESSEL_NAME: '', DEST_PORT: '', ETD: '', ETA: '', VOUCHERNO: '', TCO_COMPANY_PK: '', TOTAL_OUT_QTY: '', STATUS_CODE: '', ADDRESS: '', PAY_TERM: '', DUE_DATE: '', DRIVER_NAME: '', CONTACT_NO: '', GRP_ITEM_YN: 'Y' },

    modelOthers: { QTY: 0, ITEMS: 0, CHK_AUTO: 'Y', CHK_GRP_ITEM: 'Y' },
    objClick: '',
    selectedDetail_PK: '',
    deleteProps1: [],
    isProcessing: false,
    selectionMode: 'multiple',
    gw_btnFreeItem: {
      disabled: false,
      visibled: true
    },
    gw_btnSO: {
      disabled: false,
      visibled: true
    },
    actionDialog: false,
    actionProcess: '',
    formIsValid: undefined,
    resultList: [],
    cellDblClickgrdDetail: {},
    typeSite: '',
    P_TLG_GD_OUTGO_M_PK: ''
  }),
  async created() {
    this.onBodyInit();
    this.initHeader();
    this.itemTypeReport = this.user.TCO_COMPANY_PK;
    this.lstTypeReport = await this._getCommonCode('SWGD010_01', this.itemTypeReport);
    this.itemTypeReport = this.lstTypeReport?.[2]?.CODE || null;
  },
  async mounted() {},
  watch: {
    isShowLeft(val) {
      if (val) {
        this.cols_right = 9;
        this.cols_left = 3;
      } else {
        this.cols_right = 12;
        this.cols_left = 0;
      }
    },

    'modelMaster.INPUT_DATE'(val) {
      if (this._hasValue(this.DAYS) && this._hasValue(this.modelMaster.INPUT_DATE)) {
        this.OnChangeInputDate();
      }
    },
    'modelMaster.INPUT_HOUR'(val) {
      if (this._hasValue(this.DAYS) && this._hasValue(this.modelMaster.INPUT_DATE)) {
        this.OnChangeInputDate();
      }
    },
    'modelMaster.OUT_WH_PK'(val) {
      this.onSetWH();
    },
    async 'modelMaster.PAY_TERM'(val) {
      if (val) {
        let _lstPayTerm = this.dataList.lstPayTerm.filter(x => x.CODE == val);
        let day = 0;
        if (_lstPayTerm.length >= 0) {
          day = _lstPayTerm[0].NUM1;
        }
        if (this.typeSite == 'KPX') {
          if (!this.chk2) {
            const dso1 = {
              type: 'list',
              selpro: 'LG_SEL_2000010_2_NOCACHE',
              para: [this.modelMaster.CUST_PK, val]
            };
            const res1 = await this._dsoCall(dso1, 'select', false);
            if (res1) {
              if (res1.length > 0) this.modelMaster.DUE_DATE = this._plusdate(this.modelMaster.OUT_DATE, '', 'd', res1[0].VALUE_DAYS);
              else this.modelMaster.DUE_DATE = this._plusdate(this.modelMaster.OUT_DATE, '', 'd', day);
            } else this.modelMaster.DUE_DATE = this._plusdate(this.modelMaster.OUT_DATE, '', 'd', day);
          }
          this.chk2 = false;
        } else {
          this.modelMaster.DUE_DATE = this._plusdate(this.modelMaster.OUT_DATE, '', 'd', day);
        }
      }
    }
  },

  computed: {
    filter2() {
      return [this.modelMaster.PK];
    },
    filter1() {
      return [this.modelMaster.PK];
    },
    chkDis1() {
      return !(this.modelMaster.STATUS_CODE == '1');
    },
    filterParaGrdSearch() {
      return [this.modelSearch.P_FROM_DT, this.modelSearch.P_TO_DT, this.modelSearch.P_SEARCH_NO, this.modelSearch.P_ITEM, this.modelSearch.P_EMP_PK, this.modelSearch.P_EMP_YN, this.modelSearch.P_WH_PK, this.modelSearch.P_COMPANY_PK, this.modelSearch.P_USER_PK, this.modelSearch.P_FACTORY_PK, this.modelSearch.P_BARCODE, this.modelSearch.P_STATUS, this.modelSearch.P_PO_NO_LOT_NO];
    },
    updParaGrdD() {
      return ['PK', 'SEQ', 'REF_NO', 'REQ_ITEM_PK', 'REQ_ITEM_CODE', 'REQ_ITEM_NAME', 'ITEM_BC', 'OUT_ITEM_PK', 'OUT_ITEM_CODE', 'OUT_ITEM_NAME', 'CUST_ITEM_CODE', 'CUST_ITEM_NAME', 'REQ_QTY', 'REQ_UOM', 'OUT_QTY', 'OUT_UOM', 'PALLET_QTY', 'UNIT_PRICE', 'ITEM_AMOUNT', 'VAT_RATE', 'VAT_AMOUNT', 'TOTAL_AMOUNT', 'LOT_NO', 'PO_NO', 'GRADE', 'WH_PK', 'WH_NAME', 'GD_TYPE', 'LOC_NAME', 'TLG_IN_WHLOC_PK', 'ATT03', 'DESCRIPTION', 'TLG_GD_OUTGO_M_PK', 'TLG_SA_SALEORDER_D_PK', 'TLG_GD_REQ_D_PK', 'TABLE_PK', 'TABLE_NM', 'PARENT_PK', 'ACC_GET_YN', 'TLG_CO_SALEORDER_D_PK', 'TLG_SA_SALEORDER_M_PK', 'REQ_SLIP', 'REF_QTY', 'REF_UOM', 'REF_QTY_2', 'REF_UOM_2', 'EXPIRE_DATE_1', 'FREE_QTY_01', 'FREE_QTY_02', 'FREE_QTY_03', 'FREE_CODE_01', 'FREE_CODE_02', 'FREE_CODE_03', 'FREE_DATE_01', 'FREE_DATE_02', 'FREE_DATE_03', 'BOX_QTY', 'PACKING_QTY', 'REF_INVOICE'];
    },
    limitHeightGrd1() {
      switch (this.$vuetify.breakpoint.name) {
        case 'md':
          return this.windowHeight * 0.52;
        case 'lg':
          return this.windowHeight * 0.58;
        case 'xl':
          return this.windowHeight * 0.64;
        default:
          return this.windowHeight * 0.52;
      }
    },
    limitHeightGrd2() {
      let addHeight = this._hasValue(this.DAYS) == true ? -40 : 0;
      switch (this.$vuetify.breakpoint.name) {
        case 'md':
          return this.windowHeight * 0.38 + addHeight;
        case 'lg':
          return this.windowHeight * 0.8 + addHeight;
        case 'xl':
          return this.windowHeight * 0.45 + addHeight; // old num 0.5
        default:
          return this.windowHeight * 0.38 + addHeight;
      }
    },
    user() {
      return this.$store.getters['auth/user'];
    },

    cwCommonParam() {
      return {
        ...this.$store.getters['auth/cwCommonParam']
      };
    }
  },

  methods: {
    async checkSite() {
      const dso = {
        type: 'list',
        selpro: 'LG_GET_FORM_NO',
        para: [this.user.USER_ID, this.user.TCO_COMPANY_PK]
      };
      const result = await this._dsoCall(dso, 'select', false);
      if (result.length > 0) {
        if (result[0].FORM_NO == '0cfLu8N0y8') {
          this.typeSite = 'LGL';
        }
        if (result[0].FORM_NO == 'uVn7ch0uQ0') {
          this.itemTypeReport = 1;
          this.typeSite = 'KPX';
          this.initHeader();
        }
        if (result[0].FORM_NO == 'tYjK5ETjTa') {
          this.typeSite = 'OTM';
        }
        if (result[0].FORM_NO == 'R3PqEWabFR') {
          this.typeSite = 'ILSHIN';
          const dso = {
            type: 'list',
            selpro: 'LG_GET_COMMONCODE',
            para: ['LGIN0304']
          };
          const result = await this._dsoCall(dso, 'select', false);
          if (result.length > 0) this.dataList.lstOutType = result;
          this.modelMaster.SLIP_TYPE = '10';
        }
        if (result[0].FORM_NO == 'E0GaSE05fd') {
          this.typeSite = 'WEBCASH';
        }
        if (result[0].FORM_NO == '9wjTU9YX2h') {
          this.typeSite = 'SAMBU';
        }
        if (result[0].FORM_NO == '68XvubXw7S') {
          this.typeSite = 'SHINWOO';
        }
        if (result[0].FORM_NO == 'rUZNZTbVJy') {
          this.typeSite = 'AJ';
        }
      }
    },
    receiveData04(data) {
      if (data.length > 0) {
        data.forEach(ee1 => {
          let insertRow = {};
          // PA_PACKAGES_PK, PACKAGE_SEQ, ITEM_BC, TLG_IT_ITEM_PK, ITEM_CODE, ITEM_NAME, UOM, QTY, LOT_NO, ROLL_NO, PRINT_TIMES, TABLE_NAME, TRANS_TYPE
          // pa_packages_pk, package_seq, item_bc, tlg_it_item_pk, item_code, item_name, uom, qty, lot_no, roll_no, print_times, table_name, trans_type
          insertRow.PK = this._uniqueID();
          insertRow.SEQ = this.$refs.grdDetail.getDataSource().length + 1;
          insertRow.REQ_ITEM_PK = ee1.TLG_IT_ITEM_PK;
          insertRow.REQ_ITEM_CODE = ee1.ITEM_CODE;
          insertRow.REQ_ITEM_NAME = ee1.ITEM_NAME;
          insertRow.OUT_ITEM_PK = ee1.TLG_IT_ITEM_PK;
          insertRow.OUT_ITEM_CODE = ee1.ITEM_CODE;
          insertRow.OUT_ITEM_NAME = ee1.ITEM_NAME;
          insertRow.REQ_QTY = ee1.QTY;
          insertRow.REQ_UOM = ee1.UOM;
          insertRow.OUT_QTY = ee1.QTY;
          insertRow.OUT_UOM = ee1.UOM;
          insertRow.PO_NO = '';
          insertRow.GD_TYPE = '';
          insertRow.TLG_GD_OUTGO_M_PK = this.modelMaster.PK;
          insertRow.TLG_SA_SALEORDER_D_PK = '';
          insertRow.PARENT_PK = '';
          insertRow.ACC_GET_YN = 'N';
          insertRow.REF_NO = ee1.ITEM_BC;
          insertRow.ITEM_BC = ee1.ITEM_BC;
          insertRow.CUST_ITEM_CODE = '';
          insertRow.CUST_ITEM_NAME = '';
          insertRow.PALLET_QTY = '';
          insertRow.UNIT_PRICE = '';
          insertRow.ITEM_AMOUNT = '';
          insertRow.VAT_RATE = '';
          insertRow.VAT_AMOUNT = '';
          insertRow.TOTAL_AMOUNT = '';
          insertRow.LOT_NO = ee1.LOT_NO;
          insertRow.GRADE = '';
          insertRow.WH_PK = ee1.TLG_IN_WAREHOUSE_PK;
          insertRow.WH_NAME = ee1.WH_NAME;
          insertRow.LOC_NAME = '';
          insertRow.TLG_IN_WHLOC_PK = '';
          insertRow.ATT_3 = '';
          insertRow.DESCRIPTION = ee1.PACKAGE_SEQ;
          insertRow.TLG_GD_REQ_D_PK = '';
          insertRow.TABLE_NAME = ee1.TABLE_NAME;
          insertRow.TABLE_PK = ee1.PA_PACKAGES_PK;
          insertRow.TLG_CO_SALEORDER_D_PK = '';
          insertRow.TLG_SA_SALEORDER_M_PK = '';
          insertRow.REQ_SLIP = '';
          insertRow.REF_QTY = ee1.REF_QTY;
          insertRow.REF_QTY_2 = '';
          insertRow.REF_UOM = '';
          insertRow.REF_UOM_2 = '';
          insertRow.EXPIRE_DATE_1 = '';
          insertRow.FREE_QTY_01 = '';
          insertRow.FREE_QTY_02 = '';
          insertRow.FREE_QTY_03 = '';
          insertRow.FREE_CODE_01 = '';
          insertRow.FREE_CODE_02 = '';
          insertRow.FREE_CODE_03 = '';
          insertRow.FREE_DATE_01 = '';
          insertRow.FREE_DATE_02 = '';
          insertRow.FREE_DATE_03 = '';
          insertRow.PACKING_QTY = '';
          insertRow.BOX_QTY = '';
          insertRow.REF_INVOICE = '';
          this.$refs.grdDetail.addRowStruct(insertRow);
        });
      }
    },
    receiveData03(data) {
      if (data.length > 0) {
        data.forEach(ee1 => {
          let insertRow = {};
          // TLG_IN_WAREHOUSE_PK, WH_NAME, TLG_IT_ITEM_PK, ITEM_CODE, ITEM_NAME, UOM, STOCK_QTY, LOT_NO, REF_QTY
          // tlg_in_warehouse_pk, wh_name, tlg_it_item_pk, item_code, item_name, uom, stock_qty, lot_no, ref_qty
          insertRow.PK = this._uniqueID();
          insertRow.SEQ = this.$refs.grdDetail.getDataSource().length + 1;
          insertRow.REQ_ITEM_PK = ee1.TLG_IT_ITEM_PK;
          insertRow.REQ_ITEM_CODE = ee1.ITEM_CODE;
          insertRow.REQ_ITEM_NAME = ee1.ITEM_NAME;
          insertRow.OUT_ITEM_PK = ee1.TLG_IT_ITEM_PK;
          insertRow.OUT_ITEM_CODE = ee1.ITEM_CODE;
          insertRow.OUT_ITEM_NAME = ee1.ITEM_NAME;
          insertRow.REQ_QTY = ee1.STOCK_QTY;
          insertRow.REQ_UOM = ee1.UOM;
          insertRow.OUT_QTY = ee1.STOCK_QTY;
          insertRow.OUT_UOM = ee1.UOM;
          insertRow.PO_NO = '';
          insertRow.GD_TYPE = '';
          insertRow.TLG_GD_OUTGO_M_PK = this.modelMaster.PK;
          insertRow.TLG_SA_SALEORDER_D_PK = '';
          insertRow.PARENT_PK = '';
          insertRow.ACC_GET_YN = 'N';
          insertRow.REF_NO = '';
          insertRow.ITEM_BC = '';
          insertRow.CUST_ITEM_CODE = '';
          insertRow.CUST_ITEM_NAME = '';
          insertRow.PALLET_QTY = '';
          insertRow.UNIT_PRICE = '';
          insertRow.ITEM_AMOUNT = '';
          insertRow.VAT_RATE = '';
          insertRow.VAT_AMOUNT = '';
          insertRow.TOTAL_AMOUNT = '';
          insertRow.LOT_NO = ee1.LOT_NO;
          insertRow.GRADE = '';
          insertRow.WH_PK = ee1.TLG_IN_WAREHOUSE_PK;
          insertRow.WH_NAME = ee1.WH_NAME;
          insertRow.LOC_NAME = '';
          insertRow.TLG_IN_WHLOC_PK = '';
          insertRow.ATT_3 = '';
          insertRow.DESCRIPTION = '';
          insertRow.TLG_GD_REQ_D_PK = '';
          insertRow.TABLE_NAME = '';
          insertRow.TABLE_PK = '';
          insertRow.TLG_CO_SALEORDER_D_PK = '';
          insertRow.TLG_SA_SALEORDER_M_PK = '';
          insertRow.REQ_SLIP = '';
          insertRow.REF_QTY = ee1.REF_QTY;
          insertRow.REF_QTY_2 = '';
          insertRow.REF_UOM = '';
          insertRow.REF_UOM_2 = '';
          insertRow.EXPIRE_DATE_1 = '';
          insertRow.FREE_QTY_01 = '';
          insertRow.FREE_QTY_02 = '';
          insertRow.FREE_QTY_03 = '';
          insertRow.FREE_CODE_01 = '';
          insertRow.FREE_CODE_02 = '';
          insertRow.FREE_CODE_03 = '';
          insertRow.FREE_DATE_01 = '';
          insertRow.FREE_DATE_02 = '';
          insertRow.FREE_DATE_03 = '';
          insertRow.PACKING_QTY = '';
          insertRow.BOX_QTY = '';
          insertRow.REF_INVOICE = '';
          this.$refs.grdDetail.addRowStruct(insertRow);
        });
      }
    },
    receiveData02(data) {
      if (data.length > 0) {
        data.forEach(ee1 => {
          let insertRow = {};
          // PO_NO, SO_ITEM_NO, TLG_IT_ITEM_PK, ITEM_CODE, ITEM_NAME, UOM, ORD_QTY, PROD_QTY, REQ_QTY, REQ_BAL, STOCK_BAL, TLG_SA_SALEORDER_D_PK, DESCRIPTION
          insertRow.PK = this._uniqueID();
          insertRow.SEQ = this.$refs.grdDetail.getDataSource().length + 1;
          insertRow.REQ_ITEM_PK = ee1.TLG_IT_ITEM_PK;
          insertRow.REQ_ITEM_CODE = ee1.ITEM_CODE;
          insertRow.REQ_ITEM_NAME = ee1.ITEM_NAME;
          insertRow.OUT_ITEM_PK = ee1.TLG_IT_ITEM_PK;
          insertRow.OUT_ITEM_CODE = ee1.ITEM_CODE;
          insertRow.OUT_ITEM_NAME = ee1.ITEM_NAME;
          insertRow.REQ_QTY = ee1.REQ_QTY;
          insertRow.REQ_UOM = ee1.UOM;
          insertRow.OUT_QTY = ee1.REQ_QTY;
          insertRow.OUT_UOM = ee1.UOM;
          insertRow.PO_NO = ee1.PO_NO;
          insertRow.GD_TYPE = '';
          insertRow.TLG_GD_OUTGO_M_PK = this.modelMaster.PK;
          insertRow.TLG_SA_SALEORDER_D_PK = ee1.TLG_SA_SALEORDER_D_PK;
          insertRow.PARENT_PK = '';
          insertRow.ACC_GET_YN = 'N';
          insertRow.REF_NO = '';
          insertRow.ITEM_BC = '';
          insertRow.CUST_ITEM_CODE = '';
          insertRow.CUST_ITEM_NAME = '';
          insertRow.PALLET_QTY = '';
          insertRow.UNIT_PRICE = '';
          insertRow.ITEM_AMOUNT = '';
          insertRow.VAT_RATE = '';
          insertRow.VAT_AMOUNT = '';
          insertRow.TOTAL_AMOUNT = '';
          insertRow.LOT_NO = '';
          insertRow.GRADE = '';
          insertRow.WH_PK = '';
          insertRow.WH_NAME = '';
          insertRow.LOC_NAME = '';
          insertRow.TLG_IN_WHLOC_PK = '';
          insertRow.ATT_3 = '';
          insertRow.DESCRIPTION = '';
          insertRow.TLG_GD_REQ_D_PK = '';
          insertRow.TABLE_NAME = '';
          insertRow.TABLE_PK = '';
          insertRow.TLG_CO_SALEORDER_D_PK = '';
          insertRow.TLG_SA_SALEORDER_M_PK = '';
          insertRow.REQ_SLIP = '';
          insertRow.REF_QTY = '';
          insertRow.REF_QTY_2 = '';
          insertRow.REF_UOM = '';
          insertRow.REF_UOM_2 = '';
          insertRow.EXPIRE_DATE_1 = '';
          insertRow.FREE_QTY_01 = '';
          insertRow.FREE_QTY_02 = '';
          insertRow.FREE_QTY_03 = '';
          insertRow.FREE_CODE_01 = '';
          insertRow.FREE_CODE_02 = '';
          insertRow.FREE_CODE_03 = '';
          insertRow.FREE_DATE_01 = '';
          insertRow.FREE_DATE_02 = '';
          insertRow.FREE_DATE_03 = '';
          insertRow.PACKING_QTY = '';
          insertRow.BOX_QTY = '';
          insertRow.REF_INVOICE = '';
          this.$refs.grdDetail.addRowStruct(insertRow);
        });
      }
    },
    receiveData01(data) {
      if (data.length > 0) {
        data.forEach(ee1 => {
          let insertRow = {};
          // PO_NO, SO_ITEM_NO, TLG_IT_ITEM_PK, ITEM_CODE, ITEM_NAME, UOM, ORD_QTY, PROD_QTY, REQ_QTY, REQ_BAL_QTY, CURRENT_QTY, TLG_SA_SALEORDER_D_PK, PROD_DATE
          insertRow.PK = this._uniqueID();
          insertRow.SEQ = this.$refs.grdDetail.getDataSource().length + 1;
          insertRow.REQ_ITEM_PK = ee1.TLG_IT_ITEM_PK;
          insertRow.REQ_ITEM_CODE = ee1.ITEM_CODE;
          insertRow.REQ_ITEM_NAME = ee1.ITEM_NAME;
          insertRow.OUT_ITEM_PK = ee1.TLG_IT_ITEM_PK;
          insertRow.OUT_ITEM_CODE = ee1.ITEM_CODE;
          insertRow.OUT_ITEM_NAME = ee1.ITEM_NAME;
          insertRow.REQ_QTY = ee1.REQ_QTY;
          insertRow.REQ_UOM = ee1.UOM;
          insertRow.OUT_QTY = ee1.REQ_QTY;
          insertRow.OUT_UOM = ee1.UOM;
          insertRow.PO_NO = ee1.PO_NO;
          insertRow.GD_TYPE = '';
          insertRow.TLG_GD_OUTGO_M_PK = this.modelMaster.PK;
          insertRow.TLG_SA_SALEORDER_D_PK = ee1.TLG_SA_SALEORDER_D_PK;
          insertRow.PARENT_PK = '';
          insertRow.ACC_GET_YN = 'N';
          insertRow.REF_NO = '';
          insertRow.ITEM_BC = '';
          insertRow.CUST_ITEM_CODE = '';
          insertRow.CUST_ITEM_NAME = '';
          insertRow.PALLET_QTY = '';
          insertRow.UNIT_PRICE = '';
          insertRow.ITEM_AMOUNT = '';
          insertRow.VAT_RATE = '';
          insertRow.VAT_AMOUNT = '';
          insertRow.TOTAL_AMOUNT = '';
          insertRow.LOT_NO = '';
          insertRow.GRADE = '';
          insertRow.WH_PK = '';
          insertRow.WH_NAME = '';
          insertRow.LOC_NAME = '';
          insertRow.TLG_IN_WHLOC_PK = '';
          insertRow.ATT_3 = '';
          insertRow.DESCRIPTION = '';
          insertRow.TLG_GD_REQ_D_PK = '';
          insertRow.TABLE_NAME = '';
          insertRow.TABLE_PK = '';
          insertRow.TLG_CO_SALEORDER_D_PK = '';
          insertRow.TLG_SA_SALEORDER_M_PK = '';
          insertRow.REQ_SLIP = '';
          insertRow.REF_QTY = '';
          insertRow.REF_QTY_2 = '';
          insertRow.REF_UOM = '';
          insertRow.REF_UOM_2 = '';
          insertRow.EXPIRE_DATE_1 = '';
          insertRow.FREE_QTY_01 = '';
          insertRow.FREE_QTY_02 = '';
          insertRow.FREE_QTY_03 = '';
          insertRow.FREE_CODE_01 = '';
          insertRow.FREE_CODE_02 = '';
          insertRow.FREE_CODE_03 = '';
          insertRow.FREE_DATE_01 = '';
          insertRow.FREE_DATE_02 = '';
          insertRow.FREE_DATE_03 = '';
          insertRow.PACKING_QTY = '';
          insertRow.BOX_QTY = '';
          insertRow.REF_INVOICE = '';
          this.$refs.grdDetail.addRowStruct(insertRow);
        });
      }
    },
    async reLoadGroupSum() {
      const dso = {
        type: 'process',
        updpro: 'LG_PRO_5010022_2', // st old LG_PRO_5010022_1
        para: [this.modelMaster.PK, this.modelOthers.CHK_GRP_ITEM]
      };
      const result = await this._dsoCall(dso, 'process', false);
    },
    onTabChanged(val) {
      this.tabsNum = val;
    },
    onAddDeliPlan(data) {
      this.itemSelect = data;
      this.objSend1 = {
        OUT_ITEM_PK: data.OUT_ITEM_PK,
        OUT_ITEM_CODE: data.OUT_ITEM_CODE,
        OUT_ITEM_NAME: data.OUT_ITEM_NAME,
        PO_NO: data.PO_NO,
        WH_PK: data.WH_PK,
        WH_NAME: data.WH_NAME
      };
      this.$refs.refGetDeliPlan.dialogIsShow = true;
    },
    updateRowFirst(row) {
      // this.$refs.grdDetail.setCellValue("PK", this._uniqueID(), this.itemSelect.PK, "PK");
      // this.$refs.grdDetail.setCellValue("SEQ", this.$refs.grdDetail.getDataSource().length + 1, this.itemSelect.PK, "PK");
      this.$refs.grdDetail.setCellValue('REF_NO', row.REF_NO, this.itemSelect.PK, 'PK');
      this.$refs.grdDetail.setCellValue('REQ_ITEM_PK', row.REQ_ITEM_PK, this.itemSelect.PK, 'PK');
      this.$refs.grdDetail.setCellValue('REQ_ITEM_CODE', row.REQ_ITEM_CODE, this.itemSelect.PK, 'PK');
      this.$refs.grdDetail.setCellValue('REQ_ITEM_NAME', row.REQ_ITEM_NAME, this.itemSelect.PK, 'PK');
      this.$refs.grdDetail.setCellValue('ITEM_BC', row.ITEM_BC, this.itemSelect.PK, 'PK');
      this.$refs.grdDetail.setCellValue('OUT_ITEM_PK', row.REQ_ITEM_PK, this.itemSelect.PK, 'PK');
      this.$refs.grdDetail.setCellValue('OUT_ITEM_CODE', row.REQ_ITEM_CODE, this.itemSelect.PK, 'PK');
      this.$refs.grdDetail.setCellValue('OUT_ITEM_NAME', row.REQ_ITEM_NAME, this.itemSelect.PK, 'PK');
      this.$refs.grdDetail.setCellValue('CUST_ITEM_CODE', row.CUST_ITEM_CODE, this.itemSelect.PK, 'PK');
      this.$refs.grdDetail.setCellValue('CUST_ITEM_NAME', row.CUST_ITEM_NAME, this.itemSelect.PK, 'PK');
      this.$refs.grdDetail.setCellValue('REQ_QTY', row.REQ_QTY, this.itemSelect.PK, 'PK');
      this.$refs.grdDetail.setCellValue('REQ_UOM', row.REQ_UOM, this.itemSelect.PK, 'PK');
      this.$refs.grdDetail.setCellValue('OUT_QTY', row.REQ_QTY, this.itemSelect.PK, 'PK');
      this.$refs.grdDetail.setCellValue('OUT_UOM', row.REQ_UOM, this.itemSelect.PK, 'PK');
      this.$refs.grdDetail.setCellValue('PALLET_QTY', row.PACKING_QTY, this.itemSelect.PK, 'PK');
      this.$refs.grdDetail.setCellValue('UNIT_PRICE', row.UNIT_PRICE, this.itemSelect.PK, 'PK');
      this.$refs.grdDetail.setCellValue('ITEM_AMOUNT', row.ITEM_AMOUNT, this.itemSelect.PK, 'PK');
      this.$refs.grdDetail.setCellValue('VAT_RATE', row.VAT_RATE, this.itemSelect.PK, 'PK');
      this.$refs.grdDetail.setCellValue('VAT_AMOUNT', row.VAT_AMOUNT, this.itemSelect.PK, 'PK');
      this.$refs.grdDetail.setCellValue('TOTAL_AMOUNT', row.TOTAL_AMOUNT, this.itemSelect.PK, 'PK');
      this.$refs.grdDetail.setCellValue('LOT_NO', row.LOT_NO, this.itemSelect.PK, 'PK');
      this.$refs.grdDetail.setCellValue('PO_NO', this.itemSelect.PO_NO, this.itemSelect.PK, 'PK');
      this.$refs.grdDetail.setCellValue('GRADE', row.GRADE, this.itemSelect.PK, 'PK');
      this.$refs.grdDetail.setCellValue('WH_PK', this.itemSelect.WH_PK, this.itemSelect.PK, 'PK');
      this.$refs.grdDetail.setCellValue('WH_NAME', this.itemSelect.WH_NAME, this.itemSelect.PK, 'PK');
      this.$refs.grdDetail.setCellValue('GD_TYPE', '', this.itemSelect.PK, 'PK');
      this.$refs.grdDetail.setCellValue('LOC_NAME', row.LOC_NAME, this.itemSelect.PK, 'PK');
      this.$refs.grdDetail.setCellValue('TLG_IN_WHLOC_PK', row.TLG_IN_WHLOC_PK, this.itemSelect.PK, 'PK');
      this.$refs.grdDetail.setCellValue('ATT_3', row.ATT_1, this.itemSelect.PK, 'PK');
      this.$refs.grdDetail.setCellValue('DESCRIPTION', row.DESCRIPTION, this.itemSelect.PK, 'PK');
      this.$refs.grdDetail.setCellValue('TLG_GD_OUTGO_M_PK', this.modelMaster.PK, this.itemSelect.PK, 'PK');
      this.$refs.grdDetail.setCellValue('TLG_SA_SALEORDER_D_PK', row.TLG_SA_SALEORDER_D_PK, this.itemSelect.PK, 'PK');
      this.$refs.grdDetail.setCellValue('TLG_GD_REQ_D_PK', row.PK, this.itemSelect.PK, 'PK');
      this.$refs.grdDetail.setCellValue('TABLE_NAME', 'TLG_GD_REQ_D', this.itemSelect.PK, 'PK');
      this.$refs.grdDetail.setCellValue('TABLE_PK', row.PK, this.itemSelect.PK, 'PK');
      this.$refs.grdDetail.setCellValue('PARENT_PK', '', this.itemSelect.PK, 'PK');
      this.$refs.grdDetail.setCellValue('ACC_GET_YN', 'N', this.itemSelect.PK, 'PK');
      this.$refs.grdDetail.setCellValue('TLG_CO_SALEORDER_D_PK', row.TLG_CO_SALEORDER_D_PK, this.itemSelect.PK, 'PK');
      this.$refs.grdDetail.setCellValue('TLG_SA_SALEORDER_M_PK', row.TLG_SA_SALEORDER_M_PK, this.itemSelect.PK, 'PK');
      this.$refs.grdDetail.setCellValue('REQ_SLIP', this.itemSelect.REQ_SLIP, this.itemSelect.PK, 'PK');
      this.$refs.grdDetail.setCellValue('REF_QTY', row.REF_QTY, this.itemSelect.PK, 'PK');
      this.$refs.grdDetail.setCellValue('REF_QTY_2', row.REF_QTY_2, this.itemSelect.PK, 'PK');
      this.$refs.grdDetail.setCellValue('REF_UOM', row.REF_UOM, this.itemSelect.PK, 'PK');
      this.$refs.grdDetail.setCellValue('REF_UOM_2', row.REF_UOM_2, this.itemSelect.PK, 'PK');
      this.$refs.grdDetail.setCellValue('EXPIRE_DATE_1', row.EXPIRE_DATE_1, this.itemSelect.PK, 'PK');
      this.$refs.grdDetail.setCellValue('FREE_QTY_01', row.FREE_QTY_01, this.itemSelect.PK, 'PK');
      this.$refs.grdDetail.setCellValue('FREE_QTY_02', row.FREE_QTY_02, this.itemSelect.PK, 'PK');
      this.$refs.grdDetail.setCellValue('FREE_QTY_03', row.FREE_QTY_03, this.itemSelect.PK, 'PK');
      this.$refs.grdDetail.setCellValue('FREE_CODE_01', row.FREE_CODE_01, this.itemSelect.PK, 'PK');
      this.$refs.grdDetail.setCellValue('FREE_CODE_02', row.FREE_CODE_02, this.itemSelect.PK, 'PK');
      this.$refs.grdDetail.setCellValue('FREE_CODE_03', row.FREE_CODE_03, this.itemSelect.PK, 'PK');
      this.$refs.grdDetail.setCellValue('FREE_DATE_01', row.FREE_DATE_01, this.itemSelect.PK, 'PK');
      this.$refs.grdDetail.setCellValue('FREE_DATE_02', row.FREE_DATE_02, this.itemSelect.PK, 'PK');
      this.$refs.grdDetail.setCellValue('FREE_DATE_03', row.FREE_DATE_03, this.itemSelect.PK, 'PK');
    },
    callBackDeliPlan(objData) {
      if (objData) {
        if (objData.length == 0) {
          this.showNotification('warning', this.$t('no_item_select', '', 3000));
        } else {
          this.updateRowFirst(objData[0]);
          if (objData.length >= 2) {
            for (let i = 1; i < objData.length; i++) {
              let insertRow = {};
              insertRow.PK = this._uniqueID();
              insertRow.SEQ = this.$refs.grdDetail.getDataSource().length + 1;
              insertRow.REF_NO = objData[i].REF_NO;
              insertRow.REQ_ITEM_PK = objData[i].REQ_ITEM_PK;
              insertRow.REQ_ITEM_CODE = objData[i].REQ_ITEM_CODE;
              insertRow.REQ_ITEM_NAME = objData[i].REQ_ITEM_NAME;
              insertRow.ITEM_BC = objData[i].ITEM_BC;
              insertRow.OUT_ITEM_PK = objData[i].REQ_ITEM_PK;
              insertRow.OUT_ITEM_CODE = objData[i].REQ_ITEM_CODE;
              insertRow.OUT_ITEM_NAME = objData[i].REQ_ITEM_NAME;
              insertRow.CUST_ITEM_CODE = objData[i].CUST_ITEM_CODE;
              insertRow.CUST_ITEM_NAME = objData[i].CUST_ITEM_NAME;
              insertRow.REQ_QTY = objData[i].REQ_QTY;
              insertRow.REQ_UOM = objData[i].REQ_UOM;
              insertRow.OUT_QTY = objData[i].REQ_QTY;
              insertRow.OUT_UOM = objData[i].REQ_UOM;
              insertRow.PALLET_QTY = objData[i].PACKING_QTY;
              insertRow.UNIT_PRICE = objData[i].UNIT_PRICE;
              insertRow.ITEM_AMOUNT = objData[i].ITEM_AMOUNT;
              insertRow.VAT_RATE = objData[i].VAT_RATE;
              insertRow.VAT_AMOUNT = objData[i].VAT_AMOUNT;
              insertRow.TOTAL_AMOUNT = objData[i].TOTAL_AMOUNT;
              insertRow.LOT_NO = objData[i].LOT_NO;
              insertRow.PO_NO = this.itemSelect.PO_NO;
              insertRow.GRADE = objData[i].GRADE;
              insertRow.WH_PK = this.itemSelect.WH_PK;
              insertRow.WH_NAME = this.itemSelect.WH_NAME;
              insertRow.GD_TYPE = '';
              insertRow.LOC_NAME = objData[i].LOC_NAME;
              insertRow.TLG_IN_WHLOC_PK = objData[i].TLG_IN_WHLOC_PK;
              insertRow.ATT_3 = objData[i].ATT_1;
              insertRow.DESCRIPTION = objData[i].DESCRIPTION;
              insertRow.TLG_GD_OUTGO_M_PK = this.modelMaster.PK;
              insertRow.TLG_SA_SALEORDER_D_PK = objData[i].TLG_SA_SALEORDER_D_PK;
              insertRow.TLG_GD_REQ_D_PK = objData[i].PK;
              insertRow.TABLE_NAME = 'TLG_GD_REQ_D';
              insertRow.TABLE_PK = objData[i].PK;
              insertRow.PARENT_PK = '';
              insertRow.ACC_GET_YN = 'N';
              insertRow.TLG_CO_SALEORDER_D_PK = objData[i].TLG_CO_SALEORDER_D_PK;
              insertRow.TLG_SA_SALEORDER_M_PK = objData[i].TLG_SA_SALEORDER_M_PK;
              insertRow.REQ_SLIP = this.itemSelect.REQ_SLIP;
              insertRow.REF_QTY = objData[i].REF_QTY;
              insertRow.REF_QTY_2 = objData[i].REF_QTY_2;
              insertRow.REF_UOM = objData[i].REF_UOM;
              insertRow.REF_UOM_2 = objData[i].REF_UOM_2;
              insertRow.EXPIRE_DATE_1 = objData[i].EXPIRE_DATE_1;
              insertRow.FREE_QTY_01 = objData[i].FREE_QTY_01;
              insertRow.FREE_QTY_02 = objData[i].FREE_QTY_02;
              insertRow.FREE_QTY_03 = objData[i].FREE_QTY_03;
              insertRow.FREE_CODE_01 = objData[i].FREE_CODE_01;
              insertRow.FREE_CODE_02 = objData[i].FREE_CODE_02;
              insertRow.FREE_CODE_03 = objData[i].FREE_CODE_03;
              insertRow.FREE_DATE_01 = objData[i].FREE_DATE_01;
              insertRow.FREE_DATE_02 = objData[i].FREE_DATE_02;
              insertRow.FREE_DATE_03 = objData[i].FREE_DATE_03;
              insertRow.PACKING_QTY = '';
              insertRow.BOX_QTY = '';
              insertRow.REF_INVOICE = '';
              this.$refs.grdDetail.addRowStruct(insertRow);
            }
          }
        }
      }
    },

    //==================================================================================
    async onBodyInit() {
      this.modelSearch.P_EMP_PK = this.user.THR_ABEMP_PK;
      this.modelSearch.P_USER_PK = this.user.PK;
      this.dataList.lstCompany = await this._getCompanyByUser2(this.user.PK);
      this.dataList.lstOutType = await this._getCommonCodePar('LGIN0204', 'O100');

      this.dataList.lstReport = await this._getCommonCodePar('LGCM0050', 'dscd00070');
      let lstCommoncode = await this._getCommonCode2(['LGCM0100', 'IEBS0021', 'LGIN0310', 'LGSA7020', 'LGCM0120', 'LG2010020'], this.user.TCO_COMPANY_PK);
      this.dataList.lstCurrency = lstCommoncode[0];
      this.dataList.lstDestPort = lstCommoncode[1];
      this.dataList.lstGDType = lstCommoncode[3];

      this.dataList.lstStatus = lstCommoncode[5];
      this.dataList.lstStatus.unshift({ CODE: '', NAME: '' });

      this.dataList.lstGDType.unshift({
        CODE: '',
        NAME: ''
      });

      this.dataList.lstPayTerm = lstCommoncode[4];

      let result = lstCommoncode[2];
      this.FROM_HOUR = result[0].VAL1;
      this.TO_HOUR = result[0].VAL2;
      this.DAYS = result[0].NUM1;

      this.dataList.lstFactory = await this._getFactoryByUsery(this.user.PK, this.user.PR_LEVEL);
      this.dataList.lstFactory.unshift({
        PK: '',
        TEXT: ''
      });

      this.onAddNew_Master();
      this.checkSite();
    },

    async getWH() {
      this.dataList.lstWH_Search = await this._getWarehouseLG('', this.user.PK, 'FROM_WH', '', this.modelSearch.P_COMPANY_PK);
      // this.dataList.lstWH_Search.unshift({
      //   PK: "",
      //   TEXT: this.$t('all')
      // });
      this.dataList.lstWH_Entry = [...this.dataList.lstWH_Search];
      if (this.typeSite == 'OTM') {
        this.modelMaster.OUT_WH_PK = 142;
      }
    },

    onSetWH() {
      let wh_name = '';
      const whIdx = this.dataList.lstWH_Entry.findIndex(x => x.PK === this.modelMaster.OUT_WH_PK);
      if (whIdx > -1) {
        wh_name = this.dataList.lstWH_Entry[whIdx].TEXT;
      }
      let arr = this.$refs.grdDetail.getDataSource();
      arr.forEach(ee1 => {
        this.$refs.grdDetail.setCellValue('WH_PK', this.modelMaster.OUT_WH_PK, ee1.PK, 'PK');
        this.$refs.grdDetail.setCellValue('WH_NAME', wh_name, ee1.PK, 'PK');
      });
      // location, cái này k rõ nên kệ nó, hồi sai thì sửa sau
      // this.$refs.grdDetail.setCellValue('TLG_IN_WHLOC_PK', '');
      // this.$refs.grdDetail.setCellValue('LOC_NAME', '');
    },

    onChangeField(obj) {
      switch (obj) {
        case 'lstCompanySearch':
          this.getWH();
          this.onAddNew_Master();
          break;
      }
    },

    async onAfterLoad(data) {
      this.modelOthers.ITEMS = data.length;
      if (this.chk1) {
        // chỗ này dùng để update lại cột factory, bill to từ gd req vào gd entry
        const dso1 = { type: 'process', updpro: 'LG_PRO_SWGD010_V2_1', para: [this.modelMaster.PK] };
        const res1 = await this._dsoCall(dso1, 'process', false);
        this.chk1 = false;
      }
    },

    //==================================================================================

    GetDateTimeCurrent() {
      let date = new Date();
      let hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
      let minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
      let HoursMinutes = hours + ':' + minutes;
      return HoursMinutes;
    },
    OnChangeInputDate() {
      this.CalculateVoucherDate();
    },
    CalculateVoucherDate() {
      if (this.isPopYN) {
        return;
      }

      let numvalue1 = Number(this.DAYS);
      let cha_value1 = this.FROM_HOUR.replace(':', '');
      let cha_value2 = this.TO_HOUR.replace(':', '');
      let date_day = new Date(this.modelMaster.INPUT_DATE.substr(0, 4), this.modelMaster.INPUT_DATE.substr(4, 2) - 1, this.modelMaster.INPUT_DATE.substr(6, 2));
      let date_hours = this.modelMaster.INPUT_HOUR.replace(':', '');

      if (date_hours >= cha_value1 && date_hours <= cha_value2) {
        date_day.setDate(date_day.getDate() + numvalue1);
        this.modelMaster.OUT_DATE = moment(date_day).format('YYYYMMDD');
      } else {
        this.modelMaster.OUT_DATE = this.modelMaster.INPUT_DATE;
      }
    },

    //==================================================================================
    onShowHideCols() {
      this.isShowHideCols = !this.isShowHideCols;
      this.loadHeaderDetail();
    },
    //==================================================================================
    onShowLeft() {
      this.isShowLeft = !this.isShowLeft;
    },

    //==================================================================================
    onCellDbClick(_event) {
      switch (this.typeSite) {
        case 'ILSHIN':
          // nothing
          break;

        default:
          this.cellDblClickgrdDetail = _event;
          switch (_event.column.dataField) {
            case 'LOT_NO':
              this.onAddDeliPlan(_event.data);
              break;
            case 'ITEM_BC':
              if (!this._hasValue(_event.data.PK)) {
                this.$refs.alertDialog.showAlert('warning', 'Error', 'please_save_detail_first');
                return;
              }
              this.$refs.refLGMapBarcodeDialog01.modelSearch.P_TABLE_MASTER_PK = this.modelMaster.PK;
              this.$refs.refLGMapBarcodeDialog01.modelSearch.P_TABLE_DETAIL_PK = _event.data.PK;
              this.$refs.refLGMapBarcodeDialog01.modelSearch.P_TABLE_MASTER_NM = 'TLG_GD_OUTGO_M';
              this.$refs.refLGMapBarcodeDialog01.modelSearch.P_TABLE_DETAIL_NM = 'TLG_GD_OUTGO_D';
              this.$refs.refLGMapBarcodeDialog01.modelSearch.P_ITEM_PK = _event.data.REQ_ITEM_PK;
              this.$refs.refLGMapBarcodeDialog01.modelSearch.P_WH_PK = this._hasValue(_event.data.WH_PK) ? _event.data.WH_PK : this.modelMaster.OUT_WH_PK;
              this.$refs.refLGMapBarcodeDialog01.modelSearch.P_LOC_PK = _event.data.TLG_IN_WHLOC_PK;
              this.$refs.refLGMapBarcodeDialog01.modelSearch.P_LOT_NO = _event.data.LOT_NO;
              this.$refs.refLGMapBarcodeDialog01.modelSearch.P_PO_NO = _event.data.PO_NO;
              this.$refs.refLGMapBarcodeDialog01.modelSearch.P_TYPE = 'OUT';
              this.$refs.refLGMapBarcodeDialog01.dialogIsShow = true;
              break;
            case 'LOC_NAME':
              this.$refs.refWHLoc.dialogIsShow = true;
              this.$refs.refWHLoc.gw_WarehousePK.value = this._hasValue(_event.data.WH_PK) ? _event.data.WH_PK : this.modelMaster.OUT_WH_PK;
              break;
          }
          break;
      }
    },

    callBackLocation(item) {
      if (item) {
        this.$refs.grdDetail.setCellValue('TLG_IN_WHLOC_PK', item.TLG_IN_WHLOC_PK, this.cellDblClickgrdDetail.data.PK);
        this.$refs.grdDetail.setCellValue('LOC_NAME', item.LOC_NAME, this.cellDblClickgrdDetail.data.PK);
      }
    },

    callBackMapBarcode(obj) {},

    //==================================================================================

    onSaveValidate() {
      return true;
    },
    //========================================================
    onCellClickGrdSearch(_event) {
      this.modelMaster.PK = _event.data.PK;
      this.onUpdMaster('select');
    },

    onClickLabel(obj) {
      if (this.isPopYN) {
        return;
      }
      this.objClick = obj;
      switch (obj) {
        case 'DELI_TO':
          this.$refs.delitoDialog.dialogIsShow = true;
          break;
        case 'DELI_LOC':
          this.$refs.delitoLocDialog.dialogIsShow = true;
          break;
        case 'DEST_PORT':
          this.$refs.refLogisticCode.dialogIsShow = true;
          this.$refs.refLogisticCode.editable = true;
          this.$refs.refLogisticCode.parentcode = 'IEBS0021';
          break;
        case 'END_USER':
          this.$refs.delitoDialog.dialogIsShow = true;
          break;
        case 'GD_TYPE':
          this.$refs.refLogisticCode.dialogIsShow = true;
          this.$refs.refLogisticCode.editable = true;
          this.$refs.refLogisticCode.parentcode = 'LGSA7020';
          break;
      }
    },

    mappingPartner(item) {
      if (item) {
        switch (this.objClick) {
          case 'DELI_TO':
            this.modelMaster.CUST_PK = item.PK;
            this.modelMaster.PARTNER_NAME = item.PARTNER_ID + ' - ' + item.PARTNER_NAME;
            this.loadDueDate();
            break;
          case 'END_USER':
            this.modelMaster.END_USER_PK = item.PK;
            this.modelMaster.END_USER_NAME = item.PARTNER_ID + ' - ' + item.PARTNER_NAME;
            break;
        }
      }
    },
    mappingDeliToLoc(item) {
      if (item) {
        this.modelMaster.DELI_LOC_PK = item[0].DELI_LOC_PK;
        this.modelMaster.LOC_NM = item[0].LOC_NM;
        this.modelMaster.ADDRESS = item[0].ADDRESS;
      }
    },

    callBackLogisticCode(obj) {},

    onClickButton(obj) {
      if (obj != 'btnAgreeCF') {
        this.objClick = obj;
      }
      switch (obj) {
        case 'btnSearch':
          this.$refs.grdSearch.loadData();
          break;
        case 'btnAddNewMaster':
          this.onAddNew_Master();
          break;
        case 'btnSaveMaster':
          if (this.onSaveValidate()) {
            let action = '';
            if (!this._hasValue(this.modelMaster.PK)) {
              action = 'insert';
            } else {
              action = 'update';
            }
            this.onUpdMaster(action);
          }
          break;
        case 'btnDelMaster':
          this.$refs.confirmDialog.showConfirm(this.$t('do_you_want_delete'), 'warning');
          break;

        case 'btnSubmit':
          this.submitType = 'SUBMIT';
          this.$refs.confirmDialog.showConfirm(this.$t('do_you_want_submit'));
          break;
        case 'btnCancel':
          this.submitType = 'CANCEL';
          this.$refs.confirmDialog.showConfirm(this.$t('do_you_want_cancel'), 'warning');
          break;
        case 'btnAddFreeItem':
          this.onAddFreeItem();
          break;
        case 'btnAddGDRequest':
          this.onAddGDReq();
          break;
        case 'btnAddResult':
          this.objSend1 = {
            TCO_BUSPARTNER_PK: this.modelMaster.CUST_PK,
            PARTNER_NAME: this.modelMaster.PARTNER_NAME
          };
          this.$refs.refGetItemFromResult.dialogIsShow = true;
          break;
        case 'btnScan':
          this.objSend1 = {
            TCO_BUSPARTNER_PK: this.modelMaster.CUST_PK,
            PARTNER_NAME: this.modelMaster.PARTNER_NAME
          };
          this.$refs.refScan.dialogIsShow = true;
          break;
        case 'btnSOrder':
          this.objSend1 = {
            TCO_BUSPARTNER_PK: this.modelMaster.CUST_PK,
            PARTNER_NAME: this.modelMaster.PARTNER_NAME
          };
          this.$refs.refGetItemFromSaleOrder.dialogIsShow = true;
          break;
        case 'btnStock':
          this.$refs.refStock.dialogIsShow = true;
          break;
        case 'btnDeleteDetail':
          this.objClick = 'btnDeleteDetail';
          this.$refs.confirmDialog.showConfirm(this.$t('do_you_want_delete'), 'warning');
          break;
        case 'btnUnDeleteDetail':
          this.$refs.grdDetail.unDeleteRows();
          break;
        case 'btnPrint':
          this.onReport();
          break;

        case 'btnAttach':
          if (!this._hasValue(this.modelMaster.PK)) {
            return;
          }
          this.$refs.refFilesUploadDialog.dataGrid1 = [];
          this.$refs.refFilesUploadDialog.P_MASTER_PK = this.modelMaster.PK;
          this.$refs.refFilesUploadDialog.isApprove = this.modelMaster.STATUS_CODE == 0;
          this.$refs.refFilesUploadDialog.dialogIsShow = true;
          break;

        case 'btnAgreeCF':
          switch (this.objClick) {
            case 'btnSaveMaster':
              let action = '';
              if (!this._hasValue(this.modelMaster.PK)) {
                action = 'insert';
              } else {
                action = 'update';
              }
              this.onUpdMaster(action);
              break;
            case 'btnDelMaster':
              this.onUpdMaster('delete');
              break;
            case 'btnDeleteDetail':
              this.$refs.grdDetail.deleteRows();
              break;
            case 'btnSubmit':
              this.onProcess('SUBMIT');
            // break;
            // case "btnCancel":
            //   this.onProcess("CANCEL");
            // break;
          }
      }
    },
    /*NOTE: */
    async onSubmit(action) {
      const dso = {
        type: 'process',
        updpro: 'LG_PRO_5010022',
        para: [this.modelMaster.PK]
      };
      let row = await this._dsoCall(dso, action, false);
      if (row) {
        this.showNotification('success', 'Information', this.$t('success'));
        this.onUpdMaster('select');
      }
    },

    onProcess() {
      if (this.objClick === 'btnSubmit') {
        this.onSubmit('SUBMIT');
      }
    },

    //==============
    onAddNew_Master() {
      this.modelMaster.PK = '';
      this.modelMaster.SLIP_NO = '***New Voucher***';
      this.modelMaster.OUT_DATE = this._CurrentDate('');
      this.modelMaster.INPUT_DATE = this._CurrentDate('');
      this.modelMaster.INPUT_HOUR = this.GetDateTimeCurrent();
      this.modelMaster.STATUS = 'NEW';
      this.modelMaster.REF_NO = '';
      this.modelMaster.CHARGER_PK = this.user.THR_ABEMP_PK;
      this.modelMaster.CHARGER_NM = this.user.USER_NAME;
      this.modelMaster.END_USER_PK = '';
      this.modelMaster.END_USER_NAME = '';
      this.modelMaster.CUST_PK = '';
      this.modelMaster.PARTNER_NAME = '';
      this.modelMaster.DELI_LOC_PK = '';
      this.modelMaster.LOC_NM = '';
      this.modelMaster.ITEM_AMOUNT = '0';
      this.modelMaster.TAX_AMOUNT = '0';
      this.modelMaster.TOTAL_AMOUNT = '0';
      // this.modelMaster.TR_CCY = "";
      // this.modelMaster.EX_RATE = "";
      this.modelMaster.DESCRIPTION = '';
      this.modelMaster.DESC_AR = '';
      this.modelMaster.DESC_AR2 = '';
      // this.modelMaster.SLIP_TYPE = "";
      this.modelMaster.BOOKING_NO = '';
      this.modelMaster.CONT_NO = '';
      this.modelMaster.SEAL_NO = '';
      this.modelMaster.CLOSING_TIME = '';
      this.modelMaster.VESSEL_NAME = '';
      // this.modelMaster.DEST_PORT = "";
      this.modelMaster.ETD = this._CurrentDate('');
      this.modelMaster.ETA = this._CurrentDate('');
      this.modelMaster.VOUCHERNO = '';
      this.modelMaster.TCO_COMPANY_PK = this.modelSearch.P_COMPANY_PK;
      this.modelMaster.TOTAL_OUT_QTY = '0';
      this.modelMaster.STATUS_CODE = '0';
      this.modelMaster.PAY_TERM = '';
      this.modelMaster.DUE_DATE = '';
      this.modelMaster.DRIVER_NAME = '';
      this.modelMaster.CONTACT_NO = '';

      this.OnChangeInputDate();

      try {
        this.$refs.grdDetail.Clear();
      } catch {}
    },

    async onUpdMaster(p_action) {
      let v_masterPK = this.modelMaster.PK;
      this.modelMaster._rowstatus = p_action.toString().toUpperCase();
      this.modelMaster.GRP_ITEM_YN = this.modelOthers.CHK_GRP_ITEM;
      const dso = {
        type: 'control',
        selpro: 'LG_SEL_SWGD010_1_NOCACHE',
        updpro: 'LG_UPD_5010022_1',
        para: [this.modelMaster.PK],
        elname: ['_rowstatus', 'PK', 'SLIP_NO', 'OUT_DATE', 'INPUT_DATE', 'INPUT_HOUR', 'STATUS', 'REF_NO', 'CHARGER_PK', 'CHARGER_NM', 'END_USER_PK', 'END_USER_NAME', 'CUST_PK', 'PARTNER_NAME', 'DELI_LOC_PK', 'LOC_NM', 'ITEM_AMOUNT', 'TAX_AMOUNT', 'TOTAL_AMOUNT', 'TR_CCY', 'EX_RATE', 'DESCRIPTION', 'DESC_AR', 'DESC_AR2', 'SLIP_TYPE', 'OUT_WH_PK', 'BOOKING_NO', 'CONT_NO', 'SEAL_NO', 'CLOSING_TIME', 'VESSEL_NAME', 'DEST_PORT', 'ETD', 'ETA', 'VOUCHERNO', 'TCO_COMPANY_PK', 'ADDRESS', 'PAY_TERM', 'DUE_DATE', 'DRIVER_NAME', 'CONTACT_NO', 'GRP_ITEM_YN'],
        data: this.modelMaster
      };
      let rows = await this._dsoCall(dso, p_action, false);
      if (rows) {
        if (p_action == 'delete') {
          this.onAddNew_Master();
          let index_grid_left = this.$refs.grdSearch
            .getDataSource()
            .map(function (e) {
              return e.PK;
            })
            .indexOf(v_masterPK);
          if (index_grid_left > -1) {
            this.$refs.grdSearch.getDataSource().splice(index_grid_left, 1);
          }
        } else {
          this.chk2 = true;
          this.modelMaster = {
            ...rows
          };
          this.modelOthers.CHK_GRP_ITEM = this.modelMaster.GRP_ITEM_YN;
          if (p_action == 'update' || p_action == 'insert') {
            let newPK = this.modelMaster.PK;
            this.$refs.grdDetail.setValueColumnIfNull('TLG_GD_OUTGO_M_PK', newPK);
            this.$refs.grdDetail.saveData();
            setTimeout(() => {
              this.reLoadGroupSum();
            }, 700);
          } else if (p_action == 'select') {
            this.$refs.grdDetail.loadData();
            if (this.typeSite != 'ILSHIN') this.$refs.grdSum.loadData();
          }
        }
      }
    },
    async loadDueDate() {
      let _lstPayTerm = this.dataList.lstPayTerm.filter(x => x.CODE == this.modelMaster.PAY_TERM);
      let day = 0;
      if (_lstPayTerm.length >= 0) {
        day = _lstPayTerm[0].NUM1;
      }
      if (this.typeSite == 'KPX') {
        const dso1 = {
          type: 'list',
          selpro: 'LG_SEL_2000010_2_NOCACHE',
          para: [this.modelMaster.CUST_PK, this.modelMaster.PAY_TERM]
        };
        const res1 = await this._dsoCall(dso1, 'select', false);
        if (res1) {
          if (res1.length > 0) this.modelMaster.DUE_DATE = this._plusdate(this.modelMaster.OUT_DATE, '', 'd', res1[0].VALUE_DAYS);
          else this.modelMaster.DUE_DATE = this._plusdate(this.modelMaster.OUT_DATE, '', 'd', day);
        } else this.modelMaster.DUE_DATE = this._plusdate(this.modelMaster.OUT_DATE, '', 'd', day);
      } else {
        this.modelMaster.DUE_DATE = this._plusdate(this.modelMaster.OUT_DATE, '', 'd', day);
      }
    },

    onAddGDReq() {
      this.dialogIsShow = true;
    },

    //============================================================
    callBackGDReq(objData) {
      let L_WH_PK = this.modelMaster.OUT_WH_PK;
      if (objData) {
        objData.forEach(item => {
          let insertRow = {};
          insertRow.PK = this._uniqueID();
          insertRow.SEQ = this.$refs.grdDetail.getDataSource().length + 1;
          insertRow.REF_NO = item.REF_NO;
          insertRow.REQ_ITEM_PK = item.REQ_ITEM_PK;
          insertRow.REQ_ITEM_CODE = item.REQ_ITEM_CODE;
          insertRow.REQ_ITEM_NAME = item.REQ_ITEM_NAME;
          insertRow.ITEM_BC = item.ITEM_BC;
          insertRow.OUT_ITEM_PK = item.REQ_ITEM_PK;
          insertRow.OUT_ITEM_CODE = item.REQ_ITEM_CODE;
          insertRow.OUT_ITEM_NAME = item.REQ_ITEM_NAME;
          insertRow.CUST_ITEM_CODE = item.CUST_ITEM_CODE;
          insertRow.CUST_ITEM_NAME = item.CUST_ITEM_NAME;
          insertRow.REQ_QTY = item.REQ_QTY;
          insertRow.REQ_UOM = item.REQ_UOM;
          insertRow.OUT_QTY = item.REQ_QTY;
          insertRow.OUT_UOM = item.REQ_UOM;
          insertRow.PALLET_QTY = item.PACKING_QTY;
          insertRow.UNIT_PRICE = item.UNIT_PRICE;
          insertRow.ITEM_AMOUNT = item.ITEM_AMOUNT;
          insertRow.VAT_RATE = item.VAT_RATE;
          insertRow.VAT_AMOUNT = item.VAT_AMOUNT;
          insertRow.TOTAL_AMOUNT = item.TOTAL_AMOUNT;
          insertRow.LOT_NO = item.LOT_NO;
          insertRow.PO_NO = item.PO_NO;
          insertRow.GRADE = item.GRADE;
          insertRow.WH_PK = item.WH_PK;
          insertRow.WH_NAME = item.WH_NAME;
          insertRow.GD_TYPE = '';
          insertRow.LOC_NAME = item.LOC_NAME;
          insertRow.TLG_IN_WHLOC_PK = item.TLG_IN_WHLOC_PK;
          insertRow.ATT_3 = item.ATT_1;
          insertRow.DESCRIPTION = item.DESCRIPTION;
          insertRow.TLG_GD_OUTGO_M_PK = this.modelMaster.PK;
          insertRow.TLG_SA_SALEORDER_D_PK = item.TLG_SA_SALEORDER_D_PK;
          insertRow.TLG_GD_REQ_D_PK = item.PK;
          insertRow.TABLE_NAME = 'TLG_GD_REQ_D';
          insertRow.TABLE_PK = item.PK;
          insertRow.PARENT_PK = '';
          insertRow.ACC_GET_YN = 'N';
          insertRow.TLG_CO_SALEORDER_D_PK = item.TLG_CO_SALEORDER_D_PK;
          insertRow.TLG_SA_SALEORDER_M_PK = item.TLG_SA_SALEORDER_M_PK;
          insertRow.REQ_SLIP = '';
          insertRow.REF_QTY = item.REF_QTY;
          insertRow.REF_QTY_2 = item.REF_QTY_2;
          insertRow.REF_UOM = item.REF_UOM;
          insertRow.REF_UOM_2 = item.REF_UOM_2;
          insertRow.EXPIRE_DATE_1 = item.EXPIRE_DATE_1;
          insertRow.FREE_QTY_01 = item.FREE_QTY_01;
          insertRow.FREE_QTY_02 = item.FREE_QTY_02;
          insertRow.FREE_QTY_03 = item.FREE_QTY_03;
          insertRow.FREE_CODE_01 = item.FREE_CODE_01;
          insertRow.FREE_CODE_02 = item.FREE_CODE_02;
          insertRow.FREE_CODE_03 = item.FREE_CODE_03;
          insertRow.FREE_DATE_01 = item.FREE_DATE_01;
          insertRow.FREE_DATE_02 = item.FREE_DATE_02;
          insertRow.FREE_DATE_03 = item.FREE_DATE_03;
          insertRow.PACKING_QTY = '';
          insertRow.BOX_QTY = '';
          insertRow.REF_INVOICE = '';
          this.$refs.grdDetail.addRowStruct(insertRow);

          L_WH_PK = item.WH_PK;
        });
        //if (this.typeSite == "OTM") {
        if (this._hasValue(this.modelMaster.REF_NO)) {
          this.modelMaster.REF_NO = this.modelMaster.REF_NO + ',' + this.$refs.refGDRequest.modelMaster.SLIP_NO;
        } else {
          this.modelMaster.REF_NO = this.$refs.refGDRequest.modelMaster.SLIP_NO;
        }
        // } else {
        //   this.modelMaster.REF_NO = ""
        // }
        this.modelMaster.SLIP_TYPE = this.$refs.refGDRequest.modelMaster.OUT_TYPE;
        this.modelMaster.CUST_PK = this.$refs.refGDRequest.modelMaster.CUST_PK;
        this.modelMaster.PARTNER_NAME = this.$refs.refGDRequest.modelMaster.PARTNER_NAME;
        this.modelMaster.DELI_LOC_PK = this.$refs.refGDRequest.modelMaster.DELI_LOC_PK;
        this.modelMaster.LOC_NM = this.$refs.refGDRequest.modelMaster.LOC_NM;
        this.modelMaster.TR_CCY = this.$refs.refGDRequest.modelMaster.TR_CCY;
        this.modelMaster.EX_RATE = this.$refs.refGDRequest.modelMaster.EX_RATE;
        this.modelMaster.BOOKING_NO = this.$refs.refGDRequest.modelMaster.BOOKING_NO;
        this.modelMaster.CONT_NO = this.$refs.refGDRequest.modelMaster.CONT_NO;
        this.modelMaster.SEAL_NO = this.$refs.refGDRequest.modelMaster.SEAL_NO;
        this.modelMaster.CLOSING_TIME = this.$refs.refGDRequest.modelMaster.CLOSING_TIME;
        this.modelMaster.VESSEL_NAME = this.$refs.refGDRequest.modelMaster.VESSEL_NAME;
        this.modelMaster.DEST_PORT = this.$refs.refGDRequest.modelMaster.DEST_PORT;
        this.modelMaster.ETD = this.$refs.refGDRequest.modelMaster.ETD;
        this.modelMaster.ETA = this.$refs.refGDRequest.modelMaster.ETA;

        this.modelMaster.DRIVER_NAME = this.$refs.refGDRequest.modelMaster.DRIVER_NAME;
        this.modelMaster.CONTACT_NO = this.$refs.refGDRequest.modelMaster.CONTACT_NO;

        this.modelMaster.OUT_WH_PK = L_WH_PK;
      }
      this.dialogIsShow = false;
    },

    onCheckUpdated(e, colName) {
      if (!this.isPopYN) {
        this.InputProcess(e.data, colName);
      }
    },
    InputProcess_old(item, col) {
      var dAmount = 0,
        dTotalAmount = 0,
        dQuantiy = 0;
      if (col == 'OUT_QTY' || col == 'UNIT_PRICE') {
        dQuantiy = Number(item.OUT_QTY);
        if (dQuantiy < 0) {
          this.$refs.alertDialog.showAlert('error', 'Error', this.$t('value_must_greater_than_zero'));
          item.OUT_QTY = '';
        }
        dAmount = Number(item.OUT_QTY) * Number(item.UNIT_PRICE);

        item.ITEM_AMOUNT = dAmount;
      }
    },
    InputProcess(item, col) {
      //----------------------Calculate Amount -----
      if (this.modelOthers.CHK_AUTO == 'Y') {
        if (col == 'OUT_QTY' || col == 'UNIT_PRICE' || col == 'VAT_RATE') {
          let dQuantiy = Number(item.OUT_QTY);
          let dPrice = Number(item.UNIT_PRICE);
          let dAmount = dQuantiy * dPrice;
          let dVATAmount = (dAmount * Number(item.VAT_RATE)) / 100;
          let dTotalAmount = dAmount + dVATAmount;
          item.ITEM_AMOUNT = dAmount;
          item.VAT_AMOUNT = dVATAmount;
          item.TOTAL_AMOUNT = dTotalAmount;
        } else if (col == 'ITEM_AMOUNT') {
          let dVATAmount = (Number(item.ITEM_AMOUNT) * Number(item.VAT_RATE)) / 100;
          let dTotalAmount = Number(item.ITEM_AMOUNT) + dVATAmount;
          item.VAT_AMOUNT = dVATAmount;
          item.TOTAL_AMOUNT = dTotalAmount;
        } else if (col == 'VAT_AMOUNT') {
          let dTotalAmount = Number(item.ITEM_AMOUNT) + Number(item.VAT_AMOUNT);
          item.TOTAL_AMOUNT = dTotalAmount;
        }

        this.TotalAmount();
      }
    },
    //====================================================
    TotalAmount() {
      //---------CALCULATE AMOUNT----------------
      let sumItemAmount = 0;
      let sumVatAmount = 0;
      let sumAmount = 0;
      let sumOutQty = 0;

      for (let i = 0; i < this.$refs.grdDetail.getDataSource().length; i++) {
        sumItemAmount = sumItemAmount + Number(this.$refs.grdDetail.getDataSource()[i].ITEM_AMOUNT);
        sumVatAmount = sumVatAmount + Number(this.$refs.grdDetail.getDataSource()[i].VAT_AMOUNT);
        sumAmount = sumAmount + Number(this.$refs.grdDetail.getDataSource()[i].TOTAL_AMOUNT);
        sumOutQty = sumOutQty + Number(this.$refs.grdDetail.getDataSource()[i].OUT_QTY);
      }

      this.modelMaster.ITEM_AMOUNT = sumItemAmount;
      this.modelMaster.TAX_AMOUNT = sumVatAmount;
      this.modelMaster.TOTAL_AMOUNT = sumAmount;
      this.modelMaster.TOTAL_OUT_QTY = sumOutQty;
    },

    async printKPX() {
      const dso = {
        type: 'list',
        selpro: 'LG_RPT_BASIC_INFO_3',
        para: [this.user.USER_ID, this.user.TCO_COMPANY_PK]
      };
      const result = await this._dsoCall(dso, 'select', false);
      if (result.length > 0) {
        if (result[0].PARTNER_NAME.indexOf('KPX') == 0) {
          var report_name_ext = 'xlsx';
          var report_path = 'report/50/10/rpt_5010022_debit_note.xlsx';
          var report_name = 'rpt_5010022_debit_note.' + report_name_ext;
          if (Number(this.modelMaster.PK) == 0) {
            this.showNotification('warning', this.$t('pls_choose_one_deli_to_print_debit_note'), '', 100);
            return;
          }
          var excel = [
            {
              sheet: 1,
              insertRange: [
                {
                  range: 'A1:I31',
                  proc: 'LG_RPT_5010022_H_NOCACHE',
                  params: [this.user.TCO_COMPANY_PK, this.modelMaster.PK],
                  imageColumns: ['COM_PIC']
                }
              ],
              insertRows: [
                {
                  startRow: 12,
                  proc: 'LG_RPT_5010022_NOCACHE',
                  params: [this.modelMaster.PK]
                }
              ]
            }
          ];
          const res = await this.$axios.$get('/dso/makereport', {
            responseType: 'blob',
            params: {
              template: report_path,
              excel: JSON.stringify(excel),
              convert: report_name_ext
            }
          });
          if (res && res.size > 0) {
            this._ExcelSaveAs(res, report_name);
          } else {
            this.showNotification('danger', this.$t('fail_to_export_report'), '', 4000);
          }
          this.isProcessing = false;
        } else {
          this.showNotification('warning', this.$t('this_report_is_not_avaiable'), '', 3000);
        }
      }
    },
    async printNoteNike() {
      let report = 'rpt_swgd010_delivery_note_v2';
      let proc1 = 'LG_RPT_SWGD010_2_NOCACHE';
      let qrCol = ['SLIP_NO'];
      let range1 = 'F18:G18';
      let startRow1 = 17;

      try {
        this._ExcelSaveAs(
          await this.$axios.$get('/dso/makereport', {
            responseType: 'blob',
            params: {
              template: 'report/50/10/' + report + '.xlsx',
              excel: JSON.stringify([
                {
                  sheet: 1,
                  insertRange: [
                    { range: 'A1:J3', proc: 'LG_RPT_SWGD010_BASIC_INFO_3', params: [this.user.USER_ID, this.user.TCO_COMPANY_PK] },
                    { range: 'A4:J13', proc: 'LG_RPT_SWGD010_1_NOCACHE', params: [this.modelMaster.PK], qrColumns: qrCol }
                    // { range: range1, proc: "LG_RPT_5010022_3_NOCACHE", params: [this.modelMaster.PK], },
                  ],
                  insertRows: [{ startRow: startRow1, proc: proc1, params: [this.modelMaster.PK] }]
                }
              ]),
              convert: 'xlsx'
            }
          }),
          'GD Entry - ' + this.modelMaster.SLIP_NO + '.' + 'xlsx'
        );
      } catch (e) {
        this.showNotification('danger', this.$t('fail_to_export_report'), '', 4000);
      }
    },
    async printDeliSlip(ReportType) {
      if (ReportType == 1) {
        let report = 'rpt_5010022_01_OTM';
        let proc1 = 'LG_RPT_5010022_2_NOCACHE';
        let qrCol = ['SLIP_NO'];
        let range1 = 'F18:G18';
        let startRow1 = 17;
        switch (this.typeSite) {
          case 'KPX':
            if (this.tabsNum == 1) {
              proc1 = 'LG_RPT_5010022_4_NOCACHE';
            }
            if (this.typeSite == 'KPX') {
              qrCol = [];
              report = 'rpt_5010022_01_KPX';
              range1 = 'F15:G15';
              startRow1 = 14;
            }
            try {
              this._ExcelSaveAs(
                await this.$axios.$get('/dso/makereport', {
                  responseType: 'blob',
                  params: {
                    template: 'report/50/10/' + report + '.xlsx',
                    excel: JSON.stringify([
                      {
                        sheet: 1,
                        insertRange: [
                          { range: 'A1:J3', proc: 'LG_RPT_BASIC_INFO_3', params: [this.user.USER_ID, this.user.TCO_COMPANY_PK] },
                          { range: 'A4:J13', proc: 'LG_RPT_5010022_1_NOCACHE', params: [this.modelMaster.PK], qrColumns: qrCol },
                          { range: range1, proc: 'LG_RPT_5010022_3_NOCACHE', params: [this.modelMaster.PK] }
                        ],
                        insertRows: [{ startRow: startRow1, proc: proc1, params: [this.modelMaster.PK] }]
                      }
                    ]),
                    convert: 'xlsx'
                  }
                }),
                'GD Entry - ' + this.modelMaster.SLIP_NO + '.' + 'xlsx'
              );
            } catch (e) {
              this.showNotification('danger', this.$t('fail_to_export_report'), '', 4000);
            }
            break;
          case 'OTM':
            if (this.tabsNum == 1) {
              proc1 = 'LG_RPT_5010022_4_NOCACHE';
            }
            // if (this.typeSite == "KPX") {
            //   qrCol = []
            //   report = "rpt_5010022_01_KPX";
            //   range1 = "F15:G15"
            //   startRow1 = 14
            // }
            try {
              this._ExcelSaveAs(
                await this.$axios.$get('/dso/makereport', {
                  responseType: 'blob',
                  params: {
                    template: 'report/50/10/' + report + '.xlsx',
                    excel: JSON.stringify([
                      {
                        sheet: 1,
                        insertRange: [
                          { range: 'A1:J3', proc: 'LG_RPT_BASIC_INFO_3', params: [this.user.USER_ID, this.user.TCO_COMPANY_PK] },
                          { range: 'A4:J13', proc: 'LG_RPT_5010022_1_NOCACHE', params: [this.modelMaster.PK], qrColumns: qrCol },
                          { range: range1, proc: 'LG_RPT_5010022_3_NOCACHE', params: [this.modelMaster.PK] }
                        ],
                        insertRows: [{ startRow: startRow1, proc: proc1, params: [this.modelMaster.PK] }]
                      }
                    ]),
                    convert: 'xlsx'
                  }
                }),
                'GD Entry - ' + this.modelMaster.SLIP_NO + '.' + 'xlsx'
              );
            } catch (e) {
              this.showNotification('danger', this.$t('fail_to_export_report'), '', 4000);
            }
            break;
          case 'ILSHIN':
            report = 'rpt_5010022_01_ILSHIN';
            try {
              this._ExcelSaveAs(
                await this.$axios.$get('/dso/makereport', {
                  responseType: 'blob',
                  params: {
                    template: 'report/50/10/' + report + '.xlsx',
                    excel: JSON.stringify([
                      {
                        sheet: 1,
                        insertRange: [
                          { range: 'C1:G3', proc: 'LG_RPT_BASIC_INFO_3', params: [this.user.USER_ID, this.user.TCO_COMPANY_PK] },
                          { range: 'A5:J9', proc: 'LG_RPT_5010022_1_NOCACHE', params: [this.modelMaster.PK] },
                          { range: 'F17:G17', proc: 'LG_RPT_5010022_3_NOCACHE', params: [this.modelMaster.PK] }
                        ],
                        insertRows: [{ startRow: 13, proc: proc, params: [this.modelMaster.PK] }]
                      }
                    ]),
                    convert: 'xlsx'
                  }
                }),
                report + '.' + 'xlsx'
              );
            } catch (e) {
              this.showNotification('danger', this.$t('fail_to_export_report'), '', 4000);
            }
            break;
          default:
            if (this.tabsNum == 1) {
              proc1 = 'LG_RPT_5010022_4_NOCACHE';
            }
            report = 'rpt_5010022_01_ALL';
            try {
              this._ExcelSaveAs(
                await this.$axios.$get('/dso/makereport', {
                  responseType: 'blob',
                  params: {
                    template: 'report/50/10/' + report + '.xlsx',
                    excel: JSON.stringify([
                      {
                        sheet: 1,
                        insertRange: [
                          { range: 'A1:J3', proc: 'LG_RPT_BASIC_INFO_3', params: [this.user.USER_ID, this.user.TCO_COMPANY_PK] },
                          { range: 'A4:J13', proc: 'LG_RPT_5010022_1_NOCACHE', params: [this.modelMaster.PK], qrColumns: ['SLIP_NO'] },
                          { range: 'F18:G18', proc: 'LG_RPT_5010022_3_NOCACHE', params: [this.modelMaster.PK] }
                        ],
                        insertRows: [{ startRow: 17, proc: proc1, params: [this.modelMaster.PK] }]
                      }
                    ]),
                    convert: 'xlsx'
                  }
                }),
                'good_delivery_entry_' + this.modelMaster.SLIP_NO + '_' + parseInt(Math.random() * 10) + '.' + 'xlsx'
              );
            } catch (e) {
              this.showNotification('danger', this.$t('fail_to_export_report'), '', 4000);
            }
            break;
        }
      }
      /*if (ReportType == 3) {
                let report = "rpt_5010022_03_nike";
                try {
                    this._ExcelSaveAs(
                        await this.$axios.$get("/dso/makereport", {
                            responseType: "blob",
                            params: {
                                template: "report/50/10/" + report + ".xlsx",
                                excel: JSON.stringify([{
                                    sheet: 1,
                                    insertRange: [
                                        { range: "A1:Z4", proc: "LG_RPT_BASIC_INFO_3", params: [this.user.USER_ID, this.user.TCO_COMPANY_PK], imageColumns: ["PIC"] },
                                        { range: "A4:Z13", proc: "LG_RPT_5010022_03_1_NOCACHE", params: [this.modelMaster.PK] },
                                    ],
                                    insertRows: [{
                                        startRow: 17, proc: "LG_RPT_5010022_03_2_NOCACHE", params: [this.modelMaster.PK], stringColumns: ["ITEM_CODE", "ITEM_NAME"],
                                        subStyle: { font: { bold: true, name: 'Arial', family: 4, }, fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE599' }, bgColor: { argb: 'FFE599' } } }
                                    }],

                                },]),
                                convert: 'xlsx',
                            },
                        }),
                        report + "." + 'xlsx'
                    );
                } catch (e) {
                    this.showNotification("danger", this.$t("fail_to_export_report"), "", 4000);
                }
            }*/
      if (ReportType == 4) {
        let report = 'rpt_5010022_04_fnf';
        try {
          this._ExcelSaveAs(
            await this.$axios.$get('/dso/makereport', {
              responseType: 'blob',
              params: {
                template: 'report/50/10/' + report + '.xlsx',
                excel: JSON.stringify([
                  {
                    sheet: 1,
                    insertRange: [
                      {
                        range: 'A1:T4',
                        proc: 'LG_RPT_BASIC_INFO_3',
                        params: [this.user.USER_ID, this.user.TCO_COMPANY_PK],
                        imageColumns: ['PIC']
                      },
                      {
                        range: 'A5:T13',
                        proc: 'LG_RPT_5010022_03_1_NOCACHE',
                        params: [this.modelMaster.PK]
                      }
                    ],
                    insertRows: [
                      {
                        startRow: 17,
                        proc: 'LG_RPT_5010022_04_2_NOCACHE',
                        params: [this.modelMaster.PK],
                        stringColumns: ['ITEM_CODE', 'ITEM_NAME'],
                        subStyle: { font: { bold: true, name: 'Arial', family: 4 }, fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE599' }, bgColor: { argb: 'FFE599' } } }
                      }
                    ]
                  }
                ]),
                convert: 'xlsx'
              }
            }),
            report + '.' + 'xlsx'
          );
        } catch (e) {
          this.showNotification('danger', this.$t('fail_to_export_report'), '', 4000);
        }
      }
      if (ReportType == 5) {
        let report = 'rpt_5010022_05_other';
        try {
          this._ExcelSaveAs(
            await this.$axios.$get('/dso/makereport', {
              responseType: 'blob',
              params: {
                template: 'report/50/10/' + report + '.xlsx',
                excel: JSON.stringify([
                  {
                    sheet: 1,
                    insertRange: [
                      {
                        range: 'A1:T4',
                        proc: 'LG_RPT_BASIC_INFO_3',
                        params: [this.user.USER_ID, this.user.TCO_COMPANY_PK],
                        imageColumns: ['PIC']
                      },
                      {
                        range: 'A5:T13',
                        proc: 'LG_RPT_5010022_03_1_NOCACHE',
                        params: [this.modelMaster.PK]
                      }
                    ],
                    insertRows: [
                      {
                        startRow: 17,
                        proc: 'LG_RPT_5010022_05_2_NOCACHE',
                        params: [this.modelMaster.PK],
                        stringColumns: ['ITEM_CODE', 'ITEM_NAME'],
                        subStyle: { font: { bold: true, name: 'Arial', family: 4 }, fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE599' }, bgColor: { argb: 'FFE599' } } }
                      }
                    ]
                  }
                ]),
                convert: 'xlsx'
              }
            }),
            report + '.' + 'xlsx'
          );
        } catch (e) {
          this.showNotification('danger', this.$t('fail_to_export_report'), '', 4000);
        }
      }
    },
    async print_VQ() {
      // Check if a record is selected
      if (!this._hasValue(this.modelMaster.PK)) {
        this.showNotification('warning', this.$t('please_select_a_record'), '', 3000);
        return;
      }

      let p_param = [
        this.modelMaster.PK,this.itemTypeReport
         // Changed from this.P_TLG_GD_OUTGO_M_PK
      ];

      let report = 'rpt_swgd010_Vq';

      try {
        this._ExcelSaveAs(
          await this.$axios.$get('/dso/makereport', {
            responseType: 'blob',
            params: {
              template: 'report/sw/gd/' + report + '.xlsx',
              excel: JSON.stringify([
                {
                  sheet: 1,
                  insertRange: [
                    {
                      range: 'A1:I1',
                      proc: 'SW_LG_RPT_GWGD010_285_NOCACHE',
                      params: [...p_param],
                      dateColumns: ['CP_DATE']
                    }
                  ],
                  insertRows: [
                    {
                      startRow: 6,
                      proc: 'SW_LG_RPT_GWGD010_285_NOCACHE',
                      params: [...p_param],
                      stringColumns: ['GAC_DATE_RPT', 'QTY', 'FACTORY_CODE_RPT'],
                      subStyle: {
                        font: { bold: true },
                        fill: {
                          type: 'pattern',
                          pattern: 'solid',
                          fgColor: { argb: 'FFE599' },
                          bgColor: { argb: 'FFE599' }
                        }
                      }
                    }
                  ]
                }
              ]),
              convert: 'xlsx'
            }
          }),
          report + '.' + 'xlsx'
        );
      } catch (e) {
        console.error('Print VQ Error:', e);
        this.showNotification('danger', this.$t('fail_to_export_report'), '', 4000);
      }
    },
    async print_DV() {
      // Check if a record is selected
      if (!this._hasValue(this.modelMaster.PK)) {
        this.showNotification('warning', this.$t('please_select_a_record'), '', 3000);
        return;
      }

      let p_param = [this.modelMaster.PK, this.itemTypeReport];

      let report = 'rpt_swgd010_DV';

      try {
        this._ExcelSaveAs(
          await this.$axios.$get('/dso/makereport', {
            responseType: 'blob',
            params: {
              template: 'report/sw/gd/' + report + '.xlsx',
              excel: JSON.stringify([
                {
                  sheet: 1,
                  insertRange: [
                    {
                      range: 'A1:M1',
                      proc: 'SW_LG_RPT_GWGD010_285_NOCACHE',
                      params: [...p_param],
                      dateColumns: ['CP_DATE']
                    }
                  ],
                  insertRows: [
                    {
                      startRow: 6,
                      proc: 'SW_LG_RPT_GWGD010_285_NOCACHE',
                      params: [...p_param],
                      stringColumns: ['GAC_DATE_RPT', 'QTY', 'FACTORY_CODE_RPT'],
                      mergeColumns: ['CODE', 'ITEM_NAME'], // Thêm dòng này để merge CODE và ITEM_NAME
                      subStyle: {
                        font: { bold: true },
                        fill: {
                          type: 'pattern',
                          pattern: 'solid',
                          fgColor: { argb: 'FFE599' },
                          bgColor: { argb: 'FFE599' }
                        }
                      }
                    }
                  ]
                }
              ]),
              convert: 'xlsx'
            }
          }),
          report + '.' + 'xlsx'
        );
      } catch (e) {
        console.error('Print DV Error:', e);
        this.showNotification('danger', this.$t('fail_to_export_report'), '', 4000);
      }
    },
    async print_VO() {
      // Check if a record is selected
      if (!this._hasValue(this.modelMaster.PK)) {
        this.showNotification('warning', this.$t('please_select_a_record'), '', 3000);
        return;
      }

      let p_param = [
        this.modelMaster.PK ,this.itemTypeReport// Changed from this.P_TLG_GD_OUTGO_M_PK
      ];

      let report = 'rpt_swgd010_VO';

      try {
        this._ExcelSaveAs(
          await this.$axios.$get('/dso/makereport', {
            responseType: 'blob',
            params: {
              template: 'report/sw/gd/' + report + '.xlsx',
              excel: JSON.stringify([
                {
                  sheet: 1,
                  insertRange: [
                    {
                      range: 'A1:M1',
                      proc: 'SW_LG_RPT_GWGD010_285_NOCACHE',
                      params: [...p_param],
                      dateColumns: ['CP_DATE']
                    }
                  ],
                  insertRows: [
                    {
                      startRow: 6,
                      proc: 'SW_LG_RPT_GWGD010_285_NOCACHE',
                      params: [...p_param],
                      stringColumns: ['GAC_DATE_RPT', 'QTY', 'FACTORY_CODE_RPT'],
                      subStyle: {
                        font: { bold: true },
                        fill: {
                          type: 'pattern',
                          pattern: 'solid',
                          fgColor: { argb: 'FFE599' },
                          bgColor: { argb: 'FFE599' }
                        }
                      }
                    }
                  ]
                }
              ]),
              convert: 'xlsx'
            }
          }),
          report + '.' + 'xlsx'
        );
      } catch (e) {
        console.error('Print VQ Error:', e);
        this.showNotification('danger', this.$t('fail_to_export_report'), '', 4000);
      }
    },
    async print_Hwaseung() {
      // Check if a record is selected
      if (!this._hasValue(this.modelMaster.PK)) {
        this.showNotification('warning', this.$t('please_select_a_record'), '', 3000);
        return;
      }

      let p_param = [
        this.modelMaster.PK,
        this.itemTypeReport // Changed from this.P_TLG_GD_OUTGO_M_PK
      ];

      let report = 'rpt_swgd010_Hwaseung';

      try {
        this._ExcelSaveAs(
          await this.$axios.$get('/dso/makereport', {
            responseType: 'blob',
            params: {
              template: 'report/sw/gd/' + report + '.xlsx',
              excel: JSON.stringify([
                {
                  sheet: 1,
                  insertRange: [
                    {
                      range: 'A1:I7',
                      proc: 'SW_LG_RPT_GWGD010_285_NOCACHE',
                      params: [...p_param],
                      dateColumns: ['CP_DATE']
                    }
                  ],
                  insertRows: [
                    {
                      startRow: 16,
                      proc: 'SW_LG_RPT_GWGD010_285_NOCACHE',
                      params: [...p_param],
                      stringColumns: ['GAC_DATE_RPT', 'QTY', 'FACTORY_CODE_RPT'],
                      subStyle: {
                        font: { bold: true },
                        fill: {
                          type: 'pattern',
                          pattern: 'solid',
                          fgColor: { argb: 'FFE599' },
                          bgColor: { argb: 'FFE599' }
                        }
                      }
                    }
                  ]
                }
              ]),
              convert: 'xlsx'
            }
          }),
          report + '.' + 'xlsx'
        );
      } catch (e) {
        console.error('Print VQ Error:', e);
        this.showNotification('danger', this.$t('fail_to_export_report'), '', 4000);
      }
    },
    async print_Sensole() {
      // Check if a record is selected
      if (!this._hasValue(this.modelMaster.PK)) {
        this.showNotification('warning', this.$t('please_select_a_record'), '', 3000);
        return;
      }

      let p_param = [
        this.modelMaster.PK ,this.itemTypeReport// Changed from this.P_TLG_GD_OUTGO_M_PK
      ];

      let report = 'rpt_swgd010_Sensole';

      try {
        this._ExcelSaveAs(
          await this.$axios.$get('/dso/makereport', {
            responseType: 'blob',
            params: {
              template: 'report/sw/gd/' + report + '.xlsx',
              excel: JSON.stringify([
                {
                  sheet: 1,
                  insertRange: [
                    {
                      range: 'A1:I7',
                      proc: 'SW_LG_RPT_GWGD010_285_NOCACHE',
                      params: [...p_param],
                      dateColumns: ['CP_DATE']
                    }
                  ],
                  insertRows: [
                    {
                      startRow: 11,
                      proc: 'SW_LG_RPT_GWGD010_285_NOCACHE',
                      params: [...p_param],
                      stringColumns: ['GAC_DATE_RPT', 'QTY', 'FACTORY_CODE_RPT'],
                      subStyle: {
                        font: { bold: true },
                        fill: {
                          type: 'pattern',
                          pattern: 'solid',
                          fgColor: { argb: 'FFE599' },
                          bgColor: { argb: 'FFE599' }
                        }
                      }
                    }
                  ]
                }
              ]),
              convert: 'xlsx'
            }
          }),
          report + '.' + 'xlsx'
        );
      } catch (e) {
        console.error('Print VQ Error:', e);
        this.showNotification('danger', this.$t('fail_to_export_report'), '', 4000);
      }
    },
    async print_VH() {
      // Check if a record is selected
      if (!this._hasValue(this.modelMaster.PK)) {
        this.showNotification('warning', this.$t('please_select_a_record'), '', 3000);
        return;
      }

      let p_param = [
        this.modelMaster.PK ,this.itemTypeReport// Changed from this.P_TLG_GD_OUTGO_M_PK
      ];

      let report = 'rpt_swgd010_VH';

      try {
        this._ExcelSaveAs(
          await this.$axios.$get('/dso/makereport', {
            responseType: 'blob',
            params: {
              template: 'report/sw/gd/' + report + '.xlsx',
              excel: JSON.stringify([
                {
                  sheet: 1,
                  insertRange: [
                    {
                      range: 'A1:I10',
                      proc: 'SW_LG_RPT_GWGD010_285_NOCACHE',
                      params: [...p_param],
                      dateColumns: ['CP_DATE']
                    }
                  ],
                  insertRows: [
                    {
                      startRow: 11,
                      proc: 'SW_LG_RPT_GWGD010_285_NOCACHE',
                      params: [...p_param],
                      stringColumns: ['GAC_DATE_RPT', 'QTY', 'FACTORY_CODE_RPT'],
                      subStyle: {
                        font: { bold: true },
                        fill: {
                          type: 'pattern',
                          pattern: 'solid',
                          fgColor: { argb: 'FFE599' },
                          bgColor: { argb: 'FFE599' }
                        }
                      }
                    }
                  ]
                }
              ]),
              convert: 'xlsx'
            }
          }),
          report + '.' + 'xlsx'
        );
      } catch (e) {
        console.error('Print VQ Error:', e);
        this.showNotification('danger', this.$t('fail_to_export_report'), '', 4000);
      }
    },
    async print_TO1() {
      // Check if a record is selected
      if (!this._hasValue(this.modelMaster.PK)) {
        this.showNotification('warning', this.$t('please_select_a_record'), '', 3000);
        return;
      }

      let p_param = [
        this.modelMaster.PK ,this.itemTypeReport // Changed from this.P_TLG_GD_OUTGO_M_PK
      ];

      let report = 'rpt_swgd010_TO1';

      try {
        this._ExcelSaveAs(
          await this.$axios.$get('/dso/makereport', {
            responseType: 'blob',
            params: {
              template: 'report/sw/gd/' + report + '.xlsx',
              excel: JSON.stringify([
                {
                  sheet: 1,
                  insertRange: [
                    {
                      range: 'A1:M7',
                      proc: 'SW_LG_RPT_GWGD010_285_NOCACHE',
                      params: [...p_param],
                      dateColumns: ['CP_DATE']
                    }
                  ],
                  insertRows: [
                    {
                      startRow: 8,
                      proc: 'SW_LG_RPT_GWGD010_285_NOCACHE',
                      params: [...p_param],
                      stringColumns: ['GAC_DATE_RPT', 'QTY', 'FACTORY_CODE_RPT'],
                      subStyle: {
                        font: { bold: true },
                        fill: {
                          type: 'pattern',
                          pattern: 'solid',
                          fgColor: { argb: 'FFE599' },
                          bgColor: { argb: 'FFE599' }
                        }
                      }
                    }
                  ]
                }
              ]),
              convert: 'xlsx'
            }
          }),
          report + '.' + 'xlsx'
        );
      } catch (e) {
        console.error('Print VQ Error:', e);
        this.showNotification('danger', this.$t('fail_to_export_report'), '', 4000);
      }
    },
    async onPrint() {
      const report = this.lstTypeReport.find(x => x.CODE == this.itemTypeReport);
      const code = Number(report.CODE);
      switch (code) {
        case 1:
          this.printDeliSlip(this.itemTypeReport);
          break;
        case 2:
          this.printKPX();
          break;
        case 3:
          this.printNoteNike();
        case 4:
        case 5:
          this.print_VQ();
          break;
        case 6:
          this.print_DV();
          break;
        case 7:
          this.print_VO();
          break;
        case 8:
          this.print_Hwaseung();
          break;
        case 9:
          this.print_Sensole();
          break;
        case 10:
          this.print_VH();
          break;
        case 11:
          this.print_TO1();
          break;
          break;
        // case 6:
        //     this.printDeliSlip(this.itemTypeReport);
        //     break;
        default:
          break;
      }
    },
    loadHeaderDetail() {
      let formatOutQty = 2;
      switch (this.typeSite) {
        case 'KPX':
          formatOutQty = 3;
          break;
        default:
          break;
      }
      this.headerGrdD = [
        { dataField: 'PK', caption: 'pk', allowEditing: false, visible: false },
        { dataField: 'SEQ', caption: this.$t('seq'), allowEditing: false },
        { dataField: 'REF_NO', caption: this.$t('ref_no'), allowEditing: true },
        { dataField: 'REQ_ITEM_PK', caption: '_req_item_pk', allowEditing: false, visible: false },
        { dataField: 'REQ_ITEM_CODE', caption: this.$t('req_item_code'), allowEditing: false, visible: this.isShowHideCols },
        { dataField: 'REQ_ITEM_NAME', caption: this.$t('req_item_name'), allowEditing: false, visible: this.isShowHideCols },
        { dataField: 'ITEM_BC', caption: this.$t('item_bc'), allowEditing: false, formatFloat: 0 },
        { dataField: 'OUT_ITEM_PK', caption: '_outgo_item_pk', allowEditing: false, visible: false },
        { dataField: 'OUT_ITEM_CODE', caption: this.$t('out_item_code'), allowEditing: false },
        { dataField: 'OUT_ITEM_NAME', caption: this.$t('out_item_name'), allowEditing: false },
        { dataField: 'DESCRIPTION_SO', caption: this.$t('remark_so'), allowEditing: false },
        { dataField: 'CUST_ITEM_CODE', caption: this.$t('cust_item_code'), allowEditing: false, visible: false },
        { dataField: 'CUST_ITEM_NAME', caption: this.$t('cust_item_name'), allowEditing: false, visible: false },
        { dataField: 'REQ_QTY', caption: this.$t('req_qty'), allowEditing: false, visible: this.isShowHideCols },
        { dataField: 'REQ_UOM', caption: this.$t('req_uom'), allowEditing: false, visible: this.isShowHideCols },
        { dataField: 'PACKING_KG', caption: this.$t('packing_kg'), allowEditing: true, formatFloat: 2 },
        { dataField: 'BOX_QTY', caption: this.$t('box'), allowEditing: true, formatFloat: 2 },
        { dataField: 'PALLET_QTY', caption: this.$t('pallet_qty'), allowEditing: true, formatFloat: 0 },
        { dataField: 'OUT_QTY', caption: this.$t('out_qty'), allowEditing: true, formatFloat: formatOutQty },
        { dataField: 'OUT_UOM', caption: this.$t('out_uom'), allowEditing: false },

        { dataField: 'ORD_UOM', caption: this.$t('ord_uom'), allowEditing: false },
        { dataField: 'ORD_UNIT', caption: this.$t('ord_uom_unit'), allowEditing: false, formatFloat: 2 },
        { dataField: 'ORD_DELI_QTY', caption: this.$t('ord_deli_qty'), allowEditing: true, formatFloat: 2 },

        { dataField: 'UNIT_PRICE', caption: this.$t('ord_u_price'), allowEditing: true, formatFloat: 4 },
        { dataField: 'ITEM_AMOUNT', caption: this.$t('item_amt'), allowEditing: true, formatFloat: 2 },

        { dataField: 'VAT_RATE', caption: this.$t('tax_rate'), allowEditing: true, formatFloat: 0 },
        { dataField: 'VAT_AMOUNT', caption: this.$t('tax_amt'), allowEditing: true, formatFloat: 2 },
        { dataField: 'TOTAL_AMOUNT', caption: this.$t('total_amt'), allowEditing: false, formatFloat: 2 },

        { dataField: 'REF_QTY', caption: this.$t('ref_qty'), allowEditing: true, formatFloat: 0, visible: this.cwCommonParam.SHOW_REF_QTY == 'Y' },
        { dataField: 'REF_UOM', caption: this.$t('ref_uom'), allowEditing: false, visible: this.cwCommonParam.SHOW_REF_QTY == 'Y' },
        { dataField: 'REF_QTY_2', caption: this.$t('ref_qty_2'), allowEditing: true, formatFloat: 0, visible: this.cwCommonParam.SHOW_REF_QTY_2 == 'Y' },
        { dataField: 'REF_UOM_2', caption: this.$t('ref_uom_2'), allowEditing: false, visible: this.cwCommonParam.SHOW_REF_QTY_2 == 'Y' },
        { dataField: 'REF_INVOICE', caption: this.$t('ref_invoice'), allowEditing: true, formatFloat: 0 },
        { dataField: 'LOT_NO', caption: this.$t('lot_no'), allowEditing: true },
        { dataField: 'PO_NO', caption: this.$t('po_no'), allowEditing: true },
        { dataField: 'GRADE', caption: this.$t('grade'), allowEditing: false },
        { dataField: 'WH_PK', caption: '_wh_pk', allowEditing: false, visible: false },
        { dataField: 'WH_NAME', caption: this.$t('wh_name'), allowEditing: false },
        { dataField: 'GD_TYPE', caption: this.$t('gd_type'), allowEditing: true, lookup: { dataSource: this.dataList.lstGDType, displayExpr: 'NAME', valueExpr: 'CODE' } },
        { dataField: 'LOC_NAME', caption: this.$t('location'), allowEditing: false },
        { dataField: 'TLG_IN_WHLOC_PK', caption: '_loc_pk', allowEditing: false, visible: false },
        { dataField: 'ATT_3', caption: this.$t('dia_cm'), allowEditing: false, visible: false },
        { dataField: 'DESCRIPTION', caption: this.$t('remark'), allowEditing: true },
        { dataField: 'TLG_GD_OUTGO_M_PK', caption: '_master_pk', allowEditing: false, visible: false },
        { dataField: 'TLG_SA_SALEORDER_D_PK', caption: '_so_d_pk', allowEditing: false, visible: false },
        { dataField: 'TLG_GD_REQ_D_PK', caption: 'TLG_GD_REQ_D_PK', allowEditing: false, visible: false },
        { dataField: 'TABLE_PK', caption: 'TABLE_PK', allowEditing: false, visible: false },
        { dataField: 'TABLE_NAME', caption: 'TABLE_NAME', allowEditing: false, visible: false },
        { dataField: 'PARENT_PK', caption: 'PARENT_PK', allowEditing: false, visible: false },
        { dataField: 'ACC_GET_YN', caption: this.$t('acc_get_yn'), allowEditing: false },
        { dataField: 'TLG_CO_SALEORDER_D_PK', caption: '_tlg_co_saleorder_d_pk', allowEditing: false, visible: false },
        { dataField: 'TLG_SA_SALEORDER_M_PK', caption: '_tlg_sa_saleorder_m_pk', allowEditing: false, visible: false },
        { dataField: 'REQ_SLIP', caption: this.$t('req_slip'), allowEditing: false },
        { dataField: 'LINE', caption: this.$t('line'), allowEditing: false, visible: true },
        { dataField: 'ITEM_OF_REQ', caption: this.$t('item_of_req'), allowEditing: false, visible: true },
        { dataField: 'MATERIAL_CODE', caption: this.$t('material_code'), allowEditing: false, visible: true },
        { dataField: 'PURCHACE_REQ', caption: this.$t('purchace_req'), allowEditing: false, visible: true },
        { dataField: 'CODE', caption: this.$t('code'), allowEditing: false, visible: true },
        { dataField: 'PT', caption: this.$t('pt'), allowEditing: false, visible: true },
        //
        { dataField: 'EXPIRE_DATE_1', caption: this.$t('expire_date_1'), allowEditing: true, dataType: 'date', visible: this.cwCommonParam.SHOW_EXPIRE_DATE == 'Y' },
        { dataField: 'FREE_QTY_01', caption: this.cwCommonParam.COL1_CAP, allowEditing: true, dataType: this.cwCommonParam.COL1_TYPE, formatFloat: this.cwCommonParam.COL1_NUMBER, visible: this.cwCommonParam.COL1_SHOW == 'Y' },
        { dataField: 'FREE_QTY_02', caption: this.cwCommonParam.COL2_CAP, allowEditing: true, dataType: this.cwCommonParam.COL2_TYPE, formatFloat: this.cwCommonParam.COL2_NUMBER, visible: this.cwCommonParam.COL2_SHOW == 'Y' },
        { dataField: 'FREE_QTY_03', caption: this.cwCommonParam.COL3_CAP, allowEditing: true, dataType: this.cwCommonParam.COL3_TYPE, formatFloat: this.cwCommonParam.COL3_NUMBER, visible: this.cwCommonParam.COL3_SHOW == 'Y' },
        { dataField: 'FREE_CODE_01', caption: this.cwCommonParam.COL4_CAP, allowEditing: true, dataType: this.cwCommonParam.COL4_TYPE, visible: this.cwCommonParam.COL4_SHOW == 'Y' },
        { dataField: 'FREE_CODE_02', caption: this.cwCommonParam.COL5_CAP, allowEditing: true, dataType: this.cwCommonParam.COL5_TYPE, visible: this.cwCommonParam.COL5_SHOW == 'Y' },
        { dataField: 'FREE_CODE_03', caption: this.cwCommonParam.COL6_CAP, allowEditing: true, dataType: this.cwCommonParam.COL6_TYPE, visible: this.cwCommonParam.COL6_SHOW == 'Y' },
        { dataField: 'FREE_DATE_01', caption: this.cwCommonParam.COL7_CAP, allowEditing: true, dataType: this.cwCommonParam.COL7_TYPE, visible: this.cwCommonParam.COL7_SHOW == 'Y' },
        { dataField: 'FREE_DATE_02', caption: this.cwCommonParam.COL8_CAP, allowEditing: true, dataType: this.cwCommonParam.COL8_TYPE, visible: this.cwCommonParam.COL8_SHOW == 'Y' },
        { dataField: 'FREE_DATE_03', caption: this.cwCommonParam.COL9_CAP, allowEditing: true, dataType: this.cwCommonParam.COL9_TYPE, visible: this.cwCommonParam.COL9_SHOW == 'Y' }
      ];
    },
    initHeader() {
      this.headerGrdSearch = [
        { dataField: 'PK', caption: this.$t('pk'), allowEditing: false, visible: false },
        { dataField: 'STATUS', caption: this.$t('status'), allowEditing: false },
        { dataField: 'SLIP_NO', caption: this.$t('slip_ref_no'), allowEditing: false },
        { dataField: 'OUT_DATE', caption: this.$t('date'), allowEditing: false, dataType: 'date' },
        { dataField: 'PARTNER_NAME', caption: this.$t('partner'), allowEditing: false }
      ];
      this.loadHeaderDetail();
    }
    //====================================================

    /*NOTE: */
  }
};
</script>
