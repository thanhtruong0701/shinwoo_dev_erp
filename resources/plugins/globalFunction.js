import Vue from "vue";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import { locale } from "devextreme/localization";
import QRCode from "qrcode";
import bcrypt from "bcryptjs";
const CryptoJS = require("crypto-js");
export default (context, $store) => {
  const myFunction = {
    install(Vue, options) {
      Vue.prototype.$siteDomain = context.env.APP_URL;
      Vue.prototype.$webCashSiteDomain = "https://erp.webcashvietnam.com";
      Vue.prototype.testFunction = () => {
        console.log("Hello world");
        console.log(context);
      };
      Vue.prototype._uniqueID = () => {
        return uuidv4();
      };
      Vue.prototype._getQuarter = (p_month) => {
        if (p_month >= "01" && p_month <= "03") {
          return "I";
        } else if (p_month >= "04" && p_month <= "06") {
          return "II";
        } else if (p_month >= "07" && p_month <= "09") {
          return "III";
        } else if (p_month >= "10" && p_month <= "12") {
          return "IV";
        }
        return "Invalid quarter!";
      };
      // hàm này lấy giá trị lớn nhất của 1 thuộc tính có trong mảng
      Vue.prototype._maxValueArray = (array1, dataField1) => {
        let arr1 = [];
        let max = null;
        if (array1.length > 0) {
          array1.forEach((ee1) => {
            arr1.push(Number(ee1[dataField1]));
          });
          max = arr1.reduce((a, b) => Math.max(a, b), -Infinity);
        }
        return max;
      };
      Vue.prototype._maxDateOfMonth = (p_month) => {
        if (p_month.substr(4, 2) == "04" || p_month.substr(4, 2) == "06" || p_month.substr(4, 2) == "09" || p_month.substr(4, 2) == "11") {
          return "30";
        } else if (p_month.substr(4, 2) == "02") {
          if (p_month.substr(0, 4) % 4 == 0 || p_month.substr(0, 4) % 100 == 0) {
            return "29";
          } else {
            return "28";
          }
        } else {
          return "31";
        }
      };
      Vue.prototype._trim = (sent) => {
        let S = new String(sent);
        S = S.replace(/^\s+/, "");
        return S.replace(/\s+$/, "");
      };
      Vue.prototype._getArrayObject = (arr, p_elname, defaultParas) => {
        let i = 0;
        let arrData = [];
        while (i < arr.length) {
          let jsonRow = {};
          let str = arr[i];
          let arr2 = str.split("\t");
          for (let j = 0; j < p_elname.length; j++) {
            if (j < arr2.length) {
              let cell = arr2[j].replace("\r", "");
              let evalString = "jsonRow." + p_elname[j] + '="' + cell + '"';
              //console.log(evalString)
              eval(evalString);
            }
          }
          jsonRow._rowstatus = "i";
          jsonRow.PK = Date.now();
          let z = Object.assign(jsonRow, defaultParas);
          arrData.push(z);
          i++;
        }
        return arrData;
      };
      Vue.prototype._arrayMove = (arr, old_index, new_index) => {
        if (new_index >= arr.length) {
          var k = new_index - arr.length + 1;
          while (k--) {
            arr.push(undefined);
          }
        }
        arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
        return arr; // for testing
      };
      Vue.prototype.movable = () => {
        // make vuetify dialogs movable
        const d = {};
        document.addEventListener("mousedown", (e) => {
          const closestDialog = e.target.closest(".v-dialog.v-dialog--active");
          if (e.button === 0 && closestDialog != null && e.target.classList.contains("v-card__title")) {
            // element which can be used to move element
            d.el = closestDialog; // element which should be moved
            d.mouseStartX = e.clientX;
            d.mouseStartY = e.clientY;
            d.elStartX = d.el.getBoundingClientRect().left;
            d.elStartY = d.el.getBoundingClientRect().top;
            d.el.style.position = "fixed";
            d.el.style.margin = 0;
            d.oldTransition = d.el.style.transition;
            d.el.style.transition = "none";
            d.el.style.cursor = "grab";
          }
        });
        document.addEventListener("mousemove", (e) => {
          if (d.el === undefined) return;
          d.el.style.cursor = "grabbing";
          d.el.style.left = Math.min(Math.max(d.elStartX + e.clientX - d.mouseStartX, 0), window.innerWidth - d.el.getBoundingClientRect().width) + "px";
          d.el.style.top = Math.min(Math.max(d.elStartY + e.clientY - d.mouseStartY, 0), window.innerHeight - d.el.getBoundingClientRect().height) + "px";
        });
        document.addEventListener("mouseup", () => {
          if (d.el === undefined) return;
          d.el.style.transition = d.oldTransition;
          d.el.style.cursor = "default";
          d.el = undefined;
        });
        /* setInterval(() => { 
														// prevent out of bounds
														const dialog = document.querySelector(".v-dialog.v-dialog--active");
														if (dialog === null) return;
														dialog.style.left = Math.min(parseInt(dialog.style.left), window.innerWidth - dialog.getBoundingClientRect().width) + "px";
														dialog.style.top = Math.min(parseInt(dialog.style.top), window.innerHeight - dialog.getBoundingClientRect().height) + "px";
													}, 100); */
      };
      Vue.prototype.redirect = (url) => {
        window.location.href = url;
      };
      Vue.prototype._sleep = async (ms) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
      };
      Vue.prototype.vn_to_en = (str) => {
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/đ/g, "d");
        str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
        str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
        str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
        str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
        str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
        str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
        str = str.replace(/Đ/g, "D");

        str = str.replace(/\s+/g, " ");

        return str.trim();
      };
      Vue.prototype.nam_nhuan = (year) => {
        if (year % 4 != 0) return false;
        if (year % 100 != 0) return false;
        if (year % 400 != 0) return false;
        return true;
      };
      Vue.prototype.dayInYear = (year) => {
        if (Vue.prototype.nam_nhuan(year)) return 366;
        return 365;
      };
      Vue.prototype.dayAfterYear = (year) => {
        let totalDay = 0;
        for (let i = 1; i <= year; i++) {
          totalDay += Vue.prototype.dayInYear(i);
        }
        return totalDay;
      };
      Vue.prototype.dayInMonth = (month, year) => {
        switch (month) {
          case 4:
          case 6:
          case 9:
          case 11:
            return 30;
          case 2: {
            if (Vue.prototype.nam_nhuan(year)) return 29;
            return 28;
          }
          default:
            return 31;
        }
      };
      Vue.prototype.dayBeforeMonth = (month, year) => {
        let day = 0;
        for (let i = 1; i < month; i++) {
          day += Vue.prototype.dayInMonth(i, year);
        }
        return day;
      };
      Vue.prototype.TotalDayInCurrentYear = (day, month, year) => {
        return Vue.prototype.dayAfterYear(year) + Vue.prototype.dayBeforeMonth(month, year) + day;
      };
      Vue.prototype.dayOfTheWeek = (day, month, year) => {
        switch (Vue.prototype.TotalDayInCurrentYear(day, month, year) % 7) {
          case 0:
            return "CN";
          case 1:
            return "T2";
          case 2:
            return "T3";
          case 3:
            return "T4";
          case 4:
            return "T5";
          case 5:
            return "T6";
          default:
            return "T7";
        }
      };
      Vue.prototype.checkCurrentDate = (day) => {
        const date = new Date();
        const current_time = Date.parse(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`);
        day = Date.parse(day);
        if (day != current_time) return false;
        return true;
      };
      Vue.prototype._CurrentDate = (separater = "") => {
        const date = new Date();
        const yyyy = date.getFullYear();
        let mm = date.getMonth() + 1;
        let dd = date.getDate();
        if (mm < 10) {
          mm = "0" + mm;
        }
        if (dd < 10) {
          dd = "0" + dd;
        }
        return yyyy + separater + mm + separater + dd;
      };
      Vue.prototype.checkDayIn7 = (day) => {
        const date = new Date();
        day = parseInt(day);
        const currentDate = parseInt(date.getDate());
        if (day + 7 < currentDate) return false;
        return true;
      };
      Vue.prototype._formatYYYYMMDD = (_date, _separater = "") => {
        let yyyy = _date.getFullYear();
        let mm = _date.getMonth() + 1;
        let dd = _date.getDate();

        if (mm < 10) {
          mm = "0" + mm;
        }
        if (dd < 10) {
          dd = "0" + dd;
        }
        return yyyy + _separater + mm + _separater + dd;
      };
      Vue.prototype._formatYYYYMM = (_date, _separater = "") => {
        let yyyy = _date.getFullYear();
        let mm = _date.getMonth() + 1;

        if (mm < 10) {
          mm = "0" + mm;
        }
        return yyyy + _separater + mm;
      };
      Vue.prototype._hasValue = (value) => {
        if (typeof value == "number") return true;
        else if (value == "" || value == null || value == undefined || value == "null") return false;
        if (typeof value == "object") {
          for (var i = 0; i < value.length; i++) {
            if (value[i] == "" || value[i] == null || value[i] == undefined || value[i] == "null") {
              return false;
            }
          }
        } else if (typeof value == "string") {
          if (value == "" || value == null || value == undefined || value == "null") {
            return false;
          }
        }
        return true;
      };
      Vue.prototype._arrayBufferToBase64 = (buffer) => {
        let binary = "";
        let bytes = new Uint8Array(buffer);
        let len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
      };
      Vue.prototype._base64ToBlob = (b64Data, contentType = "", sliceSize = 512) => {
        let byteCharacters = window.atob(b64Data.split(",")[1]);
        let byteArrays = [];
        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
          let slice = byteCharacters.slice(offset, offset + sliceSize);
          let byteNumbers = new Array(slice.length);
          for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }
          let byteArray = new Uint8Array(byteNumbers);
          byteArrays.push(byteArray);
        }
        let blob = new Blob(byteArrays, { type: contentType });
        return blob;
      };
      Vue.prototype._formatCurrency = (value, prefit, precision) => {
        /* Return value number with format
					value: number input
					prefit: prefit, it like description for value input
					precision: value round number
					ex: formatCurrency(123456789,'VND',2) => VND 123,456,789.00 */

        /* return (prefit + "" + value.toFixed(precision).replace(/./g, function(c, i, a) {
							return i > 0 && c !== "." && (a.length - i) % 3 === 0 ? "," + c : c;
					})); */
        let n = parseFloat(value).toFixed(precision).toString();
        if (precision > 0) {
          let n2 = n.substr(0, n.indexOf("."));
          let n3 = n.substr(n.indexOf(".") + 1, n.length - 1);
          let z = n2.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "." + n3;
          return prefit + "" + z;
        } else {
          return prefit + "" + n.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
      };
      Vue.prototype._formatNumber = (value, precision) => {
        if (value == 0 || value == "0") return 0;
        if (value == "" || !value) return "";
        if (parseInt(precision) >= 4) precision = 3;
        let result = parseFloat(value)
          .toFixed(parseInt(precision))
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        // let res1 = new Intl.NumberFormat("en-US").format(parseFloat(value).toFixed(parseInt(precision)))
        return result;

        // var myArr = value.toString().split(".");
        // var result = parseFloat(myArr[0])
        //     .toFixed(0)
        //     .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        // if (myArr.length != 2) {
        //     return result
        // }

        // let isDecimal = "0." + myArr[1];
        // var result1 = parseFloat(isDecimal)
        //     .toFixed(precision);
        // var myArr1 = result1.toString().split(".");
        // if(myArr1[1] == undefined)
        // {
        //      return Number(result)  + Number(result1);
        // }
        // return result + "." + myArr1[1];
      };
      Vue.prototype._formatNumber2 = (value, precision) => {
        if (value == 0 || value == "0") return 0;

        if (value == "" || !value) return "";

        var myArr = value.toString().split(".");
        var result = parseFloat(myArr[0])
          .toFixed(0)
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        if (myArr.length != 2) {
          return result;
        }

        let isDecimal = "0." + myArr[1];
        var result1 = parseFloat(isDecimal).toFixed(precision);
        var myArr1 = result1.toString().split(".");
        return result + "." + myArr1[1];
      };
      Vue.prototype._initObject = (params, tco_company_pk) => {
        let rtn = { PK: Vue.prototype._uniqueID(), _rowstatus: "i" };
        if (tco_company_pk) {
          rtn.TCO_COMPANY_PK = tco_company_pk;
        }
        params.forEach((x) => {
          if (!Object.keys(rtn).includes(x)) {
            rtn[x] = null;
          }
        });
        return rtn;
      };
      Vue.prototype._updateLocale = (lang) => {
        switch (lang) {
          case "ENG":
            locale("en");
            break;
          case "KOR":
            locale("ko");
            break;
          case "VIE":
            locale("vi");
            break;
          default:
            locale("en");
            break;
        }
      };
      Vue.prototype._initArray = (params) => {
        let rtn = { _rowstatus: "" };
        params.forEach((x) => {
          if (!Object.keys(rtn).includes(x)) {
            rtn[x] = null;
          }
        });
        return rtn;
      };
      Vue.prototype._plusdate = (dates = "", separater = "", type = "", plus = 0) => {
        var date = dates;
        if (dates == "") {
          date = new Date();
        }
        return moment(date)
          .add(plus, type)
          .format("YYYY" + separater + "MM" + separater + "DD");
      };
      Vue.prototype._isNumeric = (input) => {
        var RE = /^-{0,1}\d*\.{0,1}\d+$/;
        return RE.test(input);
      };
      Vue.prototype._getImageUrlFromBuffer = (buffer) => {
        const url = `data:image/png;base64,${Vue.prototype._arrayBufferToBase64(buffer.data)}`;
        return url;
      };
      Vue.prototype._getImageUrlFromBase64 = (base64) => {
        const url = `data:image/png;base64,${base64}`;
        return url;
      };
      Vue.prototype._dateStringFromFormat = (dateStr, format = "DD/MM/YYYY") => {
        const date = moment(dateStr || Date.now());
        return date.isValid() ? date.format(format) : dateStr;
      };
      Vue.prototype._splitText = (value, index) => {
        if (value.length < index) {
          return value;
        }
        return [value.substring(0, index)].concat(Vue.prototype._splitText(value.substring(index), index));
      };
      Vue.prototype._stringToTime = (string, format = "HH:mm:ss") => {
        const time = moment(string, "HH:mm:ss").format(format);
        return time;
      };
      Vue.prototype._getElementWH = (elementID) => {
        const element = $(`#${elementID}`)[0];
        return {
          width: element.offsetWidth,
          height: element.offsetHeight,
        };
      };
      Vue.prototype._num2VieText = (amount) => {
        if (amount == 0) return "Không đồng";

        let ones = ["", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];
        let tens = ["", "mười", "hai mươi", "ba mươi", "bốn mươi", "năm mươi", "sáu mươi", "bảy mươi", "tám mươi", "chín mươi"];
        let scales = ["", "nghìn", "triệu", "tỷ"];

        let words = "";

        // Lấy phần nguyên và phần thập phân
        let integerPart = Math.floor(amount);
        let decimalPart = Math.round((amount - integerPart) * 100);

        // Đổi phần nguyên thành chữ
        let scaleIndex = 0;
        while (integerPart > 0) {
          let chunk = integerPart % 1000;
          if (chunk > 0) {
            let chunkWords = "";
            if (chunk < 100) {
              chunkWords = tens[Math.floor(chunk / 10)] + " " + (chunk % 10 == 5 ? "lăm" : ones[chunk % 10]);
            } else {
              if (chunk % 100 == 0) {
                chunkWords = ones[Math.floor(chunk / 100)] + " trăm";
              } else {
                chunkWords = ones[Math.floor(chunk / 100)] + " trăm " + (Math.floor((chunk % 100) / 10) == 0 ? "lẻ" : tens[Math.floor((chunk % 100) / 10)]) + " " + (chunk % 10 == 5 ? "lăm" : ones[chunk % 10]);
              }
            }
            words = chunkWords + " " + scales[scaleIndex] + " " + words;
          }
          integerPart = Math.floor(integerPart / 1000);
          scaleIndex++;
        }

        // Nếu có phần thập phân, đổi thành chữ
        if (decimalPart > 0) {
          words += "phẩy ";
          if (decimalPart < 10) {
            words += ones[decimalPart] + " ";
          } else {
            words += tens[Math.floor(decimalPart / 10)] + " " + (decimalPart % 10 == 5 ? "lăm" : ones[decimalPart % 10]) + " ";
          }
          words += "đồng ";
        } else {
          words += "đồng";
        }

        words = words.replace("  ", " ").replace("   ", " ").trim();

        return words.charAt(0).toUpperCase() + words.slice(1);
      };
      Vue.prototype._num2EngText = (s, ccy) => {
        //process minus case
        var minus = "";
        if (s.substring(0, 1) == "-") {
          s = s.replace(/,/g, "").trim();
          minus = "Minus ";
        }
        var rtnf = "";
        var Dollars = "";
        var Cents = "";
        var strTemp = "";
        var strPlace = [];
        var s1 = "";
        var strTmp = "";
        var iTmp = 0;
        strPlace[1] = " ";
        strPlace[2] = " Thousand ";
        strPlace[3] = " Million ";
        strPlace[4] = " Billion ";
        strPlace[5] = " Trillion ";
        s = s.replace(/,/g, "").trim();
        var strTens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
        var strTens2 = ["", "", "Twenty ", "Thirty ", "Forty ", "Fifty ", "Sixty ", "Seventy ", "Eighty ", "Ninety "];
        var Digits = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
        var chk_s = s;
        chk_s = chk_s.replace(".", "/");
        if (chk_s.search("/") != -1) {
          s1 = s.substring(s.indexOf(".") + 1);
          s = s.substring(0, s.indexOf("."));
        }
        var iCount = 1;
        while (s != "") {
          strTmp = "";
          if (s.length < 3) {
            s = Vue.prototype._formatted_string("000", s, "l");
          }
          strTemp = s.substring(s.length - 3);
          //Read strTemp
          if (strTemp.substring(0, 1) != "0") {
            //Read Hundred
            iTmp = Number(strTemp.substring(0, 1));
            strTmp = Digits[iTmp] + " Hundred ";
          }
          if (strTemp.substring(1, 2) != "0") {
            //Get Tens
            iTmp = Number(strTemp.substring(1, 2));
            if (strTemp.substring(1, 2) == "1") {
              iTmp = Number(strTemp.substring(1, 3)) - 10;
              strTmp = strTmp + strTens[iTmp];
            } else {
              iTmp = Number(strTemp.substring(1, 2));
              strTmp = strTmp + strTens2[iTmp];
              iTmp = Number(strTemp.substring(2, 3));
              strTmp = strTmp + Digits[iTmp];
            }
          } else {
            iTmp = Number(strTemp.substring(2, 3));
            strTmp = strTmp + Digits[iTmp];
          }
          //After Read
          if (strTmp != "") {
            Dollars = strTmp + strPlace[iCount] + Dollars;
          }
          if (s.length > 3) {
            s = s.substring(0, s.length - 3);
          } else {
            s = "";
          }
          iCount = iCount + 1;
        }
        //Read Cents
        if (s1 != "" && ccy == "USD") {
          s1 = s1 + "00";
          s1 = s1.substring(0, 2);
          if (s1.substring(0, 1) == "1") {
            iTmp = Number(s1) - 10;
            Cents = strTens[iTmp];
          } else {
            iTmp = Number(s1.substring(0, 1));
            Cents = strTens2[iTmp];
            iTmp = Number(s1.substring(1, 2));
            Cents = Cents + Digits[iTmp];
          }
        }
        if (ccy == "USD") {
          switch (Dollars) {
            case "":
              Dollars = "Zero Dollars";
              break;
            case "One":
              Dollars = "One Dollar";
              break;
            default:
              Dollars = Dollars + " Dollars";
              break;
          }
          switch (Cents) {
            case "":
              break;
            case "One":
              Cents = " and One Cent";
              break;
            default:
              Cents = " and " + Cents + " Cents";
              break;
          }
        }
        if (ccy == "VND") {
          switch (Dollars) {
            case "":
              Dollars = "Zero Viet Nam Dong";
              break;
            default:
              Dollars = Dollars + " Viet Nam Dong";
              break;
          }
          Cents = "";
        }
        rtnf = minus + Dollars + Cents; //process minus case
        return rtnf.replace(/\s{2,}/g, " ");
      };
      Vue.prototype._formatted_string = (pad, user_str, pad_pos) => {
        if (user_str == undefined || user_str == "" || user_str == "null" || user_str == null) return pad;
        if (pad_pos == "l") {
          return (pad + user_str).slice(-pad.length);
        } else {
          return (user_str + pad).substring(0, pad.length);
        }
      };
      Vue.prototype._CurrentYMD = (type = "YYYYMMDD", separater = "", _getDate = "") => {
        const date = new Date();
        const yyyy = date.getFullYear();
        let mm = date.getMonth() + 1;
        let dd = date.getDate();
        if (mm < 10) {
          mm = "0" + mm;
        }
        if (dd < 10) {
          dd = "0" + dd;
        }
        if (_getDate == "start_year") {
          mm = "01";
          dd = "01";
        }
        if (_getDate == "end_year") {
          mm = "12";
          dd = "31";
        }
        var YYYYMMDD = yyyy + separater + mm + separater + dd;
        var YYYYMM = yyyy + separater + mm;
        var YYYY = yyyy;
        var StartYear = yyyy + separater + "01" + separater + "01";
        var EndYear = yyyy + separater + "12" + separater + "31";
        var rvalue = type == "Y" ? YYYY : type == "YM" ? YYYYMM : type == "SY" ? StartYear : type == "EY" ? EndYear : YYYYMMDD;
        return rvalue;
      };
      (Vue.prototype._calculateHeight = (height, percentage) => {
        return Math.floor((height * percentage) / 100);
      }),
        (Vue.prototype._splitRgbValues = (rgbString) => {
          var arr = [];
          rgbString.replace(/[\d+\.]+/g, function (v) {
            arr.push(parseFloat(v));
          });
          return arr;
        });
      Vue.prototype._parseColor = (color) => {
        const arr = Vue.prototype.__splitRgbValues(color);
        return "#" + arr.slice(0, 3).map(Vue.prototype._toHex).join("");
        /* return {
						hex: "#" + arr.slice(0, 3).map(Vue.prototype._toHex).join(""),
						opacity: arr.length == 4 ? arr[3] : 1
					}; */
      };
      Vue.prototype._toHex = (int) => {
        var hex = int.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
      };
      Vue.prototype._generateQRCode = (value) => {
        let qrCodeImage = "";
        QRCode.toDataURL(value, function (err, url) {
          if (err) {
            console.log("_generateQRCode error:", err);
          }
          qrCodeImage = url;
        });
        return qrCodeImage;
        /* try {
					if(!value) return;
					return await QRCode.toDataURL(value);
				} catch (err) {
					console.error("_generateQRCode error:", err);
					return;
				} */
      };
      Vue.prototype._getDiffBetweenDateTime = (startDateTime, endDateTime, diffType = "days") => {
        /* diffType bao gồm có: years, months, weeks, days, hours, minutes, và seconds */
        let format = "";
        if (diffType === "hours" || diffType === "hours" || diffType === "hours") {
          format = "YYYYMMDDHHmmss";
        }
        format = "YYYYMMDD";
        const diff = moment(endDateTime, format).diff(moment(startDateTime, format), diffType);
        return diff;
      };
      (Vue.prototype._chunkArray = (array, size) => {
        return _.chunk(array, size);
      }),
        (Vue.prototype._getInnerDimensions = (node) => {
          var computedStyle = getComputedStyle(node);

          let width = node.clientWidth; // width with padding
          let height = node.clientHeight; // height with padding

          width -= parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight);
          height -= parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom);

          return { width, height };
        });
      Vue.prototype._dowloadFile = (_fileInfo) => {
        if (_fileInfo) {
          try {
            const _data = _fileInfo.FILE_CONTENT.data;
            let _fileBase64String = Vue.prototype._arrayBufferToBase64([..._data]);
            let _extFile = "";
            switch (_fileInfo.FILE_EXT) {
              case "xlsx":
                _extFile = "application/octet-stream";
                break;
              case "docx":
                _extFile = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
                break;
              case "img":
                _extFile = "image/png";
                break;
              case "pdf":
                _extFile = "application/pdf";
                break;
            }
            let _convertFile = "data:" + _extFile + ";base64," + _fileBase64String;
            let _url = _convertFile;
            var tag_a = document.createElement("a");
            document.body.appendChild(tag_a);
            tag_a.style = "display: none";
            tag_a.href = _url;
            tag_a.download = _fileInfo.FILE_NAME;
            tag_a.click();
            window.URL.revokeObjectURL(_url);
            tag_a.remove();
          } catch (e) {
            console.error("download file error", e);
          }
        }
        return true;
      };
      Vue.prototype._reRenderComponent = () => {
        let { componentKey } = context?.store?.state?.auth;
        context.store.dispatch("auth/updateComponentKey", !componentKey ? Date.now() : componentKey + 1);
      };
      Vue.prototype._hash = () => {
        return {
          make: async (value, config = 10) => {
            let rounds = null;
            /**
             * In order to be back compatible, we have to accept strings and numbers
             * as config rounds.
             */
            if (typeof config === "string" || typeof config === "number") {
              rounds = Number(config);
            } else {
              rounds = config.rounds || this.config.rounds || 10;
            }

            return new Promise(function (resolve, reject) {
              bcrypt.hash(value, rounds, function (error, hash) {
                if (error) {
                  return reject(error);
                }
                resolve(hash);
              });
            });
          },
          verify: async (value, hash) => {
            return new Promise(function (resolve, reject) {
              bcrypt.compare(value, hash, function (error, response) {
                if (error) {
                  return resolve(false);
                }
                resolve(response);
              });
            });
          },
        };
      };
      Vue.prototype._validateDay = (_yyyymmdd) => {
        if (Number(_yyyymmdd) > 0 && _yyyymmdd.length == 8) {
          let l_date = moment(_yyyymmdd, "YYYYMMDD");
          return l_date.isValid();
        }
        return false;
      };
      Vue.prototype._printPreview = async (that, reportParams, url, fileName) => {
        let isValid = false;
        let findPreviewComponent = (component) => {
          let refs = component.$refs;
          let _component = null;
          if (refs && Object.keys(refs).includes("previewReportDialog")) {
            _component = refs.previewReportDialog;
          } else {
            if (component.$parent) {
              _component = findPreviewComponent(component.$parent);
            }
          }
          return _component;
        };

        let _component = findPreviewComponent(that);

        if (_component != null) {
          _component.customFileName = fileName;
          if (reportParams != null) {
            // call api
            _component.params = reportParams;
            _component.url = null;
          } else {
            if (url != null) {
              _component.params = null;
              _component.url = url;
            }
          }

          let _isFileValid = await _component.get();
          if (_isFileValid) {
            isValid = true;
            _component.show();
          }
        } else {
          // if(reportParams != null) { // call api
          //   let _params = {...reportParams, preview: "Y"};
          //   let res = await that.$axios.$get('/dso/makereport', { responseType: "blob", params: _params });
          //   if(res && res.size > 0) {
          //     isValid = true;
          //   }
          // } else {
          //   if(url != null) {
          //     isValid = true;
          //   }
          // }
        }

        return isValid;
      };
      (Vue.prototype._findDuplicates = (array, keys, keysOnly = false) => {
        if (!array || array.length <= 0) return [];

        let duplicates = [];
        if (typeof array[0] == "object") {
          let _keys = keys && keys.length > 0 ? keys : Object.keys(array[0]);

          duplicates = array.filter((item, index) => {
            let duplicateIdx = array.findIndex((_item, idx) => {
              if (idx == index) return false;
              let item1 = {};
              let item2 = {};

              _keys.forEach((key) => {
                item1[key] = item[key];
                item2[key] = _item[key];
              });

              return JSON.stringify(item1) == JSON.stringify(item2);
            });
            return duplicateIdx >= 0;
          });

          if (keysOnly) {
            duplicates = duplicates.map((x) => {
              let item = {};
              _keys.forEach((key) => {
                item[key] = x[key];
              });
              return item;
            });

            let _duplicates = [];
            for (let item of duplicates) {
              let idx = _duplicates.findIndex((_item) => {
                let item1 = {};
                let item2 = {};

                _keys.forEach((key) => {
                  item1[key] = item[key];
                  item2[key] = _item[key];
                });

                return JSON.stringify(item1) == JSON.stringify(item2);
              });

              if (idx < 0) {
                _duplicates.push(item);
              }
            }

            duplicates = _duplicates;
          }
        } else {
          duplicates = array.filter((item, index) => arr.indexOf(item) !== index);

          if (keysOnly) {
            duplicates = Array.from(new Set(Array.from(duplicates, (x) => x)));
          }
        }
        return duplicates;
      }),
        (Vue.prototype._groupByArray = (array, key) => {
          return _.chain(array)
            .sortBy(key)
            .groupBy(key)
            .map((item) => item)
            .value();
        }),
        (Vue.prototype._randomRGB = () => {
          var x = Math.floor(Math.random() * 256);
          var y = Math.floor(Math.random() * 256);
          var z = Math.floor(Math.random() * 256);
          return "rgb(" + x + "," + y + "," + z + ")";
        }),
        (Vue.prototype._getNumberOfWeeksInMonth = () => {
          const startWeek = moment().startOf("month").isoWeek();
          const endWeek = moment().endOf("month").isoWeek();
          return endWeek - startWeek + 1;
        });
      Vue.prototype._daysInMonth = (month) => {
        const result = moment(month, "YYYY-MM").daysInMonth();
        return result;
      };
      (Vue.prototype._removeDuplicates = (array, keys = []) => {
        return array.filter((v, i, a) => a.findIndex((v2) => keys.every((k) => v2[k] === v[k])) === i);
      }),
        (Vue.prototype._groupBy = (array, f) => {
          var groups = {};
          array.forEach(function (o) {
            var group = JSON.stringify(f(o));
            groups[group] = groups[group] || [];
            groups[group].push(o);
          });
          return Object.keys(groups).map(function (group) {
            return groups[group];
          });
        }),
        (Vue.prototype._hashRPAmake = (value) => {
          // var RPA_KEY_TEXT  = 'WebCashGw@2023!gVas#'
          var RPA_KEY = "U2FsdGVkX1+g2BhXwHhmOzO38YOvVTH7C99o3MTn7VW01laBWoLubsUXfQuD5CDx?";
          var bytes = CryptoJS.AES.encrypt(value, RPA_KEY);
          var encryptedData = bytes.toString();
          return encryptedData;
        }),
        (Vue.prototype._hashRPAverify = (value) => {
          // var RPA_KEY_TEXT  = 'WebCashGw@2023!gVas#'
          var RPA_KEY = "U2FsdGVkX1+g2BhXwHhmOzO38YOvVTH7C99o3MTn7VW01laBWoLubsUXfQuD5CDx?";
          var bytes = CryptoJS.AES.decrypt(value, RPA_KEY);
          var decryptedData = bytes.toString(CryptoJS.enc.Utf8);
          return decryptedData;
        }),
        (Vue.prototype._blobFileToBase64 = (_blobData, _type = "Base64") => {
          // file reponse form excel or pdf report
          try {
            // var f = _blobData; // FileList object
            // var reader = new FileReader();
            // // Closure to capture the file information.
            // reader.onload = (function(theFile) {
            // 	return function(e) {
            // 	var binaryData = e.target.result;
            // 	// console.log('[vng-154/dvg] > file: globalFunction.js:757 > returnfunction > binaryData:', binaryData);
            // 	//Converting Binary Data to base 64
            // 	var base64String = window.btoa(binaryData);
            // 	// console.log('[vng-154/dvg] > file: globalFunction.js:760 > returnfunction > base64String:', base64String);
            // 	let _rtnData = _type=="Base64"?binaryData:_type=="Base64String"?base64String:"";
            // 	return _rtnData;
            // 	//showing file converted to base64
            // };
            // })(f);
            // // Read in the image file as a data URL.
            // reader.readAsDataURL(f);
            // var _rtnbase64String = null;
            // var _readerBase64File = new FileReader();
            // _readerBase64File.readAsDataURL(_blobData);
            // _readerBase64File.onloadend = function async () {
            // 	_rtnbase64String = _readerBase64File.result;
            // 	//console.log('[vng-154/dvg] > file: globalFunction.js:756 > install > _rtnbase64String:', _rtnbase64String);
            // 	return _rtnbase64String;
            // };
            // return '';

            return new Promise((resolve, reject) => {
              let _readerBase64File = new FileReader();
              _readerBase64File.onload = () => {
                resolve(_readerBase64File.result);
              };
              _readerBase64File.onerror = reject;
              _readerBase64File.readAsDataURL(_blobData);
            });
          } catch (e) {
            console.info("Error _blobFileToBase64:[", e + "]");
            return "";
          }
        }),
        (Vue.prototype._base64StringToBlobFile = (_base64String = "", _typeFile = "application/pdf") => {
          const byteArray = Uint8Array.from(
            atob(_base64String)
              .split("")
              .map((char) => char.charCodeAt(0))
          );
          return new Blob([byteArray], { type: _typeFile });
        }),
        (Vue.prototype._formatStringToXML = (xml) => {
          let formatted = "";
          let reg = /(>)(<)(\/*)/g;
          xml = xml.replace(reg, "$1\r\n$2$3");
          let pad = 0;
          jQuery.each(xml.split("\r\n"), function (index, node) {
            let indent = 0;
            if (node.match(/.+<\/\w[^>]*>$/)) {
              indent = 0;
            } else if (node.match(/^<\/\w/)) {
              if (pad != 0) {
                pad -= 1;
              }
            } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
              indent = 1;
            } else {
              indent = 0;
            }

            let padding = "";
            for (let i = 0; i < pad; i++) {
              padding += "  ";
            }

            formatted += padding + node + "\r\n";
            pad += indent;
          });

          return formatted;
        }),
        (Vue.prototype._nullToEmpty = (val) => {
          if (val == "null" || val == undefined || val == null) {
            return "";
          }
          return val;
        });
    },
  };

  Vue.use(myFunction);
};
