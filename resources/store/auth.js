"use strict";
import Cookies from "js-cookie";
import listToTree from "list-to-tree-lite";
const langFromCookies = Cookies.get("language");

export const state = () => ({
  language: langFromCookies || "ENG",
  token: null,
  user: null,
  colorTheme: "rgba(0, 96, 190, 1)", // "rgba(55, 88, 117, 1)",
  textColorTheme: "white--text",
  darkTheme: false,
  flatMenuList: [],
  menuList: [],
  logs: [],
  activeForm2: null,
  secondDBMenu: [],
  /* btnThemeStyle: {
    isIcon: false,
    isDepressed: true,
    isOutlined: false,
    isRounded: false,
    isShaped: false,
    isText: false,
    isTile: false,
  }, */
  cwCommonParam: [],
  menuDrawerWidth: 0,
  favoriteMenu: [],
  windowHeight: 0,
  windowWidth: 0,
  formContainerHeight: 0,
  componentKey: 1,
});

export const getters = {
  token: (state) => state.token,
  user: (state) => state.user,
  colorTheme: (state) => state.colorTheme,
  textColorTheme: (state) => state.textColorTheme,
  darkTheme: (state) => state.darkTheme,
  menuList: (state) => state.menuList,
  flatMenuList: (state) => state.flatMenuList,
  logs: (state) => state.logs,
  dbType: (state) => state.dbType,
  activeForm2: (state) => state.activeForm2,
  cwCommonParam: (state) => state.cwCommonParam,
  menuDrawerWidth: (state) => state.menuDrawerWidth,
  secondDBMenu: (state) => state.secondDBMenu,
  favoriteMenu: (state) => state.favoriteMenu,
  windowHeight: (state) => state.windowHeight,
  windowWidth: (state) => state.windowWidth,
  formContainerHeight: (state) => state.formContainerHeight,
  componentKey: (state) => state.componentKey,
};

export const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  FETCH_USER_SUCCESS: (state, user) => {
    state.user = user;
  },
  FETCH_USER_FAILURE: (state) => {
    (state.token = null), (state.user = null);
  },
  UPDATE_USER: (state, user) => {
    state.user = user;
  },
  SET_COLOR_THEME: (state, color) => {
    state.colorTheme = color;
  },
  SET_TEXT_COLOR: (state, textColor) => {
    state.textColorTheme = textColor;
  },
  SET_DARK_THEME: (state, isDark) => {
    state.darkTheme = isDark;
  },
  FETCH_MENU_LIST_SUCCESS: (state, menuList) => {
    state.menuList = menuList;
  },
  FETCH_MENU_LIST_FAILURE: (state) => {
    state.menuList = [];
  },
  FETCH_FLAT_MENU_LIST_SUCCESS: (state, flatMenuList) => {
    state.flatMenuList = flatMenuList;
  },
  FETCH_FLAT_MENU_LIST_FAILURE: (state) => {
    state.flatMenuList = [];
  },
  WRITE_LOGS: (state, logs) => {
    state.logs = logs;
  },
  CLEAR_LOGS: (state) => {
    state.logs = [];
  },
  FETCH_DB_TYPE_SUCCESS: (state, dbType) => {
    state.dbType = dbType;
  },
  FETCH_ACTIVE_FORM: (state, activeForm) => {
    state.activeForm2 = activeForm;
  },
  FETCH_CW_COMMON_PARAM_SUCCESS: (state, csCommCode) => {
    state.cwCommonParam = csCommCode;
  },
  FETCH_CW_COMMON_PARAM_FAILED: (state) => {
    state.cwCommonParam = [];
  },
  FETCH_MENU_DRAWER_WIDTH_SUCCESS: (state, width) => {
    state.menuDrawerWidth = width;
  },
  FETCH_SECOND_DB_MENU_SUCCESS: (state, secondDBMenu) => {
    state.secondDBMenu = secondDBMenu;
  },
  FETCH_FAV_MENU_SUCCESS: (state, favoriteMenu) => {
    state.favoriteMenu = favoriteMenu;
  },
  FETCH_FAV_MENU_FAILED: (state) => {
    state.favoriteMenu = [];
  },
  UPDATE_WINDOW_HEIGHT: (state, height) => {
    state.windowHeight = height;
  },
  UPDATE_WINDOW_WIDTH: (state, width) => {
    state.windowWidth = width;
  },
  UPDATE_FORM_CONTAINER_HEIGHT: (state, height) => {
    state.formContainerHeight = height;
  },
  UPDATE_COMPONENT_KEY: (state, key) => {
    state.componentKey = key;
  },
};

