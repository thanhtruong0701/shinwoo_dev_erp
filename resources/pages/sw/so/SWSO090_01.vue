<template>
<v-container fluid class="px-0 pt-0">
    <v-row>
        <v-col cols="12">
            <v-card>
                <v-container fluid class="pt-0">
                    <v-row dense class="pa-1">
                        <v-col cols="3">
                            <BaseSelect :label="$t('Item')" v-model="selectedCompany" :lstData="companyList" item-text="TEXT" item-value="PK" @change="onChangeCompany" />
                        </v-col>
                        <v-col cols="2">
						<!--BaseDatePicker  v-model="selectedReceiveFrom" outlined  :label="$t('receive_dt_from')"  ></BaseDatePicker-->
                            <BaseDatePicker v-model="month" outlined :label="$t('date')" default></BaseDatePicker> 
                        </v-col>
                        <v-col cols="3">
                            <BaseInput :label="$t('PO_NO/STYLE_COLOR')" v-model="txtAccCD_NM" @dblClick="openAccountDialog">
                                <template v-slot:append>
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on }">
                                            <v-icon v-on="on" :color="currentTheme" @click="openAccountDialog">mdi-window-restore</v-icon>
                                        </template>
                                    </v-tooltip>
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on }">
                                            <v-icon v-on="on" :color="currentTheme" @click="txtAccCD_NM = '', txtAccountCode = '', txtAccountName = '' ">mdi-eraser</v-icon>  
                                        </template>
                                    </v-tooltip>
                                </template>
                            </BaseInput>
                        </v-col>
                        <v-spacer />
                        <div class='d-flex'>
                            <BaseButton icon_type="search" :btn_text="$t('search')" @onclick="search" /> 
							<BaseButton icon_type="delete" :btn_text="$t('Delete')" @onclick="save" />
							<BaseButton icon_type="print" :btn_text="$t('print')"  @onclick="onReport" />
                            <!--BaseButton icon_type="new" :btn_text="$t('addnew')" @onclick="addNew" /-->
                            <!--BaseButton icon_type="delete" :btn_text="$t('delete')" @onclick="markDeleteItems" /-->
                            
                            <!--BaseButton icon_type="excel" :btn_text="$t('excel')" @onclick="print" /-->
                        </div>
                    </v-row>
                    <v-row dense>
                        <v-col cols="3">
                            <BaseSelect :label="$t('FACTORY')" v-model="lstFactory" :lstData="bizPlaceList" item-text="TEXT" item-value="PK" @change="onChangeFactory"  />
                        </v-col>
                        <v-col cols="1">
                            <BaseSelect :label="$t('account_type')" v-model="selectedAccountType" :lstData="accountTypeList" item-text="NAME" item-value="CODE" />
                        </v-col>
                        <v-col cols="3">
                            <BaseInput :label="$t('partner_id')" v-model="txtPartnerCD_NM" @dblClick="openPartnerDialog">
                                <template v-slot:append>  
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on }">
                                            <v-icon v-on="on" :color="currentTheme" @click="openPartnerDialog">mdi-window-restore</v-icon>
                                        </template>
                                    </v-tooltip>
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on }">
                                            <v-icon v-on="on" :color="currentTheme" @click="txtPartnerCD_NM = '', txtPartnerID = '', txtPartnerName = '' ">mdi-eraser</v-icon>
                                        </template>
                                    </v-tooltip>
                                </template>
                            </BaseInput>
                        </v-col>
                        <v-col />
                        <v-col cols="3">
                            <GwImportExcelFile :label="$t('import_file')" 
							:impTempFile="imp_template_file" 
							:impProc="imp_store_prod" 
							:impStartRow="imp_start_row" 
							:impEndCol="impEndCol" 
							:impValidValue ="impValidValue"
							:impValidCol= "impValidCol"
							:impAddParam="[this.month.replace('-', ''), selectedCompany, lstFactory]" @onAfterImport="onAfterImport"></GwImportExcelFile>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card> 
        </v-col>
    </v-row>

    <v-row>
        <v-col md="4" cols="4" class="align-self-center">
            <v-btn-toggle dense mandatory :color="currentTheme" v-model="selectedTab">
                <v-btn value="tabAccount">{{ $t("Order") }}</v-btn>
                <v-btn value="tabCustomer">{{ $t("MCL") }}</v-btn>
                <v-btn value="tabBank">{{ $t("Translate") }}</v-btn>
                <v-btn value="tabPL">{{ $t("Export Data") }}</v-btn>
            </v-btn-toggle>
        </v-col>
    </v-row>
    <v-row no-gutters>
        <v-col>
            <keep-alive>
                <component :is="selectedTab" :ref="selectedTab" :searchParams="searchData" :selectedCompany="selectedCompany"></component>
            </keep-alive>
        </v-col>
    </v-row>
    <account-dialog ref="accountDialog" @returnAccountInfo="mappingAccount"></account-dialog>
    <partner-dialog ref="partnerDialog" @callBackData="mappingPartner" :AcntType="true"  :companyPK="selectedCompany"></partner-dialog>
    <AttachmentsDialog ref="refAttachments" table_name="TSH_MATCHING_SAMPLE_FILE" :master_table_pk="0" />
