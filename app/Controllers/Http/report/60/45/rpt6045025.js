"use strict";
const Helpers = use('Helpers')
const Antl = use("Antl");
const Utils = use("Utils");
const DBService = use("DBService")
var Excel = use('exceljs');
var workbook = new Excel.Workbook();
class rpt6045025 {
    /*########################################################## Report JH ##################################################################################*/
    async rpt6045025_AS_FORM({ request, response, auth }) {
        try {
            /*
            P_RPT_ID: report_info.VAL1, P_RPT_URL: report_info.VAL2, P_RPT_FILE: report_info.VAL3,
            P_COMP_ID: company_info.PARTNER_ID, P_COMP_NM: company_info.TEXT, P_COMP_TAX: company_info.TAX_CODE, P_COMP_ADD: company_info.ADDR1,
            P_COMPANY: this.selectedCompany,P_ACC_PK: this.txtAccountPK, P_FR_DATE: this.from_date, P_FR_TO: this.to_date, 
            P_CCY: this.selectedCurrency, P_STATUS: this.selectedStatus, P_BOOK_CCY: this.txtBookCCY, P_CIRCULARS: this.selectedCirculars, 
            P_PRINT_VOUCHER_NO : this.selectedPrintVoucherNo, P_OPTION: this.selectedOptionListGLDT, P_POST_SUM : this.selectedPostSum, 
            P_AMT_TYPE: this.selectedAmtType, P_LANG : this.selectedLanguage, P_DATE_NOW: this.datetime, P_ENCLOSE : this.l_enclone, 
            P_VOUCHER_NO : this.txtVoucherNo, P_SEQ : this.txtSeq
            */
            /****************************** Get Param *********************************/
            let { para } = request.get(['para']);
            /********* Parse pram to json ********/
            var item = JSON.parse(para);
            const user = await auth.getUser();
            var COMP_ID = item.P_COMP_ID, COMP_NM = item.P_COMP_NM, COMP_TAX = item.P_COMP_TAX, COMP_ADD = item.P_COMP_ADD;
            var BIZ_ID = item.P_BIZ_ID, BIZ_NM = item.P_BIZ_NM, BIZ_TAX = item.P_BIZ_TAX, BIZ_ADD = item.P_BIZ_ADD;
            const p_crt_by = user.USER_ID;
            const p_language = request.header("accept-language", "ENG");
            var file_nm = [item.P_RPT_FILE];
            var file_type = ".xlsx";
            var full_nm = file_nm + file_type;
            var file_new = file_nm + p_crt_by + file_type;
            var _resourcesPath = [item.P_RPT_URL] + '/' + full_nm;
            var _store = "AC_RPT_6045025_AS_FORM";
            var _store_title = "AC_RPT_6045035_TITLE_DT_2";
            var _param = [item.P_COMPANY, item.P_ACC_PK, item.P_FR_DATE, item.P_FR_TO, item.P_STATUS, item.P_CCY, item.P_VOUCHER_NO, item.P_SEQ, item.P_TCO_BUSPLACE_PK, item.P_LANG];
            /***************************** Return failded ****************************/
            if (!user) {
                return response.send(Utils.response(false, "Request failed!", null));
            }
            /****************************** Begin call store and write excell *********/
            else
                /********* Call store infomation tltle ***************/
                var _param_title = [item.P_COMPANY, item.P_FR_DATE, item.P_FR_TO, item.P_BOOK_CCY, item.P_TCO_BUSPLACE_PK, item.P_LANG];
            var dt_Title = await DBService.callProcCursor(_store_title, _param_title, p_language, p_crt_by);
            /********* Read file excel ********/
            const templateFile = Helpers.resourcesPath(_resourcesPath);
            await workbook.xlsx.readFile(templateFile);
            var worksheet = workbook.getWorksheet(1);
            /********* Write file excel ********/
            /********* Call partner store  ***************/
            console.log('start get db', new Date().toLocaleString())
            var dt_Data = await DBService.callProcCursor(_store, _param, p_language, p_crt_by);
            console.log('end get db', new Date().toLocaleString())
            var pos_title = 0;
            var _lang = item.P_LANG;
            var acc_info = "";
            var ac_code = "";
            var ac_name = "";
            if (dt_Data.length > 0) {
                for (var i = 0; i < dt_Data.length; i++) {
                    dt_Data = dt_Data;
                    if (dt_Data[i].ACC_INFO != acc_info || i == 0) {
                        acc_info = dt_Data[i].ACC_INFO;
                        ac_code = dt_Data[i].AC_CD;
                        if (i > 0) {
                            worksheet = workbook.addWorksheet();
                        }
                        //worksheet.name = 'Sheet'; 

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
                        worksheet.mergeCells(pos_title, 16, pos_title, 18);// merge MS
                        row_title.getCell(16).font = { italic: false, bold: true, color: { argb: '000000' }, name: 'Times New Roman' };
                        row_title.getCell(16).alignment = { vertical: 'middle', horizontal: 'center' };
                        pos_title = pos_title + 1;
                        row_title = worksheet.getRow(pos_title);
                        row_title.getCell(1).value = dt_Title[0].BIZ_TAX_A2; // biz tax code
                        row_title.getCell(16).value = dt_Title[0].EV_H2; // Thong tu
                        worksheet.mergeCells(pos_title, 16, pos_title, 18);// Thong tu
                        pos_title = pos_title + 1;
                        row_title = worksheet.getRow(pos_title);
                        row_title.getCell(1).value = dt_Title[0].BIZ_ADD_A3; // Address
                        row_title.getCell(16).value = dt_Title[0].EV_H3; // Thong tu
                        worksheet.mergeCells(pos_title, 16, pos_title, 18);// Thong tu
                        pos_title = pos_title + 1;
                        row_title = worksheet.getRow(pos_title);
                        row_title.height = 30;
                        row_title.getCell(1).value = dt_Title[0].TITLE_A4; // Title
                        row_title.getCell(1).font = { italic: false, bold: true, color: { argb: '000000' }, size: 18, name: 'Times New Roman' };
                        row_title.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
                        worksheet.mergeCells(pos_title, 1, pos_title, 25);// Title
                        pos_title = pos_title + 1;
                        row_title = worksheet.getRow(pos_title);
                        row_title.getCell(1).value = dt_Title[0].DATE_TOFRM_A5; // from date - todate
                        row_title.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
                        row_title.getCell(1).font = { italic: false, bold: false, color: { argb: '000000' }, size: 10, name: 'Times New Roman' };
                        worksheet.mergeCells(pos_title, 1, pos_title, 25);// from date - todate
                        pos_title = pos_title + 1;
                        row_title = worksheet.getRow(pos_title);
                        row_title.getCell(1).value = _lang == 'VIE' ? 'Tài khoản :' + acc_info : 'Account code :' + acc_info; // account
                        row_title.getCell(1).font = { italic: false, bold: true, color: { argb: '000000' }, size: 10, name: 'Times New Roman' };
                        pos_title = pos_title + 1;
                        row_title = worksheet.getRow(pos_title);
                        row_title.getCell(12).value = dt_Title[0].DVT_L11; // unit
                        row_title.getCell(12).font = { italic: false, bold: true, color: { argb: '000000' }, size: 10, name: 'Times New Roman' };
                        row_title.getCell(12).alignment = { vertical: 'middle', horizontal: 'right' };

                        //bảng
                        pos_title = pos_title + 2;//9
                        row_title = worksheet.getRow(pos_title);
                        pos_title = pos_title + 1;//10
                        var row_title_10 = worksheet.getRow(pos_title);

                        row_title.getCell(1).value = dt_Title[0].A9_10; // date - ngày tháng năm row 9-10
                        row_title.getCell(2).value = dt_Title[0].BC9_9; // voucher
                        row_title_10.getCell(2).value = dt_Title[0].B10; // voucher no
                        row_title_10.getCell(3).value = dt_Title[0].C10; // voucher date
                        row_title.getCell(4).value = dt_Title[0].D9_10; //Local Description 
                        row_title.getCell(5).value = dt_Title[0].E9_10; // Description
                        row_title.getCell(6).value = dt_Title[0].F9_10; // Debit account Code
                        row_title.getCell(7).value = dt_Title[0].G9_10; //Credit account Code

                        row_title.getCell(8).value = dt_Title[0].H9_10;//Exchange Rate

                        row_title.getCell(9).value = dt_Title[0].IJ9; // Amount   
                        row_title_10.getCell(9).value = dt_Title[0].I10; // Debit 
                        row_title_10.getCell(10).value = dt_Title[0].J10; // Credit 
                        row_title.getCell(11).value = dt_Title[0].K9_10; // Balance 
                        row_title.getCell(12).value = dt_Title[0].LM9; // Amount 
                        row_title_10.getCell(12).value = dt_Title[0].L10; // Amount Debit Trans
                        row_title_10.getCell(13).value = dt_Title[0].M10; // Amount Credit Trans
                        row_title.getCell(14).value = dt_Title[0].N9_10; // Balance Trans
                        row_title.getCell(15).value = dt_Title[0].O9_10; // Tỷ giá
                        row_title.getCell(16).value = dt_Title[0].P9; // Remart
                        row_title_10.getCell(16).value = dt_Title[0].P10; // Remart

                        row_title.getCell(17).value = dt_Title[0].QR9; //Partner  
                        row_title_10.getCell(17).value = dt_Title[0].Q10; //Partner Code 
                        row_title_10.getCell(18).value = dt_Title[0].R10; //Partner Name 

                        row_title.getCell(19).value = dt_Title[0].ST9; //Partner  Offset
                        row_title_10.getCell(19).value = dt_Title[0].S10; //Partner Code Offset
                        row_title_10.getCell(20).value = dt_Title[0].T10; //Partner Name Offset


                        row_title.getCell(21).value = dt_Title[0].UV9; // PL
                        row_title_10.getCell(21).value = dt_Title[0].U10; // PL Code
                        row_title_10.getCell(22).value = dt_Title[0].V10; // PL Name

                        row_title.getCell(23).value = dt_Title[0].W9_10; //Unclose 
                        row_title.getCell(24).value = dt_Title[0].X9_10; //Debit account Name 
                        row_title.getCell(25).value = dt_Title[0].Y9_10; //Credit account Name  
                        row_title.getCell(26).value = dt_Title[0].Z9_10; //Serial No  
                        row_title.getCell(27).value = dt_Title[0].AA9_10; //Inv Date  
                        row_title.getCell(28).value = dt_Title[0].AB9_10; //Inv No
                        row_title.getCell(29).value = dt_Title[0].AC9_10; //C.Inv No 


                        //-------------------Merger-------------------------
                        worksheet.mergeCells(pos_title - 1, 1, pos_title, 1); //date - ngày tháng năm  9-10
                        worksheet.mergeCells(pos_title - 1, 2, pos_title - 1, 3); //voucher  9-9
                        worksheet.mergeCells(pos_title - 1, 4, pos_title, 4); //Local Description  9-10
                        worksheet.mergeCells(pos_title - 1, 5, pos_title, 5); //Description  9-10
                        worksheet.mergeCells(pos_title - 1, 6, pos_title, 6); //Debit account Code 9-10
                        worksheet.mergeCells(pos_title - 1, 7, pos_title, 7); //Credit account Code  9-10
                        worksheet.mergeCells(pos_title - 1, 8, pos_title, 8); //Exchange Rate 9-10

                        worksheet.mergeCells(pos_title - 1, 9, pos_title - 1, 10); //Amount  9-9
                        worksheet.mergeCells(pos_title - 1, 11, pos_title, 11); //Balance  9-10
                        worksheet.mergeCells(pos_title - 1, 12, pos_title - 1, 13); //Amount  9-9
                        worksheet.mergeCells(pos_title - 1, 14, pos_title, 14); //Balance 9-10
                        worksheet.mergeCells(pos_title - 1, 15, pos_title, 15); //Tỷ giá 9-10

                        worksheet.mergeCells(pos_title - 1, 17, pos_title - 1, 18); //Partner   9-9
                        worksheet.mergeCells(pos_title - 1, 19, pos_title - 1, 20); //Partner  Offset  9-9
                        worksheet.mergeCells(pos_title - 1, 21, pos_title - 1, 22); //PL  9-9



                        worksheet.mergeCells(pos_title - 1, 23, pos_title, 23); //Unclose  9-10
                        worksheet.mergeCells(pos_title - 1, 24, pos_title, 24); //Debit account Name  9-10
                        worksheet.mergeCells(pos_title - 1, 25, pos_title, 25); //Credit account Name   9-10
                        worksheet.mergeCells(pos_title - 1, 26, pos_title, 26); //Serial No  9-10
                        worksheet.mergeCells(pos_title - 1, 27, pos_title, 27); //Inv Date   9-10
                        worksheet.mergeCells(pos_title - 1, 28, pos_title, 28); //Inv No  9-10
                        worksheet.mergeCells(pos_title - 1, 29, pos_title, 29); //C.Inv No  9-10

                        for (let j = 1; j <= 29; j++) {
                            row_title.getCell(j).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "D9D9D9" } };
                            row_title.getCell(j).alignment = { vertical: 'middle', horizontal: 'center' };
                            row_title.getCell(j).font = { italic: false, bold: true, color: { argb: '000000' }, size: 10, name: 'Times New Roman' };
                            row_title.getCell(j).border = {
                                top: { style: 'thin', color: { argb: 'A6A6A6' } },
                                left: { style: 'thin', color: { argb: 'A6A6A6' } },
                                bottom: { style: 'thin', color: { argb: 'A6A6A6' } },
                                right: { style: 'thin', color: { argb: 'A6A6A6' } }
                            };

                            row_title_10.getCell(j).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "D9D9D9" } };
                            row_title_10.getCell(j).font = { italic: false, bold: true, color: { argb: '000000' }, size: 10, name: 'Times New Roman' };
                            row_title_10.getCell(j).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
                            row_title_10.getCell(j).border = {
                                top: { style: 'thin', color: { argb: 'A6A6A6' } },
                                left: { style: 'thin', color: { argb: 'A6A6A6' } },
                                bottom: { style: 'thin', color: { argb: 'A6A6A6' } },
                                right: { style: 'thin', color: { argb: 'A6A6A6' } }
                            };
                        }

                    }

