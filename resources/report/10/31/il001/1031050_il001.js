let allowanceList = null;
let unfixAllowanceList = null;

let reportList= [   
    { CODE: '21', NAME: '21 - Payment By Bank', REPORT_PATH: 'report/10/31/il001/1030050_payroll_group_summary.xlsx'}, 
    { CODE: '22', NAME: '22 - Payroll Group Summary', REPORT_PATH: 'report/10/31/il001/1030050_salary_payment_by_bank.xlsx'}, 
];

let _1031050_il = {
    getReportList: async (that) =>{
        await prepareCommonData(that);
        return reportList;
    },

    print: async(that, selectedReport) => {
        let excel = null;
        let reportInfo = reportList.find(x => x.CODE === selectedReport);
        let p_param = [that.selectedOrg, that.selectedStatus, that.selectedType, that.selectedEmpPK, that.selectedMonth, that.selectedPeriod, that.selectedMoney];
        let p_param_extra = [];

        let p_from = that.selectedFromDate;
        let p_to = that.selectedToDate;

        let report_path = reportInfo.REPORT_PATH;
        let report_name = reportInfo.NAME+".xlsx";

        switch(selectedReport) {
            case '21' : {
                excel = [
                  {
                    insertRange: [ { range: "A1:BT17", proc: "hr_rpt_1030050_company_info", params: [that.selectedCompany, that.selectedMonth]  },  ],
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
                    insertRange: [ { range: "A1:E14", proc: "hr_rpt_1030050_company_info", params: [that.selectedCompany, that.selectedMonth]  },  ],
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

export default _1031050_il;