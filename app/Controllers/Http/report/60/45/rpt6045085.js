"use strict";
const Helpers = use("Helpers");
const Antl = use("Antl");
const Utils = use("Utils");
const DBService = use("DBService");
var Excel = use("exceljs");
var workbook = new Excel.Workbook();
class rpt6045085 {
  /*########################################################## Report JH ##################################################################################*/
  async rpt_6045085_T3_CASH_FL_DIRECT({ request, response, auth }) {
    try {
      /*P_RPT_ID: report_info.VAL1, P_RPT_FILE: report_info.VAL2,
            P_COMPANY: this.sel_Company, P_DT_MONTH: this.dt_mmyy, P_VAT_TYPE: this.sel_VatType, P_TAX_RATE: this.sel_TaxRate, 
            P_CURRENT_CCY: this.sel_Ccy, P_STATUS: this.sel_Status, P_CUST_PK: this.txt_Customer_PK, P_INVOICE_NO: this.txt_InvoiceNo,
            P_AC_CD: this.txt_ACC_CD, P_SEQ: this.txt_Seq, P_VOUCHER_NO: this.sel_VoucherType, P_BALANCE: this.sel_Banlance,
            P_DT_FR: this.dt_from, P_DT_TO: this.dt_to, P_BIZ: this.sel_Bizpalce*/
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
      var _BIZ_ID = item.P_BIZ_ID,
        _BIZ_NM = item.P_BIZ_NM,
        _BIZ_TAX = item.P_BIZ_TAX,
        _BIZ_ADD = item.P_BIZ_ADD;
      var _store = "AC_SEL_6045085_CASHFLOW";
      var _param = [
        item.P_FORM_TYPE_CASH,
        item.P_COMPANY,
        item.P_FR_DATE,
        item.P_TO_DATE,
        item.P_TYPE,
        item.P_STATUS,
        item.P_BOOK_EX_RATE,
        item.P_CONVERT_CCY,
        item.P_CONVERT_EX_RATE,
        item.P_SCALE,
        item.P_TCO_BUSPLACE_PK,
      ];
      var _ac_code = "EACAB031";
      var _store_sign = "ac_rpt_6045085_sign";
      var _param_sign = [item.P_COMPANY, _ac_code];
      /***************************** Return failded ****************************/
      /***************************** Return failded ****************************/

      if (!user) {
        return response.send(Utils.response(false, "Request failed!", null));
      } else {
      /****************************** Begin call store and write excell *********/
        /********* Call store sign ***************/
        var dt_Data_sign = await DBService.callProcCursor(_store_sign, _param_sign, p_language, p_crt_by);
        if (dt_Data_sign) {
          dt_Data_sign = dt_Data_sign;
        }
        /********* Call store  ***************/
        var dt_Data = await DBService.callProcCursor(_store, _param, p_language, p_crt_by);
        if (dt_Data) {
          dt_Data = dt_Data;
        } else {
          return response.send(Utils.response(false, "no_data_found", null));
        }
        /********* Read file excel ********/
        const templateFile = Helpers.resourcesPath(_resourcesPath);
        await workbook.xlsx.readFile(templateFile);
        var worksheet = workbook.getWorksheet(1);
        /********* Write file excel ********/
        /*Set Header */
        var P_TYPE = item.P_TYPE;
        var del_yn = 0;
        var r_item = worksheet.getRow(1);
        var P_LANG = item.P_LANG;
        var col_del = 0;
        var v_content = "",
          e_content = "",
          k_content = "";
        var no = ": B02 - DN";
        var no_title = P_LANG == "VIE" ? "Mẫu Số" : "Form";
        var P_HEADER = P_LANG == "VIE" ? item.P_CIRCULARS_VIE : item.P_CIRCULARS_ENG;
        var v_dvt = " Đơn vị tính",
          e_dvt = " Unit",
          k_dvt = " 단위";
        var v_code = " Mã Số",
          e_code = " Code",
          k_code = " 코드";
        var v_note = " Notes",
          e_note = " Thuyết Minh",
          k_note = " 비고";
        //var v_title = " BÁO CÁO LƯU CHUYỂN TIỀN TỆ", e_title = " CASH FLOW", k_title = "현금흐름표";
        var v_title = dt_Data[0].V_TITLE;
        var v_fdate = "Từ ngày ",
          e_fdate = "From ",
          k_fdate = "부터 ",
          v_tdate = " đến ngày",
          e_tdate = " to",
          k_tdate = " 까지";
        var v_month = " Tháng này",
          e_month = " This month",
          k_month = " 이번 달";
        if (P_LANG == "VIE" || P_LANG == "KOR" || P_LANG == "ENG") {
          worksheet.spliceColumns(2, 2);
          col_del = 2;
          r_item = worksheet.getRow(8);
          worksheet.mergeCells("A8", "A10");
          worksheet.mergeCells("B8", "B10");
          worksheet.mergeCells("C8", "C10");
          worksheet.mergeCells("A5", "E5");
          worksheet.mergeCells("A6", "E6");
          r_item.getCell(1).value = P_LANG == "VIE" ? "Chỉ Tiêu" : P_LANG == "KOR" ? "항목" : "ITEM";
          r_item.getCell(2).value =
            P_LANG == "VIE"
              ? v_code
              : P_LANG == "ENG"
              ? e_code
              : P_LANG == "KOR"
              ? k_code
              : P_LANG == "KOR-VIE"
              ? k_code + v_code
              : P_LANG == "ENG-VIE"
              ? e_code + v_code
              : P_LANG == "ENG-KOR"
              ? e_code + k_code
              : P_LANG == "ENG-VIE-KOR"
              ? e_code + v_code + k_code
              : e_code;
          r_item.getCell(3).value =
            P_LANG == "VIE"
              ? v_note
              : P_LANG == "ENG"
              ? e_note
              : P_LANG == "KOR"
              ? k_note
              : P_LANG == "KOR-VIE"
              ? k_note + v_note
              : P_LANG == "ENG-VIE"
              ? e_note + v_note
              : P_LANG == "ENG-KOR"
              ? e_note + k_note
              : P_LANG == "ENG-VIE-KOR"
              ? e_note + v_note + k_note
              : e_note;
        } else if (P_LANG == "KOR-VIE" || P_LANG == "ENG-VIE" || P_LANG == "ENG-KOR") {
          worksheet.spliceColumns(3, 1);
          col_del = 1;
          r_item = worksheet.getRow(8);
          worksheet.mergeCells("A8", "A10");
          worksheet.mergeCells("B8", "B10");
          worksheet.mergeCells("C8", "C10");
          worksheet.mergeCells("D8", "D10");
          worksheet.mergeCells("A5", "F5");
          worksheet.mergeCells("A6", "F6");
          r_item.getCell(1).value = P_LANG == "KOR-VIE" ? "항목" : "ITEM";
          r_item.getCell(2).value = P_LANG == "ENG-KOR" ? "항목" : "Chỉ Tiêu";
          r_item.getCell(3).value =
            P_LANG == "VIE"
              ? v_code
              : P_LANG == "ENG"
              ? e_code
              : P_LANG == "KOR"
              ? k_code
              : P_LANG == "KOR-VIE"
              ? k_code + v_code
              : P_LANG == "ENG-VIE"
              ? e_code + v_code
              : P_LANG == "ENG-KOR"
              ? e_code + k_code
              : P_LANG == "ENG-VIE-KOR"
              ? e_code + v_code + k_code
              : e_code;
          r_item.getCell(4).value =
            P_LANG == "VIE"
              ? v_note
              : P_LANG == "ENG"
              ? e_note
              : P_LANG == "KOR"
              ? k_note
              : P_LANG == "KOR-VIE"
              ? k_note + v_note
              : P_LANG == "ENG-VIE"
              ? e_note + v_note
              : P_LANG == "ENG-KOR"
              ? e_note + k_note
              : P_LANG == "ENG-VIE-KOR"
              ? e_note + v_note + k_note
              : e_note;
        } else {
          r_item = worksheet.getRow(8);
          worksheet.mergeCells("A8", "A10");
          worksheet.mergeCells("B8", "B10");
          worksheet.mergeCells("C8", "C10");
          worksheet.mergeCells("D8", "D10");
          worksheet.mergeCells("E8", "E10");
          worksheet.mergeCells("A5", "G5");
          worksheet.mergeCells("A6", "G6");
          r_item.getCell(1).value = "ITEM";
          r_item.getCell(2).value = "Chỉ Tiêu";
          r_item.getCell(3).value = "항목";
          r_item.getCell(4).value =
            P_LANG == "VIE"
              ? v_code
              : P_LANG == "ENG"
              ? e_code
              : P_LANG == "KOR"
              ? k_code
              : P_LANG == "KOR-VIE"
              ? k_code + v_code
              : P_LANG == "ENG-VIE"
              ? e_code + v_code
              : P_LANG == "ENG-KOR"
              ? e_code + k_code
              : P_LANG == "ENG-VIE-KOR"
              ? e_code + v_code + k_code
              : e_code;
          r_item.getCell(5).value =
            P_LANG == "VIE"
              ? v_note
              : P_LANG == "ENG"
              ? e_note
              : P_LANG == "KOR"
              ? k_note
              : P_LANG == "KOR-VIE"
              ? k_note + v_note
              : P_LANG == "ENG-VIE"
              ? e_note + v_note
              : P_LANG == "ENG-KOR"
              ? e_note + k_note
              : P_LANG == "ENG-VIE-KOR"
              ? e_note + v_note + k_note
              : e_note;
        }

        r_item = worksheet.getRow(1);
        r_item.getCell(1).value = _BIZ_NM;
        r_item = worksheet.getRow(2);
        r_item.getCell(1).value = _BIZ_ADD;

        var p_YEAR = item.P_TO_DATE.substr(0, 4);
        var p_quater = item.P_HAFT_QUATER == 1 ? "I" : item.P_HAFT_QUATER == 2 ? "II" : item.P_HAFT_QUATER == 3 ? "III" : "IV";
        if (P_TYPE == 3 || P_TYPE == 4 || P_TYPE == 5) {
          worksheet.spliceColumns(6, 2);
          if (col_del == 0) {
            worksheet.mergeCells("F2", "G3");
            worksheet.mergeCells("F1", "G1");
            worksheet.mergeCells("F8", "G8");
            worksheet.mergeCells("F9", "F10");
            worksheet.mergeCells("G9", "G10");
          } else if (col_del == 1) {
            worksheet.mergeCells("E2", "F3");
            worksheet.mergeCells("E1", "F1");
            worksheet.mergeCells("E8", "F8");
            worksheet.mergeCells("E9", "E10");
            worksheet.mergeCells("F9", "F10");
          } else if (col_del == 2) {
            worksheet.mergeCells("D2", "E3");
            worksheet.mergeCells("D1", "E1");
            worksheet.mergeCells("D8", "E8");
            worksheet.mergeCells("D9", "D10");
            worksheet.mergeCells("E9", "E10");
          }
          del_yn = 2;
          r_item = worksheet.getRow(8);
          (v_month = "Năm"), (e_month = "Year"), (k_month = " 년도");
          r_item.getCell(6 - col_del).value =
            P_LANG == "VIE"
              ? v_month
              : P_LANG == "ENG"
              ? e_month
              : P_LANG == "KOR"
              ? k_month
              : P_LANG == "KOR-VIE"
              ? k_month + v_month
              : P_LANG == "ENG-VIE"
              ? e_month + v_month
              : P_LANG == "ENG-KOR"
              ? e_month + k_month
              : P_LANG == "ENG-VIE-KOR"
              ? e_month + v_month + k_month
              : e_month;
          r_item = worksheet.getRow(9);
          r_item.getCell(6 - col_del).value = "YEAR Năm " + p_YEAR;
          r_item.getCell(7 - col_del).value = "YEAR Năm " + (Number(p_YEAR) - 1);
          r_item = worksheet.getRow(6);
          r_item.getCell(1).value =
            (P_LANG == "VIE"
              ? v_fdate
              : P_LANG == "ENG"
              ? e_fdate
              : P_LANG == "KOR"
              ? k_fdate
              : P_LANG == "KOR-VIE"
              ? k_fdate + v_fdate
              : P_LANG == "ENG-VIE"
              ? e_fdate + v_fdate
              : P_LANG == "ENG-KOR"
              ? e_fdate + k_fdate
              : P_LANG == "ENG-VIE-KOR"
              ? e_fdate + v_fdate + k_fdate
              : e_fdate) +
            Utils._formatDate(item.P_FR_DATE, "DD/MM/YYYY") +
            (P_LANG == "VIE"
              ? v_tdate
              : P_LANG == "ENG"
              ? e_tdate
              : P_LANG == "KOR"
              ? k_tdate
              : P_LANG == "KOR-VIE"
              ? k_tdate + v_tdate
              : P_LANG == "ENG-VIE"
              ? e_tdate + v_tdate
              : P_LANG == "ENG-KOR"
              ? e_tdate + k_tdate
              : P_LANG == "ENG-VIE-KOR"
              ? e_tdate + v_tdate + k_tdate
              : e_tdate) +
            Utils._formatDate(item.P_TO_DATE, "DD/MM/YYYY");
        } else if (P_TYPE == 1) {
          var p_YEAR = item.P_TO_DATE.substr(0, 4);
          var p_month = item.P_TO_DATE.substr(4, 2);
          worksheet.spliceColumns(6, 2);
          if (col_del == 0) {
            worksheet.mergeCells("F2", "G3");
            worksheet.mergeCells("F1", "G1");
            worksheet.mergeCells("F8", "G8");
            worksheet.mergeCells("F9", "F10");
            worksheet.mergeCells("G9", "G10");
          } else if (col_del == 1) {
            worksheet.mergeCells("E2", "F3");
            worksheet.mergeCells("E1", "F1");
            worksheet.mergeCells("E8", "F8");
            worksheet.mergeCells("E9", "E10");
            worksheet.mergeCells("F9", "F10");
          } else if (col_del == 2) {
            worksheet.mergeCells("D2", "E3");
            worksheet.mergeCells("D1", "E1");
            worksheet.mergeCells("D8", "E8");
            worksheet.mergeCells("D9", "D10");
            worksheet.mergeCells("E9", "E10");
          }
          r_item = worksheet.getRow(6);
          r_item.getCell(1).value =
            (P_LANG == "VIE"
              ? v_fdate
              : P_LANG == "ENG"
              ? e_fdate
              : P_LANG == "KOR"
              ? k_fdate
              : P_LANG == "KOR-VIE"
              ? k_fdate + v_fdate
              : P_LANG == "ENG-VIE"
              ? e_fdate + v_fdate
              : P_LANG == "ENG-KOR"
              ? e_fdate + k_fdate
              : P_LANG == "ENG-VIE-KOR"
              ? e_fdate + v_fdate + k_fdate
              : e_fdate) +
            Utils._formatDate(item.P_FR_DATE, "DD/MM/YYYY") +
            (P_LANG == "VIE"
              ? v_tdate
              : P_LANG == "ENG"
              ? e_tdate
              : P_LANG == "KOR"
              ? k_tdate
              : P_LANG == "KOR-VIE"
              ? k_tdate + v_tdate
              : P_LANG == "ENG-VIE"
              ? e_tdate + v_tdate
              : P_LANG == "ENG-KOR"
              ? e_tdate + k_tdate
              : P_LANG == "ENG-VIE-KOR"
              ? e_tdate + v_tdate + k_tdate
              : e_tdate) +
            Utils._formatDate(item.P_TO_DATE, "DD/MM/YYYY");

          r_item = worksheet.getRow(8);
          (v_month = " Tháng này"), (e_month = " This month"), (k_month = " 이번 달");
          r_item.getCell(6 - col_del).value =
            P_LANG == "VIE"
              ? v_month
              : P_LANG == "ENG"
              ? e_month
              : P_LANG == "KOR"
              ? k_month
              : P_LANG == "KOR-VIE"
              ? k_month + v_month
              : P_LANG == "ENG-VIE"
              ? e_month + v_month
              : P_LANG == "ENG-KOR"
              ? e_month + k_month
              : P_LANG == "ENG-VIE-KOR"
              ? e_month + v_month + k_month
              : e_month;

          r_item = worksheet.getRow(9);
          var _month_year = p_month + "/" + p_YEAR;
          v_month = " Tháng" + _month_year;
          e_month = " Month" + _month_year;
          k_month = "달" + _month_year;
          r_item.getCell(6 - col_del).value =
            P_LANG == "VIE"
              ? v_month
              : P_LANG == "ENG"
              ? e_month
              : P_LANG == "KOR"
              ? k_month
              : P_LANG == "KOR-VIE"
              ? k_month + v_month
              : P_LANG == "ENG-VIE"
              ? e_month + v_month
              : P_LANG == "ENG-KOR"
              ? e_month + k_month
              : P_LANG == "ENG-VIE-KOR"
              ? e_month + v_month + k_month
              : e_month;

          var _month_year = p_month + "/" + (Number(p_YEAR) - 1);
          v_month = " Tháng" + _month_year;
          e_month = " Month" + _month_year;
          k_month = "달" + _month_year;
          r_item.getCell(7 - col_del).value =
            P_LANG == "VIE"
              ? v_month
              : P_LANG == "ENG"
              ? e_month
              : P_LANG == "KOR"
              ? k_month
              : P_LANG == "KOR-VIE"
              ? k_month + v_month
              : P_LANG == "ENG-VIE"
              ? e_month + v_month
              : P_LANG == "ENG-KOR"
              ? e_month + k_month
              : P_LANG == "ENG-VIE-KOR"
              ? e_month + v_month + k_month
              : e_month;

          del_yn = 1;
        } else if (P_TYPE == 2 || P_TYPE == 6) {
          worksheet.spliceColumns(6, 2);
          r_item = worksheet.getRow(6);
          r_item.getCell(1).value =
            (P_LANG == "VIE"
              ? v_fdate
              : P_LANG == "ENG"
              ? e_fdate
              : P_LANG == "KOR"
              ? k_fdate
              : P_LANG == "KOR-VIE"
              ? k_fdate + v_fdate
              : P_LANG == "ENG-VIE"
              ? e_fdate + v_fdate
              : P_LANG == "ENG-KOR"
              ? e_fdate + k_fdate
              : P_LANG == "ENG-VIE-KOR"
              ? e_fdate + v_fdate + k_fdate
              : e_fdate) +
            Utils._formatDate(item.P_FR_DATE, "DD/MM/YYYY") +
            (P_LANG == "VIE"
              ? v_tdate
              : P_LANG == "ENG"
              ? e_tdate
              : P_LANG == "KOR"
              ? k_tdate
              : P_LANG == "KOR-VIE"
              ? k_tdate + v_tdate
              : P_LANG == "ENG-VIE"
              ? e_tdate + v_tdate
              : P_LANG == "ENG-KOR"
              ? e_tdate + k_tdate
              : P_LANG == "ENG-VIE-KOR"
              ? e_tdate + v_tdate + k_tdate
              : e_tdate) +
            Utils._formatDate(item.P_TO_DATE, "DD/MM/YYYY");
          if (col_del == 0) {
            worksheet.mergeCells("H2", "I3");
            worksheet.mergeCells("H1", "I1");
            worksheet.mergeCells("F8", "G8");
            worksheet.mergeCells("F9", "F10");
            worksheet.mergeCells("G9", "G10");
            worksheet.mergeCells("H8", "I8");
            worksheet.mergeCells("H9", "H10");
            worksheet.mergeCells("I9", "I10");
          } else if (col_del == 1) {
            worksheet.mergeCells("G2", "H3");
            worksheet.mergeCells("G1", "H1");
            worksheet.mergeCells("E8", "F8");
            worksheet.mergeCells("E9", "E10");
            worksheet.mergeCells("F9", "F10");
            worksheet.mergeCells("G8", "H8");
            worksheet.mergeCells("G9", "G10");
            worksheet.mergeCells("H9", "H10");
          } else if (col_del == 2) {
            worksheet.mergeCells("F2", "G3");
            worksheet.mergeCells("F1", "G1");
            worksheet.mergeCells("D8", "E8");
            worksheet.mergeCells("E9", "E10");
            worksheet.mergeCells("D9", "D10");
            worksheet.mergeCells("F8", "G8");
            worksheet.mergeCells("F9", "F10");
            worksheet.mergeCells("G9", "G10");
          }

          var v_add = "",
            e_add = "",
            k_add = "";
          // Lấy
          if (P_TYPE == 2) {
            v_month = " Quý " + p_quater + "/" + p_YEAR;
            e_month = " Quarter " + p_quater + "/" + p_YEAR;
            k_month = " 쿼터 " + p_quater + "/" + p_YEAR;
          }
          if (P_TYPE == 6) {
            v_add = " Nữa ";
            e_add = "";
            k_add = "";
            if (item.P_HAFT_QUATER == 5) {
              v_month = " FIRST HALF / " + p_YEAR;
              e_month = " FIRST HALF / " + p_YEAR;
              k_month = " FIRST HALF / " + p_YEAR;
            }
            if (item.P_HAFT_QUATER == 6) {
              v_month = " SECOND HALF / " + p_YEAR;
              e_month = " SECOND HALF / " + p_YEAR;
              k_month = " SECOND HALF / " + p_YEAR;
            }
          } //lấy
          r_item = worksheet.getRow(6);
          r_item.getCell(1).value =
            (P_LANG == "VIE"
              ? v_month
              : P_LANG == "ENG"
              ? e_month
              : P_LANG == "KOR"
              ? k_month
              : P_LANG == "KOR-VIE"
              ? k_month + v_month
              : P_LANG == "ENG-VIE"
              ? e_month + v_month
              : P_LANG == "ENG-KOR"
              ? e_month + k_month
              : P_LANG == "ENG-VIE-KOR"
              ? e_month + v_month + k_month
              : e_month) +
            " / " +
            (P_LANG == "VIE"
              ? v_fdate
              : P_LANG == "ENG"
              ? e_fdate
              : P_LANG == "KOR"
              ? k_fdate
              : P_LANG == "KOR-VIE"
              ? k_fdate + v_fdate
              : P_LANG == "ENG-VIE"
              ? e_fdate + v_fdate
              : P_LANG == "ENG-KOR"
              ? e_fdate + k_fdate
              : P_LANG == "ENG-VIE-KOR"
              ? e_fdate + v_fdate + k_fdate
              : e_fdate) +
            Utils._formatDate(item.P_FR_DATE, "DD/MM/YYYY") +
            (P_LANG == "VIE"
              ? v_tdate
              : P_LANG == "ENG"
              ? e_tdate
              : P_LANG == "KOR"
              ? k_tdate
              : P_LANG == "KOR-VIE"
              ? k_tdate + v_tdate
              : P_LANG == "ENG-VIE"
              ? e_tdate + v_tdate
              : P_LANG == "ENG-KOR"
              ? e_tdate + k_tdate
              : P_LANG == "ENG-VIE-KOR"
              ? e_tdate + v_tdate + k_tdate
              : e_tdate) +
            Utils._formatDate(item.P_TO_DATE, "DD/MM/YYYY");

          r_item = worksheet.getRow(8);
          r_item.getCell(6 - col_del).value =
            P_LANG == "VIE"
              ? v_month
              : P_LANG == "ENG"
              ? e_month
              : P_LANG == "KOR"
              ? k_month
              : P_LANG == "KOR-VIE"
              ? k_month + v_month
              : P_LANG == "ENG-VIE"
              ? e_month + v_month
              : P_LANG == "ENG-KOR"
              ? e_month + k_month
              : P_LANG == "ENG-VIE-KOR"
              ? e_month + v_month + k_month
              : e_month;

          r_item = worksheet.getRow(9);
          v_month = v_add + " Năm Trước";
          e_month = e_add + " Last Year";
          k_month = k_add + " 작년에";
          r_item.getCell(7 - col_del).value =
            P_LANG == "VIE"
              ? v_month
              : P_LANG == "ENG"
              ? e_month
              : P_LANG == "KOR"
              ? k_month
              : P_LANG == "KOR-VIE"
              ? k_month + v_month
              : P_LANG == "ENG-VIE"
              ? e_month + v_month
              : P_LANG == "ENG-KOR"
              ? e_month + k_month
              : P_LANG == "ENG-VIE-KOR"
              ? e_month + v_month + k_month
              : e_month;

          v_month = v_add + " Năm Nay";
          e_month = " This Year";
          k_month = " 올해";
          r_item.getCell(6 - col_del).value =
            P_LANG == "VIE"
              ? v_month
              : P_LANG == "ENG"
              ? e_month
              : P_LANG == "KOR"
              ? k_month
              : P_LANG == "KOR-VIE"
              ? k_month + v_month
              : P_LANG == "ENG-VIE"
              ? e_month + v_month
              : P_LANG == "ENG-KOR"
              ? e_month + k_month
              : P_LANG == "ENG-VIE-KOR"
              ? e_month + v_month + k_month
              : e_month;

          del_yn = 0;
        }
        r_item = worksheet.getRow(5);
        r_item.getCell(1).value = v_title; // (P_LANG == 'VIE'?v_title:P_LANG == 'ENG'?e_title:P_LANG == 'KOR'?k_title:P_LANG == 'KOR-VIE'?k_title+v_title:P_LANG == 'ENG-VIE'?e_title+v_title:P_LANG == 'ENG-KOR'?e_title+k_title:P_LANG == 'ENG-VIE-KOR'?e_title+v_title+k_title:e_title) ;

        r_item = worksheet.getRow(1);
        r_item.getCell(8 - del_yn - col_del).value = no_title + no;

        r_item = worksheet.getRow(2);
        r_item.getCell(8 - del_yn - col_del).value = P_HEADER;

        r_item = worksheet.getRow(7);
        r_item.getCell(9 - 1 - del_yn - col_del).value =
          "(" +
          (P_LANG == "VIE"
            ? v_dvt
            : P_LANG == "ENG"
            ? e_dvt
            : P_LANG == "KOR"
            ? k_dvt
            : P_LANG == "KOR-VIE"
            ? k_dvt + v_dvt
            : P_LANG == "ENG-VIE"
            ? e_dvt + v_dvt
            : P_LANG == "ENG-KOR"
            ? e_dvt + k_dvt
            : P_LANG == "ENG-VIE-KOR"
            ? e_dvt + v_dvt + k_dvt
            : e_dvt) +
          ": " +
          item.P_BOOK_CCY +
          ")";

        var pos = 11,
          pos_copy = 12;
        if (dt_Data.length > 1) {
          worksheet.duplicateRow(pos_copy, dt_Data.length - 3, true);
        }
        for (var i = 0; i < dt_Data.length; i++) {
          var row_item = worksheet.getRow(pos + i);
          if (col_del == 0) {
            row_item.getCell(1).value = dt_Data[i].PRN_ACNM;
            row_item.getCell(2).value = dt_Data[i].PRN_LACNM;
            row_item.getCell(3).value = dt_Data[i].PRN_KACNM;
          } else if (col_del == 1) {
            row_item.getCell(1).value = P_LANG == "KOR-VIE" ? dt_Data[i].PRN_KACNM : dt_Data[i].PRN_ACNM;
            row_item.getCell(2).value = P_LANG == "ENG-KOR" ? dt_Data[i].PRN_KACNM : dt_Data[i].PRN_LACNM;
          } else if (col_del == 2) {
            var data = dt_Data[i].PRN_ACNM;
            if (P_LANG == "VIE") {
              data = dt_Data[i].PRN_LACNM;
            }
            if (P_LANG == "KOR") {
              data = dt_Data[i].PRN_KACNM;
            }
            if (P_LANG == "ENG") {
              data = dt_Data[i].PRN_ACNM;
            }
            row_item.getCell(1).value = data;
          }
          row_item.getCell(4 - col_del).value = dt_Data[i].CODE;
          row_item.getCell(5 - col_del).value = dt_Data[i].HEADER;
          if (P_TYPE == 1) {
            row_item.getCell(6 - col_del).value = dt_Data[i].THIS_AMT;
            row_item.getCell(7 - col_del).value = dt_Data[i].LAST_AMT;
          }
          if (P_TYPE == 3 || P_TYPE == 4 || P_TYPE == 5) {
            row_item.getCell(6 - col_del).value = dt_Data[i].THIS_AMT;
            row_item.getCell(7 - col_del).value = dt_Data[i].LAST_AMT;
          }
          if (P_TYPE == 2 || P_TYPE == 6) {
            row_item.getCell(6 - col_del).value = dt_Data[i].THIS_AMT;
            row_item.getCell(7 - col_del).value = dt_Data[i].LAST_AMT;
          }
        }
        pos = pos + dt_Data.length + 1;
        row_item = worksheet.getRow(pos);
        if (dt_Data_sign.length > 1) {
          for (var i = 0; i < dt_Data_sign.length; i++) {
            if (P_LANG == "VIE") {
              if (dt_Data_sign[i].CODE == "VIE") {
                row_item.getCell(1).value = dt_Data_sign[i].VAL1;
                row_item.getCell(1).font = { bold: true, italic: false };
                row_item.getCell(1).alignment = { vertical: "middle", horizontal: "center" };
                worksheet.mergeCells(pos, 2, pos, 3);
                row_item.getCell(2).value = dt_Data_sign[i].VAL2;
                row_item.getCell(2).font.bold = true;
                row_item.getCell(2).alignment = { vertical: "middle", horizontal: "center" };
                worksheet.mergeCells(pos, 5, pos, 6);
                row_item.getCell(5).value = dt_Data_sign[i].VAL3;
                row_item.getCell(5).font.bold = true;
                row_item.getCell(5).alignment = { vertical: "middle", horizontal: "center" };
              }

              row_item = worksheet.getRow(pos + 1);
              if (dt_Data_sign[i].CODE == "VIE_SIG") {
                worksheet.mergeCells(pos + 1, 2, pos + 1, 3);
                worksheet.mergeCells(pos + 1, 5, pos + 1, 6);
                row_item.getCell(1).value = dt_Data_sign[i].VAL1;
                row_item.getCell(1).font.bold = false;
                row_item.getCell(2).value = dt_Data_sign[i].VAL2;
                row_item.getCell(2).font.bold = false;
                row_item.getCell(5).value = dt_Data_sign[i].VAL3;
                row_item.getCell(5).font.bold = false;
                row_item.getCell(1).alignment = { vertical: "middle", horizontal: "center" };
                row_item.getCell(2).alignment = { vertical: "middle", horizontal: "center" };
                row_item.getCell(5).alignment = { vertical: "middle", horizontal: "center" };
              }
            }
            if (P_LANG == "KOR") {
              if (dt_Data_sign[i].CODE == "KOR") {
                worksheet.mergeCells(pos, 2, pos, 3);
                worksheet.mergeCells(pos, 5, pos, 6);
                row_item.getCell(1).value = dt_Data_sign[i].VAL1;
                row_item.getCell(1).font.bold = true;
                row_item.getCell(2).value = dt_Data_sign[i].VAL2;
                row_item.getCell(2).font.bold = true;
                row_item.getCell(5).value = dt_Data_sign[i].VAL3;
                row_item.getCell(5).font.bold = true;
                row_item.getCell(1).alignment = { vertical: "middle", horizontal: "center" };
                row_item.getCell(2).alignment = { vertical: "middle", horizontal: "center" };
                row_item.getCell(5).alignment = { vertical: "middle", horizontal: "center" };
              }

              row_item = worksheet.getRow(pos + 1);
              if (dt_Data_sign[i].CODE == "KOR_SIG") {
                worksheet.mergeCells(pos + 1, 2, pos + 1, 3);
                worksheet.mergeCells(pos + 1, 5, pos + 1, 6);
                row_item.getCell(1).value = dt_Data_sign[i].VAL1;
                row_item.getCell(1).font.bold = false;
                row_item.getCell(2).value = dt_Data_sign[i].VAL2;
                row_item.getCell(2).font.bold = false;
                row_item.getCell(5).value = dt_Data_sign[i].VAL3;
                row_item.getCell(5).font.bold = false;
                row_item.getCell(1).alignment = { vertical: "middle", horizontal: "center" };
                row_item.getCell(2).alignment = { vertical: "middle", horizontal: "center" };
                row_item.getCell(5).alignment = { vertical: "middle", horizontal: "center" };
              }
            }
            if (P_LANG == "ENG") {
              if (dt_Data_sign[i].CODE == "ENG") {
                worksheet.mergeCells(pos, 2, pos, 3);
                worksheet.mergeCells(pos, 5, pos, 6);
                row_item.getCell(1).value = dt_Data_sign[i].VAL1;
                row_item.getCell(1).font.bold = true;
                row_item.getCell(2).value = dt_Data_sign[i].VAL2;
                row_item.getCell(2).font.bold = true;
                row_item.getCell(5).value = dt_Data_sign[i].VAL3;
                row_item.getCell(5).font.bold = true;
                row_item.getCell(1).alignment = { vertical: "middle", horizontal: "center" };
                row_item.getCell(2).alignment = { vertical: "middle", horizontal: "center" };
                row_item.getCell(5).alignment = { vertical: "middle", horizontal: "center" };
              }

              row_item = worksheet.getRow(pos + 1);
              if (dt_Data_sign[i].CODE == "ENG_SIG") {
                worksheet.mergeCells(pos + 1, 2, pos + 1, 3);
                worksheet.mergeCells(pos + 1, 5, pos + 1, 6);
                row_item.getCell(1).value = dt_Data_sign[i].VAL1;
                row_item.getCell(1).font.bold = false;
                row_item.getCell(2).value = dt_Data_sign[i].VAL2;
                row_item.getCell(2).font.bold = false;
                row_item.getCell(5).value = dt_Data_sign[i].VAL3;
                row_item.getCell(5).font.bold = false;
                row_item.getCell(1).alignment = { vertical: "middle", horizontal: "center" };
                row_item.getCell(2).alignment = { vertical: "middle", horizontal: "center" };
                row_item.getCell(5).alignment = { vertical: "middle", horizontal: "center" };
              }
            }
            if (dt_Data_sign[i].CODE == "NAME") {
              row_item = worksheet.getRow(pos + 2);
              row_item.getCell(1).value = dt_Data_sign[i].VAL1;
              row_item.getCell(5).font.bold = false;
              row_item.getCell(2).value = dt_Data_sign[i].VAL2;
              row_item.getCell(5).font.bold = false;
              row_item.getCell(5).value = dt_Data_sign[i].VAL3;
              row_item.getCell(5).font.bold = false;
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
  async rpt_6045085_T2_Income_Statement({ request, response, auth }) {
    try {
      /*P_RPT_ID: report_info.VAL1, P_RPT_FILE: report_info.VAL2,
            P_COMPANY: this.sel_Company, P_DT_MONTH: this.dt_mmyy, P_VAT_TYPE: this.sel_VatType, P_TAX_RATE: this.sel_TaxRate, 
            P_CURRENT_CCY: this.sel_Ccy, P_STATUS: this.sel_Status, P_CUST_PK: this.txt_Customer_PK, P_INVOICE_NO: this.txt_InvoiceNo,
            P_AC_CD: this.txt_ACC_CD, P_SEQ: this.txt_Seq, P_VOUCHER_NO: this.sel_VoucherType, P_BALANCE: this.sel_Banlance,
            P_DT_FR: this.dt_from, P_DT_TO: this.dt_to, P_BIZ: this.sel_Bizpalce*/
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
      var _BIZ_ID = item.P_BIZ_ID,
        _BIZ_NM = item.P_BIZ_NM,
        _BIZ_TAX = item.P_BIZ_TAX,
        _BIZ_ADD = item.P_BIZ_ADD;
      var _store = "AC_SEL_6045085_INCOME";
      var _param = [
        item.P_FORM_TYPE,
        item.P_COMPANY,
        item.P_FR_DATE,
        item.P_TO_DATE,
        item.P_STATUS,
        item.P_BOOK_EX_RATE,
        item.P_CONVERT_CCY,
        item.P_CONVERT_EX_RATE,
        item.P_SCALE,
        item.P_TCO_BUSPLACE_PK,
      ];

      var _ac_code = "EACAB031";
      var _store_sign = "ac_rpt_6045085_sign";
      var _param_sign = [item.P_COMPANY, _ac_code];
      /***************************** Return failded ****************************/
      /***************************** Return failded ****************************/

      if (!user) {
        return response.send(Utils.response(false, "Request failed!", null));
      } else {
      /****************************** Begin call store and write excell *********/
        /********* Call store sign ***************/
        var dt_Data_sign = await DBService.callProcCursor(_store_sign, _param_sign, p_language, p_crt_by);
        if (dt_Data_sign) {
          dt_Data_sign = dt_Data_sign;
        }
        /********* Call store  ***************/
        var dt_Data = await DBService.callProcCursor(_store, _param, p_language, p_crt_by);
        if (dt_Data) {
          dt_Data = dt_Data;
        } else {
          return response.send(Utils.response(false, "no_data_found", null));
        }
        /********* Read file excel ********/
        const templateFile = Helpers.resourcesPath(_resourcesPath);
        await workbook.xlsx.readFile(templateFile);
        var worksheet = workbook.getWorksheet(1);
        /********* Write file excel ********/
        /*Set Header */
        var P_TYPE = item.P_TYPE;
        var del_yn = 0;
        var r_item = worksheet.getRow(1);
        var P_LANG = item.P_LANG;
        var col_del = 0;
        var v_content = "",
          e_content = "",
          k_content = "";
        var no = ": B02 - DN";
        var no_title = P_LANG == "VIE" ? "Mẫu Số" : "Form";
        var P_HEADER = P_LANG == "VIE" ? item.P_CIRCULARS_VIE : item.P_CIRCULARS_ENG;
        var v_dvt = " Đơn vị tính",
          e_dvt = " Unit",
          k_dvt = " 단위";
        var v_code = " Mã Số",
          e_code = " Code",
          k_code = " 코드";
        var v_note = " Notes",
          e_note = " Thuyết Minh",
          k_note = " 비고";
        //var v_title = " BÁO CÁO KẾT QUẢ HOẠT ĐỘNG KINH DOANH", e_title = " INCOME STATEMENT", k_title = " 손익계산서";
        var v_title = dt_Data[0].V_TITLE;
        var v_fdate = "Từ ngày ",
          e_fdate = "From ",
          k_fdate = "부터 ",
          v_tdate = " đến ngày",
          e_tdate = " to",
          k_tdate = " 까지";
        var v_month = " Tháng này",
          e_month = " This month",
          k_month = " 이번 달";
        if (P_LANG == "VIE" || P_LANG == "KOR" || P_LANG == "ENG") {
          worksheet.spliceColumns(2, 2);
          col_del = 2;
          r_item = worksheet.getRow(8);
          worksheet.mergeCells("A8", "A10");
          worksheet.mergeCells("B8", "B10");
          worksheet.mergeCells("C8", "C10");
          r_item.getCell(1).value = P_LANG == "VIE" ? "Chỉ Tiêu" : P_LANG == "KOR" ? "항목" : "ITEM";
          r_item.getCell(2).value =
            P_LANG == "VIE"
              ? v_code
              : P_LANG == "ENG"
              ? e_code
              : P_LANG == "KOR"
              ? k_code
              : P_LANG == "KOR-VIE"
              ? k_code + v_code
              : P_LANG == "ENG-VIE"
              ? e_code + v_code
              : P_LANG == "ENG-KOR"
              ? e_code + k_code
              : P_LANG == "ENG-VIE-KOR"
              ? e_code + v_code + k_code
              : e_code;
          r_item.getCell(3).value =
            P_LANG == "VIE"
              ? v_note
              : P_LANG == "ENG"
              ? e_note
              : P_LANG == "KOR"
              ? k_note
              : P_LANG == "KOR-VIE"
              ? k_note + v_note
              : P_LANG == "ENG-VIE"
              ? e_note + v_note
              : P_LANG == "ENG-KOR"
              ? e_note + k_note
              : P_LANG == "ENG-VIE-KOR"
              ? e_note + v_note + k_note
              : e_note;
        } else if (P_LANG == "KOR-VIE" || P_LANG == "ENG-VIE" || P_LANG == "ENG-KOR") {
          worksheet.spliceColumns(3, 1);
          col_del = 1;
          r_item = worksheet.getRow(8);
          worksheet.mergeCells("A8", "A10");
          worksheet.mergeCells("B8", "B10");
          worksheet.mergeCells("C8", "C10");
          worksheet.mergeCells("D8", "D10");
          r_item.getCell(1).value = P_LANG == "KOR-VIE" ? "항목" : "ITEM";
          r_item.getCell(2).value = P_LANG == "ENG-KOR" ? "항목" : "Chỉ Tiêu";
          r_item.getCell(3).value =
            P_LANG == "VIE"
              ? v_code
              : P_LANG == "ENG"
              ? e_code
              : P_LANG == "KOR"
              ? k_code
              : P_LANG == "KOR-VIE"
              ? k_code + v_code
              : P_LANG == "ENG-VIE"
              ? e_code + v_code
              : P_LANG == "ENG-KOR"
              ? e_code + k_code
              : P_LANG == "ENG-VIE-KOR"
              ? e_code + v_code + k_code
              : e_code;
          r_item.getCell(4).value =
            P_LANG == "VIE"
              ? v_note
              : P_LANG == "ENG"
              ? e_note
              : P_LANG == "KOR"
              ? k_note
              : P_LANG == "KOR-VIE"
              ? k_note + v_note
              : P_LANG == "ENG-VIE"
              ? e_note + v_note
              : P_LANG == "ENG-KOR"
              ? e_note + k_note
              : P_LANG == "ENG-VIE-KOR"
              ? e_note + v_note + k_note
              : e_note;
        } else {
          r_item = worksheet.getRow(8);
          worksheet.mergeCells("A8", "A10");
          worksheet.mergeCells("B8", "B10");
          worksheet.mergeCells("C8", "C10");
          worksheet.mergeCells("D8", "D10");
          worksheet.mergeCells("E8", "E10");
          r_item.getCell(1).value = "ITEM";
          r_item.getCell(2).value = "Chỉ Tiêu";
          r_item.getCell(3).value = "항목";
          r_item.getCell(4).value =
            P_LANG == "VIE"
              ? v_code
              : P_LANG == "ENG"
              ? e_code
              : P_LANG == "KOR"
              ? k_code
              : P_LANG == "KOR-VIE"
              ? k_code + v_code
              : P_LANG == "ENG-VIE"
              ? e_code + v_code
              : P_LANG == "ENG-KOR"
              ? e_code + k_code
              : P_LANG == "ENG-VIE-KOR"
              ? e_code + v_code + k_code
              : e_code;
          r_item.getCell(5).value =
            P_LANG == "VIE"
              ? v_note
              : P_LANG == "ENG"
              ? e_note
              : P_LANG == "KOR"
              ? k_note
              : P_LANG == "KOR-VIE"
              ? k_note + v_note
              : P_LANG == "ENG-VIE"
              ? e_note + v_note
              : P_LANG == "ENG-KOR"
              ? e_note + k_note
              : P_LANG == "ENG-VIE-KOR"
              ? e_note + v_note + k_note
              : e_note;
        }

        r_item = worksheet.getRow(1);
        r_item.getCell(1).value = _BIZ_NM;
        r_item = worksheet.getRow(2);
        r_item.getCell(1).value = _BIZ_ADD;

        var p_YEAR = item.P_TO_DATE.substr(0, 4);
        var p_quater = item.P_HAFT_QUATER == 1 ? "I" : item.P_HAFT_QUATER == 2 ? "II" : item.P_HAFT_QUATER == 3 ? "III" : "IV";
        if (P_TYPE == 3 || P_TYPE == 4 || P_TYPE == 5) {
          worksheet.spliceColumns(6, 2);
          if (col_del == 0) {
            worksheet.mergeCells("F2", "G3");
            worksheet.mergeCells("F1", "G1");
            worksheet.mergeCells("F8", "G8");
            worksheet.mergeCells("F9", "F10");
            worksheet.mergeCells("G9", "G10");
          } else if (col_del == 1) {
            worksheet.mergeCells("E2", "F3");
            worksheet.mergeCells("E1", "F1");
            worksheet.mergeCells("E8", "F8");
            worksheet.mergeCells("E9", "E10");
            worksheet.mergeCells("F9", "F10");
          } else if (col_del == 2) {
            worksheet.mergeCells("D2", "E3");
            worksheet.mergeCells("D1", "E1");
            worksheet.mergeCells("D8", "E8");
            worksheet.mergeCells("D9", "D10");
            worksheet.mergeCells("E9", "E10");
          }
          del_yn = 2;
          r_item = worksheet.getRow(8);
          (v_month = "Năm"), (e_month = " Year"), (k_month = " 년도");
          r_item.getCell(6 - col_del).value =
            P_LANG == "VIE"
              ? v_month
              : P_LANG == "ENG"
              ? e_month
              : P_LANG == "KOR"
              ? k_month
              : P_LANG == "KOR-VIE"
              ? k_month + v_month
              : P_LANG == "ENG-VIE"
              ? e_month + v_month
              : P_LANG == "ENG-KOR"
              ? e_month + k_month
              : P_LANG == "ENG-VIE-KOR"
              ? e_month + v_month + k_month
              : e_month;
          r_item = worksheet.getRow(9);
          r_item.getCell(6 - col_del).value = "YEAR Năm " + p_YEAR;
          r_item.getCell(7 - col_del).value = "YEAR Năm" + (Number(p_YEAR) - 1);
          r_item = worksheet.getRow(6);
          r_item.getCell(1).value =
            (P_LANG == "VIE"
              ? v_fdate
              : P_LANG == "ENG"
              ? e_fdate
              : P_LANG == "KOR"
              ? k_fdate
              : P_LANG == "KOR-VIE"
              ? k_fdate + v_fdate
              : P_LANG == "ENG-VIE"
              ? e_fdate + v_fdate
              : P_LANG == "ENG-KOR"
              ? e_fdate + k_fdate
              : P_LANG == "ENG-VIE-KOR"
              ? e_fdate + v_fdate + k_fdate
              : e_fdate) +
            Utils._formatDate(item.P_FR_DATE, "DD/MM/YYYY") +
            (P_LANG == "VIE"
              ? v_tdate
              : P_LANG == "ENG"
              ? e_tdate
              : P_LANG == "KOR"
              ? k_tdate
              : P_LANG == "KOR-VIE"
              ? k_tdate + v_tdate
              : P_LANG == "ENG-VIE"
              ? e_tdate + v_tdate
              : P_LANG == "ENG-KOR"
              ? e_tdate + k_tdate
              : P_LANG == "ENG-VIE-KOR"
              ? e_tdate + v_tdate + k_tdate
              : e_tdate) +
            Utils._formatDate(item.P_TO_DATE, "DD/MM/YYYY");
        } else if (P_TYPE == 1) {
          worksheet.spliceColumns(6, 1);
          if (col_del == 0) {
            worksheet.mergeCells("G2", "H3");
            worksheet.mergeCells("G1", "H1");
            worksheet.mergeCells("F8", "F10");
            worksheet.mergeCells("G8", "G10");
            worksheet.mergeCells("H8", "H10");
          } else if (col_del == 1) {
            worksheet.mergeCells("F2", "G3");
            worksheet.mergeCells("F1", "G1");
            worksheet.mergeCells("E8", "E10");
            worksheet.mergeCells("F8", "F10");
            worksheet.mergeCells("G8", "G10");
          } else if (col_del == 2) {
            worksheet.mergeCells("E2", "F3");
            worksheet.mergeCells("E1", "F1");
            worksheet.mergeCells("E8", "E10");
            worksheet.mergeCells("F8", "F10");
            worksheet.mergeCells("D8", "D10");
          }

          r_item = worksheet.getRow(8);
          v_month = " Tháng này";
          e_month = " This month";
          k_month = " 이번 달";
          r_item.getCell(6 - col_del).value =
            P_LANG == "VIE"
              ? v_month
              : P_LANG == "ENG"
              ? e_month
              : P_LANG == "KOR"
              ? k_month
              : P_LANG == "KOR-VIE"
              ? k_month + v_month
              : P_LANG == "ENG-VIE"
              ? e_month + v_month
              : P_LANG == "ENG-KOR"
              ? e_month + k_month
              : P_LANG == "ENG-VIE-KOR"
              ? e_month + v_month + k_month
              : e_month;
          v_month = " Năm Trước";
          e_month = " Last Year";
          k_month = " 작년에";
          r_item.getCell(7 - col_del).value =
            P_LANG == "VIE"
              ? v_month
              : P_LANG == "ENG"
              ? e_month
              : P_LANG == "KOR"
              ? k_month
              : P_LANG == "KOR-VIE"
              ? k_month + v_month
              : P_LANG == "ENG-VIE"
              ? e_month + v_month
              : P_LANG == "ENG-KOR"
              ? e_month + k_month
              : P_LANG == "ENG-VIE-KOR"
              ? e_month + v_month + k_month
              : e_month;

          v_month = " Lũy kế đầu năm đến tháng này";
          e_month = " Accum. Year";
          k_month = " 축적 년";
          r_item.getCell(8 - col_del).value =
            P_LANG == "VIE"
              ? v_month
              : P_LANG == "ENG"
              ? e_month
              : P_LANG == "KOR"
              ? k_month
              : P_LANG == "KOR-VIE"
              ? k_month + v_month
              : P_LANG == "ENG-VIE"
              ? e_month + v_month
              : P_LANG == "ENG-KOR"
              ? e_month + k_month
              : P_LANG == "ENG-VIE-KOR"
              ? e_month + v_month + k_month
              : e_month;
          r_item = worksheet.getRow(6);
          r_item.getCell(1).value =
            (P_LANG == "VIE"
              ? v_fdate
              : P_LANG == "ENG"
              ? e_fdate
              : P_LANG == "KOR"
              ? k_fdate
              : P_LANG == "KOR-VIE"
              ? k_fdate + v_fdate
              : P_LANG == "ENG-VIE"
              ? e_fdate + v_fdate
              : P_LANG == "ENG-KOR"
              ? e_fdate + k_fdate
              : P_LANG == "ENG-VIE-KOR"
              ? e_fdate + v_fdate + k_fdate
              : e_fdate) +
            Utils._formatDate(item.P_FR_DATE, "DD/MM/YYYY") +
            (P_LANG == "VIE"
              ? v_tdate
              : P_LANG == "ENG"
              ? e_tdate
              : P_LANG == "KOR"
              ? k_tdate
              : P_LANG == "KOR-VIE"
              ? k_tdate + v_tdate
              : P_LANG == "ENG-VIE"
              ? e_tdate + v_tdate
              : P_LANG == "ENG-KOR"
              ? e_tdate + k_tdate
              : P_LANG == "ENG-VIE-KOR"
              ? e_tdate + v_tdate + k_tdate
              : e_tdate) +
            Utils._formatDate(item.P_TO_DATE, "DD/MM/YYYY");

          del_yn = 1;
        } else if (P_TYPE == 2 || P_TYPE == 6) {
          r_item = worksheet.getRow(6);
          r_item.getCell(1).value =
            (P_LANG == "VIE"
              ? v_fdate
              : P_LANG == "ENG"
              ? e_fdate
              : P_LANG == "KOR"
              ? k_fdate
              : P_LANG == "KOR-VIE"
              ? k_fdate + v_fdate
              : P_LANG == "ENG-VIE"
              ? e_fdate + v_fdate
              : P_LANG == "ENG-KOR"
              ? e_fdate + k_fdate
              : P_LANG == "ENG-VIE-KOR"
              ? e_fdate + v_fdate + k_fdate
              : e_fdate) +
            Utils._formatDate(item.P_FR_DATE, "DD/MM/YYYY") +
            (P_LANG == "VIE"
              ? v_tdate
              : P_LANG == "ENG"
              ? e_tdate
              : P_LANG == "KOR"
              ? k_tdate
              : P_LANG == "KOR-VIE"
              ? k_tdate + v_tdate
              : P_LANG == "ENG-VIE"
              ? e_tdate + v_tdate
              : P_LANG == "ENG-KOR"
              ? e_tdate + k_tdate
              : P_LANG == "ENG-VIE-KOR"
              ? e_tdate + v_tdate + k_tdate
              : e_tdate) +
            Utils._formatDate(item.P_TO_DATE, "DD/MM/YYYY");
          if (col_del == 0) {
            worksheet.mergeCells("H2", "I3");
            worksheet.mergeCells("H1", "I1");
            worksheet.mergeCells("F8", "G8");
            worksheet.mergeCells("F9", "F10");
            worksheet.mergeCells("G9", "G10");
            worksheet.mergeCells("H8", "I8");
            worksheet.mergeCells("H9", "H10");
            worksheet.mergeCells("I9", "I10");
          } else if (col_del == 1) {
            worksheet.mergeCells("G2", "H3");
            worksheet.mergeCells("G1", "H1");
            worksheet.mergeCells("E8", "F8");
            worksheet.mergeCells("E9", "E10");
            worksheet.mergeCells("F9", "F10");
            worksheet.mergeCells("G8", "H8");
            worksheet.mergeCells("G9", "G10");
            worksheet.mergeCells("H9", "H10");
          } else if (col_del == 2) {
            worksheet.mergeCells("F2", "G3");
            worksheet.mergeCells("F1", "G1");
            worksheet.mergeCells("D8", "E8");
            worksheet.mergeCells("E9", "E10");
            worksheet.mergeCells("D9", "D10");
            worksheet.mergeCells("F8", "G8");
            worksheet.mergeCells("F9", "F10");
            worksheet.mergeCells("G9", "G10");
          }

          var v_add = "",
            e_add = "",
            k_add = "";

          if (P_TYPE == 2) {
            v_month = " Quý " + p_quater + "/" + p_YEAR;
            e_month = " Quarter " + p_quater + "/" + p_YEAR;
            k_month = " 쿼터 " + p_quater + "/" + p_YEAR;
          }
          if (P_TYPE == 6) {
            v_add = " Nữa ";
            e_add = "";
            k_add = "";
            if (item.P_HAFT_QUATER == 5) {
              v_month = " FIRST HALF / " + p_YEAR;
              e_month = " FIRST HALF / " + p_YEAR;
              k_month = " FIRST HALF / " + p_YEAR;
            }
            if (item.P_HAFT_QUATER == 6) {
              v_month = " SECOND HALF / " + p_YEAR;
              e_month = " SECOND HALF / " + p_YEAR;
              k_month = " SECOND HALF / " + p_YEAR;
            }
          }
          r_item = worksheet.getRow(6);
          r_item.getCell(1).value =
            (P_LANG == "VIE"
              ? v_month
              : P_LANG == "ENG"
              ? e_month
              : P_LANG == "KOR"
              ? k_month
              : P_LANG == "KOR-VIE"
              ? k_month + v_month
              : P_LANG == "ENG-VIE"
              ? e_month + v_month
              : P_LANG == "ENG-KOR"
              ? e_month + k_month
              : P_LANG == "ENG-VIE-KOR"
              ? e_month + v_month + k_month
              : e_month) +
            " / " +
            (P_LANG == "VIE"
              ? v_fdate
              : P_LANG == "ENG"
              ? e_fdate
              : P_LANG == "KOR"
              ? k_fdate
              : P_LANG == "KOR-VIE"
              ? k_fdate + v_fdate
              : P_LANG == "ENG-VIE"
              ? e_fdate + v_fdate
              : P_LANG == "ENG-KOR"
              ? e_fdate + k_fdate
              : P_LANG == "ENG-VIE-KOR"
              ? e_fdate + v_fdate + k_fdate
              : e_fdate) +
            Utils._formatDate(item.P_FR_DATE, "DD/MM/YYYY") +
            (P_LANG == "VIE"
              ? v_tdate
              : P_LANG == "ENG"
              ? e_tdate
              : P_LANG == "KOR"
              ? k_tdate
              : P_LANG == "KOR-VIE"
              ? k_tdate + v_tdate
              : P_LANG == "ENG-VIE"
              ? e_tdate + v_tdate
              : P_LANG == "ENG-KOR"
              ? e_tdate + k_tdate
              : P_LANG == "ENG-VIE-KOR"
              ? e_tdate + v_tdate + k_tdate
              : e_tdate) +
            Utils._formatDate(item.P_TO_DATE, "DD/MM/YYYY");

          r_item = worksheet.getRow(8);
          r_item.getCell(6 - col_del).value =
            P_LANG == "VIE"
              ? v_month
              : P_LANG == "ENG"
              ? e_month
              : P_LANG == "KOR"
              ? k_month
              : P_LANG == "KOR-VIE"
              ? k_month + v_month
              : P_LANG == "ENG-VIE"
              ? e_month + v_month
              : P_LANG == "ENG-KOR"
              ? e_month + k_month
              : P_LANG == "ENG-VIE-KOR"
              ? e_month + v_month + k_month
              : e_month;
          v_month = " Lũy kế đầu năm đến tháng này";
          e_month = " Accum. Year";
          k_month = " 축적 년";
          r_item.getCell(8 - col_del).value =
            P_LANG == "VIE"
              ? v_month
              : P_LANG == "ENG"
              ? e_month
              : P_LANG == "KOR"
              ? k_month
              : P_LANG == "KOR-VIE"
              ? k_month + v_month
              : P_LANG == "ENG-VIE"
              ? e_month + v_month
              : P_LANG == "ENG-KOR"
              ? e_month + k_month
              : P_LANG == "ENG-VIE-KOR"
              ? e_month + v_month + k_month
              : e_month;

          r_item = worksheet.getRow(9);
          v_month = v_add + " Năm Trước";
          e_month = e_add + " Last Year";
          k_month = k_add + " 작년에";
          r_item.getCell(7 - col_del).value =
            P_LANG == "VIE"
              ? v_month
              : P_LANG == "ENG"
              ? e_month
              : P_LANG == "KOR"
              ? k_month
              : P_LANG == "KOR-VIE"
              ? k_month + v_month
              : P_LANG == "ENG-VIE"
              ? e_month + v_month
              : P_LANG == "ENG-KOR"
              ? e_month + k_month
              : P_LANG == "ENG-VIE-KOR"
              ? e_month + v_month + k_month
              : e_month;
          r_item.getCell(9 - col_del).value =
            P_LANG == "VIE"
              ? v_month
              : P_LANG == "ENG"
              ? e_month
              : P_LANG == "KOR"
              ? k_month
              : P_LANG == "KOR-VIE"
              ? k_month + v_month
              : P_LANG == "ENG-VIE"
              ? e_month + v_month
              : P_LANG == "ENG-KOR"
              ? e_month + k_month
              : P_LANG == "ENG-VIE-KOR"
              ? e_month + v_month + k_month
              : e_month;

          v_month = v_add + " Năm Nay";
          e_month = " This Year";
          k_month = " 올해";
          r_item.getCell(6 - col_del).value =
            P_LANG == "VIE"
              ? v_month
              : P_LANG == "ENG"
              ? e_month
              : P_LANG == "KOR"
              ? k_month
              : P_LANG == "KOR-VIE"
              ? k_month + v_month
              : P_LANG == "ENG-VIE"
              ? e_month + v_month
              : P_LANG == "ENG-KOR"
              ? e_month + k_month
              : P_LANG == "ENG-VIE-KOR"
              ? e_month + v_month + k_month
              : e_month;
          r_item.getCell(8 - col_del).value =
            P_LANG == "VIE"
              ? v_month
              : P_LANG == "ENG"
              ? e_month
              : P_LANG == "KOR"
              ? k_month
              : P_LANG == "KOR-VIE"
              ? k_month + v_month
              : P_LANG == "ENG-VIE"
              ? e_month + v_month
              : P_LANG == "ENG-KOR"
              ? e_month + k_month
              : P_LANG == "ENG-VIE-KOR"
              ? e_month + v_month + k_month
              : e_month;

          del_yn = 0;
        }
        r_item = worksheet.getRow(5);
        r_item.getCell(1).value = v_title; //(P_LANG == 'VIE'?v_title:P_LANG == 'ENG'?e_title:P_LANG == 'KOR'?k_title:P_LANG == 'KOR-VIE'?k_title+v_title:P_LANG == 'ENG-VIE'?e_title+v_title:P_LANG == 'ENG-KOR'?e_title+k_title:P_LANG == 'ENG-VIE-KOR'?e_title+v_title+k_title:e_title) ;

        r_item = worksheet.getRow(1);
        r_item.getCell(8 - del_yn - col_del).value = no_title + no;

        r_item = worksheet.getRow(2);
        r_item.getCell(8 - del_yn - col_del).value = P_HEADER;

        r_item = worksheet.getRow(7);
        r_item.getCell(9 - del_yn - col_del).value =
          "(" +
          (P_LANG == "VIE"
            ? v_dvt
            : P_LANG == "ENG"
            ? e_dvt
            : P_LANG == "KOR"
            ? k_dvt
            : P_LANG == "KOR-VIE"
            ? k_dvt + v_dvt
            : P_LANG == "ENG-VIE"
            ? e_dvt + v_dvt
            : P_LANG == "ENG-KOR"
            ? e_dvt + k_dvt
            : P_LANG == "ENG-VIE-KOR"
            ? e_dvt + v_dvt + k_dvt
            : e_dvt) +
          ": " +
          item.P_BOOK_CCY +
          ")";

        var pos = 11,
          pos_copy = 12;
        if (dt_Data.length > 1) {
          worksheet.duplicateRow(pos_copy, dt_Data.length - 3, true);
        }
        for (var i = 0; i < dt_Data.length; i++) {
          var row_item = worksheet.getRow(pos + i);
          if (col_del == 0) {
            row_item.getCell(1).value = dt_Data[i].PRN_ACNM;
            row_item.getCell(2).value = dt_Data[i].PRN_LACNM;
            row_item.getCell(3).value = dt_Data[i].PRN_KACNM;
          } else if (col_del == 1) {
            row_item.getCell(1).value = P_LANG == "KOR-VIE" ? dt_Data[i].PRN_KACNM : dt_Data[i].PRN_ACNM;
            row_item.getCell(2).value = P_LANG == "ENG-KOR" ? dt_Data[i].PRN_KACNM : dt_Data[i].PRN_LACNM;
          } else if (col_del == 2) {
            var data = dt_Data[i].PRN_ACNM;
            if (P_LANG == "VIE") {
              data = dt_Data[i].PRN_LACNM;
            }
            if (P_LANG == "KOR") {
              data = dt_Data[i].PRN_KACNM;
            }
            if (P_LANG == "ENG") {
              data = dt_Data[i].PRN_ACNM;
            }
            row_item.getCell(1).value = data;
          }
          row_item.getCell(4 - col_del).value = dt_Data[i].CODE;
          row_item.getCell(5 - col_del).value = dt_Data[i].HEADER;
          if (P_TYPE == 1) {
            row_item.getCell(6 - col_del).value = dt_Data[i].M_PS;
            row_item.getCell(7 - col_del).value = dt_Data[i].M_PS1;
            row_item.getCell(8 - col_del).value = dt_Data[i].M_ACC;
          }
          if (P_TYPE == 3 || P_TYPE == 4 || P_TYPE == 5) {
            row_item.getCell(6 - col_del).value = dt_Data[i].M_PS;
            row_item.getCell(7 - col_del).value = dt_Data[i].M_PS1;
          }
          if (P_TYPE == 2 || P_TYPE == 6) {
            row_item.getCell(6 - col_del).value = dt_Data[i].M_PS;
            row_item.getCell(7 - col_del).value = dt_Data[i].M_PS1;
            row_item.getCell(8 - col_del).value = dt_Data[i].M_ACC;
            row_item.getCell(9 - col_del).value = dt_Data[i].M_ACC1;
          }
        }
        pos = pos + dt_Data.length + 1;
        row_item = worksheet.getRow(pos);
        if (dt_Data_sign.length > 1) {
          for (var i = 0; i < dt_Data_sign.length; i++) {
            if (P_LANG == "VIE") {
              if (dt_Data_sign[i].CODE == "VIE") {
                row_item.getCell(1).value = dt_Data_sign[i].VAL1;
                row_item.getCell(1).font = { bold: true, italic: false };
                row_item.getCell(1).alignment = { vertical: "middle", horizontal: "center" };
                worksheet.mergeCells(pos, 2, pos, 3);
                row_item.getCell(2).value = dt_Data_sign[i].VAL2;
                row_item.getCell(2).font.bold = true;
                row_item.getCell(2).alignment = { vertical: "middle", horizontal: "center" };
                worksheet.mergeCells(pos, 5, pos, 6);
                row_item.getCell(5).value = dt_Data_sign[i].VAL3;
                row_item.getCell(5).font.bold = true;
                row_item.getCell(5).alignment = { vertical: "middle", horizontal: "center" };
              }

              row_item = worksheet.getRow(pos + 1);
              if (dt_Data_sign[i].CODE == "VIE_SIG") {
                worksheet.mergeCells(pos + 1, 2, pos + 1, 3);
                worksheet.mergeCells(pos + 1, 5, pos + 1, 6);
                row_item.getCell(1).value = dt_Data_sign[i].VAL1;
                row_item.getCell(1).font.bold = false;
                row_item.getCell(2).value = dt_Data_sign[i].VAL2;
                row_item.getCell(2).font.bold = false;
                row_item.getCell(5).value = dt_Data_sign[i].VAL3;
                row_item.getCell(5).font.bold = false;
                row_item.getCell(1).alignment = { vertical: "middle", horizontal: "center" };
                row_item.getCell(2).alignment = { vertical: "middle", horizontal: "center" };
                row_item.getCell(5).alignment = { vertical: "middle", horizontal: "center" };
              }
            }
            if (P_LANG == "KOR") {
              if (dt_Data_sign[i].CODE == "KOR") {
                worksheet.mergeCells(pos, 2, pos, 3);
                worksheet.mergeCells(pos, 5, pos, 6);
                row_item.getCell(1).value = dt_Data_sign[i].VAL1;
                row_item.getCell(1).font.bold = true;
                row_item.getCell(2).value = dt_Data_sign[i].VAL2;
                row_item.getCell(2).font.bold = true;
                row_item.getCell(5).value = dt_Data_sign[i].VAL3;
                row_item.getCell(5).font.bold = true;
                row_item.getCell(1).alignment = { vertical: "middle", horizontal: "center" };
                row_item.getCell(2).alignment = { vertical: "middle", horizontal: "center" };
                row_item.getCell(5).alignment = { vertical: "middle", horizontal: "center" };
              }

              row_item = worksheet.getRow(pos + 1);
              if (dt_Data_sign[i].CODE == "KOR_SIG") {
                worksheet.mergeCells(pos + 1, 2, pos + 1, 3);
                worksheet.mergeCells(pos + 1, 5, pos + 1, 6);
                row_item.getCell(1).value = dt_Data_sign[i].VAL1;
                row_item.getCell(1).font.bold = false;
                row_item.getCell(2).value = dt_Data_sign[i].VAL2;
                row_item.getCell(2).font.bold = false;
                row_item.getCell(5).value = dt_Data_sign[i].VAL3;
                row_item.getCell(5).font.bold = false;
                row_item.getCell(1).alignment = { vertical: "middle", horizontal: "center" };
                row_item.getCell(2).alignment = { vertical: "middle", horizontal: "center" };
                row_item.getCell(5).alignment = { vertical: "middle", horizontal: "center" };
              }
            }
            if (P_LANG == "ENG") {
              if (dt_Data_sign[i].CODE == "ENG") {
                worksheet.mergeCells(pos, 2, pos, 3);
                worksheet.mergeCells(pos, 5, pos, 6);
                row_item.getCell(1).value = dt_Data_sign[i].VAL1;
                row_item.getCell(1).font.bold = true;
                row_item.getCell(2).value = dt_Data_sign[i].VAL2;
                row_item.getCell(2).font.bold = true;
                row_item.getCell(5).value = dt_Data_sign[i].VAL3;
                row_item.getCell(5).font.bold = true;
                row_item.getCell(1).alignment = { vertical: "middle", horizontal: "center" };
                row_item.getCell(2).alignment = { vertical: "middle", horizontal: "center" };
                row_item.getCell(5).alignment = { vertical: "middle", horizontal: "center" };
              }

              row_item = worksheet.getRow(pos + 1);
              if (dt_Data_sign[i].CODE == "ENG_SIG") {
                worksheet.mergeCells(pos + 1, 2, pos + 1, 3);
                worksheet.mergeCells(pos + 1, 5, pos + 1, 6);
                row_item.getCell(1).value = dt_Data_sign[i].VAL1;
                row_item.getCell(1).font.bold = false;
                row_item.getCell(2).value = dt_Data_sign[i].VAL2;
                row_item.getCell(2).font.bold = false;
                row_item.getCell(5).value = dt_Data_sign[i].VAL3;
                row_item.getCell(5).font.bold = false;
                row_item.getCell(1).alignment = { vertical: "middle", horizontal: "center" };
                row_item.getCell(2).alignment = { vertical: "middle", horizontal: "center" };
                row_item.getCell(5).alignment = { vertical: "middle", horizontal: "center" };
              }
            }
            if (dt_Data_sign[i].CODE == "NAME") {
              row_item = worksheet.getRow(pos + 2);
              row_item.getCell(1).value = dt_Data_sign[i].VAL1;
              row_item.getCell(5).font.bold = false;
              row_item.getCell(2).value = dt_Data_sign[i].VAL2;
              row_item.getCell(5).font.bold = false;
              row_item.getCell(5).value = dt_Data_sign[i].VAL3;
              row_item.getCell(5).font.bold = false;
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
  async rpt_6045085_T1_BAL_SHEET({ request, response, auth }) {
    try {
      /*P_RPT_ID: report_info.VAL1, P_RPT_FILE: report_info.VAL2,
            P_COMPANY: this.sel_Company, P_DT_MONTH: this.dt_mmyy, P_VAT_TYPE: this.sel_VatType, P_TAX_RATE: this.sel_TaxRate, 
            P_CURRENT_CCY: this.sel_Ccy, P_STATUS: this.sel_Status, P_CUST_PK: this.txt_Customer_PK, P_INVOICE_NO: this.txt_InvoiceNo,
            P_AC_CD: this.txt_ACC_CD, P_SEQ: this.txt_Seq, P_VOUCHER_NO: this.sel_VoucherType, P_BALANCE: this.sel_Banlance,
            P_DT_FR: this.dt_from, P_DT_TO: this.dt_to, P_BIZ: this.sel_Bizpalce*/
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
      var _BIZ_ID = item.P_BIZ_ID,
        _BIZ_NM = item.P_BIZ_NM,
        _BIZ_TAX = item.P_BIZ_TAX,
        _BIZ_ADD = item.P_BIZ_ADD;
      var _store = "AC_SEL_6045085_BALANCE_SHEET";
      var _param = [
        item.P_COMPANY,
        item.P_FR_DATE,
        item.P_TO_DATE,
        item.P_STATUS,
        item.P_BOOK_EX_RATE,
        item.P_CONVERT_CCY,
        item.P_CONVERT_EX_RATE,
        item.P_SCALE,
        item.P_FORM_TYPE,
        item.P_TCO_BUSPLACE_PK,
      ];
      var _ac_code = "EACAB031";
      var _store_sign = "ac_rpt_6045085_sign";
      var _param_sign = [item.P_COMPANY, _ac_code];
      /***************************** Return failded ****************************/

      if (!user) {
        return response.send(Utils.response(false, "Request failed!", null));
      } else {
      /****************************** Begin call store and write excell *********/
        /********* Call store sign ***************/
        var dt_Data_sign = await DBService.callProcCursor(_store_sign, _param_sign, p_language, p_crt_by);
        if (dt_Data_sign) {
          dt_Data_sign = dt_Data_sign;
        }
        /********* Call store  ***************/

        var dt_Data = await DBService.callProcCursor(_store, _param, p_language, p_crt_by);
        if (dt_Data) {
          dt_Data = dt_Data;
        } else {
          return response.send(Utils.response(false, "no_data_found", null));
        }
        /********* Read file excel ********/
        const templateFile = Helpers.resourcesPath(_resourcesPath);
        await workbook.xlsx.readFile(templateFile);
        var worksheet = workbook.getWorksheet(1);
        /********* Write file excel ********/
        var r_item = worksheet.getRow(1);
        var P_LANG = item.P_LANG;
        //  var v_title = " BẢNG CÂN ĐỐI KẾ TOÁN", e_title = " BALANCE SHEET", k_title = " 대차대조표";
        var v_title = dt_Data[0].V_TITLE;
        var v_date = "As at: ";
        var no = ": B01 - DN";
        var no_title = P_LANG == "VIE" ? "Mẫu Số" : "Form";
        var P_HEADER = P_LANG == "VIE" ? item.P_CIRCULARS_VIE : item.P_CIRCULARS_ENG;
        var c_item = "Code",
          c_head = "Header",
          c_close = "Closing",
          c_open = "Opening";
        var c_unit = "Unit";
        var col_del = 0;

        if (P_LANG == "VIE") {
          c_item = "Mã số";
          c_head = "Thuyết minh";
          c_close = "Số dư cuối kỳ";
          c_open = "Số đầu kỳ";
          c_unit = "Đơn vị:";
          v_date = "Tại ngày: " + Utils._formatDate(item.P_TO_DATE, "DD/MM/YYYY");

          col_del = 2;
        } else if (P_LANG == "ENG") {
          c_item = "Code";
          c_head = "Header";
          c_close = "Closing";
          c_open = "Opening";
          c_unit = "Unit:";
          v_date = "As at: " + Utils._formatDate(item.P_TO_DATE, "MM/DD/YYYY");
          col_del = 2;
        } else if (P_LANG == "KOR") {
          c_item = "코드";
          c_head = "비고";
          c_close = "기말";
          c_open = "기초";
          c_unit = "단위:";
          v_date = "현재: " + Utils._formatDate(item.P_TO_DATE, "YYYY-MM-DD");
          col_del = 2;
        } else if (P_LANG == "ENG-VIE") {
          c_item = "Code \n Mã số";
          c_head = "Header \n Thuyết minh";
          c_close = "Closing \n Số dư cuối kỳ ";
          c_open = "Opening \n Số đầu kỳ";
          c_unit = "Unit/Đơn vị:";
          v_date = "As at/Tại ngày: " + Utils._formatDate(item.P_TO_DATE, "MM/DD/YYYY");
          col_del = 1;
        } else if (P_LANG == "KOR-VIE") {
          c_item = "코드 \n Mã số";
          c_head = "비고 \n Thuyết minh";
          c_close = "기말 \n Số dư cuối kỳ";
          c_open = "기초 \n Số đầu kỳ";
          c_unit = "Unit/Đơn vị:";
          v_date = "현재/Tại ngày: " + Utils._formatDate(item.P_TO_DATE, "YYYY-MM-DD");
          col_del = 1;
        } else if (P_LANG == "ENG-KOR") {
          c_item = "Code \n 코드";
          c_head = "Header \n 비고";
          c_close = "Closing \n 기말 ";
          c_open = "Opening \n 기초";
          c_unit = "Unit/단위:";
          v_date = "As at/현재: " + Utils._formatDate(item.P_TO_DATE, "MM/DD/YYYY");
          col_del = 1;
        } else {
          c_item = "Code";
          c_head = "Header";
          c_close = "Closing";
          c_open = "Opening";
          c_unit = "Unit:";
          v_date = "As at: " + Utils._formatDate(item.P_TO_DATE, "MM/DD/YYYY");
          col_del = 2;
        }
        c_unit = c_unit + " " + item.P_CONVERT_CCY;
        r_item = worksheet.getRow(8);
        r_item.getCell(7).value = c_unit;

        r_item = worksheet.getRow(9);
        r_item.getCell(4).value = c_item;
        r_item.getCell(5).value = c_head;
        r_item.getCell(6).value = c_close;
        r_item.getCell(7).value = c_open;
        if (r_item.getCell(7).font.bold == false) {
          r_item.getCell(7).font.bold = true;
        }
        r_item = worksheet.getRow(14);
        r_item.getCell(4).value = c_item;
        r_item.getCell(5).value = c_head;
        r_item.getCell(6).value = c_close;
        r_item.getCell(7).value = c_open;
        //  r_item.font.bold = true;
        r_item = worksheet.getRow(19);
        r_item.getCell(4).value = c_item;
        r_item.getCell(5).value = c_head;
        r_item.getCell(6).value = c_close;
        r_item.getCell(7).value = c_open;
        //  r_item.font.bold = true;

        var pos = 11,
          pos_copy = 12;

        var row_group_a = 0,
          row_group_b = 0,
          row_group_c = 0;
        if (item.P_CIRCULARS == "200") {
          for (var i = 0; i < dt_Data.length; i++) {
            if (Number(dt_Data[i].CODE.replace("a", "").replace("b", "")) <= 270) {
              row_group_a++;
            } else {
              row_group_b++;
            }
          }
          worksheet.spliceRows(pos_copy + 6, 4);
        } else if (item.P_CIRCULARS == "015") {
          for (var i = 0; i < dt_Data.length; i++) {
            if (i >= 0 && i < 52) {
              row_group_a++;
            } else if (i >= 53 && i < 90) {
              row_group_b++;
            } else if (i >= 90) {
              row_group_c++;
            }
          }
        }

        //  setTimeout(function(){
        if (row_group_c > 1) {
          Utils.excelInsertRows(worksheet, pos_copy + 9, row_group_c - 2);
          //worksheet.duplicateRow(pos_copy+9, row_group_c - 2 ,true);
        }

        if (row_group_b > 1) {
          Utils.excelInsertRows(worksheet, pos_copy + 4, row_group_b - 2);
          //worksheet.duplicateRow(pos_copy+4, row_group_b - 2 ,true);
        }

        if (row_group_a > 1) {
          Utils.excelInsertRows(worksheet, pos_copy, row_group_a - 2);
          //worksheet.duplicateRow(pos_copy,row_group_a - 2,true);
        }

        //  },500)

        for (var i = 0; i < dt_Data.length; i++) {
          var row_item;
          if (item.P_CIRCULARS == "200") {
            if (Number(dt_Data[i].CODE.replace("a", "").replace("b", "")) <= 270) {
              row_item = worksheet.getRow(pos + i);
            } else {
              row_item = worksheet.getRow(pos + i + 3);
            }
          } else if (item.P_CIRCULARS == "015") {
            if (i >= 0 && i < 52) {
              row_item = worksheet.getRow(pos + i);
            } else if (i >= 53 && i < 90) {
              row_item = worksheet.getRow(pos + i + 2);
            } else if (i >= 90) {
              row_item = worksheet.getRow(pos + i + 5);
            }
          }
          /**Tuyen*/
          row_item.getCell(1).value = dt_Data[i].PRN_ACNM;
          row_item.getCell(2).value = dt_Data[i].PRN_LACNM;
          row_item.getCell(3).value = dt_Data[i].PRN_KACNM;
          row_item.getCell(4).value = dt_Data[i].CODE;
          row_item.getCell(5).value = dt_Data[i].HEADER;
          row_item.getCell(6).value = dt_Data[i].CLOSING;
          row_item.getCell(7).value = dt_Data[i].OPENNING;
          //  row_item.getCell(8).value = dt_Data[i].FONT_STYPE ;
          // row_item.getCell(8).value = dt_Data[i].PRN_COLOR ;
          row_item.getCell(4).alignment = { vertical: "middle", horizontal: "center" };
          if (dt_Data[i].FONT_STYPE == "B") {
            for (var x = 1; x <= 7; x++) {
              row_item.getCell(x).font = { italic: false, bold: true, color: { argb: "000000" }, size: 10, name: "Times New Roman" };
            }
          } else {
            for (var x = 1; x <= 7; x++) {
              row_item.getCell(x).font = { italic: false, bold: false, color: { argb: "000000" }, size: 10, name: "Times New Roman" };
            }
          }
          /*tuyen*/
        } //end loop
        if (P_LANG == "VIE") {
          worksheet.spliceColumns(3, 1);
          worksheet.spliceColumns(1, 1);
        } else if (P_LANG == "KOR") {
          worksheet.spliceColumns(1, 2);
        } else if (P_LANG == "ENG") {
          worksheet.spliceColumns(2, 2);
        } else if (P_LANG == "KOR-VIE") {
          worksheet.spliceColumns(1, 1);
        } else if (P_LANG == "ENG-VIE") {
          worksheet.spliceColumns(3, 1);
        } else if (P_LANG == "ENG-KOR") {
          worksheet.spliceColumns(2, 1);
        }

        // worksheet.spliceColumns(6,15); /*delete column not use */
        var row_item;
        row_item = worksheet.getRow(1);
        row_item.getCell(1).value = _BIZ_NM;
        row_item = worksheet.getRow(2);
        row_item.getCell(1).value = _BIZ_ADD;
        row_item = worksheet.getRow(5);
        row_item.getCell(1).value = v_title; // (P_LANG == 'VIE'?v_title:P_LANG == 'ENG'?e_title:P_LANG == 'KOR'?k_title:P_LANG == 'KOR-VIE'?k_title+'/'+v_title:P_LANG == 'ENG-VIE'?e_title+'/'+v_title:P_LANG == 'ENG-KOR'?e_title+'/'+k_title:P_LANG == 'ENG-VIE-KOR'?e_title+'/'+v_title+'/'+k_title:e_title) ;
        row_item = worksheet.getRow(6);
        row_item.getCell(1).value = v_date;

        if (col_del == 2) {
          row_item = worksheet.getRow(1);
          row_item.getCell(5).value = no_title + no;
          worksheet.mergeCells("D2:E3");
          worksheet.mergeCells("A5:E5");
          row_item = worksheet.getRow(5);
          row_item.getCell(1).alignment = { vertical: "middle", horizontal: "center" };
          worksheet.mergeCells("A6:E6");
          row_item = worksheet.getRow(6);
          row_item.getCell(1).alignment = { vertical: "middle", horizontal: "center" };
          row_item = worksheet.getRow(2);
          row_item.getCell(4).value = P_HEADER;
        } else if (col_del == 1) {
          row_item = worksheet.getRow(1);
          row_item.getCell(6).value = no_title + no;
          worksheet.mergeCells("E2:F3");
          worksheet.mergeCells("A5:F5");
          row_item = worksheet.getRow(5);
          row_item.getCell(1).alignment = { vertical: "middle", horizontal: "center" };
          worksheet.mergeCells("A6:F6");
          row_item = worksheet.getRow(6);
          row_item.getCell(1).alignment = { vertical: "middle", horizontal: "center" };
          row_item = worksheet.getRow(2);
          row_item.getCell(5).value = P_HEADER;
        }
        /************sign */
        pos = pos + dt_Data.length + 5;

        if (dt_Data_sign.length > 1) {
          for (var i = 0; i < dt_Data_sign.length; i++) {
            if (P_LANG == "VIE") {
              row_item = worksheet.getRow(pos);
              if (dt_Data_sign[i].CODE == "VIE") {
                row_item.getCell(1).value = dt_Data_sign[i].VAL1;
                row_item.getCell(1).font = { bold: true, italic: false };
                row_item.getCell(1).alignment = { vertical: "middle", horizontal: "center" };
                worksheet.mergeCells(pos, 2, pos, 3);
                row_item.getCell(2).value = dt_Data_sign[i].VAL2;
                row_item.getCell(2).font.bold = true;
                row_item.getCell(2).alignment = { vertical: "middle", horizontal: "center" };
                worksheet.mergeCells(pos, 4, pos, 5);
                row_item.getCell(5).value = dt_Data_sign[i].VAL3;
                row_item.getCell(5).font.bold = true;
                row_item.getCell(5).alignment = { vertical: "middle", horizontal: "center" };
              }

              row_item = worksheet.getRow(pos + 1);
              if (dt_Data_sign[i].CODE == "VIE_SIG") {
                row_item.getCell(1).value = dt_Data_sign[i].VAL1;
                row_item.getCell(1).font.bold = false;
                row_item.getCell(1).alignment = { vertical: "middle", horizontal: "center" };
                worksheet.mergeCells(pos + 1, 2, pos + 1, 3);
                row_item.getCell(2).value = dt_Data_sign[i].VAL2;
                row_item.getCell(2).font.bold = false;
                worksheet.mergeCells(pos + 1, 4, pos + 1, 5);
                row_item.getCell(4).value = dt_Data_sign[i].VAL3;
                row_item.getCell(4).font.bold = false;
                row_item.getCell(4).alignment = { vertical: "middle", horizontal: "center" };
                row_item.getCell(2).alignment = { vertical: "middle", horizontal: "center" };
              }
            }
            if (P_LANG == "KOR" || P_LANG == "KOR-VIE") {
              row_item = worksheet.getRow(pos);
              if (dt_Data_sign[i].CODE == "KOR") {
                worksheet.mergeCells(pos, 2, pos, 3);
                worksheet.mergeCells(pos, 4, pos, 5);
                row_item.getCell(1).value = dt_Data_sign[i].VAL1;
                row_item.getCell(1).font.bold = true;
                row_item.getCell(1).alignment = { vertical: "middle", horizontal: "center" };
                row_item.getCell(2).value = dt_Data_sign[i].VAL2;
                row_item.getCell(2).font.bold = true;
                row_item.getCell(2).alignment = { vertical: "middle", horizontal: "center" };
                row_item.getCell(5).value = dt_Data_sign[i].VAL3;
                row_item.getCell(5).font.bold = true;
                row_item.getCell(5).alignment = { vertical: "middle", horizontal: "center" };
              }

              row_item = worksheet.getRow(pos + 1);
              if (dt_Data_sign[i].CODE == "KOR_SIG") {
                worksheet.mergeCells(pos + 1, 2, pos + 1, 3);
                worksheet.mergeCells(pos + 1, 4, pos + 1, 5);
                row_item.getCell(1).value = dt_Data_sign[i].VAL1;
                row_item.getCell(1).font.bold = false;
                row_item.getCell(1).alignment = { vertical: "middle", horizontal: "center" };
                row_item.getCell(2).value = dt_Data_sign[i].VAL2;
                row_item.getCell(2).font.bold = false;
                row_item.getCell(2).alignment = { vertical: "middle", horizontal: "center" };
                row_item.getCell(5).value = dt_Data_sign[i].VAL3;
                row_item.getCell(5).font.bold = false;
                row_item.getCell(5).alignment = { vertical: "middle", horizontal: "center" };
                row_item.getCell(2).alignment = { vertical: "middle", horizontal: "center" };
              }
            }
            if (P_LANG == "ENG" || P_LANG == "ENG-KOR" || P_LANG == "ENG-VIE") {
              row_item = worksheet.getRow(pos);
              if (dt_Data_sign[i].CODE == "ENG") {
                worksheet.mergeCells(pos, 2, pos, 3);
                worksheet.mergeCells(pos, 4, pos, 5);
                row_item.getCell(1).value = dt_Data_sign[i].VAL1 + dt_Data_sign[i].VAL1;
                row_item.getCell(1).font.bold = true;
                row_item.getCell(1).alignment = { vertical: "middle", horizontal: "center" };
                row_item.getCell(2).value = dt_Data_sign[i].VAL2;
                row_item.getCell(2).font.bold = true;
                row_item.getCell(2).alignment = { vertical: "middle", horizontal: "center" };
                row_item.getCell(5).value = dt_Data_sign[i].VAL3;
                row_item.getCell(5).font.bold = true;
                row_item.getCell(5).alignment = { vertical: "middle", horizontal: "center" };
              }

              row_item = worksheet.getRow(pos + 1);
              if (dt_Data_sign[i].CODE == "ENG_SIG") {
                worksheet.mergeCells(pos + 1, 2, pos + 1, 3);
                worksheet.mergeCells(pos + 1, 4, pos + 1, 5);
                row_item.getCell(1).value = dt_Data_sign[i].VAL1;
                row_item.getCell(1).alignment = { vertical: "middle", horizontal: "center" };
                row_item.getCell(2).value = dt_Data_sign[i].VAL2;
                row_item.getCell(5).value = dt_Data_sign[i].VAL3;
                row_item.getCell(5).alignment = { vertical: "middle", horizontal: "center" };
                row_item.getCell(2).alignment = { vertical: "middle", horizontal: "center" };
                row_item.getCell(1).font.bold = false;
                row_item.getCell(2).font.bold = false;
                row_item.getCell(5).font.bold = false;
              }
            }
            if (dt_Data_sign[i].CODE == "NAME") {
              row_item = worksheet.getRow(pos + 2);
              row_item.getCell(1).value = dt_Data_sign[i].VAL1;
              row_item.getCell(1).font.bold = false;
              row_item.getCell(2).value = dt_Data_sign[i].VAL2;
              row_item.getCell(2).font.bold = false;
              row_item.getCell(5).value = dt_Data_sign[i].VAL3;
              row_item.getCell(2).font.bold = false;
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
module.exports = rpt6045085;
