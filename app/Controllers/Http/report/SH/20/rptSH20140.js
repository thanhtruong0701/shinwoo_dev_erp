"use strict";
const Helpers = use("Helpers")
const Antl = use("Antl");
const Utils = use("Utils");
const DBService = use("DBService")
const Excel = use("exceljs");
const workbook = new Excel.Workbook();
class rptSH20140 {
    async rpt_SH20140({ request, response, auth }) {
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

                let para_dt = [para.COMPANY, para.DATE, para.NATION_END_CUSTOMER];
                const dt = await DBService.callProcCursor("SP_RPT_SH20140_NOCACHE", para_dt, language, crt_by);
                if (dt.length == 0) {
                    return response.send(Utils.response(false, "no_data_found", null))
                }
                
                let date = new Date();
                worksheet.getCell("A1").value = "[ " + para.DATE + " Annual sales status per size / color ]";
                worksheet.getCell("Q2").value = "Date: " + date.getFullYear() + "." + (date.getMonth()+1).toString().padStart(2, "0") + "." + date.getDate().toString().padStart(2, "0");

                let pos_def = 4;
                let pos = pos_def;
                let pos_nation = true;
                let pos_partner = true;
                let pos_size = true;
                let row;
                for (let i = 0; i < dt.length; i++) {
                    row = worksheet.getRow(pos++);
                    row.getCell(6).value = dt[i].MON01;
                    row.getCell(7).value = dt[i].MON02;
                    row.getCell(8).value = dt[i].MON03;
                    row.getCell(9).value = dt[i].MON04;
                    row.getCell(10).value = dt[i].MON05;
                    row.getCell(11).value = dt[i].MON06;
                    row.getCell(12).value = dt[i].MON07;
                    row.getCell(13).value = dt[i].MON08;
                    row.getCell(14).value = dt[i].MON09;
                    row.getCell(15).value = dt[i].MON10;
                    row.getCell(16).value = dt[i].MON11;
                    row.getCell(17).value = dt[i].MON12;
                    row.getCell(18).value = dt[i].TOTAL;
                    if (dt[i].NATION && dt[i].PARTNER_NM && dt[i].SIZE_NM && dt[i].COLOR) {
                        if(pos_nation){
                            row.getCell(1).value = dt[i].NATION;
                            pos_nation = false;
                        }
                        if(pos_partner){
                            row.getCell(2).value = dt[i].PARTNER_NM;
                            pos_partner = false;
                        }
                        if(pos_size){
                            row.getCell(3).value = dt[i].SIZE_NM;
                            pos_size = false;
                        }
                        row.getCell(4).value = dt[i].COLOR;
                        row.getCell(5).value = dt[i].ITEM_NAME;
                    }
                    else{
                        let argb = null;
                        let border_pos = 1;
                        let border_style = "thin";
                        if (!dt[i].NATION) {

                        }
                        else if (!dt[i].PARTNER_NM) {
                            argb = "9BC2E6";
                            border_style = "double";
                            pos_nation = true;
                        }
                        else if (!dt[i].SIZE_NM) {
                            argb = "DEDDC7";
                            border_pos = 2;
                            pos_partner = true;
                        }
                        else if (!dt[i].COLOR) {
                            border_pos = 3;
                            pos_size = true;
                        }
                        for (let j = 1; j <= 18; j++) {
                            argb ? row.getCell(j).fill = {type: "pattern", pattern: "solid", fgColor: { argb: argb}} : null;
                            j >= border_pos ? row.getCell(j).border = {bottom: {style: border_style}, top: {style: dt[i].NATION && dt[i].PARTNER_NM && dt[i].SIZE_NM && !dt[i].COLOR ? border_style : null}} : null;
                        }
                        row.getCell(4).value = !dt[i].NATION ? "Grand Total" : !dt[i].PARTNER_NM ? "Nation of End Customer Total" : !dt[i].SIZE_NM ? "End Customer Total" : "Size Total";
                        row.getCell(4).alignment = { vertical: "middle", horizontal: "right" };
                    }
                }

                for (let i = 0; i < dt.length; i++) {
                    worksheet.getRow(pos_def + i).height = 20;
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

module.exports = rptSH20140;