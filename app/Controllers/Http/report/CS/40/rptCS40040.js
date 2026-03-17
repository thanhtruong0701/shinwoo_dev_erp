"use strict";
const Helpers = use('Helpers')
const Antl = use("Antl");
const Utils = use("Utils");
const DBService = use("DBService")
var Excel = use('exceljs');
var workbook = new Excel.Workbook();
class rptCS40040 {
    async rpt_CS40040_Picking_List({ request, response, auth }) {
        try {
                /****************************** Get Param *********************************/
                let { para }        = request.get(['para']);
                /********* Parse pram to json ********/
                var item            = JSON.parse(para); 
                const user          = await auth.getUser() ;
                var COMP_ID         = item.P_COMP_ID, COMP_NM = item.P_COMP_NM, COMP_TAX = item.P_COMP_TAX, COMP_ADD = item.P_COMP_ADD;
                const p_crt_by      = user.USER_ID;
                const p_language    = request.header("accept-language", "ENG");
                var file_nm         = [item.P_RPT_FILE];
                var file_type       = ".xlsx";
                var full_nm         = file_nm + file_type;
                var file_new        = file_nm + p_crt_by + file_type;
                var _resourcesPath  = [item.P_RPT_URL]+'/'+full_nm;
                var _store          = "CW_RPT_CS40040_PS"; 
                var _param          = [item.P_COMPANY, item.P_M_PK]; 
            /***************************** Return failded ****************************/
            if (!user) 
            {
                return response.send(Utils.response(false, "Request failed!", null));
            } 
            /****************************** Begin call store and write excell *********/
            else 
            { 
                     /********* Call store  ***************/ 
                    var dt_Data  = await DBService.callProcCursor(_store, _param , p_language , p_crt_by); 
                    if (dt_Data.length>0) 
                    {
                        dt_Data = dt_Data;
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
                    //INFOMATION COMPANY
                    worksheet.getCell("C1").value = COMP_NM;
                    worksheet.getCell("C2").value = COMP_ADD; 
                    worksheet.getCell("C6").value = dt_Data[0].LIST_CODE; ///code
                    worksheet.getCell("C7").value = dt_Data[0].CNT;    ///sl
                    if(dt_Data.length>1)
                    {
                        worksheet.duplicateRow(pos,dt_Data.length-2,true);
                    }  

                    for (var i = 0; i < dt_Data.length; i++) 
                    {
                        var row_item = worksheet.getRow(pos + i); 
                        row_item.getCell(1).value   = dt_Data[i].SEQ;
                        row_item.getCell(2).value   = dt_Data[i].ITEM_CODE;
                        row_item.getCell(3).value   = dt_Data[i].ITEM_NAME;
                        row_item.getCell(4).value   = dt_Data[i].P_SIZE;
                        row_item.getCell(5).value   = dt_Data[i].LOT_NO;
                        row_item.getCell(6).value   = dt_Data[i].WEIGHT_UNIT;
                        row_item.getCell(7).value   = dt_Data[i].QTY;
                        row_item.getCell(8).value   = dt_Data[i].PALLET_NO;
                        row_item.getCell(9).value   = dt_Data[i].CELL_NO;
                        row_item.getCell(10).value   = dt_Data[i].RECEIVE_DATE;
                        row_item.getCell(11).value   = dt_Data[i].DESCRIPTION;
                        
                    }
                    pos = pos + dt_Data.length;
                    var row = worksheet.getRow(pos); 
                    row.getCell(7).value   = dt_Data[0].TOTAL_QTY; 
                    worksheet.mergeCells(pos,1,pos,6);
                    pos = pos + 2; 
                    worksheet.mergeCells(pos,2, pos, 3);
                    worksheet.mergeCells(pos,4, pos, 6);
                    worksheet.mergeCells(pos,8, pos, 9);
                    worksheet.mergeCells(pos,10, pos, 11); 
                /********* Print file excel ********/
                const reportFile    = Helpers.tmpPath(file_new);
                await workbook.xlsx.writeFile(reportFile)
                return response.attachment( reportFile, file_new);
            }  
        } 
       catch (e) 
       {
           Utils.Logger({ LVL: "error", MODULE: "Report", FUNC: "Picking_list", CONTENT: e.message }) 
          return response.send(null);
       }
    }
}

module.exports = rptCS40040;