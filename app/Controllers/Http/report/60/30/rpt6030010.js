"use strict";
const Helpers       = use('Helpers')
const Antl          = use("Antl");
const Utils         = use("Utils");
const DBService = use("DBService")
var Excel           = use('exceljs');
var workbook        = new Excel.Workbook();
class rpt6030010 {
/*########################################################## Report JH ##################################################################################*/ 
    async rpt_6030010_OTHERS_SLIP({ request, response, auth }) {
        try 
        { 
        /*P_RPT_ID: report_info.VAL1, P_RPT_FILE: report_info.VAL2,
            P_COMPANY: this.sel_Company, P_DT_MONTH: this.dt_mmyy, P_VAT_TYPE: this.sel_VatType, P_TAX_RATE: this.sel_TaxRate, 
            P_CURRENT_CCY: this.sel_Ccy, P_STATUS: this.sel_Status, P_CUST_PK: this.txt_Customer_PK, P_INVOICE_NO: this.txt_InvoiceNo,
            P_AC_CD: this.txt_ACC_CD, P_SEQ: this.txt_Seq, P_VOUCHER_NO: this.sel_VoucherType, P_BALANCE: this.sel_Banlance,
            P_DT_FR: this.dt_from, P_DT_TO: this.dt_to, P_BIZ: this.sel_Bizpalce*/
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
            var _store          = "AC_RPT_6030010_OTHERS_SLIP";
            var _param          = [ item.P_COMPANY, item.P_SEQ, item.P_CIRCULARS, item.P_BOOK_CCY];
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
                    worksheet.getCell("A9").value = "수취인 성명";//Payer Name/ Họ tên người nộp tiền
                    worksheet.getCell("A10").value = "주소";// Address/ Địa chỉ:
                    worksheet.getCell("A11").value = "거래처";// Object/ Đơn vị:
                    worksheet.getCell("A12").value = "사유";// Receive Reason/Lý do nộp:
                    worksheet.getCell("A14").value = "총금액";// Total Amt/ Số tiền:
                    worksheet.getCell("H14").value = "환율";// Rate/Tỷ giá:
                    worksheet.getCell("A15").value = "비고";// In Word/ Bằng chữ:
                    worksheet.getCell("A17").value = "넣다";//  Enclose/ Kèm theo:
                    // sign
                    worksheet.getCell("C19").value = "리시버";//   
                    worksheet.getCell("E19").value = "작성자";//   
                    worksheet.getCell("F19").value = "출납";//   
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

                var r_item = worksheet.getRow(1);
                r_item.getCell(1).value = dt_Data[0].BIZ_NM;//_COMP_NM;    

                r_item = worksheet.getRow(2);
                r_item.getCell(1).value =  dt_Data[0].BIZ_ADD;//_COMP_ADD; 
                r_item.getCell(8).value =  dt_Data[0].TITLE_VIE; 

                r_item = worksheet.getRow(3);
                r_item.getCell(3).value =  dt_Data[0].BIZ_TAX;//_COMP_TAX;   
                r_item.getCell(12).value =  dt_Data[0].VOUCHER_NO; 
                
                r_item = worksheet.getRow(4); 
                r_item.getCell(1).value =   dt_Data[0].VOUCHER_NM;   
                r_item.getCell(12).value =  dt_Data[0].SEQ; 
                worksheet.mergeCells(4,1,6,4);
                r_item.getCell(1).font  = { italic: false, bold: true, size:13.5, name: 'Times New Roman'};
                r_item.getCell(1).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };

                
                var  pos = 5;
                var l_new_row  = dt_Data[0].TOTAL_NEWROW;
                if(Number(l_new_row) > 0){
                    Utils.excelInsertRows(worksheet, pos + 1, l_new_row -1 );
                    l_new_row =  l_new_row - 1 ;
                }
                for (var i = 0; i < dt_Data.length; i++) 
                {
                
                    var row_acc = worksheet.getRow(pos);
                    row_acc.getCell(6).value = dt_Data[i].DRCR_NM
                    row_acc.getCell(7).value = dt_Data[i].ACC_CODE;
                    row_acc.getCell(8).value = dt_Data[i].ACC_NM;
                    row_acc.getCell(12).value = dt_Data[i].TR_BOOKAMT;
                    
                    
                    row_acc.getCell(6).font      = { italic: false, bold: false, size:10, name: 'Times New Roman'};
                    row_acc.getCell(6).alignment = { vertical: 'middle', horizontal: 'left'};
                    row_acc.getCell(7).font      = { italic: false, bold: false, size:10, name: 'Times New Roman'};
                    row_acc.getCell(7).alignment = { vertical: 'middle', horizontal: 'left'};
                    row_acc.getCell(8).font      = { italic: false, bold: false, size:10, name: 'Times New Roman'};
                    row_acc.getCell(8).alignment = { vertical: 'middle', horizontal: 'left', wrapText: true};
                    row_acc.getCell(12).numFmt   = '_(* #,##0_);_(* (#,##0);_(* ""_);_(@_)';
                    row_acc.getCell(12).font      = { italic: false, bold: false, size:10, name: 'Times New Roman'}; 
                    row_acc.getCell(12).alignment  = { vertical: 'middle', horizontal: 'right', shrinkToFit: true };
                    worksheet.mergeCells(pos,8, pos,11);
                    if(dt_Data[i].L_LENGTH > 50)
                    {
                        row_acc.height = 39; 
                    }
                    else{
                        row_acc.height = 30; 
                    }
                    pos = pos + 1;
                }
                pos = 7;
                r_item = worksheet.getRow(pos);
                r_item.getCell(1).value =  dt_Data[0].TR_DATE; 
                r_item.getCell(1).font  = { italic: false, bold: false, size:10, name: 'Times New Roman'};
                r_item.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
                r_item.getCell(8).font  = { italic: false, bold: false, size:10, name: 'Times New Roman'};
                r_item.getCell(8).alignment = { vertical: 'middle', horizontal: 'left', wrapText: true};
                r_item.getCell(12).alignment  = { vertical: 'middle', horizontal: 'right', shrinkToFit: true };
                worksheet.mergeCells(pos,1, pos,4);
                pos = 8 + l_new_row;
                r_item = worksheet.getRow(pos); 
                r_item.height = 9.75; 
                pos = 9 + l_new_row;
                r_item = worksheet.getRow(pos); 
                r_item.getCell(5).value =  dt_Data[0].PERSON; 
                r_item.getCell(5).font  = { italic: false, bold: true, size:11, name: 'Times New Roman'};
                r_item.getCell(5).alignment = { vertical: 'middle', horizontal: 'left' };
                worksheet.mergeCells(pos,5, pos,12);

                pos = 10 + l_new_row;
                r_item = worksheet.getRow(pos); 
                r_item.getCell(4).value =  dt_Data[0].ADDR; 
                r_item.getCell(4).font  = { italic: false, bold: true, size:11, name: 'Times New Roman'};
                r_item.getCell(4).alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
                worksheet.mergeCells(pos,4, pos,12);
                r_item.height = 30; 


                pos = 11 + l_new_row;
                r_item = worksheet.getRow(pos); 
                r_item.getCell(4).value =  dt_Data[0].BUSPARTNER_LNM;
                r_item.getCell(4).font  = { italic: false, bold: true, size:11, name: 'Times New Roman'};
                r_item.getCell(4).alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
                worksheet.mergeCells(pos,4, pos,12);
                r_item.height = 30;  

                pos = 12 + l_new_row;
                r_item = worksheet.getRow(pos); 
                r_item.getCell(4).value =  dt_Data[0].REMARK; 
                r_item.getCell(4).font  = { italic: false, bold: false, size:11, name: 'Times New Roman'};
                r_item.getCell(4).alignment = { vertical: 'middle', horizontal: 'left'};
                worksheet.mergeCells(pos,4, pos,12);
                r_item.height = 17.25;  

                pos = 13 + l_new_row;
                r_item = worksheet.getRow(pos); 
                r_item.getCell(4).value =  dt_Data[0].REMARK2; 
                r_item.getCell(4).font  = { italic: false, bold: false, size:11, name: 'Times New Roman'};
                r_item.getCell(4).alignment = { vertical: 'middle', horizontal: 'left'};
                worksheet.mergeCells(pos,4, pos,12);
                r_item.height = 17.25; 

                pos = 14 + l_new_row;
                r_item = worksheet.getRow(pos); 
                r_item.getCell(4).value  =  dt_Data[0].FMT_AMOUNT; 
                r_item.getCell(12).value =  dt_Data[0].TR_RATE; 
                r_item.getCell(4).font  = { italic: false, bold: true, size:11, name: 'Times New Roman'};
                r_item.getCell(4).alignment = { vertical: 'middle', horizontal: 'center'};
                worksheet.mergeCells(pos,4, pos,7);
                worksheet.mergeCells(pos,1, pos,3);

                pos = 15 + l_new_row;
                r_item = worksheet.getRow(pos); 
                r_item.getCell(4).value  = Utils.Num2VNText(dt_Data[0].AMOUNT, dt_Data[0].CCY);
                r_item.getCell(4).font  = { italic: false, bold: false, size:11, name: 'Times New Roman'};
                r_item.getCell(4).alignment = { vertical: 'middle', horizontal: 'left', wrapText: true};
                worksheet.mergeCells(pos,4, pos,12);
                worksheet.mergeCells(pos,1, pos+1,3);
                r_item.height = 30;  

                pos = 16 + l_new_row;
                r_item = worksheet.getRow(pos); 
                r_item.getCell(4).value  =  Utils.Num2EngText(dt_Data[0].AMOUNT, dt_Data[0].CCY);
                r_item.getCell(4).font  = { italic: false, bold: false, size:11, name: 'Times New Roman'};
                r_item.getCell(4).alignment = { vertical: 'middle', horizontal: 'left', wrapText: true};
                worksheet.mergeCells(pos,4, pos,12);
                r_item.height = 30;  

                pos = 17 + l_new_row;
                r_item = worksheet.getRow(pos); 
                r_item.getCell(4).value  =  dt_Data[0].ENCLOSE;

                pos = 19 + l_new_row;
                r_item = worksheet.getRow(pos); 
                r_item.getCell(1).value  =  dt_Data[0].VIE_VAL1;
                r_item.getCell(3).value  =  dt_Data[0].VIE_VAL2;
                r_item.getCell(5).value  =  dt_Data[0].VIE_VAL3;
                r_item.getCell(7).value  =  dt_Data[0].VIE_VAL4;
                r_item.getCell(9).value  =  dt_Data[0].VIE_VAL5;
                r_item.getCell(11).value =  dt_Data[0].VIE_DESCRIPTION;

                r_item.getCell(1).font  = { italic: false, bold: true, size:10, name: 'Times New Roman'};
                r_item.getCell(1).alignment = { vertical: 'middle', horizontal: 'center'};
                worksheet.mergeCells(pos,1, pos,2);
                r_item.getCell(3).font  = { italic: false, bold: true, size:10, name: 'Times New Roman'};
                r_item.getCell(3).alignment = { vertical: 'middle', horizontal: 'center'};
                worksheet.mergeCells(pos,3, pos,4);
                r_item.getCell(5).font  = { italic: false, bold: true, size:10, name: 'Times New Roman'};
                r_item.getCell(5).alignment = { vertical: 'middle', horizontal: 'center'};
                worksheet.mergeCells(pos,5, pos,6);
                r_item.getCell(7).font  = { italic: false, bold: true, size:10, name: 'Times New Roman'};
                r_item.getCell(7).alignment = { vertical: 'middle', horizontal: 'center'};
                worksheet.mergeCells(pos,7, pos,8);
                r_item.getCell(9).font  = { italic: false, bold: true, size:10, name: 'Times New Roman'};
                r_item.getCell(9).alignment = { vertical: 'middle', horizontal: 'center'};
                worksheet.mergeCells(pos,9, pos,10);
                r_item.getCell(11).font  = { italic: false, bold: true, size:10, name: 'Times New Roman'};
                r_item.getCell(11).alignment = { vertical: 'middle', horizontal: 'center'};
                worksheet.mergeCells(pos,11, pos,12);

                pos = 20 + l_new_row;
                r_item = worksheet.getRow(pos); 
                r_item.getCell(1).value  =  dt_Data[0].ENG_VAL1;
                r_item.getCell(3).value  =  dt_Data[0].ENG_VAL2;
                r_item.getCell(5).value  =  dt_Data[0].ENG_VAL3;
                r_item.getCell(7).value  =  dt_Data[0].ENG_VAL4;
                r_item.getCell(9).value  =  dt_Data[0].ENG_VAL5;
                r_item.getCell(11).value =  dt_Data[0].ENG_DESCRIPTION;
                
                r_item.getCell(1).font  = { italic: false, bold: true, size:10, name: 'Times New Roman'};
                r_item.getCell(1).alignment = { vertical: 'middle', horizontal: 'center'};
                worksheet.mergeCells(pos,1, pos,2);
                r_item.getCell(3).font  = { italic: false, bold: true, size:10, name: 'Times New Roman'};
                r_item.getCell(3).alignment = { vertical: 'middle', horizontal: 'center'};
                worksheet.mergeCells(pos,3, pos,4);
                r_item.getCell(5).font  = { italic: false, bold: true, size:10, name: 'Times New Roman'};
                r_item.getCell(5).alignment = { vertical: 'middle', horizontal: 'center'};
                worksheet.mergeCells(pos,5, pos,6);
                r_item.getCell(7).font  = { italic: false, bold: true, size:10, name: 'Times New Roman'};
                r_item.getCell(7).alignment = { vertical: 'middle', horizontal: 'center'};
                worksheet.mergeCells(pos,7, pos,8);
                r_item.getCell(9).font  = { italic: false, bold: true, size:10, name: 'Times New Roman'};
                r_item.getCell(9).alignment = { vertical: 'middle', horizontal: 'center'};
                worksheet.mergeCells(pos,9, pos,10);
                r_item.getCell(11).font  = { italic: false, bold: true, size:10, name: 'Times New Roman'};
                r_item.getCell(11).alignment = { vertical: 'middle', horizontal: 'center'};
                worksheet.mergeCells(pos,11, pos,12);

                pos = 21 + l_new_row; 
                r_item = worksheet.getRow(pos);
                r_item.getCell(1).value  =  dt_Data[0].SIGN_VAL1;
                r_item.getCell(3).value  =  dt_Data[0].SIGN_VAL2;
                r_item.getCell(5).value  =  dt_Data[0].SIGN_VAL3;
                r_item.getCell(7).value  =  dt_Data[0].SIGN_VAL4;
                r_item.getCell(9).value  =  dt_Data[0].SIGN_VAL5;
                r_item.getCell(11).value =  dt_Data[0].SIGN_DESCRIPTION;

                r_item.getCell(1).font  = { italic: true, bold: false, size:10, name: 'Times New Roman'};
                r_item.getCell(1).alignment = { vertical: 'middle', horizontal: 'center'};
                worksheet.mergeCells(pos,1, pos,2);
                r_item.getCell(3).font  = { italic: true, bold: false, size:10, name: 'Times New Roman'};
                r_item.getCell(3).alignment = { vertical: 'middle', horizontal: 'center'};
                worksheet.mergeCells(pos,3, pos,4);
                r_item.getCell(5).font  = { italic: true, bold: false, size:10, name: 'Times New Roman'};
                r_item.getCell(5).alignment = { vertical: 'middle', horizontal: 'center'};
                worksheet.mergeCells(pos,5, pos,6);
                r_item.getCell(7).font  = { italic: true, bold: false, size:10, name: 'Times New Roman'};
                r_item.getCell(7).alignment = { vertical: 'middle', horizontal: 'center'};
                worksheet.mergeCells(pos,7, pos,8);
                r_item.getCell(9).font  = { italic: true, bold: false, size:10, name: 'Times New Roman'};
                r_item.getCell(9).alignment = { vertical: 'middle', horizontal: 'center'};
                worksheet.mergeCells(pos,9, pos,10);
                r_item.getCell(11).font  = { italic: true, bold: false, size:10, name: 'Times New Roman'};
                r_item.getCell(11).alignment = { vertical: 'middle', horizontal: 'center', shrinkToFit: true};
                worksheet.mergeCells(pos,11, pos,12);

                pos = 22 + l_new_row;
                r_item = worksheet.getRow(pos);
                r_item.getCell(1).font  = { italic: true, bold: false, size:10, name: 'Times New Roman'};
                r_item.getCell(1).alignment = { vertical: 'middle', horizontal: 'center'};
                worksheet.mergeCells(pos,1, pos+2,2);
                r_item.getCell(3).font  = { italic: true, bold: false, size:10, name: 'Times New Roman'};
                r_item.getCell(3).alignment = { vertical: 'middle', horizontal: 'center'};
                worksheet.mergeCells(pos,3, pos+2,4);
                r_item.getCell(5).font  = { italic: true, bold: false, size:10, name: 'Times New Roman'};
                r_item.getCell(5).alignment = { vertical: 'middle', horizontal: 'center'};
                worksheet.mergeCells(pos,5, pos+2,6);
                r_item.getCell(7).font  = { italic: true, bold: false, size:10, name: 'Times New Roman'};
                r_item.getCell(7).alignment = { vertical: 'middle', horizontal: 'center'};
                worksheet.mergeCells(pos,7, pos+2,8);
                r_item.getCell(9).font  = { italic: true, bold: false, size:10, name: 'Times New Roman'};
                r_item.getCell(9).alignment = { vertical: 'middle', horizontal: 'center'};
                worksheet.mergeCells(pos,9, pos+2,10);
                r_item.getCell(11).font  = { italic: true, bold: false, size:10, name: 'Times New Roman'};
                r_item.getCell(11).alignment = { vertical: 'middle', horizontal: 'center'};
                worksheet.mergeCells(pos,11, pos+2,12);

                pos = 25 + l_new_row;
                r_item = worksheet.getRow(pos); 
                r_item.getCell(1).value  =  dt_Data[0].NAM_VAL1;
                r_item.getCell(3).value  =  dt_Data[0].NAM_VAL2;
                r_item.getCell(5).value  =  dt_Data[0].NAM_VAL3;
                r_item.getCell(7).value  =  dt_Data[0].NAM_VAL4;
                r_item.getCell(9).value  =  dt_Data[0].NAM_VAL5;
                r_item.getCell(11).value =  dt_Data[0].NAM_DESCRIPTION;

                r_item.getCell(1).font  = { italic: false, bold: true, size:10, name: 'Times New Roman'};
                r_item.getCell(1).alignment = { vertical: 'middle', horizontal: 'center'};
                worksheet.mergeCells(pos,1, pos,2);
                r_item.getCell(3).font  = { italic: false, bold: true, size:10, name: 'Times New Roman'};
                r_item.getCell(3).alignment = { vertical: 'middle', horizontal: 'center'};
                worksheet.mergeCells(pos,3, pos,4);
                r_item.getCell(5).font  = { italic: false, bold: true, size:10, name: 'Times New Roman'};
                r_item.getCell(5).alignment = { vertical: 'middle', horizontal: 'center'};
                worksheet.mergeCells(pos,5, pos,6);
                r_item.getCell(7).font  = { italic: false, bold: true, size:10, name: 'Times New Roman'};
                r_item.getCell(7).alignment = { vertical: 'middle', horizontal: 'center'};
                worksheet.mergeCells(pos,7, pos,8);
                r_item.getCell(9).font  = { italic: false, bold: true, size:10, name: 'Times New Roman'};
                r_item.getCell(9).alignment = { vertical: 'middle', horizontal: 'center'};
                worksheet.mergeCells(pos,9, pos,10);
                r_item.getCell(11).font  = { italic: false, bold: true, size:10, name: 'Times New Roman'};
                r_item.getCell(11).alignment = { vertical: 'middle', horizontal: 'center'};
                worksheet.mergeCells(pos,11, pos,12);

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
    async rpt_6030010_EVIDENCE({ request, response, auth }) {
        try 
        { 
        /*P_RPT_ID: report_info.VAL1, P_RPT_FILE: report_info.VAL2,
            P_COMPANY: this.sel_Company, P_DT_MONTH: this.dt_mmyy, P_VAT_TYPE: this.sel_VatType, P_TAX_RATE: this.sel_TaxRate, 
            P_CURRENT_CCY: this.sel_Ccy, P_STATUS: this.sel_Status, P_CUST_PK: this.txt_Customer_PK, P_INVOICE_NO: this.txt_InvoiceNo,
            P_AC_CD: this.txt_ACC_CD, P_SEQ: this.txt_Seq, P_VOUCHER_NO: this.sel_VoucherType, P_BALANCE: this.sel_Banlance,
            P_DT_FR: this.dt_from, P_DT_TO: this.dt_to, P_BIZ: this.sel_Bizpalce*/
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
            var _store          = "AC_RPT_6030010_EVIDENCE";
            var _param          = [ item.P_COMPANY, item.P_SEQ,  item.P_CIRCULARS, item.P_BOOK_CCY];
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

                var r_item  = worksheet.getRow(30);
                r_item.getCell(9).value =  dt_Data[0].TR_DATE; 

                r_item = worksheet.getRow(37);
                r_item.getCell(4).value =  dt_Data[0].BUSPARTNER_LNM; 
                
                r_item = worksheet.getRow(41);
                r_item.getCell(4).value =  dt_Data[0].REMARK; 
                
                r_item = worksheet.getRow(46);
                r_item.getCell(3).value =  dt_Data[0].DEPARTMENT; 
                r_item.getCell(7).value =  dt_Data[0].PERSON; 
                r_item.getCell(9).value =  dt_Data[0].FMT_AMOUNT; 
                
                r_item = worksheet.getRow(59);
                r_item.getCell(8).value = dt_Data[0].BIZ_NM;//_COMP_NM;   

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
    async rpt_6030010_ACC_SLIP_BK({ request, response, auth }) {
        try 
        { 
          /*P_RPT_ID: report_info.VAL1, P_RPT_FILE: report_info.VAL2,
            P_COMPANY: this.sel_Company, P_DT_MONTH: this.dt_mmyy, P_VAT_TYPE: this.sel_VatType, P_TAX_RATE: this.sel_TaxRate, 
            P_CURRENT_CCY: this.sel_Ccy, P_STATUS: this.sel_Status, P_CUST_PK: this.txt_Customer_PK, P_INVOICE_NO: this.txt_InvoiceNo,
            P_AC_CD: this.txt_ACC_CD, P_SEQ: this.txt_Seq, P_VOUCHER_NO: this.sel_VoucherType, P_BALANCE: this.sel_Banlance,
            P_DT_FR: this.dt_from, P_DT_TO: this.dt_to, P_BIZ: this.sel_Bizpalce*/
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
            var _store          = "AC_RPT_6030010_ACC_SLIP";
            var _param          = [ item.P_COMPANY, item.P_SEQ,  item.P_BOOK_CCY, "DATA"];
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
                _param          = [ item.P_COMPANY, item.P_SEQ,  item.P_BOOK_CCY, "TRANS"];
                var dt_Data_Trans  = await DBService.callProcCursor(_store, _param, p_language, p_crt_by);  
                if (dt_Data.length >0) 
                {
                    dt_Data = dt_Data;
                } 
                else 
                { 
                    return response.send(Utils.response(false, "no_data_found", null))
                } 
                if (dt_Data_Trans.length >0) 
                {
                    dt_Data_Trans = dt_Data_Trans;
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
                var  r_item = worksheet.getRow(2); 
                r_item.getCell(2).value  =  dt_Data[0].REPORT_TITLE;
                r_item = worksheet.getRow(3); 
                //sign
                r_item.getCell(5).value  =  dt_Data[0].DESCRIPTION;
                r_item.getCell(6).value  =  dt_Data[0].VAL1;
                r_item.getCell(8).value  =  dt_Data[0].VAL2;
                r_item.getCell(10).value  =  dt_Data[0].VAL3;
                r_item.getCell(12).value  =  dt_Data[0].VAL4;
                r_item.getCell(14).value  =  dt_Data[0].VAL5; 

                r_item = worksheet.getRow(7); 
                r_item.getCell(4).value  =  dt_Data[0].BIZ_NM;//_COMP_NM;
                r_item.getCell(10).value  =  dt_Data[0].VOUCHERNO +"("+ dt_Data[0].SEQ + ")";

                r_item = worksheet.getRow(8); 
                r_item.getCell(4).value  =  dt_Data[0].DEPT_NAME;
                r_item.getCell(10).value  =  dt_Data[0].TRANS_DATE;

                r_item = worksheet.getRow(10); 
                r_item.getCell(4).value  =  dt_Data[0].BOOK_AMT;
                r_item.getCell(10).value  =  dt_Data[0].PRO_BY;

                r_item = worksheet.getRow(11); 
                r_item.getCell(4).value  =  item.P_BOOK_CCY;
                r_item.getCell(10).value  =  dt_Data[0].SIGN_DATE;

                r_item = worksheet.getRow(12); 
                r_item.getCell(4).value  =  dt_Data[0].EX_BOOKRATE;
                r_item.getCell(10).value  =  dt_Data[0].APP_BY;

                r_item = worksheet.getRow(13); 
                r_item.getCell(4).value  =  dt_Data[0].TR_TYPE;
                r_item.getCell(10).value  =  dt_Data[0].TR_TPNM; 

                r_item = worksheet.getRow(14); 
                r_item.getCell(4).value  =  dt_Data[0].REMARK;
                r_item.getCell(10).value  =  dt_Data[0].REMARK2;

                r_item = worksheet.getRow(15); 
                r_item.getCell(4).value  =  dt_Data[0].TR_ENCLOSE; 
                
                if(p_language == 'KOR') 
                {
                    worksheet.getCell("F1").value = "전표 승인번호:"; //Voucher Approval No :	 
                    worksheet.getCell("B2").value = "매출채권";//ACCOUNTING SLIP/PHIẾU KẾ TOÁN													
                    worksheet.getCell("B3").value = "거래승인";//"Transaction Approval/  Ký duyệt 
                    worksheet.getCell("E3").value = "일자";//"Date/   Ngày  
                    worksheet.getCell("F3").value = "담당자";//"Charger/ Người lập 	 
                    worksheet.getCell("H3").value = "확인";//"Check/ Người kiểm 	 
                    worksheet.getCell("J3").value = "회계팀장";//"Chief Acc./  Kế toán trưởng  
                    worksheet.getCell("L3").value = "매니저";//"Manager/ Trưởng phòng 	 
                    worksheet.getCell("N3").value = "부서장";//"Director/  Giám đốc	 
                    worksheet.getCell("B7").value = "사업장";//Company/ Tên công ty:
                    worksheet.getCell("F7").value = "전표번호";//Voucher No / (Seq)/ 
                    worksheet.getCell("B8").value = "부서";//Department/ Bộ phận:
                    worksheet.getCell("F8").value = "일자";//Date/ Ngày:
                    worksheet.getCell("B10").value = "금액";//Amount/ Số tiền
                    worksheet.getCell("F10").value = "제안자";//Proposed By/
                    worksheet.getCell("B11").value = "통화";//Booking Currency/   Tiền ghi sổ
                    worksheet.getCell("F11").value = "승인일자";//Approved Date/
                    worksheet.getCell("B12").value = "환율";//Exchange Rate/ Tỷ giá
                    worksheet.getCell("F12").value = "승인자";//Approved By/
                    worksheet.getCell("B13").value = "거래코드";//Transaction Code/
                    worksheet.getCell("F13").value = "거래유형";//Transaction Name/
                    worksheet.getCell("B14").value = "비고";//Description/
                    worksheet.getCell("F14").value = "현지 비고";//Local Description/
                    worksheet.getCell("B15").value = "첨부문서";//Enclose/
                    worksheet.getCell("B17").value = "거래유형";//TRANSACTION DETAILS/ CHI TIẾT
                    worksheet.getCell("B18").value = "계정코드";//Account/ Tên TK
                    worksheet.getCell("D18").value = "비고";//Description/
                    worksheet.getCell("F18").value = "관리항목";//Control Items/ Ghi chú
                    worksheet.getCell("J18").value = "차변";//Debit/ Nợ
                    worksheet.getCell("M18").value = "대변";//Credit/ Có
                    worksheet.getCell("B21").value = "총계";//Total/ Tổng cộng
                    worksheet.getCell("F24").value = "차변";//Debit
                    worksheet.getCell("I24").value = "대변";//Credit
                    worksheet.name = "매출채권";
                }


                var pos = 19; var copy_row = ((dt_Data.length-1)*4)+2;
                if(dt_Data.length>1)
                {
                    worksheet.duplicateRow(pos+1,copy_row,true);
                }   
                for (var i = 0; i < dt_Data.length; i++) 
                {
                    r_item = worksheet.getRow(pos);   
                    worksheet.mergeCells(pos,2,pos,3);
                    r_item.getCell(2).value = dt_Data[i].ACCD; 
                    worksheet.mergeCells(pos,4,pos+1,5);
                    r_item.getCell(4).value = dt_Data[i].REMARK;  
                    worksheet.mergeCells(pos,6,pos+3,9);
                    r_item.getCell(6).value = dt_Data[i].ITEM_CTRL;  
                    worksheet.mergeCells(pos,10,pos+3,12);
                    r_item.getCell(10).value = dt_Data[i].DEBIT_AMT; 
                    worksheet.mergeCells(pos,13,pos+3,15);  
                    r_item.getCell(13).value = dt_Data[i].CREDIT_AMT;  

                    r_item = worksheet.getRow(pos+1);   
                    worksheet.mergeCells(pos+1,2,pos+3,3);
                    r_item.getCell(2).value = dt_Data[i].ACNM; 

                    r_item = worksheet.getRow(pos+2);   
                    worksheet.mergeCells(pos+2,4,pos+3,5);
                    r_item.getCell(4).value = dt_Data[i].REMARK2; 
                    
                    worksheet.getCell(pos,2).border = {right: {style:'thin'},left: {style:'thin'}};
                    worksheet.getCell(pos+1,2).border = {right: {style:'thin'},left: {style:'thin'}, bottom: {style:'thin'} };

                    worksheet.getCell(pos,4).border = {right: {style:'thin'},left: {style:'thin'}};
                    worksheet.getCell(pos+2,4).border = {right: {style:'thin'},left: {style:'thin'}, bottom: {style:'thin'}};

                    worksheet.getCell(pos,6).border = {right: {style:'thin'},left: {style:'thin'}, bottom: {style:'thin'}}; 

                    worksheet.getCell(pos,10).border = {right: {style:'thin'},left: {style:'thin'}, bottom: {style:'thin'}}; 
                    worksheet.getCell(pos,13).border = {right: {style:'thin'},left: {style:'thin'}, bottom: {style:'thin'}}; 

                    pos += 4;
                   
                }    
                // total
                r_item = worksheet.getRow(pos);
                
                worksheet.mergeCells(pos,2,pos,9); 
                worksheet.mergeCells(pos,10,pos,12); 
                r_item.getCell(10).value = dt_Data[0].SUM_DEBIT;
                worksheet.mergeCells(pos,13,pos,15);    
                r_item.getCell(13).value = dt_Data[0].SUM_CREDIT;  
                worksheet.getCell(pos,2).border = {right: {style:'thin'},left: {style:'thin'},top: {style:'thin'},bottom: {style:'thin'}}; 
                worksheet.getCell(pos,10).border = {right: {style:'thin'},left: {style:'thin'},top: {style:'thin'},bottom: {style:'thin'}}; 
                worksheet.getCell(pos,13).border = {right: {style:'thin'},left: {style:'thin'},top: {style:'thin'},bottom: {style:'thin'}}; 
                //korea remark
              /*  pos += 3;
                r_item = worksheet.getRow(pos);
                worksheet.mergeCells(pos,1,pos,3); 
                worksheet.mergeCells(pos,4,pos,16);  
                worksheet.getCell(pos,4).border = {right: {style:'thin'},left: {style:'thin'},top: {style:'thin'},bottom: {style:'thin'}}; 
               */ // general
                pos += 1;
                r_item = worksheet.getRow(pos);
                worksheet.mergeCells(pos,1,pos,3); 
                worksheet.mergeCells(pos,4,pos,16);
               // worksheet.getCell(pos,4).border = {right: {style:'thin'},left: {style:'thin'},top: {style:'thin'},bottom: {style:'thin'}}; 
                
                worksheet.getCell(pos,4).border = {right: {style:'thin'},left: {style:'thick'},top: {style:'thin'},bottom: {style:'thick'}}; 
                //trans ccy
                pos += 2;
                r_item = worksheet.getRow(pos);
                worksheet.mergeCells(pos,6,pos,8); 
                worksheet.mergeCells(pos,9,pos,11);  
                worksheet.getCell(pos,9).border = {right: {style:'thin'},left: {style:'thin'},top: {style:'thin'},bottom: {style:'thin'}}; 
                
                pos += 1;
                if(dt_Data_Trans.length>1)
                {
                    worksheet.duplicateRow(pos,dt_Data_Trans.length-1,true);
                }   
                for (var i = 0; i < dt_Data_Trans.length; i++) 
                {
                    r_item = worksheet.getRow(pos);    
                    r_item.getCell(5).value = dt_Data_Trans[i].CCY; 

                    worksheet.mergeCells(pos,6,pos,8); 
                    r_item.getCell(6).value = dt_Data_Trans[i].SUM_DEBIT; 

                    worksheet.mergeCells(pos,9,pos,11);  
                    r_item.getCell(9).value = dt_Data_Trans[i].SUM_CREDIT; 
                    worksheet.getCell(pos,9).border = {right: {style:'thin'},left: {style:'thin'},top: {style:'thin'},bottom: {style:'thin'}}; 
                    pos += 1;
                }
                //acc section
              /*  pos += 2;
                r_item = worksheet.getRow(pos);
                worksheet.mergeCells(pos,6,pos,8); 
                worksheet.mergeCells(pos,9,pos,11); 
                worksheet.mergeCells(pos,12,pos,14);  
                worksheet.getCell(pos,12).border = {right: {style:'thin'},left: {style:'thin'},top: {style:'thin'},bottom: {style:'thin'}}; 
                pos +=1;
                r_item = worksheet.getRow(pos);
                worksheet.mergeCells(pos,5,pos+3,5); 
                worksheet.mergeCells(pos,6,pos+3,8); 
                worksheet.mergeCells(pos,9,pos+3,11); 
                worksheet.mergeCells(pos,12,pos+3,14);
                worksheet.getCell(pos,5).border = {right: {style:'thin'},left: {style:'thin'},top: {style:'thin'},bottom: {style:'thin'}}; 
                worksheet.getCell(pos,6).border = {right: {style:'thin'},left: {style:'thin'},top: {style:'thin'},bottom: {style:'thin'}}; 
                worksheet.getCell(pos,9).border = {right: {style:'thin'},left: {style:'thin'},top: {style:'thin'},bottom: {style:'thin'}}; 
                worksheet.getCell(pos,12).border = {right: {style:'thin'},left: {style:'thin'},top: {style:'thin'},bottom: {style:'thin'}};  
                */
               
                
                /********* Print file excel ********/
                const reportFile    = Helpers.tmpPath(file_new);
                await workbook.xlsx.writeFile(reportFile)
                // await workbook.xlsx.writeFile(reportFile); 
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
    async rpt_6030010_ACC_SLIP({ request, response, auth }) {
        try 
        { 
          /*P_RPT_ID: report_info.VAL1, P_RPT_FILE: report_info.VAL2,
            P_COMPANY: this.sel_Company, P_DT_MONTH: this.dt_mmyy, P_VAT_TYPE: this.sel_VatType, P_TAX_RATE: this.sel_TaxRate, 
            P_CURRENT_CCY: this.sel_Ccy, P_STATUS: this.sel_Status, P_CUST_PK: this.txt_Customer_PK, P_INVOICE_NO: this.txt_InvoiceNo,
            P_AC_CD: this.txt_ACC_CD, P_SEQ: this.txt_Seq, P_VOUCHER_NO: this.sel_VoucherType, P_BALANCE: this.sel_Banlance,
            P_DT_FR: this.dt_from, P_DT_TO: this.dt_to, P_BIZ: this.sel_Bizpalce*/
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
            var _store          = "AC_RPT_6030010_ACC_SLIP";
             /***************************** Return failded ****************************/
            if (!user) 
            {
                return response.send(Utils.response(false, "Request failed!", null));
            } 
            /****************************** Begin call store and write excell *********/
            else 
            { 
                /********* Call store  ***************/ 
                var list_seq = [];
                //TH khác form 6030020
                let count_seq = item.P_SEQ_COUNT > 0 ? item.P_SEQ_COUNT : 0; 
                if((item.P_SEQ_COUNT === undefined) || (item.P_SEQ_COUNT === 'undefined') || (count_seq === 0)){
                    //Set count_seq để chạy mảng for
                    count_seq = 1;
                    list_seq += item.P_SEQ + ',';
                }
                else{
                    count_seq = item.P_SEQ_COUNT;
                    list_seq = item.P_SEQ_GRD;
                }
                let l_seq = list_seq.split(',');
                let pos_mst = 0;
                let pos = 0;
                
                /********* Read file excel ********/ 
                const templateFile  = Helpers.resourcesPath(_resourcesPath); 
                await workbook.xlsx.readFile(templateFile);
                var worksheet       = workbook.getWorksheet(1);
                for(let l_count_seq = 0; l_count_seq < count_seq; l_count_seq++){
                    /********* Write file excel ********/
                    console.log(l_seq[l_count_seq]);
                    var _param         = [ item.P_COMPANY, l_seq[l_count_seq],  item.P_BOOK_CCY, "DATA"];
                    var dt_Data  = await DBService.callProcCursor(_store, _param, p_language, p_crt_by);  
                        _param         = [ item.P_COMPANY, l_seq[l_count_seq],  item.P_BOOK_CCY, "TRANS"];
                    var dt_Data_Trans  = await DBService.callProcCursor(_store, _param, p_language, p_crt_by);  
                    if (dt_Data.length >0) 
                    {
                        dt_Data = dt_Data;
                    } 
                    else 
                    { 
                        return response.send(Utils.response(false, "no_data_found", null))
                    } 
                    if (dt_Data_Trans.length >0) 
                    {
                        dt_Data_Trans = dt_Data_Trans;
                    } 
                    else 
                    { 
                        return response.send(Utils.response(false, "no_data_found", null))
                    } 
                     /*width column*/ 
                    worksheet.getColumn(1).width = 0.6;
                    worksheet.getColumn(2).width = 8.43;
                    worksheet.getColumn(3).width = 10.14;
                    worksheet.getColumn(4).width = 13.0;
                    worksheet.getColumn(5).width  = 10.20;
                    worksheet.getColumn(6).width  = 5.29;
                    worksheet.getColumn(7).width  = 5.29;
                    worksheet.getColumn(8).width  = 5.29;
                    worksheet.getColumn(9).width  = 5.29;
                    worksheet.getColumn(10).width = 5.29;
                    worksheet.getColumn(11).width = 5.29;
                    worksheet.getColumn(12).width = 5.29;
                    worksheet.getColumn(13).width = 5.29;
                    worksheet.getColumn(14).width = 5.29;
                    worksheet.getColumn(15).width = 5.29;
                    worksheet.getColumn(16).width = 0.6;
                    /********* Write file excel ********/
                    /*Set Header */ 
                    let pos_item = 0;
                    if(l_count_seq > 0){
                        pos_mst = pos + 2;
                        var r_break_page = worksheet.getRow(pos_mst);
                        r_break_page.addPageBreak();
                        //console.log('pos_mst---------pos_mst : ' + pos_mst);
                    }
                    //console.log('1---------pos_item : ' + pos_item + '----------pos_mst : ' + pos_mst + '----------pos : ' + pos);
                    //-------------- row 1-----------------
                    pos_item = pos_mst + 1; //row voucher approval no
                    var r_item = worksheet.getRow(pos_item); 
                    r_item.height = 17.25;
                    r_item.getCell(6).value = "Voucher Approval No :";
                    r_item.getCell(6).font = { bold:true, italic:false, name: 'Times New Roman', size:10};
                    r_item.getCell(6).alignment = {vertical: 'middle', horizontal: 'right', wrapText: false };
                    for (let j = 1; j <= 16; j++) {
                        r_item.getCell(j).border = {bottom: {style: "thick"}};
                    }
                    worksheet.mergeCells(pos_item,6,pos_item,11);
                    // //console.log('ROW 1---------pos_item : ' + pos_item + '----------pos_mst : ' + pos_mst + '----------pos : ' + pos);
                    //-------------- row 2-----------------
                    pos_item = pos_mst + 2; //row AR REVENUE 
                    r_item = worksheet.getRow(pos_item); 
                    r_item.height = 24.75;
                    r_item.getCell(2).value  =  dt_Data[0].REPORT_TITLE; 
                    for (let j = 2; j <= 15; j++) {
                        r_item.getCell(j).border = {bottom: {style: "thin"}};
                    }
                    r_item.getCell(2).font = { bold:true, italic:false, name: 'Times New Roman', size:16};
                    worksheet.mergeCells(pos_item,2,pos_item,15);
                    r_item.getCell(2).alignment = {vertical: 'middle', horizontal: 'center', wrapText: false };
                    //console.log('ROW 2---------pos_item : ' + pos_item + '----------pos_mst : ' + pos_mst + '----------pos : ' + pos);
                    //-------------- row 3-----------------
                    pos_item = pos_mst + 3;
                    r_item = worksheet.getRow(pos_item); 
                    r_item.height = 36.0;
                    //sign
                    r_item.getCell(2).value  =  "Transaction Approval/ Ký duyệt";
                    r_item.getCell(2).font = { bold:true, italic:false, name: 'Times New Roman', size:16};
                    r_item.getCell(5).value  =  dt_Data[0].DESCRIPTION;
                    r_item.getCell(6).value  =  dt_Data[0].VAL1;
                    r_item.getCell(8).value  =  dt_Data[0].VAL2;
                    r_item.getCell(10).value  =  dt_Data[0].VAL3;
                    r_item.getCell(12).value  =  dt_Data[0].VAL4;
                    r_item.getCell(14).value  =  dt_Data[0].VAL5; 
                    //row 4&5
                    worksheet.mergeCells(pos_item+1,14,pos_item+2,15);
                    worksheet.mergeCells(pos_item+1,12,pos_item+2,13);
                    worksheet.mergeCells(pos_item+1,10,pos_item+2,11);
                    worksheet.mergeCells(pos_item+1,8,pos_item+2,9);
                    worksheet.mergeCells(pos_item+1,6,pos_item+2,7);
                    worksheet.mergeCells(pos_item+1,5,pos_item+2,5);
 
                    //row 3
                    worksheet.mergeCells(pos_item,14,pos_item,15);
                    worksheet.mergeCells(pos_item,12,pos_item,13);
                    worksheet.mergeCells(pos_item,10,pos_item,11);
                    worksheet.mergeCells(pos_item,8,pos_item,9);
                    worksheet.mergeCells(pos_item,6,pos_item,7);
                    worksheet.mergeCells(pos_item,5,pos_item,5);
                    worksheet.mergeCells(pos_item,2,pos_item+2,4);
                    for (let j = 2; j <= 15; j++) {
                        worksheet.getCell(pos_item, j).alignment = {vertical: 'middle', horizontal: 'center', wrapText: true };
                        worksheet.getCell(pos_item, j).font = { bold:true, italic:false, name: 'Times New Roman', size:10};
                    }
                    
                    //console.log('ROW 3---------pos_item : ' + pos_item + '----------pos_mst : ' + pos_mst + '----------pos : ' + pos);
                    //-------------- row 6-----------------
                    pos_item = pos_mst + 6;
                    r_item = worksheet.getRow(pos_item); 
                    r_item.height = 9.75;
                    for (let j = 2; j <= 15; j++) {
                        r_item.getCell(j).border = {left: {style: "thin"}, right: {style: "thin"},bottom: {style: "thin"}};
                    }
                    r_item.getCell(16).border = {left: {style: "thin"}};
                    // worksheet.mergeCells(pos_item,2,pos_item,15);

                    //console.log('ROW 6---------pos_item : ' + pos_item + '----------pos_mst : ' + pos_mst + '----------pos : ' + pos);
                    //-------------- row 7-----------------
                    pos_item = pos_mst + 7;
                    r_item = worksheet.getRow(pos_item);
                    r_item.height = 24.75;
                    r_item.getCell(2).value  =  "Company/Tên công ty:";
                    r_item.getCell(6).value  =  "Voucher No / (Seq)/Số chứng từ:";
                    r_item.getCell(4).value  =  dt_Data[0].BIZ_NM;//_COMP_NM;
                    r_item.getCell(10).value  =  dt_Data[0].VOUCHERNO +"("+ dt_Data[0].SEQ + ")";
                    

                    //console.log('ROW 7---------pos_item : ' + pos_item + '----------pos_mst : ' + pos_mst + '----------pos : ' + pos);
                    //-------------- row 8-----------------
                    pos_item = pos_mst + 8;
                    r_item = worksheet.getRow(pos_item);
                    r_item.height = 24.75;
                    r_item.getCell(2).value  =  "Department/ Bộ phận:";
                    r_item.getCell(6).value  =  "Date/ Ngày:";
                    r_item.getCell(4).value  =  dt_Data[0].DEPT_NAME;
                    r_item.getCell(10).value  =  dt_Data[0].TRANS_DATE;
                    //-------------- row 9-----------------
                    pos_item = pos_mst + 9;
                    r_item = worksheet.getRow(pos_item);
                    r_item.height = 9.75;

                    pos_item = pos_mst + 10;
                    r_item = worksheet.getRow(pos_item);
                    r_item.height = 23.25;
                    r_item.getCell(2).value  =  "Amount/ Số tiền";
                    r_item.getCell(6).value  =  "Proposed By/Người lập";
                    r_item.getCell(4).value  =  dt_Data[0].BOOK_AMT;
                    r_item.getCell(10).value =  dt_Data[0].PRO_BY;

                    pos_item = pos_mst + 11;
                    r_item = worksheet.getRow(pos_item);
                    r_item.height = 23.25;
                    r_item.getCell(2).value  =  "Booking Currency/ Tiền ghi sổ";
                    r_item.getCell(6).value  =  "Approved Date/Ngày duyệt";
                    r_item.getCell(4).value  =  item.P_BOOK_CCY;
                    r_item.getCell(10).value  =  dt_Data[0].SIGN_DATE;

                    pos_item = pos_mst + 12;
                    r_item = worksheet.getRow(pos_item);
                    r_item.height = 26.25;
                    r_item.getCell(2).value  =  "Exchange Rate/ Tỷ giá";
                    r_item.getCell(6).value  =  "Approved By/Người duyệt";
                    r_item.getCell(4).value  =  dt_Data[0].EX_BOOKRATE;
                    r_item.getCell(10).value  =  dt_Data[0].APP_BY;

                    pos_item = pos_mst + 13;
                    r_item = worksheet.getRow(pos_item);
                    r_item.height = 26.25;
                    r_item.getCell(2).value  =  "Transaction Code/Mã nghiệp vụ";
                    r_item.getCell(6).value  =  "Transaction Name/Tên nghiệp vụ";
                    r_item.getCell(4).value  =  dt_Data[0].TR_TYPE;
                    r_item.getCell(10).value  =  dt_Data[0].TR_TPNM; 

                    pos_item = pos_mst + 14;
                    r_item = worksheet.getRow(pos_item);
                    r_item.height = 26.25;
                    r_item.getCell(2).value  =  "Description/Diễn giải";
                    r_item.getCell(6).value  =  "Local Description/Diễn giải:";
                    r_item.getCell(4).value  =  dt_Data[0].REMARK;
                    r_item.getCell(10).value  =  dt_Data[0].REMARK2;
                    for(let l_merge = pos_mst + 6; l_merge < pos_mst + 15; l_merge++){
                        for(let j_fm = 1; j_fm < 16; j_fm++){
                            worksheet.getCell(l_merge,j_fm).alignment = {vertical: 'middle', horizontal: 'center', wrapText: true };
                        }
                        worksheet.getCell(l_merge,2).font = { bold:false, italic:false, name: 'Times New Roman', size:10};
                        worksheet.getCell(l_merge,4).font = { bold:true, italic:false, name: 'Times New Roman', size:10};
                        worksheet.getCell(l_merge,6).font = { bold:false, italic:false, name: 'Times New Roman', size:10};
                        worksheet.getCell(l_merge,10).font = { bold:true, italic:false, name: 'Times New Roman', size:10};
                        worksheet.mergeCells(l_merge,10,l_merge,15);
                        worksheet.mergeCells(l_merge,6,l_merge,9);
                        worksheet.mergeCells(l_merge,4,l_merge,5);
                        worksheet.mergeCells(l_merge,2,l_merge,3);
                    }

                    pos_item = pos_mst + 15;
                    r_item = worksheet.getRow(pos_item);
                    r_item.height = 26.25;
                    r_item.getCell(2).value  =  "Enclose/Chứng từ đính kèm";
                    r_item.getCell(4).value  =  dt_Data[0].TR_ENCLOSE; 
                    worksheet.mergeCells(pos_item,5,pos_item,15);

                    //console.log('ROW 8-> ROW 15---------pos_item : ' + pos_item + '----------pos_mst : ' + pos_mst + '----------pos : ' + pos);
                    //console.log('2---------pos_item : ' + pos_item + '----------pos_mst : ' + pos_mst + '----------pos : ' + pos);

                    
                    if(p_language == 'KOR') 
                    {
                        worksheet.getCell("F1").value = "전표 승인번호:"; //Voucher Approval No :	 
                        worksheet.getCell("B2").value = "매출채권";//ACCOUNTING SLIP/PHIẾU KẾ TOÁN													
                        worksheet.getCell("B3").value = "거래승인";//"Transaction Approval/  Ký duyệt 
                        worksheet.getCell("E3").value = "일자";//"Date/   Ngày  
                        worksheet.getCell("F3").value = "담당자";//"Charger/ Người lập 	 
                        worksheet.getCell("H3").value = "확인";//"Check/ Người kiểm 	 
                        worksheet.getCell("J3").value = "회계팀장";//"Chief Acc./  Kế toán trưởng  
                        worksheet.getCell("L3").value = "매니저";//"Manager/ Trưởng phòng 	 
                        worksheet.getCell("N3").value = "부서장";//"Director/  Giám đốc	 
                        worksheet.getCell("B7").value = "사업장";//Company/ Tên công ty:
                        worksheet.getCell("F7").value = "전표번호";//Voucher No / (Seq)/ 
                        worksheet.getCell("B8").value = "부서";//Department/ Bộ phận:
                        worksheet.getCell("F8").value = "일자";//Date/ Ngày:
                        worksheet.getCell("B10").value = "금액";//Amount/ Số tiền
                        worksheet.getCell("F10").value = "제안자";//Proposed By/
                        worksheet.getCell("B11").value = "통화";//Booking Currency/   Tiền ghi sổ
                        worksheet.getCell("F11").value = "승인일자";//Approved Date/
                        worksheet.getCell("B12").value = "환율";//Exchange Rate/ Tỷ giá
                        worksheet.getCell("F12").value = "승인자";//Approved By/
                        worksheet.getCell("B13").value = "거래코드";//Transaction Code/
                        worksheet.getCell("F13").value = "거래유형";//Transaction Name/
                        worksheet.getCell("B14").value = "비고";//Description/
                        worksheet.getCell("F14").value = "현지 비고";//Local Description/
                        worksheet.getCell("B15").value = "첨부문서";//Enclose/
                        worksheet.getCell("B17").value = "거래유형";//TRANSACTION DETAILS/ CHI TIẾT
                        worksheet.getCell("B18").value = "계정코드";//Account/ Tên TK
                        worksheet.getCell("D18").value = "비고";//Description/
                        worksheet.getCell("F18").value = "관리항목";//Control Items/ Ghi chú
                        worksheet.getCell("J18").value = "차변";//Debit/ Nợ
                        worksheet.getCell("M18").value = "대변";//Credit/ Có
                        worksheet.getCell("B21").value = "총계";//Total/ Tổng cộng
                        worksheet.getCell("F24").value = "차변";//Debit
                        worksheet.getCell("I24").value = "대변";//Credit
                        worksheet.name = "매출채권";
                    }
                    pos_item = pos_mst + 16;
                    r_item = worksheet.getRow(pos_item);
                    r_item.getCell(2).value  =  "TRANSACTION DETAILS/ CHI TIẾT";
                    worksheet.mergeCells(pos_item,2,pos_item,15);
                    r_item.getCell(2).alignment = {vertical: 'middle', horizontal: 'center'};
                    r_item.getCell(2).font = { bold:true, italic:false, name: 'Times New Roman', size:11};

                    pos_item = pos_mst + 17;
                    r_item = worksheet.getRow(pos_item);
                    r_item.getCell(2).value  =  "Account/ Tên TK";
                    r_item.getCell(4).value  =  "Description/ Diễn giải";
                    r_item.getCell(6).value  =  "Control Items/ Ghi chú";
                    r_item.getCell(10).value  =  "Debit/ Nợ";
                    r_item.getCell(13).value  =  "Credit/ Có";
                    //console.log('ROW 16---------pos_item : ' + pos_item + '----------pos_mst : ' + pos_mst + '----------pos : ' + pos);

                    for(let j = 1; j < 16; j++){
                        r_item.getCell(j).alignment = {vertical: 'middle', horizontal: 'center', wrapText: true };
                        r_item.getCell(j).font = { bold:true, italic:false, name: 'Times New Roman', size:10};
                    }
                    worksheet.mergeCells(pos_item,13,pos_item+1,15);
                    worksheet.mergeCells(pos_item,10,pos_item+1,12);
                    worksheet.mergeCells(pos_item,6,pos_item+1,9);
                    worksheet.mergeCells(pos_item,4,pos_item+1,5);
                    worksheet.mergeCells(pos_item,2,pos_item+1,3);



                    pos_item = pos_mst + 18;
                    r_item = worksheet.getRow(pos_item);

                    pos = pos_item + 1; 
                    //console.log('3---------pos_item : ' + pos_item + '----------pos_mst : ' + pos_mst + '----------pos : ' + pos);
                    var copy_row = ((dt_Data.length-1)*4)+2;
                    if(dt_Data.length>1)
                    {
                        // worksheet.duplicateRow(pos+1,copy_row,true);
                        Utils.excelInsertRows(worksheet, pos+1,copy_row);  
                    }   
                    for (var i = 0; i < dt_Data.length; i++) 
                    {
                        r_item = worksheet.getRow(pos);   
                        worksheet.mergeCells(pos,2,pos,3);
                        r_item.getCell(2).value = dt_Data[i].ACCD; 
                        worksheet.mergeCells(pos,4,pos+1,5);
                        r_item.getCell(4).value = dt_Data[i].REMARK;  
                        
                        worksheet.mergeCells(pos,6,pos+3,9);
                        r_item.getCell(6).value = dt_Data[i].ITEM_CTRL;  
                        worksheet.mergeCells(pos,10,pos+3,12);
                        r_item.getCell(10).value = dt_Data[i].DEBIT_AMT; 
                        worksheet.mergeCells(pos,13,pos+3,15);  
                        r_item.getCell(13).value = dt_Data[i].CREDIT_AMT;  

                        r_item = worksheet.getRow(pos+1);   
                        worksheet.mergeCells(pos+1,2,pos+3,3);
                        r_item.getCell(2).value = dt_Data[i].ACNM; 

                        r_item = worksheet.getRow(pos+2);   
                        worksheet.mergeCells(pos+2,4,pos+3,5);
                        r_item.getCell(4).value = dt_Data[i].REMARK2; 
                        
                        worksheet.getCell(pos,2).border = {right: {style:'thin'},left: {style:'thin'}};
                        worksheet.getCell(pos+1,2).border = {right: {style:'thin'},left: {style:'thin'}, bottom: {style:'thin'} };


                        worksheet.getCell(pos,4).border = {right: {style:'thin'},left: {style:'thin'}};
                        worksheet.getCell(pos+2,4).border = {right: {style:'thin'},left: {style:'thin'}, bottom: {style:'thin'}};
                        worksheet.getCell(pos,4).alignment = {vertical: 'top', horizontal: 'left', wrapText: true};
                        worksheet.getCell(pos+2,4).alignment = {vertical: 'top', horizontal: 'left', wrapText: true};
                        worksheet.getCell(pos,4).font = { bold:false, italic:false, name: 'Times New Roman', size:8};
                        worksheet.getCell(pos+2,4).font = { bold:false, italic:false, name: 'Times New Roman', size:8};

                        worksheet.getCell(pos,6).border = {right: {style:'thin'},left: {style:'thin'}, bottom: {style:'thin'}}; 
                        worksheet.getCell(pos,6).alignment = {vertical: 'middle', horizontal: 'left', wrapText: true};
                        worksheet.getCell(pos,6).font = { bold:false, italic:false, name: 'Times New Roman', size:8};

                        worksheet.getCell(pos,10).border = {right: {style:'thin'},left: {style:'thin'}, bottom: {style:'thin'}}; 
                        worksheet.getCell(pos,13).border = {right: {style:'thin'},left: {style:'thin'}, bottom: {style:'thin'}}; 

                        if(dt_Data.length > 4){
                            r_item.height = 28;
                        }

                        pos += 4;
                    
                    }    
                    //console.log('ROW 18---------pos_item : ' + pos_item + '----------pos_mst : ' + pos_mst + '----------pos : ' + pos);
                    //console.log('3---------pos_item : ' + pos_item + '----------pos_mst : ' + pos_mst + '----------pos : ' + pos);
                    // total
                    r_item = worksheet.getRow(pos);
                    r_item.getCell(2).value  =  "Total/Tổng cộng";
                    r_item.getCell(2).alignment = {vertical: 'middle', horizontal: 'center', wrapText: false };
                    
                    worksheet.mergeCells(pos,2,pos,9); 
                    worksheet.mergeCells(pos,10,pos,12); 
                    r_item.getCell(10).value = dt_Data[0].SUM_DEBIT;
                    r_item.getCell(10).font = { bold:true, italic:false, name: 'Times New Roman', size:11};
                    worksheet.mergeCells(pos,13,pos,15);    
                    r_item.getCell(13).value = dt_Data[0].SUM_CREDIT;  
                    r_item.getCell(13).font = { bold:true, italic:false, name: 'Times New Roman', size:11};
             
                    pos += 1;
                    r_item = worksheet.getRow(pos);
                    
                    //vẽ khung viền
                    for (let j = 1; j <= 16; j++) {
                        r_item.getCell(j).border = {bottom: {style:'thin'} };
                    }
                    //console.log('vẽ---------pos_mst : ' +pos_mst +'--------pos_item : ' + pos_item + '----pos : ' + pos)
                    for(let l_vien = pos_mst+2; l_vien < pos; l_vien++){
                        for (let j = 2; j <= 15; j++) {
                            worksheet.getCell(l_vien,j).border = {right: {style:'thin'},left: {style:'thin'},top: {style:'thin'}, bottom: {style:'thin'} };
                        }
                        worksheet.getCell(l_vien,1).border = {left: {style:'thick'}};
                        worksheet.getCell(l_vien,16).border = {right: {style:'thick'}};
                    }
                    r_item = worksheet.getRow(pos);
                    for (let j = 1; j <= 16; j++) {
                        r_item.getCell(j).border = {bottom: {style: "thick"},right: {style: "thick"}, left: {style:'thick'}};
                    }
                    worksheet.mergeCells(pos,1,pos,16);    
                    
                    //trans ccy
                    pos += 2;
                    r_item = worksheet.getRow(pos);
                    r_item.getCell(5).value  =  "Trans Currency";
                    r_item.getCell(7).value  =  "Debit";
                    r_item.getCell(10).value  =  "Credit";
                    worksheet.mergeCells(pos,5,pos,6); 
                    worksheet.mergeCells(pos,7,pos,9); 
                    worksheet.mergeCells(pos,10,pos,12);  
                    worksheet.getCell(pos,5).border = {right: {style:'thin'},left: {style:'thin'},top: {style:'thin'},bottom: {style:'thin'}}; 
                    worksheet.getCell(pos,7).border = {right: {style:'thin'},left: {style:'thin'},top: {style:'thin'},bottom: {style:'thin'}}; 
                    worksheet.getCell(pos,10).border = {right: {style:'thin'},left: {style:'thin'},top: {style:'thin'},bottom: {style:'thin'}}; 
                    worksheet.getCell(pos,5).font = { bold:true, italic:false, name: 'Times New Roman', size:10};
                    worksheet.getCell(pos,7).font = { bold:true, italic:false, name: 'Times New Roman', size:10};
                    worksheet.getCell(pos,10).font = { bold:true, italic:false, name: 'Times New Roman', size:10};
                    r_item.getCell(5).alignment = {vertical: 'middle', horizontal: 'center', wrapText: false };
                    r_item.getCell(7).alignment = {vertical: 'middle', horizontal: 'center', wrapText: false };
                    r_item.getCell(10).alignment = {vertical: 'middle', horizontal: 'center', wrapText: false };
                    
                    pos += 1;
                    if(dt_Data_Trans.length>1)
                    {
                        // worksheet.duplicateRow(pos,dt_Data_Trans.length-1,true);
                        Utils.excelInsertRows(worksheet, pos,dt_Data_Trans.length-1);  
                    }   
                    for (var y = 0; y < dt_Data_Trans.length; y++) 
                    {
                        r_item = worksheet.getRow(pos);    
                        r_item.getCell(5).value = dt_Data_Trans[y].CCY; 
                        worksheet.getCell(pos,5).border = {right: {style:'thin'},left: {style:'thin'},top: {style:'thin'},bottom: {style:'thin'}}; 
                        worksheet.getCell(pos,5).font = { bold:true, italic:false, name: 'Times New Roman', size:10};
                        worksheet.getCell(pos,5).alignment = {vertical: 'middle', horizontal: 'right', wrapText: false};
                        worksheet.mergeCells(pos,5,pos,6); 

                        worksheet.mergeCells(pos,7,pos,9); 
                        r_item.getCell(7).value = dt_Data_Trans[y].SUM_DEBIT; 
                        worksheet.getCell(pos,7).border = {right: {style:'thin'},left: {style:'thin'},top: {style:'thin'},bottom: {style:'thin'}};

                        worksheet.mergeCells(pos,10,pos,12);  
                        r_item.getCell(10).value = dt_Data_Trans[y].SUM_CREDIT; 
                        worksheet.getCell(pos,10).border = {right: {style:'thin'},left: {style:'thin'},top: {style:'thin'},bottom: {style:'thin'}}; 
                        pos += 1;
                    }
                    //console.log('pos_mst : ' +pos_mst +'--------pos_item : ' + pos_item + '----pos : ' + pos)
                }
                    /********* Print file excel ********/
                    const reportFile    = Helpers.tmpPath(file_new);
                    await workbook.xlsx.writeFile(reportFile)
                    // await workbook.xlsx.writeFile(reportFile); 
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
    async rpt_6030010_JOURNAL_VOUCHER({ request, response, auth }) {
        try 
        { 
          /*P_RPT_ID: report_info.VAL1, P_RPT_FILE: report_info.VAL2,
            P_COMPANY: this.sel_Company, P_DT_MONTH: this.dt_mmyy, P_VAT_TYPE: this.sel_VatType, P_TAX_RATE: this.sel_TaxRate, 
            P_CURRENT_CCY: this.sel_Ccy, P_STATUS: this.sel_Status, P_CUST_PK: this.txt_Customer_PK, P_INVOICE_NO: this.txt_InvoiceNo,
            P_AC_CD: this.txt_ACC_CD, P_SEQ: this.txt_Seq, P_VOUCHER_NO: this.sel_VoucherType, P_BALANCE: this.sel_Banlance,
            P_DT_FR: this.dt_from, P_DT_TO: this.dt_to, P_BIZ: this.sel_Bizpalce*/
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
            var _store          = "AC_RPT_6030010_JOURNAL_VOUCHER";
            var _param          = [ item.P_COMPANY, item.P_SEQ,  item.P_BOOK_CCY, "DATA"];
             /***************************** Return failded ****************************/
            if (!user) 
            {
                return response.send(Utils.response(false, "Request failed!", null));
            } 
            /****************************** Begin call store and write excell *********/
            else 
            { 
                // /********* Call store  ***************/ 
                var dt_Data  = await DBService.callProcCursor(_store, _param, p_language, p_crt_by);  
                _param          = [ item.P_COMPANY, item.P_SEQ,  item.P_BOOK_CCY, "TOTAL"];
                 var dt_Data_Trans  = await DBService.callProcCursor(_store, _param, p_language, p_crt_by);  
                 if (dt_Data.length >0) 
                {
                    dt_Data = dt_Data;
                } 
                else 
                { 
                    return response.send(Utils.response(false, "no_data_found", null))
                } 
                if (dt_Data_Trans.length >0) 
                {
                    dt_Data_Trans = dt_Data_Trans;
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
                /*===========================================================*/
                    var pos = 5;
                    var r_item = worksheet.getRow(pos);  
                /*===========================================================*/
                worksheet.getRow(1).height = 6;
                worksheet.getRow(2).height = 12;
                worksheet.getRow(3).height = 6; 
                worksheet.getRow(4).height = 6;
                worksheet.getRow(5).height = 15;
                worksheet.getRow(6).height = 15;
                worksheet.getRow(7).height = 15;
                worksheet.getRow(8).height = 15;
                worksheet.getRow(9).height = 15;
                worksheet.getRow(10).height = 20;
                worksheet.getRow(11).height = 10;
                worksheet.getRow(12).height = 6;
                worksheet.getRow(13).height = 20;
                worksheet.getRow(14).height = 6;

                // pos = 4;
                // r_item = worksheet.getRow(pos);
                // r_item.height = 6;

                // pos = 12;
                // r_item = worksheet.getRow(pos);
                // r_item.height = 6;

                // pos = 14;
                // r_item = worksheet.getRow(pos);
                // r_item.height = 6; 



                /*========================================================*/
                r_item = worksheet.getRow(2);
                r_item.getCell(1).value = dt_Data[0].REPORT_TITLE_ROW2;

                r_item = worksheet.getRow(5);
                r_item.getCell(2).value = dt_Data[0].BIZ_NM_ROW5;

                r_item = worksheet.getRow(6);
                r_item.getCell(2).value = dt_Data[0].STAFF_NM_ROW6;
                r_item.getCell(5).value = dt_Data[0].POST_DATE_ROW6;

                r_item = worksheet.getRow(7);
                r_item.getCell(2).value = dt_Data[0].JOURNAL_NM_ROW7;
                r_item.getCell(5).value = dt_Data[0].USER_NM_ROW7;

                r_item = worksheet.getRow(8);
                r_item.getCell(2).value = dt_Data[0].DOC_VOU_ROW8;
                r_item.getCell(3).value = dt_Data[0].DOC_SEQ_ROW8;
                r_item.getCell(5).value = dt_Data[0].FYEAR_ROW8;

                r_item = worksheet.getRow(9);
                r_item.getCell(2).value = dt_Data[0].DOC_DATE_ROW9;
                r_item.getCell(5).value = dt_Data[0].DOC_CCY_ROW9;
                r_item.getCell(6).value = dt_Data[0].COL_ROW9

                r_item = worksheet.getRow(10);
                r_item.getCell(2).value = dt_Data[0].REMARK_ROW10;
                /*========================================================*/
                for(let j=1;j<=14;j++)
                { 
                   r_item = worksheet.getRow(13); 
                   r_item.getCell(j).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "EEEEEE" } }; 
                }
                var length = 5*(dt_Data.length);
                Utils.excelInsertRows(worksheet, 15, length); 
                pos = 15;
                var breakPage = true, nextkPage = 0;
                for (var i = 0; i <= dt_Data.length; i++) 
                {
                    r_item = worksheet.getRow(pos-1); 
                    // r_item.height = 6;
                    r_item.height = 8;
                    worksheet.mergeCells(pos-1,1,pos-1,14); 
                    nextkPage = nextkPage +1;
                    if(i<dt_Data.length)
                    {
                        var itemData = dt_Data[i];
                       
                        // column NO col 1; pos; pos+3
                        worksheet.mergeCells(pos,1,pos+3,1);
                        worksheet.getCell(pos,1).border = {right: {style:'thin'},left: {style:'thin'}, bottom: {style:'thin'}, top: {style:'thin'} };
                        r_item = worksheet.getRow(pos); 
                        r_item.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };  
                        r_item.getCell(1).numFmt = '000';
                        // r_item.getCell(1).value = i+1;//itemData.NUM; 
                        r_item.getCell(1).value = itemData.COLNM;
                    

                        //column COA col 2,3,4; pos; pos+3
                        worksheet.mergeCells(pos  ,2,pos+1,2);// null val 
                        worksheet.getCell(pos,2).border = {right: {style:'thin'},left: {style:'thin'},top: {style:'thin'} };
                         

                        worksheet.mergeCells(pos+2,2,pos+3,4);//account cd <br/>  account nm 
                        worksheet.getCell(pos+2,2).border = {right: {style:'thin'},left: {style:'thin'}, bottom: {style:'thin'}};    
                        r_item = worksheet.getRow(pos+2);
                        r_item.getCell(2).alignment = { vertical: 'middle', horizontal: 'left', wrapText: true }; 
                        r_item.getCell(2).value = itemData.COA;
                     

                        // //column DEBIT  col 3; pos; pos+1 not merge 
                        r_item = worksheet.getRow(pos); 
                        r_item.getCell(3).value = itemData.DEBIT_TRANS;
                        // r_item.getCell(3).numFmt = '#,##0.00';
                        worksheet.getCell(pos,3).border = {right: {style:'thin'},left: {style:'thin'},  top: {style:'thin'} }; 
                        r_item.getCell(3).alignment = { vertical: 'bottom', horizontal: 'right' }; 
                       

                        r_item = worksheet.getRow(pos+1);
                        r_item.getCell(3).value = itemData.DEBIT_BOOK;
                        // r_item.getCell(3).numFmt = '#,##0.00';
                        worksheet.getCell(pos+1,3).border = {right: {style:'thin'},left: {style:'thin'},  bottom: {style:'thin'} }; 
                        r_item.getCell(3).alignment = { vertical: 'middle', horizontal: 'right' }; 
                      

                        ////column credit col 4; pos; pos+1 not merge
                        r_item = worksheet.getRow(pos);
                        r_item.getCell(4).value = itemData.CREDIT_TRANS;
                        // r_item.getCell(4).numFmt = '#,##0.00';
                        worksheet.getCell(pos,4).border = {right: {style:'thin'},left: {style:'thin'},  top: {style:'thin'} }; 
                        r_item.getCell(4).alignment = { vertical: 'bottom', horizontal: 'right' }; 
                    

                        r_item = worksheet.getRow(pos+1);
                        r_item.getCell(4).value = itemData.CREDIT_BOOK;
                        // r_item.getCell(4).numFmt = '#,##0.00';
                        worksheet.getCell(pos+1,4).border = {right: {style:'thin'},left: {style:'thin'},  bottom: {style:'thin'} }; 
                        r_item.getCell(4).alignment = { vertical: 'middle', horizontal: 'right' };  

                        ////column content col 5; pos ; pos +3
                        worksheet.mergeCells(pos  ,5 ,pos+3,5 );// column ccy; col 5; pos ; pos +3;     
                        r_item = worksheet.getRow(pos);
                        r_item.getCell(5).value = itemData.CCY;
                        worksheet.getCell(pos,5).border = {right: {style:'thin'},left: {style:'thin'}, bottom: {style:'thin'}, top: {style:'thin'} };
                        r_item.getCell(5).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true  };  
                        
                        // column description - description local; col 6 - 14; pos;  
                        worksheet.mergeCells(pos  ,6 ,pos  ,10); 
                        worksheet.mergeCells(pos  ,11 ,pos  ,14);  


                        r_item = worksheet.getRow(pos);
                        r_item.height = 24; 
                        // r_item.height = 24; 
                        r_item.getCell(6).value = itemData.REMARK; 
                        r_item.getCell(11).value = itemData.REMARK2; 

                        worksheet.getCell(pos,6).border = {right: {style:'thin'},left: {style:'thin'}, bottom: {style:'thin'}, top: {style:'thin'} };
                        r_item.getCell(6).alignment = { vertical: 'top', horizontal: 'left', wrapText: true  };  
                        r_item.getCell(6).font = {size: 8}  
                        worksheet.getCell(pos,11).border = {right: {style:'thin'},left: {style:'thin'}, bottom: {style:'thin'}, top: {style:'thin'} };
                        r_item.getCell(11).alignment = { vertical: 'top', horizontal: 'left', wrapText: true  };  
                        r_item.getCell(11).font = {size: 8} 

                        // column partner nm; col 6 - 9; pos + 1; 
                        worksheet.mergeCells(pos+1,6 ,pos+1,9 );  
                        r_item = worksheet.getRow(pos+1);  
                        r_item.getCell(6).value = itemData.PARTNER_NAME;
                        worksheet.getCell(pos+1,6).border = {right: {style:'thin'},left: {style:'thin'}, bottom: {style:'thin'}, top: {style:'thin'} };
                        r_item.getCell(6).alignment = { vertical: 'middle', horizontal: 'left', shrinkToFit:true }; 
                        r_item.height = 20; 
                                 
                        // column partner cd; col 10; pos + 1;  not merge 
                        r_item = worksheet.getRow(pos+1);
                        r_item.getCell(10).value = itemData.PARTNER_ID;
                        worksheet.getCell(pos+1,10).border = {right: {style:'thin'},left: {style:'thin'}, bottom: {style:'thin'}, top: {style:'thin'} };
                        r_item.getCell(10).alignment = { vertical: 'middle', horizontal: 'center', shrinkToFit:true  };  
                        r_item.height = 20; 

                        // column invoice; col 11 - 12; pos +1;
                        worksheet.mergeCells(pos+1,11,pos+1,12);  
                        r_item = worksheet.getRow(pos+1); 
                        r_item.getCell(11).value = itemData.INVOICE;
                        worksheet.getCell(pos+1,11).border = {right: {style:'thin'},left: {style:'thin'}, bottom: {style:'thin'}, top: {style:'thin'} };
                        r_item.getCell(11).alignment = { vertical: 'middle', horizontal: 'center', shrinkToFit:true  };  
                        r_item.height = 20; 

                        // column ex rate; col 13 - 14; pos +1; 
                        worksheet.mergeCells(pos+1,13,pos+1,14); 
                        r_item = worksheet.getRow(pos+1); 
                        r_item.getCell(13).value = itemData.EXRATE;
                        worksheet.getCell(pos+1,13).border = {right: {style:'thin'},left: {style:'thin'}, bottom: {style:'thin'}, top: {style:'thin'} };
                        r_item.getCell(13).alignment = { vertical: 'middle', horizontal: 'right'  };  
                        r_item.height = 20; 

                        // column bank; col 6 - 9; pos +2;
                        worksheet.mergeCells(pos+2,6 ,pos+2,9 ); 
                        r_item = worksheet.getRow(pos+2);
                        r_item.getCell(6).value = itemData.BANK;
                        worksheet.getCell(pos+2,6).border = {right: {style:'thin'},left: {style:'thin'}, bottom: {style:'thin'}, top: {style:'thin'} };
                        r_item.getCell(6).alignment = { vertical: 'middle', horizontal: 'left', shrinkToFit:true  };  
                        r_item.height = 20; 

                        // column PL; col 10 - 11; pos +2;
                        worksheet.mergeCells(pos+2,10,pos+2,11); 
                        r_item = worksheet.getRow(pos+2);
                        r_item.getCell(10).value = itemData.BANK_ID;
                        worksheet.getCell(pos+2,10).border = {right: {style:'thin'},left: {style:'thin'}, bottom: {style:'thin'}, top: {style:'thin'} };
                        r_item.getCell(10).alignment = { vertical: 'middle', horizontal: 'left' , shrinkToFit:true }; 
                        r_item.height = 20; 

                        // column Content; col 10 - 11; pos +2;
                        worksheet.mergeCells(pos+2,12,pos+2,14);
                        r_item = worksheet.getRow(pos+2);
                        r_item.getCell(12).value = itemData.PRODUCT_ITEM;
                        worksheet.getCell(pos+2,12).border = {right: {style:'thin'},left: {style:'thin'}, bottom: {style:'thin'}, top: {style:'thin'} };
                        r_item.getCell(12).alignment = { vertical: 'middle', horizontal: 'left', shrinkToFit:true  };  
                        r_item.height = 20; 

                        // column PL; col 6 - 14; pos +3;
                        worksheet.mergeCells(pos+3,6,pos+3,9); 
                        worksheet.mergeCells(pos+3,10,pos+3,14); 
                        r_item = worksheet.getRow(pos+3); 
                        r_item.getCell(6).value = itemData.PL;
                        r_item.getCell(10).value = itemData.PAYMENT_TERM; 
                        worksheet.getCell(pos+3,6).border = {left: {style:'thin'}, bottom: {style:'thin'}, top: {style:'thin'}, right: {style:'thin'}};
                        r_item.getCell(6).alignment = { vertical: 'middle', horizontal: 'left', shrinkToFit:true  };  
                        worksheet.getCell(pos+3,10).border = {right: {style:'thin'}, bottom: {style:'thin'}, top: {style:'thin'} };
                        r_item.getCell(10).alignment = { vertical: 'middle', horizontal: 'left', shrinkToFit:true  };  
                        r_item.height = 20; 

                        // if(i!=0 && dt_Data[i-1].PAGE_NUM != dt_Data[i].PAGE_NUM)
                        // {
                        //     r_item = worksheet.getRow(pos+4);
                        //     r_item.addPageBreak();
                        // }
                        if(dt_Data[i].NUM == 5)
                        {
                            r_item = worksheet.getRow(pos+4);
                            r_item.addPageBreak();
                            nextkPage = 0;
                        }
                        if(dt_Data[i].NUM > 5 && nextkPage == 6)
                        {
                            r_item = worksheet.getRow(pos+4);
                            r_item.addPageBreak();
                            nextkPage = 0;
                        }
                        
                    }
                    else{

                        r_item = worksheet.getRow(pos); //20
                        r_item.height = 15; 
                        r_item = worksheet.getRow(pos+1); //20
                        r_item.height = 15; 
                        r_item = worksheet.getRow(pos+2); //20
                        r_item.height = 15; 
                        r_item = worksheet.getRow(pos+3); //20
                        r_item.height = 15; 
                        worksheet.mergeCells(pos,1,pos+3,1); // null
                        
                        worksheet.mergeCells(pos,2,pos+3,2); // Tổng
                        r_item = worksheet.getRow(pos); 
                        r_item.getCell(2).alignment = { vertical: 'middle', horizontal: 'left' };  
                        r_item.getCell(2).value = "**Total/ Tổng:";

                        worksheet.mergeCells(pos,3,pos+3,3); // DEBIT
                        worksheet.mergeCells(pos,4,pos+3,4); // CREDIT
                        worksheet.mergeCells(pos,5,pos+3,5); // CREDIT
                      
 
                        worksheet.mergeCells(pos,6,pos+3,8); // Signature:
                        r_item = worksheet.getRow(pos);
                        r_item.getCell(6).alignment = { vertical: 'middle', horizontal: 'left' };  
                        r_item.getCell(6).value = "Signature:";

                        worksheet.mergeCells(pos,9,pos+3,14); // Remark:
                        r_item = worksheet.getRow(pos);
                        r_item.getCell(9).alignment = { vertical: 'middle', horizontal: 'left' };  
                        r_item.getCell(9).value = "Remark:"; 

                        for(let j=1;j<=14;j++)
                        { 
                             worksheet.getCell(pos-1,j).border = {bottom: {style:'thin'}};
                             worksheet.getCell(pos  ,j).border = {right: {style:'thin'},left: {style:'thin'} };
                             worksheet.getCell(pos+1,j).border = {right: {style:'thin'},left: {style:'thin'} }; 
                             worksheet.getCell(pos+2,j).border = {right: {style:'thin'},left: {style:'thin'} }; 
                             worksheet.getCell(pos+3,j).border = {right: {style:'thin'},left: {style:'thin'}, bottom: {style:'thin'}};  
                             worksheet.getCell(pos+4,j).border = {top: {style:'thin'}};
                            r_item = worksheet.getRow(pos);
                            r_item.getCell(j).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "EEEEEE" } };  
                        }
                         var sCcy = '', sDebit = '', sCredit = '';
                        for (var s = 0; s < dt_Data_Trans.length; s++) 
                        {
                              
                            sCcy    += dt_Data_Trans[s].CCY;  
                            sDebit += dt_Data_Trans[s].SUM_DEBIT;  
                            sCredit+= dt_Data_Trans[s].SUM_CREDIT;  
                             
                        }
                        r_item = worksheet.getRow(pos);    
                        r_item.getCell(3).alignment = { vertical: 'middle', horizontal: 'right' , wrapText: true };  
                        r_item.getCell(4).alignment = { vertical: 'middle', horizontal: 'right' , wrapText: true };  
                        r_item.getCell(5).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true  };  
                        r_item.getCell(3).value = sDebit;// debit
                        r_item.getCell(4).value = sCredit;// credit
                        r_item.getCell(5).value = sCcy;// ccy

                    }  
                    // nextkPage +=1;
                    // if((nextkPage == 5 && dt_Data.length > 6) || (nextkPage == 4 && dt_Data.length == 6))
                    // {
                    //     r_item = worksheet.getRow(pos+4);
                    //     r_item.addPageBreak();
                    //     breakPage = false;
                    //     nextkPage = 0;
                    // } 
                    pos += 5;
                   
                }     
                /********* Print file excel ********/
                /********* Print file excel ********/
                const reportFile    = Helpers.tmpPath(file_new);
               
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

                // const reportFile    = Helpers.tmpPath(file_new);
                // await workbook.xlsx.writeFile(reportFile)
                // return response.attachment( reportFile, file_new);
            }
        } 
        catch (e) 
        {
            return response.send(Utils.response(false, e.message, null))
        }
    }  
    
    async rpt_6030010_ACC_SLIP_V2({ request, response, auth }) {
        try 
        { /****************************** Get Param *********************************/
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
            var P_FILE_TYPE     = item.P_FILE_TYPE?item.P_FILE_TYPE:'.xlsx';
            var _store          = "AC_RPT_6030010_ACC_SLIP_V2";
             /***************************** Return failded ****************************/
            if (!user) {return response.send(Utils.response(false, "Request failed!", null));
            } 
            /****************************** Begin call store and write excell *********/
            else 
            { 
                /********* Call store  ***************/ 
                var list_seq = [];
                //TH khác form 6030020
                let count_seq = item.P_SEQ_COUNT > 0 ? item.P_SEQ_COUNT : 0; 
                if((item.P_SEQ_COUNT === undefined) || (item.P_SEQ_COUNT === 'undefined') || (count_seq === 0)){
                    //Set count_seq để chạy mảng for
                    count_seq = 1;
                    list_seq += item.P_SEQ + ',';
                }
                else{
                    count_seq = item.P_SEQ_COUNT;
                    list_seq = item.P_SEQ_GRD;
                }
                let l_seq = list_seq.split(',');
                let pos_mst = 0;
                let pos = 0;
                
                /********* Read file excel ********/ 
                const templateFile  = Helpers.resourcesPath(_resourcesPath); 
                await workbook.xlsx.readFile(templateFile);
                var worksheet       = workbook.getWorksheet(1);
                for(let l_count_seq = 0; l_count_seq < count_seq; l_count_seq++){
                    /********* Write file excel ********/
                    console.log(l_seq[l_count_seq]);
                    var _param         = [ item.P_COMPANY, l_seq[l_count_seq],  item.P_BOOK_CCY, "DATA"];
                    var dt_Data  = await DBService.callProcCursor(_store, _param, p_language, p_crt_by);  
                        _param         = [ item.P_COMPANY, l_seq[l_count_seq],  item.P_BOOK_CCY, "TRANS"];
                    var dt_Data_Trans  = await DBService.callProcCursor(_store, _param, p_language, p_crt_by);  
                    if (dt_Data.length >0) 
                    {
                        dt_Data = dt_Data;
                    } 
                    else 
                    { 
                        return response.send(Utils.response(false, "no_data_found", null))
                    } 
                    if (dt_Data_Trans.length >0) 
                    {
                        dt_Data_Trans = dt_Data_Trans;
                    } 
                    else 
                    { 
                        return response.send(Utils.response(false, "no_data_found", null))
                    } 
                     /*width column*/ 
                    worksheet.getColumn(1).width = 0.6;
                    worksheet.getColumn(2).width = 8.43;
                    worksheet.getColumn(3).width = 10.14;
                    worksheet.getColumn(4).width = 13.0;
                    worksheet.getColumn(5).width  = 10.20;
                    worksheet.getColumn(6).width  = 5.29;
                    worksheet.getColumn(7).width  = 5.29;
                    worksheet.getColumn(8).width  = 5.29;
                    worksheet.getColumn(9).width  = 5.29;
                    worksheet.getColumn(10).width = 5.29;
                    worksheet.getColumn(11).width = 5.29;
                    worksheet.getColumn(12).width = 5.29;
                    worksheet.getColumn(13).width = 5.29;
                    worksheet.getColumn(14).width = 5.29;
                    worksheet.getColumn(15).width = 5.29;
                    worksheet.getColumn(16).width = 0.6;
                    /********* Write file excel ********/
                    /*Set Header */ 
                    let pos_item = 0;
                    if(l_count_seq > 0){
                        pos_mst = pos + 2;
                        var r_break_page = worksheet.getRow(pos_mst);
                        r_break_page.addPageBreak();
                        //console.log('pos_mst---------pos_mst : ' + pos_mst);
                    }
                    //console.log('1---------pos_item : ' + pos_item + '----------pos_mst : ' + pos_mst + '----------pos : ' + pos);
                    //-------------- row 1-----------------
                    pos_item = pos_mst + 1; //row voucher approval no
                    var r_item = worksheet.getRow(pos_item); 
                    r_item.height = 17.25;
                    r_item.getCell(6).value = "Voucher Approval No :";
                    r_item.getCell(6).font = { bold:true, italic:false, name: 'Times New Roman', size:10};
                    r_item.getCell(6).alignment = {vertical: 'middle', horizontal: 'right', wrapText: false };
                    for (let j = 1; j <= 16; j++) {
                        r_item.getCell(j).border = {bottom: {style: "thick"}};
                    }
                    worksheet.mergeCells(pos_item,6,pos_item,11);
                    // //console.log('ROW 1---------pos_item : ' + pos_item + '----------pos_mst : ' + pos_mst + '----------pos : ' + pos);
                    //-------------- row 2-----------------
                    pos_item = pos_mst + 2; //row AR REVENUE 
                    r_item = worksheet.getRow(pos_item); 
                    r_item.height = 24.75;
                    r_item.getCell(2).value  =  dt_Data[0].REPORT_TITLE; 
                    for (let j = 2; j <= 15; j++) {
                        r_item.getCell(j).border = {bottom: {style: "thin"}};
                    }
                    r_item.getCell(2).font = { bold:true, italic:false, name: 'Times New Roman', size:16};
                    worksheet.mergeCells(pos_item,2,pos_item,15);
                    r_item.getCell(2).alignment = {vertical: 'middle', horizontal: 'center', wrapText: false };
                    //console.log('ROW 2---------pos_item : ' + pos_item + '----------pos_mst : ' + pos_mst + '----------pos : ' + pos);
                    //-------------- row 3-----------------
                    pos_item = pos_mst + 3;
                    r_item = worksheet.getRow(pos_item); 
                    r_item.height = 36.0;
                    //sign
                    r_item.getCell(2).value  =  "Department/ Bộ Phận";
                    r_item.getCell(2).font = { bold:true, italic:false, name: 'Times New Roman', size:16};
                    r_item.getCell(5).value  =  dt_Data[0].DESCRIPTION;
                    r_item.getCell(6).value  =  dt_Data[0].VAL1;
                    r_item.getCell(8).value  =  dt_Data[0].VAL2;
                    r_item.getCell(10).value  =  dt_Data[0].VAL3;
                    r_item.getCell(12).value  =  dt_Data[0].VAL4;
                    r_item.getCell(14).value  =  dt_Data[0].VAL5; 
                    //row 3
                    worksheet.mergeCells(pos_item,14,pos_item,15);
                    worksheet.mergeCells(pos_item,12,pos_item,13);
                    worksheet.mergeCells(pos_item,10,pos_item,11);
                    worksheet.mergeCells(pos_item,8,pos_item,9);
                    worksheet.mergeCells(pos_item,6,pos_item,7);
                    worksheet.mergeCells(pos_item,5,pos_item,5);
                    worksheet.mergeCells(pos_item,2,pos_item,4);
                    for (let j = 2; j <= 15; j++) {
                        worksheet.getCell(pos_item, j).alignment = {vertical: 'middle', horizontal: 'center', wrapText: true };
                        worksheet.getCell(pos_item, j).font = { bold:true, italic:false, name: 'Times New Roman', size:10};
                    }
                    //-------------- row 4-----------------
                    pos_item = pos_mst + 4;
                    r_item = worksheet.getRow(pos_item); 
                    r_item.height = 36.0;
                    //sign
                    r_item.getCell(2).value  =  "In Charge";
                    r_item.getCell(2).font = { bold:true, italic:false, name: 'Times New Roman', size:16};
                    //row 4
                    worksheet.mergeCells(pos_item,14,pos_item,15);
                    worksheet.mergeCells(pos_item,12,pos_item,13);
                    worksheet.mergeCells(pos_item,10,pos_item,11);
                    worksheet.mergeCells(pos_item,8,pos_item,9);
                    worksheet.mergeCells(pos_item,6,pos_item,7);
                    worksheet.mergeCells(pos_item,5,pos_item,5);
                    worksheet.mergeCells(pos_item,2,pos_item,4);
                    for (let j = 2; j <= 15; j++) {
                        worksheet.getCell(pos_item, j).alignment = {vertical: 'middle', horizontal: 'center', wrapText: true };
                        worksheet.getCell(pos_item, j).font = { bold:true, italic:false, name: 'Times New Roman', size:10};
                    }
                    //-------------- row 5-----------------
                    pos_item = pos_mst + 5;
                    r_item = worksheet.getRow(pos_item); 
                    r_item.height = 36.0;
                    //sign
                    r_item.getCell(2).value  =  "Managing";
                    r_item.getCell(2).font = { bold:true, italic:false, name: 'Times New Roman', size:16};
                    //row 5
                    worksheet.mergeCells(pos_item,14,pos_item,15);
                    worksheet.mergeCells(pos_item,12,pos_item,13);
                    worksheet.mergeCells(pos_item,10,pos_item,11);
                    worksheet.mergeCells(pos_item,8,pos_item,9);
                    worksheet.mergeCells(pos_item,6,pos_item,7);
                    worksheet.mergeCells(pos_item,5,pos_item,5);
                    worksheet.mergeCells(pos_item,2,pos_item,4);
                    for (let j = 2; j <= 15; j++) {
                        worksheet.getCell(pos_item, j).alignment = {vertical: 'middle', horizontal: 'center', wrapText: true };
                        worksheet.getCell(pos_item, j).font = { bold:true, italic:false, name: 'Times New Roman', size:10};
                    }
                    // /////////////////////////////////////////////////////
                    //-------------- row 6 -----------------
                    pos_item = pos_mst + 6;
                    r_item = worksheet.getRow(pos_item); 
                    r_item.height = 9.75;
                    for (let j = 2; j <= 15; j++) {
                        r_item.getCell(j).border = {left: {style: "thin"}, right: {style: "thin"},bottom: {style: "thin"}};
                    }
                    r_item.getCell(16).border = {left: {style: "thin"}};
                    //-------------- row 7 -----------------
                    pos_item = pos_mst + 7;
                    r_item = worksheet.getRow(pos_item);
                    r_item.height = 24.75;
                    r_item.getCell(2).value  =  "Company/Tên công ty:";
                    r_item.getCell(6).value  =  "Voucher No / (Seq)/Số chứng từ:";
                    r_item.getCell(4).value  =  dt_Data[0].BIZ_NM;//_COMP_NM;
                    r_item.getCell(10).value  =  dt_Data[0].VOUCHERNO +"("+ dt_Data[0].SEQ + ")";
                    //-------------- row 8 -----------------
                    pos_item = pos_mst + 8;
                    r_item = worksheet.getRow(pos_item);
                    r_item.height = 24.75;
                    r_item.getCell(2).value  =  "Department/ Bộ phận:";
                    r_item.getCell(6).value  =  "Date/ Ngày:";
                    r_item.getCell(4).value  =  dt_Data[0].DEPT_NAME;
                    r_item.getCell(10).value  =  dt_Data[0].TRANS_DATE;
                    //-------------- row 9 -----------------
                    pos_item = pos_mst + 9;
                    r_item = worksheet.getRow(pos_item);
                    r_item.height = 40;
                    r_item.getCell(2).value  =  "Description/Diễn giải";
                    r_item.getCell(6).value  =  "Local Description/Diễn giải:";
                    r_item.getCell(4).value  =  dt_Data[0].REMARK;
                    r_item.getCell(10).value  =  dt_Data[0].REMARK2;
                    // //-------------- row 10 -----------------
                    pos_item = pos_mst + 10;
                    r_item = worksheet.getRow(pos_item);
                    r_item.height = 28;
                    r_item.getCell(2).value  =  "Enclose/Chứng từ đính kèm";
                    r_item.getCell(4).value  =  dt_Data[0].TR_ENCLOSE; 
                    worksheet.mergeCells(pos_item,5,pos_item,15);
                        //////////////////////////
                    for(let l_merge = pos_mst + 6; l_merge < pos_mst + 10; l_merge++){
                        for(let j_fm = 1; j_fm < 16; j_fm++){
                            worksheet.getCell(l_merge,j_fm).alignment = {vertical: 'middle', horizontal: 'center', wrapText: true };
                            }
                            worksheet.getCell(l_merge,2).font = { bold:false, italic:false, name: 'Times New Roman', size:10};
                            worksheet.getCell(l_merge,4).font = { bold:true, italic:false, name: 'Times New Roman', size:10};
                            worksheet.getCell(l_merge,6).font = { bold:false, italic:false, name: 'Times New Roman', size:10};
                            worksheet.getCell(l_merge,10).font = { bold:true, italic:false, name: 'Times New Roman', size:10};
                            worksheet.mergeCells(l_merge,10,l_merge,15);
                            worksheet.mergeCells(l_merge,6,l_merge,9);
                            worksheet.mergeCells(l_merge,4,l_merge,5);
                            worksheet.mergeCells(l_merge,2,l_merge,3);
                        }
                    //////////////////////////////////
                    // //-------------- row 11 -----------------
                    pos_item = pos_mst + 11;
                    r_item = worksheet.getRow(pos_item);
                    r_item.getCell(2).value  =  "TRANSACTION DETAILS/ CHI TIẾT";
                    worksheet.mergeCells(pos_item,2,pos_item,15);
                    r_item.getCell(2).alignment = {vertical: 'middle', horizontal: 'center'};
                    r_item.getCell(2).font = { bold:true, italic:false, name: 'Times New Roman', size:11};

                   // //-------------- row 12 -----------------
                   pos_item = pos_mst + 12;
                   r_item = worksheet.getRow(pos_item);
                   r_item.getCell(2).value  =  "Account/ Tên TK";
                   r_item.getCell(4).value  =  "Description/ Diễn giải";
                   r_item.getCell(6).value  =  "Control Items/ Ghi chú";
                   r_item.getCell(10).value  =  "Debit/ Nợ";
                   r_item.getCell(13).value  =  "Credit/ Có";
                   for(let j = 1; j < 16; j++){
                       r_item.getCell(j).alignment = {vertical: 'middle', horizontal: 'center', wrapText: true };
                       r_item.getCell(j).font = { bold:true, italic:false, name: 'Times New Roman', size:10};
                   }
                   worksheet.mergeCells(pos_item,13,pos_item+1,15);
                   worksheet.mergeCells(pos_item,10,pos_item+1,12);
                   worksheet.mergeCells(pos_item,6,pos_item+1,9);
                   worksheet.mergeCells(pos_item,4,pos_item+1,5);
                   worksheet.mergeCells(pos_item,2,pos_item+1,3);
                   ///////////////////////////////////////////////////
                   pos_item = pos_mst + 13;
                   r_item = worksheet.getRow(pos_item);

                   pos = pos_item + 1; 
                   var copy_row = ((dt_Data.length-1)*4)+2;
                   if(dt_Data.length>1)
                   {
                       Utils.excelInsertRows(worksheet, pos+1,copy_row);  
                   }   
                   for (var i = 0; i < dt_Data.length; i++) 
                   {
                       r_item = worksheet.getRow(pos);   
                       worksheet.mergeCells(pos,2,pos,3);
                       r_item.getCell(2).value = dt_Data[i].ACCD; 
                       worksheet.mergeCells(pos,4,pos+1,5);
                       r_item.getCell(4).value = dt_Data[i].REMARK;  
                       
                       worksheet.mergeCells(pos,6,pos+3,9);
                       r_item.getCell(6).value = dt_Data[i].ITEM_CTRL;  
                       worksheet.mergeCells(pos,10,pos+3,12);
                       r_item.getCell(10).value = dt_Data[i].DEBIT_AMT; 
                       worksheet.mergeCells(pos,13,pos+3,15);  
                       r_item.getCell(13).value = dt_Data[i].CREDIT_AMT;  

                       r_item = worksheet.getRow(pos+1);   
                       worksheet.mergeCells(pos+1,2,pos+3,3);
                       r_item.getCell(2).value = dt_Data[i].ACNM; 

                       r_item = worksheet.getRow(pos+2);   
                       worksheet.mergeCells(pos+2,4,pos+3,5);
                       r_item.getCell(4).value = dt_Data[i].REMARK2; 
                       
                       worksheet.getCell(pos,2).border = {right: {style:'thin'},left: {style:'thin'}};
                       worksheet.getCell(pos+1,2).border = {right: {style:'thin'},left: {style:'thin'}, bottom: {style:'thin'} };


                       worksheet.getCell(pos,4).border = {right: {style:'thin'},left: {style:'thin'}};
                       worksheet.getCell(pos+2,4).border = {right: {style:'thin'},left: {style:'thin'}, bottom: {style:'thin'}};
                       worksheet.getCell(pos,4).alignment = {vertical: 'top', horizontal: 'left', wrapText: true};
                       worksheet.getCell(pos+2,4).alignment = {vertical: 'top', horizontal: 'left', wrapText: true};
                       worksheet.getCell(pos,4).font = { bold:false, italic:false, name: 'Times New Roman', size:8};
                       worksheet.getCell(pos+2,4).font = { bold:false, italic:false, name: 'Times New Roman', size:8};

                       worksheet.getCell(pos,6).border = {right: {style:'thin'},left: {style:'thin'}, bottom: {style:'thin'}}; 
                       worksheet.getCell(pos,6).alignment = {vertical: 'middle', horizontal: 'left', wrapText: true};
                       worksheet.getCell(pos,6).font = { bold:false, italic:false, name: 'Times New Roman', size:8};

                       worksheet.getCell(pos,10).border = {right: {style:'thin'},left: {style:'thin'}, bottom: {style:'thin'}}; 
                       worksheet.getCell(pos,13).border = {right: {style:'thin'},left: {style:'thin'}, bottom: {style:'thin'}}; 

                       if(dt_Data.length > 4){
                           r_item.height = 28;
                       }
                       pos += 4;
                   }        
                   r_item = worksheet.getRow(pos);
                    r_item.getCell(2).value  =  "Total/Tổng cộng";
                    r_item.getCell(2).alignment = {vertical: 'middle', horizontal: 'center', wrapText: false };
                    
                    worksheet.mergeCells(pos,2,pos,9); 
                    worksheet.mergeCells(pos,10,pos,12); 
                    r_item.getCell(10).value = dt_Data[0].SUM_DEBIT;
                    r_item.getCell(10).font = { bold:true, italic:false, name: 'Times New Roman', size:11};
                    worksheet.mergeCells(pos,13,pos,15);    
                    r_item.getCell(13).value = dt_Data[0].SUM_CREDIT;  
                    r_item.getCell(13).font = { bold:true, italic:false, name: 'Times New Roman', size:11};
             
                    pos += 1;
                    r_item = worksheet.getRow(pos);
                    ////////////////// Ket thuc do tai khoan//////////////////////////////////
                    //vẽ khung viền
                    for (let j = 1; j <= 16; j++) {
                        r_item.getCell(j).border = {bottom: {style:'thin'} };
                    }
                    //console.log('vẽ---------pos_mst : ' +pos_mst +'--------pos_item : ' + pos_item + '----pos : ' + pos)
                    for(let l_vien = pos_mst+2; l_vien < pos; l_vien++){
                        for (let j = 2; j <= 15; j++) {
                            worksheet.getCell(l_vien,j).border = {right: {style:'thin'},left: {style:'thin'},top: {style:'thin'}, bottom: {style:'thin'} };
                        }
                        worksheet.getCell(l_vien,1).border = {left: {style:'thick'}};
                        worksheet.getCell(l_vien,16).border = {right: {style:'thick'}};
                    }
                    r_item = worksheet.getRow(pos);
                    for (let j = 1; j <= 16; j++) {
                        r_item.getCell(j).border = {bottom: {style: "thick"},right: {style: "thick"}, left: {style:'thick'}};
                    }
                    worksheet.mergeCells(pos,1,pos,16);  
                    ///////////////////////////////////////////////
                    //trans ccy
                    pos += 2;
                    r_item = worksheet.getRow(pos);
                    r_item.getCell(5).value  =  "Trans Currency";
                    r_item.getCell(7).value  =  "Debit";
                    r_item.getCell(10).value  =  "Credit";
                    worksheet.mergeCells(pos,5,pos,6); 
                    worksheet.mergeCells(pos,7,pos,9); 
                    worksheet.mergeCells(pos,10,pos,12);  
                    worksheet.getCell(pos,5).border = {right: {style:'thin'},left: {style:'thin'},top: {style:'thin'},bottom: {style:'thin'}}; 
                    worksheet.getCell(pos,7).border = {right: {style:'thin'},left: {style:'thin'},top: {style:'thin'},bottom: {style:'thin'}}; 
                    worksheet.getCell(pos,10).border = {right: {style:'thin'},left: {style:'thin'},top: {style:'thin'},bottom: {style:'thin'}}; 
                    worksheet.getCell(pos,5).font = { bold:true, italic:false, name: 'Times New Roman', size:10};
                    worksheet.getCell(pos,7).font = { bold:true, italic:false, name: 'Times New Roman', size:10};
                    worksheet.getCell(pos,10).font = { bold:true, italic:false, name: 'Times New Roman', size:10};
                    r_item.getCell(5).alignment = {vertical: 'middle', horizontal: 'center', wrapText: false };
                    r_item.getCell(7).alignment = {vertical: 'middle', horizontal: 'center', wrapText: false };
                    r_item.getCell(10).alignment = {vertical: 'middle', horizontal: 'center', wrapText: false };
                    
                    pos += 1;
                    if(dt_Data_Trans.length>1)
                    {
                        Utils.excelInsertRows(worksheet, pos,dt_Data_Trans.length-1);  
                    }   
                    for (var y = 0; y < dt_Data_Trans.length; y++) 
                    {
                        r_item = worksheet.getRow(pos);    
                        r_item.getCell(5).value = dt_Data_Trans[y].CCY; 
                        worksheet.getCell(pos,5).border = {right: {style:'thin'},left: {style:'thin'},top: {style:'thin'},bottom: {style:'thin'}}; 
                        worksheet.getCell(pos,5).font = { bold:true, italic:false, name: 'Times New Roman', size:10};
                        worksheet.getCell(pos,5).alignment = {vertical: 'middle', horizontal: 'right', wrapText: false};
                        worksheet.mergeCells(pos,5,pos,6); 

                        worksheet.mergeCells(pos,7,pos,9); 
                        r_item.getCell(7).value = dt_Data_Trans[y].SUM_DEBIT; 
                        worksheet.getCell(pos,7).border = {right: {style:'thin'},left: {style:'thin'},top: {style:'thin'},bottom: {style:'thin'}};

                        worksheet.mergeCells(pos,10,pos,12);  
                        r_item.getCell(10).value = dt_Data_Trans[y].SUM_CREDIT; 
                        worksheet.getCell(pos,10).border = {right: {style:'thin'},left: {style:'thin'},top: {style:'thin'},bottom: {style:'thin'}}; 
                        pos += 1;
                    }

                     // try 
        // { /****************************** Get Param *********************************/
        //     let { para }        = request.get(['para']);
        //     /********* Parse pram to json ********/
        //     var item            = JSON.parse(para); 
        //     const user          = await auth.getUser() ;
        //     const p_crt_by      = user.USER_ID;
        //     const p_language    = request.header("accept-language", "ENG");
        //     var file_nm         = [item.P_RPT_FILE];
        //     var file_type       = ".xlsx";
        //     var full_nm         = file_nm + file_type;
        //     var file_new        = file_nm + p_crt_by + file_type;
        //     var _resourcesPath  = [item.P_RPT_URL]+'/'+full_nm;
        //     var P_FILE_TYPE     = item.P_FILE_TYPE?item.P_FILE_TYPE:'.xlsx';
        //     var _store          = "AC_RPT_6030010_ACC_SLIP_V2";
        //      /***************************** Return failded ****************************/
        //     if (!user) {return response.send(Utils.response(false, "Request failed!", null));
        //     } 
        //     /****************************** Begin call store and write excell *********/
        //     else 
        //     { 
        //         /********* Call store  ***************/ 
        //         var list_seq = [];
        //         //TH khác form 6030020
        //         let count_seq = item.P_SEQ_COUNT > 0 ? item.P_SEQ_COUNT : 0; 
        //         if((item.P_SEQ_COUNT === undefined) || (item.P_SEQ_COUNT === 'undefined') || (count_seq === 0)){
        //             //Set count_seq để chạy mảng for
        //             count_seq = 1;
        //             list_seq += item.P_SEQ + ',';
        //         }
        //         else{
        //             count_seq = item.P_SEQ_COUNT;
        //             list_seq = item.P_SEQ_GRD;
        //         }
        //         let l_seq = list_seq.split(',');
        //         let pos_mst = 0;
        //         let pos = 0;
                
        //         /********* Read file excel ********/ 
        //         const templateFile  = Helpers.resourcesPath(_resourcesPath); 
        //         await workbook.xlsx.readFile(templateFile);
        //         var worksheet       = workbook.getWorksheet(1);
        //         for(let l_count_seq = 0; l_count_seq < count_seq; l_count_seq++){
        //             /********* Write file excel ********/
        //             console.log(l_seq[l_count_seq]);
        //             var _param         = [ item.P_COMPANY, l_seq[l_count_seq],  item.P_BOOK_CCY, "DATA"];
        //             var dt_Data  = await DBService.callProcCursor(_store, _param, p_language, p_crt_by);  
        //                 _param         = [ item.P_COMPANY, l_seq[l_count_seq],  item.P_BOOK_CCY, "TRANS"];
        //             var dt_Data_Trans  = await DBService.callProcCursor(_store, _param, p_language, p_crt_by);  
        //             if (dt_Data.length >0) 
        //             {
        //                 dt_Data = dt_Data;
        //             } 
        //             else 
        //             { 
        //                 return response.send(Utils.response(false, "no_data_found", null))
        //             } 
        //             if (dt_Data_Trans.length >0) 
        //             {
        //                 dt_Data_Trans = dt_Data_Trans;
        //             } 
        //             else 
        //             { 
        //                 return response.send(Utils.response(false, "no_data_found", null))
        //             } 
        //              /*width column*/ 
        //             worksheet.getColumn(1).width = 0.6;
        //             worksheet.getColumn(2).width = 8.43;
        //             worksheet.getColumn(3).width = 10.14;
        //             worksheet.getColumn(4).width = 13.0;
        //             worksheet.getColumn(5).width  = 10.20;
        //             worksheet.getColumn(6).width  = 5.29;
        //             worksheet.getColumn(7).width  = 5.29;
        //             worksheet.getColumn(8).width  = 5.29;
        //             worksheet.getColumn(9).width  = 5.29;
        //             worksheet.getColumn(10).width = 5.29;
        //             worksheet.getColumn(11).width = 5.29;
        //             worksheet.getColumn(12).width = 5.29;
        //             worksheet.getColumn(13).width = 5.29;
        //             worksheet.getColumn(14).width = 5.29;
        //             worksheet.getColumn(15).width = 5.29;
        //             worksheet.getColumn(16).width = 0.6;
        //             /********* Write file excel ********/
        //             /*Set Header */ 
        //             let pos_item = 0;
        //             if(l_count_seq > 0){
        //                 pos_mst = pos + 2;
        //                 var r_break_page = worksheet.getRow(pos_mst);
        //                 r_break_page.addPageBreak();
        //                 //console.log('pos_mst---------pos_mst : ' + pos_mst);
        //             }
        //             //console.log('1---------pos_item : ' + pos_item + '----------pos_mst : ' + pos_mst + '----------pos : ' + pos);
        //             //-------------- row 1-----------------
        //             pos_item = pos_mst + 1; //row voucher approval no
        //             var r_item = worksheet.getRow(pos_item); 
        //             r_item.height = 17.25;
        //             r_item.getCell(6).value = "Voucher Approval No :";
        //             r_item.getCell(6).font = { bold:true, italic:false, name: 'Times New Roman', size:10};
        //             r_item.getCell(6).alignment = {vertical: 'middle', horizontal: 'right', wrapText: false };
        //             for (let j = 1; j <= 16; j++) {
        //                 r_item.getCell(j).border = {bottom: {style: "thick"}};
        //             }
        //             worksheet.mergeCells(pos_item,6,pos_item,11);
        //             // //console.log('ROW 1---------pos_item : ' + pos_item + '----------pos_mst : ' + pos_mst + '----------pos : ' + pos);
        //             //-------------- row 2-----------------
        //             pos_item = pos_mst + 2; //row AR REVENUE 
        //             r_item = worksheet.getRow(pos_item); 
        //             r_item.height = 24.75;
        //             r_item.getCell(2).value  =  dt_Data[0].REPORT_TITLE; 
        //             for (let j = 2; j <= 15; j++) {
        //                 r_item.getCell(j).border = {bottom: {style: "thin"}};
        //             }
        //             r_item.getCell(2).font = { bold:true, italic:false, name: 'Times New Roman', size:16};
        //             worksheet.mergeCells(pos_item,2,pos_item,15);
        //             r_item.getCell(2).alignment = {vertical: 'middle', horizontal: 'center', wrapText: false };
        //             //console.log('ROW 2---------pos_item : ' + pos_item + '----------pos_mst : ' + pos_mst + '----------pos : ' + pos);
        //             //-------------- row 3-----------------
        //             pos_item = pos_mst + 3;
        //             r_item = worksheet.getRow(pos_item); 
        //             r_item.height = 36.0;
        //             //sign
        //             r_item.getCell(2).value  =  "In Charge";
        //             r_item.getCell(2).font = { bold:true, italic:false, name: 'Times New Roman', size:16};
        //             r_item.getCell(5).value  =  dt_Data[0].DESCRIPTION;
        //             r_item.getCell(6).value  =  dt_Data[0].VAL1;
        //             r_item.getCell(8).value  =  dt_Data[0].VAL2;
        //             r_item.getCell(10).value  =  dt_Data[0].VAL3;
        //             r_item.getCell(12).value  =  dt_Data[0].VAL4;
        //             r_item.getCell(14).value  =  dt_Data[0].VAL5; 
        //             //row 4&5
        //             worksheet.mergeCells(pos_item+1,14,pos_item+2,15);
        //             worksheet.mergeCells(pos_item+1,12,pos_item+2,13);
        //             worksheet.mergeCells(pos_item+1,10,pos_item+2,11);
        //             worksheet.mergeCells(pos_item+1,8,pos_item+2,9);
        //             worksheet.mergeCells(pos_item+1,6,pos_item+2,7);
        //             worksheet.mergeCells(pos_item+1,5,pos_item+2,5);
        //             //row 3
        //             worksheet.mergeCells(pos_item,14,pos_item,15);
        //             worksheet.mergeCells(pos_item,12,pos_item,13);
        //             worksheet.mergeCells(pos_item,10,pos_item,11);
        //             worksheet.mergeCells(pos_item,8,pos_item,9);
        //             worksheet.mergeCells(pos_item,6,pos_item,7);
        //             worksheet.mergeCells(pos_item,5,pos_item,5);
        //             worksheet.mergeCells(pos_item,2,pos_item+2,4);
        //             for (let j = 2; j <= 15; j++) {
        //                 worksheet.getCell(pos_item, j).alignment = {vertical: 'middle', horizontal: 'center', wrapText: true };
        //                 worksheet.getCell(pos_item, j).font = { bold:true, italic:false, name: 'Times New Roman', size:10};
        //             }
        //             //-------------- row 6-----------------
        //             pos_item = pos_mst + 6;
        //             r_item = worksheet.getRow(pos_item); 
        //             r_item.height = 36.0;

        //             r_item.getCell(2).value  =  "Managing";
        //             r_item.getCell(2).font = { bold:true, italic:false, name: 'Times New Roman', size:16};
        //             r_item.getCell(5).value  =  dt_Data[0].DESCRIPTION;
        //             r_item.getCell(6).value  =  dt_Data[0].VAL6;
        //             r_item.getCell(8).value  =  dt_Data[0].VAL7;
        //             r_item.getCell(10).value  =  dt_Data[0].VAL8;
        //             r_item.getCell(12).value  =  dt_Data[0].VAL9;
        //             r_item.getCell(14).value  =  dt_Data[0].VAL10; 
        //             //dong 7 and 8
        //             worksheet.mergeCells(pos_item+1,14,pos_item+2,15);
        //             worksheet.mergeCells(pos_item+1,12,pos_item+2,13);
        //             worksheet.mergeCells(pos_item+1,10,pos_item+2,11);
        //             worksheet.mergeCells(pos_item+1,8,pos_item+2,9);
        //             worksheet.mergeCells(pos_item+1,6,pos_item+2,7);
        //             worksheet.mergeCells(pos_item+1,5,pos_item+2,5);
        //             // //row 6
        //             worksheet.mergeCells(pos_item,14,pos_item,15);
        //             worksheet.mergeCells(pos_item,12,pos_item,13);
        //             worksheet.mergeCells(pos_item,10,pos_item,11);
        //             worksheet.mergeCells(pos_item,8,pos_item,9);
        //             worksheet.mergeCells(pos_item,6,pos_item,7);
        //             worksheet.mergeCells(pos_item,5,pos_item,5);
        //             worksheet.mergeCells(pos_item,2,pos_item+2,4);
        //             for (let j = 2; j <= 15; j++) {
        //                 worksheet.getCell(pos_item, j).alignment = {vertical: 'middle', horizontal: 'center', wrapText: true };
        //                 worksheet.getCell(pos_item, j).font = { bold:true, italic:false, name: 'Times New Roman', size:10};
        //             }
        //             // /////////////////////////////////////////////////////
        //             //-------------- row 9 -----------------
        //             pos_item = pos_mst + 9;
        //             r_item = worksheet.getRow(pos_item); 
        //             r_item.height = 9.75;
        //             for (let j = 2; j <= 15; j++) {
        //                 r_item.getCell(j).border = {left: {style: "thin"}, right: {style: "thin"},bottom: {style: "thin"}};
        //             }
        //             r_item.getCell(16).border = {left: {style: "thin"}};
        //             //-------------- row 10 -----------------
        //             pos_item = pos_mst + 10;
        //             r_item = worksheet.getRow(pos_item);
        //             r_item.height = 24.75;
        //             r_item.getCell(2).value  =  "Company/Tên công ty:";
        //             r_item.getCell(6).value  =  "Voucher No / (Seq)/Số chứng từ:";
        //             r_item.getCell(4).value  =  dt_Data[0].BIZ_NM;//_COMP_NM;
        //             r_item.getCell(10).value  =  dt_Data[0].VOUCHERNO +"("+ dt_Data[0].SEQ + ")";

        //             //-------------- row 11 -----------------
        //             pos_item = pos_mst + 11;
        //             r_item = worksheet.getRow(pos_item);
        //             r_item.height = 24.75;
        //             r_item.getCell(2).value  =  "Department/ Bộ phận:";
        //             r_item.getCell(6).value  =  "Date/ Ngày:";
        //             r_item.getCell(4).value  =  dt_Data[0].DEPT_NAME;
        //             r_item.getCell(10).value  =  dt_Data[0].TRANS_DATE;

        //                 //-------------- row 12 -----------------
        //             pos_item = pos_mst + 12;
        //             r_item = worksheet.getRow(pos_item);
        //             r_item.height = 40;
        //             r_item.getCell(2).value  =  "Description/Diễn giải";
        //             r_item.getCell(6).value  =  "Local Description/Diễn giải:";
        //             r_item.getCell(4).value  =  dt_Data[0].REMARK;
        //             r_item.getCell(10).value  =  dt_Data[0].REMARK2;
        //             // //-------------- row 13 -----------------
        //             pos_item = pos_mst + 13;
        //             r_item = worksheet.getRow(pos_item);
        //             r_item.height = 28;
        //             r_item.getCell(2).value  =  "Enclose/Chứng từ đính kèm";
        //             r_item.getCell(4).value  =  dt_Data[0].TR_ENCLOSE; 
        //             worksheet.mergeCells(pos_item,5,pos_item,15);
        //                 //////////////////////////
        //             for(let l_merge = pos_mst + 9; l_merge < pos_mst + 13; l_merge++){
        //                 for(let j_fm = 1; j_fm < 16; j_fm++){
        //                     worksheet.getCell(l_merge,j_fm).alignment = {vertical: 'middle', horizontal: 'center', wrapText: true };
        //                 }
        //                 worksheet.getCell(l_merge,2).font = { bold:false, italic:false, name: 'Times New Roman', size:10};
        //                 worksheet.getCell(l_merge,4).font = { bold:true, italic:false, name: 'Times New Roman', size:10};
        //                 worksheet.getCell(l_merge,6).font = { bold:false, italic:false, name: 'Times New Roman', size:10};
        //                 worksheet.getCell(l_merge,10).font = { bold:true, italic:false, name: 'Times New Roman', size:10};
        //                 worksheet.mergeCells(l_merge,10,l_merge,15);
        //                 worksheet.mergeCells(l_merge,6,l_merge,9);
        //                 worksheet.mergeCells(l_merge,4,l_merge,5);
        //                 worksheet.mergeCells(l_merge,2,l_merge,3);
        //             }
        //             //////////////////////////////////
        //             // //-------------- row 14 -----------------
        //             pos_item = pos_mst + 14;
        //             r_item = worksheet.getRow(pos_item);
        //             r_item.getCell(2).value  =  "TRANSACTION DETAILS/ CHI TIẾT";
        //             worksheet.mergeCells(pos_item,2,pos_item,15);
        //             r_item.getCell(2).alignment = {vertical: 'middle', horizontal: 'center'};
        //             r_item.getCell(2).font = { bold:true, italic:false, name: 'Times New Roman', size:11};
        //             // //-------------- row 15 -----------------
        //             pos_item = pos_mst + 15;
        //             r_item = worksheet.getRow(pos_item);
        //             r_item.getCell(2).value  =  "Account/ Tên TK";
        //             r_item.getCell(4).value  =  "Description/ Diễn giải";
        //             r_item.getCell(6).value  =  "Control Items/ Ghi chú";
        //             r_item.getCell(10).value  =  "Debit/ Nợ";
        //             r_item.getCell(13).value  =  "Credit/ Có";
        //             for(let j = 1; j < 16; j++){
        //                 r_item.getCell(j).alignment = {vertical: 'middle', horizontal: 'center', wrapText: true };
        //                 r_item.getCell(j).font = { bold:true, italic:false, name: 'Times New Roman', size:10};
        //             }
        //             worksheet.mergeCells(pos_item,13,pos_item+1,15);
        //             worksheet.mergeCells(pos_item,10,pos_item+1,12);
        //             worksheet.mergeCells(pos_item,6,pos_item+1,9);
        //             worksheet.mergeCells(pos_item,4,pos_item+1,5);
        //             worksheet.mergeCells(pos_item,2,pos_item+1,3);
        //             ///////////////////////////////////////////////////
        //             pos_item = pos_mst + 16;
        //             r_item = worksheet.getRow(pos_item);

        //             pos = pos_item + 1; 
        //             var copy_row = ((dt_Data.length-1)*4)+2;
        //             if(dt_Data.length>1)
        //             {
        //                 Utils.excelInsertRows(worksheet, pos+1,copy_row);  
        //             }   
        //             for (var i = 0; i < dt_Data.length; i++) 
        //             {
        //                 r_item = worksheet.getRow(pos);   
        //                 worksheet.mergeCells(pos,2,pos,3);
        //                 r_item.getCell(2).value = dt_Data[i].ACCD; 
        //                 worksheet.mergeCells(pos,4,pos+1,5);
        //                 r_item.getCell(4).value = dt_Data[i].REMARK;  
                        
        //                 worksheet.mergeCells(pos,6,pos+3,9);
        //                 r_item.getCell(6).value = dt_Data[i].ITEM_CTRL;  
        //                 worksheet.mergeCells(pos,10,pos+3,12);
        //                 r_item.getCell(10).value = dt_Data[i].DEBIT_AMT; 
        //                 worksheet.mergeCells(pos,13,pos+3,15);  
        //                 r_item.getCell(13).value = dt_Data[i].CREDIT_AMT;  

        //                 r_item = worksheet.getRow(pos+1);   
        //                 worksheet.mergeCells(pos+1,2,pos+3,3);
        //                 r_item.getCell(2).value = dt_Data[i].ACNM; 

        //                 r_item = worksheet.getRow(pos+2);   
        //                 worksheet.mergeCells(pos+2,4,pos+3,5);
        //                 r_item.getCell(4).value = dt_Data[i].REMARK2; 
                        
        //                 worksheet.getCell(pos,2).border = {right: {style:'thin'},left: {style:'thin'}};
        //                 worksheet.getCell(pos+1,2).border = {right: {style:'thin'},left: {style:'thin'}, bottom: {style:'thin'} };


        //                 worksheet.getCell(pos,4).border = {right: {style:'thin'},left: {style:'thin'}};
        //                 worksheet.getCell(pos+2,4).border = {right: {style:'thin'},left: {style:'thin'}, bottom: {style:'thin'}};
        //                 worksheet.getCell(pos,4).alignment = {vertical: 'top', horizontal: 'left', wrapText: true};
        //                 worksheet.getCell(pos+2,4).alignment = {vertical: 'top', horizontal: 'left', wrapText: true};
        //                 worksheet.getCell(pos,4).font = { bold:false, italic:false, name: 'Times New Roman', size:8};
        //                 worksheet.getCell(pos+2,4).font = { bold:false, italic:false, name: 'Times New Roman', size:8};

        //                 worksheet.getCell(pos,6).border = {right: {style:'thin'},left: {style:'thin'}, bottom: {style:'thin'}}; 
        //                 worksheet.getCell(pos,6).alignment = {vertical: 'middle', horizontal: 'left', wrapText: true};
        //                 worksheet.getCell(pos,6).font = { bold:false, italic:false, name: 'Times New Roman', size:8};

        //                 worksheet.getCell(pos,10).border = {right: {style:'thin'},left: {style:'thin'}, bottom: {style:'thin'}}; 
        //                 worksheet.getCell(pos,13).border = {right: {style:'thin'},left: {style:'thin'}, bottom: {style:'thin'}}; 

        //                 if(dt_Data.length > 4){
        //                     r_item.height = 28;
        //                 }
        //                 pos += 4;
        //             }   
        //             r_item = worksheet.getRow(pos);
        //             r_item.getCell(2).value  =  "Total/Tổng cộng";
        //             r_item.getCell(2).alignment = {vertical: 'middle', horizontal: 'center', wrapText: false };
                    
        //             worksheet.mergeCells(pos,2,pos,9); 
        //             worksheet.mergeCells(pos,10,pos,12); 
        //             r_item.getCell(10).value = dt_Data[0].SUM_DEBIT;
        //             r_item.getCell(10).font = { bold:true, italic:false, name: 'Times New Roman', size:11};
        //             worksheet.mergeCells(pos,13,pos,15);    
        //             r_item.getCell(13).value = dt_Data[0].SUM_CREDIT;  
        //             r_item.getCell(13).font = { bold:true, italic:false, name: 'Times New Roman', size:11};
             
        //             pos += 1;
        //             r_item = worksheet.getRow(pos);
        //             ////////////////// Ket thuc do tai khoan//////////////////////////////////
        //             //vẽ khung viền
        //             for (let j = 1; j <= 16; j++) {
        //                 r_item.getCell(j).border = {bottom: {style:'thin'} };
        //             }
        //             //console.log('vẽ---------pos_mst : ' +pos_mst +'--------pos_item : ' + pos_item + '----pos : ' + pos)
        //             for(let l_vien = pos_mst+2; l_vien < pos; l_vien++){
        //                 for (let j = 2; j <= 15; j++) {
        //                     worksheet.getCell(l_vien,j).border = {right: {style:'thin'},left: {style:'thin'},top: {style:'thin'}, bottom: {style:'thin'} };
        //                 }
        //                 worksheet.getCell(l_vien,1).border = {left: {style:'thick'}};
        //                 worksheet.getCell(l_vien,16).border = {right: {style:'thick'}};
        //             }
        //             r_item = worksheet.getRow(pos);
        //             for (let j = 1; j <= 16; j++) {
        //                 r_item.getCell(j).border = {bottom: {style: "thick"},right: {style: "thick"}, left: {style:'thick'}};
        //             }
        //             worksheet.mergeCells(pos,1,pos,16);  
        //             ///////////////////////////////////////////////

        //             //trans ccy
        //             pos += 2;
        //             r_item = worksheet.getRow(pos);
        //             r_item.getCell(5).value  =  "Trans Currency";
        //             r_item.getCell(7).value  =  "Debit";
        //             r_item.getCell(10).value  =  "Credit";
        //             worksheet.mergeCells(pos,5,pos,6); 
        //             worksheet.mergeCells(pos,7,pos,9); 
        //             worksheet.mergeCells(pos,10,pos,12);  
        //             worksheet.getCell(pos,5).border = {right: {style:'thin'},left: {style:'thin'},top: {style:'thin'},bottom: {style:'thin'}}; 
        //             worksheet.getCell(pos,7).border = {right: {style:'thin'},left: {style:'thin'},top: {style:'thin'},bottom: {style:'thin'}}; 
        //             worksheet.getCell(pos,10).border = {right: {style:'thin'},left: {style:'thin'},top: {style:'thin'},bottom: {style:'thin'}}; 
        //             worksheet.getCell(pos,5).font = { bold:true, italic:false, name: 'Times New Roman', size:10};
        //             worksheet.getCell(pos,7).font = { bold:true, italic:false, name: 'Times New Roman', size:10};
        //             worksheet.getCell(pos,10).font = { bold:true, italic:false, name: 'Times New Roman', size:10};
        //             r_item.getCell(5).alignment = {vertical: 'middle', horizontal: 'center', wrapText: false };
        //             r_item.getCell(7).alignment = {vertical: 'middle', horizontal: 'center', wrapText: false };
        //             r_item.getCell(10).alignment = {vertical: 'middle', horizontal: 'center', wrapText: false };
                    
        //             pos += 1;
        //             if(dt_Data_Trans.length>1)
        //             {
        //                 Utils.excelInsertRows(worksheet, pos,dt_Data_Trans.length-1);  
        //             }   
        //             for (var y = 0; y < dt_Data_Trans.length; y++) 
        //             {
        //                 r_item = worksheet.getRow(pos);    
        //                 r_item.getCell(5).value = dt_Data_Trans[y].CCY; 
        //                 worksheet.getCell(pos,5).border = {right: {style:'thin'},left: {style:'thin'},top: {style:'thin'},bottom: {style:'thin'}}; 
        //                 worksheet.getCell(pos,5).font = { bold:true, italic:false, name: 'Times New Roman', size:10};
        //                 worksheet.getCell(pos,5).alignment = {vertical: 'middle', horizontal: 'right', wrapText: false};
        //                 worksheet.mergeCells(pos,5,pos,6); 

        //                 worksheet.mergeCells(pos,7,pos,9); 
        //                 r_item.getCell(7).value = dt_Data_Trans[y].SUM_DEBIT; 
        //                 worksheet.getCell(pos,7).border = {right: {style:'thin'},left: {style:'thin'},top: {style:'thin'},bottom: {style:'thin'}};

        //                 worksheet.mergeCells(pos,10,pos,12);  
        //                 r_item.getCell(10).value = dt_Data_Trans[y].SUM_CREDIT; 
        //                 worksheet.getCell(pos,10).border = {right: {style:'thin'},left: {style:'thin'},top: {style:'thin'},bottom: {style:'thin'}}; 
        //                 pos += 1;
        //             }
        //         }
        //             /********* Print file excel ********/
        //             const reportFile    = Helpers.tmpPath(file_new);
        //             await workbook.xlsx.writeFile(reportFile)
        //             // await workbook.xlsx.writeFile(reportFile); 
        //             if( P_FILE_TYPE ==".xlsx")
        //             {  
        //                 return response.attachment( reportFile, file_nm+ P_FILE_TYPE );
        //             }

        //             if( P_FILE_TYPE ==".pdf")
        //             { 
        //                 const reportFilePdf =  await Utils.excelToPdf(reportFile);
        //                 return response.attachment( reportFilePdf, file_nm+ P_FILE_TYPE );
        //             }
        //             return response.attachment( reportFile, file_new);
        //     }
        // } 
        // catch (e) 
        // {
        //     return response.send(Utils.response(false, e.message, null))
        // }
                }
                    /********* Print file excel ********/
                    const reportFile    = Helpers.tmpPath(file_new);
                    await workbook.xlsx.writeFile(reportFile)
                    // await workbook.xlsx.writeFile(reportFile); 
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

module.exports = rpt6030010;