<template>
  <div id="cell-grid-checkbox" class="text-center">
    <div style="height: 24px;">
      <v-checkbox dense hide-details class="ma-0 pa-0" :ripple="false" :true-value="trueValue" :false-value="falseValue" v-model="oldValue"></v-checkbox>
    </div>
  </div>
</template>

<script>
export default {
  name: 'cell-grid-checkbox',
  props: ['data', 'k', 'index', 'trueValue', 'falseValue'],

  computed: {
    oldValue: { 
      get() { return this.data },
      set(newValue) { 
        this.$emit('submitValue', newValue, this.k, this.index, true)
        return newValue         
      }
    }
  },

  /* watch: {
    oldValue(newVal, oldVal) {
      console.log('newVal', newVal)
      console.log('oldVal', oldVal)
      if(oldVal !== null) {
        this.$emit('submitValue', newVal, this.k, this.index, true)
      }
    }
  } */
}
</script>
