"use strict";
const Helpers = use('Helpers')
const Antl = use("Antl");
const Utils = use("Utils");
const DBService = use("DBService")
var Excel = use('exceljs');
var workbook = new Excel.Workbook();
const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

class rptswso420 {
    async rptswso420_01({ request, response, auth }) {
        try {
            /****************************** Get Param *********************************/

            let { para } = request.get(['para']);
            /********* Parse pram to json ********/
            var item = JSON.parse(para);
            const user = await auth.getUser();
            //var COMP_ID         = item.P_COMP_ID, COMP_NM = item.P_COMP_NM, COMP_TAX = item.P_COMP_TAX, COMP_ADD = item.P_COMP_ADD;
            const p_crt_by = user.USER_ID;
            const p_language = request.header("accept-language", "ENG");

            var file_nm = [item.P_FILE_NAME_NEW];
            var file_type = ".xlsx";
            var full_nm = file_nm + file_type;
            var file_new = file_nm + p_crt_by + file_type;
            //rpt_swso420__delivery
            var _resourcesPath = "report/sw/10" + '/' + "rpt_swso420__delivery_v2.xlsx";
            var _store = "LG_SEL_5010094_1";
            var _store2 = "LG_SEL_6009540_2_NJ";
            var _store3 = "SW_SEL_SWSO420_01";
            var _param = [item.P_COMPANY, item.P_LOCATION, item.P_DATE_TYPE, item.P_ORDER_FROM, item.P_ORDER_TO, item.P_ORDER_NO, item.P_LABEL_TYPE];


            /***************************** Return failded ****************************/
            if (!user) {
                return response.send(Utils.response(false, "Request failed!", null));
            }
            /****************************** Begin call store and write excell *********/
            else {
                /********* Call store  ***************/
                //var dt_m  = await DBService.callProcCursor(_store, _param, p_language, p_crt_by);
                //var dt_m2 = await DBService.callProcCursor(_store2, _param, p_language, p_crt_by);
                var dt_m3 = await DBService.callProcCursor(_store3, _param, p_language, p_crt_by);

                /********* Read file excel ********/
                const templateFile = Helpers.resourcesPath(_resourcesPath);
                await workbook.xlsx.readFile(templateFile);
                var worksheet = workbook.getWorksheet(1);

                /********* Write file excel ********/
                var row = worksheet.getRow(7);
                var pos = 7;

                /*row.getCell(2).value = item.P_MONTH_D;
                row.getCell(8).value = item.P_DATE_TODAY;

                if (dt_m.length > 1) {
                    worksheet.duplicateRow(pos, dt_m.length - 2, true);
                }

                for (var i = 0; i < dt_m.length; i++) {
                    var row = worksheet.getRow(pos + i);
                    row.getCell(1).value = dt_m[i].YYYYMM;
                    row.getCell(2).value = dt_m[i].TYPE_10;
                    row.getCell(3).value = dt_m[i].TYPE_20;
                    row.getCell(4).value = dt_m[i].TYPE_30;
                    row.getCell(5).value = dt_m[i].TYPE_40;
                    row.getCell(6).value = dt_m[i].TOTAL_QTY;
                    row.getCell(8).value = dt_m2[i].MM;
                    row.getCell(9).value = dt_m2[i].AP_AMT;
                    row.getCell(10).value = dt_m2[i].AR_AMT;
                }

                pos = dt_m.length+11*/

                if (dt_m3.length > 1) {
                    //row.getCell(1).value = dt_m3.length;
                    worksheet.duplicateRow(pos, dt_m3.length - 2, true);
                }
                for (var j = 0; j < dt_m3.length; j++) {
                    if (j > 0) {
                        if (dt_m3[j].CONTAINER_NAME == dt_m3[j - 1].CONTAINER_NAME) {
                            worksheet.mergeCells(pos + j, 2, pos + j + 1, 2);
                        }
                        //worksheet.mergeCells(pos+i, 8, pos+i, 10);
                    }


                }
                //worksheet.mergeCells(7, 2, 9, 2);
                //worksheet.mergeCells(pos-1, 8, pos-1, 10);

                for (var i = 1; i <= dt_m3.length; i++) {
                    var row = worksheet.getRow(pos++);
                    /*if(i >1)
                    {
                        if(dt_m3[i-1].CUST_NAME_ENG==dt_m3[i].CUST_NAME_ENG)
                        {
                            worksheet.mergeCells(pos-1, 2, pos, 2);
                        }
                        //worksheet.mergeCells(pos+i, 8, pos+i, 10);
                    }*/
                    row.getCell(1).value = dt_m3[i - 1].CONTAINER_NAME;
                    row.getCell(2).value = dt_m3[i - 1].CUST_NAME_ENG;
                    row.getCell(3).value = dt_m3[i - 1].ORDERDATE;
                    row.getCell(4).value = dt_m3[i - 1].ORDERNO;
                    row.getCell(5).value = dt_m3[i - 1].STYLE_NO;
                    row.getCell(6).value = dt_m3[i - 1].COLOR;
                    row.getCell(7).value = dt_m3[i - 1].SIZES;
                    row.getCell(8).value = dt_m3[i - 1].KIND;
                    row.getCell(9).value = dt_m3[i - 1].QTY;
                    row.getCell(10).value = dt_m3[i - 1].TOTAL_QTY;
                    row.getCell(11).value = dt_m3[i - 1].CBM;
                    row.getCell(12).value = dt_m3[i - 1].UNIT;
                    //row.getCell(7).value = dt_m3[i].TYPE_40;

                }


                /********* Print file excel ********/
                const reportFile = Helpers.tmpPath(file_new);
                await workbook.xlsx.writeFile(reportFile);
                return response.attachment(reportFile, file_new)

            }
        }
        catch (e) {
            // Utils.Logger({ LVL: "error", MODULE: "Report", FUNC: "Picking_list", CONTENT: e.message }) 
            //return response.send(null);
            console.log(e)
            return response.send(Utils.response(false, e.message, null))
        }
    }
    //===========report---detail---barcode--ANTA----------------
    async rptswsoNK030_01_bk({ request, response, auth }) {
        try {
            /****************************** Get Param *********************************/

            let { para } = request.get(['para']);
            /********* Parse pram to json ********/
            var item = JSON.parse(para);
            const user = await auth.getUser();
            //var COMP_ID         = item.P_COMP_ID, COMP_NM = item.P_COMP_NM, COMP_TAX = item.P_COMP_TAX, COMP_ADD = item.P_COMP_ADD;
            const p_crt_by = user.USER_ID;
            const p_language = request.header("accept-language", "ENG");

            var file_nm = [item.P_FILE_NAME_NEW];
            var file_type = ".xlsx";
            var full_nm = file_nm + file_type;
            var file_new = file_nm + p_crt_by + file_type;
            //rpt_swso420__delivery
            var _resourcesPath = "report/sw/nk" + '/' + "rpt_swnk030_barcode_detail_v01.xlsx";
            var _store = "SZ_SEL_SWNK030_EXPORT_MST_NOCACHE";
            var _store2 = "LG_SEL_6009540_2_NJ";
            var _store3 = "SZ_SEL_SWNK030_EXPORT_NOCACHE";
            var _param = [item.p_company_pk, item.p_PartnerCD_NM, item.p_AccCD_NM, item.p_AccountType, item.p_month, item.p_factory_pk, item.p_month_to];

            /***************************** Return failded ****************************/
            if (!user) {
                return response.send(Utils.response(false, "Request failed!", null));
            }
            /****************************** Begin call store and write excell *********/
            else {
                /********* Call store  ***************/
                var dt_m = await DBService.callProcCursor(_store, _param, p_language, p_crt_by);
                //var dt_m2 = await DBService.callProcCursor(_store2, _param, p_language, p_crt_by);
                var dt_m3 = await DBService.callProcCursor(_store3, _param, p_language, p_crt_by);

                /********* Read file excel ********/
                const templateFile = Helpers.resourcesPath(_resourcesPath);
                await workbook.xlsx.readFile(templateFile);
                var worksheet = workbook.getWorksheet(1);

                /********* Write file excel ********/
                //var row = worksheet.getRow(7);
                var pos = 13;
                var total_dtl_pos = dt_m3.length + 12;

                if (dt_m.length > 0) {
                    var row7 = worksheet.getRow(7);
                    row7.getCell(7).value = dt_m[0].UPPER_NAME;
                    var row8 = worksheet.getRow(8);
                    row8.getCell(1).value = dt_m[0].PO_NO;
                    row8.getCell(7).value = dt_m[0].SERIES;
                    var row9 = worksheet.getRow(9);
                    row9.getCell(7).value = dt_m[0].IMPLEMENTATION_STANDARDS;
                    var row10 = worksheet.getRow(10);
                    row10.getCell(7).value = dt_m[0].RETAIL_PRICE;

                    worksheet.mergeCells(total_dtl_pos, 6, total_dtl_pos, 9);
                    var rowDeli_date = worksheet.getRow(total_dtl_pos);

                    rowDeli_date.getCell(6).font = { italic: false, bold: true, color: { argb: '000000' }, size: 20, name: 'Calibri' };

                    rowDeli_date.getCell(6).value = dt_m[0].OGAC_DATE;
                }

                /* if (dt_m3.length > 1) {
                     worksheet.duplicateRow(pos, dt_m3.length-4, true);
                 }*/
                var pos_01 = 14;
                for (var i = 0; i < dt_m3.length; i++) {
                    var row = worksheet.getRow(pos_01 + i);
                    var row2 = worksheet.getRow(pos_01 + i - 3);
                    if ((i) % 2 === 0 && i < dt_m3.length - 3) {

                        console.log("a " + i % 2);
                        for (let k = 1; k <= 40; k++) {
                            row.getCell(k).fill = { type: "pattern", pattern: "solid", fgColor: { argb: 'FFDAB9' } };
                            row.getCell(k).alignment = { vertical: 'middle', horizontal: 'center' };

                        }

                    }
                    else {

                        if (i == dt_m3.length - 1) {
                            console.log("b " + i % 2);
                            for (let k2 = 1; k2 <= 40; k2++) {
                                row2.getCell(k2).border = {
                                    top: { style: 'medium', color: { argb: 'A6A6A6' } },
                                    left: { style: 'medium', color: { argb: 'A6A6A6' } },
                                    bottom: { style: 'medium', color: { argb: 'A6A6A6' } },
                                    right: { style: 'medium', color: { argb: 'A6A6A6' } }
                                };
                                row2.getCell(k2).alignment = { vertical: 'middle', horizontal: 'center' };
                                row2.getCell(k2).font.bold = true;
                            }


                        }
                        else {
                            for (let k3 = 1; k3 <= 40; k3++) {
                                row.getCell(k3).alignment = { vertical: 'middle', horizontal: 'center' };
                            }
                        }
                        //row.getCell(2).font = {  color: { argb: '000000'} };

                    }
                }
                //worksheet.mergeCells(7, 2, 9, 2);
                //worksheet.mergeCells(pos-1, 8, pos-1, 10);
                var pos_dtl = 11;
                for (var i = 0; i < dt_m3.length; i++) {

                    var row = worksheet.getRow(pos_dtl + i);

                    /*if(i >1)
                    {
                        if(dt_m3[i-1].CUST_NAME_ENG==dt_m3[i].CUST_NAME_ENG)
                        {
                            worksheet.mergeCells(pos-1, 2, pos, 2);
                        }
                        //worksheet.mergeCells(pos+i, 8, pos+i, 10);
                    }*/
                    if (i > 1 && i < dt_m3.length - 1) {
                        row.getCell(1).value = i - 1;

                    }
                    row.getCell(2).value = dt_m3[i].BARCODE;
                    row.getCell(3).value = dt_m3[i].SIZE_CODE;
                    row.getCell(4).value = dt_m3[i].ATT01;
                    row.getCell(5).value = dt_m3[i].ATT02;
                    row.getCell(6).value = dt_m3[i].ATT03;
                    row.getCell(7).value = dt_m3[i].ATT04;
                    row.getCell(8).value = dt_m3[i].ATT05;
                    row.getCell(9).value = dt_m3[i].ATT06;
                    row.getCell(10).value = dt_m3[i].ATT07;
                    row.getCell(11).value = dt_m3[i].ATT08;
                    row.getCell(12).value = dt_m3[i].ATT09;

                    row.getCell(13).value = dt_m3[i].ATT10;
                    row.getCell(14).value = dt_m3[i].ATT11;
                    row.getCell(15).value = dt_m3[i].ATT12;
                    row.getCell(16).value = dt_m3[i].ATT13;
                    row.getCell(17).value = dt_m3[i].ATT14;
                    row.getCell(18).value = dt_m3[i].ATT15;
                    row.getCell(19).value = dt_m3[i].ATT16;
                    row.getCell(20).value = dt_m3[i].ATT17;
                    row.getCell(21).value = dt_m3[i].ATT18;

                    row.getCell(22).value = dt_m3[i].ATT19;
                    row.getCell(23).value = dt_m3[i].ATT20;
                    row.getCell(24).value = dt_m3[i].ATT21;
                    row.getCell(25).value = dt_m3[i].ATT22;
                    row.getCell(26).value = dt_m3[i].ATT23;
                    row.getCell(27).value = dt_m3[i].ATT24;
                    row.getCell(28).value = dt_m3[i].ATT25;
                    row.getCell(29).value = dt_m3[i].ATT26;
                    row.getCell(30).value = dt_m3[i].ATT27;

                    row.getCell(31).value = dt_m3[i].ATT28;
                    row.getCell(32).value = dt_m3[i].ATT29;
                    row.getCell(33).value = dt_m3[i].ATT30;

                    row.getCell(34).value = dt_m3[i].TOTAL;
                    row.getCell(35).value = dt_m3[i].G_TOTAL;
                    row.getCell(36).value = dt_m3[i].LOSS;
                    row.getCell(37).value = dt_m3[i].EXTRA;
                    row.getCell(38).value = dt_m3[i].PRINTED_NO;
                    row.getCell(39).value = dt_m3[i].REMAIN;
                    row.getCell(40).value = dt_m3[i].PRINTED_TIME;

                }


                /********* Print file excel ********/
                const reportFile = Helpers.tmpPath(file_new);
                await workbook.xlsx.writeFile(reportFile);
                return response.attachment(reportFile, file_new)

            }
        }
        catch (e) {
            // Utils.Logger({ LVL: "error", MODULE: "Report", FUNC: "Picking_list", CONTENT: e.message }) 
            //return response.send(null);
            console.log(e)
            return response.send(Utils.response(false, e.message, null))
        }
    }
    //=============END===DETAIL====BARCODE=======ANTA============
    //===========report---detail---barcode--ANTA-----english-----------
    async rptswsoNK040_01({ request, response, auth }) {
        try {
            /****************************** Get Param *********************************/

            let { para } = request.get(['para']);
            /********* Parse pram to json ********/
            var item = JSON.parse(para);
            const user = await auth.getUser();
            //var COMP_ID         = item.P_COMP_ID, COMP_NM = item.P_COMP_NM, COMP_TAX = item.P_COMP_TAX, COMP_ADD = item.P_COMP_ADD;
            const p_crt_by = user.USER_ID;
            const p_language = request.header("accept-language", "ENG");

            var file_nm = [item.P_FILE_NAME_NEW];
            var file_type = ".xlsx";
            var full_nm = file_nm + file_type;
            var file_new = file_nm + p_crt_by + file_type;
            //rpt_swso420__delivery
            var _resourcesPath = "report/sw/nk" + '/' + "rpt_swnk030_barcode_detail_v01.xlsx";
            var _store = "SZ_SEL_SWNK040_EXPORT_MST_NOCACHE";
            var _store2 = "LG_SEL_6009540_2_NJ";
            var _store3 = "SZ_SEL_SWNK040_EXPORT_NOCACHE";
            var _param = [item.p_company_pk, item.p_PartnerCD_NM, item.p_AccCD_NM, item.p_AccountType, item.p_month, item.p_factory_pk, item.p_month_to];

            /***************************** Return failded ****************************/
            if (!user) {
                return response.send(Utils.response(false, "Request failed!", null));
            }
            /****************************** Begin call store and write excell *********/
            else {
                /********* Call store  ***************/
                var dt_m = await DBService.callProcCursor(_store, _param, p_language, p_crt_by);
                //var dt_m2 = await DBService.callProcCursor(_store2, _param, p_language, p_crt_by);
                var dt_m3 = await DBService.callProcCursor(_store3, _param, p_language, p_crt_by);

                /********* Read file excel ********/
                const templateFile = Helpers.resourcesPath(_resourcesPath);
                await workbook.xlsx.readFile(templateFile);
                var worksheet = workbook.getWorksheet(1);

                /********* Write file excel ********/
                //var row = worksheet.getRow(7);
                var pos = 13;

                if (dt_m.length > 0) {
                    var row7 = worksheet.getRow(7);
                    row7.getCell(7).value = dt_m[0].UPPER_NAME;
                    var row8 = worksheet.getRow(8);
                    row8.getCell(1).value = dt_m[0].PO_NO;
                    row8.getCell(7).value = dt_m[0].SERIES;
                    var row9 = worksheet.getRow(9);
                    row9.getCell(7).value = dt_m[0].IMPLEMENTATION_STANDARDS;
                    var row10 = worksheet.getRow(10);
                    row10.getCell(7).value = dt_m[0].RETAIL_PRICE;
                }

                /* if (dt_m3.length > 1) {
                     worksheet.duplicateRow(pos, dt_m3.length-4, true);
                 }*/
                var pos_01 = 14;
                for (var i = 0; i < dt_m3.length; i++) {
                    var row = worksheet.getRow(pos_01 + i);
                    var row2 = worksheet.getRow(pos_01 + i - 3);
                    if ((i) % 2 === 0 && i < dt_m3.length - 3) {

                        console.log("a " + i % 2);
                        for (let k = 1; k <= 19; k++) {
                            row.getCell(k).fill = { type: "pattern", pattern: "solid", fgColor: { argb: 'FFDAB9' } };
                            row.getCell(k).alignment = { vertical: 'middle', horizontal: 'center' };

                        }

                    }
                    else {

                        if (i == dt_m3.length - 1) {
                            console.log("b " + i % 2);
                            for (let k2 = 1; k2 <= 19; k2++) {
                                row2.getCell(k2).border = {
                                    top: { style: 'medium', color: { argb: 'A6A6A6' } },
                                    left: { style: 'medium', color: { argb: 'A6A6A6' } },
                                    bottom: { style: 'medium', color: { argb: 'A6A6A6' } },
                                    right: { style: 'medium', color: { argb: 'A6A6A6' } }
                                };
                                row2.getCell(k2).alignment = { vertical: 'middle', horizontal: 'center' };
                                row2.getCell(k2).font.bold = true;
                            }


                        }
                        else {
                            for (let k3 = 1; k3 <= 19; k3++) {
                                row.getCell(k3).alignment = { vertical: 'middle', horizontal: 'center' };
                            }
                        }
                        //row.getCell(2).font = {  color: { argb: '000000'} };

                    }
                }
                //worksheet.mergeCells(7, 2, 9, 2);
                //worksheet.mergeCells(pos-1, 8, pos-1, 10);
                var pos_dtl = 11;
                for (var i = 0; i < dt_m3.length; i++) {

                    var row = worksheet.getRow(pos_dtl + i);

                    /*if(i >1)
                    {
                        if(dt_m3[i-1].CUST_NAME_ENG==dt_m3[i].CUST_NAME_ENG)
                        {
                            worksheet.mergeCells(pos-1, 2, pos, 2);
                        }
                        //worksheet.mergeCells(pos+i, 8, pos+i, 10);
                    }*/
                    if (i > 1 && i < dt_m3.length - 1) {
                        row.getCell(1).value = i - 1;

                    }
                    row.getCell(2).value = dt_m3[i].BARCODE;
                    row.getCell(3).value = dt_m3[i].SIZE_CODE;
                    row.getCell(4).value = dt_m3[i].ATT01;
                    row.getCell(5).value = dt_m3[i].ATT02;
                    row.getCell(6).value = dt_m3[i].ATT03;
                    row.getCell(7).value = dt_m3[i].ATT04;
                    row.getCell(8).value = dt_m3[i].ATT05;
                    row.getCell(9).value = dt_m3[i].ATT06;
                    row.getCell(10).value = dt_m3[i].ATT07;
                    row.getCell(11).value = dt_m3[i].ATT08;
                    row.getCell(12).value = dt_m3[i].ATT09;
                    row.getCell(13).value = dt_m3[i].TOTAL;
                    row.getCell(14).value = dt_m3[i].G_TOTAL;
                    row.getCell(15).value = dt_m3[i].LOSS;
                    row.getCell(16).value = dt_m3[i].EXTRA;
                    row.getCell(17).value = dt_m3[i].PRINTED_NO;
                    row.getCell(18).value = dt_m3[i].REMAIN;
                    row.getCell(19).value = dt_m3[i].PRINTED_TIME;

                }


                /********* Print file excel ********/
                const reportFile = Helpers.tmpPath(file_new);
                await workbook.xlsx.writeFile(reportFile);
                return response.attachment(reportFile, file_new)

            }
        }
        catch (e) {
            // Utils.Logger({ LVL: "error", MODULE: "Report", FUNC: "Picking_list", CONTENT: e.message }) 
            //return response.send(null);
            console.log(e)
            return response.send(Utils.response(false, e.message, null))
        }
    }
    //=============END===DETAIL====BARCODE=======ANTA=====ENGLISH=======
    //===========report--DETAIL====BARCODE=======ANTA====english(QR)--
    async rptswsoNK050_01({ request, response, auth }) {
        try {
            /****************************** Get Param *********************************/

            let { para } = request.get(['para']);
            /********* Parse pram to json ********/
            var item = JSON.parse(para);
            const user = await auth.getUser();
            //var COMP_ID         = item.P_COMP_ID, COMP_NM = item.P_COMP_NM, COMP_TAX = item.P_COMP_TAX, COMP_ADD = item.P_COMP_ADD;
            const p_crt_by = user.USER_ID;
            const p_language = request.header("accept-language", "ENG");

            var file_nm = [item.P_FILE_NAME_NEW];
            var file_type = ".xlsx";
            var full_nm = file_nm + file_type;
            var file_new = file_nm + p_crt_by + file_type;
            //rpt_swso420__delivery
            var _resourcesPath = "report/sw/nk" + '/' + "rpt_swnk030_barcode_detail_v01.xlsx";
            var _store = "SZ_SEL_SWNK030_EXPORT_MST_NOCACHE";
            var _store2 = "LG_SEL_6009540_2_NJ";
            var _store3 = "SZ_SEL_SWNK050_EXPORT_NOCACHE";
            var _param = [item.p_company_pk, item.p_PartnerCD_NM, item.p_AccCD_NM, item.p_AccountType, item.p_month, item.p_factory_pk, item.p_month_to];

            /***************************** Return failded ****************************/
            if (!user) {
                return response.send(Utils.response(false, "Request failed!", null));
            }
            /****************************** Begin call store and write excell *********/
            else {
                /********* Call store  ***************/
                var dt_m = await DBService.callProcCursor(_store, _param, p_language, p_crt_by);
                //var dt_m2 = await DBService.callProcCursor(_store2, _param, p_language, p_crt_by);
                var dt_m3 = await DBService.callProcCursor(_store3, _param, p_language, p_crt_by);

                /********* Read file excel ********/
                const templateFile = Helpers.resourcesPath(_resourcesPath);
                await workbook.xlsx.readFile(templateFile);
                var worksheet = workbook.getWorksheet(1);

                /********* Write file excel ********/
                //var row = worksheet.getRow(7);
                var pos = 13;
                var total_dtl_pos = dt_m3.length + 12;
                var total_dtl_pos_2 = dt_m3.length + 9;
                if (dt_m.length > 0) {
                    var row1 = worksheet.getRow(1);
                    row1.getCell(1).value = dt_m[0].ITEM_NAME;

                    var row2 = worksheet.getRow(3);
                    row2.getCell(3).value = dt_m[0].FACTORY;

                    var row3 = worksheet.getRow(4);
                    row3.getCell(3).value = dt_m[0].ORDER_NO;

                    var row4 = worksheet.getRow(5);
                    row4.getCell(3).value = dt_m[0].DPO;

                    var row5 = worksheet.getRow(6);
                    row5.getCell(3).value = dt_m[0].GENDER;


                    var row7 = worksheet.getRow(7);
                    row7.getCell(7).value = dt_m[0].SERIES;

                    var row8 = worksheet.getRow(8);
                    row8.getCell(1).value = dt_m[0].PO_NO;
                    row8.getCell(7).value = dt_m[0].UPPER_NAME;

                    var row9 = worksheet.getRow(9);
                    row9.getCell(7).value = dt_m[0].IMPLEMENTATION_STANDARDS;

                    var row10 = worksheet.getRow(10);
                    row10.getCell(7).value = dt_m[0].RETAIL_PRICE;

                    worksheet.mergeCells(total_dtl_pos, 7, total_dtl_pos, 10);
                    var rowDeli_date = worksheet.getRow(total_dtl_pos);
                    rowDeli_date.height = 38.3;
                    rowDeli_date.getCell(7).font = { italic: false, bold: true, color: { argb: '000000' }, size: 30, name: 'Calibri' };

                    rowDeli_date.getCell(7).value = dt_m[0].OGAC_DATE;

                    worksheet.mergeCells(total_dtl_pos_2, 1, total_dtl_pos_2, 4);
                }

                /* if (dt_m3.length > 1) {
                     worksheet.duplicateRow(pos, dt_m3.length-4, true);
                 }*/
                var pos_01 = 13;
                for (var i = 0; i < dt_m3.length; i++) {
                    var row = worksheet.getRow(pos_01 + i);
                    var row2 = worksheet.getRow(pos_01 + i - 2);
                    if ((i) % 2 === 0 && i < dt_m3.length - 3) {

                        console.log("a " + i % 2);
                        for (let k = 1; k <= 20; k++) {
                            row.getCell(k).fill = { type: "pattern", pattern: "solid", fgColor: { argb: 'FFDAB9' } };
                            row.getCell(k).alignment = { vertical: 'middle', horizontal: 'center' };

                            if (i > 1 && i < dt_m3.length - 2) {
                                row.getCell(1).border = { left: { style: 'medium', color: 'black' } };
                                row.getCell(19).border = { left: { style: 'medium', color: 'black' }, right: { style: 'medium', color: 'black' } };
                                row.getCell(20).border = { right: { style: 'medium', color: 'black' } };
                            }

                        }

                    }
                    else {

                        if (i == dt_m3.length - 1) {
                            console.log("b " + i % 2);
                            for (let k2 = 1; k2 <= 20; k2++) {
                                row2.getCell(k2).border = {
                                    top: { style: 'medium', color: 'black' },
                                    left: { style: 'medium', color: 'black' },
                                    bottom: { style: 'medium', color: 'black' },
                                    right: { style: 'medium', color: 'black' }
                                };
                                row2.getCell(k2).alignment = { vertical: 'middle', horizontal: 'center' };
                                row2.getCell(k2).font.bold = true;
                            }


                        }
                        else {
                            for (let k3 = 1; k3 <= 20; k3++) {
                                row.getCell(k3).alignment = { vertical: 'middle', horizontal: 'center' };

                                if (i > 1 && i < dt_m3.length - 2) {
                                    row.getCell(1).border = { left: { style: 'medium', color: 'black' } };
                                    row.getCell(19).border = { left: { style: 'medium', color: 'black' }, right: { style: 'medium', color: 'black' } };
                                    row.getCell(20).border = { right: { style: 'medium', color: 'black' } };
                                }
                            }
                        }
                        //row.getCell(2).font = {  color: { argb: '000000'} };

                    }
                }
                //worksheet.mergeCells(7, 2, 9, 2);
                //worksheet.mergeCells(pos-1, 8, pos-1, 10);
                var pos_dtl = 11;
                for (var i = 0; i < dt_m3.length; i++) {

                    var row = worksheet.getRow(pos_dtl + i);

                    /*if(i >1)
                    {
                        if(dt_m3[i-1].CUST_NAME_ENG==dt_m3[i].CUST_NAME_ENG)
                        {
                            worksheet.mergeCells(pos-1, 2, pos, 2);
                        }
                        //worksheet.mergeCells(pos+i, 8, pos+i, 10);
                    }*/
                    if (i > 1 && i < dt_m3.length - 1) {
                        row.getCell(1).value = i - 1;
                        worksheet.mergeCells(pos_dtl + i, 2, pos_dtl + i, 3);

                    }
                    row.getCell(2).value = dt_m3[i].BARCODE;
                    row.getCell(4).value = dt_m3[i].SIZE_CODE;
                    row.getCell(5).value = dt_m3[i].ATT01;
                    row.getCell(6).value = dt_m3[i].ATT02;
                    row.getCell(7).value = dt_m3[i].ATT03;
                    row.getCell(8).value = dt_m3[i].ATT04;
                    row.getCell(9).value = dt_m3[i].ATT05;
                    row.getCell(10).value = dt_m3[i].ATT06;
                    row.getCell(11).value = dt_m3[i].ATT07;
                    row.getCell(12).value = dt_m3[i].ATT08;
                    row.getCell(13).value = dt_m3[i].ATT09;

                    /*row.getCell(13).value = dt_m3[i].ATT10;
                    row.getCell(14).value = dt_m3[i].ATT11;
                    row.getCell(15).value = dt_m3[i].ATT12;
                    row.getCell(16).value = dt_m3[i].ATT13;
                    row.getCell(17).value = dt_m3[i].ATT14;
                    row.getCell(18).value  =dt_m3[i].ATT15;
                    row.getCell(19).value =dt_m3[i].ATT16;
                    row.getCell(20).value =dt_m3[i].ATT17;
                    row.getCell(21).value =dt_m3[i].ATT18;
                	
                    row.getCell(22).value = dt_m3[i].ATT19;
                    row.getCell(23).value = dt_m3[i].ATT20;
                    row.getCell(24).value = dt_m3[i].ATT21;
                    row.getCell(25).value = dt_m3[i].ATT22;
                    row.getCell(26).value = dt_m3[i].ATT23;
                    row.getCell(27).value  =dt_m3[i].ATT24;
                    row.getCell(28).value =dt_m3[i].ATT25;
                    row.getCell(29).value =dt_m3[i].ATT26;
                    row.getCell(30).value =dt_m3[i].ATT27;
                	
                    row.getCell(31).value = dt_m3[i].ATT28;
                    row.getCell(32).value = dt_m3[i].ATT29;
                    row.getCell(33).value = dt_m3[i].ATT30;*/

                    row.getCell(14).value = dt_m3[i].TOTAL;
                    row.getCell(15).value = dt_m3[i].G_TOTAL;
                    row.getCell(16).value = dt_m3[i].LOSS;
                    row.getCell(17).value = dt_m3[i].EXTRA;
                    row.getCell(18).value = dt_m3[i].PRINTED_NO;
                    row.getCell(19).value = dt_m3[i].REMAIN;
                    row.getCell(20).value = dt_m3[i].PRINTED_TIME;

                }


                /********* Print file excel ********/
                const reportFile = Helpers.tmpPath(file_new);
                await workbook.xlsx.writeFile(reportFile);
                return response.attachment(reportFile, file_new)

            }
        }
        catch (e) {
            // Utils.Logger({ LVL: "error", MODULE: "Report", FUNC: "Picking_list", CONTENT: e.message }) 
            //return response.send(null);
            console.log(e)
            return response.send(Utils.response(false, e.message, null))
        }
    }
    //=============END===DETAIL====BARCODE=======ANTA====english(QR)========
    //===========report---detail---barcode--ANTA----------------
    //=======================Order import V2 china==========================//
    async rptswsoNK030_01({ request, response, auth }) {
        try {
            /****************************** Get Param *********************************/
            let { para } = request.get(['para']);
            /********* Parse param to json ********/
            var item = JSON.parse(para);
            const user = await auth.getUser();
            const p_crt_by = user.USER_ID;
            const p_language = request.header("accept-language", "ENG");

            var file_nm = [item.P_FILE_NAME_NEW];
            var file_type = ".xlsx";
            var full_nm = file_nm + file_type;
            var file_new = file_nm + p_crt_by + file_type;
            var _resourcesPath = "report/sw/nk" + '/' + "rpt_swnk030_barcode_detail_v01.xlsx";
            var _store = "SZ_SEL_SWNK030_EXPORT_MST_NOCACHE";
            var _store2 = "SZ_SEL_SWNK030_EXPORT_H_NOCACHE";
            var _store3 = "SZ_SEL_SWNK030_EXPORT_NOCACHE";
            var _param = [item.p_company_pk, item.p_PartnerCD_NM, item.p_AccCD_NM, item.p_AccountType, item.p_month, item.p_factory_pk, item.p_month_to];

            /***************************** Return failed ****************************/
            if (!user) {
                return response.send(Utils.response(false, "Request failed!", null));
            }
            /****************************** Begin call store and write excel *********/
            else {
                /********* Call store  ***************/
                var dt_m = await DBService.callProcCursor(_store, _param, p_language, p_crt_by);
                var dt_m2 = await DBService.callProcCursor(_store2, _param, p_language, p_crt_by);
                var dt_m3 = await DBService.callProcCursor(_store3, _param, p_language, p_crt_by);

                const total_dtl_pos = dt_m3.length + 14;
                const total_dtl_pos_2 = dt_m3.length + 11;

                /********* Read file excel ********/
                const templateFile = Helpers.resourcesPath(_resourcesPath);
                await workbook.xlsx.readFile(templateFile);
                var worksheet = workbook.getWorksheet(1);
                //ham ke o
                function mergeCellsAndAddBorders(range) {
                    try {
                        // worksheet.mergeCells(range); // This line has been removed as requested
                        const [startCell, endCell] = range.split(':');
                        worksheet.getCell(startCell).border = {
                            top: { style: 'medium', color: { argb: 'FF000000' } },
                            left: { style: 'medium', color: { argb: 'FF000000' } },
                            bottom: { style: 'medium', color: { argb: 'FF000000' } },
                            right: { style: 'medium', color: { argb: 'FF000000' } }
                        };
                        console.log(`Successfully bordered: ${range}`);
                    } catch (error) {
                        console.error(`Error processing range ${range}: ${error.message}`);
                    }
                }


                // Add labels to specified cells
                const cellValues = {
                    'A3': 'FACTORY:', 'A4': 'ORDER NO:', 'A5': 'DPO:', 'A6': 'GENDER:',
                    'A7': 'STYLE & COLOR', 'B11': 'BARCODE', 'D11': 'SIZE', 'L4': 'Printed date',
                    'L5': 'Shift', 'L6': 'Shift B', 'N4': 'Date………………………………………………',
                    'N5': "User's name & Machine's  name ", 'R5': 'Pager size', 'T5': 'Roll no',
                    'R6': '12*1000', 'L4': '0.2', 'M10': 'REMEMBER TO PRINT FROM SMALL SIZE --> BIG SIZE !!',
                    'N11': 'TOTAL_QTY', 'O11': 'G_TOTAL', 'P11': 'LOSS_QTY', 'Q11': 'EXTRA_QTY', 'R11': 'PRINTED_NO',
                    'S11': 'REMAIN', 'T11': 'PRINTED_TIME', 'E7': '系列', 'E8': '面料', 'E9': '执行标准', 'E10': '零售价'
                };

                Object.entries(cellValues).forEach(([cellAddress, value]) => {
                    const cell = worksheet.getCell(cellAddress);
                    cell.value = value;

                    if (['A3', 'A4', 'A5', 'A6'].includes(cellAddress)) {
                        cell.font = { bold: false, size: 12 };
                        cell.alignment = { vertical: 'middle', horizontal: 'left' };
                    } else if (['A7', 'L5', 'L6', 'L4', 'T5'].includes(cellAddress)) {
                        cell.font = { size: 16, bold: true, };
                        cell.alignment = { vertical: 'middle', horizontal: 'center' };
                    } else if (cellAddress === 'M10') {
                        cell.font = { size: 14, color: { argb: 'FFFF0000' } };
                        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF00' } };
                        cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
                    } else if (cellAddress === 'C5') {
                        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF00' } };
                        cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
                    } else if (['N11', 'O11', 'P11', 'Q11', 'R11', 'S11', 'T11'].includes(cellAddress)) {
                        cell.font = { size: 12, bold: true, };
                        cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
                    } else if (['E7', 'E8', 'E9', 'E10'].includes(cellAddress)) {
                        cell.font = { size: 18, bold: false, };
                        cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
                    } else {
                        cell.font = { size: 14, bold: true, };
                        cell.alignment = { vertical: 'middle', horizontal: 'center' };
                    }
                });

                // Add borders to specified ranges
                const rangesToBorder = [
                    'L4:M4', 'L5:M5', 'L6:M7',
                    'N4:T4', 'N5:Q5', 'R5:S5', 'N6:Q7', 'R6:S7', 'T6:T7', 'A7:D7',
                    'E7:F7', 'G7:K7', 'A8:D10', 'E8:F8', 'E9:F9', 'E10:F10', 'G8:O8',
                    'P8:Q8', 'R8:T8', 'G9:T9', 'G10:J10', 'K10:L10', 'M10:T10', 'B11:C11',
                    'T5', 'D11:T11',

                ];


                rangesToBorder.forEach(range => mergeCellsAndAddBorders(range));

                // Thêm đường kẻ dọc cho S12 và T12
                ['S12', 'T12'].forEach(cellAddress => {
                    const cell = worksheet.getCell(cellAddress);
                    cell.border = {
                        ...cell.border,
                        left: { style: 'medium' },
                        right: { style: 'medium' }
                    };
                });

                //them đường kẻ từ A11 đến T11
                worksheet.getCell('A11').border = {
                    top: { style: 'medium' },
                    left: { style: 'medium' },
                    bottom: { style: 'medium' },
                    right: { style: 'medium' }
                };

                for (let col = 'B'; col <= 'T'; col = String.fromCharCode(col.charCodeAt(0) + 1)) {
                    worksheet.getCell(`${col}11`).border = {
                        top: { style: 'medium' },
                        bottom: { style: 'medium' },
                        right: { style: 'medium' }
                    };
                }


                // Điều chỉnh độ rộng của các cột từ A đến T
                const columnWidths = {
                    A: 6.22, B: 15.78, C: 9.33, D: 9.67, E: 16.22,
                    F: 16.22, G: 11, H: 11, I: 11, J: 11,
                    K: 11, L: 11, M: 12.11, N: 12.22, O: 12.22,
                    P: 8.44, Q: 8.44, R: 11.44, S: 8.11, T: 9.11
                };
                const rowHeights = {
                    11: 42
                };

                // Đặt chiều rộng cột
                Object.entries(columnWidths).forEach(([col, width]) => {
                    worksheet.getColumn(col).width = width;
                });

                // Đặt chiều cao hàng
                Object.entries(rowHeights).forEach(([row, height]) => {
                    worksheet.getRow(parseInt(row)).height = height;
                });
                //======== end ham ke o=========================================

                worksheet.mergeCells('A1:P2');
                worksheet.mergeCells('A3:B3');
                worksheet.mergeCells('A4:B4');
                worksheet.mergeCells('A6:B6');
                worksheet.mergeCells('L4:M4');
                worksheet.mergeCells('L5:M5');
                worksheet.mergeCells('L6:M7');
                worksheet.mergeCells('N4:T4');
                worksheet.mergeCells('N5:Q5');
                worksheet.mergeCells('R5:S5');
                worksheet.mergeCells('N6:Q7');
                worksheet.mergeCells('R6:S7');
                worksheet.mergeCells('T6:T7');
                worksheet.mergeCells('A7:D7');
                worksheet.mergeCells('E7:F7');
                worksheet.mergeCells('G7:K7');
                worksheet.mergeCells('A8:D10');
                worksheet.mergeCells('E8:F8');
                worksheet.mergeCells('E9:F9');
                worksheet.mergeCells('E10:F10');
                worksheet.mergeCells('G8:O8');
                worksheet.mergeCells('P8:Q8');
                worksheet.mergeCells('R8:T8');
                worksheet.mergeCells('G9:T9');
                worksheet.mergeCells('G10:J10');
                worksheet.mergeCells('K10:L10');
                worksheet.mergeCells('M10:T10');
                worksheet.mergeCells('B11:C11');

                // const mercellranges = ['A1:P2', 'A3:B3', 'A4:B4', 'A6:B6', 'L4:M4', 'L5:M5', 'L6:M7', 'N4:T4', 'N5:Q5', 'R5:S5', 'N6:Q7',
                //     'R6:S7', 'T6:T7', 'A7:D7', 'E7:F7', 'G7:K7', 'A8:D10', 'E8:F8', 'E9:F9', 'E10:F10', 'G8:O8', 'P8:Q8', 'R8:T8', 'G9:T9', 'G10:J10',
                //     'K10:L10', 'M10:T10', 'B11:C11',];
                // mercellranges.forEach(range => worksheet.mergeCells(range));
                // Helper function to safely set font properties
                function setFontProperty(cell, property, value) {
                    if (!cell.font) {
                        cell.font = {};
                    }
                    cell.font[property] = value;
                }

                // Tính số lượng worksheet cần tạo
                const attColumnCount = 45; // Tổng số cột ATT
                const attPerSheet = 9; // Số cột ATT trên mỗi trang
                const sheetCount = Math.ceil(attColumnCount / attPerSheet);

                // Function to create a deep copy of a worksheet
                // Đổi tên sheet đầu tiên
                worksheet.name = dt_m[0].PO_NO;
                function createWorksheetCopy(sourceWorksheet, newName) {
                    const newWorksheet = workbook.addWorksheet(newName);

                    // Copy worksheet properties
                    newWorksheet.properties = JSON.parse(JSON.stringify(sourceWorksheet.properties));
                    newWorksheet.properties.tabColor = sourceWorksheet.properties.tabColor;

                    // Copy column properties and widths
                    sourceWorksheet.columns.forEach((col, index) => {
                        const newCol = newWorksheet.getColumn(index + 1);
                        newCol.width = col.width;
                        newCol.hidden = col.hidden;
                        newCol.outlineLevel = col.outlineLevel;
                    });

                    // Copy row properties and cell contents
                    sourceWorksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
                        const newRow = newWorksheet.getRow(rowNumber);
                        newRow.height = row.height;
                        newRow.hidden = row.hidden;
                        newRow.outlineLevel = row.outlineLevel;

                        row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                            const newCell = newRow.getCell(colNumber);
                            newCell.value = cell.value;
                            newCell.style = JSON.parse(JSON.stringify(cell.style));
                            if (cell.dataValidation) {
                                newCell.dataValidation = JSON.parse(JSON.stringify(cell.dataValidation));
                            }
                        });

                        // Ensure the row is committed to the worksheet
                        newRow.commit();
                    });

