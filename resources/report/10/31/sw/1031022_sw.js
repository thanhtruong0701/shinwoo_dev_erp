let reportList =[];

let _1031022_sw = {
    getReportList: async (that) =>{
        await prepareCommonData(that);
        reportList = await that._getReportList('1031022_SW', 'MONTH_SALARY_INCREASE', that.sw_selectedCompany);
        return reportList;
    },

    print: async(that, selectedReport) => {
        try {
            that.sw_isPrinting = true;
            let excel = null;
            let reportInfo = reportList.find(x => x.CODE === selectedReport);

            if(selectedReport == "01") {
                await printSalaryIncrease(that, reportInfo);
            }
        } catch(e) {
            console.log(e);
        } finally {
            that.sw_isPrinting = false;
        }
        
    },
}


let prepareCommonData = async (that) => {
    
};

let printSalaryIncrease = async(that, reportInfo) => {
    let exceljs =  require("@/plugins/exceljs.js");
	if(!!exceljs) {
		exceljs = exceljs.default;
	}
    await exceljs.createWorkbook(that, reportInfo.REPORT_PATH);
    let worksheet = exceljs.worksheet();

    let para = that.sw_getParameters();
    const dsoComp = {  type: 'grid',  selpro: 'hr_rpt_1030050_company_info', para: [that.sw_selectedCompany, that.sw_selectedMonth]  };
    const dsoData = {  type: 'grid',  selpro: 'hr_rpt_1031022_increase_sw', para: para };

    let dataComp = await that._dsoCall(dsoComp, 'select', false);
    let datas = await that._dsoCall(dsoData, 'select', false);

    if(datas && datas.length <= 0)  {
        that.showNotification("warning", that.$t("no_data_found"), "", 4000);
        return;
    }
    
    let startRow = 17;
    let totalData = {};
    let keys = Object.keys(datas[0]);
	keys.forEach(key => {
		let vals = datas.map( q =>  (  isNaN(q[key]) ||  q[key]== null  ) ? 0 :  q[key]  );
		let sumVal = Math.round(that._Total(vals)*100)/100;
		totalData[key] = sumVal;
        dataComp[0][key] = sumVal;
	});


    exceljs.insertRange(that, "A1:J23", dataComp[0]);
    exceljs.insertRows(that, startRow, datas);

    await exceljs.dowloadWorkbook(that,  `${reportInfo.NAME}.xlsx`);
}

export default _1031022_sw;