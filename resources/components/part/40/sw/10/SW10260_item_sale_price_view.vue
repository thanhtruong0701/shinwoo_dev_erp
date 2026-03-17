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
		{field: "PK", width: 80,title: "pk",alignment: "left",type: "text",visible: false},	   
        {field: "EVENT_TYPE", width: 80,title: "EVENT_TYPE",alignment: "left",type: "text",visible: false},
        {field: "MATERIAL_TYPE", width: 115,title: ("MATERIAL_TYPE"),alignment: "left",type: "text",visible: true},
        {field: "MATERIAL_SUB_TYPE", width: 100,title: ("MATERIAL_SUB_TYPE"),alignment: "left",type: "text",visible: true},
        {field: "SUPPLIER_LOCATION", width: 115,title: ("SUPPLIER_LOCATION"),alignment: "left",visible: true,},
        {field: "SUPPLIER_LOCATION_CODE", width: 60,title: ("SUPPLIER_LOCATION_CODE"),alignment: "left",visible: true,},
        {field: "SUPPLIER_LOCATION_COUNTRY", width: 95,title: ("SUPPLIER_LOCATION_COUNTRY"),alignment: "left",type: "text",visible: true},
        {field: "MATERIAL_NAME", width: 375,title: ("MATERIAL_NAME"),alignment: "left",type: "text",visible: true},
        {field: "MXS", width: 95,title: ("MXS"),alignment: "left",type: "text",visible: true,},
        {field: "PDM_MATERIAL_NUM", width: 75,title: ("PDM_MATERIAL_NUM"),alignment: "center",type: "text",visible: true},
		{field: "PCX_SUPPLIER_MATERIAL_ID", width: 80,title: "PCX_SUPPLIER_MATERIAL_ID",alignment: "left",type: "text",visible: true},
        {field: "PCX_MATERIAL_ID", width: 115,title: ("PCX_MATERIAL_ID"),alignment: "left",type: "text",visible: true},
		{field: "PRE_CURRENT_PRICE_SPSU23", width: 65,title: ("PRE_CURRENT_PRICE_SPSU23"),alignment: "right",type: "float",visible: true,allowEditing: true,format:"###,###,###.#####",},
		{field: "PRE_PRICE_FAHO23", width: 65,title: ("PRE_PRICE_FAHO23"),alignment: "right",type: "float",visible: true,allowEditing: true,format:"###,###,###.#####",},
		{field: "PRE_EX_RATE", width: 65,title: ("PRE_EX_RATE"),alignment: "right",type: "number",visible: true},
		{field: "PRE_CURRENT_PRICE_SPSU23_VND", width: 65,title: ("PRE_CURRENT_PRICE_SPSU23_VND"),alignment: "right",type: "number",visible: true,format:"###,###,###.0",},
		{field: "PRE_NEW_PRICE_FAHO23_VND", width: 65,title: ("PRE_NEW_PRICE_FAHO23_VND"),alignment: "right",type: "number",visible: true,format:"###,###,###.0",},
		{field: "CURRENT_PRICE_SPSU23", width: 65,title: ("CURRENT_PRICE_SPSU23"),alignment: "right",type: "float",visible: true,allowEditing: true,format:"###,###,###.#####",},
        {field: "CURRENT_PRICE_UOM", width: 115,title: ("CURRENT_PRICE_UOM"),alignment: "left",visible: false,},
        {field: "CURRENT_DELIVERY_TERM", width: 60,title: ("CURRENT_DELIVERY_TERM"),alignment: "left",visible: false,},
		{field: "NEW_PRICE_FAHO23", width: 65,title: ("NEW_PRICE_FAHO23"),alignment: "right",type: "float",visible: true,allowEditing: true,format:"###,###,###.#####",},
		
		{field: "EX_RATE", width: 65,title: ("EX_RATE"),alignment: "right",type: "number",visible: true},
		{field: "CURRENT_PRICE_SPSU23_VND", width: 65,title: ("CURRENT_PRICE_SPSU23_VND"),alignment: "right",type: "number",visible: true,format:"###,###,###.0",},
		{field: "NEW_PRICE_FAHO23_VND", width: 65,title: ("NEW_PRICE_FAHO23_VND"),alignment: "right",type: "number",visible: true,format:"###,###,###.0",},
        {field: "NEW_PRICE_UOM", width: 375,title: ("NEW_PRICE_UOM"),alignment: "left",type: "text",visible: true},
        {field: "NEW_DELIVERY_TERM", width: 95,title: ("NEW_DELIVERY_TERM"),alignment: "left",type: "text",visible: true,},
        {field: "PERCENT_CHG_IN_PRICE", width: 75,title: ("PERCENT_CHG_IN_PRICE"),alignment: "center",type: "text",visible: true},
		{field: "WIDTH_QTY", width: 80,title: "WIDTH_QTY",alignment: "left",type: "text",visible: true},
        {field: "WIDTH_UOM", width: 115,title: ("WIDTH_UOM"),alignment: "left",type: "text",visible: true},
        {field: "LENGTH_QTY", width: 100,title: ("LENGTH_QTY"),alignment: "left",type: "text",visible: true},
        {field: "LENGTH_UOM", width: 115,title: ("LENGTH_UOM"),alignment: "left",visible: true,},
        {field: "CUTBL_WIDTH_QTY", width: 60,title: ("CUTBL_WIDTH_QTY"),alignment: "left",visible: true,},
        {field: "CUTBL_WIDTH_UOM", width: 95,title: ("CUTBL_WIDTH_UOM"),alignment: "left",visible: true,},
        {field: "CUTBL_LENGTH_QTY", width: 375,title: ("CUTBL_LENGTH_QTY"),alignment: "left",type: "text",visible: true},
        {field: "CUTBL_LENGTH_UOM", width: 95,title: ("CUTBL_LENGTH_UOM"),alignment: "left",type: "text",visible: true,},
        {field: "WEIGHT_GRAMS_PER_UOM", width: 75,title: ("WEIGHT_GRAMS_PER_UOM"),alignment: "center",type: "text",visible: true},
		{field: "MOQ_QTY", width: 100,title: ("MOQ_QTY"),alignment: "left",type: "text",visible: true},
        {field: "MOQ_UOM", width: 115,title: ("MOQ_UOM"),alignment: "left",visible: true,},
        {field: "SAMPLE_LEAD_TIME", width: 60,title: ("SAMPLE_LEAD_TIME"),alignment: "left",visible: true,},
        {field: "PRODUCTION_LEAD_TIME", width: 95,title: ("PRODUCTION_LEAD_TIME"),alignment: "left",visible: true,},
        {field: "REMARKS", width: 375,title: ("REMARKS"),alignment: "left",type: "text",visible: true},
        {field: "DATE_YYYY", width: 95,title: ("DATE_YYYY"),alignment: "left",type: "text",visible: true,},
		
        
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
          updpro: "SW_SEL_SW10260_PRICE2_NOCACHE",
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
