"use strict";
const Helpers = use('Helpers')
const Antl = use("Antl");
const Utils = use("Utils");
const DBService = use("DBService")
var Excel = use('exceljs');
var workbook = new Excel.Workbook();
class rptCS50071 {
    async rpt_CS50071({ request, response, auth }) {
        try {
                /****************************** Get Param *********************************/
                let { para }        = request.get(['para']);
                /********* Parse pram to json ********/
                var item            = JSON.parse(para); 
                const user          = await auth.getUser() ;
                const p_crt_by      = user.USER_ID;
                const p_language    = request.header("accept-language", "ENG");
                var file_nm         = [item.P_RPT_FILE];
                var file_type       = ".xlsx";
                var full_nm         = file_nm + file_type;
                var file_new        = file_nm + p_crt_by + file_type;
                var _resourcesPath  = [item.P_RPT_URL]+'/'+full_nm;
				
                var _param          = [ item.P_COMPANY_PK,item.P_TCO_BUSPLACE_PK,item.P_CONSIGNOR_PK,item.P_DATE]; 
			                              
            /***************************** Return failded ****************************/
            if (!user) 
            {
                return response.send(Utils.response(false, "Request failed!", null));
            } 
            /****************************** Begin call store and write excell *********/
            else 
            { 
                     /********* Call store  ***************/ 
                   
                    var dt_m   = await DBService.callProcCursor("CW_CS50070_3_NOCACHE", _param , p_language , p_crt_by); 
					var dt    = await DBService.callProcCursor("CW_CS50070_2_NOCACHE", _param , p_language , p_crt_by);
					
                    if (dt.length>0) 
                    {
                        dt = dt;
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
                    var pos = 9; 
                    var _TYPE_NAME="";
                    var _TYPE_NAME_b="";
                    var r_end = 0;
                    var merge_end = 0;
                    //INFOMATION COMPANY
                    if (dt_m.length>0) 
                    {
                        dt_m = dt_m;
                   
                        worksheet.getCell("D1").value = dt_m[0].LOC_NM;

                        worksheet.getCell("D5").value = dt_m[0].PARTNER_NAME;
                        worksheet.getCell("D6").value = dt_m[0].VIEW_DATE; ///code
                    } 
                    
                    if(dt.length>1)
                    {
                        worksheet.duplicateRow(10,dt.length-2,true);
                        _TYPE_NAME = dt[0].TYPE_NAME;
                        _TYPE_NAME_b = dt[0].TYPE_NAME;
                        r_end = dt.length + 8;
                    }  
                    var _rTYPE_NAME_start_merg = pos, _rTYPE_NAME_end_merg = 0;
                    

                    for (var i = 0; i < dt.length; i++) 
                    {
                        var row_item = worksheet.getRow(pos + i); 
                        worksheet.unMergeCells(pos + i,1,pos + i,7);
                        row_item.getCell(2).value   = dt[i].TYPE_NAME;
                        row_item.getCell(3).value   = dt[i].ITEM_NAME;
                        row_item.getCell(5).value   = dt[i].DAILY_SUM;
                        row_item.getCell(6).value   = dt[i].MONTH_SUM;
                        row_item.getCell(7).value   = dt[i].YEARLY_SUM;
						worksheet.mergeCells(pos + i,3,pos + i,4);
                        _rTYPE_NAME_end_merg = pos + i;
                        if(i >0 && dt[i].TYPE_NAME != _TYPE_NAME ) 
                        {
                            worksheet.mergeCells(_rTYPE_NAME_start_merg,2,_rTYPE_NAME_end_merg - 1,2);
                            _rTYPE_NAME_start_merg = pos + i;
                            _TYPE_NAME = dt[i].TYPE_NAME;	
                            merge_end = i;
                        }
                       
                        row_item.commit();
                    }
                    if(_TYPE_NAME_b ==_TYPE_NAME)
                    {
                        worksheet.unMergeCells(pos + i,1,pos + i,7);
                        worksheet.mergeCells(9,2,r_end,2);
                    }
                    if(merge_end <  dt.length -1)
                    {
                        worksheet.unMergeCells(_rTYPE_NAME_start_merg,2, dt.length + pos - 1,2);
                        worksheet.mergeCells(_rTYPE_NAME_start_merg,2, dt.length -1 + pos,2);
                      //  worksheet.getCell("F20").value = _rTYPE_NAME_start_merg;
                     //   worksheet.getCell("G20").value =dt.length  + pos - 1 ; ///code

                    }

                  
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

module.exports = rptCS50071;