<template>
<v-container fluid class="pa-0">
    <v-row no-gutters>
        <v-col cols="12">
            <!-- Search Panel -->
            <v-row align="center" justify="center">
                <v-col cols="12">
                    <v-card outlined tile>
                        <v-container fluid class="pb-0">
                            <v-row dense align="center" justify="space-between">
                                <!-- row 1 -->
                                <!-- Company -->
								<v-col lg="2" class="pb-0">
                                   <BaseSelect
									:label="$t('Date Type')"
									v-model="selectedCompany"
									:lstData="lstCompany"
									item-text="TEXT"
									item-value="PK"                   
								  />   
                                </v-col>
                                <v-col lg="2" class="pb-0">
									<BaseDatePicker v-model="dtFrom" outlined :label="$t('from_date')" default></BaseDatePicker> 
                                </v-col>
								<v-col lg="2" class="pb-0">
									<BaseDatePicker v-model="dtTo" outlined :label="$t('to_date')" default></BaseDatePicker> 
                                </v-col>
                                
                                <v-col lg="2" cols="12">
                                   
								  <BaseSelect
									:label="$t('Order Type')"
									v-model="selectedOrderType"
									:lstData="lstOrderType"
									item-text="text"
									item-value="value"                   
								  />   
										
                                </v-col>
								<v-col lg="2" cols="12">
										
                                </v-col>
                                <v-col lg="2" cols="12">
                                    <div class="d-flex justify-end">
                                        <BaseButton icon_type="search" :btn_text="$t('search')" @onclick="search" :disabled="isProcessing" />
                                        <BaseButton icon_type="excel" :btn_text="$t('excel')" @onclick="OnPrint" :disabled="isProcessing" />
                                    </div>
                                   
                                </v-col>

                               
                            </v-row>
                           
                        </v-container>
                    </v-card>
                </v-col>
            </v-row>
            <!-- Data Table -->
            <v-row align="center" justify="center">
                <v-col cols="12" class="py-0">
                    <v-tabs dark background-color="#4DB6AC" class="mb-2" height="35" show-arrows next-icon="mdi-arrow-right-bold-box-outline" prev-icon="mdi-arrow-left-bold-box-outline" color="deep-orange darken-4" v-model="tab_control">
                        <v-tab>{{ $t('Label Type Summary(Customer)') }}</v-tab>
						<v-tab>{{ $t('Label Type Summary(Location)') }}</v-tab>
                        <v-tab>{{ $t('Label Type Summary(ALL)') }}</v-tab>
						<v-tab>{{ $t('Label Type Summary(Order Type)') }}</v-tab>
                        
						<!--
                        <v-tab>{{ $t('in') }}</v-tab>
						-->
                    </v-tabs>
                    <v-tabs-items v-model="tab_control" v-resize="onResize">
					
                        <v-tab-item>
                            <v-row align="center" justify="center">
                                <v-col cols="12" class="py-0">
                                    <v-card outlined tile v-resize="onResize">
                                        <DataGridView ref="dataGridIOB" :header="headersIOB" sel_procedure="SW_SEL_SW10470_ORDER_NOCACHE" select_mode="Single" :filter_paras="this._formatNullValuesToEmpty
										  ([this.dtFrom,
											this.dtTo,
											this.selectedCompany,
											this.selectedOrderType])" :is_allow_paste="false" :max_height="limitHeight - 50" @onRowPrepared = "onRowPreparedGrid11" @cellDblClick="onRowDblClick" @cellClick="selectionChanged" :filterRow="true" />
                                    </v-card>
                                </v-col>
                            </v-row>
                        </v-tab-item>
                        <v-tab-item>
                            <v-row align="center" justify="center">
                                <v-col cols="12" class="py-0">
                                    <v-card outlined tile v-resize="onResize">
                                        <DataGridView ref="dataGridBAL" :header="headersBAL" sel_procedure="SW_SEL_SW10470_LOCATION_NOCACHE" select_mode="Single" :filter_paras="this._formatNullValuesToEmpty
										  ([this.dtFrom,
											this.dtTo,
											this.selectedCompany ,
											this.selectedOrderType
										  ])" :is_allow_paste="false" :max_height="limitHeight - 50" @onRowPrepared = "onRowPreparedGrid11" @cellDblClick="onRowDblClick" @cellClick="selectionChanged" :filterRow="true" />
                                    </v-card>
                                </v-col>
                            </v-row>
                        </v-tab-item>
                        <v-tab-item>
                            <v-row align="center" justify="center">
                                <v-col cols="12" class="py-0">
                                    <v-card outlined tile v-resize="onResize">
                                        <DataGridView ref="dataGridOUT" :header="headersOUT" sel_procedure="SW_SEL_SW10470_SUM_TYPE_NOCACHE" select_mode="Multiple" :filter_paras="this._formatNullValuesToEmpty
										([this.dtFrom,
											this.dtTo,
											this.selectedCompany,
											this.selectedOrderType		
									])" :is_allow_paste="false" :max_height="limitHeight - 50" @onRowPrepared = "onRowPreparedGrid11" @cellDblClick="onRowDblClick" @cellClick="selectionChanged" :filterRow="true" />
                                    </v-card>
                                </v-col>
                            </v-row>
                        </v-tab-item>
                        <v-tab-item>
                            <v-row align="center" justify="center">
                                <v-col cols="12" class="py-0">
                                    <v-card outlined tile v-resize="onResize">
                                        <DataGridView ref="dataGridIN" :header="headersIN" sel_procedure="SW_SEL_SW10470_ORDER_TYPE_NOCACHE" select_mode="Multiple" :filter_paras="this._formatNullValuesToEmpty([
											this.dtFrom,
											this.dtTo,
											this.selectedCompany,
											this.selectedOrderType											
											])" :is_allow_paste="false" :max_height="limitHeight - 50" @onRowPrepared = "onRowPreparedGrid11" @cellDblClick="onRowDblClick" @cellClick="selectionChanged" :filterRow="true" />
														</v-card>
                                </v-col>
                            </v-row>
                        </v-tab-item>
                    </v-tabs-items>
                </v-col>
            </v-row>
        </v-col>
    </v-row>
    <partner-dialog ref="partnerDialog" @callBackData="handleReturnedPartner" />
    <account-slip-dialog ref="accountSlipDialog" :seqArray="seqArray" :currentSeq="currentSeq" />
    <alert-dialog ref="alertDialog"></alert-dialog>
    <cost-center-dialog ref="refPLCenter" :companyPK="user.TCO_COMPANY_PK" @returnData="mappingPLCenter"></cost-center-dialog>
    <cost-center-dialog ref="refPLCenterDebit" :companyPK="user.TCO_COMPANY_PK" @returnData="mappingPLDebitCenter"></cost-center-dialog>
    <cost-center-dialog ref="refPLCenterCrebit" :companyPK="user.TCO_COMPANY_PK" @returnData="mappingPLCrebitCenter"></cost-center-dialog>
    <account-dialog ref="accountDebitDialog" @returnAccountInfo="getUppAccDebitDialog"></account-dialog>
    <account-dialog ref="accountCrebitDialog" @returnAccountInfo="getUppAccCrebitDialog"></account-dialog>
    <account-dialog ref="accountDialog" @returnAccountInfo="getUppAccDialog"></account-dialog>
    <dynamic-dialog ref="refDynamicDialog" :companyPK="user.TCO_COMPANY_PK" :header="dynamicHeader" :listLabel="listLabel" :listData="listData" :codeLabel="codeLabel" :nameLabel="nameLabel" :dialogTitle="dialogTitle" :procedure="procedure" :moreParas="moreParas" :autoSearch="autoSearch" :multiSelectMode="multiSelectMode" @returnData="onSelectItemInfo"></dynamic-dialog>
