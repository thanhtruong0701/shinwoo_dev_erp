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
								@onRowPrepared = "onRowPreparedGrid11"
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
					   {  dataField: 'PO_NO',       caption: this.$t('PO_NO') , allowEditing: true  },
					   {  dataField: 'BARCODE',       caption: this.$t('BARCODE_NO') , allowEditing: true  },
					   {  dataField: 'SIZE_CODE',     caption: this.$t('SIZE_CODE') , allowediting: true },
					   {  dataField: 'ATT01',     caption: this.$t('ATT01') , allowediting: true , formatFloat:'0'},
					   {  dataField: 'ATT02',     caption: this.$t('ATT02') , allowediting: true ,  formatFloat:'0'},
					   {  dataField: 'ATT03',     caption: this.$t('ATT03') , allowediting: true ,  formatFloat:'0'},
					   {  dataField: 'ATT04',     caption: this.$t('ATT04') , allowediting: true ,  formatFloat:'0'},
					   {  dataField: 'ATT05',     caption: this.$t('ATT05') , allowediting: true ,  formatFloat:'0'},
					   {  dataField: 'ATT06',     caption: this.$t('ATT06') , allowediting: true ,  formatFloat:'0'},
					   {  dataField: 'ATT07',     caption: this.$t('ATT07') , allowEditing: true ,  formatFloat:'0'},
					   {  dataField: 'ATT08',     caption: this.$t('ATT08') , allowEditing: true ,  formatFloat:'0'},
					   {  dataField: 'ATT09',     caption: this.$t('ATT09') , allowEditing: true ,  formatFloat:'0'},
					   /*{  dataField: 'ATT10',     caption: this.$t('ATT10') , allowediting: true , formatFloat:'0'},
					   {  dataField: 'ATT11',     caption: this.$t('ATT11') , allowediting: true ,  formatFloat:'0'},
					   {  dataField: 'ATT12',     caption: this.$t('ATT12') , allowediting: true ,  formatFloat:'0'},
					   {  dataField: 'ATT13',     caption: this.$t('ATT13') , allowediting: true ,  formatFloat:'0'},
					   {  dataField: 'ATT14',     caption: this.$t('ATT14') , allowediting: true ,  formatFloat:'0'},
					   {  dataField: 'ATT15',     caption: this.$t('ATT15') , allowediting: true ,  formatFloat:'0'},
					   {  dataField: 'ATT16',     caption: this.$t('ATT16') , allowEditing: true ,  formatFloat:'0'},
					   {  dataField: 'ATT17',     caption: this.$t('ATT17') , allowEditing: true ,  formatFloat:'0'},
					   {  dataField: 'ATT18',     caption: this.$t('ATT18') , allowEditing: true ,  formatFloat:'0'},
					   {  dataField: 'ATT19',     caption: this.$t('ATT19') , allowediting: true , formatFloat:'0'},
					   {  dataField: 'ATT20',     caption: this.$t('ATT20') , allowediting: true ,  formatFloat:'0'},
					   {  dataField: 'ATT21',     caption: this.$t('ATT21') , allowediting: true ,  formatFloat:'0'},
					   {  dataField: 'ATT22',     caption: this.$t('ATT22') , allowediting: true ,  formatFloat:'0'},
					   {  dataField: 'ATT23',     caption: this.$t('ATT23') , allowediting: true ,  formatFloat:'0'},
					   {  dataField: 'ATT24',     caption: this.$t('ATT24') , allowediting: true ,  formatFloat:'0'},
					   {  dataField: 'ATT25',     caption: this.$t('ATT25') , allowEditing: true ,  formatFloat:'0'},
					   {  dataField: 'ATT26',     caption: this.$t('ATT26') , allowEditing: true ,  formatFloat:'0'},
					   {  dataField: 'ATT27',     caption: this.$t('ATT27') , allowEditing: true ,  formatFloat:'0'},
					   {  dataField: 'ATT28',     caption: this.$t('ATT28') , allowediting: true , formatFloat:'0'},
					   {  dataField: 'ATT29',     caption: this.$t('ATT29') , allowediting: true ,  formatFloat:'0'},
					   {  dataField: 'ATT30',     caption: this.$t('ATT30') , allowediting: true ,  formatFloat:'0'},
					   {  dataField: 'ATT31',     caption: this.$t('ATT31') , allowediting: true ,  formatFloat:'0'},
					   {  dataField: 'ATT32',     caption: this.$t('ATT32') , allowediting: true ,  formatFloat:'0'},
					   {  dataField: 'ATT33',     caption: this.$t('ATT33') , allowediting: true ,  formatFloat:'0'},
					   {  dataField: 'ATT34',     caption: this.$t('ATT34') , allowEditing: true ,  formatFloat:'0'},
					   {  dataField: 'ATT35',     caption: this.$t('ATT35') , allowEditing: true ,  formatFloat:'0'},
					   {  dataField: 'ATT36',     caption: this.$t('ATT36') , allowEditing: true ,  formatFloat:'0'},*/
					   {  dataField: 'TOTAL',     caption: this.$t('TOTAL') , allowEditing: true ,  formatFloat:'0'},
					   {  dataField: 'G_TOTAL',     caption: this.$t('G_TOTAL') , allowEditing: true ,  formatFloat:'0'},
					   {  dataField: 'LOSS',     caption: this.$t('LOSS') , allowEditing: true ,  formatFloat:'0'},
					   {  dataField: 'EXTRA',     caption: this.$t('EXTRA') , allowEditing: true ,  formatFloat:'0'},
					   {  dataField: 'PRINTED_NO',     caption: this.$t('PRINTED_NO') , allowEditing: true ,  formatFloat:'0'},
					   {  dataField: 'REMAIN',     caption: this.$t('REMAIN') , allowEditing: true ,  formatFloat:'0'},
					   {  dataField: 'PRINTED_TIME',     caption: this.$t('PRINTED_TIME') , allowEditing: true },
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
				  updpro: "SZ_SEL_SWNK050_EXPORT_NOCACHE",
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
		//==============================
		onRowPreparedGrid11(e) {      
			  this.onRowPreparedGrid_ALL(e);
			},
			 
			
			onRowPreparedGrid_ALL(e) {      
			  if(e.rowType === "data") {       
				if(e.data.ISTOTAL === 1) {
				  e.rowElement.style.fontWeight = "bold"
				  e.rowElement.style.background = "#FFE599";
			   
				}        
			  }  
			},
		//==============================
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
