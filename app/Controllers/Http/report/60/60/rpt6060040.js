"use strict";
const Helpers = use('Helpers')
const Antl = use("Antl");
const Utils = use("Utils");
const DBService = use("DBService")
var Excel = use('exceljs');
var workbook = new Excel.Workbook();
class rpt6060040 {
    /*########################################################## Report JH ##################################################################################*/ 
        async rpt_6060040_MS({ request, response, auth }) {
            try 
            { 
                /*  P_RPT_ID: report_info.VAL1, P_RPT_URL: report_info.VAL2, P_RPT_FILE: report_info.VAL3,
                    P_COMP_ID: company_info.PARTNER_ID,P_COMP_NM: company_info.TEXT,P_COMP_TAX: company_info.TAX_CODE, P_COMP_ADD: company_info.ADDR1,
                    P_COMPANY: this.selectedCompany,P_TCO_BUSPLACE_PK: this.lstBizPlace, P_FR_DATE: this.from_date,P_FR_TO: this.to_date,P_VOUCHER_NO : this.txtVoucherNo,
                    P_PARTNER_PK : this.txtPartnerPK, P_ITEM_PK  : this.txtItem_PK, P_PL_PK : this.txtPLPK, P_ACC_PK: this.txtAccountPK, P_DELIVERY_NO : this.txtDeliveryNo,
                    P_SEQ  : this.txtSeq, P_STATUS : this.selectedStatus, P_WH_PK : this.selectedWH, 
                    P_BIZ_ID: BizPlace_info.NAME, P_BIZ_NM: BizPlace_info.LOC_NM, P_BIZ_TAX: BizPlace_info.TAX_CD, P_BIZ_ADD: BizPlace_info.ADDR_NM1
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
                var _store          = "AC_RPT_6060040_MS";
                var _param          = [item.P_COMPANY, item.P_CUSTOMER_PK, item.P_FR_DATE, item.P_FR_TO, item.P_SLIP_STATUS, item.P_ORIGIN, item.P_SEQ, item.P_VOUCHER_NO ,item.P_INVOICE_NO, item.P_PL_PK, item.P_LANG, item.P_FORM_NO, item.P_SERIAL_NO, item.P_INVOICE_TYPE, item.P_EISTATUS_TYPE, item.P_ITEM_PK, item.P_TCO_BUSPLACE_PK];
        
                /***************************** Return failded ****************************/
                if (!user) 
                {
                    return response.send(Utils.response(false, "Request failed!", null));
                } 
                /****************************** Begin call store and write excell *********/
                else 
                { 
                    /********* Call store  ***************/ 
                    var dt_Data  = await DBService.callProcCursor(_store, _param , p_language , p_crt_by); 
                    if (dt_Data.length>0) 
                    {
                        dt_Data = dt_Data;
                    } 
                    else 
                    {
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
                
                    //INFOMATION COMPANY
                    var r_item = worksheet.getRow(1);
                    r_item.getCell(1).value = Utils.translate("COMPANY",_dictionary , p_language) + ": " + BIZ_ID +" - "+ BIZ_NM;    
                    r_item = worksheet.getRow(2);
                    r_item.getCell(1).value = Utils.translate("TAX_CODE",_dictionary, p_language) + ": "+ BIZ_TAX;   
                    r_item = worksheet.getRow(3);
                    r_item.getCell(1).value = Utils.translate("ADDRESS",_dictionary , p_language) + ": "+ BIZ_ADD;
                    var FromDate = item.P_FR_DATE;
                    var ToDate = item.P_FR_TO;
                    var strFrDate = FromDate.substr(6,2) + "/"+ FromDate.substr(4,2)+ "/"+ FromDate.substr(0,4);
                    var strToDate = ToDate.substr(6,2) + "/"+ ToDate.substr(4,2)+ "/"+ ToDate.substr(0,4);
                    worksheet.getCell("A6").value =  "Từ ngày " + strFrDate + " đến ngày " + strToDate; ;
                    
                    // thông tư
                    
                    var pos = 9; 
                    let l_QTY              = 0;
                    let l_NET_BK_AMT       = 0;
                    let l_RTN_QTY          = 0;
                    let l_TOTAL_DISCOUNT   = 0;
                    let l_TOTAL_ROW        = 0;
                    Utils.excelInsertRows(worksheet, pos, dt_Data.length-1);
                    for (var i = 0; i < dt_Data.length; i++) 
                    {
    
                        var row = worksheet.getRow(pos);
    
                        row.getCell(1).value = dt_Data[i].TR_DATE;
                        row.getCell(2).value = dt_Data[i].TR_DATE_VC;
                        row.getCell(3).value = dt_Data[i].VOUCHERNO;
                        row.getCell(4).value = dt_Data[i].INVOICE_DATE; 
                        row.getCell(5).value = dt_Data[i].INVOICE_NO;
                        row.getCell(6).value = dt_Data[i].ITEM_CODE;
                        row.getCell(7).value = dt_Data[i].ITEM_NAME;
                        row.getCell(8).value = dt_Data[i].SPEC_CODE1;
                        row.getCell(9).value = dt_Data[i].SPEC_CODE2;
                        row.getCell(10).value = dt_Data[i].ITEM_UOM;
                        row.getCell(11).value = Number(dt_Data[i].QTY);
                        row.getCell(12).value = Number(dt_Data[i].U_PRICE);
                        row.getCell(13).value = Number(dt_Data[i].NET_BK_AMT);
                        row.getCell(14).value = dt_Data[i].DISCOUNT;
                        row.getCell(15).value = Number(dt_Data[i].RTN_QTY);
                        row.getCell(16).value = Number(dt_Data[i].RTN_UPRICE);
                        row.getCell(17).value = Number(dt_Data[i].TOTAL_DISCOUNT);
                        row.getCell(18).value = dt_Data[i].SEQ;

                        l_QTY                 += Number(dt_Data[i].QTY);
                        l_NET_BK_AMT          += Number(dt_Data[i].NET_BK_AMT);
                        l_RTN_QTY             += Number(dt_Data[i].RTN_QTY);
                        l_TOTAL_DISCOUNT      += Number(dt_Data[i].TOTAL_DISCOUNT);
                        l_TOTAL_ROW            = dt_Data[i].ROW_NUM;

                        pos = pos + 1; 
    
                    }  
                    var row = worksheet.getRow(pos);
                    worksheet.mergeCells(pos,1,pos,8); 
                    row.getCell(1).value =  l_TOTAL_ROW;
                    row.getCell(11).value = l_QTY;
                    row.getCell(13).value = l_NET_BK_AMT;
                    row.getCell(15).value = l_RTN_QTY;
                    row.getCell(17).value = l_TOTAL_DISCOUNT;
                    /********* Print file excel ********/
                    const reportFile    = Helpers.tmpPath(file_new);
                    await workbook.xlsx.writeFile(reportFile)
                    return response.attachment( reportFile, file_new);
                }
            } 
            catch (e) 
            {
                Utils.Logger({ LVL: "error", MODULE: "Report", FUNC: "rpt_6060040_MS", CONTENT: e.message })
            // return response.send(Utils.response(false, e.message, null))
            return response.send(null);
            }
        } 
        async rpt_6060040_HISTORY_AR_DETAIL({ request, response, auth }) {
            try 
            { 
                /*  P_RPT_ID: report_info.VAL1, P_RPT_URL: report_info.VAL2, P_RPT_FILE: report_info.VAL3,
                    P_COMP_ID: company_info.PARTNER_ID,P_COMP_NM: company_info.TEXT,P_COMP_TAX: company_info.TAX_CODE, P_COMP_ADD: company_info.ADDR1,
                    P_COMPANY: this.selectedCompany,P_TCO_BUSPLACE_PK: this.lstBizPlace, P_FR_DATE: this.from_date,P_FR_TO: this.to_date,P_VOUCHER_NO : this.txtVoucherNo,
                    P_PARTNER_PK : this.txtPartnerPK, P_ITEM_PK  : this.txtItem_PK, P_PL_PK : this.txtPLPK, P_ACC_PK: this.txtAccountPK, P_DELIVERY_NO : this.txtDeliveryNo,
                    P_SEQ  : this.txtSeq, P_STATUS : this.selectedStatus, P_WH_PK : this.selectedWH, 
                    P_BIZ_ID: BizPlace_info.NAME, P_BIZ_NM: BizPlace_info.LOC_NM, P_BIZ_TAX: BizPlace_info.TAX_CD, P_BIZ_ADD: BizPlace_info.ADDR_NM1
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
                var _store          = "AC_RPT_6060040_HISTORY_AR_D";
                var _param          = [item.P_COMPANY, item.P_CUSTOMER_PK, item.P_FR_DATE, item.P_FR_TO, item.P_SLIP_STATUS, item.P_ORIGIN, item.P_SEQ, item.P_VOUCHER_NO ,item.P_INVOICE_NO, item.P_PL_PK, item.P_LANG, item.P_FORM_NO, item.P_SERIAL_NO, item.P_INVOICE_TYPE, item.P_EISTATUS_TYPE, item.P_ITEM_PK, item.P_TCO_BUSPLACE_PK];
        
                /***************************** Return failded ****************************/
                if (!user) 
                {
                    return response.send(Utils.response(false, "Request failed!", null));
                } 
                /****************************** Begin call store and write excell *********/
                else 
                { 
                    /********* Call store  ***************/ 
                    var dtMaster  = await DBService.callProcCursor("AC_RPT_6060040_MST", _param , p_language , p_crt_by); 
                    var dtDetail  = await DBService.callProcCursor(_store, _param , p_language , p_crt_by); 
                    if (dtDetail.length>0) 
                    {
                        dtDetail = dtDetail;
                    } 
                    else 
                    {
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
                
                    //INFOMATION COMPANY
                    let date_ob = new Date();
                    // adjust 0 before single digit date
                    let date = ("0" + date_ob.getDate()).slice(-2);
                    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
                    let year = date_ob.getFullYear();

                    var FromDate = item.P_FR_DATE;
                    var ToDate = item.P_FR_TO;
                    var strFrDate = FromDate.substr(6,2) + "/"+ FromDate.substr(4,2)+ "/"+ FromDate.substr(0,4);
                    var strToDate = ToDate.substr(6,2) + "/"+ ToDate.substr(4,2)+ "/"+ ToDate.substr(0,4);    
                    worksheet.getCell('A1').value = dtMaster[0].PARTNER_LNAME;
                    worksheet.getCell('A2').value = "Print date :" + date +"-"+ month +"-"+ year; 
                    worksheet.getCell('C4').value = strFrDate + " - " + strToDate; 
                    worksheet.getCell('K4').value = item.P_STATUS_NM; 
                    worksheet.getCell('O4').value = item.P_ORIGIN_NM; 

                    
                    let pos = 9;
                    let l_NET_TR_AMT = 0,l_NET_BK_AMT = 0, l_VAT_TR_AMT = 0 , l_VAT_BK_AMT = 0 , l_TRANS_AMT = 0, l_BOOKS_AMT = 0, l_COST_AMOUNT = 0;
                    
                    Utils.excelInsertRows(worksheet, pos, dtDetail.length-1);
                    for (let i = 0; i < dtDetail.length; i++) {

                        let row = worksheet.getRow(pos + i);
    
                        row.getCell(1).value  = dtDetail[i].SEQ;
                        row.getCell(2).value  = dtDetail[i].VOUCHERNO;
                        row.getCell(3).value  = dtDetail[i].TR_DATE;
                        row.getCell(4).value  = dtDetail[i].FORM_NO;
                        row.getCell(5).value  = dtDetail[i].SERIAL_NO;
                        row.getCell(6).value  = dtDetail[i].INVOICE_DATE;
                        row.getCell(7).value  = dtDetail[i].INVOICE_NO;
                        row.getCell(8).value  = dtDetail[i].EI_STATUS;
                        row.getCell(9).value  = dtDetail[i].INVOICE_TYPE;    
                        row.getCell(10).value = dtDetail[i].PARTNER_ID;
                        row.getCell(11).value = dtDetail[i].PARTNER_NAME;
                        row.getCell(12).value = dtDetail[i].REMARK;
                        row.getCell(13).value = dtDetail[i].ACCD_DR;
                        row.getCell(14).value = dtDetail[i].ACCD_CR1;
                        row.getCell(15).value = dtDetail[i].ACCD_CR2;
                        row.getCell(16).value = dtDetail[i].ITEM_CODE;  
                        row.getCell(17).value = dtDetail[i].ITEM_NAME;
                        row.getCell(18).value = dtDetail[i].ITEM_UOM;  
                        row.getCell(19).value = dtDetail[i].QTY;
                        row.getCell(20).value = dtDetail[i].U_PRICE;
                        row.getCell(21).value = dtDetail[i].NET_TR_AMT;
                        row.getCell(22).value = dtDetail[i].TR_RATE;
                        row.getCell(23).value = dtDetail[i].NET_BK_AMT;
                        row.getCell(24).value = dtDetail[i].VAT_RATE;
                        row.getCell(25).value = dtDetail[i].VAT_TR_AMT;
                        row.getCell(26).value = dtDetail[i].VAT_BK_AMT;
                        row.getCell(27).value = dtDetail[i].TRANS_AMT;
                        row.getCell(28).value = dtDetail[i].BOOKS_AMT;
    
                        row.getCell(29).value = dtDetail[i].ORDER_NO;
                        row.getCell(30).value = dtDetail[i].DECLARE_NO;
                        row.getCell(31).value = dtDetail[i].BIZPLACE;
                        
                        row.getCell(32).value = "";
                        row.getCell(33).value = dtDetail[i].FORM_NO_REF;
                        row.getCell(34).value = dtDetail[i].SERIAL_NO_REF;
                        row.getCell(35).value = dtDetail[i].INVOICE_DT_REF;
                        row.getCell(36).value = dtDetail[i].INVOICE_NO_REF;
                        row.getCell(37).value = dtDetail[i].ADJUST_TYPE;
    
                        row.getCell(38).value = dtDetail[i].PARTNER_NAME_VAT;
                        row.getCell(39).value = dtDetail[i].GROUP_NAME;
                        row.getCell(40).value = dtDetail[i].BUYER_NAME;
                       
                        row.getCell(41).value = dtDetail[i].PO_NO;
                        row.getCell(42).value = dtDetail[i].SEQ_IMPORT_SO;
                        row.getCell(43).value = dtDetail[i].SLIP_TYPE;
                        row.getCell(44).value = dtDetail[i].GIFT_YN;
                        row.getCell(45).value = dtDetail[i].PL_CD;
                        row.getCell(46).value = dtDetail[i].PL_NM;
                        row.getCell(47).value = dtDetail[i].WH_ID;
                        row.getCell(48).value = dtDetail[i].WH_NAME;
                        row.getCell(49).value = dtDetail[i].AC_CD_WH;
                        row.getCell(50).value = dtDetail[i].AC_NM_WH;
                        row.getCell(51).value = dtDetail[i].AC_CD_COST;
                        row.getCell(52).value = dtDetail[i].AC_NM_COST;
    
                        row.getCell(53).value = dtDetail[i].COST_AMOUNT;
                        row.getCell(54).value = dtDetail[i].CI_DATE; 
                        row.getCell(55).value = dtDetail[i].CI_INV;
                        row.getCell(56).value = dtDetail[i].DECLARE_DT;
                        row.getCell(57).value = dtDetail[i].DECL_NO;
                        row.getCell(58).value = dtDetail[i].ATTRIBUTE2;
                      
                       
                        
                        l_NET_TR_AMT = l_NET_TR_AMT  + dtDetail[i].NET_TR_AMT;
                        l_NET_BK_AMT = l_NET_BK_AMT  + dtDetail[i].NET_BK_AMT;
                        l_VAT_TR_AMT = l_VAT_TR_AMT  + dtDetail[i].VAT_TR_AMT; 
                        l_VAT_BK_AMT = l_VAT_BK_AMT  + dtDetail[i].VAT_BK_AMT;  
                        l_TRANS_AMT = l_TRANS_AMT + dtDetail[i].TRANS_AMT;
                        l_BOOKS_AMT = l_BOOKS_AMT + dtDetail[i].BOOKS_AMT;  
                        l_COST_AMOUNT = l_COST_AMOUNT + dtDetail[i].COST_AMOUNT;  
    
                        row.commit();
                    }
                    let row = worksheet.getRow(pos + dtDetail.length);
                    row.getCell(21).value = l_NET_TR_AMT;
                    row.getCell(23).value = l_NET_BK_AMT;
                    row.getCell(25).value = l_VAT_TR_AMT;
                    row.getCell(26).value = l_VAT_BK_AMT;  
                    row.getCell(27).value = l_TRANS_AMT;
                    row.getCell(28).value = l_BOOKS_AMT;    
                    row.getCell(53).value = l_COST_AMOUNT;    
                    
                    row.commit();
                    /********* Print file excel ********/
                    const reportFile    = Helpers.tmpPath(file_new);
                    await workbook.xlsx.writeFile(reportFile)
                    return response.attachment( reportFile, file_new);
                }
            } 
            catch (e) 
            {
                Utils.Logger({ LVL: "error", MODULE: "Report", FUNC: "rpt_6060040_HISTORY_AR_DETAIL", CONTENT: e.message })
            // return response.send(Utils.response(false, e.message, null))
            return response.send(null);
            }
        } 
    }
    
    module.exports = rpt6060040;
// class rpt6060030 {
//     async report1({ request, response, auth }) {
//         try {
//             let { proc, para } = request.get(['proc', 'para'])

//             const user = await auth.getUser();
//             if (!user) {
//                 return response.send(
//                     Utils.response(false, "Request failed!", null)
//                 )
//             } else {
//                 const p_language = request.header("accept-language", "ENG")
//                 let dtMaster = await DBService.callProcCursor("AC_RPT_6060040_MST", para, p_language, user.USER_ID)
//                 //if (dtMaster.p_rtn_cur) {
//                 //    dtMaster = dtMaster.p_rtn_cur
//                 //}
//                 let dtDetail = await DBService.callProcCursor(proc, para, p_language, user.USER_ID)
//                 //if (dtDetail.p_rtn_cur) {
//                 //    dtDetail = dtDetail.p_rtn_cur
//                 //} else {
//                 //    return response.send(Utils.response(false, "no_data_found", null))
//                 //}
//                 const templateFile = Helpers.resourcesPath('report/60/60/6060040.xlsx')
//                 let reportPath = `6060040_${user.USER_ID}.xlsx`
//                 const reportFile = Helpers.tmpPath(reportPath)
//                 await workbook.xlsx.readFile(templateFile)
//                 let worksheet = workbook.getWorksheet(1);

//                 // SET DATA		
//                 const font = { name: 'Batang', size: 8 };
//                 const font_bold = { name: 'Batang', size: 8, bold: true };
//                 let pos = 9;
//                 let l_NET_TR_AMT = 0,l_NET_BK_AMT = 0, l_VAT_TR_AMT = 0 , l_VAT_BK_AMT = 0 , l_TRANS_AMT = 0, l_BOOKS_AMT = 0, l_COST_AMOUNT = 0;
//                 //----------
//                 let date_ob = new Date();
//                 // adjust 0 before single digit date
//                 let date = ("0" + date_ob.getDate()).slice(-2);
//                 let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
//                 let year = date_ob.getFullYear();

//                 worksheet.getCell('A1').value = dtMaster[0].PARTNER_LNAME;
//                 worksheet.getCell('A2').value = "Print date :" + date +"-"+ month +"-"+ year; 
//                 worksheet.duplicateRow(pos, dtDetail.length-1, true);
//                 for (let i = 0; i < dtDetail.length; i++) {

//                     let row = worksheet.getRow(pos + i);

//                     row.getCell(1).value  = dtDetail[i].SEQ;
//                     row.getCell(2).value  = dtDetail[i].VOUCHERNO;
//                     row.getCell(3).value  = dtDetail[i].TR_DATE;
//                     row.getCell(4).value  = dtDetail[i].FORM_NO;
//                     row.getCell(5).value  = dtDetail[i].SERIAL_NO;
//                     row.getCell(6).value  = dtDetail[i].INVOICE_DATE;
//                     row.getCell(7).value  = dtDetail[i].INVOICE_NO;
//                     row.getCell(8).value  = dtDetail[i].EI_STATUS;
//                     row.getCell(9).value  = dtDetail[i].INVOICE_TYPE;    
//                     row.getCell(10).value = dtDetail[i].PARTNER_ID;
//                     row.getCell(11).value = dtDetail[i].PARTNER_NAME;
//                     row.getCell(12).value = dtDetail[i].REMARK;
//                     row.getCell(13).value = dtDetail[i].ACCD_DR;
//                     row.getCell(14).value = dtDetail[i].ACCD_CR1;
//                     row.getCell(15).value = dtDetail[i].ACCD_CR2;
//                     row.getCell(16).value = dtDetail[i].ITEM_CODE;  
//                     row.getCell(17).value = dtDetail[i].ITEM_NAME;
//                     row.getCell(18).value = dtDetail[i].ITEM_UOM;  
//                     row.getCell(19).value = dtDetail[i].QTY;
//                     row.getCell(20).value = dtDetail[i].U_PRICE;
//                     row.getCell(21).value = dtDetail[i].NET_TR_AMT;
//                     row.getCell(22).value = dtDetail[i].TR_RATE;
//                     row.getCell(23).value = dtDetail[i].NET_BK_AMT;
//                     row.getCell(24).value = dtDetail[i].VAT_RATE;
//                     row.getCell(25).value = dtDetail[i].VAT_TR_AMT;
//                     row.getCell(26).value = dtDetail[i].VAT_BK_AMT;
//                     row.getCell(27).value = dtDetail[i].TRANS_AMT;
//                     row.getCell(28).value = dtDetail[i].BOOKS_AMT;

//                     row.getCell(29).value = dtDetail[i].ORDER_NO;
//                     row.getCell(30).value = dtDetail[i].DECLARE_NO;
//                     row.getCell(31).value = dtDetail[i].BIZPLACE;
                    
//                     row.getCell(32).value = "";
//                     row.getCell(33).value = dtDetail[i].FORM_NO_REF;
//                     row.getCell(34).value = dtDetail[i].SERIAL_NO_REF;
//                     row.getCell(35).value = dtDetail[i].INVOICE_DT_REF;
//                     row.getCell(36).value = dtDetail[i].INVOICE_NO_REF;
//                     row.getCell(37).value = dtDetail[i].ADJUST_TYPE;

//                     row.getCell(38).value = dtDetail[i].PARTNER_NAME_VAT;
//                     row.getCell(39).value = dtDetail[i].GROUP_NAME;
//                     row.getCell(40).value = dtDetail[i].BUYER_NAME;
                   
//                     row.getCell(41).value = dtDetail[i].PO_NO;
//                     row.getCell(42).value = dtDetail[i].SEQ_IMPORT_SO;
//                     row.getCell(43).value = dtDetail[i].SLIP_TYPE;
//                     row.getCell(44).value = dtDetail[i].GIFT_YN;
//                     row.getCell(45).value = dtDetail[i].PL_CD;
//                     row.getCell(46).value = dtDetail[i].PL_NM;
//                     row.getCell(47).value = dtDetail[i].WH_ID;
//                     row.getCell(48).value = dtDetail[i].WH_NAME;
//                     row.getCell(49).value = dtDetail[i].AC_CD_WH;
//                     row.getCell(50).value = dtDetail[i].AC_NM_WH;
//                     row.getCell(51).value = dtDetail[i].AC_CD_COST;
//                     row.getCell(52).value = dtDetail[i].AC_NM_COST;

//                     row.getCell(53).value = dtDetail[i].COST_AMOUNT;
//                     row.getCell(54).value = dtDetail[i].CI_DATE; 
//                     row.getCell(55).value = dtDetail[i].CI_INV;
//                     row.getCell(56).value = dtDetail[i].DECLARE_DT;
//                     row.getCell(57).value = dtDetail[i].DECL_NO;
//                     row.getCell(58).value = dtDetail[i].ATTRIBUTE2;
                  
                   
                    
//                     l_NET_TR_AMT = l_NET_TR_AMT  + dtDetail[i].NET_TR_AMT;
//                     l_NET_BK_AMT = l_NET_BK_AMT  + dtDetail[i].NET_BK_AMT;
//                     l_VAT_TR_AMT = l_VAT_TR_AMT  + dtDetail[i].VAT_TR_AMT; 
//                     l_VAT_BK_AMT = l_VAT_BK_AMT  + dtDetail[i].VAT_BK_AMT;  
//                     l_TRANS_AMT = l_TRANS_AMT + dtDetail[i].TRANS_AMT;
//                     l_BOOKS_AMT = l_BOOKS_AMT + dtDetail[i].BOOKS_AMT;  
//                     l_COST_AMOUNT = l_COST_AMOUNT + dtDetail[i].COST_AMOUNT;  

//                     row.commit();
//                 }
      
//                 let row = worksheet.getRow(pos + dtDetail.length);

//                 row.getCell(21).value = l_NET_TR_AMT;
//                 row.getCell(23).value = l_NET_BK_AMT;
//                 row.getCell(25).value = l_VAT_TR_AMT;
//                 row.getCell(26).value = l_VAT_BK_AMT;  
//                 row.getCell(27).value = l_TRANS_AMT;
//                 row.getCell(28).value = l_BOOKS_AMT;    
//                 row.getCell(53).value = l_COST_AMOUNT;    
                
//                 row.commit();
                      
//                 await workbook.xlsx.writeFile(reportFile)
//                 return response.attachment(
//                     reportFile,
//                     `rpt6060040_${user.USER_ID}.xlsx` // custom name
//                 )
//             }
//         } catch (e) {
//             Utils.Logger({ LVL: "error", MODULE: "6060040", FUNC: "6060040", CONTENT: e.message })
//             return response.send(null)
//         }
//     }

// }

// module.exports = rpt6060030;