                    // Copy merged cells
                    if (sourceWorksheet._merges) {
                        if (sourceWorksheet._merges instanceof Map) {
                            sourceWorksheet._merges.forEach((value, key) => {
                                newWorksheet.mergeCells(key);
                            });
                        } else if (typeof sourceWorksheet._merges === 'object') {
                            Object.keys(sourceWorksheet._merges).forEach(key => {
                                newWorksheet.mergeCells(sourceWorksheet._merges[key]);
                            });
                        } else if (Array.isArray(sourceWorksheet._merges)) {
                            sourceWorksheet._merges.forEach(merge => {
                                newWorksheet.mergeCells(merge);
                            });
                        }
                    }

                    // Ensure all worksheets have the same number of rows and columns
                    const maxRow = sourceWorksheet.rowCount;
                    const maxCol = sourceWorksheet.columnCount;
                    newWorksheet.pageSetup = JSON.parse(JSON.stringify(sourceWorksheet.pageSetup));
                    newWorksheet.views = sourceWorksheet.views;

                    // Add any missing rows or columns
                    for (let i = 1; i <= maxRow; i++) {
                        if (!newWorksheet.getRow(i).hasValues) {
                            newWorksheet.getRow(i).height = sourceWorksheet.getRow(i).height;
                        }
                    }
                    for (let i = 1; i <= maxCol; i++) {
                        if (!newWorksheet.getColumn(i).width) {
                            newWorksheet.getColumn(i).width = sourceWorksheet.getColumn(i).width;
                        }
                    }

                    // Copy print area and page setup
                    if (sourceWorksheet.pageSetup && sourceWorksheet.pageSetup.printArea) {
                        newWorksheet.pageSetup.printArea = sourceWorksheet.pageSetup.printArea;
                    }


