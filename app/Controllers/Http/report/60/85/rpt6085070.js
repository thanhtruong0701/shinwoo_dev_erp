"use strict";

const { DATE } = require("oracledb");

const Helpers       = use('Helpers')
const Antl          = use("Antl");
const Utils         = use("Utils");
const DBService = use("DBService")
var Excel           = use('exceljs');
var workbook        = new Excel.Workbook();
class rpt6085070 {
/*########################################################## Report JH ##################################################################################*/ 
        async rpt_6085070_AS_FORM({ request, response, auth }) {
            try 
            { 
            /* P_RPT_ID: report_info.VAL1, P_RPT_URL: report_info.VAL2, P_RPT_FILE: report_info.VAL3,
                P_COMP_ID: company_info.PARTNER_ID, P_COMP_NM: company_info.TEXT, P_COMP_TAX: company_info.TAX_CODE, P_COMP_ADD: company_info.ADDR1,
                P_COMPANY: this.selectedCompany,P_ACC_PK: this.TAC_ABACCTCODE_PK, P_FR_MONTH: this.period_from, P_TO_MONTH: this.period_to, 
                P_ITEM_CODE: this.txtItemCode, P_ABPL_PK: this.TAC_ABPL_PK,
                P_WH : this.selectedWH, P_LANG : this.selectedLanguage
                */
                /****************************** Get Param *********************************/
                let { para }        = request.get(['para']);
                /********* Parse pram to json ********/
                var item            = JSON.parse(para); 
                const user          = await auth.getUser() ;
                var COMP_ID         = item.P_COMP_ID, COMP_NM = item.P_COMP_NM, COMP_TAX = item.P_COMP_TAX, COMP_ADD = item.P_COMP_ADD;
                const p_crt_by      = user.USER_ID;
                const p_language    = request.header("accept-language", "ENG");
                var file_nm         = [item.P_RPT_FILE];
                var file_type       = ".xlsx";
                var full_nm         = file_nm + file_type;
                var file_new        = file_nm + p_crt_by + file_type;
                var _resourcesPath  = [item.P_RPT_URL]+'/'+full_nm;
                var _store          = "AC_RPT_6085070_INOUT";
                var _circular       = "AC_SEL_GET_TT_BPL";
              //  var _param          = [item.P_COMPANY, item.P_FR_DATE, item.P_FR_TO]
               var _param           = [item.P_COMPANY,item.P_TCO_BUSPLACE_PK, item.P_FR_MONTH, item.P_TO_MONTH, item.P_ABPL_PK, item.P_ITEM_CODE, item.P_ACC_PK, item.P_WH];
                var _param_TT       = [item.P_CIRCULARS, item.P_TCO_BUSPLACE_PK];
                var _ac_code        = "EACAB031";
                var _store_sign     = "ac_rpt_6045085_sign";
                var _param_sign     = [item.P_COMPANY,_ac_code];

                var v_no_title = "Mẫu số : S03a-DN ", e_no_title = "Form No : S03a-DN" , k_no_title = "양식번호 : S03a-DN";
                var v_dvt = " Đơn vị tính", e_dvt = " Unit", k_dvt = " 단위";
                //var v_fdate = "Từ ngày ", e_fdate = "From ", k_fdate ="부터 ", v_tdate = " đến ngày", e_tdate = " to", k_tdate =" 까지";
                //var v_month = " Tháng này", e_month = " This month", k_month = " 이번 달"; 
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
                        dt_Data = dt_Data;
                        //return response.send(Utils.response(false, "no_data_found", null))
                    } 
                    /********* Call store sign ***************/ 
                    var dt_Data_sign  = await DBService.callProcCursor(_store_sign, _param_sign, p_language, p_crt_by); 
                    if (dt_Data_sign) 
                    {
                        dt_Data_sign = dt_Data_sign;
                    } 
                    /****************Call CIRCULARS******************/
                   /* var dt_TT  = await DBService.callProcCursor(_circular, _param_TT , p_language , p_crt_by); 
                    if (dt_TT.length>0) 
                    {
                        dt_TT = dt_TT;
                    } 
                    else 
                    {
                        return response.send(Utils.response(false, "no_data_found", null))
                    } */
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
                    r_item.getCell(1).value = Utils.translate("COMPANY",_dictionary , p_language) + ": " + COMP_ID +" - "+COMP_NM;    
                    r_item = worksheet.getRow(2);
                    r_item.getCell(1).value = Utils.translate("TAX_CODE",_dictionary, p_language) + ": "+ COMP_TAX;   
                    r_item = worksheet.getRow(3);
                    r_item.getCell(1).value = Utils.translate("ADDRESS",_dictionary , p_language) + ": "+ COMP_ADD;
                    var title_a4 = "";
                    var FromMonth = item.P_FR_MONTH;
                    var ToMonth = item.P_TO_MONTH;
                    var strFrMonth =  FromMonth.substr(4,2)+ "/"+ FromMonth.substr(0,4);
                    var strToMonth =  ToMonth.substr(4,2)+ "/"+ ToMonth.substr(0,4);
                    //var _bookccy = item.P_BOOK_CCY;
                    //worksheet.getCell("K6").value = _bookccy;
                    worksheet.getCell("A6").value = "Period from " + strFrMonth + " To " + strToMonth;
                    var pos = 9; 
                    //Insert row
                    Utils.excelInsertRows(worksheet, pos, dt_Data.length-1);
                    for (var i = 0; i < dt_Data.length; i++) 
                    {
                        var row_item = worksheet.getRow(pos);
                        if(dt_Data[i].NULL == undefined && dt_Data[i].AC_CD == undefined){
                            row_item.getCell(1).value   =  "Grand Total";
                            row_item.getCell(1).font  = { italic: true, bold: true, color: {argb:'000a08'} };
                            for(let j = 1; j<=17; j++)
                            {
                                row_item.getCell(j).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "d9d9d9" } };   
                                row_item.getCell(j).font  = { italic: false, bold: true, color: {argb:'000000'} };         
                            }
                        }
                        else{
                            row_item.getCell(1).value   =  dt_Data[i].NULL;
                        }
                        if(dt_Data[i].AC_CD != undefined && dt_Data[i].AC_NM == undefined){
                            row_item.getCell(2).value   =  "Account Code" + " " + dt_Data[i].AC_CD;
                            row_item.getCell(2).font  = { italic: true, bold: true, color: {argb:'000a08'} };
                            for(let j = 1; j<=17; j++)
                            {
                                row_item.getCell(j).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "A7FFEE" } };      
                                row_item.getCell(j).font  = { italic: false, bold: true, color: {argb:'000000'} };    
                            }
                        }
                        else{
                            row_item.getCell(2).value   =  dt_Data[i].AC_CD;
                        }
                        row_item.getCell(3).value   = dt_Data[i].AC_NM;
                        row_item.getCell(4).value   = dt_Data[i].ITEM_CODE;
                        row_item.getCell(5).value   = dt_Data[i].ITEM_NAME;
                        row_item.getCell(6).value   = dt_Data[i].UOM;
                        row_item.getCell(7).value   = dt_Data[i].WH_NAME;
                        row_item.getCell(8).value   = dt_Data[i].PL_CD;
                        row_item.getCell(9).value   = dt_Data[i].PL_NM;
                        row_item.getCell(10).value  = dt_Data[i].LAST_QTY;
                        row_item.getCell(11).value  = dt_Data[i].LAST_AMT;
                        row_item.getCell(12).value  = dt_Data[i].INPUT_QTY;
                        row_item.getCell(13).value  = dt_Data[i].INPUT_AMT;
                        row_item.getCell(14).value  = dt_Data[i].OUTPUT_QTY;
                        row_item.getCell(15).value  = dt_Data[i].OUTPUT_AMT;
                        row_item.getCell(16).value  = dt_Data[i].THIS_QTYBAL;
                        row_item.getCell(17).value  = dt_Data[i].THIS_AMTBAL;
                        pos = pos + 1; 
                        //row_item.commit();

                    }  
                    /********* Print file excel ********/
                    const reportFile    = Helpers.tmpPath(file_new);
                    await workbook.xlsx.writeFile(reportFile)
                    return response.attachment( reportFile, file_new);
                }
            } 
            catch (e) 
            {
                Utils.Logger({ LVL: "error", MODULE: "Report", FUNC: "rpt_6085070_AS_FORM", CONTENT: e.message })
            // return response.send(Utils.response(false, e.message, null))
            return response.send(null);
            }
        }    
}

module.exports = rpt6085070;