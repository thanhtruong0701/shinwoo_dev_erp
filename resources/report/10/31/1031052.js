let allowanceList = null;
let unfixAllowanceList = null;
let companyList = [];
let company = null;
let companyjs = null;
let reportList = [];
let reportDefault = [];
let reportCompany = [];

let _1031052 = {
  getReportList: async (that) => {
    await prepareCommonData(that);
    let reports = [];
    reportDefault = await that._getReportList(that.menu_id, '', that.selectedCompany);

    //check xem co file report js cho cty ko
    try {
      companyjs = require(`@/report/10/31/${(company["PARTNER_ID"]?.toLowerCase())}/${that.menu_id}_${(company["PARTNER_ID"]?.toLowerCase())}.js`); //report/10/31/ghs/1031050_ghs.js
      companyjs = companyjs.default; //do export ra default;
      reportCompany = await companyjs.getReportList(that);
    } catch (e) {
    }
    reports = [...reportDefault, ...reportCompany];
    reportList = [...reports];
    //reportList = reportList.sort((a, b) => (Number(a.CODE) > Number(b.CODE)) ? 1 : -1)
    return reportList;
  },

  print: async (that, selectedReport) => {

    that.salaryStatus = that.$t("making_report");
    that.showButton(true);
    let p_param = [that.selectedOrg, that.selectedType, that.selectedEmpPK, that.selectedMonth, that.selectedPeriod];
    let p_param_extra = [];
    let reportInfo = reportList.find(x => x.CODE === that.selectedReport);

    console.log("reportInfo", reportInfo);

    try {
      if (reportDefault.findIndex(q => q.CODE == selectedReport) >= 0 && Number(selectedReport) < 20) { //report default
        switch (selectedReport) {
          case "01": {
            if(reportInfo.VERSION == 1) {
              await excelPayroll_v1(that, reportInfo, p_param, p_param_extra)
            } else {
              await excelPayroll(that, reportInfo, p_param, p_param_extra)
            }
            
            break;
          }
          case "02": {
            await excelPayrollSummary(that, reportInfo, p_param, p_param_extra)
            break;
          }
          case "03": {
            await excelPaymentByBank(that, reportInfo, p_param, p_param_extra)
            break;
          }
          case "04": {
            await excelPaymentByCash(that, reportInfo, p_param, p_param_extra)
            break;
          }
          case "05": {
            await excelInsurancePayment(that, reportInfo, p_param, p_param_extra)
            break;
          }
          case "06": {
            await excelPersonalIncomeTax(that, reportInfo, p_param, p_param_extra)
            break;
          }
          case "07": {
            await excelPayslip(that, reportInfo, p_param, p_param_extra)
            break;
          }
          case "08": {
            await excelPayroll_t1(that, reportInfo, p_param, p_param_extra)
            
            break;
          }
        }
      } else { // report cho cty
        await companyjs.print(that, selectedReport);
      }

    } catch (e) {
      console.log(e.message);
    } finally {
      that.showButton(false);
    }
  },

  readExcel: async (that, selectedReport) => {
    let reportInfo = reportList.find(x => x.CODE === that.selectedReport);
    let headers = [];
    let _selPro = "";
    try {
      if (reportDefault.findIndex(q => q.CODE == selectedReport) >= 0 && Number(selectedReport) < 20) { //report default
        switch (selectedReport) {
          case "01": {
            headers = await readExcelPayroll(that, reportInfo)
            _selPro = reportInfo.VERSION == 1 ? "hr_rpt_1031052_payroll_v1" : "hr_rpt_1031052_payroll";
            break;
          }
          case "08": {
            headers = await readExcelPayroll_t1(that, reportInfo)
            _selPro = "hr_rpt_1031052_payroll_t1";
            break;
          }
        }
      } else { // report cho cty
        return await companyjs.readExcel(that, selectedReport);
      }
    } catch (e) {
      console.log(e.message);
    }

    return {
      header: headers,
      selpro: _selPro//"hr_rpt_1031052_payroll"
    };
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

let excelPayroll = async (that, reportInfo, p_param, p_param_extra = null) => {
  let report_path = reportInfo.REPORT_PATH;
  let report_name = reportInfo.NAME + ".xlsx";

  let exceljs = require("@/plugins/exceljs.js");
  if (!!exceljs) {
    exceljs = exceljs.default;
  }
  await exceljs.createWorkbook(that, reportInfo.REPORT_PATH);

  let idxAllowFull = 11;
  let idxAllowCalc = 48;
  let idxUnfixAll = 56;
  let hiddenCols = [];

  let dsoComp = { type: 'grid', selpro: 'HR_RPT_1030050_COMPANY_INFO', para: [that.selectedCompany, that.selectedMonth] };
  let dataComp = await that._dsoCall(dsoComp, 'select', false);

  dataComp = { ...dataComp[0] };

  const dso = { type: 'list', selpro: 'hr_rpt_1031052_payroll', para: [...p_param] };
  let _datas = await that._dsoCall(dso, 'select', false);


  for (let i = 1; i <= 8; i++) {
    let allowIdx = allowanceList.findIndex(x => Number(x.CODE.replace("A", "")) == i);
    if (allowIdx >= 0) {
      let allow = allowanceList[allowIdx];

      if (allow.USE_YN === "Y") {
        dataComp["ALLOW" + Number(allow.CODE.replace("A", "")) + "_NM"] = allow.NAME;
      } else {
        hiddenCols.push(idxAllowFull + i);
        hiddenCols.push(idxAllowCalc + i);
      }
    }
  }

  for (let i = 1; i <= 8; i++) {
    let allowIdx = unfixAllowanceList.findIndex(x => Number(x.CODE) == i);
    if (allowIdx >= 0) {
      let allow = unfixAllowanceList[allowIdx];

      if (allow.USE_YN === "Y") {
        dataComp["ALLOW_K" + Number(allow.CODE) + "_NM"] = allow.NAME;
      } else {
        hiddenCols.push(idxUnfixAll + i);
      }
    } else {
      hiddenCols.push(idxUnfixAll + i);
    }
  }


  let startRow = 9;
  let totalRow = startRow + _datas.length;
  let totalData = { TOTAL_TEXT: "GRAND TOTAL" };

  let keys = Object.keys(_datas[0]);
  keys.forEach(key => {
    let vals = _datas.map(q => (isNaN(q[key]) || q[key] == null) ? 0 : q[key]);
    let sumVal = Math.round(that._Total(vals) * 100) / 100;
    totalData[key] = sumVal;
  })

  dataComp.NET_AMT_VN = that._num2VieText(totalData.NET_AMT);

  exceljs.insertRange(that, "A1:CN14", dataComp);
  exceljs.insertRows(that, startRow, _datas);
  exceljs.insertRowData(that, totalRow, totalData);
  exceljs.setHideColumns(that, hiddenCols, true);



  exceljs.dowloadWorkbook(that, reportInfo.NAME + ".xlsx");
  that.salaryStatus = that.$t("complete");
  return;
};

let excelPayroll_v1 = async (that, reportInfo, p_param, p_param_extra = null) => {
  let report_path = reportInfo.REPORT_PATH;
  let report_name = reportInfo.NAME + ".xlsx";
  report_path = reportInfo.REPORT_PATH.replace(".xlsx", "_v1.xlsx" ); 

  let exceljs = require("@/plugins/exceljs.js");
  if (!!exceljs) {
    exceljs = exceljs.default;
  }
  await exceljs.createWorkbook(that, report_path);
  let _worksheet = exceljs.worksheet();

  let idxAllowFull = 9;
  let idxAllowCalc = 61;
  let idxUnfixAll = 69;
  let hiddenCols = [];

  let dsoComp = { type: 'grid', selpro: 'HR_RPT_1030050_COMPANY_INFO', para: [that.selectedCompany, that.selectedMonth] };
  let dataComp = await that._dsoCall(dsoComp, 'select', false);

  dataComp = { ...dataComp[0] };

  const dso = { type: 'list', selpro: 'hr_rpt_1031052_payroll_v1', para: [...p_param] };
  let _datas = await that._dsoCall(dso, 'select', false);


  for (let i = 1; i <= 8; i++) {
    let allowIdx = allowanceList.findIndex(x => Number(x.CODE.replace("A", "")) == i);
    if (allowIdx >= 0) {
      let allow = allowanceList[allowIdx];

      if (allow.USE_YN === "Y") {
        dataComp["ALLOW" + Number(allow.CODE.replace("A", "")) + "_NM"] = {
          'richText': [
            {'font': {'bold': true},'text': allow.NAME+"\n"},
            {'font': {'bold': false},'text': allow.NAME_VI}
          ]
        };

        if(!(allow.CAL_TYPE == 2 || allow.CAL_TYPE == 4)) {
          hiddenCols.push(idxAllowCalc + i);
        }
      } else {
        hiddenCols.push(idxAllowFull + i);
        hiddenCols.push(idxAllowCalc + i);
      }
    }
  }

  let _hr0035 = await that._getCommonCode("HR0035", that.selectedCompany);
  for (let i = 1; i <= 8; i++) {
    let allowIdx = unfixAllowanceList.findIndex(x => Number(x.CODE) == i);
    if (allowIdx >= 0) {
      let allow = unfixAllowanceList[allowIdx];
      let _allowUnfix = _hr0035.find(x => x.CODE == allow.CODE);

      if (allow.USE_YN === "Y") {
        dataComp["ALLOW_K" + Number(allow.CODE) + "_NM"] = {
          'richText': [
            {'font': {'bold': true},'text': allow.NAME+"\n"},
            {'font': {'bold': false},'text': allow.NAME_VI}
          ]
        };
        //an cac cot fix allow tinh toan neu co tinh bang unfix
        if(_allowUnfix.NUM1 != null ) {
          let _allowIdx = allowanceList.findIndex(x => x.CODE == _allowUnfix.NUM1);
          if(_allowIdx >= 0) {
            hiddenCols.push(idxAllowCalc + _allowIdx + 1);
          }
        }

      } else {
        hiddenCols.push(idxUnfixAll + i);
      }
    } else {
      hiddenCols.push(idxUnfixAll + i);
    }
  }

  let startRow = 9;
  let rowIdx = startRow;
  let idx = 1;
  let totalRow = -1;
  let totalData = { TOTAL_TEXT: "GRAND TOTAL" };

  let keys = Object.keys(_datas[0]);
  keys.forEach(key => {
    let vals = _datas.map(q => (isNaN(q[key]) || q[key] == null) ? 0 : q[key]);
    let sumVal = Math.round(that._Total(vals) * 100) / 100;
    totalData[key] = sumVal;
  })

  dataComp.NET_AMT_VN = that._num2VieText(totalData.NET_AMT);

  var groups = Array.from(new Set(Array.from(_datas, x =>  JSON.stringify({key: x["DEPT_PK"], name: x["DIV"]})  )));
  
  //tao ra array temps de tao ra so dong excel tuong ung
  var _temps = [ ..._datas.map(() => ({})), ...groups.map(() => ({}))  ];
  totalRow = startRow + _temps.length;
  exceljs.insertRange(that, "A1:CS14", dataComp);

  //insert dong rong trc
  exceljs.insertRows(that, startRow, _temps, false);

  //insert data
  groups.forEach(group => {
    let _groupTmp = JSON.parse(group);

    let groupDatas = _datas.filter(x => x["DEPT_PK"] == _groupTmp.key);

    for (let i = 0; i < groupDatas.length; i++) {
      let data = groupDatas[i];
      exceljs.insertRowData(that, rowIdx, data, idx++);
      rowIdx++;
    }

    //total group 
    let _totalData = {NO: "TOTAL"};
    let stringCols = ["EMP_ID", "FULL_NAME", "POS_TYPE", "DIV", "JOIN_DT", "LEFT_DT", "ACCOUNT", "TAX_CODE", "PERSON_ID"];
    keys.forEach(key => {
      let vals = groupDatas.map(q => (isNaN(q[key]) || q[key] == null) ? 0 : q[key]);
      let sumVal = Math.round(that._Total(vals) * 100) / 100;

      if(!stringCols.includes(key)) { _totalData[key] = sumVal; } 
      else { _totalData[key] = ""; }
    });

   

    try { 
      _worksheet.mergeCells(rowIdx , 1, rowIdx, 7); 
      _worksheet.unMergeCells(rowIdx , 1, rowIdx, 7);
      _worksheet.getCell(rowIdx , 1).alignment = { vertical: 'middle', horizontal: 'left' };
    } catch(ee){ }

    //to mau 
    let cells = exceljs.getCells(that, rowIdx, 1, 104);
    cells.forEach( (c, idx)=> {
      c.style.font = { bold: true, size: 12, name:  "Times New Roman"}; 
      c.style.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'bdcfff' },  bgColor: { argb: 'bdcfff' } }
    } );

    exceljs.insertRowData(that, rowIdx, _totalData, "TOTAL " + _groupTmp.name);

    rowIdx++;
  });

  exceljs.insertRowData(that, totalRow, totalData);

  exceljs.setHideColumns(that, hiddenCols, true);



  exceljs.dowloadWorkbook(that, reportInfo.NAME + ".xlsx");
  that.salaryStatus = that.$t("complete");
  return;
};



