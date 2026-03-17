<template>
<v-container fluid class="pa-0">
    <v-row no-gutters>
        <v-col cols="12">
            <!-- Data Table -->
            <v-row align="center" justify="center">
                <v-col cols="12" class="py-0">
                    <v-card outlined tile v-resize="onResize">
                        <v-col cols="12">
                            <BaseGridView :headertype="1" ref='grdAccount' 
								:editable="true" :multiselect='true' 
								:columnsresize="false" 
								:autoresize="true"
								:gridfilter='true' :height="limitHeight"
								:header="header1"								
							  ></BaseGridView>
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
                  data-field="VENDOR_CODE"
                  :allow-editing="true"
                  :caption="$t('VENDOR_CODE')"
                >
                  /></DxColumn
                >
                <DxColumn
                  data-field="VENDOR_NAME"
                  :allow-editing="false"
                  :caption="$t('VENDOR_NAME')"
                >
				
                </DxColumn>
                <DxColumn
                  data-field="ACCEPTANCE_DATE"
                  :allow-editing="false"
                  :caption="$t('ACCEPTANCE_DATE')"
                >
                </DxColumn>
				<DxColumn
                  data-field="TRADING_CO_PO_NUMBER"
                  :allow-editing="false"
                  :caption="$t('TRADING_CO_PO_NUMBER')"
                >
                </DxColumn>
				<DxColumn
                  data-field="PURCHASE_ORDER_NUMBER"
                  :allow-editing="false"
                  :caption="$t('PURCHASE_ORDER_NUMBER')"
                >
                </DxColumn>
				<DxColumn
                  data-field="PO_LINE_ITEM_NUMBER"
                  :allow-editing="false"
                  :caption="$t('PO_LINE_ITEM_NUMBER')"
                >
                </DxColumn>
				
				<DxColumn
                  data-field="CREATE_DATE"
                  :allow-editing="false"
                  :caption="$t('CREATE_DATE')"
                >
                </DxColumn>
				<DxColumn
                  data-field="DOCUMENT_DATE"
                  :allow-editing="false"
                  :caption="$t('DOCUMENT_DATE')"
                >
                </DxColumn>
				<DxColumn
                  data-field="CATEGORY_DESCRIPTION"
                  :allow-editing="false"
                  :caption="$t('CATEGORY_DESCRIPTION')"
                >
                </DxColumn>
				<DxColumn
                  data-field="SUB_CATEGORY_DESCRIPTION"
                  :allow-editing="false"
                  :caption="$t('SUB_CATEGORY_DESCRIPTION')"
                >
                </DxColumn>
				<DxColumn
                  data-field="PRODUCT_CODE"
                  :allow-editing="false"
                  :caption="$t('PRODUCT_CODE')"
                >
                </DxColumn>
				<DxColumn
                  data-field="PRODUCT_NAME"
                  :allow-editing="false"
                  :caption="$t('PRODUCT_NAME')"
                >
                </DxColumn>
				<DxColumn
                  data-field="SIZE_NUM"
                  :allow-editing="false"
                  :caption="$t('SIZE_NUM')"
                >
                </DxColumn>
				
                <DxColumn
                  data-field="QTY"
                  :caption="$t('QTY')"
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
		
		header1(){
     return[
		{field: "PK", width: 80,title: "PK",alignment: "left",type: "text",visible: false},
		{field: "PO_NO", width: 115,title: ("po_no"),alignment: "left",type: "text",visible: true},
        {field: "PRODUCT_CODE", width: 80,title: "product_code",alignment: "left",type: "text",visible: true},
        {field: "OGAC_DATE", width: 95,title: ("ogac_date"),alignment: "left",visible: true,allowEditing: true,},
		{field: "STICKER_NUM01", width: 375,title: ("sticker_num01"),alignment: "left",type: "text",visible: true},
        {field: "GAC_DATE", width: 100,title: ("GAC_DATE"),alignment: "left",type: "text",visible: true},
		{field: "QTY", width: 65,title: ("qty"),alignment: "right",type: "number",visible: true},
        {field: "COMPANY_CODE", width: 115,title: ("company_code"),alignment: "left",visible: true,allowEditing: true,},
        {field: "FACTORY_CODE", width: 60,title: ("factory_code"),alignment: "left",visible: true,allowEditing: true,},
        {field: "IMPORT_DATE", width: 95,title: ("import_date"),alignment: "left",type: "text",visible: true,allowEditing: true,},
     ]
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

             const dso = {
			  type: "process",
			  updpro: "SW_SEL_SW10090_ORDER",
			  para: paramsData,
			};

			let result = await this._dsoCall(dso, 'confirm', false, true);
			if (result) {
				this.$refs.grdAccount.setDataSource(result);
        } 
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
