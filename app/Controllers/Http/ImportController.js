'use strict'
const Utils = use("Utils");
const Env = use("Env");
const Helpers = use("Helpers");
const Request = use("Request");
const ROOT_DIR_FILES = Env.get("ROOT_DIR_FILES", Helpers.tmpPath());
const ImportHelper = use('App/Helpers/ImportHelper');
const fs = use("fs");
const { transform } = require('camaro');
const DB_CONNECTION = Env.get("DB_CONNECTION");
const DBService = use("DBService");
const oracledb = require('oracledb');
const AES = use("App/Helpers/AES");
const libre = require('libreoffice-convert');
libre.convertAsync = require('util').promisify(libre.convert);
const fsPart = require('fs').promises;

class ImportController {

    async ImportExcel({ request, response, auth }) {
        try {

            var p_language = request.header("accept-language", "ENG")
            var p_crt_by = ""
            const user = await auth.getUser()
            if (user) {
                p_crt_by = user.USER_ID
            }

            let { import_info, tes_file_pk } = request.all();
            let para = [tes_file_pk, 'TES_FILE', '', ''];

            var imp = new ImportHelper(p_language, p_crt_by);

            if (DB_CONNECTION == "oracle") {
                oracledb.fetchAsBuffer = [oracledb.BLOB];
            }

            let result = await DBService.callProcCursor('SYS_SEL_IMP_FILE', para, p_language, p_crt_by);

            if (result) {
                let file_name = p_crt_by + "_" + result[0].FILE_NAME;
                let buffer = result[0].FILE_CONTENT;

                let tmp_file = Helpers.tmpPath(file_name);

                //excel load buffer bi loi nen phai save lai ra file temp
                await fs.writeFileSync(tmp_file, buffer);
                await imp.loadFile(tmp_file);

                let res = await imp.importData(import_info, p_language, p_crt_by);
                return response.send(Utils.response(true, "success", res));
            }

            return response.send(Utils.response(false, "error", result));
        } catch (e) {
            Utils.Logger({ LVL: "error", MODULE: "ImportController", FUNC: "ImportExcel", CONTENT: e.message })
            return response.send(null)
        }
    }

    async DownloadTemp({ request, response, auth }) {
        try {

            var p_language = request.header("accept-language", "ENG")
            var p_crt_by = ""
            const user = await auth.getUser()
            if (user) {
                p_crt_by = user.USER_ID
            }
            let { template } = request.all();

            let templateFile = Helpers.resourcesPath(template);

            let isExists = await fs.existsSync(templateFile);

            if (isExists) {
                Utils.Logger({ LVL: "error", MODULE: "ImportController", FUNC: "DownloadTemp", CONTENT: templateFile })
                return response.download(templateFile);
            }
            return response.send(null)
        } catch (e) {
            Utils.Logger({ LVL: "error", MODULE: "ImportController", FUNC: "DownloadTemp", CONTENT: e.message })
            return response.send(null)
        }
    }

    async UploadFileToFolderEInvoice({ request, response, auth }) {
        let p_crt_by = "";
        try {
            var p_language = request.header("accept-language", "ENG");
            const user = await auth.getUser();
            if (user) {
                p_crt_by = user.USER_ID;
            }
            const file = request.file("file");
            //console.error("faile", file);
            const file_size = file.size;
            const file_name = file.clientName;
            const file_ext = file.extname;
            const file_type = file.type;

            let { tei_company_pk, tei_einvoice_cloud_pk } = request.all();
            if (!tei_company_pk) {
                return response.send(
                    Utils.response(false, "missing_[tei_company_pk]_parameter", null)
                );
            }
            const folder = `eiv-ap/${tei_company_pk}`
            let file_path = await Utils.putFileRootPath(file, folder);
            file_path = ROOT_DIR_FILES + file_path
            console.log("file_path", file_path)
            if (file_path && file_path.indexOf(".xml") > 0) {
                tei_einvoice_cloud_pk = await this.extractXMLContent(file_path, p_language, p_crt_by, file_name);
                if (!isNaN(tei_einvoice_cloud_pk)) {
                    return response.send(
                        Utils.response(true, "upload_xml_file_sucessfull", { tei_einvoice_cloud_pk: tei_einvoice_cloud_pk })
                    );
                } else {
                    fs.unlinkSync(file_path);
                    return response.send(
                        Utils.response(false, "upload_xml_file_failed", { file_name: file_name, ermsg: tei_einvoice_cloud_pk })
                    );
                }
            } else if (file_path && file_path.indexOf(".pdf") > 0) {
                const pdfRelativePath = file_path.replace(ROOT_DIR_FILES, "");
                const result = await DBService.callProcCursor('ei_upd_tei_einvoice_cloud_pdf_file', [tei_einvoice_cloud_pk, pdfRelativePath], p_language, p_crt_by);
                return response.send(
                    Utils.response(true, "upload_pdf_file_sucessfull", null)
                );
            }
            return response.send(
                Utils.response(false, "failed_upload_file", file_path)
            );
        } catch (e) {
            console.error("UploadFileToFolderEInvoice", e.message)
            Utils.Logger({
                LVL: "error",
                MODULE: "ImportController",
                FUNC: "UploadFileToFolderEInvoice",
                CONTENT: e.message,
                CRT_BY: p_crt_by,
            });
            return response.send(Utils.response(false, e.message, null));
        }
    }

