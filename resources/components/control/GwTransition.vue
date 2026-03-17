<template>
  <!-- Component thực hiện hiệu ứng transition -->
  <component v-bind="$attrs" :is="`v-${transitionType}-transition`" leave-absolute>
    <slot name="default"></slot>
  </component>
</template>

<script>
export default {
  name: "gw-transition",

  props: {
    transitionType: {
      type: String,
      default: "fade" // Các giá trị khác bao gồm: fab, fade, expand, scale, scroll-x, scroll-x-reverse, scroll-y, scroll-y-reverse, slide-x, slide-x-reverse, slide-y, slide-y-reverse
    }
  }
}
</script>