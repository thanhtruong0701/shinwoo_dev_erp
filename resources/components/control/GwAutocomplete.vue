<template>
  <v-autocomplete
    v-bind="$attrs"
    auto-select-first
    :color="currentTheme"
    :background-color="isMandatory ? `yellow lighten-3` : ''"
    :clearable="isReadOnly ? false : true"
    :class="curLang.THEME_SUPPORT === 2 ? 'rounded-0' : ''"
    dense
    hide-details
    hide-no-data
    :items="myItems"
    :outlined="curLang.THEME_SUPPORT === 2 ? true : false"
    :value="value"
    @change="$emit('input', $event)"
  >
    <template v-slot:selection="{item}" v-if="labelChips">
      <v-chip 
        :color="chipsOption.color" 
        :text-color="chipsOption.textColor" 
        class="ma-2" 
        :label="chipsOption.isLabel" 
        x-small 
        @click="$emit('onClickChips', item)"
      >
        {{ item[itemText] }}
      </v-chip>
    </template>
  </v-autocomplete>
</template>

<script>
export default {
  name: "gw-autocomplete",

  props: {
    items: Array,
    value: [ String, Number, Object, Array ],
    valueAll: [ String, Number ],
    textAll: [ String, Number ],
    labelChips: Boolean,
    chipsOption: {
      type: Object,
      default: function () {
        return {
          isLabel: true,
          color: "primary6",
          textColor: "white"
        }
      }
    }
  },

  computed: {
    itemValue() {
      return this.$attrs["item-value"];
    },
    itemText() {
      return this.$attrs["item-text"];
    },
    isReadOnly() {
      return this.$attrs.hasOwnProperty("readonly") ? true : false;
    },
    itemAll() {
      let itemAll = {}
      itemAll[this.itemValue] = this.valueAll ? this.valueAll : "";
      itemAll[this.itemText] = this.textAll ? this.textAll : this.$t('select_all');
      return itemAll;
    },
    myItems() {
      return [...this.items, this.itemAll];
    },
    isMandatory() {
      return this.$attrs.hasOwnProperty("mandatory") ? true : false;
    }
  }
}
</script>