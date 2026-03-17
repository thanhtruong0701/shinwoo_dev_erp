import moment from "moment"
let companyList = [];
let company = null;
let companyjs = null;
let reportList= [   
    { CODE: '20', NAME: '20 - WORKING DETAIL', REPORT_PATH: 'report/10/11/woosung/1011021_report_details.xlsx'},
];
let reportCompany = [];
let _1011021_woosung = {
    getReportList: async(that) =>{
        await prepareCommonData(that);
        let reports = [];
        reports = [...reportList, ...reportCompany];
        reportList = [...reports];
		reportList = reportList.sort((a, b) => (Number(a.CODE) > Number(b.CODE)) ? 1 : -1)
        
        return reportList;
    },

  print: async (that, reportInfo, p_search) => {
      
        switch(reportInfo.CODE) {
            case '20' : {
                await printDetail_Report(that, reportInfo);
                break;
            }
        }
    },

}
let prepareCommonData = async (that) => {
  companyList = await that._getCompany();
  company = companyList.find(x => x["PK"] === that.selectedCompany );
};


let printDetail_Report = async(that, reportInfo) => {
  var today = new Date();
  let reportHeader = {
      USER_NAME: that.user.USER_NAME,
      REPORT_DT: String(today.getDate()).padStart(2, '0') + '/' + String(today.getMonth() + 1).padStart(2, '0') + '/' + today.getFullYear()
  };



  let exceljs =  require("@/plugins/exceljs.js");
  if(!!exceljs) {
      exceljs = exceljs.default;
  }
  await exceljs.createWorkbook(that, reportInfo.REPORT_PATH);

// const dso = {type: 'list', selpro: 'HR_RPT_1031052_PAYROLL_WS', para: [...p_param] };
// let _datas = await that._dsoCall(dso, 'select', false);
exceljs.setColumnType("date", ["BIRTH_DT","JOIN_DT","ISSUE_DT","PASS_PORT_DT","BEGIN_PROBATION","END_PROBATION","BEGIN_CONTRACT","END_CONTRACT","LEFT_DT","UNION_DATE"]);
let datas = that.$refs.idGrid.getDataDb();
let startRow = 7;
exceljs.insertRange(that, "A2:BP6", reportHeader);
exceljs.insertRows(that,startRow, datas);


  exceljs.dowloadWorkbook(that, reportInfo.NAME + ".xlsx");

}





export default _1011021_woosung;