let excelPayroll_t1 = async (that, reportInfo, p_param, p_param_extra = null) => {
  let report_path = reportInfo.REPORT_PATH;
  let report_name = reportInfo.NAME + ".xlsx";

  let exceljs = require("@/plugins/exceljs.js");
  if (!!exceljs) {
    exceljs = exceljs.default;
  }
  await exceljs.createWorkbook(that, report_path);
  let _worksheet = exceljs.worksheet();

  let idxAllowFull = 9;
  let idxAllowCalc = 61;
  let idxUnfixAll = 69;
  let hiddenCols = [];

  let dsoComp = { type: 'grid', selpro: 'HR_RPT_1030050_COMPANY_INFO', para: [that.selectedCompany, that.selectedMonth] };
  let dataComp = await that._dsoCall(dsoComp, 'select', false);

  dataComp = { ...dataComp[0] };

  const dso = { type: 'list', selpro: 'hr_rpt_1031052_payroll_t1', para: [...p_param] };
  let _datas = await that._dsoCall(dso, 'select', false);


  for (let i = 1; i <= 8; i++) {
    let allowIdx = allowanceList.findIndex(x => Number(x.CODE.replace("A", "")) == i);
    if (allowIdx >= 0) {
      let allow = allowanceList[allowIdx];

      if (allow.USE_YN === "Y") {
        dataComp["ALLOW" + Number(allow.CODE.replace("A", "")) + "_NM"] = {
          'richText': [
            {'font': {'bold': true},'text': allow.NAME+"\n"},
            {'font': {'bold': false},'text': allow.NAME_VI}
          ]
        };

        if(!(allow.CAL_TYPE == 2 || allow.CAL_TYPE == 4)) {
          hiddenCols.push(idxAllowCalc + i);
        }
      } else {
        hiddenCols.push(idxAllowFull + i);
        hiddenCols.push(idxAllowCalc + i);
      }
    }
  }

  let _hr0035 = await that._getCommonCode("HR0035", that.selectedCompany);
  for (let i = 1; i <= 8; i++) {
    let allowIdx = unfixAllowanceList.findIndex(x => Number(x.CODE) == i);
    if (allowIdx >= 0) {
      let allow = unfixAllowanceList[allowIdx];
      let _allowUnfix = _hr0035.find(x => x.CODE == allow.CODE);

      if (allow.USE_YN === "Y") {
        dataComp["ALLOW_K" + Number(allow.CODE) + "_NM"] = {
          'richText': [
            {'font': {'bold': true},'text': allow.NAME+"\n"},
            {'font': {'bold': false},'text': allow.NAME_VI}
          ]
        };
        //an cac cot fix allow tinh toan neu co tinh bang unfix
        if(_allowUnfix.NUM1 != null ) {
          let _allowIdx = allowanceList.findIndex(x => x.CODE == _allowUnfix.NUM1);
          if(_allowIdx >= 0) {
            hiddenCols.push(idxAllowCalc + _allowIdx + 1);
          }
        }

      } else {
        hiddenCols.push(idxUnfixAll + i);
      }
    } else {
      hiddenCols.push(idxUnfixAll + i);
    }
  }

  let startRow = 9;
  let rowIdx = startRow;
  let idx = 1;
  let totalRow = -1;
  let totalData = { TOTAL_TEXT: "GRAND TOTAL" };

  let keys = Object.keys(_datas[0]);
  keys.forEach(key => {
    let vals = _datas.map(q => (isNaN(q[key]) || q[key] == null) ? 0 : q[key]);
    let sumVal = Math.round(that._Total(vals) * 100) / 100;
    totalData[key] = sumVal;
  })

  dataComp.NET_AMT_VN = that._num2VieText(totalData.NET_AMT);

  var groups = Array.from(new Set(Array.from(_datas, x =>  JSON.stringify({key: x["DEPT_PK"], name: x["DIV"]})  )));
  
  //tao ra array temps de tao ra so dong excel tuong ung
  var _temps = [ ..._datas.map(() => ({})), ...groups.map(() => ({}))  ];
  totalRow = startRow + _temps.length;

  exceljs.insertRange(that, "A1:CS14", dataComp);

  //insert dong rong trc
  exceljs.insertRows(that, startRow, _temps, false);

  //insert data
  groups.forEach(group => {
    let _groupTmp = JSON.parse(group);

    let groupDatas = _datas.filter(x => x["DEPT_PK"] == _groupTmp.key);

    for (let i = 0; i < groupDatas.length; i++) {
      let data = groupDatas[i];
      exceljs.insertRowData(that, rowIdx, data, idx++);
      rowIdx++;
    }

    //total group 
    let _totalData = {NO: "TOTAL"};
    let stringCols = ["EMP_ID", "FULL_NAME", "POS_TYPE", "DIV", "JOIN_DT", "LEFT_DT", "ACCOUNT", "TAX_CODE", "PERSON_ID"];
    keys.forEach(key => {
      let vals = groupDatas.map(q => (isNaN(q[key]) || q[key] == null) ? 0 : q[key]);
      let sumVal = Math.round(that._Total(vals) * 100) / 100;

      if(!stringCols.includes(key)) { _totalData[key] = sumVal; } 
      else { _totalData[key] = ""; }
    });

    try { 
      _worksheet.mergeCells(rowIdx , 1, rowIdx, 7); 
      _worksheet.unMergeCells(rowIdx , 1, rowIdx, 7);
      _worksheet.getCell(rowIdx , 1).alignment = { vertical: 'middle', horizontal: 'left' };
    } catch(ee){ }

    //to mau 
    let cells = exceljs.getCells(that, rowIdx, 1, 104);
    cells.forEach( (c, idx)=> {
      c.style.font = { bold: true, size: 12, name:  "Times New Roman"}; 
      c.style.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'bdcfff' },  bgColor: { argb: 'bdcfff' } }
    } );

    exceljs.insertRowData(that, rowIdx, _totalData, "TOTAL " + _groupTmp.name);

    rowIdx++;
  });

  
  exceljs.insertRowData(that, totalRow, totalData);
  exceljs.setHideColumns(that, hiddenCols, true);



  exceljs.dowloadWorkbook(that, reportInfo.NAME + ".xlsx");
  that.salaryStatus = that.$t("complete");
  return;
};

