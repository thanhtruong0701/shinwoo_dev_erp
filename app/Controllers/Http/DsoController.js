"use strict";
const Helpers = use("Helpers");
const Utils = use("Utils");
const Request = use("Request");
const Firebase = use("Firebase");
const AES = use("AES");
const Env = use("Env");
const fs = use("fs");
const HOST = Env.get("HOST");
const APP_KEY = Env.get("APP_KEY");
const APP_URL_LOCAL = Env.get("APP_URL_LOCAL", Env.get("APP_URL"));
const _ROOT_DIR_FILES = Env.get("ROOT_DIR_FILES", Helpers.tmpPath());
const _ROOT_DIR_FILE1 = Env.get("ROOT_DIR_FILE1", Helpers.tmpPath());
const _ROOT_DIR_FILE2 = Env.get("ROOT_DIR_FILE2", Helpers.tmpPath());
const _ROOT_DIR_FILES_EXCEL = Env.get("ROOT_DIR_FILES", Helpers.tmpPath());
const CLEAR_CACHE_URL1 = Env.get("CLEAR_CACHE_URL1", "NOCLEAR");
const CLEAR_CACHE_URL2 = Env.get("CLEAR_CACHE_URL2", "NOCLEAR");
const SESSION_TIMEOUT = Env.get("SESSION_TIMEOUT", 60);
const API_SESSION_TIMEOUT = Env.get("API_SESSION_TIMEOUT", 0);
const DB_CONNECTION = Env.get("DB_CONNECTION");
const DBService = use("DBService");
const oracledb = require("oracledb");
const lineByLine = use("n-readlines");
let _message_ids = [];

