<template>
<v-container fluid class="pa-0">
    <v-row no-gutters>
        <v-col cols="12">
            <!-- Data Table -->
            <v-row align="center" justify="center">
                <v-col cols="12" class="py-0">
                    <v-card outlined tile v-resize="onResize">
                        <DataGridView ref="grdCustomer" :header="leftHeader" sel_procedure="ac_sel_6045020_cust" select_mode="Multiple" :filter_paras="searchParams " 
                    upd_procedure="ac_upd_6045020_cust" :update_paras="[
                    'PK',
                    'PARTNER_ID',
                    'AC_CD',
                    'CCY',
                    'TR_AMT_DR',
                    'TR_AMT_CR',
                    'BK_AMT_DR',
                    'BK_AMT_CR',
                    'TCO_COMPANY_PK',
                    'STD_YM',
                    'TCO_BUSPLACE_PK'
                    ]" :is_allow_paste="false" :max_height="limitHeight" @openpopup="openDialog" @row-updated="checkUpdatedItem" :onCellPrepared="onCellPrepared" />
                    </v-card>
                </v-col>
            </v-row>
        </v-col>
    </v-row>
    <account-dialog ref="accountDialog" @returnAccountInfo="mappingAccount"></account-dialog>
    <partner-dialog ref="partnerDialog" @callBackData="mappingPartner"></partner-dialog>
</v-container>
</template>

<script>
import AccountDialog from "@/components/dialog/AccountDialog";
import PartnerDialog from "@/components/dialog/PartnerDialog";

