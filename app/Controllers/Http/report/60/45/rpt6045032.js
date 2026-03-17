"use strict";
const Helpers       = use('Helpers')
const Antl          = use("Antl");
const Utils         = use("Utils");
const DBService = use("DBService")
var Excel           = use('exceljs');
var workbook        = new Excel.Workbook();
class rpt6045032 {
/*########################################################## Report JH ##################################################################################*/ 
    async rpt6045032_TBPL({ request, response, auth }) {
        try 
        { 
          /*P_RPT_ID: report_info.VAL1, P_RPT_FILE: report_info.VAL2,
            P_COMPANY: this.sel_Company, P_DT_MONTH: this.dt_mmyy, P_VAT_TYPE: this.sel_VatType, P_TAX_RATE: this.sel_TaxRate, 
            P_CURRENT_CCY: this.sel_Ccy, P_STATUS: this.sel_Status, P_CUST_PK: this.txt_Customer_PK, P_INVOICE_NO: this.txt_InvoiceNo,
            P_AC_CD: this.txt_ACC_CD, P_SEQ: this.txt_Seq, P_VOUCHER_NO: this.sel_VoucherType, P_BALANCE: this.sel_Banlance,
            P_DT_FR: this.dt_from, P_DT_TO: this.dt_to, P_BIZ: this.sel_Bizpalce*/
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
            var _store          = "AC_SEL_6045032_DETAIL";
            var _param          = [ item.P_COMPANY, item.P_LANG, item.P_FR_DT, item.P_TO_DT, item.P_STATUS, item.P_LEVEL, item.P_POSSUM, item.P_ACCD, item.P_ACGROUP, item.P_CCY, item.P_EX_RATE, item.P_BK_RATE, item.P_UNIT, item.P_PL, item.P_TCO_BUSPLACE_PK];
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
                /*Set Header */ 
                //worksheet.getCell("B47").value = temp;
                var r_item = worksheet.getRow(1);
                r_item.getCell(1).value =  _COMP_ID +" - "+_COMP_NM;    
                  r_item = worksheet.getRow(2);
                r_item.getCell(1).value =  "Tax code : " + _COMP_TAX;   
                  r_item = worksheet.getRow(3);
                r_item.getCell(1).value =  _COMP_ADD;   
                var r_item = worksheet.getRow(5);
                r_item.getCell(1).value =  "Date: "+ Utils._formatDate(item.P_FR_DT,"DD-MM-YYYY")+" ~ "+Utils._formatDate(item.P_TO_DT,"DD-MM-YYYY");   

                var pos = 9; 
                if(dt_Data.length>1)
                {
                    worksheet.duplicateRow(pos,dt_Data.length-1,true);
                }   
                for (var i = 0; i < dt_Data.length; i++) 
                {
                    var row_item = worksheet.getRow(pos + i);

                    row_item.getCell(1).value = dt_Data[i].AC_CD;    
                    row_item.getCell(2).value = dt_Data[i].AC_NM;  
                    row_item.getCell(3).value = dt_Data[i].AC_LNM;  
                    row_item.getCell(4).value = dt_Data[i].AC_KNM;  
                    row_item.getCell(5).value = dt_Data[i].PL_CD;  
                    row_item.getCell(6).value = dt_Data[i].PL_NM;  
                   // row_item.getCell(7).value = dt_Data[i].PLC_CD;  
                   // row_item.getCell(8).value = dt_Data[i].PLC_NM;  
                    row_item.getCell(7).value = dt_Data[i].DR_OP;  
                    row_item.getCell(8).value = dt_Data[i].CR_OP;  
                    row_item.getCell(9).value = dt_Data[i].DR_PS;  
                    row_item.getCell(10).value = dt_Data[i].CR_PS;   
                    row_item.getCell(11).value = dt_Data[i].DR_ACC;   
                    row_item.getCell(12).value = dt_Data[i].CR_ACC;   
                    row_item.getCell(13).value = dt_Data[i].DR_BL;
                    row_item.getCell(14).value = dt_Data[i].CR_BL;
                    //row_item.getCell(12).value = dt_Data[i].BOLD_YN;   
                    //row_item.getCell(13).value = dt_Data[i].COLOR_CD;      
                    /*if(dt_Data[i].BOLD_YN == 'B')
                    {
                        for(var j =1; j<12; j++)
                        {
                                const _font = { family: 4, bold: true  }
                                row_item.getCell(j).font =  _font;
                                row_item.getCell(j).fill = {type: 'pattern', pattern:'solid', bgColor:{argb: dt_Data[i].COLOR_CD.replace('#','')}};
                        } 
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
            return response.send(Utils.response(false, e.message, null))
        }
    }   
}

module.exports = rpt6045032;