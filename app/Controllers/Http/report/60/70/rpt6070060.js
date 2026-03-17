"use strict";

const { DATE } = require("oracledb");

const Helpers = use("Helpers");
const Antl = use("Antl");
const Utils = use("Utils");
const DBService = use("DBService");
var Excel = use("exceljs");
var workbook = new Excel.Workbook();
class rpt6070060 {
  /*########################################################## Report ##################################################################################*/
  async rpt6070060_ListOfAssetDerp_2({ request, response, auth }) {
    try {
      /* P_RPT_ID: report_info.VAL1, P_RPT_URL: report_info.VAL2, P_RPT_FILE: report_info.VAL3,
            P_COMP_ID: company_info.PARTNER_ID, P_COMP_NM: company_info.TEXT, P_COMP_TAX: company_info.TAX_CODE, P_COMP_ADD: company_info.ADDR1,
            P_COMPANY: this.sel_Company, P_FR_DATE: this.dt_from, P_FR_TO: this.dt_to, P_KIND_CODE: this.sel_Kind, P_DERT : this.txt_Depar_pk,
            P_STATUS: this.sel_Status, P_ASSET_TYPE : this.sel_Assettype, P_ACC_CD : this.txt_AssetAC_cd, P_LANG : this.sel_Lang, P_BOOK_CCY : this.txt_Bookccy
              */
      /****************************** Get Param *********************************/
      let { para } = request.get(["para"]);
      /********* Parse pram to json ********/
      var item = JSON.parse(para);
      const user = await auth.getUser();
      var COMP_ID = item.P_COMP_ID,
        COMP_NM = item.P_COMP_NM,
        COMP_TAX = item.P_COMP_TAX,
        COMP_ADD = item.P_COMP_ADD;
      const p_crt_by = user.USER_ID;
      const p_language = request.header("accept-language", "ENG");
      var file_nm = [item.P_RPT_FILE];
      var file_type = ".xlsx";
      var full_nm = file_nm + file_type;
      var file_new = file_nm + p_crt_by + file_type;
      var _resourcesPath = [item.P_RPT_URL] + "/" + full_nm;
      var _store = "AC_RPT_6070060_1";
      var _store_kind = "SYS_SEL_COMMON_CODE";
      var _param = [item.P_COMPANY, item.P_FR_DATE, item.P_FR_TO, item.P_KIND_CODE, item.P_DERT, item.P_STATUS, item.P_ASSET_TYPE, item.P_ACC_CD, item.P_TCO_BUSPLACE_PK, item.P_LANG];
      var _param_kind = [item.P_COMPANY, "ACDF0010"];
      /***************************** Return failded ****************************/
      if (!user) {
        return response.send(Utils.response(false, "Request failed!", null));
      } else {
      /****************************** Begin call store and write excell *********/
        /********* Call store  ***************/
        var dt_Data = await DBService.callProcCursor(_store, _param, p_language, p_crt_by);
        if (dt_Data.length > 0) {
          dt_Data = dt_Data;
        } else {
          return response.send(Utils.response(false, "no_data_found", null));
        }

        /********* Call store  kind code***************/
        var dt_Kind_Code = await DBService.callProcCursor(_store_kind, _param_kind, p_language, p_crt_by);
        if (dt_Kind_Code.length > 0) {
          dt_Kind_Code = dt_Kind_Code;
        } else {
          return response.send(Utils.response(false, "no_data_found", null));
        }

        var _dictionary = await DBService.callProcCursor("GET_DICTIONARY_REPORT", null, p_language, p_crt_by);
        if (_dictionary.length > 0) {
          _dictionary = _dictionary;
        } else {
          _dictionary = [];
        }
        /********* Read file excel ********/
        const templateFile = Helpers.resourcesPath(_resourcesPath);
        await workbook.xlsx.readFile(templateFile);
        var worksheet = workbook.getWorksheet(1);
        /********* Write file excel ********/

        //INFOMATION COMPANY
        worksheet.getCell("A1").value = COMP_NM;
        worksheet.getCell("A2").value = COMP_ADD;
        worksheet.getCell("A3").value = Utils.translate("rpt_tax_code", _dictionary, item.P_LANG) + COMP_TAX;
        var FromDate = item.P_FR_DATE;
        // var ToDate = item.P_FR_TO;
        var strFrDate = FromDate.substr(4, 2) + "/" + FromDate.substr(0, 4);
        // var strToDate = ToDate.substr(6,2) + "/"+ ToDate.substr(4,2)+ "/"+ ToDate.substr(0,4);
        worksheet.getCell("A5").value = dt_Data[0].PRINT_MONTH;
        worksheet.getCell("L7").value = Utils.translate("rpt_opening", _dictionary, item.P_LANG) + "(" + strFrDate + ")";
        worksheet.getCell("A4").value = Utils.translate("rpt_title", _dictionary, item.P_LANG);

        worksheet.getCell("B7").value = Utils.translate("rpt_seq", _dictionary, item.P_LANG);
        worksheet.getCell("C7").value = Utils.translate("rpt_fa_cd", _dictionary, item.P_LANG);
        worksheet.getCell("D7").value = Utils.translate("rpt_fa_fname", _dictionary, item.P_LANG);
        worksheet.getCell("E7").value = Utils.translate("rpt_fa_lname", _dictionary, item.P_LANG);
        worksheet.getCell("F7").value = Utils.translate("rpt_qty", _dictionary, item.P_LANG);
        worksheet.getCell("G7").value = Utils.translate("rpt_dept", _dictionary, item.P_LANG);
        worksheet.getCell("H7").value = Utils.translate("rpt_use_place", _dictionary, item.P_LANG);
        worksheet.getCell("I7").value = Utils.translate("rpt_use_date", _dictionary, item.P_LANG);
        worksheet.getCell("J7").value = Utils.translate("rpt_depr_date", _dictionary, item.P_LANG);
        worksheet.getCell("K7").value = Utils.translate("rpt_org_date", _dictionary, item.P_LANG);

        worksheet.getCell("L7").value = Utils.translate("rpt_estimate_life_month", _dictionary, item.P_LANG);
        worksheet.getCell("M7").value = Utils.translate("rpt_opening", _dictionary, item.P_LANG);
        worksheet.getCell("M8").value = Utils.translate("rpt_original_cost", _dictionary, item.P_LANG);
        worksheet.getCell("N8").value = Utils.translate("rpt_accu_amt", _dictionary, item.P_LANG);
        worksheet.getCell("O7").value = Utils.translate("rpt_remain", _dictionary, item.P_LANG);
        worksheet.getCell("O8").value = Utils.translate("rpt_new_asset", _dictionary, item.P_LANG);
        worksheet.getCell("P8").value = Utils.translate("rpt_new_asset", _dictionary, item.P_LANG);
        worksheet.getCell("Q7").value = Utils.translate("rpt_replace", _dictionary, item.P_LANG);
        worksheet.getCell("Q8").value = Utils.translate("rpt_liquidation", _dictionary, item.P_LANG);
        worksheet.getCell("R8").value = Utils.translate("rpt_decrese_orig", _dictionary, item.P_LANG);
        worksheet.getCell("S7").value = Utils.translate("rpt_decrese_accu", _dictionary, item.P_LANG);

        worksheet.getCell("T7").value = Utils.translate("rpt_depr_amt_this_month", _dictionary, item.P_LANG);
        worksheet.getCell("U7").value = Utils.translate("rpt_ending", _dictionary, item.P_LANG);
        worksheet.getCell("U8").value = Utils.translate("rpt_original_cost", _dictionary, item.P_LANG);
        worksheet.getCell("V8").value = Utils.translate("rpt_accu_amt", _dictionary, item.P_LANG);
        worksheet.getCell("W7").value = Utils.translate("rpt_remain", _dictionary, item.P_LANG);
        worksheet.getCell("X7").value = Utils.translate("rpt_asset_acc", _dictionary, item.P_LANG);
        worksheet.getCell("Y7").value = Utils.translate("rpt_depr_acc", _dictionary, item.P_LANG);
        worksheet.getCell("Z7").value = Utils.translate("rpt_expense_acc", _dictionary, item.P_LANG);
        worksheet.getCell("AA7").value = Utils.translate("rpt_depr_month", _dictionary, item.P_LANG);
        worksheet.getCell("AB7").value = Utils.translate("rpt_depreciated_end_date", _dictionary, item.P_LANG);
        worksheet.getCell("AB8").value = Utils.translate("rpt_pl", _dictionary, item.P_LANG);
        worksheet.getCell("AC8").value = Utils.translate("rpt_pl_cd", _dictionary, item.P_LANG);
        worksheet.getCell("AD7").value = Utils.translate("rpt_pl_nm", _dictionary, item.P_LANG);

        worksheet.getCell("AE7").value = Utils.translate("rpt_group_code", _dictionary, item.P_LANG);
        worksheet.getCell("AF7").value = Utils.translate("rpt_group_nm", _dictionary, item.P_LANG);
        worksheet.getCell("AG7").value = Utils.translate("rpt_prod_date", _dictionary, item.P_LANG);
        worksheet.getCell("AH7").value = Utils.translate("rpt_origin", _dictionary, item.P_LANG);
        worksheet.getCell("AI7").value = Utils.translate("rpt_model", _dictionary, item.P_LANG);
        worksheet.getCell("AJ7").value = Utils.translate("rpt_unit", _dictionary, item.P_LANG);
        worksheet.getCell("AK7").value = Utils.translate("rpt_partner_cd", _dictionary, item.P_LANG);
        worksheet.getCell("AL8").value = Utils.translate("rpt_partner_nm", _dictionary, item.P_LANG);
        worksheet.getCell("AM8").value = Utils.translate("rpt_inv_date", _dictionary, item.P_LANG);
        worksheet.getCell("AN8").value = Utils.translate("rpt_inv_no", _dictionary, item.P_LANG);

        var pos = 9;
        //var pos_total = pos +  dt_Data.length ;
        var row_num = 0;

        if (dt_Data.length > 1) {
          // worksheet.duplicateRow(pos,dt_Data.length-1,true);
          Utils.excelInsertRows(worksheet, pos, dt_Data.length - 1);
        }
        for (var i = 0; i < dt_Data.length; i++) {
          if (dt_Data[i].FA_CD != "") {
            row_num = row_num + 1;
          }

          var row_item = worksheet.getRow(pos + i);
          //pos_total = pos_total + 1;
          row_item.getCell(1).value = dt_Data[i].DEPR_YN;
          row_item.getCell(2).value = row_num;
          row_item.getCell(3).value = dt_Data[i].FA_CD;
          row_item.getCell(4).value = dt_Data[i].FA_NM;
          row_item.getCell(5).value = dt_Data[i].FA_LNM;
          if (dt_Data[i].QTY != "") {
            row_item.getCell(6).value = dt_Data[i].QTY;
          }
          row_item.getCell(7).value = dt_Data[i].PLACE;
          row_item.getCell(8).value = dt_Data[i].LOCATION;
          row_item.getCell(9).value = dt_Data[i].FA_USE_DATE;
          row_item.getCell(10).value = dt_Data[i].FA_DEPR_DATE;
          row_item.getCell(11).value = dt_Data[i].FA_DEPR_DATE_ORG;
          if (dt_Data[i].MONTHS != "") {
            row_item.getCell(12).value = dt_Data[i].MONTHS;
          }
          if (dt_Data[i].ORIGIN_AMT != "") {
            row_item.getCell(13).value = dt_Data[i].ORIGIN_AMT;
          }
          if (dt_Data[i].BEGIN_ACC_AMT != "") {
            row_item.getCell(14).value = dt_Data[i].BEGIN_ACC_AMT;
          }
          if (dt_Data[i].BEGIN_REMAIN_AMT != "") {
            row_item.getCell(15).value = dt_Data[i].BEGIN_REMAIN_AMT;
          }
          if (dt_Data[i].NEW_PUR_AMT != "") {
            row_item.getCell(16).value = dt_Data[i].NEW_PUR_AMT;
          }
          if (dt_Data[i].SUB_ACC_AMT != "") {
            row_item.getCell(17).value = dt_Data[i].SUB_ACC_AMT;
          }
          if (dt_Data[i].DIS_ORG_AMT != "") {
            row_item.getCell(18).value = dt_Data[i].DIS_ORG_AMT;
          }
          if (dt_Data[i].DIS_ACC_AMT != "") {
            row_item.getCell(19).value = dt_Data[i].DIS_ACC_AMT;
          }
          if (dt_Data[i].DEPR_PERIOD_AMT != "") {
            row_item.getCell(20).value = dt_Data[i].DEPR_PERIOD_AMT;
          }
          if (dt_Data[i].END_ORG_AMT != "") {
            row_item.getCell(21).value = dt_Data[i].END_ORG_AMT;
          }
          if (dt_Data[i].END_ACC_AMT != "") {
            row_item.getCell(22).value = dt_Data[i].END_ACC_AMT;
          }
          if (dt_Data[i].END_REMAIN_AMT != "") {
            row_item.getCell(23).value = dt_Data[i].END_REMAIN_AMT;
          }
          row_item.getCell(24).value = dt_Data[i].FA_ACC_CD;
          row_item.getCell(25).value = dt_Data[i].DEPR_ACC_CD;
          row_item.getCell(26).value = dt_Data[i].EXP_ACC_CD;
          if (dt_Data[i].DEPR_MONTH_AMT != "") {
            row_item.getCell(27).value = dt_Data[i].DEPR_MONTH_AMT;
          }

          row_item.getCell(29).value = dt_Data[i].PL_CD;
          row_item.getCell(30).value = dt_Data[i].PL_NM;

          row_item.getCell(31).value = dt_Data[i].GROUP_CODE;
          row_item.getCell(32).value = dt_Data[i].GROUP_NM;
          row_item.getCell(33).value = dt_Data[i].MADE_YEAR;
          row_item.getCell(34).value = dt_Data[i].ORIGIN;
          row_item.getCell(35).value = dt_Data[i].MODEL;
          row_item.getCell(36).value = dt_Data[i].UNIT;
          row_item.getCell(37).value = dt_Data[i].SUPPLIER_CD;
          row_item.getCell(38).value = dt_Data[i].SUPPLIER_NM;
          row_item.getCell(39).value = dt_Data[i].INV_DATE;
          row_item.getCell(40).value = dt_Data[i].INV_NO;
          //var total_row = row_item + i;

          let _l_ORD = dt_Data[i].ORD;
          let _l_DEPR_YN = dt_Data[i].DEPR_YN;
          let _l_KIND = dt_Data[i].FA_KIND_CD;
          let _l_FACD = dt_Data[i].FA_CD;
          if (
            (_l_ORD === "" || _l_ORD == undefined || _l_ORD == null) &&
            (_l_DEPR_YN === "" || _l_DEPR_YN == undefined || _l_DEPR_YN == null) &&
            (_l_KIND === "" || _l_KIND == undefined || _l_KIND == null) &&
            (_l_FACD === "" || _l_FACD == undefined || _l_FACD == null)
          ) {
            row_item.getCell(2).value = "";
            row_item.getCell(3).value = Utils.translate("rpt_grand_total", _dictionary, item.P_LANG);
            row_item.getCell(11).value = "";
          } else if (
            (_l_ORD === "" || _l_ORD == undefined || _l_ORD == null) &&
            _l_DEPR_YN != "" &&
            (_l_KIND === "" || _l_KIND == undefined || _l_KIND == null) &&
            (_l_FACD === "" || _l_FACD == undefined || _l_FACD == null)
          ) {
            row_item.getCell(2).value = "";
            row_item.getCell(3).value = Utils.translate("rpt_total", _dictionary, item.P_LANG);
            row_item.getCell(11).value = "";
            /*  if(row_item.getCell(3).value   = "Total:")
                        {
                            var bg_total = worksheet.getRow(3);
                            bg_total.getCell(3).fill = {
                            type: 'pattern', 
                            pattern:'solid', 
                            bgColor:{argb: 'b8f6b9'}, 
                            bgColor:{argb:'b8f6b9'}};
                        }*/
          } else if (_l_ORD != "" && _l_DEPR_YN != "" && _l_KIND != "" && (_l_FACD === "" || _l_FACD == undefined || _l_FACD == null)) {
            row_item.getCell(2).value = "";
            row_item.getCell(3).value = Utils.translate("rpt_sub_total", _dictionary, item.P_LANG);
            row_item.getCell(11).value = "";
            for (var y = 0; y < dt_Kind_Code.length; y++) {
              var l_code_grp_kind = dt_Kind_Code[y].CODE;
              var l_name_grp_kind = dt_Kind_Code[y].NAME;
              if (dt_Data[i].FA_KIND_CD == l_code_grp_kind) {
                row_item.getCell(5).Value = l_name_grp_kind;
              }
            }
          }
          //pos = pos + 1;
          //row_item.commit();
        }
        /********* Print file excel ********/
        const reportFile = Helpers.tmpPath(file_new);
        await workbook.xlsx.writeFile(reportFile);
        return response.attachment(reportFile, file_new);
      }
    } catch (e) {
      Utils.Logger({ LVL: "error", MODULE: "Report", FUNC: "rpt6070060_ListOfAssetDerp_2", CONTENT: e.message });
      // return response.send(Utils.response(false, e.message, null))
      return response.send(null);
    }
  }
  async rpt6070060_ListOfAssetDerp_2_TKTS({ request, response, auth }) {
    try {
      /* P_RPT_ID: report_info.VAL1, P_RPT_URL: report_info.VAL2, P_RPT_FILE: report_info.VAL3,
            P_COMP_ID: company_info.PARTNER_ID, P_COMP_NM: company_info.TEXT, P_COMP_TAX: company_info.TAX_CODE, P_COMP_ADD: company_info.ADDR1,
            P_COMPANY: this.sel_Company, P_FR_DATE: this.dt_from, P_FR_TO: this.dt_to, P_KIND_CODE: this.sel_Kind, P_DERT : this.txt_Depar_pk,
            P_STATUS: this.sel_Status, P_ASSET_TYPE : this.sel_Assettype, P_ACC_CD : this.txt_AssetAC_cd, P_LANG : this.sel_Lang, P_BOOK_CCY : this.txt_Bookccy
            P_BIZ_ID: BizPlace_info.NAME, P_BIZ_NM: BizPlace_info.LOC_NM, P_BIZ_TAX: BizPlace_info.TAX_CD, P_BIZ_ADD: BizPlace_info.ADDR_NM1,P_NOT_PARA : l_not_para
              */
      /****************************** Get Param *********************************/
      let { para } = request.get(["para"]);
      /********* Parse pram to json ********/
      var item = JSON.parse(para);
      const user = await auth.getUser();
      var COMP_ID = item.P_COMP_ID,
        COMP_NM = item.P_COMP_NM,
        COMP_TAX = item.P_COMP_TAX,
        COMP_ADD = item.P_COMP_ADD;
      var BIZ_ID = item.P_BIZ_ID,
        BIZ_NM = item.P_BIZ_NM,
        BIZ_TAX = item.P_BIZ_TAX,
        BIZ_ADD = item.P_BIZ_ADD;
      const p_crt_by = user.USER_ID;
      const p_language = request.header("accept-language", "ENG");
      var file_nm = [item.P_RPT_FILE];
      var file_type = ".xlsx";
      var full_nm = file_nm + file_type;
      var file_new = file_nm + p_crt_by + file_type;
      var _resourcesPath = [item.P_RPT_URL] + "/" + full_nm;
      var _store = "AC_RPT_6070060_ALL_TK_TOOL";
      var _store_detail = "AC_RPT_6070060_DETAIL_TK";
      // _circular       = "AC_SEL_GET_TT_BPL";
      var _param = [item.P_NOT_PARA];
      //var _param_TT       = [item.P_CIRCULARS, item.P_TCO_BUSPLACE_PK];
      /***************************** Return failded ****************************/
      if (!user) {
        return response.send(Utils.response(false, "Request failed!", null));
      } else {
      /****************************** Begin call store and write excell *********/
        /********* Call store  ***************/
        var dt_TK = await DBService.callProcCursor(_store, _param, p_language, p_crt_by);
        if (dt_TK.length > 0) {
          dt_TK = dt_TK;
        } else {
          return response.send(Utils.response(false, "no_data_found", null));
        }
        /****************Call CIRCULARS******************/
        // var dt_TT  = await DBService.callProcCursor(_circular, _param_TT , p_language , p_crt_by);
        // if (dt_TT.length>0)
        // {
        //     dt_TT = dt_TT;
        // }
        // else
        // {
        //     //dt_TT = dt_TT;
        //     return response.send(Utils.response(false, "no_data_found", null))
        // }
        /********* Read file excel ********/
        const templateFile = Helpers.resourcesPath(_resourcesPath);
        await workbook.xlsx.readFile(templateFile);
        var worksheet_1 = workbook.getWorksheet(1);
        /********* Write file excel ********/
        var account_code = "";
        var l_count = 0;

        for (var i = 0; i < dt_TK.length; i++) {
          //var row_item = worksheet.getRow(pos);
          account_code = dt_TK[i].AC_CODE;
          var _param_1 = [item.P_FR_DATE, item.P_FR_TO, item.P_COMPANY, item.P_KIND_CODE, item.P_DERT, item.P_STATUS, item.P_ASSET_TYPE, account_code];

          var dt_Data = await DBService.callProcCursor(_store_detail, _param_1, p_language, p_crt_by);
          if (dt_Data.length > 0) {
            let worksheet = workbook.addWorksheet();
            worksheet.model = worksheet_1.model;
            l_count = 1;
            worksheet.name = account_code;

            //Merge
            worksheet.mergeCells(4, 1, 4, 29); // Title VIE
            worksheet.mergeCells(5, 1, 4, 29); // Title ENG
            worksheet.mergeCells(5, 1, 5, 29); //from - to date

            worksheet.mergeCells(8, 1, 9, 1); //No
            worksheet.mergeCells(8, 2, 9, 2); //code
            worksheet.mergeCells(8, 3, 9, 3); //name ccdc EN
            worksheet.mergeCells(8, 4, 9, 4); // name ccdc VIE
            worksheet.mergeCells(8, 5, 9, 5); // qty
            worksheet.mergeCells(8, 6, 9, 6); // dept
            worksheet.mergeCells(8, 7, 9, 7); //use place
            worksheet.mergeCells(8, 8, 9, 8); //use date
            worksheet.mergeCells(8, 9, 9, 9); //Depr Date
            worksheet.mergeCells(8, 10, 9, 10); //ORG Date
            worksheet.mergeCells(8, 11, 9, 11); //Estimate

            worksheet.mergeCells(8, 12, 8, 14); //Open
            worksheet.mergeCells(8, 12, 9, 12); //Original cost
            worksheet.mergeCells(8, 13, 9, 13); //Accu. amt
            worksheet.mergeCells(8, 14, 9, 14); // Remain

            worksheet.mergeCells(8, 15, 8, 16); // New asset
            worksheet.mergeCells(8, 15, 9, 15); //New asset
            worksheet.mergeCells(8, 16, 9, 16); //Replace

            worksheet.mergeCells(8, 17, 8, 18); //Liquidation
            worksheet.mergeCells(8, 17, 9, 17); //Decrese Orig
            worksheet.mergeCells(8, 18, 9, 18); //Decrese Accu
            worksheet.mergeCells(8, 19, 9, 19); //Depr. Amt

            worksheet.mergeCells(8, 20, 9, 22); // Ending
            worksheet.mergeCells(8, 20, 9, 20); //Original cost
            worksheet.mergeCells(8, 21, 9, 21); //Accu. amt
            worksheet.mergeCells(8, 22, 9, 22); // Remain

            worksheet.mergeCells(8, 23, 9, 23); //Depr.Acc
            worksheet.mergeCells(8, 24, 9, 24); //Depr.Month
            worksheet.mergeCells(8, 25, 9, 25); //Expense
            worksheet.mergeCells(8, 26, 9, 26); //Model
            worksheet.mergeCells(8, 27, 9, 27); //Doc.
            worksheet.mergeCells(8, 28, 9, 28); // Supplier
            worksheet.mergeCells(8, 29, 8, 30); //PL
            worksheet.mergeCells(8, 29, 9, 29); //Code
            worksheet.mergeCells(8, 30, 9, 30); //Name

            //INFOMATION COMPANY
            worksheet.getCell("A1").value = BIZ_NM;
            worksheet.getCell("A2").value = BIZ_ADD;
            worksheet.getCell("A3").value = "Tax code : " + BIZ_TAX;
            var FromDate = item.P_FR_DT;
            var ToDate = item.P_TO_DT;
            var strFrDate = FromDate.substr(6, 2) + "/" + FromDate.substr(4, 2) + "/" + FromDate.substr(0, 4);
            var strToDate = ToDate.substr(6, 2) + "/" + ToDate.substr(4, 2) + "/" + ToDate.substr(0, 4);
            //thÃ´ng tÆ°
            var _lang = item.P_LANG;
            if (_lang == "VIE") {
              worksheet.getCell("A6").value = "Từ tháng : " + strFrDate + " đến tháng : " + strToDate;
              worksheet.getColumn(3).hidden = true;
            } else {
              worksheet.getCell("A6").value = "From month : " + strFrDate + " to month : " + strToDate;
              worksheet.getColumn(2).hidden = true;
            }
            //-------Fill Data----------------
            var pos = 10;
            var row_num = 0;
            if (dt_Data.length > 1) {
              Utils.excelInsertRows(worksheet, pos, dt_Data.length - 1);
              //  worksheet.duplicateRow(pos,dt_Data.length-1,true);
            }
            for (var y = 0; y < dt_Data.length; y++) {
              if (dt_Data[y].FA_CD != "") {
                row_num = row_num + 1;
              }

              var row_item = worksheet.getRow(pos + i);
              row_item.getCell(1).value = row_num;
              row_item.getCell(2).value = dt_Data[y].FA_CD;
              row_item.getCell(3).value = dt_Data[y].FA_NM;
              row_item.getCell(4).value = dt_Data[y].FA_LNM;
              row_item.getCell(5).value = dt_Data[y].FA_QTY;
              row_item.getCell(6).value = dt_Data[y].PLACE;
              row_item.getCell(7).value = dt_Data[y].LOCATION;
              row_item.getCell(8).value = dt_Data[y].FA_DEPR_DATE;
              row_item.getCell(9).value = dt_Data[y].FA_USE_DATE;
              row_item.getCell(10).value = dt_Data[y].FA_DEPR_DATE_ORG;
              if (dt_Data[y].MONTHS != "") {
                row_item.getCell(11).value = dt_Data[y].MONTHS;
              }
              if (dt_Data[y].ORIGIN_AMT != "") {
                row_item.getCell(12).value = dt_Data[y].ORIGIN_AMT;
              }
              if (dt_Data[y].ACC_AMT != "") {
                row_item.getCell(13).value = dt_Data[y].ACC_AMT;
              }
              if (dt_Data[y].REMAIN_AMT != "") {
                row_item.getCell(14).value = dt_Data[y].REMAIN_AMT;
              }
              if (dt_Data[y].NEW_PUR_AMT != "") {
                row_item.getCell(15).value = dt_Data[y].NEW_PUR_AMT;
              }
              if (dt_Data[y].SUB_ACC_AMT != "") {
                row_item.getCell(16).value = dt_Data[y].SUB_ACC_AMT;
              }
              if (dt_Data[y].DIS_ORG_AMT != "") {
                row_item.getCell(17).value = dt_Data[y].DIS_ORG_AMT;
              }
              if (dt_Data[y].DIS_ACC_AMT != "") {
                row_item.getCell(18).value = dt_Data[y].DIS_ACC_AMT;
              }
              if (dt_Data[y].DEPR_PEIROD != "") {
                row_item.getCell(19).value = dt_Data[y].DEPR_PEIROD;
              }
              if (dt_Data[y].END_ORG_AMT != "") {
                row_item.getCell(20).value = dt_Data[y].END_ORG_AMT;
              }
              if (dt_Data[y].END_ACC_AMT != "") {
                row_item.getCell(21).value = dt_Data[y].END_ACC_AMT;
              }
              if (dt_Data[y].END_REMAIN_AMT != "") {
                row_item.getCell(22).value = dt_Data[y].END_REMAIN;
              }
              row_item.getCell(23).value = dt_Data[y].DEPR_ACC;
              row_item.getCell(24).value = dt_Data[y].DEPR_MONTH_AMT;
              row_item.getCell(25).value = dt_Data[y].EXP_ACC;
              row_item.getCell(26).value = dt_Data[y].MODEL;
              row_item.getCell(27).value = dt_Data[y].VOUCHER_NO;
              row_item.getCell(28).value = dt_Data[y].SUPPLIER;
              row_item.getCell(29).value = dt_Data[y].PL_CD;
              row_item.getCell(30).value = dt_Data[y].PL_NM;

              //var total_row = row_item + i;

              let _l_ORD = dt_Data[y].ORD;
              let _l_DEPR_YN = dt_Data[y].DEPR_YN;
              let _l_KIND = dt_Data[y].FA_KIND_CD;
              let _l_FACD = dt_Data[y].FA_CD;
              if (
                (_l_ORD === "" || _l_ORD == undefined || _l_ORD == null) &&
                (_l_DEPR_YN === "" || _l_DEPR_YN == undefined || _l_DEPR_YN == null) &&
                (_l_KIND === "" || _l_KIND == undefined || _l_KIND == null) &&
                (_l_FACD === "" || _l_FACD == undefined || _l_FACD == null)
              ) {
                row_item.getCell(2).value = "";
                row_item.getCell(3).value = "Grand total:";
                row_item.getCell(11).value = "";
              } else if (
                (_l_ORD === "" || _l_ORD == undefined || _l_ORD == null) &&
                _l_DEPR_YN != "" &&
                (_l_KIND === "" || _l_KIND == undefined || _l_KIND == null) &&
                (_l_FACD === "" || _l_FACD == undefined || _l_FACD == null)
              ) {
                row_item.getCell(2).value = "";
                row_item.getCell(3).value = "Total:";
                row_item.getCell(11).value = "";
                /*  if(row_item.getCell(3).value   = "Total:")
                                {
                                    var bg_total = worksheet.getRow(3);
                                    bg_total.getCell(3).fill = {
                                    type: 'pattern', 
                                    pattern:'solid', 
                                    bgColor:{argb: 'b8f6b9'}, 
                                    bgColor:{argb:'b8f6b9'}};
                                }*/
              } else if (_l_ORD != "" && _l_DEPR_YN != "" && _l_KIND != "" && (_l_FACD === "" || _l_FACD == undefined || _l_FACD == null)) {
                row_item.getCell(2).value = "";
                row_item.getCell(3).value = "Sub total:";
                row_item.getCell(11).value = "";
                for (var y = 0; y < dt_Kind_Code.length; y++) {
                  var l_code_grp_kind = dt_Kind_Code[y].CODE;
                  var l_name_grp_kind = dt_Kind_Code[y].NAME;
                  if (dt_Data[i].FA_KIND_CD == l_code_grp_kind) {
                    row_item.getCell(5).Value = l_name_grp_kind;
                  }
                }
              }
              // pos = pos + 1;
              //row_item.commit();
            }
          }
          // worksheet_1.Visible = true;
          // let worksheet2 = workbook.addWorksheet('Sheet1');
        }
        if (l_count == 1) {
          workbook.removeWorksheet(worksheet_1.id);
        }
        /********* Print file excel ********/
        const reportFile = Helpers.tmpPath(file_new);
        await workbook.xlsx.writeFile(reportFile);
        return response.attachment(reportFile, file_new);
      }
    } catch (e) {
      Utils.Logger({ LVL: "error", MODULE: "Report", FUNC: "rpt6070060_ListOfAssetDerp_2_TKTS", CONTENT: e.message });
      // return response.send(Utils.response(false, e.message, null))
      return response.send(null);
    }
  }
}

module.exports = rpt6070060;
