"use strict";
const Helpers = use('Helpers')
const Antl = use("Antl");
const Utils = use("Utils");
const DBService = use("DBService")
var Excel = use('exceljs');
var workbook = new Excel.Workbook();
class rpt2010090 {
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
                var dtDetail = await DBService.callProcCursor("LG_RPT_2010090_1", [objParam.AR_DT], p_language, user.USER_ID);
                var dtSummary = await DBService.callProcCursor("LG_RPT_2010090_2", [objParam.AR_DT], p_language, user.USER_ID)
                if (dtDetail) {
                    dtDetail = dtDetail
                } else {
                    return response.send(Utils.response(false, "no_data_found", null))
                }

                if (dtSummary) {
                    dtSummary = dtSummary
                }
                const templateFile = Helpers.resourcesPath('report/20/10/2010090.xlsx')
                var reportPath = `2010090_${user.USER_ID}.xlsx`
                const reportFile = Helpers.tmpPath(reportPath)
                await workbook.xlsx.readFile(templateFile)
                var worksheet = workbook.getWorksheet(1);
                
                var date = new Date();
                var rowHeader = worksheet.getRow(5);
                rowHeader.getCell(2).value =   objParam.AR_DT.substr(0,4)+"-"+objParam.AR_DT.substr(4,2)+"-"+objParam.AR_DT.substr(6,2);
                rowHeader.getCell(6).value =  ""+date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
                rowHeader.commit();

                var posSummary = 8;
                for (var i = 0; i < dtSummary.length; i++) {

                    var row = worksheet.getRow(posSummary + i);

                    row.getCell(3).value = dtSummary[i].ITEM_TYPE_10;
                    row.getCell(4).value = dtSummary[i].ITEM_TYPE_20;
                    row.getCell(5).value = dtSummary[i].ITEM_TYPE_30;
                    row.getCell(6).value = dtSummary[i].AR_AMT;
                    //row.font = font_bold;
                    row.commit();
                }

                var pos = 14;
                //----------
                if(dtDetail.length>2){
                    worksheet.duplicateRow(pos,dtDetail.length-1,false);
                }
                for (var i = 0; i < dtDetail.length; i++) {

                    var row = worksheet.getRow(pos + i);

                    row.getCell(1).value = dtDetail[i].PARTNER_ID;
                    row.getCell(2).value = dtDetail[i].PARTNER_NM;
                    row.getCell(3).value = dtDetail[i].ITEM_TYPE_10;
                    row.getCell(4).value = dtDetail[i].ITEM_TYPE_20;
                    row.getCell(5).value = dtDetail[i].ITEM_TYPE_30;
                    row.getCell(6).value = dtDetail[i].AR_AMT;
                    //row.font = font_bold;
                    row.commit();
                }
                await workbook.xlsx.writeFile(reportFile)
                return response.attachment(
                    reportFile,
                    `rpt2010090_${user.USER_ID}.xlsx` // custom name
                )
            }
        } catch (e) {
            return response.send(Utils.response(false, e.message, null))
        }
    }

}

module.exports = rpt2010090;