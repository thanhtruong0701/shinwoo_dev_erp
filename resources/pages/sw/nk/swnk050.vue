<template>
<v-container fluid class="px-0 pt-0">
    <v-row>
        <v-col cols="12">
            <v-card>
                <v-container fluid class="pt-0">
                    <v-row dense class="pa-1">
                        <v-col cols="2">
                            <BaseSelect :label="$t('Item')" v-model="selectedCompany" :lstData="companyList" item-text="TEXT" item-value="PK" @change="onChangeCompany" />
                        </v-col>
                        <v-col cols="2">
						<!--BaseDatePicker  v-model="selectedReceiveFrom" outlined  :label="$t('receive_dt_from')"  ></BaseDatePicker-->
                            <BaseDatePicker v-model="month" outlined :label="$t('date')" default></BaseDatePicker>
                        </v-col>
						<v-col cols="2">
						<!--BaseDatePicker  v-model="selectedReceiveFrom" outlined  :label="$t('receive_dt_from')"  ></BaseDatePicker-->
							<BaseDatePicker v-model="month_to" outlined :label="$t('date_to')" default></BaseDatePicker>
                        </v-col>
                        <v-col cols="2">
                            <BaseInput :label="$t('PO_NO/STYLE_COLOR')" v-model="txtAccCD_NM" >
                            </BaseInput>
                        </v-col>
                       <v-col cols="1">
							 <div class="d-flex justify-end">
								<BaseButton icon_type="search" :btn_text="$t('search')" @onclick="search" /> 
							</div>
						</v-col>	
                            <!--<BaseButton icon_type="new" :btn_text="$t('addnew')" @onclick="addNew" />
							<BaseButton icon_type="delete" :btn_text="$t('delete')" @onclick="markDeleteItems" />
							<BaseButton icon_type="save" :btn_text="$t('save')" @onclick="save" />-->
						<v-col cols="1">
							<div class="d-flex justify-end">						
								<BaseButton icon_type="print" :btn_text="$t('print')"  @onclick="onReport" />
							</div>	
						 </v-col>	
						 <v-col cols="1">
							<div class="d-flex justify-end">						
								<BaseButton icon_type="print" :btn_text="$t('print-CSV')"  @onclick="onReportCSV" />
							</div>	
						 </v-col> 
							<!--v-tooltip bottom>
								<template v-slot:activator="{ on }">
								  <v-btn icon tile color="error" v-on="on" :disabled="isProcessing" @click="OnDeleteMaster">
									<v-icon>mdi-trash-can</v-icon>
								  </v-btn>
								</template>
								<span>{{ $t('Delete Order-MCL') }}</span>
							  </v-tooltip-->
						<v-col cols="1">
								<v-btn icon tile color="error" v-on="on" :disabled="isProcessing" @click="OnDeleteMaster">
									<v-icon>mdi-trash-can</v-icon>
								  </v-btn>						
                            <!--BaseButton icon_type="confirm" :btn_text="$t('approve')" :disabled="isProcessing" @onclick="onProcessAutoSize()"/-->	
                            
                            <!--BaseButton icon_type="excel" :btn_text="$t('excel')" @onclick="print" /-->
                        </v-col>
                    </v-row>
                    <v-row dense>
                        <v-col cols="2">
                            <BaseSelect :label="$t('FACTORY')" v-model="lstFactory" :lstData="bizPlaceList" item-text="TEXT" item-value="PK" @change="onChangeFactory"  />
                        </v-col>
                        <v-col cols="2">
						<BaseDatePicker v-model="deli_date" outlined :label="$t('delivery_date')" default></BaseDatePicker>
							<!--BaseInput :label="$t('time_from')" v-model="selectedAccountType" > 
                            </BaseInput-->
                        </v-col>
                        <!--v-col cols="1">
                            <BaseInput :label="$t('time_to')" v-model="txtPartnerCD_NM" @dblClick="openPartnerDialog">
                               
                            </BaseInput>
                        </v-col-->
						 <v-col cols="1">
							<BaseInput :label="$t('Nation')" v-model="txtNation" >
                            </BaseInput>
                            <!--BaseSelect :label="$t('length_color_name')" v-model="lstLengthUpper" :lstData="LengthUpper" item-text="NAME" item-value="CODE" @change="onChangeFactory"  /-->
                        </v-col>
                        <v-col />
						<v-col cols="6">
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
               <!--  <v-btn value="tabMCL">{{ $t("MCL") }}</v-btn>
               <v-btn value="tabSeason">{{ $t("Season") }}</v-btn> 
                <v-btn value="tabTranslate">{{ $t("Translate") }}</v-btn>-->
                <v-btn value="tabExport">{{ $t("Export Data") }}</v-btn>
				<!--v-btn value="tabExport2">{{ $t("Export Data V2") }}</v-btn-->
				<!--v-btn value="tabExportAutoSize">{{ $t("Export Data Size Auto") }}</v-btn-->
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
       // accountDialog: () => import("@/components/dialog/AccountDialog"),
       // partnerDialog: () => import("@/components/dialog/PartnerDialog"),
        tabOrder: () => import("@/components/part/sw/nk/swnk050_Order"),
        //tabMCL: () => import("@/components/part/sw/10/SW10710_MCL"),
       // tabSeason: () => import("@/components/part/sw/10/SW10110_Season"),
        //tabTranslate: () => import("@/components/part/sw/10/SW10110_Translate"),
        tabExport: () => import("@/components/part/sw/nk/swnk050_Export"),
		//tabExport2: () => import("@/components/part/sw/10/SW10110_ExportTemChina_V2"),
		//tabExportAutoSize: () => import("@/components/part/sw/10/SW10110_ExportTemSizeAutoChina"), 
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
		txtNation: "",
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
        month_to: "",
		month: "",
		deli_date: "",
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
        imp_template_file: 'report/sw/10/RPT_IMP_ORDER_CHINA_VJ.xlsx',// RPT_IMP_ORDER_TAIWAN
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
					if(this.lstFactory=='ENG-ANTA-QR')
					{
						//alert(this.lstFactory);
						this.impEndCol = 74;
						this.imp_start_row=2;
						this.imp_template_file = 'report/sw/nk/rpt_swnk050_templet_order.xlsx';
						this.imp_store_prod = 'SW_IMP_SWNK050_ANTA_ORDER_01';
					} 
					if(this.lstFactory=='LW')
					{
						this.impEndCol = 148;
						this.imp_start_row=1;
						this.imp_template_file = 'report/sw/10/RPT_IMP_ORDER_DATAMAX_LW.xlsx';  
						this.imp_store_prod = 'SW_IMP_SWSO710_DMX_ORDER_LW';
					}
					if(this.lstFactory=='V3')
					{
						//alert(this.lstFactory);
						this.impEndCol = 77;
						this.imp_start_row=1;
						this.imp_template_file = 'report/sw/10/RPT_IMP_ORDER_DATAMAX_V3.xlsx';  
						this.imp_store_prod = 'SW_IMP_SWSO710_DMX_ORDER_V3';
					}
					if(this.lstFactory=='VE')
					{
						//alert(this.lstFactory);
						this.impEndCol = 81;
						this.imp_start_row=6;
						this.imp_template_file = 'report/sw/10/RPT_IMP_ORDER_DATAMAX_VE.xlsx';
						this.imp_store_prod = 'SW_IMP_SWSO710_DMX_ORDER_VE';
					}
					if(this.lstFactory=='VG1')
					{
						//alert(this.lstFactory);
						this.impEndCol = 70;
						this.imp_start_row=1;
						this.imp_template_file = 'report/sw/10/RPT_IMP_ORDER_DATAMAX_VG1.xlsx';
						this.imp_store_prod = 'SW_IMP_SWSO710_DMX_ORDER_VG1';
					}
					if(this.lstFactory=='VG2')
					{
						//alert(this.lstFactory);
						this.impEndCol = 126;
						this.imp_start_row=1;
						this.imp_template_file = 'report/sw/10/RPT_IMP_ORDER_DATAMAX_VG2.xlsx';
						this.imp_store_prod = 'SW_IMP_SWSO710_DMX_ORDER_VG2';
					}
					if(this.lstFactory=='VL')
					{
						//alert(this.lstFactory);
						this.impEndCol = 11;
						this.imp_start_row=3;
						this.imp_template_file = 'report/sw/10/RPT_IMP_ORDER_DATAMAX_VL.xlsx';
						this.imp_store_prod = 'SW_IMP_SWSO710_DMX_ORDER_VL';
					}
					if(this.lstFactory=='VO')
					{
						//alert(this.lstFactory);
						this.impEndCol = 6;
						this.imp_start_row=3;
						this.imp_template_file = 'report/sw/10/RPT_IMP_ORDER_DATAMAX_VO.xlsx';
						this.imp_store_prod = 'SW_IMP_SWSO710_DMX_ORDER_VO';
					}
					if(this.lstFactory=='VP')
					{
						//alert(this.lstFactory);
						this.impEndCol = 76;
						this.imp_start_row=1;
						this.imp_template_file = 'report/sw/10/RPT_IMP_ORDER_DATAMAX_VP.xlsx';
						this.imp_store_prod = 'SW_IMP_SWSO710_DMX_ORDER_VP';
					}
					if(this.lstFactory=='VQ1')
					{
						//alert(this.lstFactory);
						this.impEndCol = 98;
						this.imp_start_row=1;
						this.imp_template_file = 'report/sw/10/RPT_IMP_ORDER_DATAMAX_VQ1.xlsx';
						this.imp_store_prod = 'SW_IMP_SWSO710_DMX_ORDER_VQ1';
					}
					if(this.lstFactory=='VQ2')
					{
						//alert(this.lstFactory);
						this.impEndCol = 99;
						this.imp_start_row=1;
						this.imp_template_file = 'report/sw/10/RPT_IMP_ORDER_DATAMAX_VQ2.xlsx';
						this.imp_store_prod = 'SW_IMP_SWSO710_DMX_ORDER_VQ2';
					}
					if(this.lstFactory=='VW')
					{
						//alert(this.lstFactory);
						this.impEndCol = 84;
						this.imp_start_row=5;
						this.imp_template_file = 'report/sw/10/RPT_IMP_ORDER_DATAMAX_VW.xlsx';
						this.imp_store_prod = 'SW_IMP_SWSO710_DMX_ORDER_VW';
					}
					if(this.lstFactory=='VW2')
					{
						//alert(this.lstFactory);
						this.impEndCol = 84;
						this.imp_start_row=5;
						this.imp_template_file = 'report/sw/10/RPT_IMP_ORDER_DATAMAX_VW2.xlsx';
						this.imp_store_prod = 'SW_IMP_SWSO710_DMX_ORDER_VW2';
					}
					if(this.lstFactory=='VY')
					{
						//alert(this.lstFactory);
						this.impEndCol = 105;
						this.imp_start_row=1;
						this.imp_template_file = 'report/sw/10/RPT_IMP_ORDER_DATAMAX_VY.xlsx';
						this.imp_store_prod = 'SW_IMP_SWSO710_DMX_ORDER_VY';
					}
					if(this.lstFactory=='VT')
					{
						//alert(this.lstFactory);
						this.impEndCol = 74;
						this.imp_start_row=1;
						this.imp_template_file = 'report/sw/10/RPT_IMP_ORDER_DATAMAX_VT.xlsx';
						this.imp_store_prod = 'SW_IMP_SWSO710_DMX_ORDER_VT';
					}
            }
            /*if (val == "tabMCL") {//MCL
				this.tab_staus=2;
				//onChangeFactory();
                this.impEndCol = 28;
				this.imp_start_row=2;
				this.impValidValue ='CN';
				this.impValidCol=8;
                this.imp_template_file = 'report/sw/10/RPT_IMP_MCL_CHINA.xlsx';
                this.imp_store_prod = 'SW_IMP_SW10110_MCL_NOCACHE';
            }
			if (val == "tabSeason") {//SEASON
				this.tab_staus=3;
				//onChangeFactory();
                this.impEndCol = 17;
				this.imp_start_row=2;
				//this.impValidValue =this.lstFactory;
				//this.impValidCol=2;
                this.imp_template_file = 'report/sw/10/RPT_IMP_SEASON_CHINA.xlsx';
                this.imp_store_prod = 'SW_IMP_SW10110_SEASON_NOCACHE';
            }
			
            if (val == "tabTranslate") {//Translate
				this.tab_staus=4;
				//onChangeFactory();
                //this.impEndCol = 9;
                //this.imp_template_file = 'report/60/45/imp_6045020_OPENING_BANK.xlsx';
                //this.imp_store_prod = 'AC_IMP_6045020_OP_BANK_NOCACHE';
            }*/
			if (val == "tabExport") {//Translate
				this.tab_staus=2;
				//alert(this.lstFactory+"-0-"+this.tab_staus);
					if(this.lstFactory=='ENG-ANTA-QR')
					{
						//alert(this.lstFactory);
						this.impEndCol = 25;
						this.imp_start_row=2;
						this.imp_template_file = 'report/sw/nk/swnk030_import_order_detail_v2.xlsx';
						this.imp_store_prod = 'SZ_IMP_SWNK030_ORDER_DTL_V2';
					} 
					if(this.lstFactory=='ENG-ANTA-QR2')//TYPE 5563 
					{
						//alert(this.lstFactory);
						this.impEndCol = 33;
						this.imp_start_row=2;
						this.imp_template_file = 'report/sw/nk/swnk050_import_order_detail_v2_2.xlsx';
						this.imp_store_prod = 'SZ_IMP_SWNK030_ORDER_DTL_V2_2';
					}	
					if(this.lstFactory=='LW')
					{
						//alert(this.lstFactory);
						this.impEndCol = 13;
						this.imp_start_row=2;
						this.imp_template_file = 'report/sw/10/RPT_IMP_ORDER_PRICE_DATAMAX_LW.xlsx';
						this.imp_store_prod = 'SW_UPD_SWSO710_DMX_ORDER_LW';
					}
					if(this.lstFactory=='VE')
					{
						//alert(this.lstFactory);
						this.impEndCol = 13;
						this.imp_start_row=2;
						this.imp_template_file = 'report/sw/10/RPT_IMP_ORDER_PRICE_DATAMAX_VE.xlsx';
						this.imp_store_prod = 'SW_UPD_SWSO710_DMX_ORDER_VE';
					}
					if(this.lstFactory=='VG1')
					{
						//alert(this.lstFactory);
						this.impEndCol = 15;
						this.imp_start_row=2;
						this.imp_template_file = 'report/sw/10/RPT_IMP_ORDER_PRICE_DATAMAX_VG1.xlsx';
						this.imp_store_prod = 'SW_UPD_SWSO710_DMX_ORDER_VG1';
					}
					if(this.lstFactory=='VG2')
					{
						//alert(this.lstFactory);
						this.impEndCol = 8;
						this.imp_start_row=2;
						this.imp_template_file = 'report/sw/10/RPT_IMP_ORDER_PRICE_DATAMAX_VG2.xlsx';
						this.imp_store_prod = 'SW_UPD_SWSO710_DMX_ORDER_VG2';
					}
					if(this.lstFactory=='VP')
					{
						//alert(this.lstFactory);
						this.impEndCol = 8;
						this.imp_start_row=2;
						this.imp_template_file = 'report/sw/10/RPT_IMP_ORDER_PRICE_DATAMAX_VP.xlsx';
						this.imp_store_prod = 'SW_UPD_SWSO710_DMX_ORDER_VP';
					}
					if(this.lstFactory=='VW')
					{
						//alert(this.lstFactory);
						this.impEndCol = 16;
						this.imp_start_row=2;
						this.imp_template_file = 'report/sw/10/RPT_IMP_ORDER_PRICE_DATAMAX_VW.xlsx';
						this.imp_store_prod = 'SW_UPD_SWSO710_DMX_ORDER_VW'; 
					}
					if(this.lstFactory=='VW2')
					{
						//alert(this.lstFactory);
						this.impEndCol = 18;
						this.imp_start_row=2;
						this.imp_template_file = 'report/sw/10/RPT_IMP_ORDER_PRICE_DATAMAX_VW2.xlsx';
						this.imp_store_prod = 'SW_UPD_SWSO710_DMX_ORDER_VW2'; 
					}
					if(this.lstFactory=='VY')
					{
						//alert(this.lstFactory);
						this.impEndCol = 11;
						this.imp_start_row=2;
						this.imp_template_file = 'report/sw/10/RPT_IMP_ORDER_PRICE_DATAMAX_VY.xlsx';
						this.imp_store_prod = 'SW_UPD_SWSO710_DMX_ORDER_VY';
					}
					if(this.lstFactory=='VO')
					{
						//alert(this.lstFactory);
						this.impEndCol = 20;
						this.imp_start_row=4;
						this.imp_template_file = 'report/sw/10/RPT_IMP_ORDER_PRICE_DATAMAX_VO.xlsx';
						this.imp_store_prod = 'SW_UPD_SWSO710_DMX_ORDER_VO';
					}
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
            //seft.PasteRow(event);
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
        /*PasteRow(evt) {
            let paras = {
                TCO_COMPANY_PK: this.selectedCompany//,
                //STD_YM: this.month.replace("-", "")
            };
            this.$refs[this.selectedTab].PasteRow(paras, evt);
        },*/
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
		
		
		const dso = { type: "list", selpro: "sp_sel_list_commoncode", para: ["SWWMT03COM"] };
                        const result = await this._dsoCall(dso, "select", false); 
                        if (result) 
                        {
                            this.companyList = result;
                        } 
                        else 
                        {
                            this.companyList = [];
                        }
						
						
            /*const dso = {
                type: "list",
                selpro: "sw_sel_list_company",
                para: ['DMX']
            };
            const result = await this._dsoCall(dso, "select", false);
            if (result) {
                this.companyList = result; 
            } else {
                this.companyList = [];
            }
            */
        },
        async onChangeCompany() {
		
			const dso = { type: "list", selpro: "sp_sel_list_commoncode", para: ["SWWMT05"] };
                        const result = await this._dsoCall(dso, "select", false); 
                        if (result) 
                        {
                            this.bizPlaceList = result;
                        } 
                        else 
                        {
                            this.bizPlaceList = [];
                        }
						
            /*this.bizPlaceList = [];
            const dso_bizplace_list = {
                type: 'list',
                selpro: 'sw_sel_factory',
                para: [this.selectedCompany, this.user.PK]
            }
            this.bizPlaceList = await this._dsoCall(dso_bizplace_list, 'select', false)
            if (this.bizPlaceList.length > 0) {
               
            }*/
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
		
		//alert(this.tab_staus);
				this.impValidValue ='';
				this.impValidCol=-1;
                if(this.tab_staus==1)
				{
					
					if(this.lstFactory=='ENG-ANTA-QR')
					{
						//alert(this.lstFactory);
						this.impEndCol = 74;
						this.imp_start_row=2;
						this.imp_template_file = 'report/sw/nk/rpt_swnk050_templet_order.xlsx';
						this.imp_store_prod = 'SW_IMP_SWNK050_ANTA_ORDER_01';
					} 
					
					if(this.lstFactory=='LW')
					{
						//alert(this.lstFactory);
						this.impEndCol = 148;
						this.imp_start_row=1;
						this.imp_template_file = 'report/sw/10/RPT_IMP_ORDER_DATAMAX_LW.xlsx';  
						this.imp_store_prod = 'SW_IMP_SWSO710_DMX_ORDER_LW';
					}
					if(this.lstFactory=='V3')
					{
						//alert(this.lstFactory);
						this.impEndCol = 77;
						this.imp_start_row=1;
						this.imp_template_file = 'report/sw/10/RPT_IMP_ORDER_DATAMAX_V3.xlsx';  
						this.imp_store_prod = 'SW_IMP_SWSO710_DMX_ORDER_V3';
					}
					if(this.lstFactory=='VE')
					{
						//alert(this.lstFactory);
						this.impEndCol = 81;
						this.imp_start_row=6;
						this.imp_template_file = 'report/sw/10/RPT_IMP_ORDER_DATAMAX_VE.xlsx';
						this.imp_store_prod = 'SW_IMP_SWSO710_DMX_ORDER_VE';
					}
					if(this.lstFactory=='VG1')
					{
						//alert(this.lstFactory);
						this.impEndCol = 70;
						this.imp_start_row=1;
						this.imp_template_file = 'report/sw/10/RPT_IMP_ORDER_DATAMAX_VG1.xlsx';
						this.imp_store_prod = 'SW_IMP_SWSO710_DMX_ORDER_VG1';
					}
					if(this.lstFactory=='VG2')
					{
						//alert(this.lstFactory);
						this.impEndCol = 126;
						this.imp_start_row=1;
						this.imp_template_file = 'report/sw/10/RPT_IMP_ORDER_DATAMAX_VG2.xlsx';
						this.imp_store_prod = 'SW_IMP_SWSO710_DMX_ORDER_VG2';
					}
					if(this.lstFactory=='VL')
					{
						//alert(this.lstFactory);
						this.impEndCol = 11;
						this.imp_start_row=3;
						this.imp_template_file = 'report/sw/10/RPT_IMP_ORDER_DATAMAX_VL.xlsx';
						this.imp_store_prod = 'SW_IMP_SWSO710_DMX_ORDER_VL';
					}
					if(this.lstFactory=='VO')
					{
						//alert(this.lstFactory);
						this.impEndCol = 6;
						this.imp_start_row=3;
						this.imp_template_file = 'report/sw/10/RPT_IMP_ORDER_DATAMAX_VO.xlsx';
						this.imp_store_prod = 'SW_IMP_SWSO710_DMX_ORDER_VO';
					}
					if(this.lstFactory=='VP')
					{
						//alert(this.lstFactory);
						this.impEndCol = 76;
						this.imp_start_row=1;
						this.imp_template_file = 'report/sw/10/RPT_IMP_ORDER_DATAMAX_VP.xlsx';
						this.imp_store_prod = 'SW_IMP_SWSO710_DMX_ORDER_VP';
					}
					if(this.lstFactory=='VQ1')
					{
						//alert(this.lstFactory);
						this.impEndCol = 98;
						this.imp_start_row=1;
						this.imp_template_file = 'report/sw/10/RPT_IMP_ORDER_DATAMAX_VQ1.xlsx';
						this.imp_store_prod = 'SW_IMP_SWSO710_DMX_ORDER_VQ1';
					}
					if(this.lstFactory=='VQ2')
					{
						//alert(this.lstFactory);
						this.impEndCol = 99;
						this.imp_start_row=1;
						this.imp_template_file = 'report/sw/10/RPT_IMP_ORDER_DATAMAX_VQ2.xlsx';
						this.imp_store_prod = 'SW_IMP_SWSO710_DMX_ORDER_VQ2';
					}
					if(this.lstFactory=='VW')
					{
						//alert(this.lstFactory);
						this.impEndCol = 84;
						this.imp_start_row=5;
						this.imp_template_file = 'report/sw/10/RPT_IMP_ORDER_DATAMAX_VW.xlsx';
						this.imp_store_prod = 'SW_IMP_SWSO710_DMX_ORDER_VW';
					}
					if(this.lstFactory=='VW2')
					{
						//alert(this.lstFactory);
						this.impEndCol = 84;
						this.imp_start_row=5;
						this.imp_template_file = 'report/sw/10/RPT_IMP_ORDER_DATAMAX_VW2.xlsx';
						this.imp_store_prod = 'SW_IMP_SWSO710_DMX_ORDER_VW2';
					}
					if(this.lstFactory=='VY')
					{
						//alert(this.lstFactory);
						this.impEndCol = 105;
						this.imp_start_row=1;
						this.imp_template_file = 'report/sw/10/RPT_IMP_ORDER_DATAMAX_VY.xlsx';
						this.imp_store_prod = 'SW_IMP_SWSO710_DMX_ORDER_VY';
					}
					if(this.lstFactory=='VT')
					{
						//alert(this.lstFactory);
						this.impEndCol = 74;
						this.imp_start_row=1;
						this.imp_template_file = 'report/sw/10/RPT_IMP_ORDER_DATAMAX_VT.xlsx';
						this.imp_store_prod = 'SW_IMP_SWSO710_DMX_ORDER_VT';
					}
			}
			/*if(this.tab_staus==2)
			{	
				this.impEndCol = 28;
				this.imp_start_row=2;
				this.impValidValue ='CN';
				this.impValidCol=8;
				this.imp_template_file = 'report/sw/10/RPT_IMP_MCL_CHINA.xlsx';
				this.imp_store_prod = 'SW_IMP_SW10110_MCL_NOCACHE';
				 
			}
			
			if (this.tab_staus == "tabSeason") {//SEASON
				this.tab_staus=3;
				//onChangeFactory();
                this.impEndCol = 17;
				this.imp_start_row=2;
				//this.impValidValue =this.lstFactory;
				//this.impValidCol=2;
                this.imp_template_file = 'report/sw/10/RPT_IMP_SEASON_CHINA.xlsx';
                this.imp_store_prod = 'SW_IMP_SW10110_SEASON_NOCACHE';
            }*/
			if (this.tab_staus == 2) {//Translate
				this.tab_staus=2;
				//alert(this.lstFactory+"-0-"+this.tab_staus);
					if(this.lstFactory=='ENG-ANTA-QR')//TYPE OLD ONE TEMPLET SAME CHINA ANTA=ENGLISH ANTA QR
					{
						//alert(this.lstFactory);
						this.impEndCol = 25;
						this.imp_start_row=2;
						this.imp_template_file = 'report/sw/nk/swnk050_import_order_detail_v2.xlsx';
						this.imp_store_prod = 'SZ_IMP_SWNK050_ORDER_DTL_V2';
					} 
					if(this.lstFactory=='ENG-ANTA-QR2')//TYPE 5563 
					{
						//alert(this.lstFactory);
						this.impEndCol = 33;
						this.imp_start_row=2;
						this.imp_template_file = 'report/sw/nk/swnk050_import_order_detail_v2_2.xlsx';
						this.imp_store_prod = 'SZ_IMP_SWNK030_ORDER_DTL_V2_2';
					}	
					if(this.lstFactory=='LW')
					{
						//alert(this.lstFactory);
						this.impEndCol = 12;
						this.imp_start_row=2;
						this.imp_template_file = 'report/sw/10/RPT_IMP_ORDER_PRICE_DATAMAX_LW.xlsx';
						this.imp_store_prod = 'SW_UPD_SWSO710_DMX_ORDER_LW';
					}
					if(this.lstFactory=='VE')
					{
						//alert(this.lstFactory);
						this.impEndCol = 13;
						this.imp_start_row=2;
						this.imp_template_file = 'report/sw/10/RPT_IMP_ORDER_PRICE_DATAMAX_VE.xlsx';
						this.imp_store_prod = 'SW_UPD_SWSO710_DMX_ORDER_VE';
					}
					if(this.lstFactory=='VG1')
					{
						//alert(this.lstFactory);
						this.impEndCol = 15;
						this.imp_start_row=2;
						this.imp_template_file = 'report/sw/10/RPT_IMP_ORDER_PRICE_DATAMAX_VG1.xlsx';
						this.imp_store_prod = 'SW_UPD_SWSO710_DMX_ORDER_VG1';
					}
					if(this.lstFactory=='VG2')
					{
						//alert(this.lstFactory);
						this.impEndCol = 8;
						this.imp_start_row=2;
						this.imp_template_file = 'report/sw/10/RPT_IMP_ORDER_PRICE_DATAMAX_VG2.xlsx';
						this.imp_store_prod = 'SW_UPD_SWSO710_DMX_ORDER_VG2';
					}
					if(this.lstFactory=='VO')
					{
						//alert(this.lstFactory);
						this.impEndCol = 20;
						this.imp_start_row=4;
						this.imp_template_file = 'report/sw/10/RPT_IMP_ORDER_PRICE_DATAMAX_VO.xlsx';
						this.imp_store_prod = 'SW_UPD_SWSO710_DMX_ORDER_VO';
					}
					
					if(this.lstFactory=='VP')
					{
						//alert(this.lstFactory);
						this.impEndCol = 8;
						this.imp_start_row=2;
						this.imp_template_file = 'report/sw/10/RPT_IMP_ORDER_PRICE_DATAMAX_VP.xlsx';
						this.imp_store_prod = 'SW_UPD_SWSO710_DMX_ORDER_VP';
					}
					if(this.lstFactory=='VW')
					{
						//alert(this.lstFactory);
						this.impEndCol = 16;
						this.imp_start_row=2;
						this.imp_template_file = 'report/sw/10/RPT_IMP_ORDER_PRICE_DATAMAX_VW.xlsx';
						this.imp_store_prod = 'SW_UPD_SWSO710_DMX_ORDER_VW';
					}
					if(this.lstFactory=='VW2')
					{
						//alert(this.lstFactory);
						this.impEndCol = 18;
						this.imp_start_row=2;
						this.imp_template_file = 'report/sw/10/RPT_IMP_ORDER_PRICE_DATAMAX_VW2.xlsx';
						this.imp_store_prod = 'SW_UPD_SWSO710_DMX_ORDER_VW2';
					}
					if(this.lstFactory=='VY')
					{
						//alert(this.lstFactory);
						this.impEndCol = 11;
						this.imp_start_row=2;
						this.imp_template_file = 'report/sw/10/RPT_IMP_ORDER_PRICE_DATAMAX_VY.xlsx';
						this.imp_store_prod = 'SW_UPD_SWSO710_DMX_ORDER_VY';
					}
					if(this.lstFactory=='VO')
					{
						//alert(this.lstFactory);
						this.impEndCol = 20;
						this.imp_start_row=4;
						this.imp_template_file = 'report/sw/10/RPT_IMP_ORDER_PRICE_DATAMAX_VO.xlsx';
						this.imp_store_prod = 'SW_UPD_SWSO710_DMX_ORDER_VO';
					}
            }
			
			
        },
        getSearchParas() {
            let paras = [];
            if (this.selectedTab === "tabOrder") {
                paras = [
                    this.selectedCompany,
                    this.txtAccCD_NM,
                    this.month.replace("-", ""),
                    this.month_to.replace("-", ""),
                    this.lstFactory
                ];
            } else {
                paras = [
                    this.selectedCompany,
                    this.deli_date.replace("-", ""),//this.txtPartnerCD_NM,
                    this.txtAccCD_NM,
                    this.txtNation,//this.selectedAccountType,
                    this.month.replace("-", ""),
                    this.lstFactory,
					this.month_to.replace("-", "")
                ];
            }
            return paras;
        },
        search() {
            let paras = this.getSearchParas();
			if (this.selectedTab === "tabOrder") 
			{
				this.$refs[this.selectedTab].search(paras);
			}
			else
			{
				if (this.txtAccCD_NM !='' && this.txtNation !='') 
				{
					this.$refs[this.selectedTab].search(paras);
				}
				else
				{
					alert("pls,input PO NO and Nation to search for export data!");
				}
			}
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
            } /*else if (this.selectedTab == "tabMCL") {
                tab = 1;
            }
            else if (this.selectedTab == "tabSeason") {
                   tab = 2;
				   let paras = this.getSearchParas();
					this.$refs[this.selectedTab].save(paras);
                 } 
            else if (this.selectedTab == "tabTranslate") { 
                tab = 3;
            }*/
            else if (this.selectedTab == "tabExport") {
                   tab = 2;
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
				   alert("Delete Data Order?");
				   const dso = {
					type: "process",
					updpro: "SW_PRO_SWNK030_DELETE",
					para: [this.selectedCompany, this.month.replace("-", ""), tab, this.lstFactory, this.selectedAccountType, this.txtPartnerCD_NM]
			  
					}; // 
					const result = await this._dsoCall(dso, "process", false);
					 setTimeout(() => { 
						 this.search(); 
					 }, 1000);
		
		},
		async onProcessAutoSize()
		{
			const dso = {
					type: "process",
					//updpro: "SW_PRO_SW10110_DELETE_ORD_MCL",
					//para: [this.selectedCompany, this.month.replace("-", ""), tab, this.lstFactory]
					updpro: "sp_sel_swnk030_export_v1",
					para: [this.selectedCompany,'','','',this.month.replace("-", ""),'V3',''],
					//para: [this.selectedCompany,'','','',this.month.replace("-", ""),this.lstFactory,''],
					};
					const result = await this._dsoCall(dso, "process", false);
					 setTimeout(() => { 
						 this.search(); 
					 }, 1000);
		},
	//============================report-------
	async onReport() { 
	
		const data_seach = [{  
						P_FILE_NAME_NEW: "rptswsoNK030_",
						p_company_pk :this.selectedCompany,
						p_PartnerCD_NM :this.deli_date.replace("-", ""),//this.deli_date.replace("-", ""),   p_PartnerCD_NM :this.txtPartnerCD_NM
						p_AccCD_NM :this.txtAccCD_NM,
						p_AccountType :this.txtNation,
						p_month :this.month.replace("-", ""),
						p_factory_pk :this.lstFactory,
						p_month_to :this.month_to.replace("-", "")
				
			}, ];
			var file_nm ="rptswsoNK050_barcode_detail_nike" + "_" + this.user.USER_ID + ".xlsx";//rptswso710_barcode_detail_nike
			var url_path = "/report/rptswso420/rptswsoNK050_02";//D:\Webproject\gsf20\app\Controllers\Http\report\SW\SO\rptswso420.js-->rptswsoNK050_01
			try {
				const result = await this.$axios.$get(url_path, {
					responseType: "blob",
					params: {
						para: data_seach,
					},
				});
				if (result) {
					this._ExcelSaveAs(result, file_nm);
				} else {
					this.showNotification(
						"danger",
						this.$t("fail_to_export_report"),
						"",
						4000
					);
				}
			} catch (e) {
				this.showNotification("danger", e.message, "", 4000);
			}
},
	//============end--------------------------	
	//======big==data=use===it==========
	/*async onReportCSV_22()
	{
		try {
        this.isProcessing = true;
        var reportPath;
        var reportName = this.report_name;
        var proc;
        var proc2;
        var params;
		
        reportPath = "report/sw/nk/rpt_swnk030_csv_02.xlsx"; 
            proc = "SZ_RPT_SWNK030_CSV_NOCACHE";
            //reportName = "RPT_SW20030_RFID_Y_1.xlsx";
            params = [
						this.selectedCompany,
						this.txtPartnerCD_NM,
						this.txtAccCD_NM,
						this.selectedAccountType,
						this.month.replace("-", ""),
						this.lstFactory,
						this.month_to.replace("-", "")
					];//this.reportParams;

        if (!this.txtAccCD_NM) {
          this.showNotification("danger", this.$t("please_select_an_order"), "");
          return;
        }

        let excel = [];
        var insertHeader = [];

        if (this.selectedReportType === "2.1" || this.selectedReportType === "2.2" || this.selectedReportType === "2.3") {
          if (proc2 === "CARELABEL") {
            excel = [
              {
                sheet: 1,
                insertRange: [
                  {
                    range: "C1:D1",
                    proc: proc,
                    params: ["u"],
                  },
                ],
              },
            ];
          } else {
            excel = [
              {
                sheet: 1,
                insertRows: [{ startRow: 2, by: "index", proc: proc, params: [...params] }],
              },
            ];
          }
        } else {
          excel = [
            {
              sheet: 1,
              insertRows: [{ startRow: 2, by: "index", proc: proc, params: [...params] }],
            },
          ];
        }

        
        // console.log(excel)
        let res;
        if (proc2 === "CARELABEL") {
          res = await this.$axios.$get("/dso/makereport", {
            responseType: "blob",
            params: {
              template: reportPath,
              excel: JSON.stringify(excel),
              debug: true,
            },
          });
        } else {
          res = await this.$axios.$get("dso/expbigexcel", {
            responseType: "blob",
            params: {
              proc: proc,
              para: params,
            },
          });
        }
        console.log("res:", res);
        if (res) {
          if (proc2 === "CARELABEL") {
            
            const message = this.$t("export_success_message", { careQty: this.P_CAREQTY, kind: this.P_KIND });
            // console.log("message:", message);
            this.$refs.alertDialog.showAlert("success", "success", "", message);
            // this.showNotification("success", this.$t("export_success_message"), "", 6000);
          }
          this._ExcelSaveAs(res, reportName);
          this.isProcessing = false;
        } else {
          this.isProcessing = false;
          this.showNotification("danger", this.$t("fail_to_export_report"), "", 4000);
        }
      } catch (error) {
        this.isProcessing = false;
        console.log("downloadExcel-catch exception:", error.message);
      } finally {
        this.isProcessing = false;
      }
	  
	},*/
	//========================
	//=====================begin===print====CSV===========
	async onReportCSV() {
		alert("Bạn Đang Print Report CSV,vui lòng đợi(dữ liệu lớn)..... ");
       if (!this._hasValue(this.lstFactory))
       {
         this.showNotification( "danger",this.$t("please_select_one_consignor"), "", 4000);
         return;
       }			
        let p_param = [
			this.selectedCompany,
			this.deli_date.replace("-", ""),
			this.txtAccCD_NM,
			this.txtNation,
			this.month.replace("-", ""),
			this.lstFactory,
			this.month_to.replace("-", "")
        ];
        let report_no = this.lstFactory;
        let report_path = "";
        let report_name = "";   
        let report_name_ext = "pdf";        
        let excel = [];

       
	let report_main = "rpt_swnk050_csv_02";
	let report = "rpt_swnk050_csv_02_PO_"+this.txtAccCD_NM+"_"+this.month.replace("-", "");
      try{
        this._ExcelSaveAs(await this.$axios.$get('/dso/makereport', {responseType: "blob", params: {
          template: "report/sw/nk/" + report_main + ".xlsx",
          excel: JSON.stringify([{
            insertRange: [{
              range: "A1:T10", proc: "SZ_RPT_SWNK050_CSV_NOCACHE", params: [...p_param],//SW_SEL_SW10110_export_custom
            }],
            insertRows: [{
				startRow: 2, proc: "SZ_RPT_SWNK050_CSV_NOCACHE", params: [...p_param], 
                                         
              //startRow: 8, proc: "SW_SEL_SW10090_REPORT_FACT_DT", params: [...p_param]
            }]
          }]),
          convert: "xlsx"}
        }), report + "." + "xlsx");
      } catch (e) {
        this.showNotification("danger", this.$t("fail_to_export_report"), "", 4000);
      }
       
      },
	//===========end==print-CSV===========================
	async onReport2() { 
	
		/*const data_seach = [{
							   P_RPT_FILE: "rpt_SWSO110_AUTO_SIZE",
							   P_FILE_TYPE: ".xlsx" ,                                     
							   p_AccountCode : ""   ,
							   p_AccountType  : ""  ,                                    
							   p_IMPORT_DATE  : ""  ,
							   p_Factory  : ""      ,
							   p_upper_length : ""  //,
							   //P_LANGUAGE : "rpt_SWSO110_AUTO_SIZE", 
							  // p_CRT_BY  : this.user.USER_ID  
							    
						
					}, ];
					var file_nm =
						"rpt_SWSO110_AUTO_SIZE" + "_" + this.user.USER_ID + ".xlsx";
					var url_path = "/report/rptSWSO110/onAutoSize";
					try {
						const result = await this.$axios.$get(url_path, {
							responseType: "blob",
							params: {
								para: data_seach,
							},
						});
						if (result) {
							this._ExcelSaveAs(result, file_nm);
						} else {
							this.showNotification(
								"danger",
								this.$t("fail_to_export_report"),
								"",
								4000
							);
						}
					} catch (e) {
						this.showNotification("danger", e.message, "", 4000);
					}*/
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
			this.month_to.replace("-", "")
        ];
        let report_no = this.lstFactory;
        let report_path = "";
        let report_name = "";   
        let report_name_ext = "pdf";        
        let excel = [];

       
	let report_main = "rpt_swnk030_barcode_detail_v01";
	let report = "rpt_swnk030_barcode_detail_PO_"+this.txtAccCD_NM+"_"+this.month.replace("-", "");
      try{
        this._ExcelSaveAs(await this.$axios.$get('/dso/makereport', {responseType: "blob", params: {
          template: "report/sw/nk/" + report_main + ".xlsx",
          excel: JSON.stringify([{
            insertRange: [{
              range: "A1:T10", proc: "SZ_SEL_SWNK030_EXPORT_MST_NOCACHE", params: [...p_param],//SW_SEL_SW10110_export_custom
            }],
            insertRows: [{
				startRow: 11, proc: "SZ_SEL_SWNK030_EXPORT_NOCACHE", params: [...p_param], stringColumns: [ "PO_NO","BARCODE"], subStyle: { font : {   bold: true   } , fill: {
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
