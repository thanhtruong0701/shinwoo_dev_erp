"use strict";
const Helpers = use('Helpers')
const AES = use("AES");
const Utils = use("Utils");
const DBService = use("DBService")
var Excel = use('exceljs');
const Env = use("Env")
const fs = use("fs");
const ROOT_DIR_FILES = Env.get("ROOT_DIR_FILES");
const APP_KEY = Env.get("APP_KEY");
const APP_URL_LOCAL = Env.get("APP_URL_LOCAL", Env.get("APP_URL"))
var workbook = new Excel.Workbook();
class rptCS50040_6_wms {
    async rpt_CS50040_Billing_6({ request, response, auth }) {
        try {
            /****************************** Get Param *********************************/
            let { para } = request.get(['para']);
            /********* Parse pram to json ********/
            var item = JSON.parse(para);
            const user = await auth.getUser();
            //var COMP_ID         = item.P_COMP_ID, COMP_NM = item.P_COMP_NM, COMP_TAX = item.P_COMP_TAX, COMP_ADD = item.P_COMP_ADD;
            const p_crt_by = user.USER_ID;
            const p_language = request.header("accept-language", "ENG");
            var file_nm = [item.P_RPT_FILE];
            var file_type = ".xlsx";
            var full_nm = file_nm + file_type;
            var file_new = file_nm + p_crt_by + file_type;
            var _resourcesPath = [item.P_RPT_URL] + '/' + full_nm;
            var _param = [item.P_M_PK];

            /***************************** Return failded ****************************/
            if (!user) {
                return response.send(Utils.response(false, "Request failed!", null));
            }
            /****************************** Begin call store and write excell *********/
            else {
                /********* Call store  ***************/
                //var dt_m   = await DBService.callProcCursor("CW_RPT_CS50040_1_1_NOCACHE", _param , p_language , p_crt_by,item.SECOND_DB_YN); 
                var dt_m = await DBService.callProcCursor("CW_RPT_CS50040_61_NOCACHE", _param, p_language, p_crt_by, item.P_SECOND_DB_YN);
                var dt_stock = await DBService.callProcCursor("CW_RPT_CS50040_63_NOCACHE", _param, p_language, p_crt_by, item.P_SECOND_DB_YN);
                var dt_service = await DBService.callProcCursor("CW_RPT_CS50040_62_NOCACHE", _param, p_language, p_crt_by, item.P_SECOND_DB_YN);


                // var dt_Data  = await DBService.callProcCursor(_store, _param , p_language , p_crt_by); 
                if (dt_m.length > 0) {
                    dt_m = dt_m;
                } else {
                    return response.send(Utils.response(false, "no_data_found", null))
                }
                /********* Read file excel ********/
                const templateFile = Helpers.resourcesPath(_resourcesPath);
                await workbook.xlsx.readFile(templateFile);
                var worksheet = workbook.getWorksheet(1);
                /********* Write file excel ********/

                // var pos1 = 19; 
                var service_rows = dt_service.length;
                //INFOMATION COMPANY  
                worksheet.getCell("L6").value = dt_m[0].DESCRIPTION; //"Remark/Ghi chú: "+ 
                worksheet.getCell("Y1").value = "No. " + dt_m[0].SLIP_NO;
                worksheet.getCell("C4").value = dt_m[0].PERIOD_; //"Period/Kỳ: " +
                worksheet.getCell("E5").value = dt_m[0].TR_DATE; //"Billing Date/Ngày làm: " +
                worksheet.getCell("M4").value = dt_m[0].PARTNER_NAME; ///"Customer/Khách hàng: " + 
                //worksheet.getCell("K7").value = dt_m[0].AMT;
               // worksheet.getCell("Q7").value = dt_m[0].VAT_AMT;
               // worksheet.getCell("Y7").value = dt_m[0].TOTAL_AMT;
                // worksheet.getCell("C7").value = dt_Data[0].AMT;    ///sl   
                var pos = 15;
                var pos_dup = 16;
                var stock_row = dt_stock.length;
                if (dt_stock.length > 3) {
                    worksheet.duplicateRow(pos_dup, dt_stock.length - 4, true);
                }

                for (var i = 0; i < dt_stock.length - 1; i++) {
                    var row_item = worksheet.getRow(pos + i);
                    //console.log("row:"+i+", ord:"+dt_stock[i].ORD)
                    if (dt_stock[i].ORD == '0') {
                        row_item.getCell(1).value = dt_stock[i].GRP_NM;

                    } else {
                        row_item.getCell(1).value = dt_stock[i].TR_DATE;
                    }

                    row_item.getCell(3).value = dt_stock[i].BEGIN_QTY;
                    row_item.getCell(5).value = dt_stock[i].BEGIN_WEIGHT;
                    row_item.getCell(7).value = dt_stock[i].BEGIN_PLTS;
                    row_item.getCell(9).value = dt_stock[i].IN_QTY;
                    row_item.getCell(11).value = dt_stock[i].IN_WEIGHT;
                    row_item.getCell(13).value = dt_stock[i].IN_PLTS;
                    row_item.getCell(15).value = dt_stock[i].OUT_QTY;
                    row_item.getCell(17).value = dt_stock[i].OUT_WEIGHT;
                    row_item.getCell(19).value = dt_stock[i].OUT_ALL_PLTS;
                    row_item.getCell(21).value = dt_stock[i].OUT_PLTS;
                    row_item.getCell(23).value = dt_stock[i].END_QTY;
                    row_item.getCell(25).value = dt_stock[i].END_WEIGHT;
                    row_item.getCell(27).value = dt_stock[i].END_PTLS;

                    row_item.commit();
                }


                var pos_s = 9;
                var pos_s1 = 10;

                if (dt_service.length > 3) {
                    worksheet.duplicateRow(pos_s1, dt_service.length - 3, true);
                }

                for (var j = 0; j < dt_service.length; j++) {
                    var row_s = worksheet.getRow(pos_s + j);

                    worksheet.unMergeCells(pos_s + j, 1, pos_s + j, 25);
                    row_s.getCell(1).value = dt_service[j].ITEM_CODE;
                    row_s.getCell(2).value = dt_service[j].ITEM_NAME;
                    row_s.getCell(11).value = dt_service[j].UOM;
                    row_s.getCell(13).value = dt_service[j].SERVICE_QTY;
                    //row_s.getCell(16).value = dt_service[j].U_PRICE;
                   // row_s.getCell(19).value = dt_service[j].AMT;
                   // row_s.getCell(23).value = dt_service[j].VAT_RATE;
                   // row_s.getCell(24).value = dt_service[j].VAT_AMT;
                   // row_s.getCell(26).value = dt_service[j].TOTAL_AMT;

                    //row_s.getCell(15).alignment = { vertical: 'center', horizontal: 'center' };
                    //row_s.getCell(17).alignment = { vertical: 'center', horizontal: 'right' };
                    worksheet.mergeCells(pos_s + j, 2, pos_s + j, 10);
                    worksheet.mergeCells(pos_s + j, 11, pos_s + j, 12)
                    worksheet.mergeCells(pos_s + j, 13, pos_s + j, 15);
                    worksheet.mergeCells(pos_s + j, 16, pos_s + j, 18);
                    worksheet.mergeCells(pos_s + j, 19, pos_s + j, 22);
                    worksheet.mergeCells(pos_s + j, 24, pos_s + j, 25);
                    worksheet.mergeCells(pos_s + j, 26, pos_s + j, 28);
                    //row_s.getCell(1).alignment = { vertical: 'center', horizontal: 'left' };
                    ///row_s.getCell(3).alignment = { vertical: 'center', horizontal: 'left' };


                }

                //worksheet.getCell("Q11").alignment = { vertical: 'center', horizontal: 'right' };
                if (service_rows <= 1) {
                    service_rows = service_rows + 1;
                }
                if (service_rows < 3) {
                    service_rows = service_rows + (3 - service_rows);
                }
                var h_io_d = 9 + service_rows + 1;
                //worksheet.getCell("N5").value ="h_io_d="+   h_io_d;
                worksheet.mergeCells(h_io_d, 1, h_io_d + 1, 2);
                worksheet.getCell("A" + h_io_d).alignment = { vertical: 'center', horizontal: 'center' };

                worksheet.mergeCells(h_io_d, 3, h_io_d, 8);
                worksheet.getCell("C" + h_io_d).alignment = { vertical: 'center', horizontal: 'center' };

                worksheet.mergeCells(h_io_d + 1, 3, h_io_d + 1, 4);
                worksheet.getCell("C" + h_io_d + 1).alignment = { vertical: 'center', horizontal: 'center' };

                worksheet.mergeCells(h_io_d + 1, 5, h_io_d + 1, 6);
                worksheet.getCell("E" + h_io_d + 1).alignment = { vertical: 'center', horizontal: 'center' };

                worksheet.mergeCells(h_io_d + 1, 7, h_io_d + 1, 8);
                worksheet.getCell("G" + h_io_d + 1).alignment = { vertical: 'center', horizontal: 'center' };

                worksheet.mergeCells(h_io_d, 9, h_io_d, 14);
                worksheet.getCell("I" + h_io_d).alignment = { vertical: 'center', horizontal: 'center' };
                worksheet.mergeCells(h_io_d + 1, 9, h_io_d + 1, 10);
                worksheet.getCell("I" + h_io_d + 1).alignment = { vertical: 'center', horizontal: 'center' };
                worksheet.mergeCells(h_io_d + 1, 11, h_io_d + 1, 12);
                worksheet.getCell("K" + h_io_d + 1).alignment = { vertical: 'center', horizontal: 'center' };
                worksheet.mergeCells(h_io_d + 1, 13, h_io_d + 1, 14);
                worksheet.getCell("M" + h_io_d + 1).alignment = { vertical: 'center', horizontal: 'center' };

                worksheet.mergeCells(h_io_d, 15, h_io_d, 22);
                worksheet.getCell("O" + h_io_d).alignment = { vertical: 'center', horizontal: 'center' };
                worksheet.mergeCells(h_io_d + 1, 15, h_io_d + 1, 16);
                worksheet.getCell("O" + h_io_d + 1).alignment = { vertical: 'center', horizontal: 'center' };
                worksheet.mergeCells(h_io_d + 1, 17, h_io_d + 1, 18);
                worksheet.getCell("Q" + h_io_d + 1).alignment = { vertical: 'center', horizontal: 'center' };
                worksheet.mergeCells(h_io_d + 1, 19, h_io_d + 1, 20);
                worksheet.getCell("S" + h_io_d + 1).alignment = { vertical: 'center', horizontal: 'center' };
                worksheet.mergeCells(h_io_d + 1, 21, h_io_d + 1, 22);
                worksheet.getCell("U" + h_io_d + 1).alignment = { vertical: 'center', horizontal: 'center' };

                worksheet.mergeCells(h_io_d, 23, h_io_d, 28);
                worksheet.getCell("W" + h_io_d).alignment = { vertical: 'center', horizontal: 'center' };
                worksheet.mergeCells(h_io_d + 1, 23, h_io_d + 1, 24);
                worksheet.getCell("W" + h_io_d + 1).alignment = { vertical: 'center', horizontal: 'center' };
                worksheet.mergeCells(h_io_d + 1, 25, h_io_d + 1, 26);
                worksheet.getCell("Y" + h_io_d + 1).alignment = { vertical: 'center', horizontal: 'center' };
                worksheet.mergeCells(h_io_d + 1, 27, h_io_d + 1, 28);
                worksheet.getCell("AA" + h_io_d + 1).alignment = { vertical: 'center', horizontal: 'center' };

                /*
				   worksheet.getCell("D"+h_io_d+1).alignment = { vertical: 'center', horizontal: 'center' };
				   worksheet.mergeCells(h_io_d+1 ,4,h_io_d+1,5);
				   worksheet.getCell("F"+h_io_d+1).alignment = { vertical: 'center', horizontal: 'center' };
				   worksheet.mergeCells(h_io_d+1 ,6,h_io_d+1,7);
				   worksheet.getCell("H"+h_io_d+1).alignment = { vertical: 'center', horizontal: 'center' };
				   worksheet.mergeCells(h_io_d ,8,h_io_d ,13);
				   worksheet.getCell("J"+h_io_d+1).alignment = { vertical: 'center', horizontal: 'center' };
				   worksheet.mergeCells(h_io_d+1 ,8,h_io_d+1,9);
				   worksheet.getCell("L"+h_io_d+1).alignment = { vertical: 'center', horizontal: 'center' };
				   worksheet.mergeCells(h_io_d+1 ,10,h_io_d+1,11);
				   worksheet.getCell("N"+h_io_d+1).alignment = { vertical: 'center', horizontal: 'center' };
				   worksheet.mergeCells(h_io_d+1 ,12,h_io_d+1,13);
				   worksheet.getCell("P"+h_io_d+1).alignment = { vertical: 'center', horizontal: 'center' };
                   worksheet.mergeCells(h_io_d ,14,h_io_d,19);
				   worksheet.getCell("R"+h_io_d+1).alignment = { vertical: 'center', horizontal: 'center' };
				   worksheet.mergeCells(h_io_d+1 ,14,h_io_d+1,15);
				   worksheet.getCell("T"+h_io_d+1).alignment = { vertical: 'center', horizontal: 'center' };
				   worksheet.mergeCells(h_io_d+1 ,16,h_io_d+1,17);
				   worksheet.getCell("V"+h_io_d+1).alignment = { vertical: 'center', horizontal: 'center' };
				   worksheet.mergeCells(h_io_d+1 ,18,h_io_d+1,19);
				   worksheet.getCell("X"+h_io_d+1).alignment = { vertical: 'center', horizontal: 'center' };
				   worksheet.mergeCells(h_io_d ,20,h_io_d,25);
				   worksheet.getCell("T"+h_io_d).alignment = { vertical: 'center', horizontal: 'center' };
				   worksheet.mergeCells(h_io_d+1 ,20,h_io_d+1,21);
				   worksheet.mergeCells(h_io_d+1 ,22,h_io_d+1,23);
				   worksheet.mergeCells(h_io_d+1 ,24,h_io_d+1,25);*/
                pos = h_io_d + 2;
                var pos_sum = 0;
                var stock_merge = 0;
                if (dt_stock.length < 3) {
                    pos_sum = pos + dt_stock.length + (3 - dt_stock.length);
                    stock_merge = dt_stock.length + (3 - dt_stock.length);
                } else {
                    pos_sum = pos + dt_stock.length;
                    stock_merge = dt_stock.length;
                }
                //  worksheet.getCell("N5").value ="pos="+   pos + "stock_merge=" + stock_merge;
                var pos_sum1 = 0;
                for (var i = 0; i < stock_merge - 1; i++) {
                    pos_sum1 = pos + i;
                    if (dt_stock[i].ORD == "0") {

                        worksheet.mergeCells(pos + i, 1, pos + i, 28);
                        worksheet.getCell("A" + (pos + i)).fill = {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: { argb: 'b8f6b9' },
                            bgColor: { argb: 'b8f6b9' },
                            bold: true
                        };
                    } else if (dt_stock[i].ORD == "4") {
                        // worksheet.mergeCells(pos_sum1,2,pos_sum1,4);		
                        worksheet.mergeCells(pos + i, 1, pos + i, 2);

                        worksheet.mergeCells(pos_sum1, 3, pos_sum1, 4);
                        worksheet.getCell("E" + (pos + i)).value = "Ctns";
                        worksheet.mergeCells(pos_sum1, 7, pos_sum1, 9);
                        worksheet.getCell("J" + (pos + i)).value = "Kgs";
                        worksheet.mergeCells(pos_sum1, 11, pos_sum1, 13);
                        worksheet.getCell("N" + (pos + i)).value = "Plts";
                        worksheet.mergeCells(pos_sum1, 15, pos_sum1, 16);
                        worksheet.getCell("O" + (pos + i)).value = "HANDLING:";
                        worksheet.mergeCells(pos_sum1, 17, pos_sum1, 18);
                        worksheet.getCell("S" + (pos + i)).value = "Ctns";

                        worksheet.mergeCells(pos_sum1, 21, pos_sum1, 22);
                        worksheet.getCell("W" + (pos + i)).value = "Kgs";
                        worksheet.mergeCells(pos_sum1, 25, pos_sum1, 26);
                        worksheet.getCell("AA" + (pos + i)).value = "Plts";
                        //worksheet.getCell("Z"+pos_sum ).value =  dt_m[0].PLTS_HDL ;
                    } else {
                        worksheet.mergeCells(pos + i, 1, pos + i, 2);
                        worksheet.mergeCells(pos + i, 3, pos + i, 4);
                        worksheet.mergeCells(pos + i, 5, pos + i, 6);
                        worksheet.mergeCells(pos + i, 7, pos + i, 8);
                        worksheet.mergeCells(pos + i, 9, pos + i, 10);
                        worksheet.mergeCells(pos + i, 11, pos + i, 12);
                        worksheet.mergeCells(pos + i, 13, pos + i, 14);
                        worksheet.mergeCells(pos + i, 15, pos + i, 16);
                        worksheet.mergeCells(pos + i, 17, pos + i, 18);
                        worksheet.mergeCells(pos + i, 19, pos + i, 20);
                        worksheet.mergeCells(pos + i, 21, pos + i, 22);
                        worksheet.mergeCells(pos + i, 23, pos + i, 24);
                        worksheet.mergeCells(pos + i, 25, pos + i, 26);
                        worksheet.mergeCells(pos + i, 27, pos + i, 28);



                    }



                }
                var pos_sum_from = pos + dt_stock.length;

                /* worksheet.getCell("B"+pos_sum).value = { formula :"SUM(B" + pos +  ":B" + (pos_sum-1) + ")"}
                   worksheet.getCell("D"+pos_sum).value = { formula :"SUM(D" + pos +  ":D" + (pos_sum-1) + ")"}
                   worksheet.getCell("F"+pos_sum).value = { formula :"SUM(F" + pos +  ":F" + (pos_sum-1) + ")"}
                   worksheet.getCell("H"+pos_sum).value = { formula :"SUM(H" + pos +  ":H" + (pos_sum-1) + ")"}
                   worksheet.getCell("J"+pos_sum).value = { formula :"SUM(J" + pos +  ":J" + (pos_sum-1) + ")"}
                   worksheet.getCell("L"+pos_sum).value = { formula :"SUM(L" + pos +  ":L" + (pos_sum-1) + ")"}
				   worksheet.getCell("N"+pos_sum).value = { formula :"SUM(N" + pos +  ":N" + (pos_sum-1) + ")"}
                   worksheet.getCell("P"+pos_sum).value = { formula :"SUM(P" + pos +  ":P" + (pos_sum-1) + ")"}
                   worksheet.getCell("R"+pos_sum).value = { formula :"SUM(R" + pos +  ":R" + (pos_sum-1) + ")"}

                   worksheet.getCell("T"+pos_sum).value = { formula :"SUM(T" + pos +  ":T" + (pos_sum-1) + ")"}
                   worksheet.getCell("V"+pos_sum).value = { formula :"SUM(V" + pos +  ":V" + (pos_sum-1) + ")"}
                   worksheet.getCell("X"+pos_sum).value = { formula :"SUM(X" + pos +  ":X" + (pos_sum-1) + ")"}*/
                //  var stock_row = dt_stock.length;
                //  if(dt_stock.
                pos_sum = pos_sum - 1;
                worksheet.mergeCells(pos_sum, 2, pos_sum, 4);
                worksheet.getCell("B" + pos_sum).value = dt_stock[stock_row - 1].BEGIN_QTY;

                worksheet.mergeCells(pos_sum, 6, pos_sum, 9);
                worksheet.getCell("F" + pos_sum).value = dt_stock[stock_row - 1].BEGIN_PLTS;

                worksheet.mergeCells(pos_sum, 11, pos_sum, 12);
                worksheet.getCell("K" + pos_sum).value = dt_stock[stock_row - 1].IN_WEIGHT;

                worksheet.mergeCells(pos_sum, 17, pos_sum, 20);
                worksheet.getCell("Q" + pos_sum).value = dt_stock[stock_row - 1].OUT_WEIGHT;

                worksheet.mergeCells(pos_sum, 22, pos_sum, 24);
                worksheet.getCell("V" + pos_sum).value = dt_stock[stock_row - 1].OUT_PLTS;
                worksheet.mergeCells(pos_sum, 26, pos_sum, 27);
                worksheet.getCell("Z" + pos_sum).value = dt_stock[stock_row - 1].END_WEIGHT;

                /********* Print file excel ********/
                const reportFile = Helpers.tmpPath(file_new);

                await workbook.xlsx.writeFile(reportFile);
                if (item.P_FILE_TYPE == ".xlsx") {
                    return response.attachment(reportFile, file_nm + item.P_FILE_TYPE);
                }

                if (item.P_FILE_TYPE == ".pdf") {
                    const reportFilePdf = await Utils.excelToPdf(reportFile);
                    if (item.rtnURL == 'Y') {
                        const current = new Date();
                        const year = current.getFullYear()
                        let month = current.getMonth() + 1
                        let day = current.getDate()
                        if (day < 10) {
                            day = "0" + day
                        }
                        if (month < 10) {
                            month = "0" + month
                        }
                        const dir = ROOT_DIR_FILES + '/pdf/' + year + '/' + month
                        if (!fs.existsSync(dir)) {
                            fs.mkdirSync(dir, { recursive: true }, err => { console.log(err) })
                        }
                        //support return url
                        const unixtime = Date.now()
                        const rtnFile2 = reportFilePdf.replace(/\\/g, '/')
                        const fileName = '/pdf/' + year + '/' + month + "/rpt-" + unixtime + "-" + (rtnFile2.split("/").pop())
                        const destinationFile = dir + "/rpt-" + unixtime + "-" + (rtnFile2.split("/").pop())
                        await Utils.copyFile(reportFilePdf, destinationFile)
                        let token = AES.encrypt(fileName + "|" + year + month + day, APP_KEY)
                        token = token.replace(/\+/g, 'p1L2u3S').replace(/\//g, 's1L2a3S4h').replace(/=/g, 'e1Q2u3A4l')
                        return response.send(APP_URL_LOCAL + "/api/dso/getfiletoken?file_name=" + fileName + "&token=" + token)
                    } else {
                        return response.attachment(reportFilePdf, file_nm + item.P_FILE_TYPE);
                    }
                }
            }
        } catch (e) {
            console.log(e)
            return response.send(Utils.response(false, e.message, null))
        }
    }
}

module.exports = rptCS50040_6_wms;