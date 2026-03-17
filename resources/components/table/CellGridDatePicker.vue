<template>
  <div id="cell-grid-date-picker">
    <div @dblclick="enableEditing" class="text-left pointer" style="height: 24px;" v-if="editCell === false">
      <span class="text-truncate">{{ oldValue | formatDate(curLang.DATE_FORMAT) }}</span>
    </div>
    <v-menu offset-y min-width="290px" :close-on-content-click="false" v-model="menu" v-else>
      <template v-slot:activator="{ on }">
        <v-text-field autofocus dense hide-details outlined readonly single-line 
          class="my-1 extraDenseTextField" height="30" v-model="dataValueFormatted" v-on="on"
          @keyup.esc="menu = false, editCell = false">
        </v-text-field>
      </template>
      <v-date-picker no-title :color="currentTheme" :locale="curLang.CODE" v-model="dateValue" @input="submitNewValue"></v-date-picker>
    </v-menu>
  </div>
</template>

<script>
import moment from "moment"
export default {
  name: 'cell-grid-date-picker',
  props: ['data', 'k', 'index'],

  data: () => ({
    editCell: false,
    menu: false,
    dateValue: ''
  }),

  computed: {
    oldValue() { return this.data },
    dataValueFormatted() {
      if(this.dateValue) {
        return moment(this.dateValue).format(this.curLang.DATE_FORMAT)
      }
      return ''
    }
  },

  methods: {
    enableEditing() {
      this.editCell = true
      this.dateValue = this.oldValue ? moment(this.oldValue).format('YYYY-MM-DD') : ''
    },

    submitNewValue() {
      this.menu = false
      this.editCell = false
      const submitDate = moment(String(this.dateValue)).format('YYYYMMDD')
      this.$emit('submitValue', submitDate, this.k, this.index, true)
    }
  }
}
</script>
