<template>
  <v-dialog id="personal-info-dialog" :max-width="maxWidth" v-model="personalInfoDialog" v-resize="onResize">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ $t("personal_info", "common") }}</span>
        <v-spacer></v-spacer>
        <v-icon dark @click="personalInfoDialog = false">mdi-close-thick</v-icon>
      </v-card-title>
      <v-container fluid class="pa-0">
        <v-row no-gutters>
          <v-col cols="12">
            <v-tabs dark grow hide-slider icons-and-text background-color="primaryBg">
              <v-tab>
                {{ $t("personal_info") }} <v-icon>mdi-account-edit</v-icon>
              </v-tab>
              <v-tab>
                {{ $t("password") }} <v-icon>mdi-shield-key</v-icon>
              </v-tab>
              <v-tab>
                {{ $t("two_factor_authentication") }} <v-icon>mdi-two-factor-authentication</v-icon>
              </v-tab>              
              <!-- Update Personal Info -->
              <v-tab-item>
                <v-card flat>
                  <v-form lazy-validation ref="personalInfoForm" v-model="personalInfoFormIsValid">
                    <v-container>
                      <v-row dense align="center" justify="center">
                        <v-col cols="12">
                          <v-text-field dense disabled outlined :color="currentTheme" :label="$t('user_id')" v-model="userData.USER_ID"></v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-text-field dense clearable outlined validate-on-blur :color="currentTheme" :label="$t('user_name')" :rules="validationRule.nameRules" v-model="userData.USER_NAME"></v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-select cache-items clearable dense outlined validate-on-blur item-value="CODE" item-text="NAME" :color="currentTheme" :items="_languages" :label="$t('user_language')" :rules="validationRule.selectRules" v-model="userData.USER_LANGUAGE"></v-select>
                        </v-col> 
                        <v-col cols="12">
                          <v-btn block dark depressed :color="currentTheme" :disabled="isProcessing" :loading="isProcessing" @click="updateInfo">{{ $t('update') }}</v-btn>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-form>
                </v-card>
              </v-tab-item>
              <!-- Update Password -->
              <v-tab-item>
                <v-card flat>
                  <v-form lazy-validation ref="passwordForm" v-model="passwordFormIsValid">
                    <v-container>
                      <v-row dense align="center" justify="center">
                        <v-col cols="12">
                          <v-text-field clearable dense outlined validate-on-blur :color="currentTheme"
                            :append-icon="showOldPassword ? 'mdi-eye' : 'mdi-eye-off'" :label="$t('old_password')" 
                            :rules="[validationRule.passwordRules.required]" :type="showOldPassword ? 'text' : 'password'" 
                            @click:append="showOldPassword = !showOldPassword" v-model="oldPassword">
                          </v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-text-field clearable dense outlined validate-on-blur :color="currentTheme"
                            :append-icon="showNewPassword ? 'mdi-eye' : 'mdi-eye-off'" :label="$t('new_password')" 
                            :rules="[validationRule.passwordRules.required]" :type="showNewPassword ? 'text' : 'password'" 
                            @click:append="showNewPassword = !showNewPassword" v-model="newPassword">
                          </v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-text-field clearable dense outlined validate-on-blur :color="currentTheme"
                            :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'" :label="$t('confirm_password')" 
                            :rules="[validationRule.passwordRules.required, passwordConfirmationRule]" :type="showConfirmPassword ? 'text' : 'password'" 
                            @click:append="showConfirmPassword = !showConfirmPassword" v-model="confirmPassword">
                          </v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-btn block dark depressed :color="currentTheme" :disabled="isProcessing" :loading="isProcessing" @click="updatePassword">{{ $t('update') }}</v-btn>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-form>
                </v-card>
              </v-tab-item>
              <!-- Two Factor Authentication -->
              <v-tab-item>
                <v-card flat>
                  <v-form lazy-validation ref="twoFactorAuthForm" v-model="twoFactorAuthFormIsValid">
                    <v-container>
                      <v-row dense align="center" justify="center">
                        <v-col cols="12">
                          <div class="d-flex align-center justify-space-between">
                            <span class="text-body-1">{{$t("two_factor_authentication")}}:</span>
                            <v-spacer></v-spacer>
                            <v-switch dense inset hide-details class="mt-0 pt-0" true-value="Y" false-value="N" :color="currentTheme" @change="toggle2FA" v-model="userData.TWO_FACTOR_AUTH_YN"></v-switch>
                          </div>
                        </v-col>
                        <v-col lg="6" cols="12">
                          <v-img contain :src="qrCode" :alt="userSecret" :width="Math.floor(windowWidth/4)" :height="Math.floor(windowHeight/4)" v-if="qrCode"></v-img>
                        </v-col>
                        <v-col lg="6" cols="12">
                          <v-alert prominent border="left" type="info" v-if="qrCode">
                            <div>
                              Please use <code>Google Authenticator</code> or <code>Authy</code> application to scan this QR Code and fill the OTP you receive to the text field below.
                            </div>
                          </v-alert>
                        </v-col>
                        <v-col cols="12">
                          <v-text-field outlined dense validate-on-blur :color="currentTheme" :label="$t('otp')" :rules="validationRule.nameRules" v-model="otpInput" v-if="qrCode"></v-text-field>
                        </v-col>                        
                        <v-col cols="12">
                          <v-btn block dark depressed :color="currentTheme" :disabled="isProcessing" :loading="isProcessing" @click="update2FA">{{ $t('update') }}</v-btn>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-form>
                </v-card>
              </v-tab-item>
            </v-tabs>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "personal-info-dialog",

  props: {
    userData: Object
  },

  data: () => ({
    personalInfoDialog: true,
    personalInfoFormIsValid: undefined,
    passwordFormIsValid: undefined,
    twoFactorAuthFormIsValid: undefined,
    showOldPassword: false,
    showNewPassword: false,
    showConfirmPassword: false,
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
    qrCode: "",
    userSecret: "",
    otpInput: ""
  }),  

  computed: {
    maxWidth() { 
      if(this.$vuetify.breakpoint.lgAndUp) { return this.windowWidth/2 }
      return
    },
    passwordConfirmationRule() {
      if(this.newPassword === this.confirmPassword) { return true }
      return this.$t('confirm_pass_not_match')
    }
  },

  watch: {
    personalInfoDialog(val) {
      if (val === false) {
        this.$emit("closeDialog")
      }
    }
  },

  methods: {
    async updateInfo() {
      if(this.$refs.personalInfoForm.validate()) {
        this.personalInfoFormIsValid = true
        try {
          this.isProcessing = true
          const res = await this.$axios.$post("dso/callproc", { proc: "SYS_UPD_USER_INFO", para: [ this.userData.PK, this.userData.USER_NAME, this.userData.USER_LANGUAGE ] })
          if (res.data && res.data) {
            this.isProcessing = false
            this.showNotification('success', this.$t('update_success'), '')
            await this.$store.dispatch("auth/saveUserInfo")
          } else {
            this.isProcessing = false
            this.showNotification('danger', this.$t('update_failed'), res.message)
          } 
        } catch(e) {
          this.isProcessing = false
          this.showNotification("danger", this.$t("error_occurs"), e.message)
        }
      } else {
        this.personalInfoFormIsValid = false
      }
    },

    async updatePassword() {
      if(this.$refs.passwordForm.validate()) {
        this.passwordFormIsValid = true
        this.isProcessing = true
        try {
          const res = await this.$axios.$post("/user/updateuserpassword", { proc: "SYS_UPD_USER_PW", oldPassword: this.oldPassword, newPassword: this.newPassword, confirmPassword: this.confirmPassword })
          if(res.data && res.data) {
            this.isProcessing = false
            this.showNotification('success', this.$t('update_password_success'), '')
            await this.$store.dispatch("auth/saveUserInfo")
          } else {
            this.isProcessing = false
            this.showNotification('danger', this.$t('update_password_failed'), this.$t(res.message))
          }
        } catch(e) {
          this.isProcessing = false
          this.showNotification('danger', this.$t('error_occurs'), e.message)
        }
      } else {
        this.passwordFormIsValid = false
      }
    },

    async toggle2FA(status) {      
      if(status === "Y") {
        // if(this.userData.TWO_FACTOR_AUTH_YN === "N") {
          try {
            const { success, data, message } = await this.$axios.$post("user/enable2fa");
            if(success && data) {
              this.qrCode = data.qrCodeImage;
              this.userSecret = data.userSecret;
            } else {
              this.showNotification("danger", message, "");
              return;
            }
          } catch (e) {
            this.showNotification("danger", e.message, "");
            return;
          }        
        // }
      } else {
        this.qrCode = "";
        this.userSecret = "";
      }      
    },

    async update2FA() {
      if(this.qrCode) {
        if(this.$refs.twoFactorAuthForm.validate()) {
          this.twoFactorAuthFormIsValid = true;
          this.isProcessing = true;
          try {            
            const res = await this.$axios.$post("user/update2FA", { proc: "SYS_UPD_USER_2FA", otpToken: this.otpInput, userSecret: this.userSecret, twoFactorAuthYN: "Y" })
            if (res.data && res.data) {
              this.isProcessing = false
              this.showNotification('success', this.$t('update_success'), '')
              await this.$store.dispatch("auth/saveUserInfo")
            } else {
              this.isProcessing = false
              this.showNotification('danger', this.$t('update_failed'), res.message)
            } 
          } catch (e) {
            this.isProcessing = false
            this.showNotification('danger', this.$t('error_occurs'), e.message);
          }
        } else {
          this.twoFactorAuthFormIsValid = false;
        }
      } else {
        this.isProcessing = true;
        try {          
          const res = await this.$axios.$post("user/update2FA", { proc: "SYS_UPD_USER_2FA", otpToken: "", userSecret: "", twoFactorAuthYN: "N" })
          if (res.data && res.data) {
            this.isProcessing = false
            this.showNotification('success', this.$t('update_success'), '')
            await this.$store.dispatch("auth/saveUserInfo")
          } else {
            this.isProcessing = false
            this.showNotification('danger', this.$t('update_failed'), res.message)
          } 
        } catch (e) {
          this.isProcessing = false
          this.showNotification('danger', this.$t('error_occurs'), e.message);
        }
      }
    } 
  }
}
</script>
