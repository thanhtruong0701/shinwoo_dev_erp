"use strict";
const Helpers = use('Helpers')
const Antl = use("Antl");
const Utils = use("Utils");
const DBService = use("DBService")
var Excel = use('exceljs');
var workbook = new Excel.Workbook();
class rpt6060064 {
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
                const templateFile = Helpers.resourcesPath('report/60/60/6060064.xlsx')
                let reportPath = `6060064_${user.USER_ID}.xlsx`
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
               // let _AccCode = dtDetail.length > 0 ? dtDetail[0].AC_CD : "";
                
                worksheet.getCell('C4').value = dtDetail[0].PARTNER_NAME ;
                worksheet.getCell('H4').value = dtDetail[0].MONTH1 ;
                worksheet.duplicateRow(pos + 1, dtDetail.length, true);
                for (let i = 0; i < dtDetail.length; i++) {

                    let row = worksheet.getRow(pos + i);

                    row.getCell(1).value = i + 1;
                    row.getCell(2).value = dtDetail[i].PARTNER_ID;
                    row.getCell(3).value = dtDetail[i].PARTNER_NAME;
                    row.getCell(4).value = dtDetail[i].LAST_COLLECT;
                    row.getCell(5).value = dtDetail[i].LAST_END;
                    row.getCell(6).value = dtDetail[i].THIS_AR;

                    row.getCell(7).value = dtDetail[i].THIS_DISCOUNT;
                    row.getCell(8).value = dtDetail[i].THIS_NET_AMT;
                    row.getCell(9).value = dtDetail[i].THIS_VAT_AMT;
                    row.getCell(10).value = dtDetail[i].THIS_TT_AMT;
                    row.getCell(11).value = dtDetail[i].THIS_END_AMT;
                 

                    row.commit();
                }

                await workbook.xlsx.writeFile(reportFile)
                return response.attachment(
                    reportFile,
                    `rpt6060064_${user.USER_ID}.xlsx` // custom name
                )
            }
        } catch (e) {
            return response.send(Utils.response(false, e.message, null))
        }
    }

}

module.exports = rpt6060064;