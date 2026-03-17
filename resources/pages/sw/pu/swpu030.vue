<!-- SHINWOO -->
<template>
    <v-container fluid v-resize="onResize">
        <v-row class="pt-1" dense>
            <v-col :md="cols_left" class="clsLeft">
                <v-card class="pa-1" outlined tile>
                    <v-row class="pt-1" dense>
                        <v-col md="5">
                            <BaseDatePicker start v-model="modelSearch.P_FROM_DT" :label="$t('from_date')">
                            </BaseDatePicker>
                        </v-col>
                        <v-col md="5">
                            <BaseDatePicker today v-model="modelSearch.P_TO_DT" :label="$t('to_date')"></BaseDatePicker>
                        </v-col>
                        <v-col md="2">
                            <div class="d-flex justify-center">
                                <BaseButton btn_type="icon" icon_type="search" :btn_text="$t('search')"
                                    @onclick="onSearchLeft" />
                            </div>
                        </v-col>
                    </v-row>
                    <!-- <v-row class="pt-0" dense>
                        <v-col md="12">
                            <BaseSelect :label="$t('company')" v-model="modelSearch.P_TCO_COMPANY_PK"
                                :lstData="dataList.lstCompany" item-text="TEXT" item-value="PK"
                                @change="onChangeField('lstCompanySearch')" />
                        </v-col>
                    </v-row> -->
                    <v-row class="pt-0" dense>
                        <v-col md="12">
                            <div class="d-flex">
                                <BaseInput style="width: 80%;" :label="$t('po_no_search')"
                                    v-model="modelSearch.P_PO_NO" />
                                <BaseButton icon_type="submit" :btn_text="$t('Payment Finish')"
                                    @onclick="On_Submit_Cancel('btnSubmit')"></BaseButton>
                            </div>
                        </v-col>
                    </v-row>
                    <v-row class="pt-0" dense>
                        <v-col md="12">
                            <div class="d-flex">
                                <BaseInput style="width: 80%;" :label="$t('supplier')"
                                    v-model="modelSearch.P_PARTNER" />
                                <BaseButton icon_type="cancel" :btn_text="$t('cancel')"
                                    @onclick="On_Submit_Cancel('btnCancel')" :disabled="isProcessing" />
                            </div>
                        </v-col>
                    </v-row>
                    <v-row class="pt-0" dense>
                        <v-col md="9">
                            <!-- <BaseInput :label="$t('item')" v-model="modelSearch.P_ITEM" /> -->
                            <v-spacer></v-spacer>
                        </v-col>
                        <v-col md="3">
                            <BaseCheckbox :label="$t('user_yn')" v-model="modelSearch.P_EMP_YN" />
                        </v-col>
                    </v-row>
                    <!-- <v-row class="pt-0" dense>
                        <v-col md="12">
                            <div class="d-flex">
                                <BaseInput style="width: 80%;" :label="$t('po_no_search')"
                                    v-model="modelSearch.P_PO_NO" />
                                <BaseButton icon_type="cancel" :btn_text="$t('cancel')"
                                    @onclick="On_Submit_Cancel('btnCancel')" :disabled="isProcessing" />
                            </div>
                        </v-col>
                    </v-row> -->
                    <!-- <v-row class="pt-0" dense>
                        <v-col md="9">
                            <BaseInput :label="$t('item')" v-model="modelSearch.P_ITEM" />
                        </v-col>
                        <v-col md="3">
                            <BaseCheckbox :label="$t('user_yn')" v-model="modelSearch.P_EMP_YN" />
                        </v-col>
                    <!--</v-row> -->
                    <v-row class="pt-0" dense>
                        <v-col cols="12">
                            <DataGridView column-resizing-mode="widget" ref="grdSearch" sel_procedure="LG_SEL_SWPU030"
                                select_mode="Multiple" :auto_load="false" :max_height="heightGridLeft"
                                :filter_paras="[modelSearch.P_TCO_COMPANY_PK, modelSearch.P_PO_DEPT_PK, modelSearch.P_FROM_DT, modelSearch.P_TO_DT, modelSearch.P_PARTNER, modelSearch.P_PO_NO, user.THR_ABEMP_PK, modelSearch.P_EMP_YN ? 'Y' : 'N', modelSearch.P_ITEM,]"
                                @onSelectionChanged="onSelectionChangedLeft" @cellClick="OncellClickGridLeft"
                                :header="headerSearch" />
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
            <v-col :md="cols_right">
                <v-card class="pa-1" outlined tile>
                    <v-row class="pt-1" dense>
                        <v-col md="1" align="left">
                            <div class="d-flex justify-center">
                                <BaseButton btn_type="icon" :icon_type="isShowLeft ? 'left' : 'right'"
                                    :btn_text="$t(isShowLeft ? 'hide' : 'show')" @onclick="onShowLeft" />
                            </div>
                        </v-col>
                        <v-col md="3" style="color: red; font-size: 16px;">{{ $t('total_amount') }}:{{ totalAmount }}</v-col>
                        <v-col md="8" style="text-align: right">
                            <div class="d-flex justify-end">
                                <!-- <BaseButton icon_type="new" :btn_text="$t('new')" @onclick="onClickButton('btnAddNew')"
                                    :disabled="isProcessing" />
                                <BaseButton icon_type="delete" :btn_text="$t('delete')"
                                    @onclick="onClickButton('btnDelete')" :disabled="isProcessing" />
                                <BaseButton icon_type="save" :btn_text="$t('save')"
                                    @onclick="onClickButton('btnSaveMaster')" :disabled="isProcessing" />
                                <BaseButton icon_type="submit" :btn_text="$t('submit')"
                                    @onclick="onClickButton('btnSubmit')"
                                    :disabled="isProcessing || modelMaster.STATUS == 'APPROVED'" />
                                <BaseButton icon_type="cancel" :btn_text="$t('cancel')"
                                    @onclick="onClickButton('btnCancel')"
                                    :disabled="isProcessing || modelMaster.STATUS != 'APPROVED'" />
                                <BaseButton icon_type="pdf" :btn_text="$t('pdf')" @onclick="onClickButton('btnPrint')"
                                    :disabled="isProcessing" /> -->
                                <!-- <BaseButton icon_type="excel" :btn_text="$t('excel')"
                                    @onclick="On_Submit_Cancel('btnExcel')" :disabled="isProcessing" /> -->
                            </div>
                        </v-col>
                    </v-row>
                    <v-row class="pt-2">
                        <v-col cols="12" class="pt-0">
                            <DataGridView column-resizing-mode="widget" ref="grdDetail"
                                sel_procedure="LG_SEL_SWPU030_2_NOCACHE" upd_procedure="LG_UPD_3010050_2"
                                select_mode="MultipleHideBox" :auto_load="false" :max_height="heightGrid_detail"
                                @row-updated="onCheckUpdated" @setDataSource="setDataSource"
                                @cellDblClick="onCellDbClick" :filter_paras="filterPara1"
                                :update_paras="['PK', 'SEQ', 'REF_NO', 'REQ_ITEM_PK', 'REQ_ITEM_CODE', 'REQ_ITEM_NAME', 'PO_ITEM_PK', 'PO_ITEM_CODE', 'PO_ITEM_NAME', 'PO_SPECIFICATION', 'REQ_QTY', 'REQ_UOM', 'PO_QTY', 'PO_UOM', 'UNIT_PRICE', 'ORD_UOM', 'ORD_UNIT', 'ORD_QTY', 'ORD_UNIT_PRICE', 'DISCOUNT_AMT', 'PO_AMT', 'VAT_RATE', 'VAT_AMOUNT', 'OTHERS_EXPENSE', 'TOTAL_AMT', 'ETD_FROM', 'ETD_TO', 'ETA_FROM', 'ETA_TO', 'PO_STOCK_QTY', 'PO_EXPECT_QTY', 'DEPT_NAME', 'AC_NM', 'TAC_ABACCTCODE_PK', 'PL_NM', 'TAC_ABPL_PK', 'BUDGET_NM', 'TAC_ABBUDGET_PK', 'DESCRIPTION', 'TLG_PO_PR_D_PK', 'PARENT_PK', 'TLG_PO_QUOTATION_M_PK', 'TLG_PO_PO_M_PK', 'REF_QTY_1', 'REF_UOM_1', 'REF_QTY_2', 'REF_UOM_2', 'EXPIRE_DATE_1', 'FREE_QTY_01', 'FREE_QTY_02', 'FREE_QTY_03', 'FREE_CODE_01', 'FREE_CODE_02', 'FREE_CODE_03', 'FREE_DATE_01', 'FREE_DATE_02', 'FREE_DATE_03',]"
                                :header="headerDetail" />
                        </v-col>
                    </v-row>
                    <!-- <v-row class="pt-0" dense>
                        <v-col md="3">
                            <BaseInput readonly :label="$t('slip_no')" v-model="modelMaster.PO_NO" />
                        </v-col>
                        <v-col md="2">
                            <BaseDatePicker today v-model="modelMaster.PO_DATE" :label="$t('to_date')"></BaseDatePicker>
                        </v-col>
                        <v-col md="3">
                            <BaseInput :label="$t('group_no')" v-model="modelMaster.GROUP_NO" />
                        </v-col>
                        <v-col md="2">
                            <BaseInput readonly :label="$t('charger_nm')" v-model="modelMaster.FULL_NAME" />
                        </v-col>
                        <v-col md="2">
                            <div class="d-flex justify-center">
                                <b style="color: red">{{ $t(modelMaster.STATUS) }}</b>
                            </div>
                        </v-col>
                    </v-row> -->
                    <!-- <v-row class="pt-0" dense>
                        <v-col md="12">
                            <BaseTabs>
                                <BaseTab :name="$t('tab_po_infor')">
                                    <v-row class="pt-0" dense>
                                        <v-col md="12">
                                            <v-row class="pt-0" dense>
                                                <v-col md="6">
                                                    <BaseInput readonly :label="$t('supplier')"
                                                        v-model="modelMaster.SUPPLIER_NAME"
                                                        :placeholder="$t('doubleclick_to_get_data')"
                                                        @dblClick="onClickLabel('SUPPLIER')">
                                                        <template v-slot:append>
                                                            <div class="d-flex">
                                                                <BaseIcon icon_size icon_type="popup"
                                                                    @click="onClickLabel('SUPPLIER')" class="mr-2" />
                                                                <BaseIcon icon_size icon_type="reset"
                                                                    @click="onClearPartner" />
                                                            </div>
                                                        </template>
</BaseInput>
</v-col>
<v-col md="6">
    <BaseInput readonly :label="$t('bill_to_name')" v-model="modelMaster.BILL_TO_NAME"
        :placeholder="$t('doubleclick_to_get_data')" @dblClick="onClickLabel('BILL_TO')">
        <template v-slot:append>
                                                            <div class="d-flex">
                                                                <BaseIcon icon_size icon_type="popup"
                                                                    @click="onClickLabel('BILL_TO')" class="mr-2" />
                                                                <BaseIcon icon_size icon_type="reset"
                                                                    @click="onClearBillTo" />
                                                            </div>
                                                        </template>
    </BaseInput>
</v-col>
</v-row>
<v-row class="pt-0" dense>
    <v-col md="4">
        <BaseInput :label="$t('ref_no')" v-model="modelMaster.REF_NO" />
    </v-col>
    <v-col md="4">
        <BaseSelect :label="$t('dept')" v-model="selectedBudget" :lstData="dataList.lstDept" item-text="TEXT"
            item-value="MODEL" />
    </v-col>

    <v-col md="2">
        <BaseSelect :label="$t('ccy')" v-model="modelMaster.PO_CCY" :lstData="dataList.lstCurrency" item-text="NAME"
            item-value="CODE" />
    </v-col>
    <v-col md="2">
        <BaseInput :label="$t('ex_rate')" v-model="modelMaster.EX_RATE" precision="4" number />
    </v-col>
</v-row>

<v-row class="pt-0" dense>
    <v-col md="6">
        <v-row class="pt-0" dense>
            <v-col md="12">
                <BaseTextarea rows="2" :label="$t('description')" v-model="modelMaster.DESCRIPTION"
                    :disabled="isPopup" />
            </v-col>
        </v-row>
    </v-col>
    <v-col md="6">
        <v-row class="pt-0" dense>
            <v-col md="4">
                <BaseInput :label="$t('tax_rate')" v-model="modelMaster.TAX_RATE" :precision="formatNumber.F_TAX_RATE"
                    number />
            </v-col>
            <v-col md="4">
                <BaseInput :label="$t('dis_amt')" v-model="modelMaster.DISCOUNT_AMT" :precision="formatNumber.F_PO_AMT"
                    number readonly />
            </v-col>
            <v-col md="4">
                <BaseInput :label="$t('po_amt')" v-model="modelMaster.PO_AMT" :precision="formatNumber.F_PO_AMT" number
                    readonly />
            </v-col>
        </v-row>
        <v-row class="pt-0" dense>
            <v-col md="4">
                <BaseInput :label="$t('tax_amt')" v-model="modelMaster.VAT_AMT" :precision="formatNumber.F_VAT_AMT"
                    number readonly />
            </v-col>
            <v-col md="4">
                <BaseInput :label="$t('oth_exp')" v-model="modelMaster.OTHERS_EXPENSE"
                    :precision="formatNumber.F_OTHER_EXP" number readonly />
            </v-col>
            <v-col md="4">
                <BaseInput :label="$t('total_amt')" v-model="modelMaster.TOTAL_AMT"
                    :precision="formatNumber.F_TOTAL_AMT" number readonly />
            </v-col>
        </v-row>
    </v-col>
</v-row>
</v-col>
</v-row>
</BaseTab>
<BaseTab :name="$t('tab_delivery')">
    <v-row class="pt-0" dense>
        <v-col md="12">
            <v-row class="pt-0" dense>
                <v-col md="8">
                    <BaseInput readonly :label="$t('deli_to_name')" v-model="modelMaster.DELIVER_NAME"
                        :placeholder="$t('doubleclick_to_get_data')" @dblClick="onClickLabel('DELI_TO')">
                        <template v-slot:append>
                                                            <div class="d-flex">
                                                                <BaseIcon icon_size icon_type="popup"
                                                                    @click="onClickLabel('DELI_TO')" class="mr-2" />
                                                                <BaseIcon icon_size icon_type="reset"
                                                                    @click="onClearDeliTo" />
                                                            </div>
                                                        </template>
                    </BaseInput>
                </v-col>
                <v-col md="4">
                    <BaseInput :label="$t('sale_ref')" v-model="modelMaster.SALE_REP" />
                </v-col>
            </v-row>

            <v-row class="pt-0" dense>
                <v-col md="8">
                    <BaseInput readonly :label="$t('ship_to_name')" v-model="modelMaster.SHIP_TO_NAME"
                        :placeholder="$t('doubleclick_to_get_data')" @dblClick="onClickLabel('SHIP_TO')">
                        <template v-slot:append>
                                                            <div class="d-flex">
                                                                <BaseIcon icon_size icon_type="popup"
                                                                    @click="onClickLabel('SHIP_TO')" class="mr-2" />
                                                                <BaseIcon icon_size icon_type="reset"
                                                                    @click="onClearShipTo" />
                                                            </div>
                                                        </template>
                    </BaseInput>
                </v-col>
                <v-col md="4">
                    <BaseInput :label="$t('buy_ref')" v-model="modelMaster.BUY_REP" />
                </v-col>
            </v-row>

            <v-row class="pt-0" dense>
                <v-col md="4">
                    <BaseSelect :label="$t('ex_nation')" v-model="modelMaster.EX_NATION" :lstData="dataList.lstExNation"
                        item-text="NAME" item-value="CODE" />
                </v-col>
                <v-col md="4">
                    <BaseSelect :label="$t('deli_type')" v-model="modelMaster.DELI_TYPE" :lstData="dataList.lstDeliType"
                        item-text="NAME" item-value="CODE" />
                </v-col>
                <v-col md="4"> </v-col>
            </v-row>

            <v-row class="pt-0" dense>
                <v-col md="2">
                    <BaseDatePicker v-model="modelMaster.ETD_FROM" :label="$t('etd_from')"></BaseDatePicker>
                </v-col>
                <v-col md="2">
                    <BaseDatePicker v-model="modelMaster.ETD_TO" :label="$t('etd_to')">
                    </BaseDatePicker>
                </v-col>
                <v-col md="2">
                    <BaseDatePicker v-model="modelMaster.ETA_FROM" :label="$t('eta_from')"></BaseDatePicker>
                </v-col>
                <v-col md="2">
                    <BaseDatePicker v-model="modelMaster.ETA_TO" :label="$t('eta_to')">
                    </BaseDatePicker>
                </v-col>
                <v-col md="2">
                    <BaseInput :label="$t('deli_time_from')" v-model="modelMaster.ETD_FROM_TIME" />
                </v-col>
                <v-col md="2">
                    <BaseInput :label="$t('deli_time_to')" v-model="modelMaster.ETD_TO_TIME" />
                </v-col>
            </v-row>
        </v-col>
    </v-row>
