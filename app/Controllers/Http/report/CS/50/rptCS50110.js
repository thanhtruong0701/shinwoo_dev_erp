"use strict";
const Helpers = use('Helpers')
const Antl = use("Antl");
const Utils = use("Utils");
const DBService = use("DBService")
var Excel = use('exceljs');
var workbook = new Excel.Workbook();
class rptCS50110 {
    async rpt_CS50110_Billing({ request, response, auth }) {
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
                    var dt_stock   = await DBService.callProcCursor("CW_RPT_CS50040_20_NOCACHE", _param , p_language , p_crt_by);
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
                   
                   // var pos1 = 19; 
                    var service_rows =  dt_service.length;
                    //INFOMATION COMPANY  
					worksheet.getCell("K6").value ="Remark/Ghi chú: "+ dt_m[0].DESCRIPTION;
					worksheet.getCell("Y1").value ="No. "+ dt_m[0].SLIP_NO;
                    worksheet.getCell("A4").value ="Period/Kỳ: " + dt_m[0].PERIOD_;
                    worksheet.getCell("A5").value ="Billing Date/Ngày làm: " + dt_m[0].TR_DATE;
                    worksheet.getCell("K4").value ="Customer/Khách hàng: " + dt_m[0].PARTNER_NAME; ///code
                   // worksheet.getCell("C7").value = dt_Data[0].CNT;    ///sl
                   var pos = 14; 
                   var pos_dup = 15; 
                    if(dt_stock.length>3)
                    {
                        worksheet.duplicateRow(pos_dup,dt_stock.length-3,true);
                    }  
                   
                    for (var i = 0; i < dt_stock.length; i++) 
                    {
                        var row_item = worksheet.getRow(pos + i); 
                      // worksheet.unMergeCells(pos + i,1,pos + i,25);
                        row_item.getCell(1).value   = dt_stock[i].TR_DATE;
                        row_item.getCell(2).value   = dt_stock[i].BEGIN_QTY;
                        row_item.getCell(4).value   = dt_stock[i].BEGIN_WEIGHT;
                        row_item.getCell(6).value   = dt_stock[i].BEGIN_PLTS;
                        row_item.getCell(8).value   = dt_stock[i].IN_QTY;
                        row_item.getCell(10).value   = dt_stock[i].IN_WEIGHT;
                        row_item.getCell(12).value   = dt_stock[i].IN_PLTS;
                        row_item.getCell(14).value   = dt_stock[i].OUT_QTY;
                        row_item.getCell(16).value   = dt_stock[i].OUT_WEIGHT;
                        row_item.getCell(18).value  = dt_stock[i].OUT_PLTS;
                        row_item.getCell(20).value   = dt_stock[i].END_QTY;
                        row_item.getCell(22).value   = dt_stock[i].END_WEIGHT;
                        row_item.getCell(24).value   = dt_stock[i].END_PTLS;
												
                        row_item.commit();
                    }
                    
                    
                    var pos_s = 9; 
                    var pos_s1 = 10; 
                   

                    if(dt_service.length>2)
                    {
						worksheet.duplicateRow(pos_s1,dt_service.length-2,true);
                    }  
                   
                    for (var j = 0; j < dt_service.length; j++) 
                    {
                        var row_s = worksheet.getRow(pos_s + j); 
                       
                        worksheet.unMergeCells(pos_s + j,1,pos_s + j,25);
                        row_s.getCell(1).value   = dt_service[j].ITEM_CODE;
						row_s.getCell(3).value   = dt_service[j].ITEM_NAME;
						row_s.getCell(15).value   = dt_service[j].UOM;
						row_s.getCell(17).value   = dt_service[j].QTY;
                        row_s.getCell(15).alignment = { vertical: 'center', horizontal: 'center' };
						row_s.getCell(17).alignment = { vertical: 'center', horizontal: 'right' };
                        worksheet.mergeCells(pos_s + j,1,pos_s + j,2);
						worksheet.mergeCells(pos_s + j,3,pos_s + j,14);
						worksheet.mergeCells(pos_s + j,15,pos_s + j,16);
						worksheet.mergeCells(pos_s + j,17,pos_s + j,20);
						worksheet.mergeCells(pos_s + j,21,pos_s + j,25);
						row_s.getCell(1).alignment = { vertical: 'center', horizontal: 'left' };
						row_s.getCell(3).alignment = { vertical: 'center', horizontal: 'left' };
						
					
                    }
                   	//worksheet.getCell("Q11").alignment = { vertical: 'center', horizontal: 'right' };
                   if (service_rows <=1 )
                   {
                    service_rows = service_rows + 1 ;
                   }
                   var h_io_d = 9 + service_rows + 1;
				   //worksheet.getCell("A12").value ="h_io_d="+   h_io_d;
                   worksheet.mergeCells(h_io_d ,1,h_io_d + 1,1);
				   worksheet.getCell("B"+h_io_d).alignment = { vertical: 'center', horizontal: 'center' };
                   worksheet.mergeCells(h_io_d ,2,h_io_d,7);
				   worksheet.getCell("B"+h_io_d+1).alignment = { vertical: 'center', horizontal: 'center' };
                   worksheet.mergeCells(h_io_d+1 ,2,h_io_d+1,3);
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
				   worksheet.mergeCells(h_io_d+1 ,24,h_io_d+1,25);
				   pos = h_io_d + 2 ;
                    var pos_sum = 0;
                    var stock_merge = 0;
                    if(dt_stock.length <3 )
                    {
                       pos_sum = pos + dt_stock.length + (3-dt_stock.length);
                       stock_merge =  dt_stock.length + (3-dt_stock.length);
                    }else{
                       pos_sum = pos + dt_stock.length;
                       stock_merge = dt_stock.length;
                    }

				    for (var i = 0; i <= stock_merge ; i++) 
                    {
						worksheet.mergeCells(pos + i,2,pos + i,3);
						worksheet.mergeCells(pos + i,4,pos + i,5);
						worksheet.mergeCells(pos + i,6,pos + i,7);
						worksheet.mergeCells(pos + i,8,pos + i,9);
						worksheet.mergeCells(pos + i,10,pos + i,11);
						worksheet.mergeCells(pos + i,12,pos + i,13);
						worksheet.mergeCells(pos + i,14,pos + i,15);
						worksheet.mergeCells(pos + i,16,pos + i,17);
						worksheet.mergeCells(pos + i,18,pos + i,19);
						worksheet.mergeCells(pos + i,20,pos + i,21);
						worksheet.mergeCells(pos + i,22,pos + i,23);
						worksheet.mergeCells(pos + i,24,pos + i,25);
					}	
                   
                   var pos_sum_from = pos + dt_stock.length;
                 
                   worksheet.getCell("B"+pos_sum).value = { formula :"SUM(B" + pos +  ":B" + (pos_sum-1) + ")"}
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
                   worksheet.getCell("X"+pos_sum).value = { formula :"SUM(X" + pos +  ":X" + (pos_sum-1) + ")"}
                   
                   pos_sum = pos_sum + 1;
                   worksheet.mergeCells(pos_sum,2,pos_sum,3);
                   worksheet.getCell("B"+pos_sum).value =  dt_m[0].QTY_STORAGE;

                   worksheet.mergeCells(pos_sum,5,pos_sum ,7);
                   worksheet.getCell("E"+pos_sum).value = dt_m[0].WEIGHT_STORAGE ;
                   
                   worksheet.mergeCells(pos_sum ,9,pos_sum ,11);
                   worksheet.getCell("I"+pos_sum).value =  dt_m[0].PLTS_STORAGE ;

                   worksheet.mergeCells(pos_sum ,16,pos_sum,17);
                   worksheet.getCell("P"+pos_sum ).value =  dt_m[0].QTY_HDL ;

                   worksheet.mergeCells(pos_sum ,19,pos_sum ,21);
                   worksheet.getCell("S"+pos_sum).value =  dt_m[0].WEIGHT_HDL ;
                   worksheet.mergeCells(pos_sum ,23,pos_sum ,24);
                   worksheet.getCell("W"+pos_sum ).value =  dt_m[0].PLTS_HDL ;

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
          console.log(e)
          return response.send(Utils.response(false, e.message, null))
       }
    }
}

module.exports = rptCS50110;