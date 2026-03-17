"use strict";
const Helpers       = use('Helpers')
const Antl          = use("Antl");
const Utils         = use("Utils");
const DBService = use("DBService")
var Excel           = use('exceljs');
var workbook        = new Excel.Workbook();
class rpt6060022 {
/*########################################################## Report JH ##################################################################################*/ 
    async rpt_6060022 ({ request, response, auth }) {
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

            var _store          = "AC_RPT_6060022";
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
                r_item.getCell(5).value  =  dt_Data[3].VAL3;
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

module.exports = rpt6060022;