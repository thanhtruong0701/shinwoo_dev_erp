<template>
  <div class="example">
    <apexcharts
      :type="type"
      :height="height"
      :options="chartOptions"
      :series="series"
    ></apexcharts>
  </div>
</template>

<script>
import VueApexCharts from "vue-apexcharts";

export default {
  name: "Chart",
  props: {
    type: String,
    height: String,
    chartOptions: Object,
    series: Object,
  },

  components: {
    apexcharts: VueApexCharts,
  },
  
  data: function () {
    return {
      series: [
        // George Washington
        // {
        //   name: "George Washington",
        //   data: [
        //     {
        //       x: "President",
        //       y: [
        //         new Date(1789, 3, 30).getTime(),
        //         new Date(1797, 2, 4).getTime(),
        //       ],
        //     },
        //   ],
        // },
      
      ],
      chartOptions: {
        // chart: {
        //   height: 350,
        //   type: "rangeBar",
        // },
        // plotOptions: {
        //   bar: {
        //     horizontal: true,
        //     barHeight: "50%",
        //     rangeBarGroupRows: true,
        //   },
        // },
        // colors: [
        //   "#008FFB",
        //   "#00E396",
        //   "#FEB019",
        //   "#FF4560",
        //   "#775DD0",
        //   "#3F51B5",
        //   "#546E7A",
        //   "#D4526E",
        //   "#8D5B4C",
        //   "#F86624",
        //   "#D7263D",
        //   "#1B998B",
        //   "#2E294E",
        //   "#F46036",
        //   "#E2C044",
        // ],
        // fill: {
        //   type: "solid",
        // },
        // xaxis: {
        //   type: "datetime",
        // },
        // legend: {
        //   position: "right",
        // },
        // tooltip: {
        //   custom: function (opts) {
        //     console.log(opts)
        //     const fromYear = new Date(opts.y1).getFullYear();
        //     const toYear = new Date(opts.y2).getFullYear();
        //     const values = opts.ctx.rangeBar.getTooltipValues(opts);

        //     return "";
        //   },
        // },
      },
    };
  },
};
</script>
