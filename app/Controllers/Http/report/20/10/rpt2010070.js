"use strict";
const Helpers = use('Helpers')
const Antl = use("Antl");
const Utils = use("Utils");
const DBService = use("DBService")
var Excel = use('exceljs');
var workbook = new Excel.Workbook();
class rpt2010070 {
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
                const templateFile = Helpers.resourcesPath('report/20/10/2010070.xlsx')
                var reportPath = `2010070_${user.USER_ID}.xlsx`
                const reportFile = Helpers.tmpPath(reportPath)
                await workbook.xlsx.readFile(templateFile)
                var worksheet = workbook.getWorksheet(1);

                // SET DATA		
                const font = { name: 'Batang', size: 8 };
                const font_bold = { name: 'Batang', size: 8, bold: true };

                
                /*Set Header */
                
                var objHeader = JSON.parse(paraHeader);
                var rowHeader = worksheet.getRow(4);
                var date = new Date();
                rowHeader.getCell(2).value =  objHeader.ITEM_NM;
                rowHeader.commit();
                var rowHeader = worksheet.getRow(5);
                rowHeader.getCell(2).value =  objHeader.PERIOD;
                rowHeader.getCell(9).value =  ""+date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
                rowHeader.commit();
                var pos = 8;
                //----------
                if(dtDetail.length>2){
                    worksheet.duplicateRow(pos,dtDetail.length-1,false);
                }
                for (var i = 0; i < dtDetail.length; i++) {

                    var row = worksheet.getRow(pos + i);

                    row.getCell(1).value = dtDetail[i].TR_DATE;
                    row.getCell(2).value = dtDetail[i].VOUCHERNO;
                    row.getCell(3).value = dtDetail[i].PARTNER_ID;
                    row.getCell(4).value = dtDetail[i].PARTNER_NAME;
                    row.getCell(6).value = dtDetail[i].QTY;
                    row.getCell(6).value = dtDetail[i].U_PRICE;

                    row.getCell(7).value = dtDetail[i].NET_TR_AMT;
                    row.getCell(8).value = dtDetail[i].TT_DC_AMT;
                    row.getCell(9).value = dtDetail[i].AR_AMT;
                    row.commit();
                }

                await workbook.xlsx.writeFile(reportFile)
                return response.attachment(
                    reportFile,
                    `rpt2010070_${user.USER_ID}.xlsx` // custom name
                )
            }
        } catch (e) {
            return response.send(Utils.response(false, e.message, null))
        }
    }

}

module.exports = rpt2010070;