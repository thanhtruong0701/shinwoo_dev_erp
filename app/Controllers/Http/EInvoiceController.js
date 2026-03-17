"use strict";
const Utils = use("Utils");
const Env = use("Env");
const Helpers = use("Helpers");
const Request = use("Request");
const FormData = use("form-data");
const ROOT_DIR_FILES = Env.get("ROOT_DIR_FILES", Helpers.tmpPath());
const API_URL = Env.get("API_URL");
const EINVOICE_USER = Env.get("EINVOICE_USER");
const EINVOICE_PW = Env.get("EINVOICE_PW");
const EINVOICE_URL_LOGIN = Env.get("EINVOICE_URL_LOGIN");
const EINVOICE_URL_API = Env.get("EINVOICE_URL_API");
const EINVOICE_URL_API_CHECKING = Env.get("EINVOICE_URL_API_CHECKING");
const EINVOICE_URL_API_INFORMADJUST_SEND = Env.get(
  "EINVOICE_URL_API_INFORMADJUST_SEND"
);
const EINVOICE_URL_API_INFORMADJUST_CHECK = Env.get(
  "EINVOICE_URL_API_INFORMADJUST_CHECK"
);
const EINVOICE_URL_API_DECLARATION_SEND = Env.get(
  "EINVOICE_URL_API_DECLARATION_SEND"
);
const EINVOICE_URL_API_DECLARATION_CHECK = Env.get(
  "EINVOICE_URL_API_DECLARATION_CHECK"
);
const EINVOICE_URL_API_CONVERT = Env.get("EINVOICE_URL_API_DECLARATION_CHECK");
const EINVOICE_URL_API_CONVERT_EINV = Env.get("EINVOICE_URL_API_CONVERT_EINV");
const EINVOICE_URL_API_VIEW_PDF = Env.get("EINVOICE_URL_API_VIEW_PDF");
const EINVOICE_URL_API_CHECKING_STATUS_EINV = Env.get(
  "EINVOICE_URL_API_CHECKING_STATUS_EINV"
);
const SMTP_SERVER = Env.get("SMTP_SERVER");
const SMTP_PORT = Env.get("SMTP_PORT");
const EMAIL_FROM = Env.get("EMAIL_FROM");
const EMAIL_USER = Env.get("EMAIL_USER");
const EMAIL_PW = Env.get("EMAIL_PW");
const _send_from_users = eval(Env.get("send_from_users"));
const fs = use("fs");
const { transform } = require("camaro");
const convertXML = require("xml-js");
const DB_CONNECTION = Env.get("DB_CONNECTION");
const DBService = use("DBService");
const oracledb = require("oracledb");
const EiExcelHandler = use("App/Helpers/EiExcelHandler");
const Url1 = "https://masothue.com/Ajax/Token/";
const Url2 = "https://masothue.com/Ajax/Search/";
const Url3 =
  "https://masothue.com/Search/?q=1101737955&type=enterpriseTax&force-search=1";
const EINVOICE_SEND_DATA_EINVOICE =
  "http://csharp-api.webcashvietnam.com/wseinvoice/BSService.asmx/ListIssueInvoice_v8";
const EINVOICE_CANCEL_DATA_EINVOICE =
  "http://csharp-api.webcashvietnam.com/wseinvoice/BSService.asmx/List_Cancel_Invoice_v2";
const EINVOICE_INSERT_CUSTOMER =
  "http://csharp-api.webcashvietnam.com/wseinvoice/BSService.asmx/ListInsertCustomers_Md5";
const EINVOICE_UPDATE_CUSTOMER =
  "http://csharp-api.webcashvietnam.com/wseinvoice/BSService.asmx/UpdateCustomers_v3";
const EINVOICE_CHECK_DATA =
  "http://csharp-api.webcashvietnam.com/wseinvoice/BSService.asmx/Get_Status_EInvoice_v3";

class EInvoiceController {
  async einvoicePdfConvert({ request, response, auth }) {
    var p_language = request.header("accept-language", "ENG");
    var p_crt_by = "";
    const { tradecode } = request.all();
    let EiExcel = new EiExcelHandler();
    const user = await auth.getUser();
    if (user) {
      p_crt_by = user.USER_ID;
    }
    let result = await EiExcel.getEinvoice(tradecode, p_language, p_crt_by);
    return response.send(result);
  }

  async callLogin(p_url, p_user_id, p_user_pw) {
    try {
      // console.log("p_url  ", p_url);
      // console.log("p_user_id  ", p_user_id);
      // console.log("p_user_pw  ", p_user_pw);
      const res = await Request.post(p_url, {
        user_id: p_user_id,
        password: p_user_pw,
      });
      // console.log("res.data", res.data);
      // console.log("res.data.data", res.data.data.token);
      return res.data.data.token;
    } catch (err) {
      // console.log("err",err)
      return null;
    }
  }

