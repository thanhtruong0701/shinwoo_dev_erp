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
                                :header="leftHeader" sel_procedure="ac_sel_6045020_account" select_mode="Multiple" :filter_paras="searchParams" 
                                upd_procedure="ac_upd_6045020_account" 
                                :update_paras="['PK', 'AC_CD', 'CCY', 'TR_AMT_DR', 'TR_AMT_CR', 'BK_AMT_DR', 'BK_AMT_CR', 'TCO_COMPANY_PK', 'STD_YM', 'TCO_BUSPLACE_PK']" 
                                :is_allow_paste="false" :max_height="limitHeight" @openpopup="openAccountDialog" @row-updated="checkUpdatedItem" 
                                :id="'idGrid'"  :customTables="['TAC_HGMMBAL','TAC_ABACCTCODE']" :menu_cd="'6045020'" 
                            />
                        </v-col>
                        <!-- allow-save-custom -->

                        
                        <!--  <DxDataGrid
                column-resizing-mode="widget"
                key-expr="PK"
                ref="grdAccount"
                :allow-column-resizing="true"
                :cache-enabled="false"
                :column-auto-width="$vuetify.breakpoint.smAndDown"
                :data-source="acountList"
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
                @row-updating="checkUpdatingItem"
                @selection-changed="selectionChanged"
                @cellDblClick="openAccountDialog"
                :onCellPrepared="onCellPrepared"
              >
                <DxColumn
                  data-field="AC_CD"
                  :allow-editing="true"
                  :caption="$t('account_code')"
                >
                  /></DxColumn
                >
                <DxColumn
                  data-field="AC_NM"
                  :allow-editing="false"
                  :caption="$t('account_name')"
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
                <DxPaging :page-size="acountList.length" />
              </DxDataGrid>-->
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
        txtBookCcy: "",
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
                    dataField: "AC_CD",
                    caption: this.$t("account_code"),
                    width: "auto",
                    editable: false,
                    cellTemplate: "popup",
                },
                {
                    dataField: "AC_NM",
                    caption: this.$t("account_name"),
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
                    caption: this.$t("bk_amt_Cr"),
                    width: "auto",
                    dataType: 'number',
                    formatFloat: this.txtBookCcy == 'VND' ? 0  : 2,
                    editable: true
                },
            ];
            return header;
        },
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
                AC_CD: this.defaultParas.AC_CD_MST,
                AC_NM: this.defaultParas.AC_NM_MST,
                CCY: this.defaultParas.AC_CCY_MST,
                TR_AMT_DR: null,
                TR_AMT_CR: null,
                BK_AMT_DR: null,
                BK_AMT_CR: null,
                TCO_COMPANY_PK: this.defaultParas.TCO_COMPANY_PK,
                STD_YM: this.defaultParas.STD_YM,
                TCO_BUSPLACE_PK: this.defaultParas.TCO_BUSPLACE_PK
            });
            this.txtBookCcy = this.defaultParas.BOOK_CCY;
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
            console.log(row);
            console.log(row.rowIndex);
            if (row.rowIndex > -1) {
                if (row.column.dataField === "AC_CD" || row.column.dataField === "AC_NM") {
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
