let allowanceList = null;
let unfixAllowanceList = null;
let companyList = [];
let company = null;
let companyjs = null;
let reportList = [];
let reportDefault = [];
let reportCompany = [];

let _1031050 = {
    getReportList: async(that, audit_yn = undefined) =>{
        await prepareCommonData(that);
        let reports = [];
        reportDefault = await that._getReportList(that.menu_id, '', that.selectedCompany);
        
        //check xem co file report js cho cty ko
        try {
            companyjs = require(`@/report/10/31/${(company["PARTNER_ID"]?.toLowerCase())}/${that.menu_id }_${(company["PARTNER_ID"]?.toLowerCase()) }.js`); //report/10/31/ghs/1031050_ghs.js
            companyjs =  companyjs.default; //do export ra default;
            reportCompany = await companyjs.getReportList(that);
        } catch (e) {
            console.log('11',e.message);
        }

        reports = [...reportDefault, ...reportCompany];
        reportList = [...reports];
        reportList = reportList?.filter(q => q.USE_YN == 'Y');

        if (audit_yn == "Y") {
          reportList = reportList?.filter(q => q.EXCEL_JSON && ( JSON.parse(q.EXCEL_JSON)["audit_yn"] == "Y" ) );
          reportList = reportList.map(q => {
            let options = JSON.parse(q.EXCEL_JSON);
            if(options["audit_path"]) {
              q.REPORT_PATH = options["audit_path"];
            }
            return q;
          });
        }

		    reportList = reportList.sort((a, b) => (Number(a.CODE) > Number(b.CODE)) ? 1 : -1)
        return reportList;
    }, 

    print: async(that, selectedReport) => {

        that.salaryStatus = that.$t("making_report");
        that.showButton(true);
        let p_param = [that.selectedOrg, that.selectedStatus, that.selectedType, that.selectedEmpPK, that.selectedMonth, that.selectedPeriod, that.selectedMoney];
        let p_param_extra = [];
        let reportInfo = reportList.find(x => x.CODE === that.selectedReport);

        try {
            if( reportDefault.findIndex( q=> q.CODE == selectedReport)  >=0  && Number(selectedReport) < 20 ) { //report default
                switch(selectedReport) {
                    case "01": {
                        await excelPayroll( that, reportInfo,p_param, p_param_extra)
                        break;
                    }
                    case "02": {
                        await excelPayrollSummary( that, reportInfo,p_param, p_param_extra)
                        break;
                    }
                    case "03": {
                        await excelPaymentByBank( that, reportInfo,p_param, p_param_extra)
                        break;
                    }
                    case "04": {
                        await excelPaymentByCash( that, reportInfo,p_param, p_param_extra)
                        break;
                    }
                    case "05": {
                        await excelInsurancePayment( that, reportInfo,p_param, p_param_extra)
                        break;
                    }
                    case "06": {
                        await excelPersonalIncomeTax( that, reportInfo,p_param, p_param_extra)
                        break;
                    }
					case "07": {
                        await excelPayslip( that, reportInfo,p_param, p_param_extra)
                        break;
                    }
                }
            } else { // report cho cty
                await companyjs.print(that, selectedReport, reportInfo);
            }
            
        } catch(e) {
            console.log(e.message);
        } finally {
            that.showButton(false);
        }
    },


    
};

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

    companyList = await that._getCompany();
    company = companyList.find(x => x["PK"] === that.selectedCompany );
};

let excelPayroll= async(that, reportInfo, p_param, p_param_extra = null) => {
    let report_path = reportInfo.REPORT_PATH;
    let report_name = reportInfo.NAME+".xlsx";

    let exceljs =  require("@/plugins/exceljs.js");
    if(!!exceljs) {
        exceljs = exceljs.default;
    }
    await exceljs.createWorkbook(that, reportInfo.REPORT_PATH);

    let idxAllowFull = 11;
    let idxAllowCalc = 48;
    let idxUnfixAll  = 56;
	let hiddenCols = [];

	let dsoComp = {type: 'grid', selpro: 'HR_RPT_1030050_COMPANY_INFO', para: [that.selectedCompany, that.selectedMonth] };
	let dataComp = await that._dsoCall(dsoComp, 'select', false);

	dataComp = {...dataComp[0]};

	const dso = {type: 'list', selpro: 'HR_RPT_1030050_PAYROLL', para: [...p_param] };
	let _datas = await that._dsoCall(dso, 'select', false);


    for(let i = 1; i <= 8; i++) {
		let allowIdx = allowanceList.findIndex( x =>  Number(x.CODE.replace("A","")) == i);
		if(allowIdx >= 0) {
			let allow = allowanceList[allowIdx];

			if( allow.USE_YN === "Y" ) {
				dataComp["ALLOW"+ Number(allow.CODE.replace("A","")) + "_NM" ] = allow.NAME;
			} else {
				hiddenCols.push( idxAllowFull + i); 
				hiddenCols.push( idxAllowCalc + i); 
			}
		}
    }

    for(let i = 1; i <= 8; i++) {
        let allowIdx = unfixAllowanceList.findIndex( x =>  Number(x.CODE) == i);
        if(allowIdx >= 0) {
            let allow = unfixAllowanceList[allowIdx];

            if( allow.USE_YN === "Y" ) {
                dataComp["ALLOW_K"+ Number(allow.CODE)+"_NM"  ] = allow.NAME;
            } else {
                hiddenCols.push( idxUnfixAll + i); 
            }
        } else {
            hiddenCols.push( idxUnfixAll + i); 
        }
    }

	
	let startRow = 9;
	let totalRow = startRow + _datas.length;
	let totalData = {TOTAL_TEXT: "GRAND TOTAL"};

	let keys = Object.keys(_datas[0]);
	keys.forEach(key => {
		let vals = _datas.map( q =>  (  isNaN(q[key]) ||  q[key]== null  ) ? 0 :  q[key]  );
		let sumVal = Math.round(that._Total(vals)*100)/100;
		totalData[key] = sumVal;
	})

	dataComp.NET_AMT_VN = that._num2VieText(totalData.NET_AMT);

	exceljs.insertRange(that, "A1:CN14", dataComp);
	exceljs.insertRows(that,startRow, _datas);
	exceljs.insertRowData(that, totalRow, totalData);
	exceljs.setHideColumns(that,hiddenCols, true );



    exceljs.dowloadWorkbook(that, reportInfo.NAME + ".xlsx");
    that.salaryStatus = that.$t("complete");
    return;
};

