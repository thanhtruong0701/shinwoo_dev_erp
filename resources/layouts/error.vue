<template>
  <v-app>
    <v-container class="pa-0">
      <v-row no-gutters align="center" justify="center">
        <v-col lg="8" sm="10" cols="12">
          <div id="notfound">
            <div class="notfound">
              <div>
                <div class="notfound-404">
                  <h1>!</h1>
                </div>
                <h2>Error<br>{{ error.statusCode }}</h2>
              </div>
              <p class="text-lg-h4 text-sm-h4 error--text font-weight-bold font-error">There is an error in this page!</p> 
              <p class="text-sm-h5 text-subtitle-1 font-error">Error message: {{ error.message }}.</p>
              <v-btn depressed color="error" :large="$vuetify.breakpoint.xsOnly" :x-large="$vuetify.breakpoint.smAndUp" @click="$router.push('/')">
                <v-icon class="mr-2">mdi-keyboard-return</v-icon>
                <div style="font-family: 'Montserrat', sans-serif; font-weight: 700;">Back to homepage</div>
              </v-btn>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
export default {
  layout: "default",
  props: ["error"],

  head() {
    return {
      link: [
        {
          href: "https://fonts.googleapis.com/css2?family=Chango&display=swap",
          rel: "stylesheet"
        },
        {
          href: "https://fonts.googleapis.com/css?family=Montserrat:200,400,700",
          rel: "stylesheet"
        }
      ],
    }
  }
};
</script>

<style scoped>
* {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

body {
  padding: 0;
  margin: 0;
}

#notfound {
  position: relative;
  height: 100vh;
}

#notfound .notfound {
  position: absolute;
  left: 50%;
  top: 50%;
  -webkit-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}

.notfound {
  max-width: 80%;
  width: 100%;
  line-height: 1.4;
}

.notfound>div:first-child {
  padding-left: 200px;
  padding-top: 12px;
  height: 170px;
  margin-bottom: 20px;
}

.notfound .notfound-404 {
  position: absolute;
  left: 0;
  top: 0;
  width: 170px;
  height: 170px;
  background: #e01818;
  border-radius: 7px;
  -webkit-box-shadow: 0px 0px 0px 10px #e01818 inset, 0px 0px 0px 20px #fff inset;
  box-shadow: 0px 0px 0px 10px #e01818 inset, 0px 0px 0px 20px #fff inset;
}

.notfound .notfound-404 h1 {
  font-family: 'Chango', cursive;
  color: #fff;
  font-size: 118px;
  margin: 0px;
  position: absolute;
  left: 50%;
  top: 50%;
  -webkit-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  display: inline-block;
  height: 60px;
  line-height: 60px;
}

.notfound h2 {
  font-family: 'Chango', cursive;
  font-size: 68px;
  color: #222;
  font-weight: 400;
  text-transform: uppercase;
  margin: 0px;
  line-height: 1.1;
}

.notfound p {
  font-family: 'Montserrat', sans-serif !important;
  font-size: 16px;
  font-weight: 400;
  color: #222;
  margin-top: 5px;
}

.notfound a {
  font-family: 'Montserrat', sans-serif;
  color: #e01818;
  font-weight: 400;
  text-decoration: none;
}

@media only screen and (max-width: 480px) {
  .notfound {
    padding-left: 15px;
    padding-right: 15px;
  }

  .notfound>div:first-child {
    padding: 0px;
    height: auto;
  }

  .notfound .notfound-404 {
    position: relative;
    margin-bottom: 15px;
  }

  .notfound h2 {
    font-size: 42px;
  }

  .font-error {
    font-family: 'Montserrat', sans-serif !important;
  }
}
</style>
