let allowanceList = null;
let unfixAllowanceList = null;

let reportList= [   
    { CODE: '22', NAME: '22 - Payment By Bank', REPORT_PATH: 'report/10/31/ghs/1031050_payment_bank1_ghs.xlsx'}, 
    { CODE: '21', NAME: '21 - Payroll Group Summary', REPORT_PATH: 'report/10/31/ghs/1030050_payroll_summary.xlsx'}, 
    { CODE: '20', NAME: '20 - Payroll', REPORT_PATH: 'report/10/31/ghs/1030050_PAYROLL_TOTAL_GHS.xlsx'}, 
    { CODE: '23', NAME: '23 - Payslip', REPORT_PATH: 'report/10/31/ghs/1030050_payslip_ghs.xlsx'}, 
];

let _1031050_ghs = {
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
            case '22' : {
                excel = [
                 //sheet1
                   {
                     sheet: 1,
                     insertRange: [
                       { range: "A1:I6", proc: "hr_rpt_1030050_company_info", params: [that.selectedCompany, that.selectedMonth]  },//header
                     ],
                     insertRows: [
                       {   
                         sequence: "break",
                         startRow: 8, proc: "hr_rpt_1030050_payment_bank", params: [...p_param] ,
                         total: [
                           {   column: null, isDisplay: true, type: "SUM", text: that.$t("TOTAL"), isMerge: true, isGrandTotal: true , font: {  size: 12, bold: true } , merge: { from: 1, to: 6 }  }, //"Grand total: $[1] record(s) "
                         ]
                       }
                     ],
                   },
                 ];
                break;
            }

            case '21' : {
                let hiddenCols = [];
                let startAllow1 = 6-1;
                let startAllowK = 21-1;
                let reportHeader = {};

                //setup allow col
                for(let i = 1; i <= 15; i++) {
                  let allowIdx = allowanceList.findIndex( x =>  Number(x.CODE.replace("A","")) == i);
                  if(allowIdx >= 0) {
                    let allow = allowanceList[allowIdx];

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
                    let allowIdx = unfixAllowanceList.findIndex( x =>  Number(x.CODE) == i);
                    if(allowIdx >= 0) {
                        let allow = unfixAllowanceList[allowIdx];

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
                      { range: "A1:AP3", proc: "hr_rpt_1030050_company_info", params: [that.selectedCompany, that.selectedMonth] },//header
                    ],
                    insertRows: [
                      {   
                        sequence: "break",
                        startRow: 7, proc: "hr_rpt_1030050_payroll_summary", params: [...p_param] ,
                        param_extra: [...p_param_extra],
                        total: [
                          {   column: null, isDisplay: true, type: "SUM", text: that.$t("total"), isMerge: true, isGrandTotal: true , font: {  size: 15, bold: true } , merge: { from: 1, to: 2 }  }, //"Grand total: $[1] record(s) "
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
                  reportInfo.REPORT_PATH = "report/10/31/ghs/1030050_PAYROLL_TOTAL_GHS.xlsx";


                  let exceljs =  require("@/plugins/exceljs.js");
                  if(!!exceljs) {
                      exceljs = exceljs.default;
                  }
                  await exceljs.createWorkbook(that, reportInfo.REPORT_PATH);

									let dsoComp = {type: 'grid', selpro: 'HR_RPT_1030050_COMPANY_INFO', para: [that.selectedCompany, that.selectedMonth] };
									let dataComp = await that._dsoCall(dsoComp, 'select', false);

									const dso = {type: 'list', selpro: 'HR_RPT_1030050_PAYROLL_GHS', para: [...p_param] };
									let _datas = await that._dsoCall(dso, 'select', false);
									
									exceljs.setWorksheet("ACTIVE");
									let worksheet = exceljs.worksheet();

									let startRow = 10;
            			let totalRow = startRow + _datas.length;
                  let totalData = {TOTAL_TEXT: "GRAND TOTAL"};

                  let keys = Object.keys(_datas[0]);
                  keys.forEach(key => {
                      let vals = _datas.map( q =>  (  isNaN(q[key]) ||  q[key]== null  ) ? 0 :  q[key]  );
                      let sumVal = Math.round(that._Total(vals)*100)/100;
                      totalData[key] = sumVal;
                  })

                  dataComp[0].NET_AMT_VN = that._num2VieText(totalData.NET_AMT);

                  exceljs.insertRange(that, "A1:BZ24", dataComp[0] );
                  exceljs.insertRows(that,startRow, _datas);
                  exceljs.insertRowData(that, totalRow, totalData);
            			

									exceljs.dowloadWorkbook(that, reportInfo.NAME + ".xlsx");
									that.salaryStatus = that.$t("complete");
									return;
                } else {
                  reportInfo.REPORT_PATH = "report/10/31/ghs/1030050_PAYROLL_TOTAL_GHS_R.xlsx";

                  let exceljs =  require("@/plugins/exceljs.js");
                  if(!!exceljs) {
                      exceljs = exceljs.default;
                  }
                  await exceljs.createWorkbook(that, reportInfo.REPORT_PATH);

									let dsoComp = {type: 'grid', selpro: 'HR_RPT_1030050_COMPANY_INFO', para: [that.selectedCompany, that.selectedMonth] };
									let dataComp = await that._dsoCall(dsoComp, 'select', false);

									const dso = {type: 'list', selpro: 'HR_RPT_1030050_PAYROLL_GHS_R', para: [...p_param] };
									let _datas = await that._dsoCall(dso, 'select', false);
									
									exceljs.setWorksheet("RESIGN");
									let worksheet = exceljs.worksheet();

									let startRow = 10;
            			let totalRow = startRow + _datas.length;
                  let totalData = {TOTAL_TEXT: "GRAND TOTAL"};

                  let keys = Object.keys(_datas[0]);
                  keys.forEach(key => {
                      let vals = _datas.map( q =>  (  isNaN(q[key]) ||  q[key]== null  ) ? 0 :  q[key]  );
                      let sumVal = Math.round(that._Total(vals)*100)/100;
                      totalData[key] = sumVal;
                  })

                  dataComp[0].NET_AMT_VN = that._num2VieText(totalData.NET_AMT);

                  exceljs.insertRange(that, "A1:BZ24", dataComp[0] );
                  exceljs.insertRows(that,startRow, _datas);
                  exceljs.insertRowData(that, totalRow, totalData);
            			

									exceljs.dowloadWorkbook(that, reportInfo.NAME + ".xlsx");
									that.salaryStatus = that.$t("complete");
									return;



                  excel = [
                    {
                      sheet: 'RESIGN',
                      insertRange: [ { range: "A1:BT17", proc: "hr_rpt_1030050_company_info", params: [that.selectedCompany, that.selectedMonth]  },  ],
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
                let p_nation_all = [...p_param,p_from,p_to, that.selectedCompany];

                excel = [
                  {
                    sheet: 1,
                    insertRange2: [ { range: "A1:P39", pageBreak: true, proc: "HR_RPT_1030050_PAYSLIP_GHS", params: [...p_nation_all], param_extra: [...p_param_extra],dateColumns: ["LEFT_DT1", "JOIN_DT1","LEFT_DT2", "JOIN_DT2"] , stringColumns: [],imageColumns: ["LOGO"] }, ],
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
    const dsoAllow = {  type: 'grid', selpro: 'hr_rpt_get_allowance', para: [that.selectedCompany] }

    const dsoUnfix = {  type: 'grid', selpro: 'HR_RPT_GET_UNFIX_ALLOWANCE', para: [that.selectedCompany] }

    const result = await that._dsoCall(dsoAllow, 'select', false)
    if(result) {
        allowanceList = result;
    } 

    const result2 = await that._dsoCall(dsoUnfix, 'select', false)
    if(result2) {
        unfixAllowanceList = result2;
    } 
};

export default _1031050_ghs;