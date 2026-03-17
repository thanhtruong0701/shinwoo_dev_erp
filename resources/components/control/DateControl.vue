<template>
  <div id="date-control" class="d-flex align-center justify-space-between">
    <v-btn icon :color="currentTheme" @click="changeValue('previous')" :disabled="isDisabled">
      <v-icon>mdi-arrow-left-drop-circle</v-icon>
    </v-btn>
    <v-text-field dense hide-details class="mx-0" :label="label" v-model="defaultvalue" @change="inputChange" :disabled="isDisabled"></v-text-field>
    <v-btn icon :color="currentTheme" @click="changeValue('next')" :disabled="isDisabled">
      <v-icon>mdi-arrow-right-drop-circle</v-icon>
    </v-btn>
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "date-control",
  props: ["type", "label", "disabled", "value", "defaultNull"],

  data() {
    return {
      defaultvalue: "",
      formatType: "",
      formatTypeToSave: "",
      isDisabled: false
    }
  },

  created() {
    this.getType()
  },

  watch: {
    value() {
      this.getType();
    },
    type(val) {
      this.getType();
    },
    disabled: {
      immediate: true,
      handler(val) {
        this.isDisabled = !!val ? true : false;
      }
    },
    _language(val) {
      if(val) {
        this.getType()
      }
    }
  },

  methods: {
    getType() {
      if (this.type === "years") {
        this.formatType = "YYYY";
        this.formatTypeToSave = "YYYY";
      } else if (this.type === "months") {
        this.formatType = this.curLang.MONTH_FORMAT // "MM/YYYY";
        this.formatTypeToSave = "YYYYMM";
      }
      if (this.defaultvalue) {}
      if (this.value) {
        this.defaultvalue = moment(this.value).format(this.formatType);
      } else {
        if (this.defaultNull) {
          this.defaultvalue = "";
          this.$emit("returnValue", "");
        } else {
          this.defaultvalue = moment(new Date()).format(this.formatType);
          this.$emit("returnValue", moment(this.defaultvalue, this.formatType).format(this.formatTypeToSave));
        }
      }
    },

    inputChange() {
      if (this.type === "years") {
        // Check negative or 0 defaultvalue
        if (!this.defaultvalue) {
          this.defaultvalue = moment(new Date()).format(this.formatType);
        }
        if (parseInt(this.defaultvalue) <= 0) {
          this.defaultvalue = moment(new Date()).format(this.formatType);
        }
      }
      if (this.type === "months") {
        // Check negative or 0 defaultvalue
        const month = this.defaultvalue.split("/")[0];
        const year = this.defaultvalue.split("/")[1];
        if (parseInt(month) <= 0 || parseInt(year) <= 0) {
          this.defaultvalue = moment(new Date()).format(this.formatType);
        }
        /* const validStatus = moment(this.defaultvalue, this.formatType).isValid()
        console.log('validStatus:', validStatus)
        if(!validStatus) {
          this.defaultvalue = moment().month(0).format(this.formatType)
        } */
        this.defaultvalue = moment(this.defaultvalue, this.formatType).format(this.formatType);
      }
      this.$emit("returnValue", moment(this.defaultvalue, this.formatType).format(this.formatTypeToSave));
    },

    changeValue(action) {
      if (!this.defaultvalue) {
        this.defaultvalue = moment(new Date()).format(this.formatType);
      }
      if (action === "previous") {
        this.defaultvalue = moment(this.defaultvalue, this.formatType).subtract(1, this.type).format(this.formatType);
      } else {
        this.defaultvalue = moment(this.defaultvalue, this.formatType).add(1, this.type).format(this.formatType);
      }
      this.$emit("returnValue", moment(this.defaultvalue, this.formatType).format(this.formatTypeToSave));
    }
  }
};
</script>