                    //-------Fill Data----------------  
                    pos_title = pos_title + 1;
                    var _bookccy = item.P_BOOK_CCY;
                    var row_item = worksheet.getRow(pos_title);
                    var l_exrate = 0;
                    var _formatAmt = (_bookccy == 'VND' ? '_(* #,##0_);_(* (#,##0);_(* "-"_);_(@_)' : '_(* #,##0.00_);_(* (#,##0.00);_(* "-"_);_(@_)');
                    var _format_2 = '_(* #,##0.00_);_(* (#,##0.00);_(* "-"_);_(@_)';

                    if (dt_Data[i].TOTAL_DEBIT != "" && dt_Data[i].TOTAL_FDEBIT != "" && dt_Data[i].TOTAL_FDEBIT != 0) {
                        l_exrate = dt_Data[i].TR_RATE;
                    }
                    else {
                        l_exrate = Number(dt_Data[i].CLOSINGBALANCE) / Number(dt_Data[i].FCLOSINGBALANCE);//dt_Data[y].TR_RATE;
                    }

                    row_item.getCell(1).value = dt_Data[i].TR_DATE;
                    row_item.getCell(2).value = dt_Data[i].VOUCHERNO;
                    row_item.getCell(3).value = dt_Data[i].VOUCHER_DT;
                    row_item.getCell(4).value = dt_Data[i].REMARK;
                    row_item.getCell(5).value = dt_Data[i].REMARK2;
                    row_item.getCell(6).value = dt_Data[i].ACC_DR;
                    row_item.getCell(7).value = dt_Data[i].ACC_CR;
                    row_item.getCell(8).value = dt_Data[i].TR_RATE;
                    row_item.getCell(8).numFmt = '_(* #,##0_);_(* (#,##0);_(* "-"_);_(@_)';
                    worksheet.getCell(pos_title, 8).alignment = { vertical: 'middle', horizontal: 'right' };
                    row_item.getCell(9).value = dt_Data[i].PS_DEBIT;
                    row_item.getCell(9).numFmt = _formatAmt;
                    worksheet.getCell(pos_title, 9).alignment = { vertical: 'middle', horizontal: 'right' };
                    row_item.getCell(10).value = dt_Data[i].PS_CREDIT;
                    row_item.getCell(10).numFmt = _formatAmt;
                    worksheet.getCell(pos_title, 10).alignment = { vertical: 'middle', horizontal: 'right' };
                    row_item.getCell(11).value = dt_Data[i].CLOSINGBALANCE;
                    row_item.getCell(11).numFmt = _formatAmt;
                    worksheet.getCell(pos_title, 11).alignment = { vertical: 'middle', horizontal: 'right' };
                    row_item.getCell(12).value = dt_Data[i].PS_FDEBIT;
                    row_item.getCell(12).numFmt = _format_2;
                    worksheet.getCell(pos_title, 12).alignment = { vertical: 'middle', horizontal: 'right' };
                    row_item.getCell(13).value = dt_Data[i].PS_FCREDIT;
                    row_item.getCell(13).numFmt = _format_2;
                    worksheet.getCell(pos_title, 13).alignment = { vertical: 'middle', horizontal: 'right' };
                    row_item.getCell(14).value = dt_Data[i].FCLOSINGBALANCE;
                    row_item.getCell(14).numFmt = _format_2;
                    worksheet.getCell(pos_title, 14).alignment = { vertical: 'middle', horizontal: 'right' };
                    row_item.getCell(15).value = l_exrate;
                    row_item.getCell(15).numFmt = _formatAmt;
                    worksheet.getCell(pos_title, 15).alignment = { vertical: 'middle', horizontal: 'right' };
                    row_item.getCell(16).value = dt_Data[i].TAC_HGTRH_PK;

