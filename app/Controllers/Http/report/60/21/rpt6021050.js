"use strict";
const Helpers       = use('Helpers')
const Antl          = use("Antl");
const Utils         = use("Utils");
const DBService     = use("DBService")
var Excel           = use('exceljs');
var workbook        = new Excel.Workbook();
class rpt6021050 {
/*########################################################## Report JH ##################################################################################*/ 
    async rpt_6021050_Buget_Schedule({ request, response, auth }) {
        try 
        { 
            /* var param = [{
                P_RPT_ID: report_info.VAL1,
                P_RPT_URL: report_info.VAL2,
                P_RPT_FILE: report_info.VAL3,
                P_COMP_ID: company_info.PARTNER_ID,
                P_COMP_NM: company_info.TEXT,
                P_COMP_TAX: company_info.TAX_CODE,
                P_COMP_ADD: company_info.ADDR1,
                P_COMPANY: this.selectedCompany,
                P_YEAR: this.dt_Year, 
                P_NHUAN_YN: NHUAN_YN
            }];*/
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

            var _store           = "AC_RPT_6021050_01";
            var _store2          = "AC_RPT_6021050_02";
            var _param           = [ item.P_COMPANY, item.P_YEAR];
             /***************************** Return failded ****************************/
            if (!user) 
            {
                return response.send(Utils.response(false, "Request failed!", null));
            } 
            /****************************** Begin call store and write excell *********/
            else 
            { 
                /********* Call store  ***************/ 
                var dt_Data     = await DBService.callProcCursor(_store, _param, p_language, p_crt_by);   
                if (dt_Data.length >0) 
                {
                    dt_Data = dt_Data;
                } 
                else
                {
                    dt_Data = [];
                }
                var dt_Item     = await DBService.callProcCursor(_store2, _param, p_language, p_crt_by);  
                if (dt_Item.length >0) 
                {
                    dt_Item = dt_Item;
                } else
                {
                    dt_Item = [];
                }
                // else 
                // { 
                //     return response.send(Utils.response(false, "no_data_found", null))
                // }  
                /********* Read file excel ********/ 
                const templateFile = Helpers.resourcesPath(_resourcesPath); 
                await workbook.xlsx.readFile(templateFile);
                var worksheet = workbook.getWorksheet(1);   
                /********* Write file excel ********/
                // console.log("_resourcesPath:",_resourcesPath); 
                /*Set Header */  
                var  r_item;     
                for (var i = 0; i < dt_Data.length; i++) //
                { 
                    var item = dt_Data[i];
                //     // SEQ, YYYYMMDD, HEADERDD, HEADERMM, HEADERYYYY, HEADERDDMMYYY, DAYOFWEEK, COLOR, COL_SEQ
                //     // ROW_PER, TR_DATE_PER, TAC_BG_INFORH_PK_PER, CCY_PER, TR_BOOKAMT_PER, 
                //     // ROW_PLAN, TR_DATE_PLAN, TAC_BG_INFORH_PK_PLAN, CCY_PLAN, TR_BOOKAMT_PLAN
                //     // RATE_KRW, RATE_USD

                    var _rowPlan = Number(item.ROW_PLAN);
                    var _rowPer  = Number(item.ROW_PER); 
                    var _colSeq  = Number(item.COL_SEQ); 
                    if(i < dt_Data.length-1)
                    {
                       // SET HEADER ROW 2 FROM COL 9     
                        r_item = worksheet.getRow(2); 
                        var header_row2 = item.HEADERMM+"월 "+ item.HEADERDD +"일";
                        r_item.getCell(_colSeq).value = header_row2;  
                        if(item.COLOR == 'BLUE')
                        {
                            r_item.getCell(_colSeq).font = {  color: { argb: '0000FF'} };
                        }   
                        if(item.COLOR == 'RED')
                        {
                            r_item.getCell(_colSeq).font = {  color: { argb: 'FF0000'} };
                        }
                        for(let j = 2; j<=8; j++)
                        {
                            r_item.getCell(j).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "A7FFEE" } };
                            r_item.getCell(j).alignment = { vertical: 'middle', horizontal: 'center' };
                            r_item.getCell(j).border = {
                                                            top: {style:'thin', color: {argb:'A6A6A6'}},
                                                            left: {style:'thin', color: {argb:'A6A6A6'}},
                                                            bottom: {style:'thin', color: {argb:'A6A6A6'}},
                                                            right: {style:'thin', color: {argb:'A6A6A6'}}
                                                        };
                        }
                        r_item.getCell(_colSeq).alignment = { vertical: 'middle', horizontal: 'center' };
                        r_item.getCell(_colSeq).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "A7FFEE" } };
                        r_item.getCell(_colSeq).border = {
                                                            top: {style:'thin', color: {argb:'A6A6A6'}},
                                                            left: {style:'thin', color: {argb:'A6A6A6'}},
                                                            bottom: {style:'thin', color: {argb:'A6A6A6'}},
                                                            right: {style:'thin', color: {argb:'A6A6A6'}}
                                                        };  
                    }         
                    // SET HEADER ROW 69 FROM COL 9     
                    r_item = worksheet.getRow(69); 
                    var header_row69 = item.HEADERDDMMYYY;
                    r_item.getCell(_colSeq).value = header_row69;  
                    // SET HEADER ROW 69 FROM COL 9   
                    r_item = worksheet.getRow(86); 
                    var header_row86 = item.HEADERDDMMYYY;
                    r_item.getCell(_colSeq).value = header_row86;                   
                    if(_rowPlan > 0 )
                    {
                        //console.log("_rowPlan:",_rowPlan); 
                        r_item = worksheet.getRow(_rowPlan);    
                        r_item.getCell(_colSeq).value = item.TR_BOOKAMT_PLAN;    
                    }
                    if(_rowPer > 0)
                    {
                        //console.log("_rowPer:",_rowPer);
                        r_item = worksheet.getRow(_rowPer);    
                        r_item.getCell(_colSeq).value = item.TR_BOOKAMT_PER;   
                    }  
                    //Input Rate row 104 usd
                    r_item = worksheet.getRow(104);    
                    r_item.getCell(_colSeq).value = item.RATE_USD;  

