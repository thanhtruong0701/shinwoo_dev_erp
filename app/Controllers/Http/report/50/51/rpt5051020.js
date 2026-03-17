"use strict";
const Helpers       = use('Helpers')
const Antl          = use("Antl");
const Utils         = use("Utils");
const DBService = use("DBService")
var Excel           = use('exceljs');
var workbook        = new Excel.Workbook();
class rpt5051020 {
/*########################################################## Report JH ##################################################################################*/ 
    async rpt5051020_v01({ request, response, auth }) {
        try 
        { 
            /****************************** Get Param *********************************/
            let { para }        = request.get(['para']);
            
            /********* Parse pram to json ********/
            var item            = JSON.parse(para);
            
            const user          = await auth.getUser();
            const p_crt_by      = user.USER_ID;
            const p_language    = request.header("accept-language", "ENG");
            var file_nm         = "rpt5051020_v01";
            var file_type       = ".xlsx";
            var full_nm         = file_nm + file_type;
            var file_new        = file_nm + p_crt_by + file_type;

            var _resourcesPath  = "report/50/51/rpt5051020_v01.xlsx";

            var _store          = "lg_sel_5051020_1";
            var _param          = [ item.P_COMPANY_PK, item.P_CONVERT_CCY,  item.P_CONVERT_EXRATE];
            
             /***************************** Return failded ****************************/
            if (!user) 
            {
                return response.send(Utils.response(false, "Request failed!", null));
            } 
            /****************************** Begin call store and write excell *********/
            else
            {
                var dtDetail = await DBService.callProcCursor(_store, _param, p_language, user.USER_ID);

                if(!dtDetail)
                {
                    return response.send(Utils.response(false, "no_data_found", null));
                }

                /********* Read file excel ********/ 
                const templateFile  = Helpers.resourcesPath(_resourcesPath);
                await workbook.xlsx.readFile(templateFile);
                var worksheet       = workbook.getWorksheet(1);

                const l_convertedCcy = item.P_CONVERT_CCY;
                const l_convertedExrate = item.P_CONVERT_EXRATE;

                var l_rowDuration = worksheet.getRow(3);
                l_rowDuration.getCell(4).value = l_convertedCcy;
                l_rowDuration.getCell(7).value = l_convertedExrate;
                l_rowDuration.commit();

                var pos = 8;
                if(dtDetail.length > 0){
                    worksheet.duplicateRow(pos + 1, (dtDetail.length - 1) + 6, false);
                }
                let l_sumOutstandingConvCcy = 0;
                let l_sumOutstanding = 0;
                let l_sumUnder3M = 0 ;
                let l_sumOver3M = 0;
                let l_sumOver5M = 0;
                let l_sumTotal = 0;

                for (var i = 0; i < dtDetail.length; i++) {

                    var row = worksheet.getRow(pos + i);                                        
                    
                    row.getCell(2).value = dtDetail[i].PARTNER_NAME;

                    row.getCell(3).value = dtDetail[i].OUTSTANDING_CONVCCY;

                    if(dtDetail[i].OUTSTANDING_CONVCCY) {
                        l_sumOutstandingConvCcy += parseFloat(dtDetail[i].OUTSTANDING_CONVCCY);                        
                    }

                    row.getCell(4).value = dtDetail[i].TR_CCY;

                    row.getCell(5).value = dtDetail[i].OUTSTANDING;
                    if(dtDetail[i].OUTSTANDING) {
                        l_sumOutstanding += parseFloat(dtDetail[i].OUTSTANDING);
                    }

                    row.getCell(6).value = dtDetail[i].UNDER_3M;
                    if(dtDetail[i].UNDER_3M) {
                        l_sumUnder3M += parseFloat(dtDetail[i].UNDER_3M);
                    }

                    row.getCell(7).value = dtDetail[i].RATIO_UNDER_3M;

                    row.getCell(8).value = dtDetail[i].OVER_3M;
                    if(dtDetail[i].OVER_3M) {
                        l_sumOver3M += parseFloat(dtDetail[i].OVER_3M);
                    }

                    row.getCell(9).value = dtDetail[i].RATIO_OVER_3M;

                    row.getCell(10).value = dtDetail[i].OVER_5M;
                    if(dtDetail[i].OVER_5M) {
                        l_sumOver5M += parseFloat(dtDetail[i].OVER_5M);
                    }

                    row.getCell(11).value = dtDetail[i].RATIO_OVER_5M;                    

                    row.getCell(12).value = dtDetail[i].TOTAL;
                    if(dtDetail[i].TOTAL) {
                        l_sumTotal += parseFloat(dtDetail[i].TOTAL);

                    }

                    row.getCell(13).value = dtDetail[i].TOTAL_RATIO;

                    row.commit();
                }
                                
                var l_rowTotal = worksheet.getRow(pos + (dtDetail.length - 1) + 1);
                l_rowTotal.getCell(3).value = l_sumOutstandingConvCcy;

                l_rowTotal.getCell(5).value = l_sumOutstanding;
                l_rowTotal.getCell(6).value = l_sumUnder3M;
                l_rowTotal.getCell(8).value = l_sumOver3M;
                l_rowTotal.getCell(10).value = l_sumOver5M;
                l_rowTotal.getCell(12).value = l_sumTotal;

                l_rowTotal.commit();             

                var dtSum = await DBService.callProcCursor("lg_sel_5051020_2", _param, p_language, user.USER_ID);

                let l_PAYAMOUNT_CONVCCY = 0;
                let l_UNDER_3M = 0;
                let l_OVER_3M = 0;
                let l_OVER_5M = 0;
                let l_TOTAL = 0;

                let l_compName = "";

                if(dtSum)
                {
                    l_PAYAMOUNT_CONVCCY = dtSum[0].PAYAMOUNT_CONVCCY;
                    l_UNDER_3M = dtSum[0].UNDER_3M;
                    l_OVER_3M = dtSum[0].OVER_3M;
                    l_OVER_5M = dtSum[0].OVER_5M;
                    l_TOTAL = dtSum[0].TOTAL;
                    l_compName = dtSum[0].COMPNAME;
                }


                var l_rowSum1 = worksheet.getRow(pos + (dtDetail.length - 1) + 3);                   
                l_rowSum1.getCell(2).value = "TOTAL";
                l_rowSum1.getCell(3).value = l_PAYAMOUNT_CONVCCY;
                l_rowSum1.commit();

                var l_rowSum2 = worksheet.getRow(pos + (dtDetail.length - 1) + 4);                   
                l_rowSum2.getCell(2).value = "OVER DUE TOTAL";
                l_rowSum2.getCell(3).value = l_TOTAL;
                l_rowSum2.commit();

                var l_rowSum3 = worksheet.getRow(pos + (dtDetail.length - 1) + 5);                   
                l_rowSum3.getCell(2).value = "UNDER 3M";
                l_rowSum3.getCell(3).value = l_UNDER_3M;
                l_rowSum3.commit();

                var l_rowSum4 = worksheet.getRow(pos + (dtDetail.length - 1) + 6);                   
                l_rowSum4.getCell(2).value = "OVER 3M";
                l_rowSum4.getCell(3).value = l_OVER_3M;
                l_rowSum4.commit();                

                var l_rowSum5 = worksheet.getRow(pos + (dtDetail.length - 1) + 7);                   
                l_rowSum5.getCell(2).value = "OVER 5M";
                l_rowSum5.getCell(3).value = l_OVER_5M;                
                l_rowSum5.commit();                   
                
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

module.exports = rpt5051020;