    async extractXMLContent(p_xml_path, p_language, p_crt_by, file_name) {
        try {
            let AESs = new AES();
            let xmlIntegrity = await AESs.xmlDigitalSignatureVerifier(p_xml_path)
            let einvoice_file_name = file_name

            const xmlContent = fs.readFileSync(p_xml_path, { encoding: 'utf8', flag: 'r' });

            let templateTTChungPath = 'HDon/DLHDon/TTChung';
            let templateTTHDLQuanPath = 'HDon/DLHDon/TTChung/TTHDLQuan';
            let templateNBanPath = 'HDon/DLHDon/NDHDon/NBan';
            let templateNMuaPath = 'HDon/DLHDon/NDHDon/NMua';
            let templateLTSuatPath = 'HDon/DLHDon/NDHDon/TToan/THTTLTSuat/LTSuat';
            let templateTTKhacPath = 'HDon/DLHDon/TTChung/TTKhac/TTin';
            let templateTToanPath = 'HDon/DLHDon/NDHDon/TToan';
            let templateDSHHDVuPath = 'HDon/DLHDon/NDHDon/DSHHDVu/HHDVu';
            let templateSigningTimeNBanPath = "HDon/DSCKS/NBan/Signature/Object/SignatureProperties/SignatureProperty";
            let templateSigningTimeCQTPath = "HDon/DSCKS/CQT/Signature/Object/SignatureProperties/SignatureProperty";
            let templateMCCQTPath = 'HDon';



            //console.log(xmlContent)
            let templateTTChung = [templateTTChungPath, {
                PBan: 'PBan',
                THDon: 'THDon',
                KHMSHDon: 'KHMSHDon',
                KHHDon: 'KHHDon',
                SHDon: 'SHDon',
                MHSo: 'MHSo',
                NLap: 'NLap',
                SBKe: 'SBKe',
                NBKe: 'NBKe',
                DVTTe: 'DVTTe',
                TGia: 'TGia',
                HTTToan: 'HTTToan',
                MSTTCGP: 'MSTTCGP',
                MSTDVNUNLHDon: 'MSTDVNUNLHDon',
                TDVNUNLHDon: 'TDVNUNLHDon',
                DCDVNUNLHDon: 'DCDVNUNLHDon'
            }];
            let jsonTTChung = await transform(xmlContent, templateTTChung);
            //console.log("jsonTTChung", jsonTTChung)
            if (jsonTTChung.length == 0) {
                templateTTChungPath = 'TDiep/DLieu/HDon/DLHDon/TTChung';
                templateTTHDLQuanPath = 'TDiep/DLieu/HDon/DLHDon/TTChung/TTHDLQuan';
                templateNBanPath = 'TDiep/DLieu/HDon/DLHDon/NDHDon/NBan';
                templateNMuaPath = 'TDiep/DLieu/HDon/DLHDon/NDHDon/NMua';
                templateLTSuatPath = 'TDiep/DLieu/HDon/DLHDon/NDHDon/TToan/THTTLTSuat/LTSuat';
                templateTTKhacPath = 'TDiep/DLieu/HDon/DLHDon/TTChung/TTKhac/TTin';
                templateTToanPath = 'TDiep/DLieu/HDon/DLHDon/NDHDon/TToan';
                templateDSHHDVuPath = 'TDiep/DLieu/HDon/DLHDon/NDHDon/DSHHDVu/HHDVu';
                templateSigningTimeNBanPath = "TDiep/DLieu/HDon/DSCKS/NBan/Signature/Object/SignatureProperties/SignatureProperty";
                templateSigningTimeCQTPath = "TDiep/DLieu/HDon/DSCKS/CQT/Signature/Object/SignatureProperties/SignatureProperty";
                templateMCCQTPath = 'TDiep/DLieu/HDon';

                templateTTChung = [templateTTChungPath, {
                    PBan: 'PBan',
                    THDon: 'THDon',
                    KHMSHDon: 'KHMSHDon',
                    KHHDon: 'KHHDon',
                    SHDon: 'SHDon',
                    MHSo: 'MHSo',
                    NLap: 'NLap',
                    SBKe: 'SBKe',
                    NBKe: 'NBKe',
                    DVTTe: 'DVTTe',
                    TGia: 'TGia',
                    HTTToan: 'HTTToan',
                    MSTTCGP: 'MSTTCGP',
                    MSTDVNUNLHDon: 'MSTDVNUNLHDon',
                    TDVNUNLHDon: 'TDVNUNLHDon',
                    DCDVNUNLHDon: 'DCDVNUNLHDon'
                }];

                jsonTTChung = await transform(xmlContent, templateTTChung);

            }

            const templateTTKhac = [templateTTKhacPath, {
                TTruong: 'TTruong',
                DLieu: 'DLieu'
            }]
            let jsonTTKhac = null
            try {
                jsonTTKhac = await transform(xmlContent, templateTTKhac);
            } catch (e) { }
            //console.log("jsonTTKhac", jsonTTKhac)
            let customField1 = '',
                customField2 = '',
                customField3 = '',
                customField4 = '',
                customField5 = '',
                customField6 = '',
                customField7 = '',
                customField8 = '',
                customField9 = '',
                customField10 = ''
            if (jsonTTKhac && jsonTTKhac.length > 0) {
                customField1 = jsonTTKhac[0].TTruong + ': ' + jsonTTKhac[0].DLieu
                if (jsonTTKhac.length > 1) {
                    customField2 = jsonTTKhac[1].TTruong + ': ' + jsonTTKhac[1].DLieu
                }
                if (jsonTTKhac.length > 2) {
                    customField2 = jsonTTKhac[1].TTruong + ': ' + jsonTTKhac[1].DLieu
                    customField3 = jsonTTKhac[2].TTruong + ': ' + jsonTTKhac[2].DLieu
                }
                if (jsonTTKhac.length > 3) {
                    customField2 = jsonTTKhac[1].TTruong + ': ' + jsonTTKhac[1].DLieu
                    customField3 = jsonTTKhac[2].TTruong + ': ' + jsonTTKhac[2].DLieu
                    customField4 = jsonTTKhac[3].TTruong + ': ' + jsonTTKhac[3].DLieu
                }
                if (jsonTTKhac.length > 4) {
                    customField2 = jsonTTKhac[1].TTruong + ': ' + jsonTTKhac[1].DLieu
                    customField3 = jsonTTKhac[2].TTruong + ': ' + jsonTTKhac[2].DLieu
                    customField4 = jsonTTKhac[3].TTruong + ': ' + jsonTTKhac[3].DLieu
                    customField5 = jsonTTKhac[4].TTruong + ': ' + jsonTTKhac[4].DLieu
                }
                if (jsonTTKhac.length > 5) {
                    customField2 = jsonTTKhac[1].TTruong + ': ' + jsonTTKhac[1].DLieu
                    customField3 = jsonTTKhac[2].TTruong + ': ' + jsonTTKhac[2].DLieu
                    customField4 = jsonTTKhac[3].TTruong + ': ' + jsonTTKhac[3].DLieu
                    customField5 = jsonTTKhac[4].TTruong + ': ' + jsonTTKhac[4].DLieu
                    customField6 = jsonTTKhac[5].TTruong + ': ' + jsonTTKhac[5].DLieu
                }
                if (jsonTTKhac.length > 6) {
                    customField2 = jsonTTKhac[1].TTruong + ': ' + jsonTTKhac[1].DLieu
                    customField3 = jsonTTKhac[2].TTruong + ': ' + jsonTTKhac[2].DLieu
                    customField4 = jsonTTKhac[3].TTruong + ': ' + jsonTTKhac[3].DLieu
                    customField5 = jsonTTKhac[4].TTruong + ': ' + jsonTTKhac[4].DLieu
                    customField6 = jsonTTKhac[5].TTruong + ': ' + jsonTTKhac[5].DLieu
                    customField7 = jsonTTKhac[6].TTruong + ': ' + jsonTTKhac[6].DLieu
                }
                if (jsonTTKhac.length > 7) {
                    customField2 = jsonTTKhac[1].TTruong + ': ' + jsonTTKhac[1].DLieu
                    customField3 = jsonTTKhac[2].TTruong + ': ' + jsonTTKhac[2].DLieu
                    customField4 = jsonTTKhac[3].TTruong + ': ' + jsonTTKhac[3].DLieu
                    customField5 = jsonTTKhac[4].TTruong + ': ' + jsonTTKhac[4].DLieu
                    customField6 = jsonTTKhac[5].TTruong + ': ' + jsonTTKhac[5].DLieu
                    customField7 = jsonTTKhac[6].TTruong + ': ' + jsonTTKhac[6].DLieu
                    customField8 = jsonTTKhac[7].TTruong + ': ' + jsonTTKhac[7].DLieu
                }
                if (jsonTTKhac.length > 8) {
                    customField2 = jsonTTKhac[1].TTruong + ': ' + jsonTTKhac[1].DLieu
                    customField3 = jsonTTKhac[2].TTruong + ': ' + jsonTTKhac[2].DLieu
                    customField4 = jsonTTKhac[3].TTruong + ': ' + jsonTTKhac[3].DLieu
                    customField5 = jsonTTKhac[4].TTruong + ': ' + jsonTTKhac[4].DLieu
                    customField6 = jsonTTKhac[5].TTruong + ': ' + jsonTTKhac[5].DLieu
                    customField7 = jsonTTKhac[6].TTruong + ': ' + jsonTTKhac[6].DLieu
                    customField8 = jsonTTKhac[7].TTruong + ': ' + jsonTTKhac[7].DLieu
                    customField9 = jsonTTKhac[8].TTruong + ': ' + jsonTTKhac[8].DLieu
                }
                if (jsonTTKhac.length > 9) {
                    customField2 = jsonTTKhac[1].TTruong + ': ' + jsonTTKhac[1].DLieu
                    customField3 = jsonTTKhac[2].TTruong + ': ' + jsonTTKhac[2].DLieu
                    customField4 = jsonTTKhac[3].TTruong + ': ' + jsonTTKhac[3].DLieu
                    customField5 = jsonTTKhac[4].TTruong + ': ' + jsonTTKhac[4].DLieu
                    customField6 = jsonTTKhac[5].TTruong + ': ' + jsonTTKhac[5].DLieu
                    customField7 = jsonTTKhac[6].TTruong + ': ' + jsonTTKhac[6].DLieu
                    customField8 = jsonTTKhac[7].TTruong + ': ' + jsonTTKhac[7].DLieu
                    customField9 = jsonTTKhac[8].TTruong + ': ' + jsonTTKhac[8].DLieu
                    customField10 = jsonTTKhac[9].TTruong + ': ' + jsonTTKhac[9].DLieu
                }
            }

            const templateTTHDLQuan = [templateTTHDLQuanPath, {
                TCHDon: 'TCHDon',
                LHDCLQuan: 'LHDCLQuan',
                KHMSHDCLQuan: 'KHMSHDCLQuan',
                SHDCLQuan: 'SHDCLQuan',
                NLHDCLQuan: 'NLHDCLQuan',
                GChu: 'GChu'
            }]
            const jsonTTHDLQuan = await transform(xmlContent, templateTTHDLQuan);
            //console.log("templateTTHDLQuan",jsonTTHDLQuan)

            const arrTTChung = [jsonTTChung[0].PBan, jsonTTChung[0].THDon, jsonTTChung[0].KHMSHDon, jsonTTChung[0].KHHDon, jsonTTChung[0].SHDon, jsonTTChung[0].MHSo, jsonTTChung[0].NLap, jsonTTChung[0].SBKe, jsonTTChung[0].NBKe,
            jsonTTChung[0].DVTTe, jsonTTChung[0].TGia, jsonTTChung[0].HTTToan, jsonTTChung[0].MSTTCGP, jsonTTChung[0].MSTDVNUNLHDon, jsonTTChung[0].TDVNUNLHDon, jsonTTChung[0].DCDVNUNLHDon
            ]
            const templateNBan = [templateNBanPath, {
                Ten: 'Ten',
                MST: 'MST',
                DChi: 'DChi',
                SDThoai: 'SDThoai',
                DCTDTu: 'DCTDTu',
                STKNHang: 'STKNHang',
                NNBSTKNHang: 'NNBSTKNHang',
                TNHang: 'TNHang',
                Fax: 'Fax',
                Website: 'Website',
                TTKhac: 'TTKhac'

            }]
            const jsonNBan = await transform(xmlContent, templateNBan);
            const arrNBan = [jsonNBan[0].Ten, jsonNBan[0].MST, jsonNBan[0].DChi, jsonNBan[0].SDThoai, jsonNBan[0].DCTDTu, jsonNBan[0].STKNHang, jsonNBan[0].NNBSTKNHang, jsonNBan[0].TNHang, jsonNBan[0].Fax, jsonNBan[0].Website, jsonNBan[0].TTKhac];
            //console.log("jsonNBan",jsonNBan)
            const templateNMua = [templateNMuaPath, {
                Ten: 'Ten',
                MST: 'MST',
                DChi: 'DChi',
                SDThoai: 'SDThoai',
                DCTDTu: 'DCTDTu',
                HVTNMHang: 'HVTNMHang',
                STKNHang: 'STKNHang',
                TNHang: 'TNHang',
                TTKhac: 'TTKhac'
            }]
            const jsonNMua = await transform(xmlContent, templateNMua);
            //console.log("jsonNMua",jsonNMua)
            const arrNMua = [jsonNMua[0].Ten, jsonNMua[0].MST, jsonNMua[0].DChi, jsonNMua[0].SDThoai, jsonNMua[0].DCTDTu, jsonNMua[0].HVTNMHang, jsonNMua[0].STKNHang, jsonNMua[0].TNHang, jsonNMua[0].TTKhac];
            const templateLTSuat = [templateLTSuatPath, {
                TSuat: 'TSuat',
                ThTien: 'ThTien',
                TThue: 'TThue'
            }]
            const jsonLTSuat = await transform(xmlContent, templateLTSuat);
            //console.log("jsonLTSuat",jsonLTSuat)
            let arrLTSuat = [];
            if (jsonLTSuat && jsonLTSuat.length > 0) {
                arrLTSuat = [jsonLTSuat[0].TSuat, jsonLTSuat[0].ThTien, jsonLTSuat[0].TThue];
            } else {
                arrLTSuat = ['', 0, 0];
            }

            const templateTToan = [templateTToanPath, {
                TgTCThue: 'TgTCThue',
                TgTThue: 'TgTThue',
                TTCKTMai: 'TTCKTMai',
                TgTTTBSo: 'TgTTTBSo',
                TgTTTBChu: 'TgTTTBChu'
            }]
            const jsonTToan = await transform(xmlContent, templateTToan);
            //console.log("jsonTToan",jsonTToan)
            let arrTToan = [];
            arrTToan = [jsonTToan[0].TgTCThue, jsonTToan[0].TgTThue, jsonTToan[0].TTCKTMai, jsonTToan[0].TgTTTBSo, jsonTToan[0].TgTTTBChu];
            const templateMCCQT = [templateMCCQTPath, {
                MCCQT: 'MCCQT'
            }]
            const jsonMCCQT = await transform(xmlContent, templateMCCQT);
            //console.log(jsonMCCQT)
            const arrMCCQT = [jsonMCCQT[0].MCCQT];
            const templateDSHHDVu = [templateDSHHDVuPath, {
                TChat: 'TChat',
                STT: 'STT',
                MHHDVu: 'MHHDVu',
                THHDVu: 'THHDVu',
                DVTinh: 'DVTinh',
                SLuong: 'SLuong',
                DGia: 'DGia',
                TLCKhau: 'TLCKhau',
                STCKhau: 'STCKhau',
                ThTien: 'ThTien',
                TSuat: 'TSuat'
            }]

            const templateSigningTimeNBan = [
                templateSigningTimeNBanPath,
                {
                    SigningTimeNBan: "SigningTime"
                },
            ];
            const jsonSigningTimeNBan = await transform(xmlContent, templateSigningTimeNBan);

            const arrSigningTimeNBan = [
                jsonSigningTimeNBan[0].SigningTimeNBan
            ];

            const templateSigningTimeCQT = [
                templateSigningTimeCQTPath,
                {
                    SigningTimeCQT: "SigningTime"
                },
            ];
            const jsonSigningTimeCQT = await transform(xmlContent, templateSigningTimeCQT);
            let arrSigningTimeCQT = [];
            if (jsonSigningTimeCQT && jsonSigningTimeCQT.length > 0) {
                arrSigningTimeCQT = [
                    jsonSigningTimeCQT[0].SigningTimeCQT
                ];
            } else {
                arrSigningTimeCQT = [''];
            }
            let masterPara = arrTTChung.concat(arrNBan).concat(arrNMua).concat(arrLTSuat).concat(arrTToan).concat(arrMCCQT);
            const xmlRelativePath = p_xml_path.replace(ROOT_DIR_FILES, "");
            masterPara = masterPara.concat(["", xmlRelativePath, "", ""]);
            if (jsonTTHDLQuan && jsonTTHDLQuan.length > 0) {
                masterPara = masterPara.concat([jsonTTHDLQuan[0].TCHDon, jsonTTHDLQuan[0].LHDCLQuan, jsonTTHDLQuan[0].KHMSHDCLQuan, jsonTTHDLQuan[0].SHDCLQuan, jsonTTHDLQuan[0].NLHDCLQuan, jsonTTHDLQuan[0].GChu, '']);
            } else {
                masterPara = masterPara.concat(['', '', '', '', '', '', '']);
            }
            masterPara = masterPara.concat([customField1, customField2, customField3, customField4, customField5, customField6, customField7, customField8, customField9, customField10]);
            //console.log("masterPara",masterPara)    
            masterPara = masterPara.concat(arrSigningTimeNBan).concat(arrSigningTimeCQT);
            masterPara = masterPara.concat([xmlIntegrity])
            masterPara = masterPara.concat([einvoice_file_name])
            const master = await DBService.callProcCursor('ei_upd_tei_einvoice_cloud', masterPara, p_language, p_crt_by);
            console.log("master", master);
            if (master && master[0].PK > 0) {
                let jsonDSHHDVu = await transform(xmlContent, templateDSHHDVu);
                //console.log(jsonDSHHDVu)
                for (let i = 0; i < jsonDSHHDVu.length; i++) {
                    if (!jsonDSHHDVu[i].hasOwnProperty("TSuat")) {
                        jsonDSHHDVu[i].TSuat = "";
                    }
                    const detailPara = [master[0].PK, jsonDSHHDVu[i].TChat, jsonDSHHDVu[i].STT, jsonDSHHDVu[i].MHHDVu, jsonDSHHDVu[i].THHDVu, jsonDSHHDVu[i].DVTinh, jsonDSHHDVu[i].SLuong, jsonDSHHDVu[i].DGia, jsonDSHHDVu[i].ThTien, jsonDSHHDVu[i].TLCKhau, jsonDSHHDVu[i].STCKhau, jsonDSHHDVu[i].TSuat];
                    const detail = await DBService.callProcCursor('ei_upd_tei_einvoiced_cloud', detailPara, p_language, p_crt_by);
                    console.log("detail", detail);
                }
                return master[0].PK;
            } else {
                if (master && master.length > 0) {
                    return master[0].STATUS;
                }
                return master.message;
            }
        } catch (e) {
            console.log("extractXMLContent", e.message)
            Utils.Logger({ LVL: "error", MODULE: "ImportController", FUNC: "extractXMLContent", CONTENT: e.message })
            return e.message;
        }
    }

