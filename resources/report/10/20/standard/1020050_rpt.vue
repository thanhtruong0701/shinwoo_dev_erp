<template>
    <v-container>
        
    </v-container>
</template>

<script>
import moment from "moment"
  export default {
    name: '1020050-rpt',

    props: {
      tco_company_pk:{
        type: [String, Number],
        default: null
      }
    },

    data: () => ({
        companyList:[],
        company:null,
    }),

    computed:
    {
      user: function()
      {
          return this.$store.getters["auth/user"];
      },
    },

    async created() {
      //this.selectedCompany = this.user.TCO_COMPANY_PK;
      this.companyList = await this._getCompany();

    },


    methods: {
        async prepareCommonData(){
            
            
        },
      
        async getExcel(that, reportInfo, p_param, fromDate= null, toDate = null ) {
          this.company = this.companyList.find(x => x["PK"] == this.tco_company_pk );
          let report = reportInfo.CODE;
          let excel = [];
          //for other company 
          if(this.company) {
              switch(this.company["PARTNER_ID"]) {
                  case 'DY': {
                    switch(report) {
                      case '04': {
                        /*
                        excel = [
                          //sheet1
                          {
                            sheet: 1,
                            insertRange2: [
                              { 
                                range: "A1:R50", proc: "HR_RPT_1020050_INDIVIDUAL_M", params: p_param, dateColumns: [ "JOIN_DT", "LEFT_DT" ], pageBreak: true 
                                , KEY: "THR_EMP_PK"
                                , details: {
                                  WORKING_SHEET : {  startRow: 6, proc: "HR_RPT_1020050_INDIVIDUAL_D", params: [...p_param]
                                    // , subStyle: { fill: {
                                    //                   type: 'pattern',
                                    //                   pattern:'solid',
                                    //                   fgColor : { argb: 'd6d6d6'},
                                    //                   bgColor : { argb: 'd6d6d6'}
                                    //               } },  
                                    }
                                }
                              }
                            ],
                          },
                        ];
                        */
                        
                        excel = null;
                        let exceljs =  require("@/plugins/exceljs.js");
                        if(!!exceljs) {
                            exceljs = exceljs.default;
                        }

                        await exceljs.createWorkbook(that, reportInfo.REPORT_PATH);
                        let worksheet = exceljs.worksheet();

                        const dsoMaster = {
                            type: 'grid',
                            selpro: 'HR_RPT_1020050_INDIVIDUAL_M',
                            para: p_param
                        };

                        const dsoDetail = {
                            type: 'grid',
                            selpro: 'HR_RPT_1020050_INDIVIDUAL_D',
                            para: p_param
                        };
                        let dataMaster = await this._dsoCall(dsoMaster, 'select', false);
                        let dataDetail = await this._dsoCall(dsoDetail, 'select', false);

                        if(dataDetail && dataDetail.length > 0) {
                          let _startRow = 1; let _startCol = 1; // col A
                          let _endRow = 51; let _endCol = 18 //col R

                          let _rowCount = _endRow - _startRow + 1

                          //copy trc
                          for (let i = 1; i < dataMaster.length; i++) {
                            let prevMaster = dataMaster[i-1];
                            let currMaster = dataMaster[i];

                            let prevDetails = dataDetail.filter(q => q["THR_EMP_PK"] == prevMaster["THR_EMP_PK"]);
                            let currDetails = dataDetail.filter(q => q["THR_EMP_PK"] == currMaster["THR_EMP_PK"]);

                            for(let j = 0; j < _rowCount; j++) {
                              let _sourceRow = _startRow + j + ((i - 1)*_rowCount) ;
                              let _targetRow = _startRow + j + (i*_rowCount) ;
                              exceljs.copyRow(_targetRow, _sourceRow, 'c');
                            }

                            worksheet.getRow(i*_rowCount).addPageBreak();

                            let insertData = (type) => {
                              let tmpIdx = type == "PREV" ? (i - 1) : i;
                              let tmpData =  type == "PREV" ? {...prevMaster} : {...currMaster};
                              let tmpDetails = type == "PREV" ? [...prevDetails] : [...currDetails];

                              let _Row1 = 1 + (tmpIdx*_rowCount);
                              let _Row3 = 3 + (tmpIdx*_rowCount);
                              let _Row4 = 4 + (tmpIdx*_rowCount);
                              let _Row5 = 5 + (tmpIdx*_rowCount);
                              let _Row49 = 49 + (tmpIdx*_rowCount);
                              let _StartDetail = 8 + (tmpIdx*_rowCount);
                              
                              //insert master
                              exceljs.getCellByAddress(that,`Q${_Row1}`).value = tmpData["WORK_MON"];
                              exceljs.getCellByAddress(that,`E${_Row3}`).value = tmpData["EMP_ID"];
                              exceljs.getCellByAddress(that,`O${_Row3}`).value = tmpData["ORG_NM"];
                              exceljs.getCellByAddress(that,`E${_Row4}`).value = tmpData["FULL_NAME"];
                              exceljs.getCellByAddress(that,`O${_Row4}`).value = tmpData["DIV"];
                              exceljs.getCellByAddress(that,`E${_Row5}`).value = tmpData["POS_TYPE"];
                              exceljs.getCellByAddress(that,`O${_Row5}`).value = tmpData["JOIN_DT"];
                              exceljs.getCellByAddress(that,`D${_Row49}`).value = tmpData["FULL_NAME"];

                              //insert detail
                              for(let _i = 0; _i < tmpDetails.length; _i++) {
                                let _DetailData = tmpDetails[_i];
                                if( _DetailData["IS_DISPLAY"] == 0 ) {
                                  worksheet.getRow(_StartDetail + _i).hidden = true;
                                } else {
                                  for(let _j = _startCol; _j <= _endCol; _j++ ) {
                                    let _cell = exceljs.getCellByIndex(that, _StartDetail + _i, _j);
                                    if(_cell.value != "" && _cell.value !=null && isNaN(_cell.value)) {
                                      try {
                                        _cell.value = _DetailData[`${_cell.value}`];
                                      } catch(e) {
                                        //console.log(e.message);
                                      }
                                    }
                                  }
                                }
                              }
                            }

                            insertData("PREV");
                            if(i == dataMaster.length - 1) {
                              insertData("CURR");
                            }
                          }
                        } else {
                          that.showNotification( "danger", that.$t("no_data_found"), "", 4000 );
                          return;
                        }

                        //download file excel sau khi xu ly xong
                        await exceljs.dowloadWorkbook(that, reportInfo.NAME + ".xlsx");
                        break;
                      }
                      case '05': {
                        let l_from_dt = fromDate;
                        if(that.selectedSalType == 2) //ky resign
                        {
                          let dsoGetPeriod = {
                            type: 'process',
                            updpro: 'HR_RPT_1020050_GET_PERIOD',
                            para: [this.tco_company_pk, that.selectedSalType, that.selectedPeriod, that.selectedMonth ]
                          };

                          const activePeriod = await this._dsoCall(dsoGetPeriod, 'process', false);
                          if(activePeriod) {
                            l_from_dt = activePeriod[0].FROM_DT;
                          }

                        }

                        let pa =[... p_param];
                        pa.push(l_from_dt);
                        pa.push(toDate);

                        let headerRows=[];
                        let headerRow1 = ["STT", "Mã NV", "Họ Tên", "Bộ Phận"];
                        let headerRow2 = ["NO","Employee Code","Full Name","Division"];
                        let colHiddens = [];

                        let dsoDayType = {
                          type: 'process',
                          updpro: 'HR_RPT_1020050_GET_DAY_TYPE',
                          para: [this.tco_company_pk, l_from_dt, toDate]
                        };

                        const dayTypes = await this._dsoCall(dsoDayType, 'process', false);


       

                        let startDate = moment(String(l_from_dt), "YYYYMMDD");
                        let endDate = (moment(String(toDate), "YYYYMMDD")).add(1, 'days');
                        let i = 0;

                        for (let d = startDate; d.isBefore(endDate); d.add(1, 'days')) {
                          let day  = dayTypes.find( q=> q["DD"] == (i+1) );

                          headerRow1.push(d.format("DD MMM"));
                          headerRow1.push("");
                          headerRow1.push("");
                          if(day["HOL_TYPE"] == null || day["HOL_TYPE"] == "") {
                            headerRow2.push("TC 150%");
                            headerRow2.push("TCĐ 180%");
                            headerRow2.push("TCĐ 210%");
                          } else if(day["HOL_TYPE"] == "SUN" ) {
                            headerRow2.push("TCCN 200%");
                            headerRow2.push("TCCNĐ 270%");
                            headerRow2.push("TCCNĐ 270%");
                            colHiddens.push(4+(i*3+2));
                          }  else if( day["HOL_TYPE"] == "HOL") {
                            headerRow2.push("TCCN 300%");
                            headerRow2.push("TCCNĐ 390%");
                            headerRow2.push("TCCNĐ 390%");
                            colHiddens.push(4+(i*3+2));
                          }
                          
                          i++;
                        }
                        for(; i < 31; i++) {
                          headerRow1 = headerRow1.concat(["","",""]);
                          headerRow2 = headerRow2.concat(["","",""]);
                          colHiddens = colHiddens.concat(  [ 4+(i*3+1), 4+(i*3+2), 4+(i*3+3)   ] );
                        }
                        headerRow1 = headerRow1.concat(["Total","","","","","","", "Xác nhận"]);
                        headerRow2 = headerRow2.concat(["TC 150%","TCĐ 180%","TCĐ 210%","TCCN 200%","TCCNĐ 270%","TCL 300%","TCLĐ 390%", ""]);

                        headerRows.push(headerRow1);
                        headerRows.push(headerRow2);

                        excel = [
                          //sheet1
                          {
                            sheet: 1,
                            insertHeader: [
                                {
                                    startRow: 5,
                                    column: "DB", // cái này để copy cell+style ra cho nhung cot phia sau
                                    merge: "cross",// merge co 3 gia tri: row (merge tren cung 1 dong), column (merge tren cung 1 cot), cross(merge tren duoi theo cot truoc )
                                    data: headerRows,
                                },
                            ],
                            insertRange: [
                                    { range: "A2:A2", proc: "HR_RPT_1020050_COMPANY_INFO", params: [pa[0], pa[5]] },//header
                            ],
                            insertRows: [
                                { startRow: 7, proc: "HR_RPT_1020050_OT_WORKING_DY", params: [...pa], dateColumns: ["JOIN_DT", "LEFT_DT"] }
                            ],
                            hideColumns: colHiddens
                          },
                        ];
                        break;
                      }
                    }

                    break;
                  }
                  case 'SP': {

                    switch(report) {
                      case '04': {
                        /*excel = [
                          //sheet1
                          {
                            sheet: 1,
                            insertRange2: [
                              { 
                                range: "A1:R50", proc: "HR_RPT_1020050_INDIVIDUAL_M", params: p_param, dateColumns: [ "JOIN_DT", "LEFT_DT" ], pageBreak: true 
                                , KEY: "THR_EMP_PK"
                                , details: {
                                  WORKING_SHEET : {  startRow: 6, proc: "HR_RPT_1020050_INDIVIDUAL_D", params: [...p_param]
                                    // , subStyle: { fill: {
                                    //                   type: 'pattern',
                                    //                   pattern:'solid',
                                    //                   fgColor : { argb: 'd6d6d6'},
                                    //                   bgColor : { argb: 'd6d6d6'}
                                    //               } },  
                                    }
                                }
                              }
                            ],
                          },
                        ];*/
                        excel = null;
                        let exceljs =  require("@/plugins/exceljs.js");
                        if(!!exceljs) {
                            exceljs = exceljs.default;
                        }

                        await exceljs.createWorkbook(that, reportInfo.REPORT_PATH);
                        let worksheet = exceljs.worksheet();

                        const dsoMaster = {
                            type: 'grid',
                            selpro: 'HR_RPT_1020050_INDIVIDUAL_M',
                            para: p_param
                        };

                        const dsoDetail = {
                            type: 'grid',
                            selpro: 'HR_RPT_1020050_INDIVIDUAL_D',
                            para: p_param
                        };
                        let dataMaster = await this._dsoCall(dsoMaster, 'select', false);
                        let dataDetail = await this._dsoCall(dsoDetail, 'select', false);

                        if(dataDetail && dataDetail.length > 0) {
                          let _startRow = 1; let _startCol = 1; // col A
                          let _endRow = 51; let _endCol = 18 //col R

                          let _rowCount = _endRow - _startRow + 1

                          //copy trc
                          for (let i = 1; i < dataMaster.length; i++) {
                            let prevMaster = dataMaster[i-1];
                            let currMaster = dataMaster[i];

                            let prevDetails = dataDetail.filter(q => q["THR_EMP_PK"] == prevMaster["THR_EMP_PK"]);
                            let currDetails = dataDetail.filter(q => q["THR_EMP_PK"] == currMaster["THR_EMP_PK"]);

                            for(let j = 0; j < _rowCount; j++) {
                              let _sourceRow = _startRow + j + ((i - 1)*_rowCount) ;
                              let _targetRow = _startRow + j + (i*_rowCount) ;
                              exceljs.copyRow(_targetRow, _sourceRow, 'c');
                            }

                            worksheet.getRow(i*_rowCount).addPageBreak();

                            let insertData = (type) => {
                              let tmpIdx = type == "PREV" ? (i - 1) : i;
                              let tmpData =  type == "PREV" ? {...prevMaster} : {...currMaster};
                              let tmpDetails = type == "PREV" ? [...prevDetails] : [...currDetails];

                              let _Row1 = 1 + (tmpIdx*_rowCount);
                              let _Row3 = 3 + (tmpIdx*_rowCount);
                              let _Row4 = 4 + (tmpIdx*_rowCount);
                              let _Row5 = 5 + (tmpIdx*_rowCount);
                              let _Row49 = 49 + (tmpIdx*_rowCount);
                              let _StartDetail = 8 + (tmpIdx*_rowCount);
                              
                              //insert master
                              exceljs.getCellByAddress(that,`Q${_Row1}`).value = tmpData["WORK_MON"];
                              exceljs.getCellByAddress(that,`E${_Row3}`).value = tmpData["EMP_ID"];
                              exceljs.getCellByAddress(that,`O${_Row3}`).value = tmpData["ORG_NM"];
                              exceljs.getCellByAddress(that,`E${_Row4}`).value = tmpData["FULL_NAME"];
                              exceljs.getCellByAddress(that,`O${_Row4}`).value = tmpData["DIV"];
                              exceljs.getCellByAddress(that,`E${_Row5}`).value = tmpData["POS_TYPE"];
                              exceljs.getCellByAddress(that,`O${_Row5}`).value = tmpData["JOIN_DT"];
                              exceljs.getCellByAddress(that,`D${_Row49}`).value = tmpData["FULL_NAME"];

                              //insert detail
                              for(let _i = 0; _i < tmpDetails.length; _i++) {
                                let _DetailData = tmpDetails[_i];
                                if( _DetailData["IS_DISPLAY"] == 0 ) {
                                  worksheet.getRow(_StartDetail + _i).hidden = true;
                                } else {
                                  for(let _j = _startCol; _j <= _endCol; _j++ ) {
                                    let _cell = exceljs.getCellByIndex(that, _StartDetail + _i, _j);
                                    if(_cell.value != "" && _cell.value !=null && isNaN(_cell.value)) {
                                      try {
                                        _cell.value = _DetailData[`${_cell.value}`];
                                      } catch(e) {
                                        //console.log(e.message);
                                      }
                                    }
                                  }
                                }
                              }
                            }

                            insertData("PREV");
                            if(i == dataMaster.length - 1) {
                              insertData("CURR");
                            }
                          }
                        } else {
                          that.showNotification( "danger", that.$t("no_data_found"), "", 4000 );
                          return;
                        }

                        //download file excel sau khi xu ly xong
                        await exceljs.dowloadWorkbook(that, reportInfo.NAME + ".xlsx");
                        break;
                      }
                      case '05': {

                        let l_from_dt = fromDate;
                        if(that.selectedSalType == 2) //ky resign
                        {
                          let dsoGetPeriod = {
                            type: 'process',
                            updpro: 'HR_RPT_1020050_GET_PERIOD',
                            para: [this.tco_company_pk, that.selectedSalType, that.selectedPeriod, that.selectedMonth ]
                          };

                          const activePeriod = await this._dsoCall(dsoGetPeriod, 'process', false);
                          if(activePeriod) {
                            l_from_dt = activePeriod[0].FROM_DT;
                          }

                        }

                        let pa =[... p_param];
                        pa.push(l_from_dt);
                        pa.push(toDate);

                        let headerRows=[];
                        let headerRow1 = ["STT", "Mã NV", "Họ Tên", "Bộ Phận"];
                        let headerRow2 = ["NO","Employee Code","Full Name","Division"];
                        let colHiddens = [];

                        let dsoDayType = {
                          type: 'process',
                          updpro: 'HR_RPT_1020050_GET_DAY_TYPE',
                          para: [this.tco_company_pk, l_from_dt, toDate]
                        };

                        const dayTypes = await this._dsoCall(dsoDayType, 'process', false);


       

                        let startDate = moment(String(l_from_dt), "YYYYMMDD");
                        let endDate = (moment(String(toDate), "YYYYMMDD")).add(1, 'days');
                        let i = 0;

                        for (let d = startDate; d.isBefore(endDate); d.add(1, 'days')) {
                          let day  = dayTypes.find( q=> q["DD"] == (i+1) );

                          headerRow1.push(d.format("DD MMM"));
                          headerRow1.push("");
                          headerRow1.push("");
                          headerRow1.push("");
                          if(day["HOL_TYPE"] == null || day["HOL_TYPE"] == "") {
                            headerRow2.push("TC 150%");
                            headerRow2.push("TCĐ 170%");
                            headerRow2.push("TCĐ 200%");
                            headerRow2.push("TCĐ 210%");
                          } else if(day["HOL_TYPE"] == "SUN" ) {
                            headerRow2.push("TCCN 200%");
                            headerRow2.push("TCCNĐ 270%");
                            headerRow2.push("");
                            headerRow2.push("");
                            colHiddens.push(4+(i*4+3));
                            colHiddens.push(4+(i*4+4));
                          }  else if( day["HOL_TYPE"] == "HOL") {
                            headerRow2.push("TCCN 300%");
                            headerRow2.push("TCCNĐ 390%");
                            headerRow2.push("");
                            headerRow2.push("");
                            colHiddens.push(4+(i*4+3));
                            colHiddens.push(4+(i*4+4));
                          }
                          
                          i++;
                        }
                        for(; i < 31; i++) {
                          headerRow1 = headerRow1.concat(["","","",""]);
                          headerRow2 = headerRow2.concat(["","","",""]);
                          colHiddens = colHiddens.concat(  [ 4+(i*4+1), 4+(i*4+2), 4+(i*4+3), 4+(i*4+4)   ] );
                        }
                        headerRow1 = headerRow1.concat(["Total","","","","","","","", "Xác nhận"]);
                        headerRow2 = headerRow2.concat(["TC 150%","TCĐ 170%","TCĐ 200%","TCĐ 210%","TCCN 200%","TCCNĐ 270%","TCL 300%","TCLĐ 390%", ""]);

                        headerRows.push(headerRow1);
                        headerRows.push(headerRow2);

                        excel = [
                          //sheet1
                          {
                            sheet: 1,
                            insertHeader: [
                                {
                                    startRow: 5,
                                    column: "EG", // cái này để copy cell+style ra cho nhung cot phia sau
                                    merge: "cross",// merge co 3 gia tri: row (merge tren cung 1 dong), column (merge tren cung 1 cot), cross(merge tren duoi theo cot truoc )
                                    data: headerRows,
                                },
                            ],
                            insertRange: [
                                    { range: "A2:A2", proc: "HR_RPT_1020050_COMPANY_INFO", params: [pa[0], pa[5]] },//header
                            ],
                            insertRows: [
                                { startRow: 7, proc: "HR_RPT_1020050_OT_WORKING_SP", params: [...pa], dateColumns: ["JOIN_DT", "LEFT_DT"] }
                            ],
                            hideColumns: colHiddens
                          },
                        ];
                        break;
                      }
                    }

                    break;
                  }

              }
          }

          return excel;
        },


        

    }
  }
</script>
