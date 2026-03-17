"use strict";
const Helpers = use('Helpers')
const Antl = use("Antl");
const Utils = use("Utils");
const DBService = use("DBService")
var Excel = use('exceljs');
var workbook = new Excel.Workbook();
class rpt2010080 {
    async report1({ request, response, auth }) {
        try {
            let { proc, para, paraHeader } = request.get(['proc', 'para', 'paraHeader'])
            const user = await auth.getUser()
                //console.log(user)
            if (!user) {
                return response.send(
                    Utils.response(false, "Request failed!", null)
                )
            } else {
                const p_language = request.header("accept-language", "ENG")
                var dtDetail = await DBService.callProcCursor(proc, para, p_language, user.USER_ID)
                if (dtDetail) {
                    dtDetail = dtDetail
                } else {
                    return response.send(Utils.response(false, "no_data_found", null))
                }
                //console.log(dtDetail)
                const templateFile = Helpers.resourcesPath('report/20/10/2010080.xlsx')
                var reportPath = `2010080_${user.USER_ID}.xlsx`
                const reportFile = Helpers.tmpPath(reportPath)
                await workbook.xlsx.readFile(templateFile)
                var worksheet = workbook.getWorksheet(1);

                // SET DATA		
                const font_bold = { bold: true };
                /*Set Header */
                var date = new Date();
                var objHeader = JSON.parse(paraHeader);
                var rowHeader = worksheet.getRow(5);
                rowHeader.getCell(2).value =  objHeader.DATE;
                rowHeader.getCell(6).value =  ""+date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
                rowHeader.commit();
                var pos = 8;
                //----------
                if(dtDetail.length>2){
                    worksheet.duplicateRow(pos,dtDetail.length-1,false);
                }
                for (var i = 0; i < dtDetail.length; i++) {

                    var row = worksheet.getRow(pos + i);

                    row.getCell(1).value = dtDetail[i].PARTNER_ID;
                    row.getCell(2).value = dtDetail[i].PARTNER_NAME;
                    row.getCell(3).value = dtDetail[i].VOUCHERNO;
                    row.getCell(4).value = dtDetail[i].ITEM_TYPE;
                    row.getCell(5).value = dtDetail[i].AR_AMT;
                    row.getCell(6).value = dtDetail[i].REMARK;
                    //row.font = font_bold;
                    row.commit();
                }
                await workbook.xlsx.writeFile(reportFile)
                return response.attachment(
                    reportFile,
                    `rpt2010080_${user.USER_ID}.xlsx` // custom name
                )
            }
        } catch (e) {
            return response.send(Utils.response(false, e.message, null))
        }
    }

}

module.exports = rpt2010080;