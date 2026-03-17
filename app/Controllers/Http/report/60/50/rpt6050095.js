"use strict";
const Helpers = use('Helpers')
const Antl = use("Antl");
const Utils = use("Utils");
const DBService = use("DBService")
var Excel = use('exceljs');
var workbook = new Excel.Workbook();
class rpt6050095 {
    async Report1({ request, response, auth }) {
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
                const templateFile = Helpers.resourcesPath('report/60/50/6050095.xlsx')
                let reportPath = `6050095_${user.USER_ID}.xlsx`
                const reportFile = Helpers.tmpPath(reportPath)
                await workbook.xlsx.readFile(templateFile)
                let worksheet = workbook.getWorksheet(1);

                // SET DATA		
                const font = { name: 'Batang',size: 8 };   
                const font_bold = { name: 'Batang',size: 8 ,bold:true};
                let pos = 7;
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
                let _AccCode = dtDetail.length > 0 ? dtDetail[0].AC_CD : "";
                let _PONo = dtDetail.length > 0 ? dtDetail[0].PO_NO : "";
              
                worksheet.duplicateRow(pos+1,dtDetail.length-2,true);
                for (let i = 0; i < dtDetail.length; i++) {                  
        
                    let row = worksheet.getRow(pos + i);
                   
                    row.getCell(1).value = dtDetail[i].TR_DATE;
                    row.getCell(2).value = dtDetail[i].AC_CD;
                    row.getCell(3).value = dtDetail[i].AC_NM;
                    row.getCell(4).value = dtDetail[i].PO_NO;
                    row.getCell(5).value = dtDetail[i].ITEM_CODE;
                    row.getCell(6).value = dtDetail[i].ITEM_NAME;
                    row.getCell(7).value = dtDetail[i].SPEC;
                    row.getCell(8).value = dtDetail[i].QTY;
                     
                    row.getCell(9).value = dtDetail[i].U_PRICE;                   
                    row.getCell(10).value = dtDetail[i].AMOUNT;
                    row.getCell(11).value = dtDetail[i].VAT_AMT;
                    row.getCell(12).value = dtDetail[i].DEBIT_AMT;
                    row.getCell(13).value = dtDetail[i].CREDIT_AMT;
                    row.getCell(14).value = dtDetail[i].BAL_AMT;

                    /*row.getCell(15).value = dtDetail[i].BOLD_YN;
                    if (dtDetail[i].BOLD_YN == "Y") {                                       
                        worksheet.getRow(pos + i).font = font_bold;  
                    }    */
                    _rDate_end_merg = pos + i;
                    _rAcc_end_merg = pos + i;
                    _rPO_end_merg = pos + i;
                     
                    if (dtDetail[i].BOLD_YN == "Y") {                                       
                       // row.font = font_bold;                       
                        worksheet.mergeCells(_rDate_start_merg, 1, _rDate_end_merg, 1);
                        worksheet.mergeCells(_rAcc_start_merg, 2, _rAcc_end_merg - 1, 2);
                        worksheet.mergeCells(_rAcc_start_merg, 3, _rAcc_end_merg - 1, 3);
                        worksheet.mergeCells(_rPO_start_merg, 4, _rPO_end_merg - 1, 4);
                        _rAcc_start_merg = pos + i;
                        _rPO_start_merg = pos + i;
                        _rDate_start_merg = pos + i + 1;

                        _AccCode = dtDetail[i].AC_CD;
                        _PONo = dtDetail[i].PO_NO;
                    } else if (dtDetail[i].AC_CD != _AccCode) {
                        worksheet.mergeCells(_rAcc_start_merg, 2, _rAcc_end_merg - 1, 2);
                        worksheet.mergeCells(_rAcc_start_merg, 3, _rAcc_end_merg - 1, 3);
                        worksheet.mergeCells(_rPO_start_merg, 4, _rPO_end_merg - 1, 4);

                        _rAcc_start_merg = pos + i;
                        _rPO_start_merg = pos + i;

                        _AccCode = dtDetail[i].AC_CD;
                        _PONo = dtDetail[i].PO_NO;
                    } else if (dtDetail[i].PO_NO != _PONo) {
                        worksheet.mergeCells(_rPO_start_merg, 4, _rPO_end_merg - 1, 4);
                        _rPO_start_merg = pos + i;
                        _PONo = dtDetail[i].PO_NO;
                    }
                    row.commit();
                }

                await workbook.xlsx.writeFile(reportFile)
                return response.attachment(
                        reportFile,
                        `rpt6050095_${user.USER_ID}.xlsx` // custom name
                    )
            }
        } catch (e) {
            return response.send(Utils.response(false, e.message, null))
        }
    }

}

module.exports = rpt6050095;