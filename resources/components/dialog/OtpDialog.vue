<template>
  <v-dialog id="otp-dialog" width="800" v-model="dialogIsShow">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ $t("otp") }}</span>
        <v-spacer></v-spacer>        
        <v-icon dark @click="closeDialog">mdi-close-thick</v-icon>
      </v-card-title>
      <v-container fluid>
        <v-row no-gutters>
          <v-col cols="12">
            <v-otp-input               
              :length="length" 
              :type="type" 
              :disabled="loading" 
              v-model="otp"
              @finish="onFinish"
            >
            </v-otp-input>
            <v-overlay absolute :value="loading">
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
            </v-overlay>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

  
<script>
export default {
  name: 'otp-dialog', 

  props: {
    type: {
      type: String,
      default: "number"
    },
    length: {
      type: Number,
      default: 6
    }    
  },
  
  data: () => ({
    dialogIsShow: false,
    loading: false,
    otp: ""
  }),

  methods: {
    onFinish (response) {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.otp = "";
        this.closeDialog();
        this.$emit("onSuccess", response);
      }, 3000)
    },

    showDialog() {
      this.dialogIsShow = true;
      this.otp = "";
    },
    closeDialog() {
      this.dialogIsShow = false;      
    }
  }
}
</script>
