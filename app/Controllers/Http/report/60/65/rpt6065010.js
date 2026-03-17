"use strict";
const Helpers       = use('Helpers')
const Antl          = use("Antl");
const Utils         = use("Utils");
const DBService = use("DBService")
var Excel           = use('exceljs');
var workbook        = new Excel.Workbook();    
class rpt6065010 {
/*########################################################## Report JH ##################################################################################*/ 
    async rpt_6065010_JH({ request, response, auth }) {
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
            var _store          = "AC_SEL_6065010_01";
            var _param          = [ item.P_COMPANY    , item.P_DT_MONTH, item.P_VAT_TYPE   , item.P_TAX_RATE  , 
                                    item.P_CURRENT_CCY, item.P_STATUS  ,  item.P_CUST_PK   , item.P_INVOICE_NO, 
                                    item.P_AC_CD      , item.P_SEQ     ,  item.P_VOUCHER_NO, item.P_BALANCE   , 
                                    item.P_DT_FR      , item.P_DT_TO   ,  item.P_BIZ];
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
                if (dt_Data) 
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
                
                var pos = 5; 
                if(dt_Data.length>1)
                {
                    worksheet.duplicateRow(pos,dt_Data.length-1,false);
                }   
                for (var i = 0; i < dt_Data.length; i++) 
                {
                    var row_item = worksheet.getRow(pos + i);

                    row_item.getCell(1).value = dt_Data[i].STD_YM;  
                    row_item.getCell(2).value = dt_Data[i].VOUCHERNO;  
                    row_item.getCell(3).value = dt_Data[i].PARTNER_NAME;  
                    row_item.getCell(4).value = dt_Data[i].LICENSE_NO;  
                    row_item.getCell(5).value = dt_Data[i].NET_AMT;  
                    row_item.getCell(6).value = dt_Data[i].TAX_AMT;  
                    row_item.getCell(7).value = dt_Data[i].TOTAL_AMT;  
                    row_item.getCell(8).value = dt_Data[i].VAT_REMARK;   
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
    async rpt_6065010_JH1({ request, response, auth }) {
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
            var _store          = "AC_SEL_6065010_01";
            var _param          = [ item.P_COMPANY    , item.P_DT_MONTH, item.P_VAT_TYPE   , item.P_TAX_RATE  , 
                                    item.P_CURRENT_CCY, item.P_STATUS  ,  item.P_CUST_PK   , item.P_INVOICE_NO, 
                                    item.P_AC_CD      , item.P_SEQ     ,  item.P_VOUCHER_NO, '999'   , 
                                    item.P_DT_FR      , item.P_DT_TO   ,  item.P_BIZ];
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
                if (dt_Data) 
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
                
                var pos = 6;
                if(dt_Data.length>1)
                {
                    worksheet.duplicateRow(pos,dt_Data.length-1,false);
                }  
                for (var i = 0; i < dt_Data.length; i++) 
                {
                    var row_item = worksheet.getRow(pos + i);

                    row_item.getCell(1).value = dt_Data[i].NUM;  
                    row_item.getCell(2).value = dt_Data[i].TAX_CODE;  
                    row_item.getCell(3).value = dt_Data[i].WEB_SITE;  
                    row_item.getCell(4).value = dt_Data[i].EMAIL;  
                    row_item.getCell(5).value = dt_Data[i].CHARGER_NM;  
                    row_item.getCell(6).value = dt_Data[i].EMAIL_ADDRESS;  
                    row_item.getCell(7).value = dt_Data[i].TAX_TYPE;  
                    row_item.getCell(8).value = dt_Data[i].SEQ;  
                    row_item.getCell(9).value = dt_Data[i].STD_YMD;  
                    row_item.getCell(10).value = dt_Data[i].NET_AMT;  
                    row_item.getCell(11).value = dt_Data[i].TAX_AMT;  
                    row_item.getCell(12).value = dt_Data[i].TOTAL_AMT;  
                    row_item.getCell(13).value = "";  
                    row_item.getCell(14).value = "";  
                    row_item.getCell(15).value = "";  
                    row_item.getCell(16).value = dt_Data[i].VAT_INOUT;  
                    row_item.getCell(17).value = "";  
                    row_item.getCell(18).value = "";  
                    row_item.getCell(19).value = "";  
                    row_item.getCell(20).value = "";  
                    row_item.getCell(21).value = "";  
                    row_item.getCell(22).value = "";  
                    row_item.getCell(23).value = dt_Data[i].STD_MD;  
                    row_item.getCell(24).value = dt_Data[i].TCO_CIITEM_NM;  
                    row_item.getCell(25).value = "";  
                    row_item.getCell(26).value = "";  
                    row_item.getCell(27).value = "";  
                    row_item.getCell(28).value = dt_Data[i].NET_AMT;  
                    row_item.getCell(29).value = dt_Data[i].TAX_AMT;  
                    row_item.getCell(30).value = "";   
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
    async rpt_6065010_IMPORT_VAT_IN_119({ request, response, auth }) {
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
            var COMP_ID         = item.P_COMP_ID, COMP_NM = item.P_COMP_NM, COMP_TAX = item.P_COMP_TAX, COMP_ADD = item.P_COMP_ADD;
            const p_crt_by      = user.USER_ID;
            const p_language    = request.header("accept-language", "ENG");
            var file_nm         = [item.P_RPT_FILE];
            var file_type       = ".xlsx";
            var full_nm         = file_nm + file_type;
            var file_new        = file_nm + p_crt_by + file_type;
            var _resourcesPath  = [item.P_RPT_URL]+'/'+full_nm;
            var _store_code     = "SYS_SEL_SYCO001_COMMON_CODE"; 
            var _store          = "AC_RPT_6065010_IMP_VAT_IN";
            var _param_code     = ['1', item.P_COMPANY, '' , 'ACBG0188']
           
             /***************************** Return failded ****************************/
            if (!user) 
            {
                return response.send(Utils.response(false, "Request failed!", null));
            } 
            /****************************** Begin call store and write excell *********/
            else 
            { 
                 /********* Call store comon code  ***************/ 
                 var VAT_YN = "";
                 var dt_Code  = await DBService.callProcCursor(_store_code, _param_code, p_language, p_crt_by); 
                 if (dt_Code.length>0) 
                 {
                    dt_Code = dt_Code;
                    VAT_YN = dt_Code[0].CODE;
                 } 

                /********* Call store  ***************/ 
                var _param          = [ item.P_COMPANY  , item.P_STATUS, item.P_AC_CD , item.P_DT_FR,
                     item.P_DT_TO , item.P_VOUCHER_NO, VAT_YN, item.P_VAT_TYPE,  item.P_BIZ];
                var dt_Data  = await DBService.callProcCursor(_store, _param, p_language, p_crt_by); 
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
                //INFOMATION COMPANY
                worksheet.getCell("D8").value = dt_Data[0].LOC_LNM; //COMP_NM;
               // worksheet.getCell("D9").value = COMP_ADD;
                worksheet.getCell("D9").value = dt_Data[0].TAX_CD; //COMP_TAX;
                var _dt_month = item.P_DT_MONTH;
                var l_month = _dt_month.substr(4,2);
                var l_year = _dt_month.substr(0,4);
                worksheet.getCell("A7").value = "[01] Kỳ tính thuế: tháng.."+l_month+"..năm .."+l_year+".. hoặc quý.....năm....";

                /********* Write file excel ********/
                /*Set Header */ 
                //worksheet.getCell("B47").value = temp;
                
                var pos = 17;
                var _total_net_amt = 0;
                var _total_tax_amt = 0;
                if(dt_Data.length>1)
                {
                    worksheet.duplicateRow(pos,dt_Data.length-1,true); 
                }  
                _total_net_amt = dt_Data[0].TOTAL_NET_AMT;
                _total_tax_amt = dt_Data[0].TOTAL_TAX_AMT;
                for (var i = 0; i < dt_Data.length; i++) 
                {
                    var row_item = worksheet.getRow(pos);

                    row_item.getCell(1).value = i + 1;
                    row_item.getCell(2).value = dt_Data[i].INVOICE_NO;  
                    row_item.getCell(3).value = dt_Data[i].INVOICE_DATE;  
                    row_item.getCell(4).value = dt_Data[i].PARTNER_NAME;  
                    row_item.getCell(5).value = dt_Data[i].TAX_CODE;  
                    row_item.getCell(6).value = dt_Data[i].NET_AMT;  
                    row_item.getCell(7).value = dt_Data[i].TAX_AMT;   
                    row_item.getCell(8).value = dt_Data[i].NOTE;  

                    //total
                  //  _total_net_amt += Number(dt_Data[i].NET_AMT);
                  //  _total_tax_amt += Number(dt_Data[i].TAX_AMT);
                    pos = pos + 1;   
                }    
                var row = worksheet.getRow(pos );
                row.getCell(6).value = _total_net_amt;
                row.getCell(7).value = _total_tax_amt;
                worksheet.mergeCells(pos,1,pos,4); 
                worksheet.mergeCells(pos + 3, 1, pos + 3, 4); 
                worksheet.mergeCells(pos + 6, 1, pos + 6, 4); 
                row = worksheet.getRow(pos + 8);
                row.getCell(6).value = _total_net_amt;
                row = worksheet.getRow(pos + 9);
                row.getCell(6).value  = _total_tax_amt;

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
    
    async rpt_6065010_IMPORT_VAT_OUT_119({ request, response, auth }) {
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
            var COMP_ID         = item.P_COMP_ID, COMP_NM = item.P_COMP_NM, COMP_TAX = item.P_COMP_TAX, COMP_ADD = item.P_COMP_ADD;
            const p_crt_by      = user.USER_ID;
            const p_language    = request.header("accept-language", "ENG");
            var file_nm         = [item.P_RPT_FILE];
            var file_type       = ".xlsx";
            var full_nm         = file_nm + file_type;
            var file_new        = file_nm + p_crt_by + file_type;
            var _resourcesPath  = [item.P_RPT_URL]+'/'+full_nm;
            var _store_code     = "SYS_SEL_SYCO001_COMMON_CODE"; 
            var _store          = "AC_RPT_6065010_IMP_OUT_NOCACHE";
            var _param_code     = ['1', item.P_COMPANY, '' , 'ACBG0188']
           
             /***************************** Return failded ****************************/
            if (!user) 
            {
                return response.send(Utils.response(false, "Request failed!", null));
            } 
            /****************************** Begin call store and write excell *********/
            else 
            { 
                 /********* Call store comon code  ***************/ 
                 var VAT_YN = "";
                 var dt_Code  = await DBService.callProcCursor(_store_code, _param_code, p_language, p_crt_by); 
                 if (dt_Code.length>0) 
                 {
                    dt_Code = dt_Code;
                    VAT_YN = dt_Code[0].CODE;
                 } 

                /********* Call store  ***************/ 
                var _param          = [ item.P_COMPANY  , item.P_STATUS, item.P_AC_CD , item.P_DT_FR,
                     item.P_DT_TO , item.P_VOUCHER_NO, VAT_YN, item.P_VAT_TYPE,  item.P_BIZ];
                var dt_Data  = await DBService.callProcCursor(_store, _param, p_language, p_crt_by); 
                if (dt_Data.length>0) 
                {
                    dt_Data = dt_Data;
                } 
                else 
                {
                    return response.send(Utils.response(false, "No_Data", null))
                } 
                
                /********* Read file excel ********/ 
                const templateFile  = Helpers.resourcesPath(_resourcesPath); 
                await workbook.xlsx.readFile(templateFile);
                var worksheet       = workbook.getWorksheet(1);
                //INFOMATION COMPANY
                worksheet.getCell("C8").value = dt_Data[0].LOC_LNM; //COMP_NM;
               // worksheet.getCell("D9").value = COMP_ADD;
                worksheet.getCell("C9").value = dt_Data[0].TAX_CD; //COMP_TAX;
                var _dt_month = item.P_DT_MONTH;
                var l_month = _dt_month.substr(4,2);
                var l_year = _dt_month.substr(0,4);
                worksheet.getCell("A7").value = "[01] Kỳ tính thuế: tháng.."+l_month+"..năm .."+l_year+".. hoặc quý.....năm....";

                /********* Write file excel ********/
                /*Set Header */ 
                //worksheet.getCell("B47").value = temp;
                
                var pos = 20;
                var _total_net_amt_10 = 0;
                var _total_tax_amt_10 = 0;

                var _total_net_amt_8 = 0;
                var _total_tax_amt_8 = 0;

                var _total_net_amt_5 = 0;
                var _total_tax_amt_5 = 0;

                var _total_net_amt_0 = 0;
                var _total_tax_amt_0 = 0;

                var _total_net_amt_none = 0;
                var _total_tax_amt_none = 0;

                var _sum_net =0;
                var _sum_tax =0;

                var _rate_10 = 0;
                var _rate_8 = 0;
                var _rate_5 = 0;
                var _rate_0 = 0;
                var _rate_none = 0;

                var pos_rate_8 = 29;
                var pos_rate_10 = 26;
                var pos_rate_5 = 23;
                var pos_rate_0 = 20;
                var pos_rate_none = 17;    
                var row_item;
                //console.log(dt_Data[0]);
                if(dt_Data.length>=1)
                {
                     _rate_10 = dt_Data[0].S_RATE_10;
                     _rate_8 = dt_Data[0].S_RATE_8;
                     _rate_5 = dt_Data[0].S_RATE_5;
                     _rate_0 = dt_Data[0].S_RATE_0;
                     _rate_none = dt_Data[0].S_RATE_NONE;

                     _total_net_amt_10 = dt_Data[0].S_NET_10;
                     _total_tax_amt_10 = dt_Data[0].S_TAX_10;

                     _total_net_amt_8 = dt_Data[0].S_NET_8;
                     _total_tax_amt_8 = dt_Data[0].S_TAX_8;
    
                     _total_net_amt_5 = dt_Data[0].S_NET_5;
                     _total_tax_amt_5 = dt_Data[0].S_TAX_5;
    
                     _total_net_amt_0 = dt_Data[0].S_NET_0;
                     _total_tax_amt_0 = dt_Data[0].S_TAX_0;
    
                     _total_net_amt_none = dt_Data[0].S_NET_NONE;
                     _total_tax_amt_none = dt_Data[0].S_TAX_NONE;

                     _sum_net  = dt_Data[0].S_NET;
                     _sum_tax  = dt_Data[0].S_TAX;
                }
                if(dt_Data.length>1)
                {
                     //insert row
                    if (Number(_rate_8)>0)
                     {
                        if (Number(_rate_8)>1)
                        {
                            worksheet.duplicateRow(pos_rate_8,_rate_8-1,true);  
                        }
                         for (var i = 0; i < dt_Data.length; i++) 
                         {
                             
                             if (dt_Data[i].TAX_RATE =="8%")
                             {
                                 row_item = worksheet.getRow(pos_rate_8);
                                 row_item.getCell(1).value = i + 1;
                                 row_item.getCell(2).value = dt_Data[i].INVOICE_NO;  
                                 row_item.getCell(3).value = dt_Data[i].INVOICE_DATE;  
                                 row_item.getCell(4).value = dt_Data[i].PARTNER_NAME;  
                                 row_item.getCell(5).value = dt_Data[i].TAX_CODE;  
                                 row_item.getCell(6).value = dt_Data[i].NET_AMT;  
                                 row_item.getCell(7).value = dt_Data[i].TAX_AMT;   
                                 row_item.getCell(8).value = dt_Data[i].NOTE;  
                                 pos_rate_8 =pos_rate_8 +1;
                             }  
                         }   
                         row_item = worksheet.getRow(pos_rate_8 );
                         row_item.getCell(6).value = _total_net_amt_8;
                         row_item.getCell(7).value  = _total_tax_amt_8;    
                         
                         row_item = worksheet.getRow(pos_rate_8 + 2);
                         row_item.getCell(6).value = _sum_net;
                         row_item = worksheet.getRow(pos_rate_8 + 3);
                         row_item.getCell(6).value  = _sum_tax;
                     }
                    if (Number(_rate_10)>0)
                    {
                        if (Number(_rate_10)>1)
                        {
                            worksheet.duplicateRow(pos_rate_10,_rate_10-1,true);   
                        }
                        for (var i = 0; i < dt_Data.length; i++) 
                        {
                            
                            if (dt_Data[i].TAX_RATE =="10%")
                            {
                                row_item = worksheet.getRow(pos_rate_10);
                                row_item.getCell(1).value = i + 1;
                                row_item.getCell(2).value = dt_Data[i].INVOICE_NO;  
                                row_item.getCell(3).value = dt_Data[i].INVOICE_DATE;  
                                row_item.getCell(4).value = dt_Data[i].PARTNER_NAME;  
                                row_item.getCell(5).value = dt_Data[i].TAX_CODE;  
                                row_item.getCell(6).value = dt_Data[i].NET_AMT;  
                                row_item.getCell(7).value = dt_Data[i].TAX_AMT;   
                                row_item.getCell(8).value = dt_Data[i].NOTE;  
                                pos_rate_10 =pos_rate_10 +1;
                            }  
                        }   
                        row_item = worksheet.getRow(pos_rate_10 );
                        row_item.getCell(6).value = _total_net_amt_10;
                        row_item.getCell(7).value  = _total_tax_amt_10;    
                       
                    }
                    if (Number(_rate_5)>0)
                    {
                        if (Number(_rate_5)>1)
                        {
                            worksheet.duplicateRow(pos_rate_5,_rate_5-1,true);  
                        }
                        for (var i = 0; i < dt_Data.length; i++) 
                        {
                            
                            if (dt_Data[i].TAX_RATE =="5%")
                            {
                                row_item = worksheet.getRow(pos_rate_5);
                                row_item.getCell(1).value = i + 1;
                                row_item.getCell(2).value = dt_Data[i].INVOICE_NO;  
                                row_item.getCell(3).value = dt_Data[i].INVOICE_DATE;  
                                row_item.getCell(4).value = dt_Data[i].PARTNER_NAME;  
                                row_item.getCell(5).value = dt_Data[i].TAX_CODE;  
                                row_item.getCell(6).value = dt_Data[i].NET_AMT;  
                                row_item.getCell(7).value = dt_Data[i].TAX_AMT;   
                                row_item.getCell(8).value = dt_Data[i].NOTE;  
                                pos_rate_5 =pos_rate_5 +1;
                            } 
                            
                        } 
                        row_item = worksheet.getRow(pos_rate_5 );
                        row_item.getCell(6).value = _total_net_amt_5;
                        row_item.getCell(7).value  = _total_tax_amt_5;
                    }
                    if (Number(_rate_0)>0)
                    {
                        if (Number(_rate_0)>1)
                        {
                            worksheet.duplicateRow(pos_rate_0,_rate_0-1,true);  
                        }
                        for (var i = 0; i < dt_Data.length; i++) 
                        {
                            
                            if (dt_Data[i].TAX_RATE =="0%")
                            {
                                row_item = worksheet.getRow(pos_rate_0);
                                row_item.getCell(1).value = i + 1;
                                row_item.getCell(2).value = dt_Data[i].INVOICE_NO;  
                                row_item.getCell(3).value = dt_Data[i].INVOICE_DATE;  
                                row_item.getCell(4).value = dt_Data[i].PARTNER_NAME;  
                                row_item.getCell(5).value = dt_Data[i].TAX_CODE;  
                                row_item.getCell(6).value = dt_Data[i].NET_AMT;  
                                row_item.getCell(7).value = dt_Data[i].TAX_AMT;   
                                row_item.getCell(8).value = dt_Data[i].NOTE;  
                                pos_rate_0 =pos_rate_0 +1;
                            } 
                            
                        } 
                        row_item = worksheet.getRow(pos_rate_0 );
                        row_item.getCell(6).value = _total_net_amt_0;
                        row_item.getCell(7).value  = _total_tax_amt_0;
                    }
                    if (Number(_rate_none)>0)
                    {
                        if (Number(_rate_none)>1)
                        {
                            worksheet.duplicateRow(pos_rate_none,_rate_none-1,true);  
                        }
                        for (var i = 0; i < dt_Data.length; i++) 
                        { 
                            if (dt_Data[i].TAX_RATE =="none" || dt_Data[i].TAX_RATE =="KCT%")
                            {
                                row_item = worksheet.getRow(pos_rate_none);
                                row_item.getCell(1).value = i + 1;
                                row_item.getCell(2).value = dt_Data[i].INVOICE_NO;  
                                row_item.getCell(3).value = dt_Data[i].INVOICE_DATE;  
                                row_item.getCell(4).value = dt_Data[i].PARTNER_NAME;  
                                row_item.getCell(5).value = dt_Data[i].TAX_CODE;  
                                row_item.getCell(6).value = dt_Data[i].NET_AMT;  
                                row_item.getCell(7).value = dt_Data[i].TAX_AMT;   
                                row_item.getCell(8).value = dt_Data[i].NOTE;  
                                pos_rate_none =pos_rate_none +1;
                            }
                            
                        } 
                        row_item = worksheet.getRow(pos_rate_none);
                        row_item.getCell(6).value = _total_net_amt_none;
                        row_item.getCell(7).value  = _total_tax_amt_none;
                    }
                }  
                
                  
               

                

                

                
               // var row = worksheet.getRow(pos);
                //worksheet.mergeCells(pos,1,pos,4); 
               // worksheet.mergeCells(pos + 3, 1, pos + 3, 4); 
                //worksheet.mergeCells(pos + 6, 1, pos + 6, 4); 
              //  row.getCell(6).value = _total_net_amt;
              //  row.getCell(7).value  = _total_tax_amt;
             
                
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
    async rpt_6065010_VAT_IN_TT156({ request, response, auth }) {
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
            var COMP_ID         = item.P_COMP_ID, COMP_NM = item.P_COMP_NM, COMP_TAX = item.P_COMP_TAX, COMP_ADD = item.P_COMP_ADD;
            var BIZ_ID         = item.P_BIZ_ID , BIZ_NM  = item.P_BIZ_NM , BIZ_TAX  = item.P_BIZ_TAX , BIZ_ADD  = item.P_BIZ_ADD;
            const p_crt_by      = user.USER_ID;
            const p_language    = request.header("accept-language", "ENG");
            var file_nm         = [item.P_RPT_FILE];
            var file_type       = ".xlsx";
            var full_nm         = file_nm + file_type;
            var file_new        = file_nm + p_crt_by + file_type;
            var _resourcesPath  = [item.P_RPT_URL]+'/'+full_nm;
            var _store_code     = "SYS_SEL_SYCO001_COMMON_CODE"; 
            var _store          = "";
            var _param_code     = ['1', item.P_COMPANY, '' , 'ACBG0188']
           
             /***************************** Return failded ****************************/
            if (!user) 
            {
                return response.send(Utils.response(false, "Request failed!", null));
            } 
            /****************************** Begin call store and write excell *********/
            else 
            { 
                 /********* Call store comon code  ***************/ 
                 var VAT_YN = "";
                 var dt_Code  = await DBService.callProcCursor(_store_code, _param_code, p_language, p_crt_by); 
                 if (dt_Code.length>0) 
                 {
                    dt_Code = dt_Code;
                    VAT_YN = dt_Code[0].CODE;
                 } 

                /********* Call store  ***************/ 
                var _param = [ item.P_COMPANY  , item.P_STATUS, item.P_AC_CD , item.P_DT_FR, item.P_DT_TO , item.P_VOUCHER_NO, VAT_YN, item.P_VAT_TYPE,  item.P_BIZ];
                var row_item; 
                /********* Read file excel ********/ 
                const templateFile  = Helpers.resourcesPath(_resourcesPath); 
                await workbook.xlsx.readFile(templateFile);
                var worksheet       = workbook.getWorksheet(1);
                var _dt_month = item.P_DT_MONTH;
                var l_month = _dt_month.substr(4,2);
                var l_year = _dt_month.substr(0,4); 
                //INFOMATION COMPANY
                worksheet.getCell("B7").value =  "Kỳ tính thuế: Tháng "+l_month+" năm "+l_year; 
                worksheet.getCell("D9").value = BIZ_NM; //COMP_NM;
                worksheet.getCell("D10").value = BIZ_TAX; //COMP_TAX;
 
                
                //============================================================================================================================================================ 
                var _row2 = 21;
                var stt2 = 0;
                var NetAmt_Total_2 = 0;
                var TaxAmt_Total_2 = 0;

                _store = "AC_RPT_6065010_VAT_IN2_TT156";
                var dt_2  = await DBService.callProcCursor(_store, _param, p_language, p_crt_by);  
               if(dt_2.length > 1)
                { 
                    worksheet.duplicateRow(_row2,dt_2.length-1,true);
                }
                 
                for (var i = 0; i < dt_2.length;i++)
                {
                    stt2 += 1; 
                    row_item = worksheet.getRow(_row2 + i); 
                    row_item.getCell(2).value  = stt2; 
                    row_item.getCell(3).value  = dt_2[i].FORM_NUMBER;
                    row_item.getCell(4).value  = dt_2[i].SERI_NO;
                    row_item.getCell(5).value  = dt_2[i].INVOICE_NO;
                    row_item.getCell(6).value  = dt_2[i].INVOICE_DATE;
                    row_item.getCell(7).value  = dt_2[i].PARTNER_NAME;
                    row_item.getCell(8).value  = dt_2[i].TAX_CODE;
                    row_item.getCell(9).value  = dt_2[i].TCO_CIITEM_NM;
                    row_item.getCell(10).value = dt_2[i].NET_AMT;
                    row_item.getCell(11).value = dt_2[i].TAX_RATE;
                    row_item.getCell(12).value = dt_2[i].TAX_AMT;
                    row_item.getCell(13).value = dt_2[i].NOTE;
 
                    if(Number(dt_2[i].NET_AMT) !=0)
                        {
                            NetAmt_Total_2 += Number(dt_2[i].NET_AMT);
                        }
                        // else
                        // {
                        //     NetAmt_Total_2 = 0;
                        // }
                        if(Number(dt_2[i].TAX_AMT) !="")
                        {
                            TaxAmt_Total_2 += Number(dt_2[i].TAX_AMT);
                        }
                        // else
                        // {
                        //     TaxAmt_Total_2 = 0;
                        // }
                        
                        row_item = worksheet.getRow(22 + i); 
                        row_item.getCell(10).value = NetAmt_Total_2;
                        row_item.getCell(12).value = TaxAmt_Total_2; 


                } 
                
                //============================================================================================================================================================ 
                    var _row1 = 18;
                    var stt1 = 0;
                    var NetAmt_Total_1 = 0;
                    var TaxAmt_Total_1 = 0;

                    _store = "AC_RPT_6065010_VAT_IN1_TT156";
                    var dt_1  = await DBService.callProcCursor(_store, _param, p_language, p_crt_by);  
                    if(dt_1.length > 1)
                    { 
                        worksheet.duplicateRow(_row1 ,dt_1.length-1,true);
                    } 
                    for (var i = 0; i < dt_1.length;i++)
                    {
                        stt1 += 1; 
                        row_item = worksheet.getRow(_row1 + i); 
                        row_item.getCell(2).value  = stt1; 
                        row_item.getCell(3).value  = dt_1[i].FORM_NUMBER;
                        row_item.getCell(4).value  = dt_1[i].SERI_NO;
                        row_item.getCell(5).value  = dt_1[i].INVOICE_NO;
                        row_item.getCell(6).value  = dt_1[i].INVOICE_DATE;
                        row_item.getCell(7).value  = dt_1[i].PARTNER_NAME;
                        row_item.getCell(8).value  = dt_1[i].TAX_CODE;
                        row_item.getCell(9).value  = dt_1[i].TCO_CIITEM_NM;
                        row_item.getCell(10).value = dt_1[i].NET_AMT;
                        row_item.getCell(11).value = dt_1[i].TAX_RATE;
                        row_item.getCell(12).value = dt_1[i].TAX_AMT; 
                        row_item.getCell(13).value = dt_1[i].NOTE;

                        if(Number(dt_1[i].NET_AMT) !=0)
                            {
                                NetAmt_Total_1 += Number(dt_1[i].NET_AMT);
                            }
                            else
                            // {
                            //     NetAmt_Total_1 = 0;
                            // }
                            if(Number(dt_1[i].TAX_AMT) != 0)
                            {
                                TaxAmt_Total_1 += Number(dt_1[i].TAX_AMT);
                            }
                            // else
                            // {
                            //     TaxAmt_Total_1 = 0;
                            // }
                            
                            row_item = worksheet.getRow(19 + i); 
                            row_item.getCell(10).value = NetAmt_Total_1;
                            row_item.getCell(12).value = TaxAmt_Total_1; 


                    } 
                    
                    var Mot = 0, Hai = 0;
                    Mot = dt_1.length;
                    Hai = dt_2.length;
                    if(Mot>1)
                    {
                        Mot = Mot-1;
                    }
                    if(Hai>1)
                    {
                        Hai = Hai-1;
                    }
                    worksheet.mergeCells(_row1-1,2,_row1-1,13);  
                    worksheet.mergeCells(Mot+_row1+2,2,Mot+_row1+2,13);  
                    worksheet.mergeCells(Mot+ Hai+_row1+5,2,Mot+ Hai+_row1+5,13);    
                    worksheet.mergeCells(Mot+ Hai+_row1+8,2,Mot+ Hai+_row1+8,13);   
                    worksheet.mergeCells(Mot+ Hai+_row1+11,2,Mot+ Hai+_row1+11,13);   
                   /* var _merge_sign = Mot+_row1+4 + Hai + 5  ;
                    worksheet.mergeCells(_merge_sign  ,10,_merge_sign  ,12); 
                    worksheet.mergeCells(_merge_sign+1,10,_merge_sign+1,12);  
                    worksheet.mergeCells(_merge_sign+2  ,10,_merge_sign+2  ,12); 
                    worksheet.mergeCells(_merge_sign+3,10,_merge_sign+3,12);  */
                    if(Mot>1||Hai>1)
                    { 
                        row_item = worksheet.getRow(33 + Mot + Hai); 
                        row_item.getCell(8).value= NetAmt_Total_1 + NetAmt_Total_2;
 
                        row_item = worksheet.getRow(34 + Mot + Hai); 
                        row_item.getCell(8).value = TaxAmt_Total_1 + TaxAmt_Total_2;
                        
                    }
                    else
                    { 
                        row_item = worksheet.getRow(33); 
                        row_item.getCell(8).value = NetAmt_Total_1 + NetAmt_Total_2;
 
                        row_item = worksheet.getRow(34); 
                        row_item.getCell(8).value = TaxAmt_Total_1 + TaxAmt_Total_2;
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
    
    async rpt_6065010_VAT_OUT_TT156({ request, response, auth }) {
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
            var COMP_ID         = item.P_COMP_ID, COMP_NM = item.P_COMP_NM, COMP_TAX = item.P_COMP_TAX, COMP_ADD = item.P_COMP_ADD;
            var BIZ_ID         = item.P_BIZ_ID , BIZ_NM  = item.P_BIZ_NM , BIZ_TAX  = item.P_BIZ_TAX , BIZ_ADD  = item.P_BIZ_ADD;
            const p_crt_by      = user.USER_ID;
            const p_language    = request.header("accept-language", "ENG");
            var file_nm         = [item.P_RPT_FILE];
            var file_type       = ".xlsx";
            var full_nm         = file_nm + file_type;
            var file_new        = file_nm + p_crt_by + file_type;
            var _resourcesPath  = [item.P_RPT_URL]+'/'+full_nm;
            var _store_code     = "SYS_SEL_SYCO001_COMMON_CODE"; 
            var _store          = "";
            var _param_code     = ['1', item.P_COMPANY, '' , 'ACBG0188']
           
             /***************************** Return failded ****************************/
            if (!user) 
            {
                return response.send(Utils.response(false, "Request failed!", null));
            } 
            /****************************** Begin call store and write excell *********/
            else 
            { 
                 /********* Call store comon code  ***************/ 
                 var VAT_YN = "";
                 var dt_Code  = await DBService.callProcCursor(_store_code, _param_code, p_language, p_crt_by); 
                 if (dt_Code.length>0) 
                 {
                    dt_Code = dt_Code;
                    VAT_YN = dt_Code[0].CODE;
                 } 

                /********* Call store  ***************/ 
                var _param = [ item.P_COMPANY  , item.P_STATUS, item.P_AC_CD , item.P_DT_FR, item.P_DT_TO , item.P_VOUCHER_NO, VAT_YN, item.P_VAT_TYPE,  item.P_BIZ];
                var row_item; 
                /********* Read file excel ********/ 
                const templateFile  = Helpers.resourcesPath(_resourcesPath); 
                await workbook.xlsx.readFile(templateFile);
                var worksheet       = workbook.getWorksheet(1);
                var _dt_month = item.P_DT_MONTH;
                var l_month = _dt_month.substr(4,2);
                var l_year = _dt_month.substr(0,4); 
                //INFOMATION COMPANY
                worksheet.getCell("B8").value =  "Kỳ tính thuế: Tháng "+l_month+" năm "+l_year; 
                worksheet.getCell("D10").value = BIZ_NM; //COMP_NM;
                worksheet.getCell("D11").value = BIZ_TAX; //COMP_TAX;

                var _row4 = 28;
                var stt4 = 0;
                var NetAmt_Total_4 = 0;
                var TaxAmt_Total_4 = 0;

                _store = "AC_RPT_6065010_VAT_OUT4_TT156";
                var dt_4  = await DBService.callProcCursor(_store, _param, p_language, p_crt_by);  
               if(dt_4.length > 1)
                { 
                    worksheet.duplicateRow(_row4 ,dt_4.length-1,true);
                }
                
                for (var i = 0; i < dt_4.length; i++) 
                { 
                       
                        stt4 += 1;
                        row_item = worksheet.getRow(_row4+i);   
                        row_item.getCell(2).value  = stt4; 
                        row_item.getCell(3).value  = dt_4[i].FORM_NUMBER;
                        row_item.getCell(4).value  = dt_4[i].SERI_NO;
                        row_item.getCell(5).value  = dt_4[i].INVOICE_NO;
                        row_item.getCell(6).value  = dt_4[i].INVOICE_DATE;
                        row_item.getCell(7).value  = dt_4[i].PARTNER_NAME;
                        row_item.getCell(8).value  = dt_4[i].TAX_CODE;
                        row_item.getCell(9).value  = dt_4[i].TCO_CIITEM_NM;
                        row_item.getCell(10).value = dt_4[i].NET_AMT;
                        row_item.getCell(11).value = dt_4[i].TAX_AMT;
                        row_item.getCell(12).value = dt_4[i].NOTE;

                        if(Number(dt_4[i].NET_AMT) !=0)
                        {
                            NetAmt_Total_4 += Number(dt_4[i].NET_AMT);
                        }
                        // else
                        // {
                        //     NetAmt_Total_4 = 0;
                        // }
                        if(Number(dt_4[i].TAX_AMT) !="")
                        {
                            TaxAmt_Total_4 += Number(dt_4[i].TAX_AMT);
                        }
                        // else
                        // {
                        //     TaxAmt_Total_4 = 0;
                        // }
                        
                        row_item = worksheet.getRow(29 + i); 
                        row_item.getCell(10).value = NetAmt_Total_4;
                        row_item.getCell(11).value = TaxAmt_Total_4; 

                }
                //============================================================================================================================================================ 
                var _row3 = 25;
                var stt3 = 0;
                var NetAmt_Total_3 = 0;
                var TaxAmt_Total_3 = 0;

                _store = "AC_RPT_6065010_VAT_OUT3_TT156";
                var dt_3  = await DBService.callProcCursor(_store, _param, p_language, p_crt_by);  
               if(dt_3.length > 1)
                { 
                    worksheet.duplicateRow(_row3 ,dt_3.length-1,true);
                }
                 
                for (var i = 0; i < dt_3.length;i++)
                {
                    stt3 += 1; 
                    row_item = worksheet.getRow(_row3 + i); 
                    row_item.getCell(2).value  = stt3; 
                    row_item.getCell(3).value  = dt_3[i].FORM_NUMBER;
                    row_item.getCell(4).value  = dt_3[i].SERI_NO;
                    row_item.getCell(5).value  = dt_3[i].INVOICE_NO;
                    row_item.getCell(6).value  = dt_3[i].INVOICE_DATE;
                    row_item.getCell(7).value  = dt_3[i].PARTNER_NAME;
                    row_item.getCell(8).value  = dt_3[i].TAX_CODE;
                    row_item.getCell(9).value  = dt_3[i].TCO_CIITEM_NM;
                    row_item.getCell(10).value = dt_3[i].NET_AMT;
                    row_item.getCell(11).value = dt_3[i].TAX_AMT;
                    row_item.getCell(12).value = dt_3[i].NOTE;
 
                    if(Number(dt_3[i].NET_AMT) !=0)
                        {
                            NetAmt_Total_3 += Number(dt_3[i].NET_AMT);
                        }
                        // else
                        // {
                        //     NetAmt_Total_3 = 0;
                        // }
                        if(Number(dt_3[i].TAX_AMT) !="")
                        {
                            TaxAmt_Total_3 += Number(dt_3[i].TAX_AMT);
                        }
                        // else
                        // {
                        //     TaxAmt_Total_3 = 0;
                        // }
                        
                        row_item = worksheet.getRow(26 + i); 
                        row_item.getCell(10).value = NetAmt_Total_3;
                        row_item.getCell(11).value = TaxAmt_Total_3;  

                } 
                //============================================================================================================================================================ 
                var _row2 = 22;
                var stt2 = 0;
                var NetAmt_Total_2 = 0;
                var TaxAmt_Total_2 = 0;

                _store = "AC_RPT_6065010_VAT_OUT2_TT156";
                var dt_2  = await DBService.callProcCursor(_store, _param, p_language, p_crt_by);  
               if(dt_2.length > 1)
                { 
                    worksheet.duplicateRow(_row2 ,dt_2.length-1,true);
                }
                 
                for (var i = 0; i < dt_2.length;i++)
                {
                    stt2 += 1; 
                    row_item = worksheet.getRow(_row2 + i); 
                    row_item.getCell(2).value  = stt2; 
                    row_item.getCell(3).value  = dt_2[i].FORM_NUMBER;
                    row_item.getCell(4).value  = dt_2[i].SERI_NO;
                    row_item.getCell(5).value  = dt_2[i].INVOICE_NO;
                    row_item.getCell(6).value  = dt_2[i].INVOICE_DATE;
                    row_item.getCell(7).value  = dt_2[i].PARTNER_NAME;
                    row_item.getCell(8).value  = dt_2[i].TAX_CODE;
                    row_item.getCell(9).value  = dt_2[i].TCO_CIITEM_NM;
                    row_item.getCell(10).value = dt_2[i].NET_AMT;
                    row_item.getCell(11).value = dt_2[i].TAX_AMT;
                    row_item.getCell(12).value = dt_2[i].NOTE;
 
                    if(Number(dt_2[i].NET_AMT) !=0)
                        {
                            NetAmt_Total_2 += Number(dt_2[i].NET_AMT);
                        }
                        // else
                        // {
                        //     NetAmt_Total_2 = 0;
                        // }
                        if(Number(dt_2[i].TAX_AMT) !="")
                        {
                            TaxAmt_Total_2 += Number(dt_2[i].TAX_AMT);
                        }
                        // else
                        // {
                        //     TaxAmt_Total_2 = 0;
                        // }
                        
                        row_item = worksheet.getRow(23 + i); 
                        row_item.getCell(10).value = NetAmt_Total_2;
                        row_item.getCell(11).value = TaxAmt_Total_2; 


                } 
                //============================================================================================================================================================ 
                    var _row1 = 19;
                    var stt1 = 0;
                    var NetAmt_Total_1 = 0;
                    var TaxAmt_Total_1 = 0;

                    _store = "AC_RPT_6065010_VAT_OUT1_TT156";
                    var dt_1  = await DBService.callProcCursor(_store, _param, p_language, p_crt_by);  
                    if(dt_1.length > 1)
                    { 
                        worksheet.duplicateRow(_row1 ,dt_1.length-1,true);
                    }
                    
                    for (var i = 0; i < dt_1.length;i++)
                    {
                        stt1 += 1;  
                        row_item = worksheet.getRow(_row1 + i); 
                        row_item.getCell(2).value  = stt1; 
                        row_item.getCell(3).value  = dt_1[i].FORM_NUMBER;
                        row_item.getCell(4).value  = dt_1[i].SERI_NO;
                        row_item.getCell(5).value  = dt_1[i].INVOICE_NO;
                        row_item.getCell(6).value  = dt_1[i].INVOICE_DATE;
                        row_item.getCell(7).value  = dt_1[i].PARTNER_NAME;
                        row_item.getCell(8).value  = dt_1[i].TAX_CODE;
                        row_item.getCell(9).value  = dt_1[i].TCO_CIITEM_NM;
                        row_item.getCell(10).value = dt_1[i].NET_AMT;
                        row_item.getCell(11).value = dt_1[i].TAX_AMT;
                        row_item.getCell(12).value = dt_1[i].NOTE;

                        if(Number(dt_1[i].NET_AMT) !=0)
                            {
                                NetAmt_Total_1 += Number(dt_1[i].NET_AMT);
                            }
                            // else
                            // {
                            //     NetAmt_Total_1 = 0;
                            // }
                            if(Number(dt_1[i].TAX_AMT) !="")
                            {
                                TaxAmt_Total_1 += Number(dt_1[i].TAX_AMT);
                            }
                            // else
                            // {
                            //     TaxAmt_Total_1 = 0;
                            // }
                            
                            row_item = worksheet.getRow(20 + i); 
                            row_item.getCell(10).value = NetAmt_Total_1;
                            row_item.getCell(11).value = TaxAmt_Total_1; 


                    } 
                
                    var Mot = 0, Hai = 0, Ba = 0, Bon = 0;
                    Mot = dt_1.length;
                    Hai = dt_2.length;
                    Ba  = dt_3.length;
                    Bon = dt_4.length;
                    if(Mot>1)
                    {
                        Mot = Mot-1;
                    }
                    if(Hai>1)
                    {
                        Hai = Hai-1;
                    }
                    if(Ba>1)
                    {
                        Ba = Ba-1;
                    }
                    if(Bon>1)
                    {
                        Bon = Bon-1;
                    }
 
                    worksheet.mergeCells(_row1-1,2,_row1-1,12);  
                    worksheet.mergeCells(Mot+_row1+2,2,Mot+_row1+2,12); 
                    worksheet.mergeCells(Mot+ Hai+_row1+5,2,Mot+ Hai+_row1+5,12);    
                    worksheet.mergeCells(Mot+ Hai+ Ba+_row1+8,2,Mot+ Hai+ Ba+_row1+8,12);   
                    worksheet.mergeCells(Mot+ Hai+ Ba+_row1+11,2,Mot+ Hai+ Ba+_row1+11,12);   

                    /*var _merge_sign = Mot+_row1+4 + Hai + Ba +2 + Bon + 2 + 12  ;
                    worksheet.mergeCells(_merge_sign  ,10,_merge_sign  ,12); 
                    worksheet.mergeCells(_merge_sign+1,10,_merge_sign+1,12);  
                    worksheet.mergeCells(_merge_sign+2  ,10,_merge_sign+2  ,12); 
                    worksheet.mergeCells(_merge_sign+3,10,_merge_sign+3,12);  */
                    if(Mot>1||Hai>1||Ba>1||Bon>1)
                    {
                        //exSheet.Cells[34 + Mot + Hai + Ba + Bon, 8].Value = NetAmt_Total_1 + NetAmt_Total_2 + NetAmt_Total_3 + NetAmt_Total_4;
                        row_item = worksheet.getRow(34 + Mot + Hai + Ba + Bon); 
                        row_item.getCell(8).value= NetAmt_Total_1 + NetAmt_Total_2 + NetAmt_Total_3 + NetAmt_Total_4;

                        //exSheet.Cells[35 + Mot + Hai + Ba + Bon, 8].Value = TaxAmt_Total_1 + TaxAmt_Total_2 + TaxAmt_Total_3 + TaxAmt_Total_4;
                        row_item = worksheet.getRow(35 + Mot + Hai + Ba + Bon); 
                        row_item.getCell(8).value = TaxAmt_Total_1 + TaxAmt_Total_2 + TaxAmt_Total_3 + TaxAmt_Total_4;
                        
                    }
                    else
                    {
                        //exSheet.Cells[34, 8].Value = NetAmt_Total_1 + NetAmt_Total_2 + NetAmt_Total_3 + NetAmt_Total_4;
                        row_item = worksheet.getRow(34); 
                        row_item.getCell(8).value = NetAmt_Total_1 + NetAmt_Total_2 + NetAmt_Total_3 + NetAmt_Total_4;

                        //exSheet.Cells[35, 8].Value = TaxAmt_Total_1 + TaxAmt_Total_2 + TaxAmt_Total_3 + TaxAmt_Total_4;
                        row_item = worksheet.getRow(35); 
                        row_item.getCell(8).value = TaxAmt_Total_1 + TaxAmt_Total_2 + TaxAmt_Total_3 + TaxAmt_Total_4;
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
    
    async rpt_6065010_VAT_OUT_TT80({ request, response, auth }) {
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
            var COMP_ID         = item.P_COMP_ID, COMP_NM = item.P_COMP_NM, COMP_TAX = item.P_COMP_TAX, COMP_ADD = item.P_COMP_ADD; 
            var BIZ_ID         = item.P_BIZ_ID , BIZ_NM  = item.P_BIZ_NM , BIZ_TAX  = item.P_BIZ_TAX , BIZ_ADD  = item.P_BIZ_ADD;
            const p_crt_by      = user.USER_ID;
            const p_language    = request.header("accept-language", "ENG");
            var file_nm         = [item.P_RPT_FILE];
            var file_type       = ".xlsx";
            var full_nm         = file_nm + file_type;
            var file_new        = file_nm + p_crt_by + file_type;
            var _resourcesPath  = [item.P_RPT_URL]+'/'+full_nm;
            var _store_code     = "SYS_SEL_SYCO001_COMMON_CODE"; 
            var _store          = "AC_RPT_6065010_VAT_OUT_TT80";
            var _param_code     = ['1', item.P_COMPANY, '' , 'ACBG0188']
           
             /***************************** Return failded ****************************/
            if (!user) 
            {
                return response.send(Utils.response(false, "Request failed!", null));
            } 
            /****************************** Begin call store and write excell *********/
            else 
            { 
                 /********* Call store comon code  ***************/ 
                 var VAT_YN = "";
                 var dt_Code  = await DBService.callProcCursor(_store_code, _param_code, p_language, p_crt_by); 
                 if (dt_Code.length>0) 
                 {
                    dt_Code = dt_Code;
                    VAT_YN = dt_Code[0].CODE;
                 } 

                /********* Call store  ***************/ 
                var _param          = [ item.P_COMPANY  , item.P_STATUS, item.P_AC_CD , item.P_DT_FR,
                     item.P_DT_TO , item.P_VOUCHER_NO, VAT_YN, item.P_VAT_TYPE,  item.P_BIZ];
                var dt_Data  = await DBService.callProcCursor(_store, _param, p_language, p_crt_by); 
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
                var _dt_month = item.P_DT_MONTH;
                var l_month = _dt_month.substr(4,2);
                var l_year = _dt_month.substr(0,4);

                /********* Write file excel ********/
                worksheet.getCell("A4").value =  "[01] Kỳ đề nghị hoàn thuế: Từ kỳ "+  Utils._formatDate(item.P_DT_FR,'DD/MM/YYYY') +" đến kỳ "+ Utils._formatDate(item.P_DT_TO,'DD/MM/YYYY'); 
                worksheet.getCell("A5").value = '[02] Tên người nộp thuế: '+BIZ_NM;   
                worksheet.getCell("A6").value = '[03] Mã số thuế: '+BIZ_TAX;   
                worksheet.getCell("A7").value = '[04] Tên đại lý thuế (nếu có): ';   
                worksheet.getCell("A8").value = '[05] Mã số thuế: ';   
 
                
                var pos = 14;
                var _total_net_amt = 0;
                var _total_tax_amt = 0;

                Utils.excelInsertRows(worksheet,pos,dt_Data.length - 1); 
                for (var i = 0; i < dt_Data.length; i++) 
                {
                    var row_item = worksheet.getRow(pos);

                    row_item.getCell(1).value = i + 1;
                    row_item.getCell(2).value = dt_Data[i].FORM_NUMBER;  
                    row_item.getCell(3).value = dt_Data[i].SERI_NO;  
                    row_item.getCell(4).value = dt_Data[i].INVOICE_NO;  
                    row_item.getCell(5).value = dt_Data[i].INVOICE_DATE;  
                    row_item.getCell(6).value = dt_Data[i].PARTNER_NAME;  
                    row_item.getCell(7).value = dt_Data[i].TAX_CODE;   
                    row_item.getCell(8).value = dt_Data[i].TCO_CIITEM_NM;   
                    row_item.getCell(9).value = dt_Data[i].ITEM_UOM;   //uom
                    row_item.getCell(10).value = dt_Data[i].QUANTITY;    //qty
                    row_item.getCell(11).value = dt_Data[i].U_PRICE;//uprice
                    row_item.getCell(12).value = dt_Data[i].NET_AMT;  //hhdv
                    row_item.getCell(13).value = dt_Data[i].TAX_RATE;  // thue
                    row_item.getCell(14).value = dt_Data[i].TAX_AMT;  //gtgt
                    row_item.getCell(15).value = dt_Data[i].NOTE;  //remark
                    row_item.getCell(16).value = dt_Data[i].DECLARE_NO;  //declare no
                    row_item.getCell(17).value = dt_Data[i].DECL_DATE;  //declare date

                    //total , , 
                     _total_net_amt += Number(dt_Data[i].NET_AMT);
                     _total_tax_amt += Number(dt_Data[i].TAX_AMT);
                    pos = pos + 1;   
                }    
                var row = worksheet.getRow(pos);
                row.getCell(12).value = _total_net_amt;
                row.getCell(14).value = _total_tax_amt;  
                 
                 
                worksheet.mergeCells(pos,1,pos,8); 
                worksheet.mergeCells(pos + 2, 1, pos + 2, 15); 

                worksheet.mergeCells(pos + 4, 9, pos + 4, 12);  
                worksheet.mergeCells(pos + 5, 9, pos + 5, 12);  
                worksheet.mergeCells(pos + 8, 9, pos + 8, 12);  

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
    async rpt_6065010_VAT_IN_TT80({ request, response, auth }) {
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
            var COMP_ID         = item.P_COMP_ID, COMP_NM = item.P_COMP_NM, COMP_TAX = item.P_COMP_TAX, COMP_ADD = item.P_COMP_ADD;
            var BIZ_ID         = item.P_BIZ_ID , BIZ_NM  = item.P_BIZ_NM , BIZ_TAX  = item.P_BIZ_TAX , BIZ_ADD  = item.P_BIZ_ADD;
            const p_crt_by      = user.USER_ID;
            const p_language    = request.header("accept-language", "ENG");
            var file_nm         = [item.P_RPT_FILE];
            var file_type       = ".xlsx";
            var full_nm         = file_nm + file_type;
            var file_new        = file_nm + p_crt_by + file_type;
            var _resourcesPath  = [item.P_RPT_URL]+'/'+full_nm;
            var _store_code     = "SYS_SEL_SYCO001_COMMON_CODE"; 
            var _store          = "AC_RPT_6065010_VAT_IN_TT80";
            var _param_code     = ['1', item.P_COMPANY, '' , 'ACBG0188']
           
             /***************************** Return failded ****************************/
            if (!user) 
            {
                return response.send(Utils.response(false, "Request failed!", null));
            } 
            /****************************** Begin call store and write excell *********/
            else 
            { 
                 /********* Call store comon code  ***************/ 
                 var VAT_YN = "";
                 var dt_Code  = await DBService.callProcCursor(_store_code, _param_code, p_language, p_crt_by); 
                 if (dt_Code.length>0) 
                 {
                    dt_Code = dt_Code;
                    VAT_YN = dt_Code[0].CODE;
                 }  
                /********* Call store  ***************/ 
                var _param = [ item.P_COMPANY  , item.P_STATUS, item.P_AC_CD , item.P_DT_FR, item.P_DT_TO , item.P_VOUCHER_NO, VAT_YN, item.P_VAT_TYPE,  item.P_BIZ];
                var dt_Data  = await DBService.callProcCursor(_store, _param, p_language, p_crt_by); 
                if (dt_Data.length>0) 
                {
                    dt_Data = dt_Data;
                } 
                else 
                {
                    return response.send(Utils.response(false, "no_data_found", null))
                } 
                var row_item; 
                /********* Read file excel ********/ 
                const templateFile  = Helpers.resourcesPath(_resourcesPath); 
                await workbook.xlsx.readFile(templateFile);
                var worksheet       = workbook.getWorksheet(1);
                var _dt_month = item.P_DT_MONTH;
                var l_month = _dt_month.substr(4,2);
                var l_year = _dt_month.substr(0,4); 
                //INFOMATION COMPANY
                worksheet.getCell("A4").value =  "[01] Kỳ đề nghị hoàn thuế: Từ kỳ "+  Utils._formatDate(item.P_DT_FR,'DD/MM/YYYY') +" đến kỳ "+ Utils._formatDate(item.P_DT_TO,'DD/MM/YYYY'); 
                worksheet.getCell("A5").value = '[02] Tên người nộp thuế: '+BIZ_NM;   
                worksheet.getCell("A6").value = '[03] Mã số thuế: '+BIZ_TAX;   
                worksheet.getCell("A7").value = '[04] Tên đại lý thuế (nếu có): ';   
                worksheet.getCell("A8").value = '[05] Mã số thuế: ';   
 
                
                var pos = 14;
                var _total_net_amt = 0;
                var _total_tax_amt = 0;

                Utils.excelInsertRows(worksheet,pos,dt_Data.length - 1); 
                for (var i = 0; i < dt_Data.length ; i++) 
                {
                    var row_item = worksheet.getRow(pos);

                    row_item.getCell(1).value = i + 1;
                    row_item.getCell(2).value = dt_Data[i].FORM_NUMBER;  
                    row_item.getCell(3).value = dt_Data[i].SERI_NO;  
                    row_item.getCell(4).value = dt_Data[i].INVOICE_NO;  
                    row_item.getCell(5).value = dt_Data[i].INVOICE_DATE;  
                    row_item.getCell(6).value = dt_Data[i].PARTNER_NAME;  
                    row_item.getCell(7).value = dt_Data[i].TAX_CODE;   
                    row_item.getCell(8).value = dt_Data[i].TCO_CIITEM_NM;   
                    row_item.getCell(9).value = dt_Data[i].ITEM_UOM;   //uom
                    row_item.getCell(10).value = dt_Data[i].QUANTITY;    //qty
                    row_item.getCell(11).value = dt_Data[i].U_PRICE;//uprice
                    row_item.getCell(12).value = dt_Data[i].NET_AMT;  //hhdv
                    row_item.getCell(13).value = dt_Data[i].TAX_RATE;  // thue
                    row_item.getCell(14).value = dt_Data[i].TAX_AMT;  //gtgt
                    row_item.getCell(15).value = dt_Data[i].NOTE;  //remark

                    //total , , 
                     _total_net_amt += Number(dt_Data[i].NET_AMT);
                     _total_tax_amt += Number(dt_Data[i].TAX_AMT);
                    pos = pos + 1;   
                }    
                
                var row = worksheet.getRow(pos );
                row.getCell(12).value = _total_net_amt;
                row.getCell(14).value = _total_tax_amt; 
                 
                 
                worksheet.mergeCells(pos,1,pos,8); 
                worksheet.mergeCells(pos + 2, 1, pos + 2, 15); 

                worksheet.mergeCells(pos + 4, 9, pos + 4, 12);  
                worksheet.mergeCells(pos + 5, 9, pos + 5, 12);  
                worksheet.mergeCells(pos + 8, 9, pos + 8, 12);  
             
                    
                
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

module.exports = rpt6065010;