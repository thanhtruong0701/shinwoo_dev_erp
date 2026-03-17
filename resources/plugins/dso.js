import Vue from "vue"; 
Vue.mixin({
    data: () => ({
        isProcessing: false,
        POPUP_ERROR_DELAY: 60 * 1000, //60 SECOND ==> ms.Tuyen Phan req down to
        SECOND_DB_YN: null
    }),
    methods: {
        async _getCommonCode(p_parent_code, p_tco_company_pk = 0) {
            let datas = await this._getCommonCode2([p_parent_code], p_tco_company_pk, false);
            return datas[0];
        },
        async _getCommonCode2(p_parent_code, p_tco_company_pk = 0, p_name_code = false) {
            let _codesStored = this.$store.getters["comm/commcodes"][p_tco_company_pk] || {};
            let _returnCodes = [];
            let _notFoundCodes = {};
            let _parentCodeNotFound = [];

            p_parent_code.forEach((x) => {
                if(!_codesStored.hasOwnProperty(x.trim())) {
                    _parentCodeNotFound.push(x);
                }
            })


            if(_parentCodeNotFound.length > 0) {
                this._setSecondDBStstus();
                let _para = [p_tco_company_pk, _parentCodeNotFound.join(",")];
                let res = await this.$axios.$post("dso/callproc", {
                    proc: "sys_sel_common_code21",
                    para: _para,
                    _db2: this.SECOND_DB_YN
                });

                if(res) {
                    if(res.data && res.data.length > 0) {
                        _parentCodeNotFound.forEach(x => {
                            let codes = res.data.filter((q) => q.PARENT_CODE === x);
                            if (p_name_code) {
                                codes.map((w) => { w.NAME = w.CODE + " - " + w.NAME; });
                            }
                            this.$store.dispatch("comm/setCommcodes", { tco_company_pk : p_tco_company_pk, parent_code: x, data:  codes});
                            _notFoundCodes[x] = [...codes];
                        })
                    }
                }
            }

            //return code
            p_parent_code.forEach((x) => {
                if(_codesStored.hasOwnProperty(x)) {
                    _returnCodes.push([..._codesStored[x]]);
                } else {
                    if(_notFoundCodes.hasOwnProperty(x)) {
                        _returnCodes.push([..._notFoundCodes[x]]);
                    } else {
                        _returnCodes.push([]);
                    }
                }
            })
            return _returnCodes;
        },

        async _validateParameter(_procedure_name, _parameter_name) {
            let _sql = `select 1 from user_arguments q where q.object_name = upper('${_procedure_name}') and q.argument_name = upper('${_parameter_name}')`;
            let res = await this._execSQL(_sql);
            
            return ( Array.isArray(res) && res.length > 0 ) ? true : false;
        },

        async _validateProcedure(_procedure_name) {
            let _sql = `select 1 from user_procedures q where q.object_name = upper('${_procedure_name}')`;
            let res = await this._execSQL(_sql);
            
            return ( Array.isArray(res) && res.length > 0 ) ? true : false;
        },

        async _getCommonCode3(p_parent_code = 0, p_name_code = false) {
            this._setSecondDBStstus();
            let commonList = [];
            let _para = [p_parent_code.join(",")];

            let res = await this.$axios.$post("dso/callproc", {
                proc: "sys_sel_common_code22",
                para: _para,
                _db2: this.SECOND_DB_YN
            });
            if (res) {
                if (res.data && res.data.length > 0) {
                    p_parent_code.forEach((x) => {
                        let codes = res.data.filter((q) => q.PARENT_CODE === x);

                        if (p_name_code) {
                            codes.map((w) => {
                                w.NAME = w.CODE + " - " + w.NAME;
                            });
                        }

                        commonList.push(codes ? codes : []);
                    });
                }
            }

            return commonList;
        },

        async _getHRCode(p_parent_code, p_tco_company_pk = 0, p_tco_busplace_pks = '') {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc", {
                proc: "sys_sel_hr_code",
                para: [p_tco_company_pk, p_parent_code, p_tco_busplace_pks ? p_tco_busplace_pks : ''],
                _db2: this.SECOND_DB_YN
            });

            return res.data ? res.data : [];
        },

        async _getHRCode2(p_parent_code, p_tco_company_pk = 0, p_name_code = false, p_tco_busplace_pks = '') {
            this._setSecondDBStstus();
            let commonList = [];
            let _para = [p_tco_company_pk, p_parent_code.join(","), p_tco_busplace_pks ? p_tco_busplace_pks : ''];

            let res = await this.$axios.$post("dso/callproc", {
                proc: "sys_sel_hr_code21",
                para: _para,
                _db2: this.SECOND_DB_YN
            });
            if (res) {
                if (res.data && res.data.length > 0) {
                    p_parent_code.forEach((x) => {
                        let codes = res.data.filter((q) => q.PARENT_CODE === x);

                        if (p_name_code) {
                            codes.map((w) => {
                                w.NAME = w.CODE + " - " + w.NAME;
                            });
                        }

                        commonList.push(codes ? codes : []);
                    });
                }
            }

            return commonList;
        },

        async _getDocType() { //p_tco_company_pk = 0
            const dso = {
                type: 'process',
                updpro: "ea_pro_1310010_doc_type",
                para: null //[p_tco_company_pk]
            }

            const result = await this._dsoCall(dso, 'process', false)
            if (result) {
                return result;
            } else {
                return [];
            }
        },

        async _getCustomField(p_user_pk, p_tco_company_pk, p_menu_cd, p_tab_id = '', p_grid_id = '', p_cus_para = '') {
            let _fieldsStored = this.$store.getters["comm/fields"][p_tco_company_pk] || {};
            let _returnFields = [];

            if(_fieldsStored.hasOwnProperty(p_menu_cd)/* && _fieldsStored[p_menu_cd].length > 0*/) {
                _returnFields = _fieldsStored[p_menu_cd]
                .filter(q => this._nullToEmpty(q.TAB_ID).toLowerCase() == this._nullToEmpty(p_tab_id).toLowerCase()  
                            && this._nullToEmpty(q.GRID_ID).toLowerCase() == this._nullToEmpty(p_grid_id).toLowerCase() 
                );
            } else {
                this._setSecondDBStstus();
                let res = await this.$axios.$post("dso/callproc", {
                    proc: "SYS_SEL_FORM_CUSTOM_FIELD",
                    para: [p_user_pk, p_menu_cd, !!p_tab_id ? p_tab_id : "", !!p_grid_id ? p_grid_id : ""],
                    _db2: this.SECOND_DB_YN
                });

                if (res.data && res.data.length > 0) {
                    let datas = res.data;
                    const promises = datas.map(async (x) => {
                        if (x.FIELD_TYPE == "LIST") {
                            if (!!x.TCO_COMMCODE) {
                                x["dataSource"] = await this._getCommonCode(x.TCO_COMMCODE, p_tco_company_pk)
                            } else {
                                x["dataSource"] = await this._callProcedure(x.PROCEDURE_NAME, p_cus_para);
                            }

                        }
                    });
                    await Promise.all(promises);
                }

                this.$store.dispatch("comm/setFields", { tco_company_pk : p_tco_company_pk, menu_id: p_menu_cd, data: res.data});
                _returnFields = res.data ? res.data : [];
            }
            return _returnFields;
        },

        async _getDataList(p_procedure, p_param = []) {
            let dso = {};
            if (p_param.length == 0) {
                dso = {
                    type: "list",
                    selpro: p_procedure,
                };
            } else {
                dso = {
                    type: "list",
                    selpro: p_procedure,
                    para: p_param,
                };
            }
            const res = await this._dsoCall(dso, "select", false);
            if (res) {
                return res;
            } else {
                return [];
            }
        },

        async _getReportList(p_menu_cd, p_tab, p_tco_company_pk = 0) {
            let _reportsStored = this.$store.getters["comm/reports"][p_tco_company_pk] || {};
            let _returnReports = [];
            // if(_reportsStored.hasOwnProperty(p_menu_cd) && _reportsStored[p_menu_cd].length > 0) {
            //     _returnReports = _reportsStored[p_menu_cd].filter(q => this._nullToEmpty(q.TAB).toLowerCase() == this._nullToEmpty(p_tab).toLowerCase()  );
            // } else {
                this._setSecondDBStstus();
                let res = await this.$axios.$post("dso/callproc", {
                    proc: "hr_sel_report_list_nocache",
                    para: [p_tco_company_pk, p_menu_cd, p_tab],
                    _db2: this.SECOND_DB_YN
                });

                this.$store.dispatch("comm/setReports", { tco_company_pk : p_tco_company_pk, menu_id: p_menu_cd, data: res.data});
                _returnReports = res.data ? res.data : [];
            //}

            return _returnReports;
        },

        async _getCostCenter(p_tco_company_pk = 0, p_plc_pk, p_plc_cd_nm) {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc", {
                proc: "hr_sel_cost_center",
                para: [p_tco_company_pk, p_plc_pk, p_plc_cd_nm],
                _db2: this.SECOND_DB_YN
            });

            return res.data ? res.data : [];
        },
        async _getSalarySecurity(p_user_pk = 0) {
            //let _settingsStored = this.$store.getters["comm/user_settings"] || {};
            // if(_settingsStored.hasOwnProperty("salary_security") ) {
            //     return _settingsStored.salary_security;
            // } else {
                this._setSecondDBStstus();
                let res = await this.$axios.$post("dso/callproc", {
                    proc: "sys_pro_salary_display",
                    para: [p_user_pk],
                    _db2: this.SECOND_DB_YN
                });
                if (res.data) {
                    //this.$store.dispatch("comm/setUserSettings", { key: "salary_security", value: res.data[0].SALARY_SECURITY } );
                    return res.data[0].SALARY_SECURITY;
                }
            //}

            return "N";
        },
        async _getHRLevel(p_user_pk = 0) {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc", {
                proc: "sys_pro_hr_level_security",
                para: [p_user_pk],
                _db2: this.SECOND_DB_YN
            });
            return res.data ? res.data : [];
        },
        async _getSalaryPeriodByMonth(p_tco_company_pk = 0, p_work_mon) {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc", {
                proc: "sys_pro_get_sal_period_by_mon",
                para: [p_tco_company_pk, p_work_mon],
                _db2: this.SECOND_DB_YN
            });

            return res.data ? res.data : [];
        },
        async _getAllFactory(p_user_pk = 0) {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc", {
                proc: "sys_sel_list_factory",
                para: [p_user_pk],
                _db2: this.SECOND_DB_YN
            });
            return res.data ? res.data : [];
        },
        async _getFactoryByUsery(p_user_pk = 0, p_pr_level = 6) {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc", {
                proc: "gsf20_lg_sys_get_factory",
                para: [p_user_pk, p_pr_level],
                _db2: this.SECOND_DB_YN
            });
            return res.data ? res.data : [];
        },
        async _getFactoryByCompanyUser(p_tco_company_pk = 0, p_user_pk = 0, p_pr_level = 6) {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc", {
                proc: "sys_sel_list_factory_by_com_user",
                para: [p_tco_company_pk, p_user_pk, p_pr_level],
                _db2: this.SECOND_DB_YN
            });
            return res.data ? res.data : [];
        },
        async _getWHTree(p_user_pk = 0) {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc", {
                proc: "sys_sel_list_wh_tree",
                para: [p_user_pk],
                _db2: this.SECOND_DB_YN
            });
            return res.data ? res.data : [];
        },
        async _getOrg(p_tco_company_pk = 0) {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc", {
                proc: "sys_sel_list_org",
                para: [p_tco_company_pk],
                _db2: this.SECOND_DB_YN
            });
            return res.data ? res.data : [];
        },
        async _getOrgByUser(p_user_pk = 0) {
            let _orgs = null;//this.$store.getters["comm/user_organizations"];
            if(_orgs?.length > 0) {
                return JSON.parse(JSON.stringify(_orgs));
            } else {
                this._setSecondDBStstus();
                let res = await this.$axios.$post("dso/callproc", {
                    proc: "sys_sel_list_org_user",
                    para: [p_user_pk],
                    _db2: this.SECOND_DB_YN
                });

                //this.$store.dispatch("comm/setUserOrganizations", res.data);

                return res.data ? res.data : [];
            }
        },
        async _getWorkGroup(p_tco_company_pk = 0) {
            let _workgroups = null;// this.$store.getters["comm/workgroups"];
            let _hasWorkgroups = _workgroups && _workgroups[p_tco_company_pk]/*?.length > 0*/;

            if(_hasWorkgroups) {
                return  JSON.parse(JSON.stringify(_workgroups[p_tco_company_pk])) ;
            } else {
                this._setSecondDBStstus();
                let res = await this.$axios.$post("dso/callproc", {
                    proc: "SYS_SEL_LIST_WG_NOCACHE",
                    para: [p_tco_company_pk],
                    _db2: this.SECOND_DB_YN
                });

                //this.$store.dispatch("comm/setWorkgroups", { tco_company_pk: p_tco_company_pk, data: res.data } );

                return res.data ? res.data : [];
            }
        },
        async _getWorkProcess(p_pb_process_pk = 0) {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc", {
                proc: "SYS_SEL_LIST_WP_NOCACHE",
                para: [p_pb_process_pk],
                _db2: this.SECOND_DB_YN
            });
            return res.data ? res.data : [];
        },
        async _getWorkGroupByBiz(p_tco_company_pk = 0, p_tco_busplace_pks = '') {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc", {
                proc: "SYS_SEL_LIST_WG_BIZ",
                para: [p_tco_company_pk, p_tco_busplace_pks],
                _db2: this.SECOND_DB_YN
            });
            return JSON.parse(JSON.stringify(res.data ? res.data : [])) ; //res.data ? res.data : [];
        },
        async _getDepositAccount(p_tco_company_pk = 0) {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc", {
                proc: "ac_sel_deposit_account",
                para: [p_tco_company_pk],
                _db2: this.SECOND_DB_YN
            });
            return res.data ? res.data : [];
        },
        async _getWorkShift(p_tco_company_pk = 0) {
            let _workshifts = null;// this.$store.getters["comm/workshifts"];
            let _hasWorkshifts = _workshifts && _workshifts[p_tco_company_pk]?.length > 0;
            
            if(_hasWorkshifts) {
                return JSON.parse(JSON.stringify(_workshifts[p_tco_company_pk]));
            } else {
                this._setSecondDBStstus();
                let res = await this.$axios.$post("dso/callproc", {
                    proc: "SYS_SEL_LIST_WS_NOCACHE",
                    para: [p_tco_company_pk],
                    _db2: this.SECOND_DB_YN
                });

                //this.$store.dispatch("comm/setWorkshifts", { tco_company_pk: p_tco_company_pk, data: res.data } );

                return res.data ? res.data : [];
            }
        },
        async _getBank(p_tco_company_pk = 0) {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc", {
                proc: "ac_sel_bank",
                para: [p_tco_company_pk],
                _db2: this.SECOND_DB_YN
            });
            return res.data ? res.data : [];
        },
        async _getTransTypeList(p_tco_company_pk = 0) {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc", {
                proc: "ac_sel_trans_type",
                para: [p_tco_company_pk],
                _db2: this.SECOND_DB_YN
            });
            return res.data ? res.data : [];
        },
        async _getExChangRateList(p_tco_company_pk = 0, p_date) {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc", {
                proc: "ac_sel_ex_rate",
                para: [p_tco_company_pk, p_date],
                _db2: this.SECOND_DB_YN
            });
            return res.data ? res.data : [];
        },
        async _getItemgrpByGroupType(p_group_type = null) {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc", {
                proc: "lg_sel_itemgrp_by_group_type",
                para: [p_group_type],
                _db2: this.SECOND_DB_YN
            });
            return res.data ? res.data : [];
        },
        async _getPBLineByGroup(p_line_group = null, p_line_name = null) {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc", {
                proc: "lg_sel_pb_line_by_group",
                para: [p_line_group, p_line_name],
                _db2: this.SECOND_DB_YN
            });
            return res.data ? res.data : [];
        },
        async _getUOM(p_tco_company_pk = 0) {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc", {
                proc: "lg_sel_uom",
                para: [p_tco_company_pk],
                _db2: this.SECOND_DB_YN
            });
            return res.data ? res.data : [];
        },
        async _getItemGroup(p_tco_company_pk = 0) {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc", {
                proc: "sys_get_item_group",
                para: [p_tco_company_pk],
                _db2: this.SECOND_DB_YN
            });
            return res.data ? res.data : [];
        },
        async _getExchangeRate(p_date, p_tco_company_pk, p_ccy, p_type = "date") {
            this._setSecondDBStstus();
            if (p_type == "month") {
                let res_m = await this.$axios.$post("dso/callproc", {
                    proc: "AC_PRO_GET_MONTH_RATE",
                    para: [p_date, p_tco_company_pk, p_ccy],
                    _db2: this.SECOND_DB_YN
                });
                if (res_m.data.length > 0) {
                    return res_m.data[0].EX_RATE;
                }
            } else {
                let res = await this.$axios.$post("dso/callproc", {
                    proc: "ac_pro_getrate",
                    para: [p_date, p_tco_company_pk, p_ccy],
                    _db2: this.SECOND_DB_YN
                });
                if (res.data.length > 0) {
                    return res.data[0].EX_RATE;
                }
            }

            return 1;
        },
        async _getCompany() {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc", {
                proc: "sys_get_company",
                _db2: this.SECOND_DB_YN
            });
            return res.data ? res.data : [];
        },
        async _getCompanyByUser(p_user_pk) {
            let _companies = null;// this.$store.getters["comm/user_companies"];
            if(_companies?.length > 0) {
                return JSON.parse(JSON.stringify(_companies));
            } else {
                this._setSecondDBStstus();
                let res = await this.$axios.$post("dso/callproc", {
                    proc: "sys_sel_list_company",
                    para: [p_user_pk],
                    _db2: this.SECOND_DB_YN
                });

                //this.$store.dispatch("comm/setUserCompanies", res.data);

                return res.data ? res.data : [];
            }
        },

        async _getBizPlaceByCompany(p_tco_company_pk) {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc", {
                proc: "sys_sel_list_biz_place",
                para: [p_tco_company_pk],
                _db2: this.SECOND_DB_YN
            });

            return res.data ? res.data : [];
        },

        async _getBizPlaceBuUser(p_user_pk) {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc", {
                proc: "sys_sel_list_biz_place_user",
                para: [p_user_pk],
                _db2: this.SECOND_DB_YN
            });

            return res.data ? res.data : [];
        },

        async _callProcedure(p_proc, p_para, p_db2_yn = 'N') {
            let res;
            if (p_db2_yn == 'Y') {
                res = await this.$axios.$post("dso/callproc", {
                    proc: p_proc,
                    para: p_para,
                    _db2: 'Y'
                });
            } else {
                this._setSecondDBStstus();
                res = await this.$axios.$post("dso/callproc", {
                    proc: p_proc,
                    para: p_para,
                    _db2: this.SECOND_DB_YN
                });
            }
            if (res.data && res.data.length > 0) {
                if (res.data[0].ERRCODE) {
                    if (res.data[0].ERRMSG) {
                        this.showNotification("danger", this.$t(res.data[0].ERRCODE) + " [" + res.data[0].ERRMSG + "]", "", this.POPUP_ERROR_DELAY);
                    } else {
                        this.showNotification("danger", this.$t(res.data[0].ERRCODE), "", this.POPUP_ERROR_DELAY);
                    }
                    return [];
                }
            }
            return res.data ? res.data : [];
        },
        async _execSQL(p_sql, p_para = null) {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/execsql", {
                sql: p_sql,
                para: p_para,
                _db2: this.SECOND_DB_YN
            });
            return res.data ? res.data : [];
        },
        async _callProcedureMultiCursor(p_proc, p_para, p_number_cursor) {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc2", {
                proc: p_proc,
                para: p_para,
                number_cursor: p_number_cursor,
                _db2: this.SECOND_DB_YN
            });

            return res.data ? res.data : [];
        },
        _setSecondDBStstus() {
            if (this._secondDBMenu.some(item => item.FORM_URL == this.$root._route.fullPath)) {
                this.SECOND_DB_YN = 'Y';
            }
        },
        //vng-207 20221126 add delayNextCall xử lý cho trường hợp grid có data dòng sau cần pk dòng trước
        async _dsoCall(dso, action = "update", notice = true, acntStyle = '', p_check_db2 = "Y", delayNextCall = 0) {
            if (p_check_db2 == "Y" || p_check_db2 == undefined) {
                this._setSecondDBStstus();
            } else {
                this.SECOND_DB_YN = 'N';
            }

            /* dso = {
                      type:'grid|control|process|list'
                      selpro:'ac_sel_6010010_grid',
                      updpro:'ac_upd_6010010_grid',
                      para: para,   //type array[]
                      elname: elname,   //type array[]
                      requirecol: require column //type array[]
                      data: data,  //array json
                  } */
            return await this.dsoCall(dso, action, notice, acntStyle, delayNextCall);
        },

        async dsoCall(dso, action, notice, acntStyle = '', delayNextCall = 0) {
            try {
                let res = null;
                if (dso.para) {
                    for (let i = 0; i < dso.para.length; i++) {
                        if (dso.para[i] == "null" || dso.para[i] === null || dso.para[i] === undefined) {
                            dso.para[i] = "";
                        }
                        //dso.para[i] = typeof dso.para[i] === "string" ? dso.para[i].replace(/\'/g, "''") : dso.para[i];
                    }
                }
                if (action === "select") {
                    this.isProcessing = true;
                    const para = {
                        proc: dso.selpro,
                        para: dso.para,
                        para_extra: dso.para_extra,
                        _db2: this.SECOND_DB_YN
                    }
                    res = await this.$axios.$post("dso/callproc", para);

                    this.isProcessing = false;
                    if (res.success == false) {
                        let msg = this.$t(res.message);
                        this.handlingErrorMessage(res.message, '', acntStyle, notice);
                        //this.showNotification("danger", msg, "", this.POPUP_ERROR_DELAY);
                        if (res.message == "your_session_timeout_logout_and_login_to_continue") {
                            //this.$store.commit("auth/FETCH_USER_FAILURE");
                            this.$store.dispatch("auth/logout");
                            this.$store.dispatch("comm/clearUserCommons");
                            //this.$router.push("/login");
                            alert(msg);
                            window.location.href = "/login";
                        }
                        return null;
                    } else if (res.data && res.data.length > 0) {
                        if (res.data[0].ERRCODE) {
                            if (res.data[0].ERRMSG) {
                                this.showNotification(acntStyle ? "warning" : "danger", this.$t(res.data[0].ERRCODE) + " [" + res.data[0].ERRMSG + "]", "", this.POPUP_ERROR_DELAY);
                            } else {
                                this.showNotification(acntStyle ? "warning" : "danger", this.$t(res.data[0].ERRCODE), "", this.POPUP_ERROR_DELAY);
                            }
                            return null;
                        }
                    }

                    if (res.data) {
                        res.data.forEach((e) => {
                            e._rowstatus = "";
                        });
                    } else {
                        return this.showNotification("warning", this.$t("no_data_found"), "", 3000);
                    }

                    // if (notice) {
                    //     this.showNotification("success", this.$t("get_data_success"), "");
                    // }
                    if (dso.type === "control") {
                        if (res.data.length > 0) return res.data[0];
                    }
                    //console.log(res.data)
                    return res.data;
                } else {
                    // Insert/Update/Delete
                    if (dso.type === "control") {
                        this.isProcessing = true;

                        if (dso.requirecol) {
                            for (let i = 0; i < dso.requirecol.length; i++) {
                                let cell = eval(`dso.data.` + dso.requirecol[i]);
                                if (cell === null || cell === "" || cell === undefined) {
                                    return this.showNotification(acntStyle ? "warning" : "danger", `Field ${this.$t(dso.requirecol[i].toLowerCase())} must not empty!`, "", this.POPUP_ERROR_DELAY);
                                }
                            }
                        }

                        if (dso.data._rowstatus) {
                            let result = null;

                            if (dso.colfile && dso.colfile.length > 0) {
                                result = await this.delayedDataProcessBlob(dso.data, dso);
                            } else {
                                result = await this.delayedDataProcess(dso.data, dso);
                            }

                            if (!result) {
                                return null;
                            } else {
                                await this.wait(500);

                                res = await this.$axios.$post("dso/callproc", {
                                    proc: dso.selpro,
                                    para: dso.para1 ? dso.para1 : [dso.data.PK],
                                    _db2: this.SECOND_DB_YN
                                });
                                let rtn = null;
                                if (res.success == false) {
                                    this.handlingErrorMessage(res.message, '', acntStyle);
                                    // return this.showNotification(
                                    //     "danger",
                                    //     res.message,
                                    //     "",
                                    //     this.POPUP_ERROR_DELAY
                                    // );
                                }
                                if (res.data.length > 0) {
                                    res.data[0]._rowstatus = "";
                                    rtn = res.data[0];
                                } else {
                                    rtn = this._initObject(dso.elname);
                                }
                                if (notice) {
                                    this.showNotification("success", this.$t("update_success"), "");
                                }

                                return rtn;
                            }
                        } else {
                            this.showNotification("danger", this.$t("missing_rowstatus"), "");
                        }
                    } else if (dso.type === "grid") {
                        if (dso.requirecol) {
                            for (let i = 0; i < dso.requirecol.length; i++) {
                                for (let j = 0; j < dso.data.length; j++) {
                                    let cell = eval(`dso.data[${j}].` + dso.requirecol[i]);
                                    if ((cell === null || cell === "" || cell === undefined) && (dso.data[j]._rowstatus == "i" || dso.data[j]._rowstatus == "u")) {
                                        return this.showNotification(acntStyle ? "warning" : "danger", `Field ${this.$t(dso.requirecol[i].toLowerCase())} at row ${j + 1} must not empty!`, "", this.POPUP_ERROR_DELAY);
                                    }
                                }
                            }
                        }

                        let paras = [];
                        for (let i = 0; i < dso.data.length; i++) {
                            let item = dso.data[i];
                            //console.log(item)
                            if (item._rowstatus) {
                                let para = [];
                                for (let j = 0; j < dso.elname.length; j++) {
                                    let val;
                                    if (dso.elname[j] == "ADDDITION_PARA") {
                                        val = item.ADDDITION_PARA;
                                    } else {
                                        try {
                                            val = item[dso.elname[j]];
                                        } catch (ex) {
                                            val = "";
                                        }
                                    }
                                    if (val == "null" || val == undefined || val == null) {
                                        val = "";
                                    }
                                    val = typeof val === "string" ? val/*.replace(/\'/g, "''")*/.replace(/\?/g, "\?") : val;
                                    para.push(val);
                                }
                                paras.push(para);
                            }
                        }
                        this.isProcessing = true;
                        res = await this.$axios.$post("dso/bulkinsertpro", {
                            proc: dso.updpro,
                            para: paras,
                            _db2: this.SECOND_DB_YN
                        });
                        if (res.success == false) {
                            this.handlingErrorMessage(res.message);
                            return false;
                        } else if (res.data.length > 0 && res.data[0].ERRCODE) {
                            if (res.data[0].ERRMSG) {
                                this.showNotification("danger", this.$t(res.data[0].ERRCODE) + " [" + res.data[0].ERRMSG + "]", "", this.POPUP_ERROR_DELAY);
                            } else {
                                this.showNotification("danger", this.$t(res.data[0].ERRCODE), "", this.POPUP_ERROR_DELAY);
                            }
                            return false;
                        } else if (res.success == true) {
                            if (res.data.length > 0) {
                                for (let i = 0; i < res.data.length; i++) {
                                    //if return cursor has ERRCODE
                                    if (res.data[i][0].ERRCODE) {
                                        if (res.data[i][0].ERRMSG) {
                                            return this.showNotification("danger", this.$t(res.data[i][0].ERRCODE) + " [" + res.data[i][0].ERRMSG + "]", "", this.POPUP_ERROR_DELAY);
                                        }
                                        return this.showNotification("danger", this.$t(res.data[i][0].ERRCODE), "", this.POPUP_ERROR_DELAY);
                                    }
                                }
                            }
                            if (dso.selpro) {
                                await this.wait(500);
                                
                                res = await this.$axios.$post("dso/callproc", {
                                    proc: dso.selpro,
                                    para: dso.para,
                                    para_extra: dso.para_extra,
                                    _db2: this.SECOND_DB_YN
                                });
                                if (res.success == false) {
                                    this.handlingErrorMessage(res.message, '', acntStyle);
                                    return null;
                                }
                                if (res.data.length > 0) {
                                    res.data.forEach((e) => {
                                        e._rowstatus = "";
                                    });
                                }
                                this.isProcessing = false;
                                if (notice) {
                                    this.showNotification("success", this.$t("update_success"), "");
                                }
                                return res.data;
                            } else {
                                this.isProcessing = false;
                                if (notice) {
                                    this.showNotification("success", this.$t("update_success"), "");
                                }
                                return 1;
                            }
                        }
                    } else {
                        //process
                        this.isProcessing = true;
                        res = await this.$axios.$post("dso/callproc", {
                            proc: dso.updpro,
                            para: dso.para,
                            para_extra: dso.para_extra,
                            _db2: this.SECOND_DB_YN
                        });
                        this.isProcessing = false;
                        if (res.success == false) {
                            return this.handlingErrorMessage(res.message, '', acntStyle);
                        } else {
                            if (res.data && res.data.length > 0) {
                                if (res.data[0].ERRCODE) {
                                    if (res.data[0].ERRMSG) {
                                        this.showNotification(acntStyle ? "warning" : "danger", this.$t(res.data[0].ERRCODE) + " [" + res.data[0].ERRMSG + "]", "", this.POPUP_ERROR_DELAY);
                                    } else {
                                        this.showNotification(acntStyle ? "warning" : "danger", this.$t(res.data[0].ERRCODE), "", this.POPUP_ERROR_DELAY);
                                    }
                                    return false;
                                }
                            } else {
                                //if (notice) this.showNotification(acntStyle?"warning":"danger", this.$t("no_return_data"), "", this.POPUP_ERROR_DELAY);
                            }
                        }

                        if (notice) {
                            this.showNotification("success", this.$t("process_success"), "");
                        }
                        return res.data;
                    }
                }
            } catch (e) {
                this.isProcessing = false;
                //console.log(e.message)
                if (e.message.indexOf("504") > 0) {
                    this.showNotification("danger", this.$t("timeout"), "server_not_available_now_please_try_later");
                } else if (e.message.indexOf("502") > 0) {
                    this.showNotification("danger", this.$t("restarting"), "server_restarting_please_try_later");
                } else {
                    this.showNotification("danger", this.$t("unexpected_error"), e.message);
                }
            } finally {
                this.isProcessing = false;
            }
        },
        async delayedDataProcess(item, dso) {
            try {
                let para = [];
                if (item._rowstatus) {
                    for (let j = 0; j < dso.elname.length; j++) {
                        let val;
                        if (dso.elname[j] == "ADDDITION_PARA") {
                            val = item.ADDDITION_PARA;
                        } else {
                            try {
                                val = eval("item." + dso.elname[j]);
                            } catch (ex) {
                                val = "";
                            }
                        }

                        if (val == "null" || val == undefined || val == null) {
                            val = "";
                        }
                        //val = typeof val === "string" ? val.replace("'", "''").replace("?", "\\?") : val;

                        val = typeof val === "string" ? val/*.replace(/\'/g, "''")*/.replace(/\?/g, "\?") : val;

                        para.push(val);
                    }
                    this.isProcessing = true;
                    const res = await this.$axios.$post("dso/callproc", {
                        proc: dso.updpro,
                        para: para,
                        _db2: this.SECOND_DB_YN
                    });
                    if (res.success == false) {
                        this.handlingErrorMessage(res.message);
                        //this.showNotification("danger", res.message, "", this.POPUP_ERROR_DELAY);
                        return false;
                    } else if (res.data[0].ERRCODE) {
                        if (res.data[0].ERRMSG) {
                            this.showNotification("danger", this.$t(res.data[0].ERRCODE) + " [" + res.data[0].ERRMSG + "]", "", this.POPUP_ERROR_DELAY);
                        } else {
                            this.showNotification("danger", this.$t(res.data[0].ERRCODE), "", this.POPUP_ERROR_DELAY);
                        }
                        return false;
                    }
                    if (dso.type === "control") {
                        let rtnKeys = Object.keys(res.data[0]);
                        rtnKeys.forEach((q) => {
                            item[q] = res.data[0][q];
                        });
                    }
                    return true;
                } else {
                    this.showNotification("danger", this.$t("item_status_no_change"), "", this.POPUP_ERROR_DELAY);
                    return false;
                }
            } catch (e) {
                //console.log(e);
                this.showNotification("danger", e.message, "", this.POPUP_ERROR_DELAY);
                return false;
            }
        },


        async delayedDataProcessBlob(item, dso) {
            try {
                let para = [];
                if (item._rowstatus) {
                    for (let j = 0; j < dso.elname.length; j++) {
                        let val;
                        if (dso.elname[j] == "ADDDITION_PARA") {
                            val = item.ADDDITION_PARA;
                        } else {
                            try {
                                val = eval("item." + dso.elname[j]);
                            } catch (ex) {
                                val = "";
                            }
                        }

                        if (val == "null" || val == undefined || val == null) {
                            val = "";
                        }
                        //val = typeof val === "string" ? val.replace("'", "''").replace("?", "\\?") : val;

                        val = typeof val === "string" ? val/*.replace(/\'/g, "''")*/.replace(/\?/g, "\?") : val;

                        para.push(val);
                    }
                    this.isProcessing = true;


                    const fd = new FormData();
                    let params = {
                        keys: [...dso.elname]
                    };

                    let fileIdx = 0;
                    dso.elname.forEach((key, idx) => {
                        if (dso.colfile.includes(key)) {
                            params[key] = `byte-array${fileIdx++}`;
                            fd.append('files', item[key].file);
                        } else {
                            params[key] = item[key];
                        }
                    });

                    fd.append('proc', dso.updpro);
                    fd.append('para', JSON.stringify(params));

                    let res = await this.$axios({
                        method: 'post',
                        url: '/dso/callprocedureblob',
                        data: fd
                    });

                    res = res.data;
                    if (res.success == false) {
                        this.handlingErrorMessage(res.message);
                        //this.showNotification("danger", res.message, "", this.POPUP_ERROR_DELAY);
                        return false;
                    } else if (res.data[0].ERRCODE) {
                        if (res.data[0].ERRMSG) {
                            this.showNotification("danger", this.$t(res.data[0].ERRCODE) + " [" + res.data[0].ERRMSG + "]", "", this.POPUP_ERROR_DELAY);
                        } else {
                            this.showNotification("danger", this.$t(res.data[0].ERRCODE), "", this.POPUP_ERROR_DELAY);
                        }
                        return false;
                    }


                    if (dso.type === "control") {
                        let rtnKeys = Object.keys(res.data[0]);
                        rtnKeys.forEach((q) => {
                            item[q] = res.data[0][q];
                        });
                    }
                    return true;
                } else {
                    this.showNotification("danger", this.$t("item_status_no_change"), "", this.POPUP_ERROR_DELAY);
                    return false;
                }
            } catch (e) {
                //console.log(e);
                this.showNotification("danger", e.message, "", this.POPUP_ERROR_DELAY);
                return false;
            }
        },



        handlingErrorMessage(val, title = "", acntStyle = "", notice = true) {

            const str = `ORA-20999: ORA-20999: [NOI_DNG_TEST]
            ORA-06512: at "WMS1.CW_PRO_CS70030_APPROVE_ALL", line 270
            `;

            var arr = [];
            var vall = val.toLowerCase();
            this.decodeMessage(arr, vall);

            if (arr.length > 0) {
                if (notice) {
                    this.showNotification(acntStyle ? "warning" : "danger", arr.join("  >>>  "), title, this.POPUP_ERROR_DELAY);
                }
                this._callProcedure("sys_upd_sys_user_msg_log", [arr.join("  >>>  "), val, this.$root._route.fullPath]);
            } else {
                if (notice) {
                    this.showNotification(acntStyle ? "warning" : "danger", val, title, this.POPUP_ERROR_DELAY);
                }
                this._callProcedure("sys_upd_sys_user_msg_log", [val, '', this.$root._route.fullPath]);
            }
        },
        decodeMessage(arr, val) {
            let seft = this;
            const regex = /[ORA|ora]-([\d]*):\s\[(.*)\]/gm; // /ora-([\d]*):\s\[(.*)\]$/gm; 
            var vall = val.toLowerCase().replace(/\n/gm, '');
            let m;
            while ((m = regex.exec(vall)) !== null) {
                // This is necessary to avoid infinite loops with zero-width matches
                if (m.index === regex.lastIndex) {
                    regex.lastIndex++;
                }

                // console.log(m[2]);
                // console.log(m.length);
                if (m.length == 3) {
                    if (!m[2].startsWith("ora-")) {
                        var strs = m[2].split(",");
                        strs.forEach((s) => {
                            arr[arr.length] = this.$t(s);
                        });
                    } else {
                        seft.decodeMessage(arr, m[2]);
                    }
                }
            }
        },
        // ==============LG=========================
        async _getCompanyByUser2(p_user_pk) {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc", {
                proc: "sys_get_company_by_user",
                para: [p_user_pk],
                _db2: this.SECOND_DB_YN
            });

            return res.data ? res.data : [];
        },
        async _getCommonCodePar(p_parent_code, p_val1 = '', p_val2 = '', p_val3 = '', p_tco_company_pk = '0') {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc", {
                proc: "sys_sel_common_code_par",
                para: [p_tco_company_pk, p_parent_code, p_val1, p_val2, p_val3],
                _db2: this.SECOND_DB_YN
            });

            return res.data ? res.data : [];
        },

        async _getItemGroupLG(p_user_pk = 0, p_pr_level = 6, p_leaf_yn = '', p_yn_string = '', p_group_type = '') {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc", {
                proc: "GSF20_LG_SYS_GET_GROUP_ITEM",
                para: [p_user_pk, p_pr_level, p_leaf_yn, p_yn_string, p_group_type],
                _db2: this.SECOND_DB_YN
            });
            return res.data ? res.data : [];
        },

        async _getWarehouseLG(p_tlg_in_storage_pk = '', p_user_pk = '', p_type = '', p_wh_type = '', p_tco_company_pk = '') {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc", {
                proc: "LG_SEL_COMPANY_WH_V3",
                para: [p_tlg_in_storage_pk, p_user_pk, p_type, p_wh_type, p_tco_company_pk],
                _db2: this.SECOND_DB_YN
            });
            return res.data ? res.data : [];
        },

        async _getWarehouseByGroup(p_tlg_wh_group_pk = '') {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc", {
                proc: "LG_SEL_WH_BY_GROUP",
                para: [p_tlg_wh_group_pk],
                _db2: this.SECOND_DB_YN
            });
            return res.data ? res.data : [];
        },
        async _FlowsSendArticle(_flowProjectId, _flowTitle, _flowContent, _flowFileName = "", _flowFileBase64String = "") {
            var flowsdata1 = {
                COLABO_SRNO: _flowProjectId, // project id
                COMMT_TTL: _flowTitle, // title
                CNTN: _flowContent, // content 
            };

            var flowsdata2 = {
                FILE_REC: [{
                    ORG_FILE_NM: _flowFileName,// file name
                    SAVE_FILE_NM: _flowFileBase64String // base64string
                }]
            };

            var flowsdata = flowsdata1;
            // console.log('[vng-154/dvg] > file: dso.js:1001 > _FlowsSendArticle > flowsdata', flowsdata);

            if (_flowFileName != "" && _flowFileBase64String != "") {
                // console.log('[vng-154/dvg] > file: dso.js:1004 > _FlowsSendArticle > _flowFileName', _flowFileName);
                flowsdata = { ...flowsdata1, ...flowsdata2 }
            }
            const rntFlows = await this.$axios.$post("flow/sendarticle", flowsdata);
            return rntFlows ? rntFlows : [];
        },
        // ==============LG=========================

        async _clearCache(notiYN = "Y") {
            try {
                const { success, data, message } = await this.$axios.$post("dso/clearcache");
                if (success) {
                    if (notiYN === "Y") {
                        this.showNotification("success", message, "");
                        return;
                    }
                    return;
                }
            } catch (error) {
                //console.log("catch exception-toggleNocache:", error.message)
            }
        },
        async _sendESign(_eSignInfo = { _groupkey: "", _doc_type: "", _orginal_pdf_base64: "", _sign_by_pk: "", _sign_seq: '', _description: "" }) {
            try {
                console.clear();
                // _eSignInfo ={
                //     _groupkey:'TAX'+busplace_info.TAX_CD+"TAC_HGTRH"+this.mstData.PK, 
                //     _doc_type:ESJS0010_ESIGN_TYPE, 
                //     _orginal_pdf_base64:_rtnBase64PDF, //blob{data:"abx",size 123mb} return file from report pdf excel,....
                //     _sign_by_pk:this.user.PK, 
                //     _sign_seq:'1',  
                //     _description:"Send From Slip Entry [TAX_CD-"+busplace_info.TAX_CD+"][TAC_HGTRH-"+this.mstData.PK+"]"
                //     _tco_company_pk: this.mstData.TCO_COMPANY_PK,
                //     _tco_busplace_pk: this.mstData.TCO_BUSPLACE_PK
                // }  
                let MSG = this.$t('pls_check_group_key_or_doc_type_or_parse_file_pdf_to_base64');
                let MSG_COLOR = "warning";
                if (_eSignInfo._groupkey != "" && _eSignInfo._doc_type != "" && _eSignInfo._orginal_pdf_base64 != "") {
                    /*==[CHK] Check _eSignInfo._orginal_pdf_base64 error or not yet==*/
                    const _result = _eSignInfo._orginal_pdf_base64;
                    if (_result.type) {
                        let _err_print = _result.type.split("/")[1].toLowerCase();
                        if (_result && _err_print == "xml" && _result.size == 0) {
                            this.showNotification(MSG_COLOR, this.$t("no_data_or_report_error"), 3000);
                            return;
                        }
                        if (_err_print == "json") {
                            MSG = "NO_DATA";
                            _result.text().then((res) => {
                                var _json_msg = JSON.parse(res); MSG = _json_msg["message"];
                                if (MSG == undefined) { MSG = "no_data_or_report_error"; }
                                this.showNotification(MSG_COLOR, this.$t(MSG), "", 5000);
                            });
                            return;
                        }
                    }
                    /*===[CVT] Convert blob to base64==================================*/
                    const _orginalPDFBase64 = await this._blobFileToBase64(_eSignInfo._orginal_pdf_base64);
                    if (!_orginalPDFBase64 || _orginalPDFBase64 == undefined) {
                        MSG = this.$t('can_not_convert_file_pdf_to_base64_pls_check');
                        return this.showNotification(MSG_COLOR, MSG, "", 5000);
                    }
                    this.showNotification("info", this.$t("begin_send_esign"), "", 500);
                    _eSignInfo._orginal_pdf_base64 = _orginalPDFBase64;
                    //console.log('[vng-154/dvg] > file: dso.js:1060 > _sendESign > _eSignInfo:', _eSignInfo);
                    let rtnSendESignStatus = await this.$axios.$post("dso/apiproclob", {
                        proc: "SYS_PRO_SEND_ESIGN",
                        para: [_eSignInfo._tco_company_pk, _eSignInfo._tco_busplace_pk, _eSignInfo._groupkey, _eSignInfo._doc_type, _eSignInfo._orginal_pdf_base64, _eSignInfo._sign_by_pk, _eSignInfo._sign_seq, _eSignInfo._description],
                        _db2: this.SECOND_DB_YN
                    });
                    //console.log('[vng-154/dvg] > file: dso.js:1066 > _sendESign > rtnSendESignStatus:', rtnSendESignStatus);
                    MSG_COLOR = "info";
                    MSG = this.$t(rtnSendESignStatus.data[0].STATUS + "");
                    let lCode = this.$t(rtnSendESignStatus.data[0].CODE + "");
                    //console.log("[_eSignInfo]",_eSignInfo)
                    return this.showNotification(MSG_COLOR, MSG, lCode, 5000);
                }
                //console.log('[_eSignInfo]', _eSignInfo);
                return this.showNotification(MSG_COLOR, MSG, "", 5000);
            } catch (e) {
                //console.log('[Error Code _sendESign/_eSignInfo]', _eSignInfo);
                //console.log("[Error Code _sendESign]:", e);
                MSG = this.$t('error_when_system_send_esign');
                MSG_COLOR = "warning";
                return this.showNotification(MSG_COLOR, MSG, "", 5000);
            }
        },
        async _getFrmSetting(_frmId, _type = "NAME", _tco_company_pk = '') {
            try {
                this._setSecondDBStstus();
                let rtnFromSetting = await this.$axios.$post("dso/callproc", {
                    proc: "SYS_SEL_FRM_SETTING_NC",
                    para: [_frmId, _type, _tco_company_pk],
                    _db2: this.SECOND_DB_YN
                });
                return rtnFromSetting.data ? rtnFromSetting.data : [];
            }
            catch (e) {
                return [];
            }
        },
        async _getInitProc(_crt_id, _listData = [], _defaultProc = '', _contenproc = '', _getcolnm = "PROCEDURE_NAME") {
            let procNM = _defaultProc;
            try {
                if (_listData && _listData.length > 0) {
                    const rtnFilter = _listData.filter((x) => x.CRT_ID == `${_crt_id}`);
                    if (rtnFilter && rtnFilter[0] && rtnFilter.length > 0) {
                        let _getData = rtnFilter[0];
                        if (_getData[`${_getcolnm}`] && _getData[`${_getcolnm}`] != undefined && _getData[`${_getcolnm}`] != '' && _getData[`${_getcolnm}`] != 'null') {
                            if (_contenproc == 'CONTENT') {
                                let rtnContentProc = await this.$axios.$post("dso/callproc", {
                                    proc: "SYS_SEL_CONTENT_PROC",
                                    para: [_defaultProc],
                                    _db2: this.SECOND_DB_YN
                                });
                                procNM = rtnContentProc;
                            }
                            return procNM = _getData[`${_getcolnm}`];
                        }
                    }
                }
                return procNM;
            }
            catch (e) {
                return procNM;
            }
        },
        async _getInitList(_crt_id, _listData = [], _defaultComm = '', _tco_company_pk = '', _getcolnm = "PROCEDURE_NAME") {
            let rtnData = [];
            try {
                if (_listData && _listData.length > 0) {
                    const rtnFilter = _listData.filter((x) => x.CRT_ID == `${_crt_id}`);
                    if (rtnFilter && rtnFilter[0] && rtnFilter.length > 0) {
                        let _getData = rtnFilter[0];
                        if (_getData[`${_getcolnm}`] && _getData[`${_getcolnm}`] != undefined && _getData[`${_getcolnm}`] != '' && _getData[`${_getcolnm}`] != 'null') {
                            let parentCode = _getData[`${_getcolnm}`];
                            let _rtnVal = []
                            switch (_getData.PROCEDURE_TYPE) {
                                case 'COMMCODE':
                                    _listData.forEach(e => {
                                        if (e.CRT_ID == `${_crt_id}` && e.TCO_COMPANY_PK == _tco_company_pk && _defaultComm == parentCode) {
                                            _rtnVal.push(e);
                                        }
                                    });
                                    rtnData = (_rtnVal && _rtnVal.length > 0) ? _rtnVal : [];
                                    break;
                                case 'COMMCODE_CLOUD':
                                    _listData.forEach(e => {
                                        if (e.CRT_ID == `${_crt_id}` && _defaultComm == parentCode) {
                                            _rtnVal.push(e);
                                        }
                                    });
                                    rtnData = (_rtnVal && _rtnVal.length > 0) ? _rtnVal : [];
                                    break;
                                default:
                                    rtnData = [];
                                    break;
                            }
                            // return rtnData;
                        }
                    }
                }
                if (rtnData && rtnData.length == 0 && _defaultComm != "") {
                    rtnData = await this._getCommonCode(`${_defaultComm}`, '');
                }
                return rtnData;
            }
            catch (e) {
                return rtnData;
            }
        },
        /*==[Call API Wabooks-ERP]=====================================*/
        async _callWaBooksErpAPI(reqData) {
            let rtnData = {};
            try {
                let dataPost = {
                    req_data: { ...reqData.req_data },
                    api_svc_id: (reqData.api_svc_id ? reqData.api_svc_id : ""),
                    svc_type: reqData.svc_type,
                    req_method: (reqData.req_method ? reqData.req_method : 'POST'),
                    wcookie: (reqData.wcookie ? reqData.wcookie : "")
                };
                if (dataPost.api_svc_id == "") {
                    return this.showNotification("warning", this.$t('can_not_found_api_svc_id'), "", 10000);
                }
                await this.$axios.$post("waerp/wserviceprocess", dataPost)
                    .then((res) => {
                        rtnData = { status: "200", message: "Finished Call API Wabooks - ERP InterFace Data", data: res.data }
                    });
            } catch (e) {
                //console.log('[ErrorCode_callWaBooksErpAPI:]', e);
                rtnData = { status: "500", message: "Failed Call API Wabooks - ERP InterFace Data", data: e }
            }
            return rtnData;
        },
        async _wcallWaErpCheckUserLogin(req={}) {
            let biz_key = { BIZ_KEY: "" }; let pEnv = {WAERP_USER_ID:"TEMP",WAERP_USER_PW:""} 
            try {
                let reqData = {
                    req_data: req.req_data?req.req_data:null,
                    api_svc_id: req.api_svc_id?req.api_svc_id:"WABOOKS_ERP_R001",
                    svc_type: "wSearchCompanyForlogin"
                }
                /*==[Call Check User Login - Get Biz Key]==*/
                const rtnData = await this._callWaBooksErpAPI(reqData);
                if (rtnData.status == "200" && rtnData.data) {
                    let p = rtnData.data;
                    if (p.RSLT_CD != "0000") {
                        this.showNotification("Warning", `RSLT_CD:${p.RSLT_CD}; RSLT_MSG:${this.$t(p.RSLT_MSG)}; TRANSACTION_ID: ${p.TRANSACTION_ID}`, "", 5000);
                        //console.log('[_wcallWaErpCheckUserLogin]', p)
                        return biz_key;
                    }
                    if (p.RSLT_CD == "0000") { 
                        /*==[return biz_key]==*/
                        biz_key.BIZ_KEY = p.RESP_DATA.REC[0].BIZ_KEY;
                        return biz_key;
                    }
                    return biz_key;
                }
                this.showNotification("warning", this.$t('call_wabooks_erp_api_failed'), "", 10000);
                return biz_key;
            } catch (e) {
                //console.log("[ErrorCode_wcallWaErpCheckUserLogin]:", e);
                this.showNotification("warning", this.$t('error_when_searching_user_for_login_api'), "", 10000);
                return biz_key;
            }
        },
        async _wcallWaErpLogin(req={}) {
            try {
                /*==[Call Login - Set Biz Key]==*/
                let reqData = {
                    req_data: {
                        biz_key: req.req_data.biz_key?req.req_data.biz_key:""
                    },
                    api_svc_id: req.api_svc_id?req.api_svc_id:"WABOOKS_ERP_R002",
                    svc_type: "wLogin"
                }
                const rtnData = await this._callWaBooksErpAPI(reqData);
                if (rtnData.status == "200" && rtnData.data) {
                    let p = rtnData.data;
                    if (p.RSLT_CD != "0000") {
                        this.showNotification("Warning", `RSLT_CD:${p.RSLT_CD}; RSLT_MSG:${this.$t(p.RSLT_MSG)}; TRANSACTION_ID: ${p.TRANSACTION_ID}`, "", 5000);
                        //console.log('[_wcallWaErpCheckUserLogin]', p)
                    }
                    return rtnData.data;
                }
                this.showNotification("warning", this.$t('call_wabooks_erp_api_failed'), "", 10000);
                return result = { RSLT_CD: "FAILED", BIZ_KEY: "", RSLT_MSG: "failed" };
            } catch (e) {
                //console.log("[ErrorCode_wcallWaErpCheckUserLogin]:", e);
                this.showNotification("warning", this.$t('error_when_login_wabooks_erp_api'), "", 10000);
                return result = { RSLT_CD: "ERROR_CATCH", BIZ_KEY: "", RSLT_MSG: "error_catch" };
            }
        },
        async _wcallWaErpService(req={}) {
            let reqData= {
                req_data: {
                    ...req.req_data
                },
                api_svc_id: req.api_svc_id?req.api_svc_id:"",
                svc_type: "wSVCProcess",
                wcookie: req.wcookie?req.wcookie:"tempcookie",
            }
            return await this._callWaBooksErpAPI(reqData);
        },
    },
}); 