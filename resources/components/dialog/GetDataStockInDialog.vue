<template>
<div>
    <v-dialog id="get-stock-in-dialog" max-width="1200" v-model="dialogIsShow">
        <v-card>
            <v-card-title class="headline primary-gradient white--text py-2">{{ $t('get stock in') }}</v-card-title>
            <v-card-text class="pa-0">
                <v-container>
                    <v-row dense>
                        <v-col cols="3" class="pl-5">
                            <BaseInput :label="$t('slip_no')" v-model="txtSlip_No" />
                        </v-col>
                        <v-col cols="3">
                            <v-row align="center" justify="space-between" no-gutters>
                                <v-col md="6">
                                    <BaseDatePicker :label="$t('stock_fr_date')" v-model="stock_fr_date" start/>
                                </v-col>
                                <v-col md="6" class="pl-2">
                                    <BaseDatePicker :label="$t('stock_to_date')" v-model="stock_to_date" default/>
                                </v-col>
                            </v-row>
                        </v-col>
                        <v-col cols="3" class="pl-2">
                            <BaseInput :label="$t('vendor')" v-model="txtVendor_NM" @dblClick="openPartnerDialog()" mandatory :clearable="false">
                                <template v-slot:append>
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on }">
                                            <v-icon v-on="on" :color="currentTheme" @click="openPartnerDialog()">mdi-window-restore</v-icon>
                                        </template>
                                    </v-tooltip>
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on }">
                                            <v-icon v-on="on" :color="currentTheme" @click="txtVendor_NM='',txtVendor_PK=''">mdi-eraser</v-icon>
                                        </template>
                                    </v-tooltip>
                                </template>
                            </BaseInput>
                        </v-col>
                        <v-col cols="1">
                            <BaseCheckbox :label="$t('checkuser')" true-value="Y" false-value="N" v-model="chkUser" />
                        </v-col>
                        <v-col cols="2">
                            <div class="d-flex">
                                <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="onClickButton('btnSearch')" />
                            </div>
                        </v-col>
                    </v-row>
                    <v-row dense>
                        <v-col cols="3" class="pl-5">
                            <BaseInput :label="$t('item')" v-model="txtItem"/>
                        </v-col>
                        <v-col cols="3" class="pl-2">
                            <BaseInput :label="$t('po_no')" v-model="txtPO_No"/> 
                        </v-col>
                        <v-col cols="3" class="pl-2">
                            <BaseInput :label="$t('ref_no')" v-model="txtRef_No"/>
                        </v-col>
                    </v-row>
                    <v-row dense>
                        <v-col cols="12" class="pt-0">
                            <DataGridView ref="grdMst" :header="grdMstHeader" sel_procedure="AC_SEL_GETST_IN_MST" select_mode="Multiple" :filter_paras="[
                                this.selectedCompany,  
                                this.txtSlip_No,  
                                this.stock_fr_date,  
                                this.stock_to_date,  
                                this.txtVendor_PK,  
                                this.txtPO_No,
                                this.txtItem, 
                                this.txtRef_No, 
                            ]" :is_allow_paste="false" :max_height="limitHeightGrd1"/>
                        </v-col>
                    </v-row>
                    <v-row dense>
                        <v-col cols="2" class="pt-0">
                        </v-col>
                        <v-col cols="2" class="pt-0">
                            <v-text-field v-show="false" v-model="txtTac_Crda_Other_PK"></v-text-field>
                        </v-col>
                        <v-col cols="2" class="pt-0">
                            <v-text-field dense hide-details :label="$t('total_trans')" v-model="txtTotal_Trans"></v-text-field>
                        </v-col>
                        <v-col cols="2" class="pt-0">
                            <v-text-field dense hide-details :label="$t('total_book')" v-model="txtTotal_Book"></v-text-field>
                        </v-col>
                        <v-col cols="2">
                            <div class="d-flex">
                                <BaseButton icon_type="copy" :btn_text="$t('copy')" :disabled="isProcessing" @onclick="onClickButton('btnCopy')" />
                                <BaseButton icon_type="save" :btn_text="$t('save')" :disabled="isProcessing" @onclick="onClickButton('btnSave')" />
                                <BaseButton icon_type="delete" :btn_text="$t('delete')" :disabled="isProcessing" @onclick="onClickButton('btnDelete')" />
                                <BaseButton icon_type="select" :btn_text="$t('select')" :disabled="isProcessing" @onclick="onClickButton('btnGetItemStock')" />
                                <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="onClickButton('btnSearch_Details')" />
                            </div>
                        </v-col>
                    </v-row>
                    <v-row dense align="start" justify="center">
                        <v-col cols="12" class="pt-0">
                            <DataGridView ref="grdDtl" :header="grdDtlHeader" sel_procedure="AC_SEL_GETST_IN_DTL" upd_procedure="AC_UPD_AP_MATTAKEIND" select_mode="Multiple" :filter_paras="[
                                this.selectedCompany,  
                                this.txtSlip_No,  
                                this.stock_fr_date,  
                                this.stock_to_date,  
                                this.txtVendor_PK,  
                                this.txtPO_No,
                                this.txtItem, 
                                this.txtRef_No, 
                            ]" :update_paras="[
                                'TLG_IN_STOCKTR_PK' ,
                                'UNIT_PRICE',
                                'INPUT_QTY',
                                'CCY',
                                'INV_AMOUNT',
                                'TAC_MATTAKEIN_AP_PK',
                                'TRANS_PK'
                              ]" :is_allow_paste="false" :max_height="limitHeightGrd1"/>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>
        </v-card>
    </v-dialog>
    <alert-dialog ref="alertDialog"></alert-dialog>
    <partner-dialog ref="partnerDialog" @callBackData="mappingPartner"></partner-dialog>
