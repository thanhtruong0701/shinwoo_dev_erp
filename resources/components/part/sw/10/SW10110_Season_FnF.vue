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
            return ("confirm_pass_not_match", "common");
        },
		  
        header1() {
				return[
				
						{field: "SYS_ID", width: 80,title: "SYS_ID",alignment: "left",type: "text",visible: true},
						{field: "MAT_ID", width: 115,title: ("MAT_ID"),alignment: "left",type: "text",visible: true},
						{field: "FLTORDER_ID", width: 100,title: ("FLTORDER_ID"),alignment: "left",type: "text",visible: true},
						{field: "BRAND", width: 115,title: ("BRAND"),alignment: "left",visible: true,allowEditing: true,},
						{field: "ORDERDATE", width: 60,title: ("ORDERDATE"),alignment: "left",visible: true,allowEditing: true,},
						{field: "ORDERNO", width: 95,title: ("ORDERNO"),alignment: "left",visible: true,allowEditing: true,},
						{field: "NUM", width: 375,title: ("NUM"),alignment: "left",type: "text",visible: true},
						{field: "GUBUN ", width: 95,title: ("GUBUN"),alignment: "left",type: "text",visible: true,allowEditing: true,},
						{field: "MATERIAL", width: 75,title: ("MATERIAL"),alignment: "left",type: "text",visible: true},
						{field: "MIXRATE", width: 75,title: ("MIXRATE"),alignment: "left",type: "text",visible: true},
						{field: "ORDERCOMPANY", width: 75,title: ("ORDERCOMPANY"),alignment: "left",type: "text",visible: true},
						{field: "BRANDNAME", width: 75,title: ("BRANDNAME"),alignment: "left",type: "text",visible: true},
						{field: "TRANSFER", width: 75,title: ("TRANSFER"),alignment: "left",type: "text",visible: true},
						
						{field: "GUBUN_ENG", width: 75,title: ("GUBUN_ENG"),alignment: "left",type: "text",visible: true},
						{field: "GUBUN_CHN", width: 75,title: ("GUBUN_CHN"),alignment: "left",type: "text",visible: true},
						{field: "GUBUN_TWN", width: 75,title: ("GUBUN_TWN"),alignment: "left",type: "text",visible: true},
						{field: "MATERIAL_ENG", width: 75,title: ("MATERIAL_ENG"),alignment: "left",type: "text",visible: true},
						{field: "MATERIAL_CHN", width: 75,title: ("MATERIAL_CHN"),alignment: "left",type: "text",visible: true},
						
						{field: "MATERIAL_TWN", width: 75,title: ("MATERIAL_TWN"),alignment: "left",type: "text",visible: true},
						{field: "COLOR", width: 75,title: ("COLOR"),alignment: "left",type: "text",visible: true},
						{field: "TEAMCODE", width: 75,title: ("TEAMCODE"),alignment: "left",type: "text",visible: true},
						{field: "COLOR_INFO", width: 75,title: ("COLOR_INFO"),alignment: "left",type: "text",visible: true},
						{field: "STS", width: 75,title: ("STS"),alignment: "left",type: "text",visible: true},
						{field: "REG_ID", width: 75,title: ("REG_ID"),alignment: "left",type: "text",visible: true},
						{field: "REG_DT", width: 75,title: ("REG_DT"),alignment: "left",type: "text",visible: true},
						{field: "MOD_ID", width: 75,title: ("MOD_ID"),alignment: "left",type: "text",visible: true},
						{field: "MOD_DT", width: 75,title: ("MOD_DT"),alignment: "left",type: "text",visible: true},
						
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
				  updpro: "SW_SEL_SW10110_MAT_FNF_NOCACHE",
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
				SEASON : null,
				FACTORY : null,
				PRODUCT_CODE : null,
				STYLE_NAME : null,
				COLOR_DESCRIPTION : null,
				COLOR_LOCAL_LANGUAGE_NAME : null,
				AGE : null,
				GENDER : null,
				BUSINESS_ORGANIZATION : null,
				CONSUMER_PURPOSE : null,
				CONSUMER_FOCUS : null,
				PRIMARY_PLATFORM : null,
				CHN_NAME : null,
				GB_CODE : null,
				COMMENTS : null,
				MODEL_ID : null,
				SUBCATEGORY : null
				
            });
            //this.txtBookCcy = this.defaultParas.BOOK_CCY;
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
