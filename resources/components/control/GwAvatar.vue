<template>
  <v-avatar v-bind="$attrs" :size="size">
    <v-img :contain="$attrs.contain" :src="!src ? noImage : isBufferImg ? _getImageUrlFromBuffer(src) : src"></v-img>
  </v-avatar>
</template>

<script>
export default {
  name: "gw-avatar",

  props: {
    size: Number,
    src: [String, Object],
    isBufferImg: {
      type: Boolean,
      default: true
    }
  },

  data:()=>({
    noImage: require('@/assets/images/no_photo.png'),
  })
}
</script>