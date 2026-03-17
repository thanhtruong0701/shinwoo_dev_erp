<template>
  <v-container fluid class="py-1">
    <v-row dense align="center" justify="space-between">
      <v-col lg="4" cols="12" v-if="displayActions">
        <v-sheet tile color="transparent" class="d-flex justify-start align-center" width="100%">
          <v-btn outlined small color="info" @click="$emit('onResetZoom')">Reset zoom</v-btn>
          <div class="mr-2"></div>
          <v-btn outlined small color="info" @click="$emit('onDisplayPoint')">Display point</v-btn>
          <div class="mr-2"></div>
          <v-btn outlined small color="info" @click="legendDisplay = !legendDisplay">Legend toogle</v-btn>
        </v-sheet>
      </v-col>
      <v-col cols="12">
        <LineChartGenerator 
          ref="lineChart" 
          :id="`line-chart-id-${chartID}`" 
          :plugins="plugins" 
          :chartOptions="chartOptions" 
          :chartData="{...chartData}" 
          :style="`height: ${!displayActions ? (Math.floor(height-16)) : (_calculateHeight(height, 85))}px;`" 
        />
      </v-col>
    </v-row>    
  </v-container>
</template>

<script>
// import { Line as LineChartGenerator } from 'vue-chartjs'; // khi dev thì dùng cái này
import { Line as LineChartGenerator } from 'vue-chartjs/legacy'; // khi đưa lên production phải dùng cái này
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import zoomPlugin from "chartjs-plugin-zoom";
import annotationPlugin from 'chartjs-plugin-annotation';
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, zoomPlugin, annotationPlugin)
export default {
  name: "line-chart",

  components: { LineChartGenerator },

  props: {
    data: Object,
    options: Object,
    plugins: Array,
    // stacked: Boolean,
    height: [Number, String],
    title: String,
    legendPosition: {
      type: String,
      default: "top"
    },
    displayActions: {
      type: Boolean,
      default: false
    }
  },

  data: (vm) => ({
    legendDisplay: true,
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
        }
      },
      onClick: vm.clickHandler
    }
  }),

  computed: {
    chartID() {
      return this._uniqueID();
    },
    chartData() {
      return this.data;
    },
    /* additionOptions() {
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
    }, */
    chartOptions() {
      const legendDisplayOptions = {
        plugins: {
          legend: {
            display: this.legendDisplay,
            position: this.legendPosition
          }
        },
        ...this.options
      }
      return {
        ...this.defaultOptions,
        ...this.options,
        ...legendDisplayOptions
        // ...this.additionOptions,
      };
    },
  },

  methods: {
    clickHandler(event, points) {
      try {
        if(points.length) {
          const indexBar = points[0].index;        
          var chartLength = this.data.datasets.length;
          let pointObj = {};
          for (let i = 0; i < chartLength; i++) {          
            pointObj[this.chartData.datasets[i].label] = this.chartData.datasets[i].data[indexBar];
          }        
          this.$emit("onPointClick", pointObj);
        }
      } catch (error) {
        console.log("clickHandler-catch exception:", error.message);
      }
    },
    clearChart() {      
      return this.$refs.lineChart.chart.clear()
    }
  }
}
</script>