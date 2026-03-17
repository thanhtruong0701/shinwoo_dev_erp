export const state = () => ({
    dictionary:{},
    dictionaryFormList: [],
    dictionaryCurrently:null,
    dictionaryUpdating:false,
});

export const getters = {
    
    dictionaryCurrently: (state) => state.dictionaryCurrently,
    dictionaryUpdating: (state) => state.dictionaryUpdating
}

export const mutations = {
    SET_DICTIONARY_CURRENTLY(state, form_id) {
        state.dictionaryCurrently = form_id;
    },

    SET_DICTIONARY_UPDATING(state, isUpdating) {
        state.dictionaryUpdating = isUpdating;
    },

    SET_DICTIONARY(state, dictionary) {
        let {lang, form_id, datas} = dictionary;

        state.dictionary[lang] = state.dictionary[lang] || {};

        if(!state.dictionary[lang][form_id]) {
            state.dictionary[lang][form_id] = {};
        }
        state.dictionary[lang][form_id] = datas;
    },

    SET_DICTIONARY_FORM_LIST(state, form_id) {
        if( form_id && !state.dictionaryFormList.includes(form_id)) {
            state.dictionaryFormList.push(form_id);
        }
    },

    RESET_DICTIONARY(state) {
        state.dictionary = {};
    }
}

export const actions = {
    resetDictionary({ commit }) {
        commit("RESET_DICTIONARY");
        this.dispatch("dictionary/switchDictionary");
    },

    async getDictionary({ commit, state }, form_id) {
        let _currLang = this.getters["lang/language"];
        let datas = state.dictionary[_currLang]?.[form_id] || {};

        if(datas == null || datas == undefined || Object.keys(datas).length == 0 ) {
            let { data } = await this.$axios.$post("dso/callproc", { proc: "SYS_SEL_DICTIONARY2", para: [form_id??"COMMON"], });
            if(data && data.length > 0){
                data = data?.filter(q => !( q.ID == q.MESSAGE) ) ||{};
                data = data?.reduce((obj, item) => Object.assign(obj, { [item.ID]: item.MESSAGE }), {});
            } else {
							data = {};
						}

            if(form_id == "COMMON") { 
                let _locale = form_id+"_"+_currLang;
                this.app.i18n.setLocaleMessage(_locale, data);
            }

            commit("SET_DICTIONARY_FORM_LIST", form_id);
            commit("SET_DICTIONARY", {lang:_currLang, form_id, datas: data});
        }
    },

    async updateDictionary({ commit, state }, form_id) {
        commit("SET_DICTIONARY_UPDATING", true);
        setTimeout(async () => {
            commit("SET_DICTIONARY_CURRENTLY", form_id);
            try {
                let _currLang = this.getters["lang/language"];
                let datas = state.dictionary[_currLang]?.[form_id] || {};
                if(datas == null || datas == undefined || Object.keys(datas).length == 0 ) {
                    await this.dispatch("dictionary/getDictionary", form_id);
                    if(form_id != "COMMON") { 
                        datas = state.dictionary[_currLang]?.[form_id] || {};
                        this.app.i18n.setLocaleMessage(_currLang, datas);
                    }
                } else { 
                    let _i18n_message = this.app.i18n.getLocaleMessage(_currLang) || {};
                    let _isEmpty = _i18n_message == null || _i18n_message == undefined || Object.keys(_i18n_message).length == 0;
                    
                    if(_isEmpty) { //set lần đầu
                        this.app.i18n.setLocaleMessage(_currLang, datas);
                    } else { // merge data
                        let _keys = Object.keys(datas);

                        Object.keys(_i18n_message).forEach(key => {
                            if(!_keys.includes(key))  _i18n_message[key] = undefined;
                        });

                        _keys.forEach(key => { _i18n_message[key] = datas[key]; });
                        
                        this.app.i18n.mergeLocaleMessage(_currLang, _i18n_message);
                    }
                }
            } finally{
                commit("SET_DICTIONARY_UPDATING", false); 
            }
        }, 50);
    },

    async switchDictionary({ commit, state }) {
        // commit("SET_DICTIONARY_UPDATING", true);

        let _currLang = this.getters["lang/language"];
        let _fallbacklocale = "COMMON_"+_currLang;

        if( _fallbacklocale != this.app.i18n.fallbackLocale)  {
            this.app.i18n.fallbackLocale = _fallbacklocale;
        }

        try {
            state.dictionaryFormList.forEach(async (_form_id) => {
                await this.dispatch("dictionary/getDictionary", _form_id);
            });

            await this.dispatch("dictionary/updateDictionary", state.dictionaryCurrently);
            this.app.i18n.locale = _currLang;
        } catch (e){ console.log(e) }

        // setTimeout(() => {
        //     commit("SET_DICTIONARY_UPDATING", false); 
        // }, 50);
    },

    async refreshDictionary({ commit, state }) {
        
    }
}