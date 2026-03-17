import moment from "moment";

let companyList = [];
let company = null;
let companyjs = null;
let reportList = [];
let reportDefault = [
    { CODE: '01', NAME: '01 - Checking Agreement Report', REPORT_PATH: 'report/10/90/standard/1090030_checking_agreement_report.xlsx'}, 
];
let reportCompany = [];

let _1090030 = {
    getReportList: async(that) =>{
        await prepareCommonData(that);
        let reports = [];
        //reportDefault = await that._getReportList(that.menu_id, '', that.selectedCompany);
        
        //check xem co file report js cho cty ko
        try {
            companyjs = require(`@/report/10/90/${(company["PARTNER_ID"]?.toLowerCase())}/${that.menu_id }_${(company["PARTNER_ID"]?.toLowerCase()) }.js`); //report/10/31/ghs/1031050_ghs.js
            companyjs =  companyjs.default; //do export ra default;
            reportCompany = await companyjs.getReportList(that);
        } catch (e) {   }

        reports = [...reportDefault, ...reportCompany];
        reportList = [...reports];
		reportList = reportList.sort((a, b) => (Number(a.CODE) > Number(b.CODE)) ? 1 : -1)
        return reportList;
    }, 

    print: async(that, selectedReport) => {

        that.isPrinting = true;
        let reportInfo = reportList.find(x => x.CODE === that.selectedReport);
        let p_param = that.getParameter();

        try {
            if( reportDefault.findIndex( q=> q.CODE == selectedReport)  >=0  && Number(selectedReport) < 20 ) { //report default
                switch(selectedReport) {
                    case "01": {
                        await excelCheckingAgreement( that, reportInfo,p_param)
                        break;
                    }
                }
            } else { // report cho cty
                await companyjs.print(that, selectedReport);
            }
            
        } catch(e) {
            console.log(e.message);
        } finally {
            that.isPrinting = false;
        }
    },


    
};

let prepareCommonData = async (that) => {
    companyList = await that._getCompany();
    company = companyList.find(x => x["PK"] === that.selectedCompany );
};

let excelCheckingAgreement = async (that, reportInfo,p_param) => {
    let exceljs =  require("@/plugins/exceljs.js");
    if(!!exceljs) {
        exceljs = exceljs.default;
    }
    await exceljs.createWorkbook(that, reportInfo.REPORT_PATH);
    exceljs.setColumnType("date", ["FROM_DT", "TO_DT", "JOIN_DT"]);

    const dsoDocInfo =  {type: 'list', selpro: 'hr_rpt_1090030_doc_info', para: [that.selectedDocDetail] };
    let _docInfo =  await that._dsoCall(dsoDocInfo, 'select', false);

    if(_docInfo) {
        _docInfo = _docInfo[0];
    }

    console.log(_docInfo);

    const dso = {type: 'list', selpro: 'hr_rpt_1090030_check_list_v2', para: [...p_param, that.selectedDocDetail] };
	let _datas = await that._dsoCall(dso, 'select', false);

    // if(that.selectedFromDate != "" || that.selectedToDate != "") {
    //     let cell = exceljs.getCellByAddress(that, "A2");
    //     cell.value = `Document Period: ${ that.selectedFromDate ? moment(that.selectedFromDate, "YYYYMMDD").format("DD/MM/YYYY") : ""  } - ${ that.selectedToDate ? moment(that.selectedToDate, "YYYYMMDD").format("DD/MM/YYYY") : ""  }`;
    // }


    let startRow = 7;
    exceljs.insertRange(that,"A1:L5", _docInfo);
    exceljs.insertRows(that,startRow, _datas);
    exceljs.dowloadWorkbook(that, reportInfo.NAME + ".xlsx");
}

export default _1090030;