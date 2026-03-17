import ExcelJS from "exceljs";
import moment from "moment"

let regexCell = /([a-zA-Z]+)(\d+)/;
let regexColumns = /\$[\[](.*?)[\]]/g; // list  $[column]
let regexColumnName = /\$[\[](.*?)[\]]/; //  $[column]

let dateColumns = [];
let stringColumns = [];
let imageColumns = [];

let excelCols = [
    "",   "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
    "AA", "AB", "AC", "AD", "AE", "AF", "AG", "AH", "AI", "AJ", "AK", "AL", "AM", "AN", "AO", "AP", "AQ", "AR", "AS", "AT", "AU", "AV", "AW", "AX", "AY", "AZ",
    "BA", "BB", "BC", "BD", "BE", "BF", "BG", "BH", "BI", "BJ", "BK", "BL", "BM", "BN", "BO", "BP", "BQ", "BR", "BS", "BT", "BU", "BV", "BW", "BX", "BY", "BZ",
    "CA", "CB", "CC", "CD", "CE", "CF", "CG", "CH", "CI", "CJ", "CK", "CL", "CM", "CN", "CO", "CP", "CQ", "CR", "CS", "CT", "CU", "CV", "CW", "CX", "CY", "CZ",
    "DA", "DB", "DC", "DD", "DE", "DF", "DG", "DH", "DI", "DJ", "DK", "DL", "DM", "DN", "DO", "DP", "DQ", "DR", "DS", "DT", "DU", "DV", "DW", "DX", "DY", "DZ",
    "EA", "EB", "EC", "ED", "EE", "EF", "EG", "EH", "EI", "EJ", "EK", "EL", "EM", "EN", "EO", "EP", "EQ", "ER", "ES", "ET", "EU", "EV", "EW", "EX", "EY", "EZ",
    "FA", "FB", "FC", "FD", "FE", "FF", "FG", "FH", "FI", "FJ", "FK", "FL", "FM", "FN", "FO", "FP", "FQ", "FR", "FS", "FT", "FU", "FV", "FW", "FX", "FY", "FZ",
    "GA", "GB", "GC", "GD", "GE", "GF", "GG", "GH", "GI", "GJ", "GK", "GL", "GM", "GN", "GO", "GP", "GQ", "GR", "GS", "GT", "GU", "GV", "GW", "GX", "GY", "GZ",
    "HA", "HB", "HC", "HD", "HE", "HF", "HG", "HH", "HI", "HJ", "HK", "HL", "HM", "HN", "HO", "HP", "HQ", "HR", "HS", "HT", "HU", "HV", "HW", "HX", "HY", "HZ",
    "IA", "IB", "IC", "ID", "IE", "IF", "IG", "IH", "II", "IJ", "IK", "IL", "IM", "IN", "IO", "IP", "IQ", "IR", "IS", "IT", "IU", "IV", "IW", "IX", "IY", "IZ",
    "JA", "JB", "JC", "JD", "JE", "JF", "JG", "JH", "JI", "JJ", "JK", "JL", "JM", "JN", "JO", "JP", "JQ", "JR", "JS", "JT", "JU", "JV", "JW", "JX", "JY", "JZ",
    "KA", "KB", "KC", "KD", "KE", "KF", "KG", "KH", "KI", "KJ", "KK", "KL", "KM", "KN", "KO", "KP", "KQ", "KR", "KS", "KT", "KU", "KV", "KW", "KX", "KY", "KZ",
    "LA", "LB", "LC", "LD", "LE", "LF", "LG", "LH", "LI", "LJ", "LK", "LL", "LM", "LN", "LO", "LP", "LQ", "LR", "LS", "LT", "LU", "LV", "LW", "LX", "LY", "LZ",
    "MA", "MB", "MC", "MD", "ME", "MF", "MG", "MH", "MI", "MJ", "MK", "ML", "MM", "MN", "MO", "MP", "MQ", "MR", "MS", "MT", "MU", "MV", "MW", "MX", "MY", "MZ",
    "NA", "NB", "NC", "ND", "NE", "NF", "NG", "NH", "NI", "NJ", "NK", "NL", "NM", "NN", "NO", "NP", "NQ", "NR", "NS", "NT", "NU", "NV", "NW", "NX", "NY", "NZ",
    "OA", "OB", "OC", "OD", "OE", "OF", "OG", "OH", "OI", "OJ", "OK", "OL", "OM", "ON", "OO", "OP", "OQ", "OR", "OS", "OT", "OU", "OV", "OW", "OX", "OY", "OZ",
    "PA", "PB", "PC", "PD", "PE", "PF", "PG", "PH", "PI", "PJ", "PK", "PL", "PM", "PN", "PO", "PP", "PQ", "PR", "PS", "PT", "PU", "PV", "PW", "PX", "PY", "PZ",
    "QA", "QB", "QC", "QD", "QE", "QF", "QG", "QH", "QI", "QJ", "QK", "QL", "QM", "QN", "QO", "QP", "QQ", "QR", "QS", "QT", "QU", "QV", "QW", "QX", "QY", "QZ",
    "RA", "RB", "RC", "RD", "RE", "RF", "RG", "RH", "RI", "RJ", "RK", "RL", "RM", "RN", "RO", "RP", "RQ", "RR", "RS", "RT", "RU", "RV", "RW", "RX", "RY", "RZ",
    "SA", "SB", "SC", "SD", "SE", "SF", "SG", "SH", "SI", "SJ", "SK", "SL", "SM", "SN", "SO", "SP", "SQ", "SR", "SS", "ST", "SU", "SV", "SW", "SX", "SY", "SZ",
    "TA", "TB", "TC", "TD", "TE", "TF", "TG", "TH", "TI", "TJ", "TK", "TL", "TM", "TN", "TO", "TP", "TQ", "TR", "TS", "TT", "TU", "TV", "TW", "TX", "TY", "TZ",
    "UA", "UB", "UC", "UD", "UE", "UF", "UG", "UH", "UI", "UJ", "UK", "UL", "UM", "UN", "UO", "UP", "UQ", "UR", "US", "UT", "UU", "UV", "UW", "UX", "UY", "UZ",
    "VA", "VB", "VC", "VD", "VE", "VF", "VG", "VH", "VI", "VJ", "VK", "VL", "VM", "VN", "VO", "VP", "VQ", "VR", "VS", "VT", "VU", "VV", "VW", "VX", "VY", "VZ",
    "WA", "WB", "WC", "WD", "WE", "WF", "WG", "WH", "WI", "WJ", "WK", "WL", "WM", "WN", "WO", "WP", "WQ", "WR", "WS", "WT", "WU", "WV", "WW", "WX", "WY", "WZ",
    "XA", "XB", "XC", "XD", "XE", "XF", "XG", "XH", "XI", "XJ", "XK", "XL", "XM", "XN", "XO", "XP", "XQ", "XR", "XS", "XT", "XU", "XV", "XW", "XX", "XY", "XZ",
    "YA", "YB", "YC", "YD", "YE", "YF", "YG", "YH", "YI", "YJ", "YK", "YL", "YM", "YN", "YO", "YP", "YQ", "YR", "YS", "YT", "YU", "YV", "YW", "YX", "YY", "YZ",
    "ZA", "ZB", "ZC", "ZD", "ZE", "ZF", "ZG", "ZH", "ZI", "ZJ", "ZK", "ZL", "ZM", "ZN", "ZO", "ZP", "ZQ", "ZR", "ZS", "ZT", "ZU", "ZV", "ZW", "ZX", "ZY", "ZZ",
]

