"use strict";

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");
const { ioc } = require('@adonisjs/fold')

Route.get('/:controller/:action', ({ auth, view, request, response, params }) => {
    const module = params.module
    const controller = params.controller
    const action = params.action
    const controllerPath = `App/Controllers/Http/report/${controller.substr(3, 2)}/${controller.substr(5, 2)}/`
    const url = `${controllerPath}/${controller}.${action}`
    const controllerInstance = ioc.makeFunc(url)
    return controllerInstance.method.apply(controllerInstance.instance, [{ auth, view, request, response }])
}).prefix("api/report").middleware("user");

Route.group(() => {
    Route.post("login", "UserController.logIn");
    Route.post("ssologin", "UserController.ssoLogin");
    Route.get("getuser", "UserController.getUser");
    Route.post("test", "UserController.test");
    Route.post("verify2fa", "UserController.verify2FA");
}).prefix("api/user");

Route.group(() => {
    Route.post("getssotoken", "UserController.getSSOToken");
}).prefix("api/user").middleware("user");

Route.group(() => {
    Route.post("createpassword", "UserController.createPassword")
    Route.post("updatepassword", "UserController.updatePassword");
    Route.post("updateuserpassword", "UserController.updateUserPassword");
    Route.post("enable2fa", "UserController.enable2FA");
    Route.post("update2fa", "UserController.update2FA");
    Route.post("get2fakey", "UserController.get2FAKey");
}).prefix("api/user").middleware("user");

/**
 * -----------------------------------------------------------------
 * API Dso
 * -----------------------------------------------------------------
 */
Route.group(() => {
    Route.post("sendmail", "SendMailController.sendMail");
    Route.post("sendgmail", "SendMailController.sendGMail");
    Route.post("callproc", "DsoController.CallProcedure");
    Route.post("apipro", "DsoController.CallAPIProcedure");
    Route.post("callproc2", "DsoController.CallProcedureMultiCursor");
    Route.post("apiproclob", "DsoController.CallProcedureCLOB");
    Route.post("apiproclobmulti", "DsoController.callBulkProcClob");
    Route.post("bulkinsertpro", "DsoController.CallBulkInsertProcedure");
    Route.post("pushmobilemsg", "DsoController.pushMobileMsg");
    Route.post("execsql", "DsoController.ExecuteSQL");
    Route.post("downloadfile", "DsoController.DownloadFile");
    Route.post("converttopdf", "DsoController.ConvertToPdf");
    
    Route.post("callprocedureblob", "DsoController.CallProcedureBlob");
    Route.post("uploadfile", "DsoController.UploadFile");
    Route.post("uploadfile2", "DsoController.UploadFile2");
    Route.post("uploadfileexcel", "DsoController.UploadExcelToFolder");
    Route.post("getblob", "DsoController.GetBlobData");
    Route.post("uploadfilefolder", "DsoController.UploadFileToFolder");
    Route.post("uploadfilefolder2", "DsoController.UploadFileToFolder2");
    Route.post("uploadfile2folder", "DsoController.UploadFileToFolderReturnURLToken");
    Route.post("uploadfile3folder", "DsoController.UploadFileToFolderReturnURL2");
    Route.post("uploadfilevms", "DsoController.UploadFileVMS");
    Route.post("dictionaryauto", "DsoController.createDictionaryAuto");
    Route.post("uploadmanual", "DsoController.UploadManualFile");
    Route.post("makereport2", "ReportController.MakeReport2")
    Route.post("getfiletemplate", "ReportController.GetFileTemplate")
    Route.post("previewreport", "ReportController.PreviewReport");
    Route.get("getfiletemplate2", "ReportController.GetFileTemplate2")
    Route.get("makereport", "ReportController.MakeReport")
    Route.get("testreport", "ReportController.TestReport")
    Route.get("importexcel", "ImportController.ImportExcel")
    Route.get("downloadtemp", "ImportController.DownloadTemp")
    Route.get("readmanual", "DsoController.readManualFile")
    Route.get("getsessions", "DsoController.getSessions")
    Route.post("writertdb", "DsoController.writeRTDB")
    Route.post("pushnotification", "DsoController.pushNotification");
    Route.post("clearcache", "DsoController.clearCache");
    Route.get("getfile", "DsoController.getFile")    
    Route.get("expbigexcel", "DsoController.exportBigExcelFile")
    Route.post("htmltopdf", "DsoController.htmlToPdf")
    Route.get("importexcelfile", "ImportController.ImportExcelFile")
    Route.post("importeivfile", "ImportController.UploadFileToFolderEInvoice")
    Route.post("importtkhqfile", "ImportController.UploadFileToFolderTKHQ")
    Route.post("impexcelrpa", "ImportController.ImportExcelFileRPA")
    Route.post("encrypt-dotnet", "DsoController.encryptDotNet")
    Route.post("create-barcode2line", "DsoController.createBarcode2Line")
}).prefix("api/dso").middleware("user");

