"use strict";

const { DATE } = require("oracledb");

const Helpers       = use('Helpers')
const Antl          = use("Antl");
const Utils         = use("Utils");
const DBService = use("DBService")
var Excel           = use('exceljs');
var workbook        = new Excel.Workbook();
class rpt6050115 {
/*########################################################## Report JH ##################################################################################*/ 
    async rpt_6050115_ACCRUED_EXPENSE_INQ({ request, response, auth }) {
        try 
        { 
            /*  P_RPT_ID: report_info.VAL1,  P_RPT_URL: report_info.VAL2, P_RPT_FILE: report_info.VAL3, P_COMP_ID: company_info.PARTNER_ID,
                P_COMP_NM: company_info.TEXT,  P_COMP_TAX: company_info.TAX_CODE, P_COMP_ADD: company_info.ADDR1, 
                P_COMPANY: this.selectedCompany, P_TCO_BUSPLACE_PK: this.lstBizPlace, P_FR_DATE: this.from_date,  P_FR_TO: this.to_date, P_ITEM_CODE : this.this.txtItemCode,
                P_ACC_PK: this.TAC_ABACCTCODE_PK, P_STATUS : this.selectedStatus,   P_INVOICE_NO: this.txtInvoiceNo,  P_VOUCHER_NO: this.txtVoucherNo,
                P_BIZ_ID: BizPlace_info.NAME, P_BIZ_NM: BizPlace_info.LOC_NM, P_BIZ_TAX: BizPlace_info.TAX_CD, P_BIZ_ADD: BizPlace_info.ADDR_NM1
            */
            /****************************** Get Param *********************************/
            let { para }        = request.get(['para']);
            /********* Parse pram to json ********/
            var item            = JSON.parse(para); 
            const user          = await auth.getUser() ;
            var COMP_ID         = item.P_COMP_ID, COMP_NM = item.P_COMP_NM, COMP_TAX = item.P_COMP_TAX, COMP_ADD = item.P_COMP_ADD;
            var BIZ_ID          = item.P_BIZ_ID , BIZ_NM  = item.P_BIZ_NM , BIZ_TAX  = item.P_BIZ_TAX , BIZ_ADD  = item.P_BIZ_ADD;
            const p_crt_by      = user.USER_ID;
            const p_language    = request.header("accept-language", "ENG");
            var file_nm         = [item.P_RPT_FILE];
            var file_type       = ".xlsx";
            var full_nm         = file_nm + file_type;
            var file_new        = file_nm + p_crt_by + file_type;
            var _resourcesPath  = [item.P_RPT_URL]+'/'+full_nm;
            var _store          = "AC_RPT_6050115";
            //var _circular       = "AC_SEL_GET_TT_BPL";
            var _param          = [item.P_COMPANY, , item.P_TCO_BUSPLACE_PK, item.P_FR_DATE, item.P_FR_TO, item.P_ITEM_CODE, item.P_ACC_PK, item.P_STATUS, item.P_INVOICE_NO, item.P_VOUCHER_NO];
           // var _param_TT       = [item.P_CIRCULARS];
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
                r_item.getCell(1).value = Utils.translate("COMPANY",_dictionary , p_language) + ": " + BIZ_ID +" - "+ BIZ_NM;    
                r_item = worksheet.getRow(2);
                r_item.getCell(1).value = Utils.translate("TAX_CODE",_dictionary, p_language) + ": "+ BIZ_TAX;   
                r_item = worksheet.getRow(3);
                r_item.getCell(1).value = Utils.translate("ADDRESS",_dictionary , p_language) + ": "+ BIZ_ADD;
                var FromDate = item.P_FR_DATE;
                var ToDate = item.P_FR_TO;
                var strFrDate = FromDate.substr(6,2) + "/"+ FromDate.substr(4,2)+ "/"+ FromDate.substr(0,4);
                var strToDate = ToDate.substr(6,2) + "/"+ ToDate.substr(4,2)+ "/"+ ToDate.substr(0,4);
                worksheet.getCell("A6").value = "From date " + strFrDate + " ~ " + strToDate;
                
                 // thông tư
                
                 var pos = 10; 

                if(dt_Data.length>1)
                {
                     worksheet.duplicateRow(pos,dt_Data.length-1,true);
                }  
               for (var i = 0; i < dt_Data.length; i++) 
                {
                    var row_item = worksheet.getRow(pos);
                    row_item.getCell(1).value   = dt_Data[i].VOUCHERNO;
                    row_item.getCell(2).value   = dt_Data[i].PO_NO;    
                    row_item.getCell(3).value   = dt_Data[i].TR_DATE;  
                    row_item.getCell(4).value   = dt_Data[i].ITEM_CODE; 
                    row_item.getCell(5).value   = dt_Data[i].ITEM_NAME; 
                    row_item.getCell(6).value   = dt_Data[i].AP_UNIT;
                    row_item.getCell(7).value   = Number(dt_Data[i].AP_QTY); 
                    row_item.getCell(8).value   = Number(dt_Data[i].AP_UPRICE); 
                    row_item.getCell(9).value   = Number(dt_Data[i].AP_TRFAMT);  
                    row_item.getCell(10).value   = Number(dt_Data[i].AP_TRAMT);  

                    
                    row_item.getCell(11).value   = Number(dt_Data[i].IMP_AMT); 
                    row_item.getCell(12).value   = Number(dt_Data[i].ALLOCATE_AMT_BOOK); 
                    row_item.getCell(13).value   = Number(dt_Data[i].TOTAL_AMT_ALLOCATE); 
                    row_item.getCell(14).value   = Number(dt_Data[i].UNITPRICE); 

                    row_item.getCell(15).value  = Number(dt_Data[i].IMPVAT_AMT);  
                    row_item.getCell(16).value  = dt_Data[i].PL_CD;  
                    row_item.getCell(17).value  = dt_Data[i].PL_NM; 
                    row_item.getCell(18).value  = dt_Data[i].PARTNER_ID;   
                    row_item.getCell(19).value  = dt_Data[i].PARTNER_NAME;  
                    row_item.getCell(20).value  = dt_Data[i].INVOICE_NO;
                    row_item.getCell(21).value  = dt_Data[i].INVOICE_DATE; 
                    row_item.getCell(22).value  = dt_Data[i].AC_CD;  
                    row_item.getCell(23).value  = dt_Data[i].AC_NM;  

                    row_item.getCell(24).value  = dt_Data[i].REMARK2;  
                    row_item.getCell(25).value  = dt_Data[i].WH_ID;  
                    pos = pos + 1; 
                    //row_item.commit();

                }  
                
                /********* Print file excel ********/
                const reportFile    = Helpers.tmpPath(file_new);
                await workbook.xlsx.writeFile(reportFile)
                return response.attachment( reportFile, file_new);
            }
        } 
        catch (e) 
        {
            Utils.Logger({ LVL: "error", MODULE: "Report", FUNC: "rpt_6050115_ACCRUED_EXPENSE_INQ", CONTENT: e.message })
           // return response.send(Utils.response(false, e.message, null))
           return response.send(null);
        }
    }  
}

module.exports = rpt6050115;