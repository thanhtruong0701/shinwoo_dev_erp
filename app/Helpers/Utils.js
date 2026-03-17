"use strict";

const moment = require("moment");
const Helpers = use("Helpers");
const Jimp = use("jimp");
const fs = use("fs");
const exec = require("child_process").exec;
const makeDir = use("make-dir");
const md5 = require("crypto-js/md5");
const pdf = require("html-pdf");
const nodemailer = require("nodemailer");
const libre = require("libreoffice-convert");
libre.convertAsync = require("util").promisify(libre.convert);
const qrcode = use("qrcode");
const { authenticator, totp, hotp } = require("otplib");
const { Canvas } = require("canvas");
const jsBarcode = require('jsbarcode');
const canvas = new Canvas();

class Utils {
  constructor() {
    this.Env = use("Env");
    this.ROOT_DIR_FILES = this.Env.get("ROOT_DIR_FILES");
    this.ROOT_DIR_FILE1 = this.Env.get("ROOT_DIR_FILE1");
    this.Database = use("Database");
    this.fileLogger = use("Logger");
    this.Redis = use("Redis");
  }
  async createBarcode2Line(p_text, p_display_value = true, p_height = 60) {
    jsBarcode(canvas, p_text, {
      format: 'CODE128', // Use Code 128 format
      font: "Segoe UI",
      fontOptions: "bold",
      height: p_height,
      displayValue: p_display_value
    });
    let imgBase64 = await new Promise((resolve, reject) => {
      canvas.toDataURL('image/png', (err, imgBase64) => {
        if (err) {
          reject(reject);
          return;
        }
        resolve(imgBase64);
      });
    });
    return imgBase64
  }
  async setPdfPassword(options) {
    const isWin = process.platform === "win32";
    const args = [
      "--encrypt",
      options.password,
      options.password,
      options.keyLength,
      "--print=none",
      "--",
      options.input,
      options.output,
    ];
    //console.log(args)
    let pros = new Promise((resolve, reject) => {
      if (isWin) {
        exec(
          "c:\\qpdf\\bin\\qpdf.exe " + args.join(" "),
          function (error, stdout, stderr) {
            if (error) {
              console.error(error);
              resolve(stderr);
              return;
            }
            resolve(stdout);
          }
        );
      } else {
        exec("qpdf " + args.join(" "), function (error, stdout, stderr) {
          if (error) {
            console.error(error);
            return;
          }
          resolve(stdout);
        });
      }
    });
    await pros;
    return options.output;
  }
  async smtpSendMail(mailOptions, p_smtp_info) {
    return new Promise((resolve, reject) => {
      let transporter = nodemailer.createTransport(p_smtp_info);
      transporter.sendMail(mailOptions, async function (error, info) {
        if (error) {
          console.error(
            `error send mail to ${mailOptions.to} :` + error.message
          );
          resolve(false);
        } else {
          console.log("Email sent to: " + mailOptions.to);
          resolve(true);
        }
      });
    });
  }
  async copyFile(source, target) {
    var rd = fs.createReadStream(source);
    var wr = fs.createWriteStream(target);
    try {
      return await new Promise(function (resolve, reject) {
        rd.on("error", reject);
        wr.on("error", reject);
        wr.on("finish", resolve);
        rd.pipe(wr);
      });
    } catch (error) {
      rd.destroy();
      wr.end();
      throw error;
    }
  }
  async excelToPdf(inputPath) {
    try {
      const isWin = process.platform === "win32";
      const outputPath = inputPath.replace(
        inputPath,
        (inputPath.lastIndexOf(".") > -1
          ? inputPath.substring(0, inputPath.lastIndexOf("."))
          : inputPath) + ".pdf"
      );
      if (isWin) {
        const xlsxBuf = await fs.readFileSync(inputPath);
        // Convert it to pdf format with undefined filter (see Libreoffice docs about filter)
        let pdfBuf = await libre.convertAsync(xlsxBuf, ".pdf", undefined);
        await fs.writeFileSync(outputPath, pdfBuf);
      } else {
        let pros = new Promise((resolve, reject) => {
          exec(
            'unoconv -f pdf "' + inputPath + '"',
            function (error, stdout, stderr) {
              if (error) {
                console.error(error);
                return;
              }
              resolve(stdout);
            }
          );
        });
        await pros;
      }
      return outputPath;
    } catch (e) {
      console.error(e);
    }
  }