let excelPayrollSummary = async (that, reportInfo, p_param, p_param_extra = null) => {
  let report_path = reportInfo.REPORT_PATH;
  let report_name = reportInfo.NAME + ".xlsx";

  let hiddenCols = [];
  let startAllow1 = 6 - 1;
  let startAllowK = 21 - 1;
  let excel = [];
  let reportHeader = {};

  //setup allow col
  for (let i = 1; i <= 15; i++) {
    let allowIdx = allowanceList.findIndex(x => Number(x.CODE.replace("A", "")) == i);
    if (allowIdx >= 0) {
      let allow = allowanceList[allowIdx];

      if (allow.USE_YN === "Y") {
        reportHeader["A" + Number(allow.CODE.replace("A", "")) + "_LOCAL"] = allow.NAME;
      } else {
        hiddenCols.push(startAllow1 + i);
      }
    } else {
      hiddenCols.push(startAllow1 + i);
    }
  }

  for (let i = 1; i <= 8; i++) {
    let allowIdx = unfixAllowanceList.findIndex(x => Number(x.CODE) == i);
    if (allowIdx >= 0) {
      let allow = unfixAllowanceList[allowIdx];

      if (allow.USE_YN === "Y") {
        reportHeader["K" + Number(allow.CODE)] = allow.NAME;
      } else {
        hiddenCols.push(startAllowK + i);
      }
    } else {
      hiddenCols.push(startAllowK + i);
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
          startRow: 7, proc: "HR_RPT_1031052_PAYROLL_SUMMARY", params: [...p_param],
          param_extra: [...p_param_extra],
          total: [
            { column: "DIV", isDisplay: true, type: "SUM", text: that.$t("total"), isMerge: false, merge: { from: 1, to: 2 } }, //"Total $[0]: $[1] record(s) "
            { column: null, isDisplay: true, type: "SUM", text: that.$t("total"), isMerge: true, isGrandTotal: true, font: { size: 15, bold: true }, merge: { from: 1, to: 2 } }, //"Grand total: $[1] record(s) "
          ]
        }
      ],
      hideColumns: hiddenCols
    },
  ];

  const res = await that.$axios.$get('/dso/makereport', { responseType: "blob", params: { template: report_path, excel: JSON.stringify(excel) } });

  if (res && res.size > 0) {
    that._ExcelSaveAs(res, report_name);
    that.salaryStatus = that.$t("complete");
  } else {
    that.showNotification("danger", that.$t("fail_to_export_report"), "", 4000);
    that.salaryStatus = that.$t("fail_to_export_report");
  }
};

