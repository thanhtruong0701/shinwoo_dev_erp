<template>
  <v-container>
    <v-row no-gutters justify="center">
      <v-card class="d-inline-block mx-auto">
        <v-img ref="img" :src="image" :width="width" :height="height" aspect-ratio="1" class="blue lighten-5"
          @click="selectImage"></v-img>
      </v-card>
    </v-row>
    <v-row>
      <v-spacer></v-spacer>
      <BaseButton btn_type="icon" icon_type="view_origin" :btn_text="$t('view_origin')" mdi-icon="mdi-file-find-outline"
        onlyIcon @onclick="viewImage" v-show="view_origin" />
      <BaseButton btn_type="icon" icon_type="attach" :btn_text="$t('attach')" onlyIcon @onclick="selectImage"
        v-show="editable" />
      <BaseButton btn_type="icon" icon_type="reset" :btn_text="$t('reset')" onlyIcon @onclick="onReset"
        :disabled="image == no_image" v-show="editable" />
      <v-spacer></v-spacer>
    </v-row>
    <input type="file" accept="image/png, image/jpeg, image/bmp" v-show="false" ref="file" @change="selectedFile" />

    <v-dialog v-model="img_dialog" :max-width="originWidth" :max-height="originHeight">
      <v-card>
        <!-- <v-card-title class="headline primary-gradient white--text py-2 px-2">
      <span>{{ $t("origin_image") }}</span>
      <v-spacer></v-spacer>
      <BaseButton :icon_color="'white'" btn_type="icon" icon_type="close_dialog" mdi-icon="mdi-close-thick" :btn_text="$t('close')" @onclick="img_dialog = false" />
    </v-card-title> -->
        <v-container fluid class="px-0 py-0">
          <v-row no-gutters align="center" justify="center">
            <!-- <img :src="image" :height="originHeight" :width="originWidth" /> -->
            <PinchZoom>
              <v-img contain v-bind:src="image" :height="originHeight" :width="originWidth"/>
            </PinchZoom>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: "base-photo",
  components: {
    PinchZoom: () => import("vue-pinch-zoom"),
  },
  //props: ["value", "rules", "table_name","master_table","master_table_pk","procedure"],
  props: {
    value: { type: [Number, String], default: null },
    width: { type: [String, Number], default: 180 },
    height: { type: [String, Number], default: 220 },
    table_name: { type: String, default: null },
    master_table: { type: String, default: null },
    master_table_pk: { type: Number, default: null },
    procedure: { type: String, default: null },
    max_size: { type: Number, default: 0 },
    view_origin: { type: Boolean, default: true },
    //orientation:{       type: String, default: "landscape" },
  },

  data() {
    return {
      my_value: null,
      isWatch: false,
      image: require('@/assets/images/no_image.png'),
      no_image: require('@/assets/images/no_image.png'),
      old_image: null,
      fileSave: null,
      status: true,
      img_dialog: false,
      img_dialog_url: null,
      originHeight: 400,
      originWidth: 400,
      orientation: "landscape",
    };
  },
  computed: {
    editable() {
      let _readonly = this.$attrs.hasOwnProperty("readonly") && (this.$attrs["readonly"] === "" || this.$attrs["readonly"] === true);
      let _edit = !_readonly;
      return _edit;
    }
  },
  mounted() {
    this.my_value = this.value;
    this.isWatch = true;
  },

  watch: {
    value(val) {

      this.my_value = val;
    },
    my_value(val) {
      if (this.isWatch) {
        if (val < 0) this.status = false;
        else this.status = true;
        this.onLoad();
        this.$emit("input", this.my_value);
      }
    },
    fileSave(value) {
      if (value) this.status = false;
      else this.status = true;
    }
  },

  methods: {
    checkStatus() {
      if (this.fileSave || this.my_value <= 0)
        this.status = false;
      else
        this.status = true;
    },

    selectImage() {
      if (!this.editable) return;
      this.$refs.file.click();
    },

    selectedFile(event) {
      const files = event.target.files;
      if (files[0] !== undefined) {
        const fr = new FileReader();
        fr.readAsDataURL(files[0]);
        fr.addEventListener('load', () => {
          this.image = fr.result;
          this.fileSave = files[0];
          this.$emit("change", event);
        });
      }
    },

    async Save() {
      if (this.fileSave) {
        let params = [
          this.my_value ? this.my_value : 0, //p_tes_file_pk
          this.table_name ? this.table_name : 'TC_FSBINARY', //p_table_name
          this.master_table ? this.master_table : '', //p_master_table
          this.master_table_pk ? this.master_table_pk : 0 //p_master_table_pk
        ];
        const fd = new FormData();
        fd.append('file', this.fileSave);
        fd.append('proc', this.procedure ? this.procedure : 'sys_upd_file');
        fd.append('para', JSON.stringify(params));
        fd.append('max_size', this.max_size ? this.max_size : 0);

        const res = await this.$axios({
          method: 'post',
          url: '/dso/uploadfile',
          data: fd
        });
        if (res.data.data) {
          //this.showNotification("success", this.$t("process_success"), "");
          this.fileSave = null;
          this.old_image = null;

          let rtnKeys = Object.keys(res.data.data);
          if (rtnKeys.includes("p_rtn_cur")) {
            if (res.data.data.p_rtn_cur[0].PK > 0) {
              this.my_value = res.data.data.p_rtn_cur[0].PK;
            }
          } else {
            if (res.data.data[0].PK > 0) {
              this.my_value = res.data.data[0].PK;
            }
          }
          await this.onLoad();
        } else {
          this.showNotification("danger", this.$t("error_occurs"), "");
          return false;
        }
      }
      return true;
    },

    async setImage(obj) {
      let base64String = this._arrayBufferToBase64(obj?.data);
      if(base64String){
        this.image = "data:image/png;base64, " + base64String;
      }
    },

    async onLoad() {
      if (this.my_value > 0) {
        let arrayBuffer = null;
        const dso = {
          type: 'process',
          updpro: 'sys_sel_photo',
          para: [this.table_name ? this.table_name : 'TC_FSBINARY', this.my_value]
        };

        const result = await this._dsoCall(dso, 'process', false)
        if (result) {
          try {
            const rtn = result[0];
            arrayBuffer = rtn.DATA;
            var base64String = this._arrayBufferToBase64(arrayBuffer.data);
            this.image = "data:image/png;base64, " + base64String;
            this.old_image = "data:image/png;base64, " + base64String;
          } catch (e) {
            // trường hợp ko có hình
            this.fileSave = null;
            this.old_image = null;
            this.image = this.no_image;
          }
        }

      } else {
        this.fileSave = null;
        this.old_image = null;
        this.image = this.no_image;
      }
    },
    onReset() {
      this.image = (this.old_image != this.image) ? this.old_image : this.no_image;
      this.fileSave = null;
      this.my_value = null;
    },

    getImageDimensions(file) {
      return new Promise(function (resolved, rejected) {
        var i = new Image()
        i.onload = function () {
          resolved({ w: i.width, h: i.height })
        };
        i.src = file
      })
    },

    async viewImage() {
      let dimensions = await this.getImageDimensions(this.image);
      let maxWidth = window.screen.width * 0.8;
      let maxHeight = window.screen.height * 0.8;

      this.orientation = dimensions.w > dimensions.h ? "landscape" : "portrait";
      this.originWidth = dimensions.w;
      this.originHeight = dimensions.h;

      if (this.orientation == "landscape") {
        if (dimensions.w > maxWidth) {
          let ratio = (maxWidth / dimensions.w).toFixed(2);
          this.originWidth = maxWidth;
          this.originHeight = Math.round(dimensions.h * ratio)
        }
      } else {
        if (dimensions.h > maxHeight) {
          let ratio = (maxHeight / dimensions.h).toFixed(2);
          this.originHeight = maxHeight;
          this.originWidth = Math.round(dimensions.w * ratio)
        }
      }
      await this.wait(50);
      this.img_dialog = true;
    },

  },
};
</script>