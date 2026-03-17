<template>
  <div>
    <v-text-field
      v-bind="$attrs"
      v-model="my_value"
      :label="label"
      :color="currentTheme"      
      clearable
      dense
      hide-details
      v-if="showdisabled"
    >
      <template v-slot:prepend v-if="showICon">
        <BaseIcon icon_type="time" :icon_size="true" />
      </template>
    </v-text-field>
    <v-menu
      ref="menu"
      v-bind="$attrs"
      v-model="menu2"
      :close-on-content-click="false"
      :nudge-right="40"
      :return-value.sync="my_value"
      transition="scale-transition"
      offset-y
      min-width="290px"
      v-if="!showdisabled"
    >
      <template v-slot:activator="{ on }">
        <v-text-field
          v-bind="$attrs"
          v-model="my_value"
          :label="label"
          :color="currentTheme"          
          clearable
          dense
          hide-details
          v-on="on"
        >
          <template v-slot:prepend v-if="showICon">
            <BaseIcon icon_type="time" :icon_size="true" />
          </template>
        </v-text-field>
      </template>
      <v-time-picker
        :color="currentTheme"
        v-if="menu2"
        v-bind="$attrs"
        v-model="my_value"
        full-width
        @click:minute="returnVal"
      >
      </v-time-picker>
    </v-menu>
  </div>
</template>

<script>
export default {
  name: "base-time-picker",
  props: ["value", "label"],

  data() {
    return {
      menu2: false,
      isWatch: false,
      my_value: null,
    };
  },
  components: {},
  computed: {
    showdisabled() {
      //compomet defaul has problem with disabled
      if (this.$attrs.hasOwnProperty("disabled")) {
        if (this.$attrs.disabled == "false") {
          return false;
        }
        return true;
      }
      return false;
    },

    showICon() {
      if (this.$attrs.hasOwnProperty("icon")) {
        if (this.$attrs.icon == "false") {
          return false;
        }
        return true;
      }
      return false;
    },
  },
  mounted() {
    this.my_value = this.value;
    this.isWatch = true;
  },

  watch: {
    value(val) {
      this.my_value = val;
    },
    my_value(val) {
      if (this.isWatch) {
        this.$emit("input", this.my_value);
      }
    },
  },

  methods: {
    returnVal() {
      this.menu2 = false;
      this.$refs.menu.save(this.value);
      // this.$emit('input',this.my_value)
    },
  },
};
</script>
