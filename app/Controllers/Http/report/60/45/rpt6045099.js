"use strict";

const { DATE } = require("oracledb");

const Helpers = use('Helpers')
const Antl = use("Antl");
const Utils = use("Utils");
const DBService = use("DBService")
var Excel = use('exceljs');
var workbook = new Excel.Workbook();
class rpt6045099 {
    async rpt_6045099_RECEIVABLE_PAYABLE({ request, response, auth }) {
        try {
            /*  
                P_RPT_ID: report_info.VAL1, P_RPT_URL: report_info.VAL2, P_RPT_FILE: report_info.VAL3,
                P_COMP_ID: company_info.PARTNER_ID, P_COMP_NM: company_info.TEXT, P_COMP_TAX: company_info.TAX_CODE, P_COMP_ADD: company_info.ADDR1,
                P_TAB: this.tab_control, P_COMPANY: this.sel_Company,P_ACC_PK: this.txt_AC_PK, P_FR_DATE: this.dt_from, P_FR_TO: this.dt_to, 
                P_PARTNER_PK: this.txt_PARTNER_PK, P_INVOICE_NO: this.txt_INVOICE_NO, P_DATE_INVOICE: this.dt_INVOICE, 
                P_SERIAL_NO : this.txt_SERIAL_NO
            */
            /****************************** Get Param *********************************/
            let { para } = request.get(['para']);
            /********* Parse pram to json ********/
            var item = JSON.parse(para);
            const user = await auth.getUser();
            var COMP_ID = item.P_COMP_ID, COMP_NM = item.P_COMP_NM, COMP_TAX = item.P_COMP_TAX, COMP_ADD = item.P_COMP_ADD;
            const p_crt_by = user.USER_ID;
            const p_language = request.header("accept-language", "ENG");
            var file_nm = [item.P_RPT_FILE];
            var file_type = ".xlsx";
            var full_nm = file_nm + file_type;
            var file_new = file_nm + p_crt_by + file_type;
            var _resourcesPath = [item.P_RPT_URL] + '/' + full_nm;
            var _store = "AC_SEL_6045099_01";//"AC_RPT_6045099_01";
            var _param = [item.P_TAB, item.P_COMPANY, item.P_FR_DATE, item.P_FR_TO, item.P_ACC_PK, item.P_PARTNER_PK, item.P_INVOICE_NO, item.P_DATE_INVOICE, item.P_SERIAL_NO, item.P_TCO_BUSPLACE_PK, "RPT_"+item.P_SELARAPTYPE];
            /***************************** Return failded ****************************/
            if (!user) {
                return response.send(Utils.response(false, "Request failed!", null));
            }
            /****************************** Begin call store and write excell *********/
            else {
                /********* Call store  ***************/
                var dt_Data = await DBService.callProcCursor(_store, _param, p_language, p_crt_by);
                if (dt_Data.length > 0) {
                    dt_Data = dt_Data;
                }
                else {
                    return response.send(Utils.response(false, "no_data_found", null))
                } 
                var _dictionary = await DBService.callProcCursor("GET_DICTIONARY_REPORT", null, p_language, p_crt_by);
                if (_dictionary.length > 0) {
                    _dictionary = _dictionary;
                }
                else {
                    _dictionary = [];
                }
                /********* Read file excel ********/
                const templateFile = Helpers.resourcesPath(_resourcesPath);
                await workbook.xlsx.readFile(templateFile);
                var worksheet = workbook.getWorksheet(1);
                /********* Write file excel ********/

                //INFOMATION COMPANY
                var r_item = worksheet.getRow(1);
                r_item.getCell(1).value = Utils.translate("COMPANY", _dictionary, p_language) + ": " + COMP_ID + " - " + COMP_NM;
                r_item = worksheet.getRow(2);
                r_item.getCell(1).value = Utils.translate("TAX_CODE", _dictionary, p_language) + ": " + COMP_TAX;
                r_item = worksheet.getRow(3);
                r_item.getCell(1).value = Utils.translate("ADDRESS", _dictionary, p_language) + ": " + COMP_ADD;
                var FromDate = item.P_FR_DATE;
                var ToDate = item.P_FR_TO;
                var strFrDate = FromDate.substr(6, 2) + "/" + FromDate.substr(4, 2) + "/" + FromDate.substr(0, 4);
                var strToDate = ToDate.substr(6, 2) + "/" + ToDate.substr(4, 2) + "/" + ToDate.substr(0, 4); 
                var _bookccy = item.P_BOOK_CCY; 
                worksheet.mergeCells('A4', 'R4');
                let title = item.P_SELARAPTYPE+"_LIST";
                title = title.toLowerCase();
                worksheet.getCell("A4").value = Utils.translate(title, _dictionary, p_language);
                worksheet.mergeCells('A5', 'R5');
                worksheet.getCell("A5").value = "From date " + strFrDate + " To date " + strToDate;

                var pos = 9;
                if (dt_Data.length > 1) {
                    worksheet.duplicateRow(pos, dt_Data.length - 1, true);
                }
                var _formatAmt = (_bookccy=='VND'?'_(* #,##0_);[Red]* (#,##0);_(* ""_);_(@_)':'_(* #,##0.00_);[Red]* (#,##0.00);_(* ""_);_(@_)');
                var _format_2 = '_(* #,##0.00_);[Red]* (#,##0.00);_(* ""_);_(@_)';
                for (var i = 0; i < dt_Data.length; i++) {
                    var row_item = worksheet.getRow(pos);
                    row_item.getCell(1).value = dt_Data[i].ROWNUMBER;
                    row_item.getCell(2).value = dt_Data[i].VOUCHERNO;
                    row_item.getCell(3).value = dt_Data[i].TRANS_DATE;
                    row_item.getCell(4).value = dt_Data[i].APP_DATE;
                    row_item.getCell(5).value = dt_Data[i].APP_NO;
                    row_item.getCell(6).value = dt_Data[i].PROJECT;
                    row_item.getCell(7).value = dt_Data[i].SCOPE_OF_WORK;
                    row_item.getCell(8).value = dt_Data[i].PARTNER_NAME;
                    row_item.getCell(9).value = dt_Data[i].CCY;
                    row_item.getCell(10).value = Number(dt_Data[i].TRANS_AMT);
                    row_item.getCell(11).value = Number(dt_Data[i].BOOKS_AMT);
                    row_item.getCell(11).numFmt = _formatAmt;
                    row_item.getCell(12).value = dt_Data[i].SERIAL_NO;
                    row_item.getCell(13).value = dt_Data[i].INVOICE_NO;
                    row_item.getCell(14).value = dt_Data[i].INVOICE_DATE_1;
                    row_item.getCell(15).value = dt_Data[i].DUE_DATE_1;
                    row_item.getCell(16).value = dt_Data[i].REMARK;
                    row_item.getCell(17).value = dt_Data[i].REMARK2;
                    row_item.getCell(18).value = dt_Data[i].SIGN;
                    if(Number(dt_Data[i].ROWNUMBER) == 0){ 
                        let l_subnm = dt_Data[i].PARTNER_NAME.toString().toLowerCase()+"";
                        row_item.getCell(1).value = Utils.translate(l_subnm, _dictionary, p_language);
                        worksheet.mergeCells(pos, 1, pos, 9);
                        row_item.getCell(1).font = { italic: false, bold: true}; 
                        row_item.getCell(10).font = { italic: false, bold: true};
                        row_item.getCell(11).font = { italic: false, bold: true};
                    }else{ 
                        row_item.getCell(10).numFmt = _format_2;
                    }
                    pos = pos + 1;
                }
                pos = pos + 1;
                var row = worksheet.getRow(pos);
                worksheet.mergeCells(pos, 2, pos, 3);
                worksheet.mergeCells(pos, 9, pos, 10);
                worksheet.mergeCells(pos, 13, pos, 15);
                pos = pos + 1;
                row = worksheet.getRow(pos);
                worksheet.mergeCells(pos, 2, pos, 3);
                worksheet.mergeCells(pos, 9, pos, 10);
                worksheet.mergeCells(pos, 13, pos, 15);
                /********* Print file excel ********/
                const reportFile = Helpers.tmpPath(file_new);
                await workbook.xlsx.writeFile(reportFile)
                return response.attachment(reportFile, file_new);
            }
        }
        catch (e) {
            Utils.Logger({ LVL: "error", MODULE: "Report", FUNC: "rpt_6045099_RECEIVABLE_PAYABLE", CONTENT: e.message })
            console.log(e)
            // return response.send(Utils.response(false, e.message, null))
            return response.send(null);
        }
    }
    /*########################################################## Report ##################################################################################*/
    async rpt_6045099_SUMMARY({ request, response, auth }) {
        try {
            /*  
                   P_RPT_ID: report_info.VAL1, P_RPT_URL: report_info.VAL2, P_RPT_FILE: report_info.VAL3,
                  P_COMP_ID: company_info.PARTNER_ID, P_COMP_NM: company_info.TEXT, P_COMP_TAX: company_info.TAX_CODE, P_COMP_ADD: company_info.ADDR1,
                  P_TAB: this.tab_control, P_COMPANY: this.sel_Company,P_ACC_PK: this.txt_AC_PK, P_FR_DATE: this.dt_from, P_FR_TO: this.dt_to, 
                  P_PARTNER_PK: this.txt_PARTNER_PK, P_INVOICE_NO: this.txt_INVOICE_NO, P_DATE_INVOICE: this.dt_INVOICE, 
                  P_SERIAL_NO : this.txt_SERIAL_NO
                */
            /****************************** Get Param *********************************/
            let { para } = request.get(['para']);
            /********* Parse pram to json ********/
            var item = JSON.parse(para);
            const user = await auth.getUser();
            var COMP_ID = item.P_COMP_ID, COMP_NM = item.P_COMP_NM, COMP_TAX = item.P_COMP_TAX, COMP_ADD = item.P_COMP_ADD;
            const p_crt_by = user.USER_ID;
            const p_language = request.header("accept-language", "ENG");
            var file_nm = [item.P_RPT_FILE];
            var file_type = ".xlsx";
            var full_nm = file_nm + file_type;
            var file_new = file_nm + p_crt_by + file_type;
            var _resourcesPath = [item.P_RPT_URL] + '/' + full_nm;
            var _store = "AC_SEL_6045099_01";//"AC_RPT_6045099_01";
            // var _circular       = "AC_SEL_GET_TT_BPL";
            var _param = [item.P_TAB, item.P_COMPANY, item.P_FR_DATE, item.P_FR_TO, item.P_ACC_PK, item.P_PARTNER_PK, item.P_INVOICE_NO, item.P_DATE_INVOICE, item.P_SERIAL_NO, item.P_TCO_BUSPLACE_PK, item.P_SELARAPTYPE];
            //var _param_TT       = [item.P_CIRCULARS];
            var v_no_title = "Mẫu số : S03a-DN ", e_no_title = "Form No : S03a-DN", k_no_title = "양식번호 : S03a-DN";
            var v_dvt = " Đơn vị tính", e_dvt = " Unit", k_dvt = " 단위";
            /***************************** Return failded ****************************/
            if (!user) {
                return response.send(Utils.response(false, "Request failed!", null));
            }
            /****************************** Begin call store and write excell *********/
            else {
                /********* Call store  ***************/
                var dt_Data = await DBService.callProcCursor(_store, _param, p_language, p_crt_by);
                if (dt_Data.length > 0) {
                    dt_Data = dt_Data;
                }
                else {
                    return response.send(Utils.response(false, "no_data_found", null))
                }
                /********* Call store sign ***************/
                var _ac_code = "EACAB031";
                var _store_sign = "ac_rpt_6045085_sign";
                var _param_sign = [item.P_COMPANY, _ac_code];
                var dt_Data_sign = await DBService.callProcCursor(_store_sign, _param_sign, p_language, p_crt_by);
                if (dt_Data_sign) {
                    dt_Data_sign = dt_Data_sign;
                }
                /****************Call CIRCULARS******************/
                //  var dt_TT  = await DBService.callProcCursor(_circular, _param_TT , p_language , p_crt_by); 
                //  if (dt_TT.length>0) 
                //  {
                //      dt_TT = dt_TT;
                //  } 
                //  else 
                //  {
                //      return response.send(Utils.response(false, "no_data_found", null))
                //  } 
                var _dictionary = await DBService.callProcCursor("GET_DICTIONARY_REPORT", null, p_language, p_crt_by);
                if (_dictionary.length > 0) {
                    _dictionary = _dictionary;
                }
                else {
                    _dictionary = [];
                }
                /********* Read file excel ********/
                const templateFile = Helpers.resourcesPath(_resourcesPath);
                await workbook.xlsx.readFile(templateFile);
                var worksheet = workbook.getWorksheet(1);
                /********* Write file excel ********/

                //INFOMATION COMPANY
                var r_item = worksheet.getRow(1);
                r_item.getCell(1).value = Utils.translate("COMPANY", _dictionary, p_language) + ": " + COMP_ID + " - " + COMP_NM;
                r_item = worksheet.getRow(2);
                r_item.getCell(1).value = Utils.translate("TAX_CODE", _dictionary, p_language) + ": " + COMP_TAX;
                r_item = worksheet.getRow(3);
                r_item.getCell(1).value = Utils.translate("ADDRESS", _dictionary, p_language) + ": " + COMP_ADD;
                var FromDate = item.P_FR_DATE;
                var ToDate = item.P_FR_TO;
                var strFrDate = FromDate.substr(6, 2) + "/" + FromDate.substr(4, 2) + "/" + FromDate.substr(0, 4);
                var strToDate = ToDate.substr(6, 2) + "/" + ToDate.substr(4, 2) + "/" + ToDate.substr(0, 4);
                // worksheet.getCell("A6").value = "From date : " + strFrDate + " To date : " + strToDate;
                var _bookccy = item.P_BOOK_CCY;
                //worksheet.getCell("K6").value = _bookccy;
                worksheet.mergeCells('B7', 'C7');
                worksheet.mergeCells('D7', 'E7');
                worksheet.getCell("A5").value = "From date " + strFrDate + " To date " + strToDate;
                // thông tư
                var _lang = item.P_LANG;
                var pos = 9;
                var Begin_Trans_Amt = 0;
                var Begin_Book_Amt = 0;
                var Dr_Trans_Amt = 0;
                var Dr_Book_Amt = 0;
                var Cr_Trans_Amt = 0;
                var Cr_Book_Amt = 0;
                var End_Trans_Amt = 0;
                var End_Book_Amt = 0;

                if (dt_Data.length > 1) {
                    worksheet.duplicateRow(pos, dt_Data.length - 1, true);
                }
                for (var i = 0; i < dt_Data.length; i++) {
                    var row_item = worksheet.getRow(pos);
                    //  var  _tr_date = dt_Data[i].TR_DATE.substr(6,2) + "/"+ dt_Data[i].TR_DATE.substr(4,2)+ "/"+ dt_Data[i].TR_DATE.substr(0,4);
                    row_item.getCell(1).value = dt_Data[i].ROWNUMBER;
                    row_item.getCell(2).value = dt_Data[i].AC_CD;
                    row_item.getCell(3).value = dt_Data[i].AC_NM;
                    row_item.getCell(4).value = dt_Data[i].PARTNER_ID;
                    row_item.getCell(5).value = dt_Data[i].PARTNER_NAME;
                    row_item.getCell(6).value = dt_Data[i].VOUCHER_NO;
                    row_item.getCell(7).value = dt_Data[i].SERIAL_NO;
                    row_item.getCell(8).value = dt_Data[i].INVOICE_DATE;
                    row_item.getCell(9).value = dt_Data[i].INVOICE_NO;
                    row_item.getCell(10).value = dt_Data[i].CCY;
                    row_item.getCell(11).value = Number(dt_Data[i].BEGIN_TRANS_AMT);
                    row_item.getCell(12).value = Number(dt_Data[i].BEGIN_BOOKS_AMT);
                    row_item.getCell(13).value = Number(dt_Data[i].DR_TRANS_AMT);
                    row_item.getCell(14).value = Number(dt_Data[i].DR_BOOKS_AMT);
                    row_item.getCell(15).value = Number(dt_Data[i].CR_TRANS_AMT);
                    row_item.getCell(16).value = Number(dt_Data[i].CR_BOOKS_AMT);
                    row_item.getCell(17).value = Number(dt_Data[i].END_TRANS_AMT);
                    row_item.getCell(18).value = Number(dt_Data[i].END_BOOKS_AMT);
                    row_item.getCell(19).value = '';

                    Begin_Trans_Amt += Number(dt_Data[i].BEGIN_TRANS_AMT);
                    Begin_Book_Amt += Number(dt_Data[i].BEGIN_BOOKS_AMT);
                    Dr_Trans_Amt += Number(dt_Data[i].DR_TRANS_AMT);
                    Dr_Book_Amt += Number(dt_Data[i].DR_BOOKS_AMT);
                    Cr_Trans_Amt += Number(dt_Data[i].CR_TRANS_AMT);
                    Cr_Book_Amt += Number(dt_Data[i].CR_BOOKS_AMT);
                    End_Trans_Amt += Number(dt_Data[i].END_TRANS_AMT);
                    End_Book_Amt += Number(dt_Data[i].END_BOOKS_AMT);

                    pos = pos + 1;
                    //row_item.commit();

                }
                var row = worksheet.getRow(pos);
                worksheet.mergeCells(pos, 1, pos, 9);
                row.getCell(1).value = "Total Arising"
                row.getCell(10).value = Begin_Trans_Amt;
                row.getCell(11).value = Begin_Book_Amt;
                row.getCell(12).value = Dr_Trans_Amt;
                row.getCell(13).value = Dr_Book_Amt;
                row.getCell(14).value = Cr_Trans_Amt;
                row.getCell(15).value = Cr_Book_Amt;
                row.getCell(16).value = End_Trans_Amt;
                row.getCell(17).value = End_Book_Amt;

                /************sign 
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

                /********* Print file excel ********/
                const reportFile = Helpers.tmpPath(file_new);
                await workbook.xlsx.writeFile(reportFile)
                return response.attachment(reportFile, file_new);
            }
        }
        catch (e) {
            Utils.Logger({ LVL: "error", MODULE: "Report", FUNC: "rpt_6045099_SUMMARY", CONTENT: e.message })
            // return response.send(Utils.response(false, e.message, null))
            return response.send(null);
        }
    }
    async rpt_6045099_DETAIL({ request, response, auth }) {
        try {
            /*  
                   P_RPT_ID: report_info.VAL1, P_RPT_URL: report_info.VAL2, P_RPT_FILE: report_info.VAL3,
                  P_COMP_ID: company_info.PARTNER_ID, P_COMP_NM: company_info.TEXT, P_COMP_TAX: company_info.TAX_CODE, P_COMP_ADD: company_info.ADDR1,
                  P_TAB: this.tab_control, P_COMPANY: this.sel_Company,P_ACC_PK: this.txt_AC_PK, P_FR_DATE: this.dt_from, P_FR_TO: this.dt_to, 
                  P_PARTNER_PK: this.txt_PARTNER_PK, P_INVOICE_NO: this.txt_INVOICE_NO, P_DATE_INVOICE: this.dt_INVOICE, 
                  P_SERIAL_NO : this.txt_SERIAL_NO
                */
            /****************************** Get Param *********************************/
            let { para } = request.get(['para']);
            /********* Parse pram to json ********/
            var item = JSON.parse(para);
            const user = await auth.getUser();
            var COMP_ID = item.P_COMP_ID, COMP_NM = item.P_COMP_NM, COMP_TAX = item.P_COMP_TAX, COMP_ADD = item.P_COMP_ADD;
            const p_crt_by = user.USER_ID;
            const p_language = request.header("accept-language", "ENG");
            var file_nm = [item.P_RPT_FILE];
            var file_type = ".xlsx";
            var full_nm = file_nm + file_type;
            var file_new = file_nm + p_crt_by + file_type;
            var _resourcesPath = [item.P_RPT_URL] + '/' + full_nm;
            var _store = "AC_SEL_6045099_01";//"AC_RPT_6045099_01";
            // var _circular       = "AC_SEL_GET_TT_BPL";
            var _param = [item.P_TAB, item.P_COMPANY, item.P_FR_DATE, item.P_FR_TO, item.P_ACC_PK, item.P_PARTNER_PK, item.P_INVOICE_NO, item.P_DATE_INVOICE, item.P_SERIAL_NO, item.P_TCO_BUSPLACE_PK, item.P_SELARAPTYPE];
            //var _param_TT       = [item.P_CIRCULARS];
            var v_no_title = "Mẫu số : S03a-DN ", e_no_title = "Form No : S03a-DN", k_no_title = "양식번호 : S03a-DN";
            var v_dvt = " Đơn vị tính", e_dvt = " Unit", k_dvt = " 단위";
            /***************************** Return failded ****************************/
            if (!user) {
                return response.send(Utils.response(false, "Request failed!", null));
            }
            /****************************** Begin call store and write excell *********/
            else {
                /********* Call store  ***************/
                var dt_Data = await DBService.callProcCursor(_store, _param, p_language, p_crt_by);
                if (dt_Data.length > 0) {
                    dt_Data = dt_Data;
                }
                else {
                    return response.send(Utils.response(false, "no_data_found", null))
                }
                /********* Call store sign ***************/
                var _ac_code = "EACAB031";
                var _store_sign = "ac_rpt_6045085_sign";
                var _param_sign = [item.P_COMPANY, _ac_code];
                var dt_Data_sign = await DBService.callProcCursor(_store_sign, _param_sign, p_language, p_crt_by);
                if (dt_Data_sign) {
                    dt_Data_sign = dt_Data_sign;
                }
                /****************Call CIRCULARS******************/
                //  var dt_TT  = await DBService.callProcCursor(_circular, _param_TT , p_language , p_crt_by); 
                //  if (dt_TT.length>0) 
                //  {
                //      dt_TT = dt_TT;
                //  } 
                //  else 
                //  {
                //      return response.send(Utils.response(false, "no_data_found", null))
                //  } 
                var _dictionary = await DBService.callProcCursor("GET_DICTIONARY_REPORT", null, p_language, p_crt_by);
                if (_dictionary.length > 0) {
                    _dictionary = _dictionary;
                }
                else {
                    _dictionary = [];
                }
                /********* Read file excel ********/
                const templateFile = Helpers.resourcesPath(_resourcesPath);
                await workbook.xlsx.readFile(templateFile);
                var worksheet = workbook.getWorksheet(1);
                /********* Write file excel ********/

                //INFOMATION COMPANY
                var r_item = worksheet.getRow(1);
                r_item.getCell(1).value = Utils.translate("COMPANY", _dictionary, p_language) + ": " + COMP_ID + " - " + COMP_NM;
                r_item = worksheet.getRow(2);
                r_item.getCell(1).value = Utils.translate("TAX_CODE", _dictionary, p_language) + ": " + COMP_TAX;
                r_item = worksheet.getRow(3);
                r_item.getCell(1).value = Utils.translate("ADDRESS", _dictionary, p_language) + ": " + COMP_ADD;
                var FromDate = item.P_FR_DATE;
                var ToDate = item.P_FR_TO;
                var strFrDate = FromDate.substr(6, 2) + "/" + FromDate.substr(4, 2) + "/" + FromDate.substr(0, 4);
                var strToDate = ToDate.substr(6, 2) + "/" + ToDate.substr(4, 2) + "/" + ToDate.substr(0, 4);
                // worksheet.getCell("A6").value = "From date : " + strFrDate + " To date : " + strToDate;
                var _bookccy = item.P_BOOK_CCY;
                //worksheet.getCell("K6").value = _bookccy;
                worksheet.mergeCells('B7', 'C7');
                worksheet.mergeCells('D7', 'E7');
                worksheet.getCell("A5").value = "From date " + strFrDate + " To date " + strToDate;
                // thông tư
                var _lang = item.P_LANG;
                var pos = 9;
                var Begin_Trans_Amt = 0;
                var Begin_Book_Amt = 0;
                var Dr_Trans_Amt = 0;
                var Dr_Book_Amt = 0;
                var Cr_Trans_Amt = 0;
                var Cr_Book_Amt = 0;
                var End_Trans_Amt = 0;
                var End_Book_Amt = 0;

                if (dt_Data.length > 1) {
                    worksheet.duplicateRow(pos, dt_Data.length - 1, true);
                }
                for (var i = 0; i < dt_Data.length; i++) {
                    var row_item = worksheet.getRow(pos);
                    //  var  _tr_date = dt_Data[i].TR_DATE.substr(6,2) + "/"+ dt_Data[i].TR_DATE.substr(4,2)+ "/"+ dt_Data[i].TR_DATE.substr(0,4);
                    row_item.getCell(1).value = dt_Data[i].ROWNUMBER;
                    row_item.getCell(2).value = dt_Data[i].AC_CD;
                    row_item.getCell(3).value = dt_Data[i].AC_NM;
                    row_item.getCell(4).value = dt_Data[i].PARTNER_ID;
                    row_item.getCell(5).value = dt_Data[i].PARTNER_NAME;
                    row_item.getCell(6).value = dt_Data[i].SERIAL_NO;
                    row_item.getCell(7).value = dt_Data[i].INVOICE_DATE;
                    row_item.getCell(8).value = dt_Data[i].INVOICE_NO;
                    row_item.getCell(9).value = dt_Data[i].CCY;
                    row_item.getCell(10).value = Number(dt_Data[i].DR_TRANS_AMT);
                    row_item.getCell(11).value = Number(dt_Data[i].DR_BOOKS_AMT);
                    row_item.getCell(12).value = Number(dt_Data[i].CR_TRANS_AMT);
                    row_item.getCell(13).value = Number(dt_Data[i].CR_BOOKS_AMT);
                    row_item.getCell(14).value = dt_Data[i].TR_DATE;
                    row_item.getCell(15).value = dt_Data[i].VOUCHERNO;
                    row_item.getCell(16).value = dt_Data[i].REMARK;
                    row_item.getCell(17).value = dt_Data[i].REMARK2;
                    row_item.getCell(18).value = dt_Data[i].DUE_DATE;
                    row_item.getCell(19).value = dt_Data[i].TAC_HGTRH_PK;

                    Dr_Trans_Amt += Number(dt_Data[i].DR_TRANS_AMT);
                    Dr_Book_Amt += Number(dt_Data[i].DR_BOOKS_AMT);
                    Cr_Trans_Amt += Number(dt_Data[i].CR_TRANS_AMT);
                    Cr_Book_Amt += Number(dt_Data[i].CR_BOOKS_AMT);

                    pos = pos + 1;
                    //row_item.commit();

                }
                var row = worksheet.getRow(pos);
                worksheet.mergeCells(pos, 1, pos, 9);
                row.getCell(1).value = "Total Arising"
                row.getCell(10).value = Dr_Trans_Amt;
                row.getCell(11).value = Dr_Book_Amt;
                row.getCell(12).value = Cr_Trans_Amt;
                row.getCell(13).value = Cr_Book_Amt;

                /************sign 
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

                /********* Print file excel ********/
                const reportFile = Helpers.tmpPath(file_new);
                await workbook.xlsx.writeFile(reportFile)
                return response.attachment(reportFile, file_new);
            }
        }
        catch (e) {
            Utils.Logger({ LVL: "error", MODULE: "Report", FUNC: "rpt_6045099_DETAIL", CONTENT: e.message })
            // return response.send(Utils.response(false, e.message, null))
            return response.send(null);
        }
    }
}

module.exports = rpt6045099;