let _workbook = null;
let _worksheet = null;

let _exceljs  = {
    workbook: () => { 
        return _workbook; 
    },
    worksheet: () => {
        return _worksheet;
    },
    setColumnType:(type, obj) => {
        switch(type) {
            case "date" : {  dateColumns =  obj;break;}
            case "string" : {  stringColumns =  obj;break;}
            case "image" : {  imageColumns =  obj;break;}
        }
    },
    readFile: async (that, file, type = 'PATH') => {
        _workbook = new ExcelJS.Workbook();

        try {
            if(type == "PATH" && typeof file == "string") {
                await _workbook.xlsx.readFile(file);
            }
    
            if(type == "BLOB" && file instanceof Blob ) {
                let _buffer = await blobToArray (file);
                await _workbook.xlsx.load(_buffer);
            }
    
            if(type == "BUFFER" && file instanceof Buffer ) {
                await _workbook.xlsx.load(file);
            }

            if(type == "BASE64" && typeof file == "string") {
                let _blob = that._base64ToBlob(file);
                let _buffer = await that.blobToArray(_blob);

                await _workbook.xlsx.load(_buffer);
            }

        }  catch (e) {
            //console.log(e.message)
        }
        
        _worksheet = _workbook.getWorksheet(1); // default sheet 1
        return _workbook;
    },
    createWorkbook: async(that, _filePath) =>{
        _workbook = new ExcelJS.Workbook();
        
        if(_filePath) {
            const res = await that.$axios.$get( "/dso/getfiletemplate2",  { responseType: "blob", params: {path: _filePath } } );
            if(res){
                let _buffer = await blobToArray (res);
                await _workbook.xlsx.load(_buffer);

                _worksheet = _workbook.getWorksheet(1); // default sheet 1
            } else {
                that.showNotification( "danger", that.$t("fail_to_download_template"), "", 4000 );
                return;
            }
        } else {
            //tạo file rỗng
            _worksheet = _workbook.addWorksheet("Sheet1");
        }
    },
    convertToPdfAndDownload: async (that, _fileName) => {
        const buffer = await _workbook.xlsx.writeBuffer();
        let _blob = new Blob([buffer], {
            type: "application/octet-stream",
        });

        let file=that.blobToFile(_blob,_fileName)

        const formData = new FormData();
        formData.append("file", file);

        const res = await that.$axios({
        method: "post",
        url: "/dso/converttopdf",
        data: formData,
        });
        //console.log("res ", res);
        return res;
    },
    dowloadWorkbook: async (that, _fileName, _preview = undefined) => {
        const buffer = await _workbook.xlsx.writeBuffer();
        let _blob = new Blob([buffer], {
            type: "application/octet-stream",
        });

        let _url = window.URL.createObjectURL(_blob);

        if(that._printPreviewYN(_preview)) {
            that._printPreview(that, null, _url, _fileName);
        } else {
            let _name = _fileName.split("/").pop().split('.').slice(0, -1).join('.');   
            let _ext = _fileName.split(".").pop();  

            var tag_a = document.createElement("a");
            document.body.appendChild(tag_a);
            tag_a.style = "display: none";
            tag_a.href = _url;
            tag_a.download = _name +"_" + moment().format("YY-MM-DD-HH-mm-ss") + "." + _ext;
            tag_a.click();
            window.URL.revokeObjectURL(_url);
            tag_a.remove();
        }

        that.showNotification("success", that.$t("export_completed"), "");
    },
    setWorksheet: (idx) => {
        _worksheet = _workbook.getWorksheet(idx);
    },
    getCells: (that, row, from, to) => {
        let _row = _worksheet.getRow(row);
        let _cells = [];
        for(let i = from; i <= to ; i++){
            let _cell = _row.getCell(i);
            _cells.push(_cell);
        }
        return _cells;
    },
    getCellByIndex: (that, _rowIdx, _colIdx) => {
        let _row = _worksheet.getRow(_rowIdx);
        let _cell = _row.getCell(_colIdx);
        return _cell;
    },
    getCellByAddress: (that, _address) => {
        return _worksheet.getCell(_address);
    },
    addStyles: (that, _type, _objects, _styles) => {
        try{
            let cells = [];
            let keys = Object.keys(_styles);
            if(_type == "row") {
                let rows = [];
                if(Array.isArray(_objects)) {
                    _objects.forEach(r => {
                        if(typeof r == "number") {
                            rows.push(_worksheet.getRow(r));
                        } else {
                            rows.push(r);
                        }
                    })
                } else {
                    if(typeof _objects == "number") {
                        rows.push(_worksheet.getRow(_objects));
                    } else {
                        rows.push(_objects);
                    }
                }
                rows.forEach(row => {
                    let rowModel = row.model;
                    for(let colIdx = rowModel.min; colIdx <= rowModel.max; colIdx++) {
                        cells.push( row.getCell(colIdx));
                    }
                })
            }

            if(_type == "cell") {
                cells = [..._objects];
            }

            cells.forEach(c => {
                keys.forEach(key => {
                    c["key"] = _styles["key"];
                })
            })
        } catch(e) { console.log(e.message)};
    },
    insertRowData(that,_rowIdx, _rowData, _no) {
        //insert row
        const sheetModel = _worksheet.model;
        let row = _worksheet.getRow(_rowIdx);
        let rowModel = row.model;

        for(let colIdx = rowModel.min; colIdx <= rowModel.max; colIdx++) {
            let cell = row.getCell(colIdx);
            //console.log(cell.value, cell); continue;

            let col = cell.value;
            try {col =  (cell.value ? cell.value : "").toUpperCase();} catch { continue;}
            let cellValue = null;

            if(col == "" || col == null || col == undefined) continue;
            //insert image
            if(imageColumns.includes(col)) {
                let imageBuffer = _rowData[col];
                
                const imgID =  insertImage(that, imageBuffer);
                if( imgID ) {
                    //mergecell
                    if( cell.isMerged && cell.value )   {
                        const idxMerge = sheetModel.merges.findIndex( x =>  x.includes(cell.address));
                        const mergeRange = sheetModel.merges[idxMerge];
                        _worksheet.addImage(imgID, mergeRange);
                    }  else {
                        _worksheet.addImage(imgID, cell.address+":"+cell.address);
                    }
                }
                
            }

            try { 
                if(col === "NO" || col === "STT") {
                    cellValue =  _no;
                }
                else
                    cellValue =  _rowData[col];
            } catch(e) { 
                cellValue = null;
            } 

            if( dateColumns && dateColumns.includes(col) && cellValue) {

                let m = moment(cellValue, "YYYYMMDD").utcOffset(0, true);
                cell.value = m.toDate();

            } else if( stringColumns && stringColumns.includes(col) ) {
                cell.value = cellValue ;
            } else  if( imageColumns && imageColumns.includes(col) ) {
                cell.value = "";
            } else {
                cell.value = cellValue;
            }

        }
        row.commit();
    },

    insertRows: (that, startRow, datas, isFillData = true) => {
        let dateCols= [...dateColumns];
        let stringCols= [...stringColumns];
        let imageCols= [...imageColumns];
        /*================================================================================================================*/
        //move merge
        /*================================================================================================================*/
        const sheetModel = _worksheet.model;
        let lstMerge = sheetModel.merges;
        let lstMergeTemp = [];
        let lstNewMerge=[];

        lstMerge.forEach(x => {
            const mergeRange = x;
            const startMergeCell = mergeRange.split(':').shift();
            const endMergeCell = mergeRange.split(':').pop();

            const _row1 =  Number( (startMergeCell.match(regexCell))[2] ); //regex: string - character - number
            const _col1 = excelCols.findIndex( x => x == (startMergeCell.match(regexCell))[1] )  ; //regex: string - character - number/// 
            const _row2 = Number( (endMergeCell.match(regexCell))[2] ); //regex: string - character - number
            const _col2 = excelCols.findIndex( x => x == (endMergeCell.match(regexCell))[1] )  ; //regex: string - character - number///
            if(_row1 === startRow) {
                lstMergeTemp.push({ row1: _row1 , col1:_col1, row2: _row2, col2: _col2, range:x  });
                _worksheet.unMergeCells(startMergeCell);
            }

            if(_row1 > startRow) {
                lstNewMerge.push({ row1: _row1+datas.length-1 , col1:_col1, row2: _row2+datas.length-1, col2: _col2, range: x   });
                _worksheet.unMergeCells(startMergeCell);
            }
        });
        

        if(datas.length >= 1){
            //_worksheet.duplicateRow(startRow,datas.length-1, true);
            let rowTemp = _worksheet.getRow(startRow);
            let cellTempValues = rowTemp.values;

            for(let i = 0; i < datas.length + 1; i++) {
                if(i > 0){
                    copyRow(startRow + i, startRow, 'c');
                    //insertRow( startRow + i, cellTempValues, 'i' );
                }
                lstMergeTemp.forEach(x =>{
                    lstNewMerge.push({ row1: startRow + i , col1:x.col1, row2: startRow + i, col2: x.col2  });
                })
            }
            _worksheet.spliceRows(startRow, 1);
        }

        /*================================================================================================================*/
        //insert Data
        /*================================================================================================================*/
        if(isFillData) {
            for(let idx = 0; idx < datas.length; idx++) {
                let row = _worksheet.getRow(startRow + idx);
                let rowModel = row.model;
    
                for(let colIdx = rowModel.min; colIdx <= rowModel.max; colIdx++) {
                    let cell = row.getCell(colIdx);
                    let col = (cell.value ? cell.value : "").toUpperCase();
                    let cellValue = null;
    
                    //insert image
                    if(imageCols.includes(col)) {
                        let imageBuffer = datas[idx][col];
                        
                        const imgID = insertImage(that, imageBuffer);
                        if( imgID ) {
                            //mergecell
                            if( cell.isMerged && cell.value )   {
                                const idxMerge = sheetModel.merges.findIndex( x =>  x.includes(cell.address));
                                const mergeRange = sheetModel.merges[idxMerge];
                                _worksheet.addImage(imgID, mergeRange);
                            }  else {
                                _worksheet.addImage(imgID, cell.address+":"+cell.address);
                            }
                        }
                        
                    }
    
                    try { 
                        if(col === "NO" || col === "STT")  cellValue =  idx + 1;
                        else cellValue =  datas[idx][col];
                    } catch(e) { 
                        cellValue = null;
                    } 
    
                    if( dateCols && dateCols.includes(col) && cellValue) {
                        let m = moment(cellValue, "YYYYMMDD").utcOffset(0, true);
                        cell.value = m.toDate();
                    } else if( stringCols && stringCols.includes(col) ) {
                        cell.value = cellValue ;
                    } else  if( imageCols && imageCols.includes(col) ) {
                        cell.value = "";
                    } else {
                        cell.value = cellValue ;//? cellValue : col ;
                    }
                }
                row.commit();
            }
        }

        lstNewMerge.forEach(x =>{
            try {
                _worksheet.mergeCells(x.row1 , x.col1, x.row2, x.col2);
            } catch(ee){ }
        })
    },
    insertRange: (that, range, obj, _startRow, _startColumn, _endRow, _endColumn)  =>{
        insertRange(that, range, obj, _startRow, _startColumn, _endRow, _endColumn);
    },
    insertRange2:(that, rangeTemplate, datas, isReplace = false, isMerges = true, pageBreak= false, dataPerPage = 1) =>{
        const sheetModel = _worksheet.model;

        const startCell = rangeTemplate.split(':').shift();
        const endCell = rangeTemplate.split(':').pop();

        const startRow =  Number( (startCell.match(regexCell))[2] ); //regex: string - character - number
        const startColumn = excelCols.findIndex( x => x == (startCell.match(regexCell))[1] )  ; //regex: string - character - number/// 
        const endRow = Number( (endCell.match(regexCell))[2] ); //regex: string - character - number
        const endColumn = excelCols.findIndex( x => x == (endCell.match(regexCell))[1] )  ; //regex: string - character - number///

        const rowCount = endRow - startRow + 1;
        let lstMerge = sheetModel.merges;
        let mergeLength = lstMerge.length;
        let lstNewMerge=[];

        if(datas.length === 1) {
            insertRange(that, rangeTemplate, datas[0]);
        } else {
            lstMerge= _worksheet.model.merges;
            mergeLength = lstMerge.length;

            for(let idx = 0; idx < datas.length - 1; idx++) {
                for(let i = 0; i < rowCount; i++) {
                    let target =  (rowCount *(1+idx) ) + startRow + i;
                    let src = startRow +  (rowCount *idx ) + i;
                    if(isReplace) {
                        copyRow(target, src, 'c', isReplace );
                    } else {
                        copyRow(target, src, 'c' );
                    }

                    if(pageBreak    
                        &&    (idx + 1)% dataPerPage == 0 
                        &&    (i === rowCount - 1 ) 
                    ) {
                        let rSrc = _worksheet.getRow(src);
                        rSrc.addPageBreak();
                    }
                }
            }


            for(let idx = 0; idx < datas.length - 1; idx++) {

                //addmerge
                for(var idxMerge = lstMerge.length - 1; idxMerge >= lstMerge.length - mergeLength; idxMerge--) {
                    const mergeRange = lstMerge[idxMerge];
                    const startMergeCell = mergeRange.split(':').shift();
                    const endMergeCell = mergeRange.split(':').pop();

                    const _row1 =  Number( (startMergeCell.match(regexCell))[2] ); //regex: string - character - number
                    const _col1 = excelCols.findIndex( x => x == (startMergeCell.match(regexCell))[1] )  ; //regex: string - character - number/// 
                    const _row2 = Number( (endMergeCell.match(regexCell))[2] ); //regex: string - character - number
                    const _col2 = excelCols.findIndex( x => x == (endMergeCell.match(regexCell))[1] )  ; //regex: string - character - number///
                    try {
                        if( _row1 >= startRow && _col1 >= startColumn && _col2 <= endColumn) {
                            let c1 = (startMergeCell.match(regexCell))[1] + (_row1 + (rowCount *(1+idx) ) );
                            let c2 = (endMergeCell.match(regexCell))[1] + (_row2 + (rowCount *(1+idx) ) );
                            lstNewMerge.push({ row1: _row1 + (rowCount *(1+idx) ) , col1:_col1, row2: _row2 + (rowCount *(1+idx) ), col2: _col2, range: `${c1}:${c2}`   });
                        }
                    }
                    catch (eee) {console.log(eee.message) }
                }

                //add lai style do merge cell bi mat
                for(let _ = 0; _ < rowCount; _++){
                    _copyStyle(startRow + _, (rowCount *(1+idx) ) + startRow  + _);
                }
            }

        }
        if(isMerges) {
            lstNewMerge.forEach(x =>{
                try {
                    _worksheet.mergeCells(x.row1 , x.col1, x.row2, x.col2);
                } catch(ee){ console.log(ee.message) }
            })
        }

        //insert range
        for(let idx = 0; idx < datas.length - 1; idx++) {
            //insert range trc do
            insertRange(that, "A1:A1", datas[idx],  
                startRow +  (rowCount *idx ), //start row
                startColumn,
                endRow +  (rowCount *idx ),
                endColumn
            );

            if(idx === datas.length - 2) { // insert cho row cuoi cung
                insertRange(that, "A1:A1", datas[idx+1],  
                    startRow +  (rowCount *(1+idx) ), //start row
                    startColumn,
                    endRow +  (rowCount *(1+idx) ),
                    endColumn
                );
            }
        }
    },
    copyRow: (pos, src, styleOption = 'c') => {
        copyRow(pos, src, styleOption = 'c');
    },
    insertRow:(pos, value, styleOption = 'n')=>{
        insertRow(pos, value, styleOption = 'n');
    },
    insertImage: (that, imageBuffer, cell) =>{
        return insertImage(that, imageBuffer, cell);
       
    },
    insertImageBase64: (that, imageBase64, cell) =>{
        return insertImageBase64(that, imageBase64, cell);
       
    },
    setHideColumns: (that, columns, isHide) => {
        setHideColumns(that, columns, isHide);
    },
    copyCellStyle: (_srcRow, _srcCol, _destRow, _destCol) => {
        _copyCellStyle(_srcRow, _srcCol, _destRow, _destCol);
    }
};