export const actions = {
  saveToken({ commit }, { token, remember }) {
    var inHalfADay = 0.5;
    var in30Minutes = 1 / 48;
    var inFifteenMinutes = new Date(new Date().getTime() + 15 * 60 * 1000);
    var inOneMinute = new Date(new Date().getTime() + 1 * 60 * 1000);
    commit("SET_TOKEN", token);
    Cookies.set("token", token, { expires: inHalfADay });
  },

  async getUserInfoServer({ state }) {
    try {
      let instance = this.$axios.create({
        baseURL: process.env.LOCAL_API_URL ? process.env.LOCAL_API_URL : process.env.API_URL,
      });

      instance.defaults.headers.common["Authorization"] = `Bearer ${state.token}`;
      instance.defaults.headers.common["Accept-Language"] = state.language;
      const user = await instance.$get("/user/getuser");
      // console.log(user)
      return user;
    } catch (e) {
      return false;
    }
  },

  async getMenuListServer({ commit, state }, language) {
    let dataTemp, messageTemp;
    try {
      let instance = this.$axios.create({
        baseURL: process.env.LOCAL_API_URL ? process.env.LOCAL_API_URL : process.env.API_URL,
      });
      instance.defaults.headers.common["Authorization"] = `Bearer ${state.token}`;
      instance.defaults.headers.common["Accept-Language"] = language;
      let { data, message } = await instance.$post("/dso/callproc", {
        proc: "SYS_SEL_USER_MENU",
        para: [state.user.PK],
      });
      dataTemp = data;
      messageTemp = message;
      if (data && data.length) {
        const secondDBMenu = data.filter((x) => x.SECOND_DB_YN === "Y");
        commit("FETCH_SECOND_DB_MENU_SUCCESS", secondDBMenu);
        const menuList = listToTree(data, {
          idKey: "PK",
          parentKey: "P_PK",
          childrenKey: "childMenu",
        });
        commit("FETCH_FLAT_MENU_LIST_SUCCESS", data);
        commit("FETCH_MENU_LIST_SUCCESS", menuList);
      } else {
        //console.log("get menu error-data:", data);
        //console.log("get menu error-message: ", message);
        commit("FETCH_FLAT_MENU_LIST_FAILURE");
        commit("FETCH_MENU_LIST_FAILURE");
      }
    } catch (error) {
      //console.log("dataTemp:", dataTemp);
      //console.log("messageTemp:", messageTemp);
      console.error("getMenuListServer-catch exception:", error.message);
    }
  },

  async saveUserInfo({ commit }) {
    const user = await this.$axios.$get("/user/getuser");
    if (!user) {
      Cookies.remove("token");
      commit("FETCH_USER_FAILURE");
    } else {
      commit("FETCH_USER_SUCCESS", user);
    }
  },

  logout({ commit }) {
    Cookies.remove("token");
    Cookies.remove("language");
    commit("FETCH_USER_FAILURE");
    commit("CLEAR_LOGS");
  },

  setColorTheme({ commit }, { color, textColor }) {
    commit("SET_COLOR_THEME", color);
    commit("SET_TEXT_COLOR", textColor);
  },

  setDarkTheme({ commit }, isDark) {
    commit("SET_DARK_THEME", isDark);
  },

  saveColorTheme({ commit }, theme) {
    try {
      Cookies.remove("user-theme");
      Cookies.set("user-theme", theme);
    } catch (error) {
      //console.log("saveColorTheme error:", error.message);
      return false;
    }
  },

  loadColorTheme({ commit }, userTheme) {
    try {
      const userThemeFromCookies = Cookies.get("user-theme");
      if (userThemeFromCookies) {
        return JSON.parse(userThemeFromCookies);
      } else {
        return userTheme ? JSON.parse(userTheme) : null;
      }
    } catch (error) {
      //console.log("loadColorTheme error:", error.message);
      return null;
    }
  },

  async getMenuList({ commit, state }) {
    let dataTemp, messageTemp;
    try {
      let { data, message } = await this.$axios.$post("dso/callproc", {
        proc: "SYS_SEL_USER_MENU",
        para: [state.user.PK],
      });
      dataTemp = data;
      messageTemp = message;
      if (data && data.length) {
        const secondDBMenu = data.filter((x) => x.SECOND_DB_YN === "Y");
        commit("FETCH_SECOND_DB_MENU_SUCCESS", secondDBMenu);
        const menuList = listToTree(data, {
          idKey: "PK",
          parentKey: "P_PK",
          childrenKey: "childMenu",
        });
        commit("FETCH_FLAT_MENU_LIST_SUCCESS", data);
        commit("FETCH_MENU_LIST_SUCCESS", menuList);
      } else {
        //console.log("get menu error-data:", data);
        //console.log("get menu error-message: ", message);
        commit("FETCH_FLAT_MENU_LIST_FAILURE");
        commit("FETCH_MENU_LIST_FAILURE");
      }
    } catch (error) {
      //console.log("dataTemp:", dataTemp);
      //console.log("messageTemp:", messageTemp);
      console.error("getMenuListServer-catch exception:", error.message);
    }
  },

  writeLog({ commit, state }, log) {
    var logArr = [];
    var limitArray = [];
    if (state.logs.length) {
      logArr = [...state.logs];
    }
    logArr.unshift(log);
    if (logArr.length > 15) {
      limitArray = logArr.slice(0, 15);
      commit("WRITE_LOGS", limitArray);
    } else {
      commit("WRITE_LOGS", logArr);
    }
  },

  setActiveForm({ commit, state }, formURL) {
    const menuCode = formURL && formURL.split("/").pop() ? formURL.split("/").pop().toUpperCase() : "";

    let _findMenu = (menus, formURL) => {
      for (let item of menus) {
        if (item.FORM_URL === formURL) return item;
        if (item.childMenu) {
            let result = _findMenu(item.childMenu, formURL);
            if (result) return result;
        }
      }
      return null; // Trả về null nếu không tìm thấy
    };

    try {
      let selectedMenu = _findMenu(state.menuList, formURL);
      this.dispatch("comm/setPrintPreview", selectedMenu.PRINT_PREVIEW_YN);
    } catch {}

    commit("FETCH_ACTIVE_FORM", menuCode);
  },

  async getCwCommonParam({ commit, state }) {
    let { data, message } = await this.$axios.$post("/dso/callproc", {
      proc: "CW_SEL_COMMON_PARAM",
      para: [state.user.PK],
    });
    if (data && data.length) {
      commit("FETCH_CW_COMMON_PARAM_SUCCESS", data[0]);
    } else {
      //console.log("getCwCommonParam: " + message);
      commit("FETCH_CW_COMMON_PARAM_FAILED");
    }
  },

  async getCwCommonParamServer({ commit, state }) {
    let instance = this.$axios.create({
      baseURL: process.env.LOCAL_API_URL ? process.env.LOCAL_API_URL : process.env.API_URL,
    });
    instance.defaults.headers.common["Authorization"] = `Bearer ${state.token}`;
    instance.defaults.headers.common["Accept-Language"] = language;
    let { data, message } = await instance.$post("/dso/callproc", {
      proc: "CW_SEL_COMMON_PARAM",
      para: [state.user.PK],
    });
    if (data && data.length) {
      commit("FETCH_CW_COMMON_PARAM_SUCCESS", data[0]);
    } else {
      //console.log("getCwCommonParam: " + message);
      commit("FETCH_CW_COMMON_PARAM_FAILED");
    }
  },

  updateMenuDrawerWidth({ commit }, width) {
    commit("FETCH_MENU_DRAWER_WIDTH_SUCCESS", width);
  },

  async getFavMenu({ commit, state }) {
    const { data, message } = await this.$axios.$post("dso/callproc", {
      proc: "SYS_SEL_USER_FAV_MENU",
      para: [state.user.PK],
    });
    if (data && data.length) {
      commit("FETCH_FAV_MENU_SUCCESS", data);
    } else {
      //console.log(`getFavMenus error: ${message}`);
      commit("FETCH_FAV_MENU_FAILED");
    }
  },

  updateWindowHeight({ commit }, height) {
    commit("UPDATE_WINDOW_HEIGHT", height);
  },

  updateWindowWidth({ commit }, width) {
    commit("UPDATE_WINDOW_WIDTH", width);
  },

  updateFormContainerHeight({ commit }, height) {
    commit("UPDATE_FORM_CONTAINER_HEIGHT", height);
  },

  updateComponentKey({ commit }, key) {
    commit("UPDATE_COMPONENT_KEY", key);
  },
};