    async UploadFileToFolderTKHQ({ request, response, auth }) {
        let p_crt_by = "";
        try {
            var p_language = request.header("accept-language", "ENG");
            const user = await auth.getUser();
            if (user) {
                p_crt_by = user.USER_ID;
            }
            const file = request.file("file");
            // console.log(file)
            const file_size = file.size;
            const file_name = file.clientName;
            const file_ext = file.extname;
            const file_type = file.type;

            let { user_pk } = request.all();
            if (!user_pk) {
                return response.send(
                    Utils.response(false, "missing_[user_pk]_parameter", null)
                );
            }
            const folder = `tkhq/${user_pk}`
            let file_path = await Utils.putFileRootPath(file, folder);
            file_path = ROOT_DIR_FILES + file_path
            // console.log("root_directory", root_directory)
            //  console.log("file_path", file_path)
            if (file_path && file_path.indexOf(".xml") > 0) {
                let tei_ecus_declare_pk = await this.extractXMLTKHQContent(file_path, p_language, p_crt_by);
                if (tei_ecus_declare_pk > 0) {
                    return response.send(
                        Utils.response(true, "upload_xml_file_sucessfull", { tei_ecus_declare_pk: tei_ecus_declare_pk })
                    );
                }
            } else if (file_path && file_path.indexOf(".pdf") > 0) {
                const pdfRelativePath = file_path.replace(ROOT_DIR_FILES, "");
                const result = await DBService.callProcCursor('ei_upd_tei_ecus_declare_pdf_file', [tei_ecus_declare_pk, pdfRelativePath], p_language, p_crt_by);
                return response.send(
                    Utils.response(true, "upload_pdf_file_sucessfull", null)
                );
            }
            return response.send(
                Utils.response(false, "failed_upload_file", file_path)
            );
        } catch (e) {
            Utils.Logger({
                LVL: "error",
                MODULE: "ImportController",
                FUNC: "UploadFileToFolderTKHQ",
                CONTENT: e.message,
                CRT_BY: p_crt_by,
            });
            return response.send(Utils.response(false, e.message, null));
        }

    }