let insertRange= (that, range, obj, _startRow, _startColumn, _endRow, _endColumn)  =>{
    const startCell = range.split(':').shift();
    const endCell = range.split(':').pop();

    const startRow = _startRow ? _startRow : Number( (startCell.match(regexCell))[2] ); //regex: string - character - number
    const startColumn = _startColumn ? _startColumn : excelCols.findIndex( x => x == (startCell.match(regexCell))[1] )  ; //regex: string - character - number/// 

    const endRow = _endRow ? _endRow : Number( (endCell.match(regexCell))[2] ); //regex: string - character - number
    const endColumn = _endColumn ? _endColumn : excelCols.findIndex( x => x == (endCell.match(regexCell))[1] )  ; //regex: string - character - number///

    const sheetModel = _worksheet.model;

    for(let idx = startRow; idx <= endRow; idx++) {
        let row = _worksheet.getRow(idx);

        for(let colIdx = startColumn; colIdx <= endColumn; colIdx++) {
            let cell = row.getCell(colIdx);
            let cellText = cell.value;
            let cellValue = null;
            
            

            try {
                let columnNames = cellText.match(regexColumns);
                
                if(columnNames != null && columnNames.length > 0) {
                    let col ="";
                    columnNames.forEach( q => {
                        col = (q.match(regexColumnName))[1].toUpperCase() ;
                        
                        //insert image
                        if(imageColumns.includes(col)) {
                            let imageBuffer = obj[col]? obj[col].data : null ;
                            const imgID = insertImage(that, imageBuffer);
                            
                            if(imgID) {
                                //mergecell
                                if( cell.isMerged && cell.value )   {
                                    const idxMerge = sheetModel.merges.findIndex( x =>  x.includes(cell.address+":"));
                                    const mergeRange = sheetModel.merges[idxMerge];
                                    _worksheet.addImage(imgID, mergeRange);
                                }  else {
                                    _worksheet.addImage(imgID, cell.address+":"+cell.address);
                                }
                            }
                        }

                        try { 
                            if(columnNames.length == 1 && col.length == cellText.length - 3) {
                                cellValue = obj[col];
                            } else {
                                cellText =  cellText.replace( q, obj[col] ) ;
                            }
                        } catch(e) {
                            
                            cellValue = null;
                        } 
                    });

                    cellValue = columnNames.length == 1 && col.length == cellText.length - 3 ?  cellValue : cellText  ;
                    if ((cellValue + "").toString().trim() == "null") {
                        cellValue = null;
                        }
                    if( columnNames.length == 1 && col.length == cellText.length - 3 ) {
                        if( dateColumns && dateColumns.includes(col) && cellValue) {
                            let m = moment(cellValue, "YYYYMMDD").utcOffset(0, true);
                            cell.value = m.toDate();
                        } else if( stringColumns && stringColumns.includes(col) ) {
                            cell.value = cellValue ;
                        } else if( imageColumns && imageColumns.includes(col) ) {
                            cell.value = "";
                        } else {
                           cell.value = cellValue;
                        }
                    } else {
                        cell.value = cellValue;
                    }
                }
            } catch (e) { }
        }
        row.commit();
    }
};

