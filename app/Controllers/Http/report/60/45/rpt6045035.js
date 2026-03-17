"use strict";

const { DATE } = require("oracledb");

const Helpers       = use('Helpers')
const Antl          = use("Antl");
const Utils         = use("Utils");
const DBService = use("DBService")
var Excel           = use('exceljs');
var workbook        = new Excel.Workbook();
class rpt6045035 {
    /*########################################################## xong cho check rpt 29032023 EACBK002 Report  General ledger detail books ENG VIE no 8##################################################################################*/  
    async rpt_6045035_General_Ledger_DT_ACC_ALL_V2({ request, response, auth }) {
        try 
        { 
            /* P_RPT_ID: report_info.VAL1, P_RPT_URL: report_info.VAL2, P_RPT_FILE: report_info.VAL3,
                P_COMP_ID: company_info.PARTNER_ID, P_COMP_NM: company_info.TEXT, P_COMP_TAX: company_info.TAX_CODE, P_COMP_ADD: company_info.ADDR1,
                P_COMPANY: this.selectedCompany,P_ACC_PK: this.TAC_ABACCTCODE_PK, P_FR_DATE: this.from_date, P_FR_TO: this.to_date, 
                P_CCY: this.selectedCurrency, P_STATUS: this.selectedStatus, P_BOOK_CCY: this.txtBookCCY, P_CIRCULARS: this.selectedCircular, P_PRINT_VOUCHER_NO : this.selectedPrintVoucherNo, 
                P_OPTION: this.selectedOptionListGLDT, P_POST_SUM : this.selectedPostSum, P_AMT_TYPE: this.selectedAmtType, P_LANG : this.selectedLanguage, P_DATE_NOW: this.datetime
                */
            /****************************** Get Param *********************************/
            let { para }        = request.get(['para']);
            /********* Parse pram to json ********/
            var item            = JSON.parse(para); 
            const user          = await auth.getUser() ;
            var COMP_ID         = item.P_COMP_ID, COMP_NM = item.P_COMP_NM, COMP_TAX = item.P_COMP_TAX, COMP_ADD = item.P_COMP_ADD;
            var BIZ_ID          = item.P_BIZ_ID , BIZ_NM  = item.P_BIZ_NM , BIZ_TAX  = item.P_BIZ_TAX , BIZ_ADD  = item.P_BIZ_ADD;
            const p_crt_by      = user.USER_ID;
            const p_language    = request.header("accept-language", "ENG");
            var file_nm         = [item.P_RPT_FILE];
            var file_type       = ".xlsx";
            var full_nm         = file_nm + file_type;
            var file_new        = file_nm + p_crt_by + file_type;
            var _resourcesPath  = [item.P_RPT_URL]+'/'+full_nm;
            var _store          = "AC_RPT_6045035_ACC_ALL"; //AC_RPT_6045035_ACC_ALL_V3
            var _store_title    = "AC_RPT_6045035_TITLE_DT_ALL";
            var _param          = [item.P_COMPANY, item.P_FR_DATE, item.P_FR_TO, item.P_ACC_PK, item.P_CCY, item.P_AMT_TYPE ,item.P_STATUS, item.P_POST_SUM, item.P_TCO_BUSPLACE_PK, item.P_LANG];
            /***************************** Return failded ****************************/
            if (!user) 
            {
                return response.send(Utils.response(false, "Request failed!", null));
            } 
            /****************************** Begin call store and write excell *********/
            else 
                /********* Call store infomation tltle ***************/ 
                var _param_title    = [item.P_COMPANY, item.P_FR_DATE, item.P_FR_TO, item.P_BOOK_CCY,item.P_STATUS, item.P_TCO_BUSPLACE_PK, item.P_LANG];
                var dt_Title;
                try{
                        dt_Title = await DBService.callProcCursor(_store_title, _param_title , p_language , p_crt_by); 
                }catch (e){
                        dt_Title = await DBService.callProcCursor('AC_RPT_6045035_TITLEDTACCALL', _param_title , p_language , p_crt_by); 
                }
                /********* Read file excel ********/ 
                const templateFile  = Helpers.resourcesPath(_resourcesPath); 
                await workbook.xlsx.readFile(templateFile);
                var worksheet       = workbook.getWorksheet(1);
                /********* Write file excel ********/
                    /********* Call partner store  ***************/ 
                var dt_Data  = await DBService.callProcCursor(_store, _param , p_language , p_crt_by); 
                var pos_title = 0;
                var _lang = item.P_LANG;
                var acc_info = "";
                var ac_code = "";
                var ac_name = "";
                var _bookccy = item.P_BOOK_CCY;  
                
                var _formatAmt = (_bookccy=='VND'?'#,##0_);[Red](#,##0);_(* "-"_);_(@_)':'#,##0.00_);[Red](#,##0.00);_(* "-"_);_(@_)');
                if (dt_Data.length>0) 
                {
                    for (var i = 0; i < dt_Data.length; i++) 
                    {
                        dt_Data = dt_Data;
                        if( dt_Data[i].ACC_INFO != acc_info || i == 0)
                        {
                            acc_info = dt_Data[i].ACC_INFO;
                            ac_code = dt_Data[i].AC_CD;
                            if(i>0){
                                worksheet   = workbook.addWorksheet(); 
                            }
                            worksheet.name = ac_code; 
                        
                            // Width
                            worksheet.getColumn(1).width = 13.75; // date 
                            worksheet.getColumn(2).width = 13; // voucher no 
                            worksheet.getColumn(3).width = 13; // voucher date 
                            worksheet.getColumn(4).width = 40; // local desrciption
                            worksheet.getColumn(5).width = 40; // Desrciption
                            worksheet.getColumn(6).width = 15; // Corresponding Account
                            worksheet.getColumn(7).width = 15.86; // Amount Debit 
                            worksheet.getColumn(8).width = 15.86; // Amount Credit
                            worksheet.getColumn(9).width = 15.86; // Amount Debit Balance
                            worksheet.getColumn(10).width = 15.86; // Amount Credit Balance
                            worksheet.getColumn(11).width = 8.43; // Remart
                            worksheet.getColumn(12).width = 0; // Unclose
                            worksheet.getColumn(13).width = 30.0; // Corresponding Account Name
                            pos_title = 0;
                            //INFOMATION COMPANY
                            pos_title = pos_title + 1;
                            //sign
                            var row_title = worksheet.getRow(pos_title);
                            // Info
                            row_title.getCell(1).value = dt_Title[0].BIZ_NM_A1; // biz name
                            row_title.getCell(7).value = dt_Title[0].MS_H1; // Mẫu số 31a 
                            worksheet.mergeCells(pos_title,7, pos_title,9);// merge MS
                            row_title.getCell(7).font  = { italic: false, bold: true, color: {argb:'000000'}, size:10, name: 'Times New Roman'};
                            row_title.getCell(7).alignment = { vertical: 'middle', horizontal: 'center' };
                            pos_title = pos_title + 1;
                            row_title = worksheet.getRow(pos_title);
                            row_title.getCell(1).value = dt_Title[0].BIZ_TAX_A2; // biz tax code
                            row_title.getCell(7).value = dt_Title[0].EV_H2; // Thong tu
                            worksheet.mergeCells(pos_title,7, pos_title,9);// Thong tu
                            row_title.getCell(7).font  = { italic: false, bold: false, color: {argb:'000000'}, size:10, name: 'Times New Roman'};
                            pos_title = pos_title + 1;
                            row_title = worksheet.getRow(pos_title);
                            row_title.getCell(1).value = dt_Title[0].BIZ_ADD_A3; // Address
                            row_title.getCell(7).value = dt_Title[0].EV_H3; // Thong tu
                            worksheet.mergeCells(pos_title,7, pos_title,9);// Thong tu
                            row_title.getCell(7).font  = { italic: false, bold: false, color: {argb:'000000'}, size:10, name: 'Times New Roman'};
                            pos_title = pos_title + 1;
                            row_title = worksheet.getRow(pos_title)
                            
                            row_title.height = 30; 
                            row_title.getCell(1).value = dt_Title[0].TITLE_A4; // Title
                            row_title.getCell(1).font  = { italic: false, bold: true, color: {argb:'000000'}, size:18, name: 'Times New Roman'};
                            row_title.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
                            worksheet.mergeCells(pos_title,1, pos_title,13);// Title
                            pos_title = pos_title + 1;
                            row_title = worksheet.getRow(pos_title);
                            row_title.getCell(1).value = dt_Title[0].DATE_TOFRM_A5; // from date - todate
                            row_title.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
                            row_title.getCell(1).font  = { italic: false, bold: false, size:10, color: {argb:'000000'}, name: 'Times New Roman'};
                            worksheet.mergeCells(pos_title,1, pos_title,13);// from date - todate
                            pos_title = pos_title + 1;
                            row_title = worksheet.getRow(pos_title);
                            row_title.getCell(1).value =_lang == 'VIE' ? 'Tài khoản : ' + acc_info : 'Account code : ' + acc_info; // account
                            row_title.getCell(1).font  = { italic: false, bold: true, size:10, color: {argb:'000000'}, name: 'Times New Roman'};
                            pos_title = pos_title + 1;
                            row_title = worksheet.getRow(pos_title);
                            row_title.getCell(1).value = dt_Title[0].STATUS_A7; // status
                            row_title.getCell(1).font  = { italic: false, bold: true, size:10, color: {argb:'000000'}, name: 'Times New Roman'};
                            pos_title = pos_title + 1;
                            row_title = worksheet.getRow(pos_title);
                            row_title.getCell(9).value = dt_Title[0].DVT_I8; // unit
                            row_title.getCell(9).font  = { italic: false, bold: true, size:10, color: {argb:'000000'}, name: 'Times New Roman'};
                            row_title.getCell(9).alignment = { vertical: 'middle', horizontal: 'right' };

                            //bảng
                            pos_title = pos_title + 2;//10
                            row_title = worksheet.getRow(pos_title);
                            pos_title = pos_title + 1;//11
                            var row_title_11 = worksheet.getRow(pos_title);

                            row_title.getCell(1).value      = dt_Title[0].A10_11; // date - ngày tháng năm row 9-10
                            row_title.getCell(2).value      = dt_Title[0].BC10; // voucher
                            row_title_11.getCell(2).value   = dt_Title[0].B11; // voucher no
                            row_title_11.getCell(3).value   = dt_Title[0].C11; // voucher date
                            row_title.getCell(4).value      = dt_Title[0].D10; //Local Description 
                            row_title.getCell(5).value      = dt_Title[0].E10; // Description
                            row_title.getCell(6).value      = dt_Title[0].F10_11; // Corresponding Account
                            row_title.getCell(7).value      = dt_Title[0].GH10; // Amount
                            row_title_11.getCell(7).value   = dt_Title[0].G11; // Amount Debit
                            row_title_11.getCell(8).value   = dt_Title[0].H11; // Amount  Credit  
                            row_title.getCell(9).value      = dt_Title[0].IJ10; // Balance
                            row_title_11.getCell(9).value   = dt_Title[0].I11; // Balance Debit
                            row_title_11.getCell(10).value  = dt_Title[0].J11; // Balance  Credit 
                            row_title.getCell(11).value     = dt_Title[0].K10; //Remark 
                            row_title_11.getCell(11).value  = dt_Title[0].K11;//SEQ 
                            row_title.getCell(12).value     = dt_Title[0].L10_11;//Unclose 
                            row_title.getCell(13).value     = dt_Title[0].M10_11;//Corresponding Account Name 


                            //-------------------Merger-------------------------
                            worksheet.mergeCells(pos_title-1,1,pos_title,1); //date - ngày tháng năm  10-11
                            worksheet.mergeCells(pos_title-1,2,pos_title-1,3); //voucher  10-10
                            worksheet.mergeCells(pos_title-1,4,pos_title,4); //Local Description  10-11
                            worksheet.mergeCells(pos_title-1,5,pos_title,5); //Description  10-11
                            worksheet.mergeCells(pos_title-1,6,pos_title,6); //Corresponding Account 10-11
                            worksheet.mergeCells(pos_title-1,7,pos_title-1,8); //Amount  10-10
                            worksheet.mergeCells(pos_title-1,9,pos_title-1,10); //Balance  10-10
                            worksheet.mergeCells(pos_title-1,13,pos_title,13); //Balance  10-1
                            
                            

                            for(let j = 1; j<=13; j++)
                            {
                                row_title.getCell(6).alignment = {horizontal: 'center', wrapText: true  };  
                                row_title.getCell(j).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "D9D9D9" } };
                                row_title.getCell(j).alignment = { vertical: 'middle', horizontal: 'center' };
                                row_title.getCell(j).font      = { italic: false, bold: true, color: {argb:'000000'}, size:10, name: 'Times New Roman'};
                                row_title.getCell(j).border = {
                                                                top: {style:'thin', color: {argb:'A6A6A6'}},
                                                                left: {style:'thin', color: {argb:'A6A6A6'}},
                                                                bottom: {style:'thin', color: {argb:'A6A6A6'}},
                                                                right: {style:'thin', color: {argb:'A6A6A6'}}
                                                            }; 
                                                            
                                row_title_11.getCell(j).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "D9D9D9" } };
                                row_title_11.getCell(j).font = { italic: false, bold: true, color: {argb:'000000'}, size:10, name: 'Times New Roman'};
                                row_title_11.getCell(j).alignment = { vertical: 'middle', horizontal: 'center' };
                                row_title_11.getCell(j).border = {
                                                                top: {style:'thin', color: {argb:'A6A6A6'}},
                                                                left: {style:'thin', color: {argb:'A6A6A6'}},
                                                                bottom: {style:'thin', color: {argb:'A6A6A6'}},
                                                                right: {style:'thin', color: {argb:'A6A6A6'}}
                                                            };                     
                            }
                            
                        }
                        
                        //-------Fill Data----------------  
                        pos_title = pos_title + 1 ;  
                        var row_item = worksheet.getRow(pos_title);
                        row_item.getCell(1).value   = dt_Data[i].TR_DATE;
                        row_item.getCell(2).value   = dt_Data[i].VOUCHERNO;    
                        row_item.getCell(3).value   = dt_Data[i].VOUCHER_DT;  
                        row_item.getCell(4).value   = dt_Data[i].REMARK2; 
                        row_item.getCell(5).value   = dt_Data[i].REMARK; 
                        row_item.getCell(6).value   = dt_Data[i].ACC_CR; 
                        row_item.getCell(7).value   = dt_Data[i].PS_DEBIT;   
                        row_item.getCell(7).numFmt  = _formatAmt;
                        row_item.getCell(8).value   = dt_Data[i].PS_CREDIT;  
                        row_item.getCell(8).numFmt  = _formatAmt;
                        row_item.getCell(9).value   = dt_Data[i].TOTAL_DEBIT;  
                        row_item.getCell(9).numFmt  = _formatAmt;
                        row_item.getCell(10).value  = dt_Data[i].TOTAL_CREDIT;  
                        row_item.getCell(10).numFmt = _formatAmt;
                        row_item.getCell(11).value  = dt_Data[i].PK;
                        row_item.getCell(12).value  = dt_Data[i].TR_ENCLOSE;  
                        row_item.getCell(13).value  = dt_Data[i].ACNM_CR;  
                        for(let y = 7; y<=10; y++)
                        {
                            row_item.getCell(y).font  = { italic: false, bold: false, size:10,color: {argb:'000000'}, name: 'Times New Roman' };
                            row_item.getCell(y).alignment = { vertical: 'middle', horizontal: 'right' };
                        }

