"use strict";

const { DATE } = require("oracledb");

const Helpers       = use('Helpers')
const Antl          = use("Antl");
const Utils         = use("Utils");
const DBService = use("DBService")
var Excel           = use('exceljs');
var workbook        = new Excel.Workbook();
class rpt6085060 {
/*########################################################## Report JH ##################################################################################*/ 
    async rpt_6085060_IOB_UNIT({ request, response, auth }) {
        try 
        { 
        /* P_TAB : 'IOB',P_RPT_ID: report_info.VAL1, P_RPT_URL: report_info.VAL2, P_RPT_FILE: report_info.VAL3, 
            P_COMP_ID: company_info.PARTNER_ID, P_COMP_NM: company_info.TEXT, P_COMP_TAX: company_info.TAX_CODE, P_COMP_ADD: company_info.ADDR1, 
            P_COMPANY: this.selectedCompany, P_FR_MONTH: this.Month_fr, P_TO_MONTH: this.Month_to, P_Item_PK: this.txtItem_PK, P_Item_CD: this.txtItem_CD, P_Item_NM: this.txtItem_NM,  
            P_ACCOUNT_PK: this.txtAccount_PK,  P_ACCOUNT_CD: this.txtAccount_CD, P_ACCOUNT_NM: this.txtAccount_NM, P_LSTWAREHOUSE: this.lstWareHouse,  P_PL_PK: this.txtPL_PK, P_N : 'N',  P_NULL : '',  
            P_TCO_BUSPLACE_PK: this.lstBizPlace, P_BIZ_ID: BizPlace_info.NAME, P_BIZ_NM: BizPlace_info.LOC_NM, P_BIZ_TAX: BizPlace_info.TAX_CD, P_BIZ_ADD: BizPlace_info.ADDR_NM1
            */
            /****************************** Get Param *********************************/
            let { para }        = request.get(['para']);
            /********* Parse pram to json ********/
            var item            = JSON.parse(para); 
            const user          = await auth.getUser() ;
            var COMP_ID         = item.P_COMP_ID, COMP_NM = item.P_COMP_NM, COMP_TAX = item.P_COMP_TAX, COMP_ADD = item.P_COMP_ADD;
            var BIZ_ID         = item.P_BIZ_ID , BIZ_NM  = item.P_BIZ_NM , BIZ_TAX  = item.P_BIZ_TAX , BIZ_ADD  = item.P_BIZ_ADD;
            const p_crt_by      = user.USER_ID;
            const p_language    = request.header("accept-language", "ENG");
            var file_nm         = [item.P_RPT_FILE];
            var file_type       = ".xlsx";
            var full_nm         = file_nm + file_type;
            var file_new        = file_nm + p_crt_by + file_type;
            var _resourcesPath  = [item.P_RPT_URL]+'/'+full_nm;
            var _store          = "SP_SEL_6085060_IOB";
            var _circular       = "AC_SEL_GET_TT_BPL";
            var _param           = [item.P_COMPANY, item.P_FR_MONTH, item.P_TO_MONTH, item.P_Item_PK, item.P_Item_CD, item.P_Item_NM, item.P_ACCOUNT_PK, item.P_ACCOUNT_CD, item.P_ACCOUNT_NM, item.P_LSTWAREHOUSE, item.P_PL_PK, item.P_N, item.P_NULL, item.P_TCO_BUSPLACE_PK, item.P_BIZ_CENTER];
            var _param_TT       = [item.P_CIRCULARS, item.P_TCO_BUSPLACE_PK];
            var _ac_code        = "EACAB031";
            var _store_sign     = "ac_rpt_6045085_sign";
            var _param_sign     = [item.P_COMPANY,_ac_code];
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
                //INFOMATION COMPANY
                worksheet.getCell("A1").value = Utils.translate("COMPANY",_dictionary , p_language) + ": " + BIZ_ID +" - "+ BIZ_NM;
                worksheet.getCell("A2").value = Utils.translate("ADDRESS",_dictionary , p_language) + ": "+ BIZ_ADD;
                worksheet.getCell("A3").value = Utils.translate("TAX_CODE",_dictionary, p_language) + ": "+ BIZ_TAX;
                var title_a4 = "";
                var FromMonth = item.P_FR_MONTH;
                var ToMonth = item.P_TO_MONTH;
                var strFrMonth =  FromMonth.substr(4,2)+ "/"+ FromMonth.substr(0,4);
                var strToMonth =  ToMonth.substr(4,2)+ "/"+ ToMonth.substr(0,4);
                worksheet.getCell("A6").value = "Period from " + strFrMonth + " To " + strToMonth;
                //worksheet.getCell("J6").value = e_dvt;
                let date_ob = new Date();
                // adjust 0 before single digit date
                let date = ("0" + date_ob.getDate()).slice(-2);
                let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
                let year = date_ob.getFullYear();
                worksheet.getCell('G1').value = "Print date : " + date +"-"+ month +"-"+ year; 
                var pos = 9; 
                var total_last_qty      = 0;
                var total_last_unit     = 0;
                var total_last_amt      = 0;
                var total_input_qty     = 0;
                var total_input_unit    = 0;
                var total_input_amt     = 0;
                var total_output_qty    = 0;
                var total_output_unit    = 0;
                var total_output_amt    = 0;
                var total_end_qty       = 0;
                var total_end_unit      = 0;
                var total_end_amt       = 0;
                

                if(dt_Data.length>1)
                {
                    worksheet.duplicateRow(pos,dt_Data.length-1,true);
                }  
                for (var i = 0; i < dt_Data.length; i++) 
                {
                    var row_item = worksheet.getRow(pos);
                    row_item.getCell(1).value    = dt_Data[i].ROW_NUMBER
                    row_item.getCell(2).value    = dt_Data[i].AC_CD
                    row_item.getCell(3).value    = dt_Data[i].AC_NM
                    row_item.getCell(4).value    = dt_Data[i].ITEM_CODE
                    row_item.getCell(5).value    = dt_Data[i].ITEM_NAME
                    row_item.getCell(6).value    = dt_Data[i].UOM
                    row_item.getCell(7).value    = dt_Data[i].WH_NAME
                    row_item.getCell(8).value    = dt_Data[i].PL_CD
                    row_item.getCell(9).value    = dt_Data[i].PL_NM
                    row_item.getCell(10).value   = dt_Data[i].LAST_QTY
                    row_item.getCell(11).value   = dt_Data[i].LAST_UNIT
                    row_item.getCell(12).value   = dt_Data[i].LAST_AMT
                    row_item.getCell(13).value   = dt_Data[i].INPUT_QTY
                    row_item.getCell(14).value   = dt_Data[i].INPUT_UNIT
                    row_item.getCell(15).value   = dt_Data[i].IN_AMT
                    row_item.getCell(16).value   = dt_Data[i].OUTPUT_QTY
                    row_item.getCell(17).value   = dt_Data[i].OUTPUT_UNIT
                    row_item.getCell(18).value   = dt_Data[i].OUTPUT_AMT
                    row_item.getCell(19).value   = dt_Data[i].END_QTY
                    row_item.getCell(20).value   = dt_Data[i].END_UNIT
                    row_item.getCell(21).value   = dt_Data[i].END_AMT
                    pos = pos + 1; 

                    total_last_qty      += Number(dt_Data[i].LAST_QTY);
                    total_last_unit     += Number(dt_Data[i].LAST_UNIT);
                    total_last_amt      += Number(dt_Data[i].LAST_AMT);
                    total_input_qty     += Number(dt_Data[i].INPUT_QTY);
                    total_input_unit    += Number(dt_Data[i].INPUT_UNIT);
                    total_input_amt     += Number(dt_Data[i].IN_AMT);
                    total_output_qty    += Number(dt_Data[i].OUTPUT_QTY);
                    total_output_unit   += Number(dt_Data[i].OUTPUT_UNIT);
                    total_output_amt    += Number(dt_Data[i].OUTPUT_AMT);
                    total_end_qty       += Number(dt_Data[i].END_QTY);
                    total_end_unit      += Number(dt_Data[i].END_UNIT);
                    total_end_amt       += Number(dt_Data[i].END_AMT);

                    //row_item.commit();

                }  
                var row = worksheet.getRow(pos);
                worksheet.mergeCells(pos,1,pos,9); 
                row.getCell(1).value = "Total Arising" 
                row.getCell(10).value    = total_last_qty ;
                row.getCell(11).value    = total_last_unit;
                row.getCell(12).value    = total_last_amt;
                row.getCell(13).value   = total_input_qty;
                row.getCell(14).value   = total_input_unit;
                row.getCell(15).value   = total_input_amt;
                row.getCell(16).value   = total_output_qty ;
                row.getCell(17).value   = total_output_unit ;
                row.getCell(18).value   = total_output_amt ;
                row.getCell(19).value   = total_end_qty;
                row.getCell(20).value   = total_end_unit;
                row.getCell(21).value   = total_end_amt;
                /********* Print file excel ********/
                const reportFile    = Helpers.tmpPath(file_new);
                await workbook.xlsx.writeFile(reportFile)
                return response.attachment( reportFile, file_new);
            }
        } 
        catch (e) 
        {
            Utils.Logger({ LVL: "error", MODULE: "Report", FUNC: "rpt_6085060_IOB_UNIT", CONTENT: e.message })
        // return response.send(Utils.response(false, e.message, null))
        return response.send(null);
        }
    }  
    async rpt_6085060_IOB({ request, response, auth }) {
        try 
        { 
        /* P_TAB : 'IOB',P_RPT_ID: report_info.VAL1, P_RPT_URL: report_info.VAL2, P_RPT_FILE: report_info.VAL3, 
            P_COMP_ID: company_info.PARTNER_ID, P_COMP_NM: company_info.TEXT, P_COMP_TAX: company_info.TAX_CODE, P_COMP_ADD: company_info.ADDR1, 
            P_COMPANY: this.selectedCompany, P_FR_MONTH: this.Month_fr, P_TO_MONTH: this.Month_to, P_Item_PK: this.txtItem_PK, P_Item_CD: this.txtItem_CD, P_Item_NM: this.txtItem_NM,  
            P_ACCOUNT_PK: this.txtAccount_PK,  P_ACCOUNT_CD: this.txtAccount_CD, P_ACCOUNT_NM: this.txtAccount_NM, P_LSTWAREHOUSE: this.lstWareHouse,  P_PL_PK: this.txtPL_PK, P_N : 'N',  P_NULL : '',  
            P_TCO_BUSPLACE_PK: this.lstBizPlace, P_BIZ_ID: BizPlace_info.NAME, P_BIZ_NM: BizPlace_info.LOC_NM, P_BIZ_TAX: BizPlace_info.TAX_CD, P_BIZ_ADD: BizPlace_info.ADDR_NM1
            */
            /****************************** Get Param *********************************/
            let { para }        = request.get(['para']);
            /********* Parse pram to json ********/
            var item            = JSON.parse(para); 
            const user          = await auth.getUser() ;
            var COMP_ID         = item.P_COMP_ID, COMP_NM = item.P_COMP_NM, COMP_TAX = item.P_COMP_TAX, COMP_ADD = item.P_COMP_ADD;
            var BIZ_ID         = item.P_BIZ_ID , BIZ_NM  = item.P_BIZ_NM , BIZ_TAX  = item.P_BIZ_TAX , BIZ_ADD  = item.P_BIZ_ADD;
            const p_crt_by      = user.USER_ID;
            const p_language    = request.header("accept-language", "ENG");
            var file_nm         = [item.P_RPT_FILE];
            var file_type       = ".xlsx";
            var full_nm         = file_nm + file_type;
            var file_new        = file_nm + p_crt_by + file_type;
            var _resourcesPath  = [item.P_RPT_URL]+'/'+full_nm;
            var _store          = "SP_SEL_6085060_IOB";
            var _circular       = "AC_SEL_GET_TT_BPL";
            var _param           = [item.P_COMPANY, item.P_FR_MONTH, item.P_TO_MONTH, item.P_Item_PK, item.P_Item_CD, item.P_Item_NM, item.P_ACCOUNT_PK, item.P_ACCOUNT_CD, item.P_ACCOUNT_NM, item.P_LSTWAREHOUSE, item.P_PL_PK, item.P_N, item.P_NULL, item.P_TCO_BUSPLACE_PK, item.P_BIZ_CENTER];
            var _param_TT       = [item.P_CIRCULARS, item.P_TCO_BUSPLACE_PK];
            var _ac_code        = "EACAB031";
            var _store_sign     = "ac_rpt_6045085_sign";
            var _param_sign     = [item.P_COMPANY,_ac_code];
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
                //INFOMATION COMPANY
                worksheet.getCell("A1").value = Utils.translate("COMPANY",_dictionary , p_language) + ": " + BIZ_ID +" - "+ BIZ_NM;
                worksheet.getCell("A2").value = Utils.translate("ADDRESS",_dictionary , p_language) + ": "+ BIZ_ADD;
                worksheet.getCell("A3").value = Utils.translate("TAX_CODE",_dictionary, p_language) + ": "+ BIZ_TAX;
                var title_a4 = "";
                var FromMonth = item.P_FR_MONTH;
                var ToMonth = item.P_TO_MONTH;
                var strFrMonth =  FromMonth.substr(4,2)+ "/"+ FromMonth.substr(0,4);
                var strToMonth =  ToMonth.substr(4,2)+ "/"+ ToMonth.substr(0,4);
                worksheet.getCell("A6").value = "Period from " + strFrMonth + " To " + strToMonth;
                //worksheet.getCell("J6").value = e_dvt;
                let date_ob = new Date();
                // adjust 0 before single digit date
                let date = ("0" + date_ob.getDate()).slice(-2);
                let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
                let year = date_ob.getFullYear();
                worksheet.getCell('G1').value = "Print date : " + date +"-"+ month +"-"+ year; 
                var pos = 9; 
                var total_last_qty     = 0;
                var total_last_amt      = 0;
                var total_input_qty     = 0;
                var total_input_amt     = 0;
                var total_output_qty    = 0;
                var total_output_amt    = 0;
                var total_end_qty       = 0;
                var total_end_amt       = 0;

                if(dt_Data.length>1)
                {
                    worksheet.duplicateRow(pos,dt_Data.length-1,true);
                }  
                for (var i = 0; i < dt_Data.length; i++) 
                {
                    var row_item = worksheet.getRow(pos);
                    row_item.getCell(1).value    = dt_Data[i].ROW_NUMBER
                    row_item.getCell(2).value    = dt_Data[i].AC_CD
                    row_item.getCell(3).value    = dt_Data[i].AC_NM
                    row_item.getCell(4).value    = dt_Data[i].ITEM_CODE
                    row_item.getCell(5).value    = dt_Data[i].ITEM_NAME
                    row_item.getCell(6).value    = dt_Data[i].UOM
                    row_item.getCell(7).value    = dt_Data[i].WH_NAME
                    row_item.getCell(8).value    = dt_Data[i].PL_CD
                    row_item.getCell(9).value    = dt_Data[i].PL_NM
                    row_item.getCell(10).value   = dt_Data[i].LAST_QTY
                    row_item.getCell(11).value   = dt_Data[i].LAST_AMT
                    row_item.getCell(12).value   = dt_Data[i].INPUT_QTY
                    row_item.getCell(13).value   = dt_Data[i].IN_AMT
                    row_item.getCell(14).value   = dt_Data[i].OUTPUT_QTY
                    row_item.getCell(15).value   = dt_Data[i].OUTPUT_AMT
                    row_item.getCell(16).value   = dt_Data[i].END_QTY
                    row_item.getCell(17).value   = dt_Data[i].END_AMT
                    pos = pos + 1; 

                    total_last_qty      += Number(dt_Data[i].LAST_QTY);
                    total_last_amt      += Number(dt_Data[i].LAST_AMT);
                    total_input_qty     += Number(dt_Data[i].INPUT_QTY);
                    total_input_amt     += Number(dt_Data[i].IN_AMT);
                    total_output_qty    += Number(dt_Data[i].OUTPUT_QTY);
                    total_output_amt    += Number(dt_Data[i].OUTPUT_AMT);
                    total_end_qty       += Number(dt_Data[i].END_QTY);
                    total_end_amt       += Number(dt_Data[i].END_AMT);
                    //row_item.commit();

                }  
                var row = worksheet.getRow(pos);
                worksheet.mergeCells(pos,1,pos,9); 
                row.getCell(1).value = "Total Arising" 
                row.getCell(10).value    = total_last_qty ;
                row.getCell(11).value    = total_last_amt;
                row.getCell(12).value   = total_input_qty;
                row.getCell(13).value   = total_input_amt;
                row.getCell(14).value   = total_output_qty ;
                row.getCell(15).value   = total_output_amt ;
                row.getCell(16).value   = total_end_qty;
                row.getCell(17).value   = total_end_amt;
                /********* Print file excel ********/
                const reportFile    = Helpers.tmpPath(file_new);
                await workbook.xlsx.writeFile(reportFile)
                return response.attachment( reportFile, file_new);
            }
        } 
        catch (e) 
        {
            Utils.Logger({ LVL: "error", MODULE: "Report", FUNC: "rpt_6085060_IOB", CONTENT: e.message })
        // return response.send(Utils.response(false, e.message, null))
        return response.send(null);
        }
    }    
    async rpt_6085060_BAL({ request, response, auth }) {
        try 
        { 
        /* P_TAB : 'IOB',P_RPT_ID: report_info.VAL1, P_RPT_URL: report_info.VAL2, P_RPT_FILE: report_info.VAL3, 
            P_COMP_ID: company_info.PARTNER_ID, P_COMP_NM: company_info.TEXT, P_COMP_TAX: company_info.TAX_CODE, P_COMP_ADD: company_info.ADDR1, 
            P_COMPANY: this.selectedCompany, P_FR_MONTH: this.Month_fr, P_TO_MONTH: this.Month_to, P_Item_PK: this.txtItem_PK, P_Item_CD: this.txtItem_CD, P_Item_NM: this.txtItem_NM,  
            P_ACCOUNT_PK: this.txtAccount_PK,  P_ACCOUNT_CD: this.txtAccount_CD, P_ACCOUNT_NM: this.txtAccount_NM, P_LSTWAREHOUSE: this.lstWareHouse,  P_PL_PK: this.txtPL_PK, P_N : 'N',  P_NULL : '',  
            P_TCO_BUSPLACE_PK: this.lstBizPlace, P_BIZ_ID: BizPlace_info.NAME, P_BIZ_NM: BizPlace_info.LOC_NM, P_BIZ_TAX: BizPlace_info.TAX_CD, P_BIZ_ADD: BizPlace_info.ADDR_NM1
            */
            /****************************** Get Param *********************************/
            let { para }        = request.get(['para']);
            /********* Parse pram to json ********/
            var item            = JSON.parse(para); 
            const user          = await auth.getUser() ;
            var COMP_ID         = item.P_COMP_ID, COMP_NM = item.P_COMP_NM, COMP_TAX = item.P_COMP_TAX, COMP_ADD = item.P_COMP_ADD;
            var BIZ_ID         = item.P_BIZ_ID , BIZ_NM  = item.P_BIZ_NM , BIZ_TAX  = item.P_BIZ_TAX , BIZ_ADD  = item.P_BIZ_ADD;
            const p_crt_by      = user.USER_ID;
            const p_language    = request.header("accept-language", "ENG");
            var file_nm         = [item.P_RPT_FILE];
            var file_type       = ".xlsx";
            var full_nm         = file_nm + file_type;
            var file_new        = file_nm + p_crt_by + file_type;
            var _resourcesPath  = [item.P_RPT_URL]+'/'+full_nm;
            var _store          = "SP_SEL_6085060_BAL";
            var _circular       = "AC_SEL_GET_TT_BPL";
            var _param           = [item.P_COMPANY, item.P_FR_MONTH, item.P_TO_MONTH, item.P_Item_PK, item.P_Item_CD, item.P_Item_NM, item.P_ACCOUNT_PK, item.P_LSTWAREHOUSE, item.P_PL_PK, item.P_N, item.P_NULL, item.P_TCO_BUSPLACE_PK, item.P_BIZ_CENTER];
            var _param_TT       = [item.P_CIRCULARS, item.P_TCO_BUSPLACE_PK];
            var _ac_code        = "EACAB031";
            var _store_sign     = "ac_rpt_6045085_sign";
            var _param_sign     = [item.P_COMPANY,_ac_code];
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
                //INFOMATION COMPANY
                worksheet.getCell("A1").value = Utils.translate("COMPANY",_dictionary , p_language) + ": " + BIZ_ID +" - "+ BIZ_NM;
                worksheet.getCell("A2").value = Utils.translate("ADDRESS",_dictionary , p_language) + ": "+ BIZ_ADD;
                worksheet.getCell("A3").value = Utils.translate("TAX_CODE",_dictionary, p_language) + ": "+ BIZ_TAX;
                var title_a4 = "";
                var FromMonth = item.P_FR_MONTH;
                var ToMonth = item.P_TO_MONTH;
                var strFrMonth =  FromMonth.substr(4,2)+ "/"+ FromMonth.substr(0,4);
                var strToMonth =  ToMonth.substr(4,2)+ "/"+ ToMonth.substr(0,4);
                //var _bookccy = item.P_BOOK_CCY;
                //worksheet.getCell("K6").value = _bookccy;
                worksheet.getCell("A6").value = "Period from " + strFrMonth + " To " + strToMonth;
                //worksheet.getCell("J6").value = e_dvt;
                let date_ob = new Date();
                // adjust 0 before single digit date
                let date = ("0" + date_ob.getDate()).slice(-2);
                let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
                let year = date_ob.getFullYear();
                worksheet.getCell('O1').value = "Print date : " + date +"-"+ month +"-"+ year; 
                var pos = 9; 
                var total_end_qty        = 0;
                var total_end_unit       = 0;
                var total_end_famt       = 0;

                if(dt_Data.length>1)
                {
                    worksheet.duplicateRow(pos,dt_Data.length-1,true);
                }  
                for (var i = 0; i < dt_Data.length; i++) 
                {
                    var row_item = worksheet.getRow(pos);
                    row_item.getCell(1).value    = dt_Data[i].ROW_NUMBER
                    row_item.getCell(2).value    = dt_Data[i].AC_CD
                    row_item.getCell(3).value    = dt_Data[i].AC_NM
                    row_item.getCell(4).value    = dt_Data[i].ITEM_CODE
                    row_item.getCell(5).value    = dt_Data[i].ITEM_NAME
                    row_item.getCell(6).value    = dt_Data[i].WH_NAME
                    row_item.getCell(7).value    = dt_Data[i].PL_CD
                    row_item.getCell(8).value    = dt_Data[i].PL_NM
                    row_item.getCell(9).value    = dt_Data[i].END_QTY
                    row_item.getCell(10).value   = dt_Data[i].END_UNIT
                    row_item.getCell(11).value   = dt_Data[i].END_TRAMT
                    pos = pos + 1; 
                    total_end_qty        += Number(dt_Data[i].END_QTY);
                    total_end_unit       += Number(dt_Data[i].END_UNIT);
                    total_end_famt       += Number(dt_Data[i].END_TRAMT);
                    //row_item.commit();

                }  
                var row = worksheet.getRow(pos);
                worksheet.mergeCells(pos,1,pos,8); 
                row.getCell(1).value    = "Total Arising" 
                row.getCell(9).value    = total_end_qty;
                row.getCell(10).value   = total_end_unit;
                row.getCell(11).value   = total_end_famt;
                /********* Print file excel ********/
                const reportFile    = Helpers.tmpPath(file_new);
                await workbook.xlsx.writeFile(reportFile)
                return response.attachment( reportFile, file_new);
            }
        } 
        catch (e) 
        {
            Utils.Logger({ LVL: "error", MODULE: "Report", FUNC: "rpt_6085060_BAL", CONTENT: e.message })
        // return response.send(Utils.response(false, e.message, null))
        return response.send(null);
        }
    } 
    async rpt_6085060_OUT({ request, response, auth }) {
        try 
        { 
        /* P_TAB : 'IOB',P_RPT_ID: report_info.VAL1, P_RPT_URL: report_info.VAL2, P_RPT_FILE: report_info.VAL3, 
            P_COMP_ID: company_info.PARTNER_ID, P_COMP_NM: company_info.TEXT, P_COMP_TAX: company_info.TAX_CODE, P_COMP_ADD: company_info.ADDR1, 
            P_COMPANY: this.selectedCompany, P_FR_MONTH: this.Month_fr, P_TO_MONTH: this.Month_to, P_Item_PK: this.txtItem_PK, P_Item_CD: this.txtItem_CD, P_Item_NM: this.txtItem_NM,  
            P_ACCOUNT_PK: this.txtAccount_PK,  P_ACCOUNT_CD: this.txtAccount_CD, P_ACCOUNT_NM: this.txtAccount_NM, P_LSTWAREHOUSE: this.lstWareHouse,  P_PL_PK: this.txtPL_PK, P_N : 'N',  P_NULL : '',  
            P_TCO_BUSPLACE_PK: this.lstBizPlace, P_BIZ_ID: BizPlace_info.NAME, P_BIZ_NM: BizPlace_info.LOC_NM, P_BIZ_TAX: BizPlace_info.TAX_CD, P_BIZ_ADD: BizPlace_info.ADDR_NM1
            */
            /****************************** Get Param *********************************/
            let { para }        = request.get(['para']);
            /********* Parse pram to json ********/
            var item            = JSON.parse(para); 
            const user          = await auth.getUser() ;
            var COMP_ID         = item.P_COMP_ID, COMP_NM = item.P_COMP_NM, COMP_TAX = item.P_COMP_TAX, COMP_ADD = item.P_COMP_ADD;
            var BIZ_ID         = item.P_BIZ_ID , BIZ_NM  = item.P_BIZ_NM , BIZ_TAX  = item.P_BIZ_TAX , BIZ_ADD  = item.P_BIZ_ADD;
            const p_crt_by      = user.USER_ID;
            const p_language    = request.header("accept-language", "ENG");
            var file_nm         = [item.P_RPT_FILE];
            var file_type       = ".xlsx";
            var full_nm         = file_nm + file_type;
            var file_new        = file_nm + p_crt_by + file_type;
            var _resourcesPath  = [item.P_RPT_URL]+'/'+full_nm;
            var _store          = "SP_SEL_6085060_OUT";
            var _circular       = "AC_SEL_GET_TT_BPL";
            var _param           = [item.P_COMPANY, item.P_FR_MONTH, item.P_TO_MONTH, item.P_Item_PK, item.P_Item_CD, item.P_Item_NM, item.P_ACCOUNT_PK, item.P_ACCOUNT_CD, item.P_ACCOUNT_NM, item.P_LSTWAREHOUSE, item.P_PL_PK, item.P_N, item.P_NULL, item.P_NULL_1, item.P_ACC_DC, item.P_PL_DC, item.P_TRTYPE, item.P_TCO_BUSPLACE_PK, item.P_BIZ_CENTER];
            var _param_TT       = [item.P_CIRCULARS, item.P_TCO_BUSPLACE_PK];
            var _ac_code        = "EACAB031";
            var _store_sign     = "ac_rpt_6045085_sign";
            var _param_sign     = [item.P_COMPANY,_ac_code];
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
                //INFOMATION COMPANY
                worksheet.getCell("A1").value = Utils.translate("COMPANY",_dictionary , p_language) + ": " + BIZ_ID +" - "+ BIZ_NM;
                worksheet.getCell("A2").value = Utils.translate("ADDRESS",_dictionary , p_language) + ": "+ BIZ_ADD;
                worksheet.getCell("A3").value = Utils.translate("TAX_CODE",_dictionary, p_language) + ": "+ BIZ_TAX;
                var title_a4 = "";
                var FromMonth = item.P_FR_MONTH;
                var ToMonth = item.P_TO_MONTH;
                var strFrMonth =  FromMonth.substr(4,2)+ "/"+ FromMonth.substr(0,4);
                var strToMonth =  ToMonth.substr(4,2)+ "/"+ ToMonth.substr(0,4);
                //var _bookccy = item.P_BOOK_CCY;
                //worksheet.getCell("K6").value = _bookccy;
                worksheet.getCell("A6").value = "Period from " + strFrMonth + " To " + strToMonth;
                //worksheet.getCell("J6").value = e_dvt;
                let date_ob = new Date();
                // adjust 0 before single digit date
                let date = ("0" + date_ob.getDate()).slice(-2);
                let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
                let year = date_ob.getFullYear();
                worksheet.getCell('O1').value = "Print date : " + date +"-"+ month +"-"+ year; 
                var pos = 9; 
                var total_out_uprice       = 0;
                var total_out_famt         = 0;

                if(dt_Data.length>1)
                {
                    worksheet.duplicateRow(pos,dt_Data.length-1,true);
                }  
                for (var i = 0; i < dt_Data.length; i++) 
                {
                    var row_item = worksheet.getRow(pos);
                    row_item.getCell(1).value    = dt_Data[i].TRANS_NAME
                    row_item.getCell(2).value    = dt_Data[i].VOUCHERNO
                    row_item.getCell(3).value    = dt_Data[i].TR_DATE_RPT
                    row_item.getCell(4).value    = dt_Data[i].ITEM_CODE
                    row_item.getCell(5).value    = dt_Data[i].ITEM_NAME
                    row_item.getCell(6).value    = dt_Data[i].UOM
                    row_item.getCell(7).value    = dt_Data[i].OUTPUT_QTY
                    row_item.getCell(8).value    = dt_Data[i].OUT_UPRICE
                    row_item.getCell(9).value    = dt_Data[i].OUT_TRAMT
                    row_item.getCell(10).value    = dt_Data[i].WH_NAME
                    row_item.getCell(11).value    = dt_Data[i].ACCD_DR
                    row_item.getCell(12).value    = dt_Data[i].ACCD_CR
                    row_item.getCell(13).value    = dt_Data[i].PL_DRCD
                    row_item.getCell(14).value    = dt_Data[i].PARTNER_ID
                    row_item.getCell(15).value    = dt_Data[i].WH_IN
                    row_item.getCell(19).value    = dt_Data[i].REMARK2
                    pos = pos + 1; 
                    total_out_uprice     += Number(dt_Data[i].OUT_UPRICE);
                    total_out_famt       += Number(dt_Data[i].OUT_TRAMT);
                    //row_item.commit();

                }  
                var row = worksheet.getRow(pos);
                worksheet.mergeCells(pos,1,pos,7); 
                row.getCell(1).value = "Total Arising" 
                row.getCell(8).value   = total_out_uprice;
                row.getCell(9).value   = total_out_famt;
                /********* Print file excel ********/
                const reportFile    = Helpers.tmpPath(file_new);
                await workbook.xlsx.writeFile(reportFile)
                return response.attachment( reportFile, file_new);
            }
        } 
        catch (e) 
        {
            Utils.Logger({ LVL: "error", MODULE: "Report", FUNC: "rpt_6085060_OUT", CONTENT: e.message })
        // return response.send(Utils.response(false, e.message, null))
        return response.send(null);
        }
    } 
    async rpt_6085060_IN({ request, response, auth }) {
        try 
        { 
        /* P_TAB : 'IOB',P_RPT_ID: report_info.VAL1, P_RPT_URL: report_info.VAL2, P_RPT_FILE: report_info.VAL3, 
            P_COMP_ID: company_info.PARTNER_ID, P_COMP_NM: company_info.TEXT, P_COMP_TAX: company_info.TAX_CODE, P_COMP_ADD: company_info.ADDR1, 
            P_COMPANY: this.selectedCompany, P_FR_MONTH: this.Month_fr, P_TO_MONTH: this.Month_to, P_Item_PK: this.txtItem_PK, P_Item_CD: this.txtItem_CD, P_Item_NM: this.txtItem_NM,  
            P_ACCOUNT_PK: this.txtAccount_PK,  P_ACCOUNT_CD: this.txtAccount_CD, P_ACCOUNT_NM: this.txtAccount_NM, P_LSTWAREHOUSE: this.lstWareHouse,  P_PL_PK: this.txtPL_PK, P_N : 'N',  P_NULL : '',  
            P_TCO_BUSPLACE_PK: this.lstBizPlace, P_BIZ_ID: BizPlace_info.NAME, P_BIZ_NM: BizPlace_info.LOC_NM, P_BIZ_TAX: BizPlace_info.TAX_CD, P_BIZ_ADD: BizPlace_info.ADDR_NM1
            */
            /****************************** Get Param *********************************/
            let { para }        = request.get(['para']);
            /********* Parse pram to json ********/
            var item            = JSON.parse(para); 
            const user          = await auth.getUser() ;
            var COMP_ID         = item.P_COMP_ID, COMP_NM = item.P_COMP_NM, COMP_TAX = item.P_COMP_TAX, COMP_ADD = item.P_COMP_ADD;
            var BIZ_ID         = item.P_BIZ_ID , BIZ_NM  = item.P_BIZ_NM , BIZ_TAX  = item.P_BIZ_TAX , BIZ_ADD  = item.P_BIZ_ADD;
            const p_crt_by      = user.USER_ID;
            const p_language    = request.header("accept-language", "ENG");
            var file_nm         = [item.P_RPT_FILE];
            var file_type       = ".xlsx";
            var full_nm         = file_nm + file_type;
            var file_new        = file_nm + p_crt_by + file_type;
            var _resourcesPath  = [item.P_RPT_URL]+'/'+full_nm;
            var _store          = "SP_SEL_6085060_IN";
            var _circular       = "AC_SEL_GET_TT_BPL";
            var _param           = [item.P_COMPANY, item.P_FR_MONTH, item.P_TO_MONTH, item.P_Item_PK, item.P_Item_CD, item.P_Item_NM, item.P_ACCOUNT_PK, item.P_ACCOUNT_CD, item.P_ACCOUNT_NM, item.P_LSTWAREHOUSE, item.P_PL_PK, item.P_N, item.P_NULL, item.P_NULL_1, item.P_ACC_DC, item.P_PL_DC, item.P_TRTYPE, item.P_TCO_BUSPLACE_PK, item.P_BIZ_CENTER];
            var _param_TT       = [item.P_CIRCULARS, item.P_TCO_BUSPLACE_PK];
            var _ac_code        = "EACAB031";
            var _store_sign     = "ac_rpt_6045085_sign";
            var _param_sign     = [item.P_COMPANY,_ac_code];
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
                //INFOMATION COMPANY
                worksheet.getCell("A1").value = Utils.translate("COMPANY",_dictionary , p_language) + ": " + BIZ_ID +" - "+ BIZ_NM;
                worksheet.getCell("A2").value = Utils.translate("ADDRESS",_dictionary , p_language) + ": "+ BIZ_ADD;
                worksheet.getCell("A3").value = Utils.translate("TAX_CODE",_dictionary, p_language) + ": "+ BIZ_TAX;
                var title_a4 = "";
                var FromMonth = item.P_FR_MONTH;
                var ToMonth = item.P_TO_MONTH;
                var strFrMonth =  FromMonth.substr(4,2)+ "/"+ FromMonth.substr(0,4);
                var strToMonth =  ToMonth.substr(4,2)+ "/"+ ToMonth.substr(0,4);
                //var _bookccy = item.P_BOOK_CCY;
                //worksheet.getCell("K6").value = _bookccy;
                worksheet.getCell("A6").value = "Period from " + strFrMonth + " To " + strToMonth;
                //worksheet.getCell("J6").value = e_dvt;
                let date_ob = new Date();
                // adjust 0 before single digit date
                let date = ("0" + date_ob.getDate()).slice(-2);
                let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
                let year = date_ob.getFullYear();
                worksheet.getCell('O1').value = "Print date : " + date +"-"+ month +"-"+ year; 
                var pos = 9; 
                var total_in_uprice     = 0;
                var total_in_famt       = 0;

                if(dt_Data.length>1)
                {
                    worksheet.duplicateRow(pos,dt_Data.length-1,true);
                }  
                for (var i = 0; i < dt_Data.length; i++) 
                {
                    var row_item = worksheet.getRow(pos);
                    row_item.getCell(1).value    = dt_Data[i].TRANS_NAME
                    row_item.getCell(2).value    = dt_Data[i].VOUCHERNO
                    row_item.getCell(3).value    = dt_Data[i].TR_DATE_RPT
                    row_item.getCell(4).value    = dt_Data[i].ITEM_CODE
                    row_item.getCell(5).value    = dt_Data[i].ITEM_NAME
                    row_item.getCell(6).value    = dt_Data[i].UOM
                    row_item.getCell(7).value    = dt_Data[i].INPUT_QTY
                    row_item.getCell(8).value    = dt_Data[i].IN_UPRICE
                    row_item.getCell(9).value    = dt_Data[i].IN_AMT
                    row_item.getCell(10).value   = dt_Data[i].WH_NAME
                    row_item.getCell(11).value   = dt_Data[i].ACCD_DR
                    row_item.getCell(12).value   = dt_Data[i].ACCD_CR
                    row_item.getCell(13).value   = dt_Data[i].PL_DRCD
                    row_item.getCell(14).value   = dt_Data[i].PARTNER_ID
                    row_item.getCell(15).value   = dt_Data[i].WH_IN
                    row_item.getCell(16).value   = dt_Data[i].REMARK2

                    pos = pos + 1; 
                    total_in_uprice     += Number(dt_Data[i].IN_UPRICE);
                    total_in_famt       += Number(dt_Data[i].IN_AMT);
                    //row_item.commit();

                }  
                var row = worksheet.getRow(pos);
                worksheet.mergeCells(pos,1,pos,7); 
                row.getCell(1).value = "Total Arising" 

                row.getCell(8).value   = total_in_uprice;
                row.getCell(9).value   = total_in_famt;
                /********* Print file excel ********/
                const reportFile    = Helpers.tmpPath(file_new);
                await workbook.xlsx.writeFile(reportFile)
                return response.attachment( reportFile, file_new);
            }
        } 
        catch (e) 
        {
            Utils.Logger({ LVL: "error", MODULE: "Report", FUNC: "rpt_6085060_IN", CONTENT: e.message })
        // return response.send(Utils.response(false, e.message, null))
        return response.send(null);
        }
    }
}

module.exports = rpt6085060;