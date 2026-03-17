"use strict";
const Utils = use("Utils");
const Env = use("Env");
const Helpers = use("Helpers");
const ROOT_DIR_FILES = Env.get("ROOT_DIR_FILES", Helpers.tmpPath());
const fs = use("fs");
const { transform } = require("camaro");
const DB_CONNECTION = Env.get("DB_CONNECTION");
const DBService = use("DBService");
const oracledb = require("oracledb");
const Request = use("Request");

const SAP_WSDL_USERNAME = Env.get("SAP_WSDL_USERNAME");
const SAP_WSDL_PASSWORD = Env.get("SAP_WSDL_PASSWORD");

const flow_url = Env.get("FLOW_URL");
const flow_cnts_crtc_key = Env.get("FLOW_CNTS_CRTC_KEY");
const FLOW_USER_INTT_ID = Env.get("FLOW_USER_INTT_ID");
const flow_api_user_id = Env.get("FLOW_API_USER_ID");
const flow_save_file = Env.get("FLOW_SAVE_FILE");
/*==[begin][Wabooks-ERP interface data]==*/
const waerp_url = Env.get("WAERP_URL");
const waerp_api_crts_key = Env.get("WAERP_API_CRTS_KEY");
const waerp_user_id = Env.get("WAERP_USER_ID");
const waerp_user_pw = Env.get("WAERP_USER_PW");
const waerp_ntnl_cd = Env.get("WAERP_NTNL_CD");
const waerp_time_zone = Env.get("WAERP_TIME_ZONE");
const waerp_biz_key = Env.get("WAERP_BIZ_KEY");  
const WaErpApiHelper = use('App/Helpers/WaErpApiHelper');
/*==[end][Wabooks-ERP interface data]==*/
class APIController {
  async FlowTask({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }
      const { colabo_srno, commt_ttl, cntn, task_rec, file_rec, img_file_rec, ...props } = request.all();
      // console.log("MORE", MORE);
      const jsonPara = {
        JSONData: {
          API_KEY: "COLABO2_COMMT_C101",
          CNTS_CRTC_KEY: flow_cnts_crtc_key,
          REQ_DATA: {
            USER_ID: flow_api_user_id,
            COLABO_SRNO: colabo_srno, // project id
            COMMT_TTL: commt_ttl,
            CNTN: cntn,

            TASK_REC: task_rec,
            // TASK_REC : [{
            //     TASK_NM : "THIS IS TEST FROM ANDREW TASK",
            //     STTS : "0",
            //     WORKER_REC : [{"WORKER_ID" :flow_api_user_id}]
            // }]

            FILE_REC: file_rec,
            // FILE_REC: [
            //   {
            //     ORG_FILE_NM: "Flow_API_document.docx",
            //     SAVE_FILE_NM: "BASE64_FILE",
            //   },
            // ],

            IMG_FILE_REC: img_file_rec,
            // IMG_FILE_REC: [
            //   {
            //     ORG_FILE_NM: "f32f6d173ab7f4e9ada6.jpg",
            //     SAVE_FILE_NM: "BASE64_FILE",
            //   },
            // ],

            ...props,
          },
        },
      };
      const res = await Request.post(flow_url, jsonPara);

      if (res.data.RSLT_CD == "0000" && flow_save_file == "true") {
        const result = await DBService.callProcCursor(
          "FLOW_CREATE_TASK",
          [colabo_srno, task_rec[0].TASK_NM || commt_ttl, cntn, flow_api_user_id],
          p_language,
          p_crt_by
        );
        if (result && result.length > 0) {
          if (img_file_rec && img_file_rec.length) {
            for (let i = 0; i < img_file_rec.length; i++) {
              await DBService.callBulkProcClob(
                "flow_create_task_file",
                [[result[0].PK, img_file_rec[i].ORG_FILE_NM, img_file_rec[i].SAVE_FILE_NM]],
                p_language,
                p_crt_by
              );
            }
          }

          if (file_rec && file_rec.length) {
            for (let i = 0; i < file_rec.length; i++) {
              await DBService.callBulkProcClob(
                "flow_create_task_file",
                [[result[0].PK, file_rec[i].ORG_FILE_NM, file_rec[i].SAVE_FILE_NM]],
                p_language,
                p_crt_by
              );
            }
          }
        }
      }

      return response.send(Utils.response(true, "", res.data));
    } catch (e) {
      console.log("===> task flow error: ", e);
      Utils.Logger({
        LVL: "error",
        MODULE: "APIController",
        FUNC: "FlowTask",
        CONTENT: e.message,
      });
      return response.send(null);
    }
  }
  async FlowArticle({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }
      const { colabo_srno, commt_ttl, cntn, base64_file_rec, file_rec, ...props } = request.all();

      const jsonPara = {
        JSONData: {
          API_KEY: "COLABO2_COMMT_C101",
          CNTS_CRTC_KEY: flow_cnts_crtc_key,
          REQ_DATA: {
            USER_ID: flow_api_user_id,
            COLABO_SRNO: colabo_srno, // project id
            // RANGE_TYPE: RANGE_TYPE,
            COMMT_TTL: commt_ttl, // title
            CNTN: cntn, // content

            BASE64_FILE_REC: base64_file_rec,
            //format BASE64_FILE_REC [
            //     {FILE_NAME: FILE_NAME.PNG, FILE: BASE64_FILE},
            //     {FILE_NAME: FILE_NAME.PNG, FILE: BASE64_FILE}
            // ]

            FILE_REC: file_rec,
            // FILE_REC: [
            //   {
            //     ORG_FILE_NM: "Flow_API_document.docx",
            //     SAVE_FILE_NM: "BASE64_FILE",
            //   },
            // ],

            // IMG_FILE_REC: IMG_FILE_REC,
            // IMG_FILE_REC: [
            //   {
            //     ORG_FILE_NM: "f32f6d173ab7f4e9ada6.jpg",
            //     SAVE_FILE_NM: "BASE64_FILE",
            //   },
            // ],

            // @: FlowArticle co the dung IMG_FILE_REC va BASE64_FILE_REC; FlowTask chi dung IMG_FILE_REC

            ...props,
          },
        },
      };

      const res = await Request.post(flow_url, jsonPara);

      if (res.data.RSLT_CD == "0000" && flow_save_file == "true") {
        const result = await DBService.callProcCursor(
          "FLOW_CREATE_ARTICLE",
          [colabo_srno, commt_ttl, cntn, flow_api_user_id],
          p_language,
          p_crt_by
        );
        if (result && result.length > 0) {
          if (base64_file_rec && base64_file_rec.length) {
            for (let i = 0; i < base64_file_rec.length; i++) {
              await DBService.callBulkProcClob(
                "flow_create_article_file",
                [[result[0].PK, base64_file_rec[i].FILE_NAME, base64_file_rec[i].FILE]],
                p_language,
                p_crt_by
              );
            }
          }

          if (file_rec && file_rec.length) {
            for (let i = 0; i < file_rec.length; i++) {
              await DBService.callBulkProcClob(
                "flow_create_article_file",
                [[result[0].PK, file_rec[i].ORG_FILE_NM, file_rec[i].SAVE_FILE_NM]],
                p_language,
                p_crt_by
              );
            }
          }
        }
      }

      return response.send(Utils.response(true, "", res.data));
    } catch (e) {
      console.log("===> article error: ", e);
      Utils.Logger({
        LVL: "error",
        MODULE: "APIController",
        FUNC: "FlowArticle",
        CONTENT: e.message,
      });
      return response.send(e);
    }
  }
  async FlowAlarmBot({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }
      let { rcvr_user_id, cntn, preview_link, preview_ttl, preview_cntn, ...props } = request.all();
      let jsonPara = {
        JSONData: {
          API_KEY: "FLOW_BOT_NOTI_API",
          CNTS_CRTC_KEY: flow_cnts_crtc_key,
          REQ_DATA: {
            BOT_ID: flow_api_user_id,
            RCVR_USER_ID: rcvr_user_id,
            CNTN: cntn,
            PREVIEW_LINK: preview_link,
            PREVIEW_TTL: preview_ttl,
            PREWIEW_CNTN: preview_cntn,

            ...props,
          },
        },
      };
      const res = await Request.post(flow_url, jsonPara);
      //console.log(res.data)
      return response.send(Utils.response(true, "error", res.data));
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "APIController",
        FUNC: "FlowAlarmBot",
        CONTENT: e.message,
      });
      return response.send(null);
    }
  }
  async FlowArticleRegister({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }
      let { rcvr_user_id, cntn, preview_link, PREVIEW_TTL, PREWIEW_CNTN } = request.all();
      let jsonPara = {
        JSONData: {
          API_KEY: "FLOW_BOT_NOTI_API",
          CNTS_CRTC_KEY: flow_cnts_crtc_key,
          REQ_DATA: {
            USER_ID: flow_api_user_id,
            COLABO_SRNO: rcvr_user_id,
            RANGE_TYPE: cntn,
            CNTN: preview_link,
            BASE64_FILE_RCV: [
              { FILE_NAME: "FILE.PNG", FILE: "BASE64 VALUES" },
              { FILE_NAME: "FILE.PNG", FILE: "BASE64 VALUES" },
            ],
          },
        },
      };
      const res = await Request.post(flow_url, jsonPara);
      //console.log(res.data)
      return response.send(Utils.response(true, "error", res.data));
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "APIController",
        FUNC: "FlowAlarmBot",
        CONTENT: e.message,
      });
      return response.send(null);
    }
  }

  async callSAPWebservice({ request, response, auth }) {
    try {
      const { xml_str, url } = request.all();

      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }
      var config = {
        withCredentials: true,
        headers: {
          "Content-Type": "text/xml; charset=utf-8",
          "Access-Control-Allow-Origin": "*",
        },
        auth: {
          username: SAP_WSDL_USERNAME,
          password: SAP_WSDL_PASSWORD,
        },
      };
      //console.log(config)
      const res = await Request.post(url, xml_str, config);
      console.log(res)
      return response.send(Utils.response(true, "error", res.data));
    } catch (e) {
      console.log(e);
      Utils.Logger({
        LVL: "error",
        MODULE: "APIController",
        FUNC: "FlowAlarmBot",
        CONTENT: e.message,
      });
      return response.send(Utils.response(false, e.message));
    }
  }
  /*==========[WABOOKS_ERP INTERFACE DATA]====================================================================================*/
  async callWaErpSVCProcess({ request, response, auth }) {
    try {
      let pLanguage = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }
      const { req_data, api_svc_id, svc_type, req_method, wcookie } = request.all();   
      let waerp_req_data = {};
      let waerp_api_svc_id = ""; 
      let config = {
        'method': req_method,
        'headers': {
          'Content-Type': 'application/json', 
        }
      };  
      switch (svc_type) {
        case 'wSearchCompanyForlogin':
          waerp_req_data = {
            USER_ID: (req_data.user_id ? req_data.user_id : waerp_user_id),
            USER_PW: (req_data.user_pw ? req_data.user_pw : waerp_user_pw)
          };
          waerp_api_svc_id = api_svc_id;
          break;
        case 'wLogin':
          waerp_req_data = {
            USER_ID: (req_data.user_id ? req_data.user_id : waerp_user_id),
            USER_PW: (req_data.user_pw ? req_data.user_pw : waerp_user_pw),
            BIZ_KEY: (req_data.biz_key ? req_data.biz_key : waerp_biz_key)
          };
          waerp_api_svc_id = api_svc_id;
          break;
        case 'wSVCProcess':
          waerp_req_data = { ...req_data };
          waerp_api_svc_id = api_svc_id;
          config = {
            method: req_method,
            headers: {
              'Content-Type': 'application/json',
              'Cookie': (wcookie?wcookie+'; Path=/;':'JSESSIONID=tempcookie.wabooksvn; Path=/;')
            }
          }; 
          break;
        default:
          waerp_req_data = { ...req_data };
          waerp_api_svc_id = api_svc_id;
          break;
      }
      if (waerp_api_svc_id != "") { 
        
        let jsonPara = JSON.stringify({
          REQ_DATA: {
            ...waerp_req_data
          },
          TIME_ZONE: waerp_time_zone,
          NTNL_CD: waerp_ntnl_cd,
          API_CRTS_KEY: waerp_api_crts_key,
          API_SVC_ID: waerp_api_svc_id
        }); 
        const res = (req_method == 'POST' ? await Request.post(waerp_url, jsonPara, config) : await Request.get(waerp_url, jsonPara, config));  
        // console.log('[vng-154/dvg] > file: APIController.js:396 > APIController > callWaErpSVCProcess > res:', res);
        let rtnResult = res.data;  
        var waerp = null; 
        switch (svc_type) {
          case 'wSearchCompanyForlogin': 
            rtnResult.USER_ID = waerp_req_data.USER_ID;  
            waerp = new WaErpApiHelper(pLanguage, p_crt_by);   
            const rtnwSearchCompanyForlogin = await waerp.processData(svc_type, waerp_api_svc_id, rtnResult,waerp_req_data);
            break;
          case 'wLogin': 
            rtnResult.COOKIE = res.headers['set-cookie'][0];  
            waerp = new WaErpApiHelper(pLanguage, p_crt_by);   
            const rtnwLogin = await waerp.processData(svc_type, waerp_api_svc_id, rtnResult,waerp_req_data);
            break;
          case 'wSVCProcess':    
            waerp = new WaErpApiHelper(pLanguage, p_crt_by);    
            const rtnwSVCProcess = await waerp.processData(svc_type, waerp_api_svc_id, rtnResult,waerp_req_data);
            break;
        }
        return response.send(Utils.response(true, "success", rtnResult));
      }
      return response.send(Utils.response(false, "success", null));
    } catch (e) {
      Utils.Logger({ LVL: "error", MODULE: "WaBooksErpInterfaceData", FUNC: "callWaErpSearchingCompanyForLogin", CONTENT: e.message, });
      return response.send(Utils.response(false, e));
    }
  } 
}

module.exports = APIController;