  async convertFile(inputPath, convert) {
    try {
      const isWin = process.platform === "win32";
      const outputPath = inputPath.replace(
        inputPath,
        (inputPath.lastIndexOf(".") > -1
          ? inputPath.substring(0, inputPath.lastIndexOf("."))
          : inputPath) + "." + convert
      );

      const xlsxBuf = await fs.readFileSync(inputPath);
      // Convert it to pdf format with undefined filter (see Libreoffice docs about filter)
      let pdfBuf = await libre.convertAsync(xlsxBuf, "." + convert, undefined);
      await fs.writeFileSync(outputPath, pdfBuf);

      return outputPath;
    } catch (e) {
      throw e;
    }
  }

  moveFile(fromPath, toPath, callback) {
    let _copyFile = () => {
      let readStream = fs.createReadStream(fromPath);
      let writeStream = fs.createWriteStream(toPath);

      readStream.on('error', callback);
      writeStream.on('error', callback);

      readStream.on('close', function () {
        fs.unlink(fromPath, callback);
      });

      readStream.pipe(writeStream);
    };

    fs.rename(fromPath, toPath, function (data) {
      if (data) {
        if (data.code == "EXDEV") {
          _copyFile();
        } else {
          callback(true);
        }
      } else {
        callback(true);
      }

    });
  }

