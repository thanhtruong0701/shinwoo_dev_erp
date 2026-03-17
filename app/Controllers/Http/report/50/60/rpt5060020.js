"use strict";
const Helpers = use('Helpers')
const Antl = use("Antl");
const Utils = use("Utils");
const DBService = use("DBService")


var Excel = use('exceljs');
var workbook = new Excel.Workbook();

class rpt5060020 {
    async rpt5060020_1({ request, response, auth }) {
        try {
            debugger
            let { para , warehouse , fromDate , toDate, company  } = request.get(['para', 'warehouse' , 'fromDate' , 'toDate', 'company'])
          
            const user = await auth.getUser()
                //console.log(user)
            if (!user) {
                return response.send(
                    Utils.response(false, "Request failed!", null)
                )
            } else {
                //var objParam = JSON.parse(para);               
                const p_language = request.header("accept-language", "ENG")        
                
                var dtInfo = await DBService.callProcCursor("lg_rpt_basic_info_gsf20", [user.USER_ID],company,p_language )   
                if (dtInfo)
                {
                    dtInfo = dtInfo;  
                }    
                else {
                    return response.send(Utils.response(false, "no_mapping_company", null))
                }  
                var dtDetail = await DBService.callProcCursor("LG_RPT_5060020_1", para, p_language, user.USER_ID)                                              
                if (dtDetail) {
                    dtDetail = dtDetail
                } else {
                    return response.send(Utils.response(false, "no_data_found", null))
                }         
               
        
                const templateFile = Helpers.resourcesPath('report/50/60/rpt5060020_1.xlsx')
                var reportPath = `rpt5060020_1_${user.USER_ID}.xlsx`
                const reportFile = Helpers.tmpPath(reportPath)
                await workbook.xlsx.readFile(templateFile)
                var worksheet = workbook.getWorksheet(1);

                if (dtInfo.length > 0)
                {                    
                    let row1 =  worksheet.getRow(1);   
                    let row2 =  worksheet.getRow(2);   
                    let row3 =  worksheet.getRow(3);   
                    row1.getCell(3).value = dtInfo[0]["PARTNER_NAME"];
                    row2.getCell(3).value = dtInfo[0]["ADDR1"];
                    row3.getCell(3).value = "Tax code: " + dtInfo[0]["TAX_CODE"];                          
        
                    row1.getCell(14).value = "Tell: " + dtInfo[0]["PHONE_NO"];
                    row2.getCell(14).value = "Fax: " + dtInfo[0]["FAX_NO"];                  
                }
                var date = new Date();
                let row3 =  worksheet.getRow(3);                   
                row3.getCell(14).value =  "Print date: " +date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate();

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
                    row.getCell(2).value = element.WH_NAME;                    
                    row.getCell(3).value = element.ITEM_CODE;
                    row.getCell(4).value = element.ITEM_NAME;
                    row.getCell(5).value = element.UOM;
                    row.getCell(6).value = element.BEGIN_QTY;                    
                    row.getCell(7).value = element.OPEN_QTY;
                    row.getCell(8).value = element.INCOME_QTY;
                    row.getCell(9).value = element.PROD_IN_QTY;
                    row.getCell(10).value = element.ASS_IN_QTY;
                    row.getCell(11).value = element.TRANS_IN_QTY;
                    row.getCell(12).value = element.EX_IN_QTY;
                    row.getCell(13).value = element.IN_RETURN_QTY;
                    row.getCell(14).value = element.SPLIT_IN_QTY;
                    row.getCell(15).value = element.OTHERS_IN_QTY;
                    row.getCell(16).value = element.WIP_IN_QTY;
                    row.getCell(17).value = element.TOTAL_IN;
                    row.getCell(18).value = element.OUTGO_QTY;
                    row.getCell(19).value = element.DELI_QTY;
                    row.getCell(20).value = element.PROD_OUT_QTY;
                    row.getCell(21).value = element.ASS_OUT_QTY;
                    row.getCell(22).value = element.TRANS_OUT_QTY;
                    row.getCell(23).value = element.EX_OUT_QTY;
                    row.getCell(24).value = element.OUT_RETURN_QTY;
                    row.getCell(25).value = element.DISCARD_QTY;
                    row.getCell(26).value = element.SPLIT_OUT_QTY;
                    row.getCell(27).value = element.OTHERS_OUT_QTY;
                    row.getCell(28).value = element.ADJ_QTY;
                    row.getCell(29).value = element.TOTAL_OUT;
                    row.getCell(30).value = element.END_QTY;
                    row.commit(); 
                    no = no + 1;       
                    i = i + 1;            
                });

                row =  worksheet.getRow((pos_end));                
                row.getCell(1).value = 'TOTAL'
                worksheet.mergeCells(pos_end,1,pos_end,5);
                row.getCell(1).font = {    bold: true  };
                row.getCell(6).value =  { formula :"SUM(F" + pos +  ":F" + (pos_end-1) + ")"}
                row.getCell(7).value =  { formula :"SUM(G" + pos +  ":G" + (pos_end-1) + ")"}
                row.getCell(8).value =  { formula :"SUM(H" + pos +  ":H" +  (pos_end-1) + ")"}
                row.getCell(9).value =  { formula :"SUM(I" + pos +  ":I" +  (pos_end-1) + ")"}
                row.getCell(10).value =  { formula :"SUM(J" + pos +  ":J" +  (pos_end-1) + ")"}
                row.getCell(11).value =  { formula :"SUM(K" + pos +  ":K" +  (pos_end-1) + ")"}  
                row.getCell(12).value =  { formula :"SUM(L" + pos +  ":L" +  (pos_end-1) + ")"}  
                row.getCell(13).value =  { formula :"SUM(M" + pos +  ":M" +  (pos_end-1) + ")"}  
                row.getCell(14).value =  { formula :"SUM(N" + pos +  ":N" +  (pos_end-1) + ")"}  
                row.getCell(15).value =  { formula :"SUM(O" + pos +  ":O" +  (pos_end-1) + ")"}  
                row.getCell(16).value =  { formula :"SUM(P" + pos +  ":P" +  (pos_end-1) + ")"}  
                row.getCell(17).value =  { formula :"SUM(Q" + pos +  ":Q" +  (pos_end-1) + ")"}  
                row.getCell(18).value =  { formula :"SUM(R" + pos +  ":R" +  (pos_end-1) + ")"}  
                row.getCell(19).value =  { formula :"SUM(S" + pos +  ":S" +  (pos_end-1) + ")"}  
                row.getCell(20).value =  { formula :"SUM(T" + pos +  ":T" +  (pos_end-1) + ")"}  
                row.getCell(21).value =  { formula :"SUM(U" + pos +  ":U" +  (pos_end-1) + ")"}  
                row.getCell(22).value =  { formula :"SUM(V" + pos +  ":V" +  (pos_end-1) + ")"}  
                row.getCell(23).value =  { formula :"SUM(W" + pos +  ":W" +  (pos_end-1) + ")"}  
                row.getCell(24).value =  { formula :"SUM(X" + pos +  ":X" +  (pos_end-1) + ")"}  
                row.getCell(25).value =  { formula :"SUM(Y" + pos +  ":Y" +  (pos_end-1) + ")"}  
                row.getCell(26).value =  { formula :"SUM(Z" + pos +  ":Z" +  (pos_end-1) + ")"}  
                row.getCell(27).value =  { formula :"SUM(AA" + pos +  ":AA" +  (pos_end-1) + ")"}  
                row.getCell(28).value =  { formula :"SUM(AB" + pos +  ":AB" +  (pos_end-1) + ")"}  
                row.getCell(29).value =  { formula :"SUM(AC" + pos +  ":AC" +  (pos_end-1) + ")"}  
                row.getCell(30).value =  { formula :"SUM(AD" + pos +  ":AD" +  (pos_end-1) + ")"}  

                
                row =  worksheet.getRow(5);   
                row.getCell(3).value  =  warehouse
                row.getCell(8).value  = fromDate.substr(0,4)+"/"+fromDate.substr(4,2)+"/"+fromDate.substr(6,2)   + ' - ' + toDate.substr(0,4)+"/"+toDate.substr(4,2)+"/"+toDate.substr(6,2)  ;
                row.commit();           

              
                 await workbook.xlsx.writeFile(reportFile)

               
                return response.attachment(
                    reportFile,
                    `rpt5060020_1_${user.USER_ID}.xlsx` // custom name
                )
            }
        } catch (e) {
            return response.send(Utils.response(false, e.message, null))
        }
    }
    
}

module.exports = rpt5060020;