"use strict";
const Helpers = use('Helpers')
const Antl = use("Antl");
const Utils = use("Utils");
const DBService = use("DBService")
var Excel = use('exceljs');
var workbook = new Excel.Workbook();
class rpt7050005 {
    async rpt7050005_01({ request, response, auth }) {
        try {
                /****************************** Get Param *********************************/
                let { para }        = request.get(['para']);
                /********* Parse pram to json ********/
                var item            = JSON.parse(para); 
                const user          = await auth.getUser() ;
                const p_crt_by      = user.USER_ID;
                const p_language    = request.header("accept-language", "ENG");
              
                var file_nm         = "rpt7050005_01";
                var file_type       = ".xlsx";
                var full_nm         = file_nm + file_type;
                var file_new        = file_nm + p_crt_by + file_type;
                var _resourcesPath  = "report/70/50"+'/'+full_nm;
                var _store          = "AC_SEL_ER00050_2_NJ"; 
                var _store2          = "AC_SEL_ER00050_1_2_NJ"; 
                var _param          = [item.P_MONTH,item.P_MONTH2,item.P_CNT]; 


            
            /***************************** Return failded ****************************/
            if (!user) 
            {
                return response.send(Utils.response(false, "Request failed!", null));
            } 
            /****************************** Begin call store and write excell *********/
            else 
            { 
                     /********* Call store  ***************/ 
                    var dt_m   = await DBService.callProcCursor(_store, _param , p_language , p_crt_by); 
                    var dt_m2 = await DBService.callProcCursor(_store2, _param, p_language, p_crt_by);
                
                    if (dt_m.length>0) 
                    {
                        dt_m = dt_m;
                    } 
                    else 
                    {
                        return response.send(Utils.response(false, "no_data_found", null))
                    }  
                    /********* Read file excel ********/ 
                    const templateFile  = Helpers.resourcesPath(_resourcesPath); 
                    await workbook.xlsx.readFile(templateFile);
                    var worksheet        = workbook.getWorksheet(1); 
                
                    /********* Write file excel ********/
                    var row = worksheet.getRow(3);
                    var pos = 7;  
                    //INFOMATION COMPANY
                    const month1 = item.P_MONTH;
                    const month2 = item.P_MONTH2;
    
                    let month3 = "";
                    let month4 = "";
                    let period = "";
                    if(month1 && month1.trim() != "") {
                        month3 = month1.substr(0, 4) + "/" + month1.substr(4, 2);
                        month4 = month2.substr(0, 4) + "/" + month2.substr(4, 2);
                        period = month3 + " ~ " + month4;
                    }

                    row.getCell(3).value = period;  
                    row.getCell(8).value = item.P_CNT;

                    var row = worksheet.getRow(6);
                    
                    row.getCell(3).value = dt_m[0].AMT_10; 
                    row.getCell(5).value = dt_m[0].AMT_20; 
                    row.getCell(6).value = dt_m[0].AMT_30; 
                    row.getCell(8).value = dt_m[0].AMT_TTL; 

                    pos = dt_m.length+9
                    if(dt_m2.length>1)
                    {
                        worksheet.duplicateRow(pos,dt_m2.length-1,true);
                    }  
                    
                    let l_qty_10 = 0;
                    let l_ratio_10 = 0;
                    let l_qty_20 = 0;
                    let l_ratio_20 = 0;
                    let l_qty_30 = 0;
                    let l_ratio_30 = 0;
                    let l_qty_ttl = 0;
                    let l_ratio_ttl = 0;

                    for (var i = 0; i < dt_m2.length; i++) 
                    {
                        var row = worksheet.getRow(pos + i);  
                        row.getCell(1).value = dt_m2[i].MYRANK; 
                        row.getCell(2).value = dt_m2[i].ITEM_NAME_10; 
                        row.getCell(3).value = dt_m2[i].QTY_10;   
                        if(dt_m2[i].QTY_10) {
                            l_qty_10 += parseFloat(dt_m2[i].QTY_10);
                        }
                        row.getCell(4).value = dt_m2[i].RATIO_10; 
                        if(dt_m2[i].RATIO_10) {
                            l_ratio_10 += parseFloat(dt_m2[i].RATIO_10);
                        }                        
                        row.getCell(5).value = dt_m2[i].ITEM_NAME_20; 
                        row.getCell(6).value = dt_m2[i].QTY_20;
                        if(dt_m2[i].QTY_20) {
                            l_qty_20 += parseFloat(dt_m2[i].QTY_20);
                        } 
                        row.getCell(7).value = dt_m2[i].RATIO_20;
                        if(dt_m2[i].RATIO_20) {
                            l_ratio_20 += parseFloat(dt_m2[i].RATIO_20);
                        }  
                        row.getCell(8).value = dt_m2[i].ITEM_NAME_30; 
                        row.getCell(9).value = dt_m2[i].QTY_30; 
                        if(dt_m2[i].QTY_30) {
                            l_qty_30 += parseFloat(dt_m2[i].QTY_30);
                        } 
                        row.getCell(10).value = dt_m2[i].RATIO_30;  
                        if(dt_m2[i].RATIO_30) {
                            l_ratio_30 += parseFloat(dt_m2[i].RATIO_30);
                        }                                              
                        row.getCell(11).value = dt_m2[i].ITEM_NAME_TTL; 
                        row.getCell(12).value = dt_m2[i].TTL_QTY; 
                        if(dt_m2[i].TTL_QTY) {
                            l_qty_ttl += parseFloat(dt_m2[i].TTL_QTY);
                        } 
                        row.getCell(13).value = dt_m2[i].RATIO_TTL;                      
                        if(dt_m2[i].RATIO_TTL) {
                            l_ratio_ttl += parseFloat(dt_m2[i].RATIO_TTL);
                        } 
                    } 
                    worksheet.mergeCells(pos+i, 1, pos+i, 2);
                    var l_rowTotal = worksheet.getRow(pos + dt_m2.length);

                    l_rowTotal.getCell(3).value = l_qty_10;  
                    l_rowTotal.getCell(4).value = l_ratio_10;  
                    l_rowTotal.getCell(6).value = l_qty_20;  
                    l_rowTotal.getCell(7).value = l_ratio_20;  
                    l_rowTotal.getCell(9).value = l_qty_30;  
                    l_rowTotal.getCell(10).value = l_ratio_30;                      
                    l_rowTotal.getCell(12).value = l_qty_ttl;  
                    l_rowTotal.getCell(13).value = l_ratio_ttl;   

                /********* Print file excel ********/
                const reportFile    = Helpers.tmpPath(file_new); 
                await workbook.xlsx.writeFile(reportFile);  
                return response.attachment( reportFile, file_new )
                
            }  
        } 
       catch (e) 
       {
          return response.send(Utils.response(false, e.message, null))
       }
    }
}

module.exports = rpt7050005;