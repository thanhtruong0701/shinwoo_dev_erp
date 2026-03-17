"use strict";
const Helpers = use('Helpers')
const Antl = use("Antl");
const Utils = use("Utils");
const DBService = use("DBService")
var Excel = use('exceljs');
var workbook = new Excel.Workbook();
class rpt2010100 {
    async rpt2010020_woup1({ request, response, auth }) {
        try {
            let { para } = request.get(['para'])
            const user = await auth.getUser()
                //console.log(user)
            if (!user) {
                return response.send(
                    Utils.response(false, "Request failed!", null)
                )
            } else {
                var objParam = JSON.parse(para);
                const p_language = request.header("accept-language", "ENG");
                var dtMaster = await DBService.callProcCursor("LG_RPT_2010020_WOUP1_1", [objParam.MASTER_PK], p_language, user.USER_ID);
                var dtDetail = await DBService.callProcCursor("LG_RPT_2010020_WOUP1_2", [objParam.MASTER_PK], p_language, user.USER_ID);
                if (dtMaster) {
                    dtMaster = dtMaster;
                } else {
                    return response.send(Utils.response(false, "no_data_found", null))
                }
                if (dtDetail) {
                    dtDetail = dtDetail
                } else {
                    return response.send(Utils.response(false, "no_data_found", null))
                }
                //console.log(dtDetail)
                const templateFile = Helpers.resourcesPath('report/20/10/2010020_woup1.xlsx')
                var reportPath = `2010020_woup1_${user.USER_ID}.xlsx`
                const reportFile = Helpers.tmpPath(reportPath)
                await workbook.xlsx.readFile(templateFile)
                var worksheet = workbook.getWorksheet(1);

                /*Set Header */
                worksheet.getCell("D3").value = dtMaster[0].OUT_YY;
                worksheet.getCell("G3").value = dtMaster[0].OUT_MM;
                worksheet.getCell("J3").value = dtMaster[0].OUT_DD;
                worksheet.getCell("D4").value = dtMaster[0].PARTNER_NAME;
                worksheet.getCell("B5").value = dtMaster[0].PHONE_NO;
                worksheet.getCell("J5").value = dtMaster[0].FAX_NO;
                worksheet.getCell("U7").value = dtMaster[0].TOTAL_AMOUNT;
                worksheet.getCell("B24").value = dtMaster[0].PRINT_DT;

                worksheet.getCell("D27").value = dtMaster[0].OUT_YY;
                worksheet.getCell("G27").value = dtMaster[0].OUT_MM;
                worksheet.getCell("J27").value = dtMaster[0].OUT_DD;
                worksheet.getCell("D28").value = dtMaster[0].PARTNER_NAME;
                worksheet.getCell("B29").value = dtMaster[0].PHONE_NO;
                worksheet.getCell("J29").value = dtMaster[0].FAX_NO;
                worksheet.getCell("U30").value = dtMaster[0].TOTAL_AMOUNT;
                worksheet.getCell("B47").value = dtMaster[0].PRINT_DT;
                
                var pos = 9;
                var pos_2 = 32;
                var out_qty = 0;
                for (var i = 0; i < dtDetail.length; i++) {
                    var row = worksheet.getRow(pos + i);
                    row.getCell(2).value = dtDetail[i].ITEM_NM;
                    row.getCell(18).value = Number(dtDetail[i].OUT_QTY);

                    var row_2 = worksheet.getRow(pos_2 + i);
                    row_2.getCell(2).value = dtDetail[i].ITEM_NM;
                    row_2.getCell(18).value = Number(dtDetail[i].OUT_QTY);
                    
                    out_qty += Number(dtDetail[i].OUT_QTY);
                }
                var row = worksheet.getRow(24);
                row.getCell(18).value = out_qty;

                var row_2 = worksheet.getRow(47);
                row_2.getCell(18).value = out_qty;

                await workbook.xlsx.writeFile(reportFile)
                return response.attachment(
                    reportFile,
                    `rpt2010020_1_${user.USER_ID}.xlsx` // custom name
                )
            }
        } catch (e) {
            return response.send(Utils.response(false, e.message, null))
        }
    }
    async rpt2010020_up2({ request, response, auth }) {
        try {
            let { para } = request.get(['para'])
            const user = await auth.getUser()
                //console.log(user)
            if (!user) {
                return response.send(
                    Utils.response(false, "Request failed!", null)
                )
            } else {
                var objParam = JSON.parse(para);
                const p_language = request.header("accept-language", "ENG");
                var dtMaster = await DBService.callProcCursor("LG_RPT_2010020_WOUP1_1", [objParam.MASTER_PK], p_language, user.USER_ID);
                var dtDetail = await DBService.callProcCursor("LG_RPT_2010020_WOUP1_2", [objParam.MASTER_PK], p_language, user.USER_ID);
                if (dtMaster) {
                    dtMaster = dtMaster;
                } else {
                    return response.send(Utils.response(false, "no_data_found", null))
                }
                if (dtDetail) {
                    dtDetail = dtDetail
                } else {
                    return response.send(Utils.response(false, "no_data_found", null))
                }
                //console.log(dtDetail)
                const templateFile = Helpers.resourcesPath('report/20/10/2010020_woup1.xlsx')
                var reportPath = `2010020_woup1_${user.USER_ID}.xlsx`
                const reportFile = Helpers.tmpPath(reportPath)
                await workbook.xlsx.readFile(templateFile)
                var worksheet = workbook.getWorksheet(1);

                /*Set Header */
                worksheet.getCell("D3").value = dtMaster[0].OUT_YY;
                worksheet.getCell("G3").value = dtMaster[0].OUT_MM;
                worksheet.getCell("J3").value = dtMaster[0].OUT_DD;
                worksheet.getCell("D4").value = dtMaster[0].PARTNER_NAME;
                worksheet.getCell("B5").value = dtMaster[0].PHONE_NO;
                worksheet.getCell("J5").value = dtMaster[0].FAX_NO;
                worksheet.getCell("U6").value = dtMaster[0].TOTAL_AMOUNT1;
                worksheet.getCell("B24").value = dtMaster[0].PRINT_DT;

                worksheet.getCell("D27").value = dtMaster[0].OUT_YY;
                worksheet.getCell("G27").value = dtMaster[0].OUT_MM;
                worksheet.getCell("J27").value = dtMaster[0].OUT_DD;
                worksheet.getCell("D28").value = dtMaster[0].PARTNER_NAME;
                worksheet.getCell("B29").value = dtMaster[0].PHONE_NO;
                worksheet.getCell("J29").value = dtMaster[0].FAX_NO;
                worksheet.getCell("U30").value = dtMaster[0].TOTAL_AMOUNT1;
                worksheet.getCell("B47").value = dtMaster[0].PRINT_DT;
                
                var pos = 9;
                var pos_2 = 32;
                var out_qty = 0;
                var item_amt = 0;
                for (var i = 0; i < dtDetail.length; i++) {
                    var row = worksheet.getRow(pos + i);
                    row.getCell(2).value = dtDetail[i].ITEM_NM;
                    row.getCell(18).value = Number(dtDetail[i].OUT_QTY);
                    row.getCell(21).value = Number(dtDetail[i].UNIT_PRICE);
                    row.getCell(24).value = Number(dtDetail[i].ITEM_AMOUNT);

                    var row_2 = worksheet.getRow(pos_2 + i);
                    row_2.getCell(2).value = dtDetail[i].ITEM_NM;
                    row_2.getCell(18).value = Number(dtDetail[i].OUT_QTY);
                    row_2.getCell(21).value = Number(dtDetail[i].UNIT_PRICE);
                    row_2.getCell(24).value = Number(dtDetail[i].ITEM_AMOUNT);

                    out_qty += Number(dtDetail[i].OUT_QTY);
                    item_amt += Number(dtDetail[i].ITEM_AMOUNT);
                }
                var row = worksheet.getRow(24);
                row.getCell(18).value = out_qty;
                row.getCell(24).value = item_amt;

                var row_2 = worksheet.getRow(47);
                row_2.getCell(18).value = out_qty;
                row_2.getCell(24).value = item_amt;

                await workbook.xlsx.writeFile(reportFile)
                return response.attachment(
                    reportFile,
                    `rpt2010020_1_${user.USER_ID}.xlsx` // custom name
                )
            }
        } catch (e) {
            return response.send(Utils.response(false, e.message, null))
        }
    }
}

module.exports = rpt2010100;