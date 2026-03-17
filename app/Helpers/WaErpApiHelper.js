"use strict";

const Helpers = use("Helpers");
const fs = use("fs");
const Utils = use("Utils");
const Env = use("Env");
const DBService = use("DBService")
/*==[begin][Wabooks-ERP interface data]==*/
const waerp_url = Env.get("WAERP_URL");
const waerp_api_crts_key = Env.get("WAERP_API_CRTS_KEY");
const waerp_user_id = Env.get("WAERP_USER_ID");
const waerp_user_pw = Env.get("WAERP_USER_PW");
const waerp_ntnl_cd = Env.get("WAERP_NTNL_CD");
const waerp_time_zone = Env.get("WAERP_TIME_ZONE");
const waerp_biz_key = Env.get("WAERP_BIZ_KEY");
class WaErpApiHelper {
    lang = "";
    crt_by = "";
    constructor(lang, crt_by) {
        this.lang = lang;
        this.crt_by = crt_by;
    }
    async processData(processtype, waerp_api_svc_id, rtnData, reqData) {
        try {
            let pEnv = { WAERP_USER_ID: waerp_user_id, waerp_user_pw: waerp_user_pw }
            let resp = rtnData.RESP_DATA;
            let rec = {};
            let para = [];
            let paramObj = [];
            let proc = "";
            let dt = [];
            switch (waerp_api_svc_id) {
                case "WABOOKS_ERP_R001":
                    rec = {};
                    try {
                        rec = {
                            CMPN_NM: resp.REC ? resp.REC[0].CMPN_NM : "",
                            CMPN_ENM: resp.REC ? resp.REC[0].CMPN_ENM : "",
                            TAX_ID: resp.REC ? resp.REC[0].TAX_ID : "",
                            BIZ_KEY: resp.REC ? resp.REC[0].BIZ_KEY : "",
                            LOCK_YN: resp.LOCK_YN ? resp.LOCK_YN : "",
                            PW_ERR_CNT: resp.PW_ERR_CNT ? resp.PW_ERR_CNT : "",
                            TRANSACTION_ID: rtnData.TRANSACTION_ID,
                            USER_ID: rtnData.user_id ? rtnData.user_id : (pEnv.WAERP_USER_ID ? pEnv.WAERP_USER_ID : ""),
                            USER_PW: rtnData.user_pw ? rtnData.user_pw : (pEnv.WAERP_USER_PW ? pEnv.WAERP_USER_PW : ""),
                        };
                        para = [rec.USER_ID, rec.USER_PW, rec.LOCK_YN, rec.PW_ERR_CNT, rec.BIZ_KEY, rec.CMPN_NM, rec.CMPN_ENM, rec.TAX_ID, rec.TRANSACTION_ID];
                        // console.log('[vng-154/dvg] > file: WaErpAPIHelper.js:48 > WaErpApiHelper > processData > para:', para);
                        let rtnSendDB = await DBService.callProcCursor(`WAERP_WABOOKS_ERP_R001`, para, this.lang, this.crt_by);
                        return true;
                    } catch (e) {
                        console.log(`[rtnSendDB:WAERP_WABOOKS_ERP_R001(${rec.USER_ID},${rec.USER_PW},${rec.LOCK_YN},${rec.PW_ERR_CNT},${rec.BIZ_KEY},${rec.CMPN_NM},${rec.CMPN_ENM},${rec.TAX_ID},${rec.TRANSACTION_ID})`)
                        console.log(`[rtnSendDB:WAERP_WABOOKS_ERP_R001]`, e)
                        return false;
                    }
                    break;
                case "WABOOKS_ERP_R002":
                    /*==[Insert Log Table TWA_ERP_USER_LOGIN]==*/
                    resp = { REC: [{ ...resp }] };
                    rec = {};
                    try {
                        rec = {
                            RPRS_BSUN_ST: resp.REC ? resp.REC[0].RPRS_BSUN_ST : "",
                            CMPN_NM: resp.REC ? resp.REC[0].CMPN_NM : "",
                            CMPN_ENM: resp.REC ? resp.REC[0].CMPN_ENM : "",
                            CLPH_NO: resp.REC ? resp.REC[0].CLPH_NO : "",
                            EML: resp.REC ? resp.REC[0].EML : "",
                            RPRS_BSUN_DTL_ADRS: resp.REC ? resp.REC[0].RPRS_BSUN_DTL_ADRS : "",
                            USER_ID: resp.REC ? resp.REC[0].USER_ID : "",
                            RPPR_NM: resp.REC ? resp.REC[0].RPPR_NM : "",
                            USER_NM: resp.REC ? resp.REC[0].USER_NM : "",
                            RPRS_BSUN_CITY: resp.REC ? resp.REC[0].RPRS_BSUN_CITY : "",
                            RPRS_BSUN_POST_ADRS: resp.REC ? resp.REC[0].RPRS_BSUN_POST_ADRS : "",
                            TAX_ID: resp.REC ? resp.REC[0].TAX_ID : "",
                            BIZ_KEY: resp.REC ? resp.REC[0].BIZ_KEY : "",
                            TRANSACTION_ID: rtnData.TRANSACTION_ID
                        }
                        para = [rec.BIZ_KEY, rec.CMPN_NM, rec.CMPN_ENM, rec.TAX_ID, rec.USER_ID, rec.USER_NM, rec.EML, rec.RPPR_NM, rec.RPRS_BSUN_POST_ADRS, rec.RPRS_BSUN_DTL_ADRS, rec.RPRS_BSUN_CITY, rec.RPRS_BSUN_ST, rec.CLPH_NO, rec.TRANSACTION_ID];
                        let rtnSendDB2 = await DBService.callProcCursor(`WAERP_WABOOKS_ERP_R002`, para, this.lang, this.crt_by);
                        return true;
                    } catch (e) {
                        console.log(`[rtnSendDB:WAERP_WABOOKS_ERP_R002(${rec.BIZ_KEY},${rec.CMPN_NM},${rec.CMPN_ENM},${rec.TAX_ID},${rec.USER_ID},${rec.USER_NM},${rec.EML},${rec.RPPR_NM},${rec.RPRS_BSUN_POST_ADRS},${rec.RPRS_BSUN_DTL_ADRS},${rec.RPRS_BSUN_CITY},${rec.RPRS_BSUN_ST},${rec.CLPH_NO},${rec.TRANSACTION_ID})`)
                        console.log(`[rtnSendDB:WAERP_WABOOKS_ERP_R002]`, e)
                        return false;
                    }
                    break;
                case "WABOOKS_ERP_R003":

                    break;
                case "WABOOKS_ERP_R004":

                    break;
                case "WABOOKS_ERP_R005":

                    break;
                /*==[Process AP/AR]=================*/
                case "WABOOKS_ERP_R006":
                    case "WABOOKS_ERP_R007":
                    if (!rtnData.RESP_DATA || !rtnData.RESP_DATA.REC && rtnData.RESP_DATA.REC.length == 0) {
                        return false;
                    }
                    dt = rtnData.RESP_DATA.REC ? rtnData.RESP_DATA.REC : [];
                    for (let i = 0; i <= dt.length - 1; i++) {
                        let dtsrc = dt[i];
                        let rowM = {
                            GROUP_KEY: `${i+1}-${rtnData.TRANSACTION_ID}`
                            , DOC_ID: dtsrc.DOC_ID ? dtsrc.DOC_ID : ""
                            , DOC_TYPE: dtsrc.DOC_TYPE ? dtsrc.DOC_TYPE : ""
                            , HAND_REG_YN: dtsrc.HAND_REG_YN ? dtsrc.HAND_REG_YN : ""
                            , INV_TYPE: dtsrc.INV_TYPE ? dtsrc.INV_TYPE : ""
                            , EINV_INVOICESTATUS: dtsrc.EINV_INVOICESTATUS ? dtsrc.EINV_INVOICESTATUS : ""
                            , EINV_TITLE: dtsrc.EINV_TITLE ? dtsrc.EINV_TITLE : ""
                            , ISSU_DT: dtsrc.ISSU_DT ? dtsrc.ISSU_DT : ""
                            , ISSU_CMNM: dtsrc.ISSU_CMNM ? dtsrc.ISSU_CMNM : ""
                            , ISSU_TAX_ID: dtsrc.ISSU_TAX_ID ? dtsrc.ISSU_TAX_ID : ""
                            , ISSU_BSUN_POST_ADRS: dtsrc.ISSU_BSUN_POST_ADRS ? dtsrc.ISSU_BSUN_POST_ADRS : ""
                            , ISSU_BSUN_DTL_ADRS: dtsrc.ISSU_BSUN_DTL_ADRS ? dtsrc.ISSU_BSUN_DTL_ADRS : ""
                            , ISSU_BSUN_ST: dtsrc.ISSU_BSUN_ST ? dtsrc.ISSU_BSUN_ST : ""
                            , ISSU_BSUN_CITY: dtsrc.ISSU_BSUN_CITY ? dtsrc.ISSU_BSUN_CITY : ""
                            , EINV_SELLERBANKACC: dtsrc.EINV_SELLERBANKACC ? dtsrc.EINV_SELLERBANKACC : ""
                            , EINV_SELLERBANKNAME: dtsrc.EINV_SELLERBANKNAME ? dtsrc.EINV_SELLERBANKNAME : ""
                            , ISSU_RPRS_TLPH: dtsrc.ISSU_RPRS_TLPH ? dtsrc.ISSU_RPRS_TLPH : ""
                            , EINV_BUYERSIGNBY: dtsrc.EINV_BUYERSIGNBY ? dtsrc.EINV_BUYERSIGNBY : ""
                            , EINV_BUYERFULLNAME: dtsrc.EINV_BUYERFULLNAME ? dtsrc.EINV_BUYERFULLNAME : ""
                            , TRCO_BSUN_POST_ADRS: dtsrc.TRCO_BSUN_POST_ADRS ? dtsrc.TRCO_BSUN_POST_ADRS : ""
                            , TRCO_BSUN_DTL_ADRS: dtsrc.TRCO_BSUN_DTL_ADRS ? dtsrc.TRCO_BSUN_DTL_ADRS : ""
                            , TRCO_BSUN_ST: dtsrc.TRCO_BSUN_ST ? dtsrc.TRCO_BSUN_ST : ""
                            , TRCO_BSUN_CITY: dtsrc.TRCO_BSUN_CITY ? dtsrc.TRCO_BSUN_CITY : ""
                            , TRCO_TAX_ID: dtsrc.TRCO_TAX_ID ? dtsrc.TRCO_TAX_ID : ""
                            , EINV_BUYERBANKACC: dtsrc.EINV_BUYERBANKACC ? dtsrc.EINV_BUYERBANKACC : ""
                            , EINV_BUYERBANKNAME: dtsrc.EINV_BUYERBANKNAME ? dtsrc.EINV_BUYERBANKNAME : ""
                            , EINV_LISTNUMBER: dtsrc.EINV_LISTNUMBER ? dtsrc.EINV_LISTNUMBER : ""
                            , EINV_LISTDATE: dtsrc.EINV_LISTDATE ? dtsrc.EINV_LISTDATE : ""
                            , TRCO_TRSC_CCY_CD: dtsrc.TRCO_TRSC_CCY_CD ? dtsrc.TRCO_TRSC_CCY_CD : ""
                            , EINV_PAYMENTTYPE: dtsrc.EINV_PAYMENTTYPE ? dtsrc.EINV_PAYMENTTYPE : ""
                            , APLY_EXCH_RATE: dtsrc.APLY_EXCH_RATE ? dtsrc.APLY_EXCH_RATE : ""
                            , EINV_RATE: dtsrc.EINV_RATE ? dtsrc.EINV_RATE : ""
                            , VN_TOT_AMT: dtsrc.VN_TOT_AMT ? dtsrc.VN_TOT_AMT : ""
                            , VN_TOT_VAT_AMT: dtsrc.VN_TOT_VAT_AMT ? dtsrc.VN_TOT_VAT_AMT : ""
                            , SPLY_AMT_SUM: dtsrc.SPLY_AMT_SUM ? dtsrc.SPLY_AMT_SUM : ""
                            , TAX_AMT_SUM: dtsrc.TAX_AMT_SUM ? dtsrc.TAX_AMT_SUM : ""
                            , TOTL_FEE_AMT: dtsrc.TOTL_FEE_AMT ? dtsrc.TOTL_FEE_AMT : ""
                            , TOTL_DIS_AMT: dtsrc.TOTL_DIS_AMT ? dtsrc.TOTL_DIS_AMT : ""
                            , TOTL_AMT: dtsrc.TOTL_AMT ? dtsrc.TOTL_AMT : ""
                            , EINV_TOTALAMTINLETTER: dtsrc.EINV_TOTALAMTINLETTER ? dtsrc.EINV_TOTALAMTINLETTER : ""
                            , EINV_MCCQT: dtsrc.EINV_MCCQT ? dtsrc.EINV_MCCQT : ""
                            , EINV_SELLERSIGNDATE: dtsrc.EINV_SELLERSIGNDATE ? dtsrc.EINV_SELLERSIGNDATE : ""
                            , EINV_SELLERSIGNTIME: dtsrc.EINV_SELLERSIGNTIME ? dtsrc.EINV_SELLERSIGNTIME : ""
                            , EINV_SELLERSIGNBY: dtsrc.EINV_SELLERSIGNBY ? dtsrc.EINV_SELLERSIGNBY : ""
                            , EINV_ORIGINALINVOICE: dtsrc.EINV_ORIGINALINVOICE ? dtsrc.EINV_ORIGINALINVOICE : ""
                            , BUSA_USAG_CD: dtsrc.BUSA_USAG_CD ? dtsrc.BUSA_USAG_CD : ""
                            , CONT: dtsrc.CONT ? dtsrc.CONT : ""
                            , PRJT_NO: dtsrc.PRJT_NO ? dtsrc.PRJT_NO : ""
                            , PAY_DUE_CD: dtsrc.PAY_DUE_CD ? dtsrc.PAY_DUE_CD : ""
                            , DUE_DT: dtsrc.DUE_DT ? dtsrc.DUE_DT : ""
                            , APPR_SEQ_NO: dtsrc.APPR_SEQ_NO ? dtsrc.APPR_SEQ_NO : ""
                            , PROV_STTS: dtsrc.PROV_STTS ? dtsrc.PROV_STTS : ""
                            , EINV_TESTRESULTS: dtsrc.EINV_TESTRESULTS ? dtsrc.EINV_TESTRESULTS : ""
                            , REG_ID: dtsrc.REG_ID ? dtsrc.REG_ID : ""
                            , REG_DTM: dtsrc.REG_DTM ? dtsrc.REG_DTM : ""
                            , MOD_ID: dtsrc.MOD_ID ? dtsrc.MOD_ID : ""
                            , MOD_DTM: dtsrc.MOD_DTM ? dtsrc.MOD_DTM : ""
                        }
                        para = [
                            rowM.GROUP_KEY
                            , rowM.DOC_ID
                            , rowM.DOC_TYPE
                            , rowM.HAND_REG_YN
                            , rowM.INV_TYPE
                            , rowM.EINV_INVOICESTATUS
                            , rowM.EINV_TITLE
                            , rowM.ISSU_DT
                            , rowM.ISSU_CMNM
                            , rowM.ISSU_TAX_ID
                            , rowM.ISSU_BSUN_POST_ADRS
                            , rowM.ISSU_BSUN_DTL_ADRS
                            , rowM.ISSU_BSUN_ST
                            , rowM.ISSU_BSUN_CITY
                            , rowM.EINV_SELLERBANKACC
                            , rowM.EINV_SELLERBANKNAME
                            , rowM.ISSU_RPRS_TLPH
                            , rowM.EINV_BUYERSIGNBY
                            , rowM.EINV_BUYERFULLNAME
                            , rowM.TRCO_BSUN_POST_ADRS
                            , rowM.TRCO_BSUN_DTL_ADRS
                            , rowM.TRCO_BSUN_ST
                            , rowM.TRCO_BSUN_CITY
                            , rowM.TRCO_TAX_ID
                            , rowM.EINV_BUYERBANKACC
                            , rowM.EINV_BUYERBANKNAME
                            , rowM.EINV_LISTNUMBER
                            , rowM.EINV_LISTDATE
                            , rowM.TRCO_TRSC_CCY_CD
                            , rowM.EINV_PAYMENTTYPE
                            , rowM.APLY_EXCH_RATE
                            , rowM.EINV_RATE
                            , rowM.VN_TOT_AMT
                            , rowM.VN_TOT_VAT_AMT
                            , rowM.SPLY_AMT_SUM
                            , rowM.TAX_AMT_SUM
                            , rowM.TOTL_FEE_AMT
                            , rowM.TOTL_DIS_AMT
                            , rowM.TOTL_AMT
                            , rowM.EINV_TOTALAMTINLETTER
                            , rowM.EINV_MCCQT
                            , rowM.EINV_SELLERSIGNDATE
                            , rowM.EINV_SELLERSIGNTIME
                            , rowM.EINV_SELLERSIGNBY
                            , rowM.EINV_ORIGINALINVOICE
                            , rowM.BUSA_USAG_CD
                            , rowM.CONT
                            , rowM.PRJT_NO
                            , rowM.PAY_DUE_CD
                            , rowM.DUE_DT
                            , rowM.APPR_SEQ_NO
                            , rowM.PROV_STTS
                            , rowM.EINV_TESTRESULTS
                            , rowM.REG_ID
                            , rowM.REG_DTM
                            , rowM.MOD_ID
                            , rowM.MOD_DTM];

                        let P_TWA_ERP_INVOICES_ARAP_M_PK = 0;
                        if (para) {
                            let rtnDB1 = await DBService.callProcCursor('WAERP_WABOOKS_ERP_R006_R007_R008_M', para, this.lang, this.crt_by);
                            P_TWA_ERP_INVOICES_ARAP_M_PK = rtnDB1[0].TWA_ERP_INVOICES_ARAP_M_PK;
                        }
                        let rowD = [];
                        let dtd = dtsrc.REC_1 ? dtsrc.REC_1 : [];
                        dtd = P_TWA_ERP_INVOICES_ARAP_M_PK == 0 ? [] : dtd;
                        for (let j = 0; j <= dtd.length - 1; j++) {
                            let dtsrcd = dtd[j];
                            let rows = {
                                GROUP_KEY: `${j+1}-${rtnData.TRANSACTION_ID}`
                                , DISP_ORD: dtsrcd.DISP_ORD ? dtsrcd.DISP_ORD : ""
                                , ITEM_CD: dtsrcd.ITEM_CD ? dtsrcd.ITEM_CD : ""
                                , ITEM_NM: dtsrcd.ITEM_NM ? dtsrcd.ITEM_NM : ""
                                , EINV_PRODUCTNAME: dtsrcd.EINV_PRODUCTNAME ? dtsrcd.EINV_PRODUCTNAME : ""
                                , UOM: dtsrcd.UOM ? dtsrcd.UOM : ""
                                , ITEM_QUNT: dtsrcd.ITEM_QUNT ? dtsrcd.ITEM_QUNT : ""
                                , ITEM_UNIT_AMT: dtsrcd.ITEM_UNIT_AMT ? dtsrcd.ITEM_UNIT_AMT : ""
                                , EINV_TAXRATE: dtsrcd.EINV_TAXRATE ? dtsrcd.EINV_TAXRATE : ""
                                , SPLY_AMT: dtsrcd.SPLY_AMT ? dtsrcd.SPLY_AMT : ""
                                , TAX_AMT: dtsrcd.TAX_AMT ? dtsrcd.TAX_AMT : ""
                                , DC_AMT: dtsrcd.DC_AMT ? dtsrcd.DC_AMT : ""
                                , NOTE: dtsrcd.NOTE ? dtsrcd.NOTE : ""
                                , REG_ID: dtsrcd.REG_ID ? dtsrcd.REG_ID : ""
                                , REG_DTM: dtsrcd.REG_DTM ? dtsrcd.REG_DTM : ""
                                , MOD_ID: dtsrcd.MOD_ID ? dtsrcd.MOD_ID : ""
                                , MOD_DTM: dtsrcd.MOD_DTM ? dtsrcd.MOD_DTM : ""
                            };
                            rowD.push([rows.GROUP_KEY, rows.DISP_ORD, rows.ITEM_CD, rows.ITEM_NM, rows.EINV_PRODUCTNAME, rows.UOM, rows.ITEM_QUNT, rows.ITEM_UNIT_AMT, rows.EINV_TAXRATE, rows.SPLY_AMT, rows.TAX_AMT, rows.DC_AMT, rows.NOTE, rows.REG_ID, rows.REG_DTM, rows.MOD_ID, rows.MOD_DTM,P_TWA_ERP_INVOICES_ARAP_M_PK]);
                        }
                        if (rowD) {
                            await DBService.callBulkProcCursor('WAERP_WABOOKS_ERP_R006_R007_R008_D', rowD, this.lang, this.crt_by, 'N');
                        }
                    }
                    return true;
                    break; 
                case "WABOOKS_ERP_R008":
                    if (!rtnData.RESP_DATA || !rtnData.RESP_DATA.REC && rtnData.RESP_DATA.REC.length == 0) {
                        return false;
                    }
                    dt = rtnData.RESP_DATA.REC ? rtnData.RESP_DATA.REC : [];
                    for (let i = 0; i <= dt.length - 1; i++) {
                        let dtsrc = dt[i];
                        let rowM = {
                            GROUP_KEY: `${i+1}-${rtnData.TRANSACTION_ID}`
                            , DOC_ID: dtsrc.DOC_ID ? dtsrc.DOC_ID : ""
                            , DOC_TYPE: dtsrc.DOC_TYPE ? dtsrc.DOC_TYPE : ""
                            , HAND_REG_YN: dtsrc.HAND_REG_YN ? dtsrc.HAND_REG_YN : ""
                            , INV_TYPE: dtsrc.INV_TYPE ? dtsrc.INV_TYPE : ""
                            , EINV_INVOICESTATUS: dtsrc.EINV_INVOICESTATUS ? dtsrc.EINV_INVOICESTATUS : ""
                            , EINV_TITLE: dtsrc.EINV_TITLE ? dtsrc.EINV_TITLE : ""
                            , ISSU_DT: dtsrc.ISSU_DT ? dtsrc.ISSU_DT : ""
                            , ISSU_CMNM: dtsrc.ISSU_CMNM ? dtsrc.ISSU_CMNM : ""
                            , ISSU_TAX_ID: dtsrc.ISSU_TAX_ID ? dtsrc.ISSU_TAX_ID : ""
                            , ISSU_BSUN_POST_ADRS: dtsrc.ISSU_BSUN_POST_ADRS ? dtsrc.ISSU_BSUN_POST_ADRS : ""
                            , ISSU_BSUN_DTL_ADRS: dtsrc.ISSU_BSUN_DTL_ADRS ? dtsrc.ISSU_BSUN_DTL_ADRS : ""
                            , ISSU_BSUN_ST: dtsrc.ISSU_BSUN_ST ? dtsrc.ISSU_BSUN_ST : ""
                            , ISSU_BSUN_CITY: dtsrc.ISSU_BSUN_CITY ? dtsrc.ISSU_BSUN_CITY : ""
                            , EINV_SELLERBANKACC: dtsrc.EINV_SELLERBANKACC ? dtsrc.EINV_SELLERBANKACC : ""
                            , EINV_SELLERBANKNAME: dtsrc.EINV_SELLERBANKNAME ? dtsrc.EINV_SELLERBANKNAME : ""
                            , ISSU_RPRS_TLPH: dtsrc.ISSU_RPRS_TLPH ? dtsrc.ISSU_RPRS_TLPH : ""
                            , EINV_BUYERSIGNBY: dtsrc.EINV_BUYERSIGNBY ? dtsrc.EINV_BUYERSIGNBY : ""
                            , EINV_BUYERFULLNAME: dtsrc.EINV_BUYERFULLNAME ? dtsrc.EINV_BUYERFULLNAME : ""
                            , TRCO_BSUN_POST_ADRS: dtsrc.TRCO_BSUN_POST_ADRS ? dtsrc.TRCO_BSUN_POST_ADRS : ""
                            , TRCO_BSUN_DTL_ADRS: dtsrc.TRCO_BSUN_DTL_ADRS ? dtsrc.TRCO_BSUN_DTL_ADRS : ""
                            , TRCO_BSUN_ST: dtsrc.TRCO_BSUN_ST ? dtsrc.TRCO_BSUN_ST : ""
                            , TRCO_BSUN_CITY: dtsrc.TRCO_BSUN_CITY ? dtsrc.TRCO_BSUN_CITY : ""
                            , TRCO_TAX_ID: dtsrc.TRCO_TAX_ID ? dtsrc.TRCO_TAX_ID : ""
                            , EINV_BUYERBANKACC: dtsrc.EINV_BUYERBANKACC ? dtsrc.EINV_BUYERBANKACC : ""
                            , EINV_BUYERBANKNAME: dtsrc.EINV_BUYERBANKNAME ? dtsrc.EINV_BUYERBANKNAME : ""
                            , EINV_LISTNUMBER: dtsrc.EINV_LISTNUMBER ? dtsrc.EINV_LISTNUMBER : ""
                            , EINV_LISTDATE: dtsrc.EINV_LISTDATE ? dtsrc.EINV_LISTDATE : ""
                            , TRCO_TRSC_CCY_CD: dtsrc.TRCO_TRSC_CCY_CD ? dtsrc.TRCO_TRSC_CCY_CD : ""
                            , EINV_PAYMENTTYPE: dtsrc.EINV_PAYMENTTYPE ? dtsrc.EINV_PAYMENTTYPE : ""
                            , APLY_EXCH_RATE: dtsrc.APLY_EXCH_RATE ? dtsrc.APLY_EXCH_RATE : ""
                            , EINV_RATE: dtsrc.EINV_RATE ? dtsrc.EINV_RATE : ""
                            , VN_TOT_AMT: dtsrc.VN_TOT_AMT ? dtsrc.VN_TOT_AMT : ""
                            , VN_TOT_VAT_AMT: dtsrc.VN_TOT_VAT_AMT ? dtsrc.VN_TOT_VAT_AMT : ""
                            , SPLY_AMT_SUM: dtsrc.SPLY_AMT_SUM ? dtsrc.SPLY_AMT_SUM : ""
                            , TAX_AMT_SUM: dtsrc.TAX_AMT_SUM ? dtsrc.TAX_AMT_SUM : ""
                            , TOTL_FEE_AMT: dtsrc.TOTL_FEE_AMT ? dtsrc.TOTL_FEE_AMT : ""
                            , TOTL_DIS_AMT: dtsrc.TOTL_DIS_AMT ? dtsrc.TOTL_DIS_AMT : ""
                            , TOTL_AMT: dtsrc.TOTL_AMT ? dtsrc.TOTL_AMT : ""
                            , EINV_TOTALAMTINLETTER: dtsrc.EINV_TOTALAMTINLETTER ? dtsrc.EINV_TOTALAMTINLETTER : ""
                            , EINV_MCCQT: dtsrc.EINV_MCCQT ? dtsrc.EINV_MCCQT : ""
                            , EINV_SELLERSIGNDATE: dtsrc.EINV_SELLERSIGNDATE ? dtsrc.EINV_SELLERSIGNDATE : ""
                            , EINV_SELLERSIGNTIME: dtsrc.EINV_SELLERSIGNTIME ? dtsrc.EINV_SELLERSIGNTIME : ""
                            , EINV_SELLERSIGNBY: dtsrc.EINV_SELLERSIGNBY ? dtsrc.EINV_SELLERSIGNBY : ""
                            , EINV_ORIGINALINVOICE: dtsrc.EINV_ORIGINALINVOICE ? dtsrc.EINV_ORIGINALINVOICE : ""
                            , BUSA_USAG_CD: dtsrc.BUSA_USAG_CD ? dtsrc.BUSA_USAG_CD : ""
                            , CONT: dtsrc.CONT ? dtsrc.CONT : ""
                            , PRJT_NO: dtsrc.PRJT_NO ? dtsrc.PRJT_NO : ""
                            , PAY_DUE_CD: dtsrc.PAY_DUE_CD ? dtsrc.PAY_DUE_CD : ""
                            , DUE_DT: dtsrc.DUE_DT ? dtsrc.DUE_DT : ""
                            , APPR_SEQ_NO: dtsrc.APPR_SEQ_NO ? dtsrc.APPR_SEQ_NO : ""
                            , PROV_STTS: dtsrc.PROV_STTS ? dtsrc.PROV_STTS : ""
                            , EINV_TESTRESULTS: dtsrc.EINV_TESTRESULTS ? dtsrc.EINV_TESTRESULTS : ""
                            , REG_ID: dtsrc.REG_ID ? dtsrc.REG_ID : ""
                            , REG_DTM: dtsrc.REG_DTM ? dtsrc.REG_DTM : ""
                            , MOD_ID: dtsrc.MOD_ID ? dtsrc.MOD_ID : ""
                            , MOD_DTM: dtsrc.MOD_DTM ? dtsrc.MOD_DTM : ""
                        }
                        para = [
                            rowM.GROUP_KEY
                            , rowM.DOC_ID
                            , rowM.DOC_TYPE
                            , rowM.HAND_REG_YN
                            , rowM.INV_TYPE
                            , rowM.EINV_INVOICESTATUS
                            , rowM.EINV_TITLE
                            , rowM.ISSU_DT
                            , rowM.ISSU_CMNM
                            , rowM.ISSU_TAX_ID
                            , rowM.ISSU_BSUN_POST_ADRS
                            , rowM.ISSU_BSUN_DTL_ADRS
                            , rowM.ISSU_BSUN_ST
                            , rowM.ISSU_BSUN_CITY
                            , rowM.EINV_SELLERBANKACC
                            , rowM.EINV_SELLERBANKNAME
                            , rowM.ISSU_RPRS_TLPH
                            , rowM.EINV_BUYERSIGNBY
                            , rowM.EINV_BUYERFULLNAME
                            , rowM.TRCO_BSUN_POST_ADRS
                            , rowM.TRCO_BSUN_DTL_ADRS
                            , rowM.TRCO_BSUN_ST
                            , rowM.TRCO_BSUN_CITY
                            , rowM.TRCO_TAX_ID
                            , rowM.EINV_BUYERBANKACC
                            , rowM.EINV_BUYERBANKNAME
                            , rowM.EINV_LISTNUMBER
                            , rowM.EINV_LISTDATE
                            , rowM.TRCO_TRSC_CCY_CD
                            , rowM.EINV_PAYMENTTYPE
                            , rowM.APLY_EXCH_RATE
                            , rowM.EINV_RATE
                            , rowM.VN_TOT_AMT
                            , rowM.VN_TOT_VAT_AMT
                            , rowM.SPLY_AMT_SUM
                            , rowM.TAX_AMT_SUM
                            , rowM.TOTL_FEE_AMT
                            , rowM.TOTL_DIS_AMT
                            , rowM.TOTL_AMT
                            , rowM.EINV_TOTALAMTINLETTER
                            , rowM.EINV_MCCQT
                            , rowM.EINV_SELLERSIGNDATE
                            , rowM.EINV_SELLERSIGNTIME
                            , rowM.EINV_SELLERSIGNBY
                            , rowM.EINV_ORIGINALINVOICE
                            , rowM.BUSA_USAG_CD
                            , rowM.CONT
                            , rowM.PRJT_NO
                            , rowM.PAY_DUE_CD
                            , rowM.DUE_DT
                            , rowM.APPR_SEQ_NO
                            , rowM.PROV_STTS
                            , rowM.EINV_TESTRESULTS
                            , rowM.REG_ID
                            , rowM.REG_DTM
                            , rowM.MOD_ID
                            , rowM.MOD_DTM];

                        let P_TWA_ERP_INVOICES_ARAP_M_PK = 0;
                        if (para) {
                            let rtnDB1 = await DBService.callProcCursor('WAERP_WABOOKS_ERP_R006_R007_R008_M', para, this.lang, this.crt_by);
                            P_TWA_ERP_INVOICES_ARAP_M_PK = rtnDB1[0].TWA_ERP_INVOICES_ARAP_M_PK;
                        }
                        let rowD = [];
                        let dtd = dtsrc.REC_1 ? dtsrc.REC_1 : [];
                        dtd = P_TWA_ERP_INVOICES_ARAP_M_PK == 0 ? [] : dtd;
                        for (let j = 0; j <= dtd.length - 1; j++) {
                            let dtsrcd = dtd[j];
                            let rows = {
                                GROUP_KEY: `${j+1}-${rtnData.TRANSACTION_ID}`
                                , FILE_SIZE: dtsrcd.FILE_SIZE ? dtsrcd.FILE_SIZE : ""
                                , FILE_ID: dtsrcd.FILE_ID ? dtsrcd.FILE_ID : ""
                                , ORG_FILE_NM: dtsrcd.ORG_FILE_NM ? dtsrcd.ORG_FILE_NM : ""
                                , FILE_URL: dtsrcd.FILE_URL ? dtsrcd.FILE_URL : "" 
                            };
                            rowD.push([rows.GROUP_KEY, rows.FILE_SIZE, rows.FILE_ID, rows.ORG_FILE_NM, rows.FILE_URL ,P_TWA_ERP_INVOICES_ARAP_M_PK]);
                        }
                        if (rowD) {
                            await DBService.callBulkProcCursor('WAERP_WABOOKS_ERP_R006_R007_R008_F', rowD, this.lang, this.crt_by, 'N');
                        }
                    }
                    break;
                case "WABOOKS_ERP_R009":

                    break;
                case "WABOOKS_ERP_R010":

                    break;
                case "WABOOKS_ERP_R011":

                    break;
                case "WABOOKS_ERP_R012":

                    break;
                default:
                    break;
            }
        } catch (e) {
            Utils.Logger({ LVL: "error", MODULE: "WaErpApiHelper", FUNC: "importDBData", CONTENT: e.message })
        }
    }
}
module.exports = WaErpApiHelper