"use strict";
const Helpers       = use('Helpers')
const Antl          = use("Antl");
const Utils         = use("Utils");
const DBService = use("DBService")
var Excel           = use('exceljs');
var workbook        = new Excel.Workbook();    
class rpt6090010 {
/*########################################################## Report JH ##################################################################################*/ 
    async rpt_6092010_YQ({ request, response, auth }) {
        try 
        { 
          /*    P_RPT_ID: report_info.VAL1,
                P_RPT_URL: report_info.VAL2,
                P_RPT_FILE: _P_RPT_FILE,
                P_COMP_ID: company_info.PARTNER_ID,
                P_COMP_NM: company_info.TEXT,
                P_COMP_TAX: company_info.TAX_CODE,
                P_COMP_ADD: company_info.ADDR1,
                P_COMPANY: this.sel_Company, 
                P_BIZ: this.sel_Bizplace,
                P_BIZ_ID: BizPlace_info.NAME,
                P_BIZ_NM: BizPlace_info.LOC_NM,
                P_BIZ_TAX: BizPlace_info.TAX_CD,
                P_BIZ_ADD: BizPlace_info.ADDR_NM1,
                P_FORM_TYPE: this.sel_FormType, 
                P_STATUS: this.sel_Status, 
                P_DT_FROM: this.dt_from, 
                P_DT_TO: this.dt_to, 
                P_BOOK_CCY: this.txt_Bookccy, 
                P_BOOK_RATE: this.txt_BookRate, 
                P_CONVERT_CCY: this.sel_ConvertCcy, 
                P_CONVERT_RATE: this.txt_convertRate, 
                P_UNIT: this.txt_Unit*/
            /****************************** Get Param *********************************/
            let { para }        = request.get(['para']);
            /********* Parse pram to json ********/
            var item            = JSON.parse(para); 
            const user          = await auth.getUser() ;
            const p_crt_by      = user.USER_ID;
            const p_language    = request.header("accept-language", "ENG");
            var file_nm         = [item.P_RPT_FILE];
            var file_type       = ".xlsx";
            var full_nm         = file_nm + file_type;
            var file_new        = file_nm + p_crt_by + file_type;
            var _resourcesPath  = [item.P_RPT_URL]+'/'+full_nm;
            var _store          = "AC_SEL_6092010_DOWN_NOCACHE";
            var _param          = [ item.P_COMPANY, item.P_BIZ, item.P_FORM_TYPE, item.P_STATUS, 
                                    item.P_DT_FROM, item.P_DT_TO, item.P_BOOK_CCY, item.P_BOOK_RATE, item.P_CONVERT_CCY, 
                                    item.P_CONVERT_RATE, item.P_UNIT];
             /***************************** Return failded ****************************/
            if (!user) 
            {
                return response.send(Utils.response(false, "Request failed!", null));
            } 
            /****************************** Begin call store and write excell *********/
            else 
            { 
                /********* Call store  ***************/ 
                var dt_Data  = await DBService.callProcCursor(_store, _param, p_language, p_crt_by); 
                if (dt_Data.length > 0) 
                {
                    dt_Data = dt_Data;
                } 
                else 
                {
                    return response.send(Utils.response(false, "no_data_found", null))
                } 
                /********* Read file excel ********/ 
                const templateFile  = Helpers.resourcesPath(_resourcesPath); 
                await workbook.xlsx.readFile(templateFile);
                var worksheet       = workbook.getWorksheet(1);
                /********* Write file excel ********/
                /*Set Header */ 
                var row_item = worksheet.getRow(1);
                    row_item.getCell(2).value = item.P_COMP_NM;  
                    row_item = worksheet.getRow(2);
                    row_item.getCell(2).value = item.P_BIZ_ID + " - "+item.P_BIZ_NM;  
                    row_item = worksheet.getRow(3);
                    row_item.getCell(2).value = item.P_DT_FROM.substring(0, 4);  
                    row_item = worksheet.getRow(4);
                    row_item.getCell(2).value = item.P_BOOK_CCY;  

                    row_item = worksheet.getRow(8);
                    row_item.getCell(5).value = "FY "+ item.P_YEAR;  
                    row_item.getCell(6).value = "FY "+item.P_YEAR+ ". Q3" ;  
                    row_item.getCell(7).value = "FY "+item.P_YEAR+ ". Q2" ;  
                    row_item.getCell(8).value = "FY "+item.P_YEAR+ ". Q1" ;  
                    row_item.getCell(9).value = "FY "+(Number(item.P_YEAR)-1);   
                   

                var pos = 9; 

                // if(dt_Data.length>1)
                // {
                //     worksheet.duplicateRow(pos,dt_Data.length-1,true);
                // }  
                Utils.excelInsertRows(worksheet, pos, dt_Data.length-1);  

                for (var i = 0; i < dt_Data.length; i++) 
                {
                    row_item = worksheet.getRow(pos + i);

                    row_item.getCell(1).value = dt_Data[i].CODE;  
                    row_item.getCell(2).value = dt_Data[i].PRN_ACNM;  
                    row_item.getCell(3).value = dt_Data[i].PRN_LACNM;  
                    row_item.getCell(4).value = dt_Data[i].PRN_KACNM;

                    row_item.getCell(5).value = Number(dt_Data[i].FY_YEAR);  
                    row_item.getCell(6).value = Number(dt_Data[i].FY_Q3);  
                    row_item.getCell(7).value = Number(dt_Data[i].FY_Q2);  
                    row_item.getCell(8).value = Number(dt_Data[i].FY_Q1);   
                    row_item.getCell(9).value = Number(dt_Data[i].FY_YEAR_PR);  
                     
                    if (dt_Data[i].FONT_STYPE === "B") {
                        row_item.getCell(1).font = { italic: false, bold: true};
                        row_item.getCell(2).font = { italic: false, bold: true};
                        row_item.getCell(3).font = { italic: false, bold: true};
                        row_item.getCell(4).font = { italic: false, bold: true};
                        row_item.getCell(5).font = { italic: false, bold: true};
                        row_item.getCell(6).font = { italic: false, bold: true};
                        row_item.getCell(7).font = { italic: false, bold: true};
                        row_item.getCell(8).font = { italic: false, bold: true};
                        row_item.getCell(9).font = { italic: false, bold: true};
                    }
                }   
                worksheet.name = item.P_RPT_NAME; 
                /********* Print file excel ********/ 
                const reportFile    = Helpers.tmpPath(file_new);
                await workbook.xlsx.writeFile(reportFile)
                return response.attachment( reportFile, file_new);
            }
        } 
        catch (e) 
        {
            return response.send(Utils.response(false, e.message, null))
        }
    }  
    
}

module.exports = rpt6090010;