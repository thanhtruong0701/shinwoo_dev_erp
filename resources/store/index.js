export const actions = {
  async nuxtServerInit({ dispatch, commit }, { req, redirect, route, env }) {
    try {
      const token = cookieFromReq("token", req.headers.cookie);
      if (token) {
        commit("auth/SET_TOKEN", token);
        const user = await dispatch("auth/getUserInfoServer");
        if (!user) {
          commit("auth/FETCH_USER_FAILURE");
          if (route.name === "sso") {
            //do nothing
          } else {
            redirect("/login");
          }
        } else {
          commit("auth/FETCH_USER_SUCCESS", user);
          let languageFromCookies = cookieFromReq("language", req.headers.cookie);
          if (languageFromCookies) {
            commit("lang/SET_LANGUAGE", languageFromCookies);
          } else {
            languageFromCookies = user.USER_LANGUAGE ? user.USER_LANGUAGE : "ENG";
            commit("lang/SET_LANGUAGE", languageFromCookies);
          }
          await dispatch("lang/getLanguagesServer", token);
          await dispatch("lang/getLangMappingListServer", token);
          await dispatch("auth/getMenuListServer", languageFromCookies);
          await dispatch("auth/getFavMenu");
          await dispatch("auth/getCwCommonParamServer");
        }
      } else {
        commit("auth/FETCH_USER_FAILURE");
        if (route.name === "sso") {
          //do nothing
        } else {
          redirect("/login");
        }
      }
    } catch (error) {
      //console.log('===> nuxtServerInit ', error);
      redirect("/login");
    }
  },
};

export function cookieFromReq(cookieName = "", CookieString = "") {
  if (!CookieString) {
    return "";
  }
  const cookie = CookieString.split(";").find((c) => c.trim().startsWith(`${cookieName}=`));
  if (cookie) {
    return cookie.split("=")[1];
  }
}
