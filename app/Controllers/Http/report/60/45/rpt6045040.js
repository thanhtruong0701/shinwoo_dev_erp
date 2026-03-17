"use strict";

const { DATE } = require("oracledb");

const Helpers       = use('Helpers')
const Antl          = use("Antl");
const Utils         = use("Utils");
const DBService = use("DBService")
var Excel           = use('exceljs');
var workbook        = new Excel.Workbook();
class rpt6045040 {
/*########################################################## Report ##################################################################################*/ 
    async rpt_6045040_MS ({ request, response, auth }) {
        try 
        { 
            /* P_RPT_ID: report_info.VAL1, P_RPT_URL: report_info.VAL2, P_RPT_FILE: report_info.VAL3,
                P_COMP_ID: company_info.PARTNER_ID, P_COMP_NM: company_info.TEXT, P_COMP_TAX: company_info.TAX_CODE, P_COMP_ADD: company_info.ADDR1,
                P_COMPANY: this.selectedCompany, P_FR_DATE: this.from_date, P_FR_TO: this.to_date,P_ACC_PK: this.txtAccountPK, P_ACC_CD: this.txtAccountName,P_PARTNER_PK: this.txtPartnerPK,
                P_CCY: this.selectedCurrency, P_STATUS: this.selectedStatus, P_BOOK_CCY: this.txtBookCCY, P_CIRCULARS: this.selectedCirculars 
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
            var _store          = "AC_rpt_6045040_MS";
            var _store_title    = "AC_RPT_6045040_TITLE";
            var _param          = [item.P_COMPANY, item.P_FR_DATE, item.P_FR_TO, item.P_ACC_PK, item.P_PARTNER_PK, item.P_STATUS, item.P_TCO_BUSPLACE_PK, item.P_LANG];
            
            /***************************** Return failded ****************************/
            if (!user) 
            {
                return response.send(Utils.response(false, "Request failed!", null));
            } 
            /****************************** Begin call store and write excell *********/
            else 
                /********* Call store infomation tltle ***************/ 
                var _param_title    = [item.P_COMPANY, item.P_FR_DATE, item.P_FR_TO, '' , item.P_ACC_PK, item.P_BOOK_CCY, item.P_LANG, item.P_TCO_BUSPLACE_PK];
                var dt_Title  = await DBService.callProcCursor(_store_title, _param_title , p_language , p_crt_by); 
                /********* Read file excel ********/ 
                const templateFile  = Helpers.resourcesPath(_resourcesPath); 
                await workbook.xlsx.readFile(templateFile);
                var worksheet       = workbook.getWorksheet(1);
                /********* Write file excel ********/
                    /********* Call partner store  ***************/ 
                var dt_Partner  = await DBService.callProcCursor(_store, _param , p_language , p_crt_by); 
                //INFOMATION COMPANY
                var r_item = worksheet.getRow(1);
                r_item.getCell(2).value = dt_Title[0].BIZ_NM_A1;   
                r_item = worksheet.getRow(2);
                r_item.getCell(2).value = dt_Title[0].BIZ_TAX_A2;  
                r_item = worksheet.getRow(3);
                r_item.getCell(2).value = dt_Title[0].BIZ_ADD_A3;
                worksheet.getCell("A6").value =  'Tài khoản ' + dt_Title[0].AC_CD_A6  + ';'+ 'Loại tiền: <<' +  dt_Title[0].DVT_K8+  '>>;' +  'Thời gian ' +  dt_Title[0].DATE_TOFRM_A5;
                 
                //Detail
                var pos = 9; 
                let l_DR_FAMT = 0;
                let l_DR_AMT = 0;
                let l_CR_FAMT = 0;
                let l_CR_AMT = 0;
                let l_TR_BALANCE_DR   = 0;
                let l_BK_BALANCE_DR   = 0;
                let l_TR_BALANCE_CR   = 0;
                let l_BK_BALANCE_CR   = 0;
                let l_SEQ = 0;
                var _bookccy = item.P_BOOK_CCY;
                var _formatAmt = (_bookccy=='VND'?'#,##0_);[Red](#,##0);_(* "-"_);_(@_)':'#,##0.00_);[Red](#,##0.00);_(* "-"_);_(@_)');
                var _format_2 = '#,##0.00_);[Red](#,##0.00);_(* "-"_);_(@_)';
                //Insert row
                Utils.excelInsertRows(worksheet, pos, dt_Partner.length-1);
                for (var i = 0; i < dt_Partner.length; i++) 
                {

                    var row = worksheet.getRow(pos);

                    row.getCell(1).value = '';
                    row.getCell(2).value = dt_Partner[i].PARTNER_INFO;
                    row.getCell(3).value = dt_Partner[i].TR_DATE;
                    row.getCell(4).value = dt_Partner[i].TR_DATE_VC;
                    row.getCell(5).value = dt_Partner[i].VOUCHERNO;
                    row.getCell(6).value = dt_Partner[i].REMARK;
                    row.getCell(7).value = dt_Partner[i].ACCT_CODE;
                    row.getCell(8).value = dt_Partner[i].CORR_AC;
                    row.getCell(9).value = dt_Partner[i].TR_RATE;

                    row.getCell(10).value       = Number(dt_Partner[i].DR_FAMT);
                    row.getCell(10).numFmt      = _format_2;
                    row.getCell(10).alignment   = {shrinkToFit: true};
                    row.getCell(11).value       = Number(dt_Partner[i].DR_AMT);
                    row.getCell(11).numFmt      = _formatAmt;
                    row.getCell(11).alignment   = {shrinkToFit: true};
                    row.getCell(12).value       = Number(dt_Partner[i].CR_FAMT);
                    row.getCell(12).numFmt      = _format_2;
                    row.getCell(12).alignment   = {shrinkToFit: true};
                    row.getCell(13).value       = Number(dt_Partner[i].CR_AMT);
                    row.getCell(13).numFmt      = _formatAmt;
                    row.getCell(13).alignment   = {shrinkToFit: true};
                    row.getCell(14).value       = Number(dt_Partner[i].TR_BALANCE_DR);
                    row.getCell(14).numFmt      = _format_2;
                    row.getCell(14).alignment   = {shrinkToFit: true};
                    row.getCell(15).value       = Number(dt_Partner[i].BK_BALANCE_DR);
                    row.getCell(15).numFmt      = _formatAmt;
                    row.getCell(15).alignment   = {shrinkToFit: true};
                    row.getCell(16).value       = Number(dt_Partner[i].TR_BALANCE_CR);
                    row.getCell(16).numFmt      = _format_2;
                    row.getCell(16).alignment   = {shrinkToFit: true};
                    row.getCell(17).value       = Number(dt_Partner[i].BK_BALANCE_CR);
                    row.getCell(17).numFmt      = _formatAmt;
                    row.getCell(17).alignment   = {shrinkToFit: true};

                    
                    row.getCell(18).value = dt_Partner[i].PK;
                    row.getCell(19).value = dt_Partner[i].SERIAL_NO;
                    row.getCell(20).value = dt_Partner[i].INVOICE_NO;
                    row.getCell(21).value = dt_Partner[i].INVOICE_DATE;
                    row.getCell(22).value = dt_Partner[i].DUE_DATE;
                    row.getCell(23).value = dt_Partner[i].C_INVOICE_NO;
                    row.getCell(24).value = dt_Partner[i].C_INVOICE_DATE;
                    
                    if(dt_Partner[i].ORD == 'T')
                    {
                        row.getCell(2).font     = { italic: true, bold: true, size:11, color: {argb:'000000'} };
                        row.getCell(10).font    = { italic: false, bold: true, size:11, color: {argb:'000000'} };
                        row.getCell(10).numFmt  = _format_2;
                        row.getCell(11).font    = { italic: false, bold: true, size:11,color: {argb:'000000'} };
                        row.getCell(11).numFmt  = _formatAmt;
                        row.getCell(12).font    = { italic: false, bold: true, size:11,color: {argb:'000000'} };
                        row.getCell(12).numFmt  = _format_2;
                        row.getCell(13).font    = { italic: false, bold: true, size:11, color: {argb:'000000'} };
                        row.getCell(13).numFmt  = _formatAmt;

                        
                        row.getCell(14).font    = { italic: false, bold: true, size:11, color: {argb:'000000'} };
                        row.getCell(14).numFmt  = _format_2;
                        row.getCell(15).font    = { italic: false, bold: true, size:11,color: {argb:'000000'} };
                        row.getCell(15).numFmt  = _formatAmt;
                        row.getCell(16).font    = { italic: false, bold: true, size:11,color: {argb:'000000'} };
                        row.getCell(16).numFmt  = _format_2;
                        row.getCell(17).font    = { italic: false, bold: true, size:11, color: {argb:'000000'} };
                        row.getCell(17).numFmt  = _formatAmt;

                        l_DR_FAMT = l_DR_FAMT + Number(dt_Partner[i].DR_FAMT);
                        l_DR_AMT  = l_DR_AMT + Number(dt_Partner[i].DR_AMT);
                        l_CR_FAMT = l_CR_FAMT + Number(dt_Partner[i].CR_FAMT);
                        l_CR_AMT  = l_CR_AMT + Number(dt_Partner[i].CR_AMT);

                        l_TR_BALANCE_DR = l_TR_BALANCE_DR + Number(dt_Partner[i].TR_BALANCE_DR);
                        l_BK_BALANCE_DR = l_BK_BALANCE_DR + Number(dt_Partner[i].BK_BALANCE_DR);
                        l_TR_BALANCE_CR = l_TR_BALANCE_CR + Number(dt_Partner[i].TR_BALANCE_CR);
                        l_BK_BALANCE_CR = l_BK_BALANCE_CR + Number(dt_Partner[i].BK_BALANCE_CR);
                        l_SEQ     = l_SEQ + Number(dt_Partner[i].SEQ);

                    }
                    pos = pos + 1; 

                }  
                var row = worksheet.getRow(pos);
                worksheet.mergeCells(pos,2,pos,8); 
                row.getCell(2).value    = 'Total row: ' + '' + l_SEQ; 
                row.getCell(10).value   = l_DR_FAMT; 
                row.getCell(10).numFmt  = _format_2;
                row.getCell(11).value   = l_DR_AMT; 
                row.getCell(11).numFmt  = _formatAmt;
                row.getCell(12).value   = l_CR_FAMT; 
                row.getCell(12).numFmt  = _format_2;
                row.getCell(13).value   = l_CR_AMT;  
                row.getCell(13).numFmt  = _formatAmt;
                
                row.getCell(14).value   = l_TR_BALANCE_DR; 
                row.getCell(14).numFmt  = _format_2;
                row.getCell(15).value   = l_BK_BALANCE_DR; 
                row.getCell(15).numFmt  = _formatAmt;
                row.getCell(16).value   = l_TR_BALANCE_CR; 
                row.getCell(16).numFmt  = _format_2;
                row.getCell(17).value   = l_BK_BALANCE_CR;  
                row.getCell(17).numFmt  = _formatAmt;
                /********* Print file excel ********/
                const reportFile    = Helpers.tmpPath(file_new);
                await workbook.xlsx.writeFile(reportFile)
                return response.attachment( reportFile, file_new);
        } 
        catch (e) 
        {
            Utils.Logger({ LVL: "error", MODULE: "Report", FUNC: "rpt_6045040_MS", CONTENT: e.message })
            // return response.send(Utils.response(false, e.message, null))
            return response.send(null);
        }
    }  
    async rpt_6045040_CTTT_NMNB_2_SHEET ({ request, response, auth }) {
        try 
        { 
            /* P_RPT_ID: report_info.VAL1, P_RPT_URL: report_info.VAL2, P_RPT_FILE: report_info.VAL3,
                P_COMP_ID: company_info.PARTNER_ID, P_COMP_NM: company_info.TEXT, P_COMP_TAX: company_info.TAX_CODE, P_COMP_ADD: company_info.ADDR1,
                P_COMPANY: this.selectedCompany, P_FR_DATE: this.from_date, P_FR_TO: this.to_date,P_ACC_PK: this.txtAccountPK, P_ACC_CD: this.txtAccountName,P_PARTNER_PK: this.txtPartnerPK,
                P_CCY: this.selectedCurrency, P_STATUS: this.selectedStatus, P_BOOK_CCY: this.txtBookCCY, P_CIRCULARS: this.selectedCirculars 
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
            var _store          = "AC_RPT_6045040_ACC_BY_PARTNER";
            var _store_6045220  = "AC_RPT_6045040_BY_PARTNER";
            var _store_title    = "AC_RPT_6045040_TITLE";
            var _param          = [item.P_COMPANY, item.P_FR_DATE, item.P_FR_TO, item.P_ACC_PK, item.P_PARTNER_PK,item.P_STATUS,item.P_TCO_BUSPLACE_PK, item.P_LANG];
            var _param_6045220  = [item.P_COMPANY,item.P_TCO_BUSPLACE_PK, item.P_FR_DATE, item.P_FR_TO, item.P_OPTIONACC, item.P_OPTION_CRDR, item.P_ACC_PK, item.P_PARTNER_PK, item.P_COMBINE_YN, item.P_SELSHOWGRID];
            
            /***************************** Return failded ****************************/
            if (!user) 
            {
                return response.send(Utils.response(false, "Request failed!", null));
            } 
            /****************************** Begin call store and write excell *********/
            else 
                /********* Call store infomation tltle ***************/ 
                var _param_title    = [item.P_COMPANY, item.P_FR_DATE, item.P_FR_TO, '' , item.P_ACC_PK, item.P_BOOK_CCY, item.P_LANG, item.P_TCO_BUSPLACE_PK];
                var dt_Title  = await DBService.callProcCursor(_store_title, _param_title , p_language , p_crt_by); 
                /********* Read file excel ********/ 
                const templateFile  = Helpers.resourcesPath(_resourcesPath); 
                await workbook.xlsx.readFile(templateFile);
                var worksheet      = workbook.getWorksheet(1);
                /********* Write file excel ********/
                    /********* Call partner store  ***************/ 
                if(item.P_FORM_ID == '6045220'){
                    var dt_Partner  = await DBService.callProcCursor(_store_6045220, _param_6045220 , p_language , p_crt_by); 
                }else{
                    var dt_Partner  = await DBService.callProcCursor(_store, _param , p_language , p_crt_by); 
                }    
                var partner_id = "";
                var pos_title = 0;
                var _lang = item.P_LANG;
                var partner_info = "";
                if (dt_Partner.length>0) 
                {
                    for (var i = 0; i < dt_Partner.length; i++) 
                    {
                        dt_Partner = dt_Partner;
                        
                        if( dt_Partner[i].PARTNER_INFO != partner_info || i == 0)
                        {
                            partner_info = dt_Partner[i].PARTNER_INFO;
                            partner_id = dt_Partner[i].PARTNER_ID;
                            if(i>0){
                                worksheet   = workbook.addWorksheet(); 
                            }
                            worksheet.name = partner_id; 
                            // Width
                            worksheet.getColumn(1).width = 10; // date
                            worksheet.getColumn(2).width = 13; // voucher no
                            worksheet.getColumn(3).width = 13; // voucher date
                            worksheet.getColumn(4).width = 40; // local desrciption
                            worksheet.getColumn(5).width = 40; // Desrciption
                            worksheet.getColumn(6).width = 10.29; // Account code
                            worksheet.getColumn(7).width = 12.43; // Discounted period
                            worksheet.getColumn(8).width = 17; // Debit
                            worksheet.getColumn(9).width = 17; // Credit
                            worksheet.getColumn(10).width = 17.57; // Balance
                            worksheet.getColumn(11).width = 8.43;//remark
                            
                            worksheet.getColumn(12).width = 10.86;//serial No
                            worksheet.getColumn(13).width = 10.86;//Inv No
                            worksheet.getColumn(14).width = 12.29;//Inv Date
                            worksheet.getColumn(15).width = 10.86;//Due Date
                            worksheet.getColumn(16).width = 13.00;//C.Invoice No
                            worksheet.getColumn(17).width = 14.14;//C.Invoice Date
                            pos_title = 0;
                            //INFOMATION COMPANY
                            pos_title = pos_title + 1;
                            //sign
                            var row_title = worksheet.getRow(pos_title);
                            // Info
                            row_title.getCell(1).value = dt_Title[0].BIZ_NM_A1; // biz name
                            row_title.getCell(8).value = dt_Title[0].MS_H1; // Mẫu số 31a 
                            worksheet.mergeCells(pos_title,8, pos_title,9);// merge MS
                            row_title.getCell(8).font  = { italic: false, bold: true, color: {argb:'000000'}, name: 'Times New Roman'};
                            row_title.getCell(8).alignment = { vertical: 'middle', horizontal: 'center' };
                            pos_title = pos_title + 1;
                            row_title = worksheet.getRow(pos_title);
                            row_title.getCell(1).value = dt_Title[0].BIZ_TAX_A2; // biz tax code
                            row_title.getCell(8).value = dt_Title[0].EV_H2; // Thong tu
                            pos_title = pos_title + 1;
                            row_title = worksheet.getRow(pos_title);
                            row_title.getCell(1).value = dt_Title[0].BIZ_ADD_A3; // Address
                            row_title.getCell(8).value = dt_Title[0].EV_H3; // Thong tu
                            pos_title = pos_title + 1;
                            row_title = worksheet.getRow(pos_title);
                            row_title.getCell(1).value = dt_Title[0].TITLE_A4; // Title
                            row_title.getCell(1).font  = { italic: false, bold: true, color: {argb:'000000'}, size:18, name: 'Times New Roman'};
                            row_title.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
                            worksheet.mergeCells(pos_title,1, pos_title,17);// Title
                            row_title.height = 30; 
                            pos_title = pos_title + 1;
                            row_title = worksheet.getRow(pos_title);
                            row_title.getCell(1).value = dt_Title[0].DATE_TOFRM_A5; // from date - todate
                            row_title.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
                            worksheet.mergeCells(pos_title,1, pos_title,17);// from date - todate
                            pos_title = pos_title + 1;
                            row_title = worksheet.getRow(pos_title);
                            row_title.getCell(1).value = dt_Title[0].AC_CD_A6; // account
                            row_title.getCell(1).font  = { italic: false, bold: true, color: {argb:'000000'},size:10, name: 'Times New Roman'};
                            pos_title = pos_title + 1;
                            row_title = worksheet.getRow(pos_title);
                            row_title.getCell(1).value = _lang == 'VIE' ? 'Đối tượng :' + partner_info : 'Object :' + partner_info; // partner id
                            row_title.getCell(1).font  = { italic: false, bold: true, color: {argb:'000000'},size:10, name: 'Times New Roman'};
                            pos_title = pos_title + 2;
                            row_title = worksheet.getRow(pos_title);
                            row_title.getCell(9).value = dt_Title[0].DVT_K8; // partner id
                            row_title.getCell(9).font  = { italic: false, bold: true, color: {argb:'000000'},size:10, name: 'Times New Roman'};

                            //bảng
                            
                            pos_title = pos_title + 1;
                            row_title = worksheet.getRow(pos_title);
                            pos_title = pos_title + 1;
                            var row_title_11 = worksheet.getRow(pos_title);
                            row_title.getCell(1).value      = dt_Title[0].A10_11; // date - ngày tháng năm 
                            worksheet.mergeCells(pos_title-1,1,pos_title,1); //date 
                            row_title.getCell(2).value      = dt_Title[0].BC10_11; // voucher
                            worksheet.mergeCells(pos_title-1,2,pos_title-1,3); //voucher 
                            row_title_11.getCell(2).value   = dt_Title[0].B11; // No
                            row_title_11.getCell(3).value   = dt_Title[0].C11; // voucher
                            row_title.getCell(4).value      = dt_Title[0].D10_11; //Local Description
                            worksheet.mergeCells(pos_title-1,4,pos_title,4); //local description
                            row_title.getCell(5).value      = dt_Title[0].E10_11; // Description
                            worksheet.mergeCells(pos_title-1,5,pos_title,5); // description
                            row_title.getCell(6).value      = dt_Title[0].F10_11; // Account
                            worksheet.mergeCells(pos_title-1,6,pos_title,6); // account
                            row_title.getCell(7).value      = dt_Title[0].G10_11; //account offset
                            worksheet.mergeCells(pos_title-1,7,pos_title,7); // Số hiệu
                            row_title.getCell(8).value      = dt_Title[0].HI10_11;//Incurred
                            worksheet.mergeCells(pos_title-1,8,pos_title-1,9); // số phát sinh 
                            row_title_11.getCell(8).value   = dt_Title[0].H11; // Debit
                            row_title_11.getCell(9).value   = dt_Title[0].I11; // Credit
                            row_title.getCell(10).value     = dt_Title[0].J10; //balance
                            worksheet.mergeCells(pos_title-1,10,pos_title,10); //Balance 
                            row_title.getCell(11).value     = dt_Title[0].K10; // remark
                            row_title_11.getCell(11).value  = dt_Title[0].K11; // seq
                            row_title.getCell(12).value     = dt_Title[0].L10; // Serial No
                            worksheet.mergeCells(pos_title-1,12,pos_title,12); //Serial No 
                            row_title.getCell(13).value     = dt_Title[0].M10; // Invoice No
                            worksheet.mergeCells(pos_title-1,13,pos_title,13); //Invoice No 
                            row_title.getCell(14).value     = dt_Title[0].N10; // Invoice Date
                            worksheet.mergeCells(pos_title-1,14,pos_title,14); //Invoice Date 
                            row_title.getCell(15).value     = dt_Title[0].O10; // Due Date
                            worksheet.mergeCells(pos_title-1,15,pos_title,15); //Due Date 
                            row_title.getCell(16).value     = dt_Title[0].P10; // C.Invoice No
                            worksheet.mergeCells(pos_title-1,16,pos_title,16); //C.Invoice No 
                            row_title.getCell(17).value     = dt_Title[0].Q10; // C.Invoice Date
                            worksheet.mergeCells(pos_title-1,17,pos_title,17); //C.Invoice Date 
    
                            for(let j = 1; j<=17; j++)
                            {
                                row_title.getCell(j).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "D9D9D9" } };
                                row_title.getCell(j).alignment = { vertical: 'middle', horizontal: 'center' };
                                row_title.getCell(j).font      = { italic: false, bold: true, color: {argb:'000000'}, size:10, name: 'Times New Roman'};
                                row_title.getCell(j).border = {
                                                                top: {style:'thin', color: {argb:'A6A6A6'}},
                                                                left: {style:'thin', color: {argb:'A6A6A6'}},
                                                                bottom: {style:'thin', color: {argb:'A6A6A6'}},
                                                                right: {style:'thin', color: {argb:'A6A6A6'}}
                                                            }; 
                                                            
                                row_title_11.getCell(j).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "D9D9D9" } };
                                row_title_11.getCell(j).font = { italic: false, bold: true, color: {argb:'000000'}, size:10, name: 'Times New Roman'};
                                row_title_11.getCell(j).alignment = { vertical: 'middle', horizontal: 'center' };
                                row_title_11.getCell(j).border = {
                                                                top: {style:'thin', color: {argb:'A6A6A6'}},
                                                                left: {style:'thin', color: {argb:'A6A6A6'}},
                                                                bottom: {style:'thin', color: {argb:'A6A6A6'}},
                                                                right: {style:'thin', color: {argb:'A6A6A6'}}
                                                            };
                            }
                            
                        }
                       
