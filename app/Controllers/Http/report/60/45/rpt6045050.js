"use strict";

const { DATE } = require("oracledb");

const Helpers       = use('Helpers')
const Antl          = use("Antl");
const Utils         = use("Utils");
const DBService = use("DBService")
var Excel           = use('exceljs');
var workbook        = new Excel.Workbook();
class rpt6045050 {
    /*########################################################## Report Bank statement books partner###########################################################################*/ 
    async rpt_6045050_CASH_STATEMENT_BOOKS_PARTNER_SHEET ({ request, response, auth }) {
        try 
        { 
           /* P_RPT_ID: report_info.VAL1, P_RPT_URL: report_info.VAL2, P_RPT_FILE: report_info.VAL3,
                P_COMP_ID: company_info.PARTNER_ID, P_COMP_NM: company_info.TEXT, P_COMP_TAX: company_info.TAX_CODE, P_COMP_ADD: company_info.ADDR1,
                P_COMPANY: this.selectedCompany,P_ACC_PK: this.TAC_ABACCTCODE_PK, P_FR_DATE: this.from_date, P_FR_TO: this.to_date, 
                P_CCY: this.selectedCurrency, P_STATUS: this.selectedStatus, P_BOOK_CCY: this.txtBookCCY, P_CIRCULARS: this.selectedCircular, 
                P_PRINT_VOUCHER_NO : this.selectedPrintVoucherNo, P_LANG : this.selectedLanguage, P_BANK: this.selectedBank, P_BANK_CCY : this.bank_CCY
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
            var _store_bank     = "AC_6045050_BANK_LIST";
            var _store_dt       = "AC_RPT_6045035_ACC_OPENING_BPL";
            var _store          = "AC_RPT_6045050_BANK_CUST_BPL";
            var _circular       = "AC_SEL_GET_TT_BPL";
            var _param_bank     = [item.P_COMPANY, item.P_ACC_PK, item.P_TCO_BUSPLACE_PK];
            var _param_TT       = [item.P_CIRCULARS, item.P_TCO_BUSPLACE_PK];
            var v_no_title = "Mẫu số : S08-DN ", e_no_title = "Form No : S08-DN" , k_no_title = "양식번호 : S08-DN";
            var v_dvt = " Đơn vị tính", e_dvt = " Unit", k_dvt = " 단위";
            /***************************** Return failded ****************************/
            if (!user) 
            {
                return response.send(Utils.response(false, "Request failed!", null));
            } 
            /****************************** Begin call store and write excell *********/
            else 
            { 
                 /****************Call CIRCULARS******************/
                var dt_TT  = await DBService.callProcCursor(_circular, _param_TT , p_language , p_crt_by); 
                if (dt_TT.length>0) 
                {
                    dt_TT = dt_TT;
                } 
                else 
                {
                    //dt_TT = dt_TT;
                    return response.send(Utils.response(false, "no_data_found", null))
                } 
                /********* Call  dictionary ***************/ 
                
                var _dictionary     = await DBService.callProcCursor("GET_DICTIONARY_REPORT", null, p_language, p_crt_by); 
                if (_dictionary.length>0) 
                {
                    _dictionary = _dictionary;
                } 
                else 
                { 
                    _dictionary = [];
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
                /********* Read file excel ********/ 
                const templateFile  = Helpers.resourcesPath(_resourcesPath); 
                await workbook.xlsx.readFile(templateFile);
                var worksheet_1       = workbook.getWorksheet(1);
                /********* Write file excel ********/
                 /********* Call partner store  ***************/ 
            var dt_Bank  = await DBService.callProcCursor(_store_bank, _param_bank , p_language , p_crt_by); 
            var bank_pk     = ""; 
            var bank_id     = "";
            var acc_no      = "";
            var cust_pk     = "";
            var l_ccy       = "";
            var _acc_pk     = "";

            var p_open_trans    = 0;
            var p_debit_trans   = 0;
            var p_credit_trans  = 0;
            var p_bal_trans     = 0;

            var p_open_books    = 0;
            var p_debit_books   = 0;
            var p_credit_books  = 0;
            var p_bal_books     = 0;


            if (dt_Bank.length>0) 
            {
               for (var l_bank = 0; l_bank < dt_Bank.length; l_bank++) 
                {
                    dt_Bank     = dt_Bank;
                    bank_pk     = dt_Bank[l_bank].PK;
                    bank_id     = dt_Bank[l_bank].BANK_ID;
                    acc_no      = dt_Bank[l_bank].ACCOUNT_NO;
                    cust_pk     = dt_Bank[l_bank].TCO_BUSPARTNER_PK;
                    l_ccy       = dt_Bank[l_bank].CCY;
                    _acc_pk     = dt_Bank[l_bank].TAC_ABACCTCODE_PK
                    
                    //var row_item = worksheet.getRow(pos); 
                    var _param_dt    = [item.P_COMPANY, item.P_FR_DATE, item.P_FR_TO, _acc_pk, item.P_STATUS, bank_pk, item.P_TCO_BUSPLACE_PK];
                    var dt_DT  = await DBService.callProcCursor(_store_dt, _param_dt , p_language , p_crt_by); 

                    if (dt_DT.length>0) 
                    {
                        dt_DT = dt_DT;
                        p_open_trans    = dt_DT[0].OPEN_TRANS;
                        p_debit_trans   = dt_DT[0].DEBIT_TRANS_AMT;
                        p_credit_trans  = dt_DT[0].CREDIT_TRANS_AMT;
                        p_bal_trans     = dt_DT[0].BAL_TRANS_AMT;
                        p_open_books    = dt_DT[0].OPEN_BOOKS;
                        p_debit_books   = dt_DT[0].DEBIT_BOOK_AMT;
                        p_credit_books  = dt_DT[0].CREDIT_BOOK_AMT;
                        p_bal_books     = dt_DT[0].BAL_BOOK_AMT;

                    } 
                    var _param    = [item.P_COMPANY, item.P_FR_DATE, item.P_FR_TO, _acc_pk ,item.P_STATUS, p_open_trans, p_open_books, bank_pk, bank_id, cust_pk, item.P_TCO_BUSPLACE_PK ];
                    var dt_Data  = await DBService.callProcCursor(_store, _param , p_language , p_crt_by); 

                    if(dt_DT.length>0 || p_open_trans != 0 || p_open_books != 0)
                    {
                        let worksheet       = workbook.addWorksheet(); 
                        worksheet.model = worksheet_1.model;
                        
                        worksheet.name = acc_no; 
                      
                        //Merge
                        worksheet.mergeCells(4,1,4,13);// Title
                        worksheet.mergeCells(5,1,5,13); //from - to date
                        worksheet.mergeCells(9,1,10,1); //date
                        worksheet.mergeCells(9,2,9,3); //voucher
                        //worksheet.mergeCells(9,4,10,4); //local description
                        //worksheet.mergeCells(9,5,10,5); // description
                        worksheet.mergeCells(9,6,10,6); // description
                        worksheet.mergeCells(9,7,9,9); //Amount USD
                        worksheet.mergeCells(9,10,9,12); //Amount VND

                        worksheet.mergeCells(9,15,9,16); // Customer
                        worksheet.mergeCells(9,17,10,17); //Beneficiaty acc code
                        worksheet.mergeCells(9,18,10,18); //Beneficiaty name
                        worksheet.mergeCells(9,19,10,19); //Beneficiaty bank
                        
                        //INFOMATION COMPANY
                        worksheet.getCell("A1").value = Utils.translate("COMPANY",_dictionary , p_language) +": "+BIZ_NM;
                        worksheet.getCell("A2").value = Utils.translate("ADDRESS",_dictionary , p_language) +": "+BIZ_ADD;
                        worksheet.getCell("A3").value = Utils.translate("TAX_CODE",_dictionary, p_language) + ": "+ BIZ_TAX;  

                        var _bookccy = item.P_BOOK_CCY;
                        worksheet.getCell("J9").value = _bookccy;
                        var FromDate = item.P_FR_DATE;
                        var ToDate = item.P_FR_TO;
                        var strFrDate = FromDate.substr(6,2) + "/"+ FromDate.substr(4,2)+ "/"+ FromDate.substr(0,4);
                        var strToDate = ToDate.substr(6,2) + "/"+ ToDate.substr(4,2)+ "/"+ ToDate.substr(0,4);

                        //thÃ´ng tÆ°
                        var _lang = item.P_LANG;
                        if(_lang == 'VIE'){
                            worksheet.getCell("K1").value =  v_no_title ;
                            worksheet.getCell("K2").value =  dt_TT[0].V1 ;
                            worksheet.getCell("K3").value =  dt_TT[0].V2 ;
                            worksheet.getCell("A4").value = "SỔ TIỀN GỬI NGÂN HÀNG";
                            worksheet.getCell("A5").value = "Từ ngày " + strFrDate + " đến ngày " + strToDate;
                            worksheet.getCell("A6").value = "Nơi mở tài khoản giao dịch: "+ bank_id;
                            worksheet.getCell("E6").value = "Số hiệu tài khoản tại nơi gửi: " + acc_no;
                            worksheet.getCell("L7").value = v_dvt;
                            //grid
                            // worksheet.mergeCells('A9', 'A10'); 
                            //worksheet.getCell("A9").value = "";
                            //worksheet.mergeCells('C9', 'D9'); 
                            worksheet.getCell("B9").value = "Chứng từ";
                            worksheet.getCell("B10").value = "Số hiệu";
                            worksheet.getCell("C10").value = "Ngày tháng";
                            worksheet.getCell("D9").value = "Diễn giải";
                            worksheet.getCell("E9").value = "Description";
                            //worksheet.mergeCells('G9', 'I9'); 
                            worksheet.getCell("F9").value = "Tài khoản đối ứng";
                            worksheet.getCell("G9").value = "Số phát sinh(USD)";
                            worksheet.getCell("G10").value = "Thu (gửi vào)";
                            worksheet.getCell("H10").value = "Chi (rút ra)";
                            worksheet.getCell("I10").value = "Còn lại";
                            worksheet.getCell("J9").value = "Số phát sinh(Tiền ghi sổ VND)";
                            worksheet.getCell("J10").value = "Thu (gửi vào)";
                            worksheet.getCell("K10").value = "Chi (rút ra)";
                            worksheet.getCell("L10").value = "Còn lại";
                            worksheet.getCell("M9").value = "Ghi chú";
        
                            /*worksheet.getCell("O9").value = "Customer";
                            worksheet.getCell("Q9").value = "Beneficiary Account No";
                            worksheet.getCell("R9").value = "Beneficiary name";
                            worksheet.getCell("S9").value = "Beneficiary bank";*/
        
                        }
                        else if(_lang == 'KOR'){
                            worksheet.getCell("K1").value =  k_no_title ;
                            worksheet.getCell("K2").value =  dt_TT[0].E1 ;
                            worksheet.getCell("K3").value =  dt_TT[0].E2 ;
                            worksheet.getCell("A4").value = "예금 보조부원장";
                            worksheet.getCell("A5").value = "일자 " + strFrDate + " ~ " + strToDate;
                            worksheet.getCell("A6").value = "은행명 : "+ bank_id;
                            worksheet.getCell("E6").value = "Bank account no : " + acc_no;
                            worksheet.getCell("L7").value = k_dvt;

                            worksheet.getCell("L7").value = "통화: ";
                            worksheet.getCell("O9").value   = "거래처";
                            worksheet.getCell("B9").value   = "전표";
                            worksheet.getCell("B10").value  = "번호";
                            worksheet.getCell("C10").value  = "일자";
                            worksheet.getCell("D9").value   = "적요";
                            worksheet.getCell("E9").value   = "적요2";
                            //worksheet.mergeCells('G9', 'I9'); 
                            worksheet.getCell("F9").value = "계정";
                            worksheet.getCell("G9").value = "금액";
                            worksheet.getCell("G10").value = "예금";
                            worksheet.getCell("H10").value = "차감";
                            worksheet.getCell("I10").value = "잔액";
                            worksheet.getCell("J9").value = "금액";
                            worksheet.getCell("J10").value = "예금";
                            worksheet.getCell("K10").value = "차감";
                            worksheet.getCell("L10").value = "잔액";
                            worksheet.getCell("M9").value = "고객사";
        
                        }
                        else{
                            worksheet.getCell("K2").value =  dt_TT[0].E1 ;
                            worksheet.getCell("K3").value =  dt_TT[0].E2 ;
                            worksheet.getCell("A5").value = "From date " + strFrDate + " To date " + strToDate;
                            worksheet.getCell("A6").value = "Bank name : "+ bank_id;
                            worksheet.getCell("E6").value = "Bank account no : " + acc_no;
                        }
                        var _print = item.P_PRINT_VOUCHER_NO;
                        if(_print == '2'){
                            if(_lang == 'VIE')
                            {
                                worksheet.getCell("A9").value ="Ngày tháng ghi sổ";
                                worksheet.getCell("D12").value = "SỐ TỒN ĐẦU KỲ";
                                worksheet.getCell("D14").value = "Cộng phát sinh trong kỳ";
                                worksheet.getCell("D15").value = "SỐ TỒN CUỐI KỲ";
                            }
                            else if(_lang == 'KOR'){
                                worksheet.getCell("A9").value ="일자";
                            }
                            else{
                                worksheet.getCell("A9").value ="Date";
                                //worksheet.getCell("A9").value ="Approve No" ;
                            }
                        }
                        else{
                            //worksheet.getCell("A9").value ="Approve No" ;
                            worksheet.getCell("A9").value ="Date";
                        }
                        //-------Fill Data----------------
                        worksheet.getCell("I12").value = Number(p_open_trans);
                        worksheet.getCell("G14").value = Number(p_debit_trans);
                        worksheet.getCell("H14").value = Number(p_credit_trans);
                        worksheet.getCell("I15").value = Number(p_bal_trans);

                        worksheet.getCell("L12").value = Number(p_open_books);
                        worksheet.getCell("J14").value = Number(p_debit_books);
                        worksheet.getCell("K14").value = Number(p_credit_books);
                        worksheet.getCell("L15").value = Number(p_bal_books);
                        var pos = 13; 
                        if(dt_Data.length>1)
                        {
                             worksheet.duplicateRow(pos,dt_Data.length-1,true);
                        }  
                        for (var y = 0; y < dt_Data.length; y++) 
                        {
                            var row_item = worksheet.getRow(pos);
                            row_item.getCell(1).value   = dt_Data[y].TRANS_DATE;
                            row_item.getCell(2).value   = dt_Data[y].VOUCHERNO;
                            row_item.getCell(3).value   = dt_Data[y].TRANS_DATE;     
                            row_item.getCell(4).value   = dt_Data[y].REMARK;
                            row_item.getCell(5).value   = dt_Data[y].REMARK2; 
                            row_item.getCell(6).value   = dt_Data[y].ACCT_CODE; 
                            row_item.getCell(7).value   = dt_Data[y].IN_AMT; 
                            row_item.getCell(8).value   = dt_Data[y].OUT_AMT; 
                            row_item.getCell(9).value   = dt_Data[y].BAL_AMT;
                            row_item.getCell(10).value  = dt_Data[y].IN_BAMT; 
                            row_item.getCell(11).value  = dt_Data[y].OUT_BAMT; 
                            row_item.getCell(12).value  = dt_Data[y].BAL_BAMT;
                            row_item.getCell(13).value  = dt_Data[y].PK; 
                            row_item.getCell(14).value  = dt_Data[y].TR_ENCLOSE;  
                            row_item.getCell(15).value  = dt_Data[y].PARTNER_ID;  
                            row_item.getCell(16).value  = dt_Data[y].PARTNER_NAME; 
                            row_item.getCell(17).value  = dt_Data[y].BEN_ACCOUNTNO; 
                            row_item.getCell(18).value  = dt_Data[y].BEN_NAME; 
                            row_item.getCell(19).value  = dt_Data[y].BEN_BANK; 
                            pos = pos + 1; 
                            //row_item.commit();
                        } 
                        var l_bank_ccy = l_ccy;
                        switch(l_bank_ccy){
                            case "VND":
                                worksheet.getColumn(7).hidden = true;
                                worksheet.getColumn(8).hidden = true;
                                worksheet.getColumn(9).hidden = true;
                            break;
                        }
                        /************sign*/
                        worksheet.mergeCells(pos+7,1,pos+7,2); 
                        worksheet.mergeCells(pos+8,1,pos+8,2);   
                        worksheet.mergeCells(pos+7,6,pos+7,8); 
                        worksheet.mergeCells(pos+8,6,pos+8,8); 
                        if(_lang === "VIE")
                        {
                            worksheet.getCell(pos+4, 1).value = "Sổ có…. Trang , đánh số từ  trang 01 đến  trang……";
                            worksheet.getCell(pos+5, 1).value = "Ngày mở sổ: .............................";
                        }
                        else{
                            worksheet.getCell(pos+4, 1).value = "Number of page:..., from... to...";
                            worksheet.getCell(pos+5, 1).value = "Opening book date:…";
                        }
                        pos = pos + 7;

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
                            //  if(_lang == 'ENG' || _lang == 'ENG-KOR'|| _lang == 'ENG-VIE' )
                                else
                                {    row_item = worksheet.getRow(pos );
                                    if (dt_Data_sign[i].CODE =='ENG')
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
                       
                    }
                } 
                   // worksheet_1.Visible = true;
                  // let worksheet2 = workbook.addWorksheet('Sheet1');
            }  

                workbook.removeWorksheet(worksheet_1.id);
                /********* Print file excel ********/
                const reportFile    = Helpers.tmpPath(file_new);
                await workbook.xlsx.writeFile(reportFile)
                return response.attachment( reportFile, file_new);
            }
        } 
        catch (e) 
        {
            Utils.Logger({ LVL: "error", MODULE: "Report", FUNC: "rpt_6045050_CASH_STATEMENT_BOOKS_PARTNER_SHEET", CONTENT: e.message })
           // return response.send(Utils.response(false, e.message, null))
           return response.send(null);
        }
    }    
    
     /*########################################################## Report Bank statement books partner###########################################################################*/ 
    async rpt_6045050_CASH_STATEMENT_BOOKS_PARTNER({ request, response, auth }) {
        try 
        { 
           /* P_RPT_ID: report_info.VAL1, P_RPT_URL: report_info.VAL2, P_RPT_FILE: report_info.VAL3,
                P_COMP_ID: company_info.PARTNER_ID, P_COMP_NM: company_info.TEXT, P_COMP_TAX: company_info.TAX_CODE, P_COMP_ADD: company_info.ADDR1,
                P_COMPANY: this.selectedCompany,P_ACC_PK: this.TAC_ABACCTCODE_PK, P_FR_DATE: this.from_date, P_FR_TO: this.to_date, 
                P_CCY: this.selectedCurrency, P_STATUS: this.selectedStatus, P_BOOK_CCY: this.txtBookCCY, P_CIRCULARS: this.selectedCircular, 
                P_PRINT_VOUCHER_NO : this.selectedPrintVoucherNo, P_LANG : this.selectedLanguage, P_BANK: this.selectedBank, P_BANK_CCY : this.bank_CCY
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
            var _store          = "AC_RPT_6045035_ACC_OPENING_BPL";
            //var _store_pk       = "AC_RPT_6045035_ACCOUNT_PK"; 
            var _store_bank     = "AC_RPT_6045035_BANK_BPL"; 
            var _store_confirm  = "AC_RPT_6045050_BANK_CUST";
            var _store_approve  = "AC_RPT_6045050_BANK_CUST";
            var _circular       = "AC_SEL_GET_TT_BPL";
            var _param_pk       = [item.P_COMPANY, item.P_ACC_PK, item.P_TCO_BUSPLACE_PK];
            var _param_TT       = [item.P_CIRCULARS,this.P_TCO_BUSPLACE_PK];
            var _param_bank     = [item.P_COMPANY, item.P_BANK, item.P_TCO_BUSPLACE_PK];
            var v_no_title = "Mẫu số : S08-DN ", e_no_title = "Form No : S08-DN" , k_no_title = "양식번호 : S08-DN";
            var v_dvt = " Đơn vị tính", e_dvt = " Unit", k_dvt = " 단위";
            /***************************** Return failded ****************************/
            if (!user) 
            {
                return response.send(Utils.response(false, "Request failed!", null));
            } 
            /****************************** Begin call store and write excell *********/
            else 
            { 
                 /****************Call Bank ID ******************/
                 var dt_Bank  = await DBService.callProcCursor(_store_bank, _param_bank , p_language , p_crt_by); 
                 if (dt_Bank.length>0) 
                 {
                    dt_Bank = dt_Bank;
                    var p_bank_name  = dt_Bank[0].PARTNER_NAME;
                    var p_bank_acc   = dt_Bank[0].ACCOUNT_NO;
                    var p_bank_ccy   = dt_Bank[0].CCY;
                    var p_bank_id    = dt_Bank[0].BANK_ID;
                    var p_cust_pk    = dt_Bank[0].TCO_BUSPARTNER_PK;

                 } 
                var p_open_trans = 0; 
                var p_open_books = 0;
                var p_deposit_trans = 0; 
                var p_widrawal_trans =0;
                var p_close_trans = 0;

                var p_deposit_books = 0; 
                var p_widrawal_books = 0;
                var p_close_books = 0; 

                //var acc_pk_arr  = "";
                 //*****************Call Account PK*************** */
                /* var dt_ACC_PK  = await DBService.callProcCursor(_store_pk, _param_pk , p_language , p_crt_by); 
                 var p_temp = "";
                 for(var x = 0; x < dt_ACC_PK.length; x++)
                 {
                     acc_pk_arr = acc_pk_arr + p_temp + dt_ACC_PK[x].PK;
                     p_temp = ",";
                 }*/
                 //*****************Call Opening *************** */
                var _param          = [item.P_COMPANY, item.P_FR_DATE, item.P_FR_TO, item.P_ACC_PK , item.P_STATUS, item.P_BANK, item.P_TCO_BUSPLACE_PK];
                var dt_TK  = await DBService.callProcCursor(_store, _param , p_language , p_crt_by); 
                if (dt_TK.length>0) 
                {
                    dt_TK = dt_TK;
                    p_open_trans     = dt_TK[0].OPEN_TRANS;
                    p_open_books     = dt_TK[0].OPEN_BOOKS;

                    p_deposit_trans   = dt_TK[0].DEBIT_TRANS_AMT;
                    p_widrawal_trans  = dt_TK[0].CREDIT_TRANS_AMT;
                    p_close_trans     = dt_TK[0].BAL_TRANS_AMT;

                    p_deposit_books   = dt_TK[0].DEBIT_BOOK_AMT;
                    p_widrawal_books  = dt_TK[0].CREDIT_BOOK_AMT;
                    p_close_books     = dt_TK[0].BAL_BOOK_AMT;
                } 
                else 
                {
                   // dt_Data = dt_Data;
                    return response.send(Utils.response(false, "no_data_found", null))
                } 
               
                 /****************Call CIRCULARS******************/
                var dt_TT  = await DBService.callProcCursor(_circular, _param_TT , p_language , p_crt_by); 
                if (dt_TT.length>0) 
                {
                    dt_TT = dt_TT;
                } 
                else 
                {
                    //dt_TT = dt_TT;
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
                
                var _param_1  = [item.P_COMPANY, item.P_FR_DATE, item.P_FR_TO,  item.P_ACC_PK, item.P_STATUS, p_open_trans, p_open_books, item.P_BANK, p_bank_id, p_cust_pk, item.P_TCO_BUSPLACE_PK];
                
                if(item.P_PRINT_VOUCHER_NO == "2")
                {
                    //var dt_Data  = await DBService.callProcCursor(_store_confirm, _param_1 , p_language , p_crt_by); 
                    var dt_Data  = await DBService.callProcCursor(_store_approve, _param_1 , p_language , p_crt_by); 
                }
                else{
                    var dt_Data  = await DBService.callProcCursor(_store_approve, _param_1 , p_language , p_crt_by); 
                }
                
                
                //INFOMATION COMPANY
                worksheet.getCell("A1").value = Utils.translate("COMPANY",_dictionary , p_language) +": "+BIZ_NM;
                worksheet.getCell("A2").value = Utils.translate("ADDRESS",_dictionary , p_language) +": "+BIZ_ADD;
                worksheet.getCell("A3").value = Utils.translate("TAX_CODE",_dictionary, p_language) + ": "+ BIZ_TAX;  
                var _bookccy = item.P_BOOK_CCY;
                worksheet.getCell("M7").value = _bookccy;

                /********* Call store sign ***************/ 
                var _ac_code        = "EACAB031";
                var _store_sign     = "ac_rpt_6045085_sign";
                var _param_sign     = [item.P_COMPANY,_ac_code];
                var dt_Data_sign  = await DBService.callProcCursor(_store_sign, _param_sign, p_language, p_crt_by); 
                if (dt_Data_sign) 
                {
                    dt_Data_sign = dt_Data_sign;
                }

				var FromDate = item.P_FR_DATE;
                var ToDate = item.P_FR_TO;
                var strFrDate = FromDate.substr(6,2) + "/"+ FromDate.substr(4,2)+ "/"+ FromDate.substr(0,4);
                var strToDate = ToDate.substr(6,2) + "/"+ ToDate.substr(4,2)+ "/"+ ToDate.substr(0,4);
                // thông tư
                //Merge
                worksheet.mergeCells(4,1,4,13);// Title
                worksheet.mergeCells(5,1,5,13); //from - to date
                worksheet.mergeCells(9,1,10,1); //date
                worksheet.mergeCells(9,2,9,3); //voucher
                //worksheet.mergeCells(9,4,10,4); //local description
                //worksheet.mergeCells(9,5,10,5); // description
                worksheet.mergeCells(9,6,10,6); // description
                worksheet.mergeCells(9,7,9,9); //Amount USD
                worksheet.mergeCells(9,10,9,12); //Amount VND

                worksheet.mergeCells(9,15,9,16); // Customer
                worksheet.mergeCells(9,17,10,17); //Beneficiaty acc code
                worksheet.mergeCells(9,18,10,18); //Beneficiaty name
                worksheet.mergeCells(9,19,10,19); //Beneficiaty bank
                var _lang = item.P_LANG;
                if(_lang == 'VIE'){
                    worksheet.getCell("K1").value =  v_no_title ;
                    worksheet.getCell("K2").value =  dt_TT[0].V1 ;
                    worksheet.getCell("K3").value =  dt_TT[0].V2 ;
                    worksheet.getCell("A4").value = "SỔ TIỀN GỬI NGÂN HÀNG";
                    worksheet.getCell("A5").value = "Từ ngày " + strFrDate + " đến ngày " + strToDate;
                    worksheet.getCell("A6").value = "Nơi mở tài khoản giao dịch: "+ p_bank_name;
                    worksheet.getCell("E6").value = "Số hiệu tài khoản tại nơi gửi: " + p_bank_acc;
                    worksheet.getCell("L7").value = v_dvt;
                    //grid
                    // worksheet.mergeCells('A9', 'A10'); 
                    //worksheet.getCell("A9").value = "";
                    //worksheet.mergeCells('C9', 'D9'); 
                    worksheet.getCell("B9").value = "Chứng từ";
                    worksheet.getCell("B10").value = "Số hiệu";
                    worksheet.getCell("C10").value = "Ngày tháng";
                    worksheet.getCell("D9").value = "Diễn giải";
                    worksheet.getCell("E9").value = "Description";
                    //worksheet.mergeCells('G9', 'I9'); 
                    worksheet.getCell("F9").value = "Tài khoản đối ứng";
                    worksheet.getCell("G9").value = "Số phát sinh(USD)";
                    worksheet.getCell("G10").value = "Thu (gửi vào)";
                    worksheet.getCell("H10").value = "Chi (rút ra)";
                    worksheet.getCell("I10").value = "Còn lại";
                    worksheet.getCell("J9").value = "Số phát sinh(Tiền ghi sổ VND)";
                    worksheet.getCell("J10").value = "Thu (gửi vào)";
                    worksheet.getCell("K10").value = "Chi (rút ra)";
                    worksheet.getCell("L10").value = "Còn lại";
                    worksheet.getCell("M9").value = "Ghi chú";

                    /*worksheet.getCell("O9").value = "Customer";
                    worksheet.getCell("Q9").value = "Beneficiary Account No";
                    worksheet.getCell("R9").value = "Beneficiary name";
                    worksheet.getCell("S9").value = "Beneficiary bank";*/

                }
                else if(_lang == 'KOR'){
                    worksheet.getCell("K1").value =  k_no_title ;
                    worksheet.getCell("K2").value =  dt_TT[0].E1 ;
                    worksheet.getCell("K3").value =  dt_TT[0].E2 ;
                    worksheet.getCell("A4").value = "예금 보조부원장";
                    worksheet.getCell("A5").value = "일자 " + strFrDate + " ~ " + strToDate;
                    worksheet.getCell("A6").value = "은행명 : "+ p_bank_name;
                    worksheet.getCell("E6").value = "Bank account no : " + p_bank_acc;
                    worksheet.getCell("L7").value = "통화: ";
                    worksheet.getCell("O9").value   = "거래처";
                    worksheet.getCell("B9").value   = "전표";
                    worksheet.getCell("B10").value  = "번호";
                    worksheet.getCell("C10").value  = "일자";
                    worksheet.getCell("D9").value   = "적요";
                    worksheet.getCell("E9").value   = "적요2";
                    //worksheet.mergeCells('G9', 'I9'); 
                    worksheet.getCell("F9").value = "계정";
                    worksheet.getCell("G9").value = "금액";
                    worksheet.getCell("G10").value = "예금";
                    worksheet.getCell("H10").value = "차감";
                    worksheet.getCell("I10").value = "잔액";
                    worksheet.getCell("J9").value = "금액";
                    worksheet.getCell("J10").value = "예금";
                    worksheet.getCell("K10").value = "차감";
                    worksheet.getCell("L10").value = "잔액";
                    worksheet.getCell("M9").value = "고객사";
                    
                     /*worksheet.getCell("O9").value = "Customer";
                    worksheet.getCell("Q9").value = "Beneficiary Account No";
                    worksheet.getCell("R9").value = "Beneficiary name";
                    worksheet.getCell("S9").value = "Beneficiary bank";*/

                }
                else{
                    worksheet.getCell("K2").value =  dt_TT[0].E1 ;
                    worksheet.getCell("K3").value =  dt_TT[0].E2 ;
                    worksheet.getCell("A5").value = "From date " + strFrDate + " To date " + strToDate;
                    worksheet.getCell("A6").value = "Bank name : "+ p_bank_name;
                    worksheet.getCell("E6").value = "Bank account no : " + p_bank_acc;
                }
                var _print = item.P_PRINT_VOUCHER_NO;
                if(_print == '2'){
                    if(_lang == 'VIE')
                    {
                        worksheet.getCell("A9").value ="Ngày tháng ghi sổ";
                        worksheet.getCell("D12").value = "SỐ TỒN ĐẦU KỲ";
                        worksheet.getCell("D14").value = "Cộng phát sinh trong kỳ";
                        worksheet.getCell("D15").value = "SỐ TỒN CUỐI KỲ";
                    }
                    else if(_lang == 'KOR'){
                        worksheet.getCell("A9").value ="일자";
                    }
                    else{
                        worksheet.getCell("A9").value ="Date";
                        //worksheet.getCell("A9").value ="Approve No" ;
                    }
                }
                else{
                    //worksheet.getCell("A9").value ="Approve No" ;
                    worksheet.getCell("A9").value ="Date";
                }
                //-------Fill Data----------------

                worksheet.getCell("I12").value = Number(p_open_trans);
                worksheet.getCell("G14").value = Number(p_deposit_trans);
                worksheet.getCell("H14").value = Number(p_widrawal_trans);
                worksheet.getCell("I15").value = Number(p_close_trans);

                worksheet.getCell("L12").value = Number(p_open_books);
                worksheet.getCell("J14").value = Number(p_deposit_books);
                worksheet.getCell("K14").value = Number(p_widrawal_books);
                worksheet.getCell("L15").value = Number(p_close_books);
                
                var pos = 13; 
                if(dt_Data.length>1)
                {
                        worksheet.duplicateRow(pos,dt_Data.length-1,true);
                }  
                for (var y = 0; y < dt_Data.length; y++) 
                {
                    var row_item = worksheet.getRow(pos);
                    row_item.getCell(1).value   = dt_Data[y].TRANS_DATE;
                    row_item.getCell(2).value   = dt_Data[y].VOUCHERNO;
                    row_item.getCell(3).value   = dt_Data[y].TRANS_DATE;     
                    row_item.getCell(4).value   = dt_Data[y].REMARK;
                    row_item.getCell(5).value   = dt_Data[y].REMARK2; 
                    row_item.getCell(6).value   = dt_Data[y].ACCT_CODE; 
                    row_item.getCell(7).value   = dt_Data[y].IN_AMT; 
                    row_item.getCell(8).value   = dt_Data[y].OUT_AMT; 
                    row_item.getCell(9).value   = dt_Data[y].BAL_AMT;
                    row_item.getCell(10).value  = dt_Data[y].IN_BAMT; 
                    row_item.getCell(11).value  = dt_Data[y].OUT_BAMT; 
                    row_item.getCell(12).value  = dt_Data[y].BAL_BAMT;
                    row_item.getCell(13).value  = dt_Data[y].PK; 
                    row_item.getCell(14).value  = dt_Data[y].TR_ENCLOSE;  
                    row_item.getCell(15).value  = dt_Data[y].PARTNER_ID;  
                    row_item.getCell(16).value  = dt_Data[y].PARTNER_NAME; 
                    row_item.getCell(17).value  = dt_Data[y].BEN_ACCOUNTNO; 
                    row_item.getCell(18).value  = dt_Data[y].BEN_NAME; 
                    row_item.getCell(19).value  = dt_Data[y].BEN_BANK; 
                    pos = pos + 1; 
                    //row_item.commit();
                } 
                //Hiden column
                var l_bank_ccy = item.P_BANK_CCY;
                switch(l_bank_ccy){
                    case "VND":
                        worksheet.getColumn(7).hidden = true;
                        worksheet.getColumn(8).hidden = true;
                        worksheet.getColumn(9).hidden = true;
                    break;
                }
                /************sign */
                worksheet.mergeCells(pos+7,1,pos+7,2); 
                worksheet.mergeCells(pos+8,1,pos+8,2);   
                worksheet.mergeCells(pos+7,6,pos+7,8); 
                worksheet.mergeCells(pos+8,6,pos+8,8); 
                if(_lang === "VIE")
                {
                    worksheet.getCell(pos+4, 1).value = "Sổ có…. Trang , đánh số từ  trang 01 đến  trang……";
                    worksheet.getCell(pos+5, 1).value = "Ngày mở sổ: .............................";
                }
                else{
                    worksheet.getCell(pos+4, 1).value = "Number of page:..., from... to...";
                    worksheet.getCell(pos+5, 1).value = "Opening book date:…";
                }
                pos = pos + 7;

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
                      //  if(_lang == 'ENG' || _lang == 'ENG-KOR'|| _lang == 'ENG-VIE' )
                        else
                        {    row_item = worksheet.getRow(pos );
                            if (dt_Data_sign[i].CODE =='ENG')
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
            Utils.Logger({ LVL: "error", MODULE: "Report", FUNC: "rpt_6045050_CASH_STATEMENT_BOOKS_PARTNER", CONTENT: e.message })
           // return response.send(Utils.response(false, e.message, null))
           return response.send(null);
        }
    }        
}

module.exports = rpt6045050;