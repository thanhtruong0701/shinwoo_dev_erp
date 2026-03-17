"use strict";

const { DATE } = require("oracledb");

const Helpers       = use('Helpers')
const Antl          = use("Antl");
const Utils         = use("Utils");
const DBService = use("DBService")
var Excel           = use('exceljs');
var workbook        = new Excel.Workbook();
class rpt6070030 {
/*########################################################## Report JH ##################################################################################*/ 
    async rpt_6070030_FIXED_ASSET_CARD({ request, response, auth }) {
        try 
        {  
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
            var _store          = "AC_RPT_6070030_FIXED_ASSET_CARD";
            var _param          = [item.P_COMPANY, item.P_PK]
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
                    dt_Data = dt_Data;
                    //return response.send(Utils.response(false, "no_data_found", null))
                } 
                /****************Call DICTIONARY******************/
                var _dictionary     = await DBService.callProcCursor("GET_DICTIONARY_REPORT", null, p_language, p_crt_by); 
                if (_dictionary.length>0) 
                {
                    _dictionary = _dictionary;
                } 
                else 
                {    
                    _dictionary = [];
                } 
                /********* Read file excel ********/ 
                const templateFile  = Helpers.resourcesPath(_resourcesPath); 
                await workbook.xlsx.readFile(templateFile);
                var worksheet       = workbook.getWorksheet(1);
                /********* Write file excel ********/
            
                //INFOMATION COMPANY
                var r_item = worksheet.getRow(1);
                r_item.getCell(1).value = Utils.translate("Đơn vị",_dictionary , p_language) + ": "  +COMP_NM;    
                // r_item = worksheet.getRow(2);
                // r_item.getCell(1).value = Utils.translate("Mã số thuế",_dictionary, p_language) + ": "+ COMP_TAX;   
                r_item = worksheet.getRow(2);
                r_item.getCell(1).value = Utils.translate("Địa chỉ",_dictionary , p_language) + ": "+ COMP_ADD; 
                 /********* Master ********/   
                 var  r_item = worksheet.getRow(5); 
                 r_item.getCell(5).value  =  dt_Data[0].SEQ;  

                 var  r_item = worksheet.getRow(7); 
                 r_item.getCell(4).value  =  dt_Data[0].CARD_DT;  

                 var  r_item = worksheet.getRow(9); 
                //  r_item.getCell(5).value  =  dt_Data[0].DELIVERY_NO;  
                 r_item.getCell(8).value  =  dt_Data[0].DELIVERY_DT;  

                var  r_item = worksheet.getRow(11); 
                r_item.getCell(4).value  =  dt_Data[0].FA_LNM;  

                r_item = worksheet.getRow(12); 
                r_item.getCell(4).value  =  dt_Data[0].FA_CD;   

                r_item = worksheet.getRow(13); 
                r_item.getCell(4).value  =  dt_Data[0].ORIGIN;  
                r_item.getCell(9).value  =  dt_Data[0].MADE_YEAR;  

                r_item = worksheet.getRow(15); 
                r_item.getCell(4).value  =  dt_Data[0].ORG_NM; 
                r_item.getCell(9).value  =  dt_Data[0].FA_USE_DATE; 

                r_item = worksheet.getRow(17); 
                r_item.getCell(4).value  =  dt_Data[0].CAPACITY;

                r_item = worksheet.getRow(18); 
                r_item.getCell(4).value  =  dt_Data[0].CEASED_DT;
                r_item.getCell(7).value  =  dt_Data[0].REASON4NOTUSING;  
                /********* Detail file ********/   
                var pos = 25; 
                if(dt_Data.length>1)
                {
                     worksheet.duplicateRow(pos,dt_Data.length-1,true);
                }   
                for (var i = 0; i < dt_Data.length; i++) 
                {
                    r_item = worksheet.getRow(pos);    
                    r_item.getCell(1).value = dt_Data[i].INV_NO; 
                    r_item.getCell(2).value = dt_Data[i].INV_DATE;  
                    r_item.getCell(3).value = dt_Data[i].FA_LNM;  
                    r_item.getCell(6).value = dt_Data[i].FA_COST; 
                    r_item.getCell(7).value = dt_Data[i].FA_DEPR_YYYY;  
                    r_item.getCell(8).value = dt_Data[i].FD_TOT_ACCUM_AMT;  
                    r_item.getCell(9).value = dt_Data[i].FD_TOT_DAMT; 
                    pos = pos + 1; 
                   
                }        
                 /********* Print file excel ********/
                const reportFile    = Helpers.tmpPath(file_new);
                await workbook.xlsx.writeFile(reportFile)
                return response.attachment( reportFile, file_new);
            }
        } 
        catch (e) 
        {
            Utils.Logger({ LVL: "error", MODULE: "Report", FUNC: "rpt_6070070_1", CONTENT: e.message })
        // return response.send(Utils.response(false, e.message, null))
        return response.send(null);
        }
    }  
}

module.exports = rpt6070030;