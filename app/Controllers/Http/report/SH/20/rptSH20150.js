"use strict";
const Helpers = use("Helpers")
const Antl = use("Antl");
const Utils = use("Utils");
const DBService = use("DBService")
const Excel = use("exceljs");
const workbook = new Excel.Workbook();
class rptSH20150 {
    async rpt_SH20150({ request, response, auth }) {
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

                let para_dt = [para.COMPANY, para.FROM_DATE, para.TO_DATE, para.NATION_END_CUSTOMER, para.TYPE];
                const dt = await DBService.callProcCursor("SP_RPT_SH20150_NOCACHE", para_dt, language, crt_by);
                if (dt.length == 0) {
                    return response.send(Utils.response(false, "no_data_found", null))
                }

                let date = new Date();
                worksheet.getCell("C2").value = "Period: " + para.FROM_DATE.substr(0, 4) + "." + para.FROM_DATE.substr(4, 2) + "." + para.FROM_DATE.substr(6, 2) + " - " + para.TO_DATE.substr(0, 4) + "." + para.TO_DATE.substr(4, 2) + "." + para.TO_DATE.substr(6, 2);
                worksheet.getCell("J2").value = "Date: " + date.getFullYear() + "." + (date.getMonth() + 1).toString().padStart(2, "0") + "." + date.getDate().toString().padStart(2, "0");

                let pos_def = 4;
                let pos = pos_def;
                let pos_nation = true;
                let row;
                for (let i = 0; i < dt.length; i++) {
                    row = worksheet.getRow(pos++);
                    row.getCell(1).value = pos_nation ? dt[i].NATION : null;
                    row.getCell(2).value = !dt[i].NATION ? "Total -----" : !dt[i].PARTNER_NM ? "Nation of End Customer Total -----" : dt[i].PARTNER_NM;
                    row.getCell(3).value = dt[i].NATION ? dt[i].SIZE_00 : null;
                    row.getCell(4).value = dt[i].NATION ? dt[i].SIZE_0E : null;
                    row.getCell(5).value = dt[i].NATION ? dt[i].SIZE_0 : null;
                    row.getCell(6).value = dt[i].NATION ? dt[i].SIZE_1 : null;
                    row.getCell(7).value = dt[i].NATION ? dt[i].SIZE_2 : null;
                    row.getCell(8).value = dt[i].NATION ? dt[i].SIZE_3 : null;
                    row.getCell(9).value = dt[i].NATION ? dt[i].SIZE_4 : null;
                    row.getCell(10).value = null;
                    row.getCell(11).value = dt[i].TOTAL;
                    pos_nation = false;
                    if (!dt[i].NATION) {
                        row.getCell(2).alignment = { vertical: "middle", horizontal: "right" };
                        for (let j = 1; j <= 11; j++) {
                            worksheet.getCell(pos - 1, j).border = { bottom: { style: "medium" } };
                            row.getCell(j).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF2CC" } };
                        }
                    }
                    else if (!dt[i].PARTNER_NM) {
                        row.getCell(2).alignment = { vertical: "middle", horizontal: "right" };
                        for (let j = 2; j <= 11; j++) {
                            worksheet.getCell(pos - 1, j).border = { top: { style: "medium" }, bottom: { style: "medium" } };
                        }
                        pos_nation = true;
                    }
                    worksheet.getRow(pos_def + i).height = 19;
                }

                const reportFile = Helpers.tmpPath(file_nm + "_" + crt_by);
                await workbook.xlsx.writeFile(reportFile);
                return response.attachment(para.FILE_TYPE == ".pdf" ? await Utils.excelToPdf(reportFile) : reportFile, file_nm + para.FILE_TYPE);
            }
        }
        catch (e) {
            return response.send(Utils.response(false, e.message, null))
        }
    }
}

module.exports = rptSH20150;