                        //-------Fill Data----------------  
                        pos_title = pos_title + 1 ; 
                        var _bookccy = item.P_BOOK_CCY;  
                        var _formatAmt = (_bookccy=='VND'?'_(* #,##0_);_(* (#,##0);_(* "-"_);_(@_)':'_(* #,##0.00_);_(* (#,##0.00);_(* "-"_);_(@_)');
                        var row_item = worksheet.getRow(pos_title);
                        row_item.getCell(1).value   = dt_Partner[i].TR_DATE;
                        row_item.getCell(2).value   = dt_Partner[i].VOUCHERNO;    
                        row_item.getCell(3).value   = dt_Partner[i].TR_DATE;  
                        row_item.getCell(4).value   = dt_Partner[i].REMARK2; 
                        row_item.getCell(5).value   = dt_Partner[i].REMARK; 
                        row_item.getCell(6).value   = dt_Partner[i].ACCT_CODE; 
                        row_item.getCell(7).value   = dt_Partner[i].CORR_AC;   

                        row_item.getCell(8).value   = dt_Partner[i].DR_AMT; 
                        row_item.getCell(9).value   = dt_Partner[i].CR_AMT; 
                        row_item.getCell(10).value  = Number(dt_Partner[i].CLOSINGBALANCE); 
                        row_item.getCell(8).numFmt = _formatAmt;
                        worksheet.getCell(pos_title,8).alignment = { vertical: 'middle', horizontal: 'right' };
                        row_item.getCell(9).numFmt = _formatAmt;
                        worksheet.getCell(pos_title,9).alignment = { vertical: 'middle', horizontal: 'right' };
                        row_item.getCell(10).numFmt = _formatAmt;
                        worksheet.getCell(pos_title,10).alignment = { vertical: 'middle', horizontal: 'right' };
                            
