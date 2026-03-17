"use strict";
const Utils = use("Utils");
const Helpers = use("Helpers");
const AES = use("AES");
const Env = use("Env");
const fs = use("fs");
const DB_CONNECTION = Env.get("DB_CONNECTION");
const ROOT_DIR_FILES = Env.get("ROOT_DIR_FILES");
const APP_KEY = Env.get("APP_KEY");
const APP_URL_LOCAL = Env.get("APP_URL_LOCAL", Env.get("APP_URL"));
const oracledb = require("oracledb");
const DBService = use("DBService");
const ReportHelper = use("App/Helpers/ReportHelper");
var Excel = use('exceljs');
const { readFile } = require('fs/promises');
const { readFileSync } = require("fs");

const Request = use("Request");

class ReportController {
    async TestReport({ request, response, auth }) {
        var p_language = request.header("accept-language", "ENG");
        var p_crt_by = "";
        const user = await auth.getUser();
        if (user) {
            p_crt_by = user.USER_ID;
        }

        let { template, excel, doc, reporttype, convert, debug, _db2, rtnURL, model } = request.all();
        let report  = new ReportHelper();
        let url = await report.MakeReport(p_crt_by, p_language, template, excel, doc, "excel", convert, _db2);

        return response.send(url)

    }


    async MakeReport({ request, response, auth }) {
        try {
            var p_language = request.header("accept-language", "ENG");
            var p_crt_by = "";
            const user = await auth.getUser();
            if (user) {
                p_crt_by = user.USER_ID;
            }

            let { template, excel, doc, reporttype, convert, debug, _db2, rtnURL, model } = request.all();            
            let rptName = "";


            let callProcCursor = async (proc, params, param_extra, p_language, p_crt_by, _db2) => {
                let _params = [...params];
                let _param_extra = !!param_extra ? [...param_extra] : null;
                try {
                    for (let idx in _params) {
                        _params[idx] = _params[idx] == "null" || _params[idx] == undefined || _params[idx] == null ? "" : _params[idx];
                    }
                    if(!!_param_extra) {
                        for (let idx in _param_extra) {
                            _param_extra[idx] = _param_extra[idx] == "null" || _param_extra[idx] == undefined || _param_extra[idx] == null ? "" : _param_extra[idx];
                        }
                    }
                } catch (q) {}
                
                let result = null;
                try {
                    result = await DBService.callProcCursor(proc, _params, p_language, p_crt_by, _db2);
                }  catch (ex) {
                    console.log(ex.message);
                }

                if(!!result && result.length > 0 ) return result;

                //goi tiep neu co extra para (dung de them para site moi va tranh anh huong site cu)
                if(!!_param_extra && _param_extra.length > 0) {

                    Utils.Logger({ LVL: "error", MODULE: "ReportController", FUNC: "MakeReport", CONTENT: "Call Extra parameter " + _param_extra.join(', '), });

                    _params.push(..._param_extra);
                    result = await DBService.callProcCursor(proc, _params, p_language, p_crt_by, _db2);
                } 

                return result;
            }

            if (reporttype && reporttype === "word") {
                doc = JSON.parse(doc);
                let report = new ReportHelper(template, p_language, p_crt_by, "word", convert, debug);
                await report.loadFile();

                if (doc) {
                    let key = doc["KEY"];
                    let proc = doc["proc"];
                    let params = doc["params"];
                    let param_extra = doc["param_extra"];
                    let details = doc["details"];
                    let header = doc["header"];

                    let masterData = null;
                    let dataHeader = null;
                    let detailData = {};

                    //master data
                    let result = await callProcCursor(proc, params, param_extra, p_language, p_crt_by, _db2);

                    if (result) {
                        masterData = result;
                        dataHeader = result[0];
                    }

                    if (details) {
                        let tables = Object.keys(details);
                        const promises = tables.map(async(x) => {
                            let obj = details[x];

                            let proc2 = obj["proc"];
                            let param2 = obj["params"];
                            let param_extra2 = obj["param_extra"];

                            let result2 = await callProcCursor(proc2, param2, param_extra2, p_language, p_crt_by, _db2);

                            if (result2) {
                                detailData[x] = result2;
                            }
                        });
                        await Promise.all(promises);
                    }

                    if (header) {
                        let proc2 = header["proc"];
                        let param2 = header["params"];
                        let param_extra2 = header["param_extra"];
                        let data2 = header["data"];

                        if (!data2) {
                            let result2 = await callProcCursor(proc2, param2, param_extra2, p_language, p_crt_by, _db2);

                            if (result2) {
                                data2 = result2;
                            }
                        }

                        dataHeader = data2;
                    }

                    await report.fillData(masterData, detailData, key, dataHeader);
                }

                let rtnFile = await report.writeFile();
                return response.attachment(rtnFile, rptName);
            } else {
                excel = JSON.parse(excel);

                let report = new ReportHelper(template, p_language, p_crt_by, "excel", convert, debug);
                await report.loadFile();
                rptName = report.getFileName();

                let wait = (ms) => {
                    return new Promise(resolve => setTimeout(resolve, ms));
                }

                if (excel) {
                    const promises = excel.map(async(sheet,idx) => {
                        await wait(idx*1000);
                        const sheetIdx = sheet["sheet"];
                        const copySheet = sheet["copySheet"];
                        const insertHeader = sheet["insertHeader"];
                        const insertRange = sheet["insertRange"];
                        const insertRange2 = sheet["insertRange2"];
                        const insertRows = sheet["insertRows"];
                        const hideColumns = sheet["hideColumns"];
                        const insertImages = sheet["insertImages"];

                        let _sheet = report.setActiveSheet(sheetIdx);

                        if(_sheet == null || _sheet == undefined) return;

                        if (copySheet) {
                            const proc = sheet["proc"];
                            let params = sheet["params"];
                            let param_extra = sheet["param_extra"];
                            let data = sheet["data"]; //data custom like HEADER

                            if (!data) {
                                let result = await callProcCursor(proc, params, param_extra, p_language, p_crt_by, _db2);

                                if (result) {
                                    data = result;
                                }
                            }
                            report.copySheet(data);
                        }

                        //insertRange: data type: object {}
                        if (insertRange) {
                            const promises_insertRange = insertRange.map(async(r) => {
                                const range = r["range"];
                                const proc = r["proc"];
                                let params = r["params"];
                                let param_extra = r["param_extra"];
                                let data = r["data"]; //data custom like HEADER
                                const dateColumns = r["dateColumns"];
                                const stringColumns = r["stringColumns"];
                                const imageColumns = r["imageColumns"];
                                const imagePathColumns = r["imagePathColumns"];
                                const qrColumns = r["qrColumns"];

                                if (dateColumns) {
                                    report.setColumnType("date", dateColumns);
                                }
                                if (stringColumns) {
                                    report.setColumnType("string", stringColumns);
                                }
                                if (imageColumns) {
                                    report.setColumnType("image", imageColumns);
                                }
                                if (imagePathColumns) {
                                    report.setColumnType("imagePath", imagePathColumns);
                                }
                                if (qrColumns) {
                                    report.setColumnType("qr", qrColumns);
                                }

                                if (!data) {
                                    if (imageColumns) {
                                        if (DB_CONNECTION == "oracle") {
                                            oracledb.fetchAsBuffer = [oracledb.BLOB];
                                        }
                                    }

                                    let result = await callProcCursor(proc, params, param_extra, p_language, p_crt_by, _db2);

                                    if (result) {
                                        data = result[0];
                                    }
                                }
                                data = await report.buildData(data);
                                report.insertRange(range, data);
                            });

                            await Promise.all(promises_insertRange);
                        }

                        if (insertRange2) {
                            const promises_insertRange2 = insertRange2.map(async(r) => {
                                const range = r["range"];
                                const proc = r["proc"];
                                let params = r["params"];
                                let param_extra = r["param_extra"];
                                let dataStyle = null;
                                let data = r["data"]; //data custom like HEADER
                                const dateColumns = r["dateColumns"];
                                const stringColumns = r["stringColumns"];
                                const imageColumns = r["imageColumns"];
                                const imagePathColumns = r["imagePathColumns"];
                                const qrColumns = r["qrColumns"];
                                const procStyle = r["procStyle"];
                                const pageBreak = r["pageBreak"];
                                const dataPerPage = r["dataPerPage"];

                                const key = r["KEY"];
                                let _details = r["details"];
                                let _detailData = {};


                                if (dateColumns) {
                                    report.setColumnType("date", dateColumns);
                                }
                                if (stringColumns) {
                                    report.setColumnType("string", stringColumns);
                                }
                                if (imageColumns) {
                                    report.setColumnType("image", imageColumns);
                                }
                                if (imagePathColumns) {
                                    report.setColumnType("imagePath", imagePathColumns);
                                }
                                if (qrColumns) {
                                    report.setColumnType("qr", qrColumns);
                                }
                                if (pageBreak) {
                                    report.setColumnType("pageBreak", pageBreak);
                                    if(dataPerPage) {
                                        report.setColumnType("dataPerPage", dataPerPage);
                                    }
                                }

                                if (procStyle) {
                                    let result = await callProcCursor(procStyle, params, param_extra, p_language, p_crt_by, _db2);
                                    if (result) {
                                        dataStyle = result;
                                    }
                                }
                                if (!data) {
                                    if (imageColumns) {
                                        if (DB_CONNECTION == "oracle") {
                                            oracledb.fetchAsBuffer = [oracledb.BLOB];
                                        }
                                    }

                                    let result = await callProcCursor(proc, params, param_extra, p_language, p_crt_by, _db2);

                                    if (result) {
                                        data = result;
                                    }

                                    if(!!key) {
                                        if(!!_details ) {
                                            let tables = Object.keys(_details);
                                            const promises = tables.map(async(x) => {
                                                let obj = _details[x];
                    
                                                let proc2 = obj["proc"];
                                                let param2 = obj["params"];
                                                let param_extra2 = obj["param_extra"];
                                                const startRow2 = obj["startRow"];
                                                const subStyle2 = obj["subStyle"];
                                                const totalStyle2 = obj["totalStyle"];



                                                if (subStyle2) {
                                                    report.setColumnType("subStyle", subStyle2);
                                                }
                                                if (totalStyle2) {
                                                    report.setColumnType("totalStyle", totalStyle2);
                                                }
                    
                                                let result2 = await callProcCursor(proc2, param2, param_extra2, p_language, p_crt_by, _db2);
                    
                                                if (result2) {
                                                    _detailData[x] = { startRow: startRow2, data: result2 } ;
                                                }
                                            });
                                            await Promise.all(promises);
                                        }
                                    }
                                }

                                data = await report.buildData(data);

                                report.insertRange2(range, data, dataStyle, _detailData, key);
                            });

                            await Promise.all(promises_insertRange2);
                        }

                        if (insertHeader) {
                            let promises_insertHeader = insertHeader.map(async(r) => {
                                const startRow = r["startRow"];
                                const tempCol = r["column"];
                                const mergeStyle = r["merge"];
                                const proc = r["proc"];
                                let params = r["params"];
                                let param_extra = r["param_extra"];
                                let data = r["data"];


                                if (!data) {
                                    if (imageColumns) {
                                        if (DB_CONNECTION == "oracle") {
                                            oracledb.fetchAsBuffer = [oracledb.BLOB];
                                        }
                                    }
                                    let result = await callProcCursor(proc, params, param_extra, p_language, p_crt_by, _db2);

                                    if (result) {
                                        data = result;
                                    }
                                }
                                await report.insertHeader(startRow, tempCol, data, mergeStyle);
                            });

                            await Promise.all(promises_insertHeader);
                        }

                        //insertRows: data type: array object [ {}, {} ]
                        if (insertRows) {
                            let next = true;
                            let promises_insertRows = insertRows.map(async(r) => {
                                if (next) {
                                    const startRow = r["startRow"];
                                    const proc = r["proc"];
                                    let params = r["params"];
                                    let param_extra = r["param_extra"];
                                    let data = r["data"];
                                    const dateColumns = r["dateColumns"];
                                    const stringColumns = r["stringColumns"];
                                    const imageColumns = r["imageColumns"];
                                    const imagePathColumns = r["imagePathColumns"];
                                    const qrColumns = r["qrColumns"];
                                    const sequenceType = r["sequence"];
                                    const subStyle = r["subStyle"];
                                    const totalStyle = r["totalStyle"];
                                    const insBy = r["by"] ? r["by"] : "name";
                                    const tempCol = r["column"];
                                    const sumColumns = r["sumColumns"];

                                    const total = r["total"];

                                    if (dateColumns) {
                                        report.setColumnType("date", dateColumns);
                                    }
                                    if (stringColumns) {
                                        report.setColumnType("string", stringColumns);
                                    }
                                    if (imageColumns) {
                                        report.setColumnType("image", imageColumns);
                                    }
                                    if (imagePathColumns) {
                                        report.setColumnType("imagePath", imagePathColumns);
                                    }
                                    if (qrColumns) {
                                        report.setColumnType("qr", qrColumns);
                                    }
                                    if (sequenceType) {
                                        report.setColumnType("sequence", sequenceType);
                                    }
                                    if (subStyle) {
                                        report.setColumnType("subStyle", subStyle);
                                    }
                                    if (totalStyle) {
                                        report.setColumnType("totalStyle", totalStyle);
                                    }
                                    if (sumColumns) {
                                        report.setColumnType("sumColumns", sumColumns);
                                    }

                                    if (!data) {
                                        if (imageColumns) {
                                            if (DB_CONNECTION == "oracle") {
                                                oracledb.fetchAsBuffer = [oracledb.BLOB];
                                            }
                                        }
                                        let result = await callProcCursor(proc, params,param_extra, p_language, p_crt_by, _db2);

                                        if (result) {
                                            data = result;
                                        } else {
                                            next = false;
                                        }
                                    }
                                    data = await report.buildData(data);
                                    
                                    if (!total) {
                                        await report.insertRows(startRow, data, insBy, tempCol);
                                    } else {
                                        report.insertRowsWithTotal(startRow, data, total);
                                    }
                                }
                            });

                            await Promise.all(promises_insertRows).then((res) => {
                                if (next) return 1;
                                else return null;
                            });
                        }

                        if (insertImages) {
                            const rowAdded = insertImages["rowAdded"];
                            const rowAdded2 = insertImages["rowAdded2"];
                            const images = insertImages["images"];
                            let tmpRowAdded = 0;
                            if (!rowAdded) {
                                const promises_rows = rowAdded2.map(async(r) => {
                                    const proc = r["proc"];
                                    let params = r["params"];
                                    let param_extra = r["param_extra"];
                                    let data = r["data"];
                                    let multiple = r["multiple"] ? r["multiple"] : 1;

                                    if (!data) {
                                        let result = await callProcCursor(proc, params, param_extra, p_language, p_crt_by, _db2);
                                        if (result) {
                                            data = result;
                                        } else {
                                            data = [];
                                        }
                                    }

                                    return (data.length - 1) * multiple;
                                });

                                tmpRowAdded = await Promise.all(promises_rows).then(
                                    (values) => {
                                        return values.reduce((a, b) => a + b);
                                    }
                                );
                            } else {
                                tmpRowAdded = rowAdded;
                            }

                            if (images) {
                                let data = images["data"];
                                const proc = images["proc"];
                                let params = images["params"];
                                let param_extra = images["param_extra"];

                                if (!data) {
                                    if (DB_CONNECTION == "oracle") {
                                        oracledb.fetchAsBuffer = [oracledb.BLOB];
                                    }

                                    let result = await callProcCursor(proc, params, param_extra, p_language, p_crt_by, _db2);
                                    if (result) {
                                        data = result;
                                    }
                                }

                                report.insertImages(data, tmpRowAdded);
                            }
                        }
                        if (hideColumns) {
                            report.setHideColumns(hideColumns, true);
                        }
                    });
                    await Promise.all(promises);
                }
                let rtnFile = await report.writeFile()
                if (rtnURL == 'Y') {
                    const current = new Date();
                    const year = current.getFullYear()
                    let month = current.getMonth() + 1
                    let day = current.getDate()
                    if (day < 10) {
                        day = "0" + day
                    }
                    if (month < 10) {
                        month = "0" + month
                    }
                    const dir = ROOT_DIR_FILES + '/pdf/' + year + '/' + month
                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir, { recursive: true }, err => { console.log(err) })
                    }
                    const unixtime = Date.now()
                    const rtnFile2 = rtnFile.replace(/\\/g, '/')
                    const fileName = '/pdf/' + year + '/' + month + "/rpt-" + unixtime + "-" + (rtnFile2.split("/").pop())
                    const destinationFile = dir + "/rpt-" + unixtime + "-" + (rtnFile2.split("/").pop())
                    await Utils.copyFile(rtnFile, destinationFile)
                    let token = AES.encrypt(fileName + "|" + year + month + day, APP_KEY)
                    token = token.replace(/\+/g, 'p1L2u3S').replace(/\//g, 's1L2a3S4h').replace(/=/g, 'e1Q2u3A4l')
                    return response.send(APP_URL_LOCAL + "/api/dso/getfiletoken?file_name=" + fileName + "&token=" + token)
                } else {
                    return response.attachment(
                        rtnFile,
                        rptName // custom name
                    )
                }
            }
        } catch (e) {
            Utils.Logger({
                LVL: "error",
                MODULE: "ReportController",
                FUNC: "MakeReport",
                CONTENT: e.message,
            });
            return response.send(null);
        }
    }



    async MakeReport2({ request, response, auth }) {
        try {
            var p_language = request.header("accept-language", "ENG");
            var p_crt_by = "";
            const user = await auth.getUser();
            if (user) {
                p_crt_by = user.USER_ID;
            }

            let {  model, _db2, rtnURL } = request.all();
            let rtnFile = "";
            let rptName = "";

            if(model && !!model.PK ) {
                let params = [...model.para];
                let selectedPks = model.selected;
                let pro_master = "sys_sel_report_master";
                let pro_detail = "sys_sel_report_detail";
                try {
                    for (let idx in model.para) {
                        params[idx] = model.para[idx] == "null" || model.para[idx] == undefined || model.para[idx] == null ? "" : model.para[idx];
                    }
                } catch (q) {}

                if (DB_CONNECTION == "oracle") {
                    oracledb.fetchAsBuffer = [oracledb.BLOB];
                }

                let resultMaster = await DBService.callProcCursor(pro_master, [model.PK], p_language, p_crt_by, _db2);
                let resultDetail = await DBService.callProcCursor(pro_detail, [model.PK], p_language, p_crt_by, _db2);

                if(resultMaster) {
                    let data = resultMaster[0];
                    let report = new ReportHelper();

                    const checkUseData = data["USE_GRID_DATA"];
                    const checkUseSelected = data["TABLE_COLUMN_PK"];

                    if(checkUseData == 'N' && !!checkUseSelected) {
                        params.push(selectedPks);
                    }
                    
                    
                    await report.new( data.REPORT_NAME, data.DATA, p_crt_by, data.FILE_TYPE, data.CONVERT_TO);
                    await report.loadFile();
                    rptName = report.getFileName();



                    if(data.FILE_TYPE == 'xlsx') {

                        if(resultDetail && resultDetail.length > 0) {
                            const insertRange = resultDetail.filter( q => q["TYPE"] == 'RANGE');
                            const insertRange2 = resultDetail.filter( q => q["TYPE"] == 'RANGE2');
                            const insertRows = resultDetail.filter( q => q["TYPE"] == 'ROWS');

                            //test mac dinh sheet 1
                            report.setActiveSheet(1);

                            if(insertRange) {
                                const promises_insertRange = insertRange.map(async(r) => {
                                    const range = r["RANGE"];
                                    const proc = r["PROCEDURE"];
                                    const dateColumns = !!r["DATE_COLUMNS"] ? r["DATE_COLUMNS"].split(',') : null;
                                    const stringColumns = !!r["STRING_COLUMNS"] ? r["STRING_COLUMNS"].split(',') : null;
                                    const imageColumns = !!r["IMAGE_COLUMNS"] ? r["IMAGE_COLUMNS"].split(',') : null; 

                                    if (dateColumns) {
                                        report.setColumnType("date", dateColumns);
                                    }
                                    if (stringColumns) {
                                        report.setColumnType("string", stringColumns);
                                    }
                                    if (imageColumns) {
                                        report.setColumnType("image", imageColumns);
                                    }

                                    const use_data = r["USE_GRID_DATA"];
                                    const para = [...params];
                                    let data = {};

                                    if(use_data != 'Y') {
                                        //use pro data
                                        let result = await DBService.callProcCursor(proc, para, p_language, p_crt_by, _db2);
                                        if (result) {
                                            data = result[0];
                                        }
                                    } else {
                                        try {data = model.data[0]; } catch{}
                                    }
                                    
                                    report.insertRange(range, data);
                                });
                                await Promise.all(promises_insertRange);
                            }



                            if(insertRange2) {
                                const promises_insertRange2 = insertRange2.map(async(r) => {
                                    const range = r["RANGE"];
                                    const proc = r["PROCEDURE"];
                                    const dateColumns = !!r["DATE_COLUMNS"] ? r["DATE_COLUMNS"].split(',') : null;
                                    const stringColumns = !!r["STRING_COLUMNS"] ? r["STRING_COLUMNS"].split(',') : null;
                                    const imageColumns = !!r["IMAGE_COLUMNS"] ? r["IMAGE_COLUMNS"].split(',') : null; 

                                    if (dateColumns) {
                                        report.setColumnType("date", dateColumns);
                                    }
                                    if (stringColumns) {
                                        report.setColumnType("string", stringColumns);
                                    }
                                    if (imageColumns) {
                                        report.setColumnType("image", imageColumns);
                                    }

                                    const use_data = r["USE_GRID_DATA"];
                                    const para = [...params];
                                    let data = {};

                                    if(use_data != 'Y') {
                                        //use pro data
                                        let result = await DBService.callProcCursor(proc, para, p_language, p_crt_by, _db2);
                                        if (result) {
                                            data = result;
                                        }
                                    } else {
                                        try {data = model.data; } catch{}
                                    }
                                    
                                    report.insertRange2(range, data);
                                });
                                await Promise.all(promises_insertRange2);
                            }


                            if(insertRows) {
                                const promises_insertRows = insertRows.map(async(r) => {
                                    const startRow = r["START_ROW"];
                                    const proc = r["PROCEDURE"];
                                    const insBy = r["INSERT_TYPE"] ? r["INSERT_TYPE"] : "name";
                                    const dateColumns = !!r["DATE_COLUMNS"] ? r["DATE_COLUMNS"].split(',') : null;
                                    const stringColumns = !!r["STRING_COLUMNS"] ? r["STRING_COLUMNS"].split(',') : null;
                                    const imageColumns = !!r["IMAGE_COLUMNS"] ? r["IMAGE_COLUMNS"].split(',') : null; 

                                    if (dateColumns) {
                                        report.setColumnType("date", dateColumns);
                                    }
                                    if (stringColumns) {
                                        report.setColumnType("string", stringColumns);
                                    }
                                    if (imageColumns) {
                                        report.setColumnType("image", imageColumns);
                                    }

                                    const use_data = r["USE_GRID_DATA"];
                                    const para = [...params];
                                    let data = {};

                                    if(use_data != 'Y') {
                                        //use pro data
                                        let result = await DBService.callProcCursor(proc, para, p_language, p_crt_by, _db2);
                                        if (result) {
                                            data = result;
                                        }
                                    } else {
                                        try {data = model.data; } catch{}
                                    }
                                    
                                    report.insertRows(startRow, data, insBy);
                                });
                                await Promise.all(promises_insertRows);
                            }
                            
                        }

                        rtnFile = await report.writeFile();
                        
                    } else if(data.FILE_TYPE == 'docx') {
                        let key = "";
                        let proc = data["PROCEDURE"];
                        const use_data = data["USE_GRID_DATA"];

                        let masterData = null;
                        let dataHeader = null;
                        let detailData = {};
                        

                        if(use_data != 'Y') {
                            //master data
                            let result = await DBService.callProcCursor(proc, params, p_language, p_crt_by, _db2);
                            if (result) {
                                masterData = result;
                                dataHeader = result[0];
                            }
                        } else {
                            try {
                                masterData = model.data; 
                                dataHeader = model.data[0]; 
                            } catch{}
                        }
                        
                        

                        await report.fillData(masterData, detailData, key, dataHeader);

                    }

                    rtnFile = await report.writeFile();

                } else {
                    return response.send(null);
                }

                if (rtnURL == 'Y') {
                    const current = new Date();
                    const year = current.getFullYear()
                    let month = current.getMonth() + 1
                    let day = current.getDate()
                    if (day < 10) {
                        day = "0" + day
                    }
                    if (month < 10) {
                        month = "0" + month
                    }
                    const dir = ROOT_DIR_FILES + '/pdf/' + year + '/' + month
                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir, { recursive: true }, err => { console.log(err) })
                    }
                    const unixtime = Date.now()
                    const rtnFile2 = rtnFile.replace(/\\/g, '/')
                    const fileName = '/pdf/' + year + '/' + month + "/rpt-" + unixtime + "-" + (rtnFile2.split("/").pop())
                    const destinationFile = dir + "/rpt-" + unixtime + "-" + (rtnFile2.split("/").pop())
                    await Utils.copyFile(rtnFile, destinationFile)
                    let token = AES.encrypt(fileName + "|" + year + month + day, APP_KEY)
                    token = token.replace(/\+/g, 'p1L2u3S').replace(/\//g, 's1L2a3S4h').replace(/=/g, 'e1Q2u3A4l')

                    try {  fs.unlink(rtnFile2, (err) => {});  } catch{}

                    return response.send(APP_URL_LOCAL + "/api/dso/getfiletoken?file_name=" + fileName + "&token=" + token)
                } else {
                    return response.attachment(
                        rtnFile,
                        rptName // custom name
                    )
                }

            } else {
                return response.send(null);
            }

            
            
        } catch (e) {
            Utils.Logger({
                LVL: "error",
                MODULE: "ReportController",
                FUNC: "MakeReport2",
                CONTENT: e.message,
            });
            return response.send(null);
        }
    }

    async GetFileTemplate({ request, response, auth }) {
        try {
            var p_language = request.header("accept-language", "ENG");
            var p_crt_by = "";
            const user = await auth.getUser();
            if (user) {
                p_crt_by = user.USER_ID;
            }

            let {  model, _db2, rtnURL } = request.all();
            let rtnFile = "";
            let rptName = "";

            if(model && !!model.PK) {

                if (DB_CONNECTION == "oracle") {
                    oracledb.fetchAsBuffer = [oracledb.BLOB];
                }

                let para = [model.TABLE_NAME, model.PK];

                let result = await DBService.callProcCursor('sys_sel_file', [...para], p_language, p_crt_by, _db2);
                
                if(result && result.length > 0) {
                    let data = result[0];
                    let file_ext = !!data["FILE_EXT"] ? data["FILE_EXT"] : model["EXTENSION"];
                    let file_buffer = !!data["FILE_CONTENT"] ? data["FILE_CONTENT"] : data[ model["BUFFER_COLUMN"] ]

                    let file_name = `tmp_${p_crt_by}.${file_ext}`;
                    let file_path = Helpers.tmpPath(file_name);

                    await fs.writeFileSync(file_path, file_buffer);

                    if (rtnURL == 'Y') {
                        const current = new Date();
                        const year = current.getFullYear()
                        let month = current.getMonth() + 1
                        let day = current.getDate()
                        if (day < 10) {
                            day = "0" + day
                        }
                        if (month < 10) {
                            month = "0" + month
                        }
                        const dir = ROOT_DIR_FILES + '/pdf/' + year + '/' + month
                        if (!fs.existsSync(dir)) {
                            fs.mkdirSync(dir, { recursive: true }, err => { console.log(err) })
                        }
                        const unixtime = Date.now()
                        const rtnFile2 = file_path.replace(/\\/g, '/')
                        const fileName = '/pdf/' + year + '/' + month + "/rpt-" + unixtime + "-" + (rtnFile2.split("/").pop())
                        const destinationFile = dir + "/rpt-" + unixtime + "-" + (rtnFile2.split("/").pop())
                        await Utils.copyFile(file_path, destinationFile)
                        let token = AES.encrypt(fileName + "|" + year + month + day, APP_KEY)
                        token = token.replace(/\+/g, 'p1L2u3S').replace(/\//g, 's1L2a3S4h').replace(/=/g, 'e1Q2u3A4l')
                        return response.send(APP_URL_LOCAL + "/api/dso/getfiletoken?file_name=" + fileName + "&token=" + token)
                    } else {
                        return response.attachment(
                            file_path,
                            rptName // custom name
                        )
                    }


                } else {
                    return response.send(null);
                }
                
            } else {
                return response.send(null);
            }
            
        } catch (e) {
            Utils.Logger({
                LVL: "error",
                MODULE: "ReportController",
                FUNC: "GetFileTemplate",
                CONTENT: e.message,
            });
            return response.send(null);
        }
    }


    async GetFileTemplate2({ request, response, auth }) {
        try {
            var p_language = request.header("accept-language", "ENG");
            var p_crt_by = "";
            const user = await auth.getUser();
            if (user) {
                p_crt_by = user.USER_ID;
            }

            let {  path } = request.all();
            let rtnFile = "";
            //console.log("GetFileTemplate2", path);

            if(path) {
                rtnFile =  Helpers.resourcesPath(path);
                //console.log("GetFileTemplate2", rtnFile);
                return response.attachment(rtnFile);
            } else {
                //console.log("GetFileTemplate2", "no file!")
                return response.send(null);
            }
            
        } catch (e) {
            Utils.Logger({ LVL: "error", MODULE: "ReportController", FUNC: "GetFileTemplate2", CONTENT: e.message, });
            return response.send(null);
        }
    }


    async PreviewReport({ request, response, auth }) {
        try {
            var p_language = request.header("accept-language", "ENG");
            var p_crt_by = "";
            const user = await auth.getUser();
            if (user) {
                p_crt_by = user.USER_ID;
            }
            let { pageSetup } = request.all();
            const file = request.file("file");
            //const fileContent = await Utils.readFile(file.tmpPath);
            //const file_size = file.size;
            //const file_name = file.clientName;
            const file_ext = file.extname;
            //const file_type = file.type;
            //const fileBuffer = Buffer.from(fileContent);
            let fileUrl = file.tmpPath;
            try { pageSetup = JSON.parse(pageSetup); } catch{}

            if(file_ext=="xlsx" && pageSetup && Object.keys(pageSetup).length > 0) {
                let _tmpFileName = Date.now()+"_"+ p_crt_by + "." + file_ext;
                let savePath = Helpers.tmpPath(_tmpFileName);
                await file.move(Helpers.tmpPath(), {
                    name: _tmpFileName,
                });

                
                let report  = new ReportHelper();
                report.reportType = "excel";
                report.convert = "pdf";
                report.returnFile = savePath;
                report.workbook = new Excel.Workbook();
                await report.workbook.xlsx.readFile(savePath);

                report.workbook.eachSheet(function(worksheet, sheetId) {
                    worksheet.pageSetup.margins = {
                        left: 0.1, right: 0.1,
                        top: 0.1, bottom: 0.1,
                        header: 0.1, footer: 0.1
                    };

                    if(worksheet.pageSetup.paperSize <= 0 ) {
                        worksheet.pageSetup.paperSize = 9;
                    }

                    worksheet.pageSetup.fitToPage = true;
                    worksheet.pageSetup.fitToWidth = 1;
                    worksheet.pageSetup.fitToHeight = 0;
                    Object.keys(pageSetup).forEach(key => {
                        if (key != "paperSize") {
                            worksheet.pageSetup[key] = pageSetup[key];
                        }
                    })

                    
                });
                
                fileUrl = await report.writeFile();
            } else {
                fileUrl = await Utils.excelToPdf(fileUrl);
            }

            let rtnFile = fileUrl;

            const current = new Date();
            const year = current.getFullYear()
            let month = current.getMonth() + 1
            let day = current.getDate()
            if (day < 10) {
                day = "0" + day
            }
            if (month < 10) {
                month = "0" + month
            }
            const dir = ROOT_DIR_FILES + '/pdf/' + year + '/' + month
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true }, err => { console.log(err) })
            }
            const unixtime = Date.now()
            const rtnFile2 = rtnFile.replace(/\\/g, '/')
            const fileName = '/pdf/' + year + '/' + month + "/rpt-" + unixtime + "-" + (rtnFile2.split("/").pop())
            const destinationFile = dir + "/rpt-" + unixtime + "-" + (rtnFile2.split("/").pop())
            await Utils.copyFile(rtnFile, destinationFile)
            let token = AES.encrypt(fileName + "|" + year + month + day, APP_KEY)
            token = token.replace(/\+/g, 'p1L2u3S').replace(/\//g, 's1L2a3S4h').replace(/=/g, 'e1Q2u3A4l')

            //remove file temp
            try {
                fs.unlink(fileUrl, (err) => {});
            } catch{}

            return response.send(APP_URL_LOCAL + "/api/dso/getfiletoken?file_name=" + fileName + "&token=" + token)


        } catch (e) {
            Utils.ConsoleLogError(e.message)
            Utils.Logger({
                LVL: "error",
                MODULE: "DsoController",
                FUNC: "ConvertPdf",
                CONTENT: e.message,
                CRT_BY: p_crt_by,
            });
            return response.send(Utils.response(false, e.message, null));
        }
    }


    async convert({ request, response, auth }) {
        try {
            var p_language = request.header("accept-language", "ENG");
            var p_crt_by = "";
            /*const user = await auth.getUser();
            if (user) {
                p_crt_by = user.USER_ID;
            }*/

            let { convert } = request.all();
            const file = request.file("file");
            let fileUrl = file.tmpPath;

            let returnFile = await Utils.convertFile(fileUrl, convert);
            let res = await readFileSync(returnFile, 'utf8');


            //remove file temp
            try {
                fs.unlink(fileUrl, (err) => {});
            } catch{}

            try {
                fs.unlink(returnFile, (err) => {});
            } catch{}

            return response.send(res)
        } catch (e) {
            Utils.ConsoleLogError(e.message)
            Utils.Logger({
                LVL: "error",
                MODULE: "ReportController",
                FUNC: "convert",
                CONTENT: e.message,
                CRT_BY: "convert",
            });
            return response.send(Utils.response(false, e.message, null));
        }
    }
}

module.exports = ReportController;