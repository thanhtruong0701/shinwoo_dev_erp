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
                <BaseSelect disabled :label="$t('position')" v-model="selected_position" :lstData="position.list" item-text="pn" item-value="pn" />
              </v-col>
              <v-col lg="1" cols="12">
                <BaseSelect :label="$t('period')" v-model="period" :lstData="period_list" item-text="NAME" item-value="CODE" />
              </v-col>
              <v-col lg="3" cols="12">
                <GwFlexBox align="center" justify="space-between">
                  <v-sheet width="25%">
                    <BaseInput :label="$t('step_size')" v-model="chartStepSize"></BaseInput>
                  </v-sheet>
                  <v-spacer></v-spacer>
                  <v-sheet width="25%">
                    <BaseInput number :label="$t('min_chart_value')" v-model="stepValues.min"></BaseInput>
                  </v-sheet>
                  <v-spacer></v-spacer>
                  <v-sheet width="25%">
                    <BaseInput number :label="$t('max_chart_value')" v-model="stepValues.max"></BaseInput>
                  </v-sheet>
                  <v-spacer></v-spacer>
                  <v-sheet width="10%">
                    <BaseButton btn_type="icon" icon_type="reset" :disabled="false" @onclick="resetStepSize" />
                  </v-sheet>
                </GwFlexBox>
              </v-col>
              <v-col lg="1" cols="12">
                <BaseSelect :label="$t('xaxis')" v-model="xaxis" :lstData="xaxis_list" item-text="NAME" item-value="CODE" />
              </v-col>
              <v-col lg="2" cols="12" class="d-flex justify-end align-center flex-wrap">
                <v-sheet width="30%">
                  <span>{{ $t("standard_time") }}</span>
                </v-sheet>
                <v-spacer></v-spacer>
                <v-sheet width="60%">
                  <DxDateBox
                    type="datetime"
                    display-format="MM/dd/yyyy HH:mm"
                    v-model="standard_time"
                    :label="$t('standard_time')"
                    :placeholder="$t('standard_time')"
                    :hint="$t('standard_time')"
                    @valueChanged="changedStandardTime"
                  />
                </v-sheet>
              </v-col>
              <v-col lg="3" cols="12">
                <v-sheet tile color="transparent" class="d-flex justify-between align-center" width="100%" height="100%">
                  <v-btn icon tile color="success" @click="minusPeriod">
                    <v-icon>mdi-skip-previous</v-icon>
                  </v-btn>
                  <DxDateBox
                    type="datetime"
                    :readOnly="true"
                    display-format="MM/dd/yyyy HH:mm"
                    v-model="date_to"
                    :label="$t('date_to')"
                    :placeholder="$t('date_to')"
                    :hint="$t('date_to')"
                    @valueChanged="changedToDate"
                    class="mx-2"
                  />
                  <DxDateBox
                    dense
                    type="datetime"
                    :readOnly="true"
                    display-format="MM/dd/yyyy HH:mm"
                    v-model="date_from"
                    :label="$t('date_from')"
                    :placeholder="$t('date_from')"
                    :hint="$t('date_from')"
                    @valueChanged="changedFromDate"
                    class="mx-2"
                  />
                  <v-btn icon tile color="success" @click="addPeriod">
                    <v-icon>mdi-skip-next</v-icon>
                  </v-btn>
                </v-sheet>
              </v-col>
              <v-col lg="1" cols="12">
                <v-sheet tile color="transparent" class="d-flex justify-between align-center" width="100%" height="100%">
                  <BaseButton btn_type="icon" icon_type="search" :btn_text="$t('search')" :disabled="false" @onclick="onSearch" />
                </v-sheet>
              </v-col>

              <v-col cols="3">
                <v-card outlined :height="gridTagsHeight" class="overflow-x-overlay">
                  <GwTreeView
                    :items="items2"
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
                <v-card outlined tile :height="gridTagsHeight">
                  <v-row dense align="center" justify="center">
                    <v-col cols="12" v-if="isLoading">
                      <v-progress-circular indeterminate color="primary"></v-progress-circular>
                    </v-col>
                    <v-col cols="12">
                      <line-chart
                        :key="key"
                        ref="abctest"
                        :data="data"
                        :legendDisplay="true"
                        :legendPos="'right'"
                        :height="gridTagsHeight"
                        @chartResetZoom="resetZoom"
                        @chartPointClick="onPointClick"
                        @chartDisplayPoint="displayPoint"
                      ></line-chart>
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
import LineChart from "@/components/control/LineChart.vue";