                        if(dt_Data[i].ORD === 'O' || dt_Data[i].ORD === 'T'|| dt_Data[i].ORD === 'E')
                        {
                            row_item.getCell(4).font  = { italic: false, bold: true, size:10, color: {argb:'000000'} , horizontal: 'center'};
                            worksheet.getCell(pos_title,4).alignment = { vertical: 'middle', horizontal: 'center' };
                            for(let z = 7; z<=10; z++)
                            {
                                row_item.getCell(z).font  = { italic: false, bold: true, size:10,color: {argb:'000000'}, name: 'Times New Roman' };
                                row_item.getCell(z).alignment = { vertical: 'middle', horizontal: 'right' };
                            }
                        }
                        if(dt_Data[i].STT === 2 || dt_Data[i].STT === 3)
                        {
                            row_item.getCell(4).font  = { italic: true, bold: true, size:10, color: {argb:'000000'} , horizontal: 'center'};
                            worksheet.getCell(pos_title,4).alignment = { vertical: 'middle', horizontal: 'center' };
                            for(let z = 7; z<=10; z++)
                            {
                                row_item.getCell(z).font  = { italic: true, bold: true, size:10,color: {argb:'000000'}, name: 'Times New Roman' };
                                row_item.getCell(z).alignment = { vertical: 'middle', horizontal: 'right' };
                            }
                        }
                        for(let j = 1; j<=13; j++)
                        {
                            row_item.getCell(j).border = {
                                                            top: {style:'thin', color: {argb:'A6A6A6'}},
                                                            left: {style:'thin', color: {argb:'A6A6A6'}},
                                                            bottom: {style:'thin', color: {argb:'A6A6A6'}},
                                                            right: {style:'thin', color: {argb:'A6A6A6'}}
                                                        }; 
                        }
                        if(dt_Data[i].ORD === 'E'){
                            pos_title = pos_title + 2;
                            row_title = worksheet.getRow(pos_title);
                            row_title.getCell(1).value = dt_Title[0].EV_A21; // Prepared by
                            row_title.getCell(1).font  = { italic: false, bold: true, color: {argb:'000000'}, size:10, name: 'Times New Roman'};
                            worksheet.mergeCells(pos_title,1, pos_title,3);// 
                            row_title.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
                            row_title.getCell(5).value = dt_Title[0].EV_E21; // Chief Account
                            row_title.getCell(5).font  = { italic: false, bold: true, color: {argb:'000000'}, size:10, name: 'Times New Roman'};
                            row_title.getCell(5).alignment = { vertical: 'middle', horizontal: 'center' };
                            row_title.getCell(7).value = dt_Title[0].EV_I21; // General Director
                            row_title.getCell(7).font  = { italic: false, bold: true, color: {argb:'000000'}, size:10, name: 'Times New Roman'};
                            worksheet.mergeCells(pos_title,7, pos_title,9);// 
                            row_title.getCell(7).alignment = { vertical: 'middle', horizontal: 'center' };
                            // sign,fullname  
                            pos_title =    pos_title + 1;
                            row_title = worksheet.getRow(pos_title);
                            row_title.getCell(1).value = dt_Title[0].EV_SIG_A21; // Prepared by
                            row_title.getCell(1).font  = { italic: true, bold: false, color: {argb:'000000'}, name: 'Times New Roman'};
                            worksheet.mergeCells(pos_title,1, pos_title,3);// 
                            row_title.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
                            row_title.getCell(5).value = dt_Title[0].EV_SIG_E21; // Chief Account
                            row_title.getCell(5).font  = { italic: true, bold: false, color: {argb:'000000'}, name: 'Times New Roman'};
                            row_title.getCell(5).alignment = { vertical: 'middle', horizontal: 'center' };
                            row_title.getCell(7).value = dt_Title[0].EV_SIG_I21; // General Director
                            row_title.getCell(7).font  = { italic: true, bold: false, color: {argb:'000000'}, name: 'Times New Roman'};
                            worksheet.mergeCells(pos_title,7, pos_title,9);// 
                            row_title.getCell(7).alignment = { vertical: 'middle', horizontal: 'center' };
                        }
                    }
                }
                
                /********* Print file excel ********/
                const reportFile    = Helpers.tmpPath(file_new);
                await workbook.xlsx.writeFile(reportFile)
                return response.attachment( reportFile, file_new);
            
            } 
        catch (e) 
        {
            Utils.Logger({ LVL: "error", MODULE: "Report", FUNC: "rpt_6045035_General_Ledger_DT_ACC_ALL_V2", CONTENT: e.message })
            // return response.send(Utils.response(false, e.message, null))
            return response.send(null);
        }
    }
    /*########################################################## EACBK002 Report  General ledger detail books ENG VIE no 8##################################################################################*/  
    async rpt_6045035_General_Ledger_DT_ACC_ALL({ request, response, auth }) {
        try 
        { 
            /* P_RPT_ID: report_info.VAL1, P_RPT_URL: report_info.VAL2, P_RPT_FILE: report_info.VAL3,
                P_COMP_ID: company_info.PARTNER_ID, P_COMP_NM: company_info.TEXT, P_COMP_TAX: company_info.TAX_CODE, P_COMP_ADD: company_info.ADDR1,
                P_COMPANY: this.selectedCompany,P_ACC_PK: this.TAC_ABACCTCODE_PK, P_FR_DATE: this.from_date, P_FR_TO: this.to_date, 
                P_CCY: this.selectedCurrency, P_STATUS: this.selectedStatus, P_BOOK_CCY: this.txtBookCCY, P_CIRCULARS: this.selectedCircular, P_PRINT_VOUCHER_NO : this.selectedPrintVoucherNo, 
                P_OPTION: this.selectedOptionListGLDT, P_POST_SUM : this.selectedPostSum, P_AMT_TYPE: this.selectedAmtType, P_LANG : this.selectedLanguage, P_DATE_NOW: this.datetime
                */
            /****************************** Get Param *********************************/
            let { para }        = request.get(['para']);
            /********* Parse pram to json ********/
            var item            = JSON.parse(para); 
            const user          = await auth.getUser() ;
            var COMP_ID         = item.P_COMP_ID, COMP_NM = item.P_COMP_NM, COMP_TAX = item.P_COMP_TAX, COMP_ADD = item.P_COMP_ADD;
            var BIZ_ID          = item.P_BIZ_ID , BIZ_NM  = item.P_BIZ_NM , BIZ_TAX  = item.P_BIZ_TAX , BIZ_ADD  = item.P_BIZ_ADD;
            const p_crt_by      = user.USER_ID;
            const p_language    = request.header("accept-language", "ENG");
            var file_nm         = [item.P_RPT_FILE];
            var file_type       = ".xlsx";
            var full_nm         = file_nm + file_type;
            var file_new        = file_nm + p_crt_by + file_type;
            var _resourcesPath  = [item.P_RPT_URL]+'/'+full_nm;
            var _store          = "AC_RPT_6045035_ACC_ALL_V3";
            var _store_title    = "AC_RPT_6045035_TITLE_DT_ALL";
            var _param          = [item.P_COMPANY, item.P_FR_DATE, item.P_FR_TO, item.P_ACC_PK, item.P_CCY, item.P_AMT_TYPE ,item.P_STATUS, item.P_POST_SUM, item.P_TCO_BUSPLACE_PK, item.P_LANG];
            /***************************** Return failded ****************************/
            if (!user) 
            {
                return response.send(Utils.response(false, "Request failed!", null));
            } 
            /****************************** Begin call store and write excell *********/
            else 
                /********* Call store infomation tltle ***************/ 
                var _param_title    = [item.P_COMPANY, item.P_FR_DATE, item.P_FR_TO, item.P_BOOK_CCY,item.P_STATUS, item.P_TCO_BUSPLACE_PK, item.P_LANG];
                var dt_Title;
                try{
                        dt_Title = await DBService.callProcCursor(_store_title, _param_title , p_language , p_crt_by); 
                }catch (e){
                        dt_Title = await DBService.callProcCursor('AC_RPT_6045035_TITLEDTACCALL', _param_title , p_language , p_crt_by); 
                }
                /********* Read file excel ********/ 
                const templateFile  = Helpers.resourcesPath(_resourcesPath); 
                await workbook.xlsx.readFile(templateFile);
                var worksheet       = workbook.getWorksheet(1);
                /********* Write file excel ********/
                    /********* Call partner store  ***************/ 
                var dt_Data  = await DBService.callProcCursor(_store, _param , p_language , p_crt_by); 
                var pos_title = 0;
                var _lang = item.P_LANG;
                var acc_info = "";
                var ac_code = "";
                var ac_name = "";
                var _bookccy = item.P_BOOK_CCY;  
                
                var _formatAmt = (_bookccy=='VND'?'#,##0_);[Red](#,##0);_(* "-"_);_(@_)':'#,##0.00_);[Red](#,##0.00);_(* "-"_);_(@_)');
                if (dt_Data.length>0) 
                {
                    for (var i = 0; i < dt_Data.length; i++) 
                    {
                        dt_Data = dt_Data;
                        if( dt_Data[i].ACC_INFO != acc_info || i == 0)
                        {
                            acc_info = dt_Data[i].ACC_INFO;
                            ac_code = dt_Data[i].AC_CD;
                            if(i>0){
                                worksheet   = workbook.addWorksheet(); 
                            }
                            worksheet.name = ac_code; 
                        
                            // Width
                            worksheet.getColumn(1).width = 13.75; // date 
                            worksheet.getColumn(2).width = 13; // voucher no 
                            worksheet.getColumn(3).width = 13; // voucher date 
                            worksheet.getColumn(4).width = 40; // local desrciption
                            worksheet.getColumn(5).width = 40; // Desrciption
                            worksheet.getColumn(6).width = 15; // Corresponding Account
                            worksheet.getColumn(7).width = 15.86; // Amount Debit 
                            worksheet.getColumn(8).width = 15.86; // Amount Credit
                            worksheet.getColumn(9).width = 15.86; // Amount Debit Balance
                            worksheet.getColumn(10).width = 15.86; // Amount Credit Balance
                            worksheet.getColumn(11).width = 8.43; // Remart
                            worksheet.getColumn(12).width = 0; // Unclose
                            worksheet.getColumn(13).width = 30.0; // Corresponding Account Name
                            pos_title = 0;
                            //INFOMATION COMPANY
                            pos_title = pos_title + 1;
                            //sign
                            var row_title = worksheet.getRow(pos_title);
                            // Info
                            row_title.getCell(1).value = dt_Title[0].BIZ_NM_A1; // biz name
                            row_title.getCell(7).value = dt_Title[0].MS_H1; // Mẫu số 31a 
                            worksheet.mergeCells(pos_title,7, pos_title,9);// merge MS
                            row_title.getCell(7).font  = { italic: false, bold: true, color: {argb:'000000'}, size:10, name: 'Times New Roman'};
                            row_title.getCell(7).alignment = { vertical: 'middle', horizontal: 'center' };
                            pos_title = pos_title + 1;
                            row_title = worksheet.getRow(pos_title);
                            row_title.getCell(1).value = dt_Title[0].BIZ_TAX_A2; // biz tax code
                            row_title.getCell(7).value = dt_Title[0].EV_H2; // Thong tu
                            worksheet.mergeCells(pos_title,7, pos_title,9);// Thong tu
                            row_title.getCell(7).font  = { italic: false, bold: false, color: {argb:'000000'}, size:10, name: 'Times New Roman'};
                            pos_title = pos_title + 1;
                            row_title = worksheet.getRow(pos_title);
                            row_title.getCell(1).value = dt_Title[0].BIZ_ADD_A3; // Address
                            row_title.getCell(7).value = dt_Title[0].EV_H3; // Thong tu
                            worksheet.mergeCells(pos_title,7, pos_title,9);// Thong tu
                            row_title.getCell(7).font  = { italic: false, bold: false, color: {argb:'000000'}, size:10, name: 'Times New Roman'};
                            pos_title = pos_title + 1;
                            row_title = worksheet.getRow(pos_title)
                            
                            row_title.height = 30; 
                            row_title.getCell(1).value = dt_Title[0].TITLE_A4; // Title
                            row_title.getCell(1).font  = { italic: false, bold: true, color: {argb:'000000'}, size:18, name: 'Times New Roman'};
                            row_title.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
                            worksheet.mergeCells(pos_title,1, pos_title,13);// Title
                            pos_title = pos_title + 1;
                            row_title = worksheet.getRow(pos_title);
                            row_title.getCell(1).value = dt_Title[0].DATE_TOFRM_A5; // from date - todate
                            row_title.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
                            row_title.getCell(1).font  = { italic: false, bold: false, size:10, color: {argb:'000000'}, name: 'Times New Roman'};
                            worksheet.mergeCells(pos_title,1, pos_title,13);// from date - todate
                            pos_title = pos_title + 1;
                            row_title = worksheet.getRow(pos_title);
                            row_title.getCell(1).value =_lang == 'VIE' ? 'Tài khoản : ' + acc_info : 'Account code : ' + acc_info; // account
                            row_title.getCell(1).font  = { italic: false, bold: true, size:10, color: {argb:'000000'}, name: 'Times New Roman'};
                            pos_title = pos_title + 1;
                            row_title = worksheet.getRow(pos_title);
                            row_title.getCell(1).value = dt_Title[0].STATUS_A7; // status
                            row_title.getCell(1).font  = { italic: false, bold: true, size:10, color: {argb:'000000'}, name: 'Times New Roman'};
                            pos_title = pos_title + 1;
                            row_title = worksheet.getRow(pos_title);
                            row_title.getCell(9).value = dt_Title[0].DVT_I8; // unit
                            row_title.getCell(9).font  = { italic: false, bold: true, size:10, color: {argb:'000000'}, name: 'Times New Roman'};
                            row_title.getCell(9).alignment = { vertical: 'middle', horizontal: 'right' };

                            //bảng
                            pos_title = pos_title + 2;//10
                            row_title = worksheet.getRow(pos_title);
                            pos_title = pos_title + 1;//11
                            var row_title_11 = worksheet.getRow(pos_title);

                            row_title.getCell(1).value      = dt_Title[0].A10_11; // date - ngày tháng năm row 9-10
                            row_title.getCell(2).value      = dt_Title[0].BC10; // voucher
                            row_title_11.getCell(2).value   = dt_Title[0].B11; // voucher no
                            row_title_11.getCell(3).value   = dt_Title[0].C11; // voucher date
                            row_title.getCell(4).value      = dt_Title[0].D10; //Local Description 
                            row_title.getCell(5).value      = dt_Title[0].E10; // Description
                            row_title.getCell(6).value      = dt_Title[0].F10_11; // Corresponding Account
                            row_title.getCell(7).value      = dt_Title[0].GH10; // Amount
                            row_title_11.getCell(7).value   = dt_Title[0].G11; // Amount Debit
                            row_title_11.getCell(8).value   = dt_Title[0].H11; // Amount  Credit  
                            row_title.getCell(9).value      = dt_Title[0].IJ10; // Balance
                            row_title_11.getCell(9).value   = dt_Title[0].I11; // Balance Debit
                            row_title_11.getCell(10).value  = dt_Title[0].J11; // Balance  Credit 
                            row_title.getCell(11).value     = dt_Title[0].K10; //Remark 
                            row_title_11.getCell(11).value  = dt_Title[0].K11;//SEQ 
                            row_title.getCell(12).value     = dt_Title[0].L10_11;//Unclose 
                            row_title.getCell(13).value     = dt_Title[0].M10_11;//Corresponding Account Name 


                            //-------------------Merger-------------------------
                            worksheet.mergeCells(pos_title-1,1,pos_title,1); //date - ngày tháng năm  10-11
                            worksheet.mergeCells(pos_title-1,2,pos_title-1,3); //voucher  10-10
                            worksheet.mergeCells(pos_title-1,4,pos_title,4); //Local Description  10-11
                            worksheet.mergeCells(pos_title-1,5,pos_title,5); //Description  10-11
                            worksheet.mergeCells(pos_title-1,6,pos_title,6); //Corresponding Account 10-11
                            worksheet.mergeCells(pos_title-1,7,pos_title-1,8); //Amount  10-10
                            worksheet.mergeCells(pos_title-1,9,pos_title-1,10); //Balance  10-10
                            worksheet.mergeCells(pos_title-1,13,pos_title,13); //Balance  10-1
                            
                            

                            for(let j = 1; j<=13; j++)
                            {
                                row_title.getCell(6).alignment = {horizontal: 'center', wrapText: true  };  
                                row_title.getCell(j).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "D9D9D9" } };
                                row_title.getCell(j).alignment = { vertical: 'middle', horizontal: 'center' };
                                row_title.getCell(j).font      = { italic: false, bold: true, color: {argb:'000000'}, size:10, name: 'Times New Roman'};
                                row_title.getCell(j).border = {
                                                                top: {style:'thin', color: {argb:'A6A6A6'}},
                                                                left: {style:'thin', color: {argb:'A6A6A6'}},
                                                                bottom: {style:'thin', color: {argb:'A6A6A6'}},
                                                                right: {style:'thin', color: {argb:'A6A6A6'}}
                                                            }; 
                                                            
                                row_title_11.getCell(j).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "D9D9D9" } };
                                row_title_11.getCell(j).font = { italic: false, bold: true, color: {argb:'000000'}, size:10, name: 'Times New Roman'};
                                row_title_11.getCell(j).alignment = { vertical: 'middle', horizontal: 'center' };
                                row_title_11.getCell(j).border = {
                                                                top: {style:'thin', color: {argb:'A6A6A6'}},
                                                                left: {style:'thin', color: {argb:'A6A6A6'}},
                                                                bottom: {style:'thin', color: {argb:'A6A6A6'}},
                                                                right: {style:'thin', color: {argb:'A6A6A6'}}
                                                            };                     
                            }
                            
                        }
                        
                        //-------Fill Data----------------  
                        pos_title = pos_title + 1 ;  
                        var row_item = worksheet.getRow(pos_title);
                        row_item.getCell(1).value   = dt_Data[i].TR_DATE;
                        row_item.getCell(2).value   = dt_Data[i].VOUCHERNO;    
                        row_item.getCell(3).value   = dt_Data[i].VOUCHER_DT;  
                        row_item.getCell(4).value   = dt_Data[i].REMARK2; 
                        row_item.getCell(5).value   = dt_Data[i].REMARK; 
                        row_item.getCell(6).value   = dt_Data[i].ACC_CR; 
                        row_item.getCell(7).value   = dt_Data[i].PS_DEBIT;   
                        row_item.getCell(7).numFmt  = _formatAmt;
                        row_item.getCell(8).value   = dt_Data[i].PS_CREDIT;  
                        row_item.getCell(8).numFmt  = _formatAmt;
                        row_item.getCell(9).value   = dt_Data[i].TOTAL_DEBIT;  
                        row_item.getCell(9).numFmt  = _formatAmt;
                        row_item.getCell(10).value  = dt_Data[i].TOTAL_CREDIT;  
                        row_item.getCell(10).numFmt = _formatAmt;
                        row_item.getCell(11).value  = dt_Data[i].PK;
                        row_item.getCell(12).value  = dt_Data[i].TR_ENCLOSE;  
                        row_item.getCell(13).value  = dt_Data[i].ACNM_CR;  
                        for(let y = 7; y<=10; y++)
                        {
                            row_item.getCell(y).font  = { italic: false, bold: false, size:10,color: {argb:'000000'}, name: 'Times New Roman' };
                            row_item.getCell(y).alignment = { vertical: 'middle', horizontal: 'right' };
                        }

                        if(dt_Data[i].ORD === 'O' || dt_Data[i].ORD === 'T'|| dt_Data[i].ORD === 'E')
                        {
                            row_item.getCell(4).font  = { italic: false, bold: true, size:10, color: {argb:'000000'} , horizontal: 'center'};
                            worksheet.getCell(pos_title,4).alignment = { vertical: 'middle', horizontal: 'center' };
                            for(let z = 7; z<=10; z++)
                            {
                                row_item.getCell(z).font  = { italic: false, bold: true, size:10,color: {argb:'000000'}, name: 'Times New Roman' };
                                row_item.getCell(z).alignment = { vertical: 'middle', horizontal: 'right' };
                            }
                        }
                        for(let j = 1; j<=13; j++)
                        {
                            row_item.getCell(j).border = {
                                                            top: {style:'thin', color: {argb:'A6A6A6'}},
                                                            left: {style:'thin', color: {argb:'A6A6A6'}},
                                                            bottom: {style:'thin', color: {argb:'A6A6A6'}},
                                                            right: {style:'thin', color: {argb:'A6A6A6'}}
                                                        }; 
                        }
                        if(dt_Data[i].ORD === 'E'){
                            pos_title = pos_title + 2;
                            row_title = worksheet.getRow(pos_title);
                            row_title.getCell(1).value = dt_Title[0].EV_A21; // Prepared by
                            row_title.getCell(1).font  = { italic: false, bold: true, color: {argb:'000000'}, size:10, name: 'Times New Roman'};
                            worksheet.mergeCells(pos_title,1, pos_title,3);// 
                            row_title.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
                            row_title.getCell(5).value = dt_Title[0].EV_E21; // Chief Account
                            row_title.getCell(5).font  = { italic: false, bold: true, color: {argb:'000000'}, size:10, name: 'Times New Roman'};
                            row_title.getCell(5).alignment = { vertical: 'middle', horizontal: 'center' };
                            row_title.getCell(7).value = dt_Title[0].EV_I21; // General Director
                            row_title.getCell(7).font  = { italic: false, bold: true, color: {argb:'000000'}, size:10, name: 'Times New Roman'};
                            worksheet.mergeCells(pos_title,7, pos_title,9);// 
                            row_title.getCell(7).alignment = { vertical: 'middle', horizontal: 'center' };
                            // sign,fullname  
                            pos_title =    pos_title + 1;
                            row_title = worksheet.getRow(pos_title);
                            row_title.getCell(1).value = dt_Title[0].EV_SIG_A21; // Prepared by
                            row_title.getCell(1).font  = { italic: true, bold: false, color: {argb:'000000'}, name: 'Times New Roman'};
                            worksheet.mergeCells(pos_title,1, pos_title,3);// 
                            row_title.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
                            row_title.getCell(5).value = dt_Title[0].EV_SIG_E21; // Chief Account
                            row_title.getCell(5).font  = { italic: true, bold: false, color: {argb:'000000'}, name: 'Times New Roman'};
                            row_title.getCell(5).alignment = { vertical: 'middle', horizontal: 'center' };
                            row_title.getCell(7).value = dt_Title[0].EV_SIG_I21; // General Director
                            row_title.getCell(7).font  = { italic: true, bold: false, color: {argb:'000000'}, name: 'Times New Roman'};
                            worksheet.mergeCells(pos_title,7, pos_title,9);// 
                            row_title.getCell(7).alignment = { vertical: 'middle', horizontal: 'center' };
                        }
                    }
                }
                
                /********* Print file excel ********/
                const reportFile    = Helpers.tmpPath(file_new);
                await workbook.xlsx.writeFile(reportFile)
                return response.attachment( reportFile, file_new);
            
            } 
        catch (e) 
        {
            Utils.Logger({ LVL: "error", MODULE: "Report", FUNC: "rpt_6045035_General_Ledger_DT_ACC_ALL", CONTENT: e.message })
            // return response.send(Utils.response(false, e.message, null))
            return response.send(null);
        }
    }
    /*###################################### xong chờ check EACBK002 S38-DN2-V2 Report  General ledger detail books no8 ###########################################################################*/ 
    async rpt_6045035_General_Ledger_DT_V2({ request, response, auth }) {
        try 
        { 
           /* P_RPT_ID: report_info.VAL1, P_RPT_URL: report_info.VAL2, P_RPT_FILE: report_info.VAL3,
                P_COMP_ID: company_info.PARTNER_ID, P_COMP_NM: company_info.TEXT, P_COMP_TAX: company_info.TAX_CODE, P_COMP_ADD: company_info.ADDR1,
                P_COMPANY: this.selectedCompany,P_ACC_PK: this.TAC_ABACCTCODE_PK, P_FR_DATE: this.from_date, P_FR_TO: this.to_date, 
                P_CCY: this.selectedCurrency, P_STATUS: this.selectedStatus, P_BOOK_CCY: this.txtBookCCY, P_CIRCULARS: this.selectedCircular, P_PRINT_VOUCHER_NO : this.selectedPrintVoucherNo, 
                P_OPTION: this.selectedOptionListGLDT, P_POST_SUM : this.selectedPostSum, P_AMT_TYPE: this.selectedAmtType, P_LANG : this.selectedLanguage, P_DATE_NOW: this.datetime
              */
            /****************************** Get Param *********************************/
            let { para }        = request.get(['para']);
            /********* Parse pram to json ********/
            var item            = JSON.parse(para); 
            const user          = await auth.getUser() ;
            var COMP_ID         = item.P_COMP_ID, COMP_NM = item.P_COMP_NM, COMP_TAX = item.P_COMP_TAX, COMP_ADD = item.P_COMP_ADD;
            var BIZ_ID          = item.P_BIZ_ID , BIZ_NM  = item.P_BIZ_NM , BIZ_TAX  = item.P_BIZ_TAX , BIZ_ADD  = item.P_BIZ_ADD;
            const p_crt_by      = user.USER_ID;
            const p_language    = request.header("accept-language", "ENG");
            var file_nm         = [item.P_RPT_FILE];
            var file_type       = ".xlsx";
            var full_nm         = file_nm + file_type;
            var file_new        = file_nm + p_crt_by + file_type;
            var _resourcesPath  = [item.P_RPT_URL]+'/'+full_nm;
            var _store          = "AC_RPT_6045035_ALL_ACC_DT_V2";
            var _store_title    = "AC_RPT_6045035_TITLE_DT_2";
            var _param          = [item.P_COMPANY, item.P_FR_DATE, item.P_FR_TO, item.P_ACC_PK, item.P_PARTNER_PK, item.P_STATUS, item.P_TCO_BUSPLACE_PK, item.P_LANG];
            /***************************** Return failded ****************************/
            if (!user) 
            {
                return response.send(Utils.response(false, "Request failed!", null));
            } 
            /****************************** Begin call store and write excell *********/
            else 
                /********* Call store infomation tltle ***************/ 
                var _param_title    = [item.P_COMPANY, item.P_FR_DATE, item.P_FR_TO, item.P_BOOK_CCY, item.P_TCO_BUSPLACE_PK, item.P_LANG];
                var dt_Title  = await DBService.callProcCursor(_store_title, _param_title , p_language , p_crt_by); 
                /********* Read file excel ********/ 
                const templateFile  = Helpers.resourcesPath(_resourcesPath); 
                await workbook.xlsx.readFile(templateFile);
                var worksheet       = workbook.getWorksheet(1);
                /********* Write file excel ********/
                    /********* Call partner store  ***************/ 
                var dt_Data  = await DBService.callProcCursor(_store, _param , p_language , p_crt_by); 
                var pos_title = 0;
                var _lang = item.P_LANG;
                var acc_info = "";
                var ac_code = "";
                var ac_name = "";
                if (dt_Data.length>0) 
                {
                    for (var i = 0; i < dt_Data.length; i++) 
                    {
                        dt_Data = dt_Data;
                        if( dt_Data[i].ACC_INFO != acc_info || i == 0)
                        {
                            acc_info = dt_Data[i].ACC_INFO;
                            ac_code = dt_Data[i].AC_CD;
                            if(i>0){
                                worksheet   = workbook.addWorksheet(); 
                            }
                            worksheet.name = ac_code; 
                        
                            // Width
                            worksheet.getColumn(1).width = 10; // date
                            worksheet.getColumn(2).width = 13; // voucher no
                            worksheet.getColumn(3).width = 13; // voucher date
                            worksheet.getColumn(4).width = 40; // local desrciption
                            worksheet.getColumn(5).width = 40; // Desrciption
                            worksheet.getColumn(6).width = 9.0; // Debit account Code
                            worksheet.getColumn(7).width = 9.0; // Credit Account Code
                            worksheet.getColumn(8).width = 7.57; // Exchange Rate 
                            worksheet.getColumn(9).width = 16.57; // Amount Debit 
                            worksheet.getColumn(10).width = 16.57; // Amount Credit
                            worksheet.getColumn(11).width = 16.57; // Balance
                            worksheet.getColumn(12).width = 16.57; // Amount Debit Trans
                            worksheet.getColumn(13).width = 16.57; // Amount Credit Trans
                            worksheet.getColumn(14).width = 16.57;  //Balance Trans
                            worksheet.getColumn(15).width = 10.14; // Tỷ giá
                            worksheet.getColumn(16).width = 8.43; // Remart
                            worksheet.getColumn(17).width = 12.43; // PL Code
                            worksheet.getColumn(18).width = 23.86; // PL Name
                            worksheet.getColumn(19).width = 0; // Unclose
                            worksheet.getColumn(20).width = 17; // Debit account Name
                            worksheet.getColumn(21).width = 17; // Credit account Name
							pos_title = 0;
                            //INFOMATION COMPANY
                            pos_title = pos_title + 1;
                            //sign
                            var row_title = worksheet.getRow(pos_title);
                            // Info
                            row_title.getCell(1).value = dt_Title[0].BIZ_NM_A1; // biz name
                            row_title.getCell(16).value = dt_Title[0].MS_H1; // Mẫu số 31a 
                            worksheet.mergeCells(pos_title,16, pos_title,18);// merge MS
                            row_title.getCell(16).font  = { italic: false, bold: true, color: {argb:'000000'}, name: 'Times New Roman'};
                            row_title.getCell(16).alignment = { vertical: 'middle', horizontal: 'center' };
                            pos_title = pos_title + 1;
                            row_title = worksheet.getRow(pos_title);
                            row_title.getCell(1).value = dt_Title[0].BIZ_TAX_A2; // biz tax code
                            row_title.getCell(16).value = dt_Title[0].EV_H2; // Thong tu
                            worksheet.mergeCells(pos_title,16, pos_title,18);// Thong tu
                            pos_title = pos_title + 1;
                            row_title = worksheet.getRow(pos_title);
                            row_title.getCell(1).value = dt_Title[0].BIZ_ADD_A3; // Address
                            row_title.getCell(16).value = dt_Title[0].EV_H3; // Thong tu
                            worksheet.mergeCells(pos_title,16, pos_title,18);// Thong tu
                            pos_title = pos_title + 1;
                            row_title = worksheet.getRow(pos_title);
                            row_title.height = 30; 
                            row_title.getCell(1).value = dt_Title[0].TITLE_A4; // Title
                            row_title.getCell(1).font  = { italic: false, bold: true, color: {argb:'000000'}, size:18, name: 'Times New Roman'};
                            row_title.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
                            worksheet.mergeCells(pos_title,1, pos_title,21);// Title
                            pos_title = pos_title + 1;
                            row_title = worksheet.getRow(pos_title);
                            row_title.getCell(1).value = dt_Title[0].DATE_TOFRM_A5; // from date - todate
                            row_title.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
                            row_title.getCell(1).font  = { italic: false, bold: false, color: {argb:'000000'}, size:10,name: 'Times New Roman'};
                            worksheet.mergeCells(pos_title,1, pos_title,21);// from date - todate
                            pos_title = pos_title + 1;
                            row_title = worksheet.getRow(pos_title);
                            row_title.getCell(1).value =_lang == 'VIE' ? 'Tài khoản :' + acc_info : 'Account code :' + acc_info; // account
                            row_title.getCell(1).font  = { italic: false, bold: true, color: {argb:'000000'}, size:10,name: 'Times New Roman'};
                            pos_title = pos_title + 1;
                            row_title = worksheet.getRow(pos_title);
                            row_title.getCell(12).value = dt_Title[0].DVT_L11; // unit
                            row_title.getCell(12).font  = { italic: false, bold: true, color: {argb:'000000'}, size:10, name: 'Times New Roman'};
                            row_title.getCell(12).alignment = { vertical: 'middle', horizontal: 'right' };

                            //bảng
                            pos_title = pos_title + 2;//9
                            row_title = worksheet.getRow(pos_title);
                            pos_title = pos_title + 1;//10
                            var row_title_10 = worksheet.getRow(pos_title);

                            row_title.getCell(1).value      = dt_Title[0].A9_10; // date - ngày tháng năm row 9-10
                            row_title.getCell(2).value      = dt_Title[0].BC9_9; // voucher
                            row_title_10.getCell(2).value   = dt_Title[0].B10; // voucher no
                            row_title_10.getCell(3).value   = dt_Title[0].C10; // voucher date
                            row_title.getCell(4).value      = dt_Title[0].D9_10; //Local Description 
                            row_title.getCell(5).value      = dt_Title[0].E9_10; // Description
                            row_title.getCell(6).value      = dt_Title[0].F9_10; // Debit account Code
                            row_title.getCell(7).value      = dt_Title[0].G9_10; //Credit account Code

                            row_title.getCell(8).value      = dt_Title[0].H9_10;//Exchange Rate

                            row_title.getCell(9).value      = dt_Title[0].IJ9; // Amount   
                            row_title_10.getCell(9).value   = dt_Title[0].I10; // Debit 
                            row_title_10.getCell(10).value  = dt_Title[0].J10; // Credit 
                            row_title.getCell(11).value     = dt_Title[0].K9_10; // Balance 
                            row_title.getCell(12).value     = dt_Title[0].LM9; // Amount 
                            row_title_10.getCell(12).value  = dt_Title[0].L10; // Amount Debit Trans
                            row_title_10.getCell(13).value  = dt_Title[0].M10; // Amount Credit Trans
                            row_title.getCell(14).value     = dt_Title[0].N9_10; // Balance Trans
                            row_title.getCell(15).value     = dt_Title[0].O9_10; // Tỷ giá
                            row_title.getCell(16).value     = dt_Title[0].P9; // Remart
                            row_title_10.getCell(16).value  = dt_Title[0].P10; // Remart
                            
                            row_title.getCell(17).value     = dt_Title[0].QR9; //PL Code 
                            row_title_10.getCell(17).value  = dt_Title[0].Q10; //PL Code 
                            row_title_10.getCell(18).value  = dt_Title[0].R10; //PL Name 

                            row_title.getCell(19).value     = dt_Title[0].S9_10; //Unclose 
                            row_title.getCell(20).value     = dt_Title[0].T9_10; //Debit account Name 
                            row_title.getCell(21).value     = dt_Title[0].U9_10; //Credit account Name  


                            //-------------------Merger-------------------------
                            worksheet.mergeCells(pos_title-1,1,pos_title,1); //date - ngày tháng năm  9-10
                            worksheet.mergeCells(pos_title-1,2,pos_title-1,3); //voucher  9-9
                            worksheet.mergeCells(pos_title-1,4,pos_title,4); //Local Description  9-10
                            worksheet.mergeCells(pos_title-1,5,pos_title,5); //Description  9-10
                            worksheet.mergeCells(pos_title-1,6,pos_title,6); //Debit account Code 9-10
                            worksheet.mergeCells(pos_title-1,7,pos_title,7); //Credit account Code  9-10
                            worksheet.mergeCells(pos_title-1,8,pos_title,8); //Exchange Rate 9-10

                            worksheet.mergeCells(pos_title-1,9,pos_title-1,10); //Amount  9-9
                            worksheet.mergeCells(pos_title-1,11,pos_title,11); //Balance  9-10
                            worksheet.mergeCells(pos_title-1,12,pos_title-1,13); //Amount  9-9
                            worksheet.mergeCells(pos_title-1,14,pos_title,14); //Balance 9-10
                            worksheet.mergeCells(pos_title-1,15,pos_title,15); //Tỷ giá 9-10
                            worksheet.mergeCells(pos_title-1,17,pos_title-1,18); //PL  9-9

                            
                            worksheet.mergeCells(pos_title-1,19,pos_title,19); //Unclose  9-10
                            worksheet.mergeCells(pos_title-1,20,pos_title,20); //Debit account Name  9-10
                            worksheet.mergeCells(pos_title-1,21,pos_title,21); //Credit account Name   9-10
    
                            for(let j = 1; j<=21; j++)
                            {
                                row_title.getCell(j).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "D9D9D9" } };
                                row_title.getCell(j).alignment = { vertical: 'middle', horizontal: 'center'};
                                row_title.getCell(j).font      = { italic: false, bold: true, color: {argb:'000000'}, size:10, name: 'Times New Roman'};
                                row_title.getCell(j).border = {
                                                                top: {style:'thin', color: {argb:'A6A6A6'}},
                                                                left: {style:'thin', color: {argb:'A6A6A6'}},
                                                                bottom: {style:'thin', color: {argb:'A6A6A6'}},
                                                                right: {style:'thin', color: {argb:'A6A6A6'}}
                                                            }; 
                                                            
                                row_title_10.getCell(j).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "D9D9D9" } };
                                row_title_10.getCell(j).font = { italic: false, bold: true, color: {argb:'000000'}, size:10, name: 'Times New Roman'};
                                row_title_10.getCell(j).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true  };
                                row_title_10.getCell(j).border = {
                                                                top: {style:'thin', color: {argb:'A6A6A6'}},
                                                                left: {style:'thin', color: {argb:'A6A6A6'}},
                                                                bottom: {style:'thin', color: {argb:'A6A6A6'}},
                                                                right: {style:'thin', color: {argb:'A6A6A6'}}
                                                            };                       
                            }
                            
                        }
                       
                        //-------Fill Data----------------  
                        pos_title = pos_title + 1 ; 
                        var _bookccy = item.P_BOOK_CCY;  
                        var row_item = worksheet.getRow(pos_title);
                        var l_exrate = 0; 
                        var _formatAmt = (_bookccy=='VND'?'_(* #,##0_);_(* (#,##0);_(* "-"_);_(@_)':'_(* #,##0.00_);_(* (#,##0.00);_(* "-"_);_(@_)');
                        var _format_2 = '_(* #,##0.00_);_(* (#,##0.00);_(* "-"_);_(@_)';

                        if(dt_Data[i].TOTAL_DEBIT != "" && dt_Data[i].TOTAL_FDEBIT != "" && dt_Data[i].TOTAL_FDEBIT != 0 )
                        {
                            l_exrate = dt_Data[i].TR_RATE;
                        }
                        else
                        {
                            l_exrate = Number(dt_Data[i].CLOSINGBALANCE) /  Number(dt_Data[i].FCLOSINGBALANCE);//dt_Data[y].TR_RATE;
                        }

                        row_item.getCell(1).value   = dt_Data[i].TR_DATE;
                        row_item.getCell(2).value   = dt_Data[i].VOUCHERNO;     
                        row_item.getCell(3).value   = dt_Data[i].VOUCHER_DT;
                        row_item.getCell(4).value   = dt_Data[i].REMARK; 
                        row_item.getCell(5).value   = dt_Data[i].REMARK2; 
                        row_item.getCell(6).value   = dt_Data[i].ACC_DR; 
                        row_item.getCell(7).value   = dt_Data[i].ACC_CR;
                        row_item.getCell(8).value   = dt_Data[i].TR_RATE; 
                        worksheet.getCell(pos_title,8).alignment = { vertical: 'middle', horizontal: 'right' };
                        row_item.getCell(9).value   = dt_Data[i].PS_DEBIT; 
                        row_item.getCell(9).numFmt  = _formatAmt;
                        worksheet.getCell(pos_title,9).alignment = { vertical: 'middle', horizontal: 'right' };
                        row_item.getCell(10).value  = dt_Data[i].PS_CREDIT;  
                        row_item.getCell(10).numFmt  = _formatAmt;
                        worksheet.getCell(pos_title,10).alignment = { vertical: 'middle', horizontal: 'right' };
                        row_item.getCell(11).value  = dt_Data[i].CLOSINGBALANCE;
                        row_item.getCell(11).numFmt  = _formatAmt;
                        worksheet.getCell(pos_title,11).alignment = { vertical: 'middle', horizontal: 'right' };
                        row_item.getCell(12).value  = dt_Data[i].PS_FDEBIT;
                        row_item.getCell(12).numFmt  = _format_2;
                        worksheet.getCell(pos_title,12).alignment = { vertical: 'middle', horizontal: 'right' };
                        row_item.getCell(13).value  = dt_Data[i].PS_FCREDIT;  
                        row_item.getCell(13).numFmt  = _format_2;
                        worksheet.getCell(pos_title,13).alignment = { vertical: 'middle', horizontal: 'right' };
                        row_item.getCell(14).value  = dt_Data[i].FCLOSINGBALANCE;  
                        row_item.getCell(14).numFmt  = _format_2;
                        worksheet.getCell(pos_title,14).alignment = { vertical: 'middle', horizontal: 'right' };
                        row_item.getCell(15).value  = l_exrate;  
                        row_item.getCell(15).numFmt  = _formatAmt;
                        worksheet.getCell(pos_title,15).alignment = { vertical: 'middle', horizontal: 'right' };
                        row_item.getCell(16).value  = dt_Data[i].TAC_HGTRH_PK; 
                        row_item.getCell(17).value  = dt_Data[i].PL_CD;  
                        row_item.getCell(18).value  = dt_Data[i].PL_NM; 
                        row_item.getCell(19).value  = ""; 
                        row_item.getCell(20).value  = dt_Data[i].ACNM_DR; 
                        worksheet.getCell(pos_title,20).alignment = { vertical: 'middle', horizontal: 'center', shrinkToFit: true  }; 
                        row_item.getCell(21).value  = dt_Data[i].ACNM_CR; 
                        worksheet.getCell(pos_title,21).alignment = { vertical: 'middle', horizontal: 'center', shrinkToFit: true  };
                        for(let j = 1; j<=21; j++)
                        {
                            row_item.getCell(j).border = {
                                                            top: {style:'thin', color: {argb:'A6A6A6'}},
                                                            left: {style:'thin', color: {argb:'A6A6A6'}},
                                                            bottom: {style:'thin', color: {argb:'A6A6A6'}},
                                                            right: {style:'thin', color: {argb:'A6A6A6'}}
                                                        }; 
                            row_item.getCell(j).font      = {color: {argb:'000000'}, size:10, name: 'Times New Roman'};
                        }
                        if(dt_Data[i].ORD === 'O' || dt_Data[i].ORD === 'T'|| dt_Data[i].ORD === 'E')
                        {
                            row_item.getCell(5).font  = { italic: false, bold: true, size:10, color: {argb:'000000'}, name: 'Times New Roman' };
                            worksheet.getCell(pos_title,5).alignment = { vertical: 'middle', horizontal: 'center' };
                            row_item.getCell(9).font  = { italic: false, bold: true, size:10, color: {argb:'000000'}, name: 'Times New Roman'};
                            row_item.getCell(10).font = { italic: false, bold: true, size:10, color: {argb:'000000'}, name: 'Times New Roman'};
                            row_item.getCell(11).font = { italic: false, bold: true, size:10, color: {argb:'000000'}, name: 'Times New Roman'};
                            row_item.getCell(12).font = { italic: false, bold: true, size:10, color: {argb:'000000'}, name: 'Times New Roman'};
                            row_item.getCell(13).font = { italic: false, bold: true, size:10, color: {argb:'000000'}, name: 'Times New Roman'};
                            row_item.getCell(14).font = { italic: false, bold: true, size:10, color: {argb:'000000'}, name: 'Times New Roman'};
                        }
                        if(dt_Data[i].STT === 2 || dt_Data[i].STT === 3)
                        {
                            row_item.getCell(5).font  = { italic: true, bold: true, size:10, color: {argb:'000000'}, name: 'Times New Roman' };
                            worksheet.getCell(pos_title,5).alignment = { vertical: 'middle', horizontal: 'center' };
                            row_item.getCell(9).font  = { italic: true, bold: true, size:10, color: {argb:'000000'}, name: 'Times New Roman'};
                            row_item.getCell(10).font = { italic: true, bold: true, size:10, color: {argb:'000000'}, name: 'Times New Roman'};
                            row_item.getCell(11).font = { italic: true, bold: true, size:10, color: {argb:'000000'}, name: 'Times New Roman'};
                            row_item.getCell(12).font = { italic: true, bold: true, size:10, color: {argb:'000000'}, name: 'Times New Roman'};
                            row_item.getCell(13).font = { italic: true, bold: true, size:10, color: {argb:'000000'}, name: 'Times New Roman'};
                            row_item.getCell(14).font = { italic: true, bold: true, size:10, color: {argb:'000000'}, name: 'Times New Roman'};
                        }
                        if(dt_Data[i].ORD === 'E'){
                            pos_title = pos_title + 2;
                            row_title = worksheet.getRow(pos_title);
                            row_title.getCell(1).value = dt_Title[0].DATE_I20; //
                            row_title.getCell(1).font  = { italic: false, bold: false, color: {argb:'000000'}, size:10, name: 'Times New Roman'};
                            pos_title = pos_title + 2;
                            row_title = worksheet.getRow(pos_title);
                            row_title.getCell(1).value = dt_Title[0].EV_A21; // Prepared by
                            row_title.getCell(1).font  = { italic: false, bold: true, color: {argb:'000000'}, size:10, name: 'Times New Roman'};
                            worksheet.mergeCells(pos_title,1, pos_title,2);// 
                            row_title.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
                            row_title.getCell(6).value = dt_Title[0].EV_E21; // Chief Account
                            row_title.getCell(6).font  = { italic: false, bold: true, color: {argb:'000000'}, size:10, name: 'Times New Roman'};
                            row_title.getCell(6).alignment = { vertical: 'middle', horizontal: 'center' };
                            worksheet.mergeCells(pos_title,6, pos_title,8);// 
                            row_title.getCell(12).value = dt_Title[0].EV_I21; // General Director
                            row_title.getCell(12).font  = { italic: false, bold: true, color: {argb:'000000'}, size:10, name: 'Times New Roman'};
                            worksheet.mergeCells(pos_title,12, pos_title,14);// 
                            row_title.getCell(12).alignment = { vertical: 'middle', horizontal: 'center' };
                            // sign,fullname  
                            pos_title =    pos_title + 1;
                            row_title = worksheet.getRow(pos_title);
                            row_title.getCell(1).value = dt_Title[0].EV_SIG_A21; // Prepared by
                            row_title.getCell(1).font  = { italic: true, bold: false, color: {argb:'000000'}, size:10, name: 'Times New Roman'};
                            worksheet.mergeCells(pos_title,1, pos_title,2);// 
                            row_title.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
                            row_title.getCell(6).value = dt_Title[0].EV_SIG_E21; // Chief Account
                            row_title.getCell(6).font  = { italic: true, bold: false, color: {argb:'000000'}, size:10, name: 'Times New Roman'};
                            row_title.getCell(6).alignment = { vertical: 'middle', horizontal: 'center' };
                            worksheet.mergeCells(pos_title,6, pos_title,8);// 
                            row_title.getCell(12).value = dt_Title[0].EV_SIG_I21; // General Director
                            row_title.getCell(12).font  = { italic: true, bold: false, color: {argb:'000000'}, size:10, name: 'Times New Roman'};
                            worksheet.mergeCells(pos_title,12, pos_title,14);// 
                            row_title.getCell(12).alignment = { vertical: 'middle', horizontal: 'center' };
                        }
                    }
                }
                /********* Print file excel ********/
                const reportFile    = Helpers.tmpPath(file_new);
                await workbook.xlsx.writeFile(reportFile)
                return response.attachment( reportFile, file_new);
         } 
        catch (e) 
        {
            Utils.Logger({ LVL: "error", MODULE: "Report", FUNC: "rpt_6045035_General_Ledger_DT_V2", CONTENT: e.message })
           // return response.send(Utils.response(false, e.message, null))
           return response.send(null);
        }
    }
    /*###################################### EACBK002 S38-DN2 Report  General ledger detail books no8 ###########################################################################*/ 
    async rpt_6045035_General_Ledger_DT({ request, response, auth }) {
        try 
        { 
           /* P_RPT_ID: report_info.VAL1, P_RPT_URL: report_info.VAL2, P_RPT_FILE: report_info.VAL3,
                P_COMP_ID: company_info.PARTNER_ID, P_COMP_NM: company_info.TEXT, P_COMP_TAX: company_info.TAX_CODE, P_COMP_ADD: company_info.ADDR1,
                P_COMPANY: this.selectedCompany,P_ACC_PK: this.TAC_ABACCTCODE_PK, P_FR_DATE: this.from_date, P_FR_TO: this.to_date, 
                P_CCY: this.selectedCurrency, P_STATUS: this.selectedStatus, P_BOOK_CCY: this.txtBookCCY, P_CIRCULARS: this.selectedCircular, P_PRINT_VOUCHER_NO : this.selectedPrintVoucherNo, 
                P_OPTION: this.selectedOptionListGLDT, P_POST_SUM : this.selectedPostSum, P_AMT_TYPE: this.selectedAmtType, P_LANG : this.selectedLanguage, P_DATE_NOW: this.datetime
              */
            /****************************** Get Param *********************************/
            let { para }        = request.get(['para']);
            /********* Parse pram to json ********/
            var item            = JSON.parse(para); 
            const user          = await auth.getUser() ;
            var COMP_ID         = item.P_COMP_ID, COMP_NM = item.P_COMP_NM, COMP_TAX = item.P_COMP_TAX, COMP_ADD = item.P_COMP_ADD;
            var BIZ_ID          = item.P_BIZ_ID , BIZ_NM  = item.P_BIZ_NM , BIZ_TAX  = item.P_BIZ_TAX , BIZ_ADD  = item.P_BIZ_ADD;
            const p_crt_by      = user.USER_ID;
            const p_language    = request.header("accept-language", "ENG");
            var file_nm         = [item.P_RPT_FILE];
            var file_type       = ".xlsx";
            var full_nm         = file_nm + file_type;
            var file_new        = file_nm + p_crt_by + file_type;
            var _resourcesPath  = [item.P_RPT_URL]+'/'+full_nm;
            var _store          = "AC_RPT_6045035_ALL_ACC_DT_2";
            var _store_title    = "AC_RPT_6045035_TITLE_DT_2";
            var _param          = [item.P_COMPANY, item.P_FR_DATE, item.P_FR_TO, item.P_ACC_PK, item.P_PARTNER_PK, item.P_STATUS, item.P_TCO_BUSPLACE_PK, item.P_LANG];
            /***************************** Return failded ****************************/
            if (!user) 
            {
                return response.send(Utils.response(false, "Request failed!", null));
            } 
            /****************************** Begin call store and write excell *********/
            else 
                /********* Call store infomation tltle ***************/ 
                var _param_title    = [item.P_COMPANY, item.P_FR_DATE, item.P_FR_TO, item.P_BOOK_CCY, item.P_TCO_BUSPLACE_PK, item.P_LANG];
                var dt_Title  = await DBService.callProcCursor(_store_title, _param_title , p_language , p_crt_by); 
                /********* Read file excel ********/ 
                const templateFile  = Helpers.resourcesPath(_resourcesPath); 
                await workbook.xlsx.readFile(templateFile);
                var worksheet       = workbook.getWorksheet(1);
                /********* Write file excel ********/
                    /********* Call partner store  ***************/ 
                var dt_Data  = await DBService.callProcCursor(_store, _param , p_language , p_crt_by); 
                var pos_title = 0;
                var _lang = item.P_LANG;
                var acc_info = "";
                var ac_code = "";
                var ac_name = "";
                if (dt_Data.length>0) 
                {
                    for (var i = 0; i < dt_Data.length; i++) 
                    {
                        dt_Data = dt_Data;
                        if( dt_Data[i].ACC_INFO != acc_info || i == 0)
                        {
                            acc_info = dt_Data[i].ACC_INFO;
                            ac_code = dt_Data[i].AC_CD;
                            if(i>0){
                                worksheet   = workbook.addWorksheet(); 
                            }
                            worksheet.name = ac_code; 
                        
                            // Width
                            worksheet.getColumn(1).width = 10; // date
                            worksheet.getColumn(2).width = 13; // voucher no
                            worksheet.getColumn(3).width = 13; // voucher date
                            worksheet.getColumn(4).width = 40; // local desrciption
                            worksheet.getColumn(5).width = 40; // Desrciption
                            worksheet.getColumn(6).width = 9.0; // Debit account Code
                            worksheet.getColumn(7).width = 9.0; // Credit Account Code
                            worksheet.getColumn(8).width = 7.57; // Exchange Rate 
                            worksheet.getColumn(9).width = 16.57; // Amount Debit 
                            worksheet.getColumn(10).width = 16.57; // Amount Credit
                            worksheet.getColumn(11).width = 16.57; // Balance
                            worksheet.getColumn(12).width = 16.57; // Amount Debit Trans
                            worksheet.getColumn(13).width = 16.57; // Amount Credit Trans
                            worksheet.getColumn(14).width = 16.57;  //Balance Trans
                            worksheet.getColumn(15).width = 10.14; // Tỷ giá
                            worksheet.getColumn(16).width = 8.43; // Remart
                            worksheet.getColumn(17).width = 12.43; // PL Code
                            worksheet.getColumn(18).width = 23.86; // PL Name
                            worksheet.getColumn(19).width = 0; // Unclose
                            worksheet.getColumn(20).width = 17; // Debit account Name
                            worksheet.getColumn(21).width = 17; // Credit account Name
							pos_title = 0;
                            //INFOMATION COMPANY
                            pos_title = pos_title + 1;
                            //sign
                            var row_title = worksheet.getRow(pos_title);
                            // Info
                            row_title.getCell(1).value = dt_Title[0].BIZ_NM_A1; // biz name
                            row_title.getCell(16).value = dt_Title[0].MS_H1; // Mẫu số 31a 
                            worksheet.mergeCells(pos_title,16, pos_title,18);// merge MS
                            row_title.getCell(16).font  = { italic: false, bold: true, color: {argb:'000000'}, name: 'Times New Roman'};
                            row_title.getCell(16).alignment = { vertical: 'middle', horizontal: 'center' };
                            pos_title = pos_title + 1;
                            row_title = worksheet.getRow(pos_title);
                            row_title.getCell(1).value = dt_Title[0].BIZ_TAX_A2; // biz tax code
                            row_title.getCell(16).value = dt_Title[0].EV_H2; // Thong tu
                            worksheet.mergeCells(pos_title,16, pos_title,18);// Thong tu
                            pos_title = pos_title + 1;
                            row_title = worksheet.getRow(pos_title);
                            row_title.getCell(1).value = dt_Title[0].BIZ_ADD_A3; // Address
                            row_title.getCell(16).value = dt_Title[0].EV_H3; // Thong tu
                            worksheet.mergeCells(pos_title,16, pos_title,18);// Thong tu
                            pos_title = pos_title + 1;
                            row_title = worksheet.getRow(pos_title);
                            row_title.height = 30; 
                            row_title.getCell(1).value = dt_Title[0].TITLE_A4; // Title
                            row_title.getCell(1).font  = { italic: false, bold: true, color: {argb:'000000'}, size:18, name: 'Times New Roman'};
                            row_title.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
                            worksheet.mergeCells(pos_title,1, pos_title,21);// Title
                            pos_title = pos_title + 1;
                            row_title = worksheet.getRow(pos_title);
                            row_title.getCell(1).value = dt_Title[0].DATE_TOFRM_A5; // from date - todate
                            row_title.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
                            row_title.getCell(1).font  = { italic: false, bold: false, color: {argb:'000000'}, size:10,name: 'Times New Roman'};
                            worksheet.mergeCells(pos_title,1, pos_title,21);// from date - todate
                            pos_title = pos_title + 1;
                            row_title = worksheet.getRow(pos_title);
                            row_title.getCell(1).value =_lang == 'VIE' ? 'Tài khoản :' + acc_info : 'Account code :' + acc_info; // account
                            row_title.getCell(1).font  = { italic: false, bold: true, color: {argb:'000000'}, size:10,name: 'Times New Roman'};
                            pos_title = pos_title + 1;
                            row_title = worksheet.getRow(pos_title);
                            row_title.getCell(12).value = dt_Title[0].DVT_L11; // unit
                            row_title.getCell(12).font  = { italic: false, bold: true, color: {argb:'000000'}, size:10, name: 'Times New Roman'};
                            row_title.getCell(12).alignment = { vertical: 'middle', horizontal: 'right' };

                            //bảng
                            pos_title = pos_title + 2;//9
                            row_title = worksheet.getRow(pos_title);
                            pos_title = pos_title + 1;//10
                            var row_title_10 = worksheet.getRow(pos_title);

                            row_title.getCell(1).value      = dt_Title[0].A9_10; // date - ngày tháng năm row 9-10
                            row_title.getCell(2).value      = dt_Title[0].BC9_9; // voucher
                            row_title_10.getCell(2).value   = dt_Title[0].B10; // voucher no
                            row_title_10.getCell(3).value   = dt_Title[0].C10; // voucher date
                            row_title.getCell(4).value      = dt_Title[0].D9_10; //Local Description 
                            row_title.getCell(5).value      = dt_Title[0].E9_10; // Description
                            row_title.getCell(6).value      = dt_Title[0].F9_10; // Debit account Code
                            row_title.getCell(7).value      = dt_Title[0].G9_10; //Credit account Code

                            row_title.getCell(8).value      = dt_Title[0].H9_10;//Exchange Rate

                            row_title.getCell(9).value      = dt_Title[0].IJ9; // Amount   
                            row_title_10.getCell(9).value   = dt_Title[0].I10; // Debit 
                            row_title_10.getCell(10).value  = dt_Title[0].J10; // Credit 
                            row_title.getCell(11).value     = dt_Title[0].K9_10; // Balance 
                            row_title.getCell(12).value     = dt_Title[0].LM9; // Amount 
                            row_title_10.getCell(12).value  = dt_Title[0].L10; // Amount Debit Trans
                            row_title_10.getCell(13).value  = dt_Title[0].M10; // Amount Credit Trans
                            row_title.getCell(14).value     = dt_Title[0].N9_10; // Balance Trans
                            row_title.getCell(15).value     = dt_Title[0].O9_10; // Tỷ giá
                            row_title.getCell(16).value     = dt_Title[0].P9; // Remart
                            row_title_10.getCell(16).value  = dt_Title[0].P10; // Remart
                            
                            row_title.getCell(17).value     = dt_Title[0].QR9; //PL Code 
                            row_title_10.getCell(17).value  = dt_Title[0].Q10; //PL Code 
                            row_title_10.getCell(18).value  = dt_Title[0].R10; //PL Name 

                            row_title.getCell(19).value     = dt_Title[0].S9_10; //Unclose 
                            row_title.getCell(20).value     = dt_Title[0].T9_10; //Debit account Name 
                            row_title.getCell(21).value     = dt_Title[0].U9_10; //Credit account Name  


                            //-------------------Merger-------------------------
                            worksheet.mergeCells(pos_title-1,1,pos_title,1); //date - ngày tháng năm  9-10
                            worksheet.mergeCells(pos_title-1,2,pos_title-1,3); //voucher  9-9
                            worksheet.mergeCells(pos_title-1,4,pos_title,4); //Local Description  9-10
                            worksheet.mergeCells(pos_title-1,5,pos_title,5); //Description  9-10
                            worksheet.mergeCells(pos_title-1,6,pos_title,6); //Debit account Code 9-10
                            worksheet.mergeCells(pos_title-1,7,pos_title,7); //Credit account Code  9-10
                            worksheet.mergeCells(pos_title-1,8,pos_title,8); //Exchange Rate 9-10

                            worksheet.mergeCells(pos_title-1,9,pos_title-1,10); //Amount  9-9
                            worksheet.mergeCells(pos_title-1,11,pos_title,11); //Balance  9-10
                            worksheet.mergeCells(pos_title-1,12,pos_title-1,13); //Amount  9-9
                            worksheet.mergeCells(pos_title-1,14,pos_title,14); //Balance 9-10
                            worksheet.mergeCells(pos_title-1,15,pos_title,15); //Tỷ giá 9-10
                            worksheet.mergeCells(pos_title-1,17,pos_title-1,18); //PL  9-9

                            
                            worksheet.mergeCells(pos_title-1,19,pos_title,19); //Unclose  9-10
                            worksheet.mergeCells(pos_title-1,20,pos_title,20); //Debit account Name  9-10
                            worksheet.mergeCells(pos_title-1,21,pos_title,21); //Credit account Name   9-10
    
                            for(let j = 1; j<=21; j++)
                            {
                                row_title.getCell(j).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "D9D9D9" } };
                                row_title.getCell(j).alignment = { vertical: 'middle', horizontal: 'center'};
                                row_title.getCell(j).font      = { italic: false, bold: true, color: {argb:'000000'}, size:10, name: 'Times New Roman'};
                                row_title.getCell(j).border = {
                                                                top: {style:'thin', color: {argb:'A6A6A6'}},
                                                                left: {style:'thin', color: {argb:'A6A6A6'}},
                                                                bottom: {style:'thin', color: {argb:'A6A6A6'}},
                                                                right: {style:'thin', color: {argb:'A6A6A6'}}
                                                            }; 
                                                            
                                row_title_10.getCell(j).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "D9D9D9" } };
                                row_title_10.getCell(j).font = { italic: false, bold: true, color: {argb:'000000'}, size:10, name: 'Times New Roman'};
                                row_title_10.getCell(j).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true  };
                                row_title_10.getCell(j).border = {
                                                                top: {style:'thin', color: {argb:'A6A6A6'}},
                                                                left: {style:'thin', color: {argb:'A6A6A6'}},
                                                                bottom: {style:'thin', color: {argb:'A6A6A6'}},
                                                                right: {style:'thin', color: {argb:'A6A6A6'}}
                                                            };                       
                            }
                            
                        }
                       
                        //-------Fill Data----------------  
                        pos_title = pos_title + 1 ; 
                        var _bookccy = item.P_BOOK_CCY;  
                        var row_item = worksheet.getRow(pos_title);
                        var l_exrate = 0; 
                        var _formatAmt = (_bookccy=='VND'?'_(* #,##0_);_(* (#,##0);_(* "-"_);_(@_)':'_(* #,##0.00_);_(* (#,##0.00);_(* "-"_);_(@_)');
                        var _format_2 = '_(* #,##0.00_);_(* (#,##0.00);_(* "-"_);_(@_)';

                        if(dt_Data[i].TOTAL_DEBIT != "" && dt_Data[i].TOTAL_FDEBIT != "" && dt_Data[i].TOTAL_FDEBIT != 0 )
                        {
                            l_exrate = dt_Data[i].TR_RATE;
                        }
                        else
                        {
                            l_exrate = Number(dt_Data[i].CLOSINGBALANCE) /  Number(dt_Data[i].FCLOSINGBALANCE);//dt_Data[y].TR_RATE;
                        }

                        row_item.getCell(1).value   = dt_Data[i].TR_DATE;
                        row_item.getCell(2).value   = dt_Data[i].VOUCHERNO;     
                        row_item.getCell(3).value   = dt_Data[i].VOUCHER_DT;
                        row_item.getCell(4).value   = dt_Data[i].REMARK; 
                        row_item.getCell(5).value   = dt_Data[i].REMARK2; 
                        row_item.getCell(6).value   = dt_Data[i].ACC_DR; 
                        row_item.getCell(7).value   = dt_Data[i].ACC_CR;
                        row_item.getCell(8).value   = dt_Data[i].TR_RATE; 
                        worksheet.getCell(pos_title,8).alignment = { vertical: 'middle', horizontal: 'right' };
                        row_item.getCell(9).value   = dt_Data[i].PS_DEBIT; 
                        row_item.getCell(9).numFmt  = _formatAmt;
                        worksheet.getCell(pos_title,9).alignment = { vertical: 'middle', horizontal: 'right' };
                        row_item.getCell(10).value  = dt_Data[i].PS_CREDIT;  
                        row_item.getCell(10).numFmt  = _formatAmt;
                        worksheet.getCell(pos_title,10).alignment = { vertical: 'middle', horizontal: 'right' };
                        row_item.getCell(11).value  = dt_Data[i].CLOSINGBALANCE;
                        row_item.getCell(11).numFmt  = _formatAmt;
                        worksheet.getCell(pos_title,11).alignment = { vertical: 'middle', horizontal: 'right' };
                        row_item.getCell(12).value  = dt_Data[i].PS_FDEBIT;
                        row_item.getCell(12).numFmt  = _format_2;
                        worksheet.getCell(pos_title,12).alignment = { vertical: 'middle', horizontal: 'right' };
                        row_item.getCell(13).value  = dt_Data[i].PS_FCREDIT;  
                        row_item.getCell(13).numFmt  = _format_2;
                        worksheet.getCell(pos_title,13).alignment = { vertical: 'middle', horizontal: 'right' };
                        row_item.getCell(14).value  = dt_Data[i].FCLOSINGBALANCE;  
                        row_item.getCell(14).numFmt  = _format_2;
                        worksheet.getCell(pos_title,14).alignment = { vertical: 'middle', horizontal: 'right' };
                        row_item.getCell(15).value  = l_exrate;  
                        row_item.getCell(15).numFmt  = _formatAmt;
                        worksheet.getCell(pos_title,15).alignment = { vertical: 'middle', horizontal: 'right' };
                        row_item.getCell(16).value  = dt_Data[i].TAC_HGTRH_PK; 
                        row_item.getCell(17).value  = dt_Data[i].PL_CD;  
                        row_item.getCell(18).value  = dt_Data[i].PL_NM; 
                        row_item.getCell(19).value  = ""; 
                        row_item.getCell(20).value  = dt_Data[i].ACNM_DR; 
                        worksheet.getCell(pos_title,20).alignment = { vertical: 'middle', horizontal: 'center', shrinkToFit: true  }; 
                        row_item.getCell(21).value  = dt_Data[i].ACNM_CR; 
                        worksheet.getCell(pos_title,21).alignment = { vertical: 'middle', horizontal: 'center', shrinkToFit: true  };
                        for(let j = 1; j<=21; j++)
                        {
                            row_item.getCell(j).border = {
                                                            top: {style:'thin', color: {argb:'A6A6A6'}},
                                                            left: {style:'thin', color: {argb:'A6A6A6'}},
                                                            bottom: {style:'thin', color: {argb:'A6A6A6'}},
                                                            right: {style:'thin', color: {argb:'A6A6A6'}}
                                                        }; 
                            row_item.getCell(j).font      = {color: {argb:'000000'}, size:10, name: 'Times New Roman'};
                        }
                        if(dt_Data[i].ORD === 'O' || dt_Data[i].ORD === 'T'|| dt_Data[i].ORD === 'E')
                        {
                            row_item.getCell(5).font  = { italic: false, bold: true, size:10, color: {argb:'000000'}, name: 'Times New Roman' };
                            worksheet.getCell(pos_title,5).alignment = { vertical: 'middle', horizontal: 'center' };
                            row_item.getCell(9).font  = { italic: false, bold: true, size:10,color: {argb:'000000'} , name: 'Times New Roman'};
                            row_item.getCell(10).font = { italic: false, bold: true, size:10,color: {argb:'000000'} , name: 'Times New Roman'};
                            row_item.getCell(11).font = { italic: false, bold: true, size:10,color: {argb:'000000'}, name: 'Times New Roman' };
                            row_item.getCell(12).font = { italic: false, bold: true, size:10,color: {argb:'000000'}, name: 'Times New Roman' };
                            row_item.getCell(13).font = { italic: false, bold: true, size:10,color: {argb:'000000'}, name: 'Times New Roman' };
                            row_item.getCell(14).font = { italic: false, bold: true, size:10,color: {argb:'000000'}, name: 'Times New Roman' };
                        }
                        if(dt_Data[i].ORD === 'E'){
                            pos_title = pos_title + 2;
                            row_title = worksheet.getRow(pos_title);
                            row_title.getCell(1).value = dt_Title[0].DATE_I20; //
                            row_title.getCell(1).font  = { italic: false, bold: false, color: {argb:'000000'}, size:10, name: 'Times New Roman'};
                            pos_title = pos_title + 2;
                            row_title = worksheet.getRow(pos_title);
                            row_title.getCell(1).value = dt_Title[0].EV_A21; // Prepared by
                            row_title.getCell(1).font  = { italic: false, bold: true, color: {argb:'000000'}, size:10, name: 'Times New Roman'};
                            worksheet.mergeCells(pos_title,1, pos_title,2);// 
                            row_title.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
                            row_title.getCell(6).value = dt_Title[0].EV_E21; // Chief Account
                            row_title.getCell(6).font  = { italic: false, bold: true, color: {argb:'000000'}, size:10, name: 'Times New Roman'};
                            row_title.getCell(6).alignment = { vertical: 'middle', horizontal: 'center' };
                            worksheet.mergeCells(pos_title,6, pos_title,8);// 
                            row_title.getCell(12).value = dt_Title[0].EV_I21; // General Director
                            row_title.getCell(12).font  = { italic: false, bold: true, color: {argb:'000000'}, size:10, name: 'Times New Roman'};
                            worksheet.mergeCells(pos_title,12, pos_title,14);// 
                            row_title.getCell(12).alignment = { vertical: 'middle', horizontal: 'center' };
                            // sign,fullname  
                            pos_title =    pos_title + 1;
                            row_title = worksheet.getRow(pos_title);
                            row_title.getCell(1).value = dt_Title[0].EV_SIG_A21; // Prepared by
                            row_title.getCell(1).font  = { italic: true, bold: false, color: {argb:'000000'}, size:10, name: 'Times New Roman'};
                            worksheet.mergeCells(pos_title,1, pos_title,2);// 
                            row_title.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
                            row_title.getCell(6).value = dt_Title[0].EV_SIG_E21; // Chief Account
                            row_title.getCell(6).font  = { italic: true, bold: false, color: {argb:'000000'}, size:10, name: 'Times New Roman'};
                            row_title.getCell(6).alignment = { vertical: 'middle', horizontal: 'center' };
                            worksheet.mergeCells(pos_title,6, pos_title,8);// 
                            row_title.getCell(12).value = dt_Title[0].EV_SIG_I21; // General Director
                            row_title.getCell(12).font  = { italic: true, bold: false, color: {argb:'000000'}, size:10, name: 'Times New Roman'};
                            worksheet.mergeCells(pos_title,12, pos_title,14);// 
                            row_title.getCell(12).alignment = { vertical: 'middle', horizontal: 'center' };
                        }
                    }
                }
                /********* Print file excel ********/
                const reportFile    = Helpers.tmpPath(file_new);
                await workbook.xlsx.writeFile(reportFile)
                return response.attachment( reportFile, file_new);
         } 
        catch (e) 
        {
            Utils.Logger({ LVL: "error", MODULE: "Report", FUNC: "rpt_6045035_General_Ledger_DT", CONTENT: e.message })
           // return response.send(Utils.response(false, e.message, null))
           return response.send(null);
        }
    }
    /*###################################### EACBK002 S38-DN2.2 Report  General ledger detail books ENG VIE 2 no8 ###########################################################################*/ 
    async rpt_6045035_General_Ledger_DT_2({ request, response, auth }) {
        try 
        { 
           /* P_RPT_ID: report_info.VAL1, P_RPT_URL: report_info.VAL2, P_RPT_FILE: report_info.VAL3,
                P_COMP_ID: company_info.PARTNER_ID, P_COMP_NM: company_info.TEXT, P_COMP_TAX: company_info.TAX_CODE, P_COMP_ADD: company_info.ADDR1,
                P_COMPANY: this.selectedCompany,P_ACC_PK: this.TAC_ABACCTCODE_PK, P_FR_DATE: this.from_date, P_FR_TO: this.to_date, 
                P_CCY: this.selectedCurrency, P_STATUS: this.selectedStatus, P_BOOK_CCY: this.txtBookCCY, P_CIRCULARS: this.selectedCircular, P_PRINT_VOUCHER_NO : this.selectedPrintVoucherNo, 
                P_OPTION: this.selectedOptionListGLDT, P_POST_SUM : this.selectedPostSum, P_AMT_TYPE: this.selectedAmtType, P_LANG : this.selectedLanguage, P_DATE_NOW: this.datetime
              */
            /****************************** Get Param *********************************/
            let { para }        = request.get(['para']);
            /********* Parse pram to json ********/
            var item            = JSON.parse(para); 
            const user          = await auth.getUser() ;
            var COMP_ID         = item.P_COMP_ID, COMP_NM = item.P_COMP_NM, COMP_TAX = item.P_COMP_TAX, COMP_ADD = item.P_COMP_ADD;
            var BIZ_ID          = item.P_BIZ_ID , BIZ_NM  = item.P_BIZ_NM , BIZ_TAX  = item.P_BIZ_TAX , BIZ_ADD  = item.P_BIZ_ADD;
            const p_crt_by      = user.USER_ID;
            const p_language    = request.header("accept-language", "ENG");
            var file_nm         = [item.P_RPT_FILE];
            var file_type       = ".xlsx";
            var full_nm         = file_nm + file_type;
            var file_new        = file_nm + p_crt_by + file_type;
            var _resourcesPath  = [item.P_RPT_URL]+'/'+full_nm;
            var _store          = "AC_RPT_6045035_ALL_ACC_DT_02";
            var _store_title    = "AC_RPT_6045035_TITLE_DT_2";
            var _param          = [item.P_COMPANY, item.P_TCO_BUSPLACE_PK, item.P_FR_DATE, item.P_FR_TO, item.P_OPTIONACC, item.P_OPTION_CRDR, item.P_ACC_PK, item.P_PARTNER_PK, item.P_STATUS, item.P_COMBINE_YN, item.P_LANG];
            /***************************** Return failded ****************************/
            if (!user) 
            {
                return response.send(Utils.response(false, "Request failed!", null));
            } 
            /****************************** Begin call store and write excell *********/
            else 
                /********* Call store infomation tltle ***************/ 
                var _param_title    = [item.P_COMPANY, item.P_FR_DATE, item.P_FR_TO, item.P_BOOK_CCY, item.P_TCO_BUSPLACE_PK, item.P_LANG];
                var dt_Title  = await DBService.callProcCursor(_store_title, _param_title , p_language , p_crt_by); 
                /********* Read file excel ********/ 
                const templateFile  = Helpers.resourcesPath(_resourcesPath); 
                await workbook.xlsx.readFile(templateFile);
                var worksheet       = workbook.getWorksheet(1);
                /********* Write file excel ********/
                    /********* Call partner store  ***************/ 
                var dt_Data  = await DBService.callProcCursor(_store, _param , p_language , p_crt_by); 
                var pos_title = 0;
                var _lang = item.P_LANG;
                var acc_info = "";
                var ac_code = "";
                var ac_name = "";
                if (dt_Data.length>0) 
                {
                    for (var i = 0; i < dt_Data.length; i++) 
                    {
                        dt_Data = dt_Data;
                        if( dt_Data[i].ACC_INFO != acc_info || i == 0)
                        {
                            acc_info = dt_Data[i].ACC_INFO;
                            ac_code = dt_Data[i].AC_CD;
                            if(i>0){
                                worksheet   = workbook.addWorksheet(); 
                            }
                            worksheet.name = ac_code; 
                        
                            // Width
                            worksheet.getColumn(1).width = 10; // date
                            worksheet.getColumn(2).width = 13; // voucher no
                            worksheet.getColumn(3).width = 13; // voucher date
                            worksheet.getColumn(4).width = 40; // local desrciption
                            worksheet.getColumn(5).width = 40; // Desrciption
                            worksheet.getColumn(6).width = 9.0; // Debit account Code
                            worksheet.getColumn(7).width = 9.0; // Credit Account Code
                            worksheet.getColumn(8).width = 7.57; // Exchange Rate 
                            worksheet.getColumn(9).width = 16.57; // Amount Debit 
                            worksheet.getColumn(10).width = 16.57; // Amount Credit
                            worksheet.getColumn(11).width = 16.57; // Balance
                            worksheet.getColumn(12).width = 16.57; // Amount Debit Trans
                            worksheet.getColumn(13).width = 16.57; // Amount Credit Trans
                            worksheet.getColumn(14).width = 16.57;  //Balance Trans
                            worksheet.getColumn(15).width = 10.14; // Tỷ giá
                            worksheet.getColumn(16).width = 8.43; // Remart
                            worksheet.getColumn(17).width = 12.43; // Partner Code
                            worksheet.getColumn(18).width = 23.86; // Partner Name
                            worksheet.getColumn(19).width = 12.43; // Partner Code Offset
                            worksheet.getColumn(20).width = 23.86; // Partner Name Offset
                            worksheet.getColumn(21).width = 12.43; // PL Code 
                            worksheet.getColumn(22).width = 23.86; // PL Name 
                            worksheet.getColumn(23).width = 0; // Unclose
                            worksheet.getColumn(24).width = 17; // Debit account Name
                            worksheet.getColumn(25).width = 17; // Credit account Name
                            worksheet.getColumn(26).width = 12; // Serial No
                            worksheet.getColumn(27).width = 12; // Inv Date
                            worksheet.getColumn(28).width = 19; // Inv No
                            worksheet.getColumn(29).width = 12;//C.Inv No
							pos_title = 0;
                            //INFOMATION COMPANY
                            pos_title = pos_title + 1;
                            //sign
                            var row_title = worksheet.getRow(pos_title);
                            // Info
                            row_title.getCell(1).value = dt_Title[0].BIZ_NM_A1; // biz name
                            row_title.getCell(16).value = dt_Title[0].MS_H1; // Mẫu số 31a 
                            worksheet.mergeCells(pos_title,16, pos_title,18);// merge MS
                            row_title.getCell(16).font  = { italic: false, bold: true, color: {argb:'000000'}, name: 'Times New Roman'};
                            row_title.getCell(16).alignment = { vertical: 'middle', horizontal: 'center' };
                            pos_title = pos_title + 1;
                            row_title = worksheet.getRow(pos_title);
                            row_title.getCell(1).value = dt_Title[0].BIZ_TAX_A2; // biz tax code
                            row_title.getCell(16).value = dt_Title[0].EV_H2; // Thong tu
                            worksheet.mergeCells(pos_title,16, pos_title,18);// Thong tu
                            pos_title = pos_title + 1;
                            row_title = worksheet.getRow(pos_title);
                            row_title.getCell(1).value = dt_Title[0].BIZ_ADD_A3; // Address
                            row_title.getCell(16).value = dt_Title[0].EV_H3; // Thong tu
                            worksheet.mergeCells(pos_title,16, pos_title,18);// Thong tu
                            pos_title = pos_title + 1;
                            row_title = worksheet.getRow(pos_title);
                            row_title.height = 30; 
                            row_title.getCell(1).value = dt_Title[0].TITLE_A4; // Title
                            row_title.getCell(1).font  = { italic: false, bold: true, color: {argb:'000000'}, size:18, name: 'Times New Roman'};
                            row_title.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
                            worksheet.mergeCells(pos_title,1, pos_title,25);// Title
                            pos_title = pos_title + 1;
                            row_title = worksheet.getRow(pos_title);
                            row_title.getCell(1).value = dt_Title[0].DATE_TOFRM_A5; // from date - todate
                            row_title.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
                            row_title.getCell(1).font  = { italic: false, bold: false, color: {argb:'000000'}, size:10,name: 'Times New Roman'};
                            worksheet.mergeCells(pos_title,1, pos_title,25);// from date - todate
                            pos_title = pos_title + 1;
                            row_title = worksheet.getRow(pos_title);
                            row_title.getCell(1).value =_lang == 'VIE' ? 'Tài khoản :' + acc_info : 'Account code :' + acc_info; // account
                            row_title.getCell(1).font  = { italic: false, bold: true, color: {argb:'000000'}, size:10,name: 'Times New Roman'};
                            pos_title = pos_title + 1;
                            row_title = worksheet.getRow(pos_title);
                            row_title.getCell(12).value = dt_Title[0].DVT_L11; // unit
                            row_title.getCell(12).font  = { italic: false, bold: true, color: {argb:'000000'}, size:10, name: 'Times New Roman'};
                            row_title.getCell(12).alignment = { vertical: 'middle', horizontal: 'right' };

                            //bảng
                            pos_title = pos_title + 2;//9
                            row_title = worksheet.getRow(pos_title);
                            pos_title = pos_title + 1;//10
                            var row_title_10 = worksheet.getRow(pos_title);

                            row_title.getCell(1).value      = dt_Title[0].A9_10; // date - ngày tháng năm row 9-10
                            row_title.getCell(2).value      = dt_Title[0].BC9_9; // voucher
                            row_title_10.getCell(2).value   = dt_Title[0].B10; // voucher no
                            row_title_10.getCell(3).value   = dt_Title[0].C10; // voucher date
                            row_title.getCell(4).value      = dt_Title[0].D9_10; //Local Description 
                            row_title.getCell(5).value      = dt_Title[0].E9_10; // Description
                            row_title.getCell(6).value      = dt_Title[0].F9_10; // Debit account Code
                            row_title.getCell(7).value      = dt_Title[0].G9_10; //Credit account Code

                            row_title.getCell(8).value      = dt_Title[0].H9_10;//Exchange Rate

                            row_title.getCell(9).value      = dt_Title[0].IJ9; // Amount   
                            row_title_10.getCell(9).value   = dt_Title[0].I10; // Debit 
                            row_title_10.getCell(10).value  = dt_Title[0].J10; // Credit 
                            row_title.getCell(11).value     = dt_Title[0].K9_10; // Balance 
                            row_title.getCell(12).value     = dt_Title[0].LM9; // Amount 
                            row_title_10.getCell(12).value  = dt_Title[0].L10; // Amount Debit Trans
                            row_title_10.getCell(13).value  = dt_Title[0].M10; // Amount Credit Trans
                            row_title.getCell(14).value     = dt_Title[0].N9_10; // Balance Trans
                            row_title.getCell(15).value     = dt_Title[0].O9_10; // Tỷ giá
                            row_title.getCell(16).value     = dt_Title[0].P9; // Remart
                            row_title_10.getCell(16).value  = dt_Title[0].P10; // Remart
                            
                            row_title.getCell(17).value     = dt_Title[0].QR9; //Partner  
                            row_title_10.getCell(17).value  = dt_Title[0].Q10; //Partner Code 
                            row_title_10.getCell(18).value  = dt_Title[0].R10; //Partner Name 
                            
                            row_title.getCell(19).value     = dt_Title[0].ST9; //Partner  Offset
                            row_title_10.getCell(19).value  = dt_Title[0].S10; //Partner Code Offset
                            row_title_10.getCell(20).value  = dt_Title[0].T10; //Partner Name Offset

                            
                            row_title.getCell(21).value     = dt_Title[0].UV9; // PL
                            row_title_10.getCell(21).value  = dt_Title[0].U10; // PL Code
                            row_title_10.getCell(22).value  = dt_Title[0].V10; // PL Name

                            row_title.getCell(23).value     = dt_Title[0].W9_10; //Unclose 
                            row_title.getCell(24).value     = dt_Title[0].X9_10; //Debit account Name 
                            row_title.getCell(25).value     = dt_Title[0].Y9_10; //Credit account Name  
                            row_title.getCell(26).value     = dt_Title[0].Z9_10; //Serial No  
                            row_title.getCell(27).value     = dt_Title[0].AA9_10; //Inv Date  
                            row_title.getCell(28).value     = dt_Title[0].AB9_10; //Inv No
                            row_title.getCell(29).value     = dt_Title[0].AC9_10; //C.Inv No 


                            //-------------------Merger-------------------------
                            worksheet.mergeCells(pos_title-1,1,pos_title,1); //date - ngày tháng năm  9-10
                            worksheet.mergeCells(pos_title-1,2,pos_title-1,3); //voucher  9-9
                            worksheet.mergeCells(pos_title-1,4,pos_title,4); //Local Description  9-10
                            worksheet.mergeCells(pos_title-1,5,pos_title,5); //Description  9-10
                            worksheet.mergeCells(pos_title-1,6,pos_title,6); //Debit account Code 9-10
                            worksheet.mergeCells(pos_title-1,7,pos_title,7); //Credit account Code  9-10
                            worksheet.mergeCells(pos_title-1,8,pos_title,8); //Exchange Rate 9-10

                            worksheet.mergeCells(pos_title-1,9,pos_title-1,10); //Amount  9-9
                            worksheet.mergeCells(pos_title-1,11,pos_title,11); //Balance  9-10
                            worksheet.mergeCells(pos_title-1,12,pos_title-1,13); //Amount  9-9
                            worksheet.mergeCells(pos_title-1,14,pos_title,14); //Balance 9-10
                            worksheet.mergeCells(pos_title-1,15,pos_title,15); //Tỷ giá 9-10

                            worksheet.mergeCells(pos_title-1,17,pos_title-1,18); //Partner   9-9
                            worksheet.mergeCells(pos_title-1,19,pos_title-1,20); //Partner  Offset  9-9
                            worksheet.mergeCells(pos_title-1,21,pos_title-1,22); //PL  9-9
                            

                            
                            worksheet.mergeCells(pos_title-1,23,pos_title,23); //Unclose  9-10
                            worksheet.mergeCells(pos_title-1,24,pos_title,24); //Debit account Name  9-10
                            worksheet.mergeCells(pos_title-1,25,pos_title,25); //Credit account Name   9-10
                            worksheet.mergeCells(pos_title-1,26,pos_title,26); //Serial No  9-10
                            worksheet.mergeCells(pos_title-1,27,pos_title,27); //Inv Date   9-10
                            worksheet.mergeCells(pos_title-1,28,pos_title,28); //Inv No  9-10
                            worksheet.mergeCells(pos_title-1,29,pos_title,29); //C.Inv No  9-10
    
                            for(let j = 1; j<=29; j++)
                            {
                                row_title.getCell(j).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "D9D9D9" } };
                                row_title.getCell(j).alignment = { vertical: 'middle', horizontal: 'center'};
                                row_title.getCell(j).font      = { italic: false, bold: true, color: {argb:'000000'}, size:10, name: 'Times New Roman'};
                                row_title.getCell(j).border = {
                                                                top: {style:'thin', color: {argb:'A6A6A6'}},
                                                                left: {style:'thin', color: {argb:'A6A6A6'}},
                                                                bottom: {style:'thin', color: {argb:'A6A6A6'}},
                                                                right: {style:'thin', color: {argb:'A6A6A6'}}
                                                            }; 
                                                            
                                row_title_10.getCell(j).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "D9D9D9" } };
                                row_title_10.getCell(j).font = { italic: false, bold: true, color: {argb:'000000'}, size:10, name: 'Times New Roman'};
                                row_title_10.getCell(j).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true  };
                                row_title_10.getCell(j).border = {
                                                                top: {style:'thin', color: {argb:'A6A6A6'}},
                                                                left: {style:'thin', color: {argb:'A6A6A6'}},
                                                                bottom: {style:'thin', color: {argb:'A6A6A6'}},
                                                                right: {style:'thin', color: {argb:'A6A6A6'}}
                                                            };                       
                            }
                            
                        }
                       
                        //-------Fill Data----------------  
                        pos_title = pos_title + 1 ; 
                        var _bookccy = item.P_BOOK_CCY;  
                        var row_item = worksheet.getRow(pos_title);
                        var l_exrate = 0; 
                        var _formatAmt = (_bookccy=='VND'?'_(* #,##0_);_(* (#,##0);_(* "-"_);_(@_)':'_(* #,##0.00_);_(* (#,##0.00);_(* "-"_);_(@_)');
                        var _format_2 = '_(* #,##0.00_);_(* (#,##0.00);_(* "-"_);_(@_)';

                        if(dt_Data[i].TOTAL_DEBIT != "" && dt_Data[i].TOTAL_FDEBIT != "" && dt_Data[i].TOTAL_FDEBIT != 0 )
                        {
                            l_exrate = dt_Data[i].TR_RATE;
                        }
                        else
                        {
                            l_exrate = Number(dt_Data[i].CLOSINGBALANCE) /  Number(dt_Data[i].FCLOSINGBALANCE);//dt_Data[y].TR_RATE;
                        }

                        row_item.getCell(1).value   = dt_Data[i].TR_DATE;
                        row_item.getCell(2).value   = dt_Data[i].VOUCHERNO;     
                        row_item.getCell(3).value   = dt_Data[i].VOUCHER_DT;
                        row_item.getCell(4).value   = dt_Data[i].REMARK; 
                        row_item.getCell(5).value   = dt_Data[i].REMARK2; 
                        row_item.getCell(6).value   = dt_Data[i].ACC_DR; 
                        row_item.getCell(7).value   = dt_Data[i].ACC_CR;
                        row_item.getCell(8).value   = dt_Data[i].TR_RATE; 
                        row_item.getCell(8).numFmt  = '_(* #,##0_);_(* (#,##0);_(* "-"_);_(@_)';
                        worksheet.getCell(pos_title,8).alignment = { vertical: 'middle', horizontal: 'right' };
                        row_item.getCell(9).value   = dt_Data[i].PS_DEBIT; 
                        row_item.getCell(9).numFmt  = _formatAmt;
                        worksheet.getCell(pos_title,9).alignment = { vertical: 'middle', horizontal: 'right' };
                        row_item.getCell(10).value  = dt_Data[i].PS_CREDIT;  
                        row_item.getCell(10).numFmt  = _formatAmt;
                        worksheet.getCell(pos_title,10).alignment = { vertical: 'middle', horizontal: 'right' };
                        row_item.getCell(11).value  = dt_Data[i].CLOSINGBALANCE;
                        row_item.getCell(11).numFmt  = _formatAmt;
                        worksheet.getCell(pos_title,11).alignment = { vertical: 'middle', horizontal: 'right' };
                        row_item.getCell(12).value  = dt_Data[i].PS_FDEBIT;
                        row_item.getCell(12).numFmt  = _format_2;
                        worksheet.getCell(pos_title,12).alignment = { vertical: 'middle', horizontal: 'right' };
                        row_item.getCell(13).value  = dt_Data[i].PS_FCREDIT;  
                        row_item.getCell(13).numFmt  = _format_2;
                        worksheet.getCell(pos_title,13).alignment = { vertical: 'middle', horizontal: 'right' };
                        row_item.getCell(14).value  = dt_Data[i].FCLOSINGBALANCE;  
                        row_item.getCell(14).numFmt  = _format_2;
                        worksheet.getCell(pos_title,14).alignment = { vertical: 'middle', horizontal: 'right' };
                        row_item.getCell(15).value  = l_exrate;  
                        row_item.getCell(15).numFmt  = _formatAmt;
                        worksheet.getCell(pos_title,15).alignment = { vertical: 'middle', horizontal: 'right' };
                        row_item.getCell(16).value  = dt_Data[i].TAC_HGTRH_PK; 

                        row_item.getCell(17).value  = dt_Data[i].PARTNER_ID;  
                        row_item.getCell(18).value  = dt_Data[i].PARTNER_NAME; 
                        row_item.getCell(19).value  = dt_Data[i].PARTNER_ID_OFFSET;  
                        row_item.getCell(20).value  = dt_Data[i].PARTNER_NAME_OFFSET; 
                        row_item.getCell(21).value  = dt_Data[i].PL_CD;  
                        row_item.getCell(22).value  = dt_Data[i].PL_NM; 

                        row_item.getCell(23).value  = ""; 
                        row_item.getCell(24).value  = dt_Data[i].ACNM_DR; 
                        worksheet.getCell(pos_title,24).alignment = { vertical: 'middle', horizontal: 'center', shrinkToFit: true  }; 
                        row_item.getCell(25).value  = dt_Data[i].ACNM_CR; 
                        worksheet.getCell(pos_title,25).alignment = { vertical: 'middle', horizontal: 'center', shrinkToFit: true  };
                        
                        row_item.getCell(26).value  = dt_Data[i].SERIAL_NO; 
                        row_item.getCell(27).value  = dt_Data[i].INVOICE_DT;  
                        row_item.getCell(28).value  = dt_Data[i].INVOICE_NO;  
                        row_item.getCell(29).value  = dt_Data[i].C_INVOICE_NO; 
                        for(let j = 1; j<=29; j++)
                        {
                            row_item.getCell(j).border = {
                                                            top: {style:'thin', color: {argb:'A6A6A6'}},
                                                            left: {style:'thin', color: {argb:'A6A6A6'}},
                                                            bottom: {style:'thin', color: {argb:'A6A6A6'}},
                                                            right: {style:'thin', color: {argb:'A6A6A6'}}
                                                        }; 
                            row_item.getCell(j).font      = {color: {argb:'000000'}, size:10, name: 'Times New Roman'};
                        }
                        if(dt_Data[i].ORD === 'O' || dt_Data[i].ORD === 'T'|| dt_Data[i].ORD === 'E')
                        {
                            row_item.getCell(5).font  = { italic: false, bold: true, size:10, color: {argb:'000000'}, name: 'Times New Roman' };
                            worksheet.getCell(pos_title,5).alignment = { vertical: 'middle', horizontal: 'center' };
                            row_item.getCell(9).font  = { italic: false, bold: true, size:10,color: {argb:'000000'} , name: 'Times New Roman'};
                            row_item.getCell(10).font = { italic: false, bold: true, size:10,color: {argb:'000000'} , name: 'Times New Roman'};
                            row_item.getCell(11).font = { italic: false, bold: true, size:10,color: {argb:'000000'}, name: 'Times New Roman' };
                            row_item.getCell(12).font = { italic: false, bold: true, size:10,color: {argb:'000000'}, name: 'Times New Roman' };
                            row_item.getCell(13).font = { italic: false, bold: true, size:10,color: {argb:'000000'}, name: 'Times New Roman' };
                            row_item.getCell(14).font = { italic: false, bold: true, size:10,color: {argb:'000000'}, name: 'Times New Roman' };
                        }
                        if(dt_Data[i].ORD === 'E'){
                            pos_title = pos_title + 2;
                            row_title = worksheet.getRow(pos_title);
                            row_title.getCell(1).value = dt_Title[0].DATE_I20; //
                            row_title.getCell(1).font  = { italic: false, bold: false, color: {argb:'000000'}, size:10, name: 'Times New Roman'};
                            pos_title = pos_title + 2;
                            row_title = worksheet.getRow(pos_title);
                            row_title.getCell(1).value = dt_Title[0].EV_A21; // Prepared by
                            row_title.getCell(1).font  = { italic: false, bold: true, color: {argb:'000000'}, size:10, name: 'Times New Roman'};
                            worksheet.mergeCells(pos_title,1, pos_title,2);// 
                            row_title.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
                            row_title.getCell(6).value = dt_Title[0].EV_E21; // Chief Account
                            row_title.getCell(6).font  = { italic: false, bold: true, color: {argb:'000000'}, size:10, name: 'Times New Roman'};
                            row_title.getCell(6).alignment = { vertical: 'middle', horizontal: 'center' };
                            worksheet.mergeCells(pos_title,6, pos_title,8);// 
                            row_title.getCell(12).value = dt_Title[0].EV_I21; // General Director
                            row_title.getCell(12).font  = { italic: false, bold: true, color: {argb:'000000'}, size:10, name: 'Times New Roman'};
                            worksheet.mergeCells(pos_title,12, pos_title,14);// 
                            row_title.getCell(12).alignment = { vertical: 'middle', horizontal: 'center' };
                            // sign,fullname  
                            pos_title =    pos_title + 1;
                            row_title = worksheet.getRow(pos_title);
                            row_title.getCell(1).value = dt_Title[0].EV_SIG_A21; // Prepared by
                            row_title.getCell(1).font  = { italic: true, bold: false, color: {argb:'000000'}, size:10, name: 'Times New Roman'};
                            worksheet.mergeCells(pos_title,1, pos_title,2);// 
                            row_title.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
                            row_title.getCell(6).value = dt_Title[0].EV_SIG_E21; // Chief Account
                            row_title.getCell(6).font  = { italic: true, bold: false, color: {argb:'000000'}, size:10, name: 'Times New Roman'};
                            row_title.getCell(6).alignment = { vertical: 'middle', horizontal: 'center' };
                            worksheet.mergeCells(pos_title,6, pos_title,8);// 
                            row_title.getCell(12).value = dt_Title[0].EV_SIG_I21; // General Director
                            row_title.getCell(12).font  = { italic: true, bold: false, color: {argb:'000000'}, size:10, name: 'Times New Roman'};
                            worksheet.mergeCells(pos_title,12, pos_title,14);// 
                            row_title.getCell(12).alignment = { vertical: 'middle', horizontal: 'center' };
                        }
                    }
                }
                
                /********* Print file excel ********/
                const reportFile    = Helpers.tmpPath(file_new);
                await workbook.xlsx.writeFile(reportFile)
                return response.attachment( reportFile, file_new);
            
         } 
        catch (e) 
        {
            Utils.Logger({ LVL: "error", MODULE: "Report", FUNC: "rpt_6045035_General_Ledger_DT_2", CONTENT: e.message })
           // return response.send(Utils.response(false, e.message, null))
           return response.send(null);
        }
    }
    /*########################################################## Report Cash books(Receipt) no2 ###########################################################################*/ 
    async rpt_6045035_CASH_BOOKS_RECEIPT({ request, response, auth }) {
        try 
        { 
           /* P_RPT_ID: report_info.VAL1, P_RPT_URL: report_info.VAL2, P_RPT_FILE: report_info.VAL3,
                P_COMP_ID: company_info.PARTNER_ID, P_COMP_NM: company_info.TEXT, P_COMP_TAX: company_info.TAX_CODE, P_COMP_ADD: company_info.ADDR1,
                P_COMPANY: this.selectedCompany,P_ACC_PK: this.TAC_ABACCTCODE_PK, P_FR_DATE: this.from_date, P_FR_TO: this.to_date, 
                P_STATUS: this.selectedStatus, P_BOOK_CCY: this.txtBookCCY, P_CIRCULARS: this.selectedCircular, 
                P_PRINT_VOUCHER_NO : this.selectedPrintVoucherNo, P_LANG : this.selectedLanguage

                */
            /****************************** Get Param *********************************/
            let { para }        = request.get(['para']);
            /********* Parse pram to json ********/
            var item            = JSON.parse(para); 
            const user          = await auth.getUser() ;
            var COMP_ID         = item.P_COMP_ID, COMP_NM = item.P_COMP_NM, COMP_TAX = item.P_COMP_TAX, COMP_ADD = item.P_COMP_ADD;
            var BIZ_ID              = item.P_BIZ_ID , BIZ_NM  = item.P_BIZ_NM , BIZ_TAX  = item.P_BIZ_TAX , BIZ_ADD  = item.P_BIZ_ADD;
            const p_crt_by      = user.USER_ID;
            const p_language    = request.header("accept-language", "ENG");
            var file_nm         = [item.P_RPT_FILE];
            var file_type       = ".xlsx";
            var full_nm         = file_nm + file_type;
            var file_new        = file_nm + p_crt_by + file_type;
            var _resourcesPath  = [item.P_RPT_URL]+'/'+full_nm;
            var _store_acc      = "AC_RPT_6045035_ACCOUNT_1";
            var _store_confirm  = "AC_RPT_6045035_RECEIPT_CONFIRM";
            var _store_approve  = "AC_RPT_6045035_RECEIPT_APPROVE";
            var _circular       = "AC_SEL_GET_TT_BPL";
            var _param_acc      = [item.P_COMPANY, item.P_ACC_PK,item.P_TCO_BUSPLACE_PK];
            var _param_TT       = [item.P_CIRCULARS, item.P_TCO_BUSPLACE_PK];
            var v_no_title = "Mẫu số : S03a1-DN ", e_no_title = "Form No : S03a1-DN" , k_no_title = "양식번호 : S03a1-DN";
            var v_dvt = " Đơn vị tính", e_dvt = " Unit", k_dvt = " 단위";
            /***************************** Return failded ****************************/
            if (!user) 
            {
                return response.send(Utils.response(false, "Request failed!", null));
            } 
            /****************************** Begin call store and write excell *********/
            else 
            { 
                /********* Call store  ***************/ 
                var dt_ACC  = await DBService.callProcCursor(_store_acc, _param_acc , p_language , p_crt_by); 
                if (dt_ACC.length>0) 
                {
                    dt_ACC = dt_ACC;
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
                    //dt_TT = dt_TT;
                    return response.send(Utils.response(false, "no_data_found", null))
                } 
                /********* Read file excel ********/ 
                const templateFile  = Helpers.resourcesPath(_resourcesPath); 
                await workbook.xlsx.readFile(templateFile);
                var worksheet       = workbook.getWorksheet(1);
                /********* Write file excel ********/
                
                var _param    = [item.P_COMPANY, item.P_FR_DATE, item.P_FR_TO, item.P_ACC_PK, item.P_STATUS, item.P_TCO_BUSPLACE_PK]; //, item.P_TCO_BUSPLACE_PK
                
                if(item.P_PRINT_VOUCHER_NO == "2")
                {
                    var dt_Data  = await DBService.callProcCursor(_store_confirm, _param , p_language , p_crt_by); 
                }
                else{
                    var dt_Data  = await DBService.callProcCursor(_store_approve, _param , p_language , p_crt_by); 
                }
                
                //INFOMATION COMPANY
                worksheet.getCell("A1").value = BIZ_NM;
                worksheet.getCell("A2").value = BIZ_ADD;
                worksheet.getCell("A3").value = "Tax code : " + BIZ_TAX;
                var _bookccy = item.P_BOOK_CCY;
                worksheet.getCell("I7").value = _bookccy;
                var FromDate = item.P_FR_DATE;
                var ToDate = item.P_FR_TO;
                var strFrDate = FromDate.substr(6,2) + "/"+ FromDate.substr(4,2)+ "/"+ FromDate.substr(0,4);
                var strToDate = ToDate.substr(6,2) + "/"+ ToDate.substr(4,2)+ "/"+ ToDate.substr(0,4);
                // thông tư
                 var _lang = item.P_LANG;
                 if(_lang == 'VIE'){
                     worksheet.getCell("G1").value =  v_no_title ;
                     worksheet.getCell("G2").value =  dt_TT[0].V1 ;
                     worksheet.getCell("G3").value =  dt_TT[0].V2 ;
                     worksheet.getCell("A4").value = "NHẬT KÝ THU TIỀN";
                     worksheet.getCell("A5").value = "Từ ngày " + strFrDate + " đến ngày " + strToDate;
                     worksheet.getCell("A6").value = "Tài khoản: ";
                     worksheet.getCell("C6").value = "Tên TK: ";
                     worksheet.getCell("H7").value = v_dvt;
                     //grid
                     worksheet.mergeCells('A8', 'A9'); 
                     //worksheet.getCell("A9").value = "";
                     worksheet.mergeCells('B8', 'C8'); 
                     worksheet.getCell("B8").value = "Số chứng từ";
                     worksheet.getCell("B9").value = "Số";
                     worksheet.getCell("C9").value = "Ngày";
                     worksheet.getCell("D8").value = "Diễn giải";
                     worksheet.getCell("E8").value = "Description";
                     worksheet.mergeCells('F8', 'F9'); 
                     worksheet.getCell("F8").value = "Ghi nợ các TK";
                     worksheet.mergeCells('G8', 'G9'); 
                     worksheet.getCell("G8").value = "Ghi có các TK";
                     worksheet.mergeCells('H8', 'H9'); 
                     worksheet.getCell("H9").value = "Số tiền VND";
                     worksheet.getCell("I8").value = "Ghi chú";
                 }
                 else{
                    worksheet.getCell("G2").value =  dt_TT[0].E1 ;
                    worksheet.getCell("G3").value =  dt_TT[0].E2 ;
                    worksheet.getCell("A5").value = "From date " + strFrDate + " To date " + strToDate;
                    worksheet.getCell("A6").value = "Account: ";
                    worksheet.getCell("C6").value = "Acount name: ";
                    worksheet.name = "Receipt Cash Books";
                 }
                worksheet.getCell("B6").value = dt_ACC[0].AC_CD;
                worksheet.getCell("D6").value = dt_ACC[0].AC_NM;
                var _print = item.P_PRINT_VOUCHER_NO;
                if(_print == '2'){
                    if(_lang == 'VIE')
                    {
                        worksheet.getCell("A8").value ="Ngày tháng ghi sổ";
                    }
                    else{
                        worksheet.getCell("A8").value ="Date";
                    }
                }
                else{
                    worksheet.getCell("A8").value ="Approve No" ;
                }
                var pos = 11; 
                var total_amt = 0;
                if(dt_Data.length>1)
                {
                        worksheet.duplicateRow(pos,dt_Data.length-1,true);
                }  
                for (var y = 0; y < dt_Data.length; y++) 
                {
                    var row_item = worksheet.getRow(pos);
                    row_item.getCell(1).value   = dt_Data[y].TR_DATE;
                    row_item.getCell(2).value   = dt_Data[y].VOUCHERNO;   
                    row_item.getCell(3).value   = dt_Data[y].TR_DATE2;    
                    row_item.getCell(4).value   = dt_Data[y].REMARK2; 
                    row_item.getCell(5).value   = dt_Data[y].REMARK; 
                    row_item.getCell(6).value   = dt_Data[y].DR_CODE; 
                    row_item.getCell(7).value   = dt_Data[y].CR_CODE;
                    row_item.getCell(8).value   = dt_Data[y].BOOK_AMT; 
                    row_item.getCell(9).value   = dt_Data[y].PK;  
                    row_item.getCell(10).value  = dt_Data[y].TR_ENCLOSE;  

                    total_amt                 += Number(dt_Data[y].BOOK_AMT);
                    pos = pos + 1; 
                    //row_item.commit();
                }  
                worksheet.mergeCells(pos,1,pos,7);
                worksheet.getCell(pos, 8).value = total_amt;
                
                /************sign */
                worksheet.mergeCells(pos+4,1,pos+4,2); 
                worksheet.mergeCells(pos+5,1,pos+5,2);   
                worksheet.mergeCells(pos+4,6,pos+4,8); 
                worksheet.mergeCells(pos+5,6,pos+5,8); 
               if(_lang === "VIE")
                {
                    worksheet.getCell("A8").value ="Ngày tháng ghi sổ";
                    worksheet.getCell(pos, 1).value = "Tổng cộng số phát sinh "
                    worksheet.getCell(pos+2, 1).value = "Sổ có…. Trang , đánh số từ  trang 01 đến  trang……";
                }
                else{
                    worksheet.getCell(pos+2, 1).value = "Number of page:..., from... to...";
                }
                pos = pos + 4;
              
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
                        }
                       if(_lang == 'ENG' || _lang == 'ENG-KOR'|| _lang == 'ENG-VIE' )*/ 
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
            Utils.Logger({ LVL: "error", MODULE: "Report", FUNC: "rpt_6045035_CASH_BOOKS_RECEIPT", CONTENT: e.message })
           // return response.send(Utils.response(false, e.message, null))
           return response.send(null);
        }
    }  
      /*########################################################## Report  Cash book Payment no3###########################################################################*/ 
    async rpt_6045035_CASH_BOOKS_PAYMENT({ request, response, auth }) {
        try 
        { 
           /* P_RPT_ID: report_info.VAL1, P_RPT_URL: report_info.VAL2, P_RPT_FILE: report_info.VAL3,
                P_COMP_ID: company_info.PARTNER_ID, P_COMP_NM: company_info.TEXT, P_COMP_TAX: company_info.TAX_CODE, P_COMP_ADD: company_info.ADDR1,
                P_COMPANY: this.selectedCompany,P_ACC_PK: this.TAC_ABACCTCODE_PK, P_FR_DATE: this.from_date, P_FR_TO: this.to_date, 
                P_STATUS: this.selectedStatus, P_BOOK_CCY: this.txtBookCCY, P_CIRCULARS: this.selectedCircular, 
                P_PRINT_VOUCHER_NO : this.selectedPrintVoucherNo, P_LANG : this.selectedLanguage
            */
            /****************************** Get Param *********************************/
            let { para }        = request.get(['para']);
            /********* Parse pram to json ********/
            var item            = JSON.parse(para); 
            const user          = await auth.getUser() ;
            var COMP_ID         = item.P_COMP_ID, COMP_NM = item.P_COMP_NM, COMP_TAX = item.P_COMP_TAX, COMP_ADD = item.P_COMP_ADD;
            var BIZ_ID          = item.P_BIZ_ID , BIZ_NM  = item.P_BIZ_NM , BIZ_TAX  = item.P_BIZ_TAX , BIZ_ADD  = item.P_BIZ_ADD;
            const p_crt_by      = user.USER_ID;
            const p_language    = request.header("accept-language", "ENG");
            var file_nm         = [item.P_RPT_FILE];
            var file_type       = ".xlsx";
            var full_nm         = file_nm + file_type;
            var file_new        = file_nm + p_crt_by + file_type;
            var _resourcesPath  = [item.P_RPT_URL]+'/'+full_nm;
            var _store_acc      = "AC_RPT_6045035_ACCOUNT_1";
            var _store_confirm  = "AC_RPT_6045035_PAYMENT_CONFIRM";
            var _store_approve  = "AC_RPT_6045035_PAYMENT_APPROVE";
            var _circular       = "AC_SEL_GET_TT_BPL";
            var _param_acc      = [item.P_COMPANY, item.P_ACC_PK, item.P_TCO_BUSPLACE_PK];
            var _param_TT       = [item.P_CIRCULARS, item.P_TCO_BUSPLACE_PK];
            var v_no_title = "Mẫu số : S03a2-DN ", e_no_title = "Form No : S03a2-DN" , k_no_title = "양식번호 : S03a2-DN";
            var v_dvt = " Đơn vị tính", e_dvt = " Unit", k_dvt = " 단위";
            /***************************** Return failded ****************************/
            if (!user) 
            {
                return response.send(Utils.response(false, "Request failed!", null));
            } 
            /****************************** Begin call store and write excell *********/
            else 
            { 
                /********* Call store  ***************/ 
                var dt_ACC  = await DBService.callProcCursor(_store_acc, _param_acc , p_language , p_crt_by); 
                if (dt_ACC.length>0) 
                {
                    dt_ACC = dt_ACC;
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
                    //dt_TT = dt_TT;
                    return response.send(Utils.response(false, "no_data_found", null))
                } 
                /********* Read file excel ********/ 
                const templateFile  = Helpers.resourcesPath(_resourcesPath); 
                await workbook.xlsx.readFile(templateFile);
                var worksheet       = workbook.getWorksheet(1);
                /********* Write file excel ********/
                
                var _param    = [item.P_COMPANY, item.P_FR_DATE, item.P_FR_TO, item.P_ACC_PK, item.P_STATUS,item.P_TCO_BUSPLACE_PK];
                
                if(item.P_PRINT_VOUCHER_NO == "2")
                {
                    var dt_Data  = await DBService.callProcCursor(_store_confirm, _param , p_language , p_crt_by); 
                }
                else{
                    var dt_Data  = await DBService.callProcCursor(_store_approve, _param , p_language , p_crt_by); 
                }
                
                //INFOMATION COMPANY
                worksheet.getCell("A1").value = BIZ_NM;
                worksheet.getCell("A2").value = BIZ_ADD;
                worksheet.getCell("A3").value = "Tax code : " + BIZ_TAX;
                var _bookccy = item.P_BOOK_CCY;
                worksheet.getCell("I7").value = _bookccy;
                var FromDate = item.P_FR_DATE;
                var ToDate = item.P_FR_TO;
                var strFrDate = FromDate.substr(6,2) + "/"+ FromDate.substr(4,2)+ "/"+ FromDate.substr(0,4);
                var strToDate = ToDate.substr(6,2) + "/"+ ToDate.substr(4,2)+ "/"+ ToDate.substr(0,4);
                worksheet.mergeCells('B8', 'C8'); 
                worksheet.mergeCells('H8', 'H9'); 
               // thông tư
               var _lang = item.P_LANG;
               if(_lang == 'VIE'){
                   worksheet.getCell("G1").value =  v_no_title ;
                   worksheet.getCell("G2").value =  dt_TT[0].V1 ;
                   worksheet.getCell("G3").value =  dt_TT[0].V2 ;
                   worksheet.getCell("A4").value = "NHẬT KÝ CHI TIỀN";
                   worksheet.getCell("A5").value = "Từ ngày " + strFrDate + " đến ngày " + strToDate;
                   worksheet.getCell("A6").value = "Tài khoản: ";
                   worksheet.getCell("C6").value = "Tên TK: ";
                   worksheet.getCell("H7").value = v_dvt;
                   //grid
                   worksheet.mergeCells('A8', 'A9'); 
                   //worksheet.getCell("A9").value = "";
                   worksheet.getCell("B8").value = "Chứng từ";
                   worksheet.getCell("B9").value = "Số";
                   worksheet.getCell("C9").value = "Ngày";
                   worksheet.getCell("D8").value = "Diễn giải";
                   worksheet.getCell("E8").value = "Description";
                   worksheet.mergeCells('F8', 'F9'); 
                   worksheet.getCell("F8").value = "Ghi nợ các TK";
                   worksheet.mergeCells('G8', 'G9'); 
                   worksheet.getCell("G8").value = "Ghi có các TK";
                   worksheet.mergeCells('H8', 'H9'); 
                   worksheet.getCell("H9").value = "Số tiền VND";
                   worksheet.getCell("I8").value = "Ghi chú";
               }
               else{
                  worksheet.getCell("G2").value =  dt_TT[0].E1 ;
                  worksheet.getCell("G3").value =  dt_TT[0].E2 ;
                  worksheet.getCell("A5").value = "From date " + strFrDate + " To date " + strToDate;
                  worksheet.getCell("A6").value = "Account: ";
                  worksheet.getCell("C6").value = "Acount name: ";
                  worksheet.name = "Payment Cash Books";
               }
              worksheet.getCell("B6").value = dt_ACC[0].AC_CD;
              worksheet.getCell("D6").value = dt_ACC[0].AC_NM;
              var _print = item.P_PRINT_VOUCHER_NO;
              if(_print == '2'){
                  if(_lang == 'VIE')
                  {
                      worksheet.getCell("A8").value ="Ngày tháng ghi sổ";
                  }
                  else{
                      worksheet.getCell("A8").value ="Date";
                  }
                }
                else{
                    worksheet.getCell("A8").value ="Approve No" ;
                }
                var pos = 11; 
                var total_amt = 0;
                if(dt_Data.length>1)
                {
                        worksheet.duplicateRow(pos,dt_Data.length-1,true);
                }  
                for (var y = 0; y < dt_Data.length; y++) 
                {
                    var row_item = worksheet.getRow(pos);
                    row_item.getCell(1).value   = dt_Data[y].TR_DATE;
                    row_item.getCell(2).value   = dt_Data[y].VOUCHERNO;   
                    row_item.getCell(3).value   = dt_Data[y].TR_DATE2;    
                    row_item.getCell(4).value   = dt_Data[y].REMARK2; 
                    row_item.getCell(5).value   = dt_Data[y].REMARK; 
                    row_item.getCell(6).value   = dt_Data[y].DR_CODE; 
                    row_item.getCell(7).value   = dt_Data[y].CR_CODE;
                    if (_bookccy === 'VND')
                    {
                        row_item.getCell(8).value   = dt_Data[y].BOOK_AMT; 
                    }
                    else if(_bookccy === 'USD'){
                        row_item.getCell(8).value   = dt_Data[y].BOOK_AMT; 
                        row_item.getCell(8).numFmt  = '###,###,###,###.00';
                    }
                    row_item.getCell(9).value   = dt_Data[y].PK;  
                    row_item.getCell(10).value  = dt_Data[y].TR_ENCLOSE;  

                    total_amt                 += Number(dt_Data[y].BOOK_AMT);
                    pos = pos + 1; 
                    //row_item.commit();
                }  
                worksheet.mergeCells(pos,1,pos,7);
                if (_bookccy === 'VND')
                {
                    worksheet.getCell(pos, 8).value = total_amt;
                }
                else if(_bookccy === 'USD'){
                    worksheet.getCell(pos, 8).value = total_amt;
                    row.getCell(8).numFmt  = '###,###,###,###.00';
                }
                
                 /************sign */
                 worksheet.mergeCells(pos+4,1,pos+4,2); 
                 worksheet.mergeCells(pos+5,1,pos+5,2);  
                 worksheet.mergeCells(pos+3,6,pos+3,8);  
                 worksheet.mergeCells(pos+4,6,pos+4,8); 
                 worksheet.mergeCells(pos+5,6,pos+5,8); 
                 if(_lang === "VIE")
                 {
                     worksheet.getCell("A8").value ="Ngày tháng ghi sổ";
                     worksheet.getCell(pos, 1).value = "Tổng cộng số phát sinh "
                     worksheet.getCell(pos+2, 1).value = "Sổ có…. Trang , đánh số từ  trang 01 đến  trang……";
                     worksheet.getCell(pos+3, 7).value = "Ngày …. Tháng .... Năm.....";
                 }
                 else{
                     worksheet.getCell(pos+2, 1).value = "Number of page:..., from... to...";
                     worksheet.getCell(pos+3, 7).value = "Date …. Month .... Year.....";
                 }
                 pos = pos + 4;

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
                        }
                        if(_lang == 'ENG' || _lang == 'ENG-KOR'|| _lang == 'ENG-VIE' )*/ 
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
            Utils.Logger({ LVL: "error", MODULE: "Report", FUNC: "rpt_6045035_CASH_BOOKS_PAYMENT", CONTENT: e.message })
           // return response.send(Utils.response(false, e.message, null))
           return response.send(null);
        }
    } 
    /*########################################################## vẫn đang test 29032023 Report  General ledger no4###########################################################################*/ 
    async rpt_6045035_Genreral_Ledger_V2({ request, response, auth }) {
        try 
        { 
           /* P_RPT_ID: report_info.VAL1, P_RPT_URL: report_info.VAL2, P_RPT_FILE: report_info.VAL3,
                P_COMP_ID: company_info.PARTNER_ID, P_COMP_NM: company_info.TEXT, P_COMP_TAX: company_info.TAX_CODE, P_COMP_ADD: company_info.ADDR1,
                P_COMPANY: this.selectedCompany,P_ACC_PK: this.TAC_ABACCTCODE_PK, P_FR_DATE: this.from_date, P_FR_TO: this.to_date, 
                P_STATUS: this.selectedStatus, P_BOOK_CCY: this.txtBookCCY, P_CIRCULARS: this.selectedCircular, 
                P_PRINT_VOUCHER_NO : this.selectedPrintVoucherNo, P_LANG : this.selectedLanguage
             */
            /****************************** Get Param *********************************/
            let { para }        = request.get(['para']);
            /********* Parse pram to json ********/
            var item            = JSON.parse(para); 
            const user          = await auth.getUser() ;
            var COMP_ID         = item.P_COMP_ID, COMP_NM = item.P_COMP_NM, COMP_TAX = item.P_COMP_TAX, COMP_ADD = item.P_COMP_ADD;
            var BIZ_ID          = item.P_BIZ_ID , BIZ_NM  = item.P_BIZ_NM , BIZ_TAX  = item.P_BIZ_TAX , BIZ_ADD  = item.P_BIZ_ADD;
            const p_crt_by      = user.USER_ID;
            const p_language    = request.header("accept-language", "ENG");
            var file_nm         = [item.P_RPT_FILE];
            var file_type       = ".xlsx";
            var full_nm         = file_nm + file_type;
            var file_new        = file_nm + p_crt_by + file_type;
            var _resourcesPath  = [item.P_RPT_URL]+'/'+full_nm;
            var _store_acc      = "AC_RPT_6045035_ACCOUNT";
            var _store          = "AC_RPT_6045035_ACC_OPENING_1";
            // var _store_pk       = "AC_RPT_6045035_ACCOUNT_PK";
            var _store_confirm  = "AC_RPT_6045035_CFM_V2";
            var _store_approve  = "AC_RPT_6045035_GENERAL_APPROVE";
            var _circular       = "AC_SEL_GET_TT_BPL";
            var _param_acc      = [item.P_COMPANY, item.P_FR_DATE, item.P_FR_TO, item.P_ACC_PK, item.P_TCO_BUSPLACE_PK];
            var _param_pk       = [item.P_COMPANY, item.P_ACC_PK, item.P_TCO_BUSPLACE_PK]; 
            var _param_TT       = [item.P_CIRCULARS, item.P_TCO_BUSPLACE_PK];
            var v_no_title = "Mẫu số : S03b-DN ", e_no_title = "Form No : S03b-DN" , k_no_title = "양식번호 : S03b-DN";
            var v_dvt = " Đơn vị tính", e_dvt = " Unit", k_dvt = " 단위";
            /***************************** Return failded ****************************/
            if (!user) 
            {
                return response.send(Utils.response(false, "Request failed!", null));
            } 
            /****************************** Begin call store and write excell *********/
            else 
            { 
                /********* Call store  ***************/ 
                var   p_acc_code  = "";
                var   p_acc_name  = "";
                var   p_acc_type  = "";
                var   p_dt_from   = "";
                var   p_dt_to     = "";
                var   p_acc_num   = "";
                var dt_ACC  = await DBService.callProcCursor(_store_acc, _param_acc , p_language , p_crt_by); 
                if (dt_ACC.length>0) 
                {
                    dt_ACC      = dt_ACC;
                    p_acc_code  = dt_ACC[0].AC_CD;
                    p_acc_name  = dt_ACC[0].AC_NM;
                    p_acc_type  = dt_ACC[0].DRCR_TYPE;
                    p_dt_from   = dt_ACC[0].FRM_DATE;
                    p_dt_to     = dt_ACC[0].T_DATE;
                    p_acc_num   = dt_ACC[0].DRCR_TYPE1;
                } 
                else 
                {
                    return response.send(Utils.response(false, "no_data_found", null))
                } 

                var open_bal_dr_xls = 0; 
                var open_bal_cr_xls = 0;
                var close_bal_dr_xls = 0;
                var close_bal_cr_xls = 0; 
                var dr_opening_total = 0; 
                var cr_opening_total =0; 
                var open_bal = 0;
                var acc_pk_arr  = "";
                
                var _param = [item.P_COMPANY, item.P_FR_DATE, item.P_FR_TO, item.P_ACC_PK,item.P_STATUS, p_acc_num, item.P_TCO_BUSPLACE_PK];
                var dt_TK  = await DBService.callProcCursor(_store, _param , p_language , p_crt_by); 
                if (dt_TK.length>0) 
                {
                    dt_TK = dt_TK;
                    if(p_acc_type == "D")
                   {
                       
                        open_bal_dr_xls = dt_TK[0].OPENINGBALANCE;
                        close_bal_dr_xls = dt_TK[0].CLOSINGBALANCE;
                   }
                   else{  
                        open_bal_cr_xls = dt_TK[0].OPENINGBALANCE;
                        close_bal_cr_xls = dt_TK[0].CLOSINGBALANCE;
                   }
                   dr_opening_total = dt_TK[0].DEBITBOOKAMOUNT;
                   cr_opening_total = dt_TK[0].CREDITBOOKAMOUNT;
                   open_bal = dt_TK[0].OB;
                } 
                else 
                {
                   // dt_Data = dt_Data;
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
                //*****************Call Account PK*************** */
                /*var dt_ACC_PK  = await DBService.callProcCursor(_store_pk, _param_pk , p_language , p_crt_by); 
                var p_temp = "";
                for(var x = 0; x < dt_ACC_PK.length; x++)
                {
                    acc_pk_arr = acc_pk_arr + p_temp + dt_ACC_PK[x].PK;
                    p_temp = ",";
                }*/
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
                /********* Read file excel ********/ 
                const templateFile  = Helpers.resourcesPath(_resourcesPath); 
                await workbook.xlsx.readFile(templateFile);
                var worksheet       = workbook.getWorksheet(1);
                /********* Write file excel ********/
                
                var _param_1    = [item.P_COMPANY, item.P_FR_DATE, item.P_FR_TO, item.P_ACC_PK, item.P_STATUS, item.P_TCO_BUSPLACE_PK];
                
                if(item.P_PRINT_VOUCHER_NO == "2")
                {
                    var dt_Data  = await DBService.callProcCursor(_store_confirm, _param_1 , p_language , p_crt_by); 
                }
                else{
                    var dt_Data  = await DBService.callProcCursor(_store_approve, _param_1 , p_language , p_crt_by); 
                }
                //Merge
                worksheet.mergeCells(4,1,4,10);// Title
                worksheet.mergeCells(5,1,5,10); //from - to date
               /* worksheet.mergeCells(9,1,10,1); //date
                worksheet.mergeCells(9,2,9,3); //voucher 
                worksheet.mergeCells(9,7,9,8); //Amount */
                
                //INFOMATION COMPANY
                worksheet.getCell("A1").value = BIZ_NM;
                worksheet.getCell("A2").value = BIZ_ADD;
                worksheet.getCell("A3").value = "Tax code : " + BIZ_TAX;
                var _bookccy = item.P_BOOK_CCY;
                worksheet.getCell("H7").value = _bookccy;
                var FromDate = item.P_FR_DATE;
                var ToDate = item.P_FR_TO;
                var strFrDate = FromDate.substr(6,2) + "/"+ FromDate.substr(4,2)+ "/"+ FromDate.substr(0,4);
                var strToDate = ToDate.substr(6,2) + "/"+ ToDate.substr(4,2)+ "/"+ ToDate.substr(0,4);

                // thông tư
                var _lang = item.P_LANG;
                worksheet.mergeCells('A9', 'A10'); 
                worksheet.mergeCells('B9', 'C9'); 
                worksheet.mergeCells('F9', 'F10'); 
                worksheet.mergeCells('G9', 'H9'); 
                worksheet.mergeCells('I9', 'I10'); 
                if(_lang == 'VIE'){
                    worksheet.getCell("G1").value =  v_no_title ;
                    worksheet.getCell("G2").value =  dt_TT[0].V1 ;
                    worksheet.getCell("G3").value =  dt_TT[0].V2 ;
                    worksheet.getCell("A4").value = "SỔ CÁI";
                    worksheet.getCell("A5").value = "Từ ngày " + strFrDate + " đến ngày " + strToDate;
                    worksheet.getCell("A6").value = "Số hiệu tài khoản: ";
                    worksheet.getCell("G7").value = v_dvt;
                    //grid
                    //worksheet.getCell("A9").value = "";
                    worksheet.getCell("B9").value = "Số chứng từ";
                    worksheet.getCell("B10").value = "Số";
                    worksheet.getCell("C10").value = "Ngày";
                    worksheet.getCell("D9").value = "Diễn giải";
                    worksheet.getCell("E9").value = "Description";
                    worksheet.getCell("F9").value = "Số hiệu TK đối ứng";
                    worksheet.getCell("G9").value = "Số tiền";
                    worksheet.getCell("G10").value = "Nợ";
                    worksheet.getCell("H10").value = "Có";
                    worksheet.getCell("I9").value = "Ghi chú Seq";
                }
                else{
                   worksheet.getCell("G2").value =  dt_TT[0].E1 ;
                   worksheet.getCell("G3").value =  dt_TT[0].E2 ;
                   worksheet.getCell("A5").value = "From date " + strFrDate + " To date " + strToDate;
                   worksheet.name = "General Ledger";
                }
               worksheet.getCell("C6").value = dt_ACC[0].AC_CD;
               worksheet.getCell("D6").value = dt_ACC[0].AC_NM;
               var _print = item.P_PRINT_VOUCHER_NO;
               if(_print == '2'){
                   if(_lang == 'VIE')
                   {
                       worksheet.getCell("A9").value ="Ngày tháng ghi sổ";
                        worksheet.getCell("D12").value = "SỐ DƯ ĐẦU KỲ";
                        worksheet.getCell("D14").value = "Tổng cộng số phát sinh";
                        worksheet.getCell("D15").value = "SỐ DƯ CUỐI KỲ";
                   }
                   else{
                       worksheet.getCell("A9").value ="Date";
                   }
               }
               else{
                   worksheet.getCell("A9").value ="Approve No" ;
               }
                //-------Fill Data----------------
                worksheet.getCell("G12").value = open_bal_dr_xls;
                worksheet.getCell("H12").value = open_bal_cr_xls;
                worksheet.getCell("G14").value = dr_opening_total;
                worksheet.getCell("H14").value = cr_opening_total;
                worksheet.getCell("G15").value = close_bal_dr_xls;
                worksheet.getCell("H15").value = close_bal_cr_xls;
                
                var pos = 13; 
                if(dt_Data.length>1)
                {
                        worksheet.duplicateRow(pos,dt_Data.length-1,true);
                }  
                for (var y = 0; y < dt_Data.length; y++) 
                {
                    var row_item = worksheet.getRow(pos);
                    row_item.getCell(1).value   = dt_Data[y].TR_DATE_FMT;
                    row_item.getCell(2).value   = dt_Data[y].VOUCHERNO;     
                    row_item.getCell(3).value   = dt_Data[y].TR_DATE;
                    row_item.getCell(4).value   = dt_Data[y].REMARK2; 
                    row_item.getCell(5).value   = dt_Data[y].REMARK; 
                    row_item.getCell(6).value   = dt_Data[y].ACC_CODE; 
                    row_item.getCell(7).value   = dt_Data[y].DEBIT_AMT;
                    row_item.getCell(8).value   = dt_Data[y].CREDIT_AMT; 
                    row_item.getCell(9).value   = dt_Data[y].PK;  
                    row_item.getCell(10).value  = dt_Data[y].TR_ENCLOSE;  
                    if(dt_Data[i].STT === 2 || dt_Data[i].STT === 3)
                    {
                        row_item.getCell(4).font  = { italic: true, bold: true, size:10, color: {argb:'000000'}, name: 'Times New Roman' };
                        worksheet.getCell(pos_title,5).alignment = { vertical: 'middle', horizontal: 'center' };
                        row_item.getCell(7).font  = { italic: true, bold: true, size:10, color: {argb:'000000'}, name: 'Times New Roman'};
                        row_item.getCell(8).font  = { italic: true, bold: true, size:10, color: {argb:'000000'}, name: 'Times New Roman'};
                    }
                    pos = pos + 1; 
                    //row_item.commit();
                }  
                /************sign */
                worksheet.mergeCells(pos+4,1,pos+4,2); 
                worksheet.mergeCells(pos+5,1,pos+5,2);   
                worksheet.mergeCells(pos+4,7,pos+4,10); 
                worksheet.mergeCells(pos+5,7,pos+5,10); 
                pos = pos + 4;
              
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
            Utils.Logger({ LVL: "error", MODULE: "Report", FUNC: "rpt_6045035_Genreral_Ledger_V2", CONTENT: e.message })
           // return response.send(Utils.response(false, e.message, null))
           return response.send(null);
        }
    }   
    /*########################################################## tạm đóng để test Report  General ledger no4###########################################################################*/ 
    async rpt_6045035_Genreral_Ledger({ request, response, auth }) {
        try 
        { 
           /* P_RPT_ID: report_info.VAL1, P_RPT_URL: report_info.VAL2, P_RPT_FILE: report_info.VAL3,
                P_COMP_ID: company_info.PARTNER_ID, P_COMP_NM: company_info.TEXT, P_COMP_TAX: company_info.TAX_CODE, P_COMP_ADD: company_info.ADDR1,
                P_COMPANY: this.selectedCompany,P_ACC_PK: this.TAC_ABACCTCODE_PK, P_FR_DATE: this.from_date, P_FR_TO: this.to_date, 
                P_STATUS: this.selectedStatus, P_BOOK_CCY: this.txtBookCCY, P_CIRCULARS: this.selectedCircular, 
                P_PRINT_VOUCHER_NO : this.selectedPrintVoucherNo, P_LANG : this.selectedLanguage
             */
            /****************************** Get Param *********************************/
            let { para }        = request.get(['para']);
            /********* Parse pram to json ********/
            var item            = JSON.parse(para); 
            const user          = await auth.getUser() ;
            var COMP_ID         = item.P_COMP_ID, COMP_NM = item.P_COMP_NM, COMP_TAX = item.P_COMP_TAX, COMP_ADD = item.P_COMP_ADD;
            var BIZ_ID          = item.P_BIZ_ID , BIZ_NM  = item.P_BIZ_NM , BIZ_TAX  = item.P_BIZ_TAX , BIZ_ADD  = item.P_BIZ_ADD;
            const p_crt_by      = user.USER_ID;
            const p_language    = request.header("accept-language", "ENG");
            var file_nm         = [item.P_RPT_FILE];
            var file_type       = ".xlsx";
            var full_nm         = file_nm + file_type;
            var file_new        = file_nm + p_crt_by + file_type;
            var _resourcesPath  = [item.P_RPT_URL]+'/'+full_nm;
            var _store_acc      = "AC_RPT_6045035_ACCOUNT";
            var _store          = "AC_RPT_6045035_ACC_OPENING_1";
            // var _store_pk       = "AC_RPT_6045035_ACCOUNT_PK";
            var _store_confirm  = "AC_RPT_6045035_GENERAL_CONFIRM";
            var _store_approve  = "AC_RPT_6045035_GENERAL_APPROVE";
            var _circular       = "AC_SEL_GET_TT_BPL";
            var _param_acc      = [item.P_COMPANY, item.P_FR_DATE, item.P_FR_TO, item.P_ACC_PK, item.P_TCO_BUSPLACE_PK];
            var _param_pk       = [item.P_COMPANY, item.P_ACC_PK, item.P_TCO_BUSPLACE_PK]; 
            var _param_TT       = [item.P_CIRCULARS, item.P_TCO_BUSPLACE_PK];
            var v_no_title = "Mẫu số : S03b-DN ", e_no_title = "Form No : S03b-DN" , k_no_title = "양식번호 : S03b-DN";
            var v_dvt = " Đơn vị tính", e_dvt = " Unit", k_dvt = " 단위";
            /***************************** Return failded ****************************/
            if (!user) 
            {
                return response.send(Utils.response(false, "Request failed!", null));
            } 
            /****************************** Begin call store and write excell *********/
            else 
            { 
                /********* Call store  ***************/ 
                var   p_acc_code  = "";
                var   p_acc_name  = "";
                var   p_acc_type  = "";
                var   p_dt_from   = "";
                var   p_dt_to     = "";
                var   p_acc_num   = "";
                var dt_ACC  = await DBService.callProcCursor(_store_acc, _param_acc , p_language , p_crt_by); 
                if (dt_ACC.length>0) 
                {
                    dt_ACC      = dt_ACC;
                    p_acc_code  = dt_ACC[0].AC_CD;
                    p_acc_name  = dt_ACC[0].AC_NM;
                    p_acc_type  = dt_ACC[0].DRCR_TYPE;
                    p_dt_from   = dt_ACC[0].FRM_DATE;
                    p_dt_to     = dt_ACC[0].T_DATE;
                    p_acc_num   = dt_ACC[0].DRCR_TYPE1;
                } 
                else 
                {
                    return response.send(Utils.response(false, "no_data_found", null))
                } 

                var open_bal_dr_xls = 0; 
                var open_bal_cr_xls = 0;
                var close_bal_dr_xls = 0;
                var close_bal_cr_xls = 0; 
                var dr_opening_total = 0; 
                var cr_opening_total =0; 
                var open_bal = 0;
                var acc_pk_arr  = "";
                
                var _param = [item.P_COMPANY, item.P_FR_DATE, item.P_FR_TO, item.P_ACC_PK,item.P_STATUS, p_acc_num, item.P_TCO_BUSPLACE_PK];
                var dt_TK  = await DBService.callProcCursor(_store, _param , p_language , p_crt_by); 
                if (dt_TK.length>0) 
                {
                    dt_TK = dt_TK;
                    if(p_acc_type == "D")
                   {
                       
                        open_bal_dr_xls = dt_TK[0].OPENINGBALANCE;
                        close_bal_dr_xls = dt_TK[0].CLOSINGBALANCE;
                   }
                   else{  
                        open_bal_cr_xls = dt_TK[0].OPENINGBALANCE;
                        close_bal_cr_xls = dt_TK[0].CLOSINGBALANCE;
                   }
                   dr_opening_total = dt_TK[0].DEBITBOOKAMOUNT;
                   cr_opening_total = dt_TK[0].CREDITBOOKAMOUNT;
                   open_bal = dt_TK[0].OB;
                } 
                else 
                {
                   // dt_Data = dt_Data;
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
                //*****************Call Account PK*************** */
                /*var dt_ACC_PK  = await DBService.callProcCursor(_store_pk, _param_pk , p_language , p_crt_by); 
                var p_temp = "";
                for(var x = 0; x < dt_ACC_PK.length; x++)
                {
                    acc_pk_arr = acc_pk_arr + p_temp + dt_ACC_PK[x].PK;
                    p_temp = ",";
                }*/
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
                /********* Read file excel ********/ 
                const templateFile  = Helpers.resourcesPath(_resourcesPath); 
                await workbook.xlsx.readFile(templateFile);
                var worksheet       = workbook.getWorksheet(1);
                /********* Write file excel ********/
                
                var _param_1    = [item.P_COMPANY, item.P_FR_DATE, item.P_FR_TO, item.P_ACC_PK, item.P_STATUS, item.P_TCO_BUSPLACE_PK];
                
                if(item.P_PRINT_VOUCHER_NO == "2")
                {
                    var dt_Data  = await DBService.callProcCursor(_store_confirm, _param_1 , p_language , p_crt_by); 
                }
                else{
                    var dt_Data  = await DBService.callProcCursor(_store_approve, _param_1 , p_language , p_crt_by); 
                }
                //Merge
                worksheet.mergeCells(4,1,4,10);// Title
                worksheet.mergeCells(5,1,5,10); //from - to date
               /* worksheet.mergeCells(9,1,10,1); //date
                worksheet.mergeCells(9,2,9,3); //voucher 
                worksheet.mergeCells(9,7,9,8); //Amount */
                
                //INFOMATION COMPANY
                worksheet.getCell("A1").value = BIZ_NM;
                worksheet.getCell("A2").value = BIZ_ADD;
                worksheet.getCell("A3").value = "Tax code : " + BIZ_TAX;
                var _bookccy = item.P_BOOK_CCY;
                worksheet.getCell("H7").value = _bookccy;
                var FromDate = item.P_FR_DATE;
                var ToDate = item.P_FR_TO;
                var strFrDate = FromDate.substr(6,2) + "/"+ FromDate.substr(4,2)+ "/"+ FromDate.substr(0,4);
                var strToDate = ToDate.substr(6,2) + "/"+ ToDate.substr(4,2)+ "/"+ ToDate.substr(0,4);

                // thông tư
                var _lang = item.P_LANG;
                worksheet.mergeCells('A9', 'A10'); 
                worksheet.mergeCells('B9', 'C9'); 
                worksheet.mergeCells('F9', 'F10'); 
                worksheet.mergeCells('G9', 'H9'); 
                worksheet.mergeCells('I9', 'I10'); 
                if(_lang == 'VIE'){
                    worksheet.getCell("G1").value =  v_no_title ;
                    worksheet.getCell("G2").value =  dt_TT[0].V1 ;
                    worksheet.getCell("G3").value =  dt_TT[0].V2 ;
                    worksheet.getCell("A4").value = "SỔ CÁI";
                    worksheet.getCell("A5").value = "Từ ngày " + strFrDate + " đến ngày " + strToDate;
                    worksheet.getCell("A6").value = "Số hiệu tài khoản: ";
                    worksheet.getCell("G7").value = v_dvt;
                    //grid
                    //worksheet.getCell("A9").value = "";
                    worksheet.getCell("B9").value = "Số chứng từ";
                    worksheet.getCell("B10").value = "Số";
                    worksheet.getCell("C10").value = "Ngày";
                    worksheet.getCell("D9").value = "Diễn giải";
                    worksheet.getCell("E9").value = "Description";
                    worksheet.getCell("F9").value = "Số hiệu TK đối ứng";
                    worksheet.getCell("G9").value = "Số tiền";
                    worksheet.getCell("G10").value = "Nợ";
                    worksheet.getCell("H10").value = "Có";
                    worksheet.getCell("I9").value = "Ghi chú Seq";
                }
                else{
                   worksheet.getCell("G2").value =  dt_TT[0].E1 ;
                   worksheet.getCell("G3").value =  dt_TT[0].E2 ;
                   worksheet.getCell("A5").value = "From date " + strFrDate + " To date " + strToDate;
                   worksheet.name = "General Ledger";
                }
               worksheet.getCell("C6").value = dt_ACC[0].AC_CD;
               worksheet.getCell("D6").value = dt_ACC[0].AC_NM;
               var _print = item.P_PRINT_VOUCHER_NO;
               if(_print == '2'){
                   if(_lang == 'VIE')
                   {
                       worksheet.getCell("A9").value ="Ngày tháng ghi sổ";
                        worksheet.getCell("D12").value = "SỐ DƯ ĐẦU KỲ";
                        worksheet.getCell("D14").value = "Tổng cộng số phát sinh";
                        worksheet.getCell("D15").value = "SỐ DƯ CUỐI KỲ";
                   }
                   else{
                       worksheet.getCell("A9").value ="Date";
                   }
               }
               else{
                   worksheet.getCell("A9").value ="Approve No" ;
               }
                //-------Fill Data----------------
                worksheet.getCell("G12").value = open_bal_dr_xls;
                worksheet.getCell("H12").value = open_bal_cr_xls;
                worksheet.getCell("G14").value = dr_opening_total;
                worksheet.getCell("H14").value = cr_opening_total;
                worksheet.getCell("G15").value = close_bal_dr_xls;
                worksheet.getCell("H15").value = close_bal_cr_xls;
                
                var pos = 13; 
                if(dt_Data.length>1)
                {
                        worksheet.duplicateRow(pos,dt_Data.length-1,true);
                }  
                for (var y = 0; y < dt_Data.length; y++) 
                {
                    var row_item = worksheet.getRow(pos);
                    row_item.getCell(1).value   = dt_Data[y].TR_DATE_FMT;
                    row_item.getCell(2).value   = dt_Data[y].VOUCHERNO;     
                    row_item.getCell(3).value   = dt_Data[y].TR_DATE;
                    row_item.getCell(4).value   = dt_Data[y].REMARK2; 
                    row_item.getCell(5).value   = dt_Data[y].REMARK; 
                    row_item.getCell(6).value   = dt_Data[y].ACC_CODE; 
                    row_item.getCell(7).value   = dt_Data[y].DEBIT_AMT;
                    row_item.getCell(8).value   = dt_Data[y].CREDIT_AMT; 
                    row_item.getCell(9).value   = dt_Data[y].PK;  
                    row_item.getCell(10).value  = dt_Data[y].TR_ENCLOSE;  
                    pos = pos + 1; 
                    //row_item.commit();
                }  
                /************sign */
                worksheet.mergeCells(pos+4,1,pos+4,2); 
                worksheet.mergeCells(pos+5,1,pos+5,2);   
                worksheet.mergeCells(pos+4,7,pos+4,10); 
                worksheet.mergeCells(pos+5,7,pos+5,10); 
                pos = pos + 4;
              
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
                       }if(_lang == 'ENG' || _lang == 'ENG-KOR'|| _lang == 'ENG-VIE' )*/
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
            Utils.Logger({ LVL: "error", MODULE: "Report", FUNC: "rpt_6045035_Genreral_Ledger", CONTENT: e.message })
           // return response.send(Utils.response(false, e.message, null))
           return response.send(null);
        }
    }   
    /*########################################################## Report Cash Books  no5###########################################################################*/ 
    async rpt_6045035_CASH_BOOK({ request, response, auth }) {
        try 
        { 
           /* P_RPT_ID: report_info.VAL1, P_RPT_URL: report_info.VAL2, P_RPT_FILE: report_info.VAL3,
                P_COMP_ID: company_info.PARTNER_ID, P_COMP_NM: company_info.TEXT, P_COMP_TAX: company_info.TAX_CODE, P_COMP_ADD: company_info.ADDR1,
                P_COMPANY: this.selectedCompany,P_ACC_PK: this.TAC_ABACCTCODE_PK, P_FR_DATE: this.from_date, P_FR_TO: this.to_date, 
                P_STATUS: this.selectedStatus, P_BOOK_CCY: this.txtBookCCY, P_CIRCULARS: this.selectedCircular, 
                P_PRINT_VOUCHER_NO : this.selectedPrintVoucherNo, P_LANG : this.selectedLanguage
              */
            /****************************** Get Param *********************************/
            let { para }        = request.get(['para']);
            /********* Parse pram to json ********/
            var item            = JSON.parse(para); 
            const user          = await auth.getUser() ;
            var COMP_ID         = item.P_COMP_ID, COMP_NM = item.P_COMP_NM, COMP_TAX = item.P_COMP_TAX, COMP_ADD = item.P_COMP_ADD;
            var BIZ_ID          = item.P_BIZ_ID , BIZ_NM  = item.P_BIZ_NM , BIZ_TAX  = item.P_BIZ_TAX , BIZ_ADD  = item.P_BIZ_ADD;
            const p_crt_by      = user.USER_ID;
            const p_language    = request.header("accept-language", "ENG");
            var file_nm         = [item.P_RPT_FILE];
            var file_type       = ".xlsx";
            var full_nm         = file_nm + file_type;
            var file_new        = file_nm + p_crt_by + file_type;
            var _resourcesPath  = [item.P_RPT_URL]+'/'+full_nm;
            var _store_acc      = "AC_RPT_6045035_ACCOUNT";
            var _store          = "AC_RPT_6045035_ACC_OPENING_2";
            var _store_confirm  = "AC_RPT_6045035_CASH_BK_CONFIRM";
            var _store_approve  = "AC_RPT_6045035_CASH_BK_APPROVE";
            var _circular       = "AC_SEL_GET_TT_BPL";
            var _param_acc      = [item.P_COMPANY, item.P_FR_DATE, item.P_FR_TO, item.P_ACC_PK, item.P_TCO_BUSPLACE_PK];
            var _param_pk       = [item.P_COMPANY, item.P_ACC_PK, item.P_TCO_BUSPLACE_PK];
            var _param_TT       = [item.P_CIRCULARS, item.P_TCO_BUSPLACE_PK];
            var v_no_title      = "Mẫu số : S07-DN ", e_no_title = "Form No : S07-DN" , k_no_title = "양식번호 : S07-DN";
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
                var   p_acc_code  = "";
                var   p_acc_name  = "";
                var   p_acc_type  = "";
                var   p_dt_from   = "";
                var   p_dt_to     = "";
                var   p_acc_num   = "";
                var dt_ACC  = await DBService.callProcCursor(_store_acc, _param_acc , p_language , p_crt_by); 
                if (dt_ACC.length>0) 
                {
                    dt_ACC      = dt_ACC;
                    p_acc_code  = dt_ACC[0].AC_CD;
                    p_acc_name  = dt_ACC[0].AC_NM;
                    p_acc_type  = dt_ACC[0].DRCR_TYPE;
                    p_dt_from   = dt_ACC[0].FRM_DATE;
                    p_dt_to     = dt_ACC[0].T_DATE;
                    p_acc_num   = dt_ACC[0].DRCR_TYPE1;
                } 
                else 
                {
                    return response.send(Utils.response(false, "no_data_found", null))
                } 

                var open_bal_xls = 0; 
                var close_bal_xls = 0;
                var dr_opening_total = 0; 
                var cr_opening_total =0; 
                var open_bal = 0;
                var acc_pk_arr  = "";
                
                var _param          = [item.P_COMPANY, item.P_FR_DATE, item.P_FR_TO, item.P_ACC_PK,item.P_STATUS, p_acc_num, item.P_TCO_BUSPLACE_PK];
                var dt_TK  = await DBService.callProcCursor(_store, _param , p_language , p_crt_by); 
                if (dt_TK.length>0) 
                {
                    dt_TK = dt_TK;
                    open_bal_xls = dt_TK[0].OPENINGBALANCE;
                    dr_opening_total = dt_TK[0].DEBITBOOKAMOUNT;
                    cr_opening_total = dt_TK[0].CREDITBOOKAMOUNT;
                    close_bal_xls = dt_TK[0].CLOSINGBALANCE;
                    open_bal = dt_TK[0].OB;
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
                var worksheet       = workbook.getWorksheet(1);
                /********* Write file excel ********/
                
                var _param_1  = [item.P_COMPANY, item.P_FR_DATE, item.P_FR_TO,  item.P_ACC_PK, item.P_STATUS, open_bal, item.P_TCO_BUSPLACE_PK];
                
                if(item.P_PRINT_VOUCHER_NO == "2")
                {
                    var dt_Data  = await DBService.callProcCursor(_store_confirm, _param_1 , p_language , p_crt_by); 
                }
                else{
                    var dt_Data  = await DBService.callProcCursor(_store_approve, _param_1 , p_language , p_crt_by); 
                }
                //Merge
                worksheet.mergeCells(4,1,4,10);// Title
                worksheet.mergeCells(5,1,5,10); //from - to date
                worksheet.mergeCells(9,1,10,1); //date
                worksheet.mergeCells(9,2,10,2); //date
                worksheet.mergeCells(9,3,9,4); //voucher 
                //worksheet.mergeCells(9,4,10,4); //local description
                //worksheet.mergeCells(9,5,10,5); // description
                worksheet.mergeCells(9,7,9,9); //Amount 
                worksheet.mergeCells(9,10,11,10); //Amount 
                
                //INFOMATION COMPANY
                worksheet.getCell("A1").value = BIZ_NM;
                worksheet.getCell("A2").value = BIZ_ADD;
                worksheet.getCell("A3").value = "Tax code : " + BIZ_TAX;
                var _bookccy = item.P_BOOK_CCY;
                worksheet.getCell("H7").value = _bookccy;
                var FromDate = item.P_FR_DATE;
                var ToDate = item.P_FR_TO;
                var strFrDate = FromDate.substr(6,2) + "/"+ FromDate.substr(4,2)+ "/"+ FromDate.substr(0,4);
                var strToDate = ToDate.substr(6,2) + "/"+ ToDate.substr(4,2)+ "/"+ ToDate.substr(0,4);
                // thông tư
               var _lang = item.P_LANG;
               if(_lang == 'VIE'){
                   worksheet.getCell("G1").value =  v_no_title ;
                   worksheet.getCell("G2").value =  dt_TT[0].V1 ;
                   worksheet.getCell("G3").value =  dt_TT[0].V2 ;
                   worksheet.getCell("A4").value = "SỔ QUỸ TIỀN MẶT";
                   worksheet.getCell("A5").value = "Từ ngày " + strFrDate + " đến ngày " + strToDate;
                   worksheet.getCell("A6").value = "Tài khoản: ";
                   worksheet.getCell("C6").value = "Tên TK: ";
                   worksheet.getCell("G7").value = v_dvt;
                   //grid
                  // worksheet.mergeCells('A9', 'A10'); 
                   //worksheet.getCell("A9").value = "";
                   //worksheet.mergeCells('C9', 'D9'); 
                   worksheet.getCell("B9").value = " Ngày chứng từ";
                   worksheet.getCell("C9").value = "Chứng từ";
                   worksheet.getCell("C10").value = "Thu";
                   worksheet.getCell("D10").value = "Chi";
                   worksheet.getCell("E9").value = "Diễn giải";
                   worksheet.getCell("F9").value = "Description";
                   //worksheet.mergeCells('G9', 'I9'); 
                   worksheet.getCell("G9").value = "Số tiền";
                   worksheet.getCell("G10").value = "THU";
                   worksheet.getCell("H10").value = "CHI";
                   worksheet.getCell("I10").value = "TỒN";
                   worksheet.getCell("J9").value = "Ghi chú";
               }
               else{
                  worksheet.getCell("G2").value =  dt_TT[0].E1 ;
                  worksheet.getCell("G3").value =  dt_TT[0].E2 ;
                  worksheet.getCell("A5").value = "From date " + strFrDate + " To date " + strToDate;
                  worksheet.name = "Cash Books";
               }
              worksheet.getCell("B6").value = dt_ACC[0].AC_CD;
              worksheet.getCell("C6").value = dt_ACC[0].AC_NM;
              var _print = item.P_PRINT_VOUCHER_NO;
              if(_print == '2'){
                  if(_lang == 'VIE')
                  {
                      worksheet.getCell("A9").value ="Ngày tháng ghi sổ";
                      worksheet.getCell("E12").value = "SỐ DƯ ĐẦU KỲ";
                      worksheet.getCell("E14").value = "Tổng cộng số phát sinh";
                      worksheet.getCell("E15").value = "SỐ DƯ CUỐI KỲ";
                  }
                  else{
                      worksheet.getCell("A9").value ="Date";
                  }
                }
                else{
                    worksheet.getCell("A9").value ="Approve No" ;
                }
                //-------Fill Data----------------
                if (_bookccy === 'VND')
                {
                    worksheet.getCell("I12").value = open_bal_xls;
                    worksheet.getCell("G14").value = dr_opening_total;
                    worksheet.getCell("H14").value = cr_opening_total;
                    worksheet.getCell("I15").value = close_bal_xls;
                }
                else if(_bookccy === 'USD'){
                    worksheet.getCell("I12").value = open_bal_xls;
                    worksheet.getCell("G14").value = dr_opening_total;
                    worksheet.getCell("H14").value = cr_opening_total;
                    worksheet.getCell("I15").value = close_bal_xls;

                    worksheet.getCell("I12").value = '###,###,###,###.00';
                    worksheet.getCell("G14").value = '###,###,###,###.00';
                    worksheet.getCell("H14").value = '###,###,###,###.00';
                    worksheet.getCell("I15").value = '###,###,###,###.00';
                }
                
                var pos = 13; 
                if(dt_Data.length>1)
                {
                        worksheet.duplicateRow(pos,dt_Data.length-1,true);
                }  
                for (var y = 0; y < dt_Data.length; y++) 
                {
                    var row_item = worksheet.getRow(pos);
                    var strDate_Dsp = "";
                    var strDate = "";
                    if (strDate!= dt_Data[y].TR_DATE_FMT)
                    {
                        strDate_Dsp = dt_Data[y].TR_DATE_FMT;
                        strDate = dt_Data[y].TR_DATE_FMT;
                    }
                    else
                    {
                        strDate_Dsp = "";
                    }
                    row_item.getCell(1).value   = strDate_Dsp;
                    row_item.getCell(2).value   = dt_Data[y].TR_DATE;
                    row_item.getCell(3).value   = dt_Data[y].VOUCHERNO_DEBIT;     
                    row_item.getCell(4).value   = dt_Data[y].VOUCHERNO_CREDIT;
                    row_item.getCell(5).value   = dt_Data[y].REMARK2; 
                    row_item.getCell(6).value   = dt_Data[y].REMARK; 
                    if (_bookccy === 'VND')
                    {
                        row_item.getCell(7).value   = dt_Data[y].BOOK_AMT_DEBIT; 
                        row_item.getCell(8).value   = dt_Data[y].BOOK_AMT_CREDIT;
                        row_item.getCell(9).value   = dt_Data[y].CLOSINGBALANCE;
                    }
                    else if(_bookccy === 'USD'){
                        row_item.getCell(7).value   = dt_Data[y].BOOK_AMT_DEBIT; 
                        row_item.getCell(8).value   = dt_Data[y].BOOK_AMT_CREDIT;
                        row_item.getCell(9).value   = dt_Data[y].CLOSINGBALANCE;
                        
                        row_item.getCell(7).value   = '###,###,###,###.00';
                        row_item.getCell(8).value   = '###,###,###,###.00';
                        row_item.getCell(9).value   = '###,###,###,###.00';
                    } 
                    row_item.getCell(10).value  = dt_Data[y].PK;  
                    row_item.getCell(11).value  = dt_Data[y].TR_ENCLOSE;  
                    pos = pos + 1; 
                    //row_item.commit();
                }  
                /************sign */
                worksheet.mergeCells(pos+5,1,pos+5,2); 
                worksheet.mergeCells(pos+6,1,pos+6,2);   
                worksheet.mergeCells(pos+5,7,pos+5,9); 
                worksheet.mergeCells(pos+6,7,pos+6,9); 
                if(_lang === "VIE")
                {
                    worksheet.getCell(pos+3, 1).value = "Sổ có…. Trang , đánh số từ  trang 01 đến  trang……";
                }
                else{
                    worksheet.getCell(pos+3, 1).value = "Number of page:..., from... to...";
                }
                 pos = pos + 5;

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
                                row_item.getCell(5).value = dt_Data_sign[i].VAL2; 
                                row_item.getCell(5).font.bold = true;
                                row_item.getCell(8).value = dt_Data_sign[i].VAL3;                         
                                row_item.getCell(8).font.bold = true;
                                row_item.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
                                row_item.getCell(5).alignment = { vertical: 'middle', horizontal: 'center' };
                                row_item.getCell(8).alignment = { vertical: 'middle', horizontal: 'center' };
                            }
                            
                            row_item = worksheet.getRow(pos +1 );   
                            if (dt_Data_sign[i].CODE =='VIE_SIG')
                            {
                                row_item.getCell(1).value = dt_Data_sign[i].VAL1; 
                                row_item.getCell(1).font.bold = false;
                                row_item.getCell(5).value = dt_Data_sign[i].VAL2; 
                                row_item.getCell(5).font.bold = false;
                                row_item.getCell(8).value = dt_Data_sign[i].VAL3; 
                                row_item.getCell(8).font.bold = false;
                                row_item.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
                                row_item.getCell(8).alignment = { vertical: 'middle', horizontal: 'center' };  
                                row_item.getCell(5).alignment = { vertical: 'middle', horizontal: 'center' };                        
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
                        }
                        if(_lang == 'ENG' || _lang == 'ENG-KOR'|| _lang == 'ENG-VIE' )*/ 
                        else
                        {    row_item = worksheet.getRow(pos );
                            if (dt_Data_sign[i].CODE =='ENG')
                            {
                                row_item.getCell(1).value = dt_Data_sign[i].VAL1; 
                                row_item.getCell(1).font.bold = true;  
                                row_item.getCell(5).value = dt_Data_sign[i].VAL2; 
                                row_item.getCell(5).font.bold = true;                               
                                row_item.getCell(8).value = dt_Data_sign[i].VAL3;                         
                                row_item.getCell(8).font.bold = true;
                                row_item.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };   
                                row_item.getCell(5).alignment = { vertical: 'middle', horizontal: 'center' };   
                                row_item.getCell(8).alignment = { vertical: 'middle', horizontal: 'center' }; 
                                    
                            }
                            
                            row_item = worksheet.getRow(pos +1 );   
                            if (dt_Data_sign[i].CODE =='ENG_SIG')
                            {
                                row_item.getCell(1).value = dt_Data_sign[i].VAL1;                                
                                row_item.getCell(5).value = dt_Data_sign[i].VAL2; 
                                row_item.getCell(8).value = dt_Data_sign[i].VAL3;                             
                                row_item.getCell(1).font.bold = false;
                                row_item.getCell(5).font.bold = false;
                                row_item.getCell(8).font.bold = false;
                                row_item.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };   
                                row_item.getCell(5).alignment = { vertical: 'middle', horizontal: 'center' };   
                                row_item.getCell(8).alignment = { vertical: 'middle', horizontal: 'center' }; 

                            }    
                        }
                        if (dt_Data_sign[i].CODE =='NAME')
                        {
                            row_item = worksheet.getRow(pos +2 ); 
                            row_item.getCell(1).value = dt_Data_sign[i].VAL1; 
                            row_item.getCell(1).font.bold = false;
                            row_item.getCell(5).value = dt_Data_sign[i].VAL2; 
                            row_item.getCell(5).font.bold = false;
                            row_item.getCell(8).value = dt_Data_sign[i].VAL3;         
                            row_item.getCell(8).font.bold = false;
                            row_item.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };   
                            row_item.getCell(5).alignment = { vertical: 'middle', horizontal: 'center' };   
                            row_item.getCell(8).alignment = { vertical: 'middle', horizontal: 'center' }; 
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
            Utils.Logger({ LVL: "error", MODULE: "Report", FUNC: "rpt_6045035_CASH_BOOK", CONTENT: e.message })
           // return response.send(Utils.response(false, e.message, null))
           return response.send(null);
        }
    }   
     /*########################################################## Report Cash Detail Books no6###########################################################################*/ 
     async rpt_6045035_CASH_DETAIL_BOOKS({ request, response, auth }) {
        try 
        { 
           /* P_RPT_ID: report_info.VAL1, P_RPT_URL: report_info.VAL2, P_RPT_FILE: report_info.VAL3,
                P_COMP_ID: company_info.PARTNER_ID, P_COMP_NM: company_info.TEXT, P_COMP_TAX: company_info.TAX_CODE, P_COMP_ADD: company_info.ADDR1,
                P_COMPANY: this.selectedCompany,P_ACC_PK: this.TAC_ABACCTCODE_PK, P_FR_DATE: this.from_date, P_FR_TO: this.to_date, 
                P_STATUS: this.selectedStatus, P_BOOK_CCY: this.txtBookCCY, P_CIRCULARS: this.selectedCircular, 
                P_PRINT_VOUCHER_NO : this.selectedPrintVoucherNo, P_LANG : this.selectedLanguage
              */
            /****************************** Get Param *********************************/
            let { para }        = request.get(['para']);
            /********* Parse pram to json ********/
            var item            = JSON.parse(para); 
            const user          = await auth.getUser() ;
            var COMP_ID         = item.P_COMP_ID, COMP_NM = item.P_COMP_NM, COMP_TAX = item.P_COMP_TAX, COMP_ADD = item.P_COMP_ADD;
            var BIZ_ID          = item.P_BIZ_ID , BIZ_NM  = item.P_BIZ_NM , BIZ_TAX  = item.P_BIZ_TAX , BIZ_ADD  = item.P_BIZ_ADD;
            const p_crt_by      = user.USER_ID;
            const p_language    = request.header("accept-language", "ENG");
            var file_nm         = [item.P_RPT_FILE];
            var file_type       = ".xlsx";
            var full_nm         = file_nm + file_type;
            var file_new        = file_nm + p_crt_by + file_type;
            var _resourcesPath  = [item.P_RPT_URL]+'/'+full_nm;
            var _store_acc      = "AC_RPT_6045035_ACCOUNT";
            var _store          = "AC_RPT_6045035_ACC_OPENING_2";
           // var _store_pk       = "AC_RPT_6045035_ACCOUNT_PK";
            var _store_confirm  = "AC_RPT_6045035_CASH_DL_CONFIRM";
            var _store_approve  = "AC_RPT_6045035_CASH_DL_APPROVE";
            var _circular       = "AC_SEL_GET_TT_BPL";
            var _param_acc      = [item.P_COMPANY, item.P_FR_DATE, item.P_FR_TO, item.P_ACC_PK, item.P_TCO_BUSPLACE_PK];
            var _param_pk       = [item.P_COMPANY, item.P_ACC_PK, item.P_TCO_BUSPLACE_PK];
            var _param_TT       = [item.P_CIRCULARS, item.P_TCO_BUSPLACE_PK];
            var v_no_title      = "Mẫu số : S07-DN ", e_no_title = "Form No : S07-DN" , k_no_title = "양식번호 : S07-DN";
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
                var   p_acc_code  = "";
                var   p_acc_name  = "";
                var   p_acc_type  = "";
                var   p_dt_from   = "";
                var   p_dt_to     = "";
                var   p_acc_num   = "";
                var dt_ACC  = await DBService.callProcCursor(_store_acc, _param_acc , p_language , p_crt_by); 
                if (dt_ACC.length>0) 
                {
                    dt_ACC      = dt_ACC;
                    p_acc_code  = dt_ACC[0].AC_CD;
                    p_acc_name  = dt_ACC[0].AC_NM;
                    p_acc_type  = dt_ACC[0].DRCR_TYPE;
                    p_dt_from   = dt_ACC[0].FRM_DATE;
                    p_dt_to     = dt_ACC[0].T_DATE;
                    p_acc_num   = dt_ACC[0].DRCR_TYPE1;
                } 
                else 
                {
                    return response.send(Utils.response(false, "no_data_found", null))
                } 

                var open_bal_xls = 0; 
                var close_bal_xls = 0;
                var dr_opening_total = 0; 
                var cr_opening_total =0;
                var open_bal = 0;
                var acc_pk_arr  = "";
                
                var _param          = [item.P_COMPANY, item.P_FR_DATE, item.P_FR_TO, item.P_ACC_PK,item.P_STATUS, p_acc_num, item.P_TCO_BUSPLACE_PK];
                var dt_TK  = await DBService.callProcCursor(_store, _param , p_language , p_crt_by); 
                if (dt_TK.length>0) 
                {
                    dt_TK = dt_TK;
                    open_bal_xls = dt_TK[0].OPENINGBALANCE;
                    dr_opening_total = dt_TK[0].DEBITBOOKAMOUNT;
                    cr_opening_total = dt_TK[0].CREDITBOOKAMOUNT;
                    close_bal_xls = dt_TK[0].CLOSINGBALANCE;
                    open_bal = dt_TK[0].OB;
                } 
                else 
                {
                   // dt_Data = dt_Data;
                    return response.send(Utils.response(false, "no_data_found", null))
                } 
                //*****************Call Account PK*************** */
                /*var dt_ACC_PK  = await DBService.callProcCursor(_store_pk, _param_pk , p_language , p_crt_by); 
                var p_temp = "";
                for(var x = 0; x < dt_ACC_PK.length; x++)
                {
                    acc_pk_arr = acc_pk_arr + p_temp + dt_ACC_PK[x].PK;
                    p_temp = ",";
                }*/
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
                    //dt_TT = dt_TT;
                    return response.send(Utils.response(false, "no_data_found", null))
                } 
                /********* Read file excel ********/ 
                const templateFile  = Helpers.resourcesPath(_resourcesPath); 
                await workbook.xlsx.readFile(templateFile);
                var worksheet       = workbook.getWorksheet(1);
                /********* Write file excel ********/
                
                var _param_1  = [item.P_COMPANY, item.P_FR_DATE, item.P_FR_TO, item.P_ACC_PK, item.P_STATUS, open_bal, p_acc_type, item.P_TCO_BUSPLACE_PK];
                
                if(item.P_PRINT_VOUCHER_NO == "2")
                {
                    var dt_Data  = await DBService.callProcCursor(_store_confirm, _param_1 , p_language , p_crt_by); 
                }
                else{
                    var dt_Data  = await DBService.callProcCursor(_store_approve, _param_1 , p_language , p_crt_by); 
                }
                
                
                //INFOMATION COMPANY
                worksheet.getCell("A1").value = BIZ_NM;
                worksheet.getCell("A2").value = BIZ_ADD;
                worksheet.getCell("A3").value = "Tax code : " + BIZ_TAX;
                var _bookccy = item.P_BOOK_CCY;
                worksheet.getCell("H7").value = _bookccy;

                var FromDate = item.P_FR_DATE;
                var ToDate = item.P_FR_TO;
                var strFrDate = FromDate.substr(6,2) + "/"+ FromDate.substr(4,2)+ "/"+ FromDate.substr(0,4);
                var strToDate = ToDate.substr(6,2) + "/"+ ToDate.substr(4,2)+ "/"+ ToDate.substr(0,4);
                // thông tư
                //Merge
                worksheet.mergeCells(4,1,4,10);// Title
                worksheet.mergeCells(5,1,5,10); //from - to date
                worksheet.mergeCells(9,1,10,1); //date
                worksheet.mergeCells(9,2,10,2); //date
                worksheet.mergeCells(9,3,9,4); //voucher 
                //worksheet.mergeCells(9,4,10,4); //local description
                //worksheet.mergeCells(9,5,10,5); // description
                worksheet.mergeCells(9,8,9,10); //Amount 
                worksheet.mergeCells(9,11,10,11); //SEQ 
               // worksheet.mergeCells(9,11,11,12); //Amount 
               var _lang = item.P_LANG;
               if(_lang == 'VIE'){
                   worksheet.getCell("G1").value =  v_no_title ;
                   worksheet.getCell("G2").value =  dt_TT[0].V1 ;
                   worksheet.getCell("G3").value =  dt_TT[0].V2 ;
                   worksheet.getCell("A4").value = "SỔ QUỸ TOÁN CHI TIẾT QUỸ TIỀN MẶT";
                   worksheet.getCell("A5").value = "Từ ngày " + strFrDate + " đến ngày " + strToDate;
                   worksheet.getCell("A6").value = "Tài khoản: ";
                   worksheet.getCell("G7").value = v_dvt;
                   //grid
                  // worksheet.mergeCells('A9', 'A10'); 
                   //worksheet.getCell("A9").value = "";
                   //worksheet.mergeCells('C9', 'D9'); 
                   worksheet.getCell("B9").value = " Ngày chứng từ";
                   worksheet.getCell("C9").value = "Chứng từ";
                   worksheet.getCell("C10").value = "Thu";
                   worksheet.getCell("D10").value = "Chi";
                   worksheet.getCell("E9").value = "Diễn giải";
                   worksheet.getCell("F9").value = "Description";
                   worksheet.getCell("G9").value = "TK";
                   //worksheet.mergeCells('G9', 'I9'); 
                   worksheet.getCell("H9").value = "Số tiền";
                   worksheet.getCell("H10").value = "THU";
                   worksheet.getCell("I10").value = "CHI";
                   worksheet.getCell("J10").value = "TỒN";
                   worksheet.getCell("K9").value = "Ghi chú SEQ";
               }
               else{
                  worksheet.getCell("G2").value =  dt_TT[0].E1 ;
                  worksheet.getCell("G3").value =  dt_TT[0].E2 ;
                  worksheet.getCell("A5").value = "From date " + strFrDate + " To date " + strToDate;
                  worksheet.name = "Cash Detail Books";
               }
                worksheet.getCell("B6").value = dt_ACC[0].AC_CD;
                worksheet.getCell("C6").value = dt_ACC[0].AC_NM;
                var _print = item.P_PRINT_VOUCHER_NO;
                if(_print == '2'){
                    if(_lang == 'VIE')
                    {
                        worksheet.getCell("A9").value ="Ngày tháng ghi sổ";
                        worksheet.getCell("E12").value = "SỐ DƯ ĐẦU KỲ";
                        worksheet.getCell("E14").value = "Tổng cộng số phát sinh";
                        worksheet.getCell("E15").value = "SỐ DƯ CUỐI KỲ";
                    }
                    else{
                        worksheet.getCell("A9").value ="Date";
                    }
                }
                else{
                    worksheet.getCell("A9").value ="Approve No" ;
                }		
                //-------Fill Data----------------
                worksheet.getCell("J12").value = open_bal_xls;
                worksheet.getCell("H14").value = dr_opening_total;
                worksheet.getCell("I14").value = cr_opening_total;
                worksheet.getCell("J15").value = close_bal_xls;
                
                var pos = 13; 
                if(dt_Data.length>1)
                {
                        worksheet.duplicateRow(pos,dt_Data.length-1,true);
                }  
                for (var y = 0; y < dt_Data.length; y++) 
                {
                    var row_item = worksheet.getRow(pos);
                    row_item.getCell(1).value   = dt_Data[y].TR_DATE_FMT;
                    row_item.getCell(2).value   = dt_Data[y].TR_DATE;
                    row_item.getCell(3).value   = dt_Data[y].VOUCHERNO_DEBIT;     
                    row_item.getCell(4).value   = dt_Data[y].VOUCHERNO_CREDIT;
                    row_item.getCell(5).value   = dt_Data[y].REMARK2; 
                    row_item.getCell(6).value   = dt_Data[y].REMARK; 
                    row_item.getCell(7).value   = dt_Data[y].ACC_CODE; 
                    row_item.getCell(8).value   = dt_Data[y].DEBIT_AMT; 
                    row_item.getCell(9).value   = dt_Data[y].CREDIT_AMT;
                    row_item.getCell(10).value   = dt_Data[y].CLOSINGBALANCE; 
                    row_item.getCell(11).value  = dt_Data[y].PK;  
                    row_item.getCell(12).value  = dt_Data[y].TR_ENCLOSE;  
                    pos = pos + 1; 
                    //row_item.commit();
                }  
                /************sign */
                worksheet.mergeCells(pos+5,1,pos+5,2); 
                worksheet.mergeCells(pos+6,1,pos+6,2);   
                worksheet.mergeCells(pos+5,7,pos+5,9); 
                worksheet.mergeCells(pos+6,7,pos+6,9); 
                if(_lang === "VIE")
                {
                    worksheet.getCell(pos+3, 1).value = "Sổ có…. Trang , đánh số từ  trang 01 đến  trang……";
                }
                else{
                    worksheet.getCell(pos+3, 1).value = "Number of page:..., from... to...";
                }
                pos = pos + 5;

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
                               row_item.getCell(5).value = dt_Data_sign[i].VAL2; 
                               row_item.getCell(5).font.bold = true;
                               row_item.getCell(7).value = dt_Data_sign[i].VAL3;                         
                               row_item.getCell(7).font.bold = true;
                               row_item.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
                               row_item.getCell(5).alignment = { vertical: 'middle', horizontal: 'center' };
                               row_item.getCell(7).alignment = { vertical: 'middle', horizontal: 'center' };
                           }
                           
                           row_item = worksheet.getRow(pos +1 );   
                           if (dt_Data_sign[i].CODE =='VIE_SIG')
                           {
                               row_item.getCell(1).value = dt_Data_sign[i].VAL1; 
                               row_item.getCell(1).font.bold = false;
                               row_item.getCell(5).value = dt_Data_sign[i].VAL2; 
                               row_item.getCell(5).font.bold = false;
                               row_item.getCell(7).value = dt_Data_sign[i].VAL3; 
                               row_item.getCell(7).font.bold = false;
                               row_item.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
                               row_item.getCell(7).alignment = { vertical: 'middle', horizontal: 'center' };  
                               row_item.getCell(5).alignment = { vertical: 'middle', horizontal: 'center' };                        
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
                        }
                       if(_lang == 'ENG' || _lang == 'ENG-KOR'|| _lang == 'ENG-VIE' )*/ 
                       else
                       {    row_item = worksheet.getRow(pos );
                           if (dt_Data_sign[i].CODE =='ENG')
                           {
                               row_item.getCell(1).value = dt_Data_sign[i].VAL1; 
                               row_item.getCell(1).font.bold = true;  
                               row_item.getCell(5).value = dt_Data_sign[i].VAL2; 
                               row_item.getCell(5).font.bold = true;                               
                               row_item.getCell(7).value = dt_Data_sign[i].VAL3;                         
                               row_item.getCell(7).font.bold = true;
                               row_item.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };   
                               row_item.getCell(5).alignment = { vertical: 'middle', horizontal: 'center' };   
                               row_item.getCell(7).alignment = { vertical: 'middle', horizontal: 'center' }; 
                                 
                           }
                           
                           row_item = worksheet.getRow(pos +1 );   
                           if (dt_Data_sign[i].CODE =='ENG_SIG')
                           {
                               row_item.getCell(1).value = dt_Data_sign[i].VAL1;                                
                               row_item.getCell(5).value = dt_Data_sign[i].VAL2; 
                               row_item.getCell(7).value = dt_Data_sign[i].VAL3;                             
                               row_item.getCell(1).font.bold = false;
                               row_item.getCell(5).font.bold = false;
                               row_item.getCell(7).font.bold = false;
                               row_item.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };   
                               row_item.getCell(5).alignment = { vertical: 'middle', horizontal: 'center' };   
                               row_item.getCell(7).alignment = { vertical: 'middle', horizontal: 'center' }; 

                           }    
                       }
                       if (dt_Data_sign[i].CODE =='NAME')
                       {
                           row_item = worksheet.getRow(pos +2 ); 
                           row_item.getCell(1).value = dt_Data_sign[i].VAL1; 
                           row_item.getCell(1).font.bold = false;
                           row_item.getCell(5).value = dt_Data_sign[i].VAL2; 
                           row_item.getCell(5).font.bold = false;
                           row_item.getCell(7).value = dt_Data_sign[i].VAL3;         
                           row_item.getCell(7).font.bold = false;
                           row_item.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };   
                           row_item.getCell(5).alignment = { vertical: 'middle', horizontal: 'center' };   
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
            Utils.Logger({ LVL: "error", MODULE: "Report", FUNC: "rpt_6030070_CASH_DETAIL_BOOKS", CONTENT: e.message })
           // return response.send(Utils.response(false, e.message, null))
           return response.send(null);
        }
    }   
     /*########################################################## Report Bank statement books no7###########################################################################*/ 
     async rpt_6045035_CASH_STATEMENT_BOOKS({ request, response, auth }) {
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
            var BIZ_ID          = item.P_BIZ_ID , BIZ_NM  = item.P_BIZ_NM , BIZ_TAX  = item.P_BIZ_TAX , BIZ_ADD  = item.P_BIZ_ADD;
            const p_crt_by      = user.USER_ID;
            const p_language    = request.header("accept-language", "ENG");
            var file_nm         = [item.P_RPT_FILE];
            var file_type       = ".xlsx";
            var full_nm         = file_nm + file_type;
            var file_new        = file_nm + p_crt_by + file_type;
            var _resourcesPath  = [item.P_RPT_URL]+'/'+full_nm;
            var _store          = "AC_RPT_6045035_ACC_OPENING_3";
            //var _store_pk       = "AC_RPT_6045035_ACCOUNT_PK"; 
            var _store_bank     = "AC_RPT_6045035_BANK"; 
            var _store_confirm  = "AC_RPT_6045035_BANK_CONFIRM";
            var _store_approve  = "AC_RPT_6045035_BANK_APPROVE";
            var _circular       = "AC_SEL_GET_TT_BPL";
            var _param_pk       = [item.P_COMPANY, item.P_ACC_PK, item.P_TCO_BUSPLACE_PK];
            var _param_TT       = [item.P_CIRCULARS, item.P_TCO_BUSPLACE_PK];
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
                    var dt_Data  = await DBService.callProcCursor(_store_confirm, _param_1 , p_language , p_crt_by); 
                }
                else{
                    var dt_Data  = await DBService.callProcCursor(_store_approve, _param_1 , p_language , p_crt_by); 
                }
                
                
                //INFOMATION COMPANY
                worksheet.getCell("A1").value = Utils.translate("COMPANY",_dictionary , p_language) +": "+ BIZ_NM;//COMP_NM;
                worksheet.getCell("A2").value = Utils.translate("ADDRESS",_dictionary , p_language) +": "+ BIZ_ADD;//COMP_ADD;
                worksheet.getCell("A3").value = Utils.translate("TAX_CODE",_dictionary, p_language) +": "+ BIZ_TAX;  
                //worksheet.getCell("A3").value = "Tax code : " + COMP_TAX;
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
                var _lang = item.P_LANG;
                if(_lang == 'VIE'){
                    //worksheet.getCell("A3").value = "Tax code : " + BIZ_TAX;
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

                }
                else if(_lang == 'KOR'){
                    //worksheet.getCell("A3").value = "사업자번호 : " + BIZ_TAX;
                    worksheet.name = "Bank Stament Books";
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


                }
                else{
                   // worksheet.getCell("A3").value = "Tax code : " + BIZ_TAX;
                   
                    worksheet.name = "Bank Stament Books";
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
                       // worksheet.getCell("A9").value ="Approve No" ;
                    }
                }
                else{
                    worksheet.getCell("A9").value ="Approve No" ;
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
                    row_item.getCell(15).value  = dt_Data[y].CUSTOMER;  
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
            Utils.Logger({ LVL: "error", MODULE: "Report", FUNC: "rpt_6045035_CASH_DETAIL_BOOKS", CONTENT: e.message })
           // return response.send(Utils.response(false, e.message, null))
           return response.send(null);
        }
    }   
    /*########################################################## Report Trial Balance(Period) no9###########################################################################*/ 
    async rpt_6045035_TRIAL_BALANCE({ request, response, auth }) {
        try 
        { 
           /* P_RPT_ID: report_info.VAL1, P_RPT_URL: report_info.VAL2, P_RPT_FILE: report_info.VAL3,
                P_COMP_ID: company_info.PARTNER_ID, P_COMP_NM: company_info.TEXT, P_COMP_TAX: company_info.TAX_CODE, P_COMP_ADD: company_info.ADDR1,
                P_COMPANY: this.selectedCompany,P_ACC_PK: this.TAC_ABACCTCODE_PK, P_FR_DATE: this.from_date, P_FR_TO: this.to_date, 
                P_CCY: this.selectedCurrency, P_STATUS: this.selectedStatus, P_BOOK_CCY: this.txtBookCCY, P_CIRCULARS: this.selectedCircular, P_PRINT_VOUCHER_NO : this.selectedPrintVoucherNo, 
                P_LANG : this.selectedLanguage, P_BANK: this.selectedBank, P_ENCLOSE : this.l_enclone
            */
            /****************************** Get Param *********************************/
            let { para }        = request.get(['para']);
            /********* Parse pram to json ********/
            var item            = JSON.parse(para); 
            const user          = await auth.getUser() ;
            var COMP_ID         = item.P_COMP_ID, COMP_NM = item.P_COMP_NM, COMP_TAX = item.P_COMP_TAX, COMP_ADD = item.P_COMP_ADD;
            var BIZ_ID          = item.P_BIZ_ID , BIZ_NM  = item.P_BIZ_NM , BIZ_TAX  = item.P_BIZ_TAX , BIZ_ADD  = item.P_BIZ_ADD;
            const p_crt_by      = user.USER_ID;
            const p_language    = request.header("accept-language", "ENG");
            var file_nm         = [item.P_RPT_FILE];
            var file_type       = ".xlsx";
            var full_nm         = file_nm + file_type;
            var file_new        = file_nm + p_crt_by + file_type;
            var _resourcesPath  = [item.P_RPT_URL]+'/'+full_nm;
            var _store_acc      = "AC_RPT_6045035_ACCOUNT";
            var _store          = "AC_RPT_6045035_ACC_OPENING_2";
            var _store_pk       = "AC_RPT_6045035_ACCOUNT_PK";
            var _store_confirm  = "AC_RPT_6045035_TRIAL_BL_1";
            var _store_approve  = "AC_RPT_6045035_TRIAL_BL_2";
            var _circular       = "AC_SEL_GET_TT_BPL";
            var _param_acc      = [item.P_COMPANY, item.P_FR_DATE, item.P_FR_TO, item.P_ACC_PK, item.P_TCO_BUSPLACE_PK];
            var _param_pk       = [item.P_COMPANY, item.P_ACC_PK, item.P_TCO_BUSPLACE_PK];
            var _param_TT       = [item.P_CIRCULARS, item.P_TCO_BUSPLACE_PK];
            /***************************** Return failded ****************************/
            if (!user) 
            {
                return response.send(Utils.response(false, "Request failed!", null));
            } 
            /****************************** Begin call store and write excell *********/
            else 
            { 
                /********* Call store  ***************/ 
                var   p_acc_code  = "";
                var   p_acc_name  = "";
                var   p_acc_type  = "";
                var   p_dt_from   = "";
                var   p_dt_to     = "";
                var   p_acc_num   = "";
                var dt_ACC  = await DBService.callProcCursor(_store_acc, _param_acc , p_language , p_crt_by); 
                if (dt_ACC.length>0) 
                {
                    dt_ACC      = dt_ACC;
                    p_acc_code  = dt_ACC[0].AC_CD;
                    p_acc_name  = dt_ACC[0].AC_NM;
                    p_acc_type  = dt_ACC[0].DRCR_TYPE;
                    p_dt_from   = dt_ACC[0].FRM_DATE;
                    p_dt_to     = dt_ACC[0].T_DATE;
                    p_acc_num   = dt_ACC[0].DRCR_TYPE1;
                } 
                else 
                {
                    return response.send(Utils.response(false, "no_data_found", null))
                } 

                var open_bal_dr_xls = 0; 
                var close_bal_dr_xls = 0;
                var open_bal_cr_xls = 0; 
                var close_bal_cr_xls = 0;
                var dr_opening_total = 0; 
                var cr_opening_total =0;
                var open_bal = 0;
                var acc_pk_arr  = "";
                
                var _param          = [item.P_COMPANY, item.P_FR_DATE, item.P_FR_TO, item.P_ACC_PK,item.P_STATUS, p_acc_num, item.P_TCO_BUSPLACE_PK];
                var dt_TK  = await DBService.callProcCursor(_store, _param , p_language , p_crt_by); 
                if (dt_TK.length>0) 
                {
                    dt_TK = dt_TK;
                    if(p_acc_type == "D")
                    {
                        open_bal_dr_xls = dt_TK[0].OPENINGBALANCE;
                        close_bal_dr_xls = dt_TK[0].CLOSINGBALANCE;
                    }
                    else{
                        open_bal_cr_xls = dt_TK[0].OPENINGBALANCE;
                        close_bal_cr_xls = dt_TK[0].CLOSINGBALANCE;
                    }
                    dr_opening_total = dt_TK[0].DEBITBOOKAMOUNT;
                    cr_opening_total = dt_TK[0].CREDITBOOKAMOUNT;
                    open_bal = dt_TK[0].OB;
                } 
                else 
                {
                   // dt_Data = dt_Data;
                    return response.send(Utils.response(false, "no_data_found", null))
                } 
                //*****************Call Account PK*************** */
               /* var dt_ACC_PK  = await DBService.callProcCursor(_store_pk, _param_pk , p_language , p_crt_by); 
                var p_temp = "";
                for(var x = 0; x < dt_ACC_PK.length; x++)
                {
                    acc_pk_arr = acc_pk_arr + p_temp + dt_ACC_PK[x].PK;
                    p_temp = ",";
                }*/
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
                /********* Read file excel ********/ 
                const templateFile  = Helpers.resourcesPath(_resourcesPath); 
                await workbook.xlsx.readFile(templateFile);
                var worksheet       = workbook.getWorksheet(1);
                /********* Write file excel ********/
                
                var _param_1  = [item.P_COMPANY, item.P_FR_DATE, item.P_FR_TO,  item.P_ACC_PK, item.P_STATUS, item.P_TCO_BUSPLACE_PK];
                
                if(item.P_ENCLOSE == "Y")
                {
                    var dt_Data  = await DBService.callProcCursor(_store_confirm, _param_1 , p_language , p_crt_by); 
                }
                else{
                    var dt_Data  = await DBService.callProcCursor(_store_approve, _param_1 , p_language , p_crt_by); 
                }
                //Merge
                worksheet.mergeCells(4,1,4,6);// Title
                worksheet.mergeCells(5,1,5,6); //from - to date
                worksheet.mergeCells(9,1,9,3); //account name 
                worksheet.mergeCells(9,5,9,6); //Amount
                
                //INFOMATION COMPANY
                worksheet.getCell("A1").value = BIZ_NM;
                worksheet.getCell("A2").value = BIZ_ADD;
                worksheet.getCell("A3").value = "Tax code : " + BIZ_TAX;
                var _bookccy = item.P_BOOK_CCY;
                worksheet.getCell("F7").value = _bookccy;
                //thÃ´ng tÆ°
                var _lang = item.P_LANG;
                if(_lang == 'VIE'){
                    worksheet.getCell("F2").value =  dt_TT[0].V1 ;
                    worksheet.getCell("F3").value =  dt_TT[0].V2 ;
                }
                else{
                    worksheet.getCell("F2").value =  dt_TT[0].E1 ;
                    worksheet.getCell("F3").value =  dt_TT[0].E2 ;
                }
                worksheet.getCell("B6").value = dt_ACC[0].AC_CD + " " + dt_ACC[0].AC_NM;
                var FromDate = item.P_FR_DATE;
                var ToDate = item.P_FR_TO;
                var strFrDate = FromDate.substr(6,2) + "/"+ FromDate.substr(4,2)+ "/"+ FromDate.substr(0,4);
                var strToDate = ToDate.substr(6,2) + "/"+ ToDate.substr(4,2)+ "/"+ ToDate.substr(0,4);
                worksheet.getCell("A5").value = "From date : " + strFrDate + " To date : " + strToDate;
                //-------Fill Data----------------
                if(p_acc_type == "D")
                {
                    worksheet.getCell("E11").value = open_bal_dr_xls;
                    worksheet.getCell("E14").value = close_bal_dr_xls;
                }
                else{
                    worksheet.getCell("F11").value = open_bal_cr_xls;
                    worksheet.getCell("F14").value = close_bal_cr_xls;
                }
               
                worksheet.getCell("E13").value = dr_opening_total;
                worksheet.getCell("F13").value = cr_opening_total;
                
                
                
                var pos = 12; 
                if(dt_Data.length>1)
                {
                        worksheet.duplicateRow(pos,dt_Data.length-1,true);
                }  
                for (var y = 0; y < dt_Data.length; y++) 
                {
                    var row_item = worksheet.getRow(pos);
                    row_item.getCell(1).value   = dt_Data[y].AC_NM;
                    row_item.getCell(2).value   = dt_Data[y].AC_KNM;
                    row_item.getCell(3).value   = dt_Data[y].AC_LNM;     
                    row_item.getCell(4).value   = dt_Data[y].AC_CD;
                    row_item.getCell(5).value   = dt_Data[y].DEBIT_AMT; 
                    row_item.getCell(6).value   = dt_Data[y].CREDIT_AMT; 
                    row_item.getCell(7).value   = dt_Data[y].TR_ENCLOSE;  
                    pos = pos + 1; 
                    //row_item.commit();
                }  
                
                
                /********* Print file excel ********/
                const reportFile    = Helpers.tmpPath(file_new);
                await workbook.xlsx.writeFile(reportFile)
                return response.attachment( reportFile, file_new);
            }
        } 
        catch (e) 
        {
            Utils.Logger({ LVL: "error", MODULE: "Report", FUNC: "rpt_6045035_TRIAL_BALANCE", CONTENT: e.message })
           // return response.send(Utils.response(false, e.message, null))
           return response.send(null);
        }
    }   
    /*########################################################## Report Trial Balance(Cash)  no10###########################################################################*/ 
    async rpt_6045035_TRIAL_BALANCE_CASH({ request, response, auth }) {
        try 
        { 
           /* P_RPT_ID: report_info.VAL1, P_RPT_URL: report_info.VAL2, P_RPT_FILE: report_info.VAL3,
                P_COMP_ID: company_info.PARTNER_ID, P_COMP_NM: company_info.TEXT, P_COMP_TAX: company_info.TAX_CODE, P_COMP_ADD: company_info.ADDR1,
                P_COMPANY: this.selectedCompany,P_ACC_PK: this.TAC_ABACCTCODE_PK, P_FR_DATE: this.from_date, P_FR_TO: this.to_date, 
                P_CCY: this.selectedCurrency, P_STATUS: this.selectedStatus, P_BOOK_CCY: this.txtBookCCY, P_CIRCULARS: this.selectedCircular, 
                P_PRINT_VOUCHER_NO : this.selectedPrintVoucherNo, P_LANG : this.selectedLanguage, P_BANK: this.selectedBank, P_ENCLOSE : this.l_enclone
            */
            /****************************** Get Param *********************************/
            let { para }        = request.get(['para']);
            /********* Parse pram to json ********/
            var item            = JSON.parse(para); 
            const user          = await auth.getUser() ;
            var COMP_ID         = item.P_COMP_ID, COMP_NM = item.P_COMP_NM, COMP_TAX = item.P_COMP_TAX, COMP_ADD = item.P_COMP_ADD;
            var BIZ_ID              = item.P_BIZ_ID , BIZ_NM  = item.P_BIZ_NM , BIZ_TAX  = item.P_BIZ_TAX , BIZ_ADD  = item.P_BIZ_ADD;
            const p_crt_by      = user.USER_ID;
            const p_language    = request.header("accept-language", "ENG");
            var file_nm         = [item.P_RPT_FILE];
            var file_type       = ".xlsx";
            var full_nm         = file_nm + file_type;
            var file_new        = file_nm + p_crt_by + file_type;
            var _resourcesPath  = [item.P_RPT_URL]+'/'+full_nm;
            var _store_acc      = "AC_RPT_6045035_ACCOUNT";
            var _store          = "AC_RPT_6045035_ACC_OPENING_2";
            //var _store_pk       = "AC_RPT_6045035_ACCOUNT_PK";
            var _store_confirm  = "AC_RPT_6045035_TRIAL_BL_CASH_1";
            var _store_approve  = "AC_RPT_6045035_TRIAL_BL_CASH_2";
           // var _circular       = "AC_SEL_GET_TT_BPL";
            var _param_acc      = [item.P_COMPANY, item.P_FR_DATE, item.P_FR_TO, item.P_ACC_PK, item.P_TCO_BUSPLACE_PK];
            var _param_pk       = [item.P_COMPANY, item.P_ACC_PK, item.P_TCO_BUSPLACE_PK];
            var _param_TT       = [item.P_CIRCULARS, item.P_TCO_BUSPLACE_PK];
            /***************************** Return failded ****************************/
            if (!user) 
            {
                return response.send(Utils.response(false, "Request failed!", null));
            } 
            /****************************** Begin call store and write excell *********/
            else 
            { 
                /********* Call store  ***************/ 
                var   p_acc_code  = "";
                var   p_acc_name  = "";
                var   p_acc_type  = "";
                var   p_dt_from   = "";
                var   p_dt_to     = "";
                var   p_acc_num   = "";
                var dt_ACC  = await DBService.callProcCursor(_store_acc, _param_acc , p_language , p_crt_by); 
                if (dt_ACC.length>0) 
                {
                    dt_ACC      = dt_ACC;
                    p_acc_code  = dt_ACC[0].AC_CD;
                    p_acc_name  = dt_ACC[0].AC_NM;
                    p_acc_type  = dt_ACC[0].DRCR_TYPE;
                    p_dt_from   = dt_ACC[0].FRM_DATE;
                    p_dt_to     = dt_ACC[0].T_DATE;
                    p_acc_num   = dt_ACC[0].DRCR_TYPE1;
                } 
                else 
                {
                    return response.send(Utils.response(false, "no_data_found", null))
                } 

                var open_bal_dr_xls = 0; 
                var close_bal_dr_xls = 0;
                var open_bal_cr_xls = 0; 
                var close_bal_cr_xls = 0;
                var dr_opening_total = 0; 
                var cr_opening_total =0;
                var open_bal = 0;
                var acc_pk_arr  = "";
                
                var _param          = [item.P_COMPANY, item.P_FR_DATE, item.P_FR_TO, item.P_ACC_PK,item.P_STATUS, p_acc_num, item.P_TCO_BUSPLACE_PK];
                var dt_TK  = await DBService.callProcCursor(_store, _param , p_language , p_crt_by); 
                if (dt_TK.length>0) 
                {
                    dt_TK = dt_TK;
                    if(p_acc_type == "D")
                    {
                        open_bal_dr_xls = dt_TK[0].OPENINGBALANCE;
                        close_bal_dr_xls = dt_TK[0].CLOSINGBALANCE;
                    }
                    else{
                        open_bal_cr_xls = dt_TK[0].OPENINGBALANCE;
                        close_bal_cr_xls = dt_TK[0].CLOSINGBALANCE;
                    }
                    dr_opening_total = dt_TK[0].DEBITBOOKAMOUNT;
                    cr_opening_total = dt_TK[0].CREDITBOOKAMOUNT;
                    open_bal = dt_TK[0].OB;
                } 
                else 
                {
                   // dt_Data = dt_Data;
                    return response.send(Utils.response(false, "no_data_found", null))
                } 
                //*****************Call Account PK*************** */
                /*var dt_ACC_PK  = await DBService.callProcCursor(_store_pk, _param_pk , p_language , p_crt_by); 
                var p_temp = "";
                for(var x = 0; x < dt_ACC_PK.length; x++)
                {
                    acc_pk_arr = acc_pk_arr + p_temp + dt_ACC_PK[x].PK;
                    p_temp = ",";
                }*/
                 /****************Call CIRCULARS******************/
                /*var dt_TT  = await DBService.callProcCursor(_circular, _param_TT , p_language , p_crt_by); 
                if (dt_TT.length>0) 
                {
                    dt_TT = dt_TT;
                } 
                else 
                {
                    //dt_TT = dt_TT;
                    return response.send(Utils.response(false, "no_data_found", null))
                } */
                /********* Read file excel ********/ 
                const templateFile  = Helpers.resourcesPath(_resourcesPath); 
                await workbook.xlsx.readFile(templateFile);
                var worksheet       = workbook.getWorksheet(1);
                /********* Write file excel ********/
                
                var _param_1  = [item.P_COMPANY, item.P_FR_DATE, item.P_FR_TO,  item.P_ACC_PK, open_bal, item.P_STATUS, item.P_CCY, item.P_TCO_BUSPLACE_PK];
                
                if(item.P_ENCLOSE == "Y")
                {
                    var dt_Data  = await DBService.callProcCursor(_store_confirm, _param_1 , p_language , p_crt_by); 
                }
                else{
                    var dt_Data  = await DBService.callProcCursor(_store_approve, _param_1 , p_language , p_crt_by); 
                }
                //Merge
                worksheet.mergeCells(4,1,4,7);// Title
                worksheet.mergeCells(5,1,5,7); //from - to date
                worksheet.mergeCells(9,1,9,3); //account name 
                worksheet.mergeCells(9,4,10,4); //account code
                worksheet.mergeCells(9,5,9,7); //Amount
                
                //INFOMATION COMPANY
                worksheet.getCell("A1").value = BIZ_NM;
                worksheet.getCell("A2").value = BIZ_ADD;
                worksheet.getCell("A3").value = "Tax code : " + BIZ_TAX;
                var _bookccy = item.P_BOOK_CCY;
                worksheet.getCell("F7").value = _bookccy;
                //thÃ´ng tÆ°
                /*var _lang = item.P_LANG;
                if(_lang == 'VIE'){
                    worksheet.getCell("F2").value =  dt_TT[0].V1 ;
                    worksheet.getCell("F3").value =  dt_TT[0].V2 ;
                }
                else{
                    worksheet.getCell("F2").value =  dt_TT[0].E1 ;
                    worksheet.getCell("F3").value =  dt_TT[0].E2 ;
                }*/
                worksheet.getCell("B6").value = dt_ACC[0].AC_CD + " " + dt_ACC[0].AC_NM;
                var FromDate = item.P_FR_DATE;
                var ToDate = item.P_FR_TO;
                var strFrDate = FromDate.substr(6,2) + "/"+ FromDate.substr(4,2)+ "/"+ FromDate.substr(0,4);
                var strToDate = ToDate.substr(6,2) + "/"+ ToDate.substr(4,2)+ "/"+ ToDate.substr(0,4);
                worksheet.getCell("A5").value = "From date : " + strFrDate + " To date : " + strToDate;
                //-------Fill Data----------------
                worksheet.getCell("G11").value = open_bal_dr_xls;
                worksheet.getCell("E13").value = dr_opening_total;
                worksheet.getCell("F13").value = cr_opening_total;
                worksheet.getCell("G14").value = close_bal_dr_xls;
            
                var pos = 12; 
                if(dt_Data.length>1)
                {
                        worksheet.duplicateRow(pos,dt_Data.length-1,true);
                }  
                for (var y = 0; y < dt_Data.length; y++) 
                {
                    var row_item = worksheet.getRow(pos);
                    row_item.getCell(1).value   = dt_Data[y].AC_NM;
                    row_item.getCell(2).value   = dt_Data[y].AC_KNM;
                    row_item.getCell(3).value   = dt_Data[y].AC_LNM;     
                    row_item.getCell(4).value   = dt_Data[y].AC_CD;
                    row_item.getCell(5).value   = dt_Data[y].TOTAL_DEBIT; 
                    row_item.getCell(6).value   = dt_Data[y].TOTAL_CREDIT; 
                    row_item.getCell(7).value   = dt_Data[y].CLOSINGBALANCE; 
                    row_item.getCell(8).value   = dt_Data[y].TR_ENCLOSE;  
                    pos = pos + 1; 
                    //row_item.commit();
                }  
                
                
                /********* Print file excel ********/
                const reportFile    = Helpers.tmpPath(file_new);
                await workbook.xlsx.writeFile(reportFile)
                return response.attachment( reportFile, file_new);
            }
        } 
        catch (e) 
        {
            Utils.Logger({ LVL: "error", MODULE: "Report", FUNC: "rpt_6045035_TRIAL_BALANCE_CASH", CONTENT: e.message })
           // return response.send(Utils.response(false, e.message, null))
           return response.send(null);
        }
    }
    /*########################################################## Report Bank statement books (2)  no11 ###########################################################################*/ 
    async rpt_6045035_BANK_STATEMNET_BK({ request, response, auth }) {
        try 
        { 
           /* P_RPT_ID: report_info.VAL1, P_RPT_URL: report_info.VAL2, P_RPT_FILE: report_info.VAL3,
            P_COMP_ID: company_info.PARTNER_ID, P_COMP_NM: company_info.TEXT, P_COMP_TAX: company_info.TAX_CODE, P_COMP_ADD: company_info.ADDR1,
            P_COMPANY: this.selectedCompany,P_ACC_PK: this.TAC_ABACCTCODE_PK, P_FR_DATE: this.from_date, P_FR_TO: this.to_date, 
            P_CCY: this.selectedCurrency, P_STATUS: this.selectedStatus, P_BOOK_CCY: this.txtBookCCY, P_CIRCULARS: this.selectedCircular, 
            P_PRINT_VOUCHER_NO : this.selectedPrintVoucherNo, P_LANG : this.selectedLanguage, P_BANK: this.selectedBank, P_ENCLOSE : this.l_enclone
            */
            /****************************** Get Param *********************************/
            let { para }        = request.get(['para']);
            /********* Parse pram to json ********/
            var item            = JSON.parse(para); 
            const user          = await auth.getUser() ;
            var COMP_ID         = item.P_COMP_ID, COMP_NM = item.P_COMP_NM, COMP_TAX = item.P_COMP_TAX, COMP_ADD = item.P_COMP_ADD;
            var BIZ_ID          = item.P_BIZ_ID , BIZ_NM  = item.P_BIZ_NM , BIZ_TAX  = item.P_BIZ_TAX , BIZ_ADD  = item.P_BIZ_ADD;
            const p_crt_by      = user.USER_ID;
            const p_language    = request.header("accept-language", "ENG");
            var file_nm         = [item.P_RPT_FILE];
            var file_type       = ".xlsx";
            var full_nm         = file_nm + file_type;
            var file_new        = file_nm + p_crt_by + file_type;
            var _resourcesPath  = [item.P_RPT_URL]+'/'+full_nm;
            var _store_acc      = "AC_RPT_6045035_ACCOUNT";
            var _store          = "AC_RPT_6045035_ACC_OPENING_2";
            //var _store_pk       = "AC_RPT_6045035_ACCOUNT_PK";
            var _store_confirm  = "AC_RPT_6045035_BANK_ST_CONFIRM";
            var _store_approve  = "AC_RPT_6045035_BANK_ST_APPROVE";
            var _circular       = "AC_SEL_GET_TT_BPL";
            var _param_acc      = [item.P_COMPANY, item.P_FR_DATE, item.P_FR_TO, item.P_ACC_PK, item.P_TCO_BUSPLACE_PK];
            var _param_pk       = [item.P_COMPANY, item.P_ACC_PK, item.P_TCO_BUSPLACE_PK];
            var _param_TT       = [item.P_CIRCULARS, item.P_TCO_BUSPLACE_PK];
            var v_no_title = "Mẫu số : S07-DN ", e_no_title = "Form No : S07-DN" , k_no_title = "양식번호 : S07-DN";
            var v_dvt = " Đơn vị tính", e_dvt = " Unit", k_dvt = " 단위";
            /***************************** Return failded ****************************/
            if (!user) 
            {
                return response.send(Utils.response(false, "Request failed!", null));
            } 
            /****************************** Begin call store and write excell *********/
            else 
            { 
                /********* Call store  ***************/ 
                var   p_acc_code  = "";
                var   p_acc_name  = "";
                var   p_acc_type  = "";
                var   p_dt_from   = "";
                var   p_dt_to     = "";
                var   p_acc_num   = "";
                var dt_ACC  = await DBService.callProcCursor(_store_acc, _param_acc , p_language , p_crt_by); 
                if (dt_ACC.length>0) 
                {
                    dt_ACC      = dt_ACC;
                    p_acc_code  = dt_ACC[0].AC_CD;
                    p_acc_name  = dt_ACC[0].AC_NM;
                    p_acc_type  = dt_ACC[0].DRCR_TYPE;
                    p_dt_from   = dt_ACC[0].FRM_DATE;
                    p_dt_to     = dt_ACC[0].T_DATE;
                    p_acc_num   = dt_ACC[0].DRCR_TYPE1;
                } 
                else 
                {
                    return response.send(Utils.response(false, "no_data_found", null))
                } 

                var open_bal_dr_xls = 0; 
                var close_bal_dr_xls = 0;
                var open_bal_cr_xls = 0; 
                var close_bal_cr_xls = 0;
                var dr_opening_total = 0; 
                var cr_opening_total =0;
                var open_bal = 0;
                var acc_pk_arr  = "";
                
                var _param          = [item.P_COMPANY, item.P_FR_DATE, item.P_FR_TO, item.P_ACC_PK,item.P_STATUS, p_acc_num, item.P_TCO_BUSPLACE_PK];
                var dt_TK  = await DBService.callProcCursor(_store, _param , p_language , p_crt_by); 
                if (dt_TK.length>0) 
                {
                    dt_TK = dt_TK;
                    open_bal_dr_xls = dt_TK[0].OPENINGBALANCE;
                    dr_opening_total = dt_TK[0].DEBITBOOKAMOUNT;
                    cr_opening_total = dt_TK[0].CREDITBOOKAMOUNT;
                    close_bal_dr_xls = dt_TK[0].CLOSINGBALANCE;
                    open_bal = dt_TK[0].OB;
                } 
                else 
                {
                   // dt_Data = dt_Data;
                    return response.send(Utils.response(false, "no_data_found", null))
                } 
                //*****************Call Account PK*************** */
                /*var dt_ACC_PK  = await DBService.callProcCursor(_store_pk, _param_pk , p_language , p_crt_by); 
                var p_temp = "";
                for(var x = 0; x < dt_ACC_PK.length; x++)
                {
                    acc_pk_arr = acc_pk_arr + p_temp + dt_ACC_PK[x].PK;
                    p_temp = ",";
                }*/
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
                var worksheet       = workbook.getWorksheet(1);
                /********* Write file excel ********/
                
                var _param_1  = [item.P_COMPANY, item.P_FR_DATE, item.P_FR_TO, item.P_ACC_PK, item.P_STATUS , open_bal, item.P_TCO_BUSPLACE_PK];
                
                if(item.P_PRINT_VOUCHER_NO == "2")
                {
                    var dt_Data  = await DBService.callProcCursor(_store_confirm, _param_1 , p_language , p_crt_by); 
                }
                else{
                    var dt_Data  = await DBService.callProcCursor(_store_approve, _param_1 , p_language , p_crt_by); 
                }
                //Merge
                worksheet.mergeCells(4,1,4,7);// Title
                worksheet.mergeCells(5,1,5,7); //from - to date
                worksheet.mergeCells(9,3,9,4); //account name 
                worksheet.mergeCells(9,7,9,9); //Amount
                
                //INFOMATION COMPANY
                worksheet.getCell("A1").value = BIZ_NM;
                worksheet.getCell("A2").value = BIZ_ADD;
                worksheet.getCell("A3").value = "Tax code : " + BIZ_TAX;
                var _bookccy = item.P_BOOK_CCY;
                worksheet.getCell("H7").value = _bookccy;

                var FromDate = item.P_FR_DATE;
                var ToDate = item.P_FR_TO;
                var strFrDate = FromDate.substr(6,2) + "/"+ FromDate.substr(4,2)+ "/"+ FromDate.substr(0,4);
                var strToDate = ToDate.substr(6,2) + "/"+ ToDate.substr(4,2)+ "/"+ ToDate.substr(0,4);
                // thông tư
                var _lang = item.P_LANG;
                if(_lang == 'VIE'){
                    worksheet.getCell("G1").value =  v_no_title ;
                    worksheet.getCell("G2").value =  dt_TT[0].V1 ;
                    worksheet.getCell("G3").value =  dt_TT[0].V2 ;
                    worksheet.getCell("A4").value = "SỔ TIỀN GỬI NGÂN HÀNG";
                    worksheet.getCell("A5").value = "Từ ngày " + strFrDate + " đến ngày " + strToDate;
                    worksheet.getCell("A6").value = "Tài khoản: ";
                    worksheet.getCell("C6").value = "Tên TK: ";
                    worksheet.getCell("G7").value = v_dvt;
                    //grid
                    // worksheet.mergeCells('A9', 'A10'); 
                    //worksheet.getCell("A9").value = "";
                    //worksheet.mergeCells('C9', 'D9'); 
                    worksheet.getCell("B9").value = "Ngày chứng từ";
                    worksheet.getCell("C9").value = "Chứng từ";
                    worksheet.getCell("C10").value = "Thu";
                    worksheet.getCell("D10").value = "Chi";
                    worksheet.getCell("E9").value = "Diễn giải";
                    worksheet.getCell("F9").value = "Description";
                    worksheet.getCell("G9").value = "Số tiền";
                    worksheet.getCell("G10").value = "THU";
                    worksheet.getCell("H10").value = "CHI";
                    worksheet.getCell("I10").value = "TỒN";
                    worksheet.getCell("J9").value = "Ghi chú";

                }
                else{
                    worksheet.getCell("G2").value =  dt_TT[0].E1 ;
                    worksheet.getCell("G3").value =  dt_TT[0].E2 ;
                    worksheet.getCell("A5").value = "From date " + strFrDate + " To date " + strToDate;
                }
                var _print = item.P_PRINT_VOUCHER_NO;
                if(_print == '2'){
                    if(_lang == 'VIE')
                    {
                        worksheet.getCell("A9").value ="Ngày tháng ghi sổ";
                        worksheet.getCell("E12").value = "SỐ DƯ ĐẦU KỲ";
                        worksheet.getCell("E14").value = "Tổng cộng số phát sinh trong kỳ";
                        worksheet.getCell("E15").value = "SỐ DƯ CUỐI KỲ";
                    }
                    else{
                        worksheet.getCell("A9").value ="Date";
                    }
                }
                else{
                    worksheet.getCell("A9").value ="Approve No" ;
                }
                worksheet.getCell("B6").value = dt_ACC[0].AC_CD;
                worksheet.getCell("D6").value = dt_ACC[0].AC_NM;
                //-------Fill Data----------------
                worksheet.getCell("I12").value = open_bal_dr_xls;
                worksheet.getCell("G14").value = dr_opening_total;
                worksheet.getCell("H14").value = cr_opening_total;
                worksheet.getCell("I15").value = close_bal_dr_xls;
            
                var pos = 13; 
                if(dt_Data.length>1)
                {
                        worksheet.duplicateRow(pos,dt_Data.length-1,true);
                }  
                for (var y = 0; y < dt_Data.length; y++) 
                {
                    var row_item = worksheet.getRow(pos);
                    row_item.getCell(1).value   = dt_Data[y].TR_DATE_FMT;
                    row_item.getCell(2).value   = dt_Data[y].TR_DATE; 
                    row_item.getCell(3).value   = dt_Data[y].VOUCHERNO_DEBIT;
                    row_item.getCell(4).value   = dt_Data[y].VOUCHERNO_CREDIT;     
                    row_item.getCell(5).value   = dt_Data[y].REMARK2;
                    row_item.getCell(6).value   = dt_Data[y].REMARK; 
                    row_item.getCell(7).value   = dt_Data[y].BOOK_AMT_DEBIT; 
                    row_item.getCell(8).value   = dt_Data[y].BOOK_AMT_CREDIT; 
                    row_item.getCell(9).value   = dt_Data[y].CLOSINGBALANCE;  
                    row_item.getCell(10).value  = dt_Data[y].PK; 
                    row_item.getCell(11).value  = dt_Data[y].TR_ENCLOSE; 
                    pos = pos + 1; 
                    //row_item.commit();
                }  
                /************sign */
                worksheet.mergeCells(pos+5,1,pos+5,2); 
                worksheet.mergeCells(pos+6,1,pos+6,2);   
                worksheet.mergeCells(pos+5,7,pos+5,9); 
                worksheet.mergeCells(pos+6,7,pos+6,9); 
                if(_lang === "VIE")
                {
                    worksheet.getCell(pos+3, 1).value = "Sổ có…. Trang , đánh số từ  trang 01 đến  trang……";
                }
                else{
                    worksheet.getCell(pos+3, 1).value = "Number of page:..., from... to...";
                }
                pos = pos + 5;

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
                                row_item.getCell(5).value = dt_Data_sign[i].VAL2; 
                                row_item.getCell(5).font.bold = true;
                                row_item.getCell(7).value = dt_Data_sign[i].VAL3;                         
                                row_item.getCell(7).font.bold = true;
                                row_item.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
                                row_item.getCell(5).alignment = { vertical: 'middle', horizontal: 'center' };
                                row_item.getCell(7).alignment = { vertical: 'middle', horizontal: 'center' };
                            }
                            
                            row_item = worksheet.getRow(pos +1 );   
                            if (dt_Data_sign[i].CODE =='VIE_SIG')
                            {
                                row_item.getCell(1).value = dt_Data_sign[i].VAL1; 
                                row_item.getCell(1).font.bold = false;
                                row_item.getCell(5).value = dt_Data_sign[i].VAL2; 
                                row_item.getCell(5).font.bold = false;
                                row_item.getCell(7).value = dt_Data_sign[i].VAL3; 
                                row_item.getCell(7).font.bold = false;
                                row_item.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
                                row_item.getCell(7).alignment = { vertical: 'middle', horizontal: 'center' };  
                                row_item.getCell(5).alignment = { vertical: 'middle', horizontal: 'center' };                        
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
                        }  
                        if(_lang == 'ENG' || _lang == 'ENG-KOR'|| _lang == 'ENG-VIE' )*/ 
                        else
                        {    row_item = worksheet.getRow(pos );
                            if (dt_Data_sign[i].CODE =='ENG')
                            {
                                row_item.getCell(1).value = dt_Data_sign[i].VAL1; 
                                row_item.getCell(1).font.bold = true;  
                                row_item.getCell(5).value = dt_Data_sign[i].VAL2; 
                                row_item.getCell(5).font.bold = true;                               
                                row_item.getCell(7).value = dt_Data_sign[i].VAL3;                         
                                row_item.getCell(7).font.bold = true;
                                row_item.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };   
                                row_item.getCell(5).alignment = { vertical: 'middle', horizontal: 'center' };   
                                row_item.getCell(7).alignment = { vertical: 'middle', horizontal: 'center' }; 
                                    
                            }
                            
                            row_item = worksheet.getRow(pos +1 );   
                            if (dt_Data_sign[i].CODE =='ENG_SIG')
                            {
                                row_item.getCell(1).value = dt_Data_sign[i].VAL1;                                
                                row_item.getCell(5).value = dt_Data_sign[i].VAL2; 
                                row_item.getCell(7).value = dt_Data_sign[i].VAL3;                             
                                row_item.getCell(1).font.bold = false;
                                row_item.getCell(5).font.bold = false;
                                row_item.getCell(7).font.bold = false;
                                row_item.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };   
                                row_item.getCell(5).alignment = { vertical: 'middle', horizontal: 'center' };   
                                row_item.getCell(7).alignment = { vertical: 'middle', horizontal: 'center' }; 

                            }    
                        }
                        if (dt_Data_sign[i].CODE =='NAME')
                        {
                            row_item = worksheet.getRow(pos +2 ); 
                            row_item.getCell(1).value = dt_Data_sign[i].VAL1; 
                            row_item.getCell(1).font.bold = false;
                            row_item.getCell(5).value = dt_Data_sign[i].VAL2; 
                            row_item.getCell(5).font.bold = false;
                            row_item.getCell(7).value = dt_Data_sign[i].VAL3;         
                            row_item.getCell(7).font.bold = false;
                            row_item.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };   
                            row_item.getCell(5).alignment = { vertical: 'middle', horizontal: 'center' };   
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
            Utils.Logger({ LVL: "error", MODULE: "Report", FUNC: "rpt_6045035_BANK_STATEMNET_BK", CONTENT: e.message })
           // return response.send(Utils.response(false, e.message, null))
           return response.send(null);
        }
    }      
}

module.exports = rpt6045035;