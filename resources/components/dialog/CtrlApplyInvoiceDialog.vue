<template>
<v-dialog id="ctrl-apply-invoice-dialog" max-width="1000" v-model="dialogIsShow">
    <v-card>
        <v-card-title class="headline primary-gradient white--text py-2">
            <span>{{ $t("apply_invoice") }}</span>
            <v-spacer></v-spacer>
            <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
        </v-card-title>
        <v-container fluid class="pt-0" v-resize="onResize">
            <v-row no-gutters align="center" justify="space-between">
                <v-col cols="12">
                    <!-- Search Panel -->
                    <v-row dense align="center" justify="space-between">
                        <v-col cols="12">
                            <v-card outlined tile>
                                <v-container fluid>
                                    <v-row dense align="center">
                                        <v-col cols="5" class="pl-2">
                                            <v-select dense hide-details item-value="PK" item-text="TEXT" :label="$t('company')" :items="cbo_Company" v-model="sel_Company"></v-select>
                                        </v-col>
                                        <v-col cols="5" class=" pl-2 ">
                                            <v-text-field dense :readonly="false" hide-details :label="$t('partner')" v-model="txt_PARTNER_NM">
                                                <template v-slot:append>
                                                    <v-tooltip bottom>
                                                        <template v-slot:activator="{ on }">
                                                            <v-icon v-on="on" :color="currentTheme" @click="$refs.partnerDialog.dialogIsShow = true">mdi-window-restore</v-icon>
                                                        </template>
                                                    </v-tooltip>
                                                    <v-tooltip bottom>
                                                        <template v-slot:activator="{ on }">
                                                            <v-icon v-on="on" :color="currentTheme" @click="txt_PARTNER_CD = '', txt_PARTNER_NM = '', txt_PARTNER_PK = ''">mdi-eraser</v-icon>
                                                        </template>
                                                    </v-tooltip>
                                                </template>
                                            </v-text-field>
                                        </v-col>
                                        <v-col cols="2" class="pl-3">
                                            <div class="d-flex">
                                                <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="onSearch" />
                                            </div>
                                        </v-col>
                                    </v-row>
                                    <v-row dense align="center">
                                        <v-col cols="3">
                                            <v-row align="center" justify="space-between" no-gutters>
                                                <v-col md="6">
                                                    <v-text-field dense :readonly="false" hide-details validate-on-blur :label="$t('voucher_no')" v-model="txt_VOUCHER_NO" />
                                                </v-col>
                                                <v-col md="6" class="pl-2">
                                                    <v-text-field dense :readonly="false" hide-details validate-on-blur :label="$t('invoice_no')" v-model="txt_INVOICE_NO" />
                                                </v-col>
                                            </v-row>
                                        </v-col>
                                        <v-col cols="2" class="pl-2">
                                            <date-picker defaultType="today" :inputValue="date" :isClearable="true" :isDisabled="false" :label="$t('date')" @returnValue="dt_DATE = $event"></date-picker>
                                        </v-col>
                                        <v-col cols="5" class="pl-2">
                                            <v-text-field dense :readonly="true" hide-details validate-on-blur :label="$t('account_code')" v-model="txt_AC_NM">
                                                <template v-slot:append>
                                                    <v-tooltip bottom>
                                                        <template v-slot:activator="{ on }">
                                                            <v-icon v-on="on" :color="currentTheme" @click="$refs.accountDialog.dialogIsShow = true">mdi-window-restore</v-icon>
                                                        </template>
                                                    </v-tooltip>
                                                    <v-tooltip bottom>
                                                        <template v-slot:activator="{ on }">
                                                            <v-icon v-on="on" :color="currentTheme" @click="txt_AC_CD = '', txt_AC_NM = '', txt_AC_PK = ''">mdi-eraser</v-icon>
                                                        </template>
                                                    </v-tooltip>
                                                </template>
                                            </v-text-field>
                                        </v-col>
                                        <v-col cols="2" class="pl-3">
                                            <v-text-field dense :readonly="false" hide-details validate-on-blur :label="$t('ccy')" v-model="txt_Ccy"></v-text-field>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-card>
                        </v-col>
                    </v-row>
                    <!-- Table -->
                    <v-row dense align="center" justify="center">
                        <v-col cols="12" class="py-0">
                            <DataGridView ref="grid_data" :select_mode="multiSelectMode==true?'Multiple':'Single'" :max_height="limitHeight/(multiSelectMode==true?2:1)" @cellDblClick="onSelectSingle" @onSelectionChanged="onSelectionChanged" :filterRow="true" :header="[
                                        {dataField:'PARTNER_ID'    ,caption:$t('partner_id')     ,width:'100',  allowEditing: false,},
                                        {dataField:'PARTNER_NAME'  ,caption:$t('partner_name')   ,width:'100',  allowEditing: false,}, 
                                        {dataField:'VOUCHER_NO'    ,caption:$t('voucher_no')      ,width:'100',  allowEditing: false,},
                                        {dataField:'SERIAL_NO'     ,caption:$t('serial_no')      ,width:'100',  allowEditing: false,},
                                        {dataField:'INVOICE_DATE'  ,caption:$t('invoice_date')   ,width:'100',  allowEditing: false, dataType:'date' },
                                        {dataField:'INVOICE_NO'    ,caption:$t('invoice_no')     ,width:'100',  allowEditing: false,},
                                        {dataField:'CCY'           ,caption:$t('ccy')            ,width:'100',  allowEditing: false,},
                                        {dataField:'TR_RATE'       ,caption:$t('rate')            ,width:'100',  allowEditing: false,},
                                        {dataField:'END_TRANS_AMT' ,caption:$t('end_trans_amt')  ,width:'100',  allowEditing: false,  dataType: 'number', formatFloat: 2,  summaryType:'sum',},
                                        {dataField:'END_BOOKS_AMT' ,caption:$t('end_books_amt')  ,width:'100',  allowEditing: false,  dataType: 'number', formatFloat: 0,  summaryType:'sum',}
                                        ]" sel_procedure="AC_SEL_POP_APPLY_INVOICE" :filter_paras="[this.sel_Company, this.dt_DATE, this.txt_PARTNER_PK, this.txt_AC_PK, this.txt_Ccy, this.txt_INVOICE_NO, this.txt_VOUCHER_NO]" upd_procedure="AC_UPD_POP_APPLY_INVOICE" :update_paras="['TAC_HGARAP_TR_PK']" @setDataSource="afterSearch" />
                        </v-col>
                    </v-row>

                    <v-row dense v-if="multiSelectMode">
                        <v-col cols="12">
                            <v-row dense>
                                <v-col cols="8" />
                                <v-col cols="4">
                                    <div class="d-flex">
                                        <BaseButton icon_type="new" :btn_text="$t('addnew')" :disabled="isProcessing" @onclick="OnClick('ADD')" />
                                        <BaseButton icon_type="delete" :btn_text="$t('delete')" :disabled="isProcessing" @onclick="OnClick('DELETE')" />
                                        <BaseButton icon_type="confirm" :btn_text="$t('confirm')" :disabled="isProcessing" @onclick="OnClick('CONFIRM')" />
                                    </div>
                                </v-col>
                            </v-row>
                            <v-row dense align="center" justify="center">
                                <v-col cols="12" class="py-0">
                                    <DataGridView ref="grid_item" :select_mode="'Multiple'" :max_height="limitHeight/2-50" :filterRow="true" :header="[
                                        {dataField:'PARTNER_ID'    ,caption:$t('partner_id')     ,width:'100',  allowEditing: false,},
                                        {dataField:'PARTNER_NAME'  ,caption:$t('partner_name')   ,width:'100',  allowEditing: false,},
                                        {dataField:'VOUCHER_NO'    ,caption:$t('voucher_no')     ,width:'100',  allowEditing: false,},
                                        {dataField:'SERIAL_NO'     ,caption:$t('serial_no')      ,width:'100',  allowEditing: false,},
                                        {dataField:'INVOICE_DATE'  ,caption:$t('invoice_date')   ,width:'100',  allowEditing: false, dataType:'date' },
                                        {dataField:'INVOICE_NO'    ,caption:$t('invoice_no')     ,width:'100',  allowEditing: false,},
                                        {dataField:'CCY'           ,caption:$t('ccy')            ,width:'100',  allowEditing: false,},
                                        {dataField:'TR_RATE'       ,caption:$t('rate')           ,width:'100',  allowEditing: false,},
                                        {dataField:'END_TRANS_AMT' ,caption:$t('invoice_trans_amt')  ,width:'100',  allowEditing: false,  dataType: 'number', formatFloat: 2,  summaryType:'sum',},
                                        {dataField:'END_BOOKS_AMT' ,caption:$t('invoice_books_amt')  ,width:'100',  allowEditing: false,  dataType: 'number', formatFloat: 0,  summaryType:'sum',},
                                        {dataField:'TR_AMT' ,caption:$t('get_trans_amt')  ,width:'100',  allowEditing: true,  dataType: 'number', formatFloat: 2,  summaryType:'sum',
                                         setCellValue(newData, value, currentRowData) {
                                             newData.TR_AMT = value;
                                             if(Number(value) > Number(currentRowData.END_TRANS_AMT))
                                             {
                                                 newData.TR_AMT = currentRowData.END_TRANS_AMT;
                                             }
                                            newData.BK_AMT = ((newData.TR_AMT * currentRowData.TR_RATE) / currentRowData.BK_RATE).toFixed(0); 
                                            newData.GAP_BOOKS_AMT = ((newData.TR_AMT * currentRowData.TR_RATE) / currentRowData.BK_RATE).toFixed(0); 
                                         }},
                                        {dataField:'BK_AMT' ,caption:$t('get_books_amt')  ,width:'100',  allowEditing: false,  dataType: 'number', formatFloat: 0,  summaryType:'sum',},
                                        {dataField:'GAP_BOOKS_AMT' ,caption:$t('gap_books_amt')  ,width:'100',  allowEditing: false,  dataType: 'number', formatFloat: 0,  summaryType:'sum',}
                                        ]" sel_procedure="AC_SEL_POP_APPLY_INVOICE_ITEM" :filter_paras="[this.sel_Company, this.dt_DATE, this.txt_PARTNER_PK, this.txt_AC_PK, this.txt_Ccy, this.txt_INVOICE_NO, this.txt_VOUCHER_NO]" upd_procedure="AC_UPD_POP_APPLY_INVOICE" :update_paras="['TAC_HGARAP_TR_PK']" />
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
            <partner-dialog ref="partnerDialog" @callBackData="handleReturnedPartner" :companyPK="sel_Company" />
            <account-dialog ref="accountDialog" :multiSelectMode="multisel" @returnAccountInfo="mappingAccount"></account-dialog>
        </v-container>
    </v-card>