let excelPaymentByBank = async (that, reportInfo, p_param, p_param_extra = null) => {
  let report_path = reportInfo.REPORT_PATH;
  let report_name = reportInfo.NAME + ".xlsx";


  let excel = [
    //sheet1
    {
      sheet: 1,
      insertRange: [
        { range: "A1:I21", proc: "hr_rpt_1030050_company_info", params: [that.selectedCompany, that.selectedMonth] },//header
      ],
      insertRows: [
        {
          sequence: "break",
          startRow: 11, proc: "hr_rpt_1031052_payment_bank", params: [...p_param],
          param_extra: [...p_param_extra],
          total: [
            { column: null, isDisplay: true, type: "SUM", text: that.$t("TOTAL"), isMerge: true, isGrandTotal: true, font: { size: 15, bold: true }, merge: { from: 1, to: 4 } }, //"Grand total: $[1] record(s) "
          ]
        }
      ],
    },
  ];

  const res = await that.$axios.$get('/dso/makereport', { responseType: "blob", params: { template: report_path, excel: JSON.stringify(excel) } });

  if (res && res.size > 0) {
    that._ExcelSaveAs(res, report_name);
    that.salaryStatus = that.$t("complete");
  } else {
    that.showNotification("danger", that.$t("fail_to_export_report"), "", 4000);
    that.salaryStatus = that.$t("fail_to_export_report");
  }
};

