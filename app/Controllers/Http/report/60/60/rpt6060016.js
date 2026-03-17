"use strict";
const Helpers = use('Helpers')
const Antl = use("Antl");
const Utils = use("Utils");
const DBService = use("DBService")
var Excel = use('exceljs');
var workbook = new Excel.Workbook();
class rpt6060030 {
    async report1({ request, response, auth }) {
        try {
            let { proc, para } = request.get(['proc', 'para'])
            const user = await auth.getUser();
            if (!user) {
                return response.send(
                    Utils.response(false, "Request failed!", null)
                )
            } else {
                const p_language = request.header("accept-language", "ENG")
                let dtMaster = await DBService.callProcCursor("AC_RPT_6060016_MST", para, p_language, user.USER_ID)
                let dtDetail = await DBService.callProcCursor(proc, para, p_language, user.USER_ID)
                const templateFile = Helpers.resourcesPath('report/60/60/6060016.xlsx')
                let reportPath = `6060016_${user.USER_ID}.xlsx`
                const reportFile = Helpers.tmpPath(`6060016_${user.USER_ID}.xlsx`)
                await workbook.xlsx.readFile(templateFile)
                let worksheet = workbook.getWorksheet(1);

                // SET DATA		
                let pos = 9;
                let l_TOT_NET_TR_AMT = 0,l_TOT_NET_BK_AMT = 0, l_TOT_VAT_TR_AMT = 0 , l_TOT_VAT_BK_AMT = 0 , l_TOT_TR_AMT = 0, l_TOT_BK_AMT = 0;
                //----------
                let date_ob = new Date();
                // adjust 0 before single digit date
                let date = ("0" + date_ob.getDate()).slice(-2);
                let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
                let year = date_ob.getFullYear();

                worksheet.getCell('A1').value = dtMaster[0].PARTNER_LNAME;
                worksheet.getCell('A2').value = "Print date :" + date +"-"+ month +"-"+ year; 
                if(dtDetail.length > 0)
                {
                    worksheet.duplicateRow(pos, dtDetail.length-1, true);
                    for (let i = 0; i < dtDetail.length ; i++) {

                        let row = worksheet.getRow(pos + i);

                        row.getCell(1).value  = dtDetail[i].SEQ;
                        row.getCell(2).value  = dtDetail[i].VOUCHERNO;
                        row.getCell(3).value  = dtDetail[i].TR_DATE;
                        row.getCell(4).value  = dtDetail[i].CRT_BY;
                        row.getCell(5).value  = dtDetail[i].TR_CCY;
                        row.getCell(6).value  = dtDetail[i].TR_RATE;
                        row.getCell(7).value  = dtDetail[i].FORM_NO;
                        row.getCell(8).value  = dtDetail[i].SERIAL_NO;
                        row.getCell(9).value  = dtDetail[i].INVOICE_DATE;
                        row.getCell(10).value = dtDetail[i].INVOICE_NO;
                        row.getCell(11).value = dtDetail[i].E_STATUS;
                        row.getCell(12).value = dtDetail[i].INVOICE_TYPE;    
                        row.getCell(13).value = dtDetail[i].PARTNER_ID;
                        row.getCell(14).value = dtDetail[i].PARTNER_NAME;
                        row.getCell(15).value = dtDetail[i].TOT_NET_TR_AMT;
                        row.getCell(16).value = dtDetail[i].TOT_NET_BK_AMT;
                        row.getCell(17).value = dtDetail[i].VAT_RATE;
                        row.getCell(18).value = dtDetail[i].TOT_VAT_TR_AMT;
                        row.getCell(19).value = dtDetail[i].TOT_VAT_BK_AMT;  
                        row.getCell(20).value = dtDetail[i].TOT_TR_AMT;
                        row.getCell(21).value = dtDetail[i].TOT_BK_AMT;  
                        row.getCell(22).value = dtDetail[i].REMARK;
                        row.getCell(23).value = dtDetail[i].REMARK2;
                        row.getCell(24).value = dtDetail[i].AC_CD;
                        row.getCell(25).value = dtDetail[i].AC_NM;
                        row.getCell(27).value = dtDetail[i].DECLARE_NO;
                        row.getCell(28).value = dtDetail[i].BIZ_PLACE;

                       
                        row.getCell(29).value = dtDetail[i].FORM_NO_REF;
                        row.getCell(30).value = dtDetail[i].SERIAL_NO_REF;
                        row.getCell(31).value = dtDetail[i].INVOICE_DT_REF;
                        row.getCell(32).value = dtDetail[i].INVOICE_NO_REF;
                        row.getCell(33).value = dtDetail[i].ADJUST_TYPE;
                        row.getCell(34).value = dtDetail[i].PARTNER_NAME_VAT;
                        row.getCell(35).value = dtDetail[i].GROUP_NAME;
                        row.getCell(36).value = dtDetail[i].BUYER_NAME;
                        row.getCell(37).value = dtDetail[i].PO_NO;
                        row.getCell(38).value = dtDetail[i].SEQ_IMPORT_SO;
                        
                        l_TOT_NET_TR_AMT = l_TOT_NET_TR_AMT  + dtDetail[i].TOT_NET_TR_AMT;
                        l_TOT_NET_BK_AMT = l_TOT_NET_BK_AMT  + dtDetail[i].TOT_NET_BK_AMT;
                        l_TOT_VAT_TR_AMT = l_TOT_VAT_TR_AMT  + dtDetail[i].TOT_VAT_TR_AMT; 
                        l_TOT_VAT_BK_AMT = l_TOT_VAT_BK_AMT  + dtDetail[i].TOT_VAT_BK_AMT;  
                        l_TOT_TR_AMT = l_TOT_TR_AMT + dtDetail[i].TOT_TR_AMT;
                        l_TOT_BK_AMT = l_TOT_BK_AMT + dtDetail[i].TOT_BK_AMT;  

                        row.commit();
                    }
                }
                
                //console.log(l_TOT_NET_TR_AMT + "--" + l_TOT_NET_BK_AMT + "--"+ l_TOT_VAT_TR_AMT + "--"+ l_TOT_VAT_BK_AMT + "--" + l_TOT_TR_AMT + "--"+l_TOT_BK_AMT );
                //worksheet.getCell('O11').value = l_TOT_NET_TR_AMT;
                //worksheet.getCell('P11').value = l_TOT_NET_BK_AMT;
                //w/orksheet.getCell('R11').value = l_TOT_VAT_TR_AMT;
                //worksheet.getCell('S11').value = l_TOT_VAT_BK_AMT;
                //worksheet.getCell('T11').value = l_TOT_TR_AMT;
                //worksheet.getCell('U11').value = l_TOT_BK_AMT;  
                
                let row = worksheet.getRow(pos + dtDetail.length);

                row.getCell(15).value = l_TOT_NET_TR_AMT;
                row.getCell(16).value = l_TOT_NET_BK_AMT;
                row.getCell(18).value = l_TOT_VAT_TR_AMT;
                row.getCell(19).value = l_TOT_VAT_BK_AMT;  
                row.getCell(20).value = l_TOT_TR_AMT;
                row.getCell(21).value = l_TOT_BK_AMT;    
                
                row.commit();
                await workbook.xlsx.writeFile(reportFile)
                return response.attachment(
                    reportFile,
                    `rpt6060030_${user.USER_ID}.xlsx` // custom name
                )
            }
            
        } catch (e) {
            Utils.Logger({ LVL: "error", MODULE: "6060016", FUNC: "6060016", CONTENT: e.message })
            return response.send(null)
        }
    }

}

module.exports = rpt6060030;