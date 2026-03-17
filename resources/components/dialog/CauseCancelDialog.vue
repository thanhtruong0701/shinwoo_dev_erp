<template>
  <v-dialog id="cause-cancel-dialog" max-width="800" height="400" v-model="dialogIsShow">
    <v-card>
      <v-card-title class="title white--text py-2" v-bind:class="[Type]">{{
        $t(msg_cancel)
      }}</v-card-title>
      <v-row no-gutters>
        <v-col cols="12">
          <v-textarea
            filled
            :label="$t(cause, 'COMMON')"
            auto-grow
            v-model="rtnMsg"
          ></v-textarea>
        </v-col>
      </v-row>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text :color="currentTheme" @click="dialogIsShow = false">{{
          $t("disagree", "common")
        }}</v-btn>
        <v-btn
          depressed
          class="white--text"
          v-bind:class="[Type]"
          @click="onClickAgree"
          v-bind:disabled.sync="Input && rtnMsg.length < 10"
          >{{ $t("agree", "common") }}</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "cause-cancel-dialog",
  props: ["dialogInfo"],
  data: () => ({
    dialogIsShow: false,
    cause: "Cause Cancel",
    msg_cancel: "Plesea Input Cause Cancel !!",
    Type: "error",
    Input: false,
    rtnMsg: ""
  }),
  watch: {
    dialogInfo(val) {
      this.Type = val[0] ? val[0] : "info";
      this.Msg = val[1] ? val[1] : "MSG_CONFIRM";
    },
    dialogIsShow(val) {
      if (val === false) {
        this.$emit("onCloseDialog");
      }
    }
  },
  methods: {
    onClickAgree() {
      this.$emit("onConfirm", this.rtnMsg);
      this.$emit("onCloseDialog");
      this.dialogIsShow = false;
    },
    showConfirm(_msg, _type, _input) {
      this.dialogIsShow = true;
      this.Msg = _msg;
      this.Type = _type ? _type : "primary-gradient";
      this.Input = _input;
    }
  }
};
</script>
