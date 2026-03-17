<template>
<v-container fluid class="pa-0">
    <v-row no-gutters>
        <v-col cols="12">
            <!-- Data Table -->
            <v-row align="center" justify="center">
                <v-col cols="12" class="py-0">
                    <v-card outlined tile v-resize="onResize">
                        <DataGridView ref="grdBank" :header="leftHeader" sel_procedure="ac_sel_6045020_bank" select_mode="Single" :filter_paras="searchParams" upd_procedure="ac_upd_6045020_bank" :update_paras="[
                    'PK',
                    'BANK_ID',
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
                        <!--- <DxDataGrid
                column-resizing-mode="widget"
                key-expr="PK"
                ref="grdBank"
                :allow-column-resizing="true"
                :cache-enabled="false"
                :column-auto-width="$vuetify.breakpoint.smAndDown"
                :data-source="bankList"
                :height="limitHeight"
                :loadPanel="{
                  enabled: true,
                  text: $t('is_loading')
                }"
                :no-data-text="$t('no_data')"
                :show-borders="true"
                :show-column-lines="true"
                :show-row-lines="true"
                @row-updated="checkUpdatedItem"
                @selection-changed="selectionChanged"
                @cellDblClick="openDialog"
                :onCellPrepared="onCellPrepared"
              >
                <DxColumn
                  data-field="BANK_ID"
                  :allow-editing="true"
                  :caption="$t('bank_id')"
                >
                </DxColumn>
                <DxColumn
                  data-field="BANK_NAME"
                  :allow-editing="false"
                  :caption="$t('bank_name')"
                >
                </DxColumn>
                <DxColumn
                  data-field="AC_CD"
                  :allow-editing="true"
                  :caption="$t('account_code', 'acnt')"
                >
                </DxColumn>
                <DxColumn
                  data-field="AC_NM"
                  :allow-editing="false"
                  :caption="$t('account_name', 'acnt')"
                >
                </DxColumn>
                <DxColumn data-field="CCY" :caption="$t('ccy')">
                  <DxLookup
                    display-expr="CODE"
                    value-expr="CODE"
                    :data-source="lstCCY"
                  />
                </DxColumn>
                <DxColumn
                  data-field="TR_AMT_DR"
                  :caption="$t('tr_amt_dr')"
                  dataType="number" format="###,###,###" 
                ></DxColumn>
                <DxColumn
                  data-field="TR_AMT_CR"
                  :caption="$t('tr_amt_cr')"
                  dataType="number" format="###,###,###" 
                ></DxColumn>
                <DxColumn
                  data-field="BK_AMT_DR"
                  :caption="$t('bk_amt_dr')"
                   dataType="number" format="###,###,###" 
                ></DxColumn>
                <DxColumn
                  data-field="BK_AMT_CR"
                  :caption="$t('bk_amt_cr')"
                   dataType="number" format="###,###,###" 
                ></DxColumn>

                <DxSelection mode="multiple" show-check-boxes-mode="none" />
                <DxEditing
                  mode="cell"
                  start-edit-action="dblClick"
                  :allow-updating="true"
                />
                <DxKeyboardNavigation :edit-on-key-press="true" />
                <DxPaging :page-size="bankList.length" />
              </DxDataGrid>--->
                    </v-card>
                </v-col>
            </v-row>
        </v-col>
    </v-row>
    <account-dialog ref="accountDialog" @returnAccountInfo="mappingAccount"></account-dialog>
    <bank-dialog ref="bankDialog" @returnBankInfo="mappingBank" :company="selectedCompany"></bank-dialog>
</v-container>
</template>

