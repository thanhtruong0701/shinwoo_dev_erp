<template>
  <v-dialog id="content-dialog" max-width="900" v-model="dialogIsShow">
    <v-card v-resize="onResize">
      <v-card-title class="headline primary-gradient white--text py-2">{{
        $t("content_dialog")
      }}</v-card-title>
      <v-card-text class="pa-0">
        <v-container fluid class="py-0">
          <v-row dense class="mt-3">
            <v-col cols="12" class="pa-2">
              <v-textarea
                clearable
                clear-icon="mdi-close-circle"
                auto-grow
                outlined
                shaped
                counter
                :rows="rows"
                :maxlength="maxlength"
                :label="$t('contents')"
                v-model="modelVal.txtContent"
              ></v-textarea>
            </v-col>
          </v-row>
          <v-row dense class="mt-2">
            <v-col md="12" align="center">
              <v-btn
                class="btn ma-1 rounded"
                tile
                dark
                :color="currentTheme"
                @click="onClick('save')"
                :disabled="isProcessing"
              >
                <v-icon class="mr-1">mdi-content-save</v-icon>
                {{ $t("save") }}
              </v-btn>
              <v-btn
                class="btn ma-1 rounded"
                tile
                dark
                color="grey"
                @click="dialogIsShow = false"
                :disabled="isProcessing"
              >
                <v-icon class="mr-1">mdi-close</v-icon>{{ $t("close") }}
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "content-dialog",
  props: {
    maxlength: { type: String, default: "" },
    rows: { type: String, default: "1" },
    text: { type: String, default: "" },
  },
  data: () => ({
    dialogIsShow: false,
    modelVal: {
      txtContent: null,
    },
  }),
  watch: {
    dialogIsShow(val) {
      if (val === false) {
        this.$emit("onCloseDialog");
      } else {
      }
    },
    text(val) {
      this.modelVal.txtContent = val;
    }
  },
  mounted() {},
  created() {},
  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
  },
  methods: {
    onClick(obj) {
      switch (obj) {
        case "save":
          this.callBackData(this.modelVal.txtContent);
          break;
      }
    },
    callBackData(_data) {
      this.$emit("callBackData", _data);
      this.dialogIsShow = false;
    },
  },
};
</script>
