<template>
  <div class="text-center button-view">
    <v-tooltip bottom v-if="themesuport == 0">
      <template v-slot:activator="{ on }">
        <v-btn
          depressed
          icon
          :color="$attrs.hasOwnProperty('color') ? $attrs['color'] :'secondary'"
          class="black--text"
          v-on="on"
          @click="OnClick"
          style="height: 100% !important; width: 100% !important"
        >
          <BaseIcon v-bind="$attrs" :icon_type="icon_type" :icon_size="true" />
        </v-btn> 
      </template>
      <span>{{ btn_text ? btn_text : $t(icon_type) }}</span>
    </v-tooltip>

    <v-btn v-if="orientationval == Orientation.horizontal && themesuport == 1  && (!btn_type || btn_type == 'default')"
      :color="$attrs.hasOwnProperty('color') ? $attrs['color'] :'secondary'"
      class="black--text"
      v-bind="$attrs"
      depressed
      :dark="isdark"
      x-small
      style="height: 100% !important"
      @click="OnClick"
    >
      <BaseIcon v-bind="$attrs" :icon_type="icon_type" :icon_color="icon_color" />
      <span> &nbsp; {{ btn_text ? btn_text : $t(icon_type) }} </span>
    </v-btn>

    <v-btn v-if="orientationval == Orientation.vertical && themesuport == 1 && (!btn_type || btn_type == 'default')"
      :color="$attrs.hasOwnProperty('color') ? $attrs['color'] :'secondary'"
      class="black--text"
      v-bind="$attrs"
      depressed
      :dark="isdark"
      style="height: 100% !important"
      @click="OnClick"
    >
      <div class="text-center">
        <div>
          <BaseIcon v-bind="$attrs" :icon_type="icon_type" :icon_color="icon_color" />
        </div>
        <div class="text-center">
          {{ btn_text ? btn_text : $t(icon_type) }}
        </div>
      </div>
    </v-btn>

    <v-btn v-if="orientationval == Orientation.horizontal && themesuport == 1  && btn_type == 'text'"
      :color="$attrs.hasOwnProperty('color') ? $attrs['color'] :'secondary'"
      class="black--text"
      v-bind="$attrs"
      depressed
      :dark="isdark"
      x-small
      style="height: 100% !important"
      @click="OnClick"
    >
      <span>{{ btn_text ? btn_text : $t(icon_type) }}</span>
    </v-btn>

    <v-tooltip bottom v-if="themesuport == 1 && btn_type == 'icon'">
      <template v-slot:activator="{ on }">
        <v-btn
          v-on="on"
          depressed
          icon
          tile
          text
          class="h-100 w-100"
          style="height: 100% !important; width: 100% !important;  padding: 0px im !important;"
          @click="OnClick"
        >
          <BaseIcon
            v-bind="$attrs"
            icon_size
            :icon_type="icon_type"
            :themesuport="themesuport"
            :icon_color="icon_color ? icon_color : text_color"
          />
        </v-btn>
      </template>
      <span>{{ btn_text ? btn_text : $t(icon_type) }}</span>
    </v-tooltip>

    <v-tooltip bottom v-if="themesuport == 2">
      <template v-slot:activator="{ on }">
        <BaseIcon
          v-on="on"
          v-bind="$attrs"
          :icon_type="icon_type"
          :icon_size="true"
          :themesuport="themesuport"
          @click="OnClick"
        />

        <!-- <v-btn
          depressed
          icon
          color="secondary"
          class="black--text"
          v-on="on"
          @click="OnClick"
          style="height: 100% !important"
        >
          <BaseIcon v-bind="$attrs" :icon_type="icon_type" :icon_size="true" />
        </v-btn> -->
      </template>
      <span>{{ btn_text ? btn_text : $t(icon_type) }}</span>
    </v-tooltip>
  </div>
</template>

<script>
import BaseIcon from "@/components/control/BaseIcon";

const Orientation = Object.freeze({
  vertical: 1,
  horizontal: 2,
});

export default {
  name: "base-button-view",
  props: {
    //btn_type: null ⇔ default || icon || text
    btn_type: {
      type: String,
      default: null,
    },
    icon_type: {
      type: String,
      default: "blank",
    },
    btn_text: {
      type: String,
    },
    text_color: {
      type: String,
      default: null,
    },
    icon_color: {
      type: String,
      default: null,
    },

    orientation: {
      validator: function (value) {
        return ["vertical", "horizontal"].indexOf(value) !== -1;
      },
    },
  },

  data() {
    return {
      Orientation,
      orientationval: Orientation.horizontal,
      themesuport: 1,
      icon_src: null,
    };
  },
  mounted() {
    this._processOrientation(this.orientation);
    this._processTheme();
  },
  computed: {
    isdark() {
      if (this.$attrs.hasOwnProperty("dark")) {
        return true;
      }
      return false;
    },
  },
  components: {
    BaseIcon, 
  },
  watch: {
    orientation(val) {
      this._processOrientation(val);
    },
  },

  methods: {
    _processOrientation(val) {
      if (val === "vertical") {
        this.orientationval = this.Orientation.vertical;
      } else if (val === "horizontal") {
        this.orientationval = this.Orientation.horizontal;
      } else {
        this.selectMode = this.Orientation.horizontal;
      }
    },
    OnClick() {
      if (!this.$attrs.disabled) {
        this.$emit("onclick");
      }
    },

    _processTheme() {
      if (this.$attrs.hasOwnProperty("onlyIcon")) {
        this.themesuport = 0;
      } else {
        try {
          if (this.curTheme > 0) {
            this.themesuport = this.curTheme;
          } else {
            this.themesuport = 1;
          }
        } catch (error) {
          this.themesuport = 1;
        }

        // test theme
        // this.themesuport = 2;

        // if (this.themesuport == 2) {
        // }
      }
    },
  },
};
</script>

<style scoped>
.button-view {
  margin: 0px 3px;
  padding: 2px;
}
</style>