    async extractXMLTKHQContent(p_xml_path, p_language, p_crt_by) {
        try {
            const xmlContent = fs.readFileSync(p_xml_path, { encoding: 'utf8', flag: 'r' });

            const Data = ['Root/DToKhaiMDIDs/DToKhaiMD/Data', {
                DToKhaiMDID: "_DToKhaiMDID",
                XorN: "_XorN",
                SOTK: "SOTK",
                SOTK_DAU_TIEN: "SOTK_DAU_TIEN",
                SOTK_NHANH: "SOTK_NHANH",
                SOTK_TONG: "SOTK_TONG",
                SOTK_TN_TX: "SOTK_TN_TX",
                MA_LH: "MA_LH",
                MA_HQ: "MA_HQ",
                TEN_HQ: "TEN_HQ",
                NAMDK: "NAMDK",
                NGAY_DK: "NGAY_DK",
                MA_DV: "MA_DV",
                MA_BC_DV: "MA_BC_DV",
                DIA_CHI_DV: "DIA_CHI_DV",
                SO_DT_DV: "SO_DT_DV",
                MA_DVUT: "MA_DVUT",
                DV_DT: "DV_DT",
                MA_BC_DT: "MA_BC_DT",
                MA_PTVT: "MA_PTVT",
                TEN_PTVT: "TEN_PTVT",
                NGAYKH: "NGAYKH",
                NGAYDEN: "NGAYDEN",
                VAN_DON: "VAN_DON",
                MA_CK: "MA_CK",
                TEN_CK: "TEN_CK",
                MA_CANGNN: "MA_CANGNN",
                CANGNN: "CANGNN",
                MA_GP: "MA_GP",
                SO_GP: "SO_GP",
                NGAY_GP: "NGAY_GP",
                NGAY_HHGP: "NGAY_HHGP",
                SO_HD: "SO_HD",
                TYGIA_USD: "TYGIA_USD",
                NGAY_HD: "NGAY_HD",
                NGAY_HHHD: "NGAY_HHHD",
                NUOC_XK: "NUOC_XK",
                NUOC_NK: "NUOC_NK",
                MA_GH: "MA_GH",
                SOHANG: "SOHANG",
                MA_PTTT: "MA_PTTT",
                MA_NT: "MA_NT",
                TYGIA_VND: "TYGIA_VND",
                MA_NT_TY_GIA_VND: "MA_NT_TY_GIA_VND",
                LEPHI_HQ: "LEPHI_HQ",
                BL_LPHQ: "BL_LPHQ",
                GIAYTO: "GIAYTO",
                TENCH: "TENCH",
                NGAY_KB: "NGAY_KB",
                USER_DK: "USER_DK",
                DDIEM_KH: "DDIEM_KH",
                PTHUC_KH: "PTHUC_KH",
                NGAY_KH: "NGAY_KH",
                USER_KH1: "USER_KH1",
                USER_KH2: "USER_KH2",
                USER_PCKH: "USER_PCKH",
                MA_PHI_BH: "MA_PHI_BH",
                MA_NT_PHI_BH: "MA_NT_PHI_BH",
                PHI_BH: "PHI_BH",
                SO_DK_PHI_BH: "SO_DK_PHI_BH",
                MA_PHI_VC: "MA_PHI_VC",
                MA_NT_PHI_VC: "MA_NT_PHI_VC",
                PHI_VC: "PHI_VC",
                NGAY_TH: "NGAY_TH",
                USER_TH: "USER_TH",
                TONGTGKB: "TONGTGKB",
                TONGTGTT: "TONGTGTT",
                MA_NT_TGTT: "MA_NT_TGTT",
                QUY_VND: "QUY_VND",
                TR_LUONG: "TR_LUONG",
                DVT_TR_LUONG: "DVT_TR_LUONG",
                SO_KIEN: "SO_KIEN",
                DVT_KIEN: "DVT_KIEN",
                KY_HIEU_SO_HIEU: "KY_HIEU_SO_HIEU",
                SO_CONTAINER: "SO_CONTAINER",
                SO_CONTAINER40: "SO_CONTAINER40",
                SO_CONTAINER45: "SO_CONTAINER45",
                NGUOINHAP: "NGUOINHAP",
                NGAYNHAP: "NGAYNHAP",
                PLUONG: "PLUONG",
                PASS_DK: "PASS_DK",
                PASS_KH: "PASS_KH",
                PASS_TH: "PASS_TH",
                PASS_GC: "PASS_GC",
                TTTK: "TTTK",
                PPT_GTGT: "PPT_GTGT",
                PPT_GTGTUT: "PPT_GTGTUT",
                DATRUYEN: "DATRUYEN",
                MA_DVKT: "MA_DVKT",
                THANHKHOAN: "THANHKHOAN",
                NGAY_THN_THX: "NGAY_THN_THX",
                PPT_GTGTKT: "PPT_GTGTKT",
                NGAY_GIAOTK: "NGAY_GIAOTK",
                NGAY_NHANTK: "NGAY_NHANTK",
                NGAY_LUUTK: "NGAY_LUUTK",
                NVPSINH: "NVPSINH",
                KIEMHOANK: "KIEMHOANK",
                MA_HDTM: "MA_HDTM",
                SO_TN_HDTM: "SO_TN_HDTM",
                SO_HDTM: "SO_HDTM",
                NGAY_HDTM: "NGAY_HDTM",
                MA_PL_GIA_HDTM: "MA_PL_GIA_HDTM",
                TONGTG_HDTM: "TONGTG_HDTM",
                NGAY_VANDON: "NGAY_VANDON",
                THUE: "THUE",
                HTKT: "HTKT",
                TYLE_KT: "TYLE_KT",
                DENNGAY_KH: "DENNGAY_KH",
                DAIDIEN_DN: "DAIDIEN_DN",
                NGUOIQDHTKT: "NGUOIQDHTKT",
                SO_PLTK: "SO_PLTK",
                XUAT_NPL_SP: "XUAT_NPL_SP",
                THANH_LY: "THANH_LY",
                SoTN: "_SoTN",
                NgayTN: "_NgayTN",
                NamTN: "_NamTN",
                MaHQTN: "_MaHQTN",
                TrangThai: "_TrangThai",
                Ten_DV_L1: "_Ten_DV_L1",
                Ten_DV_L2: "_Ten_DV_L2",
                Ten_DV_L3: "_Ten_DV_L3",
                DV_DT_L2: "_DV_DT_L2",
                DV_DT_L3: "_DV_DT_L3",
                TEN_DVUT: "_TEN_DVUT",
                TEN_DVKT: "_TEN_DVKT",
                TR_LUONG_Net: "_TR_LUONG_Net",
                DToKhaiMDIDTempt: "_DToKhaiMDIDTempt",
                CT_HDTM_BC: "_CT_HDTM_BC",
                CT_HDTM_BS: "_CT_HDTM_BS",
                CT_HDonTM_BC: "_CT_HDonTM_BC",
                CT_HDonTM_BS: "_CT_HDonTM_BS",
                CT_BK_BC: "_CT_BK_BC",
                CT_BK_BS: "_CT_BK_BS",
                CT_VD_BC: "_CT_VD_BC",
                CT_VD_BS: "_CT_VD_BS",
                CT_Them1_Ten: "_CT_Them1_Ten",
                CT_Them1_BC: "_CT_Them1_BC",
                CT_Them1_BS: "_CT_Them1_BS",
                CT_Them2_Ten: "_CT_Them2_Ten",
                CT_Them2_BC: "_CT_Them2_BC",
                CT_Them2_BS: "_CT_Them2_BS",
                CT_Them3_Ten: "_CT_Them3_Ten",
                CT_Them3_BC: "_CT_Them3_BC",
                CT_Them3_BS: "_CT_Them3_BS",
                MA_PHU_Max: "_MA_PHU_Max",
                THANH_LY_BackUp: "_THANH_LY_BackUp",
                IsNhanHS: "IsNhanHS",
                HeSoNhanTGTT: "HeSoNhanTGTT",
                isPhanBo: "isPhanBo",
                MA_NT_THUE: "MA_NT_THUE",
                TongTienThue: "TongTienThue",
                TongTienThueKH: "TongTienThueKH",
                TongTienThueTH: "TongTienThueTH",
                HeSoCIFDN: "HeSoCIFDN",
                isUseHeSoCIFDN: "isUseHeSoCIFDN",
                TTTK_HQ: "TTTK_HQ",
                SoHDXK: "SoHDXK",
                NgayDKNhapHang: "NgayDKNhapHang",
                KDT_WAITING: "KDT_WAITING",
                KDT_REFERENCES: "KDT_REFERENCES",
                KDT_LASTINFO: "KDT_LASTINFO",
                IsNewInfomation: "IsNewInfomation",
                DToKhaiMDID_ERP: "DToKhaiMDID_ERP",
                DVan_DonID: "DVan_DonID",
                MA_HQ_CK: "MA_HQ_CK",
                MessageID: "MessageID",
                LyDoHuy: "LyDoHuy",
                TinhTrang_NoCO: "TinhTrang_NoCO",
                TinhTrang_HUY: "TinhTrang_HUY",
                PreToKhaiID: "PreToKhaiID",
                PhienBan_TK: "PhienBan_TK",
                NextToKhaiID: "NextToKhaiID",
                HuongDanPL: "HuongDanPL",
                Chuyen_Cua_Khau: "Chuyen_Cua_Khau",
                Noi_Dung_Chuyen_Cua_Khau: "Noi_Dung_Chuyen_Cua_Khau",
                LyDoSua: "LyDoSua",
                TTTK_HUY: "TTTK_HUY",
                Ma_MID: "Ma_MID",
                NGAY_HOANTHANH: "NGAY_HOANTHANH",
                ThueTuyetDoi: "ThueTuyetDoi",
                IsDaDuyet: "IsDaDuyet",
                NguoiDuyet: "NguoiDuyet",
                NgayDuyet: "NgayDuyet",
                GhiChuDuyet: "GhiChuDuyet",
                IsExport: "IsExport",
                IsSign: "IsSign",
                SignData: "SignData",
                SoHSTK: "SoHSTK",
                HDGCID: "HDGCID",
                SO_HD_CT: "SO_HD_CT",
                NGAY_HD_CT: "NGAY_HD_CT",
                NGAY_HHHD_CT: "NGAY_HHHD_CT",
                DIA_DIEM_GIAO_HANG: "DIA_DIEM_GIAO_HANG",
                NGAY_GIAO_HANG: "NGAY_GIAO_HANG",
                MA_NGUOI_CHI_DINH_CT: "MA_NGUOI_CHI_DINH_CT",
                TEN_NGUOI_CHI_DINH_CT: "TEN_NGUOI_CHI_DINH_CT",
                IsToKhaiCT: "IsToKhaiCT",
                DeXuatKhac: "DeXuatKhac",
                IsToKhaiNho: "IsToKhaiNho",
                HUY_MA_LY_DO: "HUY_MA_LY_DO",
                HUY_MA_LOAI: "HUY_MA_LOAI",
                HUY_TrangThai: "HUY_TrangThai",
                HUY_SOTN: "HUY_SOTN",
                HUY_NAMTN: "HUY_NAMTN",
                HUY_NgayTN: "HUY_NgayTN",
                HUY_MessageID: "HUY_MessageID",
                HUY_IsSign: "HUY_IsSign",
                HUY_SignData: "HUY_SignData",
                TUYEN_VAN_CHUYEN: "TUYEN_VAN_CHUYEN",
                Ten_Nguoi_Nhan_Hang: "Ten_Nguoi_Nhan_Hang",
                Ma_Nguoi_Nhan_Hang: "Ma_Nguoi_Nhan_Hang",
                Ten_Nguoi_Giao_Hang: "Ten_Nguoi_Giao_Hang",
                Ma_Nguoi_Giao_Hang: "Ma_Nguoi_Giao_Hang",
                IsTQDT: "IsTQDT",
                KieuPhanBo: "KieuPhanBo",
                Chon: "Chon",
                ThongTinPhanHoi: "ThongTinPhanHoi",
                PHI_KHAC: "PHI_KHAC",
                TEN_PHI_KHAC: "TEN_PHI_KHAC",
                HuyKB: "HuyKB",
                NGAY_BAT_DAU: "NGAY_BAT_DAU",
                NGAY_KET_THUC: "NGAY_KET_THUC",
                HUY_KDT_REFERENCES: "HUY_KDT_REFERENCES",
                HUY_KDT_WAITING: "HUY_KDT_WAITING",
                HUY_KDT_LASTINFO: "HUY_KDT_LASTINFO",
                isUseHeSoI: "isUseHeSoI",
                NGAY_THUC_XN: "NGAY_THUC_XN",
                PLUONG_NOIDUNG: "PLUONG_NOIDUNG",
                IS_TRINH_KY: "IS_TRINH_KY",
                HUY_IS_TRINH_KY: "HUY_IS_TRINH_KY",
                IsKHONG_VAN_DON: "IsKHONG_VAN_DON",
                IS_AN_HAN_THUE: "IS_AN_HAN_THUE",
                AN_HAN_THUE_LD: "AN_HAN_THUE_LD",
                AN_HAN_THUE_SN: "AN_HAN_THUE_SN",
                IS_DAM_BAO_THUE: "IS_DAM_BAO_THUE",
                DAM_BAO_THUE_HINH_THUC: "DAM_BAO_THUE_HINH_THUC",
                DAM_BAO_THUE_TRI_GIA: "DAM_BAO_THUE_TRI_GIA",
                DAM_BAO_THUE_NGAY_BD: "DAM_BAO_THUE_NGAY_BD",
                DAM_BAO_THUE_NGAY_KT: "DAM_BAO_THUE_NGAY_KT",
                DAM_BAO_MA_NG_HANG: "DAM_BAO_MA_NG_HANG",
                DAM_BAO_NAM_PHAT_HANH: "DAM_BAO_NAM_PHAT_HANH",
                DAM_BAO_KY_HIEU_CT: "DAM_BAO_KY_HIEU_CT",
                DAM_BAO_SO_CT: "DAM_BAO_SO_CT",
                MA_THOI_HAN_NOP_THUE: "MA_THOI_HAN_NOP_THUE",
                SO_CONTAINER_KHAC: "SO_CONTAINER_KHAC",
                NGAY_TAM_NHAP_HH: "NGAY_TAM_NHAP_HH",
                THONG_TU: "THONG_TU",
                MA_NGHIEP_VU: "MA_NGHIEP_VU",
                GUID1: "GUID1",
                NHOMTK: "NHOMTK",
                ISTEST: "ISTEST",
                IsVNACCS: "IsVNACCS",
                APP_NAME: "APP_NAME",
                IsVersion2: "IsVersion2",
                TRANG_THAI_SAMSUNG: "TRANG_THAI_SAMSUNG",
                THANH_LY_KBT: "THANH_LY_KBT",
                SECSIONID: "SECSIONID",
                IsUyQuyen: "IsUyQuyen",
                DSCH810AWBID: "DSCH810AWBID",
                IS_DUYET: "IS_DUYET",
                USER_DUYET: "USER_DUYET",
                isTinhThue: "isTinhThue",
                isCongPhi: "isCongPhi",
                isCongCuoc: "isCongCuoc",
                IS_MOVE_TK: "IS_MOVE_TK",
            }]
            const jsonData = await transform(xmlContent, Data);

            const DataDBTB = ['Root/DTBTs/DTBT/Data', {
                DTBTID: "DTBTID",
                MA_CUC_HQ: "MA_CUC_HQ",
                TEN_CUC_HQ: "TEN_CUC_HQ",
                Loai_TBT: "Loai_TBT",
                SO_TBT: "SO_TBT",
                Ngay_TBT: "Ngay_TBT",
                Ngay_HH_TBT: "Ngay_HH_TBT",
                Tong_TH: "Tong_TH",
                TaiKhoan: "TaiKhoan",
                Ten_KhoBac: "Ten_KhoBac",
                TEN_DV: "TEN_DV",
                BAO_LANH_TEN_NH: "BAO_LANH_TEN_NH",
                BAO_LANH_MA_NH: "BAO_LANH_MA_NH",
                BAO_LANH_MA_A: "BAO_LANH_MA_A",
                BAO_LANH_KY_HIEU: "BAO_LANH_KY_HIEU",
                BAO_LANH_SO_CT: "BAO_LANH_SO_CT",
                BAO_LANH_TEN_LOAI: "BAO_LANH_TEN_LOAI",
                TRA_THAY_TEN_NH: "TRA_THAY_TEN_NH",
                TRA_THAY_MA_NH: "TRA_THAY_MA_NH",
                TRA_THAY_MA_A: "TRA_THAY_MA_A",
                TRA_THAY_KY_HIEU: "TRA_THAY_KY_HIEU",
                TRA_THAY_SO_CT: "TRA_THAY_SO_CT",
                TEN_SAC_THUE: "TEN_SAC_THUE",
                TIEU_MUC: "TIEU_MUC",
                TIEN_THUE: "TIEN_THUE",
                TIEN_THUE_MIEN: "TIEN_THUE_MIEN",
                TIEN_THUE_GIAM: "TIEN_THUE_GIAM",
                TIEN_THUE_NOP: "TIEN_THUE_NOP",
                TIEN_THUE_AN_DINH: "TIEN_THUE_AN_DINH",
                TIEN_THUE_CHENH: "TIEN_THUE_CHENH",
                TEN_SAC_THUE2: "TEN_SAC_THUE2",
                TIEU_MUC2: "TIEU_MUC2",
                TIEN_THUE2: "TIEN_THUE2",
                TIEN_THUE_MIEN2: "TIEN_THUE_MIEN2",
                TIEN_THUE_GIAM2: "TIEN_THUE_GIAM2",
                TIEN_THUE_NOP2: "TIEN_THUE_NOP2",
                TIEN_THUE_AN_DINH2: "TIEN_THUE_AN_DINH2",
                TIEN_THUE_CHENH2: "TIEN_THUE_CHENH2",
                TEN_SAC_THUE3: "TEN_SAC_THUE3",
                TIEU_MUC3: "TIEU_MUC3",
                TIEN_THUE3: "TIEN_THUE3",
                TIEN_THUE_MIEN3: "TIEN_THUE_MIEN3",
                TIEN_THUE_GIAM3: "TIEN_THUE_GIAM3",
                TIEN_THUE_NOP3: "TIEN_THUE_NOP3",
                TIEN_THUE_AN_DINH3: "TIEN_THUE_AN_DINH3",
                TIEN_THUE_CHENH3: "TIEN_THUE_CHENH3",
                TEN_SAC_THUE4: "TEN_SAC_THUE4",
                TIEU_MUC4: "TIEU_MUC4",
                TIEN_THUE4: "TIEN_THUE4",
                TIEN_THUE_MIEN4: "TIEN_THUE_MIEN4",
                TIEN_THUE_GIAM4: "TIEN_THUE_GIAM4",
                TIEN_THUE_NOP4: "TIEN_THUE_NOP4",
                TIEN_THUE_AN_DINH4: "TIEN_THUE_AN_DINH4",
                TIEN_THUE_CHENH4: "TIEN_THUE_CHENH4",
                TEN_SAC_THUE5: "TEN_SAC_THUE5",
                TIEU_MUC5: "TIEU_MUC5",
                TIEN_THUE5: "TIEN_THUE5",
                TIEN_THUE_MIEN5: "TIEN_THUE_MIEN5",
                TIEN_THUE_GIAM5: "TIEN_THUE_GIAM5",
                TIEN_THUE_NOP5: "TIEN_THUE_NOP5",
                TIEN_THUE_AN_DINH5: "TIEN_THUE_AN_DINH5",
                TIEN_THUE_CHENH5: "TIEN_THUE_CHENH5",
                TEN_SAC_THUE6: "TEN_SAC_THUE6",
                TIEU_MUC6: "TIEU_MUC6",
                TIEN_THUE6: "TIEN_THUE6",
                TIEN_THUE_MIEN6: "TIEN_THUE_MIEN6",
                TIEN_THUE_GIAM6: "TIEN_THUE_GIAM6",
                TIEN_THUE_NOP6: "TIEN_THUE_NOP6",
                TIEN_THUE_AN_DINH6: "TIEN_THUE_AN_DINH6",
                TIEN_THUE_CHENH6: "TIEN_THUE_CHENH6",
                TONG_TIEN_THUE: "TONG_TIEN_THUE",
                TONG_TIEN_THUE_MIEN: "TONG_TIEN_THUE_MIEN",
                TONG_TIEN_THUE_GIAM: "TONG_TIEN_THUE_GIAM",
                TONG_TIEN_THUE_NOP: "TONG_TIEN_THUE_NOP",
                TONG_TIEN_THUE_AN_DINH: "TONG_TIEN_THUE_AN_DINH",
                TONG_TIEN_THUE_CHENH: "TONG_TIEN_THUE_CHENH",
                TY_GIA: "TY_GIA",
                SO_NGAY_AN_HAN: "SO_NGAY_AN_HAN",
                NGAY_HET_HAN_TNTX: "NGAY_HET_HAN_TNTX",
                LAI_PHAT_CHAM_NOP: "LAI_PHAT_CHAM_NOP",
                BAO_LANH_NAM_CT: "BAO_LANH_NAM_CT",
                TRA_THAY_NAM_CT: "TRA_THAY_NAM_CT",
                LOAI_TOKHAI: "LOAI_TOKHAI",
            }]
            const jsonDataDBTB = await transform(xmlContent, DataDBTB);
            // console.log("jsonDataDBTB",jsonDataDBTB)
            const DataCont = ['Root/DTOKHAIMD_VNACCSs/DTOKHAIMD_VNACCS/Data', {
                DTOKHAIMD_VNACCSID: "DTOKHAIMD_VNACCSID",
                DToKhaiMDID: "_DToKhaiMDID",
                CONTAINER_NO: "CONTAINER_NO",
                CONTAINER_NO2: "CONTAINER_NO2",
                CONTAINER_NO3: "CONTAINER_NO3",
                CONTAINER_NO4: "CONTAINER_NO4",
                CONTAINER_NO5: "CONTAINER_NO5",
                CONTAINER_NO6: "CONTAINER_NO6",
                CONTAINER_NO7: "CONTAINER_NO7",
                CONTAINER_NO8: "CONTAINER_NO8",
                CONTAINER_NO9: "CONTAINER_NO9",
                CONTAINER_NO10: "CONTAINER_NO10",
                CONTAINER_NO11: "CONTAINER_NO11",
                CONTAINER_NO12: "CONTAINER_NO12",
                CONTAINER_NO13: "CONTAINER_NO13",
                CONTAINER_NO14: "CONTAINER_NO14",
                CONTAINER_NO15: "CONTAINER_NO15",
                CONTAINER_NO16: "CONTAINER_NO16",
                CONTAINER_NO17: "CONTAINER_NO17",
                CONTAINER_NO18: "CONTAINER_NO18",
                CONTAINER_NO19: "CONTAINER_NO19",
                CONTAINER_NO20: "CONTAINER_NO20",
                CONTAINER_NO21: "CONTAINER_NO21",
                CONTAINER_NO22: "CONTAINER_NO22",
                CONTAINER_NO23: "CONTAINER_NO23",
                CONTAINER_NO24: "CONTAINER_NO24",
                CONTAINER_NO25: "CONTAINER_NO25",
                CONTAINER_NO26: "CONTAINER_NO26",
                CONTAINER_NO27: "CONTAINER_NO27",
                CONTAINER_NO28: "CONTAINER_NO28",
                CONTAINER_NO29: "CONTAINER_NO29",
                CONTAINER_NO30: "CONTAINER_NO30",
                CONTAINER_NO31: "CONTAINER_NO31",
                CONTAINER_NO32: "CONTAINER_NO32",
                CONTAINER_NO33: "CONTAINER_NO33",
                CONTAINER_NO34: "CONTAINER_NO34",
                CONTAINER_NO35: "CONTAINER_NO35",
                CONTAINER_NO36: "CONTAINER_NO36",
                CONTAINER_NO37: "CONTAINER_NO37",
                CONTAINER_NO38: "CONTAINER_NO38",
                CONTAINER_NO39: "CONTAINER_NO39",
                CONTAINER_NO40: "CONTAINER_NO40",
                CONTAINER_NO41: "CONTAINER_NO41",
                CONTAINER_NO42: "CONTAINER_NO42",
                CONTAINER_NO43: "CONTAINER_NO43",
                CONTAINER_NO44: "CONTAINER_NO44",
                CONTAINER_NO45: "CONTAINER_NO45",
                CONTAINER_NO46: "CONTAINER_NO46",
                CONTAINER_NO47: "CONTAINER_NO47",
                CONTAINER_NO48: "CONTAINER_NO48",
                CONTAINER_NO49: "CONTAINER_NO49",
                CONTAINER_NO50: "CONTAINER_NO50",
                MA_KHAI_TRGIA: "MA_KHAI_TRGIA",
                SO_TN_KHAI_TRGIA: "SO_TN_KHAI_TRGIA",
                MA_NT_GIA_CO_SO: "MA_NT_GIA_CO_SO",
                GIA_CO_SO: "GIA_CO_SO",
                MA_KHOAN_DC: "MA_KHOAN_DC",
                MA_LOAI_DC: "MA_LOAI_DC",
                MA_NT_DC: "MA_NT_DC",
                TRIGIA_DC: "TRIGIA_DC",
                TONG_HS_PB_DC: "TONG_HS_PB_DC",
                MA_KHOAN_DC2: "MA_KHOAN_DC2",
                MA_LOAI_DC2: "MA_LOAI_DC2",
                MA_NT_DC2: "MA_NT_DC2",
                TRIGIA_DC2: "TRIGIA_DC2",
                TONG_HS_PB_DC2: "TONG_HS_PB_DC2",
                MA_KHOAN_DC3: "MA_KHOAN_DC3",
                MA_LOAI_DC3: "MA_LOAI_DC3",
                MA_NT_DC3: "MA_NT_DC3",
                TRIGIA_DC3: "TRIGIA_DC3",
                TONG_HS_PB_DC3: "TONG_HS_PB_DC3",
                MA_KHOAN_DC4: "MA_KHOAN_DC4",
                MA_LOAI_DC4: "MA_LOAI_DC4",
                MA_NT_DC4: "MA_NT_DC4",
                TRIGIA_DC4: "TRIGIA_DC4",
                TONG_HS_PB_DC4: "TONG_HS_PB_DC4",
                MA_KHOAN_DC5: "MA_KHOAN_DC5",
                MA_LOAI_DC5: "MA_LOAI_DC5",
                MA_NT_DC5: "MA_NT_DC5",
                TRIGIA_DC5: "TRIGIA_DC5",
                TONG_HS_PB_DC5: "TONG_HS_PB_DC5",
                NOI_DUNG_KHAI_TRGIA: "NOI_DUNG_KHAI_TRGIA",
                HS_PB_TRGIA: "HS_PB_TRGIA",
                MA_NGUOI_NOP_THUE: "MA_NGUOI_NOP_THUE",
                MA_LY_DO_BP: "MA_LY_DO_BP",
                MA_KTRA_ND: "MA_KTRA_ND",
                MA_VB_PQUY: "MA_VB_PQUY",
                MA_VB_PQUY2: "MA_VB_PQUY2",
                MA_VB_PQUY3: "MA_VB_PQUY3",
                MA_VB_PQUY4: "MA_VB_PQUY4",
                MA_VB_PQUY5: "MA_VB_PQUY5",
                MA_QLY_CHUNG: "MA_QLY_CHUNG",
                MA_BO_GIAO_THONG: "MA_BO_GIAO_THONG",
                MA_BO_CONG_THUONG: "MA_BO_CONG_THUONG",
                MA_LOAI_DINH_KEM: "MA_LOAI_DINH_KEM",
                SO_DINH_KEM: "SO_DINH_KEM",
                MA_LOAI_DINH_KEM2: "MA_LOAI_DINH_KEM2",
                SO_DINH_KEM2: "SO_DINH_KEM2",
                MA_LOAI_DINH_KEM3: "MA_LOAI_DINH_KEM3",
                SO_DINH_KEM3: "SO_DINH_KEM3",
                TRUNG_CHUYEN_DIA_DIEM: "TRUNG_CHUYEN_DIA_DIEM",
                TRUNG_CHUYEN_NGAY_DEN: "TRUNG_CHUYEN_NGAY_DEN",
                TRUNG_CHUYEN_NGAY_KH: "TRUNG_CHUYEN_NGAY_KH",
                TRUNG_CHUYEN_DIA_DIEM2: "TRUNG_CHUYEN_DIA_DIEM2",
                TRUNG_CHUYEN_NGAY_DEN2: "TRUNG_CHUYEN_NGAY_DEN2",
                TRUNG_CHUYEN_NGAY_KH2: "TRUNG_CHUYEN_NGAY_KH2",
                TRUNG_CHUYEN_DIA_DIEM3: "TRUNG_CHUYEN_DIA_DIEM3",
                TRUNG_CHUYEN_NGAY_DEN3: "TRUNG_CHUYEN_NGAY_DEN3",
                TRUNG_CHUYEN_NGAY_KH3: "TRUNG_CHUYEN_NGAY_KH3",
                TRUNG_CHUYEN_DIEM_CUOI: "TRUNG_CHUYEN_DIEM_CUOI",
                TRUNG_CHUYEN_NGAY_KT: "TRUNG_CHUYEN_NGAY_KT",
                TRUNG_CHUYEN_GHI_CHU: "TRUNG_CHUYEN_GHI_CHU",
                MA_DIEM_XEP_HANG_LEN_XE: "MA_DIEM_XEP_HANG_LEN_XE",
                MA_DIEM_XEP_HANG_LEN_XE2: "MA_DIEM_XEP_HANG_LEN_XE2",
                MA_DIEM_XEP_HANG_LEN_XE3: "MA_DIEM_XEP_HANG_LEN_XE3",
                MA_DIEM_XEP_HANG_LEN_XE4: "MA_DIEM_XEP_HANG_LEN_XE4",
                MA_DIEM_XEP_HANG_LEN_XE5: "MA_DIEM_XEP_HANG_LEN_XE5",
                TEN_DIEM_XEP_HANG_LEN_XE: "TEN_DIEM_XEP_HANG_LEN_XE",
                DIA_CHI_DIEM_XEP_HANG_LEN_XE: "DIA_CHI_DIEM_XEP_HANG_LEN_XE",
                MA_PL_BAO_CAO: "MA_PL_BAO_CAO",
                MA_PL_KTRA: "MA_PL_KTRA",
                MA_HANG_HOA_DD: "MA_HANG_HOA_DD",
                GIO_DK: "GIO_DK",
                NGAY_DK_SUA: "NGAY_DK_SUA",
                GIO_DK_SUA: "GIO_DK_SUA",
                MA_PL_VB_PQUY: "MA_PL_VB_PQUY",
                SO_KB_VB_PQUY: "SO_KB_VB_PQUY",
                MA_PL_VB_PQUY2: "MA_PL_VB_PQUY2",
                SO_KB_VB_PQUY2: "SO_KB_VB_PQUY2",
                MA_PL_VB_PQUY3: "MA_PL_VB_PQUY3",
                SO_KB_VB_PQUY3: "SO_KB_VB_PQUY3",
                MA_PL_VB_PQUY4: "MA_PL_VB_PQUY4",
                SO_KB_VB_PQUY4: "SO_KB_VB_PQUY4",
                MA_PL_VB_PQUY5: "MA_PL_VB_PQUY5",
                SO_KB_VB_PQUY5: "SO_KB_VB_PQUY5",
                MA_PL_VB_PQUY6: "MA_PL_VB_PQUY6",
                SO_KB_VB_PQUY6: "SO_KB_VB_PQUY6",
                MA_PL_VB_PQUY7: "MA_PL_VB_PQUY7",
                SO_KB_VB_PQUY7: "SO_KB_VB_PQUY7",
                MA_PL_NHAP_HS_PHAN_BO: "MA_PL_NHAP_HS_PHAN_BO",
                HET_HAN_TAM_NHAP: "HET_HAN_TAM_NHAP",
                TEN_DD_LUU_KHO: "TEN_DD_LUU_KHO",
                MA_PL_CTHUC_TRGIA: "MA_PL_CTHUC_TRGIA",
                MA_PL_DC_GIA: "MA_PL_DC_GIA",
                PP_DC_GIA_KHAI_TRGIA: "PP_DC_GIA_KHAI_TRGIA",
                MA_PL_NOP_THUE: "MA_PL_NOP_THUE",
                SO_TRANG_TK: "SO_TRANG_TK",
                MA_QLY_USER: "MA_QLY_USER",
                MA_SAC_THUE: "MA_SAC_THUE",
                TEN_SAC_THUE: "TEN_SAC_THUE",
                TONG_THUE: "TONG_THUE",
                SO_DONG_TONG_THUE: "SO_DONG_TONG_THUE",
                MA_SAC_THUE2: "MA_SAC_THUE2",
                TEN_SAC_THUE2: "TEN_SAC_THUE2",
                TONG_THUE2: "TONG_THUE2",
                SO_DONG_TONG_THUE2: "SO_DONG_TONG_THUE2",
                MA_SAC_THUE3: "MA_SAC_THUE3",
                TEN_SAC_THUE3: "TEN_SAC_THUE3",
                TONG_THUE3: "TONG_THUE3",
                SO_DONG_TONG_THUE3: "SO_DONG_TONG_THUE3",
                MA_SAC_THUE4: "MA_SAC_THUE4",
                TEN_SAC_THUE4: "TEN_SAC_THUE4",
                TONG_THUE4: "TONG_THUE4",
                SO_DONG_TONG_THUE4: "SO_DONG_TONG_THUE4",
                MA_SAC_THUE5: "MA_SAC_THUE5",
                TEN_SAC_THUE5: "TEN_SAC_THUE5",
                TONG_THUE5: "TONG_THUE5",
                SO_DONG_TONG_THUE5: "SO_DONG_TONG_THUE5",
                MA_SAC_THUE6: "MA_SAC_THUE6",
                TEN_SAC_THUE6: "TEN_SAC_THUE6",
                TONG_THUE6: "TONG_THUE6",
                SO_DONG_TONG_THUE6: "SO_DONG_TONG_THUE6",
                LAN_SUA: "LAN_SUA",
                NGAY_KB_NOP_THUE: "NGAY_KB_NOP_THUE",
                GIO_KB_NOP_THUE: "GIO_KB_NOP_THUE",
                TIEU_DE_KB_NOP_THUE: "TIEU_DE_KB_NOP_THUE",
                AN_HAN_MA_SAC_THUE: "AN_HAN_MA_SAC_THUE",
                AN_HAN_TEN_SAC_THUE: "AN_HAN_TEN_SAC_THUE",
                AN_HAN_NGAY_NOP_THUE: "AN_HAN_NGAY_NOP_THUE",
                AN_HAN_MA_SAC_THUE2: "AN_HAN_MA_SAC_THUE2",
                AN_HAN_TEN_SAC_THUE2: "AN_HAN_TEN_SAC_THUE2",
                AN_HAN_NGAY_NOP_THUE2: "AN_HAN_NGAY_NOP_THUE2",
                AN_HAN_MA_SAC_THUE3: "AN_HAN_MA_SAC_THUE3",
                AN_HAN_TEN_SAC_THUE3: "AN_HAN_TEN_SAC_THUE3",
                AN_HAN_NGAY_NOP_THUE3: "AN_HAN_NGAY_NOP_THUE3",
                AN_HAN_MA_SAC_THUE4: "AN_HAN_MA_SAC_THUE4",
                AN_HAN_TEN_SAC_THUE4: "AN_HAN_TEN_SAC_THUE4",
                AN_HAN_NGAY_NOP_THUE4: "AN_HAN_NGAY_NOP_THUE4",
                AN_HAN_MA_SAC_THUE5: "AN_HAN_MA_SAC_THUE5",
                AN_HAN_TEN_SAC_THUE5: "AN_HAN_TEN_SAC_THUE5",
                AN_HAN_NGAY_NOP_THUE5: "AN_HAN_NGAY_NOP_THUE5",
                AN_HAN_MA_SAC_THUE6: "AN_HAN_MA_SAC_THUE6",
                AN_HAN_TEN_SAC_THUE6: "AN_HAN_TEN_SAC_THUE6",
                AN_HAN_NGAY_NOP_THUE6: "AN_HAN_NGAY_NOP_THUE6",
                AN_HAN_MA_SAC_THUE_VAT: "AN_HAN_MA_SAC_THUE_VAT",
                AN_HAN_TEN_SAC_THUE_VAT: "AN_HAN_TEN_SAC_THUE_VAT",
                AN_HAN_NGAY_NOP_THUE_VAT: "AN_HAN_NGAY_NOP_THUE_VAT",
                AN_HAN_MA_SAC_THUE_VAT2: "AN_HAN_MA_SAC_THUE_VAT2",
                AN_HAN_TEN_SAC_THUE_VAT2: "AN_HAN_TEN_SAC_THUE_VAT2",
                AN_HAN_NGAY_NOP_THUE_VAT2: "AN_HAN_NGAY_NOP_THUE_VAT2",
                AN_HAN_MA_SAC_THUE_VAT3: "AN_HAN_MA_SAC_THUE_VAT3",
                AN_HAN_TEN_SAC_THUE_VAT3: "AN_HAN_TEN_SAC_THUE_VAT3",
                AN_HAN_NGAY_NOP_THUE_VAT3: "AN_HAN_NGAY_NOP_THUE_VAT3",
                AN_HAN_MA_SAC_THUE_VAT4: "AN_HAN_MA_SAC_THUE_VAT4",
                AN_HAN_TEN_SAC_THUE_VAT4: "AN_HAN_TEN_SAC_THUE_VAT4",
                AN_HAN_NGAY_NOP_THUE_VAT4: "AN_HAN_NGAY_NOP_THUE_VAT4",
                AN_HAN_MA_SAC_THUE_VAT5: "AN_HAN_MA_SAC_THUE_VAT5",
                AN_HAN_TEN_SAC_THUE_VAT5: "AN_HAN_TEN_SAC_THUE_VAT5",
                AN_HAN_NGAY_NOP_THUE_VAT5: "AN_HAN_NGAY_NOP_THUE_VAT5",
                AN_HAN_MA_SAC_THUE_VAT6: "AN_HAN_MA_SAC_THUE_VAT6",
                AN_HAN_TEN_SAC_THUE_VAT6: "AN_HAN_TEN_SAC_THUE_VAT6",
                AN_HAN_NGAY_NOP_THUE_VAT6: "AN_HAN_NGAY_NOP_THUE_VAT6",
                TEN_TRUONG_DV_HQ: "TEN_TRUONG_DV_HQ",
                NGAY_CAP_PHEP: "NGAY_CAP_PHEP",
                GIO_CAP_PHEP: "GIO_CAP_PHEP",
                NGAY_HOAN_THANH_KT: "NGAY_HOAN_THANH_KT",
                GIO_HOAN_THANH_KT: "GIO_HOAN_THANH_KT",
                MA_PL_SAU_TQ: "MA_PL_SAU_TQ",
                NGAY_DUYET_BP: "NGAY_DUYET_BP",
                GIO_DUYET_BP: "GIO_DUYET_BP",
                NGAY_HOAN_THANH_KT_BP: "NGAY_HOAN_THANH_KT_BP",
                GIO_HOAN_THANH_KT_BP: "GIO_HOAN_THANH_KT_BP",
                SO_NGAY_CHO_CAP_PHEP: "SO_NGAY_CHO_CAP_PHEP",
                TIEU_DE_THONG_QUAN: "TIEU_DE_THONG_QUAN",
                NGAY_HUY_KB: "NGAY_HUY_KB",
                GIO_HUY_KB: "GIO_HUY_KB",
                NGAY_XLY_TAY: "NGAY_XLY_TAY",
                GIO_XLY_TAY: "GIO_XLY_TAY",
                NGAY_DK_DLIEU: "NGAY_DK_DLIEU",
                GIO_DK_DLIEU: "GIO_DK_DLIEU",
                IS_KHOAN_DIEU_CHINH: "IS_KHOAN_DIEU_CHINH",
                IS_KHOAN_DIEU_CHINH2: "IS_KHOAN_DIEU_CHINH2",
                IS_KHOAN_DIEU_CHINH3: "IS_KHOAN_DIEU_CHINH3",
                IS_KHOAN_DIEU_CHINH4: "IS_KHOAN_DIEU_CHINH4",
                IS_KHOAN_DIEU_CHINH5: "IS_KHOAN_DIEU_CHINH5",
            }]

            //console.log("jsonDataCont",jsonDataCont)
            const DataItem = ['Root/DHangMDDKs/DHangMDDK/Data', {
                DHangMDDKID: "_DHangMDDKID",
                DToKhaiMDID: "_DToKhaiMDID",
                SOTK: "SOTK",
                MA_LH: "MA_LH",
                MA_HQ: "MA_HQ",
                NAMDK: "NAMDK",
                MA_NPL_SP: "MA_NPL_SP",
                STTHANG: "STTHANG",
                MA_HANGKB: "MA_HANGKB",
                MA_HANG: "MA_HANG",
                MA_PHU: "MA_PHU",
                TEN_HANG: "TEN_HANG",
                DINHMUC: "DINHMUC",
                NUOC_XX: "NUOC_XX",
                TEN_NUOC_XX: "TEN_NUOC_XX",
                MA_DVT: "MA_DVT",
                LUONG: "LUONG",
                DGIA_KB: "DGIA_KB",
                DGIA_TT: "DGIA_TT",
                MA_DG: "MA_DG",
                TRIGIA_KB: "TRIGIA_KB",
                TRIGIA_TT: "TRIGIA_TT",
                TGKB_VND: "TGKB_VND",
                LOAITSXNK: "LOAITSXNK",
                TS_XNK: "TS_XNK",
                TS_TTDB: "TS_TTDB",
                TS_VAT: "TS_VAT",
                MA_NT_THUE_XNK: "MA_NT_THUE_XNK",
                THUE_XNK: "THUE_XNK",
                THUE_TTDB: "THUE_TTDB",
                THUE_VAT: "THUE_VAT",
                PHU_THU: "PHU_THU",
                MIENTHUE: "MIENTHUE",
                TL_QUYDOI: "TL_QUYDOI",
                MA_THKE: "MA_THKE",
                CHOXULY: "CHOXULY",
                TYLE_THUKHAC: "TYLE_THUKHAC",
                TRIGIA_THUKHAC: "TRIGIA_THUKHAC",
                Tempt: "Tempt",
                IsNoCO: "IsNoCO",
                Ma_Loai_CO: "Ma_Loai_CO",
                MaHangSX: "MaHangSX",
                TenHangSX: "TenHangSX",
                MaHSMoRong: "MaHSMoRong",
                NhanHieu: "NhanHieu",
                QuyCach_PC: "QuyCach_PC",
                ThanhPhan: "ThanhPhan",
                modelNumber: "modelNumber",
                DLoaiHangID: "DLoaiHangID",
                TEN_HANG_CHI_TIET: "TEN_HANG_CHI_TIET",
                Ma_HTS: "Ma_HTS",
                DVT_HTS: "DVT_HTS",
                LUONG_HTS: "LUONG_HTS",
                DONGIA_HTS: "DONGIA_HTS",
                TEN_HANG_E: "TEN_HANG_E",
                GHI_CHU: "GHI_CHU",
                LUONG_Y: "LUONG_Y",
                KHO_Y: "KHO_Y",
                TRI_GIA_Y: "TRI_GIA_Y",
                LOAI_HANG: "LOAI_HANG",
                TS_XNK_MA_BT: "TS_XNK_MA_BT",
                TS_XNK_TD: "TS_XNK_TD",
                TS_TTDB_MA_BT: "TS_TTDB_MA_BT",
                TS_TTDB_TD: "TS_TTDB_TD",
                TS_VAT_MA_BT: "TS_VAT_MA_BT",
                TS_VAT_TD: "TS_VAT_TD",
                TS_MT_MA_BT: "TS_MT_MA_BT",
                TS_MT: "TS_MT",
                TS_MT_TD: "TS_MT_TD",
                THUE_MT: "THUE_MT",
                MIENTHUE_SOVB: "MIENTHUE_SOVB",
                MIENTHUE_TS: "MIENTHUE_TS",
                MIENTHUE_TS_GIAM: "MIENTHUE_TS_GIAM",
                MIENTHUE_SO_DK: "MIENTHUE_SO_DK",
                MIENTHUE_SO_DONG: "MIENTHUE_SO_DONG",
                MIENTHUE_MA: "MIENTHUE_MA",
                MIENTHUE_THUE_GIAM: "MIENTHUE_THUE_GIAM",
                MIENTHUE_MA_NT_THUE_GIAM: "MIENTHUE_MA_NT_THUE_GIAM",
                MA_TINH_TRANG: "MA_TINH_TRANG",
                IS_HANG_DONG_BO: "IS_HANG_DONG_BO",
                CHE_DO_UU_DAI: "CHE_DO_UU_DAI",
                TS_TV: "TS_TV",
                THUE_TV: "THUE_TV",
                TS_TV_MA_BT: "TS_TV_MA_BT",
                TS_TV_TD: "TS_TV_TD",
                QD_AP_HS_MA_HQ: "QD_AP_HS_MA_HQ",
                QD_AP_HS_NGAY_QD: "QD_AP_HS_NGAY_QD",
                QD_AP_HS_SO_QD: "QD_AP_HS_SO_QD",
                QD_AP_GIA_MA_HQ: "QD_AP_GIA_MA_HQ",
                QD_AP_GIA_NGAY_QD: "QD_AP_GIA_NGAY_QD",
                QD_AP_GIA_SO_QD: "QD_AP_GIA_SO_QD",
                MA_DVT_TS_XNK_TD: "MA_DVT_TS_XNK_TD",
                MA_NT_TS_XNK_TD: "MA_NT_TS_XNK_TD",
                MA_NGOAI_HAN_NGHACH: "MA_NGOAI_HAN_NGHACH",
                MA_AP_DUNG_TS_TD: "MA_AP_DUNG_TS_TD",
                LUONG2: "LUONG2",
                MA_DVT2: "MA_DVT2",
                TRIGIA_HDTM: "TRIGIA_HDTM",
                DGIA_HDTM: "DGIA_HDTM",
                MA_NT_DGIA_HDTM: "MA_NT_DGIA_HDTM",
                DVT_DGIA_HDTM: "DVT_DGIA_HDTM",
                MA_NT_TRIGIA_TT: "MA_NT_TRIGIA_TT",
                SO_MUC_KHAI_DC: "SO_MUC_KHAI_DC",
                SO_MUC_KHAI_DC2: "SO_MUC_KHAI_DC2",
                SO_MUC_KHAI_DC3: "SO_MUC_KHAI_DC3",
                SO_MUC_KHAI_DC4: "SO_MUC_KHAI_DC4",
                SO_MUC_KHAI_DC5: "SO_MUC_KHAI_DC5",
                STTHANG_TN_TX: "STTHANG_TN_TX",
                HET_HAN_TN_TX: "HET_HAN_TN_TX",
                THUEKHAC_MA_AP_DUNG: "THUEKHAC_MA_AP_DUNG",
                THUEKHAC_MA_MIEN_GIAM: "THUEKHAC_MA_MIEN_GIAM",
                THUEKHAC_THUE_GIAM: "THUEKHAC_THUE_GIAM",
                THUEKHAC_MA_AP_DUNG2: "THUEKHAC_MA_AP_DUNG2",
                THUEKHAC_MA_MIEN_GIAM2: "THUEKHAC_MA_MIEN_GIAM2",
                THUEKHAC_THUE_GIAM2: "THUEKHAC_THUE_GIAM2",
                THUEKHAC_MA_AP_DUNG3: "THUEKHAC_MA_AP_DUNG3",
                THUEKHAC_MA_MIEN_GIAM3: "THUEKHAC_MA_MIEN_GIAM3",
                THUEKHAC_THUE_GIAM3: "THUEKHAC_THUE_GIAM3",
                THUEKHAC_MA_AP_DUNG4: "THUEKHAC_MA_AP_DUNG4",
                THUEKHAC_MA_MIEN_GIAM4: "THUEKHAC_MA_MIEN_GIAM4",
                THUEKHAC_THUE_GIAM4: "THUEKHAC_THUE_GIAM4",
                THUEKHAC_MA_AP_DUNG5: "THUEKHAC_MA_AP_DUNG5",
                THUEKHAC_MA_MIEN_GIAM5: "THUEKHAC_MA_MIEN_GIAM5",
                THUEKHAC_THUE_GIAM5: "THUEKHAC_THUE_GIAM5",
                MA_VB_KHAC: "MA_VB_KHAC",
                MA_VB_KHAC2: "MA_VB_KHAC2",
                MA_VB_KHAC3: "MA_VB_KHAC3",
                MA_VB_KHAC4: "MA_VB_KHAC4",
                MA_VB_KHAC5: "MA_VB_KHAC5",
                GUID: "GUID",
                MA_PL_XAC_NHAN_GIA: "MA_PL_XAC_NHAN_GIA",
                MA_NT_TRIGIA_TT_S: "MA_NT_TRIGIA_TT_S",
                TRIGIA_TT_S: "TRIGIA_TT_S",
                LUONG_TT: "LUONG_TT",
                MA_DVT_CHUAN: "MA_DVT_CHUAN",
                MA_NT_DGIA_TT: "MA_NT_DGIA_TT",
                DVT_DGIA_TT: "DVT_DGIA_TT",
                MA_PL_TS_TNK: "MA_PL_TS_TNK",
                TEN_TS_TNK: "TEN_TS_TNK",
                MA_PL_NHAP_TNK: "MA_PL_NHAP_TNK",
                MA_PL_NHAP_TRGIA_TT: "MA_PL_NHAP_TRGIA_TT",
                MA_PL_NHAP_GIA_TT: "MA_PL_NHAP_GIA_TT",
                DK_MIEN_GIAM_THUE: "DK_MIEN_GIAM_THUE",
                THUEKHAC_TEN_KHOAN_MUC: "THUEKHAC_TEN_KHOAN_MUC",
                THUEKHAC_TRGIA_TT: "THUEKHAC_TRGIA_TT",
                THUEKHAC_LUONG_TT: "THUEKHAC_LUONG_TT",
                THUEKHAC_MA_DVT_CHUAN: "THUEKHAC_MA_DVT_CHUAN",
                THUEKHAC_TEN_TS: "THUEKHAC_TEN_TS",
                THUEKHAC_SO_TIEN: "THUEKHAC_SO_TIEN",
                THUEKHAC_DK_MIEN_GIAM_THUE: "THUEKHAC_DK_MIEN_GIAM_THUE",
                THUEKHAC_TEN_KHOAN_MUC2: "THUEKHAC_TEN_KHOAN_MUC2",
                THUEKHAC_TRGIA_TT2: "THUEKHAC_TRGIA_TT2",
                THUEKHAC_LUONG_TT2: "THUEKHAC_LUONG_TT2",
                THUEKHAC_MA_DVT_CHUAN2: "THUEKHAC_MA_DVT_CHUAN2",
                THUEKHAC_TEN_TS2: "THUEKHAC_TEN_TS2",
                THUEKHAC_SO_TIEN2: "THUEKHAC_SO_TIEN2",
                THUEKHAC_DK_MIEN_GIAM_THUE2: "THUEKHAC_DK_MIEN_GIAM_THUE2",
                THUEKHAC_TEN_KHOAN_MUC3: "THUEKHAC_TEN_KHOAN_MUC3",
                THUEKHAC_TRGIA_TT3: "THUEKHAC_TRGIA_TT3",
                THUEKHAC_LUONG_TT3: "THUEKHAC_LUONG_TT3",
                THUEKHAC_MA_DVT_CHUAN3: "THUEKHAC_MA_DVT_CHUAN3",
                THUEKHAC_TEN_TS3: "THUEKHAC_TEN_TS3",
                THUEKHAC_SO_TIEN3: "THUEKHAC_SO_TIEN3",
                THUEKHAC_DK_MIEN_GIAM_THUE3: "THUEKHAC_DK_MIEN_GIAM_THUE3",
                THUEKHAC_TEN_KHOAN_MUC4: "THUEKHAC_TEN_KHOAN_MUC4",
                THUEKHAC_TRGIA_TT4: "THUEKHAC_TRGIA_TT4",
                THUEKHAC_LUONG_TT4: "THUEKHAC_LUONG_TT4",
                THUEKHAC_MA_DVT_CHUAN4: "THUEKHAC_MA_DVT_CHUAN4",
                THUEKHAC_TEN_TS4: "THUEKHAC_TEN_TS4",
                THUEKHAC_SO_TIEN4: "THUEKHAC_SO_TIEN4",
                THUEKHAC_DK_MIEN_GIAM_THUE4: "THUEKHAC_DK_MIEN_GIAM_THUE4",
                THUEKHAC_TEN_KHOAN_MUC5: "THUEKHAC_TEN_KHOAN_MUC5",
                THUEKHAC_TRGIA_TT5: "THUEKHAC_TRGIA_TT5",
                THUEKHAC_LUONG_TT5: "THUEKHAC_LUONG_TT5",
                THUEKHAC_MA_DVT_CHUAN5: "THUEKHAC_MA_DVT_CHUAN5",
                THUEKHAC_TEN_TS5: "THUEKHAC_TEN_TS5",
                THUEKHAC_SO_TIEN5: "THUEKHAC_SO_TIEN5",
                THUEKHAC_DK_MIEN_GIAM_THUE5: "THUEKHAC_DK_MIEN_GIAM_THUE5",
                LEPHI_DON_GIA: "LEPHI_DON_GIA",
                LEPHI_SO_LUONG: "LEPHI_SO_LUONG",
                LEPHI_MA_DVT_LUONG: "LEPHI_MA_DVT_LUONG",
                LEPHI_SO_TIEN: "LEPHI_SO_TIEN",
                BHIEM_DON_GIA: "BHIEM_DON_GIA",
                BHIEM_SO_LUONG: "BHIEM_SO_LUONG",
                BHIEM_MA_DVT_LUONG: "BHIEM_MA_DVT_LUONG",
                BHIEM_SO_TIEN: "BHIEM_SO_TIEN",
                MA_HANG_QL_RIENG: "MA_HANG_QL_RIENG",
                TRIGIA_TT_M: "TRIGIA_TT_M",
                TS_PB: "TS_PB",
                THUE_PB: "THUE_PB",
                TS_PB_MA_BT: "TS_PB_MA_BT",
                TS_PB_TD: "TS_PB_TD",
                SO_SIZE: "SO_SIZE",
                SO_PO: "SO_PO",
                SO_CO: "SO_CO",
                DSCH810DETID: "DSCH810DETID",
                ISUSED: "ISUSED",
                IS_HETTON_TNTX: "IS_HETTON_TNTX",
                MA_LENHSX: "MA_LENHSX",
            }]

            //console.log("jsonDataItem",jsonDataItem)
            //let masterData= jsonData.concat(jsonDataDBTB);
            let masterPara = []
            let arrData = []
            let arrDataDBTB = []
            for (const key in jsonData[0]) {
                const e = jsonData[0][key];
                arrData.push(e)
            }
            for (const key in jsonDataDBTB[0]) {
                const e = jsonDataDBTB[0][key];
                arrDataDBTB.push(e)
            }
            masterPara = arrData.concat(arrDataDBTB);
            const xmlRelativePath = p_xml_path.replace(ROOT_DIR_FILES, "");
            masterPara = masterPara.concat(["", xmlRelativePath, "", ""]);
            const master = await DBService.callProcCursor('ei_upd_tei_ecus_declare', masterPara, p_language, p_crt_by);
            //console.log("master", master);

            if (master && master[0].PK > 0) {
                const jsonDataItem = await transform(xmlContent, DataItem);

                for (let i = 0; i < jsonDataItem.length; i++) {
                    // const detailPara = [master[0].PK, jsonDSHHDVu[i].TChat, jsonDSHHDVu[i].STT, jsonDSHHDVu[i].MHHDVu, jsonDSHHDVu[i].THHDVu, jsonDSHHDVu[i].DVTinh, jsonDSHHDVu[i].SLuong, jsonDSHHDVu[i].DGia, jsonDSHHDVu[i].TLCKhau, jsonDSHHDVu[i].TSuat];
                    let detailItemPara = [master[0].PK]
                    for (const key in jsonDataItem[i]) {
                        const e = jsonDataItem[i][key];
                        detailItemPara.push(e)
                    }
                    const detailItem = await DBService.callProcCursor('ei_upd_tei_ecus_declare_item', detailItemPara, p_language, p_crt_by);
                    console.log("detailitem", detailItem);
                }

                const jsonDataCont = await transform(xmlContent, DataCont);
                for (let i = 0; i < jsonDataCont.length; i++) {
                    // const detailPara = [master[0].PK, jsonDSHHDVu[i].TChat, jsonDSHHDVu[i].STT, jsonDSHHDVu[i].MHHDVu, jsonDSHHDVu[i].THHDVu, jsonDSHHDVu[i].DVTinh, jsonDSHHDVu[i].SLuong, jsonDSHHDVu[i].DGia, jsonDSHHDVu[i].TLCKhau, jsonDSHHDVu[i].TSuat];
                    let detailParaCont = [master[0].PK]
                    for (const key in jsonDataCont[i]) {
                        const e = jsonDataCont[i][key];
                        detailParaCont.push(e)
                    }
                    const detailCont = await DBService.callProcCursor('ei_upd_tei_ecus_declare_container', detailParaCont, p_language, p_crt_by);
                    console.log("detailcont", detailCont);
                }
                return master[0].PK;
            } else {
                return 0;
            }
        } catch (e) {
            Utils.Logger({ LVL: "error", MODULE: "ImportController", FUNC: "extractXMLTKHQContent", CONTENT: e.message })
            return -1;
        }
    }