</div>
</template>

<script>
import CellGridTextField from '@/components/table/CellGridTextField'
import AlertDialog from '@/components/dialog/AlertDialog'

export default {
    name: 'get-stock-in-dialog',
    props: ["dialogInfo", "vendorPK", "vendorNM", "companyPK"],
    components: {
        CellGridTextField,
        AlertDialog,
        partnerDialog: () => import("@/components/dialog/PartnerDialog"),
        datePicker: () => import("@/components/control/DatePicker"),
    },
    data: () => ({
        dialogIsShow: false,
        dataList: {
            lstItemGrp: [],
            lstBOMLeaf: []
        },
        MasterItem: [],
        DetailsItem: [],
        txtSlip_No: '',
        txtVendor_NM: '',
        txtVendor_PK: '',
        chkAuto: 'N',
        chkUser: 'Y',
        txtTotal_Trans: '',
        txtTotal_Book: '',
        btnSelect: '',
        selectedCompany :'',
        stock_fr_date: '',
        stock_to_date: '',
        txtPO_No : '',
        txtItem : '',
        txtRef_No : '',
        multiSelectMode: true,
        txtTac_Crda_Other_PK: '',
        selectedRowKeys_M: [],
        selectedRowKeys_D: []
    }),
    watch: {
        dialogIsShow(val) {
            if (val === false) {
                this.$emit('onCloseDialog')
            } else {
                this.txtVendor_NM = this.vendorNM;
                this.txtVendor_PK = this.vendorPK;
                this.selectedCompany = this.companyPK;
            }
        },
        txtVendor_NM(val) {
            if (!val) {
                this.txtVendor_PK = '';
            }
        },
    },
    async created() {
        this.companyList = await this._getCompanyByUser(this.user.PK);
        // this.selectedCompany =
        //     this.user.TCO_COMPANY_PK > 0 ?
        //     this.user.TCO_COMPANY_PK :
        //     this.companyList[0].PK;
    },
    mounted() {

    },

    computed: {
        user() {
            return this.$store.getters["auth/user"]
        },
        limitHeightGrd1() {
            return 200
        },
        limitHeightGrd2() {
            return 200
        },
        grdMstHeader() {
            self = this;
            const head1 = [{
                    dataField: "TLG_IN_STOCKTR_PK",
                    caption: this.$t("pk"),
                    width: "auto",
                    allowEditing: false,
                    visible: false
                },
                {
                    dataField: "SLIP_NO",
                    caption: this.$t("slip_no"),
                    width: "auto",
                    allowEditing: false,
                },
                {
                    dataField: "ITEM_CODE",
                    caption: this.$t("item_code"),
                    width: "auto",
                    allowEditing: false,
                },
                {
                    dataField: "ITEM_NAME",
                    caption: this.$t("item_nm"),
                    width: "auto",
                    allowEditing: false,
                },
                {
                    dataField: "UOM",
                    caption: this.$t("uom"),
                    width: "auto",
                    allowEditing: false,
                },
                {
                    dataField: "PARTNER_LNAME",
                    caption: this.$t("vendor"),
                    width: "auto",
                    allowEditing: false,
                },
                {
                    dataField: "UNIT_PRICE",
                    caption: this.$t("unit_price"),
                    dataType: 'number',
                    formatFloat: 0,
                    allowEditing: true,
                },
                {
                    dataField: "INPUT_QTY",
                    caption: this.$t("takein_qty"),
                    dataType: 'number',
                    formatFloat: 0,
                    allowEditing: true,
                },
                {
                    dataField: "LOAD_QTY",
                    caption: this.$t("loaded_qty"),
                    dataType: 'number',
                    formatFloat: 0,
                    allowEditing: true,
                },
                {
                    dataField: "DIFF",
                    caption: this.$t("balance"),
                    dataType: 'number',
                    formatFloat: 0,
                    allowEditing: true,
                },
                {
                    dataField: "INV_QTY",
                    caption: this.$t("inv_qty"),
                    dataType: 'number',
                    formatFloat: 0,
                    allowEditing: true,
                },
                {
                    dataField: "PO_NO",
                    caption: this.$t("po_no"),
                    dataType: 'number',
                    formatFloat: 0,
                    allowEditing: true,
                },
                {
                    dataField: "CCY",
                    caption: this.$t("ccy"),
                    width: "auto",
                    allowEditing: false,
                },
                {
                    dataField: "INV_AMOUNT",
                    caption: this.$t("trans_amt"),
                    dataType: 'number',
                    formatFloat: 0,
                    allowEditing: true,
                },
                {
                    dataField: "AC_CD",
                    caption: this.$t("acc_cd"),
                    width: "auto",
                    allowEditing: false,
                },
                {
                    dataField: "AC_NM",
                    caption: this.$t("acc_nm"),
                    width: "auto",
                    allowEditing: false,
                },
                {
                    dataField: "WH_NAME",
                    caption: this.$t("wh"),
                    width: "auto",
                    allowEditing: false,
                },
                {
                    dataField: "PL_CD",
                    caption: this.$t("pl_cd"),
                    width: "auto",
                    allowEditing: false,
                },
                {
                    dataField: "PL_NM",
                    caption: this.$t("pl_nm"),
                    width: "auto",
                    allowEditing: false,
                },
                {
                    dataField: "IN_DATE",
                    caption: this.$t("date"),
                    dataType: "date",
                    format: this.curLang.DATE_FORMAT,
                    width: "auto",
                    allowEditing: false,
                },
                {
                    dataField: "VAT_RATE",
                    caption: this.$t("vat_rate"),
                    dataType: 'number',
                    formatFloat: 0,
                    allowEditing: true,
                },
                {
                    dataField: "VAT_AMOUT",
                    caption: this.$t("vat_amt"),
                    dataType: 'number',
                    formatFloat: 0,
                    allowEditing: true,
                },
                {
                    dataField: "TRANS_PK",
                    caption: this.$t("trans_pk"),
                    allowEditing: true,
                },
            ];
            return head1;
        },
        grdDtlHeader() {
            self = this;
            const head1 = [{
                    dataField: "TLG_IN_STOCKTR_PK",
                    caption: this.$t("pk"),
                    width: "auto",
                    allowEditing: false,
                    visible: false
                },
                {
                    dataField: "SLIP_NO",
                    caption: this.$t("slip_no"),
                    width: "auto",
                    allowEditing: false,
                },
                {
                    dataField: "ITEM_CODE",
                    caption: this.$t("item_code"),
                    width: "auto",
                    allowEditing: false,
                },
                {
                    dataField: "ITEM_NAME",
                    caption: this.$t("item_nm"),
                    width: "auto",
                    allowEditing: false,
                },
                {
                    dataField: "UOM",
                    caption: this.$t("uom"),
                    width: "auto",
                    allowEditing: false,
                },
                {
                    dataField: "PARTNER_LNAME",
                    caption: this.$t("vendor"),
                    width: "auto",
                    allowEditing: false,
                },
                {
                    dataField: "UNIT_PRICE",
                    caption: this.$t("unit_price"),
                    dataType: 'number',
                    formatFloat: 0,
                    allowEditing: true,
                },
                {
                    dataField: "DIFF",
                    caption: this.$t("balance"),
                    dataType: 'number',
                    formatFloat: 0,
                    allowEditing: true,
                },
                {
                    dataField: "INV_QTY",
                    caption: this.$t("inv_qty"),
                    dataType: 'number',
                    formatFloat: 0,
                    allowEditing: true,
                },
                {
                    dataField: "PO_NO",
                    caption: this.$t("po_no"),
                    dataType: 'number',
                    formatFloat: 0,
                    allowEditing: true,
                },
                {
                    dataField: "CCY",
                    caption: this.$t("ccy"),
                    width: "auto",
                    allowEditing: false,
                },
                {
                    dataField: "INV_AMOUNT",
                    caption: this.$t("trans_amt"),
                    dataType: 'number',
                    formatFloat: 0,
                    allowEditing: true,
                },
                {
                    dataField: "AC_CD",
                    caption: this.$t("acc_cd"),
                    width: "auto",
                    allowEditing: false,
                },
                {
                    dataField: "AC_NM",
                    caption: this.$t("acc_nm"),
                    width: "auto",
                    allowEditing: false,
                },
                {
                    dataField: "WH_NAME",
                    caption: this.$t("wh"),
                    width: "auto",
                    allowEditing: false,
                },
                {
                    dataField: "PL_CD",
                    caption: this.$t("pl_cd"),
                    width: "auto",
                    allowEditing: false,
                },
                {
                    dataField: "PL_NM",
                    caption: this.$t("pl_nm"),
                    width: "auto",
                    allowEditing: false,
                },
                {
                    dataField: "IN_DATE",
                    caption: this.$t("date"),
                    dataType: "date",
                    format: this.curLang.DATE_FORMAT,
                    width: "auto",
                    allowEditing: false,
                },
                {
                    dataField: "VAT_RATE",
                    caption: this.$t("vat_rate"),
                    dataType: 'number',
                    formatFloat: 0,
                    allowEditing: true,
                },
                {
                    dataField: "VAT_AMOUT",
                    caption: this.$t("vat_amt"),
                    dataType: 'number',
                    formatFloat: 0,
                    allowEditing: true,
                },
                {
                    dataField: "TRANS_PK",
                    caption: this.$t("trans_pk"),
                    allowEditing: true,
                },
            ];
            return head1;
        },
    },
    methods: {
        async onClickButton(obj) {
            switch (obj) {
                case 'btnSearch':
                    this.$refs.grdMst.loadData();
                    break;
                case 'btnSearch_Details':
                    this.$refs.grdDtl.loadData();
                    break;
                case 'btnCopy':
                    var p_index = 0;
                    var i;
                    let rowDataMst = this.$refs.grdMst.getSelectRowsData();
                    console.log(rowDataMst);
                    for (i = 0; i < rowDataMst.length; i++) {
                        p_index = p_index + 1;
                        const dso = {
                            type: "process",
                            updpro: "AC_UPD_AP_MATTAKEIND",
                            para: ["i", rowDataMst[i].TLG_IN_STOCKTR_PK, rowDataMst[i].UNIT_PRICE, rowDataMst[i].INV_QTY, rowDataMst[i].CCY, rowDataMst[i].INV_AMOUNT, rowDataMst[i].TAC_MATTAKEIN_AP_PK, rowDataMst[i].TRANS_PK]
                        };
                        const result = await this._dsoCall(dso, "process", false);
                    }
                    if(p_index > 0){
                        this.$refs.grdDtl.loadData();
                    }
                    break; 
                case 'btnSave':
                    this.$refs.grdDtl.saveData();
                    setTimeout(() => {
                        this.$refs.grdDtl.loadData();
                    }, 2000);
                    break; 
                case 'btnDelete':
                    this.$refs.grdDtl.deleteRows();
                    setTimeout(() => {
                        this.$refs.grdDtl.loadData();
                    }, 2000);
                    break; 
                case 'btnGetItemStock':
                    let itemArrAdd = this.$refs.grdDtl.getSelectRowsData();
                    console.log(itemArrAdd);
                    this.callBackData(itemArrAdd); 
                    break;
                case 'btnRemoveItemStock':
                    this.$refs.grdDtl.deleteRows();
                    break;
            }
        },
        openPartnerDialog() {
            this.$refs.partnerDialog.dialogIsShow = true;
        },
        mappingPartner(item) {
            this.txtVendor_NM = item.PARTNER_ID + " - " + item.PARTNER_NAME;
            this.txtVendor_PK = item.PK;
        },
        callBackData(_data) {
            this.$emit("callBackData", _data);
            this.dialogIsShow = false;
        },
        calculateCellExtPrice() {
            this.txtTotal_Trans = 0
            this.txtTotal_Book = 0
            for (let i = 0; i < this.DetailsItem.length; i++) {
                this.txtTotal_Trans = this.DetailsItem[i].AP_TRFAMT + this.txtTotal_Trans
                this.txtTotal_Book = this.DetailsItem[i].AP_TRAMT + this.txtTotal_Book
            }
            this.txtTotal_Trans = this._formatNumber(this.txtTotal_Trans, 2);
            this.txtTotal_Book = this._formatNumber(this.txtTotal_Book, 0);
        },
    }
}
</script>

<style>
.btn {
    min-width: 100px;
    min-height: 30px;
    max-width: 100px;
    max-height: 30px;
}
</style>
