"use strict";
const Helpers       = use('Helpers')
const Antl          = use("Antl");
const Utils         = use("Utils");
const DBService = use("DBService")
var Excel           = use('exceljs');
var workbook        = new Excel.Workbook();
class rpt6050020 {
/*########################################################## Report JH ##################################################################################*/ 
    async rpt_6050020_TAKE_IN_SLIP({ request, response, auth }) {
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
            var COMP_ID         = item.P_COMP_ID, COMP_NM = item.P_COMP_NM, COMP_TAX = item.P_COMP_TAX, COMP_ADD = item.P_COMP_ADD;
            var _store          = "AC_RPT_6050020_TAKE_IN_SLIP";
            var _param          = [item.P_PK];
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
                if (dt_Data.length >0) 
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
                /*Set Header */ 

                //worksheet.getCell("B47").value = temp;
                var r_item = worksheet.getRow(1);
                r_item.getCell(1).value = Utils.translate("COMPANY",_dictionary , p_language) + ": " + COMP_ID +" - "+ dt_Data[0].BIZ_NM;    
                r_item = worksheet.getRow(2);
                r_item.getCell(1).value = Utils.translate("TAX_CODE",_dictionary, p_language) + ": "+ dt_Data[0].BIZ_TAX;   
                r_item = worksheet.getRow(3);
                r_item.getCell(1).value = Utils.translate("ADDRESS",_dictionary , p_language) + ": "+ dt_Data[0].BIZ_ADD;

               
             var  r_item = worksheet.getRow(6); 
                r_item.getCell(7).value  =  dt_Data[0].VOUCHERNO; // voucherno

                r_item = worksheet.getRow(7); 
                r_item.getCell(3).value  =  dt_Data[0].PARTNER_NAME; // partner_name
                r_item.getCell(7).value  =  dt_Data[0].AC_CD_DR; //ac_cd_dr

                r_item = worksheet.getRow(8); 
                r_item.getCell(1).value  =  dt_Data[0].PARNERT; // partner
                r_item.getCell(7).value  =  dt_Data[0].AC_CD_CR; //ac_cd_cr

                r_item = worksheet.getRow(9); 
                r_item.getCell(3).value  =  dt_Data[0].WH_NAME;//wh_name
                
                
             /*   if(p_language == 'KOR') 
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
                }*/


                var pos = 13; 
                if(dt_Data.length>1)
                {
                     worksheet.duplicateRow(pos,dt_Data.length-1,true);
                }   
                for (var i = 0; i < dt_Data.length; i++) 
                {
                    r_item = worksheet.getRow(pos);   
                    r_item.getCell(1).value = i + 1; 
                    r_item.getCell(2).value = dt_Data[i].ITEM_NAME; 
                    r_item.getCell(3).value = dt_Data[i].ITEM_CODE;  
                    r_item.getCell(4).value = dt_Data[i].AP_UNIT;  
                    r_item.getCell(5).value = dt_Data[i].AP_QTY; 
                    r_item.getCell(6).value = dt_Data[i].AP_UPRICE;  
                    r_item.getCell(7).value = dt_Data[i].AP_TRFAMT;  
                    pos = pos + 1; 
                   
                }    
                // total
                var total_ap_qty     = 0;
                var total_ap_trfamt  = 0;
                var total_ap_vat     = 0;
                var total            = 0;
                total_ap_qty     = dt_Data[0].SUM_AP_QTY;
                total_ap_trfamt  = dt_Data[0].SUM_AP_TRFAMT; 
                total_ap_vat     = dt_Data[0].SUM_VAT_AMT
                total            = total_ap_trfamt + total_ap_vat;

                var row = worksheet.getRow(pos);
                row.getCell(5).value  = total_ap_qty;
                row.getCell(7).value  = total_ap_trfamt;

                var l_row = worksheet.getRow(pos + 2);
                l_row.getCell(7).value  = total_ap_trfamt;

                l_row = worksheet.getRow(pos + 3);
                l_row.getCell(6).value  = total_ap_vat;

                l_row = worksheet.getRow(pos + 4);
                l_row.getCell(6).value  = total_ap_trfamt;
                
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

module.exports = rpt6050020;