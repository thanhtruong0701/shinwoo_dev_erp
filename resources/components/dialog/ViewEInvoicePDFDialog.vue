<template>
  <v-dialog id="View E-invoice PDF" max-width="1000" v-model="dialogIsShow" v-resize="onResize">
    <v-card :height="limitHeight1">
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ $t("view-einvoice-pdf-dialog") }}</span>
        <v-spacer></v-spacer>
        <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
      </v-card-title>
      <v-container fluid>
        <v-row no-gutters>
          <v-col cols="12">
            <v-card outlined :height="limitHeight2">
              <iframe :src="src_pdfUrl" height="100%" width="100%" ></iframe>
            </v-card>
            <!-- <v-sheet color="red" height="100%" width="100%">AA</v-sheet> -->
          </v-col>
        </v-row>        
      </v-container>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  name: "view-einvoice-pdf-dialog",
  props: {
    src_pdfUrl: { type: String, default: null },
  },
  components: {},
  data: () => ({
    dialogIsShow: false,
    pdfUrl: "",
  }),
  created() {
    // this.getMachineTags()
  
  },
  computed: {
    limitHeight1() {
      return Math.floor(this._calculateHeight(this.windowHeight,80));
    },
    limitHeight2() {
      return Math.floor(this._calculateHeight(this.limitHeight1,90));
    }
    // limitHeight() {
    //   return this.windowHeight;
    // },
  },
  watch: {
    // src_pdfUrl: () => {
    //   console.log(src_pdfUrl);
    // },
  },

  methods: {},
};
</script>
