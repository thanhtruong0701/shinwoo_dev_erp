"use strict";

const { DATE } = require("oracledb");

const Helpers       = use('Helpers')
const Antl          = use("Antl");
const Utils         = use("Utils");
const DBService = use("DBService")
var Excel           = use('exceljs');
var workbook        = new Excel.Workbook();
class rpt6075020 {

    /*########################################################## Report  General ledger detail books ENG 2 ###########################################################################*/ 
    async rpt_6075020_PAYROLL_MAKE_SLIP({ request, response, auth }) {
        try 
        { 
           /* P_RPT_ID: report_info.VAL1, P_RPT_URL: report_info.VAL2, P_RPT_FILE: report_info.VAL3,
                P_COMP_ID: company_info.PARTNER_ID, P_COMP_NM: company_info.TEXT, P_COMP_TAX: company_info.TAX_CODE, P_COMP_ADD: company_info.ADDR1,
                P_COMPANY : this.selectedCompany, P_MONTH: this.month, P_COST_CENTER: this.selectedCostCenter, P_COST_CROUP: this.selectedCostGroup,
                P_COST_TYPE: this.selectedCostType, P_DEPT: this.selectedOrg,  P_AP_TYPE: this.selectedApType, P_SAL_CODE : this.selectedSalCode
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
            var _store          = "AC_RPT_6075020_SLIP_LIST";
            var _param          = [item.P_COMPANY, item.P_TCO_BUSPLACE_PK, item.P_MONTH, item.P_COST_CENTER, item.P_COST_CROUP , item.P_COST_TYPE ,item.P_DEPT, item.P_AP_TYPE, item.P_SAL_CODE];
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
                   // return response.send(Utils.response(false, "no_data_found", null))
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
                //thÃ´ng tÆ°
                var month = item.P_MONTH;
                var strMonth = month.substr(4,2) + "/"+ month.substr(0,4);
                worksheet.getCell("A5").value = "Month : " + strMonth;
                //-------Fill Data----------------
                var pos = 9; 
                var total_trans_amt= 0;
                var total_book_amt = 0;
                if(dt_Data.length>1)
                {
                        worksheet.duplicateRow(pos,dt_Data.length-1,true);
                }  
                for (var i = 0; i < dt_Data.length; i++) 
                {
                    var row_item = worksheet.getRow(pos);
                    row_item.getCell(1).value   = i+1;
                    row_item.getCell(2).value   = dt_Data[i].GRP_COST;
                    row_item.getCell(3).value   = dt_Data[i].TYPE_COST;     
                    row_item.getCell(4).value   = dt_Data[i].ITEM;
                    row_item.getCell(5).value   = dt_Data[i].CCY; 
                    row_item.getCell(6).value   = dt_Data[i].BK_RATE; 
                    row_item.getCell(7).value   = dt_Data[i].COUNT_EMP; 
                    row_item.getCell(8).value   = dt_Data[i].PL_NM; 
                    row_item.getCell(9).value   = Number(dt_Data[i].TR_AMT); 
                    row_item.getCell(10).value   = Number(dt_Data[i].BK_AMT);
                    row_item.getCell(11).value   = dt_Data[i].DEBIT_CD; 
                    row_item.getCell(12).value  = dt_Data[i].CREDIT_CD;  
                    total_trans_amt             += Number(dt_Data[i].TR_AMT);
                    total_book_amt              += Number(dt_Data[i].BK_AMT);
                    pos = pos + 1; 
                    //row_item.commit();
                }  
                worksheet.mergeCells(pos,1,pos,8);
                worksheet.getCell(pos, 9).value = total_trans_amt;
                worksheet.getCell(pos, 10).value = total_book_amt;

                
                /********* Print file excel ********/
                const reportFile    = Helpers.tmpPath(file_new);
                await workbook.xlsx.writeFile(reportFile)
                return response.attachment( reportFile, file_new);
            }
        } 
        catch (e) 
        {
            Utils.Logger({ LVL: "error", MODULE: "Report", FUNC: "rpt_6075020_PAYROLL_MAKE_SLIP", CONTENT: e.message })
           // return response.send(Utils.response(false, e.message, null))
           return response.send(null);
        }
    }  
}

module.exports = rpt6075020;