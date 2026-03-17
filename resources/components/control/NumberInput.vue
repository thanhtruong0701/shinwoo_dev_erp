<template>
  <!-- Return input with seperator, accept String and Number (Ex: 999999 => 999,999) -->
  <v-text-field dense hide-details 
    :clearable="isClearable" :disabled="isDisabled" :label="label" :outlined="isOutlined" :readonly="isReadOnly" :rules="rules"
    v-mask="'###,###,###,###.##'" v-model="numberValue" @input="returnNumber">
  </v-text-field>
</template>

<script>
export default {
  name: "number-input",
  props: {
    isClearable: {
      type: Boolean,
      default: true
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    isOutlined: {
      type: Boolean,
      default: false
    },
    isReadOnly: {
      type: Boolean,
      default: false
    },
    inputValue: {
      type: [ String, Number ]
    },
    label: String,
    rules: Array    
  },

  data:()=>({
    numberValue: ""
  }),

  inputValue: {
    immediate: true,
    handler(val) {
      this.numberValue = val
      this.returnNumber(val)
    }
  },

  methods: {
    returnNumber() {
      this.$emit("returnValue", this.numberValue)
    }
  }
}
</script>
