import Cookies from "js-cookie";

const langFromCookies = Cookies.get("language");

export const state = () => ({
  language: langFromCookies || "ENG",
  languages: [],
  langMappingList: [],
});

export const getters = {
  language: (state) => state.language,
  languages: (state) => state.languages,
  langMappingList: (state) => state.langMappingList,
};

export const mutations = {
  SET_LANGUAGES: (state, languages) => {
    state.languages = languages;
  },
  SET_LANG_MAPPING_LIST: (state, langMappingList) => {
    state.langMappingList = langMappingList;
  },
  SET_LANGUAGE: (state, language) => {
    state.language = language;
  },
};

export const actions = {
  async getLanguagesServer({ commit, state }, token) {
    let instance = this.$axios.create({
      baseURL: process.env.LOCAL_API_URL ? process.env.LOCAL_API_URL : process.env.API_URL,
    });
    instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    instance.defaults.headers.common["Accept-Language"] = state.language;

    const languages = await instance.$post("/dso/callproc", {
      proc: "SYS_SEL_LANGUAGE",
    });
    if (languages.data) {
      commit("SET_LANGUAGES", languages.data);
    }
  },
  async getLangMappingListServer({ commit, state }, token) {
    let instance = this.$axios.create({
      baseURL: process.env.LOCAL_API_URL ? process.env.LOCAL_API_URL : process.env.API_URL,
    });
    instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    instance.defaults.headers.common["Accept-Language"] = state.language;

    const result = await instance.$post("/dso/callproc", {
      proc: "SYS_SEL_LANGUAGE_MAPPING",
    });
    if (result.data) {
      commit("SET_LANG_MAPPING_LIST", result.data);
    }
  },
  async getLanguages({ commit }) {
    const languages = await this.$axios.$post("dso/callproc", {
      proc: "SYS_SEL_LANGUAGE",
    });
    if (languages.data) {
      commit("SET_LANGUAGES", languages.data);
    }
  },

  async getLangMappingList({ commit }) {
    const result = await this.$axios.$post("dso/callproc", {
      proc: "SYS_SEL_LANGUAGE_MAPPING",
    });
    if (result.data) {
      commit("SET_LANG_MAPPING_LIST", result.data);
    }
  },

  saveLanguage({ commit }, { language }) {
    if (language) {
      Cookies.set("language", language);
      commit("SET_LANGUAGE", language);

      this.app.i18n.locale = language;
    }
  },
};