                    row_item.getCell(17).value = dt_Data[i].PARTNER_ID;
                    row_item.getCell(18).value = dt_Data[i].PARTNER_NAME;
                    row_item.getCell(19).value = dt_Data[i].PARTNER_ID_OFFSET;
                    row_item.getCell(20).value = dt_Data[i].PARTNER_NAME_OFFSET;
                    row_item.getCell(21).value = dt_Data[i].PL_CD;
                    row_item.getCell(22).value = dt_Data[i].PL_NM;

                    row_item.getCell(23).value = "";
                    row_item.getCell(24).value = dt_Data[i].ACNM_DR;
                    worksheet.getCell(pos_title, 24).alignment = { vertical: 'middle', horizontal: 'center', shrinkToFit: true };
                    row_item.getCell(25).value = dt_Data[i].ACNM_CR;
                    worksheet.getCell(pos_title, 25).alignment = { vertical: 'middle', horizontal: 'center', shrinkToFit: true };

                    row_item.getCell(26).value = dt_Data[i].SERIAL_NO;
                    row_item.getCell(27).value = dt_Data[i].INVOICE_DT;
                    row_item.getCell(28).value = dt_Data[i].INVOICE_NO;
                    row_item.getCell(29).value = dt_Data[i].C_INVOICE_NO;
                    for (let j = 1; j <= 29; j++) {
                        row_item.getCell(j).border = {
                            top: { style: 'thin', color: { argb: 'A6A6A6' } },
                            left: { style: 'thin', color: { argb: 'A6A6A6' } },
                            bottom: { style: 'thin', color: { argb: 'A6A6A6' } },
                            right: { style: 'thin', color: { argb: 'A6A6A6' } }
                        };
                        row_item.getCell(j).font = { color: { argb: '000000' }, size: 10, name: 'Times New Roman' };
                    }
                    if (dt_Data[i].ORD === 'O' || dt_Data[i].ORD === 'T' || dt_Data[i].ORD === 'E') {
                        row_item.getCell(5).font = { italic: false, bold: true, size: 10, color: { argb: '000000' }, name: 'Times New Roman' };
                        worksheet.getCell(pos_title, 5).alignment = { vertical: 'middle', horizontal: 'center' };
                        row_item.getCell(9).font = { italic: false, bold: true, size: 10, color: { argb: '000000' }, name: 'Times New Roman' };
                        row_item.getCell(10).font = { italic: false, bold: true, size: 10, color: { argb: '000000' }, name: 'Times New Roman' };
                        row_item.getCell(11).font = { italic: false, bold: true, size: 10, color: { argb: '000000' }, name: 'Times New Roman' };
                        row_item.getCell(12).font = { italic: false, bold: true, size: 10, color: { argb: '000000' }, name: 'Times New Roman' };
                        row_item.getCell(13).font = { italic: false, bold: true, size: 10, color: { argb: '000000' }, name: 'Times New Roman' };
                        row_item.getCell(14).font = { italic: false, bold: true, size: 10, color: { argb: '000000' }, name: 'Times New Roman' };
                    }
                    if (dt_Data[i].ORD === 'E') {
                        pos_title = pos_title + 2;
                        row_title = worksheet.getRow(pos_title);
                        row_title.getCell(1).value = dt_Title[0].DATE_I20; //
                        row_title.getCell(1).font = { italic: false, bold: false, color: { argb: '000000' }, size: 10, name: 'Times New Roman' };
                        pos_title = pos_title + 2;
                        row_title = worksheet.getRow(pos_title);
                        row_title.getCell(1).value = dt_Title[0].EV_A21; // Prepared by
                        row_title.getCell(1).font = { italic: false, bold: true, color: { argb: '000000' }, size: 10, name: 'Times New Roman' };
                        worksheet.mergeCells(pos_title, 1, pos_title, 2);// 
                        row_title.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
                        row_title.getCell(6).value = dt_Title[0].EV_E21; // Chief Account
                        row_title.getCell(6).font = { italic: false, bold: true, color: { argb: '000000' }, size: 10, name: 'Times New Roman' };
                        row_title.getCell(6).alignment = { vertical: 'middle', horizontal: 'center' };
                        worksheet.mergeCells(pos_title, 6, pos_title, 8);// 
                        row_title.getCell(12).value = dt_Title[0].EV_I21; // General Director
                        row_title.getCell(12).font = { italic: false, bold: true, color: { argb: '000000' }, size: 10, name: 'Times New Roman' };
                        worksheet.mergeCells(pos_title, 12, pos_title, 14);// 
                        row_title.getCell(12).alignment = { vertical: 'middle', horizontal: 'center' };
                        // sign,fullname  
                        pos_title = pos_title + 1;
                        row_title = worksheet.getRow(pos_title);
                        row_title.getCell(1).value = dt_Title[0].EV_SIG_A21; // Prepared by
                        row_title.getCell(1).font = { italic: true, bold: false, color: { argb: '000000' }, size: 10, name: 'Times New Roman' };
                        worksheet.mergeCells(pos_title, 1, pos_title, 2);// 
                        row_title.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
                        row_title.getCell(6).value = dt_Title[0].EV_SIG_E21; // Chief Account
                        row_title.getCell(6).font = { italic: true, bold: false, color: { argb: '000000' }, size: 10, name: 'Times New Roman' };
                        row_title.getCell(6).alignment = { vertical: 'middle', horizontal: 'center' };
                        worksheet.mergeCells(pos_title, 6, pos_title, 8);// 
                        row_title.getCell(12).value = dt_Title[0].EV_SIG_I21; // General Director
                        row_title.getCell(12).font = { italic: true, bold: false, color: { argb: '000000' }, size: 10, name: 'Times New Roman' };
                        worksheet.mergeCells(pos_title, 12, pos_title, 14);// 
                        row_title.getCell(12).alignment = { vertical: 'middle', horizontal: 'center' };
                    }
                }
            }

            /********* Print file excel ********/
            const reportFile = Helpers.tmpPath(file_new);
            console.log('start write file', new Date().toLocaleString())
            await workbook.xlsx.writeFile(reportFile)
            console.log('start get download', new Date().toLocaleString())
            return response.attachment(reportFile, file_new);

        }
        catch (e) {
            console.log(e)
            Utils.Logger({ LVL: "error", MODULE: "Report", FUNC: "rpt6045025_AS_FORM", CONTENT: e.message })
            // return response.send(Utils.response(false, e.message, null))
            return response.send(e.message);
        }
    }
}

module.exports = rpt6045025;