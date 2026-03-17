"use strict";
const Helpers = use('Helpers')
const Antl = use("Antl");
const Utils = use("Utils");
const DBService = use("DBService")
var Excel = use('exceljs');
var workbook = new Excel.Workbook();
class rpt2010060 {
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
                let dtDetail = await DBService.callProcCursor(proc, para, p_language, user.USER_ID)
                if (dtDetail) {
                    dtDetail = dtDetail
                } else {
                    return response.send(Utils.response(false, "no_data_found", null))
                }
                //console.log(dtDetail)
                const templateFile = Helpers.resourcesPath('report/20/10/2010060.xlsx')
                let reportPath = `2010060_${user.USER_ID}.xlsx`
                const reportFile = Helpers.tmpPath(reportPath)
                await workbook.xlsx.readFile(templateFile)
                let worksheet = workbook.getWorksheet(1);

                // SET DATA		
                const font = { name: 'Batang', size: 8 };
                const font_bold = { name: 'Batang', size: 8, bold: true };

                
                /*Set Header */
                
                var objHeader = JSON.parse(paraHeader);


                let rowHeader = worksheet.getRow(5);

                let date = new Date();
                rowHeader.getCell(6).value =  objHeader.MONTH.substr(0,4)+"-"+objHeader.MONTH.substr(4,2);
                rowHeader.getCell(12).value =  ""+date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();

                rowHeader = worksheet.getRow(7);
                rowHeader.getCell(11).value = objHeader.ACT_BF_3;
                rowHeader.getCell(12).value = objHeader.ACT_BF_2;
                rowHeader.getCell(13).value = objHeader.PLAN_BF_1;
                rowHeader.getCell(14).value = objHeader.ACT_BF_12;
                rowHeader.getCell(15).value = objHeader.ACT_BF_11;
                rowHeader.commit();
                let pos = 8;
                //----------
               // let _AccCode = dtDetail.length > 0 ? dtDetail[0].AC_CD : "";
                /*let _PONo = dtDetail.length > 0 ? dtDetail[0].PO_NO : "";
                worksheet.getCell('F4').value = dtDetail[0].PERIOD1 ;
                worksheet.getCell('B4').value = dtDetail[0].PARTNER_NM ;
                worksheet.duplicateRow(pos + 1, dtDetail.length - 2, true);*/
                if(dtDetail.length>1){
                    worksheet.duplicateRow(pos,dtDetail.length-1,false);
                }
                
                for (let i = 0; i < dtDetail.length; i++) {

                    let row = worksheet.getRow(pos + i);

                    row.getCell(2).value = dtDetail[i].ITEM_TYPE;
                    row.getCell(3).value = dtDetail[i].ITEM_CODE;
                    row.getCell(4).value = dtDetail[i].ITEM_NAME;
                    row.getCell(5).value = dtDetail[i].PLAN_QTY;
                    row.getCell(6).value = dtDetail[i].PROD_PLAN_QTY;
                    row.getCell(7).value = dtDetail[i].PROD_QTY;

                    row.getCell(8).value = dtDetail[i].DELI_QTY;
                    row.getCell(9).value = dtDetail[i].STOCK_QTY;
                    row.getCell(10).value = dtDetail[i].DELI_PER;
                    row.getCell(11).value = dtDetail[i].ACT_BF_3;
                    row.getCell(12).value = dtDetail[i].ACT_BF_2;
                    row.getCell(13).value = dtDetail[i].PLAN_BF_1;
                    row.getCell(14).value = dtDetail[i].ACT_BF_12;
                    row.getCell(15).value = dtDetail[i].ACT_BF_11;
                    row.commit();
                }

                await workbook.xlsx.writeFile(reportFile)
                return response.attachment(
                    reportFile,
                    `rpt2010060_${user.USER_ID}.xlsx` // custom name
                )
            }
        } catch (e) {
            return response.send(Utils.response(false, e.message, null))
        }
    }

}

module.exports = rpt2010060;