"use strict";
const Helpers       = use('Helpers')
const Antl          = use("Antl");
const Utils         = use("Utils");
const DBService = use("DBService")
var Excel           = use('exceljs');
var workbook        = new Excel.Workbook();    
class rpt6060032 {
/*########################################################## Report JH ##################################################################################*/ 
    async rpt6060032_AGEDRECEIVABLES({ request, response, auth }) {
        try 
        { 
          /*     P_RPT_ID: report_info.VAL1,
                P_RPT_FILE: "rpt6060032_AGEDRECEIVABLES",
                P_RPT_URL: url_path,
                P_COMP_ID: company_info.PARTNER_ID,
                P_COMP_NM: company_info.TEXT,
                P_COMP_TAX: company_info.TAX_CODE,
                P_COMP_ADD: company_info.ADDR1,
                P_COMPANY: this.sel_Company,
                P_FR_DATE: this.dt_TransFr,
                P_TO_DATE: this.dt_TransTo,
                P_ACC_PK: this.txt_AccPk,
                P_PARTNER_PK: this.txt_CusPk*/
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
            var _store          = "AC_RPT_6060032_AGEDRECEIVABLES";
            var _param          = [ item.P_COMPANY    , item.P_FR_DATE, item.P_TO_DATE   , item.P_ACC_PK  ,  item.P_PARTNER_PK ];
             /***************************** Return failded ****************************/
            if (!user) 
            {
                return response.send(Utils.response(false, "Request failed!", null));
            } 
            /****************************** Begin call store and write excell *********/
            else 
            { 
                /********* Call store  ***************/ 
                var dt_Data  = await DBService.callProcCursor(_store, _param, p_language, p_crt_by); 
                if (dt_Data.length >0) 
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
                /*Set Header */ 
                //worksheet.getCell("B47").value = temp; 
                var row_item;
                var pos = 8; 

                row_item = worksheet.getRow(1); 
                row_item.getCell(1).value = item.P_COMP_NM;  
                row_item = worksheet.getRow(2); 
                row_item.getCell(1).value = "Tax: "+item.P_COMP_TAX;  
                row_item = worksheet.getRow(3); 
                row_item.getCell(1).value = "Address: "+item.P_COMP_ADD; 
                
                row_item = worksheet.getRow(3); 
                row_item.getCell(1).value = "Address: "+item.P_COMP_ADD; 


                
                row_item = worksheet.getRow(5); 
                row_item.getCell(3).value = Utils._formatDate(item.P_TO_DATE,'MMM DD, YYYY'); 
                
                
                if(dt_Data.length>1)
                {
                    worksheet.duplicateRow(pos,dt_Data.length-1,false);
                }   
                for (var i = 0; i < dt_Data.length; i++) 
                {
                    row_item = worksheet.getRow(pos + i);

                    row_item.getCell(1).value = dt_Data[i].ROWNUMBER;  
                    row_item.getCell(2).value = dt_Data[i].PARTNER_ID;  
                    row_item.getCell(3).value = dt_Data[i].PARTNER_NAME;  
                    row_item.getCell(4).value = dt_Data[i].TR_CCY;  
                    row_item.getCell(5).value = dt_Data[i].DUE_30;  
                    row_item.getCell(6).value = dt_Data[i].DUE_60;  
                    row_item.getCell(7).value = dt_Data[i].DUE_90;  
                    row_item.getCell(8).value = dt_Data[i].OVER_DUE_90;   
                    row_item.getCell(9).value = dt_Data[i].TOTAL;   
                }   
                /********* Print file excel ********/
                const reportFile    = Helpers.tmpPath(file_new);
                await workbook.xlsx.writeFile(reportFile)
                return response.attachment( reportFile, file_new);
            }
        } 
        catch (e) 
        {
            return response.send(Utils.response(false, e.message, null))
        }
    }   
}

module.exports = rpt6060032;