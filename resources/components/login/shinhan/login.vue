<template>
  <v-card flat tile :img="backgroundImg" :width="windowWidth" :height="windowHeight" v-resize="onResize">    
    <v-container fluid class="fill-height">
      <v-row no-gutters align="center" justify="center">
        <v-col cols="12">
          <v-card flat class="cardWrapper mx-auto rounded-xl elevation-12" :width="cardWrapper.maxWidth" :height="cardWrapper.maxHeight">
            <v-card flat tile class="logo" :width="logoWH.width" :height="logoWH.width">
              <v-img contain eager :lazy-src="shinhanLogo" :src="shinhanLogo" />
            </v-card>
            <v-container fluid class="px-12">
              <v-row no-gutters align="center" justify="space-between">
                <v-col lg="7" cols="12">
                  <v-img contain eager :aspect-ratio="Math.floor(16/9)" :height="bgImageWH.height" :lazy-src="backgroundImg2" :src="backgroundImg2" />
                </v-col>
                <v-col lg="5" cols="12">
                  <v-card flat tile :height="bgImageWH.height">
                    <v-container fluid class="fill-height">
                      <v-row dense align="center" justify="center">
                        <v-col cols="12">
                          <v-form lazy-validation ref="logInForm" v-model="formIsValid">
                            <v-container fluid>
                              <v-row dense align="center" justify="center">
                                <v-col cols="12">
                                  <v-text-field outlined single-line validate-on-blur label="Username" :color="currentTheme" :rules="inputRule" v-model="userName" @keypress.enter="checkLogIn"></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                  <v-text-field outlined single-line validate-on-blur class="my-input" label="Password" :color="currentTheme" :rules="inputRule" :type="showPassword ? 'text' : 'password'" :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" @click:append="showPassword = !showPassword" v-model="password" @keypress.enter="checkLogIn"></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                  <v-btn block depressed height="56" :class="[currentTextColor, 'primary-gradient-btn']" :disabled="isProcessing" :loading="isProcessing" @click="checkLogIn">Log In</v-btn>
                                </v-col>
                              </v-row>
                            </v-container>
                          </v-form>
                        </v-col>
                        <v-col cols="12" class="text-center mt-10">
                          <div class="d-flex flex-column align-center justify-center copy-right grey--text text-body-2 font-weight-medium">
                            <span>{{ copyRightText }}</span>
                            <span class="mt-2">{{ copyRightText2 }}</span>
                          </div>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
import login from "@/plugins/login.js";
export default {
  name: "custom-login",
  mixins: [login],

  data: () => ({
    backgroundImg: require("@/assets/images/login_bg/shinhan/bg_image.png"),
    backgroundImg2: require("@/assets/images/login_bg/shinhan/bg_image_3.png"),
    shinhanBankText: require("@/assets/images/login_bg/shinhan/shinhan_bank_text.png"),
    shinhanLogo: require("@/assets/images/login_bg/shinhan/shinhan_logo.png")
  }),

  computed: {
    aspectRatio() {
      return this.windowWidth / this.windowHeight;
    },
    cardWrapper() {
      if(this.windowHeight <= 768) {
        return {
          maxWidth: this._calculateHeight(this.windowWidth, 80),
          maxHeight: this._calculateHeight(this.windowHeight, 70)
        }
      }
      return {
        maxWidth: this._calculateHeight(this.windowWidth, 75),
        maxHeight: this._calculateHeight(this.windowHeight, 60)
      }
    },
    bgImageWH() {
      return {
        width: Math.ceil((this.cardWrapper.maxWidth / 2) - 24),
        height: Math.ceil(this.cardWrapper.maxHeight - 24)
      }
    },
    logoWH() {
      return {
        width: this._calculateHeight(this.bgImageWH.width, 12)
      }
    }
  },
}
</script>

<style lang="scss" scoped>
  .primary-gradient-btn {    
    background: linear-gradient(45deg, #0940BC 0%, #4A58D5 25%, #866EEB 100%);
  }
  .cardWrapper {
    position: relative;
    .logo {
      position: absolute;
      top: 0;
      right: 72px;
      z-index: 10;
    }
  }
  .copy-right {
    font-family: "Gmarket Sans";
    font-size: 8px;
    text-shadow: 8px 8px 43px rgb(0 0 0 / 15%);
    text-align: right;
  }
</style>