    async ImportExcelFile({ request, response, auth }) {
        try {

            var p_language = request.header("accept-language", "ENG")
            var p_crt_by = ""
            const user = await auth.getUser()
            if (user) {
                p_crt_by = user.USER_ID
            }
            // 'TES_FILE' 'TAC_FILES'
            let { import_info, table_nm, table_pk } = request.all();
            let para = [table_pk, table_nm, '', ''];
            // let { import_info, tes_file_pk } = request.all();
            // let para = [tes_file_pk, 'TES_FILE', '', ''];

            var imp = new ImportHelper(p_language, p_crt_by);
            if (DB_CONNECTION == "oracle") {
                oracledb.fetchAsBuffer = [oracledb.BLOB];
            }
            let sprod = "SYS_SEL_IMP_FILE";
            if (table_nm == 'TAC_FILES') {
                sprod = "AC_SEL_IMP_TAC_FILES";
            }
            const result = await DBService.callProcCursor(sprod, para, p_language, p_crt_by);
            // const result = await DBService.callProcCursor('SYS_SEL_IMP_FILE', para, p_language, p_crt_by);

            if (result) {
                let file_name = result[0].FILE_NAME;
                let filename = 'result_' + result[0].FILE_NAME;
                // let file_name = "result_" + result[0].FILE_NAME.split(".")[0] +'_'+ p_crt_by+'.' +result[0].FILE_NAME.split(".")[1]; 
                let buffer = result[0].FILE_CONTENT;
                let tmp_file = Helpers.tmpPath(file_name);

                //excel load buffer bi loi nen phai save lai ra file temp
                let rtnFileExcel = await fs.writeFileSync(tmp_file, buffer);
                // console.log('[vng-154/dvg] > file: ImportController.js:1408 > ImportController > ImportExcelFile > rtnFileExcel:', rtnFileExcel);
                /*==[vng-154/dvg] check import file .xls=================*/
                if (filename.split('.')[1].toString().trim().toUpperCase() == 'XLS') {
                    // console.log('[vng-154/dvg] > file: ImportController.js:1412 > ImportController > ImportExcelFile > tmp_file:', tmp_file);
                    let rtnParseFile = await this.parseXlsToXlsx(tmp_file);
                    // console.log('[vng-154/dvg] > file: ImportController.js:1413 > ImportController > ImportExcelFile > rtnParseFile:', rtnParseFile); 
                    tmp_file = Helpers.tmpPath(file_name + `.xlsx`);
                }
                /*========================================================*/

                await imp.loadFile(tmp_file);
                // console.log('[vng-154/dvg] > file: ImportController.js:1418 > ImportController > ImportExcelFile > tmp_file:', tmp_file);

                await imp.importDBData(import_info, p_language, p_crt_by, tmp_file, file_name, table_pk, table_nm);
                // await imp.importDBData(import_info, p_language, p_crt_by, tmp_file, file_name);
                // let resultData = await imp.writeFile(); 

                return response.attachment(imp.returnFile, file_name);

                // await imp.workbook.xlsx.readFile(tmp_file); 
                // const reportFile    = Helpers.tmpPath(file_name);
                // console.log('vng-154-dvg^_^: > file: ImportController.js > line 120 > ImportController > ImportExcelFile > reportFile', reportFile);
                // await imp.workbook.xlsx.writeFile(reportFile)
                //  return response.attachment( reportFile, file_name);
                // return await imp.writeFileExcel(); 
                // return response.attachment(resultData, file_name);

            }

            return response.send(Utils.response(false, "error", result));
        } catch (e) {
            Utils.Logger({ LVL: "error", MODULE: "ImportController", FUNC: "ImportExcel", CONTENT: e.message })
            return response.send(e.message)
        }
    }

