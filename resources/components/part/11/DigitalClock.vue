<template>
  <div id="clock" class="d-flex flex-column align-start justify-center" :style="`font-size: ${fontSize}rem`">
    <span :class="`${textColor}--text font-weight-bold`" >Date: {{ date }}</span>
    <span :class="`${textColor}--text font-weight-bold`">Time: {{ time }}</span>
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "digital-clock",

  props: {
    label: String,
    textColor: {
      type: String,
      default: "white"
    },
    size: {
      type: String,
      default: "small"
    }
  },

  data: () => ({
    date: "",
    time: "",
    interval: null,
  }),

  created() {
    this.interval = setInterval(this.updateTime, 1000)
  },

  beforeDestroy() {
    clearInterval(this.interval)
  },

  computed: {
    fontSize() {
      switch (this.size) {
        case "large":
          return 3;
        case "medium":
          return 1.5;
        case "small":
          return 1.25;
        case "x-small":
          return 1;
        default:
          return 1.25;
      }
    }
  },

  methods: {
    updateTime() {
      this.date = moment().format(this.curLang.DATE_FORMAT.toUpperCase())
      this.time = moment().format(this.curLang.TIME_FORMAT)
    }
  }
};
</script>

<style lang="scss" scoped>
p {
  margin: 0;
  padding: 0;
}
/* #clock {
  font-family: "Share Tech Mono", monospace !important;
} */
</style>
