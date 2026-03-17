<template>
  <v-overlay z-index="9999" :value="visible">
    <v-progress-circular indeterminate :color="color" :size="size" :width="width"></v-progress-circular>
  </v-overlay>
  
</template>

<script>
export default {
  name: "gw-loading",

  props: {
    visible: Boolean,
    color: {
      type: String,
      default: "#fff"
    },
    size: {
      type: [ Number, String ],
      default: 64
    },
    width: {
      type: [ Number, String ],
      default: 7
    }
  }
}
</script>