let reportList= [   
    { CODE: '20', NAME: '20 - Payroll Total', REPORT_PATH: 'report/10/31/sp/1030050_PAYROLL_TOTAL_SP.xlsx'}, 
    { CODE: '21', NAME: '21 - Payroll 1', REPORT_PATH: 'report/10/31/sp/1030050_PAYROLL_1_SP.xlsx'}, 
    { CODE: '22', NAME: '22 - Payroll 2', REPORT_PATH: 'report/10/31/sp/1030050_PAYROLL_2_SP.xlsx'}, 
    { CODE: '23', NAME: '23 - Payslip', REPORT_PATH: 'report/10/31/sp/1030050_PAYSLIP_SP.xlsx'}, 
    { CODE: '24', NAME: '24 - Payment By Bank', REPORT_PATH: 'report/10/31/sp/1030050_payment_bank_sp.xlsx'}, 
    { CODE: '25', NAME: '25 - Payslip OT', REPORT_PATH: 'report/10/31/sp/1030050_OT_PAYSLIP_SP.xlsx'}, 
    { CODE: '26', NAME: '26 - Payroll Summary', REPORT_PATH: 'report/10/31/sp/1030050_payroll_summary_report.xlsx'}, 
];

let _1031050_sp = {
    getReportList: async (that) =>{
        await prepareCommonData(that);
        return reportList;
    },

    print: async(that, selectedReport) => {
        let excel = null;
        let reportInfo = reportList.find(x => x.CODE === selectedReport);
        let p_param = [that.selectedOrg, that.selectedStatus, that.selectedType, that.selectedEmpPK, that.selectedMonth, that.selectedPeriod, that.selectedMoney];
        let p_param_extra = [];

        let report_path = reportInfo.REPORT_PATH;
        let report_name = reportInfo.NAME+".xlsx";

        switch(selectedReport) {
            case '20' : {
                excel = [
                  {
                    sheet: 1,
                    insertRange: [ { range: "A1:BZ6", proc: "hr_rpt_1030050_company_info", params: [that.selectedCompany, that.selectedMonth]  },  ],
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
                    insertRange: [ { range: "A1:BZ6", proc: "hr_rpt_1030050_company_info", params: [that.selectedCompany, that.selectedMonth]  },  ],
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
                    insertRange: [ { range: "A1:BQ6", proc: "hr_rpt_1030050_company_info", params: [that.selectedCompany, that.selectedMonth]  },  ],
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
                    insertRange: [ { range: "A1:AV6", proc: "hr_rpt_1030050_company_info", params: [that.selectedCompany, that.selectedMonth]  },  ],
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
                    insertRange: [ { range: "A1:AV6", proc: "hr_rpt_1030050_company_info", params: [that.selectedCompany, that.selectedMonth]  },  ],
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
                      { range: "A1:I56", pageBreak: true , proc: "hr_rpt_1030050_PAYSLIP_SP", params: [...p_param],param_extra: [...p_param_extra], dateColumns: [ ] , stringColumns: [ "EMP_ID", "ID_NUM","OLD_ID", "ACCOUNT" ], },  
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
                      { range: "A1:I21", proc: "hr_rpt_1030050_company_info", params: [that.selectedCompany, that.selectedMonth]  },//header
                    ],
                    insertRows: [
                      {   
                        startRow: 11, proc: "hr_rpt_1030050_payment_bank_1", params: [...p_param] ,
                        param_extra: [...p_param_extra],
                        total: [
                          {   column: null, isDisplay: true, type: "SUM", text: that.$t("TOTAL"), isMerge: true, isGrandTotal: true , font: {  size: 15, bold: true } , merge: { from: 1, to: 4 }  }, //"Grand total: $[1] record(s) "
                        ]
                      }
                    ],
                  },
                    //sheet2
                  {
                    sheet: 2,
                    insertRange: [
                      { range: "A1:I21", proc: "hr_rpt_1030050_company_info", params: [that.selectedCompany, that.selectedMonth]  },//header
                    ],
                    insertRows: [
                      {   
                        startRow: 11, proc: "hr_rpt_1030050_payment_bank_2", params: [...p_param] ,
                        param_extra: [...p_param_extra],
                        total: [
                          {   column: null, isDisplay: true, type: "SUM", text: that.$t("TOTAL"), isMerge: true, isGrandTotal: true , font: {  size: 15, bold: true } , merge: { from: 1, to: 4 }  }, //"Grand total: $[1] record(s) "
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
                    insertRange: [ { range: "A1:BZ6", proc: "hr_rpt_1030050_company_info", params: [that.selectedCompany, that.selectedMonth]  },  ],
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

        const res = await that.$axios.$get('/dso/makereport', { responseType: "blob", params:{ template:  report_path ,excel: JSON.stringify(excel)  } }  );

        if(res && res.size > 0){
            that._ExcelSaveAs(res, report_name); 
            that.salaryStatus = that.$t("complete");
        } else {
            that.showNotification( "danger", that.$t("fail_to_export_report"), "", 4000 );
            that.salaryStatus = that.$t("fail_to_export_report");
        }
    },
}


let prepareCommonData = async (that) => {
    
};

export default _1031050_sp;