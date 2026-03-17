"use strict";
const Helpers = use('Helpers')
const Antl = use("Antl");
const Utils = use("Utils");
const DBService = use("DBService")
var Excel = use('exceljs');
var workbook = new Excel.Workbook();
class rpt6060062_1 {
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
                let dtm = await DBService.callProcCursor("ac_rpt_6060062_7", para, p_language, user.USER_ID)
                if (dtm) {
                    dtm = dtm
                } else {
                    return response.send(Utils.response(false, "no_data_found", null))
                }
                let dtDetail = await DBService.callProcCursor(proc, para, p_language, user.USER_ID)
                if (dtDetail) {
                    dtDetail = dtDetail
                } else {
                    return response.send(Utils.response(false, "no_data_found", null))
                }
                //console.log(dtDetail)
                const templateFile = Helpers.resourcesPath('report/60/60/6060062_1.xlsx')
                let reportPath = `6060062_1_${user.USER_ID}.xlsx`
                const reportFile = Helpers.tmpPath(reportPath)
                await workbook.xlsx.readFile(templateFile)
                let worksheet = workbook.getWorksheet(1);

                // SET DATA		
                const font = { name: 'Batang', size: 8 };
                const font_bold = { name: 'Batang', size: 8, bold: true };
                let pos = 11;
                //----------
                let ttl_amt = 0;
                let ttl_tax_amt = 0;
                let ttl_ar_amt = 0;
               
              
                worksheet.getCell('C2').value = dtm[0].PERIOD_ ;
                worksheet.getCell('C3').value = dtm[0].ISSUE_DT ;
                worksheet.getCell('C4').value = dtm[0].PARTNER_NAME ;
                worksheet.getCell('B5').value = dtm[0].PHONE_NO ;
                worksheet.getCell('H5').value = dtm[0].FAX_NO ;
                worksheet.getCell('P2').value = dtm[0].TAX_CODE ;
                worksheet.getCell('P4').value = dtm[0].ADDR1 ;
                worksheet.getCell('E7').value = dtm[0].BEGIN_AMT ;
                worksheet.getCell('J7').value = dtm[0].NET_AMT ;
                worksheet.getCell('J8').value = dtm[0].VAT_AMT ;
                worksheet.getCell('P7').value = dtm[0].COLLECT_AMT ;
                worksheet.getCell('U7').value = dtm[0].END_AMT ;
               // worksheet.getCell('E4').value = dtDetail[0].PARTNER_NM ;
                if( dtDetail.length > 40 )
                {
                    worksheet.duplicateRow(12 + 1, dtDetail.length - 40, true);
                }    
                let row_total = worksheet.getRow(pos + dtDetail.length );
                for (let i = 0; i < dtDetail.length; i++) {

                    let row = worksheet.getRow(pos + i);
                    
                   // worksheet.insertRow(pos + i, '');
                    row.getCell(1).value = dtDetail[i].MM;
                    row.getCell(2).value = dtDetail[i].DD;
                    row.getCell(3).value = dtDetail[i].DISCOUNT_RATE_1;
                    row.getCell(4).value = dtDetail[i].DISCOUNT_RATE_2;
                    row.getCell(5).value = dtDetail[i].DISCOUNT_RATE_3;
                    row.getCell(6).value = dtDetail[i].DISCOUNT_RATE_4;
                    row.getCell(7).value = dtDetail[i].SPEC_NM;
                    row.getCell(9).value = dtDetail[i].ITEM_NAME;
                    row.getCell(17).value = dtDetail[i].ITEM_AMOUNT;
                    row.getCell(20).value = dtDetail[i].DC_AMT_TT;
                    row.getCell(23).value = dtDetail[i].TT_AMOUNT;
                   // worksheet.mergeCells(7, 1, 8, 1);
                    row.commit();
                }
                //row_total.getCell(2).value = ttl_ar_amt;
                //row_total.getCell(3).value = ttl_tax_amt;
               // row_total.getCell(4).value = ttl_amt;
                await workbook.xlsx.writeFile(reportFile)
                return response.attachment(
                    reportFile,
                    `rpt6060062_1_${user.USER_ID}.xlsx` // custom name
                )
            }
        } catch (e) {
            return response.send(Utils.response(false, e.message, null))
        }
    }

}

module.exports = rpt6060062_1;