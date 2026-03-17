"use strict";
const Helpers = use('Helpers')
const Antl = use("Antl");
const Utils = use("Utils");
const DBService = use("DBService")
var Excel = use('exceljs');
var workbook = new Excel.Workbook();
class rpt5010090_v01 {
    async rpt5010090({ request, response, auth }) {
        try {
            let { para } = request.get(['para'])
            const user = await auth.getUser()
                //console.log(user)
            if (!user) {
                return response.send(
                    Utils.response(false, "Request failed!", null)
                )
            } else {
                var objParam = JSON.parse(para);
                const p_language = request.header("accept-language", "ENG")  // LG_rpt_dscd20010_01
                var dtDetail = await DBService.callProcCursor("LG_RPT_5010090_SEARCH", [objParam.p_from_date,objParam.p_vehicle_no], p_language, user.USER_ID) 
                if (dtDetail) {
                    dtDetail = dtDetail
                } else {
                    return response.send(Utils.response(false, "no_data_found", null))
                }
                //console.log(dtDetail)
                //const templateFile = Helpers.resourcesPath('report/20/10/2010100_1.xlsx')
                const templateFile = Helpers.resourcesPath('report/50/10/rpt_5010090_v01_2.xlsx')
                var reportPath = `2010100_1_${user.USER_ID}.xlsx`
                const reportFile = Helpers.tmpPath(reportPath)
                await workbook.xlsx.readFile(templateFile)
                var worksheet = workbook.getWorksheet(1);

                // SET DATA		
                const font_bold = { bold: true };
                /*Set Header */
                var date = new Date();
                var rowHeader = worksheet.getRow(3); 
                rowHeader.getCell(3).value = dtDetail[0].DELI_DT;
                rowHeader.getCell(6).value = dtDetail[0].VEHICLE_PARA;
                //rowHeader.commit();
                var pos = 13;
                var total_rows=dtDetail.length;
                //----------
                if(dtDetail.length>1){
                    worksheet.duplicateRow(pos,dtDetail.length-1,false);
                }
                for (var i = 0; i < dtDetail.length; i++) {

                    var row = worksheet.getRow(pos + i);
                    row.getCell(2).value = dtDetail[i].SLIP_NO;
                    //row.getCell(3).value = dtDetail[i].VEHICLE_CODE;
                    row.getCell(3).value = dtDetail[i].PARTNER_NAME;
                    row.getCell(4).value = dtDetail[i].REF_ITEM_CODE;
                    row.getCell(5).value = dtDetail[i].ITEM_NAME;
                    row.getCell(6).value = dtDetail[i].ORD_QTY;
                    row.getCell(7).value = dtDetail[i].SUM_ORD;
                    row.getCell(8).value = dtDetail[i].DELI_LOCATION;
                    /*if(i>0)
                    {
                        if(dtDetail[i-1].SLIP_NO==dtDetail[i].SLIP_NO)
                        {
                            worksheet.mergeCells(pos+i-1,2,pos+i,2);   
                        }
                        if(dtDetail[i-1].PARTNER_NAME==dtDetail[i].PARTNER_NAME)
                        {
                            worksheet.mergeCells(pos+i-1,3,pos+i,3);   
                        }
                    }*/
                    
                    row.commit();
                }
                //=================set==border=================
                worksheet.getCell(pos+total_rows+1,1).border = {left: {style:'medium'}};
                //worksheet.getCell(pos+total_rows+1,1).border = {left: {style:'medium'}};

                worksheet.getCell(pos+total_rows+1,1).border = {bottom: {style:'medium'}};
                worksheet.getCell(pos+total_rows+1,2).border = {bottom: {style:'medium'}};
                worksheet.getCell(pos+total_rows+1,3).border = {bottom: {style:'medium'}};
                worksheet.getCell(pos+total_rows+1,4).border = {bottom: {style:'medium'}};
                worksheet.getCell(pos+total_rows+1,5).border = {bottom: {style:'medium'}};
                worksheet.getCell(pos+total_rows+1,6).border = {bottom: {style:'medium'}};
                worksheet.getCell(pos+total_rows+1,7).border = {bottom: {style:'medium'}};
                worksheet.getCell(pos+total_rows+1,8).border = {bottom: {style:'medium'}};
                worksheet.getCell(pos+total_rows+1,9).border = {bottom: {style:'medium'}};
                //worksheet.getCell(pos+total_rows+1,10).border = {bottom: {style:'medium'}};

                worksheet.getCell(pos+total_rows-1,9).border = {right: {style:'medium'}};
                //worksheet.getCell(pos+total_rows+1,9).border = {right: {style:'medium'}};
                /*worksheet.getCell(pos+total_rows+2,1,total_rows+2,12).border = {
                    //top: {style:'thin'},
                    //left: {style:'thin'},
                    bottom: {style:'double'}//,
                   // right: {style:'double'}
                  };*/
                //=============================================
                await workbook.xlsx.writeFile(reportFile)
                return response.attachment(
                    reportFile,
                    `rpt2010100_1_${user.USER_ID}.xlsx` // custom name
                )
            }
        } catch (e) {
            return response.send(Utils.response(false, e.message, null))
        }
    }
    async report2({ request, response, auth }) {
        try {
            let { para } = request.get(['para'])
            const user = await auth.getUser()
                //console.log(user)
            if (!user) {
                return response.send(
                    Utils.response(false, "Request failed!", null)
                )
            } else {
                var objParam = JSON.parse(para);
                const p_language = request.header("accept-language", "ENG")
                var dtDetail = await DBService.callProcCursor("LG_RPT_2010100_2", [objParam.AR_DT], p_language, user.USER_ID)
                if (dtDetail) {
                    dtDetail = dtDetail
                } else {
                    return response.send(Utils.response(false, "no_data_found", null))
                }
                //console.log(dtDetail)
                const templateFile = Helpers.resourcesPath('report/20/10/2010100_2.xlsx')
                var reportPath = `2010100_2_${user.USER_ID}.xlsx`
                const reportFile = Helpers.tmpPath(reportPath)
                await workbook.xlsx.readFile(templateFile)
                var worksheet = workbook.getWorksheet(1);

                // SET DATA		
                const font_bold = { bold: true };
                /*Set Header */
                var date = new Date();
                var rowHeader = worksheet.getRow(5);
                rowHeader.getCell(2).value =  objParam.AR_DT.substr(0,4)+"-"+objParam.AR_DT.substr(4,2)+"-"+objParam.AR_DT.substr(6,2);
                rowHeader.getCell(11).value =  ""+date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
                rowHeader.commit();
                var pos = 9;
                //----------
                if(dtDetail.length>2){
                    worksheet.duplicateRow(pos,dtDetail.length-1,false);
                }
                for (var i = 0; i < dtDetail.length; i++) {

                    var row = worksheet.getRow(pos + i);

                    if(dtDetail[i].PARENT_CODE == "" || dtDetail[i].PARENT_CODE == undefined || dtDetail[i].PARENT_CODE == null){
                        row.getCell(1).value = "SUM Total:";
                    }else if(dtDetail[i].CUS_AREA_NM == "" || dtDetail[i].CUS_AREA_NM == undefined || dtDetail[i].CUS_AREA_NM == null){
                        row.getCell(1).value = dtDetail[i].PARENT_CODE;
                        row.getCell(2).value = "Sub Total "+dtDetail[i].PARENT_CODE;
                    }else if(dtDetail[i].CUS_AREA_NM == "" || dtDetail[i].CUS_AREA_NM == undefined || dtDetail[i].CUS_AREA_NM == null){
                        row.getCell(1).value = dtDetail[i].PARENT_CODE;
                        row.getCell(2).value = dtDetail[i].CUS_AREA_NM;
                        row.getCell(3).value = "Sub Total "+dtDetail[i].CUS_AREA_NM;
                    }else{
                        row.getCell(1).value = dtDetail[i].PARENT_CODE;
                        row.getCell(2).value = dtDetail[i].CUS_AREA_NM;
                        row.getCell(3).value = dtDetail[i].PARTNER_NAME;
                    }
                    
                    row.getCell(4).value = dtDetail[i].DATE_TYPE_10;
                    row.getCell(5).value = dtDetail[i].DATE_TYPE_20;
                    row.getCell(6).value = dtDetail[i].DATE_TYPE_30;
                    row.getCell(7).value = dtDetail[i].DATE_TYPE_TT;
                    row.getCell(8).value = dtDetail[i].CURR_MONTH_10;
                    row.getCell(9).value = dtDetail[i].CURR_MONTH_20;
                    row.getCell(10).value = dtDetail[i].CURR_MONTH_30;
                    row.getCell(11).value = dtDetail[i].CURR_MONTH_TT;
                    //row.font = font_bold;
                    row.commit();
                }
                await workbook.xlsx.writeFile(reportFile)
                return response.attachment(
                    reportFile,
                    `rpt2010100_2_${user.USER_ID}.xlsx` // custom name
                )
            }
        } catch (e) {
            return response.send(Utils.response(false, e.message, null))
        }
    }
}

module.exports = rpt5010090_v01;