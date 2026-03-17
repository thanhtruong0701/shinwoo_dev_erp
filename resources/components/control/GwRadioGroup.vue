<template>
  <v-radio-group
    v-bind="$attrs"
    :background-color="isMandatory ? `yellow lighten-3` : ''"
    class="ma-0 pt-0"
    dense
    hide-details    
    :value="value"
    @change="$emit('input', $event)"
  >
    <v-radio 
      v-for="(item, index) in myItems"
      :key="index"
      :color="currentTheme"
      :label="item[itemText]" 
      :value="item[itemValue]"
    >
      <template #label>
        <div :class="[`${textColor}--text`, item[itemValue] === value ? activeTextColor ? `${activeTextColor}--text` : '' : 'font-weight-600']">{{ item[itemText] }}</div>
      </template>
    </v-radio>
  </v-radio-group>
</template>

<script>
export default {
  name: "gw-radio-group",

  props: {
    items: Array,
    value: [ String, Number ],
    itemValue: {
      type: [ String, Number],
      default: "value"
    },
    itemText: {
      type: [ String, Number ],
      default: "text"
    },
    textColor: {
      type: String,
      default: "black"
    },
    activeTextColor: String
  },

  computed: {
    myItems() {
      return this.items;
    },
    isMandatory() {
      return this.$attrs.hasOwnProperty("mandatory") ? true : false;
    }
  }
};
</script>