Route.group(() => {
    Route.get("readattachfile", "DsoController.readAttachFile")
    Route.get("getfiletoken", "DsoController.getFileToken")
    Route.get("getfiledbtoken", "DsoController.DownloadFileDBToken")
    Route.get("getlogo", "DsoController.getLogo")
    Route.get("getpublicfile", "DsoController.getPublicFile")
    Route.post("sendmailhr", "SendMailController.sendMailHR")
    Route.post("test", "DsoController.test")
    Route.post("convertreport", "ReportController.convert")
    Route.post("apipronoauth", "DsoController.CallAPIProcedureNoAuthen");
    Route.get("getfilenoauth", "DsoController.getFile")
    // Route.post("pushnotification2", "DsoController.pushNotification2")
}).prefix("api/dso")

Route.group(() => {
    Route.post("sendarticle", "APIController.FlowArticle")
    Route.post("sendtask", "APIController.FlowTask")
    Route.post("sendalarmbot", "APIController.FlowAlarmBot")
}).prefix("api/flow").middleware("user");

Route.group(() => {
    Route.post("sap", "APIController.callSAPWebservice")
}).prefix("api/wsdl").middleware("user");

Route.group(() => {
    Route.post("sendinvoice", "EinvoiceController.sendInvoiceToTaxOffice")
    Route.post("checkinvoicestatus", "EinvoiceController.checkInvoiceStatusFromTaxOffice")
    Route.post("einvoicepdfconvert", "EinvoiceController.einvoicePdfConvert")
    Route.post("getdatainvoice", "EinvoiceController.getDataFormEinvoice")
    Route.post("checktaxcode", "EinvoiceController.checkTaxCode")
    Route.post("getexchangerate", "EinvoiceController.getExchangeCurrency")
    Route.post("declare2xml", "EInvoiceController.convertDeclareUsingInvoiceToXML")
    Route.post("invoice2xml", "EInvoiceController.convertInvoiceToXML")
    Route.post("invoice2xmlfromclient", "EInvoiceController.convertInvoiceToXMLClient")
    Route.post("invalidinvoice2xml", "EInvoiceController.convertInvaliInvoiceToXML")
    Route.post("sendinvoice", "EInvoiceController.sendInvoiceToTaxOffice")
    Route.post("sendmail", "EInvoiceController.sendMail")
    Route.post("einvoicepdfconvert", "EinvoiceController.einvoicePdfConvert")
    Route.post("sendinvoicefromclient", "EInvoiceController.sendInvoiceToTaxOfficeFromClient")
    Route.post("checkinvoicestatus", "EInvoiceController.checkInvoiceStatusFromTaxOffice")
    Route.post("checkinvoicestatusfromclient", "EInvoiceController.checkInvoiceStatusFromClient")
    Route.post("senddeclaration", "EInvoiceController.sendDeclarationToTaxOffice")
    Route.post("senddeclarationfromclient", "EInvoiceController.sendDeclarationToTaxOfficeFromClient")
    Route.post("checkingdeclaration", "EInvoiceController.checkingDeclarations")
    Route.post("checkingdeclarationfromclient", "EInvoiceController.checkingDeclarationsFromClient")
    Route.post("sendinformadjustinvoice", "EInvoiceController.sendInformAdjustToTaxOffice")
    Route.post("sendinformadjustinvoicefromclient", "EInvoiceController.sendInformAdjustToTaxOfficeFromClient")
    Route.post("checkinformadjustinvoice", "EInvoiceController.checkInformAdjustToTaxOffice")
    Route.post("checkinformadjustinvoicefromclient", "EInvoiceController.checkInformAdjustToTaxOfficeFromClient")
    Route.post("sendpit", "EInvoiceController.sendPITToTaxOffice")
    Route.post("sendpos", "EInvoiceController.sendPOSToTaxOffice")
    Route.post("sendposlist", "EInvoiceController.sendPOSListToListTaxOffice")
    Route.post("getmst", "EInvoiceController.getTaxCode")
    Route.post("getpdf", "EInvoiceController.sendDataGetPDF")
    Route.post("viewpdf", "EInvoiceController.viewPDFFromClient")

    // send date erp to einvoice rr
    Route.post("checking-status-einvoice-client", "EInvoiceController.checkingStatusEinvoiceClient")
    Route.post("send-data-einvoice", "EInvoiceController.sendDataEinvoice")
    Route.post("insert-customer", "EInvoiceController.insertCustomer")
    Route.post("update-customer", "EInvoiceController.updateCustomer")
    Route.post("cancel-data-einvoice", "EInvoiceController.cancelDataEinvoice")


}).prefix("api/einvoice").middleware("user");
// Call API Wabooks-ERP interface data
Route.group(() => {
    //Route.post("wsearchcompanyforlogin", "APIController.callWaErpSearchingCompanyForLogin")
    //Route.post("wlogin", "APIController.callWaErpLogin")
    //Route.post("wserviceprocess", "APIController.callWaErpSVCProcess")
    Route.post("wserviceprocess", "APIController.callWaErpSVCProcess")
    
}).prefix("api/waerp").middleware("user");

// Frontend
Route.any("*", "NuxtController.render");