<template>
  <v-sheet id="time-counter" class="d-flex align-center justify-center">
    <span class="font-weight-600 font-weight-bold" :class="`${color}--text`">
      {{ time }}
    </span>
  </v-sheet>
</template>

<script>
import moment from "moment";
export default {
  name: "time-counter",

  props: {
    color: {
      type: String,
      default: "red"
    }
  },
  data: () => ({
    time: "",
    interval: null,
  }),

  created() {
    this.interval = this.updateTime();
  },

  beforeDestroy() {
    clearInterval(this.interval);
  },

  methods: {
    updateTime() {
      var startTimestamp = moment().startOf("day");
      setInterval(() => {
        startTimestamp.add(1, "second");
        this.time = startTimestamp.format("HH:mm:ss");
      }, 1000);
    },
  },
};
</script>
