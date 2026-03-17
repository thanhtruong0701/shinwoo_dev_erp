import Cookies from "js-cookie";

export default async ({ app, store, route, redirect }) => {
  try {
    // console.log("nuxtClientInit!");
    const token = Cookies.get("token");
    let languageFromCookies = Cookies.get("language");
    /* console.log("token:", token);
    console.log("languageFromCookies:", languageFromCookies) */
    // console.log("token:", token);
    // console.log("token:", token);
    if (token) {
      store.commit("auth/SET_TOKEN", token);
      await store.dispatch("auth/saveUserInfo");
      const user = store.getters["auth/user"];
      // console.log("user:", user)
      if (!user) {
        console.log("Pls check uid of token exist in db or not: "+token)
        if (route.name === "sso") {
          //do nothing
        } else {
          redirect("/login");
          // if (window.location.href.includes("/login")) {
          //   return;
          // } else {
          //   window.location.replace("/login");
          //   // window.location.href = "/login";
          // }
        }
        store.commit("auth/FETCH_USER_FAILURE");
      } else {
        store.commit("auth/FETCH_USER_SUCCESS", user);
        if (languageFromCookies) {
          store.commit("lang/SET_LANGUAGE", languageFromCookies);
        } else {
          languageFromCookies = user.USER_LANGUAGE ? user.USER_LANGUAGE : "ENG";
          store.commit("lang/SET_LANGUAGE", languageFromCookies);
        }
        store.dispatch("auth/loadColorTheme", user.USER_THEME).then((userTheme) => {
          if (userTheme && Object.keys(userTheme).length) {
            store.dispatch("auth/setColorTheme", { color: userTheme.color, textColor: userTheme.textColor });
            document.documentElement.style.setProperty("--primary-color", userTheme.primaryColor);
            document.documentElement.style.setProperty("--primary-color-start", userTheme.primaryColorStart);
            document.documentElement.style.setProperty("--primary-color-stop", userTheme.primaryColorStop);
            document.documentElement.style.setProperty("--primary-color-2", userTheme.primaryColor2);
            document.documentElement.style.setProperty("--primary-color-3", userTheme.primaryColor3);
            document.documentElement.style.setProperty("--grid-header-color", userTheme.gridHeaderColor);
          }
        });
        await store.dispatch("lang/getLanguages");
        await store.dispatch("lang/getLangMappingList");
        await store.dispatch("auth/getMenuList");
        await store.dispatch("auth/getFavMenu");
        await store.dispatch("auth/getCwCommonParam");
      }
    } else {
      if (route.name === "sso") {
        // do nothing
      } else {
        store.commit("auth/FETCH_USER_FAILURE");
        redirect("/login");
        // if (window.location.href.includes("/login")) {
        //   return;
        // } else {
        //   window.location.replace("/login");
        //   // window.location.href = "/login";
        // }
      }
    }
  } catch (error) {
    store.commit("auth/FETCH_USER_FAILURE");
    console.log("===> nuxtClientInit:", error.message);
    redirect("/login");
    // if (window.location.href.includes("/login")) {
    //   return;
    // } else {
    //   window.location.replace("/login");
    //   // window.location.href = "/login";
    // }
  }
};
