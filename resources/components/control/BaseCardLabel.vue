<template>
  <v-card v-bind="$attrs" outlined class="base-label pa-2 d-flex align-center justify-space-between" :style="`background: ${bg_color ? bg_color : null}`" @click="onclick">
    <div class="d-flex align-center justify-center w-100">
      <div class="base-label-left">
        <h4 class="base-label-title" :style="{color :  titleColor ? titleColor : '' }">{{ title }}</h4>
        <h6 class="base-label-description" :style="{color :  descriptionColor ? descriptionColor : '' }" x-small v-if="description != '' ">
          <i>{{ description }}</i>
        </h6>
      </div>
      <v-spacer></v-spacer>
      <span class="base-label-value" :style="{color :  valueColor ? valueColor : '' }">
        <b>{{ value }}</b>
        <slot name="append"></slot>
      </span>
    </div>
  </v-card>
</template>

<script>
import moment from "moment";
export default {
  name: "base-card-label",
  props: [
    "title",
    "bg_color",
    "description",
    "value",
    "titleColor",
    "descriptionColor",
    "valueColor",
  ],
  data: () => ({
    lastCellTimeCllick: null,
    constTimeDblClick: 300,
    cancelCellClick: false,
  }),

  methods: {
    onclick() {
      let nowClickTime = this._getTimeSpan();

      if (nowClickTime - this.lastCellTimeCllick < this.constTimeDblClick) {
        this.cancelCellClick = true;
        this.$emit("dbclick", this.value);
      } else {
        this.lastCellTimeCllick = this._getTimeSpan();
        this.cancelCellClick = false;

        window.setTimeout(this._onClick, this.constTimeDblClick);
      }

      //this.$emit("cellClick", e);
    },
    _onClick() {
      if (!this.cancelCellClick) {
        this.cancelCellClick = true;
        this.$emit("click", this.value);
      }
    },
    _getTimeSpan() {
      const today = new Date();
      return today.getTime();
    },
  },
};
</script>

<style scoped>
.base-label {
  min-height: 50px !important;
  width: 100% !important;
}

.base-label-content {
  font-size: 1rem !important;
  line-height: 1rem !important;
  height: 100% !important;
}

.base-label-left {
  height: 100% !important;
}

.base-label-title {
  font-weight: normal;
}

.base-label-description {
  font-weight: normal;
}

.base-label-value {
  font-weight: normal;
  max-width: 40% !important;
}
</style>
