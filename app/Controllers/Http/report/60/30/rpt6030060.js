"use strict";

const { DATE } = require("oracledb");

const Helpers       = use('Helpers')
const Antl          = use("Antl");
const Utils         = use("Utils");
const DBService = use("DBService")
var Excel           = use('exceljs');
var workbook        = new Excel.Workbook();
class rpt6030060 {
/*########################################################## Report JH ##################################################################################*/ 

    async rpt_6030060_Daily_Aggregate({ request, response, auth }) {
        try 
        { 
          /* P_RPT_ID: report_info.VAL1, P_RPT_URL: report_info.VAL2, P_RPT_FILE: report_info.VAL4,
            P_COMP_ID: company_info.PARTNER_ID, P_COMP_NM: company_info.TEXT, P_COMP_TAX: company_info.TAX_CODE, P_COMP_ADD: company_info.ADDR1,
            P_COMPANY: this.selectedCompany, P_FR_DATE: this.proposeFrom, P_FR_TO: this.proposeTo, P_STATUS : this.slipStatus, P_LANG : this.selectedLang
            */
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
            var _store          = "AC_SEL_6030060";
            var _param          = [item.P_COMPANY, item.P_FR_DATE, item.P_FR_TO, item.P_STATUS, item.P_TCO_BUSPLACE_PK];
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
                r_item.getCell(1).value = Utils.translate("COMPANY",_dictionary , p_language) + ": " + COMP_ID +" - "+COMP_NM;    
                r_item = worksheet.getRow(2);
                r_item.getCell(1).value = Utils.translate("TAX_CODE",_dictionary, p_language) + ": "+ COMP_TAX;   
                r_item = worksheet.getRow(3);
                r_item.getCell(1).value = Utils.translate("ADDRESS",_dictionary , p_language) + ": "+ COMP_ADD; 

                r_item = worksheet.getRow(4);
                r_item.getCell(1).value  = Utils.translate("DAILY_AGGREGATE_REPORT",_dictionary , p_language);
                r_item = worksheet.getRow(7);
                r_item.getCell(1).value  = Utils.translate("ACCOUNT",_dictionary , p_language);
                r_item.getCell(5).value  = Utils.translate("AMOUNT",_dictionary , p_language);
                r_item = worksheet.getRow(8);
                r_item.getCell(1).value  =  Utils.translate("CODE",_dictionary , p_language);
                r_item.getCell(4).value  =  Utils.translate("KOREA",_dictionary , p_language);
                r_item.getCell(5).value  =  Utils.translate("DEBIT",_dictionary , p_language);
                r_item.getCell(6).value  =  Utils.translate("CREDIT",_dictionary , p_language);



                var FromDate = item.P_FR_DATE;
                var ToDate = item.P_FR_TO;
                var strFrDate = FromDate.substr(6,2) + "/"+ FromDate.substr(4,2)+ "/"+ FromDate.substr(0,4);
                var strToDate = ToDate.substr(6,2) + "/"+ ToDate.substr(4,2)+ "/"+ ToDate.substr(0,4);
                 // thông tư
                var _lang = item.P_LANG;
                switch(_lang){
                    case "VIE":
                        worksheet.getCell("A5").value = "Từ ngày " + strFrDate + " đến ngày " + strToDate;
                        worksheet.getColumn(3).hidden = true;
                        worksheet.getColumn(4).hidden = true;
                    break;
                    case "KOR":
                        worksheet.getCell("A5").value = strFrDate + " ~ " + strToDate;
                        worksheet.getColumn(2).hidden = true;
                        worksheet.getColumn(3).hidden = true;
                    break;
                    case "ENG":
                        worksheet.getCell("A5").value = "Form date " + strFrDate + " to date " + strToDate;
                        worksheet.getColumn(2).hidden = true;
                        worksheet.getColumn(4).hidden = true;
                    break;
                    case "KOR-VIE":
                        worksheet.getCell("A5").value = "Form date " + strFrDate + " to date " + strToDate;
                        worksheet.getColumn(3).hidden = true;
                    break;
                    case "ENG-VIE":
                        worksheet.getCell("A5").value = "Form date " + strFrDate + " to date " + strToDate;
                        worksheet.getColumn(4).hidden = true;
                    break;
                    case "ENG-KOR":
                        worksheet.getCell("A5").value = "Form date " + strFrDate + " to date " + strToDate;
                        worksheet.getColumn(2).hidden = true;
                    break;
                }
                var pos = 9; 
                var total_dr_amount = 0;
                var total_cr_amount = 0;

                if(dt_Data.length>1)
                {
                     worksheet.duplicateRow(pos,dt_Data.length-1,true);
                }  
               for (var i = 0; i < dt_Data.length; i++) 
                {
                    var row_item = worksheet.getRow(pos);
                    row_item.getCell(1).value   = dt_Data[i].AC_CD;
                    row_item.getCell(2).value   = dt_Data[i].AC_LNM;    
                    row_item.getCell(3).value   = dt_Data[i].AC_NM;  
                    row_item.getCell(4).value   = dt_Data[i].AC_KNM; 
                    row_item.getCell(5).value   = Number(dt_Data[i].DR_AMOUNT); 
                    row_item.getCell(6).value   = Number(dt_Data[i].CR_AMOUNT);  
                    total_dr_amount  += Number(dt_Data[i].DR_AMOUNT);
                    total_cr_amount  += Number(dt_Data[i].CR_AMOUNT);
                    pos = pos + 1; 
                    //row_item.commit();

                }  
                var row = worksheet.getRow(pos);
                worksheet.mergeCells(pos,1,pos,4); 
                row.getCell(5).value  = total_dr_amount;
                row.getCell(6).value  = total_cr_amount;
               
                /********* Print file excel ********/
                const reportFile    = Helpers.tmpPath(file_new);
                await workbook.xlsx.writeFile(reportFile)
                return response.attachment( reportFile, file_new);
            }
        } 
        catch (e) 
        {
            Utils.Logger({ LVL: "error", MODULE: "Report", FUNC: "rpt_6030060_Daily_Aggregate", CONTENT: e.message })
           // return response.send(Utils.response(false, e.message, null))
           return response.send(null);
        }
    }  
}

module.exports = rpt6030060;