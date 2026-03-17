"use strict";
const Helpers = use('Helpers')
const Antl = use("Antl");
const Utils = use("Utils");
const DBService = use("DBService")
var Excel = use('exceljs');
var workbook = new Excel.Workbook();
class rpt3050010 {
    async rpt3050010_01({ request, response, auth }) {
        try {
            /****************************** Get Param *********************************/

            let { para } = request.get(['para']);
            /********* Parse pram to json ********/
            var item = JSON.parse(para);
            const user = await auth.getUser();
            //var COMP_ID         = item.P_COMP_ID, COMP_NM = item.P_COMP_NM, COMP_TAX = item.P_COMP_TAX, COMP_ADD = item.P_COMP_ADD;
            const p_crt_by = user.USER_ID;
            const p_language = request.header("accept-language", "ENG");

            var file_nm = "rpt3050010_01";
            var file_type = ".xlsx";
            var full_nm = file_nm + file_type;
            var file_new = file_nm + p_crt_by + file_type;
            var _resourcesPath = "report/30/50" + '/' + full_nm;
            var _store = "LG_SEL_5010094_1";
            var _store2 = "LG_SEL_6009540_2_NJ";
            var _store3 = "LG_SEL_5010094_3";
            var _param = [item.P_MONTH];



            /***************************** Return failded ****************************/
            if (!user) {
                return response.send(Utils.response(false, "Request failed!", null));
            }
            /****************************** Begin call store and write excell *********/
            else {
                /********* Call store  ***************/
                var dt_m  = await DBService.callProcCursor(_store, _param, p_language, p_crt_by);
                var dt_m2 = await DBService.callProcCursor(_store2, _param, p_language, p_crt_by);
                var dt_m3 = await DBService.callProcCursor(_store3, _param, p_language, p_crt_by);
                 
                /********* Read file excel ********/
                const templateFile = Helpers.resourcesPath(_resourcesPath);
                await workbook.xlsx.readFile(templateFile);
                var worksheet = workbook.getWorksheet(1);

                /********* Write file excel ********/
                var row = worksheet.getRow(5);
                var pos = 9;
 
                row.getCell(2).value = item.P_MONTH_D;
                row.getCell(8).value = item.P_DATE_TODAY;

                if (dt_m.length > 1) {
                    worksheet.duplicateRow(pos, dt_m.length - 2, true);
                }

                for (var i = 0; i < dt_m.length; i++) {
                    var row = worksheet.getRow(pos + i);
                    row.getCell(1).value = dt_m[i].YYYYMM;
                    row.getCell(2).value = dt_m[i].TYPE_10;
                    row.getCell(3).value = dt_m[i].TYPE_20;
                    row.getCell(4).value = dt_m[i].TYPE_30;
                    row.getCell(5).value = dt_m[i].TYPE_40;
                    row.getCell(6).value = dt_m[i].TOTAL_QTY;
                    row.getCell(8).value = dt_m2[i].MM;
                    row.getCell(9).value = dt_m2[i].AP_AMT;
                    row.getCell(10).value = dt_m2[i].AR_AMT;
                }

                pos = dt_m.length+11

                if (dt_m3.length > 1) {
                    worksheet.duplicateRow(pos, dt_m3.length-2, true);
                }             
                
                worksheet.mergeCells(pos-1, 2, pos-1, 3);
                worksheet.mergeCells(pos-1, 8, pos-1, 10);

                for (var i = 0; i < dt_m3.length; i++) {
                    var row = worksheet.getRow(pos + i);
                    worksheet.mergeCells(pos+i, 2, pos+i, 3);
                    worksheet.mergeCells(pos+i, 8, pos+i, 10);
                    row.getCell(1).value = dt_m3[i].PARTNER_ID;
                    row.getCell(2).value = dt_m3[i].PARTNER_NAME;
                    row.getCell(4).value = dt_m3[i].TYPE_10;
                    row.getCell(5).value = dt_m3[i].TYPE_20;
                    row.getCell(6).value = dt_m3[i].TYPE_30;
                    row.getCell(7).value = dt_m3[i].TYPE_40;
                    row.getCell(10).value = dt_m3[i].TOTAL_QTY;

                }
                /********* Print file excel ********/
                const reportFile = Helpers.tmpPath(file_new);
                await workbook.xlsx.writeFile(reportFile);
                return response.attachment(reportFile, file_new)

            }
        }
        catch (e) {
            // Utils.Logger({ LVL: "error", MODULE: "Report", FUNC: "Picking_list", CONTENT: e.message }) 
            //return response.send(null);
            console.log(e)
            return response.send(Utils.response(false, e.message, null))
        }
    }
}

module.exports = rpt3050010;