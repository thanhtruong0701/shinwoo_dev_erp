'use strict';
const Helpers = use('Helpers');
const Antl = use('Antl');
const Utils = use('Utils');
const DBService = use('DBService');
var Excel = use('exceljs');
var workbook = new Excel.Workbook();
const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

class rptswso420 {
  async rptswso01_Test({ request, response, auth }) {
    console.log('Entering rptswsofx010');
    try {
      /****************************** Get Param *********************************/
      let { para } = request.get(['para']);
      /********* Parse param to json ********/
      var item = JSON.parse(para);
      const user = await auth.getUser();
      const p_crt_by = user.USER_ID;
      const p_language = request.header('accept-language', 'ENG');

      var file_nm = [item.P_FILE_NAME_NEW];
      var file_type = '.xlsx';
      var full_nm = file_nm + file_type;
      var file_new = file_nm + p_crt_by + file_type;
      var _resourcesPath = 'report/sw/so' + '/' + 'test01.xlsx';
      var _store = 'SW_SEL_SWSO01_NOCACHE';
      var _store2 = 'SW_SEL_SWSO01_NOCACHE';
      var _param = [item.p_company_pk, item.p_month, item.p_month_to, item.p_item];
      console.log(_store, _store2);

      /***************************** Return failed ****************************/
      if (!user) {
        return response.send(Utils.response(false, 'Request failed!', null));
      } else {
        /****************************** Begin call store and write excel *********/
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

        // Xử lý dữ liệu từ 2 store database
        console.log('Dữ liệu dt_m (Master):', dt_m.length, 'records');
        console.log('Dữ liệu dt_m2 (Detail):', dt_m2.length, 'records');

        // Tạo mapping giữa PO_ITEM và dữ liệu master
        const poMasterMap = {};
        dt_m.forEach(master => {
          if (master.PO_ITEM) {
            poMasterMap[master.PO_ITEM] = master;
          }
        });

        // Tạo mapping giữa PO_ITEM và dữ liệu detail (size & quantity)
        const poDetailMap = {};
        dt_m2.forEach(detail => {
          console.log(`Detail record: PO_ITEM=${detail.PO_ITEM}, SIZE_NUM=${detail.SIZE_NUM}, SIZE_NUM_P1=${detail.SIZE_NUM_P1}, QTY=${detail.QTY}`);
          if (!detail.PO_ITEM || !detail.SIZE_NUM) return;

          if (!poDetailMap[detail.PO_ITEM]) {
            poDetailMap[detail.PO_ITEM] = [];
          }

          const existingIndex = poDetailMap[detail.PO_ITEM].findIndex(existing => existing.SIZE_NUM.toString() === detail.SIZE_NUM.toString());

          if (existingIndex === -1) {
            poDetailMap[detail.PO_ITEM].push({
              SIZE_NUM: detail.SIZE_NUM,
              SIZE_NUM_P1: detail.SIZE_NUM_P1 || detail.SIZE_NUM,
              QTY: parseInt(detail.QTY) || 0, // Đảm bảo QTY là số
              STYLE_NAME: detail.STYLE_NAME
            });
          }
        });

        // Chỉ xử lý những PO_ITEM có cả trong master và detail
        const validPoItems = Object.keys(poMasterMap).filter(po => poDetailMap[po] && poDetailMap[po].length > 0);
        console.log(`Tìm thấy ${validPoItems.length} PO hợp lệ có dữ liệu size`);

        // Sắp xếp lại danh sách PO theo thứ tự
        const uniquePoData = validPoItems.map(poItem => poMasterMap[poItem]);
        console.log(`Xử lý ${uniquePoData.length} PO với đầy đủ dữ liệu`);

        // Tạo nhiều bản sao của template theo layout 2x2
        const TEMPLATE_WIDTH = 8;
        const TEMPLATE_HEIGHT = 29;
        const VERTICAL_SPACING = 1;

        // Sửa: dùng for...of với await để đảm bảo tuần tự
        for (let index = 0; index < uniquePoData.length; index++) {
          const po_data = uniquePoData[index];
          const sizeDataForLot = poDetailMap[po_data.PO_ITEM] || [];
          console.log(`PO_ITEM ${po_data.PO_ITEM} có ${sizeDataForLot.length} kích thước`);

          // Tính toán vị trí dựa trên lưới 2x2
          const pageIndex = Math.floor(index / 4);
          const positionInPage = index % 4;
          const row = Math.floor(positionInPage / 2);
          const col = positionInPage % 2;

          // Tính toán vị trí chính xác
          const startRow = pageIndex * (TEMPLATE_HEIGHT * 2 + VERTICAL_SPACING) + row * (TEMPLATE_HEIGHT + VERTICAL_SPACING) + 1;
          const startCol = col * TEMPLATE_WIDTH + 1;

          console.log(`Tạo template ${index + 1} cho PO_ITEM ${po_data.PO_ITEM} tại trang ${pageIndex + 1}, vị trí ${positionInPage + 1} (hàng ${row}, cột ${col})`);

          // Sửa: await createTemplate
          await createTemplate(worksheet, po_data, sizeDataForLot, index + 1, startRow, startCol);
        }

        // Sửa: khai báo createTemplate là async
        async function createTemplate(worksheet, po_data, sizeDataForLot, index, startRow, startCol) {
          console.log(`Starting to create template for PO_ITEM: ${po_data.PO_ITEM}, at row: ${startRow}, col: ${startCol}`);
          setCellStyles(worksheet, startRow, startCol);
          setColumnWidths(worksheet);
          setRowHeights(worksheet, startRow);
          mergeCells(worksheet, startRow, startCol);
          setBorders(worksheet, startRow, startCol);
          setCellFill(worksheet, startRow, startCol);
          fillSizeAndQuantityData(worksheet, sizeDataForLot, po_data, startRow, startCol);
          fillMasterPONo(worksheet, po_data, sizeDataForLot, startRow, startCol);
          // addLogoImage(workbook, worksheet, startRow, startCol);
          // Sửa: await addQRCode
          await addQRCode(workbook, worksheet, po_data, startRow, startCol);
          console.log(`Template creation completed for PO_ITEM: ${po_data.PO_ITEM}`);
        }

        async function addQRCode(workbook, worksheet, po_data, startRow, startCol) {
          try {
            const itemBcData = po_data.ITEM_BC || '';
            if (!itemBcData) {
              console.log('Không có dữ liệu ITEM_BC để tạo QR code');
              return;
            }
            // Tạo QR code buffer
            const qrBuffer = await QRCode.toBuffer(itemBcData, {
              type: 'png',
              width: 150,
              margin: 2,
              color: {
                dark: '#000000',
                light: '#FFFFFF'
              }
            });
            // Thêm QR code vào workbook
            const qrImageId = workbook.addImage({
              buffer: qrBuffer,
              extension: 'png'
            });
            // Vị trí G2:G4 (theo startRow/startCol)
            const qrStartCol = startCol + 7 - 1; // G là cột thứ 7, startCol là cột bắt đầu
            const qrStartRow = startRow - 1; // G2: row 2, startRow là hàng bắt đầu
            const qrEndCol = startCol + 7; // h
            const qrEndRow = startRow + 2; // h4
            worksheet.addImage(qrImageId, {
              tl: { col: qrStartCol, row: qrStartRow },
              br: { col: qrEndCol, row: qrEndRow }
            });
            console.log(`QR code đã được thêm vào vùng G${qrStartRow + 1}:G${qrEndRow} để PO_ITEM: ${po_data.PO_ITEM}`);
          } catch (error) {
            console.error('Lỗi khi tạo QR code:', error);
          }
        }

        function fillMasterPONo(worksheet, po_data, sizeDataForLot, startRow, startCol) {
          // Fill MASTER_PO_NO
          if (po_data && po_data.MASTER_PO_NO) {
            const cell = worksheet.getCell(startRow + 6, startCol + 2);
            cell.value = po_data.MASTER_PO_NO;
            cell.font = { size: 12, bold: true, name: 'Arial' };
            cell.alignment = {
              vertical: 'middle',
              horizontal: 'center',
              shrinkToFit: true
            };
            console.log('MASTER_PO_NO filled:', po_data.MASTER_PO_NO);
          }

          // Fill ITEM_CODE
          if (po_data && po_data.ITEM_CODE) {
            const cell = worksheet.getCell(startRow + 5, startCol + 2);
            cell.value = po_data.ITEM_CODE;
            cell.font = { size: 12, bold: true, name: 'Arial' };
            cell.alignment = {
              vertical: 'middle',
              horizontal: 'center',
              shrinkToFit: true
            };
            console.log('ITEM_CODE filled:', po_data.ITEM_CODE);
          }

          // Fill FACTORY_NAME
          if (po_data && po_data.FACTORY_NAME) {
            const cell = worksheet.getCell(startRow + 4, startCol + 2);
            cell.value = po_data.FACTORY_NAME;
            cell.font = { size: 14, bold: true, name: 'Arial' };
            cell.alignment = {
              vertical: 'middle',
              horizontal: 'center',
              shrinkToFit: true
            };
            console.log('FACTORY_NAME filled:', po_data.FACTORY_NAME);
          }

          // Fill ITEM_NAME
          if (po_data && po_data.ITEM_NAME) {
            const cell = worksheet.getCell(startRow + 3, startCol + 2);
            cell.value = po_data.ITEM_NAME;
            cell.font = { size: 15, bold: true, name: 'Arial' };
            cell.alignment = {
              vertical: 'middle',
              horizontal: 'center',
              shrinkToFit: true
            };
            console.log('ITEM_NAME filled:', po_data.ITEM_NAME);
          }

          // Fill PO_ITEM và STYLE_NAME
          if (sizeDataForLot && sizeDataForLot.length > 0) {
            const firstItem = sizeDataForLot[0];

            // Fill PO_ITEM
            if (firstItem.PO_ITEM || po_data.PO_ITEM) {
              const cell = worksheet.getCell(startRow + 7, startCol + 2);
              cell.value = firstItem.PO_ITEM || po_data.PO_ITEM;
              cell.font = { size: 12, bold: true, name: 'Arial', color: { argb: 'FFFF0000' } };
              cell.alignment = {
                vertical: 'middle',
                horizontal: 'center',
                wrapText: true
              };
              console.log('PO_ITEM filled:', cell.value);
            }

            // Fill STYLE_NAME
            if (firstItem.STYLE_NAME || po_data.STYLE_NAME) {
              const cell = worksheet.getCell(startRow + 8, startCol + 2);
              cell.value = firstItem.STYLE_NAME || po_data.STYLE_NAME;
              cell.font = { size: 12, bold: true, name: 'Arial' };
              cell.alignment = {
                vertical: 'middle',
                horizontal: 'center',
                wrapText: true
              };
              console.log('STYLE_NAME filled:', cell.value);
            }
          }

          // ===== TÍNH TỔNG BẰNG CÔNG THỨC EXCEL =====
          const totalCellText = worksheet.getCell(startRow + 10, startCol + 2); // C11

          // Tạo công thức SUM cho 2 vùng D13:D25 và H13:H25
          const dStartRow = startRow + 12; // D13
          const dEndRow = startRow + 24; // D25
          const hStartRow = startRow + 12; // H13
          const hEndRow = startRow + 24; // H25

          // LUÔN LUÔN tính tổng QTY thực tế, không chia cho 2
          const formula = `=SUM(D${dStartRow}:D${dEndRow})+SUM(H${hStartRow}:H${hEndRow})`;

          totalCellText.value = { formula: formula };
          totalCellText.font = { size: 11, bold: true, name: 'Arial', color: { argb: 'FFFF0000' } };
          totalCellText.alignment = {
            vertical: 'middle',
            horizontal: 'right',
            wrapText: true
          };

          // Fill đơn vị - hiển thị PRS nếu UNIT = 'prs', ngược lại hiển thị PCS
          const totalPcsCell = worksheet.getCell(startRow + 10, startCol + 7);
          totalPcsCell.value = po_data.UNIT === 'prs' ? 'PRS' : po_data.UNIT || 'PCS';
          totalPcsCell.font = { size: 11, bold: true, name: 'Arial' };
          totalPcsCell.alignment = {
            vertical: 'middle',
            horizontal: 'left',
            wrapText: true
          };

          console.log('Excel formula set:', formula);
          console.log('Unit set:', totalPcsCell.value);
        }
        function fillSizeAndQuantityData(worksheet, sizeDataForLot, po_data, startRow, startCol) {
          console.log('Entering fillSizeAndQuantityData');
          console.log('sizeDataForLot count:', sizeDataForLot.length);
          console.log('sizeDataForLot:', JSON.stringify(sizeDataForLot, null, 2)); // Thêm log để kiểm tra dữ liệu

          const sortedSizes = [...sizeDataForLot].sort((a, b) => {
            const aNum = parseFloat(a.SIZE_NUM);
            const bNum = parseFloat(b.SIZE_NUM);
            if (!isNaN(aNum) && !isNaN(bNum)) {
              return aNum - bNum;
            }
            return a.SIZE_NUM.localeCompare(b.SIZE_NUM);
          });

          console.log(
            'Sorted sizes:',
            JSON.stringify(
              sortedSizes.map(s => ({ SIZE_NUM: s.SIZE_NUM, SIZE_NUM_P1: s.SIZE_NUM_P1, QTY: s.QTY })),
              null,
              2
            )
          );

          const columnGroups = [
            { sizeCol: startCol + 1, sizeP1Col: startCol + 2, qtyCol: startCol + 3 },
            { sizeCol: startCol + 5, sizeP1Col: startCol + 6, qtyCol: startCol + 7 }
          ];

          const maxItemsPerColumn = 13;

          sortedSizes.forEach((item, index) => {
            const groupIndex = Math.floor(index / maxItemsPerColumn);
            if (groupIndex >= columnGroups.length) {
              console.log(`Too many sizes, skipping ${item.SIZE_NUM}`);
              return;
            }

            const { sizeCol, sizeP1Col, qtyCol } = columnGroups[groupIndex];
            const rowOffset = index % maxItemsPerColumn;
            const currentRow = startRow + 12 + rowOffset;

            // Fill SIZE_NUM
            const sizeCell = worksheet.getCell(currentRow, sizeCol);
            sizeCell.value = item.SIZE_NUM;
            sizeCell.alignment = { vertical: 'middle', horizontal: 'center' };
            sizeCell.font = { size: 14 };

            // Fill SIZE_NUM_P1 (sửa từ SIZE_NUM2)
            console.log(`Filling SIZE_NUM_P1=${item.SIZE_NUM_P1} at row ${currentRow}, col ${sizeP1Col}`);
            const sizeP1Cell = worksheet.getCell(currentRow, sizeP1Col);
            sizeP1Cell.value = item.SIZE_NUM_P1; // Sửa thành SIZE_NUM_P1
            sizeP1Cell.alignment = { vertical: 'middle', horizontal: 'center' };
            sizeP1Cell.font = { size: 14 };

            // Fill quantity
            const qtyCell = worksheet.getCell(currentRow, qtyCol);
            qtyCell.value = item.QTY;
            qtyCell.alignment = { vertical: 'middle', horizontal: 'right' };
            qtyCell.font = { size: 14 };
          });

          console.log(`Processed ${sortedSizes.length} sizes for PO_ITEM: ${po_data.PO_ITEM}`);
        }

        function setCellStyles(worksheet, startRow, startCol) {
          const cellValues = {
            B2: 'SHINWOO VINA CO.,LTD',
            B3: 'GOODS INFORMATION',
            B4: 'Item',
            C4: 'US STICKER',
            B5: 'CONPANY:',
            B6: 'ITEM_CODE:',
            B29: 'Name',
            B7: 'PO NO:',
            B8: 'PO LOT:',
            B9: 'STYLE-COLOR:',
            B11: 'TOTAL:',
            B12: 'SIZE',
            C12: 'SIZE', // Thêm header cho cột SIZE thứ 2
            D12: 'QUANTITY', // Di chuyển QUANTITY sang cột D
            H11: 'PCS', // Di chuyển PCS sang cột H
            F12: 'SIZE',
            G12: 'SIZE', // Thêm header cho cột SIZE thứ 2 bên phải
            H12: 'QUANTITY', // Di chuyển QUANTITY sang cột H
            B26: '* Chú ý: Trước khi đóng gói phải đảm bảo thông tin trên tem chính xác bao gồm: màu, số barcode, số lượng…',
            F27: 'ĐÃ GÓI ĐỦ (SIZE):',
            B28: 'SECTION',
            C28: 'CHECKING',
            E28: 'CHECK THÔNG TIN',
            E29: 'MÀU SẮC:  ⬜',
            G29: 'KÍCH THƯỚC: ⬜',
            E30: 'THÔNG TIN:⬜',
            H30: 'SỐ LƯỢNG:⬜',
            G30: 'CHẤT LƯỢNG:⬜'
          };

          // Định nghĩa số lượng khoảng trắng và các thuộc tính đặc biệt cho mỗi ô chứa ký tự vuông
          const squareConfig = {
            E29: { spaces: 4, squareSize: 10, wrapText: true },
            E30: { spaces: 7, squareSize: 10, wrapText: false },
            G29: { spaces: 6, squareSize: 10, wrapText: false },
            G30: { spaces: 2, squareSize: 10, wrapText: false },
            // F29: { spaces: 4, squareSize: 10, wrapText: false }, // Add F29
            H30: { spaces: 4, squareSize: 10, wrapText: false }
          };

          Object.entries(cellValues).forEach(([cellAddress, value]) => {
            const [col, row] = cellAddress.match(/([A-Z]+)(\d+)/).slice(1);
            const newRow = parseInt(row) + startRow - 1;
            const newCol = String.fromCharCode(col.charCodeAt(0) + startCol - 1);
            const newCellAddress = `${newCol}${newRow}`;

            const cell = worksheet.getCell(newCellAddress);

            if (['E30', 'G29', 'G30', 'E29', 'H30'].includes(cellAddress)) {
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
              cell.value = {
                richText: [
                  { text: text.trim() }, // Text without extra spaces
                  {
                    text: '⬜',
                    font: { size: config.squareSize, verticalAlign: 'superscript' }
                  }
                ]
              };

              // Đặt giá trị ô và áp dụng định dạng rich text
              // cell.value = {
              //   richText: [
              //     { text: text.trim() },
              //     {
              //       text: '\u00A0'.repeat(config.spaces),
              //       font: { size: 10 },
              //       alignment: {
              //         vertical: 'middle',
              //         horizontal: 'center'
              //       }
              //     },
              //     {
              //       text: '⬜',
              //       font: {
              //         size: config.squareSize,
              //         verticalAlign: 'superscript'
              //       }
              //     }
              //   ]
              // };

              // Điều chỉnh độ rộng cột
              worksheet.getColumn(newCol).width = 25 + config.spaces / 2;

              // Đặt chiều cao cố định cho dòng
              worksheet.getRow(newRow).height = 22.5;
            } else {
              cell.value = value;

              if (['B3', 'B4', 'B2'].includes(cellAddress)) {
                cell.font = { bold: true, size: 13, name: 'Arial' };
                cell.alignment = { vertical: 'middle', horizontal: 'center' };
              } else if (['B5', 'C7'].includes(cellAddress)) {
                cell.font = { size: 12, bold: false, name: 'Arial' };
                cell.alignment = { vertical: 'middle', horizontal: 'left' };
              } else if (['C5', 'C7', 'C8', 'C9'].includes(cellAddress)) {
                cell.font = { size: 12, bold: true, name: 'Arial' };
                cell.alignment = {
                  vertical: 'middle',
                  horizontal: 'center',
                  wrapText: true
                };
              } else if (['D12', 'B12', 'C12', 'F12', 'G12', 'H12'].includes(cellAddress)) {
                // Cập nhật header columns
                cell.font = { size: 11, bold: true, name: 'Arial' };
                cell.alignment = {
                  vertical: 'middle',
                  horizontal: 'center',
                  wrapText: true
                };
              } else if (['B11', 'H11'].includes(cellAddress)) {
                // Cập nhật H11 cho PCS
                cell.font = { size: 11, bold: true, name: 'Arial' };
                cell.alignment = {
                  vertical: 'middle',
                  horizontal: 'left',
                  wrapText: true
                };
              } else if (['B28', 'C28', 'E28', 'B29'].includes(cellAddress)) {
                cell.font = { size: 11, bold: false, name: 'Arial' };
                cell.alignment = {
                  vertical: 'middle',
                  horizontal: 'center',
                  wrapText: true
                };
              } else if (['B9'].includes(cellAddress)) {
                cell.font = { size: 10, bold: false, name: 'Arial' };
                cell.alignment = {
                  vertical: 'middle',
                  horizontal: 'left',
                  shrinkToFit: true
                };
              } else if (['F27'].includes(cellAddress)) {
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
                cell.alignment = {
                  vertical: 'middle',
                  horizontal: 'left',
                  wrapText: true
                };
              }
            }
          });
        }

        function setColumnWidths(worksheet) {
          const columnWidths = {
            A: 3.44,
            B: 12, // Giảm width cho cột B
            C: 12, // Giảm width cho cột C
            D: 12, // Width cho cột D (QUANTITY)
            E: 0.88,
            F: 12, // Giảm width cho cột F
            G: 14, // Giảm width cho cột G
            H: 12, // Width cho cột H (QUANTITY)
            I: 5.67,
            J: 12, // Giảm width các cột tiếp theo
            K: 12,
            L: 12,
            M: 0.88,
            N: 12,
            O: 14,
            P: 12,
            Q: 12
          };
          Object.entries(columnWidths).forEach(([col, width]) => {
            worksheet.getColumn(col).width = width;
          });
        }

        function setRowHeights(worksheet, startRow) {
          const rowHeights = {
            1: 9,
            2: 27,
            3: 20.4,
            4: 20.4,
            5: 32.3,
            6: 22.5,
            7: 22.5,
            8: 22.5,
            9: 22.5,
            10: 8.3,
            11: 22.5,
            12: 18,
            13: 18,
            14: 18,
            15: 18,
            16: 18,
            17: 18,
            18: 18,
            19: 18,
            20: 18,
            21: 18,
            22: 18,
            23: 18,
            24: 18,
            25: 18,
            26: 22,
            27: 21.8,
            28: 22.5,
            29: 22.5
          };
          Object.entries(rowHeights).forEach(([row, height]) => {
            worksheet.getRow(startRow + parseInt(row) - 1).height = height;
          });
        }

        function mergeCells(worksheet, startRow, startCol) {
          const mercellranges = ['B2:F2', 'B12:C12', 'B3:F3', 'B4:F4', 'C5:H5', 'C6:H6', 'C7:H7', 'C8:H8', 'C9:H9', 'C11:G11', 'C28:D28', 'E28:H28', 'B29:B30', 'C29:D30', 'E29:F29', 'E30:F30', 'B26:H26'];

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
            { start: 'B6', end: 'H9' }, // Mở rộng sang cột H
            { start: 'B11', end: 'H11' } // Mở rộng sang cột H
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
          // Vùng header/thông tin
          setRegionBorder(worksheet, startRow + 0, startCol + 1, startRow + 10, startCol + 7, 'medium'); // B2:H11

          // Bảng size/quantity trái
          setRegionBorder(worksheet, startRow + 11, startCol + 1, startRow + 24, startCol + 3, 'medium'); // B12:D25
          // Bảng size/quantity phải
          setRegionBorder(worksheet, startRow + 11, startCol + 5, startRow + 24, startCol + 7, 'medium'); // F12:H25

          // Section checking
          setRegionBorder(worksheet, startRow + 28, startCol + 1, startRow + 29, startCol + 7, 'medium'); // B27:H29

          // Kẻ border mảnh cho các ô bên trong bảng size/quantity
          for (let row = startRow + 11; row <= startRow + 24; row++) {
            for (let col = startCol + 1; col <= startCol + 3; col++) {
              setCellThinBorder(worksheet, row, col);
            }
            for (let col = startCol + 5; col <= startCol + 7; col++) {
              setCellThinBorder(worksheet, row, col);
            }
          }

          // Kẻ border đầy đủ cho các vùng yêu cầu của bạn:
          // Hàng 5 đến 9 (B5:H9)
          for (let row = startRow + 4; row <= startRow + 8; row++) {
            for (let col = startCol + 1; col <= startCol + 7; col++) {
              setCellThinBorder(worksheet, row, col);
            }
          }
          // Hàng 11 (B11:H11)
          for (let col = startCol + 1; col <= startCol + 7; col++) {
            setCellThinBorder(worksheet, startRow + 10, col);
          }
          // Hàng 18 đến 30 (B18:H30)
          for (let row = startRow + 27; row <= startRow + 29; row++) {
            for (let col = startCol + 1; col <= startCol + 7; col++) {
              setCellThinBorder(worksheet, row, col);
            }
          }
        }

        // Border dày cho vùng ngoài
        function setRegionBorder(worksheet, fromRow, fromCol, toRow, toCol, style = 'medium') {
          for (let row = fromRow; row <= toRow; row++) {
            for (let col = fromCol; col <= toCol; col++) {
              const cell = worksheet.getCell(row, col);
              cell.border = {
                top: row === fromRow ? { style } : undefined,
                left: col === fromCol ? { style } : undefined,
                bottom: row === toRow ? { style } : undefined,
                right: col === toCol ? { style } : undefined
              };
            }
          }
        }

        // Border mảnh cho các ô bên trong
        function setCellThinBorder(worksheet, row, col) {
          const cell = worksheet.getCell(row, col);
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
        }

        const setupExcelForA4Printing = (worksheet, totalCopies) => {
          const startColumn = 'A';
          const endColumn = 'P';
          const rowsPerPage = 59; // Số dòng cố định
          const colsPerPage = 14; // Số cột (từ A đến N)

          // Tính tổng số trang dựa trên tổng số bản sao, 4 bản sao trên mỗi trang
          const totalPages = Math.ceil(totalCopies / 4); // 4 bản sao trên mỗi trang
          const totalRows = totalPages * rowsPerPage;

          // Thiết lập vùng in
          worksheet.pageSetup.printArea = `${startColumn}1:${endColumn}${totalRows}`;

          // Các thiết lập khác
          worksheet.pageSetup.fitToPage = false;
          worksheet.pageSetup.scale = 62;
          worksheet.pageSetup.paperSize = 9;
          worksheet.pageSetup.margins = {
            left: 0,
            right: 0,
            top: 0.25,
            bottom: 0,
            header: 0,
            footer: 0
          };
          worksheet.pageSetup.orientation = 'portrait';
          worksheet.pageSetup.horizontalCentered = true;

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
    } catch (e) {
      console.log(e);
      return response.send(Utils.response(false, e.message, null));
    }
  }
}

module.exports = rptswso420;
