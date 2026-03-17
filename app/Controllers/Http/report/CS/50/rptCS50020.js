"use strict";
const Helpers = use('Helpers')
const Antl = use("Antl");
const Utils = use("Utils");
const DBService = use("DBService")
var Excel = use('exceljs');
var workbook = new Excel.Workbook();
class rptCS50020 {
    async rpt_CS50020_Contract({ request, response, auth }) {
        try {
                /****************************** Get Param *********************************/
                let { para }        = request.get(['para']);
                /********* Parse pram to json ********/
                var item            = JSON.parse(para); 
                const user          = await auth.getUser() ;
                //var COMP_ID         = item.P_COMP_ID, COMP_NM = item.P_COMP_NM, COMP_TAX = item.P_COMP_TAX, COMP_ADD = item.P_COMP_ADD;
                const p_crt_by      = user.USER_ID;
                const p_language    = request.header("accept-language", "ENG");
                var file_nm         = [item.P_RPT_FILE];
                var file_type       = ".xlsx";
                var full_nm         = file_nm + file_type;
                var file_new        = file_nm + p_crt_by + file_type;
                var _resourcesPath  = [item.P_RPT_URL]+'/'+full_nm;
                var _store          = "CW_RPT_CS50020_1_NOCACHE"; 
                var _param          = [ item.P_COMPANY_PK,item.P_TCO_BUSPLACE_PK,item.P_CONTRACT_M_HIS_PK,item.P_CONTRACT_M_PK]; 


            
            /***************************** Return failded ****************************/
            if (!user) 
            {
                return response.send(Utils.response(false, "Request failed!", null));
            } 
            /****************************** Begin call store and write excell *********/
            else 
            { 
                     /********* Call store  ***************/ 
                    var dt_m   = await DBService.callProcCursor("CW_RPT_CS50020_1_NOCACHE", _param , p_language , p_crt_by); 
                
                    if (dt_m.length>0) 
                    {
                        dt_m = dt_m;
                    } 
                    else 
                    {
                        return response.send(Utils.response(false, "no_data_found", null))
                    }  
                    /********* Read file excel ********/ 
                    const templateFile  = Helpers.resourcesPath(_resourcesPath); 
                    await workbook.xlsx.readFile(templateFile);
                    var worksheet        = workbook.getWorksheet(1);
                    var worksheet2       = workbook.getWorksheet('APPENDIXA');
                    var worksheet3       = workbook.getWorksheet('APPENDIXB');
                    var worksheet4       = workbook.getWorksheet('APPENDIXC');
                
                    /********* Write file excel ********/
                    var pos = 18; 
                    var pos1 = 19; 
                    //INFOMATION COMPANY
                    worksheet.getCell("F8").value = dt_m[0].CONTRACT_NO;
                    worksheet.getCell("I9").value = dt_m[0].CT_DATE;
                    worksheet.getCell("C12").value = dt_m[0].PLACE_NM;
                    worksheet.getCell("E17").value = dt_m[0].ADDR_NM1;
                    worksheet.getCell("E19").value = dt_m[0].PHONE_NO;
                    worksheet.getCell("E20").value = dt_m[0].FAX_NO;
                    worksheet.getCell("E21").value = dt_m[0].TAX_CD;
                    worksheet.getCell("E22").value = dt_m[0].REPRESENTATIVE;

                    worksheet.getCell("C24").value = dt_m[0].PARTNER_NAME;
                    worksheet.getCell("E26").value = dt_m[0].PARTNER_ADDRESS;
                    worksheet.getCell("E28").value = dt_m[0].PARTNER_PHONE;
                    worksheet.getCell("E29").value = dt_m[0].PARTNER_FAX;
                    worksheet.getCell("E30").value = dt_m[0].PARTNER_TAXCODE;
                    worksheet.getCell("E31").value = dt_m[0].PARTNER_REPRESENTATIVE;
                    worksheet.getCell("C152").value = dt_m[0].PARTNER_NAME;
                    worksheet.getCell("E154").value = dt_m[0].PARTNER_ADDRESS;
                    worksheet.getCell("E156").value = dt_m[0].PARTNER_EMAIL;
                    worksheet.getCell("E157").value = dt_m[0].PARTNER_PHONE;
                    worksheet.getCell("E158").value = dt_m[0].PARTNER_ATTN;

                    worksheet.getCell("E162").value = dt_m[0].PLACE_NM;
                    worksheet.getCell("E164").value = dt_m[0].COMPANY_ACCOUNT_NO1;
                    worksheet.getCell("E165").value = dt_m[0].COMPANY_BANK_NM1;
                    worksheet.getCell("E166").value = dt_m[0].COMPANY_ACCOUNT_NO2;
                    worksheet.getCell("E167").value = dt_m[0].COMPANY_BANK_NM2;
                    
                    worksheet.getCell("F279").value = dt_m[0].CONTRACT_PERIOD;
                    worksheet.getCell("E331").value = dt_m[0].REPRESENTATIVE;
                    worksheet.getCell("E332").value = dt_m[0].COMPANY_TITLE;

                    worksheet.getCell("I331").value = dt_m[0].PARTNER_REPRESENTATIVE;
                    worksheet.getCell("I332").value = dt_m[0].PARTNER_TITLE;
               
                    worksheet2.getCell("C140").value = dt_m[0].REPRESENTATIVE;
                    worksheet2.getCell("C141").value = dt_m[0].COMPANY_TITLE;

                    worksheet2.getCell("I140").value = dt_m[0].PARTNER_REPRESENTATIVE;
                    worksheet2.getCell("I141").value = dt_m[0].PARTNER_TITLE;
                    worksheet2.getCell("I130").value = dt_m[0].CONTRACT_PERIOD;
                /********* Print file excel ********/
                const reportFile    = Helpers.tmpPath(file_new);
               
                await workbook.xlsx.writeFile(reportFile); 
                if( item.P_FILE_TYPE ==".xlsx")
                {  
                    return response.attachment( reportFile, file_nm+ item.P_FILE_TYPE )
                }

                if( item.P_FILE_TYPE ==".pdf")
                { 
                    const reportFilePdf =  await Utils.excelToPdf(reportFile);
                    return response.attachment( reportFilePdf, file_nm+ item.P_FILE_TYPE )
                }
                
                
            }  
        } 
       catch (e) 
       {
          // Utils.Logger({ LVL: "error", MODULE: "Report", FUNC: "Picking_list", CONTENT: e.message }) 
          //return response.send(null);
          return response.send(Utils.response(false, e.message, null))
       }
    }
}

module.exports = rptCS50020;