/*====================================================== vng-154 dvg =======================================================================================*/
"use strict";
const Helpers       = use('Helpers')
const Antl          = use("Antl");
const Utils         = use("Utils");
const DBService = use("DBService")
var Excel           = use('exceljs');
var workbook        = new Excel.Workbook();
class rpt6055030 { 
    /*======================= Report AP Approve List form 6055030 Approve list newr    =====================================================================*/
    async rpt_6055030_PAYMENT_APPROVE({ request, response, auth }) {
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

            var _store          = "AC_RPT_6055030_PAYMENT_APP";
            var _param          = [ item.P_COMPANY, item.P_SEL_STATUS, item.P_TXT_SEQ, item.P_DT_PAYDUEFR, 
                                    item.P_DT_PAYDUETO, item.P_DT_PAYFR, item.P_DT_PAYTO, item.P_TXT_CUSPK,
                                    item.P_TXT_VOUCHER, item.P_TXT_PLPK, item.P_SEL_TYPE, item.P_PAY_METHOD, item.P_BIZ_PK];
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
                worksheet.getRow(5).getCell(1).value = 'At date ' + Utils._formatDate(item.P_DT_PAYFR,'DD/MM/YYYY') + ' ~ ' + Utils._formatDate(item.P_DT_PAYTO,'DD/MM/YYYY');

                var pos = 8;
                var r_item = worksheet.getRow(1);
                /*======= Set DETAIL ==============*/  
                // insert row
                Utils.excelInsertRows(worksheet, pos, dt_Data.length-1);
                // insert data
                for (var i = 0; i < dt_Data.length; i++) 
                { 
                    var item = dt_Data[i]; 
                    r_item = worksheet.getRow(pos + i);    

                    r_item.getCell(1).value  = item.TR_DATE;  
                    r_item.getCell(2).value  = item.TR_MONTH;  
                    r_item.getCell(3).value  = item.INVOICE_NO; 
                    r_item.getCell(4).value  = item.INVOICE_DATE 
                    r_item.getCell(5).value  = item.PARTNER_ID; ;  
                    r_item.getCell(6).value  = item.PARTNER_NAME 
                    r_item.getCell(7).value  = item.TR_REMARK;  ;  
                    r_item.getCell(8).value  = item.TR_FAMT;   
                    r_item.getCell(9).value  = item.TR_RATE;  
                    r_item.getCell(10).value = item.TR_AMT;  
                    r_item.getCell(11).value = item.DUE_DATE;  
                    r_item.getCell(12).value = item.MONTH_PAY;  
                    r_item.getCell(13).value = item.PAY_RATE;  
                    r_item.getCell(14).value = item.AMT_PAYMENT;
                    r_item.getCell(15).value = item.LOSS_GAIN;   
                    if(item.SEQ == '' || item.SEQ == 'null' || item.SEQ == null || item.SEQ == undefined)
                    {
                        for(let y = 1; y<=15; y++)
                        {
                            r_item.getCell(y).font  = { italic: false, bold: true, size:10, color: {argb:'000000'}, name: 'Times New Roman' };
                        }
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
 /*======================= Report AP Approve List form 6055030 Approve MEthod    =====================================================================*/
    async rpt_6055030_AP_APP({ request, response, auth }) {
        try 
        { 
          /*    P_RPT_ID: report_info.VAL1, P_RPT_URL: report_info.VAL2, P_RPT_FILE: report_info.VAL3,
                P_COMP_ID: company_info.PARTNER_ID, P_COMP_NM: company_info.TEXT, P_COMP_TAX: company_info.TAX_CODE, P_COMP_ADD: company_info.ADDR2, 
                P_COMPANY: this.mstData.TCO_COMPANY_PK,P_BIZ_PK: this.sel_BizPlace,
                P_BIZ_ID: BizPlace_info.NAME, P_BIZ_NM: BizPlace_info.LOC_NM, P_BIZ_TAX: BizPlace_info.TAX_CD, P_BIZ_ADD: BizPlace_info.ADDR_NM1,

                P_APPROVE_YN: this.sel_Status == "2" ? 'Y' : 'N',
                P_SEL_TYPE: this.sel_Type, P_DT_PAYDATE: this.dt_Paydate, P_SEL_STATUS: this.sel_Status, P_SEL_BALANCE: this.sel_Balance,
                P_TXT_SEQ: this.txt_Seq, P_TXT_VOUCHER: this.txt_Voucher, P_DT_PAYDUEFR: this.dt_PayDueFr, P_DT_PAYDUETO: this.dt_PayDueTo,
                P_DT_PAYFR: this.dt_PayFr, P_DT_PAYTO: this.dt_PayTo, P_CHK_PAYMENT: this.chk_Payment, P_TXT_CUSPK: this.txt_CusPk,
                P_TXT_CUSCD: this.txt_CusCd, P_TXT_CUSNM: this.txt_CusNm, P_TXT_PLPK: this.txt_PLPk, P_TXT_PLCD: this.txt_PLCd,
                P_TXT_PLNM: this.txt_PLNm  P_TABS: this.tabs */
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

            var _store          = "AC_RPT_6055030_AP_APP"; 
            var _param          = [ item.P_COMPANY, item.P_TXT_SEQ,  item.P_DT_PAYFR, item.P_DT_PAYTO, item.P_TXT_CUSPK, item.P_TXT_VOUCHER, item.P_TXT_PLPK, item.P_SEL_TYPE, item.P_BIZ_PK];
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
                // else 
                // { 
                //     return response.send(Utils.response(false, "no_data_found", null))
                // } 
                /********* Read file excel ********/ 
                const templateFile  = Helpers.resourcesPath(_resourcesPath); 
                await workbook.xlsx.readFile(templateFile);
                var worksheet       = workbook.getWorksheet(1); 
                /********* Write file excel ********/
                /*======= Set Header ==============*/   
                worksheet.getRow(1).getCell(1).value = _BIZ_NM;   
                // worksheet.getRow(2).getCell(1).value = _BIZ_ADD;   
                // worksheet.getRow(3).getCell(1).value = _BIZ_TAX;  
                worksheet.getRow(4).getCell(2).value = Utils._formatDate(Utils.CurrentDate(),'DD/MM/YYYY');    

                var pos = 9, item = null, r_item = null; 
                /*======= Set DETAIL ==============*/  
                // insert row 
                Utils.excelInsertRows(worksheet, pos, dt_Data.length-1); 
              
                for (var i = 0; i < dt_Data.length; i++) 
                { 
                    item   = dt_Data[i]; 
                    r_item = worksheet.getRow(pos + i);     
                    r_item.getCell(1).value = item.NUM;      //No
                    r_item.getCell(2).value = item.DESCRIPTION;    //Description 
                    r_item.getCell(3).value = item.SUPPLIER;   //Supplier 
                    r_item.getCell(4).value = item.BANK_USD;   // trans usd
                    r_item.getCell(5).value = item.BANK_VND;     // trans vnd
                    r_item.getCell(6).value = item.CASH_USD;      // cash usd
                    r_item.getCell(7).value = item.CASH_VND;    // cash vnd
                    r_item.getCell(8).value = item.BOOKS_AMT;   // book    
                    if(item.NUM == '' || item.NUM == 'null' || item.NUM == null || item.NUM == undefined)
                    {
                        worksheet.mergeCells(pos + i, 1 , pos + i, 3 ); 
                        r_item.getCell(1).font = {  italic: true, bold: true }; 
                        r_item.getCell(4).font = {  italic: true, bold: true }; 
                        r_item.getCell(5).font = {  italic: true, bold: true }; 
                        r_item.getCell(6).font = {  italic: true, bold: true }; 
                        r_item.getCell(7).font = {  italic: true, bold: true }; 
                        r_item.getCell(8).font = {  italic: true, bold: true }; 
                        r_item.getCell(1).value = item.DESCRIPTION; 
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
/*======================= Report AP Approve List form 6055030 Approve MEthod    =====================================================================*/
    async rpt_6055030_AP_APP_ST({ request, response, auth }) {
        try 
        { 
        /*    P_RPT_ID: report_info.VAL1, P_RPT_URL: report_info.VAL2, P_RPT_FILE: report_info.VAL3,
                P_COMP_ID: company_info.PARTNER_ID, P_COMP_NM: company_info.TEXT, P_COMP_TAX: company_info.TAX_CODE, P_COMP_ADD: company_info.ADDR2, 
                P_COMPANY: this.mstData.TCO_COMPANY_PK,P_BIZ_PK: this.sel_BizPlace,
                P_BIZ_ID: BizPlace_info.NAME, P_BIZ_NM: BizPlace_info.LOC_NM, P_BIZ_TAX: BizPlace_info.TAX_CD, P_BIZ_ADD: BizPlace_info.ADDR_NM1,

                P_APPROVE_YN: this.sel_Status == "2" ? 'Y' : 'N',
                P_SEL_TYPE: this.sel_Type, P_DT_PAYDATE: this.dt_Paydate, P_SEL_STATUS: this.sel_Status, P_SEL_BALANCE: this.sel_Balance,
                P_TXT_SEQ: this.txt_Seq, P_TXT_VOUCHER: this.txt_Voucher, P_DT_PAYDUEFR: this.dt_PayDueFr, P_DT_PAYDUETO: this.dt_PayDueTo,
                P_DT_PAYFR: this.dt_PayFr, P_DT_PAYTO: this.dt_PayTo, P_CHK_PAYMENT: this.chk_Payment, P_TXT_CUSPK: this.txt_CusPk,
                P_TXT_CUSCD: this.txt_CusCd, P_TXT_CUSNM: this.txt_CusNm, P_TXT_PLPK: this.txt_PLPk, P_TXT_PLCD: this.txt_PLCd,
                P_TXT_PLNM: this.txt_PLNm  P_TABS: this.tabs , P_PAY_METHOD: this.sel_PayMethod*/
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

            var _store          = "AC_RPT_6055030_AP_APP_ST"; 
            var _param          = [ item.P_COMPANY, item.P_TXT_SEQ,  item.P_DT_PAYFR, item.P_DT_PAYTO, item.P_TXT_CUSPK, item.P_TXT_VOUCHER, item.P_TXT_PLPK, item.P_SEL_TYPE, item.P_PAY_METHOD, item.P_BIZ_PK];
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
                // else 
                // { 
                //     return response.send(Utils.response(false, "no_data_found", null))
                // } 
                /********* Read file excel ********/ 
                const templateFile  = Helpers.resourcesPath(_resourcesPath); 
                await workbook.xlsx.readFile(templateFile);
                var L_SHEET = (item.P_SHEET=='BANK')?1:2;
                var D_SHEET = (item.P_SHEET=='BANK')?2:1;
                var worksheet       =  workbook.getWorksheet(L_SHEET);  
                /********* Write file excel ********/
                /*======= Set Header ==============*/   
                // worksheet.getRow(1).getCell(1).value = _BIZ_NM;   
                // worksheet.getRow(2).getCell(1).value = _BIZ_ADD;   
                // worksheet.getRow(3).getCell(1).value = _BIZ_TAX;  
                worksheet.getRow(5).getCell(4).value = Utils._formatDate(Utils.CurrentDate(),'DD/MM/YYYY');  
                

                var pos = 9, item_data = null, r_item = null; 
                /*======= Set DETAIL ==============*/  
                // insert row 
                Utils.excelInsertRows(worksheet, pos, dt_Data.length-1);   
            
                for (var i = 0; i < dt_Data.length; i++) 
                { 
                    item_data   = dt_Data[i]; 
                    if(item.P_SHEET == 'BANK')
                    { 
                        r_item = worksheet.getRow(pos + i);     
                        r_item.getCell(2).value = item_data.NUM;      //No
                        r_item.getCell(3).value = item_data.PARTNER_NAME;// VENDER
                        r_item.getCell(4).value = item_data.BANK_ACCOUNT;    //BANK NM 
                        r_item.getCell(5).value = item_data.DESCRIPTION;    //Description  
                        r_item.getCell(6).value = item_data.TR_CCY;     // TR_CCY
                        r_item.getCell(7).value = item_data.TR_FAMT;   // INVOICE AMT
                        r_item.getCell(8).value = item_data.CHECKED1;     // CHECK 1
                        r_item.getCell(9).value = item_data.CHECKED2;      // CHEKC 2
                        r_item.getCell(10).value = item_data.TOTAL_AMT_VENDOR;    // TOTAL
                        r_item.getCell(11).value = item_data.TOTAL_AMT_KRW;    // TOTAL
                        r_item.getCell(12).value = item_data.PAY_DATE;   // PAY DATE
                        r_item.getCell(13).value = item_data.PAYMENT_TIME;   // PAY DATE BANK
                        r_item.getCell(14).value = item_data.PAYMENT_PERSION;   // PAY PERSON
                        r_item.getCell(15).value = item_data.O_APPOVE_NO;   // APPROVE
                    }else
                    {
                        r_item = worksheet.getRow(pos + i);     
                        r_item.getCell(2).value = item_data.NUM;      //No
                        r_item.getCell(3).value = item_data.PARTNER_NAME;// VENDER 
                        r_item.getCell(4).value = item_data.DESCRIPTION;    //Description  
                        r_item.getCell(5).value = item_data.TR_CCY;     // TR_CCY
                        r_item.getCell(6).value = item_data.TR_FAMT;   // INVOICE AMT
                        r_item.getCell(7).value = item_data.CHECKED1;     // CHECK 1
                        r_item.getCell(8).value = item_data.CHECKED2;      // CHEKC 2
                        r_item.getCell(9).value = item_data.TOTAL_AMT_VENDOR;    // TOTAL
                        r_item.getCell(10).value = item_data.TOTAL_AMT_KRW;    // TOTAL
                        r_item.getCell(11).value = item_data.PAY_DATE;   // PAY DATE
                        r_item.getCell(12).value = item_data.PAYMENT_TIME;   // PAY DATE BANK
                        r_item.getCell(13).value = item_data.PAYMENT_PERSION;   // PAY PERSON
                        r_item.getCell(14).value = item_data.O_APPOVE_NO;   // APPROVE
                    }
                } 
                var row_tt = dt_Data.length + pos;
                if(dt_Data.length-1 >0)
                {
                    worksheet.mergeCells(dt_Data.length + pos, 2 , dt_Data.length + pos, 6 ); 
                    r_item.getCell(2).font = {  italic: true, bold: true }; 
                    worksheet.getCell("G"+row_tt).value   = { formula :"SUM(G9:G"+(row_tt-1)+")"};  
                    worksheet.getCell("J"+row_tt).value   = { formula :"SUM(J9:J"+(row_tt-1)+")"}; 
                    worksheet.getCell("K"+row_tt).value   = { formula :"SUM(K9:K"+(row_tt-1)+")"}; 
                }
               
               // workbook.removeWorksheet(D_SHEET)
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
module.exports = rpt6055030;

/*-- === vng-154 dvg ===--*/