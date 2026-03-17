"use strict";
const Helpers       = use('Helpers')
const Antl          = use("Antl");
const Utils         = use("Utils");
const DBService = use("DBService")
var Excel           = use('exceljs');
var workbook        = new Excel.Workbook();
class rpt6045045 {
/*########################################################## Report JH ##################################################################################*/ 
    async rpt_6045045_Ledger_By_Partner_Tab1({ request, response, auth }) {
        try 
        { 
        /*P_RPT_ID: report_info.VAL1, P_RPT_FILE: report_info.VAL2,
            P_COMPANY: this.selectedCompany, P_FR_DATE: this.from_date, P_FR_TO: this.to_date, P_ACC_PK: this.TAC_ABACCTCODE_PK, 
                P_CUST_PK: this.TCO_BUSPARTNER_PK, P_STATUS: this.selectedStatus, P_PARTNER_TYPE: this.selectedPartnerType*/
            /****************************** Get Param *********************************/
            let { para }        = request.get(['para']);
            /********* Parse pram to json ********/
            var item            = JSON.parse(para); 
            const user          = await auth.getUser() ;
            var COMP_ID         = item.P_COMP_ID, COMP_NM = item.P_COMP_NM, COMP_TAX = item.P_COMP_TAX, COMP_ADD = item.P_COMP_ADD;
            var BIZ_ID         = item.P_BIZ_ID , BIZ_NM  = item.P_BIZ_NM , BIZ_TAX  = item.P_BIZ_TAX , BIZ_ADD  = item.P_BIZ_ADD;
            const p_crt_by      = user.USER_ID;
            const p_language    = request.header("accept-language", "ENG");
            var file_nm         = [item.P_RPT_FILE];
            var file_type       = ".xlsx";
            var full_nm         = file_nm + file_type;
            var file_new        = file_nm + p_crt_by + file_type;
            var _resourcesPath  = [item.P_RPT_URL]+'/'+full_nm;
            var _store          = "AC_RPT_6045045_LGB_TAB1";
            var _param          = [item.P_COMPANY, item.P_FR_DATE, item.P_FR_TO, item.P_ACC_CD, item.P_CUST_PK, item.P_STATUS, item.P_PARTNER_TYPE, item.P_TCO_BUSPLACE_PK];
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
            
                //INFOMATION COMPANY
                
                var FromDate = item.P_FR_DATE;
                var ToDate = item.P_FR_TO;
                var strFrDate = FromDate.substr(6,2) + "/"+ FromDate.substr(4,2)+ "/"+ FromDate.substr(0,4);
                var strToDate = ToDate.substr(6,2) + "/"+ ToDate.substr(4,2)+ "/"+ ToDate.substr(0,4);
                worksheet.getCell("B3").value = 'Company : ' + BIZ_NM;
                worksheet.getCell("B4").value = 'Accounting unit : ' + BIZ_NM;
                worksheet.getCell("G3").value = "Period : " + strFrDate + " ~ " + strToDate;
                worksheet.getCell("G4").value = 'Acct.title : ' + item.P_ACC_NM;
                worksheet.getCell("G5").value = 'All customers';
                var _bookccy = item.P_BOOK_CCY;  
                var pos = 8; 
                
                var _formatAmt = (_bookccy=='VND'?'_(* #,##0_);[Red]* (#,##0);_(* ""_);_(@_)':'_(* #,##0.00_);[Red]* (#,##0.00);_(* ""_);_(@_)');
                var _format_2 = '_(* #,##0.00_);[Red]* (#,##0.00);_(* ""_);_(@_)';
                //Insert row
                Utils.excelInsertRows(worksheet, pos-1, dt_Data.length);
                let total_opening       = 0,
                    total_dr_sum        = 0,
                    total_cr_sum        = 0,
                    total_bal_books     = 0,
                    total_opening_tr    = 0,
                    total_dr_sum_tr     = 0,
                    total_cr_sum_tr     = 0,
                    total_bal_trans     = 0;
                for (var i = 0; i < dt_Data.length; i++) 
                    {
                        var row_item = worksheet.getRow(pos);
                        row_item.getCell(2).value   = dt_Data[i].PARTNER_ID; 
                        row_item.getCell(3).value   = dt_Data[i].PARTNER_NAME;
                        row_item.getCell(4).value  = Number(dt_Data[i].OPENING_BAL); 
                        row_item.getCell(4).numFmt = _formatAmt;
                        row_item.getCell(5).value  = Number(dt_Data[i].DR_SUM); 
                        row_item.getCell(5).numFmt = _formatAmt;
                        row_item.getCell(6).value  = Number(dt_Data[i].CR_SUM); 
                        row_item.getCell(6).numFmt = _formatAmt;
                        row_item.getCell(7).value  = Number(dt_Data[i].BALANCE_BOOKS); 
                        row_item.getCell(7).numFmt = _formatAmt;
                        row_item.getCell(8).value  = Number(dt_Data[i].OPENING_BAL_TRANS); 
                        row_item.getCell(8).numFmt = _format_2; 
                        row_item.getCell(9).value  = Number(dt_Data[i].DR_SUM_TR); 
                        row_item.getCell(9).numFmt = _format_2; 
                        row_item.getCell(10).value  = Number(dt_Data[i].CR_SUM_TR); 
                        row_item.getCell(10).numFmt = _format_2;
                        row_item.getCell(11).value  = Number(dt_Data[i].BALANCE_TRANS); 
                        row_item.getCell(11).numFmt = _format_2; 
                        
                        total_opening    += Number(dt_Data[i].OPENING_BAL);
                        total_dr_sum     += Number(dt_Data[i].DR_SUM);
                        total_cr_sum     += Number(dt_Data[i].CR_SUM);
                        total_bal_books  += Number(dt_Data[i].BALANCE_BOOKS);
                        total_opening_tr += Number(dt_Data[i].OPENING_BAL_TRANS);
                        total_dr_sum_tr  += Number(dt_Data[i].DR_SUM_TR);
                        total_cr_sum_tr  += Number(dt_Data[i].CR_SUM_TR);
                        total_bal_trans  += Number(dt_Data[i].BALANCE_TRANS);
                        pos = pos + 1; 

                    }  
                    var row = worksheet.getRow(pos);
                    worksheet.mergeCells(pos,2,pos,3); 
                    row.getCell(4).value    = total_opening; 
                    row.getCell(4).numFmt   = _formatAmt;
                    row.getCell(5).value    = total_dr_sum; 
                    row.getCell(5).numFmt   = _formatAmt;
                    row.getCell(6).value    = total_cr_sum; 
                    row.getCell(6).numFmt   = _formatAmt;
                    row.getCell(7).value    = total_bal_books; 
                    row.getCell(7).numFmt   = _formatAmt;
                    row.getCell(8).value    = total_opening_tr; 
                    row.getCell(8).numFmt   = _format_2; 
                    row.getCell(9).value    = total_dr_sum_tr; 
                    row.getCell(9).numFmt   = _format_2; 
                    row.getCell(10).value   = total_cr_sum_tr; 
                    row.getCell(10).numFmt  = _format_2;
                    row.getCell(11).value   = total_bal_trans; 
                    row.getCell(11).numFmt  = _format_2; 

                    var _amtType = item.P_AMT_TYPE;
                    if(_amtType == 'book'){
                        worksheet.spliceColumns(8,4);
                        worksheet.mergeCells('B2', 'G2'); 
                    }
                    else{
                        worksheet.mergeCells('B2', 'K2'); 
                    }
                    /********* Print file excel ********/
                    const reportFile    = Helpers.tmpPath(file_new);
                    await workbook.xlsx.writeFile(reportFile)
                    return response.attachment( reportFile, file_new);
                }
        } 
        catch (e) 
        {
            Utils.Logger({ LVL: "error", MODULE: "Report", FUNC: "rpt_6045045_Ledger_By_Partner_Tab1", CONTENT: e.message })
        // return response.send(Utils.response(false, e.message, null))
        return response.send(null);
        }
    } 
    async rpt_6045045_Ledger_By_Partner({ request, response, auth }) {
        try 
        { 
        /*P_RPT_ID: report_info.VAL1, P_RPT_FILE: report_info.VAL2,
            P_COMPANY: this.selectedCompany, P_FR_DATE: this.from_date, P_FR_TO: this.to_date, P_ACC_PK: this.TAC_ABACCTCODE_PK, 
                P_CUST_PK: this.TCO_BUSPARTNER_PK, P_STATUS: this.selectedStatus, P_PARTNER_TYPE: this.selectedPartnerType*/
            /****************************** Get Param *********************************/
            let { para }        = request.get(['para']);
            /********* Parse pram to json ********/
            var item            = JSON.parse(para); 
            const user          = await auth.getUser() ;
            var COMP_ID         = item.P_COMP_ID, COMP_NM = item.P_COMP_NM, COMP_TAX = item.P_COMP_TAX, COMP_ADD = item.P_COMP_ADD;
            var BIZ_ID         = item.P_BIZ_ID , BIZ_NM  = item.P_BIZ_NM , BIZ_TAX  = item.P_BIZ_TAX , BIZ_ADD  = item.P_BIZ_ADD;
            const p_crt_by      = user.USER_ID;
            const p_language    = request.header("accept-language", "ENG");
            var file_nm         = [item.P_RPT_FILE];
            var file_type       = ".xlsx";
            var full_nm         = file_nm + file_type;
            var file_new        = file_nm + p_crt_by + file_type;
            var _resourcesPath  = [item.P_RPT_URL]+'/'+full_nm;
            var _store          = "AC_RPT_6045045_LEDGER_BAL";
            var _param          = [item.P_COMPANY, item.P_FR_DATE, item.P_FR_TO, item.P_ACC_CD, item.P_CUST_PK, item.P_STATUS, item.P_CCY, item.P_PARTNER_TYPE, item.P_TCO_BUSPLACE_PK, item.P_OPTIONCRDR];
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
            
                //INFOMATION COMPANY
                
                var FromDate = item.P_FR_DATE;
                var ToDate = item.P_FR_TO;
                var strFrDate = FromDate.substr(6,2) + "/"+ FromDate.substr(4,2)+ "/"+ FromDate.substr(0,4);
                var strToDate = ToDate.substr(6,2) + "/"+ ToDate.substr(4,2)+ "/"+ ToDate.substr(0,4);
                worksheet.getCell("B4").value = 'Company : ' + BIZ_NM;
                worksheet.getCell("B5").value = 'Accounting unit : ' + BIZ_NM;
                worksheet.getCell("B3").value = "Period : " + strFrDate + " ~ " + strToDate;
                worksheet.getCell("H5").value = 'Acct.title : ' + item.P_ACC_NM;
                var _bookccy = item.P_BOOK_CCY;  
                var pos = 8; 
                
                var _formatAmt = (_bookccy=='VND'?'_(* #,##0_);[Red]* (#,##0);_(* ""_);_(@_)':'_(* #,##0.00_);[Red]* (#,##0.00);_(* ""_);_(@_)');
                var _format_2 = '_(* #,##0.00_);[Red]* (#,##0.00);_(* ""_);_(@_)';
                //Insert row
                Utils.excelInsertRows(worksheet, pos-1, dt_Data.length);
                for (var i = 0; i < dt_Data.length; i++) 
                    {
                        var row_item = worksheet.getRow(pos+ i);
                        row_item.getCell(2).value   = dt_Data[i].STD_YMD;
                        row_item.getCell(3).value   = dt_Data[i].VOUCHERNO;    
                        row_item.getCell(4).value   = dt_Data[i].DESCRIPTION;  
                        row_item.getCell(5).value   = dt_Data[i].PARTNER_ID; 
                        row_item.getCell(6).value   = dt_Data[i].PARTNER_NAME;
                        row_item.getCell(7).value   = dt_Data[i].BUSINESS_RES_NO;  
                        row_item.getCell(8).value   = dt_Data[i].AC_CD_DR; 
                        row_item.getCell(9).value   = dt_Data[i].AC_CD_CR; 
                        row_item.getCell(10).value  = Number(dt_Data[i].YMD_DRBOOKS); 
                        row_item.getCell(10).numFmt = _formatAmt;
                        row_item.getCell(11).value  = Number(dt_Data[i].YMD_CRBOOKS); 
                        row_item.getCell(11).numFmt = _formatAmt;
                        row_item.getCell(12).value  = Number(dt_Data[i].OPENING_BAL); 
                        row_item.getCell(12).numFmt = _formatAmt;
                        row_item.getCell(13).value  = Number(dt_Data[i].OPENING_BAL_CR); 
                        row_item.getCell(13).numFmt = _formatAmt;
                        row_item.getCell(14).value  = Number(dt_Data[i].YMD_DRTRANS); 
                        row_item.getCell(14).numFmt = _format_2; 
                        row_item.getCell(15).value  = Number(dt_Data[i].YMD_CRTRANS); 
                        row_item.getCell(15).numFmt = _format_2;
                        row_item.getCell(16).value  = Number(dt_Data[i].FOPENING_BAL); 
                        row_item.getCell(16).numFmt = _format_2; 
                        row_item.getCell(17).value  = Number(dt_Data[i].FOPENING_BAL_CR); 
                        row_item.getCell(17).numFmt = _format_2; 
                        
                        row_item.getCell(18).value   = dt_Data[i].PK; 
                        row_item.getCell(19).value   = dt_Data[i].SERIAL_NO; 
                        row_item.getCell(20).value   = dt_Data[i].INVOICE_NO; 
                        row_item.getCell(21).value   = dt_Data[i].INVOICE_DATE; 
                        row_item.getCell(22).value   = dt_Data[i].DUE_DATE; 
                        row_item.getCell(23).value   = dt_Data[i].C_INVOICE_NO; 
                        row_item.getCell(24).value   = dt_Data[i].C_INVOICE_DATE; 


                        if(dt_Data[i].STT == "0" || dt_Data[i].STT == "2" || dt_Data[i].STT == "3")  
                        {
                            if(dt_Data[i].STT == "2"){
                                for(let j = 2; j<=24; j++)
                                {
                                    row_item.getCell(j).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "DCE6F1" } };
                                    row_item.getCell(j).font = { italic: false, bold: true, color: {argb:'000000'}, size:10, name: 'Times New Roman'};
                                }
                            }
                            if(dt_Data[i].STT == "0" || dt_Data[i].STT == "3"){
                                for(let z = 2; z<=24; z++)
                                {
                                    row_item.getCell(z).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FDE9D9" } };
                                    row_item.getCell(z).font = { italic: false, bold: true, color: {argb:'000000'}, size:10, name: 'Times New Roman'};
                                }

                            }
                        }

                       // pos = pos + 1; 

                    }  
                    var _amtType = item.P_AMT_TYPE;
                    var _optionCRDR = item.P_OPTIONCRDR;
                    if(_optionCRDR == '1' && _amtType == 'book'){
                        worksheet.getCell("L6").value = "Balance";
                        worksheet.spliceColumns(19,6);
                        worksheet.spliceColumns(13,5);
                        worksheet.spliceColumns(8,2);
                        worksheet.mergeCells('B2', 'L2'); 
                        worksheet.mergeCells('B3', 'L3'); 
                    }
                    else if(_optionCRDR == '1' && _amtType == 'trans-book'){
                        worksheet.getCell("L6").value = "Balance";
                        worksheet.getCell("P6").value = "FC Balance";
                        worksheet.spliceColumns(19,6);
                        worksheet.spliceColumns(17,1);
                        worksheet.spliceColumns(13,1);
                        worksheet.spliceColumns(8,2);
                        worksheet.mergeCells('B2', 'N2'); 
                        worksheet.mergeCells('B3', 'N3'); 
                    }
                    else if(_optionCRDR == '2' && _amtType == 'book'){
                        worksheet.spliceColumns(14,4);
                        worksheet.mergeCells('B2', 'T2'); 
                        worksheet.mergeCells('B3', 'T3'); 
                    }
                    else{
                        worksheet.mergeCells('B2', 'X2'); 
                        worksheet.mergeCells('B3', 'X3'); 
                    }
                    /********* Print file excel ********/
                    const reportFile    = Helpers.tmpPath(file_new);
                    await workbook.xlsx.writeFile(reportFile)
                    return response.attachment( reportFile, file_new);
                }
        } 
        catch (e) 
        {
            Utils.Logger({ LVL: "error", MODULE: "Report", FUNC: "rpt_6045045_Ledger_By_Partner", CONTENT: e.message })
        // return response.send(Utils.response(false, e.message, null))
        return response.send(null);
        }
    } 
     /*****Tien Trans & Book******/
    async rpt_6045045_AL({ request, response, auth }) {
        try 
        { 
          /*P_RPT_ID: report_info.VAL1, P_RPT_URL: report_info.VAL2, P_RPT_FILE: report_info.VAL4,
            P_COMP_ID: company_info.PARTNER_ID, P_COMP_NM: company_info.TEXT, P_COMP_TAX: company_info.TAX_CODE, P_COMP_ADD: company_info.ADDR1,
            P_COMPANY: this.selectedCompany, P_FR_DATE: this.from_date, P_FR_TO: this.to_date, P_ACC_PK: this.TAC_ABACCTCODE_PK, 
            P_CUST_PK: this.TCO_BUSPARTNER_PK, P_STATUS: this.selectedStatus, P_CCY: this.selectedCcy, P_PARTNER_TYPE: this.selectedPartnerType, P_LANG : this.selectedLanguage ,P_TCO_BUSPLACE_PK : this.lstBizPlace,
            P_BIZ_ID: BizPlace_info.NAME, P_BIZ_NM: BizPlace_info.LOC_NM, P_BIZ_TAX: BizPlace_info.TAX_CD, P_BIZ_ADD: BizPlace_info.ADDR_NM1
            */
            /****************************** Get Param *********************************/
            let { para }        = request.get(['para']);
            /********* Parse pram to json ********/
            var item            = JSON.parse(para); 
            const user          = await auth.getUser() ;
            var COMP_ID         = item.P_COMP_ID, COMP_NM = item.P_COMP_NM, COMP_TAX = item.P_COMP_TAX, COMP_ADD = item.P_COMP_ADD;
            var BIZ_ID         = item.P_BIZ_ID , BIZ_NM  = item.P_BIZ_NM , BIZ_TAX  = item.P_BIZ_TAX , BIZ_ADD  = item.P_BIZ_ADD;
            const p_crt_by      = user.USER_ID;
            const p_language    = request.header("accept-language", "ENG");
            var file_nm         = [item.P_RPT_FILE];
            var file_type       = ".xlsx";
            var full_nm         = file_nm + file_type;
            var file_new        = file_nm + p_crt_by + file_type;
            var _resourcesPath  = [item.P_RPT_URL]+'/'+full_nm;
            var _store          = "AC_RPT_6045045_01";
            var _param          = [item.P_COMPANY, item.P_FR_DATE, item.P_FR_TO, item.P_ACC_CD, item.P_CUST_PK, item.P_STATUS, item.P_PARTNER_TYPE, item.P_TCO_BUSPLACE_PK];
            var v_no_title = "BẢNG TỔNG HỢP CÔNG NỢ", e_no_title = "MONTH PARTNER BALANCE" , k_no_title = "월별 거래처 잔액";
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
                worksheet.getCell("A1").value = Utils.translate("COMPANY",_dictionary , p_language) + ": " + BIZ_ID +" - "+ BIZ_NM;
                worksheet.getCell("A2").value = Utils.translate("ADDRESS",_dictionary , p_language) + ": "+ BIZ_ADD;
                worksheet.getCell("A3").value = Utils.translate("TAX_CODE",_dictionary, p_language) + ": "+ BIZ_TAX;
                var FromDate = item.P_FR_DATE;
                var ToDate = item.P_FR_TO;
                var strFrDate = FromDate.substr(6,2) + "/"+ FromDate.substr(4,2)+ "/"+ FromDate.substr(0,4);
                var strToDate = ToDate.substr(6,2) + "/"+ ToDate.substr(4,2)+ "/"+ ToDate.substr(0,4);

                var _lang = item.P_LANG;
                if(_lang == 'VIE'){
                    worksheet.getCell("A5").value = v_no_title;
                    worksheet.getCell("A7").value = "Từ ngày : " + strFrDate + " ~ " + strToDate;
                    //grid
                    worksheet.mergeCells('A9', 'A10'); 
                    worksheet.getCell("A9").value = "Mã KH";
                    worksheet.mergeCells('B9', 'B10'); 
                    worksheet.getCell("B9").value = "Tên KH";
                    worksheet.mergeCells('C9', 'C10'); 
                    worksheet.getCell("C9").value = "Mã TK";
                    worksheet.mergeCells('D9', 'D10');
                    worksheet.getCell("D9").value = "Tên TK";
                    worksheet.mergeCells('E9', 'E10');
                    worksheet.getCell("E9").value = "Số đầu kỳ nợ";
                    worksheet.mergeCells('F9', 'F10');
                    worksheet.getCell("F9").value = "Số đầu kỳ có";

                    worksheet.mergeCells('G9', 'H9'); 
                    worksheet.getCell("G9").value = "Phát sinh trong kỳ";
                    worksheet.getCell("G10").value = "Nợ";
                    worksheet.getCell("H10").value = "Có";

                    worksheet.mergeCells('I9', 'J9'); 
                    worksheet.getCell("I9").value = "Lũy kế";
                    worksheet.getCell("I10").value = "Nợ";
                    worksheet.getCell("J10").value = "Có";
                    worksheet.mergeCells('K9', 'K10'); 
                    worksheet.getCell("K9").value = "Số cuối kỳ nợ";
                    worksheet.mergeCells('L9', 'L10'); 
                    worksheet.getCell("L9").value = "Số cuối kỳ có";
                }
                else if(_lang == 'KOR'){
                    worksheet.getCell("A5").value = k_no_title;
                    worksheet.getCell("A7").value = "일자 : " + strFrDate + " ~ " + strToDate;
                    //grid
                    worksheet.mergeCells('A9', 'A10'); 
                    worksheet.getCell("A9").value = "거래처코드";
                    worksheet.mergeCells('B9', 'B10'); 
                    worksheet.getCell("B9").value = "거래처명";
                    worksheet.mergeCells('C9', 'C10'); 
                    worksheet.getCell("C9").value = "계정코드";
                    worksheet.mergeCells('D9', 'D10');
                    worksheet.getCell("D9").value = "계정명";
                    worksheet.mergeCells('E9', 'E10');
                    worksheet.getCell("E9").value = "기초(차변)";
                    worksheet.mergeCells('F9', 'F10');
                    worksheet.getCell("F9").value = "기초(대변)";

                    worksheet.mergeCells('G9', 'H9'); 
                    worksheet.getCell("G9").value = "기간";
                    worksheet.getCell("G10").value = "차변";
                    worksheet.getCell("H10").value = "대변";

                    worksheet.mergeCells('I9', 'J9'); 
                    worksheet.getCell("I9").value = "누적";
                    worksheet.getCell("I10").value = "차변";
                    worksheet.getCell("J10").value = "대변";
                    worksheet.mergeCells('K9', 'K10'); 
                    worksheet.getCell("K9").value = "기말(차변)";
                    worksheet.mergeCells('L9', 'L10'); 
                    worksheet.getCell("L9").value = "기말(대변)";

                }
                else{
                    worksheet.getCell("A5").value = e_no_title;
                    worksheet.getCell("A7").value = "From date : " + strFrDate + " ~ " + strToDate;
                    // grid
                    worksheet.mergeCells('A9', 'A10'); 
                    worksheet.mergeCells('B9', 'B10'); 
                    worksheet.mergeCells('C9', 'C10'); 
                    worksheet.mergeCells('D9', 'D10');
                    worksheet.mergeCells('E9', 'E10');
                    worksheet.mergeCells('F9', 'F10');
                    worksheet.mergeCells('G9', 'H9'); 
                    worksheet.mergeCells('I9', 'J9'); 
                    worksheet.mergeCells('K9', 'K10'); 
                    worksheet.mergeCells('L9', 'L10'); 

                }
                var pos = 11; 
                //var pos_total = pos +  dt_Data.length ;
                var total_dr_open = 0;
                var total_cr_open = 0;
                var total_dr_sum = 0;
                var total_cr_sum = 0;
                var total_acc_dr = 0;
                var total_acc_cr = 0;
                var total_dr_end = 0;
                var total_cr_end = 0;

                if(dt_Data.length>1)
                {
                     worksheet.duplicateRow(pos,dt_Data.length-1,true);
                }  
               for (var i = 0; i < dt_Data.length; i++) 
                {
                    var row_item = worksheet.getRow(pos);
                    //pos_total = pos_total + 1;
                    row_item.getCell(1).value   = dt_Data[i].PARTNER_ID;
                    row_item.getCell(2).value   = dt_Data[i].PARTNER_NAME;    
                    row_item.getCell(3).value   = dt_Data[i].AC_CD;  
                    row_item.getCell(4).value   = dt_Data[i].AC_NM; 
                    row_item.getCell(5).value   = dt_Data[i].DR_OPEN;  
                    row_item.getCell(6).value   = dt_Data[i].CR_OPEN; 
                    row_item.getCell(7).value   = dt_Data[i].DR_SUM;  
                    row_item.getCell(8).value   = dt_Data[i].CR_SUM;  
                    row_item.getCell(9).value  = dt_Data[i].ACC_DR;  
                    row_item.getCell(10).value  = dt_Data[i].ACC_CR;   
                    row_item.getCell(11).value  = dt_Data[i].DR_END;  
                    row_item.getCell(12).value  = dt_Data[i].CR_END;

                    total_dr_open += Number(dt_Data[i].DR_OPEN);
                    total_cr_open += Number(dt_Data[i].CR_OPEN);
                    total_dr_sum  += Number(dt_Data[i].DR_SUM);
                    total_cr_sum  += Number(dt_Data[i].CR_SUM);
                    total_acc_dr  += Number(dt_Data[i].ACC_DR);
                    total_acc_cr  += Number(dt_Data[i].ACC_CR);
                    total_dr_end  += Number(dt_Data[i].DR_END);
                    total_cr_end  += Number(dt_Data[i].CR_END);
                    pos = pos + 1; 
                    //row_item.commit();

                }  
                worksheet.mergeCells(pos,1,pos,4); 
                var row = worksheet.getRow(pos);
                row.getCell(5).value  = total_dr_open;
                row.getCell(6).value  = total_cr_open;
                row.getCell(7).value  = total_dr_sum;
                row.getCell(8).value  = total_cr_sum;
                row.getCell(9).value = total_acc_dr;
                row.getCell(10).value = total_acc_cr;
                row.getCell(11).value = total_dr_end;
                row.getCell(12).value = total_cr_end;
               /* let row = worksheet.getRow(pos_total);
                row.getCell(1).value = 'TOTAL'
                worksheet.mergeCells(pos_total,1,pos_total,5);
                row.getCell(1).font = {    bold: true  };
                row.commit();*/

                
                /********* Print file excel ********/
                const reportFile    = Helpers.tmpPath(file_new);
                await workbook.xlsx.writeFile(reportFile)
                return response.attachment( reportFile, file_new);
            }
        } 
        catch (e) 
        {
            Utils.Logger({ LVL: "error", MODULE: "Report", FUNC: "rpt_6045045_AL", CONTENT: e.message })
           // return response.send(Utils.response(false, e.message, null))
           return response.send(null);
        }
    }  
    /*****Tien Trans & Book EACBK003 - AL******/
    async rpt_6045045_ACCOUNT_CODE_CUSTOMER_ALL({ request, response, auth }) {
        try 
        { 
          /*P_RPT_ID: report_info.VAL1, P_RPT_FILE: report_info.VAL2,
            P_COMPANY: this.selectedCompany, P_FR_DATE: this.from_date, P_FR_TO: this.to_date, P_ACC_PK: this.TAC_ABACCTCODE_PK, 
                P_CUST_PK: this.TCO_BUSPARTNER_PK, P_STATUS: this.selectedStatus, P_PARTNER_TYPE: this.selectedPartnerType*/
            /****************************** Get Param *********************************/
            let { para }        = request.get(['para']);
            /********* Parse pram to json ********/
            var item            = JSON.parse(para); 
            const user          = await auth.getUser() ;
            var COMP_ID         = item.P_COMP_ID, COMP_NM = item.P_COMP_NM, COMP_TAX = item.P_COMP_TAX, COMP_ADD = item.P_COMP_ADD;
            var BIZ_ID         = item.P_BIZ_ID , BIZ_NM  = item.P_BIZ_NM , BIZ_TAX  = item.P_BIZ_TAX , BIZ_ADD  = item.P_BIZ_ADD;
            const p_crt_by      = user.USER_ID;
            const p_language    = request.header("accept-language", "ENG");
            var file_nm         = [item.P_RPT_FILE];
            var file_type       = ".xlsx";
            var full_nm         = file_nm + file_type;
            var file_new        = file_nm + p_crt_by + file_type;
            var _resourcesPath  = [item.P_RPT_URL]+'/'+full_nm; 
            var _store          = "AC_RPT_6045045_01_TR";
            var _param          = [item.P_COMPANY, item.P_FR_DATE, item.P_FR_TO, item.P_ACC_CD, item.P_CUST_PK, item.P_STATUS, item.P_PARTNER_TYPE, item.P_TCO_BUSPLACE_PK];
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
               
                //INFOMATION COMPANY
                worksheet.getCell("A1").value = BIZ_NM;
                worksheet.getCell("A2").value = BIZ_ADD;
                worksheet.getCell("A3").value = "Tax code : " + BIZ_TAX;
                var FromDate = item.P_FR_DATE;
                var ToDate = item.P_FR_TO;
                var strFrDate = FromDate.substr(6,2) + "/"+ FromDate.substr(4,2)+ "/"+ FromDate.substr(0,4);
                var strToDate = ToDate.substr(6,2) + "/"+ ToDate.substr(4,2)+ "/"+ ToDate.substr(0,4);
                worksheet.getCell("H5").value = "From date : " + strFrDate + " To date : " + strToDate;
                var pos = 9; 
                //var pos_total = pos +  dt_Data.length ;
                var total_dr_open = 0;
                var total_cr_open = 0;
                var total_dr_sum = 0;
                var total_cr_sum = 0;
                var total_acc_dr = 0;
                var total_acc_cr = 0;
                var total_dr_end = 0;
                var total_cr_end = 0;
                // tr
                var total_dr_fopen = 0;
                var total_cr_fopen = 0;
                var total_dr_fsum = 0;
                var total_cr_fsum = 0;
                var total_acc_fdr = 0;
                var total_acc_fcr = 0;
                var total_dr_fend = 0;
                var total_cr_fend = 0;
                var _bookccy = item.P_BOOK_CCY;
                var _formatAmt = (_bookccy=='VND'?'_(* #,##0_);[Red]* (#,##0);_(* "-"_);_(@_)':'_(* #,##0.00_);[Red]* (#,##0.00);_(* "-"_);_(@_)');
                var _formatAmt_2 = '_(* #,##0.00_);[Red]* (#,##0.00);_(* "-"_);_(@_)';
                // if(dt_Data.length>1)
                // {
                //      worksheet.duplicateRow(pos,dt_Data.length-1,true);
                // }  
                
                Utils.excelInsertRows(worksheet, pos, dt_Data.length-1);
                for (var i = 0; i < dt_Data.length; i++) 
                {
                    var row_item = worksheet.getRow(pos);
                    row_item.getCell(1).value   = i + 1;
                    row_item.getCell(2).value   = dt_Data[i].PARTNER_ID;
                    row_item.getCell(3).value   = dt_Data[i].PARTNER_NAME;    
                    row_item.getCell(4).value   = dt_Data[i].AC_CD;  
                    row_item.getCell(5).value   = dt_Data[i].AC_NM;
                    row_item.getCell(6).value   = dt_Data[i].DR_OPEN;
                    row_item.getCell(7).value   = dt_Data[i].CR_OPEN;  
                    row_item.getCell(8).value   = dt_Data[i].DR_SUM; 
                    row_item.getCell(9).value   = dt_Data[i].CR_SUM; 
                    row_item.getCell(10).value  = dt_Data[i].ACC_DR_SUM; 
                    row_item.getCell(11).value  = dt_Data[i].ACC_CR_SUM;  
                    row_item.getCell(12).value  = dt_Data[i].DR_END_BAL; 
                    row_item.getCell(13).value  = dt_Data[i].CR_END_BAL; 

                    row_item.getCell(14).value  = dt_Data[i].DR_FOPEN; 
                    row_item.getCell(15).value  = dt_Data[i].CR_FOPEN; 
                    row_item.getCell(16).value  = dt_Data[i].DR_FSUM;   
                    row_item.getCell(17).value  = dt_Data[i].CR_FSUM; 
                    row_item.getCell(18).value  = dt_Data[i].ACC_DR_FSUM;    
                    row_item.getCell(19).value  = dt_Data[i].ACC_CR_FSUM;
                    row_item.getCell(20).value  = dt_Data[i].DR_END_FBAL;     
                    row_item.getCell(21).value  = dt_Data[i].CR_END_FBAL;

                    for(let f_trans = 14; f_trans <=21; f_trans++)
                    {
                        row_item.getCell(f_trans).numFmt = _formatAmt_2;
                    }
                    for(let f_books = 6; f_books <=13; f_books++)
                    {
                        row_item.getCell(f_books).numFmt = _formatAmt;
                    }

                    total_dr_open += Number(dt_Data[i].DR_OPEN);
                    total_cr_open += Number(dt_Data[i].CR_OPEN);
                    total_dr_sum  += Number(dt_Data[i].DR_SUM);
                    total_cr_sum  += Number(dt_Data[i].CR_SUM);
                    total_acc_dr  += Number(dt_Data[i].ACC_DR_SUM);
                    total_acc_cr  += Number(dt_Data[i].ACC_CR_SUM);
                    total_dr_end  += Number(dt_Data[i].DR_END_BAL);
                    total_cr_end  += Number(dt_Data[i].CR_END_BAL);

                    total_dr_fopen += Number(dt_Data[i].DR_FOPEN);
                    total_cr_fopen += Number(dt_Data[i].CR_FOPEN);
                    total_dr_fsum  += Number(dt_Data[i].DR_FSUM);
                    total_cr_fsum  += Number(dt_Data[i].CR_FSUM);
                    total_acc_fdr  += Number(dt_Data[i].ACC_DR_FSUM);
                    total_acc_fcr  += Number(dt_Data[i].ACC_CR_FSUM);
                    total_dr_fend  += Number(dt_Data[i].DR_END_FBAL);
                    total_cr_fend  += Number(dt_Data[i].CR_END_FBAL);
                    pos = pos + 1; 

                }  
                worksheet.mergeCells(pos,1,pos,5); 
                var row = worksheet.getRow(pos);
                 
                row.getCell(6).value  = total_dr_open;
                row.getCell(7).value  = total_cr_open;
                row.getCell(8).value  = total_dr_sum;
                row.getCell(9).value  = total_cr_sum;
                row.getCell(10).value = total_acc_dr;
                row.getCell(11).value = total_acc_cr;
                row.getCell(12).value = total_dr_end; 
                row.getCell(13).value = total_cr_end;
                row.getCell(14).value = total_dr_fopen; 
                row.getCell(15).value = total_cr_fopen;
                row.getCell(16).value = total_dr_fsum; 
                row.getCell(17).value = total_cr_fsum;
                row.getCell(18).value = total_acc_fdr; 
                row.getCell(19).value = total_acc_fcr;
                row.getCell(20).value = total_dr_fend;
                row.getCell(21).value = total_cr_fend; 

                for(let f_total = 14; f_total <=21; f_total++)
                {
                    row.getCell(f_total).numFmt = _formatAmt_2;
                }
                for(let _total = 6; _total <=13; _total++)
                {
                    row.getCell(_total).numFmt = _formatAmt;
                }
                var _amtType = item.P_AMT_TYPE;
                
                if(_amtType == 'book'){
                    worksheet.spliceColumns(14,8);
                    worksheet.mergeCells('A4', 'M4'); 
                    worksheet.mergeCells('A5', 'M5'); 
                }
                else{
                    worksheet.mergeCells('A4', 'U4'); 
                    worksheet.mergeCells('A5', 'U5'); 
                }
                /********* Print file excel ********/
                const reportFile    = Helpers.tmpPath(file_new);
                await workbook.xlsx.writeFile(reportFile)
                return response.attachment( reportFile, file_new);
            }
        } 
        catch (e) 
        {
            Utils.Logger({ LVL: "error", MODULE: "Report", FUNC: "rpt_6045045_T1_TR", CONTENT: e.message })
           // return response.send(Utils.response(false, e.message, null))
           return response.send(null);
        }
    } 
    /*****Tien Trans & Book******/
    async rpt_6045045_T1_TR({ request, response, auth }) {
        try 
        { 
          /*P_RPT_ID: report_info.VAL1, P_RPT_FILE: report_info.VAL2,
            P_COMPANY: this.selectedCompany, P_FR_DATE: this.from_date, P_FR_TO: this.to_date, P_ACC_PK: this.TAC_ABACCTCODE_PK, 
                P_CUST_PK: this.TCO_BUSPARTNER_PK, P_STATUS: this.selectedStatus, P_PARTNER_TYPE: this.selectedPartnerType*/
            /****************************** Get Param *********************************/
            let { para }        = request.get(['para']);
            /********* Parse pram to json ********/
            var item            = JSON.parse(para); 
            const user          = await auth.getUser() ;
            var COMP_ID         = item.P_COMP_ID, COMP_NM = item.P_COMP_NM, COMP_TAX = item.P_COMP_TAX, COMP_ADD = item.P_COMP_ADD;
            var BIZ_ID         = item.P_BIZ_ID , BIZ_NM  = item.P_BIZ_NM , BIZ_TAX  = item.P_BIZ_TAX , BIZ_ADD  = item.P_BIZ_ADD;
            const p_crt_by      = user.USER_ID;
            const p_language    = request.header("accept-language", "ENG");
            var file_nm         = [item.P_RPT_FILE];
            var file_type       = ".xlsx";
            var full_nm         = file_nm + file_type;
            var file_new        = file_nm + p_crt_by + file_type;
            var _resourcesPath  = [item.P_RPT_URL]+'/'+full_nm; 
            var _store          = "AC_RPT_6045045_01_TR";
            var _param = [item.P_COMPANY, item.P_FR_DATE, item.P_FR_TO, item.P_ACC_CD, item.P_CUST_PK, item.P_STATUS, item.P_PARTNER_TYPE, item.P_TCO_BUSPLACE_PK];
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
               
                //INFOMATION COMPANY
                worksheet.getCell("A1").value = BIZ_NM;
                worksheet.getCell("A2").value = BIZ_ADD;
                worksheet.getCell("A3").value = "Tax code : " + BIZ_TAX;
                var FromDate = item.P_FR_DATE;
                var ToDate = item.P_FR_TO;
                var strFrDate = FromDate.substr(6,2) + "/"+ FromDate.substr(4,2)+ "/"+ FromDate.substr(0,4);
                var strToDate = ToDate.substr(6,2) + "/"+ ToDate.substr(4,2)+ "/"+ ToDate.substr(0,4);
                worksheet.getCell("H5").value = "From date : " + strFrDate + " To date : " + strToDate;
                var pos = 9; 
                //var pos_total = pos +  dt_Data.length ;
                var total_dr_open = 0;
                var total_cr_open = 0;
                var total_dr_sum = 0;
                var total_cr_sum = 0;
                var total_acc_dr = 0;
                var total_acc_cr = 0;
                var total_dr_end = 0;
                var total_cr_end = 0;
                // tr
                var total_dr_fopen = 0;
                var total_cr_fopen = 0;
                var total_dr_fsum = 0;
                var total_cr_fsum = 0;
                var total_acc_fdr = 0;
                var total_acc_fcr = 0;
                var total_dr_fend = 0;
                var total_cr_fend = 0;

                if(dt_Data.length>1)
                {
                     worksheet.duplicateRow(pos,dt_Data.length-1,true);
                }  
               for (var i = 0; i < dt_Data.length; i++) 
                {
                    var row_item = worksheet.getRow(pos);
                    //pos_total = pos_total + 1;
                    row_item.getCell(1).value   = i + 1;
                    row_item.getCell(2).value   = dt_Data[i].PARTNER_ID;
                    row_item.getCell(3).value   = dt_Data[i].PARTNER_NAME;    
                    row_item.getCell(4).value   = dt_Data[i].AC_CD;  
                    row_item.getCell(5).value   = dt_Data[i].AC_NM; 
                    row_item.getCell(6).value   = dt_Data[i].DR_FOPEN;
                    row_item.getCell(7).value   = dt_Data[i].DR_OPEN;  
                    row_item.getCell(8).value   = dt_Data[i].CR_FOPEN; 
                    row_item.getCell(9).value   = dt_Data[i].CR_OPEN; 
                    row_item.getCell(10).value   = dt_Data[i].DR_FSUM; 
                    row_item.getCell(11).value   = dt_Data[i].DR_SUM;  
                    row_item.getCell(12).value   = dt_Data[i].CR_FSUM; 
                    row_item.getCell(13).value   = dt_Data[i].CR_SUM;  
                    row_item.getCell(14).value   = dt_Data[i].ACC_DR_FSUM; 
                    row_item.getCell(15).value  = dt_Data[i].ACC_DR_SUM; 
                     row_item.getCell(16).value  = dt_Data[i].ACC_CR_FSUM;   
                    row_item.getCell(17).value  = dt_Data[i].ACC_CR_SUM; 
                    row_item.getCell(18).value  = dt_Data[i].DR_END_FBAL;    
                    row_item.getCell(19).value  = dt_Data[i].DR_END_BAL;
                    row_item.getCell(20).value  = dt_Data[i].CR_END_FBAL;     
                    row_item.getCell(21).value  = dt_Data[i].CR_END_BAL;

                    

                    total_dr_open += Number(dt_Data[i].DR_OPEN);
                    total_cr_open += Number(dt_Data[i].CR_OPEN);
                    total_dr_sum  += Number(dt_Data[i].DR_SUM);
                    total_cr_sum  += Number(dt_Data[i].CR_SUM);
                    total_acc_dr  += Number(dt_Data[i].ACC_DR_SUM);
                    total_acc_cr  += Number(dt_Data[i].ACC_CR_SUM);
                    total_dr_end  += Number(dt_Data[i].DR_END_BAL);
                    total_cr_end  += Number(dt_Data[i].CR_END_BAL);

                    total_dr_fopen += Number(dt_Data[i].DR_FOPEN);
                    total_cr_fopen += Number(dt_Data[i].CR_FOPEN);
                    total_dr_fsum  += Number(dt_Data[i].DR_FSUM);
                    total_cr_fsum  += Number(dt_Data[i].CR_FSUM);
                    total_acc_fdr  += Number(dt_Data[i].ACC_DR_FSUM);
                    total_acc_fcr  += Number(dt_Data[i].ACC_CR_FSUM);
                    total_dr_fend  += Number(dt_Data[i].DR_END_FBAL);
                    total_cr_fend  += Number(dt_Data[i].CR_END_FBAL);
                    pos = pos + 1; 

                }  
                worksheet.mergeCells(pos,1,pos,5); 
                var row = worksheet.getRow(pos);
                 
                row.getCell(6).value = total_dr_fopen;
                row.getCell(7).value  = total_dr_open;
                row.getCell(8).value  = total_cr_fopen;
                row.getCell(9).value  = total_cr_open;
                row.getCell(10).value  = total_dr_fsum;
                row.getCell(11).value  = total_dr_sum;
                row.getCell(12).value  = total_cr_fsum; 
                row.getCell(13).value  = total_cr_sum;
                row.getCell(14).value = total_acc_fdr; 
                row.getCell(15).value = total_acc_dr;
                row.getCell(16).value = total_acc_fcr; 
                row.getCell(17).value = total_acc_cr;
                row.getCell(18).value = total_dr_fend; 
                row.getCell(19).value = total_dr_end;
                row.getCell(20).value = total_cr_fend;
                row.getCell(21).value = total_cr_end; 
                
                /********* Print file excel ********/
                const reportFile    = Helpers.tmpPath(file_new);
                await workbook.xlsx.writeFile(reportFile)
                return response.attachment( reportFile, file_new);
            }
        } 
        catch (e) 
        {
            Utils.Logger({ LVL: "error", MODULE: "Report", FUNC: "rpt_6045045_T1_TR", CONTENT: e.message })
           // return response.send(Utils.response(false, e.message, null))
           return response.send(null);
        }
    }  
    /*****TB tien giao dich & ghi so******/
    async rpt_6045045_T2({ request, response, auth }) {
        try 
        { 
          /*P_RPT_ID: report_info.VAL1, P_RPT_FILE: report_info.VAL2,
            P_COMPANY: this.selectedCompany, P_FR_DATE: this.from_date, P_FR_TO: this.to_date, P_ACC_PK: this.TAC_ABACCTCODE_PK, P_ACC_CD: this.txtAccountCode,
                P_CUST_PK: this.TCO_BUSPARTNER_PK, P_STATUS: this.selectedStatus, P_PARTNER_TYPE: this.selectedPartnerType*/
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
            var _store          = "AC_RPT_6045045_02";
            var _store_sum      = "AC_RPT_6045045_02_SUM";
            var _param = [item.P_COMPANY, item.P_FR_DATE, item.P_FR_TO, item.P_ACC_CD, item.P_CUST_PK, item.P_STATUS, item.P_CCY, item.P_PARTNER_TYPE, item.P_TCO_BUSPLACE_PK];
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
                var dt_Sum  = await DBService.callProcCursor(_store_sum, _param , p_language , p_crt_by); 
                if (dt_Data.length>0) 
                {
                    dt_Data = dt_Data;
                } 
                else 
                {
                    return response.send(Utils.response(false, "no_data_found", null))
                } 
                if (dt_Sum) 
                {
                    dt_Sum = dt_Sum;
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
               
                //INFOMATION COMPANY
                worksheet.getCell("A1").value = COMP_NM;
                worksheet.getCell("A2").value = COMP_ADD;
                worksheet.getCell("A3").value = "Tax code : " + COMP_TAX;
                var FromDate = item.P_FR_DATE;
                var ToDate = item.P_FR_TO;
                var strFrDate = FromDate.substr(6,2) + "/"+ FromDate.substr(4,2)+ "/"+ FromDate.substr(0,4);
                var strToDate = ToDate.substr(6,2) + "/"+ ToDate.substr(4,2)+ "/"+ ToDate.substr(0,4);
                worksheet.getCell("F5").value = "From date : " + strFrDate + " To date : " + strToDate;
                var pos = 10; 
                // Account code
                worksheet.getCell("A6").value = "Account code : " + dt_Data[0].AC_CD + " - " + dt_Data[0].AC_NM;
                if(dt_Data.length>1)
                {
                     worksheet.duplicateRow(pos,dt_Data.length-1,true);
                }  
               for (var i = 0; i < dt_Data.length; i++) 
                {
                    var row_item = worksheet.getRow(pos);
                   // pos_row = pos_row + 1;
                    row_item.getCell(1).value   = i + 1;
                    row_item.getCell(2).value   = dt_Data[i].PARTNER_ID;
                    row_item.getCell(3).value   = dt_Data[i].PARTNER_NAME;    
                    row_item.getCell(4).value   = dt_Data[i].CCY;  
                    row_item.getCell(5).value   = dt_Data[i].TR_OPEN; 
                    row_item.getCell(6).value   = dt_Data[i].BK_OPEN;  
                    row_item.getCell(7).value   = dt_Data[i].TR_DR; 
                    row_item.getCell(8).value   = dt_Data[i].TR_CR;  
                    row_item.getCell(9).value   = dt_Data[i].BK_DR;  

                    row_item.getCell(10).value   = dt_Data[i].BK_CR;     
                    row_item.getCell(11).value   = dt_Data[i].BK_ACC_DR;  
                    row_item.getCell(12).value   = dt_Data[i].BK_ACC_CR; 
                    row_item.getCell(13).value   = dt_Data[i].TR_END;  
                    row_item.getCell(14).value   = dt_Data[i].BK_END; 
                    pos = pos + 1; 
                }  
               // var row = worksheet.getRow(pos);
               worksheet.mergeCells(pos,1,pos,4); 
               worksheet.mergeCells(pos,5,pos,6);  
               worksheet.mergeCells(pos,7,pos,8); 
               worksheet.mergeCells(pos,9,pos,10);
               worksheet.mergeCells(pos,11,pos,12);
               worksheet.mergeCells(pos,13,pos,14);

                pos = pos + 2;
               if(dt_Sum.length>1)
                {
                     worksheet.duplicateRow(pos,dt_Sum.length-1,true);
                }  
               for (var i = 0; i < dt_Sum.length; i++) 
                {
                    pos += i;
                    var row_item = worksheet.getRow(pos);

                    row_item.getCell(1).value   = dt_Sum[i].CCY;
                    row_item.getCell(5).value   = dt_Sum[i].TR_OPEN;    
                    row_item.getCell(6).value   = dt_Sum[i].BK_OPEN;  
                    row_item.getCell(7).value   = dt_Sum[i].TR_DR; 
                    row_item.getCell(8).value   = dt_Sum[i].TR_CR;  
                    row_item.getCell(9).value   = dt_Sum[i].BK_DR;  

                    row_item.getCell(10).value   = dt_Sum[i].BK_CR;    
                    row_item.getCell(11).value   = dt_Sum[i].BK_ACC_DR;  
                    row_item.getCell(12).value   = dt_Sum[i].BK_ACC_CR;
                    row_item.getCell(13).value   = dt_Sum[i].TR_END;  
                    row_item.getCell(14).value   = dt_Sum[i].BK_END;
                    worksheet.mergeCells(pos,1,pos,4); 
                } 
                
                /********* Print file excel ********/

                const reportFile    = Helpers.tmpPath(file_new);
                await workbook.xlsx.writeFile(reportFile)
                return response.attachment( reportFile, file_new);
            }
        } 
        catch (e) 
        {
            Utils.Logger({ LVL: "error", MODULE: "Report", FUNC: "rpt_6045045_T2", CONTENT: e.message })
           // return response.send(Utils.response(false, e.message, null))
           return response.send(null);
        }
    }  
     /*****OB Tien ghi so******/
    async rpt_6045045_T3({ request, response, auth }) {
        try 
        { 
          /*P_RPT_ID: report_info.VAL1, P_RPT_FILE: report_info.VAL2,
            P_COMPANY: this.selectedCompany, P_FR_DATE: this.from_date, P_FR_TO: this.to_date, P_ACC_PK: this.TAC_ABACCTCODE_PK, P_ACC_CD: this.txtAccountCode,
                P_CUST_PK: this.TCO_BUSPARTNER_PK, P_STATUS: this.selectedStatus, P_PARTNER_TYPE: this.selectedPartnerType*/
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
            var _store          = "AC_RPT_6045045_03";
            var _store_sum      = "AC_RPT_6045045_03_SUM";
            var _param = [item.P_COMPANY, item.P_FR_DATE, item.P_FR_TO, item.P_ACC_CD, item.P_CUST_PK, item.P_STATUS, item.P_CCY, item.P_PARTNER_TYPE, item.P_TCO_BUSPLACE_PK];
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
                var dt_Sum  = await DBService.callProcCursor(_store_sum, _param , p_language , p_crt_by); 
                if (dt_Data.length>0) 
                {
                    dt_Data = dt_Data;
                } 
                else 
                {
                    return response.send(Utils.response(false, "no_data_found", null))
                } 
                if (dt_Sum) 
                {
                    dt_Sum = dt_Sum;
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
               
                //INFOMATION COMPANY
                worksheet.getCell("A1").value = BIZ_NM;
                worksheet.getCell("A2").value = BIZ_ADD;
                worksheet.getCell("A3").value = "Tax code : " + BIZ_TAX;
                var FromDate = item.P_FR_DATE;
                var ToDate = item.P_FR_TO;
                var strFrDate = FromDate.substr(6,2) + "/"+ FromDate.substr(4,2)+ "/"+ FromDate.substr(0,4);
                var strToDate = ToDate.substr(6,2) + "/"+ ToDate.substr(4,2)+ "/"+ ToDate.substr(0,4);
                worksheet.getCell("D5").value = "From date : " + strFrDate + " To date : " + strToDate;
                var pos = 10; 
                // Account code
                worksheet.getCell("A6").value = "Account code : " + dt_Data[0].AC_CD + " - " + dt_Data[0].AC_NM;
                if(dt_Data.length>1)
                {
                     worksheet.duplicateRow(pos,dt_Data.length-1,true);
                }  
               for (var i = 0; i < dt_Data.length; i++) 
                {
                    var row_item = worksheet.getRow(pos);
                    row_item.getCell(1).value   = i + 1;
                    row_item.getCell(2).value   = dt_Data[i].PARTNER_ID;
                    row_item.getCell(3).value   = dt_Data[i].PARTNER_NAME;    
                    row_item.getCell(4).value   = dt_Data[i].BK_OPEN;  
                    row_item.getCell(5).value   = dt_Data[i].BK_DR; 
                    row_item.getCell(6).value   = dt_Data[i].BK_CR;  
                    row_item.getCell(7).value   = dt_Data[i].BK_ACC_DR; 
                    row_item.getCell(8).value   = dt_Data[i].BK_ACC_CR;  
                    row_item.getCell(9).value   = dt_Data[i].BK_END;  
                    pos = pos + 1;
                }  
               // var row = worksheet.getRow(pos);
               worksheet.mergeCells(pos,1,pos,4); 
               worksheet.mergeCells(pos,5,pos,6);  
               worksheet.mergeCells(pos,7,pos,8); 
               worksheet.mergeCells(pos,9,pos+1,9);

                pos = pos + 2;
               if(dt_Sum.length>1)
                {
                     worksheet.duplicateRow(pos,dt_Sum.length-1,true);
                }  
               for (var i = 0; i < dt_Sum.length; i++) 
                {
                    pos += i;
                    var row_item = worksheet.getRow(pos);
                 
                    row_item.getCell(1).value   = dt_Sum[i].BK_OPEN;
                    row_item.getCell(5).value   = dt_Sum[i].BK_DR;    
                    row_item.getCell(6).value   = dt_Sum[i].BK_CR;  
                    row_item.getCell(7).value   = dt_Sum[i].BK_ACC_DR; 
                    row_item.getCell(8).value   = dt_Sum[i].BK_ACC_CR;  
                    row_item.getCell(9).value   = dt_Sum[i].BK_END;  
                    worksheet.mergeCells(pos,1,pos,4); 
                } 
                
                /********* Print file excel ********/

                const reportFile    = Helpers.tmpPath(file_new);
                await workbook.xlsx.writeFile(reportFile)
                return response.attachment( reportFile, file_new);
            }
        } 
        catch (e) 
        {
            Utils.Logger({ LVL: "error", MODULE: "Report", FUNC: "rpt_6045045_T3", CONTENT: e.message })
           // return response.send(Utils.response(false, e.message, null))
           return response.send(null);
        }
    }  
}

module.exports = rpt6045045;