let excelPayrollSummary = async ( that, reportInfo, p_param, p_param_extra = null ) => {
    let report_path = reportInfo.REPORT_PATH;
    let report_name = reportInfo.NAME+".xlsx";

    let hiddenCols = [];
    let startAllow1 = 6-1;
    let startAllowK = 21-1;
    let excel = [];
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
          { range: "A1:AP3", proc: "hr_rpt_1030050_company_info", params: [that.selectedCompany, that.selectedMonth]  },//header
        ],
        insertRows: [
          {   
            sequence: "break",
            startRow: 7, proc: "hr_rpt_1030050_payroll_summary", params: [...p_param] ,
            param_extra: [...p_param_extra],
            total: [
              {   column: "DIV", isDisplay: true, type: "SUM", text: that.$t("total") , isMerge: false, merge: { from: 1, to: 2 }   }, //"Total $[0]: $[1] record(s) "
              {   column: null, isDisplay: true, type: "SUM", text: that.$t("total"), isMerge: true, isGrandTotal: true , font: {  size: 15, bold: true } , merge: { from: 1, to: 2 }  }, //"Grand total: $[1] record(s) "
            ]
          }
        ],
        hideColumns: hiddenCols
      },
    ];

    const res = await that.$axios.$get('/dso/makereport', { responseType: "blob", params:{ template:  report_path ,excel: JSON.stringify(excel)  } }  );

    if(res && res.size > 0){
        that._ExcelSaveAs(res, report_name); 
        that.salaryStatus = that.$t("complete");
    } else {
        that.showNotification( "danger", that.$t("fail_to_export_report"), "", 4000 );
        that.salaryStatus = that.$t("fail_to_export_report");
    }
};

let excelPaymentByBank = async ( that, reportInfo, p_param, p_param_extra = null ) => {
    let report_path = reportInfo.REPORT_PATH;
    let report_name = reportInfo.NAME+".xlsx";


    let excel = [
      //sheet1
      {
        sheet: 1,
        insertRange: [
          { range: "A1:I21", proc: "hr_rpt_1030050_company_info", params:[that.selectedCompany, that.selectedMonth]   },//header
        ],
        insertRows: [
          {   
            sequence: "break",
            startRow: 11, proc: "hr_rpt_1030050_payment_bank", params: [...p_param] ,
            param_extra: [...p_param_extra],
            total: [
              {   column: null, isDisplay: true, type: "SUM", text: that.$t("TOTAL"), isMerge: true, isGrandTotal: true , font: {  size: 15, bold: true } , merge: { from: 1, to: 4 }  }, //"Grand total: $[1] record(s) "
            ]
          }
        ],
      },
    ];

    const res = await that.$axios.$get('/dso/makereport', { responseType: "blob", params:{ template:  report_path ,excel: JSON.stringify(excel)  } }  );

    if(res && res.size > 0){
        that._ExcelSaveAs(res, report_name); 
        that.salaryStatus = that.$t("complete");
    } else {
        that.showNotification( "danger", that.$t("fail_to_export_report"), "", 4000 );
        that.salaryStatus = that.$t("fail_to_export_report");
    }
};