<script>
import AccountDialog from "@/components/dialog/AccountDialog";
import BankDialog from "@/components/dialog/BankDialog";
export default {
    DataGridView: () => import("@/components/control/DataGridView"),
    layout: "default",
    middleware: "user",
    props: ["searchParams"],
    components: {
        AccountDialog,
        BankDialog
    },
    data: () => ({
        defaultParas: null,
        //colunm list
        lstCCY: [],
        // Table Data
        bankList: [],
        selectedItemKeys: [],

        // Delete
        deleteDialog: false,
        deleteProps: [],

        // Employee Dialog
        selectedBank: "",
        columnHeaders: [],
        txtBookCcy: "",
        selectedCompany:0,
    }),
    async created() {
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
    computed: {
        user() {
            return this.$store.getters["auth/user"];
        },
        limitHeight() {
            return this.windowHeight - 300;
        },
        leftHeader() {
            let header = [{
                    dataField: "BANK_ID",
                    caption: this.$t("bank_id"),
                    width: "auto",
                    editable: false,
                },
                {
                    dataField: "BANK_NAME",
                    caption: this.$t("bank_name"),
                    width: "auto",
                    editable: false,
                    cellTemplate: "popup",
                }, {
                    dataField: "AC_CD",
                    caption: this.$t('account_code', 'acnt'),
                    width: "auto",
                    editable: false,
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
                    formatFloat: this.txtBookCcy == 'VND' ? 0  : 2,
                    editable: true
                },
                {
                    dataField: "TR_AMT_CR",
                    caption: this.$t("tr_amt_cr"),
                    width: "auto",
                    dataType: 'number',
                    formatFloat: this.txtBookCcy == 'VND' ? 0  : 2,
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
        // searchParams(val) {
        //   this.search(val);
        // } 
    },
    methods: {
        async PasteRow(defaultParas, evt) {
            const rows = await this._PasteRow(
                defaultParas,
                [
                    "BANK_ID",
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
                this.bankList.push(e);
            });
        },
        onCellPrepared({
            column,
            cellElement,
            rowType
        }) {
            if (
                rowType === "data" &&
                (column.dataField === "AC_NM" || column.dataField === "BANK_NAME")
            ) {
                cellElement.style.background = "#79c98e";
            }
        },
        async search(paramsData) {
            this.$refs.grdBank.loadData(paramsData);
            /* const dso = {
               type: "grid",
               selpro: "ac_sel_6045020_bank",
               para: paramsData
             };
             this.bankList = await this._dsoCall(dso, "select", false);*/
        },

       async addNew(defaultParas) { 
            const uid = Date.now();
            this.defaultParas = defaultParas;
            this.selectedCompany = this.defaultParas.TCO_COMPANY_PK
            this.$refs.grdBank.addRowStruct({
                _rowstatus: "i",
                PK: uid,
                AC_CD: this.defaultParas.AC_CD_MST,
                AC_NM: this.defaultParas.AC_NM_MST,
                CCY: this.defaultParas.AC_CCY_MST,
                TR_AMT_DR: 0,
                TR_AMT_CR: 0,
                BK_AMT_DR: 0,
                BK_AMT_CR: 0,
                BANK_ID: "",
                TCO_COMPANY_PK: this.defaultParas.TCO_COMPANY_PK,
                STD_YM: this.defaultParas.STD_YM,
                TCO_BUSPLACE_PK: this.defaultParas.TCO_BUSPLACE_PK
            });

          const commoncode = await this._getCommonCode2(
            ["ACAB0110"],
            this.selectedCompany
          );
          this.lstCCY = commoncode[0];
          // console.log('vng-154-dvg^_^: > file: 6045020_bank.vue > line 306 > addNew > this.lstCCY', this.lstCCY);
          
            this.txtBookCcy = this.defaultParas.BOOK_CCY;
        },
        /* changeValue(value, key, idx, isModified) {
           this.bankList.map((item, index) => {
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
            this.$refs.grdBank.saveData();
            /*  this.$refs.grdBank.instance.saveEditData().then(async()=>{
                  const dso = {
                    type: "grid",
                    selpro: "ac_sel_6045020_bank",
                    updpro: "ac_upd_6045020_bank",
                    para: searchParams,
                    elname: [
                      "_rowstatus",
                      "PK",
                      "BANK_ID",
                      "AC_CD",
                      "CCY",
                      "TR_AMT_DR",
                      "TR_AMT_CR",
                      "BK_AMT_DR",
                      "BK_AMT_CR",
                      "TCO_COMPANY_PK",
                      "STD_YM"
                    ],
                    requirecol: ["BANK_ID", "AC_CD", "CCY", "TCO_COMPANY_PK", "STD_YM"],
                    data: this.bankList
                  };
                  const result = await this._dsoCall(dso, "update", true);
                  if (result) {
                    this.bankList = result;
                  }
              })*/
        },

        openDialog(row) {
            if (row.rowIndex > -1) {
                if (row.column.dataField === "AC_CD" || row.column.dataField === "AC_NM") {
                    this.$refs.accountDialog.dialogIsShow = true;
                    this.selectedBank = {
                        ...row
                    };
                } else if (row.column.dataField === "BANK_ID" || row.column.dataField === "BANK_NAME") {
                    this.$refs.bankDialog.dialogIsShow = true;
                    this.selectedBank = {
                        ...row
                    };
                }
            }
        },

        mappingAccount(item) {
            this.$refs.grdBank.setCellValue(
                "AC_CD",
                item.AC_CD,
                this.selectedBank.data.PK
            );
            this.$refs.grdBank.setCellValue(
                "AC_NM",
                item.AC_NM,
                this.selectedBank.data.PK
            );
            this.$refs.grdBank.setCellValue(
                "CCY",
                item.CCY,
                this.selectedBank.data.PK
            );
            /* const userIdx = this.bankList.findIndex(
               x => x.PK === this.selectedBank.data.PK
             );
             if (userIdx > -1) {
               this.bankList[userIdx].AC_CD = item.AC_CD;
               this.bankList[userIdx].AC_NM = item.AC_NM; 
               this.bankList[userIdx].CCY = item.CCY;
               if (this.bankList[userIdx]._rowstatus !== "i") {
                 this.bankList[userIdx]._rowstatus = "u";
               }
             }*/
        },
        mappingBank(item) {
            this.$refs.grdBank.setCellValue(
                "BANK_ID",
                item.BANK_ID,
                this.selectedBank.data.PK
            );
            this.$refs.grdBank.setCellValue(
                "BANK_NAME",
                item.BANK_NAME,
                this.selectedBank.data.PK
            );
            this.$refs.grdBank.setCellValue(
                "CCY",
                item.CCY,
                this.selectedBank.data.PK
            );
            
            /*  console.log("mapping bank");
              const userIdx = this.bankList.findIndex(
                x => x.PK === this.selectedBank.data.PK
              );

              if (userIdx > -1) {
                this.bankList[userIdx].BANK_ID = item.BANK_ID;
                this.bankList[userIdx].BANK_NAME = item.BANK_NAME;
                if (this.bankList[userIdx]._rowstatus !== "i") {
                  this.bankList[userIdx]._rowstatus = "u";
                }
              }*/
        },

        checkUpdatedItem(data) {
            if (!data.cancel) {
                if (data.data._rowstatus !== "i") {
                    data.data._rowstatus = "u";
                }
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
                this.$refs.grdBank.deleteRows();
                /*   this.bankList.forEach((item, index) => {
                     if (item._rowstatus === "d") {
                       item._rowstatus = "";
                       this.setMarkedDeleteRowColor(false, index);
                     }
                   });*/
            } else {
                for (let i = 0; i < this.$refs.grdBank.getDataSource().length; i++) {
                    const user = this.$refs.grdBank.getDataSource()[i];
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
            const element = this.$refs.grdBank.instance.getRowElement(idx);
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
