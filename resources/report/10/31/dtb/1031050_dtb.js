let reportList = [
    /* VNG-207 20241023 KO SU DUNG LIST NAY NUA, MOVE LEN TREN REPORT MANAGEMENT [8011010] DE CHECK CHO AUDIT  */
    // { CODE: '20', NAME: '20 - Payroll Total', REPORT_PATH: 'report/10/31/dtb/1030050_PAYROLL_TOTAL_DY.xlsx' },
    // { CODE: '21', NAME: '21 - Payroll 1', REPORT_PATH: 'report/10/31/dtb/1030050_PAYROLL_1_DY.xlsx' },
    // { CODE: '22', NAME: '22 - Payroll 2', REPORT_PATH: 'report/10/31/dtb/1030050_PAYROLL_2_DY.xlsx' },
    // { CODE: '23', NAME: '23 - Payslip', REPORT_PATH: 'report/10/31/dtb/1030050_PAYSLIP_DY1.xlsx' },
    // { CODE: '24', NAME: '24 - Payment By Bank', REPORT_PATH: 'report/10/31/dtb/1030050_payment_bank_dy.xlsx' },
    // { CODE: '25', NAME: '25 - Payslip OT', REPORT_PATH: 'report/10/31/dtb/1030050_OT_PAYSLIP_DY.xlsx' },
    // { CODE: '26', NAME: '26 - Payroll Summary', REPORT_PATH: 'report/10/31/dtb/1030050_payroll_summary_report.xlsx' },
    // { CODE: '27', NAME: '27 - Payroll Summary By SEQ', REPORT_PATH: 'report/10/31/dtb/1030050_payroll_summary_report_seq.xlsx' },
    // { CODE: '28', NAME: '28 - Payroll Total By SEQ', REPORT_PATH: 'report/10/31/dtb/1030050_PAYROLL_TOTAL_DY.xlsx' },
    // { CODE: '29', NAME: '29 - Payroll 1 By SEQ', REPORT_PATH: 'report/10/31/dtb/1030050_PAYROLL_1_DY.xlsx' },
    // { CODE: '30', NAME: '30 - Payroll 2 By SEQ', REPORT_PATH: 'report/10/31/dtb/1030050_PAYROLL_2_DY.xlsx' },
];

