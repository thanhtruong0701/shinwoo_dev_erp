/*====================================================== vng-154 dvg =======================================================================================*/
"use strict";
const Helpers       = use('Helpers')
const Antl          = use("Antl");
const Utils         = use("Utils");
const DBService = use("DBService")
var Excel           = use('exceljs');
var workbook        = new Excel.Workbook();
class rpt6055010 {
/*============================================= Report PAY List form 6055010 Payable List   =====================================================================*/
async rpt_6055010_PAY({ request, response, auth }) {
        try 
        { 
          /*    P_RPT_ID: report_info.VAL1, P_RPT_URL: report_info.VAL2, P_RPT_FILE: report_info.VAL3,
                P_COMP_ID: company_info.PARTNER_ID, P_COMP_NM: company_info.TEXT, P_COMP_TAX: company_info.TAX_CODE, 
                P_COMP_ADD: company_info.ADDR2, P_COMPANY: this.mstData.TCO_COMPANY_PK, P_BIZ_PK: this.sel_BizPlace,
                P_BIZ_ID: BizPlace_info.NAME, P_BIZ_NM: BizPlace_info.LOC_NM, P_BIZ_TAX: BizPlace_info.TAX_CD, P_BIZ_ADD: BizPlace_info.ADDR_NM1,

                P_APPROVE_YN: this.sel_Status == "2" ? 'Y' : 'N',
                P_SEL_TYPE: this.sel_Type, P_DT_PAYDATE: this.dt_Paydate, P_SEL_STATUS: this.sel_Status, P_SEL_BALANCE: this.sel_Balance,
                P_TXT_SEQ: this.txt_Seq, P_TXT_VOUCHER: this.txt_Voucher, P_DT_PAYDUEFR: this.dt_PayDueFr, P_DT_PAYDUETO: this.dt_PayDueTo,
                P_DT_PAYFR: this.dt_PayFr, P_DT_PAYTO: this.dt_PayTo, P_CHK_PAYMENT: this.chk_Payment, P_TXT_CUSPK: this.txt_CusPk,
                P_TXT_CUSCD: this.txt_CusCd, P_TXT_CUSNM: this.txt_CusNm, P_TXT_PLPK: this.txt_PLPk, P_TXT_PLCD: this.txt_PLCd,
                P_TXT_PLNM: this.txt_PLNm, P_TXT_ACCPK: this.txt_AccPk, P_TXT_ACCCD: this.txt_AccCd, P_TXT_ACCNM: this.txt_AccNm,
                P_TABS: this.tabs*/
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
            var _COMP_ID        = item.P_COMP_ID, _COMP_NM = item.P_COMP_NM, _COMP_TAX = item.P_COMP_TAX, _COMP_ADD = item.P_COMP_ADD;
            var _BIZ_ID         = item.P_BIZ_ID, _BIZ_NM = item.P_BIZ_NM, _BIZ_TAX = item.P_BIZ_TAX, _BIZ_ADD = item.P_BIZ_ADD;

            var _store          = "AC_RPT_6055010_PAY_LIST";
            var _param          = [ item.P_COMPANY, item.P_TXT_SEQ, item.P_DT_PAYDUEFR, item.P_DT_PAYDUETO, 
                                    item.P_DT_PAYFR, item.P_DT_PAYTO, item.P_TXT_CUSPK, item.P_TXT_VOUCHER,
                                    item.P_TXT_PLPK, item.P_SEL_TYPE, item.P_TABS, item.P_DT_PAYDATE , 
                                    item.P_APPROVE_YN, item.P_SEL_BALANCE, item.P_BIZ_PK];
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
                dt_Data = (dt_Data.length > 0)? dt_Data : [];
                /********* Read file excel ********/ 
                const templateFile  = Helpers.resourcesPath(_resourcesPath); 
                await workbook.xlsx.readFile(templateFile);
                var worksheet       = workbook.getWorksheet(1);
                /********* Write file excel ********/
                /*======= Set Header ==============*/   
                worksheet.getRow(1).getCell(1).value = _BIZ_NM;   
                worksheet.getRow(2).getCell(1).value = _BIZ_ADD;   
                worksheet.getRow(3).getCell(1).value = _BIZ_TAX;   

                var pos = 9;
                var r_item = worksheet.getRow(1);
                /*======= Set DETAIL ==============*/  
                // insert row
                Utils.excelInsertRows(worksheet, pos, dt_Data.length-1);

                //TITLE, SEQ, VOUCHERNO, PRPS_DATE, APPR_DATE, APPR_NO, CUSTOMER, TR_CCY, TR_FAMT, TR_AMT, SERIAL_NO, 
                //INVOICE_NO, INVOICE_DATE, DUE_DATE, TR_REMARK, TR_REMARK2, REJECT_REMARK
                // insert data
                for (var i = 0; i < dt_Data.length; i++) 
                { 
                    var item = dt_Data[i]; 
                    r_item = worksheet.getRow(pos + i);    

                    r_item.getCell(1).value = item.SEQ;  
                    
                    r_item.getCell(2).value = item.VOUCHERNO;  
                    r_item.getCell(3).value = item.PRPS_DATE;  
                    r_item.getCell(4).value = item.TAKEIN_DATE;  
                    r_item.getCell(5).value = item.APPR_DATE;  
                    r_item.getCell(6).value = item.APPR_NO;  
                    r_item.getCell(9).value = item.CUSTOMER;  
                    r_item.getCell(10).value = item.TR_CCY;  
                    r_item.getCell(11).value = item.TR_FAMT;  
                    r_item.getCell(12).value = item.TR_AMT;   
                    r_item.getCell(13).value = item.SERIAL_NO;  
                    r_item.getCell(14).value = item.INVOICE_NO;  
                    r_item.getCell(15).value = item.INVOICE_DATE;  
                    r_item.getCell(16).value = item.DUE_DATE;  
                    r_item.getCell(17).value = item.TR_REMARK;  
                    r_item.getCell(18).value = item.TR_REMARK2;  
                    r_item.getCell(19).value = item.REJECT_REMARK;  
                    if(item.SEQ == '' || item.SEQ == 'null' || item.SEQ == null || item.SEQ == undefined)
                    {
                        r_item.getCell(1).value  = item.TITLE; 
                        r_item.getCell(11).font  = {  bold: true };
                        r_item.getCell(12).font  = {  bold: true };
                        r_item.getCell(9).value  = ''; 
                        r_item.getCell(10).value = ''; 

                        worksheet.mergeCells(pos + i, 1 , pos + i, 10 );
                        r_item.getCell(1).font = {  italic: true, bold: true }; 
                    } 
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
module.exports = rpt6055010;
/*-- === vng-154 dvg ===--*/