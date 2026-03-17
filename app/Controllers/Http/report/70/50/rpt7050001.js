"use strict";
const Helpers = use('Helpers')
const Antl = use("Antl");
const Utils = use("Utils");
const DBService = use("DBService")
var Excel = use('exceljs');
var workbook = new Excel.Workbook();
class rpt7050001 {
    async rpt7050001_01({ request, response, auth }) {
        try {
                /****************************** Get Param *********************************/
                let { para }        = request.get(['para']);
                /********* Parse pram to json ********/
                var item            = JSON.parse(para); 
                const user          = await auth.getUser() ;
                //var COMP_ID         = item.P_COMP_ID, COMP_NM = item.P_COMP_NM, COMP_TAX = item.P_COMP_TAX, COMP_ADD = item.P_COMP_ADD;
                const p_crt_by      = user.USER_ID;
                const p_language    = request.header("accept-language", "ENG");
              
                var file_nm         = "rpt7050001_01";
                var file_type       = ".xlsx";
                var full_nm         = file_nm + file_type;
                var file_new        = file_nm + p_crt_by + file_type;
                var _resourcesPath  = "report/70/50"+'/'+full_nm;
                var _store          = "LG_SEL_DSBS20280_1_NJ"; 
                var _param          = [ item.P_DATE]; 


            
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
                    var pos = 5;  
                    //INFOMATION COMPANY
                    row.getCell(2).value = item.P_DATE_D;  
                    row.getCell(6).value = item.P_DATE_TODAY;

                    if(dt_m.length>1)
                    {
                        worksheet.duplicateRow(pos,dt_m.length-2,true);
                    }  

                     for (var i = 0; i < dt_m.length; i++) 
                    {
                        var row = worksheet.getRow(pos + i);  
                        row.getCell(1).value = dt_m[i].INFO_1; 
                        row.getCell(2).value = dt_m[i].INFO_2; 
                        row.getCell(3).value = dt_m[i].BEF_DC_AMT_10;   
                        row.getCell(4).value = dt_m[i].BEF_DC_AMT_20; 
                        row.getCell(5).value = dt_m[i].BEF_DC_AMT_30; 
                        row.getCell(6).value = dt_m[i].BEF_DC_AMT_TTL; 
                        
                        if(i>0 && dt_m[i-1].INFO_1 == dt_m[i].INFO_1 )
                        {
                            worksheet.mergeCells(pos+i -1 ,1, pos+i, 1);
                        }
                    } 

                     
                /********* Print file excel ********/
                const reportFile    = Helpers.tmpPath(file_new); 
                await workbook.xlsx.writeFile(reportFile);  
                return response.attachment( reportFile, file_new )
                
            }  
        } 
       catch (e) 
       {
          // Utils.Logger({ LVL: "error", MODULE: "Report", FUNC: "Picking_list", CONTENT: e.message }) 
          //return response.send(null);
          return response.send(Utils.response(false, e.message, null))
       }
    }
}

module.exports = rpt7050001;