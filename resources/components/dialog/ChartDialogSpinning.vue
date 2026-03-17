<template>
  <v-dialog id="chart-dialog" max-width="1800" v-model="dialogIsShow">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ $t("chart") }}</span>
        <v-spacer></v-spacer>
        <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
      </v-card-title>
      <v-container fluid>
        <v-row no-gutters>
          <v-col cols="12">
            <!-- Search Panel -->
            <v-row dense>
              <v-col lg="1" cols="12">
                <BaseSelect disabled item-value="id" item-text="value" :label="$t('position')" :lstData="positionList" v-model="selectedPosition" />
              </v-col>
              <v-col lg="1" cols="12">
                <BaseSelect item-text="NAME" item-value="CODE" :disabled="isLoading" :label="$t('period')" :lstData="periodList" v-model="selectedPeriod" />
              </v-col>
              <v-col lg="3" cols="12">
                <GwFlexBox align="center" justify="space-between">
                  <v-sheet width="25%">
                    <BaseInput :disabled="isLoading" :label="$t('step_size')" v-model="chartStepSize"></BaseInput>
                  </v-sheet>
                  <v-spacer></v-spacer>
                  <v-sheet width="25%">
                    <BaseInput number :disabled="isLoading" :label="$t('min_chart_value')" v-model="stepValues.min"></BaseInput>
                  </v-sheet>
                  <v-spacer></v-spacer>
                  <v-sheet width="25%">
                    <BaseInput number :disabled="isLoading" :label="$t('max_chart_value')" v-model="stepValues.max"></BaseInput>
                  </v-sheet>
                  <v-spacer></v-spacer>
                  <v-sheet width="10%">
                    <BaseButton btn_type="icon" icon_type="reset" :disabled="isLoading" @onclick="resetStepSize" />
                  </v-sheet>
                </GwFlexBox>
              </v-col>

              <v-col lg="1" cols="12">
                <BaseSelect item-text="NAME" item-value="CODE" :disabled="isLoading" :label="$t('xaxis')" :lstData="xAxisList" v-model="selectedXAxis" />
              </v-col>
              <v-col lg="2" cols="12" class="d-flex justify-end align-center flex-wrap">
                <v-sheet width="40%" class="mr-2">
                  <span>{{ $t("standard_time") }}</span>
                </v-sheet>                
                <v-sheet width="55%">
                  <DxDateBox
                    type="datetime"
                    display-format="MM/dd/yyyy HH:mm"
                    v-model="standardTime"
                    :label="$t('standard_time')"
                    :placeholder="$t('standard_time')"
                    :hint="$t('standard_time')"
                    @valueChanged="changedStandardTime"
                  />
                </v-sheet>
              </v-col>
              <v-col lg="3" cols="12">
                <v-sheet tile color="transparent" class="d-flex justify-between align-center" width="100%" height="100%">
                  <v-btn icon tile color="success" :disabled="isLoading" @click="minusPeriod">
                    <v-icon>mdi-skip-previous</v-icon>
                  </v-btn>
                  <DxDateBox
                    dense
                    type="datetime"
                    :readOnly="true"
                    display-format="MM/dd/yyyy HH:mm"
                    v-model="dateFrom.value"
                    :label="$t('date_from')"
                    :placeholder="$t('date_from')"
                    :hint="$t('date_from')"
                    @valueChanged="changedFromDate"
                    class="mx-2"
                  />
                  <DxDateBox
                    type="datetime"
                    :readOnly="true"
                    display-format="MM/dd/yyyy HH:mm"
                    v-model="dateTo.value"
                    :label="$t('date_to')"
                    :placeholder="$t('date_to')"
                    :hint="$t('date_to')"
                    @valueChanged="changedToDate"
                    class="mx-2"
                  />                  
                  <v-btn icon tile color="success" :disabled="isLoading" @click="addPeriod">
                    <v-icon>mdi-skip-next</v-icon>
                  </v-btn>
                </v-sheet>
              </v-col>
              <v-col lg="1" cols="12">
                <v-sheet tile color="transparent" class="d-flex justify-between align-center" width="100%" height="100%">
                  <BaseButton btn_type="icon" icon_type="search" :btn_text="$t('search')" :disabled="isLoading" @onclick="onSearch" />
                </v-sheet>
              </v-col>
              <v-col cols="3">
                <v-card outlined :height="chartContainerHeight" class="overflow-x-overlay">
                  <GwTreeView
                    ref="treeView"
                    :items="treeList"
                    keyValue="id"
                    keyDisplay="name"
                    height="100%"
                    selectionMode="multiple"
                    checkBoxesMode="selectAll"
                    itemsExpr="children"
                    @onSelectionChanged="onSelectionChanged"
                  />
                </v-card>
              </v-col>
              <v-col cols="9">
                <v-card outlined tile :height="chartContainerHeight">
                  <v-row dense align="center" justify="center" class="fill-height">
                    <v-col cols="12" class="text-center" v-if="isLoading">
                      <v-progress-circular indeterminate color="primary"></v-progress-circular>
                    </v-col>
                    <v-col cols="12" v-else>                      
                      <LineChart 
                        ref="lineChart"
                        legendPosition="right"
                        :options="chartOptions"
                        :data="chartData"
                        :height="chartContainerHeight"
                        :displayActions="true"
                        @onResetZoom="onResetZoom"
                        @onDisplayPoint="onDisplayPoint"
                        @onPointClick="onPointClick"                        
                      />                      
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
              <v-col cols="12">
                <BaseGridView
                  ref="grdDetailTags"
                  :header="grdDetailHeader"
                  sel_procedure=""
                  :multiselect="true"
                  :headertype="1"
                  :filter_paras="[]"
                  :height="gridHeight"
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import moment from "moment";
import "chartjs-adapter-date-fns";
import { vi } from "date-fns/locale";
const findValueDeep = require('deepdash/findValueDeep');

