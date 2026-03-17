<template>
  <div>
    <v-textarea
      v-bind="$attrs"
      dense
      hide-details
      :color="currentTheme"
      :background-color="isMandatory ? `yellow lighten-3` : ''"
      :class="themesuport === 2 ? 'rounded-0' : ''"
      :outlined="themesuport === 2 || $attrs.hasOwnProperty('outlined')|| $attrs.hasOwnProperty('acntoutlined') ? true : false"
      :rules="$attrs.rules"
      :validate-on-blur="$attrs.rules && $attrs.rules.length ? true : false"
      :value="value"
      @input="$emit('input', $event)"
      @click="$emit('onClick')"
      @dblclick="$emit('onDblClick')"
    ></v-textarea>
  </div>
</template>

<script>
export default {
  name: "base-textarea",

  props: {
    value: String,
  },
  data() {
    return {
      themesuport: 1,
    };
  },

  mounted() {
    this._processTheme();
  },

  computed: {
    isMandatory() {
      return this.$attrs.hasOwnProperty("mandatory") ? true : false;
    },
  },

  methods: {
    _processTheme() {
      try {
        if (this.curLang.THEME_SUPPORT > 0) {
          this.themesuport = this.curLang.THEME_SUPPORT;
        } else {
          this.themesuport = 1;
        }
      } catch (error) {
        this.themesuport = 1;
      }

      // test theme
      // this.themesuport = 2;
    },
  },
};
</script>

<style></style>
