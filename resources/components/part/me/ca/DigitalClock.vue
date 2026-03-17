<template>
  <div id="clock" class="d-flex flex-column align-start justify-center" :style="`font-size: ${size}rem`">
    <span :class="`${textColor}--text font-weight-bold`" >{{$t('date')}}: {{ date }} | {{$t('time')}}: {{ time }}</span>
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
      default: "black"
    },
    size: {
      type: String,
      default: 1.5
    }
  },

  data: () => ({
    date: "",
    time: "",
    interval: null,
  }),

  created() {
    this.updateTime();
    this.interval = setInterval(this.updateTime, 1000)
  },

  beforeDestroy() {
    clearInterval(this.interval)
  },

  computed: {},

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
</style>