</BaseTab>
<BaseTab :name="$t('tab_payment')">
    <v-row class="pt-0" dense>
        <v-col md="12">
            <v-row class="pt-0" dense>
                <v-col cols="8">
                    <BaseInput readonly :label="$t('pl_id')" v-model="modelMaster.CENTER_NAME"
                        :placeholder="$t('doubleclick_to_get_data')" @dblClick="DLG_POP('PL_UNIT')">
                        <template v-slot:append>
                                                            <div class="d-flex">
                                                                <BaseIcon icon_size icon_type="popup"
                                                                    @click="DLG_POP('PL_UNIT')" class="mr-2" />
                                                                <BaseIcon icon_size icon_type="reset" @click="
                                                                    (modelMaster.TLG_CO_COST_CENTER_PK = ''),
                                                                    (modelMaster.CENTER_ID = ''),
                                                                    (modelMaster.CENTER_NAME = '')
                                                                    " />
                                                            </div>
                                                        </template>
                    </BaseInput>
                </v-col>
                <v-col md="2">
                    <BaseInput :label="$t('contract_no')" v-model="modelMaster.CONTRACT_NO" />
                </v-col>
                <v-col md="2">
                    <BaseDatePicker v-model="modelMaster.CONTRACT_DATE" :label="$t('contract_date')"></BaseDatePicker>
                </v-col>
            </v-row>
            <v-row class="pt-0" dense>
                <v-col md="4">
                    <BaseSelect :label="$t('po_type')" v-model="modelMaster.PO_TYPE" :lstData="dataList.lstPOType"
                        item-text="NAME" item-value="CODE" />
                </v-col>
                <v-col md="4">
                    <BaseSelect :label="$t('pay_term')" v-model="modelMaster.PAYMENT_TERM"
                        :lstData="dataList.lstPayTerm" item-text="NAME" item-value="CODE" />
                </v-col>
                <v-col md="2">
                    <BaseInput :label="$t('doc_no')" v-model="modelMaster.DOC_NO" />
                </v-col>
                <v-col md="2">
                    <BaseDatePicker v-model="modelMaster.DOC_DATE" :label="$t('doc_date')"></BaseDatePicker>
                </v-col>
            </v-row>
            <v-row class="pt-0" dense>
                <v-col md="4">
                    <BaseSelect :label="$t('price_type')" v-model="modelMaster.PRICE_TYPE"
                        :lstData="dataList.lstPriceType" item-text="NAME" item-value="CODE" />
                </v-col>
                <v-col md="4">
                    <BaseSelect :label="$t('pay_method')" v-model="modelMaster.PAYMENT_METHOD"
                        :lstData="dataList.lstPayMethod" item-text="NAME" item-value="CODE" />
                </v-col>
                <v-col md="4"> </v-col>
            </v-row>
        </v-col>
    </v-row>
</BaseTab>
</BaseTabs>
</v-col>
</v-row> -->
                    <!-- <v-row align="center" justify="space-between" no-gutters class="clsDetail">
                        <BaseTabs>
                            <BaseTab :name="$t('po_detail')">
                                <v-row class="py-0" dense>
                                    <v-col md="12" align="right" class="py-0">
                                        <v-row justify="end" class="mr-1">
                                            <BaseButton icon_type="add" :btn_text="$t('get_pr')"
                                                @onclick="onClickButton('btnPREntry')" :disabled="isProcessing" />
                                            <BaseButton icon_type="add" :btn_text="$t('btn_stock')"
                                                @onclick="onClickButton('btnStock')" :disabled="isProcessing"
                                                v-show="false" />
                                            <BaseButton icon_type="add" :btn_text="$t('btn_supplieritem')"
                                                @onclick="onClickButton('btnSupplierItemPrice')"
                                                :disabled="isProcessing" />
                                            <BaseButton icon_type="add" :btn_text="$t('btn_freeitem')"
                                                @onclick="onClickButton('btnFreeItem')" :disabled="isProcessing" />
                                            <BaseButton icon_type="delete" :btn_text="$t('btn_del')"
                                                @onclick="onClickButton('btnDeleteDetail')" :disabled="isProcessing" />
                                            <BaseButton icon_type="save" :btn_text="$t('btn_save')"
                                                @onclick="onClickButton('btnSaveDetail')" :disabled="isProcessing"
                                                v-show="false" />
                                        </v-row>
                                    </v-col>
                                </v-row>
                                <v-row class="pt-0" dense>
                                    <v-col md="1" class="py-0">
                                        <v-row justify="begin" class="mr-1">
                                            <BaseButton btn_type="icon"
                                                :icon_type="isShowHideCols ? 'eye_on' : 'eye_off'"
                                                @onclick="onShowHideCols" />
                                        </v-row>
                                    </v-col>
                                    <v-col md="2" class="py-0">
                                        <BaseInput :label="$t('items')" v-model="modelOthers.ITEMS" :precision="0"
                                            number readonly />
                                    </v-col>
                                    <v-col md="2" class="py-0">
                                        <BaseInput :label="$t('po_qty')" v-model="modelOthers.PO_QTY"
                                            :precision="formatNumber.PO_QTY" number readonly />
                                    </v-col>
                                    <v-col md="1" class="pt-2">
                                        <v-row justify="center" class="mr-1">
                                            <BaseButton btn_type="icon" icon_type="process" :btn_text="$t('cal_amount')"
                                                @onclick="onClickButton('btnCalAmt')" />
                                        </v-row>
                                    </v-col>
                                    <v-col md="2" class="pt-2">
                                        <BaseCheckbox :label="$t('auto_cal')" v-model="modelOthers.AUTO_CAL" />
                                    </v-col>
                                    <v-col md="3">
                                        <BaseInput readonly :label="$t('cost_center')"
                                            v-model="modelOthers.setCostCenterNM"
                                            :placeholder="$t('doubleclick_to_get_data')"
                                            @dblClick="DLG_POP('SET_PL_UNIT')">
                                            <template v-slot:append>
                                                <v-row>
                                                    <BaseIcon icon_size icon_type="popup"
                                                        @click="DLG_POP('SET_PL_UNIT')" class="mr-2" />
                                                    <BaseIcon icon_size icon_type="reset" @click="onReset1()"
                                                        class="mr-3" />
                                                </v-row>
                                            </template>
                                        </BaseInput>
                                    </v-col>
                                    <v-col md="1">
                                        <v-row justify="start" class="ml-1">
                                            <BaseButton btn_type="icon" icon_type="set" :btn_text="$t('set')"
                                                :disabled="isProcessing" @onclick="onSet1()" />
                                        </v-row>
                                    </v-col>
                                </v-row>
                                <v-row class="pt-2">
                                    <v-col cols="12" class="pt-0">
                                        <DataGridView column-resizing-mode="widget" ref="grdDetail"
                                            sel_procedure="LG_SEL_3010050_2_NOCACHE" upd_procedure="LG_UPD_3010050_2"
                                            select_mode="MultipleHideBox" :auto_load="false"
                                            :max_height="heightGrid_detail" @row-updated="onCheckUpdated"
                                            @setDataSource="setDataSource" @cellDblClick="onCellDbClick"
                                            :filter_paras="filterPara1"
                                            :update_paras="['PK', 'SEQ', 'REF_NO', 'REQ_ITEM_PK', 'REQ_ITEM_CODE', 'REQ_ITEM_NAME', 'PO_ITEM_PK', 'PO_ITEM_CODE', 'PO_ITEM_NAME', 'PO_SPECIFICATION', 'REQ_QTY', 'REQ_UOM', 'PO_QTY', 'PO_UOM', 'UNIT_PRICE', 'ORD_UOM', 'ORD_UNIT', 'ORD_QTY', 'ORD_UNIT_PRICE', 'DISCOUNT_AMT', 'PO_AMT', 'VAT_RATE', 'VAT_AMOUNT', 'OTHERS_EXPENSE', 'TOTAL_AMT', 'ETD_FROM', 'ETD_TO', 'ETA_FROM', 'ETA_TO', 'PO_STOCK_QTY', 'PO_EXPECT_QTY', 'DEPT_NAME', 'AC_NM', 'TAC_ABACCTCODE_PK', 'PL_NM', 'TAC_ABPL_PK', 'BUDGET_NM', 'TAC_ABBUDGET_PK', 'DESCRIPTION', 'TLG_PO_PR_D_PK', 'PARENT_PK', 'TLG_PO_QUOTATION_M_PK', 'TLG_PO_PO_M_PK', 'REF_QTY_1', 'REF_UOM_1', 'REF_QTY_2', 'REF_UOM_2', 'EXPIRE_DATE_1', 'FREE_QTY_01', 'FREE_QTY_02', 'FREE_QTY_03', 'FREE_CODE_01', 'FREE_CODE_02', 'FREE_CODE_03', 'FREE_DATE_01', 'FREE_DATE_02', 'FREE_DATE_03',]"
                                            :header="headerDetail" />
                                    </v-col>
                                </v-row>
                            </BaseTab>
                            <BaseTab :name="$t('services')">
                                <v-row class="pt-0">
                                    <v-col md="12" class="pt-0" align="right">
                                        <v-row justify="end" class="mr-1">
                                            <BaseButton icon_type="new" :btn_text="$t('new')"
                                                :disabled="isPopYN || isProcessing || !_hasValue(modelMaster.PK)"
                                                @onclick="onClickButton('btnAddService')" />
                                            <BaseButton icon_type="save" :btn_text="$t('save')"
                                                :disabled="isPopYN || isProcessing || !_hasValue(modelMaster.PK)"
                                                @onclick="onClickButton('btnSaveService')" />
                                            <BaseButton icon_type="delete" :btn_text="$t('delete')"
                                                :disabled="isPopYN || isProcessing || !_hasValue(modelMaster.PK)"
                                                @onclick="onClickButton('btnDelService')" />
                                        </v-row>
                                    </v-col>
                                </v-row>
                                <v-row class="pt-0">
                                    <v-col md="12" class="pt-0">
                                        <DataGridView column-resizing-mode="widget" ref="refGrdService"
                                            sel_procedure="LG_SEL_3010050_3_NOCACHE" upd_procedure="LG_UPD_3010050_3"
                                            select_mode="MultipleHideBox" :auto_load="false"
                                            :max_height="heightGrid_Service" @row-updated="onCheckUpdatedService"
                                            :filter_paras="filterPara1"
                                            :update_paras="['PK', 'TLG_PO_PO_M_PK', 'TLG_IT_ITEM_PK', 'SEQ_NUM', 'REF_NO', 'ITEM_CODE', 'ITEM_NAME', 'CUST_ITEM_NM', 'QTY', 'UOM', 'UNIT_PRICE', 'ITEM_AMOUNT',]"
                                            :header="headerServices" />
                                    </v-col>
                                </v-row>
                            </BaseTab>
                            <BaseTab :name="$t('summary')">
                                <v-row class="pt-0">
                                    <v-col offset-md="11" md="1" style="text-align: right">
                                        <div class="d-flex justify-end">
                                            <BaseButton icon_type="pdf" :btn_text="$t('pdf')"
                                                @onclick="onClickPrint1('pdf')" :disabled="isProcessing" />
                                            <BaseButton icon_type="excel" :btn_text="$t('excel')"
                                                @onclick="onClickPrint1('excel')" :disabled="isProcessing" />
                                        </div>
                                    </v-col>
                                </v-row>
                                <v-row class="pt-0">
                                    <v-col cols="12" class="pt-0">
                                        <DataGridView column-resizing-mode="widget" ref="grdDetai2"
                                            sel_procedure="LG_SEL_3010050_4_NOCACHE"
                                            upd_procedure="LG_SEL_3010050_4_NOCACHE" select_mode="singlerow"
                                            :auto_load="false" :max_height="heightGrid_detail"
                                            @row-updated="onCheckUpdated" :filter_paras="filterPara1"
                                            :update_paras="['PK']" :header="headerDetai2" />
                                    </v-col>
                                </v-row>
                            </BaseTab>
                        </BaseTabs>
                    </v-row> -->
                </v-card>
            </v-col>
        </v-row>
        <current-stock-dialog ref="refCurrentStockDialog" @callBackData="callBackCurrentStock"></current-stock-dialog>
        <free-item-dialog ref="refFreeItemDialog" @callBackData="callBackFreeItem"></free-item-dialog>
        <SupplierItemPriceDialog ref="refSupplierItemPriceDialog" @returnData="returnSupplierItemPriceDialog">
        </SupplierItemPriceDialog>

        <cost-center-dialog ref="refPLCenter" :companyPK="modelSearch.P_TCO_COMPANY_PK" @returnData="callBackPLCenter">
        </cost-center-dialog>
        <logistic-code-dialog ref="refLogisticCode" @callBackData="callBackLogisticCode"></logistic-code-dialog>

        <budget-dialog ref="refbudget" :companyPK="modelSearch.P_TCO_COMPANY_PK"
            @returnData="mappingBudget"></budget-dialog>

        <confirm-dialog ref="confirmDialog" @onConfirm="On_Submit_Cancel('btnAgreeCF')"></confirm-dialog>
        <alert-dialog ref="alertDialog"></alert-dialog>

        <partner-dialog ref="partnerDialog" @callBackData="mappingPartner" />
        <billto-dialog ref="billtoDialog" @callBackData="mappingBillTo" />
        <delito-dialog ref="delitoDialog" @callBackData="mappingDeli" />
        <shipto-dialog ref="shiptoDialog" @callBackData="mappingShipTo" />
        <dynamic-dialog ref="dlg_pop" :companyPK="modelSearch.P_TCO_COMPANY_PK" :header="dynamicHeader"
            :codeLabel="codeLabel" :nameLabel="nameLabel" :dialogTitle="dialogTitle" :procedure="procedure"
            :moreParas="moreParas" :autoSearch="autoSearch" @returnData="CallBack_DLG"></dynamic-dialog>

        <!-- <getprdialog ref="refPRDialog" @callBackData="callBackPREntry" /> -->

        <freeitemservicedialog ref="refFreeItemServiceDialog" @callBackData="callBackFreeItemService" />
        <!-- <GetUOMMDialog ref="refGetUOMMDialog" @callBackData="onGetUOMRate" /> -->
    </v-container>
</template>

<script>
import ConfirmDialog from "@/components/dialog/ConfirmDialog";
import AlertDialog from "@/components/dialog/AlertDialog";
import CurrentStockDialog from "@/components/dialog/CurrentStockDialog";
import CostCenterDialog from "@/components/dialog/CostCenterDialog";
import LogisticCodeDialog from "@/components/dialog/LogisticCodeDialog";
import WarehouseLocationDialog from "@/components/dialog/WarehouseLocationDialog";
import SupplierItemPriceDialog from "@/components/dialog/SupplierItemPriceDialog";
import FreeItemDialog from "@/components/dialog/FreeItemDialog";
import freeitemservicedialog from "@/components/dialog/FreeItemServiceDialog";

