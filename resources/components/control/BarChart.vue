<template>
  <div>
    <Bar ref="barChart" :id="`bar-chart-id-${chartID}`" :chartOptions="chartOptions" :chartData="{...chartData}" :style="`height: ${height}px;`" />
  </div>
</template>

<script>
// import { Bar as BarDev } from "vue-chartjs";
import { Bar } from "vue-chartjs/legacy";
import { Chart, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, LineController, LineElement, PointElement } from "chart.js";
/* import zoomPlugin from "chartjs-plugin-zoom";
import annotationPlugin from "chartjs-plugin-annotation"; */
Chart.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, LineController, LineElement, PointElement);
export default {
  name: "bar-chart",
  components: { Bar },

  props: {
    data: Object,
    options: Object,
    stacked: Boolean,
    height: [Number, String],
    title: String
  },

  data: (vm) => ({
    // componentName: process.env.NODE_ENV === 'development' ? 'BarDev' : 'Bar',
    defaultOptions: {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: 1
      },
      plugins: {
        zoom: {
          limits: {
            x: { min: 0 },
            y: { min: 0 },
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
          title: {
            display: vm.title ? true : false,
            text: vm.title ? vm.title : ""
          }
        },
      }      
    }
  }),

  /* mounted() {
    console.log(this.chartOptions)
  }, */

  computed: {
    chartID() {
      return this._uniqueID();
    },
    chartData() {
      return this.data;
    },
    additionOptions() {
      var options = {};
      if (this.stacked) {
        options = {
          ...options,
          scales: {
            x: { stacked: true },
            y: { stacked: true },
          },
        };
      }
      return options;
    },
    chartOptions() {
      return {
        ...this.defaultOptions,
        ...this.options,
        ...this.additionOptions,
      };
    },
  },

  methods: {
    /* resetZoom() {      
      this.$refs.barChart.chart.resetZoom();
    } */
  }
};
</script>