let excelPaymentByCash = async (that, reportInfo, p_param, p_param_extra = null) => {
  let report_path = reportInfo.REPORT_PATH;
  let report_name = reportInfo.NAME + ".xlsx";

  let excel = [
    //sheet1
    {
      sheet: 1,
      insertRange: [
        { range: "A1:F6", proc: "hr_rpt_1030050_company_info", params: [that.selectedCompany, that.selectedMonth] },//header
      ],
      insertRows: [
        {
          sequence: "break",
          startRow: 9, proc: "HR_RPT_1031052_PAYMENT_CASH", params: [...p_param], dateColumns: ["JOIN_DT", "LEFT_DT"],
          param_extra: [...p_param_extra],
          total: [
            { column: null, isDisplay: true, type: "SUM", text: that.$t("total"), isMerge: true, isGrandTotal: true, font: { size: 15, bold: true }, merge: { from: 1, to: 5 } }, //"Grand total: $[1] record(s) "
          ]
        }
      ],
    },
  ];

  const res = await that.$axios.$get('/dso/makereport', { responseType: "blob", params: { template: report_path, excel: JSON.stringify(excel) } });

  if (res && res.size > 0) {
    that._ExcelSaveAs(res, report_name);
    that.salaryStatus = that.$t("complete");
  } else {
    that.showNotification("danger", that.$t("fail_to_export_report"), "", 4000);
    that.salaryStatus = that.$t("fail_to_export_report");
  }
};

let excelInsurancePayment = async (that, reportInfo, p_param, p_param_extra = null) => {
  let report_path = reportInfo.REPORT_PATH;
  let report_name = reportInfo.NAME + ".xlsx";

  let excel = [
    //sheet1
    {
      sheet: 1,
      insertRange: [
        { range: "A1:O17", proc: "hr_rpt_1030050_company_info", params: [that.selectedCompany, that.selectedMonth] },//header
      ],
      insertRows: [
        {
          sequence: "break",
          startRow: 9, proc: "hr_rpt_1031052_insurance", params: [...p_param], dateColumns: ["JOIN_DT", "LEFT_DT"], stringColumns: ["EMP_ID", "ID_NUM", "OLD_ID", "E_ACCOUNT"],
          param_extra: [...p_param_extra],
          total: [
            { column: null, isDisplay: true, type: "SUM", text: that.$t("total"), isMerge: true, isGrandTotal: true, font: { size: 15, bold: true }, merge: { from: 1, to: 5 } }, //"Grand total: $[1] record(s) "
          ]
        }
      ],
    },
  ];

  const res = await that.$axios.$get('/dso/makereport', { responseType: "blob", params: { template: report_path, excel: JSON.stringify(excel) } });

  if (res && res.size > 0) {
    that._ExcelSaveAs(res, report_name);
    that.salaryStatus = that.$t("complete");
  } else {
    that.showNotification("danger", that.$t("fail_to_export_report"), "", 4000);
    that.salaryStatus = that.$t("fail_to_export_report");
  }

};

