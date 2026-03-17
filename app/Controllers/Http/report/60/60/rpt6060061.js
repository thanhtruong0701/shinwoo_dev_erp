"use strict";
const Helpers       = use('Helpers')
const Antl          = use("Antl");
const Utils         = use("Utils");
const DBService = use("DBService")
var Excel           = use('exceljs');
var workbook        = new Excel.Workbook();
class rpt6060061 {
/*########################################################## Report JH ##################################################################################*/ 
    async rpt6060061_01({ request, response, auth }) {
        try 
        { 
          /* P_RPT_ID: report_info.VAL1
                    ,P_RPT_URL: report_info.VAL2
                    ,P_RPT_FILE: report_info.VAL3
                    ,P_COMP_ID: company_info.PARTNER_ID
                    ,P_COMP_NM: company_info.TEXT
                    ,P_COMP_TAX: company_info.TAX_CODE
                    ,P_COMP_ADD: company_info.ADDR2 
                    ,P_COMPANY_PK: this.sel_Company
                    ,P_BUSPLACE_PK: this.sel_BizPlace
                    ,P_AMT_TYPE: this.sel_AmountType
                    ,P_MONTH_FR: this.dt_Month
                    ,P_PERIOD_TYPE: this.sel_MonthType
                    ,P_CUST_PK: this.txt_CusPk
                    ,P_ACC_PK: this.txt_AccPk
                    ,P_CCY: this.sel_Ccy*/
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
            var _COMP_ID        = item.P_COMP_ID, _COMP_NM = item.P_COMP_NM, _COMP_TAX = item.P_COMP_TAX, _COMP_ADD = item.P_COMP_ADD;

            var _store          = "AC_SEL_6060061_NO_CACHE";
            var _param          = [ item.P_COMPANY_PK, item.P_BUSPLACE_PK, item.P_AMT_TYPE, item.P_MONTH_FR, item.P_PERIOD_TYPE, item.P_CUST_PK, item.P_ACC_PK, item.P_CCY];
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
                var pos = 7;
                var yy = item.P_MONTH_FR.substr(0, 4);  
                var mm = item.P_MONTH_FR.substr(4, 2);  
                var r_item = worksheet.getRow(1);
                var SUM_AR =0,M1_AR=0,M2_AR=0,M3_AR=0,M4_AR=0,M5_AR=0,M6_AR=0,M7_AR=0,M8_AR=0,M9_AR=0,M10_AR=0,M11_AR=0,M12_AR=0;
                r_item = worksheet.getRow(1);  
                r_item.getCell(1).value  =_COMP_NM;
                r_item = worksheet.getRow(2);  
                r_item.getCell(2).value  =_COMP_ADD;
                r_item = worksheet.getRow(3); 
                r_item.getCell(3).value  = _COMP_TAX;

                r_item = worksheet.getRow(pos-1);  
                r_item.getCell(6).value  = Utils.onCheckMonth(mm, yy, 11);
                r_item.getCell(7).value  = Utils.onCheckMonth(mm, yy, 10);
                r_item.getCell(8).value  = Utils.onCheckMonth(mm, yy, 9);
                r_item.getCell(9).value  = Utils.onCheckMonth(mm, yy, 8);
                r_item.getCell(10).value = Utils.onCheckMonth(mm, yy, 7);
                r_item.getCell(11).value = Utils.onCheckMonth(mm, yy, 6);
                r_item.getCell(12).value = Utils.onCheckMonth(mm, yy, 5);
                r_item.getCell(13).value = Utils.onCheckMonth(mm, yy, 4);
                r_item.getCell(14).value = Utils.onCheckMonth(mm, yy, 3);
                r_item.getCell(15).value = Utils.onCheckMonth(mm, yy, 2);
                r_item.getCell(16).value = Utils.onCheckMonth(mm, yy, 1);
                r_item.getCell(17).value = Utils.onCheckMonth(mm, yy, 0); 

                if(dt_Data.length>1)
                {
                    worksheet.duplicateRow(pos,dt_Data.length-2,true);
                }   
                for (var i = 0; i < dt_Data.length; i++) 
                {
                    var rdata = dt_Data[i];

                    r_item = worksheet.getRow(pos);    
                    r_item.getCell(1).value  = rdata.NO; 
                    r_item.getCell(2).value  = rdata.CONSIGNOR_ID;
                    r_item.getCell(3).value  = rdata.CONSIGNOR_NAME;
                    r_item.getCell(4).value  = rdata.BIZ_PLACE;
                    r_item.getCell(5).value  = rdata.SUM_AR;
                    r_item.getCell(6).value  = rdata.M1_AR;
                    r_item.getCell(7).value  = rdata.M2_AR;
                    r_item.getCell(8).value  = rdata.M3_AR;
                    r_item.getCell(9).value  = rdata.M4_AR;
                    r_item.getCell(10).value = rdata.M5_AR;
                    r_item.getCell(11).value = rdata.M6_AR;
                    r_item.getCell(12).value = rdata.M7_AR;
                    r_item.getCell(13).value = rdata.M8_AR;
                    r_item.getCell(14).value = rdata.M9_AR;
                    r_item.getCell(15).value = rdata.M10_AR;
                    r_item.getCell(16).value = rdata.M11_AR;
                    r_item.getCell(17).value = rdata.M12_AR; 

                    SUM_AR += Number(rdata.SUM_AR);
                    M1_AR  += Number(rdata.M1_AR);
                    M2_AR  += Number(rdata.M2_AR);
                    M3_AR  += Number(rdata.M3_AR);
                    M4_AR  += Number(rdata.M4_AR);
                    M5_AR  += Number(rdata.M5_AR);
                    M6_AR  += Number(rdata.M6_AR);
                    M7_AR  += Number(rdata.M7_AR);
                    M8_AR  += Number(rdata.M8_AR);
                    M9_AR  += Number(rdata.M9_AR);
                    M10_AR += Number(rdata.M10_AR);
                    M11_AR += Number(rdata.M11_AR);
                    M12_AR += Number(rdata.M12_AR);

                    pos += 1;
                }
                r_item = worksheet.getRow(pos);    
                r_item.getCell(5).value  = SUM_AR;
                r_item.getCell(6).value  = M1_AR;
                r_item.getCell(7).value  = M2_AR;
                r_item.getCell(8).value  = M3_AR;
                r_item.getCell(9).value  = M4_AR;
                r_item.getCell(10).value = M5_AR;
                r_item.getCell(11).value = M6_AR;
                r_item.getCell(12).value = M7_AR;
                r_item.getCell(13).value = M8_AR;
                r_item.getCell(14).value = M9_AR;
                r_item.getCell(15).value = M10_AR;
                r_item.getCell(16).value = M11_AR;
                r_item.getCell(17).value = M12_AR; 



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

module.exports = rpt6060061;