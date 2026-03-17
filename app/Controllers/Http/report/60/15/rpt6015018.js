"use strict";
const Helpers       = use('Helpers')
const Antl          = use("Antl");
const Utils         = use("Utils");
const DBService = use("DBService")
var Excel           = use('exceljs');
var workbook        = new Excel.Workbook();
class rpt6015018 {
/*########################################################## Report JH ##################################################################################*/ 
    async rpt_6015018({ request, response, auth }) {
        try 
        { 
          /*P_RPT_ID: report_info.VAL1, P_RPT_FILE: report_info.VAL2,
             P_COMPANY: this.selectedCompany2, P_ACC_CODE: this.accCode2, P_ACC_NAME: this.accName2*/
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
            var _store          = "AC_RPT_6015018_ACC_INQUIRY";
            var _param = [item.P_COMPANY   , item.P_ACC_CODE, item.P_ACC_NAME];
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
                //console.log(dt_Data);
                if (dt_Data) 
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
               
                //INFOMATION COMPANY
                worksheet.getCell("A1").value = COMP_NM;
                worksheet.getCell("A2").value = COMP_ADD;
                worksheet.getCell("A3").value = "Tax code : " + COMP_TAX;
                 /*Set Header */ 
                 var arr_header = dt_Data[0].HEADER_COL.split(','); 
                 var arr_header_D = dt_Data[0].HEADER_DATA.split(','); 
                 
                 var cnt =0;
                 var total_header = (Number(dt_Data[0].TOTAL_COL) + 13);

                 var h_item = worksheet.getRow(6);
                 var d_item = worksheet.getRow(7);
            
                /* for (var j = 16; j <= total_header; j++)
                 { 
                        
                        h_item.getCell(j).value = arr_header[cnt];
                        h_item.getCell(j).border = {
                            top: {style:'thin'},
                            left: {style:'thin'},
                            bottom: {style:'thin'},
                            right: {style:'thin'}
                          };
                        h_item.getCell(j).fill = { 
                            type: 'pattern',
                            pattern:'solid',
                            fgColor:{argb:'b8f6b9'},
                            bgColor:{argb:'b8f6b9'}
                          };
                          d_item.getCell(j).border = {
                            top: {style:'thin'},
                            left: {style:'thin'},
                            bottom: {style:'thin'},
                            right: {style:'thin'}
                          };
                        h_item.getCell(j).font = {
                            name: 'Times New Roman',
                            size:8,
                            bold: true 
                          };
                        cnt++;
                 }*/
                var pos = 7; 
                if(dt_Data.length>1)
                {
                     worksheet.duplicateRow(pos,dt_Data.length-1,true);
                }  
                for (var i = 0; i < dt_Data.length; i++) 
                {
                    var row_item = worksheet.getRow(pos + i);
                        row_item.getCell(1).value = i + 1;
                        row_item.getCell(2).value = dt_Data[i].UAC_CD;
                        row_item.getCell(3).value = dt_Data[i].AC_CD;    
                        row_item.getCell(4).value = dt_Data[i].AC_NM;  
                        row_item.getCell(5).value = dt_Data[i].AC_LNM;  
                        row_item.getCell(6).value = dt_Data[i].AC_KNM;  
                        row_item.getCell(7).value = dt_Data[i].DRCR_TYPE;  
                        row_item.getCell(8).value = dt_Data[i].LEAF_YN;  
                        row_item.getCell(9).value = dt_Data[i].AC_LEVEL;  
                        row_item.getCell(10).value = dt_Data[i].STCODE_CODE;   
                        row_item.getCell(11).value = dt_Data[i].STCODE_NAME;   
                        row_item.getCell(12).value = dt_Data[i].KSTCODE_NAME;   
                    /*var count = 16;
                    for(let j = 0; j < arr_header_D.length; j++){
                        row_item.getCell(count).value = dt_Data[i][arr_header_D[j]];
                        count++;
                    }*/

                }   
                /********* Print file excel ********/
                const reportFile    = Helpers.tmpPath(file_new);
                await workbook.xlsx.writeFile(reportFile)
                return response.attachment( reportFile, file_new);
            }
        } 
        catch (e) 
        {
            Utils.Logger({ LVL: "error", MODULE: "Report", FUNC: "rpt_6015018", CONTENT: e.message })
           // return response.send(Utils.response(false, e.message, null))
           return response.send(null);
        }
    }  
}

module.exports = rpt6015018;