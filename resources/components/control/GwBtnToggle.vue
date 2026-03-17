<template>
  <v-btn-toggle
    v-bind="$attrs"
    :color="color ? color : currentTheme"
    dense
    mandatory
    :value="value"
    @change="$emit('input', $event)"
  >
    <v-btn v-for="(item, idx) in items" :key="idx" :value="item[itemValue]">
      {{ item[itemText] }}
    </v-btn>
  </v-btn-toggle>
</template>

<script>
export default {
  name: "gw-btn-toggle",

  props: {
    color: {
      type: String,
    },
    items: Array,
    value: [String, Number],
    itemValue: {
      type: [String, Number],
      default: "value",
    },
    itemText: {
      type: [String, Number],
      default: "text",
    },
  },
};
</script>
