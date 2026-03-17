<template>
  <div>
    <Pie ref="pieChart" :id="`pie-chart-id-${chartID}`" :chartOptions="chartOptions" :chartData="chartData" :style="`height: ${height}px;`" />
  </div>
</template>

<script>
import { Pie } from "vue-chartjs/legacy";
import { Chart, ArcElement, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";
/* import zoomPlugin from "chartjs-plugin-zoom";
import annotationPlugin from "chartjs-plugin-annotation"; */
Chart.register(ArcElement, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default {
  name: "pie-chart",
  components: { Pie },

  props: {
    data: Object,
    options: Object,
    height: [Number, String],
    title: String
  },

  data:(vm)=>({
    defaultOptions: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: vm.title ? true : false,
          text: vm.title ? vm.title : ""
        }
      }
    }
  }),

  mounted() {
    //console.log(this.$refs.pieChart)
  },

  computed: {
    chartID() {
      return this._uniqueID();
    },
    chartData() {
      return this.data;
    },
    additionOptions() {
      var options = {};
      /* if (this.stacked) {
        options = {
          ...options,
          scales: {
            x: { stacked: true },
            y: { stacked: true },
          },
        };
      } */
      return options;
    },
    chartOptions() {
      return {
        ...this.defaultOptions,
        ...this.options,
        //...this.additionOptions,
      };
    },
  },

  methods: {
    renderChart() {
      this.$refs.pieChart.renderChart();
    },
    updateChart() {
      this.$refs.pieChart.updateChart();
    }
  }
}
</script>