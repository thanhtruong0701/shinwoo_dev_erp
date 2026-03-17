import moment from "moment"
let reportList =[];

let _1031022_sw = {
    getReportList: async (that) =>{
        await prepareCommonData(that);
        reportList = await that._getReportList('1021052_SW', '', that.selectedCompany);
        return reportList;
    },

    print: async(that, selectedReport) => {
        try {
            let excel = null;
            let reportInfo = reportList.find(x => x.CODE === selectedReport);

            if(selectedReport == "20") {
                await printWorkingSummary(that, reportInfo);
            }
        } catch(e) {
            console.log(e);
        } finally { }
        
    },
}


let prepareCommonData = async (that) => {
    
};

let printWorkingSummary = async (that, reportInfo) => {
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
    const dsoData = {  type: 'grid',  selpro: 'HR_RPT_1021052_WORKING_SUM_SW', para: p_param };

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


export default _1031022_sw;