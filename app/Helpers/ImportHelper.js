"use strict";

const Helpers = use("Helpers");
const fs = use("fs");
const Utils = use("Utils");
const Excel = use('exceljs');
const DBService = use("DBService");

class ImportHelper {
    regexCell = /([a-zA-Z]+)(\d+)/;
    regexColumns = /\$[\[](.*?)[\]]/g;
    regexColumnName = /\$[\[](.*?)[\]]/;
    workbook = new Excel.Workbook();
    activeSheet = null;
    templateFile = "";
    reportPath = "";
    returnFile = null;

    constructor(lang, crt_by) {
        this.reportPath = "import_temp_" + crt_by + ".xlsx";
        this.returnFile = Helpers.tmpPath(this.reportPath);
    }

    async loadFile(path) {
        await this.workbook.xlsx.readFile(path);
    }

    async writeFile() {
        await this.workbook.xlsx.writeFile(this.returnFile);
        return this.returnFile;
    }

    setActiveSheet(idx) {
        let workbookmodel = this.workbook.model;
        let sheet = workbookmodel.sheets[idx];
        this.activeSheet = this.workbook.getWorksheet(sheet.id);

        this.rowIdx = 0;
        this.mergeColIndex = [];
        this.sequenceType = null;
        this.rowSequence = 0;
    }

    async importDBData(import_info, lang, crt_by, _resourcesPath, _filenm, _tablepk, _tablenm) {
        try {
            let info = JSON.parse(import_info);
            let count = 0;
            let proc = info["proc"];
            let start_row = info["start_row"];
            let add_params = info["add_params"] ? info["add_params"] : [];
            let start_col = info["start_col"];
            let end_col = info["end_col"];
            let db2 = info["_db2"] ? info["_db2"] : null;
            let columnChk = info["impValidCol"];
            let valCheck = info["impValidValue"].trim();
            let ConfigRowCall = info["impConfigRowCall"] ? Number(info["impConfigRowCall"]) : 1000;
            let sheetMode = info["sheetMode"] || "first"; // Get sheet mode with default
            const arr_result = [];

            // === ĐOẠN CODE CŨ ===
            // Determine which sheets to process based on sheetMode
            // let sheetsToProcess = [];
            // if (sheetMode === "first") {
            //     sheetsToProcess = [0]; // Process only first sheet
            // } else {
            //     // Process all sheets
            //     sheetsToProcess = [...Array(this.workbook.worksheets.length).keys()];
            // }

            // === ĐOẠN CODE MỚI THAY THẾ ===
            // Determine which sheets to process based on sheetMode and visibility
            let sheetsToProcess = [];
            if (sheetMode === "first") {
                // For first sheet mode, only process if it's not hidden
                const firstSheet = this.workbook.model.sheets[0];
                if (!firstSheet.state || firstSheet.state !== 'hidden') {
                    sheetsToProcess = [0];
                }
            } else {
                // For all sheets mode, filter out hidden sheets
                this.workbook.model.sheets.forEach((sheet, index) => {
                    if (!sheet.state || sheet.state !== 'hidden') {
                        sheetsToProcess.push(index);
                    }
                });
            }

            // Process each selected sheet
            for (let sheetIdx of sheetsToProcess) {
                this.setActiveSheet(sheetIdx);
                let paramObj = [];

                let rows = this.activeSheet.getColumn(start_col);
                let rowsCount = rows['_worksheet']['_rows'].length;

                for (let idx = start_row; idx <= rowsCount; idx++) {
                    let seq = Date.now();
                    let row = this.activeSheet.getRow(idx);
                    let rowModel = row.model;

                    if (rowModel?.min != null && rowModel?.min != 'null' && rowModel?.min != undefined) {
                        let param = [];
                        let shouldProcessRow = true;

                        // Check validation condition if specified
                        if (Number(columnChk) >= 0 && valCheck != '') {
                            let execlChk = row.getCell(columnChk);
                            let cellValue2 = (execlChk.value ? execlChk.value : "");
                            shouldProcessRow = (cellValue2.trim() == valCheck.trim());
                        }

                        if (shouldProcessRow) {
                            this.processRow(row, start_col, end_col, param, add_params, _tablenm, _tablepk, idx, seq);
                            paramObj.push(param);
                        }
                    }
                }

                // Process data in batches
                if (paramObj.length > 0) {
                    let rtnList = await this.processBulkData(proc, paramObj, ConfigRowCall, lang, crt_by, db2);
                    this.processResults(rtnList, paramObj, arr_result);
                    count += arr_result.length;
                }

                // Write results back to the sheet
                this.writeResultsToSheet(start_row, rowsCount, start_col, end_col, arr_result);
            }

            this.returnFile = Helpers.tmpPath(_filenm);
            await this.writeFile();
            return true;

        } catch (e) {
            console.log('e', e);
            Utils.Logger({
                LVL: "error",
                MODULE: "ImportHelper",
                FUNC: "importDBData",
                CONTENT: e.message
            });
            return false;
        }
    }

