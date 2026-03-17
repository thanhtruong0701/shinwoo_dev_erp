<template>
<v-container fluid class="pa-0">
    <v-row no-gutters>
        <v-col cols="12">
            <!-- Data Table -->
            <v-row align="center" justify="center">
                <v-col cols="12" class="py-0">
                    <v-card outlined tile v-resize="onResize">
                        <v-col cols="12">
                            <DataGridView ref="grdAccount" 
                                :header="leftHeader" sel_procedure="SW_SEL_SW10200_ORDER_ENTRY" select_mode="Multiple" :filter_paras="searchParams" 
                                upd_procedure="SW_UPD_SW10200_ORDER_ENTRY" 
                                :update_paras="['PK', 'STT', 'RECEIVED_ORDER_DATE', 'BUYER_NAME', 'ITEMS', 'TOTAL_QTY', 'QTY_SW', 'QTY_OUTSOURCE', 'UNIT_PRICE_VND', 'UNIT_PRICE_USD', 'TOTAL_VND', 'TOTAL_USD','COMPANY_CODE','IMPORT_DATE']" 
                                :is_allow_paste="false" :max_height="limitHeight" @openpopup="openAccountDialog" @row-updated="checkUpdatedItem" 
                                :id="'idGrid'"  :customTables="['TAC_HGMMBAL','TAC_ABACCTCODE']" :menu_cd="'6045020'" 
                            />
                        </v-col> 
                        <!-- allow-save-custom -->

                    </v-card>
                </v-col>
            </v-row>
        </v-col>
    </v-row>
    <account-dialog ref="accountDialog" @returnAccountInfo="mappingAccount"></account-dialog>
</v-container>
</template>

<script>
import AccountDialog from "@/components/dialog/AccountDialog";
import Editor from 'devextreme/ui/editor/editor';

