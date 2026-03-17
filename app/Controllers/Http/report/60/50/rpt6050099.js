"use strict";
const Helpers = use('Helpers')
const Antl = use("Antl");
const Utils = use("Utils");
const DBService = use("DBService")
var Excel = use('exceljs');
var workbook = new Excel.Workbook();
class rpt6050099 {
    async report1({ request, response, auth }) {
        try {
            let { proc, para } = request.get(['proc', 'para'])
                //const { proc, para } = request.all()

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
                const templateFile = Helpers.resourcesPath('report/60/50/6050099.xlsx')
                let reportPath = `6050099_${user.USER_ID}.xlsx`
                const reportFile = Helpers.tmpPath(reportPath)
                await workbook.xlsx.readFile(templateFile)
                let worksheet = workbook.getWorksheet(1);

                // SET DATA		
                const font = { name: 'Batang', size: 8 };
                const font_bold = { name: 'Batang', size: 8, bold: true };
                let pos = 9;
                //----------
                let ttl_THIS_AR_AMT = 0;
                let ttl_THIS_VAT_OUT_AMT = 0;
                let ttl_THIS_AP_AMT = 0;

                let ttl_THIS_VAT_IN_AMT = 0;
                let ttl_LAST_AR_AMT = 0;
                let ttl_LAST_VAT_OUT_AMT = 0;
                let ttl_LAST_AP_AMT = 0;
                let ttl_LAST_VAT_IN_AMT = 0;
               
              
                worksheet.getCell('B4').value = dtDetail[0].PERIOD1 ;
               // worksheet.getCell('E4').value = dtDetail[0].PARTNER_NM ;
                worksheet.duplicateRow(pos + 1, dtDetail.length - 2, true);
                let row_total = worksheet.getRow(pos + dtDetail.length );
                for (let i = 0; i < dtDetail.length; i++) {

                    let row = worksheet.getRow(pos + i);

                    row.getCell(1).value = dtDetail[i].MM;
                    row.getCell(2).value = dtDetail[i].THIS_AR_AMT;
                    row.getCell(3).value = dtDetail[i].THIS_VAT_OUT_AMT;
                    row.getCell(4).value = dtDetail[i].RATE1;

                    row.getCell(5).value = dtDetail[i].THIS_AP_AMT;
                    row.getCell(6).value = dtDetail[i].THIS_VAT_IN_AMT;
                    row.getCell(7).value = dtDetail[i].RATE2;
                    row.getCell(8).value = dtDetail[i].LAST_AR_AMT;
                   
                    row.getCell(9).value = dtDetail[i].LAST_VAT_OUT_AMT;
                    row.getCell(10).value = dtDetail[i].LAST_AP_AMT;
                    row.getCell(11).value = dtDetail[i].LAST_VAT_IN_AMT;
                   
                  /*  ttl_THIS_AR_AMT        = ttl_THIS_AR_AMT + dtDetail[i].THIS_AR_AMT;
                    ttl_THIS_VAT_OUT_AMT   = ttl_THIS_VAT_OUT_AMT + dtDetail[i].THIS_VAT_OUT_AMT;
                    ttl_THIS_AP_AMT        = ttl_THIS_AP_AMT + dtDetail[i].THIS_AP_AMT;

                    ttl_THIS_VAT_IN_AMT    = ttl_THIS_VAT_IN_AMT + dtDetail[i].THIS_VAT_IN_AMT;
                    ttl_LAST_AR_AMT        = ttl_LAST_AR_AMT +  dtDetail[i].LAST_AR_AMT;
                    ttl_LAST_VAT_OUT_AMT   = ttl_LAST_VAT_OUT_AMT + dtDetail[i].LAST_VAT_OUT_AMT;
                    ttl_LAST_AP_AMT        = ttl_LAST_AP_AMT + dtDetail[i].LAST_AP_AMT;
                    ttl_LAST_VAT_IN_AMT    = ttl_LAST_VAT_IN_AMT + dtDetail[i].LAST_VAT_IN_AMT;*/
                    row.commit();
                }
                /*row_total.getCell(2).value = ttl_THIS_AR_AMT;
                row_total.getCell(3).value = ttl_THIS_VAT_OUT_AMT;
                row_total.getCell(5).value = ttl_THIS_AP_AMT;
                row_total.getCell(6).value = ttl_THIS_VAT_IN_AMT;
                row_total.getCell(8).value = ttl_LAST_AR_AMT;
                row_total.getCell(9).value = ttl_LAST_VAT_OUT_AMT;
                row_total.getCell(10).value = ttl_LAST_AP_AMT;
                row_total.getCell(11).value = ttl_LAST_VAT_IN_AMT;*/

                await workbook.xlsx.writeFile(reportFile)
                return response.attachment(
                    reportFile,
                    `rpt6050099_${user.USER_ID}.xlsx` // custom name
                )
            }
        } catch (e) {
            return response.send(Utils.response(false, e.message, null))
        }
    }

}

module.exports = rpt6050099;