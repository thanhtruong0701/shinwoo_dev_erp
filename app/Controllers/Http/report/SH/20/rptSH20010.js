"use strict";
const Helpers = use("Helpers")
const Antl = use("Antl");
const Utils = use("Utils");
const DBService = use("DBService")
const Excel = use("exceljs");
const workbook = new Excel.Workbook();
class rptSH20010 {
    async rpt_SH20010({ request, response, auth }) {
        try {
            const user = await auth.getUser();
            const crt_by = user.USER_ID;
            const language = request.header("accept-language", "ENG");
            const para = JSON.parse(request.get(["para"]).para); 
            const file_nm = para.RPT_FILE;
            if (!user) {
                return response.send(Utils.response(false, "Request failed!", null));
            }
            else {
                await workbook.xlsx.readFile(Helpers.resourcesPath(para.RPT_URL + "/" + file_nm + ".xlsx"));
                const worksheet = workbook.getWorksheet(1);

                let para_dt = [para.PK];
                const dt_d = await DBService.callProcCursor("SP_RPT_SH20010_D_NOCACHE", para_dt, language, crt_by);
                if (dt_d.length == 0) {
                    return response.send(Utils.response(false, "no_data_found", null))
                }

                let pos_def = 12;
                let pos = pos_def;
                let row;
                
                for (let i = 0; i < (dt_d.length - 1) * 2; i++) {
                    Utils.excelInsertRow(worksheet, pos_def);
                }

                for (let i = 0; i < dt_d.length; i++) {
                    row = worksheet.getRow(pos++);
                    row.getCell(1).value = dt_d[i].ROWNUM;
                    row.getCell(2).value = dt_d[i].ITEM_CODE;
                    row.getCell(3).value = dt_d[i].ITEM_NAME;
                    row.getCell(4).value = dt_d[i].CAP_PRINT_TYPE;
                    row.getCell(5).value = dt_d[i].ORD_QTY;
                    row.getCell(7).value = dt_d[i].CAP_COL;
                    row.getCell(8).value = dt_d[i].CAP_COL_NM;
                    row.getCell(9).value = dt_d[i].CAP_PRINT_COL;
                    row.getCell(10).value = dt_d[i].CAP_CHAR;
                    row.getCell(12).value = dt_d[i].ITEM_ETD;
                    row = worksheet.getRow(pos++);
                    row.getCell(2).value = dt_d[i].SIZE_NAME;
                    row.getCell(3).value = dt_d[i].GALETIN;
                    row.getCell(4).value = dt_d[i].BODY_PRINT_TYPE;
                    row.getCell(5).value = dt_d[i].PRINT_YN;
                    row.getCell(7).value = dt_d[i].BODY_COL;
                    row.getCell(8).value = dt_d[i].BODY_COL_NM;
                    row.getCell(9).value = dt_d[i].BODY_PRINT_COL;
                    row.getCell(10).value = dt_d[i].BODY_CHAR;
                    row.getCell(12).value = dt_d[i].DESCRIPTION;
                    for (let j = 1; j <= 13; j++) {
                        row.getCell(j).border = {bottom: {style: "medium"}};
                    }
                }

                const reportFile = Helpers.tmpPath(file_nm + "_" + crt_by);
                await workbook.xlsx.writeFile(reportFile); 
                return response.attachment(para.FILE_TYPE ==".pdf" ? await Utils.excelToPdf(reportFile) : reportFile, file_nm + para.FILE_TYPE );
            }
        }
        catch (e) {
            return response.send(Utils.response(false, e.message, null))
        }
    }
}

module.exports = rptSH20010;