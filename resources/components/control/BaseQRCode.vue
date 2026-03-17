<template>
  <!-- <v-img
    :alt="`qr-code-${value}`"
    eager
    contain
    :height="height"
    :width="width"
    :src="qrCodeImage"
  /> -->
  <img :src="qrCodeImage" :alt="`qr-code-${value}`" :height="height" :width="width" />
</template>

<script>
export default {
  name: "base-qr-code",

  props: {    
    height: {
      type: [String, Number],
      default: 250
    },
    width: {
      type: [String, Number],
      default: 250
    },
    value: {
      type: String,
      required: true
    }
  },

  computed: {
    qrCodeImage() {
      return this.value ? this._generateQRCode(this.value) : "";
    }
  }
}
</script>