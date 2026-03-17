<template>
  <div>
    <v-text-field
      v-bind="$attrs"
      v-model="my_value_format"
      :label="label"
      :readonly="readonly"
      dense
      :outlined="$attrs.hasOwnProperty('outlined') || $attrs.hasOwnProperty('acntoutlined')  ? true : false"
      hide-details
      v-if="showClearable"
      :color="currentTheme"
      :background-color=" isMandatory  ? 'yellow lighten-3' : readonly ? 'grey lighten-2' : 'grey lighten-1'"
    >
      <template v-slot:prepend v-if="showICon">
        <BaseIcon icon_type="cal" :icon_size="true" />
      </template>
      <template v-slot:append v-if="my_value_format != ''">
        <slot name="append"></slot>
      </template>
    </v-text-field>

    <v-menu
      ref="menu"
      v-bind="$attrs"
      v-model="menu2"
      :close-on-content-click="false"
      :nudge-right="40"
      transition="scale-transition"
      offset-y
      :min-width="getMaxWidth"
      :max-width="getMaxWidth"
      v-if="!showClearable"
    >
      <template v-slot:activator="{ on }">
        <v-text-field
          v-bind="$attrs"
          v-model="my_value_format"
          :label="label"
          :clearable="!showClearable && clearable"
          dense
          :color="currentTheme"
          :background-color=" isMandatory  ? 'yellow lighten-3' : readonly ? 'grey lighten-2' : ''"
          :hide-details="hideDetails"
          v-on="on"  :outlined="$attrs.hasOwnProperty('outlined') || $attrs.hasOwnProperty('acntoutlined')  ? true : false"
          :error="isError"
          :error-messages="isErrorMessages"
          @blur="onBlur"
          @keypress.enter="onBlur"          
          @click:clear="callItBack"
        >
          <template v-slot:prepend v-if="showICon">
            <BaseIcon icon_type="cal" :icon_size="true" />
          </template>
          <template v-slot:append v-if="my_value_format != ''">
            <slot name="append"></slot>
          </template>
        </v-text-field>
      </template>
      <v-date-picker
        v-if="menu2"
        v-model="my_value_format_picker"
        no-title
        :color="currentTheme"
        :locale="curLang.CODE"        
        :active-picker.sync="activePicker"
        :max="max_value"
        :min="min_value"
        min-width="auto"
        :style="{ width: getMaxWidth }"
        :width="getMaxWidth"
        @input="menu2 = false"
        @click:year="returnValYear"
        @click:month="returnValMonth"
        @click:date="returnValDay"
      ></v-date-picker>
    </v-menu>
  </div>
</template>

<script>
const DateMode = Object.freeze({
  date: 1,
  month: 2,
  year: 3,
});

import moment from "moment";