    async parseXlsToXlsx(file_url) {
        try {
            const ext = '.xlsx'
            const inputPath = file_url;
            // console.log('[vng-154/dvg] > file: ImportController.js:1450 > ImportController > parseXlsToXlsx > inputPath:', inputPath);
            const outputPath = file_url + `${ext}`;
            // console.log('[vng-154/dvg] > file: ImportController.js:1453 > ImportController > parseXlsToXlsx > outputPath:', outputPath);
            const fileBuf = await fsPart.readFile(inputPath);
            // console.log('[vng-154/dvg] > file: ImportController.js:1454 > ImportController > parseXlsToXlsx > fileBuf:', fileBuf);
            let rtnBuf = await libre.convertAsync(fileBuf, ext, undefined);
            // console.log('[vng-154/dvg] > file: ImportController.js:1456 > ImportController > parseXlsToXlsx > rtnBuf:', rtnBuf);
            // Here in done you have pdf file which you can save or transfer in another stream
            const rtnFile = await fsPart.writeFile(outputPath, rtnBuf);
            // console.log('[vng-154/dvg] > file: ImportController.js:1459 > ImportController > parseXlsToXlsx > rtnFile:', rtnFile);
            return rtnBuf;
        } catch (e) {
            return false;
        }
    }

    async ImportExcelFileRPA({ request, response, auth }) {
        try {

            var p_language = request.header("accept-language", "ENG")
            var p_crt_by = ""
            const user = await auth.getUser()
            if (user) {
                p_crt_by = user.USER_ID
            }
            let { params } = request.all();

            console.log("p_data  ", params);

            let para = [params.table_pk, params.table_nm, '', ''];

            var imp = new ImportHelper(p_language, p_crt_by);


            if (DB_CONNECTION == "oracle") { oracledb.fetchAsBuffer = [oracledb.BLOB]; }

            let sprod = "SYS_SEL_IMP_FILE";
            if (params.table_nm == 'TAC_FILES') {
                sprod = "AC_SEL_EXCEL_TAC_FILES";
            }

            // checking common code
            let para_common = ['ACJS0340'];
            const common_result = await DBService.callProcCursor("sys_sel_common_code22", para_common, p_language, p_crt_by);

            let import_info = {};
            let file_name_check = "";

            if (params.file_name.toLowerCase().indexOf(".xlsx") > 0) {
                file_name_check = params.file_name.substring(0, params.file_name.length - 12);
            }
            else {
                file_name_check = params.file_name.substring(0, params.file_name.length - 11);
            }

            //  console.log("file_name_check  ", file_name_check);

            common_result.forEach(e => {
                if (e.VAL1 == file_name_check) //"Sales_eInvoice"
                {
                    import_info = {
                        proc: e.VAL3,
                        start_row: Number(e.VAL5),
                        start_col: Number(e.VAL4),
                        end_col: Number(e.VAL6),
                        add_params: [params.company],
                        impValidCol: -1,
                        impValidValue: "Y"
                    };
                }
            });

            console.log(" import_info ", import_info);

            const result = await DBService.callProcCursor(sprod, para, p_language, p_crt_by);
            // const result = await DBService.callProcCursor('SYS_SEL_IMP_FILE', para, p_language, p_crt_by);

            if (result) {
                // console.log("result  " , result);
                let file_name = result[0].FILE_NAME;
                let filename = 'result_' + result[0].FILE_NAME;
                // let file_name = "result_" + result[0].FILE_NAME.split(".")[0] +'_'+ p_crt_by+'.' +result[0].FILE_NAME.split(".")[1]; 
                let buffer = result[0].FILE_CONTENT;
                let tmp_file = Helpers.tmpPath(file_name);
                // console.log('[vng-154/dvg] > file: ImportController.js:1408 > ImportController > tmp_file > tmp_file:', tmp_file);
                //excel load buffer bi loi nen phai save lai ra file temp
                let rtnFileExcel = await fs.writeFileSync(tmp_file, buffer);
                // console.log('[vng-154/dvg] > file: ImportController.js:1408 > ImportController > ImportExcelFile > rtnFileExcel:', filename.split('.')[1].toString().trim().toUpperCase());
                /*==[vng-154/dvg] check import file .xls=================*/
                if (filename.split('.')[1].toString().trim().toUpperCase() == 'XLS') {
                    //console.log('[vng-154/dvg] > file: ImportController.js:1412 > ImportController > ImportExcelFile > tmp_file:', tmp_file);
                    let rtnParseFile = await this.parseXlsToXlsx(tmp_file);
                    //console.log('[vng-154/dvg] > file: ImportController.js:1413 > ImportController > ImportExcelFile > rtnParseFile:', rtnParseFile); 
                    tmp_file = Helpers.tmpPath(file_name + `.xlsx`);
                }
                /*========================================================*/

                await imp.loadFile(tmp_file);

                // console.log('[vng-154/dvg] > file: ImportController.js:1418 > ImportController > ImportExcelFile > tmp_file:', tmp_file);

                await imp.importDBData(JSON.stringify(import_info), p_language, p_crt_by, tmp_file, file_name, params.table_pk, params.table_nm);
                // await imp.importDBData(import_info, p_language, p_crt_by, tmp_file, file_name);
                // let resultData = await imp.writeFile(); 
                if (file_name_check == "Credit_Confirm_VND" || file_name_check == "Credit_Confirm_USD" || file_name_check == "Debit_Confirm_VND" || file_name_check == "Debit_Confirm_USD") {
                    const para_file = {
                        p_tac_files_pk: params.table_pk,
                        p_tac_files_nm: params.table_nm
                    };

                    const rtnValue_re = await DBService.ExecuteSQLBlob(
                        `BEGIN AC_UPD_MAPPING_SLIP_PARTNER(         
                                                            :p_tac_files_pk,     
                                                            :p_tac_files_nm,  
                                                            :p_language, 
                                                            :p_crt_by, 
                                                            :p_rtn_cur
                                                            ); END;`,
                        para_value_taxcode,
                        p_language,
                        p_crt_by
                    );
                } else {
                    // check taxcode 
                    await this.getTaxcodeInf('', p_crt_by, p_language);
                }


                return response.send(
                    Utils.response(true, "upload_excel_file_sucessfull", { TAC_FILES_PK: params.table_pk, STATUS: 'OK', MESS: 'upload_excel_file_sucessfull' })
                );

            }

            return response.send(Utils.response(false, "error", { TAC_FILES_PK: params.table_pk, STATUS: 'FAILE', MESS: 'upload_excel_file_error' }));
        } catch (e) {
            Utils.Logger({ LVL: "error", MODULE: "ImportExcelFileRPA", FUNC: "ImportExcelRPA", CONTENT: e.message })
            return response.send(e.message)
        }
    }

