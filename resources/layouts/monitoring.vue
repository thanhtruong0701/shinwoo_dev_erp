<template>
  <v-app>
    <client-only>
      <notifications></notifications>
    </client-only>
    <v-main id="mainWrapper" v-resize="onResize">
      <v-container fluid class="py-0 h-100" :class="'px-0'" >
        <v-app-bar app dense flat color="secondary2" height="50">
          <div class="d-flex align-center justify-space-between">
            <div class="d-flex flex-column justify-center">
              <div class="d-flex text-h4 font-weight-bold mx-4 text-decoration-none" v-if="appName">
                <span class="primaryText">{{ appName }}</span>
              </div>
              <div class="d-flex text-h4 font-weight-bold mx-4 text-decoration-none" v-else>
                <span class="primaryText">G-</span>
                <span class="primaryText">ERP</span>
              </div>
            </div>
          </div>
          <v-spacer></v-spacer>
          <!-- <div class="d-flex align-center justify-space-between">
            <div class="d-flex flex-column justify-center">
              <nuxt-link class="d-flex text-h4 font-weight-bold mx-4 text-decoration-none" to="/" v-if="appName">
                <span class="primaryText">{{ appName }}</span>
              </nuxt-link>
              <nuxt-link class="d-flex text-h4 font-weight-bold mx-4 text-decoration-none" v-else>
                <span class="primaryText">G-</span>
                <span class="primaryText">ERP</span>
              </nuxt-link>
            </div>
          </div> -->
        </v-app-bar>
        <v-row no-gutters align-items="center" justify-content="center" class="fill-height pa-5">
          <v-col cols="12">
            <nuxt />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
const findValueDeep = require('deepdash/findValueDeep');
const eachDeep = require('deepdash/eachDeep')
// import moment from "moment";

export default {
  name: "monitoring",

  components: { 
  },

  data: () => ({
    appName: process.env.SHORT_APP_NAME?process.env.SHORT_APP_NAME: process.env.APP_NAME,
  }),
  
  async created() {
  },

  async mounted() {
  },

  destroyed() {
  },

  computed: {
  },

  watch: {
  }, 

  methods: {
  }
};
</script>