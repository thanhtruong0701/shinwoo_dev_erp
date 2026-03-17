let _SW20030 = {
  print: async (that, report_path, report_name, orderPK) => {
    try {
      let excel = null;
      let exceljs =  require("@/plugins/exceljs.js");
      if(!!exceljs) {
        exceljs = exceljs.default;
      }
      await exceljs.createWorkbook(that, report_path);
      let worksheet = exceljs.worksheet();
      const pageSetup = {
        orientation: "landscape",
        fitToPage: true,
        //scale: 75,
        margins: {
          left: 0, right: 0,
          top: 0, bottom: 0,
          header: 0, footer: 0
        },
        paperSize: 9 // "A4"
      }
      worksheet.pageSetup = {...pageSetup}
      exceljs.setWorksheet("Sheet1");
            
      let startRowMaster = 2;
      let startColTitle = 2;
      let startColValue = 3;            
      let startRowDetail = 11;
      let rowTotal = 18;
      let rowLogo = { from: rowTotal + 1, to: rowTotal + 3 };

      let startRowMaster2 = rowTotal + 5;
      let startColTitle2 = 2;
      let startColValue2 = 3;
      let startRowDetail2 = startRowMaster2 + 9;
      let rowTotal2 = startRowDetail2 + 7;
      let rowLogo2 = { from: rowTotal2 + 1, to: rowTotal2 + 3 };

      const colDistance = 4;
      const defaultTitleWidth = 14;
      const defaultValueWidth = 10;

      const imgPath = require("@/assets/images/sw_label_packing.png");
      const image = await createFile(imgPath);
      const imageBuffer = await that.blobToArray(image);
      const logo = exceljs.insertImage(that, imageBuffer);

      let tempTitle = [];
      for (let index = 0; index < 18; index++) {
        const title = exceljs.getCellByAddress(that, `B${startRowMaster+index}`).value;
        tempTitle.push(title)
      }       
 
      const dsoMaster = { type: "grid", selpro: "SW_RPT_SW20030_PKL_M", para: [ orderPK ] };
      let resultMaster = await that._dsoCall(dsoMaster, 'select', false);
      // console.log("resultMaster:", resultMaster)
      if(resultMaster.length) {
        const fieldsMaster = Object.keys(resultMaster[0]).filter(item => item !== "_rowstatus");
        for (let i = 0; i < resultMaster.length; i++) {
          const elA = resultMaster[i];
          if(i === 0) {
            for (let j = 0; j < fieldsMaster.length; j++) {
              const elB = fieldsMaster[j];
              worksheet.mergeCells(startRowMaster + j, startColValue, startRowMaster + j, startColValue + 1);
              let _cellMaster = exceljs.getCellByIndex(that, startRowMaster + j, startColValue);              
              _cellMaster.value = elA[`${elB}`];
              _cellMaster.alignment = { horizontal: "center", vertical: "middle", shrinkToFit: true };
              _cellMaster.border = {
                top: { style: j === 0 ? 'medium' : 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'medium' }
              };
            }
            let _cellQtyText = exceljs.getCellByIndex(that, startRowDetail - 1, startColValue);
            _cellQtyText.value = "Q'ty";
            _cellQtyText.alignment = { horizontal: "center", vertical: "middle", shrinkToFit: true };
            let _cellActQtyText = exceljs.getCellByIndex(that, startRowDetail - 1, startColValue + 1);
            _cellActQtyText.value = "Actual Q'ty";
            _cellActQtyText.alignment = { horizontal: "center", vertical: "middle", shrinkToFit: true };
            const dsoDetail = { type: "grid", selpro: "SW_RPT_SW20030_PKL_D", para: [ orderPK, elA.COLOR ] };
            let resultDetail = await that._dsoCall(dsoDetail, 'select', false);
            // console.log("resultDetail:", resultDetail)
            if(resultDetail.length) {
              const fieldsDetail = Object.keys(resultDetail[0]).filter(item => item !== "_rowstatus");
              for (let k = 0; k < resultDetail.length; k++) {
                const elC = resultDetail[k];
                for (let l = 0; l < fieldsDetail.length; l++) {
                  const elD = fieldsDetail[l];
                  let _cellDetail = exceljs.getCellByIndex(that, startRowDetail + k, (l === 0 ? startColTitle : l === 1 ? startColValue : startColValue + 1))
                  _cellDetail.value = elC[`${elD}`];
                }
              }
              const sumQty = resultDetail.reduce(function (total, { QTY }) {
                return total + QTY;
              }, 0);
              let _cellSumQty = exceljs.getCellByIndex(that, rowTotal, startColValue)
              _cellSumQty.value = sumQty;
              const sumActQty = resultDetail.reduce(function (total, { ACTUAL_QTY }) {
                return total + ACTUAL_QTY;
              }, 0);
              let _cellSumActQty = exceljs.getCellByIndex(that, rowTotal, startColValue + 1)
              _cellSumActQty.value = sumActQty;
            }
            worksheet.getColumn(startColTitle).width = defaultTitleWidth;
            worksheet.getColumn(startColValue).width = defaultValueWidth;
            worksheet.getColumn(startColValue+1).width = defaultValueWidth;
            if(logo) {
              worksheet.addImage(logo, {
                tl: { col: startColTitle - 1, row: rowLogo.from - 1 },
                br: { col: startColValue + 1, row: rowLogo.to }
              });
            }
          } else if (i >= 1 && i <= 4) {
            for (let index = 0; index < 18; index++) {
              exceljs.copyCellStyle(startRowMaster + index, 2, startRowMaster + index, startColTitle + colDistance);
              exceljs.copyCellStyle(startRowMaster + index, 3, startRowMaster + index, startColValue + colDistance);
              exceljs.copyCellStyle(startRowMaster + index, 4, startRowMaster + index, startColValue + colDistance + 1);
              let _cellTitle = exceljs.getCellByIndex(that, startRowMaster + index, startColTitle + colDistance);
              _cellTitle.value = tempTitle[index];
            }
            for (let j = 0; j < fieldsMaster.length; j++) {
              const elB = fieldsMaster[j];
              worksheet.mergeCells(startRowMaster + j, startColValue + colDistance, startRowMaster + j, startColValue + colDistance + 1);
              let _cellMaster = exceljs.getCellByIndex(that, startRowMaster + j, startColValue + colDistance);                
              _cellMaster.value = elA[`${elB}`];
              _cellMaster.alignment = { horizontal: "center", vertical: "middle", shrinkToFit: true };
              _cellMaster.border = {
                top: { style: j === 0 ? 'medium' : 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'medium' }
              };
            }
            let _cellQtyText = exceljs.getCellByIndex(that, startRowDetail - 1, startColValue + colDistance);
            _cellQtyText.value = "Q'ty";
            _cellQtyText.alignment = { horizontal: "center", vertical: "middle", shrinkToFit: true };
            let _cellActQtyText = exceljs.getCellByIndex(that, startRowDetail - 1, startColValue + colDistance + 1);
            _cellActQtyText.value = "Actual Q'ty";
            _cellActQtyText.alignment = { horizontal: "center", vertical: "middle", shrinkToFit: true };
            const dsoDetail = { type: "grid", selpro: "SW_RPT_SW20030_PKL_D", para: [ orderPK, elA.COLOR ] };
            let resultDetail = await that._dsoCall(dsoDetail, 'select', false);            
            if(resultDetail.length) {
              const fieldsDetail = Object.keys(resultDetail[0]).filter(item => item !== "_rowstatus");
              for (let k = 0; k < resultDetail.length; k++) {
                const elC = resultDetail[k];
                for (let l = 0; l < fieldsDetail.length; l++) {
                  const elD = fieldsDetail[l];
                  let _cellDetail = exceljs.getCellByIndex(that, startRowDetail + k, (l === 0 ? startColTitle + colDistance : l === 1 ? startColValue + colDistance : startColValue + colDistance + 1))
                  _cellDetail.value = elC[`${elD}`];
                }
              }
              const sumQty = resultDetail.reduce(function (total, { QTY }) {
                return total + QTY;
              }, 0);              
              let _cellSumQty = exceljs.getCellByIndex(that, rowTotal, startColValue + colDistance)
              _cellSumQty.value = sumQty;
              const sumActQty = resultDetail.reduce(function (total, { ACTUAL_QTY }) {
                return total + ACTUAL_QTY;
              }, 0);              
              let _cellSumActQty = exceljs.getCellByIndex(that, rowTotal, startColValue + colDistance + 1)
              _cellSumActQty.value = sumActQty;
            }
            worksheet.getColumn(startColTitle + colDistance).width = defaultTitleWidth;
            worksheet.getColumn(startColValue + colDistance).width = defaultValueWidth;
            worksheet.getColumn(startColValue + colDistance + 1).width = defaultValueWidth;
            if(logo) {
              worksheet.addImage(logo, {
                tl:{ col: (startColTitle + colDistance) - 1, row: rowLogo.from - 1 },
                br:{ col: startColValue + colDistance + 1, row: rowLogo.to }
              });
            }
            startColTitle = startColTitle + colDistance;
            startColValue = startColValue + colDistance;
          } else {
            for (let index = 0; index < 18; index++) {
              exceljs.copyCellStyle(startRowMaster + index, 2, startRowMaster2 + index, (i === 5 ? startColTitle2 : startColTitle2 + colDistance));
              exceljs.copyCellStyle(startRowMaster + index, 3, startRowMaster2 + index, (i === 5 ? startColValue2 : startColValue2 + colDistance));
              exceljs.copyCellStyle(startRowMaster + index, 4, startRowMaster2 + index, (i === 5 ? startColValue2 + 1 : startColValue2 + colDistance + 1));
              let _cellTitle = exceljs.getCellByIndex(that, startRowMaster2 + index, (i === 5 ? startColTitle2 : startColTitle2 + colDistance))
              _cellTitle.value = tempTitle[index];
            }            
            for (let j = 0; j < fieldsMaster.length; j++) {
              const elB = fieldsMaster[j];
              worksheet.mergeCells(startRowMaster2 + j, (i === 5 ? startColValue2 : startColValue2 + colDistance), startRowMaster2 + j, (i === 5 ? startColValue2 + 1 : startColValue2 + colDistance + 1));              
              let _cellMaster = exceljs.getCellByIndex(that, startRowMaster2 + j, (i === 5 ? startColValue2 : startColValue2 + colDistance));                
              _cellMaster.value = elA[`${elB}`];
              _cellMaster.alignment = { horizontal: "center", vertical: "middle", shrinkToFit: true };
              _cellMaster.border = {
                top: { style: j === 0 ? 'medium' : 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'medium' }
              };
            }
            let _cellQtyText = exceljs.getCellByIndex(that, startRowDetail2 - 1, (i === 5 ? startColValue2 : startColValue2 + colDistance));
            _cellQtyText.value = "Q'ty";
            _cellQtyText.alignment = { horizontal: "center", vertical: "middle", shrinkToFit: true };
            let _cellActQtyText = exceljs.getCellByIndex(that, startRowDetail2 - 1, (i === 5 ? startColValue2 + 1 : startColValue2 + colDistance + 1));
            _cellActQtyText.value = "Actual Q'ty";
            _cellActQtyText.alignment = { horizontal: "center", vertical: "middle", shrinkToFit: true };
            const dsoDetail = { type: "grid", selpro: "SW_RPT_SW20030_PKL_D", para: [ orderPK, elA.COLOR ] };
            let resultDetail = await that._dsoCall(dsoDetail, 'select', false);            
            if(resultDetail.length) {
              const fieldsDetail = Object.keys(resultDetail[0]).filter(item => item !== "_rowstatus");                
              for (let k = 0; k < resultDetail.length; k++) {
                const elC = resultDetail[k];
                for (let l = 0; l < fieldsDetail.length; l++) {
                  const elD = fieldsDetail[l];
                  let _cellDetail = exceljs.getCellByIndex(that, startRowDetail2 + k, (l === 0 ? (i === 5 ? startColTitle2 : startColTitle2 + colDistance) : l === 1 ? (i === 5 ? startColValue2 : startColValue2 + colDistance) : (i === 5 ? startColValue2 + 1 : startColValue2 + colDistance + 1)))
                  _cellDetail.value = elC[`${elD}`];
                }
              }
              const sumQty = resultDetail.reduce(function (total, { QTY }) {
                return total + QTY;
              }, 0);              
              let _cellSumQty = exceljs.getCellByIndex(that, rowTotal2, (i === 5 ? startColValue2 : startColValue2 + colDistance))
              _cellSumQty.value = sumQty;
              const sumActQty = resultDetail.reduce(function (total, { ACTUAL_QTY }) {
                return total + ACTUAL_QTY;
              }, 0);              
              let _cellSumActQty = exceljs.getCellByIndex(that, rowTotal2, (i === 5 ? startColValue2 + 1 : startColValue2 + colDistance + 1))
              _cellSumActQty.value = sumActQty;
            }
            worksheet.getColumn(i === 5 ? startColTitle2 : startColTitle2 + colDistance).width = defaultTitleWidth;
            worksheet.getColumn(i === 5 ? startColValue2 : startColValue2 + colDistance).width = defaultValueWidth;
            worksheet.getColumn(i === 5 ? startColValue2 + 1 : startColValue2 + colDistance + 1).width = defaultValueWidth;
            if(logo) {
              worksheet.addImage(logo, {
                tl:{ col: (i === 5 ? startColTitle2 : startColTitle2 + colDistance) - 1, row: rowLogo2.from - 1 },
                br:{ col: (i === 5 ? startColValue2 + 1 : startColValue2 + colDistance + 1), row: rowLogo2.to }
              });
            }
            startColTitle2 = i === 5 ? startColTitle2 : startColTitle2 + colDistance;
            startColValue2 = i === 5 ? startColValue2 : startColValue2 + colDistance;
          }      
        }
      }      
      exceljs.dowloadWorkbook(that, `${report_name}.xlsx`);      
    } catch (error) {
      console.log("print SW20030-catch exception:", error.message)
    }
  }
};

let createFile = async (url) => {
  try {
    let response = await fetch(url);
    let data = await response.blob();
    let metadata = {
      type: 'image/png'
    };
    let file = new File([data], "sw_logo_packing.png", metadata);
    return file;      
  } catch (error) {
    console.log("createFile-catch exception:", error.message)
  }    
}

export default _SW20030;