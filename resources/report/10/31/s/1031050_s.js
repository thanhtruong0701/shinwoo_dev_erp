let allowanceList = null;
let unfixAllowanceList = null;
let companyList = [];
let company = null;
let companyjs = null;
let reportDefault = [];
let reportCompany = [];
let reportList = [
    // { CODE: '20', NAME: '20 - Payroll', REPORT_PATH: 'report/10/31/s/1030050_payroll_new.xlsx' },
    // { CODE: '21', NAME: '21 - Payment Bank', REPORT_PATH: 'report/10/31/s/1030050_payment_bank.xlsx' },
    // { CODE: '22', NAME: '22 - Salary payslip', REPORT_PATH: 'report/10/31/standard/1031180_payslip.xlsx' },

];
let _1031050_s = {
    getReportList: async (that) => {
        await prepareCommonData(that);
        return reportList;
    },

    print: async (that, selectedReport, _reportInfo = undefined) => {
        let excel = null;
        let reportInfo = _reportInfo ? _reportInfo : reportList.find(x => x.CODE === selectedReport);
        let p_param = [that.selectedOrg, that.selectedStatus, that.selectedType, that.selectedEmpPK, that.selectedMonth, that.selectedPeriod, that.selectedMoney];
        let p_param_extra = [];
        let reportHeader = {};
        let report_path = reportInfo.REPORT_PATH;
        let report_name = reportInfo.NAME + ".xlsx";
        let startAllow1 = 17;
        let startAllowK = 69;
        let hiddenCols = [];
        for (let i = 1; i <= 15; i++) {
            let allowIdx = allowanceList.findIndex(x => Number(x.CODE.replace("A", "")) == i);
            if (allowIdx >= 0) {
                let allow = allowanceList[allowIdx];

                if (allow.USE_YN === "Y") {
                    reportHeader["ALLOW" + i + "_NM"] = allow.NAME;
                } else {
                    hiddenCols.push(startAllow1 + i);
                }
            } else {
                hiddenCols.push(startAllow1 + i);
            }
        }

        for (let i = 1; i <= 15; i++) {
            let allowIdx = unfixAllowanceList.findIndex(x => Number(x.CODE) == i);
            if (allowIdx >= 0) {
                let allow = unfixAllowanceList[allowIdx];

                if (allow.USE_YN === "Y") {
                    reportHeader["K" + i] = allow.NAME;
                } else {
                    hiddenCols.push(startAllowK + i);
                }
            } else {
                hiddenCols.push(startAllowK + i);
            }
        }
        switch (selectedReport) {
            case '20': {
                excel = [
                    {
                        sheet: 1,
                        insertRange: [{ range: "A5:DI8", data: reportHeader },
                        { range: "A1:BZ6", proc: "HR_RPT_1030050_COMPANY_INFO", params: [that.selectedCompany, that.selectedMonth] },],
                        insertRows: [
                            {
                                startRow: 9, proc: "HR_RPT_1030050_PAYROLL", params: [...p_param], dateColumns: ["LEFT_DT"], stringColumns: ["EMP_ID", "ID_NUM", "OLD_ID", "ACCOUNT"],
                                param_extra: [...p_param_extra],
                                total: [
                                    { column: null, isDisplay: true, type: "SUM", text: that.$t("Grant Total:"), isMerge: true, isGrandTotal: true, font: { size: 18, bold: true }, merge: { from: 1, to: 6 } }, //"Grand total: $[1] record(s) "
                                ]
                            }
                        ],

                    },
                ];

                break;
            }

            case '21': {
                let report_path = reportInfo.REPORT_PATH;
                let report_name = reportInfo.NAME + ".xlsx";

                let exceljs = require("@/plugins/exceljs.js");
                if (!!exceljs) {
                    exceljs = exceljs.default;
                }
                await exceljs.createWorkbook(that, reportInfo.REPORT_PATH);


                let dsoComp = { type: 'grid', selpro: 'HR_RPT_1030050_COMPANY_INFO', para: [that.selectedCompany, that.selectedMonth] };
                let dataComp = await that._dsoCall(dsoComp, 'select', false);

                dataComp = { ...dataComp[0] };

                const dso = { type: 'list', selpro: 'hr_rpt_1030050_payment_bank', para: [...p_param] };
                let _datas = await that._dsoCall(dso, 'select', false);


                let startRow = 15;
                let totalRow = startRow + _datas.length;
                let totalData = { TOTAL_TEXT: "Tổng cộng" };

                let keys = Object.keys(_datas[0]);
                keys.forEach(key => {
                    let vals = _datas.map(q => (isNaN(q[key]) || q[key] == null) ? 0 : q[key]);
                    let sumVal = Math.round(that._Total(vals) * 100) / 100;
                    totalData[key] = sumVal;
                })

                let NET_AMT_VN = that._num2VieText(totalData.NET_AMT);

                exceljs.getCellByAddress(that, "E18").value = NET_AMT_VN;

                exceljs.insertRange(that, "A1:F12", dataComp);
                exceljs.insertRows(that, startRow, _datas);
                exceljs.insertRowData(that, totalRow, totalData);



                exceljs.dowloadWorkbook(that, reportInfo.NAME + ".xlsx");
                that.salaryStatus = that.$t("complete");
                return;
                break;
            }

            case '22': {
                excel = [
                    {
                        sheet: 1,

                        insertRange2: [
                            {
                                range: "A1:G47"
                                , proc: "hr_rpt_1031180_payslip"
                                , params: [...p_param, "", "", ""]
                                , dateColumns: ["MONTH_", "JOIN_DT"]
                            }]
                        //       , stringColumns: [ "FULL_NAME","ACCOUNT","EMP_ID","ORG_NM","ALE_DAY_IN_YEAR","SALARY_LEVEL1","SALARY_LEVEL2","ALLOW_AMT1_L1","ALLOW_AMT1_L2","ALLOWANCE_SITE_K1","ALLOWANCE_SITE_K2","ALLOWANCE_HOUSE_K3","WORKING_DAYS","TOTAL_WKD","ALE_ABS","TOTAL_ALE_ABS","OTHER_ABS","TOTAL_OTHER_ABS",
                        //   "OT_05_L1","OT_05_L2","TOTAL_OT_1_5","OST_L1","OST_L2","TOTAL_OST_2_0","OHT_L1","OHT_L2","TOTAL_OHT_3_4","MEAL","TOTAL_PARKING","BUSSINESS_FEE","ADJ_EVA","OTHER_COMPENSATION","INCENTIVE","REMAIN_ALE_DAYS",
                        // "SEVERANCE_MONTH","SEVERANCE_AMT","GROSS_AMT","BREAK_CONTRACT_DAYS","BREAK_CONTRACT_AMT","INS_SALARY","INS_PRO_AMT","OTHER_DEDUCT","TOTALWT_HOURS","TOTALWT_AMT","DEDUCT_PIT","INCOME_AMT","INCOME_TAX",
                        // "UNION_AMT","OTHER_COMP_NO_PIT","DEDUCT_PIT_NUM","PIT_FINAL","NET_AMT","TOTAL_ALE_UNUSED_PAID","TOTAL_ALE_UNUSED"]//header


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

export default _1031050_s;