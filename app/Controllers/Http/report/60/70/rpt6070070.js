"use strict";

const { DATE } = require("oracledb");

const Helpers       = use('Helpers')
const Antl          = use("Antl");
const Utils         = use("Utils");
const DBService = use("DBService")
var Excel           = use('exceljs');
var workbook        = new Excel.Workbook();
class rpt6070070 {
/*########################################################## Report JH ##################################################################################*/ 
    async rpt_6070070_1({ request, response, auth }) {
        try 
        { 
            /* P_RPT_ID: report_info.VAL1, P_RPT_URL: report_info.VAL2, P_RPT_FILE: report_info.VAL4,
                P_COMP_ID: company_info.PARTNER_ID, P_COMP_NM: company_info.TEXT, P_COMP_TAX: company_info.TAX_CODE, P_COMP_ADD: company_info.ADDR1,
                P_COMPANY: this.sel_Company, P_ASSET_NM: this.txt_Asset_NM, P_ASSET_TYPE: this.sel_Assettype
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
            var _store          = "AC_RPT_6070070_1";
            var _param          = [item.P_COMPANY, item.P_ASSET_NM, item.P_ASSET_TYPE]
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
                /****************Call DICTIONARY******************/
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
                /*var title_a4 = "";
                var FromDate = item.P_FR_DATE;
                var ToDate = item.P_FR_TO;
                var strFrDate = FromDate.substr(6,2) + "/"+ FromDate.substr(4,2)+ "/"+ FromDate.substr(0,4);
                var strToDate = ToDate.substr(6,2) + "/"+ ToDate.substr(4,2)+ "/"+ ToDate.substr(0,4);
                var _bookccy = item.P_BOOK_CCY;*/
                var pos = 9; 
                var COST_FAMT  	= 0;
                var COST_AMT    = 0;
                var BEGIN_FAMT  = 0;
                var BEGIN_FAMT  = 0;
                var FA_FAMT     = 0;
                var FA_AMT      = 0;
                var DEPR_FAMT   = 0;
                var DEPR_AMT    = 0;
                var ACCUM_FAMT  = 0;
                var ACCUM_AMT   = 0;
                var REMAIN_FAMT = 0;
                var REMAIN_AMT  = 0;

                if(dt_Data.length>1)
                {
                    worksheet.duplicateRow(pos,dt_Data.length-1,true);
                }  
                for (var i = 0; i < dt_Data.length; i++) 
                {
                    var row_item = worksheet.getRow(pos);
                    row_item.getCell(1).value    = dt_Data[i].ROWNUM
                    row_item.getCell(2).value    = dt_Data[i].FA_CD
                    row_item.getCell(3).value    = dt_Data[i].ASSET
                    row_item.getCell(4).value    = dt_Data[i].INSTRUMENT
                    row_item.getCell(5).value    = dt_Data[i].FA_NM
                    row_item.getCell(6).value    = dt_Data[i].FA_LNM
                    row_item.getCell(7).value    = dt_Data[i].FA_KNM
                    row_item.getCell(8).value    = dt_Data[i].AC_CD
                    row_item.getCell(9).value    = dt_Data[i].AC_NM
                    row_item.getCell(10).value   = dt_Data[i].AC_CD_DEPR
                    row_item.getCell(11).value   = dt_Data[i].AC_NM_DEPR
                    row_item.getCell(12).value   = dt_Data[i].AC_CD_EXP
                    row_item.getCell(13).value   = dt_Data[i].AC_NM_EXP
                    row_item.getCell(14).value   = dt_Data[i].PL_CD
                    row_item.getCell(15).value   = dt_Data[i].PL_NM
                    row_item.getCell(16).value   = dt_Data[i].PLC_CD
                    row_item.getCell(17).value   = dt_Data[i].PLC_NM
                    row_item.getCell(18).value   = dt_Data[i].FA_KIND_CD
                    row_item.getCell(19).value   = dt_Data[i].ORG_ID
                    row_item.getCell(20).value   = dt_Data[i].CHARGER
                    row_item.getCell(21).value   = dt_Data[i].FA_DEPR_METH
                    row_item.getCell(22).value   = dt_Data[i].FA_DEPR_RATE
                    row_item.getCell(23).value   = dt_Data[i].FA_USE_DATE
                    row_item.getCell(24).value   = dt_Data[i].FA_DEPR_DATE
                    row_item.getCell(25).value   = dt_Data[i].FA_DEPR_YYYY
                    row_item.getCell(26).value   = dt_Data[i].FA_DEPR_YY
                    row_item.getCell(27).value   = dt_Data[i].FA_DEPR_MM
                    row_item.getCell(28).value   = dt_Data[i].DAY_DEPR
                    row_item.getCell(29).value   = dt_Data[i].CCY
                    row_item.getCell(30).value   = dt_Data[i].FA_FCOST
                    row_item.getCell(31).value   = dt_Data[i].FA_COST
                    row_item.getCell(32).value   = dt_Data[i].FA_BEGIN_DEPR_FAMT
                    row_item.getCell(33).value   = dt_Data[i].FA_BEGIN_DEPR_AMT
                    row_item.getCell(34).value   = dt_Data[i].FA_DEPR_FAMT
                    row_item.getCell(35).value   = dt_Data[i].FA_DEPR_AMT
                    row_item.getCell(36).value   = dt_Data[i].DEPR_FAMT_DD
                    row_item.getCell(37).value   = dt_Data[i].DEPR_AMT_DD
                    row_item.getCell(38).value   = dt_Data[i].ACCUM_FAMT
                    row_item.getCell(39).value   = dt_Data[i].ACCUM_AMT
                    row_item.getCell(40).value   = dt_Data[i].REMAIN_FAMT
                    row_item.getCell(41).value   = dt_Data[i].REMAIN_AMT
                    row_item.getCell(42).value   = dt_Data[i].FA_STATUS
                    row_item.getCell(43).value   = dt_Data[i].MADE_YEAR
                    row_item.getCell(44).value   = dt_Data[i].INV_DATE
                    row_item.getCell(45).value   = dt_Data[i].INV_NO
                    row_item.getCell(46).value   = dt_Data[i].SERIAL_NO
                    row_item.getCell(47).value   = dt_Data[i].VOUCHER_NO
                    row_item.getCell(48).value   = dt_Data[i].UNIT_PRICE
                    row_item.getCell(49).value   = dt_Data[i].FA_BUY_AMT
                    row_item.getCell(50).value   = dt_Data[i].ORIGIN
                    row_item.getCell(51).value   = dt_Data[i].FA_QTY
                    row_item.getCell(52).value   = dt_Data[i].CAPACITY
                    row_item.getCell(53).value   = dt_Data[i].ENGINE
                    row_item.getCell(54).value   = dt_Data[i].REMARK
                    row_item.getCell(55).value   = dt_Data[i].REMARK2
                    row_item.getCell(56).value   = dt_Data[i].DAY_REMAIN
                    row_item.getCell(57).value   = dt_Data[i].DEPRECIATED_ENDDATE
                    pos = pos + 1; 
                    COST_FAMT   += dt_Data[i].FA_FCOST
                    COST_AMT    += dt_Data[i].FA_COST
                    BEGIN_FAMT  += dt_Data[i].FA_BEGIN_DEPR_FAMT
                    BEGIN_FAMT  += dt_Data[i].FA_BEGIN_DEPR_AMT
                    FA_FAMT     += dt_Data[i].FA_DEPR_FAMT
                    FA_AMT      += dt_Data[i].FA_DEPR_AMT
                    DEPR_FAMT   += dt_Data[i].DEPR_FAMT_DD
                    DEPR_AMT    += dt_Data[i].DEPR_AMT_DD
                    ACCUM_FAMT  += dt_Data[i].ACCUM_FAMT
                    ACCUM_AMT   += dt_Data[i].ACCUM_AMT
                    REMAIN_FAMT += dt_Data[i].REMAIN_FAMT
                    REMAIN_AMT  += dt_Data[i].REMAIN_AMT
                    //row_item.commit();

                }  
                var row = worksheet.getRow(pos);
                worksheet.mergeCells(pos,1,pos,28); 
                row.getCell(1).value = "Total Arising" 
                row.getCell(30).value  = COST_FAMT  ; 
                row.getCell(31).value  = COST_AMT   ; 
                row.getCell(32).value  = BEGIN_FAMT ; 
                row.getCell(33).value  = BEGIN_FAMT ; 
                row.getCell(34).value  = FA_FAMT    ; 
                row.getCell(35).value  = FA_AMT     ; 
                row.getCell(36).value  = DEPR_FAMT  ; 
                row.getCell(37).value  = DEPR_AMT   ; 
                row.getCell(38).value  = ACCUM_FAMT ; 
                row.getCell(39).value  = ACCUM_AMT  ; 
                row.getCell(40).value  = REMAIN_FAMT; 
                row.getCell(41).value  = REMAIN_AMT ;
                /********* Print file excel ********/
                const reportFile    = Helpers.tmpPath(file_new);
                await workbook.xlsx.writeFile(reportFile)
                return response.attachment( reportFile, file_new);
            }
        } 
        catch (e) 
        {
            Utils.Logger({ LVL: "error", MODULE: "Report", FUNC: "rpt_6070070_1", CONTENT: e.message })
        // return response.send(Utils.response(false, e.message, null))
        return response.send(null);
        }
    }  
}

module.exports = rpt6070070;