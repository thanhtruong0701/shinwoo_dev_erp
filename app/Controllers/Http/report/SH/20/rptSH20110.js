"use strict";
const Helpers = use("Helpers")
const Antl = use("Antl");
const Utils = use("Utils");
const DBService = use("DBService")
const Excel = use("exceljs");
const workbook = new Excel.Workbook();
class rptSH20110 {
    async rpt_SH20110({ request, response, auth }) {
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

                let para_dt = [para.COMPANY, para.ORDER_FROM_DATE, para.ORDER_TO_DATE, para.RELEASE_FROM_DATE, para.RELEASE_TO_DATE, para.NATION_END_CUSTOMER];
                const dt = await DBService.callProcCursor("SP_RPT_SH20110_NOCACHE", para_dt, language, crt_by);
                if (dt.length == 0) {
                    return response.send(Utils.response(false, "no_data_found", null))
                }

                let from_date = para.RELEASE_FROM_DATE ? para.RELEASE_FROM_DATE : para.ORDER_FROM_DATE;
                let to_date = para.RELEASE_TO_DATE ? para.RELEASE_TO_DATE : para.ORDER_TO_DATE;
                let date = new Date();
                worksheet.getCell("C2").value = "Period: " + from_date.substr(0,4) + "." + from_date.substr(4,2) + "." + from_date.substr(6,2) + " - " + to_date.substr(0,4) + "." + to_date.substr(4,2) + "." + to_date.substr(6,2);
                worksheet.getCell("K2").value = "Date: " + date.getFullYear() + "." + (date.getMonth()+1).toString().padStart(2, "0") + "." + date.getDate().toString().padStart(2, "0");

                let pos_def = 4;
                let pos = pos_def;
                let row;
                for (let i = 0; i < dt.length; i++) {
                    row = worksheet.getRow(pos++);
                    row.getCell(1).value = dt[i].ROWNUM;
                    row.getCell(2).value = dt[i].NATION;
                    row.getCell(3).value = dt[i].PARTNER_NM;
                    row.getCell(4).value = dt[i].SIZE_00;
                    row.getCell(5).value = dt[i].SIZE_0E;
                    row.getCell(6).value = dt[i].SIZE_0;
                    row.getCell(7).value = dt[i].SIZE_1;
                    row.getCell(8).value = dt[i].SIZE_2;
                    row.getCell(9).value = dt[i].SIZE_3;
                    row.getCell(10).value = dt[i].SIZE_4;
                    row.getCell(11).value = dt[i].TOTAL;
                    row.getCell(12).value = dt[i].TO_RANK;
                    for (let j = 1; j <= 13; j++) {
                        if(j == 1 || j == 4 || j == 5 || j == 6 || j == 7 || j == 8 || j == 9 || j == 10 || j == 11 || j == 12){
                            row.getCell(j).alignment = { vertical: "middle", horizontal: "right" };
                        }
                        else {
                            row.getCell(j).alignment = { vertical: "middle", horizontal: "left" };
                        }
                    }
                }

                row = worksheet.getRow(pos);
                row.getCell(1).value = "Grand Total:";
                row.getCell(4).value = {formula: `SUM(D4:D${pos-1})`};
                row.getCell(5).value = {formula: `SUM(E4:E${pos-1})`};
                row.getCell(6).value = {formula: `SUM(F4:F${pos-1})`};
                row.getCell(7).value = {formula: `SUM(G4:G${pos-1})`};
                row.getCell(8).value = {formula: `SUM(H4:H${pos-1})`};
                row.getCell(9).value = {formula: `SUM(I4:I${pos-1})`};
                row.getCell(10).value = {formula: `SUM(J4:J${pos-1})`};
                row.getCell(11).value = {formula: `SUM(K4:K${pos-1})`};
                row.getCell(12).value = {formula: `SUM(L4:L${pos-1})`};
                row.getCell(1).alignment = { vertical: "middle", horizontal: "center" };
                worksheet.mergeCells(pos, 1, pos, 3);
                for (let j = 1; j <= 12; j++) {
                    worksheet.getCell(pos, j).border = {top: {style: "medium"}, bottom: {style: "medium"}};
                }
                for (let i = 0; i <= dt.length; i++) {
                    worksheet.getRow(pos_def + i).height = 19;
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

module.exports = rptSH20110;