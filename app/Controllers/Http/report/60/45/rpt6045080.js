"use strict";
const Helpers       = use('Helpers')
const Antl          = use("Antl");
const Utils         = use("Utils");
const DBService = use("DBService")
var Excel           = use('exceljs');
var workbook        = new Excel.Workbook();
class rpt6045080 {
    /*########################################################## Report Monthly by Yearly - Booking CCY ##################################################################################*/ 
    async rpt_6045080_CONSOLIDATE({ request, response, auth }) {
        try 
        { 
          /*  P_RPT_ID: report_info.VAL1, P_RPT_URL: report_info.VAL2, P_RPT_FILE: report_info.VAL3,
                P_COMP_ID: company_info.PARTNER_ID, P_COMP_NM: company_info.TEXT, P_COMP_TAX: company_info.TAX_CODE, P_COMP_ADD: company_info.ADDR1,
                P_COMPANY: this.selectedCompany, P_MONTH_FR: this.monthFrom, P_MONTH_TO: this.monthTo, P_STATUS: this.selectedStatus, P_STATEMENT_TYPE: this.selectedStatementType, 
                P_BOOK_EXRATE: this.txtBookExRate, P_CONVER_EXRATE: this.txtConvertExRate, P_DIVIDE_UNIT: this.txtDivideUnit, P_LANG: this.selectedLanguage, P_BOOK_CCY : this.txtBookCCY
                P_STATEMENT_NM
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
            var _store          = "AC_RPT_6045080_CONSOLIDATE";
            var _param          = [item.P_COMPANY, item.P_MONTH_TO, item.P_STATUS, item.P_STATEMENT_TYPE, item.P_BOOK_EXRATE, item.P_CONVER_EXRATE, item.P_DIVIDE_UNIT, item.P_TCO_BUSPLACE_PK];
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
               //Data
                var pos = 2; 
                var All_col = dt_Data.length;
                if(dt_Data.length>1)
                {
                     worksheet.duplicateRow(pos,dt_Data.length-1,true);
                }  
               for (var i = 0; i < dt_Data.length; i++) 
                {
                    var row_item = worksheet.getRow(pos);
                    row_item.getCell(1).value  = '';
                    row_item.getCell(2).value  = '';
                    row_item.getCell(3).value  = dt_Data[i].PRN_ACNM;
                    row_item.getCell(4).value  = dt_Data[i].AC_CD;   
                    row_item.getCell(5).value  = '';
                    row_item.getCell(6).value  = dt_Data[i].ACCU;
                    row_item.getCell(7).value  = dt_Data[i].JAN;   
                    row_item.getCell(8).value  = dt_Data[i].FEB;
                    pos = pos + 1; 
                }  
                //Hiden column
                // var l_company = item.P_COMPANY;
                // switch(l_company){
                //     case "VIE":
                //         worksheet.getColumn(3).hidden = true;
                //     break;
                //     case "KOR":
                //         worksheet.getColumn(2).hidden = true;
                //         worksheet.getColumn(3).hidden = true;
                //     break;
                // }
               
                //worksheet.name = item.P_STATEMENT_NM;
                /********* Print file excel ********/
                const reportFile    = Helpers.tmpPath(file_new);
                await workbook.xlsx.writeFile(reportFile)
                return response.attachment( reportFile, file_new);
            }
        } 
        catch (e) 
        {
            Utils.Logger({ LVL: "error", MODULE: "Report", FUNC: "rpt_6045080_CONSOLIDATE", CONTENT: e.message })
           // return response.send(Utils.response(false, e.message, null))
           return response.send(null);
        }
    } 
    /*########################################################## Report Monthly by Yearly - Booking CCY ##################################################################################*/ 
    async rpt_6045080_T1({ request, response, auth }) {
        try 
        { 
          /*  P_RPT_ID: report_info.VAL1, P_RPT_URL: report_info.VAL2, P_RPT_FILE: report_info.VAL3,
                P_COMP_ID: company_info.PARTNER_ID, P_COMP_NM: company_info.TEXT, P_COMP_TAX: company_info.TAX_CODE, P_COMP_ADD: company_info.ADDR1,
                P_COMPANY: this.selectedCompany, P_MONTH_FR: this.monthFrom, P_MONTH_TO: this.monthTo, P_STATUS: this.selectedStatus, P_STATEMENT_TYPE: this.selectedStatementType, 
                P_BOOK_EXRATE: this.txtBookExRate, P_CONVER_EXRATE: this.txtConvertExRate, P_DIVIDE_UNIT: this.txtDivideUnit, P_LANG: this.selectedLanguage, P_BOOK_CCY : this.txtBookCCY
                P_STATEMENT_NM
                P_TCO_BUSPLACE_PK : this.lstBizPlace, P_BIZ_ID: BizPlace_info.NAME, P_BIZ_NM: BizPlace_info.LOC_NM, P_BIZ_TAX: BizPlace_info.TAX_CD, P_BIZ_ADD: BizPlace_info.ADDR_NM1
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
            var _store          = "AC_RPT_6045080_T1";
            var _param          = [item.P_COMPANY, item.P_MONTH_TO, item.P_STATUS, item.P_STATEMENT_TYPE, item.P_BOOK_EXRATE, item.P_CONVER_EXRATE,  item.P_DIVIDE_UNIT, item.P_TCO_BUSPLACE_PK];
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

                var FromDate = item.P_MONTH_FR.replace('-', '');
                var ToDate = item.P_MONTH_TO.replace('-', '');
                var strFrDate =  FromDate.substr(4,2)+ "/"+ FromDate.substr(0,4);
                var strToDate =  ToDate.substr(4,2)+ "/"+ ToDate.substr(0,4);
                worksheet.getCell("A4").value = item.P_STATEMENT_NM;
                worksheet.getCell("Q6").value = item.P_BOOK_CCY;
               //Data
                var pos = 9; 
                var All_col = dt_Data.length;
                if(dt_Data.length>1)
                {
                     worksheet.duplicateRow(pos,dt_Data.length-1,true);
                }  
               for (var i = 0; i < dt_Data.length; i++) 
                {
                    var row_item = worksheet.getRow(pos);
                    worksheet.getCell("A7").value = Utils.translate("CODE",_dictionary , p_language);
                    row_item.getCell(1).value   = dt_Data[i].AC_CD;
                    worksheet.getCell("B7").value = Utils.translate("item_local",_dictionary , p_language);
                    row_item.getCell(2).value   = dt_Data[i].PRN_LACNM;   
                    worksheet.getCell("C7").value = Utils.translate("item_eng",_dictionary , p_language); 
                    row_item.getCell(3).value   = dt_Data[i].PRN_ACNM; 
                    worksheet.getCell("D7").value = Utils.translate("item_kor",_dictionary , p_language); 
                    row_item.getCell(4).value   = dt_Data[i].PRN_KACNM; 
                    worksheet.getCell("E7").value = Utils.translate("ACCU",_dictionary , p_language);
                    row_item.getCell(5).value   = dt_Data[i].ACCU; 
                    worksheet.getCell("F8").value = Utils.translate("JAN",_dictionary , p_language).replace('.','');
                    row_item.getCell(6).value   = dt_Data[i].JAN;  
                    worksheet.getCell("G8").value = Utils.translate("FEB",_dictionary , p_language).replace('.','');
                    row_item.getCell(7).value   = dt_Data[i].FEB; 
                    worksheet.getCell("H8").value = Utils.translate("mar",_dictionary , p_language).replace('.','');
                    row_item.getCell(8).value   = dt_Data[i].MAR;  
                    worksheet.getCell("I8").value = Utils.translate("APR",_dictionary , p_language).replace('.','');
                    row_item.getCell(9).value   = dt_Data[i].APR;  
                    worksheet.getCell("J8").value = Utils.translate("MAY",_dictionary , p_language).replace('.','');
                    row_item.getCell(10).value  = dt_Data[i].MAY; 
                    worksheet.getCell("K8").value = Utils.translate("JUN",_dictionary , p_language).replace('.','');
                    row_item.getCell(11).value  = dt_Data[i].JUN;  
                    worksheet.getCell("L8").value = Utils.translate("JUL",_dictionary , p_language).replace('.','');
                    row_item.getCell(12).value  = dt_Data[i].JUL;  
                    worksheet.getCell("M8").value = Utils.translate("AUG",_dictionary , p_language).replace('.','');
                    row_item.getCell(13).value  = dt_Data[i].AUG;
                    worksheet.getCell("N8").value = Utils.translate("SEP",_dictionary , p_language).replace('.','');
                    row_item.getCell(14).value   = dt_Data[i].SEP; 
                    worksheet.getCell("O8").value = Utils.translate("OCT",_dictionary , p_language).replace('.','');
                    row_item.getCell(15).value   = dt_Data[i].OCT;  
                    worksheet.getCell("P8").value = Utils.translate("NOV",_dictionary , p_language).replace('.','');
                    row_item.getCell(16).value   = dt_Data[i].NOV; 
                    worksheet.getCell("Q8").value = Utils.translate("dec",_dictionary , p_language).replace('.','');
                    row_item.getCell(17).value   = dt_Data[i].DEC;   
                    pos = pos + 1; 
                }  
                //Hiden column
                var l_lang = item.P_LANG;
                switch(l_lang){
                    case "VIE":
                        worksheet.getCell("A5").value = "Từ tháng : " + strFrDate + " đến tháng : " + strToDate;
                        worksheet.getColumn(3).hidden = true;
                        worksheet.getColumn(4).hidden = true;
                    break;
                    case "KOR":
                        worksheet.getCell("A5").value = "일자 : " + strFrDate + " ~ " + strToDate;
                        worksheet.getColumn(2).hidden = true;
                        worksheet.getColumn(3).hidden = true;
                    break;
                    case "ENG":
                        worksheet.getCell("A5").value = "From month : " + strFrDate + " To month : " + strToDate;
                        worksheet.getColumn(2).hidden = true;
                        worksheet.getColumn(4).hidden = true;
                    break;
                    case "KOR-VIE":
                        worksheet.getCell("A5").value = "From month : " + strFrDate + " To month : " + strToDate;
                        worksheet.getColumn(3).hidden = true;
                    break;
                    case "ENG-VIE":
                        worksheet.getCell("A5").value = "From month : " + strFrDate + " To month : " + strToDate;
                        worksheet.getColumn(4).hidden = true;
                    break;
                    case "ENG-KOR":
                        worksheet.getCell("A5").value = "From month : " + strFrDate + " To month : " + strToDate;
                        worksheet.getColumn(2).hidden = true;
                    break;
                }
               
                worksheet.getCell("P6").value = Utils.translate("CCY",_dictionary , p_language) ;
                worksheet.name = item.P_STATEMENT_NM;
                /********* Print file excel ********/
                const reportFile    = Helpers.tmpPath(file_new);
                await workbook.xlsx.writeFile(reportFile)
                return response.attachment( reportFile, file_new);
            }
        } 
        catch (e) 
        {
            Utils.Logger({ LVL: "error", MODULE: "Report", FUNC: "rpt_6045080_T1", CONTENT: e.message })
           // return response.send(Utils.response(false, e.message, null))
           return response.send(null);
        }
    }  
    /*########################################################## Report Monthly by Yearly - Booking CCY - Previos ##################################################################################*/ 
    async rpt_6045080_T2({ request, response, auth }) {
        try 
        { 
          /*  P_RPT_ID: report_info.VAL1, P_RPT_URL: report_info.VAL2, P_RPT_FILE: report_info.VAL3,
                P_COMP_ID: company_info.PARTNER_ID, P_COMP_NM: company_info.TEXT, P_COMP_TAX: company_info.TAX_CODE, P_COMP_ADD: company_info.ADDR1,
                P_COMPANY: this.selectedCompany, P_MONTH_FR: this.monthTo, P_MONTH_TO: this.monthTo, P_STATUS: this.selectedStatus, 
                P_STATEMENT_TYPE: this.selectedStatementType, P_BOOK_EXRATE: this.txtBookExRate, P_CONVER_EXRATE: this.txtConvertExRate,  
                P_DIVIDE_UNIT: this.txtDivideUnit, P_LANG: this.selectedLanguage, P_BOOK_CCY : this.txtBookCCY, P_STATEMENT_NM : this.selectedStatementType_NM,
                P_TCO_BUSPLACE_PK : this.lstBizPlace, P_BIZ_ID: BizPlace_info.NAME, P_BIZ_NM: BizPlace_info.LOC_NM, P_BIZ_TAX: BizPlace_info.TAX_CD, P_BIZ_ADD: BizPlace_info.ADDR_NM1
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
            var _store          = "AC_RPT_6045080_T1";
            var _param          = [item.P_COMPANY, item.P_MONTH_FR, item.P_STATUS, item.P_STATEMENT_TYPE, item.P_BOOK_EXRATE, item.P_CONVER_EXRATE,  item.P_DIVIDE_UNIT, item.P_TCO_BUSPLACE_PK];
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
                var FromDate = item.P_MONTH_FR.replace('-', '');
                var ToDate = item.P_MONTH_TO.replace('-', '');
                var strFrDate =  FromDate.substr(4,2)+ "/"+ FromDate.substr(0,4);
                var strToDate =  ToDate.substr(4,2)+ "/"+ ToDate.substr(0,4);
                worksheet.getCell("A5").value =   strFrDate + " ~ " + strToDate;
                worksheet.getCell("A4").value = item.P_STATEMENT_NM;
                worksheet.getCell("Q6").value = item.P_BOOK_CCY;
               //Data
                var pos = 9; 
                var All_col = dt_Data.length;
                if(dt_Data.length>1)
                {
                     worksheet.duplicateRow(pos,dt_Data.length-1,true);
                }  
               for (var i = 0; i < dt_Data.length; i++) 
                {
                    var row_item = worksheet.getRow(pos);
                    row_item.getCell(1).value   = dt_Data[i].AC_CD;
                    row_item.getCell(2).value   = dt_Data[i].PRN_LACNM;    
                    row_item.getCell(3).value   = dt_Data[i].PRN_ACNM;  
                    row_item.getCell(4).value   = dt_Data[i].PRN_KACNM; 
                    row_item.getCell(5).value   = dt_Data[i].ACCU; 
                    row_item.getCell(6).value   = dt_Data[i].DEC;  
                    row_item.getCell(7).value   = dt_Data[i].NOV; 
                    row_item.getCell(8).value   = dt_Data[i].OCT;  
                    row_item.getCell(9).value   = dt_Data[i].SEP;  
                    row_item.getCell(10).value  = dt_Data[i].AUG;  
                    row_item.getCell(11).value  = dt_Data[i].JUL;   
                    row_item.getCell(12).value  = dt_Data[i].JUN;  
                    row_item.getCell(13).value  = dt_Data[i].MAY;
                    row_item.getCell(14).value   = dt_Data[i].APR; 
                    row_item.getCell(15).value   = dt_Data[i].MAR;  
                    row_item.getCell(16).value   = dt_Data[i].FEB; 
                    row_item.getCell(17).value   = dt_Data[i].JAN;   
                    pos = pos + 1; 
                }  
                //Hiden column
                var l_lang = item.P_LANG;
                switch(l_lang){
                    case "VIE":
                        worksheet.getCell("A5").value = "Từ tháng : " + strFrDate + " đến tháng : " + strToDate;
                        worksheet.getColumn(3).hidden = true;
                        worksheet.getColumn(4).hidden = true;
                    break;
                    case "KOR":
                        worksheet.getCell("A5").value = "일자 : " + strFrDate + " ~ " + strToDate;
                        worksheet.getColumn(2).hidden = true;
                        worksheet.getColumn(3).hidden = true;
                    break;
                    case "ENG":
                        worksheet.getCell("A5").value = "From month : " + strFrDate + " To month : " + strToDate;
                        worksheet.getColumn(2).hidden = true;
                        worksheet.getColumn(4).hidden = true;
                    break;
                    case "KOR-VIE":
                        worksheet.getCell("A5").value = "From month : " + strFrDate + " To month : " + strToDate;
                        worksheet.getColumn(3).hidden = true;
                    break;
                    case "ENG-VIE":
                        worksheet.getCell("A5").value = "From month : " + strFrDate + " To month : " + strToDate;
                        worksheet.getColumn(4).hidden = true;
                    break;
                    case "ENG-KOR":
                        worksheet.getCell("A5").value = "From month : " + strFrDate + " To month : " + strToDate;
                        worksheet.getColumn(2).hidden = true;
                    break;
                }
               
                worksheet.getCell("P6").value = Utils.translate("CCY",_dictionary , p_language) ;
                /********* Print file excel ********/
                const reportFile    = Helpers.tmpPath(file_new);
                await workbook.xlsx.writeFile(reportFile)
                return response.attachment( reportFile, file_new);
            }
        } 
        catch (e) 
        {
            Utils.Logger({ LVL: "error", MODULE: "Report", FUNC: "rpt_6045080_T2", CONTENT: e.message })
           // return response.send(Utils.response(false, e.message, null))
           return response.send(null);
        }
    } 
}

module.exports = rpt6045080;