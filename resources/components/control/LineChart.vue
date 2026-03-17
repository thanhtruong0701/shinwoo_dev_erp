<template>
  <v-container fluid dense :height="height">
    <v-row class="dflex justify-start align-center">
      <v-col cols="4" class="dflex justify-start align-center py-0">
        <!-- <BaseButton
          :btn_text="$t('reset_zoom')"
          @onclick="resetZoom"
        /> -->
        <v-btn outlined small color="info" @click="resetZoom">
          {{ $t("reset_zoom") }}
        </v-btn>
        <v-btn outlined small color="info" @click="displayPoint">
          {{ $t("display_point") }}
        </v-btn>
        <v-btn outlined small color="info" @click="displayLegend">
          {{ $t("legend_toggle") }}
        </v-btn>
      </v-col>
      <v-col cols="1" class="py-0">
        <!-- <BaseButton
          :btn_text="$t('display_point')"
          @onclick="displayPoint"
        /> -->
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="py-0 px-0">
        <LineChartGenerator
          :chart-options="chartOptions"
          :chart-data="chartData"
          :chart-id="chartId"
          :height="height - 30"
          :dataset-id-key="datasetIdKey"
          :plugins="plugins"
          :css-classes="cssClasses"
          :styles="styles"
          ref="linechart234"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { Line as LineChartGenerator } from "vue-chartjs/legacy";
import {
  Chart,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement,
  Filler,
  TimeScale,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import annotationPlugin from "chartjs-plugin-annotation";
Chart.register(
  Title,
  Tooltip,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement,
  TimeScale,
  zoomPlugin,
  annotationPlugin
);

export default {
  name: "LineChart",
  components: {
    LineChartGenerator,
  },
  props: {
    chartId: {
      type: String,
      default: "line-chart",
    },
    datasetIdKey: {
      type: String,
      default: "label",
    },
    width: {
      type: Number,
      default: 400,
    },
    height: {
      type: Number,
      default: 400,
    },
    cssClasses: {
      default: "",
      type: String,
    },
    styles: {
      type: Object,
      default: () => {},
    },
    plugins: {
      type: Array,
      default: () => [],
    },
    data: {
      type: Object,
      default: {},
    },
    legendDisplay: {
      type: Boolean,
      default: true,
    },
    legendPos: {
      type: String,
      default: "top",
    },
    titleDisplay: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      parentLayoutHeight: 0,
      childrenLayoutHeight: 0,
      chartData: {
        labels: [],
        datasets: [],
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
      },
    };
  },
  watch: {
    data() {
      //console.log(this.$data)
      this.chartData.labels = this.data.labels;
      this.chartData.datasets = this.data.datasets;
      this.chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: this.titleDisplay,
            text: this.data.title,
          },
          annotation:
            this.data.annotation != undefined ? this.data.annotation : {},
          zoom: {
            limits: {
              x: { min: 0 },
              y: { min: this.data.min, max: this.data.max },
            },
            zoom: {
              wheel: {
                enabled: true,
              },
              pinch: {
                enabled: true,
              },
              mode: "xy",
            },
            pan: {
              enabled: true,
              mode: "xy",
            },
          },

          legend: {
            labels: {
              // usePointStyle: true,
            },
            display: this.legendDisplay,
            position: this.legendPos,
          },
          // corsair: {
          //   dash: [2, 2],
          //   color: "red",
          //   width: 3,
          // },
        },
        onClick: this.ClickHandler,
        title: {
          display: true,
          text: this.data.title,
        },
        interaction: {
          intersect: false,
          mode: "index",
        },
        legend: {
          display: this.legendDisplay,
          position: this.legendPos,
        },

        // scales: {
        //   x: this.data.xAxes[0] ,
        //   y: this.data.yAxes ? this.data.yAxes : {},
        // },
        scales: this.data.scales,
        tooltips: {
          mode: "index",
          callbacks: this.data.labelsFunc ? this.data.labelsFunc : {},
          pan: {
            enabled: true,
          },
          zoom: {
            enabled: true,
          },
          responsive: true,
        },
      };
    },
  },

  methods: {
    displayLegend() {
      this.legendDisplay = !this.legendDisplay;
      let fake = this.data;
      this.data = [];
      this.data = fake;
    },
    resetZoom() {
      this.$emit("chartResetZoom");
    },
    displayPoint() {
      this.$emit("chartDisplayPoint");
    },
    ClickHandler: function (event, points) {
      //const c = this._data._chart;

      //const datapoint = c.getElementAtEvent(event)[0];
      const indexBar = points[0].index;
      //  const indexSegment = datapoint._datasetIndex;
      var chartLength = this.data.datasets.length;
      let pointObj = {};
      //
      for (let i = 0; i < chartLength; i++) {
        pointObj["date_input"] = this.data.labels[indexBar];
        pointObj[this.data.datasets[i].label] =
          this.data.datasets[i].data[indexBar];
      }
      // console.log(pointObj)
      this.$emit("chartPointClick", pointObj);
      // }
    },
    generateCanvas() {
      const canvas = document.getElementById(this.chartId);
      return canvas ? canvas : null;
    },
  },
};
</script>
