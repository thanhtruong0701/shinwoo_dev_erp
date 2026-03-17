"use strict";

const { DATE } = require("oracledb");

const Helpers       = use('Helpers')
const Antl          = use("Antl");
const Utils         = use("Utils");
const DBService = use("DBService")
var Excel           = use('exceljs');
var workbook        = new Excel.Workbook();
class rpt6030070 {
/*########################################################## Report JH ##################################################################################*/ 
    async rpt_6030070_AS_FORM_OT({ request, response, auth }) {
        try 
        { 
        /*  P_RPT_ID: report_info.VAL1, P_RPT_URL: report_info.VAL2, P_RPT_FILE: report_info.VAL3,
                P_COMP_ID: company_info.PARTNER_ID, P_COMP_NM: company_info.TEXT, P_COMP_TAX: company_info.TAX_CODE, P_COMP_ADD: company_info.ADDR1,
                P_COMPANY: this.selectedCompany, P_FR_DATE: this.proposedFrom, P_FR_TO: this.proposedTo, P_ACC_PK: this.accCodePK, 
                P_PARTNER_PK: this.partnerPK, P_STATUS: this.status, P_VOUCHER_NO: this.voucherNo, P_SEQ: this.seq, P_BOOK_CCY: this.txtBookCCY,
                P_VOUCHER_TYPE: this.selectedVoucherType, P_CIRCULARS: this.selectedCircular, P_LANG : this.selectedLang,  P_DATE_NOW: this.datetime,
                P_PL: this.plUnitPK, P_DESCRIPTION: this.description
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
            var _store          = "AC_RPT_6030070_DAILY_INQ_OT";
            //var _circular       = "AC_SEL_GET_TT_BPL";
            var _param          = [item.P_COMPANY, item.P_FR_DATE, item.P_FR_TO, item.P_ACC_PK, item.P_PARTNER_PK, item.P_PL, item.P_STATUS, item.P_VOUCHER_NO , item.P_SEQ, item.P_DESCRIPTION, item.P_LANG , item.P_VOUCHER_TYPE, item.P_TCO_BUSPLACE_PK];
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
                // r_item.getCell(1).value = Utils.translate("COMPANY",_dictionary , p_language) + ": " + COMP_ID +" - "+COMP_NM;    
                r_item.getCell(1).value = Utils.translate("COMPANY",_dictionary , p_language) + ": " + COMP_NM;    
                r_item = worksheet.getRow(2);
                r_item.getCell(1).value = Utils.translate("TAX_CODE",_dictionary, p_language) + ": "+ COMP_TAX;   
                r_item = worksheet.getRow(3);
                r_item.getCell(1).value = Utils.translate("ADDRESS",_dictionary , p_language) + ": "+ COMP_ADD;
                var FromDate = item.P_FR_DATE;
                var ToDate = item.P_FR_TO;
                var strFrDate = FromDate.substr(6,2) + "/"+ FromDate.substr(4,2)+ "/"+ FromDate.substr(0,4);
                var strToDate = ToDate.substr(6,2) + "/"+ ToDate.substr(4,2)+ "/"+ ToDate.substr(0,4);
                
                // thông tư
                
                worksheet.mergeCells('B8', 'B9'); 
                worksheet.mergeCells('C8', 'C9'); 
                worksheet.mergeCells('D8', 'E8'); 
                worksheet.mergeCells('F8', 'G8'); 
                worksheet.mergeCells('H8', 'I8'); 
                worksheet.mergeCells('J8', 'K8'); 
                worksheet.mergeCells('L8', 'M8'); 
                worksheet.mergeCells('N8', 'O8'); 
                worksheet.mergeCells('P8', 'Q8');
                worksheet.mergeCells('R8', 'S8');
                worksheet.mergeCells('T8', 'U8');
                worksheet.mergeCells('V8', 'W8');
                var _lang = item.P_LANG;
                if(_lang == 'VIE'){
                    worksheet.getCell("A5").value = "Truy Xuất Nhật Ký";
                    worksheet.getCell("A6").value = "Từ ngày " + strFrDate + " đến ngày " + strToDate;
                    //grid
                    worksheet.getCell("B8").value = "Ngày tháng ghi sổ";
                    worksheet.getCell("C8").value = "Số chứng từ"; 
                    worksheet.getCell("D8").value = "Tài khoản";
                    worksheet.getCell("D9").value = "Mã";
                    worksheet.getCell("E9").value = "Tên";
                    worksheet.getCell("F8").value = "Tiền giao dịch";
                    worksheet.getCell("F9").value = "Nợ";
                    worksheet.getCell("G9").value = "Có";
                    worksheet.getCell("H8").value = "Tiền ghi sổ";
                    worksheet.getCell("H9").value = "Nợ";
                    worksheet.getCell("I9").value = "Có";
                    worksheet.getCell("J8").value = "Diễn giải";
                    worksheet.getCell("J9").value = "Foreign";
                    worksheet.getCell("K9").value = "Local";
                    worksheet.getCell("L8").value = "Đối tượng";
                    worksheet.getCell("L9").value = "Mã";
                    worksheet.getCell("M9").value = "Tên";
                    worksheet.getCell("N8").value = "PL";
                    worksheet.getCell("N9").value = "Mã";
                    worksheet.getCell("O9").value = "Tên";

                }
                else{
                    worksheet.getCell("A6").value = "From date " + strFrDate + " To date " + strToDate;
                }
                var pos = 10; 
                var total_trans_dr   = 0;
                var total_trans_cr  = 0;
                var total_book_dr    = 0;
                var total_book_cr    = 0;
                var _bookccy = item.P_BOOK_CCY;
                var _formatAmt = (_bookccy=='VND'?'_(* #,##0_);_(* (#,##0);_(* "-"_);_(@_)':'_(* #,##0.00_);_(* (#,##0.00);_(* "-"_);_(@_)');

                
                //Utils.excelInsertRows(worksheet, pos, dt_Data.length-1);    
                if(dt_Data.length>1)
                {
                    worksheet.duplicateRow(pos,dt_Data.length-1,true);
                }  
                for (var i = 0; i < dt_Data.length; i++) 
                    {
                        var row_item = worksheet.getRow(pos);
                        var  _tr_date = dt_Data[i].TR_DATE.substr(6,2) + "/"+ dt_Data[i].TR_DATE.substr(4,2)+ "/"+ dt_Data[i].TR_DATE.substr(0,4);
                        row_item.getCell(1).value   = dt_Data[i].PK;
                        row_item.getCell(2).value   = _tr_date;    
                        row_item.getCell(3).value   = dt_Data[i].VOUCHERNO;  
                        row_item.getCell(4).value   = dt_Data[i].AC_CD; 
                        row_item.getCell(5).value   = dt_Data[i].AC_NM; 
                        row_item.getCell(6).value   = Number(dt_Data[i].TR_AMTD); 
                        row_item.getCell(6).numFmt  = _formatAmt;
                        row_item.getCell(7).value   = Number(dt_Data[i].TR_AMTC); 
                        row_item.getCell(7).numFmt  = _formatAmt;
                        row_item.getCell(8).value   = Number(dt_Data[i].TR_BOOKD); 
                        row_item.getCell(8).numFmt  = _formatAmt; 
                        row_item.getCell(9).value   = Number(dt_Data[i].TR_BOOKC); 
                        row_item.getCell(9).numFmt  = _formatAmt; 
                        row_item.getCell(10).value  = dt_Data[i].REMARK;  
                        row_item.getCell(11).value  = dt_Data[i].REMARK2;  
                        row_item.getCell(12).value  = dt_Data[i].PARTNER_ID;   
                        row_item.getCell(13).value  = dt_Data[i].PARTNER_LNAME;  
                        row_item.getCell(14).value  = dt_Data[i].PL_CD;
                        row_item.getCell(15).value  = dt_Data[i].PL_NM;
                        
                        
                        row_item.getCell(16).value  = dt_Data[i].STVAS_CODE;
                        row_item.getCell(17).value  = dt_Data[i].STVAS_NAME;    
                        row_item.getCell(18).value  = dt_Data[i].M_CODE;
                        row_item.getCell(19).value  = dt_Data[i].M_NAME;    
                        row_item.getCell(20).value  = dt_Data[i].SUB_CODE;
                        row_item.getCell(21).value  = dt_Data[i].SUB_NAME;  
                        row_item.getCell(22).value  = dt_Data[i].AC_CODE_OFFSET;
                        row_item.getCell(23).value  = dt_Data[i].AC_NM_OFFSET;    
                        
                        total_trans_dr       += Number(dt_Data[i].TR_AMTD);
                        total_trans_cr       += Number(dt_Data[i].TR_AMTC);
                        total_book_dr        += Number(dt_Data[i].TR_BOOKD);
                        total_book_cr        += Number(dt_Data[i].TR_BOOKC);
                        pos = pos + 1; 
                        //row_item.commit();

                }  
                var row = worksheet.getRow(pos);
                worksheet.mergeCells(pos,1,pos,5); 
                if(_lang == 'VIE'){
                    row.getCell(1).value  = "Tổng";
                }
                else{
                    row.getCell(1).value  = "Total";
                }
                row.getCell(6).value  = total_trans_dr;
                row.getCell(6).numFmt  = _formatAmt; 
                row.getCell(7).value  = total_trans_cr;
                row.getCell(7).numFmt  = _formatAmt; 
                row.getCell(8).value  = total_book_dr;
                row.getCell(8).numFmt  = _formatAmt; 
                row.getCell(9).value  = total_book_cr;
                row.getCell(9).numFmt  = _formatAmt; 
                
                /********* Print file excel ********/
                const reportFile    = Helpers.tmpPath(file_new);
                await workbook.xlsx.writeFile(reportFile)
                return response.attachment( reportFile, file_new);
            }
        } 
        catch (e) 
        {
            Utils.Logger({ LVL: "error", MODULE: "Report", FUNC: "rpt_6030070_AS_FORM_OT", CONTENT: e.message })
        // return response.send(Utils.response(false, e.message, null))
        return response.send(null);
        }
    } 
    async rpt_6030070_NKC_ST({ request, response, auth }) {
        try 
        { 
        /*  P_RPT_ID: report_info.VAL1, P_RPT_URL: report_info.VAL2, P_RPT_FILE: report_info.VAL3,
                P_COMP_ID: company_info.PARTNER_ID, P_COMP_NM: company_info.TEXT, P_COMP_TAX: company_info.TAX_CODE, P_COMP_ADD: company_info.ADDR1,
                P_COMPANY: this.selectedCompany, P_FR_DATE: this.proposedFrom, P_FR_TO: this.proposedTo, P_ACC_PK: this.accCodePK, 
                P_PARTNER_PK: this.partnerPK, P_STATUS: this.status, P_VOUCHER_NO: this.voucherNo, P_SEQ: this.seq, P_BOOK_CCY: this.txtBookCCY,
                P_VOUCHER_TYPE: this.selectedVoucherType, P_CIRCULARS: this.selectedCircular, P_LANG : this.selectedLang,  P_DATE_NOW: this.datetime,
                P_PL: this.plUnitPK, P_DESCRIPTION: this.description
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
            var _store          = "AC_RPT_6030070_NKC_ST";
            var _circular       = "AC_SEL_GET_TT_BPL";
            var _param          = [item.P_COMPANY, item.P_FR_DATE, item.P_FR_TO, item.P_ACC_PK, item.P_PARTNER_PK, item.P_STATUS, item.P_VOUCHER_NO , item.P_SEQ, item.P_BOOK_CCY, item.P_VOUCHER_TYPE, item.P_CIRCULARS, item.P_LANG, item.P_TCO_BUSPLACE_PK, item.P_RPT_TYPE];
            var _param_TT       = [item.P_CIRCULARS, item.P_TCO_BUSPLACE_PK];
            var v_no_title      = "Mẫu số : S03a-DN ", e_no_title = "Form No : S03a-DN" , k_no_title = "양식번호 : S03a-DN";
            var v_dvt           = " Đơn vị tính", e_dvt = " Unit", k_dvt = " 단위";
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
                /********* Call store sign ***************/ 
                var _ac_code        = "EACAB031";
                var _store_sign     = "ac_rpt_6045085_sign";
                var _param_sign     = [item.P_COMPANY,_ac_code];
                var dt_Data_sign  = await DBService.callProcCursor(_store_sign, _param_sign, p_language, p_crt_by); 
                if (dt_Data_sign) 
                {
                    dt_Data_sign = dt_Data_sign;
                } 
                /****************Call CIRCULARS******************/
                var dt_TT  = await DBService.callProcCursor(_circular, _param_TT , p_language , p_crt_by); 
                if (dt_TT.length>0) 
                {
                    dt_TT = dt_TT;
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
                // r_item.getCell(1).value = Utils.translate("COMPANY",_dictionary , p_language) + ": " + COMP_ID +" - "+COMP_NM;    
                r_item.getCell(1).value = Utils.translate("COMPANY",_dictionary , p_language) + ": " +COMP_NM;    
                r_item = worksheet.getRow(2);
                r_item.getCell(1).value = Utils.translate("TAX_CODE",_dictionary, p_language) + ": "+ COMP_TAX;   
                r_item = worksheet.getRow(3);
                r_item.getCell(1).value = Utils.translate("ADDRESS",_dictionary , p_language) + ": "+ COMP_ADD;
                var FromDate = item.P_FR_DATE;
                var ToDate = item.P_FR_TO;
                var strFrDate = FromDate.substr(6,2) + "/"+ FromDate.substr(4,2)+ "/"+ FromDate.substr(0,4);
                var strToDate = ToDate.substr(6,2) + "/"+ ToDate.substr(4,2)+ "/"+ ToDate.substr(0,4);
            // worksheet.getCell("A6").value = "From date : " + strFrDate + " To date : " + strToDate;
                var _bookccy = item.P_BOOK_CCY;
                worksheet.getCell("K6").value = _bookccy;
                worksheet.mergeCells('A7', 'A8');
                worksheet.mergeCells('B7', 'C7');  
                worksheet.mergeCells('G7', 'I7'); 
                // thông tư
                var _lang = item.P_LANG;
                if(_lang == 'VIE'){
                    worksheet.getCell("G1").value =  v_no_title;
                    worksheet.getCell("G2").value =  dt_TT[0].V1 ;
                    worksheet.getCell("G3").value =  dt_TT[0].V2 ;
                    worksheet.getCell("A4").value = "Nhật Ký Chung";
                    worksheet.getCell("A5").value = "Từ ngày " + strFrDate + " đến ngày " + strToDate;
                    worksheet.getCell("J6").value = v_dvt;
                    //grid
                    
                    worksheet.getCell("A7").value = "Ngày tháng ghi sổ";
                    worksheet.getCell("B7").value = "Chứng từ";
                    worksheet.getCell("B8").value = "Số hiệu";
                    worksheet.getCell("C8").value = "Ngày";
                    worksheet.getCell("D7").value = "Diễn giải";
                    worksheet.getCell("E7").value = "Description";
                    worksheet.getCell("F7").value = "Đã ghi";
                    worksheet.getCell("F8").value = "SC";
                    worksheet.getCell("G7").value = "Số hiệu TK";
                    worksheet.getCell("G8").value = "Nợ";
                    worksheet.getCell("H8").value = "CS";
                    worksheet.getCell("I8").value = "Có";
                    worksheet.getCell("J7").value = "Số ghi sổ";
                    worksheet.mergeCells('K7', 'K8'); 
                }
                else{
                    worksheet.getCell("G1").value =  e_no_title;
                    worksheet.getCell("G2").value =  dt_TT[0].E1 ;
                    worksheet.getCell("G3").value =  dt_TT[0].E2 ;
                    worksheet.getCell("A5").value = "From date " + strFrDate + " To date " + strToDate;
                }
                var pos = 9; 
                var total_Amt  = 0;
                var _formatAmt = (_bookccy=='VND'?'_(* #,##0_);_(* (#,##0);_(* "-"_);_(@_)':'_(* #,##0.00_);_(* (#,##0.00);_(* "-"_);_(@_)');

                
               // Utils.excelInsertRows(worksheet, pos, dt_Data.length-1);
                if(dt_Data.length>1)
                {
                    worksheet.duplicateRow(pos,dt_Data.length-1,true);
                }  
                for (var i = 0; i < dt_Data.length; i++) 
                    {
                        var row_item = worksheet.getRow(pos);
                    //  var  _tr_date = dt_Data[i].TR_DATE.substr(6,2) + "/"+ dt_Data[i].TR_DATE.substr(4,2)+ "/"+ dt_Data[i].TR_DATE.substr(0,4);
                        row_item.getCell(1).value   = dt_Data[i].TR_DATE;    
                        row_item.getCell(2).value   = dt_Data[i].VOUCHERNO;  
                        row_item.getCell(3).value   = dt_Data[i].TR_DATE;
                        row_item.getCell(4).value   = dt_Data[i].REMARK2; 
                        row_item.getCell(5).value   = dt_Data[i].REMARK; 
                        row_item.getCell(6).value   = ""; 
                        row_item.getCell(7).value   = dt_Data[i].ACC_DR;  
                        row_item.getCell(8).value   = ""; 
                        row_item.getCell(9).value   = dt_Data[i].ACC_CR;  
                        row_item.getCell(10).value  = dt_Data[i].TR_BOOKAMT;  
                        row_item.getCell(10).numFmt = _formatAmt;
                        row_item.getCell(11).value  = dt_Data[i].PK;   
                        row_item.getCell(12).value  = dt_Data[i].STVAS_CODE;   
                        row_item.getCell(13).value  = dt_Data[i].M_CODE;   
                        row_item.getCell(14).value  = dt_Data[i].SUB_CODE;   
                        
                        total_Amt       += Number(dt_Data[i].TR_BOOKAMT);
                        pos = pos + 1; 
                        //row_item.commit();

                    }  
                var row = worksheet.getRow(pos);
                worksheet.mergeCells(pos,1,pos,5); 
                row.getCell(10).value  = total_Amt; 
                row.getCell(10).numFmt = _formatAmt;
                if(_lang == 'VIE'){
                    row.getCell(1).value = "Tổng cộng số phát sinh" 
                }
                else{
                    row.getCell(1).value = "Total Arising" 
                }
                /************sign */
                worksheet.mergeCells(pos+3,1,pos+3,2); 
                worksheet.mergeCells(pos+4,1,pos+4,2);   
                worksheet.mergeCells(pos+3,7,pos+3,10); 
                worksheet.mergeCells(pos+4,7,pos+4,10); 
                pos = pos + 3;
            
            if(dt_Data_sign.length>1)
            {
                for (var i = 0; i < dt_Data_sign.length; i++) 
                    {
                    if(_lang == 'VIE' )
                    {   row_item = worksheet.getRow(pos );
                        if (dt_Data_sign[i].CODE =='VIE')
                        {
                            row_item.getCell(1).value = dt_Data_sign[i].VAL1 ; 
                            row_item.getCell(1).font = { bold:true, italic:false };
                            row_item.getCell(4).value = dt_Data_sign[i].VAL2; 
                            row_item.getCell(4).font.bold = true;
                            row_item.getCell(7).value = dt_Data_sign[i].VAL3;                         
                            row_item.getCell(7).font.bold = true;
                            row_item.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
                            row_item.getCell(4).alignment = { vertical: 'middle', horizontal: 'center' };
                            row_item.getCell(7).alignment = { vertical: 'middle', horizontal: 'center' };
                        }
                        
                        row_item = worksheet.getRow(pos +1 );   
                        if (dt_Data_sign[i].CODE =='VIE_SIG')
                        {
                            row_item.getCell(1).value = dt_Data_sign[i].VAL1; 
                            row_item.getCell(1).font.bold = false;
                            row_item.getCell(4).value = dt_Data_sign[i].VAL2; 
                            row_item.getCell(4).font.bold = false;
                            row_item.getCell(7).value = dt_Data_sign[i].VAL3; 
                            row_item.getCell(7).font.bold = false;
                            row_item.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
                            row_item.getCell(7).alignment = { vertical: 'middle', horizontal: 'center' };  
                            row_item.getCell(4).alignment = { vertical: 'middle', horizontal: 'center' };                        
                        }    
                        
                    }
                    /* if(_lang == 'KOR' || _lang == 'KOR-VIE')
                    {
                        row_item = worksheet.getRow(pos ); 
                        if (dt_Data_sign[i].CODE =='KOR')
                        {
                            row_item.getCell(1).value = dt_Data_sign[i].VAL1; 
                            row_item.getCell(1).font.bold = true;    
                            row_item.getCell(4).value = dt_Data_sign[i].VAL2; 
                            row_item.getCell(4).font.bold = true;
                            row_item.getCell(7).value = dt_Data_sign[i].VAL3;                         
                            row_item.getCell(7).font.bold = true;
                            row_item.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' }; 
                            row_item.getCell(4).alignment = { vertical: 'middle', horizontal: 'center' };  
                            row_item.getCell(7).alignment = { vertical: 'middle', horizontal: 'center' };   

                        }
                        
                        row_item = worksheet.getRow(pos +1 );   
                        if (dt_Data_sign[i].CODE =='KOR_SIG')
                        {
                            row_item.getCell(1).value = dt_Data_sign[i].VAL1; 
                            row_item.getCell(1).font.bold = false;
                            row_item.getCell(4).value = dt_Data_sign[i].VAL2; 
                            row_item.getCell(4).font.bold = false;  
                            row_item.getCell(7).value = dt_Data_sign[i].VAL3;
                            row_item.getCell(7).font.bold = false;
                            row_item.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };     
                            row_item.getCell(7).alignment = { vertical: 'middle', horizontal: 'center' };    
                            row_item.getCell(4).alignment = { vertical: 'middle', horizontal: 'center' };                            
                        }   
                    }*/if(_lang == 'ENG' || _lang == 'ENG-KOR'|| _lang == 'ENG-VIE' )
                    {    row_item = worksheet.getRow(pos );
                        if (dt_Data_sign[i].CODE =='ENG')
                        {
                            row_item.getCell(1).value = dt_Data_sign[i].VAL1 + dt_Data_sign[i].VAL1 ; 
                            row_item.getCell(1).font.bold = true;  
                            row_item.getCell(4).value = dt_Data_sign[i].VAL2; 
                            row_item.getCell(4).font.bold = true;                               
                            row_item.getCell(7).value = dt_Data_sign[i].VAL3;                         
                            row_item.getCell(7).font.bold = true;
                            row_item.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };   
                            row_item.getCell(4).alignment = { vertical: 'middle', horizontal: 'center' };   
                            row_item.getCell(7).alignment = { vertical: 'middle', horizontal: 'center' }; 
                                
                        }
                        
                        row_item = worksheet.getRow(pos +1 );   
                        if (dt_Data_sign[i].CODE =='ENG_SIG')
                        {
                            row_item.getCell(1).value = dt_Data_sign[i].VAL1;                                
                            row_item.getCell(4).value = dt_Data_sign[i].VAL2; 
                            row_item.getCell(7).value = dt_Data_sign[i].VAL3;                             
                            row_item.getCell(1).font.bold = false;
                            row_item.getCell(4).font.bold = false;
                            row_item.getCell(7).font.bold = false;
                            row_item.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };   
                            row_item.getCell(4).alignment = { vertical: 'middle', horizontal: 'center' };   
                            row_item.getCell(7).alignment = { vertical: 'middle', horizontal: 'center' }; 

                        }    
                    }
                    if (dt_Data_sign[i].CODE =='NAME')
                    {
                        row_item = worksheet.getRow(pos +2 ); 
                        row_item.getCell(1).value = dt_Data_sign[i].VAL1; 
                        row_item.getCell(1).font.bold = false;
                        row_item.getCell(4).value = dt_Data_sign[i].VAL2; 
                        row_item.getCell(4).font.bold = false;
                        row_item.getCell(7).value = dt_Data_sign[i].VAL3;         
                        row_item.getCell(7).font.bold = false;
                        row_item.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };   
                        row_item.getCell(4).alignment = { vertical: 'middle', horizontal: 'center' };   
                        row_item.getCell(7).alignment = { vertical: 'middle', horizontal: 'center' }; 
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
            Utils.Logger({ LVL: "error", MODULE: "Report", FUNC: "rpt_6030070_NKC_ST", CONTENT: e.message })
        // return response.send(Utils.response(false, e.message, null))
        return response.send(null);
        }
    }    
    async rpt_6030070_HQ_2({ request, response, auth }) {
        try 
        { 
        /* P_RPT_ID: report_info.VAL1, P_RPT_URL: report_info.VAL2, P_RPT_FILE: report_info.VAL4,
                P_COMP_ID: company_info.PARTNER_ID, P_COMP_NM: company_info.TEXT, P_COMP_TAX: company_info.TAX_CODE, P_COMP_ADD: company_info.ADDR1,
                P_COMPANY: this.selectedCompany,P_ACC_PK: this.TAC_ABACCTCODE_PK, P_FR_DATE: this.from_date, P_FR_TO: this.to_date, 
                P_CCY: this.selectedCurrency,  P_BOOK_CCY: this.txtBookCCY, P_CIRCULARS: this.selectedCircular, P_PRINT_VOUCHER_NO : this.selectedPrintVoucherNo, 
                P_OPTION: this.selectedOptionListGLDT, P_POST_SUM : this.selectedPostSum, 
                P_LANG : this.selectedLanguage, P_DATE_NOW: this.datetime, P_TITLE : report_info.FNAME
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
            var _store          = "AC_RPT_6030070_HQ_02";
            var _circular       = "AC_SEL_GET_TT_BPL";
            var _param          = [item.P_COMPANY, item.P_FR_DATE, item.P_FR_TO, item.P_TCO_BUSPLACE_PK]
        //  var _param          = [item.P_COMPANY, item.P_FR_DATE, item.P_FR_TO, item.P_ACC_PK, item.P_PARTNER_PK, item.P_STATUS, item.P_VOUCHER_NO , item.P_SEQ, item.P_BOOK_CCY, item.P_VOUCHER_TYPE, item.P_CIRCULARS, item.P_LANG];
            var _param_TT       = [item.P_CIRCULARS, item.P_TCO_BUSPLACE_PK];
            var _ac_code        = "EACAB031";
            var _store_sign     = "ac_rpt_6045085_sign";
            var _param_sign     = [item.P_COMPANY,_ac_code];

            var v_no_title = "Mẫu số : S03a-DN ", e_no_title = "Form No : S03a-DN" , k_no_title = "양식번호 : S03a-DN";
            var v_dvt = " Đơn vị tính", e_dvt = " Unit", k_dvt = " 단위";
            //var v_fdate = "Từ ngày ", e_fdate = "From ", k_fdate ="부터 ", v_tdate = " đến ngày", e_tdate = " to", k_tdate =" 까지";
            //var v_month = " Tháng này", e_month = " This month", k_month = " 이번 달"; 
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
                /********* Call store sign ***************/ 
                var dt_Data_sign  = await DBService.callProcCursor(_store_sign, _param_sign, p_language, p_crt_by); 
                if (dt_Data_sign) 
                {
                    dt_Data_sign = dt_Data_sign;
                } 
                /****************Call CIRCULARS******************/
                var dt_TT  = await DBService.callProcCursor(_circular, _param_TT , p_language , p_crt_by); 
                if (dt_TT.length>0) 
                {
                    dt_TT = dt_TT;
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
                r_item.getCell(1).value = Utils.translate("COMPANY",_dictionary , p_language) + ": " +item.P_BIZ_NM;    
                r_item = worksheet.getRow(2);
                r_item.getCell(1).value = Utils.translate("TAX_CODE",_dictionary, p_language) + ": "+ item.P_BIZ_TAX;   
                r_item = worksheet.getRow(3);
                r_item.getCell(1).value = Utils.translate("ADDRESS",_dictionary , p_language) + ": "+ item.P_BIZ_ADD;
                /*var title_a4 = "";
                var FromDate = item.P_FR_DATE;
                var ToDate = item.P_FR_TO;
                var strFrDate = FromDate.substr(6,2) + "/"+ FromDate.substr(4,2)+ "/"+ FromDate.substr(0,4);
                var strToDate = ToDate.substr(6,2) + "/"+ ToDate.substr(4,2)+ "/"+ ToDate.substr(0,4);
                var _bookccy = item.P_BOOK_CCY;
                worksheet.getCell("K6").value = _bookccy;
                worksheet.getCell("A5").value = "Từ ngày " + strFrDate + " đến ngày " + strToDate;
                worksheet.getCell("J6").value = v_dvt;*/
                var _title = item.P_TITLE;
                worksheet.getCell("A4").value = _title;
                // thông tư
                /*var _lang = item.P_LANG;
                if(_lang == 'VIE'){
                    worksheet.getCell("G1").value =  v_no_title ;
                    worksheet.getCell("G2").value =  dt_TT[0].V1 ;
                    worksheet.getCell("G3").value =  dt_TT[0].V2 ;
                    var _title = item.P_TITLE;
                    worksheet.getCell("A4").value = _title;
                    worksheet.getCell("A5").value = "Từ ngày " + strFrDate + " đến ngày " + strToDate;
                    worksheet.getCell("J6").value = v_dvt;
                    //grid
                    worksheet.mergeCells('A7', 'A8'); 
                    worksheet.getCell("A7").value = "Ngày tháng ghi sổ";
                    worksheet.mergeCells('B7', 'C7'); 
                    worksheet.getCell("B7").value = "Chứng từ";
                    worksheet.getCell("B8").value = "Số hiệu";
                    worksheet.getCell("C8").value = "Ngày";
                    worksheet.getCell("D7").value = "Diễn giải";
                    worksheet.getCell("E7").value = "Description";
                    worksheet.getCell("F7").value = "Đã ghi";
                    worksheet.getCell("F8").value = "SC";
                    worksheet.mergeCells('G7', 'I7'); 
                    worksheet.getCell("G7").value = "Số hiệu TK";
                    worksheet.getCell("G8").value = "Nợ";
                    worksheet.getCell("H8").value = "CS";
                    worksheet.getCell("I8").value = "Có";
                    worksheet.getCell("J7").value = "Số phát sinh";
                    worksheet.getCell("K7").value = "Ghi chú";
                    worksheet.getCell("K8").value = "Seq";
                    worksheet.mergeCells('L7', 'M7'); 
                    worksheet.getCell("L7").value = "Đối tượng";
                    worksheet.getCell("L8").value = "Mã";
                    worksheet.getCell("M8").value = "Tên";
                    worksheet.mergeCells('N7', 'O7'); 
                    worksheet.getCell("N8").value = "Mã";
                    worksheet.getCell("O8").value = "Tên";
                    worksheet.getCell("P7").value = "Số phát sinh";
                    worksheet.getCell("P8").value = "Convertible CCY";
                    worksheet.getCell("Q7").value = "Số phát sinh";
                    worksheet.getCell("Q8").value = "(Trans)";
                    worksheet.mergeCells('R7', 'R8') ;
                    worksheet.getCell("R8").value = "Tiền tệ"; 
                    worksheet.mergeCells('S7', 'S8') ; 
                    worksheet.getCell("S8").value = "Tỷ giá"; 
                    worksheet.mergeCells('T7', 'T8') ; 
                    worksheet.getCell("T8").value = "Số hóa đơn";
                    worksheet.mergeCells('U7', 'U8') ; 
                    worksheet.getCell("U8").value = "Số tờ khai";
                    worksheet.mergeCells('V7', 'V8') ; 
                    worksheet.getCell("V8").value = "Tên TK Nợ";
                    worksheet.mergeCells('W7', 'W8') ; 
                    worksheet.getCell("W8").value= "Tên TK Có";
                    worksheet.mergeCells('X7', 'X8') ; 

                    worksheet.getCell("X8").value = "Ngày hóa đơn";
                    worksheet.mergeCells('Y7', 'Y8') ; 
                    worksheet.getCell("Y8").value = "Số TK ngân hàng nợ";
                    worksheet.mergeCells('Z7', 'Z8') ;
                    worksheet.getCell("Z8").value = "Số TK ngân hàng có"; 
                    worksheet.mergeCells('AA7', 'AB7') ; 
                    worksheet.getCell("AA7").value = "Đối tượng (DR)";
                    worksheet.getCell("AA8").value = "Mã";
                    worksheet.getCell('AB8').value = "Tên";
                    worksheet.mergeCells('AC7', 'AD7') ; 
                    worksheet.getCell("AC7").value = "Đối tượng (CR)";
                    worksheet.getCell("AC8").value = "Mã";
                    worksheet.getCell("AD8").value = "Tên";
                    worksheet.mergeCells('AE7', 'AE8') ;
                    worksheet.getCell("AE8").value = "Mã quản lý"; 
                    worksheet.mergeCells('AF7', 'AF8'); 
                    worksheet.getCell("AF8").value = "Tên quản lý"; 

                }
                else if(_lang == 'KOR'){
                    worksheet.getCell("G1").value =  k_no_title ;
                    worksheet.getCell("G2").value =  "(재무부의 2014년 12월 22일 NO: 200/2014/TT-BTC" ;
                    worksheet.getCell("G3").value =  "통지에 의한 양식임)";
                    _title = "분개장";
                    worksheet.getCell("A4").value = _title;
                    worksheet.getCell("A5").value =  strFrDate + " ~ " + strToDate;
                    worksheet.getCell("J6").value = k_dvt;

                    //grid
                    worksheet.mergeCells('A7', 'A8'); 
                    worksheet.getCell("A7").value = "거래일자";
                    worksheet.mergeCells('B7', 'C7'); 
                    worksheet.getCell("B7").value = "전표번호";
                    worksheet.getCell("B8").value = "번호";
                    worksheet.getCell("C8").value = "일자";
                    worksheet.getCell("D7").value = "적요 (베트남어)";
                    worksheet.getCell("E7").value = "적요 (영어)";
                    worksheet.getCell("F7").value = "Đã ghi";
                    worksheet.getCell("F8").value = "SC";
                    worksheet.mergeCells('G7', 'I7'); 
                    worksheet.getCell("G7").value = "계정코드";
                    worksheet.getCell("G8").value = "차변";
                    worksheet.getCell("H8").value = "CS";
                    worksheet.getCell("I8").value = "대변";
                    worksheet.getCell("J7").value = "금액";
                    worksheet.getCell("K7").value = "비고명";
                    worksheet.getCell("K8").value = "Seq";
                    worksheet.mergeCells('L7', 'M7'); 
                    worksheet.getCell("L7").value = "거래처 코드 번호";
                    worksheet.getCell("L8").value = "사업자번호";
                    worksheet.getCell("M8").value = "사업자명";
                    worksheet.mergeCells('N7', 'O7'); 
                    worksheet.getCell("N8").value ="손익부서";
                    worksheet.getCell("N8").value = "부서";
                    worksheet.getCell("O8").value = "부서명";
                    worksheet.getCell("P7").value = "금액";
                    worksheet.getCell("P8").value = "Convertible CCY";
                    worksheet.getCell("Q7").value = "금액";
                    worksheet.getCell("Q8").value = "(Trans)";
                    worksheet.mergeCells('R7', 'R8') ;
                    worksheet.getCell("R8").value = "통화"; 
                    worksheet.mergeCells('S7', 'S8') ; 
                    worksheet.getCell("S8").value = "환율"; 
                    worksheet.mergeCells('T7', 'T8') ; 
                    worksheet.getCell("T8").value = "부가세전표번호";
                    worksheet.mergeCells('U7', 'U8') ; 
                    worksheet.getCell("U8").value = "Declare no.";
                    worksheet.mergeCells('V7', 'V8') ; 
                    worksheet.getCell("V8").value = "차변계정명";
                    worksheet.mergeCells('W7', 'W8') ; 
                    worksheet.getCell("W8").value= "대변계정명";
                    worksheet.mergeCells('X7', 'X8') ; 

                    worksheet.getCell("X8").value = "세금계산서 발행일";
                    worksheet.mergeCells('Y7', 'Y8') ; 
                    worksheet.getCell("Y8").value = "계좌번호";
                    worksheet.mergeCells('Z7', 'Z8') ;
                    worksheet.getCell("Z8").value = "계좌번호"; 
                    worksheet.mergeCells('AA7', 'AB7') ; 
                    worksheet.getCell("AA7").value = "거래처 코드 번호 (차변 )";
                    worksheet.getCell("AA8").value = "거래처코드";
                    worksheet.getCell('AB8').value = "거래처명";
                    worksheet.mergeCells('AC7', 'AD7') ; 
                    worksheet.getCell("AC7").value = "거래처 코드 번호 (대변)";
                    worksheet.getCell("AC8").value = "거래처코드";
                    worksheet.getCell("AD8").value = "거래처명";
                    worksheet.mergeCells('AE7', 'AE8') ;
                    worksheet.getCell("AE8").value = "관리코드"; 
                    worksheet.mergeCells('AF7', 'AF8'); 
                    worksheet.getCell("AF8").value = "비고코드"; 

                }
                else{
                    worksheet.getCell("G1").value =  e_no_title ;
                    worksheet.getCell("G2").value =  dt_TT[0].E1 ;
                    worksheet.getCell("G3").value =  dt_TT[0].E2 ;
                    _title = "GENERAL JOURNAL";
                    worksheet.getCell("A4").value =  _title;
                    worksheet.getCell("A5").value = "From date " + strFrDate + " To date " + strToDate;
                    worksheet.getCell("J6").value = e_dvt;
                    // grid
                    worksheet.mergeCells('A7', 'A8'); 
                    worksheet.mergeCells('B7', 'C7'); 
                // worksheet.getCell("B8").value = "No";
                // worksheet.getCell("C8").value = "Date";
                    worksheet.mergeCells('G7', 'I7'); 
                    worksheet.mergeCells('L7', 'M7'); 
                    worksheet.mergeCells('N7', 'O7'); 
                    worksheet.mergeCells('R7', 'R8') ;
                    worksheet.mergeCells('S7', 'S8') ; 
                    worksheet.mergeCells('T7', 'T8') ; 
                    worksheet.mergeCells('U7', 'U8') ; 
                    worksheet.mergeCells('V7', 'V8') ; 
                    worksheet.mergeCells('W7', 'W8') ; 
                    worksheet.mergeCells('X7', 'X8') ; 
                    worksheet.mergeCells('Y7', 'Y8') ; 
                    worksheet.mergeCells('Z7', 'Z8') ;
                    worksheet.mergeCells('AA7', 'AB7') ; 
                    worksheet.mergeCells('AC7', 'AD7') ; 
                    worksheet.mergeCells('AE7', 'AE8') ;
                    worksheet.mergeCells('AF7', 'AF8'); 


                }*/
                var pos = 9; 
                var total_amt   = 0;
                /*var total_fcamd  = 0;
                var total_cdam   = 0;
                var total_fcamc  = 0;
                var total_dbba   = 0;
                var total_cdba   = 0;*/

                if(dt_Data.length>1)
                {
                    worksheet.duplicateRow(pos,dt_Data.length-1,true);
                }  
                for (var i = 0; i < dt_Data.length; i++) 
                {
                    var row_item = worksheet.getRow(pos);
                    row_item.getCell(1).value   =  dt_Data[i].RSM_FISCAL_YM
                    row_item.getCell(2).value   =  dt_Data[i].RSM_RSLT_TYPE_GUBUN
                    row_item.getCell(3).value   =  dt_Data[i].RSM_RSLT_SEQ
                    row_item.getCell(4).value   =  dt_Data[i].RSM_ACCT_UNIT_CD
                    row_item.getCell(5).value   =  dt_Data[i].RSM_ACCT_CD
                    row_item.getCell(6).value   =  dt_Data[i].RSM_RSLT_AMT
                    row_item.getCell(7).value    = dt_Data[i].RSM_ADJ_REASON
                    row_item.getCell(8).value    = dt_Data[i].RSM_ORG_ACCT_UNIT_CD
                    row_item.getCell(9).value    = dt_Data[i].RSM_ORG_ACCT_CD
                    row_item.getCell(10).value   = dt_Data[i].RSM_REGANT_ID
                    row_item.getCell(11).value   = Utils._formatDate(dt_Data[i].RSM_REG_DATE, "MM/DD/YYYY hh:mm:ss A")
                    row_item.getCell(12).value   = dt_Data[i].RSM_UPDER_ID
                    row_item.getCell(13).value   = Utils._formatDate(dt_Data[i].RSM_UPD_DATE, "MM/DD/YYYY hh:mm:ss A")
                    row_item.getCell(14).value   = dt_Data[i].RSM_UPDN_GUBUN
                    row_item.getCell(15).value   = Utils._formatDate(dt_Data[i].RSM_UPDN_DATE, "MM/DD/YYYY hh:mm:ss A")
                    row_item.getCell(16).value   = dt_Data[i].RSM_CR_JSYB
                    row_item.getCell(17).value   = Utils._formatDate(dt_Data[i].RSM_CR_DATE, "MM/DD/YYYY hh:mm:ss A")
                    pos = pos + 1; 
                    total_amt      += Number(dt_Data[i].RSM_RSLT_AMT);
                    //row_item.commit();

                }  
                var row = worksheet.getRow(pos);
                worksheet.mergeCells(pos,1,pos,5); 
                row.getCell(1).value = "Total Arising" 
                row.getCell(6).value  = total_amt;
                /*row.getCell(18).value  = total_fcamd;
                row.getCell(19).value  = total_cdam;
                row.getCell(20).value  = total_fcamc;
                row.getCell(21).value  = total_dbba;
                row.getCell(22).value  = total_cdba;*/
                /************sign*/
                /*worksheet.mergeCells(pos+3,1,pos+3,2); 
                worksheet.mergeCells(pos+4,1,pos+4,2);   
                worksheet.mergeCells(pos+3,7,pos+3,10); 
                worksheet.mergeCells(pos+4,7,pos+4,10); 
                pos = pos + 3;*/
            
        /* if(dt_Data_sign.length>1)
            {
                for (var i = 0; i < dt_Data_sign.length; i++) 
                    {
                    if(_lang == 'VIE' )
                    {   row_item = worksheet.getRow(pos );
                        if (dt_Data_sign[i].CODE =='VIE')
                        {
                            row_item.getCell(1).value = dt_Data_sign[i].VAL1 ; 
                            row_item.getCell(1).font.bold = false;
                            row_item.getCell(4).value = dt_Data_sign[i].VAL2; 
                            row_item.getCell(4).font.bold = true;
                            row_item.getCell(7).value = dt_Data_sign[i].VAL3;                         
                            row_item.getCell(7).font.bold = true;
                            row_item.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
                            row_item.getCell(4).alignment = { vertical: 'middle', horizontal: 'center' };
                            row_item.getCell(7).alignment = { vertical: 'middle', horizontal: 'center' };
                        }
                        
                        row_item = worksheet.getRow(pos +1 );   
                        if (dt_Data_sign[i].CODE =='VIE_SIG')
                        {
                            row_item.getCell(1).value = dt_Data_sign[i].VAL1; 
                            row_item.getCell(1).font.bold = false;
                            row_item.getCell(4).value = dt_Data_sign[i].VAL2; 
                            row_item.getCell(4).font.bold = false;
                            row_item.getCell(7).value = dt_Data_sign[i].VAL3; 
                            row_item.getCell(7).font.bold = false;
                            row_item.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
                            row_item.getCell(7).alignment = { vertical: 'middle', horizontal: 'center' };  
                            row_item.getCell(4).alignment = { vertical: 'middle', horizontal: 'center' };                        
                        }    
                        
                    }
                    if(_lang == 'KOR' || _lang == 'KOR-VIE')
                    {
                        row_item = worksheet.getRow(pos ); 
                        if (dt_Data_sign[i].CODE =='KOR')
                        {
                            row_item.getCell(1).value = dt_Data_sign[i].VAL1; 
                            row_item.getCell(1).font.bold = true;    
                            row_item.getCell(4).value = dt_Data_sign[i].VAL2; 
                            row_item.getCell(4).font.bold = true;
                            row_item.getCell(7).value = dt_Data_sign[i].VAL3;                         
                            row_item.getCell(7).font.bold = true;
                            row_item.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' }; 
                            row_item.getCell(4).alignment = { vertical: 'middle', horizontal: 'center' };  
                            row_item.getCell(7).alignment = { vertical: 'middle', horizontal: 'center' };   

                        }
                        
                        row_item = worksheet.getRow(pos +1 );   
                        if (dt_Data_sign[i].CODE =='KOR_SIG')
                        {
                            row_item.getCell(1).value = dt_Data_sign[i].VAL1; 
                            row_item.getCell(1).font.bold = false;
                            row_item.getCell(4).value = dt_Data_sign[i].VAL2; 
                            row_item.getCell(4).font.bold = false;  
                            row_item.getCell(7).value = dt_Data_sign[i].VAL3;
                            row_item.getCell(7).font.bold = false;
                            row_item.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };     
                            row_item.getCell(7).alignment = { vertical: 'middle', horizontal: 'center' };    
                            row_item.getCell(4).alignment = { vertical: 'middle', horizontal: 'center' };                            
                        }    
                    }if(_lang == 'ENG' || _lang == 'ENG-KOR'|| _lang == 'ENG-VIE' )
                    {    row_item = worksheet.getRow(pos );
                        if (dt_Data_sign[i].CODE =='ENG')
                        {
                            row_item.getCell(1).value = dt_Data_sign[i].VAL1 + dt_Data_sign[i].VAL1 ; 
                            row_item.getCell(1).font.bold = true;  
                            row_item.getCell(4).value = dt_Data_sign[i].VAL2; 
                            row_item.getCell(4).font.bold = true;                               
                            row_item.getCell(7).value = dt_Data_sign[i].VAL3;                         
                            row_item.getCell(7).font.bold = true;
                            row_item.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };   
                            row_item.getCell(4).alignment = { vertical: 'middle', horizontal: 'center' };   
                            row_item.getCell(7).alignment = { vertical: 'middle', horizontal: 'center' }; 
                                
                        }
                        
                        row_item = worksheet.getRow(pos +1 );   
                        if (dt_Data_sign[i].CODE =='ENG_SIG')
                        {
                            row_item.getCell(1).value = dt_Data_sign[i].VAL1;                                
                            row_item.getCell(4).value = dt_Data_sign[i].VAL2; 
                            row_item.getCell(7).value = dt_Data_sign[i].VAL3;                             
                            row_item.getCell(1).font.bold = false;
                            row_item.getCell(4).font.bold = false;
                            row_item.getCell(7).font.bold = false;
                            row_item.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };   
                            row_item.getCell(4).alignment = { vertical: 'middle', horizontal: 'center' };   
                            row_item.getCell(7).alignment = { vertical: 'middle', horizontal: 'center' }; 

                        }    
                    }
                    if (dt_Data_sign[i].CODE =='NAME')
                    {
                        row_item = worksheet.getRow(pos +2 ); 
                        row_item.getCell(1).value = dt_Data_sign[i].VAL1; 
                        row_item.getCell(1).font.bold = false;
                        row_item.getCell(4).value = dt_Data_sign[i].VAL2; 
                        row_item.getCell(4).font.bold = false;
                        row_item.getCell(7).value = dt_Data_sign[i].VAL3;         
                        row_item.getCell(7).font.bold = false;
                        row_item.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };   
                        row_item.getCell(4).alignment = { vertical: 'middle', horizontal: 'center' };   
                        row_item.getCell(7).alignment = { vertical: 'middle', horizontal: 'center' }; 
                    }
                        
                    }
            }*/
            worksheet.name = _title;
                /********* Print file excel ********/
                const reportFile    = Helpers.tmpPath(file_new);
                await workbook.xlsx.writeFile(reportFile)
                return response.attachment( reportFile, file_new);
            }
        } 
        catch (e) 
        {
            Utils.Logger({ LVL: "error", MODULE: "Report", FUNC: "rpt_6030070_HQ_2", CONTENT: e.message })
        // return response.send(Utils.response(false, e.message, null))
        return response.send(null);
        }
    }  
    async rpt_6030070_HQ_1({ request, response, auth }) {
        try 
        { 
        /* P_RPT_ID: report_info.VAL1, P_RPT_URL: report_info.VAL2, P_RPT_FILE: report_info.VAL4,
                P_COMP_ID: company_info.PARTNER_ID, P_COMP_NM: company_info.TEXT, P_COMP_TAX: company_info.TAX_CODE, P_COMP_ADD: company_info.ADDR1,
                P_COMPANY: this.selectedCompany,P_ACC_PK: this.TAC_ABACCTCODE_PK, P_FR_DATE: this.from_date, P_FR_TO: this.to_date, 
                P_CCY: this.selectedCurrency,  P_BOOK_CCY: this.txtBookCCY, P_CIRCULARS: this.selectedCircular, P_PRINT_VOUCHER_NO : this.selectedPrintVoucherNo, 
                P_OPTION: this.selectedOptionListGLDT, P_POST_SUM : this.selectedPostSum, P_LANG : this.selectedLanguage, P_DATE_NOW: this.datetime, P_TITLE : report_info.FNAME
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
            var _store          = "AC_RPT_6030070_HQ_01";
            var _circular       = "AC_SEL_GET_TT_BPL";
            var _param          = [item.P_COMPANY, item.P_FR_DATE, item.P_FR_TO, item.P_TCO_BUSPLACE_PK]
          //  var _param          = [item.P_COMPANY, item.P_FR_DATE, item.P_FR_TO, item.P_ACC_PK, item.P_PARTNER_PK, item.P_STATUS, item.P_VOUCHER_NO , item.P_SEQ, item.P_BOOK_CCY, item.P_VOUCHER_TYPE, item.P_CIRCULARS, item.P_LANG];
            var _param_TT       = [item.P_CIRCULARS, item.P_TCO_BUSPLACE_PK];
            var _ac_code        = "EACAB031";
            var _store_sign     = "ac_rpt_6045085_sign";
            var _param_sign     = [item.P_COMPANY,_ac_code];

            var v_no_title = "Mẫu số : S03a-DN ", e_no_title = "Form No : S03a-DN" , k_no_title = "양식번호 : S03a-DN";
            var v_dvt = " Đơn vị tính", e_dvt = " Unit", k_dvt = " 단위";
            //var v_fdate = "Từ ngày ", e_fdate = "From ", k_fdate ="부터 ", v_tdate = " đến ngày", e_tdate = " to", k_tdate =" 까지";
            //var v_month = " Tháng này", e_month = " This month", k_month = " 이번 달"; 
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
                /********* Call store sign ***************/ 
                var dt_Data_sign  = await DBService.callProcCursor(_store_sign, _param_sign, p_language, p_crt_by); 
                if (dt_Data_sign) 
                {
                    dt_Data_sign = dt_Data_sign;
                } 
                /****************Call CIRCULARS******************/
                var dt_TT  = await DBService.callProcCursor(_circular, _param_TT , p_language , p_crt_by); 
                if (dt_TT.length>0) 
                {
                    dt_TT = dt_TT;
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
                r_item.getCell(1).value = Utils.translate("COMPANY",_dictionary , p_language) + ": " +COMP_NM;    
                r_item = worksheet.getRow(2);
                r_item.getCell(1).value = Utils.translate("TAX_CODE",_dictionary, p_language) + ": "+ COMP_TAX;   
                r_item = worksheet.getRow(3);
                r_item.getCell(1).value = Utils.translate("ADDRESS",_dictionary , p_language) + ": "+ COMP_ADD;
               /* var title_a4 = "";
                var FromDate = item.P_FR_DATE;
                var ToDate = item.P_FR_TO;
                var strFrDate = FromDate.substr(6,2) + "/"+ FromDate.substr(4,2)+ "/"+ FromDate.substr(0,4);
                var strToDate = ToDate.substr(6,2) + "/"+ ToDate.substr(4,2)+ "/"+ ToDate.substr(0,4);
                var _bookccy = item.P_BOOK_CCY;
                worksheet.getCell("K6").value = _bookccy;
                worksheet.getCell("A5").value = "Từ ngày " + strFrDate + " đến ngày " + strToDate;
                worksheet.getCell("J6").value = v_dvt; */
                var _title = item.P_TITLE;
                worksheet.getCell("A4").value = _title;
                // thông tư
                /*var _lang = item.P_LANG;
                if(_lang == 'VIE'){
                    worksheet.getCell("G1").value =  v_no_title ;
                    worksheet.getCell("G2").value =  dt_TT[0].V1 ;
                    worksheet.getCell("G3").value =  dt_TT[0].V2 ;
                    var _title = item.P_TITLE;
                    worksheet.getCell("A4").value = _title;
                    worksheet.getCell("A5").value = "Từ ngày " + strFrDate + " đến ngày " + strToDate;
                    worksheet.getCell("J6").value = v_dvt;
                    //grid
                    worksheet.mergeCells('A7', 'A8'); 
                    worksheet.getCell("A7").value = "Ngày tháng ghi sổ";
                    worksheet.mergeCells('B7', 'C7'); 
                    worksheet.getCell("B7").value = "Chứng từ";
                    worksheet.getCell("B8").value = "Số hiệu";
                    worksheet.getCell("C8").value = "Ngày";
                    worksheet.getCell("D7").value = "Diễn giải";
                    worksheet.getCell("E7").value = "Description";
                    worksheet.getCell("F7").value = "Đã ghi";
                    worksheet.getCell("F8").value = "SC";
                    worksheet.mergeCells('G7', 'I7'); 
                    worksheet.getCell("G7").value = "Số hiệu TK";
                    worksheet.getCell("G8").value = "Nợ";
                    worksheet.getCell("H8").value = "CS";
                    worksheet.getCell("I8").value = "Có";
                    worksheet.getCell("J7").value = "Số phát sinh";
                    worksheet.getCell("K7").value = "Ghi chú";
                    worksheet.getCell("K8").value = "Seq";
                    worksheet.mergeCells('L7', 'M7'); 
                    worksheet.getCell("L7").value = "Đối tượng";
                    worksheet.getCell("L8").value = "Mã";
                    worksheet.getCell("M8").value = "Tên";
                    worksheet.mergeCells('N7', 'O7'); 
                    worksheet.getCell("N8").value = "Mã";
                    worksheet.getCell("O8").value = "Tên";
                    worksheet.getCell("P7").value = "Số phát sinh";
                    worksheet.getCell("P8").value = "Convertible CCY";
                    worksheet.getCell("Q7").value = "Số phát sinh";
                    worksheet.getCell("Q8").value = "(Trans)";
                    worksheet.mergeCells('R7', 'R8') ;
                    worksheet.getCell("R8").value = "Tiền tệ"; 
                    worksheet.mergeCells('S7', 'S8') ; 
                    worksheet.getCell("S8").value = "Tỷ giá"; 
                    worksheet.mergeCells('T7', 'T8') ; 
                    worksheet.getCell("T8").value = "Số hóa đơn";
                    worksheet.mergeCells('U7', 'U8') ; 
                    worksheet.getCell("U8").value = "Số tờ khai";
                    worksheet.mergeCells('V7', 'V8') ; 
                    worksheet.getCell("V8").value = "Tên TK Nợ";
                    worksheet.mergeCells('W7', 'W8') ; 
                    worksheet.getCell("W8").value= "Tên TK Có";
                    worksheet.mergeCells('X7', 'X8') ; 

                    worksheet.getCell("X8").value = "Ngày hóa đơn";
                    worksheet.mergeCells('Y7', 'Y8') ; 
                    worksheet.getCell("Y8").value = "Số TK ngân hàng nợ";
                    worksheet.mergeCells('Z7', 'Z8') ;
                    worksheet.getCell("Z8").value = "Số TK ngân hàng có"; 
                    worksheet.mergeCells('AA7', 'AB7') ; 
                    worksheet.getCell("AA7").value = "Đối tượng (DR)";
                    worksheet.getCell("AA8").value = "Mã";
                    worksheet.getCell('AB8').value = "Tên";
                    worksheet.mergeCells('AC7', 'AD7') ; 
                    worksheet.getCell("AC7").value = "Đối tượng (CR)";
                    worksheet.getCell("AC8").value = "Mã";
                    worksheet.getCell("AD8").value = "Tên";
                    worksheet.mergeCells('AE7', 'AE8') ;
                    worksheet.getCell("AE8").value = "Mã quản lý"; 
                    worksheet.mergeCells('AF7', 'AF8'); 
                    worksheet.getCell("AF8").value = "Tên quản lý"; 

                }
                else if(_lang == 'KOR'){
                    worksheet.getCell("G1").value =  k_no_title ;
                    worksheet.getCell("G2").value =  "(재무부의 2014년 12월 22일 NO: 200/2014/TT-BTC" ;
                    worksheet.getCell("G3").value =  "통지에 의한 양식임)";
                    _title = "분개장";
                    worksheet.getCell("A4").value = _title;
                    worksheet.getCell("A5").value =  strFrDate + " ~ " + strToDate;
                    worksheet.getCell("J6").value = k_dvt;

                    //grid
                    worksheet.mergeCells('A7', 'A8'); 
                    worksheet.getCell("A7").value = "거래일자";
                    worksheet.mergeCells('B7', 'C7'); 
                    worksheet.getCell("B7").value = "전표번호";
                    worksheet.getCell("B8").value = "번호";
                    worksheet.getCell("C8").value = "일자";
                    worksheet.getCell("D7").value = "적요 (베트남어)";
                    worksheet.getCell("E7").value = "적요 (영어)";
                    worksheet.getCell("F7").value = "Đã ghi";
                    worksheet.getCell("F8").value = "SC";
                    worksheet.mergeCells('G7', 'I7'); 
                    worksheet.getCell("G7").value = "계정코드";
                    worksheet.getCell("G8").value = "차변";
                    worksheet.getCell("H8").value = "CS";
                    worksheet.getCell("I8").value = "대변";
                    worksheet.getCell("J7").value = "금액";
                    worksheet.getCell("K7").value = "비고명";
                    worksheet.getCell("K8").value = "Seq";
                    worksheet.mergeCells('L7', 'M7'); 
                    worksheet.getCell("L7").value = "거래처 코드 번호";
                    worksheet.getCell("L8").value = "사업자번호";
                    worksheet.getCell("M8").value = "사업자명";
                    worksheet.mergeCells('N7', 'O7'); 
                    worksheet.getCell("N8").value ="손익부서";
                    worksheet.getCell("N8").value = "부서";
                    worksheet.getCell("O8").value = "부서명";
                    worksheet.getCell("P7").value = "금액";
                    worksheet.getCell("P8").value = "Convertible CCY";
                    worksheet.getCell("Q7").value = "금액";
                    worksheet.getCell("Q8").value = "(Trans)";
                    worksheet.mergeCells('R7', 'R8') ;
                    worksheet.getCell("R8").value = "통화"; 
                    worksheet.mergeCells('S7', 'S8') ; 
                    worksheet.getCell("S8").value = "환율"; 
                    worksheet.mergeCells('T7', 'T8') ; 
                    worksheet.getCell("T8").value = "부가세전표번호";
                    worksheet.mergeCells('U7', 'U8') ; 
                    worksheet.getCell("U8").value = "Declare no.";
                    worksheet.mergeCells('V7', 'V8') ; 
                    worksheet.getCell("V8").value = "차변계정명";
                    worksheet.mergeCells('W7', 'W8') ; 
                    worksheet.getCell("W8").value= "대변계정명";
                    worksheet.mergeCells('X7', 'X8') ; 

                    worksheet.getCell("X8").value = "세금계산서 발행일";
                    worksheet.mergeCells('Y7', 'Y8') ; 
                    worksheet.getCell("Y8").value = "계좌번호";
                    worksheet.mergeCells('Z7', 'Z8') ;
                    worksheet.getCell("Z8").value = "계좌번호"; 
                    worksheet.mergeCells('AA7', 'AB7') ; 
                    worksheet.getCell("AA7").value = "거래처 코드 번호 (차변 )";
                    worksheet.getCell("AA8").value = "거래처코드";
                    worksheet.getCell('AB8').value = "거래처명";
                    worksheet.mergeCells('AC7', 'AD7') ; 
                    worksheet.getCell("AC7").value = "거래처 코드 번호 (대변)";
                    worksheet.getCell("AC8").value = "거래처코드";
                    worksheet.getCell("AD8").value = "거래처명";
                    worksheet.mergeCells('AE7', 'AE8') ;
                    worksheet.getCell("AE8").value = "관리코드"; 
                    worksheet.mergeCells('AF7', 'AF8'); 
                    worksheet.getCell("AF8").value = "비고코드"; 

                }
                else{
                    worksheet.getCell("G1").value =  e_no_title ;
                    worksheet.getCell("G2").value =  dt_TT[0].E1 ;
                    worksheet.getCell("G3").value =  dt_TT[0].E2 ;
                    _title = "GENERAL JOURNAL";
                    worksheet.getCell("A4").value =  _title;
                    worksheet.getCell("A5").value = "From date " + strFrDate + " To date " + strToDate;
                    worksheet.getCell("J6").value = e_dvt;
                    // grid
                    worksheet.mergeCells('A7', 'A8'); 
                    worksheet.mergeCells('B7', 'C7'); 
                // worksheet.getCell("B8").value = "No";
                // worksheet.getCell("C8").value = "Date";
                    worksheet.mergeCells('G7', 'I7'); 
                    worksheet.mergeCells('L7', 'M7'); 
                    worksheet.mergeCells('N7', 'O7'); 
                    worksheet.mergeCells('R7', 'R8') ;
                    worksheet.mergeCells('S7', 'S8') ; 
                    worksheet.mergeCells('T7', 'T8') ; 
                    worksheet.mergeCells('U7', 'U8') ; 
                    worksheet.mergeCells('V7', 'V8') ; 
                    worksheet.mergeCells('W7', 'W8') ; 
                    worksheet.mergeCells('X7', 'X8') ; 
                    worksheet.mergeCells('Y7', 'Y8') ; 
                    worksheet.mergeCells('Z7', 'Z8') ;
                    worksheet.mergeCells('AA7', 'AB7') ; 
                    worksheet.mergeCells('AC7', 'AD7') ; 
                    worksheet.mergeCells('AE7', 'AE8') ;
                    worksheet.mergeCells('AF7', 'AF8'); 


                }*/
                var pos = 9; 
                var total_dbam   = 0;
                var total_fcamd  = 0;
                var total_cdam   = 0;
                var total_fcamc  = 0;
                var total_dbba   = 0;
                var total_cdba   = 0;

                
                if(dt_Data.length>1)
                {
                    worksheet.duplicateRow(pos,dt_Data.length-1,true);
                }  
                for (var i = 0; i < dt_Data.length; i++) 
                {
                    var row_item = worksheet.getRow(pos);
                    row_item.getCell(1).value   = dt_Data[i].YYYYMM;
                    row_item.getCell(2).value   = dt_Data[i].SEQ;    
                    row_item.getCell(3).value   = dt_Data[i].CHTP;  
                    row_item.getCell(4).value   = dt_Data[i].CHNO; 
                    row_item.getCell(5).value   = dt_Data[i].TRDT; 
                    row_item.getCell(6).value   = dt_Data[i].CSNM; 
                    row_item.getCell(7).value    = dt_Data[i].MGNM; 
                    row_item.getCell(8).value    = dt_Data[i].NTCD; 
                    row_item.getCell(9).value    = dt_Data[i].NTNM;   
                    row_item.getCell(10).value   = dt_Data[i].ONCO;  
                    row_item.getCell(11).value   = dt_Data[i].DESC1;  
                    row_item.getCell(12).value   = dt_Data[i].DESC2;  
                    row_item.getCell(13).value   = dt_Data[i].CDAC;   
                    row_item.getCell(14).value   = dt_Data[i].NMAC;  
                    row_item.getCell(15).value   = dt_Data[i].CRAC;
                    row_item.getCell(16).value   = dt_Data[i].NCAC; 
                    row_item.getCell(17).value   = dt_Data[i].DBAM;  
                    row_item.getCell(18).value   = dt_Data[i].FCAMD; 
                    row_item.getCell(19).value   = dt_Data[i].CDAM;  
                    row_item.getCell(20).value   = dt_Data[i].FCAMC;  
                    row_item.getCell(21).value   = dt_Data[i].DBBA;  
                    row_item.getCell(22).value   = dt_Data[i].CDBA; 
                    row_item.getCell(23).value   = dt_Data[i].DBBAFC;
                    row_item.getCell(24).value   = dt_Data[i].CDBAFC; 
                    row_item.getCell(25).value   = dt_Data[i].VTNO;  
                    row_item.getCell(26).value   = dt_Data[i].DTTX; 
                    row_item.getCell(27).value   = dt_Data[i].ULDIJ;  
                    row_item.getCell(28).value   = dt_Data[i].CD_CC;  

                    total_dbam      += Number(dt_Data[i].DBAM);
                    total_fcamd     += Number(dt_Data[i].FCAMD);
                    total_cdam      += Number(dt_Data[i].CDAM);
                    total_fcamc     += Number(dt_Data[i].FCAMC);
                    total_dbba      += Number(dt_Data[i].DBBA);
                    total_cdba      += Number(dt_Data[i].CDBA);
                    pos = pos + 1; 
                    //row_item.commit();

                }  
                var row = worksheet.getRow(pos);
                worksheet.mergeCells(pos,1,pos,6); 
                row.getCell(1).value = "Total Arising" 
                row.getCell(17).value  = total_dbam;
                row.getCell(18).value  = total_fcamd;
                row.getCell(19).value  = total_cdam;
                row.getCell(20).value  = total_fcamc;
                row.getCell(21).value  = total_dbba;
                row.getCell(22).value  = total_cdba;
                /************sign*/
                /*worksheet.mergeCells(pos+3,1,pos+3,2); 
                worksheet.mergeCells(pos+4,1,pos+4,2);   
                worksheet.mergeCells(pos+3,7,pos+3,10); 
                worksheet.mergeCells(pos+4,7,pos+4,10); 
                pos = pos + 3;*/
            
           /* if(dt_Data_sign.length>1)
            {
                for (var i = 0; i < dt_Data_sign.length; i++) 
                    {
                    if(_lang == 'VIE' )
                    {   row_item = worksheet.getRow(pos );
                        if (dt_Data_sign[i].CODE =='VIE')
                        {
                            row_item.getCell(1).value = dt_Data_sign[i].VAL1 ; 
                            row_item.getCell(1).font.bold = false;
                            row_item.getCell(4).value = dt_Data_sign[i].VAL2; 
                            row_item.getCell(4).font.bold = true;
                            row_item.getCell(7).value = dt_Data_sign[i].VAL3;                         
                            row_item.getCell(7).font.bold = true;
                            row_item.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
                            row_item.getCell(4).alignment = { vertical: 'middle', horizontal: 'center' };
                            row_item.getCell(7).alignment = { vertical: 'middle', horizontal: 'center' };
                        }
                        
                        row_item = worksheet.getRow(pos +1 );   
                        if (dt_Data_sign[i].CODE =='VIE_SIG')
                        {
                            row_item.getCell(1).value = dt_Data_sign[i].VAL1; 
                            row_item.getCell(1).font.bold = false;
                            row_item.getCell(4).value = dt_Data_sign[i].VAL2; 
                            row_item.getCell(4).font.bold = false;
                            row_item.getCell(7).value = dt_Data_sign[i].VAL3; 
                            row_item.getCell(7).font.bold = false;
                            row_item.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
                            row_item.getCell(7).alignment = { vertical: 'middle', horizontal: 'center' };  
                            row_item.getCell(4).alignment = { vertical: 'middle', horizontal: 'center' };                        
                        }    
                        
                    }
                    if(_lang == 'KOR' || _lang == 'KOR-VIE')
                    {
                        row_item = worksheet.getRow(pos ); 
                        if (dt_Data_sign[i].CODE =='KOR')
                        {
                            row_item.getCell(1).value = dt_Data_sign[i].VAL1; 
                            row_item.getCell(1).font.bold = true;    
                            row_item.getCell(4).value = dt_Data_sign[i].VAL2; 
                            row_item.getCell(4).font.bold = true;
                            row_item.getCell(7).value = dt_Data_sign[i].VAL3;                         
                            row_item.getCell(7).font.bold = true;
                            row_item.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' }; 
                            row_item.getCell(4).alignment = { vertical: 'middle', horizontal: 'center' };  
                            row_item.getCell(7).alignment = { vertical: 'middle', horizontal: 'center' };   

                        }
                        
                        row_item = worksheet.getRow(pos +1 );   
                        if (dt_Data_sign[i].CODE =='KOR_SIG')
                        {
                            row_item.getCell(1).value = dt_Data_sign[i].VAL1; 
                            row_item.getCell(1).font.bold = false;
                            row_item.getCell(4).value = dt_Data_sign[i].VAL2; 
                            row_item.getCell(4).font.bold = false;  
                            row_item.getCell(7).value = dt_Data_sign[i].VAL3;
                            row_item.getCell(7).font.bold = false;
                            row_item.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };     
                            row_item.getCell(7).alignment = { vertical: 'middle', horizontal: 'center' };    
                            row_item.getCell(4).alignment = { vertical: 'middle', horizontal: 'center' };                            
                        }    
                    }if(_lang == 'ENG' || _lang == 'ENG-KOR'|| _lang == 'ENG-VIE' )
                    {    row_item = worksheet.getRow(pos );
                        if (dt_Data_sign[i].CODE =='ENG')
                        {
                            row_item.getCell(1).value = dt_Data_sign[i].VAL1 + dt_Data_sign[i].VAL1 ; 
                            row_item.getCell(1).font.bold = true;  
                            row_item.getCell(4).value = dt_Data_sign[i].VAL2; 
                            row_item.getCell(4).font.bold = true;                               
                            row_item.getCell(7).value = dt_Data_sign[i].VAL3;                         
                            row_item.getCell(7).font.bold = true;
                            row_item.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };   
                            row_item.getCell(4).alignment = { vertical: 'middle', horizontal: 'center' };   
                            row_item.getCell(7).alignment = { vertical: 'middle', horizontal: 'center' }; 
                                
                        }
                        
                        row_item = worksheet.getRow(pos +1 );   
                        if (dt_Data_sign[i].CODE =='ENG_SIG')
                        {
                            row_item.getCell(1).value = dt_Data_sign[i].VAL1;                                
                            row_item.getCell(4).value = dt_Data_sign[i].VAL2; 
                            row_item.getCell(7).value = dt_Data_sign[i].VAL3;                             
                            row_item.getCell(1).font.bold = false;
                            row_item.getCell(4).font.bold = false;
                            row_item.getCell(7).font.bold = false;
                            row_item.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };   
                            row_item.getCell(4).alignment = { vertical: 'middle', horizontal: 'center' };   
                            row_item.getCell(7).alignment = { vertical: 'middle', horizontal: 'center' }; 

                        }    
                    }
                    if (dt_Data_sign[i].CODE =='NAME')
                    {
                        row_item = worksheet.getRow(pos +2 ); 
                        row_item.getCell(1).value = dt_Data_sign[i].VAL1; 
                        row_item.getCell(1).font.bold = false;
                        row_item.getCell(4).value = dt_Data_sign[i].VAL2; 
                        row_item.getCell(4).font.bold = false;
                        row_item.getCell(7).value = dt_Data_sign[i].VAL3;         
                        row_item.getCell(7).font.bold = false;
                        row_item.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };   
                        row_item.getCell(4).alignment = { vertical: 'middle', horizontal: 'center' };   
                        row_item.getCell(7).alignment = { vertical: 'middle', horizontal: 'center' }; 
                    }
                        
                    }
            }*/
            worksheet.name = _title;
                /********* Print file excel ********/
                const reportFile    = Helpers.tmpPath(file_new);
                await workbook.xlsx.writeFile(reportFile)
                return response.attachment( reportFile, file_new);
            }
        } 
        catch (e) 
        {
            Utils.Logger({ LVL: "error", MODULE: "Report", FUNC: "rpt_6030070_HQ_1", CONTENT: e.message })
        // return response.send(Utils.response(false, e.message, null))
        return response.send(null);
        }
    }  
    async rpt_6030070_DN_CUST_PL_C0({ request, response, auth }) {
        try 
        { 
          /* P_RPT_ID: report_info.VAL1, P_RPT_URL: report_info.VAL2, P_RPT_FILE: report_info.VAL4,
                P_COMP_ID: company_info.PARTNER_ID, P_COMP_NM: company_info.TEXT, P_COMP_TAX: company_info.TAX_CODE, P_COMP_ADD: company_info.ADDR1,
                P_COMPANY: this.selectedCompany,P_ACC_PK: this.TAC_ABACCTCODE_PK, P_FR_DATE: this.from_date, P_FR_TO: this.to_date, 
                P_CCY: this.selectedCurrency,  P_BOOK_CCY: this.txtBookCCY, P_CIRCULARS: this.selectedCircular, P_PRINT_VOUCHER_NO : this.selectedPrintVoucherNo, 
                P_OPTION: this.selectedOptionListGLDT, P_POST_SUM : this.selectedPostSum, P_LANG : this.selectedLanguage, P_DATE_NOW: this.datetime, P_TITLE : report_info.FNAME
                P_BIZ_ID: BizPlace_info.NAME, P_BIZ_NM: BizPlace_info.LOC_NM, P_BIZ_TAX: BizPlace_info.TAX_CD, P_BIZ_ADD: BizPlace_info.ADDR_NM1
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
            var _store          = "AC_RPT_6030070_CUS_PL_C0_V2";
            var _circular       = "AC_SEL_GET_TT_BPL";
            var _param          = [item.P_COMPANY, item.P_FR_DATE, item.P_FR_TO, item.P_ACC_PK, item.P_PARTNER_PK, item.P_STATUS, item.P_VOUCHER_NO , item.P_SEQ, item.P_BOOK_CCY, item.P_VOUCHER_TYPE, item.P_CIRCULARS, item.P_LANG, item.P_TCO_BUSPLACE_PK];
            var _param_TT       = [item.P_CIRCULARS, item.P_TCO_BUSPLACE_PK];
            var _ac_code        = "EACAB031";
            var _store_sign     = "ac_rpt_6045085_sign";
            var _param_sign     = [item.P_COMPANY,_ac_code];

            var v_no_title = "Mẫu số : S03a-DN ", e_no_title = "Form No : S03a-DN" , k_no_title = "양식번호 : S03a-DN";
            var v_dvt = " Đơn vị tính", e_dvt = " Unit", k_dvt = " 단위";
            //var v_fdate = "Từ ngày ", e_fdate = "From ", k_fdate ="부터 ", v_tdate = " đến ngày", e_tdate = " to", k_tdate =" 까지";
            //var v_month = " Tháng này", e_month = " This month", k_month = " 이번 달"; 
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
                //console.log(dt_Data);
                if (dt_Data.length > 0) 
                {
                    dt_Data = dt_Data;
                } 
                else 
                {
                    //dt_Data = dt_Data;
                    return response.send(Utils.response(false, "no_data_found", null))
                } 
                 /********* Call store sign ***************/ 
                 var dt_Data_sign  = await DBService.callProcCursor(_store_sign, _param_sign, p_language, p_crt_by); 
                 if (dt_Data_sign) 
                 {
                     dt_Data_sign = dt_Data_sign;
                 } 
                 /****************Call CIRCULARS******************/
                var dt_TT  = await DBService.callProcCursor(_circular, _param_TT , p_language , p_crt_by); 
                if (dt_TT.length>0) 
                {
                    dt_TT = dt_TT;
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
                //P_BIZ_ID: BizPlace_info.NAME, P_BIZ_NM: BizPlace_info.LOC_NM, P_BIZ_TAX: BizPlace_info.TAX_CD, P_BIZ_ADD: BizPlace_info.ADDR_NM1
                //INFOMATION COMPANY
                var r_item = worksheet.getRow(1);
                r_item.getCell(1).value = Utils.translate("COMPANY",_dictionary , p_language) + ": " +item.P_BIZ_NM;    //+ item.P_BIZ_ID +" - "
                r_item = worksheet.getRow(2);
                r_item.getCell(1).value = Utils.translate("TAX_CODE",_dictionary, p_language) + ": "+ item.P_BIZ_TAX;   
                r_item = worksheet.getRow(3);
                r_item.getCell(1).value = Utils.translate("ADDRESS",_dictionary , p_language) + ": "+ item.P_BIZ_ADD;
                var title_a4 = "";
                var FromDate = item.P_FR_DATE;
                var ToDate = item.P_FR_TO;
                var strFrDate = FromDate.substr(6,2) + "/"+ FromDate.substr(4,2)+ "/"+ FromDate.substr(0,4);
                var strToDate = ToDate.substr(6,2) + "/"+ ToDate.substr(4,2)+ "/"+ ToDate.substr(0,4);
                var _bookccy = item.P_BOOK_CCY;
                worksheet.getCell("K6").value = _bookccy;
                var _title = item.P_TITLE;
                 // thông tư
                var _lang = item.P_LANG;
                if(_lang == 'VIE'){
                    worksheet.getCell("G1").value =  v_no_title ;
                    worksheet.getCell("G2").value =  dt_TT[0].V1 ;
                    worksheet.getCell("G3").value =  dt_TT[0].V2 ;
                    var _title = item.P_TITLE;
                    worksheet.getCell("A4").value = _title;
                    worksheet.getCell("A5").value = "Từ ngày " + strFrDate + " đến ngày " + strToDate;
                    worksheet.getCell("J6").value = v_dvt;
                    //grid
                    worksheet.mergeCells('A7', 'A8'); 
                     worksheet.getCell("A7").value = "Ngày tháng ghi sổ";
                    worksheet.mergeCells('B7', 'C7'); 
                    worksheet.getCell("B7").value = "Chứng từ";
                    worksheet.getCell("B8").value = "Số hiệu";
                    worksheet.getCell("C8").value = "Ngày";
                    worksheet.getCell("D7").value = "Diễn giải";
                    worksheet.getCell("E7").value = "Description";
                    worksheet.getCell("F7").value = "Đã ghi";
                    worksheet.getCell("F8").value = "SC";
                    worksheet.mergeCells('G7', 'I7'); 
                    worksheet.getCell("G7").value = "Số hiệu TK";
                    worksheet.getCell("G8").value = "Nợ";
                    worksheet.getCell("H8").value = "CS";
                    worksheet.getCell("I8").value = "Có";
                    worksheet.getCell("J7").value = "Số phát sinh";
                    worksheet.getCell("K7").value = "Ghi chú";
                    worksheet.getCell("K8").value = "Seq";
                    worksheet.mergeCells('L7', 'M7'); 
                    worksheet.getCell("L7").value = "Đối tượng";
                    worksheet.getCell("L8").value = "Mã";
                    worksheet.getCell("M8").value = "Tên";
                    worksheet.mergeCells('N7', 'O7'); 
                    worksheet.getCell("N8").value = "Mã";
                    worksheet.getCell("O8").value = "Tên";
                    worksheet.getCell("P7").value = "Số phát sinh";
                    worksheet.getCell("P8").value = "Convertible CCY";
                    worksheet.getCell("Q7").value = "Số phát sinh";
                    worksheet.getCell("Q8").value = "(Trans)";
                    worksheet.mergeCells('R7', 'R8') ;
                    worksheet.getCell("R8").value = "Tiền tệ"; 
                    worksheet.mergeCells('S7', 'S8') ; 
                    worksheet.getCell("S8").value = "Tỷ giá"; 
                    worksheet.mergeCells('T7', 'T8') ; 
                    worksheet.getCell("T8").value = "Số hóa đơn";
                    worksheet.mergeCells('U7', 'U8') ; 
                    worksheet.getCell("U8").value = "Số tờ khai";
                    worksheet.mergeCells('V7', 'V8') ; 
                    worksheet.getCell("V8").value = "Tên TK Nợ";
                    worksheet.mergeCells('W7', 'W8') ; 
                    worksheet.getCell("W8").value= "Tên TK Có";
                    worksheet.mergeCells('X7', 'X8') ; 

                    worksheet.getCell("X8").value = "Ngày hóa đơn";
                    worksheet.mergeCells('Y7', 'Y8') ; 
                    worksheet.getCell("Y8").value = "Số TK ngân hàng nợ";
                    worksheet.mergeCells('Z7', 'Z8') ;
                    worksheet.getCell("Z8").value = "Số TK ngân hàng có"; 
                    worksheet.mergeCells('AA7', 'AB7') ; 
                    worksheet.getCell("AA7").value = "Đối tượng (DR)";
                    worksheet.getCell("AA8").value = "Mã";
                    worksheet.getCell('AB8').value = "Tên";
                    worksheet.mergeCells('AC7', 'AD7') ; 
                    worksheet.getCell("AC7").value = "Đối tượng (CR)";
                    worksheet.getCell("AC8").value = "Mã";
                    worksheet.getCell("AD8").value = "Tên";
                    worksheet.mergeCells('AE7', 'AE8') ;
                    worksheet.getCell("AE8").value = "Mã quản lý"; 
                    worksheet.mergeCells('AF7', 'AF8'); 
                    worksheet.getCell("AF8").value = "Tên quản lý"; 
                    worksheet.mergeCells('AG7', 'AG8') ;
                    worksheet.getCell("AG8").value = "Mã chi nhánh"; 
                    worksheet.mergeCells('AH7', 'AH8'); 
                    worksheet.getCell("AH8").value = "Tên chi nhánh"; 
                    worksheet.mergeCells('AI7', 'AI8'); 
                    worksheet.getCell("AI8").value = "Legder ID";
                    worksheet.mergeCells('AJ7', 'AJ8'); 
                    // worksheet.getCell("AJ8").value = "Legder ID";

                }
                else if(_lang == 'KOR'){
                    worksheet.getCell("G1").value =  k_no_title ;
                    worksheet.getCell("G2").value =  "(재무부의 2014년 12월 22일 NO: 200/2014/TT-BTC" ;
                    worksheet.getCell("G3").value =  "통지에 의한 양식임)";
                    _title = "분개장";
                    worksheet.getCell("A4").value = _title;
                    worksheet.getCell("A5").value =  strFrDate + " ~ " + strToDate;
                    worksheet.getCell("J6").value = k_dvt;

                    //grid
                    worksheet.mergeCells('A7', 'A8'); 
                    worksheet.getCell("A7").value = "거래일자";
                    worksheet.mergeCells('B7', 'C7'); 
                    worksheet.getCell("B7").value = "전표번호";
                    worksheet.getCell("B8").value = "번호";
                    worksheet.getCell("C8").value = "일자";
                    worksheet.getCell("D7").value = "적요 (베트남어)";
                    worksheet.getCell("E7").value = "적요 (영어)";
                    worksheet.getCell("F7").value = "Đã ghi";
                    worksheet.getCell("F8").value = "SC";
                    worksheet.mergeCells('G7', 'I7'); 
                    worksheet.getCell("G7").value = "계정코드";
                    worksheet.getCell("G8").value = "차변";
                    worksheet.getCell("H8").value = "CS";
                    worksheet.getCell("I8").value = "대변";
                    worksheet.getCell("J7").value = "금액";
                    worksheet.getCell("K7").value = "비고명";
                    worksheet.getCell("K8").value = "Seq";
                    worksheet.mergeCells('L7', 'M7'); 
                    worksheet.getCell("L7").value = "거래처 코드 번호";
                    worksheet.getCell("L8").value = "사업자번호";
                    worksheet.getCell("M8").value = "사업자명";
                    worksheet.mergeCells('N7', 'O7'); 
                    worksheet.getCell("N8").value ="손익부서";
                    worksheet.getCell("N8").value = "부서";
                    worksheet.getCell("O8").value = "부서명";
                    worksheet.getCell("P7").value = "금액";
                    worksheet.getCell("P8").value = "Convertible CCY";
                    worksheet.getCell("Q7").value = "금액";
                    worksheet.getCell("Q8").value = "(Trans)";
                    worksheet.mergeCells('R7', 'R8') ;
                    worksheet.getCell("R8").value = "통화"; 
                    worksheet.mergeCells('S7', 'S8') ; 
                    worksheet.getCell("S8").value = "환율"; 
                    worksheet.mergeCells('T7', 'T8') ; 
                    worksheet.getCell("T8").value = "부가세전표번호";
                    worksheet.mergeCells('U7', 'U8') ; 
                    worksheet.getCell("U8").value = "Declare no.";
                    worksheet.mergeCells('V7', 'V8') ; 
                    worksheet.getCell("V8").value = "차변계정명";
                    worksheet.mergeCells('W7', 'W8') ; 
                    worksheet.getCell("W8").value= "대변계정명";
                    worksheet.mergeCells('X7', 'X8') ; 

                    worksheet.getCell("X8").value = "세금계산서 발행일";
                    worksheet.mergeCells('Y7', 'Y8') ; 
                    worksheet.getCell("Y8").value = "계좌번호";
                    worksheet.mergeCells('Z7', 'Z8') ;
                    worksheet.getCell("Z8").value = "계좌번호"; 
                    worksheet.mergeCells('AA7', 'AB7') ; 
                    worksheet.getCell("AA7").value = "거래처 코드 번호 (차변 )";
                    worksheet.getCell("AA8").value = "거래처코드";
                    worksheet.getCell('AB8').value = "거래처명";
                    worksheet.mergeCells('AC7', 'AD7') ; 
                    worksheet.getCell("AC7").value = "거래처 코드 번호 (대변)";
                    worksheet.getCell("AC8").value = "거래처코드";
                    worksheet.getCell("AD8").value = "거래처명";
                    worksheet.mergeCells('AE7', 'AE8') ;
                    worksheet.getCell("AE8").value = "관리코드"; 
                    worksheet.mergeCells('AF7', 'AF8'); 
                    worksheet.getCell("AF8").value = "비고코드"; 
                    worksheet.mergeCells('AG7', 'AG8') ;
                    worksheet.getCell("AG8").value = "Biz Code"; 
                    worksheet.mergeCells('AH7', 'AH8'); 
                    worksheet.getCell("AH8").value = "Biz Name"; 
                    worksheet.mergeCells('AI7', 'AI8'); 
                    worksheet.getCell("AI8").value = "Legder ID";
                    worksheet.mergeCells('AJ7', 'AJ8'); 
                    // worksheet.getCell("AJ8").value = "Legder ID";

                }
                else{
                    worksheet.getCell("G1").value =  e_no_title ;
                    worksheet.getCell("G2").value =  dt_TT[0].E1 ;
                    worksheet.getCell("G3").value =  dt_TT[0].E2 ;
                    _title = "GENERAL JOURNAL";
                    worksheet.getCell("A4").value =  _title;
                    worksheet.getCell("A5").value = "From date " + strFrDate + " To date " + strToDate;
                    worksheet.getCell("J6").value = e_dvt;
                    // grid
                    worksheet.mergeCells('A7', 'A8'); 
                    worksheet.mergeCells('B7', 'C7'); 
                   // worksheet.getCell("B8").value = "No";
                   // worksheet.getCell("C8").value = "Date";
                    worksheet.mergeCells('G7', 'I7'); 
                    worksheet.mergeCells('L7', 'M7'); 
                    worksheet.mergeCells('N7', 'O7'); 
                    worksheet.mergeCells('R7', 'R8') ;
                    worksheet.mergeCells('S7', 'S8') ; 
                    worksheet.mergeCells('T7', 'T8') ; 
                    worksheet.mergeCells('U7', 'U8') ; 
                    worksheet.mergeCells('V7', 'V8') ; 
                    worksheet.mergeCells('W7', 'W8') ; 
                    worksheet.mergeCells('X7', 'X8') ; 
                    worksheet.mergeCells('Y7', 'Y8') ; 
                    worksheet.mergeCells('Z7', 'Z8') ;
                    worksheet.mergeCells('AA7', 'AB7') ; 
                    worksheet.mergeCells('AC7', 'AD7') ; 
                    worksheet.mergeCells('AE7', 'AE8') ;
                    worksheet.mergeCells('AF7', 'AF8'); 
                    worksheet.mergeCells('AG7', 'AG8') ; 
                    worksheet.mergeCells('AH7', 'AH8') ;
                    worksheet.mergeCells('AI7', 'AI8'); 
                    worksheet.mergeCells('AJ7', 'AJ8');  
                }
                var pos = 9; 
                var total_tr_book_c0 = 0;
                var total_tr_amt_c0 = 0;
                var total_amt       = 0;

                
                if(dt_Data.length > 1)
                {
                     worksheet.duplicateRow(pos,dt_Data.length-1,true);
                }  
               for (var i = 0; i < dt_Data.length; i++) 
                {
                    var row_item = worksheet.getRow(pos);
                    row_item.getCell(1).value   = dt_Data[i].TR_DATE;
                    row_item.getCell(2).value   = dt_Data[i].VOUCHERNO;    
                    row_item.getCell(3).value   = dt_Data[i].TR_DATE_NO;  
                    row_item.getCell(4).value   = dt_Data[i].REMARK2; 
                    row_item.getCell(5).value   = dt_Data[i].REMARK; 
                    row_item.getCell(6).value   = dt_Data[i].SC; 
                    row_item.getCell(7).value   = dt_Data[i].DR; 
                    row_item.getCell(9).value   = dt_Data[i].CR;  
                    if (_bookccy === 'VND')
                    {
                        row_item.getCell(10).value   = dt_Data[i].TR_BOOKAMT; 
                    }
                    else if(_bookccy === 'USD'){
                        row_item.getCell(10).value   = dt_Data[i].TR_BOOKAMT; 
                        row_item.getCell(10).numFmt  = '###,###,###,###.00';
                    }
                    row_item.getCell(11).value   = dt_Data[i].PK;  
                    row_item.getCell(12).value   = dt_Data[i].PARTNER_CD;  
                    row_item.getCell(13).value   = dt_Data[i].PARTNER_NM;  
                    row_item.getCell(14).value   = dt_Data[i].PL_CD;   
                    row_item.getCell(15).value   = dt_Data[i].PL_NM;  
                    row_item.getCell(16).value   = dt_Data[i].TR_AMT_C0;
                    row_item.getCell(17).value   = dt_Data[i].TR_AMT; 
                    row_item.getCell(18).value   = dt_Data[i].TR_CCY;  
                    row_item.getCell(19).value   = dt_Data[i].TR_RATE; 
                    row_item.getCell(20).value   = dt_Data[i].INVOICE_NO;  
                    row_item.getCell(21).value   = dt_Data[i].DECLARE_NO;  
                    row_item.getCell(22).value   = dt_Data[i].DR_NAME;  
                    row_item.getCell(23).value   = dt_Data[i].CR_NAME; 
                   
                    row_item.getCell(24).value   = dt_Data[i].INVOICE_DATE;
                    row_item.getCell(25).value   = dt_Data[i].DEBIT_BANK_ACC; 
                    row_item.getCell(26).value   = dt_Data[i].CREDIT_BANK_ACC;  
                    row_item.getCell(27).value   = dt_Data[i].DEBIT_PARTNER_CODE; 
                    row_item.getCell(28).value   = dt_Data[i].DEBIT_PARTNER_NAME;  
                    row_item.getCell(29).value   = dt_Data[i].CREDIT_PARTNER_CODE;  
                    row_item.getCell(30).value   = dt_Data[i].CREDIT_PARTNER_NAME;  
                    row_item.getCell(31).value   = dt_Data[i].EXPENSE_TYPE; 
                    row_item.getCell(32).value   = dt_Data[i].EXPENSE_NAME; 
                    row_item.getCell(33).value   = dt_Data[i].LOC_ID;  
                    row_item.getCell(34).value   = dt_Data[i].LOC_NM; 
                    row_item.getCell(35).value   = dt_Data[i].LEDGER_ID; 
                    row_item.getCell(36).value   = dt_Data[i].CONTROL_ITEM; 

                    
                    total_tr_book_c0 += Number(dt_Data[i].TR_BOOKAMT);
                    total_tr_amt_c0  += Number(dt_Data[i].TR_AMT_C0);
                    total_amt        += Number(dt_Data[i].TR_AMT);
                    pos = pos + 1; 
                    //row_item.commit();

                }  
                var row = worksheet.getRow(pos);
                worksheet.mergeCells(pos,1,pos,6); 
                if(_lang == 'VIE'){
                   // row.getCell(1).value = "Tổng cộng số phát sinh" 
                }
                else if(_lang == 'KOR'){
                    row.getCell(1).value = "합계" 
                }
                else{
                    row.getCell(1).value = "Total Arising" 
                }
                
                if (_bookccy === 'VND')
                {
                    row.getCell(10).value  = total_tr_book_c0;
                }
                else if(_bookccy === 'USD'){
                    row.getCell(10).value  = total_tr_book_c0;
                    row.getCell(10).numFmt  = '###,###,###,###.00';
                }
                row.getCell(16).value  = total_tr_amt_c0;
                row.getCell(17).value  = total_amt;

                /************sign*/
                worksheet.mergeCells(pos+3,1,pos+3,2); 
                worksheet.mergeCells(pos+4,1,pos+4,2);   
                worksheet.mergeCells(pos+3,7,pos+3,10); 
                worksheet.mergeCells(pos+4,7,pos+4,10); 
                pos = pos + 3;
              
               if(dt_Data_sign.length>1)
               {
                   for (var i = 0; i < dt_Data_sign.length; i++) 
                    {
                       if(_lang == 'VIE' )
                       {   row_item = worksheet.getRow(pos );
                           if (dt_Data_sign[i].CODE =='VIE')
                           {
                               row_item.getCell(1).value = dt_Data_sign[i].VAL1 ; 
                               row_item.getCell(1).font.bold = false;
                               row_item.getCell(4).value = dt_Data_sign[i].VAL2; 
                               row_item.getCell(4).font.bold = true;
                               row_item.getCell(7).value = dt_Data_sign[i].VAL3;                         
                               row_item.getCell(7).font.bold = true;
                               row_item.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
                               row_item.getCell(4).alignment = { vertical: 'middle', horizontal: 'center' };
                               row_item.getCell(7).alignment = { vertical: 'middle', horizontal: 'center' };
                           }
                           
                           row_item = worksheet.getRow(pos +1 );   
                           if (dt_Data_sign[i].CODE =='VIE_SIG')
                           {
                               row_item.getCell(1).value = dt_Data_sign[i].VAL1; 
                               row_item.getCell(1).font.bold = false;
                               row_item.getCell(4).value = dt_Data_sign[i].VAL2; 
                               row_item.getCell(4).font.bold = false;
                               row_item.getCell(7).value = dt_Data_sign[i].VAL3; 
                               row_item.getCell(7).font.bold = false;
                               row_item.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
                               row_item.getCell(7).alignment = { vertical: 'middle', horizontal: 'center' };  
                               row_item.getCell(4).alignment = { vertical: 'middle', horizontal: 'center' };                        
                           }    
                         
                       }
                       if(_lang == 'KOR' || _lang == 'KOR-VIE')
                       {
                           row_item = worksheet.getRow(pos ); 
                           if (dt_Data_sign[i].CODE =='KOR')
                           {
                               row_item.getCell(1).value = dt_Data_sign[i].VAL1; 
                               row_item.getCell(1).font.bold = true;    
                               row_item.getCell(4).value = dt_Data_sign[i].VAL2; 
                               row_item.getCell(4).font.bold = true;
                               row_item.getCell(7).value = dt_Data_sign[i].VAL3;                         
                               row_item.getCell(7).font.bold = true;
                               row_item.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' }; 
                               row_item.getCell(4).alignment = { vertical: 'middle', horizontal: 'center' };  
                               row_item.getCell(7).alignment = { vertical: 'middle', horizontal: 'center' };   

                           }
                           
                           row_item = worksheet.getRow(pos +1 );   
                           if (dt_Data_sign[i].CODE =='KOR_SIG')
                           {
                               row_item.getCell(1).value = dt_Data_sign[i].VAL1; 
                               row_item.getCell(1).font.bold = false;
                               row_item.getCell(4).value = dt_Data_sign[i].VAL2; 
                               row_item.getCell(4).font.bold = false;  
                               row_item.getCell(7).value = dt_Data_sign[i].VAL3;
                               row_item.getCell(7).font.bold = false;
                               row_item.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };     
                               row_item.getCell(7).alignment = { vertical: 'middle', horizontal: 'center' };    
                               row_item.getCell(4).alignment = { vertical: 'middle', horizontal: 'center' };                            
                           }    
                       }
                       if(_lang == 'ENG' || _lang == 'ENG-KOR'|| _lang == 'ENG-VIE' )
                       {    row_item = worksheet.getRow(pos );
                           if (dt_Data_sign[i].CODE =='ENG')
                           {
                               row_item.getCell(1).value = dt_Data_sign[i].VAL1 + dt_Data_sign[i].VAL1 ; 
                               row_item.getCell(1).font.bold = true;  
                               row_item.getCell(4).value = dt_Data_sign[i].VAL2; 
                               row_item.getCell(4).font.bold = true;                               
                               row_item.getCell(7).value = dt_Data_sign[i].VAL3;                         
                               row_item.getCell(7).font.bold = true;
                               row_item.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };   
                               row_item.getCell(4).alignment = { vertical: 'middle', horizontal: 'center' };   
                               row_item.getCell(7).alignment = { vertical: 'middle', horizontal: 'center' }; 
                                 
                           }
                           
                           row_item = worksheet.getRow(pos +1 );   
                           if (dt_Data_sign[i].CODE =='ENG_SIG')
                           {
                               row_item.getCell(1).value = dt_Data_sign[i].VAL1;                                
                               row_item.getCell(4).value = dt_Data_sign[i].VAL2; 
                               row_item.getCell(7).value = dt_Data_sign[i].VAL3;                             
                               row_item.getCell(1).font.bold = false;
                               row_item.getCell(4).font.bold = false;
                               row_item.getCell(7).font.bold = false;
                               row_item.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };   
                               row_item.getCell(4).alignment = { vertical: 'middle', horizontal: 'center' };   
                               row_item.getCell(7).alignment = { vertical: 'middle', horizontal: 'center' }; 

                           }    
                       }
                       if (dt_Data_sign[i].CODE =='NAME')
                       {
                           row_item = worksheet.getRow(pos +2 ); 
                           row_item.getCell(1).value = dt_Data_sign[i].VAL1; 
                           row_item.getCell(1).font.bold = false;
                           row_item.getCell(4).value = dt_Data_sign[i].VAL2; 
                           row_item.getCell(4).font.bold = false;
                           row_item.getCell(7).value = dt_Data_sign[i].VAL3;         
                           row_item.getCell(7).font.bold = false;
                           row_item.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };   
                           row_item.getCell(4).alignment = { vertical: 'middle', horizontal: 'center' };   
                           row_item.getCell(7).alignment = { vertical: 'middle', horizontal: 'center' }; 
                       }
                        
                    }
               }
               worksheet.name = _title;
                /********* Print file excel ********/
                const reportFile    = Helpers.tmpPath(file_new);
                await workbook.xlsx.writeFile(reportFile)
                return response.attachment( reportFile, file_new);
            }
        } 
        catch (e) 
        {
            Utils.Logger({ LVL: "error", MODULE: "Report", FUNC: "rpt_6030070_DN_CUST_PL_C0", CONTENT: e.message })
           // return response.send(Utils.response(false, e.message, null))
           return response.send(null);
        }
    }  
    async rpt_6030070_AS_FORM({ request, response, auth }) {
        try 
        { 
          /*  P_RPT_ID: report_info.VAL1, P_RPT_URL: report_info.VAL2, P_RPT_FILE: report_info.VAL3,
                P_COMP_ID: company_info.PARTNER_ID, P_COMP_NM: company_info.TEXT, P_COMP_TAX: company_info.TAX_CODE, P_COMP_ADD: company_info.ADDR1,
                P_COMPANY: this.selectedCompany, P_FR_DATE: this.proposedFrom, P_FR_TO: this.proposedTo, P_ACC_PK: this.accCodePK, 
                P_PARTNER_PK: this.partnerPK, P_STATUS: this.status, P_VOUCHER_NO: this.voucherNo, P_SEQ: this.seq, P_BOOK_CCY: this.txtBookCCY,
                P_VOUCHER_TYPE: this.selectedVoucherType, P_CIRCULARS: this.selectedCircular, P_LANG : this.selectedLang,  P_DATE_NOW: this.datetime,
                P_PL: this.plUnitPK, P_DESCRIPTION: this.description
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
            var _store          = "AC_RPT_6030070_DAILY_INQUIRY";
            //var _circular       = "AC_SEL_GET_TT_BPL";
            var _param          = [item.P_COMPANY, item.P_FR_DATE, item.P_FR_TO, item.P_ACC_PK, item.P_PARTNER_PK, item.P_PL, item.P_STATUS, item.P_VOUCHER_NO , item.P_SEQ, item.P_DESCRIPTION, item.P_LANG , item.P_VOUCHER_TYPE, item.P_TCO_BUSPLACE_PK];
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
                r_item.getCell(1).value = Utils.translate("COMPANY",_dictionary , p_language) + ": " +COMP_NM;    //+ COMP_ID +" - "
                r_item = worksheet.getRow(2);
                r_item.getCell(1).value = Utils.translate("TAX_CODE",_dictionary, p_language) + ": "+ COMP_TAX;   
                r_item = worksheet.getRow(3);
                r_item.getCell(1).value = Utils.translate("ADDRESS",_dictionary , p_language) + ": "+ COMP_ADD;
                var FromDate = item.P_FR_DATE;
                var ToDate = item.P_FR_TO;
                var strFrDate = FromDate.substr(6,2) + "/"+ FromDate.substr(4,2)+ "/"+ FromDate.substr(0,4);
                var strToDate = ToDate.substr(6,2) + "/"+ ToDate.substr(4,2)+ "/"+ ToDate.substr(0,4);
                
                 // thông tư
                 
                 worksheet.mergeCells('B8', 'B9'); 
                 worksheet.mergeCells('C8', 'C9'); 
                 worksheet.mergeCells('D8', 'E8'); 
                 worksheet.mergeCells('F8', 'G8'); 
                 worksheet.mergeCells('H8', 'I8'); 
                 worksheet.mergeCells('J8', 'K8'); 
                 worksheet.mergeCells('L8', 'M8'); 
                 worksheet.mergeCells('N8', 'O8'); 
                 worksheet.mergeCells('P8', 'Q8');
                 var _lang = item.P_LANG;
                 if(_lang == 'VIE'){
                     worksheet.getCell("A5").value = "Truy Xuất Nhật Ký";
                     worksheet.getCell("A6").value = "Từ ngày " + strFrDate + " đến ngày " + strToDate;
                     //grid
                     worksheet.getCell("B8").value = "Ngày tháng ghi sổ";
                     worksheet.getCell("C8").value = "Số chứng từ"; 
                     worksheet.getCell("D8").value = "Tài khoản";
                     worksheet.getCell("D9").value = "Mã";
                     worksheet.getCell("E9").value = "Tên";
                     worksheet.getCell("F8").value = "Tiền giao dịch";
                     worksheet.getCell("F9").value = "Nợ";
                     worksheet.getCell("G9").value = "Có";
                     worksheet.getCell("H8").value = "Tiền ghi sổ";
                     worksheet.getCell("H9").value = "Nợ";
                     worksheet.getCell("I9").value = "Có";
                     worksheet.getCell("J8").value = "Diễn giải";
                     worksheet.getCell("J9").value = "Foreign";
                     worksheet.getCell("K9").value = "Local";
                     worksheet.getCell("L8").value = "Đối tượng";
                     worksheet.getCell("L9").value = "Mã";
                     worksheet.getCell("M9").value = "Tên";
                     worksheet.getCell("N8").value = "PL";
                     worksheet.getCell("N9").value = "Mã";
                     worksheet.getCell("O9").value = "Tên";
                     worksheet.getCell("P8").value = "Nhân viên";
                     worksheet.getCell("P9").value = "Mã";
                     worksheet.getCell("Q9").value = "Tên";

                 }
                 else{
                    worksheet.getCell("A6").value = "From date " + strFrDate + " To date " + strToDate;
                 }
                var pos = 10; 
                var total_trans_dr   = 0;
                var total_trans_cr  = 0;
                var total_book_dr    = 0;
                var total_book_cr    = 0;
                var _bookccy = item.P_BOOK_CCY;
                var _formatAmt = (_bookccy=='VND'?'_(* #,##0_);_(* (#,##0);_(* "-"_);_(@_)':'_(* #,##0.00_);_(* (#,##0.00);_(* "-"_);_(@_)');

                
                if(dt_Data.length>1)
                {
                     worksheet.duplicateRow(pos,dt_Data.length-1,true);
                }  
               for (var i = 0; i < dt_Data.length; i++) 
                {
                    var row_item = worksheet.getRow(pos);
                    var  _tr_date = dt_Data[i].TR_DATE.substr(6,2) + "/"+ dt_Data[i].TR_DATE.substr(4,2)+ "/"+ dt_Data[i].TR_DATE.substr(0,4);
                    row_item.getCell(1).value   = dt_Data[i].PK;
                    row_item.getCell(2).value   = _tr_date;    
                    row_item.getCell(3).value   = dt_Data[i].VOUCHERNO;  
                    row_item.getCell(4).value   = dt_Data[i].AC_CD; 
                    row_item.getCell(5).value   = dt_Data[i].AC_NM; 
                    row_item.getCell(6).value   = Number(dt_Data[i].TR_AMTD); 
                    row_item.getCell(6).numFmt  = _formatAmt;
                    row_item.getCell(7).value   = Number(dt_Data[i].TR_AMTC); 
                    row_item.getCell(7).numFmt  = _formatAmt;
                    row_item.getCell(8).value   = Number(dt_Data[i].TR_BOOKD); 
                    row_item.getCell(8).numFmt  = _formatAmt; 
                    row_item.getCell(9).value   = Number(dt_Data[i].TR_BOOKC); 
                    row_item.getCell(9).numFmt  = _formatAmt; 
                    row_item.getCell(10).value  = dt_Data[i].REMARK;  
                    row_item.getCell(11).value  = dt_Data[i].REMARK2;  
                    row_item.getCell(12).value  = dt_Data[i].PARTNER_ID;   
                    row_item.getCell(13).value  = dt_Data[i].PARTNER_LNAME;  
                    row_item.getCell(14).value  = dt_Data[i].PL_CD;
                    row_item.getCell(15).value   = dt_Data[i].PL_NM;   
                    
                    total_trans_dr       += Number(dt_Data[i].TR_AMTD);
                    total_trans_cr       += Number(dt_Data[i].TR_AMTC);
                    total_book_dr        += Number(dt_Data[i].TR_BOOKD);
                    total_book_cr        += Number(dt_Data[i].TR_BOOKC);
                    pos = pos + 1; 
                    //row_item.commit();

                }  
                var row = worksheet.getRow(pos);
                worksheet.mergeCells(pos,1,pos,5); 
                if(_lang == 'VIE'){
                    row.getCell(1).value  = "Tổng";
                }
                else{
                    row.getCell(1).value  = "Total";
                }
                row.getCell(6).value  = total_trans_dr;
                row.getCell(6).numFmt  = _formatAmt; 
                row.getCell(7).value  = total_trans_cr;
                row.getCell(7).numFmt  = _formatAmt; 
                row.getCell(8).value  = total_book_dr;
                row.getCell(8).numFmt  = _formatAmt; 
                row.getCell(9).value  = total_book_cr;
                row.getCell(9).numFmt  = _formatAmt; 
                
                /********* Print file excel ********/
                const reportFile    = Helpers.tmpPath(file_new);
                await workbook.xlsx.writeFile(reportFile)
                return response.attachment( reportFile, file_new);
            }
        } 
        catch (e) 
        {
            Utils.Logger({ LVL: "error", MODULE: "Report", FUNC: "rpt_6030070_AS_FORM", CONTENT: e.message })
           // return response.send(Utils.response(false, e.message, null))
           return response.send(null);
        }
    }    
    async rpt_6030070_NKC({ request, response, auth }) {
        try 
        { 
          /*  P_RPT_ID: report_info.VAL1, P_RPT_URL: report_info.VAL2, P_RPT_FILE: report_info.VAL3,
                P_COMP_ID: company_info.PARTNER_ID, P_COMP_NM: company_info.TEXT, P_COMP_TAX: company_info.TAX_CODE, P_COMP_ADD: company_info.ADDR1,
                P_COMPANY: this.selectedCompany, P_FR_DATE: this.proposedFrom, P_FR_TO: this.proposedTo, P_ACC_PK: this.accCodePK, 
                P_PARTNER_PK: this.partnerPK, P_STATUS: this.status, P_VOUCHER_NO: this.voucherNo, P_SEQ: this.seq, P_BOOK_CCY: this.txtBookCCY,
                P_VOUCHER_TYPE: this.selectedVoucherType, P_CIRCULARS: this.selectedCircular, P_LANG : this.selectedLang,  P_DATE_NOW: this.datetime,
                P_PL: this.plUnitPK, P_DESCRIPTION: this.description
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
            var _store          = "AC_RPT_6030070_NKC";
            var _circular       = "AC_SEL_GET_TT_BPL";
            var _param          = [item.P_COMPANY, item.P_FR_DATE, item.P_FR_TO, item.P_ACC_PK, item.P_PARTNER_PK, item.P_STATUS, item.P_VOUCHER_NO , item.P_SEQ, item.P_BOOK_CCY, item.P_VOUCHER_TYPE, item.P_CIRCULARS, item.P_LANG, item.P_TCO_BUSPLACE_PK, item.P_RPT_TYPE];
            var _param_TT       = [item.P_CIRCULARS, item.P_TCO_BUSPLACE_PK];
            var v_no_title      = "Mẫu số : S03a-DN ", e_no_title = "Form No : S03a-DN" , k_no_title = "양식번호 : S03a-DN";
            var v_dvt           = " Đơn vị tính", e_dvt = " Unit", k_dvt = " 단위";
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
                 /********* Call store sign ***************/ 
                 var _ac_code        = "EACAB031";
                 var _store_sign     = "ac_rpt_6045085_sign";
                 var _param_sign     = [item.P_COMPANY,_ac_code];
                 var dt_Data_sign  = await DBService.callProcCursor(_store_sign, _param_sign, p_language, p_crt_by); 
                 if (dt_Data_sign) 
                 {
                     dt_Data_sign = dt_Data_sign;
                 } 
                 /****************Call CIRCULARS******************/
                 var dt_TT  = await DBService.callProcCursor(_circular, _param_TT , p_language , p_crt_by); 
                 if (dt_TT.length>0) 
                 {
                     dt_TT = dt_TT;
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
                r_item.getCell(1).value = Utils.translate("COMPANY",_dictionary , p_language) + ": " +COMP_NM;    //+ COMP_ID +" - "
                r_item = worksheet.getRow(2);
                r_item.getCell(1).value = Utils.translate("TAX_CODE",_dictionary, p_language) + ": "+ COMP_TAX;   
                r_item = worksheet.getRow(3);
                r_item.getCell(1).value = Utils.translate("ADDRESS",_dictionary , p_language) + ": "+ COMP_ADD;
                var FromDate = item.P_FR_DATE;
                var ToDate = item.P_FR_TO;
                var strFrDate = FromDate.substr(6,2) + "/"+ FromDate.substr(4,2)+ "/"+ FromDate.substr(0,4);
                var strToDate = ToDate.substr(6,2) + "/"+ ToDate.substr(4,2)+ "/"+ ToDate.substr(0,4);
               // worksheet.getCell("A6").value = "From date : " + strFrDate + " To date : " + strToDate;
                var _bookccy = item.P_BOOK_CCY;
                worksheet.getCell("K6").value = _bookccy;
                worksheet.mergeCells('A7', 'A8');
                worksheet.mergeCells('B7', 'C7');  
                worksheet.mergeCells('G7', 'I7'); 
                // thông tư
                 var _lang = item.P_LANG;
                 if(_lang == 'VIE'){
                     worksheet.getCell("G1").value =  v_no_title;
                     worksheet.getCell("G2").value =  dt_TT[0].V1 ;
                     worksheet.getCell("G3").value =  dt_TT[0].V2 ;
                     worksheet.getCell("A4").value = "Nhật Ký Chung";
                     worksheet.getCell("A5").value = "Từ ngày " + strFrDate + " đến ngày " + strToDate;
                     worksheet.getCell("J6").value = v_dvt;
                     //grid
                     
                     worksheet.getCell("A7").value = "Ngày tháng ghi sổ";
                     worksheet.getCell("B7").value = "Chứng từ";
                     worksheet.getCell("B8").value = "Số hiệu";
                     worksheet.getCell("C8").value = "Ngày";
                     worksheet.getCell("D7").value = "Diễn giải";
                     worksheet.getCell("E7").value = "Description";
                     worksheet.getCell("F7").value = "Đã ghi";
                     worksheet.getCell("F8").value = "SC";
                     worksheet.getCell("G7").value = "Số hiệu TK";
                     worksheet.getCell("G8").value = "Nợ";
                     worksheet.getCell("H8").value = "CS";
                     worksheet.getCell("I8").value = "Có";
                     worksheet.getCell("J7").value = "Số ghi sổ";
                     worksheet.mergeCells('K7', 'K8'); 
                     worksheet.getCell("K7").value = "Ghi chú Seq";
                 }
                 else{
                     worksheet.getCell("G1").value =  e_no_title;
                     worksheet.getCell("G2").value =  dt_TT[0].E1 ;
                     worksheet.getCell("G3").value =  dt_TT[0].E2 ;
                     worksheet.getCell("A5").value = "From date " + strFrDate + " To date " + strToDate;
                 }
                var pos = 9; 
                var total_Amt  = 0;
                var _formatAmt = (_bookccy=='VND'?'_(* #,##0_);_(* (#,##0);_(* "-"_);_(@_)':'_(* #,##0.00_);_(* (#,##0.00);_(* "-"_);_(@_)');

               
                if(dt_Data.length>1)
                {
                     worksheet.duplicateRow(pos,dt_Data.length-1,true);
                }  
               for (var i = 0; i < dt_Data.length; i++) 
                {
                    var row_item = worksheet.getRow(pos);
                  //  var  _tr_date = dt_Data[i].TR_DATE.substr(6,2) + "/"+ dt_Data[i].TR_DATE.substr(4,2)+ "/"+ dt_Data[i].TR_DATE.substr(0,4);
                    row_item.getCell(1).value   = dt_Data[i].TR_DATE;    
                    row_item.getCell(2).value   = dt_Data[i].VOUCHERNO;  
                    row_item.getCell(3).value   = dt_Data[i].TR_DATE;
                    row_item.getCell(4).value   = dt_Data[i].REMARK2; 
                    row_item.getCell(5).value   = dt_Data[i].REMARK; 
                    row_item.getCell(6).value   = "X"; 
                    row_item.getCell(7).value   = dt_Data[i].ACC_DR;  
                    row_item.getCell(8).value   = "2"; 
                    row_item.getCell(9).value   = dt_Data[i].ACC_CR;  
                    row_item.getCell(10).value  = dt_Data[i].TR_BOOKAMT;  
                    row_item.getCell(10).numFmt = _formatAmt;
                    row_item.getCell(11).value  = dt_Data[i].PK;   
                    
                    total_Amt       += Number(dt_Data[i].TR_BOOKAMT);
                    pos = pos + 1; 
                    //row_item.commit();

                }  
                var row = worksheet.getRow(pos);
                worksheet.mergeCells(pos,1,pos,5); 
                row.getCell(10).value  = total_Amt; 
                row.getCell(10).numFmt = _formatAmt;
                if(_lang == 'VIE'){
                    row.getCell(1).value = "Tổng cộng số phát sinh" 
                }
                else{
                    row.getCell(1).value = "Total Arising" 
                }
                /************sign */
                worksheet.mergeCells(pos+3,1,pos+3,2); 
                worksheet.mergeCells(pos+4,1,pos+4,2);   
                worksheet.mergeCells(pos+3,7,pos+3,10); 
                worksheet.mergeCells(pos+4,7,pos+4,10); 
                pos = pos + 3;
              
               if(dt_Data_sign.length>1)
               {
                   for (var i = 0; i < dt_Data_sign.length; i++) 
                    {
                       if(_lang == 'VIE' )
                       {   row_item = worksheet.getRow(pos );
                           if (dt_Data_sign[i].CODE =='VIE')
                           {
                               row_item.getCell(1).value = dt_Data_sign[i].VAL1 ; 
                               row_item.getCell(1).font = { bold:true, italic:false };
                               row_item.getCell(4).value = dt_Data_sign[i].VAL2; 
                               row_item.getCell(4).font.bold = true;
                               row_item.getCell(7).value = dt_Data_sign[i].VAL3;                         
                               row_item.getCell(7).font.bold = true;
                               row_item.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
                               row_item.getCell(4).alignment = { vertical: 'middle', horizontal: 'center' };
                               row_item.getCell(7).alignment = { vertical: 'middle', horizontal: 'center' };
                           }
                           
                           row_item = worksheet.getRow(pos +1 );   
                           if (dt_Data_sign[i].CODE =='VIE_SIG')
                           {
                               row_item.getCell(1).value = dt_Data_sign[i].VAL1; 
                               row_item.getCell(1).font.bold = false;
                               row_item.getCell(4).value = dt_Data_sign[i].VAL2; 
                               row_item.getCell(4).font.bold = false;
                               row_item.getCell(7).value = dt_Data_sign[i].VAL3; 
                               row_item.getCell(7).font.bold = false;
                               row_item.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
                               row_item.getCell(7).alignment = { vertical: 'middle', horizontal: 'center' };  
                               row_item.getCell(4).alignment = { vertical: 'middle', horizontal: 'center' };                        
                           }    
                         
                       }
                      /* if(_lang == 'KOR' || _lang == 'KOR-VIE')
                       {
                           row_item = worksheet.getRow(pos ); 
                           if (dt_Data_sign[i].CODE =='KOR')
                           {
                               row_item.getCell(1).value = dt_Data_sign[i].VAL1; 
                               row_item.getCell(1).font.bold = true;    
                               row_item.getCell(4).value = dt_Data_sign[i].VAL2; 
                               row_item.getCell(4).font.bold = true;
                               row_item.getCell(7).value = dt_Data_sign[i].VAL3;                         
                               row_item.getCell(7).font.bold = true;
                               row_item.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' }; 
                               row_item.getCell(4).alignment = { vertical: 'middle', horizontal: 'center' };  
                               row_item.getCell(7).alignment = { vertical: 'middle', horizontal: 'center' };   

                           }
                           
                           row_item = worksheet.getRow(pos +1 );   
                           if (dt_Data_sign[i].CODE =='KOR_SIG')
                           {
                               row_item.getCell(1).value = dt_Data_sign[i].VAL1; 
                               row_item.getCell(1).font.bold = false;
                               row_item.getCell(4).value = dt_Data_sign[i].VAL2; 
                               row_item.getCell(4).font.bold = false;  
                               row_item.getCell(7).value = dt_Data_sign[i].VAL3;
                               row_item.getCell(7).font.bold = false;
                               row_item.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };     
                               row_item.getCell(7).alignment = { vertical: 'middle', horizontal: 'center' };    
                               row_item.getCell(4).alignment = { vertical: 'middle', horizontal: 'center' };                            
                           }   
                       }*/if(_lang == 'ENG' || _lang == 'ENG-KOR'|| _lang == 'ENG-VIE' )
                       {    row_item = worksheet.getRow(pos );
                           if (dt_Data_sign[i].CODE =='ENG')
                           {
                               row_item.getCell(1).value = dt_Data_sign[i].VAL1 + dt_Data_sign[i].VAL1 ; 
                               row_item.getCell(1).font.bold = true;  
                               row_item.getCell(4).value = dt_Data_sign[i].VAL2; 
                               row_item.getCell(4).font.bold = true;                               
                               row_item.getCell(7).value = dt_Data_sign[i].VAL3;                         
                               row_item.getCell(7).font.bold = true;
                               row_item.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };   
                               row_item.getCell(4).alignment = { vertical: 'middle', horizontal: 'center' };   
                               row_item.getCell(7).alignment = { vertical: 'middle', horizontal: 'center' }; 
                                 
                           }
                           
                           row_item = worksheet.getRow(pos +1 );   
                           if (dt_Data_sign[i].CODE =='ENG_SIG')
                           {
                               row_item.getCell(1).value = dt_Data_sign[i].VAL1;                                
                               row_item.getCell(4).value = dt_Data_sign[i].VAL2; 
                               row_item.getCell(7).value = dt_Data_sign[i].VAL3;                             
                               row_item.getCell(1).font.bold = false;
                               row_item.getCell(4).font.bold = false;
                               row_item.getCell(7).font.bold = false;
                               row_item.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };   
                               row_item.getCell(4).alignment = { vertical: 'middle', horizontal: 'center' };   
                               row_item.getCell(7).alignment = { vertical: 'middle', horizontal: 'center' }; 

                           }    
                       }
                       if (dt_Data_sign[i].CODE =='NAME')
                       {
                           row_item = worksheet.getRow(pos +2 ); 
                           row_item.getCell(1).value = dt_Data_sign[i].VAL1; 
                           row_item.getCell(1).font.bold = false;
                           row_item.getCell(4).value = dt_Data_sign[i].VAL2; 
                           row_item.getCell(4).font.bold = false;
                           row_item.getCell(7).value = dt_Data_sign[i].VAL3;         
                           row_item.getCell(7).font.bold = false;
                           row_item.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };   
                           row_item.getCell(4).alignment = { vertical: 'middle', horizontal: 'center' };   
                           row_item.getCell(7).alignment = { vertical: 'middle', horizontal: 'center' }; 
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
            Utils.Logger({ LVL: "error", MODULE: "Report", FUNC: "rpt_6030070_NKC", CONTENT: e.message })
           // return response.send(Utils.response(false, e.message, null))
           return response.send(null);
        }
    }    
}

module.exports = rpt6030070;