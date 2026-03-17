"use strict";
const Helpers = use('Helpers')
const Antl = use("Antl");
const Utils = use("Utils");
const DBService = use("DBService")
var Excel = use('exceljs');
var workbook = new Excel.Workbook();
class rpt2010100 {
    async report1({ request, response, auth }) {
        try {
            let { para } = request.get(['para'])
            const user = await auth.getUser()
                //console.log(user)
            if (!user) {
                return response.send(
                    Utils.response(false, "Request failed!", null)
                )
            } else {
                var objParam = JSON.parse(para);
                const p_language = request.header("accept-language", "ENG")
                var dtDetail = await DBService.callProcCursor("LG_RPT_2010100_1", [objParam.AR_DT], p_language, user.USER_ID)
                if (dtDetail) {
                    dtDetail = dtDetail
                } else {
                    return response.send(Utils.response(false, "no_data_found", null))
                }
                //console.log(dtDetail)
                const templateFile = Helpers.resourcesPath('report/20/10/2010100_1.xlsx')
                var reportPath = `2010100_1_${user.USER_ID}.xlsx`
                const reportFile = Helpers.tmpPath(reportPath)
                await workbook.xlsx.readFile(templateFile)
                var worksheet = workbook.getWorksheet(1);

                // SET DATA		
                const font_bold = { bold: true };
                /*Set Header */
                var date = new Date();
                var rowHeader = worksheet.getRow(5);
                rowHeader.getCell(2).value =  objParam.AR_DT.substr(0,4)+"-"+objParam.AR_DT.substr(4,2)+"-"+objParam.AR_DT.substr(6,2);
                rowHeader.getCell(11).value =  ""+date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
                rowHeader.commit();
                var pos = 9;
                //----------
                if(dtDetail.length>2){
                    worksheet.duplicateRow(pos,dtDetail.length-1,false);
                }
                for (var i = 0; i < dtDetail.length; i++) {

                    var row = worksheet.getRow(pos + i);
                    if(dtDetail[i].SALESPERSON == "" || dtDetail[i].SALESPERSON == undefined || dtDetail[i].SALESPERSON == null){
                        row.getCell(1).value = "SUM Total:";
                    }else if(dtDetail[i].PARENT_CODE == "" || dtDetail[i].PARENT_CODE == undefined || dtDetail[i].PARENT_CODE == null){
                        row.getCell(1).value = dtDetail[i].SALESPERSON;
                        row.getCell(2).value = "Sub Total "+dtDetail[i].SALESPERSON;
                    }else if(dtDetail[i].CUS_AREA_NM == "" || dtDetail[i].CUS_AREA_NM == undefined || dtDetail[i].CUS_AREA_NM == null){
                        row.getCell(1).value = dtDetail[i].SALESPERSON;
                        row.getCell(2).value = dtDetail[i].PARENT_CODE;
                        row.getCell(3).value = "Sub Total "+dtDetail[i].PARENT_CODE;
                    }else{
                        row.getCell(1).value = dtDetail[i].SALESPERSON;
                        row.getCell(2).value = dtDetail[i].PARENT_CODE;
                        row.getCell(3).value = dtDetail[i].CUS_AREA_NM;
                    }
                    row.getCell(4).value = dtDetail[i].DATE_TYPE_10;
                    row.getCell(5).value = dtDetail[i].DATE_TYPE_20;
                    row.getCell(6).value = dtDetail[i].DATE_TYPE_30;
                    row.getCell(7).value = dtDetail[i].DATE_TYPE_TT;
                    row.getCell(8).value = dtDetail[i].CURR_MONTH_10;
                    row.getCell(9).value = dtDetail[i].CURR_MONTH_20;
                    row.getCell(10).value = dtDetail[i].CURR_MONTH_30;
                    row.getCell(11).value = dtDetail[i].CURR_MONTH_TT;
                    //row.font = font_bold;
                    row.commit();
                }
                await workbook.xlsx.writeFile(reportFile)
                return response.attachment(
                    reportFile,
                    `rpt2010100_1_${user.USER_ID}.xlsx` // custom name
                )
            }
        } catch (e) {
            return response.send(Utils.response(false, e.message, null))
        }
    }
    async report2({ request, response, auth }) {
        try {
            let { para } = request.get(['para'])
            const user = await auth.getUser()
                //console.log(user)
            if (!user) {
                return response.send(
                    Utils.response(false, "Request failed!", null)
                )
            } else {
                var objParam = JSON.parse(para);
                const p_language = request.header("accept-language", "ENG")
                var dtDetail = await DBService.callProcCursor("LG_RPT_2010100_2", [objParam.AR_DT], p_language, user.USER_ID)
                if (dtDetail) {
                    dtDetail = dtDetail
                } else {
                    return response.send(Utils.response(false, "no_data_found", null))
                }
                //console.log(dtDetail)
                const templateFile = Helpers.resourcesPath('report/20/10/2010100_2.xlsx')
                var reportPath = `2010100_2_${user.USER_ID}.xlsx`
                const reportFile = Helpers.tmpPath(reportPath)
                await workbook.xlsx.readFile(templateFile)
                var worksheet = workbook.getWorksheet(1);

                // SET DATA		
                const font_bold = { bold: true };
                /*Set Header */
                var date = new Date();
                var rowHeader = worksheet.getRow(5);
                rowHeader.getCell(2).value =  objParam.AR_DT.substr(0,4)+"-"+objParam.AR_DT.substr(4,2)+"-"+objParam.AR_DT.substr(6,2);
                rowHeader.getCell(11).value =  ""+date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
                rowHeader.commit();
                var pos = 9;
                //----------
                if(dtDetail.length>2){
                    worksheet.duplicateRow(pos,dtDetail.length-1,false);
                }
                for (var i = 0; i < dtDetail.length; i++) {

                    var row = worksheet.getRow(pos + i);

                    if(dtDetail[i].PARENT_CODE == "" || dtDetail[i].PARENT_CODE == undefined || dtDetail[i].PARENT_CODE == null){
                        row.getCell(1).value = "SUM Total:";
                    }else if(dtDetail[i].CUS_AREA_NM == "" || dtDetail[i].CUS_AREA_NM == undefined || dtDetail[i].CUS_AREA_NM == null){
                        row.getCell(1).value = dtDetail[i].PARENT_CODE;
                        row.getCell(2).value = "Sub Total "+dtDetail[i].PARENT_CODE;
                    }else if(dtDetail[i].CUS_AREA_NM == "" || dtDetail[i].CUS_AREA_NM == undefined || dtDetail[i].CUS_AREA_NM == null){
                        row.getCell(1).value = dtDetail[i].PARENT_CODE;
                        row.getCell(2).value = dtDetail[i].CUS_AREA_NM;
                        row.getCell(3).value = "Sub Total "+dtDetail[i].CUS_AREA_NM;
                    }else{
                        row.getCell(1).value = dtDetail[i].PARENT_CODE;
                        row.getCell(2).value = dtDetail[i].CUS_AREA_NM;
                        row.getCell(3).value = dtDetail[i].PARTNER_NAME;
                    }
                    
                    row.getCell(4).value = dtDetail[i].DATE_TYPE_10;
                    row.getCell(5).value = dtDetail[i].DATE_TYPE_20;
                    row.getCell(6).value = dtDetail[i].DATE_TYPE_30;
                    row.getCell(7).value = dtDetail[i].DATE_TYPE_TT;
                    row.getCell(8).value = dtDetail[i].CURR_MONTH_10;
                    row.getCell(9).value = dtDetail[i].CURR_MONTH_20;
                    row.getCell(10).value = dtDetail[i].CURR_MONTH_30;
                    row.getCell(11).value = dtDetail[i].CURR_MONTH_TT;
                    //row.font = font_bold;
                    row.commit();
                }
                await workbook.xlsx.writeFile(reportFile)
                return response.attachment(
                    reportFile,
                    `rpt2010100_2_${user.USER_ID}.xlsx` // custom name
                )
            }
        } catch (e) {
            return response.send(Utils.response(false, e.message, null))
        }
    }
}

module.exports = rpt2010100;