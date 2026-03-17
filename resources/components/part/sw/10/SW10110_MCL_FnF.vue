<template>
<v-container fluid class="pa-0">
    <v-row no-gutters>
        <v-col cols="12">
            <!-- Data Table -->
            <v-row align="center" justify="center">
                <v-col cols="12" class="py-0">
                    <v-card outlined tile v-resize="onResize">
						<BaseGridView :headertype="1" ref='grdCustomer' 
								:editable="true" :multiselect='true' 
								:columnsresize="false" 
								:autoresize="true"
								:gridfilter='true' :height="limitHeight"
								:header="header1"								
							  ></BaseGridView>
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
            return ("confirm_pass_not_match", "common");
        },
        header1() {
				return[
				
			 
						{field: "SYS_ID", width: 80,title: "SYS_ID",alignment: "left",type: "text",visible: true},
						{field: "COLOR_ID", width: 115,title: ("COLOR_ID"),alignment: "left",type: "text",visible: true},
						{field: "FLTORDER_ID", width: 100,title: ("FLTORDER_ID"),alignment: "left",type: "text",visible: true},
						{field: "BRANDGROUP", width: 115,title: ("BRANDGROUP"),alignment: "left",visible: true,allowEditing: true,},
						{field: "ORDERDATE", width: 60,title: ("ORDERDATE"),alignment: "left",visible: true,allowEditing: true,},
						{field: "ORDERNO", width: 95,title: ("ORDERNO"),alignment: "left",visible: true,allowEditing: true,},
						{field: "COLOR", width: 375,title: ("COLOR"),alignment: "left",type: "text",visible: true},
						{field: "SIZES", width: 95,title: ("SIZES"),alignment: "left",type: "text",visible: true,allowEditing: true,},
						{field: "QTY", width: 75,title: ("QTY"),alignment: "center",type: "text",visible: true},
						{field: "ORDERCOMPANY", width: 75,title: ("ORDERCOMPANY"),alignment: "center",type: "text",visible: true},
						
						{field: "BRANDGROUPNAME", width: 75,title: ("BRANDGROUPNAME"),alignment: "center",type: "text",visible: true},
						{field: "TRANSFER", width: 75,title: ("TRANSFER"),alignment: "center",type: "text",visible: true},
						{field: "BARCODE", width: 75,title: ("BARCODE"),alignment: "center",type: "text",visible: true},
						{field: "BRAND", width: 75,title: ("BRAND"),alignment: "center",type: "text",visible: true},
						{field: "SEASON_RUN", width: 75,title: ("SEASON_RUN"),alignment: "center",type: "text",visible: true},
						{field: "GOODS", width: 75,title: ("GOODS"),alignment: "center",type: "text",visible: true},
						{field: "SIZES_CHN", width: 75,title: ("SIZES_CHN"),alignment: "center",type: "text",visible: true},
						{field: "SIZES_ENG", width: 75,title: ("SIZES_ENG"),alignment: "center",type: "text",visible: true},
						{field: "SIZES_TWN", width: 75,title: ("SIZES_TWN"),alignment: "center",type: "text",visible: true},
						{field: "COLOR_ENG", width: 75,title: ("COLOR_ENG"),alignment: "center",type: "text",visible: true},
						{field: "COLOR_CHN", width: 75,title: ("COLOR_CHN"),alignment: "center",type: "text",visible: true},
						{field: "COLOR_TWN", width: 75,title: ("COLOR_TWN"),alignment: "center",type: "text",visible: true},
						
						{field: "FIT_TYPE", width: 75,title: ("FIT_TYPE"),alignment: "center",type: "text",visible: true},
						{field: "FILL", width: 75,title: ("FILL"),alignment: "center",type: "text",visible: true},
						{field: "TAG_FILL", width: 75,title: ("TAG_FILL"),alignment: "center",type: "text",visible: true},
						{field: "SIZES_RING", width: 75,title: ("SIZES_RING"),alignment: "center",type: "text",visible: true},
						{field: "SIZES_RING_INNER", width: 75,title: ("SIZES_RING_INNER"),alignment: "center",type: "text",visible: true},
						{field: "PRINT_SIZES", width: 75,title: ("PRINT_SIZES"),alignment: "center",type: "text",visible: true},
						{field: "STS", width: 75,title: ("STS"),alignment: "center",type: "text",visible: true},
						{field: "REG_ID", width: 75,title: ("REG_ID"),alignment: "center",type: "text",visible: true},
						{field: "REG_DT", width: 75,title: ("REG_DT"),alignment: "center",type: "text",visible: true},
						{field: "MOD_ID", width: 75,title: ("MOD_ID"),alignment: "center",type: "text",visible: true},
						{field: "MOD_DT", width: 75,title: ("MOD_DT"),alignment: "center",type: "text",visible: true},
						{field: "SIZES_UNIT", width: 75,title: ("SIZES_UNIT"),alignment: "center",type: "text",visible: true},
						{field: "SIZES_X", width: 75,title: ("SIZES_X"),alignment: "center",type: "text",visible: true},
						{field: "SIZES_Y", width: 75,title: ("SIZES_Y"),alignment: "center",type: "text",visible: true},
						{field: "SIZES_Z", width: 75,title: ("SIZES_Z"),alignment: "center",type: "text",visible: true},
						{field: "COLORTEAM", width: 75,title: ("COLORTEAM"),alignment: "center",type: "text",visible: true},
	
					]
        },
    },
    watch: {
        // searchParams(val) {
        //   this.search(val);
        // }
    },
    methods: {
        async getCurrency() {
            const commoncode = await this._getCommonCode2(
                ["ACAB0110"],
                this.selectedCompany
            );
            this.lstCCY = commoncode[0];
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
        async search(paramsData) {//paramsData
			const dso = {
				  type: "process",
				  updpro: "SW_SEL_SW10110_FNF_COLOR",
				  para: paramsData,
				};

				let result = await this._dsoCall(dso, 'confirm', false, true);
				if (result) {
					this.$refs.grdCustomer.setDataSource(result);
				}  
            //this.$refs.grdCustomer.loadData(paramsData);
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
            if (row.rowIndex > -1) {
                if (row.column.dataField === "AC_NM") {
                    this.$refs.accountDialog.dialogIsShow = true;
                    this.selectedAccount = {
                        ...row
                    };
                } else if (row.column.dataField === "PARTNER_NAME") {
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
