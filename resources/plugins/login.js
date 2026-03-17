export default {
  data: () => ({
    formIsValid: undefined,
    userName: "",
    password: "",
    showPassword: false,
    inputRule: [(v) => !!v || "Please fill in this field!"],
    isProcessing: false,
    copyRightText: "Copyright (c) 2020, Webcash Vietnam. All rights Reserved.",
    copyRightText2: "Design by Webcash Vietnam."
  }),

  created() {
    if (this.$store.getters["auth/user"]) {
      this.$router.push("/");
    }
  },

  methods: {
    async checkLogIn() {
      if (this.$refs.logInForm.validate()) {
        this.formIsValid = true;
        try {
          this.isProcessing = true;
          const res = await this.$axios.$post("user/login", { user_id: this.userName, password: this.password });
          if (res.data) {
            this.showNotification("success", "Log In Successfully!", "");
            await this.$store.dispatch("auth/saveToken", { token: res.data.token });
            if(res.data.user?.TWO_FACTOR_AUTH_YN === "N" || res.data.user?.TWO_FACTOR_AUTH_YN === undefined || res.data.user?.TWO_FACTOR_AUTH_YN === null) {            
              await this.$store.dispatch("auth/saveUserInfo");
              if (this.$store.getters["auth/user"]) {
                this.$store.dispatch("lang/saveLanguage", { language: this.$store.getters["auth/user"].USER_LANGUAGE })
                this.$store.dispatch("auth/loadColorTheme", this.$store.getters["auth/user"].USER_THEME).then((userTheme) => {
                  if(userTheme && Object.keys(userTheme).length) {
                    this.$store.dispatch("auth/setColorTheme", { color: userTheme.color, textColor: userTheme.textColor });
                    document.documentElement.style.setProperty("--primary-color", userTheme.primaryColor);
                    document.documentElement.style.setProperty("--primary-color-start", userTheme.primaryColorStart);
                    document.documentElement.style.setProperty("--primary-color-stop", userTheme.primaryColorStop);
                    document.documentElement.style.setProperty("--primary-color-2", userTheme.primaryColor2);
                    document.documentElement.style.setProperty("--primary-color-3", userTheme.primaryColor3);
                    document.documentElement.style.setProperty("--grid-header-color", userTheme.gridHeaderColor);
                  }
                })
                await this.$store.dispatch("lang/getLanguages");
                await this.$store.dispatch("lang/getLangMappingList");
                await this.$store.dispatch("auth/getMenuList");
                await this.$store.dispatch("auth/getFavMenu");
                await this.$store.dispatch("auth/getCwCommonParam");

                this.$store.dispatch("comm/getUserCommons");
                this.$store.dispatch("dictionary/switchDictionary");
                this.isProcessing = false;
                this.$router.push("/");
              }
            } else {
              this.$router.push("/2fa");
            }            
          } else {
            this.isProcessing = false;
            this.showNotification("danger", "Log In Failed!", res.message);
          }
        } catch (e) {
          this.isProcessing = false;
          this.showNotification("danger", "Error Occurs!", e.message);
        }
      } else {        
        this.formIsValid = false;
      }
    }
  }
};