let insertImage = (that, imageBuffer, cell) => { 
    let imageID = null;
    
    if(imageBuffer) {
        let tmp = that._arrayBufferToBase64(imageBuffer);
        let imageBase64 = "data:image/png;base64,"+ tmp
        imageID = _workbook.addImage({
            base64: imageBase64,
            extension: 'png'
        });

        if(imageID === "" || !imageID) {
            imageBase64 = "data:image/jpeg;base64, "+ tmp;
            imageID = _workbook.addImage({
                base64: imageBase64,
                extension: 'jpeg'
            });
        }
    
    }

    if(cell) {
        if( cell.isMerged)   {
            //console.log("_worksheet", _worksheet);
            const idxMerge = _worksheet.model.merges.findIndex( x =>  x.includes(cell.address));
            const mergeRange = _worksheet.model.merges[idxMerge];
            _worksheet.addImage(imageID, mergeRange);
        }  else {
            _worksheet.addImage(imageID, cell.address+":"+cell.address);
        }
    }

    return imageID;
}

let insertImageBase64 = (that, imageBase64, cell) => { 
    let imageID = null;
    
    if(imageBase64) {
        
        // let tmp = that._arrayBufferToBase64(imageBuffer);
        // let imageBase64 = "data:image/png;base64,"+ tmp
        imageID = _workbook.addImage({
            base64: imageBase64,
            extension: 'png'
        });

        if(imageID === "" || !imageID) {
            // imageBase64 = "data:image/jpeg;base64, "+ tmp;
            imageID = _workbook.addImage({
                base64: imageBase64,
                extension: 'jpeg'
            });
        }
    
    }

    if(cell) {
        if( cell.isMerged)   {
            //console.log("_worksheet", _worksheet);
            const idxMerge = _worksheet.model.merges.findIndex( x =>  x.includes(cell.address));
            const mergeRange = _worksheet.model.merges[idxMerge];
            _worksheet.addImage(imageID, mergeRange);
        }  else {
            _worksheet.addImage(imageID, cell.address+":"+cell.address);
        }
    }

    return imageID;
}

