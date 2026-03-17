<template>
  <v-sheet 
    v-bind="$attrs" tile :color="color ? color : null" 
    :class="[flat ? '' : !borderColor ? 'elevation-3' : '', additionClasses]" 
    :style="borderStyle"
    :width="width" :height="height"
  >
    <slot name="default"></slot>
  </v-sheet>
</template>

<script>
export default {
  name: "base-wrapper",

  props: {
    width: {
      type: [String, Number],
      default: "100%"
    },
    height: {
      type: [String, Number],
      default: null,
    },    
    color: {
      type: String,
      default: null,
    },
    flat: {
      type: Boolean,
      default: true
    },
    additionClasses: {
      type: String,
      default: "overflow-y-auto"
    },
    borderColor: {
      type: String,
      default: null
    },
    borderWidth: {
      type: Number,
      default: 2
    }
  },

  computed: {
    borderStyle() {
      if(this.borderColor) {
        return `outline: ${this.borderWidth}px solid ${this.borderColor} !important`;
      }      
    }
  }
}
</script>