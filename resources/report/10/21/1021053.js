import moment from "moment"
let companyList = [];
let company = null;
let companyjs = null;
let reportList = [];
let reportDefault = [
    { CODE: '01', NAME: '01 - WORKING SUMMARY', REPORT_PATH: 'report/10/21/1021053_working_summary.xlsx'}, 
    { CODE: '02', NAME: '02 - WORKING DETAIL', REPORT_PATH: 'report/10/21/1021053_working_detail.xlsx'}, 
    { CODE: '03', NAME: '03 - ABSENCE SUMMARY', REPORT_PATH: 'report/10/21/1021053_absence_summary.xlsx'}, 
    //{ CODE: '04', NAME: '04 - INDIVIDUAL TIME SHEET', REPORT_PATH: 'report/10/21/1021052_individual_time_sheet.xlsx'}, 
];
let reportCompany = [];

let _1021053 = {


    getReportList: async(that) =>{
        await prepareCommonData(that);
        let reports = [];
        
        //check xem co file report js cho cty ko
        try {
            companyjs = require(`@/report/10/21/${(company["PARTNER_ID"]?.toLowerCase())}/${that.menu_id }_${(company["PARTNER_ID"]?.toLowerCase()) }.js`); //report/10/31/ghs/1031050_ghs.js
            companyjs =  companyjs.default; //do export ra default;
            reportCompany = await companyjs.getReportList(that);
        } catch (e) {

        }

        reports = [...reportDefault, ...reportCompany];
        reportList = [...reports];
		reportList = reportList.sort((a, b) => (Number(a.CODE) > Number(b.CODE)) ? 1 : -1)
        return reportList;
    }, 
    print: async(that, selectedReport) => {
        that.isInProcessing = true;
        that.processStatus = that.$t("making_report");
        let reportInfo = reportList.find(x => x.CODE === selectedReport);

        try {
            if( reportDefault.findIndex( q=> q.CODE == selectedReport)  >=0  && Number(selectedReport) < 20 ) { //report default
                switch(selectedReport) {
                    case "01": {
                        await printWorkingSummary( that, reportInfo)
                        break;
                    }
                    case "02": {
                        await printWorkingDetail( that, reportInfo)
                        break;
                    }
                    case "03": {
                        await printAbsenceSummary( that, reportInfo)
                        break;
                    }
                    case "04": {
                        await printIndividualTimeSheet( that, reportInfo)
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

let printWorkingSummary = async ( that, reportInfo) => {
    let selectedPeriod = that.salPeriodList.find(q => q.CODE == that.selectedPeriod);
    let p_param = [that.selectedOrg, that.selectedWg, that.selectedNation, selectedPeriod.ID, selectedPeriod.TIMES, that.selectedMonth, that.selectedEmpPK
                , that.selectedStatus];

    let startColDate = 8;
    let startDate = moment(String(selectedPeriod.ACTIVE_FROM_DT), "YYYYMMDD");
    let endDate = (moment(String(selectedPeriod.ACTIVE_TO_DT), "YYYYMMDD")).add(1, 'days');

    let i=1;
    let hiddenCols = [];  
    let reportHeader = {};

    //header: update column name
    for (let d = startDate; d.isBefore(endDate); d.add(1, 'days')) {
        reportHeader["A"+ i] = d.format("D");
        ++i;
    }
    //header : hide columns
    for (let j = i-1; j < 31; j++) {
        hiddenCols.push(j + startColDate);
    }

    let exceljs =  require("@/plugins/exceljs.js");
    if(!!exceljs) {
        exceljs = exceljs.default;
    }

    await exceljs.createWorkbook(that, reportInfo.REPORT_PATH);
    let worksheet = exceljs.worksheet();

    const dsoComp = {  type: 'grid',  selpro: 'HR_RPT_1020050_COMPANY_INFO', para: [that.selectedOrg, that.selectedMonth]  };
    const dsoData = {  type: 'grid',  selpro: 'HR_RPT_1021053_WORKING_SUMMARY', para: p_param };

    let dataComp = await that._dsoCall(dsoComp, 'select', false);
    let datas = await that._dsoCall(dsoData, 'select', false);

    if(datas && datas.length <= 0)  {
        that.showNotification("warning", that.$t("no_data_found"), "", 4000);
        return;
    }

    exceljs.insertRange(that, "A6:AZ7", reportHeader);
    exceljs.insertRange(that, "A1:AZ3", dataComp[0]);
    exceljs.insertRange2(that, "B8:AZ9", datas);
    
    await exceljs.dowloadWorkbook(that,  `${reportInfo.NAME}.xlsx`);
    that.processStatus = that.$t("complete");
};

let printWorkingDetail = async( that, reportInfo) => {
    let selectedPeriod = that.salPeriodList.find(q => q.CODE == that.selectedPeriod);
    let p_param = [that.selectedOrg, that.selectedWg, that.selectedNation, selectedPeriod.ID, selectedPeriod.TIMES, that.selectedMonth, that.selectedEmpPK];

    let startColDate = 8;
    let startDate = moment(String(selectedPeriod.ACTIVE_FROM_DT), "YYYYMMDD");
    let endDate = (moment(String(selectedPeriod.ACTIVE_TO_DT), "YYYYMMDD")).add(1, 'days');

    let i=1;
    let hiddenCols = [];  
    let reportHeader = {};

    //header: update column name
    for (let d = startDate; d.isBefore(endDate); d.add(1, 'days')) {
        reportHeader["A"+ i] = d.format("D");
        ++i;
    }
    //header : hide columns
    for (let j = i-1; j < 31; j++) {
        hiddenCols.push(j + startColDate);
    }

    let exceljs =  require("@/plugins/exceljs.js");
    if(!!exceljs) {
        exceljs = exceljs.default;
    }

    await exceljs.createWorkbook(that, reportInfo.REPORT_PATH);
    let worksheet = exceljs.worksheet();

    const dsoComp = {  type: 'grid',  selpro: 'HR_RPT_1020050_COMPANY_INFO', para: [that.selectedOrg, that.selectedMonth]  };
    const dsoData = {  type: 'grid',  selpro: 'HR_RPT_1021053_WORKING_DETAIL', para: p_param };

    let dataComp = await that._dsoCall(dsoComp, 'select', false);
    let datas = await that._dsoCall(dsoData, 'select', false);

    if(datas && datas.length <= 0)  {
        that.showNotification("warning", that.$t("no_data_found"), "", 4000);
        return;
    }

    exceljs.insertRange(that, "A6:AT7", reportHeader);
    exceljs.insertRange(that, "A1:AY3", dataComp[0]);
    exceljs.insertRange2(that, "B8:AY9", datas);
    
    await exceljs.dowloadWorkbook(that,  `${reportInfo.NAME}.xlsx`);
    that.processStatus = that.$t("complete");


};

let printAbsenceSummary = async( that, reportInfo) => {
    let selectedPeriod = that.salPeriodList.find(q => q.CODE == that.selectedPeriod);
    let p_param = [that.selectedOrg, that.selectedWg, that.selectedNation, selectedPeriod.ID, selectedPeriod.TIMES, that.selectedMonth, that.selectedEmpPK];

    let startColDate = 8;
    let startDate = moment(String(selectedPeriod.ACTIVE_FROM_DT), "YYYYMMDD");
    let endDate = (moment(String(selectedPeriod.ACTIVE_TO_DT), "YYYYMMDD")).add(1, 'days');

    let i=1;
    let hiddenCols = [];  
    let reportHeader = {};

    //header: update column name
    for (let d = startDate; d.isBefore(endDate); d.add(1, 'days')) {
        reportHeader["A"+ i] = d.format("D");
        ++i;
    }
    //header : hide columns
    for (let j = i-1; j < 31; j++) {
        hiddenCols.push(j + startColDate);
    }

    let exceljs =  require("@/plugins/exceljs.js");
    if(!!exceljs) {
        exceljs = exceljs.default;
    }

    await exceljs.createWorkbook(that, reportInfo.REPORT_PATH);
    let worksheet = exceljs.worksheet();

    const dsoComp = {  type: 'grid',  selpro: 'HR_RPT_1020050_COMPANY_INFO', para: [that.selectedOrg, that.selectedMonth]  };
    const dsoData = {  type: 'grid',  selpro: 'HR_RPT_1021053_ABSENCE_SUMMARY', para: p_param };

    let dataComp = await that._dsoCall(dsoComp, 'select', false);
    let datas = await that._dsoCall(dsoData, 'select', false);

    if(datas && datas.length <= 0)  {
        that.showNotification("warning", that.$t("no_data_found"), "", 4000);
        return;
    }

    exceljs.insertRange(that, "A6:AY7", reportHeader);
    exceljs.insertRange(that, "A1:AY3", dataComp[0]);
    exceljs.insertRows(that, 8, datas);
    
    await exceljs.dowloadWorkbook(that,  `${reportInfo.NAME}.xlsx`);
    that.processStatus = that.$t("complete");
};

let printIndividualTimeSheet = async( that, reportInfo) => {
    
};

export default _1021053;