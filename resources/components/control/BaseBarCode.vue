<template>
  <VueBarcode :format="format" :fontSize="fontSize" :width="width" :height="height" :displayValue="true" :value="value" />
</template>

<script>
import VueBarcode from 'vue-barcode';
export default {
  name: "base-bar-code",

  components: {
    VueBarcode
  },

  props: {
    format: {
      type: String,
      default: "CODE39"
    },
    fontSize: {
      type: Number,
      default: 10
    },
    height: {
      type: Number,
      default: 20
    },
    width: {
      type: Number,
      default: 1
    },
    value: {
      type: String,
      required: true
    }
  }
}
</script>