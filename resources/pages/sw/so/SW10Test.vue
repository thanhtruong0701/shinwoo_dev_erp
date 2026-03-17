<template>
<v-container fluid class="px-0 pt-0">
    <v-row>
        <v-col cols="12">
            <v-card>
                <v-container fluid class="pt-0">
                    <v-row dense class="pa-1">
                        <v-col cols="1">
                            <BaseSelect :label="$t('Item')" v-model="selectedCompany" :lstData="companyList" item-text="TEXT" item-value="PK" @change="onChangeCompany" />
                        </v-col>
                        <v-col cols="2">
						<!--BaseDatePicker  v-model="selectedReceiveFrom" outlined  :label="$t('receive_dt_from')"  ></BaseDatePicker-->
                            <BaseDatePicker v-model="month" outlined :label="$t('date')" default></BaseDatePicker> 
                        </v-col>
                        <v-col cols="2">
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
							
                            <BaseButton icon_type="new" :btn_text="$t('addnew')" @onclick="addNew" />
							<BaseButton icon_type="delete" :btn_text="$t('delete')" @onclick="markDeleteItems" />
							<BaseButton icon_type="save" :btn_text="$t('save')" @onclick="save" />
							<BaseButton icon_type="print" :btn_text="$t('print')"  @onclick="onReport" />
							<v-tooltip bottom>
								<template v-slot:activator="{ on }">
								  <v-btn icon tile color="error" v-on="on" :disabled="isProcessing" @click="OnDeleteMaster">
									<v-icon>mdi-trash-can</v-icon>
								  </v-btn>
								</template>
								<span>{{ $t('Delete Order-MCL') }}</span>
							  </v-tooltip>
                            
                            
                            <!--BaseButton icon_type="excel" :btn_text="$t('excel')" @onclick="print" /-->
                        </div>
                    </v-row>
                    <v-row dense>
                        <v-col cols="1">
                            <BaseSelect :label="$t('FACTORY')" v-model="lstFactory" :lstData="bizPlaceList" item-text="TEXT" item-value="PK" @change="onChangeFactory"  />
                        </v-col>
                        <v-col cols="1">
							<BaseInput :label="$t('time_from')" v-model="selectedAccountType" >
                            </BaseInput>
                        </v-col>
                        <v-col cols="1">
                            <BaseInput :label="$t('time_to')" v-model="txtPartnerCD_NM" @dblClick="openPartnerDialog">
                               
                            </BaseInput>
                        </v-col>
						 <v-col cols="2">
                            <BaseSelect :label="$t('length_color_name')" v-model="lstLengthUpper" :lstData="LengthUpper" item-text="NAME" item-value="CODE" @change="onChangeFactory"  />
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
                <v-btn value="tabOrder">{{ $t("Order") }}</v-btn>
                <v-btn value="tabMCL">{{ $t("MCL") }}</v-btn>
                <v-btn value="tabSeason">{{ $t("Season") }}</v-btn> 
                <v-btn value="tabTranslate">{{ $t("Translate") }}</v-btn>
                <v-btn value="tabExport">{{ $t("Export Data") }}</v-btn>
				<v-btn value="tabExportAutoSize">{{ $t("Export Data Size Auto") }}</v-btn>
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
        tabOrder: () => import("@/components/part/sw/10/SW10110_Order"),
        tabMCL: () => import("@/components/part/sw/10/SW10110_MCL"),
        tabSeason: () => import("@/components/part/sw/10/SW10110_SeasonTest"),
        tabTranslate: () => import("@/components/part/sw/10/SW10110_Translate"),
        tabExport: () => import("@/components/part/sw/10/SW10110_ExportTemChina"),
		tabExportAutoSize: () => import("@/components/part/sw/10/SW10110_Size_Auto_ExportTemChina"), 
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
        searchData: {
            value: "",
            type: "",

        },
        month: "",
        menu: false,
        modal: false,
        selectedAccountType: "Y",
        txtBookCCY: "",
        bizPlaceList: [],
		LengthUpper: [],
        lstFactory: "",
		lstLengthUpper: "",
        accountTypeList: [],
        selectedAccountType: "",
        imp_validate: "",
		imp_start_row:4,
        impEndCol: 71,
        imp_template_file: 'report/SW/10/RPT_IMP_ORDER_CHINA_VJ.xlsx',// RPT_IMP_ORDER_TAIWAN
        imp_store_prod: 'SW_IMP_SW10110_ORDER_VJ',
		tab_staus:1,
		impValidValue:'',
		impValidCol:-1,
    }),
    async created() {
		//this.getListCodes();
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
            if (val == "tabOrder") {//ORDER
                
                    this.tab_staus=1;
					if(this.lstFactory=='VJ')
					{
						//alert(this.lstFactory);
						this.impEndCol = 73;
						this.imp_start_row=1;
						this.imp_template_file = 'report/SW/10/RPT_IMP_ORDER_CHINA_VJ.xlsx';
						this.imp_store_prod = 'SW_IMP_SW10110_ORDER_VJ';
					} 
					if(this.lstFactory=='VO')
					{
						//alert(this.lstFactory);
						this.impEndCol = 72;
						this.imp_start_row=1;
						this.imp_template_file = 'report/SW/10/RPT_IMP_ORDER_CHINA_DV.xlsx';
						this.imp_store_prod = 'SW_IMP_SW10110_ORDER_DV';
					}
					if(this.lstFactory=='VE')
					{
						//alert(this.lstFactory);
						this.impEndCol = 74;
						this.imp_start_row=1;//INSERT HEADER SIZE
						this.imp_template_file = 'report/SW/10/RPT_IMP_ORDER_CHINA_VE.xlsx';
						this.imp_store_prod = 'SW_IMP_SW10110_ORDER_VE';
					}
					if(this.lstFactory=='VW')
					{
						//alert(this.lstFactory);
						this.impEndCol = 72;
						this.imp_start_row=1;
						this.imp_template_file = 'report/SW/10/RPT_IMP_ORDER_CHINA_VW.xlsx';
						this.imp_store_prod = 'SW_IMP_SW10110_ORDER_VW';
					}
					if(this.lstFactory=='VQ')
					{
						//alert(this.lstFactory);
						this.impEndCol = 74;
						this.imp_start_row=1;
						this.imp_template_file = 'report/SW/10/RPT_IMP_ORDER_CHINA_VQ.xlsx';
						this.imp_store_prod = 'SW_IMP_SW10110_ORDER_VQ';
					}
					if(this.lstFactory=='VY')
					{
						//alert(this.lstFactory);
						this.impEndCol = 73;
						this.imp_start_row=1;
						this.imp_template_file = 'report/SW/10/RPT_IMP_ORDER_CHINA_VY.xlsx';
						this.imp_store_prod = 'SW_IMP_SW10110_ORDER_VY'; 
					}
					if(this.lstFactory=='VH')
					{
						//alert(this.lstFactory);
						this.impEndCol = 74;
						this.imp_start_row=1;
						this.imp_template_file = 'report/SW/10/RPT_IMP_ORDER_CHINA_VH.xlsx';
						this.imp_store_prod = 'SW_IMP_SW10110_ORDER_VH';
					}
					if(this.lstFactory=='V3')
					{
						//alert(this.lstFactory);
						this.impEndCol = 73;
						this.imp_start_row=1;
						this.imp_template_file = 'report/SW/10/RPT_IMP_ORDER_CHINA_V3.xlsx';
						this.imp_store_prod = 'SW_IMP_SW10110_ORDER_V3';
					}
					if(this.lstFactory=='LW')
					{
						//alert(this.lstFactory);
						this.impEndCol = 73;
						this.imp_start_row=1;
						this.imp_template_file = 'report/SW/10/RPT_IMP_ORDER_CHINA_LW.xlsx';
						this.imp_store_prod = 'SW_IMP_SW10110_ORDER_LW';
					}
					/*if(this.lstFactory=='VE')
					{
						//alert(this.lstFactory);
						this.impEndCol = 75;
						this.imp_start_row=4;
						this.imp_template_file = 'report/SW/10/RPT_IMP_ORDER_CHINA_VE.xlsx';
						this.imp_store_prod = 'SW_IMP_SW10110_ORDER_VE';
					}
					if(this.lstFactory=='VJ2')
					{
						//alert(this.lstFactory);
						this.impEndCol = 7;
						this.imp_start_row=2;
						this.imp_template_file = 'report/SW/10/RPT_IMP_ORDER_TAIWAN_VJ2.xlsx';
						this.imp_store_prod = 'SW_IMP_SW10090_ORDER_VJ2';
					}
					if(this.lstFactory=='VY')
					{
						//alert(this.lstFactory);
						this.impEndCol = 8;
						this.imp_start_row=2;
						this.imp_template_file = 'report/SW/10/RPT_IMP_ORDER_TAIWAN_VY.xlsx';
						this.imp_store_prod = 'SW_IMP_SW10090_ORDER_VY';
					}*/
            }
            if (val == "tabMCL") {//MCL
				this.tab_staus=2;
				//onChangeFactory();
                this.impEndCol = 28;
				this.imp_start_row=2;
				this.impValidValue ='CN';
				this.impValidCol=8;
                this.imp_template_file = 'report/SW/10/RPT_IMP_MCL_CHINA.xlsx';
                this.imp_store_prod = 'SW_IMP_SW10110_MCL_NOCACHE';
            }
			if (val == "tabSeason") {//SEASON
				this.tab_staus=3;
				//onChangeFactory();
                this.impEndCol = 17;
				this.imp_start_row=2;
				//this.impValidValue =this.lstFactory;
				//this.impValidCol=2;
                this.imp_template_file = 'report/SW/10/RPT_IMP_SEASON_CHINA.xlsx';
                this.imp_store_prod = 'SW_IMP_SW10110_SEASON_V2';
            }
			
            if (val == "tabTranslate") {//Translate
				this.tab_staus=4;
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
		this.getListCodes();
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
                para: ['CN']
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
                selpro: 'sw_sel_factory',
                para: [this.selectedCompany, this.user.PK]
            }
            this.bizPlaceList = await this._dsoCall(dso_bizplace_list, 'select', false)
            if (this.bizPlaceList.length > 0) {
                //this.lstFactory = this.bizPlaceList[0].PK; 
            }
        },
		async getListCodes() {
      let lstCommoncode = await this._getCommonCode2(
        [
          "SWCM0110",
          "LGPO2001",
          "LGPO2002",
          "LGCM0210",
          "LGCM0130",
          "LGCM0110",
          "LGCM0120",
        ],
        this.user.TCO_COMPANY_PK
      );
      this.LengthUpper = lstCommoncode[0];
    },
        async onChangeFactory() {
		
		//alert(this.lstFactory);
				this.impValidValue ='';
				this.impValidCol=-1;
                if(this.tab_staus==1)
				{
					
					if(this.lstFactory=='VJ')
					{
						//alert(this.lstFactory);
						this.impEndCol = 73;
						this.imp_start_row=1;
						this.imp_template_file = 'report/SW/10/RPT_IMP_ORDER_CHINA_VJ.xlsx';
						this.imp_store_prod = 'SW_IMP_SW10110_ORDER_VJ';
					} 
					if(this.lstFactory=='VO')
					{
						//alert(this.lstFactory);
						this.impEndCol = 72;
						this.imp_start_row=1;
						this.imp_template_file = 'report/SW/10/RPT_IMP_ORDER_CHINA_DV.xlsx';  
						this.imp_store_prod = 'SW_IMP_SW10110_ORDER_DV';
					}
					if(this.lstFactory=='VE')
					{
						//alert(this.lstFactory);
						this.impEndCol = 74;
						this.imp_start_row=1;//INSERT HEADER SIZE
						this.imp_template_file = 'report/SW/10/RPT_IMP_ORDER_CHINA_VE.xlsx';
						this.imp_store_prod = 'SW_IMP_SW10110_ORDER_VE';
					}
					if(this.lstFactory=='VW')
					{
						//alert(this.lstFactory);
						this.impEndCol = 72;
						this.imp_start_row=1;
						this.imp_template_file = 'report/SW/10/RPT_IMP_ORDER_CHINA_VW.xlsx';
						this.imp_store_prod = 'SW_IMP_SW10110_ORDER_VW';
					}
					if(this.lstFactory=='VQ')
					{
						//alert(this.lstFactory);
						this.impEndCol = 74;
						this.imp_start_row=1;
						this.imp_template_file = 'report/SW/10/RPT_IMP_ORDER_CHINA_VQ.xlsx';
						this.imp_store_prod = 'SW_IMP_SW10110_ORDER_VQ';
					}
					if(this.lstFactory=='VY')
					{
						//alert(this.lstFactory);
						this.impEndCol = 73;
						this.imp_start_row=1;
						this.imp_template_file = 'report/SW/10/RPT_IMP_ORDER_CHINA_VY.xlsx';
						this.imp_store_prod = 'SW_IMP_SW10110_ORDER_VY';
					}
					if(this.lstFactory=='VH')
					{
						//alert(this.lstFactory);
						this.impEndCol = 74;
						this.imp_start_row=1;
						this.imp_template_file = 'report/SW/10/RPT_IMP_ORDER_CHINA_VH.xlsx';
						this.imp_store_prod = 'SW_IMP_SW10110_ORDER_VH';
					}
					if(this.lstFactory=='V3')
					{
						//alert(this.lstFactory);
						this.impEndCol = 73;
						this.imp_start_row=1;
						this.imp_template_file = 'report/SW/10/RPT_IMP_ORDER_CHINA_V3.xlsx';
						this.imp_store_prod = 'SW_IMP_SW10110_ORDER_V3';
					}
					if(this.lstFactory=='LW')
					{
						//alert(this.lstFactory);
						this.impEndCol = 73;
						this.imp_start_row=1;
						this.imp_template_file = 'report/SW/10/RPT_IMP_ORDER_CHINA_LW.xlsx';
						this.imp_store_prod = 'SW_IMP_SW10110_ORDER_LW';
					}
					/*if(this.lstFactory=='VO')//VO IS DV   ---DV IS VO  SW_IMP_SW10110_ORDER_VH
					{
						//alert(this.lstFactory);
						this.impEndCol = 7;
						this.imp_start_row=2;
						this.imp_template_file = 'report/SW/10/RPT_IMP_ORDER_TAIWAN_DV.xlsx';
						this.imp_store_prod = 'SW_IMP_SW10090_ORDER_DV';
					}
					
					if(this.lstFactory=='VJ2')
					{
						//alert(this.lstFactory);
						this.impEndCol = 7;
						this.imp_start_row=2;
						this.imp_template_file = 'report/SW/10/RPT_IMP_ORDER_TAIWAN_VJ2.xlsx';
						this.imp_store_prod = 'SW_IMP_SW10090_ORDER_VJ2';
					}
					*/
					/*if (val == "tabMCL") {//MCL
					this.impEndCol = 28;
					this.imp_start_row=2;
					this.imp_template_file = 'report/SW/10/RPT_IMP_MCL_TAIWAN.xlsx';
					this.imp_store_prod = 'SW_IMP_SW10090_MCL_NOCACHE';
					}
			   
				if (val == "tabTranslate") {//Translate
					//this.impEndCol = 9;
					//this.imp_template_file = 'report/60/45/imp_6045020_OPENING_BANK.xlsx';
					//this.imp_store_prod = 'AC_IMP_6045020_OP_BANK_NOCACHE';
				}*/
			}
			if(this.tab_staus==2)
			{	
				this.impEndCol = 28;
				this.imp_start_row=2;
				this.impValidValue ='CN';
				this.impValidCol=8;
				this.imp_template_file = 'report/SW/10/RPT_IMP_MCL_CHINA.xlsx';
				this.imp_store_prod = 'SW_IMP_SW10110_SEASON_V2';
				 
			}
			
			if (this.tab_staus == "tabSeason") {//SEASON
				this.tab_staus=3;
				//onChangeFactory();
                this.impEndCol = 17;
				this.imp_start_row=2;
				//this.impValidValue =this.lstFactory;
				//this.impValidCol=2;
                this.imp_template_file = 'report/SW/10/RPT_IMP_SEASON_CHINA.xlsx';
                this.imp_store_prod = 'SW_IMP_SW10110_SEASON_NOCACHE';
            }
			
			
        },
        getSearchParas() {
            let paras = [];
            if (this.selectedTab === "tabOrder") {
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
                    this.txtPartnerCD_NM,
                    this.txtAccCD_NM,
                    this.selectedAccountType,
                    this.month.replace("-", ""),
                    this.lstFactory,
					this.lstLengthUpper
                ];
            }
            return paras;
        },
        search() {
            let paras = this.getSearchParas();

            this.$refs[this.selectedTab].search(paras);
        },
        addNew() {
            let defaultParas = {
                //TCO_COMPANY_PK: this.selectedCompany,
                /*STD_YM: this.month.replace("-", ""),
                AC_CD_MST: this.txtAccountCode,
                AC_NM_MST: this.txtAccountName,
                AC_CCY_MST: this.txtAccountCcy,
                BOOK_CCY: this.txtBookCCY,*/
                //FACTORY: this.lstFactory
            };
            this.$refs[this.selectedTab].addNew(defaultParas);
        },
        markDeleteItems() {
            this.$refs[this.selectedTab].markDeleteItems();
        },
        async save() {
            //let paras = this.getSearchParas();
            //this.$refs[this.selectedTab].save(paras);
            let tab = 0;
            //p_type[ 0:tac_hgmmbal, 1: tac_hgcustmmbal, 2:tac_hgempmmbal, 3:tac_hgdepommbal, 4: tac_hgplmmbal]
            if (this.selectedTab == "tabOrder") {
                tab = 0;
            } else if (this.selectedTab == "tabMCL") {
                tab = 1;
            }
            else if (this.selectedTab == "tabSeason") {
                   tab = 2;
				   let paras = this.getSearchParas();
					this.$refs[this.selectedTab].save(paras);
                 } 
            else if (this.selectedTab == "tabTranslate") { 
                tab = 3;
            }
            else if (this.selectedTab == "tabExport") {
                   tab = 4;
				   /*alert("Delete Data Order And MCL?");
				   const dso = {
					type: "process",
					updpro: "SW_PRO_SW10090_DELETE_ORD_MCL",
					para: [this.selectedCompany, this.month.replace("-", ""), tab, this.lstFactory]
					};
					const result = await this._dsoCall(dso, "process", false);
					 setTimeout(() => { 
						 this.search(); 
					 }, 1000);*/
                 }
			else if (this.selectedTab == "tabExportAutoSize") {
                   tab = 5;
				   /*alert("Delete Data Order And MCL?");
				   const dso = {
					type: "process",
					updpro: "SW_PRO_SW10090_DELETE_ORD_MCL",
					para: [this.selectedCompany, this.month.replace("-", ""), tab, this.lstFactory]
					};
					const result = await this._dsoCall(dso, "process", false);
					 setTimeout(() => { 
						 this.search(); 
					 }, 1000);*/
                 }	 
            //console.log(result); 
        },
		async OnDeleteMaster() {
			  let tab = 4;
				   alert("Delete Data Order And MCL?");
				   const dso = {
					type: "process",
					updpro: "SW_PRO_SW10110_DELETE_ORD_MCL",
					para: [this.selectedCompany, this.month.replace("-", ""), tab, this.lstFactory]
					};
					const result = await this._dsoCall(dso, "process", false);
					 setTimeout(() => { 
						 this.search(); 
					 }, 1000);
		
		},
	async onReport() {
       if (!this._hasValue(this.lstFactory))
       {
         this.showNotification( "danger",this.$t("please_select_one_consignor"), "", 4000);
         return;
       }			
        let p_param = [
			this.selectedCompany,
			this.txtPartnerCD_NM,
			this.txtAccCD_NM,
			this.selectedAccountType,
			this.month.replace("-", ""),
			this.lstFactory,
        ];
        let report_no = this.lstFactory;
        let report_path = "";
        let report_name = "";   
        let report_name_ext = "pdf";        
        let excel = [];

       
	let report = "rpt_sw10110_export_size_auto";
      try{
        this._ExcelSaveAs(await this.$axios.$get('/dso/makereport', {responseType: "blob", params: {
          template: "report/SW/10/" + report + ".xlsx",
          excel: JSON.stringify([{
            sheet: 1,               
            insertRange: [{
              range: "A1:G6", proc: "SW_SEL_SW10110_RPT_AUTO_SIZE", params: [...p_param], dateColumns: [ "CP_DATE" ]//SW_SEL_SW10110_export_custom
            }],
            insertRows: [{
				startRow: 8, proc: "SW_SEL_SW10110_RPT_AUTO_SIZE", params: [...p_param], stringColumns: [ "ITEM_CODE","ITEM_NAME"], subStyle: { font : {   bold: true   } , fill: {
                                        type: 'pattern',
                                        pattern:'solid',
                                        fgColor : { argb: 'FFE599'},
                                        bgColor : { argb: 'FFE599'}
                                      } }  
              //startRow: 8, proc: "SW_SEL_SW10090_REPORT_FACT_DT", params: [...p_param]
            }]
          }]),
          convert: "xlsx"}
        }), report + "." + "xlsx");
      } catch (e) {
        this.showNotification("danger", this.$t("fail_to_export_report"), "", 4000);
      }
       
      },
		print() {},
		onAfterImport(obj) {
			this.search()
		}
    }
};
</script>