let excelPersonalIncomeTax = async (that, reportInfo, p_param, p_param_extra = null) => {
  let report_path = reportInfo.REPORT_PATH;
  let report_name = reportInfo.NAME + ".xlsx";

  let excel = [
    //sheet1
    {
      sheet: 1,
      insertRange: [
        { range: "A1:P19", proc: "hr_rpt_1030050_company_info", params: [that.selectedCompany, that.selectedMonth] },//header
      ],
      insertRows: [
        {
          sequence: "break",
          startRow: 9, proc: "hr_rpt_1031052_per_tax", params: [...p_param], stringColumns: ["EMP_ID", "ID_NUM", "OLD_ID", "E_ACCOUNT"],
          param_extra: [...p_param_extra],
          total: [
            {
              column: null, isDisplay: true, type: "SUM", text: that.$t("total"), isMerge: true, isGrandTotal: true
              , font: { size: 13, bold: true }, merge: { from: 1, to: 3 }
              , fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '69cdff' },
                bgColor: { argb: '69cdff' }
              }
            }, //"Grand total: $[1] record(s) "
          ]
        }
      ],
    },
  ];

  const res = await that.$axios.$get('/dso/makereport', { responseType: "blob", params: { template: report_path, excel: JSON.stringify(excel) } });

  if (res && res.size > 0) {
    that._ExcelSaveAs(res, report_name);
    that.salaryStatus = that.$t("complete");
  } else {
    that.showNotification("danger", that.$t("fail_to_export_report"), "", 4000);
    that.salaryStatus = that.$t("fail_to_export_report");
  }
};

let excelPayslip = async (that, reportInfo, p_param, p_param_extra) => {
  let report_path = reportInfo.REPORT_PATH;
  let report_name = reportInfo.NAME + ".xlsx";

  let excel = [
    {
      sheet: 1,
      insertRange2: [
        { range: "A1:I53", pageBreak: true, dataPerPage: 1, proc: "hr_rpt_1031052_PAYSLIP", params: [...p_param], param_extra: [...p_param_extra], dateColumns: [], stringColumns: ["EMP_ID", "ID_NUM", "OLD_ID", "ACCOUNT"], },
      ],
    },
  ];

  const res = await that.$axios.$get('/dso/makereport', { responseType: "blob", params: { template: report_path, excel: JSON.stringify(excel) } });

  if (res && res.size > 0) {
    that._ExcelSaveAs(res, report_name);
    that.salaryStatus = that.$t("complete");
  } else {
    that.showNotification("danger", that.$t("fail_to_export_report"), "", 4000);
    that.salaryStatus = that.$t("fail_to_export_report");
  }

}

let readExcelPayroll = async (that, reportInfo) => {

  if(reportInfo.VERSION == 1) {
    return await readExcelPayroll_v1(that, reportInfo);
  }

  let exceljs = require("@/plugins/exceljs.js");
  if (!!exceljs) {
    exceljs = exceljs.default;
  }

  await exceljs.createWorkbook(that, reportInfo.REPORT_PATH);
  let reportHeader = {};
  let idxAllowFull = 11;
  let idxAllowCalc = 48;
  let idxUnfixAll = 56;
  let hiddenCols = [];
  let rowHeader = 7;
  let startRow = 9;

  for (let i = 1; i <= 8; i++) {
    let allowIdx = allowanceList.findIndex(x => Number(x.CODE.replace("A", "")) == i);
    if (allowIdx >= 0) {
      let allow = allowanceList[allowIdx];

      if (allow.USE_YN === "Y") {
        reportHeader["ALLOW" + Number(allow.CODE.replace("A", "")) + "_NM"] = allow.NAME;
      } else {
        hiddenCols.push(idxAllowFull + i);
        hiddenCols.push(idxAllowCalc + i);
      }
    }
  }

  for (let i = 1; i <= 8; i++) {
    let allowIdx = unfixAllowanceList.findIndex(x => Number(x.CODE) == i);
    if (allowIdx >= 0) {
      let allow = unfixAllowanceList[allowIdx];

      if (allow.USE_YN === "Y") {
        reportHeader["ALLOW_K" + Number(allow.CODE) + "_NM"] = allow.NAME;
      } else {
        hiddenCols.push(idxUnfixAll + i);
      }
    } else {
      hiddenCols.push(idxUnfixAll + i);
    }
  }

  exceljs.insertRange(that, "A5:CN7", reportHeader);


  let worksheet = exceljs.worksheet();

  let headerTitle = worksheet.getRow(rowHeader).values;
  let headerField = worksheet.getRow(startRow).values;



  let headers = [];
  let fixed = 3;
  let stringField = ["INDEX", "EMP_ID", "FULL_NAME", "SEX", "PERSONAL_ID", "DEPT_NM", "DIV_NM", "POS_TYPE", "ACCOUNT", "BIRTH_DT", "JOIN_DT"];
  let dateField = [];
  for (let i = 0; i < headerField.length; i++) {
    let _field = headerField[i];
    let _title = headerTitle[i];
    let _header = {};
    let existedIdx = headers.findIndex(q => q["field"] == _field);

    if (_field == undefined || _field == "" || existedIdx >= 0) continue;
    if (typeof _title == "object") {
      if (_title.hasOwnProperty("richText")) {
        let _titleTmp = "";
        _title.richText.forEach(q => {
          _titleTmp += q["text"] + " ";
        });
        _title = _titleTmp;
      }
    }

    _header = { title: _title ? _title + "" : _field, field: _field == "NO" ? "INDEX" : _field, type: "", editable: false, hidden: hiddenCols.includes(_field), isAdditionColumn: true };
    _header.type = stringField.includes(_field) ? 'text' : (dateField.includes(_field) ? "date" : "number");

    if (i <= fixed) {
      _header.fixed = true;
      //_header.visible = false;
    }

    if (_header.type == "number" && _field != "NO") {
      _header.format = "###,###,###.##";
      _header.summaryType = 'sum';
    }

    headers.push(_header);
  }

  return headers;

};

