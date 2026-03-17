import moment from "moment"
let companyList = [];
let company = null;
let companyjs = null;
let reportList = [];
let reportDefault= [   
    { CODE: '20', NAME: '20 - WT OT Period', REPORT_PATH: 'report/12/11/woosung/1211040_wt_n_ot_period.xlsx'},
    { CODE: '21', NAME: '21 - WT OT Month', REPORT_PATH: 'report/12/11/woosung/1211040_wt_n_ot_month.xlsx'},
    { CODE: '22', NAME: '22 - Working-Sumarry', REPORT_PATH: 'report/12/11/woosung/1211040_working_sumarry.xlsx'},
];
let reportCompany = [];
let _1211040_woosung = {
    getReportList: async(that) =>{
        await prepareCommonData(that);
        let reports = [];

        reports = [...reportDefault, ...reportCompany];
        reportList = [...reports];
		reportList = reportList.sort((a, b) => (Number(a.CODE) > Number(b.CODE)) ? 1 : -1)
        return reportList;
    }, 
    print: async(that, selectedReport, selecteds) => {
        that.isInProcessing = true;
        that.processStatus = that.$t("making_report");
        let reportInfo = reportList.find(x => x.CODE === selectedReport);

        try {
            if( reportDefault.findIndex( q=> q.CODE == selectedReport)  >=0  && Number(selectedReport) < 30 ) { //report default
                switch(selectedReport) {
                    case "20": {                        
                        await printWTOTPeriod( that, reportInfo, selecteds)
                        break;
                    }
                    case "21": {                        
                        await printWTOTMonth( that, reportInfo, selecteds)
                        break;
                    }
                    case "22": {                        
                        await printWorkingSumarry( that, reportInfo, selecteds)
                        break;
                    }
                }
            } else { // report cho cty
                await companyjs.print(that, selectedReport);
            }
            
        } catch(e) {
            console.log(e)
            that.processStatus = that.$t("fail_to_export_report");
        } finally {
            that.isInProcessing = false;
        }
    },

}


let prepareCommonData = async (that) => {
    companyList = await that._getCompany();
    company = companyList.find(x => x["PK"] === that.selectedCompany );
};