let _1031050_dy = {
    getReportList: async (that) => {
        await prepareCommonData(that);
        return reportList;
    },

    print: async (that, selectedReport, _reportInfo = undefined) => {
        let excel = null;
        let reportInfo = _reportInfo ? _reportInfo : reportList.find(x => x.CODE === selectedReport);
        let p_param = [that.selectedOrg, that.selectedStatus, that.selectedType, that.selectedEmpPK, that.selectedMonth, that.selectedPeriod, that.selectedMoney];
        let p_param_extra = [];

        let report_path = reportInfo.REPORT_PATH;
        let report_name = reportInfo.NAME + ".xlsx";

        switch (selectedReport) {
            case '20': {
                excel = [
                    {
                        sheet: 1,
                        insertRange: [{ range: "A1:BZ6", proc: "hr_rpt_1030050_company_info", params: [that.selectedCompany, that.selectedMonth] },],
                        insertRows: [
                            {
                                startRow: 9, proc: "hr_rpt_1030050_PAYROLL_SUM_DY", params: [...p_param], dateColumns: ["LEFT_DT"], stringColumns: ["EMP_ID", "ID_NUM", "OLD_ID", "ACCOUNT"],
                                param_extra: [...p_param_extra],
                                total: [
                                    {
                                        column: null, isDisplay: true, type: "SUM", text: "TỔNG CỘNG", isMerge: true, isGrandTotal: true, font: { size: 7, bold: true }, merge: { from: 1, to: 6 }
                                        , fill: {
                                            type: 'pattern',
                                            pattern: 'solid',
                                            fgColor: { argb: 'badeff' },
                                            bgColor: { argb: 'badeff' }
                                        }
                                    }, //"Grand total: $[1] record(s) "
                                ]
                            }
                        ],
                    },
                    {
                        sheet: 2,
                        insertRange: [{ range: "A1:BZ6", proc: "hr_rpt_1030050_company_info", params: [that.selectedCompany, that.selectedMonth] },],
                        insertRows: [
                            {
                                startRow: 9, proc: "hr_rpt_1030050_PAYROLL_TOTAL_R_DY", params: [...p_param], dateColumns: ["LEFT_DT"], stringColumns: ["EMP_ID", "ID_NUM", "OLD_ID", "ACCOUNT"],
                                param_extra: [...p_param_extra],
                                total: [
                                    {
                                        column: null, isDisplay: true, type: "SUM", text: "TỔNG CỘNG", isMerge: true, isGrandTotal: true, font: { size: 7, bold: true }, merge: { from: 1, to: 6 }
                                        , fill: {
                                            type: 'pattern',
                                            pattern: 'solid',
                                            fgColor: { argb: 'badeff' },
                                            bgColor: { argb: 'badeff' }
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
                        insertRange: [{ range: "A1:BQ6", proc: "hr_rpt_1030050_company_info", params: [that.selectedCompany, that.selectedMonth] },],
                        insertRows: [
                            {
                                startRow: 9, proc: "hr_rpt_1030050_PAYROLL_1_DY", params: [...p_param], dateColumns: ["LEFT_DT"], stringColumns: ["EMP_ID", "ID_NUM", "OLD_ID", "ACCOUNT"],
                                param_extra: [...p_param_extra],
                                total: [
                                    {
                                        column: null, isDisplay: true, type: "SUM", text: "TỔNG CỘNG", isMerge: true, isGrandTotal: true, font: { size: 7, bold: true }, merge: { from: 1, to: 6 }
                                        , fill: {
                                            type: 'pattern',
                                            pattern: 'solid',
                                            fgColor: { argb: 'badeff' },
                                            bgColor: { argb: 'badeff' }
                                        }
                                    }, //"Grand total: $[1] record(s) "
                                ]
                            }
                        ],
                    },
                ];

                break;
            }

            case '22': {
                excel = [
                    {
                        sheet: 1,
                        insertRange: [{ range: "A1:AV6", proc: "hr_rpt_1030050_company_info", params: [that.selectedCompany, that.selectedMonth] },],
                        insertRows: [
                            {
                                startRow: 9, proc: "hr_rpt_1030050_PAYROLL_2_DY", params: [...p_param], dateColumns: ["LEFT_DT"], stringColumns: ["EMP_ID", "ID_NUM", "OLD_ID", "ACCOUNT"],
                                param_extra: [...p_param_extra],
                                total: [
                                    {
                                        column: null, isDisplay: true, type: "SUM", text: "TỔNG CỘNG", isMerge: true, isGrandTotal: true, font: { size: 7, bold: true }, merge: { from: 1, to: 6 }
                                        , fill: {
                                            type: 'pattern',
                                            pattern: 'solid',
                                            fgColor: { argb: 'badeff' },
                                            bgColor: { argb: 'badeff' }
                                        }
                                    }, //"Grand total: $[1] record(s) "
                                ]
                            }
                        ],
                    },
                    {
                        sheet: 2,
                        insertRange: [{ range: "A1:AV6", proc: "hr_rpt_1030050_company_info", params: [that.selectedCompany, that.selectedMonth] },],
                        insertRows: [
                            {
                                startRow: 9, proc: "hr_rpt_1030050_PAYROLL_2_R_DY", params: [...p_param], dateColumns: ["LEFT_DT"], stringColumns: ["EMP_ID", "ID_NUM", "OLD_ID", "ACCOUNT"],
                                param_extra: [...p_param_extra],
                                total: [
                                    {
                                        column: null, isDisplay: true, type: "SUM", text: "TỔNG CỘNG", isMerge: true, isGrandTotal: true, font: { size: 7, bold: true }, merge: { from: 1, to: 6 }
                                        , fill: {
                                            type: 'pattern',
                                            pattern: 'solid',
                                            fgColor: { argb: 'badeff' },
                                            bgColor: { argb: 'badeff' }
                                        }
                                    }, //"Grand total: $[1] record(s) "
                                ]
                            }
                        ],
                    },
                ];
                break;
            }

            case '23': { // payslip
                excel = [
                    {
                        sheet: 1,
                        insertRange2: [
                            { range: "A1:I54", pageBreak: true, dataPerPage: 1, proc: "hr_rpt_1030050_PAYSLIP_DY", params: [...p_param], param_extra: [...p_param_extra], dateColumns: [], stringColumns: ["EMP_ID", "ID_NUM", "OLD_ID", "ACCOUNT"], },
                        ],
                    },
                ];
                break;
            }

            case '24': { // bank
                excel = [
                    //sheet1
                    {
                        sheet: "Total",
                        insertRange: [
                            { range: "A1:I21", proc: "hr_rpt_1030050_company_info", params: [that.selectedCompany, that.selectedMonth] },//header
                        ],
                        insertRows: [
                            {
                                sequence: "break",
                                startRow: 11, proc: "hr_rpt_1030050_payment_bank", params: [...p_param],
                                param_extra: [...p_param_extra],
                                total: [
                                    { column: null, isDisplay: true, type: "SUM", text: that.$t("TOTAL"), isMerge: true, isGrandTotal: true, font: { size: 15, bold: true }, merge: { from: 1, to: 4 } }, //"Grand total: $[1] record(s) "
                                ]
                            }
                        ],
                    },
                    //sheet2
                    {
                        sheet: "T1",
                        insertRange: [
                            { range: "A1:I21", proc: "hr_rpt_1030050_company_info", params: [that.selectedCompany, that.selectedMonth] },//header
                        ],
                        insertRows: [
                            {
                                sequence: "break",
                                startRow: 11, proc: "hr_rpt_1030050_payment_bank_dtb", params: [...p_param],
                                param_extra: [...p_param_extra],
                                total: [
                                    { column: null, isDisplay: true, type: "SUM", text: that.$t("TOTAL"), isMerge: true, isGrandTotal: true, font: { size: 15, bold: true }, merge: { from: 1, to: 4 } }, //"Grand total: $[1] record(s) "
                                ]
                            }
                        ],
                    },
                    //sheet3
                    {
                        sheet: "T2",
                        insertRange: [
                            { range: "A1:I21", proc: "hr_rpt_1030050_company_info", params: [that.selectedCompany, that.selectedMonth] },//header
                        ],
                        insertRows: [
                            {
                                sequence: "break",
                                startRow: 11, proc: "hr_rpt_1030050_payment_bank_dtb_2", params: [...p_param],
                                param_extra: [...p_param_extra],
                                total: [
                                    { column: null, isDisplay: true, type: "SUM", text: that.$t("TOTAL"), isMerge: true, isGrandTotal: true, font: { size: 15, bold: true }, merge: { from: 1, to: 4 } }, //"Grand total: $[1] record(s) "
                                ]
                            }
                        ],
                    },

                    //sheet4
                    {
                        sheet: "Resign Total",
                        insertRange: [
                            { range: "A1:I21", proc: "hr_rpt_1030050_company_info", params: [that.selectedCompany, that.selectedMonth] },//header
                        ],
                        insertRows: [
                            {
                                sequence: "break",
                                startRow: 11, proc: "hr_rpt_1030050_payment_bank_r_dtb", params: [...p_param],
                                param_extra: [...p_param_extra],
                                total: [
                                    { column: null, isDisplay: true, type: "SUM", text: that.$t("TOTAL"), isMerge: true, isGrandTotal: true, font: { size: 15, bold: true }, merge: { from: 1, to: 4 } }, //"Grand total: $[1] record(s) "
                                ]
                            }
                        ],
                    },

                    //sheet5
                    {
                        sheet: "Resign T1",
                        insertRange: [
                            { range: "A1:I21", proc: "hr_rpt_1030050_company_info", params: [that.selectedCompany, that.selectedMonth] },//header
                        ],
                        insertRows: [
                            {
                                sequence: "break",
                                startRow: 11, proc: "hr_rpt_1030050_payment_bank_1_r_dtb", params: [...p_param],
                                param_extra: [...p_param_extra],
                                total: [
                                    { column: null, isDisplay: true, type: "SUM", text: that.$t("TOTAL"), isMerge: true, isGrandTotal: true, font: { size: 15, bold: true }, merge: { from: 1, to: 4 } }, //"Grand total: $[1] record(s) "
                                ]
                            }
                        ],
                    },

                    //sheet6
                    {
                        sheet: "Resign T2",
                        insertRange: [
                            { range: "A1:I21", proc: "hr_rpt_1030050_company_info", params: [that.selectedCompany, that.selectedMonth] },//header
                        ],
                        insertRows: [
                            {
                                sequence: "break",
                                startRow: 11, proc: "hr_rpt_1030050_payment_bank_2_r_dtb", params: [...p_param],
                                param_extra: [...p_param_extra],
                                total: [
                                    { column: null, isDisplay: true, type: "SUM", text: that.$t("TOTAL"), isMerge: true, isGrandTotal: true, font: { size: 15, bold: true }, merge: { from: 1, to: 4 } }, //"Grand total: $[1] record(s) "
                                ]
                            }
                        ],
                    },

                ];
                break;
            }

            case '31': { // cash
                excel = [
                    //sheet1
                    {
                        sheet: "Total",
                        insertRange: [
                            { range: "A1:I21", proc: "hr_rpt_1030050_company_info", params: [that.selectedCompany, that.selectedMonth] },//header
                        ],
                        insertRows: [
                            {
                                sequence: "break",
                                startRow: 11, proc: "hr_rpt_1030050_payment_cash", params: [...p_param],
                                param_extra: [...p_param_extra],
                                total: [
                                    { column: null, isDisplay: true, type: "SUM", text: that.$t("TOTAL"), isMerge: true, isGrandTotal: true, font: { size: 15, bold: true }, merge: { from: 1, to: 4 } }, //"Grand total: $[1] record(s) "
                                ]
                            }
                        ],
                    },
                    //sheet2
                    {
                        sheet: "T1",
                        insertRange: [
                            { range: "A1:I21", proc: "hr_rpt_1030050_company_info", params: [that.selectedCompany, that.selectedMonth] },//header
                        ],
                        insertRows: [
                            {
                                sequence: "break",
                                startRow: 11, proc: "hr_rpt_1030050_payment_cash_dtb", params: [...p_param],
                                param_extra: [...p_param_extra],
                                total: [
                                    { column: null, isDisplay: true, type: "SUM", text: that.$t("TOTAL"), isMerge: true, isGrandTotal: true, font: { size: 15, bold: true }, merge: { from: 1, to: 4 } }, //"Grand total: $[1] record(s) "
                                ]
                            }
                        ],
                    },
                    //sheet3
                    {
                        sheet: "T2",
                        insertRange: [
                            { range: "A1:I21", proc: "hr_rpt_1030050_company_info", params: [that.selectedCompany, that.selectedMonth] },//header
                        ],
                        insertRows: [
                            {
                                sequence: "break",
                                startRow: 11, proc: "hr_rpt_1030050_payment_cash_dtb_2", params: [...p_param],
                                param_extra: [...p_param_extra],
                                total: [
                                    { column: null, isDisplay: true, type: "SUM", text: that.$t("TOTAL"), isMerge: true, isGrandTotal: true, font: { size: 15, bold: true }, merge: { from: 1, to: 4 } }, //"Grand total: $[1] record(s) "
                                ]
                            }
                        ],
                    },

                    //sheet4
                    {
                        sheet: "Resign Total",
                        insertRange: [
                            { range: "A1:I21", proc: "hr_rpt_1030050_company_info", params: [that.selectedCompany, that.selectedMonth] },//header
                        ],
                        insertRows: [
                            {
                                sequence: "break",
                                startRow: 11, proc: "hr_rpt_1030050_payment_cash_r_dtb", params: [...p_param],
                                param_extra: [...p_param_extra],
                                total: [
                                    { column: null, isDisplay: true, type: "SUM", text: that.$t("TOTAL"), isMerge: true, isGrandTotal: true, font: { size: 15, bold: true }, merge: { from: 1, to: 4 } }, //"Grand total: $[1] record(s) "
                                ]
                            }
                        ],
                    },

                    //sheet5
                    {
                        sheet: "Resign T1",
                        insertRange: [
                            { range: "A1:I21", proc: "hr_rpt_1030050_company_info", params: [that.selectedCompany, that.selectedMonth] },//header
                        ],
                        insertRows: [
                            {
                                sequence: "break",
                                startRow: 11, proc: "hr_rpt_1030050_payment_cash_1_r_dtb", params: [...p_param],
                                param_extra: [...p_param_extra],
                                total: [
                                    { column: null, isDisplay: true, type: "SUM", text: that.$t("TOTAL"), isMerge: true, isGrandTotal: true, font: { size: 15, bold: true }, merge: { from: 1, to: 4 } }, //"Grand total: $[1] record(s) "
                                ]
                            }
                        ],
                    },

                    //sheet6
                    {
                        sheet: "Resign T2",
                        insertRange: [
                            { range: "A1:I21", proc: "hr_rpt_1030050_company_info", params: [that.selectedCompany, that.selectedMonth] },//header
                        ],
                        insertRows: [
                            {
                                sequence: "break",
                                startRow: 11, proc: "hr_rpt_1030050_payment_cash_2_r_dtb", params: [...p_param],
                                param_extra: [...p_param_extra],
                                total: [
                                    { column: null, isDisplay: true, type: "SUM", text: that.$t("TOTAL"), isMerge: true, isGrandTotal: true, font: { size: 15, bold: true }, merge: { from: 1, to: 4 } }, //"Grand total: $[1] record(s) "
                                ]
                            }
                        ],
                    },

                ];
                break;
            }

            case '25': { // payslip ot
                excel = [
                    {
                        sheet: 1,
                        insertRange2: [
                            { range: "A1:I36", pageBreak: true, proc: "hr_rpt_1030050_PAYSLIP_DY_2", params: [...p_param], param_extra: [...p_param_extra], dateColumns: [], stringColumns: ["EMP_ID", "ID_NUM", "OLD_ID", "ACCOUNT"], },
                        ],
                    },
                ];
                break;
            }

            case '26': {
                excel = [
                    {
                        sheet: 1,
                        insertRange: [{ range: "A1:BZ6", proc: "hr_rpt_1030050_company_info", params: [that.selectedCompany, that.selectedMonth] },],
                        insertRows: [
                            {
                                startRow: 9, proc: "hr_rpt_1030050_PAYROLL_SUMMARY_REPORT", params: [...p_param], dateColumns: [], stringColumns: ["EMP_ID", "ID_NUM", "OLD_ID", "ACCOUNT"],
                                param_extra: [...p_param_extra],
                                total: [
                                    {
                                        column: null, isDisplay: true, type: "SUM", text: "TỔNG CỘNG", isMerge: true, isGrandTotal: true, font: { size: 7, bold: true }, merge: { from: 1, to: 2 }
                                        , fill: {
                                            type: 'pattern',
                                            pattern: 'solid',
                                            fgColor: { argb: 'badeff' },
                                            bgColor: { argb: 'badeff' }
                                        }
                                    }, //"Grand total: $[1] record(s) "
                                ]
                            }
                        ],
                    },
                    {
                        sheet: 2,
                        insertRange: [{ range: "A1:BZ6", proc: "hr_rpt_1030050_company_info", params: [that.selectedCompany, that.selectedMonth] },],
                        insertRows: [
                            {
                                startRow: 9, proc: "hr_rpt_1030050_PAYROLL_SUMMARY_REPORT_R", params: [...p_param], dateColumns: [], stringColumns: ["EMP_ID", "ID_NUM", "OLD_ID", "ACCOUNT"],
                                param_extra: [...p_param_extra],
                                total: [
                                    {
                                        column: null, isDisplay: true, type: "SUM", text: "TỔNG CỘNG", isMerge: true, isGrandTotal: true, font: { size: 7, bold: true }, merge: { from: 1, to: 2 }
                                        , fill: {
                                            type: 'pattern',
                                            pattern: 'solid',
                                            fgColor: { argb: 'badeff' },
                                            bgColor: { argb: 'badeff' }
                                        }
                                    }, //"Grand total: $[1] record(s) "
                                ]
                            }
                        ],
                    },
                ];

                break;
            }

            case '27': {
                excel = [
                    {
                        sheet: 1,
                        insertRange: [{ range: "A1:BZ6", proc: "hr_rpt_1030050_company_info", params: [that.selectedCompany, that.selectedMonth] },],
                        insertRows: [
                            {
                                sequence: "break",
                                startRow: 9, proc: "HR_RPT_1030050_PAYROLL_SUMMARY_SQE", params: [...p_param], dateColumns: [], stringColumns: ["EMP_ID", "ID_NUM", "OLD_ID", "ACCOUNT"],
                                param_extra: [...p_param_extra],
                                total: [
                                    { column: "SEQ", isDisplay: true, type: "SUM", text: "Sub-total Group $[0]: $[1] record(s) ", merge: { from: 1, to: 2 }, font: { size: 10, bold: true, } },
                                    {
                                        column: null, isDisplay: true, type: "SUM", text: "TỔNG CỘNG", isMerge: true, isGrandTotal: true, font: { size: 7, bold: true }, merge: { from: 1, to: 2 }
                                        , fill: {
                                            type: 'pattern',
                                            pattern: 'solid',
                                            fgColor: { argb: 'badeff' },
                                            bgColor: { argb: 'badeff' }
                                        }
                                    }, //"Grand total: $[1] record(s) "
                                ]
                            }
                        ],
                    },
                ];

                break;
            }

            case '28': {
                excel = [
                    {
                        sheet: 1,
                        insertRange: [{ range: "A1:BZ6", proc: "hr_rpt_1030050_company_info", params: [that.selectedCompany, that.selectedMonth] },],
                        insertRows: [
                            {
                                sequence: "break",
                                startRow: 9, proc: "hr_rpt_1030050_PAYROLL_TOTAL_SEQ_DY", params: [...p_param], dateColumns: ["LEFT_DT"], stringColumns: ["EMP_ID", "ID_NUM", "OLD_ID", "ACCOUNT"],
                                param_extra: [...p_param_extra],
                                total: [
                                    { column: "SEQ", isDisplay: true, type: "SUM", text: "Sub-total Group $[0]: $[1] record(s) ", merge: { from: 1, to: 6 }, font: { size: 10, bold: true, } },
                                    {
                                        column: null, isDisplay: true, type: "SUM", text: "TỔNG CỘNG", isMerge: true, isGrandTotal: true, font: { size: 7, bold: true }, merge: { from: 1, to: 6 }
                                        , fill: {
                                            type: 'pattern',
                                            pattern: 'solid',
                                            fgColor: { argb: 'badeff' },
                                            bgColor: { argb: 'badeff' }
                                        }
                                    }, //"Grand total: $[1] record(s) "
                                ]
                            }
                        ],
                    },
                    {
                        sheet: 2,
                        insertRange: [{ range: "A1:BZ6", proc: "hr_rpt_1030050_company_info", params: [that.selectedCompany, that.selectedMonth] },],
                        insertRows: [
                            {
                                sequence: "break",
                                startRow: 9, proc: "HR_RPT_1030050_PAYROLL_TOTAL_SEQ_R_DY", params: [...p_param], dateColumns: ["LEFT_DT"], stringColumns: ["EMP_ID", "ID_NUM", "OLD_ID", "ACCOUNT"],
                                param_extra: [...p_param_extra],
                                total: [
                                    { column: "SEQ", isDisplay: true, type: "SUM", text: "Sub-total Group $[0]: $[1] record(s) ", merge: { from: 1, to: 6 }, font: { size: 10, bold: true, } },
                                    {
                                        column: null, isDisplay: true, type: "SUM", text: "TỔNG CỘNG", isMerge: true, isGrandTotal: true, font: { size: 7, bold: true }, merge: { from: 1, to: 6 }
                                        , fill: {
                                            type: 'pattern',
                                            pattern: 'solid',
                                            fgColor: { argb: 'badeff' },
                                            bgColor: { argb: 'badeff' }
                                        }
                                    }, //"Grand total: $[1] record(s) "
                                ]
                            }
                        ],
                    },
                ];

                break;
            }

            case '29': {
                excel = [
                    {
                        sheet: 1,
                        insertRange: [{ range: "A1:BQ6", proc: "hr_rpt_1030050_company_info", params: [that.selectedCompany, that.selectedMonth] },],
                        insertRows: [
                            {
                                sequence: "break",
                                startRow: 9, proc: "hr_rpt_1030050_PAYROLL_1_SEQ_DY", params: [...p_param], dateColumns: ["LEFT_DT"], stringColumns: ["EMP_ID", "ID_NUM", "OLD_ID", "ACCOUNT"],
                                param_extra: [...p_param_extra],
                                total: [
                                    { column: "SEQ", isDisplay: true, type: "SUM", text: "Sub-total Group $[0]: $[1] record(s) ", merge: { from: 1, to: 6 }, font: { size: 10, bold: true, } },
                                    {
                                        column: null, isDisplay: true, type: "SUM", text: "TỔNG CỘNG", isMerge: true, isGrandTotal: true, font: { size: 7, bold: true }, merge: { from: 1, to: 6 }
                                        , fill: {
                                            type: 'pattern',
                                            pattern: 'solid',
                                            fgColor: { argb: 'badeff' },
                                            bgColor: { argb: 'badeff' }
                                        }
                                    }, //"Grand total: $[1] record(s) "
                                ]
                            }
                        ],
                    },
                ];

                break;
            }

            case '30': {
                excel = [
                    {
                        sheet: 1,
                        insertRange: [{ range: "A1:AV6", proc: "hr_rpt_1030050_company_info", params: [that.selectedCompany, that.selectedMonth] },],
                        insertRows: [
                            {
                                sequence: "break",
                                startRow: 9, proc: "hr_rpt_1030050_PAYROLL_2_SEQ_DY", params: [...p_param], dateColumns: ["LEFT_DT"], stringColumns: ["EMP_ID", "ID_NUM", "OLD_ID", "ACCOUNT"],
                                param_extra: [...p_param_extra],
                                total: [
                                    { column: "SEQ", isDisplay: true, type: "SUM", text: "Sub-total Group $[0]: $[1] record(s) ", merge: { from: 1, to: 6 }, font: { size: 10, bold: true, } },
                                    {
                                        column: null, isDisplay: true, type: "SUM", text: "TỔNG CỘNG", isMerge: true, isGrandTotal: true, font: { size: 7, bold: true }, merge: { from: 1, to: 6 }
                                        , fill: {
                                            type: 'pattern',
                                            pattern: 'solid',
                                            fgColor: { argb: 'badeff' },
                                            bgColor: { argb: 'badeff' }
                                        }
                                    }, //"Grand total: $[1] record(s) "
                                ]
                            }
                        ],
                    },
                    {

                        sheet: 2,
                        insertRange: [{ range: "A1:AV6", proc: "hr_rpt_1030050_company_info", params: [that.selectedCompany, that.selectedMonth] },],
                        insertRows: [
                            {
                                sequence: "break",
                                startRow: 9, proc: "hr_rpt_1030050_PAYROLL_2_R_SEQ_DY", params: [...p_param], dateColumns: ["LEFT_DT"], stringColumns: ["EMP_ID", "ID_NUM", "OLD_ID", "ACCOUNT"],
                                param_extra: [...p_param_extra],
                                total: [
                                    { column: "SEQ", isDisplay: true, type: "SUM", text: "Sub-total Group $[0]: $[1] record(s) ", merge: { from: 1, to: 6 }, font: { size: 10, bold: true, } },
                                    {
                                        column: null, isDisplay: true, type: "SUM", text: "TỔNG CỘNG", isMerge: true, isGrandTotal: true, font: { size: 7, bold: true }, merge: { from: 1, to: 6 }
                                        , fill: {
                                            type: 'pattern',
                                            pattern: 'solid',
                                            fgColor: { argb: 'badeff' },
                                            bgColor: { argb: 'badeff' }
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

        const res = await that.$axios.$get('/dso/makereport', { responseType: "blob", params: { template: report_path, excel: JSON.stringify(excel) } });

        if (res && res.size > 0) {
            that._ExcelSaveAs(res, report_name);
            that.salaryStatus = that.$t("complete");
        } else {
            that.showNotification("danger", that.$t("fail_to_export_report"), "", 4000);
            that.salaryStatus = that.$t("fail_to_export_report");
        }
    },
}


let prepareCommonData = async (that) => {

};

export default _1031050_dy;