class DsoController {
  async test({ request, response, auth }) {
    try {
      const res = await Utils.createBarcode2Line("test barcode", true)
      return response.send(
        Utils.response(true, "test api", res)
      );
    } catch (e) {
      console.log(e)
      return response.send(Utils.response(false, e.message, null));
    }
  }
  async createBarcode2Line({ request, response, auth }) {
    try {
        const { barcode_data, display_value, height } = request.all()
        const barcode = await Utils.createBarcode2Line(barcode_data, display_value, height)
        return response.send(
            Utils.response(true, "Call api create barcode 2 line", { barcode })
        );
    } catch (e) {
        console.log(e)
        return response.send(Utils.response(false, e.message, null));
    }
}
  async encryptDotNet({ request, response, auth }) {
    try {
      const { plaintext } = request.all();
      const encrypted = AES.encryptDotNet(plaintext, "didsvTHB6jUJHGUG");
      console.log("encrypted2", encrypted);
      return response.send(
        Utils.response(true, "encryptDotNet was sucessfully!", encrypted)
      );
    } catch (e) {
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async htmlToPdf({ request, response }) {
    try {
      const { html, folder } = request.all();
      const current = new Date();
      const year = current.getFullYear();
      let month = current.getMonth() + 1;
      let day = current.getDate();
      if (day < 10) {
        day = "0" + day;
      }
      if (month < 10) {
        month = "0" + month;
      }
      const dir =
        _ROOT_DIR_FILES + "/" + folder + "/" + year + "/" + month + "/" + day;
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true }, (err) => {
          console.err(err);
        });
      }
      const unixtime = Date.now();
      const fileName = "inv-" + unixtime + ".pdf";
      const file_path = dir + "/" + fileName;
      const config = {
        format: "A4",
        zoomFactor: "1", // default is 1
        border: { top: "0.5in", right: "0", bottom: "0.5in", left: "0" },
        filename: file_path,
      };
      const result = await Utils.createPDF(html, config);
      let token = AES.encrypt(
        "/" +
          folder +
          "/" +
          year +
          "/" +
          month +
          "/" +
          day +
          "/" +
          fileName +
          "|" +
          year +
          month +
          day,
        APP_KEY
      );
      token = token
        .replace(/\+/g, "p1L2u3S")
        .replace(/\//g, "s1L2a3S4h")
        .replace(/=/g, "e1Q2u3A4l");
      const pdf_url =
        APP_URL_LOCAL +
        "/api/dso/getfiletoken?file_name=" +
        "/" +
        folder +
        "/" +
        year +
        "/" +
        month +
        "/" +
        day +
        "/" +
        fileName +
        "&token=" +
        token;
      return response.send(
        Utils.response(true, "created_file_pdf_was_successfull", {
          url: pdf_url,
        })
      );
    } catch (e) {
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async stringToFile({ request, response }) {
    try {
      const { string_data, folder, ext } = request.all();
      const current = new Date();
      const year = current.getFullYear();
      let month = current.getMonth() + 1;
      let day = current.getDate();
      if (day < 10) {
        day = "0" + day;
      }
      if (month < 10) {
        month = "0" + month;
      }
      const dir =
        _ROOT_DIR_FILES + "/" + folder + "/" + year + "/" + month + "/" + day;
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true }, (err) => {
          console.err(err);
        });
      }
      const unixtime = Date.now();
      const fileName = "inv-" + unixtime + "." + ext;
      const file_path = dir + "/" + fileName;
      const result = await Utils.createPDF(string_data, file_path);
      let token = AES.encrypt(
        "/" +
          folder +
          "/" +
          year +
          "/" +
          month +
          "/" +
          day +
          "/" +
          fileName +
          "|" +
          year +
          month +
          day,
        APP_KEY
      );
      token = token
        .replace(/\+/g, "p1L2u3S")
        .replace(/\//g, "s1L2a3S4h")
        .replace(/=/g, "e1Q2u3A4l");
      const pdf_url =
        APP_URL_LOCAL +
        "/api/dso/getfiletoken?file_name=" +
        "/" +
        folder +
        "/" +
        year +
        "/" +
        month +
        "/" +
        day +
        "/" +
        fileName +
        "&token=" +
        token;
      return response.send(
        Utils.response(true, "created_file_pdf_was_successfull", {
          url: pdf_url,
        })
      );
    } catch (e) {
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async clearCache({ request, response, auth }) {
    let p_crt_by = null;
    try {
      const user = await auth.getUser();
      let result = null;
      if (user) {
        result = await DBService.clearCache();
        p_crt_by = user.USER_ID;
      }
      return response.send(
        Utils.response(true, "Clear cache was sucessfully!", result)
      );
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "DsoController",
        FUNC: "clearCache",
        CONTENT: e.message,
        CRT_BY: p_crt_by,
      });
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async CallProcedureCLOB({ request, response, auth }) {
    let p_crt_by = "";
    try {
      const { proc, para, _db2 } = request.all();
      const p_language = request.header("accept-language", "ENG");
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }
      let para1 = "",
        para_value = {};
      for (let i = 0; i < para.length; i++) {
        para1 += ":p_para" + (i + 1) + ", ";
        eval(`para_value.p_para` + (i + 1) + `=para[i]`);
      }
      const result = await DBService.ExecuteSQLBlob(
        `BEGIN ${proc}(${para1} :p_language, :p_crt_by, :p_rtn_cur); END;`,
        para_value,
        p_language,
        p_crt_by,
        _db2
      );

      return response.send(
        Utils.response(true, "Call API CLOB was sucessfully!", result.p_rtn_cur)
      );
    } catch (e) {
      Utils.ConsoleLogError(e.message);
      Utils.Logger({
        LVL: "error",
        MODULE: "DsoController",
        FUNC: "CallProcedureCLOB",
        CONTENT: e.message,
        CRT_BY: p_crt_by,
      });
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async callBulkProcClob({ request, response, auth }) {
    let p_crt_by = "";
    try {
      const { proc, para, _db2 } = request.all();
      //console.log("para", para)
      const p_language = request.header("accept-language", "ENG");
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }
      const result = await DBService.callBulkProcClob(
        proc,
        para,
        p_language,
        p_crt_by,
        _db2
      );
      return response.send(
        Utils.response(true, "Call API CLOB was sucessfully!", result)
      );
    } catch (e) {
      Utils.ConsoleLogError(e.message);
      Utils.Logger({
        LVL: "error",
        MODULE: "DsoController",
        FUNC: "callBulkProcClob",
        CONTENT: e.message,
        CRT_BY: p_crt_by,
      });
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async CallBulkInsertProcedure({ request, response, auth }) {
    let p_crt_by = "";
    try {
      const { proc, para, _db2 } = request.all();
      //console.log("para", para)
      const p_language = request.header("accept-language", "ENG");
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }
      const result = await DBService.callBulkProcCursor(
        proc,
        para,
        p_language,
        p_crt_by,
        _db2
      );
      return response.send(
        Utils.response(
          true,
          "Call api bulk insert pro  was sucessfully!",
          result
        )
      );
    } catch (e) {
      Utils.ConsoleLogError(e.message);
      Utils.Logger({
        LVL: "error",
        MODULE: "DsoController",
        FUNC: "CallBulkInsertProcedure",
        CONTENT: e.message,
        CRT_BY: p_crt_by,
      });
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async writeRTDB({ request, response, auth }) {
    try {
      const { node, para } = request.all();
      //var p_language = request.header("accept-language", "ENG")
      let p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }
      const result = await Firebase.updateRTDB(node, para);
      if (result != "OK") {
        return response.send(Utils.response(false, result, para));
      } else {
        return response.send(
          Utils.response(true, "Successfull call writeRTDB", para)
        );
      }
    } catch (e) {
      Utils.ConsoleLogError(e.message);
      Utils.Logger({
        LVL: "error",
        MODULE: "DsoController",
        FUNC: "writeRTDB",
        CONTENT: e.message,
        CRT_BY: p_crt_by,
      });
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async getSessions({ response, auth }) {
    try {
      var p_crt_by = "";
      return response.send(
        Utils.response(
          true,
          "Successfull call getSessions",
          DBService.getAllCached()
        )
      );
    } catch (e) {
      Utils.ConsoleLogError(e.message);
      Utils.Logger({
        LVL: "error",
        MODULE: "DsoController",
        FUNC: "getSessions",
        CONTENT: e.message,
        CRT_BY: p_crt_by,
      });
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async getIndexByPK(arr, pk) {
    return arr.findIndex((el) => {
      return el.pk === pk;
    });
  }

  async getClientIp({ request, response, auth }) {
    var p_crt_by = "";
    try {
      let ip = request.header("x-real-ip");
      if (ip == undefined) {
        ip = request.ip();
      }

      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }

      return response.send(Utils.response(true, "Get IP Success", ip));
    } catch (e) {
      Utils.ConsoleLogError(e.message);
      Utils.Logger({
        LVL: "error",
        MODULE: "DsoController",
        FUNC: "getClientIP",
        CONTENT: e.message,
        CRT_BY: p_crt_by,
      });
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async CallProcedure({ request, response, auth }) {
    try {
      //vng-207 20220829 them para extra (add para extra vao para de chay procedure, neu ko dc thi chay lai para, dung cho truong hop bo sung para nhung ko thay doi site cu)
      const { proc, para, para_extra, _db2 } = request.all();
      var p_language = request.header("accept-language", "ENG");
      let ip = request.header("x-real-ip");
      if (ip == undefined) {
        ip = request.ip();
      }
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }
      const now = new Date();
      const miliseconds = now.getTime();
      const cachedData = DBService.getCache("" + user.PK);
      //console.log(`cachedData`, cachedData)
      if (cachedData != undefined && cachedData.lastcalled > 0) {
        //ignore check session timeout when user login again
        const idleTime = (miliseconds - cachedData.lastcalled) / 1000 / 60;
        if (idleTime >= SESSION_TIMEOUT) {
          if (
            proc.toUpperCase() != "SYS_SEL_LANGUAGE" &&
            proc.toUpperCase() != "SYS_SEL_USER_MENU"
          ) {
            DBService.setCache(
              "" + user.PK,
              {
                pk: user.PK,
                userid: user.USER_ID,
                username: user.USER_NAME,
                lastcalled: 0,
                ipaddress: ip,
              },
              SESSION_TIMEOUT
            );
            return response.send(
              Utils.response(
                false,
                "your_session_timeout_logout_and_login_to_continue",
                { lang: p_language }
              )
            );
          } else {
            DBService.setCache(
              "" + user.PK,
              {
                pk: user.PK,
                userid: user.USER_ID,
                username: user.USER_NAME,
                lastcalled: miliseconds,
                ipaddress: ip,
              },
              SESSION_TIMEOUT
            );
          }
        } else {
          DBService.setCache(
            "" + user.PK,
            {
              pk: user.PK,
              userid: user.USER_ID,
              username: user.USER_NAME,
              lastcalled: miliseconds,
              ipaddress: ip,
            },
            SESSION_TIMEOUT
          );
        }
      } else {
        //first call
        DBService.setCache(
          "" + user.PK,
          {
            pk: user.PK,
            userid: user.USER_ID,
            username: user.USER_NAME,
            lastcalled: miliseconds,
            ipaddress: ip,
          },
          SESSION_TIMEOUT
        );
      }
      if (DB_CONNECTION == "oracle") {
        oracledb.fetchAsBuffer = [oracledb.BLOB];
        oracledb.fetchAsString = [oracledb.CLOB];
      }

      //=========================================================================================
      //vng-207 20220829 xu ly para extra
      //=========================================================================================
      let callProcCursor = async (
        proc,
        params,
        param_extra,
        p_language,
        p_crt_by,
        _db2
      ) => {
        let _params = !!params ? [...params] : null;
        let _param_extra = !!param_extra ? [...param_extra] : null;
        try {
          for (let idx in _params) {
            _params[idx] =
              _params[idx] == "null" ||
              _params[idx] == undefined ||
              _params[idx] == null
                ? ""
                : _params[idx];
          }
          if (!!_param_extra) {
            for (let idx in _param_extra) {
              _param_extra[idx] =
                _param_extra[idx] == "null" ||
                _param_extra[idx] == undefined ||
                _param_extra[idx] == null
                  ? ""
                  : _param_extra[idx];
            }
          }
        } catch (q) {}

        let result = null;
        try {
          result = await DBService.callProcCursor(
            proc,
            _params,
            p_language,
            p_crt_by,
            _db2
          );
        } catch (ex) {
          if (!ex.message.includes("ORA-06553") || !!!_param_extra) {
            //loi do para thieu, extra para ko co thi throw loi
            throw ex;
          }
        }

        if (!!result) return result;

        //goi tiep neu co extra para (dung de them para site moi va tranh anh huong site cu)
        if (!!_param_extra && _param_extra.length > 0) {
          console.log(
            "call _param_extra",
            "Call Extra parameter " + _param_extra.join(", ")
          );
          Utils.Logger({
            LVL: "error",
            MODULE: "DsoController",
            FUNC: "CallProcedure",
            CONTENT: "Call Extra parameter " + _param_extra.join(", "),
          });

          _params.push(..._param_extra);
          result = await DBService.callProcCursor(
            proc,
            _params,
            p_language,
            p_crt_by,
            _db2
          );
        }

        return result;
      };

      const result = await callProcCursor(
        proc,
        para,
        para_extra,
        p_language,
        p_crt_by,
        _db2
      );

      //======================end extra para=====================================================
      //=========================================================================================

      if (
        proc.toUpperCase().indexOf("_UPD_") > 0 ||
        proc.toUpperCase().indexOf("_PROCESS_") > 0 ||
        proc.toUpperCase().indexOf("_PRO_") > 0 ||
        proc.toUpperCase().indexOf("_DEL_") > 0 ||
        proc.toUpperCase().indexOf("_COPY_") > 0 ||
        proc.toUpperCase().indexOf("_REGEN_") > 0 ||
        proc.toUpperCase().indexOf("_NOCACHE") > 0
      ) {
        const bearerToken = request.request.headers.authorization;
        let result2 = null;
        try {
          if (CLEAR_CACHE_URL1 != "NOCLEAR") {
            result2 = await Request.post(
              CLEAR_CACHE_URL1,
              {},
              { headers: { Authorization: bearerToken } }
            );
          }
          if (CLEAR_CACHE_URL2 != "NOCLEAR") {
            result2 = await Request.post(
              CLEAR_CACHE_URL2,
              {},
              { headers: { Authorization: bearerToken } }
            );
          }
        } catch (ex) {}
      }
      return response.send(
        Utils.response(true, "Successfull call procedure", result)
      );
    } catch (e) {
      Utils.ConsoleLogError(e.message);
      Utils.Logger({
        LVL: "error",
        MODULE: "DsoController",
        FUNC: "CallProcedure",
        CONTENT: e.message,
        CRT_BY: p_crt_by,
      });
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async CallAPIProcedure({ request, response, auth }) {
    try {
      const { proc, para, _db2 } = request.all();
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      let ip = request.header("x-real-ip");
      if (ip == undefined) {
        ip = request.ip();
      }
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }
      if (API_SESSION_TIMEOUT > 0) {
        const now = new Date();
        const miliseconds = now.getTime();
        const cachedData = DBService.getCache("" + user.PK);
        if (cachedData != undefined && cachedData.lastcalled > 0) {
          //ignore check session timeout when user login again
          const idleTime = (miliseconds - cachedData.lastcalled) / 1000 / 60;
          if (idleTime >= API_SESSION_TIMEOUT) {
            if (
              proc.toUpperCase() != "SYS_SEL_LANGUAGE" &&
              proc.toUpperCase() != "SYS_SEL_USER_MENU"
            ) {
              DBService.setCache(
                "" + user.PK,
                {
                  pk: user.PK,
                  userid: user.USER_ID,
                  username: user.USER_NAME,
                  lastcalled: miliseconds,
                  ipaddress: ip,
                },
                SESSION_TIMEOUT
              );
              return response.send(
                Utils.response(
                  false,
                  "your_session_timeout_logout_and_login_to_continue",
                  { lang: p_language }
                )
              );
            } else {
              DBService.setCache(
                "" + user.PK,
                {
                  pk: user.PK,
                  userid: user.USER_ID,
                  username: user.USER_NAME,
                  lastcalled: miliseconds,
                  ipaddress: ip,
                },
                SESSION_TIMEOUT
              );
            }
          } else {
            DBService.setCache(
              "" + user.PK,
              {
                pk: user.PK,
                userid: user.USER_ID,
                username: user.USER_NAME,
                lastcalled: miliseconds,
                ipaddress: ip,
              },
              SESSION_TIMEOUT
            );
          }
        } else {
          //first call
          DBService.setCache(
            "" + user.PK,
            {
              pk: user.PK,
              userid: user.USER_ID,
              username: user.USER_NAME,
              lastcalled: miliseconds,
              ipaddress: ip,
            },
            SESSION_TIMEOUT
          );
        }
      }
      if (DB_CONNECTION == "oracle") {
        oracledb.fetchAsBuffer = [oracledb.BLOB];
        oracledb.fetchAsString = [oracledb.CLOB];
      }

      const result = await DBService.callProcCursor(
        proc,
        para,
        p_language,
        p_crt_by,
        _db2
      );
      return response.send(
        Utils.response(true, "api completed successfull", result)
      );
    } catch (e) {
      Utils.ConsoleLogError(e.message);
      Utils.Logger({
        LVL: "error",
        MODULE: "DsoController",
        FUNC: "CallAPIProcedure",
        CONTENT: e.message,
        CRT_BY: p_crt_by,
      });
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async CallAPIProcedureNoAuthen({ request, response, auth }) {
    const p_crt_by = "anonymous";
    try {
      const { proc, para } = request.all();
      var p_language = request.header("accept-language", "ENG");
      const result = await DBService.callProcCursor(
        proc,
        para,
        p_language,
        p_crt_by
      );

      return response.send(
        Utils.response(true, "api anonymous completed successfull", result)
      );
    } catch (e) {
      console.error(e);
      Utils.Logger({
        LVL: "error",
        MODULE: "DsoController",
        FUNC: "CallAPIProcedureNoAuthen",
        CONTENT: e.message,
        CRT_BY: p_crt_by,
      });
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async pushMobileMsg({ request, response, auth }) {
    try {
      const { proc, para, _db2 } = request.all();
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }
      if (DB_CONNECTION == "oracle") {
        oracledb.fetchAsBuffer = [oracledb.BLOB];
        oracledb.fetchAsString = [oracledb.CLOB];
      }
      const result = await DBService.callProcCursor(
        proc,
        para,
        p_language,
        p_crt_by,
        _db2
      );

      if (result && result.length > 0) {
        let payload = {};
        for (let i = 0; i < result.length; i++) {
          if (result[i].DEVICE_ID && result[i].TITLE) {
            payload = {
              notification: {
                title: result[i].TITLE,
                body: result[i].BODY,
              },
              data: JSON.parse(result[i].DATA),
            };
            //console.log(payload)
            await Firebase.sendToDevice(result[i].DEVICE_ID, payload);
            await DBService.callProcCursor(
              "LG_WMS_UPD_NOTICE_LOG",
              [result[i].PK],
              p_language,
              p_crt_by
            );
          }
        }
      }
      return response.send(
        Utils.response(
          true,
          `[${result.length}] messages was sent`,
          result.length
        )
      );
    } catch (e) {
      Utils.ConsoleLogError(e.message);
      Utils.Logger({
        LVL: "error",
        MODULE: "DsoController",
        FUNC: "pushMobileMsg",
        CONTENT: e.message,
        CRT_BY: p_crt_by,
      });
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async CallProcedureMultiCursor({ request, response, auth }) {
    try {
      const { proc, para, number_cursor, _db2 } = request.all();
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }

      const result = await DBService.callProcMultiCursor(
        proc,
        para,
        p_language,
        p_crt_by,
        number_cursor,
        _db2
      );
      return response.send(
        Utils.response(true, "Successfull call procedure", result)
      );
    } catch (e) {
      Utils.ConsoleLogError(e.message);
      Utils.Logger({
        LVL: "error",
        MODULE: "DsoController",
        FUNC: "CallProcedureMultiCursor",
        CONTENT: e.message,
        CRT_BY: p_crt_by,
      });
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async ExecuteSQL({ request, response, auth }) {
    try {
      const { sql, para, _db2 } = request.all();
      let p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }
      let result = null;
      if (para) {
        result = await DBService.ExecuteSQL(sql, para, p_crt_by, _db2);
      } else {
        result = await DBService.ExecuteSQL(sql, [], p_crt_by, _db2);
      }
      //console.log(result)
      return response.send(
        Utils.response(true, "Sucessfull execute sql", result.rows)
      );
    } catch (e) {
      Utils.ConsoleLogError(e.message);
      Utils.Logger({
        LVL: "error",
        MODULE: "DsoController",
        FUNC: "ExecuteSQL",
        CONTENT: e.message,
        CRT_BY: p_crt_by,
      });
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async DownloadFile({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      const { table_name, pk, _db2 } = request.all();
      let p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }
      result = await DBService.ExecuteSQL(
        `select * from ${table_name} where pk=:pk`,
        { pk: pk },
        p_crt_by,
        _db2
      );
      if (DB_CONNECTION == "oracle") {
        if (result.rows.length > 0) {
          response.header("content-type", result.rows[0].FILE_TYPE);
          response.header(
            "Content-Disposition",
            "attachment; filename=" + result.rows[0].FILE_NAME
          );
          response.header("content-length", result.rows[0].FILE_SIZE);
          return response.send(result.rows[0].FILE_CONTENT);
        }
        return response.send(Utils.response(false, "not found data", null));
      } else if (DB_CONNECTION == "mysql") {
        response.header("content-type", result[0][0].FILE_TYPE);
        response.header(
          "Content-Disposition",
          "attachment; filename=" + result[0][0].FILE_NAME
        );
        response.header("content-length", result[0][0].FILE_SIZE);
        return response.send(result[0][0].FILE_CONTENT);
      }
    } catch (e) {
      Utils.ConsoleLogError(e.message);
      Utils.Logger({
        LVL: "error",
        MODULE: "DsoController",
        FUNC: "DownloadFile",
        CONTENT: e.message,
        CRT_BY: p_crt_by,
      });
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async DownloadFileDBToken({ request, response, auth }) {
    try {
      const { token, proc, pk } = request.all();
      //if dont pass token that mean generate url only else download file
      if (token == undefined || token == null || token == "") {
        const current = new Date();
        const year = current.getFullYear();
        let month = current.getMonth() + 1;
        let day = current.getDate();
        if (day < 10) {
          day = "0" + day;
        }
        if (month < 10) {
          month = "0" + month;
        }
        let tokenEncrypted = AES.encrypt(
          proc + "|" + year + month + day,
          APP_KEY
        );
        tokenEncrypted = tokenEncrypted
          .replace(/\+/g, "p1L2u3S")
          .replace(/\//g, "s1L2a3S4h")
          .replace(/=/g, "e1Q2u3A4l");
        return response.send(
          APP_URL_LOCAL +
            "/api/dso/getfiledbtoken?pk=" +
            pk +
            "&proc=" +
            proc +
            "&token=" +
            tokenEncrypted
        );
      }

      const token2 = token
        .replace(/p1L2u3S/g, "+")
        .replace(/s1L2a3S4h/g, "/")
        .replace(/e1Q2u3A4l/g, "=");
      const decodeToken = AES.decrypt(token2, APP_KEY);
      const arrToken = decodeToken.split("|");
      if (arrToken.length != 2) {
        return response.send(Utils.response(false, "Invalid token", null));
      }
      if (arrToken[0] !== proc) {
        return response.send(Utils.response(false, "Invalid token", null));
      }
      let ip = request.header("x-real-ip");
      if (ip == undefined) {
        ip = request.ip();
      }
      if (HOST != ip && ip != "127.0.0.1") {
        const curDate = Utils.CurrentDate();
        if (arrToken[1].substring(0, 8) != curDate) {
          return response.send(
            Utils.response(false, "Token was expired", null)
          );
        }
      }

      const result = await DBService.callProcCursor(
        proc,
        [pk],
        "ENG",
        "public",
        "N"
      );

      if (result.length > 0) {
        response.header("content-type", result[0].FILE_TYPE);
        response.header(
          "Content-Disposition",
          "attachment; filename=" + result[0].FILE_NAME
        );
        response.header("content-length", result[0].FILE_SIZE);
        return response.send(result[0].FILE_CONTENT);
      }
      return response.send(Utils.response(false, "not found data", null));
    } catch (e) {
      Utils.ConsoleLogError(e.message);
      Utils.Logger({
        LVL: "error",
        MODULE: "DsoController",
        FUNC: "DownloadFileDBToken",
        CONTENT: e.message,
        CRT_BY: p_crt_by,
      });
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async GetBlobData({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      const { table_name, pk, _db2 } = request.all();
      let p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }
      const result = await DBService.ExecuteSQL(
        `select * from ${table_name} where pk=:pk`,
        { pk: pk },
        p_crt_by,
        _db2
      );
      if (DB_CONNECTION == "oracle") {
        return response.send(result.rows);
      } else if (DB_CONNECTION == "mysql") {
        return response.send(result[0]);
      }

      return response.send(Utils.response(false, "not_found_data", null));
    } catch (e) {
      Utils.ConsoleLogError(e.message);
      Utils.Logger({
        LVL: "error",
        MODULE: "DsoController",
        FUNC: "GetBlobData",
        CONTENT: e.message,
        CRT_BY: p_crt_by,
      });
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async ConvertToPdf({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      const file = request.file("file");
      // // console.log(file)
      // const fileContent = await Utils.readFile(file.tmpPath);
      // const file_size = file.size;
      // const file_name = file.clientName;
      // const file_ext = file.extname;
      // const file_type = file.type;
      // const fileBuffer = Buffer.from(fileContent);

      let rtnFile = await Utils.excelToPdf(file.tmpPath);

      const current = new Date();
      const year = current.getFullYear();
      let month = current.getMonth() + 1;
      let day = current.getDate();
      if (day < 10) {
        day = "0" + day;
      }
      if (month < 10) {
        month = "0" + month;
      }
      const dir = _ROOT_DIR_FILES + "/pdf/" + year + "/" + month;
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true }, (err) => {
          console.log(err);
        });
      }
      const unixtime = Date.now();
      const rtnFile2 = rtnFile.replace(/\\/g, "/");
      const fileName =
        "/pdf/" +
        year +
        "/" +
        month +
        "/rpt-" +
        unixtime +
        "-" +
        rtnFile2.split("/").pop();
      const destinationFile =
        dir + "/rpt-" + unixtime + "-" + rtnFile2.split("/").pop();
      await Utils.copyFile(rtnFile, destinationFile);
      let token = AES.encrypt(fileName + "|" + year + month + day, APP_KEY);
      token = token
        .replace(/\+/g, "p1L2u3S")
        .replace(/\//g, "s1L2a3S4h")
        .replace(/=/g, "e1Q2u3A4l");

      console.log(
        "/api/dso/getfiletoken?file_name=",
        APP_URL_LOCAL +
          "/api/dso/getfiletoken?file_name=" +
          fileName +
          "&token=" +
          token
      );
      return response.send(
        APP_URL_LOCAL +
          "/api/dso/getfiletoken?file_name=" +
          fileName +
          "&token=" +
          token
      );
    } catch (e) {
      Utils.ConsoleLogError(e.message);
      Utils.Logger({
        LVL: "error",
        MODULE: "DsoController",
        FUNC: "ConvertPdf",
        CONTENT: e.message,
        CRT_BY: p_crt_by,
      });
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async CallProcedureBlob({ request, response, auth }) {
    let p_crt_by = "";
    const user = await auth.getUser();
    if (user) {
      p_crt_by = user.USER_ID;
    }

    try {
      var p_language = request.header("accept-language", "ENG");
      let files = request.files("files");
      let saveFiles = [];
      try {
        files = files.files;
        if (!Array.isArray(files)) {
          files = [files];
        }

        let idx = 0;
        while (idx < files.length) {
          const file = files[idx];
          const fileContent = await Utils.readFile(file.tmpPath);
          const fileBuffer = Buffer.from(fileContent);
          saveFiles[idx] = fileBuffer; //neu ko thay doi file thi de buffer null
          idx++;
        }
      } catch (e) {
        console.log(e.message);
      }

      const { proc, para, _db2 } = request.all();
      let params = JSON.parse(para);
      let result = null;

      let paraKeys = params.keys ? params.keys : Object.keys(params);
      let dbParams = "";
      let dbDatas = {};
      let fileIdx = 0;

      paraKeys.forEach((key, idx) => {
        dbParams += `:${key.startsWith("_") ? key.replace("_", "") : key}`;
        if (idx < paraKeys.length - 1) dbParams += ",";
        dbDatas[key.startsWith("_") ? key.replace("_", "") : key] = String(
          params[key]
        ).includes("byte-array")
          ? saveFiles[fileIdx++]
          : params[key];
      });

      //console.log(`BEGIN ${proc}(${dbParams},:p_language,:p_crt_by,:p_rtn_cur); END;`);
      // console.log(dbDatas);

      if (DB_CONNECTION == "oracle") {
        result = await DBService.ExecuteSQLBlob(
          `BEGIN ${proc}(${dbParams},:p_language,:p_crt_by,:p_rtn_cur); END;`,
          { ...dbDatas },
          p_language,
          p_crt_by,
          _db2
        );
      } else if (DB_CONNECTION == "mysql") {
        result = await DBService.ExecuteSQLBlob(
          `call ${proc}(${dbParams},:p_language,:p_crt_by);`,
          { ...dbDatas },
          p_language,
          p_crt_by,
          _db2
        );
      } else {
        console.log(`not support DB ${DB_CONNECTION}`);
      }

      //vng-207 20221010 fix lai data cho giong ben ham callsql
      if (result != null && typeof result == "object") {
        let keys = Object.keys(result);

        if (keys.includes("p_rtn_cur")) {
          result = result.p_rtn_cur;
        }
      }

      return response.send(
        Utils.response(true, "Successfull call procedure", result)
      );
    } catch (e) {
      Utils.ConsoleLogError(e.message);
      Utils.Logger({
        LVL: "error",
        MODULE: "DsoController",
        FUNC: "CallProcedureBlob",
        CONTENT: e.message,
        CRT_BY: p_crt_by,
      });
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async UploadFile({ request, response, auth }) {
    let p_crt_by = "";
    try {
      var p_language = request.header("accept-language", "ENG");
      const { proc, para, max_size, _db2 } = request.all();

      const file = request.file("file");
      //console.log({max_size})
      let fileContent = await Utils.readFile(file.tmpPath);
      let file_size = file.size;
      const file_name = file.clientName;
      const file_ext = file.extname;
      const file_type = file.type;

      let fileBuffer = null;
      if (max_size > 0) {
        const fileObject = await Utils.resizeImage(
          file.tmpPath,
          file_ext,
          1 * max_size
        );
        //console.log(fileObject)
        if (fileObject) {
          fileContent = await Utils.readFile(fileObject.file_path);
          file_size = fileObject.size;
        } else {
          return response.send(
            Utils.response(false, "Fail to resize image", result)
          );
        }
      }
      fileBuffer = Buffer.from(fileContent);
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }

      const params = [...JSON.parse(para)];
      let result = null;
      if (DB_CONNECTION == "oracle") {
        result = await DBService.ExecuteSQLBlob(
          `BEGIN ${proc}(:p_tes_file_pk,:p_table_name,:p_master_table,:p_master_table_pk, :p_file_content,:p_file_name,:p_file_ext,:p_file_size,:p_file_type,:p_language,:p_crt_by,:p_rtn_cur); END;`,
          {
            p_tes_file_pk: params[0],
            p_table_name: params[1],
            p_master_table: params[2],
            p_master_table_pk: params[3],
            p_file_content: fileBuffer,
            p_file_name: file_name,
            p_file_ext: file_ext,
            p_file_size: file_size,
            p_file_type: file_type,
          },
          p_language,
          p_crt_by,
          _db2
        );
      } else if (DB_CONNECTION == "mysql") {
        result = await DBService.ExecuteSQLBlob(
          `call ${proc}(:p_tes_file_pk,:p_table_name,:p_master_table,:p_master_table_pk, :p_file_content,:p_file_name,:p_file_ext,:p_file_size,:p_file_type,:p_language,:p_crt_by);`,
          {
            p_tes_file_pk: params[0],
            p_table_name: params[1],
            p_master_table: params[2],
            p_master_table_pk: params[3],
            p_file_content: fileBuffer,
            p_file_name: file_name,
            p_file_ext: file_ext,
            p_file_size: file_size,
            p_file_type: file_type,
          },
          p_language,
          p_crt_by,
          _db2
        );
      } else {
        console.log(`not support DB ${DB_CONNECTION}`);
      }

      return response.send(
        Utils.response(true, "Upload file was sucessfull", result)
      );
    } catch (e) {
      Utils.ConsoleLogError(e.message);
      Utils.Logger({
        LVL: "error",
        MODULE: "DsoController",
        FUNC: "UploadFile",
        CONTENT: e.message,
        CRT_BY: p_crt_by,
      });
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async UploadFile2({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      const file = request.file("file");
      // console.log(file)
      const fileContent = await Utils.readFile(file.tmpPath);
      const file_size = file.size;
      const file_name = file.clientName;
      const file_ext = file.extname;
      const file_type = file.type;
      const fileBuffer = Buffer.from(fileContent);

      const { proc, para, _db2 } = request.all();
      let p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }
      const params = [...JSON.parse(para)];
      let result;
      if (DB_CONNECTION == "oracle") {
        result = await DBService.ExecuteSQLBlob(
          `BEGIN ${proc}(:p_tes_file_pk,:p_table_name,:p_master_table,:p_master_table_pk, :p_file_content,:p_file_name,:p_file_ext,:p_file_size,:p_file_type,:p_file_path,:p_language,:p_crt_by,:p_rtn_cur); END;`,
          {
            p_tes_file_pk: params[0],
            p_table_name: params[1],
            p_master_table: params[2],
            p_master_table_pk: params[3],
            p_file_content: fileBuffer,
            p_file_name: file_name,
            p_file_ext: file_ext,
            p_file_size: file_size,
            p_file_type: file_type,
            p_file_path: "",
          },
          p_language,
          p_crt_by,
          _db2
        );
      } else if (DB_CONNECTION == "mysql") {
        result = await DBService.ExecuteSQLBlob(
          `call ${proc}(:p_tes_file_pk,:p_table_name,:p_master_table,:p_master_table_pk, :p_file_content,:p_file_name,:p_file_ext,:p_file_size,:p_file_type,:p_file_path,:p_language,:p_crt_by);`,
          {
            p_tes_file_pk: params[0],
            p_table_name: params[1],
            p_master_table: params[2],
            p_master_table_pk: params[3],
            p_file_content: fileBuffer,
            p_file_name: file_name,
            p_file_ext: file_ext,
            p_file_size: file_size,
            p_file_type: file_type,
            p_file_path: file_path,
          },
          p_language,
          p_crt_by,
          _db2
        );
      } else {
        console.log(`not support DB ${DB_CONNECTION}`);
      }

      return response.send(
        Utils.response(true, "Upload file was sucessfull", result)
      );
    } catch (e) {
      Utils.ConsoleLogError(e.message);
      Utils.Logger({
        LVL: "error",
        MODULE: "DsoController",
        FUNC: "UploadFile2",
        CONTENT: e.message,
        CRT_BY: p_crt_by,
      });
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async UploadExcelToFolder({ request, response, auth }) {
    let p_crt_by = "";
    const user = await auth.getUser();
    if (user) {
      p_crt_by = user.USER_ID;
    }
    try {
      var p_language = request.header("accept-language", "ENG");
      const file = request.file("file");
      const file_size = file.size;
      const file_name = file.clientName;
      const file_ext = file.extname;
      const file_type = file.type;

      let { folder, proc, para, type_insert } = request.all();
      if (!folder) {
        return response.send(
          Utils.response(false, "missing_folder_parameter", null)
        );
      }

      // console.log("folder " + folder + " file_ext  " + file_ext);
      const file_path = await Utils.putExcelRootPath(file, folder, type_insert);
      let result;
      //  console.log("file_path  ", file_path);
      if (file_path != "") {
        const params = JSON.parse(para);
        // console.log("params  ", params);
        result = await DBService.ExecuteSQLBlob(
          `BEGIN ${proc}(:p_tco_company_pk,
                                        :p_tco_busplace_pk,
                                        :p_tco_template_pk,
                                        :p_type_update, 
                                        :p_url,
                                        :p_language,
                                        :p_crt_by,
                                        :p_rtn_cur); END;`,
          {
            p_tco_company_pk: params[0],
            p_tco_busplace_pk: params[1],
            p_tco_template_pk: params[2],
            p_type_update: type_insert,
            p_url: file_path,
          },
          p_language,
          p_crt_by
        );
      }
      return response.send(
        Utils.response(true, "Upload file was sucessfull", file_path)
      );
    } catch (e) {
      Utils.ConsoleLogError(e.message);
      Utils.Logger({
        LVL: "error",
        MODULE: "DsoController",
        FUNC: "UploadExcelToFolder",
        CONTENT: e.message,
        CRT_BY: p_crt_by,
      });
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async UploadFileToFolder({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      const file = request.file("file");

      const file_size = file.size;
      const file_name = file.clientName;
      const file_ext = file.extname;
      const file_type = file.type;

      let { proc, table_name, table_pk, folder } = request.all();
      if (!folder) {
        return response.send(
          Utils.response(false, "missing_folder_parameter", null)
        );
      }
      const file_path = await Utils.putFileRootPath(file, folder);

      if (!proc) {
        proc = "sys_upload_file_to_folder";
      }
      let p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }
      // const paras = [para[0], para[1], file_name, p_file_ext, p_file_size, p_file_type, file_path]

      const paras = [
        table_pk,
        table_name,
        file_size,
        file_name,
        file_path,
        file_ext,
        file_type,
      ];
      const result = await DBService.callProcCursor(
        proc,
        paras,
        p_language,
        p_crt_by
      );
      return response.send(
        Utils.response(true, "upload_file_sucessfull", result)
      );
    } catch (e) {
      Utils.ConsoleLogError(e.message);
      Utils.Logger({
        LVL: "error",
        MODULE: "DsoController",
        FUNC: "UploadFileToFolder",
        CONTENT: e.message,
        CRT_BY: p_crt_by,
      });
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async UploadFileToFolder2({ request, response, auth }) {
    let p_crt_by = "";
    const user = await auth.getUser();
    if (user) {
      p_crt_by = user.USER_ID;
    }
    try {
      var p_language = request.header("accept-language", "ENG");
      const file = request.file("file");

      const file_size = file.size;
      const file_name = file.clientName;
      const file_ext = file.extname;
      const file_type = file.type;

      let { proc, table_name, table_pk, folder, att_type, location1 } =
        request.all();
      if (!folder) {
        return response.send(
          Utils.response(false, "missing_folder_parameter", null)
        );
      }
      const file_path = await Utils.putFileRootPath(file, folder, location1);

      if (!proc) {
        proc = "sys_upload_file_to_folder2";
      }

      // const paras = [para[0], para[1], file_name, p_file_ext, p_file_size, p_file_type, file_path]

      const paras = [
        table_pk,
        table_name,
        att_type,
        file_size,
        file_name,
        file_path,
        file_ext,
        file_type,
      ];
      const result = await DBService.callProcCursor(
        proc,
        paras,
        p_language,
        p_crt_by
      );
      return response.send(
        Utils.response(true, "upload_file_sucessfull", result)
      );
    } catch (e) {
      Utils.ConsoleLogError(e.message);
      Utils.Logger({
        LVL: "error",
        MODULE: "DsoController",
        FUNC: "UploadFileToFolder2",
        CONTENT: e.message,
        CRT_BY: p_crt_by,
      });
      return response.send(Utils.response(false, e.message, null));
    }
  }
  async UploadFileToFolderReturnURL2({ request, response, auth }) {
    let p_crt_by = "";
    try {
      var p_language = request.header("accept-language", "ENG");
      const file = request.file("file");

      const file_size = file.size;
      const file_name = file.clientName;
      const file_ext = file.extname;
      const file_type = file.type;

      let { folder } = request.all();
      let { location2 } = request.all();
      if (!folder) {
        return response.send(
          Utils.response(false, "missing_folder_parameter", null)
        );
      }
      let obj1 = JSON.parse(location2);
      const location1 = `${obj1.TOTAL_ORDER_NUMBER}/${obj1.PRODUCT_CODE}`;

      let file_path = await Utils.putFileRootPath(file, "folder", location1);

      return response.send(file_path);
    } catch (e) {
      Utils.ConsoleLogError(e.message);
      Utils.Logger({
        LVL: "error",
        MODULE: "DsoController",
        FUNC: "UploadFileToFolderReturnURL2",
        CONTENT: e.message,
        CRT_BY: p_crt_by,
      });
      return response.send(Utils.response(false, e.message, null));
    }
  }
  async UploadFileToFolderReturnURLToken({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      const file = request.file("file");

      const file_size = file.size;
      const file_name = file.clientName;
      const file_ext = file.extname;
      const file_type = file.type;

      let { folder } = request.all();
      if (!folder) {
        return response.send(
          Utils.response(false, "missing_folder_parameter", null)
        );
      }
      let file_path = await Utils.putFileRootPath(file, folder);
      const current = new Date();
      const year = current.getFullYear();
      let month = current.getMonth() + 1;
      let day = current.getDate();
      if (day < 10) {
        day = "0" + day;
      }
      if (month < 10) {
        month = "0" + month;
      }
      //file_path="/"+file_path
      let token = AES.encrypt(file_path + "|" + year + month + day, APP_KEY);
      token = token
        .replace(/\+/g, "p1L2u3S")
        .replace(/\//g, "s1L2a3S4h")
        .replace(/=/g, "e1Q2u3A4l");
      return response.send(
        "/api/dso/getfiletoken?file_name=" + file_path + "&token=" + token
      );
    } catch (e) {
      Utils.ConsoleLogError(e.message);
      Utils.Logger({
        LVL: "error",
        MODULE: "DsoController",
        FUNC: "UploadFileToFolderReturnURLToken",
        CONTENT: e.message,
        CRT_BY: p_crt_by,
      });
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async UploadManualFile({ request, response, auth }) {
    try {
      const user = await auth.getUser();
      if (user.SYSADMIN_YN !== "Y") {
        return response.send(
          Utils.response(false, "you_do_not_have_permission", null)
        );
      }
      const file = request.file("file");
      let { form_id, p_language } = request.all();
      if (p_language.length != 3) {
        return response.send(Utils.response(false, "invalid_language", null));
      }
      if (form_id.length == 7) {
        const file_path = await Utils.putManualFile(
          file,
          p_language.toLowerCase(),
          form_id + ".pdf"
        );
        if (file_path.indexOf("/manual") == 0) {
          return response.send(
            Utils.response(true, "upload_manual_successful", null)
          );
        }
        return response.send(Utils.response(false, file_path, null));
      } else {
        return response.send(Utils.response(false, "invalid_form_id", null));
      }
    } catch (e) {
      Utils.ConsoleLogError(e.message);
      Utils.Logger({
        LVL: "error",
        MODULE: "DsoController",
        FUNC: "UploadManualFile",
        CONTENT: e.message,
        CRT_BY: p_crt_by,
      });
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async readManualFile({ request, response }) {
    try {
      const { lang, form_id } = request.get(["lang", "form_id"]);
      const filePath = Helpers.appRoot(
        `manual/${lang.toLowerCase()}/${form_id.toUpperCase()}.pdf`
      );
      if (filePath) {
        return response.attachment(filePath);
      } else {
        return response.send(Utils.response(false, "file_not_found", null));
      }
    } catch (e) {
      Utils.ConsoleLogError(e.message);
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async readAttachFile({ request, response }) {
    try {
      const { token, file_name } = request.get(["token", "file_name"]);
      const file_name_decrypt = AES.decrypt(token, APP_KEY);
      if (file_name_decrypt !== file_name) {
        return response.send(Utils.response(false, "Invalid token", null));
      }
      const filePath = Helpers.tmpPath(file_name);
      if (filePath) {
        return response.download(filePath);
      } else {
        return response.send(Utils.response(false, "file_not_found", null));
      }
    } catch (e) {
      Utils.ConsoleLogError(e.message);
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async exportBigExcelFile({ request, response, auth }) {
    try {
      const user = await auth.getUser();
      const p_crt_by = user.USER_ID;
      const p_language = request.header("accept-language", "ENG");

      const { proc, para } = request.all();
      const filePath = await Utils.exportBigExcelFile(
        proc,
        para.join("|") + "|" + p_language + "|" + p_crt_by
      );

      if (fs.existsSync(filePath)) {
        return response.attachment(filePath);
      } else {
        return response.send(
          Utils.response(false, "failed_export_file", filePath)
        );
      }
    } catch (e) {
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async getFile({ request, response }) {
    try {
      const { file_name } = request.get(["file_name"]);
      const { type } = request.get(["type"]);
      let filePath = _ROOT_DIR_FILES + file_name;
      if (type == 1) {
        filePath = _ROOT_DIR_FILE1 + file_name;
        if (fs.existsSync(filePath)) {
          return response.attachment(filePath);
        } else {
          filePath = _ROOT_DIR_FILE2 + file_name;
          return response.attachment(filePath);
        }
      }
      return response.attachment(filePath);
    } catch (e) {
      Utils.ConsoleLogError(e.message);
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async getFileToken({ request, response }) {
    try {
      const { token, file_name } = request.get(["token", "file_name"]);
      const token2 = token
        .replace(/p1L2u3S/g, "+")
        .replace(/s1L2a3S4h/g, "/")
        .replace(/e1Q2u3A4l/g, "=");
      const decodeToken = AES.decrypt(token2, APP_KEY);
      const arrToken = decodeToken.split("|");
      if (arrToken.length != 2) {
        return response.send(Utils.response(false, "Invalid token", null));
      }
      if (arrToken[0] !== file_name) {
        return response.send(Utils.response(false, "Invalid token", null));
      }
      let ip = request.header("x-real-ip");
      if (ip == undefined) {
        ip = request.ip();
      }
      if (HOST != ip && ip != "127.0.0.1") {
        const curDate = Utils.CurrentDate();
        if (arrToken[1].substring(0, 8) != curDate) {
          return response.send(
            Utils.response(false, "Token was expired", null)
          );
        }
      }
      const filePath = _ROOT_DIR_FILES + file_name;
      return response.download(filePath);
    } catch (e) {
      Utils.ConsoleLogError(e.message);
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async getLogo({ request, response }) {
    let ip = request.header("x-real-ip");
    try {
      if (ip == undefined) {
        ip = request.ip();
      }
      const { token, file_name, proc, pk } = request.get([
        "token",
        "file_name",
        "proc",
        "pk",
      ]);
      const filePath = Helpers.publicPath("logo/" + file_name);
      if (filePath) {
        if (proc && pk > 0) {
          await DBService.callProcCursor(proc, [pk, ip], "ENG", "anonymous");
        }
        return response.download(filePath);
      } else {
        return response.send(Utils.response(false, "file_not_found", null));
      }
    } catch (e) {
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async getPublicFile({ request, response }) {
    let ip = request.header("x-real-ip");
    try {
      if (ip == undefined) {
        ip = request.ip();
      }
      const { token, path } = request.get(["token", "path"]);
      const filePath = Helpers.publicPath(path);
      console.log(filePath);
      if (filePath) {
        return response.download(filePath);
      } else {
        return response.send(Utils.response(false, "file_not_found", null));
      }
    } catch (e) {
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async UploadFileVMS({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      const file = request.file("file");
      //console.log(file)
      const fileContent = await Utils.readFile(file.tmpPath);
      const file_size = file.size;
      const file_name = file.clientName;
      const file_ext = file.extname;
      const file_type = file.type;
      const fileBuffer = Buffer.from(fileContent);

      const { para } = request.all();
      let p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }
      const params = [...JSON.parse(para)];
      const result = await DBService.ExecuteSQLBlob(
        `BEGIN vms_upd_tvm_obj_file(:p_action, :p_tvm_obj_file_pk, :p_tvm_obj_pk, :p_file_size, :p_file_name, :p_file_path, :p_file_ext, :p_file_type, :p_file_content, :p_language, :p_crt_by, :p_rtn_cur); END;`,
        {
          p_action: params[0],
          p_tvm_obj_file_pk: params[1],
          p_tvm_obj_pk: params[2],
          p_file_size: file_size,
          p_file_name: file_name,
          p_file_path: params[3],
          p_file_ext: file_ext,
          p_file_type: file_type,
          p_file_content: fileBuffer,
        },
        p_language,
        p_crt_by
      );
      return response.send(
        Utils.response(true, "Upload file was sucessfully!", result)
      );
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "DsoController",
        FUNC: "UploadFileVMS",
        CONTENT: e.message,
        CRT_BY: p_crt_by,
      });
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async createDictionaryAuto({ request, response, auth }) {
    try {
      const { fileid, menu_cd, _db2 } = request.all();
      let p_language = request.header("accept-language", "ENG");
      let p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }
      let path = `/resources/pages/${fileid.substr(0, 2)}/${fileid.substr(
        2,
        2
      )}/${fileid}.vue`;
      let filePath = Helpers.appRoot(path);
      let liner = new lineByLine(filePath);

      let line;
      let startIdx;
      _message_ids = [];
      while ((line = liner.next())) {
        line = line.toString("ascii");
        startIdx = line.indexOf("$t(");
        if (startIdx > 0) {
          await this.processLineStranslate(line, fileid, p_language, p_crt_by);
        }
      }
      //process file in popup
      let popup_path = `/resources/pages/${fileid.substr(0, 2)}/${fileid.substr(
        2,
        2
      )}/`;
      popup_path = Helpers.appRoot(popup_path);
      let filenames = await Utils.readDir(popup_path);
      for (let i = 0; i < filenames.length; i++) {
        if (
          filenames[i].indexOf(fileid) >= 0 &&
          filenames[i].indexOf(".vue") > 0
        ) {
          let filePartPath = popup_path + filenames[i];
          liner = new lineByLine(filePartPath);
          while ((line = liner.next())) {
            line = line.toString("ascii");
            startIdx = line.indexOf("$t(");
            if (startIdx > 0) {
              await this.processLineStranslate(
                line,
                fileid,
                p_language,
                p_crt_by
              );
            }
          }
        }
      }

      //process file in /resources/components/part/...
      let part_path = `/resources/components/part/${fileid.substr(
        0,
        2
      )}/${fileid.substr(2, 2)}/`;
      part_path = Helpers.appRoot(part_path);
      filenames = await Utils.readDir(part_path);
      for (let i = 0; i < filenames.length; i++) {
        if (
          filenames[i].indexOf(fileid) >= 0 &&
          filenames[i].indexOf(".vue") > 0
        ) {
          let filePartPath = part_path + filenames[i];
          liner = new lineByLine(filePartPath);
          while ((line = liner.next())) {
            line = line.toString("ascii");
            startIdx = line.indexOf("$t(");
            if (startIdx > 0) {
              await this.processLineStranslate(
                line,
                fileid,
                p_language,
                p_crt_by
              );
            }
          }
        }
      }

      if (_message_ids.length > 0) {
        await DBService.callProcCursor(
          "sys_upd_dictionary_auto",
          [_message_ids.join(), menu_cd ? menu_cd : fileid],
          p_language,
          p_crt_by,
          _db2
        );
      }

      //console.log(_message_ids)
      return response.send(
        Utils.response(true, "Successfull_call_procedure", filePath)
      );
    } catch (e) {
      Utils.ConsoleLogError(e.message);
      Utils.Logger({
        LVL: "error",
        MODULE: "DsoController",
        FUNC: "createDictionaryAuto",
        CONTENT: e.message,
      });
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async processLineStranslate(line, fileid, p_language, p_crt_by) {
    let endIdx, message_id;
    let startIdx = line.indexOf("$t(");
    if (startIdx > 0) {
      endIdx = line.indexOf(")", startIdx);
      if (endIdx > startIdx) {
        message_id = line.substring(startIdx + 3, endIdx - 1);
        const tmp = message_id.split(",");
        message_id = tmp[0];
        message_id = message_id.replace(/\s/g, "");
        message_id = message_id.replace(
          /[`~!@#$%^&*()|\=?;:'",.<>\{\}\[\]\\\/]/gi,
          ""
        );

        if (!_message_ids.includes(message_id) && message_id.indexOf("{") < 0) {
          _message_ids.push(message_id);
        }
        line = line.substring(endIdx + 1, 500);

        startIdx = line.indexOf("$t(");
        if (startIdx > 0) {
          await this.processLineStranslate(line, fileid, p_language, p_crt_by);
        }
      }
    }
  }

  /* async pushNotification_old({ request, response, auth }) {
    try {
      const { proc, para, _db2 } = request.all();
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }
      if (DB_CONNECTION == "oracle") {
        oracledb.fetchAsBuffer = [oracledb.BLOB];
        oracledb.fetchAsString = [oracledb.CLOB];
      }
      const result = await DBService.callProcCursor(
        proc,
        para,
        p_language,
        p_crt_by,
        _db2
      );
      if (result && result.length > 0) {
        let payload = {};
        const options = {
          // Required for background/quit data-only messages on iOS
          contentAvailable: true,
          // Required for background/quit data-only messages on Android
          priority: "high",
        };
        for (let i = 0; i < result.length; i++) {
          if (result[i].DEVICE_ID && result[i].TITLE) {
            payload = {
              notification: {
                titleLocKey: result[i].TITLE,
                bodyLocKey: result[i].BODY,
                sound: "default",
                priority: "high",
              },
              data: JSON.parse(result[i].DATA),
            };
            //console.log(payload)
            await Firebase.sendToDevice(result[i].DEVICE_ID, payload, options);
            await DBService.callProcCursor(
              "LG_WMS_UPD_NOTICE_LOG",
              [result[i].PK],
              p_language,
              p_crt_by
            );
          }
        }
      }
      return response.send(
        Utils.response(
          true,
          `[${result.length}] messages was sent`,
          result.length
        )
      );
    } catch (e) {
      Utils.ConsoleLogError(e.message);
      Utils.Logger({
        LVL: "error",
        MODULE: "DsoController",
        FUNC: "pushNotification",
        CONTENT: e.message,
        CRT_BY: p_crt_by,
      });
      return response.send(Utils.response(false, e.message, null));
    }
  } */

  async pushNotification({ request, response, auth }) {
    try {
      const { proc, para, _db2 } = request.all();
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }
      if (DB_CONNECTION == "oracle") {
        oracledb.fetchAsBuffer = [oracledb.BLOB];
        oracledb.fetchAsString = [oracledb.CLOB];
      }
      const result = await DBService.callProcCursor(
        proc,
        para,
        p_language,
        p_crt_by,
        _db2
      );
      if (result && result.length > 0) {
        for (let i = 0; i < result.length; i++) {
          const payload = {
            notification: {
              title: result[i].TITLE,
              body: result[i].BODY              
            },
            data: JSON.parse(result[i].DATA),
            token: result[i].DEVICE_ID,
            android: {
              "priority":"high"
            },
            apns: {
              headers: {
                "apns-priority": "5"
              },
              payload: {
                aps: {
                  alert: {
                    "title-loc-key": result[i].TITLE,
                    "loc-key": result[i].BODY,
                    sound: "default"
                  }
                }
              }
            }
          };
          const res = await Firebase.sendMessage(payload);
          if(res) {
            return response.send(Utils.response(true, `[${result.length}] messages was sent successful!`, res));
          } else {
            return response.send(Utils.response(false, `[${result.length}] messages was sent failed!`, null));
          }          
        }
        // return response.send(Utils.response(true, `[${result.length}] messages was sent`, result.length));
      }
    } catch (e) {
        Utils.ConsoleLogError(e.message);
        Utils.Logger({
            LVL: "error",
            MODULE: "DsoController",
            FUNC: "pushNotification",
            CONTENT: e.message,
            CRT_BY: p_crt_by,
        });
        return response.send(Utils.response(false, e.message, null));
    }
  }
}

module.exports = DsoController;