  async sendMail({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }
      const config = {
        headers: { Authorization: request.headers().authorization },
      };
      //console.log(config)
      const { tradecodes } = request.all();
      let smtp_info = {
        host: SMTP_SERVER,
        port: SMTP_PORT,
        secure: false, // true for 465, false for other ports
        tls: {
          secureProtocol: "TLSv1_method",
          secure: false,
          ignoreTLS: true,
          rejectUnauthorized: false,
        },
        auth: {
          user: EMAIL_USER,
          pass: EMAIL_PW,
        },
      };
      if (DB_CONNECTION == "oracle") {
        oracledb.fetchAsBuffer = [oracledb.BLOB];
        oracledb.fetchAsString = [oracledb.CLOB];
      }
      let rtnResult = [];
      const template = await DBService.callProcCursor(
        "sys_sel_mail_template_default",
        ["einvoice"],
        "ENG",
        p_crt_by,
        "N"
      );
      //console.log("template", template)
      for (let i = 0; i < tradecodes.length; i++) {
        const tradcode = tradecodes[i].tradecode;
        const mail_to = tradecodes[i].mail_to;
        const mail_cc = tradecodes[i].mail_cc;
        let pdf_url = await Request.post(
          API_URL + "/einvoice/einvoicepdfconvert",
          { tradecode: tradcode },
          config
        );
        let xml_url = await Request.get(
          API_URL +
            "/dso/getfiledbtoken?proc=EI_SEL_XML_FILE_BY_TRADECODE&pk=" +
            tradcode
        );
        const subject = template[0].SUBJECT;
        const body = template[0].BODY;
        let pdf_file_name = "";
        let xml_file_name = "";

        if (pdf_url == null || pdf_url == undefined || pdf_url == "") {
          rtnResult.push({
            tradcode: tradcode,
            success: false,
            errmsg: "fail to create invoice pdf file",
          });
          continue;
        }

        if (xml_url == null || xml_url == undefined || xml_url == "") {
          rtnResult.push({
            tradcode: tradcode,
            success: false,
            errmsg: "fail to create invoice xml file",
          });
          continue;
        }
        pdf_url = pdf_url.data;
        xml_url = xml_url.data;

        const invoice = await DBService.callProcCursor(
          "ei_sel_einvoice_by_tradecode",
          [tradcode],
          "ENG",
          p_crt_by,
          "N"
        );
        let cnt = 0;
        if (invoice[0].SMTP_SERVER) {
          smtp_info.host = invoice[0].SMTP_SERVER;
          smtp_info.port = invoice[0].SMTP_PORT;
          cnt = i % 5;
          if (cnt == 0) {
            smtp_info.auth.user = invoice[0].SMTP_MAIL1;
            smtp_info.auth.pass = invoice[0].SMTP_MAIL1_PW;
          } else if (cnt == 1) {
            if (invoice[0].SMTP_MAIL2 && invoice[0].SMTP_MAIL2.length > 5) {
              smtp_info.auth.user = invoice[0].SMTP_MAIL2;
              smtp_info.auth.pass = invoice[0].SMTP_MAIL2_PW;
            } else {
              smtp_info.auth.user = invoice[0].SMTP_MAIL1;
              smtp_info.auth.pass = invoice[0].SMTP_MAIL1_PW;
            }
          } else if (cnt == 2) {
            if (invoice[0].SMTP_MAIL2 && invoice[0].SMTP_MAIL3.length > 5) {
              smtp_info.auth.user = invoice[0].SMTP_MAIL3;
              smtp_info.auth.pass = invoice[0].SMTP_MAIL3_PW;
            } else {
              smtp_info.auth.user = invoice[0].SMTP_MAIL1;
              smtp_info.auth.pass = invoice[0].SMTP_MAIL1_PW;
            }
          } else if (cnt == 3) {
            if (invoice[0].SMTP_MAIL2 && invoice[0].SMTP_MAIL4.length > 5) {
              smtp_info.auth.user = invoice[0].SMTP_MAIL4;
              smtp_info.auth.pass = invoice[0].SMTP_MAIL4_PW;
            } else {
              smtp_info.auth.user = invoice[0].SMTP_MAIL1;
              smtp_info.auth.pass = invoice[0].SMTP_MAIL1_PW;
            }
          } else if (cnt == 4) {
            if (invoice[0].SMTP_MAIL2 && invoice[0].SMTP_MAIL5.length > 5) {
              smtp_info.auth.user = invoice[0].SMTP_MAIL5;
              smtp_info.auth.pass = invoice[0].SMTP_MAIL5_PW;
            } else {
              smtp_info.auth.user = invoice[0].SMTP_MAIL1;
              smtp_info.auth.pass = invoice[0].SMTP_MAIL1_PW;
            }
          }
        } else {
          //use webcashgenuwin email
          cnt = i % _send_from_users.length;
          if (cnt < _send_from_users.length) {
            smtp_info.auth.user = _send_from_users[cnt].email;
            smtp_info.auth.pass = _send_from_users[cnt].password;
          }
        }
        if (smtp_info.port == 465 || smtp_info.port == "465") {
          smtp_info.secure = true;
        }

        let subject_binding = {
          SELLER_COMPANY_NAME: invoice[0].SELLER_COMPANY_NAME,
          FORM_NO: invoice[0].FORM_NO,
          SERIAL_NO: invoice[0].SERIAL_NO,
          INVOICE_NO: invoice[0].INVOICE_NO,
        };
        let body_binding = {
          EINVOICE_LOOKUP_URL:
            '<a href="http://e-invoice.webcashgenuwin.com/tracuuhd" rel="noopener noreferrer" target="_blank">http://e-invoice.webcashgenuwin.com/tracuuhd</a>',
          TRADECODE: tradcode,
        };
        pdf_file_name = invoice[0].INVOICE_NO + ".pdf";
        xml_file_name = invoice[0].INVOICE_NO + ".xml";
        let mail_option = {
          from: smtp_info.auth.user,
          to: mail_to, // list of receivers, separate by comma(;)
          cc: mail_cc,
          subject: subject, // Subject line
          text: "", // plain text body
          html: body, // html body
          attachments: [
            { filename: pdf_file_name, path: pdf_url },
            { filename: xml_file_name, path: xml_url },
          ],
        };
        //console.log("subject_binding", subject_binding)

        mail_option.subject = Utils.replaceString(
          mail_option.subject,
          subject_binding
        );
        mail_option.html = Utils.replaceString(mail_option.html, body_binding);
        //console.log("mail_option", mail_option)
        //console.log("smtp_info", smtp_info)
        const result = await Utils.smtpSendMail(mail_option, smtp_info);
        rtnResult.push({ tradcode: tradcode, success: result });
      }
      return response.send(
        Utils.response(true, `Sent mail result.`, rtnResult)
      );
    } catch (e) {
      Utils.ConsoleLogError(e.message);
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "sendMail",
        CONTENT: e.message,
      });
      return response.send(
        Utils.response(false, `Send mail neet error.`, e.message)
      );
    }
  }

  async convertDeclareUsingInvoiceToXML({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }
      const { declare } = request.all();
      let jsonDeclare = {
        TKhai: {
          DLTKhai: {
            TTChung: {
              PBan: "2.0.0",
              MSo: "01/ĐKTĐ-HĐĐT",
              Ten: "Tờ khai đăng ký/thay đổi thông tin sử dụng hóa đơn điện tử",
              HThuc: 1,
              TNNT: "Vinmart",
              MST: 104918404,
              CQTQLy: "Chi cục thuế Quận Hoàng Mai",
              MCQTQLy: 10108,
              NLHe: "NGUYỄN THỊ DUNG",
              DCLHe: "Quận Hoàng Mai, Hà Nội",
              DCTDTu: "dungnguyentran@gmail.com",
              DTLHe: "394552327",
              DDanh: "Hà Nội",
              NLap: "2021-15-11",
            },
            NDTKhai: {
              HTHDon: {
                CMa: 1,
                KCMa: 0,
              },
              HTGDLHDDT: {
                NNTDBKKhan: 0,
                NNTKTDNUBND: 0,
                CDLTTDCQT: 0,
                CDLQTVAN: 0,
              },
              PThuc: {
                CDDu: 1,
                CBTHop: 0,
              },
              LHDSDung: {
                HDGTGT: 1,
                HDBHang: 1,
                HDBTSCong: "",
                HDBHDTQGia: "",
                HDKhac: 0,
                CTu: 1,
              },
              DSCTSSDung: {
                CTS: [],
              },
            },
          },
          DSCKS: {
            NNT: "",
          },
        },
      };

      if (declare && !declare.hasOwnProperty("seller_taxcode")) {
        return response.send(
          Utils.response(false, `Invalid json format.`, declare)
        );
      }
      jsonDeclare.TKhai.DLTKhai.TTChung.Ten = this.convertHtmlCode(
        declare.declare_name
      );
      jsonDeclare.TKhai.DLTKhai.TTChung.HThuc = declare.declare_type;
      jsonDeclare.TKhai.DLTKhai.TTChung.TNNT = this.convertHtmlCode(
        declare.seller_company_name
      );
      jsonDeclare.TKhai.DLTKhai.TTChung.MST = declare.seller_taxcode;
      jsonDeclare.TKhai.DLTKhai.TTChung.CQTQLy = declare.tax_office_name;
      jsonDeclare.TKhai.DLTKhai.TTChung.MCQTQLy = declare.tax_office_code;
      jsonDeclare.TKhai.DLTKhai.TTChung.NLHe = this.convertHtmlCode(
        declare.contact_person
      );
      jsonDeclare.TKhai.DLTKhai.TTChung.DCLHe = this.convertHtmlCode(
        declare.contact_address
      );
      jsonDeclare.TKhai.DLTKhai.TTChung.DCTDTu = declare.contact_email;
      jsonDeclare.TKhai.DLTKhai.TTChung.DTLHe = declare.contact_phone;
      jsonDeclare.TKhai.DLTKhai.TTChung.DDanh = this.convertHtmlCode(
        declare.location_name
      );
      jsonDeclare.TKhai.DLTKhai.TTChung.NLap = declare.created_date;
      jsonDeclare.TKhai.DLTKhai.NDTKhai.HTHDon.CMa = declare.has_code;
      jsonDeclare.TKhai.DLTKhai.NDTKhai.HTHDon.KCMa = declare.no_code;
      jsonDeclare.TKhai.DLTKhai.NDTKhai.HTGDLHDDT.NNTDBKKhan =
        declare.taxpayer_from_difficult_location;
      jsonDeclare.TKhai.DLTKhai.NDTKhai.HTGDLHDDT.NNTKTDNUBND =
        declare.taxpayer_from_people_committee_suggestions;
      jsonDeclare.TKhai.DLTKhai.NDTKhai.HTGDLHDDT.CDLTTDCQT =
        declare.transfer_data_directly_to_tax_office;
      jsonDeclare.TKhai.DLTKhai.NDTKhai.HTGDLHDDT.CDLQTVAN = declare.cdlqtvan;
      jsonDeclare.TKhai.DLTKhai.NDTKhai.PThuc.CDDu = declare.full_transfer;
      jsonDeclare.TKhai.DLTKhai.NDTKhai.PThuc.CBTHop = declare.summary_transfer;

      jsonDeclare.TKhai.DLTKhai.NDTKhai.LHDSDung.HDGTGT = declare.vat_invoice;
      jsonDeclare.TKhai.DLTKhai.NDTKhai.LHDSDung.HDBHang =
        declare.saling_invoice;
      jsonDeclare.TKhai.DLTKhai.NDTKhai.LHDSDung.HDBTSCong =
        declare.public_asset_invoice;
      jsonDeclare.TKhai.DLTKhai.NDTKhai.LHDSDung.HDBHDTQGia =
        declare.national_reserve_goods_invoice;
      jsonDeclare.TKhai.DLTKhai.NDTKhai.LHDSDung.HDKhac = declare.other_invoice;
      jsonDeclare.TKhai.DLTKhai.NDTKhai.LHDSDung.CTu = declare.voucher;

      for (let i = 0; i < declare.digital_certificates.length; i++) {
        jsonDeclare.TKhai.DLTKhai.NDTKhai.DSCTSSDung.CTS.push({
          STT: declare.digital_certificates[i].sequence,
          TTChuc: declare.digital_certificates[i].organization_name,
          Seri: declare.digital_certificates[i].serial_no,
          TNgay: declare.digital_certificates[i].from_date,
          DNgay: declare.digital_certificates[i].to_date,
          HThuc: declare.digital_certificates[i].type,
        });
      }
      const xml = convertXML.json2xml(jsonDeclare, {
        compact: true,
        ignoreComment: true,
        spaces: 4,
      });
      return response.send(
        Utils.response(
          true,
          `Convert declare using invoices to xml was succesful.`,
          xml.toString().replace(/\n/g, "")
        )
      );
    } catch (e) {
      Utils.ConsoleLogError(e.message);
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "convertDeclareUsingInvoiceToXML",
        CONTENT: e.message,
      });
      return response.send(Utils.response(false, "error", e.message));
    }
  }

  async convertInvoiceToXMLClient({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }

      const { proc, invoices } = request.all();

      console.log(" invoices ", invoices);

      const token = await this.callLogin(
        EINVOICE_URL_LOGIN,
        EINVOICE_USER,
        EINVOICE_PW
      );

      if (token) {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const res = await Request.post(
          EINVOICE_URL_API_CONVERT_EINV,
          { invoices: invoices },
          config
        );
        console.log("convertInvoiceToXMLClient", res.data);
        return response.send(res.data);
      } else {
        console.error("Failed to get api token");
      }
      return response.send(
        Utils.response(false, `Failed to send invoices.....`, null)
      );
    } catch (e) {
      Utils.ConsoleLogError(e.message);
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "convertInvoiceToXMLClient",
        CONTENT: e.message,
      });
      return response.send(Utils.response(false, "error", e.message));
    }
  }

  async convertInvaliInvoiceToXML({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }
      const { invalid_invoices } = request.all();
      let jsonInvalidInvoices = {
        TBao: {
          DLTBao: {
            PBan: "v2.0.0",
            MSo: "04/SS-HĐĐT",
            Ten: "Thông báo hóa đơn điện tử có sai sót",
            Loai: 1,
            So: "",
            NTBCCQT: "",
            TCQT: "Chi cục thuế thành phố Hà Nội",
            MCQT: 101,
            MST: 104918404,
            TNNT: "Vinmart",
            DDanh: "Hà Nội",
            NTBao: "2021-10-07",
            DSHDon: {
              HDon: [
                /*{
                    MCQTCap: 1234,
                    KHMSHDon: 4,
                    KHHDon: "C21TYY",
                    SHDon: 411,
                    Ngay: "2021-10-07",
                    LADHDDT: 1,
                    TCTBao: 2,
                    LDo: "Điều chỉnh tên người bán cho hóa đơn Mẫu số 6 ký hiệu C21TYY số 61 ngày 29 tháng 09 năm 2021"
                },*/
              ],
            },
          },
          DSCKS: {
            NNT: "",
          },
        },
      };
      if (
        invalid_invoices &&
        !invalid_invoices.hasOwnProperty("tax_office_name")
      ) {
        return response.send(
          Utils.response(false, `Invalid json format.`, invalid_invoices)
        );
      }
      jsonInvalidInvoices.TBao.DLTBao.TCQT = this.convertHtmlCode(
        invalid_invoices.tax_office_name
      );
      jsonInvalidInvoices.TBao.DLTBao.MCQT = invalid_invoices.tax_office_code;
      jsonInvalidInvoices.TBao.DLTBao.MST = invalid_invoices.seller_taxcode;
      jsonInvalidInvoices.TBao.DLTBao.TNNT = this.convertHtmlCode(
        invalid_invoices.seller_company_name
      );
      jsonInvalidInvoices.TBao.DLTBao.DDanh = this.convertHtmlCode(
        invalid_invoices.location_name
      );
      jsonInvalidInvoices.TBao.DLTBao.NTBao = invalid_invoices.inform_date;

      for (let i = 0; i < invalid_invoices.invoices.length; i++) {
        jsonInvalidInvoices.TBao.DLTBao.DSHDon.HDon.push({
          MCQTCap: invalid_invoices.invoices[i].tax_confirmation_code,
          KHMSHDon: invalid_invoices.invoices[i].form_no,
          KHHDon: invalid_invoices.invoices[i].serial_no,
          SHDon: invalid_invoices.invoices[i].invoice_no,
          Ngay: invalid_invoices.invoices[i].invoice_date,
          LADHDDT: invalid_invoices.invoices[i].invoice_type,
          TCTBao: invalid_invoices.invoices[i].inform_type,
          LDo: this.convertHtmlCode(invalid_invoices.invoices[i].reason),
        });
      }
      const xml = convertXML.json2xml(jsonInvalidInvoices, {
        compact: true,
        ignoreComment: true,
        spaces: 4,
      });
      return response.send(
        Utils.response(
          true,
          `Convert invalid invoices to xml was succesful.`,
          xml.toString().replace(/\n/g, "")
        )
      );
    } catch (e) {
      Utils.ConsoleLogError(e.message);
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "convertInvaliInvoiceToXML",
        CONTENT: e.message,
      });
      return response.send(Utils.response(false, "error", e.message));
    }
  }

  async convertInvoiceToXML({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }

      const { invoices } = request.all();
      console.log(" invoices  ", invoices);
      //invoices = JSON.parse(invoices);
      let rtnXML = [];
      let objInvoice_M = {
        HDon: {
          DLHDon: {
            TTChung: {
              PBan: "",
              THDon: "",
              KHMSHDon: "",
              KHHDon: "",
              SHDon: "",
              MHSo: "",
              NLap: "",
              SBKe: "",
              NBKe: "",
              DVTTe: "",
              TGia: "",
              HTTToan: "",
              MSTTCGP: "",
              MSTDVNUNLHDon: "",
              TDVNUNLHDon: "",
              DCDVNUNLHDon: "",
              TTKhac: {},
            },
            NDHDon: {
              NBan: {
                Ten: "",
                MST: "",
                DChi: "",
                SDThoai: "",
                DCTDTu: "",
                STKNHang: "",
                NNBSTKNHang: "",
                TNHang: "",
                Fax: "",
                Website: "",
                TTKhac: "",
              },
              NMua: {
                Ten: "",
                MST: "",
                DChi: "",
                MKHang: "",
                SDThoai: "",
                DCTDTu: "",
                HVTNMHang: "",
                TNHang: "",
                TTKhac: "",
              },
              DSHHDVu: {},
              TToan: {
                THTTLTSuat: {
                  LTSuat: {
                    TSuat: "",
                    ThTien: "",
                    TThue: "",
                  },
                },
                TgTCTHue: "",
                TgTThue: "",
                DSLPhi: {
                  LPhi: {},
                },
                TTCKTMai: "",
                TgTTTBSo: "",
                TgTTTBChu: "",
                TTKhac: {
                  TTin: {
                    TTruong: "",
                    KDLieu: "",
                    DLieu: "",
                  },
                },
              },
            },
          },
          DSCKS: {},
        },
      };
      /*let invoices_sample=[
                      {master:{},detail:[{}]},
                      {master:{},detail:[{}]},
                      {master:{},detail:[{}]},
                  ];*/
      //console.log("invoices1:", invoices)
      if (invoices.length == undefined || invoices.length == 0) {
        return response.send(
          Utils.response(false, `Invalid json format.`, invoices)
        );
      }
      const lastInvoiceNo = await DBService.callProcCursor(
        "ei_sel_last_invoice_no",
        [
          invoices[0].master.seller_taxcode,
          invoices[0].master.serial_no,
          invoices[0].master.form_no,
        ],
        "ENG",
        p_crt_by,
        "N"
      );
      let last_invoice_no = lastInvoiceNo[0].INVOICE_NO;
      const last_invoice_date = lastInvoiceNo[0].INVOICE_DATE;
      const tomorrow_date = lastInvoiceNo[0].TOMORROW_DATE;
      if (isNaN(last_invoice_no)) {
        return response.send(
          Utils.response(
            false,
            `Failed to create invoice no. Please contact administrator for helping.`,
            null
          )
        );
      }
      for (let i = 0; i < invoices.length; i++) {
        //console.log("invoices:", invoices[i])
        objInvoice_M.HDon.DLHDon.TTChung.PBan = "v2.0.0";
        if (invoices[i].master.form_no == 1) {
          objInvoice_M.HDon.DLHDon.TTChung.THDon = "Hóa đơn giá trị gia tăng";
        } else if (invoices[i].master.form_no == 2) {
          objInvoice_M.HDon.DLHDon.TTChung.THDon =
            "Hóa đơn bán hàng dự trữ quốc gia";
        } else if (invoices[i].master.form_no == 3) {
          objInvoice_M.HDon.DLHDon.TTChung.THDon = "Hóa đơn bán hàng";
        } else if (invoices[i].master.form_no == 4) {
          objInvoice_M.HDon.DLHDon.TTChung.THDon = "Hóa đơn khác";
        } else if (invoices[i].master.form_no == 5) {
          objInvoice_M.HDon.DLHDon.TTChung.THDon = "Hóa đơn bán tài sản công";
        } else if (invoices[i].master.form_no == 6) {
          objInvoice_M.HDon.DLHDon.TTChung.THDon =
            "Chứng từ điện tử được sử dụng và quản lý như hóa đơn";
        }
        last_invoice_no++;
        objInvoice_M.HDon.DLHDon.TTChung.KHMSHDon = invoices[i].master.form_no;
        objInvoice_M.HDon.DLHDon.TTChung.KHHDon = invoices[i].master.serial_no;
        objInvoice_M.HDon.DLHDon.TTChung.SHDon = last_invoice_no;
        objInvoice_M.HDon.DLHDon.TTChung.MHSo = "";
        if (invoices[i].master.invoice_date < last_invoice_date) {
          return response.send(
            Utils.response(
              false,
              `invoice date cannot smaller than ${last_invoice_date}.`,
              invoices[i].master.invoice_date
            )
          );
        }
        if (invoices[i].master.invoice_date > tomorrow_date) {
          return response.send(
            Utils.response(
              false,
              `invoice date cannot greater than ${tomorrow_date}.`,
              invoices[i].master.invoice_date
            )
          );
        }
        objInvoice_M.HDon.DLHDon.TTChung.NLap = invoices[i].master.invoice_date;
        objInvoice_M.HDon.DLHDon.TTChung.SBKe = "";
        objInvoice_M.HDon.DLHDon.TTChung.NBKe = "";
        objInvoice_M.HDon.DLHDon.TTChung.DVTTe = invoices[i].master.tr_ccy;
        objInvoice_M.HDon.DLHDon.TTChung.TGia = invoices[i].master.tr_rate;
        objInvoice_M.HDon.DLHDon.TTChung.HTTToan =
          invoices[i].master.payment_method;
        objInvoice_M.HDon.DLHDon.TTChung.MSTTCGP = "1201496252"; //webcashgenuwin.com taxcode
        objInvoice_M.HDon.DLHDon.TTChung.MSTDVNUNLHDon = "";
        objInvoice_M.HDon.DLHDon.TTChung.TDVNUNLHDon = "";
        objInvoice_M.HDon.DLHDon.TTChung.DCDVNUNLHDon = "";
        objInvoice_M.HDon.DLHDon.TTChung.TTKhac = {};
        objInvoice_M.HDon.DLHDon.TTChung.TTKhac.TTin = [];
        if (invoices[i].master.hasOwnProperty("customfield1")) {
          objInvoice_M.HDon.DLHDon.TTChung.TTKhac.TTin.push({
            TTruong: "customfield1",
            KDLieu: "string",
            DLieu: invoices[i].master.customfield1,
          });
        }
        if (invoices[i].master.hasOwnProperty("customfield2")) {
          objInvoice_M.HDon.DLHDon.TTChung.TTKhac.TTin.push({
            TTruong: "customfield2",
            KDLieu: "string",
            DLieu: invoices[i].master.customfield2,
          });
        }
        if (invoices[i].master.hasOwnProperty("customfield3")) {
          objInvoice_M.HDon.DLHDon.TTChung.TTKhac.TTin.push({
            TTruong: "customfield3",
            KDLieu: "string",
            DLieu: invoices[i].master.customfield3,
          });
        }
        if (invoices[i].master.hasOwnProperty("customfield4")) {
          objInvoice_M.HDon.DLHDon.TTChung.TTKhac.TTin.push({
            TTruong: "customfield4",
            KDLieu: "string",
            DLieu: invoices[i].master.customfield4,
          });
        }
        if (invoices[i].master.hasOwnProperty("customfield5")) {
          objInvoice_M.HDon.DLHDon.TTChung.TTKhac.TTin.push({
            TTruong: "customfield5",
            KDLieu: "string",
            DLieu: invoices[i].master.customfield5,
          });
        }
        if (invoices[i].master.hasOwnProperty("customfield6")) {
          objInvoice_M.HDon.DLHDon.TTChung.TTKhac.TTin.push({
            TTruong: "customfield6",
            KDLieu: "string",
            DLieu: invoices[i].master.customfield6,
          });
        }
        if (invoices[i].master.hasOwnProperty("customfield7")) {
          objInvoice_M.HDon.DLHDon.TTChung.TTKhac.TTin.push({
            TTruong: "customfield7",
            KDLieu: "string",
            DLieu: invoices[i].master.customfield7,
          });
        }
        if (invoices[i].master.hasOwnProperty("customfield8")) {
          objInvoice_M.HDon.DLHDon.TTChung.TTKhac.TTin.push({
            TTruong: "customfield8",
            KDLieu: "string",
            DLieu: invoices[i].master.customfield8,
          });
        }
        if (invoices[i].master.hasOwnProperty("customfield9")) {
          objInvoice_M.HDon.DLHDon.TTChung.TTKhac.TTin.push({
            TTruong: "customfield9",
            KDLieu: "string",
            DLieu: invoices[i].master.customfield9,
          });
        }
        if (invoices[i].master.hasOwnProperty("customfield10")) {
          objInvoice_M.HDon.DLHDon.TTChung.TTKhac.TTin.push({
            TTruong: "customfield10",
            KDLieu: "string",
            DLieu: invoices[i].master.customfield10,
          });
        }

        objInvoice_M.HDon.DLHDon.TTChung.TTHDLQuan = [];
        if (invoices[i].master.nature !== "0") {
          objInvoice_M.HDon.DLHDon.TTChung.TTHDLQuan.push({
            TCHDon: invoices[i].master.nature,
            LHDCLQuan: invoices[i].master.invoice_type_relative,
            KHMSHDCLQuan: invoices[i].master.form_no_relative,
            KHHDCLQuan: invoices[i].master.serial_no_relative,
            SHDCLQuan: invoices[i].master.invoice_no_relative,
            NLHDCLQuan: invoices[i].master.invoice_date_relative,
            GChu: invoices[i].master.description,
          });
        }

        objInvoice_M.HDon.DLHDon.NDHDon.NBan.Ten = this.convertHtmlCode(
          invoices[i].master.seller_company_name
        );
        objInvoice_M.HDon.DLHDon.NDHDon.NBan.MST = this.convertHtmlCode(
          invoices[i].master.seller_taxcode
        );
        objInvoice_M.HDon.DLHDon.NDHDon.NBan.DChi = this.convertHtmlCode(
          invoices[i].master.seller_address
        );
        objInvoice_M.HDon.DLHDon.NDHDon.NBan.SDThoai = this.convertHtmlCode(
          invoices[i].master.seller_tel
        );
        objInvoice_M.HDon.DLHDon.NDHDon.NBan.DCTDTu = this.convertHtmlCode(
          invoices[i].master.seller_email
        );
        objInvoice_M.HDon.DLHDon.NDHDon.NBan.STKNHang = this.convertHtmlCode(
          invoices[i].master.seller_bank_no
        );
        objInvoice_M.HDon.DLHDon.NDHDon.NBan.NNBSTKNHang = "";
        objInvoice_M.HDon.DLHDon.NDHDon.NBan.TNHang = this.convertHtmlCode(
          invoices[i].master.seller_bank_name
        );
        objInvoice_M.HDon.DLHDon.NDHDon.NBan.Fax = this.convertHtmlCode(
          invoices[i].master.seller_fax
        );
        objInvoice_M.HDon.DLHDon.NDHDon.NBan.Website = this.convertHtmlCode(
          invoices[i].master.seller_website
        );
        objInvoice_M.HDon.DLHDon.NDHDon.NBan.TTKhac = "";

        objInvoice_M.HDon.DLHDon.NDHDon.NMua.Ten = this.convertHtmlCode(
          invoices[i].master.buyer_name
        );
        objInvoice_M.HDon.DLHDon.NDHDon.NMua.MST = this.convertHtmlCode(
          invoices[i].master.buyer_taxcode
        );
        objInvoice_M.HDon.DLHDon.NDHDon.NMua.DChi = this.convertHtmlCode(
          invoices[i].master.buyer_address
        );
        objInvoice_M.HDon.DLHDon.NDHDon.NMua.MKHang = this.convertHtmlCode(
          invoices[i].master.buyer_code
        );
        objInvoice_M.HDon.DLHDon.NDHDon.NMua.SDThoai = this.convertHtmlCode(
          invoices[i].master.buyer_phone
        );
        objInvoice_M.HDon.DLHDon.NDHDon.NMua.DCTDTu = this.convertHtmlCode(
          invoices[i].master.buyer_email
        );
        objInvoice_M.HDon.DLHDon.NDHDon.NMua.HVTNMHang = "";
        objInvoice_M.HDon.DLHDon.NDHDon.NMua.STKNHang = this.convertHtmlCode(
          invoices[i].master.buyer_bank_no
        );
        objInvoice_M.HDon.DLHDon.NDHDon.NMua.TNHang = this.convertHtmlCode(
          invoices[i].master.buyer_bank_name
        );
        objInvoice_M.HDon.DLHDon.NDHDon.NMua.TTKhac = "";

        objInvoice_M.HDon.DLHDon.NDHDon.DSHHDVu = [];
        objInvoice_M.HDon.DLHDon.NDHDon.TToan.THTTLTSuat.LTSuat.TSuat =
          this.convertHtmlCode(invoices[i].master.vat_rate);
        objInvoice_M.HDon.DLHDon.NDHDon.TToan.THTTLTSuat.LTSuat.ThTien =
          invoices[i].master.amt_exclude_vat;
        objInvoice_M.HDon.DLHDon.NDHDon.TToan.THTTLTSuat.LTSuat.TThue =
          invoices[i].master.amt_vat;

        objInvoice_M.HDon.DLHDon.NDHDon.TToan.TgTCThue =
          invoices[i].master.amt_exclude_vat;
        objInvoice_M.HDon.DLHDon.NDHDon.TToan.TgTThue =
          invoices[i].master.amt_vat;
        objInvoice_M.HDon.DLHDon.NDHDon.TToan.DSLPhi.LPhi = "";
        objInvoice_M.HDon.DLHDon.NDHDon.TToan.TTCKTMai =
          invoices[i].master.comission_amt;
        objInvoice_M.HDon.DLHDon.NDHDon.TToan.TgTTTBSo =
          invoices[i].master.total_payment;
        objInvoice_M.HDon.DLHDon.NDHDon.TToan.TgTTTBChu = this.convertHtmlCode(
          invoices[i].master.total_payment_word_vie
        );

        objInvoice_M.HDon.DLHDon.NDHDon.TToan.TTKhac = {};
        objInvoice_M.HDon.DLHDon.NDHDon.TToan.TTKhac.TTin = [];
        objInvoice_M.HDon.DLHDon.NDHDon.TToan.TTKhac.TTin.push({
          TTruong: "Amount10",
          KDLieu: "decimal",
          DLieu: invoices[i].master.amt_exclude_vat,
        });
        objInvoice_M.HDon.DSCKS.NBan = "";
        objInvoice_M.HDon.DLHDon.NDHDon.DSHHDVu = {};
        objInvoice_M.HDon.DLHDon.NDHDon.DSHHDVu.HHDVu = [];

        for (let j = 0; j < invoices[i].detail.length; j++) {
          objInvoice_M.HDon.DLHDon.NDHDon.DSHHDVu.HHDVu.push({
            TChat: invoices[i].detail[j].item_type,
            STT: invoices[i].detail[j].seq_dis,
            MHHDVu: this.convertHtmlCode(invoices[i].detail[j].item_code),
            THHDVu: this.convertHtmlCode(invoices[i].detail[j].item_name),
            DVTinh: this.convertHtmlCode(invoices[i].detail[j].item_uom),
            SLuong: this.convertHtmlCode(invoices[i].detail[j].qty),
            DGia: this.convertHtmlCode(invoices[i].detail[j].unit_price),
            TLCKhau: this.convertHtmlCode(
              invoices[i].detail[j].commission_rate
            ),
            STCKhau: this.convertHtmlCode(invoices[i].detail[j].commission_amt),
            ThTien: this.convertHtmlCode(invoices[i].detail[j].net_tr_amt),
            TSuat: this.convertHtmlCode(invoices[i].detail[j].vat_rate),
            TTKhac: {
              TTin: [
                {
                  TTruong: "VATAmount",
                  KDLieu: "decimal",
                  DLieu: invoices[i].detail[j].vat_tr_amt,
                },
                {
                  TTruong: "Amount",
                  KDLieu: "decimal",
                  DLieu: invoices[i].detail[j].net_tr_amt,
                },
              ],
            },
          });
        }

        const xml = convertXML.json2xml(objInvoice_M, {
          compact: true,
          ignoreComment: true,
          spaces: 4,
        });
        const xmlStr = xml
          .toString()
          .replace("<DLHDon>", "<DLHDon Id='ID1'>")
          .replace(/\n/g, "");
        //console.log("xmlStr", xmlStr)
        rtnXML.push({
          master_pk: invoices[i].master.master_pk,
          invoice_no: last_invoice_no,
          xml: xmlStr,
        });
      }

      return response.send(
        Utils.response(true, `Convert json to xml was successful.`, rtnXML)
      );
    } catch (e) {
      Utils.ConsoleLogError(e.message);
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "convertInvoiceToXML",
        CONTENT: e.message,
      });
      return response.send(Utils.response(false, "error", e.message));
    }
  }

  convertHtmlCode(sText) {
    if (sText != null || sText == "") {
      return this.replaceAllExt(
        this.replaceAllExt(sText, "&", "&#38;"),
        '"',
        "&#34;"
      );
    } else {
      return "";
    }
  }

  replaceAllExt(strOgr, search, replacement) {
    var target = strOgr.toString();
    return target.replace(new RegExp(search, "g"), replacement);
  }

  async sendInvoiceToTaxOfficeFromClient({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }

      const { proc, para } = request.all();

      const token = await this.callLogin(
        EINVOICE_URL_LOGIN,
        EINVOICE_USER,
        EINVOICE_PW
      );

      if (token) {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const res = await Request.post(
          EINVOICE_URL_API,
          { para: para },
          config
        );
        console.log("sendInvoiceToTaxOfficeFromClient", res.data);
        return response.send(res.data);
      } else {
        console.error("Failed to get api token");
      }
      return response.send(
        Utils.response(false, `Failed to send invoices.....`, null)
      );
    } catch (e) {
      Utils.ConsoleLogError(e.message);
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "sendInvoiceToTaxOfficeFromClient",
        CONTENT: e.message,
      });
      return response.send(Utils.response(false, "error", e.message));
    }
  }

  async checkInvoiceStatusFromClient({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }

      const { proc, para } = request.all();

      const token = await this.callLogin(
        EINVOICE_URL_LOGIN,
        EINVOICE_USER,
        EINVOICE_PW
      );

      if (token) {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        console.log("EINVOICE_URL_API_CHECKING ", EINVOICE_URL_API_CHECKING);
        const res = await Request.post(
          EINVOICE_URL_API_CHECKING,
          { para: para },
          config
        );
        console.log("checkInvoiceStatusFromClient", res.data);
        return response.send(res.data);
      } else {
        console.error("Failed to get api token");
      }
      return response.send(
        Utils.response(false, `Failed to send invoices.`, null)
      );
    } catch (e) {
      Utils.ConsoleLogError(e.message);
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "sendInvoiceToTaxOfficeFromClient",
        CONTENT: e.message,
      });
      return response.send(Utils.response(false, "error", e.message));
    }
  }

  async sendInvoiceToTaxOffice({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }

      const authUserName = "GENUWIN"; // "GENUWIN";
      const authPassword = "e_GX4v@"; // "e_GX4v@";// "genuwin123";// "e_GX4v@";
      // const authPassword = "genuwin123"; // "e_GX4v@";
      //const url = "https://tvan.fpt.com.vn/ftvan-hddt/hdon/cmahdon";
      // const url = "https://tvan.webhoadon.com.vn/ftvan-hddt/hdon/cmahdon";
      //const url = "http://118.71.250.233/ftvan-hddt/hdon/cmahdon";
      const { proc, para } = request.all();

      const agent = {
        Agent: {
          defaultPort: 443,
          protocol: "https:",
          options: { maxVersion: "TLSv1.2", minVersion: "TLSv1.2", path: null },
        },
      };

      let rtnValue = [];
      for (let i = 0; i < para.length; i++) {
        const masterInvoicePK = await this.extractXMLContent(
          para[i].xml_signed,
          para[i].mail_to,
          para[i].mail_cc,
          p_language,
          p_crt_by
        );
        if (masterInvoicePK == -1) {
          console.log(
            `The issuer invoice has not register [${para[i].tei_einvoice_m_pk}]`,
            para[i].xml_signed
          );
          rtnValue.push({
            tei_einvoice_m_pk: para[i].tei_einvoice_m_pk,
            tradecode: "",
            errmsg: "The issuer invoice has not register " + masterInvoicePK,
          });
          continue;
        } else if (masterInvoicePK == 0) {
          rtnValue.push({
            tei_einvoice_m_pk: para[i].tei_einvoice_m_pk,
            tradecode: "",
            errmsg: "Duplicated data. This invoice already sent",
          });
          continue;
        } else if (masterInvoicePK < -1) {
          console.log(
            `invalid xml format [${para[i].tei_einvoice_m_pk}]`,
            para[i].xml_signed
          );
          rtnValue.push({
            tei_einvoice_m_pk: para[i].tei_einvoice_m_pk,
            tradecode: "",
            errmsg: "Invalid xml format",
          });
          continue;
        }
        const tradeCode = await Request.post(
          url,
          { base64XML: Buffer.from(para[i].xml_signed).toString("base64") },
          {
            agent,
            headers: {
              Authorization:
                "Basic " +
                Buffer.from(`${authUserName}:${authPassword}`).toString(
                  "base64"
                ),
            },
          }
        );
        if (tradeCode && tradeCode.data) {
          const para_value = {
            tei_einvoice_ar_pk: masterInvoicePK,
            xml_sign: para[i].xml_signed,
            issuer: para[i].issuer,
            issueby: para[i].issue_by,
            issueto: para[i].issue_to,
            dn_name: para[i].dn_name,
            dn_mst: para[i].dn_mst,
            notafter: para[i].notafter,
            notbefore: para[i].notbefore,
            serialnumber: para[i].tax_serial_number,
            tradecode: tradeCode.data.maGDich,
            cqt_code: "", //cqt_code
          };
          await DBService.ExecuteSQLBlob(
            `BEGIN ei_upd_file_xml_ar(:tei_einvoice_ar_pk,:xml_sign,:issuer,:issueby,:issueto,:dn_name,:dn_mst,
                     :notafter,:notbefore,:serialnumber,:tradecode,:cqt_code,:p_language, :p_crt_by, :p_rtn_cur); END;`,
            para_value,
            p_language,
            p_crt_by
          );
          console.log("rtnValue ", rtnValue);
          rtnValue.push({
            tei_einvoice_m_pk: para[i].tei_einvoice_m_pk,
            tradecode: tradeCode.data.maGDich,
          });
        } else {
          return response.send(
            Utils.response(false, `Failed to call taxoffice api.`, null)
          );
        }
      }
      return response.send(
        Utils.response(
          true,
          `${para.length} invoices were sent successful.`,
          rtnValue
        )
      );
    } catch (e) {
      Utils.ConsoleLogError(e.message);
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "sendInvoiceToTaxOffice",
        CONTENT: e.message,
      });
      return response.send(Utils.response(false, "error", e.message));
    }
  }

  async extractXMLContent(
    p_xml_content,
    p_mail_to,
    p_mail_cc,
    p_language,
    p_crt_by
  ) {
    try {
      const templateTTChung = [
        "HDon/DLHDon/TTChung",
        {
          PBan: "PBan",
          THDon: "THDon",
          KHMSHDon: "KHMSHDon",
          KHHDon: "KHHDon",
          SHDon: "SHDon",
          MHSo: "MHSo",
          NLap: "NLap",
          SBKe: "SBKe",
          NBKe: "NBKe",
          DVTTe: "DVTTe",
          TGia: "TGia",
          HTTToan: "HTTToan",
          MSTTCGP: "MSTTCGP",
          MSTDVNUNLHDon: "MSTDVNUNLHDon",
          TDVNUNLHDon: "TDVNUNLHDon",
          DCDVNUNLHDon: "DCDVNUNLHDon",
        },
      ];
      const jsonTTChung = await transform(p_xml_content, templateTTChung);
      //console.log("jsonTTChung",jsonTTChung)
      const templateTTKhac = [
        "HDon/DLHDon/TTChung/TTKhac/TTin",
        {
          TTruong: "TTruong",
          DLieu: "DLieu",
        },
      ];
      let jsonTTKhac = null;
      try {
        jsonTTKhac = await transform(p_xml_content, templateTTKhac);
      } catch (e) {}
      //console.log("jsonTTKhac", jsonTTKhac)
      let customField1 = "",
        customField2 = "",
        customField3 = "",
        customField4 = "",
        customField5 = "",
        customField6 = "",
        customField7 = "",
        customField8 = "",
        customField9 = "",
        customField10 = "";
      if (jsonTTKhac && jsonTTKhac.length > 0) {
        customField1 = jsonTTKhac[0].TTruong + ": " + jsonTTKhac[0].DLieu;
        if (jsonTTKhac.length > 1) {
          customField2 = jsonTTKhac[1].TTruong + ": " + jsonTTKhac[1].DLieu;
        }
        if (jsonTTKhac.length > 2) {
          customField2 = jsonTTKhac[1].TTruong + ": " + jsonTTKhac[1].DLieu;
          customField3 = jsonTTKhac[2].TTruong + ": " + jsonTTKhac[2].DLieu;
        }
        if (jsonTTKhac.length > 3) {
          customField2 = jsonTTKhac[1].TTruong + ": " + jsonTTKhac[1].DLieu;
          customField3 = jsonTTKhac[2].TTruong + ": " + jsonTTKhac[2].DLieu;
          customField4 = jsonTTKhac[3].TTruong + ": " + jsonTTKhac[3].DLieu;
        }
        if (jsonTTKhac.length > 4) {
          customField2 = jsonTTKhac[1].TTruong + ": " + jsonTTKhac[1].DLieu;
          customField3 = jsonTTKhac[2].TTruong + ": " + jsonTTKhac[2].DLieu;
          customField4 = jsonTTKhac[3].TTruong + ": " + jsonTTKhac[3].DLieu;
          customField5 = jsonTTKhac[4].TTruong + ": " + jsonTTKhac[4].DLieu;
        }
        if (jsonTTKhac.length > 5) {
          customField2 = jsonTTKhac[1].TTruong + ": " + jsonTTKhac[1].DLieu;
          customField3 = jsonTTKhac[2].TTruong + ": " + jsonTTKhac[2].DLieu;
          customField4 = jsonTTKhac[3].TTruong + ": " + jsonTTKhac[3].DLieu;
          customField5 = jsonTTKhac[4].TTruong + ": " + jsonTTKhac[4].DLieu;
          customField6 = jsonTTKhac[5].TTruong + ": " + jsonTTKhac[5].DLieu;
        }
        if (jsonTTKhac.length > 6) {
          customField2 = jsonTTKhac[1].TTruong + ": " + jsonTTKhac[1].DLieu;
          customField3 = jsonTTKhac[2].TTruong + ": " + jsonTTKhac[2].DLieu;
          customField4 = jsonTTKhac[3].TTruong + ": " + jsonTTKhac[3].DLieu;
          customField5 = jsonTTKhac[4].TTruong + ": " + jsonTTKhac[4].DLieu;
          customField6 = jsonTTKhac[5].TTruong + ": " + jsonTTKhac[5].DLieu;
          customField7 = jsonTTKhac[6].TTruong + ": " + jsonTTKhac[6].DLieu;
        }
        if (jsonTTKhac.length > 7) {
          customField2 = jsonTTKhac[1].TTruong + ": " + jsonTTKhac[1].DLieu;
          customField3 = jsonTTKhac[2].TTruong + ": " + jsonTTKhac[2].DLieu;
          customField4 = jsonTTKhac[3].TTruong + ": " + jsonTTKhac[3].DLieu;
          customField5 = jsonTTKhac[4].TTruong + ": " + jsonTTKhac[4].DLieu;
          customField6 = jsonTTKhac[5].TTruong + ": " + jsonTTKhac[5].DLieu;
          customField7 = jsonTTKhac[6].TTruong + ": " + jsonTTKhac[6].DLieu;
          customField8 = jsonTTKhac[7].TTruong + ": " + jsonTTKhac[7].DLieu;
        }
        if (jsonTTKhac.length > 8) {
          customField2 = jsonTTKhac[1].TTruong + ": " + jsonTTKhac[1].DLieu;
          customField3 = jsonTTKhac[2].TTruong + ": " + jsonTTKhac[2].DLieu;
          customField4 = jsonTTKhac[3].TTruong + ": " + jsonTTKhac[3].DLieu;
          customField5 = jsonTTKhac[4].TTruong + ": " + jsonTTKhac[4].DLieu;
          customField6 = jsonTTKhac[5].TTruong + ": " + jsonTTKhac[5].DLieu;
          customField7 = jsonTTKhac[6].TTruong + ": " + jsonTTKhac[6].DLieu;
          customField8 = jsonTTKhac[7].TTruong + ": " + jsonTTKhac[7].DLieu;
          customField9 = jsonTTKhac[8].TTruong + ": " + jsonTTKhac[8].DLieu;
        }
        if (jsonTTKhac.length > 9) {
          customField2 = jsonTTKhac[1].TTruong + ": " + jsonTTKhac[1].DLieu;
          customField3 = jsonTTKhac[2].TTruong + ": " + jsonTTKhac[2].DLieu;
          customField4 = jsonTTKhac[3].TTruong + ": " + jsonTTKhac[3].DLieu;
          customField5 = jsonTTKhac[4].TTruong + ": " + jsonTTKhac[4].DLieu;
          customField6 = jsonTTKhac[5].TTruong + ": " + jsonTTKhac[5].DLieu;
          customField7 = jsonTTKhac[6].TTruong + ": " + jsonTTKhac[6].DLieu;
          customField8 = jsonTTKhac[7].TTruong + ": " + jsonTTKhac[7].DLieu;
          customField9 = jsonTTKhac[8].TTruong + ": " + jsonTTKhac[8].DLieu;
          customField10 = jsonTTKhac[9].TTruong + ": " + jsonTTKhac[9].DLieu;
        }
      }

      const templateTTHDLQuan = [
        "HDon/DLHDon/TTChung/TTHDLQuan",
        {
          TCHDon: "TCHDon",
          LHDCLQuan: "LHDCLQuan",
          KHMSHDCLQuan: "KHMSHDCLQuan",
          KHHDCLQuan: "KHHDCLQuan",
          SHDCLQuan: "SHDCLQuan",
          NLHDCLQuan: "NLHDCLQuan",
          GChu: "GChu",
        },
      ];
      const jsonTTHDLQuan = await transform(p_xml_content, templateTTHDLQuan);
      //console.log("templateTTHDLQuan",jsonTTHDLQuan)

      const arrTTChung = [
        jsonTTChung[0].PBan,
        jsonTTChung[0].THDon,
        jsonTTChung[0].KHMSHDon,
        jsonTTChung[0].KHHDon,
        jsonTTChung[0].SHDon,
        jsonTTChung[0].MHSo,
        jsonTTChung[0].NLap,
        jsonTTChung[0].SBKe,
        jsonTTChung[0].NBKe,
        jsonTTChung[0].DVTTe,
        jsonTTChung[0].TGia,
        jsonTTChung[0].HTTToan,
        jsonTTChung[0].MSTTCGP,
        jsonTTChung[0].MSTDVNUNLHDon,
        jsonTTChung[0].TDVNUNLHDon,
        jsonTTChung[0].DCDVNUNLHDon,
      ];
      const templateNBan = [
        "HDon/DLHDon/NDHDon/NBan",
        {
          Ten: "Ten",
          MST: "MST",
          DChi: "DChi",
          SDThoai: "SDThoai",
          DCTDTu: "DCTDTu",
          STKNHang: "STKNHang",
          NNBSTKNHang: "NNBSTKNHang",
          TNHang: "TNHang",
          Fax: "Fax",
          Website: "Website",
          TTKhac: "TTKhac",
        },
      ];
      const jsonNBan = await transform(p_xml_content, templateNBan);
      const arrNBan = [
        jsonNBan[0].Ten,
        jsonNBan[0].MST,
        jsonNBan[0].DChi,
        jsonNBan[0].SDThoai,
        jsonNBan[0].DCTDTu,
        jsonNBan[0].STKNHang,
        jsonNBan[0].NNBSTKNHang,
        jsonNBan[0].TNHang,
        jsonNBan[0].Fax,
        jsonNBan[0].Website,
        jsonNBan[0].TTKhac,
      ];
      //console.log("jsonNBan",jsonNBan)
      const templateNMua = [
        "HDon/DLHDon/NDHDon/NMua",
        {
          Ten: "Ten",
          MST: "MST",
          DChi: "DChi",
          SDThoai: "SDThoai",
          DCTDTu: "DCTDTu",
          HVTNMHang: "HVTNMHang",
          STKNHang: "STKNHang",
          TNHang: "TNHang",
          TTKhac: "TTKhac",
        },
      ];
      const jsonNMua = await transform(p_xml_content, templateNMua);
      //console.log("jsonNMua",jsonNMua)
      const arrNMua = [
        jsonNMua[0].Ten,
        jsonNMua[0].MST,
        jsonNMua[0].DChi,
        jsonNMua[0].SDThoai,
        jsonNMua[0].DCTDTu,
        jsonNMua[0].HVTNMHang,
        jsonNMua[0].STKNHang,
        jsonNMua[0].TNHang,
        jsonNMua[0].TTKhac,
      ];
      const templateLTSuat = [
        "HDon/DLHDon/NDHDon/TToan/THTTLTSuat/LTSuat",
        {
          TSuat: "TSuat",
          ThTien: "ThTien",
          TThue: "TThue",
        },
      ];
      const jsonLTSuat = await transform(p_xml_content, templateLTSuat);
      //console.log("jsonLTSuat",jsonLTSuat)
      const arrLTSuat = [
        jsonLTSuat[0].TSuat,
        jsonLTSuat[0].ThTien,
        jsonLTSuat[0].TThue,
      ];
      const templateTToan = [
        "HDon/DLHDon/NDHDon/TToan",
        {
          TgTCThue: "TgTCThue",
          TgTThue: "TgTThue",
          TTCKTMai: "TTCKTMai",
          TgTTTBSo: "TgTTTBSo",
          TgTTTBChu: "TgTTTBChu",
        },
      ];
      const jsonTToan = await transform(p_xml_content, templateTToan);
      //console.log("jsonTToan",jsonTToan)
      const arrTToan = [
        jsonTToan[0].TgTCThue,
        jsonTToan[0].TgTThue,
        jsonTToan[0].TTCKTMai,
        jsonTToan[0].TgTTTBSo,
        jsonTToan[0].TgTTTBChu,
      ];

      /*const templateMCCQT = ['HDon', {
                            MCCQT: 'MCCQT'
                        }]
                        const jsonMCCQT = await transform(p_xml_content, templateMCCQT);
                        //console.log(jsonMCCQT)
                        */
      const arrMCCQT = ""; //[jsonMCCQT[0].MCCQT];

      const templateDSHHDVu = [
        "HDon/DLHDon/NDHDon/DSHHDVu/HHDVu",
        {
          TChat: "TChat",
          STT: "STT",
          MHHDVu: "MHHDVu",
          THHDVu: "THHDVu",
          DVTinh: "DVTinh",
          SLuong: "SLuong",
          DGia: "DGia",
          TLCKhau: "TLCKhau",
          STCKhau: "STCKhau",
          ThTien: "ThTien",
          TSuat: "TSuat",
        },
      ];
      let masterPara = arrTTChung
        .concat(arrNBan)
        .concat(arrNMua)
        .concat(arrLTSuat)
        .concat(arrTToan)
        .concat(arrMCCQT);
      //const xmlRelativePath = p_xml_path.replace(ROOT_DIR_FILES, "");
      masterPara = masterPara.concat(["", "", "", ""]);
      if (jsonTTHDLQuan && jsonTTHDLQuan.length > 0) {
        masterPara = masterPara.concat([
          jsonTTHDLQuan[0].TCHDon,
          jsonTTHDLQuan[0].LHDCLQuan,
          jsonTTHDLQuan[0].KHMSHDCLQuan,
          jsonTTHDLQuan[0].KHHDCLQuan,
          jsonTTHDLQuan[0].SHDCLQuan,
          jsonTTHDLQuan[0].NLHDCLQuan,
          jsonTTHDLQuan[0].GChu,
        ]);
      } else {
        masterPara = masterPara.concat(["", "", "", "", "", "", ""]);
      }
      masterPara = masterPara.concat([
        customField1,
        customField2,
        customField3,
        customField4,
        customField5,
        customField6,
        customField7,
        customField8,
        customField9,
        customField10,
        p_mail_to,
        p_mail_cc,
      ]);
      //console.log("masterPara",masterPara)
      //const master = await callAPI(_jwtToken, { proc: 'ei_upd_tei_einvoice_cloud', para: masterPara });
      const master = await DBService.callProcCursor(
        "ei_upd_tei_einvoice_ar",
        masterPara,
        p_language,
        p_crt_by
      );
      // console.log("master", master);
      if (master && master[0].PK > 0) {
        const jsonDSHHDVu = await transform(p_xml_content, templateDSHHDVu);
        //console.log(jsonDSHHDVu)
        for (let i = 0; i < jsonDSHHDVu.length; i++) {
          const detailPara = [
            master[0].PK,
            jsonDSHHDVu[i].TChat,
            jsonDSHHDVu[i].STT,
            jsonDSHHDVu[i].MHHDVu,
            jsonDSHHDVu[i].THHDVu,
            jsonDSHHDVu[i].DVTinh,
            jsonDSHHDVu[i].SLuong,
            jsonDSHHDVu[i].DGia,
            jsonDSHHDVu[i].ThTien,
            jsonDSHHDVu[i].TLCKhau,
            jsonDSHHDVu[i].STCKhau,
            jsonDSHHDVu[i].TSuat,
          ];
          const detail = await DBService.callProcCursor(
            "ei_upd_tei_einvoiced_ar",
            detailPara,
            p_language,
            p_crt_by
          );
          // console.log("detail", detail);
        }
        return master[0].PK;
      } else {
        return master[0].PK;
      }
    } catch (e) {
      Utils.ConsoleLogError(e.message);
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "extractXMLContent",
        CONTENT: e.message,
      });
      return -2;
    }
  }

  async extractJSONContent(p_json_master, p_language, p_crt_by) {
    try {
      let masterPara = [
        p_json_master.PK,
        p_json_master.TEI_COMPANY_PK,
        p_json_master.SERIAL_NO,
        p_json_master.INVOICE_NO,
        p_json_master.INVOICE_DATE,
        p_json_master.SO_NUMBER,
        p_json_master.CUSTOMER_CODE,
        p_json_master.USER_CODE,
        p_json_master.SELLER_COMPANY_NAME,
        p_json_master.SELLER_TAXCODE,
        p_json_master.SELLER_ADDRESS,
        p_json_master.SELLER_PHONE,
        p_json_master.TAX_AGENCY_CODE,
        p_json_master.BUYER_NAME,
        p_json_master.DELIVERY_ADDRESS,
        p_json_master.BUYER_COMPANY_NAME,
        p_json_master.BUYER_ADDRESS,
        p_json_master.BUYER_TAXCODE,
        p_json_master.PAYMENT_METHOD,
        p_json_master.PO_NUMBER,
        p_json_master.CATEGORY_TYPE,
        p_json_master.WAREHOUSE_ID,
        p_json_master.VAT_RATE,
        p_json_master.AMT_EXCLUDE_VAT,
        p_json_master.AMT_VAT,
        p_json_master.AMT_INCLUDE_VAT,
        p_json_master.AMT_IN_WORD,
        p_json_master.CURRENCY,
        p_json_master.PDF_URL,
        p_json_master.XML_URL,
        p_json_master.PDF_CLOUD_URL,
        p_json_master.XML_CLOUD_URL,
        p_json_master.LOOKUP_CODE,
        p_json_master.LOOKUP_ADDRESS,
        p_json_master.DEL_IF,
        p_json_master.FORWARD_EMAIL,
        p_json_master.YYYYMMDD,
        p_json_master.TCHDON,
        p_json_master.LHDCLQUAN,
        p_json_master.KHMSHDCLQUAN,
        p_json_master.SHDCLQUAN,
        p_json_master.NLHDCLQUAN,
        p_json_master.GCHU,
        p_json_master.MCCQT,
        p_json_master.EX_RATE,
        p_json_master.CUSTOMFIELD1,
        p_json_master.CUSTOMFIELD2,
        p_json_master.CUSTOMFIELD3,
        p_json_master.CUSTOMFIELD4,
        p_json_master.CUSTOMFIELD5,
        p_json_master.CUSTOMFIELD6,
        p_json_master.CUSTOMFIELD7,
        p_json_master.CUSTOMFIELD8,
        p_json_master.CUSTOMFIELD9,
        p_json_master.CUSTOMFIELD10,
        p_json_master.SIGNINGTIME_NBAN,
        p_json_master.SIGNINGTIME_CQT,
        p_json_master.FILE_INTEGRITY,
        p_json_master.FILE_NAME,
      ];

      const master = await DBService.callProcCursor(
        "EI_UPD_TEI_EINVOICE_AP",
        masterPara,
        p_language,
        p_crt_by
      );
      //console.log("master ", master);
      for (let j = 0; j < p_json_master.DATA_DETAILS.length; j++) {
        //console.log(" p_json_master.DATA_DETAILS ",  p_json_master.DATA_DETAILS[j]);
        let detailsPara = [
          p_json_master.DATA_DETAILS[j].PK,
          p_json_master.DATA_DETAILS[j].TEI_EINVOICE_CLOUD_PK,
          p_json_master.DATA_DETAILS[j].TCHAT,
          p_json_master.DATA_DETAILS[j].STT,
          p_json_master.DATA_DETAILS[j].MHHDVU,
          p_json_master.DATA_DETAILS[j].THHDVU,
          p_json_master.DATA_DETAILS[j].DVTINH,
          p_json_master.DATA_DETAILS[j].SLUONG,
          p_json_master.DATA_DETAILS[j].DGIA,
          p_json_master.DATA_DETAILS[j].TLCKHAU,
          p_json_master.DATA_DETAILS[j].TSUAT,
          p_json_master.DATA_DETAILS[j].THTIEN,
          p_json_master.DATA_DETAILS[j].STCKHAU,
        ];
        let detail = await DBService.callProcCursor(
          "EI_UPD_TEI_EINVOICE_AP_D",
          detailsPara,
          p_language,
          p_crt_by
        );
      }
    } catch (e) {
      Utils.ConsoleLogError(e.message);
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "extractXMLContent",
        CONTENT: e.message,
      });
      return -2;
    }
  }

  async checkInvoiceStatusFromTaxOffice({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }
      const authUserName = "GENUWIN"; // "GENUWIN";
      const authPassword = "e_GX4v@"; // "e_GX4v@";// "genuwin123";// "e_GX4v@";
      //const authPassword = "genuwin123"; // "e_GX4v@";
      const url =
        "https://tvan.fpt.com.vn/ftvan-hddt/tbao/tcuu/tcuutbao?maGDichTNDLieu=";
      // let url = "https://tvan.webhoadon.com.vn/ftvan-hddt/tbao/tcuu/tcuutbao?maGDichTNDLieu=";
      const agent = {
        Agent: {
          defaultPort: 443,
          protocol: "https:",
          options: { maxVersion: "TLSv1.2", minVersion: "TLSv1.2", path: null },
        },
      };
      const { proc, para } = request.all();
      let rtnValue = [];
      for (let i = 0; i < para.tei_einvoice_m_pk.length; i++) {
        let maCQT = "",
          maTBao = "",
          tenTBao = "";

        // @TODO: _______________________________________________________
        maTBao = "9999";
        tenTBao = "Invoices are processing.";
        // await DBService.ExecuteSQLBlob(
        //     `BEGIN ei_upd_file_xml_ar(:tei_einvoice_ar_pk,:xml_sign,:issuer,:issueby,:issueto,:dn_name,:dn_mst,
        //              :notafter,:notbefore,:serialnumber,:tradecode,:cqt_code,:p_language, :p_crt_by, :p_rtn_cur); END;`,
        //     para_value,
        //     p_language,
        //     p_crt_by
        //   );
        const result = await DBService.callProcCursor(
          "ei_upd_file_xml_v8",
          [para.tei_einvoice_m_pk[i], maTBao, tenTBao],
          p_language,
          p_crt_by
        );
        if (result[0].STATUS == "OK") {
          rtnValue.push({
            tradecode: para.trade_code[i],
            tax_confirmation_code: para.tei_einvoice_m_pk[i],
            inform_code: maTBao,
            inform_name: tenTBao,
          });
        } else {
          return response.send(
            Utils.response(
              false,
              `Something went wrong, please try again later.
                        ei_upd_file_xml_v8`,
              rtnValue
            )
          );
        }
      }

      return response.send(
        Utils.response(
          true,
          `${para.trade_code.length} invoices was update status from tax office.`,
          rtnValue
        )
      );

      // @TODO: _______________________________________________________

      // const res = await Request.get(url + para[i], {
      //     agent,
      //     headers: {
      //         Authorization: "Basic " +
      //             Buffer.from(`${authUserName}:${authPassword}`).toString("base64"),
      //     },
      // });

      // //@!!!!!!!!!!!!!!!! loi : url + para[i]
      // console.log(
      //     "checkInvoiceStatusFromTaxOffice url + para[i] " + url + para[i]
      // );
      // console.log("checkInvoiceStatusFromTaxOffice res.length " + res.length); //res.length undefined
      // //res = [object Object] => co the res = {}
      // console.log("checkInvoiceStatusFromTaxOffice res " + res);

      // if (!res.length) {
      //     return response.send(Utils.response(false, `no data found.`));
      // }

      // for (let j = 0; j < res.length; j++) {
      //     //res.length undefined !!!!!!!!!!!!!!!!!
      //     const items = res[j];
      //     for (let k = 0; k < items.length; k++) {
      //         console.log("items[k].loaiTBao " + items[k].loaiTBao);
      //         if (items[k].loaiTBao == "10") {
      //             maCQT = items[k].ndungTBao.maCQT;
      //             const base64XML = Buffer.from(
      //                 items[k].ndungTBao.base64XML,
      //                 "base64"
      //             ).toString("utf8");
      //             const para_value = {
      //                 tradecode: para[i],
      //                 macqt: maCQT,
      //                 xml_sign: base64XML,
      //             };
      //             const result = await DBService.ExecuteSQLBlob(
      //                 `BEGIN ei_upd_file_xml_v5(:tradecode,:macqt,:xml_sign,:p_language, :p_crt_by, :p_rtn_cur); END;`,
      //                 para_value,
      //                 p_language,
      //                 p_crt_by
      //             );
      //         } else if (items[k].loaiTBao == "9" || items[k].loaiTBao == "16") {
      //             maTBao = items[k].ndungTBao.dsachLoiKTraDLieu[0].maLoi;
      //             tenTBao = items[k].ndungTBao.dsachLoiKTraDLieu[0].mtaLoi;
      //             const result = await DBService.callProcCursor(
      //                 "ei_upd_file_xml_v8", [para[i], maTBao, tenTBao],
      //                 p_language,
      //                 p_crt_by
      //             );
      //         } else if (items[k].loaiTBao == "15") {
      //             tenTBao = items[k].tenTBao;
      //             const result = await DBService.callProcCursor(
      //                 "ei_upd_file_xml_v9", [para[i], tenTBao],
      //                 p_language,
      //                 p_crt_by
      //             );
      //         }
      //     }
      // }
      // rtnValue.push({
      //     tradecode: para[i],
      //     tax_confirmation_code: maCQT,
      //     inform_code: maTBao,
      //     inform_name: tenTBao,
      // });
      // rtnValue.push({
      //     tradecode: para.trade_code[i],
      //     tax_confirmation_code: para.tei_einvoice_m_pk[i],
      //     inform_code: maTBao,
      //     inform_name: tenTBao,
      // });
      // }
      // return response.send(
      //     Utils.response(
      //         true,
      //         `${para.trade_code.length} invoices was update status from tax office.`,
      //         rtnValue
      //     )
      // );
    } catch (e) {
      Utils.ConsoleLogError(e.message);
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "checkInvoiceStatusFromTaxOffice",
        CONTENT: e.message,
      });
      return response.send(Utils.response(false, "error", e.message));
    }
  }

  async extractXMLContent_Dec(p_xml_content, p_language, p_crt_by) {
    try {
      const templateTTChung = [
        "TKhai/DLTKhai/TTChung",
        {
          PBan: "PBan",
          MSo: "MSo",
          Ten: "Ten",
          HThuc: "HThuc",
          TNNT: "TNNT",
          MST: "MST",
          CQTQLy: "CQTQLy",
          MCQTQLy: "MCQTQLy",
          NLHe: "NLHe",
          DCLHe: "DCLHe",
          DCTDTu: "DCTDTu",
          DTLHe: "DTLHe",
          MSTTCGP: "MSTTCGP",
          DDanh: "DDanh",
          NLap: "NLap",
        },
      ];

      const jsonTTChung = await transform(p_xml_content, templateTTChung);

      const arrTTChung = [
        jsonTTChung[0].PBan,
        jsonTTChung[0].MSo,
        jsonTTChung[0].Ten,
        jsonTTChung[0].HThuc,
        jsonTTChung[0].TNNT,
        jsonTTChung[0].MST,
        jsonTTChung[0].CQTQLy,
        jsonTTChung[0].MCQTQLy,
        jsonTTChung[0].NLHe,
        jsonTTChung[0].DCLHe,
        jsonTTChung[0].DCTDTu,
        jsonTTChung[0].DTLHe,
        jsonTTChung[0].DDanh,
        jsonTTChung[0].NLap,
      ];
      //TKhai.DLTKhai.NDTKhai.HTHDon.CMa
      const templateNDTKhai = [
        "TKhai/DLTKhai/NDTKhai/HTHDon",
        {
          CMa: "CMa",
          KCMa: "KCMa",
        },
      ];
      const jsonNDTKhai = await transform(p_xml_content, templateNDTKhai);
      const arrNDTKhai = [jsonNDTKhai[0].CMa, jsonNDTKhai[0].KCMa];

      //TKhai.DLTKhai.NDTKhai.HTGDLHDDT
      const templateHTGDLHDDT = [
        "TKhai/DLTKhai/NDTKhai/HTGDLHDDT",
        {
          NNTDBKKhan: "NNTDBKKhan",
          NNTKTDNUBND: "NNTKTDNUBND",
          CDLTTDCQT: "CDLTTDCQT",
          CDLQTVAN: "CDLQTVAN",
        },
      ];
      const jsonHTGDLHDDT = await transform(p_xml_content, templateHTGDLHDDT);
      const arrHTGDLHDDT = [
        jsonHTGDLHDDT[0].NNTDBKKhan,
        jsonHTGDLHDDT[0].NNTKTDNUBND,
        jsonHTGDLHDDT[0].CDLTTDCQT,
        jsonHTGDLHDDT[0].CDLQTVAN,
      ];

      //TKhai.DLTKhai.NDTKhai.PThuc
      const templatePThuc = [
        "TKhai/DLTKhai/NDTKhai/PThuc",
        {
          CDDu: "CDDu",
          CBTHop: "CBTHop",
        },
      ];
      const jsonPThuc = await transform(p_xml_content, templatePThuc);
      const arrPThuc = [jsonPThuc[0].CDDu, jsonPThuc[0].CBTHop];

      //TKhai.DLTKhai.NDTKhai.LHDSDung
      const templateLHDSDung = [
        "TKhai/DLTKhai/NDTKhai/LHDSDung",
        {
          HDGTGT: "HDGTGT",
          HDGHDBHangTGT: "HDBHang",
          HDBTSCong: "HDBTSCong",
          HDBHDTQGia: "HDBHDTQGia",
          HDKhac: "HDKhac",
          CTu: "CTu",
        },
      ];
      const jsonLHDSDung = await transform(p_xml_content, templateLHDSDung);
      const arrLHDSDung = [
        jsonLHDSDung[0].HDGTGT,
        jsonLHDSDung[0].HDGHDBHangTGT,
        jsonLHDSDung[0].HDBTSCong,
        jsonLHDSDung[0].HDBHDTQGia,
        jsonLHDSDung[0].HDKhac,
        jsonLHDSDung[0].CTu,
      ];

      //TKhai.DLTKhai.NDTKhai.DSCTSSDung
      const templateCTS = [
        "TKhai/DLTKhai/NDTKhai/DSCTSSDung/CTS",
        {
          STT: "STT",
          TTChuc: "TTChuc",
          Seri: "Seri",
          TNgay: "TNgay",
          DNgay: "DNgay",
          HThuc: "HThuc",
        },
      ];
      const jsonCTS = await transform(p_xml_content, templateCTS);

      let masterPara = arrTTChung
        .concat(arrNDTKhai)
        .concat(arrHTGDLHDDT)
        .concat(arrPThuc)
        .concat(arrLHDSDung);

      //console.log("masterPara  ",masterPara)
      const master = await DBService.callProcCursor(
        "ei_upd_tei_declaration_cloud",
        masterPara,
        p_language,
        p_crt_by
      );
      //console.log("master", master);
      if (master && master[0].PK > 0) {
        //const jsonDSHHDVu = await transform(p_xml_content, templateDSHHDVu);
        //console.log(jsonDSHHDVu)
        for (let i = 0; i < jsonCTS.length; i++) {
          const detailPara = [
            master[0].PK,
            jsonCTS[i].STT,
            jsonCTS[i].TTChuc,
            jsonCTS[i].Seri,
            jsonCTS[i].TNgay,
            jsonCTS[i].DNgay,
            jsonCTS[i].HThuc,
          ];
          const detail = await DBService.callProcCursor(
            "ei_upd_tei_declarationd_cloud",
            detailPara,
            p_language,
            p_crt_by
          );
          //console.log("detail", detail);
        }
        return master[0].PK;
      } else {
        return 0;
      }
    } catch (e) {
      Utils.ConsoleLogError(e.message);
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "extractXMLContent",
        CONTENT: e.message,
      });
      return -1;
    }
  }

  async sendDeclarationToTaxOffice({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }
      let dataJson = [];
      const authUserName = "GENUWIN"; // "GENUWIN";
      const authPassword = "e_GX4v@"; //"genuwin123"; //
      const url = "https://tvan.fpt.com.vn/ftvan-hddt/dkyhddt/dkysdung";
      // const url = "https://tvan.webhoadon.com.vn/ftvan-hddt/dkyhddt/dkysdung";
      const { proc, para } = request.all();

      const agent = {
        Agent: {
          defaultPort: 443,
          protocol: "https:",
          options: { maxVersion: "TLSv1.2", minVersion: "TLSv1.2", path: null },
        },
      };
      const tradeCode = await Request.post(
        url,
        { base64XML: Buffer.from(para.xml_signed).toString("base64") },
        {
          agent,
          headers: {
            Authorization:
              "Basic " +
              Buffer.from(`${authUserName}:${authPassword}`).toString("base64"),
          },
        }
      );

      if (tradeCode && tradeCode.data) {
        const para_value = {
          tei_declaration_m_pk: para.erp_declaration_m_pk,
          xml_sign: para.xml_signed,
          trade_code: tradeCode.data.maGDich,
          cqt_code: "", //cqt_code
        };
        const res = await DBService.ExecuteSQLBlob(
          `BEGIN ei_upd_einvoice_ss_xml_ar(:tei_declaration_m_pk, :xml_sign, :trade_code, :cqt_code,
                                :p_language, :p_crt_by, :p_rtn_cur); END;`,
          para_value,
          p_language,
          p_crt_by
        );
      } else {
        return response.send(
          Utils.response(false, `Failed to call taxoffice api.`, null)
        );
      }
      dataJson.push({
        erp_declaration_m_pk: para.erp_declaration_m_pk,
        xml_sign: para.xml_signed,
        trade_code: tradeCode.data.maGDich,
      });
      return response.send(
        Utils.response(true, `Declaration was sent successfull.`, dataJson)
      );
    } catch (e) {
      Utils.ConsoleLogError(e.message);
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "sendInvoiceToTaxOffice",
        CONTENT: e.message,
      });
      return response.send(Utils.response(false, "error", e.message));
    }
  }

  async sendDeclarationToTaxOfficeFromClient({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }

      const { proc, para } = request.all();

      const token = await this.callLogin(
        EINVOICE_URL_LOGIN,
        EINVOICE_USER,
        EINVOICE_PW
      );

      if (token) {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        console.log(
          "EINVOICE_URL_API_DECLARATION_SEND" +
            EINVOICE_URL_API_DECLARATION_SEND
        );
        const res = await Request.post(
          EINVOICE_URL_API_DECLARATION_SEND,
          { para: para },
          config
        );
        console.log("sendDeclarationToTaxOfficeFromClient res.data" + res.data);
        return response.send(res.data);
      } else {
        console.error("Failed to get api token");
      }
      return response.send(
        Utils.response(false, `Failed to send declaration.`, null)
      );
    } catch (e) {
      Utils.ConsoleLogError(e.message);
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "checkingdeclarationfromclient",
        CONTENT: e.message,
      });
      return response.send(Utils.response(false, "error", e.message));
    }
  }

  async checkingDeclarations({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }

      const authUserName = "GENUWIN"; // "GENUWIN";
      const authPassword = "e_GX4v@"; // "e_GX4v@";// "genuwin123";// "e_GX4v@";
      // const authPassword = "genuwin123"; // "e_GX4v@";

      let url =
        "https://tvan.fpt.com.vn/ftvan-hddt/tbao/tcuu/tcuutbao?maGDichTNDLieu=";
      // let url =
      //     "https://tvan.webhoadon.com.vn/ftvan-hddt/tbao/tcuu/tcuutbao?maGDichTNDLieu=";

      const { proc, para } = request.all();

      // @TODO: _______________________________________________________

      const para_value = {
        p_tei_einvoice_issuse_cqt_pk: para.p_tei_einvoice_issuse_cqt_pk,
        xml_sign: "xml_sign test.",
        p_messCQT: "mess cqt test.",
        p_status: "2",
      };
      const res = await DBService.ExecuteSQLBlob(
        `BEGIN ei_upd_file_xml_v6(
                          :p_tei_einvoice_issuse_cqt_pk, :xml_sign, :p_messCQT, :p_status,
                          :p_language, :p_crt_by, :p_rtn_cur
                      ); END;`,
        para_value,
        p_language,
        p_crt_by
      );
      // console.log("checkingdeclaration res " + JSON.stringify(res));
      if (res.p_rtn_cur[0].STATUS == "OK") {
        return response.send(
          Utils.response(
            true,
            `Get declaration status from tax office successful.`,
            para_value
          )
        );
      } else {
        return response.send(
          Utils.response(
            false,
            `Something went wrong, please try again later.
            ei_upd_file_xml_v6`,
            para_value
          )
        );
      }

      // @TODO: _______________________________________________________

      const agent = {
        Agent: {
          defaultPort: 443,
          protocol: "https:",
          options: { maxVersion: "TLSv1.2", minVersion: "TLSv1.2", path: null },
        },
      };
      for (let parent of para.tradecode) {
        console.log("checkingDeclarations parent " + JSON.stringify(parent));
        // den day
        const res = await Request.get(url + parent, {
          agent,
          headers: {
            Authorization:
              "Basic " +
              Buffer.from(`${authUserName}:${authPassword}`).toString("base64"),
          },
        });
        // dung o day: "Request failed with status code 401"

        let tenTBao = "",
          status = "",
          base64XML = "";

        console.log(`checkingDeclarations url + parent `, url + parent);
        console.log(`checkingDeclarations res `, res);
        console.log(`checkingDeclarations res.data `, res.data);

        if (!res.data) {
          return response.send(Utils.response(false, `no data found.`));
        }
        for (let item of res.data) {
          for (let child of item) {
            if (child.loaiTBao == "1") {
              base64XML = Buffer.from(
                child.ndungTBao.base64XML,
                "base64"
              ).toString("utf8");
            } else if (child.loaiTBao == "3") {
              status = "0";
            } else {
              status = "1";
            }
            tenTBao = child.tenTBao;

            const para_value = {
              p_tei_einvoice_issuse_cqt_pk: para.p_tei_einvoice_issuse_cqt_pk,
              xml_sign: base64XML,
              p_messCQT: tenTBao,
              p_status: status,
            };
            await DBService.ExecuteSQLBlob(
              `BEGIN ei_upd_file_xml_v6(
                                :p_tei_einvoice_issuse_cqt_pk, :xml_sign, :p_messCQT, :p_status,
                                :p_language, :p_crt_by, :p_rtn_cur
                            ); END;`,
              para_value,
              p_language,
              p_crt_by
            );
          }
        }
      }
      return response.send(Utils.response(true, `checking_declare_success`));
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "checkInvoiceStatusFromTaxOffice",
        CONTENT: e.message,
      });
      return response.send(Utils.response(false, "error", e.message));
    }
  }

  async checkingDeclarationsFromClient({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }

      const { proc, para } = request.all();

      const token = await this.callLogin(
        EINVOICE_URL_LOGIN,
        EINVOICE_USER,
        EINVOICE_PW
      );

      if (token) {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const res = await Request.post(
          EINVOICE_URL_API_DECLARATION_CHECK,
          { para: para },
          config
        );
        console.log("checkingDeclarationsFromClient", res.data);
        return response.send(res.data);
      } else {
        console.error("Failed to get api token");
      }
      return response.send(
        Utils.response(false, `Failed to send invoices.`, null)
      );
    } catch (e) {
      Utils.ConsoleLogError(e.message);
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "checkingDeclarationsFromClient",
        CONTENT: e.message,
      });
      return response.send(Utils.response(false, "error", e.message));
    }
  }

  async sendInformAdjustToTaxOffice({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }
      const authUserName = "GENUWIN"; // "GENUWIN";
      const authPassword = "e_GX4v@"; //"genuwin123"; // "e_GX4v@";
      const url = "https://tvan.fpt.com.vn/ftvan-hddt/tbao/tbaonnt/tbaossot";
      // const url =
      //     "https://tvan.webhoadon.com.vn/ftvan-hddt/tbao/tbaonnt/tbaossot";
      const { proc, para } = request.all();
      const agent = {
        Agent: {
          defaultPort: 443,
          protocol: "https:",
          options: { maxVersion: "TLSv1.2", minVersion: "TLSv1.2", path: null },
        },
      };

      const tradeCode = await Request.post(
        url,
        { base64XML: Buffer.from(para.xml_signed).toString("base64") },
        {
          agent,
          headers: {
            Authorization:
              "Basic " +
              Buffer.from(`${authUserName}:${authPassword}`).toString("base64"),
          },
        }
      );

      if (tradeCode && tradeCode.data) {
        const para_value = {
          tei_einvoice_ss_m_pk: para.tei_einvoice_ss_m_pk,
          tradecode: tradeCode.data.maGDich,
          xml_sign: para.xml_signed,
        };
        const res = await DBService.ExecuteSQLBlob(
          `BEGIN EI_UP_6095280_DATA_TRADE_CODE(:tei_einvoice_ss_m_pk,:tradecode, :xml_sign,
                            :p_language, :p_crt_by, :p_rtn_cur); END;`,
          para_value,
          p_language,
          p_crt_by
        );

        if (res.p_rtn_cur[0].STATUS == "OK") {
          return Utils.response(true, `Call tax office api success.`, {
            tei_einvoice_ss_m_pk: para.tei_einvoice_ss_m_pk,
            tradecode: tradeCode.data.maGDich,
          });
        } else {
          return response.send(
            Utils.response(
              false,
              `Something went wrong, please try again later.
                  EI_UP_6095280_DATA_TRADE_CODE`,
              para_value
            )
          );
        }
      } else {
        return response.send(
          Utils.response(false, `Failed to call taxoffice api.`, null)
        );
      }
    } catch (e) {
      Utils.ConsoleLogError(e.message);
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "sendInvoiceToTaxOffice",
        CONTENT: e.message,
      });
      return response.send(Utils.response(false, "error", e.message));
    }
  }

  async sendInformAdjustToTaxOfficeFromClient({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }

      const { proc, para } = request.all();

      const token = await this.callLogin(
        EINVOICE_URL_LOGIN,
        EINVOICE_USER,
        EINVOICE_PW
      );

      if (token) {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const res = await Request.post(
          EINVOICE_URL_API_INFORMADJUST_SEND,
          { para: para },
          config
        );
        console.log("sendInformAdjustToTaxOfficeFromClient " + res.data);
        return response.send(res.data);
      } else {
        console.error("Failed to get api token");
      }
      return response.send(
        Utils.response(false, `Failed to send invoices.`, null)
      );
    } catch (e) {
      Utils.ConsoleLogError(e.message);
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "sendInformAdjustToTaxOfficeFromClient",
        CONTENT: e.message,
      });
      return response.send(Utils.response(false, "error", e.message));
    }
  }

  async checkInformAdjustToTaxOffice({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }
      //console.log("ss",EINVOICE_URL_API)
      const agent = {
        Agent: {
          defaultPort: 443,
          protocol: "https:",
          options: { maxVersion: "TLSv1.2", minVersion: "TLSv1.2", path: null },
        },
      };

      const authUserName = "GENUWIN"; // "GENUWIN";
      const authPassword = "e_GX4v@"; // "e_GX4v@";// "genuwin123";// "e_GX4v@";

      const url =
        "https://tvan.fpt.com.vn/ftvan-hddt/tbao/tcuu/tcuutbao?maGDichTNDLieu=";
      // let url =
      //     "https://tvan.webhoadon.com.vn/ftvan-hddt/tbao/tcuu/tcuutbao?maGDichTNDLieu=";

      const { proc, para } = request.all();

      console.log("para", para);
      //   @TODO: remove return
      return response.send(
        Utils.response(true, `checking_declare_success`, para)
      );

      //console.log(para.tradecode.length)
      let rtnValue = [];
      //for (let i = 0; i < para.length; i++) {
      for (let i = 0; i < para.tradecode.length; i++) {
        //console.log("para_value[i].tradeCode ", para.tradecode[i]);
        const result = await Request.get(url + para.tradecode[i], {
          agent,
          headers: {
            Authorization:
              "Basic " +
              Buffer.from(`${authUserName}:${authPassword}`).toString("base64"),
          },
        });
        //console.log("result", JSON.stringify(result.data));

        if (!result.data.length) {
          return response.send(Utils.response(false, `no data found.`));
        }
        let tenTBao = "",
          maTBao = "";
        for (let j = 0; j < result.data.length; j++) {
          //res.length undefined !!!!!!!!!!!!!!!!!
          const items = result.data[j];
          //console.log("items", items);
          for (let k = 0; k < items.length; k++) {
            console.log("items[k].loaiTBao " + items[k].loaiTBao);
            if (items[k].loaiTBao == "0") {
              tenTBao = items[k].tenTBao;
              maTBao = items[k].loaiTBao;
            } else if (items[k].loaiTBao == "17") {
              tenTBao = items[k].tenTBao;
              maTBao = items[k].loaiTBao;
            } else if (items[k].loaiTBao == "15") {
              tenTBao = items[k].tenTBao;
              maTBao = items[k].loaiTBao;
            }
          }
        }
        rtnValue.push({
          tradecode: para.tradecode[i],
          inform_code: maTBao,
          inform_desc: tenTBao,
        });
      }

      return response.send(
        Utils.response(true, `checking_declare_success`, rtnValue)
      );
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "checkInformAdjustToTaxOffice",
        CONTENT: e.message,
      });
      return response.send(Utils.response(false, "error", e.message));
    }
  }

  async checkInformAdjustToTaxOfficeFromClient({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }

      const { proc, para } = request.all();

      const token = await this.callLogin(
        EINVOICE_URL_LOGIN,
        EINVOICE_USER,
        EINVOICE_PW
      );

      if (token) {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const res = await Request.post(
          EINVOICE_URL_API_INFORMADJUST_CHECK,
          { para: para },
          config
        );
        console.log("checkInformAdjustToTaxOfficeFromClient", res.data);
        return response.send(res.data);
      } else {
        console.error("Failed to get api token");
      }
      return response.send(
        Utils.response(false, `Failed to send invoices.`, null)
      );
    } catch (e) {
      Utils.ConsoleLogError(e.message);
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "checkInformAdjustToTaxOfficeFromClient",
        CONTENT: e.message,
      });
      return response.send(Utils.response(false, "error", e.message));
    }
  }

  async getDataFormEinvoice({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }

      const { proc, para } = request.all();

      //console.log("para",  para);

      for (let i = 0; i < para.length; i++) {
        //console.log("---------- JSON ----------");
        //console.log(para[i]);
        const masterInvoicePK = await this.extractJSONContent(
          para[i],
          p_language,
          p_crt_by
        );
      }
      return response.send(Utils.response(true, `get_data_success`));
    } catch (e) {
      Utils.ConsoleLogError(e.message);
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "sendInvoiceToTaxOfficeFromClient",
        CONTENT: e.message,
      });
      return response.send(Utils.response(false, "error", e.message));
    }
  }

  async checkTaxCode({ request, response, auth }) {
    var p_language = request.header("accept-language", "ENG");
    var p_crt_by = "";
    const user = await auth.getUser();
    if (user) {
      p_crt_by = user.USER_ID;
    }
    let formData = new FormData();

    const { proc, para } = request.all();

    //exec AC_SEL_6097030_1_NOCACHE('22175','277','20230301','20230331','','','','','','N','I','A','ENG','vng-199',:p_rtn_cur)

    const para_value = {
      p_tco_company_pk: "22175",
      p_tco_busplace_pk: "277",
      p_form_dt: "20230301",
      p_to_dt: "20230331",
      p_form_no: "",
      p_serial_no: "",
      p_customer_cd: "",
      p_document_no: "",
      p_purpose_ac: "",
      p_process_yn: "N",
      p_voucherIO: "T",
      p_invoice_type: "A",
    };
    const res = await DBService.ExecuteSQLBlob(
      `BEGIN AC_SEL_CHECKING_TAXCODE( :p_tco_company_pk,
                                            :p_tco_busplace_pk, 
                                            :p_form_dt,
                                            :p_to_dt,
                                            :p_form_no,
                                            :p_serial_no,
                                            :p_customer_cd,
                                            :p_document_no,
                                            :p_purpose_ac,
                                            :p_process_yn,
                                            :p_voucherIO,
                                            :p_invoice_type,
                                            :p_language, 
                                            :p_crt_by, 
                                            :p_rtn_cur); END;`,
      para_value,
      p_language,
      p_crt_by
    );
    console.log("res.p_rtn_cur  ", res.p_rtn_cur);

    // if (res.p_rtn_cur[0].STATUS == "OK") {
    //     return Utils.response(true, `Call tax office api success.`, {
    //         tei_einvoice_ss_m_pk: para.tei_einvoice_ss_m_pk,
    //         tradecode: tradeCode.data.maGDich,
    //     });
    // } else {
    //     console.log("FAILE");
    // }

    //  let mst = "010152785-062";

    //  let config = {
    //     header : {
    //      'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8',
    //      'User-Agent' : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36'
    //    }
    //   }

    //  const res_token = await Request.post(Url1, config);

    //  if(res_token.data.success == 1){

    //     console.log("T   ",  res_token.data.token.toString());

    //     formData.append('q', mst);
    //     formData.append('type', 'auto');
    //     formData.append('token',  res_token.data.token.toString());  //res_token.data.token.toString() +
    //     formData.append('force-search', 1);

    //     console.log("formData   ",  formData);

    //     const res_result = await Request.post(Url2, formData , config );

    //     console.log("res_result ", res_result.data);

    //  }else
    //  {
    //     //console.log("res_token. faile");
    //  }
    //console.log(res_token);
  }

  async getExchangeCurrency({ request, response, auth }) {
    var p_language = request.header("accept-language", "ENG");
    var p_crt_by = "";
    const user = await auth.getUser();
    if (user) {
      p_crt_by = user.USER_ID;
    }
    let formData = new FormData();

    const { proc, para } = request.all();

    let config = {
      header: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36",
      },
    };
    let url =
      "https://portal.vietcombank.com.vn/Usercontrols/TVPortal.TyGia/pXML.aspx?b=10";
    const dataExchangeRate = await Request.get(url, config);

    //   console.log("dataExchangeRate ", dataExchangeRate.data);
    let respon_data = [],
      result_data = [];

    var parseString = require("xml2js").parseString;
    parseString(dataExchangeRate.data, function (err, result) {
      result_data = result.ExrateList.Exrate;

      // console.log("result  ", result);
      // console.log("result.ExrateList  ", result.ExrateList);
      // console.log("result.ExrateList.Exrate  ", result.ExrateList.Exrate);

      result.ExrateList.Exrate.forEach(async (item) => {
        // console.log("item.$  ", item.$ );
        const para_value = {
          p_CurrencyCode: item.$.CurrencyCode,
          p_CurrencyName: item.$.CurrencyName,
          p_Buy: item.$.Buy,
          p_Transfer: item.$.Transfer,
          p_Sell: item.$.Sell,
        };
        const res = await DBService.ExecuteSQLBlob(
          `BEGIN AC_UP_EXCHANGERATE(      :p_CurrencyCode,
                                                        :p_CurrencyName, 
                                                        :p_Buy,
                                                        :p_Transfer,
                                                        :p_Sell,
                                                        :p_language, 
                                                        :p_crt_by, 
                                                        :p_rtn_cur); END;`,
          para_value,
          p_language,
          p_crt_by
        );
        // console.log("res  ", res.p_rtn_cur[0]);
        respon_data.push({
          STATUS: res.p_rtn_cur[0].STATUS,
          CCY: item.$.CurrencyCode,
        });
      });
    });

    return response.send(Utils.response(true, `get_data_success`, respon_data));
  }

  async sendDataGetPDF({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }
      console.log("p_crt_by  ", p_crt_by);
      const { proc, para } = request.all();

      console.log("para  ", para);

      let api_url =
        "http://csharp-api.webcashvietnam.com/wseinvoice/BSService.asmx/SendPDF_Template";
      const formatData = new FormData();
      // formatData.append('file', fs.createReadStream(_file_url));
      // formatData.append('proc', _api_ImpProdFile);
      formatData.append("para", JSON.stringify(para));
      let axios_config = {
        headers: {
          ...formatData.getHeaders(),
        },
      };
      console.log("formatData  ", formatData);
      const res = await request.post(api_url, formatData, axios_config);
      console.log("res  ", res.data);
      return response.send(res.data);
      // } else {
      // console.error("Failed to get api token");
      // }
      return response.send(
        Utils.response(false, `Failed to send invoices.....`, null)
      );
    } catch (e) {
      Utils.ConsoleLogError(e.message);
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "sendInvoiceToTaxOfficeFromClient",
        CONTENT: e.message,
      });
      return response.send(Utils.response(false, "error", e.message));
    }
  }

  async viewPDFFromClient({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }

      const { proc, para } = request.all();

      const token = await this.callLogin(
        EINVOICE_URL_LOGIN,
        EINVOICE_USER,
        EINVOICE_PW
      );

      if (token) {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        // console.log("EINVOICE_URL_API_VIEW_PDF ", EINVOICE_URL_API_VIEW_PDF);
        const res = await Request.post(
          EINVOICE_URL_API_VIEW_PDF,
          { para: para },
          config
        );
        // console.log("checkInvoiceStatusFromClient", res.data);
        return response.send(res.data);
      } else {
        console.error("Failed to get api token");
      }
      return response.send(
        Utils.response(false, `Failed to send invoices.`, null)
      );
    } catch (e) {
      Utils.ConsoleLogError(e.message);
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "sendInvoiceToTaxOfficeFromClient",
        CONTENT: e.message,
      });
      return response.send(Utils.response(false, "error", e.message));
    }
  }

  async checkingStatusEinvoiceClient({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }

      const { para } = request.all();

      // console.log(" para ", para);

      // const token = await this.callLogin(
      //     EINVOICE_URL_LOGIN,
      //     EINVOICE_USER,
      //     EINVOICE_PW
      // );
      // console.log("EINVOICE_URL_LOGIN  ", EINVOICE_URL_LOGIN, "  EINVOICE_USER ", EINVOICE_USER, "  EINVOICE_PW ", EINVOICE_PW );
      // if (!token) {
      //     const config = {
      //         headers: { Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjk0MiwiaWF0IjoxNjk4NDAyODcyfQ.7IY9QpTgKp8Ymm8JAdD9RVf6HFRDeD-DgTN0wS9alXg"}` },
      //     };
      //     const res = await Request.post(
      //         EINVOICE_URL_API_CHECKING_STATUS_EINV, { para: para },
      //         config
      //     );
      //     console.log("convertInvoiceToXMLClient", res.data);
      //     return response.send(res.data);
      // } else {
      //     console.error("Failed to get api token");
      // }
      const res = await Request.post(EINVOICE_CHECK_DATA, { arg_XmlStr: para });
      // console.log("res  ", res);
      if (res.status) {
        let json = JSON.parse(res.data.d);
        return response.send(json);
      } else
        return response.send(
          Utils.response(false, `Failed to send invoices.....`, null)
        );
    } catch (e) {
      Utils.ConsoleLogError(e.message);
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "checkingStatusEinvoiceClient",
        CONTENT: e.message,
      });
      return response.send(Utils.response(false, "error", e.message));
    }
  }

  async sendDataEinvoice({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }

      // console.log(" para ", para);

      const { para } = request.all();
      // console.log("para ", para);

      const res = await Request.post(EINVOICE_SEND_DATA_EINVOICE, {
        arg_XmlStr: para,
      });
      // console.log("res  ", res);

      if (res.status) {
        let json = JSON.parse(res.data.d);

        const para_value = {
          txtTei_Einvoice_M_PK: json.result,
          txtTac_Crca_PK: json.TAC_CRAC_PK,
          txtInvoice_No: json.Invoice_no,
          txtInvoice_No_Count: json.Count_EInvoice,
        };

        const rtnValue = await DBService.ExecuteSQLBlob(
          `BEGIN AC_UPD_6060054_RESULT (          
                                                        :txtTei_Einvoice_M_PK,
                                                        :txtTac_Crca_PK,
                                                        :txtInvoice_No,
                                                        :txtInvoice_No_Count,
                                                        :p_language, 
                                                        :p_crt_by, 
                                                        :p_rtn_cur); END;`,
          para_value,
          p_language,
          p_crt_by
        );

        // console.log("rtnValue ", rtnValue);
        return response.send(
          Utils.response(true, `Send invoices was success `, json.msg)
        );
      }

      return response.send(
        Utils.response(false, `Failed to send invoices.....`, null)
      );
    } catch (e) {
      Utils.ConsoleLogError(e.message);
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "checkingStatusEinvoiceClient",
        CONTENT: e.message,
      });
      return response.send(Utils.response(false, "error", e.message));
    }
  }

  async insertCustomer({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }

      // console.log(" para ", para);

      const { para } = request.all();
      // console.log("para ", para);

      const res = await Request.post(EINVOICE_INSERT_CUSTOMER, {
        arg_XmlStr: para.arg_XmlStr,
      });
      // console.log("res  ", res);

      if (res.status) {
        let json = JSON.parse(res.data.d);

        const para_value = {
          txtPartnerPk: para.txtPartnerPk,
          txt_tei_customer_pk: json.result,
          txtTei_Company_PK: para.txtTei_Company_PK,
          lstCompany: para.lstCompany,
          txt_Count_Return: para.txt_Count_Return,
        };

        const rtnValue = await DBService.ExecuteSQLBlob(
          `BEGIN SP_PRO_8015020_BUSPARTNER (          
                                                        :txtPartnerPk,
                                                        :txt_tei_customer_pk,
                                                        :txtTei_Company_PK,
                                                        :lstCompany,
                                                        :txt_Count_Return,
                                                        :p_language, 
                                                        :p_crt_by, 
                                                        :p_rtn_cur); END;`,
          para_value,
          p_language,
          p_crt_by
        );

        // console.log("rtnValue ", rtnValue);
        return response.send(
          Utils.response(true, `Interface customer was success `, json.msg)
        );
      }

      return response.send(
        Utils.response(false, `Failed to Interface customer.....`, null)
      );
    } catch (e) {
      Utils.ConsoleLogError(e.message);
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "checkingStatusEinvoiceClient",
        CONTENT: e.message,
      });
      return response.send(Utils.response(false, "error", e.message));
    }
  }

  async updateCustomer({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }

      // console.log(" para ", para);

      const { para } = request.all();
      // console.log("para ", para);

      const res = await Request.post(EINVOICE_UPDATE_CUSTOMER, {
        arg_XmlStr: para.arg_XmlStr,
      });
      // console.log("res  ", res);

      if (res.status) {
        let json = JSON.parse(res.data.d);

        return response.send(
          Utils.response(true, `Updating customer was success `, json.msg)
        );
      }

      return response.send(
        Utils.response(false, `Failed to Interface customer.....`, null)
      );
    } catch (e) {
      Utils.ConsoleLogError(e.message);
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "checkingStatusEinvoiceClient",
        CONTENT: e.message,
      });
      return response.send(Utils.response(false, "error", e.message));
    }
  }

  async cancelDataEinvoice({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }

      // console.log(" para ", para);

      const { para } = request.all();
      // console.log("para ", para);

      const res = await Request.post(EINVOICE_CANCEL_DATA_EINVOICE, {
        arg_XmlStr: para,
      });
      // console.log("res  ", res);

      if (res.status) {
        let json = JSON.parse(res.data.d);

        const para_value = {
          txtTac_Crca_PK: json.result,
          txtInvoice_No_Count: json.Count_Invoice,
        };

        const rtnValue = await DBService.ExecuteSQLBlob(
          `BEGIN AC_PRO_6060054_CANCEL_RESULT (          
                                                        :txtTac_Crca_PK,
                                                        :txtInvoice_No_Count,
                                                        :p_language, 
                                                        :p_crt_by, 
                                                        :p_rtn_cur); END;`,
          para_value,
          p_language,
          p_crt_by
        );

        // console.log("rtnValue ", rtnValue);
        return response.send(
          Utils.response(true, `Send invoices was success `, json.msg)
        );
      }

      return response.send(
        Utils.response(false, `Failed to send invoices.....`, null)
      );
    } catch (e) {
      Utils.ConsoleLogError(e.message);
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "checkingStatusEinvoiceClient",
        CONTENT: e.message,
      });
      return response.send(Utils.response(false, "error", e.message));
    }
  }
}

module.exports = EInvoiceController;
