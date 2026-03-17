<template>
  <DxChart
    :argumentAxis="{
      ...defaultAxisSettings,
      ...argumentAxisSettings
    }"
    :commonSeriesSettings="{...commonSeriesSettings}"
    :data-source="myDataSource"
    :id="id"
    :loadingIndicator="{
      enabled: true,
      show: isLoadingData,
      text: $t('is_loading')
    }"
    :legend="{
      font: {
        color: '#000',
        size: 14
      },
      visible: !isLoadingData,
      ...myLegendPosition,
      ...legendSettings
    }"
    :series="series"
    :size="size"
    :valueAxis="{
      ...defaultAxisSettings,
      ...valueAxisSettings
    }"
    :title="{
      font: {
        color: '#000',
      },
      text: title ? title : 'Chart Title'
    }"
  >
  </DxChart>
</template>

<script>
import { DxChart } from 'devextreme-vue/chart';
export default {
  name: "gw-chart",

  props: {
    argumentAxisSettings: Object,
    commonSeriesSettings: Object,
    dataSource: Array,
    id: String,
    legendPosition: String,
    legendSettings: Object,
    series: Array,
    size: Object,
    valueAxisSettings: Object,
    title: String
  },

  components: {
    DxChart
  },

  data:()=>({
    defaultAxisSettings: {
      label: {
        font: {
          color: "#000",
          size: 14
        }
      }
    },
  }),

  computed: {
    isLoadingData() {
      return !this.myDataSource.length ? true : false
    },
    myDataSource() {
      return this.dataSource
    },
    myLegendPosition() {
      switch (this.legendPosition) {
        case "topLeft":
          return {
            horizontalAlignment: "left",
            verticalAlignment: "top"
          };
        case "topCenter": 
          return {
            horizontalAlignment: "center",
            verticalAlignment: "top"
          };
        case "topRight" :
          return {
            horizontalAlignment: "right",
            verticalAlignment: "top"
          };
        case "bottomLeft":
          return {
            horizontalAlignment: "left",
            verticalAlignment: "bottom"
          };
        case "bottomCenter":
          return {
            horizontalAlignment: "center",
            verticalAlignment: "bottom"
          };
        case "bottomRight":
          return {
            horizontalAlignment: "right",
            verticalAlignment: "bottom"
          };
        default:
          return {
            horizontalAlignment: "right",
            verticalAlignment: "top"
          };
      }
    }
  }
}
</script>