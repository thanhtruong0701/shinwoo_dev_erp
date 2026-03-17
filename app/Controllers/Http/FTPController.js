// "use strict";
//"basic-ftp": "^5.0.2", "ftp-client": "^0.2.2",
// const Utils = use("Utils");
// const ftp = require('basic-ftp');
// const fs = require('fs');
// const ftpClient = new ftp.Client(); 
// const Helpers = use("Helpers"); 
// const Env = use("Env");   
// const DB_CONNECTION = Env.get("DB_CONNECTION");
// const DBService = use("DBService");
// const oracledb = require('oracledb');
// const FTP_ID=Env.get("FTP_ID");
// const FTP_PW=Env.get("FTP_PW");
// const FTP_PORT=Env.get("FTP_PORT");
// const FTP_HOST=Env.get("FTP_HOST");
// const FTP_RPA_ROOT=Env.get("FTP_RPA_ROOT");
// const FTP_LOCAL_ROOT=Env.get("FTP_LOCAL_ROOT");
// const FTP_INFO = [];
// class FtpController {

//     // async getFtpInfor(){
//     //     if (DB_CONNECTION == "oracle") {
//     //         oracledb.fetchAsBuffer = [oracledb.BLOB];
//     //     }
//     //     // const result = await DBService.callProcCursor('SYS_SEL_IMP_FILE', para, p_language, p_crt_by);
//     //     if (result && Number(result[0].PK) > 0) {
//     //     }
//     // }
//     async ftpdownloadToDir({ request, response, auth }) {
//         try {
//             let p_language = request.header("accept-language", "ENG");
//             let user = await auth.getUser();
//             let p_crt_by = user ? user.USER_ID : 'ftpConnect';
//             /*==[get param ftp info to connect server]==*/
//             let { ftpInfo } = request.all();
//             /*==[set param ftp info to connect server]==*/
//             var settings = {
//                 host: FTP_HOST||'',
//                 port: FTP_PORT||'',
//                 user: FTP_ID||'',
//                 password: FTP_PW||'',
//                 secure: false
//             };
//             /*==[open connect ftp server]==*/
//             const ftpClientAccess = await ftpClient.access(settings);
//             // console.log('[vng-154/dvg] > file: FTPController.js:26 > FtpController > ftpConnect > ftpClientAccess', ftpClientAccess);  
//             // console.log('[vng-154/dvg] > file: FTPController.js:63 > FtpController > ftpConnect > ftpClientAccess[code]', ftpClientAccess.code);
//             /*==[when connect success then reponse arr{ code: 220, message: '220 (vsFTPd 3.0.3)' }]==*/
//             if (ftpClientAccess && Number(ftpClientAccess.code) == 220) { 
//                 /*==[get list folder company]==*/
//                 let arrlstFolder = await ftpClient.list(FTP_RPA_ROOT+"/");   
//                 /*==[For folder have data and download]==*/
//                 for(let i = 0; i < arrlstFolder.length; i++){ 
//                     // console.log('[vng-154/dvg] > file: FTPController.js:32 > FtpController > ftpConnect > arrlstFolder[i]', arrlstFolder[i]);
//                     /*==[read folder company name]==*/
//                     let tempFolderCompany = arrlstFolder[i].name; 
//                     // console.log('[vng-154/dvg] > file: FTPController.js:33 > FtpController > ftpConnect > tempFolderCompany', tempFolderCompany);
//                     /*==[creare path local save file by folder company]==*/
//                     let localPath = Helpers.appRoot(FTP_LOCAL_ROOT+"/"+tempFolderCompany);   
//                     // console.log('[vng-154/dvg] > file: FTPController.js:36 > FtpController > ftpConnect > localPath', localPath);
//                     /*==[read path RPA folder company]==*/
//                     let rpaPath = FTP_RPA_ROOT+"/"+tempFolderCompany+"/";
//                     // console.log('[vng-154/dvg] > file: FTPController.js:39 > FtpController > ftpConnect > rpaPath', rpaPath);
//                     /*==[download file of folder company]==*/
//                     await ftpClient.downloadToDir(localPath, rpaPath);
//                 } 
//                 /*==[ftpClientClose]==*/
//                 this.ftpClose(); 
//                 /*==[response]==*/
//                 return response.send(Utils.response(true, "OK", arrlstFolder));
//             }
//             /*==[ftpClientClose]==*/
//             this.ftpClose()
//             return response.send(Utils.response(true, "OK", ftpClientAccess));
//         } catch (e) {
//             Utils.Logger({
//                 LVL: "error",
//                 MODULE: "FtpController",
//                 FUNC: "ftpConnect",
//                 CONTENT: e.message,
//             });
//             this.ftpClose()
//             return response.send(Utils.response(false, "Error", e));
//         } 
//     }
//     ftpClose() {
//         ftpClient.close();
//     }
//     onreturn(obj) {
//         console.log(obj)
//     }
// }

// module.exports = FtpController;