<template>
  <v-dialog max-width="350" v-model="dialogIsShow">
    <v-card v-resize="onResize">
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ $t("color_dialog") }}</span>
        <v-spacer></v-spacer>
        <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
      </v-card-title>
      <v-card-text class="pa-1">
        <v-container>
          <v-row no-gutters>
            <v-col md="12" class="pa-1">
              <v-card  class="pa-1" outlined tile>
                <v-row align="center" justify="space-between" no-gutters>
                  <v-col class="px-1 py-2" md="12" >
                    <v-color-picker v-model="color.COLOR_CODE" hide-inputs show-swatches></v-color-picker>
                  </v-col>
                </v-row>
                <v-row align="center" justify="space-between" no-gutters>
                  <v-col md="12" class="d-flex justify-center">
                    <BaseButton icon_type="select" @onclick="onClickButton('btnSelect')"/>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import CellGridTextField from '@/components/table/CellGridTextField'
export default {
  name: 'color-dialog',
  components: { CellGridTextField},
  data: () => ({
    dialogIsShow: false,
    color: {COLOR_CODE: ""},
  }),
  watch: {
    dialogIsShow(val) {
      if(val === false) {
        this.$emit('onCloseDialog')
      }else{
        this.color.COLOR_CODE = "";
      }
    },
  },
  mounted(){

  },
  computed: {
    user() { return this.$store.getters["auth/user"] },
  },
  methods: {
    onClickButton(obj){
      switch(obj){
        case 'btnSelect':
          this.color.COLOR_CODE = this.color.COLOR_CODE.substring(0,7);
          this.callBackData(this.color);
          break;
      }
    },
    callBackData(_data) {
      this.$emit("callBackData", _data);
      this.dialogIsShow = false;
    }
  }
}
</script>
