let allowanceList = null;
let unfixAllowanceList = null;

let reportList= [   
    { CODE: '20', NAME: '20 - Payroll Total', REPORT_PATH: 'report/10/31/kpx/1030050_PAYROLL_TOTAL_KPX.xlsx'}, 
    { CODE: '21', NAME: '21 - Insurance Payment', REPORT_PATH: 'report/10/31/kpx/1030050_insurance_payment.xlsx'}, 
    { CODE: '23', NAME: '23 - Payslip', REPORT_PATH: 'report/10/31/kpx/1030050_PAYSLIP_KPX.xlsx'}, 
];

let _1031050_kpx = {
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

        let p_from = that.selectedFromDate;
        let p_to = that.selectedToDate;
        let p_na_vn = '01';
        let p_nation_vn = [p_na_vn,...p_param,p_from,p_to];
        let p_na_korean = '09';
        let p_nation_korean = [p_na_korean,...p_param,p_from,p_to];

        switch(selectedReport) {
            case '20' : {
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

                let _datas = await that._dsoCall(dso, 'select', false);

                let dsoComp = {type: 'grid', selpro: 'HR_RPT_1030050_COMPANY_INFO', para: [that.selectedCompany, that.selectedMonth] };
                let dataComp = await that._dsoCall(dsoComp, 'select', false);

                let reportHeader = [];
                let startRow = 11;
                let startAllow1 = 17 - 1;
                let hiddenCols = [];

                for(let i = 1; i <= 12; i++) {
                  let allowIdx = allowanceList.findIndex( x =>  Number(x.CODE.replace("A","")) == i);
                  if(allowIdx >= 0) {
                    let allow = allowanceList[allowIdx];

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
                try {
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
                } catch (error) {
                    
                }
                


                ///////////////////////////////////////////////
                exceljs.dowloadWorkbook(that, reportInfo.NAME + ".xlsx");
                that.salaryStatus = that.$t("complete");
                return;

                break;
            }

            case '21' :{
                await excelInsurancePayment( that, reportInfo,p_param, p_param_extra);
                return;
                break;
            }
            case '23' : {
                let p_na_all = 'ALL';
                let p_nation_all = [p_na_all,...p_param,p_from,p_to];

                excel = [
                    {
                        sheet: 'PAYSLIP',
                        insertRange2: [ { range: "A1:J33", pageBreak: true, dataPerPage: 2, proc: "hr_rpt_1030050_payslip_kpx", params: [...p_nation_all], param_extra: [...p_param_extra],dateColumns: [] , stringColumns: [],imageColumns: ["LOGO"] }, ],
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
            startRow: 9, proc: "hr_rpt_1031050_insurance_kpx", params: [...p_param], dateColumns: [ "JOIN_DT", "LEFT_DT" ] , stringColumns: [ "EMP_ID", "ID_NUM","OLD_ID", "E_ACCOUNT" ],
            param_extra: [...p_param_extra],
            total: [
                {   column: "NATION", isDisplay: true, type: "SUM", text: `Sub total $[0]` , isMerge: false, merge: { from: 1, to: 6 }   }, //"Total $[0]: $[1] record(s) "
                {   column: null, isDisplay: true, type: "SUM", text: that.$t("total"), isMerge: true, isGrandTotal: true , font: {  size: 15, bold: true } , merge: { from: 1, to: 6 }  }, //"Grand total: $[1] record(s) "
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

export default _1031050_kpx;