let printWTOTPeriod = async( that, reportInfo,selecteds) => {
    let p_param = [...selecteds];
    p_param.push(that.selectedFromDate2);
    p_param.push(that.selectedToDate2);
    p_param.push(that.selectedOpt2);
    p_param.push(that.selectedFilter2);
    p_param.push(that.selectedFromValue2);
    p_param.push(that.selectedToValue2);
    let excel = [];

    let report_no = reportInfo["CODE"];
    let report_path = reportInfo.REPORT_PATH;
    let report_extension = reportInfo.EXTENSION;
    let report_name = `${reportInfo.NAME}.xlsx`;
    let startColDate = 5;
    let hiddenCols = [];  
    let colHiddens = [];
    let headerRows=[];
    let headerRow1 = ["No", "Department", "Group", "Emp ID","Full Name","Join Date"];
    let startDate = moment(String(that.selectedFromDate2), "YYYYMMDD");
    let endDate = (moment(String(that.selectedToDate2), "YYYYMMDD")).add(1, 'days');
    let reportHeader = {};
    let i=0;
    var today = new Date();
    reportHeader = {
      USER_ID: that.user.USER_ID,
      FROM_DT: that.selectedFromDate2 ,
      TO_DT: that.selectedToDate2,
      REPORT_DT: String(today.getDate()).padStart(2, '0') + '/' + String(today.getMonth() + 1).padStart(2, '0') + '/' + today.getFullYear()
    };

    for (let d = startDate; d.isBefore(endDate); d.add(1, 'days')) {
        headerRow1.push(d.format("DD/MM/YYYY"));
        headerRow1.push("");
        headerRow1.push("");
        headerRow1.push("");
        headerRow1.push("");
        i++;
    }
    for(; i < 31; i++) {
        headerRow1 = headerRow1.concat(["","","","",""]);
        colHiddens = colHiddens.concat(  [ 6+(i*5+1), 6+(i*5+2), 6+(i*5+3) , 6+(i*5+4), 6+(i*5+5)  ] );
    }
    headerRow1 = headerRow1.concat(["Total","","","",""]);

    headerRows.push(headerRow1);
   
    let exceljs =  require("@/plugins/exceljs.js");
    if(!!exceljs) {
        exceljs = exceljs.default;
    }

    await exceljs.createWorkbook(that, reportInfo.REPORT_PATH);
    // let worksheet = exceljs.worksheet();
    switch (report_no) {
        case "20": {
            excel = [
                {
                sheet: 1,
                insertRange: [
                { range: "A1:S4", data: reportHeader , dateColumns: ["FROM_DT","TO_DT"]}, //header
                ],
                insertHeader: [
                    {
                        startRow: 5,
                        column: "FK", // cái này để copy cell+style ra cho nhung cot phia sau
                        merge: "cross",// merge co 3 gia tri: row (merge tren cung 1 dong), column (merge tren cung 1 cot), cross(merge tren duoi theo cot truoc )
                        data: headerRows
                        
                    },
                ],
                insertRows: [
                    {
                        startRow: 7,
                        proc: "HR_RPT_1211040_WT_OT_WS",
                        params: p_param,
                        dateColumns: ["JOIN_DT"],
                        stringColumns: ["EMP_ID"],
                        total: [
                            {   column: "NO", isDisplay: true, type: "SUM", text: "Grand total: $[1] employee(s) ", isMerge: true, isGrandTotal: true , font: {  size: 12, bold: true } , merge: { from: 1, to: 6 }
                                , fill: {
                                    type: 'pattern',
                                    pattern:'solid',
                                    fgColor:{ argb: 'CCFFFF'},
                                    bgColor:{ argb: 'CCFFFF'}
                            } 
                            }, //"Grand total: $[1] record(s) "
                          ]
                    },
                ],
                hideColumns: colHiddens
                },
            ];

            break;
        }
    }
    
        const res = await that.$axios.$get("/dso/makereport", {
            responseType: "blob",
            params: { template: report_path, excel: JSON.stringify(excel) },
        });
        if (res && res.size > 0) {
            that._ExcelSaveAs(res, report_name);
        } else {
            that.showNotification(
            "danger",
            that.$t("fail_to_export_report"),
            "",
            4000
            );
        }

};
let printWTOTMonth = async( that, reportInfo,selecteds) => {
    let p_param = [...selecteds];
    p_param.push(that.selectedMonth2);
    p_param.push(that.selectedOpt2);
    p_param.push(that.selectedFilter2);
    p_param.push(that.selectedFromValue2);
    p_param.push(that.selectedToValue2);
    let excel = [];
    let report_no = reportInfo["CODE"];
    let report_path = reportInfo.REPORT_PATH;
    let report_extension = reportInfo.EXTENSION;
    let report_name = `${reportInfo.NAME}.xlsx`;
    let startColDate = 5;
    let hiddenCols = [];  
    let colHiddens = [];
    let headerRows=[];
    let headerRow1 = ["No", "Department", "Group", "Emp ID","Full Name","Join Date"];
    let startDate = moment(String(that.selectedFromDate2), "YYYYMMDD");
    let endDate = (moment(String(that.selectedToDate2), "YYYYMMDD")).add(1, 'days');
    let reportHeader = {};
    let i=0;
    var today = new Date();
    reportHeader = {
        USER_ID: that.user.USER_ID,
        FROM_DT: that.selectedFromDate2 ,
        TO_DT: that.selectedToDate2,
        REPORT_DT: String(today.getDate()).padStart(2, '0') + '/' + String(today.getMonth() + 1).padStart(2, '0') + '/' + today.getFullYear()
      };
    

    for (let d = startDate; d.isBefore(endDate); d.add(1, 'days')) {
        headerRow1.push(d.format("D"));
        headerRow1.push("");
        headerRow1.push("");
        headerRow1.push("");
        headerRow1.push("");
        i++;
    }
    for(; i < 31; i++) {
        headerRow1 = headerRow1.concat(["","","","",""]);
        colHiddens = colHiddens.concat(  [ 6+(i*5+1), 6+(i*5+2), 6+(i*5+3) , 6+(i*5+4), 6+(i*5+5)  ] );
    }
    headerRow1 = headerRow1.concat(["Total","","","",""]);

    headerRows.push(headerRow1);

    
    // for (let d = startDate; d.isBefore(endDate); d.add(1, 'days')) {
    //     reportHeader["A"+ i] = d.format("D");
    //     ++i;
    // }
    // //header : hide columns
    // for (let j = i-1; j < 31; j++) {
    //     hiddenCols.push(j + startColDate);
    // }

    let exceljs =  require("@/plugins/exceljs.js");
    if(!!exceljs) {
        exceljs = exceljs.default;
    }

    await exceljs.createWorkbook(that, reportInfo.REPORT_PATH);
    // let worksheet = exceljs.worksheet();
    switch (report_no) {
        case "21": {
            
            excel = [
                {
                sheet: 1,
                    insertRange: [
                    { range: "A5:FK5", data: reportHeader }, 
                    { range: "A3:FK3", proc: "hr_rpt_1030050_company_info", params: [that.selectedCompany, that.selectedMonth2] },
                    ],
                    insertHeader: [
                        {
                            startRow: 5,
                            column: "FK", // cái này để copy cell+style ra cho nhung cot phia sau
                            merge: "cross",// merge co 3 gia tri: row (merge tren cung 1 dong), column (merge tren cung 1 cot), cross(merge tren duoi theo cot truoc )
                            data: headerRows
                            
                        },
                    ],
                    insertRows: [
                        {
                            startRow: 7,
                            proc: "HR_RPT_1211040_WT_OT_WS_MONTH",
                            params: p_param,
                            dateColumns: ["JOIN_DT"],
                            stringColumns: ["EMP_ID"],
                            total: [
                                {   column: "NO", isDisplay: true, type: "SUM", text: "Grand total: $[1] employee(s) ", isMerge: true, isGrandTotal: true , font: {  size: 12, bold: true } , merge: { from: 1, to: 6 }
                                    , fill: {
                                        type: 'pattern',
                                        pattern:'solid',
                                        fgColor:{ argb: 'CCFFFF'},
                                        bgColor:{ argb: 'CCFFFF'}
                                } 
                                }, //"Grand total: $[1] record(s) "
                              ]
                        },
                    ],
                hideColumns: colHiddens
                },
            ];

            break;
        }
    }
    
        const res = await that.$axios.$get("/dso/makereport", {
            responseType: "blob",
            params: { template: report_path, excel: JSON.stringify(excel) },
        });
        if (res && res.size > 0) {
            that._ExcelSaveAs(res, report_name);
        } else {
            that.showNotification(
            "danger",
            that.$t("fail_to_export_report"),
            "",
            4000
            );
        }

};
let printWorkingSumarry = async( that, reportInfo,selecteds) => {
    let p_param = [...selecteds];
    p_param.push(that.selectedMonth2);
    p_param.push(that.selectedFromDate2);
    p_param.push(that.selectedToDate2);
    p_param.push(that.selectedOpt2);
    p_param.push(that.selectedFilter2);
    p_param.push(that.selectedFromValue2);
    p_param.push(that.selectedToValue2);
    let excel = [];

    let report_no = reportInfo["CODE"];
    let report_path = reportInfo.REPORT_PATH;
    let report_extension = reportInfo.EXTENSION;
    let report_name = `${reportInfo.NAME}.xlsx`;
    let startDate = moment(String(that.selectedFromDate2), "YYYYMMDD");
    let endDate = (moment(String(that.selectedToDate2), "YYYYMMDD")).add(1, 'days');
    let reportHeader = {};
    let i=0;
    var today = new Date();
    reportHeader = {
      USER_ID: that.user.USER_ID,
      FROM_DT: that.selectedFromDate2 ,
      TO_DT: that.selectedToDate2,
      REPORT_DT: String(today.getDate()).padStart(2, '0') + '/' + String(today.getMonth() + 1).padStart(2, '0') + '/' + today.getFullYear()
    };
    let exceljs =  require("@/plugins/exceljs.js");
    if(!!exceljs) {
        exceljs = exceljs.default;
    }

    await exceljs.createWorkbook(that, reportInfo.REPORT_PATH);
    // let worksheet = exceljs.worksheet();
    switch (report_no) {
        case "22": {
            excel = [
                {
                sheet: 1,
                insertRange: [
                { range: "A2:N3", data: reportHeader , dateColumns: ["FROM_DT","TO_DT"]}, //header
                ],
                insertRows: [
                    {
                        startRow: 7,
                        proc: "HR_RPT_1211040_WORKING_SUMARRY",
                        params: p_param,
                        dateColumns: ["JOIN_DT"],
                        stringColumns: ["EMP_ID"],
                        total: [
                            {   column: "NO", isDisplay: true, type: "SUM", text: "Grand total: $[1] employee(s) ", isMerge: true, isGrandTotal: true , font: {  size: 12, bold: true } , merge: { from: 1, to: 6 }
                            //     , fill: {
                            //         type: 'pattern',
                            //         pattern:'solid',
                            //         fgColor:{ argb: 'CCFFFF'},
                            //         bgColor:{ argb: 'CCFFFF'}
                            // } 
                            }, //"Grand total: $[1] record(s) "
                          ]
                    },
                ],
                },
            ];
            console.log("excel",excel);
            break;
        }
    }
    
        const res = await that.$axios.$get("/dso/makereport", {
            responseType: "blob",
            params: { template: report_path, excel: JSON.stringify(excel) },
        });
        if (res && res.size > 0) {
            that._ExcelSaveAs(res, report_name);
        } else {
            that.showNotification(
            "danger",
            that.$t("fail_to_export_report"),
            "",
            4000
            );
        }

};

export default _1211040_woosung;