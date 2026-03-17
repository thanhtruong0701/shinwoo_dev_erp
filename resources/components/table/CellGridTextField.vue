<template>
  <div id="cell-grid-text-field">
    <div @dblclick="enableEditing" class="pointer text-truncate" style="height: 27px; line-height: 27px;" v-if="editCell === false">
      <span v-if="type === 'password'">{{ oldValue | hidePassword }}</span>
      <span v-else>{{ oldValue }}</span>
    </div>
    <v-text-field autofocus dense hide-details single-line class="mt-0 extraDenseTextField" height="20px" :type="type" v-model="inputValue"
      @blur="submitNewValue" @keyup.enter="submitNewValue" @keyup.esc="editCell = false" v-else>
    </v-text-field>
  </div>
</template>

<script>
export default {
  name: 'cell-grid-text-field',
  props: ['data', 'k', 'index', 'isAdded', 'type'],

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
