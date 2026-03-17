"use strict";

const Helpers = use("Helpers");
const fs = use("fs");
const Utils = use("Utils");
const Env = use("Env");
const oracledb = require("oracledb");
const DBService = use("DBService");
const cron = require('node-cron');
const ExcelJs =  use("App/Helpers/ExcelJs"); 
const wait = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

class JobScheduler {
    /*job { 
            function: [name of store/function],  
            params: [array]
            minute: [number],
            hour: [number],
            day_of_month: [number],
            month: [number/name]
            day_of_week: [0-7 (or names, 0 or 7 are sunday)]
        } 

        //details: https://github.com/node-cron/node-cron

    */
    procedureJobs = []; //call store from db
    functionJobs = []; //from env (create js function is needed)

    constructor() {
        try {
            this.procedureJobs = JSON.parse(Env.get("SCHEDULE_PROCEDURE"));
        } catch(e) { }

        try {
            this.functionJobs = JSON.parse(Env.get("SCHEDULE_FUNCTION"));
        } catch(e) {}
    }

    start() {
        try {
            if(this.functionJobs && this.functionJobs.length > 0) {
                for(let idx = 0; idx < this.functionJobs.length; idx++) {
                    let job = this.functionJobs[idx];

                    let scheduleStr = `${job.minute??'*'} ${job.hour??'*'} ${job.day_of_month??'*'} ${job.month??'*'} ${job.day_of_week??'*'}`;

                    if(typeof this[job.function] == 'function' && this[job.function].call) {
                        cron.schedule(scheduleStr, () => {
                            if(!job.running == true) {
                                this[job.function](job);
                            }
                        });
                    } else {
                        Utils.Logger({ LVL: "error", MODULE: "JobScheduler", FUNC: "start", CONTENT: `Function ${job.function} not found.`});
                    }
                }
            }
        } catch(e) {
            Utils.Logger({ LVL: "error", MODULE: "JobScheduler", FUNC: "start", CONTENT: e.message});
        }


        try {
            if(this.procedureJobs && this.procedureJobs.length > 0) {
                for(let idx = 0; idx < this.procedureJobs.length; idx++) {
                    let job = this.procedureJobs[idx];

                    let scheduleStr = `${job.minute??'*'} ${job.hour??'*'} ${job.day_of_month??'*'} ${job.month??'*'} ${job.day_of_week??'*'}`;

                    cron.schedule(scheduleStr, () => {
                        if(!job.running == true) {
                            this.Schedule_Procedure(job);
                        }
                    });
                }
            }
        } catch(e) {
            Utils.Logger({ LVL: "error", MODULE: "JobScheduler", FUNC: "start", CONTENT: e.message});
        }
    }

    async Schedule_Procedure(job) {
        job.running = true;
        let params = job.params ? job.params : null;

        try {
            let res = await DBService.callProcCursor(job.function, params, "ENG", "system-scheduler", "");
        } catch(e) {
            Utils.Logger({ LVL: "error", MODULE: "JobScheduler", FUNC: "Schedule_Procedure", CONTENT: e.message});
        }

        job.running = false;
    }

    async Schedule_HSVN_GeneratePIT(job){        
        job.running = true;

        oracledb.fetchAsBuffer = [oracledb.BLOB];

        let proGetListPIT = "hr_pro_get_pit_cert_signed"; //get list pit da ky chua tao pdf
        let proGetPITTemplate = "hr_pro_get_pit_template"; //get list template 
        let proGetPITData = "hr_pro_1031500_preview_sign"; //get list template 
        let proUpdPdfPath = "hr_pro_upd_pit_cert_signed";// update pdf to db
        let pits = await DBService.callProcCursor(proGetListPIT, null, "ENG", "system-scheduler", "");

        let distinctTemplate =  Array.from( new Set(   Array.from( pits, x => x[ "TEMPLATE_PK" ] )    ) );

        let pitTemplates = await DBService.callProcCursor(proGetPITTemplate, [distinctTemplate.join(',')], "ENG", "system-scheduler", "");

        const signIcon = Helpers.publicPath("hsvn/images/signCertificate.png");
        const signFile = await Utils.readFile(signIcon);
        const unSignIcon = Helpers.publicPath("hsvn/images/cancelCertificate.png");
        const unSignFile = await Utils.readFile(unSignIcon);

        let idx = 0;
        while(idx < pits.length) {
            let pit = pits[idx];
            let datas = await DBService.callProcCursor(proGetPITData, [pit.PK], "ENG", "system-scheduler", "");
            datas = datas[0];

            let excelPath = Helpers.tmpPath(datas["TRACKING_NO"]+".xlsx");

            let pdfPath =  "hsvn/pit/" + datas["TRACKING_NO"]+".pdf";
            let pdfFullPath =  Helpers.publicPath(pdfPath);
            let exportCompleted = false;
            let moveFileCallback = async (data)  => {
                if(data == true) {
                    //insert pdf path to db
                    let res = await DBService.callProcCursor(proUpdPdfPath, [datas["XML_PK"], pdfPath], "ENG", "system-scheduler", "");
                } else { //error
                    //write log error
                    try {
                        Utils.Logger({ LVL: "error", MODULE: "JobScheduler", FUNC: "Schedule_HSVN_GeneratePIT", CONTENT: `Move pdf error ${pdfFullPath}. err: ${JSON.stringify(data)}`});
                    } catch {}
                }

                exportCompleted = true;
            };

            let exceljs = new ExcelJs();
            await exceljs.readFile(pitTemplates.find(q => q.PK == pit.TEMPLATE_PK).BUFFER, "BUFFER");

            let worksheet = exceljs.worksheet();

            exceljs.insertRange(datas.TEMPLATE_RANGE, datas);

            if (datas.SIGN_YN == "Y") {
                let signImageId = exceljs.insertImage(signFile);
      
                try {
                    let signPos = datas.TEMPLATE_SIGN_POS.split(";");
                    let _tl = signPos[0].split('-');
                    let _br = signPos[1].split('-');
        
                    let _t = Number(_tl[0]);
                    let _l = Number(_tl[1]);
                    let _b = Number(_br[0]);
                    let _r = Number(_br[1]);
        
                    worksheet.addImage(signImageId, {
                        tl: { col: _t, row: _l },
                        br: { col: _b, row: _r }
                    });
                } catch (e) {
                    // console.log(e.message)
                }
            }

            if (datas.UNSIGN_YN == "Y") {
                let unSignImageId = exceljs.insertImage(unSignFile);
      
                try {
                    let signPos = datas.TEMPLATE_CANCEL_POS.split(";");
                    let _tl = signPos[0].split('-');
                    let _br = signPos[1].split('-');
        
                    let _t = Number(_tl[0]);
                    let _l = Number(_tl[1]);
                    let _b = Number(_br[0]);
                    let _r = Number(_br[1]);
        
                    worksheet.addImage(unSignImageId, {
                        tl: { col: _t, row: _l },
                        br: { col: _b, row: _r }
                    });
                } catch (e) {
                    // console.log(e.message)
                }
            }

            let savedPdf = await exceljs.writeFile(excelPath, true);
            Utils.moveFile(savedPdf, pdfFullPath, moveFileCallback );

            while(!exportCompleted) {
                await wait(100);
            };

            idx++;
        }

        job.running = false;
    }
}

module.exports = JobScheduler