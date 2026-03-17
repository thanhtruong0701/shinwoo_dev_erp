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
		
        header1() {
				return[
						{field: "PO_NO", width: 150,title: "PO_NO",alignment: "left",type: "text",visible: true},
						{field: "SEASON", width: 115,title: "SEASON",alignment: "left",type: "text",visible: true},
						{field: "STYLE_CODE", width: 100,title: "STYLE_CODE",alignment: "left",type: "text",visible: true},
						{field: "GENDER", width: 115,title: "GENDER",alignment: "left",visible: true,allowEditing: true,},
						{field: "OGAC_DATE", width: 60,title: "OGAC_DATE",alignment: "left",visible: true,allowEditing: true,},
						{field: "RTA", width: 95,title: "RTA",alignment: "left",visible: false,allowEditing: true,},
						{field: "TOTAL_QTY", width: 375,title: "TOTAL_QTY",alignment: "left",type: "number",visible: true},
						{field: "ATT01", width: 95,title:  "ATT01",alignment: "left",type: "number",visible: true,allowEditing: true,},
						{field: "ATT02", width: 150,title: "ATT02",alignment: "left",type: "number",visible: true},
						{field: "ATT03", width: 115,title: "ATT03",alignment: "right",type: "number",visible: true},
						{field: "ATT04", width: 100,title: "ATT04",alignment: "left",type: "number",visible: true},
						{field: "ATT05", width: 115,title: "ATT05",alignment: "right",type: "number",visible: true,allowEditing: true,},
						{field: "ATT06", width: 60,title:  "ATT06" ,alignment: "right",type: "number",visible: true,allowEditing: true,},
						{field: "ATT07", width: 95,title:  "ATT07",alignment: "right",type: "number",visible: true,allowEditing: true,},
						{field: "ATT08", width: 375,title: "ATT08" ,alignment: "right",type: "number",visible: true},
						{field: "ATT09", width: 95,title:  "ATT09",alignment: "left",type: "number",visible: true,allowEditing: true,},
						{field: "ATT10", width: 95,title:  "ATT10",alignment: "left",type: "number",visible: true,allowEditing: true,},
						
						{field: "ATT11", width: 95,title:  "ATT11",alignment: "left",type: "number",visible: true,allowEditing: true,},
						{field: "ATT12", width: 150,title: "ATT12",alignment: "left",type: "number",visible: true},
						{field: "ATT13", width: 115,title: "ATT13",alignment: "right",type: "number",visible: true},
						{field: "ATT14", width: 100,title: "ATT14",alignment: "left",type: "number",visible: true},
						{field: "ATT15", width: 115,title: "ATT15",alignment: "right",type: "number",visible: true,allowEditing: true,},
						{field: "ATT16", width: 60,title:  "ATT16" ,alignment: "right",type: "number",visible: true,allowEditing: true,},
						{field: "ATT17", width: 95,title:  "ATT17",alignment: "right",type: "number",visible: true,allowEditing: true,},
						{field: "ATT18", width: 375,title: "ATT18" ,alignment: "right",type: "number",visible: true},
						{field: "ATT19", width: 95,title:  "ATT19",alignment: "left",type: "number",visible: true,allowEditing: true,},
						{field: "ATT20", width: 95,title:  "ATT20",alignment: "left",type: "number",visible: true,allowEditing: true,},
						
						{field: "ATT21", width: 95,title:  "ATT21",alignment: "left",type: "number",visible: true,allowEditing: true,},
						{field: "ATT22", width: 150,title: "ATT22",alignment: "left",type: "number",visible: true},
						{field: "ATT23", width: 115,title: "ATT23",alignment: "right",type: "number",visible: true},
						{field: "ATT24", width: 100,title: "ATT24",alignment: "left",type: "number",visible: true},
						{field: "ATT25", width: 115,title: "ATT25",alignment: "right",type: "number",visible: true,allowEditing: true,},
						{field: "ATT26", width: 60,title:  "ATT26" ,alignment: "right",type: "number",visible: true,allowEditing: true,},
						{field: "ATT27", width: 95,title:  "ATT27",alignment: "right",type: "number",visible: true,allowEditing: true,},
						{field: "ATT28", width: 375,title: "ATT28" ,alignment: "right",type: "number",visible: true},
						{field: "ATT29", width: 95,title:  "ATT29",alignment: "left",type: "number",visible: true,allowEditing: true,},
						{field: "ATT30", width: 95,title:  "ATT30",alignment: "left",type: "number",visible: true,allowEditing: true,},
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
				  updpro: "SW_SEL_SW10110_SIZE_AU_NOCACHE",
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
