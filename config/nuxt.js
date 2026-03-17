"use strict";

const resolve = require("path").resolve;
const webpack = require("webpack");
let _stop = false;
const isDev = process.env.NODE_ENV === "development";

module.exports = {
  ssr: false,
  telemetry: false,
  performance: () => {
    if(isDev) {
      return {
        hints: false,
        /* maxAssetSize: 512000,
        maxEntrypointSize: 512000 */
        maxAssetSize: 100000,
        maxEntrypointSize: 400000
      }
    }
  },
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.APP_URL_TITLE ? process.env.APP_URL_TITLE : process.env.APP_NAME,
    titleTemplate: process.env.APP_URL_TITLE ? process.env.APP_URL_TITLE : process.env.APP_NAME,
    // htmlAttrs: {
    //     lang: process.env.APP_LOCALE
    // },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: process.env.APP_URL_TITLE ? process.env.APP_URL_TITLE : process.env.APP_NAME,
      },
      { property: "og:url", content: "" },
      { property: "og:type", content: "website" },
      {
        property: "og:title",
        content: process.env.APP_URL_TITLE ? process.env.APP_URL_TITLE : process.env.APP_NAME,
      },
      {
        property: "og:description",
        content: process.env.APP_URL_TITLE ? process.env.APP_URL_TITLE : process.env.APP_NAME,
      },
      { property: "fb:app_id", content: "" },
      {
        property: "og:image",
        content: "",
      },
    ],
    script: [
      /* {
				innerHTML: `const host_socket = "${process.env.SOCKET_SERVER}"; const g_analytics = "${process.env.G_ANALYTICS}"; const fb_page_id = "${process.env.FB_PAGE_ID}"`,
			},
			{
				src: `https://www.googletagmanager.com/gtag/js?id=${process.env.G_ANALYTICS}`,
			},
			{ src: "https://unpkg.com/xlsx/dist/shim.min.js" },
      { src: "https://unpkg.com/xlsx/dist/xlsx.full.min.js" }, */
      //{ src: "https://cdn.jsdelivr.net/npm/jsbarcode@3.11.0/dist/JsBarcode.all.min.js" },
      /* {
				src: "https://www.google.com/recaptcha/api.js?onload=vueRecaptchaApiLoaded&render=explicit"
			} */
      { src: "https://cdnjs.cloudflare.com/ajax/libs/mathjs/11.8.0/math.min.js" }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/images/favicon.png" }],
    __dangerouslyDisableSanitizers: ["script"],
  },
  /*
   ** Customize the progress bar color
   */
  loading: { color: "#007bff", height: "5px" },
  /**
   * Global css
   */
  css: [
    "@mdi/font/css/materialdesignicons.min.css", 
    "@/assets/style/bundled.scss"
  ],
  /**
   * Plugins
   */
  plugins: [
    "~/plugins/dso", 
    "~/plugins/filters", 
    "~/plugins/globalComponents", 
    "~/plugins/globalFunction", 
    "~/plugins/globalDso", 
    "~/plugins/mixin", 
    "~/plugins/md5", 
    { src: "~/plugins/axios" }, 
    { src: "~/plugins/i18n.js" }, 
    { src: "~/plugins/vue-notifyjs", mode: "client" }, 
    { src: "~/plugins/devextreme-vue", mode: "client" }, 
    { src: "~/plugins/jqwidgets", mode: "client" },
    { src: "~/plugins/nuxt-client-init", mode: 'client' }
  ],
  modules: [
    "@nuxtjs/axios"
  ],

  buildModules: ["@nuxtjs/vuetify"],
  vuetify: {
    theme: {
      themes: {
        light: {
          primary: "#375875",
          secondary: "#E0E0E0", // 678096
          color3: "#aaccee", // aaccee
          color4: "#89bdee",
          color5: "#6886B9",
          seaBlue: "#81C7D4",
          forgetMeNotBlue: "#7DB9DE",
          skyBlue: "#58B2DC",
          paleGreen: "#006284",
          darkBlue: "#005CAF",
          purpleBlue: "#2E3E67",
          dandelion: "#f0e130",
          primary2: "#0d6fd5",
          primary3: "#1d2c61",
          primary4: "#50697F",
          primary5: "#435EBE",
          primary6: "#007DFE",
          primary7: "#01C4FE",
          secondary2: "#F2F7FF",
          secondary3: "#bcc6cf",
          accent: "#82B1FF",
          error: "#FF5252",
          info: "#2196F3",
          success: "#4CAF50",
          warning: "#FFC107",
        },
        dark: {
          primary: "#375875",
          secondary: "#E0E0E0", // 678096
          color3: "#aaccee", // aaccee
          color4: "#89bdee",
          color5: "#6886B9",
          seaBlue: "#81C7D4",
          forgetMeNotBlue: "#7DB9DE",
          skyBlue: "#58B2DC",
          paleGreen: "#006284",
          darkBlue: "#005CAF",
          purpleBlue: "#2E3E67",
          dandelion: "#f0e130",
          primary2: "#0d6fd5",
          primary3: "#1d2c61",
          primary4: "#50697F",
          primary5: "#435EBE",
          primary6: "#007DFE",
          primary7: "#01C4FE",
          secondary2: "#F2F7FF",
          secondary3: "#bcc6cf",
          accent: "#82B1FF",
          error: "#FF5252",
          info: "#2196F3",
          success: "#4CAF50",
          warning: "#FFC107",
        },
      },
    },
    icons: {
      iconfont: "mdi", // default - only for display purposes
    },
  },
  axios: {
    prefix: "/api",
    credentials: false,
  },
  /*
   ** Build configuration
   */
  build: {
    babel: {
      plugins: [["@babel/plugin-proposal-private-methods", { loose: true }]],
    },
    analyze: {
      analyzerMode: "static",
      generateStatsFile: true,
      statsFilename: "webpack-stats.json",
    },
    extractCSS: true,
    optimization: () => {
      if(isDev) {     
        return {
          splitChunks: {
            chunks: 'async',
            minSize: 20000,
            minChunks: 1,
            maxAsyncRequests: 30,
            maxInitialRequests: 30,
            enforceSizeThreshold: 50000,
            cacheGroups: {
              defaultVendors: {
                test: /[\\/]node_modules[\\/]/,
                priority: -10,
                reuseExistingChunk: true,
              },
              default: {
                minChunks: 2,
                priority: -20,
                reuseExistingChunk: true,
              },
            }
          }
        }
      }
    },    
    plugins: [
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "window.jQuery": "jquery",
        _: "lodash",
        Quill: "quill",
        "window.Quill": "quill",
      }),
      new webpack.DefinePlugin({
        "typeof global": JSON.stringify("undefined"),
      }),
      {
        apply: (compiler) => {
          compiler.hooks.done.tap("DonePlugin", (stats) => {
            if (_stop == false) {
              _stop = true;
              console.log("Client compile is done !");
              if (process.env.NODE_ENV == "production") {
                setTimeout(() => {
                  process.exit(0);
                });
              }
            } else {
              console.log("Server compile is done !");
              if (process.env.NODE_ENV == "production") {
                setTimeout(() => {
                  process.exit(0);
                });
              }
            }
          });
        },
      },
    ],
    /*
		** Run ESLint on save
		*/
    /* extend(config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }, */
    postcss: null,
		html: {
      minify: {
        collapseBooleanAttributes: true,
        decodeEntities: true,
        minifyCSS: true,
        minifyJS: true,
        processConditionalComments: true,
        removeEmptyAttributes: true,
        removeRedundantAttributes: true,
        trimCustomFragments: true,
        useShortDoctype: true,
        preserveLineBreaks: false,
        collapseWhitespace: true
      }
    }
  },
  /**
   * Vue Router config
   */
  router: {
    base: "/",
    linkActiveClass: "open active",    
    prefetchLinks: false,
    // middleware: ["delay"]
    /* scrollBehavior: (to, from, savedPosition) => {
      if (savedPosition) {
        return savedPosition;
      }

      let position = {};

      if (to.matched.length < 2) {
        position = { x: 0, y: 0 };
      } else if (to.matched.some((r) => r.components.default.options.scrollToTop)) {
        position = { x: 0, y: 0 };
      }
      if (to.hash && to.hash !== "#") {
        position = { selector: to.hash };
      }

      return position;
    }, */
    //middleware: ["locale"]
  },
  /**
   * Point to resources
   */
  srcDir: resolve(__dirname, "..", "resources"),

  rules: [],

  env: {
    APP_NAME: process.env.APP_NAME,
    APP_URL: process.env.APP_URL,
    LOCAL_APP_URL:process.env.LOCAL_APP_URL,
    LOCAL_API_URL:process.env.LOCAL_API_URL,
    DB_CONNECTION: process.env.DB_CONNECTION,
    SHORT_APP_NAME: process.env.SHORT_APP_NAME,
    APP_URL_TITLE: process.env.APP_URL_TITLE ? process.env.APP_URL_TITLE : process.env.APP_NAME,
    DB_DATABASE: process.env.DB_DATABASE,
    SSO_URL: process.env.SSO_URL,
    CUSTOM_LOGIN_PATH: process.env.CUSTOM_LOGIN_PATH,
    SMTP_HOST: process.env.SMTP_HOST,
    OPEN_DEFAULT_FORM: process.env.OPEN_DEFAULT_FORM,
    MONITORING_MODE: process.env.MONITORING_MODE ? process.env.MONITORING_MODE : false
  },
};