let readExcelPayroll_v1 = async (that, reportInfo) => {
  let report_path = reportInfo.REPORT_PATH;
  report_path = reportInfo.REPORT_PATH.replace(".xlsx", "_v1.xlsx" ); 

  let exceljs = require("@/plugins/exceljs.js");
  if (!!exceljs) {
    exceljs = exceljs.default;
  }

  await exceljs.createWorkbook(that, report_path);
  let worksheet = exceljs.worksheet();

  let dataComp = {};
  let hiddenCols = [];

  let header = [];
  let stringField = ["INDEX", "EMP_ID", "FULL_NAME", "SEX", "PERSONAL_ID", "DEPT_NM", "DIV_NM", "POS_TYPE", "ACCOUNT", "BIRTH_DT", "JOIN_DT"];
  let dateField = [];
  let fixed = 3;

  let idxAllowFull = 9;
  let idxAllowCalc = 61;
  let idxUnfixAll = 69;

  let rowHeader1 = 5;
  let rowHeader = 7;
  let startRow = 9;

  for (let i = 1; i <= 8; i++) {
    let allowIdx = allowanceList.findIndex(x => Number(x.CODE.replace("A", "")) == i);
    if (allowIdx >= 0) {
      let allow = allowanceList[allowIdx];

      if (allow.USE_YN === "Y") {
        dataComp["ALLOW" + Number(allow.CODE.replace("A", "")) + "_NM"] = {
          'richText': [
            {'font': {'bold': true},'text': allow.NAME+"\n"},
            {'font': {'bold': false},'text': allow.NAME_VI}
          ]
        };

        if(!(allow.CAL_TYPE == 2 || allow.CAL_TYPE == 4)) {
          hiddenCols.push(idxAllowCalc + i);
        }
      } else {
        hiddenCols.push(idxAllowFull + i);
        hiddenCols.push(idxAllowCalc + i);
      }
    }
  }

  let _hr0035 = await that._getCommonCode("HR0035", that.selectedCompany);
  for (let i = 1; i <= 8; i++) {
    let allowIdx = unfixAllowanceList.findIndex(x => Number(x.CODE) == i);
    if (allowIdx >= 0) {
      let allow = unfixAllowanceList[allowIdx];
      let _allowUnfix = _hr0035.find(x => x.CODE == allow.CODE);

      if (allow.USE_YN === "Y") {
        dataComp["ALLOW_K" + Number(allow.CODE) + "_NM"] = {
          'richText': [
            {'font': {'bold': true},'text': allow.NAME+"\n"},
            {'font': {'bold': false},'text': allow.NAME_VI}
          ]
        };
        //an cac cot fix allow tinh toan neu co tinh bang unfix
        if(_allowUnfix.NUM1 != null ) {
          let _allowIdx = allowanceList.findIndex(x => x.CODE == _allowUnfix.NUM1);
          if(_allowIdx >= 0) {
            hiddenCols.push(idxAllowCalc + _allowIdx + 1);
          }
        }

      } else {
        hiddenCols.push(idxUnfixAll + i);
      }
    } else {
      hiddenCols.push(idxUnfixAll + i);
    }
  }

  exceljs.insertRange(that, "A1:CS14", dataComp);
  exceljs.setHideColumns(that, hiddenCols, true);


  const maxColValues = worksheet.model.rows.map(row => row.max);
  const largestMaxCol = Math.max(...maxColValues);

  let headerTitle1 = worksheet.getRow(rowHeader1).values;
  let headerTitle = worksheet.getRow(rowHeader).values;
  let headerField = worksheet.getRow(startRow).values;


  
  for(let colIdx = 1; colIdx <= largestMaxCol; colIdx++) {
    let colInfo = worksheet.getColumn(colIdx);
    let _idxExist = header.findIndex(q => q["field"] == headerField[colIdx]);
    
    let _group1 = headerTitle1[colIdx];
    let _title = headerTitle[colIdx];
    let _field = headerField[colIdx];
    let _header = {};

    if (_field == undefined || _field == "" || _idxExist >= 0) continue;
    
    if (typeof _group1 == "object") {
      if (_group1.hasOwnProperty("richText")) {
        let _titleTmp = "";
        _group1.richText.forEach(q => { _titleTmp += q["text"] + " "; });
        _group1 = _titleTmp.replace(/\n/g,' ').replace(/\r/g,' ');
      }
    }

    if (typeof _title == "object") {
      if (_title.hasOwnProperty("richText")) {
        let _titleTmp = "";
        _title.richText.forEach(q => { _titleTmp += q["text"] + " "; });
        _title = _titleTmp.replace(/\n/g,' ').replace(/\r/g,' ');
      }
    }

    _header = { title: _title ? _title + "" : _field
              , field: _field == "NO" ? "INDEX" : _field, type: ""
              , editable: false, hidden: colInfo.hidden
              , isAdditionColumn: true 
    };

    if(_title != _group1 ) {
      _header.group1 = _group1;
    }

    _header.type = stringField.includes(_field) ? 'text' : (dateField.includes(_field) ? "date" : "number");

    if (colIdx <= fixed) _header.fixed = true;

    if (_header.type == "number" && _field != "NO") {
      _header.format = "###,###,###.##";
      _header.summaryType = 'sum';
    }

    header.push(_header);
  }

  return header;
}


