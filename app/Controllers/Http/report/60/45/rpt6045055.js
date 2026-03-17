"use strict";
const Helpers       = use('Helpers')
const Antl          = use("Antl");
const Utils         = use("Utils");
const DBService = use("DBService")
var Excel           = use('exceljs');
var workbook        = new Excel.Workbook();
class rpt6045055 {
/*########################################################## Report rpt6045055_SUMMARY ##################################################################################*/ 
    async rpt6045055_SUMMARY({ request, response, auth }) {
        try 
        { 
          /*P_RPT_ID: report_info.VAL1, P_RPT_URL: report_info.VAL2, P_RPT_FILE: report_info.VAL3, 
          P_COMP_ID: company_info.PARTNER_ID, P_COMP_NM: company_info.TEXT, P_COMP_TAX: company_info.TAX_CODE, P_COMP_ADD: company_info.ADDR2, 
          P_COMPANY: this.selectedCompany, P_FR_DATE: this.from_date, P_TO_DATE: this.to_date, P_DEPOSIT_ACC  : this.selectedDepositAccount, P_STATUS : this.selectedStatus, 
          P_CCY: this.selectedCurrency*/
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
            var BIZ_ID         = item.P_BIZ_ID , BIZ_NM  = item.P_BIZ_NM , BIZ_TAX  = item.P_BIZ_TAX , BIZ_ADD  = item.P_BIZ_ADD;
            var _store          = "AC_RPT_6045055_SUMMARY";
            var _param          = [ item.P_COMPANY, item.P_FR_DATE,  item.P_TO_DATE, item.P_STATUS, item.P_TCO_BUSPLACE_PK  ];
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
                /********* Read file excel ********/ 
                const templateFile  = Helpers.resourcesPath(_resourcesPath); 
                await workbook.xlsx.readFile(templateFile);
                var worksheet       = workbook.getWorksheet(1);
                /********* Write file excel ********/
                /*Set Header */  
                var  r_item = worksheet.getRow(1); 
                r_item.getCell(1).value  =  BIZ_NM;
                r_item = worksheet.getRow(2);  
                r_item.getCell(1).value  = "Tax: "+BIZ_TAX; 
                r_item = worksheet.getRow(4);  
                r_item.getCell(1).value  =  "From date: "+Utils._formatDate(item.P_FR_DATE,"DD-MM-YYYY")+" / To date: "+Utils._formatDate(item.P_TO_DATE,"DD-MM-YYYY"); 
 
                var pos = 8; 
                var copy_row = (dt_Data.length-4-dt_Data[dt_Data.length-1].ROWS_COPY);
                var copy_row2 =0;

                for (var i = 0; i < dt_Data.length; i++) 
                { 
                    if (dt_Data[i].SORT_BY <= 3)
                    {
                       copy_row = dt_Data[i].ROWS_COPY -1;
                    } else
                    {
                       copy_row2 = dt_Data[i].ROWS_COPY -1;                      
                    }
                }
                
                if(dt_Data.length>1)
                {
                   // worksheet.duplicateRow(15,dt_Data[dt_Data.length-1].ROWS_COPY-2,true);
                    
                   worksheet.duplicateRow(14,copy_row2,true);
                    worksheet.duplicateRow(pos+1,copy_row,true);

                   var next_sum  = 12 + copy_row ;
                    worksheet.mergeCells(next_sum,1,next_sum+1,1);
                    worksheet.getCell(next_sum,1).border = {right: {style:'thin'},left: {style:'thin'},top: {style:'thin'}, bottom: {style:'thin'} };
                    worksheet.mergeCells(next_sum,2,next_sum,3);
                    worksheet.mergeCells(next_sum,4,next_sum+1,4);
                    worksheet.getCell(next_sum,4).border = {right: {style:'thin'},left: {style:'thin'},top: {style:'thin'}, bottom: {style:'thin'} };
                    worksheet.mergeCells(next_sum,5,next_sum,7);
                    worksheet.mergeCells(next_sum,8,next_sum,10);
                    worksheet.mergeCells(next_sum,11,next_sum,13);
                    worksheet.mergeCells(next_sum,14,next_sum,16); 
                    worksheet.getCell(next_sum,14).border = {right: {style:'thin'},left: {style:'thin'},top: {style:'thin'}, bottom: {style:'thin'} };
                   //
                  
                }   
             var next_pos = pos ;
                var chk_tf = 1;
                var next_sum  = 5 + pos + copy_row ;
                for (var i = 0; i < dt_Data.length; i++) 
                {
                     
                    if(dt_Data[i].SORT_BY <= 3)
                    {
                        next_pos = pos + i ;
                    }
                    else if(dt_Data[i].SORT_BY > 3)
                    {   next_sum++;
                        next_pos = next_sum ;
                    }
                    r_item = worksheet.getRow(next_pos);    
                    r_item.getCell(1).value = dt_Data[i].NUM; 
                    r_item.getCell(2).value = dt_Data[i].ACCOUNT_NO; 
                    r_item.getCell(3).value = dt_Data[i].PARTNER_NAME; 
                    r_item.getCell(4).value = dt_Data[i].CCY; 
                    r_item.getCell(5).value = dt_Data[i].O_MM_VND_BAL; 
                    r_item.getCell(6).value = dt_Data[i].O_MM_USD_BAL; 
                    r_item.getCell(7).value = dt_Data[i].O_MM_BOOK_BAL; 
                    r_item.getCell(8).value = dt_Data[i].DR_VND_BAL; 
                    r_item.getCell(9).value = dt_Data[i].DR_USD_BAL; 
                    r_item.getCell(10).value = dt_Data[i].DR_BOOK_BAL; 
                    r_item.getCell(11).value = dt_Data[i].CR_VND_BAL; 
                    r_item.getCell(12).value = dt_Data[i].CR_USD_BAL; 
                    r_item.getCell(13).value = dt_Data[i].CR_BOOK_BAL; 
                    r_item.getCell(14).value = dt_Data[i].CL_VND_BAL; 
                    r_item.getCell(15).value = dt_Data[i].CL_USD_BAL; 
                    r_item.getCell(16).value = dt_Data[i].CL_BOOK_BAL; 
                    if((dt_Data[i].PK == "" || dt_Data[i].PK == null || dt_Data[i].PK == "null") && dt_Data[i].PK != 0)
                    {
                        worksheet.mergeCells(next_pos,1,next_pos,4);
                        var input_title = dt_Data[i].SORT_BY == 1.5?"I. Demand deposit - Sub Total":dt_Data[i].SORT_BY == 2.5?"II. Time deposit - Sub Total":"Grand Total";
                        r_item.getCell(1).value = input_title;  
                    }  
                }  
           
                //next_sum  = 1 + pos + copy_row ;
                //worksheet.mergeCells(next_sum,1,next_sum+1,1);
                //worksheet.getCell(next_sum,1).border = {right: {style:'thin'},left: {style:'thin'},top: {style:'thin'}, bottom: {style:'thin'} };
                //worksheet.mergeCells(next_sum,2,next_sum,3);
                //worksheet.mergeCells(next_sum,4,next_sum+1,4);
                //worksheet.getCell(next_sum,4).border = {right: {style:'thin'},left: {style:'thin'},top: {style:'thin'}, bottom: {style:'thin'} };
                //worksheet.mergeCells(next_sum,5,next_sum,7);
                //worksheet.mergeCells(next_sum,8,next_sum,10);
                //worksheet.mergeCells(next_sum,11,next_sum,13);
                //worksheet.mergeCells(next_sum,14,next_sum,16); 
                //worksheet.getCell(next_sum,14).border = {right: {style:'thin'},left: {style:'thin'},top: {style:'thin'}, bottom: {style:'thin'} };

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
/*########################################################## Report rpt6045055_DailyDetailOTM ##################################################################################*/ 
    async rpt6045055_DailyDetailOTM({ request, response, auth }) {
        try 
        { 
        /*P_RPT_ID: report_info.VAL1, P_RPT_URL: report_info.VAL2, P_RPT_FILE: report_info.VAL3, 
        P_COMP_ID: company_info.PARTNER_ID, P_COMP_NM: company_info.TEXT, P_COMP_TAX: company_info.TAX_CODE, P_COMP_ADD: company_info.ADDR2, 
        P_COMPANY: this.selectedCompany, P_FR_DATE: this.from_date, P_TO_DATE: this.to_date, P_DEPOSIT_ACC  : this.selectedDepositAccount, P_STATUS : this.selectedStatus, 
        P_CCY: this.selectedCurrency*/
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
            var BIZ_ID         = item.P_BIZ_ID , BIZ_NM  = item.P_BIZ_NM , BIZ_TAX  = item.P_BIZ_TAX , BIZ_ADD  = item.P_BIZ_ADD; 
            var _param_rate          = [ item.P_COMPANY, item.P_TO_DATE ]; 
            var _param_data          = [ item.P_COMPANY, item.P_FR_DATE, item.P_TO_DATE, item.P_DEPOSIT_ACC, item.P_STATUS, item.P_CCY, item.P_TCO_BUSPLACE_PK ]; 
            /***************************** Return failded ****************************/
            if (!user) 
            {
                return response.send(Utils.response(false, "Request failed!", null));
            } 
            /****************************** Begin call store and write excell *********/
            else 
            { 
                /********* Call store  ***************/ 
                var dt_Rate  = await DBService.callProcCursor("AC_RPT_6045055_DAILYOTM_RATE", _param_rate, p_language, p_crt_by);  
                    dt_Rate  = (dt_Rate.length >0)?dt_Rate:[];

                var dt_Cash  = await DBService.callProcCursor("AC_RPT_6045055_DAILYOTM_CASH", _param_data, p_language, p_crt_by);  
                    dt_Cash  = (dt_Cash.length >0)?dt_Cash:[];

                var dt_Bank  = await DBService.callProcCursor("AC_RPT_6045055_DAILYOTM_BANK", _param_data, p_language, p_crt_by);  
                    dt_Bank  = (dt_Bank.length >0)?dt_Bank:[];

                var dt_Partner  = await DBService.callProcCursor("AC_RPT_6045055_DAILY_PARTNER", _param_data, p_language, p_crt_by);  
                    dt_Partner  = (dt_Partner.length >0)?dt_Partner:[];

                var dt_Liabiliti  = await DBService.callProcCursor("AC_RPT_6045055_DAILY_LIABILITI", _param_data, p_language, p_crt_by);  
                    dt_Liabiliti  = (dt_Liabiliti.length >0)?dt_Liabiliti:[];

                var dt_Detail  = await DBService.callProcCursor("AC_RPT_6045055_DAILYOTM_DETAIL", _param_data, p_language, p_crt_by);  
                    dt_Detail  = (dt_Detail.length >0)?dt_Detail:[];

                var dt_131Sum  = await DBService.callProcCursor("AC_RPT_6045055_DAILYOTM_131SUM", _param_data, p_language, p_crt_by);  
                    dt_131Sum  = (dt_131Sum.length >0)?dt_131Sum:[];
                  
                /********* Read file excel ********/ 
                const templateFile  = Helpers.resourcesPath(_resourcesPath); 
                await workbook.xlsx.readFile(templateFile);
                var worksheet       = workbook.getWorksheet(1);
                /********* Write file excel ********/ 
                var l_bank_ccy = "",l_book_ccy = "" ; 
                var p_vnd_rate =1, p_krw_rate =0, p_usd_rate =0, p_eur_rate =0 ;		
                var total_cash =0, total_bank =0, total_asset =0, total_lib =0, total_end_bk =0, total_receive = 0;
                var total_cash1 =0, total_bank1 =0, total_asset1 =0, total_lib1 =0, total_end_bk1 =0, total_receive1 = 0;
                var total_krw = 0;
                /*=============================================== rate ====================================================================*/  
                 if(dt_Rate.length >0)
                {
                    p_krw_rate = Number(dt_Rate[0].RATE_KRW);
                    p_usd_rate = Number(dt_Rate[0].RATE_USD);
                    p_eur_rate = Number(dt_Rate[0].RATE_EUR);
                    p_vnd_rate = Number(dt_Rate[0].RATE_VND);
                }
                // console.log(dt_Rate)
               
                worksheet.getCell("D1").value   =  BIZ_NM; 
                worksheet.getCell("D2").value   =  BIZ_TAX;
                worksheet.getCell("E2").value   = 	"DAILY CASH : " + Utils._formatDate(item.P_TO_DATE,"DD / MOM / YYYY");
                
                worksheet.getCell("J4").value  = "VND";
                worksheet.getCell("L1").value  = p_vnd_rate;
                
                worksheet.getCell("J4").value  = "USD";
                worksheet.getCell("L2").value  = p_usd_rate;
                
                worksheet.getCell("J4").value  = "EUR";
                worksheet.getCell("L3").value  = p_eur_rate;
                
                worksheet.getCell("J4").value  = "KRW";
                worksheet.getCell("L4").value  = p_krw_rate;
                // console.log(p_krw_rate)

                /*==================================================== cash ==================================================================*/
                var _row = 10;
                var setRow = worksheet.getRow(_row);
                Utils.excelInsertRows(worksheet, _row, dt_Cash.length-1)

                for (var i = 0; i < dt_Cash.length; i++)
                {
                    _row = _row + i;
                    setRow = worksheet.getRow(_row);

                    setRow.getCell(3).value = dt_Cash[i].CCY;
                    setRow.getCell(4).value = dt_Cash[i].AC_CD;
                    setRow.getCell(5).value = dt_Cash[i].AC_NM;

                    setRow.getCell(6).value  = Number(dt_Cash[i].OPEN_TRAMT);
                    setRow.getCell(7).value  = Number(dt_Cash[i].DR_TRAMT);
                    setRow.getCell(8).value  = Number(dt_Cash[i].CR_TRAMT);
                    setRow.getCell(9).value  = Number(dt_Cash[i].CLOSE_TRANS);
                    setRow.getCell(10).value = Number(dt_Cash[i].CLOSE_BOOK);     
                         
                    var cols = "J"+(_row);  
                    var rows = "1"; 
                    var cols_rate = "L";  
                    var _ccy = dt_Cash[i].CCY;
                    rows = (_ccy == "VND")?"1":(_ccy == "USD")?"2":(_ccy == "EUR")?"3":(_ccy == "KRW")?"4":"1"; 
                     
                    cols_rate = "L"+(rows);
                    cols	  = "I"+(_row);
                    setRow.getCell(12).value  =   { formula :"("+cols+"*"+cols_rate+")/$L$4"} ;
                     
                    if (dt_Cash[i].AC_CD !="" || dt_Cash[i].AC_CD != undefined || dt_Cash[i].AC_CD !="null" )
                    {
                        if (dt_Cash[i].CLOSE_BOOK !="" || dt_Cash[i].CLOSE_BOOK != undefined || dt_Cash[i].CLOSE_BOOK !="null")
                        {
                            total_cash  = total_cash  + Number(dt_Cash[i].CLOSE_BOOK);
                            total_cash1 = total_cash1 + Number(dt_Cash[i].CLOSE_BOOK_BY_RATE);
                        }
                    }

                    for(var f = 6; f<=9; f ++)
                    {  
                        setRow.getCell(f).numFmt  = (_ccy == "VND")?"_ * #,##0 ₫ ;[Red]* -#,##0 ₫ ; -":"_ $ * #,##0.00 ;[Red] $ * -#,##0.00 ; -"; 
                    }
                }
                // _row = _row + 1;
                // setRow = worksheet.getRow(_row);
                // setRow.getCell(12).value = Number(total_cash1) ; 
            // /*==================================================== bank ==================================================================*/ 
                Utils.excelInsertRows(worksheet, _row+1, dt_Bank.length-2)
                for (var i = 0; i < dt_Bank.length; i++)
                {
                    _row++;
                    setRow = worksheet.getRow(_row);
                    setRow.getCell(3).value = dt_Bank[i].CCY;
                    setRow.getCell(4).value = dt_Bank[i].PARTNER_NAME;
                    setRow.getCell(5).value = dt_Bank[i].BANK_ID;
                    setRow.getCell(6).value = Number(dt_Bank[i].O_BAL_TR_AMT);
                    setRow.getCell(7).value = Number(dt_Bank[i].DEBIT_TR_AMT);
                    setRow.getCell(8).value = Number(dt_Bank[i].CREDIT_TR_AMT);
                    setRow.getCell(9).value = Number(dt_Bank[i].END_TR_AMT);
                    setRow.getCell(10).value = Number(dt_Bank[i].END_BK_AMT);
                        
                    var cols = "J"+(_row);
                    var rows = "1"; 
                    var cols_rate = "L"; 
                    var _ccy = dt_Bank[i].CCY_;
                    rows = (_ccy == "VND")?"1":(_ccy == "USD")?"2":(_ccy == "EUR")?"3":(_ccy == "KRW")?"4":"1"; 

                    cols_rate = "L"+(rows);
                    cols	  = "I"+(_row );

                    setRow.getCell(12).value =  { formula :"("+cols+"*"+cols_rate+")/$L$4"}; 

                    let _bank_id = dt_Bank[i].BANK_ID;
                    let _partner_nm = dt_Bank[i].PARTNER_NAME;
                    if ((_bank_id == ""||_bank_id == "null" ||_bank_id == null||_bank_id == undefined ) && 
                        (_partner_nm == ""||_partner_nm == "null" ||_partner_nm == null||_partner_nm == undefined))
                    {  
                        // exSheet.Range["A"+(_row  + dt_Bank.length-1)+":M"+(_row  + dt_bank.Rows.Count-1)].Copy("A"+(_row + i)+":M"+(_row + i), XlPasteType.xlPasteFormats);
                        setRow.getCell(5).value = _ccy+" 예금 합계"; 
                        setRow.getCell(5).alignment = {  horizontal: 'right' };
                        for(var f = 3; f<=12; f ++)
                        { 
                            if(f!=11)
                            {
                                setRow.getCell(f).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "DAEEF3" } }; 
                                
                            }
                        }
                    }
                    else
                    { 
                        total_bank = total_bank + Number(dt_Bank[i].END_BK_AMT);
                        total_bank1 = total_bank1 + Number(dt_Bank[i].END_BK_AMT_BY_RATE);
                        setRow.getCell(5).alignment = {  horizontal: 'left' };
                    }

                    for(var f = 6; f<=9; f ++)
                    { 
                        setRow.getCell(f).numFmt  = (_ccy == "VND")?"_ * #,##0 ₫ ;[Red]* -#,##0 ₫ ; -":"_ $ * #,##0.00 ;[Red] $ * -#,##0.00 ; -";  
                    }
                }
                _row++;
                setRow = worksheet.getRow(_row);
                setRow.getCell(12).value = Number(total_bank1) + Number(total_cash1);  
                setRow.getCell(10).value = Number(total_bank) + Number(total_cash);    
                worksheet.mergeCells(_row,2,_row,5);
                setRow.getCell(2).alignment = {  horizontal: 'center' };
            // /*====================================================================== Partner =======================================================*/
                _row++;
                setRow = worksheet.getRow(_row);
                Utils.excelInsertRows(worksheet, _row+1, dt_Partner.length-2)
                for (var i = 0; i < dt_Partner.length; i++)
                {
                    _row++;
                    setRow = worksheet.getRow(_row);
                    setRow.getCell(3).value = dt_Partner[i].CCY;
                    setRow.getCell(4).value = dt_Partner[i].PARTNER_ID;
                    setRow.getCell(5).value = dt_Partner[i].PARTNER_NAME;
                    setRow.getCell(6).value  = Number(dt_Partner[i].O_BAL_TR_AMT);
                    setRow.getCell(7).value  = Number(dt_Partner[i].DEBIT_TR_AMT);
                    setRow.getCell(8).value  = Number(dt_Partner[i].CREDIT_TR_AMT);
                    setRow.getCell(9).value  = Number(dt_Partner[i].END_TR_AMT);
                    setRow.getCell(10).value = Number(dt_Partner[i].END_BK_AMT);
                         
                    var cols = "J"+(_row); 
                    
                    var rows = "1"; 
                    var cols_rate = "L"; 
                    var _ccy = dt_Partner[i].CCY_;
                    rows = (_ccy == "VND")?"1":(_ccy == "USD")?"2":(_ccy == "EUR")?"3":(_ccy == "KRW")?"4":"1"; 
                    
                    cols_rate = "L"+(rows);
                    cols	  = "I"+(_row);
                    setRow.getCell(12).value =  { formula :"("+cols+"*"+cols_rate+")/$L$4"};   
                        
                    for(var f = 6; f<=9; f ++)
                    { 
                        setRow.getCell(f).numFmt  = (_ccy == "VND")?"_ * #,##0 ₫ ;[Red]* -#,##0 ₫ ; -":"_ $ * #,##0.00 ;[Red] $ * -#,##0.00 ; -";   
                    } 
                         
                    let _partner_id = dt_Partner[i].PARTNER_ID;
                    let _partner_nm = dt_Partner[i].PARTNER_NAME;
                    if ((_partner_id == ""||_partner_id == "null" ||_partner_id == null||_partner_id == undefined ) && 
                        (_partner_nm == ""||_partner_nm == "null" ||_partner_nm == null||_partner_nm == undefined))
                    {  
                        // exSheet.Range["A"+(_row  + dt_partner.Rows.Count-1)+":M"+(_row  + dt_partner.Rows.Count-1)].Copy("A"+(_row + i)+":M"+(_row + i), XlPasteType.xlPasteFormats);
                            setRow.getCell(5).value =  _ccy + " 보증금 합계";
                            setRow.getCell(5).alignment = {  horizontal: 'right' };
                            for(var f = 3; f<=12; f ++)
                            { 
                                if(f!=11)
                                {
                                    setRow.getCell(f).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "DAEEF3" } }; 
                                    
                                }
                            }
                    } 
                    else
                    {
                        total_asset  = total_asset +  Number(dt_Partner[i].END_BK_AMT);
                        total_asset1 = total_asset1 + Number(dt_Partner[i].END_BK_AMT_BY_RATE);
                        setRow.getCell(5).alignment = {  horizontal: 'left' };
                    }
                }
                _row++;
                setRow = worksheet.getRow(_row);
                setRow.getCell(12).value =  Number(total_asset1); 
                setRow.getCell(10).value =  Number(total_asset);
                worksheet.mergeCells(_row,2,_row,5);
                setRow.getCell(2).alignment = {  horizontal: 'center' };
            //     /*========================================================= LIABILITy ===============================================*/
                _row++;
                setRow = worksheet.getRow(_row);
                Utils.excelInsertRows(worksheet, _row+1, dt_Liabiliti.length-2)  
                for (var i = 0; i < dt_Liabiliti.length; i++)
                {
                    _row++;
                    setRow = worksheet.getRow(_row);

                    setRow.getCell(2).value =  dt_Liabiliti[i].AC_CD;
                    setRow.getCell(3).value =  dt_Liabiliti[i].CCY;
                    setRow.getCell(4).value =  dt_Liabiliti[i].BANK_ID;
                    setRow.getCell(5).value =  dt_Liabiliti[i].PARTNER_NAME;
                    setRow.getCell(6).value =  Number(dt_Liabiliti[i].O_BAL_TR_AMT);
                    setRow.getCell(7).value =  Number(dt_Liabiliti[i].DEBIT_TR_AMT);
                    setRow.getCell(8).value =  Number(dt_Liabiliti[i].CREDIT_TR_AMT);
                    setRow.getCell(9).value =  Number(dt_Liabiliti[i].END_TR_AMT);
                    setRow.getCell(10).value =  Number(dt_Liabiliti[i].END_BK_AMT);
                      
                    var cols = "J"+(_row); 
                    var rows = "1"; 
                    var cols_rate = "L"; 
                    var _ccy = dt_Liabiliti[i].CCY_;
                    rows = (_ccy == "VND")?"1":(_ccy == "USD")?"2":(_ccy == "EUR")?"3":(_ccy == "KRW")?"4":"1"; 
                    cols_rate = "L"+(rows);
                    cols	  = "I"+(_row);
                    setRow.getCell(12).value =  { formula :"("+cols+"*"+cols_rate+")/$L$4"};    
                      
                    for(var f = 6; f<=9; f ++)
                    { 
                        setRow.getCell(f).numFmt  = (_ccy == "VND")?"_ * #,##0 ₫ ;[Red]* -#,##0 ₫ ; -":"_ $ * #,##0.00 ;[Red] $ * -#,##0.00 ; -";    
                    }  

                    let _bank_id = dt_Liabiliti[i].BANK_ID;
                    let _partner_nm = dt_Liabiliti[i].PARTNER_NAME;
                    if ((_bank_id == ""||_bank_id == "null" ||_bank_id == null||_bank_id == undefined ) && 
                        (_partner_nm == ""||_partner_nm == "null" ||_partner_nm == null||_partner_nm == undefined))
                    {   
                        setRow.getCell(5).value =  _ccy + " 차입금 합계";
                        setRow.getCell(5).alignment = {  horizontal: 'right' };
                        for(var f = 3; f<=12; f ++)
                        { 
                            if(f!=11)
                            {
                                setRow.getCell(f).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "DAEEF3" } };  
                            }
                        } 
                    }
                    
