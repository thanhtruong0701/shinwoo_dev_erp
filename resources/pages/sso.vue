<template>
  <v-card>
    <v-dialog hide-overlay persistent width="300" content-class="no-padding" v-model="isLoading">
      <v-card dark color="primary">
        <v-card-text>
          {{$t("processing")}}
          <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
export default {
  layout: "login",

  head() {
    return {
      link: [
        {
          href:
            "https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900",
          rel: "stylesheet",
        },
      ],
    };
  },

  data: () => ({
    form: null,
    user_id: null,
    token: null,
    isLoading: false,
  }),

  created() {
    this.form = this.$route.query.form;
    this.token = this.$route.query.token;
    //console.log(this.token)
    this.checkLogIn();
  },

  methods: {
    async checkLogIn() {
      try {
        this.isLoading = true;
        const res = await this.$axios.$post("user/ssologin", {
          proc: "sys_sso_login_auth",
          para: [this.token],
        });
        if (res.success) {
          this.showNotification(
            "success",
            this.$t("login_successful"),
            ""
          );
          await this.$store.dispatch("auth/saveToken", {
            token: res.data.token,
          });
          await this.$store.dispatch("lang/getLanguages");
          await this.$store.dispatch("auth/saveUserInfo");
          await this.$store.dispatch("auth/getMenuList");
          if (this.$store.getters["auth/user"]) {
            this.isProcessing = false;
            this.$router.push("/?form=" + this.form);
          } else {
            this.showNotification(
              "danger",
              this.$t("fail_login"),
              this.$t(res.message)
            );
          }
        } else {
          this.showNotification("danger", this.$t("login_fail"), res.message);
        }
      } catch (e) {
        this.showNotification("danger", this.$t("login_fail"), e.message);
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
