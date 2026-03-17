"use strict";
const Helpers = use('Helpers')
const Antl = use("Antl");
const Utils = use("Utils");
const DBService = use("DBService")
var Excel = use('exceljs');
var workbook = new Excel.Workbook();
class rpt7040060 {
    async rpt7040060_01({ request, response, auth }) {
        try {
            /****************************** Get Param *********************************/

            let { para } = request.get(['para']);
            /********* Parse pram to json ********/
            var item = JSON.parse(para);
            const user = await auth.getUser();
            //var COMP_ID         = item.P_COMP_ID, COMP_NM = item.P_COMP_NM, COMP_TAX = item.P_COMP_TAX, COMP_ADD = item.P_COMP_ADD;
            const p_crt_by = user.USER_ID;
            const p_language = request.header("accept-language", "ENG");

            var file_nm = "rpt7040060_01";
            var file_type = ".xlsx";
            var full_nm = file_nm + file_type;
            var file_new = file_nm + p_crt_by + file_type;
            var _resourcesPath = "report/70/40" + '/' + full_nm;
            var _store = "LG_SEL_DSBS20260_2_NJ";
            var _store2 = "LG_SEL_DSBS20260_3_NJ";
            var _store3 = "LG_SEL_DSBS20260_1_NJ";
            var _param = [item.P_DATE];


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
                var pos = 8;
 
                row.getCell(2).value = item.P_DATE;
                row.getCell(6).value = item.P_DATE_TODAY;


                for (var i = 0; i < dt_m.length; i++) {
                    var row = worksheet.getRow(pos + i);
                    row.getCell(1).value = dt_m[i].INFO;
                    row.getCell(2).value = dt_m[i].ITEM_TYPE_10;
                    row.getCell(3).value = dt_m[i].ITEM_TYPE_20;
                    row.getCell(4).value = dt_m[i].ITEM_TYPE_30;
                    row.getCell(5).value = dt_m[i].ITEM_TYPE_40;
                    row.getCell(6).value = dt_m[i].AR_AMT;
                }

                pos = 15

                if (dt_m2.length > 1) {
                    worksheet.duplicateRow(pos, dt_m2.length-2, true);
                }             

                for (var i = 0; i < dt_m2.length; i++) {
                    var row = worksheet.getRow(pos + i);
                    row.getCell(1).value = dt_m2[i].FULL_NAME;
                    row.getCell(2).value = dt_m2[i].ITEM_TYPE_10;
                    row.getCell(3).value = dt_m2[i].ITEM_TYPE_20;
                    row.getCell(4).value = dt_m2[i].ITEM_TYPE_30;
                    row.getCell(5).value = dt_m2[i].ITEM_TYPE_40;
                    row.getCell(6).value = dt_m2[i].AR_AMT;
                }     

                pos = 18 + dt_m2.length;

                if (dt_m3.length > 1) {
                    worksheet.duplicateRow(pos, dt_m3.length-2, true);
                }             

                for (var i = 0; i < dt_m3.length; i++) {
                    var row = worksheet.getRow(pos + i);
                    row.getCell(1).value = dt_m3[i].PARTNER_ID;
                    row.getCell(2).value = dt_m3[i].PARTNER_NAME;
                    row.getCell(3).value = dt_m3[i].ITEM_TYPE_10;
                    row.getCell(4).value = dt_m3[i].ITEM_TYPE_20;
                    row.getCell(5).value = dt_m3[i].ITEM_TYPE_30;
                    row.getCell(6).value = dt_m3[i].ITEM_TYPE_40;
                    row.getCell(7).value = dt_m3[i].AR_AMT;
                } 
                /********* Print file excel ********/
                const reportFile = Helpers.tmpPath(file_new);
                await workbook.xlsx.writeFile(reportFile);
                return response.attachment(reportFile, file_new)

            }
        }
        catch (e) {
            console.log(e)
            return response.send(Utils.response(false, e.message, null))
        }
    }
}

module.exports = rpt7040060;