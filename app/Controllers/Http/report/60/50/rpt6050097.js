"use strict";
const Helpers = use('Helpers')
const Antl = use("Antl");
const Utils = use("Utils");
const DBService = use("DBService")
var Excel = use('exceljs');
var workbook = new Excel.Workbook();
class rpt6050097 {
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
                const templateFile = Helpers.resourcesPath('report/60/50/6050097.xlsx')
                let reportPath = `6050097_${user.USER_ID}.xlsx`
                const reportFile = Helpers.tmpPath(reportPath)
                await workbook.xlsx.readFile(templateFile)
                let worksheet = workbook.getWorksheet(1);

                // SET DATA		
                const font = { name: 'Batang', size: 8 };
                const font_bold = { name: 'Batang', size: 8, bold: true };
                let pos = 8;
                //----------
                let ttl_amt = 0;
                let ttl_tax_amt = 0;
                let ttl_total_amt = 0;
                let _rDate_start_merg = pos,
                    _rDate_end_merg = 0;
                let _rAcc_start_merg = pos,
                    _rAcc_end_merg = 0;
                let _rPO_start_merg = pos,
                    _rPO_end_merg = 0;
              //  let _AccCode = dtDetail.length > 0 ? dtDetail[0].AC_CD : "";
               // let _PONo = dtDetail.length > 0 ? dtDetail[0].PO_NO : "";
                worksheet.getCell('B5').value = dtDetail[0].PERIOD1 ;
                worksheet.getCell('B4').value = dtDetail[0].PARTNER_NM ;
                worksheet.duplicateRow(pos + 1, dtDetail.length - 2, true);
                for (let i = 0; i < dtDetail.length; i++) {

                    let row = worksheet.getRow(pos + i);

                    row.getCell(1).value = dtDetail[i].YYYYMM;
                    row.getCell(2).value = dtDetail[i].THIS_AP_AMT;
                    row.getCell(3).value = dtDetail[i].THIS_VAT_IN_AMT;
                    row.getCell(4).value = dtDetail[i].TT_AMT;
                   
                    
                    row.commit();
                }

                await workbook.xlsx.writeFile(reportFile)
                return response.attachment(
                    reportFile,
                    `rpt6050097_${user.USER_ID}.xlsx` // custom name
                )
            }
        } catch (e) {
            return response.send(Utils.response(false, e.message, null))
        }
    }

}

module.exports = rpt6050097;