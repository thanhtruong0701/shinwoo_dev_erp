let companyList = [];
let company = null;
let companyjs = null;
let reportList = [];
let reportDefault = [];
let reportCompany = [];

let rpt1011021 = {
  getReportList: async(that) =>{
    await prepareCommonData(that);
    let reports = [];
    reportDefault = await that._getReportList('1011021', 'EMPLOYEE', that.selectedCompany);
    //check xem co file report js cho cty ko
    try {
        companyjs = require(`@/report/10/11/${(company["PARTNER_ID"]?.toLowerCase())}/1011021_${(company["PARTNER_ID"]?.toLowerCase()) }.js`); //report/10/31/ghs/1031050_ghs.js
        companyjs =  companyjs.default; //do export ra default;
        reportCompany = await companyjs.getReportList(that);
        
    } catch (e) {
      console.log(e);
    }

    reports = [...reportDefault, ...reportCompany];
    reportList = [...reports];
    reportList = reportList.sort((a, b) => (Number(a.CODE) > Number(b.CODE)) ? 1 : -1)
    return reportList;
}, 


  print: async (that, reportInfo, p_search) => {
    that.companyList = await that._getCompany();
    that.company = that.companyList.find(x => x["PK"] === that.selectedCompany );
    let p_param = [...p_search];
    p_param.push(that.salary_security);
  
    let report_no = reportInfo["CODE"];
    let report_path = reportInfo.REPORT_PATH;
    let report_name = reportInfo.NAME + ".xlsx";
    let startSalCol = 12;
    let reportHeader = {};
    let hiddenCols = [];
    let excel = [];
    let doc = {};
    let reportType = "excel";
  
    reportHeader = {
      H1: that.$t("no"), H2: that.$t("organization"), H3: that.$t("work_group"), H4: that.$t("emp_id"), H5: that.$t("old_id"),
      H6: that.$t("full_name"), H7: that.$t("photo"), H8: that.$t("id_num"), H9: that.$t("join_dt"), H10: that.$t("employee_type"),
      H11: that.$t("project"), H12: that.$t("pro_sal"), H13: that.$t("basic_sal"),
      H34: that.$t("birth_dt"), H35: that.$t("place_birth"), H36: that.$t("job_type"), H37: that.$t("pos_type"),
      USER_NAME: that.user.USER_NAME
    };
  
    switch (report_no) {
      case "01": {
        if (that.salary_security === "Y") {
          for (let i = 1; i <= 20; i++) {
            let allowIdx = that.allowanceList.findIndex(x => Number(x.CODE.replace("A", "")) == i);
            if (allowIdx >= 0) {
              let allow = that.allowanceList[allowIdx];
  
              if (allow.NUM1 === "1") {
                  reportHeader["H" + (startSalCol + 1 + Number((allow.CODE.replace("A", ""))))] = allow.NAME;
              } else {
                  hiddenCols.push((startSalCol + 1) + i); //(startSalCol + 1): 2 column salary
              }
  
            } else {
              hiddenCols.push((startSalCol + 1) + i); //(startSalCol + 1): 2 column salary
            }
          }
        } else {
          hiddenCols = Array.from(Array(34), (_, x) => (x >= 12 && x <= 33) ? x : null).filter(x => x != null);
        }
  
  
        excel = [
          {
            sheet: 1,
            insertRange: [
              { range: "A2:AK5", data: reportHeader },//header
            ],
            insertRows: [
              {
                sequence: "continue",
                startRow: 6, proc: "hr_rpt_1010020_summary", params: [...p_param], imageColumns: ["BASE64"], dateColumns: ["JOIN_DT", "BIRTH_DT"], stringColumns: ["EMP_ID", "ID_NUM", "OLD_ID"]
              }
            ],
            hideColumns: hiddenCols
          },
        ];
        break;
      }
  
      case "02": {
        startSalCol = 14;
        if (that.salary_security === "Y") {
          for (let i = 1; i <= 20; i++) {
            let allowIdx = that.allowanceList.findIndex(x => Number(x.CODE.replace("A", "")) == i);
            if (allowIdx >= 0) {
              let allow = that.allowanceList[allowIdx];
  
              if (allow.NUM1 === "1") {
                  reportHeader["ALLOW_" + allow.CODE.replace("A", "")] = allow.NAME;
              } else {
                  hiddenCols.push((startSalCol + 1) + i); //(startSalCol + 1): 2 column salary
              }
            } else {
              hiddenCols.push((startSalCol + 1) + i); //(startSalCol + 1): 2 column salary
            }
          }
        } else {
          if (that.company["PARTNER_ID"] == 'WNW') {
            report_path = "report/10/10/standard/1010020_detail_no_sal_eng.xlsx";
          }else{
            report_path = "report/10/10/standard/1010020_detail_no_sal.xlsx";
          }
          hiddenCols = Array.from(Array(67), (_, x) => (x >= 49 && x <= 66) ? x : null).filter(x => x != null);
        }
  
        excel = [
          {
            sheet: 1,
            insertRange: [
              { range: "A2:BN6", data: reportHeader },//header
            ],
            insertRows: [
              {
                sequence: "continue",
                startRow: 7, proc: "hr_rpt_1010020_detail", params: [...p_param], imageColumns: ["BASE64"], dateColumns: ["JOIN_DT", "BIRTH_DT", "LEFT_DT", "BEGIN_PROBATION","ISSUE_DT", "END_PROBATION", "BEGIN_CONTRACT", "END_CONTRACT"], stringColumns: ["EMP_ID", "ID_NUM", "OLD_ID", "PERSON_ID", "ACCOUNT"],
              }
            ],
            hideColumns: hiddenCols
          },
        ];
        break;
      }
  
      //docx test
      case '03': {
        reportType = "word";
        doc = {
          KEY: "TCO_ORG_PK",
          proc: "hr_rpt_1010020_docx_test",
          params: [that.user.TCO_COMPANY_PK],
          details: {
              EMPLOYEE: { proc: "hr_rpt_1010020_docx_test2", params: [that.user.TCO_COMPANY_PK], }
          }
        }
        break;
      }
      default: // report cho cty
            await companyjs.print(that, reportInfo, p_search);
            return;
    }
  
    if (!report_path) {
      that.showNotification(  "danger", that.$t("please_select_report"),  "",  4000 );
      return;
    }
  
    that.isProcessing = true;
  
    let res = null;
    if (reportType === "excel") {
        res = await that.$axios.$get('/dso/makereport', { responseType: "blob", params: { template: report_path, excel: JSON.stringify(excel) } });
    } else if (reportType === "word") {
        res = await that.$axios.$get('/dso/makereport', { responseType: "blob", params: { template: report_path, doc: JSON.stringify(doc), reporttype: "word" } });
        that._DocSaveAs(res, "test.docx");
        that.isProcessing = false;
        return;
    }
  
    if (res && res.size > 0) {
        that._ExcelSaveAs(res, report_name);
    } else {
        that.showNotification("danger", that.$t("fail_to_export_report"), "", 4000);
    }
  
    that.isProcessing = false;
  },

  print2: async (that, reportInfo, p_search) => {
    let p_param = [...p_search];

    let report_no = reportInfo["CODE"];
    let report_path = reportInfo.REPORT_PATH;
    let reportHeader = {};
    let excel = [];
    let report_name = reportInfo.NAME + ".xlsx";

    reportHeader = {
        USER_NAME: that.user.USER_NAME
    };


    switch (report_no) {
      case "01": {
        excel = [
            {
              sheet: 1,
              insertRange: [
                  { range: "A2:X4", data: reportHeader },//header
              ],
              insertRows: [
                  {
                      sequence: "continue",
                      startRow: 6, proc: "hr_rpt_1010020_insurance", params: [...p_param], dateColumns: ["JOIN_DT", "LEFT_DT", "SUBMIT_BOOK_DT", "RETURN_BOOK_DT"], stringColumns: ["EMP_ID", "ID_NUM", "OLD_ID"],
                  }
              ],
            },
        ];
        break;
      }
      default: report_path = ""; break;
    }

    if (!report_path) {
      that.showNotification(  "danger", that.$t("please_select_report"), "", 4000 );
      return;
    }

    that.isProcessing = true;

    const res = await that.$axios.$get('/dso/makereport', { responseType: "blob", params: { template: report_path, excel: JSON.stringify(excel) } });
    if (res && res.size > 0) {
      that._ExcelSaveAs(res, report_name);
    } else {
      that.showNotification("danger", that.$t("fail_to_export_report"), "", 4000);
    }

    that.isProcessing = false;
  }

};

let prepareCommonData = async (that) => {
  companyList = await that._getCompany();
  company = companyList.find(x => x["PK"] === that.selectedCompany );
};


export default rpt1011021;