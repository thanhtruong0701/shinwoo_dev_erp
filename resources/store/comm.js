export const state = () => ({
    user_companies: [],
    user_organizations: [],
    user_settings: { }, //salary security, ...
    workgroups: { }, //key is company pk -> details
    workshifts: { }, //key is company pk -> details
    commcodes:{ }, //key is company pk -> parent comm code -> details
    fields: { }, //key is company pk -> form id -> details
    reports: { }, //key is company pk -> form id -> details
    printpreview:false,
    printpreview2:false,
});

export const getters = {
    user_companies: (state) => state.user_companies,
    user_organizations: (state) => state.user_organizations,
    workgroups: (state) => state.workgroups,
    workshifts: (state) => state.workshifts,
    commcodes: (state) => state.commcodes,
    user_settings: (state) => state.user_settings,
    fields: (state) => state.fields,
    reports: (state) => state.reports,
    printpreview: (state) => state.printpreview,
    printpreview2: (state) => state.printpreview2
}

export const mutations = {
    SET_USER_COMPANIES(state, user_companies) {
        state.user_companies = user_companies;
    },
    SET_USER_ORGANIZATIONS(state, user_organizations) {
        state.user_organizations = user_organizations;
    },
    SET_USER_SETTINGS(state, user_settings) {
        let {key, value} = user_settings;
        state.user_settings[key] = value;
    },
    SET_WORKGROUPS(state, workgroup) {
        state.workgroups[workgroup.tco_company_pk] = workgroup.data;
    },
    SET_WORKSHIFTS(state, workshift) {
        state.workshifts[workshift.tco_company_pk] = workshift.data;
    },
    SET_COMMCODES(state, commcodes) {
        let {tco_company_pk, parent_code, data} = commcodes;
        if(parent_code.startsWith("HR")) { // tam thoi ap dung cho HR
            if(!state.commcodes[tco_company_pk]) {
                state.commcodes[tco_company_pk] = {};
            }
            state.commcodes[tco_company_pk][parent_code] = data;
        }   
    },
    SET_FIELDS(state, fields) {
        let {tco_company_pk, menu_id, data} = fields;
        if(!state.fields[tco_company_pk]) {
            state.fields[tco_company_pk] = {};
        }
        state.fields[tco_company_pk][menu_id] = data;
    },
    SET_REPORTS(state, reports) {
        let {tco_company_pk, menu_id, data} = reports;
        if(!state.reports[tco_company_pk]) {
            state.reports[tco_company_pk] = {};
        }
        state.reports[tco_company_pk][menu_id] = data;
    },
    SET_PRINT_PREVIEW(state, printpreview) {
        state.printpreview = printpreview == "Y" || printpreview == true;
    },
    SET_PRINT_PREVIEW2(state, printpreview) {
        state.printpreview2 = printpreview == "Y" || printpreview == true;
    },
    RESET_COMMONS(state) {
        state.user_companies = [];
        state.user_organizations = [];
        state.user_settings = {};
        state.workgroups = {};
        state.workshifts = {};
        state.commcodes = {};
        state.fields = {};
        state.reports = {};
    },

    DELETE_COMMONS(state, comm) {
        let { name, key, tco_company_pk }  = comm;
        switch(name) {
            case "user_companies":
                state.user_companies = [];
                break;
            case "user_organizations":
                state.user_organizations = [];
                break;
            case "user_settings":
                delete state.user_settings[key];
                break;
            case "workgroups":
                delete state.workgroups[tco_company_pk];
                break;
            case "workshifts":
                delete state.workshifts[tco_company_pk];
                break;
            case "commcodes":
                if(state.commcodes[tco_company_pk]) {
                    delete state.commcodes[tco_company_pk][key]; //key = parent code
                }
                
                break;
            case "fields":
                /* fields ko thiet ke theo cty nen thoi clear het
                if(state.fields[tco_company_pk]) {
                    delete state.fields[tco_company_pk][key]; //key = menu id
                }*/
                state.fields = {};
                break;
            case "reports":
                if(state.reports[tco_company_pk]) {
                    delete state.reports[tco_company_pk][key]; //key = menu id
                }
                break;
        }
    }
}

export const actions = {
    /*==========================================================================
    GET STORED DATA
    ==========================================================================*/
    async getUserCommons() {
        this.dispatch("comm/getUserCompanies");
        this.dispatch("comm/getUserOrganizations");
    },

    async clearUserCommons({ commit }) {
        commit("RESET_COMMONS");
    },

    async getUserCompanies({ commit }) {
        let user = this.getters["auth/user"];
        if (user) {
            let { data } = await this.$axios.$post("dso/callproc", { proc: "sys_sel_list_company", para: [user.PK], });
            if(data?.length > 0) {
                commit("SET_USER_COMPANIES", data);
            }
        }
    },

    async getUserOrganizations({ commit }) {
        let user = this.getters["auth/user"];
        if (user) {
            let { data } = await this.$axios.$post("dso/callproc", { proc: "sys_sel_list_org_user", para: [user.PK], });
            if(data?.length > 0) {
                commit("SET_USER_ORGANIZATIONS", data);
            }
        }
    },

    /*==========================================================================
    SET STORED DATA
    ==========================================================================*/
    setUserCompanies({ commit }, companies) {
        commit("SET_USER_COMPANIES", companies);
    },

    setUserOrganizations({ commit }, organizations) {
        try {
            commit("SET_USER_ORGANIZATIONS", organizations);
        } catch(e) {
            console.log("SET_USER_ORGANIZATIONS", e);
        }
        
    },

    setUserSettings({ commit }, settings) {
        try {
            commit("SET_USER_SETTINGS", settings);
        } catch(e) {
            console.log("SET_USER_SETTINGS", e);
        }
    },

    setWorkgroups({ commit }, workgroup) {
        try {
            commit("SET_WORKGROUPS", workgroup);
        } catch(e) {
            console.log("SET_WORKGROUPS", e);
        }
    },

    setWorkshifts({ commit }, workshift) {
        try {
            commit("SET_WORKSHIFTS", workshift);
        } catch(e) {
            console.log("SET_WORKSHIFTS", e);
        }
    },

    setCommcodes({ commit }, commcode) {
        try {
            commit("SET_COMMCODES", commcode);
        } catch(e) {
            console.log("SET_COMMCODES", e);
        }
    },

    setFields({ commit }, fields) {
        try {
            commit("SET_FIELDS", fields);
        } catch(e) {
            console.log("SET_FIELDS", e);
        }
    },

    setReports({ commit }, reports) {
        try {
            commit("SET_REPORTS", reports);
        } catch(e) {
            console.log("SET_REPORTS", e);
        }
    },

    setPrintPreview({ commit }, printpreview) {
        commit("SET_PRINT_PREVIEW", printpreview);
    },

    setFunctionPreview({ commit }, printpreview) {
        commit("SET_PRINT_PREVIEW2", printpreview);
    },

    deleteCommons({ commit }, comm) {
        commit("DELETE_COMMONS", comm);
    }
}