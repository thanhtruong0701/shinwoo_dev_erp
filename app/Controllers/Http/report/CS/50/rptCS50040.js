"use strict";
const Helpers = use('Helpers')
const Antl = use("Antl");
const Utils = use("Utils");
const DBService = use("DBService")
var Excel = use('exceljs');
var workbook = new Excel.Workbook();
class rptCS50040 {
    async rpt_CS50040_Billing({ request, response, auth }) {
        try {
                /****************************** Get Param *********************************/
                let { para }        = request.get(['para']);
                /********* Parse pram to json ********/
                var item            = JSON.parse(para); 
                const user          = await auth.getUser() ;
                //var COMP_ID         = item.P_COMP_ID, COMP_NM = item.P_COMP_NM, COMP_TAX = item.P_COMP_TAX, COMP_ADD = item.P_COMP_ADD;
                const p_crt_by      = user.USER_ID;
                const p_language    = request.header("accept-language", "ENG");
                var file_nm         = [item.P_RPT_FILE];
                var file_type       = ".xlsx";
                var full_nm         = file_nm + file_type;
                var file_new        = file_nm + p_crt_by + file_type;
                var _resourcesPath  = [item.P_RPT_URL]+'/'+full_nm;
                var _store          = "CW_RPT_CS50040_1_1_NOCACHE"; 
                var _param          = [ item.P_M_PK]; 
            /***************************** Return failded ****************************/
            if (!user) 
            {
                return response.send(Utils.response(false, "Request failed!", null));
            } 
            /****************************** Begin call store and write excell *********/
            else 
            { 
                     /********* Call store  ***************/ 
                    var dt_m   = await DBService.callProcCursor("CW_RPT_CS50040_1_1_NOCACHE", _param , p_language , p_crt_by); 
                    var dt_stock   = await DBService.callProcCursor("CW_RPT_CS50040_1_2_NOCACHE", _param , p_language , p_crt_by);
                    var dt_service   = await DBService.callProcCursor("CW_RPT_CS50040_1_3_NOCACHE", _param , p_language , p_crt_by);

                    var dt_Data  = await DBService.callProcCursor(_store, _param , p_language , p_crt_by); 
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
                    var worksheet       = workbook.getWorksheet(1);
                    /********* Write file excel ********/
                    var pos = 18; 
                    var pos1 = 19; 
                    var service_rows =  dt_service.length;
                    //INFOMATION COMPANY  
					worksheet.getCell("H9").value = dt_m[0].DESCRIPTION;
					worksheet.getCell("L5").value = dt_m[0].SLIP_NO;
                    worksheet.getCell("B7").value = dt_m[0].PERIOD_;
                    worksheet.getCell("C8").value = dt_m[0].TR_DATE;
                    worksheet.getCell("H7").value = dt_m[0].PARTNER_NAME; ///code
                   // worksheet.getCell("C7").value = dt_Data[0].CNT;    ///sl
                 
                    if(dt_stock.length>1)
                    {
                        worksheet.duplicateRow(pos,dt_stock.length-2,true);
                    }  
                   
                    for (var i = 0; i < dt_stock.length; i++) 
                    {
                        var row_item = worksheet.getRow(pos + i); 
                        row_item.getCell(1).value   = dt_stock[i].TR_DATE;
                        row_item.getCell(2).value   = dt_stock[i].BEGIN_QTY;
                        row_item.getCell(3).value   = dt_stock[i].BEGIN_WEIGHT;
                        row_item.getCell(4).value   = dt_stock[i].BEGIN_PLTS;
                        row_item.getCell(5).value   = dt_stock[i].IN_QTY;
                        row_item.getCell(6).value   = dt_stock[i].IN_WEIGHT;
                        row_item.getCell(7).value   = dt_stock[i].IN_PLTS;
                        row_item.getCell(8).value   = dt_stock[i].OUT_QTY;
                        row_item.getCell(9).value   = dt_stock[i].OUT_WEIGHT;
                        row_item.getCell(10).value  = dt_stock[i].OUT_PLTS;
                        row_item.getCell(11).value   = dt_stock[i].END_QTY;
                        row_item.getCell(12).value   = dt_stock[i].END_WEIGHT;
                        row_item.getCell(13).value   = dt_stock[i].END_PTLS;
                        row_item.commit();
                    }
                    
                    
                   var pos_s = 12; 
                   var pos_s1 = 13; 
                   var pos_m  = 16;
                

                   if(dt_service.length>1)
                   {
                  
                      worksheet.duplicateRow(pos_s1,dt_service.length-2,true);
                   
                   }  

                    for (var j = 0; j < dt_service.length; j++) 
                    {
                        var row_s = worksheet.getRow(pos_s + j); 
                     
                        worksheet.unMergeCells(pos_s + j,1,pos_s + j,13);
                        row_s.getCell(1).value   = dt_service[j].ITEM_CODE;
                        row_s.getCell(2).value   = dt_service[j].ITEM_NAME;
                        row_s.getCell(7).value   = dt_service[j].UOM;
                        row_s.getCell(9).value   = dt_service[j].QTY;
                        row_s.getCell(11).value  = dt_service[j].AMT;
                        worksheet.mergeCells(pos_s + j,2,pos_s + j,6);
                        worksheet.mergeCells(pos_s + j,7,pos_s + j,8);
                        worksheet.mergeCells(pos_s + j,9,pos_s + j,10);
                        worksheet.mergeCells(pos_s + j,11,pos_s + j,13);
                    }
                   
                   if (service_rows <=1 )
                   {
                    service_rows = service_rows + 1 ;
                   }
                   var h_io_d = 14 + service_rows  ;

                   worksheet.mergeCells(h_io_d ,2,h_io_d,4);
                   worksheet.mergeCells(h_io_d ,5,h_io_d,7);
                   worksheet.mergeCells(h_io_d ,8,h_io_d,10);
                   worksheet.mergeCells(h_io_d ,11,h_io_d,13);
                /********* Print file excel ********/
                const reportFile    = Helpers.tmpPath(file_new);
               
                await workbook.xlsx.writeFile(reportFile); 
                if( item.P_FILE_TYPE ==".xlsx")
                {  
                    return response.attachment( reportFile, file_nm+ item.P_FILE_TYPE );
                }

                if( item.P_FILE_TYPE ==".pdf")
                { 
                    const reportFilePdf =  await Utils.excelToPdf(reportFile);
                    return response.attachment( reportFilePdf, file_nm+ item.P_FILE_TYPE );
                }
            }  
        } 
       catch (e) 
       {
        
          return response.send(Utils.response(false, e.message, null))
       }
    }
}

module.exports = rptCS50040;