    async getTaxcodeInf(p_taxcode, p_language, p_crt_by) {
        try {

            console.log("getTaxcodeInf ", p_taxcode);

            let para = [p_taxcode];

            let url = "https://thongtindoanhnghiep.co/api/company/";

            let sprod = "SYS_SEL_TAXCODE";

            const result = await DBService.callProcCursor(sprod, para, p_language, p_crt_by);


            // console.log(" result ", result);
            if (result) {
                for (let i = 0; i < result.length; i++) {
                    // console.log("result.length     ", url + result[i].BUYER_TAXCODE);
                    const result_taxcode = await Request.get(url + result[i].BUYER_TAXCODE);

                    // console.log("result_taxcode ", result_taxcode.data);

                    let partner_name = result_taxcode.data.Title;
                    let DSMaNganhNgheKinhDoanh = [];
                    DSMaNganhNgheKinhDoanh = result_taxcode.data.DSMaNganhNgheKinhDoanh;
                    for (let k = 0; k < DSMaNganhNgheKinhDoanh.length; k++) {
                        // console.log("DSMaNganhNgheKinhDoanh ", DSMaNganhNgheKinhDoanh[k]);
                        if (DSMaNganhNgheKinhDoanh[k].toString().length >= 3) {
                            const para_value_taxcode = {
                                seller_taxcode: result[i].BUYER_TAXCODE,
                                kind_code: DSMaNganhNgheKinhDoanh[k].toString().substring(0, 3),
                                partner_name: partner_name

                            };

                            // console.log("BUYER_TAXCODE ", result[i].BUYER_TAXCODE);

                            const rtnValue_re = await DBService.ExecuteSQLBlob(
                                `BEGIN AC_UPD_KIND_TAXCODE(         
                                                                    :seller_taxcode,     
                                                                    :kind_code,  
                                                                    :partner_name,   
                                                                    :p_language, 
                                                                    :p_crt_by, 
                                                                    :p_rtn_cur
                                                                    ); END;`,
                                para_value_taxcode,
                                p_language,
                                p_crt_by
                            );
                            // console.log("AC_UPD_KIND_TAXCODE ", rtnValue_re);
                        }
                    }
                }

            }
        } catch (e) {
            Utils.Logger({ LVL: "error", MODULE: "getTaxcodeInf", FUNC: "getTaxcodeInf", CONTENT: e.message })
            //return response.send(e.message)
        }
    }


}

module.exports = ImportController