let readExcelPayroll_t1 = async (that, reportInfo) => {
  let report_path = reportInfo.REPORT_PATH;

  let exceljs = require("@/plugins/exceljs.js");
  if (!!exceljs) {
    exceljs = exceljs.default;
  }

  await exceljs.createWorkbook(that, report_path);
  let worksheet = exceljs.worksheet();

  let dataComp = {};
  let hiddenCols = [];

  let header = [];
  let stringField = ["INDEX", "EMP_ID", "FULL_NAME", "SEX", "PERSONAL_ID", "DEPT_NM", "DIV_NM", "POS_TYPE", "ACCOUNT", "BIRTH_DT", "JOIN_DT"];
  let dateField = [];
  let fixed = 3;

  let idxAllowFull = 9;
  let idxAllowCalc = 61;
  let idxUnfixAll = 69;

  let rowHeader1 = 5;
  let rowHeader = 7;
  let startRow = 9;

  for (let i = 1; i <= 8; i++) {
    let allowIdx = allowanceList.findIndex(x => Number(x.CODE.replace("A", "")) == i);
    if (allowIdx >= 0) {
      let allow = allowanceList[allowIdx];

      if (allow.USE_YN === "Y") {
        dataComp["ALLOW" + Number(allow.CODE.replace("A", "")) + "_NM"] = {
          'richText': [
            {'font': {'bold': true},'text': allow.NAME+"\n"},
            {'font': {'bold': false},'text': allow.NAME_VI}
          ]
        };

        if(!(allow.CAL_TYPE == 2 || allow.CAL_TYPE == 4)) {
          hiddenCols.push(idxAllowCalc + i);
        }
      } else {
        hiddenCols.push(idxAllowFull + i);
        hiddenCols.push(idxAllowCalc + i);
      }
    }
  }

  let _hr0035 = await that._getCommonCode("HR0035", that.selectedCompany);
  for (let i = 1; i <= 8; i++) {
    let allowIdx = unfixAllowanceList.findIndex(x => Number(x.CODE) == i);
    if (allowIdx >= 0) {
      let allow = unfixAllowanceList[allowIdx];
      let _allowUnfix = _hr0035.find(x => x.CODE == allow.CODE);

      if (allow.USE_YN === "Y") {
        dataComp["ALLOW_K" + Number(allow.CODE) + "_NM"] = {
          'richText': [
            {'font': {'bold': true},'text': allow.NAME+"\n"},
            {'font': {'bold': false},'text': allow.NAME_VI}
          ]
        };
        //an cac cot fix allow tinh toan neu co tinh bang unfix
        if(_allowUnfix.NUM1 != null ) {
          let _allowIdx = allowanceList.findIndex(x => x.CODE == _allowUnfix.NUM1);
          if(_allowIdx >= 0) {
            hiddenCols.push(idxAllowCalc + _allowIdx + 1);
          }
        }

      } else {
        hiddenCols.push(idxUnfixAll + i);
      }
    } else {
      hiddenCols.push(idxUnfixAll + i);
    }
  }

  exceljs.insertRange(that, "A1:CS14", dataComp);
  exceljs.setHideColumns(that, hiddenCols, true);


  const maxColValues = worksheet.model.rows.map(row => row.max);
  const largestMaxCol = Math.max(...maxColValues);

  let headerTitle1 = worksheet.getRow(rowHeader1).values;
  let headerTitle = worksheet.getRow(rowHeader).values;
  let headerField = worksheet.getRow(startRow).values;


  
  for(let colIdx = 1; colIdx <= largestMaxCol; colIdx++) {
    let colInfo = worksheet.getColumn(colIdx);
    let _idxExist = header.findIndex(q => q["field"] == headerField[colIdx]);
    
    let _group1 = headerTitle1[colIdx];
    let _title = headerTitle[colIdx];
    let _field = headerField[colIdx];
    let _header = {};

    if (_field == undefined || _field == "" || _idxExist >= 0) continue;
    
    if (typeof _group1 == "object") {
      if (_group1.hasOwnProperty("richText")) {
        let _titleTmp = "";
        _group1.richText.forEach(q => { _titleTmp += q["text"] + " "; });
        _group1 = _titleTmp.replace(/\n/g,' ').replace(/\r/g,' ');
      }
    }

    if (typeof _title == "object") {
      if (_title.hasOwnProperty("richText")) {
        let _titleTmp = "";
        _title.richText.forEach(q => { _titleTmp += q["text"] + " "; });
        _title = _titleTmp.replace(/\n/g,' ').replace(/\r/g,' ');
      }
    }

    _header = { title: _title ? _title + "" : _field
              , field: _field == "NO" ? "INDEX" : _field, type: ""
              , editable: false, hidden: colInfo.hidden
              , isAdditionColumn: true 
    };

    if(_title != _group1 ) {
      _header.group1 = _group1;
    }

    _header.type = stringField.includes(_field) ? 'text' : (dateField.includes(_field) ? "date" : "number");

    if (colIdx <= fixed) _header.fixed = true;

    if (_header.type == "number" && _field != "NO") {
      _header.format = "###,###,###.##";
      _header.summaryType = 'sum';
    }

    header.push(_header);
  }

  return header;
}

export default _1031052;