</v-dialog>
</template>

<!-- ================================================================= END DESIGN LAYOUT & BEGIN SCRIPT ========================================================================= --> 

<script>
/*==================================================================== BEGIN IMPORT COMPONENT ======================================================================================*/
import DynamicDialog from "@/components/dialog/DynamicDialog";
import DatePicker from '@/components/control/DatePicker';
import PartnerDialog from "@/components/dialog/PartnerDialog";
import accountDialog from "@/components/dialog/AccountDialog";
/*==================================================================== END IMPORT COMPONENT & BEGIN export default==================================================================*/
export default {
    /*############### DEFAULT #######################*/
    name: "ctrl-apply-invoice-dialog",
    props: {
        multiSelectMode: {
            type: Boolean,
            default: false,
        },
        multiSelectMode: {
            type: Boolean,
            default: false,
        },
        company: {
            type: [Number, String],
            default: 0
        },
        partnerItem: {
            type:  [Array,Object],
            default: null
        },
        accountItem: {
            type:  [Array,Object],
            default: null
        },
        descriptionItem: {
            type: [Array,Object],
            default: null
        },
        ccy: {
            type: String,
            default: "VND",
        },
        date: {
            type: String,
            default: "",
        }
    },

    // props: ["multiSelectMode", "company", "partnerItem", "accountItem", "ccy", "date"],
    /*############### components ####################*/
    components: {
        DynamicDialog,
        DatePicker,
        PartnerDialog,
        accountDialog
    },
    /*############### data ##########################*/
    data: () => ({
        dialogIsShow: false,
        dxg_data: [],
        cbo_Company: [],
        sel_Company: "",
        txt_Ccy: "",

        txt_PARTNER_CD: "",
        txt_PARTNER_NM: "",
        txt_PARTNER_PK: "",

        txt_VOUCHER_NO: "", 
        txt_INVOICE_NO: "",
        dt_DATE: "",

        txt_AC_NM: "",
        txt_AC_CD: "",
        txt_AC_PK: "",
        multisel: false,
        actionType: "",
    }),
    watch: {
        dialogIsShow(val) {
            //console.log(val)
            if (val === true) {
                this.txt_AC_PK = this.accountItem.PK;
                if (this.ccy == "" || this.ccy == null || this.ccy == undefined || this.ccy == "null") {
                    this.txt_Ccy = "VND";
                } else {
                    this.txt_Ccy = this.ccy;
                }
                this.txt_AC_NM = `${this.accountItem.CODE} - ${this.accountItem.NAME}`;
                this.txt_AC_CD = `${this.accountItem.CODE}`;
                this.txt_PARTNER_CD = `${this.partnerItem.CODE}`;
                this.txt_PARTNER_NM = `${this.partnerItem.CODE} - ${this.partnerItem.NAME}`;
                this.txt_PARTNER_PK = `${this.partnerItem.PK}`;
                this.dt_DATE = this.date;
                this.sel_Company = this.company == 0 ? this.user.TCO_COMPANY_PK : this.company;
                if (this.$refs.grid_data)
                    this.$refs.grid_data.setDataSource([]);
            }
        }

    },
    created() {
        this.sel_Company = this.company = 0 ? this.user.TCO_COMPANY_PK : this.company;
        this.getCompanyList();
    },
    computed: {
        user() {
            return this.$store.getters["auth/user"];
        },
        limitHeight() {
            return this.windowHeight - 320;
        },
    },
    mounted() {

    },
    methods: {
        async getCompanyList() {
            const dso = {
                type: "list",
                selpro: "sys_sel_list_company",
                para: [this.user.PK]
            };
            const result = await this._dsoCall(dso, "select", false);
            if (result) {
                this.cbo_Company = result;
            } else {
                this.cbo_Company = [];
            }
        },
        handleReturnedPartner(data) {
            this.txt_PARTNER_NM = `${data.PARTNER_ID} - ${data.PARTNER_NAME}`;
            this.txt_PARTNER_CD = `${data.PARTNER_ID}`;
            this.txt_PARTNER_PK = `${data.PK}`;
        },
        mappingAccount(item) {
            this.txt_AC_NM = item.AC_CD + " - " + item.AC_NM;
            this.txt_AC_CD = item.AC_CD;
            this.txt_AC_PK = item.PK;
        },
        async onSearch() {
            this.$refs.grid_data.loadData();
            //   let dso = {
            //       type: "grid",
            //       selpro: "AC_SEL_POP_APPLY_INVOICE",
            //       para: [this.sel_Company, this.dt_DATE, this.txt_PARTNER_PK, this.txt_AC_PK, this.txt_Ccy, this.txt_INVOICE_NO]
            //   };
            //   let result = await this._dsoCall(dso, "select", false);
            //   if (result) {
            //       this.dxg_data = result;
            //   } else {
            //       this.dxg_data = [];
            //   }
        },

        onSelectionChanged({
            selectedRowsData
        }) {
            this.selectedDatas = selectedRowsData;
        },

        onSelectSingle({
            data
        }) {
            this.onSelectMultiple();
        },
        onSelectMultiple() {
            let rtn_data = this.multiSelectMode ?
                this.selectedDatas :
                this.selectedDatas[0];
            this.returnApplyInvoiceInfo(rtn_data);
        },
        returnApplyInvoiceInfo(datas) {
            this.$emit("returnApplyInvoiceInfo", datas);
            this.dialogIsShow = false;
        },
        _format_amt({
            value
        }) {
            return `${this._formatNumber(value, 0)}`;
        },
        OnClick(obj) {
            this.actionType = obj;
            switch (obj) {
                case "ADD":
                    const data = this.selectedDatas;
                    data.forEach(e => {
                        e._rowstatus = 'U';
                    });
                    this.$refs.grid_data.saveData()
                    break;
                case "DELETE":
                    this.$refs.grid_item.deleteRows();
                    this.$refs.grid_item.saveData()
                    break;
                case "CONFIRM":
                    this.$refs.grid_item.saveData()
                    break;
            }
        },
        afterSearch() {
            if (this.$refs.grid_item)
                this.$refs.grid_item.loadData();
        },
        // aftersaveItem(data) {
        //     if (data) { 
        //         this.$refs.grid_data.loadData();
        //     }
        // }
    },
};
</script>
