"use strict";
const Helpers = use('Helpers')
const Antl = use("Antl");
const Utils = use("Utils");
const DBService = use("DBService")
var Excel = use('exceljs');
var workbook = new Excel.Workbook();
class rpt9560020 {
    async report({ request, response, auth }) {
        try {
            let { para } = request.get(['para']);
            const user = await auth.getUser();
            if (!user) {
                return response.send(
                    Utils.response(false, "Request failed!", null)
                );
            } else {
                var objParam = JSON.parse(para);
                const p_language = request.header("accept-language", "ENG");
                var dtMaster = await DBService.callProcCursor("LG_SEL_9560020_M", [objParam.PK], p_language, user.USER_ID);
                var dtDetail1 = await DBService.callProcCursor("LG_SEL_9560020_D1", [objParam.PK], p_language, user.USER_ID);
                var dtDetail2 = await DBService.callProcCursor("LG_SEL_9560020_D2", [objParam.PK], p_language, user.USER_ID);
                if (!dtMaster) {
                    return response.send(Utils.response(false, "no_data_found", null));
                }
                let url_path;
                switch (p_language) {
                    case "KOR":
                        url_path = "report/95/60/9560020_KOR.xlsx";
                        break;
                    default:
                        url_path = "report/95/60/9560020_ENG.xlsx";
                }
                const templateFile = Helpers.resourcesPath(url_path);
                await workbook.xlsx.readFile(templateFile);
                var worksheet = workbook.getWorksheet(1);
                var row = worksheet.getRow(1);
                var pos = 6;
                
                if (dtDetail1.length > 1) {
                    worksheet.duplicateRow(pos, dtDetail1.length - 1, true);
                }
                var pr_qty = 0;
                var order_qty = 0;
                for (var i = 0; i < dtDetail1.length; i++) {
                    row = worksheet.getRow(pos);
                    row.getCell(1).value = dtDetail1[i].PR_DEPARTMENT;
                    row.getCell(2).value = dtDetail1[i].PR_DT == null ? null : dtDetail1[i].PR_DT.substring(0, 4) + "-" + dtDetail1[i].PR_DT.substring(4, 6) + "-" + dtDetail1[i].PR_DT.substring(6, 8);
                    row.getCell(3).value = dtDetail1[i].PR_NO;
                    row.getCell(4).value = dtDetail1[i].ITEM_CODE;
                    row.getCell(5).value = dtDetail1[i].ITEM_NAME;
                    row.getCell(10).value = dtDetail1[i].SPECIFICATION;
                    row.getCell(11).value = dtDetail1[i].PR_QTY;
                    row.getCell(12).value = dtDetail1[i].ORDER_QTY;
                    row.getCell(13).value = dtDetail1[i].DELIVERY_REQUEST;
                    row.getCell(14).value = null;
                    row.getCell(15).value = dtDetail1[i].DESCRIPTION;
                    worksheet.mergeCells(pos, 5, pos, 9);
                    pr_qty += dtDetail1[i].PR_QTY;
                    order_qty += dtDetail1[i].ORDER_QTY;
                    pos++;
                }
                worksheet.getRow(pos).getCell(11).value = pr_qty;
                worksheet.getRow(pos).getCell(12).value = order_qty;
                pos += 2;
                worksheet.mergeCells(pos, 1, pos, 3);
                worksheet.mergeCells(pos, 4, pos, 9);
                worksheet.mergeCells(pos, 10, pos, 12);
                worksheet.mergeCells(pos, 13, pos, 15);
                worksheet.getRow(pos).getCell(4).value = dtMaster[0].RFQ_NO;
                worksheet.getRow(pos).getCell(13).value = dtMaster[0].CUSTOMER;
                pos++;
                worksheet.mergeCells(pos, 1, pos, 3);
                worksheet.mergeCells(pos, 4, pos, 9);
                worksheet.mergeCells(pos, 10, pos, 12);
                worksheet.mergeCells(pos, 13, pos, 15);
                worksheet.getRow(pos).getCell(4).value = dtMaster[0].DRAWING_NUMBER + " / " + dtMaster[0].REV;
                worksheet.getRow(pos).getCell(13).value = dtMaster[0].RAWM_ATERIAL;
                pos++;
                worksheet.mergeCells(pos, 1, pos, 3);
                worksheet.mergeCells(pos, 4, pos, 6);
                worksheet.mergeCells(pos, 7, pos, 9);
                worksheet.mergeCells(pos, 10, pos, 12);
                worksheet.mergeCells(pos, 13, pos, 15);
                worksheet.getRow(pos).getCell(4).value = dtMaster[0].FOT_FROM_DATE == null ? null : dtMaster[0].FOT_FROM_DATE.substring(0, 4) + "-" + dtMaster[0].FOT_FROM_DATE.substring(4, 6) + "-" + dtMaster[0].FOT_FROM_DATE.substring(6, 8);
                worksheet.getRow(pos).getCell(7).value = dtMaster[0].FOT_TO_DATE == null ? null : dtMaster[0].FOT_TO_DATE.substring(0, 4) + "-" + dtMaster[0].FOT_TO_DATE.substring(4, 6) + "-" + dtMaster[0].FOT_TO_DATE.substring(6, 8);
                worksheet.getRow(pos).getCell(13).value = dtMaster[0].ITEM_CODE_VIRTUAL + " / " + dtMaster[0].ITEM_NAME_VIRTUAL;
                pos++;
                worksheet.mergeCells(pos, 1, pos, 3);
                worksheet.mergeCells(pos, 4, pos, 6);
                worksheet.mergeCells(pos, 7, pos, 9);
                worksheet.mergeCells(pos, 10, pos, 12);
                worksheet.mergeCells(pos, 13, pos, 15);
                worksheet.getRow(pos).getCell(4).value = dtMaster[0].PPAP_FROM_DATE == null ? null : dtMaster[0].PPAP_FROM_DATE.substring(0, 4) + "-" + dtMaster[0].PPAP_FROM_DATE.substring(4, 6) + "-" + dtMaster[0].PPAP_FROM_DATE.substring(6, 8);
                worksheet.getRow(pos).getCell(7).value = dtMaster[0].PPAP_TO_DATE == null ? null : dtMaster[0].PPAP_TO_DATE.substring(0, 4) + "-" + dtMaster[0].PPAP_TO_DATE.substring(4, 6) + "-" + dtMaster[0].PPAP_TO_DATE.substring(6, 8);
                worksheet.getRow(pos).getCell(13).value = dtMaster[0].REDUCTION_STATUS;
                pos++;
                worksheet.mergeCells(pos, 1, pos, 3);
                worksheet.mergeCells(pos, 4, pos, 15);
                worksheet.getRow(pos).getCell(4).value = dtMaster[0].PPAP_LEVEL;
                pos++;
                worksheet.mergeCells(pos, 1, pos, 3);
                worksheet.mergeCells(pos, 4, pos, 15);
                worksheet.getRow(pos).getCell(4).value = dtMaster[0].RELEVANT_LAWS;
                pos++;
                worksheet.mergeCells(pos, 1, pos, 3);
                worksheet.mergeCells(pos, 4, pos, 15);
                worksheet.getRow(pos).getCell(4).value = dtMaster[0].OTHER_DES;
                pos++;
                worksheet.mergeCells(pos, 1, pos, 3);
                switch (dtMaster[0].TYPE_DEVELOPMENT) {
                    case "Proto":
                        worksheet.getRow(pos).getCell(4).value = "þ";
                        break
                    case "Proto and Initial mass production":
                        worksheet.getRow(pos).getCell(7).value = "þ";
                        break
                    case "Mass production development":
                        worksheet.getRow(pos).getCell(11).value = "þ";
                        break
                    case "Repetitive Mold":
                        worksheet.getRow(pos).getCell(14).value = "þ";
                        break
                }
                pos++;
                worksheet.mergeCells(pos, 9, pos, 11);
                worksheet.mergeCells(pos, 12, pos, 14);
                pos++;
                if (dtDetail2.length > 3) {
                    worksheet.duplicateRow(pos, dtDetail2.length - 3, true);
                }
                worksheet.mergeCells(pos - 1, 1, pos + 2 + (dtDetail2.length > 3 ? dtDetail2.length - 3 : 0), 3);
                for (var i = 0; i < dtDetail2.length; i++) {
                    row = worksheet.getRow(pos);
                    row.getCell(4).value = dtDetail2[i].PROCESS_NAME;
                    row.getCell(5).value = dtDetail2[i].CT;
                    row.getCell(6).value = dtDetail2[i].CAV;
                    row.getCell(7).value = dtDetail2[i].ANNUAL_VOULME;
                    row.getCell(8).value = dtDetail2[i].GUARANTEED_SHOTS;
                    row.getCell(9).value = dtDetail2[i].MOLD_JIG_PAGE_ETC;
                    row.getCell(12).value = dtDetail2[i].DESCRIPTION;
                    row.getCell(15).value = dtDetail2[i].SIGN;
                    worksheet.mergeCells(pos, 9, pos, 11);
                    worksheet.mergeCells(pos, 12, pos, 14);
                    pos++;
                }

                const reportFile = Helpers.tmpPath("9560020.xlsx");
                await workbook.xlsx.writeFile(reportFile);
                return response.attachment(reportFile);
            }
        } catch (e) {
            return response.send(Utils.response(false, e.message, null));
        }
    }
}

module.exports = rpt9560020;