export default {
    DataGridView: () => import("@/components/control/DataGridView"),
    layout: "default",
    middleware: "user",
    props: ["searchParams"],
    components: {
        AccountDialog,
        PartnerDialog
    },
    data: () => ({
        defaultParas: null,
        //colunm list
        lstCCY: [],
        // Table Data
        customerList: [],
        selectedItemKeys: [],

        // Delete
        deleteDialog: false,
        deleteProps: [],

        // Employee Dialog
        selectedAccount: "",
        columnHeaders: [],
        txtBookCcy: "",
    }),
    async created() {
        // const commoncode = await this._getCommonCode2(
        //     ["ACAB0110"],
        //     this.selectedCompany
        // );
        // this.lstCCY = commoncode[0];
    },
    async mounted() {
        this.getCurrency();
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
                    dataField: "PARTNER_ID",
                    caption: this.$t("customer_code"),
                    width: "auto",
                    editable: false,
                    cellTemplate: "popup",
                },
                {
                    dataField: "PARTNER_NAME",
                    caption: this.$t("customer_name"),
                    width: "auto",
                    editable: false,
                    cellTemplate: "popup",
                },
                {
                    dataField: "AC_CD",
                    caption: this.$t('account_code', 'acnt'),
                    width: "auto",
                    editable: false,
                    cellTemplate: "popup",
                },
                {
                    dataField: "AC_NM",
                    caption: this.$t('account_name', 'acnt'),
                    width: "auto",
                    editable: false,
                    cellTemplate: "popup",
                },
                {
                    dataField: "CCY",
                    caption: this.$t("ccy"),
                    width: "80px",
                    lookup: {
                        dataSource: this.lstCCY,
                        displayExpr: 'CODE',
                        valueExpr: 'CODE'
                    }
                },
                {
                    dataField: "TR_AMT_DR",
                    caption: this.$t("tr_amt_dr"),
                    width: "auto",
                    dataType: 'number',
                    formatFloat: 2,
                    editable: true
                },
                {
                    dataField: "TR_AMT_CR",
                    caption: this.$t("tr_amt_cr"),
                    width: "auto",
                    dataType: 'number',
                    formatFloat: 2,
                    editable: true
                },
                {
                    dataField: "BK_AMT_DR",
                    caption: this.$t("bk_amt_dr"),
                    width: "auto",
                    dataType: 'number',
                    formatFloat: this.txtBookCcy == 'VND' ? 0  : 2,
                    editable: true
                },
                {
                    dataField: "BK_AMT_CR",
                    caption: this.$t("bk_amt_cr"),
                    width: "auto",
                    dataType: 'number',
                    formatFloat: this.txtBookCcy == 'VND' ? 0  : 2,
                    editable: true
                },
            ];
            return header;
        },
    },
    watch: {
    },
    methods: {
        async getCurrency() {
            const commoncode = await this._getCommonCode2(
                ["ACAB0110", "ACBG0040"],
                this.selectedCompany
            );
            this.lstCCY = commoncode[0];
            const result = commoncode[1];
            result.forEach(e => {
                if (e.DEF_YN == "Y") {
                    this.txtBookCCY = e.CODE;
                }
            });
        },
        /*  async PasteRow(defaultParas, evt) {
            const rows = await this._PasteRow(
              defaultParas,
              [
                "PARTNER_ID",
                "AC_CD",
                "CCY",
                "TR_AMT_DR",
                "TR_AMT_CR",
                "BK_AMT_DR",
                "BK_AMT_CR"
              ],
              evt
            );
            //console.log(rows);
            rows.forEach(e => {
              this.customerList.push(e);
            });
          },*/
        onCellPrepared({
            column,
            cellElement,
            rowType
        }) {
            if (
                rowType === "data" &&
                (column.dataField === "AC_NM" || column.dataField === "PARTNER_NAME")
            ) {
                cellElement.style.background = "#79c98e";
            }
        },
        async search(paramsData) {
            this.$refs.grdCustomer.loadData(paramsData);
            /* const dso = {
               type: "grid",
               selpro: "ac_sel_6045020_cust",
               para: paramsData
             };
             this.customerList = await this._dsoCall(dso, "select", false);*/
        },

        addNew(defaultParas) {
            const uid = Date.now();
            this.defaultParas = defaultParas;
            this.$refs.grdCustomer.addRowStruct({
                _rowstatus: "i",
                PK: uid,
                AC_CD: this.defaultParas.AC_CD_MST,
                AC_NM: this.defaultParas.AC_NM_MST,
                CCY: this.defaultParas.AC_CCY_MST,
                TR_AMT_DR: 0,
                TR_AMT_CR: 0,
                BK_AMT_DR: 0,
                BK_AMT_CR: 0,
                PARTNER_ID: "",
                TCO_COMPANY_PK: this.defaultParas.TCO_COMPANY_PK,
                STD_YM: this.defaultParas.STD_YM,
                TCO_BUSPLACE_PK: this.defaultParas.TCO_BUSPLACE_PK
            });

            this.txtBookCcy = this.defaultParas.BOOK_CCY;
        },

        /* changeValue(value, key, idx, isModified) {
           this.customerList.map((item, index) => {
             if (index === idx) {
               this.$set(item, key, value);
               if (isModified && item.PK) {
                 item._rowstatus = "u";
               }
             }
           });
         },*/

        async save(searchParams) {
            this.searchParams = searchParams;
            this.$refs.grdCustomer.saveData();
            /*  this.$refs.grdCustomer.instance.saveEditData().then(async()=>{
                  const dso = {
                    type: "grid",
                    selpro: "ac_sel_6045020_cust",
                    updpro: "ac_upd_6045020_cust",
                    para: searchParams,
                    elname: [
                      "_rowstatus",
                      "PK",
                      "PARTNER_ID",
                      "AC_CD",
                      "CCY",
                      "TR_AMT_DR",
                      "TR_AMT_CR",
                      "BK_AMT_DR",
                      "BK_AMT_CR",
                      "TCO_COMPANY_PK",
                      "STD_YM"
                    ],
                    requirecol: ["PARTNER_ID", "AC_CD", "CCY", "TCO_COMPANY_PK", "STD_YM"],
                    data: this.customerList
                  };
                  const result = await this._dsoCall(dso, "update", true);
                  if (result) {
                    this.customerList = result;
                  }
              })*/
        },

        openDialog(row) {
            console.log(row);
            if (row.rowIndex > -1) {
                if (row.column.dataField === "AC_CD" || row.column.dataField === "AC_NM") {
                    this.$refs.accountDialog.dialogIsShow = true;
                    this.selectedAccount = {
                        ...row
                    };
                } else if (row.column.dataField === "PARTNER_ID" || row.column.dataField === "PARTNER_NAME") {
                    this.$refs.partnerDialog.dialogIsShow = true;
                    this.selectedAccount = {
                        ...row
                    };
                }
            }
        },

        mappingAccount(item) {
            this.$refs.grdCustomer.setCellValue(
                "AC_CD",
                item.AC_CD,
                this.selectedAccount.data.PK
            );
            this.$refs.grdCustomer.setCellValue(
                "AC_NM",
                item.AC_NM,
                this.selectedAccount.data.PK
            );
            this.$refs.grdCustomer.setCellValue(
                "CCY",
                item.CCY,
                this.selectedAccount.data.PK
            );
            /*const userIdx = this.customerList.findIndex(
              x => x.PK === this.selectedAccount.data.PK
            );
            if (userIdx > -1) {
              this.customerList[userIdx].AC_CD = item.AC_CD;
              this.customerList[userIdx].AC_NM = item.AC_NM;
              this.customerList[userIdx].CCY = item.CCY;
              if (this.customerList[userIdx]._rowstatus !== "i") {
                this.customerList[userIdx]._rowstatus = "u";
              }
            }*/
        },
        mappingPartner(item) {
            this.$refs.grdCustomer.setCellValue(
                "PARTNER_ID",
                item.PARTNER_ID,
                this.selectedAccount.data.PK
            );
            this.$refs.grdCustomer.setCellValue(
                "PARTNER_NAME",
                item.PARTNER_NAME,
                this.selectedAccount.data.PK
            );
            /* const userIdx = this.customerList.findIndex(
               x => x.PK === this.selectedAccount.data.PK
             );
             if (userIdx > -1) {
               this.customerList[userIdx].PARTNER_ID = item.PARTNER_ID;
               this.customerList[userIdx].PARTNER_NAME = item.PARTNER_NAME;
               if (this.customerList[userIdx]._rowstatus !== "i") {
                 this.customerList[userIdx]._rowstatus = "u";
               }
             }*/
        },
        checkUpdatedItem(data) {
            if (!data.cancel) {
                if (data.data._rowstatus !== "i") {
                    data.data._rowstatus = "u";
                }
                //console.log(data.data.CCY)
                //console.log(this.txtBookCcy )
                if (data.data.CCY == this.txtBookCcy) {
                    //console.log(data.data.BK_AMT_DR)
                    if (data.data.BK_AMT_DR == 0 || data.data.BK_AMT_DR == "0") {
                        data.data.BK_AMT_DR = data.data.TR_AMT_DR;
                    }
                    //console.log(data.data.BK_AMT_CR)
                    if (data.data.BK_AMT_CR == 0 || data.data.BK_AMT_CR == "0") {
                        data.data.BK_AMT_CR = data.data.TR_AMT_CR;
                    }

                }
            }
        },

        selectionChanged(data) {
            this.selectedItemKeys = data.selectedRowKeys;
        },

        markDeleteItems() {
            if (!this.selectedItemKeys.length) {
                this.$refs.grdCustomer.deleteRows();
                /* this.customerList.forEach((item, index) => {
                    if (item._rowstatus === "d") {
                      item._rowstatus = "";
                      this.setMarkedDeleteRowColor(false, index);
                    }
                  });*/
            } else {
                for (let i = 0; i < this.$refs.grdCustomer.getDataSource().length; i++) {
                    const user = this.$refs.grdCustomer.getDataSource()[i];
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
            const element = this.$refs.grdCustomer.instance.getRowElement(idx);
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
