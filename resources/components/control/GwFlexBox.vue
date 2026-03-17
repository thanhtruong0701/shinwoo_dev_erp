<template>
  <BaseWrapper :flat="true" :color="color" :id="`gw-flex-box-id-${keyID}`" :class="visible ? 'd-flex' : 'd-none'" :additionClasses="flexClasses" :width="width" :height="height">
    <slot name="default"></slot>    
  </BaseWrapper>
</template>

<script>
export default {
  name: "gw-flex-box",

  props: {
    color: {
      type: String,
      default: "transparent"
    },
    align: {
      type: String,
      default: "stretch"
      // Accept values: start, end, center, baseline, stretch
    },
    justify: {
      type: String,
      default: "start"
      // Accept values: start, end, center, space-between, space-around
    },
    width: {
      type: [String, Number],
      default: "100%"
    },
    height: {
      type: [String, Number],
      default: null,
    },
    noWrap: {
      type: Boolean,
      default: false
    },
    visible: {
      type: Boolean,
      default: true
    }
  },

  computed: {
    keyID() {
      return this._uniqueID();
    },
    flexClasses() {
      return `align-${this.align} justify-${this.justify} ${ this.noWrap ? 'flex-no-wrap' : 'flex-wrap' }`;
    }
  }
}
</script>