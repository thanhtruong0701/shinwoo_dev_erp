<template>
  <v-dialog id="View E-invoice" max-width="800" v-model="dialogIsShow">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ $t("view-einvoice-dialog") }}</span>
        <v-spacer></v-spacer>
        <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
      </v-card-title>
      <v-container fluid class="pt-0">
        <v-row no-gutters>
			<component :is="nameForm"   :paramsResult="params"/>
        </v-row>
      </v-container>
    </v-card>
	
  </v-dialog>
</template>
<script>
export default {
  name: "view-einvoice-dialog",
  props: ["reportID"],
   components: {    
    AJTOTAL_AH20E_T_C: () => import("@/components/part/60/95/6095050_ajtotal_ah20e_t_c"),
    AJTOTAL_AH20E_T_O: () => import("@/components/part/60/95/6095050_ajtotal_ah20e_t_o")
  },
  data: () => ({
	  nameForm: 'AJTOTAL_AH20E_T_C',
    dialogIsShow: false,
    dataList: [],
    userIdName: "",
    selectedDatas: [],
    txtTeiCompanyPK:"",
	  txtInvoiceType:"",
	  txtConvertYN:"",
	  txtReportPK:"",
    params:{},
  }),

  computed: {
    limitHeight() {
      return this.windowHeight;
    },
  },
  watch:
  {
    reportID(val) {
        console.log('reportID');
        console.log(val);
	   	  this.txtTeiCompanyPK = val.TEI_COMPANY_PK;
		    this.txtInvoiceType = val.REPORT_ID_TYPE;
		    this.txtConvertYN = val.CONVERT_YN;
		    this.txtReportPK = val.PK;
        this.params = {
                PK :val.PK,
                REPORT_ID_TYPE : val.REPORT_ID_TYPE,
                TEI_COMPANY_PK : val.TEI_COMPANY_PK,
                CONVERT_YN : val.CONVERT_YN,
                REPORT_ID: val.REPORT_ID
              }
		    this.checkCompanyIssue();
    },
	
  },
  
  methods: {
	checkCompanyIssue(){
		 switch (this.txtTeiCompanyPK) {
			case 482:
        if(this.txtConvertYN === 'Y')
        {
          this.nameForm = "AJTOTAL_AH20E_T_C";
        }else
          {
            this.nameForm = "AJTOTAL_AH20E_T_O";
          }
			break;   	
		 }
	}, 
  },
};
</script>
