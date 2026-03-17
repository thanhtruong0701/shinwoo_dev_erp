"use strict";
const Helpers = use("Helpers")
const Antl = use("Antl");
const Utils = use("Utils");
const DBService = use("DBService")
const Excel = use("exceljs");
const workbook = new Excel.Workbook();
class rptSH20130 {
    async rpt_SH20130({ request, response, auth }) {
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

                let para_dt = [para.COMPANY, para.FROM_DATE, para.TO_DATE, para.TYPE];
                const dt = await DBService.callProcCursor("SP_RPT_SH20130_NOCACHE", para_dt, language, crt_by);
                if (dt.length == 0) {
                    return response.send(Utils.response(false, "no_data_found", null))
                }

                let pos_def = 3;
                let pos = pos_def;
                let row;
                for (let i = 0; i < dt.length; i++) {
                    row = worksheet.getRow(pos++);
                    row.getCell(1).value = dt[i].MONTH;
                    row.getCell(2).value = dt[i].NATION;
                    row.getCell(3).value = dt[i].PARTNER;
                    row.getCell(4).value = dt[i].ORDER_QTY;
                }

                row = worksheet.getRow(pos);
                row.getCell(1).value = "Total:";
                row.getCell(4).value = {formula: `SUM(D${pos_def}:D${pos-1})`};
                row.getCell(4).font = {bold: true};
                worksheet.mergeCells(pos, 1, pos, 3);
                for (let i = 0; i <= dt.length; i++) {
                    worksheet.getRow(pos_def + i).height = 20;
                    for (let j = 1; j <= 4; j++) {
                        worksheet.getRow(pos_def + i).getCell(j).border = {top: {style: "thin"}, left: {style: "thin"}, bottom: {style: "thin"}, right: {style: "thin"}};
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

module.exports = rptSH20130;