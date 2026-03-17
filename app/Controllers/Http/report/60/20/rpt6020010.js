"use strict";
const Helpers       = use('Helpers')
const Antl          = use("Antl");
const Utils         = use("Utils");
const DBService = use("DBService")
var Excel           = use('exceljs');
var workbook        = new Excel.Workbook();
class rpt6020010 {
/*########################################################## Report JH ##################################################################################*/ 
    async export_excel({ request, response, auth }) {
        try {
             /********* Parse pram to json ********/
            let { para }        = request.get(['para']);
            var item            = JSON.parse(para); 
            console.log(item);
            const user = await auth.getUser()
            if (!user) {
                return response.send(
                    Utils.response(false, "Request failed!", null)
                )
            } else {
                let dtDetail = await DBService.callProcCursor("AC_RPT_6020010_POPUP",[item.p_MonthFrom, item.p_MonthTo,item.P_date_from,item.P_date_to,item.P_Currency,item.P_Company_Pk, item.P_TYPE], "ENG", user.USER_ID)
                /*if (dtDetail.p_rtn_cur) {
                    dtDetail = dtDetail.p_rtn_cur
                } else {
                    return response.send(Utils.response(false, "no_data_found", null))
                } */
                
                let pos = 5;
                //console.log(dtDetail);
                const templateFile = Helpers.resourcesPath('report/60/20/6020010.xlsx')
                const reportFile = Helpers.tmpPath(`6020010_${user.USER_ID}.xlsx`)
                await workbook.xlsx.readFile(templateFile)
                let worksheet = workbook.getWorksheet(1);

                worksheet.getCell('A1').value = item.P_Company_Nm[0].TEXT;
                worksheet.getCell('A3').value = "From : "+ item.P_date_from.substring(6)+"/"+ item.P_date_from.substring(4,6)+ "/"+ item.P_date_from.substring(0,4) + "  -  " + "To : "  + item.P_date_to.substring(6)+"/"+ item.P_date_to.substring(4,6)+ "/"+ item.P_date_to.substring(0,4);
                worksheet.getCell('H6').value = "Date "+ item.P_date_to.substring(6)+" month "+ item.P_date_to.substring(4,2)+ " year "+ item.P_date_to.substring(0,4);
                if(dtDetail.length>1)
                {
                     worksheet.duplicateRow(pos,dtDetail.length-1,true);
                }  
                for (var i = 0; i < dtDetail.length; i++) 
                {
                    var row_item = worksheet.getRow(pos + i);
                    row_item.getCell(1).value = i + 1;
                    row_item.getCell(2).value = dtDetail[i].STD_YM;
                    row_item.getCell(3).value = dtDetail[i].CODE_NM;    
                    row_item.getCell(4).value = dtDetail[i].TTB_RATE;  
                    row_item.getCell(5).value = dtDetail[i].TTS_RATE;  
                    row_item.getCell(6).value = dtDetail[i].TTM_RATE;  
                    row_item.getCell(7).value = dtDetail[i].TTMP_RATE;  
                    row_item.getCell(8).value = dtDetail[i].TTMP_6;  
                    row_item.getCell(9).value = dtDetail[i].TTMP_7;  
                    

                }   
                row_item.commit();
                await workbook.xlsx.writeFile(reportFile)
                return response.attachment(reportFile)
            }
        } catch (e) {
            return response.send(Utils.response(false, e.message, null))
        }
    }

}

module.exports = rpt6020010;