import DataGridView from "@/components/control/DataGridView";
import PartnerDialog from "@/components/dialog/PartnerDialog";
import DynamicDialog from "@/components/dialog/DynamicDialog";
import BudgetDialog from "@/components/dialog/BudgetDialog";

// import getprdialog from "@/pages/30/10/3010050_POP01";
// import GetUOMMDialog from "@/components/dialog/GetUOMMDialog";

export default {
    layout: "default",
    middleware: "user",

    components: {
        "partner-dialog": PartnerDialog,
        "billto-dialog": PartnerDialog,
        "delito-dialog": PartnerDialog,
        "shipto-dialog": PartnerDialog,
        "budget-dialog": BudgetDialog,
        freeitemservicedialog,
        DynamicDialog,
        DataGridView,
        ConfirmDialog,
        AlertDialog,
        CurrentStockDialog,
        FreeItemDialog,
        SupplierItemPriceDialog,
        CostCenterDialog,
        LogisticCodeDialog,
        WarehouseLocationDialog,
        // getprdialog,
        // GetUOMMDialog
    },
    data: () => ({
        lstUOM1: [],
        typeSite: "",
        summaryType: 'sum',
        totalAmount: 0,
        showGrpName: false,
        headerSearch: [],
        headerDetail: [],
        headerDetai2: [],
        headerServices: [],
        seft: this,
        selectedBudget: {},
        headerGrid: [],
        dataList: {
            lstCompany: [],
            lstDept: [],
            lstDeptSearch: [],
            lstPayMethod: [],
            lstPriceType: [],
            lstPOType: [],
            lstPayTerm: [],
            lstTransCode: [],
            lstSlipType: [],
            lstCostCenter: [],
            lstExNation: [],
            lstDeliType: [],
            lstCurrency: [],
        },

        modelSearch: {
            P_FROM_DT: "",
            P_TO_DT: "",
            P_TCO_COMPANY_PK: "",
            P_PO_DEPT_PK: "",
            P_PARTNER: "",
            P_PO_NO: "",
            P_EMP_YN: "N",
            v_adjradio: "3",
        },

        modelMaster: {
            _rowstatus: "",
            PK: "",
            PO_NO: "",
            PO_DATE: "",
            STATUS: "",
            PO_EMP_PK: "",
            FULL_NAME: "",
            REF_TABLE_PK: "",
            REF_NO: "",
            REPORT_TYPE: "",
            DESCRIPTION: "",
            SUPPLIER_PK: "",
            SUPPLIER_NAME: "",
            BILL_TO_PK: "",
            BILL_TO_NAME: "",
            PO_CCY: "",
            EX_NATION: "",
            DISCOUNT_AMT: 0,
            PO_AMT: 0,
            VAT_AMT: 0,
            OTHERS_EXPENSE: 0,
            TOTAL_AMT: 0,
            ETD_FROM: "",
            ETD_TO: "",
            ETA_FROM: "",
            ETA_TO: "",
            DELIVER_PK: "",
            DELIVER_NAME: "",
            BUY_REP: "",
            SHIP_TO_PK: "",
            SHIP_TO_NAME: "",
            SALE_REP: "",
            TLG_CO_COST_CENTER_PK: "",
            CENTER_ID: "",
            CENTER_NAME: "",
            CONTRACT_NO: "",
            PAYMENT_METHOD: "",
            PAYMENT_TERM: "",
            PRICE_TYPE: "",
            EX_RATE: 0,
            PO_TYPE: "",
            DELI_TYPE: "",
            TAC_ABBUDGET_PK: "",
            TAX_RATE: 0,
            CONTRACT_DATE: "",
            DOC_NO: "",
            DOC_DATE: "",
            TCO_COMPANY_PK: "",
            ETD_FROM_TIME: "",
            ETD_TO_TIME: "",
            GROUP_NO: "",
        },

        formatNumber: {
            PO_CCY: "",
            DESCRIPTION: "",
            SUPPLIER_PK: "",
            SUPPLIER_NAME: "",
            BILL_TO_PK: "",
            BILL_TO_NAME: "",
            DELIVER_PK: "",
            DELIVER_NAME: "",
            SALE_REP: "",
            SHIP_TO_PK: "",
            SHIP_TO_NAME: "",
            BUY_REP: "",
            DELI_TYPE: "",
            TLG_CO_COST_CENTER_PK: "",
            CENTER_ID: "",
            CENTER_NAME: "",
            PO_TYPE: "",
            PAYMENT_TERM: "",
            PRICE_TYPE: "",
            EX_RATE: "",
            PAYMENT_METHOD: "",
            CONTRACT_NO: "",

            F_PO_QTY: 0,
            F_UNIT_PRICE: 0,
            F_PO_AMT: 0,
            F_TAX_RATE: 0,
            F_TAX_AMT: 0,
            F_OTHER_EXP: 0,
            F_TOTAL_AMT: 0,
            F_REQ_QTY: 0,
            M_PO_QTY: 0,
            M_UNIT_PRICE: 0,
            M_PO_AMT: 0,
            M_TAX_RATE: 0,
            M_TAX_AMT: 0,
            M_OTHER_EXP: 0,
            M_TOTAL_AMT: 0,
            M_REQ_QTY: 0,
            AUTO_CAL: "Y",
        },
        modelOthers: {
            ITEMS: 0,
            PO_QTY: 0,
            AUTO_CAL: "Y",
            setCostCenterPK: null,
            setCostCenterNM: null,
        },
        selectedRowsData: [],
        dataGrid1: [],
        dataGrid2: [],
        objClick: "",
        isLoadData: "0",

        isShowLeft: true,
        cols_right: 8,
        cols_left: 4,
        isPopYN: false,
        isPopup: false,
        isShowHideCols: false,
        addNewYN: false,

        dynamicHeader: [],
        codeLabel: "",
        nameLabel: "",
        dialogTitle: "",
        procedure: "",
        moreParas: null,
        autoSearch: false,
        action_dlg: "",

        roundQty: 2,
        roundUnitPrice: 4,
        roundAmount: 2,

        // gw_btnProcCalcAdjQty: { disabled: false, visibled: true },
        gw_btnShowAllCol: {
            disabled: false,
            visibled: true,
            value: false
        },

        cellDblClickgrdDetail: {},
        P_ARRAY_SO_PK: '',
    }),
    async created() {
        this.modelMaster.CHARGER_PK = this.user.THR_ABEMP_PK;
        this.modelMaster.CHARGER_NM = this.user.USER_NAME;
        this.modelMaster.SLIP_DATE = this._CurrentDate("-");
        this.modelMaster.INPUT_DT = this._CurrentDate("-");

        this.SYS_SEL_LIST_COMPANY([this.user.PK]);
        this.DSO_SEL_3010050_FORMAT_01("select");
        this.initHeader()
        this.lstUOM1 = await this._getUOM(22134);
        this.checkSite()
    },
    watch: {
        "modelMaster.PO_CCY"(val) {
            this.DSO_SEL_3010050_FORMAT_02("select");
            this.reloadExRate();
        },
        "modelMaster.PO_DATE"(val) {
            this.reloadExRate();
        },
        selectedBudget(value) {
            let tmp = JSON.parse(value);
            this.modelMaster.TAC_ABBUDGET_PK = tmp.PK;
            //  console.log("watch");
        },
    },
    mounted() {
        this.getListCodes();
        /*TODO: */
    },
    computed: {
        filterPara1() { return [this.modelMaster.PK] },
        user() {
            return this.$store.getters["auth/user"];
        },
        heightGridLeft() {
            switch (this.$vuetify.breakpoint.name) {
                case "md":
                    return this.windowHeight * 0.54;
                    break;
                case "lg":
                    return this.windowHeight * 0.57;
                    break;
                case "xl":
                    return this.windowHeight * 0.6;
                    break;
                default:
                    return this.windowHeight * 0.54;
            }
        },
        heightGrid_detail() {
            switch (this.$vuetify.breakpoint.name) {
                case "md":
                    return this.windowHeight * 0.70;
                case "lg":
                    return this.windowHeight * 0.75;
                case "xl":
                    return this.windowHeight * 0.80;
                default:
                    return this.windowHeight * 0.65;
            }
        }
        ,

        limitHeightGrd1() {
            return this.windowHeight - 365;
        },
        limitHeightGrd2() {
            return this.windowHeight - 100;
        },
        heightGrid_Service() {
            switch (this.$vuetify.breakpoint.name) {
                case "md":
                    return this.windowHeight * 0.60;
                case "lg":
                    return this.windowHeight * 0.65;
                case "xl":
                    return this.windowHeight * 0.70;
                default:
                    return this.windowHeight * 0.55;
            }
        },
        heightGridCard() {
            switch (this.$vuetify.breakpoint.name) {
                case "md":
                    return this.windowHeight * 1.2;
                    break;
                case "lg":
                    return this.windowHeight * 0.99;
                    break;
                case "xl":
                    return this.windowHeight * 0.88;
                    break;
                default:
                    return this.windowHeight * 0.88;
            }
        },
        cwCommonParam() {
            return {
                ...this.$store.getters["auth/cwCommonParam"],
            };
        },
    },
    methods: {
        async checkSite() {
            const dso = {
                type: "list",
                selpro: "LG_GET_FORM_NO",
                para: [this.user.USER_ID, this.user.TCO_COMPANY_PK],
            };
            const result = await this._dsoCall(dso, "select", false);
            if (result.length > 0) {
                if (result[0].FORM_NO == '0cfLu8N0y8') {
                    this.typeSite = "LGL"
                };
                if (result[0].FORM_NO == 'uVn7ch0uQ0') {
                    this.typeSite = "KPX"
                    this.showGrpName = true
                    this.initHeade2()
                    this.modelSearch.P_TCO_COMPANY_PK = this.dataList.lstCompany[1]["PK"];
                };
                if (result[0].FORM_NO == 'tYjK5ETjTa') {
                    this.typeSite = "OTM"
                };
                if (result[0].FORM_NO == 'R3PqEWabFR') {
                    this.typeSite = "ILSHIN"
                };
                if (result[0].FORM_NO == 'E0GaSE05fd') {
                    this.typeSite = "WEBCASH"
                };
                if (result[0].FORM_NO == '9wjTU9YX2h') {
                    this.typeSite = "SAMBU"
                };
                if (result[0].FORM_NO == '68XvubXw7S') {
                    this.typeSite = "SHINWOO"
                    this.initHeade2()
                };
                if (result[0].FORM_NO == 'rUZNZTbVJy') {
                    this.typeSite = "AJ"
                };
            }
        },
        onClickPrint1(key) {
            switch (key) {
                case 'pdf':
                    this.onReport(this.modelMaster.PK, "pdf", 1);
                    break;
                case 'excel':
                    this.onReport(this.modelMaster.PK, "xlsx", 1);
                    break;
            }
        },
        onSet1() {
            this.$refs.grdDetail.setCellSelected('TAC_ABPL_PK', modelOthers.setCostCenterPK)
            this.$refs.grdDetail.setCellSelected('PL_NM', modelOthers.setCostCenterNM)
        },
        onReset1() {
            this.modelOthers.setCostCenterPK = null;
            this.modelOthers.setCostCenterNM = null
        },
        extractSummaryType() {
            // Find the first column with summaryType in headerDetail
            const summaryColumn = this.headerDetail.find(column => column.summaryType);
            if (summaryColumn) {
                this.summaryType = summaryColumn.summaryType;
            }
        },
        calculateTotalAmount() {
            // Get data from grdDetail and calculate total of TOTAL_AMT column
            const dataSource = this.$refs.grdDetail?.getDataSource() || [];
            const total = dataSource.reduce((total, item) => {
                return total + (parseFloat(item.TOTAL_AMT) || 0);
            }, 0);
            
            // Format using the same format as the dataField (F_TOTAL_AMT)
            this.totalAmount = this._formatNumber(total, this.formatNumber.F_TOTAL_AMT);
        },
        async initHeade2() {
            this.headerDetai2 = [
                { dataField: 'SEQ', caption: this.$t('seq'), allowEditing: false, },
                { dataField: 'PO_ITEM_CODE', caption: this.$t('po_item_code'), allowEditing: false, },
                { dataField: 'PO_ITEM_NAME', caption: this.$t('po_item_name'), allowEditing: false, },
                { dataField: 'PO_QTY', caption: this.$t('po_qty'), allowEditing: true, formatFloat: this.formatNumber.F_PO_QTY, },
                { dataField: 'PO_UOM', caption: this.$t('uom'), allowEditing: false, },
                { dataField: 'UNIT_PRICE', caption: this.$t('unit_price'), allowEditing: true, formatFloat: this.formatNumber.F_UNIT_PRICE, },
                { dataField: 'DISCOUNT_AMT', caption: this.$t('dis_amt'), allowEditing: true, formatFloat: this.formatNumber.F_PO_AMT, },
                { dataField: 'PO_AMT', caption: this.$t('po_amt'), allowEditing: true, formatFloat: this.formatNumber.F_PO_AMT, },
                { dataField: 'VAT_RATE', caption: this.$t('vat_rate'), allowEditing: true, formatFloat: 0, },
                { dataField: 'VAT_AMOUNT', caption: this.$t('vat_amt'), allowEditing: true, formatFloat: this.formatNumber.F_TAX_AMT, },
                { dataField: 'OTHERS_EXPENSE', caption: this.$t('others_exp'), allowEditing: true, formatFloat: this.formatNumber.F_OTHER_EXP, },
                { dataField: 'TOTAL_AMT', caption: this.$t('total_amt'), allowEditing: true, formatFloat: this.formatNumber.TOTAL_AMT, },
                { dataField: 'ETD_FROM', caption: this.$t('etd_from'), allowEditing: true, dataType: 'date', },
                { dataField: 'ETD_TO', caption: this.$t('etd_to'), allowEditing: true, dataType: 'date', },
                { dataField: 'ETA_FROM', caption: this.$t('eta_from'), allowEditing: true, dataType: 'date', },
                { dataField: 'ETA_TO', caption: this.$t('eta_to'), allowEditing: true, dataType: 'date', },
                { dataField: 'PL_NM', caption: this.$t('cost_center'), allowEditing: false, },
                { dataField: 'BUDGET_NM', caption: this.$t('budget'), allowEditing: false, },
                { dataField: 'DESCRIPTION', caption: this.$t('remark'), allowEditing: true, },
            ]
            this.headerDetail = [
                // { dataField: 'SEQ', caption: this.$t('STT'), allowEditing: false, },
                // { dataField: 'PO_NO', caption: this.$t('Item Code'), allowEditing: false, },
                // { dataField: 'PO_ITEM_NAME', caption: this.$t('Item Name'), allowEditing: false, },
                // { dataField: 'PO_QTY', caption: this.$t('Spec'), allowEditing: true, formatFloat: this.formatNumber.F_PO_QTY, },
                // { dataField: 'PO_UOM', caption: this.$t('UOM'), allowEditing: false, },
                // { dataField: 'UNIT_PRICE', caption: this.$t('Qty'), allowEditing: true, formatFloat: this.formatNumber.F_UNIT_PRICE, },
                // { dataField: 'PRICE_TYPE', caption: this.$t('(VND)/Price'), allowEditing: true, formatFloat: this.formatNumber.F_PO_AMT, },
                // { dataField: 'PO_AMT', caption: this.$t('Amout'), allowEditing: true, formatFloat: this.formatNumber.F_PO_AMT, },
                // { dataField: 'VAT_RATE', caption: this.$t('Remake'), allowEditing: true, formatFloat: 0, },
                { dataField: 'SEQ', caption: this.$t('seq'), allowEditing: false, },
                { dataField: 'REF_NO', caption: this.$t('ref_no'), allowEditing: true, },
                { dataField: 'REQ_ITEM_CODE', caption: this.$t('req_item_code'), allowEditing: false, visible: this.isShowHideCols, },
                { dataField: 'REQ_ITEM_NAME', caption: this.$t('req_item_name'), allowEditing: false, visible: this.isShowHideCols, },
                { dataField: 'EXPIRE_DATE_1', caption: this.$t('expire_date_1'), allowEditing: true, dataType: 'date', visible: this.cwCommonParam.SHOW_EXPIRE_DATE == 'Y', },
                { dataField: 'GRP_NM', caption: 'group_name', allowEditing: false, visible: this.showGrpName, },
                { dataField: 'PO_ITEM_CODE', caption: this.$t('po_item_code'), allowEditing: false, },
                { dataField: 'PO_ITEM_NAME', caption: this.$t('po_item_name'), allowEditing: false, },
                { dataField: 'REQ_QTY', caption: this.$t('req_qty'), allowEditing: false, formatFloat: this.formatNumber.F_REQ_QTY, },
                { dataField: 'REQ_UOM', caption: this.$t('req_uom'), allowEditing: false, },
                { dataField: 'PO_QTY', caption: this.$t('po_qty'), allowEditing: false, formatFloat: this.formatNumber.F_PO_QTY, },
                { dataField: 'PO_UOM', caption: this.$t('uom'), allowEditing: false, },
                { dataField: 'UNIT_PRICE', caption: this.$t('unit_price'), allowEditing: true, formatFloat: this.formatNumber.F_UNIT_PRICE, },
                { dataField: 'ORD_UOM', caption: this.$t('ord_uom'), allowEditing: false, },
                { dataField: 'ORD_UNIT', caption: this.$t('ord_uom_unit'), allowEditing: false, formatFloat: 2, },
                { dataField: 'ORD_QTY', caption: this.$t('ord_qty'), allowEditing: true, formatFloat: this.formatNumber.F_PO_QTY, },
                { dataField: 'ORD_UNIT_PRICE', caption: this.$t('ord_u_price'), allowEditing: true, formatFloat: this.formatNumber.F_UNIT_PRICE, },
                { dataField: 'DISCOUNT_AMT', caption: this.$t('dis_amt'), allowEditing: true, formatFloat: this.formatNumber.F_PO_AMT, },
                { dataField: 'PO_AMT', caption: this.$t('po_amt'), allowEditing: true, formatFloat: this.formatNumber.F_PO_AMT, },
                { dataField: 'VAT_RATE', caption: this.$t('vat_rate'), allowEditing: true, formatFloat: 0, },
                { dataField: 'VAT_AMOUNT', caption: this.$t('vat_amt'), allowEditing: true, formatFloat: this.formatNumber.F_TAX_AMT, },
                { dataField: 'OTHERS_EXPENSE', caption: this.$t('others_exp'), allowEditing: true, formatFloat: this.formatNumber.F_OTHER_EXP, },
                { dataField: 'TOTAL_AMT', caption: this.$t('total_amt'), allowEditing: true, formatFloat: this.formatNumber.TOTAL_AMT,dataType: "number", summaryType: 'sum' },
                { dataField: 'ETD_FROM', caption: this.$t('etd_from'), allowEditing: true, dataType: 'date', },
                { dataField: 'ETD_TO', caption: this.$t('etd_to'), allowEditing: true, dataType: 'date', },
                { dataField: 'ETA_FROM', caption: this.$t('eta_from'), allowEditing: true, dataType: 'date', },
                { dataField: 'ETA_TO', caption: this.$t('eta_to'), allowEditing: true, dataType: 'date', },
                { dataField: 'AC_NM', caption: this.$t('account_name'), allowEditing: false, },
                { dataField: 'PL_NM', caption: this.$t('cost center'), allowEditing: false, },
                { dataField: 'BUDGET_NM', caption: this.$t('budget'), allowEditing: false, },
                { dataField: 'DESCRIPTION', caption: this.$t('remark'), allowEditing: true, },
                { dataField: 'REF_QTY', caption: this.$t('ref_qty'), allowEditing: true, formatFloat: 0, visible: this.cwCommonParam.SHOW_REF_QTY == 'Y', },
                { dataField: 'REF_UOM', caption: this.$t('ref_uom'), allowEditing: false, visible: this.cwCommonParam.SHOW_REF_QTY == 'Y', },
                { dataField: 'REF_QTY_2', caption: this.$t('ref_qty_2'), allowEditing: true, formatFloat: 0, visible: this.cwCommonParam.SHOW_REF_QTY_2 == 'Y', },
                { dataField: 'REF_UOM_2', caption: this.$t('ref_uom_2'), allowEditing: false, visible: this.cwCommonParam.SHOW_REF_QTY_2 == 'Y', },
                { dataField: 'FREE_QTY_01', caption: this.cwCommonParam.COL1_CAP, allowEditing: true, dataType: this.cwCommonParam.COL1_TYPE, formatFloat: this.cwCommonParam.COL1_NUMBER, visible: this.cwCommonParam.COL1_SHOW == 'Y', },
                { dataField: 'FREE_QTY_02', caption: this.cwCommonParam.COL2_CAP, allowEditing: true, dataType: this.cwCommonParam.COL2_TYPE, formatFloat: this.cwCommonParam.COL2_NUMBER, visible: this.cwCommonParam.COL2_SHOW == 'Y', },
                { dataField: 'FREE_QTY_03', caption: this.cwCommonParam.COL3_CAP, allowEditing: true, dataType: this.cwCommonParam.COL3_TYPE, formatFloat: this.cwCommonParam.COL3_NUMBER, visible: this.cwCommonParam.COL3_SHOW == 'Y', },
                { dataField: 'FREE_CODE_01', caption: this.cwCommonParam.COL4_CAP, allowEditing: true, dataType: this.cwCommonParam.COL4_TYPE, visible: this.cwCommonParam.COL4_SHOW == 'Y', },
                { dataField: 'FREE_CODE_02', caption: this.cwCommonParam.COL5_CAP, allowEditing: true, dataType: this.cwCommonParam.COL5_TYPE, visible: this.cwCommonParam.COL5_SHOW == 'Y', },
                { dataField: 'FREE_CODE_03', caption: this.cwCommonParam.COL6_CAP, allowEditing: true, dataType: this.cwCommonParam.COL6_TYPE, visible: this.cwCommonParam.COL6_SHOW == 'Y', },
                { dataField: 'FREE_DATE_01', caption: this.cwCommonParam.COL7_CAP, allowEditing: true, dataType: this.cwCommonParam.COL7_TYPE, visible: this.cwCommonParam.COL7_SHOW == 'Y', },
                { dataField: 'FREE_DATE_02', caption: this.cwCommonParam.COL8_CAP, allowEditing: true, dataType: this.cwCommonParam.COL8_TYPE, visible: this.cwCommonParam.COL8_SHOW == 'Y', },
                { dataField: 'FREE_DATE_03', caption: this.cwCommonParam.COL9_CAP, allowEditing: true, dataType: this.cwCommonParam.COL9_TYPE, visible: this.cwCommonParam.COL9_SHOW == 'Y', },
            ]
            this.extractSummaryType();
            this.headerServices = [
                { dataField: 'PK', caption: this.$t('pk'), allowEditing: false, visible: false, },
                { dataField: 'TLG_PO_PO_M_PK', caption: 'TLG_PO_PO_M_PK', allowEditing: false, visible: false, },
                { dataField: 'TLG_IT_ITEM_PK', caption: 'TLG_IT_ITEM_PK', allowEditing: false, visible: false, },
                { dataField: 'SEQ_NUM', caption: this.$t('seq'), allowEditing: false, },
                { dataField: 'REF_NO', caption: this.$t('ref_no'), allowEditing: false, },
                { dataField: 'ITEM_CODE', caption: this.$t('item_code'), allowEditing: false, },
                { dataField: 'ITEM_NAME', caption: this.$t('item_name'), allowEditing: false, },
                { dataField: 'CUST_ITEM_NM', caption: this.$t('cust_item'), allowEditing: false, visible: false, },
                { dataField: 'QTY', caption: this.$t('qty'), allowEditing: true, formatFloat: 0, },
                { dataField: 'UOM', caption: this.$t('uom'), allowEditing: false, },
                { dataField: 'UNIT_PRICE', caption: this.$t('u_price'), allowEditing: true, formatFloat: this.formatNumber.F_UNIT_PRICE, },
                { dataField: 'ITEM_AMOUNT', caption: this.$t('item_amt'), allowEditing: false, formatFloat: this.formatNumber.F_PO_AMT, },
            ]
        },
        initHeader() {
            this.headerSearch = [
                // { dataField: "CHECK", caption: this.$t("Check"), allowEditing: true, hidden: false, dataType: "checkbox", },
                { dataField: 'SUBMIT_YN', caption: this.$t('Payment YN'), allowEditing: false, width: 80  },
                { dataField: 'PO_NO', caption: this.$t('po_no'), allowEditing: false, },
                { dataField: 'PARTNER_NAME', caption: this.$t('supplier'), allowEditing: false,width: 250 },
                { dataField: 'PO_DATE', caption: this.$t('po_date'), allowEditing: false, dataType: 'date', format: this.curLang.DATE_FORMAT, },
                { dataField: 'PAYMENT_TERM', caption: this.$t('payment term'), allowEditing: false, },
                { dataField: 'PAYMENT_DATE', caption: this.$t('payment date'), allowEditing: false, },
                { dataField: 'DESCRIPTION', caption: this.$t('description'), allowEditing: false, },
                { dataField: 'STATUS', caption: this.$t('status'), allowEditing: false, },
                { dataField: 'EMP_NAME', caption: this.$t('charger'), allowEditing: false, },
            ]
            this.initHeade2()

        },
        async reloadExRate() {
            const dsoExRate = {
                type: "list",
                selpro: "LG_PRO_GET_EXT_RATE_NODEJS",
                para: [this.modelMaster.PO_DATE, this.modelMaster.PO_CCY, "SELL"],
            };
            const res = await this._dsoCall(dsoExRate, "select", false);
            this.modelMaster.EX_RATE = res[0].RTN;
        },
        // New funtions
        onShowHideCols() {
            this.isShowHideCols = !this.isShowHideCols;
            this.$refs.grdDetail.reRender();
        },
        onSearchLeft() {
            this.$refs.grdSearch.loadData();
        },
        onShowLeft() {
            if (this.isShowLeft) {
                $(".clsLeft").hide();
                this.isShowLeft = false;
                this.cols_right = 12;
            } else {
                $(".clsLeft").show();
                this.isShowLeft = true;
                if (this.windowWidth > 1919) {
                    this.cols_left = 3;
                    this.cols_right = 9;
                } else {
                    this.cols_left = 3;
                    this.cols_right = 9;
                }
            }
        },

        OncellClickGridLeft(e) {
            this.modelMaster.PK = e.data.PK;
            this.onUpdMaster("select");
            //this.$refs.grdDetail.loadData();
        },

        onSelectionChangedLeft(e) {
            this.selectedRowsData = e.selectedRowsData;
            this.currentSelectedRowKeys = e.currentSelectedRowKeys;
        },

        // ---------------Tab Service------------------------------
        callBackFreeItemService(objData) {
            if (objData) {
                objData.forEach((item) => {
                    let seq = (
                        this.$refs.refGrdService.getDataSource().length +
                        1 +
                        ""
                    ).padStart(2, "0");
                    let insertRow = {};
                    insertRow.PK = "";
                    insertRow.TLG_PO_PO_M_PK = this.modelMaster.PK;
                    insertRow.TLG_IT_ITEM_PK = item.TLG_IT_ITEM_PK;
                    insertRow.SEQ_NUM = seq;
                    insertRow.REF_NO = "";
                    insertRow.ITEM_CODE = item.ITEM_CODE;
                    insertRow.ITEM_NAME = item.ITEM_NAME;
                    insertRow.CUST_ITEM_NM = "";
                    insertRow.QTY = 0;
                    insertRow.UOM = item.UOM;
                    insertRow.UNIT_PRICE = item.SALE_PRICE;
                    insertRow.ITEM_AMOUNT = 0;

                    this.$refs.refGrdService.addRowStruct(insertRow);
                });
            }
        },

        onGetUOMRate(item) {

            this.$refs.grdDetail.setCellValue("ORD_UOM", item.UOM_CODE, this.cellDblClickgrdDetail.data.PK);
            this.$refs.grdDetail.setCellValue("ORD_UNIT", item.TRAN_RATE, this.cellDblClickgrdDetail.data.PK);

            this.InputProcess(this.cellDblClickgrdDetail.data, "ORD_UNIT");

            //this.onCellChangeValue(this.cellDblClickGrdDetail.data, "ORD_UNIT");
        },

        onCheckUpdatedService(e, col) {
            var dItemAmount = 0;
            if (col == "QTY" || col == "UNIT_PRICE") {
                dItemAmount = Number(e.data.QTY) * Number(e.data.UNIT_PRICE);
                e.data.ITEM_AMOUNT = dItemAmount;
            }
        },
        //---------------------------------------------------------------

        onCellDbClick(_event) {
            this.cellDblClickgrdDetail = _event;

            switch (_event.column.dataField) {
                case "PL_NM":
                    this.objClick = "grdDetail_Cell_PL_NM";
                    this.DLG_POP("PL_UNIT");
                    break;
                case "BUDGET_NM":
                    this.objClick = "grdDetail_Cell_BUDGET_NM";
                    this.multiSelectMode = false;
                    this.cellDblClickgrdDetail = _event;
                    this.$refs.refbudget.dialogIsShow = true;
                    break;
                case "ITEM_NAME":
                    break;
                case "ORD_UOM":

                    this.$refs.refGetUOMMDialog.P_TLG_IT_ITEM_PK = _event.data.TLG_IT_ITEM_PK;
                    this.$refs.refGetUOMMDialog.P_ITEM_UOM = _event.data.PO_UOM;
                    this.$refs.refGetUOMMDialog.dialogIsShow = true;
                    break;
            }
        },

        onClickLabel(obj) {
            if (this.isPopYN) {
                return;
            }
            switch (obj) {
                case "SUPPLIER":
                    this.$refs.partnerDialog.dialogIsShow = true;
                    break;
                case "DELI_TO":
                    this.$refs.delitoDialog.dialogIsShow = true;
                    break;
                case "BILL_TO":
                    this.$refs.billtoDialog.dialogIsShow = true;
                    break;
                case "SHIP_TO":
                    this.$refs.shiptoDialog.dialogIsShow = true;
                    break;
                case "DELI_METHOD":
                    this.$refs.refLogisticCode.dialogIsShow = true;
                    this.$refs.refLogisticCode.gw_GroupCode.value = "LGCM0250";
                    break;
                case "DELI_TERM":
                    this.$refs.refLogisticCode.dialogIsShow = true;
                    this.$refs.refLogisticCode.gw_GroupCode.value = "LGCM0260";
                    break;
                case "EX_NATION":
                    this.$refs.refLogisticCode.dialogIsShow = true;
                    this.$refs.refLogisticCode.gw_GroupCode.value = "LGCM0210";
                    break;
                case "DEST_NATION":
                    this.$refs.refLogisticCode.dialogIsShow = true;
                    this.$refs.refLogisticCode.gw_GroupCode.value = "LGCM0220";
                    break;
                case "EX_PORT":
                    this.$refs.refLogisticCode.dialogIsShow = true;
                    this.$refs.refLogisticCode.gw_GroupCode.value = "IEBS0020";
                    break;
                case "DEST_PORT":
                    this.$refs.refLogisticCode.dialogIsShow = true;
                    this.$refs.refLogisticCode.gw_GroupCode.value = "IEBS0021";
                    break;
                case "ORD_TYPE":
                    this.$refs.refLogisticCode.dialogIsShow = true;
                    this.$refs.refLogisticCode.gw_GroupCode.value = "LGSA1020";
                    break;
                case "PRICE_TYPE":
                    this.$refs.refLogisticCode.dialogIsShow = true;
                    this.$refs.refLogisticCode.gw_GroupCode.value = "LGCM0130";
                    break;
                case "PAY_METHOD":
                    this.$refs.refLogisticCode.dialogIsShow = true;
                    this.$refs.refLogisticCode.gw_GroupCode.value = "LGCM0110";
                    break;
                case "PAY_TERM":
                    this.$refs.refLogisticCode.dialogIsShow = true;
                    this.$refs.refLogisticCode.gw_GroupCode.value = "LGCM0120";
                    break;
                case "PRIORITY":
                    this.$refs.refLogisticCode.dialogIsShow = true;
                    this.$refs.refLogisticCode.gw_GroupCode.value = "LGSA1040";
                    break;
                case "PROD_TYPE":
                    this.$refs.refLogisticCode.dialogIsShow = true;
                    this.$refs.refLogisticCode.gw_GroupCode.value = "LGSA1030";
                    break;
                case "STOCK_TYPE":
                    this.$refs.refLogisticCode.dialogIsShow = true;
                    this.$refs.refLogisticCode.gw_GroupCode.value = "LGSA1050";
                    break;
            }
        },

        mappingPartner(item) {
            if (item) {
                this.modelMaster.SUPPLIER_PK = item.PK;
                this.modelMaster.SUPPLIER_NAME =
                    item.PARTNER_ID + " * " + item.PARTNER_NAME;
                if (this.modelMaster.BILL_TO_PK == "") {
                    this.modelMaster.BILL_TO_PK = item.PK;
                    this.modelMaster.BILL_TO_NAME =
                        item.PARTNER_ID + " * " + item.PARTNER_NAME;
                    // this.DSO_GRD_2010020_3("select");
                }
                if (this.modelMaster.DELIVER_PK == "") {
                    this.modelMaster.DELIVER_PK = item.PK;
                    this.modelMaster.DELIVER_NAME =
                        item.PARTNER_ID + " * " + item.PARTNER_NAME;
                }
            }
        },

        mappingBillTo(item) {
            if (item) {
                this.modelMaster.BILL_TO_PK = item.PK;
                this.modelMaster.BILL_TO_NAME =
                    item.PARTNER_ID + " * " + item.PARTNER_NAME;
                //this.DSO_GRD_2010020_3("select");
            }
            if (this.modelMaster.SUPPLIER_PK == "") {
                this.modelMaster.SUPPLIER_PK = item.PK;
                this.modelMaster.SUPPLIER_NAME =
                    item.PARTNER_ID + " * " + item.PARTNER_NAME;
            }
        },
        mappingDeli(item) {
            if (item) {
                this.modelMaster.DELIVER_PK = item.PK;
                this.modelMaster.DELIVER_NAME =
                    item.PARTNER_ID + " * " + item.PARTNER_NAME;
            }
        },
        mappingShipTo(item) {
            if (item) {
                this.modelMaster.SHIP_TO_PK = item.PK;
                this.modelMaster.SHIP_TO_NAME =
                    item.PARTNER_ID + " * " + item.PARTNER_NAME;
            }
        },
        onClearPartner() {
            this.modelMaster.SUPPLIER_PK = "";
            this.modelMaster.SUPPLIER_NAME = "";
        },
        onClearBillTo() {
            this.modelMaster.BILL_TO_PK = "";
            this.modelMaster.BILL_TO_NAME = "";
        },
        onClearDeliTo() {
            this.modelMaster.DELI_TO_PK = "";
            this.modelMaster.DELIVER_NAME = "";
        },
        onClearShipTo() {
            this.modelMaster.SHIP_TO_PK = "";
            this.modelMaster.SHIP_TO_NAME = "";
        },

        mappingBudget(item) {
            if (item) {
                this.$refs.grdDetail.setCellValue(
                    "TAC_ABBUDGET_PK",
                    item.PK,
                    this.cellDblClickgrdDetail.data.PK
                );
                this.$refs.grdDetail.setCellValue(
                    "BUDGET_NM",
                    item.NAME,
                    this.cellDblClickgrdDetail.data.PK
                );
            }
        },

        DLG_POP(obj) {
            var header = [{
                dataField: "AC_CODE",
                caption: this.$t("code"),
                width: 200,
            },
            {
                dataField: "AC_CD",
                caption: this.$t("ac_code"),
                width: 200,
            },
            {
                dataField: "ACC_NM",
                caption: this.$t("acc_nm"),
            },
            ];
            this.action_dlg = obj;
            this.dialogTitle = this.$t("account");
            this.codeLabel = this.$t("ac_cd");
            this.nameLabel = this.$t("acc_name");
            this.dynamicHeader = header;
            this.procedure = "AC_SEL_GROUP_CODE";
            this.moreParas = null;
            switch (obj) {
                case "CHARGER":
                    this.header = [{
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
                    this.dialogTitle = this.$t("employee_list");
                    this.codeLabel = this.$t("employee_id");
                    this.nameLabel = this.$t("employee_name");
                    this.dynamicHeader = this.header;
                    this.procedure = "ac_sel_employee_adv";
                    break;
                case "PL_UNIT":
                    this.header = [{
                        dataField: "PL_CD",
                        caption: this.$t("pl_code"),
                        width: 200,
                    },
                    {
                        dataField: "PL_NM",
                        caption: this.$t("pl_nm"),
                    },
                    {
                        dataField: "PLC_CD",
                        caption: this.$t("plc_cd"),
                        width: 200,
                    },
                    {
                        dataField: "PLC_NM",
                        caption: this.$t("plc_nm"),
                    },
                    ];
                    this.dialogTitle = this.$t("pl_center");
                    this.codeLabel = this.$t("pl_code");
                    this.nameLabel = this.$t("pl_name");
                    this.dynamicHeader = this.header;
                    this.procedure = "AC_SEL_PL_COMM_POPUP";
                    this.moreParas = ["PL"];
                    break;
                case "SET_PL_UNIT":
                    this.header = [{
                        dataField: "PL_CD",
                        caption: this.$t("pl_code"),
                        width: 200,
                    },
                    {
                        dataField: "PL_NM",
                        caption: this.$t("pl_nm"),
                    },
                    {
                        dataField: "PLC_CD",
                        caption: this.$t("plc_cd"),
                        width: 200,
                    },
                    {
                        dataField: "PLC_NM",
                        caption: this.$t("plc_nm"),
                    },
                    ];
                    this.dialogTitle = this.$t("pl_center");
                    this.codeLabel = this.$t("pl_code");
                    this.nameLabel = this.$t("pl_name");
                    this.dynamicHeader = this.header;
                    this.procedure = "AC_SEL_PL_COMM_POPUP";
                    this.moreParas = ["PL"];
                    break;
            }
            this.autoSearch = true;
            this.$refs.dlg_pop.dialogIsShow = true;
        },

        CallBack_DLG(item) {
            switch (this.action_dlg) {
                case "CHARGER":
                    this.modelMaster.CHARGER = item.CODE + " - " + item.NAME;
                    break;
                case "PL_UNIT":
                    if (this.objClick == "grdDetail_Cell_PL_NM") {
                        this.objClick = "";
                        //this.$refs.grdDetail.setCellSelected("TAC_ABPL_PK",item.PL_PK);
                        //this.$refs.grdDetail.setCellSelected("PL_NM",item.PL_NM);
                        this.$refs.grdDetail.setCellValue(
                            "TAC_ABPL_PK",
                            item.PL_PK,
                            this.cellDblClickgrdDetail.data.PK
                        );
                        this.$refs.grdDetail.setCellValue(
                            "PL_NM",
                            item.PL_NM,
                            this.cellDblClickgrdDetail.data.PK
                        );
                    } else {
                        this.modelMaster.TLG_CO_COST_CENTER_PK = item.PL_PK;
                        this.modelMaster.CENTER_NAME = item.PL_CD + " - " + item.PL_NM;
                    }
                    break;
                case "SET_PL_UNIT":
                    this.modelOthers.setCostCenterPK = item.PL_PK;
                    this.modelOthers.setCostCenterNM = item.PL_CD + " - " + item.PL_NM;
                    break;
            }
        },

        onAddNew_Master() {
            this.addNewYN = true;
            this.modelMaster.PK = "";
            this.modelMaster.PO_NO = "***New P/O***";
            this.modelMaster.PO_DATE = this._CurrentDate("");
            this.modelMaster.STATUS = "";
            this.modelMaster.PO_EMP_PK = this.user.THR_ABEMP_PK;
            this.modelMaster.FULL_NAME = this.user.USER_NAME;

            this.modelMaster.REF_NO = "";
            this.modelMaster.REPORT_TYPE = "";
            this.modelMaster.DESCRIPTION = "";
            this.modelMaster.SUPPLIER_PK = "";
            this.modelMaster.SUPPLIER_NAME = "";

            this.modelMaster.BILL_TO_PK = "";
            this.modelMaster.BILL_TO_NAME = "";
            this.modelMaster.PO_CCY = this.formatNumber.PO_CCY; //this.dataList.lstCurrency.length > 0 ? this.dataList.lstCurrency[0]["CODE"] : "";

            this.modelMaster.EX_NATION = "";
            this.modelMaster.DISCOUNT_AMT = 0;
            this.modelMaster.PO_AMT = 0;
            this.modelMaster.VAT_AMT = 0;
            this.modelMaster.OTHERS_EXPENSE = 0;
            this.modelMaster.TOTAL_AMT = 0;
            this.modelMaster.ETD_FROM = "";
            this.modelMaster.ETD_TO = "";
            this.modelMaster.ETA_FROM = "";
            this.modelMaster.ETA_TO = "";
            this.modelMaster.DELIVER_PK = "";
            this.modelMaster.DELIVER_NAME = "";
            this.modelMaster.BUY_REP = "";
            this.modelMaster.SHIP_TO_PK = "";
            this.modelMaster.SHIP_TO_NAME = "";
            this.modelMaster.SALE_REP = "";

            this.modelMaster.TLG_CO_COST_CENTER_PK = "";
            this.modelMaster.CENTER_ID = "";
            this.modelMaster.CENTER_NAME = "";
            this.modelMaster.CONTRACT_NO = "";
            this.modelMaster.PAYMENT_METHOD = "";
            this.modelMaster.PAYMENT_TERM = "";
            this.modelMaster.PRICE_TYPE = "";
            this.modelMaster.EX_RATE = 0;
            this.modelMaster.PO_TYPE = "";
            this.modelMaster.DELI_TYPE = "";

            //this.modelMaster.TAC_ABBUDGET_PK          	= "";
            this.modelMaster.TAX_RATE = 0;

            this.modelMaster.CONTRACT_DATE = "";
            this.modelMaster.DOC_NO = "";
            this.modelMaster.DOC_DATE = "";
            this.modelMaster.TCO_COMPANY_PK = this.modelSearch.TCO_COMPANY_PK;
            this.modelMaster.ETD_FROM_TIME = "";
            this.modelMaster.ETD_TO_TIME = "";
            this.modelMaster.GROUP_NO = "";

            this.$refs.grdDetail.Clear();
            this.$refs.refGrdService.Clear();
        },

        async getListCodes() {
            let lstCommoncode = await this._getCommonCode2(
                [
                    "LGCM0100",
                    "LGPO2001",
                    "LGPO2002",
                    "LGCM0210",
                    "LGCM0130",
                    "LGCM0110",
                    "LGCM0120",
                ],
                this.user.TCO_COMPANY_PK
            );
            this.dataList.lstCurrency = lstCommoncode[0];
            this.dataList.lstPOType = lstCommoncode[1];
            this.dataList.lstDeliType = lstCommoncode[2];
            this.dataList.lstExNation = lstCommoncode[3];

            this.dataList.lstPriceType = lstCommoncode[4];
            this.dataList.lstPayMethod = lstCommoncode[5];
            this.dataList.lstPayTerm = lstCommoncode[6];
        },

        async onUpdMaster(p_action) {
            let v_masterPK = this.modelMaster.PK;
            this.modelMaster._rowstatus = p_action.toString().toUpperCase();
            const dso = {
                type: "control",
                selpro: "LG_SEL_SWPU030_1",
                updpro: "LG_UPD_3010050_1",
                para: [this.modelMaster.PK],
                elname: [
                    "_rowstatus",
                    "PK",
                    "PO_NO",
                    "PO_DATE",
                    "STATUS",
                    "PO_EMP_PK",
                    "FULL_NAME",
                    "REF_TABLE_PK",
                    "REF_NO",
                    "REPORT_TYPE",
                    "DESCRIPTION",
                    "SUPPLIER_PK",
                    "SUPPLIER_NAME",
                    "BILL_TO_PK",
                    "BILL_TO_NAME",
                    "PO_CCY",
                    "EX_NATION",
                    "DISCOUNT_AMT",
                    "PO_AMT",
                    "VAT_AMT",
                    "OTHERS_EXPENSE",
                    "TOTAL_AMT",
                    "ETD_FROM",
                    "ETD_TO",
                    "ETA_FROM",
                    "ETA_TO",
                    "DELIVER_PK",
                    "DELIVER_NAME",
                    "BUY_REP",
                    "SHIP_TO_PK",
                    "SHIP_TO_NAME",
                    "SALE_REP",
                    "TLG_CO_COST_CENTER_PK",
                    "CENTER_ID",
                    "CENTER_NAME",
                    "CONTRACT_NO",
                    "PAYMENT_METHOD",
                    "PAYMENT_TERM",
                    "PRICE_TYPE",
                    "EX_RATE",
                    "PO_TYPE",
                    "DELI_TYPE",
                    "TAC_ABBUDGET_PK",
                    "TAX_RATE",
                    "CONTRACT_DATE",
                    "DOC_NO",
                    "DOC_DATE",
                    "TCO_COMPANY_PK",
                    "ETD_FROM_TIME",
                    "ETD_TO_TIME",
                    "GROUP_NO",
                ],
                data: this.modelMaster,
            };
            let rows = await this._dsoCall(dso, p_action, false);
            if (rows) {
                if (p_action == "delete") {
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
                    this.modelMaster = {
                        ...rows,
                    };
                    if (p_action == "update" || p_action == "insert") {
                        for (
                            let i = 0; i < this.$refs.grdDetail.getDataSource().length; i++
                        ) {
                            this.$refs.grdDetail.getDataSource()[i].TLG_PO_PO_M_PK =
                                this.modelMaster.PK;
                        }
                        this.$refs.refGrdService.setValueColumnIfNull(
                            "TLG_PO_PO_M_PK",
                            this.modelMaster.PK
                        );

                        this.$refs.grdDetail.saveData();
                        this.$refs.refGrdService.saveData();
                    } else if (p_action == "select") {
                        let idx = this.dataList.lstDept.findIndex(
                            (x) => x.PK === this.modelMaster.TAC_ABBUDGET_PK
                        );
                        if (idx >= 0) {
                            this.selectedBudget = this.dataList.lstDept[idx].MODEL;
                        }
                        //this.$refs.grdDetail.loadData();
                        this.onSearchGridDetail();
                    }
                }
            }
        },

        async DSO_SEL_3010050_FORMAT_01(action = "select") {
            const dso = {
                type: "control",
                selpro: "LG_SEL_3010050_FORMAT_01",
                para: [this.modelMaster.PO_CCY],
            };
            let row = await this._dsoCall(dso, "select", false);
            if (row) {
                if (!this._hasValue(this.modelMaster.PK)) {
                    this.modelMaster.PO_CCY = row.PO_CCY;
                    this.modelMaster.DESCRIPTION = row.DESCRIPTION;
                    this.modelMaster.SUPPLIER_PK = row.SUPPLIER_PK;
                    this.modelMaster.SUPPLIER_NAME = row.SUPPLIER_NAME;

                    this.modelMaster.BILL_TO_PK = row.BILL_TO_PK;
                    this.modelMaster.BILL_TO_NAME = row.BILL_TO_NAME;
                    this.modelMaster.DELIVER_PK = row.DELIVER_PK;
                    this.modelMaster.DELIVER_NAME = row.DELIVER_NAME;
                    this.modelMaster.SALE_REP = row.SALE_REP;

                    this.modelMaster.SHIP_TO_PK = row.SHIP_TO_PK;
                    this.modelMaster.SHIP_TO_NAME = row.SHIP_TO_NAME;
                    this.modelMaster.BUY_REP = row.BUY_REP;

                    this.modelMaster.DELI_TYPE = row.DELI_TYPE;
                    this.modelMaster.TLG_CO_COST_CENTER_PK = row.TLG_CO_COST_CENTER_PK;
                    this.modelMaster.CENTER_ID = row.CENTER_ID;
                    this.modelMaster.CENTER_NAME = row.CENTER_NAME;
                    this.modelMaster.PO_TYPE = row.PO_TYPE;
                    this.modelMaster.PAYMENT_TERM = row.PAYMENT_TERM;
                    this.modelMaster.PRICE_TYPE = row.PRICE_TYPE;
                    this.modelMaster.EX_RATE = row.EX_RATE;

                    this.modelMaster.PAYMENT_METHOD = row.PAYMENT_METHOD;
                    this.modelMaster.CONTRACT_NO = row.CONTRACT_NO;
                    this.modelOthers.AUTO_CAL = row.AUTO_CAL == "Y" ? true : false;
                }

                this.formatNumber.PO_CCY = row.PO_CCY;
                this.formatNumber.DESCRIPTION = row.DESCRIPTION;
                this.formatNumber.SUPPLIER_PK = row.SUPPLIER_PK;
                this.formatNumber.SUPPLIER_NAME = row.SUPPLIER_NAME;

                this.formatNumber.BILL_TO_PK = row.BILL_TO_PK;
                this.formatNumber.BILL_TO_NAME = row.BILL_TO_NAME;
                this.formatNumber.DELIVER_PK = row.DELIVER_PK;
                this.formatNumber.DELIVER_NAME = row.DELIVER_NAME;
                this.formatNumber.SALE_REP = row.SALE_REP;

                this.formatNumber.SHIP_TO_PK = row.SHIP_TO_PK;
                this.formatNumber.SHIP_TO_NAME = row.SHIP_TO_NAME;
                this.formatNumber.BUY_REP = row.BUY_REP;

                this.formatNumber.DELI_TYPE = row.DELI_TYPE;
                this.formatNumber.TLG_CO_COST_CENTER_PK = row.TLG_CO_COST_CENTER_PK;
                this.formatNumber.CENTER_ID = row.CENTER_ID;
                this.formatNumber.CENTER_NAME = row.CENTER_NAME;
                this.formatNumber.PO_TYPE = row.PO_TYPE;
                this.formatNumber.PAYMENT_TERM = row.PAYMENT_TERM;
                this.formatNumber.PRICE_TYPE = row.PRICE_TYPE;
                this.formatNumber.EX_RATE = row.EX_RATE;

                this.formatNumber.PAYMENT_METHOD = row.PAYMENT_METHOD;
                this.formatNumber.CONTRACT_NO = row.CONTRACT_NO;

                this.formatNumber.F_PO_QTY = row.F_PO_QTY;
                this.formatNumber.F_UNIT_PRICE = row.F_UNIT_PRICE;
                this.formatNumber.F_PO_AMT = row.F_PO_AMT;
                this.formatNumber.F_TAX_RATE = row.F_TAX_RATE;
                this.formatNumber.F_TAX_AMT = row.F_TAX_AMT;
                this.formatNumber.F_OTHER_EXP = row.F_OTHER_EXP;
                this.formatNumber.F_TOTAL_AMT = row.F_TOTAL_AMT;
                this.formatNumber.F_REQ_QTY = row.F_REQ_QTY;

                this.formatNumber.M_PO_QTY = row.M_PO_QTY;
                this.formatNumber.M_UNIT_PRICE = row.M_UNIT_PRICE;
                this.formatNumber.M_PO_AMT = row.M_PO_AMT;
                this.formatNumber.M_TAX_RATE = row.M_TAX_RATE;
                this.formatNumber.M_TAX_AMT = row.M_TAX_AMT;
                this.formatNumber.M_OTHER_EXP = row.M_OTHER_EXP;
                this.formatNumber.M_TOTAL_AMT = row.M_TOTAL_AMT;
                this.formatNumber.M_REQ_QTY = row.M_REQ_QTY;
                this.initHeade2()
            }
        },

        async DSO_SEL_3010050_FORMAT_02(action = "select") {
            const dso = {
                type: "control",
                selpro: "LG_SEL_3010050_FORMAT_02",
                para: [this.modelMaster.PO_CCY],
            };
            let row = await this._dsoCall(dso, "select", false);
            if (row) {
                this.formatNumber.F_PO_QTY = row.F_PO_QTY;
                this.formatNumber.F_UNIT_PRICE = row.F_UNIT_PRICE;
                this.formatNumber.F_PO_AMT = row.F_PO_AMT;
                this.formatNumber.F_TAX_RATE = row.F_TAX_RATE;
                this.formatNumber.F_TAX_AMT = row.F_TAX_AMT;
                this.formatNumber.F_OTHER_EXP = row.F_OTHER_EXP;
                this.formatNumber.F_TOTAL_AMT = row.F_TOTAL_AMT;
                this.formatNumber.F_REQ_QTY = row.F_REQ_QTY;

                this.formatNumber.M_PO_QTY = row.M_PO_QTY;
                this.formatNumber.M_UNIT_PRICE = row.M_UNIT_PRICE;
                this.formatNumber.M_PO_AMT = row.M_PO_AMT;
                this.formatNumber.M_TAX_RATE = row.M_TAX_RATE;
                this.formatNumber.M_TAX_AMT = row.M_TAX_AMT;
                this.formatNumber.M_OTHER_EXP = row.M_OTHER_EXP;
                this.formatNumber.M_TOTAL_AMT = row.M_TOTAL_AMT;
                this.formatNumber.M_REQ_QTY = row.M_REQ_QTY;
                this.modelOthers.AUTO_CAL = row.AUTO_CAL == "Y" ? true : false;
                this.initHeade2()
            }
        },

        /*NOTE: */
        async onSubmit(action) {
            const dso = {
                type: "process",
                updpro: "LG_PRO_3010050_1",
                para: [action, this.modelMaster.PK, this.user.THR_ABEMP_PK],
            };
            let row = await this._dsoCall(dso, action, false);
            if (row) {
                this.showNotification("success", "Information", this.$t("success"));
                this.onUpdMaster("select");
            }
        },

        /*NOTE: */
        async SYS_SEL_LIST_COMPANY(_param) {
            const dso = {
                type: "list",
                selpro: "SYS_SEL_LIST_COMPANY",
                para: _param,
            };
            this.dataList.lstCompany = await this._dsoCall(dso, "select", false);
            if (this.dataList.lstCompany.length > 0) {
                this.modelSearch.P_TCO_COMPANY_PK = this.dataList.lstCompany[0]["PK"];
            }
            this.onChangeField("lstCompanySearch");
        },
        /*NOTE: */
        /*NOTE: */
        async LG_SEL_3010050_BUDGET_BY_EMP(_param) {
            const dso = {
                type: "list",
                selpro: "LG_SEL_3010050_BUDGET_BY_EMP",
                para: _param,
            };
            this.dataList.lstDeptSearch = await this._dsoCall(dso, "select", false);
            let lstTmp = [];
            this.dataList.lstDeptSearch.forEach((x) => {
                lstTmp.push({
                    TEXT: x.TEXT,
                    PK: x.PK,
                    MODEL: JSON.stringify(x),
                });
            });
            this.dataList.lstDept = [...lstTmp]; //= [...this.dataList.lstDeptSearch];
            if (this.dataList.lstDeptSearch.length > 0) {
                //this.modelMaster.TAC_ABBUDGET_PK = this.dataList.lstDept[0].PK;
                this.selectedBudget = this.dataList.lstDept[0].MODEL;
            }
            this.dataList.lstDeptSearch.unshift({
                PK: "",
                TEXT: ""
            });
            this.modelSearch.TAC_ABBUDGET_PK = "";
            this.onAddNew_Master();
        },
        /*NOTE: */

        /* ---------------------*/
        onSearchGridDetail() {
            this.$refs.grdDetail.loadData();
            this.$refs.refGrdService.loadData();
            this.$refs.grdDetai2.loadData();
        },
        /* ---------------------*/
        onSaveGridDetail() {
            this.$refs.grdDetail.saveData();
        },
        /* ---------------------*/
        onDeleteGridDetail() {
            this.$refs.grdDetail.deleteRows();
            this.calculateTotalAmount();

        },
        /* ---------------------*/
        setDataSource(e) {
            //console.log("bon", e.data)
            this.modelOthers.ITEMS = Number(
                this.$refs.grdDetail.getDataSource().length
            );
            this.TotalQty();
            this.calculateTotalAmount();
        },


        onCellChangeValue(row, col) {
            if (col == "PO_QTY" || col == "ORD_UNIT") {
                if (this._hasValue(row.ORD_UNIT)) {
                    if (Number(row.ORD_UNIT) != 0) {
                        let ord_qty = Number(row.PO_QTY) / Number(row.ORD_UNIT);
                        this.$refs.grdDetail.setCellValue("ORD_QTY", ord_qty, row.PK);

                        let unit_price = Number(row.UNIT_PRICE) * Number(row.ORD_UNIT);
                        this.$refs.grdDetail.setCellValue("ORD_UNIT_PRICE", unit_price, row.PK);

                        //this.onComputeAmt(row);
                    }
                }
            }
            /* Change the ORDER qty */
            if (col == "ORD_QTY") {
                let st_qty = Number(row.ORD_QTY) * Number(row.ORD_UNIT);
                this.$refs.grdDetail.setCellValue("ST_ORD_QTY", st_qty, row.PK);
                row.ST_ORD_QTY = st_qty;

                //this.onComputeAmt(row);
            }

            /* Change the Order Unit Price*/
            if (col == "UNIT_PRICE") {
                let tempUnitPrice = Number(row.UNIT_PRICE) / Number(row.ORD_UNIT);

                this.$refs.grdDetail.setCellValue(
                    "REF_UNIT_PRICE",
                    tempUnitPrice.toFixed(6),
                    row.PK
                );

                //this.onComputeAmt(row);
            }
        },

        onCheckUpdated(e, colName) {
            this.InputProcess(e.data, colName);
            // if (!e.cancel) {
            //   if (e.data._rowstatus !=="i") {
            //     e.data._rowstatus = "u";
            //   }
            this.calculateTotalAmount();

        },

        InputProcess(item, col) {
            var dPOAmount = 0,
                dVATAmount = 0,
                dOthersExp = 0,
                dTotalAmount = 0;
            if (col == "PO_QTY" || col == "ORD_UNIT" || col == "ORD_QTY" || col == "UNIT_PRICE" || col == "ORD_UNIT_PRICE") {
                if (col == "PO_QTY" || col == "ORD_UNIT") {
                    if (this._hasValue(item.ORD_UNIT)) {
                        if (Number(item.ORD_UNIT) != 0) {
                            let ord_qty = Number(item.PO_QTY) / Number(item.ORD_UNIT);
                            item.ORD_QTY = ord_qty;

                            let ord_unit_price = Number(item.UNIT_PRICE) * Number(item.ORD_UNIT);
                            item.ORD_UNIT_PRICE = ord_unit_price;
                        }
                    }
                }
                /* Change the ORDER qty */
                if (col == "ORD_QTY") {
                    let po_qty = Number(item.ORD_QTY) * Number(item.ORD_UNIT);
                    item.PO_QTY = po_qty;
                }

                /* Change the Order Unit Price*/
                if (col == "ORD_UNIT_PRICE") {
                    let tempUnitPrice = Number(item.ORD_UNIT_PRICE) / Number(item.ORD_UNIT);
                    item.UNIT_PRICE = tempUnitPrice;
                }

            }

            if (this.modelOthers.AUTO_CAL) {
                if (col == "PO_QTY" || col == "ORD_UNIT" || col == "ORD_QTY" || col == "UNIT_PRICE" || col == "ORD_UNIT_PRICE" || col == "DISCOUNT_AMT") {
                    dPOAmount =
                        Number(item.PO_QTY) * Number(item.UNIT_PRICE) -
                        Number(item.DISCOUNT_AMT);
                    dVATAmount = (dPOAmount * Number(item.VAT_RATE)) / 100;
                    dTotalAmount = dPOAmount + dVATAmount + Number(item.OTHERS_EXPENSE);

                    item.PO_AMT = dPOAmount;
                    item.VAT_AMOUNT = dVATAmount;
                    item.TOTAL_AMT = dTotalAmount;
                } else if (col == "PO_AMT" || col == "VAT_RATE") {
                    dPOAmount = Number(item.PO_AMT);
                    dVATAmount = (dPOAmount * Number(item.VAT_RATE)) / 100;
                    dTotalAmount = dPOAmount + dVATAmount + Number(item.OTHERS_EXPENSE);

                    item.VAT_AMOUNT = dVATAmount;
                    item.TOTAL_AMT = dTotalAmount;
                } else if (col == "VAT_AMOUNT" || col == "OTHERS_EXPENSE") {
                    dTotalAmount =
                        Number(item.PO_AMT) +
                        Number(item.VAT_AMOUNT) +
                        Number(item.OTHERS_EXPENSE);
                    item.TOTAL_AMT = dTotalAmount;
                }

                this.TotalAmount();
            } else { }
        },

        TotalAmount() {
            //---------CALCULATE AMOUNT----------------
            var sumDisAmount = 0,
                sumPOAmount = 0,
                sumVATAmount = 0,
                sumOthExpense = 0,
                sumTotalAmount = 0;
            this.dataGrid2 = this.$refs.grdDetail.getDataSource();
            for (var i = 0; i < this.dataGrid2.length; i++) {
                sumDisAmount = sumDisAmount + Number(this.dataGrid2[i].DISCOUNT_AMT);
                sumPOAmount = sumPOAmount + Number(this.dataGrid2[i].PO_AMT);
                sumVATAmount = sumVATAmount + Number(this.dataGrid2[i].VAT_AMOUNT);
                sumOthExpense =
                    sumOthExpense + Number(this.dataGrid2[i].OTHERS_EXPENSE);
                sumTotalAmount = sumTotalAmount + Number(this.dataGrid2[i].TOTAL_AMT);
            }

            this.modelMaster.DISCOUNT_AMT = sumDisAmount;
            this.modelMaster.PO_AMT = sumPOAmount;
            this.modelMaster.VAT_AMT = sumVATAmount;
            this.modelMaster.OTHERS_EXPENSE = sumOthExpense;
            this.modelMaster.TOTAL_AMT = sumTotalAmount;
        },

        TotalQty() {
            //---------CALCULATE AMOUNT----------------
            var sumPOQty = 0;
            this.dataGrid2 = this.$refs.grdDetail.getDataSource();
            for (var i = 0; i < this.dataGrid2.length; i++) {
                sumPOQty = sumPOQty + Number(this.dataGrid2[i].PO_QTY);
            }
            this.modelOthers.PO_QTY = sumPOQty;
        },

        OnProcess(pos) {
            switch (pos) {
                case "Submit":
                    this.onSubmit("SUBMIT");
                    break;
                case "Cancel":
                    this.onSubmit("CANCEL");
                    break;
                case "CAL-AMOUNT":
                    for (
                        var i = 0; i < this.$refs.grdDetail.getDataSource().length; i++
                    ) {
                        this.InputProcess(this.$refs.grdDetail.getDataSource()[i]);
                        //console.log("bonhv",this.$refs.grdDetail.getDataSource()[0]);
                    }
                    break;
            }
        },
        // -------------------------------------------
        On_Submit_Cancel(obj) {
            if (obj != 'btnAgreeCF') {
                this.objClick = obj;
            }
            switch (obj) {
                case "btnPrint":
                    this.objClick = "btnPrint";
                    if (!this.modelMaster.PK) {
                        this.$refs.alertDialog.showAlert("warning", "Error", "PLS_CHOOSE_ONE_DO_TO_PRINT");
                        return;
                    }
                    this.onReport(this.modelMaster.PK, "pdf");
                    break;
                case "btnExcel":
                    this.objClick = "btnExcel";
                    if (!this.modelMaster.PK) {
                        this.$refs.alertDialog.showAlert(
                            "warning",
                            "Error",
                            "PLS_CHOOSE_ONE_DO_TO_PRINT"
                        );
                        return;
                    }
                    this.onReport(this.modelMaster.PK, "xlsx");
                    break;
case "btnSubmit":
    const rows = this.$refs.grdSearch?.getSelectRowsData?.() || [];
    console.log('Selected rows:', rows);
    console.log('Selected PKs:', rows.map(r => r.PK));

    this.P_ARRAY_SO_PK = rows.map(r => r.PK).join(',');

    if (!this.P_ARRAY_SO_PK) {
        this.$refs.alertDialog.showAlert(
            'error',
            'Error',
            this.$t('you_must_select_one_so')
        );
        return;
    }

    this.$refs.confirmDialog.showConfirm(
        this.$t('do_you_want_to_confirm_this_so')
    );
    break;


                case "btnCancel":
                    this.P_ARRAY_SO_PK = '';
                    for (let i = 0; i < this.$refs.grdSearch.getSelectRowsData().length; i++) {
                        if (this.P_ARRAY_SO_PK == '') {
                            this.P_ARRAY_SO_PK = this.$refs.grdSearch.getSelectRowsData()[i].PK;
                        } else {
                            this.P_ARRAY_SO_PK = this.P_ARRAY_SO_PK + ',' + this.$refs.grdSearch.getSelectRowsData()[i].PK;
                        }
                    }

                    if (this.P_ARRAY_SO_PK == '') {
                        this.$refs.alertDialog.showAlert('error', 'Error', this.$t('you_must_select_one_so'));
                        return false;
                    } else {
                        this.$refs.confirmDialog.showConfirm(this.$t('do_you_want_to_cancel_this_so'));
                    }
                    break;
                case 'btnAgreeCF':
                    switch (this.objClick) {
                        case 'btnSubmit':
                            this.onConfirm();
                            break;
                        case 'btnCancel':
                            this.onCancel();
                            break;

                    }
            }
        },

        async onConfirm() {
            console.log('Submit PK list:', this.P_ARRAY_SO_PK);
            const dso = {
                type: 'process',
                updpro: 'LG_PRO_SWPU030_1',
                para: ['SUBMIT',this.P_ARRAY_SO_PK,null]
            };
            console.log(this.P_ARRAY_SO_PK)
            let row = await this._dsoCall(dso, 'update', false);
            if (row) {
                this.showNotification('success', 'Payment Success', this.$t('Payment Success'));
                this.onSearchLeft();
            }
        },
        async onCancel() {
            const dso = {
                type: 'process',
                updpro: 'LG_PRO_SWPU030_1',
                para: ['CANCEL',this.P_ARRAY_SO_PK,null]
            };
            let row = await this._dsoCall(dso, 'update', false);
            if (row) {
                this.showNotification('success', 'Cancel Success', this.$t('Cancel Success'));
                this.onSearchLeft();
            }
        },

        // onClickButton(obj) {
        //     switch (obj) {
        //         case "btnCalAmt":
        //             this.objClick = "btnCalAmt";
        //             this.$refs.confirmDialog.showConfirm(
        //                 this.$t("do_you_want_to_auto_calculate_amount")
        //             );
        //         case "btnSearch":
        //             break;
        //         case "btnAddNew":
        //             this.onAddNew_Master();
        //             this.modelMaster._rowstatus = "INSERT";
        //             break;
        //         case "btnSaveMaster":
        //             this.objClick = "btnSaveMaster";
        //             this.$refs.confirmDialog.showConfirm(this.$t("do_you_want_save"));
        //             break;
        //         case "btnDelete":
        //             this.objClick = "btnDelete";
        //             this.$refs.confirmDialog.showConfirm(
        //                 this.$t("do_you_want_delete"),
        //                 "warning"
        //             );
        //             break;
        //         case "btnSubmit":
        //             this.objClick = "btnSubmit";
        //             this.$refs.confirmDialog.showConfirm(
        //                 this.$t("do_you_want_submit", "warning")
        //             );
        //             break;
        //         case "btnCancel":
        //             this.objClick = "btnCancel";
        //             this.$refs.confirmDialog.showConfirm(
        //                 this.$t("do_you_want_cancel"),
        //                 "warning"
        //             );
        //             break;
        //         case "btnPrint":
        //             this.objClick = "btnPrint";
        //             if (!this.modelMaster.PK) {
        //                 this.$refs.alertDialog.showAlert("warning", "Error", "PLS_CHOOSE_ONE_DO_TO_PRINT");
        //                 return;
        //             }
        //             this.onReport(this.modelMaster.PK, "pdf");
        //             break;
        //         case "btnExcel":
        //             this.objClick = "btnExcel";
        //             if (!this.modelMaster.PK) {
        //                 this.$refs.alertDialog.showAlert(
        //                     "warning",
        //                     "Error",
        //                     "PLS_CHOOSE_ONE_DO_TO_PRINT"
        //                 );
        //                 return;
        //             }
        //             this.onReport(this.modelMaster.PK, "xlsx");
        //             break;
        //         case "btnDeleteDetail":
        //             this.objClick = "btnDeleteDetail";
        //             this.$refs.confirmDialog.showConfirm(
        //                 this.$t("do_you_want_delete"),
        //                 "warning"
        //             );
        //             break;
        //         case "btnProcCalcAdjQty":
        //             for (let i = 0; i < this.dataGrid2.length; i++) {
        //                 var dStockQty = Number(this.dataGrid2[i].STOCK_QTY);
        //                 var dCheckQty = Number(this.dataGrid2[i].CHECK_QTY);

        //                 var dAdjust = Number(dCheckQty) - Number(dStockQty);

        //                 this.dataGrid2[i].ADJUST_QTY = dAdjust;
        //             }
        //             break;
        //         case "btnFreeItem":
        //             this.$refs.refFreeItemDialog.dialogIsShow = true;
        //             this.$refs.refFreeItemDialog.dataGrid1 = [];
        //             this.$refs.refFreeItemDialog.dataGrid2 = [];
        //             break;
        //         case "btnSupplierItemPrice":
        //             this.$refs.refSupplierItemPriceDialog.dialogIsShow = true;
        //             this.$refs.refSupplierItemPriceDialog.modelVal.txtSupplierPK =
        //                 this.modelMaster.SUPPLIER_PK;
        //             this.$refs.refSupplierItemPriceDialog.modelVal.txtSupplierNM =
        //                 this.modelMaster.SUPPLIER_NAME;
        //             break;
        //         case "btnPREntry":
        //             this.$refs.refPRDialog.dialogIsShow = true;
        //             break;
        //         case "btnStock":
        //             //  if (this.modelMaster.TAC_ABBUDGET_PK != "") {
        //             this.$refs.refCurrentStockDialog.dialogIsShow = true;
        //             //    this.$refs.refCurrentStockDialog.gw_Wh.value = this.modelMaster.TAC_ABBUDGET_PK;
        //             //   this.$refs.refCurrentStockDialog.gw_Wh.disabled = true;
        //             this.$refs.refCurrentStockDialog.gw_StockDate.disabled = true;
        //             this.$refs.refCurrentStockDialog.dataGrid1 = [];
        //             this.$refs.refCurrentStockDialog.dataGrid2 = [];
        //             // } else {
        //             //   this.$refs.alertDialog.showAlert(
        //             //     "error",
        //             //     "Error Occurs",
        //             //     "Please Select warehouse out first!"
        //             //   );
        //             // }

        //             /*this.dataGrid2.unshift({
        //                 _rowstatus: 'INSERT', PK: "", SEQ: (this.dataGrid2.length+1)
        //               })*/
        //             break;
        //         case "btnSaveDetail":
        //             this.objClick = "btnSaveDetail";
        //             this.$refs.confirmDialog.showConfirm(this.$t("do_you_want_save"));
        //             break;
        //         case "btnSearDetail":
        //             this.DSO_LG_5040075_2("select");
        //             //debugger;
        //             //this.searchDetail(this.modelMaster.PK);
        //             break;

        //         case "btnAddService":
        //             if (this._hasValue(this.modelMaster.PK)) {
        //                 this.$refs.refFreeItemServiceDialog.dialogIsShow = true;
        //                 this.$refs.refFreeItemServiceDialog.dataGrid1 = [];
        //                 this.$refs.refFreeItemServiceDialog.dataGrid2 = [];
        //             } else {
        //                 this.$refs.alertDialog.showAlert(
        //                     "warning",
        //                     "Error",
        //                     "please_save_master_infor_first"
        //                 );
        //                 return;
        //             }
        //             break;
        //         case "btnSaveService":
        //             if (this._hasValue(this.modelMaster.PK)) {
        //                 this.$refs.refGrdService.saveData();
        //             } else {
        //                 this.$refs.alertDialog.showAlert(
        //                     "warning",
        //                     "Error",
        //                     "please_save_master_infor_first"
        //                 );
        //                 return;
        //             }
        //             break;
        //         case "btnDelService":
        //             this.objClick = "btnDelService";
        //             this.$refs.confirmDialog.showConfirm(
        //                 this.$t("do_you_want_delete"),
        //                 "warning"
        //             );
        //             break;

        //         case "btnAgreeCF":
        //             if (this.objClick == "btnCalAmt") {
        //                 this.OnProcess("CAL-AMOUNT");
        //             } else if (
        //                 this.objClick == "btnSaveMaster" ||
        //                 this.objClick == "btnDelete"
        //             ) {
        //                 let action = "";
        //                 if (this.objClick == "btnSaveMaster") {
        //                     if (this.modelMaster.PK == "") {
        //                         this.modelMaster._rowstatus = "INSERT";
        //                         action = "insert";
        //                     } else {
        //                         this.modelMaster._rowstatus = "UPDATE";
        //                         action = "update";
        //                     }
        //                 } else {
        //                     this.modelMaster._rowstatus = "DELETE";
        //                     action = "delete";
        //                 }
        //                 this.onUpdMaster(action);
        //             } else if (this.objClick == "btnSaveDetail") {
        //                 /*
        //                   if(this.modelMaster.PK != ""){
        //                     //this.DSO_LG_5040075_1();
        //                     this.DSO_LG_5040075_2();
        //                   }else{
        //                     this.objClick = "btnSaveMaster";
        //                     this.onClickButton('btnAgreeCF');
        //                   }
        //                   */
        //                 this.objClick = "btnSaveMaster";
        //                 this.onClickButton("btnAgreeCF");
        //                 //this.DSO_LG_5040075_2();
        //             } else if (this.objClick == "btnSubmit") {
        //                 this.OnProcess("Submit");
        //             } else if (this.objClick == "btnCancel") {
        //                 this.OnProcess("Cancel");
        //             } else if (this.objClick == "btnDeleteDetail") {
        //                 this.onDeleteGridDetail();
        //             } else if (this.objClick == "btnDelService") {
        //                 this.$refs.refGrdService.deleteRows();
        //             }

        //             break;
        //     }
        // },

        onChangeField(obj) {
            switch (obj) {
                case "lstCompanySearch":
                    this.LG_SEL_3010050_BUDGET_BY_EMP([
                        this.user.THR_ABEMP_PK,
                        this.user.PK,
                        this.modelSearch.P_TCO_COMPANY_PK,
                    ]);
                    break;
            }
        },

        callBackLogisticCode(objData) { },

        callBackFreeItem(objData) {
            if (objData) {
                objData.forEach((item) => {
                    let insertRow = {};
                    insertRow.PK = this._uniqueID();
                    insertRow.SEQ = this.$refs.grdDetail.getDataSource().length + 1;
                    insertRow.REF_NO = "";
                    insertRow.REQ_ITEM_PK = "";
                    insertRow.REQ_ITEM_CODE = "";
                    insertRow.REQ_ITEM_NAME = "";
                    insertRow.PO_ITEM_PK = item.TLG_IT_ITEM_PK;
                    insertRow.PO_ITEM_CODE = item.ITEM_CODE;
                    insertRow.PO_ITEM_NAME = item.ITEM_NAME;
                    insertRow.PO_SPECIFICATION = "";
                    insertRow.REQ_QTY = "";
                    insertRow.REQ_UOM = "";
                    insertRow.PO_QTY = 1;
                    insertRow.PO_UOM = item.UOM;
                    insertRow.UNIT_PRICE = 0;
                    if (this.typeSite == "KPX") insertRow.GRP_NM = item.ITEMGRP_NAME;
                    insertRow.ORD_UOM = item.UOM;
                    insertRow.ORD_UNIT = 1;
                    insertRow.ORD_QTY = 1;
                    insertRow.ORD_UNIT_PRICE = 0;

                    insertRow.DISCOUNT_AMT = "";
                    insertRow.PO_AMT = 0;
                    insertRow.VAT_RATE = 0;
                    insertRow.VAT_AMOUNT = 0;
                    insertRow.OTHERS_EXPENSE = 0;
                    insertRow.TOTAL_AMT = 0;
                    insertRow.ETD_FROM = this.modelMaster.ETD_FROM;
                    insertRow.ETD_TO = this.modelMaster.ETD_TO;
                    insertRow.ETA_FROM = this.modelMaster.ETA_FROM;
                    insertRow.ETA_TO = this.modelMaster.ETA_TO;
                    insertRow.PO_STOCK_QTY = 0;
                    insertRow.PO_EXPECT_QTY = 0;
                    insertRow.DEPT_NAME = "";
                    insertRow.AC_NM = "";
                    insertRow.TAC_ABACCTCODE_PK = "";
                    insertRow.PL_NM = this.modelMaster.CENTER_NAME;
                    insertRow.TAC_ABPL_PK = this.modelMaster.TLG_CO_COST_CENTER_PK;
                    let tmp = JSON.parse(this.selectedBudget);
                    insertRow.BUDGET_NM = tmp.TEXT;
                    insertRow.TAC_ABBUDGET_PK = tmp.PK;
                    insertRow.DESCRIPTION = "";
                    insertRow.TLG_PO_PR_D_PK = "";
                    insertRow.PARENT_PK = "";
                    insertRow.TLG_PO_QUOTATION_M_PK = "";
                    insertRow.TLG_PO_PO_M_PK = this.modelMaster.PK;
                    insertRow._rowstatus = "i";
                    //insertRow.RowID = this.generateRowID();
                    //this.dataGrid2.unshift(insertRow);
                    this.$refs.grdDetail.addRowStruct(insertRow);
                });
            }
        },
        //============================================================
        callBackPREntry(objData) {
            let l_pr_no = "";
            let l_pr_pk = "";
            let l_abpl_pk = "";
            let l_dept_pk, l_deli_time_from, l_deli_time_to;
            let l_etd_from, l_etd_to;
            if (objData) {
                objData.forEach((item) => {
                    //get master infor
                    if (l_pr_pk != item.TLG_PO_PR_M_PK) {
                        l_pr_no = l_pr_no + item.PR_NO + ",";
                        l_pr_pk = item.TLG_PO_PR_M_PK;

                        l_abpl_pk = item.TAC_ABPL_PK;
                    }
                    l_dept_pk = item.TLG_PO_DEPT_PK;

                    l_deli_time_from = item.ETD_FROM_TIME;
                    l_deli_time_to = item.ETD_TO_TIME;
                    l_etd_from = item.ETD_FROM;
                    l_etd_to = item.ETD_TO;
                });

                this.modelMaster.REF_NO = l_pr_no.substring(0, l_pr_no.length - 1);

                if (this._hasValue(l_abpl_pk)) {
                    this.modelMaster.TLG_CO_COST_CENTER_PK = l_abpl_pk;
                }
                if (this._hasValue(l_dept_pk)) {
                    this.modelMaster.TAC_ABBUDGET_PK = l_dept_pk;
                    let idx = this.dataList.lstDept.findIndex((x) => x.PK === l_dept_pk);
                    if (idx >= 0) {
                        this.selectedBudget = this.dataList.lstDept[idx].MODEL;
                    }
                }
                if (this._hasValue(l_deli_time_from)) {
                    this.modelMaster.ETD_FROM_TIME = l_deli_time_from;
                }
                if (this._hasValue(l_deli_time_to)) {
                    this.modelMaster.ETD_TO_TIME = l_deli_time_to;
                }
                if (this._hasValue(l_etd_from)) {
                    this.modelMaster.ETD_FROM = l_etd_from;
                }
                if (this._hasValue(l_etd_to)) {
                    this.modelMaster.ETD_TO = l_etd_to;
                }

                objData.forEach((item) => {
                    let insertRow = {};
                    insertRow.PK = this._uniqueID();
                    insertRow.SEQ = this.$refs.grdDetail.getDataSource().length + 1;
                    insertRow.REF_NO = item.PR_NO + "-" + this.$refs.grdDetail.getDataSource().length + 1;
                    insertRow.REQ_ITEM_PK = item.TLG_IT_ITEM_PK;
                    insertRow.REQ_ITEM_CODE = item.ITEM_CODE;
                    insertRow.REQ_ITEM_NAME = item.ITEM_NAME;
                    insertRow.PO_ITEM_PK = item.TLG_IT_ITEM_PK;
                    insertRow.PO_ITEM_CODE = item.ITEM_CODE;
                    insertRow.PO_ITEM_NAME = item.ITEM_NAME;
                    insertRow.PO_SPECIFICATION = item.PR_SPECIFICATION;
                    insertRow.REQ_QTY = item.BAL_QTY;
                    insertRow.REQ_UOM = item.REQ_UOM;
                    insertRow.PO_QTY = item.BAL_QTY;
                    insertRow.PO_UOM = item.REQ_UOM;
                    insertRow.UNIT_PRICE = item.UNIT_PRICE;

                    insertRow.ORD_UOM = item.REQ_UOM;
                    insertRow.ORD_UNIT = 1;
                    insertRow.ORD_QTY = item.BAL_QTY;
                    insertRow.ORD_UNIT_PRICE = item.UNIT_PRICE;

                    insertRow.DISCOUNT_AMT = 0;
                    insertRow.PO_AMT = 0;
                    insertRow.VAT_RATE = Number(this.modelMaster.TAX_RATE);
                    insertRow.VAT_AMOUNT = 0;
                    insertRow.OTHERS_EXPENSE = 0;
                    insertRow.TOTAL_AMT = 0;
                    insertRow.ETD_FROM = this.modelMaster.ETD_FROM;
                    insertRow.ETD_TO = this.modelMaster.ETD_TO;
                    insertRow.ETA_FROM = this.modelMaster.ETA_FROM;
                    insertRow.ETA_TO = this.modelMaster.ETA_TO;
                    insertRow.PO_STOCK_QTY = 0;
                    insertRow.PO_EXPECT_QTY = 0;
                    insertRow.DEPT_NAME = item.DEPT_NAME;
                    insertRow.AC_NM = item.AC_NM;
                    insertRow.TAC_ABACCTCODE_PK = item.TAC_ABACCTCODE_PK;
                    // insertRow.PL_NM= this.modelMaster.CENTER_NAME;
                    // insertRow.TAC_ABPL_PK= this.modelMaster.TLG_CO_COST_CENTER_PK ;
                    insertRow.PL_NM = item.PL_NM;
                    insertRow.TAC_ABPL_PK = item.TAC_ABPL_PK;

                    // let tmp = JSON.parse(this.selectedBudget);

                    // insertRow.BUDGET_NM=tmp.TEXT;
                    // insertRow.TAC_ABBUDGET_PK= tmp.PK;

                    insertRow.BUDGET_NM = item.DEPT_NAME;
                    insertRow.TAC_ABBUDGET_PK = item.TLG_PO_DEPT_PK;

                    insertRow.DESCRIPTION = "";
                    insertRow.TLG_PO_PR_D_PK = item.TLG_PO_PR_D_PK;
                    insertRow.PARENT_PK = "";
                    insertRow.TLG_PO_QUOTATION_M_PK = "";
                    insertRow.TLG_PO_PO_M_PK = this.modelMaster.PK;

                    this.InputProcess(insertRow, "PO_QTY");
                    this.$refs.grdDetail.addRowStruct(insertRow);
                });
            }
        },

        returnSupplierItemPriceDialog(objData) {
            if (objData) {
                objData.forEach((item) => {
                    let insertRow = {};
                    insertRow.PK = this._uniqueID();
                    insertRow.SEQ = this.$refs.grdDetail.getDataSource().length + 1;
                    insertRow.REF_NO = "";
                    insertRow.REQ_ITEM_PK = "";
                    insertRow.REQ_ITEM_CODE = "";
                    insertRow.REQ_ITEM_NAME = "";
                    insertRow.PO_ITEM_PK = item.TLG_IT_ITEM_PK;
                    insertRow.PO_ITEM_CODE = item.ITEM_CODE;
                    insertRow.PO_ITEM_NAME = item.ITEM_NAME;
                    insertRow.PO_SPECIFICATION = "";
                    insertRow.REQ_QTY = "";
                    insertRow.REQ_UOM = "";
                    insertRow.PO_QTY = 0;
                    insertRow.PO_UOM = item.ORD_UOM;
                    insertRow.UNIT_PRICE = item.UNIT_PRICE;

                    insertRow.ORD_UOM = item.ORD_UOM;
                    insertRow.ORD_UNIT = 1;
                    insertRow.ORD_QTY = 1;
                    insertRow.ORD_UNIT_PRICE = item.UNIT_PRICE;

                    insertRow.DISCOUNT_AMT = "";
                    insertRow.PO_AMT = 0;
                    insertRow.VAT_RATE = 0;
                    insertRow.VAT_AMOUNT = 0;
                    insertRow.OTHERS_EXPENSE = 0;
                    insertRow.TOTAL_AMT = 0;
                    insertRow.ETD_FROM = this.modelMaster.ETD_FROM;
                    insertRow.ETD_TO = this.modelMaster.ETD_TO;
                    insertRow.ETA_FROM = this.modelMaster.ETA_FROM;
                    insertRow.ETA_TO = this.modelMaster.ETA_TO;
                    insertRow.PO_STOCK_QTY = 0;
                    insertRow.PO_EXPECT_QTY = 0;
                    insertRow.DEPT_NAME = "";
                    insertRow.AC_NM = "";
                    insertRow.TAC_ABACCTCODE_PK = "";
                    insertRow.PL_NM = this.modelMaster.CENTER_NAME;
                    insertRow.TAC_ABPL_PK = this.modelMaster.TLG_CO_COST_CENTER_PK;

                    let tmp = JSON.parse(this.selectedBudget);

                    insertRow.BUDGET_NM = tmp.TEXT;
                    insertRow.TAC_ABBUDGET_PK = tmp.PK;
                    insertRow.DESCRIPTION = "";
                    insertRow.TLG_PO_PR_D_PK = "";
                    insertRow.PARENT_PK = "";
                    insertRow.TLG_PO_QUOTATION_M_PK = "";
                    insertRow.TLG_PO_PO_M_PK = this.modelMaster.PK;
                    insertRow._rowstatus = "i";
                    //insertRow.RowID = this.generateRowID();
                    //this.dataGrid2.unshift(insertRow);
                    this.$refs.grdDetail.addRowStruct(insertRow);
                });
            }
        },
        callBackCurrentStock(objData) {
            if (objData) {
                objData.forEach((item) => {
                    let insertRow = {};
                    insertRow.PK = this._uniqueID();
                    insertRow.SEQ = this.$refs.grdDetail.getDataSource().length + 1;
                    insertRow.REF_NO = "";
                    insertRow.REQ_ITEM_PK = "";
                    insertRow.REQ_ITEM_CODE = "";
                    insertRow.REQ_ITEM_NAME = "";
                    insertRow.PO_ITEM_PK = item.TLG_IT_ITEM_PK;
                    insertRow.PO_ITEM_CODE = item.ITEM_CODE;
                    insertRow.PO_ITEM_NAME = item.ITEM_NAME;
                    insertRow.PO_SPECIFICATION = "";
                    insertRow.REQ_QTY = "";
                    insertRow.REQ_UOM = "";
                    insertRow.PO_QTY = item.STOCK_QTY;
                    insertRow.PO_UOM = item.UOM;
                    insertRow.UNIT_PRICE = 0;

                    insertRow.ORD_UOM = item.UOM;
                    insertRow.ORD_UNIT = 1;
                    insertRow.ORD_QTY = item.STOCK_QTY;
                    insertRow.ORD_UNIT_PRICE = 0;

                    insertRow.DISCOUNT_AMT = "";
                    insertRow.PO_AMT = 0;
                    insertRow.VAT_RATE = 0;
                    insertRow.VAT_AMOUNT = 0;
                    insertRow.OTHERS_EXPENSE = 0;
                    insertRow.TOTAL_AMT = 0;
                    insertRow.ETD_FROM = this.modelMaster.ETD_FROM;
                    insertRow.ETD_TO = this.modelMaster.ETD_TO;
                    insertRow.ETA_FROM = this.modelMaster.ETA_FROM;
                    insertRow.ETA_TO = this.modelMaster.ETA_TO;
                    insertRow.PO_STOCK_QTY = 0;
                    insertRow.PO_EXPECT_QTY = 0;
                    insertRow.DEPT_NAME = "";
                    insertRow.AC_NM = "";
                    insertRow.TAC_ABACCTCODE_PK = "";
                    insertRow.PL_NM = this.modelMaster.CENTER_NAME;
                    insertRow.TAC_ABPL_PK = this.modelMaster.TLG_CO_COST_CENTER_PK;

                    let tmp = JSON.parse(this.selectedBudget);
                    insertRow.BUDGET_NM = tmp.TEXT;

                    insertRow.TAC_ABBUDGET_PK = this.modelMaster.TAC_ABBUDGET_PK;
                    insertRow.DESCRIPTION = "";
                    insertRow.TLG_PO_PR_D_PK = "";
                    insertRow.PARENT_PK = "";
                    insertRow.TLG_PO_QUOTATION_M_PK = "";
                    insertRow.TLG_PO_PO_M_PK = this.modelMaster.PK;
                    insertRow._rowstatus = "i";
                    // insertRow.RowID = this.generateRowID();
                    this.$refs.grdDetail.addRowStruct(insertRow);
                });
            }
        },
        callBackPLCenter(objData) {
            if (objData) {
                switch (this.objClick) {
                    case "OUT_PL":
                        this.modelMaster.OUT_PL_PK = objData.PK;
                        this.modelMaster.OUT_PL = objData.CODE + " * " + objData.NAME;
                        break;
                    case "IN_PL":
                        this.modelMaster.IN_PL_PK = objData.PK;
                        this.modelMaster.IN_PL = objData.CODE + " * " + objData.NAME;
                        break;
                }
            }
        },
        callBackLocation(objData) {
            if (objData) {
                switch (this.objClick) {
                    case "grdDetail_Cell_LOC_IN":
                        this.$refs.grdDetail.instance.cellValue(
                            this.cellDblClickgrdDetail.rowIndex,
                            "TLG_IN_WHLOC_PK",
                            objData.TLG_IN_WHLOC_PK
                        );
                        this.$refs.grdDetail.instance.cellValue(
                            this.cellDblClickgrdDetail.rowIndex,
                            "LOC_ID",
                            objData.LOC_NAME
                        );
                        this.$refs.grdDetail.instance.saveEditData();
                        break;
                }
            }
        },

        async DSO_GRD_5040075(_param) {
            const dso = {
                type: "grid",
                selpro: "LG_SEL_5040075",
                para: _param,
            };
            this.dataGrid1 = await this._dsoCall(dso, "select", false);
        },

        hasValue(value) {
            if (typeof value == "number") return true;
            else if (value == null || value == undefined || value == "null")
                return false;

            if (typeof value == "object") {
                for (var i = 0; i < value.length; i++) {
                    if (value[i] == null || value[i] == undefined || value[i] == "null") {
                        return false;
                    }
                }
            } else if (typeof value == "string") {
                if (value == null || value == undefined || value == "null") {
                    return false;
                }
            }
            return true;
        },

        async LG_LST_5040075(_param) {
            const dso = {
                type: "list",
                selpro: "LG_LST_5040075",
                para: _param,
            };
            switch (_param[0]) {
                case "COMPANY":
                    this.dataList.lstCompany = await this._dsoCall(dso, "select", false);
                    //this.dataList.lstCompany.unshift({ CODEKEY: "", CODEDESC: "" });
                    if (this.dataList.lstCompany.length > 0) {
                        this.modelSearch.P_TCO_COMPANY_PK =
                            this.dataList.lstCompany[0]["CODEKEY"];
                    }
                    this.onChangeField("lstCompanySearch");
                    break;

                case "SLIPTYPE":
                    this.dataList.lstSlipType.length = 0;
                    this.dataList.lstSlipType = await this._dsoCall(dso, "select", false);
                    this.dataList.lstSlipType.unshift({
                        CODEKEY: "",
                        CODEDESC: ""
                    });
                    if (this.dataList.lstSlipType.length > 0) {
                        this.modelMaster.SLIP_TYPE = this.dataList.lstSlipType[0].CODEKEY;
                    }
                    if (this.isLoadData == "1") {
                        this.isLoadData = "0";
                        this.DSO_LG_5040075_1("select");
                        this.DSO_LG_5040075_2("select");
                    }
                    break;

                case "COST_CENTER":
                    this.dataList.lstCostCenter = await this._dsoCall(
                        dso,
                        "select",
                        false
                    );
                    this.dataList.lstCostCenter.unshift({
                        CODEKEY: "",
                        CODEDESC: ""
                    });
                    if (this.dataList.lstCostCenter.length > 0) {
                        this.modelMaster.TLG_CO_COST_CENTER_PK =
                            this.dataList.lstCostCenter[0].CODEKEY;
                    }
                    break;
            }
        },

        async onReport(PK, report_type, type_rpt = 0) {
            let p_param = [PK];
            let report_no = "01";
            let report_path = "";
            let report_name = "";
            let excel = [];
            let proc1 = "LG_RPT_SWPU030_2"
            switch (type_rpt) {
                case 1:
                    proc1 = "LG_RPT_3010050_3"
                    break;
                default:
                    proc1 = "LG_RPT_SWPU030_2"
                    break;
            }


            switch (report_no) {
                case "01": {
                    report_path = "report/30/10/rpt_swpu030_payment_list.xlsx";
                    report_name = "P_O_entry_" + parseInt(Math.random() * 1000) + "." + report_type;
                    excel = [
                        //sheet1
                        {
                            sheet: 1,
                            insertRange: [
                                { range: "A5:V19", proc: "LG_RPT_SWPU030_1", params: [...p_param], }, //header
                            ],
                            insertRows: [{ startRow: 15, proc: proc1, params: [...p_param], },],
                        },
                    ];

                    break;
                }

                default:
                    report_path = "";
                    break;
            }

            if (!report_path) {
                this.showNotification("danger", this.$t("please_select_report"), "", 4000);
                return;
            }

            const res = await this.$axios.$get("/dso/makereport", {
                responseType: "blob",
                params: {
                    template: report_path,
                    excel: JSON.stringify(excel),
                    convert: report_type,
                },
            });
            if (res) {
                this._ExcelSaveAs(res, report_name);
            } else {
                this.showNotification("danger", this.$t("fail_to_export_report"), "", 4000);
            }
        },
    },
};
</script>

<style>
.btn {
    min-width: 100px;
    min-height: 30px;
    max-width: 100px;
    max-height: 30px;
}
</style>
