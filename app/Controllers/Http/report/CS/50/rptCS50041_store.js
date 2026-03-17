"use strict";
const { DATE } = require("oracledb");
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
class rptCS50041_store {
    async rpt_cs50041_store({ request, response, auth }) {
        try {
            /****************************** Get Param *********************************/
            let { para } = request.get(['para']);
            /********* Parse pram to json ********/
            var item = JSON.parse(para);
            const user = await auth.getUser();
            
            const p_crt_by = user.USER_ID;
            const p_language = request.header("accept-language", "ENG");
            var file_nm = [item.P_RPT_FILE];
            var file_type = ".xlsx";
            var full_nm = file_nm + file_type;
            var template_excel = [item.P_TEMPLATE_FILE] + file_type;
            var file_new = file_nm + p_crt_by + file_type;
            var _resourcesPath = [item.P_RPT_URL] + '/' + template_excel;
            var _param = [item.P_M_PK];
           
            
            /***************************** Return failded ****************************/
            if (!user) {
                return response.send(Utils.response(false, "Request failed!", null));
            }
            /****************************** Begin call store and write excell *********/
            else {
                /********* Call store  ***************/
                var dt_m = await DBService.callProcCursor("CW_RPT_CS500416_NOCACHE", _param, p_language, p_crt_by, item.P_SECOND_DB_YN);
                var dt_stock = await DBService.callProcCursor("CW_RPT_CS50040_63_NOCACHE", _param, p_language, p_crt_by, item.P_SECOND_DB_YN);
                var dt_service = await DBService.callProcCursor("CW_RPT_CS500412_NOCACHE", _param, p_language, p_crt_by, item.P_SECOND_DB_YN);
                var dt_store = await DBService.callProcCursor("CW_RPT_CS500413_NOCACHE", _param, p_language, p_crt_by, item.P_SECOND_DB_YN);
                var dt_store_service_sum = await DBService.callProcCursor("CW_RPT_CS500415_NOCACHE", _param, p_language, p_crt_by, item.P_SECOND_DB_YN);

              
                /********* Read file excel ********/
                const templateFile = Helpers.resourcesPath(_resourcesPath);
                await workbook.xlsx.readFile(templateFile);
                console.log('templateFile=' + templateFile);
             
                
                /********* Write file excel ********/
                
                var store_name = "";
                var store_id   ="";
                var row_item_d ="";
                var pos_detail = 9;
                var l_TLG_WMS_TD_STORE_PK = "";
                var stt_store =0;
                var total_sheet = workbook.getWorksheet(1);
               total_sheet.getCell("A12").value = dt_m[0].DESCRIPTION_MON;
                if (dt_store_service_sum.length > 0) 
                {
                    if (dt_store_service_sum.length > 3) 
                    {
                        total_sheet.duplicateRow(18, dt_store_service_sum.length - 6, true);
                    } 
                    for (var i = 0; i < dt_store_service_sum.length; i++) 
                    {
                        row_item_d = total_sheet.getRow(17 + i);
                        if ( dt_store_service_sum[i].ORD=="1")
                        {
                            stt_store =stt_store + 1;
                            row_item_d.getCell(1).value =  stt_store;
                        }else{
                            row_item_d.getCell(1).value =  "";
                        }
                       if ( dt_store_service_sum[i].ORD=="3")
                        {
                          /* row_item_d.getCell(1).border = {
                             
                                bottom: {style:'thin', color: {argb:'00000000'}},
                                right: {style:'thin', color: {argb:'00000000'}},
                                top: {style:'thin', color: {argb:'FFFFFFFF'}},
                                left: {style:'thin', color: {argb:'FFFFFFFF'}},
                            }; 
                            row_item_d.getCell(2).border = {
                             
                                bottom: {style:'thin', color: {argb:'00000000'}},
                                right: {style:'thin', color: {argb:'FFFFFFFF'}},
                                top: {style:'thin', color: {argb:'FFFFFFFF'}},
                                left: {style:'thin', color: {argb:'FFFFFFFF'}},
                              
                            }; */
                            /*row_item_d.getCell(3).border = {
                             
                                bottom: {style:'thin', color: {argb:'00000000'}},
                              
                            };
                            row_item_d.getCell(4).border = {
                             
                                bottom: {style:'thin', color: {argb:'00000000'}},
                              
                            };
                            row_item_d.getCell(5).border = {
                             
                                bottom: {style:'thin', color: {argb:'00000000'}},
                              
                            };
                            row_item_d.getCell(6).border = {
                             
                                bottom: {style:'thin', color: {argb:'00000000'}},
                              
                            };
                            row_item_d.getCell(7).border = {
                             
                                bottom: {style:'thin', color: {argb:'00000000'}},
                              
                            };
                            row_item_d.getCell(8).border = {
                             
                                bottom: {style:'thin', color: {argb:'00000000'}},
                              
                            };
                            row_item_d.getCell(9).border = {
                             
                                bottom: {style:'thin', color: {argb:'00000000'}},
                              
                            };
                            row_item_d.getCell(10).border = {
                             
                                bottom: {style:'thin', color: {argb:'00000000'}},
                              
                            };*/
                           /* row_item_d.getCell(2).border  = { bottom: {style:'thin', color: {argb:'00000000'}}};    
                            row_item_d.getCell(3).border  = { bottom: {style:'thin', color: {argb:'FFFFFFFF'}}};    
                            row_item_d.getCell(4).border  = { bottom: {style:'thin', color: {argb:'000000'}}}; 
                            row_item_d.getCell(5).border  = { bottom: {style:'thin', color: {argb:'000000'}}}; 
                            row_item_d.getCell(6).border  = { bottom: {style:'thin', color: {argb:'A6A6A6'}}}; 
                            row_item_d.getCell(7).border  = { bottom: {style:'thin', color: {argb:'A6A6A6'}}}; 
                            row_item_d.getCell(8).border  = { bottom: {style:'thin', color: {argb:'A6A6A6'}}}; 
                            row_item_d.getCell(9).border  = { bottom: {style:'thin', color: {argb:'A6A6A6'}}}; 
                            row_item_d.getCell(10).border = { bottom: {style:'thin', color: {argb:'A6A6A6'}}};   */ 
                        }
                          
                        row_item_d.getCell(2).value =  dt_store_service_sum[i].ITEM_NAME;
                        row_item_d.getCell(10).value =  dt_store_service_sum[i].AMT;
                        if ( dt_store_service_sum[i].TOTAL_YN=="Y")
                        {
                            total_sheet.mergeCells(17 + i, 1, 17 + i, 7); 
                            total_sheet.mergeCells(17 + i, 8, 17 + i, 10); 
                            row_item_d.getCell(1).font  = { italic: false, bold: true, color: {argb:'000000'}, size:11, name: 'Times New Roman'};
                            row_item_d.getCell(8).font  = { italic: false, bold: true, color: {argb:'000000'}, size:11, name: 'Times New Roman'};
                            row_item_d.getCell(1).value =  dt_store_service_sum[i].ITEM_NAME;
                            row_item_d.getCell(8).value =  dt_store_service_sum[i].AMT;
                        }    
                    }

                } else {
                    return response.send(Utils.response(false, "no_data_found", null))
                }

                var sheet2_name = workbook.getWorksheet(3);
                if (dt_store.length>0) 
                    {
                       for (var i = 0; i < dt_store.length; i++) 
                       {
                            sheet2_name.name = dt_store[0].STORE_NAME;
                           l_TLG_WMS_TD_STORE_PK = dt_store[i].TLG_WMS_TD_STORE_PK;
                            var _param_store = [item.P_M_PK,l_TLG_WMS_TD_STORE_PK];
                           var dt_service_by_store = await DBService.callProcCursor("CW_RPT_CS500414_NOCACHE", _param_store, p_language, p_crt_by, item.P_SECOND_DB_YN);
                          
                            if  ( dt_store[i].STORE_ID != store_id )
                            { 
                                store_name = dt_store[i].STORE_NAME;
                                store_id = dt_store[i].STORE_ID;    
                               if(i>0)
                                { 
                                    let sheetToClone =  workbook.getWorksheet(2);
                                    let copySheet = workbook.addWorksheet();
                                    copySheet.model = sheetToClone.model;
                                    copySheet.name = store_name;
                                    copySheet.mergeCells(1, 1, 1, 6);
                                    copySheet.getCell("A1").value =  dt_store[i].SERVICE_MONTH;
                                    copySheet.getCell("A1").alignment = { vertical: 'middle', horizontal: 'center' };
                                   if (dt_service_by_store.length > 3) {
                                        copySheet.duplicateRow(10, dt_service_by_store.length - 2, true);
                                    } 
                                    copySheet.getCell("B4").value = dt_store[i].PARTNER_NAME;
                                    copySheet.getCell("B5").value = dt_store[i].TAX_CODE;
                                    copySheet.getCell("B6").value = dt_store[i].ADDR1;
                                    row_item_d = copySheet.getRow(pos_detail);
                                    for (var j = 0; j < dt_service_by_store.length; j++) 
                                        {
                                            row_item_d = copySheet.getRow(pos_detail + j);
                                           
                                            if( dt_service_by_store[j].BOLD_YN=='Y'){
                                                copySheet.mergeCells(pos_detail + j, 1, pos_detail + j, 5); 
                                                row_item_d.getCell(1).value =  dt_service_by_store[j].ITEM_NAME;
                                                row_item_d.getCell(6).value =  dt_service_by_store[j].AMT;
                                                row_item_d.getCell(1).font  = { italic: false, bold: true, color: {argb:'000000'}, size:11, name: 'Times New Roman'};
                                                row_item_d.getCell(6).font  = { italic: false, bold: true, color: {argb:'000000'}, size:11, name: 'Times New Roman'};
                                            }else{
                                                row_item_d.getCell(1).value = j + 1;    
                                                row_item_d.getCell(2).value =  dt_service_by_store[j].ITEM_NAME;
                                                row_item_d.getCell(3).value =  dt_service_by_store[j].UOM;
                                                row_item_d.getCell(4).value =  dt_service_by_store[j].SERVICE_QTY;
                                                row_item_d.getCell(5).value =  dt_service_by_store[j].U_PRICE;
                                                row_item_d.getCell(6).value =  dt_service_by_store[j].AMT;
                                           }
                                        }    

                                }

                            }
                            if (i==0 )
                            {
                                sheet2_name.getCell("B4").value = dt_store[0].PARTNER_NAME;
                                sheet2_name.getCell("B5").value = dt_store[0].TAX_CODE;
                                sheet2_name.getCell("B6").value = dt_store[0].ADDR1;
                                sheet2_name.mergeCells(1, 1, 1, 6);
                                sheet2_name.getCell("A1").value = dt_store[0].SERVICE_MONTH;
                                sheet2_name.getCell("A1").alignment = { vertical: 'middle', horizontal: 'center' };
                               
                               if (dt_service_by_store.length > 3) {
                                    sheet2_name.duplicateRow(10, dt_service_by_store.length - 2, true);
                                } 
                                for (var s = 0; s < dt_service_by_store.length; s++) 
                                {
                                    row_item_d = sheet2_name.getRow(pos_detail + s);
                                    if( dt_service_by_store[s].BOLD_YN=='Y'){
                                        sheet2_name.mergeCells(pos_detail + s, 1, pos_detail + s, 5); 
                                        row_item_d.getCell(1).value =  dt_service_by_store[s].ITEM_NAME;
                                        row_item_d.getCell(6).value =  dt_service_by_store[s].AMT;
                                        row_item_d.getCell(1).font  = { italic: false, bold: true, color: {argb:'D9D9D9'}, size:11, name: 'Times New Roman'};
                                        row_item_d.getCell(6).font  = { italic: false, bold: true, color: {argb:'000000'}, size:11, name: 'Times New Roman'};
                                    }else{
                                        row_item_d.getCell(1).value = s + 1;    
                                        row_item_d.getCell(2).value =  dt_service_by_store[s].ITEM_NAME;
                                        row_item_d.getCell(3).value =  dt_service_by_store[s].UOM;
                                        row_item_d.getCell(4).value =  dt_service_by_store[s].SERVICE_QTY;
                                        row_item_d.getCell(5).value =  dt_service_by_store[s].U_PRICE;
                                        row_item_d.getCell(6).value =  dt_service_by_store[s].AMT;
                                   }
                                } 
                            }                      
                        }
                    }        
                

                /********* Print file excel ********/
                const reportFile = Helpers.tmpPath(file_new);

                await workbook.xlsx.writeFile(reportFile);
                if (item.P_FILE_TYPE == ".xlsx") {
                    return response.attachment(reportFile, file_nm + item.P_FILE_TYPE);
                }
                /*
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
                    */
            
            }
        } catch (e) {
            console.log(e)
            return response.send(Utils.response(false, e.message, null))
        }
    }
}

module.exports = rptCS50041_store;