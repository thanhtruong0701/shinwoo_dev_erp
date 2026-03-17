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
        limitHeight() { return 650 },
		
		header1(){
     return[
          {field: "SYS_ID", width: 80,title: "SYS_ID",alignment: "left",type: "text",visible: true},
		  {field: "FLTORDER_ID", width: 115,title: ("FLTORDER_ID"),alignment: "left",type: "text",visible: true},
		  {field: "BRAND", width: 100,title: ("BRAND"),alignment: "left",type: "text",visible: true},
		  {field: "ORDERDATE", width: 115,title: ("ORDERDATE"),alignment: "left",visible: true,allowEditing: true,},
		  {field: "ORDERNO", width: 60,title: ("ORDERNO"),alignment: "left",visible: true,allowEditing: true,},
		  {field: "ORDERCOMPANY", width: 95,title: ("ORDERCOMPANY"),alignment: "left",visible: true,allowEditing: true,},
		  {field: "TYPE", width: 375,title: ("TYPE"),alignment: "left",type: "text",visible: true},
		  {field: "CLOTHES", width: 95,title: ("CLOTHES"),alignment: "left",type: "text",visible: true,allowEditing: true,},
		  {field: "PRODUCT_YM", width: 75,title: ("PRODUCT_YM"),alignment: "center",type: "text",visible: true},
		  {field: "ORDER_CODE", width: 65,title: ("ORDER_CODE"),alignment: "right",type: "number",visible: true},

		  {field: "ORDER_NAME", width: 80,title: "ORDER_NAME",alignment: "left",type: "text",visible: true},
		  {field: "BRANDGROUP", width: 115,title: ("BRANDGROUP"),alignment: "left",type: "text",visible: true},
		  {field: "YY", width: 100,title: ("YY"),alignment: "left",type: "text",visible: true},
		  {field: "SEASON", width: 115,title: ("SEASON"),alignment: "left",visible: true,allowEditing: true,},
		  {field: "STYLE_NO", width: 60,title: ("STYLE_NO"),alignment: "left",visible: true,allowEditing: true,},
		  {field: "STYLE_PO_NO", width: 95,title: ("STYLE_PO_NO"),alignment: "left",visible: true,allowEditing: true,},
		  {field: "PO_NO", width: 375,title: ("PO_NO"),alignment: "left",type: "text",visible: true},
		  {field: "SEASON_RUN", width: 95,title: ("SEASON_RUN"),alignment: "left",type: "text",visible: true,allowEditing: true,},
		  {field: "GOODS", width: 75,title: ("GOODS"),alignment: "center",type: "text",visible: true},
		  {field: "DEGREE", width: 65,title: ("DEGREE"),alignment: "right",type: "number",visible: true},
		  
		  {field: "SEX", width: 80,title: "SEX",alignment: "left",type: "text",visible: true},
		  {field: "SELLPRICE", width: 115,title: ("SELLPRICE"),alignment: "left",type: "text",visible: true},
		  {field: "LAUNDRYCODE", width: 100,title: ("LAUNDRYCODE"),alignment: "left",type: "text",visible: true},
		  {field: "LAUNDRY", width: 115,title: ("LAUNDRY"),alignment: "left",visible: true,allowEditing: true,},
		  {field: "IMPORT_NAME", width: 60,title: ("IMPORT_NAME"),alignment: "left",visible: true,allowEditing: true,},
		  {field: "COUNTRY", width: 95,title: ("COUNTRY"),alignment: "left",visible: true,allowEditing: true,},
		  {field: "CUST_CODE", width: 375,title: ("CUST_CODE"),alignment: "left",type: "text",visible: true},
		  {field: "CUST_NAME", width: 95,title: ("CUST_NAME"),alignment: "left",type: "text",visible: true,allowEditing: true,},
		  {field: "KIND", width: 75,title: ("KIND"),alignment: "center",type: "text",visible: true},
		  {field: "CAREQTY", width: 65,title: ("CAREQTY"),alignment: "right",type: "number",visible: true},
		  
		  {field: "TOTWORKITEM", width: 80,title: "TOTWORKITEM",alignment: "left",type: "text",visible: true},
		  {field: "SIZECOMMENT", width: 115,title: ("SIZECOMMENT"),alignment: "left",type: "text",visible: true},
		  {field: "MEMO", width: 100,title: ("MEMO"),alignment: "left",type: "text",visible: true},
		  {field: "ARTICLE", width: 115,title: ("ARTICLE"),alignment: "left",visible: true,allowEditing: true,},
		  {field: "ORDERTYPE", width: 60,title: ("ORDERTYPE"),alignment: "left",visible: true,allowEditing: true,},
		  {field: "CNT", width: 95,title: ("CNT"),alignment: "left",visible: true,allowEditing: true,},
		  {field: "STATE", width: 375,title: ("STATE"),alignment: "left",type: "text",visible: true},
		  {field: "ORDER_YN", width: 95,title: ("ORDER_YN"),alignment: "left",type: "text",visible: true,allowEditing: true,},
		  {field: "BRANDNAME", width: 75,title: ("BRANDNAME"),alignment: "center",type: "text",visible: true},
		  {field: "STATENAME", width: 65,title: ("STATENAME"),alignment: "right",type: "number",visible: true},

		  {field: "REQUESTDATE", width: 80,title: "REQUESTDATE",alignment: "left",type: "text",visible: true},
		  {field: "CHECKDATE", width: 115,title: ("CHECKDATE"),alignment: "left",type: "text",visible: true},
		  {field: "CLOSEDATE", width: 100,title: ("CLOSEDATE"),alignment: "left",type: "text",visible: true},
		  {field: "TRANSFER", width: 115,title: ("TRANSFER"),alignment: "left",visible: true,allowEditing: true,},
		  {field: "SAFETYNO", width: 60,title: ("SAFETYNO"),alignment: "left",visible: true,allowEditing: true,},
		  {field: "GOODSNAME", width: 95,title: ("GOODSNAME"),alignment: "left",visible: true,allowEditing: true,},
		  {field: "ONLINES", width: 375,title: ("ONLINES"),alignment: "left",type: "text",visible: true},
		  {field: "SHNAME", width: 95,title: ("SHNAME"),alignment: "left",type: "text",visible: true,allowEditing: true,},
		  {field: "ORG_SUMQTY", width: 75,title: ("ORG_SUMQTY"),alignment: "center",type: "text",visible: true},
		  {field: "DEFINITE_TYPE", width: 65,title: ("DEFINITE_TYPE"),alignment: "right",type: "number",visible: true},
		 
		  {field: "DEFINITE_CODE", width: 80,title: "DEFINITE_CODE",alignment: "left",type: "text",visible: true},
		  {field: "DEFINITE_CODE2", width: 115,title: ("DEFINITE_CODE2"),alignment: "left",type: "text",visible: true},
		  {field: "FIT_COATPANTS", width: 100,title: ("FIT_COATPANTS"),alignment: "left",type: "text",visible: true},
		  {field: "FIT_TYPE", width: 115,title: ("FIT_TYPE"),alignment: "left",visible: true,allowEditing: true,},
		  {field: "FIT_TYPE_MIN", width: 60,title: ("FIT_TYPE_MIN"),alignment: "left",visible: true,allowEditing: true,},
		  {field: "FIT_TYPE_MAX", width: 95,title: ("FIT_TYPE_MAX"),alignment: "left",visible: true,allowEditing: true,},
		  {field: "FIT_TYPE2", width: 375,title: ("FIT_TYPE2"),alignment: "left",type: "text",visible: true},
		  {field: "FIT_TYPE2_MIN", width: 95,title: ("FIT_TYPE2_MIN"),alignment: "left",type: "text",visible: true,allowEditing: true,},
		  {field: "FIT_TYPE2_MAX", width: 75,title: ("FIT_TYPE2_MAX"),alignment: "center",type: "text",visible: true},
		  {field: "LABEL_DESCRIPT", width: 65,title: ("LABEL_DESCRIPT"),alignment: "right",type: "number",visible: true},
		 
		  {field: "LABEL_TYPE", width: 80,title: "LABEL_TYPE",alignment: "left",type: "text",visible: true},
		  {field: "LABEL_FRONT_LANG", width: 115,title: ("LABEL_FRONT_LANG"),alignment: "left",type: "text",visible: true},
		  {field: "LABEL_BACK_LANG", width: 100,title: ("LABEL_BACK_LANG"),alignment: "left",type: "text",visible: true},
		  {field: "LABEL_SIZE_TEXT", width: 115,title: ("LABEL_SIZE_TEXT"),alignment: "left",visible: true,allowEditing: true,},
		  {field: "KIND_PR_MODE", width: 60,title: ("KIND_PR_MODE"),alignment: "left",visible: true,allowEditing: true,},
		  {field: "SELLPRICE_ENG", width: 95,title: ("SELLPRICE_ENG"),alignment: "left",visible: true,allowEditing: true,},
		  {field: "SELLPRICE_CHN", width: 375,title: ("SELLPRICE_CHN"),alignment: "left",type: "text",visible: true},
		  {field: "SELLPRICE_TWN", width: 95,title: ("SELLPRICE_TWN"),alignment: "left",type: "text",visible: true,allowEditing: true,},
		  {field: "IMPORT_NAME_ENG", width: 75,title: ("IMPORT_NAME_ENG"),alignment: "center",type: "text",visible: true},
		  {field: "IMPORT_NAME_CHN", width: 65,title: ("IMPORT_NAME_CHN"),alignment: "right",type: "number",visible: true},

		  {field: "IMPORT_NAME_TWN", width: 80,title: "IMPORT_NAME_TWN",alignment: "left",type: "text",visible: true},
		  {field: "ITEM_NAME", width: 115,title: ("ITEM_NAME"),alignment: "left",type: "text",visible: true},
		  {field: "ITEM_NAME_ENG", width: 100,title: ("ITEM_NAME_ENG"),alignment: "left",type: "text",visible: true},
		  {field: "ITEM_NAME_CHN", width: 115,title: ("ITEM_NAME_CHN"),alignment: "left",visible: true,allowEditing: true,},
		  {field: "ITEM_NAME_TWN", width: 60,title: ("ITEM_NAME_TWN"),alignment: "left",visible: true,allowEditing: true,},
		  {field: "CUST_NAME_ENG", width: 95,title: ("CUST_NAME_ENG"),alignment: "left",visible: true,allowEditing: true,},
		  {field: "CUST_NAME_CHN", width: 375,title: ("CUST_NAME_CHN"),alignment: "left",type: "text",visible: true},
		  {field: "CUST_NAME_TWN", width: 95,title: ("CUST_NAME_TWN"),alignment: "left",type: "text",visible: true,allowEditing: true,},
		  {field: "BRANDGROUP_REQ", width: 75,title: ("BRANDGROUP_REQ"),alignment: "center",type: "text",visible: true},
		  {field: "ORDERDATE_REQ", width: 65,title: ("ORDERDATE_REQ"),alignment: "right",type: "number",visible: true},
	
		  {field: "ORDERNO_REQ", width: 80,title: "ORDERNO_REQ",alignment: "left",type: "text",visible: true},
		  {field: "REQ_VD_CD", width: 115,title: ("REQ_VD_CD"),alignment: "left",type: "text",visible: true},
		  {field: "MEMO_REQ", width: 100,title: ("MEMO_REQ"),alignment: "left",type: "text",visible: true},
		  {field: "CERTI_BRAND", width: 115,title: ("CERTI_BRAND"),alignment: "left",visible: true,allowEditing: true,},
		  {field: "CERTI_CLOTHES", width: 60,title: ("CERTI_CLOTHES"),alignment: "left",visible: true,allowEditing: true,},
		  {field: "CERTI_SEQ_NUM", width: 95,title: ("CERTI_SEQ_NUM"),alignment: "left",visible: true,allowEditing: true,},
		  {field: "CERTI_NAME1", width: 375,title: ("CERTI_NAME1"),alignment: "left",type: "text",visible: true},
		  {field: "CERTI_NAME2", width: 95,title: ("CERTI_NAME2"),alignment: "left",type: "text",visible: true,allowEditing: true,},
		  {field: "CERTI_NAME3", width: 75,title: ("CERTI_NAME3"),alignment: "center",type: "text",visible: true},
		  {field: "CERTI_SAFETY_TYPE1", width: 65,title: ("CERTI_SAFETY_TYPE1"),alignment: "right",type: "number",visible: true},
		  
		  {field: "CERTI_SAFETY_TYPE2", width: 80,title: "CERTI_SAFETY_TYPE2",alignment: "left",type: "text",visible: true},
		  {field: "CERTI_EXEC_STD", width: 115,title: ("CERTI_EXEC_STD"),alignment: "left",type: "text",visible: true},
		  {field: "CERTI_GOODS_CLASS", width: 100,title: ("CERTI_GOODS_CLASS"),alignment: "left",type: "text",visible: true},
		  {field: "CERTI_GOODS_QC", width: 115,title: ("CERTI_GOODS_QC"),alignment: "left",visible: true,allowEditing: true,},
		  {field: "RETAG_REASON", width: 60,title: ("RETAG_REASON"),alignment: "left",visible: true,allowEditing: true,},
		  {field: "FACTORY_INFO", width: 95,title: ("FACTORY_INFO"),alignment: "left",visible: true,allowEditing: true,},
		  {field: "FACTORY_INFO_NM", width: 375,title: ("FACTORY_INFO_NM"),alignment: "left",type: "text",visible: true},
		  {field: "FACTORY_NAME", width: 95,title: ("FACTORY_NAME"),alignment: "left",type: "text",visible: true,allowEditing: true,},
		  {field: "FACTORY_ADDRESS", width: 75,title: ("FACTORY_ADDRESS"),alignment: "center",type: "text",visible: true},
		  {field: "IF_CHECKDATE", width: 65,title: ("IF_CHECKDATE"),alignment: "right",type: "number",visible: true},
		  
		  {field: "IF_CLOSEDATE", width: 80,title: "IF_CLOSEDATE",alignment: "left",type: "text",visible: true},
		  {field: "IF_ORDERDATE", width: 115,title: ("IF_ORDERDATE"),alignment: "left",type: "text",visible: true},
		  {field: "ORDER_YN_MONO", width: 100,title: ("ORDER_YN_MONO"),alignment: "left",type: "text",visible: true},
		  {field: "RFID_YN", width: 115,title: ("RFID_YN"),alignment: "left",visible: true,allowEditing: true,},
		  {field: "RFID_LABEL_TYPE", width: 60,title: ("RFID_LABEL_TYPE"),alignment: "left",visible: true,allowEditing: true,},
		  {field: "RFID_CODE_CREATE", width: 95,title: ("RFID_CODE_CREATE"),alignment: "left",visible: true,allowEditing: true,},
		  {field: "RFID_CODE_SEND", width: 375,title: ("RFID_CODE_SEND"),alignment: "left",type: "text",visible: true},
		  {field: "TAG_RECEVIE_STATE", width: 95,title: ("TAG_RECEVIE_STATE"),alignment: "left",type: "text",visible: true,allowEditing: true,},
		  {field: "IF_TAG_RECEVIEDATE", width: 75,title: ("IF_TAG_RECEVIEDATE"),alignment: "center",type: "text",visible: true},
		  {field: "ORDER_YN_RFID", width: 65,title: ("ORDER_YN_RFID"),alignment: "right",type: "number",visible: true},
		  
		  {field: "SIZE_X", width: 80,title: "SIZE_X",alignment: "left",type: "text",visible: true},
		  {field: "SIZE_Y", width: 115,title: ("SIZE_Y"),alignment: "left",type: "text",visible: true},
		  {field: "SIZE_Z", width: 100,title: ("SIZE_Z"),alignment: "left",type: "text",visible: true},
		  {field: "SIZE_UNIT", width: 115,title: ("SIZE_UNIT"),alignment: "left",visible: true,allowEditing: true,},
		  {field: "ANTENA_YN", width: 60,title: ("ANTENA_YN"),alignment: "left",visible: true,allowEditing: true,},
		  {field: "RFID_LABEL_TYPE_NAME", width: 95,title: ("RFID_LABEL_TYPE_NAME"),alignment: "left",visible: true,allowEditing: true,},
		  {field: "UPDATE_YN", width: 375,title: ("UPDATE_YN"),alignment: "left",type: "text",visible: true},
		  {field: "IF_EXPECTED_DATE", width: 95,title: ("IF_EXPECTED_DATE"),alignment: "left",type: "text",visible: true,allowEditing: true,},
		  {field: "FCUST_YN", width: 75,title: ("FCUST_YN"),alignment: "center",type: "text",visible: true},
		  {field: "STS", width: 65,title: ("STS"),alignment: "right",type: "number",visible: true},
		 
		  {field: "REG_ID", width: 80,title: "REG_ID",alignment: "left",type: "text",visible: true},
		  {field: "REG_DT", width: 115,title: ("REG_DT"),alignment: "left",type: "text",visible: true},
		  {field: "MOD_ID", width: 100,title: ("MOD_ID"),alignment: "left",type: "text",visible: true},
		  {field: "MOD_DT", width: 115,title: ("MOD_DT"),alignment: "left",visible: true,allowEditing: true,},
		  {field: "GRP_PO_NO", width: 60,title: ("GRP_PO_NO"),alignment: "left",visible: true,allowEditing: true,},
		  {field: "TAG_TYP", width: 95,title: ("TAG_TYP"),alignment: "left",visible: true,allowEditing: true,},
		  {field: "FLTORDER_REQ_ID", width: 375,title: ("FLTORDER_REQ_ID"),alignment: "left",type: "text",visible: true},
		  {field: "SESSION_ID", width: 95,title: ("SESSION_ID"),alignment: "left",type: "text",visible: true,allowEditing: true,},
		  {field: "MANUFACTURER_NAME", width: 75,title: ("MANUFACTURER_NAME"),alignment: "center",type: "text",visible: true},
		  {field: "Z_REQ_DELIVERY_DATE", width: 65,title: ("Z_REQ_DELIVERY_DATE"),alignment: "right",type: "number",visible: true},
		  {field: "Z_MEMO", width: 80,title: "Z_MEMO",alignment: "left",type: "text",visible: true},
		  {field: "Z_CN_OMS_IF", width: 115,title: ("Z_CN_OMS_IF"),alignment: "left",type: "text",visible: true},
		  {field: "Z_STYLE_NO", width: 100,title: ("Z_STYLE_NO"),alignment: "left",type: "text",visible: true},
		  {field: "Z_DEGREE", width: 115,title: ("Z_DEGREE"),alignment: "left",visible: true,allowEditing: true,},
      
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
          updpro: "SW_SEL_SW10110_FNF_ORDER",
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