</v-container>
</template>

<script>
import AccountDialog from "@/components/dialog/AccountDialog.vue";
import PlUnitDialog from "@/components/dialog/PlUnitDialog";
export default {
    layout: "default",
    middleware: "user",

    components: {
        DatePicker: () => import("@/components/control/DatePicker"),
        PartnerDialog: () => import("@/components/dialog/PartnerDialog"),
        AccountSlipDialog: () => import("@/components/dialog/AccountSlipDialog"),
        AlertDialog: () => import("@/components/dialog/AlertDialog"),
        DateControl: () => import("@/components/control/DateControl"),
        PlUnitDialog,
        "account-dialog": AccountDialog,
        CostCenterDialog: () => import("@/components/dialog/CostCenterDialog"),
        DynamicDialog: () => import("@/components/dialog/DynamicDialog"),
    },

    data: () => ({
        companyList: [],
		lstCompany: [],
        selectedCompany: '',
		selectedOrderType: '',
        voucherTypeList: [],
        selectedVoucherType: '',
        seq: '',
        partnerPK: '',
        partner: '',
        dateFrom: '',
        dateTo: '',
        voucherNo: '',
        rbStatusList: [],
        selectedStatus: '2',
        reportLocationList: [],
        selectedReportLocation: '',
        rpPerson: '',
        description: '',
        descriptionLocal: '',
        languageList: [],
        selectedLang: '',
        depositNoList: [],
        selectedDepositNo: '',
        reportList: [],
        selectedReport: '',
        Month_fr: "",
        Month_to: "",
        dtMonth: "",
        dataListIOB: [],
        seqArray: [],
        currentSeq: null,
        lstWareHouseType: "",
        wareHouseList: [],
        lstWareHouse: "",
        inOutTypeList: [],
        trTypeList: [],
        lstTrType: "",
        txtItem_CD: "",
        txtItem_NM: "",
        txtAccount_C_PK: "",
        txtAccount_CD_C: "",
        txtAccount_NM_C: "",
        txtPL_C_PK: "",
        txtPL_CD_C: "",
        txtPL_NM_C: "",
        txtPL_D_PK: "",
        txtPL_CD_D: "",
        txtPL_NM_D: "",
        txtAccount_D_PK: "",
        txtAccount_CD_D: "",
        txtAccount_NM_D: "",
		dtFrom: "", 
		dtTo: "",
        showGridMaster: false,
        myIcon: 'mdi-arrow-down-bold-box-outline',
        selectedItemKeys: [],
        selectList: [],
        lstACC_DC: "",
        aCC_DCList: [{
                CODE: "",
                NAME: "ALL"
            },
            {
                CODE: "1",
                NAME: "Debit"
            },
            {
                CODE: "2",
                NAME: "Credit"
            }
        ],
        lstPL_DC: "",
        pL_DCList: [{
                CODE: "",
                NAME: "ALL"
            },
            {
                CODE: "1",
                NAME: "Debit"
            },
            {
                CODE: "2",
                NAME: "Credit"
            }
        ],
        txtAccount_PK: "",
        txtAccount_CD: "",
        txtAccount_NM: "",
        txtPL_PK: "",
        txtPL_CD: "",
        txtPL_NM: "",
        tab_control: 0,
        txtItem_PK: "",
        dataListIN: [],
        dataListOUT: [],
        dataListBAL: [],
        plCenterList: [],
        dialogTitle: "",
        listData: [],
        listLabel: "",
        codeLabel: "",
        nameLabel: "",
        procedure: "",
        moreParas: null,
        autoSearch: false,
        dynamicHeader: [],
        multiSelectMode: false,
        bizPlaceList: [],
        lstBizPlace: "",

        l_txtAccount_NM_D: "",
        l_txtAccount_NM_C: "",
        l_txtAccount: "",
        l_txtItem: "",

        l_txtPL_D: "",
        l_txtPL_C: "",
        l_txtPL: "",
        chkUnitYN: "",

        currentPK: null,
        grdType: "",
        bizCenterList: [],
        lstBizCenter: '',

    }),

    created() {
		this.lstCompany = [{PK: '01', TEXT: 'ORDER DATE'}, {PK: '02', TEXT: 'DELIVERY DATE-CUSTOMER'}, {PK: '03', TEXT: 'DELIVERY DATE-SHINWOO'}]; 
		//this.selectedCompany='01';
        //this.getListCodes();
    },
    watch: {
        tab_control(val) {
            if (val == "2" || val == "3") {
                this.grdType = "show";
            } else {
                this.grdType = "";
            }
        },
        l_txtItem(val) {
            if (!val) {
                this.txtItem_CD = '';
                this.txtItem_NM = '';
                this.txtItem_PK = '';
            } else {
                this.txtItem_CD = val;
            }
        }
    },
    computed: {
        user() {
            return this.$store.getters["auth/user"]
        },
        limitHeight() {
            if (this.$vuetify.breakpoint.lgAndUp) {
                return this.formContainerHeight - 77
            } else if (this.$vuetify.breakpoint.mdAndDown && !this.$vuetify.breakpoint.xsOnly) {
                return this.formContainerHeight - 400
            } else {
                return
            }

        },
		//====================
		lstOrderType() {
			  return [
				{ value: "", text: "SELECT ALL" },
				{ value: "NM", text: "Normal" },
				{ value: "SP",text: "Sample" },
				{ value: "CS", text: "Compensation" },
				{ value: "TE",text: "Test" },
				{ value: "OT", text: "Other" }
			  ]
			},
		//===================
        headersIOB() {
            const self = this;
            return [{
                    dataField: "CUST_NAME_ENG",
                    caption: this.$t("Customer"),
                    width: "100"
                },
                {
                    dataField: "KIND_NAME",
                    caption: this.$t("KIND_NAME"),
                    width: "200"
                },
                {
                    dataField: "TYPE_WEAR",
                    caption: this.$t("TYPE_WEAR"),
					dataType: 'number',
                    formatFloat: 0,
                    width: "100"
                },
                {
                    dataField: "TYPE_ACC",
                    caption: this.$t("TYPE_ACC"),
					dataType: 'number',
                    formatFloat: 0,
                    width: "100"
                },
                {
                    dataField: "QTY_RFID_Y",
                    caption: this.$t("QTY(RFID)"),
					dataType: 'number',
                    formatFloat: 0,
                    width: "80"
                },
                {
                    dataField: "QTY_RFID_N",
                    caption: this.$t("QTY(NORMAL)"),
					dataType: 'number',
                    formatFloat: 0,
                    width: "100"
                },
                {
                    dataField: "KIND_PR_MODE",
                    caption: this.$t("KIND_PR_MODE"),
                    width: "0"
                },
                
                {
                    dataField: "TOTAL_QTY",
                    caption: this.$t("TOTAL_QTY"),
                    dataType: 'number',
                    formatFloat: 0,
                    width: "100",
                    allowEditing: false,
                }
                
            ]
        },
		
        headersBAL() {
            const self = this;
            return [{
                    dataField: "CUST_NAME_ENG",
                    caption: this.$t("Customer"),
                    width: "100"
                },
				{
                    dataField: "LOCATION_NAME",
                    caption: this.$t("LOCATION_NAME"),
                    width: "100"
                },
                {
                    dataField: "KIND_NAME",
                    caption: this.$t("KIND_NAME"),
                    width: "200"
                },
                {
                    dataField: "TYPE_WEAR",
                    caption: this.$t("TYPE_WEAR"),
					dataType: 'number',
                    formatFloat: 0,
                    width: "100"
                },
                {
                    dataField: "TYPE_ACC",
                    caption: this.$t("TYPE_ACC"),
					dataType: 'number',
                    formatFloat: 0,
                    width: "100"
                },
                {
                    dataField: "QTY_RFID_Y",
                    caption: this.$t("QTY(RFID)"),
					dataType: 'number',
                    formatFloat: 0,
                    width: "80"
                },
                {
                    dataField: "QTY_RFID_N",
                    caption: this.$t("QTY(NORMAL)"),
					dataType: 'number',
                    formatFloat: 0,
                    width: "100"
                },
                {
                    dataField: "KIND_PR_MODE",
                    caption: this.$t("KIND_PR_MODE"),
                    width: "0"
                },
                
                {
                    dataField: "TOTAL_QTY",
                    caption: this.$t("TOTAL_QTY"),
                    dataType: 'number',
                    formatFloat: 0,
                    width: "100",
                    allowEditing: false,
                }
            ]
        },
        headersOUT() {
            const self = this;
            return [
                {
                    dataField: "KIND_NAME",
                    caption: this.$t("KIND_NAME"),
                    width: "200"
                },
                {
                    dataField: "TYPE_WEAR",
                    caption: this.$t("TYPE_WEAR"),
					dataType: 'number',
                    formatFloat: 0,
                    width: "100"
                },
                {
                    dataField: "TYPE_ACC",
                    caption: this.$t("TYPE_ACC"),
					dataType: 'number',
                    formatFloat: 0,
                    width: "100"
                },
                {
                    dataField: "QTY_RFID_Y",
                    caption: this.$t("QTY(RFID)"),
					dataType: 'number',
                    //summaryType: "sum", 
					formatFloat: "0",
                    width: "80"
                },
                {
                    dataField: "QTY_RFID_N",
                    caption: this.$t("QTY(NORMAL)"),
					dataType: 'number',
					//summaryType: "sum", 
					formatFloat: "0",
                    width: "100"
                },
                {
                    dataField: "KIND_PR_MODE",
                    caption: this.$t("KIND_PR_MODE"),
                    width: "0"
                },
                
                {
                    dataField: "TOTAL_QTY",
                    caption: this.$t("TOTAL_QTY"),
                    dataType: 'number',
                    //summaryType: "sum", 
					formatFloat: "0",
                    width: "100",
                    allowEditing: false,
                }
            ]
        },
        headersIN() {
            const self = this;
            return [{
                    dataField: "CUST_NAME_ENG",
                    caption: this.$t("Customer"),
                    width: "100"
                },
                {
                    dataField: "KIND_NAME",
                    caption: this.$t("KIND_NAME"),
                    width: "200"
                },
                {
                    dataField: "ORDER_TYPE",
                    caption: this.$t("ORDER_TYPE"),
                    width: "100"
                },
                
                {
                    dataField: "QTY_RFID_Y",
                    caption: this.$t("QTY(RFID)"),
					dataType: 'number',
                    formatFloat: 0,
                    width: "80"
                },
                {
                    dataField: "QTY_RFID_N",
                    caption: this.$t("QTY(NORMAL)"),
					dataType: 'number',
                    formatFloat: 0,
                    width: "100"
                },
                {
                    dataField: "KIND_PR_MODE",
                    caption: this.$t("KIND_PR_MODE"),
                    width: "0"
                },
                
                {
                    dataField: "TOTAL_QTY",
                    caption: this.$t("TOTAL_QTY"),
                    dataType: 'number',
                    formatFloat: 0,
                    width: "100",
                    allowEditing: false,
                }
            ]
        }
    },
    mounted() {
        //this.selectedCompany = '01';//this.user.TCO_COMPANY_PK;
    },
    methods: {
        async getListCodes() {
            const dso_company_list = {
                type: 'list',
                selpro: 'SYS_SEL_LIST_COMPANY',
                para: [this.user.PK]
            }
            this.companyList = await this._dsoCall(dso_company_list, 'select', false)
            this.selectedCompany = this.companyList[0].PK

            const dso_warehouse_list = {
                type: 'list',
                selpro: 'SYS_SEL_LIST_WH',
                para: [this.user.PK]
            }
            this.wareHouseList = await this._dsoCall(dso_warehouse_list, 'select', false)
            this.wareHouseList.unshift({
                CODE: "",
                NAME: "Select ALL"
            });
            this.lstWareHouse = '';

            const dso_trtype_list = {
                type: 'list',
                selpro: 'SYS_SEL_LIST_TRTYPE_2',
                para: [this.user.PK]
            }
            this.trTypeList = await this._dsoCall(dso_trtype_list, 'select', false)
            this.trTypeList.unshift({
                CODE: "",
                NAME: "Select ALL"
            });
            this.lstTrType = '';

            const dso_PL_grp_list = {
                type: 'list',
                selpro: 'SYS_SEL_COST_CENTER_DIALOG',
                para: [this.user.TCO_COMPANY_PK, '', '']
            }
            this.plCenterList = await this._dsoCall(dso_PL_grp_list, 'select', false);

            const dso_bizplace_list = {
                type: 'list',
                selpro: 'SYS_SEL_BIZ_PLACE_V2',
                para: [this.selectedCompany, this.user.PK]
            }
            this.bizPlaceList = await this._dsoCall(dso_bizplace_list, 'select', false)
            if (this.bizPlaceList.length > 0) {
                this.lstBizPlace = this.bizPlaceList[0].PK;
            };

            this.getBizCenter();
        },
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
        async changeCompany() {
            const dso_companyL_list = {
                type: 'list',
                selpro: 'AC_LST_6080020_COMPANY',
                para: [this.selectedCompany, this.lstWareHouseType]
            }
            this.wareHouseList = await this._dsoCall(dso_companyL_list, 'select', false)
            this.lstWareHouse = 'ALL';

            const dso_bizplace_list = {
                type: 'list',
                selpro: 'SYS_SEL_BIZ_PLACE_V2',
                para: [this.selectedCompany, this.user.PK]
            }
            this.bizPlaceList = await this._dsoCall(dso_bizplace_list, 'select', false)
            if (this.bizPlaceList.length > 0) {
                this.lstBizPlace = this.bizPlaceList[0].PK;
            } else {
                this.lstBizPlace = [];
            };
        },

        handleReturnedPartner(data) {
            this.partnerPK = data.PK
            this.partner = `${data.PARTNER_ID} - ${data.PARTNER_NAME}`
        },

        async search() {
            console.log(this.tab_control);
			//=============================
			//alert(this.selectedCompany);
			if (!this.selectedCompany) {
                    this.$refs.selectedCompany.focus();
                    return this.showNotification(
                        "warning",
                        this.$t("please_select_date_type_to search"),
                        "",
                        5000
                    );
			}
			//===================================
            let code = this.tab_control;
            switch (code) {
                case 0:
                    this.$refs.dataGridIOB.loadData();
                    break;
                case 1:
                    this.$refs.dataGridBAL.loadData();

                    break;
                case 2:
                    this.$refs.dataGridOUT.loadData();
                    break;
                case 3:
                    this.$refs.dataGridIN.loadData();
                    break;
            }
        },

        onRowDblClick({
            rowType,
            data
        }) {
            /* if(rowType === "data") {
               this.currentSeq = data.SEQ
               this.seqArray = this. dataListIOB.map(x => x.SEQ)
               this.$refs.accountSlipDialog.dialogIsShow = true
             }*/
        },
        openPLDialog(obj) {
            switch (obj) {
                case "S":
                    this.$refs.refPLCenter.dialogIsShow = true
                    break;
                case "D":
                    this.$refs.refPLCenterDebit.dialogIsShow = true
                    break;
                case "C":
                    this.$refs.refPLCenterCrebit.dialogIsShow = true
                    break;
            }
        },
        onDelete() {
            for (let i = 0; i < this.dataListIOB.length; i++) {
                if (this.selectList.includes(this.dataListIOB[i].PK)) {
                    this.dataListIOB[i]._rowstatus = "d";
                }
            }
            this.onSave();
        },
        async onSave() {
            let code = this.tab_control;
            switch (code) {
                case 0:

                    break;
                case 1:

                    break;
                case 2:
                    this.$refs.dataGridOUT.saveData();
                    break;
                case 3:
                    this.$refs.dataGridIN.saveData();
                    break;
            }
        },
        onFill(obj) {

            if (this.selectList.length == 0) {
                this.showNotification("warning", this.$t("you_select_a_row"), "");
                return;
            } else {
                let code = this.tab_control;
                console.log(obj);
                switch (obj) {
                    case "1":
                        switch (code) {
                            case 0:
                                break;
                            case 1:
                                break;
                            case 2:
                                let userIdx2 = this.$refs.dataGridOUT.getDataSource().findIndex((d) => d["PK"] == this.selectList.PK);
                                if (userIdx2 > -1) {
                                    this.$refs.dataGridOUT.setCellSelected("PL_DR", this.txtPL_D_PK)
                                }
                                break;
                            case 3:
                                let userIdx3 = this.$refs.dataGridIN.getDataSource().findIndex((d) => d["PK"] == this.selectList.PK);
                                if (userIdx3 > -1) {
                                    this.$refs.dataGridIN.setCellSelected("PL_DR", this.txtPL_D_PK)
                                }
                                break;
                        }
                        break;
                    case "2":
                        switch (code) {
                            case 0:
                                break;
                            case 1:
                                break;
                            case 2:
                                let userIdx2 = this.$refs.dataGridOUT.getDataSource().findIndex((d) => d["PK"] == this.selectList.PK);
                                if (userIdx2 > -1) {
                                    this.$refs.dataGridOUT.setCellSelected("PL_CR", this.txtPL_C_PK)
                                }
                                break;
                            case 3:
                                let userIdx3 = this.$refs.dataGridIN.getDataSource().findIndex((d) => d["PK"] == this.selectList.PK);
                                if (userIdx3 > -1) {
                                    this.$refs.dataGridIN.setCellSelected("PL_CR", this.txtPL_C_PK)
                                }
                                break;
                        }
                        break;
                    case "3":
                        switch (code) {
                            case 0:
                                break;
                            case 1:
                                break;
                            case 2:
                                let userIdx2 = this.$refs.dataGridOUT.getDataSource().findIndex((d) => d["PK"] == this.selectList.PK);
                                if (userIdx2 > -1) {
                                    this.$refs.dataGridOUT.setCellSelected("AC_DR", this.txtAccount_D_PK);
                                    this.$refs.dataGridOUT.setCellSelected("ACCD_DR", this.txtAccount_CD_D);
                                }
                                break;
                            case 3:
                                let userIdx3 = this.$refs.dataGridIN.getDataSource().findIndex((d) => d["PK"] == this.selectList.PK);
                                if (userIdx3 > -1) {
                                    this.$refs.dataGridIN.setCellSelected("AC_DR", this.txtAccount_D_PK);
                                    this.$refs.dataGridIN.setCellSelected("ACCD_DR", this.txtAccount_CD_D);
                                }
                                break;
                        }
                        break;
                    case "4":
                        switch (code) {
                            case 0:
                                break;
                            case 1:
                                break;
                            case 2:
                                let userIdx2 = this.$refs.dataGridOUT.getDataSource().findIndex((d) => d["PK"] == this.selectList.PK);
                                if (userIdx2 > -1) {
                                    this.$refs.dataGridOUT.setCellSelected("AC_CR", this.txtAccount_C_PK);
                                    this.$refs.dataGridOUT.setCellSelected("ACCD_CR", this.txtAccount_CD_C);
                                }
                                break;
                            case 3:
                                let userIdx3 = this.$refs.dataGridIN.getDataSource().findIndex((d) => d["PK"] == this.selectList.PK);
                                if (userIdx3 > -1) {
                                    this.$refs.dataGridIN.setCellSelected("AC_CR", this.txtAccount_C_PK);
                                    this.$refs.dataGridIN.setCellSelected("ACCD_CR", this.txtAccount_CD_C);
                                }
                                break;
                        }
                        break;
                    case "5":
                        // if (userIdx > -1) {
                        //     this.dataList[userIdx].ACTIVE_YN = this.lstActiveFlag;
                        //     if (this.dataList[userIdx]._rowstatus !== "i") {
                        //       this.dataList[userIdx]._rowstatus = "u";
                        //     }
                        //   }
                        break;
                }
            }
        },
        openAccountDialog(obj) {
            switch (obj) {
                case "S":
                    this.$refs.accountDialog.dialogIsShow = true
                    break;
                case "D":
                    this.$refs.accountDebitDialog.dialogIsShow = true
                    break;
                case "C":
                    this.$refs.accountCrebitDialog.dialogIsShow = true
                    break;
            }
        },
        async openItemDialog() {
            this.listData = await this._callProcedure("lg_sel_itemgroup_list", [this.selectedCompany, ]);
            this.dialogTitle = this.$t("item_code");
            this.listLabel = this.$t("item_group");
            this.codeLabel = this.$t("item_code");
            this.nameLabel = this.$t("item_name");
            this.dynamicHeader = this.BuildDynamicHeader("TLG_IT_ITEM");
            this.procedure = "lg_sel_item_dynamic_dlg";
            this.moreParas = null;
            this.autoSearch = true;
            this.multiSelectMode = false;
            this.$refs.refDynamicDialog.dialogIsShow = true;
            //this.selectedAccount = { ...row };
        },
        onReset(obj) {
            switch (obj) {
                case "1":
                    this.txtPL_D_PK = "";
                    this.txtPL_CD_D = "";
                    this.txtPL_NM_D = "";
                    this.l_txtPL_D = "";
                    break;

                case "2":
                    this.txtPL_C_PK = "";
                    this.txtPL_CD_C = "";
                    this.txtPL_NM_C = "";
                    this.l_txtPL_C = "";
                    break;

                case "3":
                    this.txtAccount_D_PK = "";
                    this.txtAccount_CD_D = "";
                    this.txtAccount_NM_D = "";
                    this.l_txtAccount_NM_D = "";
                    break;

                case "4":
                    this.txtAccount_C_PK = "";
                    this.txtAccount_CD_C = "";
                    this.txtAccount_NM_C = "";
                    this.l_txtAccount_NM_C = "";
                    break;
                case "5":
                    this.txtAccount_PK = "";
                    this.txtAccount_CD = "";
                    this.txtAccount_NM = "";
                    this.l_txtAccount = "";
                    break;
                case "6":
                    this.txtPL_PK = "";
                    this.txtPL_CD = "";
                    this.txtPL_NM = "";
                    this.l_txtPL = "";
                    break;
                case "7":
                    this.txtItem_CD = "";
                    this.txtItem_NM = "";
                    this.txtItem_PK = "";
                    this.l_txtItem = "";
                    break;
            }
        },
        getUppAccDebitDialog(item) {
            if (item) {
                this.txtAccount_D_PK = item.PK;
                this.txtAccount_CD_D = item.AC_CD;
                this.txtAccount_NM_D = item.AC_NM;
                this.l_txtAccount_NM_D = item.AC_CD + ' - ' + item.AC_NM;
            }

        },
        getUppAccCrebitDialog(item) {
            if (item) {
                this.txtAccount_CD_C = item.AC_CD;
                this.txtAccount_C_PK = item.PK;
                this.txtAccount_NM_C = item.AC_NM;
                this.l_txtAccount_NM_C = item.AC_CD + ' - ' + item.AC_NM;
            }

        },
        getUppAccDialog(item) {
            if (item) {
                this.txtAccount_CD = item.AC_CD;
                this.txtAccount_PK = item.PK;
                this.txtAccount_NM = item.AC_NM;
                this.l_txtAccount = item.AC_CD + ' - ' + item.AC_NM;
            }
        },

        async OnSetALL(obj) {
            switch (obj) {
                case "1":
                    const dso = {
                        type: "process",
                        updpro: "AC_PRO_6080020_1",
                        para: [this.selectedCompany, this.dtMonth]
                    };
                    const result = await this._dsoCall(dso, "process", false);
                    if (result.length > 0) {
                        this.showNotification(
                            "success",
                            this.$t("process_success", "common"),
                            ""
                        );
                    }
                    break;
                case "2":
                    const dso2 = {
                        type: "process",
                        updpro: "AC_PRO_6080020_2",
                        para: [this.selectedCompany, this.dtMonth]
                    };
                    const result2 = await this._dsoCall(dso2, "process", false);
                    if (result2.length > 0) {
                        this.showNotification(
                            "success",
                            this.$t("process_success", "common"),
                            ""
                        );
                    }
                    break;
            }
        },
        async OnUpd_LG() {
            const dso2 = {
                type: "process",
                updpro: "AC_PRO_6080020_2",
                para: [this.selectedCompany, this.dtMonth]
            };
            const result2 = await this._dsoCall(dso2, "process", false);
            if (result2.length > 0) {
                this.showNotification(
                    "success",
                    this.$t("process_success", "common"),
                    ""
                );
            }
        },

        mappingPLDebitCenter(item) {
            if (item) {
                this.txtPL_D_PK = item.PK;
                this.txtPL_CD_D = item.CODE;
                this.txtPL_NM_D = item.NAME;
                this.l_txtPL_D = item.CODE + ' - ' + item.NAME;
            }
        },
        mappingPLCrebitCenter(item) {
            if (item) {
                this.txtPL_C_PK = item.PK;
                this.txtPL_CD_C = item.CODE;
                this.txtPL_NM_C = item.NAME;
                this.l_txtPL_C = item.CODE + ' - ' + item.NAME;
            }
        },
        mappingPLCenter(item) {
            if (item) {
                this.txtPL_PK = item.PK;
                this.txtPL_CD = item.CODE;
                this.txtPL_NM = item.NAME;
                this.l_txtPL = item.CODE + ' - ' + item.NAME;
            }
        },
        selectionChanged({
            data
        }) {
            this.selectList = data;
        },
        onShowFullDetails() {
            if (this.myIcon == "mdi-arrow-up-bold-box-outline") {
                this.myIcon = "mdi-arrow-down-bold-box-outline";
                this.showGridMaster = false;
            } else {
                this.myIcon = "mdi-arrow-up-bold-box-outline";
                this.showGridMaster = true;
            }

            if (this.showGridMaster)
                this.limitHeightGridDetails =
                this.windowHeight - (320 + this.decreaseHeight);
            else this.limitHeightGridDetails = this.windowHeight - 320;
        },
        async OnPrint() {		
						let code = this.tab_control;
						switch (code) {
							case 0://reprt case summary customer
									let p_param = [
										this.dtFrom,
										this.dtTo,		
										this.selectedCompany,
										this.selectedOrderType
										];
										let report_no = "01";
										let report_path = "";
										let report_name = "";   
										let report_name_ext = "xlsx";        
										let excel = [];

									let report = "rpt_swso450_sumary_report";
										report_name = "rpt_swso470_sumary_report";
											
									  try{
									  //alert(p_param);
										this._ExcelSaveAs(await this.$axios.$get('/dso/makereport', {responseType: "blob", params: {
										  template: "report/sw/10/" + report + ".xlsx",
										  excel: JSON.stringify([{
											insertRange: [{
											  range: "A2:F2", proc: "SW_SEL_SW10470_ORDER_NOCACHE", params: [...p_param]//SW_SEL_SW10110_export_custom
											}],
											insertRows: [{
												startRow: 4, proc: "SW_SEL_SW10470_ORDER_NOCACHE", params: [...p_param], stringColumns: [ "CUSTOMER_NAME","KIND_NAME"], subStyle: { font : {   bold: true   } , fill: {
																		type: 'pattern',
																		pattern:'solid',
																		fgColor : { argb: 'FFE599'},
																		bgColor : { argb: 'FFE599'}
																	  } }
											},
											]
										  }]),
										  convert: "xlsx"}
										}), report_name + "." + "xlsx");
									  } catch (e) {
										this.showNotification("danger", this.$t("fail_to_export_report"), "", 4000);
									  }
							break;
							case 1://case report location
								 p_param = [
										this.dtFrom,
										this.dtTo,		
										this.selectedCompany,
										this.selectedOrderType
										];
										 report_no = "01";
										 report_path = "";
										 report_name = "";   
										 report_name_ext = "xlsx";        
										 excel = [];

									 report = "rpt_swso450_sumary_location_report";
										report_name = "rpt_swso470_sumary_location_report";
											
									  try{
									  //alert(p_param);
										this._ExcelSaveAs(await this.$axios.$get('/dso/makereport', {responseType: "blob", params: {
										  template: "report/sw/10/" + report + ".xlsx",
										  excel: JSON.stringify([{
											insertRange: [{
											  range: "A2:F2", proc: "SW_SEL_SW10470_LOCATION_NOCACHE", params: [...p_param]//SW_SEL_SW10110_export_custom
											}],
											insertRows: [{
												startRow: 4, proc: "SW_SEL_SW10470_LOCATION_NOCACHE", params: [...p_param], stringColumns: [ "CUSTOMER_NAME","KIND_NAME"], subStyle: { font : {   bold: true   } , fill: {
																		type: 'pattern',
																		pattern:'solid',
																		fgColor : { argb: 'FFE599'},
																		bgColor : { argb: 'FFE599'}
																	  } }
											},
											]
										  }]),
										  convert: "xlsx"}
										}), report_name + "." + "xlsx");
									  } catch (e) {
										this.showNotification("danger", this.$t("fail_to_export_report"), "", 4000);
									  }

							break;
							case 2://case report location
								 p_param = [
										this.dtFrom,
										this.dtTo,		
										this.selectedCompany,
										this.selectedOrderType
										];
										 report_no = "01";
										 report_path = "";
										 report_name = "";   
										 report_name_ext = "xlsx";        
										 excel = [];

									 report = "rpt_swso450_sumary_report_all";
										report_name = "rpt_swso470_sumary_report_all";
											
									  try{
									  //alert(p_param);
										this._ExcelSaveAs(await this.$axios.$get('/dso/makereport', {responseType: "blob", params: {
										  template: "report/sw/10/" + report + ".xlsx",
										  excel: JSON.stringify([{
											insertRange: [{
											  range: "A2:F2", proc: "SW_SEL_SW10470_SUM_TYPE_NOCACHE", params: [...p_param]//SW_SEL_SW10110_export_custom
											}],
											insertRows: [{
												startRow: 4, proc: "SW_SEL_SW10470_SUM_TYPE_NOCACHE", params: [...p_param], stringColumns: [ "KIND_NAME","KIND_NAME"], subStyle: { font : {   bold: true   } , fill: {
																		type: 'pattern',
																		pattern:'solid',
																		fgColor : { argb: 'FFE599'},
																		bgColor : { argb: 'FFE599'}
																	  } }
											},
											]
										  }]),
										  convert: "xlsx"}
										}), report_name + "." + "xlsx");
									  } catch (e) {
										this.showNotification("danger", this.$t("fail_to_export_report"), "", 4000);
									  }

							break;
							
						}
			  },
			 print() {},
        BuildDynamicHeader(p_table_nm) {
            let header = [];
            if (p_table_nm == "TLG_IT_ITEM") {
                header = [{
                        dataField: "ITEM_CODE",
                        caption: this.codeLabel,
                    },
                    {
                        dataField: "ITEM_NAME",
                        caption: this.nameLabel,
                    },
                    {
                        dataField: "UOM",
                        caption: this.$t("uom"),
                    },
                    {
                        dataField: "ITEMGRP_NAME",
                        caption: this.$t("item_grp"),
                    },
                    {
                        dataField: "DESCRIPTION",
                        caption: this.$t("description"),
                    }

                ];
                return header;
            }
        },
        onSelectItemInfo(item) {
            if (item.PK !== undefined || item.PK !== "") {
                //if (this.$refs.grdItemInfo_N.getSelectRowsData()[0].PK.length == 0)  _rowstatus: 'i'
                /* this.$refs.grdItemInfo_N.setCellSelected("TCO_ITEM_PK",  item[0].PK)  		                 this.$refs.grdItemInfo_N.setCellSelected("ITEM_CODE",    item[0].ITEM_CODE)           
                 this.$refs.grdItemInfo_N.setCellSelected("ITEM_NAME",    item[0].ITEM_NAME)           
                 this.$refs.grdItemInfo_N.setCellSelected("ATTRIBUTE2",   item[0].ITEM_NAME)           
                 this.$refs.grdItemInfo_N.setCellSelected("WH_NAME",      item[0].WH_NAME)             
                 this.$refs.grdItemInfo_N.setCellSelected("TIN_WAREHOUSE_PK",item[0].TLG_IN_STORAGE_PK)
                 this.$refs.grdItemInfo_N.setCellSelected("ITEM_UOM",     item[0].UOM)  */

                this.txtItem_CD = item.ITEM_CODE;
                this.txtItem_NM = item.ITEM_NAME;
                this.txtItem_PK = item.PK;
                this.l_txtItem = item.ITEM_CODE + ' - ' + item.ITEM_NAME;
            }
        },
        async getBizCenter() {
            this.bizCenterList = [];
            const dso_bizcenter_list = {
                type: 'list',
                selpro: 'AC_SEL_BIZ_BY_COMPANY',
                para: [this.selectedCompany]
            }
            this.bizCenterList = await this._dsoCall(dso_bizcenter_list, 'select', false)
            if (this.bizCenterList.length > 0) {
                this.lstBizCenter = this.bizCenterList[0].PK;
            }
        },
    }
}
</script>