let excelPaymentByCash = async ( that, reportInfo, p_param, p_param_extra = null ) => {
    let report_path = reportInfo.REPORT_PATH;
    let report_name = reportInfo.NAME+".xlsx";

    let excel = [
      //sheet1
      {
        sheet: 1,
        insertRange: [
          { range: "A1:F6", proc: "hr_rpt_1030050_company_info", params: [that.selectedCompany, that.selectedMonth]   },//header
        ],
        insertRows: [
          {   
            sequence: "break",
            startRow: 9, proc: "hr_rpt_1030050_payment_cash", params: [...p_param] , dateColumns: [ "JOIN_DT", "LEFT_DT" ],
            param_extra: [...p_param_extra],
            total: [
              {   column: null, isDisplay: true, type: "SUM", text: that.$t("total"), isMerge: true, isGrandTotal: true , font: {  size: 15, bold: true } , merge: { from: 1, to: 5 }  }, //"Grand total: $[1] record(s) "
            ]
          }
        ],
      },
    ];

    const res = await that.$axios.$get('/dso/makereport', { responseType: "blob", params:{ template:  report_path ,excel: JSON.stringify(excel)  } }  );

    if(res && res.size > 0){
        that._ExcelSaveAs(res, report_name); 
        that.salaryStatus = that.$t("complete");
    } else {
        that.showNotification( "danger", that.$t("fail_to_export_report"), "", 4000 );
        that.salaryStatus = that.$t("fail_to_export_report");
    }
};

let excelInsurancePayment = async ( that, reportInfo, p_param, p_param_extra = null)  => {
    let report_path = reportInfo.REPORT_PATH;
    let report_name = reportInfo.NAME+".xlsx";

    let excel = [
      //sheet1
      {
        sheet: 1,
        insertRange: [
          { range: "A1:O17", proc: "hr_rpt_1030050_company_info", params:  [that.selectedCompany, that.selectedMonth]  },//header
        ],
        insertRows: [
          {   
            sequence: "break",
            startRow: 9, proc: "hr_rpt_1030050_insurance", params: [...p_param], dateColumns: [ "JOIN_DT", "LEFT_DT" ] , stringColumns: [ "EMP_ID", "ID_NUM","OLD_ID", "E_ACCOUNT" ],
            param_extra: [...p_param_extra],
            total: [
              {   column: null, isDisplay: true, type: "SUM", text: that.$t("total"), isMerge: true, isGrandTotal: true , font: {  size: 15, bold: true } , merge: { from: 1, to: 5 }  }, //"Grand total: $[1] record(s) "
            ]
          }
        ],
      },
    ];
    
    const res = await that.$axios.$get('/dso/makereport', { responseType: "blob", params:{ template:  report_path ,excel: JSON.stringify(excel)  } }  );

    if(res && res.size > 0){
        that._ExcelSaveAs(res, report_name); 
        that.salaryStatus = that.$t("complete");
    } else {
        that.showNotification( "danger", that.$t("fail_to_export_report"), "", 4000 );
        that.salaryStatus = that.$t("fail_to_export_report");
    }

};

let excelPersonalIncomeTax = async ( that, reportInfo, p_param, p_param_extra = null ) => {
    let report_path = reportInfo.REPORT_PATH;
    let report_name = reportInfo.NAME+".xlsx";

    let excel = [
      //sheet1
      {
        sheet: 1,
        insertRange: [
          { range: "A1:P19", proc: "hr_rpt_1030050_company_info", params: [that.selectedCompany, that.selectedMonth]   },//header
        ],
        insertRows: [
          {   
            sequence: "break",
            startRow: 9, proc: "hr_rpt_1030050_per_tax", params: [...p_param], stringColumns: [ "EMP_ID", "ID_NUM","OLD_ID", "E_ACCOUNT" ],
            param_extra: [...p_param_extra],
            total: [
                {   column: null, isDisplay: true, type: "SUM", text: that.$t("total"), isMerge: true, isGrandTotal: true 
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

    const res = await that.$axios.$get('/dso/makereport', { responseType: "blob", params:{ template:  report_path ,excel: JSON.stringify(excel)  } }  );

    if(res && res.size > 0){
        that._ExcelSaveAs(res, report_name); 
        that.salaryStatus = that.$t("complete");
    } else {
        that.showNotification( "danger", that.$t("fail_to_export_report"), "", 4000 );
        that.salaryStatus = that.$t("fail_to_export_report");
    }
};

let excelPayslip = async( that, reportInfo,p_param, p_param_extra) =>{
	let report_path = reportInfo.REPORT_PATH;
    let report_name = reportInfo.NAME+".xlsx";

	let excel = [
		{
			sheet: 1,
			insertRange2: [ 
				{ range: "A1:I53", pageBreak: true, dataPerPage: 1 , proc: "hr_rpt_1030050_PAYSLIP", params: [...p_param],param_extra: [...p_param_extra], dateColumns: [ ] , stringColumns: [ "EMP_ID", "ID_NUM","OLD_ID", "ACCOUNT" ], },  
			],
		},
	];

	const res = await that.$axios.$get('/dso/makereport', { responseType: "blob", params:{ template:  report_path ,excel: JSON.stringify(excel)  } }  );

    if(res && res.size > 0){
        that._ExcelSaveAs(res, report_name); 
        that.salaryStatus = that.$t("complete");
    } else {
        that.showNotification( "danger", that.$t("fail_to_export_report"), "", 4000 );
        that.salaryStatus = that.$t("fail_to_export_report");
    }

}

export default _1031050;