                        row_item.getCell(11).value   = dt_Partner[i].TAC_HGTRH_PK;
                        row_item.getCell(12).value   = dt_Partner[i].SERIAL_NO;
                        row_item.getCell(13).value   = dt_Partner[i].INVOICE_NO;
                        row_item.getCell(14).value   = dt_Partner[i].INVOICE_DATE;
                        row_item.getCell(15).value   = dt_Partner[i].DUE_DATE;
                        row_item.getCell(16).value   = dt_Partner[i].C_INVOICE_NO;
                        row_item.getCell(17).value   = dt_Partner[i].C_INVOICE_DATE;
                        for(let j = 1; j<=17; j++)
                        {
                            row_item.getCell(j).border = {
                                                            top: {style:'thin', color: {argb:'A6A6A6'}},
                                                            left: {style:'thin', color: {argb:'A6A6A6'}},
                                                            bottom: {style:'thin', color: {argb:'A6A6A6'}},
                                                            right: {style:'thin', color: {argb:'A6A6A6'}}
                                                        }; 
                             row_item.getCell(j).font  = { italic: false, bold: false, size:10, name: 'Times New Roman', color: {argb:'000000'} };                            
                        }
                        if(dt_Partner[i].ORD == 'O' || dt_Partner[i].ORD == 'T'|| dt_Partner[i].ORD == 'E')
                        {
                            
                            row_item.getCell(5).font  = { italic: false, bold: true, size:10, name: 'Times New Roman', color: {argb:'000000'} };
                            worksheet.getCell(pos_title,5).alignment = { vertical: 'middle', horizontal: 'center' };
                            row_item.getCell(8).font  = { italic: false, bold: true, size:10, name: 'Times New Roman', color: {argb:'000000'} };
                            row_item.getCell(9).font  = { italic: false, bold: true, size:10,name: 'Times New Roman', color: {argb:'000000'} };
                            row_item.getCell(10).font = { italic: false, bold: true, size:10,name: 'Times New Roman', color: {argb:'000000'} };
                        }
                        if(dt_Partner[i].ORD === 'E'){
                            pos_title = pos_title + 3;
                            row_title = worksheet.getRow(pos_title);
                            row_title.getCell(8).value = dt_Title[0].DATE_I20; // date month year
                            row_title.getCell(8).alignment = { vertical: 'middle', horizontal: 'center' };
                            worksheet.mergeCells(pos_title,8, pos_title,10);// 
                            pos_title = pos_title + 1;
                            row_title = worksheet.getRow(pos_title);
                            row_title.getCell(1).value = dt_Title[0].EV_A21; // Prepared by
                            row_title.getCell(1).font  = { italic: false, bold: true, color: {argb:'000000'}, size:10, name: 'Times New Roman'};
                            worksheet.mergeCells(pos_title,1, pos_title,2);// 
                            row_title.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
                            row_title.getCell(5).value = dt_Title[0].EV_E21; // Chief Account
                            row_title.getCell(5).font  = { italic: false, bold: true, color: {argb:'000000'}, size:10, name: 'Times New Roman'};
                            row_title.getCell(5).alignment = { vertical: 'middle', horizontal: 'center' };
                            row_title.getCell(8).value = dt_Title[0].EV_I21; // General Director
                            row_title.getCell(8).font  = { italic: false, bold: true, color: {argb:'000000'}, size:10, name: 'Times New Roman'};
                            worksheet.mergeCells(pos_title,8, pos_title,10);// 
                            row_title.getCell(8).alignment = { vertical: 'middle', horizontal: 'center' };
                            // sign,fullname  
                            pos_title =    pos_title + 1;
                            row_title = worksheet.getRow(pos_title);
                            row_title.getCell(1).value = dt_Title[0].EV_SIG_A21; // Prepared by
                            row_title.getCell(1).font  = { italic: true, bold: false, color: {argb:'000000'},size:10, name: 'Times New Roman'};
                            worksheet.mergeCells(pos_title,1, pos_title,2);// 
                            row_title.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
                            row_title.getCell(5).value = dt_Title[0].EV_SIG_E21; // Chief Account
                            row_title.getCell(5).font  = { italic: true, bold: false, color: {argb:'000000'},size:10, name: 'Times New Roman'};
                            row_title.getCell(5).alignment = { vertical: 'middle', horizontal: 'center' };
                            row_title.getCell(8).value = dt_Title[0].EV_SIG_I21; // General Director
                            row_title.getCell(8).font  = { italic: true, bold: false, color: {argb:'000000'},size:10, name: 'Times New Roman'};
                            worksheet.mergeCells(pos_title,8, pos_title,10);// 
                            row_title.getCell(8).alignment = { vertical: 'middle', horizontal: 'center' };
                        }
                }  
                //worksheet.removeWorksheet(1);
                /********* Print file excel ********/
                const reportFile    = Helpers.tmpPath(file_new);
                await workbook.xlsx.writeFile(reportFile)
                return response.attachment( reportFile, file_new);
            }
        } 
        catch (e) 
        {
            Utils.Logger({ LVL: "error", MODULE: "Report", FUNC: "rpt_6045040_CTTT_NMNB_2_SHEET", CONTENT: e.message })
           // return response.send(Utils.response(false, e.message, null))
           return response.send(null);
        }
    }  
    async rpt_6045040_CTTT_NMNB_2 ({ request, response, auth }) {
        try 
        { 
            /* P_RPT_ID: report_info.VAL1, P_RPT_URL: report_info.VAL2, P_RPT_FILE: report_info.VAL3,
                P_COMP_ID: company_info.PARTNER_ID, P_COMP_NM: company_info.TEXT, P_COMP_TAX: company_info.TAX_CODE, P_COMP_ADD: company_info.ADDR1,
                P_COMPANY: this.selectedCompany, P_FR_DATE: this.from_date, P_FR_TO: this.to_date,P_ACC_PK: this.txtAccountPK, P_ACC_CD: this.txtAccountName,P_PARTNER_PK: this.txtPartnerPK,
                P_CCY: this.selectedCurrency, P_STATUS: this.selectedStatus, P_BOOK_CCY: this.txtBookCCY, P_CIRCULARS: this.selectedCirculars 
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
            var _store          = "AC_RPT_6045040_ACC_BY_PARTNER";
            var _store_title    = "AC_RPT_6045040_TITLE";
            var _param          = [item.P_COMPANY, item.P_FR_DATE, item.P_FR_TO, item.P_ACC_PK, item.P_PARTNER_PK, item.P_STATUS, item.P_TCO_BUSPLACE_PK, item.P_LANG];
            
            /***************************** Return failded ****************************/
            if (!user) 
            {
                return response.send(Utils.response(false, "Request failed!", null));
            } 
            /****************************** Begin call store and write excell *********/
            else 
                /********* Call store infomation tltle ***************/ 
                var _param_title    = [item.P_COMPANY, item.P_FR_DATE, item.P_FR_TO, '' , item.P_ACC_PK, item.P_BOOK_CCY, item.P_LANG, item.P_TCO_BUSPLACE_PK];
                var dt_Title  = await DBService.callProcCursor(_store_title, _param_title , p_language , p_crt_by); 
                /********* Read file excel ********/ 
                const templateFile  = Helpers.resourcesPath(_resourcesPath); 
                await workbook.xlsx.readFile(templateFile);
                var worksheet       = workbook.getWorksheet(1);
                /********* Write file excel ********/
                    /********* Call partner store  ***************/ 
                var dt_Partner  = await DBService.callProcCursor(_store, _param , p_language , p_crt_by); 
                var partner_id = "";
                var pos_title = 0;
                var _lang = item.P_LANG;
                var partner_info = "";
                if (dt_Partner.length>0) 
                {
                    for (var i = 0; i < dt_Partner.length; i++) 
                    {
                        dt_Partner = dt_Partner;
                        //partner_pk = dt_Partner[i].PK;
                       // cr_openning = 0;
                        pos_title = pos_title ;
                        
                        // Width
                        worksheet.getColumn(1).width = 10; // date
                        worksheet.getColumn(2).width = 13; // voucher no
                        worksheet.getColumn(3).width = 13; // voucher date
                        worksheet.getColumn(4).width = 40; // local desrciption
                        worksheet.getColumn(5).width = 40; // Desrciption
                        worksheet.getColumn(6).width = 10.29; // Account code
                        worksheet.getColumn(7).width = 12.43; // Discounted period
                        worksheet.getColumn(8).width = 17; // Debit
                        worksheet.getColumn(9).width = 17; // Credit
                        worksheet.getColumn(10).width = 17.57; // Balance
                        worksheet.getColumn(11).width = 8.43;//remark
                        worksheet.getColumn(12).width = 10.86;//serial No
                        worksheet.getColumn(13).width = 10.86;//Inv No
                        worksheet.getColumn(14).width = 12.29;//Inv Date
                        worksheet.getColumn(15).width = 10.86;//Due Date
                        worksheet.getColumn(16).width = 13.00;//C.Invoice No
                        worksheet.getColumn(17).width = 14.14;//C.Invoice Date
                        if( dt_Partner[i].PARTNER_INFO != partner_info || i == 0)
                        {
                            partner_info = dt_Partner[i].PARTNER_INFO;
                      
                            //INFOMATION COMPANY
                            if(i>0) {

                                pos_title =    pos_title + 3;
                                //sign
                                row_title = worksheet.getRow(pos_title);
                                row_title.getCell(8).value = dt_Title[0].DATE_I20; // date month year
                                row_title.getCell(8).alignment = { vertical: 'middle', horizontal: 'center' };
                                worksheet.mergeCells(pos_title,8, pos_title,10);// 
                                pos_title =    pos_title + 1;
                                row_title = worksheet.getRow(pos_title);
                                row_title.getCell(1).value = dt_Title[0].EV_A21; // Prepared by
                                row_title.getCell(1).font  = { italic: false, bold: true, color: {argb:'000000'}, size:10, name: 'Times New Roman'};
                                worksheet.mergeCells(pos_title,1, pos_title,2);// 
                                row_title.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
                                row_title.getCell(5).value = dt_Title[0].EV_E21; // Chief Account
                                row_title.getCell(5).font  = { italic: false, bold: true, color: {argb:'000000'}, size:10, name: 'Times New Roman'};
                                row_title.getCell(5).alignment = { vertical: 'middle', horizontal: 'center' };
                                row_title.getCell(8).value = dt_Title[0].EV_I21; // General Director
                                row_title.getCell(8).font  = { italic: false, bold: true, color: {argb:'000000'}, size:10, name: 'Times New Roman'};
                                worksheet.mergeCells(pos_title,8, pos_title,10);// 
                                row_title.getCell(8).alignment = { vertical: 'middle', horizontal: 'center' };
                                // sign,fullname  
                                pos_title =    pos_title + 1;
                                row_title = worksheet.getRow(pos_title);
                                row_title.getCell(1).value = dt_Title[0].EV_SIG_A21; // Prepared by
                                row_title.getCell(1).font  = { italic: true, bold: false, color: {argb:'000000'},size:10, name: 'Times New Roman'};
                                worksheet.mergeCells(pos_title,1, pos_title,2);// 
                                row_title.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
                                row_title.getCell(5).value = dt_Title[0].EV_SIG_E21; // Chief Account
                                row_title.getCell(5).font  = { italic: true, bold: false, color: {argb:'000000'},size:10, name: 'Times New Roman'};
                                row_title.getCell(5).alignment = { vertical: 'middle', horizontal: 'center' };
                                row_title.getCell(8).value = dt_Title[0].EV_SIG_I21; // General Director
                                row_title.getCell(8).font  = { italic: true, bold: false, color: {argb:'000000'},size:10, name: 'Times New Roman'};
                                worksheet.mergeCells(pos_title,8, pos_title,10);// 
                                row_title.getCell(8).alignment = { vertical: 'middle', horizontal: 'center' };
                                pos_title = pos_title + 5;

                            }

                            pos_title = pos_title + 1;
                            var row_title = worksheet.getRow(pos_title);
                            // Info
                            row_title.getCell(1).value = dt_Title[0].BIZ_NM_A1; // biz name
                            row_title.getCell(8).value = dt_Title[0].MS_H1; // Mẫu số 31a 
                            worksheet.mergeCells(pos_title,8, pos_title,9);// merge MS
                            row_title.getCell(8).font  = { italic: false, bold: true, color: {argb:'000000'}, name: 'Times New Roman'};
                            row_title.getCell(8).alignment = { vertical: 'middle', horizontal: 'center' };
                            pos_title = pos_title + 1;
                            row_title = worksheet.getRow(pos_title);
                            row_title.getCell(1).value = dt_Title[0].BIZ_TAX_A2; // biz tax code
                            row_title.getCell(8).value = dt_Title[0].EV_H2; // Thong tu
                            pos_title = pos_title + 1;
                            row_title = worksheet.getRow(pos_title);
                            row_title.getCell(1).value = dt_Title[0].BIZ_ADD_A3; // Address
                            row_title.getCell(8).value = dt_Title[0].EV_H3; // Thong tu
                            pos_title = pos_title + 1;
                            row_title = worksheet.getRow(pos_title);
                            row_title.getCell(1).value = dt_Title[0].TITLE_A4; // Title
                            row_title.getCell(1).font  = { italic: false, bold: true, color: {argb:'000000'}, size:18, name: 'Times New Roman'};
                            row_title.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
                            worksheet.mergeCells(pos_title,1, pos_title,17);// Title
                            row_title.height = 30; 
                            pos_title = pos_title + 1;
                            row_title = worksheet.getRow(pos_title);
                            row_title.getCell(1).value = dt_Title[0].DATE_TOFRM_A5; // from date - todate
                            row_title.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
                            worksheet.mergeCells(pos_title,1, pos_title,17);// from date - todate
                            pos_title = pos_title + 1;
                            row_title = worksheet.getRow(pos_title);
                            row_title.getCell(1).value = dt_Title[0].AC_CD_A6; // account
                            row_title.getCell(1).font  = { italic: false, bold: true, color: {argb:'000000'},size:10, name: 'Times New Roman'};
                            pos_title = pos_title + 1;
                            row_title = worksheet.getRow(pos_title);
                            row_title.getCell(1).value = _lang == 'VIE' ? 'Đối tượng :' + partner_info : 'Object :' + partner_info; // partner id
                            row_title.getCell(1).font  = { italic: false, bold: true, color: {argb:'000000'},size:10, name: 'Times New Roman'};
                            pos_title = pos_title + 2;
                            row_title = worksheet.getRow(pos_title);
                            row_title.getCell(9).value = dt_Title[0].DVT_K8; // partner id
                            row_title.getCell(9).font  = { italic: false, bold: true, color: {argb:'000000'},size:10, name: 'Times New Roman'};

                            //bảng
                            
                            pos_title = pos_title + 1;
                            row_title = worksheet.getRow(pos_title);
                            pos_title = pos_title + 1;
                            var row_title_11 = worksheet.getRow(pos_title);
                            row_title.getCell(1).value      = dt_Title[0].A10_11; // date - ngày tháng năm 
                            worksheet.mergeCells(pos_title-1,1,pos_title,1); //date 
                            row_title.getCell(2).value      = dt_Title[0].BC10_11; // voucher
                            worksheet.mergeCells(pos_title-1,2,pos_title-1,3); //voucher 
                            row_title_11.getCell(2).value   = dt_Title[0].B11; // No
                            row_title_11.getCell(3).value   = dt_Title[0].C11; // voucher
                            row_title.getCell(4).value      = dt_Title[0].D10_11; //Local Description
                            worksheet.mergeCells(pos_title-1,4,pos_title,4); //local description
                            row_title.getCell(5).value      = dt_Title[0].E10_11; // Description
                            worksheet.mergeCells(pos_title-1,5,pos_title,5); // description
                            row_title.getCell(6).value      = dt_Title[0].F10_11; // Account
                            worksheet.mergeCells(pos_title-1,6,pos_title,6); // account
                            row_title.getCell(7).value      = dt_Title[0].G10_11; //Discounted period
                            worksheet.mergeCells(pos_title-1,7,pos_title,7); // Số hiệu
                            row_title.getCell(8).value      = dt_Title[0].HI10_11;//Incurred
                            worksheet.mergeCells(pos_title-1,8,pos_title-1,9); // số phát sinh 
                            row_title_11.getCell(8).value   = dt_Title[0].H11; // Debit
                            row_title_11.getCell(9).value   = dt_Title[0].I11; // Credit
                            row_title.getCell(10).value     = dt_Title[0].J10; //balance
                            worksheet.mergeCells(pos_title-1,10,pos_title,10); //Balance 
                            row_title.getCell(11).value     = dt_Title[0].K10; // remark
                            row_title_11.getCell(11).value  = dt_Title[0].K11; // seq

                            row_title.getCell(12).value     = dt_Title[0].L10; // Serial No
                            worksheet.mergeCells(pos_title-1,12,pos_title,12); //Serial No 
                            row_title.getCell(13).value     = dt_Title[0].M10; // Invoice No
                            worksheet.mergeCells(pos_title-1,13,pos_title,13); //Invoice No 
                            row_title.getCell(14).value     = dt_Title[0].N10; // Invoice Date
                            worksheet.mergeCells(pos_title-1,14,pos_title,14); //Invoice Date 
                            row_title.getCell(15).value     = dt_Title[0].O10; // Due Date
                            worksheet.mergeCells(pos_title-1,15,pos_title,15); //Due Date 
                            row_title.getCell(16).value     = dt_Title[0].P10; // C.Invoice No
                            worksheet.mergeCells(pos_title-1,16,pos_title,16); //C.Invoice No 
                            row_title.getCell(17).value     = dt_Title[0].Q10; // C.Invoice Date
                            worksheet.mergeCells(pos_title-1,17,pos_title,17); //C.Invoice Date 
    
                            for(let j = 1; j<=17; j++)
                            {
                                row_title.getCell(j).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "D9D9D9" } };
                                row_title.getCell(j).alignment = { vertical: 'middle', horizontal: 'center' };
                                row_title.getCell(j).font      = { italic: false, bold: true, color: {argb:'000000'}, size:10, name: 'Times New Roman'};
                                row_title.getCell(j).border = {
                                                                top: {style:'thin', color: {argb:'A6A6A6'}},
                                                                left: {style:'thin', color: {argb:'A6A6A6'}},
                                                                bottom: {style:'thin', color: {argb:'A6A6A6'}},
                                                                right: {style:'thin', color: {argb:'A6A6A6'}}
                                                            }; 
                                                            
                                row_title_11.getCell(j).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "D9D9D9" } };
                                row_title_11.getCell(j).font = { italic: false, bold: true, color: {argb:'000000'}, size:10, name: 'Times New Roman'};
                                row_title_11.getCell(j).alignment = { vertical: 'middle', horizontal: 'center' };
                                row_title_11.getCell(j).border = {
                                                                top: {style:'thin', color: {argb:'A6A6A6'}},
                                                                left: {style:'thin', color: {argb:'A6A6A6'}},
                                                                bottom: {style:'thin', color: {argb:'A6A6A6'}},
                                                                right: {style:'thin', color: {argb:'A6A6A6'}}
                                                            };
                            }
                            
                        }
                       
                        //-------Fill Data----------------  
                        pos_title = pos_title + 1 ; 
                        var _bookccy = item.P_BOOK_CCY;  
                        var _formatAmt = (_bookccy=='VND'?'_(* #,##0_);_(* (#,##0);_(* "-"_);_(@_)':'_(* #,##0.00_);_(* (#,##0.00);_(* "-"_);_(@_)');
                        var row_item = worksheet.getRow(pos_title);
                        row_item.getCell(1).value   = dt_Partner[i].TR_DATE;
                        row_item.getCell(2).value   = dt_Partner[i].VOUCHERNO;    
                        row_item.getCell(3).value   = dt_Partner[i].TR_DATE;  
                        row_item.getCell(4).value   = dt_Partner[i].REMARK2; 
                        row_item.getCell(5).value   = dt_Partner[i].REMARK; 
                        row_item.getCell(6).value   = dt_Partner[i].ACCT_CODE; 
                        row_item.getCell(7).value   = dt_Partner[i].CORR_AC; 

                        row_item.getCell(8).value   = dt_Partner[i].DR_AMT; 
                        row_item.getCell(9).value   = dt_Partner[i].CR_AMT; 
                        row_item.getCell(10).value  = Number(dt_Partner[i].CLOSINGBALANCE); 
                        row_item.getCell(8).numFmt  = _formatAmt;
                        worksheet.getCell(pos_title,8).alignment = { vertical: 'middle', horizontal: 'right' };
                        row_item.getCell(9).numFmt  = _formatAmt;
                        worksheet.getCell(pos_title,9).alignment = { vertical: 'middle', horizontal: 'right' };
                        row_item.getCell(10).numFmt = _formatAmt;
                        worksheet.getCell(pos_title,10).alignment = { vertical: 'middle', horizontal: 'right' };
                        
                        row_item.getCell(11).value   = dt_Partner[i].TAC_HGTRH_PK;    
                        row_item.getCell(12).value   = dt_Partner[i].SERIAL_NO;
                        row_item.getCell(13).value   = dt_Partner[i].INVOICE_NO;
                        row_item.getCell(14).value   = dt_Partner[i].INVOICE_DATE;
                        row_item.getCell(15).value   = dt_Partner[i].DUE_DATE;
                        row_item.getCell(16).value   = dt_Partner[i].C_INVOICE_NO;
                        row_item.getCell(17).value   = dt_Partner[i].C_INVOICE_DATE;
                        for(let j = 1; j<=17; j++)
                        {
                            row_item.getCell(j).border = {
                                                            top: {style:'thin', color: {argb:'A6A6A6'}},
                                                            left: {style:'thin', color: {argb:'A6A6A6'}},
                                                            bottom: {style:'thin', color: {argb:'A6A6A6'}},
                                                            right: {style:'thin', color: {argb:'A6A6A6'}}
                                                        }; 
                             row_item.getCell(j).font  = { italic: false, bold: false, size:10, name: 'Times New Roman', color: {argb:'000000'} };                            
                        }
                        if(dt_Partner[i].ORD == 'O' || dt_Partner[i].ORD == 'T'|| dt_Partner[i].ORD == 'E')
                        {
                            
                            row_item.getCell(5).font  = { italic: false, bold: true, size:10, name: 'Times New Roman',  color: {argb:'000000'} };
                            worksheet.getCell(pos_title,5).alignment = { vertical: 'middle', horizontal: 'center' };
                            row_item.getCell(8).font  = { italic: false, bold: true, size:10, name: 'Times New Roman', color: {argb:'000000'} };
                            row_item.getCell(9).font  = { italic: false, bold: true, size:10, name: 'Times New Roman',color: {argb:'000000'} };
                            row_item.getCell(10).font = { italic: false, bold: true, size:10, name: 'Times New Roman',color: {argb:'000000'} };
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
            Utils.Logger({ LVL: "error", MODULE: "Report", FUNC: "rpt_6045040_CTTT_NMNB_2", CONTENT: e.message })
            // return response.send(Utils.response(false, e.message, null))
            return response.send(null);
        }
    }  
    // async rpt_6045040_CTTT_NMNB_2_SHEET ({ request, response, auth }) {
    //     try 
    //     { 
    //         /* P_RPT_ID: report_info.VAL1, P_RPT_URL: report_info.VAL2, P_RPT_FILE: report_info.VAL3,
    //             P_COMP_ID: company_info.PARTNER_ID, P_COMP_NM: company_info.TEXT, P_COMP_TAX: company_info.TAX_CODE, P_COMP_ADD: company_info.ADDR1,
    //             P_COMPANY: this.selectedCompany, P_FR_DATE: this.from_date, P_FR_TO: this.to_date,P_ACC_PK: this.txtAccountPK, P_ACC_CD: this.txtAccountName,P_PARTNER_PK: this.txtPartnerPK,
    //             P_CCY: this.selectedCurrency, P_STATUS: this.selectedStatus, P_BOOK_CCY: this.txtBookCCY, P_CIRCULARS: this.selectedCirculars 
    //             */
    //         /****************************** Get Param *********************************/
    //         let { para }        = request.get(['para']);
    //         /********* Parse pram to json ********/
    //         var item            = JSON.parse(para); 
    //         const user          = await auth.getUser() ;
    //         var COMP_ID         = item.P_COMP_ID, COMP_NM = item.P_COMP_NM, COMP_TAX = item.P_COMP_TAX, COMP_ADD = item.P_COMP_ADD;
    //         var BIZ_ID          = item.P_BIZ_ID , BIZ_NM  = item.P_BIZ_NM , BIZ_TAX  = item.P_BIZ_TAX , BIZ_ADD  = item.P_BIZ_ADD;
    //         const p_crt_by      = user.USER_ID;
    //         const p_language    = request.header("accept-language", "ENG");
    //         var file_nm         = [item.P_RPT_FILE];
    //         var file_type       = ".xlsx";
    //         var full_nm         = file_nm + file_type;
    //         var file_new        = file_nm + p_crt_by + file_type;
    //         var _resourcesPath  = [item.P_RPT_URL]+'/'+full_nm;
    //         var _store          = "AC_RPT_6045040_ACC_BY_PARTNER";
    //         var _store_title    = "AC_RPT_6045040_TITLE";
    //         var _param          = [item.P_COMPANY, item.P_FR_DATE, item.P_FR_TO, item.P_ACC_PK, item.P_PARTNER_PK, item.P_STATUS, item.P_TCO_BUSPLACE_PK, item.P_LANG];
            
    //         /***************************** Return failded ****************************/
    //         if (!user) 
    //         {
    //             return response.send(Utils.response(false, "Request failed!", null));
    //         } 
    //         /****************************** Begin call store and write excell *********/
    //         else 
    //             /********* Call store infomation tltle ***************/ 
    //             var _param_title    = [item.P_COMPANY, item.P_FR_DATE, item.P_FR_TO, '' , item.P_ACC_PK, item.P_BOOK_CCY, item.P_LANG, item.P_TCO_BUSPLACE_PK];
    //             var dt_Title  = await DBService.callProcCursor(_store_title, _param_title , p_language , p_crt_by); 
    //             /********* Read file excel ********/ 
    //             const templateFile  = Helpers.resourcesPath(_resourcesPath); 
    //             await workbook.xlsx.readFile(templateFile);
    //             var worksheet      = workbook.getWorksheet(1);
    //             /********* Write file excel ********/
    //                 /********* Call partner store  ***************/ 
    //             var dt_Partner  = await DBService.callProcCursor(_store, _param , p_language , p_crt_by); 
    //             var partner_id = "";
    //             var pos_title = 0;
    //             var _lang = item.P_LANG;
    //             var partner_info = "";
    //             if (dt_Partner.length>0) 
    //             {
    //                 for (var i = 0; i < dt_Partner.length; i++) 
    //                 {
    //                     dt_Partner = dt_Partner;
                        
    //                     if( dt_Partner[i].PARTNER_INFO != partner_info || i == 0)
    //                     {
    //                         partner_info = dt_Partner[i].PARTNER_INFO;
    //                         partner_id = dt_Partner[i].PARTNER_ID;
    //                         if(i>0){
    //                             worksheet   = workbook.addWorksheet(); 
    //                         }
    //                         worksheet.name = partner_id; 
    //                         // Width
    //                         worksheet.getColumn(1).width = 10; // date
    //                         worksheet.getColumn(2).width = 13; // voucher no
    //                         worksheet.getColumn(3).width = 13; // voucher date
    //                         worksheet.getColumn(4).width = 40; // local desrciption
    //                         worksheet.getColumn(5).width = 40; // Desrciption
    //                         worksheet.getColumn(6).width = 10.29; // Account code
    //                         worksheet.getColumn(7).width = 14.43; // Account Offset
    //                         worksheet.getColumn(8).width = 17; // Debit
    //                         worksheet.getColumn(9).width = 17; // Credit
    //                         worksheet.getColumn(10).width = 17.57; // Balance
    //                         worksheet.getColumn(11).width = 8.43;//remark
                            
    //                         worksheet.getColumn(12).width = 10.86;//serial No
    //                         worksheet.getColumn(13).width = 10.86;//Inv No
    //                         worksheet.getColumn(14).width = 12.29;//Inv Date
    //                         worksheet.getColumn(15).width = 10.86;//Due Date
    //                         worksheet.getColumn(16).width = 13.00;//C.Invoice No
    //                         worksheet.getColumn(17).width = 14.14;//C.Invoice Date
    //                         pos_title = 0;
    //                         //INFOMATION COMPANY
    //                         pos_title = pos_title + 1;
    //                         //sign
    //                         var row_title = worksheet.getRow(pos_title);
    //                         // Info
    //                         row_title.getCell(1).value = dt_Title[0].BIZ_NM_A1; // biz name
    //                         row_title.getCell(8).value = dt_Title[0].MS_H1; // Mẫu số 31a 
    //                         worksheet.mergeCells(pos_title,8, pos_title,9);// merge MS
    //                         row_title.getCell(8).font  = { italic: false, bold: true, color: {argb:'000000'}, name: 'Times New Roman'};
    //                         row_title.getCell(8).alignment = { vertical: 'middle', horizontal: 'center' };
    //                         pos_title = pos_title + 1;
    //                         row_title = worksheet.getRow(pos_title);
    //                         row_title.getCell(1).value = dt_Title[0].BIZ_TAX_A2; // biz tax code
    //                         row_title.getCell(8).value = dt_Title[0].EV_H2; // Thong tu
    //                         pos_title = pos_title + 1;
    //                         row_title = worksheet.getRow(pos_title);
    //                         row_title.getCell(1).value = dt_Title[0].BIZ_ADD_A3; // Address
    //                         row_title.getCell(8).value = dt_Title[0].EV_H3; // Thong tu
    //                         pos_title = pos_title + 1;
    //                         row_title = worksheet.getRow(pos_title);
    //                         row_title.getCell(1).value = dt_Title[0].TITLE_A4; // Title
    //                         row_title.getCell(1).font  = { italic: false, bold: true, color: {argb:'000000'}, size:18, name: 'Times New Roman'};
    //                         row_title.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
    //                         worksheet.mergeCells(pos_title,1, pos_title,17);// Title
    //                         row_title.height = 30; 
    //                         pos_title = pos_title + 1;
    //                         row_title = worksheet.getRow(pos_title);
    //                         row_title.getCell(1).value = dt_Title[0].DATE_TOFRM_A5; // from date - todate
    //                         row_title.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
    //                         worksheet.mergeCells(pos_title,1, pos_title,17);// from date - todate
    //                         pos_title = pos_title + 1;
    //                         row_title = worksheet.getRow(pos_title);
    //                         row_title.getCell(1).value = dt_Title[0].AC_CD_A6; // account
    //                         row_title.getCell(1).font  = { italic: false, bold: true, color: {argb:'000000'},size:10, name: 'Times New Roman'};
    //                         pos_title = pos_title + 1;
    //                         row_title = worksheet.getRow(pos_title);
    //                         row_title.getCell(1).value = _lang == 'VIE' ? 'Đối tượng :' + partner_info : 'Object :' + partner_info; // partner id
    //                         row_title.getCell(1).font  = { italic: false, bold: true, color: {argb:'000000'},size:10, name: 'Times New Roman'};
    //                         pos_title = pos_title + 2;
    //                         row_title = worksheet.getRow(pos_title);
    //                         row_title.getCell(9).value = dt_Title[0].DVT_K8; // partner id
    //                         row_title.getCell(9).font  = { italic: false, bold: true, color: {argb:'000000'},size:10, name: 'Times New Roman'};

    //                         //bảng
                            
    //                         pos_title = pos_title + 1;
    //                         row_title = worksheet.getRow(pos_title);
    //                         pos_title = pos_title + 1;
    //                         var row_title_11 = worksheet.getRow(pos_title);
    //                         row_title.getCell(1).value      = dt_Title[0].A10_11; // date - ngày tháng năm 
    //                         worksheet.mergeCells(pos_title-1,1,pos_title,1); //date 
    //                         row_title.getCell(2).value      = dt_Title[0].BC10_11; // voucher
    //                         worksheet.mergeCells(pos_title-1,2,pos_title-1,3); //voucher 
    //                         row_title_11.getCell(2).value   = dt_Title[0].B11; // No
    //                         row_title_11.getCell(3).value   = dt_Title[0].C11; // voucher
    //                         row_title.getCell(4).value      = dt_Title[0].D10_11; //Local Description
    //                         worksheet.mergeCells(pos_title-1,4,pos_title,4); //local description
    //                         row_title.getCell(5).value      = dt_Title[0].E10_11; // Description
    //                         worksheet.mergeCells(pos_title-1,5,pos_title,5); // description
    //                         row_title.getCell(6).value      = dt_Title[0].F10_11; // Account
    //                         worksheet.mergeCells(pos_title-1,6,pos_title,6); // account
    //                         row_title.getCell(7).value      = dt_Title[0].G10_11; //account offset
    //                         worksheet.mergeCells(pos_title-1,7,pos_title,7); // account offset
    //                         row_title.getCell(8).value      = dt_Title[0].HI10_11;//Incurred
    //                         worksheet.mergeCells(pos_title-1,8,pos_title-1,9); // số phát sinh 
    //                         row_title_11.getCell(8).value   = dt_Title[0].H11; // Debit
    //                         row_title_11.getCell(9).value   = dt_Title[0].I11; // Credit
    //                         row_title.getCell(10).value     = dt_Title[0].J10; //balance
    //                         worksheet.mergeCells(pos_title-1,10,pos_title,10); //Balance 
    //                         row_title.getCell(11).value     = dt_Title[0].K10; // remark
    //                         row_title_11.getCell(11).value  = dt_Title[0].K11; // seq
    //                         row_title.getCell(12).value     = dt_Title[0].L10; // Serial No
    //                         worksheet.mergeCells(pos_title-1,12,pos_title,12); //Serial No 
    //                         row_title.getCell(13).value     = dt_Title[0].M10; // Invoice No
    //                         worksheet.mergeCells(pos_title-1,13,pos_title,13); //Invoice No 
    //                         row_title.getCell(14).value     = dt_Title[0].N10; // Invoice Date
    //                         worksheet.mergeCells(pos_title-1,14,pos_title,14); //Invoice Date 
    //                         row_title.getCell(15).value     = dt_Title[0].O10; // Due Date
    //                         worksheet.mergeCells(pos_title-1,15,pos_title,15); //Due Date 
    //                         row_title.getCell(16).value     = dt_Title[0].P10; // C.Invoice No
    //                         worksheet.mergeCells(pos_title-1,16,pos_title,16); //C.Invoice No 
    //                         row_title.getCell(17).value     = dt_Title[0].Q10; // C.Invoice Date
    //                         worksheet.mergeCells(pos_title-1,17,pos_title,17); //C.Invoice Date 
    
    //                         for(let j = 1; j<=17; j++)
    //                         {
    //                             row_title.getCell(j).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "D9D9D9" } };
    //                             row_title.getCell(j).alignment = { vertical: 'middle', horizontal: 'center' };
    //                             row_title.getCell(j).font      = { italic: false, bold: true, color: {argb:'000000'}, size:10, name: 'Times New Roman'};
    //                             row_title.getCell(j).border = {
    //                                                             top: {style:'thin', color: {argb:'A6A6A6'}},
    //                                                             left: {style:'thin', color: {argb:'A6A6A6'}},
    //                                                             bottom: {style:'thin', color: {argb:'A6A6A6'}},
    //                                                             right: {style:'thin', color: {argb:'A6A6A6'}}
    //                                                         }; 
                                                            
    //                             row_title_11.getCell(j).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "D9D9D9" } };
    //                             row_title_11.getCell(j).font = { italic: false, bold: true, color: {argb:'000000'}, size:10, name: 'Times New Roman'};
    //                             row_title_11.getCell(j).alignment = { vertical: 'middle', horizontal: 'center' };
    //                             row_title_11.getCell(j).border = {
    //                                                             top: {style:'thin', color: {argb:'A6A6A6'}},
    //                                                             left: {style:'thin', color: {argb:'A6A6A6'}},
    //                                                             bottom: {style:'thin', color: {argb:'A6A6A6'}},
    //                                                             right: {style:'thin', color: {argb:'A6A6A6'}}
    //                                                         };
    //                         }
                            
    //                     }
                       
    //                     //-------Fill Data----------------  
    //                     pos_title = pos_title + 1 ; 
    //                     var _bookccy = item.P_BOOK_CCY;  
    //                     var _formatAmt = (_bookccy=='VND'?'_(* #,##0_);_(* (#,##0);_(* "-"_);_(@_)':'_(* #,##0.00_);_(* (#,##0.00);_(* "-"_);_(@_)');
    //                     var row_item = worksheet.getRow(pos_title);
    //                     row_item.getCell(1).value   = dt_Partner[i].TR_DATE;
    //                     row_item.getCell(2).value   = dt_Partner[i].VOUCHERNO;    
    //                     row_item.getCell(3).value   = dt_Partner[i].TR_DATE;  
    //                     row_item.getCell(4).value   = dt_Partner[i].REMARK2; 
    //                     row_item.getCell(5).value   = dt_Partner[i].REMARK; 
    //                     row_item.getCell(6).value   = dt_Partner[i].ACCT_CODE; 
    //                     row_item.getCell(7).value   = dt_Partner[i].CORR_AC;  

    //                     row_item.getCell(8).value   = dt_Partner[i].DR_AMT; 
    //                     row_item.getCell(9).value   = dt_Partner[i].CR_AMT; 
    //                     row_item.getCell(10).value  = Number(dt_Partner[i].CLOSINGBALANCE); 
    //                     row_item.getCell(8).numFmt  = _formatAmt;
    //                     worksheet.getCell(pos_title,8).alignment = { vertical: 'middle', horizontal: 'right' };
    //                     row_item.getCell(9).numFmt  = _formatAmt;
    //                     worksheet.getCell(pos_title,9).alignment = { vertical: 'middle', horizontal: 'right' };
    //                     row_item.getCell(10).numFmt = _formatAmt;
    //                     worksheet.getCell(pos_title,10).alignment = { vertical: 'middle', horizontal: 'right' };
                            
    //                     row_item.getCell(11).value   = dt_Partner[i].TAC_HGTRH_PK;
    //                     row_item.getCell(12).value   = dt_Partner[i].SERIAL_NO;
    //                     row_item.getCell(13).value   = dt_Partner[i].INVOICE_NO;
    //                     row_item.getCell(14).value   = dt_Partner[i].INVOICE_DATE;
    //                     row_item.getCell(15).value   = dt_Partner[i].DUE_DATE;
    //                     row_item.getCell(16).value   = dt_Partner[i].C_INVOICE_NO;
    //                     row_item.getCell(17).value   = dt_Partner[i].C_INVOICE_DATE;
    //                     for(let j = 1; j<=17; j++)
    //                     {
    //                         row_item.getCell(j).border = {
    //                                                         top: {style:'thin', color: {argb:'A6A6A6'}},
    //                                                         left: {style:'thin', color: {argb:'A6A6A6'}},
    //                                                         bottom: {style:'thin', color: {argb:'A6A6A6'}},
    //                                                         right: {style:'thin', color: {argb:'A6A6A6'}}
    //                                                     }; 
    //                          row_item.getCell(j).font  = { italic: false, bold: false, size:10, name: 'Times New Roman', color: {argb:'000000'} };                            
    //                     }
    //                     if(dt_Partner[i].ORD == 'O' || dt_Partner[i].ORD == 'T'|| dt_Partner[i].ORD == 'E')
    //                     {
                            
    //                         row_item.getCell(5).font  = { italic: false, bold: true, size:10, name: 'Times New Roman', color: {argb:'000000'} };
    //                         worksheet.getCell(pos_title,5).alignment = { vertical: 'middle', horizontal: 'center' };
    //                         row_item.getCell(8).font  = { italic: false, bold: true, size:10, name: 'Times New Roman', color: {argb:'000000'} };
    //                         row_item.getCell(9).font  = { italic: false, bold: true, size:10, name: 'Times New Roman',color: {argb:'000000'} };
    //                         row_item.getCell(10).font = { italic: false, bold: true, size:10, name: 'Times New Roman',color: {argb:'000000'} };
    //                     }
    //                     if(dt_Partner[i].ORD === 'E'){
    //                         pos_title = pos_title + 3;
    //                         row_title = worksheet.getRow(pos_title);
    //                         row_title.getCell(8).value = dt_Title[0].DATE_I20; // date month year
    //                         row_title.getCell(8).alignment = { vertical: 'middle', horizontal: 'center' };
    //                         worksheet.mergeCells(pos_title,8, pos_title,10);// 
    //                         pos_title = pos_title + 1;
    //                         row_title = worksheet.getRow(pos_title);
    //                         row_title.getCell(1).value = dt_Title[0].EV_A21; // Prepared by
    //                         row_title.getCell(1).font  = { italic: false, bold: true, color: {argb:'000000'}, size:10, name: 'Times New Roman'};
    //                         worksheet.mergeCells(pos_title,1, pos_title,2);// 
    //                         row_title.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
    //                         row_title.getCell(5).value = dt_Title[0].EV_E21; // Chief Account
    //                         row_title.getCell(5).font  = { italic: false, bold: true, color: {argb:'000000'}, size:10, name: 'Times New Roman'};
    //                         row_title.getCell(5).alignment = { vertical: 'middle', horizontal: 'center' };
    //                         row_title.getCell(8).value = dt_Title[0].EV_I21; // General Director
    //                         row_title.getCell(8).font  = { italic: false, bold: true, color: {argb:'000000'}, size:10, name: 'Times New Roman'};
    //                         worksheet.mergeCells(pos_title,8, pos_title,10);// 
    //                         row_title.getCell(8).alignment = { vertical: 'middle', horizontal: 'center' };
    //                         // sign,fullname  
    //                         pos_title =    pos_title + 1;
    //                         row_title = worksheet.getRow(pos_title);
    //                         row_title.getCell(1).value = dt_Title[0].EV_SIG_A21; // Prepared by
    //                         row_title.getCell(1).font  = { italic: true, bold: false, color: {argb:'000000'}, size:10,name: 'Times New Roman'};
    //                         worksheet.mergeCells(pos_title,1, pos_title,2);// 
    //                         row_title.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
    //                         row_title.getCell(5).value = dt_Title[0].EV_SIG_E21; // Chief Account
    //                         row_title.getCell(5).font  = { italic: true, bold: false, color: {argb:'000000'}, size:10,name: 'Times New Roman'};
    //                         row_title.getCell(5).alignment = { vertical: 'middle', horizontal: 'center' };
    //                         row_title.getCell(8).value = dt_Title[0].EV_SIG_I21; // General Director
    //                         row_title.getCell(8).font  = { italic: true, bold: false, color: {argb:'000000'}, size:10,name: 'Times New Roman'};
    //                         worksheet.mergeCells(pos_title,8, pos_title,10);// 
    //                         row_title.getCell(8).alignment = { vertical: 'middle', horizontal: 'center' };
    //                     }
    //             }  
    //             //worksheet.removeWorksheet(1);
    //             /********* Print file excel ********/
    //             const reportFile    = Helpers.tmpPath(file_new);
    //             await workbook.xlsx.writeFile(reportFile)
    //             return response.attachment( reportFile, file_new);
    //         }
    //     } 
    //     catch (e) 
    //     {
    //         Utils.Logger({ LVL: "error", MODULE: "Report", FUNC: "rpt_6045040_CTTT_NMNB_2_SHEET", CONTENT: e.message })
    //        // return response.send(Utils.response(false, e.message, null))
    //        return response.send(null);
    //     }
    // }  
    /*********************************************************************************************/
    async rpt_6045040_SCTTT_NMNT_2 ({ request, response, auth }) {
        try 
        { 
            /* P_RPT_ID: report_info.VAL1, P_RPT_URL: report_info.VAL2, P_RPT_FILE: report_info.VAL3,
                P_COMP_ID: company_info.PARTNER_ID, P_COMP_NM: company_info.TEXT, P_COMP_TAX: company_info.TAX_CODE, P_COMP_ADD: company_info.ADDR1,
                P_COMPANY: this.selectedCompany, P_FR_DATE: this.from_date, P_FR_TO: this.to_date,P_ACC_PK: this.txtAccountPK, P_ACC_CD: this.txtAccountName,P_PARTNER_PK: this.txtPartnerPK,
                P_CCY: this.selectedCurrency, P_STATUS: this.selectedStatus, P_BOOK_CCY: this.txtBookCCY, P_CIRCULARS: this.selectedCirculars 
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
            var _store          = "AC_RPT_6045040_ACC_BY_PARTNER2";
            var _store_title    = "AC_RPT_6045040_TITLE_2";
            var _param          = [item.P_COMPANY, item.P_FR_DATE, item.P_FR_TO, item.P_ACC_PK, item.P_PARTNER_PK, item.P_STATUS, item.P_TCO_BUSPLACE_PK, item.P_LANG];
            
            /***************************** Return failded ****************************/
            if (!user) 
            {
                return response.send(Utils.response(false, "Request failed!", null));
            } 
            /****************************** Begin call store and write excell *********/
            else 
                /********* Call store infomation tltle ***************/ 
                var _param_title    = [item.P_COMPANY, item.P_FR_DATE, item.P_FR_TO, '' , item.P_ACC_PK, item.P_BOOK_CCY, item.P_LANG, item.P_TCO_BUSPLACE_PK];
                var dt_Title  = await DBService.callProcCursor(_store_title, _param_title , p_language , p_crt_by); 
                /********* Read file excel ********/ 
                const templateFile  = Helpers.resourcesPath(_resourcesPath); 
                await workbook.xlsx.readFile(templateFile);
                var worksheet       = workbook.getWorksheet(1);
                /********* Write file excel ********/
                    /********* Call partner store  ***************/ 
                var dt_Partner  = await DBService.callProcCursor(_store, _param , p_language , p_crt_by); 
                var partner_id = "";
                var pos_title = 0;
                var _lang = item.P_LANG;
                var partner_info = "";
                if (dt_Partner.length>0) 
                {
                    for (var i = 0; i < dt_Partner.length; i++) 
                    {
                        dt_Partner = dt_Partner;
                        //partner_pk = dt_Partner[i].PK;
                       // cr_openning = 0;
                        pos_title = pos_title ;
                        
                        // Width
                        worksheet.getColumn(1).width = 10; // date
                        worksheet.getColumn(2).width = 13; // voucher no
                        worksheet.getColumn(3).width = 13; // voucher date
                        worksheet.getColumn(4).width = 40; // local desrciption
                        worksheet.getColumn(5).width = 40; // Desrciption
                        worksheet.getColumn(6).width = 10.29; // Account code
                        worksheet.getColumn(7).width = 12.43; // Discounted period
                        worksheet.getColumn(8).width = 17; // Debit trans
                        worksheet.getColumn(9).width = 17; // Credit trans
                        worksheet.getColumn(10).width = 17; // Debit books
                        worksheet.getColumn(11).width = 17; // Credit books
                        worksheet.getColumn(12).width = 19; // Trans Balance
                        worksheet.getColumn(13).width = 19; // Books Balance
                        worksheet.getColumn(14).width = 8.43;//remark
                        if( dt_Partner[i].PARTNER_INFO != partner_info || i == 0)
                        {
                            partner_info = dt_Partner[i].PARTNER_INFO;
                      
                            //INFOMATION COMPANY
                            if(i>0) {

                                pos_title =    pos_title + 3;
                                //sign
                                row_title = worksheet.getRow(pos_title);
                                row_title.getCell(9).value = dt_Title[0].DATE_I20; // date month year
                                worksheet.mergeCells(pos_title,9, pos_title,11);// 
                                row_title.getCell(9).alignment = { vertical: 'middle', horizontal: 'center' };
                                pos_title =    pos_title + 1;
                                row_title = worksheet.getRow(pos_title);
                                row_title.getCell(1).value = dt_Title[0].EV_A21; // Prepared by
                                row_title.getCell(1).font  = { italic: false, bold: true, color: {argb:'000000'}, size:10, name: 'Times New Roman'};
                                worksheet.mergeCells(pos_title,1, pos_title,2);// 
                                row_title.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
                                row_title.getCell(5).value = dt_Title[0].EV_E21; // Chief Account
                                row_title.getCell(5).font  = { italic: false, bold: true, color: {argb:'000000'}, size:10, name: 'Times New Roman'};
                                row_title.getCell(5).alignment = { vertical: 'middle', horizontal: 'center' };
                                row_title.getCell(9).value = dt_Title[0].EV_I21; // General Director
                                row_title.getCell(9).font  = { italic: false, bold: true, color: {argb:'000000'}, size:10, name: 'Times New Roman'};
                                worksheet.mergeCells(pos_title,9, pos_title,11);// 
                                row_title.getCell(9).alignment = { vertical: 'middle', horizontal: 'center' };
                                // sign,fullname  
                                pos_title =    pos_title + 1;
                                row_title = worksheet.getRow(pos_title);
                                row_title.getCell(1).value = dt_Title[0].EV_SIG_A21; // Prepared by
                                row_title.getCell(1).font  = { italic: true, bold: false, color: {argb:'000000'},size:10, name: 'Times New Roman'};
                                worksheet.mergeCells(pos_title,1, pos_title,2);// 
                                row_title.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
                                row_title.getCell(5).value = dt_Title[0].EV_SIG_E21; // Chief Account
                                row_title.getCell(5).font  = { italic: true, bold: false, color: {argb:'000000'},size:10, name: 'Times New Roman'};
                                row_title.getCell(5).alignment = { vertical: 'middle', horizontal: 'center' };
                                row_title.getCell(9).value = dt_Title[0].EV_SIG_I21; // General Director
                                row_title.getCell(9).font  = { italic: true, bold: false, color: {argb:'000000'},size:10, name: 'Times New Roman'};
                                worksheet.mergeCells(pos_title,9, pos_title,11);// 
                                row_title.getCell(9).alignment = { vertical: 'middle', horizontal: 'center' };
                                pos_title = pos_title + 5;

                            }

                            pos_title = pos_title + 1;
                            var row_title = worksheet.getRow(pos_title);
                            // Info
                            row_title.getCell(1).value = dt_Title[0].BIZ_NM_A1; // biz name
                            row_title.getCell(10).value = dt_Title[0].MS_H1; // Mẫu số 31a 
                            worksheet.mergeCells(pos_title,10, pos_title,12);// merge MS
                            row_title.getCell(10).font  = { italic: false, bold: true, color: {argb:'000000'}, name: 'Times New Roman'};
                            row_title.getCell(10).alignment = { vertical: 'middle', horizontal: 'center' };
                            pos_title = pos_title + 1;
                            row_title = worksheet.getRow(pos_title);
                            row_title.getCell(1).value = dt_Title[0].BIZ_TAX_A2; // biz tax code
                            row_title.getCell(10).value = dt_Title[0].EV_H2; // Thong tu
                            worksheet.mergeCells(pos_title,10, pos_title,12);// Thong tu
                            pos_title = pos_title + 1;
                            row_title = worksheet.getRow(pos_title);
                            row_title.getCell(1).value = dt_Title[0].BIZ_ADD_A3; // Address
                            row_title.getCell(10).value = dt_Title[0].EV_H3; // Thong tu
                            worksheet.mergeCells(pos_title,10, pos_title,12);// Thong tu
                            pos_title = pos_title + 1;
                            row_title = worksheet.getRow(pos_title);
                            row_title.getCell(1).value = dt_Title[0].TITLE_A4; // Title
                            row_title.getCell(1).font  = { italic: false, bold: true, color: {argb:'000000'}, size:18, name: 'Times New Roman'};
                            row_title.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
                            worksheet.mergeCells(pos_title,1, pos_title,14);// Title
                            row_title.height = 30; 
                            pos_title = pos_title + 1;
                            row_title = worksheet.getRow(pos_title);
                            row_title.getCell(1).value = dt_Title[0].DATE_TOFRM_A5; // from date - todate
                            row_title.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
                            worksheet.mergeCells(pos_title,1, pos_title,14);// from date - todate
                            pos_title = pos_title + 1;
                            row_title = worksheet.getRow(pos_title);
                            row_title.getCell(1).value = dt_Title[0].AC_CD_A6; // account
                            row_title.getCell(1).font  = { italic: false, bold: true, color: {argb:'000000'},size:10, name: 'Times New Roman'};
                            pos_title = pos_title + 1;
                            row_title = worksheet.getRow(pos_title);
                            row_title.getCell(1).value = _lang == 'VIE' ? 'Đối tượng :' + partner_info : 'Object :' + partner_info; // partner id
                            row_title.getCell(1).font  = { italic: false, bold: true, color: {argb:'000000'},size:10, name: 'Times New Roman'};
                            pos_title = pos_title + 2;
                            row_title = worksheet.getRow(pos_title);
                            row_title.getCell(12).value = dt_Title[0].DVT_L10; // unit
                            row_title.getCell(12).font  = { italic: false, bold: true, color: {argb:'000000'},size:10, name: 'Times New Roman'};

                            //bảng
                            
                            pos_title = pos_title + 1;
                            row_title = worksheet.getRow(pos_title);
                            pos_title = pos_title + 1;
                            var row_title_11 = worksheet.getRow(pos_title);
                            pos_title = pos_title + 1;
                            var row_title_12 = worksheet.getRow(pos_title);

                            row_title.getCell(1).value      = dt_Title[0].A10_12; // date - ngày tháng năm row 10-12
                            worksheet.mergeCells(pos_title-2,1,pos_title,1); //date - ngày tháng năm row 10-12 
                            row_title.getCell(2).value      = dt_Title[0].BC10_12; // voucher
                            worksheet.mergeCells(pos_title-2,2,pos_title-1,3); //voucher row 10-11
                            row_title_12.getCell(2).value   = dt_Title[0].B12; // No
                            row_title_12.getCell(3).value   = dt_Title[0].C12; // voucher
                            row_title.getCell(4).value      = dt_Title[0].D10_12; //Local Description 
                            worksheet.mergeCells(pos_title-2,4,pos_title,4); //local description row 10-12
                            row_title.getCell(5).value      = dt_Title[0].E10_12; // Description
                            worksheet.mergeCells(pos_title-2,5,pos_title,5); // description row 10-12
                            row_title.getCell(6).value      = dt_Title[0].F10_12; // Account
                            worksheet.mergeCells(pos_title-2,6,pos_title,6); // account row 10-12
                            row_title.getCell(7).value      = dt_Title[0].G10_12; //Discounted period
                            worksheet.mergeCells(pos_title-2,7,pos_title,7); // Số hiệu 10-12

                            row_title.getCell(8).value      = dt_Title[0].HK10_12;//Incurred
                            worksheet.mergeCells(pos_title-2,8,pos_title-2,11); // số phát sinh row 10-10
                            row_title_11.getCell(8).value   = dt_Title[0].HJ11; // Debit 
                            row_title_11.getCell(9).value   = dt_Title[0].IK11; // Credit 
                            row_title_11.getCell(10).value  = dt_Title[0].HJ11; // Debit 
                            row_title_11.getCell(11).value  = dt_Title[0].IK11; // Credit
                            row_title_12.getCell(8).value   = dt_Title[0].HI12; // Debit Trans
                            row_title_12.getCell(9).value   = dt_Title[0].HI12; // Credit Trans
                            row_title_12.getCell(10).value  = dt_Title[0].JK12; // Debit Books
                            row_title_12.getCell(11).value  = dt_Title[0].JK12; // Credit Books
                            
                            row_title.getCell(12).value     = dt_Title[0].LM10_11; //balance 
                            worksheet.mergeCells(pos_title-2,12,pos_title-1,13); //Balance row 10-11
                            row_title_12.getCell(12).value     = dt_Title[0].L12; //balance 
                            row_title_12.getCell(13).value     = dt_Title[0].M12; //balance 

                            row_title.getCell(14).value     = dt_Title[0].N10_11; // remark
                            worksheet.mergeCells(pos_title-2,14,pos_title-1,14); //remark  row 10-11
                            row_title_12.getCell(14).value  = dt_Title[0].N12; // seq
    
                            for(let j = 1; j<=14; j++)
                            {
                                row_title.getCell(j).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "D9D9D9" } };
                                row_title.getCell(j).alignment = { vertical: 'middle', horizontal: 'center' };
                                row_title.getCell(j).font      = { italic: false, bold: true, color: {argb:'000000'}, size:10, name: 'Times New Roman'};
                                row_title.getCell(j).border = {
                                                                top: {style:'thin', color: {argb:'A6A6A6'}},
                                                                left: {style:'thin', color: {argb:'A6A6A6'}},
                                                                bottom: {style:'thin', color: {argb:'A6A6A6'}},
                                                                right: {style:'thin', color: {argb:'A6A6A6'}}
                                                            }; 
                                                            
                                row_title_11.getCell(j).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "D9D9D9" } };
                                row_title_11.getCell(j).font = { italic: false, bold: true, color: {argb:'000000'}, size:10, name: 'Times New Roman'};
                                row_title_11.getCell(j).alignment = { vertical: 'middle', horizontal: 'center' };
                                row_title_11.getCell(j).border = {
                                                                top: {style:'thin', color: {argb:'A6A6A6'}},
                                                                left: {style:'thin', color: {argb:'A6A6A6'}},
                                                                bottom: {style:'thin', color: {argb:'A6A6A6'}},
                                                                right: {style:'thin', color: {argb:'A6A6A6'}}
                                                            };
                                row_title_12.getCell(j).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "D9D9D9" } };
                                row_title_12.getCell(j).font = { italic: false, bold: true, color: {argb:'000000'}, size:10, name: 'Times New Roman'};
                                row_title_12.getCell(j).alignment = { vertical: 'middle', horizontal: 'center' };
                                row_title_12.getCell(j).border = {
                                                                top: {style:'thin', color: {argb:'A6A6A6'}},
                                                                left: {style:'thin', color: {argb:'A6A6A6'}},
                                                                bottom: {style:'thin', color: {argb:'A6A6A6'}},
                                                                right: {style:'thin', color: {argb:'A6A6A6'}}
                                                            };                        
                            }
                            
                        }
                       
                        //-------Fill Data----------------  
                        pos_title = pos_title + 1 ; 
                        var _bookccy = item.P_BOOK_CCY;  
                        var _format_0 = '_(* #,##0_);_(* (#,##0);_(* "-"_);_(@_)';
                        var _format_2 = '_(* #,##0.00_);_(* (#,##0.00);_(* "-"_);_(@_)';
                        var row_item = worksheet.getRow(pos_title);
                        row_item.getCell(1).value   = dt_Partner[i].TR_DATE;
                        row_item.getCell(2).value   = dt_Partner[i].VOUCHERNO;    
                        row_item.getCell(3).value   = dt_Partner[i].TR_DATE;  
                        row_item.getCell(4).value   = dt_Partner[i].REMARK2; 
                        row_item.getCell(5).value   = dt_Partner[i].REMARK; 
                        row_item.getCell(6).value   = dt_Partner[i].ACCT_CODE; 
                        row_item.getCell(7).value   = "";  
                        
                        row_item.getCell(8).value   =  dt_Partner[i].DR_FAMT;
                        row_item.getCell(8).numFmt  = _format_2;//dt_Partner[i].DR_FAMT == 0 || dt_Partner[i].DR_FAMT == null ? null : '###,###,###,###.00'; 
                        worksheet.getCell(pos_title,8).alignment = { vertical: 'middle', horizontal: 'right' };
                        row_item.getCell(9).value   = dt_Partner[i].CR_FAMT;
                        row_item.getCell(9).numFmt  = _format_2; 
                        worksheet.getCell(pos_title,9).alignment = { vertical: 'middle', horizontal: 'right' };
                        row_item.getCell(10).value  =  dt_Partner[i].DR_AMT;
                        row_item.getCell(10).numFmt = _format_0; 
                        worksheet.getCell(pos_title,10).alignment = { vertical: 'middle', horizontal: 'right' };
                        row_item.getCell(11).value  =  dt_Partner[i].CR_AMT;
                        row_item.getCell(11).numFmt = _format_0; 
                        worksheet.getCell(pos_title,11).alignment = { vertical: 'middle', horizontal: 'right' };
                        row_item.getCell(12).value  = Number(dt_Partner[i].FCLOSINGBALANCE); 
                        row_item.getCell(12).numFmt = _format_2; 
                        worksheet.getCell(pos_title,12).alignment = { vertical: 'middle', horizontal: 'right' };
                        row_item.getCell(13).value  = Number(dt_Partner[i].CLOSINGBALANCE); 
                        row_item.getCell(13).numFmt =  _format_0; 
                        worksheet.getCell(pos_title,13).alignment = { vertical: 'middle', horizontal: 'right' };
                        row_item.getCell(14).value  = dt_Partner[i].TAC_HGTRH_PK;
                        
                        for(let j = 1; j<=14; j++)
                        {
                            row_item.getCell(j).border = {
                                                            top: {style:'thin', color: {argb:'A6A6A6'}},
                                                            left: {style:'thin', color: {argb:'A6A6A6'}},
                                                            bottom: {style:'thin', color: {argb:'A6A6A6'}},
                                                            right: {style:'thin', color: {argb:'A6A6A6'}}
                                                        }; 
                             row_item.getCell(j).font  = { italic: false, bold: false, size:10, name: 'Times New Roman', color: {argb:'000000'} };                            
                        }
                        if(dt_Partner[i].ORD == 'O' || dt_Partner[i].ORD == 'T'|| dt_Partner[i].ORD == 'E')
                        {
                            
                            row_item.getCell(5).font  = { italic: false, bold: true, size:10, name: 'Times New Roman', color: {argb:'000000'} };
                            worksheet.getCell(pos_title,5).alignment = { vertical: 'middle', horizontal: 'center' };
                            row_item.getCell(8).font  = { italic: false, bold: true, size:10, name: 'Times New Roman', color: {argb:'000000'} };
                            row_item.getCell(9).font  = { italic: false, bold: true, size:10, name: 'Times New Roman',color: {argb:'000000'} };
                            row_item.getCell(10).font = { italic: false, bold: true, size:10, name: 'Times New Roman',color: {argb:'000000'} };
                            row_item.getCell(11).font  = { italic: false, bold: true, size:10, name: 'Times New Roman',color: {argb:'000000'} };
                            row_item.getCell(12).font = { italic: false, bold: true, size:10, name: 'Times New Roman',color: {argb:'000000'} };
                            row_item.getCell(13).font = { italic: false, bold: true, size:10, name: 'Times New Roman',color: {argb:'000000'} };
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
            Utils.Logger({ LVL: "error", MODULE: "Report", FUNC: "rpt_6045040_SCTTT_NMNT_2", CONTENT: e.message })
            // return response.send(Utils.response(false, e.message, null))
            return response.send(null);
        }
    }  
    async rpt_6045040_SCTTT_NMNT_2_SHEET ({ request, response, auth }) {
        try 
        { 
            /* P_RPT_ID: report_info.VAL1, P_RPT_URL: report_info.VAL2, P_RPT_FILE: report_info.VAL3,
                P_COMP_ID: company_info.PARTNER_ID, P_COMP_NM: company_info.TEXT, P_COMP_TAX: company_info.TAX_CODE, P_COMP_ADD: company_info.ADDR1,
                P_COMPANY: this.selectedCompany, P_FR_DATE: this.from_date, P_FR_TO: this.to_date,P_ACC_PK: this.txtAccountPK, P_ACC_CD: this.txtAccountName,P_PARTNER_PK: this.txtPartnerPK,
                P_CCY: this.selectedCurrency, P_STATUS: this.selectedStatus, P_BOOK_CCY: this.txtBookCCY, P_CIRCULARS: this.selectedCirculars 
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
            var _store          = "AC_RPT_6045040_ACC_BY_PARTNER2";
            var _store_title    = "AC_RPT_6045040_TITLE_2";
            var _param          = [item.P_COMPANY, item.P_FR_DATE, item.P_FR_TO, item.P_ACC_PK, item.P_PARTNER_PK, item.P_STATUS, item.P_TCO_BUSPLACE_PK, item.P_LANG];
            
            /***************************** Return failded ****************************/
            if (!user) 
            {
                return response.send(Utils.response(false, "Request failed!", null));
            } 
            /****************************** Begin call store and write excell *********/
            else 
                /********* Call store infomation tltle ***************/ 
                var _param_title    = [item.P_COMPANY, item.P_FR_DATE, item.P_FR_TO, '' , item.P_ACC_PK, item.P_BOOK_CCY, item.P_LANG, item.P_TCO_BUSPLACE_PK];
                var dt_Title  = await DBService.callProcCursor(_store_title, _param_title , p_language , p_crt_by); 
                /********* Read file excel ********/ 
                const templateFile  = Helpers.resourcesPath(_resourcesPath); 
                await workbook.xlsx.readFile(templateFile);
                var worksheet       = workbook.getWorksheet(1);
                /********* Write file excel ********/
                    /********* Call partner store  ***************/ 
                var dt_Partner  = await DBService.callProcCursor(_store, _param , p_language , p_crt_by); 
                var partner_id = "";
                var pos_title = 0;
                var _lang = item.P_LANG;
                var partner_info = "";
                if (dt_Partner.length>0) 
                {
                    for (var i = 0; i < dt_Partner.length; i++) 
                    {
                        dt_Partner = dt_Partner;
                        if( dt_Partner[i].PARTNER_INFO != partner_info || i == 0)
                        {
                            partner_info = dt_Partner[i].PARTNER_INFO;
                            partner_id = dt_Partner[i].PARTNER_ID;
                            if(i>0){
                                worksheet   = workbook.addWorksheet(); 
                            }
                            worksheet.name = partner_id; 
                        
                            // Width
                            worksheet.getColumn(1).width = 10; // date
                            worksheet.getColumn(2).width = 13; // voucher no
                            worksheet.getColumn(3).width = 13; // voucher date
                            worksheet.getColumn(4).width = 40; // local desrciption
                            worksheet.getColumn(5).width = 40; // Desrciption
                            worksheet.getColumn(6).width = 10.29; // Account code
                            worksheet.getColumn(7).width = 12.43; // Discounted period
                            worksheet.getColumn(8).width = 17; // Debit trans
                            worksheet.getColumn(9).width = 17; // Credit trans
                            worksheet.getColumn(10).width = 17; // Debit books
                            worksheet.getColumn(11).width = 17; // Credit books
                            worksheet.getColumn(12).width = 19; // Trans Balance
                            worksheet.getColumn(13).width = 19; // Books Balance
                            worksheet.getColumn(14).width = 8.43;//remark
							pos_title = 0;
                            //INFOMATION COMPANY
                            pos_title = pos_title + 1;
                            //sign
                            var row_title = worksheet.getRow(pos_title);
                            // Info
                            row_title.getCell(1).value = dt_Title[0].BIZ_NM_A1; // biz name
                            row_title.getCell(10).value = dt_Title[0].MS_H1; // Mẫu số 31a 
                            worksheet.mergeCells(pos_title,10, pos_title,12);// merge MS
                            row_title.getCell(10).font  = { italic: false, bold: true, color: {argb:'000000'}, name: 'Times New Roman'};
                            row_title.getCell(10).alignment = { vertical: 'middle', horizontal: 'center' };
                            pos_title = pos_title + 1;
                            row_title = worksheet.getRow(pos_title);
                            row_title.getCell(1).value = dt_Title[0].BIZ_TAX_A2; // biz tax code
                            row_title.getCell(10).value = dt_Title[0].EV_H2; // Thong tu
                            worksheet.mergeCells(pos_title,10, pos_title,12);// Thong tu
                            pos_title = pos_title + 1;
                            row_title = worksheet.getRow(pos_title);
                            row_title.getCell(1).value = dt_Title[0].BIZ_ADD_A3; // Address
                            row_title.getCell(10).value = dt_Title[0].EV_H3; // Thong tu
                            worksheet.mergeCells(pos_title,10, pos_title,12);// Thong tu
                            pos_title = pos_title + 1;
                            row_title = worksheet.getRow(pos_title);
                            row_title.getCell(1).value = dt_Title[0].TITLE_A4; // Title
                            row_title.getCell(1).font  = { italic: false, bold: true, color: {argb:'000000'}, size:18, name: 'Times New Roman'};
                            row_title.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
                            worksheet.mergeCells(pos_title,1, pos_title,14);// Title
                            row_title.height = 30; 
                            pos_title = pos_title + 1;
                            row_title = worksheet.getRow(pos_title);
                            row_title.getCell(1).value = dt_Title[0].DATE_TOFRM_A5; // from date - todate
                            row_title.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
                            worksheet.mergeCells(pos_title,1, pos_title,14);// from date - todate
                            pos_title = pos_title + 1;
                            row_title = worksheet.getRow(pos_title);
                            row_title.getCell(1).value = dt_Title[0].AC_CD_A6; // account
                            row_title.getCell(1).font  = { italic: false, bold: true, color: {argb:'000000'},size:10, name: 'Times New Roman'};
                            pos_title = pos_title + 1;
                            row_title = worksheet.getRow(pos_title);
                            row_title.getCell(1).value = _lang == 'VIE' ? 'Đối tượng :' + partner_info : 'Object :' + partner_info; // partner id
                            row_title.getCell(1).font  = { italic: false, bold: true, color: {argb:'000000'},size:10, name: 'Times New Roman'};
                            pos_title = pos_title + 2;
                            row_title = worksheet.getRow(pos_title);
                            row_title.getCell(12).value = dt_Title[0].DVT_L10; // unit
                            row_title.getCell(12).font  = { italic: false, bold: true, color: {argb:'000000'},size:10, name: 'Times New Roman'};
                            row_title.getCell(12).alignment = { vertical: 'middle', horizontal: 'right' };

                            //bảng
                            pos_title = pos_title + 1;
                            row_title = worksheet.getRow(pos_title);
                            pos_title = pos_title + 1;
                            var row_title_11 = worksheet.getRow(pos_title);
                            pos_title = pos_title + 1;
                            var row_title_12 = worksheet.getRow(pos_title);

                            row_title.getCell(1).value      = dt_Title[0].A10_12; // date - ngày tháng năm row 10-12
                            worksheet.mergeCells(pos_title-2,1,pos_title,1); //date - ngày tháng năm row 10-12 
                            row_title.getCell(2).value      = dt_Title[0].BC10_12; // voucher
                            worksheet.mergeCells(pos_title-2,2,pos_title-1,3); //voucher row 10-11
                            row_title_12.getCell(2).value   = dt_Title[0].B12; // No
                            row_title_12.getCell(3).value   = dt_Title[0].C12; // voucher
                            row_title.getCell(4).value      = dt_Title[0].D10_12; //Local Description 
                            worksheet.mergeCells(pos_title-2,4,pos_title,4); //local description row 10-12
                            row_title.getCell(5).value      = dt_Title[0].E10_12; // Description
                            worksheet.mergeCells(pos_title-2,5,pos_title,5); // description row 10-12
                            row_title.getCell(6).value      = dt_Title[0].F10_12; // Account
                            worksheet.mergeCells(pos_title-2,6,pos_title,6); // account row 10-12
                            row_title.getCell(7).value      = dt_Title[0].G10_12; //Discounted period
                            worksheet.mergeCells(pos_title-2,7,pos_title,7); // Số hiệu 10-12

                            row_title.getCell(8).value      = dt_Title[0].HK10_12;//Incurred
                            worksheet.mergeCells(pos_title-2,8,pos_title-2,11); // số phát sinh row 10-10
                            row_title_11.getCell(8).value   = dt_Title[0].HJ11; // Debit 
                            row_title_11.getCell(9).value   = dt_Title[0].IK11; // Credit 
                            row_title_11.getCell(10).value  = dt_Title[0].HJ11; // Debit 
                            row_title_11.getCell(11).value  = dt_Title[0].IK11; // Credit
                            row_title_12.getCell(8).value   = dt_Title[0].HI12; // Debit Trans
                            row_title_12.getCell(9).value   = dt_Title[0].HI12; // Credit Trans
                            row_title_12.getCell(10).value  = dt_Title[0].JK12; // Debit Books
                            row_title_12.getCell(11).value  = dt_Title[0].JK12; // Credit Books
                            
                            row_title.getCell(12).value     = dt_Title[0].LM10_11; //balance 
                            worksheet.mergeCells(pos_title-2,12,pos_title-1,13); //Balance row 10-11
                            row_title_12.getCell(12).value     = dt_Title[0].L12; //balance 
                            row_title_12.getCell(13).value     = dt_Title[0].M12; //balance 

                            row_title.getCell(14).value     = dt_Title[0].N10_11; // remark
                            worksheet.mergeCells(pos_title-2,14,pos_title-1,14); //remark  row 10-11
                            row_title_12.getCell(14).value  = dt_Title[0].N12; // seq
    
                            for(let j = 1; j<=14; j++)
                            {
                                row_title.getCell(j).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "D9D9D9" } };
                                row_title.getCell(j).alignment = { vertical: 'middle', horizontal: 'center' };
                                row_title.getCell(j).font      = { italic: false, bold: true, color: {argb:'000000'}, size:10, name: 'Times New Roman'};
                                row_title.getCell(j).border = {
                                                                top: {style:'thin', color: {argb:'A6A6A6'}},
                                                                left: {style:'thin', color: {argb:'A6A6A6'}},
                                                                bottom: {style:'thin', color: {argb:'A6A6A6'}},
                                                                right: {style:'thin', color: {argb:'A6A6A6'}}
                                                            }; 
                                                            
                                row_title_11.getCell(j).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "D9D9D9" } };
                                row_title_11.getCell(j).font = { italic: false, bold: true, color: {argb:'000000'}, size:10, name: 'Times New Roman'};
                                row_title_11.getCell(j).alignment = { vertical: 'middle', horizontal: 'center' };
                                row_title_11.getCell(j).border = {
                                                                top: {style:'thin', color: {argb:'A6A6A6'}},
                                                                left: {style:'thin', color: {argb:'A6A6A6'}},
                                                                bottom: {style:'thin', color: {argb:'A6A6A6'}},
                                                                right: {style:'thin', color: {argb:'A6A6A6'}}
                                                            };
                                row_title_12.getCell(j).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "D9D9D9" } };
                                row_title_12.getCell(j).font = { italic: false, bold: true, color: {argb:'000000'}, size:10, name: 'Times New Roman'};
                                row_title_12.getCell(j).alignment = { vertical: 'middle', horizontal: 'center' };
                                row_title_12.getCell(j).border = {
                                                                top: {style:'thin', color: {argb:'A6A6A6'}},
                                                                left: {style:'thin', color: {argb:'A6A6A6'}},
                                                                bottom: {style:'thin', color: {argb:'A6A6A6'}},
                                                                right: {style:'thin', color: {argb:'A6A6A6'}}
                                                            };                        
                            }
                            
                        }
                       
                        //-------Fill Data----------------  
                        pos_title = pos_title + 1 ; 
                        var _bookccy = item.P_BOOK_CCY;  
                        var _format_0 = '_(* #,##0_);_(* (#,##0);_(* "-"_);_(@_)';
                        var _format_2 = '_(* #,##0.00_);_(* (#,##0.00);_(* "-"_);_(@_)';
                        var row_item = worksheet.getRow(pos_title);
                        row_item.getCell(1).value   = dt_Partner[i].TR_DATE;
                        row_item.getCell(2).value   = dt_Partner[i].VOUCHERNO;    
                        row_item.getCell(3).value   = dt_Partner[i].TR_DATE;  
                        row_item.getCell(4).value   = dt_Partner[i].REMARK2; 
                        row_item.getCell(5).value   = dt_Partner[i].REMARK; 
                        row_item.getCell(6).value   = dt_Partner[i].ACCT_CODE; 
                        row_item.getCell(7).value   = "";  
                        
                        row_item.getCell(8).value   =  dt_Partner[i].DR_FAMT;
                        row_item.getCell(8).numFmt  = _format_2;
                        worksheet.getCell(pos_title,8).alignment = { vertical: 'middle', horizontal: 'right' };
                        row_item.getCell(9).value   = dt_Partner[i].CR_FAMT;
                        row_item.getCell(9).numFmt  = _format_2; 
                        worksheet.getCell(pos_title,9).alignment = { vertical: 'middle', horizontal: 'right' };
                        row_item.getCell(10).value  =  dt_Partner[i].DR_AMT;
                        row_item.getCell(10).numFmt =  _format_0; 
                        worksheet.getCell(pos_title,10).alignment = { vertical: 'middle', horizontal: 'right' };
                        row_item.getCell(11).value  =  dt_Partner[i].CR_AMT;
                        row_item.getCell(11).numFmt =  _format_0; 
                        worksheet.getCell(pos_title,11).alignment = { vertical: 'middle', horizontal: 'right' };
                        row_item.getCell(12).value  = Number(dt_Partner[i].FCLOSINGBALANCE); 
                        row_item.getCell(12).numFmt = _format_2; 
                        worksheet.getCell(pos_title,12).alignment = { vertical: 'middle', horizontal: 'right' };
                        row_item.getCell(13).value  = Number(dt_Partner[i].CLOSINGBALANCE); 
                        row_item.getCell(13).numFmt =  _format_0; 
                        worksheet.getCell(pos_title,13).alignment = { vertical: 'middle', horizontal: 'right' };
                        row_item.getCell(14).value  = dt_Partner[i].TAC_HGTRH_PK;
                        
                        for(let j = 1; j<=14; j++)
                        {
                            row_item.getCell(j).border = {
                                                            top: {style:'thin', color: {argb:'A6A6A6'}},
                                                            left: {style:'thin', color: {argb:'A6A6A6'}},
                                                            bottom: {style:'thin', color: {argb:'A6A6A6'}},
                                                            right: {style:'thin', color: {argb:'A6A6A6'}}
                                                        }; 
                             row_item.getCell(j).font  = { italic: false, bold: false, size:10, name: 'Times New Roman', color: {argb:'000000'} };                            
                        }
                        if(dt_Partner[i].ORD == 'O' || dt_Partner[i].ORD == 'T'|| dt_Partner[i].ORD == 'E')
                        {
                            
                            row_item.getCell(5).font  = { italic: false, bold: true, size:10, name: 'Times New Roman', color: {argb:'000000'} };
                            worksheet.getCell(pos_title,5).alignment = { vertical: 'middle', horizontal: 'center' };
                            row_item.getCell(8).font  = { italic: false, bold: true, size:10, name: 'Times New Roman', color: {argb:'000000'} };
                            row_item.getCell(9).font  = { italic: false, bold: true, size:10, name: 'Times New Roman',color: {argb:'000000'} };
                            row_item.getCell(10).font = { italic: false, bold: true, size:10, name: 'Times New Roman',color: {argb:'000000'} };
                            row_item.getCell(11).font = { italic: false, bold: true, size:10, name:'Times New Roman',color: {argb:'000000'} };
                            row_item.getCell(12).font = { italic: false, bold: true, size:10, name: 'Times New Roman',color: {argb:'000000'} };
                            row_item.getCell(13).font = { italic: false, bold: true, size:10, name: 'Times New Roman',color: {argb:'000000'} };
                        }
                        if(dt_Partner[i].ORD === 'E'){
                            pos_title = pos_title + 3;
                            row_title = worksheet.getRow(pos_title);
                            row_title.getCell(9).value = dt_Title[0].DATE_I20; // date month year
                            worksheet.mergeCells(pos_title,9, pos_title,11);// 
                            row_title.getCell(9).alignment = { vertical: 'middle', horizontal: 'center' };
                            pos_title =    pos_title + 1;
                            row_title = worksheet.getRow(pos_title);
                            row_title.getCell(1).value = dt_Title[0].EV_A21; // Prepared by
                            row_title.getCell(1).font  = { italic: false, bold: true, color: {argb:'000000'}, size:10, name: 'Times New Roman'};
                            worksheet.mergeCells(pos_title,1, pos_title,2);// 
                            row_title.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
                            row_title.getCell(5).value = dt_Title[0].EV_E21; // Chief Account
                            row_title.getCell(5).font  = { italic: false, bold: true, color: {argb:'000000'}, size:10, name: 'Times New Roman'};
                            row_title.getCell(5).alignment = { vertical: 'middle', horizontal: 'center' };
                            row_title.getCell(9).value = dt_Title[0].EV_I21; // General Director
                            row_title.getCell(9).font  = { italic: false, bold: true, color: {argb:'000000'}, size:10, name: 'Times New Roman'};
                            worksheet.mergeCells(pos_title,9, pos_title,11);// 
                            row_title.getCell(9).alignment = { vertical: 'middle', horizontal: 'center' };
                            // sign,fullname  
                            pos_title =    pos_title + 1;
                            row_title = worksheet.getRow(pos_title);
                            row_title.getCell(1).value = dt_Title[0].EV_SIG_A21; // Prepared by
                            row_title.getCell(1).font  = { italic: true, bold: false, color: {argb:'000000'},size:10, name: 'Times New Roman'};
                            worksheet.mergeCells(pos_title,1, pos_title,2);// 
                            row_title.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
                            row_title.getCell(5).value = dt_Title[0].EV_SIG_E21; // Chief Account
                            row_title.getCell(5).font  = { italic: true, bold: false, color: {argb:'000000'},size:10, name: 'Times New Roman'};
                            row_title.getCell(5).alignment = { vertical: 'middle', horizontal: 'center' };
                            row_title.getCell(9).value = dt_Title[0].EV_SIG_I21; // General Director
                            row_title.getCell(9).font  = { italic: true, bold: false, color: {argb:'000000'},size:10, name: 'Times New Roman'};
                            worksheet.mergeCells(pos_title,9, pos_title,11);// 
                            row_title.getCell(9).alignment = { vertical: 'middle', horizontal: 'center' };
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
            Utils.Logger({ LVL: "error", MODULE: "Report", FUNC: "rpt_6045040_SCTTT_NMNT_2_SHEET", CONTENT: e.message })
            // return response.send(Utils.response(false, e.message, null))
            return response.send(null);
        }
    }   
}

module.exports = rpt6045040; 