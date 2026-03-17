"use strict";

const Utils = use("Utils");
const Hash = use("Hash");
const AES = use("AES");
const DBService = use("DBService");
const Env = use("Env");
const SESSION_TIMEOUT = Env.get("SESSION_TIMEOUT", 60);
const SSO_KEY = Env.get("SSO_KEY");
const UserRepo = use("UserRepo");
const CryptoJS = use("crypto-js");
const AppName = Env.get("APP_NAME");

var hexcase = 0; /* hex output format. 0 - lowercase; 1 - uppercase        */
var b64pad = ""; /* base-64 pad character. "=" for strict RFC compliance   */
var chrsz = 8; /* bits per input character. 8 - ASCII; 16 - Unicode      */

class UserController {
  async test({ request, response }) {
    try {
      const empList=[{
        "PK":6545,
        "PW":"12345"
      },
      {
        "PK":6654,
        "PW":"6789"
      },]
      
      for(let i=0;i<empList.length;i++){
        const md5_64 = this.b64_md5(empList[i].PW);
        if(i%50==0){
          await Utils.wait(1000*15);
        }
        console.log(i)
        const result = await DBService.callProcCursor("sys_upd_b64_md5", [empList[i].PK,md5_64],"ENG", "system");  
      }      
      return response.send(Utils.response(true, "test", "completed"));
    } catch (e) {
      return response.send(Utils.response(false, "fail", e.message));
    }
  }