let setHideColumns = (that, columns, isHide) => {
    if(columns && columns.length > 0) {
        for(let i = 0 ; i < columns.length; i++) {
            let col = _worksheet.getColumn( columns[i] );
            col.hidden  = isHide;
        }
    }
}

let blobToArray = async (_result) => {
    let _blob = new Blob([_result], {
        type: "application/octet-stream",
    });
    let _url = window.URL.createObjectURL(_blob);

    let res = await fetch(_url)
    let _arrayBuffer = await res.arrayBuffer();

    return _arrayBuffer;
};
let insertRow =(pos, value, styleOption = 'n') => {
    _worksheet.spliceRows(pos, 0, value);
   _setStyleOption(pos, styleOption);
    return _worksheet.getRow(pos);
};
let copyRow = (pos, src, styleOption = 'c', isReplace = false) => {
    let rSrc = _worksheet.getRow(src);
    let values = rSrc.values;
    _worksheet.spliceRows(pos, isReplace ? 1 :  0, values);
    _setStyleOption(pos, styleOption, src);
    return _worksheet.getRow(pos);
}

let _setStyleOption = (pos, styleOption = 'n', src = -1) => {
    if (styleOption === 'o' && _worksheet.findRow(pos + 1) !== undefined) {
        _copyStyle(pos + 1, pos);
    } else if (styleOption === 'i' && _worksheet.findRow(pos - 1) !== undefined) {
        _copyStyle(pos - 1, pos);
    } else if( styleOption === 'c' && _worksheet.findRow(src) !== undefined ) {
        _copyStyle(src, pos);
    }
}

let _copyStyle = (src, dest) => {
    let rSrc = _worksheet.getRow(src);
    let rDst = _worksheet.getRow(dest);
    rDst.style = {...rSrc.style};
    // eslint-disable-next-line no-loop-func
    rSrc.eachCell({includeEmpty: true}, (cell, colNumber) => {
      rDst.getCell(colNumber).style = {...cell.style};
    });
    rDst.height = rSrc.height;
}

let _copyCellStyle = (_srcRow, _srcCol, _destRow, _destCol) => {
    let rSrc = _worksheet.getRow(_srcRow);
    let rDst = _worksheet.getRow(_destRow);

    let srcCell = rSrc.getCell(_srcCol);
    let destCell = rDst.getCell(_destCol);

    destCell.style = {...srcCell.style};
}


export default _exceljs;