export default {
  name: "ChartDialogSpinning",
  components: {
    LineChart: () => import("@/components/control/LineChartV2")
  },

  props: {
    treeList: Array,
    position: [Number, String],
    tag: String,
    dataGroup: Number,
    tableName: String,
    machine: String
  },

  data:()=>({
    dialogIsShow: false,
    positionList: [
      { id: 11, value: "#11" },
      { id: 12, value: "#12" },
      { id: 13, value: "#13" },
      { id: 14, value: "#14" },
      { id: 15, value: "#15" },
      { id: 16, value: "#16" },
      { id: 17, value: "#17" },
      { id: 18, value: "#18" },
      { id: 19, value: "#19" },
    ],
    selectedPosition: "",
    periodList: [
      { CODE: "1", NAME: "1 hour" },
      { CODE: "8", NAME: "8 hours" },
      { CODE: "24", NAME: "24 hours" },
      { CODE: "48", NAME: "48 hours" },
      { CODE: "72", NAME: "72 hours" },
      { CODE: "720", NAME: "30 days" }
    ],
    selectedPeriod: "1",
    chartStepSize: "",
    stepValues: {
      min: null,
      max: null
    },
    xAxisList: [
      { CODE: "minute", NAME: "Minutes" },
      { CODE: "hour", NAME: "Hours" },
      { CODE: "day", NAME: "Days" },
      { CODE: "month", NAME: "Months" }
    ],
    selectedXAxis: "minute",
    standardTime: new Date(),
    dateFrom: {
      value: "",
      formatValue: ""
    },
    dateTo: {
      value: "",
      formatValue: ""
    },
    selection: [],
    tagsName: "",
    point: false,
    dynamicHeader: [],
    chartData: {
      labels: [],
      datasets: []
    },
    tempData: [],
    isLoading: false,
    pageSize: 0
    
  }),
  mounted() {
    this.setDate();
  },
  computed: {
    chartContainerHeight() {
      return this._calculateHeight(this.formContainerHeight, 65);
    },
    gridHeight() {
      return Math.floor(this._calculateHeight(this.chartContainerHeight, 30) - 16);
    },
    chartOptions() {
      return {
        labelsFunc: {
          label: function (tooltipItem, chart) {
            var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || "";
            return (datasetLabel + " : " + parseInt(tooltipItem.value).toLocaleString());
          }
        },
        title: "",
        scales: {
          x: {
            /* type: "time",
            time: {
              tooltipFormat: "dd-MM-yyyy HH:mm:ss",
              unit: this.selectedXAxis,
              displayFormats: {
                millisecond: "MM-YYYY",
                second: "dd-MM-yyyy HH:mm:ss",
                minute: "dd-MM-yyyy HH:mm",
                hour: "dd-MM-yyyy HH",
                day: "dd-MM-yyyy",
                week: "MM-YYYY",
                month: "MM-yyyy",
                quarter: "MM-YYYY",
                year: "yyyy"
              },
            },
            adapters: {
              date: {
                locale: vi
              },
            }, */
          },
          y: {
            title: {
              display: false
            },
            position: "left",
            type: "linear",
            scaleLabel: {
              display: true,
              labelString: "",
              beginAtZero: true,
            },
            ticks: {
              stepSize: this.chartStepSize,
              callback: function (value, index, values) {
                return value.toLocaleString();
              }
            },
            min: this.stepValues.min ? this.stepValues.min : null,
            max: this.stepValues.max ? this.stepValues.max : null
          }
        }
      }
    },
    grdDetailHeader() {
      return this.dynamicHeader;
    }
  },
  watch: {
    async dialogIsShow(val) {
      if(val) {
        // console.log("treeList:", this.treeList);
        // console.log("tag:", this.tag);
        this.dynamicHeader = [];
        await this.$nextTick();
        this.$refs.treeView.unselectAll();
        this.setSelection()
        await this.$nextTick();
        await this.onSearch();
      }
    },
    position(val) {
      this.selectedPosition = parseFloat(val);
    },
    selectedPeriod(val) {
      this.dateTo.value = moment(this.standardTime).subtract(parseInt(val), "hours").toDate();
    },
    standardTime(val) {
      this.dateFrom.value = moment(val).subtract(parseInt(this.selectedPeriod), "hours").toDate();
      this.changedFromDate(val);      
      this.dateTo.value = moment(val).subtract(0, "hours").toDate();
      this.changedToDate(this.dateTo.value);
    }
  },
  methods: {
    resetStepSize() {
      this.chartStepSize = "";
      this.stepValues = { min: null, max: null };
    },
    setDate() {
      this.dateFrom.value = moment(this.standardTime).subtract(parseInt(this.selectedPeriod), "hours").toDate();
      this.changedFromDate(this.dateFrom.value);
      this.dateTo.value = moment(this.standardTime).subtract(0, "hours").toDate();
      this.changedToDate(this.dateTo.value);
    },
    changedStandardTime(obj) {
      // console.log("changedStandardTime:", obj);
      let standardtime = "";
      if (obj.value == undefined) {
        standardtime = moment(obj).format("YYYYMMDDHHmmss");
      } else {
        standardtime = moment(obj.value).format("YYYYMMDDHHmmss");
      }
    },
    changedFromDate(obj) {
      // console.log("changedFromDate:", obj);
      let date_from = "";
      if (obj.value == undefined) {
        date_from = moment(obj).format("YYYYMMDDHHmmss");
      } else {
        date_from = moment(obj.value).format("YYYYMMDDHHmmss");
      }
      this.dateFrom.formatValue = date_from;
      // console.log(this.dateFrom);
    },
    changedToDate(obj) {
      // console.log("changedToDate:", obj);
      let date_to = "";
      if (obj.value == undefined) {
        date_to = moment(obj).format("YYYYMMDDHHmmss");
      } else {
        date_to = moment(obj.value).format("YYYYMMDDHHmmss");
      }
      this.dateTo.formatValue = date_to;
      // console.log(this.dateTo);
    },
    addPeriod() {
      this.dateTo.value = moment(this.dateTo.value).add(parseInt(this.selectedPeriod), "hours").toDate();
    },
    minusPeriod() {
      this.dateTo.value = moment(this.dateTo.value).subtract(parseInt(this.selectedPeriod), "hours").toDate();
    },
    onSelectionChanged(datas) {
      // console.log("onSelectionChanged!");
      this.selection = datas.filter(x => x.field).map(item => ({
        ...item,
        group: this.getGroupItem(item.table, item.field)
      }));
      // console.log("selection:", this.selection);
      this.tagsName = this.findKeyInNestedArray(this.selection, "field");
      // console.log("tagsName:", this.tagsName)
    },
    getGroupItem(tableName, value) {
      if(tableName === "POP_SMU_EVENT_ROLL" || tableName === "POP_SMU_EVENT_HEATER") {
        if(value.includes("R1_") || value.includes("R2_") || value.includes("HT1_") || value.includes("HT2_")) {
          return 1;
        } else if(value.includes("R3_") || value.includes("R4_") || value.includes("HT3_") || value.includes("HT4_")) {
          return 2;
        } else if(value.includes("R5_") || value.includes("R6_") || value.includes("HT5_") || value.includes("HT6_")) {
          return 3;
        } else if(value.includes("R7_") || value.includes("R8_") || value.includes("HT7_") || value.includes("HT8_")) {
          return 4;
        } else if(value.includes("R9_") || value.includes("R10_") || value.includes("HT9_") || value.includes("HT10_")) {
          return 5
        } else if(value.includes("R11_") || value.includes("R12_")) {
          return 6;
        }
      }
    },
    getProcedureName(tableName) {
      switch (tableName) {
        case "POP_SMU_EVENT":
          return "mes_sel_meyn110_select_spinning_mnhistory_winder"
        case "POP_SMU_DOFFINFO":
          return "mes_sel_meyn110_select_spinning_mnhistory_throughput";
        case "POP_SMU_YBMSPARAM":
          return "mes_sel_meyn110_select_spinning_mnhistory_wd_speed";
        case "POP_SMU_EVENT_ROLL":
          return "mes_sel_meyn110_select_spinning_mnhistory_gr_speed";
        case "POP_SMU_EVENT_HEATER":
          return "mes_sel_meyn110_select_spinning_mnhistory_gr_temp";
        default:
          return "";          
      }
    },
    findKeyInNestedArray(array, key, childrenKey) {
      let rtnArr = [];
      for (const item of array) {
        if (Object.keys(item).includes(key)) {
          if(item[key] !== "N/A") {
            rtnArr.push({
              value: item[key],
              group: item.group
            })
          }          
        }
        if (item[childrenKey]) {
          const result = findKeyInNestedArray(item[childrenKey], key);
          if (result) {
            if(item[key] !== "N/A") {
              rtnArr.push({
                value: item[key],
                group: item.group
              })
            }
          }
        }
      }
      return rtnArr;
    },
    async onSearch() {
      try {
        if(!this.selection.length) {
          this.showNotification("warning", this.$t("please_select_a_tree_node"), '');
          return;
        }
        await this.getPageSize();
        if(this.dataGroup === 1) {
          await this.getData();
        } else {
          await this.getData2()
        }
        this.$refs.grdDetailTags.Clear();
        this.dynamicHeader = [];
      } catch (error) {
        console.log("onSearch-catch exeption:", error.message);
      }
    },
    async getPageSize() {
      try {        
        const result = await this._callProcedure("mes_sel_meyn110_select_spinning_mnhistory_v2", [this.dateFrom.formatValue, this.dateTo.formatValue]);
        if(result) {
          this.pageSize = result[0]["page_count"];
        }
      } catch (error) {
        console.log("getPageSize-catch exception:", error.message);
      }      
    },
    async getData() {
      try {
        this.isLoading = true;
        // console.log("getData!");
        const result = await this._callProcedure("mes_sel_meyn110_select_spinning_mnhistory2_v2", [0, this.pageSize, this.tagsName.map(item => (item.value)).toString(), this.dateFrom.formatValue, this.dateTo.formatValue]);
        // console.log("result:", result);
        if(result.length) {
          const sortResult = result.sort((a,b) => a.DATETIME - b.DATETIME);
          await this.$nextTick();
          await this.onDrawChart(sortResult);
          this.tempData = [...sortResult];
        } else {
          this.showNotification("warning", this.$t("no_data_found"), '');
          this.$refs.lineChart.clearChart();
          this.tempData = []
        }
      } catch (error) {
        this.$refs.lineChart.clearChart();
        this.tempData = [];
        console.log("getData-catch exception:", error.message);
      } finally {
        this.isLoading = false;
      }
    },
    async getData2() {
      try {
        // console.log("getData2!");
        this.isLoading = true;
        const procedureName = this.getProcedureName(this.tableName);        
        if(procedureName.includes("gr")) {
          // console.log("group!");
          const group = this._groupByArray(this.tagsName, "group");          
          let promises = [];
          if(group.length) {
            promises = group.map(async (item) => {
              const [tagNames, posNumCopType] = this.getTagsPosNum(item);
              return await this._callProcedure(procedureName, [0, this.pageSize, this.machine.substring(1), tagNames.toString(), posNumCopType.toString(), this.dateFrom.formatValue, this.dateTo.formatValue ]);
            });
            await Promise.all(promises).then(async (result) => {
              // console.log("result:", result)
              if(result.length) {
                await this.$nextTick();
                await this.onDrawChart2(result);
                this.tempData = [...result];
              } else {
                this.showNotification("warning", this.$t("no_data_found"), '');
                this.$refs.lineChart.clearChart();
                this.tempData = []
              }
            });
          }
        } else {
          // console.log("no group!");
          const tagNamesStr = this.tagsName.map(x => (x.value)).toString();
          const result = await this._callProcedure(procedureName, [0, this.pageSize, this.machine.substring(1), tagNamesStr, this.dateFrom.formatValue, this.dateTo.formatValue ]);
          // console.log("result:", result);          
          if(result.length) {
            await this.$nextTick();      
            await this.onDrawChart(result);
            this.tempData = [...result];
          } else {
            this.showNotification("warning", this.$t("no_data_found"), '');
            this.$refs.lineChart.clearChart();
            this.tempData = []
          }
        }
      } catch (error) {
        this.isLoading = false;
        this.$refs.lineChart.clearChart();
        this.tempData = [];
        console.log("getData-catch exception:", error.message);        
      } finally {
        this.isLoading = false;
      }
    },
    getTagsPosNum(values) {
      try {
        const tagNames = [];
        const posNumCopType = [];
        values.forEach(item => {
          const [tag, posCop] = item.value.split('-');
          tagNames.push(tag);
          posNumCopType.push(posCop);
        });
        return [[...new Set(tagNames)], [...new Set(posNumCopType)]]  
      } catch (error) {
        console.log("getTagsPosNum-catch exception:", error.message);        
      }
    },
    async onResetZoom() {
      await this.$nextTick();
      const procedureName = this.getProcedureName(this.tableName);        
      if(procedureName.includes("gr")) {
        await this.onDrawChart2(this.tempData)
      } else {
        await this.onDrawChart(this.tempData)
      }      
    },
    async onDisplayPoint() {
      this.point = !this.point;
      await this.$nextTick();
      const procedureName = this.getProcedureName(this.tableName);        
      if(procedureName && procedureName.includes("gr")) {
        await this.onDrawChart2(this.tempData)
      } else {
        await this.onDrawChart(this.tempData)
      }
    },
    onPointClick(point) {
      // point.date_input = moment(new Date(point.date_input)).format("YYYY-MM-DD HH:mm");
      if (this.dynamicHeader.length <= 0) {
        for (var key in point) {
          if (point.hasOwnProperty(key)) {
            this.dynamicHeader.push({
              field: key,
              width: 200,
              title: key,
              alignment: "center",
            });
          }
        }
        setTimeout(() => {
          this.$refs.grdDetailTags.addRow(point);
        }, 1000);
      }
      // console.log(point)
      this.$refs.grdDetailTags.addRow(point);
    },
    async onDrawChart(data) {
      try {
        // console.log("onDrawChart!", data);
        let labels = [];
        let datasets = [];
        data.forEach(item => {
          const dateTime = moment(item.DATETIME, "YYYYMMDDHHmmss").format(`YYYY/MM/DD ${this.curLang.TIME_FORMAT}`);
          labels.push(dateTime)          
        });
        this.selection.forEach(x => {
          // console.log("x:", x);
          if(x.leaf === 0) {
            let color = "red";            
            datasets.push({
              label: x.name,
              data: [],
              backgroundColor: "transparent",
              borderColor: color,
              borderWidth: 1,
              borderDash: [5, 5],
              pointHoverRadius: 3,
              yAxisID: "y",
              pointRadius: 1,
              fill: false
            });            
            this.chartData.datasets = [...datasets];
          } else {
            let color = this._randomRGB();
            let colorTrans = "transparent";
            datasets.push({
              label: x.parent_name ? `${x.parent_name} - ${x.name} (${x.uom})` : `${x.name} (${x.uom})`,
              data: this.getTagData(labels, data, x.field),
              backgroundColor: color,
              borderColor: color,
              pointBackgroundColor: this.point ? color : colorTrans,
              pointBorderColor: this.point ? color : colorTrans,
              borderWidth: 1,
              //borderDash: [5, 5],
              pointHoverRadius: 3,
              pointHoverBackgroundColor: color,
              yAxisID: "y",
              pointRadius: 1,
              fill: false,
            });
            this.chartData.labels = [...labels];
            this.chartData.datasets = [...datasets];
          }
        });
        this.chartData.labels = [...labels];        
        this.chartData.datasets = [...datasets];
      } catch (error) {
        console.log("onDrawChart-catch exception:", error.message);
      }
    },
    async onDrawChart2(data) {
      try {
        // console.log("onDrawChart2!", data);
        let labels = [];
        let datasets = [];
        this.selection.forEach((x, index) => {
          // console.log("x:", x);
          labels = this.getLabels(data.length > 1 ? data[x.group-1] : data.flat());
          // console.log("labels:", labels);
          if(x.leaf === 0) {
            let color = "red";            
            datasets.push({
              label: x.name,
              data: [],
              backgroundColor: "transparent",
              borderColor: color,
              borderWidth: 1,
              borderDash: [5, 5],
              pointHoverRadius: 3,
              yAxisID: "y",
              pointRadius: 1,
              fill: false
            });            
            this.chartData.datasets = [...datasets];
          } else {
            let color = this._randomRGB();
            let colorTrans = "transparent";
            datasets.push({
              label: x.parent_name ? `${x.parent_name} - ${x.name} (${x.uom})` : `${x.name} (${x.uom})`,
              data: this.getTagData(labels, data.length > 1 ? data[x.group-1] : data.flat(), x.field),
              backgroundColor: color,
              borderColor: color,
              pointBackgroundColor: this.point ? color : colorTrans,
              pointBorderColor: this.point ? color : colorTrans,
              borderWidth: 1,
              //borderDash: [5, 5],
              pointHoverRadius: 3,
              pointHoverBackgroundColor: color,
              yAxisID: "y",
              pointRadius: 1,
              fill: false,
            });
            this.chartData.labels = [...labels];
            this.chartData.datasets = [...datasets];
          }
        });
        this.chartData.labels = [...labels];        
        this.chartData.datasets = [...datasets];
      } catch (error) {
        console.log("onDrawChart-catch exception:", error.message);
      }
    },
    getLabels(data) {
      try {
        const labels = data.map(x => (moment(x.DATETIME, "YYYYMMDDHHmmss").format(`YYYY/MM/DD ${this.curLang.TIME_FORMAT}`)));
        return labels;        
      } catch (error) {
        console.log("getLabels-catch exception:", error.message);        
      }
    },
    getTagData(labels, data, field) {
      try {
        /* console.log("getTagData!");
        console.log("field:", field);
        console.log("labels:", labels); */
        // console.log("data:", data);
        const result = [];
        labels.forEach((dateTime, index) => { 
          if(this.dataGroup === 1) {
            if(dateTime === moment(data[index]["DATETIME"], "YYYYMMDDHHmmss").format(`YYYY/MM/DD ${this.curLang.TIME_FORMAT}`)) {
              // console.log(`${data[index]["DATETIME"]} / ${data[index][field]}`);
              result.push(data[index][field])
            } else {
              result.push(0);
            }
          } else {
            if(data[index]["VALUE"]) {
              if(dateTime === data[index]["DATETIME"] && field === data[index]["FIELD"]) {
                // console.log(`${data[index]["DATETIME"]} / ${data[index]["FIELD"]} / ${data[index]["VALUE"]}`);
                result.push(data[index]["VALUE"])
              } else {
                result.push(0)
              }
            } else {
              const [tagName, posNumCopType] = field.split("-");
              // console.log(`tagName: ${tagName} - posNumCopType: ${posNumCopType} - data[${index}][${tagName}]: ${data[index][tagName]}`);
              // console.log(`${data[index]["DATETIME"]} / ${data[index]["FIELD"]} / ${data[index][tagName]}`);
              if(dateTime === data[index]["DATETIME"] && posNumCopType === data[index]["FIELD"]) {                
                result.push(data[index][tagName] ? data[index][tagName] : 0)
              } else {
                result.push(0)
              }
            }
          }
        });
        return result;
      } catch (error) {
        console.log("getTagData-catch exception:", error.message);
      }
    },
    setSelection() {
      try {
        if(this.tag === "N/A") return;
        findValueDeep(
          this.treeList,
          (value) => {
            if (value.field) {
              if (value.field == this.tag) {
                this.$refs.treeView.selectItem(value)
                this.$refs.treeView.expandItem(value)
              }
            }
          }, {
            childrenPath: "children"
          }
        );
      } catch (error) {
        console.log("setSelection-catch exception:", error.message)
      }
    },
    excludeKeys(obj, keys) {
      return Object.fromEntries(Object.entries(obj).filter(([key]) => !keys.includes(key)));
    }
  }  
}
</script>