</v-container>
</template> 

<script>
import GwImportExcelFile from '@/components/control/GwImportExcelFile.vue';
export default {
    layout: "default",  
    middleware: "user",

    components: {
        accountDialog: () => import("@/components/dialog/AccountDialog"),
        partnerDialog: () => import("@/components/dialog/PartnerDialog"),
        tabAccount: () => import("@/components/part/sw/10/SW10090_01_Order"),
        tabCustomer: () => import("@/components/part/sw/10/SW10090_MCL"),
        tabBank: () => import("@/components/part/sw/10/SW10090_Translate"),
        tabPL: () => import("@/components/part/sw/10/SW10090_01_ExportTemTaiwan"),
        AttachmentsDialog: () => import("@/components/dialog/AttachmentsDialog"),
        GwImportExcelFile
    },

    data: () => ({
        selectedTab: undefined,
        selectedCompany: "",
        txtAccountCode: "",
        txtAccountName: "",
        txtAccountCcy: "",
        txtAccCD_NM: "",
        txtPartnerID: "",
        txtPartnerName: "",
        txtPartnerCD_NM: "",
        companyList: [],
        inputSearch: "",
        searchType: "OBJ_ID",
        searchData: [],
        month: "",
        menu: false,
        modal: false,
        selectedAccountType: "Y",
        txtBookCCY: "",
        bizPlaceList: [],
        lstFactory: "",
        accountTypeList: [],
        selectedAccountType: "",
        imp_validate: "",
		imp_start_row:5,
        impEndCol: 6,
        imp_template_file: 'report/SW/10/RPT_IMP_ORDER_TAIWAN.xlsx',// RPT_IMP_ORDER_TAIWAN
        imp_store_prod: 'SW_IMP_SW10090_ORDER_NOCACHE',
		tab_staus:1,
		impValidValue:'',
		impValidCol:-1,
    }),
    async created() {
        //this.selectedCompany = this.user.TCO_COMPANY_PK;  
        /*const commoncode = await this._getCommonCode2(
            ["ACBG0040", "ACJS0060"],
            this.selectedCompany
        );
        const result = commoncode[0];
        result.forEach(e => {
            if (e.DEF_YN == "Y") {
                this.txtBookCCY = e.CODE;
            }
        });
        this.accountTypeList = commoncode[1];
        this.selectedAccountType = this.accountTypeList[0].CODE;*/
    },
    watch: {
        selectedTab(val) {
			this.impValidValue ='';
			this.impValidCol=-1;
            if (val == "tabAccount") {//ORDER
                
                    this.tab_staus=1;
					if(this.lstFactory=='J2')
					{
						//alert(this.lstFactory);
						this.impEndCol = 16;
						this.imp_start_row=9;
						this.imp_template_file = 'report/SW/10/RPT_IMP_ORDER_TAIWAN_J2.xlsx';
						this.imp_store_prod = 'SW_IMP_SW10090_01_ORDER_J2';
					} 
					if(this.lstFactory=='JE')
					{
						//alert(this.lstFactory);
						this.impEndCol = 152;
						this.imp_start_row=1;
						this.imp_template_file = 'report/SW/10/RPT_IMP_ORDER_TAIWAN_JE.xlsx';
						this.imp_store_prod = 'SW_IMP_SW10090_01_ORDER_JE';
					}
					if(this.lstFactory=='JJ')
					{
						//alert(this.lstFactory);
						this.impEndCol = 141;
						this.imp_start_row=7;
						this.imp_template_file = 'report/SW/10/RPT_IMP_ORDER_TAIWAN_JJ.xlsx';
						this.imp_store_prod = 'SW_IMP_SW10090_01_ORDER_JJ'; 
					}
					/*if(this.lstFactory=='JV')
					{
						//alert(this.lstFactory);
						this.impEndCol = 153;
						this.imp_start_row=1;
						this.imp_template_file = 'report/SW/10/RPT_IMP_ORDER_TAIWAN_JV.xlsx';
						this.imp_store_prod = 'SW_IMP_SW10090_01_ORDER_JV';
					}*/
					if(this.lstFactory=='JV1'||this.lstFactory=='JV2')
					{
						//alert(this.lstFactory);
						this.impEndCol = 19;
						this.imp_start_row=9;
						this.imp_template_file = 'report/SW/10/RPT_IMP_ORDER_TAIWAN_JV2.xlsx';
						this.imp_store_prod = 'SW_IMP_SW10090_01_ORDER_JV1';
					}
					if(this.lstFactory=='JX')
					{
						//alert(this.lstFactory);
						this.impEndCol = 53;
						this.imp_start_row=5;
						this.imp_template_file = 'report/SW/10/RPT_IMP_ORDER_TAIWAN_JX.xlsx';
						this.imp_store_prod = 'SW_IMP_SW10090_01_ORDER_JX';
					}
					if(this.lstFactory=='RJ')
					{
						//alert(this.lstFactory);
						this.impEndCol = 139;
						this.imp_start_row=1;
						this.imp_template_file = 'report/SW/10/RPT_IMP_ORDER_TAIWAN_RJ.xlsx';
						this.imp_store_prod = 'SW_IMP_SW10090_01_ORDER_RJ';
					}
					if(this.lstFactory=='IWE')
					{
						//alert(this.lstFactory);
						this.impEndCol = 12;
						this.imp_start_row=2;
						this.imp_template_file = 'report/SW/10/RPT_IMP_ORDER_TAIWAN_IWE.xlsx';
						this.imp_store_prod = 'SW_IMP_SW10090_01_ORDER_IWE';
					}
					if(this.lstFactory=='IWN')
					{
						//alert(this.lstFactory);
						this.impEndCol = 115;
						this.imp_start_row=2;
						this.imp_template_file = 'report/SW/10/RPT_IMP_ORDER_TAIWAN_IWN.xlsx';
						this.imp_store_prod = 'SW_IMP_SW10090_01_ORDER_IWN';
					}
					if(this.lstFactory=='IWW')
					{
						//alert(this.lstFactory);
						this.impEndCol = 117;
						this.imp_start_row=2;
						this.imp_template_file = 'report/SW/10/RPT_IMP_ORDER_TAIWAN_IWW.xlsx';
						this.imp_store_prod = 'SW_IMP_SW10090_01_ORDER_IWW';
					}
					if(this.lstFactory=='XM2')
					{
						//alert(this.lstFactory);
						this.impEndCol = 107;
						this.imp_start_row=1;
						this.imp_template_file = 'report/SW/10/RPT_IMP_ORDER_TAIWAN_XM2.xlsx';
						this.imp_store_prod = 'SW_IMP_SW10090_01_ORDER_XM2';
					}
            }
            if (val == "tabCustomer") {//MCL
				this.tab_staus=2;
				//onChangeFactory();
                this.impEndCol = 28;
				this.imp_start_row=2;
				this.impValidValue ='TW';
				this.impValidCol=8;
                this.imp_template_file = 'report/SW/10/RPT_IMP_MCL_TAIWAN.xlsx';
                this.imp_store_prod = 'SW_IMP_SW10090_MCL_NOCACHE';
            }
            if (val == "tabBank") {//Translate
				this.tab_staus=3;
				//onChangeFactory();
                //this.impEndCol = 9;
                //this.imp_template_file = 'report/60/45/imp_6045020_OPENING_BANK.xlsx';
                //this.imp_store_prod = 'AC_IMP_6045020_OP_BANK_NOCACHE';
            }
        }
    },
    mounted() {
        this.getCompanyList();
        const seft = this;
        document.addEventListener("paste", function (event) {
            var clipText = event.clipboardData.getData("Text"); 
            //console.log(clipText);
            seft.PasteRow(event);
        });
    },
    computed: {
        // accountTypeList() {
        //   return [
        //     { PK: "Y", TEXT: this.$t("posting") },
        //     { PK: "N", TEXT: this.$t("summary") },
        //     { PK: "%", TEXT: this.$t("select_all") }
        //   ];
        // },
        user() {
            return this.$store.getters["auth/user"];
        }
    },

    methods: {
        PasteRow(evt) { 
            let paras = {
                TCO_COMPANY_PK: this.selectedCompany//,
                //STD_YM: this.month.replace("-", "")
            };
            this.$refs[this.selectedTab].PasteRow(paras, evt);
        },
        openAccountDialog() {
            this.$refs.accountDialog.dialogIsShow = true;
        },
        openPartnerDialog() {
            this.$refs.partnerDialog.dialogIsShow = true; 
        },
        mappingAccount(item) {
            this.txtAccountCode = item.AC_CD;
            this.txtAccountName = item.AC_NM;
            this.txtAccCD_NM = item.AC_CD + ' - ' + item.AC_NM;
            this.txtAccountCcy = item.CCY;
        },
        mappingPartner(item) {
            this.txtPartnerID = item.PARTNER_ID;
            this.txtPartnerName = item.PARTNER_NAME;
            this.txtPartnerCD_NM = item.PARTNER_ID + ' - ' + item.PARTNER_NAME;  
        },
        async getCompanyList() {
            const dso = {
                type: "list",
                selpro: "sw_sel_list_company",
                para: ['TW']
            };
            const result = await this._dsoCall(dso, "select", false);
            if (result) {
                this.companyList = result; 
            } else {
                this.companyList = [];
            }
            /*const dso_bizplace_list = {
                type: 'list',
                selpro: 'sw_sel_factory',
                para: [this.selectedCompany, this.user.PK]
            }
            this.bizPlaceList = await this._dsoCall(dso_bizplace_list, 'select', false)
            if (this.bizPlaceList.length > 0) {
                //this.lstFactory = this.bizPlaceList[0].PK;
            }*/
        },
        async onChangeCompany() {
            this.bizPlaceList = [];
            const dso_bizplace_list = {
                type: 'list',
                selpro: 'sw_sel_factory_indo',
                para: [this.selectedCompany, this.user.PK]
            }
            this.bizPlaceList = await this._dsoCall(dso_bizplace_list, 'select', false)
            if (this.bizPlaceList.length > 0) {
                //this.lstFactory = this.bizPlaceList[0].PK; 
            }
        },
        async onChangeFactory() {
		
		//alert(this.lstFactory);

                if(this.tab_staus==1)
				{
					
					if(this.lstFactory=='J2')
					{
						//alert(this.lstFactory);
						this.impEndCol = 16;
						this.imp_start_row=9;
						this.imp_template_file = 'report/SW/10/RPT_IMP_ORDER_TAIWAN_J2.xlsx';
						this.imp_store_prod = 'SW_IMP_SW10090_01_ORDER_J2';
					} 
					if(this.lstFactory=='JE')
					{
						//alert(this.lstFactory);
						this.impEndCol = 152;
						this.imp_start_row=1;
						this.imp_template_file = 'report/SW/10/RPT_IMP_ORDER_TAIWAN_JE.xlsx';
						this.imp_store_prod = 'SW_IMP_SW10090_01_ORDER_JE';
					}
					if(this.lstFactory=='JJ')
					{
						//alert(this.lstFactory);
						this.impEndCol = 141;
						this.imp_start_row=7;
						this.imp_template_file = 'report/SW/10/RPT_IMP_ORDER_TAIWAN_JJ.xlsx';
						this.imp_store_prod = 'SW_IMP_SW10090_01_ORDER_JJ'; 
					}
					/*if(this.lstFactory=='JV')
					{
						//alert(this.lstFactory);
						this.impEndCol = 153;
						this.imp_start_row=1;
						this.imp_template_file = 'report/SW/10/RPT_IMP_ORDER_TAIWAN_JV.xlsx';
						this.imp_store_prod = 'SW_IMP_SW10090_01_ORDER_JV';
					}*/
					if(this.lstFactory=='JV1'||this.lstFactory=='JV2')
					{
						//alert(this.lstFactory);
						this.impEndCol = 19;
						this.imp_start_row=9;
						this.imp_template_file = 'report/SW/10/RPT_IMP_ORDER_TAIWAN_JV2.xlsx';
						this.imp_store_prod = 'SW_IMP_SW10090_01_ORDER_JV1';
					}
					if(this.lstFactory=='JX')
					{
						//alert(this.lstFactory);
						this.impEndCol = 53;
						this.imp_start_row=5;
						this.imp_template_file = 'report/SW/10/RPT_IMP_ORDER_TAIWAN_JX.xlsx';
						this.imp_store_prod = 'SW_IMP_SW10090_01_ORDER_JX';
					}
					if(this.lstFactory=='RJ')
					{
						//alert(this.lstFactory);
						this.impEndCol = 139;
						this.imp_start_row=1;
						this.imp_template_file = 'report/SW/10/RPT_IMP_ORDER_TAIWAN_RJ.xlsx';
						this.imp_store_prod = 'SW_IMP_SW10090_01_ORDER_RJ';
					}
					if(this.lstFactory=='IWE')
					{
						//alert(this.lstFactory);
						this.impEndCol = 12;
						this.imp_start_row=2;
						this.imp_template_file = 'report/SW/10/RPT_IMP_ORDER_TAIWAN_IWE.xlsx';
						this.imp_store_prod = 'SW_IMP_SW10090_01_ORDER_IWE';
					}
					if(this.lstFactory=='IWN')
					{
						//alert(this.lstFactory);
						this.impEndCol = 115;
						this.imp_start_row=2;
						this.imp_template_file = 'report/SW/10/RPT_IMP_ORDER_TAIWAN_IWN.xlsx';
						this.imp_store_prod = 'SW_IMP_SW10090_01_ORDER_IWN';
					}
					if(this.lstFactory=='IWW')
					{
						//alert(this.lstFactory);
						this.impEndCol = 117;
						this.imp_start_row=2;
						this.imp_template_file = 'report/SW/10/RPT_IMP_ORDER_TAIWAN_IWW.xlsx';
						this.imp_store_prod = 'SW_IMP_SW10090_01_ORDER_IWW';
					}
					if(this.lstFactory=='XM2')
					{
						//alert(this.lstFactory);
						this.impEndCol = 107;
						this.imp_start_row=1;
						this.imp_template_file = 'report/SW/10/RPT_IMP_ORDER_TAIWAN_XM2.xlsx';
						this.imp_store_prod = 'SW_IMP_SW10090_01_ORDER_XM2';
					}
					/*if (val == "tabCustomer") {//MCL
					this.impEndCol = 28;
					this.imp_start_row=2;
					this.imp_template_file = 'report/SW/10/RPT_IMP_MCL_TAIWAN.xlsx';
					this.imp_store_prod = 'SW_IMP_SW10090_MCL_NOCACHE';
					}
			   
				if (val == "tabBank") {//Translate
					//this.impEndCol = 9;
					//this.imp_template_file = 'report/60/45/imp_6045020_OPENING_BANK.xlsx';
					//this.imp_store_prod = 'AC_IMP_6045020_OP_BANK_NOCACHE';
				}*/
			}
			if(this.tab_staus==2)
			{	
				this.impEndCol = 28;
				this.imp_start_row=2;
				this.impValidValue ='TW';
				this.impValidCol=8;
				this.imp_template_file = 'report/SW/10/RPT_IMP_MCL_TAIWAN.xlsx';
				this.imp_store_prod = 'SW_IMP_SW10090_MCL_NOCACHE';
				 
			}
			
			
        },
        getSearchParas() {
            let paras = [];
            if (this.selectedTab === "tabAccount") {
                paras = [
                    this.selectedCompany,
                    this.txtAccCD_NM,
                    this.month.replace("-", ""),
                    this.selectedAccountType,
                    this.lstFactory
                ];
            } else {
                paras = [
                    this.selectedCompany,
                    this.txtPartnerID,
                    this.txtAccCD_NM,
                    this.selectedAccountType,
                    this.month.replace("-", ""),
                    this.lstFactory
                ];
            }
            return paras;
        },
        search() {
            let paras = this.getSearchParas();

            this.$refs[this.selectedTab].search(paras);
            console.log("pars:", paras)
        },
        addNew() {
            let defaultParas = {
                TCO_COMPANY_PK: this.selectedCompany,
                STD_YM: this.month.replace("-", ""),
                AC_CD_MST: this.txtAccountCode,
                AC_NM_MST: this.txtAccountName,
                AC_CCY_MST: this.txtAccountCcy,
                BOOK_CCY: this.txtBookCCY,
                TCO_BUSPLACE_PK: this.lstFactory
            };
            this.$refs[this.selectedTab].addNew(defaultParas);
        },
        markDeleteItems() {
            this.$refs[this.selectedTab].markDeleteItems();
        },
        async save() {
            let paras = this.getSearchParas();
            this.$refs[this.selectedTab].save(paras);
            let tab = 0;
            //p_type[ 0:tac_hgmmbal, 1: tac_hgcustmmbal, 2:tac_hgempmmbal, 3:tac_hgdepommbal, 4: tac_hgplmmbal]
            if (this.selectedTab == "tabAccount") {
                tab = 0;
            } else if (this.selectedTab == "tabCustomer") {
                tab = 1;
            }
            /*else if (this.selectedTab == "tabEmployee") {
                   tab = 2;
                 } */
            else if (this.selectedTab == "tabBank") { 
                tab = 3;
            }
            else if (this.selectedTab == "tabPL") {
                   //tab = 4;
				   alert("delete data order and mcl?");
				   const dso = {
					type: "process",
					updpro: "SW_PRO_SW10090_DELETE_ORD_MCL",
					para: [this.selectedCompany, this.month.replace("-", ""), tab, this.lstFactory]
					};
					const result = await this._dsoCall(dso, "process", false);
					 setTimeout(() => { 
						 this.search(); 
					 }, 1000);
                 }

            /*const dso = {
                type: "process",
                updpro: "ac_pro_6045020_upper_acc",
                para: [this.selectedCompany, this.month.replace("-", ""), tab, this.lstFactory]
            };*/
            //const result = await this._dsoCall(dso, "process", false);
            // setTimeout(() => {
            //     this.search();
            // }, 1000);

            //console.log(result); 
        },
		async onReport() {
       if (!this._hasValue(this.lstFactory))
       {
         this.showNotification( "danger",this.$t("please_select_one_consignor"), "", 4000);
         return;
       }			
        let p_param = [
			this.selectedCompany,
			this.lstFactory,
			this.month.replace("-", ""),
			this.txtAccCD_NM,
        ];
        let report_no = this.lstFactory;
        let report_path = "";
        let report_name = "";   
        let report_name_ext = "pdf";        
        let excel = [];

       
	let report = "rpt_sw10090_label";
      try{
        this._ExcelSaveAs(await this.$axios.$get('/dso/makereport', {responseType: "blob", params: {
          template: "report/SW/10/" + report + ".xlsx",
          excel: JSON.stringify([{
            sheet: 1,               
            insertRange: [{
              range: "A1:G6", proc: "SW_SEL_SW10090_REPORT_FACT_DT", params: [...p_param], dateColumns: [ "CP_DATE" ]
            }],
            insertRows: [{
				startRow: 8, proc: "SW_SEL_SW10090_REPORT_FACT_DT", params: [...p_param], stringColumns: [ "ITEM_CODE","ITEM_NAME"], subStyle: { font : {   bold: true   } , fill: {
                                        type: 'pattern',
                                        pattern:'solid',
                                        fgColor : { argb: 'FFE599'},
                                        bgColor : { argb: 'FFE599'}
                                      } }  
              //startRow: 8, proc: "SW_SEL_SW10090_REPORT_FACT_DT", params: [...p_param]
            }]
          }]),
          convert: "pdf"}
        }), report + "." + "pdf");
      } catch (e) {
        this.showNotification("danger", this.$t("fail_to_export_report"), "", 4000);
      }
          
           /* report_path = "report/SW/10/rpt_sw10090_label.xlsx";
            report_name = "rpt_sw10090_label."+ report_name_ext; 
			//report_name = "rpt_sw10090_label." + report_name_ext;	
            excel = [
              {
                sheet: 1,
                insertRange: [
                  { range: "A1:G6",  proc: "SW_SEL_SW10090_REPORT_FACT_DT", params: [...p_param]  },//header
                ],
                insertRows: [
                  {
                    
					startRow: 8,  proc: "SW_SEL_SW10090_REPORT_FACT_DT",  params: [...p_param],  stringColumns: ["STYLE_COLOR", "UPPER"],  subStyle: {  font: {    bold: true  } } 
                  }
                ],
              },
            ];
         
        if(!report_path) {
          this.showNotification(
              "danger",
              this.$t("please_select_report"),
              "",
              4000
            );
          return;
        }

        const res = await this.$axios.$get('/dso/makereport', { responseType: "blob", params:{ template:  report_path ,excel: JSON.stringify(excel), convert: report_name_ext  } }  );
        if(res){
          this._ExcelSaveAs(res, report_name);         
        } else {          
          this.showNotification( "danger", this.$t("fail_to_export_report"), "", 4000 );
        }*/

      },
		print() {},
		onAfterImport(obj) {
			this.search()
		}
    }
};
</script>