export default {
    DataGridView: () => import("@/components/control/DataGridView"),
    layout: "default",
    middleware: "user",
    props: ["searchParams", "selectedCompany"],

    components: {
        AccountDialog
    },

    data: () => ({
        defaultParas: null,
        //colunm list
        lstCCY: [],
        // Table Data
        acountList: [],
        selectedItemKeys: [],

        // Delete
        deleteDialog: false,
        deleteProps: [],

        // Employee Dialog
        selectedAccount: "",
        columnHeaders: [],
        txtBookCcy: "VND",
        multiSelectMode: false,
    }),
    async mounted() {
        this.getCurrency();
        //this.txtBookCcy = this.defaultParas.BOOK_CCY;
        console.log(this.defaultParas);
    },
    computed: {
        user() {
            return this.$store.getters["auth/user"];
        },
        limitHeight() {
            return this.windowHeight - 300;
        },
        passwordConfirmationRule() {
            if (this.password === this.confirmPassword) {
                return true;
            }
            return this.$t("confirm_pass_not_match", "common");
        },
			   
        leftHeader() {
            let header = [{
                    dataField: "PK",
                    caption: this.$t("PK"),
                    width: "auto",
                    editable: false,
                    cellTemplate: "popup",
                },
                {
                    dataField: "STT",
                    caption: this.$t("STT"),
                    width: "auto",
                    editable: false,
                    cellTemplate: "popup",
                },
                {
                    dataField: "RECEIVED_ORDER_DATE",
                    caption: this.$t("RECEIVED_ORDER_DATE"),
                    width: "auto",
                    editable: false,
                    cellTemplate: "popup",
                },
				{
                    dataField: "BUYER_NAME",
                    caption: this.$t("BUYER_NAME"),
                    width: "auto",
                    editable: false,
                    cellTemplate: "popup",
                },
				{
                    dataField: "ITEMS",
                    caption: this.$t("ITEMS"),
                    width: "auto",
                    editable: false,
                    cellTemplate: "popup",
                },
				{
                    dataField: "TOTAL_QTY",
                    caption: this.$t("TOTAL_QTY"),
                    width: "auto",
                    editable: false,
                    cellTemplate: "popup",
                },
				{
                    dataField: "QTY_SW",
                    caption: this.$t("QTY_SW"),
                    width: "auto",
                    editable: false,
                    cellTemplate: "popup",
                },
				{
                    dataField: "QTY_OUTSOURCE",
                    caption: this.$t("QTY_OUTSOURCE"),
                    width: "auto",
                    editable: false,
                    cellTemplate: "popup",
                }, 
				{
                    dataField: "UNIT_PRICE_VND",
                    caption: this.$t("UNIT_PRICE_VND"),
                    width: "auto",
                    editable: false,
                    cellTemplate: "popup",
                },
				{
                    dataField: "UNIT_PRICE_USD",
                    caption: this.$t("UNIT_PRICE_USD"),
                    width: "auto",
                    editable: false,
                    cellTemplate: "popup",
                },
				
                {
                    dataField: "TOTAL_VND",
                    caption: this.$t("TOTAL_VND"),
                    width: "auto",
                    dataType: 'number',
                    formatFloat: this.txtBookCcy == 'VND' ? 0  : 2,
                    editable: true
                },
				{
                    dataField: "TOTAL_USD",
                    caption: this.$t("TOTAL_USD"),
                    width: "auto",
                    dataType: 'number',
                    formatFloat: this.txtBookCcy == 'VND' ? 0  : 2,
                    editable: true
                },
				{
                    dataField: "COMPANY_CODE",
                    caption: this.$t("COMPANY_CODE"),
                    width: "auto",
                    editable: false,
                    cellTemplate: "popup",
                },
				{
                    dataField: "IMPORT_DATE",
                    caption: this.$t("IMPORT_DATE"),
                    width: "auto",
                    editable: false,
                    cellTemplate: "popup",
                },
            ];
            return header;
        },
    },
    methods: {
        async getCurrency() {
            const commoncode = await this._getCommonCode2(
                ["ACAB0110"],
                this.selectedCompany
            );
            this.lstCCY = commoncode[0];
        },
        /* async PasteRow(defaultParas, evt) {
           const rows = await this._PasteRow(
             defaultParas,
             ["AC_CD", "CCY", "TR_AMT_DR", "TR_AMT_CR", "BK_AMT_DR", "BK_AMT_CR"],
             evt
           );
           //console.log(rows);
           rows.forEach(e => {
             this.acountList.push(e);
           });
         },*/
        onCellPrepared({
            column,
            cellElement,
            rowType
        }) {
            if (rowType === "data" && column.dataField === "AC_NM") {
                cellElement.style.background = "#79c98e";
            }
        },
        async search(paramsData) {

            this.$refs.grdAccount.loadData(paramsData);
            /*  const dso = {
                type: "grid",
                selpro: "ac_sel_6045020_account",
                para: paramsData
              };
              this.acountList = await this._dsoCall(dso, "select", false);*/
        },
        addNew(defaultParas) {
            const uid = Date.now();
            this.defaultParas = defaultParas;
            this.$refs.grdAccount.addRowStruct({
                _rowstatus: "i",
                PK: uid,
                STT: null,
                RECEIVED_ORDER_DATE: null,
                BUYER_NAME: null,
				ITEMS: null,
                QTY_SW: null,
                QTY_OUTSOURCE: null,
                UNIT_PRICE_VND: null,
                UNIT_PRICE_USD: null,
				TOTAL_VND: null,
                TOTAL_USD: null,
                TOTAL_QTY: null,
                COMPANY_CODE: this.defaultParas.TCO_COMPANY_PK,
                IMPORT_DATE: this.defaultParas.STD_YM
            });
        },
        async save(searchParams) {
            this.searchParams = searchParams;
            this.$refs.grdAccount.saveData();
            /* this.$refs.grdAccount.instance.saveEditData().then(async()=>{
                   const dso = {
                           type: "grid",
                           selpro: "ac_sel_6045020_account",
                           updpro: "ac_upd_6045020_account",
                           para: searchParams,
                           elname: [
                             "_rowstatus",
                             "PK",
                             "AC_CD",
                             "CCY",
                             "TR_AMT_DR",
                             "TR_AMT_CR",
                             "BK_AMT_DR",
                             "BK_AMT_CR",
                             "TCO_COMPANY_PK",
                             "STD_YM"
                           ],
                           requirecol: ["AC_CD", "CCY", "TCO_COMPANY_PK", "STD_YM"],
                           data: this.acountList
                         };
                         const result = await this._dsoCall(dso, "update", true);
                         if (result) {
                           this.acountList = result;
                         }
             })*/
        },
        openAccountDialog(row) {
            this.multiSelectMode = true;
            if (row.rowIndex > -1) {
                if (row.column.dataField === "AC_NM") {
                    this.$refs.accountDialog.dialogIsShow = true;
                    this.selectedAccount = {
                        ...row
                    };
                }
            }
        },

        mappingAccount(item) {
            //console.log(item);
            this.$refs.grdAccount.setCellValue(
                "AC_CD",
                item.AC_CD,
                this.selectedAccount.data.PK
            );
            this.$refs.grdAccount.setCellValue(
                "AC_NM",
                item.AC_NM,
                this.selectedAccount.data.PK
            );
            this.$refs.grdAccount.setCellValue(
                "CCY",
                item.CCY,
                this.selectedAccount.data.PK
            );
            /* const userIdx = this.acountList.findIndex(
               x => x.PK === this.selectedAccount.data.PK
             );
            if (userIdx > -1) {
               this.acountList[userIdx].AC_CD = item.AC_CD;
               this.acountList[userIdx].AC_NM = item.AC_NM;
               this.acountList[userIdx].CCY = item.CCY;
               if (this.acountList[userIdx]._rowstatus !== "i") {
                 this.acountList[userIdx]._rowstatus = "u";
               }
             }*/
        },
        checkUpdatingItem(e) {
            //console.log(e)
        },
        checkUpdatedItem(data) {
            if (!data.cancel) {
                if (data.data._rowstatus !== "i") {
                    data.data._rowstatus = "u";
                }
                /*if (data.data.CCY == this.txtBookCcy) {
                    //console.log(data.data.BK_AMT_DR)
                    if (data.data.BK_AMT_DR == 0 || data.data.BK_AMT_DR == "0") {
                        data.data.BK_AMT_DR = data.data.TR_AMT_DR;
                    }
                    //console.log(data.data.BK_AMT_CR)
                    if (data.data.BK_AMT_CR == 0 || data.data.BK_AMT_CR == "0") {
                        data.data.BK_AMT_CR = data.data.TR_AMT_CR;
                    }

                }*/
            }
        },

        selectionChanged(data) {
            this.selectedItemKeys = data.selectedRowKeys;
        },

        markDeleteItems() {
            //console.log(paramsData);
            if (!this.selectedItemKeys.length) {
                this.$refs.grdAccount.deleteRows();
            } else {
                for (let i = 0; i < this.$refs.grdAccount.getDataSource().length; i++) {
                    const user = this.$refs.grdAccount.getDataSource()[i];
                    for (let j = 0; j < this.selectedItemKeys.length; j++) {
                        const item = this.selectedItemKeys[j];
                        if (item === user.PK) {
                            if (user._rowstatus !== "d") {
                                user._rowstatus = "d";
                                this.setMarkedDeleteRowColor(true, i);
                            } else {
                                user._rowstatus = "";
                                this.setMarkedDeleteRowColor(false, i);
                            }
                        }
                    }
                }
            }
        },

        setMarkedDeleteRowColor(isMarked, idx) {
            const element = this.$refs.grdAccount.instance.getRowElement(idx);
            if (element) {
                if (isMarked) {
                    // element[0].classList.add('mark-delete')
                    element[0].style.background = "#ff5252";
                    element[0].style.color = "#fff";
                } else {
                    // element[0].classList.remove('mark-delete')
                    element[0].style.background = "";
                    element[0].style.color = "";
                }
            }
        }
    }
};
</script>