export default {
  name: "base-date-picker",

  props: {
    value: {
      type: String,
      default: null,
    },
    label: {
      type: String,
      default: null,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    clearable:{
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      menu2: false,
      isWatch: false,
      dateMode: DateMode.date,
      my_value: null,
      my_value_format: "",
      my_value_format_changed_by_sys: false,
      my_value_format_picker: "",
      dataFormat: "",
      type: "date",
      max_value: "",
      min_value: "",
      isError: false,
      isErrorMessages: "",
      hideDetails: true,
      activePicker: null
    };
  },
  components: {
    DateMode,
    moment,
  },
  computed: {
    showClearable() {
      //compomet defaul has problem with disabled
      if (
        this.readonly || this.$attrs.hasOwnProperty("disabled")
      ) {
        return true;
      }
      return false;
    },
    showICon() {
      if (this.$attrs.hasOwnProperty("icon")) {
        if (this.$attrs.icon == "false") {
          return false;
        }
        return true;
      }
      return false;
    },
    getMaxWidth() {
      if (this.$attrs.hasOwnProperty("year")) {
        return "150";
      }
      return "290";
    },
    isMandatory() {
      return this.$attrs.hasOwnProperty("mandatory") || (this.rules != null && this.rules ) ? true : false;
    },
  },

  created() {
    this.$watch(() => this.$attrs, this.watchProperties);
  },

  mounted() {
    let now_year = moment(new Date().toISOString().substr(0, 10)).format(
      "YYYY"
    );
    let max_year = parseInt(now_year) + 80;
    let min_year = parseInt(now_year) - 80;
    this.max_value = max_year + "0101";
    this.min_value = min_year + "0101";
    if (this.$attrs.hasOwnProperty("date")) {
      this.dateMode = DateMode.date;
      this.dataFormat = this.curLang.DATE_FORMAT;
      this.type = "date";
    } else if (this.$attrs.hasOwnProperty("month")) {
      this.dateMode = DateMode.month;
      this.dataFormat = this.curLang.MONTH_FORMAT;
      this.type = "month";
    } else if (this.$attrs.hasOwnProperty("year")) {
      this.dateMode = DateMode.year;
      this.dataFormat = "YYYY";
      this.type = "year";
    } else {
      this.dateMode = DateMode.date;
      this.dataFormat = this.curLang.DATE_FORMAT;
      this.type = "date";
    }

    this.my_value = this.value;

    this.valueChange();
    this.isWatch = true;
  },

  watch: {
    value(val) {
      if (val != this.my_value) {
        this.my_value = val;
      }
    },
    my_value(val) {
      if (this.isWatch) {
        this.valueChange();
      }
    },
    my_value_format(val) {
      if (this.isWatch) {
        if (this.my_value_format_changed_by_sys == false) {
          if (!val) {
            if (!this.my_value) {
              return;
            }
          }
          this.menu2 = false;
          let format = this.dataFormat.toUpperCase();

          const myDate = moment(val, format).format(format);

          if (val != myDate) {
            this.$nextTick(() => {
              this.isError = true;
              this.isErrorMessages = format;
              this.hideDetails = false;
            });
          } else {
            this.$nextTick(() => {
              this.isError = false;
              this.isErrorMessages = "";
              this.hideDetails = true;
            });
          }
        } else {
          this.my_value_format_changed_by_sys = false;
        }
      }
    },

    my_value_format_picker(val) {
      // if (this.isWatch) {
      //   if (val) {
      //     let key = this.formatFromPicker(val);
      //     this.returnValue(key);
      //     //
      //     //this.isError = false;
      //   } else {
      //     // this.isError = true;
      //   }
      // }
    },

    menu2 (val) {
      val && setTimeout(() => {
        // console.log("type:", this.type)
        if(this.type === "year") {
          this.activePicker = "YEAR";
        } else if(this.type === "month") {
          this.activePicker = "MONTH";
        } else {
          this.activePicker = "DATE";
        }
      })
    }
  },

  methods: {
    watchProperties(properties) {
      // console.log("watchProperties:", properties)
      if (properties.hasOwnProperty("date")) {
        this.dateMode = DateMode.date;
        this.dataFormat = this.curLang.DATE_FORMAT;
        this.type = "date";
      } else if (properties.hasOwnProperty("month")) {
        this.dateMode = DateMode.month;
        this.dataFormat = this.curLang.MONTH_FORMAT;
        this.type = "month";
      } else if (properties.hasOwnProperty("year")) {
        this.dateMode = DateMode.year;
        this.dataFormat = "YYYY";
        this.type = "year";
      } else {
        this.dateMode = DateMode.date;
        this.dataFormat = this.curLang.DATE_FORMAT;
        this.type = "date";
      }
    },

    valueChange() {
      if (!this.my_value) {
        if (this.isWatch == false) {
          let d_val = this.formatToDefault(this.my_value);

          if (d_val) {
            this.$emit("input", this.returnValue(d_val));
            return;
          } else {
            this.my_value_format_changed_by_sys = true;
            this.my_value_format = "";
            this.my_value_format_picker = this.formatToPicker(this.my_value);
          }
        } else {
          this.my_value_format_changed_by_sys = true;
          this.my_value_format = "";
          this.my_value_format_picker = this.formatToPicker(this.my_value);
          this.$nextTick(() => {
            this.isError = false;
            this.isErrorMessages = "";
            this.hideDetails = true;
          });
          this.$emit("input", "");
        }
      } else {
        let d_val2 = this.formatToDefault(this.my_value);
        if (d_val2.length == 8 || d_val2.length == 0) {
          if (this.returnValue(d_val2) != this.value) {
            this.my_value_format_changed_by_sys = true;
            this.my_value_format = this.my_value
              ? moment(this.my_value).format(this.dataFormat.toUpperCase())
              : "";

            this.my_value_format_picker = this.formatToPicker(this.my_value);

            this.$nextTick(() => {
              this.isError = false;
              this.isErrorMessages = "";
              this.hideDetails = true;
            });
            this.$emit("input", this.returnValue(d_val2));
            return;
          } else {
            this.my_value_format_changed_by_sys = true;
            this.my_value_format = this.my_value
              ? moment(this.my_value).format(this.dataFormat.toUpperCase())
              : "";

            this.my_value_format_picker = this.formatToPicker(this.my_value);

            this.$nextTick(() => {
              this.isError = false;
              this.isErrorMessages = "";
              this.hideDetails = true;
            });
          }
        } else {
          //Invalid date
          this.$nextTick(() => {
            this.isError = true;
            this.isErrorMessages = this.dataFormat.toUpperCase();
            this.hideDetails = false;
          });

          this.$emit("input", "");
        }
      }
      // this.my_value = this.formatToDefault(this.value);
      // this.my_value_format = this.my_value
      //   ? moment(this.my_value).format(this.dataFormat.toUpperCase())
      //   : "";
      // this.my_value_format_picker = this.formatToPicker(this.value);
    },

    returnValue(val) {
      //if(this.value){
      let key = "";
      if (this.dateMode == DateMode.year) {
        key = moment(val).format("YYYY");
      } else if (this.dateMode == DateMode.month) {
        key = moment(val).format("YYYYMM");
      } else {
        key = moment(val).format("YYYYMMDD");
      }
      this.$emit("change", key);
      return key;
      
      //}
    },
    returnValYear(val) {
      if (this.dateMode == DateMode.year) {
        let key = this.formatFromPicker(val);
        this.my_value = key;

        this.menu2 = false;
      }
    },
    returnValMonth(val) {
      if (this.dateMode == DateMode.month) {
        let key = this.formatFromPicker(val);
        this.my_value = key;
        this.menu2 = false;
      }
    },
    returnValDay(val) {
      let key = this.formatFromPicker(val);
      this.my_value = key;
      this.menu2 = false;
    },
    callItBack() {
      this.$emit("input", "");
    },

    onBlur() {
      if (this.isError == true) {
        this.isError = false;
        this.my_value = "";
      } else {
        if (!this.my_value_format) {
          return;
        }
        let format = this.dataFormat.toUpperCase();

        const myDate = moment(this.my_value_format, format).format("YYYYMMDD");

        this.my_value = myDate;
      }
    },

    formatToPicker(val) {
      let valt = "";
      if (!val) {
        return "";
        //valt =  new Date().toISOString().substr(0, 10)
        //valt = valt.replace(/[^0-9]+/g, '')
      } else if (val.length == 8 || val.length == 4) {
        valt = val;
      }

      if (valt) {
        //let test = moment(valt);
        if (this.dateMode == DateMode.year) {
          return moment(valt).format("YYYY");
        } else if (this.dateMode == DateMode.month) {
          return moment(valt).format("YYYY-MM");
        } else {
          return moment(valt).format("YYYY-MM-DD");
        }
      }
      return "";
    },
    formatFromPicker(val) {
      val = val + "";
      if (val) {
        if (val.length == 8) {
          return val;
        }
        let key = val.replace(/[^0-9]+/g, "");
        if (this.dateMode == DateMode.year) {
          return key + "0101";
        } else if (this.dateMode == DateMode.month) {
          return key + "01";
        } else if (this.dateMode == DateMode.date) {
          return key;
        }
      }

      return "";
    },

    formatToDefault(val, getdefaul = false) {
      if (!val) {
        if(this.$attrs.hasOwnProperty("pretoday") ){
            var date = new Date();
            var num = 0 ;
            try {
              num  = Number(this.$attrs.pretoday);
            } catch (error) {
              
            }

            if( num > 0){
                date.setDate(date.getDate() - num);
            }

            return date.toISOString().substr(0, 10);


            
        }else if (
          this.$attrs.hasOwnProperty("default") ||
          this.$attrs.hasOwnProperty("today")
        ) {
          return new Date().toISOString().substr(0, 10);
        }else if (this.$attrs.hasOwnProperty("start")) {
          //var defaul  =  new Date().toISOString().substr(0, 10)
          if (this.dateMode == DateMode.month) {
            return moment().startOf("year").format("YYYYMMDD");
          } else if (this.dateMode == DateMode.date) {
            return moment().startOf("month").format("YYYYMMDD");
          }
        }else if (this.$attrs.hasOwnProperty("end")) {
          //var defaul  =  new Date().toISOString().substr(0, 10)
          if (this.dateMode == DateMode.month) {
            return moment().endOf("year").format("YYYYMMDD");
          } else if (this.dateMode == DateMode.date) {
            return moment().endOf("month").format("YYYYMMDD");
          }
        }

        return "";
      }
      if (val.length == 8) {
        return val;
      }

      let valt = "";

      if (this.dateMode == DateMode.year) {
        valt = val + "0101";
      } else if (this.dateMode == DateMode.month) {
        valt = val + "01";
      } else {
        valt = val;
      }

      return valt;
    }
  },
};
</script>
