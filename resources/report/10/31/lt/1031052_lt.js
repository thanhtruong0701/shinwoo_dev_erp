let allowanceList = null;
let unfixAllowanceList = null;
let companyList = [];
let company = null;
let companyjs = null;
let reportDefault = [];
let reportCompany = [];
let reportList = [
    { CODE: '20', NAME: '20 - Payroll', REPORT_PATH: 'report/10/31/lt/1030052_payroll_lgl.xlsx' },
    { CODE: '21', NAME: '21 - Payslip', REPORT_PATH: 'report/10/31/lt/1031052_pay_slip_lgl.xlsx' },
    { CODE: '22', NAME: '22 - Payment by Bank vnd', REPORT_PATH: 'report/10/31/lt/1031052_payment_by_bank.xlsx' },
    { CODE: '23', NAME: '23 - Payment by Cash', REPORT_PATH: 'report/10/31/lt/1031052_payment_by_cash.xlsx' },
    // { CODE: '24', NAME: '24 - Bonus', REPORT_PATH: 'report/10/31/lt/1030052_payroll_lgl.xlsx' },
    // { CODE: '25', NAME: '25 - Meal', REPORT_PATH: 'report/10/31/lt/1030052_payroll_lgl.xlsx' },
    { CODE: '26', NAME: '26 - Payment by Bank usd', REPORT_PATH: 'report/10/31/lt/1031052_payment_by_bank.xlsx' },

];
let _1031052_lt = {
    getReportList: async (that) => {
        await prepareCommonData(that);
        return reportList;
    },

    print: async (that, selectedReport) => {
        let excel = null;
        let reportInfo = reportList.find(x => x.CODE === selectedReport);
        let p_param = [that.selectedOrg, that.selectedStatus, that.selectedType, that.selectedEmpPK, that.selectedMonth, that.selectedPeriod, that.selectedMoney, that.selectedNation];
        let p_param_extra = [];

        let report_path = reportInfo.REPORT_PATH;
        let report_name = reportInfo.NAME + ".xlsx";

        console.log("selectedReport", selectedReport);
        console.log("reportInfo", reportInfo);
        console.log("report_path", report_path);
        console.log("report_name", report_name);
        // let startAllow1 = 17;
        // let startAllowK = 69;
        // let hiddenCols = [];
        // for(let i = 1; i <= 15; i++) {
        //     let allowIdx = allowanceList.findIndex( x =>  Number(x.CODE.replace("A","")) == i);
        //     if(allowIdx >= 0) {
        //       let allow = allowanceList[allowIdx];

        //       if( allow.USE_YN === "Y" ) {
        //         reportHeader["ALLOW"+ i + "_NM" ] = allow.NAME;
        //       } else {
        //         hiddenCols.push( startAllow1 + i); 
        //       }
        //     } else {
        //       hiddenCols.push( startAllow1 + i); 
        //     }
        //   }

        //   for(let i = 1; i <= 15; i++) {
        //     let allowIdx = unfixAllowanceList.findIndex( x =>  Number(x.CODE) == i);
        //     if(allowIdx >= 0) {
        //         let allow = unfixAllowanceList[allowIdx];

        //         if( allow.USE_YN === "Y" ) {
        //             reportHeader["K"+ i  ] = allow.NAME; 
        //         } else {
        //             hiddenCols.push( startAllowK + i); 
        //         }
        //     } else {
        //         hiddenCols.push( startAllowK + i); 
        //     }
        // }

        switch (selectedReport) {
            case '20': {
                excel = [
                    {
                        sheet: 1,
                        insertRange2: [
                            { range: "A1:X12", pageBreak: true, dataPerPage: 1, proc: "HR_RPT_1030050_COMPANY_INFO", params: [that.selectedCompany, that.selectedMonth] },
                        ],
                        insertRows: [
                            {
                                startRow: 10, proc: "HR_RPT_1030050_PAYROLL_LGL", params: [...p_param], stringColumns: ["EMP_ID"],
                                param_extra: [...p_param_extra],
                                total: [
                                    {
                                        column: "DIV", isDisplay: true, type: "SUM", text: that.$t("total"), isMerge: false, merge: { from: 1, to: 4 }
                                        , fill: {
                                            type: 'pattern',
                                            pattern: 'solid',
                                            fgColor: { argb: 'CCECFF' },
                                            bgColor: { argb: 'CCECFF' }
                                        }
                                    },
                                    {
                                        column: null, isDisplay: true, type: "SUM", text: that.$t("Grant Total:"), isMerge: true, isGrandTotal: true, font: { size: 10, bold: true }, merge: { from: 1, to: 4 }
                                        , fill: {
                                            type: 'pattern',
                                            pattern: 'solid',
                                            fgColor: { argb: '99FF99' },
                                            bgColor: { argb: '99FF99' }
                                        }
                                    }, //"Grand total: $[1] record(s) "
                                ]

                            }
                        ],

                    },
                ];

                break;
            }

            case '21': {
                excel = [
                    {
                        sheet: 1,
                        insertRange2: [
                            { range: "A1:D32", pageBreak: true, dataPerPage: 1, proc: "HR_RPT_1031052_PAY_SLIP_LGL", params: [...p_param], dateColumns: [], stringColumns: ["emp_id"], },
                        ],

                    },
                ];
                break;

            }

            case '22': {
                excel = [
                    {
                        sheet: 1,
                        insertRange2: [
                            { range: "A1:F10", pageBreak: true, dataPerPage: 1, proc: "HR_RPT_1030050_COMPANY_INFO", params: [that.selectedCompany, that.selectedMonth] },
                        ],
                        insertRows: [
                            {
                                startRow: 7, proc: "HR_RPT_1031052_PAY_BANK_LGL", params: [...p_param], stringColumns: ["EMP_ID"],
                                total: [
                                    {
                                        column: null, isDisplay: true, type: "SUM", text: "Tổng cộng", isMerge: true, isGrandTotal: true, font: { size: 12, bold: true }, merge: { from: 1, to: 5 }
                                    },
                                ]

                            }
                        ]

                    },
                ];
                break;
            }

            case '23': {
                excel = [
                    {
                        sheet: 1,
                        insertRange2: [
                            {
                                range: "A1:I15", pageBreak: true, dataPerPage: 1, proc: "HR_RPT_1030050_COMPANY_INFO", params: [that.selectedCompany, that.selectedMonth],
                            },


                        ],
                        insertRows: [
                            {
                                startRow: 10, proc: "HR_RPT_1031052_PAY_CASH_LGL", params: [...p_param], stringColumns: ["EMP_ID"],
                                total: [
                                    {
                                        column: null, isDisplay: true, type: "SUM", text: "Tổng cộng", isMerge: true, isGrandTotal: true, font: { size: 12, bold: true }, merge: { from: 3 }
                                    },
                                ]

                            }
                        ]

                    },
                ];

                break;
            }

            case '24': {
                that.showNotification("danger", that.$t("COMMING SOON"), "", 4000);

                break;
            }

            case '25': {
                that.showNotification("danger", that.$t("COMMING SOON"), "", 4000);

                break;
            }

            case '26': {
                excel = [
                    {
                        sheet: 1,
                        insertRange2: [
                            { range: "A1:F10", pageBreak: true, dataPerPage: 1, proc: "HR_RPT_1030050_COMPANY_INFO", params: [that.selectedCompany, that.selectedMonth] },
                        ],
                        insertRows: [
                            {
                                startRow: 7, proc: "HR_RPT_1031052_PAY_BANK_USD_LGL", params: [...p_param], stringColumns: ["EMP_ID"],
                                total: [
                                    {
                                        column: null, isDisplay: true, type: "SUM", text: "Tổng cộng", isMerge: true, isGrandTotal: true, font: { size: 12, bold: true }, merge: { from: 1, to: 5 }
                                    },
                                ]

                            }
                        ]

                    },
                ];

                break;
            }

            // case '21':{
            //     let report_path = reportInfo.REPORT_PATH;
            //     let report_name = reportInfo.NAME+".xlsx";

            //     let exceljs =  require("@/plugins/exceljs.js");
            //     if(!!exceljs) {
            //         exceljs = exceljs.default;
            //     }
            //     await exceljs.createWorkbook(that, reportInfo.REPORT_PATH);

            //     let dsoComp = {type: 'grid', selpro: 'HR_RPT_1030050_COMPANY_INFO', para: [that.selectedCompany, that.selectedMonth] };
            //     let dataComp = await that._dsoCall(dsoComp, 'select', false);

            //     exceljs.insertRange(that,"A1:D30", dataComp);

            //     exceljs.dowloadWorkbook(that, reportInfo.NAME + ".xlsx");
            //     that.salaryStatus = that.$t("complete");
            // }

            // case '21' : {
            //     let report_path = reportInfo.REPORT_PATH;
            //     let report_name = reportInfo.NAME+".xlsx";

            //     let exceljs =  require("@/plugins/exceljs.js");
            //     if(!!exceljs) {
            //         exceljs = exceljs.default;
            //     }
            //     await exceljs.createWorkbook(that, reportInfo.REPORT_PATH);


            //     let dsoComp = {type: 'grid', selpro: 'HR_RPT_1030050_COMPANY_INFO', para: [that.selectedCompany, that.selectedMonth] };
            //     let dataComp = await that._dsoCall(dsoComp, 'select', false);

            //     dataComp = {...dataComp[0]};

            //     const dso = {type: 'list', selpro: 'hr_rpt_1030050_payment_bank', para: [...p_param] };
            //     let _datas = await that._dsoCall(dso, 'select', false);


            //     let startRow = 15;
            //     let totalRow = startRow + _datas.length ;
            //     let totalData = {TOTAL_TEXT: "Tổng cộng"};

            //     let keys = Object.keys(_datas[0]);
            //     keys.forEach(key => {
            //         let vals = _datas.map( q =>  (  isNaN(q[key]) ||  q[key]== null  ) ? 0 :  q[key]  );
            //         let sumVal = Math.round(that._Total(vals)*100)/100;
            //         totalData[key] = sumVal;
            //     })

            //     let NET_AMT_VN = that._num2VieText(totalData.NET_AMT);

            //     exceljs.getCellByAddress(that, "E18").value = NET_AMT_VN;

            //     exceljs.insertRange(that, "A1:F12", dataComp);
            //     exceljs.insertRows(that,startRow, _datas);
            //     exceljs.insertRowData(that, totalRow, totalData);



            //     exceljs.dowloadWorkbook(that, reportInfo.NAME + ".xlsx");
            //     that.salaryStatus = that.$t("complete");
            //     return;
            //     break;
            // }

            // case '22': {
            //     excel = [
            //         {
            //             sheet: 1,

            //           insertRange2: [
            //               { 
            //                 range: "A1:G43"
            //                 , proc: "hr_rpt_1031180_payslip" 
            //                 ,params: [...p_param, "", "", ""]
            //                 , dateColumns: ["MONTH_","JOIN_DT"]}]
            //           //       , stringColumns: [ "FULL_NAME","ACCOUNT","EMP_ID","ORG_NM","ALE_DAY_IN_YEAR","SALARY_LEVEL1","SALARY_LEVEL2","ALLOW_AMT1_L1","ALLOW_AMT1_L2","ALLOWANCE_SITE_K1","ALLOWANCE_SITE_K2","ALLOWANCE_HOUSE_K3","WORKING_DAYS","TOTAL_WKD","ALE_ABS","TOTAL_ALE_ABS","OTHER_ABS","TOTAL_OTHER_ABS",
            //           //   "OT_05_L1","OT_05_L2","TOTAL_OT_1_5","OST_L1","OST_L2","TOTAL_OST_2_0","OHT_L1","OHT_L2","TOTAL_OHT_3_4","MEAL","TOTAL_PARKING","BUSSINESS_FEE","ADJ_EVA","OTHER_COMPENSATION","INCENTIVE","REMAIN_ALE_DAYS",
            //           // "SEVERANCE_MONTH","SEVERANCE_AMT","GROSS_AMT","BREAK_CONTRACT_DAYS","BREAK_CONTRACT_AMT","INS_SALARY","INS_PRO_AMT","OTHER_DEDUCT","TOTALWT_HOURS","TOTALWT_AMT","DEDUCT_PIT","INCOME_AMT","INCOME_TAX",
            //           // "UNION_AMT","OTHER_COMP_NO_PIT","DEDUCT_PIT_NUM","PIT_FINAL","NET_AMT","TOTAL_ALE_UNUSED_PAID","TOTAL_ALE_UNUSED"]//header


            //         },
            //       ];
            //       break;
            // }

        }

        const res = await that.$axios.$get('/dso/makereport', { responseType: "blob", params: { template: report_path, excel: JSON.stringify(excel) } });

        if (res && res.size > 0) {
            that._ExcelSaveAs(res, report_name);
            that.salaryStatus = that.$t("complete");
        } else {
            that.showNotification("danger", that.$t("fail_to_export_report"), "", 4000);
            that.salaryStatus = that.$t("fail_to_export_report");
        }
    },



};

let prepareCommonData = async (that) => {
    const dsoAllow = { type: 'grid', selpro: 'hr_rpt_get_allowance', para: [that.selectedCompany] }

    const dsoUnfix = { type: 'grid', selpro: 'HR_RPT_GET_UNFIX_ALLOWANCE', para: [that.selectedCompany] }

    const result = await that._dsoCall(dsoAllow, 'select', false)
    if (result) {
        allowanceList = result;
    }

    const result2 = await that._dsoCall(dsoUnfix, 'select', false)
    if (result2) {
        unfixAllowanceList = result2;
    }

    companyList = await that._getCompany();
    company = companyList.find(x => x["PK"] === that.selectedCompany);
};

export default _1031052_lt;