<template>
  <v-card :style="(border=='Y'?'border:5px solid red !important;':'border: 1px dashed black;')">
    <v-card-text style="background-color: #dfebdf" >
      <div
        style="
          font-weight: bold;
          font-size: 20px;
          color: black;
          text-align: center;
        "
      >
        {{ name }}
      </div>
    </v-card-text>
    <v-card-text>
      <div
        style="
          font-weight: bold;
          font-size: 20px;
          color: black;
          text-align: center;
        "
      >
        {{ title }}
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "label",
  props: {
    title: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      default: "",
    },
    border: {
      type: String,
      default: "",
    },
  },
  components: {},
  data: () => ({}),
  watch: {},
  mounted() {},
  computed: {},
  methods: {},
};
</script>
