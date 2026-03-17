let reportList= [   
    { CODE: '20', NAME: '20 - Payroll', REPORT_PATH: 'report/10/31/woosung/1031052_payroll_woosung.xlsx'}, 
    { CODE: '21', NAME: '21 - Bank Transfer', REPORT_PATH: 'report/10/31/woosung/1031052_payment_by_bank_woosung.xlsx'}, 
    { CODE: '22', NAME: '22 - Cash Payment', REPORT_PATH: 'report/10/31/woosung/1031052_payment_by_cash_woosung.xlsx'}, 
];

let allowanceList = null;
let unfixAllowanceList = null;
let companyList = [];
let company = null;

let _1031052_woosung = {
    getReportList: async (that) =>{
        await prepareCommonData(that);
        return reportList;
    },

    print: async(that, selectedReport) => {
        let excel = null;
        let reportInfo = reportList.find(x => x.CODE === selectedReport);
        let p_param = [that.selectedOrg, that.selectedType, that.selectedEmpPK, that.selectedMonth, that.selectedPeriod];

        let report_path = reportInfo.REPORT_PATH;
        let report_name = reportInfo.NAME+".xlsx";

        switch(selectedReport) {
            case '20' : {
                await excelPayroll(that, reportInfo, p_param);
                break;
            }
            case '21' : {
                await excelPaymentByBank(that, reportInfo, p_param);
                break;
            }
            case '22' : {
                await excelPaymentByCash(that, reportInfo, p_param);
                break;
            }
        }

     
    },

    readExcel: async (that, selectedReport) => {
		let reportInfo = reportList.find(x => x.CODE === that.selectedReport);
		let headers = [];
        let selpro ="";

		switch(selectedReport) {
            case "20": {
                headers = await readExcelPayroll( that, reportInfo);
                selpro = "hr_rpt_1031052_payroll_ws";
                break;
            }
        }

		return {
			header: headers,
			selpro: selpro
		};
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

    companyList = await that._getCompany();
    company = companyList.find(x => x["PK"] === that.selectedCompany );
};

let excelPayroll = async(that, reportInfo, p_param) => {
    let exceljs =  require("@/plugins/exceljs.js");
    if(!!exceljs) {
        exceljs = exceljs.default;
    }
    await exceljs.createWorkbook(that, reportInfo.REPORT_PATH);

    let dsoComp = {type: 'grid', selpro: 'HR_RPT_1020050_COMPANY_INFO', para: [that.selectedOrg, that.selectedMonth] };
	let dataComp = await that._dsoCall(dsoComp, 'select', false);

	dataComp = {...dataComp[0]};

	const dso = {type: 'list', selpro: 'HR_RPT_1031052_PAYROLL_WS', para: [...p_param] };
	let _datas = await that._dsoCall(dso, 'select', false);

    // for(let i = 1; i <= 20; i++) {
	// 	let allowIdx = allowanceList.findIndex( x =>  Number(x.CODE.replace("A","")) == i);
	// 	if(allowIdx >= 0) {
	// 		let allow = allowanceList[allowIdx];

	// 		if( allow.USE_YN === "Y" ) {
	// 			dataComp["ALLOW"+ Number(allow.CODE.replace("A","")) + "_NM" ] = allow.NAME;
	// 		} 
	// 	}
    // }

    // for(let i = 1; i <= 20; i++) {
    //     let allowIdx = unfixAllowanceList.findIndex( x =>  Number(x.CODE) == i);
    //     if(allowIdx >= 0) {
    //         let allow = unfixAllowanceList[allowIdx];

    //         if( allow.USE_YN === "Y" ) {
    //             dataComp["ALLOW_K"+ Number(allow.CODE)+"_NM"  ] = allow.NAME;
    //         } 
    //     }
    // }


    let startRow = 13;
	let totalRow = startRow + _datas.length;
	let totalData = {TOTAL_TEXT: "Tổng cộng (Total):"};

	let keys = Object.keys(_datas[0]);
	keys.forEach(key => {
		let vals = _datas.map( q =>  (  isNaN(q[key]) ||  q[key]== null  ) ? 0 :  q[key]  );
		let sumVal = Math.round(that._Total(vals)*100)/100;
		totalData[key] = sumVal;
	})

	// dataComp.NET_AMT_VN = that._num2VieText(totalData.NET_AMT);

	exceljs.insertRange(that, "A1:CN14", dataComp);
	exceljs.insertRows(that,startRow, _datas);
	exceljs.insertRowData(that, totalRow, totalData);

	// chen hinh
	let imgBase64 = "data:image/png;base64,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NntgYKDmzJlT6rriWe2StHDhQptmtX/11VcymUwKCgpSfHy8Nm3aJOn3hWx8fX2rfwBAHduxY4dWrVolDw8PRUdHV3rW17x583TmzBnNmTNHKSkp19xPcaDv5+enV199VT169NCWLVuUm5tbqt3U1FR98sknat26tcaPHy83NzfNnTuXN6a4ph07duitt96Su7u79u/ff80PrIov8+fPV3Z2dpXG8oQJE+Tv76+///3v6t69uzZv3qycnJwyY/k///mP2rZtqwkTJqh58+Z6/fXXqxTmA7Vp48aNcnR0VGBgoE6cOFHp59l27dpV6cMii8WiSZMmyd/fXy+//LK6deumTZs26dy5c6UeM2lpafr0008VEBCgSZMmqUWLFvrXv/5VZrE+oKSEhASFhYWpffv2+ve//63evXvrgw8+0KlTp8r8H0hISNBLL70kDw8PjRgxQgEBAVq+fHmlx9iUKVN06dKlKs2SP3DggPz9/fXll1/qyJEjvJ5BvavODHhJuvnmm6v8oWdeXp6mTp2q1q1b68UXX1SnTp20fv16nT17ttTjMz09XWvWrFG7du301FNPyWw267XXXtPFixerc4gAbkAO9d0BoDFKTU3V1KlTJVUceE+bNk0bNmywzmofMmRItfZ15MgR68/Fs9crY8aMGZoxY0a19gnUpubNm8vb27vW2n/iiSe0evVqBQQEaOfOnfL39y93Ox8fH/n4+GjlypWaMGGCBgwYoKefflrS748fZgLjWtzc3OTj41NrY2XKlCl677331KZNG+3cuVOtWrUqd7visbxixQrrWH722WclSTNnzmSGLmpEYmKiUlNTq3Xbo0ePViv0GzRokC5fvlzp7adNm6Z3331XrVu31rfffqvWrVuX+/j09vaWt7e3li9frgkTJmjgwIGaNWuWpN+f/x0ceIuF0iwWi6ZOnao9e/booYce0uLFi+Xh4VHh9kFBQQoKCtI999yjCRMmaNCgQZo8ebK8vLx03333MXMWDcKZM2cUFhZWa+1XJVwvacCAAVWeqPb000/r7bfflp+fnzZv3qzg4OByX/94eXnJy8tLixcv1rhx43TvvffqxRdflPT7a6abbrqpyv0FcGPhnRNQxywWi0aNGqWkpCSFh4crIiKi3O1Kzmr/7LPP6rKLQKNlsViUnJwsSZo4caL8/Pwqdbubb75ZXbp0kclk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";

	let id = exceljs.insertImageBase64(that, imgBase64);
	let sheet = exceljs.worksheet();
	// console.log("id", id)
	sheet.addImage(id, {
		tl:{col: 15, row: totalRow + 4 },
		br:{col: 40 , row: totalRow + 16 }
	});

    exceljs.dowloadWorkbook(that, reportInfo.NAME + ".xlsx");
    that.salaryStatus = that.$t("complete");
}


let excelPaymentByBank = async(that, reportInfo, p_param) => {
    let exceljs =  require("@/plugins/exceljs.js");
    if(!!exceljs) {
        exceljs = exceljs.default;
    }
    await exceljs.createWorkbook(that, reportInfo.REPORT_PATH);

    let dsoComp = {type: 'grid', selpro: 'HR_RPT_1030050_COMPANY_INFO', para: [that.selectedCompany, that.selectedMonth] };
	let dataComp = await that._dsoCall(dsoComp, 'select', false);

	dataComp = {...dataComp[0]};

	const dso = {type: 'list', selpro: 'hr_rpt_1031052_payment_bank_ws', para: [...p_param] };
	let _datas = await that._dsoCall(dso, 'select', false);


    let startRow = 8;
	let totalRow = startRow + _datas.length;
	let totalData = {TOTAL_TEXT: "TỔNG CỘNG"};

	let keys = Object.keys(_datas[0]);
	keys.forEach(key => {
		let vals = _datas.map( q =>  (  isNaN(q[key]) ||  q[key]== null  ) ? 0 :  q[key]  );
		let sumVal = Math.round(that._Total(vals)*100)/100;
		totalData[key] = sumVal;
	})

	dataComp.NET_AMT_VN = that._num2VieText(totalData.NET_AMT);

	exceljs.insertRange(that, "A1:G6", dataComp);
	exceljs.insertRows(that,startRow, _datas);
	exceljs.insertRowData(that, totalRow, totalData);

    exceljs.dowloadWorkbook(that, reportInfo.NAME + ".xlsx");
    that.salaryStatus = that.$t("complete");
}

let excelPaymentByCash = async(that, reportInfo, p_param) => {
    let exceljs =  require("@/plugins/exceljs.js");
    if(!!exceljs) {
        exceljs = exceljs.default;
    }
    await exceljs.createWorkbook(that, reportInfo.REPORT_PATH);

    let dsoComp = {type: 'grid', selpro: 'HR_RPT_1030050_COMPANY_INFO', para: [that.selectedCompany, that.selectedMonth] };
	let dataComp = await that._dsoCall(dsoComp, 'select', false);

	dataComp = {...dataComp[0]};

	const dso = {type: 'list', selpro: 'hr_rpt_1031052_payment_cash_ws', para: [...p_param] };
	let _datas = await that._dsoCall(dso, 'select', false);


    let startRow = 8;
	let totalRow = startRow + _datas.length;
	let totalData = {TOTAL_TEXT: `Total ${_datas.length} employee(s)`};

	let keys = Object.keys(_datas[0]);
	keys.forEach(key => {
		let vals = _datas.map( q =>  (  isNaN(q[key]) ||  q[key]== null  ) ? 0 :  q[key]  );
		let sumVal = Math.round(that._Total(vals)*100)/100;
		totalData[key] = sumVal;
	})

	dataComp.NET_AMT_VN = that._num2VieText(totalData.NET_AMT);

	exceljs.insertRange(that, "A1:G6", dataComp);
	exceljs.insertRows(that,startRow, _datas);
	exceljs.insertRowData(that, totalRow, totalData);

    exceljs.dowloadWorkbook(that, reportInfo.NAME + ".xlsx");
    that.salaryStatus = that.$t("complete");
}


let readExcelPayroll = async(that, reportInfo) =>{
	let exceljs =  require("@/plugins/exceljs.js");
	if(!!exceljs) {
		exceljs = exceljs.default;
	}
    await exceljs.createWorkbook(that, reportInfo.REPORT_PATH);

    let dsoComp = {type: 'grid', selpro: 'HR_RPT_1030050_COMPANY_INFO', para: [that.selectedCompany, that.selectedMonth] };
	let dataComp = await that._dsoCall(dsoComp, 'select', false);
	dataComp = {...dataComp[0]};
    for(let i = 1; i <= 20; i++) {
		let allowIdx = allowanceList.findIndex( x =>  Number(x.CODE.replace("A","")) == i);
		if(allowIdx >= 0) {
			let allow = allowanceList[allowIdx];

			if( allow.USE_YN === "Y" ) {
				dataComp["ALLOW"+ Number(allow.CODE.replace("A","")) + "_NM" ] = allow.NAME;
			} 
		}
    }

    for(let i = 1; i <= 20; i++) {
        let allowIdx = unfixAllowanceList.findIndex( x =>  Number(x.CODE) == i);
        if(allowIdx >= 0) {
            let allow = unfixAllowanceList[allowIdx];

            if( allow.USE_YN === "Y" ) {
                dataComp["ALLOW_K"+ Number(allow.CODE)+"_NM"  ] = allow.NAME;
            } 
        }
    }

    exceljs.insertRange(that, "A1:CN14", dataComp);






    let worksheet = exceljs.worksheet();
    let rowHeader = 7;
	let startRow = 9;
    let hiddenCols = [];

	let headerTitle = worksheet.getRow(rowHeader).values;
	let headerField = worksheet.getRow(startRow).values;

	let headers = [];
	let fixed = 3;
	let stringField = ["INDEX", "EMP_ID", "FULL_NAME", "SEX", "PERSONAL_ID", "DEPT_NM", "DIV_NM", "POS_TYPE", "ACCOUNT", "BIRTH_DT", "JOIN_DT"];
	let dateField = [];
	for(let i = 0; i < headerField.length; i++){
		let _field = headerField[i];
		let _title  = headerTitle[i];
		let _header = {};   
		let existedIdx = headers.findIndex( q => q["field"] == _field) ;

		if(_field == undefined || _field == "" || existedIdx >= 0) continue;
		if(typeof _title == "object") {
			if(_title.hasOwnProperty("richText")) {
				let _titleTmp = "";
				_title.richText.forEach( q => {
					_titleTmp+= q["text"] + " " ;
				} );
				_title = _titleTmp;
			}
		}

		_header = { title: _title ? _title+"" : _field,  field:  _field == "NO" ? "INDEX" : _field,  type: "", editable: false, hidden: hiddenCols.includes(_field), isAdditionColumn: true  };
		_header.type = stringField.includes(_field) ? 'text' : ( dateField.includes(_field) ? "date" : "number" );

		if(i <= fixed) {
			_header.fixed = true;
			//_header.visible = false;
		}
		
		if( _header.type == "number" && _field != "NO") {
			_header.format = "###,###,###.##" ;
			_header.summaryType='sum';
		}

		headers.push( _header );
	}
	return headers;
};

export default _1031052_woosung;