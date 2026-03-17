<template>
  <div id="cell-grid-select">
    <div @dblclick="enableEditing" class="pointer" style="height: 27px; line-height: 27px;" v-if="editCell === false">
      <span>{{ oldValue | formatFromCode(listArr, itemValue, itemText) }}</span>
    </div>
    <v-select autofocus dense cache-items hide-details single-line 
      class="mt-0 extraDenseTextField" height="20px"
      :item-value="itemValue" :item-text="itemText" :items="listArr" 
      v-model="inputValue" @blur="editCell = false" @keyup.esc="editCell = false" @change="submitNewValue" v-else>
    </v-select>
  </div>
</template>

<script>
export default {
  name: 'cell-grid-select',
  props: ['data', 'k', 'index', 'listArr', 'itemValue', 'itemText'],

  data: () => ({
    editCell: false,
    inputValue: ''
  }),

  computed: {
    oldValue() { return this.data }
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
  }
}
</script>