    processRow(row, start_col, end_col, param, add_params, _tablenm, _tablepk, idx, seq) {
        for (let colIdx = start_col; colIdx <= end_col; colIdx++) {
            let cell = row.getCell(colIdx);
            let cellValue = this.getCellValue(cell);
            param.push(cellValue);
        }
        row.getCell(end_col + 1).value = idx + '' + seq;
        row.commit();

        param.push(...add_params);
        if (_tablenm == 'TAC_FILES') {
            param.push(_tablenm);
            param.push(_tablepk);
        }
        param.push(idx + '' + seq);
    }

    getCellValue(cell) {
        let cellValue = (cell.value ? cell.value : "");

        if (cellValue?.formula) {
            cellValue = cellValue.result;
        }

        if (cellValue == undefined) {
            cellValue = "";
        }

        if (cellValue?.richText) {
            let concatRichText = "";
            for (let r = 0; r < cellValue.richText.length; r++) {
                let getText = cellValue.richText[r].text;
                concatRichText = concatRichText + getText;
            }
            cellValue = concatRichText;
        }

        if (cellValue?.sharedFormula) {
            cellValue = cellValue.result;
        }

        return cellValue;
    }

    async processBulkData(proc, paramObj, ConfigRowCall, lang, crt_by, db2) {
        let rtnList = [];
        if (paramObj.length <= ConfigRowCall) {
            rtnList = await DBService.callBulkProcCursor(proc, paramObj, lang, crt_by, db2);
        } else {
            for (let i = 0; i < paramObj.length; i += ConfigRowCall) {
                let paramObjRowCall = paramObj.slice(i, i + ConfigRowCall);
                let returnData = await DBService.callBulkProcCursor(proc, paramObjRowCall, lang, crt_by, db2);
                rtnList.push(returnData);
            }
        }
        return rtnList.flat();
    }

    processResults(rtnList, paramObj, arr_result) {
        if (rtnList && rtnList.length > 0) {
            for (let index = 0; index < rtnList.length; index++) {
                const element = rtnList[index][0] != undefined ? rtnList[index][0] : rtnList[index];
                let result = {
                    SEQ: paramObj[index][paramObj[index].length - 1]
                };

                if (element.hasOwnProperty("ERRCODE") || element.hasOwnProperty("ERRMSG")) {
                    result.ERRCODE = element.ERRCODE;
                    result.ERRMSG = element.ERRMSG;
                }

                arr_result.push(result);
            }
        }
    }

    writeResultsToSheet(start_row, rowsCount, start_col, end_col, arr_result) {
        for (let idx = start_row; idx <= rowsCount; idx++) {
            var r_item = this.activeSheet.getRow(idx);
            var maxcol = end_col + 1;
            var seq_idx = r_item.getCell(maxcol).value;
            var msg = "Success";
            var flag = '1';

            for (let arri = 0; arri <= arr_result.length - 1; arri++) {
                let itemdata = arr_result[arri];
                if (Number(itemdata.SEQ) == Number(seq_idx)) {
                    if (itemdata.ERRCODE || itemdata.ERRCODE != undefined) {
                        msg = itemdata.ERRCODE + ' ' + itemdata.ERRMSG;
                    }
                    flag = '2';
                    break;
                }
            }

            if (flag == '1') {
                msg = "row_data_is_wrong_please_check_again";
            }

            r_item.getCell(maxcol).value = msg;
            r_item.commit();
        }
    }

    async ProcessDataImp(item, lang, crt_by) {
        try {
            const result = await DBService.callProcCursor(item.proc, item.param, lang, crt_by);
            result[0].SEQ = item.param[item.param.length - 1];
            return result;
        } catch (e) {
            Utils.Logger({
                LVL: "error",
                MODULE: "ImportHelper",
                FUNC: "ProcessDataImp",
                CONTENT: e.message
            });

            var arr = [];
            var vall = e.message.toLowerCase();
            this.decodeMessage(arr, vall);

            var result = [{}];
            result[0].SEQ = item.param[item.param.length - 1];

            if (arr.length > 0) {
                result[0].ERRCODE = arr.join("  >>>  ");
            } else {
                result[0].ERRCODE = vall;
            }

            return result;
        }
    }

    decodeMessage(arr, val) {
        const regex = /[ORA|ora]-([\d]*):\s\[(.*)\]/gm;
        var vall = val.toLowerCase().replace(/\n/gm, '');
        let m;

        while ((m = regex.exec(vall)) !== null) {
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }

            if (m.length == 3) {
                if (!m[2].startsWith("ora-")) {
                    var strs = m[2].split(",");
                    strs.forEach((s) => {
                        arr[arr.length] = s;
                    });
                } else {
                    this.decodeMessage(arr, m[2]);
                }
            }
        }
    }
}

module.exports = ImportHelper;