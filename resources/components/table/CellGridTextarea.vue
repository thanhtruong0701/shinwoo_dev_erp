<template>
  <div id="cell-grid-text-field">
    <div @dblclick="enableEditing" class="pointer text-truncate" style="height: 27px; line-height: 27px;" v-if="editCell === false">
      <span>{{ oldValue }}</span>
    </div>
    <v-textarea autofocus dense hide-details no-resize single-line class="mt-0 mb-2" rows="3" v-model="inputValue"
      @blur="submitNewValue" @keyup.esc="editCell = false" v-else>
    </v-textarea>
  </div>
</template>

<script>
export default {
  name: 'cell-grid-textarea',
  props: ['data', 'k', 'index', 'isAdded'],

  data: () => ({
    editCell: false,
    inputValue: ''
  }),

  computed: {
    oldValue() { return this.data }
  },

  watch: {
    isAdded(val) {
      if(val && this.inputValue) {
        this.submitNewValue()
      }
    }
  },

  methods: {
    enableEditing() {
      this.editCell = true
      this.inputValue = this.oldValue ? this.oldValue : ''
    },

    submitNewValue() {
      this.editCell = false
      this.$emit('submitValue', this.inputValue, this.k, this.index, true)
    }
  },
}
</script>