import "chartjs-adapter-date-fns";
import { vi } from "date-fns/locale";
export default {
  name: "chart_dialog",
  components: {
    "line-chart": LineChart,
  },
  props: {
    tag: {
      type: String,
      default: "",
    },
    time: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
    position: {
      type: Object,
      default: () => {
        return {
          list: [],
          selected: ""
        }
      }
    },
    line: String
  },
  data: () => ({
    dialogIsShow: false,
    dynamicHeader: [],
    commonSeriesSettings: {
      argumentField: "date_input",
      type: "line",
    },
    selection: [],
    items2: [],
    full_limit: 0,
    reset: "1",
    key: 0,
    chartHeight: 450,
    valueAxisSettings: {
      label: {
        font: {
          color: "#000",
          size: 14,
        },
        format: {
          allowDecimals: true,
          precision: 100,
        },
      },
    },
    date_from: "",
    date_to: "",
    standard_time: "",
    realData: [],
    dt_from: "",
    dt_to: "",
    // position_list: [],    
    selected_position: "",
    // selected_line: "#1",
    st_time: "",
    xaxis_list: [
      {
        CODE: "minute",
        NAME: "Minutes",
      },
      {
        CODE: "hour",
        NAME: "Hours",
      },
      {
        CODE: "day",
        NAME: "Days",
      },
      {
        CODE: "month",
        NAME: "Months",
      },
    ],
    xaxis: "minute",
    period_list: [
      {
        CODE: "1",
        NAME: "1 hour",
      },
      {
        CODE: "8",
        NAME: "8 hours",
      },
      {
        CODE: "24",
        NAME: "24 hours",
      },
      {
        CODE: "48",
        NAME: "48 hours",
      },
      {
        CODE: "72",
        NAME: "72 hours",
      },
      {
        CODE: "720",
        NAME: "30 days",
      },
    ],
    chartStepSize: null,
    reNewData: [],
    period: "1",
    data: {},
    isLoading: false,
    POP_SMU_EVENT_ROLL: "r1_speed,r3_speed,r5_speed,r7_speed,r9_speed,r11_speed,",
    POP_SMU_YBMSPARAM: "windingspeed",
    POP_SMU_GPINFO: "THROUGHPUT",
    POP_SMU_EVENT_HEATER: "ht2_temp,ht4_temp,ht6_temp,ht8_temp,ht10_temp,ht1_temp,ht3_temp,ht5_temp,ht7_temp,ht9_temp,",
    colors: [],
    stepValues: {
      min: null,
      max: null,
    },
  }),
  async created() {
    //this.changedFromDate(this.date_from);
    // this.changedToDate(this.date_to);
  },
  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
    gridHeight() {
      return this._calculateHeight(this.formContainerHeight, 30);
    },
    gridTagsHeight() {
      return this._calculateHeight(this.formContainerHeight, 50);
    },
    grdDetailHeader() {
      return this.dynamicHeader;
    }
  },
  watch: {
    async dialogIsShow(val) {
      if (val) {
        this.changedFromDate(this.time);
        this.standard_time = this.time;
        // this.data = {};
        this.dynamicHeader = [];
        this.selected_position = this.position.selected;
        await this.getMachineTags();
        this.colors = [];
        // this.period='1';
        // this.xaxis='minute';
        await this.$nextTick();
        await this.onSearch();
      }
    },
    /* async selected_position(val) {
      if(val) {
        await this.getMachineTags();
      }
    }, */
    period() {
      //this.date_from=moment(this.standard_time).add(0, 'hours').toDate();
      this.date_to = moment(this.standard_time)
        .subtract(parseInt(this.period), "hours")
        .toDate();
    },
    standard_time() {
      this.changedFromDate(this.standard_time);

      this.date_to = moment(this.standard_time)
        .subtract(parseInt(this.period), "hours")
        .toDate();
      this.changedToDate(this.date_to);
      this.date_from = moment(this.standard_time).subtract(0, "hours").toDate();
    },
    xaxis() {
      this.reNewData.scales.x.time.unit = this.xaxis;
      this.data = {
        ...this.reNewData,
      };
    },
    chartStepSize() {
      this.reNewData.scales.y.ticks.stepSize = this.chartStepSize;
      this.data = { ...this.reNewData };
    },
    "stepValues.min"(val) {
      this.reNewData.scales.y.min = val;
      this.data = { ...this.reNewData };
    },
    "stepValues.max"(val) {
      this.reNewData.scales.y.max = val;
      this.data = { ...this.reNewData };
    },
  },
  methods: {
    async resetZoom() {
      await this.onDrawChart();
    },
    async displayPoint() {
      this.point = !this.point;
      await this.onDrawChart();
    },
    onSelectionChanged(datas) {
      // console.log("onSelectionChanged:", datas);
      this.selection = [...datas];
    },
    setSelection() {
      try {
        /* console.log("setSelection!");
        console.log(this.items2);
        console.log("tag:", this.tag);
        console.log(this.items2.filter((x) => x.field === this.tag)); */
        let id = this.items2.filter((x) => x.field === this.tag)[0].id;
        let table = this.items2.filter((x) => x.field === this.tag)[0].table;
        let uom = this.items2.filter((x) => x.field === this.tag)[0].uom;
        this.selection = [
          {
            id: id,
            name: this.title,
            field: this.tag,
            table: table,
            uom: uom,
            selected: true,
          }
        ];
      } catch (error) {
        console.log(error);
      }
    },
    addPeriod() {
      this.date_to = moment(this.date_to)
        .add(parseInt(this.period), "hours")
        .toDate();
    },
    minusPeriod() {
      this.date_to = moment(this.date_to)
        .subtract(parseInt(this.period), "hours")
        .toDate();
    },
    async getMachineTags() {
      // console.log("getMachineTags!");
      this.items2 = [];
      const tags_lst = await this._callProcedure(
        "mes_sel_meyn110_select_machine_tag_id",
        [this.selected_position, this.line]
      );
      // console.log("tags_lst", JSON.stringify(tags_lst))
      let uomType = tags_lst.filter((x) => x.item_name === this.title)[0].uom;
      let tableType = tags_lst.filter((x) => x.item_name === this.title)[0].table_name;
      tags_lst.forEach((e, i) => {
        if (e.value != "" && e.value != "N/A" && e.uom == uomType && e.table_name == tableType) {
          let listObj = {
            id: i,
            name: e.item_name,
            field: e.value.replace(/\./g, "_"),
            table: e.table_name,
            selected: this.tag === e.value.replace(/\./g, "_") ? true : false,
            uom: e.uom
          };
          this.items2.push(listObj);
        }
      });
      // console.log("items2:", this.items2);
      // await this.$nextTick();
      this.setSelection();
    },
    async getPagesCount() {
      if ((this.POP_SMU_EVENT_ROLL + this.POP_SMU_YBMSPARAM + this.POP_SMU_GPINFO + this.POP_SMU_EVENT_HEATER).includes(this.tag)) {
      } else {
        const spinning_hiroty_page_count = await this._callProcedure(
          "mes_sel_meyn110_select_spinning_mnhistory",
          [this.dt_to, this.dt_from]
        );
        this.full_limit = spinning_hiroty_page_count[0]["page_count"];
      }
    },
    async onSearch() {
      // console.log("onSearch!");
      this.key = 8;
      this.isLoading = true;
      await this.getPagesCount();
      this.$refs.grdDetailTags.setDataSource([]);

      let POP_SMU_EVENT_ROLL_STR = "";
      let POP_SMU_YBMSPARAM_STR = "";
      let POP_SMU_GPINFO_STR = "";
      let POP_SMU_EVENT_HEATER_STR = "";
      let POP_SCADA_TAG_UPDATE_STR = "";
      this.selection.forEach((e) => {
        switch (e.table) {
          case "POP_SMU_EVENT_ROLL":
            if (POP_SMU_EVENT_ROLL_STR != "") {
              POP_SMU_EVENT_ROLL_STR = POP_SMU_EVENT_ROLL_STR + "," + e.field;
            } else {
              POP_SMU_EVENT_ROLL_STR = e.field;
            }

            break;
          case "POP_SMU_GPINFO":
            if (POP_SMU_GPINFO_STR != "") {
              POP_SMU_GPINFO_STR = POP_SMU_GPINFO_STR + "," + e.field;
            } else {
              POP_SMU_GPINFO_STR = e.field;
            }

            break;
          case "POP_SMU_YBMSPARAM":
            if (POP_SMU_YBMSPARAM_STR != "") {
              POP_SMU_YBMSPARAM_STR = POP_SMU_YBMSPARAM_STR + "," + e.field;
            } else {
              POP_SMU_YBMSPARAM_STR = e.field;
            }
            break;
          case "POP_SMU_EVENT_HEATER":
            if (POP_SMU_EVENT_HEATER_STR != "") {
              POP_SMU_EVENT_HEATER_STR =
                POP_SMU_EVENT_HEATER_STR + "," + e.field;
            } else {
              POP_SMU_EVENT_HEATER_STR = e.field;
            }
            break;
          case "POP_SCADA_TAG_UPDATE":
            if (POP_SCADA_TAG_UPDATE_STR != "") {
              POP_SCADA_TAG_UPDATE_STR =
                POP_SCADA_TAG_UPDATE_STR + "," + e.field;
            } else {
              POP_SCADA_TAG_UPDATE_STR = e.field;
            }
            break;

          default:
            break;
        }
      });
      let fakeData = [
        {
          table: "POP_SMU_EVENT_ROLL",
          string: POP_SMU_EVENT_ROLL_STR,
        },
        {
          table: "POP_SMU_YBMSPARAM",
          string: POP_SMU_YBMSPARAM_STR,
        },
        {
          table: "POP_SMU_GPINFO",
          string: POP_SMU_GPINFO_STR,
        },
        {
          table: "POP_SMU_EVENT_HEATER",
          string: POP_SMU_EVENT_HEATER_STR,
        },
        {
          table: "POP_SCADA_TAG_UPDATE",
          string: POP_SCADA_TAG_UPDATE_STR,
        },
      ];
      let data_param_array = [];
      fakeData.forEach((e, i) => {
        if (e.string != "") {
          data_param_array.push(e);
        }
      });
      try {
        let promises = data_param_array.map(async (e) => {
          await this.setData(e);
        });
        await Promise.all(promises);
      } catch (error) {
        console.log(error);
      }
      this.isLoading = false;
    },
    resetStepSize() {
      this.chartStepSize = null;
      this.stepValues = {
        min: null,
        max: null,
      };
    },
    async setData(e) {
      // console.log("setData:", e);
      switch (e.table) {
        case "POP_SMU_EVENT_ROLL":
          this.realData = await this._callProcedure(
            "mes_sel_meyn110_select_spinning_mnhistory3",
            [
              "0",
              this.full_limit,
              e.string,
              "POP_SMU_EVENT_ROLL",
              this.selected_position.charAt(this.selected_position.length - 1),
              this.dt_to,
              this.dt_from,
            ]
          );
          break;
        case "POP_SMU_YBMSPARAM":
          this.realData = await this._callProcedure(
            "mes_sel_meyn110_select_spinning_mnhistory3",
            [
              "0",
              this.full_limit,
              e.string,
              "POP_SMU_YBMSPARAM",
              this.selected_position.charAt(this.selected_position.length - 1),
              this.dt_to,
              this.dt_from,
            ]
          );
          break;
        case "POP_SMU_EVENT_HEATER":
          this.realData = await this._callProcedure(
            "mes_sel_meyn110_select_spinning_mnhistory3",
            [
              "0",
              this.full_limit,
              e.string,
              "POP_SMU_EVENT_HEATER",
              this.selected_position.charAt(this.selected_position.length - 1),
              this.dt_to,
              this.dt_from,
            ]
          );
          break;
        case "POP_SMU_GPINFO":
          this.realData = await this._callProcedure(
            "mes_sel_meyn110_select_spinning_mnhistory3",
            [
              "0",
              this.full_limit,
              e.string,
              "POP_SMU_GPINFO",
              this.selected_position.charAt(this.selected_position.length - 1),
              this.dt_to,
              this.dt_from,
            ]
          );
          break;
        case "POP_SCADA_TAG_UPDATE":
          this.realData = await this._callProcedure(
            "mes_sel_meyn110_select_spinning_mnhistory2",
            ["0", this.full_limit, e.string, this.dt_to, this.dt_from]
          );
          break;
        default:
          // console.log("wrong table");
          break;
      }
      // console.log(this.realData)
      await this.$nextTick();
      await this.onDrawChart();
    },
    async onDrawChart() {
      // console.log("onDrawChart!", this.realData);
      let data = JSON.parse(JSON.stringify(this.realData));
      let datasets = [];
      let labels = [];
      data.forEach((e) => {
        let date = this.getDate(e.crt_dt).getTime();
        labels.push(date);
      });
      this.selection.forEach((x) => {
        let tagData = [];
        data.forEach((e) => {
          if (typeof e[x.field] == "string") {
            tagData.push(parseFloat(e[x.field].replace(/["']/g, "")));
          } else {
            tagData.push(parseFloat(e[x.field]));
          }
        });
        let color = this.randomRGB();
        let color_trans = "transparent";
        datasets.push({
          label: x.name + ` (${x.uom})`,
          data: tagData,
          // hidden: hiddenYn,
          //spanGaps: true,
          backgroundColor: color,
          borderColor: color,
          pointBackgroundColor: this.point ? color : color_trans,
          pointBorderColor: this.point ? color : color_trans,
          borderWidth: 0.8,
          //borderDash: [5, 5],
          pointHoverRadius: 3,
          pointHoverBackgroundColor: color,
          yAxisID: "y",
          pointRadius: 1,
          fill: false,
        });
      });

      let finalObj = {};
      finalObj.labels = labels; //gán data cho trục X
      finalObj.datasets = datasets; //gán data cho chart để vẽ
      finalObj.labelsFunc = {
        label: function (tooltipItem, chart) {
          var datasetLabel =
            chart.datasets[tooltipItem.datasetIndex].label || "";
          return (
            datasetLabel + " : " + parseInt(tooltipItem.value).toLocaleString()
          );
        },
      };

      finalObj.title = "";
      finalObj.scales = {
        x: {
          type: "time",
          time: {
            tooltipFormat: "dd-MM-yyyy HH:mm:ss",
            unit: this.xaxis,
            //unitStepSize: 1,
            displayFormats: {
              millisecond: "MM-YYYY",
              second: "dd-MM-yyyy HH:mm:ss",
              minute: "dd-MM-yyyy HH:mm",
              hour: "dd-MM-yyyy HH",
              day: "dd-MM-yyyy",
              week: "MM-YYYY",
              month: "MM-yyyy",
              quarter: "MM-YYYY",
              year: "yyyy",
            },
          },
          adapters: {
            date: {
              locale: vi,
            },
          },
        },
        y: {
          title: {
            display: false,
            // text: "Value",
          },
          position: "left",
          type: "linear",
          scaleLabel: {
            display: true,
            labelString: "",
            beginAtZero: true,
          },
          // min: this.stepValues.min ? this.stepValues.min : "",
          // max: this.stepValues.max ? this.stepValues.max: "",
          ticks: {
            stepSize: this.chartStepSize,
            callback: function (value, index, values) {
              return value.toLocaleString();
            },
          },
        },
      };
      this.reNewData = finalObj;
      this.data = { ...finalObj };
    },
    getDate(x) {
      const dateString = x;
      var year = dateString.substring(0, 4);
      var month = dateString.substring(4, 6);
      var day = dateString.substring(6, 8);
      var hour = dateString.substring(8, 10);
      var minute = dateString.substring(10, 12);

      var date = new Date(year, month - 1, day, hour, minute);
      return date;
    },
    randomRGB() {
      //let resultStr=`rgb(${Math.floor(Math.random() * 200)} ${Math.floor(Math.random() * 200)} ${Math.floor(Math.random() * 200)} )`

      let resultStr = "";
      let check = false;
      let RGB = "";
      if (this.colors.length > 0) {
        do {
          RGB = {
            R: Math.floor(Math.random() * 255),
            G: Math.floor(Math.random() * 200),
            B: Math.floor(Math.random() * 200),
          };
          this.colors.forEach((x) => {
            if (RGB.R != x.R && RGB.G != x.G && RGB.B != x.B) {
              // if(RGB.R>=x.R+10 && RGB.R<=x.R-10){
              //  if(RGB.G>=x.G+10 && RGB.G<=x.G-10){
              //    if(RGB.B>=x.B+10 && RGB.B<=x.B-10){
              check = true;
              //     }
              //  }
              // }
            }
          });
        } while (!check);

        if (check) {
          this.colors.push(RGB);
          resultStr = `rgb(${RGB.R} ${RGB.G} ${RGB.B})`;
        }
      } else {
        let RGB = {
          R: 255,
          G: 0,
          B: 0,
        };
        this.colors.push(RGB);
        resultStr = `rgb(255 0 0)`;
      }

      return resultStr;
    },
    onPointClick(point) {
      // console.log(point);
      // this.$refs.grdDetailTags.setDataSource([])
      point.date_input = moment(new Date(point.date_input)).format(
        "YYYY-MM-DD HH:mm"
      );
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
        //
      }
      // console.log(point)
      this.$refs.grdDetailTags.addRow(point);
    },
    changedFromDate(obj) {
      //console.log("a", obj);
      let date_from = "";
      if (obj.value == undefined) {
        date_from = moment(obj).format("YYYYMMDDHHmmss");
      } else {
        date_from = moment(obj.value).format("YYYYMMDDHHmmss");
      }

      this.dt_from = date_from;
    },
    changedToDate(obj) {
      // console.log("b", obj);
      let date_to = "";
      if (obj.value == undefined) {
        date_to = moment(obj).format("YYYYMMDDHHmmss");
      } else {
        date_to = moment(obj.value).format("YYYYMMDDHHmmss");
      }
      this.dt_to = date_to;
    },
    changedStandardTime(obj) {
      let standardtime = "";
      if (obj.value == undefined) {
        standardtime = moment(obj).format("YYYYMMDDHHmmss");
      } else {
        standardtime = moment(obj.value).format("YYYYMMDDHHmmss");
      }
      this.st_time = standardtime;
    }
  },
};
</script>

<style>
canvas#line-chart {
  background-color: #f9f9f9 !important;
}
</style>
