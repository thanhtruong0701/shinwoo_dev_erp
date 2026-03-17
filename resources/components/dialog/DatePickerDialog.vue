<template>
  <v-dialog id="date-picker-dialog" max-width="305" v-model="dialogIsShow">
    <v-date-picker
      no-title
      :color="currentTheme"
      :locale="curLang.CODE"
      v-model="_valueTime"
    >
      <v-spacer></v-spacer>
      <v-btn small raised color="primary" @click="returnValueClear">{{
        $t("clear")
      }}</v-btn>
      <v-btn small raised color="secondary" @click="dialogIsShow = false">{{
        $t("cancel")
      }}</v-btn>
      <v-btn small raised color="success" @click="returnValueOk">{{
        $t("ok")
      }}</v-btn>
    </v-date-picker>
  </v-dialog>
</template>

<script>
export default {
  name: "date-picker-dialog",
  props: {},
  components: {},
  data: () => ({
    dialogIsShow: false,
    value: "",
    _valueTime: "",
  }),

  created() {},

  computed: {},

  watch: {
    dialogIsShow(val) {
      // if (val === true) {
      // }
    },
    value(val) {
      const userKeyRegExp = /^[0-9]{8}$/;

      const valid = userKeyRegExp.test(val);

      if (valid) {
        this._valueTime = this._formatDateForPicker(val, "");
      }
    },
  },
  methods: {
    returnValueOk() {
      this.$emit("returnData", this._formatDateToSave(this._valueTime, ""));
      this.dialogIsShow = false;
    },
    returnValueClear() {
      this.$emit("returnData", "");
      this.dialogIsShow = false;
    },
  },
};
</script>
