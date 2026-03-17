<template>
    <v-container>
        
    </v-container>
</template>

<script>

  export default {
    name: '1030050-rpt',

    data: () => ({
        selectedCompany:null,
        allowanceList:[],
        unfixAllowanceList:[],

        companyList:[],
        company:null,
    }),

    

    computed:
    {
      user: function()
      {
          return this.$store.getters["auth/user"];
      },
    },

    created() {
      this.selectedCompany = this.user.TCO_COMPANY_PK;
      this.prepareCommonData();

    },


    methods: {
        async prepareCommonData(){
            const dsoAllow = {
                type: 'grid',
                selpro: 'hr_rpt_get_allowance',
                para: [this.selectedCompany]
            }

            const dsoUnfix = {
                type: 'grid',
                selpro: 'HR_RPT_GET_UNFIX_ALLOWANCE',
                para: [this.selectedCompany]
            }

            const result = await this._dsoCall(dsoAllow, 'select', false)
            if(result) {
                this.allowanceList = result;
            } 

            const result2 = await this._dsoCall(dsoUnfix, 'select', false)
            if(result2) {
                this.unfixAllowanceList = result2;
            } 

            this.companyList = await this._getCompany();
            this.company = this.companyList.find(x => x["PK"] === this.selectedCompany );
        },
      
        excelPayroll(that, p_month, p_param ) {
            let excel = [];
            let reportHeader = {};
            let startAllow1 = 17 - 1;
            let startAllow2 = 32 - 1;
            let startAllow3 = 69 - 1;
            //let startAllowK = 84 - 1;

            let hiddenCols = [];
            for(let i = 1; i <= 15; i++) {
              let allowIdx = this.allowanceList.findIndex( x =>  Number(x.CODE.replace("A","")) == i);
              if(allowIdx >= 0) {
                let allow = this.allowanceList[allowIdx];

                if( allow.USE_YN === "Y" ) {
                  reportHeader["A"+ Number(allow.CODE.replace("A","")) + "_LOCAL" ] = allow.NAME;
                } else {
                  hiddenCols.push( startAllow1 + i); 
                  hiddenCols.push( startAllow2 + i); 
                  hiddenCols.push( startAllow3 + i); 
                }
              } else {
                hiddenCols.push( startAllow1 + i); 
                hiddenCols.push( startAllow2 + i); 
                hiddenCols.push( startAllow3 + i); 
              }
            }

            excel = [
              //sheet1
              {
                sheet: 1,
                insertRange: [
                  { range: "A5:DJ8", data: reportHeader },//header
                  { range: "A1:DJ3", proc: "HR_RPT_1030050_COMPANY_INFO_V2", params: [this.selectedCompany, p_month, that.selectedOrg, that.selectedPeriod]  },//header
                ],
                insertRows: [
                  {   
                    sequence: "break",
                    startRow: 9, proc: "hr_rpt_1030050_payroll", params: [...p_param], dateColumns: [ "JOIN_DT", "LEFT_DT" ] , stringColumns: [ "EMP_ID", "ID_NUM","OLD_ID" ],
                    total: [
                      {   column: "DIV", isDisplay: true, type: "SUM", text:  this.$t("total")  , isMerge: false, merge: { from: 2, to: 8 }    }, //"Total $[0]: $[1] record(s) "
                      {   column: null, isDisplay: true, type: "SUM", text: this.$t("total"), isMerge: true, isGrandTotal: true , font: {  size: 18, bold: true } , merge: { from: 1, to: 8 }  }, //"Grand total: $[1] record(s) "
                    ]
                  }
                ],
                hideColumns: hiddenCols
              },
            ];

            


            //for other company 
            if(this.company) {
                switch(this.company["PARTNER_ID"]) {
                    case 'AJ': {
                        excel = [
                          //sheet1
                          {
                            sheet: 1,
                            insertRange: [
                              //{ range: "A5:DJ8", data: reportHeader },//header
                              { range: "A1:BG20", proc: "HR_RPT_1030050_COMPANY_INFO_V2", params: [this.selectedCompany, p_month, that.selectedOrg, that.selectedPeriod]  },//header
                            ],
                            insertRows: [
                              {   
                                sequence: "break",
                                startRow: 13, proc: "hr_rpt_1030050_payroll_nocache", params: [...p_param], dateColumns: [ "JOIN_DT", "LEFT_DT" ] , stringColumns: [ "EMP_ID", "ID_NUM","OLD_ID" ],
                                total: [
                                  //{   column: "DIV", isDisplay: true, type: "SUM", text:  this.$t("total") + " $[0] $[1] Employee(s)"  , isMerge: false, merge: { from: 2, to: 8 }    }, //"Total $[0]: $[1] record(s) "
                                  {   column: null, isDisplay: true, type: "SUM", text: this.$t("grand_total") + " $[1] Employee(s)" 
                                      , isMerge: true
                                      , isGrandTotal: true 
                                      , font: {  name:'Times New Roman', size: 16, bold: true } 
                                      , merge: { from: 1, to: 5 }  
                                      , fill: {
                                        type: 'pattern',
                                        pattern:'solid',
                                        fgColor:{ argb: 'f5ff96'},
                                        bgColor:{ argb: 'f5ff96'}
                                      }
                                  }, //"Grand total: $[1] record(s) "
                                ]
                              }
                            ],
                          },
                        ];
                        
                        break;
                    }

                }
            }




            


            return excel;
        },


        excelPayrollSummary( that,p_month, p_param ) {
            let hiddenCols = [];
            let startAllow1 = 6-1;
            let excel = [];
            let reportHeader = {};

            //setup allow col
            for(let i = 1; i <= 15; i++) {
              let allowIdx = this.allowanceList.findIndex( x =>  Number(x.CODE.replace("A","")) == i);
              if(allowIdx >= 0) {
                let allow = this.allowanceList[allowIdx];

                if( allow.USE_YN === "Y" ) {
                  reportHeader["A"+ Number(allow.CODE.replace("A","")) + "_LOCAL" ] = allow.NAME;
                } else {
                  hiddenCols.push( startAllow1 + i); 
                }
              } else {
                hiddenCols.push( startAllow1 + i); 
              }
            }



            //for other company 
            if(this.company) {
                switch(this.company["PARTNER_ID"]) {
                    case 'AJ': {
                        excel = [];
                        reportHeader = {};
                        let startAllowK = 21-1;

                        //setup allow col
                        for(let i = 1; i <= 15; i++) {
                            let allowIdx = this.allowanceList.findIndex( x =>  Number(x.CODE.replace("A","")) == i);
                            if(allowIdx >= 0) {
                                let allow = this.allowanceList[allowIdx];

                                if( allow.USE_YN === "Y" ) {
                                    reportHeader["A"+ Number(allow.CODE.replace("A","")) + "_LOCAL" ] = allow.NAME;
                                } else {
                                    hiddenCols.push( startAllow1 + i); 
                                }
                            } else {
                                hiddenCols.push( startAllow1 + i); 
                            }
                        }
                        
                        for(let i = 1; i <= 8; i++) {
                            let allowIdx = this.unfixAllowanceList.findIndex( x =>  Number(x.CODE) == i);
                            if(allowIdx >= 0) {
                                let allow = this.unfixAllowanceList[allowIdx];

                                if( allow.USE_YN === "Y" ) {
                                    reportHeader["K"+ Number(allow.CODE)  ] = allow.NAME;
                                } else {
                                    hiddenCols.push( startAllowK + i); 
                                }
                            } else {
                                hiddenCols.push( startAllowK + i); 
                            }
                        }

                        break;
                    }

                }
            }



            excel = [
              //sheet1
              {
                sheet: 1,
                insertRange: [
                  { range: "A5:AP6", data: reportHeader },//header
                  { range: "A1:AP3", proc: "HR_RPT_1030050_COMPANY_INFO_V2", params: [this.selectedCompany, p_month, that.selectedOrg, that.selectedPeriod]  },//header
                ],
                insertRows: [
                  {   
                    sequence: "break",
                    startRow: 7, proc: "hr_rpt_1030050_payroll_summary", params: [...p_param] ,
                    total: [
                      {   column: "DIV", isDisplay: true, type: "SUM", text: this.$t("total") , isMerge: false, merge: { from: 1, to: 2 }   }, //"Total $[0]: $[1] record(s) "
                      {   column: null, isDisplay: true, type: "SUM", text: this.$t("total"), isMerge: true, isGrandTotal: true , font: {  size: 15, bold: true } , merge: { from: 1, to: 2 }  }, //"Grand total: $[1] record(s) "
                    ]
                  }
                ],
                hideColumns: hiddenCols
              },
            ];

            return excel;
        },

        excelPaymentByBank( that,p_month, p_param ) {
            let excel = [
              //sheet1
              {
                sheet: 1,
                insertRange: [
                  { range: "A1:I21", proc: "HR_RPT_1030050_COMPANY_INFO_V2", params: [this.selectedCompany, p_month, that.selectedOrg, that.selectedPeriod]  },//header
                ],
                insertRows: [
                  {   
                    sequence: "break",
                    startRow: 11, proc: "hr_rpt_1030050_payment_bank", params: [...p_param] ,
                    total: [
                      {   column: null, isDisplay: true, type: "SUM", text: this.$t("TOTAL"), isMerge: true, isGrandTotal: true , font: {  size: 15, bold: true } , merge: { from: 1, to: 4 }  }, //"Grand total: $[1] record(s) "
                    ]
                  }
                ],
              },
            ];
            return excel;
        },

        excelPaymentByCash(that, p_month, p_param ) {
            let excel = [
              //sheet1
              {
                sheet: 1,
                insertRange: [
                  { range: "A1:F6", proc: "HR_RPT_1030050_COMPANY_INFO_V2", params: [this.selectedCompany, p_month, that.selectedOrg, that.selectedPeriod]  },//header
                ],
                insertRows: [
                  {   
                    sequence: "break",
                    startRow: 9, proc: "hr_rpt_1030050_payment_cash", params: [...p_param] , dateColumns: [ "JOIN_DT", "LEFT_DT" ],
                    total: [
                      {   column: null, isDisplay: true, type: "SUM", text: this.$t("total"), isMerge: true, isGrandTotal: true , font: {  size: 15, bold: true } , merge: { from: 1, to: 5 }  }, //"Grand total: $[1] record(s) "
                    ]
                  }
                ],
              },
            ];
            return excel;
        },

        excelInsurancePayment(that, p_month, p_param ) {
            let excel = [
              //sheet1
              {
                sheet: 1,
                insertRange: [
                  { range: "A1:O17", proc: "HR_RPT_1030050_COMPANY_INFO_V2", params: [this.selectedCompany, p_month, that.selectedOrg, that.selectedPeriod]  },//header
                ],
                insertRows: [
                  {   
                    sequence: "break",
                    startRow: 9, proc: "hr_rpt_1030050_insurance", params: [...p_param], dateColumns: [ "JOIN_DT", "LEFT_DT" ] , stringColumns: [ "EMP_ID", "ID_NUM","OLD_ID", "E_ACCOUNT" ],
                    total: [
                      {   column: null, isDisplay: true, type: "SUM", text: this.$t("total"), isMerge: true, isGrandTotal: true , font: {  size: 15, bold: true } , merge: { from: 1, to: 5 }  }, //"Grand total: $[1] record(s) "
                    ]
                  }
                ],
              },
            ];
            return excel;
        },

        excelPersonalIncomeTax(that, p_month, p_param ) {
            let excel = [
              //sheet1
              {
                sheet: 1,
                insertRange: [
                  { range: "A1:P19", proc: "HR_RPT_1030050_COMPANY_INFO_V2", params: [this.selectedCompany, p_month, that.selectedOrg, that.selectedPeriod]  },//header
                ],
                insertRows: [
                  {   
                    sequence: "break",
                    startRow: 9, proc: "hr_rpt_1030050_per_tax", params: [...p_param], stringColumns: [ "EMP_ID", "ID_NUM","OLD_ID", "E_ACCOUNT" ],
                    total: [
                        {   column: null, isDisplay: true, type: "SUM", text: this.$t("total"), isMerge: true, isGrandTotal: true 
                            , font: {  size: 13, bold: true } , merge: { from: 1, to: 3 }
                            , fill  : { 
                                type: 'pattern',
                                pattern:'solid',
                                fgColor:{ argb: '69cdff'},
                                bgColor:{ argb: '69cdff'}
                             }
                        }, //"Grand total: $[1] record(s) "
                    ]
                  }
                ],
              },
            ];
            return excel;
        }

    }
  }
</script>
