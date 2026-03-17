'use strict'
const DBService = use("DBService");
const EiExcelConverter = use("App/Helpers/EiExcelConverter");
class EiExcelHandler {

  constructor() {

  }
  masterDataArray = []

  async getEinvoice(tradecode, p_language, p_crt_by, _db2 = "N") {
    try {


      let exceljs = new EiExcelConverter();
      let resultExcel = null;
      let companyTaxcode = 0

      let detailCellFormat = []
      let convertYn = "N"
      let cancelYn = "N"


      let backgroundCell = 0//ô chen background'
      let backgroundWidth = 300
      let backgroundHeight = 200
      let signCell = {}//điểm bắt đầu và kết thúc trên trục X của hình dấu tick ký
      let signBoxCell = ""//Cell bắt đầu của signBy ví dụ:"L"
      let signByCell = {}//điểm bắt đầu và kết thúc trên trục X của signBy

      let reportPath = ""//đường dẫn của template 
      let reportSheet = ""//tên của sheet trong template

      let logos = []
      let qrPath = "assets/images/einvoices_logo/qr.png"//đường dẫn của dấu tick xanh
      let signPath = "assets/images/einvoices_logo/greentick.png"//đường dẫn của dấu tick xanh
      let cancelPath = "assets/images/einvoices_logo/Einvoice_cancel.png"//đường dẫn của hình cancel
      let bgPath = "" //đường dẫn của hình background

      let _sourceRow = 0//chiều cao tính từ đầu trang tới dòng đầu tiên của detail
      let _sourceRow_2 = 0//chiều cao tính từ đầu trang tới dòng đầu tiên của detail
      let _sourceRow_3 = 0//chiều cao tính từ đầu trang tới dòng đầu tiên của detail
      let headerRowCount = 0//chiều cao tính từ đầu trang tới dòng trên dòng đầu tiên của detail
      let countFromEndDetailToSignBox = 0//số đếm từ đầu footer tới ô đầu tiên của ô ký
      let dpi = 96
      let lastPageRowsHeight = 0
      let companyName = ""

      const einvoiceMasterData = await DBService.callProcCursor(
        "ei_sel_einvoice_ar_pdf", [tradecode],
        p_language,
        p_crt_by,
        _db2
      );
      const einvoiceDetailData = await DBService.callProcCursor(
        "ei_sel_einvoiced_ar_pdf", [tradecode],
        p_language,
        p_crt_by,
        _db2
      );

      // const einvoiceMasterData = await DBService.callProcCursor(
      //   "stacfdstac71_r_02_view_einv_v2_nodejs", [tradecode, ''],
      //   p_language,
      //   p_crt_by,
      //   _db2
      // );
      // const einvoiceDetailData = await DBService.callProcCursor(
      //   "stacfdstac71_r_03_view_einv_nodejs", [tradecode, ''],
      //   p_language,
      //   p_crt_by,
      //   _db2
      // );

      if (einvoiceMasterData.length <= 0) {
      } else {
        companyTaxcode = einvoiceMasterData[0].SELLER_TAXCODE.replace(/\s+/g, '');
        convertYn = einvoiceMasterData[0].CONVERT_YN == "Y" ? "Y" : "N"
        cancelYn = einvoiceMasterData[0].CANCEL_YN == "Y" ? "Y" : "N"
      }

      // qrCodeData = "http://genuwinsolution.com/e-invoice/einvquery.gw?code="
      // cancelYn = "Y"
      //convertYn = 'Y'
      //console.log(this.qrCodeImage(qrCodeData))


      switch (companyTaxcode) {
        case "3600563401":
          companyName = 'Yupoong'
          break;
        case "3603731213":
          companyName = 'Daeyoung'
          break;
        case "0316177596":
          companyName = 'Kpx'
          break;
        case "3600840239":
          companyName = 'Suheung'
          break;
        case "3600823561":
          companyName = 'Daewon'
          break;
        case "1101901122":
          companyName = 'Ajtotal'
          break;
        case "0800822908":
          companyName = 'During'
          break;
        case "0310634327":
        case "0105960141":
          companyName = 'ParisVN'
          break;
        case "0310634327-004":
          companyName = 'ParisVN_CNHN'
          break;

        case "3603054138":
          companyName = 'Jungwoo'
          break;
        case "3700907021":
          companyName = 'Kyungbang'
          break;
        case "0108515678":
          companyName = 'Cuckoo'
          break;

        case "3600790154":
          companyName = 'Samil'
          break;
        case "3603512483":
          companyName = 'Otm'
          break;
        case "3603139991":
          companyName = 'Kukil'
          break;
        case "3603529857":
          companyName = 'Hiknit'
          break;
        case "3600874340":
          companyName = 'Sprint'
          break;
        case "3700798566":
          companyName = 'Bkvina'
          break;
        case "0304248595":
          companyName = 'Genuwin'
          break;
        case "3700860461":
          companyName = 'Ottogi'
          break;
        case "3700860461-002":
          companyName = 'Ottogi_CNBN'
          break;
        default:
          break;
      }
      //  Yupoong Daeyoung Kpx Suheung Daewon Ajtotal During
      // companyName="Sprint"
      switch (companyName) {

             //////// *****************Ottogi_CNBN*********************\\\\\\\\\
      case "Ottogi_CNBN":
        this.masterDataArray = []
        switch (einvoiceMasterData[0].TEMPLATECODE) {
          case "1":
            if (convertYn == "Y") {
              reportPath = 'report/60/95/einvoices_template/Ottogi_CNBN/Ottogi_CNBN_convert_1.xlsx'
              reportSheet = "GTGT.BD.Convert"
              this.masterDataArray.push(
                { Cell: `G13`, Info: [`convert`], Type: 2 },
                { Cell: `B38`, Info: [`CONVERT_NAME`], Type: 1 },
                { Cell: `B39`, Info: [`CONVERT_DATE`], Type: 1 },
              )
            } else {
              reportPath = 'report/60/95/einvoices_template/Ottogi_CNBN/Ottogi_CNBN_1.xlsx'
              reportSheet = "GTGT.BD.Convert"
            }


            bgPath = "assets/images/einvoices_logo/Ottogi_CNBN/bg.png"
            logos = [
              { start: 1, width: 0.99 * dpi, height: 0.99 * dpi, logoStartCount: 1.2, logoPath: "assets/images/einvoices_logo/Ottogi_CNBN/companylogo.png" },

            ]

            //mảng data của master
            this.masterDataArray.push(
              { Cell: `AA12`, Info: [`TEMPLATECODE`, `INVOICESERIALNO`], Type: 1 },
              { Cell: `Z13`, Info: [`INVOICENUMBER`], Type: 1 },
              { Cell: `G14`, Info: [`dateString`], Type: 2 },
              { Cell: `W14`, Info: [`page`], Type: 2 },
              { Cell: `A44`, Info: [`footer`], Type: 2 },

              { Cell: `F2`, Info: [`SELLER_NAME`], Type: 1 },
              { Cell: `H4`, Info: [`SELLER_TAXCODE`], Type: 1 },
              // { Cell: `H3`, Info: [`SELLER_ADDRESS`], Type: 1 },
              { Cell: `H5`, Info: [`SELLER_TEL`], Type: 1 },
              { Cell: `H6`, Info: [`SELLER_ACCOUNTNO`], Type: 1 },
              // { Cell: `J4`, Info: [`SELLER_FAX`], Type: 1 },
              // { Cell: `H5`, Info: [`SELLER_BANKNO`], Type: 1 },
              //{ Cell: `F6`, Info: [`SELLER_BANKNAME`], Type: 1 },

              { Cell: `Q16`, Info: [`BUYER`], Type: 1 },
              { Cell: `J17`, Info: [`BUYERLEGALNAME`], Type: 1 },
              { Cell: `H18`, Info: [`BUYERTAXCODE`], Type: 1 },
              { Cell: `G19`, Info: [`BUYERADDRESS`], Type: 1 },
              { Cell: `M21`, Info: [`PAYMENTMETHODCK`], Type: 1 },
              { Cell: `Y21`, Info: [`BUYERACCOUNTNO`], Type: 1 },
              // { Cell: `N19`, Info: [`BUYER_BANK_NAME`], Type: 1 },
              //{ Cell: `C21`, Info: [`BUYERPONO`], Type: 1 },
              // { Cell: `E19`, Info: [`CURRENCYCODEUSD`], Type: 1 },
              //{ Cell: `N19`, Info: [`EXCHANGERATE`], Type: 1 },

              //{ Cell: `C26`, Info: [`lb_amount_trans`], Type: 2 },
              //  { Cell: `E29`, Info: [`amount_trans`], Type: 2 },
              { Cell: `Z26`, Info: [`amount_net`], Type: 2 },
              { Cell: `I27`, Info: [`TAXRATE`], Type: 1 },
              { Cell: `Z27`, Info: [`amount_vat`], Type: 2 },//VAT Amount: 
              { Cell: `Z28`, Info: [`amount_total`], Type: 2 },
              // { Cell: `H29`, Info: [`read_price`], Type: 2 },
              { Cell: `J29`, Info: [`read_price`], Type: 2 },

              { Cell: `F40`, Info: [`CQT_MCCQT_ID`], Type: 1 },
              { Cell: `U42`, Info: [`MATRACUU`], Type: 1 },

              { Cell: `U39`, Info: [`SIGNEDBY`], Type: 3 },
              { Cell: `U40`, Info: [`SIGNEDDATE`], Type: 3 },

            )
            // //"A", "B", "C", "D", "E", "F", "G", "H", "I", "J",  "K",  "L",  "M",  "N",  "O",  "P",  "Q",  "R",  "S",  "T",  "U",  "V",  "W",  "X",  "Y",  "Z",
            // //"1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26",

            //cấu trúc dòng detail
            // thin//dotted//dashDot//hair//dashDotDot//slantDashDot//mediumDashed//mediumDashDotDot//mediumDashDot//medium//double//thick
            detailCellFormat = [
              { startCell: 2, endCell: 2, cellType: 2, cellBorder: "dotted", field: "STT" },//từ cell bắt đầu tới cell kết thúc, type 2: cell đầu tiên
              { startCell: 3, endCell: 16, cellType: 3, cellBorder: "dotted", field: "ITEM_NAME" },//từ cell bắt đầu tới cell kết thúc, type 3: cell kế tiếp cell đầu tiên,
              { startCell: 17, endCell: 19, cellType: 1, cellBorder: "dotted", field: "ITEM_UOM" },//type 1: còn lại
              { startCell: 20, endCell: 22, cellType: 1, cellBorder: "dotted", field: "QTY" },//type 1: còn lại
              { startCell: 23, endCell: 25, cellType: 1, cellBorder: "dotted", field: "U_PRICE" },//type 1: còn lại
              { startCell: 26, endCell: 28, cellType: 1, cellBorder: "dotted", field: "NET_TR_AMT" },//type 1: còn lại
            ]
            backgroundCell = 8
            backgroundWidth = 300
            backgroundHeight = 200

            signCell = { start: 23, end: 26 }
            signBoxCell = "U"
            signByCell = { start: 21, end: 29 }
            countFromEndDetailToSignBox = 12

            _sourceRow = 25
            _sourceRow_2 = 25
            _sourceRow_3 = 25
            headerRowCount = 24


            lastPageRowsHeight = 18
            break;
          case "01GTKT0/001":
            if (convertYn == "Y") {
              reportPath = 'report/60/95/einvoices_template/Ottogi_CNBN/Ottogi_CNBN_convert.xlsx'
              reportSheet = "GTGT.BD.Convert"
              this.masterDataArray.push(
                { Cell: `G13`, Info: [`convert`], Type: 2 },
                { Cell: `B38`, Info: [`CONVERT_NAME`], Type: 1 },
                { Cell: `B39`, Info: [`CONVERT_DATE`], Type: 1 },
              )
            } else {
              reportPath = 'report/60/95/einvoices_template/Ottogi_CNBN/Ottogi_CNBN.xlsx'
              reportSheet = "GTGT.BD.Convert"
            }


            bgPath = "assets/images/einvoices_logo/Ottogi_CNBN/bg.png"
            logos = [
              { start: 1, width: 0.99 * dpi, height: 0.99 * dpi, logoStartCount: 1.2, logoPath: "assets/images/einvoices_logo/Ottogi_CNBN/companylogo.png" },

            ]

            //mảng data của master
            this.masterDataArray.push(
              { Cell: `AA10`, Info: [`TEMPLATECODE`], Type: 1 },
              { Cell: `AA12`, Info: [`INVOICESERIALNO`], Type: 1 },
              { Cell: `Z13`, Info: [`INVOICENUMBER`], Type: 1 },
              { Cell: `G14`, Info: [`dateString`], Type: 2 },
              { Cell: `W14`, Info: [`page`], Type: 2 },
              { Cell: `A44`, Info: [`footer`], Type: 2 },

              { Cell: `F2`, Info: [`SELLER_NAME`], Type: 1 },
              //{ Cell: `F2`, Info: [`SELLER_TAXCODE`], Type: 1 },
              { Cell: `H4`, Info: [`SELLER_ADDRESS`], Type: 1 },
              { Cell: `H5`, Info: [`SELLER_TEL`], Type: 1 },
              { Cell: `H6`, Info: [`SELLER_ACCOUNTNO`], Type: 1 },
              // { Cell: `J4`, Info: [`SELLER_FAX`], Type: 1 },
              // { Cell: `H5`, Info: [`SELLER_BANKNO`], Type: 1 },
              //{ Cell: `F6`, Info: [`SELLER_BANKNAME`], Type: 1 },

              { Cell: `Q16`, Info: [`BUYER`], Type: 1 },
              { Cell: `J17`, Info: [`BUYERLEGALNAME`], Type: 1 },
              { Cell: `H18`, Info: [`BUYERTAXCODE`], Type: 1 },
              { Cell: `G19`, Info: [`BUYERADDRESS`], Type: 1 },
              { Cell: `M21`, Info: [`PAYMENTMETHODCK`], Type: 1 },
              { Cell: `Y21`, Info: [`BUYERACCOUNTNO`], Type: 1 },
              // { Cell: `N19`, Info: [`BUYER_BANK_NAME`], Type: 1 },
              //{ Cell: `C21`, Info: [`BUYERPONO`], Type: 1 },
              // { Cell: `E19`, Info: [`CURRENCYCODEUSD`], Type: 1 },
              //{ Cell: `N19`, Info: [`EXCHANGERATE`], Type: 1 },

              //{ Cell: `C26`, Info: [`lb_amount_trans`], Type: 2 },
              //  { Cell: `E29`, Info: [`amount_trans`], Type: 2 },
              { Cell: `Z26`, Info: [`amount_net`], Type: 2 },
              { Cell: `I27`, Info: [`TAXRATE`], Type: 1 },
              { Cell: `Z27`, Info: [`amount_vat`], Type: 2 },//VAT Amount: 
              { Cell: `Z28`, Info: [`amount_total`], Type: 2 },
              // { Cell: `H29`, Info: [`read_price`], Type: 2 },
              { Cell: `J29`, Info: [`read_price`], Type: 2 },

              // { Cell: `D36`, Info: [`CQT_MCCQT_ID`], Type: 1 },
              { Cell: `F40`, Info: [`MATRACUU`], Type: 1 },

              { Cell: `U39`, Info: [`SIGNEDBY`], Type: 3 },
              { Cell: `U40`, Info: [`SIGNEDDATE`], Type: 3 },

            )
            // //"A", "B", "C", "D", "E", "F", "G", "H", "I", "J",  "K",  "L",  "M",  "N",  "O",  "P",  "Q",  "R",  "S",  "T",  "U",  "V",  "W",  "X",  "Y",  "Z",
            // //"1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26",

            //cấu trúc dòng detail
            // thin//dotted//dashDot//hair//dashDotDot//slantDashDot//mediumDashed//mediumDashDotDot//mediumDashDot//medium//double//thick
            detailCellFormat = [
              { startCell: 2, endCell: 2, cellType: 2, cellBorder: "dotted", field: "STT" },//từ cell bắt đầu tới cell kết thúc, type 2: cell đầu tiên
              { startCell: 3, endCell: 16, cellType: 3, cellBorder: "dotted", field: "ITEM_NAME" },//từ cell bắt đầu tới cell kết thúc, type 3: cell kế tiếp cell đầu tiên,
              { startCell: 17, endCell: 19, cellType: 1, cellBorder: "dotted", field: "ITEM_UOM" },//type 1: còn lại
              { startCell: 20, endCell: 22, cellType: 1, cellBorder: "dotted", field: "QTY" },//type 1: còn lại
              { startCell: 23, endCell: 25, cellType: 1, cellBorder: "dotted", field: "U_PRICE" },//type 1: còn lại
              { startCell: 26, endCell: 28, cellType: 1, cellBorder: "dotted", field: "NET_TR_AMT" },//type 1: còn lại
            ]
            backgroundCell = 8
            backgroundWidth = 300
            backgroundHeight = 200

            signCell = { start: 23, end: 26 }
            signBoxCell = "U"
            signByCell = { start: 21, end: 29 }
            countFromEndDetailToSignBox = 12

            _sourceRow = 25
            _sourceRow_2 = 25
            _sourceRow_3 = 25
            headerRowCount = 24


            lastPageRowsHeight = 18
            break;
            break;

          default:

            break;
        }
        break;
      //////// *****************Ottogi_CNBN*********************\\\\\\\\\


      //////// *****************Ottogi*********************\\\\\\\\\
      case "Ottogi":
        this.masterDataArray = []
        switch (einvoiceMasterData[0].TEMPLATECODE) {
          case "1":
            if (convertYn == "Y") {
              reportPath = 'report/60/95/einvoices_template/Ottogi/Ottogi_convert_1.xlsx'
              reportSheet = "GTGT.BD.Convert"
              this.masterDataArray.push(
                { Cell: `G13`, Info: [`convert`], Type: 2 },
                { Cell: `B38`, Info: [`CONVERT_NAME`], Type: 1 },
                { Cell: `B39`, Info: [`CONVERT_DATE`], Type: 1 },
              )
            } else {
              reportPath = 'report/60/95/einvoices_template/Ottogi/Ottogi_1.xlsx'
              reportSheet = "GTGT.BD.Convert"
            }


            bgPath = "assets/images/einvoices_logo/Ottogi/bg.png"
            logos = [
              { start: 1, width: 0.99 * dpi, height: 0.99 * dpi, logoStartCount: 1.2, logoPath: "assets/images/einvoices_logo/Ottogi/companylogo.png" },

            ]

            //mảng data của master
            this.masterDataArray.push(
              { Cell: `AA12`, Info: [`TEMPLATECODE`, `INVOICESERIALNO`], Type: 1 },
              { Cell: `Z13`, Info: [`INVOICENUMBER`], Type: 1 },
              { Cell: `G14`, Info: [`dateString`], Type: 2 },
              { Cell: `W14`, Info: [`page`], Type: 2 },
              { Cell: `A44`, Info: [`footer`], Type: 2 },

              { Cell: `F2`, Info: [`SELLER_NAME`], Type: 1 },
              //{ Cell: `F2`, Info: [`SELLER_TAXCODE`], Type: 1 },
              // { Cell: `H3`, Info: [`SELLER_ADDRESS`], Type: 1 },
              { Cell: `H4`, Info: [`SELLER_TEL`], Type: 1 },
              { Cell: `H5`, Info: [`SELLER_ACCOUNTNO`], Type: 1 },
              // { Cell: `J4`, Info: [`SELLER_FAX`], Type: 1 },
              // { Cell: `H5`, Info: [`SELLER_BANKNO`], Type: 1 },
              //{ Cell: `F6`, Info: [`SELLER_BANKNAME`], Type: 1 },

              { Cell: `Q16`, Info: [`BUYER`], Type: 1 },
              { Cell: `J17`, Info: [`BUYERLEGALNAME`], Type: 1 },
              { Cell: `H18`, Info: [`BUYERTAXCODE`], Type: 1 },
              { Cell: `G19`, Info: [`BUYERADDRESS`], Type: 1 },
              { Cell: `M21`, Info: [`PAYMENTMETHODCK`], Type: 1 },
              { Cell: `Y21`, Info: [`BUYERACCOUNTNO`], Type: 1 },
              // { Cell: `N19`, Info: [`BUYER_BANK_NAME`], Type: 1 },
              //{ Cell: `C21`, Info: [`BUYERPONO`], Type: 1 },
              // { Cell: `E19`, Info: [`CURRENCYCODEUSD`], Type: 1 },
              //{ Cell: `N19`, Info: [`EXCHANGERATE`], Type: 1 },

              //{ Cell: `C26`, Info: [`lb_amount_trans`], Type: 2 },
              //  { Cell: `E29`, Info: [`amount_trans`], Type: 2 },
              { Cell: `Z26`, Info: [`amount_net`], Type: 2 },
              { Cell: `I27`, Info: [`TAXRATE`], Type: 1 },
              { Cell: `Z27`, Info: [`amount_vat`], Type: 2 },//VAT Amount: 
              { Cell: `Z28`, Info: [`amount_total`], Type: 2 },
              // { Cell: `H29`, Info: [`read_price`], Type: 2 },
              { Cell: `J29`, Info: [`read_price`], Type: 2 },

              { Cell: `F40`, Info: [`CQT_MCCQT_ID`], Type: 1 },
              { Cell: `U42`, Info: [`MATRACUU`], Type: 1 },

              { Cell: `U39`, Info: [`SIGNEDBY`], Type: 3 },
              { Cell: `U40`, Info: [`SIGNEDDATE`], Type: 3 },

            )
            // //"A", "B", "C", "D", "E", "F", "G", "H", "I", "J",  "K",  "L",  "M",  "N",  "O",  "P",  "Q",  "R",  "S",  "T",  "U",  "V",  "W",  "X",  "Y",  "Z",
            // //"1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26",

            //cấu trúc dòng detail
            // thin//dotted//dashDot//hair//dashDotDot//slantDashDot//mediumDashed//mediumDashDotDot//mediumDashDot//medium//double//thick
            detailCellFormat = [
              { startCell: 2, endCell: 2, cellType: 2, cellBorder: "dotted", field: "STT" },//từ cell bắt đầu tới cell kết thúc, type 2: cell đầu tiên
              { startCell: 3, endCell: 16, cellType: 3, cellBorder: "dotted", field: "ITEM_NAME" },//từ cell bắt đầu tới cell kết thúc, type 3: cell kế tiếp cell đầu tiên,
              { startCell: 17, endCell: 19, cellType: 1, cellBorder: "dotted", field: "ITEM_UOM" },//type 1: còn lại
              { startCell: 20, endCell: 22, cellType: 1, cellBorder: "dotted", field: "QTY" },//type 1: còn lại
              { startCell: 23, endCell: 25, cellType: 1, cellBorder: "dotted", field: "U_PRICE" },//type 1: còn lại
              { startCell: 26, endCell: 28, cellType: 1, cellBorder: "dotted", field: "NET_TR_AMT" },//type 1: còn lại
            ]
            backgroundCell = 8
            backgroundWidth = 300
            backgroundHeight = 200

            signCell = { start: 23, end: 26 }
            signBoxCell = "U"
            signByCell = { start: 21, end: 29 }
            countFromEndDetailToSignBox = 12

            _sourceRow = 25
            _sourceRow_2 = 25
            _sourceRow_3 = 25
            headerRowCount = 24


            lastPageRowsHeight = 18
            break;
          case "01GTKT0/001":
            if (convertYn == "Y") {
              reportPath = 'report/60/95/einvoices_template/Ottogi/Ottogi_convert.xlsx'
              reportSheet = "GTGT.BD.Convert"
              this.masterDataArray.push(
                { Cell: `G13`, Info: [`convert`], Type: 2 },
                { Cell: `B38`, Info: [`CONVERT_NAME`], Type: 1 },
                { Cell: `B39`, Info: [`CONVERT_DATE`], Type: 1 },
              )
            } else {
              reportPath = 'report/60/95/einvoices_template/Ottogi/Ottogi.xlsx'
              reportSheet = "GTGT.BD.Convert"
            }


            bgPath = "assets/images/einvoices_logo/Ottogi/bg.png"
            logos = [
              { start: 1, width: 0.99 * dpi, height: 0.99 * dpi, logoStartCount: 1.2, logoPath: "assets/images/einvoices_logo/Ottogi/companylogo.png" },

            ]

            //mảng data của master
            this.masterDataArray.push(
              { Cell: `AA10`, Info: [`TEMPLATECODE`], Type: 1 },
              { Cell: `AA12`, Info: [`INVOICESERIALNO`], Type: 1 },
              { Cell: `Z13`, Info: [`INVOICENUMBER`], Type: 1 },
              { Cell: `G14`, Info: [`dateString`], Type: 2 },
              { Cell: `W14`, Info: [`page`], Type: 2 },
              { Cell: `A44`, Info: [`footer`], Type: 2 },

              { Cell: `F2`, Info: [`SELLER_NAME`], Type: 1 },
              //{ Cell: `F2`, Info: [`SELLER_TAXCODE`], Type: 1 },
              // { Cell: `H3`, Info: [`SELLER_ADDRESS`], Type: 1 },
              { Cell: `H4`, Info: [`SELLER_TEL`], Type: 1 },
              { Cell: `H5`, Info: [`SELLER_ACCOUNTNO`], Type: 1 },
              // { Cell: `J4`, Info: [`SELLER_FAX`], Type: 1 },
              // { Cell: `H5`, Info: [`SELLER_BANKNO`], Type: 1 },
              //{ Cell: `F6`, Info: [`SELLER_BANKNAME`], Type: 1 },

              { Cell: `Q16`, Info: [`BUYER`], Type: 1 },
              { Cell: `J17`, Info: [`BUYERLEGALNAME`], Type: 1 },
              { Cell: `H18`, Info: [`BUYERTAXCODE`], Type: 1 },
              { Cell: `G19`, Info: [`BUYERADDRESS`], Type: 1 },
              { Cell: `M21`, Info: [`PAYMENTMETHODCK`], Type: 1 },
              { Cell: `Y21`, Info: [`BUYERACCOUNTNO`], Type: 1 },
              // { Cell: `N19`, Info: [`BUYER_BANK_NAME`], Type: 1 },
              //{ Cell: `C21`, Info: [`BUYERPONO`], Type: 1 },
              // { Cell: `E19`, Info: [`CURRENCYCODEUSD`], Type: 1 },
              //{ Cell: `N19`, Info: [`EXCHANGERATE`], Type: 1 },

              //{ Cell: `C26`, Info: [`lb_amount_trans`], Type: 2 },
              //  { Cell: `E29`, Info: [`amount_trans`], Type: 2 },
              { Cell: `Z26`, Info: [`amount_net`], Type: 2 },
              { Cell: `I27`, Info: [`TAXRATE`], Type: 1 },
              { Cell: `Z27`, Info: [`amount_vat`], Type: 2 },//VAT Amount: 
              { Cell: `Z28`, Info: [`amount_total`], Type: 2 },
              // { Cell: `H29`, Info: [`read_price`], Type: 2 },
              { Cell: `J29`, Info: [`read_price`], Type: 2 },

              // { Cell: `D36`, Info: [`CQT_MCCQT_ID`], Type: 1 },
              { Cell: `F40`, Info: [`MATRACUU`], Type: 1 },

              { Cell: `U39`, Info: [`SIGNEDBY`], Type: 3 },
              { Cell: `U40`, Info: [`SIGNEDDATE`], Type: 3 },

            )
            // //"A", "B", "C", "D", "E", "F", "G", "H", "I", "J",  "K",  "L",  "M",  "N",  "O",  "P",  "Q",  "R",  "S",  "T",  "U",  "V",  "W",  "X",  "Y",  "Z",
            // //"1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26",

            //cấu trúc dòng detail
            // thin//dotted//dashDot//hair//dashDotDot//slantDashDot//mediumDashed//mediumDashDotDot//mediumDashDot//medium//double//thick
            detailCellFormat = [
              { startCell: 2, endCell: 2, cellType: 2, cellBorder: "dotted", field: "STT" },//từ cell bắt đầu tới cell kết thúc, type 2: cell đầu tiên
              { startCell: 3, endCell: 16, cellType: 3, cellBorder: "dotted", field: "ITEM_NAME" },//từ cell bắt đầu tới cell kết thúc, type 3: cell kế tiếp cell đầu tiên,
              { startCell: 17, endCell: 19, cellType: 1, cellBorder: "dotted", field: "ITEM_UOM" },//type 1: còn lại
              { startCell: 20, endCell: 22, cellType: 1, cellBorder: "dotted", field: "QTY" },//type 1: còn lại
              { startCell: 23, endCell: 25, cellType: 1, cellBorder: "dotted", field: "U_PRICE" },//type 1: còn lại
              { startCell: 26, endCell: 28, cellType: 1, cellBorder: "dotted", field: "NET_TR_AMT" },//type 1: còn lại
            ]
            backgroundCell = 8
            backgroundWidth = 300
            backgroundHeight = 200

            signCell = { start: 23, end: 26 }
            signBoxCell = "U"
            signByCell = { start: 21, end: 29 }
            countFromEndDetailToSignBox = 12

            _sourceRow = 25
            _sourceRow_2 = 25
            _sourceRow_3 = 25
            headerRowCount = 24


            lastPageRowsHeight = 18
            break;
            break;

          default:

            break;
        }
        break;
      //////// *****************Ottogi*********************\\\\\\\\\


        //////// *****************Genuwin*********************\\\\\\\\\
        case "Genuwin":
          this.masterDataArray = []
          switch (einvoiceMasterData[0].TEMPLATECODE) {
            // case "1":

            //   break;

            default:
              if (convertYn == "Y") {
                reportPath = 'report/60/95/einvoices_template/Genuwin/Genuwin_convert.xlsx'
                reportSheet = "HD goc DT khong ma XThuc"
                this.masterDataArray.push(
                  { Cell: `D8`, Info: [`convert`], Type: 2 },
                  { Cell: `B47`, Info: [`CONVERT_NAME`], Type: 1 },
                  { Cell: `B48`, Info: [`CONVERT_DATE`], Type: 1 },
                )
              } else {
                reportPath = 'report/60/95/einvoices_template/Genuwin/Genuwin.xlsx'
                reportSheet = "HD goc DT khong ma XThuc"
              }


              bgPath = "assets/images/einvoices_logo/Genuwin/bg.png"
              logos = [
                { start: 1.2, width: 1.7 * dpi, height: 0.83 * dpi, logoStartCount: 0.2, logoPath: "assets/images/einvoices_logo/Genuwin/companylogo.png" },

              ]

              //mảng data của master
              this.masterDataArray.push(
                { Cell: `K8`, Info: [`TEMPLATECODE`, `INVOICESERIALNO`], Type: 1 },
                { Cell: `K9`, Info: [`INVOICENUMBER`], Type: 1 },
                { Cell: `D9`, Info: [`dateString`], Type: 2 },
                { Cell: `D10`, Info: [`page`], Type: 2 },
                { Cell: `B39`, Info: [`footer`], Type: 2 },

                { Cell: `D1`, Info: [`SELLER_NAME`], Type: 1 },
                { Cell: `F2`, Info: [`SELLER_TAXCODE`], Type: 1 },
                { Cell: `F3`, Info: [`SELLER_ADDRESS`], Type: 1 },
                { Cell: `F4`, Info: [`SELLER_TEL`], Type: 1 },
                { Cell: `F5`, Info: [`SELLER_ACCOUNTNO`], Type: 1 },
                { Cell: `J4`, Info: [`SELLER_FAX`], Type: 1 },
                // { Cell: `H5`, Info: [`SELLER_BANKNO`], Type: 1 },
                //{ Cell: `F6`, Info: [`SELLER_BANKNAME`], Type: 1 },

                { Cell: `E12`, Info: [`BUYER`], Type: 1 },
                { Cell: `D13`, Info: [`BUYERLEGALNAME`], Type: 1 },
                { Cell: `J16`, Info: [`BUYERTAXCODE`], Type: 1 },
                { Cell: `D14`, Info: [`BUYERADDRESS`], Type: 1 },
                { Cell: `E16`, Info: [`PAYMENTMETHODCK`], Type: 1 },
                { Cell: `D15`, Info: [`BUYERACCOUNTNO`], Type: 1 },
                // { Cell: `N19`, Info: [`BUYER_BANK_NAME`], Type: 1 },
                //{ Cell: `C21`, Info: [`BUYERPONO`], Type: 1 },
                // { Cell: `E19`, Info: [`CURRENCYCODEUSD`], Type: 1 },
                //{ Cell: `N19`, Info: [`EXCHANGERATE`], Type: 1 },

                //{ Cell: `C26`, Info: [`lb_amount_trans`], Type: 2 },
                //  { Cell: `E29`, Info: [`amount_trans`], Type: 2 },
                { Cell: `K22`, Info: [`amount_net`], Type: 2 },
                { Cell: `D23`, Info: [`TAXRATE`], Type: 1 },
                { Cell: `K23`, Info: [`amount_vat`], Type: 2 },//VAT Amount: 
                { Cell: `K24`, Info: [`amount_total`], Type: 2 },
                // { Cell: `H29`, Info: [`read_price`], Type: 2 },
                { Cell: `E25`, Info: [`read_price`], Type: 2 },

                { Cell: `D36`, Info: [`CQT_MCCQT_ID`], Type: 1 },
                { Cell: `J37`, Info: [`MATRACUU`], Type: 1 },

                { Cell: `H35`, Info: [`SIGNEDBY`], Type: 3 },
                { Cell: `H36`, Info: [`SIGNEDDATE`], Type: 3 },

              )
              // //"A", "B", "C", "D", "E", "F", "G", "H", "I", "J",  "K",  "L",  "M",  "N",  "O",  "P",  "Q",  "R",  "S",  "T",  "U",  "V",  "W",  "X",  "Y",  "Z",
              // //"1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26",

              //cấu trúc dòng detail
              // thin//dotted//dashDot//hair//dashDotDot//slantDashDot//mediumDashed//mediumDashDotDot//mediumDashDot//medium//double//thick
              detailCellFormat = [
                { startCell: 1, endCell: 2, cellType: 2, cellBorder: "thin", field: "STT" },//từ cell bắt đầu tới cell kết thúc, type 2: cell đầu tiên
                { startCell: 3, endCell: 5, cellType: 3, cellBorder: "thin", field: "ITEM_NAME" },//từ cell bắt đầu tới cell kết thúc, type 3: cell kế tiếp cell đầu tiên,
                { startCell: 6, endCell: 6, cellType: 1, cellBorder: "thin", field: "ITEM_UOM" },//type 1: còn lại
                { startCell: 7, endCell: 7, cellType: 1, cellBorder: "thin", field: "QTY" },//type 1: còn lại
                { startCell: 8, endCell: 10, cellType: 1, cellBorder: "thin", field: "U_PRICE" },//type 1: còn lại
                { startCell: 11, endCell: 11, cellType: 1, cellBorder: "thin", field: "NET_TR_AMT" },//type 1: còn lại
              ]
              backgroundCell = 3
              backgroundWidth = 200
              backgroundHeight = 0

              signCell = { start: 8, end: 10 }
              signBoxCell = "H"
              signByCell = { start: 8, end: 11 }
              countFromEndDetailToSignBox = 13

              _sourceRow = 20
              _sourceRow_2 = 20
              _sourceRow_3 = 20
              headerRowCount = 19


              lastPageRowsHeight = 18
              break;
          }
          break;
        //////// *****************Genuwin*********************\\\\\\\\\


        //////// *****************Sprint*********************\\\\\\\\\
        case "Sprint":
          this.masterDataArray = []
          switch (einvoiceMasterData[0].TEMPLATECODE) {
            case "1":
              if (convertYn == "Y") {
                reportPath = 'report/60/95/einvoices_template/Sprint/Sprint_convert_1.xlsx'
                reportSheet = "Invoice final"
                this.masterDataArray.push(
                  { Cell: `D11`, Info: [`convert`], Type: 2 },
                  { Cell: `B35`, Info: [`CONVERT_NAME`], Type: 1 },
                  { Cell: `B36`, Info: [`CONVERT_DATE`], Type: 1 },
                )
              } else {
                reportPath = 'report/60/95/einvoices_template/Sprint/Sprint_1.xlsx'
                reportSheet = "Invoice final"
              }


              //bgPath = require("assets/images/einvoices_logo/Sprint/bg.png")
              logos = [
                { start: 1, width: 1.19 * dpi, height: 0.87 * dpi, logoStartCount: 0.2, logoPath: "assets/images/einvoices_logo/Sprint/companylogo.png" },

              ]

              //mảng data của master
              this.masterDataArray.push(
                { Cell: `Q10`, Info: [`TEMPLATECODE`, `INVOICESERIALNO`], Type: 1 },
                { Cell: `P11`, Info: [`INVOICENUMBER`], Type: 1 },
                { Cell: `D12`, Info: [`dateString`], Type: 2 },
                { Cell: `N12`, Info: [`page`], Type: 2 },
                { Cell: `B40`, Info: [`footer`], Type: 2 },

                { Cell: `E1`, Info: [`SELLER_NAME`], Type: 1 },
                { Cell: `I2`, Info: [`SELLER_TAXCODE`], Type: 1 },
                { Cell: `I3`, Info: [`SELLER_ADDRESS`], Type: 1 },
                { Cell: `I4`, Info: [`SELLER_TEL`], Type: 1 },
                { Cell: `I5`, Info: [`SELLER_ACCOUNTNO`], Type: 1 },
                { Cell: `P4`, Info: [`SELLER_FAX`], Type: 1 },
                // { Cell: `H5`, Info: [`SELLER_BANKNO`], Type: 1 },
                //{ Cell: `F6`, Info: [`SELLER_BANKNAME`], Type: 1 },

                { Cell: `H15`, Info: [`BUYER`], Type: 1 },
                { Cell: `F16`, Info: [`BUYERLEGALNAME`], Type: 1 },
                { Cell: `E18`, Info: [`BUYERTAXCODE`], Type: 1 },
                { Cell: `E17`, Info: [`BUYERADDRESS`], Type: 1 },
                { Cell: `Q18`, Info: [`PAYMENTMETHODCK`], Type: 1 },
                // { Cell: `F19`, Info: [`BUYERACCOUNTNO`], Type: 1 },
                // { Cell: `N19`, Info: [`BUYER_BANK_NAME`], Type: 1 },
                //{ Cell: `C21`, Info: [`BUYERPONO`], Type: 1 },
                { Cell: `E19`, Info: [`CURRENCYCODEUSD`], Type: 1 },
                { Cell: `N19`, Info: [`EXCHANGERATE`], Type: 1 },
                //{ Cell: `C26`, Info: [`lb_amount_trans`], Type: 2 },
                //  { Cell: `E29`, Info: [`amount_trans`], Type: 2 },
                { Cell: `P25`, Info: [`amount_net`], Type: 2 },
                { Cell: `F26`, Info: [`TAXRATE`], Type: 1 },
                { Cell: `P26`, Info: [`amount_vat`], Type: 2 },//VAT Amount: 
                { Cell: `P27`, Info: [`amount_total`], Type: 2 },
                // { Cell: `H29`, Info: [`read_price`], Type: 2 },
                { Cell: `F28`, Info: [`read_price`], Type: 2 },

                { Cell: `D37`, Info: [`CQT_MCCQT_ID`], Type: 1 },
                { Cell: `O38`, Info: [`MATRACUU`], Type: 1 },

                { Cell: `N35`, Info: [`SIGNEDBY`], Type: 3 },
                { Cell: `N36`, Info: [`SIGNEDDATE`], Type: 3 },

              )
              // //"A", "B", "C", "D", "E", "F", "G", "H", "I", "J",  "K",  "L",  "M",  "N",  "O",  "P",  "Q",  "R",  "S",  "T",  "U",  "V",  "W",  "X",  "Y",  "Z",
              // //"1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26",

              //cấu trúc dòng detail
              // thin//dotted//dashDot//hair//dashDotDot//slantDashDot//mediumDashed//mediumDashDotDot//mediumDashDot//medium//double//thick
              detailCellFormat = [
                { startCell: 1, endCell: 2, cellType: 2, cellBorder: "dotted", field: "STT" },//từ cell bắt đầu tới cell kết thúc, type 2: cell đầu tiên
                { startCell: 3, endCell: 8, cellType: 3, cellBorder: "dotted", field: "ITEM_NAME" },//từ cell bắt đầu tới cell kết thúc, type 3: cell kế tiếp cell đầu tiên,
                { startCell: 9, endCell: 9, cellType: 1, cellBorder: "dotted", field: "ITEM_UOM" },//type 1: còn lại
                { startCell: 10, endCell: 12, cellType: 1, cellBorder: "dotted", field: "QTY" },//type 1: còn lại
                { startCell: 13, endCell: 15, cellType: 1, cellBorder: "dotted", field: "U_PRICE" },//type 1: còn lại
                { startCell: 16, endCell: 17, cellType: 1, cellBorder: "dotted", field: "NET_TR_AMT" },//type 1: còn lại
              ]
              // backgroundCell = 4
              // backgroundWidth = 300
              // backgroundHeight = 100

              signCell = { start: 14, end: 15 }
              signBoxCell = "N"
              signByCell = { start: 14, end: 17 }
              countFromEndDetailToSignBox = 9

              _sourceRow = 24
              _sourceRow_2 = 24
              _sourceRow_3 = 24
              headerRowCount = 23


              lastPageRowsHeight = 14
              break;
            case '01GTKT0/001':
              if (convertYn == "Y") {
                reportPath = 'report/60/95/einvoices_template/Sprint/Sprint_convert.xlsx'
                reportSheet = "Invoice final"
                this.masterDataArray.push(
                  { Cell: `D11`, Info: [`convert`], Type: 2 },
                  { Cell: `B35`, Info: [`CONVERT_NAME`], Type: 1 },
                  { Cell: `B36`, Info: [`CONVERT_DATE`], Type: 1 },
                )
              } else {
                reportPath = 'report/60/95/einvoices_template/Sprint/Sprint.xlsx'
                reportSheet = "Invoice final"
              }


              //bgPath = require("assets/images/einvoices_logo/Sprint/bg.png")
              logos = [
                { start: 1, width: 1.19 * dpi, height: 0.87 * dpi, logoStartCount: 0.2, logoPath: "assets/images/einvoices_logo/Sprint/companylogo.png" },

              ]

              //mảng data của master
              this.masterDataArray.push(
                { Cell: `Q9`, Info: [`TEMPLATECODE`], Type: 1 },
                { Cell: `Q10`, Info: [`INVOICESERIALNO`], Type: 1 },
                { Cell: `P11`, Info: [`INVOICENUMBER`], Type: 1 },
                { Cell: `D12`, Info: [`dateString`], Type: 2 },
                { Cell: `N12`, Info: [`page`], Type: 2 },
                { Cell: `B40`, Info: [`footer`], Type: 2 },

                { Cell: `E1`, Info: [`SELLER_NAME`], Type: 1 },
                { Cell: `I2`, Info: [`SELLER_TAXCODE`], Type: 1 },
                { Cell: `I3`, Info: [`SELLER_ADDRESS`], Type: 1 },
                { Cell: `I4`, Info: [`SELLER_TEL`], Type: 1 },
                { Cell: `I5`, Info: [`SELLER_ACCOUNTNO`], Type: 1 },
                { Cell: `P4`, Info: [`SELLER_FAX`], Type: 1 },
                // { Cell: `H5`, Info: [`SELLER_BANKNO`], Type: 1 },
                //{ Cell: `F6`, Info: [`SELLER_BANKNAME`], Type: 1 },

                { Cell: `H15`, Info: [`BUYER`], Type: 1 },
                { Cell: `F16`, Info: [`BUYERLEGALNAME`], Type: 1 },
                { Cell: `E18`, Info: [`BUYERTAXCODE`], Type: 1 },
                { Cell: `E17`, Info: [`BUYERADDRESS`], Type: 1 },
                { Cell: `Q18`, Info: [`PAYMENTMETHODCK`], Type: 1 },
                { Cell: `F19`, Info: [`BUYERACCOUNTNO`], Type: 1 },
                { Cell: `N19`, Info: [`BUYER_BANK_NAME`], Type: 1 },
                //{ Cell: `C21`, Info: [`BUYERPONO`], Type: 1 },
                //{ Cell: `O17`, Info: [`CURRENCYCODEUSD`], Type: 1 },
                // 
                //{ Cell: `C26`, Info: [`lb_amount_trans`], Type: 2 },
                //  { Cell: `E29`, Info: [`amount_trans`], Type: 2 },
                { Cell: `P25`, Info: [`amount_net`], Type: 2 },
                { Cell: `F26`, Info: [`TAXRATE`], Type: 1 },
                { Cell: `P26`, Info: [`amount_vat`], Type: 2 },//VAT Amount: 
                { Cell: `P27`, Info: [`amount_total`], Type: 2 },
                // { Cell: `H29`, Info: [`read_price`], Type: 2 },
                { Cell: `F28`, Info: [`read_price`], Type: 2 },

                { Cell: `O38`, Info: [`MATRACUU`], Type: 1 },

                { Cell: `N35`, Info: [`SIGNEDBY`], Type: 3 },
                { Cell: `N36`, Info: [`SIGNEDDATE`], Type: 3 },

              )
              // //"A", "B", "C", "D", "E", "F", "G", "H", "I", "J",  "K",  "L",  "M",  "N",  "O",  "P",  "Q",  "R",  "S",  "T",  "U",  "V",  "W",  "X",  "Y",  "Z",
              // //"1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26",

              //cấu trúc dòng detail
              // thin//dotted//dashDot//hair//dashDotDot//slantDashDot//mediumDashed//mediumDashDotDot//mediumDashDot//medium//double//thick
              detailCellFormat = [
                { startCell: 1, endCell: 2, cellType: 2, cellBorder: "dotted", field: "STT" },//từ cell bắt đầu tới cell kết thúc, type 2: cell đầu tiên
                { startCell: 3, endCell: 8, cellType: 3, cellBorder: "dotted", field: "ITEM_NAME" },//từ cell bắt đầu tới cell kết thúc, type 3: cell kế tiếp cell đầu tiên,
                { startCell: 9, endCell: 9, cellType: 1, cellBorder: "dotted", field: "ITEM_UOM" },//type 1: còn lại
                { startCell: 10, endCell: 12, cellType: 1, cellBorder: "dotted", field: "QTY" },//type 1: còn lại
                { startCell: 13, endCell: 15, cellType: 1, cellBorder: "dotted", field: "U_PRICE" },//type 1: còn lại
                { startCell: 16, endCell: 17, cellType: 1, cellBorder: "dotted", field: "NET_TR_AMT" },//type 1: còn lại
              ]
              // backgroundCell = 4
              // backgroundWidth = 300
              // backgroundHeight = 100

              signCell = { start: 14, end: 15 }
              signBoxCell = "N"
              signByCell = { start: 14, end: 17 }
              countFromEndDetailToSignBox = 9

              _sourceRow = 24
              _sourceRow_2 = 24
              _sourceRow_3 = 24
              headerRowCount = 23


              lastPageRowsHeight = 14
              break;

            default:

              break;
          }
          break;
        //////// *****************Sprint*********************\\\\\\\\\




        //////// *****************Hiknit*********************\\\\\\\\\
        case "Hiknit":
          this.masterDataArray = []
          switch (einvoiceMasterData[0].TEMPLATECODE) {
            case "1":
              if (convertYn == "Y") {
                reportPath = 'report/60/95/einvoices_template/Hiknit/Hiknit_convert_1.xlsx'
                reportSheet = "Form HD GTGT TuIn 2014 (2)"
                this.masterDataArray.push(
                  { Cell: `E11`, Info: [`convert`], Type: 2 },
                  { Cell: `A37`, Info: [`CONVERT_NAME`], Type: 1 },
                  { Cell: `A38`, Info: [`CONVERT_DATE`], Type: 1 },
                )
              } else {
                reportPath = 'report/60/95/einvoices_template/Hiknit/Hiknit_1.xlsx'
                reportSheet = "Form HD GTGT TuIn 2014 (2)"
              }


              //bgPath = "assets/images/einvoices_logo/Hiknit/bg.png"
              logos = [
                { start: 0.3, width: 2.57 * dpi, height: 1.26 * dpi, logoStartCount: 2.5, logoPath: "assets/images/einvoices_logo/Hiknit/companylogo.png" },

              ]

              //mảng data của master
              this.masterDataArray.push(
                { Cell: `O10`, Info: [`TEMPLATECODE`, `INVOICESERIALNO`], Type: 1 },
                { Cell: `N11`, Info: [`INVOICENUMBER`], Type: 1 },
                { Cell: `E12`, Info: [`dateString`], Type: 2 },
                { Cell: `L12`, Info: [`page`], Type: 2 },
                { Cell: `A41`, Info: [`footer`], Type: 2 },

                { Cell: `I3`, Info: [`SELLER_NAME`], Type: 1 },
                { Cell: `H4`, Info: [`SELLER_TAXCODE`], Type: 1 },
                { Cell: `H5`, Info: [`SELLER_ADDRESS`], Type: 1 },
                { Cell: `H7`, Info: [`SELLER_TEL`], Type: 1 },
                { Cell: `F8`, Info: [`SELLER_ACCOUNTNO`], Type: 1 },
                // { Cell: `N7`, Info: [`SELLER_FAX`], Type: 1 },
                // { Cell: `H5`, Info: [`SELLER_BANKNO`], Type: 1 },
                //{ Cell: `F6`, Info: [`SELLER_BANKNAME`], Type: 1 },

                { Cell: `D14`, Info: [`BUYER`], Type: 1 },
                { Cell: `C17`, Info: [`BUYERLEGALNAME`], Type: 1 },
                { Cell: `C19`, Info: [`BUYERTAXCODE`], Type: 1 },
                { Cell: `C18`, Info: [`BUYERADDRESS`], Type: 1 },
                { Cell: `O19`, Info: [`PAYMENTMETHODCK`], Type: 1 },
                //{ Cell: `N20`, Info: [`BUYERACCOUNTNO`], Type: 1 },
                // { Cell: `F18`, Info: [`BUYERPHONE`], Type: 1 },
                { Cell: `C21`, Info: [`BUYERPONO`], Type: 1 },
                //{ Cell: `O17`, Info: [`CURRENCYCODEUSD`], Type: 1 },
                // 
                { Cell: `C26`, Info: [`lb_amount_trans`], Type: 2 },
                //  { Cell: `E29`, Info: [`amount_trans`], Type: 2 },
                { Cell: `O26`, Info: [`amount_net`], Type: 2 },
                { Cell: `C27`, Info: [`TAXRATE`], Type: 1 },
                { Cell: `O27`, Info: [`amount_vat`], Type: 2 },//VAT Amount: 
                { Cell: `O28`, Info: [`amount_total`], Type: 2 },
                // { Cell: `H29`, Info: [`read_price`], Type: 2 },
                { Cell: `A30`, Info: [`read_price`], Type: 2 },

                { Cell: `C39`, Info: [`CQT_MCCQT_ID`], Type: 1 },
                { Cell: `N39`, Info: [`MATRACUU`], Type: 1 },

                { Cell: `M37`, Info: [`SIGNEDBY`], Type: 3 },
                { Cell: `M38`, Info: [`SIGNEDDATE`], Type: 3 },

              )
              // //"A", "B", "C", "D", "E", "F", "G", "H", "I", "J",  "K",  "L",  "M",  "N",  "O",  "P",  "Q",  "R",  "S",  "T",  "U",  "V",  "W",  "X",  "Y",  "Z",
              // //"1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26",

              //cấu trúc dòng detail
              // thin//dotted//dashDot//hair//dashDotDot//slantDashDot//mediumDashed//mediumDashDotDot//mediumDashDot//medium//double//thick
              detailCellFormat = [
                { startCell: 1, endCell: 1, cellType: 2, cellBorder: "dotted", field: "STT" },//từ cell bắt đầu tới cell kết thúc, type 2: cell đầu tiên
                { startCell: 2, endCell: 8, cellType: 3, cellBorder: "dotted", field: "ITEM_NAME" },//từ cell bắt đầu tới cell kết thúc, type 3: cell kế tiếp cell đầu tiên,
                { startCell: 9, endCell: 10, cellType: 1, cellBorder: "dotted", field: "ITEM_UOM" },//type 1: còn lại
                { startCell: 11, endCell: 12, cellType: 1, cellBorder: "dotted", field: "QTY" },//type 1: còn lại
                { startCell: 13, endCell: 14, cellType: 1, cellBorder: "dotted", field: "U_PRICE" },//type 1: còn lại
                { startCell: 15, endCell: 15, cellType: 1, cellBorder: "dotted", field: "NET_TR_AMT" },//type 1: còn lại
              ]
              // backgroundCell = 4
              // backgroundWidth = 300
              // backgroundHeight = 100

              signCell = { start: 13, end: 14 }
              signBoxCell = "M"
              signByCell = { start: 13, end: 15 }
              countFromEndDetailToSignBox = 10

              _sourceRow = 25
              _sourceRow_2 = 25
              _sourceRow_3 = 25
              headerRowCount = 24


              lastPageRowsHeight = 14
              break;
            case '01GTKT0/001':
              if (convertYn == "Y") {
                reportPath = 'report/60/95/einvoices_template/Hiknit/Hiknit_convert.xlsx'
                reportSheet = "Form HD GTGT TuIn 2014 (2)"
                this.masterDataArray.push(
                  { Cell: `E11`, Info: [`convert`], Type: 2 },
                  { Cell: `A37`, Info: [`CONVERT_NAME`], Type: 1 },
                  { Cell: `A38`, Info: [`CONVERT_DATE`], Type: 1 },
                )
              } else {
                reportPath = 'report/60/95/einvoices_template/Hiknit/Hiknit.xlsx'
                reportSheet = "Form HD GTGT TuIn 2014 (2)"
              }


              //bgPath = "assets/images/einvoices_logo/Hiknit/bg.png"
              logos = [
                { start: 0.3, width: 2.57 * dpi, height: 1.26 * dpi, logoStartCount: 2.5, logoPath: "assets/images/einvoices_logo/Hiknit/companylogo.png" },

              ]

              //mảng data của master
              this.masterDataArray.push(
                { Cell: `O9`, Info: [`TEMPLATECODE`], Type: 1 },
                { Cell: `O10`, Info: [`INVOICESERIALNO`], Type: 1 },
                { Cell: `N11`, Info: [`INVOICENUMBER`], Type: 1 },
                { Cell: `E12`, Info: [`dateString`], Type: 2 },
                { Cell: `L12`, Info: [`page`], Type: 2 },
                { Cell: `A41`, Info: [`footer`], Type: 2 },

                { Cell: `I3`, Info: [`SELLER_NAME`], Type: 1 },
                { Cell: `H4`, Info: [`SELLER_TAXCODE`], Type: 1 },
                { Cell: `H5`, Info: [`SELLER_ADDRESS`], Type: 1 },
                { Cell: `H7`, Info: [`SELLER_TEL`], Type: 1 },
                { Cell: `F8`, Info: [`SELLER_ACCOUNTNO`], Type: 1 },
                // { Cell: `N7`, Info: [`SELLER_FAX`], Type: 1 },
                // { Cell: `H5`, Info: [`SELLER_BANKNO`], Type: 1 },
                //{ Cell: `F6`, Info: [`SELLER_BANKNAME`], Type: 1 },

                { Cell: `D14`, Info: [`BUYER`], Type: 1 },
                { Cell: `C17`, Info: [`BUYERLEGALNAME`], Type: 1 },
                { Cell: `C19`, Info: [`BUYERTAXCODE`], Type: 1 },
                { Cell: `C18`, Info: [`BUYERADDRESS`], Type: 1 },
                { Cell: `O19`, Info: [`PAYMENTMETHODCK`], Type: 1 },
                //{ Cell: `N20`, Info: [`BUYERACCOUNTNO`], Type: 1 },
                // { Cell: `F18`, Info: [`BUYERPHONE`], Type: 1 },
                { Cell: `C21`, Info: [`BUYERPONO`], Type: 1 },
                //{ Cell: `O17`, Info: [`CURRENCYCODEUSD`], Type: 1 },
                // 
                { Cell: `C26`, Info: [`lb_amount_trans`], Type: 2 },
                //  { Cell: `E29`, Info: [`amount_trans`], Type: 2 },
                { Cell: `O26`, Info: [`amount_net`], Type: 2 },
                { Cell: `C27`, Info: [`TAXRATE`], Type: 1 },
                { Cell: `O27`, Info: [`amount_vat`], Type: 2 },//VAT Amount: 
                { Cell: `O28`, Info: [`amount_total`], Type: 2 },
                // { Cell: `H29`, Info: [`read_price`], Type: 2 },
                { Cell: `A30`, Info: [`read_price`], Type: 2 },

                { Cell: `C39`, Info: [`MATRACUU`], Type: 1 },

                { Cell: `M37`, Info: [`SIGNEDBY`], Type: 3 },
                { Cell: `M38`, Info: [`SIGNEDDATE`], Type: 3 },

              )
              // //"A", "B", "C", "D", "E", "F", "G", "H", "I", "J",  "K",  "L",  "M",  "N",  "O",  "P",  "Q",  "R",  "S",  "T",  "U",  "V",  "W",  "X",  "Y",  "Z",
              // //"1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26",

              //cấu trúc dòng detail
              // thin//dotted//dashDot//hair//dashDotDot//slantDashDot//mediumDashed//mediumDashDotDot//mediumDashDot//medium//double//thick
              detailCellFormat = [
                { startCell: 1, endCell: 1, cellType: 2, cellBorder: "dotted", field: "STT" },//từ cell bắt đầu tới cell kết thúc, type 2: cell đầu tiên
                { startCell: 2, endCell: 8, cellType: 3, cellBorder: "dotted", field: "ITEM_NAME" },//từ cell bắt đầu tới cell kết thúc, type 3: cell kế tiếp cell đầu tiên,
                { startCell: 9, endCell: 10, cellType: 1, cellBorder: "dotted", field: "ITEM_UOM" },//type 1: còn lại
                { startCell: 11, endCell: 12, cellType: 1, cellBorder: "dotted", field: "QTY" },//type 1: còn lại
                { startCell: 13, endCell: 14, cellType: 1, cellBorder: "dotted", field: "U_PRICE" },//type 1: còn lại
                { startCell: 15, endCell: 15, cellType: 1, cellBorder: "dotted", field: "NET_TR_AMT" },//type 1: còn lại
              ]
              // backgroundCell = 4
              // backgroundWidth = 300
              // backgroundHeight = 100

              signCell = { start: 13, end: 14 }
              signBoxCell = "M"
              signByCell = { start: 13, end: 15 }
              countFromEndDetailToSignBox = 10

              _sourceRow = 25
              _sourceRow_2 = 25
              _sourceRow_3 = 25
              headerRowCount = 24


              lastPageRowsHeight = 14
              break;

            default:

              break;
          }
          break;
        //////// *****************Hiknit*********************\\\\\\\\\



        //////bugging//////////////////////
        //////// *****************Bkvina*********************\\\\\\\\\
        case "Bkvina":
          this.masterDataArray = []
          switch (einvoiceMasterData[0].TEMPLATECODE) {
            // case "1":

            //   break;
            // case '01GTKT0/001':

            //   break;

            default:
              if (convertYn == "Y") {
                reportPath = 'report/60/95/einvoices_template/Bkvina/Bkvina_convert.xlsx'
                reportSheet = "HD GTGT"
                this.masterDataArray.push(
                  { Cell: `D12`, Info: [`convert`], Type: 2 },
                  { Cell: `B36`, Info: [`CONVERT_NAME`], Type: 1 },
                  { Cell: `B37`, Info: [`CONVERT_DATE`], Type: 1 },
                )
              } else {
                reportPath = 'report/60/95/einvoices_template/Bkvina/Bkvina.xlsx'
                reportSheet = "HD GTGT"
              }


              bgPath = "assets/images/einvoices_logo/Bkvina/bg.png"
              logos = [
                { start: 1, width: 1.52 * dpi, height: 1.1 * dpi, logoStartCount: 2.5, logoPath: "assets/images/einvoices_logo/Bkvina/companylogo.png" },

              ]

              //mảng data của master
              this.masterDataArray.push(
                { Cell: `O10`, Info: [`TEMPLATECODE`], Type: 1 },
                { Cell: `O11`, Info: [`INVOICESERIALNO`], Type: 1 },
                { Cell: `O12`, Info: [`INVOICENUMBER`], Type: 1 },
                { Cell: `E13`, Info: [`dateString`], Type: 2 },
                { Cell: `E14`, Info: [`page`], Type: 2 },
                // { Cell: `Q18`, Info: [`footer`], Type: 2 },

                { Cell: `E3`, Info: [`SELLER_NAME`], Type: 1 },
                { Cell: `N7`, Info: [`SELLER_TAXCODE`], Type: 1 },
                { Cell: `F4`, Info: [`SELLER_ADDRESS`], Type: 1 },
                { Cell: `F7`, Info: [`SELLER_TEL`], Type: 1 },
                // { Cell: `N7`, Info: [`SELLER_FAX`], Type: 1 },
                { Cell: `H5`, Info: [`SELLER_BANKNO`], Type: 1 },
                { Cell: `F6`, Info: [`SELLER_BANKNAME`], Type: 1 },

                { Cell: `F16`, Info: [`BUYER`], Type: 1 },
                { Cell: `F17`, Info: [`BUYERLEGALNAME`], Type: 1 },
                { Cell: `E19`, Info: [`BUYERTAXCODE`], Type: 1 },
                { Cell: `E18`, Info: [`BUYERADDRESS`], Type: 1 },
                { Cell: `F20`, Info: [`PAYMENTMETHODCK`], Type: 1 },
                { Cell: `N20`, Info: [`BUYERACCOUNTNO`], Type: 1 },
                // { Cell: `F18`, Info: [`BUYERPHONE`], Type: 1 },
                // { Cell: `G23`, Info: [`BUYERPONO`], Type: 1 },
                //{ Cell: `O17`, Info: [`CURRENCYCODEUSD`], Type: 1 },
                // 
                //{ Cell: `G26`, Info: [`lb_amount_trans`], Type: 2 },
                //  { Cell: `E29`, Info: [`amount_trans`], Type: 2 },
                { Cell: `M25`, Info: [`amount_net`], Type: 2 },
                // { Cell: `M27`, Info: [`TAXRATE`], Type: 1 },
                { Cell: `M26`, Info: [`amount_vat`], Type: 2 },//VAT Amount: 
                { Cell: `M27`, Info: [`amount_total`], Type: 2 },
                // { Cell: `H29`, Info: [`read_price`], Type: 2 },
                { Cell: `F28`, Info: [`read_price`], Type: 2 },

                //{ Cell: `C34`, Info: [`CQT_MCCQT_ID`], Type: 1 },
                { Cell: `E38`, Info: [`MATRACUU`], Type: 1 },

                { Cell: `M37`, Info: [`SIGNEDBY`], Type: 3 },
                { Cell: `M38`, Info: [`SIGNEDDATE`], Type: 3 },

              )
              // //"A", "B", "C", "D", "E", "F", "G", "H", "I", "J",  "K",  "L",  "M",  "N",  "O",  "P",  "Q",  "R",  "S",  "T",  "U",  "V",  "W",  "X",  "Y",  "Z",
              // //"1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26",

              //cấu trúc dòng detail
              // thin//dotted//dashDot//hair//dashDotDot//slantDashDot//mediumDashed//mediumDashDotDot//mediumDashDot//medium//double//thick
              detailCellFormat = [
                { startCell: 2, endCell: 2, cellType: 2, cellBorder: "dotted", field: "STT" },//từ cell bắt đầu tới cell kết thúc, type 2: cell đầu tiên
                { startCell: 3, endCell: 5, cellType: 3, cellBorder: "dotted", field: "ITEM_NAME" },//từ cell bắt đầu tới cell kết thúc, type 3: cell kế tiếp cell đầu tiên,
                { startCell: 6, endCell: 7, cellType: 1, cellBorder: "dotted", field: "ITEM_UOM" },//type 1: còn lại
                { startCell: 8, endCell: 10, cellType: 1, cellBorder: "dotted", field: "QTY" },//type 1: còn lại
                { startCell: 11, endCell: 12, cellType: 1, cellBorder: "dotted", field: "U_PRICE" },//type 1: còn lại
                { startCell: 13, endCell: 15, cellType: 1, cellBorder: "dotted", field: "NET_TR_AMT" },//type 1: còn lại
              ]
              backgroundCell = 4
              backgroundWidth = 300
              backgroundHeight = 100

              signCell = { start: 13, end: 14 }
              signBoxCell = "M"
              signByCell = { start: 13, end: 15 }
              countFromEndDetailToSignBox = 11

              _sourceRow = 24
              _sourceRow_2 = 24
              _sourceRow_3 = 24
              headerRowCount = 23


              lastPageRowsHeight = 14
              break;
          }
          break;
        //////// *****************Bkvina*********************\\\\\\\\\


        //////// *****************Kukil*********************\\\\\\\\\
        case "Kukil":
          this.masterDataArray = []
          switch (einvoiceMasterData[0].TEMPLATECODE) {
            case "1":
              if (convertYn == "Y") {
                reportPath = 'report/60/95/einvoices_template/Kukil/Kukil_convert_1.xlsx'
                reportSheet = "ORG"
                this.masterDataArray.push(
                  { Cell: `D12`, Info: [`convert`], Type: 2 },
                  { Cell: `B35`, Info: [`CONVERT_NAME`], Type: 1 },
                  { Cell: `B36`, Info: [`CONVERT_DATE`], Type: 1 },
                )
              } else {
                reportPath = 'report/60/95/einvoices_template/Kukil/Kukil_1.xlsx'
                reportSheet = "ORG"
              }


              bgPath = "assets/images/einvoices_logo/Kukil/bg.png"
              logos = [
                { start: 1.1, width: 0.92 * dpi, height: 1.12 * dpi, logoStartCount: 0.2, logoPath: "assets/images/einvoices_logo/Kukil/companylogo.png" },

              ]

              //mảng data của master
              this.masterDataArray.push(
                { Cell: `S10`, Info: [`TEMPLATECODE`, `INVOICESERIALNO`], Type: 1 },
                { Cell: `S12`, Info: [`INVOICENUMBER`], Type: 1 },
                { Cell: `D13`, Info: [`dateString`], Type: 2 },
                { Cell: `D14`, Info: [`page`], Type: 2 },
                { Cell: `B41`, Info: [`footer`], Type: 2 },

                { Cell: `D1`, Info: [`SELLER_NAME`], Type: 1 },
                { Cell: `J15`, Info: [`SELLER_TAXCODE`], Type: 1 },
                { Cell: `G4`, Info: [`SELLER_ADDRESS`], Type: 1 },
                { Cell: `H6`, Info: [`SELLER_TEL`], Type: 1 },
                { Cell: `P6`, Info: [`SELLER_FAX`], Type: 1 },
                { Cell: `H7`, Info: [`SELLER_ACCOUNTNO`], Type: 1 },
                { Cell: `H8`, Info: [`SELLER_ACCOUNTNO2`], Type: 1 },
                // { Cell: `E12`, Info: [`BUYER_BANK_NAME`], Type: 1 },

                { Cell: `I21`, Info: [`BUYER`], Type: 1 },
                { Cell: `H15`, Info: [`BUYERLEGALNAME`], Type: 1 },
                { Cell: `F17`, Info: [`BUYERTAXCODE`], Type: 1 },
                { Cell: `E16`, Info: [`BUYERADDRESS`], Type: 1 },
                { Cell: `L23`, Info: [`PAYMENTMETHODCK`], Type: 1 },
                { Cell: `G20`, Info: [`BUYERACCOUNTNO`], Type: 1 },
                { Cell: `F18`, Info: [`BUYERPHONE`], Type: 1 },
                { Cell: `G23`, Info: [`BUYERPONO`], Type: 1 },
                //{ Cell: `O17`, Info: [`CURRENCYCODEUSD`], Type: 1 },
                // 
                { Cell: `G26`, Info: [`lb_amount_trans`], Type: 2 },
                //  { Cell: `E29`, Info: [`amount_trans`], Type: 2 },
                { Cell: `S26`, Info: [`amount_net`], Type: 2 },
                { Cell: `H27`, Info: [`TAXRATE`], Type: 1 },
                { Cell: `S27`, Info: [`amount_vat`], Type: 2 },//VAT Amount: 
                { Cell: `S28`, Info: [`amount_total`], Type: 2 },
                { Cell: `H29`, Info: [`read_price`], Type: 2 },
                { Cell: `H30`, Info: [`read_price`], Type: 2 },

                { Cell: `E38`, Info: [`CQT_MCCQT_ID`], Type: 1 },
                { Cell: `R39`, Info: [`MATRACUU`], Type: 1 },

                { Cell: `R37`, Info: [`SIGNEDBY`], Type: 3 },
                { Cell: `R38`, Info: [`SIGNEDDATE`], Type: 3 },

              )
              // //"A", "B", "C", "D", "E", "F", "G", "H", "I", "J",  "K",  "L",  "M",  "N",  "O",  "P",  "Q",  "R",  "S",  "T",  "U",  "V",  "W",  "X",  "Y",  "Z",
              // //"1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26",

              //cấu trúc dòng detail
              // thin//dotted//dashDot//hair//dashDotDot//slantDashDot//mediumDashed//mediumDashDotDot//mediumDashDot//medium//double//thick
              detailCellFormat = [
                { startCell: 2, endCell: 2, cellType: 2, cellBorder: "dotted", field: "STT" },//từ cell bắt đầu tới cell kết thúc, type 2: cell đầu tiên
                { startCell: 3, endCell: 11, cellType: 3, cellBorder: "dotted", field: "ITEM_NAME" },//từ cell bắt đầu tới cell kết thúc, type 3: cell kế tiếp cell đầu tiên,
                { startCell: 12, endCell: 14, cellType: 1, cellBorder: "dotted", field: "ITEM_UOM" },//type 1: còn lại
                { startCell: 15, endCell: 17, cellType: 1, cellBorder: "dotted", field: "QTY" },//type 1: còn lại
                { startCell: 18, endCell: 18, cellType: 1, cellBorder: "dotted", field: "U_PRICE" },//type 1: còn lại
                { startCell: 19, endCell: 19, cellType: 1, cellBorder: "dotted", field: "NET_TR_AMT" },//type 1: còn lại
              ]
              backgroundCell = 8
              backgroundWidth = 200
              backgroundHeight = 100

              signCell = { start: 17, end: 18 }
              signBoxCell = "R"
              signByCell = { start: 18, end: 19 }
              countFromEndDetailToSignBox = 10

              _sourceRow = 25
              _sourceRow_2 = 25
              _sourceRow_3 = 25
              headerRowCount = 24


              lastPageRowsHeight = 14
              break;
            case '01GTKT0/001':
              if (convertYn == "Y") {
                reportPath = 'report/60/95/einvoices_template/Kukil/Kukil_convert.xlsx'
                reportSheet = "ORG"
                this.masterDataArray.push(
                  { Cell: `D12`, Info: [`convert`], Type: 2 },
                  { Cell: `B35`, Info: [`CONVERT_NAME`], Type: 1 },
                  { Cell: `B36`, Info: [`CONVERT_DATE`], Type: 1 },
                )
              } else {
                reportPath = 'report/60/95/einvoices_template/Kukil/Kukil.xlsx'
                reportSheet = "ORG"
              }


              bgPath = "assets/images/einvoices_logo/Kukil/bg.png"
              logos = [
                { start: 1.1, width: 0.92 * dpi, height: 1.12 * dpi, logoStartCount: 0.2, logoPath: "assets/images/einvoices_logo/Kukil/companylogo.png" },

              ]

              //mảng data của master
              this.masterDataArray.push(
                { Cell: `S9`, Info: [`TEMPLATECODE`], Type: 1 },
                { Cell: `S10`, Info: [`INVOICESERIALNO`], Type: 1 },
                { Cell: `S12`, Info: [`INVOICENUMBER`], Type: 1 },
                { Cell: `D13`, Info: [`dateString`], Type: 2 },
                { Cell: `D14`, Info: [`page`], Type: 2 },
                { Cell: `B41`, Info: [`footer`], Type: 2 },

                { Cell: `D1`, Info: [`SELLER_NAME`], Type: 1 },
                { Cell: `J15`, Info: [`SELLER_TAXCODE`], Type: 1 },
                { Cell: `G4`, Info: [`SELLER_ADDRESS`], Type: 1 },
                { Cell: `H6`, Info: [`SELLER_TEL`], Type: 1 },
                { Cell: `P6`, Info: [`SELLER_FAX`], Type: 1 },
                { Cell: `H7`, Info: [`SELLER_ACCOUNTNO`], Type: 1 },
                { Cell: `H8`, Info: [`SELLER_ACCOUNTNO2`], Type: 1 },
                // { Cell: `E12`, Info: [`BUYER_BANK_NAME`], Type: 1 },

                { Cell: `I21`, Info: [`BUYER`], Type: 1 },
                { Cell: `H15`, Info: [`BUYERLEGALNAME`], Type: 1 },
                { Cell: `F17`, Info: [`BUYERTAXCODE`], Type: 1 },
                { Cell: `E16`, Info: [`BUYERADDRESS`], Type: 1 },
                { Cell: `L23`, Info: [`PAYMENTMETHODCK`], Type: 1 },
                { Cell: `G20`, Info: [`BUYERACCOUNTNO`], Type: 1 },
                { Cell: `F18`, Info: [`BUYERPHONE`], Type: 1 },
                { Cell: `G23`, Info: [`BUYERPONO`], Type: 1 },
                //{ Cell: `O17`, Info: [`CURRENCYCODEUSD`], Type: 1 },
                // 
                { Cell: `G26`, Info: [`lb_amount_trans`], Type: 2 },
                //  { Cell: `E29`, Info: [`amount_trans`], Type: 2 },
                { Cell: `S26`, Info: [`amount_net`], Type: 2 },
                { Cell: `H27`, Info: [`TAXRATE`], Type: 1 },
                { Cell: `S27`, Info: [`amount_vat`], Type: 2 },//VAT Amount: 
                { Cell: `S28`, Info: [`amount_total`], Type: 2 },
                { Cell: `H29`, Info: [`read_price`], Type: 2 },
                { Cell: `H30`, Info: [`read_price`], Type: 2 },

                //{ Cell: `C34`, Info: [`CQT_MCCQT_ID`], Type: 1 },
                { Cell: `E38`, Info: [`MATRACUU`], Type: 1 },

                { Cell: `R37`, Info: [`SIGNEDBY`], Type: 3 },
                { Cell: `R38`, Info: [`SIGNEDDATE`], Type: 3 },

              )
              // //"A", "B", "C", "D", "E", "F", "G", "H", "I", "J",  "K",  "L",  "M",  "N",  "O",  "P",  "Q",  "R",  "S",  "T",  "U",  "V",  "W",  "X",  "Y",  "Z",
              // //"1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26",

              //cấu trúc dòng detail
              // thin//dotted//dashDot//hair//dashDotDot//slantDashDot//mediumDashed//mediumDashDotDot//mediumDashDot//medium//double//thick
              detailCellFormat = [
                { startCell: 2, endCell: 2, cellType: 2, cellBorder: "dotted", field: "STT" },//từ cell bắt đầu tới cell kết thúc, type 2: cell đầu tiên
                { startCell: 3, endCell: 11, cellType: 3, cellBorder: "dotted", field: "ITEM_NAME" },//từ cell bắt đầu tới cell kết thúc, type 3: cell kế tiếp cell đầu tiên,
                { startCell: 12, endCell: 14, cellType: 1, cellBorder: "dotted", field: "ITEM_UOM" },//type 1: còn lại
                { startCell: 15, endCell: 17, cellType: 1, cellBorder: "dotted", field: "QTY" },//type 1: còn lại
                { startCell: 18, endCell: 18, cellType: 1, cellBorder: "dotted", field: "U_PRICE" },//type 1: còn lại
                { startCell: 19, endCell: 19, cellType: 1, cellBorder: "dotted", field: "NET_TR_AMT" },//type 1: còn lại
              ]
              backgroundCell = 8
              backgroundWidth = 200
              backgroundHeight = 100

              signCell = { start: 17, end: 18 }
              signBoxCell = "R"
              signByCell = { start: 18, end: 19 }
              countFromEndDetailToSignBox = 10

              _sourceRow = 25
              _sourceRow_2 = 25
              _sourceRow_3 = 25
              headerRowCount = 24


              lastPageRowsHeight = 14
              break;

            default:

              break;
          }
          break;
        //////// *****************Kukil*********************\\\\\\\\\


        //////// *****************Otm*********************\\\\\\\\\
        case "Otm":
          this.masterDataArray = []
          switch (einvoiceMasterData[0].TEMPLATECODE) {
            case "2":
              if (convertYn == "Y") {
                reportPath = 'report/60/95/einvoices_template/Otm/Otm_convert_2.xlsx'
                reportSheet = "Invoice"
                this.masterDataArray.push(
                  { Cell: `E8`, Info: [`convert`], Type: 2 },
                  { Cell: `B36`, Info: [`CONVERT_NAME`], Type: 1 },
                  { Cell: `B37`, Info: [`CONVERT_DATE`], Type: 1 },
                )
              } else {
                reportPath = 'report/60/95/einvoices_template/Otm/Otm_2.xlsx'
                reportSheet = "Invoice"
              }


              logos = [
                { start: 4, width: 0.45 * dpi, height: 0.5 * dpi, logoStartCount: 0.5, logoPath: "assets/images/einvoices_logo/Otm/companylogo.png" },

              ]

              //mảng data của master
              this.masterDataArray.push(
                { Cell: `O8`, Info: [`TEMPLATECODE`, `INVOICESERIALNO`], Type: 1 },
                { Cell: `N9`, Info: [`INVOICENUMBER`], Type: 1 },
                { Cell: `E9`, Info: [`dateString`], Type: 2 },
                { Cell: `E10`, Info: [`page`], Type: 2 },
                { Cell: `A41`, Info: [`footer`], Type: 2 },

                { Cell: `G12`, Info: [`SELLER_NAME`], Type: 1 },
                { Cell: `L16`, Info: [`SELLER_TAXCODE`], Type: 1 },
                { Cell: `E13`, Info: [`SELLER_ADDRESS`], Type: 1 },
                { Cell: `D16`, Info: [`SELLER_TEL`], Type: 1 },
                { Cell: `H16`, Info: [`SELLER_FAX`], Type: 1 },
                { Cell: `E15`, Info: [`SELLER_ACCOUNTNO`], Type: 1 },
                //{ Cell: `E12`, Info: [`SELLER_ACCOUNTNO`], Type: 1 },
                // { Cell: `E12`, Info: [`SELLER_BANKNAME`], Type: 1 },

                { Cell: `G19`, Info: [`BUYER`], Type: 1 },
                { Cell: `F20`, Info: [`BUYERLEGALNAME`], Type: 1 },
                { Cell: `L23`, Info: [`BUYERTAXCODE`], Type: 1 },
                { Cell: `E21`, Info: [`BUYERADDRESS`], Type: 1 },
                { Cell: `G23`, Info: [`PAYMENTMETHODCK`], Type: 1 },
                { Cell: `F22`, Info: [`BUYERACCOUNTNO`], Type: 1 },
                //{ Cell: `C18`, Info: [`BUYERPONO`], Type: 1 },
                //{ Cell: `O17`, Info: [`CURRENCYCODEUSD`], Type: 1 },
                // 
                //{ Cell: `D24`, Info: [`lb_amount_trans`], Type: 2 },
                //  { Cell: `E29`, Info: [`amount_trans`], Type: 2 },
                { Cell: `N28`, Info: [`amount_net`], Type: 2 },
                // { Cell: `E25`, Info: [`TAXRATE`], Type: 1 },
                // { Cell: `K25`, Info: [`amount_vat`], Type: 2 },//VAT Amount: 
                // { Cell: `K26`, Info: [`amount_total`], Type: 2 },
                { Cell: `F29`, Info: [`read_price`], Type: 2 },

                { Cell: `D38`, Info: [`CQT_MCCQT_ID`], Type: 1 },
                { Cell: `L39`, Info: [`MATRACUU`], Type: 1 },

                { Cell: `K36`, Info: [`SIGNEDBY`], Type: 3 },
                { Cell: `K37`, Info: [`SIGNEDDATE`], Type: 3 },

              )
              // //"A", "B", "C", "D", "E", "F", "G", "H", "I", "J",  "K",  "L",  "M",  "N",  "O",  "P",  "Q",  "R",  "S",  "T",  "U",  "V",  "W",  "X",  "Y",  "Z",
              // //"1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26",

              //cấu trúc dòng detail
              // thin//dotted//dashDot//hair//dashDotDot//slantDashDot//mediumDashed//mediumDashDotDot//mediumDashDot//medium//double//thick
              detailCellFormat = [
                { startCell: 1, endCell: 2, cellType: 2, cellBorder: "thin", field: "STT" },//từ cell bắt đầu tới cell kết thúc, type 2: cell đầu tiên
                { startCell: 3, endCell: 7, cellType: 3, cellBorder: "thin", field: "ITEM_NAME" },//từ cell bắt đầu tới cell kết thúc, type 3: cell kế tiếp cell đầu tiên,
                { startCell: 8, endCell: 8, cellType: 1, cellBorder: "thin", field: "ITEM_UOM" },//type 1: còn lại
                { startCell: 9, endCell: 10, cellType: 1, cellBorder: "thin", field: "QTY" },//type 1: còn lại
                { startCell: 11, endCell: 13, cellType: 1, cellBorder: "thin", field: "U_PRICE" },//type 1: còn lại
                { startCell: 14, endCell: 15, cellType: 1, cellBorder: "thin", field: "NET_TR_AMT" },//type 1: còn lại
              ]
              // backgroundCell = 3
              // backgroundWidth = 350
              // backgroundHeight = 200

              signCell = { start: 11, end: 13 }
              signBoxCell = "K"
              signByCell = { start: 11, end: 15 }
              countFromEndDetailToSignBox = 7

              _sourceRow = 27
              _sourceRow_2 = 27
              _sourceRow_3 = 27
              headerRowCount = 26


              lastPageRowsHeight = 14
              break;
            case '07KPTQ0/001':
              if (convertYn == "Y") {
                reportPath = 'report/60/95/einvoices_template/Otm/Otm_convert.xlsx'
                reportSheet = "Invoice"
                this.masterDataArray.push(
                  { Cell: `E8`, Info: [`convert`], Type: 2 },
                  { Cell: `B36`, Info: [`CONVERT_NAME`], Type: 1 },
                  { Cell: `B37`, Info: [`CONVERT_DATE`], Type: 1 },
                )
              } else {
                reportPath = 'report/60/95/einvoices_template/Otm/Otm.xlsx'
                reportSheet = "Invoice"
              }



              logos = [
                { start: 4, width: 0.45 * dpi, height: 0.5 * dpi, logoStartCount: 0.5, logoPath: "assets/images/einvoices_logo/Otm/companylogo.png" },

              ]

              //mảng data của master
              this.masterDataArray.push(
                { Cell: `O7`, Info: [`TEMPLATECODE`], Type: 1 },
                { Cell: `O8`, Info: [`INVOICESERIALNO`], Type: 1 },
                { Cell: `N9`, Info: [`INVOICENUMBER`], Type: 1 },
                { Cell: `E9`, Info: [`dateString`], Type: 2 },
                { Cell: `E10`, Info: [`page`], Type: 2 },
                { Cell: `A41`, Info: [`footer`], Type: 2 },

                { Cell: `G12`, Info: [`SELLER_NAME`], Type: 1 },
                { Cell: `L16`, Info: [`SELLER_TAXCODE`], Type: 1 },
                { Cell: `E13`, Info: [`SELLER_ADDRESS`], Type: 1 },
                { Cell: `D16`, Info: [`SELLER_TEL`], Type: 1 },
                { Cell: `H16`, Info: [`SELLER_FAX`], Type: 1 },
                { Cell: `E15`, Info: [`SELLER_ACCOUNTNO`], Type: 1 },
                //{ Cell: `E12`, Info: [`SELLER_ACCOUNTNO`], Type: 1 },
                // { Cell: `E12`, Info: [`SELLER_BANKNAME`], Type: 1 },

                { Cell: `G19`, Info: [`BUYER`], Type: 1 },
                { Cell: `F20`, Info: [`BUYERLEGALNAME`], Type: 1 },
                { Cell: `L23`, Info: [`BUYERTAXCODE`], Type: 1 },
                { Cell: `E21`, Info: [`BUYERADDRESS`], Type: 1 },
                { Cell: `G23`, Info: [`PAYMENTMETHODCK`], Type: 1 },
                { Cell: `F22`, Info: [`BUYERACCOUNTNO`], Type: 1 },
                //{ Cell: `C18`, Info: [`BUYERPONO`], Type: 1 },
                //{ Cell: `O17`, Info: [`CURRENCYCODEUSD`], Type: 1 },
                // 
                //{ Cell: `D24`, Info: [`lb_amount_trans`], Type: 2 },
                //  { Cell: `E29`, Info: [`amount_trans`], Type: 2 },
                { Cell: `N28`, Info: [`amount_net`], Type: 2 },
                // { Cell: `E25`, Info: [`TAXRATE`], Type: 1 },
                // { Cell: `K25`, Info: [`amount_vat`], Type: 2 },//VAT Amount: 
                // { Cell: `K26`, Info: [`amount_total`], Type: 2 },
                { Cell: `F29`, Info: [`read_price`], Type: 2 },

                //{ Cell: `C34`, Info: [`CQT_MCCQT_ID`], Type: 1 },
                { Cell: `D38`, Info: [`MATRACUU`], Type: 1 },

                { Cell: `K36`, Info: [`SIGNEDBY`], Type: 3 },
                { Cell: `K37`, Info: [`SIGNEDDATE`], Type: 3 },

              )
              // //"A", "B", "C", "D", "E", "F", "G", "H", "I", "J",  "K",  "L",  "M",  "N",  "O",  "P",  "Q",  "R",  "S",  "T",  "U",  "V",  "W",  "X",  "Y",  "Z",
              // //"1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26",

              //cấu trúc dòng detail
              // thin//dotted//dashDot//hair//dashDotDot//slantDashDot//mediumDashed//mediumDashDotDot//mediumDashDot//medium//double//thick
              detailCellFormat = [
                { startCell: 1, endCell: 2, cellType: 2, cellBorder: "thin", field: "STT" },//từ cell bắt đầu tới cell kết thúc, type 2: cell đầu tiên
                { startCell: 3, endCell: 7, cellType: 3, cellBorder: "thin", field: "ITEM_NAME" },//từ cell bắt đầu tới cell kết thúc, type 3: cell kế tiếp cell đầu tiên,
                { startCell: 8, endCell: 8, cellType: 1, cellBorder: "thin", field: "ITEM_UOM" },//type 1: còn lại
                { startCell: 9, endCell: 10, cellType: 1, cellBorder: "thin", field: "QTY" },//type 1: còn lại
                { startCell: 11, endCell: 13, cellType: 1, cellBorder: "thin", field: "U_PRICE" },//type 1: còn lại
                { startCell: 14, endCell: 15, cellType: 1, cellBorder: "thin", field: "NET_TR_AMT" },//type 1: còn lại
              ]
              // backgroundCell = 3
              // backgroundWidth = 350
              // backgroundHeight = 200

              signCell = { start: 11, end: 13 }
              signBoxCell = "K"
              signByCell = { start: 11, end: 15 }
              countFromEndDetailToSignBox = 7

              _sourceRow = 27
              _sourceRow_2 = 27
              _sourceRow_3 = 27
              headerRowCount = 26


              lastPageRowsHeight = 14
              break;

            default:

              break;
          }
          break;
        //////// *****************Otm*********************\\\\\\\\\


        //////// *****************Samil*********************\\\\\\\\\
        case "Samil":
          this.masterDataArray = []
          switch (einvoiceMasterData[0].TEMPLATECODE) {
            case "1":
              if (convertYn == "Y") {
                reportPath = 'report/60/95/einvoices_template/Samil/Samil_convert.xlsx'
                reportSheet = "GTGT"
                masterDataArray.push(
                  { Cell: `A10`, Info: [`convert`], Type: 2 },
                  { Cell: `A32`, Info: [`CONVERT_NAME`], Type: 1 },
                  { Cell: `A33`, Info: [`CONVERT_DATE`], Type: 1 },
                )
              } else {
                reportPath = 'report/60/95/einvoices_template/Samil/Samil.xlsx'
                reportSheet = "GTGT"
              }

              logos = [
                { start: 3.5, width: 2.63 * dpi, height: 0.33 * dpi, logoStartCount: 1.2, logoPath: "assets/images/einvoices_logo/Samil/companylogo.png" },

              ]

              //mảng data của master
              masterDataArray.push(
                { Cell: `K10`, Info: [`TEMPLATECODE`, `INVOICESERIALNO`], Type: 1 },
                { Cell: `K11`, Info: [`INVOICENUMBER`], Type: 1 },
                { Cell: `A11`, Info: [`dateString`], Type: 2 },
                { Cell: `A12`, Info: [`page`], Type: 2 },
                { Cell: `A37`, Info: [`footer`], Type: 2 },

                // { Cell: `E11`, Info: [`SELLER_NAME`], Type: 1 },
                { Cell: `D5`, Info: [`SELLER_TAXCODE`], Type: 1 },
                { Cell: `D3`, Info: [`SELLER_ADDRESS`], Type: 1 },
                { Cell: `D4`, Info: [`SELLER_TEL`], Type: 1 },
                { Cell: `H4`, Info: [`SELLER_FAX`], Type: 1 },
                { Cell: `D6`, Info: [`SELLER_ACCOUNTNO`], Type: 1 },
                //{ Cell: `E12`, Info: [`SELLER_ACCOUNTNO`], Type: 1 },
                // { Cell: `E12`, Info: [`SELLER_BANKNAME`], Type: 1 },

                { Cell: `F13`, Info: [`BUYER`], Type: 1 },
                { Cell: `D14`, Info: [`BUYERLEGALNAME`], Type: 1 },
                { Cell: `K16`, Info: [`BUYERTAXCODE`], Type: 1 },
                { Cell: `C15`, Info: [`BUYERADDRESS`], Type: 1 },
                { Cell: `F16`, Info: [`PAYMENTMETHODCK`], Type: 1 },
                //{ Cell: `L23`, Info: [`BUYERACCOUNTNO`], Type: 1 },
                { Cell: `C18`, Info: [`BUYERPONO`], Type: 1 },
                //{ Cell: `O17`, Info: [`CURRENCYCODEUSD`], Type: 1 },
                // 
                { Cell: `D24`, Info: [`lb_amount_trans`], Type: 2 },
                //  { Cell: `E29`, Info: [`amount_trans`], Type: 2 },
                { Cell: `K24`, Info: [`amount_net`], Type: 2 },
                { Cell: `E25`, Info: [`TAXRATE`], Type: 1 },
                { Cell: `K25`, Info: [`amount_vat`], Type: 2 },//VAT Amount: 
                { Cell: `K26`, Info: [`amount_total`], Type: 2 },
                { Cell: `F27`, Info: [`read_price`], Type: 2 },

                // { Cell: `D33`, Info: [`CQT_MCCQT_ID`], Type: 1 },
                { Cell: `C34`, Info: [`MATRACUU`], Type: 1 },

                { Cell: `I33`, Info: [`SIGNEDBY`], Type: 3 },
                { Cell: `I34`, Info: [`SIGNEDDATE`], Type: 3 },

              )
              // //"A", "B", "C", "D", "E", "F", "G", "H", "I", "J",  "K",  "L",  "M",  "N",  "O",  "P",  "Q",  "R",  "S",  "T",  "U",  "V",  "W",  "X",  "Y",  "Z",
              // //"1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26",

              //cấu trúc dòng detail
              // thin//dotted//dashDot//hair//dashDotDot//slantDashDot//mediumDashed//mediumDashDotDot//mediumDashDot//medium//double//thick
              detailCellFormat = [
                { startCell: 1, endCell: 1, cellType: 2, cellBorder: "dotted", field: "STT" },//từ cell bắt đầu tới cell kết thúc, type 2: cell đầu tiên
                { startCell: 2, endCell: 6, cellType: 3, cellBorder: "dotted", field: "ITEM_NAME" },//từ cell bắt đầu tới cell kết thúc, type 3: cell kế tiếp cell đầu tiên,
                { startCell: 7, endCell: 7, cellType: 1, cellBorder: "dotted", field: "ITEM_UOM" },//type 1: còn lại
                { startCell: 8, endCell: 9, cellType: 1, cellBorder: "dotted", field: "QTY" },//type 1: còn lại
                { startCell: 10, endCell: 10, cellType: 1, cellBorder: "dotted", field: "U_PRICE" },//type 1: còn lại
                { startCell: 11, endCell: 12, cellType: 1, cellBorder: "dotted", field: "NET_TR_AMT" },//type 1: còn lại
              ]
              backgroundCell = 3
              backgroundWidth = 350
              backgroundHeight = 200

              signCell = { start: 9, end: 11 }
              signBoxCell = "I"
              signByCell = { start: 9, end: 12 }
              countFromEndDetailToSignBox = 8

              _sourceRow = 23
              _sourceRow_2 = 23
              _sourceRow_3 = 23
              headerRowCount = 22


              lastPageRowsHeight = 14
              break;
            case '01GTKT0/001':
              if (convertYn == "Y") {
                reportPath = 'report/60/95/einvoices_template/Samil/Samil_convert_1.xlsx'
                reportSheet = "GTGT"
                this.masterDataArray.push(
                  { Cell: `A10`, Info: [`convert`], Type: 2 },
                  { Cell: `A32`, Info: [`CONVERT_NAME`], Type: 1 },
                  { Cell: `A33`, Info: [`CONVERT_DATE`], Type: 1 },
                )
              } else {
                reportPath = 'report/60/95/einvoices_template/Samil/Samil_1.xlsx'
                reportSheet = "GTGT"
              }

              logos = [
                { start: 3.5, width: 2.63 * dpi, height: 0.33 * dpi, logoStartCount: 1.2, logoPath: "assets/images/einvoices_logo/Samil/companylogo.png" },

              ]

              //mảng data của master
              this.masterDataArray.push(
                { Cell: `K9`, Info: [`TEMPLATECODE`], Type: 1 },
                { Cell: `K10`, Info: [`INVOICESERIALNO`], Type: 1 },
                { Cell: `K11`, Info: [`INVOICENUMBER`], Type: 1 },
                { Cell: `A11`, Info: [`dateString`], Type: 2 },
                { Cell: `A12`, Info: [`page`], Type: 2 },
                { Cell: `A37`, Info: [`footer`], Type: 2 },

                // { Cell: `E11`, Info: [`SELLER_NAME`], Type: 1 },
                { Cell: `D5`, Info: [`SELLER_TAXCODE`], Type: 1 },
                { Cell: `D3`, Info: [`SELLER_ADDRESS`], Type: 1 },
                { Cell: `D4`, Info: [`SELLER_TEL`], Type: 1 },
                { Cell: `H4`, Info: [`SELLER_FAX`], Type: 1 },
                { Cell: `D6`, Info: [`SELLER_ACCOUNTNO`], Type: 1 },
                //{ Cell: `E12`, Info: [`SELLER_ACCOUNTNO`], Type: 1 },
                // { Cell: `E12`, Info: [`SELLER_BANKNAME`], Type: 1 },

                { Cell: `F13`, Info: [`BUYER`], Type: 1 },
                { Cell: `D14`, Info: [`BUYERLEGALNAME`], Type: 1 },
                { Cell: `K16`, Info: [`BUYERTAXCODE`], Type: 1 },
                { Cell: `C15`, Info: [`BUYERADDRESS`], Type: 1 },
                { Cell: `F16`, Info: [`PAYMENTMETHODCK`], Type: 1 },
                //{ Cell: `L23`, Info: [`BUYERACCOUNTNO`], Type: 1 },
                { Cell: `C18`, Info: [`BUYERPONO`], Type: 1 },
                //{ Cell: `O17`, Info: [`CURRENCYCODEUSD`], Type: 1 },
                // 
                { Cell: `D24`, Info: [`lb_amount_trans`], Type: 2 },
                //  { Cell: `E29`, Info: [`amount_trans`], Type: 2 },
                { Cell: `K24`, Info: [`amount_net`], Type: 2 },
                { Cell: `E25`, Info: [`TAXRATE`], Type: 1 },
                { Cell: `K25`, Info: [`amount_vat`], Type: 2 },//VAT Amount: 
                { Cell: `K26`, Info: [`amount_total`], Type: 2 },
                { Cell: `F27`, Info: [`read_price`], Type: 2 },

                { Cell: `C34`, Info: [`CQT_MCCQT_ID`], Type: 1 },
                { Cell: `J34`, Info: [`MATRACUU`], Type: 1 },

                { Cell: `I33`, Info: [`SIGNEDBY`], Type: 3 },
                { Cell: `I34`, Info: [`SIGNEDDATE`], Type: 3 },

              )
              // //"A", "B", "C", "D", "E", "F", "G", "H", "I", "J",  "K",  "L",  "M",  "N",  "O",  "P",  "Q",  "R",  "S",  "T",  "U",  "V",  "W",  "X",  "Y",  "Z",
              // //"1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26",

              //cấu trúc dòng detail
              // thin//dotted//dashDot//hair//dashDotDot//slantDashDot//mediumDashed//mediumDashDotDot//mediumDashDot//medium//double//thick
              detailCellFormat = [
                { startCell: 1, endCell: 1, cellType: 2, cellBorder: "dotted", field: "STT" },//từ cell bắt đầu tới cell kết thúc, type 2: cell đầu tiên
                { startCell: 2, endCell: 6, cellType: 3, cellBorder: "dotted", field: "ITEM_NAME" },//từ cell bắt đầu tới cell kết thúc, type 3: cell kế tiếp cell đầu tiên,
                { startCell: 7, endCell: 7, cellType: 1, cellBorder: "dotted", field: "ITEM_UOM" },//type 1: còn lại
                { startCell: 8, endCell: 9, cellType: 1, cellBorder: "dotted", field: "QTY" },//type 1: còn lại
                { startCell: 10, endCell: 10, cellType: 1, cellBorder: "dotted", field: "U_PRICE" },//type 1: còn lại
                { startCell: 11, endCell: 12, cellType: 1, cellBorder: "dotted", field: "NET_TR_AMT" },//type 1: còn lại
              ]
              backgroundCell = 3
              backgroundWidth = 350
              backgroundHeight = 200

              signCell = { start: 9, end: 11 }
              signBoxCell = "I"
              signByCell = { start: 9, end: 12 }
              countFromEndDetailToSignBox = 8

              _sourceRow = 23
              _sourceRow_2 = 23
              _sourceRow_3 = 23
              headerRowCount = 22


              lastPageRowsHeight = 14
              break;

            default:

              break;
          }
          break;
        //////// *****************Samil*********************\\\\\\\\\


        //////// *****************Cuckoo*********************\\\\\\\\\
        case "Cuckoo":
          this.masterDataArray = []
          switch (einvoiceMasterData[0].TEMPLATECODE) {
            case "1":
              if (convertYn == "Y") {
                reportPath = 'report/60/95/einvoices_template/Cuckoo/Cuckoo_convert_1.xlsx'
                reportSheet = "GTGT (original) _L6"
                this.masterDataArray.push(
                  { Cell: `E6`, Info: [`convert`], Type: 2 },
                  { Cell: `B49`, Info: [`CONVERT_NAME`], Type: 1 },
                  { Cell: `B50`, Info: [`CONVERT_DATE`], Type: 1 },
                )
              } else {
                reportPath = 'report/60/95/einvoices_template/Cuckoo/Cuckoo_1.xlsx'
                reportSheet = "GTGT (original) _L6"
              }

              bgPath = "assets/images/einvoices_logo/Cuckoo/bg.png"

              logos = [
                { start: 1, width: 1.49 * dpi, height: 0.44 * dpi, logoStartCount: 4, logoPath: "assets/images/einvoices_logo/Cuckoo/companylogo.png" },
                { start: 11, width: 0.96 * dpi, height: 0.96 * dpi, logoStartCount: 10, logoPath: qrPath },
              ]

              //mảng data của master
              this.masterDataArray.push(
                { Cell: `L5`, Info: [`TEMPLATECODE`, `INVOICESERIALNO`], Type: 1 },
                { Cell: `L7`, Info: [`INVOICENUMBER`], Type: 1 },
                { Cell: `E7`, Info: [`dateString`], Type: 2 },
                { Cell: `E8`, Info: [`page`], Type: 2 },
                { Cell: `B43`, Info: [`footer`], Type: 2 },

                { Cell: `E11`, Info: [`SELLER_NAME`], Type: 1 },
                { Cell: `E12`, Info: [`SELLER_TAXCODE`], Type: 1 },
                { Cell: `E13`, Info: [`SELLER_ADDRESS`], Type: 1 },
                { Cell: `E15`, Info: [`SELLER_TEL`], Type: 1 },
                // { Cell: `D15`, Info: [`SELLER_FAX`], Type: 1 },
                { Cell: `E16`, Info: [`SELLER_ACCOUNTNO`], Type: 1 },
                //{ Cell: `E12`, Info: [`SELLER_ACCOUNTNO`], Type: 1 },
                // { Cell: `E12`, Info: [`SELLER_BANKNAME`], Type: 1 },

                { Cell: `F18`, Info: [`BUYER`], Type: 1 },
                { Cell: `F20`, Info: [`BUYERLEGALNAME`], Type: 1 },
                { Cell: `E21`, Info: [`BUYERTAXCODE`], Type: 1 },
                { Cell: `D19`, Info: [`BUYERADDRESS`], Type: 1 },
                { Cell: `H22`, Info: [`PAYMENTMETHODCK`], Type: 1 },
                { Cell: `L23`, Info: [`BUYERACCOUNTNO`], Type: 1 },
                { Cell: `E24`, Info: [`BUYERPONO`], Type: 1 },
                //{ Cell: `O17`, Info: [`CURRENCYCODEUSD`], Type: 1 },
                // 
                // { Cell: `E27`, Info: [`lb_amount_trans`], Type: 2 },
                //  { Cell: `E29`, Info: [`amount_trans`], Type: 2 },
                { Cell: `L30`, Info: [`amount_net`], Type: 2 },
                { Cell: `F31`, Info: [`TAXRATE`], Type: 1 },
                { Cell: `L31`, Info: [`amount_vat`], Type: 2 },//VAT Amount: 
                { Cell: `L32`, Info: [`amount_total`], Type: 2 },
                { Cell: `G33`, Info: [`read_price`], Type: 2 },

                { Cell: `D40`, Info: [`CQT_MCCQT_ID`], Type: 1 },
                { Cell: `K41`, Info: [`MATRACUU`], Type: 1 },

                { Cell: `K39`, Info: [`SIGNEDBY`], Type: 3 },
                { Cell: `K40`, Info: [`SIGNEDDATE`], Type: 3 },

              )
              // //"A", "B", "C", "D", "E", "F", "G", "H", "I", "J",  "K",  "L",  "M",  "N",  "O",  "P",  "Q",  "R",  "S",  "T",  "U",  "V",  "W",  "X",  "Y",  "Z",
              // //"1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26",

              //cấu trúc dòng detail
              // thin//dotted//dashDot//hair//dashDotDot//slantDashDot//mediumDashed//mediumDashDotDot//mediumDashDot//medium//double//thick
              detailCellFormat = [
                { startCell: 2, endCell: 2, cellType: 2, cellBorder: "dotted", field: "STT" },//từ cell bắt đầu tới cell kết thúc, type 2: cell đầu tiên
                { startCell: 3, endCell: 7, cellType: 3, cellBorder: "dotted", field: "ITEM_NAME" },//từ cell bắt đầu tới cell kết thúc, type 3: cell kế tiếp cell đầu tiên,
                { startCell: 8, endCell: 8, cellType: 1, cellBorder: "dotted", field: "ITEM_UOM" },//type 1: còn lại
                { startCell: 9, endCell: 10, cellType: 1, cellBorder: "dotted", field: "QTY" },//type 1: còn lại
                { startCell: 11, endCell: 11, cellType: 1, cellBorder: "dotted", field: "U_PRICE" },//type 1: còn lại
                { startCell: 12, endCell: 13, cellType: 1, cellBorder: "dotted", field: "NET_TR_AMT" },//type 1: còn lại
              ]
              backgroundCell = 3
              backgroundWidth = 350
              backgroundHeight = 200

              signCell = { start: 10, end: 12 }
              signBoxCell = "K"
              signByCell = { start: 11, end: 14 }
              countFromEndDetailToSignBox = 8

              _sourceRow = 29
              _sourceRow_2 = 29
              _sourceRow_3 = 29
              headerRowCount = 28


              lastPageRowsHeight = 14
              break;
            case '01GTKT0/001':
            case '01GTKT0/003':
            case '01GTKT0/004':
              if (convertYn == "Y") {
                reportPath = 'report/60/95/einvoices_template/Cuckoo/Cuckoo_convert.xlsx'
                reportSheet = "GTGT (original) _L6"
                this.masterDataArray.push(
                  { Cell: `E6`, Info: [`convert`], Type: 2 },
                  { Cell: `B49`, Info: [`CONVERT_NAME`], Type: 1 },
                  { Cell: `B50`, Info: [`CONVERT_DATE`], Type: 1 },
                )
              } else {
                reportPath = 'report/60/95/einvoices_template/Cuckoo/Cuckoo.xlsx'
                reportSheet = "GTGT (original) _L6"
              }

              bgPath = "assets/images/einvoices_logo/Cuckoo/bg.png"

              logos = [
                { start: 1, width: 1.49 * dpi, height: 0.44 * dpi, logoStartCount: 4, logoPath: "assets/images/einvoices_logo/Cuckoo/companylogo.png" },
                { start: 11, width: 0.96 * dpi, height: 0.96 * dpi, logoStartCount: 10, logoPath: qrPath },
              ]

              //mảng data của master
              this.masterDataArray.push(
                { Cell: `L2`, Info: [`TEMPLATECODE`], Type: 1 },
                { Cell: `L5`, Info: [`INVOICESERIALNO`], Type: 1 },
                { Cell: `L7`, Info: [`INVOICENUMBER`], Type: 1 },
                { Cell: `E7`, Info: [`dateString`], Type: 2 },
                { Cell: `E8`, Info: [`page`], Type: 2 },
                { Cell: `B43`, Info: [`footer`], Type: 2 },

                { Cell: `E11`, Info: [`SELLER_NAME`], Type: 1 },
                { Cell: `E12`, Info: [`SELLER_TAXCODE`], Type: 1 },
                { Cell: `E13`, Info: [`SELLER_ADDRESS`], Type: 1 },
                { Cell: `E15`, Info: [`SELLER_TEL`], Type: 1 },
                // { Cell: `D15`, Info: [`SELLER_FAX`], Type: 1 },
                { Cell: `E16`, Info: [`SELLER_ACCOUNTNO`], Type: 1 },
                //{ Cell: `E12`, Info: [`SELLER_ACCOUNTNO`], Type: 1 },
                // { Cell: `E12`, Info: [`SELLER_BANKNAME`], Type: 1 },

                { Cell: `F18`, Info: [`BUYER`], Type: 1 },
                { Cell: `F20`, Info: [`BUYERLEGALNAME`], Type: 1 },
                { Cell: `E21`, Info: [`BUYERTAXCODE`], Type: 1 },
                { Cell: `D19`, Info: [`BUYERADDRESS`], Type: 1 },
                { Cell: `H22`, Info: [`PAYMENTMETHODCK`], Type: 1 },
                { Cell: `L23`, Info: [`BUYERACCOUNTNO`], Type: 1 },
                { Cell: `E24`, Info: [`BUYERPONO`], Type: 1 },
                //{ Cell: `O17`, Info: [`CURRENCYCODEUSD`], Type: 1 },
                // 
                // { Cell: `E27`, Info: [`lb_amount_trans`], Type: 2 },
                //  { Cell: `E29`, Info: [`amount_trans`], Type: 2 },
                { Cell: `L30`, Info: [`amount_net`], Type: 2 },
                { Cell: `F31`, Info: [`TAXRATE`], Type: 1 },
                { Cell: `L31`, Info: [`amount_vat`], Type: 2 },//VAT Amount: 
                { Cell: `L32`, Info: [`amount_total`], Type: 2 },
                { Cell: `G33`, Info: [`read_price`], Type: 2 },

                // { Cell: `D33`, Info: [`CQT_MCCQT_ID`], Type: 1 },
                { Cell: `D40`, Info: [`MATRACUU`], Type: 1 },

                { Cell: `K39`, Info: [`SIGNEDBY`], Type: 3 },
                { Cell: `K40`, Info: [`SIGNEDDATE`], Type: 3 },

              )
              // //"A", "B", "C", "D", "E", "F", "G", "H", "I", "J",  "K",  "L",  "M",  "N",  "O",  "P",  "Q",  "R",  "S",  "T",  "U",  "V",  "W",  "X",  "Y",  "Z",
              // //"1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26",

              //cấu trúc dòng detail
              // thin//dotted//dashDot//hair//dashDotDot//slantDashDot//mediumDashed//mediumDashDotDot//mediumDashDot//medium//double//thick
              detailCellFormat = [
                { startCell: 2, endCell: 2, cellType: 2, cellBorder: "dotted", field: "STT" },//từ cell bắt đầu tới cell kết thúc, type 2: cell đầu tiên
                { startCell: 3, endCell: 7, cellType: 3, cellBorder: "dotted", field: "ITEM_NAME" },//từ cell bắt đầu tới cell kết thúc, type 3: cell kế tiếp cell đầu tiên,
                { startCell: 8, endCell: 8, cellType: 1, cellBorder: "dotted", field: "ITEM_UOM" },//type 1: còn lại
                { startCell: 9, endCell: 10, cellType: 1, cellBorder: "dotted", field: "QTY" },//type 1: còn lại
                { startCell: 11, endCell: 11, cellType: 1, cellBorder: "dotted", field: "U_PRICE" },//type 1: còn lại
                { startCell: 12, endCell: 13, cellType: 1, cellBorder: "dotted", field: "NET_TR_AMT" },//type 1: còn lại
              ]
              backgroundCell = 3
              backgroundWidth = 350
              backgroundHeight = 200

              signCell = { start: 10, end: 12 }
              signBoxCell = "K"
              signByCell = { start: 11, end: 14 }
              countFromEndDetailToSignBox = 8

              _sourceRow = 29
              _sourceRow_2 = 29
              _sourceRow_3 = 29
              headerRowCount = 28


              lastPageRowsHeight = 14
              break;

            default:

              break;
          }
          break;
        //////// *****************Cuckoo*********************\\\\\\\\\



        //////// *****************Jungwoo*********************\\\\\\\\\
        case "Jungwoo":
          this.masterDataArray = []
          switch (einvoiceMasterData[0].TEMPLATECODE) {
            case "1":
              if (convertYn == "Y") {
                reportPath = 'report/60/95/einvoices_template/Jungwoo/Jungwoo_convert.xlsx'
                reportSheet = "ORG (2)"
                this.masterDataArray.push(
                  { Cell: `D6`, Info: [`convert`], Type: 2 },
                  { Cell: `B37`, Info: [`CONVERT_NAME`], Type: 1 },
                  { Cell: `B38`, Info: [`CONVERT_DATE`], Type: 1 },
                )
              } else {
                reportPath = 'report/60/95/einvoices_template/Jungwoo/Jungwoo.xlsx'
                reportSheet = "ORG (2)"
              }

              //bgPath = "assets/images/einvoices_logo/Jungwoo/bg.png")

              logos = [
                { start: 0.5, width: 1.45 * dpi, height: 0.74 * dpi, logoStartCount: 2, logoPath: "assets/images/einvoices_logo/Jungwoo/companylogo.png" },
              ]
              this.msThueCutter(["G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R"], einvoiceMasterData[0].SELLER_TAXCODE.replace(/\s+/g, ''), 14)
              this.msThueCutter(["G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R"], einvoiceMasterData[0].BUYERTAXCODE.replace(/\s+/g, ''), 23)
              // console.log(qrCodeImage(qrCodeData))
              //mảng data của master
              this.masterDataArray.push(
                { Cell: `W4`, Info: [`TEMPLATECODE`, `INVOICESERIALNO`], Type: 1 },
                { Cell: `W6`, Info: [`INVOICENUMBER`], Type: 1 },
                { Cell: `D7`, Info: [`dateString`], Type: 2 },
                { Cell: `D9`, Info: [`page`], Type: 2 },
                { Cell: `B42`, Info: [`footer`], Type: 2 },

                { Cell: `D11`, Info: [`SELLER_NAME`], Type: 1 },
                // { Cell: ``, Info: [`SELLER_TAXCODE`], Type: 1 },
                { Cell: `D12`, Info: [`SELLER_ADDRESS`], Type: 1 },
                { Cell: `D14`, Info: [`SELLER_TEL`], Type: 1 },
                { Cell: `D15`, Info: [`SELLER_FAX`], Type: 1 },
                { Cell: `D13`, Info: [`SELLER_ACCOUNTNO`], Type: 1 },
                //{ Cell: `E12`, Info: [`SELLER_ACCOUNTNO`], Type: 1 },
                // { Cell: `E12`, Info: [`SELLER_BANKNAME`], Type: 1 },

                { Cell: `D19`, Info: [`BUYER`], Type: 1 },
                { Cell: `D20`, Info: [`BUYERLEGALNAME`], Type: 1 },
                //{ Cell: `E16`, Info: [`BUYERTAXCODE`], Type: 1 },
                { Cell: `D21`, Info: [`BUYERADDRESS`], Type: 1 },
                { Cell: `D23`, Info: [`PAYMENTMETHODCK`], Type: 1 },
                { Cell: `D22`, Info: [`BUYERACCOUNTNO`], Type: 1 },
                //{ Cell: `Y19`, Info: [`BUYERPHONE`], Type: 1 },
                //{ Cell: `O17`, Info: [`CURRENCYCODEUSD`], Type: 1 },
                // 
                { Cell: `E27`, Info: [`lb_amount_trans`], Type: 2 },
                { Cell: `E29`, Info: [`amount_trans`], Type: 2 },
                { Cell: `V27`, Info: [`amount_net`], Type: 2 },
                { Cell: `E28`, Info: [`TAXRATE`], Type: 1 },
                { Cell: `V28`, Info: [`amount_vat`], Type: 2 },//VAT Amount: 
                { Cell: `V29`, Info: [`amount_total`], Type: 2 },
                { Cell: `D31`, Info: [`read_price`], Type: 2 },

                { Cell: `D39`, Info: [`CQT_MCCQT_ID`], Type: 1 },
                { Cell: `Q39`, Info: [`MATRACUU`], Type: 1 },

                { Cell: `P37`, Info: [`SIGNEDBY`], Type: 3 },
                { Cell: `P38`, Info: [`SIGNEDDATE`], Type: 3 },

              )
              // //"A", "B", "C", "D", "E", "F", "G", "H", "I", "J",  "K",  "L",  "M",  "N",  "O",  "P",  "Q",  "R",  "S",  "T",  "U",  "V",  "W",  "X",  "Y",  "Z",
              // //"1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26",

              //cấu trúc dòng detail
              // thin//dotted//dashDot//hair//dashDotDot//slantDashDot//mediumDashed//mediumDashDotDot//mediumDashDot//medium//double//thick
              detailCellFormat = [
                { startCell: 1, endCell: 1, cellType: 2, cellBorder: "thin", field: "STT" },//từ cell bắt đầu tới cell kết thúc, type 2: cell đầu tiên
                { startCell: 2, endCell: 3, cellType: 1, cellBorder: "thin", field: "ITEM_CODE" },//từ cell bắt đầu tới cell kết thúc, type 3: cell kế tiếp cell đầu tiên,
                { startCell: 4, endCell: 8, cellType: 3, cellBorder: "thin", field: "ITEM_NAME" },//từ cell bắt đầu tới cell kết thúc, type 3: cell kế tiếp cell đầu tiên,
                { startCell: 9, endCell: 10, cellType: 1, cellBorder: "thin", field: "ATTRIBUTE_3" },//type 1: còn lại
                { startCell: 11, endCell: 12, cellType: 1, cellBorder: "thin", field: "ITEM_UOM" },//type 1: còn lại
                { startCell: 13, endCell: 16, cellType: 1, cellBorder: "thin", field: "QTY" },//type 1: còn lại
                { startCell: 17, endCell: 21, cellType: 1, cellBorder: "thin", field: "U_PRICE" },//type 1: còn lại
                { startCell: 22, endCell: 25, cellType: 1, cellBorder: "thin", field: "NET_TR_AMT" },//type 1: còn lại
              ]
              // backgroundCell = 5
              // backgroundWidth = 300
              // backgroundHeight = 200

              signCell = { start: 18, end: 21 }
              signBoxCell = "P"
              signByCell = { start: 16, end: 25 }
              countFromEndDetailToSignBox = 9

              _sourceRow = 26
              _sourceRow_2 = 26
              _sourceRow_3 = 26
              headerRowCount = 25


              lastPageRowsHeight = 14

              break;
            case '01GTKT0/001':
              if (convertYn == "Y") {
                reportPath = 'report/60/95/einvoices_template/Jungwoo/Jungwoo_convert.xlsx'
                reportSheet = "ORG (2)"
                this.masterDataArray.push(
                  { Cell: `D6`, Info: [`convert`], Type: 2 },
                  { Cell: `B37`, Info: [`CONVERT_NAME`], Type: 1 },
                  { Cell: `B38`, Info: [`CONVERT_DATE`], Type: 1 },
                )
              } else {
                reportPath = 'report/60/95/einvoices_template/Jungwoo/Jungwoo.xlsx'
                reportSheet = "ORG (2)"
              }

              //bgPath = "assets/images/einvoices_logo/Jungwoo/bg.png")

              logos = [
                { start: 0.5, width: 1.45 * dpi, height: 0.74 * dpi, logoStartCount: 2, logoPath: "assets/images/einvoices_logo/Jungwoo/companylogo.png" },
              ]

              this.msThueCutter(["G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R"], einvoiceMasterData[0].SELLER_TAXCODE.replace(/\s+/g, ''), 14)
              this.msThueCutter(["G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R"], einvoiceMasterData[0].BUYERTAXCODE.replace(/\s+/g, ''), 23)
              // console.log(qrCodeImage(qrCodeData))
              //mảng data của master
              this.masterDataArray.push(
                { Cell: `W3`, Info: [`TEMPLATECODE`], Type: 1 },
                { Cell: `W4`, Info: [`INVOICESERIALNO`], Type: 1 },
                { Cell: `W6`, Info: [`INVOICENUMBER`], Type: 1 },
                { Cell: `D7`, Info: [`dateString`], Type: 2 },
                { Cell: `D9`, Info: [`page`], Type: 2 },
                { Cell: `B42`, Info: [`footer`], Type: 2 },

                { Cell: `D11`, Info: [`SELLER_NAME`], Type: 1 },
                // { Cell: ``, Info: [`SELLER_TAXCODE`], Type: 1 },
                { Cell: `D12`, Info: [`SELLER_ADDRESS`], Type: 1 },
                { Cell: `D14`, Info: [`SELLER_TEL`], Type: 1 },
                { Cell: `D15`, Info: [`SELLER_FAX`], Type: 1 },
                { Cell: `D13`, Info: [`SELLER_ACCOUNTNO`], Type: 1 },
                //{ Cell: `E12`, Info: [`SELLER_ACCOUNTNO`], Type: 1 },
                // { Cell: `E12`, Info: [`SELLER_BANKNAME`], Type: 1 },

                { Cell: `D19`, Info: [`BUYER`], Type: 1 },
                { Cell: `D20`, Info: [`BUYERLEGALNAME`], Type: 1 },
                //{ Cell: `E16`, Info: [`BUYERTAXCODE`], Type: 1 },
                { Cell: `D21`, Info: [`BUYERADDRESS`], Type: 1 },
                { Cell: `D23`, Info: [`PAYMENTMETHODCK`], Type: 1 },
                { Cell: `D22`, Info: [`BUYERACCOUNTNO`], Type: 1 },
                //{ Cell: `Y19`, Info: [`BUYERPHONE`], Type: 1 },
                //{ Cell: `O17`, Info: [`CURRENCYCODEUSD`], Type: 1 },
                // 
                { Cell: `E27`, Info: [`lb_amount_trans`], Type: 2 },
                { Cell: `E29`, Info: [`amount_trans`], Type: 2 },
                { Cell: `V27`, Info: [`amount_net`], Type: 2 },
                { Cell: `E28`, Info: [`TAXRATE`], Type: 1 },
                { Cell: `V28`, Info: [`amount_vat`], Type: 2 },//VAT Amount: 
                { Cell: `V29`, Info: [`amount_total`], Type: 2 },
                { Cell: `D31`, Info: [`read_price`], Type: 2 },

                // { Cell: `D33`, Info: [`CQT_MCCQT_ID`], Type: 1 },
                { Cell: `D39`, Info: [`MATRACUU`], Type: 1 },

                { Cell: `P37`, Info: [`SIGNEDBY`], Type: 3 },
                { Cell: `P38`, Info: [`SIGNEDDATE`], Type: 3 },

              )
              // //"A", "B", "C", "D", "E", "F", "G", "H", "I", "J",  "K",  "L",  "M",  "N",  "O",  "P",  "Q",  "R",  "S",  "T",  "U",  "V",  "W",  "X",  "Y",  "Z",
              // //"1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26",

              //cấu trúc dòng detail
              // thin//dotted//dashDot//hair//dashDotDot//slantDashDot//mediumDashed//mediumDashDotDot//mediumDashDot//medium//double//thick
              detailCellFormat = [
                { startCell: 1, endCell: 1, cellType: 2, cellBorder: "thin", field: "STT" },//từ cell bắt đầu tới cell kết thúc, type 2: cell đầu tiên
                { startCell: 2, endCell: 3, cellType: 1, cellBorder: "thin", field: "ITEM_CODE" },//từ cell bắt đầu tới cell kết thúc, type 3: cell kế tiếp cell đầu tiên,
                { startCell: 4, endCell: 8, cellType: 3, cellBorder: "thin", field: "ITEM_NAME" },//từ cell bắt đầu tới cell kết thúc, type 3: cell kế tiếp cell đầu tiên,
                { startCell: 9, endCell: 10, cellType: 1, cellBorder: "thin", field: "ATTRIBUTE_3" },//type 1: còn lại
                { startCell: 11, endCell: 12, cellType: 1, cellBorder: "thin", field: "ITEM_UOM" },//type 1: còn lại
                { startCell: 13, endCell: 16, cellType: 1, cellBorder: "thin", field: "QTY" },//type 1: còn lại
                { startCell: 17, endCell: 21, cellType: 1, cellBorder: "thin", field: "U_PRICE" },//type 1: còn lại
                { startCell: 22, endCell: 25, cellType: 1, cellBorder: "thin", field: "NET_TR_AMT" },//type 1: còn lại
              ]
              // backgroundCell = 5
              // backgroundWidth = 300
              // backgroundHeight = 200

              signCell = { start: 18, end: 21 }
              signBoxCell = "P"
              signByCell = { start: 16, end: 25 }
              countFromEndDetailToSignBox = 9

              _sourceRow = 26
              _sourceRow_2 = 26
              _sourceRow_3 = 26
              headerRowCount = 25


              lastPageRowsHeight = 14
              break;

            default:

              break;
          }
          break;
        //////// *****************Jungwoo*********************\\\\\\\\\


        //////// *****************Kyungbang*********************\\\\\\\\\
        case "Kyungbang":
          this.masterDataArray = []
          switch (einvoiceMasterData[0].TEMPLATECODE) {
            case "1":
              if (convertYn == "Y") {
                reportPath = 'report/60/95/einvoices_template/Kyungbang/Kyungbang_convert_1.xlsx'
                reportSheet = "Invoice"
                this.masterDataArray.push(
                  { Cell: `E3`, Info: [`convert`], Type: 2 },
                  { Cell: `B34`, Info: [`CONVERT_NAME`], Type: 1 },
                  { Cell: `B35`, Info: [`CONVERT_DATE`], Type: 1 },
                )
              } else {
                reportPath = 'report/60/95/einvoices_template/Kyungbang/Kyungbang_1.xlsx'
                reportSheet = "Invoice"
              }

              bgPath = "assets/images/einvoices_logo/Kyungbang/bg.png"

              logos = [
                { start: 2, width: 1.17 * dpi, height: 1.03 * dpi, logoStartCount: 0.5, logoPath: "assets/images/einvoices_logo/Kyungbang/companylogo.png" },
              ]


              // console.log(qrCodeImage(qrCodeData))
              //mảng data của master
              this.masterDataArray.push(
                { Cell: `P3`, Info: [`TEMPLATECODE`, `INVOICESERIALNO`], Type: 1 },
                { Cell: `P4`, Info: [`INVOICENUMBER`], Type: 1 },
                { Cell: `E4`, Info: [`dateString`], Type: 2 },
                { Cell: `E5`, Info: [`page`], Type: 2 },
                { Cell: `B39`, Info: [`footer`], Type: 2 },

                { Cell: `F7`, Info: [`SELLER_NAME`], Type: 1 },
                { Cell: `E8`, Info: [`SELLER_TAXCODE`], Type: 1 },
                { Cell: `E9`, Info: [`SELLER_ADDRESS`], Type: 1 },
                { Cell: `D10`, Info: [`SELLER_TEL`], Type: 1 },
                { Cell: `I10`, Info: [`SELLER_FAX`], Type: 1 },
                { Cell: `E11`, Info: [`SELLER_ACCOUNTNO`], Type: 1 },
                { Cell: `E12`, Info: [`SELLER_ACCOUNTNO2`], Type: 1 },
                // { Cell: `E12`, Info: [`SELLER_BANKNAME`], Type: 1 },

                { Cell: `G14`, Info: [`BUYER`], Type: 1 },
                { Cell: `F15`, Info: [`BUYERLEGALNAME`], Type: 1 },
                { Cell: `E16`, Info: [`BUYERTAXCODE`], Type: 1 },
                { Cell: `E17`, Info: [`BUYERADDRESS`], Type: 1 },
                { Cell: `F18`, Info: [`PAYMENTMETHODCK`], Type: 1 },
                { Cell: `L18`, Info: [`BUYERACCOUNTNO`], Type: 1 },
                //{ Cell: `Y19`, Info: [`BUYERPHONE`], Type: 1 },
                //{ Cell: `O17`, Info: [`CURRENCYCODEUSD`], Type: 1 },
                // 
                { Cell: `O24`, Info: [`amount_net`], Type: 2 },
                { Cell: `F25`, Info: [`TAXRATE`], Type: 1 },
                { Cell: `O25`, Info: [`amount_vat`], Type: 2 },//VAT Amount: 
                { Cell: `O26`, Info: [`amount_total`], Type: 2 },
                { Cell: `F27`, Info: [`read_price`], Type: 2 },

                { Cell: `D36`, Info: [`CQT_MCCQT_ID`], Type: 1 },
                { Cell: `M37`, Info: [`MATRACUU`], Type: 1 },

                { Cell: `L34`, Info: [`SIGNEDBY`], Type: 3 },
                { Cell: `L35`, Info: [`SIGNEDDATE`], Type: 3 },

              )
              // //"A", "B", "C", "D", "E", "F", "G", "H", "I", "J",  "K",  "L",  "M",  "N",  "O",  "P",  "Q",  "R",  "S",  "T",  "U",  "V",  "W",  "X",  "Y",  "Z",
              // //"1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26",

              //cấu trúc dòng detail
              // thin//dotted//dashDot//hair//dashDotDot//slantDashDot//mediumDashed//mediumDashDotDot//mediumDashDot//medium//double//thick
              detailCellFormat = [
                { startCell: 1, endCell: 2, cellType: 2, cellBorder: "dotted", field: "STT" },//từ cell bắt đầu tới cell kết thúc, type 2: cell đầu tiên
                { startCell: 3, endCell: 7, cellType: 3, cellBorder: "dotted", field: "ITEM_NAME" },//từ cell bắt đầu tới cell kết thúc, type 3: cell kế tiếp cell đầu tiên,
                { startCell: 8, endCell: 8, cellType: 1, cellBorder: "dotted", field: "ITEM_UOM" },//type 1: còn lại
                { startCell: 9, endCell: 11, cellType: 1, cellBorder: "dotted", field: "QTY" },//type 1: còn lại
                { startCell: 12, endCell: 14, cellType: 1, cellBorder: "dotted", field: "U_PRICE" },//type 1: còn lại
                { startCell: 15, endCell: 16, cellType: 1, cellBorder: "dotted", field: "NET_TR_AMT" },//type 1: còn lại
              ]
              backgroundCell = 5
              backgroundWidth = 300
              backgroundHeight = 200




              signCell = { start: 12, end: 14 }
              signBoxCell = "L"
              signByCell = { start: 12, end: 16 }
              countFromEndDetailToSignBox = 9

              _sourceRow = 23
              _sourceRow_2 = 23
              _sourceRow_3 = 23
              headerRowCount = 22


              lastPageRowsHeight = 14

              break;
            case '01GTKT0/001':
              if (convertYn == "Y") {
                reportPath = 'report/60/95/einvoices_template/Kyungbang/Kyungbang_convert.xlsx'
                reportSheet = "Invoice"
                this.masterDataArray.push(
                  { Cell: `E3`, Info: [`convert`], Type: 2 },
                  { Cell: `B34`, Info: [`CONVERT_NAME`], Type: 1 },
                  { Cell: `B35`, Info: [`CONVERT_DATE`], Type: 1 },
                )
              } else {
                reportPath = 'report/60/95/einvoices_template/Kyungbang/Kyungbang.xlsx'
                reportSheet = "Invoice"
              }

              bgPath = "assets/images/einvoices_logo/Kyungbang/bg.png"

              logos = [
                { start: 2, width: 1.17 * dpi, height: 1.03 * dpi, logoStartCount: 0.5, logoPath: "assets/images/einvoices_logo/Kyungbang/companylogo.png" },
              ]


              // console.log(qrCodeImage(qrCodeData))
              //mảng data của master
              this.masterDataArray.push(
                { Cell: `P2`, Info: [`TEMPLATECODE`], Type: 1 },
                { Cell: `P3`, Info: [`INVOICESERIALNO`], Type: 1 },
                { Cell: `P4`, Info: [`INVOICENUMBER`], Type: 1 },
                { Cell: `E4`, Info: [`dateString`], Type: 2 },
                { Cell: `E5`, Info: [`page`], Type: 2 },
                { Cell: `B39`, Info: [`footer`], Type: 2 },

                { Cell: `F7`, Info: [`SELLER_NAME`], Type: 1 },
                { Cell: `E8`, Info: [`SELLER_TAXCODE`], Type: 1 },
                { Cell: `E9`, Info: [`SELLER_ADDRESS`], Type: 1 },
                { Cell: `D10`, Info: [`SELLER_TEL`], Type: 1 },
                { Cell: `I10`, Info: [`SELLER_FAX`], Type: 1 },
                { Cell: `E11`, Info: [`SELLER_ACCOUNTNO`], Type: 1 },
                { Cell: `E12`, Info: [`SELLER_ACCOUNTNO2`], Type: 1 },
                // { Cell: `E12`, Info: [`SELLER_BANKNAME`], Type: 1 },

                { Cell: `G14`, Info: [`BUYER`], Type: 1 },
                { Cell: `F15`, Info: [`BUYERLEGALNAME`], Type: 1 },
                { Cell: `E16`, Info: [`BUYERTAXCODE`], Type: 1 },
                { Cell: `E17`, Info: [`BUYERADDRESS`], Type: 1 },
                { Cell: `F18`, Info: [`PAYMENTMETHODCK`], Type: 1 },
                { Cell: `L18`, Info: [`BUYERACCOUNTNO`], Type: 1 },
                //{ Cell: `Y19`, Info: [`BUYERPHONE`], Type: 1 },
                //{ Cell: `O17`, Info: [`CURRENCYCODEUSD`], Type: 1 },
                // 
                { Cell: `O24`, Info: [`amount_net`], Type: 2 },
                { Cell: `F25`, Info: [`TAXRATE`], Type: 1 },
                { Cell: `O25`, Info: [`amount_vat`], Type: 2 },//VAT Amount: 
                { Cell: `O26`, Info: [`amount_total`], Type: 2 },
                { Cell: `F27`, Info: [`read_price`], Type: 2 },

                // { Cell: `D33`, Info: [`CQT_MCCQT_ID`], Type: 1 },
                { Cell: `D36`, Info: [`MATRACUU`], Type: 1 },

                { Cell: `L34`, Info: [`SIGNEDBY`], Type: 3 },
                { Cell: `L35`, Info: [`SIGNEDDATE`], Type: 3 },

              )
              // //"A", "B", "C", "D", "E", "F", "G", "H", "I", "J",  "K",  "L",  "M",  "N",  "O",  "P",  "Q",  "R",  "S",  "T",  "U",  "V",  "W",  "X",  "Y",  "Z",
              // //"1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26",

              //cấu trúc dòng detail
              // thin//dotted//dashDot//hair//dashDotDot//slantDashDot//mediumDashed//mediumDashDotDot//mediumDashDot//medium//double//thick
              detailCellFormat = [
                { startCell: 1, endCell: 2, cellType: 2, cellBorder: "dotted", field: "STT" },//từ cell bắt đầu tới cell kết thúc, type 2: cell đầu tiên
                { startCell: 3, endCell: 7, cellType: 3, cellBorder: "dotted", field: "ITEM_NAME" },//từ cell bắt đầu tới cell kết thúc, type 3: cell kế tiếp cell đầu tiên,
                { startCell: 8, endCell: 8, cellType: 1, cellBorder: "dotted", field: "ITEM_UOM" },//type 1: còn lại
                { startCell: 9, endCell: 11, cellType: 1, cellBorder: "dotted", field: "QTY" },//type 1: còn lại
                { startCell: 12, endCell: 14, cellType: 1, cellBorder: "dotted", field: "U_PRICE" },//type 1: còn lại
                { startCell: 15, endCell: 16, cellType: 1, cellBorder: "dotted", field: "NET_TR_AMT" },//type 1: còn lại
              ]
              backgroundCell = 5
              backgroundWidth = 300
              backgroundHeight = 200




              signCell = { start: 12, end: 14 }
              signBoxCell = "L"
              signByCell = { start: 12, end: 16 }
              countFromEndDetailToSignBox = 9

              _sourceRow = 23
              _sourceRow_2 = 23
              _sourceRow_3 = 23
              headerRowCount = 22


              lastPageRowsHeight = 14
              break;

            default:

              break;
          }
          break;
        //////// *****************Kyungbang*********************\\\\\\\\\

        //////// *****************ParisVN_CNHN*********************\\\\\\\\\
        case "ParisVN_CNHN":
          this.masterDataArray = []
          switch (einvoiceMasterData[0].TEMPLATECODE) {
            case "1":
              if (convertYn == "Y") {
                reportPath = 'report/60/95/einvoices_template/ParisVN_CNHN/ParisVN_CNHN_convert_1.xlsx'
                reportSheet = "Invoice_PA.18"
                this.masterDataArray.push(
                  { Cell: `D9`, Info: [`convert`], Type: 2 },
                  { Cell: `B32`, Info: [`CONVERT_NAME`], Type: 1 },
                  { Cell: `B33`, Info: [`CONVERT_DATE`], Type: 1 },
                )
              } else {
                reportPath = 'report/60/95/einvoices_template/ParisVN_CNHN/ParisVN_CNHN_1.xlsx'
                reportSheet = "Invoice_PA.18"
              }

              bgPath = "assets/images/einvoices_logo/ParisVN_CNHN/bg.png"

              logos = [
                { start: 22, width: 1.06 * dpi, height: 0.85 * dpi, logoStartCount: 1, logoPath: "assets/images/einvoices_logo/ParisVN_CNHN/companylogo.png" },
                { start: 1, width: 3.46 * dpi, height: 0.54 * dpi, logoStartCount: 1, logoPath: "assets/images/einvoices_logo/ParisVN_CNHN/companylogo2.png" },
                { start: 1, width: 1.09 * dpi, height: 0.97 * dpi, logoStartCount: 6.5, logoPath: qrPath }
              ]

              // console.log(qrCodeImage(qrCodeData))
              //mảng data của master
              this.masterDataArray.push(
                { Cell: `W8`, Info: [`TEMPLATECODE`, `INVOICESERIALNO`], Type: 1 },
                { Cell: `V9`, Info: [`INVOICENUMBER`], Type: 1 },
                { Cell: `D10`, Info: [`dateString`], Type: 2 },
                { Cell: `S10`, Info: [`page`], Type: 2 },
                { Cell: `B37`, Info: [`footer`], Type: 2 },

                { Cell: `B1`, Info: [`SELLER_NAME`], Type: 1 },
                { Cell: `E3`, Info: [`SELLER_TAXCODE`], Type: 1 },
                { Cell: `D4`, Info: [`SELLER_ADDRESS`], Type: 1 },
                { Cell: `D5`, Info: [`SELLER_TEL`], Type: 1 },
                { Cell: `Q5`, Info: [`SELLER_FAX`], Type: 1 },
                { Cell: `E6`, Info: [`SELLER_ACCOUNTNO`], Type: 1 },
                { Cell: `D6`, Info: [`SELLER_BANKNAME`], Type: 1 },

                { Cell: `G12`, Info: [`BUYER`], Type: 1 },
                { Cell: `F13`, Info: [`BUYERLEGALNAME`], Type: 1 },
                { Cell: `E14`, Info: [`BUYERTAXCODE`], Type: 1 },
                { Cell: `E15`, Info: [`BUYERADDRESS`], Type: 1 },
                { Cell: `J17`, Info: [`PAYMENTMETHODCK`], Type: 1 },
                { Cell: `U17`, Info: [`BUYERACCOUNTNO`], Type: 1 },
                //{ Cell: `Y19`, Info: [`BUYERPHONE`], Type: 1 },
                //{ Cell: `O17`, Info: [`CURRENCYCODEUSD`], Type: 1 },
                // 
                { Cell: `W22`, Info: [`amount_net`], Type: 2 },
                { Cell: `F23`, Info: [`TAXRATE`], Type: 1 },
                { Cell: `W23`, Info: [`amount_vat`], Type: 2 },//VAT Amount: 
                { Cell: `W24`, Info: [`amount_total`], Type: 2 },
                { Cell: `M25`, Info: [`read_price`], Type: 2 },

                { Cell: `D34`, Info: [`CQT_MCCQT_ID`], Type: 1 },
                { Cell: `U35`, Info: [`MATRACUU`], Type: 1 },

                { Cell: `T32`, Info: [`SIGNEDBY`], Type: 3 },
                { Cell: `T33`, Info: [`SIGNEDDATE`], Type: 3 },

              )
              // //"A", "B", "C", "D", "E", "F", "G", "H", "I", "J",  "K",  "L",  "M",  "N",  "O",  "P",  "Q",  "R",  "S",  "T",  "U",  "V",  "W",  "X",  "Y",  "Z",
              // //"1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26",

              //cấu trúc dòng detail
              // thin//dotted//dashDot//hair//dashDotDot//slantDashDot//mediumDashed//mediumDashDotDot//mediumDashDot//medium//double//thick
              detailCellFormat = [
                { startCell: 2, endCell: 2, cellType: 2, cellBorder: "dotted", field: "STT" },//từ cell bắt đầu tới cell kết thúc, type 2: cell đầu tiên
                { startCell: 3, endCell: 13, cellType: 3, cellBorder: "dotted", field: "ITEM_NAME" },//từ cell bắt đầu tới cell kết thúc, type 3: cell kế tiếp cell đầu tiên,
                { startCell: 14, endCell: 16, cellType: 1, cellBorder: "dotted", field: "ITEM_UOM" },//type 1: còn lại
                { startCell: 17, endCell: 19, cellType: 1, cellBorder: "dotted", field: "QTY" },//type 1: còn lại
                { startCell: 20, endCell: 22, cellType: 1, cellBorder: "dotted", field: "U_PRICE" },//type 1: còn lại
                { startCell: 23, endCell: 26, cellType: 1, cellBorder: "dotted", field: "NET_TR_AMT" },//type 1: còn lại
              ]
              backgroundCell = 4
              backgroundWidth = 300
              backgroundHeight = 200




              signCell = { start: 20, end: 24 }
              signBoxCell = "T"
              signByCell = { start: 20, end: 25 }
              countFromEndDetailToSignBox = 9

              _sourceRow = 21
              _sourceRow_2 = 21
              _sourceRow_3 = 21
              headerRowCount = 20


              lastPageRowsHeight = 15

              break;
            case '01GTKT0/001':
            case '01GTKT0/002':
            case '01GTKT0/003':
              if (convertYn == "Y") {
                reportPath = 'report/60/95/einvoices_template/ParisVN_CNHN/ParisVN_CNHN_convert.xlsx'
                reportSheet = "Invoice_PA.18"
                this.masterDataArray.push(
                  { Cell: `D9`, Info: [`convert`], Type: 2 },
                  { Cell: `B43`, Info: [`CONVERT_NAME`], Type: 1 },
                  { Cell: `B44`, Info: [`CONVERT_DATE`], Type: 1 },
                )
              } else {
                reportPath = 'report/60/95/einvoices_template/ParisVN_CNHN/ParisVN_CNHN.xlsx'
                reportSheet = "Invoice_PA.18"
              }

              bgPath = require("assets/images/einvoices_logo/ParisVN_CNHN/bg.png")

              logos = [
                { start: 22, width: 1.06 * dpi, height: 0.85 * dpi, logoStartCount: 1, logoPath: require("assets/images/einvoices_logo/ParisVN_CNHN/companylogo.png") },
                { start: 1, width: 3.46 * dpi, height: 0.54 * dpi, logoStartCount: 1, logoPath: require("assets/images/einvoices_logo/ParisVN_CNHN/companylogo2.png") },
                { start: 1, width: 1.09 * dpi, height: 0.97 * dpi, logoStartCount: 6.5, logoPath: qrPath }
              ]


              // console.log(qrCodeImage(qrCodeData))
              //mảng data của master
              this.masterDataArray.push(
                { Cell: `W7`, Info: [`TEMPLATECODE`], Type: 1 },
                { Cell: `W8`, Info: [`INVOICESERIALNO`], Type: 1 },
                { Cell: `V9`, Info: [`INVOICENUMBER`], Type: 1 },
                { Cell: `D10`, Info: [`dateString`], Type: 2 },
                { Cell: `S10`, Info: [`page`], Type: 2 },
                { Cell: `B37`, Info: [`footer`], Type: 2 },

                { Cell: `B1`, Info: [`SELLER_NAME`], Type: 1 },
                { Cell: `E3`, Info: [`SELLER_TAXCODE`], Type: 1 },
                { Cell: `D4`, Info: [`SELLER_ADDRESS`], Type: 1 },
                { Cell: `D5`, Info: [`SELLER_TEL`], Type: 1 },
                { Cell: `Q5`, Info: [`SELLER_FAX`], Type: 1 },
                { Cell: `E6`, Info: [`SELLER_ACCOUNTNO`], Type: 1 },
                { Cell: `D6`, Info: [`SELLER_BANKNAME`], Type: 1 },

                { Cell: `G12`, Info: [`BUYER`], Type: 1 },
                { Cell: `F13`, Info: [`BUYERLEGALNAME`], Type: 1 },
                { Cell: `E14`, Info: [`BUYERTAXCODE`], Type: 1 },
                { Cell: `E15`, Info: [`BUYERADDRESS`], Type: 1 },
                { Cell: `J17`, Info: [`PAYMENTMETHODCK`], Type: 1 },
                { Cell: `U17`, Info: [`BUYERACCOUNTNO`], Type: 1 },
                //{ Cell: `Y19`, Info: [`BUYERPHONE`], Type: 1 },
                //{ Cell: `O17`, Info: [`CURRENCYCODEUSD`], Type: 1 },
                // 
                { Cell: `W22`, Info: [`amount_net`], Type: 2 },
                { Cell: `F23`, Info: [`TAXRATE`], Type: 1 },
                { Cell: `W23`, Info: [`amount_vat`], Type: 2 },//VAT Amount: 
                { Cell: `W24`, Info: [`amount_total`], Type: 2 },
                { Cell: `M25`, Info: [`read_price`], Type: 2 },

                // { Cell: `D33`, Info: [`CQT_MCCQT_ID`], Type: 1 },
                { Cell: `U35`, Info: [`MATRACUU`], Type: 1 },

                { Cell: `T32`, Info: [`SIGNEDBY`], Type: 3 },
                { Cell: `T33`, Info: [`SIGNEDDATE`], Type: 3 },

              )
              // //"A", "B", "C", "D", "E", "F", "G", "H", "I", "J",  "K",  "L",  "M",  "N",  "O",  "P",  "Q",  "R",  "S",  "T",  "U",  "V",  "W",  "X",  "Y",  "Z",
              // //"1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26",

              //cấu trúc dòng detail
              // thin//dotted//dashDot//hair//dashDotDot//slantDashDot//mediumDashed//mediumDashDotDot//mediumDashDot//medium//double//thick
              detailCellFormat = [
                { startCell: 2, endCell: 2, cellType: 2, cellBorder: "dotted", field: "STT" },//từ cell bắt đầu tới cell kết thúc, type 2: cell đầu tiên
                { startCell: 3, endCell: 13, cellType: 3, cellBorder: "dotted", field: "ITEM_NAME" },//từ cell bắt đầu tới cell kết thúc, type 3: cell kế tiếp cell đầu tiên,
                { startCell: 14, endCell: 16, cellType: 1, cellBorder: "dotted", field: "ITEM_UOM" },//type 1: còn lại
                { startCell: 17, endCell: 19, cellType: 1, cellBorder: "dotted", field: "QTY" },//type 1: còn lại
                { startCell: 20, endCell: 22, cellType: 1, cellBorder: "dotted", field: "U_PRICE" },//type 1: còn lại
                { startCell: 23, endCell: 26, cellType: 1, cellBorder: "dotted", field: "NET_TR_AMT" },//type 1: còn lại
              ]
              backgroundCell = 4
              backgroundWidth = 300
              backgroundHeight = 200




              signCell = { start: 20, end: 24 }
              signBoxCell = "T"
              signByCell = { start: 20, end: 25 }
              countFromEndDetailToSignBox = 9

              _sourceRow = 21
              _sourceRow_2 = 21
              _sourceRow_3 = 21
              headerRowCount = 20


              lastPageRowsHeight = 15
              break;

            default:
              break;
          }
          break;
        //////// *****************ParisVN_CNHN*********************\\\\\\\\\

        //////// *****************ParisVN*********************\\\\\\\\\
        case "ParisVN":
          this.masterDataArray = []
          switch (einvoiceMasterData[0].TEMPLATECODE) {
            case "1":
              if (convertYn == "Y") {
                reportPath = 'report/60/95/einvoices_template/ParisVN/ParisVN_convert_1.xlsx'
                reportSheet = "Invoice_PA.18"
                this.masterDataArray.push(
                  { Cell: `D9`, Info: [`convert`], Type: 2 },
                  { Cell: `B32`, Info: [`CONVERT_NAME`], Type: 1 },
                  { Cell: `B33`, Info: [`CONVERT_DATE`], Type: 1 },
                )
              } else {
                reportPath = 'report/60/95/einvoices_template/ParisVN/ParisVN_1.xlsx'
                reportSheet = "Invoice_PA.18"
              }

              bgPath = "assets/images/einvoices_logo/ParisVN/bg.png"

              logos = [
                { start: 22, width: 1.06 * dpi, height: 0.85 * dpi, logoStartCount: 1, logoPath: "assets/images/einvoices_logo/ParisVN/companylogo.png" },
                { start: 1, width: 3.46 * dpi, height: 0.54 * dpi, logoStartCount: 1, logoPath: "assets/images/einvoices_logo/ParisVN/companylogo2.png" },
                { start: 1, width: 1.09 * dpi, height: 0.97 * dpi, logoStartCount: 6.5, logoPath: qrPath }
              ]

              // console.log(qrCodeImage(qrCodeData))
              //mảng data của master
              this.masterDataArray.push(
                { Cell: `W8`, Info: [`TEMPLATECODE`, `INVOICESERIALNO`], Type: 1 },
                { Cell: `V9`, Info: [`INVOICENUMBER`], Type: 1 },
                { Cell: `D10`, Info: [`dateString`], Type: 2 },
                { Cell: `S10`, Info: [`page`], Type: 2 },
                { Cell: `B37`, Info: [`footer`], Type: 2 },

                { Cell: `B1`, Info: [`SELLER_NAME`], Type: 1 },
                { Cell: `E3`, Info: [`SELLER_TAXCODE`], Type: 1 },
                { Cell: `D4`, Info: [`SELLER_ADDRESS`], Type: 1 },
                { Cell: `D5`, Info: [`SELLER_TEL`], Type: 1 },
                { Cell: `Q5`, Info: [`SELLER_FAX`], Type: 1 },
                { Cell: `E6`, Info: [`SELLER_ACCOUNTNO`], Type: 1 },
                // { Cell: `E12`, Info: [`SELLER_BANKNAME`], Type: 1 },

                { Cell: `G12`, Info: [`BUYER`], Type: 1 },
                { Cell: `F13`, Info: [`BUYERLEGALNAME`], Type: 1 },
                { Cell: `E14`, Info: [`BUYERTAXCODE`], Type: 1 },
                { Cell: `E15`, Info: [`BUYERADDRESS`], Type: 1 },
                { Cell: `J17`, Info: [`PAYMENTMETHODCK`], Type: 1 },
                { Cell: `U17`, Info: [`BUYERACCOUNTNO`], Type: 1 },
                //{ Cell: `Y19`, Info: [`BUYERPHONE`], Type: 1 },
                //{ Cell: `O17`, Info: [`CURRENCYCODEUSD`], Type: 1 },
                // 
                { Cell: `W22`, Info: [`amount_net`], Type: 2 },
                { Cell: `F23`, Info: [`TAXRATE`], Type: 1 },
                { Cell: `W23`, Info: [`amount_vat`], Type: 2 },//VAT Amount: 
                { Cell: `W24`, Info: [`amount_total`], Type: 2 },
                { Cell: `M25`, Info: [`read_price`], Type: 2 },

                { Cell: `D34`, Info: [`CQT_MCCQT_ID`], Type: 1 },
                { Cell: `U35`, Info: [`MATRACUU`], Type: 1 },

                { Cell: `T32`, Info: [`SIGNEDBY`], Type: 3 },
                { Cell: `T33`, Info: [`SIGNEDDATE`], Type: 3 },

              )
              // //"A", "B", "C", "D", "E", "F", "G", "H", "I", "J",  "K",  "L",  "M",  "N",  "O",  "P",  "Q",  "R",  "S",  "T",  "U",  "V",  "W",  "X",  "Y",  "Z",
              // //"1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26",

              //cấu trúc dòng detail
              // thin//dotted//dashDot//hair//dashDotDot//slantDashDot//mediumDashed//mediumDashDotDot//mediumDashDot//medium//double//thick
              detailCellFormat = [
                { startCell: 2, endCell: 2, cellType: 2, cellBorder: "dotted", field: "STT" },//từ cell bắt đầu tới cell kết thúc, type 2: cell đầu tiên
                { startCell: 3, endCell: 13, cellType: 3, cellBorder: "dotted", field: "ITEM_NAME" },//từ cell bắt đầu tới cell kết thúc, type 3: cell kế tiếp cell đầu tiên,
                { startCell: 14, endCell: 16, cellType: 1, cellBorder: "dotted", field: "ITEM_UOM" },//type 1: còn lại
                { startCell: 17, endCell: 19, cellType: 1, cellBorder: "dotted", field: "QTY" },//type 1: còn lại
                { startCell: 20, endCell: 22, cellType: 1, cellBorder: "dotted", field: "U_PRICE" },//type 1: còn lại
                { startCell: 23, endCell: 26, cellType: 1, cellBorder: "dotted", field: "NET_TR_AMT" },//type 1: còn lại
              ]
              backgroundCell = 4
              backgroundWidth = 300
              backgroundHeight = 200




              signCell = { start: 20, end: 24 }
              signBoxCell = "T"
              signByCell = { start: 20, end: 25 }
              countFromEndDetailToSignBox = 9

              _sourceRow = 21
              _sourceRow_2 = 21
              _sourceRow_3 = 21
              headerRowCount = 20


              lastPageRowsHeight = 15

              break;
            case '01GTKT0/001':
              if (convertYn == "Y") {
                reportPath = 'report/60/95/einvoices_template/ParisVN/ParisVN_convert.xlsx'
                reportSheet = "Invoice_PA.18"
                this.masterDataArray.push(
                  { Cell: `D9`, Info: [`convert`], Type: 2 },
                  { Cell: `B43`, Info: [`CONVERT_NAME`], Type: 1 },
                  { Cell: `B44`, Info: [`CONVERT_DATE`], Type: 1 },
                )
              } else {
                reportPath = 'report/60/95/einvoices_template/ParisVN/ParisVN.xlsx'
                reportSheet = "Invoice_PA.18"
              }

              bgPath = "assets/images/einvoices_logo/ParisVN/bg.png"

              logos = [
                { start: 22, width: 1.06 * dpi, height: 0.85 * dpi, logoStartCount: 1, logoPath: "assets/images/einvoices_logo/ParisVN/companylogo.png" },
                { start: 1, width: 3.46 * dpi, height: 0.54 * dpi, logoStartCount: 1, logoPath: "assets/images/einvoices_logo/ParisVN/companylogo2.png" },
                { start: 1, width: 1.09 * dpi, height: 0.97 * dpi, logoStartCount: 6.5, logoPath: qrPath }
              ]


              // console.log(qrCodeImage(qrCodeData))
              //mảng data của master
              this.masterDataArray.push(
                { Cell: `W7`, Info: [`TEMPLATECODE`], Type: 1 },
                { Cell: `W8`, Info: [`INVOICESERIALNO`], Type: 1 },
                { Cell: `V9`, Info: [`INVOICENUMBER`], Type: 1 },
                { Cell: `D10`, Info: [`dateString`], Type: 2 },
                { Cell: `S10`, Info: [`page`], Type: 2 },
                { Cell: `B37`, Info: [`footer`], Type: 2 },

                { Cell: `B1`, Info: [`SELLER_NAME`], Type: 1 },
                { Cell: `E3`, Info: [`SELLER_TAXCODE`], Type: 1 },
                { Cell: `D4`, Info: [`SELLER_ADDRESS`], Type: 1 },
                { Cell: `D5`, Info: [`SELLER_TEL`], Type: 1 },
                { Cell: `Q5`, Info: [`SELLER_FAX`], Type: 1 },
                { Cell: `E6`, Info: [`SELLER_ACCOUNTNO`], Type: 1 },
                // { Cell: `E12`, Info: [`SELLER_BANKNAME`], Type: 1 },

                { Cell: `G12`, Info: [`BUYER`], Type: 1 },
                { Cell: `F13`, Info: [`BUYERLEGALNAME`], Type: 1 },
                { Cell: `E14`, Info: [`BUYERTAXCODE`], Type: 1 },
                { Cell: `E15`, Info: [`BUYERADDRESS`], Type: 1 },
                { Cell: `J17`, Info: [`PAYMENTMETHODCK`], Type: 1 },
                { Cell: `U17`, Info: [`BUYERACCOUNTNO`], Type: 1 },
                //{ Cell: `Y19`, Info: [`BUYERPHONE`], Type: 1 },
                //{ Cell: `O17`, Info: [`CURRENCYCODEUSD`], Type: 1 },
                // 
                { Cell: `W22`, Info: [`amount_net`], Type: 2 },
                { Cell: `F23`, Info: [`TAXRATE`], Type: 1 },
                { Cell: `W23`, Info: [`amount_vat`], Type: 2 },//VAT Amount: 
                { Cell: `W24`, Info: [`amount_total`], Type: 2 },
                { Cell: `M25`, Info: [`read_price`], Type: 2 },

                // { Cell: `D33`, Info: [`CQT_MCCQT_ID`], Type: 1 },
                { Cell: `U35`, Info: [`MATRACUU`], Type: 1 },

                { Cell: `T32`, Info: [`SIGNEDBY`], Type: 3 },
                { Cell: `T33`, Info: [`SIGNEDDATE`], Type: 3 },

              )
              // //"A", "B", "C", "D", "E", "F", "G", "H", "I", "J",  "K",  "L",  "M",  "N",  "O",  "P",  "Q",  "R",  "S",  "T",  "U",  "V",  "W",  "X",  "Y",  "Z",
              // //"1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26",

              //cấu trúc dòng detail
              // thin//dotted//dashDot//hair//dashDotDot//slantDashDot//mediumDashed//mediumDashDotDot//mediumDashDot//medium//double//thick
              detailCellFormat = [
                { startCell: 2, endCell: 2, cellType: 2, cellBorder: "dotted", field: "STT" },//từ cell bắt đầu tới cell kết thúc, type 2: cell đầu tiên
                { startCell: 3, endCell: 13, cellType: 3, cellBorder: "dotted", field: "ITEM_NAME" },//từ cell bắt đầu tới cell kết thúc, type 3: cell kế tiếp cell đầu tiên,
                { startCell: 14, endCell: 16, cellType: 1, cellBorder: "dotted", field: "ITEM_UOM" },//type 1: còn lại
                { startCell: 17, endCell: 19, cellType: 1, cellBorder: "dotted", field: "QTY" },//type 1: còn lại
                { startCell: 20, endCell: 22, cellType: 1, cellBorder: "dotted", field: "U_PRICE" },//type 1: còn lại
                { startCell: 23, endCell: 26, cellType: 1, cellBorder: "dotted", field: "NET_TR_AMT" },//type 1: còn lại
              ]
              backgroundCell = 4
              backgroundWidth = 300
              backgroundHeight = 200




              signCell = { start: 20, end: 24 }
              signBoxCell = "T"
              signByCell = { start: 20, end: 25 }
              countFromEndDetailToSignBox = 9

              _sourceRow = 21
              _sourceRow_2 = 21
              _sourceRow_3 = 21
              headerRowCount = 20


              lastPageRowsHeight = 15
              break;

            default:
              break;
          }
          break;
        //////// *****************ParisVN*********************\\\\\\\\\

        //////// *****************During*********************\\\\\\\\\
        case "During":
          this.masterDataArray = []
          switch (einvoiceMasterData[0].TEMPLATECODE) {
            case "1":
              if (convertYn == "Y") {
                reportPath = 'report/60/95/einvoices_template/During/During_convert_1.xlsx'
                reportSheet = "GTGT.BD.Org"
                this.masterDataArray.push(
                  { Cell: `G13`, Info: [`convert`], Type: 2 },
                  { Cell: `C41`, Info: [`CONVERT_NAME`], Type: 1 },
                  { Cell: `C42`, Info: [`CONVERT_DATE`], Type: 1 },
                )
              } else {
                reportPath = 'report/60/95/einvoices_template/During/During_1.xlsx'
                reportSheet = "GTGT.BD.Org"
              }
              // let width=1.19
              // let height=1.32
              //logoPath = "assets/images/einvoices_logo/During/companylogo.png")
              bgPath = "assets/images/einvoices_logo/During/bg.png"
              logos = [
                { start: 2, width: 1.19 * dpi, height: 1.32 * dpi, logoStartCount: 1.5, logoPath: "assets/images/einvoices_logo/During/companylogo.png" }
              ]

              //mảng data của master
              this.masterDataArray.push(
                { Cell: `AA12`, Info: [`TEMPLATECODE`, `INVOICESERIALNO`], Type: 1 },
                { Cell: `AA13`, Info: [`INVOICENUMBER`], Type: 1 },
                { Cell: `G14`, Info: [`dateString`], Type: 2 },
                { Cell: `X14`, Info: [`page`], Type: 2 },
                { Cell: `A47`, Info: [`footer`], Type: 2 },

                // { Cell: `F7`, Info: [`SELLER_NAME`], Type: 1 },
                { Cell: `J6`, Info: [`SELLER_TAXCODE`], Type: 1 },
                { Cell: `K4`, Info: [`SELLER_ADDRESS`], Type: 1 },
                { Cell: `K5`, Info: [`SELLER_TEL`], Type: 1 },
                { Cell: `U5`, Info: [`SELLER_FAX`], Type: 1 },
                { Cell: `J7`, Info: [`SELLER_ACCOUNTNO`], Type: 1 },
                // { Cell: `E12`, Info: [`SELLER_BANKNAME`], Type: 1 },

                { Cell: `N17`, Info: [`BUYER`], Type: 1 },
                { Cell: `J18`, Info: [`BUYERLEGALNAME`], Type: 1 },
                { Cell: `H19`, Info: [`BUYERTAXCODE`], Type: 1 },
                { Cell: `H20`, Info: [`BUYERADDRESS`], Type: 1 },
                { Cell: `N21`, Info: [`PAYMENTMETHODCK`], Type: 1 },
                { Cell: `X21`, Info: [`BUYERACCOUNTNO`], Type: 1 },
                { Cell: `X19`, Info: [`BUYERPHONE`], Type: 1 },
                { Cell: `I22`, Info: [`EXCHANGERATE`], Type: 1 },
                // { Cell: `N23`, Info: [`EXCHANGERATE`], Type: 1 },
                // { Cell: `X23`, Info: [`EXCHANGERATE`], Type: 1 },
                // 
                { Cell: `AA29`, Info: [`amount_net`], Type: 2 },
                { Cell: `J30`, Info: [`TAXRATE`], Type: 1 },
                { Cell: `AA30`, Info: [`amount_vat`], Type: 2 },//VAT Amount: 
                { Cell: `AA31`, Info: [`amount_total`], Type: 2 },
                { Cell: `J32`, Info: [`read_price`], Type: 2 },

                // { Cell: `D33`, Info: [`CQT_MCCQT_ID`], Type: 1 },
                { Cell: `G43`, Info: [`MATRACUU`], Type: 1 },

                { Cell: `V42`, Info: [`SIGNEDBY`], Type: 3 },
                { Cell: `V43`, Info: [`SIGNEDDATE`], Type: 3 },

              )
              // //"A", "B", "C", "D", "E", "F", "G", "H", "I", "J",  "K",  "L",  "M",  "N",  "O",  "P",  "Q",  "R",  "S",  "T",  "U",  "V",  "W",  "X",  "Y",  "Z",
              // //"1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26",

              //cấu trúc dòng detail
              // thin//dotted//dashDot//hair//dashDotDot//slantDashDot//mediumDashed//mediumDashDotDot//mediumDashDot//medium//double//thick
              detailCellFormat = [
                { startCell: 2, endCell: 3, cellType: 2, cellBorder: "thin", field: "STT" },//từ cell bắt đầu tới cell kết thúc, type 2: cell đầu tiên
                { startCell: 4, endCell: 17, cellType: 3, cellBorder: "thin", field: "ITEM_NAME" },//từ cell bắt đầu tới cell kết thúc, type 3: cell kế tiếp cell đầu tiên,
                { startCell: 18, endCell: 20, cellType: 1, cellBorder: "thin", field: "ITEM_UOM" },//type 1: còn lại
                { startCell: 21, endCell: 23, cellType: 1, cellBorder: "thin", field: "QTY" },//type 1: còn lại
                { startCell: 24, endCell: 26, cellType: 1, cellBorder: "thin", field: "U_PRICE" },//type 1: còn lại
                { startCell: 27, endCell: 29, cellType: 1, cellBorder: "thin", field: "NET_TR_AMT" },//type 1: còn lại
              ]
              backgroundCell = 10
              backgroundWidth = 300
              backgroundHeight = 200

              signCell = { start: 24, end: 27 }
              signBoxCell = "V"
              signByCell = { start: 22, end: 29 }
              countFromEndDetailToSignBox = 12

              _sourceRow = 28
              _sourceRow_2 = 28
              _sourceRow_3 = 28
              headerRowCount = 27


              lastPageRowsHeight = 13
              break;
            case '01GTKT0/001':
              if (convertYn == "Y") {
                reportPath = 'report/60/95/einvoices_template/During/During_convert.xlsx'
                reportSheet = "GTGT.BD.Org"
                this.masterDataArray.push(
                  { Cell: `G13`, Info: [`convert`], Type: 2 },
                  { Cell: `C41`, Info: [`CONVERT_NAME`], Type: 1 },
                  { Cell: `C42`, Info: [`CONVERT_DATE`], Type: 1 },
                )
              } else {
                reportPath = 'report/60/95/einvoices_template/During/During.xlsx'
                reportSheet = "GTGT.BD.Org"
              }

              logos = [
                { start: 2, width: 1.19 * dpi, height: 1.32 * dpi, logoStartCount: 1.5, logoPath: "assets/images/einvoices_logo/During/companylogo.png" }
              ]
              bgPath = "assets/images/einvoices_logo/During/bg.png"


              //mảng data của master
              this.masterDataArray.push(
                { Cell: `AA10`, Info: [`TEMPLATECODE`], Type: 1 },
                { Cell: `AA12`, Info: [`INVOICESERIALNO`], Type: 1 },
                { Cell: `AA13`, Info: [`INVOICENUMBER`], Type: 1 },
                { Cell: `G14`, Info: [`dateString`], Type: 2 },
                { Cell: `X14`, Info: [`page`], Type: 2 },
                { Cell: `A47`, Info: [`footer`], Type: 2 },

                // { Cell: `F7`, Info: [`SELLER_NAME`], Type: 1 },
                { Cell: `J6`, Info: [`SELLER_TAXCODE`], Type: 1 },
                { Cell: `K4`, Info: [`SELLER_ADDRESS`], Type: 1 },
                { Cell: `K5`, Info: [`SELLER_TEL`], Type: 1 },
                { Cell: `U5`, Info: [`SELLER_FAX`], Type: 1 },
                { Cell: `J7`, Info: [`SELLER_ACCOUNTNO`], Type: 1 },
                // { Cell: `E12`, Info: [`SELLER_BANKNAME`], Type: 1 },

                { Cell: `N17`, Info: [`BUYER`], Type: 1 },
                { Cell: `J18`, Info: [`BUYERLEGALNAME`], Type: 1 },
                { Cell: `H19`, Info: [`BUYERTAXCODE`], Type: 1 },
                { Cell: `H20`, Info: [`BUYERADDRESS`], Type: 1 },
                { Cell: `N22`, Info: [`PAYMENTMETHODCK`], Type: 1 },
                { Cell: `X22`, Info: [`BUYERACCOUNTNO`], Type: 1 },
                { Cell: `Y19`, Info: [`BUYERPHONE`], Type: 1 },
                //{ Cell: `O17`, Info: [`CURRENCYCODEUSD`], Type: 1 },
                // 
                { Cell: `AA29`, Info: [`amount_net`], Type: 2 },
                { Cell: `J30`, Info: [`TAXRATE`], Type: 1 },
                { Cell: `AA30`, Info: [`amount_vat`], Type: 2 },//VAT Amount: 
                { Cell: `AA31`, Info: [`amount_total`], Type: 2 },
                { Cell: `J32`, Info: [`read_price`], Type: 2 },

                // { Cell: `D33`, Info: [`CQT_MCCQT_ID`], Type: 1 },
                { Cell: `G43`, Info: [`MATRACUU`], Type: 1 },

                { Cell: `V42`, Info: [`SIGNEDBY`], Type: 3 },
                { Cell: `V43`, Info: [`SIGNEDDATE`], Type: 3 },

              )
              // //"A", "B", "C", "D", "E", "F", "G", "H", "I", "J",  "K",  "L",  "M",  "N",  "O",  "P",  "Q",  "R",  "S",  "T",  "U",  "V",  "W",  "X",  "Y",  "Z",
              // //"1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26",

              //cấu trúc dòng detail
              // thin//dotted//dashDot//hair//dashDotDot//slantDashDot//mediumDashed//mediumDashDotDot//mediumDashDot//medium//double//thick
              detailCellFormat = [
                { startCell: 2, endCell: 3, cellType: 2, cellBorder: "thin", field: "STT" },//từ cell bắt đầu tới cell kết thúc, type 2: cell đầu tiên
                { startCell: 4, endCell: 17, cellType: 3, cellBorder: "thin", field: "ITEM_NAME" },//từ cell bắt đầu tới cell kết thúc, type 3: cell kế tiếp cell đầu tiên,
                { startCell: 18, endCell: 20, cellType: 1, cellBorder: "thin", field: "ITEM_UOM" },//type 1: còn lại
                { startCell: 21, endCell: 23, cellType: 1, cellBorder: "thin", field: "QTY" },//type 1: còn lại
                { startCell: 24, endCell: 26, cellType: 1, cellBorder: "thin", field: "U_PRICE" },//type 1: còn lại
                { startCell: 27, endCell: 29, cellType: 1, cellBorder: "thin", field: "NET_TR_AMT" },//type 1: còn lại
              ]
              backgroundCell = 13
              backgroundWidth = 300
              backgroundHeight = 200


              signCell = { start: 24, end: 27 }
              signBoxCell = "V"
              signByCell = { start: 22, end: 29 }
              countFromEndDetailToSignBox = 12

              _sourceRow = 28
              _sourceRow_2 = 28
              _sourceRow_3 = 28
              headerRowCount = 27


              lastPageRowsHeight = 13
              break;

            default:

              break;
          }
          break;
        //////// *****************During*********************\\\\\\\\\

        //////// *****************Ajtotal*********************\\\\\\\\\
        case "Ajtotal":
          this.masterDataArray = []
          switch (einvoiceMasterData[0].TEMPLATECODE) {
            case "1":
              if (convertYn == "Y") {
                reportPath = 'report/60/95/einvoices_template/Ajtotal/Ajtotal_convert_1.xlsx'
                reportSheet = "Invoice"
                this.masterDataArray.push(
                  { Cell: `E3`, Info: [`convert`], Type: 2 },
                  { Cell: `B38`, Info: [`CONVERT_NAME`], Type: 1 },
                  { Cell: `B39`, Info: [`CONVERT_DATE`], Type: 1 },
                )
              } else {
                reportPath = 'report/60/95/einvoices_template/Ajtotal/Ajtotal_1.xlsx'
                reportSheet = "Invoice"
              }

              bgPath = "assets/images/einvoices_logo/Ajtotal/bg.png"
              logos = [
                { start: 1, width: 1.62 * dpi, height: 0.64 * dpi, logoStartCount: 1, logoPath: "assets/images/einvoices_logo/Ajtotal/companylogo.png" }

              ]
              //mảng data của master
              this.masterDataArray.push(
                { Cell: `P3`, Info: [`TEMPLATECODE`, `INVOICESERIALNO`], Type: 1 },
                { Cell: `P4`, Info: [`INVOICENUMBER`], Type: 1 },
                { Cell: `E4`, Info: [`dateString`], Type: 2 },
                { Cell: `E5`, Info: [`page`], Type: 2 },
                { Cell: `B43`, Info: [`footer`], Type: 2 },

                { Cell: `F7`, Info: [`SELLER_NAME`], Type: 1 },
                { Cell: `E8`, Info: [`SELLER_TAXCODE`], Type: 1 },
                { Cell: `E9`, Info: [`SELLER_ADDRESS`], Type: 1 },
                { Cell: `D10`, Info: [`SELLER_TEL`], Type: 1 },
                { Cell: `I10`, Info: [`SELLER_FAX`], Type: 1 },
                { Cell: `F11`, Info: [`SELLER_ACCOUNTNO`], Type: 1 },
                { Cell: `E12`, Info: [`SELLER_BANKNAME`], Type: 1 },

                { Cell: `G15`, Info: [`BUYER`], Type: 1 },
                { Cell: `F16`, Info: [`BUYERLEGALNAME`], Type: 1 },
                { Cell: `E17`, Info: [`BUYERTAXCODE`], Type: 1 },
                { Cell: `E18`, Info: [`BUYERADDRESS`], Type: 1 },
                { Cell: `P19`, Info: [`ATTRIBUTE_7_81`], Type: 1 },
                { Cell: `L20`, Info: [`ATTRIBUTE_8_82`], Type: 1 },
                { Cell: `O20`, Info: [`ATTRIBUTE_9_83`], Type: 1 },

                //{ Cell: `O17`, Info: [`CURRENCYCODEUSD`], Type: 1 },
                // { Cell: `F16`, Info: [`BUYERACCOUNTNO`], Type: 1 },
                { Cell: `O26`, Info: [`amount_net`], Type: 2 },
                { Cell: `F27`, Info: [`TAXRATE`], Type: 1 },
                { Cell: `O27`, Info: [`amount_vat`], Type: 2 },//VAT Amount: 
                { Cell: `O28`, Info: [`amount_total`], Type: 2 },
                { Cell: `F29`, Info: [`read_price`], Type: 2 },

                { Cell: `D40`, Info: [`CQT_MCCQT_ID`], Type: 1 },
                { Cell: `M41`, Info: [`MATRACUU`], Type: 1 },

                { Cell: `K38`, Info: [`SIGNEDBY`], Type: 3 },
                { Cell: `K39`, Info: [`SIGNEDDATE`], Type: 3 },

              )
              // //"A", "B", "C", "D", "E", "F", "G", "H", "I", "J",  "K",  "L",  "M",  "N",  "O",  "P",  "Q",  "R",  "S",  "T",  "U",  "V",  "W",  "X",  "Y",  "Z",
              // //"1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26",

              //cấu trúc dòng detail
              // thin//dotted//dashDot//hair//dashDotDot//slantDashDot//mediumDashed//mediumDashDotDot//mediumDashDot//medium//double//thick
              detailCellFormat = [
                { startCell: 1, endCell: 2, cellType: 2, cellBorder: "dotted", field: "STT" },//từ cell bắt đầu tới cell kết thúc, type 2: cell đầu tiên
                { startCell: 3, endCell: 7, cellType: 3, cellBorder: "dotted", field: "ITEM_NAME" },//từ cell bắt đầu tới cell kết thúc, type 3: cell kế tiếp cell đầu tiên,
                { startCell: 8, endCell: 8, cellType: 1, cellBorder: "dotted", field: "ITEM_UOM" },//type 1: còn lại
                { startCell: 9, endCell: 11, cellType: 1, cellBorder: "dotted", field: "QTY" },//type 1: còn lại
                { startCell: 12, endCell: 14, cellType: 1, cellBorder: "dotted", field: "U_PRICE" },//type 1: còn lại
                { startCell: 15, endCell: 16, cellType: 1, cellBorder: "dotted", field: "NET_TR_AMT" },//type 1: còn lại
              ]
              backgroundCell = 4
              backgroundWidth = 300
              backgroundHeight = 200



              signCell = { start: 11, end: 14 }
              signBoxCell = "K"
              signByCell = { start: 11, end: 16 }
              countFromEndDetailToSignBox = 11

              _sourceRow = 25
              _sourceRow_2 = 25
              _sourceRow_3 = 25
              headerRowCount = 24


              lastPageRowsHeight = 14

              break;
            case '01GTKT0/001':
              if (convertYn == "Y") {
                reportPath = 'report/60/95/einvoices_template/Ajtotal/Ajtotal_convert.xlsx'
                reportSheet = "Invoice"
                this.masterDataArray.push(
                  { Cell: `E3`, Info: [`convert`], Type: 2 },
                  { Cell: `B38`, Info: [`CONVERT_NAME`], Type: 1 },
                  { Cell: `B39`, Info: [`CONVERT_DATE`], Type: 1 },
                )
              } else {
                reportPath = 'report/60/95/einvoices_template/Ajtotal/Ajtotal.xlsx'
                reportSheet = "Invoice"
              }

              bgPath = "assets/images/einvoices_logo/Ajtotal/bg.png"
              logos = [
                { start: 1, width: 1.62 * dpi, height: 0.64 * dpi, logoStartCount: 1, logoPath: "assets/images/einvoices_logo/Ajtotal/companylogo.png" }

              ]

              //mảng data của master
              this.masterDataArray.push(
                { Cell: `P2`, Info: [`TEMPLATECODE`], Type: 1 },
                { Cell: `P3`, Info: [`INVOICESERIALNO`], Type: 1 },
                { Cell: `P4`, Info: [`INVOICENUMBER`], Type: 1 },
                { Cell: `E4`, Info: [`dateString`], Type: 2 },
                { Cell: `E5`, Info: [`page`], Type: 2 },
                { Cell: `B43`, Info: [`footer`], Type: 2 },

                { Cell: `F7`, Info: [`SELLER_NAME`], Type: 1 },
                { Cell: `E8`, Info: [`SELLER_TAXCODE`], Type: 1 },
                { Cell: `E9`, Info: [`SELLER_ADDRESS`], Type: 1 },
                { Cell: `D10`, Info: [`SELLER_TEL`], Type: 1 },
                { Cell: `I10`, Info: [`SELLER_FAX`], Type: 1 },
                { Cell: `F11`, Info: [`SELLER_ACCOUNTNO`], Type: 1 },
                { Cell: `E12`, Info: [`SELLER_BANKNAME`], Type: 1 },

                { Cell: `G15`, Info: [`BUYER`], Type: 1 },
                { Cell: `F16`, Info: [`BUYERLEGALNAME`], Type: 1 },
                { Cell: `E17`, Info: [`BUYERTAXCODE`], Type: 1 },
                { Cell: `E18`, Info: [`BUYERADDRESS`], Type: 1 },
                { Cell: `H19`, Info: [`PAYMENTMETHODCK`], Type: 1 },
                { Cell: `P19`, Info: [`ATTRIBUTE_7_81`], Type: 1 },
                { Cell: `L20`, Info: [`ATTRIBUTE_8_82`], Type: 1 },
                { Cell: `O20`, Info: [`ATTRIBUTE_9_83`], Type: 1 },


                //{ Cell: `O17`, Info: [`CURRENCYCODEUSD`], Type: 1 },
                // { Cell: `F16`, Info: [`BUYERACCOUNTNO`], Type: 1 },
                { Cell: `O26`, Info: [`amount_net`], Type: 2 },
                { Cell: `F27`, Info: [`TAXRATE`], Type: 1 },
                { Cell: `O27`, Info: [`amount_vat`], Type: 2 },//VAT Amount: 
                { Cell: `O28`, Info: [`amount_total`], Type: 2 },
                { Cell: `F29`, Info: [`read_price`], Type: 2 },

                // { Cell: `D33`, Info: [`CQT_MCCQT_ID`], Type: 1 },
                { Cell: `D40`, Info: [`MATRACUU`], Type: 1 },

                { Cell: `K38`, Info: [`SIGNEDBY`], Type: 3 },
                { Cell: `K39`, Info: [`SIGNEDDATE`], Type: 3 },

              )
              // //"A", "B", "C", "D", "E", "F", "G", "H", "I", "J",  "K",  "L",  "M",  "N",  "O",  "P",  "Q",  "R",  "S",  "T",  "U",  "V",  "W",  "X",  "Y",  "Z",
              // //"1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26",

              //cấu trúc dòng detail
              // thin//dotted//dashDot//hair//dashDotDot//slantDashDot//mediumDashed//mediumDashDotDot//mediumDashDot//medium//double//thick
              detailCellFormat = [
                { startCell: 1, endCell: 2, cellType: 2, cellBorder: "dotted", field: "STT" },//từ cell bắt đầu tới cell kết thúc, type 2: cell đầu tiên
                { startCell: 3, endCell: 7, cellType: 3, cellBorder: "dotted", field: "ITEM_NAME" },//từ cell bắt đầu tới cell kết thúc, type 3: cell kế tiếp cell đầu tiên,
                { startCell: 8, endCell: 8, cellType: 1, cellBorder: "dotted", field: "ITEM_UOM" },//type 1: còn lại
                { startCell: 9, endCell: 11, cellType: 1, cellBorder: "dotted", field: "QTY" },//type 1: còn lại
                { startCell: 12, endCell: 14, cellType: 1, cellBorder: "dotted", field: "U_PRICE" },//type 1: còn lại
                { startCell: 15, endCell: 16, cellType: 1, cellBorder: "dotted", field: "NET_TR_AMT" },//type 1: còn lại
              ]
              backgroundCell = 4
              backgroundWidth = 300
              backgroundHeight = 200

              signCell = { start: 11, end: 14 }
              signBoxCell = "K"
              signByCell = { start: 11, end: 16 }
              countFromEndDetailToSignBox = 11

              _sourceRow = 25
              _sourceRow_2 = 25
              _sourceRow_3 = 25
              headerRowCount = 24


              lastPageRowsHeight = 14
              break;
            default:
              break;
          }
          break;
        //////// *****************Ajtotal*********************\\\\\\\\\

        //////// *****************Daewon*********************\\\\\\\\\
        case "Daewon":
          this.masterDataArray = []
          switch (einvoiceMasterData[0].TEMPLATECODE) {
            case "1":
              if (convertYn == "Y") {
                reportPath = 'report/60/95/einvoices_template/Daewon/Daewon_convert_2.xlsx'
                reportSheet = "daewon1"
                this.masterDataArray.push(
                  { Cell: `B8`, Info: [`convert`], Type: 2 },
                  { Cell: `B31`, Info: [`CONVERT_NAME`], Type: 1 },
                  { Cell: `B32`, Info: [`CONVERT_DATE`], Type: 1 },
                )
              } else {
                reportPath = 'report/60/95/einvoices_template/Daewon/Daewon_2.xlsx'
                reportSheet = "daewon1"
              }

              logos = [
                { start: 2, width: 0.88 * dpi, height: 0.65 * dpi, logoStartCount: 1, logoPath: "assets/images/einvoices_logo/Daewon/companylogo.png" }
              ]

              //mảng data của master
              this.masterDataArray.push(
                //  { Cell: `J7`, Info: [`TEMPLATECODE`], Type: 1 },
                { Cell: `J8`, Info: [`TEMPLATECODE`, `INVOICESERIALNO`], Type: 1 },
                { Cell: `J9`, Info: [`INVOICENUMBER`], Type: 1 },
                { Cell: `B9`, Info: [`dateString`], Type: 2 },
                { Cell: `I10`, Info: [`page`], Type: 2 },
                { Cell: `B36`, Info: [`footer`], Type: 2 },

                { Cell: `F11`, Info: [`BUYER`], Type: 1 },
                { Cell: `E12`, Info: [`BUYERLEGALNAME`], Type: 1 },
                { Cell: `E13`, Info: [`BUYERADDRESS`], Type: 1 },
                { Cell: `J14`, Info: [`BUYERTAXCODE`], Type: 1 },
                { Cell: `F14`, Info: [`PAYMENTMETHODCK`], Type: 1 },
                { Cell: `E15`, Info: [`ATTRIBUTE_01`], Type: 1 },

                { Cell: `J22`, Info: [`amount_net`], Type: 2 },//Total Amount
                { Cell: `J21`, Info: [`TOTAL_TR_AMT`], Type: 1 },
                { Cell: `E23`, Info: [`TAXRATE`], Type: 1 },
                { Cell: `E22`, Info: [`lb_amount_trans`], Type: 1 },
                { Cell: `J23`, Info: [`amount_vat`], Type: 2 },//VAT Amount: 
                { Cell: `J24`, Info: [`amount_total`], Type: 2 }, /// Total Amount
                { Cell: `D25`, Info: [`read_price`], Type: 2 },
                { Cell: `E26`, Info: [`read_price`], Type: 2 },

                { Cell: `D33`, Info: [`CQT_MCCQT_ID`], Type: 1 },
                { Cell: `I34`, Info: [`MATRACUU`], Type: 1 },

                { Cell: `I32`, Info: [`SIGNEDBY`], Type: 3 },
                { Cell: `I33`, Info: [`SIGNEDDATE`], Type: 3 },

              )
              // //"A", "B", "C", "D", "E", "F", "G", "H", "I", "J",  "K",  "L",  "M",  "N",  "O",  "P",  "Q",  "R",  "S",  "T",  "U",  "V",  "W",  "X",  "Y",  "Z",
              // //"1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26",

              //cấu trúc dòng detail
              // thin//dotted//dashDot//hair//dashDotDot//slantDashDot//mediumDashed//mediumDashDotDot//mediumDashDot//medium//double//thick
              detailCellFormat = [
                { startCell: 1, endCell: 2, cellType: 2, cellBorder: "dotted", field: "STT" },//từ cell bắt đầu tới cell kết thúc, type 2: cell đầu tiên
                { startCell: 3, endCell: 6, cellType: 3, cellBorder: "dotted", field: "ITEM_NAME" },//từ cell bắt đầu tới cell kết thúc, type 3: cell kế tiếp cell đầu tiên,
                { startCell: 7, endCell: 7, cellType: 1, cellBorder: "dotted", field: "ITEM_UOM" },//type 1: còn lại
                { startCell: 8, endCell: 8, cellType: 1, cellBorder: "dotted", field: "QTY" },//type 1: còn lại
                { startCell: 9, endCell: 9, cellType: 1, cellBorder: "dotted", field: "U_PRICE" },//type 1: còn lại
                { startCell: 10, endCell: 11, cellType: 1, cellBorder: "dotted", field: "NET_TR_AMT" },//type 1: còn lại
              ]
              signCell = { start: 8, end: 10 }
              signBoxCell = "I"
              signByCell = { start: 9, end: 11 }
              countFromEndDetailToSignBox = 10

              _sourceRow = 20
              _sourceRow_2 = 20
              _sourceRow_3 = 20
              headerRowCount = 19


              lastPageRowsHeight = 12




              break;
            case '01GTKT0/001':
              if (convertYn == "Y") {
                reportPath = 'report/60/95/einvoices_template/Daewon/Daewon_convert.xlsx'
                reportSheet = "daewon1"
                this.masterDataArray.push(
                  { Cell: `B8`, Info: [`convert`], Type: 2 },
                  { Cell: `B31`, Info: [`CONVERT_NAME`], Type: 1 },
                  { Cell: `B32`, Info: [`CONVERT_DATE`], Type: 1 },
                )
              } else {
                reportPath = 'report/60/95/einvoices_template/Daewon/Daewon.xlsx'
                reportSheet = "daewon1"
              }

              logos = [
                { start: 2, width: 0.88 * dpi, height: 0.65 * dpi, logoStartCount: 1, logoPath: "assets/images/einvoices_logo/Daewon/companylogo.png" }
              ]


              //mảng data của master
              this.masterDataArray.push(
                { Cell: `J7`, Info: [`TEMPLATECODE`], Type: 1 },
                { Cell: `J8`, Info: [`INVOICESERIALNO`], Type: 1 },
                { Cell: `J9`, Info: [`INVOICENUMBER`], Type: 1 },
                { Cell: `B9`, Info: [`dateString`], Type: 2 },
                { Cell: `I10`, Info: [`page`], Type: 2 },
                { Cell: `B36`, Info: [`footer`], Type: 2 },

                { Cell: `F11`, Info: [`BUYER`], Type: 1 },
                { Cell: `E12`, Info: [`BUYERLEGALNAME`], Type: 1 },
                { Cell: `E13`, Info: [`BUYERADDRESS`], Type: 1 },
                { Cell: `J14`, Info: [`BUYERTAXCODE`], Type: 1 },
                { Cell: `F14`, Info: [`PAYMENTMETHODCK`], Type: 1 },
                { Cell: `E15`, Info: [`ATTRIBUTE_01`], Type: 1 },

                { Cell: `J22`, Info: [`amount_net`], Type: 2 },//Total Amount
                { Cell: `J21`, Info: [`TOTAL_TR_AMT`], Type: 1 },
                { Cell: `E23`, Info: [`TAXRATE`], Type: 1 },
                { Cell: `E22`, Info: [`lb_amount_trans`], Type: 1 },
                { Cell: `J23`, Info: [`amount_vat`], Type: 2 },//VAT Amount: 
                { Cell: `J24`, Info: [`amount_total`], Type: 2 }, /// Total Amount
                { Cell: `D25`, Info: [`read_price`], Type: 2 },
                { Cell: `E26`, Info: [`read_price`], Type: 2 },
                { Cell: `D33`, Info: [`MATRACUU`], Type: 1 },

                { Cell: `I32`, Info: [`SIGNEDBY`], Type: 3 },
                { Cell: `I33`, Info: [`SIGNEDDATE`], Type: 3 },

              )
              // //"A", "B", "C", "D", "E", "F", "G", "H", "I", "J",  "K",  "L",  "M",  "N",  "O",  "P",  "Q",  "R",  "S",  "T",  "U",  "V",  "W",  "X",  "Y",  "Z",
              // //"1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26",

              //cấu trúc dòng detail
              // thin//dotted//dashDot//hair//dashDotDot//slantDashDot//mediumDashed//mediumDashDotDot//mediumDashDot//medium//double//thick
              detailCellFormat = [
                { startCell: 1, endCell: 2, cellType: 2, cellBorder: "dotted", field: "STT" },//từ cell bắt đầu tới cell kết thúc, type 2: cell đầu tiên
                { startCell: 3, endCell: 6, cellType: 3, cellBorder: "dotted", field: "ITEM_NAME" },//từ cell bắt đầu tới cell kết thúc, type 3: cell kế tiếp cell đầu tiên,
                { startCell: 7, endCell: 7, cellType: 1, cellBorder: "dotted", field: "ITEM_UOM" },//type 1: còn lại
                { startCell: 8, endCell: 8, cellType: 1, cellBorder: "dotted", field: "QTY" },//type 1: còn lại
                { startCell: 9, endCell: 9, cellType: 1, cellBorder: "dotted", field: "U_PRICE" },//type 1: còn lại
                { startCell: 10, endCell: 11, cellType: 1, cellBorder: "dotted", field: "NET_TR_AMT" },//type 1: còn lại
              ]
              countFromEndDetailToSignBox = 10

              signCell = { start: 8, end: 10 }
              signBoxCell = "I"
              signByCell = { start: 9, end: 11 }

              _sourceRow = 20
              _sourceRow_2 = 20
              _sourceRow_3 = 20
              headerRowCount = 19


              lastPageRowsHeight = 13

              break;
            default:

              break;
          }
          break;
        //////// *****************Daewon*********************\\\\\\\\\

        //////// *****************Yupoong*********************\\\\\\\\\
        case "Yupoong":

          this.masterDataArray = []

          switch (einvoiceMasterData[0].TEMPLATECODE) {
            case "2":
              if (convertYn == "Y") {
                reportPath = 'report/60/95/einvoices_template/Yupoong/Yupoong_convert_2.xlsx'
                reportSheet = "Invoice (2)"
                this.masterDataArray.push(
                  { Cell: `E3`, Info: [`convert`], Type: 2 },
                  { Cell: `B33`, Info: [`CONVERT_NAME`], Type: 1 },
                  { Cell: `B34`, Info: [`CONVERT_DATE`], Type: 1 },
                )
              } else {
                reportPath = 'report/60/95/einvoices_template/Yupoong/Yupoong_2.xlsx'
                reportSheet = "Invoice (2)"
              }

              logos = [
                { start: 1, width: 0.99 * dpi, height: 0.62 * dpi, logoStartCount: 1, logoPath: "assets/images/einvoices_logo/Yupoong/companylogo.png" }
              ]
              bgPath = "assets/images/einvoices_logo/Yupoong/bg.png"


              //mảng data của master
              this.masterDataArray.push(
                { Cell: `O3`, Info: [`TEMPLATECODE`, `INVOICESERIALNO`], Type: 1 },
                { Cell: `O4`, Info: [`INVOICENUMBER`], Type: 1 },
                { Cell: `E4`, Info: [`dateString`], Type: 2 },
                { Cell: `E5`, Info: [`page`], Type: 2 },
                { Cell: `B36`, Info: [`footer`], Type: 2 },

                { Cell: `F7`, Info: [`SELLER_NAME`], Type: 1 },
                { Cell: `N10`, Info: [`SELLER_TAXCODE`], Type: 1 },
                { Cell: `D8`, Info: [`SELLER_ADDRESS`], Type: 1 },
                { Cell: `D10`, Info: [`SELLER_TEL`], Type: 1 },
                { Cell: `H10`, Info: [`SELLER_FAX`], Type: 1 },
                { Cell: `E9`, Info: [`SELLER_ACCOUNTNO`, `SELLER_BANKNAME`], Type: 1 },

                { Cell: `G13`, Info: [`BUYER`], Type: 1 },
                { Cell: `F14`, Info: [`BUYERLEGALNAME`], Type: 1 },
                { Cell: `N16`, Info: [`BUYERTAXCODE`], Type: 1 },
                { Cell: `D15`, Info: [`BUYERADDRESS`], Type: 1 },
                { Cell: `G17`, Info: [`PAYMENTMETHODCK`], Type: 1 },
                { Cell: `O17`, Info: [`CURRENCYCODEUSD`], Type: 1 },
                { Cell: `F16`, Info: [`BUYERACCOUNTNO`], Type: 1 },
                { Cell: `E22`, Info: [`TAXRATE`], Type: 1 },
                { Cell: `N22`, Info: [`amount_total`], Type: 2 },
                { Cell: `F23`, Info: [`read_price`], Type: 2 },
                { Cell: `D33`, Info: [`CQT_MCCQT_ID`], Type: 1 },
                { Cell: `K34`, Info: [`MATRACUU`], Type: 1 },

                { Cell: `K30`, Info: [`SIGNEDBY`], Type: 3 },
                { Cell: `K31`, Info: [`SIGNEDDATE`], Type: 3 },

              )
              // //"A", "B", "C", "D", "E", "F", "G", "H", "I", "J",  "K",  "L",  "M",  "N",  "O",  "P",  "Q",  "R",  "S",  "T",  "U",  "V",  "W",  "X",  "Y",  "Z",
              // //"1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26",

              //cấu trúc dòng detail
              // thin//dotted//dashDot//hair//dashDotDot//slantDashDot//mediumDashed//mediumDashDotDot//mediumDashDot//medium//double//thick
              detailCellFormat = [
                { startCell: 1, endCell: 2, cellType: 2, cellBorder: "thin", field: "STT" },//từ cell bắt đầu tới cell kết thúc, type 2: cell đầu tiên
                { startCell: 3, endCell: 7, cellType: 3, cellBorder: "thin", field: "ITEM_NAME" },//từ cell bắt đầu tới cell kết thúc, type 3: cell kế tiếp cell đầu tiên,
                { startCell: 8, endCell: 8, cellType: 1, cellBorder: "thin", field: "ITEM_UOM" },//type 1: còn lại
                { startCell: 9, endCell: 10, cellType: 1, cellBorder: "thin", field: "QTY" },//type 1: còn lại
                { startCell: 11, endCell: 13, cellType: 1, cellBorder: "thin", field: "U_PRICE" },//type 1: còn lại
                { startCell: 14, endCell: 15, cellType: 1, cellBorder: "thin", field: "NET_TR_AMT" },//type 1: còn lại
              ]
              backgroundCell = 4
              backgroundWidth = 300
              backgroundHeight = 200


              signCell = { start: 11, end: 14 }
              signBoxCell = "K"
              signByCell = { start: 11, end: 15 }
              countFromEndDetailToSignBox = 7

              _sourceRow = 21
              _sourceRow_2 = 21
              _sourceRow_3 = 21
              headerRowCount = 20


              lastPageRowsHeight = 14

              break;
            case '07KPTQ0/001':

              if (convertYn == "Y") {
                reportPath = 'report/60/95/einvoices_template/Yupoong/Yupoong_convert.xlsx'
                reportSheet = "Invoice"
                this.masterDataArray.push(
                  { Cell: `E7`, Info: [`convert`], Type: 2 },
                  { Cell: `B34`, Info: [`CONVERT_NAME`], Type: 1 },
                  { Cell: `B35`, Info: [`CONVERT_DATE`], Type: 1 },
                )
              } else {
                reportPath = 'report/60/95/einvoices_template/Yupoong/Yupoong.xlsx'
                reportSheet = "Invoice"
              }

              logos = [
                { start: 1, width: 0.93 * dpi, height: 0.66 * dpi, logoStartCount: 5, logoPath: "assets/images/einvoices_logo/Yupoong/companylogo.png" }
              ]
              bgPath = "assets/images/einvoices_logo/Yupoong/bg.png"


              //mảng data của master
              this.masterDataArray.push(
                { Cell: `O6`, Info: [`TEMPLATECODE`], Type: 1 },
                { Cell: `O7`, Info: [`INVOICESERIALNO`], Type: 1 },
                { Cell: `O8`, Info: [`INVOICENUMBER`], Type: 1 },
                { Cell: `E8`, Info: [`dateString`], Type: 2 },
                { Cell: `E9`, Info: [`page`], Type: 2 },
                { Cell: `B39`, Info: [`footer`], Type: 2 },

                { Cell: `F10`, Info: [`SELLER_NAME`], Type: 1 },
                { Cell: `O14`, Info: [`SELLER_TAXCODE`], Type: 1 },
                { Cell: `E12`, Info: [`SELLER_ADDRESS`], Type: 1 },
                { Cell: `D14`, Info: [`SELLER_TEL`], Type: 1 },
                { Cell: `G14`, Info: [`SELLER_FAX`], Type: 1 },
                { Cell: `E13`, Info: [`SELLER_ACCOUNTNO`, `SELLER_BANKNAME`], Type: 1 },

                { Cell: `G17`, Info: [`BUYER`], Type: 1 },
                { Cell: `F18`, Info: [`BUYERLEGALNAME`], Type: 1 },
                { Cell: `L21`, Info: [`BUYERTAXCODE`], Type: 1 },
                { Cell: `E19`, Info: [`BUYERADDRESS`], Type: 1 },
                { Cell: `G21`, Info: [`PAYMENTMETHODCK`], Type: 1 },
                { Cell: `F20`, Info: [`BUYERACCOUNTNO`], Type: 1 },
                { Cell: `N26`, Info: [`amount_total`], Type: 2 },
                { Cell: `F27`, Info: [`read_price`], Type: 2 },
                { Cell: `D36`, Info: [`MATRACUU`], Type: 1 },

                { Cell: `K34`, Info: [`SIGNEDBY`], Type: 3 },
                { Cell: `K35`, Info: [`SIGNEDDATE`], Type: 3 },

              )
              // //"A", "B", "C", "D", "E", "F", "G", "H", "I", "J",  "K",  "L",  "M",  "N",  "O",  "P",  "Q",  "R",  "S",  "T",  "U",  "V",  "W",  "X",  "Y",  "Z",
              // //"1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26",

              //cấu trúc dòng detail
              // thin//dotted//dashDot//hair//dashDotDot//slantDashDot//mediumDashed//mediumDashDotDot//mediumDashDot//medium//double//thick
              detailCellFormat = [
                { startCell: 1, endCell: 2, cellType: 2, cellBorder: "thin", field: "STT" },//từ cell bắt đầu tới cell kết thúc, type 2: cell đầu tiên
                { startCell: 3, endCell: 7, cellType: 3, cellBorder: "thin", field: "ITEM_NAME" },//từ cell bắt đầu tới cell kết thúc, type 3: cell kế tiếp cell đầu tiên,
                { startCell: 8, endCell: 8, cellType: 1, cellBorder: "thin", field: "ITEM_UOM" },//type 1: còn lại
                { startCell: 9, endCell: 10, cellType: 1, cellBorder: "thin", field: "QTY" },//type 1: còn lại
                { startCell: 11, endCell: 13, cellType: 1, cellBorder: "thin", field: "U_PRICE" },//type 1: còn lại
                { startCell: 14, endCell: 15, cellType: 1, cellBorder: "thin", field: "NET_TR_AMT" },//type 1: còn lại
              ]
              backgroundCell = 4
              backgroundWidth = 300
              backgroundHeight = 200


              signCell = { start: 11, end: 14 }
              signBoxCell = "K"
              signByCell = { start: 11, end: 15 }
              countFromEndDetailToSignBox = 7

              _sourceRow = 21
              _sourceRow_2 = 21
              _sourceRow_3 = 21
              headerRowCount = 20


              lastPageRowsHeight = 14
              break;
            default:

              break;
          }
          break;
        //////// *****************Yupoong*********************\\\\\\\\\

        ////////// *****************Suheung*********************\\\\\\\\\
        case "Suheung":

          this.masterDataArray = []

          switch (einvoiceMasterData[0].TEMPLATECODE) {
            case "1":
              if (convertYn == "Y") {
                reportPath = 'report/60/95/einvoices_template/Suheung/Suheung_convert_1.xlsx'
                reportSheet = "AR"
                this.masterDataArray.push(
                  { Cell: `D4`, Info: [`convert`], Type: 2 },
                  { Cell: `B38`, Info: [`CONVERT_NAME`], Type: 1 },
                  { Cell: `B39`, Info: [`CONVERT_DATE`], Type: 1 },
                )
              } else {
                reportPath = 'report/60/95/einvoices_template/Suheung/Suheung_1.xlsx'
                reportSheet = "AR"
              }
              logos = [
                { start: 1, width: 1.32 * dpi, height: 1.09 * dpi, logoStartCount: 1, logoPath: "assets/images/einvoices_logo/Suheung/companylogo.png" }
              ]


              //mảng data của master
              this.masterDataArray.push(
                { Cell: `M5`, Info: [`TEMPLATECODE`, `INVOICESERIALNO`], Type: 1 },
                { Cell: `M6`, Info: [`INVOICENUMBER`], Type: 1 },
                { Cell: `D5`, Info: [`dateString`], Type: 2 },
                { Cell: `D6`, Info: [`page`], Type: 2 },
                { Cell: `B43`, Info: [`footer`], Type: 2 },

                { Cell: `E8`, Info: [`SELLER_NAME`], Type: 1 },
                { Cell: `D10`, Info: [`SELLER_TAXCODE`], Type: 1 },
                { Cell: `D9`, Info: [`SELLER_ADDRESS`], Type: 1 },
                { Cell: `D11`, Info: [`SELLER_TEL`], Type: 1 },
                { Cell: `H11`, Info: [`SELLER_FAX`], Type: 1 },
                { Cell: `E12`, Info: [`SELLER_ACCOUNTNO`, `SELLER_BANKNAME`], Type: 1 },
                // { Cell: `E15`, Info: [`SELLER_ACCOUNTNO2`, `BANK_NM79`], Type: 1 },

                { Cell: `E15`, Info: [`BUYER`], Type: 1 },
                { Cell: `E16`, Info: [`BUYERLEGALNAME`], Type: 1 },
                { Cell: `D18`, Info: [`BUYERTAXCODE`], Type: 1 },
                { Cell: `D17`, Info: [`BUYERADDRESS`], Type: 1 },
                { Cell: `M18`, Info: [`PAYMENTMETHODCK`], Type: 1 },
                { Cell: `E19`, Info: [`CURRENCYCODEUSD`], Type: 1 },
                { Cell: `K19`, Info: [`EXCHANGERATE`], Type: 1 },
                { Cell: `E20`, Info: [`DECLARE_NO`], Type: 1 },
                { Cell: `M20`, Info: [`DECLARE_DT`], Type: 1 },

                // { Cell: `B28`, Info: [`lb_amount_trans`], Type: 2 },
                { Cell: `L25`, Info: [`amount_net`], Type: 2 },
                { Cell: `E26`, Info: [`TAXRATE`], Type: 1 },
                //{ Cell: `E30`, Info: [`amount_trans`], Type: 2 },
                { Cell: `L26`, Info: [`amount_vat`], Type: 2 },
                { Cell: `L27`, Info: [`amount_total`], Type: 2 },
                { Cell: `E9`, Info: [`read_price`], Type: 2 },
                // { Cell: `E40`, Info: [`CQT_MCCQT_ID`], Type: 1 },
                { Cell: `D40`, Info: [`MATRACUU`], Type: 1 },

                { Cell: `I39`, Info: [`SIGNEDBY`], Type: 3 },
                { Cell: `I40`, Info: [`SIGNEDDATE`], Type: 3 },

              )
              // //"A", "B", "C", "D", "E", "F", "G", "H", "I", "J",  "K",  "L",  "M",  "N",  "O",  "P",  "Q",  "R",  "S",  "T",  "U",  "V",  "W",  "X",  "Y",  "Z",
              // //"1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26",

              //cấu trúc dòng detail
              // thin//dotted//dashDot//hair//dashDotDot//slantDashDot//mediumDashed//mediumDashDotDot//mediumDashDot//medium//double//thick
              detailCellFormat = [
                { startCell: 1, endCell: 2, cellType: 2, cellBorder: "thin", field: "STT" },//từ cell bắt đầu tới cell kết thúc, type 2: cell đầu tiên
                { startCell: 3, endCell: 5, cellType: 3, cellBorder: "thin", field: "ITEM_NAME" },//từ cell bắt đầu tới cell kết thúc, type 3: cell kế tiếp cell đầu tiên,
                { startCell: 6, endCell: 6, cellType: 1, cellBorder: "thin", field: "ITEM_UOM" },//type 1: còn lại
                { startCell: 7, endCell: 8, cellType: 1, cellBorder: "thin", field: "QTY" },//type 1: còn lại
                { startCell: 9, endCell: 11, cellType: 1, cellBorder: "thin", field: "U_PRICE" },//type 1: còn lại
                { startCell: 12, endCell: 13, cellType: 1, cellBorder: "thin", field: "NET_TR_AMT" },//type 1: còn lại
              ]


              signCell = { start: 9, mid: 11, end: 12 }
              signBoxCell = "I"
              signByCell = { start: 9, end: 13 }
              countFromEndDetailToSignBox = 13

              _sourceRow = 24
              _sourceRow_2 = 24
              _sourceRow_3 = 24
              headerRowCount = 23


              lastPageRowsHeight = 13


              break;
            case '01GTKT0/003':
              if (convertYn == "Y") {
                reportPath = 'report/60/95/einvoices_template/Suheung/Suheung_convert.xlsx'
                reportSheet = "AR"
                this.masterDataArray.push(
                  { Cell: `D4`, Info: [`convert`], Type: 2 },
                  { Cell: `B38`, Info: [`CONVERT_NAME`], Type: 1 },
                  { Cell: `B39`, Info: [`CONVERT_DATE`], Type: 1 },
                )
              } else {
                reportPath = 'report/60/95/einvoices_template/Suheung/Suheung.xlsx'
                reportSheet = "AR"
              }

              logos = [
                { start: 1, width: 1.32 * dpi, height: 1.09 * dpi, logoStartCount: 1, logoPath: "assets/images/einvoices_logo/Suheung/companylogo.png" }
              ]


              //mảng data của master
              this.masterDataArray.push(
                { Cell: `M4`, Info: [`TEMPLATECODE`], Type: 1 },
                { Cell: `M5`, Info: [`INVOICESERIALNO`], Type: 1 },
                { Cell: `M6`, Info: [`INVOICENUMBER`], Type: 1 },
                { Cell: `D5`, Info: [`dateString`], Type: 2 },
                { Cell: `D6`, Info: [`page`], Type: 2 },
                { Cell: `B43`, Info: [`footer`], Type: 2 },

                { Cell: `E8`, Info: [`SELLER_NAME`], Type: 1 },
                { Cell: `D10`, Info: [`SELLER_TAXCODE`], Type: 1 },
                { Cell: `D9`, Info: [`SELLER_ADDRESS`], Type: 1 },
                { Cell: `D11`, Info: [`SELLER_TEL`], Type: 1 },
                { Cell: `H11`, Info: [`SELLER_FAX`], Type: 1 },
                { Cell: `E12`, Info: [`SELLER_ACCOUNTNO`, `SELLER_BANKNAME`], Type: 1 },
                // { Cell: `E15`, Info: [`SELLER_ACCOUNTNO2`, `BANK_NM79`], Type: 1 },

                { Cell: `E15`, Info: [`BUYER`], Type: 1 },
                { Cell: `E16`, Info: [`BUYERLEGALNAME`], Type: 1 },
                { Cell: `D18`, Info: [`BUYERTAXCODE`], Type: 1 },
                { Cell: `D17`, Info: [`BUYERADDRESS`], Type: 1 },
                { Cell: `E19`, Info: [`PAYMENTMETHODCK`], Type: 1 },
                // { Cell: `H21`, Info: [`CURRENCYCODEUSD`], Type: 1 },

                // { Cell: `B28`, Info: [`lb_amount_trans`], Type: 2 },
                { Cell: `L25`, Info: [`amount_net`], Type: 2 },
                { Cell: `E26`, Info: [`TAXRATE`], Type: 1 },
                //{ Cell: `E30`, Info: [`amount_trans`], Type: 2 },
                { Cell: `L26`, Info: [`amount_vat`], Type: 2 },
                { Cell: `L27`, Info: [`amount_total`], Type: 2 },
                { Cell: `E9`, Info: [`read_price`], Type: 2 },
                // { Cell: `E40`, Info: [`CQT_MCCQT_ID`], Type: 1 },
                { Cell: `D40`, Info: [`MATRACUU`], Type: 1 },

                { Cell: `I39`, Info: [`SIGNEDBY`], Type: 3 },
                { Cell: `I40`, Info: [`SIGNEDDATE`], Type: 3 },

              )
              // //"A", "B", "C", "D", "E", "F", "G", "H", "I", "J",  "K",  "L",  "M",  "N",  "O",  "P",  "Q",  "R",  "S",  "T",  "U",  "V",  "W",  "X",  "Y",  "Z",
              // //"1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26",

              //cấu trúc dòng detail
              // thin//dotted//dashDot//hair//dashDotDot//slantDashDot//mediumDashed//mediumDashDotDot//mediumDashDot//medium//double//thick
              detailCellFormat = [
                { startCell: 1, endCell: 2, cellType: 2, cellBorder: "thin", field: "STT" },//từ cell bắt đầu tới cell kết thúc, type 2: cell đầu tiên
                { startCell: 3, endCell: 5, cellType: 3, cellBorder: "thin", field: "ITEM_NAME" },//từ cell bắt đầu tới cell kết thúc, type 3: cell kế tiếp cell đầu tiên,
                { startCell: 6, endCell: 6, cellType: 1, cellBorder: "thin", field: "ITEM_UOM" },//type 1: còn lại
                { startCell: 7, endCell: 8, cellType: 1, cellBorder: "thin", field: "QTY" },//type 1: còn lại
                { startCell: 9, endCell: 11, cellType: 1, cellBorder: "thin", field: "U_PRICE" },//type 1: còn lại
                { startCell: 12, endCell: 13, cellType: 1, cellBorder: "thin", field: "NET_TR_AMT" },//type 1: còn lại
              ]


              signCell = { start: 9, mid: 11, end: 12 }
              signBoxCell = "I"
              signByCell = { start: 9, end: 13 }
              countFromEndDetailToSignBox = 13

              _sourceRow = 24
              _sourceRow_2 = 24
              _sourceRow_3 = 24
              headerRowCount = 23


              lastPageRowsHeight = 13

              break;
            default:
              break;
          }
          break;
        ////////// *****************Suheung*********************\\\\\\\\\

        //////// *****************Kpx*********************\\\\\\\\\
        case "Kpx":

          this.masterDataArray = []
          if (convertYn == "Y") {
            reportPath = 'report/60/95/einvoices_template/Kpx/Kpx_convert.xlsx'
            reportSheet = "Invoice final CON"
            this.masterDataArray.push(
              { Cell: `E13`, Info: [`convert`], Type: 2 },
              { Cell: `B36`, Info: [`CONVERT_NAME`], Type: 1 },
              { Cell: `B37`, Info: [`CONVERT_DATE`], Type: 1 },
            )
          } else {
            reportPath = 'report/60/95/einvoices_template/Kpx/Kpx.xlsx'
            reportSheet = "Invoice final CON"
          }

          logos = [
            { start: 1, width: 1.63 * dpi, height: 0.8 * dpi, logoStartCount: 1, logoPath: "assets/images/einvoices_logo/Kpx/companylogo.png" }
          ]


          //mảng data của master
          this.masterDataArray.push(
            { Cell: `P12`, Info: [`TEMPLATECODE`, `INVOICESERIALNO`], Type: 1 },
            { Cell: `P13`, Info: [`INVOICENUMBER`], Type: 1 },
            { Cell: `E14`, Info: [`dateString`], Type: 2 },
            { Cell: `E15`, Info: [`page`], Type: 2 },
            { Cell: `B42`, Info: [`footer`], Type: 2 },
            { Cell: `G1`, Info: [`SELLER_NAME`], Type: 1 },
            { Cell: `I2`, Info: [`SELLER_TAXCODE`], Type: 1 },
            { Cell: `I3`, Info: [`SELLER_ADDRESS`], Type: 1 },
            { Cell: `I4`, Info: [`SELLER_TEL`], Type: 1 },
            // { Cell: `I5`, Info: [`SELLER_FAX`], Type: 1 },
            { Cell: `I5`, Info: [`SELLER_ACCOUNTNO`, `SELLER_BANKNAME`], Type: 1 },
            // { Cell: `E15`, Info: [`SELLER_ACCOUNTNO2`, `BANK_NM79`], Type: 1 },

            { Cell: `H18`, Info: [`BUYER`], Type: 1 },
            { Cell: `G18`, Info: [`BUYERLEGALNAME`], Type: 1 },
            { Cell: `F19`, Info: [`BUYERTAXCODE`], Type: 1 },
            { Cell: `E20`, Info: [`BUYERADDRESS`], Type: 1 },
            { Cell: `H21`, Info: [`PAYMENTMETHODCK`], Type: 1 },
            // { Cell: `H21`, Info: [`CURRENCYCODEUSD`], Type: 1 },

            // { Cell: `B28`, Info: [`lb_amount_trans`], Type: 2 },
            { Cell: `P27`, Info: [`amount_net`], Type: 2 },
            { Cell: `F28`, Info: [`TAXRATE`], Type: 1 },
            { Cell: `E30`, Info: [`amount_trans`], Type: 2 },
            { Cell: `P28`, Info: [`amount_vat`], Type: 2 },
            { Cell: `P29`, Info: [`amount_total`], Type: 2 },
            { Cell: `G30`, Info: [`read_price`], Type: 2 },
            // { Cell: `E40`, Info: [`CQT_MCCQT_ID`], Type: 1 },
            { Cell: `O40`, Info: [`MATRACUU`], Type: 1 },

            { Cell: `N37`, Info: [`SIGNEDBY`], Type: 3 },
            { Cell: `N38`, Info: [`SIGNEDDATE`], Type: 3 },

          )
          // //"A", "B", "C", "D", "E", "F", "G", "H", "I", "J",  "K",  "L",  "M",  "N",  "O",  "P",  "Q",  "R",  "S",  "T",  "U",  "V",  "W",  "X",  "Y",  "Z",
          // //"1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26",

          //cấu trúc dòng detail
          // thin//dotted//dashDot//hair//dashDotDot//slantDashDot//mediumDashed//mediumDashDotDot//mediumDashDot//medium//double//thick
          detailCellFormat = [
            { startCell: 1, endCell: 2, cellType: 2, cellBorder: "dotted", field: "STT" },//từ cell bắt đầu tới cell kết thúc, type 2: cell đầu tiên
            { startCell: 3, endCell: 8, cellType: 3, cellBorder: "dotted", field: "ITEM_NAME" },//từ cell bắt đầu tới cell kết thúc, type 3: cell kế tiếp cell đầu tiên,
            { startCell: 9, endCell: 9, cellType: 1, cellBorder: "dotted", field: "ITEM_UOM" },//type 1: còn lại
            { startCell: 10, endCell: 12, cellType: 1, cellBorder: "dotted", field: "QTY" },//type 1: còn lại
            { startCell: 13, endCell: 15, cellType: 1, cellBorder: "dotted", field: "U_PRICE" },//type 1: còn lại
            { startCell: 16, endCell: 17, cellType: 1, cellBorder: "dotted", field: "NET_TR_AMT" },//type 1: còn lại
          ]


          signCell = { start: 14, mid: 15, end: 16 }
          signBoxCell = "N"
          signByCell = { start: 14, end: 17 }
          countFromEndDetailToSignBox = 9


          _sourceRow = 26
          _sourceRow_2 = 26
          _sourceRow_3 = 26
          headerRowCount = 25


          lastPageRowsHeight = 13


          break;
        //////// *****************Kpx*********************\\\\\\\\\

        //////// *****************Daeyoung*********************\\\\\\\\\
        case "Daeyoung":
          switch (einvoiceMasterData[0].TEMPLATECODE) {
            case "1":
              this.masterDataArray = []
              if (convertYn == "Y") {
                reportPath = 'report/60/95/einvoices_template/Daeyoung/Daeyoung_convert_1.xlsx'
                reportSheet = "Invoice CONVERT"
                this.masterDataArray.push(
                  { Cell: `E4`, Info: [`convert`], Type: 2 },
                  { Cell: `B38`, Info: [`CONVERT_NAME`], Type: 1 },
                  { Cell: `D39`, Info: [`CONVERT_DATE`], Type: 1 },
                )
              } else {
                reportPath = 'report/60/95/einvoices_template/Daeyoung/Daeyoung_1.xlsx'
                reportSheet = "Invoice NEW"
              }

              logos = [
                { start: 1, width: 1.68 * dpi, height: 0.28 * dpi, logoStartCount: 1, logoPath: "@/assets/images/einvoices_logo/Daeyoung/companylogo.png" }
              ]


              //mảng data của master
              this.masterDataArray.push(
                { Cell: `P4`, Info: [`TEMPLATECODE`, `INVOICESERIALNO`], Type: 1 },
                { Cell: `P5`, Info: [`INVOICENUMBER`], Type: 1 },
                { Cell: `E5`, Info: [`dateString`], Type: 2 },
                { Cell: `E6`, Info: [`page`], Type: 2 },
                { Cell: `B43`, Info: [`footer`], Type: 2 },
                { Cell: `E9`, Info: [`SELLER_NAME`], Type: 1 },
                { Cell: `E10`, Info: [`SELLER_TAXCODE`], Type: 1 },
                { Cell: `E11`, Info: [`SELLER_ADDRESS`], Type: 1 },
                { Cell: `D13`, Info: [`SELLER_TEL`], Type: 1 },
                { Cell: `J13`, Info: [`SELLER_FAX`], Type: 1 },
                { Cell: `E14`, Info: [`SELLER_ACCOUNTNO`, `blankSpc`, `BUYER_BANK_NAME`], Type: 1 },
                { Cell: `E15`, Info: [`SELLER_ACCOUNTNO2`, `blankSpc`, `BANK_NM79`], Type: 1 },

                { Cell: `G18`, Info: [`BUYER`], Type: 1 },
                { Cell: `F19`, Info: [`BUYERLEGALNAME`], Type: 1 },
                { Cell: `E20`, Info: [`BUYERTAXCODE`], Type: 1 },
                { Cell: `D21`, Info: [`BUYERADDRESS`], Type: 1 },
                { Cell: `G22`, Info: [`PAYMENTMETHODCK`], Type: 1 },
                { Cell: `O22`, Info: [`CURRENCYCODEUSD`], Type: 1 },

                { Cell: `B28`, Info: [`lb_amount_trans`], Type: 2 },
                { Cell: `O28`, Info: [`amount_net`], Type: 2 },
                { Cell: `E29`, Info: [`TAXRATE`], Type: 1 },
                { Cell: `E30`, Info: [`amount_trans`], Type: 2 },
                { Cell: `O29`, Info: [`amount_vat`], Type: 2 },
                { Cell: `O30`, Info: [`amount_total`], Type: 2 },
                { Cell: `F31`, Info: [`read_price`], Type: 2 },
                { Cell: `E40`, Info: [`CQT_MCCQT_ID`], Type: 1 },
                { Cell: `M41`, Info: [`MATRACUU`], Type: 1 },

                { Cell: `L38`, Info: [`SIGNEDBY`], Type: 3 },
                { Cell: `L39`, Info: [`SIGNEDDATE`], Type: 3 },

              )
              // //"A", "B", "C", "D", "E", "F", "G", "H", "I", "J",  "K",  "L",  "M",  "N",  "O",  "P",  "Q",  "R",  "S",  "T",  "U",  "V",  "W",  "X",  "Y",  "Z",
              // //"1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26",
              //cấu trúc dòng detail
              detailCellFormat = [
                { startCell: 1, endCell: 2, cellType: 2, cellBorder: "thin", field: "STT" },//từ cell bắt đầu tới cell kết thúc, type 2: cell đầu tiên
                { startCell: 3, endCell: 7, cellType: 3, cellBorder: "thin", field: "ITEM_NAME" },//từ cell bắt đầu tới cell kết thúc, type 3: cell kế tiếp cell đầu tiên,
                { startCell: 8, endCell: 8, cellType: 1, cellBorder: "thin", field: "ITEM_UOM" },//type 1: còn lại
                { startCell: 9, endCell: 11, cellType: 1, cellBorder: "thin", field: "QTY" },//type 1: còn lại
                { startCell: 12, endCell: 14, cellType: 1, cellBorder: "thin", field: "U_PRICE" },//type 1: còn lại
                { startCell: 15, endCell: 16, cellType: 1, cellBorder: "thin", field: "NET_TR_AMT" },//type 1: còn lại
              ]

              signCell = { start: 13, mid: 14, end: 15 }
              signBoxCell = "L"
              signByCell = { start: 12, end: 16 }
              countFromEndDetailToSignBox = 9


              _sourceRow = 27
              _sourceRow_2 = 27
              _sourceRow_3 = 27
              headerRowCount = 26


              lastPageRowsHeight = 12
              break;
            case "01GTKT0/001":
              this.masterDataArray = []
              if (convertYn == "Y") {
                reportPath = 'report/60/95/einvoices_template/Daeyoung/Daeyoung_convert.xlsx'
                reportSheet = "Invoice CONVERT"
                this.masterDataArray.push(
                  { Cell: `E4`, Info: [`convert`], Type: 2 },
                  { Cell: `B38`, Info: [`CONVERT_NAME`], Type: 1 },
                  { Cell: `D39`, Info: [`CONVERT_DATE`], Type: 1 },
                )
              } else {
                reportPath = 'report/60/95/einvoices_template/Daeyoung/Daeyoung.xlsx'
                reportSheet = "Invoice NEW"
              }

              logos = [
                { start: 1, width: 1.68 * dpi, height: 0.28 * dpi, logoStartCount: 1, logoPath: "@/assets/images/einvoices_logo/Daeyoung/companylogo.png" }
              ]


              //mảng data của master
              this.masterDataArray.push(
                { Cell: `P3`, Info: [`TEMPLATECODE`], Type: 1 },
                { Cell: `P4`, Info: [`INVOICESERIALNO`], Type: 1 },
                { Cell: `P5`, Info: [`INVOICENUMBER`], Type: 1 },
                { Cell: `E5`, Info: [`dateString`], Type: 2 },
                { Cell: `E6`, Info: [`page`], Type: 2 },
                { Cell: `B43`, Info: [`footer`], Type: 2 },
                { Cell: `E9`, Info: [`SELLER_NAME`], Type: 1 },
                { Cell: `E10`, Info: [`SELLER_TAXCODE`], Type: 1 },
                { Cell: `E11`, Info: [`SELLER_ADDRESS`], Type: 1 },
                { Cell: `D13`, Info: [`SELLER_TEL`], Type: 1 },
                { Cell: `J13`, Info: [`SELLER_FAX`], Type: 1 },
                { Cell: `E14`, Info: [`SELLER_ACCOUNTNO`, `blankSpc`, `BUYER_BANK_NAME`], Type: 1 },
                { Cell: `E15`, Info: [`SELLER_ACCOUNTNO2`, `blankSpc`, `BANK_NM79`], Type: 1 },

                { Cell: `G18`, Info: [`BUYER`], Type: 1 },
                { Cell: `F19`, Info: [`BUYERLEGALNAME`], Type: 1 },
                { Cell: `E20`, Info: [`BUYERTAXCODE`], Type: 1 },
                { Cell: `D21`, Info: [`BUYERADDRESS`], Type: 1 },
                { Cell: `G22`, Info: [`PAYMENTMETHODCK`], Type: 1 },
                { Cell: `O22`, Info: [`CURRENCYCODEUSD`], Type: 1 },

                { Cell: `B28`, Info: [`lb_amount_trans`], Type: 2 },
                { Cell: `O28`, Info: [`amount_net`], Type: 2 },
                { Cell: `E29`, Info: [`TAXRATE`], Type: 1 },
                { Cell: `E30`, Info: [`amount_trans`], Type: 2 },
                { Cell: `O29`, Info: [`amount_vat`], Type: 2 },
                { Cell: `O30`, Info: [`amount_total`], Type: 2 },
                { Cell: `F31`, Info: [`read_price`], Type: 2 },
                { Cell: `E40`, Info: [`CQT_MCCQT_ID`], Type: 1 },
                { Cell: `M41`, Info: [`MATRACUU`], Type: 1 },

                { Cell: `L38`, Info: [`SIGNEDBY`], Type: 3 },
                { Cell: `L39`, Info: [`SIGNEDDATE`], Type: 3 },

              )
              // //"A", "B", "C", "D", "E", "F", "G", "H", "I", "J",  "K",  "L",  "M",  "N",  "O",  "P",  "Q",  "R",  "S",  "T",  "U",  "V",  "W",  "X",  "Y",  "Z",
              // //"1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26",
              //cấu trúc dòng detail
              detailCellFormat = [
                { startCell: 1, endCell: 2, cellType: 2, cellBorder: "thin", field: "STT" },//từ cell bắt đầu tới cell kết thúc, type 2: cell đầu tiên
                { startCell: 3, endCell: 7, cellType: 3, cellBorder: "thin", field: "ITEM_NAME" },//từ cell bắt đầu tới cell kết thúc, type 3: cell kế tiếp cell đầu tiên,
                { startCell: 8, endCell: 8, cellType: 1, cellBorder: "thin", field: "ITEM_UOM" },//type 1: còn lại
                { startCell: 9, endCell: 11, cellType: 1, cellBorder: "thin", field: "QTY" },//type 1: còn lại
                { startCell: 12, endCell: 14, cellType: 1, cellBorder: "thin", field: "U_PRICE" },//type 1: còn lại
                { startCell: 15, endCell: 16, cellType: 1, cellBorder: "thin", field: "NET_TR_AMT" },//type 1: còn lại
              ]

              signCell = { start: 13, mid: 14, end: 15 }
              signBoxCell = "L"
              signByCell = { start: 12, end: 16 }
              countFromEndDetailToSignBox = 9


              _sourceRow = 27
              _sourceRow_2 = 27
              _sourceRow_3 = 27
              headerRowCount = 26


              lastPageRowsHeight = 12
              break;
          }



          break;
        //////// *****************Daeyoung*********************\\\\\\\\\

        default: console.log("nothing happened!")
          break
      }
      try {
        if (this.masterDataArray.length > 0)
          resultExcel = await exceljs.ExcelBuilder(p_crt_by, einvoiceMasterData,
            einvoiceDetailData, _sourceRow, _sourceRow_2, _sourceRow_3,
            headerRowCount, countFromEndDetailToSignBox,
            lastPageRowsHeight, reportPath, reportSheet,
            signPath, cancelPath, bgPath, this.masterDataArray, detailCellFormat,
            logos, signCell, signBoxCell, signByCell, cancelYn, backgroundCell,
            backgroundWidth, backgroundHeight)

      } catch (error) {
        console.log(error)
      }

      return resultExcel
    } catch (error) {
      console.log(error)
    }

  }
  msThueCutter(msothueArray, taxCode, taxRow) {
    for (let i = 0; i < taxCode.length; i++) {
      const e = taxCode[i];
      this.masterDataArray.push({ Cell: `${msothueArray[i] + taxRow}`, Info: [e], Type: 2 }) //so thue
    }
  }
  // qrCodeImage(value) {
  //   let qrCodeImage = "abc";
  //   console.log("value",value)
  //   QRCode.toDataURL(value, function (err, url) {
  //     console.log("vô đây",value)
  //     if (err) {
  //       console.log("_generateQRCode error:", err);
  //     }
  //     console.log("url",url)
  //     qrCodeImage = url;
  //   })
  //   return qrCodeImage;
  // }

}

module.exports = EiExcelHandler