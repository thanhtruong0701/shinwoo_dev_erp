"use strict";

const { Workbook } = require("exceljs");

const Helpers = use('Helpers')
const Antl = use("Antl");
const Utils = use("Utils");
const DBService = use("DBService")
var Excel = use('exceljs');
var workbook = new Excel.Workbook();
class rpt6060010 {
    async Report1({ request, response, auth }) {
        try {
            const { proc, para } = request.all()
                //const result = await DBService.callProcCursor(proc, para, "ENG", "123")
                //const user = result.[0]

            const user = await auth.getUser()
            if (!user) {
                return response.send(
                    Utils.response(false, "Request failed!", null)
                )
            } else {
                
                let dtMaster = await DBService.callProcCursor("AC_RPT_6060010_MST", para, p_language, user.USER_ID)
                if (dtMaster) {
                    dtMaster = dtMaster
                }else {
                    return response.send(Utils.response(false, "no_data_found", null))
                }

                let dtDetail_code = await DBService.callProcCursor("AC_RPT_6060010_CODE", para, p_language, user.USER_ID)
                if (dtDetail_code) {
                    dtDetail_code = dtDetail_code
                } else {
                    return response.send(Utils.response(false, "no_data_found", null))
                }
                let dtDetail = await DBService.callProcCursor("AC_RPT_6060010_DETAILS", para, p_language, user.USER_ID)
                if (dtDetail) {
                    dtDetail = dtDetail
                } else {
                    return response.send(Utils.response(false, "no_data_found", null))
                } 
                
                const templateFile = Helpers.resourcesPath('report/60/60/6060010.xlsx')
                const reportFile = Helpers.tmpPath(`6060010_${user.USER_ID}.xlsx`)
                await workbook.xlsx.readFile(templateFile)
                let worksheet = workbook.getWorksheet(1);
                worksheet.getCell('D7').value = dtMaster[0].PARTNER_NAME;
                worksheet.getCell('J7').value = dtMaster[0].VOUCHERNO + "/" + dtMaster[0].SEQ;    

                worksheet.getCell('D8').value = dtMaster[0].ORG_NM;
                worksheet.getCell('J8').value = dtMaster[0].TRANS_DATE;   

                worksheet.getCell('D10').value = dtMaster[0].BOOK_AMT;
                worksheet.getCell('J10').value = dtMaster[0].PRO_BY;  

                worksheet.getCell('D11').value = dtMaster[0].CODE_CCY;
                worksheet.getCell('J11').value = dtMaster[0].SIGN_DATE;  

                worksheet.getCell('D12').value = dtDetail[0].BK_RATE;
                worksheet.getCell('J12').value = dtMaster[0].APP_BY;  

                worksheet.getCell('D13').value = dtMaster[0].TR_TYPE;
                worksheet.getCell('J13').value = dtMaster[0].TR_TPNM;  

                worksheet.getCell('D14').value = dtMaster[0].REMARK;
                worksheet.getCell('J14').value = dtMaster[0].REMARK2;  

                worksheet.getCell('D15').value = dtMaster[0].TR_ENCLOSE;

                row.commit();
                await workbook.xlsx.writeFile(reportFile)
                return response.attachment(reportFile)
            }
        } catch (e) {
            return response.send(Utils.response(false, e.message, null))
        }
    }
    async onEinvoiceDraft({ request, response, auth }) {
        try {
            let { para }        = request.get(['para']);
            var item            = JSON.parse(para); 
            var file_nm         = [item.P_RPT_FILE];
            var _param          = [ item.P_M_PK]; 
            //const { proc, para } = request.all()
                //const result = await DBService.callProcCursor(proc, para, "ENG", "123")
                //const user = result.[0]
            const user = await auth.getUser()
            //console.log(user);
            if (!user) {
                return response.send(
                    Utils.response(false, "Request failed!", null)
                )
            } else {
                let dtMaster = await DBService.callProcCursor("AC_RPT_6060010_TAC_CRCA", _param, 'ENG', user.USER_ID)
                let dtDetail_code = await DBService.callProcCursor("AC_RPT_6060010_TAC_CRCAD", _param, 'ENG', user.USER_ID)
                //console.log(dtMaster);
                const reportFile = Helpers.tmpPath(`6060010_${user.USER_ID}.xlsx`)
                if(item.P_TEI_COMPANY_PK == '482' || item.P_TEI_COMPANY_PK == '483' )
                {
                    const templateFile = Helpers.resourcesPath('report/60/60/rpt_6060010_Draft.xlsx')
                   
                    await workbook.xlsx.readFile(templateFile)

                    let worksheet = workbook.getWorksheet(1);

                    worksheet.getCell('Y2').value = dtMaster[0].FORM_NO;

                    worksheet.getCell('Y3').value = dtMaster[0].SERIAL_NO;    

                    //worksheet.getCell('F4').value = "Ngày (Date) "+ dtMaster[0].DAY  +"  tháng (month) "+ dtMaster[0].MONTH +"  năm (year)    " +dtMaster[0].YEAR;
                    //worksheet.getCell('S4').value = dtMaster[0].INVOICE_NO+ "      " ;   

                    worksheet.getCell('L7').value = dtMaster[0].PARTNER_NAME ;     

                    worksheet.getCell('H8').value = dtMaster[0].TAX_CODE_CUS ; 

                    worksheet.getCell('G9').value = dtMaster[0].ADDR1_COM;
                    
                    worksheet.getCell('F10').value = dtMaster[0].PHONE_NO; 
                    worksheet.getCell('N10').value = "Fax: "+dtMaster[0].FAX_NO;

                    worksheet.getCell('J11').value = dtMaster[0].CUST_BANK_ACCOUNT_NM  ;

                    worksheet.getCell('I12').value = dtMaster[0].CUST_BANK_ACCOUNT ;
                    worksheet.getCell('S12').value = dtMaster[0].REPRESENTATIVE ;
                    
                    worksheet.getCell('N15').value = dtMaster[0].BUYER_NAME;
                    worksheet.getCell('K16').value = dtMaster[0].IMPORTER_NM ;
                    worksheet.getCell('H17').value = dtMaster[0].TAX_CODE;
                    worksheet.getCell('G18').value = dtMaster[0].ADDR1;

                    worksheet.getCell('X19').value = dtMaster[0].DUE_DATE_R; 
                    worksheet.getCell('M19').value = dtMaster[0].PAYMEMT; 

                    worksheet.getCell('P20').value = dtMaster[0].TR_DATE_R; 
                    worksheet.getCell('S20').value = dtMaster[0].PERIOD;    

                    worksheet.getCell('W37').value = dtMaster[0].TOT_NET_TR_AMT; 

                    worksheet.getCell('W38').value = dtMaster[0].TOT_VAT_TR_AMT; 
                    worksheet.getCell('K38').value = dtMaster[0].VAT_RATE; 

                    worksheet.getCell('W39').value = dtMaster[0].TOTAL_TR; 

                    worksheet.getCell('L40').value = await Utils.Num2VNText(dtMaster[0].AMOUNT, dtMaster[0].TR_CCY);   
                    for (var i = 0; i < dtDetail_code.length; i++) 
                    {
                        var row_item = worksheet.getRow(25 + i); 
                    // worksheet.unMergeCells(pos + i,1,pos + i,25);
                        row_item.getCell(1).value   = dtDetail_code[i].SEQ_DIS;
                        row_item.getCell(3).value   = dtDetail_code[i].ITEM_NAME;
                        row_item.getCell(16).value   = dtDetail_code[i].ITEM_UOM;
                        row_item.getCell(17).value   = dtDetail_code[i].QTY;
                        row_item.getCell(20).value   = dtDetail_code[i].U_PRICE;
                        row_item.getCell(23).value   = dtDetail_code[i].EXT_PRICE;
                        
                                            
                        row_item.commit();
                    }

                }else if(item.P_TEI_COMPANY_PK == '662')
                {
                    const templateFile = Helpers.resourcesPath('report/60/60/rpt_6060010_Draft_KPX.xlsx')
                    
                    await workbook.xlsx.readFile(templateFile)

                    let worksheet = workbook.getWorksheet(1);

                    worksheet.getCell('I2').value = dtMaster[0].TAX_CODE_CUS ; 

                    worksheet.getCell('I3').value = dtMaster[0].ADDR1_COM;  

                    worksheet.getCell('I4').value = dtMaster[0].PHONE_NO;

                    worksheet.getCell('Q12').value = dtMaster[0].FORM_NO + dtMaster[0].SERIAL_NO;  

                    //worksheet.getCell('F4').value = "Ngày (Date) "+ dtMaster[0].DAY  +"  tháng (month) "+ dtMaster[0].MONTH +"  năm (year)    " +dtMaster[0].YEAR;
                    //worksheet.getCell('S4').value = dtMaster[0].INVOICE_NO+ "      " ;   

                    worksheet.getCell('H17').value = dtMaster[0].BUYER_NAME ;    

                    worksheet.getCell('F18').value = dtMaster[0].IMPORTER_NM ;     

                    worksheet.getCell('E19').value = "    "  + dtMaster[0].TAX_CODE;

                    worksheet.getCell('E20').value = dtMaster[0].ADDR1;

        
                    worksheet.getCell('G21').value = "    "  + dtMaster[0].PAYMEMT; 

                    worksheet.getCell('F22').value = dtMaster[0].ORDER_CCY; 

                    worksheet.getCell('Q22').value = dtMaster[0].EXCHANGERATE; 


                   // worksheet.getCell('S20').value = dtMaster[0].PERIOD;    

                    worksheet.getCell('P37').value = dtMaster[0].TOT_NET_TR_AMT; 

                    worksheet.getCell('P38').value = dtMaster[0].TOT_VAT_TR_AMT; 
                    worksheet.getCell('F38').value = dtMaster[0].VAT_RATE; 

                    worksheet.getCell('P39').value = dtMaster[0].TOTAL_TR; 

                    worksheet.getCell('G40').value = await Utils.Num2VNText(dtMaster[0].AMOUNT, dtMaster[0].TR_CCY);   
                    for (var i = 0; i < dtDetail_code.length; i++) 
                    {
                        var row_item = worksheet.getRow(27 + i); 
                    // worksheet.unMergeCells(pos + i,1,pos + i,25);
                        row_item.getCell(1).value   = dtDetail_code[i].SEQ_DIS;
                        row_item.getCell(3).value   = dtDetail_code[i].ITEM_NAME;
                        row_item.getCell(9).value   = dtDetail_code[i].ITEM_UOM;
                        row_item.getCell(11).value   = dtDetail_code[i].QTY;
                        row_item.getCell(14).value   = dtDetail_code[i].U_PRICE;
                        row_item.getCell(17).value   = dtDetail_code[i].EXT_PRICE;
                        
                                            
                        row_item.commit();
                    }
                }
                else if(item.P_TEI_COMPANY_PK == '642')
                {
                    const templateFile = Helpers.resourcesPath('report/60/60/rpt_6060010_Draft_DY.xlsx')
                    
                    await workbook.xlsx.readFile(templateFile)

                    let worksheet = workbook.getWorksheet(2);


                  

                    worksheet.getCell('P4').value = dtMaster[0].FORM_NO + dtMaster[0].SERIAL_NO;  

                //     // worksheet.getCell('G18').value = dtMaster[0].BUYER_NAME ;   
                //     // worksheet.getCell('F19').value = dtMaster[0].TAX_CODE_CUS ; 
                //     // worksheet.getCell('I3').value = dtMaster[0].ADDR1_COM;  
                //     // worksheet.getCell('I4').value = dtMaster[0].PHONE_NO;


                    //worksheet.getCell('F4').value = "Ngày (Date) "+ dtMaster[0].DAY  +"  tháng (month) "+ dtMaster[0].MONTH +"  năm (year)    " +dtMaster[0].YEAR;
                    //worksheet.getCell('S4').value = dtMaster[0].INVOICE_NO+ "      " ;   

                    worksheet.getCell('G18').value = dtMaster[0].BUYER_NAME ;    

                    worksheet.getCell('F19').value = dtMaster[0].IMPORTER_NM ;     

                    worksheet.getCell('E20').value = "    "  + dtMaster[0].TAX_CODE;

                    worksheet.getCell('D21').value = ":  "+ dtMaster[0].ADDR1;

        
                    worksheet.getCell('G22').value = dtMaster[0].PAYMEMT; 

                    worksheet.getCell('O22').value = dtMaster[0].ORDER_CCY; 

                    worksheet.getCell('B37').value = dtMaster[0].EXCHANGERATE; 


                   // worksheet.getCell('S20').value = dtMaster[0].PERIOD;    

                    worksheet.getCell('O37').value = dtMaster[0].TOT_NET_TR_AMT; 

                    worksheet.getCell('O38').value = dtMaster[0].TOT_VAT_TR_AMT; 
                    worksheet.getCell('E38').value = dtMaster[0].VAT_RATE; 

                    worksheet.getCell('O39').value = dtMaster[0].TOTAL_TR; 

                    worksheet.getCell('F40').value = await Utils.Num2VNText(dtMaster[0].AMOUNT, dtMaster[0].TR_CCY);   
                    for (var i = 0; i < dtDetail_code.length; i++) 
                    {
                        var row_item = worksheet.getRow(27 + i); 
                    // worksheet.unMergeCells(pos + i,1,pos + i,25);
                        row_item.getCell(2).value   = dtDetail_code[i].SEQ_DIS;
                        row_item.getCell(3).value   = dtDetail_code[i].ITEM_NAME;
                        row_item.getCell(8).value   = dtDetail_code[i].ITEM_UOM;
                        row_item.getCell(9).value   = dtDetail_code[i].QTY;
                        row_item.getCell(12).value   = dtDetail_code[i].U_PRICE;
                        row_item.getCell(15).value   = dtDetail_code[i].EXT_PRICE;
                        
                                            
                        row_item.commit();
                    }
                }

                await workbook.xlsx.writeFile(reportFile)
                if( item.P_FILE_TYPE ==".xlsx")
                {  
                    return response.attachment( reportFile, file_nm + item.P_FILE_TYPE );
                }

                if( item.P_FILE_TYPE ==".pdf")
                { 
                    const reportFilePdf =  await Utils.excelToPdf(reportFile);
                    return response.attachment( reportFilePdf, file_nm + item.P_FILE_TYPE );
                }
            } 
            
        } catch (e) {
            console.log(e)
             Utils.Logger({ LVL: "error", MODULE: "Report", FUNC: "Picking_list", CONTENT: e.message }) 
            return response.send(Utils.response(false, e.message, null))
        }
    }

}

module.exports = rpt6060010;