                    //Input Rate row 103 krw
                    r_item = worksheet.getRow(103);    
                    r_item.getCell(_colSeq).value = item.RATE_KRW;   

                    r_item.commit(); 
                 }
                 
                 
                     r_item = worksheet.getRow(2);   
                     r_item.getCell(374).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "A7FFEE" } };
                     r_item.getCell(374).alignment = { vertical: 'middle', horizontal: 'center' };
                     r_item.getCell(374).border = {
                                                     top: {style:'thin', color: {argb:'A6A6A6'}},
                                                     left: {style:'thin', color: {argb:'A6A6A6'}},
                                                     bottom: {style:'thin', color: {argb:'A6A6A6'}},
                                                     right: {style:'thin', color: {argb:'A6A6A6'}}
                                                 };
                 
                 
                for (var i = 0; i < dt_Item.length; i++) //
                { 
                    var item = dt_Item[i];
                   // SEQ, YYYYMMDD, HEADERDD, HEADERMM, HEADERYYYY, HEADERDDMMYYY, DAYOFWEEK, COLOR, COL_SEQ, 
                   // ROW_DPS, TAC_BG_INFORH_PK_DPS, CCY_DPS, TR_DATE_DPS, TR_BOOKAMT_DPS, 
                   // ROW_OTHER_DPS, TAC_BG_INFORH_PK_OTHER_DPS, CCY_OTHER_DPS, TR_BOOKAMT_OTHER_DPS
                   // ROW_CASH, TAC_BG_INFORH_PK_CASH, CCY_CASH, TR_BOOKAMT_CASH
                    var _rowDPS  = Number(item.ROW_DPS);
                    var _rowODPS  = Number(item.ROW_OTHER_DPS);
                    var _rowCASH  = Number(item.ROW_CASH);
                    var _colSeq  = Number(item.COL_SEQ); 
 
                    if(_rowDPS > 0 )
                    { 
                        r_item = worksheet.getRow(_rowDPS);    
                        r_item.getCell(_colSeq).value = item.TR_BOOKAMT_DPS;    
                    } 
                    if(_rowODPS > 0 )
                    { 
                        r_item = worksheet.getRow(_rowODPS);    
                        r_item.getCell(_colSeq).value = item.TR_BOOKAMT_OTHER_DPS;    
                    } 
                    if(_rowCASH > 0 )
                    { 
                        r_item = worksheet.getRow(_rowCASH);    
                        r_item.getCell(_colSeq).value = item.TR_BOOKAMT_CASH;    
                    } 

                    r_item.commit(); 
                 }
                 
                /*==============Set formula============================*/
                //  console.log(max_col); 
                //  console.log("ROW",worksheet.getRow(2).);
                //  console.log("ROW",worksheet.getRow(2).getCell(9))
                var max_col     = dt_Data[dt_Data.length-2].COL_SEQ;
                var max_col_nm  = worksheet.getRow(2).getCell(max_col)._address;
                var max_col_add = max_col_nm.replace(/[0-9]/g, '');
                for(let h = 6; h<=54; h++)
                {
                    if(h!=15 && h!=19 && h!=23 && h!=24 && h!=40 && h!=46 && h!=50 )
                    {
                        worksheet.getCell("H"+h).value   = { formula :"SUM(I"+h+":"+max_col_add+""+h+")"};
                    } 
                }

                worksheet.getCell("H50").value   = { formula :"SUM(H51:H54)+SUM(I50:"+max_col_add+"50)"};//master7

                for(var j = 8; j<=max_col+2; j++)
                { 
                    if(j<=max_col)
                    {
                        if(j ==8 )
                        {
                            worksheet.getCell("H3").value = { formula :"NK82"};
                        }
                        else if(j == 9 )
                        {
                            worksheet.getCell("I3").value = { formula :"H3"};
                        }
                        else
                        {
                            var col_add3 = worksheet.getRow(2).getCell(j)._address;
                            var col_nm3 = col_add3.replace(/[0-9]/g, '')  ;
                            var col_add31 = worksheet.getRow(2).getCell(j-1)._address;
                            var col_nm31 = col_add31.replace(/[0-9]/g, '')  ;
                            worksheet.getCell(""+col_nm3+"3").value = { formula :""+col_nm31+"55"};
                        }

                        var col_add = worksheet.getRow(2).getCell(j)._address;
                        var col_nm = col_add.replace(/[0-9]/g, '') ;
                        worksheet.getCell(col_nm+"5" ).value = { formula :"SUM("+col_nm+"6:"+col_nm+"14)"};  //("H5")  "SUM(H6:H14)"; //master1
                        worksheet.getCell(col_nm+"15").value = { formula :"SUM("+col_nm+"16:"+col_nm+"18)"};// ("H15") "SUM(H16:H18)";//master2
                        worksheet.getCell(col_nm+"19").value = { formula :"SUM("+col_nm+"20:"+col_nm+"22)"};// ("H19") "SUM(H20:H22)";//master3 
                        worksheet.getCell(col_nm+"4").value = { formula :"SUM("+col_nm+"5,"+col_nm+"15,"+col_nm+"19)"}; //("H4") SUM(H5,H15,H19);//sum master1, master2, master3

                        worksheet.getCell(col_nm+"24" ).value = { formula :"SUM("+col_nm+"25:"+col_nm+"39)"};  //("H24")  =SUM(H25:H39);  
                        worksheet.getCell(col_nm+"40").value = { formula :"SUM("+col_nm+"41:"+col_nm+"45)"};// ("H40") =SUM(H41:H45); 
                        worksheet.getCell(col_nm+"46").value = { formula :"SUM("+col_nm+"47:"+col_nm+"49)"};// ("H46") =SUM(H47:H49); 
                        worksheet.getCell(col_nm+"23").value = { formula :"SUM("+col_nm+"24,"+col_nm+"40,"+col_nm+"46)"}; //("H23") H24,H40,H46; 

                        worksheet.getCell(col_nm+"55").value = { formula :"("+col_nm+"3+"+col_nm+"4+"+col_nm+"23+"+col_nm+"50)"}; //("H55") =H3+H4-H23+H50 
                        //  console.log("("+col_nm+"3+"+col_nm+"4+"+col_nm+"23+"+col_nm+"50)");
                    }
                    if(j!=max_col+1)
                    {
                        if(j>8)
                        { 
                            col_add = worksheet.getRow(2).getCell(j)._address;
                            col_nm = col_add.replace(/[0-9]/g, '') ;
                            /*E-branch 69*/
                            worksheet.getCell(col_nm+"70" ).value = { formula :""+col_nm+"87/"+col_nm+"$103"};  //("I70")  =I87/I$103
                            worksheet.getCell(col_nm+"72" ).value = { formula :""+col_nm+"89/"+col_nm+"$103"};  //("I72")  =I89/I$103
                            worksheet.getCell(col_nm+"73" ).value = { formula :""+col_nm+"90/"+col_nm+"$103"};  //("I73")  =I90/I$103
                            worksheet.getCell(col_nm+"74" ).value = { formula :""+col_nm+"91/"+col_nm+"$103"};  //("I74")  =I91/I$103 
                            worksheet.getCell(col_nm+"76" ).value = { formula :""+col_nm+"93/"+col_nm+"$103"};  //("I76")  =I93/I$103 
                            worksheet.getCell(col_nm+"82" ).value = { formula :"SUM("+col_nm+"72:"+col_nm+"76)+"+col_nm+"70"};  //("I82")  =SUM(I72:I76)+I70  
                            worksheet.getCell(col_nm+"83" ).value = { formula :"("+col_nm+"57+"+col_nm+"59)-"+col_nm+"76*"+col_nm+"$103"};  //("I83")  =+(I57+I59)-I76*I$103 
                            worksheet.getCell(col_nm+"84" ).value = { formula :""+col_nm+"55-"+col_nm+"82-"+col_nm+"83"};  //("I84") =+I55-I82-I83
                            worksheet.getCell(col_nm+"85" ).value = { formula :""+col_nm+"89+"+col_nm+"90+"+col_nm+"91-"+col_nm+"56"};  //("I85") =I89+I90+I91-I56
                            /*E-branch 86*/
                            worksheet.getCell(col_nm+"93" ).value = { formula :"SUM("+col_nm+"94:"+col_nm+"98)"};  //("I93")  =SUM(I94:I98) 
                            worksheet.getCell(col_nm+"99" ).value = { formula :"SUM("+col_nm+"89:"+col_nm+"93)"};  //("I99")  =SUM(I89:I93)
                            worksheet.getCell(col_nm+"100" ).value = { formula :"-"+col_nm+"57+"+col_nm+"93"};  //("I100")  =-I57+I93
                        }
                    }
                } 
                /* row 56 to 68 */
                worksheet.getCell("D56").value = { formula :"MIN(I56:"+max_col_add+"56)"}; // (D56) =MIN(I56:NI56)
                worksheet.getCell("D57").value = { formula :"MIN(I57:"+max_col_add+"57)"}; // (D57) =MIN(I57:NI57)
                worksheet.getCell("D58").value = { formula :"MIN(I58:"+max_col_add+"58)"}; // (D58) =MIN(I58:NI58)
                worksheet.getCell("D59").value = { formula :"MIN(I59:"+max_col_add+"59)"}; // (D59) =MIN(I59:NI59)
                worksheet.getCell("D60").value = { formula :"MIN(I60:"+max_col_add+"60)"}; // (D60) =MIN(I60:NI60)

                worksheet.getCell("H56").value = { formula :""+max_col_add+"56"}; // (H56) NJ56 
                worksheet.getCell("H57").value = { formula :""+max_col_add+"57"}; // (H57) NJ57 
                worksheet.getCell("H58").value = { formula :""+max_col_add+"58"}; // (H58) NJ58 
                worksheet.getCell("H59").value = { formula :""+max_col_add+"59"}; // (H59) NJ59 
                worksheet.getCell("H60").value = { formula :""+max_col_add+"60"}; // (H60) NJ60 
                worksheet.getCell("H61").value = { formula :""+max_col_add+"61"}; // (H61) NJ61 
                worksheet.getCell("H62").value = { formula :""+max_col_add+"62"}; // (H62) NJ62 

                for(let z = 56; z<=62; z++ )
                {
                    for(let x = 9; x<=max_col; x++)
                    {  
                            if(x == 9 )
                            {
                                worksheet.getCell("I"+z+"").value = { formula :"NK"+z+""};
                                worksheet.getCell("I63").value = { formula :"I59/I60"};// 63 =+I59/I60
                                worksheet.getCell("I64").value = { formula :"I57/I58"};// 64 =+I57/I58
                            }
                            else
                            {
                                let col_addx = worksheet.getRow(2).getCell(x)._address
                                let col_nmx = col_addx.replace(/[0-9]/g, '')  
                                let col_addx1 = worksheet.getRow(2).getCell(x-1)._address
                                let col_nmx1 = col_addx1.replace(/[0-9]/g, '')  
                                worksheet.getCell(""+col_nmx+""+z).value = { formula :""+col_nmx1+""+z};

                                
                                worksheet.getCell(""+col_nmx+"63").value = { formula :""+col_nmx+"59/"+col_nmx+"60"};// 63 =+I59/I60
                                worksheet.getCell(""+col_nmx+"64").value = { formula :""+col_nmx+"57/"+col_nmx+"58"};// 64 =+I57/I58
                            } 
                    } 
                }

                   
 
                    worksheet.getCell("H65").value = { formula :"MIN(I55:"+max_col_add+"55)"}; // (H65)MIN(I55:NJ55)
                    worksheet.getCell("H66").value = { formula :"SMALL(I55:"+max_col_add+"55,2)"}; // (H66)SMALL(I55:NJ55,2)
                    worksheet.getCell("H67").value = { formula :"MAX(I55:"+max_col_add+"55)"}; // (H67)MAX(I55:NJ55)
                    worksheet.getCell("H68").value = { formula :"AVERAGE(I55:"+max_col_add+"55)"}; // (H68)AVERAGE(I55:NJ55)

                    worksheet.getCell("G65").value = { formula :"INDEX(I2:"+max_col_add+"2,MATCH(H65,I55:"+max_col_add+"55,0))"};  // (G65) INDEX(I2:NJ2,MATCH(H65,I55:NJ55,0))
                    worksheet.getCell("G66").value = { formula :"=INDEX(I2:"+max_col_add+"2,MATCH(H66,I55:"+max_col_add+"55,0))"}; // (G66) INDEX(I2:NJ2,MATCH(H66,I55:NJ55,0))
                    // let year1 =item.P_YEAR;
                    // worksheet.getCell("NK69").value = "31/12/"+year1;
                    // worksheet.getCell("NK86").value = "31/12/"+year1;

                
                
                
                
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

module.exports = rpt6021050;

/*-- === vng-154 dvg ===--*/