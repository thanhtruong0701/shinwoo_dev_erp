<template>
  <v-sheet class="primary-radial-gradient fill-height">
    <v-container class="fill-height" v-resize="onResize">
      <v-row align="center" justify="center">
        <v-col cols="12">
          <v-card flat color="mx-auto" elevation="24" :disabled="isProcessing" :loading="isProcessing" :width="breakpoint.isDesktop ? Math.floor(windowWidth/2) : 'auto'">
            <v-alert
              dark
              prominent
              tile
              border="left"
              class="text-center"
              icon="mdi-two-factor-authentication"
              :color="currentTheme"            
            >
              <span class="text-h5 text-uppercase font-weight-bold">Two Factor Authentication</span>
            </v-alert>
            <v-container>
              <v-row dense align="center" justify="space-between">        
                <v-col lg="6" cols="12">
                  <v-img contain :src="qrCode" :width="Math.floor(windowWidth/4)" :height="Math.floor(windowHeight/4)"></v-img>
                </v-col>
                <v-col lg="6" cols="12">
                  <v-alert prominent border="left" type="info" v-if="qrCode">
                    <div>
                      Please use <code>Google Authenticator</code> or <code>Authy</code> application to scan this QR Code and fill the OTP you receive to the text field below.
                    </div>
                  </v-alert>
                </v-col>
                <v-col cols="12">
                  <v-text-field outlined dense validate-on-blur label="OTP" :color="currentTheme" :rules="validationRule.nameRules" v-model="otpInput" @keypress.enter="submit"></v-text-field>
                </v-col>        
              </v-row>
            </v-container>
            <v-card-actions>
              <v-btn block dark depressed :color="currentTheme" :disabled="isProcessing" :loading="isProcessing" @click="submit">Submit</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-sheet>  
</template>

<script>
export default {
  layout: "login", 

  async asyncData({ app }) {
    const { data } = await app.$axios.$post("/user/get2fakey");
    return {
      qrCode: data ? data.qrCodeImage : ""
    }
  },

  data:()=>({
    otpInput: ""
  }),

  methods: {
    async submit() {
      try {
        if(!this.otpInput) {
          this.showNotification("danger", "Please fill in your OTP!", "");
          return;
        }
        const { success, data, message } = await this.$axios.$post("/user/verify2fa", { otpToken: this.otpInput });
        if(success && data) {
          this.showNotification("success", "Verify Two Factor Authentication Successfully!", "");
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
            this.isProcessing = false;
            this.$router.push("/");
          }
        } else {
          this.showNotification("danger", message, "");
          return;
        }
      } catch (e) {
        this.showNotification("danger", e.message, "")        
      }
    }
  }
}
</script>