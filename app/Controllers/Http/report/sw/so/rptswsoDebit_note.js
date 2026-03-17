"use strict";
const Helpers = use("Helpers");
const Antl = use("Antl");
const Utils = use("Utils");
const DBService = use("DBService");
const ExcelJS = require("exceljs");
const fs = require("fs");

class rptswsoDebit_note {
  async rptswso01_Test({ request, response, auth }) {
    console.log("=== Entering rptswso01_Test ===");
    try {
      /****************************** Get Param *********************************/
      let { para } = request.get(["para"]);
      let item = JSON.parse(para);

      const user = await auth.getUser();
      if (!user) {
        return response.send(Utils.response(false, "Request failed!", null));
      }

      const p_crt_by = user.USER_ID;
      const p_language = request.header("accept-language", "ENG");

      const file_nm = item.P_FILE_NAME_NEW || "Report";
      const file_type = ".xlsx";
      var file_new = file_nm + file_type;

      /****************************** Define Stores ********************************/
      const stores = [
        {
          name: "SW_LG_USSOFT_DEBITNOTE_NOCACHE",
          params: [item.p_date_from, item.p_company_pk],
          // sheetNameColumn: "BILL_TO", // Lấy tên sheet từ cột này
          defaultSheetName: "Tab-01", // Tên mặc định nếu không có data
        },
        {
          name: "SW_LG_USSOFT_DEBITNOTE_1_NOCACHE",
          params: [item.p_date_from, item.p_company_pk],
          sheetNameColumn: "BILL_TO",
          defaultSheetName: "Tab-02",
        },
        {
          name: "SW_LG_USSOFT_DEBITNOTE_2_NOCACHE",
          params: [item.p_date_from, item.p_company_pk],
          sheetNameColumn: "BILL_TO",
          defaultSheetName: "Tab-03",
        },
        {
          name: "SW_LG_USSOFT_DEBITNOTE_3_NOCACHE",
          params: [item.p_date_from, item.p_company_pk],
          sheetNameColumn: "BILL_TO",
          defaultSheetName: "Tab-04",
        },
        {
          name: "SW_LG_USSOFT_DEBITNOTE_4_NOCACHE",
          params: [item.p_date_from, item.p_company_pk],
          sheetNameColumn: "BILL_TO",
          defaultSheetName: "Tab-05",
        },
        {
          name: "SW_LG_USSOFT_DEBITNOTE_5_NOCACHE",
          params: [item.p_date_from, item.p_company_pk],
          sheetNameColumn: "BILL_TO",
          defaultSheetName: "Tab-06",
        },
        {
          name: "SW_LG_USSOFT_DEBITNOTE_6_NOCACHE",
          params: [item.p_date_from, item.p_company_pk],
          sheetNameColumn: "BILL_TO",
          defaultSheetName: "Tab-07",
        },
        {
          name: "SW_LG_USSOFT_DEBITNOTE_7_NOCACHE",
          params: [item.p_date_from, item.p_company_pk],
          sheetNameColumn: "BILL_TO",
          defaultSheetName: "Tab-08",
        },
        {
          name: "SW_LG_USSOFT_DEBITNOTE_8_NOCACHE",
          params: [item.p_date_from, item.p_company_pk],
          sheetNameColumn: "BILL_TO",
          defaultSheetName: "Tab-09",
        },
        {
          name: "SW_LG_USSOFT_DEBITNOTE_9_NOCACHE",
          params: [item.p_date_from, item.p_company_pk],
          sheetNameColumn: "BILL_TO",
          defaultSheetName: "Tab-10",
        },
        {
          name: "SW_LG_USSOFT_DEBITNOTE_10_NOCACHE",
          params: [item.p_date_from, item.p_company_pk],
          sheetNameColumn: "BILL_TO",
          defaultSheetName: "Tab-11",
        },
        {
          name: "SW_LG_USSOFT_DEBITNOTE_11_NOCACHE",
          params: [item.p_date_from, item.p_company_pk],
          sheetNameColumn: "BILL_TO",
          defaultSheetName: "Tab-12",
        },
        {
          name: "SW_LG_USSOFT_DEBITNOTE_12_NOCACHE",
          params: [item.p_date_from, item.p_company_pk],
          sheetNameColumn: "BILL_TO",
          defaultSheetName: "Tab-13",
        },
        {
          name: "SW_LG_USSOFT_DEBITNOTE_13_NOCACHE",
          params: [item.p_date_from, item.p_company_pk],
          sheetNameColumn: "BILL_TO",
          defaultSheetName: "Tab-14",
        },
        {
          name: "SW_LG_USSOFT_DEBITNOTE_14_NOCACHE",
          params: [item.p_date_from, item.p_company_pk],
          sheetNameColumn: "BILL_TO",
          defaultSheetName: "Tab-15",
        },
        {
          name: "SW_LG_USSOFT_DEBITNOTE_15_NOCACHE",
          params: [item.p_date_from, item.p_company_pk],
          sheetNameColumn: "BILL_TO",
          defaultSheetName: "Tab-16",
        },
        {
          name: "SW_LG_USSOFT_DEBITNOTE_16_NOCACHE",
          params: [item.p_date_from, item.p_company_pk],
          sheetNameColumn: "BILL_TO",
          defaultSheetName: "Tab-17",
        },
        {
          name: "SW_LG_USSOFT_DEBITNOTE_17_NOCACHE",
          params: [item.p_date_from, item.p_company_pk],
          sheetNameColumn: "BILL_TO",
          defaultSheetName: "Tab-18",
        },
        {
          name: "SW_LG_USSOFT_DEBITNOTE_18_NOCACHE",
          params: [item.p_date_from, item.p_company_pk],
          sheetNameColumn: "BILL_TO",
          defaultSheetName: "Tab-19",
        },
        {
          name: "SW_LG_USSOFT_DEBITNOTE_19_NOCACHE",
          params: [item.p_date_from, item.p_company_pk],
          sheetNameColumn: "BILL_TO",
          defaultSheetName: "Tab-20",
        },
        {
          name: "SW_LG_USSOFT_DEBITNOTE_20_NOCACHE",
          params: [item.p_date_from, item.p_company_pk],
          sheetNameColumn: "BILL_TO",
          defaultSheetName: "Tab-21",
        },
      ];

      /****************************** Excel ****************************/
      const workbook = new ExcelJS.Workbook();
      console.log("Workbook created");

      /****************************** Process Each Store ********************************/
      for (let i = 0; i < stores.length; i++) {
        const storeConfig = stores[i];
        console.log(
          `\n=== Processing Sheet ${i + 1}/${stores.length}: ${
            storeConfig.sheetName
          } ===`
        );

        try {
          // Call Store
          const dt_m = await DBService.callProcCursor(
            storeConfig.name,
            storeConfig.params,
            p_language,
            p_crt_by
          );

          let dataToUse = dt_m || [];
          console.log(`Data fetched: ${dataToUse.length} rows`);

          // Kiểm tra nếu có data từ params (chỉ cho sheet đầu tiên)
          if (
            i === 0 &&
            item.p_data &&
            Array.isArray(item.p_data) &&
            item.p_data.length > 0
          ) {
            dataToUse = item.p_data;
            console.log("Using p_data from params");
          }

          // BẬT LẠI LOGIC NÀY ĐỂ BỎ QUA SHEET KHÔNG CÓ DỮ LIỆU
          if (!dataToUse || dataToUse.length === 0) {
            console.log(
              `⚠️ Skipping sheet "${storeConfig.sheetName}" - No data`
            );
            continue; // ← BỎ QUA sheet này và chuyển sang sheet tiếp theo
          }

          // LẤY TÊN SHEET TỪ DỮ LIỆU
          let sheetName = storeConfig.defaultSheetName;

          if (storeConfig.sheetNameColumn && dataToUse[0]) {
            const dynamicName = dataToUse[0][storeConfig.sheetNameColumn];
            if (dynamicName && dynamicName.toString().trim() !== "") {
              sheetName = dynamicName
                .toString()
                .trim()
                .replace(/[\\\/\?\*\[\]]/g, "")
                .substring(0, 31);

              console.log(
                `✓ Using dynamic sheet name: "${sheetName}" from column ${storeConfig.sheetNameColumn}`
              );
            }
          }

          let finalSheetName = sheetName;
          const worksheet = workbook.addWorksheet(finalSheetName);
          const startRow = 12;
          const startCol = 2;

          await createReportHeader(worksheet, item, dataToUse);
          await createDataTemplate(worksheet, dataToUse, startRow, startCol);
          await createReportFooter(worksheet, startRow, dataToUse);

          const dataLength = dataToUse ? dataToUse.length : 0;
          const totalRows = startRow + dataLength + 8;

          await setupExcelForA4Printing(worksheet, totalRows, startRow);

          fillDataToWorksheet(worksheet, dataToUse, startRow + 1, startCol);
          console.log(`✓ Data filled: ${dataToUse.length} rows`);

          console.log(`✓ Sheet "${finalSheetName}" completed`);
        } catch (sheetError) {
          console.error(
            `❌ ERROR in sheet ${storeConfig.name}:`,
            sheetError.message
          );
          // Có thể thêm continue ở đây nếu muốn bỏ qua cả sheet lỗi
          // continue;
        }
      }

      // Kiểm tra workbook
      if (workbook.worksheets.length === 0) {
        console.error("No worksheets in workbook!");
        return response.send(
          Utils.response(false, "Không thể tạo workbook", null)
        );
      }

      console.log(`\n=== Writing file: ${file_new} ===`);
      const reportFile = Helpers.tmpPath(file_new);
      console.log("File path:", reportFile);

      // Write file với options
      await workbook.xlsx.writeFile(reportFile, {
        useSharedStrings: false,
        useStyles: true,
      });

      console.log("File written successfully");

      // Kiểm tra file tồn tại
      if (!fs.existsSync(reportFile)) {
        console.error("File does not exist after writing!");
        return response.send(
          Utils.response(false, "File creation failed", null)
        );
      }

      const fileSize = fs.statSync(reportFile).size;
      console.log("File size:", fileSize, "bytes");

      if (fileSize === 0) {
        console.error("File is empty!");
        return response.send(Utils.response(false, "Empty file created", null));
      }

      console.log("=== Sending file to client ===");
      return response.attachment(reportFile, file_new);

      /****************************** Inner functions ****************************/

      async function createReportHeader(worksheet, item, dataToUse) {
        const datarow = dataToUse && dataToUse.length > 0 ? dataToUse[0] : {};
        worksheet.getCell(1, 2).value = "DEBIT NOTE ";
        //right
        worksheet.getCell(3, 9).value = datarow.TITLE_DATE;
        worksheet.getCell(3, 10).value = datarow.FROM_DT;

        worksheet.getCell(5, 8).value = datarow.TITLE_FROM;
        worksheet.getCell(5, 9).value = datarow.SW_TO;

        worksheet.getCell(6, 8).value = datarow.TITLE_ADDRESS;
        worksheet.getCell(6, 9).value = datarow.SW_ADDR;
        worksheet.getCell(7, 9).value = datarow.SW_ADDR_1;

        worksheet.getCell(8, 8).value = datarow.TITLE_TEL;
        worksheet.getCell(8, 9).value = datarow.SW_TEL;

        worksheet.getCell(9, 8).value = datarow.TITLE_FAX;
        worksheet.getCell(9, 9).value = datarow.SW_FAX;

        worksheet.getCell(10, 8).value = datarow.TITLE_EMAIL;
        worksheet.getCell(10, 9).value = datarow.SW_EMAIL;
        // left

        worksheet.getCell(5, 2).value = datarow.TITLE_TO;
        worksheet.getCell(5, 3).value = datarow.CUST_TO;

        worksheet.getCell(6, 2).value = datarow.TITLE_ADDRESS;
        worksheet.getCell(6, 3).value = datarow.CUST_ADDR;
        worksheet.getCell(7, 3).value = datarow.CUST_ADDR_1;

        worksheet.getCell(8, 2).value = datarow.TITLE_TEL;
        worksheet.getCell(8, 3).value = datarow.CUST_TEL;

        worksheet.getCell(9, 2).value = datarow.TITLE_FAX;
        worksheet.getCell(9, 3).value = datarow.CUST_FAX;

        Style_Cells(worksheet.getCell(1, 2), {
          font: { bold: true, size: 23 },
          alignment: {
            vertical: "middle",
            horizontal: "center",
            wrapText: true,
          },
        });

        Style_Cells(
          [
            worksheet.getCell(3, 9),
            worksheet.getCell(3, 10),
            worksheet.getCell(5, 8),
            worksheet.getCell(5, 9),
            worksheet.getCell(6, 8),
            worksheet.getCell(6, 9),
            worksheet.getCell(7, 9),
            worksheet.getCell(8, 8),
            worksheet.getCell(8, 9),
            worksheet.getCell(9, 8),
            worksheet.getCell(9, 9),
            worksheet.getCell(10, 8),
            worksheet.getCell(10, 9),
            worksheet.getCell(5, 2),
            worksheet.getCell(5, 3),
            worksheet.getCell(6, 2),
            worksheet.getCell(6, 3),
            worksheet.getCell(7, 3),
            worksheet.getCell(8, 2),
            worksheet.getCell(8, 3),
            worksheet.getCell(9, 2),
            worksheet.getCell(9, 3),
          ],
          {
            font: { bold: true, size: 10 },
            alignment: { horizontal: "left" },
          }
        );

        Style_Cells([
          worksheet.getCell(3, 3),
          worksheet.getCell(4, 4),
          worksheet.getCell(4, 8),
          worksheet.getCell(4, 9),
        ]);

        worksheet.mergeCells(1, 2, 1, 12);
        worksheet.getRow(1).height = 60.8;
        worksheet.getRow(2).height = 5;
        worksheet.getRow(4).height = 5;
        for (let i = 5; i <= 10; i++) {
          worksheet.getRow(i).height = 25;
        }
      }
      async function createDataTemplate(
        worksheet,
        dataToUse,
        startRow,
        startCol
      ) {
        // Tạo table headers
        setDataTableHeaders(worksheet, startRow, startCol);
        // Set column widths
        setColumnWidths(worksheet, startCol);
        createTotalRow(worksheet, dataToUse, startRow, startCol);
      }

      async function createReportFooter(worksheet, startRow, dataToUse) {
        const datarow = dataToUse && dataToUse.length > 0 ? dataToUse[0] : {};
        const dataLength =
          dataToUse && dataToUse.length > 0 ? dataToUse.length : 0;
        const footerRow = startRow + dataLength + 2; // +1 for header, +1 for total row, +1 for spacing

        (worksheet.getCell(footerRow, 2).value = datarow.BENEFICIARY),
          (worksheet.getCell(footerRow + 1, 2).value = datarow.BANK_NAME),
          (worksheet.getCell(footerRow + 2, 2).value = datarow.BANK_ADDRESS),
          (worksheet.getCell(footerRow + 3, 2).value =
            datarow.ACCOUNT_NUMBER_VND),
          (worksheet.getCell(footerRow + 4, 2).value =
            datarow.ACCOUNT_NUMBER_USD),
          (worksheet.getCell(footerRow + 5, 2).value = datarow.SWIFT_CODE),
          (worksheet.getRow(footerRow).height = 25.5);
      }

      function setDataTableHeaders(worksheet, startRow, startCol) {
        const headers = [
          "SEQ",
          "BRAND",
          "FACTORY",
          "DELIVERY DATE",
          "LABEL TYPE",
          "STYLE #",
          "Q'TY (PCS)",
          "UNIT PRICE ($)",
          "AMOUNT ($)",
          "REMARK",
          "수출 신고 완료 여부",
          "수출 신고 일자",
        ];

        headers.forEach((header, index) => {
          const cell = worksheet.getCell(startRow, startCol + index);
          cell.value = header;
          cell.font = { name: "Arial", bold: true, size: 10 };
          cell.alignment = { vertical: "middle", horizontal: "center" };
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFD9D9D9" },
          };
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        });

        // Set header row height
        worksheet.getRow(startRow).height = 22.5;
      }
      function fillDataToWorksheet(worksheet, dataToUse, startRow, startCol) {
        if (!dataToUse || !Array.isArray(dataToUse) || dataToUse.length === 0) {
          return;
        }
        // Group data by Brand/Factory để merge
        const brandGroups = [];
        let currentGroup = {
          brand: null,
          startRow: startRow,
          endRow: startRow,
        };

        dataToUse.forEach((rowData, index) => {
          const currentRow = startRow + index;
          const brandValue = rowData.FACTORY_NAME || rowData.BRAND || "";

          // Tạo cells - CẬP NHẬT: 12 cells thay vì 9
          const cells = Array.from({ length: 12 }, (_, i) =>
            worksheet.getCell(currentRow, startCol + i)
          );

          // Gán giá trị
          cells[0].value = rowData.SEQ || index + 1;
          cells[1].value = brandValue;
          cells[2].value = rowData.DELI_TO || "";
          cells[3].value = rowData.DELIVERY_DATE || "";
          cells[4].value = rowData.LABEL_TYPE || rowData.LABELTYPE || "";
          cells[5].value = rowData.STYLE || "";
          cells[6].value = rowData.OUT_QTY || 0;
          cells[7].value = rowData.PRICE || 0;
          cells[8].value = rowData.AMOUNT || 0;
          cells[9].value = rowData.BILL_TO || "";
          cells[10].value = rowData.COL_KOREAN_01 || ""; // 수출 신고 완료 여부
          cells[11].value = rowData.COL_KOREAN_02 || ""; // 수출 신고 일자

          // Apply style và border
          cells.forEach((cell) => {
            cell.font = { name: "Arial", size: 10 };
            cell.alignment = { vertical: "middle", horizontal: "center" };
            cell.border = {
              top: { style: "thin" },
              left: { style: "thin" },
              bottom: { style: "thin" },
              right: { style: "thin" },
            };
          });

          // Track brand groups
          if (currentGroup.brand === null) {
            currentGroup.brand = brandValue;
            currentGroup.startRow = currentRow;
          } else if (currentGroup.brand !== brandValue) {
            // Save previous group
            brandGroups.push({ ...currentGroup, endRow: currentRow - 1 });
            // Start new group
            currentGroup = {
              brand: brandValue,
              startRow: currentRow,
              endRow: currentRow,
            };
          }

          // Last row
          if (index === dataToUse.length - 1) {
            brandGroups.push({ ...currentGroup, endRow: currentRow });
          }
        });

        // Merge brand cells
        brandGroups.forEach((group) => {
          if (group.startRow < group.endRow) {
            try {
              worksheet.mergeCells(
                group.startRow,
                startCol + 1,
                group.endRow,
                startCol + 1
              );
              const mergedCell = worksheet.getCell(
                group.startRow,
                startCol + 1
              );
              mergedCell.alignment = {
                vertical: "middle",
                horizontal: "center",
              };
            } catch (mergeError) {
              console.error(
                `Cannot merge cells (${group.startRow}, ${group.endRow}):`,
                mergeError.message
              );
            }
          }
        });

        // SET ROW HEIGHTS SAU KHI MERGE
        const lastRow = startRow + dataToUse.length - 1;
        setRowHeights(worksheet, startRow, lastRow);
      }
      function createTotalRow(worksheet, dataToUse, startRow, startCol) {
        if (!dataToUse || !Array.isArray(dataToUse) || dataToUse.length === 0) {
          return;
        }
        const totalRow = startRow + dataToUse.length + 1; // Dòng ngay sau data cuối cùng
        // Tính tổng
        const totalQuantity = dataToUse.reduce(
          (sum, row) => sum + (parseFloat(row.OUT_QTY) || 0),
          0
        );
        const totalAmount = dataToUse.reduce(
          (sum, row) => sum + (parseFloat(row.AMOUNT) || 0),
          0
        );
        // Merge cells từ cột 1 đến cột 6 cho chữ "TOTAL"
        worksheet.mergeCells(totalRow, startCol, totalRow, startCol + 5);
        // Set giá trị
        const totalLabelCell = worksheet.getCell(totalRow, startCol);
        totalLabelCell.value = "G.TOTAL";

        Style_Cells(totalLabelCell, {
          font: { bold: true, size: 13 },
          alignment: {
            vertical: "middle",
            horizontal: "right",
            wrapText: true,
          },
          fill: {
            type: "pattern",
            alignment: "center",
            pattern: "solid",
            fgColor: { argb: "FFFFD966" },
          },
          border: {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          },
        });
        worksheet.getCell(totalRow, startCol + 6).value = totalQuantity;
        worksheet.getCell(totalRow, startCol + 8).value = totalAmount;
        Style_Cells(
          [
            worksheet.getCell(totalRow, startCol + 6),
            worksheet.getCell(totalRow, startCol + 7),
            worksheet.getCell(totalRow, startCol + 8),
            worksheet.getCell(totalRow, startCol + 9),
            worksheet.getCell(totalRow, startCol + 10),
            worksheet.getCell(totalRow, startCol + 11),
          ],
          {
            font: { bold: true, size: 13 },
            alignment: {
              vertical: "middle",
              horizontal: "center",
              wrapText: true,
            },
            fill: {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFFFD966" },
            },
            border: {
              top: { style: "thin" },
              left: { style: "thin" },
              bottom: { style: "thin" },
              right: { style: "thin" },
            },
          }
        );
      }

      function setColumnWidths(worksheet, startCol) {
        worksheet.getColumn(startCol - 1).width = 2;
        // CẬP NHẬT: 11 columns thay vì 9
        const columnWidths = [10, 16, 30, 18, 18, 15, 18, 21, 21, 18, 18, 18];
        columnWidths.forEach((width, index) => {
          worksheet.getColumn(startCol + index).width = width;
        });
      }

      function setRowHeights(worksheet, startRow, endRow) {
        // Set height cho tất cả các row từ startRow đến endRow
        for (let i = startRow; i <= endRow; i++) {
          worksheet.getRow(i).height = 25;
        }
      }
      async function setupExcelForA4Printing(worksheet, totalRows, startRow) {
        worksheet.pageSetup.fitToPage = true;
        worksheet.pageSetup.fitToWidth = 1; // Fit vào 1 trang ngang
        worksheet.pageSetup.fitToHeight = 0; // Không giới hạn chiều dọc
        worksheet.pageSetup.orientation = "landscape"; // Better for wide table
        worksheet.pageSetup.paperSize = 9; // A4
        worksheet.pageSetup.margins = {
          left: 0.25, // ~0.6cm
          right: 0.25,
          top: 0.4, // ~1cm
          bottom: 0.4,
          header: 0.3,
          footer: 0.3,
        };
        worksheet.pageSetup.printTitlesRow = `${startRow}:${startRow}`;
        worksheet.pageSetup.horizontalCentered = true;

        // Set print area
        worksheet.pageSetup.printArea = `B1:M${totalRows}`;
        console.log("Print setup completed for", totalRows, "rows");
      }
      function Style_Cells(cells, options = {}) {
        const defaultFont = { name: "Times New Roman", size: 12 };
        const defaultAlignment = { vertical: "middle", horizontal: "center" };

        const applyStyle = (cell) => {
          // Font
          cell.font = { ...defaultFont, ...(options.font || {}) };
          // Alignment
          cell.alignment = {
            ...defaultAlignment,
            ...(options.alignment || {}),
          };
          // Fill
          if (options.fill) {
            cell.fill = options.fill;
          }
          // Border
          if (options.border) {
            cell.border = options.border;
          }
        };
        if (Array.isArray(cells)) {
          cells.forEach(applyStyle);
        } else {
          applyStyle(cells);
        }
      }
    } catch (e) {
      console.error("\n=== CRITICAL ERROR ===");
      console.error("Message:", e.message);
      console.error("Stack:", e.stack);
      return response.send(Utils.response(false, `Error: ${e.message}`, null));
    }
  }
}

module.exports = rptswsoDebit_note;
