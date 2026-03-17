<template>
  <v-menu offset-y min-width="290px" transition="scale-transition" :close-on-content-click="false" v-model="pickerMenu">
    <template v-slot:activator="{ on }">
      <v-row no-gutters v-if="selectMode">
        <v-col cols="12" lg="4" class="pr-1">
          <v-select dense cache-items hide-details :outlined="outlined" item-value="PK" item-text="TEXT" :label="$t('date_mode')" :items="date_mode" v-model="selectedDate_mode" :rules="validationRule.selectRules"></v-select>
        </v-col>
        <v-col cols="12" lg="8">
          <v-text-field dense hide-details readonly v-on="on" :clearable="clearable" :disabled="isDisabled" :label="label" :outlined="outlined" :placeholder="placeholder" :rules="rules" v-model="formattedDate" v-show="isShow">
             <template v-slot:append v-if="dateValue != '' "> 
                <slot name="append">
                        </slot>
            
              </template>
          </v-text-field>
        </v-col>
      </v-row>
      <v-text-field v-else dense hide-details readonly v-on="on" :clearable="clearable" :disabled="isDisabled" :label="label" :outlined="outlined" :placeholder="placeholder" :rules="rules" v-model="formattedDate" v-show="isShow">
          <template v-slot:append v-if="dateValue != '' ">
                <slot name="append">
                        </slot>
            
              </template>
      </v-text-field>
    </template>
    <v-date-picker no-title :color="currentTheme" :locale="curLang.CODE" :type="type" v-model="dateValue" @input="pickerMenu = false"></v-date-picker>
  </v-menu>
</template>

<script>
import moment from "moment"
export default {
  name: "date-picker",
  props: {
    label: {
      type: String
    },
    type: {
      type: String,
      default: "date"
    },
    defaultType: {
      type: String,
      default: "today"
    },
    inputValue: {
      type: String
    },
    isDisabled: {
      type: Boolean
    },
    isShow:{
      type: Boolean,
      default: true
    },
    outlined: {
      type: Boolean,
      default: false
    },
    isClearable: {
      type: Boolean,
      default: false
    },
    rules: {
      type: Array
    },
    placeholder: {
      type: String
    },
    monthFormatString: {
      type: String, // Use for type "month" only. Use to set "formattedDate" into format "MM-YYYY" or "YYYY-MM".
      // default: "MM-YYYY"
    },
    selectMode: {
      type: Boolean,
      default:false
    }
  },

  data: () => ({
    pickerMenu: false,
    dateValue: "",
    validationMessage: "",
    selectedDate_mode: "date"
  }),

  created() {
    if (!this.inputValue) {
      switch (this.defaultType) {
        case "null":
          this.dateValue = ""
          break
        case "today":
          if(this.type === "month") {
            this.dateValue = new Date().toISOString().substr(0, 7)
          } else {
            this.dateValue = new Date().toISOString().substr(0, 10)
          }
          break
        case "startOfMonth":
          if(this.type === "month") {
            this.dateValue = moment().startOf("month").format("YYYY-MM")
          } else {
            this.dateValue = moment().startOf("month").format("YYYY-MM-DD")
          }
          break
        case "endOfMonth":
          if(this.type === "month") {
            this.dateValue = moment().endOf("month").format("YYYY-MM")
          } else {
            this.dateValue = moment().endOf("month").format("YYYY-MM-DD")
          }
          break
        case "startOfYear":
          if(this.type === "month") {
            this.dateValue = moment().startOf("year").format("YYYY-MM")
          } else {
            this.dateValue = moment().startOf("year").format("YYYY-MM-DD")
          }
          break
      }
      this.returnValue(this.dateValue)
    }
  },

  computed: {
    formattedDate: {
      get() { 
        if(this.type === "month") {
          return this._formatDate(this.dateValue, this.type, this.monthFormatString ? this.monthFormatString : this.curLang.MONTH_FORMAT.toUpperCase())
        }
        return this._formatDate(this.dateValue, this.type) 
      },
      set(newValue) {
        if (!newValue) {
          this.dateValue = ""
          this.$emit("returnValue", this.dateValue)
        }
        var date = ''
        if(this.type === "month") { 
          date = this._formatDate(newValue, this.type, this.monthFormatString ? this.monthFormatString : this.curLang.MONTH_FORMAT.toUpperCase()) 
        } else {
          date = this._formatDate(newValue, this.type) 
        }
        return date
      }
    },
    clearable: {
      get() { return this.isDisabled ? false : this.isClearable },
    },
    date_mode: function(){
      return [
        { PK: "date", TEXT: this.$t("date") },
        { PK: "month", TEXT: this.$t("month") },
      ]
    }
  },

  watch: {
    inputValue: {
      immediate: true,
      handler(val) {
        this.dateValue = this._formatDateForPicker(val, this.type)
        this.returnValue(val)
      }
    },
    dateValue(val) {
      if (val) {
        this.returnValue(val)
      }
    },
    defaultType(value) {
      switch (value) {
        case "null":
          this.dateValue = ""
          break
        case "today":
          if(this.type === "month") {
            this.dateValue = new Date().toISOString().substr(0, 7)
          } else {
            this.dateValue = new Date().toISOString().substr(0, 10)
          }
          break
        case "startOfMonth":
          if(this.type === "month") {
            this.dateValue = moment().startOf("month").format("YYYY-MM")
          } else {
            this.dateValue = moment().startOf("month").format("YYYY-MM-DD")
          }
          break
        case "endOfMonth":
          if(this.type === "month") {
            this.dateValue = moment().endOf("month").format("YYYY-MM")
          } else {
            this.dateValue = moment().endOf("month").format("YYYY-MM-DD")
          }
          break
        case "startOfYear":
          if(this.type === "month") {
            this.dateValue = moment().startOf("year").format("YYYY-MM")
          } else {
            this.dateValue = moment().startOf("year").format("YYYY-MM-DD")
          }
          break
      }
      this.returnValue(this.dateValue)
    },
    selectedDate_mode(value) {
      this.type= value;
    }
  },

  methods: {
    returnValue(value) {
      this.$emit("returnValue", this._formatDateToSave(value, this.type))
    }
  }
};
</script>