                    if (dt_Liabiliti[i].BANK_ID != "" || dt_Liabiliti[i].PARTNER_NAME != "")
                    {
                        total_lib  = total_lib  + Number(dt_Liabiliti[i].END_BK_AMT);
                        total_lib1 = total_lib1 + Number(dt_Liabiliti[i].END_BK_AMT_BY_RATE);
                        setRow.getCell(5).alignment = {  horizontal: 'left' };
                    }
                }
                _row++;
                setRow = worksheet.getRow(_row);
                setRow.getCell(12).value =  Number(total_lib1); 
                setRow.getCell(10).value =  Number(total_lib);  
                worksheet.mergeCells(_row,2,_row,5);
                setRow.getCell(2).alignment = {  horizontal: 'center' };
                 
            //    /*=========================================== 131 SUm =============================*/
               setRow = worksheet.getRow(5);
               setRow.getCell(10).value = Number(total_bank ) + Number(total_cash)  + Number(total_asset)  - Number(total_lib);
               setRow.getCell(12).value = Number(total_bank1) + Number(total_cash1) + Number(total_asset1) - Number(total_lib1);
 
                if (dt_131Sum.length >0 )
                {
                    total_receive   = Number(dt_131Sum[0].BAL_BOOK_AMT);
                    total_receive1  = Number(dt_131Sum[0].BAL_BOOK_AMT_BY_RATE);
                }else
                {
                    total_receive = 0;			
                    total_receive1 = 0;			
                } 
                setRow = worksheet.getRow(6);
                setRow.getCell(10).value = Number(total_receive); 
                setRow.getCell(12).value = Number(total_receive1);  

                setRow = worksheet.getRow(7);
                setRow.getCell(10).value = (Number(total_bank) + Number(total_cash) + Number(total_asset) - Number(total_lib)) + Number(total_receive);
                setRow.getCell(12).value = (Number(total_bank1) + Number(total_cash1) + Number(total_asset1) - Number(total_lib1)) + Number(total_receive1);
            // /*====================================================== detail===================================================*/ 
            _row = _row + 4; 
            var krw_sum ="",  vnd_sum ="", count_s = 0, count_e = 0;
            setRow = worksheet.getRow(_row);
            Utils.excelInsertRows(worksheet, _row+1, dt_Detail.length-2)   
            
            for (var i = 0; i < dt_Detail.length; i++)
            {	
                _row ++; 
                setRow = worksheet.getRow(_row);
                var cols ="";
                let _voucher_no = dt_Detail[i].VOUCHER_NO;
                let _seq = dt_Detail[i].SEQ;
                if ((_voucher_no == ""||_voucher_no == "null" ||_voucher_no == null||_voucher_no == undefined ) && 
                    (_seq == ""||_seq == "null" ||_seq == null||_seq == undefined))
                {  
                    // exSheet.Range["A"+(_row  + dt_dtl.Rows.Count-1)+":P"+(_row  + dt_dtl.Rows.Count-1)].Copy("A"+(_row + i)+":P"+(_row + i), XlPasteType.xlPasteFormats);
                    worksheet.mergeCells(_row,2,_row,4); 
                    setRow.getCell(2).value = dt_Detail[i].GROUP_TYPE;  
                        setRow.getCell(2).alignment = {  horizontal: 'center' };
                    // exSheet.Range["B"+(_row + count_s)+":D"+(_row + count_e-1)].Merge();
                    for(var f = 2; f<=16; f ++)
                    {   
                        setRow.getCell(f).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "DAEEF3" } };   

                    } 
                    count_s =count_e + 1;
                    if (vnd_sum =="")
                    {
                        vnd_sum  = "=K"+(_row );
                        krw_sum  = "=M"+(_row );
                    }else
                    {
                        vnd_sum  = vnd_sum + " + K"+(_row );
                        krw_sum  = krw_sum + " + M"+(_row );
                    }
                }
                

                if(dt_Detail[i].CCY  == "VND")
                {
                        setRow.getCell(5).numFmt  = "_ * #,##0 ₫ ;[Red]* -#,##0 ₫ ; -";
                        setRow.getCell(6).numFmt  = "_ * #,##0 ₫ ;[Red]* -#,##0 ₫ ; -";
                }
                    else
                {
                         setRow.getCell(5).numFmt = "_ $ * #,##0.00 ;[Red] $ * -#,##0.00 ; -";
                         setRow.getCell(6).numFmt = "_ $ * #,##0.00 ;[Red] $ * -#,##0.00 ; -";
                }
                        
                setRow.getCell(5).value  = Number(dt_Detail[i].DEBIT_AMT);
                setRow.getCell(6).value  = Number(dt_Detail[i].CREDIT_AMT);
                setRow.getCell(15).value = Number(dt_Detail[i].VND_DEBIT_AMT);
                setRow.getCell(16).value = Number(dt_Detail[i].VND_CREDIT_AMT);
                 
                // exSheet.Range["G"+(_row + i)+":H"+(_row + i)].Merge();				
                // exSheet.Range["B"+(_row + i)+":D"+(_row + i)].Merge();
                setRow.getCell(7).value = dt_Detail[i].REMARK;
                setRow.getCell(9).value = dt_Detail[i].TR_DATE;
                setRow.getCell(10).value = dt_Detail[i].VOUCHER_NO;
 
                // exSheet.Range["K"+(_row + i)+":L"+(_row + i)].Merge();
                 
                if (dt_Detail[i].VND_AMT !="")
                {  
                    setRow.getCell(11).value =  { formula :"(O"+(_row + i) + "-"+"P"+(_row + i)+")"};    
                    worksheet.mergeCells(_row,11,_row,12); 
                    cols	  = "K"+(_row + i); 
                    setRow.getCell(13).value =  { formula :"("+cols+")/$L$4"};    
                }
                setRow.getCell(14).value  = dt_Detail[i].TR_ENCLOSE;  
                count_e = count_e + 1 ;				
                
            }
            _row++;
            setRow = worksheet.getRow(_row);
            if (dt_Detail.length > 0 )
            { 
                setRow.getCell(11).value =  { formula :vnd_sum};  
                worksheet.mergeCells(_row,11,_row,12);   
                setRow.getCell(13).value =  { formula :krw_sum};    
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
/*########################################################## Report rpt6045055_DailyDetailST ##################################################################################*/ 
    // async rpt6045055_DailyDetailST({ request, response, auth }) {
    //     try 
    //     { 
    //     /*P_RPT_ID: report_info.VAL1, P_RPT_URL: report_info.VAL2, P_RPT_FILE: report_info.VAL3, 
    //     P_COMP_ID: company_info.PARTNER_ID, P_COMP_NM: company_info.TEXT, P_COMP_TAX: company_info.TAX_CODE, P_COMP_ADD: company_info.ADDR2, 
    //     P_COMPANY: this.selectedCompany, P_FR_DATE: this.from_date, P_TO_DATE: this.to_date, P_DEPOSIT_ACC  : this.selectedDepositAccount, P_STATUS : this.selectedStatus, 
    //     P_CCY: this.selectedCurrency*/
    //         /****************************** Get Param *********************************/
    //         let { para }        = request.get(['para']);
    //         /********* Parse pram to json ********/
    //         var item            = JSON.parse(para); 
    //         const user          = await auth.getUser() ;
    //         const p_crt_by      = user.USER_ID;
    //         const p_language    = request.header("accept-language", "ENG");
    //         var file_nm         = [item.P_RPT_FILE];
    //         var file_type       = ".xlsx";
    //         var full_nm         = file_nm + file_type;
    //         var file_new        = file_nm + p_crt_by + file_type;
    //         var _resourcesPath  = [item.P_RPT_URL]+'/'+full_nm;
    //         var _COMP_ID        = item.P_COMP_ID, _COMP_NM = item.P_COMP_NM, _COMP_TAX = item.P_COMP_TAX, _COMP_ADD = item.P_COMP_ADD;
    //         var BIZ_ID          = item.P_BIZ_ID , BIZ_NM  = item.P_BIZ_NM , BIZ_TAX  = item.P_BIZ_TAX , BIZ_ADD  = item.P_BIZ_ADD; 
    //         var _param_data     =[item.P_COMPANY, item.P_FR_DATE, item.P_TO_DATE, item.P_DEPOSIT_ACC, item.P_STATUS, item.P_CCY, item.P_TCO_BUSPLACE_PK ]; 
    //         /***************************** Return failded ****************************/
    //         if (!user) 
    //         {
    //             return response.send(Utils.response(false, "Request failed!", null));
    //         } 
    //         /****************************** Begin call store and write excell *********/
    //         else 
    //         { 
    //             /********* Call store  ***************/ 
    //             var dt_Loan  = await DBService.callProcCursor("AC_RPT_6045055_DAILYST_LOAN", _param_rate, p_language, p_crt_by);  
    //             dt_Loan  = (dt_Loan.length >0)?dt_Loan:[];

    //             var dt_AdvEpm  = await DBService.callProcCursor("AC_RPT_6045055_DAILYST_ADV_EMP", _param_data, p_language, p_crt_by);  
    //             dt_AdvEpm  = (dt_AdvEpm.length >0)?dt_AdvEpm:[];
                
    //             var dt_Detail  = await DBService.callProcCursor("AC_RPT_6045055_DAILYST_DETAIL", _param_data, p_language, p_crt_by);  
    //             dt_Detail  = (dt_Detail.length >0)?dt_Detail:[];

                
                
    //             /********* Read file excel ********/ 
    //             const templateFile  = Helpers.resourcesPath(_resourcesPath); 
    //             await workbook.xlsx.readFile(templateFile);
    //             var worksheet       = workbook.getWorksheet(1);
    //             /********* Write file excel ********/  
    //             var l_bank_ccy = "",l_book_ccy = item.P_BOOK_CCY;
    //             var _row = 1, setRow = worksheet.getRow(_row);
    //             var _arr_color = { type: "pattern", pattern: "solid", fgColor: { argb: "ceebfd" } };
    //             /*========================================== */
    //             var _datefr =  Utils._formatDate(item.P_FR_DATE_DATE,"DD/MM/YYYY");
    //             var _space  = " ~ "
    //             var _dateto =  Utils._formatDate(item.P_TO_DATE,"DD/MM/YYYY"); 
    //             worksheet.getCell("E2").value   =   _datefr + _space + _dateto;
    //             worksheet.getCell("C5").value   =   item.P_RATE;

    //             setRow = worksheet.getRow(_row);
    //             for(let f = 6; f<=11; f ++)
    //             {   
    //                 setRow.getCell(f).fill = _arr_color   
    //             } 
    //             _row = 6; setRow = worksheet.getRow(_row);
    //             for(let f = 1; f<=11; f ++)
    //             {   
    //                 setRow.getCell(f).fill = _arr_color   
    //             }
                
                 

                 
    //             /********* Print file excel ********/ 
    //             const reportFile    = Helpers.tmpPath(file_new);
    //             await workbook.xlsx.writeFile(reportFile)
    //             return response.attachment( reportFile, file_new);
    //         }
    //     } 
    //     catch (e) 
    //     {
    //         return response.send(Utils.response(false, e.message, null))
    //     }
    // }   
}

module.exports = rpt6045055;