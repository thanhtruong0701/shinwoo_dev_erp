"use strict";
const Helpers = use('Helpers')
const Antl = use("Antl");
const Utils = use("Utils");
const DBService = use("DBService")
var Excel = use('exceljs');
var workbook = new Excel.Workbook();
class rpt6060066 {
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
                const templateFile = Helpers.resourcesPath('report/60/60/6060066.xlsx')
                let reportPath = `6060066_${user.USER_ID}.xlsx`
                const reportFile = Helpers.tmpPath(reportPath)
                await workbook.xlsx.readFile(templateFile)
                let worksheet = workbook.getWorksheet(1);

                // SET DATA		
                const font = { name: 'Batang', size: 8 };
                const font_bold = { name: 'Batang', size: 8, bold: true };
                let pos = 6;
                //----------
                let ttl_amt = 0;
                let ttl_tax_amt = 0;
                let ttl_ar_amt = 0;
               
              
                worksheet.getCell('B4').value = dtDetail[0].PERIOD1 ;
               // worksheet.getCell('E4').value = dtDetail[0].PARTNER_NM ;
               if(dtDetail.length>1)
               {
                       worksheet.duplicateRow(pos,dtDetail.length-1,true);
               }  
               // worksheet.duplicateRow(pos + 1, dtDetail.length - 1, true);
                for (let i = 0; i < dtDetail.length; i++) {

                    let row = worksheet.getRow(pos);

                    row.getCell(1).value = dtDetail[i].YYYYMM;
                    row.getCell(2).value = dtDetail[i].THIS_AR_AMT;
                    row.getCell(3).value = dtDetail[i].THIS_VAT_OUT_AMT;
                    row.getCell(4).value = dtDetail[i].TT_AMT;
                   
                    ttl_amt     = ttl_amt + dtDetail[i].TT_AMT;
                    ttl_tax_amt = ttl_tax_amt + dtDetail[i].THIS_VAT_OUT_AMT;
                    ttl_ar_amt  = ttl_ar_amt + dtDetail[i].THIS_AR_AMT;
                    row.commit();
                    pos = pos + 1; 
                }
                //worksheet.getCell(pos, 2).value = total_amt;
                let row_total = worksheet.getRow(pos);
                row_total.getCell(2).value = ttl_ar_amt;
                row_total.getCell(3).value = ttl_tax_amt;
                row_total.getCell(4).value = ttl_amt;
                await workbook.xlsx.writeFile(reportFile)
                return response.attachment(
                    reportFile,
                    `rpt6060066_${user.USER_ID}.xlsx` // custom name
                )
            }
        } catch (e) {
            return response.send(Utils.response(false, e.message, null))
        }
    }

}

module.exports = rpt6060066;