  async logIn({ request, response, auth }) {
    let ip = request.header("x-real-ip");
    try {
      if (ip == undefined) {
        ip = request.ip();
      }
      const { user_id, password } = request.all();
      let user = await UserRepo.findBy({ USER_ID: user_id, DEL_IF: 0 });
      if (!user) {
        return response.send(Utils.response(false, "user_not_found", null));
      }
      // const verify = await Hash.verify(password, user.USER_PW)
      const md5_64 = this.b64_md5(password);
      let verify = md5_64 == user.USER_PW;
      if (!verify) {
        verify = await Hash.verify(password, user.USER_PW);
      }
      let result;
      if (!verify) {
        result = await DBService.callProcCursor("sys_login_auth", [user_id, "invalid_userid_or_password", ip], "ENG", user_id);
        user = result[0];
        if (user) {
          return response.send(Utils.response(false, user.STATUS, null));
        }
        return response.send(Utils.response(false, "user_not_found", null));
      }

      result = await DBService.callProcCursor("sys_login_auth", [user_id, user.USER_PW, ip], "ENG", user_id);
      user = result[0];

      //console.log(user)
      if (user) {
        if (user.STATUS === "OK") {
          const token = await auth.generate(user);
          return response.send(Utils.response(true, "Log In Successfully!", { user: user, token: token.token }));
        }
        Utils.Logger({ LVL: "info", MODULE: "UserController", FUNC: "logIn", CONTENT: `Login ERROR. IP:${ip}`, CRT_BY: user_id });
        return response.send(Utils.response(false, user.STATUS, null));
      }
      return response.send(Utils.response(false, "User not found!", null));
    } catch (e) {
      Utils.Logger({ LVL: "error", MODULE: "UserController", FUNC: "logIn", CONTENT: `${e.message}. IP:${ip}` });
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async ssoLogin({ request, response, auth }) {
    let ip = request.header("x-real-ip");
    if (ip == undefined) {
      ip = request.ip();
    }
    try {
      let { proc, para, encrypt_type } = request.all();
      let decodeToken;
      //console.log(para)
      const token = para[0]
        .replace(/p1L2u3S/g, "+")
        .replace(/s1L2a3S4h/g, "/")
        .replace(/e1Q2u3A4l/g, "=");
      if (encrypt_type == "java") {
        decodeToken = AES.decryptJava(token, SSO_KEY);
      } else if (encrypt_type == "dotnet") {
        decodeToken = AES.decryptDotNet(token, SSO_KEY);
      } else {
        //for nodejs
        decodeToken = AES.decrypt(token, SSO_KEY);
      }
      console.log("decodeToken: " + decodeToken);
      const arrToken = decodeToken.split("|");
      if (arrToken.length != 2) {
        Utils.Logger({ LVL: "error", MODULE: "UserController", FUNC: "ssoLogin", CONTENT: `Invalid token. IP:${ip} decodeToken:${decodeToken}` });
        return response.send(Utils.response(false, "Invalid token", null));
      }
      const currUnixTime = new Date().getTime();
      //console.log("currUnixTime", currUnixTime)
      if (currUnixTime - Number(arrToken[1]) > 60 * 60 * 1000) {
        //30 seconds
        Utils.Logger({ LVL: "error", MODULE: "UserController", FUNC: "ssoLogin", CONTENT: `Token was expired. IP:${ip}` });
        return response.send(Utils.response(false, "Token was expired", null));
      }
      para[0] = arrToken[0];
      para.push(ip);
      let result,
        user = null;
      result = await DBService.callProcCursor(proc, para, "ENG", para[0]);
      user = result[0];
      if (user) {
        if (user.STATUS === "OK") {
          const token = await auth.generate(user);
          const now = new Date();
          const miliseconds = now.getTime();
          DBService.setCache("" + user.PK, miliseconds, SESSION_TIMEOUT)
          Utils.Logger({ LVL: "info", MODULE: "UserController", FUNC: "ssoLogin", CONTENT: `Login OK. IP:${ip}`, CRT_BY: para[0] });
          return response.send(Utils.response(true, "Log In Successfully!", { user: user, token: token.token }));
        }
        Utils.Logger({ LVL: "error", MODULE: "UserController", FUNC: "ssoLogin", CONTENT: `Login error. IP:${ip}`, CRT_BY: para[0] });
        return response.send(Utils.response(false, user.STATUS, null));
      }
      return response.send(Utils.response(false, "User not found!", null));
    } catch (e) {
      Utils.Logger({ LVL: "error", MODULE: "UserController", FUNC: "ssoLogin", CONTENT: `${e.message} IP:${ip}` });
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async getSSOToken({ request, response, auth }) {
    try {
      const { encrypt_type } = request.all();
      const user = await auth.getUser();
      const unixTime = new Date().getTime();
      console.log("unixTime", unixTime);
      let token;
      if (!user) {
        return response.send(Utils.response(false, "Request failed!", null));
      } else {
        if (encrypt_type == "java") {
          token = AES.encryptJava(user.USER_ID + "|" + unixTime, SSO_KEY);
          console.log(token);
        } else if (encrypt_type == "dotnet") {
          token = AES.encryptDotNet(user.USER_ID + "|" + unixTime, SSO_KEY);
        } else {
          token = AES.encrypt(user.USER_ID + "|" + unixTime, SSO_KEY);
        }
        token = token
          .replace(/\+/g, "p1L2u3S")
          .replace(/\//g, "s1L2a3S4h")
          .replace(/=/g, "e1Q2u3A4l");
        return response.send(Utils.response(true, "sso_token", { ssotoken: token }));
      }
    } catch (e) {
      return response.send(Utils.response(false, "error_occur", e.message));
    }
  }

  async getUser({ response, auth }) {
    try {
      const user = await auth.getUser();
      if (!user) {
        return response.send(Utils.response(false, "Request failed!", null));
      } else {
        const result = await DBService.callProcCursor("sys_sel_login_user", [user.PK], "ENG", user.USER_ID);
        return response.send(result[0]);
      }
    } catch (e) {
      return response.send(Utils.response(false, "error_occur", e.message));
    }
  }

  async createPassword({ request, response, auth }) {
    try {
      const { password, confirmPassword } = request.all();
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (!user || user.USE_YN !== "Y" || user.SYSADMIN_YN !== "Y") {
        return response.send(Utils.response(false, "Request failed!", null));
      }
      p_crt_by = user.USER_ID;
      if (password !== confirmPassword) {
        return response.send(Utils.response(false, "confirm_pass_not_match", null));
      }
      const hashPassword = await Hash.make(password);
      if (hashPassword) {
        return response.send(Utils.response(true, "create_password_success", hashPassword));
      }
      return response.send(Utils.response(false, "create_password_failed", null));
    } catch (e) {
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async updatePassword({ request, response, auth }) {
    try {
      const { proc, userPK, password, confirmPassword } = request.all();
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }
      const userUpdated = await UserRepo.find(userPK);
      if (!userUpdated) {
        return response.send(Utils.response(false, "user_not_found", null));
      }
      if (password !== confirmPassword) {
        return response.send(Utils.response(false, "confirm_pass_not_match", null));
      }
      const hashPassword = await Hash.make(password);
      const params = [userPK, hashPassword];
      const result = await DBService.callProcCursor(proc, params, p_language, p_crt_by);
      if (result) {
        return response.send(Utils.response(true, "UPDATE_PASSWORD_SUCCESS", result));
      }
      return response.send(Utils.response(false, "UPDATE_PASSWORD_FAILED", null));
    } catch (e) {
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async updateUserPassword({ request, response, auth }) {
    try {
      const { proc, oldPassword, newPassword, confirmPassword } = request.all();
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (!user) {
        return response.send(Utils.response(false, "Request failed!", null));
      }
      p_crt_by = user.USER_ID;
      const userUpdated = await UserRepo.find(user.PK);
      if (!userUpdated) {
        return response.send(Utils.response(false, "user_not_found", null));
      }
      const md5_64 = this.b64_md5(oldPassword);
      let verify = md5_64 == user.USER_PW;
      if (!verify) {
        verify = await Hash.verify(oldPassword, user.USER_PW);
      }
      if (!verify) {
        return response.send(Utils.response(false, "old_password_not_correct", null));
      }
      if (newPassword !== confirmPassword) {
        return response.send(Utils.response(false, "confirm_pass_not_match", null));
      }
      let hashPassword = await Hash.make(newPassword);

      //vng-207 20230328 update theo gasp
      if (Env.get("GASP_YN")) {
        hashPassword = this.b64_md5(newPassword);
      }

      const params = [user.PK, hashPassword];
      const result = await DBService.callProcCursor(proc, params, p_language, p_crt_by);
      if (result) {
        return response.send(Utils.response(true, "UPDATE_PASSWORD_SUCCESS", result));
      }
      return response.send(Utils.response(false, "UPDATE_PASSWORD_FAILED", null));
    } catch (e) {
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async enable2FA({ request, response, auth }) {
    let ip = request.header("x-real-ip");
    try {
      if (ip == undefined) {
        ip = request.ip();
      }
      const user = await auth.getUser();
      if (!user) {
        return response.send(Utils.response(false, "Request failed!", null));
      }
      // đây là tên ứng dụng của các bạn, nó sẽ được hiển thị trên app Google Authenticator hoặc Authy sau khi bạn quét mã QR
      const serviceName = AppName;
      const userSecret = Utils.generateUniqueSecret();
      // Thực hiện tạo mã OTP
      const otpAuth = Utils.generateOTPToken(user.USER_ID, serviceName, userSecret);
      //console.log("otpAuth:", otpAuth)
      // Tạo ảnh QR Code để gửi về client
      const QRCodeImage = await Utils.generateQRCode(otpAuth);
      return response.send(
        Utils.response(true, "Enable Two Factor Authentication Successfully!", {
          qrCodeImage: QRCodeImage,
          userSecret: userSecret,
        })
      );
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "UserController",
        FUNC: "enable2FA",
        CONTENT: `${e.message}. IP:${ip}`,
      });
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async update2FA({ request, response, auth }) {
    let ip = request.header("x-real-ip");
    try {
      if (ip == undefined) {
        ip = request.ip();
      }
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (!user) {
        return response.send(Utils.response(false, "Request failed!", null));
      }
      p_crt_by = user.USER_ID;
      const { proc, otpToken, userSecret, twoFactorAuthYN } = request.all();
      let params;
      if (twoFactorAuthYN === "N") {
        params = [user.PK, "", twoFactorAuthYN];
        const result = await DBService.callProcCursor(proc, params, p_language, p_crt_by);
        if (result) {
          return response.send(Utils.response(true, "Update two factor authentication successful!", result));
        }
        return response.send(Utils.response(false, "Update two factor authentication failed!", null));
      } else {
        /* Validate OTP */
        const isValid = Utils.verifyOTPToken(otpToken, userSecret);
        if (isValid) {
          params = [user.PK, userSecret, twoFactorAuthYN];
          const result = await DBService.callProcCursor(proc, params, p_language, p_crt_by);
          if (result) {
            return response.send(Utils.response(true, "Update two factor authentication successful!", result));
          }
          return response.send(Utils.response(false, "Update two factor authentication failed!", null));
        }
        return response.send(Utils.response(true, "Verify two factor authentication failed! Your OTP does not match!", null));
      }
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "UserController",
        FUNC: "update2FA",
        CONTENT: `${e.message}. IP:${ip}`,
      });
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async get2FAKey({ request, response, auth }) {
    let ip = request.header("x-real-ip");
    try {
      if (ip == undefined) {
        ip = request.ip();
      }
      const user = await auth.getUser();
      if (!user) {
        return response.send(Utils.response(false, "Request failed!", null));
      }
      if (user.TWO_FACTOR_AUTH_YN === "N" || user.TWO_FACTOR_AUTH_YN === undefined) {
        return response.send(Utils.response(false, "This account haven't enabled two factor authentication yet!", null));
      }
      const serviceName = AppName;
      const otpAuth = Utils.generateOTPToken(user.USER_ID, serviceName, user.USER_SECRET);
      const QRCodeImage = await Utils.generateQRCode(otpAuth);
      if (QRCodeImage) {
        return response.send(Utils.response(true, "Get 2FA Key successfully!", { qrCodeImage: QRCodeImage }));
      }
      return response.send(Utils.response(false, "Get 2FA Key failed!", null));
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "UserController",
        FUNC: "get2FAKey",
        CONTENT: `${e.message}. IP:${ip}`,
      });
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async verify2FA({ request, response, auth }) {
    let ip = request.header("x-real-ip");
    try {
      if (ip == undefined) {
        ip = request.ip();
      }
      const user = await auth.getUser();
      if (!user) {
        return response.send(Utils.response(false, "Request failed!", null));
      }
      if (user.TWO_FACTOR_AUTH_YN === "N" || user.TWO_FACTOR_AUTH_YN === undefined) {
        return response.send(Utils.response(true, "This account haven't enabled two factor authentication yet!", null));
      }
      const { otpToken } = request.all();
      // Kiểm tra mã token người dùng truyền lên có hợp lệ hay không?
      const isValid = Utils.verifyOTPToken(otpToken, user.USER_SECRET);
      if (isValid) {
        return response.send(Utils.response(true, "Verify two factor successfully!", { user: user }));
      }
      return response.send(Utils.response(true, "Verify two factor failed!", null));
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "UserController",
        FUNC: "verify2FA",
        CONTENT: `${e.message}. IP:${ip}`,
      });
      return response.send(Utils.response(false, e.message, null));
    }
  }

  /*convet password md5 base 64 */
  b64_md5(s) {
    return this.binl2b64(this.core_md5(this.str2binl(s), s.length * chrsz));
  }
  binl2b64(binarray) {
    var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var str = "";
    for (var i = 0; i < binarray.length * 4; i += 3) {
      var triplet = (((binarray[i >> 2] >> (8 * (i % 4))) & 0xff) << 16) | (((binarray[(i + 1) >> 2] >> (8 * ((i + 1) % 4))) & 0xff) << 8) | ((binarray[(i + 2) >> 2] >> (8 * ((i + 2) % 4))) & 0xff);
      for (var j = 0; j < 4; j++) {
        if (i * 8 + j * 6 > binarray.length * 32) str += b64pad;
        else str += tab.charAt((triplet >> (6 * (3 - j))) & 0x3f);
      }
    }
    return str;
  }
  core_md5(x, len) {
    /* append padding */
    x[len >> 5] |= 0x80 << len % 32;
    x[(((len + 64) >>> 9) << 4) + 14] = len;

    var a = 1732584193;
    var b = -271733879;
    var c = -1732584194;
    var d = 271733878;

    for (var i = 0; i < x.length; i += 16) {
      var olda = a;
      var oldb = b;
      var oldc = c;
      var oldd = d;

      a = this.md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
      d = this.md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
      c = this.md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
      b = this.md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
      a = this.md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
      d = this.md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
      c = this.md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
      b = this.md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
      a = this.md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
      d = this.md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
      c = this.md5_ff(c, d, a, b, x[i + 10], 17, -42063);
      b = this.md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
      a = this.md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
      d = this.md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
      c = this.md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
      b = this.md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);

      a = this.md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
      d = this.md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
      c = this.md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
      b = this.md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
      a = this.md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
      d = this.md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
      c = this.md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
      b = this.md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
      a = this.md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
      d = this.md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
      c = this.md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
      b = this.md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
      a = this.md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
      d = this.md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
      c = this.md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
      b = this.md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);

      a = this.md5_hh(a, b, c, d, x[i + 5], 4, -378558);
      d = this.md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
      c = this.md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
      b = this.md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
      a = this.md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
      d = this.md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
      c = this.md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
      b = this.md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
      a = this.md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
      d = this.md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
      c = this.md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
      b = this.md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
      a = this.md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
      d = this.md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
      c = this.md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
      b = this.md5_hh(b, c, d, a, x[i + 2], 23, -995338651);

      a = this.md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
      d = this.md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
      c = this.md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
      b = this.md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
      a = this.md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
      d = this.md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
      c = this.md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
      b = this.md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
      a = this.md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
      d = this.md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
      c = this.md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
      b = this.md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
      a = this.md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
      d = this.md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
      c = this.md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
      b = this.md5_ii(b, c, d, a, x[i + 9], 21, -343485551);

      a = this.safe_add(a, olda);
      b = this.safe_add(b, oldb);
      c = this.safe_add(c, oldc);
      d = this.safe_add(d, oldd);
    }
    return Array(a, b, c, d);
  }
  str2binl(str) {
    var bin = Array();
    var mask = (1 << chrsz) - 1;
    for (var i = 0; i < str.length * chrsz; i += chrsz) bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << i % 32;
    return bin;
  }
  md5_cmn(q, a, b, x, s, t) {
    return this.safe_add(this.bit_rol(this.safe_add(this.safe_add(a, q), this.safe_add(x, t)), s), b);
  }
  md5_ff(a, b, c, d, x, s, t) {
    return this.md5_cmn((b & c) | (~b & d), a, b, x, s, t);
  }
  md5_gg(a, b, c, d, x, s, t) {
    return this.md5_cmn((b & d) | (c & ~d), a, b, x, s, t);
  }
  md5_hh(a, b, c, d, x, s, t) {
    return this.md5_cmn(b ^ c ^ d, a, b, x, s, t);
  }
  md5_ii(a, b, c, d, x, s, t) {
    return this.md5_cmn(c ^ (b | ~d), a, b, x, s, t);
  }
  safe_add(x, y) {
    var lsw = (x & 0xffff) + (y & 0xffff);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xffff);
  }
  bit_rol(num, cnt) {
    return (num << cnt) | (num >>> (32 - cnt));
  }
}

module.exports = UserController;
