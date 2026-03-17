"use strict";
const Helpers = use("Helpers");
const Antl = use("Antl");
const Utils = use("Utils");
const DBService = use("DBService");
var Excel = use("exceljs");
var workbook = new Excel.Workbook();
class rptCS50060 {
  async rpt_CS50060({ request, response, auth }) {
    try {
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

      var _param = [
        item.P_COMPANY,
        item.P_TCO_BUSPLACE_PK,
        item.P_CONSIGNOR_PK,
        item.P_DATE_FROM,
        item.P_DATE_TO,
      ];

      /***************************** Return failded ****************************/
      if (!user) {
        return response.send(Utils.response(false, "Request failed!", null));
      } else {
      /****************************** Begin call store and write excell *********/
        /********* Call store  ***************/

        var dt_m = await DBService.callProcCursor(
          "CW_RPT_CS50060_2_NOCACHE",
          _param,
          p_language,
          p_crt_by
        );
        var dt = await DBService.callProcCursor(
          "CW_RPT_CS50060_1_NOCACHE",
          _param,
          p_language,
          p_crt_by
        );

        if (dt.length > 0) 
        {
          dt = dt;
          dt_m = dt_m;
        } else 
        {
          return response.send(Utils.response(false, "no_data_found", null));
        }
        /********* Read file excel ********/

        const templateFile = Helpers.resourcesPath(_resourcesPath);
        await workbook.xlsx.readFile(templateFile);
        var worksheet = workbook.getWorksheet(1);
        /********* Write file excel ********/
        var pos = 9;
        var l_rows = dt.length;
        if (dt.length > 1) 
        {
          worksheet.duplicateRow(10, dt.length - 3, true);
          worksheet.getCell("D5").value = dt_m[0].PARTNER_NAME;
          worksheet.getCell("D6").value = dt_m[0].PERIOD_; //
        }

        for (var i = 0; i < dt.length; i++) 
        {
          var row_item = worksheet.getRow(pos + i);
          worksheet.unMergeCells(pos + i, 1, pos + i, 12);
          row_item.getCell(1).value = i + 1;
          row_item.getCell(2).value = dt[i].SERVICE_CHARGE;
          for (let index = 2; index < Object.keys(dt[0]).length; index++) 
          {
            var data_d = Object.keys(dt[0])[index];
            row_item.getCell(3 + index).value = dt[i][data_d];
          }
          worksheet.mergeCells(pos + i, 2, pos + i, 4);
          row_item.commit();
        }

        for (let index = 2; index < Object.keys(dt[0]).length; index++) 
        {
          var row_header = worksheet.getRow(8);
          var row_sum = worksheet.getRow(9 + l_rows);
          var data_f = Object.keys(dt[0])[index];
          row_header.getCell(3 + index).value = data_f.split("_")[1];
          // row_sum.getCell(3+index).value   = { formula 'F12+F15'};
        }
        /********* Print file excel ********/
        const reportFile = Helpers.tmpPath(file_new);

        await workbook.xlsx.writeFile(reportFile);
        if (item.P_FILE_TYPE == ".xlsx") 
        {
          return response.attachment(reportFile, file_nm + item.P_FILE_TYPE);
        }

        if (item.P_FILE_TYPE == ".pdf") 
        {
          const reportFilePdf = await Utils.excelToPdf(reportFile);
          return response.attachment(reportFilePdf, file_nm + item.P_FILE_TYPE);
        }
      }
    } catch (e) {
      return response.send(Utils.response(false, e.message, null));
    }
  }
}

module.exports = rptCS50060;