                    return newWorksheet;
                }



                //=============tạo header cho từng sheet====================//
                let worksheets = [worksheet];
                var cnt_lot_no1 = dt_m2[0].CNT_LOT_NO;
                var sheet_name = dt_m[0].PO_NO;

                for (let i = 0; i < cnt_lot_no1; i++) {
                    let sheetName = i === 0 ? sheet_name : `${sheet_name}(${i + 1})`;
                    let currentWorksheet = i === 0 ? worksheet : createWorksheetCopy(worksheet, sheetName);
                    if (i > 0) worksheets.push(currentWorksheet);

                    var row_auto = currentWorksheet.getRow(11);
                    for (let j = 0; j < 9; j++) {
                        let attIndex = i * 9 + j + 1;
                        let attField = `ATT${attIndex.toString().padStart(2, '0')}`;
                        let cell = row_auto.getCell(j + 5);

                        cell.value = dt_m2[0][attField];

                        // Áp dụng định dạng cho cell
                        cell.font = {
                            bold: true,
                            size: 16
                        };
                        cell.alignment = {
                            vertical: 'middle',
                            horizontal: 'center',
                            wrapText: true
                        };
                    }
                }
                //=============tạo header cho từng sheet====================//
                //==============setpage=====================================//
                const setupExcelForA4Printing = (worksheet) => {
                    // Xác định vùng dữ liệu thực tế
                    const startColumn = 1; // Cột A
                    const endColumn = 20; // Cột T
                    let lastRow = 1;

                    // Tìm hàng cuối cùng có dữ liệu
                    for (let col = startColumn; col <= endColumn; col++) {
                        const column = worksheet.getColumn(col);
                        column.eachCell({ includeEmpty: false }, (cell) => {
                            lastRow = Math.max(lastRow, cell.row);
                        });
                    }
                    // Đặt vùng in cho toàn bộ dữ liệu
                    worksheet.pageSetup.printArea = `A1:T${lastRow}`;
                    // Cấu hình trang để phù hợp với A4
                    worksheet.pageSetup.fitToPage = true;
                    // worksheet.pageSetup.scale = 65; 
                    worksheet.pageSetup.paperSize = 9; // 9 là mã cho giấy A4hỏ
                    worksheet.pageSetup.margins = {
                        left: 0.3,
                        right: 0,
                        top: 0,
                        bottom: 0,
                        header: 0,
                        footer: 0
                    };
                    // Đặt hướng giấy
                    worksheet.pageSetup.orientation = 'landscape';
                    // worksheet.pageSetup.printTitlesColumn = 'A:T';
                };
                //==============end setpage=====================================//


                // Xử lý dữ liệu cho từng worksheet
                worksheets.forEach((currentWorksheet, sheetIndex) => {
                    if (dt_m.length > 0) {
                        var row1 = currentWorksheet.getRow(1);
                        row1.getCell(1).value = dt_m[0].ITEM_NAME || '';
                        setFontProperty(row1.getCell(1), 'size', 24);
                        setFontProperty(row1.getCell(1), 'bold', true);
                        setFontProperty(row1.getCell(1), 'name', 'Rockwell Condensed');
                        row1.getCell(1).alignment = { vertical: "middle", horizontal: "left" };

                        var row2 = currentWorksheet.getRow(3);
                        row2.getCell(3).value = dt_m[0].FACTORY || '';
                        setFontProperty(row2.getCell(3), 'size', 16, 'bold', true);

                        var row3 = currentWorksheet.getRow(4);
                        row3.getCell(3).value = dt_m[0].ORDER_NO || '';
                        setFontProperty(row3.getCell(3), 'size', 16, 'bold', true);
                        row3.getCell(6).value = dt_m[0].INNER_BOX_CODE || '';
                        setFontProperty(row3.getCell(6), 'size', 16,);
                        setFontProperty(row3.getCell(6), 'bold', true);
                        var row4 = currentWorksheet.getRow(5);
                        row4.getCell(3).value = dt_m[0].DPO || '';
                        setFontProperty(row4.getCell(3), 'size', 16, 'bold', true);
                        row4.getCell(3).fill = {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: { argb: 'FFFF00' }  // Mã màu vàng
                        };

                        var row5 = currentWorksheet.getRow(6);
                        row5.getCell(3).value = dt_m[0].GENDER || '';
                        setFontProperty(row5.getCell(3), 'size', 16, 'bold', true);

                        var row7 = currentWorksheet.getRow(7);
                        row7.getCell(7).value = dt_m[0].SERIES || '';
                        setFontProperty(row7.getCell(7), 'size', 18);
                        setFontProperty(row7.getCell(7), 'bold', false);
                        setFontProperty(row7.getCell(7), 'name', 'Calibri');
                        row7.getCell(7).alignment = { vertical: "middle", horizontal: "left" };

                        var row8 = currentWorksheet.getRow(8);
                        row8.getCell(1).value = dt_m[0].PO_NO || '';
                        setFontProperty(row8.getCell(1), 'size', 32);
                        setFontProperty(row8.getCell(1), 'bold', true);
                        setFontProperty(row8.getCell(1), 'name', 'Calibri');
                        row8.getCell(1).alignment = { vertical: "middle", horizontal: "center" };

                        row8.getCell(7).value = dt_m[0].UPPER_NAME || '';
                        setFontProperty(row8.getCell(7), 'size', 18);
                        setFontProperty(row8.getCell(7), 'bold', false);
                        setFontProperty(row8.getCell(7), 'name', 'Calibri');
                        row8.getCell(7).alignment = { vertical: "middle", horizontal: "left" };

                        var row9 = currentWorksheet.getRow(9);
                        row9.getCell(7).value = dt_m[0].IMPLEMENTATION_STANDARDS || '';
                        setFontProperty(row9.getCell(7), 'size', 18);
                        setFontProperty(row9.getCell(7), 'bold', true);
                        setFontProperty(row9.getCell(7), 'name', 'Calibri');
                        setFontProperty(row9.getCell(7), 'color', { argb: 'FFFF0000' });
                        row9.getCell(7).alignment = { vertical: "middle", horizontal: "left" };

                        var row10 = currentWorksheet.getRow(10);
                        row10.getCell(7).value = dt_m[0].RETAIL_PRICE || '';
                        setFontProperty(row10.getCell(7), 'size', 18);
                        setFontProperty(row10.getCell(7), 'bold', true);
                        setFontProperty(row10.getCell(7), 'name', 'Calibri');
                        setFontProperty(row10.getCell(7), 'color', { argb: 'FFFF0000' });
                        row10.getCell(7).alignment = { vertical: "middle", horizontal: "left" };

                        currentWorksheet.mergeCells(total_dtl_pos, 7, total_dtl_pos, 10);
                        var rowDeli_date = currentWorksheet.getRow(total_dtl_pos);

                        rowDeli_date.height = 61.3;
                        setFontProperty(rowDeli_date.getCell(1), 'size', 24, 'bold', true);
                        setFontProperty(rowDeli_date.getCell(7), 'italic', false);
                        setFontProperty(rowDeli_date.getCell(7), 'bold', true);
                        setFontProperty(rowDeli_date.getCell(7), 'color', { argb: '000000' });
                        setFontProperty(rowDeli_date.getCell(7), 'size', 48);
                        setFontProperty(rowDeli_date.getCell(7), 'name', 'Calibri');
                        rowDeli_date.getCell(7).alignment = { vertical: "middle", horizontal: "center" };
                        rowDeli_date.getCell(7).value = dt_m[0].OGAC_DATE || '';

                        currentWorksheet.mergeCells(total_dtl_pos_2, 1, total_dtl_pos_2, 4);
                    }

                    var pos_dtl = 12;
                    var lastRow = pos_dtl + dt_m3.length - 1;

                    // Đặt chiều cao và font size cho tất cả các dòng trong vùng dữ liệu
                    for (var i = pos_dtl; i <= lastRow; i++) {
                        var row = currentWorksheet.getRow(i);
                        row.height = 25.7;

                        row.eachCell({ includeEmpty: true }, function (cell) {
                            cell.font = {
                                name: 'Calibri',
                                size: 16,
                                family: 2
                            };
                        });
                    }

                    for (var i = 0; i < dt_m3.length; i++) {
                        var row = currentWorksheet.getRow(pos_dtl + i);

                        if (i < dt_m3.length - 1) {  // Xử lý các dòng chi tiết
                            // Đặt giá trị và font cho ô đầu tiên
                            const cell1 = row.getCell(1);
                            cell1.value = i + 1;
                            cell1.font = { name: 'Calibri', size: 16, family: 2 };
                            cell1.alignment = { vertical: 'middle', horizontal: 'center' };

                            // Merge ô và đặt alignment
                            currentWorksheet.mergeCells(pos_dtl + i, 2, pos_dtl + i, 3);
                            row.getCell(2).alignment = { vertical: 'middle', horizontal: 'center' };

                            // Đặt giá trị và font cho ô BARCODE
                            const cell2 = row.getCell(2);
                            cell2.value = dt_m3[i].BARCODE || '';
                            cell2.font = { name: 'Calibri', size: 16, family: 2 };

                            // Đặt giá trị và font cho ô SIZE_CODE
                            const cell4 = row.getCell(4);
                            cell4.value = dt_m3[i].SIZE_CODE || '';
                            cell4.font = { name: 'Calibri', size: 16, family: 2 };

                            // Điền các cột ATT cho worksheet hiện tại
                            for (let j = 0; j < attPerSheet; j++) {
                                const attIndex = sheetIndex * attPerSheet + j + 1;
                                if (attIndex <= attColumnCount) {
                                    const attValue = dt_m3[i][`ATT${attIndex.toString().padStart(2, '0')}`];
                                    const cell = row.getCell(j + 5);
                                    cell.value = attValue !== undefined && attValue !== null ? attValue : '';
                                    cell.font = { name: 'Calibri', size: 16, family: 2 };
                                    cell.alignment = { vertical: 'middle', horizontal: 'center' };
                                }
                            }

                            // Thêm công thức tính tổng cho cột 14 (tổng từ cột 5 đến 13)
                            let sumFormula = `SUM(E${pos_dtl + i}:M${pos_dtl + i})`;
                            console.log(`Hàng ${pos_dtl + i}, Cột 14: Áp dụng công thức ${sumFormula}`);
                            try {
                                row.getCell(14).value = { formula: sumFormula };
                                row.getCell(14).numFmt = '0;-0;;@';
                            } catch (error) {
                                console.error(`Error setting formula for row ${pos_dtl + i}, column N:`, error);
                                row.getCell(14).value = null;
                            }

                            // Đặt giá trị, font và alignment cho các cột từ 14 đến 20
                            for (let col = 14; col <= 20; col++) {
                                const cell = row.getCell(col);
                                cell.font = { name: 'Calibri', size: 16, family: 2 };
                                cell.alignment = { vertical: 'middle', horizontal: 'center' };

                                switch (col) {
                                    case 14:
                                        // Đã xử lý ở trên
                                        break;
                                    case 15:
                                        cell.value = dt_m3[i].G_TOTAL || '';
                                        break;
                                    case 16:
                                        cell.value = dt_m3[i].LOSS || '';
                                        break;
                                    case 17:
                                        cell.value = dt_m3[i].EXTRA || '';
                                        break;
                                    case 18:
                                        cell.value = dt_m3[i].PRINTED_NO || '';
                                        break;
                                    case 19:
                                        cell.value = dt_m3[i].REMAIN || '';
                                        break;
                                    case 20:
                                        cell.value = dt_m3[i].PRINTED_TIME || '';
                                        break;
                                }

                                // Nếu là giá trị số, đặt định dạng số
                                if (col !== 20) {
                                    // cell.numFmt = '#,##0';
                                }
                            }
                        } else {  // Xử lý dòng tổng cộng
                            console.log("Xử lý dòng tổng cộng");
                            row.getCell(1).value = 'TOTAL';
                            row.getCell(1).font = { ...row.getCell(1).font, size: 16, bold: true };
                            row.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };

                            // Xử lý các cột từ 5 đến 13
                            for (let col = 5; col <= 13; col++) {
                                let colLetter = String.fromCharCode(64 + col);
                                let formulaText = `SUM(${colLetter}${pos_dtl}:${colLetter}${lastRow - 1})`;
                                console.log(`Cột ${col}: Áp dụng công thức ${formulaText}`);
                                try {
                                    row.getCell(col).value = { formula: formulaText };
                                    row.getCell(col).numFmt = '0;-0;;@';
                                } catch (error) {
                                    console.error(`Error setting formula for column ${colLetter}:`, error);
                                    row.getCell(col).value = null;
                                }
                                row.getCell(col).font = { size: 16 };
                            }

                            // Xử lý cột 14 (tổng từ cột 5 đến 13)
                            let sumFormula = `SUM(N${pos_dtl}:N${lastRow - 1})`;
                            console.log(`Cột 14 (Tổng cộng): Áp dụng công thức ${sumFormula}`);
                            try {
                                row.getCell(14).value = { formula: sumFormula };
                                row.getCell(14).numFmt = '0;-0;;@';
                            } catch (error) {
                                console.error(`Error setting formula for column N:`, error);
                                row.getCell(14).value = null;
                            }
                            row.getCell(14).font = { size: 16 };

                            // Xử lý các cột từ 15 đến 20
                            for (let col = 15; col <= 20; col++) {
                                if (col >= 15 && col <= 18) {
                                    let colLetter = String.fromCharCode(64 + col);
                                    let formulaText = `SUM(${colLetter}${pos_dtl}:${colLetter}${lastRow - 1})`;
                                    console.log(`Cột ${col}: Áp dụng công thức ${formulaText}`);
                                    try {
                                        row.getCell(col).value = { formula: formulaText };
                                        row.getCell(col).numFmt = '0;-0;;@';
                                    } catch (error) {
                                        console.error(`Error setting formula for column ${colLetter}:`, error);
                                        row.getCell(col).value = null;
                                    }
                                } else {
                                    row.getCell(col).value = dt_m3[i][`COL${col}`] || null;
                                }
                                row.getCell(col).font = { size: 16 };
                            }
                        }
                    } var pos_01 = 12;
                    for (var i = 0; i <= dt_m3.length - 1; i++) {
                        var row = currentWorksheet.getRow(pos_01 + i);
                        if ((i) % 2 != 0 && i < dt_m3.length - 1) {
                            for (let k = 1; k <= 20; k++) {
                                const cell = row.getCell(k);
                                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: 'FFDAB9' } };
                                cell.alignment = { vertical: 'middle', horizontal: 'center' };

                                // Thêm đường viền cho tất cả các dòng
                                if (k === 1) {
                                    cell.border = { ...cell.border, left: { style: 'medium', color: 'black' } };
                                }
                                if (k === 19) {
                                    cell.border = { ...cell.border, left: { style: 'medium', color: 'black' }, right: { style: 'medium', color: 'black' } };
                                }
                                if (k === 20) {
                                    cell.border = { ...cell.border, right: { style: 'medium', color: 'black' } };
                                }
                            }
                        } else {
                            if (i == dt_m3.length - 1) {
                                for (let k2 = 1; k2 <= 20; k2++) {
                                    const cell = row.getCell(k2);
                                    cell.border = {
                                        top: { style: 'medium', color: 'black' },
                                        left: { style: 'medium', color: 'black' },
                                        bottom: { style: 'medium', color: 'black' },
                                        right: { style: 'medium', color: 'black' }
                                    };
                                    cell.alignment = { vertical: 'middle', horizontal: 'center' };
                                    cell.font = { ...cell.font, bold: true };
                                }
                            } else {
                                for (let k3 = 1; k3 <= 20; k3++) {
                                    const cell = row.getCell(k3);
                                    cell.alignment = { vertical: 'middle', horizontal: 'center' };

                                    // Thêm đường viền cho tất cả các dòng
                                    if (k3 === 1) {
                                        cell.border = { ...cell.border, left: { style: 'medium', color: 'black' } };
                                    }
                                    if (k3 === 19) {
                                        cell.border = { ...cell.border, left: { style: 'medium', color: 'black' }, right: { style: 'medium', color: 'black' } };
                                    }
                                    if (k3 === 20) {
                                        cell.border = { ...cell.border, right: { style: 'medium', color: 'black' } };
                                    }
                                }
                            }
                        }
                    }
                    // Apply A4 print setup
                    setupExcelForA4Printing(currentWorksheet);

                    //end set up A4//

                });


                /********* Print file excel ********/
                const reportFile = Helpers.tmpPath(file_new);
                await workbook.xlsx.writeFile(reportFile);
                return response.attachment(reportFile, file_new)
            }
        }
        catch (e) {
            console.log(e)
            return response.send(Utils.response(false, e.message, null))
        }
    }
    //======================= end Order import V2 china==========================//

    async rptswsoNK050_02({ request, response, auth }) {
        try {
            /****************************** Get Param *********************************/
            let { para } = request.get(['para']);
            /********* Parse param to json ********/
            var item = JSON.parse(para);
            const user = await auth.getUser();
            const p_crt_by = user.USER_ID;
            const p_language = request.header("accept-language", "ENG");

            var file_nm = [item.P_FILE_NAME_NEW];
            var file_type = ".xlsx";
            var full_nm = file_nm + file_type;
            var file_new = file_nm + p_crt_by + file_type;
            var _resourcesPath = "report/sw/nk" + '/' + "rpt_swnk030_barcode_detail_v01.xlsx";
            var _store = "SZ_SEL_SWNK050_EXPORT_MST_NOCACHE";
            var _store2 = "SZ_SEL_SWNK030_EXPORT_H_NOCACHE";
            var _store3 = "SZ_SEL_SWNK050_EXPORT_NOCACHE";
            var _param = [item.p_company_pk, item.p_PartnerCD_NM, item.p_AccCD_NM, item.p_AccountType, item.p_month, item.p_factory_pk, item.p_month_to];

            /***************************** Return failed ****************************/
            if (!user) {
                return response.send(Utils.response(false, "Request failed!", null));
            }
            /****************************** Begin call store and write excel *********/
            else {
                /********* Call store  ***************/
                var dt_m = await DBService.callProcCursor(_store, _param, p_language, p_crt_by);
                var dt_m2 = await DBService.callProcCursor(_store2, _param, p_language, p_crt_by);
                var dt_m3 = await DBService.callProcCursor(_store3, _param, p_language, p_crt_by);

                const total_dtl_pos = dt_m3.length + 14;
                const total_dtl_pos_2 = dt_m3.length + 11;

                /********* Read file excel ********/
                const templateFile = Helpers.resourcesPath(_resourcesPath);
                await workbook.xlsx.readFile(templateFile);
                var worksheet = workbook.getWorksheet(1);
                //ham ke o
                function mergeCellsAndAddBorders(range) {
                    try {
                        // worksheet.mergeCells(range); // This line has been removed as requested
                        const [startCell, endCell] = range.split(':');
                        worksheet.getCell(startCell).border = {
                            top: { style: 'medium', color: { argb: 'FF000000' } },
                            left: { style: 'medium', color: { argb: 'FF000000' } },
                            bottom: { style: 'medium', color: { argb: 'FF000000' } },
                            right: { style: 'medium', color: { argb: 'FF000000' } }

                        };
                        // console.log(`Successfully bordered: ${range}`);
                    } catch (error) {
                        console.error(`Error processing range ${range}: ${error.message}`);
                    }
                }


                // Add labels to specified cells
                const cellValues = {
                    'A3': 'FACTORY:', 'A4': 'ORDER NO:', 'A5': 'DPO:', 'A6': 'GENDER:',
                    'A7': 'STYLE & COLOR', 'B11': 'BARCODE', 'D11': 'SIZE', 'L4': 'Printed date',
                    'L5': 'Shift', 'L6': 'Shift B', 'N4': 'Date………………………………………………',
                    'N5': "User's name & Machine's  name ", 'R5': 'Pager size', 'T5': 'Roll no',
                    'R6': '12*1000', 'L4': '0.2', 'M10': 'REMEMBER TO PRINT FROM SMALL SIZE --> BIG SIZE !!',
                    'N11': 'TOTAL_QTY', 'O11': 'G_TOTAL', 'P11': 'LOSS_QTY', 'Q11': 'EXTRA_QTY', 'R11': 'PRINTED_NO',
                    'S11': 'REMAIN', 'T11': 'PRINTED_TIME', 'E7': 'UPPER', 'E8': 'OUTSOLE', 'E9': 'COLOR', 'E10': '零售价'
                };

                Object.entries(cellValues).forEach(([cellAddress, value]) => {
                    const cell = worksheet.getCell(cellAddress);
                    cell.value = value;

                    if (['A3', 'A4', 'A5', 'A6'].includes(cellAddress)) {
                        cell.font = { bold: false, size: 12 };
                        cell.alignment = { vertical: 'middle', horizontal: 'left' };
                    } else if (['A7', 'L5', 'L6', 'L4', 'T5'].includes(cellAddress)) {
                        cell.font = { size: 16, bold: true };
                        cell.alignment = { vertical: 'middle', horizontal: 'center' };
                    } else if (cellAddress === 'M10') {
                        cell.font = { size: 14, color: { argb: 'FFFF0000' } };
                        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF00' } };
                        cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
                    } else if (cellAddress === 'C5') {
                        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF00' } };
                        cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
                    } else if (['N11', 'O11', 'P11', 'Q11', 'R11', 'S11', 'T11'].includes(cellAddress)) {
                        cell.font = { size: 12, bold: true };
                        cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
                    } else if (['E7', 'E8', 'E9', 'E10'].includes(cellAddress)) {
                        cell.font = { size: 18, bold: false };
                        cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
                    } else {
                        cell.font = { size: 14, bold: true };
                        cell.alignment = { vertical: 'middle', horizontal: 'center' };
                    }
                });

                // Add borders to specified ranges
                const rangesToBorder = [
                    'L4:M4', 'L5:M5', 'L6:M7',
                    'N4:T4', 'N5:Q5', 'R5:S5', 'N6:Q7', 'R6:S7', 'T6:T7', 'A7:D7',
                    'E7:F7', 'G7:K7', 'A8:D10', 'E8:F8', 'E9:F9', 'E10:F10', 'G8:O8',
                    'P8:Q8', 'R8:T8', 'G9:T9', 'G10:J10', 'K10:L10', 'M10:T10', 'B11:C11',
                    'T5', 'D11:T11',

                ];


                rangesToBorder.forEach(range => mergeCellsAndAddBorders(range));

                // Thêm đường kẻ dọc cho S12 và T12
                ['S12', 'T12'].forEach(cellAddress => {
                    const cell = worksheet.getCell(cellAddress);
                    cell.border = {
                        ...cell.border,
                        left: { style: 'medium' },
                        right: { style: 'medium' }
                    };
                });

                //them đường kẻ từ A11 đến T11
                worksheet.getCell('A11').border = {
                    top: { style: 'medium' },
                    left: { style: 'medium' },
                    bottom: { style: 'medium' },
                    right: { style: 'medium' }
                };

                for (let col = 'B'; col <= 'T'; col = String.fromCharCode(col.charCodeAt(0) + 1)) {
                    worksheet.getCell(`${col}11`).border = {
                        top: { style: 'medium' },
                        bottom: { style: 'medium' },
                        right: { style: 'medium' }
                    };
                }


                // Điều chỉnh độ rộng của các cột từ A đến T
                const columnWidths = {
                    A: 6.22, B: 15.78, C: 9.33, D: 9.67, E: 16.22,
                    F: 16.22, G: 11, H: 11, I: 11, J: 11,
                    K: 11, L: 11, M: 12.11, N: 12.22, O: 12.22,
                    P: 8.44, Q: 8.44, R: 11.44, S: 8.11, T: 9.11
                };
                const rowHeights = {
                    11: 42
                };

                // Đặt chiều rộng cột
                Object.entries(columnWidths).forEach(([col, width]) => {
                    worksheet.getColumn(col).width = width;
                });

                // Đặt chiều cao hàng
                Object.entries(rowHeights).forEach(([row, height]) => {
                    worksheet.getRow(parseInt(row)).height = height;
                });
                //======== end ham ke o=========================================

                worksheet.mergeCells('A1:P2');
                worksheet.mergeCells('A3:B3');
                worksheet.mergeCells('A4:B4');
                worksheet.mergeCells('A6:B6');
                worksheet.mergeCells('L4:M4');
                worksheet.mergeCells('L5:M5');
                worksheet.mergeCells('L6:M7');
                worksheet.mergeCells('N4:T4');
                worksheet.mergeCells('N5:Q5');
                worksheet.mergeCells('R5:S5');
                worksheet.mergeCells('N6:Q7');
                worksheet.mergeCells('R6:S7');
                worksheet.mergeCells('T6:T7');
                worksheet.mergeCells('A7:D7');
                worksheet.mergeCells('E7:F7');
                worksheet.mergeCells('G7:K7');
                worksheet.mergeCells('A8:D10');
                worksheet.mergeCells('E8:F8');
                worksheet.mergeCells('E9:F9');
                worksheet.mergeCells('E10:F10');
                worksheet.mergeCells('G8:O8');
                worksheet.mergeCells('P8:Q8');
                worksheet.mergeCells('R8:T8');
                worksheet.mergeCells('G9:T9');
                worksheet.mergeCells('G10:J10');
                worksheet.mergeCells('K10:L10');
                worksheet.mergeCells('M10:T10');
                worksheet.mergeCells('B11:C11');

                // const mercellranges = ['A1:P2', 'A3:B3', 'A4:B4', 'A6:B6', 'L4:M4', 'L5:M5', 'L6:M7', 'N4:T4', 'N5:Q5', 'R5:S5', 'N6:Q7',
                //     'R6:S7', 'T6:T7', 'A7:D7', 'E7:F7', 'G7:K7', 'A8:D10', 'E8:F8', 'E9:F9', 'E10:F10', 'G8:O8', 'P8:Q8', 'R8:T8', 'G9:T9', 'G10:J10',
                //     'K10:L10', 'M10:T10', 'B11:C11',];
                // mercellranges.forEach(range => worksheet.mergeCells(range));
                // Helper function to safely set font properties
                function setFontProperty(cell, property, value) {
                    if (!cell.font) {
                        cell.font = {};
                    }
                    cell.font[property] = value;
                }

                // Tính số lượng worksheet cần tạo
                const attColumnCount = 45; // Tổng số cột ATT
                const attPerSheet = 9; // Số cột ATT trên mỗi trang
                const sheetCount = Math.ceil(attColumnCount / attPerSheet);

                // Function to create a deep copy of a worksheet
                // Đổi tên sheet đầu tiên
                worksheet.name = dt_m[0].PO_NO;
                function createWorksheetCopy(sourceWorksheet, newName) {
                    const newWorksheet = workbook.addWorksheet(newName);

                    // Copy worksheet properties
                    newWorksheet.properties = JSON.parse(JSON.stringify(sourceWorksheet.properties));
                    newWorksheet.properties.tabColor = sourceWorksheet.properties.tabColor;

                    // Copy column properties and widths
                    sourceWorksheet.columns.forEach((col, index) => {
                        const newCol = newWorksheet.getColumn(index + 1);
                        newCol.width = col.width;
                        newCol.hidden = col.hidden;
                        newCol.outlineLevel = col.outlineLevel;
                    });

                    // Copy row properties and cell contents
                    sourceWorksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
                        const newRow = newWorksheet.getRow(rowNumber);
                        newRow.height = row.height;
                        newRow.hidden = row.hidden;
                        newRow.outlineLevel = row.outlineLevel;

                        row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                            const newCell = newRow.getCell(colNumber);
                            newCell.value = cell.value;
                            newCell.style = JSON.parse(JSON.stringify(cell.style));
                            if (cell.dataValidation) {
                                newCell.dataValidation = JSON.parse(JSON.stringify(cell.dataValidation));
                            }
                        });

                        // Ensure the row is committed to the worksheet
                        newRow.commit();
                    });

                    // Copy merged cells
                    if (sourceWorksheet._merges) {
                        if (sourceWorksheet._merges instanceof Map) {
                            sourceWorksheet._merges.forEach((value, key) => {
                                newWorksheet.mergeCells(key);
                            });
                        } else if (typeof sourceWorksheet._merges === 'object') {
                            Object.keys(sourceWorksheet._merges).forEach(key => {
                                newWorksheet.mergeCells(sourceWorksheet._merges[key]);
                            });
                        } else if (Array.isArray(sourceWorksheet._merges)) {
                            sourceWorksheet._merges.forEach(merge => {
                                newWorksheet.mergeCells(merge);
                            });
                        }
                    }

                    // Ensure all worksheets have the same number of rows and columns
                    const maxRow = sourceWorksheet.rowCount;
                    const maxCol = sourceWorksheet.columnCount;
                    newWorksheet.pageSetup = JSON.parse(JSON.stringify(sourceWorksheet.pageSetup));
                    newWorksheet.views = sourceWorksheet.views;

                    // Add any missing rows or columns
                    for (let i = 1; i <= maxRow; i++) {
                        if (!newWorksheet.getRow(i).hasValues) {
                            newWorksheet.getRow(i).height = sourceWorksheet.getRow(i).height;
                        }
                    }
                    for (let i = 1; i <= maxCol; i++) {
                        if (!newWorksheet.getColumn(i).width) {
                            newWorksheet.getColumn(i).width = sourceWorksheet.getColumn(i).width;
                        }
                    }

                    // Copy print area and page setup
                    if (sourceWorksheet.pageSetup && sourceWorksheet.pageSetup.printArea) {
                        newWorksheet.pageSetup.printArea = sourceWorksheet.pageSetup.printArea;
                    }


                    return newWorksheet;
                }



                //=============tạo header cho từng sheet====================//
                let worksheets = [worksheet];
                var cnt_lot_no1 = dt_m2[0].CNT_LOT_NO;
                var sheet_name = dt_m[0].PO_NO;

                for (let i = 0; i < cnt_lot_no1; i++) {
                    let sheetName = i === 0 ? sheet_name : `${sheet_name}(${i + 1})`;
                    let currentWorksheet = i === 0 ? worksheet : createWorksheetCopy(worksheet, sheetName);
                    if (i > 0) worksheets.push(currentWorksheet);

                    var row_auto = currentWorksheet.getRow(11);
                    for (let j = 0; j < 9; j++) {
                        let attIndex = i * 9 + j + 1;
                        let attField = `ATT${attIndex.toString().padStart(2, '0')}`;
                        let cell = row_auto.getCell(j + 5);

                        cell.value = dt_m2[0][attField];

                        // Áp dụng định dạng cho cell
                        cell.font = {
                            bold: true,
                            size: 16
                        };
                        cell.alignment = {
                            vertical: 'middle',
                            horizontal: 'center',
                            wrapText: true
                        };
                    }
                }
                //=============tạo header cho từng sheet====================//
                //==============setpage=====================================//
                const setupExcelForA4Printing = (worksheet) => {
                    // Xác định vùng dữ liệu thực tế
                    const startColumn = 1; // Cột A
                    const endColumn = 20; // Cột T
                    let lastRow = 1;

                    // Tìm hàng cuối cùng có dữ liệu
                    for (let col = startColumn; col <= endColumn; col++) {
                        const column = worksheet.getColumn(col);
                        column.eachCell({ includeEmpty: false }, (cell) => {
                            lastRow = Math.max(lastRow, cell.row);
                        });
                    }
                    // Đặt vùng in cho toàn bộ dữ liệu
                    worksheet.pageSetup.printArea = `A1:T35`;
                    // Cấu hình trang để phù hợp với A4
                    worksheet.pageSetup.fitToPage = true;
                    // worksheet.pageSetup.scale = 65; 
                    worksheet.pageSetup.paperSize = 9; // 9 là mã cho giấy A4hỏ
                    worksheet.pageSetup.margins = {
                        left: 0.3,
                        right: 0,
                        top: 0,
                        bottom: 0,
                        header: 0,
                        footer: 0
                    };
                    // Đặt hướng giấy
                    worksheet.pageSetup.orientation = 'landscape';
                    // worksheet.pageSetup.printTitlesColumn = 'A:T';
                };
                //==============end setpage=====================================//


                // Xử lý dữ liệu cho từng worksheet
                worksheets.forEach((currentWorksheet, sheetIndex) => {
                    if (dt_m.length > 0) {
                        var row1 = currentWorksheet.getRow(1);
                        row1.getCell(1).value = dt_m[0].ITEM_NAME || '';
                        setFontProperty(row1.getCell(1), 'size', 24);
                        setFontProperty(row1.getCell(1), 'bold', true);
                        setFontProperty(row1.getCell(1), 'name', 'Rockwell Condensed');
                        row1.getCell(1).alignment = { vertical: "middle", horizontal: "left" };

                        var row2 = currentWorksheet.getRow(3);
                        row2.getCell(3).value = dt_m[0].FACTORY || '';
                        setFontProperty(row2.getCell(3), 'size', 16, 'bold', true);

                        var row3 = currentWorksheet.getRow(4);
                        row3.getCell(3).value = dt_m[0].ORDER_NO || '';
                        setFontProperty(row3.getCell(3), 'size', 16, 'bold', true);
                        row3.getCell(6).value = dt_m[0].INNER_BOX_CODE || '';
                        setFontProperty(row3.getCell(6), 'size', 16,);
                        setFontProperty(row3.getCell(6), 'bold', true);
                        var row4 = currentWorksheet.getRow(5);
                        row4.getCell(3).value = dt_m[0].DPO || '';
                        setFontProperty(row4.getCell(3), 'size', 16, 'bold', true);
                        row4.getCell(3).fill = {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: { argb: 'FFFF00' }  // Mã màu vàng
                        };

                        var row5 = currentWorksheet.getRow(6);
                        row5.getCell(3).value = dt_m[0].GENDER || '';
                        setFontProperty(row5.getCell(3), 'size', 16, 'bold', true);

                        var row7 = currentWorksheet.getRow(7);
                        row7.getCell(7).value = dt_m[0].UPPER_NAME || '';
                        setFontProperty(row7.getCell(7), 'size', 18);
                        setFontProperty(row7.getCell(7), 'bold', false);
                        setFontProperty(row7.getCell(7), 'name', 'Calibri');
                        row7.getCell(7).alignment = { vertical: "middle", horizontal: "left" };

                        var row8 = currentWorksheet.getRow(8);
                        row8.getCell(1).value = dt_m[0].PO_NO || '';
                        setFontProperty(row8.getCell(1), 'size', 32);
                        setFontProperty(row8.getCell(1), 'bold', true);
                        setFontProperty(row8.getCell(1), 'name', 'Calibri');
                        row8.getCell(1).alignment = { vertical: "middle", horizontal: "center" };

                        row8.getCell(7).value = dt_m[0].OUTSOLE || '';
                        setFontProperty(row8.getCell(7), 'size', 18);
                        setFontProperty(row8.getCell(7), 'bold', false);
                        setFontProperty(row8.getCell(7), 'name', 'Calibri');
                        row8.getCell(7).alignment = { vertical: "middle", horizontal: "left" };

                        var row9 = currentWorksheet.getRow(9);
                        row9.getCell(7).value = dt_m[0].COLOR || '';
                        setFontProperty(row9.getCell(7), 'size', 18);
                        setFontProperty(row9.getCell(7), 'bold', true);
                        setFontProperty(row9.getCell(7), 'name', 'Calibri');
                        setFontProperty(row9.getCell(7), 'color', { argb: 'FFFF0000' });
                        row9.getCell(7).alignment = { vertical: "middle", horizontal: "left" };

                        var row10 = currentWorksheet.getRow(10);
                        row10.getCell(7).value = dt_m[0].RETAIL_PRICE1 || '';
                        setFontProperty(row10.getCell(7), 'size', 18);
                        setFontProperty(row10.getCell(7), 'bold', true);
                        setFontProperty(row10.getCell(7), 'name', 'Calibri');
                        setFontProperty(row10.getCell(7), 'color', { argb: 'FFFF0000' });
                        row10.getCell(7).alignment = { vertical: "middle", horizontal: "left" };

                        currentWorksheet.mergeCells(total_dtl_pos, 7, total_dtl_pos, 10);
                        var rowDeli_date = currentWorksheet.getRow(total_dtl_pos);

                        rowDeli_date.height = 61.3;
                        setFontProperty(rowDeli_date.getCell(1), 'size', 24, 'bold', true);
                        setFontProperty(rowDeli_date.getCell(7), 'italic', false);
                        setFontProperty(rowDeli_date.getCell(7), 'bold', true);
                        setFontProperty(rowDeli_date.getCell(7), 'color', { argb: '000000' });
                        setFontProperty(rowDeli_date.getCell(7), 'size', 48);
                        setFontProperty(rowDeli_date.getCell(7), 'name', 'Calibri');
                        rowDeli_date.getCell(7).alignment = { vertical: "middle", horizontal: "center" };
                        rowDeli_date.getCell(7).value = dt_m[0].OGAC_DATE || '';

                        currentWorksheet.mergeCells(total_dtl_pos_2, 1, total_dtl_pos_2, 4);
                    }

                    var pos_dtl = 12;
                    var lastRow = pos_dtl + dt_m3.length - 1;

                    // Đặt chiều cao và font size cho tất cả các dòng trong vùng dữ liệu
                    for (var i = pos_dtl; i <= lastRow; i++) {
                        var row = currentWorksheet.getRow(i);
                        row.height = 25.7;

                        row.eachCell({ includeEmpty: true }, function (cell) {
                            cell.font = {
                                name: 'Calibri',
                                size: 16,
                                family: 2
                            };
                        });
                    }

                    for (var i = 0; i < dt_m3.length; i++) {
                        var row = currentWorksheet.getRow(pos_dtl + i);

                        if (i < dt_m3.length - 1) {  // Xử lý các dòng chi tiết
                            // Đặt giá trị và font cho ô đầu tiên
                            const cell1 = row.getCell(1);
                            cell1.value = i + 1;
                            cell1.font = { name: 'Calibri', size: 16, family: 2 };
                            cell1.alignment = { vertical: 'middle', horizontal: 'center' };

                            // Merge ô và đặt alignment
                            currentWorksheet.mergeCells(pos_dtl + i, 2, pos_dtl + i, 3);
                            row.getCell(2).alignment = { vertical: 'middle', horizontal: 'center' };

                            // Đặt giá trị và font cho ô BARCODE
                            const cell2 = row.getCell(2);
                            cell2.value = dt_m3[i].BARCODE || '';
                            cell2.font = { name: 'Calibri', size: 16, family: 2 };

                            // Đặt giá trị và font cho ô SIZE_CODE
                            const cell4 = row.getCell(4);
                            cell4.value = dt_m3[i].SIZE_CODE || '';
                            cell4.font = { name: 'Calibri', size: 16, family: 2 };


                            for (let j = 0; j < attPerSheet; j++) {
                                const attIndex = sheetIndex * attPerSheet + j + 1;
                                if (attIndex <= attColumnCount) {
                                    const attValue = dt_m3[i][`ATT${attIndex.toString().padStart(2, '0')}`];
                                    const cell = row.getCell(j + 5);
                                    cell.value = attValue !== undefined && attValue !== null ? attValue : '';
                                    cell.font = { name: 'Calibri', size: 16, family: 2 };
                                    cell.alignment = { vertical: 'middle', horizontal: 'center' };
                                }
                            }

                            // Thêm công thức tính tổng cho cột 14 (tổng từ cột 5 đến 13)
                            let sumFormula = `SUM(E${pos_dtl + i}:M${pos_dtl + i})`;
                            // console.log(`Hàng ${pos_dtl + i}, Cột 14: Áp dụng công thức ${sumFormula}`);
                            try {
                                row.getCell(14).value = { formula: sumFormula };
                                row.getCell(14).numFmt = '0;-0;;@';
                            } catch (error) {
                                console.error(`Error setting formula for row ${pos_dtl + i}, column N:`, error);
                                row.getCell(14).value = null;
                            }

                            // Đặt giá trị, font và alignment cho các cột từ 14 đến 20
                            for (let col = 14; col <= 20; col++) {
                                const cell = row.getCell(col);
                                cell.font = { name: 'Calibri', size: 16, family: 2 };
                                cell.alignment = { vertical: 'middle', horizontal: 'center' };

                                switch (col) {
                                    case 14:
                                        // Đã xử lý ở trên
                                        break;
                                    case 15:
                                        cell.value = dt_m3[i].G_TOTAL || '';
                                        break;
                                    case 16:
                                        cell.value = dt_m3[i].LOSS || '';
                                        break;
                                    case 17:
                                        cell.value = dt_m3[i].EXTRA || '';
                                        break;
                                    case 18:
                                        cell.value = dt_m3[i].PRINTED_NO || '';
                                        break;
                                    case 19:
                                        cell.value = dt_m3[i].REMAIN || '';
                                        break;
                                    case 20:
                                        cell.value = dt_m3[i].PRINTED_TIME || '';
                                        break;
                                }

                                // Nếu là giá trị số, đặt định dạng số
                                if (col !== 20) {
                                    // cell.numFmt = '#,##0';
                                }
                            }
                        } else {  // Xử lý dòng tổng cộng
                            // console.log("Xử lý dòng tổng cộng");
                            row.getCell(1).value = 'TOTAL';
                            row.getCell(1).font = { ...row.getCell(1).font, size: 16, bold: true };
                            row.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };

                            // Xử lý các cột từ 5 đến 13
                            for (let col = 5; col <= 13; col++) {
                                let colLetter = String.fromCharCode(64 + col);
                                let formulaText = `SUM(${colLetter}${pos_dtl}:${colLetter}${lastRow - 1})`;
                                // console.log(`Cột ${col}: Áp dụng công thức ${formulaText}`);
                                try {
                                    row.getCell(col).value = { formula: formulaText };
                                    row.getCell(col).numFmt = '0;-0;;@';
                                } catch (error) {
                                    console.error(`Error setting formula for column ${colLetter}:`, error);
                                    row.getCell(col).value = null;
                                }
                                row.getCell(col).font = { size: 16 };
                            }

                            // Xử lý cột 14 (tổng từ cột 5 đến 13)
                            let sumFormula = `SUM(N${pos_dtl}:N${lastRow - 1})`;
                            // console.log(`Cột 14 (Tổng cộng): Áp dụng công thức ${sumFormula}`);
                            try {
                                row.getCell(14).value = { formula: sumFormula };
                                row.getCell(14).numFmt = '0;-0;;@';
                            } catch (error) {
                                console.error(`Error setting formula for column N:`, error);
                                row.getCell(14).value = null;
                            }
                            row.getCell(14).font = { size: 16 };

                            // Xử lý các cột từ 15 đến 20
                            for (let col = 15; col <= 20; col++) {
                                if (col >= 15 && col <= 18) {
                                    let colLetter = String.fromCharCode(64 + col);
                                    let formulaText = `SUM(${colLetter}${pos_dtl}:${colLetter}${lastRow - 1})`;
                                    // console.log(`Cột ${col}: Áp dụng công thức ${formulaText}`);
                                    try {
                                        row.getCell(col).value = { formula: formulaText };
                                        row.getCell(col).numFmt = '0;-0;;@';
                                    } catch (error) {
                                        console.error(`Error setting formula for column ${colLetter}:`, error);
                                        row.getCell(col).value = null;
                                    }
                                } else {
                                    row.getCell(col).value = dt_m3[i][`COL${col}`] || null;
                                }
                                row.getCell(col).font = { size: 16 };
                            }
                        }
                    } var pos_01 = 12;
                    for (var i = 0; i <= dt_m3.length - 1; i++) {
                        var row = currentWorksheet.getRow(pos_01 + i);
                        if ((i) % 2 != 0 && i < dt_m3.length - 1) {
                            for (let k = 1; k <= 20; k++) {
                                const cell = row.getCell(k);
                                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: 'FFDAB9' } };
                                cell.alignment = { vertical: 'middle', horizontal: 'center' };

                                // Thêm đường viền cho tất cả các dòng
                                if (k === 1) {
                                    cell.border = { ...cell.border, left: { style: 'medium', color: 'black' } };
                                }
                                if (k === 19) {
                                    cell.border = { ...cell.border, left: { style: 'medium', color: 'black' }, right: { style: 'medium', color: 'black' } };
                                }
                                if (k === 20) {
                                    cell.border = { ...cell.border, right: { style: 'medium', color: 'black' } };
                                }
                            }
                        } else {
                            if (i == dt_m3.length - 1) {
                                for (let k2 = 1; k2 <= 20; k2++) {
                                    const cell = row.getCell(k2);
                                    cell.border = {
                                        top: { style: 'medium', color: 'black' },
                                        left: { style: 'medium', color: 'black' },
                                        bottom: { style: 'medium', color: 'black' },
                                        right: { style: 'medium', color: 'black' }
                                    };
                                    cell.alignment = { vertical: 'middle', horizontal: 'center' };
                                    cell.font = { ...cell.font, bold: true };
                                }
                            } else {
                                for (let k3 = 1; k3 <= 20; k3++) {
                                    const cell = row.getCell(k3);
                                    cell.alignment = { vertical: 'middle', horizontal: 'center' };

                                    // Thêm đường viền cho tất cả các dòng
                                    if (k3 === 1) {
                                        cell.border = { ...cell.border, left: { style: 'medium', color: 'black' } };
                                    }
                                    if (k3 === 19) {
                                        cell.border = { ...cell.border, left: { style: 'medium', color: 'black' }, right: { style: 'medium', color: 'black' } };
                                    }
                                    if (k3 === 20) {
                                        cell.border = { ...cell.border, right: { style: 'medium', color: 'black' } };
                                    }
                                }
                            }
                        }
                    }
                    // Apply A4 print setup
                    setupExcelForA4Printing(currentWorksheet);

                    //end set up A4//

                });


                /********* Print file excel ********/
                const reportFile = Helpers.tmpPath(file_new);
                await workbook.xlsx.writeFile(reportFile);
                return response.attachment(reportFile, file_new)
            }
        }
        catch (e) {
            // console.log(e)
            return response.send(Utils.response(false, e.message, null))
        }
    }


    async rptswsoNK040_02_VL({ request, response, auth }) {
        try {
            /****************************** Get Param *********************************/

            let { para } = request.get(['para']);
            /********* Parse pram to json ********/
            var item = JSON.parse(para);
            const user = await auth.getUser();
            //var COMP_ID         = item.P_COMP_ID, COMP_NM = item.P_COMP_NM, COMP_TAX = item.P_COMP_TAX, COMP_ADD = item.P_COMP_ADD;
            const p_crt_by = user.USER_ID;
            const p_language = request.header("accept-language", "ENG");

            var file_nm = [item.P_FILE_NAME_NEW];
            var file_type = ".xlsx";
            var full_nm = file_nm + file_type;
            var file_new = file_nm + p_crt_by + file_type;
            //rpt_swso420__delivery
            var _resourcesPath = "report/sw/nk" + '/' + "rpt_swnk040_barcode_detail_v02_vl.xlsx";
            var _store = "SZ_SEL_SWNK040_EXPORT_MST2_NOCACHE";
            var _store2 = "SZ_SEL_SWNK040_EXPORT_H_NOCACHE";
            var _store3 = "SZ_SEL_SWNK040_EXPORT_NOCACHE";
            var _param = [item.p_company_pk, item.p_PartnerCD_NM, item.p_AccCD_NM, item.p_AccountType, item.p_month, item.p_factory_pk, item.p_month_to];

            /***************************** Return failded ****************************/
            if (!user) {
                return response.send(Utils.response(false, "Request failed!", null));
            }
            /****************************** Begin call store and write excell *********/
            else {
                /********* Call store  ***************/
                var dt_m = await DBService.callProcCursor(_store, _param, p_language, p_crt_by);
                var dt_m2 = await DBService.callProcCursor(_store2, _param, p_language, p_crt_by);
                var dt_m3 = await DBService.callProcCursor(_store3, _param, p_language, p_crt_by);

                /********* Read file excel ********/
                const templateFile = Helpers.resourcesPath(_resourcesPath);
                await workbook.xlsx.readFile(templateFile);
                var worksheet = workbook.getWorksheet(1);

                /********* Write file excel ********/
                //var row = worksheet.getRow(7);
                var pos = 13;
                var total_dtl_pos = dt_m3.length + 14;
                var total_dtl_pos_2 = dt_m3.length + 11;

                if (dt_m.length > 0) {
                    var row1 = worksheet.getRow(1);
                    row1.getCell(1).value = dt_m[0].TITLE_REPORT;

                    var row2 = worksheet.getRow(3);
                    row2.getCell(3).value = dt_m[0].FACTORY_NAME;

                    /*var row3 = worksheet.getRow(4);  
                    row3.getCell(3).value = dt_m[0].ORDER_NO;
                	
                    var row4 = worksheet.getRow(5);  
                    row4.getCell(3).value = dt_m[0].DPO;*/

                    var row5 = worksheet.getRow(6);
                    row5.getCell(3).value = dt_m[0].GENDER;


                    var row7 = worksheet.getRow(7);
                    row7.getCell(7).value = dt_m[0].STYLE_NAME;

                    var row8 = worksheet.getRow(8);
                    row8.getCell(1).value = dt_m[0].STYLE_COLOR;
                    row8.getCell(7).value = dt_m[0].ENGLISH_COLOR;

                    //var row9 = worksheet.getRow(9);
                    //row9.getCell(7).value = dt_m[0].IMPLEMENTATION_STANDARDS;

                    var row10 = worksheet.getRow(10);
                    row10.getCell(7).value = dt_m[0].RETAIL_PRICE;

                    worksheet.mergeCells(total_dtl_pos_2, 1, total_dtl_pos_2, 4);
                    //worksheet.mergeCells(total_dtl_pos,7,total_dtl_pos,10);
                    //var rowDeli_date = worksheet.getRow(total_dtl_pos);

                    //rowDeli_date.height = 38.3; 
                    //rowDeli_date.getCell(7).font  = { italic: false, bold: true, color: {argb:'000000'}, size:30, name: 'Calibri'};

                    //rowDeli_date.getCell(7).value = dt_m[0].OGAC_DATE;


                }

                /* if (dt_m3.length > 1) {
                     worksheet.duplicateRow(pos, dt_m3.length-4, true);
                 }*/
                var pos_01 = 12;
                for (var i = 0; i < dt_m3.length; i++) {
                    var row = worksheet.getRow(pos_01 + i);
                    var row2 = worksheet.getRow(pos_01 + i);
                    if ((i) % 2 != 0 && i < dt_m3.length - 1) {

                        console.log("a " + i % 2);
                        for (let k = 1; k <= 20; k++) {
                            row.getCell(k).fill = { type: "pattern", pattern: "solid", fgColor: { argb: 'FFDAB9' } };
                            row.getCell(k).alignment = { vertical: 'middle', horizontal: 'center' };
                            if (i > 0 && i < dt_m3.length - 1) {
                                row.getCell(1).border = { left: { style: 'medium', color: 'black' } };
                                row.getCell(19).border = { left: { style: 'medium', color: 'black' }, right: { style: 'medium', color: 'black' } };
                                row.getCell(20).border = { right: { style: 'medium', color: 'black' } };
                            }

                            /*if(k>2)
                            {
                                var _formatAmt = ('VND'=='VND'?'_(* #,##0_);_(* (#,##0);_(* "-"_);_(@_)':'_(* #,##0.00_);_(* (#,##0.00);_(* "-"_);_(@_)');
                            	
                                row.getCell(k).numFmt  = _formatAmt;
                            }*/

                        }


                        //row.getCell(19).border = {left: {style:'medium', color: {argb:'A6A6A6'}},right: {style:'medium', color: {argb:'A6A6A6'}}}; 
                        //row.getCell(20).border = {right: {style:'medium', color: {argb:'A6A6A6'}}}; 

                    }
                    else {

                        if (i == dt_m3.length - 1) {
                            console.log("b " + i % 2);
                            for (let k2 = 1; k2 <= 20; k2++) {
                                row2.getCell(k2).border = {
                                    top: { style: 'medium', color: 'black' },
                                    left: { style: 'medium', color: 'black' },
                                    bottom: { style: 'medium', color: 'black' },
                                    right: { style: 'medium', color: 'black' }
                                };
                                row2.getCell(k2).alignment = { vertical: 'middle', horizontal: 'center' };
                                row2.getCell(k2).font.bold = true;
                            }


                        }
                        else {
                            for (let k3 = 1; k3 <= 20; k3++) {
                                row.getCell(k3).alignment = { vertical: 'middle', horizontal: 'center' };

                                //row.getCell(19).border = {left: {style:'solid', color: {argb:'A6A6A6'}},right: {style:'medium', color: {argb:'A6A6A6'}}};
                                if (i > 0 && i < dt_m3.length - 1) {
                                    row.getCell(1).border = { left: { style: 'medium', color: 'black' } };
                                    row.getCell(19).border = { left: { style: 'medium', color: 'black' }, right: { style: 'medium', color: 'black' } };
                                    row.getCell(20).border = { right: { style: 'medium', color: 'black' } };
                                }
                            }

                        }
                        //row.getCell(2).font = {  color: { argb: '000000'} };

                    }
                }
                //worksheet.mergeCells(7, 2, 9, 2);
                //worksheet.mergeCells(pos-1, 8, pos-1, 10);


                var pos_dtl = 11;
                for (var i = 0; i < dt_m2.length; i++) {
                    var row = worksheet.getRow(pos_dtl + i);
                    if (i > 0 && i < dt_m2.length) {
                        row.getCell(1).value = i - 1;
                        worksheet.mergeCells(pos_dtl + i, 2, pos_dtl + i, 3);
                    }
                    row.getCell(2).value = dt_m2[i].BARCODE;
                    row.getCell(4).value = dt_m2[i].SIZE_CODE;
                    row.getCell(5).value = dt_m2[i].ATT01;
                    row.getCell(6).value = dt_m2[i].ATT02;
                    row.getCell(7).value = dt_m2[i].ATT03;
                    row.getCell(8).value = dt_m2[i].ATT04;
                    row.getCell(9).value = dt_m2[i].ATT05;
                    row.getCell(10).value = dt_m2[i].ATT06;
                    row.getCell(11).value = dt_m2[i].ATT07;
                    row.getCell(12).value = dt_m2[i].ATT08;
                    row.getCell(13).value = dt_m2[i].ATT09;
                    row.getCell(14).value = dt_m2[i].TOTAL;
                    row.getCell(15).value = dt_m2[i].G_TOTAL;
                    row.getCell(16).value = dt_m2[i].LOSS;
                    row.getCell(17).value = dt_m2[i].EXTRA;
                    row.getCell(18).value = dt_m2[i].PRINTED_NO;
                    row.getCell(19).value = dt_m2[i].REMAIN;
                    row.getCell(20).value = dt_m2[i].PRINTED_TIME;
                }
                //---------------------------------------------------------------------------------------				
                var pos_dtl = 12;
                for (var i = 0; i < dt_m3.length; i++) {
                    var row = worksheet.getRow(pos_dtl + i);
                    /*if(i >1)
                    {
                        if(dt_m3[i-1].CUST_NAME_ENG==dt_m3[i].CUST_NAME_ENG)
                        {
                            worksheet.mergeCells(pos-1, 2, pos, 2);
                        }
                        //worksheet.mergeCells(pos+i, 8, pos+i, 10);
                    }*/
                    if (i < dt_m3.length - 1) {
                        row.getCell(1).value = i + 1;
                        worksheet.mergeCells(pos_dtl + i, 2, pos_dtl + i, 3);
                        row.getCell(2).alignment = { vertical: 'middle', horizontal: 'center' };

                    }
                    row.getCell(2).value = dt_m3[i].BARCODE;
                    row.getCell(4).value = dt_m3[i].SIZE_CODE;
                    row.getCell(5).value = dt_m3[i].ATT01;
                    row.getCell(6).value = dt_m3[i].ATT02;
                    row.getCell(7).value = dt_m3[i].ATT03;
                    row.getCell(8).value = dt_m3[i].ATT04;
                    row.getCell(9).value = dt_m3[i].ATT05;
                    row.getCell(10).value = dt_m3[i].ATT06;
                    row.getCell(11).value = dt_m3[i].ATT07;
                    row.getCell(12).value = dt_m3[i].ATT08;
                    row.getCell(13).value = dt_m3[i].ATT09;

                    /*row.getCell(13).value = dt_m3[i].ATT10;
                    row.getCell(14).value = dt_m3[i].ATT11;
                    row.getCell(15).value = dt_m3[i].ATT12;
                    row.getCell(16).value = dt_m3[i].ATT13;
                    row.getCell(17).value = dt_m3[i].ATT14;
                    row.getCell(18).value  =dt_m3[i].ATT15;
                    row.getCell(19).value =dt_m3[i].ATT16;
                    row.getCell(20).value =dt_m3[i].ATT17;
                    row.getCell(21).value =dt_m3[i].ATT18;
                	
                    row.getCell(22).value = dt_m3[i].ATT19;
                    row.getCell(23).value = dt_m3[i].ATT20;
                    row.getCell(24).value = dt_m3[i].ATT21;
                    row.getCell(25).value = dt_m3[i].ATT22;
                    row.getCell(26).value = dt_m3[i].ATT23;
                    row.getCell(27).value  =dt_m3[i].ATT24;
                    row.getCell(28).value =dt_m3[i].ATT25;
                    row.getCell(29).value =dt_m3[i].ATT26;
                    row.getCell(30).value =dt_m3[i].ATT27;
                	
                    row.getCell(31).value = dt_m3[i].ATT28;
                    row.getCell(32).value = dt_m3[i].ATT29;
                    row.getCell(33).value = dt_m3[i].ATT30;*/

                    row.getCell(14).value = dt_m3[i].TOTAL;
                    row.getCell(15).value = dt_m3[i].G_TOTAL;
                    row.getCell(16).value = dt_m3[i].LOSS;
                    row.getCell(17).value = dt_m3[i].EXTRA;
                    row.getCell(18).value = dt_m3[i].PRINTED_NO;
                    row.getCell(19).value = dt_m3[i].REMAIN;
                    row.getCell(20).value = dt_m3[i].PRINTED_TIME;

                }
                /********* Print file excel ********/
                const reportFile = Helpers.tmpPath(file_new);
                await workbook.xlsx.writeFile(reportFile);
                return response.attachment(reportFile, file_new)

            }
        }
        catch (e) {
            // Utils.Logger({ LVL: "error", MODULE: "Report", FUNC: "Picking_list", CONTENT: e.message }) 
            //return response.send(null);
            console.log(e)
            return response.send(Utils.response(false, e.message, null))
        }
    }
    //=============END===DETAIL====BARCODE===NOT==QR==JUDAL==VL==========
    //----------------------end-----china----anta-----------------------------------



    //===========report---detail---barcode--judal---QR---english----------
    async rptswsoNK080({ request, response, auth }) {
        try {
            /****************************** Get Param *********************************/

            let { para } = request.get(['para']);
            /********* Parse pram to json ********/
            var item = JSON.parse(para);
            const user = await auth.getUser();
            //var COMP_ID         = item.P_COMP_ID, COMP_NM = item.P_COMP_NM, COMP_TAX = item.P_COMP_TAX, COMP_ADD = item.P_COMP_ADD;
            const p_crt_by = user.USER_ID;
            const p_language = request.header("accept-language", "ENG");

            var file_nm = [item.P_FILE_NAME_NEW];
            var file_type = ".xlsx";
            var full_nm = file_nm + file_type;
            var file_new = file_nm + p_crt_by + file_type;
            //rpt_swso420__delivery
            var _resourcesPath = "report/sw/nk" + '/' + "rpt_swnk080_barcode_detail_v01.xlsx";
            var _store = "SZ_SEL_SWNK080_EXPORT_MST_NOCACHE";
            var _store2 = "SZ_SEL_SWNK080_EXPORT_H_NOCACHE";
            var _store3 = "SZ_SEL_SWNK080_EXPORT_NOCACHE";
            var _param = [item.p_company_pk, item.p_PartnerCD_NM, item.p_AccCD_NM, item.p_AccountType, item.p_month, item.p_factory_pk, item.p_month_to];

            /***************************** Return failded ****************************/
            if (!user) {
                return response.send(Utils.response(false, "Request failed!", null));
            }
            /****************************** Begin call store and write excell *********/
            else {
                /********* Call store  ***************/
                var dt_m = await DBService.callProcCursor(_store, _param, p_language, p_crt_by);
                var dt_m2 = await DBService.callProcCursor(_store2, _param, p_language, p_crt_by);
                var dt_m3 = await DBService.callProcCursor(_store3, _param, p_language, p_crt_by);

                /********* Read file excel ********/
                const templateFile = Helpers.resourcesPath(_resourcesPath);
                await workbook.xlsx.readFile(templateFile);
                var worksheet = workbook.getWorksheet(1);

                /********* Write file excel ********/
                //var row = worksheet.getRow(7);
                var pos = 13;
                var total_dtl_pos = dt_m3.length + 14;
                var total_dtl_pos_2 = dt_m3.length + 11;

                if (dt_m.length > 0) {
                    var row1 = worksheet.getRow(1);
                    row1.getCell(1).value = dt_m[0].TITLE_NAME;

                    var row2 = worksheet.getRow(3);
                    row2.getCell(3).value = dt_m[0].FACTORY;

                    var row3 = worksheet.getRow(4);
                    row3.getCell(3).value = dt_m[0].ORDER_NO;

                    var row4 = worksheet.getRow(5);
                    row4.getCell(3).value = dt_m[0].DPO;

                    var row5 = worksheet.getRow(6);
                    row5.getCell(3).value = dt_m[0].GENDER;


                    var row7 = worksheet.getRow(7);
                    row7.getCell(7).value = dt_m[0].ITEM_NAME;

                    var row8 = worksheet.getRow(8);
                    row8.getCell(1).value = dt_m[0].PO_NO;
                    row8.getCell(7).value = dt_m[0].COLOR;
                    //row8.getCell(7).value = dt_m[0].OUTSOLE;

                    var row9 = worksheet.getRow(9);
                    //row9.getCell(7).value = dt_m[0].COLOR;

                    var row10 = worksheet.getRow(10);
                    row10.getCell(7).value = dt_m[0].RETAIL_PRICE;


                    worksheet.mergeCells(total_dtl_pos, 7, total_dtl_pos, 10);
                    var rowDeli_date = worksheet.getRow(total_dtl_pos);

                    rowDeli_date.height = 62.3;
                    rowDeli_date.getCell(7).alignment = { vertical: 'middle', horizontal: 'center' };
                    rowDeli_date.getCell(7).font = { italic: false, bold: true, color: { argb: '000000' }, size: 48, name: 'Calibri' };

                    rowDeli_date.getCell(7).value = dt_m[0].OGAC_DATE;

                    worksheet.mergeCells(total_dtl_pos_2, 1, total_dtl_pos_2, 4);

                }

                /* if (dt_m3.length > 1) {
                     worksheet.duplicateRow(pos, dt_m3.length-4, true);
                 }*/
                var pos_01 = 12;
                for (var i = 0; i < dt_m3.length; i++) {
                    var row = worksheet.getRow(pos_01 + i);
                    var row2 = worksheet.getRow(pos_01 + i);
                    if ((i) % 2 == 0 && i < dt_m3.length - 1) {

                        console.log("a " + i % 2);
                        for (let k = 1; k <= 20; k++) {
                            row.getCell(k).fill = { type: "pattern", pattern: "solid", fgColor: { argb: 'FFDAB9' } };
                            row.getCell(k).alignment = { vertical: 'middle', horizontal: 'center' };
                            if (i > 0 && i < dt_m3.length - 1) {
                                row.getCell(1).border = { left: { style: 'medium', color: 'black' } };
                                row.getCell(19).border = { left: { style: 'medium', color: 'black' }, right: { style: 'medium', color: 'black' } };
                                row.getCell(20).border = { right: { style: 'medium', color: 'black' } };
                            }

                            /*if(k>2)
                            {
                                var _formatAmt = ('VND'=='VND'?'_(* #,##0_);_(* (#,##0);_(* "-"_);_(@_)':'_(* #,##0.00_);_(* (#,##0.00);_(* "-"_);_(@_)');
                            	
                                row.getCell(k).numFmt  = _formatAmt;
                            }*/

                        }


                        //row.getCell(19).border = {left: {style:'medium', color: {argb:'A6A6A6'}},right: {style:'medium', color: {argb:'A6A6A6'}}}; 
                        //row.getCell(20).border = {right: {style:'medium', color: {argb:'A6A6A6'}}}; 

                    }
                    else {

                        if (i == dt_m3.length - 1) {
                            console.log("b " + i % 2);
                            for (let k2 = 1; k2 <= 20; k2++) {
                                row2.getCell(k2).border = {
                                    top: { style: 'medium', color: 'black' },
                                    left: { style: 'medium', color: 'black' },
                                    bottom: { style: 'medium', color: 'black' },
                                    right: { style: 'medium', color: 'black' }
                                };
                                row2.getCell(k2).alignment = { vertical: 'middle', horizontal: 'center' };
                                row2.getCell(k2).font.bold = true;
                            }


                        }
                        else {
                            for (let k3 = 1; k3 <= 20; k3++) {
                                row.getCell(k3).alignment = { vertical: 'middle', horizontal: 'center' };

                                //row.getCell(19).border = {left: {style:'solid', color: {argb:'A6A6A6'}},right: {style:'medium', color: {argb:'A6A6A6'}}};
                                if (i > 1 && i < dt_m3.length - 1) {
                                    row.getCell(1).border = { left: { style: 'medium', color: 'black' } };
                                    row.getCell(19).border = { left: { style: 'medium', color: 'black' }, right: { style: 'medium', color: 'black' } };
                                    row.getCell(20).border = { right: { style: 'medium', color: 'black' } };
                                }
                            }

                        }
                        //row.getCell(2).font = {  color: { argb: '000000'} };

                    }
                }
                //worksheet.mergeCells(7, 2, 9, 2);
                //worksheet.mergeCells(pos-1, 8, pos-1, 10);


                var pos_dtl = 11;
                for (var i = 0; i < dt_m2.length; i++) {

                    var row = worksheet.getRow(pos_dtl + i);

                    if (i > 1 && i < dt_m2.length) {
                        row.getCell(1).value = i - 1;
                        worksheet.mergeCells(pos_dtl + i, 2, pos_dtl + i, 3);

                    }
                    row.getCell(2).value = dt_m2[i].BARCODE;
                    row.getCell(4).value = dt_m2[i].SIZE_CODE;
                    row.getCell(5).value = dt_m2[i].ATT01;
                    row.getCell(6).value = dt_m2[i].ATT02;
                    row.getCell(7).value = dt_m2[i].ATT03;
                    row.getCell(8).value = dt_m2[i].ATT04;
                    row.getCell(9).value = dt_m2[i].ATT05;
                    row.getCell(10).value = dt_m2[i].ATT06;
                    row.getCell(11).value = dt_m2[i].ATT07;
                    row.getCell(12).value = dt_m2[i].ATT08;
                    row.getCell(13).value = dt_m2[i].ATT09;

                    row.getCell(14).value = dt_m2[i].TOTAL;
                    row.getCell(15).value = dt_m2[i].G_TOTAL;
                    row.getCell(16).value = dt_m2[i].LOSS;
                    row.getCell(17).value = dt_m2[i].EXTRA;
                    row.getCell(18).value = dt_m2[i].PRINTED_NO;
                    row.getCell(19).value = dt_m2[i].REMAIN;
                    row.getCell(20).value = dt_m2[i].PRINTED_TIME;

                }
                //---------------------------------------------------------------------------------------				
                var pos_dtl = 12;
                for (var i = 0; i < dt_m3.length; i++) {

                    var row = worksheet.getRow(pos_dtl + i);

                    /*if(i >1)
                    {
                        if(dt_m3[i-1].CUST_NAME_ENG==dt_m3[i].CUST_NAME_ENG)
                        {
                            worksheet.mergeCells(pos-1, 2, pos, 2);
                        }
                        //worksheet.mergeCells(pos+i, 8, pos+i, 10);
                    }*/
                    if (i < dt_m3.length - 1) {
                        row.getCell(1).value = i + 1;
                        worksheet.mergeCells(pos_dtl + i, 2, pos_dtl + i, 3);
                        row.getCell(2).alignment = { vertical: 'middle', horizontal: 'center' };

                    }
                    row.getCell(2).value = dt_m3[i].BARCODE;
                    row.getCell(4).value = dt_m3[i].SIZE_CODE;
                    row.getCell(5).value = dt_m3[i].ATT01;
                    row.getCell(6).value = dt_m3[i].ATT02;
                    row.getCell(7).value = dt_m3[i].ATT03;
                    row.getCell(8).value = dt_m3[i].ATT04;
                    row.getCell(9).value = dt_m3[i].ATT05;
                    row.getCell(10).value = dt_m3[i].ATT06;
                    row.getCell(11).value = dt_m3[i].ATT07;
                    row.getCell(12).value = dt_m3[i].ATT08;
                    row.getCell(13).value = dt_m3[i].ATT09;

                    /*row.getCell(13).value = dt_m3[i].ATT10;
                    row.getCell(14).value = dt_m3[i].ATT11;
                    row.getCell(15).value = dt_m3[i].ATT12;
                    row.getCell(16).value = dt_m3[i].ATT13;
                    row.getCell(17).value = dt_m3[i].ATT14;
                    row.getCell(18).value  =dt_m3[i].ATT15;
                    row.getCell(19).value =dt_m3[i].ATT16;
                    row.getCell(20).value =dt_m3[i].ATT17;
                    row.getCell(21).value =dt_m3[i].ATT18;
                	
                    row.getCell(22).value = dt_m3[i].ATT19;
                    row.getCell(23).value = dt_m3[i].ATT20;
                    row.getCell(24).value = dt_m3[i].ATT21;
                    row.getCell(25).value = dt_m3[i].ATT22;
                    row.getCell(26).value = dt_m3[i].ATT23;
                    row.getCell(27).value  =dt_m3[i].ATT24;
                    row.getCell(28).value =dt_m3[i].ATT25;
                    row.getCell(29).value =dt_m3[i].ATT26;
                    row.getCell(30).value =dt_m3[i].ATT27;
                	
                    row.getCell(31).value = dt_m3[i].ATT28;
                    row.getCell(32).value = dt_m3[i].ATT29;
                    row.getCell(33).value = dt_m3[i].ATT30;*/

                    row.getCell(14).value = dt_m3[i].TOTAL;
                    row.getCell(15).value = dt_m3[i].G_TOTAL;
                    row.getCell(16).value = dt_m3[i].LOSS;
                    row.getCell(17).value = dt_m3[i].EXTRA;
                    row.getCell(18).value = dt_m3[i].PRINTED_NO;
                    row.getCell(19).value = dt_m3[i].REMAIN;
                    row.getCell(20).value = dt_m3[i].PRINTED_TIME;

                }
                /********* Print file excel ********/
                const reportFile = Helpers.tmpPath(file_new);
                await workbook.xlsx.writeFile(reportFile);
                return response.attachment(reportFile, file_new)

            }
        }
        catch (e) {
            // Utils.Logger({ LVL: "error", MODULE: "Report", FUNC: "Picking_list", CONTENT: e.message }) 
            //return response.send(null);
            console.log(e)
            return response.send(Utils.response(false, e.message, null))
        }
    }
    //----------------------end-----china----anta----QR-------------------------------

    //---------------REPORT---SALE--ORDER--FORTRA-----------------------------
    async rptswsoNK090({ request, response, auth }) {
        try {
            /****************************** Get Param *********************************/

            let { para } = request.get(['para']);
            /********* Parse pram to json ********/
            var item = JSON.parse(para);
            const user = await auth.getUser();
            //var COMP_ID         = item.P_COMP_ID, COMP_NM = item.P_COMP_NM, COMP_TAX = item.P_COMP_TAX, COMP_ADD = item.P_COMP_ADD;
            const p_crt_by = user.USER_ID;
            const p_language = request.header("accept-language", "ENG");

            var file_nm = [item.P_FILE_NAME_NEW];
            var file_type = ".xlsx";
            var full_nm = file_nm + file_type;
            var file_new = file_nm + p_crt_by + file_type;
            //rpt_swso420__delivery
            var _resourcesPath = "report/sw/nk" + '/' + "rpt_swnk080_barcode_detail_v01.xlsx";
            var _store = "SZ_SEL_SWNK090_EXPORT_MST_NOCACHE";
            var _store2 = "SZ_SEL_SWNK090_EXPORT_H_NOCACHE";
            var _store3 = "SZ_SEL_SWNK090_EXPORT_NOCACHE";
            var _param = [item.p_company_pk, item.p_PartnerCD_NM, item.p_AccCD_NM, item.p_AccountType, item.p_month, item.p_factory_pk, item.p_month_to];

            /***************************** Return failded ****************************/
            if (!user) {
                return response.send(Utils.response(false, "Request failed!", null));
            }
            /****************************** Begin call store and write excell *********/
            else {
                /********* Call store  ***************/
                var dt_m = await DBService.callProcCursor(_store, _param, p_language, p_crt_by);
                var dt_m2 = await DBService.callProcCursor(_store2, _param, p_language, p_crt_by);
                var dt_m3 = await DBService.callProcCursor(_store3, _param, p_language, p_crt_by);

                /********* Read file excel ********/
                const templateFile = Helpers.resourcesPath(_resourcesPath);
                await workbook.xlsx.readFile(templateFile);
                var worksheet = workbook.getWorksheet(1);

                /********* Write file excel ********/
                //var row = worksheet.getRow(7);
                var pos = 13;
                var total_dtl_pos = dt_m3.length + 14;
                var total_dtl_pos_2 = dt_m3.length + 11;

                if (dt_m.length > 0) {
                    var row1 = worksheet.getRow(1);
                    row1.getCell(1).value = dt_m[0].TITLE_NAME;

                    var row2 = worksheet.getRow(3);
                    row2.getCell(3).value = dt_m[0].FACTORY;

                    var row3 = worksheet.getRow(4);
                    row3.getCell(3).value = dt_m[0].ORDER_NO;


                    var row4 = worksheet.getRow(5);
                    row4.getCell(3).value = dt_m[0].DPO;

                    var row5 = worksheet.getRow(6);
                    row5.getCell(3).value = dt_m[0].GENDER;


                    var row7 = worksheet.getRow(7);
                    row7.getCell(7).value = dt_m[0].ITEM_NAME;

                    var row8 = worksheet.getRow(8);
                    row8.getCell(1).value = dt_m[0].PO_NO;
                    row8.getCell(7).value = dt_m[0].COLOR;
                    //row8.getCell(7).value = dt_m[0].OUTSOLE;

                    var row9 = worksheet.getRow(9);
                    //row9.getCell(7).value = dt_m[0].COLOR;

                    var row10 = worksheet.getRow(10);
                    row10.getCell(7).value = dt_m[0].RETAIL_PRICE;


                    worksheet.mergeCells(total_dtl_pos, 7, total_dtl_pos, 10);
                    var rowDeli_date = worksheet.getRow(total_dtl_pos);

                    rowDeli_date.height = 62.3;
                    rowDeli_date.getCell(7).alignment = { vertical: 'middle', horizontal: 'center' };
                    rowDeli_date.getCell(7).font = { italic: false, bold: true, color: { argb: '000000' }, size: 48, name: 'Calibri' };

                    rowDeli_date.getCell(7).value = dt_m[0].OGAC_DATE;

                    worksheet.mergeCells(total_dtl_pos_2, 1, total_dtl_pos_2, 4);

                }

                /* if (dt_m3.length > 1) {
                     worksheet.duplicateRow(pos, dt_m3.length-4, true);
                 }*/
                var pos_01 = 12;
                for (var i = 0; i < dt_m3.length; i++) {
                    var row = worksheet.getRow(pos_01 + i);
                    var row2 = worksheet.getRow(pos_01 + i);
                    if ((i) % 2 == 0 && i < dt_m3.length - 1) {

                        console.log("a " + i % 2);
                        for (let k = 1; k <= 20; k++) {
                            row.getCell(k).fill = { type: "pattern", pattern: "solid", fgColor: { argb: 'FFDAB9' } };
                            row.getCell(k).alignment = { vertical: 'middle', horizontal: 'center' };
                            if (i > 0 && i < dt_m3.length - 1) {
                                row.getCell(1).border = { left: { style: 'medium', color: 'black' } };
                                row.getCell(19).border = { left: { style: 'medium', color: 'black' }, right: { style: 'medium', color: 'black' } };
                                row.getCell(20).border = { right: { style: 'medium', color: 'black' } };
                            }

                            /*if(k>2)
                            {
                                var _formatAmt = ('VND'=='VND'?'_(* #,##0_);_(* (#,##0);_(* "-"_);_(@_)':'_(* #,##0.00_);_(* (#,##0.00);_(* "-"_);_(@_)');
                            	
                                row.getCell(k).numFmt  = _formatAmt;
                            }*/

                        }


                        //row.getCell(19).border = {left: {style:'medium', color: {argb:'A6A6A6'}},right: {style:'medium', color: {argb:'A6A6A6'}}}; 
                        //row.getCell(20).border = {right: {style:'medium', color: {argb:'A6A6A6'}}}; 

                    }
                    else {

                        if (i == dt_m3.length - 1) {
                            console.log("b " + i % 2);
                            for (let k2 = 1; k2 <= 20; k2++) {
                                row2.getCell(k2).border = {
                                    top: { style: 'medium', color: 'black' },
                                    left: { style: 'medium', color: 'black' },
                                    bottom: { style: 'medium', color: 'black' },
                                    right: { style: 'medium', color: 'black' }
                                };
                                row2.getCell(k2).alignment = { vertical: 'middle', horizontal: 'center' };
                                row2.getCell(k2).font.bold = true;
                            }


                        }
                        else {
                            for (let k3 = 1; k3 <= 20; k3++) {
                                row.getCell(k3).alignment = { vertical: 'middle', horizontal: 'center' };

                                //row.getCell(19).border = {left: {style:'solid', color: {argb:'A6A6A6'}},right: {style:'medium', color: {argb:'A6A6A6'}}};
                                if (i > 1 && i < dt_m3.length - 1) {
                                    row.getCell(1).border = { left: { style: 'medium', color: 'black' } };
                                    row.getCell(19).border = { left: { style: 'medium', color: 'black' }, right: { style: 'medium', color: 'black' } };
                                    row.getCell(20).border = { right: { style: 'medium', color: 'black' } };
                                }
                            }

                        }
                        //row.getCell(2).font = {  color: { argb: '000000'} };

                    }
                }
                //worksheet.mergeCells(7, 2, 9, 2);
                //worksheet.mergeCells(pos-1, 8, pos-1, 10);


                var pos_dtl = 11;
                for (var i = 0; i < dt_m2.length; i++) {

                    var row = worksheet.getRow(pos_dtl + i);

                    if (i > 1 && i < dt_m2.length) {
                        row.getCell(1).value = i - 1;
                        worksheet.mergeCells(pos_dtl + i, 2, pos_dtl + i, 3);

                    }
                    row.getCell(2).value = dt_m2[i].BARCODE;
                    row.getCell(4).value = dt_m2[i].SIZE_CODE;
                    row.getCell(5).value = dt_m2[i].ATT01;
                    row.getCell(6).value = dt_m2[i].ATT02;
                    row.getCell(7).value = dt_m2[i].ATT03;
                    row.getCell(8).value = dt_m2[i].ATT04;
                    row.getCell(9).value = dt_m2[i].ATT05;
                    row.getCell(10).value = dt_m2[i].ATT06;
                    row.getCell(11).value = dt_m2[i].ATT07;
                    row.getCell(12).value = dt_m2[i].ATT08;
                    row.getCell(13).value = dt_m2[i].ATT09;

                    row.getCell(14).value = dt_m2[i].TOTAL;
                    row.getCell(15).value = dt_m2[i].G_TOTAL;
                    row.getCell(16).value = dt_m2[i].LOSS;
                    row.getCell(17).value = dt_m2[i].EXTRA;
                    row.getCell(18).value = dt_m2[i].PRINTED_NO;
                    row.getCell(19).value = dt_m2[i].REMAIN;
                    row.getCell(20).value = dt_m2[i].PRINTED_TIME;

                }
                //---------------------------------------------------------------------------------------				
                var pos_dtl = 12;
                for (var i = 0; i < dt_m3.length; i++) {

                    var row = worksheet.getRow(pos_dtl + i);

                    /*if(i >1)
                    {
                        if(dt_m3[i-1].CUST_NAME_ENG==dt_m3[i].CUST_NAME_ENG)
                        {
                            worksheet.mergeCells(pos-1, 2, pos, 2);
                        }
                        //worksheet.mergeCells(pos+i, 8, pos+i, 10);
                    }*/
                    if (i < dt_m3.length - 1) {
                        row.getCell(1).value = i + 1;
                        worksheet.mergeCells(pos_dtl + i, 2, pos_dtl + i, 3);
                        row.getCell(2).alignment = { vertical: 'middle', horizontal: 'center' };

                    }
                    row.getCell(2).value = dt_m3[i].BARCODE;
                    row.getCell(4).value = dt_m3[i].SIZE_CODE;
                    row.getCell(5).value = dt_m3[i].ATT01;
                    row.getCell(6).value = dt_m3[i].ATT02;
                    row.getCell(7).value = dt_m3[i].ATT03;
                    row.getCell(8).value = dt_m3[i].ATT04;
                    row.getCell(9).value = dt_m3[i].ATT05;
                    row.getCell(10).value = dt_m3[i].ATT06;
                    row.getCell(11).value = dt_m3[i].ATT07;
                    row.getCell(12).value = dt_m3[i].ATT08;
                    row.getCell(13).value = dt_m3[i].ATT09;

                    /*row.getCell(13).value = dt_m3[i].ATT10;
                    row.getCell(14).value = dt_m3[i].ATT11;
                    row.getCell(15).value = dt_m3[i].ATT12;
                    row.getCell(16).value = dt_m3[i].ATT13;
                    row.getCell(17).value = dt_m3[i].ATT14;
                    row.getCell(18).value  =dt_m3[i].ATT15;
                    row.getCell(19).value =dt_m3[i].ATT16;
                    row.getCell(20).value =dt_m3[i].ATT17;
                    row.getCell(21).value =dt_m3[i].ATT18;
                	
                    row.getCell(22).value = dt_m3[i].ATT19;
                    row.getCell(23).value = dt_m3[i].ATT20;
                    row.getCell(24).value = dt_m3[i].ATT21;
                    row.getCell(25).value = dt_m3[i].ATT22;
                    row.getCell(26).value = dt_m3[i].ATT23;
                    row.getCell(27).value  =dt_m3[i].ATT24;
                    row.getCell(28).value =dt_m3[i].ATT25;
                    row.getCell(29).value =dt_m3[i].ATT26;
                    row.getCell(30).value =dt_m3[i].ATT27;
                	
                    row.getCell(31).value = dt_m3[i].ATT28;
                    row.getCell(32).value = dt_m3[i].ATT29;
                    row.getCell(33).value = dt_m3[i].ATT30;*/

                    row.getCell(14).value = dt_m3[i].TOTAL;
                    row.getCell(15).value = dt_m3[i].G_TOTAL;
                    row.getCell(16).value = dt_m3[i].LOSS;
                    row.getCell(17).value = dt_m3[i].EXTRA;
                    row.getCell(18).value = dt_m3[i].PRINTED_NO;
                    row.getCell(19).value = dt_m3[i].REMAIN;
                    row.getCell(20).value = dt_m3[i].PRINTED_TIME;

                }
                /********* Print file excel ********/
                const reportFile = Helpers.tmpPath(file_new);
                await workbook.xlsx.writeFile(reportFile);
                return response.attachment(reportFile, file_new)

            }
        }
        catch (e) {
            // Utils.Logger({ LVL: "error", MODULE: "Report", FUNC: "Picking_list", CONTENT: e.message }) 
            //return response.send(null);
            console.log(e)
            return response.send(Utils.response(false, e.message, null))
        }
    }

    //------------------END---REPORT---SALE--ORDER--FORTRA-----------------------------
    ////=============BEGIN===DETAIL====BARCODE===NOT==QR==JUDAL==VL==========
    //================OMFLX001 order report==============================//
    async rptswsofx010({ request, response, auth }) {
        console.log('Entering rptswsofx010');
        try {
            /****************************** Get Param *********************************/
            let { para } = request.get(['para']);
            /********* Parse param to json ********/
            var item = JSON.parse(para);
            const user = await auth.getUser();
            const p_crt_by = user.USER_ID;
            const p_language = request.header("accept-language", "ENG");

            var file_nm = [item.P_FILE_NAME_NEW];
            var file_type = ".xlsx";
            var full_nm = file_nm + file_type;
            var file_new = file_nm + p_crt_by + file_type;
            var _resourcesPath = "report/sw/nk" + '/' + "rpt_swnk030_barcode_detail_v01.xlsx";
            var _store = "SW_RPT_SWFX010_MST_ORDER";
            var _store2 = "SW_RPT_SWFX010_DTL_ORDER";
            var _param = [item.p_company_pk, item.p_AccCD_NM, item.p_month, item.p_month_to, item.p_factory_pk, item.p_item];
            console.log(_store, _store2)

            /***************************** Return failed ****************************/
            if (!user) {
                return response.send(Utils.response(false, "Request failed!", null));
            }
            /****************************** Begin call store and write excel *********/
            else {
                /********* Call store  ***************/
                var dt_m = await DBService.callProcCursor(_store, _param, p_language, p_crt_by);
                var dt_m2 = await DBService.callProcCursor(_store2, _param, p_language, p_crt_by);

                console.log('dt_m data:', JSON.stringify(dt_m, null, 2));
                console.log('dt_m2 data:', JSON.stringify(dt_m2, null, 2));

                /********* Read file excel ********/
                const workbook = new ExcelJS.Workbook();
                const templateFile = Helpers.resourcesPath(_resourcesPath);
                await workbook.xlsx.readFile(templateFile);
                var worksheet = workbook.getWorksheet(1);
                console.log('Excel template loaded successfully');

                // New function to create template
                function createTemplate(worksheet, po_data, sizeDataForLot, index, startRow, startCol) {
                    console.log(`Starting to create template for PO_ITEM: ${po_data.PO_ITEM}, at row: ${startRow}, col: ${startCol}`);
                    setCellStyles(worksheet, startRow, startCol);
                    setColumnWidths(worksheet);
                    setRowHeights(worksheet, startRow);
                    mergeCells(worksheet, startRow, startCol);
                    setBorders(worksheet, startRow, startCol);
                    setCellFill(worksheet, startRow, startCol);
                    fillSizeAndQuantityData(worksheet, sizeDataForLot, po_data, startRow, startCol);
                    fillMasterPONo(worksheet, po_data, sizeDataForLot, startRow, startCol);
                    addLogoImage(workbook, worksheet, startRow, startCol)
                    console.log(`Template creation completed for PO_ITEM: ${po_data.PO_ITEM}`);
                }


                function addLogoImage(workbook, worksheet, startRow, startCol) {
                    const logoPath = path.resolve(__dirname, '..', '..', '..', '..', '..', '..', 'resources', 'assets', 'images', 'logo_sw_global.png');
                    console.log('Logo path:', logoPath); // Để kiểm tra đường dẫn

                    // Thêm hình ảnh vào workbook
                    const logoImage = workbook.addImage({
                        filename: logoPath,
                        extension: 'png',
                    });

                    // Điều chỉnh vị trí và kích thước của ảnh
                    worksheet.addImage(logoImage, {
                        tl: { col: startCol, row: startRow - 1 }, // Vị trí bắt đầu của hình ảnh
                        br: { col: startCol + 3, row: startRow + 1 } // Vị trí kết thúc của hình ảnh
                    });
                }

                function fillMasterPONo(worksheet, po_data, sizeDataForLot, startRow, startCol) {
                    if (po_data && po_data.MASTER_PO_NO) {
                        const cell = worksheet.getCell(startRow + 6, startCol + 2);
                        cell.value = po_data.MASTER_PO_NO;
                        cell.font = { size: 12, bold: true, name: 'Arial' };
                        cell.alignment = { vertical: 'middle', horizontal: 'center', shrinkToFit: true };
                        console.log('MASTER_PO_NO filled:', po_data.MASTER_PO_NO);
                    }
                    if (po_data && po_data.FACTORY_NAME) {
                        const cell = worksheet.getCell(startRow + 5, startCol + 2);
                        cell.value = po_data.FACTORY_NAME;
                        cell.font = { size: 14, bold: true, name: 'Arial' };
                        cell.alignment = { vertical: 'middle', horizontal: 'center', shrinkToFit: true };
                        console.log('FACTORY_NAME filled:', po_data.FACTORY_NAME);
                    }
                    if (po_data && po_data.ITEM_NAME) {
                        const cell = worksheet.getCell(startRow + 4, startCol + 2);
                        cell.value = po_data.ITEM_NAME;
                        cell.font = { size: 15, bold: true, name: 'Arial' };
                        cell.alignment = { vertical: 'middle', horizontal: 'center', shrinkToFit: true };
                        console.log('ITEM_NAME filled:', po_data.ITEM_NAME);
                    }
                    if (sizeDataForLot && sizeDataForLot.length > 0) {
                        const firstItem = sizeDataForLot[0];
                        if (firstItem.PO_ITEM) {
                            const cell = worksheet.getCell(startRow + 7, startCol + 2);
                            cell.value = firstItem.PO_ITEM;
                            cell.font = { size: 12, bold: true, name: 'Arial' };
                            cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
                            console.log('PO_ITEM filled:', firstItem.PO_ITEM);
                        }

                        if (firstItem.STYLE_NAME) {
                            const cell = worksheet.getCell(startRow + 8, startCol + 2);
                            cell.value = firstItem.STYLE_NAME;
                            cell.font = { size: 12, bold: true, name: 'Arial' };
                            cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
                        }

                    }


                    // Tạo công thức SUM
                    const firstQtyRow = startRow + 12;
                    const lastQtyRow = startRow + 24;
                    const qtyCol1 = startCol + 2;
                    const qtyCol2 = startCol + 6;

                    const sumFormula = `=SUM(${worksheet.getCell(firstQtyRow, qtyCol1).address}:${worksheet.getCell(lastQtyRow, qtyCol1).address},${worksheet.getCell(firstQtyRow, qtyCol2).address}:${worksheet.getCell(lastQtyRow, qtyCol2).address})`;

                    // Áp dụng công thức cho ô tổng
                    const totalCell = worksheet.getCell(startRow + 10, startCol + 2);
                    totalCell.value = { formula: sumFormula };
                    totalCell.font = { size: 11, bold: true, name: 'Arial' };
                    totalCell.alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };

                    console.log('SUM formula applied:', sumFormula);

                    // Tính toán tổng số lượng (giữ lại để kiểm tra)
                    const totalQty = sizeDataForLot.reduce((sum, item) => sum + (parseInt(item.QTY) || 0), 0);
                    console.log('Total QTY calculated (for verification):', totalQty);
                }



                function sumQty(sizeDataForLot) {
                    return sizeDataForLot.reduce((total, item) => total + (parseInt(item.QTY) || 0), 0);
                }

                function fillSizeAndQuantityData(worksheet, sizeDataForLot, po_data, startRow, startCol) {
                    console.log('Entering fillSizeAndQuantityData');
                    console.log('sizeDataForLot:', JSON.stringify(sizeDataForLot, null, 2));
                    console.log('po_data:', JSON.stringify(po_data, null, 2));

                    const maxRowsPerColumn = 13;
                    let currentSizeCol = startCol + 1;
                    let currentQtyCol = startCol + 2;
                    let currentRow = startRow + 12;

                    sizeDataForLot.forEach((item, index) => {
                        console.log(`Processing item ${index}:`, JSON.stringify(item, null, 2));

                        if (index > 0 && index % maxRowsPerColumn === 0) {

                            currentSizeCol += 4;
                            currentQtyCol += 4;
                            currentRow = startRow + 12;
                        }

                        // Điền SIZE_NUM
                        const sizeCell = worksheet.getCell(currentRow, currentSizeCol);
                        sizeCell.value = item.SIZE_NUM;
                        sizeCell.alignment = { vertical: 'middle', horizontal: 'center' };
                        sizeCell.font = { size: 14 }

                        console.log(`Filled SIZE_NUM: ${item.SIZE_NUM} at cell ${sizeCell.address}`);

                        // Điền QTY
                        const qtyCell = worksheet.getCell(currentRow, currentQtyCol);
                        qtyCell.value = item.QTY;
                        qtyCell.alignment = { vertical: 'middle', horizontal: 'right' };
                        qtyCell.font = { size: 14 };
                        console.log(`Filled QTY: ${item.QTY} at cell ${qtyCell.address}`);

                        currentRow++;
                    });

                    console.log(`Processed ${sizeDataForLot.length} items for PO_ITEM: ${po_data.PO_ITEM}`);
                }

                function setCellStyles(worksheet, startRow, startCol) {
                    const cellValues = {
                        'B3': 'SHINWOO GLOBAL VIET NAM CO.,LTD', 'B4': 'GOODS INFORMATION', 'B5': 'Item', 'C5': 'US STICKER', 'B6': 'CONPANY:', 'B28': 'Name',
                        'B7': 'PO NO:', 'B8': 'PO LOT:', 'B9': 'STYLE-COLOR:', 'B11': 'TOTAL:', 'B12': 'SIZE', 'C12': 'QUANTITY', 'G11': 'PCS',
                        'F12': 'SIZE', 'G12': 'QUANTITY', 'F26': 'ĐÃ GÓI ĐỦ (SIZE):', 'B27': 'SECTION', 'C27': 'CHECKING', 'E27': 'CHECK THÔNG TIN',
                        'E28': 'MÀU SẮC                  KÍCH THƯỚC: ⬜', 'E29': 'THÔNG TIN:⬜', 'G28': 'SỐ LƯỢNG:⬜', 'G29': 'CHẤT LƯỢNG:⬜',

                    };

                    // Định nghĩa số lượng khoảng trắng và các thuộc tính đặc biệt cho mỗi ô chứa ký tự vuông
                    const squareConfig = {
                        'E28': { spaces: 4, squareSize: 10, wrapText: true },
                        'E29': { spaces: 7, squareSize: 10, wrapText: false },
                        'G28': { spaces: 6, squareSize: 10, wrapText: false },
                        'G29': { spaces: 2, squareSize: 10, wrapText: false }
                    };

                    Object.entries(cellValues).forEach(([cellAddress, value]) => {
                        const [col, row] = cellAddress.match(/([A-Z]+)(\d+)/).slice(1);
                        const newRow = parseInt(row) + startRow - 1;
                        const newCol = String.fromCharCode(col.charCodeAt(0) + startCol - 1);
                        const newCellAddress = `${newCol}${newRow}`;

                        const cell = worksheet.getCell(newCellAddress);

                        if (['E28', 'E29', 'G28', 'G29'].includes(cellAddress)) {
                            const config = squareConfig[cellAddress];

                            cell.font = {
                                size: 8,
                                bold: false,
                                name: 'Arial'
                            };
                            cell.alignment = {
                                vertical: 'middle',
                                horizontal: 'left',
                                wrapText: config.wrapText
                            };

                            // Tách văn bản và ký tự vuông
                            const [text, square] = value.split('⬜');

                            // Đặt giá trị ô và áp dụng định dạng rich text
                            cell.value = {
                                richText: [
                                    { text: text.trim() },
                                    {
                                        text: '\u00A0'.repeat(config.spaces),
                                        font: { size: 10 },
                                        alignment: {
                                            vertical: 'middle',
                                            horizontal: 'center',
                                        }
                                    },
                                    {
                                        text: '⬜',
                                        font: {
                                            size: config.squareSize,
                                            verticalAlign: 'superscript'
                                        }
                                    }
                                ]
                            };

                            // Điều chỉnh độ rộng cột
                            worksheet.getColumn(newCol).width = 25 + config.spaces / 2;

                            // Đặt chiều cao cố định cho dòng
                            worksheet.getRow(newRow).height = 22.5;
                        } else {
                            cell.value = value;

                            if (['B3', 'B4'].includes(cellAddress)) {
                                cell.font = { bold: true, size: 13, name: 'Arial' };
                                cell.alignment = { vertical: 'middle', horizontal: 'center' };
                            } else if (['B5', 'C7'].includes(cellAddress)) {
                                cell.font = { size: 12, bold: false, name: 'Arial' };
                                cell.alignment = { vertical: 'middle', horizontal: 'left' };
                            } else if (['C5', 'C7', 'C8', 'C9'].includes(cellAddress)) {
                                cell.font = { size: 12, bold: true, name: 'Arial' };
                                cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
                            } else if (['C11', 'B12', 'C12', 'F12', 'G12'].includes(cellAddress)) {
                                cell.font = { size: 11, bold: true, name: 'Arial' };
                                cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
                            } else if (['B11', 'G11'].includes(cellAddress)) {
                                cell.font = { size: 11, bold: true, name: 'Arial' };
                                cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
                            } else if (['B27', 'C27', 'E27', 'B28'].includes(cellAddress)) {
                                cell.font = { size: 11, bold: false, name: 'Arial' };
                                cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
                            } else if (['B9'].includes(cellAddress)) {
                                cell.font = { size: 10, bold: false, name: 'Arial' };
                                cell.alignment = { vertical: 'middle', horizontal: 'left', shrinkToFit: true };
                            } else if (['F26'].includes(cellAddress)) {
                                cell.font = { size: 9, bold: true, name: 'Arial' };
                                cell.alignment = { vertical: 'middle', horizontal: 'left' };
                            } else if (['B6', 'B7', 'B8'].includes(cellAddress)) {
                                cell.font = { size: 11, bold: false, name: 'Arial' };
                                cell.alignment = { vertical: 'middle', horizontal: 'left' };
                            } else if (['C5'].includes(cellAddress)) {
                                cell.font = { size: 12, bold: true, name: 'Arial' };
                                cell.alignment = { vertical: 'middle', horizontal: 'center' };
                            } else {
                                cell.font = { size: 9, bold: false, name: 'Arial' };
                                cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
                            }
                        }
                    });
                }

                function setColumnWidths(worksheet) {
                    const columnWidths = {
                        A: 3.44, B: 16, C: 16, D: 0.88, E: 0.88,
                        F: 16, G: 16, H: 5.67, I: 16, J: 16,
                        K: 0.88, L: 0.88, M: 16, N: 16,
                    };
                    Object.entries(columnWidths).forEach(([col, width]) => {
                        worksheet.getColumn(col).width = width;
                    });
                }

                function setRowHeights(worksheet, startRow) {
                    const rowHeights = {
                        1: 14.4, 2: 27, 3: 20.4, 4: 20.4, 5: 32.3, 6: 22.5, 7: 22.5, 8: 22.5, 9: 22.5, 10: 8.3,
                        11: 22.5, 12: 18, 13: 18, 14: 18, 15: 18, 16: 18, 17: 18, 18: 18, 19: 18, 20: 18, 21: 18,
                        22: 18, 23: 18, 24: 18, 25: 18, 26: 19.5, 27: 21.8, 28: 22.5, 29: 22.5
                    };
                    Object.entries(rowHeights).forEach(([row, height]) => {
                        worksheet.getRow(startRow + parseInt(row) - 1).height = height;
                    });
                }

                function mergeCells(worksheet, startRow, startCol) {
                    const mercellranges = [
                        'B2:C2', 'B3:G3', 'B4:G4', 'C5:G5', 'C6:G6', 'C7:G7', 'C8:G8',
                        'C9:G9', 'C11:F11', 'C27:D27', 'E27:G27', 'B28:B29', 'C28:D29', 'E28:F28', 'E29:F29'
                    ];

                    mercellranges.forEach(range => {
                        const [start, end] = range.split(':');
                        const [startCol1, startRow1] = start.match(/([A-Z]+)(\d+)/).slice(1);
                        const [endCol1, endRow1] = end.match(/([A-Z]+)(\d+)/).slice(1);

                        const newStartCol = String.fromCharCode(startCol1.charCodeAt(0) + startCol - 1);
                        const newEndCol = String.fromCharCode(endCol1.charCodeAt(0) + startCol - 1);
                        const newStartRow = parseInt(startRow1) + startRow - 1;
                        const newEndRow = parseInt(endRow1) + startRow - 1;

                        const newRange = `${newStartCol}${newStartRow}:${newEndCol}${newEndRow}`;

                        try {
                            worksheet.mergeCells(newRange);
                        } catch (error) {
                            console.log(`Không thể hợp nhất vùng ${newRange}: ${error.message}`);
                        }
                    });
                }

                function setCellFill(worksheet, startRow, startCol) {
                    const rangesToFill = [
                        { start: 'B6', end: 'G9' }, // I6:N9
                        { start: 'B11', end: 'G11' } // I11:N11
                    ];

                    rangesToFill.forEach(range => {
                        const { start, end } = range;
                        const [startCol1, startRow1] = start.match(/([A-Z]+)(\d+)/).slice(1);
                        const [endCol1, endRow1] = end.match(/([A-Z]+)(\d+)/).slice(1);

                        const newStartCol = String.fromCharCode(startCol1.charCodeAt(0) + startCol - 1);
                        const newEndCol = String.fromCharCode(endCol1.charCodeAt(0) + startCol - 1);
                        const newStartRow = parseInt(startRow1) + startRow - 1;
                        const newEndRow = parseInt(endRow1) + startRow - 1;

                        for (let row = newStartRow; row <= newEndRow; row++) {
                            for (let col = newStartCol.charCodeAt(0); col <= newEndCol.charCodeAt(0); col++) {
                                const cell = worksheet.getCell(`${String.fromCharCode(col)}${row}`);
                                // Tô màu xám cho các ô
                                cell.fill = {
                                    type: 'pattern',
                                    pattern: 'solid',
                                    fgColor: { argb: 'CCCCCC' }
                                };
                            }
                        }
                    });
                }

                function setBorders(worksheet, startRow, startCol) {
                    const rangesToBorder = [
                        'B6:G9', 'B11:G11', 'B12:C25',
                        'F12:G25', 'B27:G29',
                    ];

                    rangesToBorder.forEach(range => {
                        const [start, end] = range.split(':');
                        const [startCol1, startRow1] = start.match(/([A-Z]+)(\d+)/).slice(1);
                        const [endCol1, endRow1] = end.match(/([A-Z]+)(\d+)/).slice(1);

                        const newStartCol = String.fromCharCode(startCol1.charCodeAt(0) + startCol - 1);
                        const newEndCol = String.fromCharCode(endCol1.charCodeAt(0) + startCol - 1);
                        const newStartRow = parseInt(startRow1) + startRow - 1;
                        const newEndRow = parseInt(endRow1) + startRow - 1;

                        for (let row = newStartRow; row <= newEndRow; row++) {
                            for (let col = newStartCol.charCodeAt(0); col <= newEndCol.charCodeAt(0); col++) {
                                const cell = worksheet.getCell(`${String.fromCharCode(col)}${row}`);

                                // Đặt border cho ô
                                cell.border = {
                                    top: { style: 'medium' },
                                    left: { style: 'medium' },
                                    bottom: { style: 'medium' },
                                    right: { style: 'medium' }
                                };
                            }
                        }
                    });

                    // Loại bỏ border thẳng đứng giữa F11 và G11
                    const f11Cell = worksheet.getCell(startRow + 10, startCol + 5); // F11
                    const g11Cell = worksheet.getCell(startRow + 10, startCol + 6); // G11

                    f11Cell.border = {
                        ...f11Cell.border,
                        right: { style: 'none' }
                    };

                    g11Cell.border = {
                        ...g11Cell.border,
                        left: { style: 'none' }
                    };
                }




                // Tạo nhiều bản sao của template theo layout 2x2
                const TEMPLATE_WIDTH = 7;
                const TEMPLATE_HEIGHT = 29;
                const VERTICAL_SPACING = 1;

                dt_m.forEach((po_data, index) => {
                    const sizeDataForLot = dt_m2.filter(item => item.PO_ITEM === po_data.PO_ITEM);

                    const row = Math.floor(index / 2) % 2;
                    const col = index % 2;

                    const startRow = Math.floor(index / 4) * (TEMPLATE_HEIGHT * 2 + VERTICAL_SPACING) + row * (TEMPLATE_HEIGHT + VERTICAL_SPACING) + 1;
                    const startCol = col * TEMPLATE_WIDTH + 1;

                    createTemplate(worksheet, po_data, sizeDataForLot, index + 1, startRow, startCol);
                });
                const setupExcelForA4Printing = (worksheet, totalCopies) => {
                    const startColumn = 'A';
                    const endColumn = 'N';
                    const rowsPerPage = 59; // Số dòng cố định
                    const colsPerPage = 14; // Số cột (từ A đến N)

                    // Tính tổng số trang dựa trên tổng số bản sao, 4 bản sao trên mỗi trang
                    const totalPages = Math.ceil(totalCopies / 4); // 4 bản sao trên mỗi trang
                    const totalRows = totalPages * rowsPerPage;

                    // Thiết lập vùng in
                    worksheet.pageSetup.printArea = `${startColumn}1:${endColumn}${totalRows}`;

                    // Các thiết lập khác
                    worksheet.pageSetup.fitToPage = false;
                    worksheet.pageSetup.scale = 68;
                    worksheet.pageSetup.paperSize = 9;
                    worksheet.pageSetup.margins = {
                        left: 0.25,
                        right: 0.25,
                        top: 0.25,
                        bottom: 0.25,
                        header: 0,
                        footer: 0
                    };
                    worksheet.pageSetup.orientation = 'portrait';

                    // Thêm page break sau mỗi 59 dòng
                    for (let i = rowsPerPage; i < totalRows; i += rowsPerPage) {
                        worksheet.getRow(i).addPageBreak();
                    }

                    // Log thông tin để debug
                    console.log('Print Area:', worksheet.pageSetup.printArea);
                    console.log('Total Rows:', totalRows);
                    console.log('Total Pages:', totalPages);
                    console.log('Rows per Page:', rowsPerPage);
                };



                // Apply A4 print setup
                setupExcelForA4Printing(worksheet, dt_m.length);

                /********* Print file excel ********/
                const reportFile = Helpers.tmpPath(file_new);
                await workbook.xlsx.writeFile(reportFile);
                return response.attachment(reportFile, file_new);
            }
        }
        catch (e) {
            console.log(e);
            return response.send(Utils.response(false, e.message, null));
        }
    }
    //================ END  OMFLX001 order report==============================//
    //=================SWNK110 haddad===========================================//
    async swnk110_haddad({ request, response, auth }) {
        console.log('Entering rptswsofx010');
        try {
            /****************************** Get Param *********************************/
            let { para } = request.get(['para']);
            /********* Parse param to json ********/
            var item = JSON.parse(para);
            const user = await auth.getUser();
            const p_crt_by = user.USER_ID;
            const p_language = request.header("accept-language", "ENG");

            var file_nm = [item.P_FILE_NAME_NEW];
            var file_type = ".xlsx";
            var full_nm = file_nm + file_type;
            var file_new = file_nm + p_crt_by + file_type;
            var _resourcesPath = "report/sw/nk" + '/' + "rpt_swnk030_barcode_detail_v01.xlsx";
            var _store = "SW_SEL_SWNK110_ORDER";
            // var _store2 = "SW_RPT_SWFX010_DTL_ORDER";
            var _param = [item.p_company_pk, item.p_AccountCode, item.p_month, item.p_month_to, item.p_factory_pk];
            // console.log(_store, _store2)

            /***************************** Return failed ****************************/
            if (!user) {
                return response.send(Utils.response(false, "Request failed!", null));
            }
            /****************************** Begin call store and write excel *********/
            else {
                /********* Call store  ***************/
                var dt_m = await DBService.callProcCursor(_store, _param, p_language, p_crt_by);
                // var dt_m2 = await DBService.callProcCursor(_store2, _param, p_language, p_crt_by);

                console.log('dt_m data:', JSON.stringify(dt_m, null, 2));
                // console.log('dt_m2 data:', JSON.stringify(dt_m2, null, 2));

                /********* Read file excel ********/
                const workbook = new ExcelJS.Workbook();
                const templateFile = Helpers.resourcesPath(_resourcesPath);
                await workbook.xlsx.readFile(templateFile);
                var worksheet = workbook.getWorksheet(1);
                worksheet.name = "tờ dán số lượng";
                const colors = [
                    'FFFFA500', 'FFFF0000', 'FF008000', 'FF0000FF', 'FFFFFF00', 'FF800080', 'FFFF69B4', 'FF808080', 'FFA52A2A'
                ];
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                worksheet.properties.tabColor = { argb: randomColor };
                // New function to create template
                function createTemplate(worksheet, po_data, sizeDataForLot, index, startRow, startCol) {
                    console.log(`Starting to create template for PO_ITEM: ${po_data.PO_ITEM}, at row: ${startRow}, col: ${startCol}`);
                    setCellStyles(worksheet, startRow, startCol);
                    setColumnWidths(worksheet);
                    setRowHeights(worksheet, startRow);
                    setBorders(worksheet, startRow, startCol);
                    fillMasterPONo(worksheet, po_data, sizeDataForLot, startRow, startCol);
                    // console.log(`Template creation completed for PO_ITEM: ${po_data.PO_ITEM}`);
                }
                function fillMasterPONo(worksheet, po_data, sizeDataForLot, startRow, startCol) {
                    if (po_data && po_data.PRODUCT_CODE) {
                        const cell = worksheet.getCell(startRow + 2, startCol + 1);
                        cell.value = po_data.PRODUCT_CODE;
                        cell.font = { size: 16, bold: true, name: 'Arial', color: { argb: 'FFFF0000' } };
                        cell.alignment = { vertical: 'middle', horizontal: 'center', shrinkToFit: true };
                        console.log('MASTER_PO_NO filled:', po_data.MASTER_PO_NO);
                    }
                    if (po_data && po_data.QR_CODE) {
                        const cell = worksheet.getCell(startRow + 3, startCol + 1);
                        cell.value = po_data.QR_CODE;
                        cell.font = { size: 14, bold: true, name: 'Arial' };
                        cell.alignment = { vertical: 'middle', horizontal: 'center', shrinkToFit: true };
                        console.log('FACTORY_NAME filled:', po_data.FACTORY_NAME);
                    }
                    if (po_data && po_data.QTY_RPT) {
                        const cell = worksheet.getCell(startRow + 4, startCol + 1);
                        cell.value = po_data.QTY_RPT;
                        cell.font = { size: 16, bold: true, name: 'Arial' };
                        cell.numFmt = '#,##0';
                        cell.alignment = { vertical: 'middle', horizontal: 'center', shrinkToFit: true };
                        console.log('ITEM_NAME filled:', po_data.ITEM_NAME);
                    }
                }

                function setCellStyles(worksheet, startRow, startCol) {
                    const cellValues = {
                        'A2': 'BYER', 'B2': 'HADDAD', 'A3': 'ITEM', 'A4': 'QR CODE', 'A5': 'QUANTITY'
                    };
                    Object.entries(cellValues).forEach(([cellAddress, value]) => {
                        const [col, row] = cellAddress.match(/([A-Z]+)(\d+)/).slice(1);
                        const newRow = parseInt(row) + startRow - 1;
                        const newCol = String.fromCharCode(col.charCodeAt(0) + startCol - 1);
                        const newCellAddress = `${newCol}${newRow}`;
                        const cell = worksheet.getCell(newCellAddress);
                        if (['E28', 'E29', 'G28', 'G29'].includes(cellAddress)) {
                            const config = squareConfig[cellAddress];
                            cell.font = {
                                size: 8,
                                bold: false,
                                name: 'Arial'
                            };
                            cell.alignment = {
                                vertical: 'middle',
                                horizontal: 'left',
                                wrapText: config.wrapText
                            };
                            // Tách văn bản và ký tự vuông
                            const [text, square] = value.split('⬜');

                            // Đặt giá trị ô và áp dụng định dạng rich text
                            cell.value = {
                                richText: [
                                    { text: text.trim() },
                                    {
                                        text: '\u00A0'.repeat(config.spaces),
                                        font: { size: 10 },
                                        alignment: {
                                            vertical: 'middle',
                                            horizontal: 'center',
                                        }
                                    },
                                    {
                                        text: '⬜',
                                        font: {
                                            size: config.squareSize,
                                            verticalAlign: 'superscript'
                                        }
                                    }
                                ]
                            };
                            // Điều chỉnh độ rộng cột
                            worksheet.getColumn(newCol).width = 25 + config.spaces / 2;
                            // Đặt chiều cao cố định cho dòng
                            worksheet.getRow(newRow).height = 22.5;
                        } else {
                            cell.value = value;
                            if (['A2', 'A3', 'A4', 'A5', 'B5'].includes(cellAddress)) {
                                cell.font = { bold: true, size: 16, name: 'Arial' };
                                cell.alignment = { vertical: 'middle', horizontal: 'center' };
                            } else if (['B4'].includes(cellAddress)) {
                                cell.font = { size: 14, bold: false, name: 'Arial' };
                                cell.alignment = { vertical: 'middle', horizontal: 'left' };
                            } else if (['B2'].includes(cellAddress)) {
                                cell.font = { size: 22, bold: true, name: 'Arial' };
                                cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
                            } else if (['B3'].includes(cellAddress)) {
                                cell.font = { size: 16, bold: true, name: 'Arial', color: { argb: 'FFFF0000' } };
                                cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
                            } else if (['B11', 'G11'].includes(cellAddress)) {
                                cell.font = { size: 11, bold: true, name: 'Arial' };
                                cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
                            }
                        }
                    });
                }

                function setColumnWidths(worksheet) {
                    const columnWidths = {
                        A: 26, B: 37, C: 2.33, D: 26, E: 37,

                    };
                    Object.entries(columnWidths).forEach(([col, width]) => {
                        worksheet.getColumn(col).width = width;
                    });
                }

                function setRowHeights(worksheet, startRow) {
                    const rowHeights = {
                        1: 24, 2: 48, 3: 48, 4: 48, 5: 48, 6: 24.4
                    };
                    Object.entries(rowHeights).forEach(([row, height]) => {
                        worksheet.getRow(startRow + parseInt(row) - 1).height = height;
                    });
                }

                function setBorders(worksheet, startRow, startCol) {
                    const rangesToBorder = [
                        'A2:B5',
                    ];

                    rangesToBorder.forEach(range => {
                        const [start, end] = range.split(':');
                        const [startCol1, startRow1] = start.match(/([A-Z]+)(\d+)/).slice(1);
                        const [endCol1, endRow1] = end.match(/([A-Z]+)(\d+)/).slice(1);

                        const newStartCol = String.fromCharCode(startCol1.charCodeAt(0) + startCol - 1);
                        const newEndCol = String.fromCharCode(endCol1.charCodeAt(0) + startCol - 1);
                        const newStartRow = parseInt(startRow1) + startRow - 1;
                        const newEndRow = parseInt(endRow1) + startRow - 1;

                        for (let row = newStartRow; row <= newEndRow; row++) {
                            for (let col = newStartCol.charCodeAt(0); col <= newEndCol.charCodeAt(0); col++) {
                                const cell = worksheet.getCell(`${String.fromCharCode(col)}${row}`);

                                // Kiểm tra xem cell có phải là viền ngoài không
                                const isTopEdge = row === newStartRow;
                                const isBottomEdge = row === newEndRow;
                                const isLeftEdge = col === newStartCol.charCodeAt(0);
                                const isRightEdge = col === newEndCol.charCodeAt(0);

                                // Đặt border cho ô
                                cell.border = {
                                    top: {
                                        style: isTopEdge ? 'thick' : 'thin'
                                    },
                                    left: {
                                        style: isLeftEdge ? 'thick' : 'thin'
                                    },
                                    bottom: {
                                        style: isBottomEdge ? 'thick' : 'thin'
                                    },
                                    right: {
                                        style: isRightEdge ? 'thick' : 'thin'
                                    }
                                };
                            }
                        }
                    });
                }
                const TEMPLATE_WIDTH = 3;
                const TEMPLATE_HEIGHT = 5;
                const VERTICAL_SPACING = 0;
                const totalPages = Math.ceil(dt_m.length / 10); // 10 bản/trang
                dt_m.forEach((po_data, index) => {
                    const sizeDataForLot = dt_m.filter(item => item.PO_ITEM === po_data.PO_ITEM);
                    const pageIndex = Math.floor(index / 10);
                    const positionInPage = index % 10;
                    const row = Math.floor(positionInPage / 2);
                    const col = positionInPage % 2;

                    // Tính vị trí bắt đầu chính xác
                    const startRow = (pageIndex * (TEMPLATE_HEIGHT * 5)) +
                        (row * TEMPLATE_HEIGHT) + 1;
                    const startCol = (col * TEMPLATE_WIDTH) + 1;

                    // Log để debug
                    console.log(`Creating template ${index + 1}/${dt_m.length}:`, {
                        pageIndex,
                        positionInPage,
                        row,
                        col,
                        startRow,
                        startCol
                    });

                    createTemplate(worksheet, po_data, sizeDataForLot, index + 1, startRow, startCol);
                });

                function setupExcelForA4Printing(worksheet, totalCopies) {
                    if (totalCopies <= 0) {
                        throw new Error('Số lượng bản sao phải lớn hơn 0');
                    }
                    const startColumn = 'A';
                    const endColumn = 'E';
                    const TEMPLATE_HEIGHT = 5;
                    const actualRows = Math.ceil(totalCopies / 2);
                    const totalPages = Math.ceil(actualRows / 5);
                    const lastRowWithContent = actualRows * TEMPLATE_HEIGHT;
                    worksheet.pageSetup.printArea = `${startColumn}1:${endColumn}${lastRowWithContent}`;
                    worksheet.pageSetup.fitToPage = false;
                    worksheet.pageSetup.scale = 78;
                    worksheet.pageSetup.horizontalCentered = true;
                    worksheet.pageSetup.verticalCentered = true;
                    worksheet.pageSetup.paperSize = 9; // A4
                    worksheet.pageSetup.orientation = 'portrait';
                    worksheet.pageSetup.margins = {
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                        header: 0,
                        footer: 0
                    };
                    const rowsPerPage = 5 * TEMPLATE_HEIGHT;
                    for (let i = rowsPerPage; i < lastRowWithContent; i += rowsPerPage) {
                        worksheet.getRow(i).addPageBreak();
                    }

                    // console.log('--- Print Configuration ---');
                    // console.log('Total Data Records:', totalCopies);
                    // console.log('Actual Rows Needed:', actualRows);
                    // console.log('Total Pages Required:', totalPages);
                    // console.log('Last Row With Content:', lastRowWithContent);
                    // console.log('Print Area:', worksheet.pageSetup.printArea);
                }

                setupExcelForA4Printing(worksheet, dt_m.length);
                const reportFile = Helpers.tmpPath(file_new);
                await workbook.xlsx.writeFile(reportFile);
                return response.attachment(reportFile, file_new);
            }
        }
        catch (e) {
            console.log(e);
            return response.send(Utils.response(false, e.message, null));
        }
    }
    //==============================swnk110 haddad===============================//
    //---------------------------rptswsoNK120-- sale order battle----------------//
    async rptswsoNK120({ request, response, auth }) {
        try {
            /****************************** Get Param *********************************/
            let { para } = request.get(['para']);
            /********* Parse param to json ********/
            var item = JSON.parse(para);
            const user = await auth.getUser();
            const p_crt_by = user.USER_ID;
            const p_language = request.header("accept-language", "ENG");

            var file_nm = [item.P_FILE_NAME_NEW];
            var file_type = ".xlsx";
            var full_nm = file_nm + file_type;
            var file_new = file_nm + p_crt_by + file_type;
            var _resourcesPath = "report/sw/nk" + '/' + "rpt_swnk030_barcode_detail_v01.xlsx";
            var _store = "SZ_SEL_SWNK120_EXPORT_MST_NOCACHE";
            var _store2 = "SZ_SEL_SWNK120_EXPORT_H_NOCACHE";
            var _store3 = "SZ_SEL_SWNK120_EXPORT_NOCACHE";
            var _param = [item.p_company_pk, item.p_PartnerCD_NM, item.p_AccCD_NM, item.p_AccountType, item.p_month, item.p_factory_pk, item.p_month_to];

            /***************************** Return failed ****************************/
            if (!user) {
                return response.send(Utils.response(false, "Request failed!", null));
            }
            /****************************** Begin call store and write excel *********/
            else {
                /********* Call store  ***************/
                var dt_m = await DBService.callProcCursor(_store, _param, p_language, p_crt_by);
                var dt_m2 = await DBService.callProcCursor(_store2, _param, p_language, p_crt_by);
                var dt_m3 = await DBService.callProcCursor(_store3, _param, p_language, p_crt_by);

                const total_dtl_pos = dt_m3.length + 14;
                const total_dtl_pos_2 = dt_m3.length + 11;

                /********* Read file excel ********/
                const templateFile = Helpers.resourcesPath(_resourcesPath);
                await workbook.xlsx.readFile(templateFile);
                var worksheet = workbook.getWorksheet(1);
                //ham ke o
                function mergeCellsAndAddBorders(range) {
                    try {
                        // worksheet.mergeCells(range); // This line has been removed as requested
                        const [startCell, endCell] = range.split(':');
                        worksheet.getCell(startCell).border = {
                            top: { style: 'medium', color: { argb: 'FF000000' } },
                            left: { style: 'medium', color: { argb: 'FF000000' } },
                            bottom: { style: 'medium', color: { argb: 'FF000000' } },
                            right: { style: 'medium', color: { argb: 'FF000000' } }

                        };
                        // console.log(`Successfully bordered: ${range}`);
                    } catch (error) {
                        console.error(`Error processing range ${range}: ${error.message}`);
                    }
                }


                // Add labels to specified cells
                const cellValues = {
                    'A3': 'FACTORY:', 'A4': 'ORDER NO:', 'A5': 'DPO:', 'A6': 'GENDER:',
                    'A7': 'STYLE & COLOR', 'B11': 'BARCODE', 'D11': 'SIZE', 'L4': 'Printed date',
                    'L5': 'Shift', 'L6': 'Shift B', 'N4': 'Date………………………………………………',
                    'N5': "User's name & Machine's  name ", 'R5': 'Pager size', 'T5': 'Roll no',
                    'R6': '12*1000', 'L4': '0.2', 'M10': 'REMEMBER TO PRINT FROM SMALL SIZE --> BIG SIZE !!',
                    'N11': 'TOTAL_QTY', 'O11': 'G_TOTAL', 'P11': 'LOSS_QTY', 'Q11': 'EXTRA_QTY', 'R11': 'PRINTED_NO',
                    'S11': 'REMAIN', 'T11': 'PRINTED_TIME', 'E7': 'STYLE NAME', 'E8': 'ENLISH COLOR', 'E9': 'FRANCE COLOR', 'E10': 'RETAIL PRICE', 'A11': 'No',
                    'P8': 'PO NO', 'P9': 'SEASON'
                };

                Object.entries(cellValues).forEach(([cellAddress, value]) => {
                    const cell = worksheet.getCell(cellAddress);
                    cell.value = value;

                    if (['A3', 'A4', 'A5', 'A6'].includes(cellAddress)) {
                        cell.font = { bold: false, size: 12 };
                        cell.alignment = { vertical: 'middle', horizontal: 'left' };
                    } else if (['A7', 'L5', 'L6', 'L4', 'T5'].includes(cellAddress)) {
                        cell.font = { size: 16, bold: true };
                        cell.alignment = { vertical: 'middle', horizontal: 'center' };
                    } else if (cellAddress === 'M10') {
                        cell.font = { size: 14, color: { argb: 'FFFF0000' } };
                        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF00' } };
                        cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
                    } else if (cellAddress === 'C5') {
                        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF00' } };
                        cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
                    } else if (['N11', 'O11', 'P11', 'Q11', 'R11', 'S11', 'T11'].includes(cellAddress)) {
                        cell.font = { size: 12, bold: true };
                        cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
                    } else if (['E7', 'E8', 'E9', 'E10'].includes(cellAddress)) {
                        cell.font = { size: 18, bold: true };
                        cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
                        // } else if (['P12', 'Q12'].includes(cellAddress)) {
                        //     cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF00' } };
                        //     cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
                    }
                    else {
                        cell.font = { size: 14, bold: true };
                        cell.alignment = { vertical: 'middle', horizontal: 'center' };
                    }
                });

                // Add borders to specified ranges
                const rangesToBorder = [
                    'L4:M4', 'L5:M5', 'L6:M7',
                    'N4:T4', 'N5:Q5', 'R5:S5', 'N6:Q7', 'R6:S7', 'T6:T7', 'A7:D7',
                    'E7:F7', 'G7:K7', 'A8:D10', 'E8:F8', 'E9:F9', 'E10:F10', 'G8:O8',
                    'P8:Q8', 'R8:T8', 'G9:T9', 'G10:J10', 'K10:L10', 'M10:T10', 'B11:C11',
                    'T5', 'D11:T11',

                ];


                rangesToBorder.forEach(range => mergeCellsAndAddBorders(range));

                // Thêm đường kẻ dọc cho S12 và T12
                ['S12', 'T12'].forEach(cellAddress => {
                    const cell = worksheet.getCell(cellAddress);
                    cell.border = {
                        ...cell.border,
                        left: { style: 'medium' },
                        right: { style: 'medium' }
                    };
                });

                ///them đường kẻ từ A11 đến T12
                for (let row = 11; row <= 12; row++) {
                    // Xử lý cột A đặc biệt
                    worksheet.getCell(`A${row}`).border = {
                        top: { style: 'medium' },
                        left: { style: 'medium' },
                        bottom: { style: 'medium' },
                        right: { style: 'medium' }
                    };

                    // Xử lý các cột B đến T
                    for (let col = 'B'; col <= 'T'; col = String.fromCharCode(col.charCodeAt(0) + 1)) {
                        worksheet.getCell(`${col}${row}`).border = {
                            top: { style: 'medium' },
                            bottom: { style: 'medium' },
                            right: { style: 'medium' }
                        };
                    }
                }


                // Điều chỉnh độ rộng của các cột từ A đến T
                const columnWidths = {
                    A: 6.22, B: 22.78, C: 9.33, D: 9.67, E: 16.22,
                    F: 16.22, G: 12, H: 12, I: 12, J: 12,
                    K: 12, L: 12, M: 13.11, N: 13.22, O: 13.22,
                    P: 12.44, Q: 12.44, R: 12.44, S: 9.11, T: 9.11
                };
                const rowHeights = {
                    11: 42, 12: 42
                };

                // Đặt chiều rộng cột
                Object.entries(columnWidths).forEach(([col, width]) => {
                    worksheet.getColumn(col).width = width;
                });

                // Đặt chiều cao hàng
                Object.entries(rowHeights).forEach(([row, height]) => {
                    worksheet.getRow(parseInt(row)).height = height;
                });
                //======== end ham ke o=========================================

                worksheet.mergeCells('A1:P2');
                worksheet.mergeCells('A3:B3');
                worksheet.mergeCells('A4:B4');
                worksheet.mergeCells('A6:B6');
                worksheet.mergeCells('L4:M4');
                worksheet.mergeCells('L5:M5');
                worksheet.mergeCells('L6:M7');
                worksheet.mergeCells('N4:T4');
                worksheet.mergeCells('N5:Q5');
                worksheet.mergeCells('R5:S5');
                worksheet.mergeCells('N6:Q7');
                worksheet.mergeCells('R6:S7');
                worksheet.mergeCells('T6:T7');
                worksheet.mergeCells('A7:D7');
                worksheet.mergeCells('E7:F7');
                worksheet.mergeCells('G7:K7');
                worksheet.mergeCells('A8:D10');
                worksheet.mergeCells('E8:F8');
                worksheet.mergeCells('E9:F9');
                worksheet.mergeCells('E10:F10');
                worksheet.mergeCells('G8:O8');
                worksheet.mergeCells('P8:Q8');
                worksheet.mergeCells('R8:T8');
                worksheet.mergeCells('G9:O9');
                worksheet.mergeCells('G10:J10');
                worksheet.mergeCells('K10:L10');
                worksheet.mergeCells('M10:T10');
                worksheet.mergeCells('B11:C12');  // Giữ lại cái này
                worksheet.mergeCells('A11:A12');  // Xóa cái này vì xung đột
                worksheet.mergeCells('D11:D12');
                worksheet.mergeCells('N11:N12');
                worksheet.mergeCells('O11:O12');
                worksheet.mergeCells('P11:P12');
                worksheet.mergeCells('Q11:Q12');
                worksheet.mergeCells('R11:R12');
                worksheet.mergeCells('S11:S12');
                worksheet.mergeCells('T11:T12');
                worksheet.mergeCells('P9:Q9');
                worksheet.mergeCells('R9:T9');
                worksheet.getCell('P11').fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFFF9900' }  // Màu vàng
                };

                worksheet.getCell('Q11').fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFFF9900' }  // Màu vàng
                };
                // const mercellranges = ['A1:P2', 'A3:B3', 'A4:B4', 'A6:B6', 'L4:M4', 'L5:M5', 'L6:M7', 'N4:T4', 'N5:Q5', 'R5:S5', 'N6:Q7',
                //     'R6:S7', 'T6:T7', 'A7:D7', 'E7:F7', 'G7:K7', 'A8:D10', 'E8:F8', 'E9:F9', 'E10:F10', 'G8:O8', 'P8:Q8', 'R8:T8', 'G9:T9', 'G10:J10',
                //     'K10:L10', 'M10:T10', 'B11:C11',];
                // mercellranges.forEach(range => worksheet.mergeCells(range));
                // Helper function to safely set font properties
                function setFontProperty(cell, property, value) {
                    if (!cell.font) {
                        cell.font = {};
                    }
                    cell.font[property] = value;
                }

                // Tính số lượng worksheet cần tạo
                const attColumnCount = 45; // Tổng số cột ATT
                const attPerSheet = 9; // Số cột ATT trên mỗi trang
                const sheetCount = Math.ceil(attColumnCount / attPerSheet);

                // Function to create a deep copy of a worksheet
                // Đổi tên sheet đầu tiên
                worksheet.name = dt_m[0].PO_NO;
                function createWorksheetCopy(sourceWorksheet, newName) {
                    const newWorksheet = workbook.addWorksheet(newName);

                    // Copy worksheet properties
                    newWorksheet.properties = JSON.parse(JSON.stringify(sourceWorksheet.properties));
                    newWorksheet.properties.tabColor = sourceWorksheet.properties.tabColor;

                    // Copy column properties and widths
                    sourceWorksheet.columns.forEach((col, index) => {
                        const newCol = newWorksheet.getColumn(index + 1);
                        newCol.width = col.width;
                        newCol.hidden = col.hidden;
                        newCol.outlineLevel = col.outlineLevel;
                    });

                    // Copy row properties and cell contents
                    sourceWorksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
                        const newRow = newWorksheet.getRow(rowNumber);
                        newRow.height = row.height;
                        newRow.hidden = row.hidden;
                        newRow.outlineLevel = row.outlineLevel;

                        row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                            const newCell = newRow.getCell(colNumber);
                            newCell.value = cell.value;
                            newCell.style = JSON.parse(JSON.stringify(cell.style));
                            if (cell.dataValidation) {
                                newCell.dataValidation = JSON.parse(JSON.stringify(cell.dataValidation));
                            }
                        });

                        // Ensure the row is committed to the worksheet
                        newRow.commit();
                    });

                    // Copy merged cells
                    if (sourceWorksheet._merges) {
                        if (sourceWorksheet._merges instanceof Map) {
                            sourceWorksheet._merges.forEach((value, key) => {
                                newWorksheet.mergeCells(key);
                            });
                        } else if (typeof sourceWorksheet._merges === 'object') {
                            Object.keys(sourceWorksheet._merges).forEach(key => {
                                newWorksheet.mergeCells(sourceWorksheet._merges[key]);
                            });
                        } else if (Array.isArray(sourceWorksheet._merges)) {
                            sourceWorksheet._merges.forEach(merge => {
                                newWorksheet.mergeCells(merge);
                            });
                        }
                    }

                    // Ensure all worksheets have the same number of rows and columns
                    const maxRow = sourceWorksheet.rowCount;
                    const maxCol = sourceWorksheet.columnCount;
                    newWorksheet.pageSetup = JSON.parse(JSON.stringify(sourceWorksheet.pageSetup));
                    newWorksheet.views = sourceWorksheet.views;

                    // Add any missing rows or columns
                    for (let i = 1; i <= maxRow; i++) {
                        if (!newWorksheet.getRow(i).hasValues) {
                            newWorksheet.getRow(i).height = sourceWorksheet.getRow(i).height;
                        }
                    }
                    for (let i = 1; i <= maxCol; i++) {
                        if (!newWorksheet.getColumn(i).width) {
                            newWorksheet.getColumn(i).width = sourceWorksheet.getColumn(i).width;
                        }
                    }

                    // Copy print area and page setup
                    if (sourceWorksheet.pageSetup && sourceWorksheet.pageSetup.printArea) {
                        newWorksheet.pageSetup.printArea = sourceWorksheet.pageSetup.printArea;
                    }


                    return newWorksheet;
                }



                //=============tạo header cho từng sheet====================//
                let worksheets = [worksheet];
                var cnt_lot_no1 = dt_m2[0].CNT_LOT_NO;
                var sheet_name = dt_m[0].PO_NO;

                for (let i = 0; i < cnt_lot_no1; i++) {
                    let sheetName = i === 0 ? sheet_name : `${sheet_name}(${i + 1})`;
                    let currentWorksheet = i === 0 ? worksheet : createWorksheetCopy(worksheet, sheetName);
                    if (i > 0) worksheets.push(currentWorksheet);

                    // Thêm số thứ tự vào hàng 11 và ATT vào hàng 12
                    var row11 = currentWorksheet.getRow(11);
                    var row12 = currentWorksheet.getRow(12);

                    for (let j = 0; j < 9; j++) {
                        let attIndex = i * 9 + j + 1;
                        let attField = `ATT${attIndex.toString().padStart(2, '0')}`;
                        let cell = row12.getCell(j + 5); // j + 5 để bắt đầu từ cột E (cột thứ 5)

                        // Kiểm tra nếu có giá trị ATT thì mới đánh số
                        if (dt_m2[0][attField]) {
                            // Đặt giá trị ATT vào hàng 12
                            cell.value = dt_m2[0][attField];
                            cell.font = {
                                bold: true,
                                size: 16
                            };
                            cell.alignment = {
                                vertical: 'middle',
                                horizontal: 'center',
                                wrapText: true
                            };

                            // Đặt số thứ tự vào hàng 11
                            let cell11 = row11.getCell(j + 5);
                            cell11.value = j + 1;  // Số thứ tự bắt đầu từ 1
                            cell11.font = {
                                bold: true,
                                size: 24,
                                color: { argb: 'FFFF0000' }
                            };
                            cell11.alignment = {
                                vertical: 'middle',
                                horizontal: 'center'
                            };
                        }
                    }
                }
                //=============tạo header cho từng sheet====================//
                //==============setpage=====================================//
                const setupExcelForA4Printing = (worksheet) => {
                    // Xác định vùng dữ liệu thực tế
                    const startColumn = 1; // Cột A
                    const endColumn = 20; // Cột T
                    let lastRow = 1;

                    // Tìm hàng cuối cùng có dữ liệu
                    for (let col = startColumn; col <= endColumn; col++) {
                        const column = worksheet.getColumn(col);
                        column.eachCell({ includeEmpty: false }, (cell) => {
                            lastRow = Math.max(lastRow, cell.row);
                        });
                    }
                    // Đặt vùng in cho toàn bộ dữ liệu
                    worksheet.pageSetup.printArea = `A1:T39`;
                    // Cấu hình trang để phù hợp với A4
                    worksheet.pageSetup.fitToPage = true;
                    // worksheet.pageSetup.scale = 65; 
                    worksheet.pageSetup.paperSize = 9; // 9 là mã cho giấy A4hỏ
                    worksheet.pageSetup.margins = {
                        left: 0.2,
                        right: 0,
                        top: 0,
                        bottom: 0,
                        header: 0,
                        footer: 0
                    };
                    // Đặt hướng giấy
                    worksheet.pageSetup.orientation = 'landscape';
                    // worksheet.pageSetup.printTitlesColumn = 'A:T';
                };
                //==============end setpage=====================================//


                // Xử lý dữ liệu cho từng worksheet
                worksheets.forEach((currentWorksheet, sheetIndex) => {
                    if (dt_m.length > 0) {
                        var row1 = currentWorksheet.getRow(1);
                        row1.getCell(1).value = dt_m[0].TITLE_NAME || '';
                        setFontProperty(row1.getCell(1), 'size', 24);
                        setFontProperty(row1.getCell(1), 'bold', true);
                        setFontProperty(row1.getCell(1), 'name', 'Rockwell Condensed');
                        row1.getCell(1).alignment = { vertical: "middle", horizontal: "left" };

                        var row2 = currentWorksheet.getRow(3);
                        row2.getCell(3).value = dt_m[0].FACTORY || '';
                        setFontProperty(row2.getCell(3), 'size', 16, 'bold', true);

                        var row3 = currentWorksheet.getRow(4);
                        row3.getCell(3).value = dt_m[0].ORDER_NO || '';
                        setFontProperty(row3.getCell(3), 'size', 16, 'bold', true);
                        row3.getCell(6).value = dt_m[0].INNER_BOX_CODE || '';
                        setFontProperty(row3.getCell(6), 'size', 16,);
                        setFontProperty(row3.getCell(6), 'bold', true);
                        var row4 = currentWorksheet.getRow(5);
                        row4.getCell(3).value = dt_m[0].DPO || '';
                        setFontProperty(row4.getCell(3), 'size', 16, 'bold', true);
                        row4.getCell(3).fill = {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: { argb: 'FFFF00' }  // Mã màu vàng
                        };

                        var row5 = currentWorksheet.getRow(6);
                        row5.getCell(3).value = dt_m[0].GENDER || '';
                        setFontProperty(row5.getCell(3), 'size', 16, 'bold', true);

                        var row7 = currentWorksheet.getRow(7);
                        row7.getCell(7).value = dt_m[0].ITEM_NAME || '';
                        setFontProperty(row7.getCell(7), 'size', 18);
                        setFontProperty(row7.getCell(7), 'bold', true);
                        setFontProperty(row7.getCell(7), 'name', 'Calibri');
                        row7.getCell(7).alignment = { vertical: "middle", horizontal: "left" };

                        var row8 = currentWorksheet.getRow(8);
                        row8.getCell(1).value = dt_m[0].PO_NO || '';
                        setFontProperty(row8.getCell(1), 'size', 32);
                        setFontProperty(row8.getCell(1), 'bold', true);
                        setFontProperty(row8.getCell(1), 'name', 'Calibri');
                        row8.getCell(1).alignment = { vertical: "middle", horizontal: "center" };

                        row8.getCell(7).value = dt_m[0].COLOR || '';
                        setFontProperty(row8.getCell(7), 'size', 18);
                        setFontProperty(row8.getCell(7), 'bold', true);
                        setFontProperty(row8.getCell(7), 'name', 'Calibri');
                        row8.getCell(7).alignment = { vertical: "middle", horizontal: "left" };

                        // var row9 = currentWorksheet.getRow(9);
                        // row9.getCell(7).value = dt_m[0].COLOR || '';
                        // setFontProperty(row9.getCell(7), 'size', 18);
                        // setFontProperty(row9.getCell(7), 'bold', true);
                        // setFontProperty(row9.getCell(7), 'name', 'Calibri');
                        // setFontProperty(row9.getCell(7), 'color', { argb: 'FFFF0000' });
                        // row9.getCell(7).alignment = { vertical: "middle", horizontal: "left" };

                        var row10 = currentWorksheet.getRow(10);
                        row10.getCell(7).value = dt_m[0].RETAIL_PRICE || '';
                        setFontProperty(row10.getCell(7), 'size', 18);
                        setFontProperty(row10.getCell(7), 'bold', true);
                        setFontProperty(row10.getCell(7), 'name', 'Calibri');
                        setFontProperty(row10.getCell(7), 'color', { argb: 'FFFF0000' });
                        row10.getCell(7).alignment = { vertical: "middle", horizontal: "left" };

                        currentWorksheet.mergeCells(total_dtl_pos, 7, total_dtl_pos, 10);
                        var rowDeli_date = currentWorksheet.getRow(total_dtl_pos);

                        rowDeli_date.height = 61.3;
                        setFontProperty(rowDeli_date.getCell(1), 'size', 24, 'bold', true);
                        setFontProperty(rowDeli_date.getCell(7), 'italic', false);
                        setFontProperty(rowDeli_date.getCell(7), 'bold', true);
                        setFontProperty(rowDeli_date.getCell(7), 'color', { argb: '000000' });
                        setFontProperty(rowDeli_date.getCell(7), 'size', 48);
                        setFontProperty(rowDeli_date.getCell(7), 'name', 'Calibri');
                        setFontProperty(rowDeli_date.getCell(3), 'bold', true);
                        setFontProperty(rowDeli_date.getCell(4), 'bold', true);
                        rowDeli_date.getCell(7).alignment = { vertical: "middle", horizontal: "center" };
                        rowDeli_date.getCell(7).value = dt_m[0].OGAC_DATE || '';

                        // Sửa lại vị trí merge cell
                        currentWorksheet.mergeCells(total_dtl_pos_2 + 1, 1, total_dtl_pos_2 + 1, 4);
                    }

                    var pos_dtl = 13;
                    var lastRow = pos_dtl + dt_m3.length - 1;

                    // Đặt chiều cao và font size cho tất cả các dòng trong vùng dữ liệu
                    for (var i = pos_dtl; i <= lastRow; i++) {
                        var row = currentWorksheet.getRow(i);
                        row.height = 25.7;

                        row.eachCell({ includeEmpty: true }, function (cell) {
                            cell.font = {
                                name: 'Calibri',
                                size: 16,
                                family: 2
                            };
                            cell.alignment = {
                                vertical: 'middle',
                                horizontal: 'center'
                            };
                        });
                    }

                    for (var i = 0; i < dt_m3.length; i++) {
                        var row = currentWorksheet.getRow(pos_dtl + i);

                        if (i < dt_m3.length - 1) {  // Xử lý các dòng chi tiết
                            // Đặt giá trị và font cho ô đầu tiên
                            const cell1 = row.getCell(1);
                            cell1.value = i + 1;
                            cell1.font = { name: 'Calibri', size: 16, family: 2 };
                            cell1.alignment = { vertical: 'middle', horizontal: 'center' };

                            // Merge ô và đặt alignment
                            // currentWorksheet.mergeCells(pos_dtl + i, 2, pos_dtl + i, 3);
                            // row.getCell(2).alignment = { vertical: 'middle', horizontal: 'center' };

                            // Đặt giá trị và font cho ô BARCODE
                            const cell2 = row.getCell(2);
                            cell2.value = dt_m3[i].BARCODE || '';
                            cell2.font = { name: 'Calibri', size: 16, family: 2 };
                            cell2.alignment = { vertical: 'middle', horizontal: 'center' };

                            // Đặt giá trị và font cho ô SIZE_CODE
                            const cell4 = row.getCell(4);
                            cell4.value = dt_m3[i].SIZE_CODE || '';
                            cell4.font = { name: 'Calibri', size: 16, family: 2 };


                            for (let j = 0; j < attPerSheet; j++) {
                                const attIndex = sheetIndex * attPerSheet + j + 1;
                                if (attIndex <= attColumnCount) {
                                    const attValue = dt_m3[i][`ATT${attIndex.toString().padStart(2, '0')}`];
                                    const cell = row.getCell(j + 5);
                                    cell.value = attValue !== undefined && attValue !== null ? attValue : '';
                                    cell.font = { name: 'Calibri', size: 16, family: 2 };
                                    cell.alignment = { vertical: 'middle', horizontal: 'center' };
                                }
                            }

                            // Thêm công thức tính tổng cho cột 14 (tổng từ cột 5 đến 13)
                            let sumFormula = `SUM(E${pos_dtl + i}:M${pos_dtl + i})`;
                            // console.log(`Hàng ${pos_dtl + i}, Cột 14: Áp dụng công thức ${sumFormula}`);
                            try {
                                row.getCell(14).value = { formula: sumFormula };
                                row.getCell(14).numFmt = '0;-0;;@';
                            } catch (error) {
                                console.error(`Error setting formula for row ${pos_dtl + i}, column N:`, error);
                                row.getCell(14).value = null;
                            }

                            // Đặt giá trị, font và alignment cho các cột từ 14 đến 20
                            for (let col = 14; col <= 20; col++) {
                                const cell = row.getCell(col);
                                cell.font = { name: 'Calibri', size: 16, family: 2 };
                                cell.alignment = { vertical: 'middle', horizontal: 'center' };

                                switch (col) {
                                    case 14:
                                        // Đã xử lý ở trên
                                        break;
                                    case 15:
                                        cell.value = dt_m3[i].G_TOTAL || '';
                                        break;
                                    case 16:
                                        cell.value = dt_m3[i].LOSS || '';
                                        break;
                                    case 17:
                                        cell.value = dt_m3[i].EXTRA || '';
                                        break;
                                    case 18:
                                        cell.value = dt_m3[i].PRINTED_NO || '';
                                        break;
                                    case 19:
                                        cell.value = dt_m3[i].REMAIN || '';
                                        break;
                                    case 20:
                                        cell.value = dt_m3[i].PRINTED_TIME || '';
                                        break;
                                }

                                // Nếu là giá trị số, đặt định dạng số
                                if (col !== 20) {
                                    // cell.numFmt = '#,##0';
                                }
                            }
                        } else {  // Xử lý dòng tổng cộng
                            // console.log("Xử lý dòng tổng cộng");
                            row.getCell(1).value = 'TOTAL';
                            row.getCell(1).font = { ...row.getCell(1).font, size: 16, bold: true };
                            row.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };

                            // Xử lý các cột từ 5 đến 13
                            for (let col = 5; col <= 13; col++) {
                                let colLetter = String.fromCharCode(64 + col);
                                let formulaText = `SUM(${colLetter}${pos_dtl}:${colLetter}${lastRow - 1})`;
                                // console.log(`Cột ${col}: Áp dụng công thức ${formulaText}`);
                                try {
                                    row.getCell(col).value = { formula: formulaText };
                                    row.getCell(col).numFmt = '0;-0;;@';
                                } catch (error) {
                                    console.error(`Error setting formula for column ${colLetter}:`, error);
                                    row.getCell(col).value = null;
                                }
                                row.getCell(col).font = { size: 16 };
                            }

                            // Xử lý cột 14 (tổng từ cột 5 đến 13)
                            let sumFormula = `SUM(N${pos_dtl}:N${lastRow - 1})`;
                            // console.log(`Cột 14 (Tổng cộng): Áp dụng công thức ${sumFormula}`);
                            try {
                                row.getCell(14).value = { formula: sumFormula };
                                row.getCell(14).numFmt = '0;-0;;@';
                            } catch (error) {
                                console.error(`Error setting formula for column N:`, error);
                                row.getCell(14).value = null;
                            }
                            row.getCell(14).font = { size: 16 };

                            // Xử lý các cột từ 15 đến 20
                            for (let col = 15; col <= 20; col++) {
                                if (col >= 15 && col <= 18) {
                                    let colLetter = String.fromCharCode(64 + col);
                                    let formulaText = `SUM(${colLetter}${pos_dtl}:${colLetter}${lastRow - 1})`;
                                    // console.log(`Cột ${col}: Áp dụng công thức ${formulaText}`);
                                    try {
                                        row.getCell(col).value = { formula: formulaText };
                                        row.getCell(col).numFmt = '0;-0;;@';
                                    } catch (error) {
                                        console.error(`Error setting formula for column ${colLetter}:`, error);
                                        row.getCell(col).value = null;
                                    }
                                } else {
                                    row.getCell(col).value = dt_m3[i][`COL${col}`] || null;
                                }
                                row.getCell(col).font = { size: 16 };
                            }
                        }
                    } var pos_01 = 13;
                    for (var i = 0; i <= dt_m3.length - 1; i++) {
                        var row = currentWorksheet.getRow(pos_01 + i);
                        if ((i) % 2 != 0 && i < dt_m3.length - 1) {
                            for (let k = 1; k <= 20; k++) {
                                const cell = row.getCell(k);
                                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: 'FFCC99' } };
                                cell.alignment = { vertical: 'middle', horizontal: 'center' };

                                // Thêm đường viền cho tất cả các dòng
                                if (k === 1) {
                                    cell.border = { ...cell.border, left: { style: 'medium', color: 'black' } };
                                }
                                if (k === 19) {
                                    cell.border = { ...cell.border, left: { style: 'medium', color: 'black' }, right: { style: 'medium', color: 'black' } };
                                }
                                if (k === 20) {
                                    cell.border = { ...cell.border, right: { style: 'medium', color: 'black' } };
                                }
                            }
                        } else {
                            if (i == dt_m3.length - 1) {
                                for (let k2 = 1; k2 <= 20; k2++) {
                                    const cell = row.getCell(k2);
                                    cell.border = {
                                        top: { style: 'medium', color: 'black' },
                                        left: { style: 'medium', color: 'black' },
                                        bottom: { style: 'medium', color: 'black' },
                                        right: { style: 'medium', color: 'black' }
                                    };
                                    cell.alignment = { vertical: 'middle', horizontal: 'center' };
                                    cell.font = { ...cell.font, bold: true };
                                }
                            } else {
                                for (let k3 = 1; k3 <= 20; k3++) {
                                    const cell = row.getCell(k3);
                                    cell.alignment = { vertical: 'middle', horizontal: 'center' };

                                    // Thêm đường viền cho tất cả các dòng
                                    if (k3 === 1) {
                                        cell.border = { ...cell.border, left: { style: 'medium', color: 'black' } };
                                    }
                                    if (k3 === 19) {
                                        cell.border = { ...cell.border, left: { style: 'medium', color: 'black' }, right: { style: 'medium', color: 'black' } };
                                    }
                                    if (k3 === 20) {
                                        cell.border = { ...cell.border, right: { style: 'medium', color: 'black' } };
                                    }
                                }
                            }
                        }
                    }
                    // Apply A4 print setup
                    setupExcelForA4Printing(currentWorksheet);

                    //end set up A4//

                });


                /********* Print file excel ********/
                const reportFile = Helpers.tmpPath(file_new);
                await workbook.xlsx.writeFile(reportFile);
                return response.attachment(reportFile, file_new)
            }
        }
        catch (e) {
            // console.log(e)
            return response.send(Utils.response(false, e.message, null))
        }
    }

    //----------------------end--rptswsoNK120-- sale order battle----------------//
    //-----------------------rptswnk130 sedure------------------------------------//
    async rptswsoNK130({ request, response, auth }) {
        try {
            /****************************** Get Param *********************************/
            let { para } = request.get(['para']);
            /********* Parse param to json ********/
            var item = JSON.parse(para);
            const user = await auth.getUser();
            const p_crt_by = user.USER_ID;
            const p_language = request.header("accept-language", "ENG");

            var file_nm = [item.P_FILE_NAME_NEW];
            var file_type = ".xlsx";
            var full_nm = file_nm + file_type;
            var file_new = file_nm + p_crt_by + file_type;
            var _resourcesPath = "report/sw/nk" + '/' + "rpt_swnk030_barcode_detail_v01.xlsx";
            var _store = "SZ_SEL_SWNK130_EXPORT_MST_NOCACHE";
            var _store2 = "SZ_SEL_SWNK130_EXPORT_H_NOCACHE";
            var _store3 = "SZ_SEL_SWNK130_EXPORT_NOCACHE";
            var _param = [item.p_company_pk, item.p_PartnerCD_NM, item.p_AccCD_NM, item.p_AccountType, item.p_month, item.p_factory_pk, item.p_month_to];

            /***************************** Return failed ****************************/
            if (!user) {
                return response.send(Utils.response(false, "Request failed!", null));
            }
            /****************************** Begin call store and write excel *********/
            else {
                /********* Call store  ***************/
                var dt_m = await DBService.callProcCursor(_store, _param, p_language, p_crt_by);
                var dt_m2 = await DBService.callProcCursor(_store2, _param, p_language, p_crt_by);
                var dt_m3 = await DBService.callProcCursor(_store3, _param, p_language, p_crt_by);

                const total_dtl_pos = dt_m3.length + 14;
                const total_dtl_pos_2 = dt_m3.length + 11;

                /********* Read file excel ********/
                const templateFile = Helpers.resourcesPath(_resourcesPath);
                await workbook.xlsx.readFile(templateFile);
                var worksheet = workbook.getWorksheet(1);
                //ham ke o
                function mergeCellsAndAddBorders(range) {
                    try {
                        // worksheet.mergeCells(range); // This line has been removed as requested
                        const [startCell, endCell] = range.split(':');
                        worksheet.getCell(startCell).border = {
                            top: { style: 'medium', color: { argb: 'FF000000' } },
                            left: { style: 'medium', color: { argb: 'FF000000' } },
                            bottom: { style: 'medium', color: { argb: 'FF000000' } },
                            right: { style: 'medium', color: { argb: 'FF000000' } }

                        };
                        // console.log(`Successfully bordered: ${range}`);
                    } catch (error) {
                        console.error(`Error processing range ${range}: ${error.message}`);
                    }
                }


                // Add labels to specified cells
                const cellValues = {
                    'A3': 'FACTORY:', 'A4': 'ORDER NO:', 'A5': 'DPO:', 'A6': 'GENDER:',
                    'A7': 'STYLE & COLOR', 'B11': 'BARCODE', 'D11': 'SIZE', 'L4': 'Printed date',
                    'L5': 'Shift', 'L6': 'Shift B', 'N4': 'Date………………………………………………',
                    'N5': "User's name & Machine's  name ", 'R5': 'Pager size', 'T5': 'Roll no',
                    'R6': '12*1000', 'L4': '0.2', 'M10': 'REMEMBER TO PRINT FROM SMALL SIZE --> BIG SIZE !!',
                    'N11': 'TOTAL_QTY', 'O11': 'G_TOTAL', 'P11': 'LOSS_QTY', 'Q11': 'EXTRA_QTY', 'R11': 'PRINTED_NO',
                    'S11': 'REMAIN', 'T11': 'PRINTED_TIME', 'E7': 'STYLE NAME', 'E8': 'ENLISH COLOR', 'E9': 'FRANCE COLOR', 'E10': 'RETAIL PRICE', 'A11': 'No',
                    'P8': 'PO NO', 'P9': 'SEASON'
                };

                Object.entries(cellValues).forEach(([cellAddress, value]) => {
                    const cell = worksheet.getCell(cellAddress);
                    cell.value = value;

                    if (['A3', 'A4', 'A5', 'A6'].includes(cellAddress)) {
                        cell.font = { bold: false, size: 12 };
                        cell.alignment = { vertical: 'middle', horizontal: 'left' };
                    } else if (['A7', 'L5', 'L6', 'L4', 'T5'].includes(cellAddress)) {
                        cell.font = { size: 16, bold: true };
                        cell.alignment = { vertical: 'middle', horizontal: 'center' };
                    } else if (cellAddress === 'M10') {
                        cell.font = { size: 14, color: { argb: 'FFFF0000' } };
                        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF00' } };
                        cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
                    } else if (cellAddress === 'C5') {
                        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF00' } };
                        cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
                    } else if (['N11', 'O11', 'P11', 'Q11', 'R11', 'S11', 'T11'].includes(cellAddress)) {
                        cell.font = { size: 12, bold: true };
                        cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
                    } else if (['E7', 'E8', 'E9', 'E10'].includes(cellAddress)) {
                        cell.font = { size: 18, bold: true };
                        cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
                        // } else if (['P12', 'Q12'].includes(cellAddress)) {
                        //     cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF00' } };
                        //     cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
                    }
                    else {
                        cell.font = { size: 14, bold: true };
                        cell.alignment = { vertical: 'middle', horizontal: 'center' };
                    }
                });

                // Add borders to specified ranges
                const rangesToBorder = [
                    'L4:M4', 'L5:M5', 'L6:M7',
                    'N4:T4', 'N5:Q5', 'R5:S5', 'N6:Q7', 'R6:S7', 'T6:T7', 'A7:D7',
                    'E7:F7', 'G7:K7', 'A8:D10', 'E8:F8', 'E9:F9', 'E10:F10', 'G8:O8',
                    'P8:Q8', 'R8:T8', 'G9:T9', 'G10:J10', 'K10:L10', 'M10:T10', 'B11:C11',
                    'T5', 'D11:T11',

                ];


                rangesToBorder.forEach(range => mergeCellsAndAddBorders(range));

                // Thêm đường kẻ dọc cho S12 và T12
                ['S12', 'T12'].forEach(cellAddress => {
                    const cell = worksheet.getCell(cellAddress);
                    cell.border = {
                        ...cell.border,
                        left: { style: 'medium' },
                        right: { style: 'medium' }
                    };
                });

                ///them đường kẻ từ A11 đến T12
                for (let row = 11; row <= 12; row++) {
                    // Xử lý cột A đặc biệt
                    worksheet.getCell(`A${row}`).border = {
                        top: { style: 'medium' },
                        left: { style: 'medium' },
                        bottom: { style: 'medium' },
                        right: { style: 'medium' }
                    };

                    // Xử lý các cột B đến T
                    for (let col = 'B'; col <= 'T'; col = String.fromCharCode(col.charCodeAt(0) + 1)) {
                        worksheet.getCell(`${col}${row}`).border = {
                            top: { style: 'medium' },
                            bottom: { style: 'medium' },
                            right: { style: 'medium' }
                        };
                    }
                }


                // Điều chỉnh độ rộng của các cột từ A đến T
                const columnWidths = {
                    A: 6.22, B: 22.78, C: 9.33, D: 9.67, E: 16.22,
                    F: 16.22, G: 12, H: 12, I: 12, J: 12,
                    K: 12, L: 12, M: 13.11, N: 13.22, O: 13.22,
                    P: 12.44, Q: 12.44, R: 12.44, S: 9.11, T: 9.11
                };
                const rowHeights = {
                    11: 42, 12: 42
                };

                // Đặt chiều rộng cột
                Object.entries(columnWidths).forEach(([col, width]) => {
                    worksheet.getColumn(col).width = width;
                });

                // Đặt chiều cao hàng
                Object.entries(rowHeights).forEach(([row, height]) => {
                    worksheet.getRow(parseInt(row)).height = height;
                });
                //======== end ham ke o=========================================

                worksheet.mergeCells('A1:P2');
                worksheet.mergeCells('A3:B3');
                worksheet.mergeCells('A4:B4');
                worksheet.mergeCells('A6:B6');
                worksheet.mergeCells('L4:M4');
                worksheet.mergeCells('L5:M5');
                worksheet.mergeCells('L6:M7');
                worksheet.mergeCells('N4:T4');
                worksheet.mergeCells('N5:Q5');
                worksheet.mergeCells('R5:S5');
                worksheet.mergeCells('N6:Q7');
                worksheet.mergeCells('R6:S7');
                worksheet.mergeCells('T6:T7');
                worksheet.mergeCells('A7:D7');
                worksheet.mergeCells('E7:F7');
                worksheet.mergeCells('G7:K7');
                worksheet.mergeCells('A8:D10');
                worksheet.mergeCells('E8:F8');
                worksheet.mergeCells('E9:F9');
                worksheet.mergeCells('E10:F10');
                worksheet.mergeCells('G8:O8');
                worksheet.mergeCells('P8:Q8');
                worksheet.mergeCells('R8:T8');
                worksheet.mergeCells('G9:O9');
                worksheet.mergeCells('G10:J10');
                worksheet.mergeCells('K10:L10');
                worksheet.mergeCells('M10:T10');
                worksheet.mergeCells('B11:C12');  // Giữ lại cái này
                worksheet.mergeCells('A11:A12');  // Xóa cái này vì xung đột
                worksheet.mergeCells('D11:D12');
                worksheet.mergeCells('N11:N12');
                worksheet.mergeCells('O11:O12');
                worksheet.mergeCells('P11:P12');
                worksheet.mergeCells('Q11:Q12');
                worksheet.mergeCells('R11:R12');
                worksheet.mergeCells('S11:S12');
                worksheet.mergeCells('T11:T12');
                worksheet.mergeCells('P9:Q9');
                worksheet.mergeCells('R9:T9');
                worksheet.getCell('P11').fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFFF9900' }  // Màu vàng
                };

                worksheet.getCell('Q11').fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFFF9900' }  // Màu vàng
                };
                // const mercellranges = ['A1:P2', 'A3:B3', 'A4:B4', 'A6:B6', 'L4:M4', 'L5:M5', 'L6:M7', 'N4:T4', 'N5:Q5', 'R5:S5', 'N6:Q7',
                //     'R6:S7', 'T6:T7', 'A7:D7', 'E7:F7', 'G7:K7', 'A8:D10', 'E8:F8', 'E9:F9', 'E10:F10', 'G8:O8', 'P8:Q8', 'R8:T8', 'G9:T9', 'G10:J10',
                //     'K10:L10', 'M10:T10', 'B11:C11',];
                // mercellranges.forEach(range => worksheet.mergeCells(range));
                // Helper function to safely set font properties
                function setFontProperty(cell, property, value) {
                    if (!cell.font) {
                        cell.font = {};
                    }
                    cell.font[property] = value;
                }

                // Tính số lượng worksheet cần tạo
                const attColumnCount = 45; // Tổng số cột ATT
                const attPerSheet = 9; // Số cột ATT trên mỗi trang
                const sheetCount = Math.ceil(attColumnCount / attPerSheet);

                // Function to create a deep copy of a worksheet
                // Đổi tên sheet đầu tiên
                worksheet.name = dt_m[0].PO_NO;
                function createWorksheetCopy(sourceWorksheet, newName) {
                    const newWorksheet = workbook.addWorksheet(newName);

                    // Copy worksheet properties
                    newWorksheet.properties = JSON.parse(JSON.stringify(sourceWorksheet.properties));
                    newWorksheet.properties.tabColor = sourceWorksheet.properties.tabColor;

                    // Copy column properties and widths
                    sourceWorksheet.columns.forEach((col, index) => {
                        const newCol = newWorksheet.getColumn(index + 1);
                        newCol.width = col.width;
                        newCol.hidden = col.hidden;
                        newCol.outlineLevel = col.outlineLevel;
                    });

                    // Copy row properties and cell contents
                    sourceWorksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
                        const newRow = newWorksheet.getRow(rowNumber);
                        newRow.height = row.height;
                        newRow.hidden = row.hidden;
                        newRow.outlineLevel = row.outlineLevel;

                        row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                            const newCell = newRow.getCell(colNumber);
                            newCell.value = cell.value;
                            newCell.style = JSON.parse(JSON.stringify(cell.style));
                            if (cell.dataValidation) {
                                newCell.dataValidation = JSON.parse(JSON.stringify(cell.dataValidation));
                            }
                        });

                        // Ensure the row is committed to the worksheet
                        newRow.commit();
                    });

                    // Copy merged cells
                    if (sourceWorksheet._merges) {
                        if (sourceWorksheet._merges instanceof Map) {
                            sourceWorksheet._merges.forEach((value, key) => {
                                newWorksheet.mergeCells(key);
                            });
                        } else if (typeof sourceWorksheet._merges === 'object') {
                            Object.keys(sourceWorksheet._merges).forEach(key => {
                                newWorksheet.mergeCells(sourceWorksheet._merges[key]);
                            });
                        } else if (Array.isArray(sourceWorksheet._merges)) {
                            sourceWorksheet._merges.forEach(merge => {
                                newWorksheet.mergeCells(merge);
                            });
                        }
                    }

                    // Ensure all worksheets have the same number of rows and columns
                    const maxRow = sourceWorksheet.rowCount;
                    const maxCol = sourceWorksheet.columnCount;
                    newWorksheet.pageSetup = JSON.parse(JSON.stringify(sourceWorksheet.pageSetup));
                    newWorksheet.views = sourceWorksheet.views;

                    // Add any missing rows or columns
                    for (let i = 1; i <= maxRow; i++) {
                        if (!newWorksheet.getRow(i).hasValues) {
                            newWorksheet.getRow(i).height = sourceWorksheet.getRow(i).height;
                        }
                    }
                    for (let i = 1; i <= maxCol; i++) {
                        if (!newWorksheet.getColumn(i).width) {
                            newWorksheet.getColumn(i).width = sourceWorksheet.getColumn(i).width;
                        }
                    }

                    // Copy print area and page setup
                    if (sourceWorksheet.pageSetup && sourceWorksheet.pageSetup.printArea) {
                        newWorksheet.pageSetup.printArea = sourceWorksheet.pageSetup.printArea;
                    }


                    return newWorksheet;
                }



                //=============tạo header cho từng sheet====================//
                let worksheets = [worksheet];
                var cnt_lot_no1 = dt_m2[0].CNT_LOT_NO;
                var sheet_name = dt_m[0].PO_NO;

                for (let i = 0; i < cnt_lot_no1; i++) {
                    let sheetName = i === 0 ? sheet_name : `${sheet_name}(${i + 1})`;
                    let currentWorksheet = i === 0 ? worksheet : createWorksheetCopy(worksheet, sheetName);
                    if (i > 0) worksheets.push(currentWorksheet);

                    // Thêm số thứ tự vào hàng 11 và ATT vào hàng 12
                    var row11 = currentWorksheet.getRow(11);
                    var row12 = currentWorksheet.getRow(12);

                    for (let j = 0; j < 9; j++) {
                        let attIndex = i * 9 + j + 1;
                        let attField = `ATT${attIndex.toString().padStart(2, '0')}`;
                        let cell = row12.getCell(j + 5); // j + 5 để bắt đầu từ cột E (cột thứ 5)

                        // Kiểm tra nếu có giá trị ATT thì mới đánh số
                        if (dt_m2[0][attField]) {
                            // Đặt giá trị ATT vào hàng 12
                            cell.value = dt_m2[0][attField];
                            cell.font = {
                                bold: true,
                                size: 16
                            };
                            cell.alignment = {
                                vertical: 'middle',
                                horizontal: 'center',
                                wrapText: true
                            };

                            // Đặt số thứ tự vào hàng 11
                            let cell11 = row11.getCell(j + 5);
                            cell11.value = j + 1;  // Số thứ tự bắt đầu từ 1
                            cell11.font = {
                                bold: true,
                                size: 24,
                                color: { argb: 'FFFF0000' }
                            };
                            cell11.alignment = {
                                vertical: 'middle',
                                horizontal: 'center'
                            };
                        }
                    }
                }
                //=============tạo header cho từng sheet====================//
                //==============setpage=====================================//
                const setupExcelForA4Printing = (worksheet) => {
                    // Xác định vùng dữ liệu thực tế
                    const startColumn = 1; // Cột A
                    const endColumn = 20; // Cột T
                    let lastRow = 1;

                    // Tìm hàng cuối cùng có dữ liệu
                    for (let col = startColumn; col <= endColumn; col++) {
                        const column = worksheet.getColumn(col);
                        column.eachCell({ includeEmpty: false }, (cell) => {
                            lastRow = Math.max(lastRow, cell.row);
                        });
                    }
                    // Đặt vùng in cho toàn bộ dữ liệu
                    worksheet.pageSetup.printArea = `A1:T39`;
                    // Cấu hình trang để phù hợp với A4
                    worksheet.pageSetup.fitToPage = true;
                    // worksheet.pageSetup.scale = 65; 
                    worksheet.pageSetup.paperSize = 9; // 9 là mã cho giấy A4hỏ
                    worksheet.pageSetup.margins = {
                        left: 0.2,
                        right: 0,
                        top: 0,
                        bottom: 0,
                        header: 0,
                        footer: 0
                    };
                    // Đặt hướng giấy
                    worksheet.pageSetup.orientation = 'landscape';
                    // worksheet.pageSetup.printTitlesColumn = 'A:T';
                };
                //==============end setpage=====================================//


                // Xử lý dữ liệu cho từng worksheet
                worksheets.forEach((currentWorksheet, sheetIndex) => {
                    if (dt_m.length > 0) {
                        var row1 = currentWorksheet.getRow(1);
                        row1.getCell(1).value = dt_m[0].TITLE_NAME || '';
                        setFontProperty(row1.getCell(1), 'size', 24);
                        setFontProperty(row1.getCell(1), 'bold', true);
                        setFontProperty(row1.getCell(1), 'name', 'Rockwell Condensed');
                        row1.getCell(1).alignment = { vertical: "middle", horizontal: "left" };

                        var row2 = currentWorksheet.getRow(3);
                        row2.getCell(3).value = dt_m[0].FACTORY || '';
                        setFontProperty(row2.getCell(3), 'size', 16, 'bold', true);

                        var row3 = currentWorksheet.getRow(4);
                        // row3.getCell(3).value = dt_m[0].ORDER_NO || '';
                        // setFontProperty(row3.getCell(3), 'size', 16, 'bold', true);
                        row3.getCell(6).value = dt_m[0].INNER_BOX_CODE || '';
                        setFontProperty(row3.getCell(6), 'size', 16,);
                        setFontProperty(row3.getCell(6), 'bold', true);
                        var row4 = currentWorksheet.getRow(5);
                        row4.getCell(3).value = dt_m[0].DPO || '';
                        setFontProperty(row4.getCell(3), 'size', 16, 'bold', true);
                        row4.getCell(3).fill = {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: { argb: 'FFFF00' }  // Mã màu vàng
                        };

                        var row5 = currentWorksheet.getRow(6);
                        row5.getCell(3).value = dt_m[0].GENDER || '';
                        setFontProperty(row5.getCell(3), 'size', 16, 'bold', true);

                        var row7 = currentWorksheet.getRow(7);
                        row7.getCell(7).value = dt_m[0].ITEM_NAME || '';
                        setFontProperty(row7.getCell(7), 'size', 18);
                        setFontProperty(row7.getCell(7), 'bold', true);
                        setFontProperty(row7.getCell(7), 'name', 'Calibri');
                        row7.getCell(7).alignment = { vertical: "middle", horizontal: "left" };

                        var row8 = currentWorksheet.getRow(8);
                        row8.getCell(1).value = dt_m[0].PO_NO || '';
                        setFontProperty(row8.getCell(1), 'size', 32);
                        setFontProperty(row8.getCell(1), 'bold', true);
                        setFontProperty(row8.getCell(1), 'name', 'Calibri');
                        row8.getCell(1).alignment = { vertical: "middle", horizontal: "center" };

                        row8.getCell(7).value = dt_m[0].COLOR || '';
                        setFontProperty(row8.getCell(7), 'size', 18);
                        setFontProperty(row8.getCell(7), 'bold', true);
                        setFontProperty(row8.getCell(7), 'name', 'Calibri');
                        row8.getCell(7).alignment = { vertical: "middle", horizontal: "left" };

                        // var row9 = currentWorksheet.getRow(9);
                        // row9.getCell(7).value = dt_m[0].COLOR || '';
                        // setFontProperty(row9.getCell(7), 'size', 18);
                        // setFontProperty(row9.getCell(7), 'bold', true);
                        // setFontProperty(row9.getCell(7), 'name', 'Calibri');
                        // setFontProperty(row9.getCell(7), 'color', { argb: 'FFFF0000' });
                        // row9.getCell(7).alignment = { vertical: "middle", horizontal: "left" };

                        var row10 = currentWorksheet.getRow(10);
                        row10.getCell(7).value = dt_m[0].RETAIL_PRICE
                            ? parseFloat(dt_m[0].RETAIL_PRICE)  // Chuyển đổi RETAIL_PRICE thành số
                            : null;
                        row10.getCell(7).numFmt = '"$"#,##0.00'; // Hiển thị 2 chữ số thập phân
                        setFontProperty(row10.getCell(7), 'size', 18);
                        setFontProperty(row10.getCell(7), 'bold', true);
                        setFontProperty(row10.getCell(7), 'name', 'Calibri');
                        setFontProperty(row10.getCell(7), 'color', { argb: 'FFFF0000' });
                        row10.getCell(7).alignment = { vertical: "middle", horizontal: "left" };

                        currentWorksheet.mergeCells(total_dtl_pos, 7, total_dtl_pos, 10);
                        var rowDeli_date = currentWorksheet.getRow(total_dtl_pos);

                        rowDeli_date.height = 61.3;
                        setFontProperty(rowDeli_date.getCell(1), 'size', 24, 'bold', true);
                        setFontProperty(rowDeli_date.getCell(7), 'italic', false);
                        setFontProperty(rowDeli_date.getCell(7), 'bold', true);
                        setFontProperty(rowDeli_date.getCell(7), 'color', { argb: '000000' });
                        setFontProperty(rowDeli_date.getCell(7), 'size', 48);
                        setFontProperty(rowDeli_date.getCell(7), 'name', 'Calibri');
                        setFontProperty(rowDeli_date.getCell(3), 'bold', true);
                        setFontProperty(rowDeli_date.getCell(4), 'bold', true);
                        rowDeli_date.getCell(7).alignment = { vertical: "middle", horizontal: "center" };
                        rowDeli_date.getCell(7).value = dt_m[0].OGAC_DATE || '';

                        // Sửa lại vị trí merge cell
                        currentWorksheet.mergeCells(total_dtl_pos_2 + 1, 1, total_dtl_pos_2 + 1, 4);
                    }

                    var pos_dtl = 13;
                    var lastRow = pos_dtl + dt_m3.length - 1;

                    // Đặt chiều cao và font size cho tất cả các dòng trong vùng dữ liệu
                    for (var i = pos_dtl; i <= lastRow; i++) {
                        var row = currentWorksheet.getRow(i);
                        row.height = 25.7;

                        row.eachCell({ includeEmpty: true }, function (cell) {
                            cell.font = {
                                name: 'Calibri',
                                size: 16,
                                family: 2
                            };
                            cell.alignment = {
                                vertical: 'middle',
                                horizontal: 'center'
                            };
                        });
                    }

                    for (var i = 0; i < dt_m3.length; i++) {
                        var row = currentWorksheet.getRow(pos_dtl + i);

                        if (i < dt_m3.length - 1) {  // Xử lý các dòng chi tiết
                            // Đặt giá trị và font cho ô đầu tiên
                            const cell1 = row.getCell(1);
                            cell1.value = i + 1;
                            cell1.font = { name: 'Calibri', size: 16, family: 2 };
                            cell1.alignment = { vertical: 'middle', horizontal: 'center' };

                            // Merge ô và đặt alignment
                            // currentWorksheet.mergeCells(pos_dtl + i, 2, pos_dtl + i, 3);
                            // row.getCell(2).alignment = { vertical: 'middle', horizontal: 'center' };

                            // Đặt giá trị và font cho ô BARCODE
                            const cell2 = row.getCell(2);
                            cell2.value = dt_m3[i].BARCODE || '';
                            cell2.font = { name: 'Calibri', size: 16, family: 2 };
                            cell2.alignment = { vertical: 'middle', horizontal: 'center' };

                            // Đặt giá trị và font cho ô SIZE_CODE
                            const cell4 = row.getCell(4);
                            cell4.value = dt_m3[i].SIZE_CODE || '';
                            cell4.font = { name: 'Calibri', size: 16, family: 2 };


                            for (let j = 0; j < attPerSheet; j++) {
                                const attIndex = sheetIndex * attPerSheet + j + 1;
                                if (attIndex <= attColumnCount) {
                                    const attValue = dt_m3[i][`ATT${attIndex.toString().padStart(2, '0')}`];
                                    const cell = row.getCell(j + 5);
                                    cell.value = attValue !== undefined && attValue !== null ? attValue : '';
                                    cell.font = { name: 'Calibri', size: 16, family: 2 };
                                    cell.alignment = { vertical: 'middle', horizontal: 'center' };
                                }
                            }

                            // Thêm công thức tính tổng cho cột 14 (tổng từ cột 5 đến 13)
                            let sumFormula = `SUM(E${pos_dtl + i}:M${pos_dtl + i})`;
                            // console.log(`Hàng ${pos_dtl + i}, Cột 14: Áp dụng công thức ${sumFormula}`);
                            try {
                                row.getCell(14).value = { formula: sumFormula };
                                row.getCell(14).numFmt = '0;-0;;@';
                            } catch (error) {
                                console.error(`Error setting formula for row ${pos_dtl + i}, column N:`, error);
                                row.getCell(14).value = null;
                            }

                            // Đặt giá trị, font và alignment cho các cột từ 14 đến 20
                            for (let col = 14; col <= 20; col++) {
                                const cell = row.getCell(col);
                                cell.font = { name: 'Calibri', size: 16, family: 2 };
                                cell.alignment = { vertical: 'middle', horizontal: 'center' };

                                switch (col) {
                                    case 14:
                                        // Đã xử lý ở trên
                                        break;
                                    case 15:
                                        cell.value = dt_m3[i].G_TOTAL || '';
                                        break;
                                    case 16:
                                        cell.value = dt_m3[i].LOSS || '';
                                        break;
                                    case 17:
                                        cell.value = dt_m3[i].EXTRA || '';
                                        break;
                                    case 18:
                                        cell.value = dt_m3[i].PRINTED_NO || '';
                                        break;
                                    case 19:
                                        cell.value = dt_m3[i].REMAIN || '';
                                        break;
                                    case 20:
                                        cell.value = dt_m3[i].PRINTED_TIME || '';
                                        break;
                                }

                                // Nếu là giá trị số, đặt định dạng số
                                if (col !== 20) {
                                    // cell.numFmt = '#,##0';
                                }
                            }
                        } else {  // Xử lý dòng tổng cộng
                            // console.log("Xử lý dòng tổng cộng");
                            row.getCell(1).value = 'TOTAL';
                            row.getCell(1).font = { ...row.getCell(1).font, size: 16, bold: true };
                            row.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };

                            // Xử lý các cột từ 5 đến 13
                            for (let col = 5; col <= 13; col++) {
                                let colLetter = String.fromCharCode(64 + col);
                                let formulaText = `SUM(${colLetter}${pos_dtl}:${colLetter}${lastRow - 1})`;
                                // console.log(`Cột ${col}: Áp dụng công thức ${formulaText}`);
                                try {
                                    row.getCell(col).value = { formula: formulaText };
                                    row.getCell(col).numFmt = '0;-0;;@';
                                } catch (error) {
                                    console.error(`Error setting formula for column ${colLetter}:`, error);
                                    row.getCell(col).value = null;
                                }
                                row.getCell(col).font = { size: 16 };
                            }

                            // Xử lý cột 14 (tổng từ cột 5 đến 13)
                            let sumFormula = `SUM(N${pos_dtl}:N${lastRow - 1})`;
                            // console.log(`Cột 14 (Tổng cộng): Áp dụng công thức ${sumFormula}`);
                            try {
                                row.getCell(14).value = { formula: sumFormula };
                                row.getCell(14).numFmt = '0;-0;;@';
                            } catch (error) {
                                console.error(`Error setting formula for column N:`, error);
                                row.getCell(14).value = null;
                            }
                            row.getCell(14).font = { size: 16 };

                            // Xử lý các cột từ 15 đến 20
                            for (let col = 15; col <= 20; col++) {
                                if (col >= 15 && col <= 20) {
                                    let colLetter = String.fromCharCode(64 + col);
                                    let formulaText = `SUM(${colLetter}${pos_dtl}:${colLetter}${lastRow - 1})`;
                                    // console.log(`Cột ${col}: Áp dụng công thức ${formulaText}`);
                                    try {
                                        row.getCell(col).value = { formula: formulaText };
                                        row.getCell(col).numFmt = '0;-0;;@';
                                    } catch (error) {
                                        console.error(`Error setting formula for column ${colLetter}:`, error);
                                        row.getCell(col).value = null;
                                    }
                                } else {
                                    row.getCell(col).value = dt_m3[i][`COL${col}`] || null;
                                }
                                row.getCell(col).font = { size: 16 };
                            }
                        }
                    } var pos_01 = 13;
                    for (var i = 0; i <= dt_m3.length - 1; i++) {
                        var row = currentWorksheet.getRow(pos_01 + i);
                        if ((i) % 2 != 0 && i < dt_m3.length - 1) {
                            for (let k = 1; k <= 20; k++) {
                                const cell = row.getCell(k);
                                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: 'FFCC99' } };
                                cell.alignment = { vertical: 'middle', horizontal: 'center' };

                                // Thêm đường viền cho tất cả các dòng
                                if (k === 1) {
                                    cell.border = { ...cell.border, left: { style: 'medium', color: 'black' } };
                                }
                                if (k === 19) {
                                    cell.border = { ...cell.border, left: { style: 'medium', color: 'black' }, right: { style: 'medium', color: 'black' } };
                                }
                                if (k === 20) {
                                    cell.border = { ...cell.border, right: { style: 'medium', color: 'black' } };
                                }
                            }
                        } else {
                            if (i == dt_m3.length - 1) {
                                for (let k2 = 1; k2 <= 20; k2++) {
                                    const cell = row.getCell(k2);
                                    cell.border = {
                                        top: { style: 'medium', color: 'black' },
                                        left: { style: 'medium', color: 'black' },
                                        bottom: { style: 'medium', color: 'black' },
                                        right: { style: 'medium', color: 'black' }
                                    };
                                    cell.alignment = { vertical: 'middle', horizontal: 'center' };
                                    cell.font = { ...cell.font, bold: true };
                                }
                            } else {
                                for (let k3 = 1; k3 <= 20; k3++) {
                                    const cell = row.getCell(k3);
                                    cell.alignment = { vertical: 'middle', horizontal: 'center' };

                                    // Thêm đường viền cho tất cả các dòng
                                    if (k3 === 1) {
                                        cell.border = { ...cell.border, left: { style: 'medium', color: 'black' } };
                                    }
                                    if (k3 === 19) {
                                        cell.border = { ...cell.border, left: { style: 'medium', color: 'black' }, right: { style: 'medium', color: 'black' } };
                                    }
                                    if (k3 === 20) {
                                        cell.border = { ...cell.border, right: { style: 'medium', color: 'black' } };
                                    }
                                }
                            }
                        }
                    }
                    // Apply A4 print setup
                    setupExcelForA4Printing(currentWorksheet);

                    //end set up A4//

                });


                /********* Print file excel ********/
                const reportFile = Helpers.tmpPath(file_new);
                await workbook.xlsx.writeFile(reportFile);
                return response.attachment(reportFile, file_new)
            }
        }
        catch (e) {
            // console.log(e)
            return response.send(Utils.response(false, e.message, null))
        }
    }
    //----------------------end rptswnk130 sedure-----------------------------------//
    //-----------------------SWSO012 Haeinbackinglist------------------------------//


    async rptswso012_heain({ request, response, auth }) {
        try {
            let { para } = request.get(['para']);
            let paramData = typeof para[0] === 'string' ? JSON.parse(para[0]) : para[0];

            const user = await auth.getUser();
            const p_crt_by = user.USER_ID;
            const p_language = request.header("accept-language", "ENG");

            // Sửa lại đường dẫn template
            var _resourcesPath = "report/sw/so/SW_RPT_PAKING_LIST_HAEIN_SWSO012.xlsx";  // Sử dụng cùng template với hàm onReport()
            var _store = "SW_SEL_SWSO012";

            var _param = [
                paramData.dt_from || '',
                paramData.dt_to || '',
                paramData.txt_from_seq || '',
                paramData.txt_to_seq || '',
                paramData.selecteditemType || '',
                paramData.itemreporttype || null
            ];

            console.log('Final store params:', _param);

            if (!user) {
                return response.send(Utils.response(false, "Request failed!", null));
            }

            // Gọi store procedure
            var dt_m3 = await DBService.callProcCursor(_store, _param, p_language, p_crt_by);
            console.log('Store procedure result:', dt_m3?.length);

            if (!dt_m3 || dt_m3.length === 0) {
                return response.send(Utils.response(false, "No data found!", null));
            }

            // Kiểm tra file template tồn tại
            const templateFile = Helpers.resourcesPath(_resourcesPath);
            console.log('Template file path:', templateFile); // Log đường dẫn để kiểm tra

            const workbook = new Excel.Workbook();
            await workbook.xlsx.readFile(templateFile);
            var worksheet = workbook.getWorksheet(1);

            // Phần code điền dữ liệu giữ nguyên
            const startRow = 17;
            dt_m3.forEach((item, index) => {
                const currentRow = startRow + index;
                worksheet.getCell(`A${currentRow}`).value = item.RN;
                worksheet.getCell(`B${currentRow}`).value = item.ORDER_NM;
                worksheet.getCell(`C${currentRow}`).value = item.ITEM;
                worksheet.getCell(`D${currentRow}`).value = item.BRAND;
                worksheet.getCell(`E${currentRow}`).value = item.STYLE;
                worksheet.getCell(`F${currentRow}`).value = item.MODEL;
                worksheet.getCell(`G${currentRow}`).value = item.SIZE1;
                worksheet.getCell(`H${currentRow}`).value = item.QTY;

                ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].forEach(col => {
                    const cell = worksheet.getCell(`${col}${currentRow}`);
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                    cell.alignment = {
                        vertical: 'middle',
                        horizontal: 'center'
                    };
                });
            });

            const buffer = await workbook.xlsx.writeBuffer();
            return response.send(buffer);

        } catch (error) {
            console.error("Error in rptswso012_heain:", error);
            return response.status(500).send({
                error: error.message,
                stack: error.stack
            });
        }
    }
    //----------------end ----SWSO012 Haeinbackinglist------------------------------//
}

module.exports = rptswso420;