  async exportBigExcelFile(p_procedure, p_para) {
    const isWin = process.platform === "win32";
    let file_path = "";
    const unixtime = new Date().getTime();
    const file_name = `report_${unixtime}.xlsx`;
    let pros = new Promise((resolve, reject) => {
      if (isWin) {
        file_path = `C:\\excelwriter\\excelfiles\\report_${unixtime}.xlsx`;
        const arg = p_procedure + ' "' + p_para + '" ' + file_name;
        console.log("/srv/excelwriter/ExcelWriter " + arg);
        exec(
          "C:\\excelwriter\\ExcelWriter.exe " + arg,
          function (error, stdout, stderr) {
            if (error) {
              console.error(error);
              file_path = "Failed export excel file";
              return;
            }
            resolve(stdout);
          }
        );
      } else {
        file_path = `/srv/excelwriter/excelfiles/report_${unixtime}.xlsx`;
        const arg = p_procedure + ' "' + p_para + '" ' + file_name;
        console.log("/srv/excelwriter/ExcelWriter " + arg);
        exec(
          "/srv/excelwriter/ExcelWriter " + arg,
          function (error, stdout, stderr) {
            if (error) {
              console.error(error);
              file_path = "Failed export excel file";
              return;
            }
            resolve(stdout);
          }
        );
      }
    });
    await pros;
    return file_path;
  }
  createPDF(html, options) {
    return new Promise((resolve, reject) => {
      pdf.create(html, options).toFile((err, res) => {
        if (err !== null) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }
  md5(text) {
    text = text.toString();
    return md5(text).toString();
  }
  async InsertTable(table, fields) {
    try {
      return await this.Database.insert(fields).into(table);
    } catch (e) {
      console.log("Utils-InsertTable: ", e);
      this.fileLogger.error(`Database error ${e.message}`);
      return e.message;
    }
  }
  async ExecuteSQL(sql, para = []) {
    try {
      return await this.Database.raw(sql, para);
    } catch (e) {
      console.log("Utils-ExecuteSQL: ", e);
      this.fileLogger.error(`Database error ${e.message}`);
      return e.message;
    }
  }
  async CallOracleProcedure() {
    try {
      //let cursor = { type: conn.oracledb.CURSOR, dir: conn.oracledb.BIND_OUT }
      //http://oracle.github.io/node-oracledb/doc/api.html#oracledbconstantsbinddir
      //console.log(this.oracledb)
      let cursor = { type: 2021, dir: 3003 };
      let ret = { type: 2010, dir: 3003 };
      let knex = this.Database.connection("oracle").knex.client;
      console.log(knex);
      // knex.raw("BEGIN LG_Mpos_SEL_TEST(@p_rtn_value); END;").then((result) => {
      //     console.log("Success : " + JSON.stringify(result));
      // }).catch((err) => {
      //     console.log("Error : " + err);
      // });
      return await this.Database.raw(`Call LG_Mpos_SEL_TEST(?)`, [cursor]);
      //expecting an array or an iterable object but got [object Null]
      //https://github.com/oitTim/knex/commit/7ac328edf36b64301402ed6c2ce8edfad9371b2b
    } catch (e) {
      console.log("Utils-CallOracleProcedure: ", e);
      return e.message;
    }
  }
  async _sleep(seconds) {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
  }
  async Setting() {
    try {
      const setting = await this.Database.table("setting")
        .select("keyname", "value")
        .where("active", 1);
      if (setting.length > 0) {
        let data = {};
        setting.forEach((item) => {
          data[item.keyname] = item.value;
        });
        await this.Redis.set("SETTING", JSON.stringify(data), "EX", 28000);
        return data;
      }
      this.Logger({
        level: "error",
        module: "Utils",
        func: "Setting",
        content: "Setting is empty",
      });
      return null;
    } catch (e) {
      this.Logger({
        level: "error",
        module: "Utils",
        func: "Setting",
        content: e.message,
      });
      return false;
    }
  }
  async ConsoleLog(p_message) {
    const d = new Date();
    const dateText = d.toLocaleString();
    console.log(`[${dateText}]: ${p_message}`);
  }
  async ConsoleLogError(p_message) {
    const d = new Date();
    const dateText = d.toLocaleString();
    console.error(`[${dateText}]: ${p_message}`);
  }
  async Logger(fields) {
    try {
      if (fields.CONTENT.length > 4000) {
        fields.CONTENT = fields.CONTENT.substr(0, 2000);
      }
      await this.Database.insert(fields).into("TES_SYSLOG");
      //await this.Database.close(['oracle']);
    } catch (e) {
      this.ConsoleLogError(e.message);
      this.fileLogger.error(`Database error ${e.message}`);
    }
  }
  async actionLog(fields) {
    try {
      await this.Database.insert(fields).into("actionlog");
      //await this.Database.close(['oracle']);
    } catch (e) {
      this.ConsoleLogError(e.message);
      this.fileLogger.error(`Database error ${e.message}`);
    }
  }
  async readFile(file_path) {
    return await fs.readFileSync(file_path);
  }
  async readDir(dir_path) {
    try {
      return await fs.readdirSync(dir_path);
    } catch (e) {
      return [];
    }
  }
  async resizeImage(beforePath, extname, max_size = 500) {
    try {
      if (!beforePath) {
        console.log("File path invalid.");
        return false;
      }
      const image = await Jimp.read(beforePath);
      if (image) {
        let w = image.bitmap.width;
        let h = image.bitmap.height;
        //console.log({w,h})
        if (w <= max_size && h <= max_size) {
          return { file_path: beforePath, size: w * h };
        } else {
          const d = new Date();
          const height = h - Math.ceil(h * (1 - max_size / w));
          const image_name = `${d.getTime()}.${extname}`;
          if (h > w) {
            const width = w - Math.ceil(w * (1 - max_size / h));
            await image
              .resize(width, max_size)
              .quality(80)
              .writeAsync(Helpers.tmpPath(image_name));
            return {
              file_path: Helpers.tmpPath(image_name),
              size: width * max_size,
            };
          } else {
            await image
              .resize(max_size, height)
              .quality(80)
              .writeAsync(Helpers.tmpPath(image_name));
            return {
              file_path: Helpers.tmpPath(image_name),
              size: height * max_size,
            };
          }
        }
      } else {
        console.log("Invalid image (function: resizeImage)");
        return false;
      }
    } catch (e) {
      console.log("resizeImage error:" + e);
      this.Logger({
        level: "error",
        module: "Utils",
        func: "resizeImage",
        content: e.message,
      });
      return false;
    }
  }
  async putFileRootPath(file, folder, location1 = 'not_use') {
    const type = typeof file;
    const imageExt =
      type === "string" ? file.split("?")[0].split(".").pop() : file.extname;
    let current = new Date();
    let year = current.getFullYear();
    let month = current.getMonth() + 1;
    if (month < 10) {
      month = "0" + month;
    }
    let savePath = `${this.ROOT_DIR_FILES}/${folder}/${year}/${month}`;
    if (location1 !== 'not_use') {
      savePath = `${this.ROOT_DIR_FILE1}/${location1}`;
    }
    let fileName = `${current.getTime()}.${imageExt.toLowerCase()}`;

    if (type !== "string") {
      await file.move(savePath, {
        name: fileName,
      });
    }
    if (location1 !== 'not_use') return `/${location1}/${fileName}`;
    return `/${folder}/${year}/${month}/${fileName}`;
  }
  async putManualFile(file, folder, filename) {
    try {
      let path = `/manual/${folder}`;
      let savePath = Helpers.appRoot(path);
      await file.move(savePath, {
        name: filename,
        overwrite: true,
      });
      return `${path}/${filename}`;
    } catch (ex) {
      return ex.message;
    }
  }
  async putImageFile(file, folder) {
    try {
      const type = typeof file;
      const imageExt = file.extname;

      let current = new Date();
      let year = current.getFullYear();
      let month = current.getMonth() + 1;
      let date = current.getDate();
      let path = `${folder}/${year}/${month}/${date}`;
      let savePath = await makeDir(`/data/hiwin/image/${path}`);
      let fileName = `${current.getTime()}.${imageExt.toLowerCase()}`;

      if (type !== "string") {
        await file.move(savePath, { name: fileName });
        if (!file.moved()) {
          return file.error();
        }
      }
      return `${path}/${fileName}`;
    } catch (e) {
      console.log(e.message);
      this.Logger({
        level: "error",
        module: "Utils",
        func: "putImageFile",
        content: e.message,
      });
      return false;
    }
  }
  async putVideoFile(file, folder) {
    try {
      const type = typeof file;
      const fileExt = file.extname;

      let current = new Date();
      let year = current.getFullYear();
      let month = current.getMonth() + 1;
      let date = current.getDate();
      let path = `${folder}/${year}/${month}/${date}`;
      let savePath = await makeDir(`/data/hiwin/video/${path}`);
      let fileName = `${current.getTime()}.${fileExt.toLowerCase()}`;

      if (type !== "string") {
        await file.move(savePath, { name: fileName });
        if (!file.moved()) {
          return file.error();
        }
      }
      return `${path}/${fileName}`;
    } catch (e) {
      console.log(e.message);
      this.Logger({
        level: "error",
        module: "Utils",
        func: "putVideoFile",
        content: e.message,
      });
      return false;
    }
  }
  async putAudioFile(file, folder) {
    try {
      const type = typeof file;
      const fileExt = file.extname;

      let current = new Date();
      let year = current.getFullYear();
      let month = current.getMonth() + 1;
      let date = current.getDate();
      let path = `${folder}/${year}/${month}/${date}`;
      let savePath = await makeDir(`/data/hiwin/audio/${path}`);
      let fileName = `${current.getTime()}.${fileExt.toLowerCase()}`;

      if (type !== "string") {
        await file.move(savePath, { name: fileName });
        if (!file.moved()) {
          return file.error();
        }
      }
      return `${path}/${fileName}`;
    } catch (e) {
      console.log(e.message);
      this.Logger({
        level: "error",
        module: "Utils",
        func: "putAudioFile",
        content: e.message,
      });
      return false;
    }
  }
  response(success, message, data = {}, code = 200) {
    return {
      success,
      message,
      data,
      code,
    };
  }
  CurrentDate(separater = "") {
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
  }
  _arrayBufferToBase64(buffer) {
    let binary = "";
    let bytes = new Uint8Array(buffer);
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }

    return Buffer.from(binary, "binary").toString("base64");
  }
  _formatted_string(pad, user_str, pad_pos) {
    if (
      user_str == undefined ||
      user_str == "" ||
      user_str == "null" ||
      user_str == null
    )
      return pad;
    if (pad_pos == "l") {
      return (pad + user_str).slice(-pad.length);
    } else {
      return (user_str + pad).substring(0, pad.length);
    }
  }
  async putExcelRootPath(file, folder, type_insert) {
    const type = typeof file;
    const clientName =
      type === "string" ? file.split("?")[0].split(".").pop() : file.clientName;
    let path_result = ``;
    let path = ``;

    if (type_insert == "EXCEL") {
      path_result = `/resources/report/${folder}/${clientName}`;
      path = `/resources/report/${folder}`;
    } else {
      path_result = `${folder}/${clientName}`;
      path = `/resources/${folder}`;
    }

    let savePath = Helpers.appRoot(path);
    if (type !== "string") {
      await file.move(savePath, {
        name: clientName,
        overwrite: true,
      });
    }

    return `${path_result}`;
  }
  Num2VNText(s, ccy) {
    //process minus case
    var minus = "";
    if (s.substring(0, 1) == "-") {
      s = s.replace("-", "").trim();
      minus = "Trừ ";
    }

    var rtnf = "";
    var l = 0;
    var i = 0;
    var j = 0;
    var dk = 0;
    var A = [];
    s = s.replace(/,/g, "");
    var s1 = "";
    var strTmp = "";
    var chk_s = s;
    chk_s = chk_s.replace(".", "/");
    if (chk_s.search("/") != -1) {
      s1 = s.substring(s.indexOf(".") + 1);
      s = s.substring(0, s.indexOf("."));
    }

    var B = [];
    s = s.trim();
    l = s.length;
    if (l > 32) {
      rtnf = "Number Very Large!";
      return rtnf;
    }
    for (i = 0; i < l; i++) {
      A[i] = s.substring(i, 1 + i);
    }
    for (i = 0; i < l; i++) {
      if (
        (l - i) % 3 == 0 &&
        A[i] == "0" &&
        (A[i + 1] != "0" || A[i + 2] != "0")
      ) {
        rtnf += " Không";
      }
      if (A[i] == "2") {
        rtnf += " Hai";
      }
      if (A[i] == "3") {
        rtnf += " Ba";
      }
      if (A[i] == "4") {
        rtnf += " Bốn";
      }
      if (A[i] == "6") {
        rtnf += " Sáu";
      }
      if (A[i] == "7") {
        rtnf += " Bảy";
      }
      if (A[i] == "8") {
        rtnf += " Tám";
      }
      if (A[i] == "9") {
        rtnf += " Chín";
      }
      if (A[i] == "5") {
        if (i > 0 && (l - i) % 3 == 1 && A[i - 1] != "0") {
          rtnf += " Lăm";
        } else {
          rtnf += " Năm";
        }
      }
      if (i > 2 && A[i] == "1" && (l - i) % 3 == 1 && Number(A[i - 1]) > 1) {
        rtnf += " Mốt";
      } else if (A[i] == "1" && (l - i) % 3 != 2) {
        rtnf += " Một";
      }
      if ((l - i) % 3 == 2 && A[i] != "0" && A[i] != "1") {
        rtnf += " Mươi";
      } else if ((l - i) % 3 == 2 && A[i] != "0") {
        rtnf += " Mười";
      }
      if (i == 0) {
        if ((l - i) % 3 == 2 && A[i] == "0" && A[i + 1] != "0") {
          rtnf += " Không";
        }
      } else {
        if ((l - i) % 3 == 2 && A[i] == "0" && A[i + 1] != "0") {
          rtnf += " Lẻ";
        }
      }
      if ((l - i) % 3 == 0 && (A[i + 1] != "0" || A[i + 2] != "0")) {
        rtnf += " Trăm";
      } else if ((l - i) % 3 == 0 && A[i] != "0") {
        rtnf += " Trăm";
      }
      if (l - i == 4) {
        rtnf += " Nghìn";
      }
      if (l - i == 7) {
        rtnf += " Triệu";
      }
      if (l - i == 10) {
        rtnf += " Tỷ";
      }
      if (l - i == 13) {
        rtnf += " Nghìn Tỷ";
      }
      if (l - i == 16) {
        rtnf += " Triệu Tỷ";
      }
      if (l - i == 19) {
        rtnf += " Tỷ Tỷ";
      }
      if (l - i == 22) {
        rtnf += " Triệu Tỷ Tỷ";
      }
      if (l - i == 25) {
        rtnf += " Triệu Tỷ Tỷ";
      }
      if (l - i == 28) {
        rtnf += " Tỷ Tỷ Tỷ";
      }
      if (
        (l - i) % 3 == 0 &&
        A[i] == "0" &&
        A[i + 1] == "0" &&
        A[i + 2] == "0"
      ) {
        i = i + 2;
      }
      if ((l - i) % 3 == 1) {
        dk = 1;
        for (j = i; j < l; j++) {
          if (A[j] != "0") {
            dk = 0;
          }
        }
      }
      if (dk == 1) break;
    }

    if (ccy.trim() != "VND") {
      switch (ccy.trim()) {
        case "USD":
          rtnf += " Đô";
          break;
      }

      if (s1.length > 0) {
        //Đọc số lẻ
        l = s1.length;
        if (l > 8) {
          rtnf += " ERROR!!!";
          return rtnf;
        }
        for (i = 0; i < l; i++) {
          B[i] = s1.substring(i, 1);
        }

        strTmp = "";
        //Dịch Tạm
        for (i = 0; i < 2; i++) {
          if (i > 0 && B[0] != "0" && B[0] != "1") {
            strTmp += " Mươi";
          }

          if (B[i] == "1") {
            if (i == 0) {
              strTmp += " Mười";
            } else {
              if (B[0] == "1") {
                strTmp += " Một";
              } else {
                strTmp += " Mốt";
              }
            }
          }

          switch (B[i]) {
            case "2":
              strTmp += " Hai";
              break;
            case "3":
              strTmp += " Ba";
              break;
            case "4":
              strTmp += " Bốn";
              break;
            case "5":
              strTmp += " Năm";
              break;
            case "6":
              strTmp += " Sáu";
              break;
            case "7":
              strTmp += " Bảy";
              break;
            case "8":
              strTmp += " Tám";
              break;
            case "9":
              strTmp += " Chín";
              break;
          }
        }
      }

      if (strTmp != "") {
        rtnf = rtnf + " Và" + strTmp + " Cen";
      }
    }

    if (ccy == "VND") {
      rtnf += " Đồng";
    }

    rtnf = minus + rtnf; //process minus case
    rtnf =
      rtnf.substr(0, 2) + rtnf.substr(2, rtnf.length - 2).toLowerCase() + ".";

    return rtnf;
  }
  Num2EngText(s, ccy) {
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
    strPlace[1] = "  ";
    strPlace[2] = " Thousand ";
    strPlace[3] = " Million ";
    strPlace[4] = " Billion ";
    strPlace[5] = " Trillion ";
    s = s.replace(/,/g, "").trim();
    var strTens = [
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    var strTens2 = [
      "",
      "",
      "Twenty ",
      "Thirty ",
      "Forty ",
      "Fifty ",
      "Sixty ",
      "Seventy ",
      "Eighty ",
      "Ninety ",
    ];
    var Digits = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
    ];
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
        s = this._formatted_string("000", s, "l");
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
    return rtnf;
  }
  _formatDate(date, monthFormatString) {
    return date ? moment(date).format(monthFormatString) : "";
  }
  translate(_key = " ", _dictionaryList = "", _lang = "") {
    if (!_key) return;
    _key = _key.trim();
    let text = "";

    if (_dictionaryList.length > 0) {
      const found = _dictionaryList.find(
        (item) =>
          item.ID.toString().toUpperCase().trim() ==
          _key.toString().toUpperCase().trim() &&
          item.LANGUAGE.toString().toUpperCase().trim() ==
          _lang.toString().toUpperCase().trim()
      );
      if (found) {
        text = found.MESSAGE;
        if (text) return text;
      }
    }
    if (!text) {
      text = _key;
      if (text) return text;
    }
  }
  onCheckMonth(month, year, value) {
    var d = new Date();
    var yy = Number(year); //   d.getFullYear();
    var mm = Number(month); //d.getMonth();

    var result;
    var monthMax = 12;
    var count = Number(mm) - value;
    if (count < 0) {
      for (let i = 0; i < Math.abs(count); i++) {
        monthMax--;
      }
      result = this.addZero(monthMax, 2) + "-" + (yy - 1);
    } else if (count == 0) {
      result = monthMax + "-" + (yy - 1);
    } else {
      result = this.addZero(mm - value, 2) + "-" + yy;
    }
    return result;
  }
  addZero(x, n) {
    while (x.toString().length < n) {
      x = "0" + x;
    }
    return x;
  }
  excelInsertRow(worksheet, pos) {
    worksheet.spliceRows(pos + 1, 0, []);
    let rSrc = worksheet.getRow(pos);
    let rDst = worksheet.getRow(pos + 1);
    rDst.style = { ...rSrc.style };
    rSrc.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      rDst.getCell(colNumber).style = { ...cell.style };
    });
    rDst.height = rSrc.height;
  }
  excelInsertRows(worksheet, pos, length) {
    for (let i = 0; i < length; i++) {
      this.excelInsertRow(worksheet, pos);
    }
  }
  replaceString(_str, _obj) {
    let regexColumns = /(\{+\{)(.*?)(\}+})/g; // list  $[column]
    let regexColumnName = /(\{+\{)(.*?)(\}+})/; //  $[column]

    let columnNames = _str.match(regexColumns);

    if (columnNames != null && columnNames.length > 0) {
      let col = "";
      columnNames.forEach((q) => {
        if (q.startsWith("{{") && q.endsWith("}}")) {
          col = q.match(regexColumnName)[2].toUpperCase();
          //	col = (q.match(regexColumnName))[1].toUpperCase().replace("{","").replace("}","") ;
          try {
            _str = _str.replace(q, _obj[col]);
          } catch (e) { }
        }
      });
    }
    return _str;
  }
  /** Tạo secret key ứng với từng user để phục vụ việc tạo otp token.
   * Lưu ý: Secret phải được gen bằng lib otplib thì những app như Google Authenticator hoặc tương tự mới xử lý chính xác được.
   * Các bạn có thể thử để linh linh cái secret này thì đến bước quét mã QR sẽ thấy có lỗi ngay.
   */
  generateUniqueSecret() {
    return authenticator.generateSecret();
  }
  /** Tạo mã token (số OTP) từ secret */
  generateTokenFromSecret(secret) {
    return authenticator.generate(secret);
  }
  /** Tạo mã OTP token */
  generateOTPToken(username, serviceName, secret) {
    return authenticator.keyuri(username, serviceName, secret);
  }
  /** Kiểm tra mã OTP token có hợp lệ hay không
   * Có 2 method "verify" hoặc "check", các bạn có thể thử dùng một trong 2 tùy thích.
   */
  verifyOTPToken(token, secret) {
    return authenticator.verify({ token, secret }); // dùng verify thì nhớ nhét token & secret và trong { }
    /* hoặc */
    // return authenticator.check(token, secret)
  }
  /** Tạo QR code từ mã OTP để gửi về cho user sử dụng app quét mã */
  async generateQRCode(otpAuth) {
    try {
      const QRCodeImageUrl = await qrcode.toDataURL(otpAuth);
      return QRCodeImageUrl;
    } catch (error) {
      console.log("Could not generate QR code", error);
      return;
    }
  }
  async wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

module.exports = Utils;
