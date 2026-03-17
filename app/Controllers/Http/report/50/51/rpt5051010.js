"use strict";
const Helpers       = use('Helpers')
const Antl          = use("Antl");
const Utils         = use("Utils");
const DBService = use("DBService")
var Excel           = use('exceljs');
var workbook        = new Excel.Workbook();
class rpt5051010 {
/*########################################################## Report JH ##################################################################################*/ 
    async rpt5051010_v01({ request, response, auth }) {
        try 
        { 
            /****************************** Get Param *********************************/
            let { para }        = request.get(['para']);
            
            /********* Parse pram to json ********/
            var item            = JSON.parse(para);            
            const user          = await auth.getUser() ;
            const p_crt_by      = user.USER_ID;
            const p_language    = request.header("accept-language", "ENG");
            var file_nm         = "rpt5051010_v01";
            var file_type       = ".xlsx";
            var full_nm         = file_nm + file_type;
            var file_new        = file_nm + p_crt_by + file_type;

            var _resourcesPath  = "report/50/51/rpt5051010_v01.xlsx";
            // var _COMP_ID        = item.P_COMP_ID, _COMP_NM = item.P_COMP_NM, _COMP_TAX = item.P_COMP_TAX, _COMP_ADD = item.P_COMP_ADD;

            var _store          = "lg_sel_5051010_1";
            var _param          = [ item.P_DT_FR, item.P_DT_TO,  item.P_COMPANY_PK, item.P_CUSTOMER_SEARCH, item.P_INVOICE_NO, item.P_STATUS, item.P_FILTER_BY];
            
             /***************************** Return failded ****************************/
            if (!user) 
            {
                return response.send(Utils.response(false, "Request failed!", null));
            } 
            /****************************** Begin call store and write excell *********/
            else 
            {
                var dtDetail = await DBService.callProcCursor("lg_rpt_5051010_1", _param, p_language, user.USER_ID);
                if(!dtDetail)
                {
                    return response.send(Utils.response(false, "no_data_found", null));
                }
                /********* Read file excel ********/ 
                const templateFile  = Helpers.resourcesPath(_resourcesPath); 
                await workbook.xlsx.readFile(templateFile);
                var worksheet       = workbook.getWorksheet(1);

                const l_fromDay = item.P_DT_FR;
                const l_toDay = item.P_DT_TO;

                let l_fromDate = "";
                //alert(l_fromDay);
                if(l_fromDay && l_fromDay.trim() != "") {
                    l_fromDate = l_fromDay.substr(0, 4) + "/" + l_fromDay.substr(4, 2) + "/" + l_fromDay.substr(6, 2);
                }
                
                let l_toDate = l_toDay.substr(0, 4) + "/" + l_toDay.substr(4, 2) + "/" + l_toDay.substr(6, 2);

                var l_rowDuration = worksheet.getRow(3);
                l_rowDuration.getCell(3).value = l_fromDate;
                l_rowDuration.getCell(5).value = l_toDate;
                l_rowDuration.commit();

                let l_compName = dtDetail[0].PARTNER_NAME;
                var l_rowComp = worksheet.getRow(1);
                l_rowComp.getCell(3).value = l_compName;                
                l_rowComp.commit();

                var pos = 8;
                if(dtDetail.length>1){
                    worksheet.duplicateRow(pos, dtDetail.length-1 + 7, false);
                }
                let l_sumInvoiceAmt = 0;
                let l_sumPaymentAmt = 0;
                let l_sumBalanceAmt = 0 ;
                let l_countOverDue=0;

                for (var i = 0; i < dtDetail.length; i++) {

                    var row = worksheet.getRow(pos + i);                    

                    row.getCell(1).value = i + 1;
                    
                    row.getCell(2).value = dtDetail[i].CUST_NAME;

                    row.getCell(3).value = dtDetail[i].GD_DATE;

                    row.getCell(4).value = dtDetail[i].CO_INVOICE_NO;

                    row.getCell(5).value = dtDetail[i].CO_INVOICE_DATE;

                    row.getCell(6).value = dtDetail[i].TR_AMOUNT;
                    if(dtDetail[i].TR_AMOUNT) {
                        l_sumInvoiceAmt += parseFloat(dtDetail[i].TR_AMOUNT);
                    }
                    
                    row.getCell(7).value = dtDetail[i].PAYMENT_DT;

                    row.getCell(8).value = dtDetail[i].PAY_AMOUNT;

                    if(dtDetail[i].PAY_AMOUNT) {
                        l_sumPaymentAmt += parseFloat(dtDetail[i].PAY_AMOUNT);
                    }

                    row.getCell(9).value = dtDetail[i].CLAIM_AMOUNT;

                    row.getCell(10).value = dtDetail[i].PRICE_DISCREPANCY;

                    row.getCell(11).value = dtDetail[i].BALANCE_AMT;

                    if(dtDetail[i].BALANCE_AMT) {
                        l_sumBalanceAmt += parseFloat(dtDetail[i].BALANCE_AMT);
                    }

                    row.getCell(12).value = dtDetail[i].ADVANCED_AMOUNT;

                    row.getCell(13).value = dtDetail[i].DUE_DT;

                    row.getCell(14).value = dtDetail[i].STATUS;

                    if(dtDetail[i].STATUS== "Over Due") {
                        l_countOverDue += 1;
                    }

                    row.getCell(15).value = dtDetail[i].CLASSIFICATION;

                    row.getCell(16).value = dtDetail[i].VIA;

                    row.getCell(17).value = dtDetail[i].REF_PO_NO;

                    row.getCell(18).value = dtDetail[i].DESCRIPTION;                    
                                        
                    row.commit();
                }

                var l_rowTotal = worksheet.getRow(pos + (dtDetail.length - 1) + 2);
                l_rowTotal.getCell(4).value = "Total";              
                l_rowTotal.getCell(6).value = l_sumInvoiceAmt;
                l_rowTotal.getCell(8).value = l_sumPaymentAmt;
                l_rowTotal.getCell(11).value = l_sumBalanceAmt;
                l_rowTotal.getCell(13).value = "Over Due";
                l_rowTotal.getCell(14).value = l_countOverDue;                
                l_rowTotal.commit();
                                
                var _param2 = [item.P_DT_FR, item.P_DT_TO,  item.P_COMPANY_PK, item.P_CUSTOMER_SEARCH, item.P_INVOICE_NO, item.P_STATUS, item.P_FILTER_BY];

                var dtSum = await DBService.callProcCursor("LG_PRO_5051010", _param2, p_language, user.USER_ID);

                let l_OVER_DUE_AMT = 0;
                let l_OVER_DUE_3M_AMT = 0;
                let l_OVER_DUE_5M_AMT = 0;
                let l_UNDER_DUE_3M_AMT = 0;

                if(dtSum)
                {
                    l_OVER_DUE_AMT = dtSum[0].OVER_DUE_AMT;
                    l_OVER_DUE_3M_AMT = dtSum[0].OVER_DUE_3M_AMT;
                    l_OVER_DUE_5M_AMT = dtSum[0].OVER_DUE_5M_AMT;
                    l_UNDER_DUE_3M_AMT = dtSum[0].UNDER_DUE_3M_AMT;
                }


                var l_rowSum1 = worksheet.getRow(pos + (dtDetail.length - 1) + 3);                
                l_rowSum1.getCell(10).value = "Over 3M";
                l_rowSum1.getCell(11).value = l_OVER_DUE_3M_AMT;
                l_rowSum1.commit();

                var l_rowSum2 = worksheet.getRow(pos + (dtDetail.length - 1) + 4);
                l_rowSum2.getCell(10).value = "Over 5M";
                l_rowSum2.getCell(11).value = l_OVER_DUE_5M_AMT;                
                l_rowSum2.commit();

                var l_rowSum3 = worksheet.getRow(pos + (dtDetail.length - 1) + 5);
                l_rowSum3.getCell(10).value = "Under 3M";
                l_rowSum3.getCell(11).value = l_UNDER_DUE_3M_AMT;
                l_rowSum3.commit();                            

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

module.exports = rpt5051010;