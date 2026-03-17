"use strict";
const Helpers       = use('Helpers')
const Antl          = use("Antl");
const Utils         = use("Utils");
const DBService = use("DBService")
var Excel           = use('exceljs');
var workbook        = new Excel.Workbook();
class rpt6025050 {
/*########################################################## Report JH ##################################################################################*/ 
    async rpt_6025050_IQ({ request, response, auth }) {
        try 
        { 
          /*P_RPT_ID: report_info.VAL1, P_RPT_FILE: report_info.VAL2,
            P_COMPANY: this.sel_Company, P_DT_MONTH: this.dt_mmyy, P_VAT_TYPE: this.sel_VatType, P_TAX_RATE: this.sel_TaxRate, 
            P_CURRENT_CCY: this.sel_Ccy, P_STATUS: this.sel_Status, P_CUST_PK: this.txt_Customer_PK, P_INVOICE_NO: this.txt_InvoiceNo,
            P_AC_CD: this.txt_ACC_CD, P_SEQ: this.txt_Seq, P_VOUCHER_NO: this.sel_VoucherType, P_BALANCE: this.sel_Banlance,
            P_DT_FR: this.dt_from, P_DT_TO: this.dt_to, P_BIZ: this.sel_Bizpalce, P_LANG : this.selectedLang*/
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
            var P_FILE_TYPE     = item.P_FILE_TYPE?item.P_FILE_TYPE:'.xlsx';
            var _store          = "AC_RPT_6025050_IQ_V2";
            var _param          = [ item.P_COMPANY, item.P_SEQ, item.P_VOUCHER_TYPE, item.P_CUST_CD, item.P_STATUS, item.P_VOUCHER_NO, item.P_TR_FR_DT, item.P_TR_TO_DT, item.P_RP_PERSON, item.P_DESC1, item.P_DESC2, item.P_TCO_BUSPLACE_PK];
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
                var dt_Data_sign    = await DBService.callProcCursor(_store_sign, _param_sign, p_language, p_crt_by); 
                if (dt_Data_sign) 
                {
                    dt_Data_sign = dt_Data_sign;
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
                
                /*Set Header */ 
                //worksheet.getCell("B47").value = temp;
                var r_item = worksheet.getRow(1);
                r_item.getCell(1).value = Utils.translate("COMPANY",_dictionary , p_language) + ": " + _COMP_ID +" - "+ dt_Data[0].BIZ_NM;//_COMP_NM;    
                r_item = worksheet.getRow(2);
                r_item.getCell(1).value = Utils.translate("TAX_CODE",_dictionary, p_language) + ": "+ dt_Data[0].BIZ_TAX;//_COMP_TAX;   
                r_item = worksheet.getRow(3);
                r_item.getCell(1).value = Utils.translate("ADDRESS",_dictionary , p_language) + ": "+ dt_Data[0].BIZ_ADD;//_COMP_ADD; 
                

                r_item = worksheet.getRow(5);
                r_item.getCell(1).value = Utils.translate("TRANS_DATE",_dictionary , p_language);    
                r_item.getCell(5).value = Utils.translate("STATUS",_dictionary, p_language);   
                r_item.getCell(7).value = Utils.translate("VOUCHER_TYPE",_dictionary , p_language) + ": "; 

                r_item.getCell(3).value =  dt_Data[0].TRANS_DATE ;  
                r_item.getCell(6).value =  dt_Data[0].STATUS_TYPE ; 
                r_item.getCell(8).value =  dt_Data[0].VOUCHER_TYPE ;   
                var pos = 9; 
                if(dt_Data.length>1)
                {
                    worksheet.duplicateRow(pos,dt_Data.length-1,true);
                }   
                for (var i = 0; i < dt_Data.length; i++) 
                {
                    var row_item = worksheet.getRow(pos);

                    row_item.getCell(1).value = i+1;    
                    row_item.getCell(2).value = dt_Data[i].SEQ;  
                    row_item.getCell(3).value = dt_Data[i].VOUCHERNO;  
                    row_item.getCell(4).value = dt_Data[i].TRS_DATE;  
                    row_item.getCell(5).value = dt_Data[i].PARTNER_ID;  
                    row_item.getCell(6).value = dt_Data[i].PARTNER_NAME;  
                    row_item.getCell(7).value = dt_Data[i].TOTAL;  
                    row_item.getCell(8).value = dt_Data[i].REMARK;   
                    row_item.getCell(9).value = dt_Data[i].REMARK2;   
                    row_item.getCell(10).value = dt_Data[i].TR_PERSON;   
                    row_item.getCell(11).value = dt_Data[i].TR_ENCLOSE; 
                    row_item.getCell(12).value = dt_Data[i].TR_STATUS; 
                    row_item.getCell(13).value = dt_Data[i].CRT_BY; 
                    pos = pos + 1; 
                }   
                let _lang = item.P_LANG;
                pos = pos + 1;
                if(dt_Data_sign.length>1)
               {
                   for (var i = 0; i < dt_Data_sign.length; i++) 
                    {
                       if(_lang == 'VIE' )
                       {   row_item = worksheet.getRow(pos );
                           if (dt_Data_sign[i].CODE =='VIE')
                           {
                               row_item.getCell(2).value       = dt_Data_sign[i].VAL1 ; 
                               row_item.getCell(2).font        = { bold:true, italic:false };
                               row_item.getCell(8).value       = dt_Data_sign[i].VAL2; 
                               row_item.getCell(8).font.bold   = true;
                               row_item.getCell(11).value      = dt_Data_sign[i].VAL3;                         
                               row_item.getCell(11).font.bold  = true;
                               row_item.getCell(2).alignment   = { vertical: 'middle', horizontal: 'center' };
                               row_item.getCell(8).alignment   = { vertical: 'middle', horizontal: 'center' };
                               row_item.getCell(11).alignment  = { vertical: 'middle', horizontal: 'center' };
                           }
                           
                           row_item = worksheet.getRow(pos + 1);   
                           if (dt_Data_sign[i].CODE =='VIE_SIG')
                           {
                               row_item.getCell(2).value = dt_Data_sign[i].VAL1; 
                               row_item.getCell(2).font.bold = false;
                               row_item.getCell(8).value = dt_Data_sign[i].VAL2; 
                               row_item.getCell(8).font.bold = false;
                               row_item.getCell(11).value = dt_Data_sign[i].VAL3; 
                               row_item.getCell(11).font.bold = false;
                               row_item.getCell(2).alignment = { vertical: 'middle', horizontal: 'center' };
                               row_item.getCell(11).alignment = { vertical: 'middle', horizontal: 'center' };  
                               row_item.getCell(8).alignment = { vertical: 'middle', horizontal: 'center' };                        
                           }    
                         
                       }
                      if(_lang == 'KOR' || _lang == 'KOR-VIE')
                       {
                           row_item = worksheet.getRow(pos ); 
                           if (dt_Data_sign[i].CODE =='KOR')
                           {
                               row_item.getCell(2).value = dt_Data_sign[i].VAL1; 
                               row_item.getCell(2).font.bold = true;    
                               row_item.getCell(8).value = dt_Data_sign[i].VAL2; 
                               row_item.getCell(8).font.bold = true;
                               row_item.getCell(11).value = dt_Data_sign[i].VAL3;                         
                               row_item.getCell(11).font.bold = true;
                               row_item.getCell(2).alignment = { vertical: 'middle', horizontal: 'center' }; 
                               row_item.getCell(8).alignment = { vertical: 'middle', horizontal: 'center' };  
                               row_item.getCell(11).alignment = { vertical: 'middle', horizontal: 'center' };   

                           }
                           
                           row_item = worksheet.getRow(pos +1 );   
                           if (dt_Data_sign[i].CODE =='KOR_SIG')
                           {
                               row_item.getCell(2).value = dt_Data_sign[i].VAL1; 
                               row_item.getCell(2).font.bold = false;
                               row_item.getCell(8).value = dt_Data_sign[i].VAL2; 
                               row_item.getCell(8).font.bold = false;  
                               row_item.getCell(11).value = dt_Data_sign[i].VAL3;
                               row_item.getCell(11).font.bold = false;
                               row_item.getCell(2).alignment = { vertical: 'middle', horizontal: 'center' };     
                               row_item.getCell(11).alignment = { vertical: 'middle', horizontal: 'center' };    
                               row_item.getCell(8).alignment = { vertical: 'middle', horizontal: 'center' };                            
                           }  
                        }
                       if(_lang == 'ENG' || _lang == 'ENG-KOR'|| _lang == 'ENG-VIE' )
                       {    row_item = worksheet.getRow(pos );
                           if (dt_Data_sign[i].CODE =='ENG')
                           {
                               row_item.getCell(2).value = dt_Data_sign[i].VAL1; 
                               row_item.getCell(2).font.bold = true;  
                               row_item.getCell(8).value = dt_Data_sign[i].VAL2; 
                               row_item.getCell(8).font.bold = true;                               
                               row_item.getCell(11).value = dt_Data_sign[i].VAL3;                         
                               row_item.getCell(11).font.bold = true;
                               row_item.getCell(2).alignment = { vertical: 'middle', horizontal: 'center' };   
                               row_item.getCell(8).alignment = { vertical: 'middle', horizontal: 'center' };   
                               row_item.getCell(11).alignment = { vertical: 'middle', horizontal: 'center' }; 
                                 
                           }
                           
                           row_item = worksheet.getRow(pos +1 );   
                           if (dt_Data_sign[i].CODE =='ENG_SIG')
                           {
                               row_item.getCell(2).value = dt_Data_sign[i].VAL1;                                
                               row_item.getCell(8).value = dt_Data_sign[i].VAL2; 
                               row_item.getCell(11).value = dt_Data_sign[i].VAL3;                             
                               row_item.getCell(2).font.bold = false;
                               row_item.getCell(8).font.bold = false;
                               row_item.getCell(11).font.bold = false;
                               row_item.getCell(2).alignment = { vertical: 'middle', horizontal: 'center' };   
                               row_item.getCell(8).alignment = { vertical: 'middle', horizontal: 'center' };   
                               row_item.getCell(11).alignment = { vertical: 'middle', horizontal: 'center' }; 

                           }    
                       }
                       if (dt_Data_sign[i].CODE =='NAME')
                       {
                           row_item = worksheet.getRow(pos +2 ); 
                           row_item.getCell(2).value = dt_Data_sign[i].VAL1; 
                           row_item.getCell(2).font.bold = false;
                           row_item.getCell(8).value = dt_Data_sign[i].VAL2; 
                           row_item.getCell(8).font.bold = false;
                           row_item.getCell(11).value = dt_Data_sign[i].VAL3;         
                           row_item.getCell(11).font.bold = false;
                           row_item.getCell(2).alignment = { vertical: 'middle', horizontal: 'center' };   
                           row_item.getCell(8).alignment = { vertical: 'middle', horizontal: 'center' };   
                           row_item.getCell(11).alignment = { vertical: 'middle', horizontal: 'center' }; 
                       }
                        
                    }
               }
                /********* Print file excel ********/
                const reportFile    = Helpers.tmpPath(file_new);
                await workbook.xlsx.writeFile(reportFile) 
                if( P_FILE_TYPE ==".xlsx")
                {  
                    return response.attachment( reportFile, file_nm+ P_FILE_TYPE );
                }

                if( P_FILE_TYPE ==".pdf")
                { 
                    const reportFilePdf =  await Utils.excelToPdf(reportFile);
                    return response.attachment( reportFilePdf, file_nm+ P_FILE_TYPE );
                }
                return response.attachment( reportFile, file_new);
            }
        } 
        catch (e) 
        {
            return response.send(Utils.response(false, e.message, null))
        }
    }  
    async rpt_6025050_RP_BK({ request, response, auth }) {
        try 
        { 
          /*P_RPT_ID: report_info.VAL1, P_RPT_FILE: report_info.VAL2,
            P_COMPANY: this.sel_Company, P_DT_MONTH: this.dt_mmyy, P_VAT_TYPE: this.sel_VatType, P_TAX_RATE: this.sel_TaxRate, 
            P_CURRENT_CCY: this.sel_Ccy, P_STATUS: this.sel_Status, P_CUST_PK: this.txt_Customer_PK, P_INVOICE_NO: this.txt_InvoiceNo,
            P_AC_CD: this.txt_ACC_CD, P_SEQ: this.txt_Seq, P_VOUCHER_NO: this.sel_VoucherType, P_BALANCE: this.sel_Banlance,
            P_DT_FR: this.dt_from, P_DT_TO: this.dt_to, P_BIZ: this.sel_Bizpalce, P_SEQ_GRD : l_seq*/
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
            var P_FILE_TYPE     = item.P_FILE_TYPE?item.P_FILE_TYPE:'.xlsx';
            var _store          = "rpt_6025050_RP";
            var _param          = [ item.P_COMPANY, item.P_SEQ_GRD, item.P_CIRCULARS, item.P_BOOK_CCY];
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
                if (dt_Data.length > 0) 
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
                /*Set Header */ 
                //worksheet.getCell("B47").value = temp;
                var r_item = worksheet.getRow(1);
                r_item.getCell(1).value = dt_Data[0].BIZ_NM;//_COMP_NM;    

                r_item = worksheet.getRow(2);
                r_item.getCell(1).value =  dt_Data[0].BIZ_ADD;//_COMP_ADD; 
                r_item.getCell(6).value =  dt_Data[0].TITLE_VIE; 

                r_item = worksheet.getRow(3);
                r_item.getCell(3).value =  dt_Data[0].BIZ_TAX;//_COMP_TAX;   
                r_item.getCell(9).value =  dt_Data[0].VOUCHER_NO; 

                r_item = worksheet.getRow(4);
                r_item.getCell(1).value =   dt_Data[0].VOUCHER_NM;   
                r_item.getCell(10).value =  dt_Data[0].SEQ; 

                r_item = worksheet.getRow(5);   
                r_item.getCell(8).value = (item.P_PRINT_AMOUNT == "01")? dt_Data[0].DEBIT : (dt_Data[0].DEBIT+": "+dt_Data[0].AMT_DR); 

                r_item = worksheet.getRow(6); 
                r_item.getCell(8).value =  (item.P_PRINT_AMOUNT == "01")? dt_Data[0].CREDIT : (dt_Data[0].CREDIT+": "+dt_Data[0].AMT_CR); 

                r_item = worksheet.getRow(7); 
                r_item.getCell(1).value =  dt_Data[0].TR_DATE; 

                r_item = worksheet.getRow(9); 
                r_item.getCell(5).value =  dt_Data[0].PERSON; 

                r_item = worksheet.getRow(10); 
                r_item.getCell(4).value =  dt_Data[0].ADDR; 

                r_item = worksheet.getRow(11); 
                r_item.getCell(4).value =  dt_Data[0].BUSPARTNER_LNM; 

                r_item = worksheet.getRow(12); 
                r_item.getCell(4).value =  dt_Data[0].REMARK; 

                r_item = worksheet.getRow(13); 
                r_item.getCell(4).value =  dt_Data[0].REMARK2; 

                r_item = worksheet.getRow(14); 
                r_item.getCell(4).value  =  dt_Data[0].FMT_AMOUNT; 
                r_item.getCell(10).value =  dt_Data[0].TR_RATE; 

                r_item = worksheet.getRow(15); 
                r_item.getCell(4).value  = Utils.Num2VNText(dt_Data[0].AMOUNT, dt_Data[0].CCY);

                r_item = worksheet.getRow(16); 
                r_item.getCell(4).value  =  Utils.Num2EngText(dt_Data[0].AMOUNT, dt_Data[0].CCY);

                r_item = worksheet.getRow(17); 
                r_item.getCell(4).value  =  dt_Data[0].ENCLOSE;

                r_item = worksheet.getRow(19); 
                r_item.getCell(1).value  =  dt_Data[0].VAL1;
                r_item.getCell(3).value  =  dt_Data[0].VAL2;
                r_item.getCell(5).value  =  dt_Data[0].VAL3;
                r_item.getCell(6).value  =  dt_Data[0].VAL4;
                r_item.getCell(7).value  =  dt_Data[0].VAL5;
                r_item.getCell(9).value  =  dt_Data[0].DESCRIPTION;

                r_item = worksheet.getRow(20); 
                r_item.getCell(1).value  =  dt_Data[1].VAL1;
                r_item.getCell(3).value  =  dt_Data[1].VAL2;
                r_item.getCell(5).value  =  dt_Data[1].VAL3;
                r_item.getCell(6).value  =  dt_Data[1].VAL4;
                r_item.getCell(7).value  =  dt_Data[1].VAL5;
                r_item.getCell(9).value  =  dt_Data[1].DESCRIPTION;

                r_item = worksheet.getRow(21); 
                r_item.getCell(1).value  =  dt_Data[2].VAL1;
                r_item.getCell(3).value  =  dt_Data[2].VAL2;
                r_item.getCell(5).value  =  dt_Data[2].VAL3;
                r_item.getCell(6).value  =  dt_Data[2].VAL4;
                r_item.getCell(7).value  =  dt_Data[2].VAL5;
                r_item.getCell(9).value  =  dt_Data[2].DESCRIPTION;

                r_item = worksheet.getRow(25); 
                r_item.getCell(1).value  =  dt_Data[3].VAL1;
                r_item.getCell(3).value  =  dt_Data[3].VAL2;
                r_item.getCell(5).value  =  user.USER_NAME;
                r_item.getCell(6).value  =  dt_Data[3].VAL4;
                r_item.getCell(7).value  =  dt_Data[3].VAL5;
                r_item.getCell(9).value  =  dt_Data[3].DESCRIPTION;

                if(p_language == 'KOR') 
                {
                    worksheet.getCell("G1").value = "";  
                    worksheet.getCell("F2").value = ""; 								
                    worksheet.getCell("A3").value = "사업자번호";// Tax Code/MST:
                    worksheet.getCell("G3").value = "전표번호";//Voucher No/Số: 
                   // worksheet.getCell("A4").value = "입금전표";// RECEIPT CASH (IN)/THU TIỀN MẶT
                    worksheet.getCell("G5").value = "차변";// Nợ
                    worksheet.getCell("G6").value = "대변";// Có
                   // worksheet.getCell("A7").value = "매니저";// DATE/NGÀY
                    worksheet.getCell("A9").value = "지급처";//Payer Name/ Họ tên người nộp tiền
                    worksheet.getCell("A10").value = "주소";// Address/ Địa chỉ:
                    worksheet.getCell("A11").value = "거래처";// Object/ Đơn vị:
                    worksheet.getCell("A12").value = "사유";// Receive Reason/Lý do nộp:
                    worksheet.getCell("A14").value = "총금액";// Total Amt/ Số tiền:
                    worksheet.getCell("H14").value = "환율";// Rate/Tỷ giá:
                    worksheet.getCell("A15").value = "비고";// In Word/ Bằng chữ:
                    worksheet.getCell("A17").value = "넣다";//  Enclose/ Kèm theo:
// sign
                    worksheet.getCell("C19").value = "출납";//   
                    worksheet.getCell("E19").value = "작성자";//   
                    worksheet.getCell("F19").value = "지불인";//   
                    worksheet.getCell("G19").value = "회계담당자";//   
                    worksheet.getCell("I19").value = "회계부서";//   

                    worksheet.getCell("C20").value = "";//   
                    worksheet.getCell("E20").value = "";//   
                    worksheet.getCell("F20").value = "";//   
                    worksheet.getCell("G20").value = "";//   
                    worksheet.getCell("I20").value = "";//   

                    worksheet.getCell("C21").value = "";//   
                    worksheet.getCell("E21").value = "";//   
                    worksheet.getCell("F21").value = "";//   
                    worksheet.getCell("G21").value = "";//   
                    worksheet.getCell("I21").value = "";//   

                    worksheet.getCell("A26").value = "";//   
                    worksheet.getCell("A27").value = "";//  

                    worksheet.name = dt_Data[0].VOUCHER_NM;
                }

                /********* Print file excel ********/
                const reportFile    = Helpers.tmpPath(file_new);
                // await workbook.xlsx.writeFile(reportFile)
                await workbook.xlsx.writeFile(reportFile); 
                if( P_FILE_TYPE ==".xlsx")
                {  
                    return response.attachment( reportFile, file_nm+ P_FILE_TYPE );
                }

                if( P_FILE_TYPE ==".pdf")
                { 
                    const reportFilePdf =  await Utils.excelToPdf(reportFile);
                    return response.attachment( reportFilePdf, file_nm+ P_FILE_TYPE );
                }
                return response.attachment( reportFile, file_new);
            }
        } 
        catch (e) 
        {
            return response.send(Utils.response(false, e.message, null))
        }
    }  
    async rpt_6025050_RP({ request, response, auth }) {
        try 
        { 
          /*P_RPT_ID: report_info.VAL1, P_RPT_FILE: report_info.VAL2,
            P_COMPANY: this.sel_Company, P_DT_MONTH: this.dt_mmyy, P_VAT_TYPE: this.sel_VatType, P_TAX_RATE: this.sel_TaxRate, 
            P_CURRENT_CCY: this.sel_Ccy, P_STATUS: this.sel_Status, P_CUST_PK: this.txt_Customer_PK, P_INVOICE_NO: this.txt_InvoiceNo,
            P_AC_CD: this.txt_ACC_CD, P_SEQ: this.txt_Seq, P_VOUCHER_NO: this.sel_VoucherType, P_BALANCE: this.sel_Banlance,
            P_DT_FR: this.dt_from, P_DT_TO: this.dt_to, P_BIZ: this.sel_Bizpalce, P_SEQ_GRD : l_seq*/
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
            var P_FILE_TYPE     = item.P_FILE_TYPE?item.P_FILE_TYPE:'.xlsx';
            var _store          = "rpt_6025050_RP";
             /***************************** Return failded ****************************/
            if (!user) 
            { 
                return response.send(Utils.response(false, "Request failed!", null));
            } 
            /****************************** Begin call store and write excell *********/
            else 
            { 
                /********* Call store  ***************/ 
                let count_seq = item.P_SEQ_COUNT; 
                let l_seq = item.P_SEQ_GRD.split(',');
                let pos = 0;
                /********* Read file excel ********/ 
                const templateFile  = Helpers.resourcesPath(_resourcesPath); 
                await workbook.xlsx.readFile(templateFile);
                var worksheet       = workbook.getWorksheet(1);
                for(let l_count_seq = 0; l_count_seq < count_seq; l_count_seq++){
                    var _param   = [ item.P_COMPANY, l_seq[l_count_seq], item.P_CIRCULARS, item.P_BOOK_CCY];
                    var dt_Data  = await DBService.callProcCursor(_store, _param, p_language, p_crt_by); 
                    if (dt_Data.length > 0) 
                    {
                        dt_Data = dt_Data;
                    } 
                    else 
                    { 
                        return response.send(Utils.response(false, "no_data_found", null))
                    } 
                    worksheet.getColumn(1).width = 7;
                    worksheet.getColumn(2).width = 11.86;
                    worksheet.getColumn(3).width = 7;
                    worksheet.getColumn(4).width = 8.43;
                    worksheet.getColumn(5).width = 14.71;
                    worksheet.getColumn(6).width = 14.71;
                    worksheet.getColumn(7).width = 8;
                    worksheet.getColumn(8).width = 6.29;
                    worksheet.getColumn(9).width = 5;
                    worksheet.getColumn(10).width = 10;
                    /********* Write file excel ********/
                    /*Set Header */ 
                    //worksheet.getCell("B47").value = temp;
                    let pos_item = 0;
                    if(l_count_seq > 0){
                        pos = pos + 32;
                        var r_break_page = worksheet.getRow(pos);
                        r_break_page.addPageBreak();
                    }
                   
                    pos_item = pos + 1; 
                    var r_item = worksheet.getRow(pos_item);

                    r_item.getCell(7).value = "Form No/ Mẫu số:02-TT";
                    r_item.getCell(7).font = { bold:true, italic:false, name: 'Times New Roman', size:11};
                    r_item.getCell(7).alignment = {vertical: 'middle', horizontal: 'right', wrapText: true };
                    r_item.getCell(1).alignment = {vertical: 'middle', horizontal: 'left', wrapText: true };
                    worksheet.mergeCells(pos_item,7,pos_item,10);
                    worksheet.mergeCells(pos_item,1,pos_item,6);
                    r_item.getCell(1).value = dt_Data[0].BIZ_NM;//_COMP_NM; 

                    pos_item = pos + 2; 
                    r_item = worksheet.getRow(pos_item);
                    
                    r_item.height = 26.25; 
                    r_item.getCell(1).value =  dt_Data[0].BIZ_ADD;//_COMP_ADD; 
                    r_item.getCell(6).value =  dt_Data[0].TITLE_VIE; 
                    
                    worksheet.mergeCells(pos_item,6,pos_item,10);
                    worksheet.mergeCells(pos_item,1,pos_item,5);
                    r_item.getCell(1).font = { bold:false, italic:false, name: 'Times New Roman', size:10};
                    r_item.getCell(1).alignment = {vertical: 'middle', horizontal: 'left', wrapText: true };
                    r_item.getCell(6).font = { bold:false, italic:true, name: 'Times New Roman', size:10};
                    r_item.getCell(6).alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };

   
                    pos_item = pos + 3; 
                    r_item = worksheet.getRow(pos_item);
                    r_item.getCell(1).value = "Tax Code/MST:";
                    r_item.getCell(3).value =  dt_Data[0].BIZ_TAX;//_COMP_TAX;  
                    r_item.getCell(7).value = "Voucher No/ Số:"; 
                    r_item.getCell(7).font = { bold:false, italic:false, name: 'Times New Roman', size:10};
                    r_item.getCell(7).alignment = { vertical: 'middle', horizontal: 'right', wrapText: false };
                    r_item.getCell(9).value =  dt_Data[0].VOUCHER_NO; 
                    r_item.getCell(9).font = { bold:true, italic:false, name: 'Times New Roman', size:10};
                    r_item.getCell(9).alignment = { vertical: 'middle', horizontal: 'left', wrapText: false };
                    worksheet.mergeCells(pos_item,9,pos_item,10);
                    worksheet.mergeCells(pos_item,8,pos_item,7);

                       
                    pos_item = pos + 4; 
                    r_item = worksheet.getRow(pos_item);
                    r_item.getCell(1).value =  dt_Data[0].VOUCHER_NM;  
                    worksheet.mergeCells(pos_item,1,pos_item+2,6);  
                    r_item.getCell(1).font = { bold:true, italic:false, name: 'Times New Roman', size:16};
                    r_item.getCell(1).alignment = {vertical: 'middle', horizontal: 'center', wrapText: true }; 
                    r_item.getCell(9).value = "Seq:"; 
                    r_item.getCell(10).value =  dt_Data[0].SEQ; 
                    
   
                    pos_item = pos + 5; 
                    r_item = worksheet.getRow(pos_item);   
                    r_item.getCell(7).value = "Nợ:"; 
                    r_item.getCell(7).alignment = { vertical: 'middle', horizontal: 'right', wrapText: false };
                    r_item.getCell(8).value = (item.P_PRINT_AMOUNT == "01")? dt_Data[0].DEBIT : (dt_Data[0].DEBIT+": "+dt_Data[0].AMT_DR); 
                    let h_cnt_acc = 0.0;
                    let  l_cnt_acc = dt_Data[0].DEBIT.split(',');
                    for(let l_cnt = 0; l_cnt < l_cnt_acc.length; l_cnt++)
                    {
                        h_cnt_acc = h_cnt_acc + 15.0;
                    }
                    r_item.height = h_cnt_acc;
                    r_item.getCell(8).font = { bold:false, italic:false, name: 'Times New Roman', size:11};
                    r_item.getCell(8).alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
                    worksheet.mergeCells(pos_item,8,pos_item,10);  

                    pos_item = pos + 6; 
                    r_item = worksheet.getRow(pos_item);
                    r_item.getCell(7).value = "Có:"; 
                    r_item.getCell(7).alignment = { vertical: 'middle', horizontal: 'right', wrapText: false };
                    r_item.getCell(8).value =  (item.P_PRINT_AMOUNT == "01")? dt_Data[0].CREDIT : (dt_Data[0].CREDIT+": "+dt_Data[0].AMT_CR); 
                    h_cnt_acc = 0.0;
                    l_cnt_acc = dt_Data[0].CREDIT.split(',');
                    for(let l_cnt = 0; l_cnt < l_cnt_acc.length; l_cnt++)
                    {
                        h_cnt_acc = h_cnt_acc + 15.0;
                    }
                    r_item.height = h_cnt_acc;
                    r_item.getCell(8).font = { bold:false, italic:false, name: 'Times New Roman', size:11};
                    r_item.getCell(8).alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
                    worksheet.mergeCells(pos_item,8,pos_item,10);  
   
                    pos_item = pos + 7; 
                    r_item = worksheet.getRow(pos_item); 
                    r_item.height = 14.25; 
                    r_item.getCell(1).value =  dt_Data[0].TR_DATE;  
                    r_item.getCell(1).alignment = {vertical: 'middle', horizontal: 'center', wrapText: false }; 
                    worksheet.mergeCells(pos_item,1,pos_item,6);  
                    
                    pos_item = pos + 8; 
                    r_item = worksheet.getRow(pos_item); 
                    r_item.height = 0.5; 

                    pos_item = pos + 9; 
                    r_item = worksheet.getRow(pos_item); 
                    r_item.getCell(1).value = "Payer Name/ Họ tên người nộp tiền"; 
                    worksheet.mergeCells(pos_item,5,pos_item,10);  
                    worksheet.mergeCells(pos_item,1,pos_item,4);  
                    r_item.getCell(5).value =  dt_Data[0].PERSON; 
   
                    pos_item = pos + 10; 
                    r_item = worksheet.getRow(pos_item); 
                    r_item.getCell(1).value = "Address/ Địa chỉ:"; 
                    worksheet.mergeCells(pos_item,4,pos_item,10);  
                    worksheet.mergeCells(pos_item,1,pos_item,3);  
                    r_item.height = 52.0; 
                    r_item.getCell(4).value =  dt_Data[0].ADDR; 
                    r_item.getCell(4).font = { bold:true, italic:false, name: 'Times New Roman', size:10};
                    r_item.getCell(4).alignment = {vertical: 'middle', horizontal: 'left', wrapText: true };
   
                    pos_item = pos + 11; 
                    r_item = worksheet.getRow(pos_item); 
                    r_item.getCell(1).value = "Object/ Đơn vị:"; 
                    worksheet.mergeCells(pos_item,4,pos_item,10);  
                    worksheet.mergeCells(pos_item,1,pos_item,3);  
                    r_item.height = 30.0; 
                    r_item.getCell(4).value =  dt_Data[0].BUSPARTNER_LNM; 
                    r_item.getCell(4).font = { bold:true, italic:false, name: 'Times New Roman', size:10};
                    r_item.getCell(4).alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };

                    pos_item = pos + 12; 
                    r_item = worksheet.getRow(pos_item); 
                    r_item.getCell(1).value = "Receive Reason/Lý do nộp:"; 
                    worksheet.mergeCells(pos_item,4,pos_item,10);  
                    worksheet.mergeCells(pos_item,1,pos_item,3);  
                    r_item.getCell(4).value =  dt_Data[0].REMARK; 

                    pos_item = pos + 13; 
                    r_item = worksheet.getRow(pos_item); 
                    r_item.getCell(4).value =  dt_Data[0].REMARK2; 

                    pos_item = pos + 14; 
                    r_item = worksheet.getRow(pos_item); 
                    r_item.getCell(1).value = "Total Amt/ Số tiền:"; 
                    worksheet.mergeCells(pos_item,4,pos_item,7);  
                    worksheet.mergeCells(pos_item,1,pos_item,3);  
                    r_item.getCell(4).value  =  dt_Data[0].FMT_AMOUNT; 
                    r_item.getCell(4).font   = { bold:true, italic:false, name: 'Times New Roman', size:11};
                    r_item.getCell(4).alignment = { vertical: 'middle', horizontal: 'center', wrapText: false };
                    r_item.getCell(8).value = "Rate/Tỷ giá:"; 
                    r_item.getCell(10).value =  dt_Data[0].TR_RATE; 
                    r_item.getCell(10).alignment = { vertical: 'middle', horizontal: 'left', wrapText: false };

                    pos_item = pos + 15; 
                    r_item = worksheet.getRow(pos_item); 
                    r_item.height = 30.0; 
                    r_item.getCell(1).value = "In Word/ Bằng chữ:"; 
                    r_item.getCell(4).value  = Utils.Num2VNText(dt_Data[0].AMOUNT, dt_Data[0].CCY);
                    r_item.getCell(4).font = { bold:true, italic:false, name: 'Times New Roman', size:10};
                    r_item.getCell(1).alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
                    r_item.getCell(4).alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
                    worksheet.mergeCells(pos_item,4,pos_item,10);  
                    worksheet.mergeCells(pos_item,1,pos_item+1,3);  

                    pos_item = pos + 16; 
                    r_item = worksheet.getRow(pos_item); 
                    r_item.height = 30.0; 
                    r_item.getCell(4).value  =  Utils.Num2EngText(dt_Data[0].AMOUNT, dt_Data[0].CCY);
                    r_item.getCell(4).font = { bold:true, italic:false, name: 'Times New Roman', size:11};
                    r_item.getCell(4).alignment = {vertical: 'middle', horizontal: 'left', wrapText: true };
                    worksheet.mergeCells(pos_item,4,pos_item,10);  

                    pos_item = pos + 17; 
                    r_item = worksheet.getRow(pos_item); 
                    r_item.getCell(1).value = "Enclose/ Kèm theo:"; 
                    r_item.getCell(4).value  =  dt_Data[0].ENCLOSE;

                    pos_item = pos + 19; 
                    r_item = worksheet.getRow(pos_item); 
                    r_item.getCell(1).value  =  dt_Data[0].VAL1;
                    r_item.getCell(3).value  =  dt_Data[0].VAL2;
                    r_item.getCell(5).value  =  dt_Data[0].VAL3;
                    r_item.getCell(6).value  =  dt_Data[0].VAL4;
                    r_item.getCell(7).value  =  dt_Data[0].VAL5;
                    r_item.getCell(9).value  =  dt_Data[0].DESCRIPTION;
                    
                    worksheet.mergeCells(pos_item,9,pos_item,10);  
                    worksheet.mergeCells(pos_item,7,pos_item,8);  
                    worksheet.mergeCells(pos_item,3,pos_item,4);  
                    worksheet.mergeCells(pos_item,1,pos_item,2);  
                    
                    r_item.getCell(1).alignment = { vertical: 'middle', horizontal: 'center', wrapText: false };
                    r_item.getCell(3).alignment = { vertical: 'middle', horizontal: 'center', wrapText: false };
                    r_item.getCell(5).alignment = { vertical: 'middle', horizontal: 'center', wrapText: false };
                    r_item.getCell(6).alignment = { vertical: 'middle', horizontal: 'center', wrapText: false };
                    r_item.getCell(7).alignment = { vertical: 'middle', horizontal: 'center', wrapText: false };
                    r_item.getCell(9).alignment = { vertical: 'middle', horizontal: 'center', wrapText: false };
                    
                    r_item.getCell(1).font = { bold:true, italic:false, name: 'Times New Roman', size:10};
                    r_item.getCell(3).font = { bold:true, italic:false, name: 'Times New Roman', size:10};
                    r_item.getCell(5).font = { bold:true, italic:false, name: 'Times New Roman', size:10};
                    r_item.getCell(6).font = { bold:true, italic:false, name: 'Times New Roman', size:10};
                    r_item.getCell(7).font = { bold:true, italic:false, name: 'Times New Roman', size:10};
                    r_item.getCell(9).font = { bold:true, italic:false, name: 'Times New Roman', size:10};

                    pos_item = pos + 20; 
                    r_item = worksheet.getRow(pos_item); 
                    r_item.getCell(1).value  =  dt_Data[1].VAL1;
                    r_item.getCell(3).value  =  dt_Data[1].VAL2;
                    r_item.getCell(5).value  =  dt_Data[1].VAL3;
                    r_item.getCell(6).value  =  dt_Data[1].VAL4;
                    r_item.getCell(7).value  =  dt_Data[1].VAL5;
                    r_item.getCell(9).value  =  dt_Data[1].DESCRIPTION;
                    worksheet.mergeCells(pos_item,9,pos_item,10);  
                    worksheet.mergeCells(pos_item,7,pos_item,8);  
                    worksheet.mergeCells(pos_item,3,pos_item,4);  
                    worksheet.mergeCells(pos_item,1,pos_item,2); 
                    r_item.getCell(1).alignment = { vertical: 'middle', horizontal: 'center', wrapText: false };
                    r_item.getCell(3).alignment = { vertical: 'middle', horizontal: 'center', wrapText: false };
                    r_item.getCell(5).alignment = { vertical: 'middle', horizontal: 'center', wrapText: false };
                    r_item.getCell(6).alignment = { vertical: 'middle', horizontal: 'center', wrapText: false };
                    r_item.getCell(7).alignment = { vertical: 'middle', horizontal: 'center', wrapText: false };
                    r_item.getCell(9).alignment = { vertical: 'middle', horizontal: 'center', wrapText: false }; 
                    r_item.getCell(1).font = { bold:true, italic:false, name: 'Times New Roman', size:10};
                    r_item.getCell(3).font = { bold:true, italic:false, name: 'Times New Roman', size:10};
                    r_item.getCell(5).font = { bold:true, italic:false, name: 'Times New Roman', size:10};
                    r_item.getCell(6).font = { bold:true, italic:false, name: 'Times New Roman', size:10};
                    r_item.getCell(7).font = { bold:true, italic:false, name: 'Times New Roman', size:10};
                    r_item.getCell(9).font = { bold:true, italic:false, name: 'Times New Roman', size:10};

                    pos_item = pos + 21; 
                    r_item = worksheet.getRow(pos_item); 
                    r_item.getCell(1).value  =  dt_Data[2].VAL1;
                    r_item.getCell(3).value  =  dt_Data[2].VAL2;
                    r_item.getCell(5).value  =  dt_Data[2].VAL3;
                    r_item.getCell(6).value  =  dt_Data[2].VAL4;
                    r_item.getCell(7).value  =  dt_Data[2].VAL5;
                    r_item.getCell(9).value  =  dt_Data[2].DESCRIPTION;
                    r_item.getCell(1).alignment = { vertical: 'middle', horizontal: 'center', wrapText: false };
                    r_item.getCell(3).alignment = { vertical: 'middle', horizontal: 'center', wrapText: false };
                    r_item.getCell(5).alignment = { vertical: 'middle', horizontal: 'center', wrapText: false };
                    r_item.getCell(6).alignment = { vertical: 'middle', horizontal: 'center', wrapText: false };
                    r_item.getCell(7).alignment = { vertical: 'middle', horizontal: 'center', wrapText: false };
                    r_item.getCell(9).alignment = { vertical: 'middle', horizontal: 'center', wrapText: false };

                    r_item.getCell(1).font = { bold:false, italic:true, name: 'Times New Roman', size:8};
                    r_item.getCell(3).font = { bold:false, italic:true, name: 'Times New Roman', size:8};
                    r_item.getCell(5).font = { bold:false, italic:true, name: 'Times New Roman', size:8};
                    r_item.getCell(6).font = { bold:false, italic:true, name: 'Times New Roman', size:8};
                    r_item.getCell(7).font = { bold:false, italic:true, name: 'Times New Roman', size:8};
                    r_item.getCell(9).font = { bold:false, italic:true, name: 'Times New Roman', size:8};
                    worksheet.mergeCells(pos_item,9,pos_item,10);  
                    worksheet.mergeCells(pos_item,7,pos_item,8);  
                    worksheet.mergeCells(pos_item,3,pos_item,4);  
                    worksheet.mergeCells(pos_item,1,pos_item,2); 

                    pos_item = pos + 22; 
                    r_item = worksheet.getRow(pos_item); 
                    
                    worksheet.mergeCells(pos_item,9,pos_item+2,10);  
                    worksheet.mergeCells(pos_item,7,pos_item+2,8);     
                    worksheet.mergeCells(pos_item,6,pos_item+2,6);  
                    worksheet.mergeCells(pos_item,5,pos_item+2,5);
                    worksheet.mergeCells(pos_item,3,pos_item+2,4);  
                    worksheet.mergeCells(pos_item,1,pos_item+2,2);  

                    r_item.height = 12.0;
                    pos_item = pos + 23; 
                    r_item = worksheet.getRow(pos_item); 
                    r_item.height = 19.5;

                    pos_item = pos + 24; 
                    r_item = worksheet.getRow(pos_item); 
                    r_item.height = 9.75;

                    pos_item = pos + 25; 
                    r_item = worksheet.getRow(pos_item); 
                    r_item.getCell(1).value  =  dt_Data[3].VAL1;
                    r_item.getCell(3).value  =  dt_Data[3].VAL2;
                    r_item.getCell(5).value  =  user.USER_NAME;
                    r_item.getCell(6).value  =  dt_Data[3].VAL4;
                    r_item.getCell(7).value  =  dt_Data[3].VAL5;
                    r_item.getCell(9).value  =  dt_Data[3].DESCRIPTION;

                    r_item.getCell(1).alignment = { vertical: 'middle', horizontal: 'center', wrapText: false, shrinkToFit: true };
                    r_item.getCell(3).alignment = { vertical: 'middle', horizontal: 'center', wrapText: false, shrinkToFit: true };
                    r_item.getCell(5).alignment = { vertical: 'middle', horizontal: 'center', wrapText: false, shrinkToFit: true };
                    r_item.getCell(6).alignment = { vertical: 'middle', horizontal: 'center', wrapText: false, shrinkToFit: true };
                    r_item.getCell(7).alignment = { vertical: 'middle', horizontal: 'center', wrapText: false, shrinkToFit: true };
                    r_item.getCell(9).alignment = { vertical: 'middle', horizontal: 'center', wrapText: false, shrinkToFit: true };

                    r_item.getCell(1).font = { bold:true, italic:false, name: 'Times New Roman', size:10};
                    r_item.getCell(3).font = { bold:true, italic:false, name: 'Times New Roman', size:10};
                    r_item.getCell(5).font = { bold:true, italic:false, name: 'Times New Roman', size:10};
                    r_item.getCell(7).font = { bold:true, italic:false, name: 'Times New Roman', size:10};
                    r_item.getCell(9).font = { bold:true, italic:false, name: 'Times New Roman', size:10};

                    pos_item = pos + 26; 
                    r_item = worksheet.getRow(pos_item);     
                    r_item.getCell(1).value = "Payment Received (In Word)/Đã nhận đủ số tiền ( bằng chữ ):..................................................................."; 

                    pos_item = pos + 27; 
                    r_item = worksheet.getRow(pos_item);     
                    r_item.getCell(1).value = " + Số tiền quy đổi: .........................................................................................................."; 

                    if(p_language == 'KOR') 
                    {
                        worksheet.getCell("G1").value = "";  
                        worksheet.getCell("F2").value = ""; 								
                        worksheet.getCell("A3").value = "사업자번호";// Tax Code/MST:
                        worksheet.getCell("G3").value = "전표번호";//Voucher No/Số: 
                    // worksheet.getCell("A4").value = "입금전표";// RECEIPT CASH (IN)/THU TIỀN MẶT
                        worksheet.getCell("G5").value = "차변";// Nợ
                        worksheet.getCell("G6").value = "대변";// Có
                    // worksheet.getCell("A7").value = "매니저";// DATE/NGÀY
                        worksheet.getCell("A9").value = "지급처";//Payer Name/ Họ tên người nộp tiền
                        worksheet.getCell("A10").value = "주소";// Address/ Địa chỉ:
                        worksheet.getCell("A11").value = "거래처";// Object/ Đơn vị:
                        worksheet.getCell("A12").value = "사유";// Receive Reason/Lý do nộp:
                        worksheet.getCell("A14").value = "총금액";// Total Amt/ Số tiền:
                        worksheet.getCell("H14").value = "환율";// Rate/Tỷ giá:
                        worksheet.getCell("A15").value = "비고";// In Word/ Bằng chữ:
                        worksheet.getCell("A17").value = "넣다";//  Enclose/ Kèm theo:
                    // sign
                        worksheet.getCell("C19").value = "출납";//   
                        worksheet.getCell("E19").value = "작성자";//   
                        worksheet.getCell("F19").value = "지불인";//   
                        worksheet.getCell("G19").value = "회계담당자";//   
                        worksheet.getCell("I19").value = "회계부서";//   

                        worksheet.getCell("C20").value = "";//   
                        worksheet.getCell("E20").value = "";//   
                        worksheet.getCell("F20").value = "";//   
                        worksheet.getCell("G20").value = "";//   
                        worksheet.getCell("I20").value = "";//   

                        worksheet.getCell("C21").value = "";//   
                        worksheet.getCell("E21").value = "";//   
                        worksheet.getCell("F21").value = "";//   
                        worksheet.getCell("G21").value = "";//   
                        worksheet.getCell("I21").value = "";//   

                        worksheet.getCell("A26").value = "";//   
                        worksheet.getCell("A27").value = "";//  

                        worksheet.name = dt_Data[0].VOUCHER_NM;
                    }
                }

                /********* Print file excel ********/
                const reportFile    = Helpers.tmpPath(file_new);
                // await workbook.xlsx.writeFile(reportFile)
                await workbook.xlsx.writeFile(reportFile); 
                if( P_FILE_TYPE ==".xlsx")
                {  
                    return response.attachment( reportFile, file_nm+ P_FILE_TYPE );
                }

                if( P_FILE_TYPE ==".pdf")
                { 
                    const reportFilePdf =  await Utils.excelToPdf(reportFile);
                    return response.attachment( reportFilePdf, file_nm+ P_FILE_TYPE );
                }
                return response.attachment( reportFile, file_new);
            }
        } 
        catch (e) 
        {
            return response.send(Utils.response(false, e.message, null))
        }
    } 
}

module.exports = rpt6025050;