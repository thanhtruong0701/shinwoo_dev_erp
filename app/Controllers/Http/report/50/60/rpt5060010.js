"use strict";
const Helpers = use('Helpers')
const Antl = use("Antl");
const Utils = use("Utils");
const DBService = use("DBService")


var Excel = use('exceljs');
var workbook = new Excel.Workbook();

class rpt5060010 {
    async report1({ request, response, auth }) {
        try {
            let { para , warehouse , fromDate , toDate  } = request.get(['para', 'warehouse' , 'fromDate' , 'toDate'])
          
            const user = await auth.getUser()
                //console.log(user)
            if (!user) {
                return response.send(
                    Utils.response(false, "Request failed!", null)
                )
            } else {
                //var objParam = JSON.parse(para);               
                const p_language = request.header("accept-language", "ENG")        
                      

                var dtDetail = await DBService.callProcCursor("LG_RPT_5060010_GRID", para, p_language, user.USER_ID)                              
                if (dtDetail) {
                    dtDetail = dtDetail
                } else {
                    return response.send(Utils.response(false, "no_data_found", null))
                }         
             
                const templateFile = Helpers.resourcesPath('report/50/60/rpt5060010.xlsx')
                var reportPath = `rpt5060010_${user.USER_ID}.xlsx`
                const reportFile = Helpers.tmpPath(reportPath)
                await workbook.xlsx.readFile(templateFile)
                var worksheet = workbook.getWorksheet(1);

                var pos = 8;
                var no = 1;
                var i = 0;      
                if(dtDetail.length>2){
                    worksheet.duplicateRow(pos,dtDetail.length,false);
                }     
                var row = 0        
                var pos_end = pos             
                dtDetail.forEach(element => {        
                    row = worksheet.getRow(pos + i);                                       
                    pos_end = pos_end + 1     
                    row.getCell(1).value = no;
                    row.getCell(2).value = element.GRP_NM;
                    row.getCell(3).value = element.WH_NAME;
                    row.getCell(4).value = element.ITEM_CODE;
                    row.getCell(5).value = element.ITEM_NAME;
                    row.getCell(6).value = element.UOM;
                    row.getCell(7).value = element.STOCK_QTY;                    
                    row.getCell(8).value = element.BEGIN_QTY;
                    row.getCell(9).value = element.IN_QTY;
                    row.getCell(10).value = element.OUT_QTY;
                    row.getCell(11).value = element.END_QTY;
                    row.commit(); 
                    no = no + 1;       
                    i = i + 1;            
                });

                row =  worksheet.getRow((pos_end));                
                row.getCell(1).value = 'TOTAL'
                worksheet.mergeCells(pos_end,1,pos_end,6);
                row.getCell(1).font = {    bold: true  };
                row.getCell(7).value =  { formula :"SUM(G" + pos +  ":G" + (pos_end-1) + ")"}
                row.getCell(8).value =  { formula :"SUM(H" + pos +  ":H" +  (pos_end-1) + ")"}
                row.getCell(9).value =  { formula :"SUM(I" + pos +  ":I" +  (pos_end-1) + ")"}
                row.getCell(10).value =  { formula :"SUM(J" + pos +  ":J" +  (pos_end-1) + ")"}
                row.getCell(11).value =  { formula :"SUM(K" + pos +  ":K" +  (pos_end-1) + ")"}  
                
                row =  worksheet.getRow(6);   
                row.getCell(1).value  ='W/H Name ' +  warehouse
                row.getCell(12).value  ='Date: ' +  fromDate  + '-' + toDate
                row.commit();           

              
                 await workbook.xlsx.writeFile(reportFile)

               
                return response.attachment(
                    reportFile,
                    `rpt5060010_${user.USER_ID}.xlsx` // custom name
                )
            }
        } catch (e) {
            return response.send(Utils.response(false, e.message, null))
        }
    }
    
}

module.exports = rpt5060010;