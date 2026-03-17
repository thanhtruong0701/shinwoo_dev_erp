"use strict";

const { DATE } = require("oracledb");

const Helpers       = use('Helpers')
const Antl          = use("Antl");
const Utils         = use("Utils");
const DBService = use("DBService")
var Excel           = use('exceljs');
var workbook        = new Excel.Workbook();
class rpt6030080 {
/*########################################################## Report JH ##################################################################################*/ 
    async rpt_6030080_Daily_Entry_Inq_CF({ request, response, auth }) {
        try 
        { 
          /* P_RPT_ID: report_info.VAL1, P_RPT_URL: report_info.VAL2, P_RPT_FILE: report_info.VAL3,
            P_COMP_ID: company_info.PARTNER_ID, P_COMP_NM: company_info.TEXT, P_COMP_TAX: company_info.TAX_CODE, P_COMP_ADD: company_info.ADDR1,
            P_COMPANY: this.selectedCompany, P_FR_DATE: this.proposedFrom, P_FR_TO: this.proposedTo, P_VOUCHER_NO: this.voucherNo, P_SEQ: this.seq, 
            P_STATUS: this.status, P_ACC_DR_PK: this.accCodeDebitPK, P_ACC_CR_PK: this.accCodeCreditPK, P_DIRECTCODE_PK: this.directCodePK, 
            P_InDIRECTCODE_PK: this.inDirectCodePK, P_LANG : this.selectedLang, P_TCO_BUSPLACE_PK : this.lstBizPlace
            */
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
            var _store          = "AC_RPT_6030080_DAILY_ENINQ_CF";
            //var _circular       = "AC_SEL_GET_TT_BPL";
            var _param          = [item.P_COMPANY, item.P_FR_DATE, item.P_FR_TO, item.P_VOUCHER_NO, item.P_SEQ, item.P_STATUS, item.P_ACC_DR_PK , item.P_ACC_CR_PK, item.P_DIRECTCODE_PK, item.P_InDIRECTCODE_PK];
          //  var _param_TT       = [item.P_CIRCULARS, item.P_TCO_BUSPLACE_PK];
            //var v_fdate = "Từ ngày ", e_fdate = "From ", k_fdate ="부터 ", v_tdate = " đến ngày", e_tdate = " to", k_tdate =" 까지";
            //var v_month = " Tháng này", e_month = " This month", k_month = " 이번 달"; 
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
                if (dt_Data.length > 0) 
                {
                    dt_Data = dt_Data;
                } 
                else 
                {
                    //dt_Data = dt_Data;
                    return response.send(Utils.response(false, "no_data_found", null))
                } 
                 /********* Call store sign ***************/ 
                //  var dt_Data_sign  = await DBService.callProcCursor(_store_sign, _param_sign, p_language, p_crt_by); 
                //  if (dt_Data_sign) 
                //  {
                //      dt_Data_sign = dt_Data_sign;
                //  } 
                 /****************Call CIRCULARS******************/
                // var dt_TT  = await DBService.callProcCursor(_circular, _param_TT , p_language , p_crt_by); 
                // if (dt_TT.length>0) 
                // {
                //     dt_TT = dt_TT;
                // } 
                // else 
                // {
                //     return response.send(Utils.response(false, "no_data_found", null))
                // } 
                var _dictionary     = await DBService.callProcCursor("GET_DICTIONARY_REPORT", null, p_language, p_crt_by); 
                if (_dictionary.length>0) 
                {
                    _dictionary = _dictionary;
                } 
                else 
                {    
                    _dictionary = [];
                } 
                /********* Read file excel ********/ 
                const templateFile  = Helpers.resourcesPath(_resourcesPath); 
                await workbook.xlsx.readFile(templateFile);
                var worksheet       = workbook.getWorksheet(1);
                /********* Write file excel ********/
               
                //INFOMATION COMPANY
                // var r_item = worksheet.getRow(1);
                // r_item.getCell(1).value = Utils.translate("COMPANY",_dictionary , p_language) + ": " + COMP_ID +" - "+COMP_NM;    
                // r_item = worksheet.getRow(2);
                // r_item.getCell(1).value = Utils.translate("TAX_CODE",_dictionary, p_language) + ": "+ COMP_TAX;   
                // r_item = worksheet.getRow(3);
                // r_item.getCell(1).value = Utils.translate("ADDRESS",_dictionary , p_language) + ": "+ COMP_ADD;
                worksheet.getCell("A1").value = Utils.translate("COMPANY",_dictionary , p_language) + ": " + COMP_ID +" - "+COMP_NM; 
                var FromDate = item.P_FR_DATE;
                var ToDate   = item.P_FR_TO;
                var strFrDate = FromDate.substr(6,2) + "/"+ FromDate.substr(4,2)+ "/"+ FromDate.substr(0,4);
                var strToDate = ToDate.substr(6,2) + "/"+ ToDate.substr(4,2)+ "/"+ ToDate.substr(0,4);
                worksheet.getCell("A3").value = "Prososed" + ": " + strFrDate + " ~ " + strToDate;
                worksheet.getCell("K4").value = Utils.translate("STATUS",_dictionary , p_language) + ": " + dt_Data[0].TR_STATUS; 
                
                worksheet.mergeCells('E5', 'F5');
                worksheet.mergeCells('I5', 'J5');
                worksheet.mergeCells('K5', 'L5');

                var row_h = worksheet.getRow(5); 
                row_h.getCell(1).value   = "NO";
                row_h.getCell(2).value   = Utils.translate("SEQ",_dictionary , p_language);
                row_h.getCell(3).value   = Utils.translate("TRANS_DATE",_dictionary , p_language);
                row_h.getCell(4).value   = Utils.translate("VOUCHER_NO",_dictionary , p_language); 
                row_h.getCell(5).value   = Utils.translate("ACC_CODE",_dictionary , p_language);
                row_h.getCell(7).value   = Utils.translate("CF_CODE",_dictionary , p_language);
                row_h.getCell(8).value   = Utils.translate("CF_CODE",_dictionary , p_language);
                row_h.getCell(9).value   = Utils.translate("AMOUNT",_dictionary , p_language);
                row_h.getCell(11).value  = Utils.translate("DESCRIPTION",_dictionary , p_language);

                row_h = worksheet.getRow(6); 
                row_h.getCell(5).value   = Utils.translate("DEBIT",_dictionary , p_language);
                row_h.getCell(6).value   = Utils.translate("CREDIT",_dictionary , p_language);
                row_h.getCell(8).value   = Utils.translate("INDIRECT",_dictionary , p_language);
                row_h.getCell(9).value   = Utils.translate("TRANS",_dictionary , p_language);
                row_h.getCell(10).value  = Utils.translate("BOOK",_dictionary , p_language);
                row_h.getCell(11).value  = Utils.translate("FOREIGN",_dictionary , p_language);
                row_h.getCell(12).value  = Utils.translate("LOCAL",_dictionary , p_language);
                

                var pos = 7; 
                var total_book_amt = 0;
                var total_tr_amt  = 0;
                var total_amt     = 0;

                if(dt_Data.length > 1)
                {
                     worksheet.duplicateRow(pos,dt_Data.length-1,true);
                }  
               for (var i = 0; i < dt_Data.length; i++) 
                {
                    var row_item = worksheet.getRow(pos);

                    row_item.getCell(1).value   = i + 1;
                    row_item.getCell(2).value   = dt_Data[i].H_PK;
                    row_item.getCell(3).value   = dt_Data[i].TR_DATE;
                    row_item.getCell(4).value   = dt_Data[i].VOUCHERNO;    
                    row_item.getCell(5).value   = dt_Data[i].CD_DR;  
                    row_item.getCell(6).value   = dt_Data[i].CD_CR; 
                    row_item.getCell(7).value   = dt_Data[i].CF_CODE; 
                    row_item.getCell(8).value   = dt_Data[i].CF_ICODE; 
                    row_item.getCell(9).value   = dt_Data[i].TR_AMT; 
                    row_item.getCell(10).value  = dt_Data[i].TR_BOOKAMT;  
                    row_item.getCell(11).value  = dt_Data[i].REMARK; 
                    row_item.getCell(12).value  = dt_Data[i].REMARK2;  
                    pos = pos + 1; 
                    //row_item.commit();
                    total_tr_amt       += Number(dt_Data[i].TR_AMT);
                    total_book_amt      += Number(dt_Data[i].TR_BOOKAMT);

                }  
                var row = worksheet.getRow(pos);
                worksheet.mergeCells(pos,1,pos,8); 
                
                row.getCell(9).value  = total_tr_amt;
                row.getCell(10).value = total_book_amt;

                /************sign*/
              //  pos = pos + 3;
              
            //    if(dt_Data_sign.length>1)
            //    {
            //        for (var i = 0; i < dt_Data_sign.length; i++) 
            //         {
            //            if(_lang == 'VIE' )
            //            {   row_item = worksheet.getRow(pos );
            //                if (dt_Data_sign[i].CODE =='VIE')
            //                {
            //                    row_item.getCell(1).value = dt_Data_sign[i].VAL1 ; 
            //                    row_item.getCell(1).font.bold = false;
            //                    row_item.getCell(4).value = dt_Data_sign[i].VAL2; 
            //                    row_item.getCell(4).font.bold = true;
            //                    row_item.getCell(7).value = dt_Data_sign[i].VAL3;                         
            //                    row_item.getCell(7).font.bold = true;
            //                    row_item.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
            //                    row_item.getCell(4).alignment = { vertical: 'middle', horizontal: 'center' };
            //                    row_item.getCell(7).alignment = { vertical: 'middle', horizontal: 'center' };
            //                }
                           
            //                row_item = worksheet.getRow(pos +1 );   
            //                if (dt_Data_sign[i].CODE =='VIE_SIG')
            //                {
            //                    row_item.getCell(1).value = dt_Data_sign[i].VAL1; 
            //                    row_item.getCell(1).font.bold = false;
            //                    row_item.getCell(4).value = dt_Data_sign[i].VAL2; 
            //                    row_item.getCell(4).font.bold = false;
            //                    row_item.getCell(7).value = dt_Data_sign[i].VAL3; 
            //                    row_item.getCell(7).font.bold = false;
            //                    row_item.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
            //                    row_item.getCell(7).alignment = { vertical: 'middle', horizontal: 'center' };  
            //                    row_item.getCell(4).alignment = { vertical: 'middle', horizontal: 'center' };                        
            //                }    
                         
            //            }
            //            if(_lang == 'KOR' || _lang == 'KOR-VIE')
            //            {
            //                row_item = worksheet.getRow(pos ); 
            //                if (dt_Data_sign[i].CODE =='KOR')
            //                {
            //                    row_item.getCell(1).value = dt_Data_sign[i].VAL1; 
            //                    row_item.getCell(1).font.bold = true;    
            //                    row_item.getCell(4).value = dt_Data_sign[i].VAL2; 
            //                    row_item.getCell(4).font.bold = true;
            //                    row_item.getCell(7).value = dt_Data_sign[i].VAL3;                         
            //                    row_item.getCell(7).font.bold = true;
            //                    row_item.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' }; 
            //                    row_item.getCell(4).alignment = { vertical: 'middle', horizontal: 'center' };  
            //                    row_item.getCell(7).alignment = { vertical: 'middle', horizontal: 'center' };   

            //                }
                           
            //                row_item = worksheet.getRow(pos +1 );   
            //                if (dt_Data_sign[i].CODE =='KOR_SIG')
            //                {
            //                    row_item.getCell(1).value = dt_Data_sign[i].VAL1; 
            //                    row_item.getCell(1).font.bold = false;
            //                    row_item.getCell(4).value = dt_Data_sign[i].VAL2; 
            //                    row_item.getCell(4).font.bold = false;  
            //                    row_item.getCell(7).value = dt_Data_sign[i].VAL3;
            //                    row_item.getCell(7).font.bold = false;
            //                    row_item.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };     
            //                    row_item.getCell(7).alignment = { vertical: 'middle', horizontal: 'center' };    
            //                    row_item.getCell(4).alignment = { vertical: 'middle', horizontal: 'center' };                            
            //                }    
            //            }
            //            if(_lang == 'ENG' || _lang == 'ENG-KOR'|| _lang == 'ENG-VIE' )
            //            {    row_item = worksheet.getRow(pos );
            //                if (dt_Data_sign[i].CODE =='ENG')
            //                {
            //                    row_item.getCell(1).value = dt_Data_sign[i].VAL1 + dt_Data_sign[i].VAL1 ; 
            //                    row_item.getCell(1).font.bold = true;  
            //                    row_item.getCell(4).value = dt_Data_sign[i].VAL2; 
            //                    row_item.getCell(4).font.bold = true;                               
            //                    row_item.getCell(7).value = dt_Data_sign[i].VAL3;                         
            //                    row_item.getCell(7).font.bold = true;
            //                    row_item.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };   
            //                    row_item.getCell(4).alignment = { vertical: 'middle', horizontal: 'center' };   
            //                    row_item.getCell(7).alignment = { vertical: 'middle', horizontal: 'center' }; 
                                 
            //                }
                           
            //                row_item = worksheet.getRow(pos +1 );   
            //                if (dt_Data_sign[i].CODE =='ENG_SIG')
            //                {
            //                    row_item.getCell(1).value = dt_Data_sign[i].VAL1;                                
            //                    row_item.getCell(4).value = dt_Data_sign[i].VAL2; 
            //                    row_item.getCell(7).value = dt_Data_sign[i].VAL3;                             
            //                    row_item.getCell(1).font.bold = false;
            //                    row_item.getCell(4).font.bold = false;
            //                    row_item.getCell(7).font.bold = false;
            //                    row_item.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };   
            //                    row_item.getCell(4).alignment = { vertical: 'middle', horizontal: 'center' };   
            //                    row_item.getCell(7).alignment = { vertical: 'middle', horizontal: 'center' }; 

            //                }    
            //            }
            //            if (dt_Data_sign[i].CODE =='NAME')
            //            {
            //                row_item = worksheet.getRow(pos +2 ); 
            //                row_item.getCell(1).value = dt_Data_sign[i].VAL1; 
            //                row_item.getCell(1).font.bold = false;
            //                row_item.getCell(4).value = dt_Data_sign[i].VAL2; 
            //                row_item.getCell(4).font.bold = false;
            //                row_item.getCell(7).value = dt_Data_sign[i].VAL3;         
            //                row_item.getCell(7).font.bold = false;
            //                row_item.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };   
            //                row_item.getCell(4).alignment = { vertical: 'middle', horizontal: 'center' };   
            //                row_item.getCell(7).alignment = { vertical: 'middle', horizontal: 'center' }; 
            //            }
                        
            //         }
            //    }
                /********* Print file excel ********/
                const reportFile    = Helpers.tmpPath(file_new);
                await workbook.xlsx.writeFile(reportFile)
                return response.attachment( reportFile, file_new);
            }
        } 
        catch (e) 
        {
            Utils.Logger({ LVL: "error", MODULE: "Report", FUNC: "rpt_6030080_Daily_Entry_Inq_CF", CONTENT: e.message })
           // return response.send(Utils.response(false, e.message, null))
           return response.send(null);
        }
    }  
}

module.exports = rpt6030080;