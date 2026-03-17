<template>
    <v-container>
        
    </v-container>
</template>

<script>

  export default {
    name: '1030050-rpt',

    props: {
      tco_company_pk:{
        type: [String, Number],
        default: null
      }
    },

    data: () => ({
        allowanceList:[],
        unfixAllowanceList:[],

        companyList:[],
        company:null,
    }),

    watch:{
      tco_company_pk:function(value) {
        if(value) {
          this.prepareCommonData();
        }

      }
    },

    computed:
    {
      user: function()
      {
          return this.$store.getters["auth/user"];
      },
    },

    created() {
      //this.selectedCompany = this.user.TCO_COMPANY_PK;
      

    },


    methods: {
        async prepareCommonData(){
            const dsoAllow = {
                type: 'grid',
                selpro: 'hr_rpt_get_allowance',
                para: [this.tco_company_pk]
            }

            const dsoUnfix = {
                type: 'grid',
                selpro: 'HR_RPT_GET_UNFIX_ALLOWANCE',
                para: [this.tco_company_pk]
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
            this.company = this.companyList.find(x => x["PK"] === this.tco_company_pk );
        },
      
        excelPayroll( p_month, p_param, p_param_extra = null ) {
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
                  { range: "A1:DJ3", proc: "hr_rpt_1030050_company_info", params: [this.tco_company_pk, p_month]  },//header
                ],
                insertRows: [
                  {   
                    sequence: "break",
                    startRow: 9, proc: "hr_rpt_1030050_payroll", params: [...p_param], dateColumns: [ "JOIN_DT", "LEFT_DT" ] , stringColumns: [ "EMP_ID", "ID_NUM","OLD_ID" ],
                    param_extra: [...p_param_extra], 
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
                              { range: "A1:BG20", proc: "hr_rpt_1030050_company_info", params: [this.tco_company_pk, p_month]  },//header
                            ],
                            insertRows: [
                              {   
                                sequence: "break",
                                startRow: 13, proc: "hr_rpt_1030050_payroll_nocache", params: [...p_param], dateColumns: [ "JOIN_DT", "LEFT_DT" ] , stringColumns: [ "EMP_ID", "ID_NUM","OLD_ID" ],
                                param_extra: [...p_param_extra],
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


        excelPayrollSummary( p_month, p_param, p_param_extra = null ) {
            let hiddenCols = [];
            let startAllow1 = 6-1;
            let startAllowK = 21-1;
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



            //for other company 
            if(this.company) {
                switch(this.company["PARTNER_ID"]) {
                    case 'AJ': {
                        excel = [];
                        reportHeader = {};
                        //let startAllowK = 21-1;

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
                  { range: "A1:AP3", proc: "hr_rpt_1030050_company_info", params: [this.tco_company_pk, p_month]  },//header
                ],
                insertRows: [
                  {   
                    sequence: "break",
                    startRow: 7, proc: "hr_rpt_1030050_payroll_summary", params: [...p_param] ,
                    param_extra: [...p_param_extra],
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

        excelPaymentByBank( p_month, p_param, p_param_extra = null ) {
            let excel = [
              //sheet1
              {
                sheet: 1,
                insertRange: [
                  { range: "A1:I21", proc: "hr_rpt_1030050_company_info", params: [this.tco_company_pk, p_month]  },//header
                ],
                insertRows: [
                  {   
                    sequence: "break",
                    startRow: 11, proc: "hr_rpt_1030050_payment_bank", params: [...p_param] ,
                    param_extra: [...p_param_extra],
                    total: [
                      {   column: null, isDisplay: true, type: "SUM", text: this.$t("TOTAL"), isMerge: true, isGrandTotal: true , font: {  size: 15, bold: true } , merge: { from: 1, to: 4 }  }, //"Grand total: $[1] record(s) "
                    ]
                  }
                ],
              },
            ];
            return excel;
        },

        excelPaymentByCash( p_month, p_param, p_param_extra = null ) {
            let excel = [
              //sheet1
              {
                sheet: 1,
                insertRange: [
                  { range: "A1:F6", proc: "hr_rpt_1030050_company_info", params: [this.tco_company_pk, p_month]  },//header
                ],
                insertRows: [
                  {   
                    sequence: "break",
                    startRow: 9, proc: "hr_rpt_1030050_payment_cash", params: [...p_param] , dateColumns: [ "JOIN_DT", "LEFT_DT" ],
                    param_extra: [...p_param_extra],
                    total: [
                      {   column: null, isDisplay: true, type: "SUM", text: this.$t("total"), isMerge: true, isGrandTotal: true , font: {  size: 15, bold: true } , merge: { from: 1, to: 5 }  }, //"Grand total: $[1] record(s) "
                    ]
                  }
                ],
              },
            ];
            return excel;
        },

        excelInsurancePayment( p_month, p_param, p_param_extra = null) {
            let excel = [
              //sheet1
              {
                sheet: 1,
                insertRange: [
                  { range: "A1:O17", proc: "hr_rpt_1030050_company_info", params: [this.tco_company_pk, p_month]  },//header
                ],
                insertRows: [
                  {   
                    sequence: "break",
                    startRow: 9, proc: "hr_rpt_1030050_insurance", params: [...p_param], dateColumns: [ "JOIN_DT", "LEFT_DT" ] , stringColumns: [ "EMP_ID", "ID_NUM","OLD_ID", "E_ACCOUNT" ],
                    param_extra: [...p_param_extra],
                    total: [
                      {   column: null, isDisplay: true, type: "SUM", text: this.$t("total"), isMerge: true, isGrandTotal: true , font: {  size: 15, bold: true } , merge: { from: 1, to: 5 }  }, //"Grand total: $[1] record(s) "
                    ]
                  }
                ],
              },
            ];
            return excel;
        },

        excelPersonalIncomeTax( p_month, p_param, p_param_extra = null ) {
            let excel = [
              //sheet1
              {
                sheet: 1,
                insertRange: [
                  { range: "A1:P19", proc: "hr_rpt_1030050_company_info", params: [this.tco_company_pk, p_month]  },//header
                ],
                insertRows: [
                  {   
                    sequence: "break",
                    startRow: 9, proc: "hr_rpt_1030050_per_tax", params: [...p_param], stringColumns: [ "EMP_ID", "ID_NUM","OLD_ID", "E_ACCOUNT" ],
                    param_extra: [...p_param_extra],
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
        },

        // custom for company  
        async excel_company(that, p_month, p_param, p_param_extra = null, p_report, p_tco_company_pk, p_from, p_to ) {

          let comp = this.companyList.find(x => x["PK"] == p_tco_company_pk );
          let excel = null;
          if(comp["PARTNER_ID"] == "DY" || comp["PARTNER_ID"] == "DTB") // daeyoung
          {
            
            switch(p_report) {
              case '20' : {
                excel = [
                  {
                    sheet: 1,
                    insertRange: [ { range: "A1:BZ6", proc: "hr_rpt_1030050_company_info", params: [p_tco_company_pk, p_month]  },  ],
                    insertRows: [
                      {   
                        startRow: 9, proc: "hr_rpt_1030050_PAYROLL_SUM_DY", params: [...p_param], dateColumns: ["LEFT_DT" ] , stringColumns: [ "EMP_ID", "ID_NUM","OLD_ID", "ACCOUNT" ],
                        param_extra: [...p_param_extra],
                        total: [
                          {   column: null, isDisplay: true, type: "SUM", text: "TỔNG CỘNG", isMerge: true, isGrandTotal: true , font: {  size: 7, bold: true } , merge: { from: 1, to: 6 } 
                            , fill: {
                                type: 'pattern',
                                pattern:'solid',
                                fgColor:{ argb: 'badeff'},
                                bgColor:{ argb: 'badeff'}
                              }  }, //"Grand total: $[1] record(s) "
                        ]
                      }
                    ],
                  },
                  {
                    sheet: 2,
                    insertRange: [ { range: "A1:BZ6", proc: "hr_rpt_1030050_company_info", params: [p_tco_company_pk, p_month]  },  ],
                    insertRows: [
                      {   
                        startRow: 9, proc: "hr_rpt_1030050_PAYROLL_TOTAL_R_DY", params: [...p_param], dateColumns: ["LEFT_DT" ] , stringColumns: [ "EMP_ID", "ID_NUM","OLD_ID", "ACCOUNT" ],
                        param_extra: [...p_param_extra],
                        total: [
                          {   column: null, isDisplay: true, type: "SUM", text: "TỔNG CỘNG", isMerge: true, isGrandTotal: true , font: {  size: 7, bold: true } , merge: { from: 1, to: 6 } 
                            , fill: {
                                type: 'pattern',
                                pattern:'solid',
                                fgColor:{ argb: 'badeff'},
                                bgColor:{ argb: 'badeff'}
                              }  }, //"Grand total: $[1] record(s) "
                        ]
                      }
                    ],
                  },
                ];

                break;
              }
              case '21' : {
                excel = [
                  {
                    sheet: 1,
                    insertRange: [ { range: "A1:BQ6", proc: "hr_rpt_1030050_company_info", params: [p_tco_company_pk, p_month]  },  ],
                    insertRows: [
                      {   
                        startRow: 9, proc: "hr_rpt_1030050_PAYROLL_1_DY", params: [...p_param], dateColumns: ["LEFT_DT" ] , stringColumns: [ "EMP_ID", "ID_NUM","OLD_ID", "ACCOUNT"],
                        param_extra: [...p_param_extra],
                        total: [
                          {   column: null, isDisplay: true, type: "SUM", text: "TỔNG CỘNG", isMerge: true, isGrandTotal: true , font: {  size: 7, bold: true } , merge: { from: 1, to: 6 } 
                            , fill: {
                                type: 'pattern',
                                pattern:'solid',
                                fgColor:{ argb: 'badeff'},
                                bgColor:{ argb: 'badeff'}
                              }  }, //"Grand total: $[1] record(s) "
                        ]
                      }
                    ],
                  },
                ];

                break;
              }
              case '22' : {
                excel = [
                  {
                    sheet: 1,
                    insertRange: [ { range: "A1:AV6", proc: "hr_rpt_1030050_company_info", params: [p_tco_company_pk, p_month]  },  ],
                    insertRows: [
                      {   
                        startRow: 9, proc: "hr_rpt_1030050_PAYROLL_2_DY", params: [...p_param], dateColumns: ["LEFT_DT" ] , stringColumns: [ "EMP_ID", "ID_NUM","OLD_ID", "ACCOUNT" ],
                        param_extra: [...p_param_extra],
                        total: [
                          {   column: null, isDisplay: true, type: "SUM", text: "TỔNG CỘNG", isMerge: true, isGrandTotal: true , font: {  size: 7, bold: true } , merge: { from: 1, to: 6 } 
                            , fill: {
                                type: 'pattern',
                                pattern:'solid',
                                fgColor:{ argb: 'badeff'},
                                bgColor:{ argb: 'badeff'}
                              }  }, //"Grand total: $[1] record(s) "
                        ]
                      }
                    ],
                  },
                  {
                    sheet: 2,
                    insertRange: [ { range: "A1:AV6", proc: "hr_rpt_1030050_company_info", params: [p_tco_company_pk, p_month]  },  ],
                    insertRows: [
                      {   
                        startRow: 9, proc: "hr_rpt_1030050_PAYROLL_2_R_DY", params: [...p_param], dateColumns: ["LEFT_DT" ] , stringColumns: [ "EMP_ID", "ID_NUM","OLD_ID", "ACCOUNT" ],
                        param_extra: [...p_param_extra],
                        total: [
                          {   column: null, isDisplay: true, type: "SUM", text: "TỔNG CỘNG", isMerge: true, isGrandTotal: true , font: {  size: 7, bold: true } , merge: { from: 1, to: 6 } 
                            , fill: {
                                type: 'pattern',
                                pattern:'solid',
                                fgColor:{ argb: 'badeff'},
                                bgColor:{ argb: 'badeff'}
                              }  }, //"Grand total: $[1] record(s) "
                        ]
                      }
                    ],
                  },
                ];
                break;
              }

              case '23' : { // payslip
                excel = [
                  {
                    sheet: 1,
                    insertRange2: [ 
                      { range: "A1:I53", pageBreak: true, dataPerPage: 1 , proc: "hr_rpt_1030050_PAYSLIP_DY", params: [...p_param],param_extra: [...p_param_extra], dateColumns: [ ] , stringColumns: [ "EMP_ID", "ID_NUM","OLD_ID", "ACCOUNT" ], },  
                    ],
                  },
                ];
                break;
              }
              case '24': { // bank
                excel = [
                  //sheet1
                  {
                    sheet: 1,
                    insertRange: [
                      { range: "A1:I21", proc: "hr_rpt_1030050_company_info", params: [this.tco_company_pk, p_month]  },//header
                    ],
                    insertRows: [
                      {   
                        sequence: "break",
                        startRow: 11, proc: "hr_rpt_1030050_payment_bank", params: [...p_param] ,
                        param_extra: [...p_param_extra],
                        total: [
                          {   column: null, isDisplay: true, type: "SUM", text: this.$t("TOTAL"), isMerge: true, isGrandTotal: true , font: {  size: 15, bold: true } , merge: { from: 1, to: 4 }  }, //"Grand total: $[1] record(s) "
                        ]
                      }
                    ],
                  },
                  //sheet2
                  {
                    sheet: 2,
                    insertRange: [
                      { range: "A1:I21", proc: "hr_rpt_1030050_company_info", params: [this.tco_company_pk, p_month]  },//header
                    ],
                    insertRows: [
                      {   
                        sequence: "break",
                        startRow: 11, proc: "hr_rpt_1030050_payment_bank_dy", params: [...p_param] ,
                        param_extra: [...p_param_extra],
                        total: [
                          {   column: null, isDisplay: true, type: "SUM", text: this.$t("TOTAL"), isMerge: true, isGrandTotal: true , font: {  size: 15, bold: true } , merge: { from: 1, to: 4 }  }, //"Grand total: $[1] record(s) "
                        ]
                      }
                    ],
                  },
                  //sheet3
                  {
                    sheet: 3,
                    insertRange: [
                      { range: "A1:I21", proc: "hr_rpt_1030050_company_info", params: [this.tco_company_pk, p_month]  },//header
                    ],
                    insertRows: [
                      {   
                        sequence: "break",
                        startRow: 11, proc: "hr_rpt_1030050_payment_bank_dy_2", params: [...p_param] ,
                        param_extra: [...p_param_extra],
                        total: [
                          {   column: null, isDisplay: true, type: "SUM", text: this.$t("TOTAL"), isMerge: true, isGrandTotal: true , font: {  size: 15, bold: true } , merge: { from: 1, to: 4 }  }, //"Grand total: $[1] record(s) "
                        ]
                      }
                    ],
                  },

                  //sheet4
                  {
                    sheet: 4,
                    insertRange: [
                      { range: "A1:I21", proc: "hr_rpt_1030050_company_info", params: [this.tco_company_pk, p_month]  },//header
                    ],
                    insertRows: [
                      {   
                        sequence: "break",
                        startRow: 11, proc: "hr_rpt_1030050_payment_bank_r_dy", params: [...p_param] ,
                        param_extra: [...p_param_extra],
                        total: [
                          {   column: null, isDisplay: true, type: "SUM", text: this.$t("TOTAL"), isMerge: true, isGrandTotal: true , font: {  size: 15, bold: true } , merge: { from: 1, to: 4 }  }, //"Grand total: $[1] record(s) "
                        ]
                      }
                    ],
                  },

                  //sheet5
                  {
                    sheet: 5,
                    insertRange: [
                      { range: "A1:I21", proc: "hr_rpt_1030050_company_info", params: [this.tco_company_pk, p_month]  },//header
                    ],
                    insertRows: [
                      {   
                        sequence: "break",
                        startRow: 11, proc: "hr_rpt_1030050_payment_bank_1_r_dy", params: [...p_param] ,
                        param_extra: [...p_param_extra],
                        total: [
                          {   column: null, isDisplay: true, type: "SUM", text: this.$t("TOTAL"), isMerge: true, isGrandTotal: true , font: {  size: 15, bold: true } , merge: { from: 1, to: 4 }  }, //"Grand total: $[1] record(s) "
                        ]
                      }
                    ],
                  },

                  //sheet6
                  {
                    sheet: 6,
                    insertRange: [
                      { range: "A1:I21", proc: "hr_rpt_1030050_company_info", params: [this.tco_company_pk, p_month]  },//header
                    ],
                    insertRows: [
                      {   
                        sequence: "break",
                        startRow: 11, proc: "hr_rpt_1030050_payment_bank_2_r_dy", params: [...p_param] ,
                        param_extra: [...p_param_extra],
                        total: [
                          {   column: null, isDisplay: true, type: "SUM", text: this.$t("TOTAL"), isMerge: true, isGrandTotal: true , font: {  size: 15, bold: true } , merge: { from: 1, to: 4 }  }, //"Grand total: $[1] record(s) "
                        ]
                      }
                    ],
                  },

                ];
                break;
              }

              case '25' : { // payslip ot
                excel = [
                  {
                    sheet: 1,
                    insertRange2: [ 
                      { range: "A1:I36", pageBreak: true , proc: "hr_rpt_1030050_PAYSLIP_DY_2", params: [...p_param],param_extra: [...p_param_extra], dateColumns: [ ] , stringColumns: [ "EMP_ID", "ID_NUM","OLD_ID", "ACCOUNT" ], },  
                    ],
                  },
                ];
                break;
              }
                //PAYROLL SUMMARY REPORT_DY
              case '26' : {
                excel = [
                  {
                    sheet: 1,
                    insertRange: [ { range: "A1:BZ6", proc: "hr_rpt_1030050_company_info", params: [p_tco_company_pk, p_month]  },  ],
                    insertRows: [
                      {   
                        startRow: 9, proc: "hr_rpt_1030050_PAYROLL_SUMMARY_REPORT", params: [...p_param], dateColumns: [ ] , stringColumns: [ "EMP_ID", "ID_NUM","OLD_ID", "ACCOUNT" ],
                        param_extra: [...p_param_extra],
                        total: [
                          {   column: null, isDisplay: true, type: "SUM", text: "TỔNG CỘNG", isMerge: true, isGrandTotal: true , font: {  size: 7, bold: true } , merge: { from: 1, to: 2 } 
                            , fill: {
                                type: 'pattern',
                                pattern:'solid',
                                fgColor:{ argb: 'badeff'},
                                bgColor:{ argb: 'badeff'}
                              }  }, //"Grand total: $[1] record(s) "
                        ]
                      }
                    ],
                  },
                  {
                    sheet: 2,
                    insertRange: [ { range: "A1:BZ6", proc: "hr_rpt_1030050_company_info", params: [p_tco_company_pk, p_month]  },  ],
                    insertRows: [
                      {   
                        startRow: 9, proc: "hr_rpt_1030050_PAYROLL_SUMMARY_REPORT_R", params: [...p_param], dateColumns: [ ] , stringColumns: [ "EMP_ID", "ID_NUM","OLD_ID", "ACCOUNT" ],
                        param_extra: [...p_param_extra],
                        total: [
                          {   column: null, isDisplay: true, type: "SUM", text: "TỔNG CỘNG", isMerge: true, isGrandTotal: true , font: {  size: 7, bold: true } , merge: { from: 1, to: 2 } 
                            , fill: {
                                type: 'pattern',
                                pattern:'solid',
                                fgColor:{ argb: 'badeff'},
                                bgColor:{ argb: 'badeff'}
                              }  }, //"Grand total: $[1] record(s) "
                        ]
                      }
                    ],
                  },
                ];

                break;
              }
              //PAYROLL SUMMARY SQE
              case '27' : {
                excel = [
                  {
                    sheet: 1,
                    insertRange: [ { range: "A1:BZ6", proc: "hr_rpt_1030050_company_info", params: [p_tco_company_pk, p_month]  },  ],
                    insertRows: [
                      {   
                        sequence: "break",
                        startRow: 9, proc: "HR_RPT_1030050_PAYROLL_SUMMARY_SQE", params: [...p_param], dateColumns: [ ] , stringColumns: [ "EMP_ID", "ID_NUM","OLD_ID", "ACCOUNT" ],
                        param_extra: [...p_param_extra],
                        total: [
                          {   column: "SEQ", isDisplay: true, type: "SUM", text: "Sub-total Group $[0]: $[1] record(s) " ,  merge: { from: 1, to: 2 },font: {  size: 10, bold: true, }}, 
                          {   column: null, isDisplay: true, type: "SUM", text: "TỔNG CỘNG", isMerge: true, isGrandTotal: true , font: {  size: 7, bold: true } , merge: { from: 1, to: 2 } 
                            , fill: {
                                type: 'pattern',
                                pattern:'solid',
                                fgColor:{ argb: 'badeff'},
                                bgColor:{ argb: 'badeff'}
                              }  }, //"Grand total: $[1] record(s) "
                        ]
                      }
                    ],
                  },
                ];

                break;
              }
              //PAYROLL TOTAL SEQ
              case '28' : {
                excel = [
                  {
                    sheet: 1,
                    insertRange: [ { range: "A1:BZ6", proc: "hr_rpt_1030050_company_info", params: [p_tco_company_pk, p_month]  },  ],
                    insertRows: [
                      {   
                        sequence: "break",
                        startRow: 9, proc: "hr_rpt_1030050_PAYROLL_TOTAL_SEQ_DY", params: [...p_param], dateColumns: ["LEFT_DT" ] , stringColumns: [ "EMP_ID", "ID_NUM","OLD_ID", "ACCOUNT" ],
                        param_extra: [...p_param_extra],
                        total: [
                          {   column: "SEQ", isDisplay: true, type: "SUM", text: "Sub-total Group $[0]: $[1] record(s) " ,  merge: { from: 1, to: 6 },font: {  size: 10, bold: true, }}, 
                          {   column: null, isDisplay: true, type: "SUM", text: "TỔNG CỘNG", isMerge: true, isGrandTotal: true , font: {  size: 7, bold: true } , merge: { from: 1, to: 6 } 
                            , fill: {
                                type: 'pattern',
                                pattern:'solid',
                                fgColor:{ argb: 'badeff'},
                                bgColor:{ argb: 'badeff'}
                              }  }, //"Grand total: $[1] record(s) "
                        ]
                      }
                    ],
                  },
                  {
                    sheet: 2,
                    insertRange: [ { range: "A1:BZ6", proc: "hr_rpt_1030050_company_info", params: [p_tco_company_pk, p_month]  },  ],
                    insertRows: [
                      {   
                        sequence: "break",
                        startRow: 9, proc: "HR_RPT_1030050_PAYROLL_TOTAL_SEQ_R_DY", params: [...p_param], dateColumns: ["LEFT_DT" ] , stringColumns: [ "EMP_ID", "ID_NUM","OLD_ID", "ACCOUNT" ],
                        param_extra: [...p_param_extra],
                        total: [
                          {   column: "SEQ", isDisplay: true, type: "SUM", text: "Sub-total Group $[0]: $[1] record(s) " ,  merge: { from: 1, to: 6 },font: {  size: 10, bold: true, }}, 
                          {   column: null, isDisplay: true, type: "SUM", text: "TỔNG CỘNG", isMerge: true, isGrandTotal: true , font: {  size: 7, bold: true } , merge: { from: 1, to: 6 } 
                            , fill: {
                                type: 'pattern',
                                pattern:'solid',
                                fgColor:{ argb: 'badeff'},
                                bgColor:{ argb: 'badeff'}
                              }  }, //"Grand total: $[1] record(s) "
                        ]
                      }
                    ],
                  },
                ];

                break;
              }
              // PAYROLL 1 SEQ
              case '29' : {
                excel = [
                  {
                    sheet: 1,
                    insertRange: [ { range: "A1:BQ6", proc: "hr_rpt_1030050_company_info", params: [p_tco_company_pk, p_month]  },  ],
                    insertRows: [
                      {   
                        sequence: "break",
                        startRow: 9, proc: "hr_rpt_1030050_PAYROLL_1_SEQ_DY", params: [...p_param], dateColumns: ["LEFT_DT" ] , stringColumns: [ "EMP_ID", "ID_NUM","OLD_ID", "ACCOUNT"],
                        param_extra: [...p_param_extra],
                        total: [
                          {   column: "SEQ", isDisplay: true, type: "SUM", text: "Sub-total Group $[0]: $[1] record(s) " ,  merge: { from: 1, to: 6 },font: {  size: 10, bold: true, }}, 
                          {   column: null, isDisplay: true, type: "SUM", text: "TỔNG CỘNG", isMerge: true, isGrandTotal: true , font: {  size: 7, bold: true } , merge: { from: 1, to: 6 } 
                            , fill: {
                                type: 'pattern',
                                pattern:'solid',
                                fgColor:{ argb: 'badeff'},
                                bgColor:{ argb: 'badeff'}
                              }  }, //"Grand total: $[1] record(s) "
                        ]
                      }
                    ],
                  },
                ];

                break;
              }
              // PAYROLL 2 SEQ
              case '30' : {
                excel = [
                  {
                    sheet: 1,
                    insertRange: [ { range: "A1:AV6", proc: "hr_rpt_1030050_company_info", params: [p_tco_company_pk, p_month]  },  ],
                    insertRows: [
                      {   
                        sequence: "break",
                        startRow: 9, proc: "hr_rpt_1030050_PAYROLL_2_SEQ_DY", params: [...p_param], dateColumns: ["LEFT_DT" ] , stringColumns: [ "EMP_ID", "ID_NUM","OLD_ID", "ACCOUNT" ],
                        param_extra: [...p_param_extra],
                        total: [
                          {   column: "SEQ", isDisplay: true, type: "SUM", text: "Sub-total Group $[0]: $[1] record(s) " ,  merge: { from: 1, to: 6 },font: {  size: 10, bold: true, }}, 
                          {   column: null, isDisplay: true, type: "SUM", text: "TỔNG CỘNG", isMerge: true, isGrandTotal: true , font: {  size: 7, bold: true } , merge: { from: 1, to: 6 } 
                            , fill: {
                                type: 'pattern',
                                pattern:'solid',
                                fgColor:{ argb: 'badeff'},
                                bgColor:{ argb: 'badeff'}
                              }  }, //"Grand total: $[1] record(s) "
                        ]
                      }
                    ],
                  },
                  {

                    sheet: 2,
                    insertRange: [ { range: "A1:AV6", proc: "hr_rpt_1030050_company_info", params: [p_tco_company_pk, p_month]  },  ],
                    insertRows: [
                      {   
                        sequence: "break",
                        startRow: 9, proc: "hr_rpt_1030050_PAYROLL_2_R_SEQ_DY", params: [...p_param], dateColumns: ["LEFT_DT" ] , stringColumns: [ "EMP_ID", "ID_NUM","OLD_ID", "ACCOUNT" ],
                        param_extra: [...p_param_extra],
                        total: [
                          {   column: "SEQ", isDisplay: true, type: "SUM", text: "Sub-total Group $[0]: $[1] record(s) " ,  merge: { from: 1, to: 6 },font: {  size: 10, bold: true, }}, 
                          {   column: null, isDisplay: true, type: "SUM", text: "TỔNG CỘNG", isMerge: true, isGrandTotal: true , font: {  size: 7, bold: true } , merge: { from: 1, to: 6 } 
                            , fill: {
                                type: 'pattern',
                                pattern:'solid',
                                fgColor:{ argb: 'badeff'},
                                bgColor:{ argb: 'badeff'}
                              }  }, //"Grand total: $[1] record(s) "
                        ]
                      }
                    ],
                  },
                ];
                break;
              }
            }
            

          }



          if(comp["PARTNER_ID"] == "SP") // sprint
          {
            
            switch(p_report) {
              case '20' : {
                excel = [
                  {
                    sheet: 1,
                    insertRange: [ { range: "A1:BZ6", proc: "hr_rpt_1030050_company_info", params: [p_tco_company_pk, p_month]  },  ],
                    insertRows: [
                      {   
                        startRow: 9, proc: "hr_rpt_1030050_PAYROLL_SUM_SP", params: [...p_param], dateColumns: ["LEFT_DT" ] , stringColumns: [ "EMP_ID", "ID_NUM","OLD_ID", "ACCOUNT" ],
                        param_extra: [...p_param_extra],
                        total: [
                          {   column: null, isDisplay: true, type: "SUM", text: "TỔNG CỘNG", isMerge: true, isGrandTotal: true , font: {  size: 7, bold: true } , merge: { from: 1, to: 6 } 
                            , fill: {
                                type: 'pattern',
                                pattern:'solid',
                                fgColor:{ argb: 'badeff'},
                                bgColor:{ argb: 'badeff'}
                              }  }, //"Grand total: $[1] record(s) "
                        ]
                      }
                    ],
                  },
                  {
                    sheet: 2,
                    insertRange: [ { range: "A1:BZ6", proc: "hr_rpt_1030050_company_info", params: [p_tco_company_pk, p_month]  },  ],
                    insertRows: [
                      {   
                        startRow: 9, proc: "hr_rpt_1030050_PAYROLL_TOTAL_R_SP", params: [...p_param], dateColumns: ["LEFT_DT" ] , stringColumns: [ "EMP_ID", "ID_NUM","OLD_ID", "ACCOUNT" ],
                        param_extra: [...p_param_extra],
                        total: [
                          {   column: null, isDisplay: true, type: "SUM", text: "TỔNG CỘNG", isMerge: true, isGrandTotal: true , font: {  size: 7, bold: true } , merge: { from: 1, to: 6 } 
                            , fill: {
                                type: 'pattern',
                                pattern:'solid',
                                fgColor:{ argb: 'badeff'},
                                bgColor:{ argb: 'badeff'}
                              }  }, //"Grand total: $[1] record(s) "
                        ]
                      }
                    ],
                  },
                ];

                break;
              }
              case '21' : {
                excel = [
                  {
                    sheet: 1,
                    insertRange: [ { range: "A1:BQ6", proc: "hr_rpt_1030050_company_info", params: [p_tco_company_pk, p_month]  },  ],
                    insertRows: [
                      {   
                        startRow: 9, proc: "hr_rpt_1030050_PAYROLL_1_SP", params: [...p_param], dateColumns: ["LEFT_DT" ] , stringColumns: [ "EMP_ID", "ID_NUM","OLD_ID", "ACCOUNT" ],
                        param_extra: [...p_param_extra],
                        total: [
                          {   column: null, isDisplay: true, type: "SUM", text: "TỔNG CỘNG", isMerge: true, isGrandTotal: true , font: {  size: 7, bold: true } , merge: { from: 1, to: 6 } 
                            , fill: {
                                type: 'pattern',
                                pattern:'solid',
                                fgColor:{ argb: 'badeff'},
                                bgColor:{ argb: 'badeff'}
                              }  }, //"Grand total: $[1] record(s) "
                        ]
                      }
                    ],
                  },
                ];

                break;
              }
              case '22' : {
                excel = [
                  {
                    sheet: 1,
                    insertRange: [ { range: "A1:AV6", proc: "hr_rpt_1030050_company_info", params: [p_tco_company_pk, p_month]  },  ],
                    insertRows: [
                      {   
                        startRow: 9, proc: "hr_rpt_1030050_PAYROLL_2_SP", params: [...p_param], dateColumns: [ "LEFT_DT"] , stringColumns: [ "EMP_ID", "ID_NUM","OLD_ID", "ACCOUNT" ],
                        param_extra: [...p_param_extra],
                        total: [
                          {   column: null, isDisplay: true, type: "SUM", text: "TỔNG CỘNG", isMerge: true, isGrandTotal: true , font: {  size: 7, bold: true } , merge: { from: 1, to: 6 } 
                            , fill: {
                                type: 'pattern',
                                pattern:'solid',
                                fgColor:{ argb: 'badeff'},
                                bgColor:{ argb: 'badeff'}
                              }  }, //"Grand total: $[1] record(s) "
                        ]
                      }
                    ],
                  },
                  {
                    sheet: 2,
                    insertRange: [ { range: "A1:AV6", proc: "hr_rpt_1030050_company_info", params: [p_tco_company_pk, p_month]  },  ],
                    insertRows: [
                      {   
                        startRow: 9, proc: "hr_rpt_1030050_PAYROLL_2_R_SP", params: [...p_param], dateColumns: [ "LEFT_DT"] , stringColumns: [ "EMP_ID", "ID_NUM","OLD_ID", "ACCOUNT" ],
                        param_extra: [...p_param_extra],
                        total: [
                          {   column: null, isDisplay: true, type: "SUM", text: "TỔNG CỘNG", isMerge: true, isGrandTotal: true , font: {  size: 7, bold: true } , merge: { from: 1, to: 6 } 
                            , fill: {
                                type: 'pattern',
                                pattern:'solid',
                                fgColor:{ argb: 'badeff'},
                                bgColor:{ argb: 'badeff'}
                              }  }, //"Grand total: $[1] record(s) "
                        ]
                      }
                    ],
                  },
                ];
                break;
              }

              case '23' : { // payslip
                excel = [
                  {
                    sheet: 1,
                    insertRange2: [ 
                      { range: "A1:I55", pageBreak: true , proc: "hr_rpt_1030050_PAYSLIP_SP", params: [...p_param],param_extra: [...p_param_extra], dateColumns: [ ] , stringColumns: [ "EMP_ID", "ID_NUM","OLD_ID", "ACCOUNT" ], },  
                    ],
                  },
                ];
                break;
              }
              case '25' : { // payslip
                excel = [
                  {
                    sheet: 1,
                    insertRange2: [ 
                      { range: "A1:I36", pageBreak: true , proc: "hr_rpt_1030050_PAYSLIP_SP_2", params: [...p_param],param_extra: [...p_param_extra], dateColumns: [ ] , stringColumns: [ "EMP_ID", "ID_NUM","OLD_ID", "ACCOUNT" ], },  
                    ],
                  },
                ];
                break;
              }
              case '24': { // bank
                excel = [
                  //sheet1
                  {
                    sheet: 1,
                    insertRange: [
                      { range: "A1:I21", proc: "hr_rpt_1030050_company_info", params: [this.tco_company_pk, p_month]  },//header
                    ],
                    insertRows: [
                      {   
                        startRow: 11, proc: "hr_rpt_1030050_payment_bank_1", params: [...p_param] ,
                        param_extra: [...p_param_extra],
                        total: [
                          {   column: null, isDisplay: true, type: "SUM", text: this.$t("TOTAL"), isMerge: true, isGrandTotal: true , font: {  size: 15, bold: true } , merge: { from: 1, to: 4 }  }, //"Grand total: $[1] record(s) "
                        ]
                      }
                    ],
                  },
                    //sheet2
                  {
                    sheet: 2,
                    insertRange: [
                      { range: "A1:I21", proc: "hr_rpt_1030050_company_info", params: [this.tco_company_pk, p_month]  },//header
                    ],
                    insertRows: [
                      {   
                        startRow: 11, proc: "hr_rpt_1030050_payment_bank_2", params: [...p_param] ,
                        param_extra: [...p_param_extra],
                        total: [
                          {   column: null, isDisplay: true, type: "SUM", text: this.$t("TOTAL"), isMerge: true, isGrandTotal: true , font: {  size: 15, bold: true } , merge: { from: 1, to: 4 }  }, //"Grand total: $[1] record(s) "
                        ]
                      }
                    ],
                  },
                  //sheet3
                  {
                    sheet: 3,
                    insertRows: [
                      {   
                        startRow: 2, proc: "hr_rpt_1030050_payment_bank_sp", params: [...p_param] ,param_extra: [...p_param_extra],
                      }
                    ],
                  },
                  //sheet4
                  {
                    sheet: 4,
                    insertRows: [
                      {   
                        startRow: 2, proc: "hr_rpt_1030050_payment_bank_sp_2", params: [...p_param] ,param_extra: [...p_param_extra],
                      }
                    ],
                  },
                ];
                break;
              }
              case '26' : {
                excel = [
                  {
                    sheet: 1,
                    insertRange: [ { range: "A1:BZ6", proc: "hr_rpt_1030050_company_info", params: [p_tco_company_pk, p_month]  },  ],
                    insertRows: [
                      {   
                        startRow: 9, proc: "hr_rpt_1030050_PAYROLL_SUMMARY_REPORT_SP", params: [...p_param], dateColumns: [ ] , stringColumns: [ "EMP_ID", "ID_NUM","OLD_ID", "ACCOUNT" ],
                        param_extra: [...p_param_extra],
                        total: [
                          {   column: null, isDisplay: true, type: "SUM", text: "TỔNG CỘNG", isMerge: true, isGrandTotal: true , font: {  size: 7, bold: true } , merge: { from: 1, to: 2 } 
                            , fill: {
                                type: 'pattern',
                                pattern:'solid',
                                fgColor:{ argb: 'badeff'},
                                bgColor:{ argb: 'badeff'}
                              }  }, //"Grand total: $[1] record(s) "
                        ]
                      }
                    ],
                  },
                ];

                break;
              }
            }
          }


           if(comp["PARTNER_ID"] == "KPX") // KPX
          {
            
            switch(p_report) {
              
              //// KPX - PAYROLL
              case '20' : {
                let p_na_vn = '01';
                let p_nation_vn = [p_na_vn,...p_param,p_from,p_to];
                let p_na_korean = '09';
                let p_nation_korean = [p_na_korean,...p_param,p_from,p_to];
                let reportInfo = that.report1.find(q => q["CODE"] ==p_report );
                
                let exceljs =  require("@/plugins/exceljs.js");
                  if(!!exceljs) {
                      exceljs = exceljs.default;
                  }
                await exceljs.createWorkbook(that, reportInfo.REPORT_PATH);
                

                const dso = {
                    type: 'list',
                    selpro: 'hr_rpt_1030050_payroll_kpx',
                    para: [...p_nation_vn]
                };

                let _datas = await this._dsoCall(dso, 'select', false);

                let dsoComp = {type: 'grid', selpro: 'HR_RPT_1030050_COMPANY_INFO', para: [ that.user.TCO_COMPANY_PK, that.selectedMonth] };
                let dataComp = await that._dsoCall(dsoComp, 'select', false);

                let reportHeader = [];
                let startRow = 11;
                let startAllow1 = 17 - 1;
                let hiddenCols = [];

                for(let i = 1; i <= 12; i++) {
                  let allowIdx = this.allowanceList.findIndex( x =>  Number(x.CODE.replace("A","")) == i);
                  if(allowIdx >= 0) {
                    let allow = this.allowanceList[allowIdx];

                    if( allow.USE_YN === "Y" ) {
                      reportHeader["A"+ Number(allow.CODE.replace("A","")) ] = allow.NAME;
                      
                      
                    } else {
                      hiddenCols.push( startAllow1 + i); 
                     
                    }
                  } else {
                    hiddenCols.push( startAllow1 + i);  
                  }
                }

                //////////////////// Sheet : Vietnamese //// Vietnamese salary
                //////////////////// Sheet : Vietnamese //// Vietnamese salary

                let _worksheet = exceljs.worksheet();
                exceljs.setWorksheet("VIETNAMESE");  
                

                // header : hide columns allowance
                for (let j = 0; j < hiddenCols.length; j++) {
                    _worksheet.getColumn(hiddenCols[j]).hidden = true;
                }

                let header = { ...reportHeader, ...dataComp[0]};
                exceljs.insertRange(that, "A1:BC18",header );   

               
                let groupMaster = Array.from( new Set(   Array.from( _datas, x => x["DIV_NM"] ) ) );
                let groupDetail = Array.from( new Set(   Array.from( _datas, x => x["DEPT_NM"] ) ) );
                
                if(_datas.length > 0){
                      for(let i = 1; i <= _datas.length +groupMaster.length*2 +1 ; i++) {  
                        
                          if(i > 0){
                              exceljs.copyRow(startRow + i, startRow, 'c');
                          }
                     }
                }

                 _worksheet.spliceRows(startRow, 1);

                  let sumTotal={};
                  let rowIdx = startRow;

                 // Set DATA
                 for (let i = 0; i < groupMaster.length; i++) {

                    //     /////////////////master
                    let row_Division = _worksheet.mergeCells(rowIdx,1,rowIdx,2);
                    row_Division = _worksheet.getRow(rowIdx);
                    row_Division.getCell(1).alignment = { horizontal: 'left' };
                    row_Division.getCell(1).font  = { name:'Times New Roman',size: 15, bold: true};
                    // row_Division.getCell(1).fill = {
                    //                         type: 'pattern',
                    //                         pattern:'solid',
                    //                         fgColor:{ argb:'DDDDDD'}
                    //                         };
               
                    row_Division.getCell(1).value  = groupMaster[i];
                    for (let i=3; i<55; i++){
                          row_Division.getCell(i).value  = "";
                    }

                    rowIdx++;   
                     
                    //     /////////////////detail
                    let data_Division = _datas.filter( q => q["DIV_NM"] == groupMaster[i]);  
                    let data_Dept = Array.from( new Set(   Array.from( data_Division, x => x["DEPT_NM"] ) ) );
                    let sum ={};
                    let count_nv=0;

                    for (let o = 0; o < data_Dept.length; o++) {
                         let dept_data = data_Division.filter( q => q["DEPT_NM"] == data_Dept[o]);
                         for (let index = 0; index < dept_data.length; index++) {
                              let _DetailData = dept_data[index];
                               count_nv=count_nv+1;
                              // Set cell
                              for(let _j = 1; _j <= 55; _j++ ) {
                                let _cell = exceljs.getCellByIndex(this, rowIdx, _j);

                                let row = _worksheet.getRow(rowIdx);
                                row.getCell(1).value = count_nv;

                                if(_cell.value != "" && _cell.value !=null && isNaN(_cell.value)) {
                                  try {

                                     if(!sum.hasOwnProperty(_cell.value)) {
                                        sum[_cell.value] = 0;
                                    }
                                    if(!sumTotal.hasOwnProperty(_cell.value)) {
                                        sumTotal[_cell.value] = 0;
                                    }
                                    sum[_cell.value]+=_DetailData[`${_cell.value}`];
                                    sumTotal[_cell.value]+=_DetailData[`${_cell.value}`];

                                    _cell.value = _DetailData[`${_cell.value}`];

                                  } catch(e) {
                                    console.log(e.message);
                                  }
                                }
                            }
                             rowIdx++;   
                         }  
                     }

                      let row_Division_Sum = _worksheet.getRow(rowIdx);
                      _worksheet.mergeCells(rowIdx,1,rowIdx,7);
                        row_Division_Sum.getCell(1).alignment = { horizontal: 'center' };
                        row_Division_Sum.font = {  bold: true,  name:'Times New Roman',size: 15};
                         row_Division_Sum.getCell(1).value = " TỔNG CỘNG ";
                        for(let _j = 8; _j <= 55; _j++ ) {
                            let _cell = exceljs.getCellByIndex(this, rowIdx, _j);
                            
                            try {
                                _cell.value = sum[`${_cell.value}`];
                               
                            } catch(e) {
                                console.log(e.message);
                            }
                        }

                        rowIdx++;
                    }
                    
                    let row_Total = _worksheet.getRow(rowIdx);
                    _worksheet.mergeCells(rowIdx,1,rowIdx,7);  
                    row_Total.getCell(1).font  = { size: 16, bold: true};
                    row_Total.getCell(1).value = " TỔNG CỘNG " +  _datas.length + " NHÂN VIÊN ";   
                    row_Total.font = { name:'Times New Roman',size: 15, bold: true}; 

                    for(let _j = 8; _j <= 55; _j++ ) {
                                let _cell = exceljs.getCellByIndex(this, rowIdx, _j);
                                try {
                                    _cell.value = sumTotal[`${_cell.value}`];
                                } catch(e) {
                                    console.log(e.message);
                                }
                            }

                //////////////////// Sheet : Korean //// Korean salary
                //////////////////// Sheet : Korean //// Korean salary

                exceljs.setWorksheet("KOREAN");
                let _worksheet_korean = exceljs.worksheet();

                let dso_korean =  {type: 'grid', selpro: 'hr_rpt_1030050_payroll_kpx', para: p_nation_korean };
                let datas_korean = await that._dsoCall(dso_korean, 'select', false);
                let startRow2=12;
                let totalRow = startRow2 + datas_korean.length;
                let totalData = {TOTAL_TEXT: "TOTAL"};
                
                
                let keys = Object.keys(datas_korean[0]);
                keys.forEach(key => {
                    let vals = datas_korean.map( q =>  (  isNaN(q[key]) ||  q[key]== null  ) ? 0 :  q[key]  );
                    let sumVal = that._Total(vals);
                    totalData[key] = sumVal;
                })

              
                
                exceljs.insertRange(that, "A1:W18",header );    
                exceljs.insertRows(that,startRow2, datas_korean);
                exceljs.insertRowData(that, totalRow, totalData);
                 _worksheet_korean.mergeCells(`A${totalRow}:E${totalRow}`);


                ///////////////////////////////////////////////
                exceljs.dowloadWorkbook(that, reportInfo.NAME + ".xlsx");

                break;
              }

              ///////////////////////////////////////// KPX - PAYSLIP
              case '23' : {
                let p_na_all = 'ALL';
                let p_nation_all = [p_na_all,...p_param,p_from,p_to];

                excel = [
                  {
                    sheet: 'PAYSLIP',
                    insertRange2: [ { range: "A1:J32", pageBreak: true, dataPerPage: 2, proc: "hr_rpt_1030050_payslip_kpx", params: [...p_nation_all], param_extra: [...p_param_extra],dateColumns: [] , stringColumns: [],imageColumns: ["LOGO"] }, ],
                  },
                ];
                break;
              }
            
            }
            

          }


          if (comp["PARTNER_ID"] == "GHS") {
             switch(p_report) {
              case '07' : {
                 excel = [
                  //sheet1
                    {
                      sheet: 1,
                      insertRange: [
                        { range: "A1:I6", proc: "hr_rpt_1030050_company_info", params: [this.selectedCompany, p_month]  },//header
                      ],
                      insertRows: [
                        {   
                          sequence: "break",
                          startRow: 8, proc: "hr_rpt_1030050_payment_bank", params: [...p_param] ,
                          total: [
                            {   column: null, isDisplay: true, type: "SUM", text: this.$t("TOTAL"), isMerge: true, isGrandTotal: true , font: {  size: 12, bold: true } , merge: { from: 1, to: 6 }  }, //"Grand total: $[1] record(s) "
                          ]
                        }
                      ],
                    },
                  ];
                   break;
                }
                case '08' : {
                  let hiddenCols = [];
                  let startAllow1 = 6-1;
                  let startAllowK = 21-1;
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
                   excel = [
                  //sheet1
                    {
                      sheet: 1,
                      insertRange: [
                        { range: "A5:AP6", data: reportHeader },//header
                        { range: "A1:AP3", proc: "hr_rpt_1030050_company_info", params: [this.tco_company_pk, p_month]  },//header
                      ],
                      insertRows: [
                        {   
                          sequence: "break",
                          startRow: 7, proc: "hr_rpt_1030050_payroll_summary", params: [...p_param] ,
                          param_extra: [...p_param_extra],
                          total: [
                            {   column: null, isDisplay: true, type: "SUM", text: this.$t("total"), isMerge: true, isGrandTotal: true , font: {  size: 15, bold: true } , merge: { from: 1, to: 2 }  }, //"Grand total: $[1] record(s) "
                          ]
                        }
                      ],
                      hideColumns: hiddenCols
                    },
                  ];

            
                  break;
                }
                case '20' : {
                  if(p_param[1] == "A") {//STATUS
                    that.reportInfo.REPORT_PATH = "report/10/30/ghs/1030050_PAYROLL_TOTAL_GHS.xlsx";
                    excel = [
                      {
                        sheet: 'ACTIVE',
                        insertRange: [ { range: "A1:BZ6", proc: "hr_rpt_1030050_company_info", params: [p_tco_company_pk, p_month]  },  ],
                        insertRows: [
                          {   
                            startRow: 10, proc: "HR_RPT_1030050_PAYROLL_GHS", params:p_param, dateColumns: ["LEFT_DT" ] , stringColumns: [ "EMP_ID", "ID_NUM","OLD_ID", "ACCOUNT" ],
                            total: [
                              {   column: null, isDisplay: true, type: "SUM", text: "TỔNG CỘNG", isMerge: true, isGrandTotal: true , font: {  size: 7, bold: true } , merge: { from: 1, to: 7 } 
                                , fill: { type: 'pattern', pattern:'solid', fgColor:{ argb: 'badeff'}, bgColor:{ argb: 'badeff'} }  }, 
                            ]
                          }
                        ],
                      },
                    ];
                  } else {
                    that.reportInfo.REPORT_PATH = "report/10/30/ghs/1030050_PAYROLL_TOTAL_GHS_R.xlsx";
                    excel = [
                      {
                        sheet: 'RESIGN',
                        insertRange: [ { range: "A1:BT17", proc: "hr_rpt_1030050_company_info", params: [p_tco_company_pk, p_month]  },  ],
                        insertRows: [
                          {   
                            startRow: 10, proc: "HR_RPT_1030050_PAYROLL_GHS_R", params:p_param, dateColumns: ["LEFT_DT" ] , stringColumns: [ "EMP_ID", "ID_NUM","OLD_ID", "ACCOUNT" ],
                            total: [
                              {   column: null, isDisplay: true, type: "SUM", text: "TỔNG CỘNG", isMerge: true, isGrandTotal: true , font: {  size: 7, bold: true } , merge: { from: 1, to: 7 } 
                                , fill: { type: 'pattern', pattern:'solid', fgColor:{ argb: 'badeff'}, bgColor:{ argb: 'badeff'} }  }, 
                            ]
                          }
                        ],
                      },
                    ];
                  }
                  

                  break;
                }
                case '23' : {
                  let p_na_all = 'ALL';
                  let p_nation_all = [...p_param,p_from,p_to, p_tco_company_pk];

                  excel = [
                    {
                      sheet: 1,
                      insertRange2: [ { range: "A1:P39", pageBreak: true, proc: "HR_RPT_1030050_PAYSLIP_GHS", params: [...p_nation_all], param_extra: [...p_param_extra],dateColumns: ["LEFT_DT1", "JOIN_DT1","LEFT_DT2", "JOIN_DT2"] , stringColumns: [],imageColumns: ["LOGO"] }, ],
                    },
                  ];
                  break;
                }
              }
              
             
          }
          if (comp["PARTNER_ID"] == "IL001") {
            switch(p_report) {
              
              case '21' : {
                excel = [
                  {
                    insertRange: [ { range: "A1:BT17", proc: "hr_rpt_1030050_company_info", params: [p_tco_company_pk, p_month]  },  ],
                    insertRows: [
                      {   
                        startRow: 6, proc: "HR_RPT_1030050_GROUP_SUMMARY", params:p_param, dateColumns: ["" ] , stringColumns: [ "EMP_ID"],
                        total: [
                          {   column: null, isDisplay: true, type: "SUM", text: "TOTAL GENERAL AFFAIR", isMerge: true, isGrandTotal: true , font: {  size: 7, bold: true } , merge: { from: 1, to: 3 } 
                            , fill: { type: 'pattern', pattern:'solid', fgColor:{ argb: 'badeff'}, bgColor:{ argb: 'badeff'} }  }, 
                        ]
                      }
                    ],
                  },
                ];
                break;
              }
              case '22' : {
                excel = [
                  {
                    insertRange: [ { range: "A1:E14", proc: "hr_rpt_1030050_company_info", params: [p_tco_company_pk, p_month]  },  ],
                    insertRows: [
                      {   
                        startRow: 8, proc: "HR_RPT_1030050_PAYMENT_BY_BANK", params:p_param, dateColumns: ["" ] , stringColumns: [ "EMP_ID"],
                        total: [
                          {   column: null, isDisplay: true, type: "SUM", text: "TOTAL", isMerge: true, isGrandTotal: true , font: {  size: 7, bold: true } , merge: { from: 1, to: 3 } 
                            , fill: { type: 'pattern', pattern:'solid', fgColor:{ argb: 'badeff'}, bgColor:{ argb: 'badeff'} }  }, 
                        ]
                      }
                    ],
                  },
                ];
                break;
              }
            }
          }
          

           if(excel == null) {
             that.showButton(false);
            return;
          }

          const res = await that.$axios.$get('/dso/makereport', { responseType: "blob", params:{ template:  that.reportInfo.REPORT_PATH ,excel: JSON.stringify(excel)  } }  );
          
          if(res && res.size > 0){
            that._ExcelSaveAs(res, that.reportInfo.NAME+".xlsx"); 
            that.salaryStatus = that.$t("complete");
          } else {
            that.showNotification( "danger", that.$t("fail_to_export_report"), "", 4000 );
            that.salaryStatus = that.$t("fail_to_export_report");
          }
          that.showButton(false);

          return null;
        },
        

    }
  }
</script>
