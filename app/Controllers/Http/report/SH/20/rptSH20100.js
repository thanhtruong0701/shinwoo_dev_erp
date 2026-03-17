"use strict";
const Helpers = use("Helpers")
const Antl = use("Antl");
const Utils = use("Utils");
const DBService = use("DBService")
const Excel = use("exceljs");
const workbook = new Excel.Workbook();
class rptSH20100 {
    async rpt_SH20100({request, response, auth }) {
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

                let para_dt = [para.COMPANY, para.ORDER_FROM_DATE, para.ORDER_TO_DATE, para.RELEASE_FROM_DATE, para.RELEASE_TO_DATE, para.PURCHASER_PK, para.NATION_PURCHASER, para.END_CUSTOMER_PK, para.NATION_END_CUSTOMER];
                const dt = await DBService.callProcCursor("SP_RPT_SH20100_NOCACHE", para_dt, language, crt_by);
                if (dt.length == 0) {
                    return response.send(Utils.response(false, "no_data_found", null))
                }

                let from_date = para.RELEASE_FROM_DATE ? para.RELEASE_FROM_DATE : para.ORDER_FROM_DATE;
                let to_date = para.RELEASE_TO_DATE ? para.RELEASE_TO_DATE : para.ORDER_TO_DATE;
                let date = new Date();
                worksheet.getCell("C2").value = "Period: " + from_date.substr(0,4) + "." + from_date.substr(4,2) + "." + from_date.substr(6,2) + " - " + to_date.substr(0,4) + "." + to_date.substr(4,2) + "." + to_date.substr(6,2);
                worksheet.getCell("H2").value = "Date: " + date.getFullYear() + "." + (date.getMonth()+1).toString().padStart(2, "0") + "." + date.getDate().toString().padStart(2, "0");

                let pos_def = 5;
                let pos = pos_def;
                let pos_nation = pos_def;
                let row;
                for (let i = 0; i < dt.length; i++) {
                    if (dt[i].SIZE_NM) {
                        row = worksheet.getRow(pos++);
                        row.getCell(2).value = dt[i].SIZE_NM;
                        row.getCell(3).value = dt[i].MON01;
                        row.getCell(4).value = dt[i].MON02;
                        row.getCell(5).value = dt[i].MON03;
                        row.getCell(6).value = dt[i].MON04;
                        row.getCell(7).value = dt[i].MON05;
                        row.getCell(8).value = dt[i].MON06;
                        row.getCell(9).value = dt[i].TOTAL;
                        for (let j = 3; j <= 8; j++) {
                            row.getCell(j).alignment = {vertical: "bottom", horizontal: "right"};
                        }
                        row = worksheet.getRow(pos++);
                        row.getCell(3).value = dt[i].MON07;
                        row.getCell(4).value = dt[i].MON08;
                        row.getCell(5).value = dt[i].MON09;
                        row.getCell(6).value = dt[i].MON10;
                        row.getCell(7).value = dt[i].MON11;
                        row.getCell(8).value = dt[i].MON12;
                        for (let j = 3; j <= 8; j++) {
                            row.getCell(j).alignment = {vertical: "top", horizontal: "right"};
                        }
                        worksheet.mergeCells(pos - 2, 2, pos - 1, 2);
                        worksheet.mergeCells(pos - 2, 9, pos - 1, 9);
                        for (let j = 3; j <= 8; j++) {
                            worksheet.getCell(pos - 2, j).border = {bottom: {style: "dotted"}};
                        }
                    }
                    else {
                        row = worksheet.getRow(pos++);
                        row.getCell(2).value = dt[i].NATION ? "Sub Total" : "TOTAL";
                        row.getCell(3).value = dt[i].MON01;
                        row.getCell(4).value = dt[i].MON02;
                        row.getCell(5).value = dt[i].MON03;
                        row.getCell(6).value = dt[i].MON04;
                        row.getCell(7).value = dt[i].MON05;
                        row.getCell(8).value = dt[i].MON06;
                        row.getCell(9).value = dt[i].TOTAL;
                        for (let j = 3; j <= 8; j++) {
                            row.getCell(j).alignment = {vertical: "bottom", horizontal: "right"};
                            row.getCell(j).font = {bold: true};
                        }
                        row = worksheet.getRow(pos++);
                        row.getCell(3).value = dt[i].MON07;
                        row.getCell(4).value = dt[i].MON08;
                        row.getCell(5).value = dt[i].MON09;
                        row.getCell(6).value = dt[i].MON10;
                        row.getCell(7).value = dt[i].MON11;
                        row.getCell(8).value = dt[i].MON12;
                        worksheet.mergeCells(pos - 2, 2, pos - 1, 2);
                        worksheet.mergeCells(pos - 2, 9, pos - 1, 9);
                        for (let j = 3; j <= 8; j++) {
                            row.getCell(j).alignment = {vertical: "top", horizontal: "right"};
                            row.getCell(j).font = {bold: true};
                            worksheet.getCell(pos - 2, j).border = {bottom: {style: "dotted"}};
                        }
                        row = worksheet.getRow(pos_nation);
                        row.getCell(1).value = dt[i].NATION;
                        row.getCell(1).alignment = {vertical: "bottom", horizontal: "left"};
                        row = worksheet.getRow(pos_nation + 1);
                        row.getCell(1).value = dt[i].PARTNER_NM;
                        row.getCell(1).alignment = {vertical: "top", horizontal: "left", wrapText: true};
                        row.getCell(1).font = {bold: true};
                        worksheet.mergeCells(pos_nation + 1, 1, pos - 1, 1);
                        pos_nation = pos;
                    }
                }

                for (let i = 0; i < dt.length; i++) {
                    worksheet.getRow(pos_def + i).height = 19;
                    worksheet.getRow(pos_def + i).getCell(2).font = {bold: true};
                    worksheet.getRow(pos_def + i).getCell(9).font = {bold: true};
                    i % 24 == 0 && i != 0 ? worksheet.getRow(pos_def + i - 1).addPageBreak() : null;
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

module.exports = rptSH20100;