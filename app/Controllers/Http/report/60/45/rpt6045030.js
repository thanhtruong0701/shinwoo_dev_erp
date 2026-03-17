"use strict";
const Helpers = use("Helpers");
const Antl = use("Antl");
const Utils = use("Utils");
const DBService = use("DBService");
var Excel = use("exceljs");
var workbook = new Excel.Workbook();
class rpt6045030 {
  /*########################################################## Report JH ##################################################################################*/
  async rpt6045030_TB({ request, response, auth }) {
    try {
      /*P_RPT_ID: report_info.VAL1, P_RPT_FILE: report_info.VAL2,
            P_COMPANY: this.sel_Company, P_DT_MONTH: this.dt_mmyy, P_VAT_TYPE: this.sel_VatType, P_TAX_RATE: this.sel_TaxRate, 
            P_CURRENT_CCY: this.sel_Ccy, P_STATUS: this.sel_Status, P_CUST_PK: this.txt_Customer_PK, P_INVOICE_NO: this.txt_InvoiceNo,
            P_AC_CD: this.txt_ACC_CD, P_SEQ: this.txt_Seq, P_VOUCHER_NO: this.sel_VoucherType, P_BALANCE: this.sel_Banlance,
            P_DT_FR: this.dt_from, P_DT_TO: this.dt_to, P_BIZ: this.sel_Bizpalce, P_BOOK_CCY: this.txtBookCCY*/
      /****************************** Get Param *********************************/
      let { para } = request.get(["para"]);
      /********* Parse pram to json ********/

      var item = JSON.parse(para);
      const user = await auth.getUser();
      const p_crt_by = user.USER_ID;
      const p_language = request.header("accept-language", "ENG");
      var file_nm = [item.P_RPT_FILE];
      var file_type = ".xlsx";
      var full_nm = file_nm + file_type;
      var file_new = file_nm + p_crt_by + file_type;
      var _resourcesPath = [item.P_RPT_URL] + "/" + full_nm;
      var _COMP_ID = item.P_COMP_ID,
        _COMP_NM = item.P_COMP_NM,
        _COMP_TAX = item.P_COMP_TAX,
        _COMP_ADD = item.P_COMP_ADD;
      var _store = "AC_SEL_6045030_DETAIL_NOCACHE";
      var _param = [
        item.P_COMPANY,
        item.P_LANG,
        item.P_FR_DT,
        item.P_TO_DT,
        item.P_STATUS,
        item.P_LEVEL,
        item.P_POSSUM,
        item.P_ACCD,
        item.P_ACGROUP,
        item.P_CCY,
        item.P_EX_RATE,
        item.P_BK_RATE,
        item.P_UNIT,
        item.P_TCO_BUSPLACE_PK,
      ];
      var _store_m = "AC_SEL_6045030_MASTER";
      var _param_m = [item.P_COMPANY, item.P_TCO_BUSPLACE_PK];

      /***************************** Return failded ****************************/
      if (!user) {
        return response.send(Utils.response(false, "Request failed!", null));
      } else {
        /****************************** Begin call store and write excell *********/
        /********* Read file excel ********/
        const templateFile = Helpers.resourcesPath(_resourcesPath);
        await workbook.xlsx.readFile(templateFile);
        var worksheet = workbook.getWorksheet(1);
        /********* Write file excel ********/
        /*Set Header */
        //worksheet.getCell("B47").value = temp;
        // var _langauge = l_langauge[0];
        /********* Call store  ***************/
        var dt_Data = await DBService.callProcCursor(_store, _param, item.P_LANG, p_crt_by);
        if (dt_Data.length > 0) {
          dt_Data = dt_Data;
        } else {
          return response.send(Utils.response(false, "no_data_found", null));
        }

        /********* Call store sign ***************/
        var _ac_code = "EACAB031";
        var _store_sign = "ac_rpt_6045085_sign";
        var _param_sign = [item.P_COMPANY, _ac_code];
        var dt_Data_sign = await DBService.callProcCursor(_store_sign, _param_sign, item.P_LANG, p_crt_by);
        if (dt_Data_sign) {
          dt_Data_sign = dt_Data_sign;
        }
        /********* Call store _dictionary ***************/
        var _dictionary = await DBService.callProcCursor("GET_DICTIONARY_REPORT", null, item.P_LANG, p_crt_by);
        if (_dictionary.length > 0) {
          _dictionary = _dictionary;
        } else {
          _dictionary = [];
        }

        var dt_Data_m = await DBService.callProcCursor(_store_m, _param_m, item.P_LANG, p_crt_by);
        if (dt_Data_m.length > 0) {
          //dt_Data_m = dt_Data_m;

          var r_item = worksheet.getRow(1);
          // r_item.getCell(1).value = Utils.translate("COMPANY", _dictionary, item.P_LANG) + ": " + dt_Data_m[0].LOC_ID + " - " + dt_Data_m[0].LOC_NM;
          r_item.getCell(1).value = Utils.translate("COMPANY", _dictionary, item.P_LANG) + ": " +  dt_Data_m[0].LOC_NM; // VNG-304 fix
          r_item = worksheet.getRow(2);
          r_item.getCell(1).value = Utils.translate("TAX_CODE", _dictionary, item.P_LANG) + ": " + dt_Data_m[0].TAX_CD;
          r_item = worksheet.getRow(3);
          r_item.getCell(1).value = Utils.translate("ADDRESS", _dictionary, item.P_LANG) + ": " + dt_Data_m[0].ADDR_NM1;

          r_item = worksheet.getRow(4);
          r_item.getCell(1).value = Utils.translate("TRIAL_BALANCE", _dictionary, item.P_LANG);

          r_item = worksheet.getRow(5);

          var FromDate = item.P_FR_DT;
          var ToDate = item.P_TO_DT;
          var strFrDate = FromDate.substr(6, 2) + "/" + FromDate.substr(4, 2) + "/" + FromDate.substr(0, 4);
          var strToDate = ToDate.substr(6, 2) + "/" + ToDate.substr(4, 2) + "/" + ToDate.substr(0, 4);
          r_item.getCell(1).value = Utils.translate("FROM_DATE", _dictionary, item.P_LANG) + ": " + strFrDate + " " + Utils.translate("TO_DATE", _dictionary, item.P_LANG) + ": " + strToDate;

          r_item = worksheet.getRow(7);
          r_item.getCell(1).value = Utils.translate("ACCOUNT_CODE", _dictionary, item.P_LANG);
          r_item.getCell(2).value = Utils.translate("ACCOUNT_NM", _dictionary, item.P_LANG);
          r_item.getCell(3).value = Utils.translate("ACCOUNT_NM", _dictionary, item.P_LANG);
          r_item.getCell(4).value = Utils.translate("ACCOUNT_NM", _dictionary, item.P_LANG);
          r_item.getCell(5).value = Utils.translate("LEVEL", _dictionary, item.P_LANG);
          r_item.getCell(6).value = Utils.translate("OPENNING_BALANCE", _dictionary, item.P_LANG);
          r_item.getCell(8).value = Utils.translate("PERIOD_AMT", _dictionary, item.P_LANG);
          r_item.getCell(10).value = Utils.translate("ACCOUNT_AMT", _dictionary, item.P_LANG);
          r_item.getCell(12).value = Utils.translate("ENDING_BALANCE", _dictionary, item.P_LANG);
          r_item.getCell(14).value = Utils.translate("LEAF_YN", _dictionary, item.P_LANG);
          r_item = worksheet.getRow(8);
          r_item.getCell(6).value = Utils.translate("DEBIT", _dictionary, item.P_LANG);
          r_item.getCell(7).value = Utils.translate("CREDIT", _dictionary, item.P_LANG);
          r_item.getCell(8).value = Utils.translate("DEBIT", _dictionary, item.P_LANG);
          r_item.getCell(9).value = Utils.translate("CREDIT", _dictionary, item.P_LANG);
          r_item.getCell(10).value = Utils.translate("DEBIT", _dictionary, item.P_LANG);
          r_item.getCell(11).value = Utils.translate("CREDIT", _dictionary, item.P_LANG);
          r_item.getCell(12).value = Utils.translate("DEBIT", _dictionary, item.P_LANG);
          r_item.getCell(13).value = Utils.translate("CREDIT", _dictionary, item.P_LANG);
        } else {
          //return response.send(Utils.response(false, "no_data_found", null))

          var r_item = worksheet.getRow(1);
          r_item.getCell(1).value = Utils.translate("COMPANY", _dictionary, item.P_LANG) + ": " + _COMP_ID + " - " + _COMP_NM;
          r_item = worksheet.getRow(2);
          r_item.getCell(1).value = Utils.translate("TAX_CODE", _dictionary, item.P_LANG) + ": " + _COMP_TAX;
          r_item = worksheet.getRow(3);
          r_item.getCell(1).value = Utils.translate("ADDRESS", _dictionary, item.P_LANG) + ": " + _COMP_ADD;

          r_item = worksheet.getRow(4);
          r_item.getCell(1).value = Utils.translate("TRIAL_BALANCE", _dictionary, item.P_LANG);

          r_item = worksheet.getRow(5);

          var FromDate = item.P_FR_DT;
          var ToDate = item.P_TO_DT;
          var strFrDate = FromDate.substr(6, 2) + "/" + FromDate.substr(4, 2) + "/" + FromDate.substr(0, 4);
          var strToDate = ToDate.substr(6, 2) + "/" + ToDate.substr(4, 2) + "/" + ToDate.substr(0, 4);
          r_item.getCell(1).value = Utils.translate("FROM_DATE", _dictionary, item.P_LANG) + ": " + strFrDate + " " + Utils.translate("TO_DATE", _dictionary, item.P_LANG) + ": " + strToDate;

          r_item = worksheet.getRow(7);
          r_item.getCell(1).value = Utils.translate("ACCOUNT_CODE", _dictionary, item.P_LANG);
          r_item.getCell(2).value = Utils.translate("ACCOUNT_NM", _dictionary, item.P_LANG);
          r_item.getCell(3).value = Utils.translate("ACCOUNT_NM", _dictionary, item.P_LANG);
          r_item.getCell(4).value = Utils.translate("ACCOUNT_NM", _dictionary, item.P_LANG);
          r_item.getCell(5).value = Utils.translate("LEVEL", _dictionary, item.P_LANG);
          r_item.getCell(6).value = Utils.translate("OPENNING_BALANCE", _dictionary, item.P_LANG);
          r_item.getCell(8).value = Utils.translate("PERIOD_AMT", _dictionary, item.P_LANG);
          r_item.getCell(10).value = Utils.translate("ACCOUNT_AMT", _dictionary, item.P_LANG);
          r_item.getCell(12).value = Utils.translate("ENDING_BALANCE", _dictionary, item.P_LANG);
          r_item.getCell(14).value = Utils.translate("LEAF_YN", _dictionary, item.P_LANG);
          r_item = worksheet.getRow(8);
          r_item.getCell(6).value = Utils.translate("DEBIT", _dictionary, item.P_LANG);
          r_item.getCell(7).value = Utils.translate("CREDIT", _dictionary, item.P_LANG);
          r_item.getCell(8).value = Utils.translate("DEBIT", _dictionary, item.P_LANG);
          r_item.getCell(9).value = Utils.translate("CREDIT", _dictionary, item.P_LANG);
          r_item.getCell(10).value = Utils.translate("DEBIT", _dictionary, item.P_LANG);
          r_item.getCell(11).value = Utils.translate("CREDIT", _dictionary, item.P_LANG);
          r_item.getCell(12).value = Utils.translate("DEBIT", _dictionary, item.P_LANG);
          r_item.getCell(13).value = Utils.translate("CREDIT", _dictionary, item.P_LANG);
        }
        const l_langauge = item.P_LANG;
        switch (l_langauge) {
          case "VIE":
            worksheet.getCell("A5").value = "Từ tháng : " + strFrDate + " đến tháng : " + strToDate;
            worksheet.getColumn(2).hidden = true;
            worksheet.getColumn(4).hidden = true;
            break;
          case "KOR":
            worksheet.getCell("A5").value = "일자 : " + strFrDate + " ~ " + strToDate;
            worksheet.getColumn(2).hidden = true;
            worksheet.getColumn(3).hidden = true;
            break;
          case "ENG":
            worksheet.getCell("A5").value = "From month : " + strFrDate + " To month : " + strToDate;
            worksheet.getColumn(3).hidden = true;
            worksheet.getColumn(4).hidden = true;
            break;
          case "KOR-VIE":
            //   worksheet.getCell("A5").value = "From month : " + strFrDate + " To month : " + strToDate;
            worksheet.getColumn(2).hidden = true;
            break;
          case "ENG-VIE":
            //     worksheet.getCell("A5").value = "From month : " + strFrDate + " To month : " + strToDate;
            worksheet.getColumn(4).hidden = true;
            break;
          case "ENG-KOR":
            //   worksheet.getCell("A5").value = "From month : " + strFrDate + " To month : " + strToDate;
            worksheet.getColumn(3).hidden = true;
            break;
        }

        let _leaf_YN = item.P_ACGROUP;
        let _bookccy = item.P_BOOK_CCY;
        var _formatAmt = _bookccy == "VND" ? '_(* #,##0_);[Red]* (#,##0);_(* "-"_);_(@_)' : '_(* #,##0.00_);[Red]* (#,##0.00);_(* "-"_);_(@_)';
        var pos = 9;
        var total_dr_open = 0;
        var total_cr_open = 0;
        var total_dr_sum = 0;
        var total_cr_sum = 0;
        var total_acc_dr = 0;
        var total_acc_cr = 0;
        var total_dr_end = 0;
        var total_cr_end = 0;
        if (dt_Data.length > 1) {
          worksheet.duplicateRow(pos, dt_Data.length - 1, true);
        }
        for (var i = 0; i < dt_Data.length; i++) {
          var row_item = worksheet.getRow(pos);

          row_item.getCell(1).value = dt_Data[i].AC_CD;
          // row_item.getCell(2).value = (item.P_LANG == 'ENG')?dt_Data[i].AC_NM:(item.P_LANG == 'KOR')?dt_Data[i].AC_FNM:dt_Data[i].AC_LNM;
          row_item.getCell(2).value = dt_Data[i].AC_NM;
          row_item.getCell(3).value = dt_Data[i].AC_LNM;
          row_item.getCell(4).value = dt_Data[i].AC_FNM;
          row_item.getCell(5).value = dt_Data[i].AC_LEVEL;
          row_item.getCell(6).value = dt_Data[i].OPEN_DR;
          row_item.getCell(7).value = dt_Data[i].OPEN_CR;
          row_item.getCell(8).value = dt_Data[i].DR_SUM;
          row_item.getCell(9).value = dt_Data[i].CR_SUM;
          row_item.getCell(10).value = dt_Data[i].ACC_DR_SUM;
          row_item.getCell(11).value = dt_Data[i].ACC_CR_SUM;
          row_item.getCell(12).value = dt_Data[i].END_DR;
          row_item.getCell(13).value = dt_Data[i].END_CR;

          for (var j = 6; j < 13; j++) {
            row_item.getCell(j).numFmt = _formatAmt;
          }
          if (_leaf_YN === "ALL" || _leaf_YN === "BAL-PER") {
            row_item.getCell(14).value = dt_Data[i].LEAF_YN;
          }
          let l_count = dt_Data.length - 1;
          /*[vng-154/dvg] modify==*/
          if (l_count > 0) {
            total_dr_open = Number(dt_Data[l_count].TT_OPENING_DR);
            total_cr_open = Number(dt_Data[l_count].TT_OPENING_CR);
            total_dr_sum = Number(dt_Data[l_count].TT_PERIOD_DR);
            total_cr_sum = Number(dt_Data[l_count].TT_PERIOD_CR);
            total_acc_dr = Number(dt_Data[l_count].TT_ACC_DR);
            total_acc_cr = Number(dt_Data[l_count].TT_ACC_CR);
            total_dr_end = Number(dt_Data[l_count].TT_ENDING_DR);
            total_cr_end = Number(dt_Data[l_count].TT_ENDING_CR);
          }
          // if(dt_Data[l_count].AC_CD == "A00000"){

          //     total_dr_open = Number(dt_Data[l_count].OPEN_DR);
          //     total_cr_open = Number(dt_Data[l_count].OPEN_CR);
          //     total_dr_sum  = Number(dt_Data[l_count].DR_SUM);
          //     total_cr_sum  = Number(dt_Data[l_count].CR_SUM);
          //     total_acc_dr  = Number(dt_Data[l_count].ACC_DR_SUM);
          //     total_acc_cr  = Number(dt_Data[l_count].ACC_CR_SUM);
          //     total_dr_end  = Number(dt_Data[l_count].END_DR);
          //     total_cr_end  = Number(dt_Data[l_count].END_CR);
          // }
          // else{
          //         total_dr_open += Number(dt_Data[i].OPEN_DR);
          //         total_cr_open += Number(dt_Data[i].OPEN_CR);
          //         total_dr_sum  += Number(dt_Data[i].DR_SUM);
          //         total_cr_sum  += Number(dt_Data[i].CR_SUM);
          //         total_acc_dr  += Number(dt_Data[i].ACC_DR_SUM);
          //         total_acc_cr  += Number(dt_Data[i].ACC_CR_SUM);
          //         total_dr_end  += Number(dt_Data[i].END_DR);
          //         total_cr_end  += Number(dt_Data[i].END_CR);
          // }
          // if (item.P_POSSUM == "%") {
          //     if (_leaf_YN == "Posting" || _leaf_YN == "POSTING") {
          //         total_dr_open = total_dr_open + Number(dt_Data[i].OPEN_DR);
          //         total_cr_open = total_cr_open + Number(dt_Data[i].OPEN_CR);
          //         total_dr_sum  = total_dr_sum  + Number(dt_Data[i].DR_SUM);
          //         total_cr_sum  = total_cr_sum  + Number(dt_Data[i].CR_SUM);
          //         total_acc_dr  = total_acc_dr  + Number(dt_Data[i].ACC_DR_SUM);
          //         total_acc_cr  = total_acc_cr  + Number(dt_Data[i].ACC_CR_SUM);
          //         total_dr_end  = total_dr_end  + Number(dt_Data[i].END_DR);
          //         total_cr_end  = total_cr_end  + Number(dt_Data[i].END_CR);
          //     }
          // } else {
          //     total_dr_open += Number(dt_Data[i].OPEN_DR);
          //     total_cr_open += Number(dt_Data[i].OPEN_CR);
          //     total_dr_sum  += Number(dt_Data[i].DR_SUM);
          //     total_cr_sum  += Number(dt_Data[i].CR_SUM);
          //     total_acc_dr  += Number(dt_Data[i].ACC_DR_SUM);
          //     total_acc_cr  += Number(dt_Data[i].ACC_CR_SUM);
          //     total_dr_end  += Number(dt_Data[i].END_DR);
          //     total_cr_end  += Number(dt_Data[i].END_CR);
          // }

          pos = pos + 1;
          //row_item.getCell(12).value = dt_Data[i].BOLD_YN;
          //row_item.getCell(13).value = dt_Data[i].COLOR_CD;
          /*if(dt_Data[i].BOLD_YN == 'B')
                    {
                        for(var j =1; j<12; j++)
                        {
                                const _font = { family: 4, bold: true  }
                                row_item.getCell(j).font =  _font;
                                row_item.getCell(j).fill = {type: 'pattern', pattern:'solid', bgColor:{argb: dt_Data[i].COLOR_CD.replace('#','')}};
                        } 
                    }*/
        }
        worksheet.mergeCells(pos, 1, pos, 5);
        var row = worksheet.getRow(pos);
        if (l_langauge == "VIE") {
          row.getCell(1).value = "Tổng";
        }
        row.getCell(6).value = total_dr_open;
        row.getCell(7).value = total_cr_open;
        row.getCell(8).value = total_dr_sum;
        row.getCell(9).value = total_cr_sum;
        row.getCell(10).value = total_acc_dr;
        row.getCell(11).value = total_acc_cr;
        row.getCell(12).value = total_dr_end;
        row.getCell(13).value = total_cr_end;
        for (var z = 6; z < 13; z++) {
          row.getCell(z).numFmt = _formatAmt;
        }

        pos = pos + 2;

        if (dt_Data_sign.length > 1) {
          for (var x = 0; x < dt_Data_sign.length; x++) {
            if (l_langauge == "VIE") {
              row_item = worksheet.getRow(pos);
              if (dt_Data_sign[x].CODE == "VIE") {
                row_item.getCell(1).value = dt_Data_sign[x].VAL1;
                row_item.getCell(1).font = { bold: true, italic: false };
                // row_item.getCell(4).value = dt_Data_sign[x].VAL2;
                // row_item.getCell(4).font.bold = true;
                row_item.getCell(8).value = dt_Data_sign[x].VAL3;
                row_item.getCell(8).font.bold = true;
                row_item.getCell(1).alignment = { vertical: "middle", horizontal: "center" };
                //row_item.getCell(4).alignment = { vertical: 'middle', horizontal: 'center' };
                row_item.getCell(8).alignment = { vertical: "middle", horizontal: "center" };
              }

              row_item = worksheet.getRow(pos + 1);
              if (dt_Data_sign[x].CODE == "VIE_SIG") {
                row_item.getCell(1).value = dt_Data_sign[x].VAL1;
                row_item.getCell(1).font.bold = false;
                // row_item.getCell(4).value = dt_Data_sign[x].VAL2;
                // row_item.getCell(4).font.bold = false;
                row_item.getCell(8).value = dt_Data_sign[x].VAL3;
                row_item.getCell(8).font.bold = false;
                row_item.getCell(1).alignment = { vertical: "middle", horizontal: "center" };
                row_item.getCell(8).alignment = { vertical: "middle", horizontal: "center" };
                // row_item.getCell(4).alignment = { vertical: 'middle', horizontal: 'center' };
              }
            } else {
              /* if(l_langauge == 'KOR' || l_langauge == 'KOR-VIE')
                        {
                            row_item = worksheet.getRow(pos ); 
                            if (dt_Data_sign[x].CODE =='KOR')
                            {
                                row_item.getCell(1).value = dt_Data_sign[x].VAL1; 
                                row_item.getCell(1).font.bold = true;    
                                row_item.getCell(4).value = dt_Data_sign[x].VAL2; 
                                row_item.getCell(4).font.bold = true;
                                row_item.getCell(8).value = dt_Data_sign[x].VAL3;                         
                                row_item.getCell(8).font.bold = true;
                                row_item.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' }; 
                                row_item.getCell(4).alignment = { vertical: 'middle', horizontal: 'center' };  
                                row_item.getCell(8).alignment = { vertical: 'middle', horizontal: 'center' };   
 
                            }
                            
                            row_item = worksheet.getRow(pos +1 );   
                            if (dt_Data_sign[x].CODE =='KOR_SIG')
                            {
                                row_item.getCell(1).value = dt_Data_sign[x].VAL1; 
                                row_item.getCell(1).font.bold = false;
                                row_item.getCell(4).value = dt_Data_sign[x].VAL2; 
                                row_item.getCell(4).font.bold = false;  
                                row_item.getCell(8).value = dt_Data_sign[x].VAL3;
                                row_item.getCell(8).font.bold = false;
                                row_item.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };     
                                row_item.getCell(8).alignment = { vertical: 'middle', horizontal: 'center' };    
                                row_item.getCell(4).alignment = { vertical: 'middle', horizontal: 'center' };                            
                            }   
                        }if(l_langauge == 'ENG' || l_langauge == 'ENG-KOR'|| l_langauge == 'ENG-VIE' )*/
              row_item = worksheet.getRow(pos);
              if (dt_Data_sign[x].CODE == "ENG") {
                row_item.getCell(1).value = dt_Data_sign[x].VAL1;
                row_item.getCell(1).font.bold = true;
                //  row_item.getCell(4).value = dt_Data_sign[x].VAL2;
                //  row_item.getCell(4).font.bold = true;
                row_item.getCell(8).value = dt_Data_sign[x].VAL3;
                row_item.getCell(8).font.bold = true;
                row_item.getCell(1).alignment = { vertical: "middle", horizontal: "center" };
                // row_item.getCell(4).alignment = { vertical: 'middle', horizontal: 'center' };
                row_item.getCell(8).alignment = { vertical: "middle", horizontal: "center" };
              }

              row_item = worksheet.getRow(pos + 1);
              if (dt_Data_sign[x].CODE == "ENG_SIG") {
                row_item.getCell(1).value = dt_Data_sign[x].VAL1;
                // row_item.getCell(4).value = dt_Data_sign[x].VAL2;
                row_item.getCell(8).value = dt_Data_sign[x].VAL3;
                row_item.getCell(1).font.bold = false;
                //  row_item.getCell(4).font.bold = false;
                row_item.getCell(8).font.bold = false;
                row_item.getCell(1).alignment = { vertical: "middle", horizontal: "center" };
                // row_item.getCell(4).alignment = { vertical: 'middle', horizontal: 'center' };
                row_item.getCell(8).alignment = { vertical: "middle", horizontal: "center" };
              }
            }
            if (dt_Data_sign[x].CODE == "NAME") {
              row_item = worksheet.getRow(pos + 2);
              row_item.getCell(1).value = dt_Data_sign[x].VAL1;
              row_item.getCell(1).font.bold = false;
              // row_item.getCell(4).value = dt_Data_sign[x].VAL2;
              // row_item.getCell(4).font.bold = false;
              row_item.getCell(8).value = dt_Data_sign[x].VAL3;
              row_item.getCell(8).font.bold = false;
              row_item.getCell(1).alignment = { vertical: "middle", horizontal: "center" };
              // row_item.getCell(4).alignment = { vertical: 'middle', horizontal: 'center' };
              row_item.getCell(8).alignment = { vertical: "middle", horizontal: "center" };
            }
          }
        }

        /********* Print file excel ********/
        const reportFile = Helpers.tmpPath(file_new);
        await workbook.xlsx.writeFile(reportFile);
        return response.attachment(reportFile, file_new);
      }
    } catch (e) {
      return response.send(Utils.response(false, e.message, null));
    }
  }
}

module.exports = rpt6045030;
